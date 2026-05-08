# CivicOS Backend

> Production-grade AI Operating System backend — Phase 1: Infrastructure Foundation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 + Python 3.12 |
| Validation | Pydantic v2 + pydantic-settings |
| ORM | SQLAlchemy 2.0 (async) |
| Database | PostgreSQL 16 (asyncpg) |
| Cache / Pub-Sub | Redis 7 (aioredis) |
| WebSockets | FastAPI native WebSocket |
| Logging | structlog (JSON / console) |
| Containerisation | Docker + Docker Compose |
| Testing | pytest + pytest-asyncio |
| Linting | Ruff + Black + mypy |

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── routes/          # HTTP endpoint routers
│   │       ├── websocket/       # WS manager + endpoints
│   │       └── dependencies/    # FastAPI dependency providers
│   ├── core/
│   │   ├── config.py            # Centralised pydantic-settings
│   │   ├── logging.py           # structlog setup
│   │   ├── constants.py         # App-wide immutable constants
│   │   └── security.py          # JWT + password hashing
│   ├── db/
│   │   ├── session.py           # Async SQLAlchemy engine + dependency
│   │   └── redis.py             # Redis client + dependency
│   ├── agents/                  # LangGraph agents (Phase 2)
│   ├── graphs/                  # LangGraph graph definitions (Phase 2)
│   ├── services/                # Domain service layer
│   ├── repositories/            # Data access layer (Repository pattern)
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── models/                  # SQLAlchemy ORM models
│   ├── events/                  # Domain events
│   ├── workers/                 # Background task workers
│   ├── tools/                   # Reusable AI tool definitions
│   ├── utils/                   # Shared stateless helpers
│   └── main.py                  # FastAPI app factory + lifespan
├── tests/
│   ├── conftest.py
│   └── test_health.py
├── docker/
│   ├── Dockerfile               # Multi-stage (dev + production)
│   └── postgres/init.sql
├── requirements/
│   ├── base.txt                 # Production dependencies
│   └── dev.txt                  # Dev + test dependencies
├── scripts/
│   └── bootstrap.sh
├── pyproject.toml               # Ruff, Black, mypy, pytest config
├── docker-compose.yml
└── .env.example
```

---

## Quick Start

### Prerequisites
- Python 3.12+
- Docker + Docker Compose

### 1. Clone & configure
```bash
cp .env.example .env
# Edit .env — set GEMINI_API_KEY and SECRET_KEY
```

### 2. Start infrastructure
```bash
docker compose up -d postgres redis
```

### 3. Create virtual environment & install deps
```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements/dev.txt
```

### 4. Run the server
```bash
uvicorn app.main:app --reload
```

Server will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/v1/health
- WebSocket: ws://localhost:8000/api/v1/ws/{user_id}

---

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/` | Service identification |
| `GET` | `/api/v1/health` | Deep health check (DB + Redis) |
| `GET` | `/api/v1/version` | API version metadata |
| `WS` | `/api/v1/ws/{user_id}` | WebSocket connection |

---

## Development Commands

```bash
# Lint
ruff check app/ tests/

# Format
black app/ tests/

# Type check
mypy app/

# Run tests
pytest

# Run all checks
ruff check . && black --check . && mypy app/ && pytest
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full list.

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async DSN |
| `REDIS_URL` | Redis DSN |
| `SECRET_KEY` | JWT signing secret (must be strong in production) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `ENVIRONMENT` | `development` / `staging` / `production` |
| `LOG_FORMAT` | `json` (production) or `console` (development) |

---

## Architecture Decisions

- **Factory pattern** for app creation — `create_application()` in `main.py`
- **Async-first** — all I/O uses `asyncio` / `await`
- **Repository pattern** — DB access isolated from business logic
- **Dependency injection** — session, redis, and auth via FastAPI `Depends`
- **Structured logging** — `structlog` with JSON output in production
- **Lifespan management** — `@asynccontextmanager` for startup/shutdown hooks
- **Environment isolation** — `pydantic-settings` with `.env` support

---

## Roadmap

- **Phase 2**: AI agents, LangGraph workflows, Gemini integration
- **Phase 3**: Authentication, RBAC, user management
- **Phase 4**: Domain-specific civic intelligence modules
