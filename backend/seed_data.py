"""
Seed script to populate Elasticsearch with demo incidents and logs.
Run this to set up data for the demo.
"""
import os
from datetime import datetime, timedelta
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import random

load_dotenv()

# Connect to Elasticsearch
es = Elasticsearch(
    hosts=[os.getenv("ELASTIC_ENDPOINT")],
    api_key=os.getenv("ELASTIC_API_KEY")
)

# Sample services and error messages
SERVICES = ["api-gateway", "auth-service", "payment-processor", "user-service", "notification-hub", "data-pipeline"]
ERROR_MESSAGES = [
    "Connection timeout after 30000ms",
    "Database connection pool exhausted",
    "Memory allocation failed: OOM killer invoked",
    "SSL certificate verification failed",
    "Rate limit exceeded: 429 Too Many Requests",
    "Kafka consumer lag critical: 50000 messages",
    "Redis cluster node unreachable",
    "gRPC deadline exceeded",
    "JWT token validation failed: expired",
    "S3 bucket access denied: permission error"
]
WARN_MESSAGES = [
    "High CPU utilization: 85%",
    "Disk space running low: 90% used",
    "Connection pool nearing capacity: 80%",
    "Response latency above threshold: 500ms",
    "Cache hit ratio degraded: 60%",
    "Memory pressure detected",
    "Slow query detected: 2000ms"
]
INFO_MESSAGES = [
    "Service started successfully",
    "Health check passed",
    "Configuration reloaded",
    "Scheduled job completed",
    "Metrics exported to Prometheus"
]

def generate_trace_id():
    return f"trace-{random.choice(['hq', 'us', 'eu', 'ap'])}-{random.randint(100, 999)}"

def seed_logs():
    """Create the logs index and seed with sample data."""
    print("Creating greenstick-logs index...")
    
    # Create index with mapping
    if not es.indices.exists(index="greenstick-logs"):
        es.indices.create(index="greenstick-logs", body={
            "mappings": {
                "properties": {
                    "@timestamp": {"type": "date"},
                    "service": {"type": "keyword"},
                    "level": {"type": "keyword"},
                    "message": {"type": "text"},
                    "trace_id": {"type": "keyword"}
                }
            }
        })
    
    # Generate logs for the past 24 hours
    now = datetime.utcnow()
    logs = []
    
    for i in range(50):
        timestamp = now - timedelta(minutes=random.randint(1, 1440))
        level = random.choices(["ERROR", "WARN", "INFO"], weights=[0.3, 0.3, 0.4])[0]
        
        if level == "ERROR":
            message = random.choice(ERROR_MESSAGES)
        elif level == "WARN":
            message = random.choice(WARN_MESSAGES)
        else:
            message = random.choice(INFO_MESSAGES)
        
        logs.append({
            "_index": "greenstick-logs",
            "_source": {
                "@timestamp": timestamp.isoformat() + "Z",
                "service": random.choice(SERVICES),
                "level": level,
                "message": message,
                "trace_id": generate_trace_id()
            }
        })
    
    # Bulk insert
    from elasticsearch.helpers import bulk
    success, failed = bulk(es, logs)
    print(f"Seeded {success} logs ({failed} failed)")

def seed_incidents():
    """Create the incidents index with historical data."""
    print("Creating greenstick-incidents index...")
    
    if not es.indices.exists(index="greenstick-incidents"):
        es.indices.create(index="greenstick-incidents", body={
            "mappings": {
                "properties": {
                    "incident_id": {"type": "keyword"},
                    "description": {"type": "text"},
                    "root_cause": {"type": "text"},
                    "resolution": {"type": "text"},
                    "severity": {"type": "keyword"},
                    "created_at": {"type": "date"},
                    "resolved_at": {"type": "date"}
                }
            }
        })
    
    # Historical incidents
    incidents = [
        {
            "incident_id": "INC-2024-001",
            "description": "API Gateway timeout causing cascading failures",
            "root_cause": "Database connection pool exhaustion due to long-running queries",
            "resolution": "Increased connection pool size and implemented query timeout",
            "severity": "critical"
        },
        {
            "incident_id": "INC-2024-002",
            "description": "Authentication service memory leak",
            "root_cause": "Session objects not properly garbage collected",
            "resolution": "Patched session management code and deployed hotfix",
            "severity": "high"
        },
        {
            "incident_id": "INC-2024-003",
            "description": "Payment processor SSL certificate expired",
            "root_cause": "Certificate renewal automation failed silently",
            "resolution": "Renewed certificate and implemented monitoring for expiry",
            "severity": "critical"
        },
        {
            "incident_id": "INC-2024-004",
            "description": "Data pipeline Kafka consumer lag",
            "root_cause": "Sudden spike in message volume from upstream service",
            "resolution": "Scaled consumer group and implemented backpressure handling",
            "severity": "high"
        },
        {
            "incident_id": "INC-2024-005",
            "description": "Redis cluster node failure",
            "root_cause": "Hardware failure on primary node",
            "resolution": "Failover to replica completed, replaced hardware",
            "severity": "medium"
        }
    ]
    
    now = datetime.utcnow()
    for i, incident in enumerate(incidents):
        incident["created_at"] = (now - timedelta(days=30 + i*7)).isoformat() + "Z"
        incident["resolved_at"] = (now - timedelta(days=29 + i*7)).isoformat() + "Z"
        es.index(index="greenstick-incidents", document=incident)
    
    print(f"Seeded {len(incidents)} historical incidents")

def seed_audit_logs():
    """Create the audit index with sample agent actions."""
    print("Creating greenstick-audit index...")
    
    if not es.indices.exists(index="greenstick-audit"):
        es.indices.create(index="greenstick-audit", body={
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
    
    # Sample audit entries representing agent actions
    ACTION_TYPES = ["K8S_RESTART", "CONFIG_ROLLBACK", "SCALE_UP", "ALERT_ESCALATE", "ANALYSIS"]
    STATUSES = ["approved", "pending", "rejected"]
    
    DESCRIPTIONS = [
        "Memory leak detected in auth-svc-v2. Entropy delta exceeded 0.85 threshold. Pod termination initiated for heap clearance.",
        "Analyzed high latency spike in api-gateway. Root cause identified as database connection pool exhaustion.",
        "Kafka consumer lag detected. Scaled consumer group from 3 to 6 replicas to handle backpressure.",
        "SSL certificate expiry warning. Escalated to on-call team for manual renewal.",
        "Redis cluster node failure detected. Initiated automatic failover to replica.",
        "Correlated 12 related incidents across payment-processor and auth-service. Common root cause: network partition.",
        "Database connection pool at 95% capacity. Increased pool size from 100 to 200 connections.",
        "High CPU utilization on user-service pods. No action taken - within normal range for current traffic.",
        "Configuration drift detected. Rolled back to last known good configuration.",
        "Scheduled maintenance window started. Suppressing non-critical alerts for 2 hours."
    ]
    
    now = datetime.utcnow()
    audit_entries = []
    
    for i in range(20):
        timestamp = now - timedelta(hours=random.randint(1, 72))
        status = random.choices(STATUSES, weights=[0.6, 0.3, 0.1])[0]
        
        audit_entries.append({
            "_index": "greenstick-audit",
            "_source": {
                "@timestamp": timestamp.isoformat() + "Z",
                "trace_id": generate_trace_id(),
                "action_type": random.choice(ACTION_TYPES),
                "description": random.choice(DESCRIPTIONS),
                "confidence": round(random.uniform(0.7, 0.99), 2),
                "status": status,
                "metadata": {
                    "service": random.choice(SERVICES),
                    "correlations_count": random.randint(0, 5),
                    "historical_matches": random.randint(0, 10)
                }
            }
        })
    
    from elasticsearch.helpers import bulk
    success, failed = bulk(es, audit_entries)
    print(f"Seeded {success} audit log entries ({failed} failed)")

if __name__ == "__main__":
    print("=" * 50)
    print("GreenStick Demo Data Seeder")
    print("=" * 50)
    
    seed_logs()
    seed_incidents()
    seed_audit_logs()
    
    print("\n✅ Demo data seeded successfully!")
    print("You can now view incidents in the Dashboard and Audit page.")

