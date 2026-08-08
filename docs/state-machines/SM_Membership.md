# SM_Membership — Membership Lifecycle

## Authority

- **FD-022** Membership Lifecycle (primary)
- **FD-027** Membership Commercial and Operating Architecture
- **FD-036** Membership Attribution, Approval, and Allocation Authority
- Related: FD-020/021 (payment/settlement), FD-035 (roles), FD-039 (KYC posture)

## Purpose

Model the GCE Connect membership commercial/participation relationship from application through terminal archive. **Activation and Circle allocation are separate states** (FD-022 §8, FD-036 §12). Payment alone does not activate membership.

## States

| State | Meaning |
|-------|---------|
| Draft | Application started; incomplete |
| Applied | Submitted for processing |
| Pending Payment | Awaiting successful payment |
| Pending Verification | Payment ok / in parallel; KYC/business checks incomplete |
| Pending Approval | Verification complete; platform approval pending |
| Active | Platform activation recorded; Circle allocation may still be pending |
| Grace Period | Renewal overdue; limited protection per FD-022 |
| Frozen | Voluntary freeze |
| Restricted | Limited rights (compliance / governance) |
| Suspended | Platform suspension |
| Expired | Grace ended or term ended without renewal |
| Terminated | Ended by platform/member process |
| Rejoining Review | Former member reapplying |
| Archived | Historical retention only |

Exact enum names may be refined (FD-022); business meaning must remain consistent.

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Draft → Applied | Applicant / system | Required application fields present |
| Applied → Pending Payment | System | Product selected; seat check advisory completed (FD-036) |
| Pending Payment → Pending Verification | Payment system | Payment success recorded |
| Pending Payment → Applied / Terminated | System / Support | Payment failed / abandoned (policy TBD) |
| * → Pending Verification | Compliance / Ops | KYC or business verification incomplete |
| Pending Verification → Pending Approval | Compliance / Ops | Verification outcomes acceptable |
| Pending Approval → Active | Platform Ops | Activation conditions met (payment, verification, eligibility, terms); **allocation not required** |
| Active → Grace Period | Billing | Renewal due and unpaid |
| Grace Period → Active | Billing / member | Renewal paid + conditions |
| Grace Period → Expired | System | Grace expired (FD-022) |
| Active → Frozen | Member / Ops | Freeze approved |
| Frozen → Active | Member / Ops | Reinstatement conditions |
| Active / Grace → Restricted | Compliance / Ops | Restriction grounds |
| Restricted → Active | Ops | Restriction lifted |
| * (non-terminal) → Suspended | Ops / Compliance | Suspension grounds + notice |
| Suspended → Active | Ops | Reinstatement conditions |
| Active / Expired → Terminated | Ops / member process | Termination process complete |
| Terminated / Expired → Rejoining Review | Applicant | Rejoin application |
| Rejoining Review → Pending Payment / Pending Verification / Active | Ops | Per rejoining rules |
| Terminal path → Archived | System / Ops | Retention policy |

**Locked:** Active membership may exist **without** Circle seat allocation (pre-allocation benefits only). Max Circle capacity **40** seats is a seat machine concern, not a blocker of membership Active.

## Side effects

- Create/update membership identity, plan, city, category, Tags
- Link payment and verification records
- Optionally create Connect BDP attribution (separate machine) — **not automatic**
- Notify applicant of activation / grace / suspension
- Restrict Circle-specific rights until allocation (FD-036 §14)
- Preserve trust/performance history across status changes (FD-022)

## Audit events

`membership.applied`, `membership.payment_recorded`, `membership.verification_updated`, `membership.approval_decision`, `membership.activated`, `membership.allocation_pending` (informational), `membership.grace_entered`, `membership.frozen`, `membership.restricted`, `membership.suspended`, `membership.expired`, `membership.terminated`, `membership.rejoin_started`, `membership.archived` — actor, previous/new state, reason, evidence refs.

## Failure handling

- Payment success + activation incomplete → controlled pending state; **no double activation** (FD-022 §7)
- Verification fail → remain Pending Verification or reject toward Terminated/Archived with reason
- Seat unavailable → membership may still activate; route to waitlist / alternate Circle (SM_Circle_Seat / FD-036)
- Attribution missing → membership may activate; **no Connect BDP commission** (SM_Connect_BDP_Attribution)

## Terminal states

Expired (may rejoin), Terminated, Archived.

## Not in scope

- Circle lifecycle / constitutional status
- Commission calculation
- Exact form fields, activation SLA, database enum (FD-022 unresolved)

## Unresolved

- Exact activation SLA — Pending Operational Design (FD-022)
- Exact technical enum — Pending Technical Design
- Exact dues/billing sub-statuses — defer to finance docs
