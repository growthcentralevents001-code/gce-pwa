# Phase 2 Technical ADRs — Index

Architecture Decision Records (ADRs) for the GCE PWA Phase 2 technical architecture.

**Authority:** Founder Decisions (`docs/founder-decisions/FD-001`, `FD-020`–`FD-039`) own business rules. These ADRs lock **technical defaults**. Items labelled *not Founder law* may change via a superseding ADR without rewriting commercial Founder Decisions. Never invent GST/TDS rates, MoR implementation details, or inactive commercial entitlements here.

**Stack (verified):** Next.js 16.2.4 App Router, React 19, Supabase JS + `@supabase/ssr`, PostgreSQL via Supabase, `next-pwa`, Tailwind, Zustand, motion, Sentry (devDependency), Razorpay as India PSP *candidate*, Hostinger VPS / PM2 / Nginx history, GitHub Actions.

**Status legend:** All listed ADRs are **Accepted** unless a future ADR supersedes them.

---

## ADR catalogue

| ID | Title | Status | Decision (one-liner) | Rationale (one-liner) | Supersedes | Dependencies |
|----|-------|--------|----------------------|------------------------|------------|--------------|
| [ADR-001](./ADR-001_Authentication_Architecture.md) | Authentication Architecture | Accepted | Prefer Supabase Auth with JWT/cookie sessions via `@supabase/ssr`; OTP/email as product allows. | Matches verified stack and FD-035 one base identity; FD-039 technical default. | None | ADR-002, ADR-003, ADR-005 |
| [ADR-002](./ADR-002_Role_Assignment_and_RBAC_Model.md) | Role Assignment and RBAC Model | Accepted | User ≠ role; permissions via assignment records; legacy enums map through taxonomy; Super Admin not ordinary product role. | Implements FD-023 / FD-035 multi-role model safely. | None | ADR-001, ADR-003, ADR-005 |
| [ADR-003](./ADR-003_Workspace_and_Routing_Model.md) | Workspace and Routing Model | Accepted | Prefer `/dashboard/{workspaceKey}`; workspace ≠ account; explicit switcher for multi-workspace users. | FD-035 workspace rules; FD-039 routing technical default. | None | ADR-001, ADR-002 |
| [ADR-004](./ADR-004_Database_Schema_Source_of_Truth.md) | Database Schema Source of Truth | Accepted | `supabase/migrations/` is schema SoT; docs describe logical model only. | Prevents DDL drift; FD-039 technical default. | None | ADR-005, ADR-007 |
| [ADR-005](./ADR-005_RLS_Strategy.md) | RLS Strategy | Accepted | RLS mandatory with deny-by-default; service role server-side only. | Tenant/role isolation under Supabase client access. | None | ADR-001, ADR-002, ADR-004 |
| [ADR-006](./ADR-006_Payment_Gateway_and_Webhook_Architecture.md) | Payment Gateway and Webhook Architecture | Accepted | Razorpay candidate; idempotent webhooks; MoR validation-gated; offline Admin bank for rare BDP packs. | FD-039 payment posture without freezing PSP or MoR implementation detail. | None | ADR-007, ADR-009, ADR-010 |
| [ADR-007](./ADR-007_Financial_Ledger_Architecture.md) | Financial Ledger Architecture | Accepted | Separate internal ledgers; append-only with reversals; cash-out inactive. | FD-020 ledger principles; FD-039 cash-out inactive. | None | ADR-004, ADR-006, ADR-008, ADR-010 |
| [ADR-008](./ADR-008_State_Machine_Architecture.md) | State Machine Architecture | Accepted | Explicit states/transitions in domain services; document under `docs/state-machines/`. | Prevents illegal lifecycle jumps across membership, settlement, activation. | None | ADR-002, ADR-007, ADR-009 |
| [ADR-009](./ADR-009_API_Server_Actions_Route_Handlers.md) | API, Server Actions, and Route Handlers | Accepted | Server Actions for in-app authenticated mutations; Route Handlers for webhooks/public callbacks; both validated. | Fits App Router; FD-039 technical default. | None | ADR-001, ADR-005, ADR-006 |
| [ADR-010](./ADR-010_Audit_and_Observability.md) | Audit and Observability | Accepted | Immutable audit events; Sentry; structured logs; no silent hard-delete of financial/attribution history. | Compliance and incident response; FD-039 observability default. | None | ADR-005, ADR-007, ADR-008 |
| [ADR-011](./ADR-011_Legacy_Migration_Strategy.md) | Legacy Migration Strategy | Accepted | Preserve ZBP/BDM/affiliate/franchisee/enterprise/BOG history; map via taxonomy; no automatic entitlement. | FD-035 Part G + inactive commercial constraints in FD-039. | None | ADR-002, ADR-004, ADR-010 |
| [ADR-012](./ADR-012_Environment_and_Deployment_Architecture.md) | Environment and Deployment Architecture | Accepted | VPS/PM2/Nginx + GitHub Actions; envs local/staging/pilot/prod; Docker/Edge not mandatory. | Matches ops history; FD-039 hosting posture. | None | ADR-004, ADR-006, ADR-010 |
| [ADR-013](./ADR-013_Feature_Flags.md) | Feature Flags | Accepted | Gate inactive/validation-blocked capabilities; flags cannot override Founder inactivity or MoR gates. | Safe pilot/prod progressive delivery. | None | ADR-008, ADR-012 |
| [ADR-014](./ADR-014_Background_Jobs_and_Scheduling.md) | Background Jobs and Scheduling | Accepted | Idempotent VPS/Supabase workers for webhooks, settlement sweeps, reconciliation, notifications. | Async money-safe processing without mandatory Edge/queue platform. | None | ADR-007, ADR-008, ADR-010, ADR-012 |

---

## How to use

1. Read governing Founder Decisions before changing commercial behaviour.
2. Change technical defaults by proposing a new ADR that **supersedes** an Accepted ADR (update this index).
3. Do not invent final SQL in ADRs — migrations remain SoT (ADR-004).
4. Payment/tax/MoR implementation always carries a **Professional validation** gate (especially ADR-006, ADR-007).

---

## Related documentation

| Area | Location |
|------|----------|
| Founder Decisions | `docs/founder-decisions/` |
| Role taxonomy | `docs/core/35_Role_Taxonomy.md` |
| Deployment narrative | `docs/core/24_Deployment_Architecture.md` |
| State machines (to be populated) | `docs/state-machines/` |
| Schema migrations | `supabase/migrations/` |
