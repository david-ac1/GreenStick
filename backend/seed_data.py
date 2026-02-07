import os
from elasticsearch import Elasticsearch, helpers
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Connect to Elasticsearch
es_client = Elasticsearch(
    os.getenv("ELASTIC_ENDPOINT"),
    api_key=os.getenv("ELASTIC_API_KEY")
)

LOGS_INDEX = "greenstick-logs"
INCIDENTS_INDEX = "greenstick-incidents"

def create_indices():
    # Logs Index
    if not es_client.indices.exists(index=LOGS_INDEX):
        es_client.indices.create(index=LOGS_INDEX, body={
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
        print(f"Created index: {LOGS_INDEX}")

    # Incidents Index (for historical search)
    if not es_client.indices.exists(index=INCIDENTS_INDEX):
        es_client.indices.create(index=INCIDENTS_INDEX, body={
            "mappings": {
                "properties": {
                    "incident_id": {"type": "keyword"},
                    "description": {"type": "text"},
                    "resolution": {"type": "text"},
                    "root_cause": {"type": "text"},
                    "created_at": {"type": "date"},
                    "embedding": {"type": "dense_vector", "dims": 1536, "index": True, "similarity": "cosine"} # Placeholder for vector search
                }
            }
        })
        print(f"Created index: {INCIDENTS_INDEX}")

def seed_data():
    now = datetime.now()
    
    # 1. Sample Logs (Simulating an active incident)
    logs = [
        {
            "@timestamp": (now - timedelta(minutes=5)).isoformat(),
            "service": "checkout-service",
            "level": "ERROR",
            "message": "ConnectionRefusedError: Unable to connect to database 'orders_db' at 10.0.2.15:5432",
            "trace_id": "trace-hq-001"
        },
        {
            "@timestamp": (now - timedelta(minutes=4)).isoformat(),
            "service": "checkout-service",
            "level": "ERROR",
            "message": "Retry attempt 1/3 failed. Database pool exhaustion.",
            "trace_id": "trace-hq-001"
        },
        {
            "@timestamp": (now - timedelta(minutes=3)).isoformat(),
            "service": "payment-gateway",
            "level": "WARN",
            "message": "High latency detected from upstream service: checkout-service",
            "trace_id": "trace-hq-002"
        },
        {
            "@timestamp": (now - timedelta(minutes=2)).isoformat(),
            "service": "frontend-proxy",
            "level": "ERROR",
            "message": "502 Bad Gateway - Upstream unresponsive",
            "trace_id": "trace-hq-003"
        }
    ]

    # 2. Historical Incidents (for context matching)
    incidents = [
        {
            "incident_id": "INC-2023-001",
            "description": "Checkout service failing due to database connection timeout",
            "root_cause": "Database connection pool limit reached because connection wasn't closed in 'get_order_history' function.",
            "resolution": "Increased max_connections in pool settings and patched 'get_order_history' to use context manager.",
            "created_at": (now - timedelta(days=45)).isoformat()
            # "embedding": ... (We'll generate this later if we add OpenAI)
        },
        {
            "incident_id": "INC-2023-089",
            "description": "High latency in payment gateway during flash sale",
            "root_cause": "Insufficient replicas for payment-service.",
            "resolution": "Scaled up payment-service deployment to 10 replicas.",
            "created_at": (now - timedelta(days=120)).isoformat()
        }
    ]

    # Bulk Index Logs
    print(f"Indexing {len(logs)} logs...")
    helpers.bulk(es_client, logs, index=LOGS_INDEX)

    # Bulk Index Incidents
    print(f"Indexing {len(incidents)} incidents...")
    helpers.bulk(es_client, incidents, index=INCIDENTS_INDEX)

    print("Seeding complete.")

if __name__ == "__main__":
    create_indices()
    seed_data()
