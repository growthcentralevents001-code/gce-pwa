# Dependency & Package Governance

| Field | Value |
|-------|-------|
| **Type** | Technical policy |
| **Date** | 2026-08-08 |

## Rules

1. Prefer the existing stack: Next.js, React, Supabase, Zod, Vitest, Tailwind, Zustand, motion, Sentry.
2. Do not add a parallel library when an approved package already covers the need.
3. Never introduce a dependency that requires shipping secrets to the browser.
4. Distinguish `dependencies` vs `devDependencies` correctly.
5. Install from the lockfile in CI (`npm ci`).
6. Major upgrades of Next/React/Supabase require an explicit review note in the PR.
7. Security advisories affecting money/auth paths are triaged before enabling money flags.
8. Remove unused deps in the same PR that retires their last usage when practical.
9. UI-only WIP dependencies must not block architecture commits — isolate via allowlists.

## Current Phase 3 rationale

| Package | Why |
|---------|-----|
| `zod` | Shared validation (Phase 2/3) |
| `vitest` | Architecture/unit tests |
| `@sentry/nextjs` | Observability (optional DSN) |
| `@supabase/ssr` + `supabase-js` | Auth/DB clients |

No new production dependency was introduced solely for Phase 3 beyond existing Phase 2 stack.
