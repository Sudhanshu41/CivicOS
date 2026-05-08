"""
CivicOS — Base Service

All domain services inherit from ``BaseService``.
Services orchestrate repositories and emit domain events —
they contain business logic but no HTTP/transport concerns.

Usage
-----
    class UserService(BaseService):
        def __init__(self, repo: UserRepository, db: AsyncSession) -> None:
            super().__init__()
            self._repo = repo

        async def create_user(self, data: UserCreate) -> User:
            user = await self._repo.create(**data.model_dump())
            await self.publish(UserCreated(user_id=str(user.id), email=user.email))
            return user
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.core.logging import get_logger
from app.events.bus import event_bus

if TYPE_CHECKING:
    from app.events.base import DomainEvent


class BaseService:
    """
    Abstract base for all CivicOS domain services.

    Provides:
    - Structured logger bound to the subclass module
    - ``publish()`` helper to emit domain events via the event bus
    """

    def __init__(self) -> None:
        self._log = get_logger(type(self).__module__)

    async def publish(self, event: DomainEvent) -> None:
        """Emit *event* through the application event bus."""
        await event_bus.publish(event)
