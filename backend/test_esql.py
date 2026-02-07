import os
from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()

es_client = Elasticsearch(
    os.getenv("ELASTIC_ENDPOINT"),
    api_key=os.getenv("ELASTIC_API_KEY")
)

# Test ES|QL query
query = """
FROM "greenstick-logs"
| STATS count = count(*) BY service, level
| SORT count DESC
| LIMIT 10
"""

print("Testing ES|QL Query...")
print(f"Query: {query}")

try:
    if hasattr(es_client, 'esql'):
        resp = es_client.esql.query(query=query)
        print("\nES|QL Response:")
        print(f"Columns: {[col['name'] for col in resp['columns']]}")
        print(f"Values: {resp['values']}")
    else:
        print("ES|QL namespace not available in this client version.")
except Exception as e:
    print(f"ES|QL Query failed: {e}")
