import asyncio
import os
from dotenv import load_dotenv
from agent import GreenStickAgent

load_dotenv()

async def test_agent():
    print("=" * 50)
    print("GreenStick Agent - Full Workflow Test")
    print("=" * 50)
    
    agent = GreenStickAgent(
        es_endpoint=os.getenv("ELASTIC_ENDPOINT"),
        es_api_key=os.getenv("ELASTIC_API_KEY"),
        gemini_api_key=os.getenv("GEMINI_API_KEY")
    )

    incident_id = "trace-hq-001" 
    print(f"\nAnalyzing Incident: {incident_id}...")
    
    result = await agent.analyze_incident(incident_id)
    
    print("\n--- Analysis Result ---")
    print(f"Detected Anomalies: {len(result.get('detected_anomalies', []))}")
    
    if result.get('historical_context'):
        print(f"Historical Match: {result['historical_context'][0].get('incident_id', 'N/A')}")
    
    print(f"Correlations: {len(result.get('correlations', []))} services impacted")

    print("\n--- Gemini Plan ---")
    plan = result.get('plan', {})
    print(f"Action: {plan.get('action')}")
    print(f"Confidence: {plan.get('confidence')}")
    print(f"Reasoning: {plan.get('reasoning')}")
    print(f"Steps: {plan.get('steps')}")

    print("\n--- Execution ---")
    execution = result.get('execution', {})
    print(f"Status: {execution.get('status')}")
    print(f"Message: {execution.get('message')}")
    print(f"Approval Required: {execution.get('approval_required')}")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(test_agent())
