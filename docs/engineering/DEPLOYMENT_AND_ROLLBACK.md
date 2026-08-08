# Deployment & Rollback Conventions

| Field | Value |
|-------|-------|
| **Environments** | local → development (gce-dev) → staging → pilot/production |
| **Date** | 2026-08-08 |

## Environments

| Env | Supabase | Notes |
|-----|----------|-------|
| local | Local PG / linked tools | Never production credentials in client bundles |
| development | **gce-dev** (`hvevqoltcwumcvxetxsf`) | Primary integration DB for architecture |
| production | GROWTH CENTRAL EVENTS | Money flags OFF until validation |

## Deploy sequence (application)

1. CI green: typecheck, `lint:phase3`, tests, build.
2. Build artifact / SHA on VPS.
3. Apply pending migrations to target env (gce-dev first; production only with ops approval).
4. Regenerate `lib/database.types.ts` from target when schema changed.
5. PM2 reload / Nginx as documented in `docs/core/24_Deployment_Architecture.md`.
6. Smoke: `/api/health/live`, `/api/health/ready`, login path, no service-role in client bundle.

## Rollback

### Application

1. Redeploy previous known-good git SHA / PM2 artifact.
2. Confirm liveness/readiness.

### Database

1. Prefer **forward-fix** migrations.
2. Avoid destructive down migrations.
3. Use feature flags for unsafe capability rollback.
4. Take backups before risky production DDL.
5. Never delete financial history rows to “fix” incidents.

### Money

Marketplace ticket payments and settlement_execution remain **OFF** until professional validation and Founder enablement.

## Secrets

- Server-only: service role, cron secret, PSP webhook secrets.
- Public: Supabase URL + anon key.
- Never log secrets.
