from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from .agent import GreenStickAgent

load_dotenv()

app = FastAPI(title="GreenStick Backend", version="0.1.0")

# Initialize Agent
# In production, we might want to initialize this lazily or with a dependency injector
agent = GreenStickAgent(
    es_cloud_id=os.getenv("ELASTIC_CLOUD_ID"),
    es_api_key=os.getenv("ELASTIC_API_KEY"),
    es_endpoint=os.getenv("ELASTIC_ENDPOINT"),
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

class IncidentQuery(BaseModel):
    query: string
    filters: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {"status": "GreenStick Backend Operational", "service": "active"}

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
