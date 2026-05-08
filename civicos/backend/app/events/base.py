"""
CivicOS — Domain Event Base

Defines the base domain event contract.  All domain events must subclass
``DomainEvent``.  The event bus is infrastructure-only — no business logic.

Usage
-----
    from app.events.base import DomainEvent

    class UserCreated(DomainEvent):
        user_id: str
        email: str

    event = UserCreated(user_id="abc", email="a@b.com")
    await event_bus.publish(event)
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from pydantic import BaseModel, Field

from app.utils.datetime import utcnow

if TYPE_CHECKING:
    from datetime import datetime


class DomainEvent(BaseModel):
    """
    Immutable base class for all CivicOS domain events.

    Every event carries:
    - ``event_id``: globally unique identifier
    - ``event_type``: dot-notation name (e.g. ``user.created``)
    - ``occurred_at``: UTC timestamp of when the event happened
    - ``version``: event schema version for forward compatibility
    """

    model_config = {"frozen": True}  # events are immutable

    event_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    event_type: str = ""  # subclasses should override via ClassVar
    occurred_at: datetime = Field(default_factory=utcnow)
    version: int = 1

    def __init_subclass__(cls, event_type: str = "", **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        if event_type:
            cls.model_fields["event_type"].default = event_type
