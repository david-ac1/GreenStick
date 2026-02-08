from typing import Dict, Any, List, Optional
from elasticsearch import Elasticsearch
from datetime import datetime
import google.generativeai as genai
import os
import json

class GreenStickAgent:
    def __init__(self, es_cloud_id: Optional[str] = None, es_api_key: Optional[str] = None, gemini_api_key: Optional[str] = None, es_endpoint: Optional[str] = None):
        self.es_client = None
        
        # Initialize Elasticsearch
        if (es_cloud_id or es_endpoint) and es_api_key:
            try:
                if es_cloud_id:
                    self.es_client = Elasticsearch(
                        cloud_id=es_cloud_id,
                        api_key=es_api_key
                    )
                else:
                    self.es_client = Elasticsearch(
                        hosts=[es_endpoint],
                        api_key=es_api_key
                    )
                print("Connected to Elasticsearch")
            except Exception as e:
                print(f"Failed to connect to Elasticsearch: {e}")
        else:
            print("Warning: Elasticsearch credentials not provided.")

        # Initialize Gemini
        if gemini_api_key:
            genai.configure(api_key=gemini_api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            print("Connected to Gemini")
        else:
            self.model = None
            print("Warning: Gemini API key not provided.")

    async def analyze_incident(self, incident_id: str) -> Dict[str, Any]:
        """
        Main workflow: Detect -> Search -> Correlate -> Plan -> Execute
        """
        # 1. Fetch Incident Data
        incident_data = self._fetch_recent_errors(incident_id)
        
        if not incident_data:
            return {"error": "No recent errors found matching criteria"}

        # 2. Search Historical Context
        history = self._search_history(incident_data[0].get("message", ""))
        
        # 3. Correlate Events (ES|QL)
        correlations = self._correlate_events(incident_id)
        
        # 4. Generate Remediation Plan (Gemini)
        plan = await self._generate_plan(incident_data, history, correlations)
        
        # 5. Execute Action (if confidence is high enough)
        execution_result = await self._execute_action(plan)
        
        # 6. Log to Audit Trail
        self._log_audit_entry(
            trace_id=incident_id,
            action_type=plan.get("action", "ANALYSIS"),
            description=plan.get("reasoning", "Analysis completed"),
            confidence=plan.get("confidence", 0.0),
            metadata={
                "correlations_count": len(correlations) if correlations else 0,
                "historical_matches": len(history) if history else 0,
            }
        )
        
        return {
            "incident_id": incident_id,
            "timestamp": datetime.now().isoformat(),
            "detected_anomalies": incident_data,
            "historical_context": history,
            "correlations": correlations,
            "analysis": {
                "root_cause_probability": plan.get("confidence", 0.0), 
                "summary": plan.get("reasoning", "Analysis pending.")
            },
            "plan": plan,
            "execution": execution_result
        }
    
    def _log_audit_entry(self, trace_id: str, action_type: str, description: str, confidence: float, metadata: dict = None):
        """Log an action to the audit trail in Elasticsearch."""
        if not self.es_client:
            return
        
        try:
            # Create index if not exists
            if not self.es_client.indices.exists(index="greenstick-audit"):
                self.es_client.indices.create(index="greenstick-audit", body={
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
                "@timestamp": datetime.now().isoformat() + "Z",
                "trace_id": trace_id,
                "action_type": action_type,
                "description": description,
                "confidence": confidence,
                "status": "pending",
                "metadata": metadata or {}
            }
            
            self.es_client.index(index="greenstick-audit", document=doc, refresh=True)
        except Exception as e:
            print(f"Failed to log audit entry: {e}")

    def _fetch_recent_errors(self, query_term: str) -> List[Dict[str, Any]]:
        """Fetch recent errors, trying exact trace_id match first, then falling back to recent errors."""
        if not self.es_client:
            print("No Elasticsearch client available")
            return []
            
        try:
            # First try exact trace_id match
            response = self.es_client.search(index="greenstick-logs", body={
                "query": {
                    "bool": {
                        "should": [
                            {"term": {"trace_id": query_term}},
                            {"match": {"trace_id": query_term}}
                        ],
                        "minimum_should_match": 1
                    }
                },
                "size": 10,
                "sort": [{"@timestamp": {"order": "desc"}}]
            })
            
            hits = response.get("hits", {}).get("hits", [])
            if hits:
                print(f"Found {len(hits)} logs matching trace_id: {query_term}")
                return [hit["_source"] for hit in hits]
            
            # If no exact match, get recent ERROR logs
            print(f"No exact match for {query_term}, fetching recent errors...")
            response = self.es_client.search(index="greenstick-logs", body={
                "query": {
                    "match": {"level": "ERROR"}
                },
                "size": 10,
                "sort": [{"@timestamp": {"order": "desc"}}]
            })
            
            hits = response.get("hits", {}).get("hits", [])
            if hits:
                print(f"Found {len(hits)} recent ERROR logs")
                return [hit["_source"] for hit in hits]
            
            # Final fallback: get any recent logs
            print("No ERROR logs found, fetching any recent logs...")
            response = self.es_client.search(index="greenstick-logs", body={
                "query": {"match_all": {}},
                "size": 10,
                "sort": [{"@timestamp": {"order": "desc"}}]
            })
            
            hits = response.get("hits", {}).get("hits", [])
            print(f"Found {len(hits)} total logs")
            return [hit["_source"] for hit in hits]
            
        except Exception as e:
            print(f"Error fetching logs: {e}")
            return []

    def _search_history(self, error_message: str) -> List[Dict[str, Any]]:
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
        if not self.es_client:
            return []

        query = """
        FROM "greenstick-logs"
        | STATS count = count(*) BY service, level
        | SORT count DESC
        | LIMIT 10
        """
        return self._execute_esql(query)

    def _execute_esql(self, query: str) -> List[Dict[str, Any]]:
        """Execute an ES|QL query and return results as list of dicts"""
        if not self.es_client:
            return []
        
        try:
            if hasattr(self.es_client, 'esql'):
                resp = self.es_client.esql.query(query=query)
                columns = [col['name'] for col in resp.get('columns', [])]
                results = []
                for row in resp.get('values', []):
                    results.append(dict(zip(columns, row)))
                return results
            else:
                print("ES|QL not available on this Elasticsearch client")
                return []
        except Exception as e:
            print(f"ES|QL Query failed: {e}")
            return []

    def esql_error_trends(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Analyze error trends over time using ES|QL"""
        query = f"""
        FROM "greenstick-logs"
        | WHERE level == "ERROR"
        | EVAL hour = DATE_TRUNC({hours} hours, @timestamp)
        | STATS error_count = COUNT(*) BY hour
        | SORT hour DESC
        | LIMIT {hours}
        """
        return self._execute_esql(query)

    def esql_service_health(self) -> List[Dict[str, Any]]:
        """Get service health summary using ES|QL"""
        query = """
        FROM "greenstick-logs"
        | WHERE @timestamp > NOW() - 1 hour
        | STATS 
            total = COUNT(*),
            errors = COUNT(*) WHERE level == "ERROR",
            warnings = COUNT(*) WHERE level == "WARN"
          BY service
        | EVAL error_rate = ROUND(errors * 100.0 / total, 2)
        | SORT error_rate DESC
        """
        return self._execute_esql(query)

    def esql_trace_analysis(self, trace_id: str) -> List[Dict[str, Any]]:
        """Trace a request through services using ES|QL"""
        query = f"""
        FROM "greenstick-logs"
        | WHERE trace_id == "{trace_id}"
        | SORT @timestamp ASC
        | KEEP @timestamp, service, level, message
        """
        return self._execute_esql(query)

    def esql_anomaly_detection(self) -> List[Dict[str, Any]]:
        """Detect anomalies by finding services with unusual error rates using ES|QL"""
        query = """
        FROM "greenstick-logs"
        | WHERE @timestamp > NOW() - 15 minutes
        | STATS 
            error_count = COUNT(*) WHERE level == "ERROR",
            total_count = COUNT(*)
          BY service
        | WHERE error_count > 0
        | EVAL error_rate = ROUND(error_count * 100.0 / total_count, 2)
        | WHERE error_rate > 10
        | SORT error_rate DESC
        """
        return self._execute_esql(query)

    async def _generate_plan(self, incident: List[Dict[str, Any]], history: List[Dict[str, Any]], correlations: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not self.model:
             return {
                "action": "MANUAL_INVESTIGATION",
                "confidence": 0.0,
                "reasoning": "Gemini API key not configured.",
                "steps": ["Check backend configuration"]
            }

        prompt = f"""
        You are a Site Reliability Engineer Agent.
        
        Context:
        1. Current Anomalies: {json.dumps(incident)}
        2. Historical Incidents: {json.dumps(history)}
        3. Correlations: {json.dumps(correlations)}
        
        Task:
        Analyze the situation and recommend a remediation plan.
        
        Output JSON format:
        {{
            "action": "ROLLBACK" | "SCALE_UP" | "RESTART_SERVICE" | "CREATE_TICKET" | "MANUAL_INVESTIGATION",
            "confidence": 0.0-1.0,
            "reasoning": "Brief explanation",
            "steps": ["step 1", "step 2"]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            return json.loads(text)
        except Exception as e:
            print(f"Gemini generation failed: {e}")
            return {
                "action": "ERROR_GENERATING_PLAN",
                "confidence": 0.0,
                "reasoning": f"LLM Error: {str(e)}",
                "steps": ["Manual intervention required"]
            }

    async def _execute_action(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the recommended action.
        For now, this is a mock executor that logs the action.
        """
        action = plan.get("action", "UNKNOWN")
        confidence = plan.get("confidence", 0.0)
        
        # Require human approval for low confidence or destructive actions
        requires_approval = confidence < 0.8 or action in ["ROLLBACK", "RESTART_SERVICE"]
        
        if requires_approval:
            return {
                "status": "PENDING_APPROVAL",
                "message": f"Action '{action}' requires human approval (confidence: {confidence:.2f})",
                "approval_required": True
            }
        
        # Mock execution
        return {
            "status": "EXECUTED",
            "message": f"Action '{action}' executed successfully.",
            "approval_required": False,
            "timestamp": datetime.now().isoformat()
        }
