# SM_Circle — Circle Dual Status Families

## Authority

- **FD-024** GCE Connect Circle Lifecycle (lifecycle family)
- **FD-030** GCE Connect Circle Architecture and Governance (constitutional family)
- **FD-032** Phase 1 Authority, Status Mapping, and Supersession Clarification (official mapping)
- Related: FD-025 (Connect BDP target credit), FD-036 (allocation)

## Purpose

Every Circle carries **two linked but distinct status families**. They must **not** be collapsed into one enum (FD-032 §6–§11). Phase 2 must preserve `circle_lifecycle_status` and `circle_constitution_status` (or equivalent).

## States

### A. Lifecycle status (FD-024)

| State | Meaning |
|-------|---------|
| Draft | Creation request not yet approved |
| Formation | Platform-approved; building founding members |
| Pending Activation | Formation substantially complete; final activation pending |
| Active | Platform granted activation (operating base) |
| Growth | Building toward capacity (often labeled Active Growth in FD-032 mapping) |
| Full Capacity | 40 approved and paid active seats |
| Mature | Stable operations — **measurable criteria Pending Founder Approval** (FD-024 §14) |
| Under Review | Compliance/performance review; not automatically Suspended |
| Suspended | Platform suspension |
| Merged | Formally combined into another Circle |
| Archived | No longer operational; records preserved |

### B. Constitutional status (FD-030 / FD-032)

| State | Meaning |
|-------|---------|
| Formation Circle | Below Provisionally Active threshold |
| Provisionally Active Circle | 20–39 approved and paid active members |
| Fully Constituted Circle | 40 approved and paid active members |

### Official member-count mapping (FD-032 §7)

| Approved & paid active members | Lifecycle (mapping view) | Constitutional |
|-------------------------------|--------------------------|----------------|
| 0–14 | Formation | Formation Circle |
| 15–19 | Active Growth | Formation Circle |
| 20–39 | Active Growth | Provisionally Active Circle |
| 40 | Full Capacity | Fully Constituted Circle |

**15 / 20 / 40** thresholds are locked. Hard max **40** active physical seats.

## Allowed transitions

### Lifecycle (illustrative; platform-controlled)

| From → To | Actor | Guards |
|-----------|-------|--------|
| Draft → Formation | Platform Ops | Creation validated (FD-024 §6) |
| Draft → Archived | Platform Ops | Creation rejected |
| Formation → Pending Activation | Platform Ops | Formation requirements substantially complete |
| Formation / Pending Activation → Active (+ Growth) | Platform Ops | Activation conditions: ≥15 approved paid founding members **and** verification, seat validity, platform activation recorded (FD-032 §9) |
| Active / Growth → Full Capacity | System / Ops | Exactly 40 active seats filled; constitutional Fully Constituted |
| * → Under Review | Ops / Compliance | Review grounds |
| Under Review → prior / Suspended | Ops | Review outcome |
| * → Suspended | Ops | Suspension grounds |
| Suspended → Active / Growth / Under Review | Ops | Reinstatement |
| * → Merged | Platform Ops | Merge process complete |
| Merged / Suspended / Full Capacity → Archived | Ops | Archive criteria |

### Constitutional (driven by approved paid active count + mapping)

| Trigger | Constitutional effect | Guards |
|---------|----------------------|--------|
| Count 0–19 | Formation Circle | Count = approved & paid **active** seats only |
| Count reaches 20 | → Provisionally Active Circle | Does **not** create second BDP target credit |
| Count reaches 40 | → Fully Constituted Circle | Hard cap; no overfill |

Connect BDP **activation target credit** occurs once at formal **15-member platform activation**, not again at 20 or 40 (FD-032 §10).

Member count alone does **not** create platform activation.

## Side effects

- Update both status fields and status-change history
- On formal activation at 15: record Connect BDP target credit if conditions met
- Seat availability / waitlist behaviour as capacity approaches 40
- Governance eligibility may depend on constitutional stage (FD-030)
- Preserve history on merge/archive

## Audit events

`circle.created`, `circle.lifecycle_changed`, `circle.constitution_changed`, `circle.activation_granted`, `circle.bdp_target_credited`, `circle.under_review`, `circle.suspended`, `circle.merged`, `circle.archived` — include both previous/new lifecycle and constitutional values, member count snapshot, actor, reason.

## Failure handling

- Attempt to activate below 15 or without platform approval → reject; remain Formation / Pending Activation
- Attempt to exceed 40 seats → hard fail (seat machine)
- Collapsing dual statuses in implementation → **non-compliant** with FD-032

## Terminal states

Merged, Archived (Suspended may reinstate).

## Not in scope

- Individual seat reservation (SM_Circle_Seat)
- Membership Active without allocation
- Exact Mature criteria

## Unresolved

- Exact measurable Mature criteria — Pending Founder Approval (FD-024)
- Exact technical dual-field names — Pending Technical Design (concept locked)
