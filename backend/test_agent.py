import asyncio
import os
from dotenv import load_dotenv
from agent import GreenStickAgent

load_dotenv()

async def test_agent():
    print("Initializing Agent...")
    agent = GreenStickAgent(
        es_endpoint=os.getenv("ELASTIC_ENDPOINT"),
        es_api_key=os.getenv("ELASTIC_API_KEY"),
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    # Test an incident ID that matches our seeded logs
    incident_id = "trace-hq-001" 
    print(f"Analyzing Incident: {incident_id}...")
    
    result = await agent.analyze_incident(incident_id)
    
    print("\nanalysis Result:")
    print("-" * 30)
    print(f"Detected: {len(result.get('detected_anomalies', []))} errors")
    if result.get('historical_context'):
        print(f"Historical Match: {result['historical_context'][0]['incident_id']}")
    print(f"Plan: {result['plan']['action']}")
    print("-" * 30)

if __name__ == "__main__":
    asyncio.run(test_agent())
