# Technical Debt Register

| Field | Value |
|-------|-------|
| **Type** | Engineering debt tracker (not Founder open decisions) |
| **Date** | 2026-08-08 |

## Status legend

| Status | Meaning |
|--------|---------|
| Open | Known debt; not started |
| Scheduled | Assigned to a phase/backlog |
| Mitigated | Guardrails in place; full cleanup later |
| Closed | Resolved |

## Register

| ID | Item | Severity | Status | Target | Notes |
|----|------|----------|--------|--------|-------|
| TD-001 | Legacy `user_roles` still used for entitlement on many routes | High | Mitigated | Phase 4 | Canonical resolver exists; legacy compatibility-only |
| TD-002 | Legacy ZBP / Affiliate / Franchisee / BDM dashboards | High | Mitigated | Phase 4+ | Quarantined via proxy; commercial flags OFF |
| TD-003 | Weak/disabled RLS on `venues`, `zbp_partners`, `zbp_applications` | Critical (legacy) | Open | Security backlog | Pre-existing; do not weaken Phase 2 policies |
| TD-004 | Full ADR-004 historical schema baseline missing | Medium | Open | Ops/Phase 2 recon | Phase 2 SoT live; legacy dump non-blocking |
| TD-005 | Old dashboard routes alongside `/dashboard/[workspaceKey]` | Medium | Scheduled | Phase 4 | Soft migration only |
| TD-006 | App-wide ESLint debt (pre-Phase 3) | Medium | Open | Incremental | CI gates `lint:phase3` for foundation paths |
| TD-007 | Unrelated dirty UI prototype in working tree | Low | Open | Separate PR | Must not mix into architecture commits |
| TD-008 | Legacy `@supabase/auth-helpers-nextjs` transitional usage | Medium | Scheduled | Phase 4 | Prefer `@supabase/ssr` factories |
| TD-009 | Live-only / partially typed legacy tables | Medium | Open | Continuous | Regenerate types from gce-dev after schema changes |
| TD-010 | In-memory rate limiter (single-node) | Low | Mitigated | Scale later | Documented; extend when multi-node required |

## Distinction

Founder/Legal/Tax items live in `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md`.
Do not treat OD-* items as engineering TODOs that may invent commercial rules.
