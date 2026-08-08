# SM_Ops_Case — Operations Case Lifecycle

## Authority

- **FD-023** RBAC / SoD / department-scoped Admin
- **FD-035** Identity, assignments, workspaces (no ordinary Super Admin)
- Phase 13 plan — Operational Recommendation SLAs (not Founder commercial law)

## Purpose

Shared **ops case shell** for Support / Ops / Compliance / Finance review. Domain disputes (Phase 6/8/9/11/12) remain authoritative for their entities; `ops_cases` links via `ops_case_links`.

## States

| State | Meaning |
|-------|---------|
| open | Created; unassigned or queue-owned |
| assigned | Owner set |
| investigating | Active investigation |
| waiting_on_customer | Blocked on customer |
| waiting_on_partner | Blocked on partner |
| waiting_on_internal | Blocked on internal team |
| escalated | Escalation level increased |
| resolved | Outcome recorded |
| closed | Terminal close |
| reopened | Returned from resolved/closed |

## Allowed transitions (summary)

| From → To | Guards |
|-----------|--------|
| open → assigned / investigating / waiting_* / escalated | Actor has `ops.cases.manage` |
| assigned → investigating / waiting_* / escalated / resolved | Owner or authorised reassign |
| investigating → waiting_* / escalated / resolved | Reason on sensitive exits |
| waiting_* → investigating / escalated / resolved | Resume or escalate |
| escalated → investigating / resolved | Higher queue may demote only via audit |
| resolved → closed / reopened | Reopen requires reason |
| closed → reopened | Authorised reopen + reason |
| reopened → assigned / investigating | Reset active work |

## Hard rules

- Internal notes never customer-visible by default
- Assignment/escalation audited; ownership history preserved
- Self-approval forbidden on linked approval/override actions
- RM/PRM have relationship scope — not finance release authority
- Security case type restricts evidence to Compliance/Platform

## Implementation

- Tables: `ops_cases`, `ops_case_events`, `ops_case_notes`, `ops_case_links`
- Services: `lib/architecture/ops-admin/operations.ts`
- UI: `/ops/cases`
