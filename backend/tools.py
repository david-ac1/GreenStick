"""
GreenStick Agent Tools

Defines ES|QL-powered tools that the GreenStick agent can use.
This aligns with Elastic Agent Builder's tool-based architecture.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass

@dataclass
class AgentTool:
    """Definition of an agent tool powered by ES|QL"""
    name: str
    description: str
    esql_template: str
    parameters: Dict[str, str]

# ES|QL-powered tools for the GreenStick agent
AGENT_TOOLS: Dict[str, AgentTool] = {
    "search_logs": AgentTool(
        name="Search Logs",
        description="Search logs by service, level, or message content",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE {filter_clause}
            | SORT @timestamp DESC
            | LIMIT {limit}
        """,
        parameters={"filter_clause": "str", "limit": "int"}
    ),
    
    "error_timeline": AgentTool(
        name="Error Timeline",
        description="Get error count over time for trend analysis",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE level == "ERROR"
            | EVAL hour = DATE_TRUNC({hours} hours, @timestamp)
            | STATS error_count = COUNT(*) BY hour
            | SORT hour DESC
            | LIMIT {limit}
        """,
        parameters={"hours": "int", "limit": "int"}
    ),
    
    "service_health": AgentTool(
        name="Service Health Check",
        description="Analyze health of all services based on error rates",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE @timestamp > NOW() - {timeframe}
            | STATS 
                total = COUNT(*),
                errors = COUNT(*) WHERE level == "ERROR",
                warnings = COUNT(*) WHERE level == "WARN"
              BY service
            | EVAL error_rate = ROUND(errors * 100.0 / total, 2)
            | SORT error_rate DESC
        """,
        parameters={"timeframe": "str"}
    ),
    
    "trace_request": AgentTool(
        name="Trace Request",
        description="Follow a request through services using trace ID",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE trace_id == "{trace_id}"
            | SORT @timestamp ASC
            | KEEP @timestamp, service, level, message, span_id
        """,
        parameters={"trace_id": "str"}
    ),
    
    "anomaly_detection": AgentTool(
        name="Detect Anomalies",
        description="Find services with unusually high error rates",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE @timestamp > NOW() - {window}
            | STATS 
                error_count = COUNT(*) WHERE level == "ERROR",
                total_count = COUNT(*)
              BY service
            | WHERE error_count > 0
            | EVAL error_rate = ROUND(error_count * 100.0 / total_count, 2)
            | WHERE error_rate > {threshold}
            | SORT error_rate DESC
        """,
        parameters={"window": "str", "threshold": "float"}
    ),
    
    "service_correlation": AgentTool(
        name="Cascading Failure Detector",
        description="Find traces that caused errors across MULTIPLE services (correlated failures).",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE level == "ERROR" AND @timestamp > NOW() - {timeframe}
            | STATS error_count = COUNT(*), distinct_services = COUNT_DISTINCT(service) BY trace_id
            | WHERE distinct_services > 1
            | SORT error_count DESC
            | LIMIT 20
        """,
        parameters={"timeframe": "str"}
    ),
    
    "critical_errors": AgentTool(
        name="Critical Errors",
        description="Find critical errors that need immediate attention",
        esql_template="""
            FROM "greenstick-logs"
            | WHERE level == "ERROR" AND @timestamp > NOW() - {window}
            | WHERE message LIKE "*critical*" OR message LIKE "*fatal*" OR message LIKE "*panic*"
            | SORT @timestamp DESC
            | LIMIT {limit}
        """,
        parameters={"window": "str", "limit": "int"}
    )
}


def get_tool_definitions() -> List[Dict[str, Any]]:
    """Return tool definitions in a format suitable for API response"""
    return [
        {
            "id": tool_id,
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.parameters,
            "esql_preview": tool.esql_template.strip()[:100] + "..."
        }
        for tool_id, tool in AGENT_TOOLS.items()
    ]


def execute_tool(tool_id: str, params: Dict[str, Any], es_client) -> List[Dict[str, Any]]:
    """Execute a tool with the given parameters"""
    if tool_id not in AGENT_TOOLS:
        raise ValueError(f"Unknown tool: {tool_id}")
    
    tool = AGENT_TOOLS[tool_id]
    query = tool.esql_template.format(**params)
    
    try:
        if hasattr(es_client, 'esql'):
            resp = es_client.esql.query(query=query)
            columns = [col['name'] for col in resp.get('columns', [])]
            results = []
            for row in resp.get('values', []):
                results.append(dict(zip(columns, row)))
            return results
    except Exception as e:
        raise RuntimeError(f"Tool execution failed: {e}")
    
    return []
