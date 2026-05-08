"""
CivicOS — Workflow Runner Service
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Any

from app.core.logging import get_logger
from app.graphs.civic_issue.graph import civic_issue_graph

log = get_logger(__name__)


class CivicIssueWorkflowRunner:
    """
    Handles the execution and management of the Civic Issue Intelligence Pipeline.
    """

    async def run_analysis(
        self,
        title: str,
        description: str,
        image_url: str | None = None,
        coordinates: dict[str, float] | None = None,
    ) -> dict[str, Any]:
        """
        Invoke the LangGraph workflow and return the final state.
        """
        workflow_id = uuid.uuid4()

        initial_state = {
            "issue_id": workflow_id,
            "title": title,
            "description": description,
            "image_url": image_url,
            "coordinates": coordinates,
            "status": "started",
            "agent_traces": [],
            "event_history": [],
            "started_at": datetime.now(UTC),
            "issue_type": None,
            "severity": None,
            "confidence_score": None,
            "assigned_department": None,
            "action_recommendations": None,
            "current_node": None,
            "error": None,
            "completed_at": None,
        }

        log.info("workflow_runner_starting", workflow_id=str(workflow_id))

        try:
            final_state = await civic_issue_graph.ainvoke(initial_state)
            log.info(
                "workflow_runner_completed",
                workflow_id=str(workflow_id),
                status=final_state["status"],
            )
            return final_state
        except Exception as e:
            log.exception("workflow_runner_failed", workflow_id=str(workflow_id), error=str(e))
            raise
