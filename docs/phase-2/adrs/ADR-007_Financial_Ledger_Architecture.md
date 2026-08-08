# ADR-007 — Financial Ledger Architecture

| Field | Value |
|-------|-------|
| **ID** | ADR-007 |
| **Title** | Financial Ledger Architecture |
| **Status** | Accepted — implemented; verified on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation implementing FD-020; cash-out inactive per FD-039 |
| **Supersedes** | None |
| **Dependencies** | ADR-004, ADR-006, ADR-008, ADR-010 |

---

## Context

FD-020 requires a unified user-facing Wallet experience backed by **separate internal ledgers** (purpose-specific, auditable). Entries need identifiable source/purpose. Corrections must not silently rewrite history.

FD-021 defines settlement eligibility and auditability after money movement rules. FD-039 keeps **wallet cash-out / consumer withdrawals inactive**.

Exact SQL DDL is not invented here (ADR-004).

---

## Decision

1. **Separate ledgers:** Maintain logically separate internal ledger categories per FD-020 (e.g. payment/platform, commission, reward, deferred/package recovery as applicable). UI may aggregate views; accounting remains separated.
2. **Append-only posture:** Do not update/delete historical financial entries for “fixes.” Corrections use **reversal / compensating entries** (and linked audit), preserving history.
3. **Traceability:** Every entry references source transaction, settlement context where relevant, and purpose.
4. **Wallet cash-out:** Product and APIs for consumer cash-out / withdrawals remain **inactive** unless a later Founder Decision activates them (FD-039).
5. **Settlement:** Ledger postings respect FD-021 triggers and holds; one universal settlement rule across verticals is forbidden.
6. **No invented tax rates:** GST/TDS treatment is validation-owned; ledgers may reserve structure for tax lines without hard-coding rates in this ADR.

**Label:** Technical implementation pattern for Founder financial principles. Ledger *separation* and cash-out inactivity are Founder-backed; table design is technical.

---

## Consequences

### Positive

- Auditability and dispute reconstruction.
- Prevents Wallet UI from collapsing distinct money natures.
- Aligns with inactive cash-out scope control.

### Negative / trade-offs

- Higher implementation complexity than a single balance column.
- Reporting must join/filter multiple ledgers carefully.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Single mutable balance field | Violates FD-020 separation and audit needs |
| In-place edit of posted entries | Destroys history; rejected |
| Enable cash-out in Phase 2 | Explicitly inactive (FD-039) |

---

## Governing FDs

- **FD-020** — Wallet + separate ledgers; traceability; no casual negatives
- **FD-021** — Settlement engine principles
- **FD-028 / FD-029** — Recognition and commission entitlement (consume ledgers)
- **FD-039** — Cash-out inactive; MoR validation-gated money movement

---

## Not in scope

- Final ledger table DDL and chart-of-accounts codes
- GST/TDS rate tables
- Bank payout file formats
- Consumer withdrawal UX

---

## Professional validation

Accounting, tax, and Finance review of ledger categories, tax lines, and settlement postings before production reliance. MoR-related postings gated by FD-039 validation.
