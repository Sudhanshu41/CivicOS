"""
CivicOS — System Nodes (Persistence & Broadcast)
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from app.api.v1.websocket.manager import manager
from app.core.logging import get_logger
from app.db.session import AsyncSessionLocal
from app.repositories.agent import AgentExecutionRepository
from app.repositories.system_event import SystemEventRepository
from app.repositories.workflow import WorkflowExecutionRepository

if TYPE_CHECKING:
    from app.graphs.civic_issue.state import CivicIssueState

log = get_logger(__name__)


async def persistence_node(state: CivicIssueState) -> dict[str, Any]:
    """
    Persist workflow execution state and agent traces.
    """
    log.info("node_persistence_started", workflow_id=str(state["issue_id"]))

    async with AsyncSessionLocal() as session:
        workflow_repo = WorkflowExecutionRepository(session)
        agent_repo = AgentExecutionRepository(session)

        log.debug("node_persistence_lookup_workflow", workflow_id=str(state["issue_id"]))
        workflow = await workflow_repo.get_by_id(state["issue_id"])

        execution_metadata: dict[str, Any] = {
            "issue_type": state.get("issue_type"),
            "severity": state.get("severity"),
            "assigned_department": state.get("assigned_department"),
        }

        # Create workflow if it does not exist
        if workflow is None:
            log.info("node_persistence_creating_new_workflow", workflow_id=str(state["issue_id"]))
            await workflow_repo.create(
                id=state["issue_id"],
                workflow_type="civic_issue_intelligence",
                status=state["status"],
                current_agent=state["current_node"],
                started_at=state["started_at"],
                execution_metadata=execution_metadata,
            )

        # Otherwise update workflow
        else:
            log.debug("node_persistence_updating_existing_workflow", workflow_id=str(state["issue_id"]))
            updated_metadata = {
                **(workflow.execution_metadata or {}),
                **execution_metadata,
            }

            await workflow_repo.update(
                workflow,
                status=state["status"],
                current_agent=state["current_node"],
                completed_at=(
                    datetime.now(UTC)
                    if state["status"] == "completed"
                    else None
                ),
                execution_metadata=updated_metadata,
            )

        # Persist agent traces
        traces = state.get("agent_traces", [])
        log.info("node_persistence_saving_traces", workflow_id=str(state["issue_id"]), count=len(traces))
        for trace in traces:
            await agent_repo.create(
                agent_name=trace.get("agent_name"),
                input_payload=trace.get("input"),
                output_payload=trace.get("output"),
                latency_ms=trace.get("latency_ms"),
                workflow_id=state["issue_id"],
            )

        await session.commit()
        log.info("node_persistence_committed", workflow_id=str(state["issue_id"]))

    return {
        "current_node": "persistence",
    }


async def broadcast_node(state: CivicIssueState) -> dict[str, Any]:
    """
    Emit realtime workflow events to connected websocket clients.
    """

    event: dict[str, Any] = {
        "type": "workflow_update",
        "workflow_id": str(state["issue_id"]),
        "node": state["current_node"],
        "status": state["status"],
        "payload": {
            "issue_type": state.get("issue_type"),
            "severity": state.get("severity"),
            "department": state.get("assigned_department"),
        },
        "timestamp": datetime.now(UTC).isoformat(),
    }

    # Broadcast realtime event
    await manager.broadcast(event)

    # Persist event log
    async with AsyncSessionLocal() as session:
        event_repo = SystemEventRepository(session)

        await event_repo.create(
            event_type=f"workflow.{state.get('current_node') or 'update'}",
            event_source="langgraph_orchestrator",
            payload=event,
            severity="info",
        )

        await session.commit()

    log.info(
        "workflow_event_broadcasted",
        workflow_id=str(state["issue_id"]),
        current_node=state["current_node"],
        status=state["status"],
    )

    return {
        "event_history": [event],
        "current_node": "broadcast",
    }
