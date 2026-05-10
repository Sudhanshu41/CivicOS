"""
CivicOS — Base ORM Model & Mixins

All SQLAlchemy models inherit from ``CivicOSBase``, which includes:
- UUID primary key (server-generated, collision-free)
- created_at / updated_at timestamps (auto-managed)

Includes Mixins for:
- SoftDeleteMixin (is_deleted, deleted_at)
- AuditMixin (created_by_id, updated_by_id)
"""

from __future__ import annotations

import uuid  # noqa: TCH003
from datetime import datetime  # noqa: TCH003

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class TimestampedModel(Base):
    """
    Abstract base model with UUID PK and auto-managed timestamps.
    Inherit from this for every domain model in the application.
    """

    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid(),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<{type(self).__name__} id={self.id}>"


class SoftDeleteMixin:
    """Mixin to provide soft-delete fields to models."""

    is_deleted: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false", nullable=False
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class AuditMixin:
    """Mixin to track which user/agent created or updated a record."""

    created_by: Mapped[str | None] = mapped_column(
        String, nullable=True, comment="User ID or Agent ID"
    )
    updated_by: Mapped[str | None] = mapped_column(
        String, nullable=True, comment="User ID or Agent ID"
    )
