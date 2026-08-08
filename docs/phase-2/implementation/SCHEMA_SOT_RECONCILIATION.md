# Schema Source-of-Truth Reconciliation (ADR-004)

| Field | Value |
|-------|-------|
| **Status** | Phase 2 SoT operational on gce-dev; historical legacy baseline dump still pending (non-blocking) |
| **Date** | 2026-08-08 |
| **Dev project** | `gce-dev` (`hvevqoltcwumcvxetxsf`) — matches `.env.local` |
| **Production project** | `GROWTH CENTRAL EVENTS` (`tzeqeywezmqslovpflqu`) — **do not apply from this pass** |

## Problem

Repository `supabase/migrations/` historically contained sample/connection-test files only. Live/dev schemas were created outside repo history. Phase 2 additive migrations introduce architecture tables, but a **fresh empty database cannot yet reconstruct the full legacy product schema** from repo migrations alone.

## Verified environments this pass

| Environment | Action | Result |
|-------------|--------|--------|
| Isolated local PostgreSQL 18 (`gce_phase2_test` on port `55432`) | Applied `20260808130000_*` + `20260808140000_*` | Success; idempotent re-apply success |
| `gce-dev` | Apply Phase 2 additive migrations | **Applied 2026-08-08** (direct psql; recorded in `supabase_migrations.schema_migrations`) |
| Production | None | Untouched |

## Authoritative forward path

1. **Keep** Phase 2 additive migrations in repo as the architecture DDL SoT.
2. **Do not** dump production blindly into one migration.
3. Create a **reviewed legacy baseline** using structure-only dump from **gce-dev** (not prod) once write credentials are available:
   ```bash
   # Requires SUPABASE_DB_PASSWORD for gce-dev
   supabase link --project-ref hvevqoltcwumcvxetxsf
   supabase db dump --linked -s public -f supabase/schema/gce_dev_public_baseline.sql
   ```
4. Convert the dump into an ordered, reviewed baseline migration (IF NOT EXISTS / additive) **before** Phase 2 files in a dedicated branch review.
5. Until then, document live inventory (below) as the compatibility surface.

## Live `gce-dev` public inventory (read-only, 2026-08-08)

Legacy tables observed (no Phase 2 tables present yet on remote):

`users`, `user_roles`, `events`, `venues`, `cities`, `marketplace_affiliates`, `affiliate_*`, `zbp_*`, `bdm_*`, `enterprise_*`, `circle_*`, `offers`, `payments`, `bookings`, `user_wallets`, `platform_settings`, …

RLS notes from advisors:

- RLS disabled on `venues`, `zbp_partners`, `zbp_applications` — **legacy risk**; do not quiet-fix in Phase 2 without Founder/security approval.

## Phase 2 tables (repo migrations)

`profiles`, `organisations`, `organisation_memberships`, `role_assignments`, `role_assignment_events`, `workspaces`, `user_workspace_preferences`, `feature_flags`, `audit_events`, `payment_intents`, `payment_webhook_events`, `ledger_accounts`, `financial_transactions`, `ledger_entries`, `legacy_role_migration_map`, `background_jobs`

## Types strategy

- `lib/database.types.ts` merged: **legacy tables preserved** + Phase 2 tables/enums from local generation.
- Artifact: `lib/database.types.phase2-generated.ts` (Phase 2-only local dump).
- After `gce-dev` apply, regenerate from `gce-dev` and re-merge.

## Commands for Founder/ops to apply Phase 2 to gce-dev

```bash
# From repo root, with DB password for gce-dev write role
supabase db push --linked
# or apply files explicitly via SQL editor / psql with service credentials
psql "$GCE_DEV_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/migrations/20260808130000_phase2_architecture_foundation.sql \
  -f supabase/migrations/20260808140000_phase2_background_jobs.sql
```

## Exit criterion C status

| Criterion | Status |
|-----------|--------|
| Phase 2 DDL reconstructable | **Met** (verified locally) |
| Full legacy schema reconstructable from repo | **Not met** — requires reviewed baseline dump from gce-dev |
| Hidden live-only deps documented | **Met** via inventory + this plan |
