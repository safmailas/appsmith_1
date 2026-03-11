#!/usr/bin/env bash
set -euo pipefail

PSQL_URL=${1:-"postgresql://postgres:postgres@localhost:54322/postgres"}

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found. Install PostgreSQL client."
  exit 1
fi

psql "${PSQL_URL}"
