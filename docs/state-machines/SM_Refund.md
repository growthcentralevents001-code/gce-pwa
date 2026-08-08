# SM_Refund — Refund

## Authority

- **FD-020** Financial and Wallet Architecture
- **FD-021** Settlement Engine
- **FD-028** Revenue Recognition and Commercial Architecture
- **FD-029** Commission Engine (reversals / recoverable)
- **FD-037** / **FD-039** Marketplace cancel & refund boundary

## Purpose

Controlled **refund workflow** for captured payments. Marketplace default **cancellation cutoff** is 48h before event start (FD-039); **exact refund percentages and schedules are not Founder-locked** and must not be invented here.

## States

| State | Meaning |
|-------|---------|
| Requested | Refund requested (customer/Ops/system) |
| Under Review | Policy / Finance / Ops review |
| Approved | Refund authorised (amount may be partial) |
| Rejected | Not authorised |
| Processing | Submitted to gateway / bank / ledger |
| Completed | Funds returned / credit posted |
| Failed | Processing failed; needs retry |
| Reversed / Cancelled Request | Request withdrawn before completion |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| (none) → Requested | Customer / Ops / System | Original SM_Payment Captured/In Escrow; reason coded |
| Requested → Under Review | System / Ops | Auto when policy not fully deterministic |
| Requested / Under Review → Approved | Finance / Ops (authorised) | Policy allows; **refund % from approved policy doc — Pending**; for event customer cancel, cutoff guard references SM_Marketplace_Event / FD-039 |
| Requested / Under Review → Rejected | Finance / Ops | Outside policy (e.g. inside 48h without exception) |
| Approved → Processing | System | Idempotent refund key |
| Processing → Completed | Gateway / Finance | Success |
| Processing → Failed | Gateway | Failure |
| Failed → Processing | Finance | Retry authorised |
| Requested / Under Review → Reversed / Cancelled Request | Requestor / Ops | Before Approved/Processing terminal |

## Side effects

- Refund ledger entries (FD-020); compensating entries only — no silent mutation
- Reduce eligible revenue base for commission
- Move related commission toward Reversed / Recoverable Balance as applicable (SM_Commission)
- Adjust settlement eligibility / holds (SM_Settlement)
- Update payment to Partially/Fully Refunded

## Audit events

`refund.requested`, `refund.under_review`, `refund.approved`, `refund.rejected`, `refund.processing`, `refund.completed`, `refund.failed` — original payment id, requested vs approved amounts, policy version, actor, reason. **Do not log invented refund % as Founder-approved.**

## Failure handling

- Gateway fail → Failed; keep Approved; retry with same idempotency key
- Commission already Paid → create Recoverable Balance / clawback path (FD-029)
- Chargeback parallel to refund → Finance freeze; Pending detailed treatment

## Terminal states

Completed, Rejected, Reversed / Cancelled Request.

## Not in scope

- Setting commercial refund percentage tables (placeholder)
- Tax opinion on refund GST treatment (Pending Tax)

## Unresolved (placeholder economics)

- Exact refund percentage by product / timing band — **Pending Finance, Legal, Tax, Product** (FD-039 §16; FD-037 §44)
- Chargeback vs refund interaction matrix — Pending Finance, Legal, Technical Design
- No-show refundability — Pending policy detail beyond FD-021 principles

## Implementation note (Phase 11)

Customer UX can cancel and raise a refund request (`customer_refund_requests`) without asserting refund %. Automatic refund_processing remains OFF.
