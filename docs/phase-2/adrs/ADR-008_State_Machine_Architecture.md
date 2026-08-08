# ADR-008 — State Machine Architecture

| Field | Value |
|-------|-------|
| **ID** | ADR-008 |
| **Title** | State Machine Architecture |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation |
| **Supersedes** | None |
| **Dependencies** | ADR-002, ADR-007, ADR-009 |

---

## Context

GCE domains have explicit lifecycles: membership (FD-022, FD-036), Circles (FD-024), role assignments (FD-035), settlements (FD-021), Marketplace offers/events (FD-037), Enterprise milestones (FD-038), and payment/activation flows (FD-039). Implicit status strings scattered in UI cause illegal transitions and audit gaps.

FD-039 lists activation state machine as a technical default to lock via ADR.

---

## Decision

1. **Explicit states + transitions:** Each governed lifecycle defines a finite set of states and allowed transitions in **domain services** (server-side), not only in UI.
2. **Documentation home:** Human-readable diagrams/tables live under `docs/state-machines/` (one doc or folder per domain machine as needed). Code remains authoritative for enforcement; docs stay aligned.
3. **Transition rules:** Include actor/permission checks, SoD (e.g. self-approval bans), and side effects (ledger posts, notifications) as part of the transition definition where applicable.
4. **Illegal transitions:** Reject with typed errors; never “force set status” from clients.
5. **Persistence:** Store current state + transition history/audit as required by domain (see ADR-010). Prefer append-only transition logs for financial and attribution-critical flows.
6. **Dual status mappings:** Where FD-032 dual Circle/status mapping applies, document both business and technical representations without inventing supersessions.

**Label:** Technical recommendation. Lifecycle *meanings* come from Founder Decisions.

---

## Consequences

### Positive

- Testable transition matrices; fewer corrupt records.
- Shared language for Product, Ops, and Engineering.
- Safer Admin overrides when modelled as explicit transitions.

### Negative / trade-offs

- Upfront design cost per domain.
- Docs can drift if not updated with code.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Free-form status strings | Illegal jumps; weak audits |
| UI-only workflow steppers | Bypassable; not enforceable |
| Generic BPM engine mandatory | Overkill for Phase 2; optional later |

---

## Governing FDs

- **FD-021** — Settlement statuses/holds
- **FD-022 / FD-036** — Membership lifecycle and attribution/approval
- **FD-024 / FD-030 / FD-032** — Circle lifecycle and status mapping
- **FD-035** — Role assignment statuses
- **FD-037 / FD-038** — Marketplace and Enterprise approval/milestone flows
- **FD-039** — Activation and commercial acceptance constraints

---

## Not in scope

- Exhaustive transition tables in this ADR (belong in `docs/state-machines/`)
- Visual workflow builder product
- Exact library choice (XState vs hand-rolled) — implementation may choose; behaviour must match docs

---

## Professional validation

Legal/ops review where state changes create contractual or money effects (activation, refund eligibility, settlement release).
