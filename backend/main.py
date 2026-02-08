from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from pathlib import Path
from dotenv import load_dotenv
from .agent import GreenStickAgent
from elasticsearch import Elasticsearch

# Load .env from the backend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Debug: Print loaded values
print(f"ELASTIC_ENDPOINT: {os.getenv('ELASTIC_ENDPOINT', 'NOT SET')[:30]}...")
print(f"ELASTIC_API_KEY: {'SET' if os.getenv('ELASTIC_API_KEY') else 'NOT SET'}")

app = FastAPI(title="GreenStick Backend", version="0.1.0")

# API Key for authentication
GREENSTICK_API_KEY = os.getenv("GREENSTICK_API_KEY", "")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Elasticsearch client
es_endpoint = os.getenv("ELASTIC_ENDPOINT")
es_api_key = os.getenv("ELASTIC_API_KEY")

if es_endpoint and es_api_key:
    es_client = Elasticsearch(
        hosts=[es_endpoint],
        api_key=es_api_key
    )
else:
    es_client = None
    print("Warning: Elasticsearch not configured")

# Initialize Agent
agent = GreenStickAgent(
    es_cloud_id=os.getenv("ELASTIC_CLOUD_ID"),
    es_api_key=os.getenv("ELASTIC_API_KEY"),
    es_endpoint=os.getenv("ELASTIC_ENDPOINT"),
    gemini_api_key=os.getenv("GEMINI_API_KEY")
)

class IncidentQuery(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None

# API Key dependency
async def verify_api_key(authorization: Optional[str] = Header(None)):
    """Verify the API key from Authorization header."""
    if not GREENSTICK_API_KEY:
        # No key configured, allow access (development mode)
        return True
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    # Expect "Bearer <key>" format
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization format. Use: Bearer <api_key>")
    
    if parts[1] != GREENSTICK_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return True

@app.get("/")
def read_root():
    return {"status": "GreenStick Backend Operational", "service": "active"}

@app.post("/auth/verify")
async def verify_auth(authorization: Optional[str] = Header(None)):
    """Verify API key and return auth status."""
    try:
        await verify_api_key(authorization)
        return {"authenticated": True, "user": "OPERATOR"}
    except HTTPException:
        raise

@app.get("/stats")
async def get_stats(authorized: bool = Depends(verify_api_key)):
    """
    Get dashboard statistics from Elasticsearch.
    """
    try:
        # Count active incidents (ERROR level logs)
        error_count = es_client.count(index="greenstick-logs", body={
            "query": {"match": {"level": "ERROR"}}
        })
        
        # Count all anomalies (all logs)
        total_logs = es_client.count(index="greenstick-logs")
        
        # Count historical incidents
        incidents_count = es_client.count(index="greenstick-incidents")
        
        return {
            "active_incidents": error_count.get("count", 0),
            "anomaly_flux": total_logs.get("count", 0),
            "mttr_avg": 15,
            "agent_accuracy": 99.8,
            "historical_incidents": incidents_count.get("count", 0)
        }
    except Exception as e:
        return {
            "active_incidents": 0,
            "anomaly_flux": 0,
            "mttr_avg": 0,
            "agent_accuracy": 0,
            "error": str(e)
        }

@app.get("/incidents")
async def get_incidents(authorized: bool = Depends(verify_api_key)):
    """
    Get recent incidents/logs from Elasticsearch.
    """
    try:
        response = es_client.search(index="greenstick-logs", body={
            "query": {"match_all": {}},
            "size": 20,
            "sort": [{"@timestamp": {"order": "desc"}}]
        })
        
        hits = response.get("hits", {}).get("hits", [])
        incidents = []
        for hit in hits:
            source = hit["_source"]
            incidents.append({
                "id": hit["_id"],
                "timestamp": source.get("@timestamp", ""),
                "service": source.get("service", "unknown"),
                "level": source.get("level", "INFO"),
                "message": source.get("message", ""),
                "trace_id": source.get("trace_id", "")
            })
        
        return {
            "total": response.get("hits", {}).get("total", {}).get("value", 0),
            "incidents": incidents
        }
    except Exception as e:
        return {"total": 0, "incidents": [], "error": str(e)}

@app.post("/agent/analyze")
async def analyze_incident(incident_id: str, authorized: bool = Depends(verify_api_key)):
    """
    Trigger the agent to analyze a specific incident by ID.
    """
    try:
        result = await agent.analyze_incident(incident_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/history")
async def get_history(authorized: bool = Depends(verify_api_key)):
    """
    Retrieve agent action history.
    """
    return {"history": []}

class NewIncident(BaseModel):
    service: str
    level: str = "ERROR"
    message: str
    trace_id: Optional[str] = None

@app.post("/incidents")
async def report_incident(incident: NewIncident, authorized: bool = Depends(verify_api_key)):
    """
    Report a new incident/log entry.
    """
    if not es_client:
        raise HTTPException(status_code=503, detail="Elasticsearch not configured")
    
    try:
        from datetime import datetime
        import random
        
        trace_id = incident.trace_id or f"trace-{random.choice(['hq', 'us', 'eu'])}-{random.randint(100, 999)}"
        
        doc = {
            "@timestamp": datetime.utcnow().isoformat() + "Z",
            "service": incident.service,
            "level": incident.level,
            "message": incident.message,
            "trace_id": trace_id
        }
        
        result = es_client.index(index="greenstick-logs", document=doc, refresh=True)
        
        return {
            "success": True,
            "id": result["_id"],
            "trace_id": trace_id,
            "message": f"Incident reported for {incident.service}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AuditLogEntry(BaseModel):
    trace_id: str
    action_type: str
    description: str
    confidence: float = 0.0
    status: str = "pending"
    metadata: Optional[Dict[str, Any]] = None

@app.get("/audit-logs")
async def get_audit_logs(authorized: bool = Depends(verify_api_key)):
    """
    Get agent audit logs from Elasticsearch.
    """
    if not es_client:
        return {"total": 0, "logs": [], "error": "Elasticsearch not configured"}
    
    try:
        # Check if index exists, create if not
        if not es_client.indices.exists(index="greenstick-audit"):
            return {"total": 0, "logs": []}
        
        response = es_client.search(index="greenstick-audit", body={
            "query": {"match_all": {}},
            "size": 50,
            "sort": [{"@timestamp": {"order": "desc"}}]
        })
        
        hits = response.get("hits", {}).get("hits", [])
        logs = []
        for hit in hits:
            source = hit["_source"]
            logs.append({
                "id": hit["_id"],
                "timestamp": source.get("@timestamp", ""),
                "trace_id": source.get("trace_id", ""),
                "action_type": source.get("action_type", "UNKNOWN"),
                "description": source.get("description", ""),
                "confidence": source.get("confidence", 0),
                "status": source.get("status", "pending"),
                "metadata": source.get("metadata", {})
            })
        
        return {
            "total": response.get("hits", {}).get("total", {}).get("value", 0),
            "logs": logs
        }
    except Exception as e:
        return {"total": 0, "logs": [], "error": str(e)}

@app.post("/audit-logs")
async def create_audit_log(entry: AuditLogEntry, authorized: bool = Depends(verify_api_key)):
    """
    Create a new audit log entry.
    """
    if not es_client:
        raise HTTPException(status_code=503, detail="Elasticsearch not configured")
    
    try:
        from datetime import datetime
        
        # Create index if not exists
        if not es_client.indices.exists(index="greenstick-audit"):
            es_client.indices.create(index="greenstick-audit", body={
                "mappings": {
                    "properties": {
                        "@timestamp": {"type": "date"},
                        "trace_id": {"type": "keyword"},
                        "action_type": {"type": "keyword"},
                        "description": {"type": "text"},
                        "confidence": {"type": "float"},
                        "status": {"type": "keyword"},
                        "metadata": {"type": "object", "enabled": True}
                    }
                }
            })
        
        doc = {
            "@timestamp": datetime.utcnow().isoformat() + "Z",
            "trace_id": entry.trace_id,
            "action_type": entry.action_type,
            "description": entry.description,
            "confidence": entry.confidence,
            "status": entry.status,
            "metadata": entry.metadata or {}
        }
        
        result = es_client.index(index="greenstick-audit", document=doc, refresh=True)
        
        return {
            "success": True,
            "id": result["_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UpdateAuditStatus(BaseModel):
    status: str  # "approved" or "rejected"

@app.patch("/audit-logs/{log_id}")
async def update_audit_log_status(log_id: str, update: UpdateAuditStatus, authorized: bool = Depends(verify_api_key)):
    """
    Update the status of an audit log entry (approve/reject).
    """
    if not es_client:
        raise HTTPException(status_code=503, detail="Elasticsearch not configured")
    
    if update.status not in ["approved", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Status must be 'approved', 'rejected', or 'pending'")
    
    try:
        es_client.update(
            index="greenstick-audit",
            id=log_id,
            body={"doc": {"status": update.status}},
            refresh=True
        )
        
        return {
            "success": True,
            "id": log_id,
            "status": update.status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



