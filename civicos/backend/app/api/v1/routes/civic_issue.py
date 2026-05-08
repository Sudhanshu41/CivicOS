"""
CivicOS — Civic Issue API (v1)
"""

from __future__ import annotations

import uuid  # noqa: TCH003

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.logging import get_logger

router = APIRouter(prefix="/civic-issues", tags=["Civic Issues"])
log = get_logger(__name__)


class IssueAnalysisRequest(BaseModel):
    title: str
    description: str
    image_url: str | None = None
    coordinates: dict[str, float] | None = None


class IssueAnalysisResponse(BaseModel):
    workflow_id: uuid.UUID
    status: str
    issue_type: str | None
    severity: str | None
    assigned_department: str | None
    recommendations: list[str] | None
    confidence: float | None


@router.post(
    "/analyze",
    response_model=IssueAnalysisResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Analyze — Trigger AI intelligence pipeline",
)
async def analyze_issue(request: IssueAnalysisRequest) -> IssueAnalysisResponse:
    """
    Trigger the autonomous Civic Issue Intelligence Pipeline.
    """
    from app.graphs.civic_issue.services.runner import CivicIssueWorkflowRunner

    log.info(
        "api_analyze_request_received",
        title=request.title,
        description_len=len(request.description),
    )

    runner = CivicIssueWorkflowRunner()

    try:
        log.info("api_analyze_workflow_starting")
        
        final_state = await runner.run_analysis(
            title=request.title,
            description=request.description,
            image_url=request.image_url,
            coordinates=request.coordinates,
        )

        log.info(
            "api_analyze_workflow_completed",
            workflow_id=str(final_state["issue_id"]),
            status=final_state["status"],
            issue_type=final_state.get("issue_type"),
        )

        return IssueAnalysisResponse(
            workflow_id=final_state["issue_id"],
            status=final_state["status"],
            issue_type=final_state.get("issue_type"),
            severity=final_state.get("severity"),
            assigned_department=final_state.get("assigned_department"),
            recommendations=final_state.get("action_recommendations"),
            confidence=final_state.get("confidence_score"),
        )

    except Exception as e:
        log.exception("workflow_execution_failed", title=request.title, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Workflow execution failed: {str(e)}",
        ) from e
