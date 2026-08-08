# SM_Commission — Stakeholder Commission Entitlement

## Authority

- **FD-029** Commission Engine and Stakeholder Entitlement Architecture (primary)
- **FD-020** Financial and Wallet Architecture
- **FD-021** Settlement Engine
- **FD-025** / **FD-033** / **FD-026** vertical commercial rules
- **FD-036** / **FD-037** / **FD-038** attribution & no-double-commission
- Related: FD-028, FD-032 (Affiliate inactive), FD-039

## Purpose

Model stakeholder commission from informational estimate through payment, reversal, and **Recoverable Balance**. No stakeholder may self-approve own commission. Attribution required for Connect / Marketplace BDP commission. **Affiliate inactive.** **No double commission** on the same eligible revenue component.

## States

| State | Meaning (FD-029 / FD-020) |
|-------|---------------------------|
| Estimated | Informational; not earned/payable/settlement-eligible |
| Provisional | Calculated; awaiting validation/attribution/fulfilment/approval |
| Earned | Earning conditions complete; not automatically settlement-eligible |
| On Hold | Blocked for refund window, dispute, compliance, chargeback, missing evidence, etc. |
| Settlement-Eligible | Passed reconciliation, hold, tax, recovery, approval conditions |
| Approved | Platform-approved for payout path (aligns with FD-020 “Approved”) |
| Payable | Queued for payout |
| Paid | Successfully paid |
| Reversed | Cancelled due to refund/chargeback/invalidation/correction |
| Recoverable Balance | Amount recoverable from future approved earnings or authorised mechanism |
| Clawed Back | Recovery completed against paid amounts / balances |

FD-020 also lists Pending / Recoverable naming variants; preserve business meaning if technical names differ.

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| (none) → Estimated | System | Underlying transaction exists; show estimate only |
| Estimated → Provisional | System | Calculation run after candidate earning signal |
| Provisional → Earned | System / Ops rules | Vertical earning conditions met **and** valid attribution when required **and** not excluded |
| Provisional / Earned → On Hold | System / Compliance / Finance | Hold reason coded |
| On Hold → Provisional / Earned / Reversed | Ops / Finance | Hold resolved |
| Earned → Settlement-Eligible | Settlement engine | Holds clear; refund windows; tax/recovery checks |
| Settlement-Eligible → Approved | Finance / authorised workflow | Dual-control where required; **beneficiary ≠ approver** |
| Approved → Payable | System | Payout batch eligibility |
| Payable → Paid | Finance / System | Payout success |
| Payable → On Hold / Settlement-Eligible | System | Payout failure / freeze |
| Estimated / Provisional / Earned / Paid → Reversed | System / Finance | Refund/invalidation of underlying |
| Paid / Reversed → Recoverable Balance | Finance / System | Amount still to recover (incl. franchise finance recovery caps per FD-029) |
| Recoverable Balance → Clawed Back / reduced Recoverable | System | Recovery from **earned and approved** commission only for franchise recovery; max per cycle rules (e.g. ₹5,000 caps where specified) |

**Vertical guards (locked):**

- Connect: attribution required; approved % per FD-025/029
- Marketplace attributed **80/10/10**; unattributed **80/0/20** (no BDP share owed)
- Enterprise: BDP share of eligible **platform** commission; milestone/approval guards (FD-026/038)
- Franchise recovery: never from Estimated/Provisional/On Hold

## Side effects

- Commission ledger entries; statements
- Settlement batch inclusion when Payable
- Deduct Recoverable Balance on payout cycles
- Preserve historical attribution linkage
- Block Affiliate commission generation

## Audit events

`commission.estimated`, `commission.provisional`, `commission.earned`, `commission.held`, `commission.settlement_eligible`, `commission.approved`, `commission.payable`, `commission.paid`, `commission.reversed`, `commission.recoverable_opened`, `commission.clawed_back` — stakeholder, amount, rule version, attribution id, actor, reason.

## Failure handling

- Missing attribution → do not enter Earned for BDP share; unattributed Marketplace keeps GCE platform share treatment
- Double commission attempt across verticals → reject second entitlement on same component
- Self-approval → reject
- Payout failure → remain Payable/On Hold; retry idempotently

## Terminal states

Paid (stable until reversal), Reversed (may open Recoverable), Clawed Back.

## Not in scope

- Wallet cash-out
- Affiliate activation
- Inventing new commission %

## Unresolved

- Exact technical enum naming vs FD-020/029 synonyms — Pending Technical Design
- Some chargeback recovery edge cases — Pending Finance/Legal Design
