# SM_Marketplace_Offer_Event — Marketplace Offer Event

## Authority

- **FD-037** Marketplace Transaction, Approval, and Unattributed Revenue Rules
- **FD-033** Marketplace BDP Commercial and Operating Architecture
- Related: FD-029 (non-earning until conversion rules), FD-021 (settlement)

## Purpose

Model **Marketplace Offer Events** (in-store / campaign offers). They have a distinct lifecycle from ticketed events. **Offer claim ≠ revenue.** Conversion/redemption and payment rules remain separate. Launch guidance includes **72-hour** customer claim validity where applicable (FD-037 §24).

## States

| State | Meaning |
|-------|---------|
| Draft | Venue drafting offer |
| Submitted | Awaiting platform approval |
| Approved | Approved; not live |
| Published / Live | Offer available to claim |
| Paused | Temporarily unavailable |
| Ended | Validity window closed |
| Under Review | Moderation hold |
| Rejected | Denied |
| Cancelled | Withdrawn by Ops / Venue with approval |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Draft → Submitted | Venue / Marketplace BDP | Required offer fields; no misleading claims |
| Submitted → Approved | Platform Marketplace Ops | Final approval authority (FD-037 §16) |
| Submitted → Rejected / Under Review | Ops | Fail / more info |
| Under Review → Approved / Rejected / Draft | Ops | Outcome |
| Approved → Published / Live | Ops / System | Go-live checks; campaign value estimate rules where applicable (₹50,000 minimum campaign rule — FD-037 Part H) |
| Published → Paused | Venue / Ops | Operational pause |
| Paused → Published | Venue / Ops | Resume authorised |
| Published / Paused → Ended | System / Ops | End date or inventory/policy end |
| Published → Cancelled | Ops | Withdrawal approved |
| * → Under Review | Ops | Moderation |

Marketplace BDP may recommend; cannot self-approve for commission benefit.

## Side effects

- Enable SM_Offer_Claim issuance while Published
- Do **not** create Marketplace revenue or BDP commission on publish or claim alone
- On paid conversion (if any): SM_Payment + attribution split rules
- Feed settlement only after eligible conversion / fulfilment rules

## Audit events

`offer_event.submitted`, `offer_event.approved`, `offer_event.published`, `offer_event.paused`, `offer_event.ended`, `offer_event.cancelled`, `offer_event.rejected`, `offer_event.under_review` — actor, venue, attribution snapshot, reason.

## Failure handling

- Claim storms after Ended → reject new claims
- Approval of prohibited/misleading content → reject / Under Review
- Treating claims as revenue in ledger → non-compliant

## Terminal states

Ended, Rejected, Cancelled.

## Not in scope

- Ticketed Marketplace Event
- Exact campaign pricing SKUs beyond FD-037 principles
- Paid Lead Assist (inactive)

## Unresolved

- Exact offer category variants for revenue share — category-specific variants inactive at launch (FD-037 / FD-039)
- Detailed campaign fee schedules — defer to commercial docs / pending where noted in FDs
