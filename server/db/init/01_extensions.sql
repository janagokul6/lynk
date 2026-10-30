-- Enable common extensions that support queues, analytics, and search.
-- This runs only when the Postgres data directory is first created.

CREATE EXTENSION IF NOT EXISTS pgcrypto;      -- UUIDs, crypto helpers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- Alternative UUID generation
CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- Trigram search for fuzzy matching
CREATE EXTENSION IF NOT EXISTS btree_gin;     -- Better indexes for composite / range queries

