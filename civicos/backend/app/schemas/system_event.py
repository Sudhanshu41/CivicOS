"""
CivicOS — System Event Schemas
"""

from typing import Any

from pydantic import Field

from app.schemas.base import CivicOSBase, TimestampedSchema


class SystemEventBase(CivicOSBase):
    event_type: str
    event_source: str
    payload: dict[str, Any] = Field(default_factory=dict)
    severity: str = "info"


class SystemEventCreate(SystemEventBase):
    pass


class SystemEventResponse(SystemEventBase, TimestampedSchema):
    pass
