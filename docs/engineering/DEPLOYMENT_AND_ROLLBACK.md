# Deployment & Rollback Conventions

| Field | Value |
|-------|-------|
| **Environments** | local → development (gce-dev) → staging → pilot/production |
| **Date** | 2026-09-03 |

## Environments

| Env | Supabase | Notes |
|-----|----------|-------|
| local | Local PG / linked tools | Never production credentials in client bundles |
| development | **gce-dev** (`hvevqoltcwumcvxetxsf`) | Primary integration DB for architecture |
| production | GROWTH CENTRAL EVENTS | Money flags OFF until validation |

## gce-dev application deploy (VPS)

Live PM2 `gce-dev` serves `/root/gce-pwa-dev/.next` on `127.0.0.1:3000`. Nginx is unchanged.

**Do not** `rm -rf .next` in the live tree while PM2 is running. A failed or interrupted build leaves no `BUILD_ID` and returns 502.

### Sequence (`scripts/deploy-dev.sh`)

1. Lock (`/var/lock/gce-dev-deploy.lock`). Refuse a second concurrent deploy.
2. Update **staging worktree only** (`/root/gce-pwa-dev-staging`): detached `origin/development` (live already has `development` checked out).
3. Copy `.env.local` / `.env` into staging (values not logged).
4. `npm ci` + `npm run build` in staging. Live `.next` is not deleted.
5. Abort if staging `.next/BUILD_ID` is missing. Live site stays on the previous artifact.
6. If `package-lock.json` changed, rsync staging `node_modules` to live immediately before restart.
7. Atomic swap: live `.next` → `.next.prev`, staging `.next` → live `.next`.
8. `pm2 restart gce-dev` only. Never restart `gce-prod`.
9. Probe `http://127.0.0.1:3000/api/health/live` and `/` for HTTP 200.
10. On success: `pm2 save`; keep one `.next.prev`.
11. On health failure: restore `.next.prev`, restart `gce-dev`, re-probe.

GitHub Actions (`.github/workflows/deploy-dev.yml`) runs this script via `systemd-run --wait --collect` so an SSH blip does not SIGHUP a mid-build deploy. The live tree is **not** `git pull`ed by this script (Cursor/workspace may be dirty).

Local `git commit` must **not** run `next build` on this clone (pre-commit hook is a no-op). CI `npm run build` stays in `.github/workflows/ci.yml`.

Self-check without compiling: `./scripts/deploy-dev.sh --self-test`.

## Deploy sequence (application)

1. CI green: typecheck, `lint:phase3`, tests, build.
2. gce-dev: `scripts/deploy-dev.sh` (staging build + atomic `.next` swap) as above.
3. Apply pending migrations to target env (gce-dev first; production only with ops approval).
4. Regenerate `lib/database.types.ts` from target when schema changed.
5. PM2 reload / Nginx as documented in `docs/core/24_Deployment_Architecture.md`.
6. Smoke: `/api/health/live`, `/api/health/ready`, login path, no service-role in client bundle.

## Rollback

### Application (gce-dev)

Automatic: `scripts/deploy-dev.sh` restores `.next.prev` if post-restart health fails.

Manual:

```bash
mv /root/gce-pwa-dev/.next /root/gce-pwa-dev/.next.bad
mv /root/gce-pwa-dev/.next.prev /root/gce-pwa-dev/.next
pm2 restart gce-dev
curl -fsS http://127.0.0.1:3000/api/health/live
```

Code rollback: fix/revert on `development`, then re-run `scripts/deploy-dev.sh` (do not wipe live `.next` first).

### Application (production)

1. Redeploy previous known-good git SHA / PM2 artifact on **gce-prod only**.
2. Confirm liveness/readiness.
3. Do not use `scripts/deploy-dev.sh` against `/root/gce-pwa-prod`.

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
