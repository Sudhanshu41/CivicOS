"""
CivicOS — In-Process Event Bus

A lightweight async event bus for publishing domain events to
registered handlers within the same process.

This is infrastructure scaffolding for Phase 1.
In Phase 2+, this can be swapped for Redis Streams or Pub/Sub
without changing call sites.

Usage
-----
    bus = EventBus()

    @bus.subscribe(UserCreated)
    async def on_user_created(event: UserCreated) -> None:
        ...

    await bus.publish(UserCreated(user_id="abc", email="a@b.com"))
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from collections.abc import Callable, Coroutine
from typing import TYPE_CHECKING, Any

from app.core.logging import get_logger

if TYPE_CHECKING:
    from app.events.base import DomainEvent

log = get_logger(__name__)

# Type alias for async event handler functions
AsyncHandler = Callable[[Any], Coroutine[Any, Any, None]]


class EventBus:
    """
    Async in-process event bus.

    Handlers are registered per event type and invoked concurrently
    when an event is published.
    """

    def __init__(self) -> None:
        self._handlers: dict[type[DomainEvent], list[AsyncHandler]] = defaultdict(list)

    def subscribe(self, event_type: type[DomainEvent]) -> Callable[[AsyncHandler], AsyncHandler]:
        """
        Decorator that registers an async handler for *event_type*.

        Example
        -------
            @bus.subscribe(UserCreated)
            async def handle(event: UserCreated) -> None:
                ...
        """

        def decorator(handler: AsyncHandler) -> AsyncHandler:
            self._handlers[event_type].append(handler)
            log.debug(
                "event_handler_registered",
                event_type=event_type.__name__,
                handler=handler.__qualname__,
            )
            return handler

        return decorator

    async def publish(self, event: DomainEvent) -> None:
        """
        Dispatch *event* to all registered handlers concurrently.

        Errors in individual handlers are logged but do not
        prevent other handlers from running.
        """
        handlers = self._handlers.get(type(event), [])
        if not handlers:
            log.debug("event_no_handlers", event_type=type(event).__name__)
            return

        log.info("event_published", event_type=type(event).__name__, event_id=str(event.event_id))

        results = await asyncio.gather(
            *[handler(event) for handler in handlers],
            return_exceptions=True,
        )

        for handler, result in zip(handlers, results, strict=False):
            if isinstance(result, Exception):
                log.error(
                    "event_handler_error",
                    event_type=type(event).__name__,
                    handler=handler.__qualname__,
                    error=str(result),
                    exc_info=result,
                )

    def handler_count(self, event_type: type[DomainEvent]) -> int:
        """Return number of handlers registered for *event_type*."""
        return len(self._handlers.get(event_type, []))


# ── Module-level singleton ─────────────────────────────────────────────────
event_bus = EventBus()
