# SM_Enterprise_Milestone — Enterprise Milestone

## Authority

- **FD-038** Enterprise Cross-Vertical Commercial and Approval Rules (§21–§23)
- **FD-026** GCE Enterprise Business and Operating Architecture
- **FD-021** Settlement Engine (awaiting milestone approval)
- **FD-029** Commission earning triggers

## Purpose

Model **project-specific** commercial milestones. There is **no universal advance percentage** and **no fixed 30/40/30** (or similar) template required by Founder Decision (FD-038 §21–§23). Each project preserves its approved milestone schedule.

## States

| State | Meaning |
|-------|---------|
| Planned | On project schedule; not started |
| Open | Active milestone window |
| Deliverables Submitted | Vendor/Expert submitted evidence |
| Under Review | Internal / client review |
| Approved | Milestone accepted |
| Payment Pending | Awaiting client payment for milestone |
| Paid | Payment captured for milestone |
| Settlement Eligible | Passed settlement guards for this component |
| Settled | Vendor/platform/BDP components settled as applicable |
| Rejected | Deliverables rejected |
| Waived / Skipped | Approved schedule change removed milestone |
| Cancelled | Milestone cancelled with project/change order |

Common **types** (not fixed amounts): booking/advance, pre-event, mid-project, delivery, acceptance, retention — FD-038 §22.

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Planned → Open | System / Ops | Schedule start / prior dependency satisfied |
| Open → Deliverables Submitted | Vendor / Expert | Evidence uploaded |
| Deliverables Submitted → Under Review | System | Reviewers assigned |
| Under Review → Approved | Client Representative / authorised Ops | Acceptance authority |
| Under Review → Rejected | Client / Ops | Fail criteria |
| Rejected → Open / Deliverables Submitted | Expert / vendor | Rework |
| Approved → Payment Pending | System | Invoice/payment schedule |
| Payment Pending → Paid | Finance / System | SM_Payment success |
| Paid → Settlement Eligible | Settlement engine | Hold/refund/dispute clear; component rules |
| Settlement Eligible → Settled | Finance / System | SM_Settlement success for component |
| Planned / Open → Waived / Skipped | Ops | Change order approved |
| * → Cancelled | Ops | Project cancel / change order |

**Commission guard (FD-026):** Enterprise BDP commission becomes earned proportionately only after related milestone approved, platform commission settlement-eligible, attribution valid, no material refund/dispute.

## Side effects

- Update project completion %
- Create payment intents per milestone
- Drive componentised vendor settlement and BDP commission estimates→earned
- Keep audit of schedule versions (no silent rewrite of approved plan)

## Audit events

`ent_ms.opened`, `ent_ms.submitted`, `ent_ms.under_review`, `ent_ms.approved`, `ent_ms.rejected`, `ent_ms.payment_pending`, `ent_ms.paid`, `ent_ms.settlement_eligible`, `ent_ms.settled`, `ent_ms.waived`, `ent_ms.cancelled` — milestone type, amounts, actors, evidence refs.

## Failure handling

- Approve without evidence when evidence required → reject transition
- Settle before Paid when payment required → block
- Applying a global 30/40/30 without project schedule — non-compliant

## Terminal states

Settled, Waived / Skipped, Cancelled.

## Not in scope

- Defining a default percentage split for all projects
- Marketplace event 48h cancel policy

## Unresolved

- Standard library of milestone templates (optional accelerators) — Pending Product Design; must remain non-mandatory
- Retention milestone legal form — Pending Legal/Commercial Design where used
