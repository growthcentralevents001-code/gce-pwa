# SM_Redemption — Redemption / Conversion

## Authority

- **FD-037** Marketplace Transaction, Approval, and Unattributed Revenue Rules (§27–§29, conversion)
- Related: FD-021 (settlement eligibility), FD-029 (earning conditions), FD-033

## Purpose

Model **redemption / conversion** evidence for Marketplace Events (e.g. event QR at launch) and Offer Events (offer redemption code / claim token). Redemption confirms fulfilment intent/evidence; it does **not** override payment, settlement, or commission rules.

## States

| State | Meaning |
|-------|---------|
| Pending | Token/QR issued or redemption session opened |
| Validated | Token checked; not yet completed |
| Completed | Redemption / conversion recorded |
| Failed | Validation or completion failed |
| Reversed | Completed redemption undone after review |
| Disputed | Under dispute / fraud review |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| (none) → Pending | System | Ticket or Active Offer Claim exists |
| Pending → Validated | Venue scanner / System | Token signature/venue match; event/offer in allowed state |
| Validated → Completed | Venue / System | Completion evidence captured |
| Pending / Validated → Failed | System | Mismatch, expired claim, duplicate, wrong venue |
| Completed → Disputed | Ops / customer / venue | Dispute raised |
| Disputed → Completed / Reversed | Ops | Resolution |
| Completed → Reversed | Ops | Approved reversal (refund/fraud/error) |

**Guards:** Offer path uses claim token / redemption code rather than requiring ticket QR (FD-037 §28). Event QR path for tickets at launch (FD-037 §27).

## Side effects

- Link to ticket payment or offer claim
- May contribute fulfilment evidence toward settlement eligibility — **not sufficient alone**
- May unlock commission earning checks only with payment + attribution + no material refund/dispute (FD-029 / FD-037)
- Never create Affiliate entitlements (inactive)

## Audit events

`redemption.pending`, `redemption.validated`, `redemption.completed`, `redemption.failed`, `redemption.disputed`, `redemption.reversed` — token, venue, event/offer ids, actor, device/evidence refs, reason.

## Failure handling

- Expired 72h claim → Failed
- Offline scan sync conflicts → idempotent completion; prefer first valid Completed
- Completed without payment where payment required → hold settlement/commission; Ops review

## Terminal states

Completed (stable), Failed, Reversed.

## Not in scope

- Payment capture
- Venue payout execution
- Enterprise milestone acceptance

## Unresolved

- Exact QR payload / offline sync rules — Pending Technical Design
- No-show vs non-redemption settlement effects — see FD-021; detailed policy Pending where not explicit
