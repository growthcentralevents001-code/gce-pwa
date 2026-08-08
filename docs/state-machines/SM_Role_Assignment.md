# SM_Role_Assignment — Scoped Role Assignment

## Authority

- **FD-035** GCE Identity, Role Assignment, and Workspace Architecture (primary)
- Related: FD-023 (RBAC — where cited by FD-035), FD-025/033/026 (BDP roles), FD-030 (Governing Body), FD-039 (Super Admin not ordinary product role)

## Purpose

Model lifecycle of a **scoped role assignment** attached to a permanent **User** identity. Roles are separate assignments — not one overloaded global role enum. Multi-role allowed subject to conflict / separation-of-duties rules. Suspending one assignment should not automatically destroy unrelated roles.

## States

| State | Meaning (FD-035 §47–§53) |
|-------|--------------------------|
| Pending | Created/requested; activation conditions incomplete |
| Active | Conditions satisfied; permissions usable in scope |
| Suspended | Temporarily blocked |
| Expired | Natural end date / term ended |
| Revoked | Removed for cause / compliance before natural end |
| Terminated | Ended through completed exit process |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| (none) → Pending | Ops / authorised assigner / system | User exists; role type allowed; scope defined (Circle, city, venue portfolio, client, org, etc.) |
| Pending → Active | Ops / system | KYC/agreement/payment/training/verification as required for that role; **no self-approval** of own commercial activation where prohibited |
| Pending → Revoked / Terminated | Ops | Abandoned or denied |
| Active → Suspended | Ops / Compliance | Suspension grounds; scope-limited |
| Suspended → Active | Ops | Reinstatement conditions |
| Suspended → Revoked / Terminated | Ops | Exit from suspension |
| Active → Expired | System | Term/end date |
| Active → Revoked | Ops / Compliance | Cause |
| Active / Expired / Suspended → Terminated | Ops | Exit process complete |
| Expired → Pending / Active | Ops | Renewal/reappointment process |

**Conflict guards (examples):** beneficiary ≠ approver; Marketplace BDP vs owning Venue rules per FD-035; platform staff external commercial roles need disclosure/approval; Governing Body limits per FD-030.

## Side effects

- Grant/revoke workspace access for that scope only
- Start/stop notifications and task queues
- Preserve historical assignment records (no silent rewrite)
- May gate BDP attribution creation but does not itself create commission

## Audit events

`role.pending`, `role.activated`, `role.suspended`, `role.expired`, `role.revoked`, `role.terminated` — user id, role type, scope, actor, reason, evidence. Multi-role changes audited per assignment.

## Failure handling

- Assigning conflicting roles without waiver → reject
- Activating without required pack payment (BDP) → remain Pending
- Using “Super Admin” as ordinary product role — inactive/non-compliant (FD-039)

## Terminal states

Expired (may renew), Revoked, Terminated.

## Not in scope

- Membership lifecycle (separate)
- Permission bit design / technical RBAC schema — Pending Technical Design
- Native mobile apps

## Unresolved

- Exact technical schema for assignments — Pending Technical Design (FD-035)
- Some multi-role waiver workflows — Pending Operational / Security Design where listed pending in FD-035
