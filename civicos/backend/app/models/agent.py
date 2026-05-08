"""
CivicOS — Agent Execution Model
"""

from __future__ import annotations

import uuid  # noqa: TCH003
from typing import Any

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import TimestampedModel
from app.models.workflow import WorkflowExecution  # noqa: TCH001


class AgentExecution(TimestampedModel):
    __tablename__ = "agent_executions"

    agent_name: Mapped[str] = mapped_column(String, nullable=False, index=True)

    input_payload: Mapped[dict[str, Any]] = mapped_column(
        JSONB, server_default="{}", nullable=False
    )
    output_payload: Mapped[dict[str, Any]] = mapped_column(
        JSONB, server_default="{}", nullable=False
    )

    latency_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    workflow_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workflow_executions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    workflow: Mapped[WorkflowExecution] = relationship(foreign_keys=[workflow_id])
