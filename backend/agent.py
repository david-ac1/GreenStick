from typing import Dict, Any, List, Optional
from elasticsearch import Elasticsearch
from datetime import datetime

class GreenStickAgent:
    def __init__(self, es_cloud_id: Optional[str] = None, es_api_key: Optional[str] = None, openai_api_key: Optional[str] = None, es_endpoint: Optional[str] = None):
        self.es_client = None
        if (es_cloud_id or es_endpoint) and es_api_key:
            try:
                if es_cloud_id:
                    self.es_client = Elasticsearch(
                        cloud_id=es_cloud_id,
                        api_key=es_api_key
                    )
                else:
                    self.es_client = Elasticsearch(
                        es_endpoint,
                        api_key=es_api_key
                    )
                print("Connected to Elasticsearch")
            except Exception as e:
                print(f"Failed to connect to Elasticsearch: {e}")
        else:
            print("Warning: Elasticsearch credentials not provided.")

    async def analyze_incident(self, incident_id: str) -> Dict[str, Any]:
        """
        Main workflow: Detect -> Search -> Correlate -> Plan
        """
        # 1. Fetch Incident Data (from our simulated logs)
        # In a real system, 'incident_id' might be a specific alert ID. 
        # Here we'll treat it as a search term or trace ID.
        incident_data = self._fetch_recent_errors(incident_id)
        
        if not incident_data:
            return {"error": "No recent errors found matching criteria"}

        # 2. Search Historical Context
        history = self._search_history(incident_data[0].get("message", ""))
        
        # 3. Correlate Events (ES|QL)
        correlations = self._correlate_events(incident_id)
        
        # 4. Generate Remediation Plan (Mock LLM for now, can integrate real OpenAI)
        plan = self._generate_plan(incident_data, history, correlations)
        
        return {
            "incident_id": incident_id,
            "timestamp": datetime.now().isoformat(),
            "detected_anomalies": incident_data,
            "historical_context": history,
            "correlations": correlations,
            "analysis": {
                "root_cause_probability": 0.85, 
                "summary": "High likelihood of database connection pool exhaustion based on historical patterns."
            },
            "plan": plan
        }

    def _fetch_recent_errors(self, query_term: str) -> List[Dict[str, Any]]:
        """
        Searches 'greenstick-logs' for recent errors.
        """
        if not self.es_client:
            return []
            
        try:
            # Simple match query for errors
            response = self.es_client.search(index="greenstick-logs", body={
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"level": "ERROR"}},
                            {"multi_match": {
                                "query": query_term,
                                "fields": ["message", "service", "trace_id"]
                            }}
                        ]
                    }
                },
                "size": 5,
                "sort": [{"@timestamp": {"order": "desc"}}]
            })
            
            hits = response.get("hits", {}).get("hits", [])
            return [hit["_source"] for hit in hits]
            
        except Exception as e:
            print(f"Error fetching logs: {e}")
            return []

    def _search_history(self, error_message: str) -> List[Dict[str, Any]]:
        """
        Searches 'greenstick-incidents' for similar past issues.
        Currently using BM25 (text match). Vector search to be added.
        """
        if not self.es_client:
            return []

        try:
            response = self.es_client.search(index="greenstick-incidents", body={
                "query": {
                    "match": {
                        "description": error_message
                    }
                },
                "size": 3
            })
            
            hits = response.get("hits", {}).get("hits", [])
            return [hit["_source"] for hit in hits]
            
        except Exception as e:
            print(f"Error searching history: {e}")
            return []

    def _correlate_events(self, incident_id: str) -> List[Dict[str, Any]]:
        """
        Mock ES|QL correlation. 
        Real implementation would use es_client.esql.query(...)
        """
        # Placeholder for ES|QL logic
        return [
            {"service": "checkout-service", "metric": "cpu_usage", "status": "critical"},
            {"service": "postgres-db", "metric": "active_connections", "status": "maxed_out"}
        ]

    def _generate_plan(self, incident: List[Dict[str, Any]], history: List[Dict[str, Any]], correlations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Constructs a remediation plan based on the inputs.
        """
        # Simple heuristic based on historical match
        if history:
            top_match = history[0]
            return {
                "action": "AUTOMATED_REMEDIATION",
                "confidence": 0.92,
                "steps": [
                    f"Identified similar incident: {top_match.get('incident_id')}",
                    f"Suggested resolution: {top_match.get('resolution')}",
                    "Applying config change to connection pool..."
                ]
            }
        
        return {
            "action": "MANUAL_INVESTIGATION",
            "confidence": 0.45,
            "steps": ["Escalate to on-call engineer", "Check dashboard for metrics"]
        }
