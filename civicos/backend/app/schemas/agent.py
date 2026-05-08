"""
CivicOS — Agent Execution Schemas
"""

import uuid
from typing import Any

from pydantic import Field

from app.schemas.base import CivicOSBase, TimestampedSchema


class AgentExecutionBase(CivicOSBase):
    agent_name: str
    input_payload: dict[str, Any] = Field(default_factory=dict)
    output_payload: dict[str, Any] = Field(default_factory=dict)
    latency_ms: float | None = None
    confidence_score: float | None = Field(None, ge=0.0, le=1.0)
    workflow_id: uuid.UUID


class AgentExecutionCreate(AgentExecutionBase):
    pass


class AgentExecutionResponse(AgentExecutionBase, TimestampedSchema):
    pass
