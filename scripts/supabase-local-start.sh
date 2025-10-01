#!/usr/bin/env bash
set -euo pipefail

# Starts Supabase local stack
if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI not found. Install from https://supabase.com/docs/guides/local-development/getting-started"
  exit 1
fi

mkdir -p supabase/.temp
supabase init >/dev/null 2>&1 || true
supabase start
