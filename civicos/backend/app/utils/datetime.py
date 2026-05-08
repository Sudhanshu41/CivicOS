"""
CivicOS — DateTime Utilities

Stateless helpers for UTC-aware datetime creation and formatting.
All datetimes in CivicOS must be timezone-aware (UTC).
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta


def utcnow() -> datetime:
    """Return the current UTC-aware datetime. Use instead of datetime.utcnow()."""
    return datetime.now(tz=UTC)


def utc_from_timestamp(ts: float) -> datetime:
    """Convert a UNIX timestamp to a UTC-aware datetime."""
    return datetime.fromtimestamp(ts, tz=UTC)


def add_seconds(dt: datetime, seconds: int) -> datetime:
    return dt + timedelta(seconds=seconds)


def add_minutes(dt: datetime, minutes: int) -> datetime:
    return dt + timedelta(minutes=minutes)


def add_days(dt: datetime, days: int) -> datetime:
    return dt + timedelta(days=days)


def is_expired(expiry: datetime) -> bool:
    """Return True if *expiry* is in the past."""
    return utcnow() >= expiry


def seconds_until(dt: datetime) -> float:
    """Return seconds remaining until *dt* (negative if past)."""
    delta = dt - utcnow()
    return delta.total_seconds()


def to_iso(dt: datetime) -> str:
    """Render a datetime as ISO 8601 UTC string."""
    return dt.isoformat()
