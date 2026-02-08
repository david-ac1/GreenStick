"""
Anomaly Scanner - Background process that monitors Elasticsearch logs
and automatically triggers the GreenStick agent when anomalies are detected.
"""
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from elasticsearch import Elasticsearch
import os

# Detection thresholds
ERROR_RATE_THRESHOLD = 3  # errors in time window triggers alert
REPEAT_FAILURE_THRESHOLD = 2  # same error repeated triggers alert
SCAN_WINDOW_MINUTES = 1440  # 24 hours - expanded for demo purposes
CRITICAL_KEYWORDS = ['OOM', 'FATAL', 'crash', 'killed', 'OutOfMemory', 'connection refused', 'timeout']


class AnomalyScanner:
    """
    Monitors Elasticsearch logs for anomalies and triggers agent analysis.
    """
    
    def __init__(self, es_client: Optional[Elasticsearch], agent):
        self.es_client = es_client
        self.agent = agent
        self.is_scanning = False
        self.last_scan_time = None
        self.scan_results = []
        self.status = "idle"
        
    def get_status(self) -> Dict[str, Any]:
        """Return current scanner status."""
        return {
            "status": self.status,
            "is_scanning": self.is_scanning,
            "last_scan_time": self.last_scan_time.isoformat() if self.last_scan_time else None,
            "recent_detections": len(self.scan_results)
        }
    
    async def scan_for_anomalies(self) -> Dict[str, Any]:
        """
        Scan recent logs for anomalies and trigger agent if found.
        """
        if not self.es_client:
            return {"error": "Elasticsearch not configured", "anomalies": []}
        
        self.is_scanning = True
        self.status = "scanning"
        
        try:
            # 1. Fetch recent logs
            print(f"[Scanner] Starting scan...")
            logs = self._fetch_recent_logs()
            print(f"[Scanner] Found {len(logs)} logs in time window")
            
            if not logs:
                self.status = "idle"
                self.is_scanning = False
                self.last_scan_time = datetime.utcnow()
                print("[Scanner] No logs found, returning early")
                return {"anomalies": [], "message": "No recent logs to analyze"}
            
            # 2. Detect anomalies
            anomalies = self._detect_anomalies(logs)
            print(f"[Scanner] Detected {len(anomalies)} anomalies")
            
            if not anomalies:
                self.status = "idle"
                self.is_scanning = False
                self.last_scan_time = datetime.utcnow()
                print("[Scanner] No anomalies detected")
                return {"anomalies": [], "message": "No anomalies detected", "logs_scanned": len(logs)}
            
            # 3. Trigger agent for each anomaly
            self.status = "analyzing"
            results = []
            
            for anomaly in anomalies:
                try:
                    # Use the trace_id or generate one from the anomaly
                    trace_id = anomaly.get("trace_id", f"auto-{datetime.utcnow().strftime('%H%M%S')}")
                    analysis = await self.agent.analyze_incident(trace_id)
                    results.append({
                        "anomaly": anomaly,
                        "analysis": analysis
                    })
                except Exception as e:
                    results.append({
                        "anomaly": anomaly,
                        "error": str(e)
                    })
            
            self.scan_results = results
            self.last_scan_time = datetime.utcnow()
            self.status = "idle"
            self.is_scanning = False
            
            return {
                "anomalies_detected": len(anomalies),
                "analyses_completed": len(results),
                "results": results
            }
            
        except Exception as e:
            self.status = "error"
            self.is_scanning = False
            return {"error": str(e), "anomalies": []}
    
    def _fetch_recent_logs(self) -> List[Dict[str, Any]]:
        """Fetch logs from the last N minutes."""
        if not self.es_client:
            return []
        
        try:
            # Check if index exists
            if not self.es_client.indices.exists(index="greenstick-logs"):
                return []
            
            now = datetime.utcnow()
            time_threshold = now - timedelta(minutes=SCAN_WINDOW_MINUTES)
            
            response = self.es_client.search(index="greenstick-logs", body={
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"@timestamp": {"gte": time_threshold.isoformat() + "Z"}}}
                        ]
                    }
                },
                "size": 100,
                "sort": [{"@timestamp": {"order": "desc"}}]
            })
            
            hits = response.get("hits", {}).get("hits", [])
            return [hit["_source"] for hit in hits]
            
        except Exception as e:
            print(f"Error fetching logs: {e}")
            return []
    
    def _detect_anomalies(self, logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect anomalies in the logs.
        Returns list of detected anomalies.
        """
        anomalies = []
        
        # 1. Error Rate Spike Detection
        error_logs = [log for log in logs if log.get("level") == "ERROR"]
        
        if len(error_logs) >= ERROR_RATE_THRESHOLD:
            # Group by service
            service_errors = {}
            for log in error_logs:
                service = log.get("service", "unknown")
                if service not in service_errors:
                    service_errors[service] = []
                service_errors[service].append(log)
            
            # Check for service-specific spikes
            for service, errors in service_errors.items():
                if len(errors) >= REPEAT_FAILURE_THRESHOLD:
                    anomalies.append({
                        "type": "error_spike",
                        "service": service,
                        "error_count": len(errors),
                        "trace_id": errors[0].get("trace_id", f"spike-{service}"),
                        "message": f"Error spike detected: {len(errors)} errors in {service}",
                        "samples": errors[:3]  # Include up to 3 sample errors
                    })
        
        # 2. Critical Keyword Detection
        for log in logs:
            message = log.get("message", "")
            for keyword in CRITICAL_KEYWORDS:
                if keyword.lower() in message.lower():
                    anomalies.append({
                        "type": "critical_keyword",
                        "keyword": keyword,
                        "service": log.get("service", "unknown"),
                        "trace_id": log.get("trace_id", f"critical-{keyword}"),
                        "message": f"Critical keyword '{keyword}' detected in {log.get('service', 'unknown')}",
                        "log": log
                    })
                    break  # Only report once per log
        
        # 3. Repeated Failures (same message pattern)
        message_counts = {}
        for log in error_logs:
            msg = log.get("message", "")[:50]  # First 50 chars as key
            if msg not in message_counts:
                message_counts[msg] = {"count": 0, "logs": []}
            message_counts[msg]["count"] += 1
            message_counts[msg]["logs"].append(log)
        
        for msg, data in message_counts.items():
            if data["count"] >= REPEAT_FAILURE_THRESHOLD:
                first_log = data["logs"][0]
                anomalies.append({
                    "type": "repeated_failure",
                    "service": first_log.get("service", "unknown"),
                    "repeat_count": data["count"],
                    "trace_id": first_log.get("trace_id", "repeated"),
                    "message": f"Repeated failure ({data['count']}x): {msg}...",
                    "logs": data["logs"][:3]
                })
        
        # Deduplicate anomalies (same trace_id)
        seen_traces = set()
        unique_anomalies = []
        for anomaly in anomalies:
            trace_id = anomaly.get("trace_id")
            if trace_id not in seen_traces:
                seen_traces.add(trace_id)
                unique_anomalies.append(anomaly)
        
        return unique_anomalies


# Global scanner instance (initialized in main.py)
scanner: Optional[AnomalyScanner] = None

def init_scanner(es_client: Elasticsearch, agent) -> AnomalyScanner:
    """Initialize the global scanner instance."""
    global scanner
    scanner = AnomalyScanner(es_client, agent)
    return scanner

def get_scanner() -> Optional[AnomalyScanner]:
    """Get the global scanner instance."""
    return scanner
