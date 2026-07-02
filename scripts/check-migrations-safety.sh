#!/usr/bin/env bash
set -Eeuo pipefail

ALLOW_DESTRUCTIVE="${1:-}"

MIGRATIONS_DIR="supabase/migrations"
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "No migrations directory — nothing to check."
  exit 0
fi

PATTERNS='DROP[[:space:]]+(TABLE|SCHEMA|DATABASE|INDEX|VIEW|FUNCTION|TYPE|TRIGGER|COLUMN)|TRUNCATE[[:space:]]+TABLE|DELETE[[:space:]]+FROM[[:space:]]+[^;]+;'

FOUND=0
for file in "$MIGRATIONS_DIR"/*.sql; do
  [ -f "$file" ] || continue
  if grep -Eiq "$PATTERNS" "$file"; then
    echo "DESTRUCTIVE SQL detected in: $file"
    grep -Ein "$PATTERNS" "$file" || true
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ] && [ "$ALLOW_DESTRUCTIVE" != "--allow-destructive" ]; then
  echo ""
  echo "BLOCKED: Destructive SQL requires manual approval."
  echo "Review in PR, then use workflow_dispatch with allow_destructive=true on production environment."
  exit 1
fi

echo "Migration safety check passed."
