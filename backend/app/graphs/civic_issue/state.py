"""
CivicOS — Civic Issue Workflow State
"""

from __future__ import annotations

import uuid  # noqa: TCH003
from datetime import datetime  # noqa: TCH003
from operator import add  # noqa: TCH003
from typing import Annotated, Any, TypedDict


def merge_lists(left: list[Any] | None, right: list[Any] | None) -> list[Any]:
    """
    Safe reducer that merges two lists, ensuring they are always lists
    and filtering out None values to prevent state corruption.
    """
    if left is None:
        left = []
    if right is None:
        right = []

    # Normalize: Ensure everything is a list and merge
    # This prevents 'None' from being added to the state if a node returns None for a key
    return left + [item for item in right if item is not None]


class AgentTrace(TypedDict):
    """Metadata for a single agent execution within the workflow."""

    agent_name: str
    node_name: str
    input: dict[str, Any]
    output: dict[str, Any]
    latency_ms: float
    timestamp: datetime


class CivicIssueState(TypedDict, total=False):
    """
    Strongly typed state for the Civic Issue Intelligence Pipeline.

    This state is passed between nodes and updated immutably.
    """

    # ── Input ──────────────────────────────────────────────────────────────
    issue_id: uuid.UUID
    title: str
    description: str
    image_url: str | None
    coordinates: dict[str, float] | None

    # ── Analysis ───────────────────────────────────────────────────────────
    issue_type: str | None
    severity: str | None
    confidence_score: float | None
    reasoning: str | None

    # ── Routing & Recommendations ──────────────────────────────────────────
    assigned_department: str | None
    action_recommendations: list[str] | None

    # ── Workflow Metadata ──────────────────────────────────────────────────
    status: str
    agent_traces: Annotated[list[AgentTrace], merge_lists]
    event_history: Annotated[list[dict[str, Any]], merge_lists]
    current_node: str | None
    error: str | None

    # ── Timing ─────────────────────────────────────────────────────────────
    started_at: datetime
    completed_at: datetime | None
