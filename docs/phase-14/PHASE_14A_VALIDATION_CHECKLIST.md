# Phase 14A — Validation Checklist

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Companion** | `PHASE_14A_PLATFORM_BACKEND_VALIDATION_REPORT.md` |
| **Date** | 2026-08-08 |

Legend: ✅ pass · ⏭ deferred · ⚠ noted non-blocking

| # | Exit criterion | Result |
|---|----------------|--------|
| A | Clean DB rebuild succeeds | ✅ |
| B | Migration chain reproducible | ✅ |
| C | gce-dev drift reviewed | ✅ (legacy supersets only) |
| D | Generated DB types match schema | ✅ identical |
| E | Legacy migration posture documented | ✅ |
| F | RBAC regression passes | ✅ |
| G | RLS regression passes | ✅ (phase2/4 + domain) |
| H | Workspaces/access isolation | ✅ |
| I | Connect backend | ✅ |
| J | Connect BDP backend | ✅ |
| K | Marketplace backend | ✅ |
| L | Enterprise backend | ✅ |
| M | Finance invariants | ✅ |
| N | No-double-commission | ✅ |
| O | Lead Assist backend | ✅ |
| P | Customer CX backend | ✅ |
| Q | Phase 12 ops-governance | ✅ |
| R | Phase 13 admin/ops | ✅ |
| S | Job system | ✅ (prior + schema presence) |
| T | Feature flags audited | ✅ |
| U | Concurrency critical paths | ✅ |
| V | Security regression no P0/P1 | ✅ |
| W | typecheck | ✅ |
| X | Canonical tests | ✅ |
| Y | build | ✅ |
| Z | Frontend gap inventory | ✅ |
| AA | Frontend–backend contract map | ✅ |
| AB | Phase 14B deferred explicitly | ✅ |
| AC | No final-website readiness claim | ✅ |

## Commands

```bash
# Clean rebuild (requires local Postgres prepared as postgres OS user)
bash scripts/phase14a/clean_rebuild.sh

# Phase 14A suite
PHASE14A_PGHOST=/var/run/gce-phase14a-pg PHASE14A_PGPORT=55433 \
  npx vitest run tests/integration/phase14a.platform-validation.test.ts

npm run typecheck && npm test && npm run build
```

## Phase status

- **Phase 14A** — COMPLETE
- **Phase 14B** — DEFERRED UNTIL FINAL FRONTEND REDEVELOPMENT
- **Phase 14 overall** — NOT COMPLETE
