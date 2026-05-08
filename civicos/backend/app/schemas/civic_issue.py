"""
CivicOS — Civic Issue Schemas
"""

import uuid
from typing import Literal

from pydantic import Field

from app.schemas.base import CivicOSBase, TimestampedSchema


class CivicIssueBase(CivicOSBase):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    severity: Literal["low", "medium", "high", "critical"] = "medium"
    status: Literal["open", "in_progress", "resolved", "closed"] = "open"
    latitude: float | None = Field(None, ge=-90.0, le=90.0)
    longitude: float | None = Field(None, ge=-180.0, le=180.0)
    source_type: str = "user_reported"
    image_url: str | None = None
    assigned_department: str | None = None


class CivicIssueCreate(CivicIssueBase):
    reporter_id: uuid.UUID | None = None


class CivicIssueUpdate(CivicOSBase):
    title: str | None = Field(None, min_length=3, max_length=255)
    description: str | None = Field(None, min_length=10)
    severity: Literal["low", "medium", "high", "critical"] | None = None
    status: Literal["open", "in_progress", "resolved", "closed"] | None = None
    assigned_department: str | None = None


class CivicIssueResponse(CivicIssueBase, TimestampedSchema):
    reporter_id: uuid.UUID | None = None
    created_by: str | None = None
    updated_by: str | None = None
