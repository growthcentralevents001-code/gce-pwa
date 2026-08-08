# SM_Settlement — Settlement / Payout

## Authority

- **FD-021** Settlement Engine (primary)
- **FD-020** Financial and Wallet Architecture
- **FD-028** Revenue Recognition and Commercial Architecture
- **FD-029** Commission Engine
- **FD-037** Marketplace settlement direction (platform-initiated; launch cadence)
- Related: FD-026/038 (Enterprise componentised settlement)

## Purpose

Model when money may move from pending/escrow into stakeholder settlement, commission payout, refund, or platform revenue. Settlement is **platform-controlled**; Venue Partners and BDPs must not directly release settlement (FD-037). Launch Marketplace cadence direction is monthly and must remain **configurable** (FD-037 §31–§32).

## States

| State | Meaning (FD-021 §5) |
|-------|---------------------|
| Not Applicable | No settlement path for this record |
| Pending Payment | Awaiting payment |
| Payment Received | Payment captured |
| In Escrow | Escrow hold |
| Awaiting Activation | e.g. membership activation |
| Awaiting Fulfilment | Fulfilment/redemption evidence pending |
| Awaiting Event Completion | Event not completed |
| Awaiting Milestone Approval | Enterprise milestone pending |
| Under Hold | Dispute/compliance/refund window/chargeback |
| Under Review | Manual review |
| Eligible for Settlement | Guards passed |
| Settlement Approved | Authorised for processing |
| Settlement Processing | Payout in flight |
| Partially Settled | Partial payout done |
| Settled | Complete for this cycle/component |
| Refund Pending / Refunded | Refund path interacts |
| Reversed | Settlement reversed |
| Disputed / Chargeback | External/dispute freeze |
| Cancelled | Settlement cancelled |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Pending Payment → Payment Received | System | SM_Payment Captured |
| Payment Received → In Escrow | System | Escrow-required |
| In Escrow → Awaiting Activation / Fulfilment / Event Completion / Milestone Approval | System | Product type |
| Awaiting * → Eligible for Settlement | Settlement engine | Product-specific eligibility (FD-021 Parts A–C); refund checks; attribution rules applied upstream |
| * → Under Hold / Under Review | Finance / Compliance | Approved hold reasons (FD-021 §27) |
| Under Hold → prior waiting / Eligible / Refund Pending | Finance | Resolution |
| Eligible → Settlement Approved | Finance / authorised workflow | Beneficiary ≠ approver; componentised lines for Enterprise/Marketplace |
| Settlement Approved → Settlement Processing | System | Payout method ready |
| Settlement Processing → Settled / Partially Settled | System | Full or partial success |
| Settlement Processing → Eligible / Under Hold | System | Payout failure (FD-021 §37) |
| Settled / Eligible → Refund Pending | Refund flow | Refund approved |
| Refund Pending → Refunded / Reversed | System | Refund completed; clawback as needed |
| * → Disputed / Chargeback | Finance | Signal received → freeze |
| * → Cancelled | Finance | No longer payable |

**Marketplace eligibility (FD-037 §33):** applicable fulfilment, refund window checks, commission calculation, platform initiation. **No double settlement** of same component under two vertical rules (FD-038).

## Side effects

- Settlement ledger movements; tax withholdings as applicable
- Commission Payable/Paid transitions
- Franchise recovery deductions on BDP commission cycles
- Notifications to Venue / BDP / vendors
- Reconciliation artifacts (FD-021 §35)

## Audit events

`settlement.status_changed`, `settlement.hold_placed`, `settlement.approved`, `settlement.processing`, `settlement.partial`, `settlement.settled`, `settlement.reversed`, `settlement.chargeback_freeze` — component ids, amounts, cycle, actor, reason, rule version.

## Failure handling

- Payout bank failure → retry; do not mark Settled
- Idempotent re-processing — mandatory (FD-021 §33)
- Manual override — audited only, never silent (FD-021 §34)
- Chargeback — freeze related settlements/commissions

## Terminal states

Settled, Refunded, Reversed, Cancelled, Not Applicable.

## Not in scope

- Consumer wallet withdrawals (inactive)
- Hard-coding monthly as permanent universal cadence

## Unresolved

- Exact hold period durations by product — Pending Operational / Finance Design where not specified
- Future settlement cycle catalogue beyond launch monthly direction — configurable; details Pending
