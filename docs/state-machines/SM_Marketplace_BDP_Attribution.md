# SM_Marketplace_BDP_Attribution — Marketplace BDP ↔ Venue Attribution

## Authority

- **FD-033** Marketplace BDP Commercial and Operating Architecture
- **FD-037** Marketplace Transaction, Approval, and Unattributed Revenue Rules
- **FD-029** Commission Engine
- Related: FD-032 (Affiliate inactive), FD-039

## Purpose

Model valid attribution of a **Venue Partner** to a **Marketplace BDP**. Marketplace BDP commission requires valid venue attribution at the earning event. Without it: **80/0/20** treatment (Venue 80% / Marketplace BDP 0% / GCE 20%), not “unpaid BDP commission.”

## States

| State | Meaning |
|-------|---------|
| None / Unattributed | Venue exists without valid Marketplace BDP attribution |
| Pending Onboarding | Venue in onboarding; attribution not yet effective |
| Active | Valid attribution (venue, BDP, start date, status) |
| Temporarily Inactive Venue | Venue inactive; attribution **not** auto-terminated (FD-037 §35) |
| Disputed | Attribution conflict |
| Reassignment Pending | Platform reassignment in progress |
| Reassigned (Closed) | Prior attribution ended; history preserved |
| Voided | Invalidated |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| None → Pending Onboarding | Marketplace BDP / Ops | Venue identified; consent; profile started |
| Pending Onboarding → Active | Platform Ops | Venue verified/approved; agreement; assignment recorded |
| Pending Onboarding → None | Ops | Rejected venue — no permanent attribution |
| None → Active | Platform Ops | Exception / correction path with evidence |
| Active → Temporarily Inactive Venue | System / Ops | Inactivity flags; attribution retained |
| Temporarily Inactive Venue → Active | Ops / Venue | Activity restored |
| Active → Disputed | Ops / parties | Conflict raised |
| Disputed → Active / Reassigned / Voided | Ops / dispute resolution | Resolution + effective date |
| Active → Reassignment Pending | Platform Ops | Reassignment authorised (FD-033 / FD-037) |
| Reassignment Pending → Reassigned (Closed) + new Active | Platform Ops | Cut-off = platform-recorded effective attribution date |
| Active / Disputed → Voided | Compliance / Ops | Fraud / invalid |

**Economics guards:** Attributed eligible revenue → **80/10/10**. Unattributed → **80/0/20**. No default retroactive Marketplace BDP commission (FD-037 §12). **Affiliate inactive.** **No double commission** with Enterprise on same component (FD-037 / FD-038).

## Side effects

- Gate Marketplace BDP Estimated/Earned commission
- Preserve historical attribution for past transactions
- Future commission follows new attribution after reassignment; prior earned remains under original rules
- Unit capacity: Active venues count toward Marketplace BDP unit limits (FD-033)

## Audit events

`mkt_attr.pending`, `mkt_attr.activated`, `mkt_attr.venue_inactive_flagged`, `mkt_attr.disputed`, `mkt_attr.reassignment_started`, `mkt_attr.reassigned`, `mkt_attr.voided` — venue id, BDP id, effective dates, actor, reason.

## Failure handling

- Earning event with no Active attribution → GCE retains unattributed platform share; BDP entitlement = none
- Temporary inactivity used to invent termination → non-compliant
- Retroactive grant without authorised exception → reject

## Terminal states

Reassigned (Closed), Voided.

## Not in scope

- Venue Partner operational lifecycle details beyond attribution (see SM_Venue_Partner)
- Ticket MoR implementation validation (FD-039 gate)
- Affiliate activation

## Unresolved

- Exact venue inactivity time thresholds — Pending Operational Design (FD-037 §36)
- Authorised exception process for retroactive correction — Pending Operational / Compliance Design
