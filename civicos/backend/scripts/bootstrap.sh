#!/usr/bin/env bash
# =============================================================================
# CivicOS Backend — Local Development Bootstrap
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀  CivicOS backend bootstrap starting..."

# ── 1. Copy env file ──────────────────────────────────────────────────────
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "📋  Creating .env from .env.example..."
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  echo "⚠️   Edit $BACKEND_DIR/.env and set your GEMINI_API_KEY and SECRET_KEY."
fi

# ── 2. Virtual environment ────────────────────────────────────────────────
if [[ ! -d "$BACKEND_DIR/.venv" ]]; then
  echo "🐍  Creating Python virtual environment..."
  python3 -m venv "$BACKEND_DIR/.venv"
fi

source "$BACKEND_DIR/.venv/bin/activate"

# ── 3. Install dependencies ───────────────────────────────────────────────
echo "📦  Installing dependencies..."
pip install --upgrade pip --quiet
pip install -r "$BACKEND_DIR/requirements/dev.txt" --quiet

# ── 4. Start services ─────────────────────────────────────────────────────
echo "🐳  Starting Docker services (PostgreSQL + Redis)..."
docker compose -f "$BACKEND_DIR/docker-compose.yml" up -d postgres redis

echo "⏳  Waiting for PostgreSQL to be ready..."
until docker compose -f "$BACKEND_DIR/docker-compose.yml" exec postgres pg_isready -U civicos -d civicos > /dev/null 2>&1; do
  sleep 1
done

echo "✅  PostgreSQL is ready."

# ── 5. Run migrations ─────────────────────────────────────────────────────
# echo "🔄  Running Alembic migrations..."
# cd "$BACKEND_DIR" && alembic upgrade head

# ── 6. Done ───────────────────────────────────────────────────────────────
echo ""
echo "✅  Bootstrap complete!"
echo "   Run the server with:"
echo "   cd backend && uvicorn app.main:app --reload"
echo ""
