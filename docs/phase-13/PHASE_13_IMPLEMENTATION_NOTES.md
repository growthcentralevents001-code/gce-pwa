# Phase 13 — Admin, Operations & Support Implementation Notes

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Authority** | FD-023 / FD-025 / FD-026 / FD-033 / FD-034 / FD-035 / FD-036 / FD-037 / FD-038 / FD-039; ADR-002/003/010/013 |
| **Migration** | `supabase/migrations/20260808240000_phase13_admin_operations_support.sql` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |
| **Money / live providers** | Payments, settlement, payout, refund_processing **OFF**; email/SMS/push live **OFF**; marketing **OFF**; retention_enforcement **OFF** |

---

## Authority map used

| Surface | Canonical roles / authority | Notes |
|---------|----------------------------|-------|
| Platform Ops | `platform_admin` | Cross-vertical oversight; not unrestricted Finance |
| Connect Ops | Platform / Support / RM / PRM | Calls Phase 5/6 services; no duplicate membership logic |
| Marketplace Ops | Platform / Support | Event/Offer/Venue approve via queues → domain services |
| Enterprise Ops | Platform / Expert / Support | Finance co-sign **> ₹5L** remains Phase 8 (FD-038) |
| Finance Admin | `finance_admin` | Console over Phase 9 only; no ledger mutators |
| Compliance Admin | `compliance_admin` | Holds / privacy / security via Phase 12 |
| Support Admin | `support_admin` | Cases + limited context; no KYC/bank bodies; no commission edit |
| RM | `relationship_manager` | Relationship / first-line; **no commission** |
| PRM | `platform_relationship_manager` | Escalated dispute; **no commission** |
| Emergency root | Break-glass Phase 4 only | Not exposed in `/ops` nav |

---

## Prompt-vs-FD discrepancies recorded

1. Prompt filename implied `PHASE_13_ADMIN_OPERATIONS_SUPPORT` — matched repo plan (used).
2. Prompt may imply Super Admin product navigation — **rejected** (FD-039 / FD-035).
3. Prompt refund economics — **not** invented; OD-006 remains `manual_review_required`.
4. SLA tables in Phase 13 plan remain **Operational Recommendation**, not Founder commercial law.
5. No conflict requiring Founder clarification; FD hierarchy resolved all overlaps.

---

## Shared case strategy

**Strategy A — umbrella `ops_cases` linked to domain records.**

Phase 6/8/9/11/12 dispute and support tables remain SoT for their domains. Phase 13 adds:

| Table | Role |
|-------|------|
| `ops_cases` | Shared case shell (type, vertical, status, owner, SLA metadata) |
| `ops_case_events` | Timeline / assignment / escalation history |
| `ops_case_notes` | Internal vs customer-visible notes (`visibility`) |
| `ops_case_links` | Links to domain entities (`entity_type` + `entity_id`) |
| `customer_support_signals.ops_case_id` | Promote CX signal → ops case |

Legacy domain disputes are **not** deleted or replaced.

---

## Approval / exception queue model

| Table | Nature |
|-------|--------|
| `ops_approval_queue` | **Projection** — references domain object; approve calls domain services |
| `ops_exception_queue` | Operational exceptions with severity/owner/resolution |

Actions: approve / reject / request_changes / assign / escalate / hold.

Hard rules:

- No self-approval (`assertOpsNotSelfApproval`)
- No generic `forceUpdate` / force-approve-everything endpoint
- Double-review blocked via status checks + audit

---

## Manual override boundaries

`ops_overrides` with typed categories:

- attribution_correction
- seat_allocation_correction
- workflow_state_correction
- approval_correction
- refund_exception_request
- rank_review
- data_correction

Each requires reason, previous/intended state, permission, audit; second approver where SoD requires (`ops.overrides.approve`).

---

## Finance immutability boundary

Phase 13 **does not** expose ledger edit APIs. Refund / financial reviews:

- update CX/Finance review status via Phase 9/11 services
- corrections must use Phase 9 reversal/adjustment architecture
- settlement/payout execution flags remain OFF

---

## RM / PRM scope

Permission keys `ops.rm` / `ops.prm`. Visibility scoped to relationship/support queues. **No** financial entitlement creation from these roles.

---

## Support access restrictions

Support may manage cases and see redacted search hits. Must **not**:

- alter commissions / ledger
- approve own refund (SoD)
- assign privileged roles
- view unrestricted KYC/bank document bodies in notes

Internal notes: `visibility=internal` RLS — operators only.

---

## Incident workflow

Minimal flow over Phase 12 `incident_signals` + `ops_incident_actions`:

candidate → acknowledge → assign → investigate → contain/mitigate → resolve (+ post-incident notes).

Security incidents: Compliance/Platform scope; ordinary Support/BDP/Venue do not get evidence dumps.

Risk review remains human-controlled (`flag_only` + disposition).

---

## Legacy admin adaptation strategy

| Path | Classification |
|------|----------------|
| Dirty `app/admin/*`, legacy BDM/ZBP/Affiliate | **Unsafe / WIP** — left untouched; not wired to Phase 13 RBAC |
| Canonical control plane | **New** isolated `/ops/*` |
| Workspace dashboards | Continue Phase 4 `/dashboard/[workspaceKey]` |

Adapters preferred over rewriting legacy admin.

---

## Feature-flag safety posture (gce-dev)

| Flag | Enabled |
|------|---------|
| `ops_approval_queues` / `ops_exception_queues` / `ops_case_management` / `ops_moderation` / `ops_manual_overrides` / `ops_support_console` / `ops_incident_console` | ON |
| `marketplace_ticket_payments` / `settlement_execution` / `payout_execution` / `refund_processing` | **OFF** |
| `notifications_*_live` / `marketing_notifications` | **OFF** |
| `retention_enforcement` | **OFF** |
| `security_monitoring` / `fraud_review` | ON (review-oriented) |

---

## Services / API / UI

- Domain: `lib/architecture/ops-admin/**`
- API: `app/api/ops/admin/route.ts`
- UI: `/ops`, `/ops/approvals`, `/ops/exceptions`, `/ops/cases`, `/ops/connect`, `/ops/marketplace`, `/ops/enterprise`, `/ops/finance`, `/ops/compliance`, `/ops/support`, `/ops/incidents` (+ Phase 12 notifications/security/privacy)

---

## Verification

- Migration applied on gce-dev; SQL harness `PHASE13_OPS_ADMIN_OK`
- Types regenerated (`ops_cases`, queues, `gce_next_ops_case_number`, …)
- Unit + integration Phase 13 tests green
- Full suite green; typecheck + build green
- Production untouched
- Unrelated dirty WIP preserved unstaged

## Not started

- Phase 14 full regression / migration rehearsal / UAT
- Live email/SMS/push or marketing
- Destructive retention purge
- Legacy `/admin` rewrite
- Contractual support SLAs (remain Operational Recommendation)
