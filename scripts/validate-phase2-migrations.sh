#!/usr/bin/env bash
# Static + optional local apply validation for Phase 2 migrations.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
M1="$ROOT/supabase/migrations/20260808130000_phase2_architecture_foundation.sql"
M2="$ROOT/supabase/migrations/20260808140000_phase2_background_jobs.sql"
M3="$ROOT/supabase/migrations/20260808141000_phase2_workspace_preference_default.sql"

test -f "$M1"
test -f "$M2"
test -f "$M3"
grep -q "CREATE TABLE IF NOT EXISTS public.role_assignments" "$M1"
grep -q "ENABLE ROW LEVEL SECURITY" "$M1"
grep -q "CREATE TABLE IF NOT EXISTS public.background_jobs" "$M2"
grep -q "default_workspace_key" "$M3"
grep -q "grants_entitlement boolean NOT NULL DEFAULT false" "$M1"
echo "phase2_migrations_static_ok"

PSQL_BIN="${PHASE2_PSQL:-/usr/lib/postgresql/18/bin/psql}"
if [[ "${PHASE2_PGHOST:-}" != "" && -x "$PSQL_BIN" ]]; then
  for f in "$M1" "$M2" "$M3"; do
    "$PSQL_BIN" -h "$PHASE2_PGHOST" -p "${PHASE2_PGPORT:-55432}" -U "${PHASE2_PGUSER:-gce_phase2}" \
      -d "${PHASE2_PGDATABASE:-gce_phase2_test}" -v ON_ERROR_STOP=1 -f "$f" >/dev/null
  done
  echo "phase2_migrations_local_apply_ok"
else
  echo "phase2_migrations_local_apply_skipped"
fi
