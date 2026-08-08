# ADR-010 — Audit and Observability

| Field | Value |
|-------|-------|
| **ID** | ADR-010 |
| **Title** | Audit and Observability |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-005, ADR-007, ADR-008 |

---

## Context

Financial, attribution, approval, and Admin offline-payment flows require reconstructable history (FD-020, FD-021, FD-036–FD-039). Runtime errors need production visibility. Verified stack includes `@sentry/nextjs` in devDependencies; structured logging is expected on VPS deployments.

FD-039 lists Sentry and structured logging as technical defaults.

---

## Decision

1. **Immutable audit events:** Record security- and compliance-relevant actions (role assignment changes, approvals, settlements, offline bank recordings, MoR-adjacent payment state changes) as append-only audit events with actor, time, subject, before/after or transition id, and correlation ids.
2. **No silent hard-delete** of financial or attribution history. Soft-delete/archive may hide from UI; historical facts remain recoverable for audit. Corrections via reversal entries (ADR-007).
3. **Sentry:** Use Sentry for error/exception monitoring in deployed environments (configuration per env; secrets server-side).
4. **Structured logs:** Prefer JSON/structured logs with request/action ids; avoid logging secrets, full card data, or unnecessary Aadhaar/KYC payloads (Aadhaar not mandatory by default — FD-039).
5. **Operational metrics:** Health checks and basic uptime monitoring on the VPS path (ADR-012); deep APM optional later.

**Label:** Technical recommendation — not Founder law. Retention of financial truth is Founder-aligned.

---

## Consequences

### Positive

- Dispute and compliance readiness.
- Faster incident response via Sentry + correlated logs.
- Discourages destructive “cleanup” of money/attribution rows.

### Negative / trade-offs

- Storage growth for audit/transition logs.
- PII in logs/audits needs retention and access controls.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| UI activity feed only | Not immutable or complete |
| Hard-delete with “admin confirm” | Breaks financial/attribution reconstructability |
| No error monitoring until scale | Unacceptable for pilot/prod money flows |

---

## Governing FDs

- **FD-020 / FD-021** — Auditable ledgers and settlements
- **FD-023 / FD-035** — Privileged Admin and assignment changes
- **FD-036 / FD-037 / FD-038** — Attribution and approval history
- **FD-039** — Offline payment audit; Aadhaar minimisation; Sentry/logging technical defaults

---

## Not in scope

- Exact log retention days (ops/legal policy)
- SIEM vendor selection
- Full product analytics warehouse design

---

## Professional validation

Privacy/legal review of audit PII retention and access. Finance review of what constitutes undeletable financial history.
