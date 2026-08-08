# SM_Connect_BDP_Attribution — Connect BDP Attribution

## Authority

- **FD-025** Connect BDP Commercial and Operating Architecture
- **FD-029** Commission Engine and Stakeholder Entitlement Architecture
- **FD-036** Membership Attribution, Approval, and Allocation Authority
- Related: FD-027 (membership commercial), FD-032

## Purpose

Model the commercial link between an eligible **membership** (and/or Circle context) and a responsible **Connect BDP**. Attribution is **separate from membership identity**. Organic / unattributed memberships are allowed. **No Connect BDP commission without valid attribution** at the earning event.

## States

| State | Meaning |
|-------|---------|
| None / Unattributed | Active or pending membership with no Connect BDP link |
| Proposed | BDP or system proposed attribution; not confirmed |
| Pending Evidence | Awaiting approved basis / evidence |
| Active | Valid attribution recorded (BDP, start date, basis, status) |
| Disputed | Attribution conflict under review |
| Suspended | Temporary hold (does not invent retroactive rights) |
| Reassigned (Closed) | Prior attribution ended; historical preserved; new Active may exist |
| Voided | Invalidated for fraud/error; no entitlement |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| None → Proposed | Connect BDP / System / RM | Approved basis candidate (referral, Circle-building, platform assign) |
| Proposed → Pending Evidence | Ops | Evidence required |
| Proposed / Pending Evidence → Active | Platform Ops | Approved basis + evidence; **no self-approval** by beneficiary BDP |
| Proposed → None | Ops | Rejected |
| None → Active | Platform Ops | Formal platform assignment under approved rules |
| Active → Disputed | Ops / Compliance / BDP (raise) | Conflict raised |
| Disputed → Active / Reassigned / Voided / None | Ops / authorised dispute resolution | Resolution recorded |
| Active → Suspended | Ops | Approved hold reason |
| Suspended → Active / Reassigned | Ops | Hold lifted or reassignment |
| Active → Reassigned (Closed) | Platform Ops | Reassignment effective date; future earnings follow new attribution |
| Active / Disputed → Voided | Ops / Compliance | Fraud or invalid basis |

**Locked:** Later assignment does **not** automatically create retroactive commission on historical unattributed revenue (align with FD-036 / FD-029 principles). Renewal commission follows valid attribution rules at earning time (FD-025 / FD-029).

## Side effects

- Attach attribution id to membership / Circle commercial context
- Enable Estimated→Earned commission path only when Active at earning event
- Unattributed membership revenue: Connect BDP share does **not** accrue as owed commission
- Preserve historical attribution after reassignment
- Franchise recovery deductions apply only to earned/approved commission (FD-029) — separate from attribution status

## Audit events

`connect_attr.proposed`, `connect_attr.activated`, `connect_attr.disputed`, `connect_attr.resolved`, `connect_attr.suspended`, `connect_attr.reassigned`, `connect_attr.voided` — BDP id, membership id, Circle id, effective dates, basis, actor, reason. No silent rewrite of historical attribution.

## Failure handling

- Missing attribution at earning event → no Connect BDP entitlement for that event
- Self-attribution by BDP without platform confirmation → reject
- Backdating without authorised exception → reject (default no retroactive)

## Terminal states

Reassigned (Closed), Voided; None is ongoing absence, not terminal.

## Not in scope

- Marketplace BDP venue attribution
- Affiliate programmes (**inactive**)
- Commission payout states (SM_Commission)

## Unresolved

- Exact evidence checklist for each basis type — Pending Operational Design
- Exact dispute SLA — Pending Operational Design
