"""
CivicOS — Workflow Execution Schemas
"""

from datetime import datetime
from typing import Any

from pydantic import Field

from app.schemas.base import CivicOSBase, TimestampedSchema


class WorkflowExecutionBase(CivicOSBase):
    workflow_type: str
    status: str = "pending"
    current_agent: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    execution_metadata: dict[str, Any] = Field(default_factory=dict)


class WorkflowExecutionCreate(WorkflowExecutionBase):
    pass


class WorkflowExecutionUpdate(CivicOSBase):
    status: str | None = None
    current_agent: str | None = None
    completed_at: datetime | None = None
    execution_metadata: dict[str, Any] | None = None


class WorkflowExecutionResponse(WorkflowExecutionBase, TimestampedSchema):
    pass
