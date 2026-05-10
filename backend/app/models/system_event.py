"""
CivicOS — System Event Model
"""

from __future__ import annotations

import uuid  # noqa: F401, TCH003
from typing import Any

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import TimestampedModel


class SystemEvent(TimestampedModel):
    __tablename__ = "system_events"

    event_type: Mapped[str] = mapped_column(String, nullable=False, index=True)
    event_source: Mapped[str] = mapped_column(String, nullable=False)

    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, server_default="{}", nullable=False)

    severity: Mapped[str] = mapped_column(String, default="info", nullable=False)
