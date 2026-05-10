"""
CivicOS — Analysis Nodes
"""

from __future__ import annotations

import time
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from app.core.logging import get_logger
from app.services.ai import GeminiProvider, InfrastructureAnalysisTask, IssueClassificationTask

if TYPE_CHECKING:
    from app.graphs.civic_issue.state import AgentTrace, CivicIssueState

log = get_logger(__name__)


async def classification_node(state: CivicIssueState) -> dict[str, Any]:
    """Classify the issue type using the AI task layer."""
    t0 = time.perf_counter()
    provider = GeminiProvider()
    task = IssueClassificationTask(provider)

    log.info("node_classification_started", issue_id=str(state["issue_id"]))

    result = await task.execute(
        report_text=f"{state['title']}\n{state['description']}",
        location=str(state.get("coordinates", "Unknown")),
        source="citizen_report",
    )

    latency = round((time.perf_counter() - t0) * 1000, 2)

    trace: AgentTrace = {
        "agent_name": "classifier_agent",
        "node_name": "classification",
        "input": {"text": state["description"]},
        "output": result.model_dump(),
        "latency_ms": latency,
        "timestamp": datetime.now(UTC),
    }

    return {
        "issue_type": result.issue_type,
        "severity": result.severity,
        "confidence_score": result.confidence_score,
        "reasoning": result.reasoning,
        "agent_traces": [trace],
        "event_history": provider.events,
        "current_node": "classification",
    }


async def severity_analysis_node(state: CivicIssueState) -> dict[str, Any]:
    """Analyze infrastructure risk and refine severity."""
    t0 = time.perf_counter()
    provider = GeminiProvider()
    task = InfrastructureAnalysisTask(provider)

    log.info("node_severity_analysis_started", issue_id=str(state["issue_id"]))

    result = await task.execute(
        component_name=state["issue_type"] or "unknown_infrastructure",
        data_payload={"description": state["description"], "initial_severity": state["severity"]},
    )

    latency = round((time.perf_counter() - t0) * 1000, 2)

    trace: AgentTrace = {
        "agent_name": "analyst_agent",
        "node_name": "severity_analysis",
        "input": {"issue_type": state["issue_type"]},
        "output": result.model_dump(),
        "latency_ms": latency,
        "timestamp": datetime.now(UTC),
    }

    return {
        "severity": result.risk_level if result.risk_level != "stable" else state["severity"],
        "action_recommendations": [result.recommended_action],
        "agent_traces": [trace],
        "event_history": provider.events,
        "current_node": "severity_analysis",
    }
