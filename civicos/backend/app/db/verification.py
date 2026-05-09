"""
CivicOS — Database Verification Layer
"""

from __future__ import annotations

from sqlalchemy import inspect, text
from app.db.session import engine
from app.core.logging import get_logger
from app.db.base import Base

log = get_logger(__name__)

async def verify_database_schema() -> None:
    """
    Verify that all critical tables exist in the database.
    Fails loudly if the schema is incomplete.
    """
    log.info("db_verification_started", database_url=str(engine.url.render_as_string(hide_password=True)))

    try:
        async with engine.connect() as conn:
            # Get current database name
            result = await conn.execute(text("SELECT current_database()"))
            db_name = result.scalar()
            
            log.info("db_connected", database=db_name)

            # Check for tables using a sync-compatible helper via run_sync
            def get_table_names(sync_conn):
                inspector = inspect(sync_conn)
                return inspector.get_table_names()

            existing_tables = await conn.run_sync(get_table_names)
            expected_tables = list(Base.metadata.tables.keys())

            log.info("db_schema_info", existing_tables=existing_tables, expected_tables=expected_tables)

            missing_tables = [t for t in expected_tables if t not in existing_tables]

            if missing_tables:
                log.error(
                    "db_schema_incomplete", 
                    missing_tables=missing_tables,
                    advice="Please run 'alembic upgrade head' to fix the schema."
                )
            else:
                log.info("db_schema_verified", status="all_tables_present")

    except Exception as exc:
        log.error("db_connection_unavailable", error=str(exc), advice="Check your DATABASE_URL and Cloud SQL permissions.")

