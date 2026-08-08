# SM_Offer_Claim — Offer Claim

## Authority

- **FD-037** Marketplace Transaction, Approval, and Unattributed Revenue Rules (§24–§26, §28–§29)
- Related: FD-029 (no commission from non-earning events), FD-021

## Purpose

Model a customer **Offer Claim**. A claim is **not** Marketplace revenue and does **not** by itself create Marketplace BDP commission, settlement eligibility, or completed purchase. Where applicable, offer validity to customer is **72 hours after claim** (FD-037 §24).

## States

| State | Meaning |
|-------|---------|
| Issued | Claim / token created |
| Active | Within validity window; redeemable |
| Expired | Validity elapsed (e.g. 72h) without redemption |
| Redeemed | Linked to successful SM_Redemption / conversion record |
| Cancelled | Voided by Ops / customer / offer end |
| Invalid | Failed validation (fraud, wrong venue, offer not live) |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| (none) → Issued | Customer / System | Parent Offer Event is Published / Live; customer eligible |
| Issued → Active | System | Immediate or on first successful validation |
| Active → Expired | System | `now > claim_time + 72h` (where 72h rule applies) |
| Active → Redeemed | Venue / System | SM_Redemption success; redemption does not alone prove payment/settlement |
| Active → Cancelled | Customer / Ops | Offer cancelled or claim voided |
| Issued / Active → Invalid | System / Ops | Validation fail |
| Expired / Cancelled / Invalid | — | Terminal (no reactivation by default) |

## Side effects

- Record claim time, offer id, venue id, customer id, token
- Start 72h validity timer where applicable
- **Do not** post revenue, commission earned, or settlement-eligible entries on claim
- On Redeemed: link conversion evidence fields (FD-037 §26) — claim time, redemption/purchase confirmation as applicable

## Audit events

`offer_claim.issued`, `offer_claim.activated`, `offer_claim.expired`, `offer_claim.redeemed`, `offer_claim.cancelled`, `offer_claim.invalidated` — token id, offer id, timestamps, actor, reason.

## Failure handling

- Claim after offer Ended → reject (no Issued)
- Double redeem → reject second redemption; keep first Redeemed
- Using claim as proof of payment → non-compliant (FD-037 §29)

## Terminal states

Expired, Redeemed, Cancelled, Invalid.

## Not in scope

- Ticket booking
- Revenue recognition
- Refund economics

## Unresolved

- Whether all offer types use 72h vs offer-specific windows — “where applicable” in FD-037; exact matrix Pending Product Design
- Customer cancel-of-claim UX — Pending Product Design
