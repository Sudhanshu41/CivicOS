"""
CivicOS — Workflow Execution Model
"""

from __future__ import annotations

import uuid  # noqa: F401, TCH003
from datetime import datetime  # noqa: TCH003
from typing import Any

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import TimestampedModel


class WorkflowExecution(TimestampedModel):
    __tablename__ = "workflow_executions"

    workflow_type: Mapped[str] = mapped_column(String, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String, default="pending", nullable=False, index=True)
    current_agent: Mapped[str | None] = mapped_column(String, nullable=True)

    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    execution_metadata: Mapped[dict[str, Any]] = mapped_column(
        JSONB, server_default="{}", nullable=False
    )
