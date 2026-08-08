# ADR-013 — Feature Flags

| Field | Value |
|-------|-------|
| **ID** | ADR-013 |
| **Title** | Feature Flags |
| **Status** | Accepted — implemented; verified on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-008, ADR-012 |

---

## Context

Phase 2 must ship architecture for inactive or validation-gated capabilities (cash-out, Affiliate commercial activation, MoR production money movement, paid Lead Assist, etc.) without enabling them accidentally in prod. Pilot vs staging behaviour will diverge.

---

## Decision

1. **Use feature flags** (env-based and/or DB/config-backed) to gate incomplete, inactive, or validation-blocked capabilities.
2. **Founder-inactive items stay off by default** in `pilot` and `prod` (examples from FD-039: wallet cash-out, Marketplace Affiliate commercial activation, ZBP commercial model, paid Lead Assist, Docker/Edge-as-mandatory — as applicable to product surfaces).
3. **Flags are not Founder Decisions:** Turning on a commercially inactive item requires the governing Founder approval / validation gate — a flag flip alone is insufficient for MoR production ticket money movement or inactive commercial SKUs.
4. **Naming & ownership:** Prefer explicit names (`payments.marketplace_tickets_live`, `wallet.cash_out`, …); document defaults per env in ops runbooks.
5. **Audit:** Material flag changes in pilot/prod should be auditable (ADR-010).
6. **Implementation choice:** Start with environment variables + small server config module; introduce a flag service later if needed. Not mandated here.

**Label:** Technical recommendation — not Founder law.

---

## Consequences

### Positive

- Safe progressive delivery and pilot control.
- Prevents accidental exposure of inactive commercial paths.

### Negative / trade-offs

- Flag debt if not cleaned up.
- Misconfigured flags can still cause incidents — pair with tests and checklists.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Branch-only feature isolation | Slow; merge hell |
| Always-on code paths behind “coming soon” UI only | Still callable APIs are a risk |
| Mandatory third-party flag SaaS | Optional later; not required for Phase 2 |

---

## Governing FDs

- **FD-039** — Inactive items list; MoR validation gate; technical defaults
- **FD-020** — Cash-out related surfaces inactive until approved

---

## Not in scope

- Exact flag vendor contract
- Marketing experiment framework
- Per-user percentage rollouts (may be added later)

---

## Professional validation

MoR and payment flags require compliance validation before enabling live ticket money movement (FD-039).
