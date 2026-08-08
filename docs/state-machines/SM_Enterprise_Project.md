# SM_Enterprise_Project — Enterprise Project

## Authority

- **FD-026** GCE Enterprise Business and Operating Architecture
- **FD-038** Enterprise Cross-Vertical Commercial and Approval Rules
- Related: FD-021 (settlement), FD-029 (commission), FD-037 (cross-vertical venue use)

## Purpose

Model Enterprise **project delivery** after commercial acceptance. Supports componentised commercial allocation and **no double commission** across Marketplace/Enterprise on the same rupee/component. Milestones are **project-specific** (see SM_Enterprise_Milestone).

## States

| State | Meaning |
|-------|---------|
| Initiated | Project opened from accepted quote/PO |
| Contracting | Contract / PO finalisation |
| Awaiting Initial Payment | Initial payment pending |
| Active / In Delivery | Work orders / execution underway |
| Change Requested | Scope/commercial change |
| On Hold | Paused |
| Completion Evidence Pending | Delivery done; evidence gathering |
| Client Confirmation Pending | Awaiting client acceptance |
| Settling | Vendor settlement + commission distribution in progress |
| Completed / Closed | Closed |
| Disputed | Dispute open |
| Suspended | Compliance/ops suspension |
| Cancelled | Cancelled after initiation |
| Reopened | Reopened after close for approved reason |

Recommended long path in FD-026 §45 informs sub-stages inside Active; exact technical enums Pending Technical Design.

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Initiated → Contracting | Expert / Ops / Legal path | Accepted quote linkage |
| Contracting → Awaiting Initial Payment | Ops | Contract/PO recorded |
| Awaiting Initial Payment → Active / In Delivery | System / Finance | Initial SM_Payment success per project terms |
| Active → Change Requested | Client / Expert | Change raised |
| Change Requested → Active / Contracting | Ops | Change approved & documented; commercial re-approval if needed |
| Active → On Hold / Suspended | Ops | Hold/suspension grounds |
| On Hold / Suspended → Active | Ops | Cleared |
| Active → Completion Evidence Pending | Expert / vendors | Execution claimed complete |
| Completion Evidence Pending → Client Confirmation Pending | Expert | Evidence packaged |
| Client Confirmation Pending → Settling | Client Representative / Ops | Confirmation recorded |
| Settling → Completed / Closed | Finance / Ops | Vendor settlements + commission paths completed or parked per rules |
| * → Disputed | Parties / Ops | Dispute |
| Disputed → Active / Settling / Cancelled | Ops | Resolution |
| * → Cancelled | Ops / client process | Cancellation authority |
| Completed → Reopened | Ops | Approved reopen |
| Reopened → Active / Settling | Ops | Reopen plan |

**Guards:** Valid Enterprise BDP attribution for commission; component-level entitlement; Marketplace venue use does not auto-apply 80/10/10 to whole project (FD-037/038).

## Side effects

- Spawn project-specific milestones (SM_Enterprise_Milestone)
- Component settlement lines (vendors, platform fee, BDP commission)
- Block duplicate BDP entitlements on same component
- Preserve attribution history

## Audit events

`ent_project.initiated`, `ent_project.active`, `ent_project.change_requested`, `ent_project.on_hold`, `ent_project.completion_evidence`, `ent_project.client_confirmed`, `ent_project.settling`, `ent_project.closed`, `ent_project.disputed`, `ent_project.cancelled`, `ent_project.reopened` — actors, component summary refs, reason.

## Failure handling

- Delivery without milestone approvals where required → block Settling for those components
- Double commission posting — reject
- Payment failure — remain Awaiting Initial Payment; no silent Active

## Terminal states

Completed / Closed, Cancelled (Reopened exits terminal).

## Not in scope

- Universal milestone percentage template
- Vendor self-serve portal (inactive)

## Unresolved

- Exact mapping of every FD-026 §45 step to enums — Pending Technical Design
- Dispute SLA — Pending Operational Design
