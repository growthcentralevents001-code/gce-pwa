# Phase 2 Implementation Notes

| Field | Value |
|-------|-------|
| **Status** | **PHASE 2 IMPLEMENTATION COMPLETE — NON-BLOCKING LEGACY RECONCILIATION REMAINS** |
| **Date** | 2026-08-08 |
| **Authority** | ADR-001–014; FD-023/035/039; Phase 2 Master Plan |

## What landed

- Additive migrations (applied to **gce-dev**):
  - `20260808130000_phase2_architecture_foundation.sql`
  - `20260808140000_phase2_background_jobs.sql`
  - `20260808141000_phase2_workspace_preference_default.sql`
- Local isolated Postgres validation: apply + idempotent re-apply + RLS integration tests ✅
- **gce-dev** apply + idempotent re-apply ✅
- `lib/database.types.ts` regenerated from **gce-dev** (canonical)
- Canonical entitlement resolver: `resolveActiveEntitlements`
- Workspace preferences + switcher on `/dashboard/[workspaceKey]`
- Background jobs foundation (`background_jobs` + `/api/jobs/run`)
- Observability: structured logging, redaction, correlation IDs, Sentry via `instrumentation.ts`
- Feature flags: 16 total, **0 enabled** on gce-dev (money gates OFF)

## Database apply status

| Target | Status |
|--------|--------|
| Isolated local PG (`gce_phase2_test`) | Applied & verified |
| `gce-dev` (`hvevqoltcwumcvxetxsf`) | **Applied & verified** |
| Production `GROWTH CENTRAL EVENTS` (`tzeqeywezmqslovpflqu`) | **Untouched** |

## ADR-004 SoT

Phase 2 migrations are authoritative for the architecture spine. Full historical legacy schema baseline remains a **non-blocking** reconciliation track — see `SCHEMA_SOT_RECONCILIATION.md`.

## Known non-blocking legacy risks on gce-dev

- RLS disabled on `venues`, `zbp_partners`, `zbp_applications` (pre-existing)
- Many routes still read `user_roles` for compatibility; new architecture must not treat it as entitlement

## Verification commands

```bash
npm run typecheck
npm test
npm run db:phase2:validate
```
