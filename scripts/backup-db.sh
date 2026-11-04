#!/usr/bin/env bash
# Dump the Lynk Postgres database. Requires pg_dump on PATH.
# Usage: DATABASE_URL=postgresql://lynk:lynk@127.0.0.1:5432/lynk ./scripts/backup-db.sh [output-dir]
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

out_dir="${1:-./backups}"
mkdir -p "$out_dir"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
file="${out_dir}/lynk-${stamp}.dump"
pg_dump --format=custom --no-owner --file="$file" "$DATABASE_URL"
echo "$file"
