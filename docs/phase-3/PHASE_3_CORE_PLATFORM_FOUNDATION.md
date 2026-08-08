# Phase 3 — Core Platform Foundation

| Field | Value |
|-------|-------|
| **Phase** | 3 |
| **Status** | Documentation — implementation-ready |
| **Classification** | Mixed: **Business** boundaries from Founder Decisions; **Technical** stack/ops from ADRs and engineering docs |
| **Date** | 2026-08-08 |

---

## 1. Authority

| Priority | Source | Owns |
|----------|--------|------|
| Highest business | `docs/founder-decisions/` (esp. FD-034, FD-035, FD-039) | Legal entity, identity/workspace principles, Phase 2 inactive gates |
| Living core | `docs/core/` | Narrative architecture, deployment (`24_Deployment_Architecture.md`), commercial constants pointer |
| Engineering | `docs/engineering/` (esp. 29–33), `.cursor/rules/` | Coding standards, architecture, security/performance practices |
| Technical ADRs | `docs/phase-2/adrs/` | Accepted technical defaults (not Founder law) |
| Design | `design-system/MASTER.md`, UI UX Pro Max skill | Visual tokens when UI is touched |

**Label key used in this file**

- **Business** — Founder-approved product/operating rule
- **Technical** — Engineering recommendation (ADR / stack choice); may change via ADR without FD change
- **PENDING PROFESSIONAL VALIDATION** — Legal, tax, accounting, security, or compliance gate before production money/PII movement

Do **not** invent commercial numbers. Prefer `docs/core/36_Commercial_Constants.md` and owning FDs.

---

## 2. Purpose

Establish the shared engineering foundation for all later vertical phases: repository layout, TypeScript/ESLint discipline, domain boundaries, shared types/validation, error handling, logging/observability, feature flags, environment/secrets, Supabase client patterns, server/client boundaries, API conventions, background jobs, CI/CD, deployment/rollback, package governance, technical debt policy, and definition of done.

Phase 3 does **not** ship a vertical product; it makes Phases 4–8 implementable without re-litigating platform primitives.

---

## 3. Scope

**In scope (Technical unless noted)**

1. Canonical repo structure and ownership of folders
2. Coding standards (TypeScript strictness, ESLint, Next.js conventions for installed version)
3. Domain module boundaries and shared type locations
4. Input validation strategy (Zod recommended)
5. Error taxonomy and user-safe messaging
6. Structured logging + Sentry integration patterns
7. Feature flags for inactive / validation-gated capabilities (**Business** inactive list from FD-039)
8. Environment variables and secrets hygiene
9. Supabase clients: browser, server (SSR cookie), service role
10. Server Actions vs Route Handlers (ADR-009)
11. Background / scheduled jobs (ADR-014)
12. CI/CD via GitHub Actions + documented build/deploy hook on VPS
13. Deployment and rollback on VPS/PM2/Nginx (ADR-012)
14. Package governance and dependency review
15. Technical debt policy and Definition of Done

**Stack (Technical — current package baseline)**

| Layer | Choice |
|-------|--------|
| Framework | Next.js **16.2.4** (App Router) |
| UI runtime | React **19** |
| Backend data/auth | Supabase (Auth + PostgreSQL + RLS) |
| Styling | Tailwind CSS |
| Client state | Zustand |
| Motion | `motion` |
| Observability | Sentry (`@sentry/nextjs`) |
| PWA | `next-pwa` (delivery model; native apps inactive — FD-039) |

When Next.js behaviour is unclear, read installed docs under `node_modules/next/dist/docs/` before coding (**Technical**).

---

## 4. Not in scope

- Vertical business workflows (membership, BDP, Marketplace, Enterprise) — Phases 5–8
- Full RLS policy SQL authoring — Phase 4 / security matrices + ADR-005
- Payment gateway production cutover / MoR GST configuration — **PENDING PROFESSIONAL VALIDATION** (FD-039)
- Wallet cash-out, Affiliate commercial activation, paid Lead Assist, Core direct purchase — **inactive** (FD-039)
- Mandatory Docker / Edge production architecture — **not required** (FD-039 / ADR-012)
- Inventing pilot city, tax rates, or refund percentages

---

## 5. Dependencies

| Dependency | Why |
|------------|-----|
| Phase 2 ADRs (001–014) | Auth, RBAC model, workspace routing, schema SoT, RLS, payments/webhooks, ledger, state machines, API, audit, migration, env, flags, jobs |
| FD-034 | Logixia operates platform; contracting/payment-receiving principles |
| FD-035 / FD-023 | Identity and AuthZ must be enforceable on every privileged path |
| FD-039 | Inactive features, technical defaults, MoR validation gates |
| `docs/core/24_Deployment_Architecture.md` | Hostinger VPS, PM2, Nginx, GitHub Actions narrative |
| Design system / UI skills | Only when Phase 3 touches shared UI shells |

---

## 6. Entry criteria

- Phase 2 ADRs accepted and referenced from this phase
- Founder Decisions FD-023/034/035/039 available as authority
- Repo builds with declared Next/React versions
- Supabase project(s) exist for local/staging at minimum (ops-owned)
- Secrets vault / env injection path known for staging (**Technical** ops)

## 7. Exit criteria

- Documented client factories exist (or are scheduled) for browser/server/service with no service-role leakage
- ADR-009/013/014 patterns reflected in engineering checklists
- CI lint + typecheck + build gate green on mainline
- Staging deploy via GitHub Actions → VPS/PM2 documented with rollback steps
- Feature-flag defaults keep FD-039 inactive items off in pilot/prod
- Definition of Done checklist adopted for subsequent phases
- No code in this phase invents commercial SKUs

---

## 8. Domain model summary

Phase 3 owns **platform primitives**, not vertical entities.

| Concern | Boundary | Label |
|---------|----------|-------|
| User identity base | Permanent User; roles are assignments (FD-035) | Business |
| Workspace context | Routing/session context, not a legal entity (FD-035) | Business |
| Domain services | `lib/` (or equivalent) pure server-callable modules per vertical | Technical |
| Shared types | `types/` + generated Supabase types; no business rules in DTO-only files | Technical |
| Feature flags | Env/config module; flag ≠ Founder approval (ADR-013) | Technical + Business gate |
| Jobs | Idempotent workers; service credentials only on trusted hosts (ADR-014) | Technical |
| Audit/observability events | Correlate request/job/actor (ADR-010) | Technical |

**Domain boundaries (Technical recommendation)**

```text
app/          → routes, layouts, Server Actions colocated with UI, Route Handlers
components/   → presentational + shared UI (shadcn/ui patterns)
lib/          → domain services, clients, validators, flag config, logging helpers
types/        → shared TS types / enums mirrors (business enums deferred to design)
docs/         → business + engineering + phase docs (source of truth hierarchy)
supabase/     → migrations, policies, config (schema SoT per ADR-004)
context/      → React providers (non-authoritative UI state only)
public/       → static + PWA assets
scripts/      → deploy/ops helpers (no secrets)
```

Cross-vertical coupling rules:

1. Vertical domain services must not import UI components.
2. Money / attribution / settlement logic must be server-authoritative (FD-020/021).
3. Client state (Zustand) is never the authority for permissions or balances.

---

## 9. Workflows

### 9.1 Local development (**Technical**)

1. Install deps from lockfile; do not silently upgrade majors.
2. Use env templates; never commit `.env` secrets.
3. Run `eslint`, TypeScript check, and `next build` before PR.
4. Prefer Server Components by default; mark client components only when needed.

### 9.2 Change → CI → deploy (**Technical**)

1. PR triggers GitHub Actions: lint, typecheck, unit/smoke tests as available, build.
2. Merge to protected branch promotes to staging deploy hook on VPS.
3. Staging smoke (auth login, health, no service-role in client bundle).
4. Pilot/prod promotion is gated by ops checklist + any FD-039 validation items for money movement.

### 9.3 Feature-flag workflow (**Technical** + **Business**)

1. New incomplete capability ships behind a flag defaulting **off** in pilot/prod.
2. Founder-inactive items (Affiliate, cash-out, paid Lead Assist, Core purchase, etc.) remain off until Founder approval — flag flip alone is insufficient (ADR-013 / FD-039).
3. Material flag changes in pilot/prod are auditable (ADR-010).

### 9.4 Incident / rollback (**Technical**)

1. Prefer PM2 process restart to last known good release artifact.
2. Keep prior build artifact or git SHA deployable.
3. DB migrations: expand/contract; never rely on irreversible destructive migrations without backup plan (ADR-004).
4. Financial anomalies escalate to Finance/Compliance paths — not silent “fix-forward deletes” (ADR-007/010).

---

## 10. Coding standards (**Technical**)

| Topic | Rule |
|-------|------|
| Language | TypeScript; avoid `any` except documented escape hatches |
| Lint | ESLint with `eslint-config-next` for installed Next version |
| Imports | Prefer absolute aliases already in `tsconfig`; no circular domain imports |
| React | Follow repo React Compiler / hooks guidance; do not add `useMemo`/`useCallback` by default |
| UI | Reuse shadcn/ui + design system; UI UX Pro Max when creating/modifying UI |
| Docs before code | AGENTS.md priority order; do not invent business rules |
| Next.js | Consult installed Next docs for App Router/caching/routing unknowns |

---

## 11. Shared types and validation

| Topic | Guidance | Label |
|-------|----------|-------|
| Shared types | Place cross-route types in `types/`; generate DB types from Supabase | Technical |
| Validation | **Zod recommended** for Server Action / Route Handler inputs and webhook payloads | Technical |
| Business enums | Prefer documenting against state machines in `docs/state-machines/`; exact DB enum names **Pending Technical Design** unless FD-locked | Technical |
| Money amounts | Store minor units / numeric types per ledger ADR; never float for money in domain services | Technical |

---

## 12. Error handling and logging

| Layer | Behaviour | Label |
|-------|-----------|-------|
| Domain errors | Typed error codes; map to safe user messages | Technical |
| AuthZ failures | Generic deny; no scope leakage in messages | Business + Technical |
| Logging | Structured logs with request/job id, actor user id (where lawful), workspace/role context | Technical |
| Sentry | Capture unexpected exceptions; scrub PII/secrets; tag env/release | Technical |
| Financial | Never log full PANs / raw PSP secrets; correlate payment ids only | PENDING PROFESSIONAL VALIDATION / Security |

---

## 13. Feature flags

See **ADR-013**. Defaults must keep FD-039 inactive surfaces off in pilot/prod, including (non-exhaustive): Marketplace Affiliate commercial activation, wallet cash-out, paid Lead Assist, Core Tier direct purchase, ZBP commercial model, Super Admin as ordinary product role.

MoR production ticket money movement requires professional validation — not a casual flag (**PENDING PROFESSIONAL VALIDATION**, FD-039).

---

## 14. Environment and secrets

| Class | Examples | Rule | Label |
|-------|----------|------|-------|
| Public | Supabase URL, anon/publishable key | Safe for browser | Technical |
| Server | Session cookie secrets, server env | Server only | Technical |
| Privileged | Supabase **service role**, PSP webhook secrets | Server/trusted workers only; never client bundle | Technical + Security |
| Per-env | `local` / `staging` / `pilot` / `prod` (ADR-012) | Isolated projects or clear isolation | Technical |

---

## 15. Supabase clients and server/client boundaries

| Client | Use | Label |
|--------|-----|-------|
| Browser | User-scoped reads/writes under RLS | Technical |
| Server (SSR/`@supabase/ssr`) | Cookie session in RSC, Server Actions, middleware/proxy | Technical |
| Service role | Trusted Route Handlers, jobs, controlled admin backends; **bypasses RLS** | Technical (ADR-005) |

**Hard rules**

1. Service role never shipped to browser/PWA.
2. Application RBAC still enforced in domain services; RLS is defence-in-depth, not SoD substitute (FD-023/035).
3. Prefer Server Actions for authenticated in-app mutations; Route Handlers for webhooks/public callbacks (ADR-009).

---

## 16. API conventions (ADR-009)

| Entrypoint | Prefer for | Must validate |
|------------|------------|---------------|
| Server Actions | Authenticated UI mutations | AuthN/AuthZ, Zod schema, CSRF/cookie considerations, state-machine rules |
| Route Handlers | Webhooks, unauthenticated callbacks, M2M | Signature verification / AuthZ, idempotency for money paths |
| Shared domain services | Both entrypoints | Single source of business enforcement |

**Label:** Technical recommendation — not Founder law. Governing FDs: FD-023/035 AuthZ; FD-020/021 financial authority; FD-039 technical defaults.

---

## 17. Background and scheduled jobs (ADR-014)

Categories: webhook retry/outbox, settlement eligibility sweeps/holds (FD-021), offline Admin bank reconciliation helpers (FD-039), notifications, backfills.

Execution default: VPS PM2 cron/workers and/or Supabase scheduled functions where appropriate. Managed queues optional. Money-adjacent jobs must be idempotent and concurrency-safe.

---

## 18. CI/CD, deployment, rollback

| Topic | Decision | Label |
|-------|----------|-------|
| CI | GitHub Actions: lint, typecheck, build, tests | Technical |
| Host | Linux VPS + Nginx + PM2 (Hostinger path in core deployment doc) | Technical (ADR-012) |
| Deploy hook | Post-CI SSH/deploy script or documented build hook on VPS | Technical |
| Docker/Edge | Optional future; **not mandatory** | Business (FD-039) |
| Rollback | Redeploy previous artifact/SHA; avoid destructive DB reverse without plan | Technical |
| PWA | Remains delivery model | Technical |

Exact VPS SKU, Nginx snippets, and banking-day SLAs are ops-owned / not Founder law.

---

## 19. Package governance (**Technical**)

1. Prefer lockfile installs; review majors for Next/React/Supabase.
2. No dependency that requires shipping secrets to the client.
3. Prefer existing stack (Zustand, motion, Sentry) before adding parallel libraries.
4. Remove unused deps in the same PR that retires usage when practical.
5. Security advisories triaged before pilot money movement (**PENDING PROFESSIONAL VALIDATION** for high-severity).

---

## 20. Technical debt policy (**Technical**)

| Class | Policy |
|-------|--------|
| Blocker debt | Security, money integrity, AuthZ holes — fix before pilot/prod relevant surface |
| Scheduled debt | Tracked issues with owner/phase; no silent TODOs in money paths |
| Speculative rewrites | Forbidden without ADR |
| Docs drift | Update owning FD/core/constants first when business numbers change; then code |

---

## 21. Definition of Done (platform + feature)

A change is done when:

1. Matches Founder Decisions / core docs; unresolved items remain unresolved
2. AuthN/AuthZ + validation on privileged mutations
3. RLS considered for new tables (ADR-005)
4. State-machine transitions respected where applicable
5. Feature flags default correctly for inactive items
6. Lint + types + build pass in CI
7. Observability: meaningful errors to Sentry/logs without secret leakage
8. Audit events for material business/financial actions (ADR-010)
9. Docs updated if contracts/permissions/flags change
10. No activation of FD-039 inactive commercial paths

---

## 22. Permissions notes

Phase 3 does not define the full matrix. Implementers must read:

- `docs/founder-decisions/FD-023_RBAC_and_Permissions.md`
- `docs/founder-decisions/FD-035_GCE_Identity_Role_Assignment_and_Workspace_Architecture.md`
- Pointer matrices (when present): `docs/security/RBAC_PERMISSION_MATRIX.md`, `docs/security/RLS_ACCESS_MATRIX.md`

Root/emergency capability is **not** an ordinary product role (FD-035 / FD-039).

---

## 23. State machines refs

Platform foundation consumes ADR-008 patterns. Vertical machines live under `docs/state-machines/` (see Phase 5–8 for domain-specific refs). Payment/Settlement/Commission machines are relevant to job design.

---

## 24. Risks

| Risk | Mitigation |
|------|------------|
| Service role leakage | Bundle audits; env separation; CI checks |
| Flag misconfiguration enabling inactive commerce | Defaults off; audit flag changes; DoD checklist |
| Dual API styles without shared services | Enforce domain service reuse (ADR-009) |
| Job double-posting money | Idempotency keys / locks (ADR-014/007) |
| Docs/code drift on Next APIs | Always consult installed Next docs |

---

## 25. Unresolved items

| Item | Status |
|------|--------|
| Exact pilot city | Undecided (FD-039) — must not block architecture |
| Managed queue vendor | Optional later |
| Exact cron SLAs | Pending Technical Design |
| Tax/GST rates, TDS, MoR invoice config | PENDING PROFESSIONAL VALIDATION |
| Public OpenAPI catalogue | Out of scope |
| Partner lead-ingest API programme | Inactive (FD-039) |

---

## 26. Implementation notes (Technical)

1. Create thin factories: `createBrowserClient`, `createServerClient`, `createServiceClient` with clear import lint boundaries.
2. Colocate Zod schemas next to actions/handlers; share types with forms.
3. Centralise flag reads in one server module; expose only booleans needed by UI.
4. Prefer expand-migrate-contract for schema; never delete financial history rows.
5. Keep `docs/phase-2/adrs/` as the citation source when code comments explain “why.”
6. Reuse-first: inspect `lib/`, `components/`, `app/` before new packages.
7. Sentry release = git SHA; attach env tags `staging|pilot|prod`.
8. Background workers must not run with anon key for privileged sweeps.
9. Definition of Done above is the PR template baseline for Phases 4–8.
10. This phase is documentation-authoritative for foundation; code lands in later implementation waves without changing FD numbers.

---

## 27. Cross references

- ADRs: `docs/phase-2/adrs/ADR-009_API_Server_Actions_Route_Handlers.md`, `ADR-012`, `ADR-013`, `ADR-014`, `ADR-005`, `ADR-010`
- Deployment narrative: `docs/core/24_Deployment_Architecture.md`
- Coding rules: `docs/engineering/33_Cursor_Coding_Rules.md`
- Master agent rules: `AGENTS.md`
