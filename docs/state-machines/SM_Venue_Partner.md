# SM_Venue_Partner — Venue Partner Lifecycle

## Authority

- **FD-033** Marketplace BDP Commercial and Operating Architecture
- **FD-037** Marketplace Transaction, Approval, and Unattributed Revenue Rules
- Related: FD-029 (settlement entitlements), FD-039 (payments/MoR context)

## Purpose

Model onboarding and operating status of a Marketplace **Venue Partner**. Venues are ordinarily onboarded through a Marketplace BDP. A Venue may temporarily exist **without** valid Marketplace BDP attribution. Settlement is **platform-initiated**; venues do not self-release settlement.

## States

| State | Meaning |
|-------|---------|
| Identified | Interest recorded |
| Profile Draft | Profile / consent in progress |
| Pending Verification | Documents / capability checks |
| Conditionally Approved | Approved with conditions |
| Verified and Approved | Onboarding approved |
| Active | Participating in Marketplace activity |
| Temporarily Inactive | Low/no activity; attribution not auto-ended |
| Under Review | Moderation / compliance / inactivity review |
| Suspended | Platform suspension |
| Rejected | Onboarding rejected |
| Exited / Archived | Ended; history preserved |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Identified → Profile Draft | Marketplace BDP / Venue | Consent obtained |
| Profile Draft → Pending Verification | BDP / Ops | Required profile fields + agreement path started |
| Pending Verification → Verified and Approved / Conditionally Approved | Platform Marketplace Ops | Verification outcomes |
| Pending Verification → Rejected | Ops | Fail criteria — no commission / permanent attribution |
| Conditionally Approved → Verified and Approved | Ops | Conditions cleared |
| Verified and Approved → Active | Ops / System | Activation recorded; attribution may be Active or None |
| Active → Temporarily Inactive | System / Ops | Inactivity indicators |
| Temporarily Inactive → Active / Under Review | Ops | Restore or escalate |
| Active / Temporarily Inactive → Under Review | Ops | Inactivity or moderation review |
| * → Suspended | Ops / Compliance | Suspension grounds |
| Suspended → Active / Under Review | Ops | Reinstatement |
| Active → Exited / Archived | Ops / Venue process | Exit complete |
| Rejected → Archived | System | Retention |

Marketplace BDP assists onboarding but **final approval** is Platform Marketplace Operations (FD-037 §16).

## Side effects

- Create venue profile, category, settlement settings placeholders
- Create or defer SM_Marketplace_BDP_Attribution
- Enable/disable ability to draft events/offers
- Count toward Marketplace BDP active venue capacity when Active (FD-033)
- Feed settlement eligibility checks (not self-payout)

## Audit events

`venue.identified`, `venue.verification_updated`, `venue.approved`, `venue.conditionally_approved`, `venue.activated`, `venue.inactive`, `venue.under_review`, `venue.suspended`, `venue.rejected`, `venue.exited` — actor, previous/new state, attribution id if any, reason.

## Failure handling

- Rejected onboarding → no attribution, no commission
- Active without attribution → allowed temporarily; commerce uses **80/0/20** when no valid attribution at earning
- Venue attempts direct settlement release → blocked (FD-037 §30)

## Terminal states

Rejected, Exited / Archived.

## Not in scope

- Event/offer content approval details
- Enterprise client identity (cross-vertical use allowed without merging verticals)
- Exact inactivity SLAs

## Unresolved

- Exact inactivity thresholds — Pending Operational Design (FD-037)
- Future vendor login portal — inactive (FD-039)
