"""
CivicOS — String Utilities

Stateless helpers for common string transformations.
"""

from __future__ import annotations

import re
import unicodedata


def slugify(value: str, *, separator: str = "-") -> str:
    """
    Convert *value* to a URL-safe slug.

    Example
    -------
        slugify("Hello World!")  # → "hello-world"
    """
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[\s_-]+", separator, value)


def truncate(value: str, max_length: int, *, suffix: str = "…") -> str:
    """Truncate *value* to *max_length* characters, appending *suffix* if cut."""
    if len(value) <= max_length:
        return value
    return value[: max_length - len(suffix)] + suffix


def camel_to_snake(name: str) -> str:
    """Convert CamelCase → snake_case."""
    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


def mask_sensitive(value: str, *, visible: int = 4) -> str:
    """
    Mask all but the last *visible* characters of *value*.

    Example
    -------
        mask_sensitive("sk-abcdef1234")  # → "**********1234"
    """
    if len(value) <= visible:
        return "*" * len(value)
    return "*" * (len(value) - visible) + value[-visible:]
