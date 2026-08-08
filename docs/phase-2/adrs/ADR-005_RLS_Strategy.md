# ADR-005 — RLS Strategy

| Field | Value |
|-------|-------|
| **ID** | ADR-005 |
| **Title** | RLS Strategy |
| **Status** | Accepted — implemented; verified on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation implementing security posture for FD-023 / FD-035 |
| **Supersedes** | None |
| **Dependencies** | ADR-001, ADR-002, ADR-004 |

---

## Context

Multi-tenant and multi-role data (circles, venues, BDPs, enterprise clients, finance) must not leak across scopes. Supabase exposes PostgREST to clients; application checks alone are insufficient if the anon/authenticated keys can query tables.

---

## Decision

1. **RLS mandatory** for tables holding tenant-, assignment-, person-, or finance-scoped data accessible via Supabase client keys.
2. **Deny-by-default:** Enable RLS; grant access only through explicit policies aligned to assignment status and scope (FD-023, FD-035).
3. **Service role:** Supabase **service role** key may bypass RLS and is **server-side only** (Route Handlers, trusted jobs, controlled admin backends). Never ship service role to the browser, PWA bundle, or client env.
4. **Defence in depth:** Domain services / Server Actions still enforce RBAC and SoD; RLS is not a substitute for business workflow rules (e.g. self-approval bans).
5. **Policy authorship:** Policies live in migrations (ADR-004). Prefer policies keyed off `auth.uid()` mapped to User + active assignments.
6. **Break-glass:** Emergency admin paths still audit; do not weaken RLS globally for convenience.

**Label:** Technical recommendation. Underlying permission *rules* are Founder law; exact policy SQL is not.

---

## Consequences

### Positive

- Limits blast radius of stolen user JWTs or buggy clients.
- Forces scope thinking into the data layer.

### Negative / trade-offs

- Policy complexity and performance testing burden.
- Service-role misuse remains a critical operational risk if secrets leak.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| App-layer auth only | Unsafe with direct Supabase client access |
| RLS off + Edge-only API | Still need DB defence; contradicts current client patterns |
| Broad “authenticated read all” policies | Violates tenant/role scoping |

---

## Governing FDs

- **FD-023** — RBAC / permissions
- **FD-035** — Assignment scope and workspace isolation
- **FD-020** — Financial data sensitivity
- **FD-034** — Corporate/platform data ownership context

---

## Not in scope

- Final policy text per table
- Exact performance benchmarks
- Column-level encryption product choice

---

## Professional validation

Security review of privileged policies and service-role usage before pilot/prod go-live.
