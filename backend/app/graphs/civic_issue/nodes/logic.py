"""
CivicOS — Workflow Logic Nodes
"""
from typing import Any

from app.core.logging import get_logger
from app.graphs.civic_issue.state import CivicIssueState

log = get_logger(__name__)


async def validation_node(state: CivicIssueState) -> dict[str, Any]:
    """Validate AI confidence and ensure data integrity."""
    raw_confidence: float | None = state["confidence_score"]
    confidence = raw_confidence or 0.0

    if confidence < 0.6:
        log.warning(
            "node_validation_low_confidence", issue_id=str(state["issue_id"]), confidence=confidence
        )
        # We could route to a human node here in a more complex graph
        # For now, we just tag it for review
        return {"status": "needs_review", "current_node": "validation"}

    return {"status": "validated", "current_node": "validation"}


async def department_routing_node(state: CivicIssueState) -> dict[str, Any]:
    """Route the issue to the appropriate civic department."""
    issue_type = (state.get("issue_type") or "").lower()

    mapping = {
        "pothole": "Department of Public Works",
        "road": "Department of Public Works",
        "water": "Water and Sanitation Bureau",
        "leak": "Water and Sanitation Bureau",
        "light": "Electrical Services",
        "power": "Electrical Services",
        "waste": "Environmental Services",
        "garbage": "Environmental Services",
    }

    # Default routing logic
    department = "General Municipal Administration"
    for key, dept in mapping.items():
        if key in issue_type:
            department = dept
            break

    log.info("node_routing_completed", issue_id=str(state["issue_id"]), department=department)

    return {"assigned_department": department, "current_node": "routing"}


async def recommendation_node(state: CivicIssueState) -> dict[str, Any]:
    """Synthesize final recommendations for the city officials."""
    # In a real scenario, this might call another AI task to summarize
    # For now, we enhance the existing recommendations
    recommendations = state.get("action_recommendations") or []

    if state["severity"] in ["high", "critical", "hazardous"]:
        recommendations.insert(0, "URGENT: Dispatch emergency inspection team within 4 hours.")
    else:
        recommendations.append("Schedule routine maintenance within the next 7 business days.")

    return {
        "action_recommendations": recommendations,
        "status": "completed",
        "current_node": "recommendation",
    }
