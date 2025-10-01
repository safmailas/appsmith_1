#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/supabase-local-restore-backup.sh /path/to/db_cluster.backup 15.6.1.115
BACKUP_FILE=${1:-}
PG_VERSION=${2:-}

if [[ -z "${BACKUP_FILE}" ]]; then
  echo "Usage: $0 /path/to/db_cluster.backup <postgres_image_version>"
  exit 1
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI not found. Install from https://supabase.com/docs/guides/local-development/getting-started"
  exit 1
fi

mkdir -p supabase/.temp
if [[ -n "${PG_VERSION:-}" ]]; then
  echo "${PG_VERSION}" > supabase/.temp/postgres-version
fi

supabase init >/dev/null 2>&1 || true
supabase db start --from-backup "${BACKUP_FILE}"

echo "Connect locally: psql 'postgresql://postgres:postgres@localhost:54322/postgres'"
