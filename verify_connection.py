from dotenv import load_dotenv
import os
from elasticsearch import Elasticsearch

# Load environment variables
load_dotenv(dotenv_path="backend/.env")

# Get credentials
es_endpoint = os.getenv("ELASTIC_ENDPOINT")
es_api_key = os.getenv("ELASTIC_API_KEY")

print(f"Connecting to: {es_endpoint}")

try:
    # Initialize client
    client = Elasticsearch(
        es_endpoint,
        api_key=es_api_key
    )

    # Test connection
    info = client.info()
    print("Connection Successful!")
    print(info)

except Exception as e:
    print(f"Connection Failed: {e}")
