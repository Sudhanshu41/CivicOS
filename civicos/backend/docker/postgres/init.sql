-- CivicOS PostgreSQL Initialisation
-- Runs once when the container is first created.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pg_trgm for full-text search trigrams
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Timezone
SET timezone = 'UTC';
