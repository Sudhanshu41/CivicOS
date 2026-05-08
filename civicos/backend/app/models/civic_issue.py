"""
CivicOS — Civic Issue Model
"""

from __future__ import annotations

import uuid  # noqa: TCH003

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import AuditMixin, SoftDeleteMixin, TimestampedModel
from app.models.user import User  # noqa: TCH001


class CivicIssue(TimestampedModel, SoftDeleteMixin, AuditMixin):
    __tablename__ = "civic_issues"

    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    severity: Mapped[str] = mapped_column(String, default="medium", nullable=False)
    status: Mapped[str] = mapped_column(String, default="open", nullable=False, index=True)

    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    source_type: Mapped[str] = mapped_column(String, default="user_reported", nullable=False)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)

    assigned_department: Mapped[str | None] = mapped_column(String, nullable=True)

    # Relationships
    reporter_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    reporter: Mapped[User] = relationship(foreign_keys=[reporter_id])
