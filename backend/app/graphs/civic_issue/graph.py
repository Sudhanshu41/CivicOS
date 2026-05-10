"""
CivicOS — Civic Issue Intelligence Pipeline Graph
"""

from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from app.graphs.civic_issue.nodes.analysis import (
    classification_node,
    severity_analysis_node,
)
from app.graphs.civic_issue.nodes.logic import (
    department_routing_node,
    recommendation_node,
    validation_node,
)
from app.graphs.civic_issue.nodes.system import (
    broadcast_node,
    persistence_node,
)
from app.graphs.civic_issue.state import CivicIssueState


def create_civic_issue_graph() -> StateGraph:
    """
    Construct the LangGraph orchestration for civic issue analysis.
    """
    workflow = StateGraph(CivicIssueState)

    # ── Nodes ──────────────────────────────────────────────────────────────
    workflow.add_node("classification", classification_node)
    workflow.add_node("severity_analysis", severity_analysis_node)
    workflow.add_node("validation", validation_node)
    workflow.add_node("routing", department_routing_node)
    workflow.add_node("recommendation", recommendation_node)
    workflow.add_node("persistence", persistence_node)
    workflow.add_node("broadcast", broadcast_node)

    # ── Edges ──────────────────────────────────────────────────────────────
    workflow.add_edge(START, "classification")
    workflow.add_edge("classification", "severity_analysis")
    workflow.add_edge("severity_analysis", "validation")
    workflow.add_edge("validation", "routing")
    workflow.add_edge("routing", "recommendation")
    workflow.add_edge("recommendation", "persistence")
    workflow.add_edge("persistence", "broadcast")
    workflow.add_edge("broadcast", END)

    # Compile the graph
    return workflow.compile()


# Singleton instance
civic_issue_graph = create_civic_issue_graph()
