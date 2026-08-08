# GCE Engineering — Definition of Done

| Field | Value |
|-------|-------|
| **Applies to** | Phase 3+ feature and infrastructure work |
| **Authority** | Technical engineering standard (subordinate to Founder Decisions) |
| **Date** | 2026-08-08 |

A change is **done** only when applicable items below are satisfied.

## Mandatory checklist

1. **Business rule reference** — Cites owning FD / core doc; unresolved items remain unresolved.
2. **Validation** — Inputs validated (Zod / shared helpers) on privileged mutations.
3. **Authentication** — Identity established for non-public surfaces.
4. **Authorization** — `role_assignments` / permission helpers; never legacy `user_roles` alone for entitlement.
5. **RLS** — New tables considered under ADR-005 deny-by-default; policies in repo migrations.
6. **Audit** — Material business/financial actions emit audit events (ADR-010).
7. **Error handling** — Platform error taxonomy; safe client messages; correlation IDs.
8. **Logging** — Structured logger; secrets/PII redacted; no raw console in new server code.
9. **Tests** — Unit (and integration where applicable) for new foundation/domain logic.
10. **Typecheck** — `npm run typecheck` clean for changed scope.
11. **Lint** — New Phase 3+ paths pass `lint:phase3` / project lint without new critical issues.
12. **Build** — `npm run build` succeeds.
13. **Documentation** — Contracts, flags, permissions, or ops steps updated when changed.
14. **Migration safety** — Additive preferred; no blind destructive DDL; gce-dev before production.
15. **Feature flags** — Risky/incomplete/inactive capabilities default OFF (FD-039 / ADR-013).
16. **Security review** — No service-role leakage, spoofable workspaces, or flag mutation by clients.
17. **Observability** — Failures capturable in Sentry/logs with correlation.
18. **No inactive activation** — ZBP, Affiliate, Core purchase, paid Lead Assist, wallet cash-out, ticket money, settlement remain OFF unless a later Founder Decision activates them.

## Explicitly not required for “done”

- Completing PENDING PROFESSIONAL VALIDATION items (GST/TDS/MoR/etc.) for non-money infrastructure.
- Rewriting unrelated UI WIP.
- Full historical schema baseline (ADR-004 reconciliation track).
