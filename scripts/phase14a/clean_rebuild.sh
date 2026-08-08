#!/usr/bin/env bash
# Phase 14A — clean DB rebuild of canonical Phase 2–13 migrations.
# Applies ONLY 20260808* migrations (excludes sample/test/city WIP).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SOCKDIR="${PHASE14A_PGHOST:-/var/run/gce-phase14a-pg}"
PGPORT="${PHASE14A_PGPORT:-55433}"
PGUSER="${PHASE14A_PGUSER:-postgres}"
PGDATABASE="${PHASE14A_PGDATABASE:-gce_phase14a_rebuild}"
PSQL_BIN="${PHASE14A_PSQL:-/usr/lib/postgresql/18/bin/psql}"
REPORT_DIR="${PHASE14A_REPORT_DIR:-$ROOT/.tmp/phase14a}"
mkdir -p "$REPORT_DIR"

psql_cmd() {
  "$PSQL_BIN" -h "$SOCKDIR" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 "$@"
}

echo "=== Phase 14A clean rebuild ===" | tee "$REPORT_DIR/rebuild.log"
echo "host=$SOCKDIR port=$PGPORT db=$PGDATABASE" | tee -a "$REPORT_DIR/rebuild.log"
date -u +"%Y-%m-%dT%H:%M:%SZ" | tee -a "$REPORT_DIR/rebuild.log"

# Drop & recreate public objects by resetting database when possible
if [[ "${PHASE14A_DROP_SCHEMA:-1}" == "1" ]]; then
  psql_cmd -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT USAGE ON SCHEMA public TO public;"
  psql_cmd -c "DROP SCHEMA IF EXISTS auth CASCADE;"
fi

START=$(date +%s)
psql_cmd -f "$ROOT/scripts/phase14a/bootstrap_empty_postgres.sql" >>"$REPORT_DIR/rebuild.log" 2>&1
echo "BOOTSTRAP_OK" | tee -a "$REPORT_DIR/rebuild.log"

mapfile -t MIGRATIONS < <(ls -1 "$ROOT"/supabase/migrations/20260808*.sql | sort)
echo "migration_count=${#MIGRATIONS[@]}" | tee -a "$REPORT_DIR/rebuild.log"

i=0
for f in "${MIGRATIONS[@]}"; do
  i=$((i + 1))
  base=$(basename "$f")
  echo "[$i/${#MIGRATIONS[@]}] APPLY $base" | tee -a "$REPORT_DIR/rebuild.log"
  t0=$(date +%s%3N)
  if ! psql_cmd -f "$f" >>"$REPORT_DIR/rebuild.log" 2>&1; then
    echo "FAIL $base" | tee -a "$REPORT_DIR/rebuild.log"
    exit 1
  fi
  t1=$(date +%s%3N)
  echo "OK $base duration_ms=$((t1 - t0))" | tee -a "$REPORT_DIR/rebuild.log"
done

END=$(date +%s)
echo "TOTAL_SECONDS=$((END - START))" | tee -a "$REPORT_DIR/rebuild.log"

# Post-apply grants for RLS harness usability
psql_cmd -c "GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role; GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role; GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role; GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;" >>"$REPORT_DIR/rebuild.log" 2>&1

# Schema inventory
psql_cmd -At -c "select tablename from pg_tables where schemaname='public' order by 1;" >"$REPORT_DIR/rebuild_tables.txt"
psql_cmd -At -c "select typname from pg_type t join pg_namespace n on n.oid=t.typnamespace where n.nspname='public' and t.typtype='e' order by 1;" >"$REPORT_DIR/rebuild_enums.txt"
psql_cmd -At -c "select key||'='||enabled::text from feature_flags order by key;" >"$REPORT_DIR/rebuild_flags.txt"
psql_cmd -At -c "select count(*) from pg_policies where schemaname='public';" >"$REPORT_DIR/rebuild_policy_count.txt"

echo "PHASE14A_CLEAN_REBUILD_OK" | tee -a "$REPORT_DIR/rebuild.log"
echo "tables=$(wc -l <"$REPORT_DIR/rebuild_tables.txt") policies=$(cat "$REPORT_DIR/rebuild_policy_count.txt")" | tee -a "$REPORT_DIR/rebuild.log"
