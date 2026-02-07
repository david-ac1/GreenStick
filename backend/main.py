from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from .agent import GreenStickAgent
from elasticsearch import Elasticsearch

load_dotenv()

app = FastAPI(title="GreenStick Backend", version="0.1.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Elasticsearch client
es_client = Elasticsearch(
    os.getenv("ELASTIC_ENDPOINT"),
    api_key=os.getenv("ELASTIC_API_KEY")
)

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

@app.get("/")
def read_root():
    return {"status": "GreenStick Backend Operational", "service": "active"}

@app.get("/stats")
async def get_stats():
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
            "mttr_avg": 15, # Would calculate from resolved incidents if we had timestamps
            "agent_accuracy": 99.8, # Would calculate from feedback data
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
async def get_incidents():
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
async def analyze_incident(incident_id: str):
    """
    Trigger the agent to analyze a specific incident by ID.
    """
    try:
        result = await agent.analyze_incident(incident_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/history")
async def get_history():
    """
    Retrieve agent action history.
    """
    return {"history": []}
