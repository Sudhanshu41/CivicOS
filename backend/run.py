"""
CivicOS — Application Entry Point

Launches the uvicorn server with settings derived from the environment.
Run directly with:   python run.py
Or via uvicorn CLI:  uvicorn app.main:app --reload
"""

from __future__ import annotations

import sys

import uvicorn

from app.core.config import settings

if __name__ == "__main__":
    is_dev = settings.is_development

    # uvloop is only available on Unix — fall back gracefully on Windows.
    loop_policy = "auto"
    if sys.platform != "win32":
        try:
            import uvloop  # noqa: F401

            loop_policy = "uvloop"
        except ImportError:
            pass

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=is_dev,
        reload_dirs=["app"] if is_dev else None,
        workers=1 if is_dev else 4,
        loop=loop_policy,
        http="httptools",
        log_level=settings.LOG_LEVEL.lower(),
        access_log=False,  # handled by RequestContextMiddleware
    )
