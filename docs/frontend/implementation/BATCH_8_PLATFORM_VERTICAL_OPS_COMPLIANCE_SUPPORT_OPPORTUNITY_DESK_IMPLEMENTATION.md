# Batch 8 — Platform Ops + Vertical Ops + Compliance + Support + Opportunity Desk

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Operations experience ready for review** (non-blocking gaps remain) |
| **Date** | 2026-08-10 |
| **Branch** | `development` |
| **Batch 9** | Not started |
| **Phase 14B** | Not started |
| **Shell** | Canonical `OpsShell` + PartnerShell for workspace dashboards |

---

## Routes

### Platform / Vertical Ops

| ID | Route | Status |
|----|-------|--------|
| OPS-01 | `/ops` | Adapted — GCE KPI strip + action center |
| OPS-02 | `/ops/approvals` | Adapted — ApprovalQueue + SoD UI |
| OPS-03 | `/ops/exceptions` | Adapted — ExceptionQueue |
| OPS-04 | `/ops/cases` | Adapted |
| OPS-05 | `/ops/cases/[id]` | Adapted — CaseDetail |
| OPS-06 | `/ops/connect` | Adapted — boundary copy |
| OPS-07 | `/ops/marketplace` | Adapted — Venue final approval copy |
| OPS-08 | `/ops/enterprise` | Adapted — co-sign / no territory copy |
| OPS-09 | `/ops/finance` | Adapted — entry to Batch 7 Finance |
| OPS-10 | `/ops/incidents` | Adapted |
| OPS-11 | `/ops/security` | Adapted — audit / risk / alerts tabs |
| OPS-12 | `/dashboard/platform-ops` | Rebuilt — RM/PRM/Expert scoped |

### Compliance / Support / Desk

| ID | Route | Status |
|----|-------|--------|
| CMP-01 | `/dashboard/compliance` | Created |
| CMP-02 | `/ops/compliance` | Adapted |
| CMP-03 | `/ops/privacy` | Kept (Phase 13) |
| CMP-04 | `/compliance/holds` | Created — explicit hold UI |
| SUP-01 | `/dashboard/support` | Created |
| SUP-02 | `/ops/support` | Adapted |
| DESK-01 | `/dashboard/opportunity-desk` | Created |
| DESK-02 | `/desk/queue` | Created |
| DESK-03 | `/desk/leads/[id]` | Created — privacy-safe |
| — | `/ops/moderation` | Created |

Workspace keys reused (no invent): `platform-ops`, `compliance`, `support`, `opportunity-desk`, plus `/ops` vertical permissions.

---

## Governance preserved

- No Super Admin productization / no mega-admin screen
- Platform ≠ Finance ≠ Compliance ≠ Support
- RM/PRM: scoped ops views; no automatic commission / finance / compliance inheritance
- Self-approval: UI hides approve when requester === actor; backend `assertOpsNotSelfApproval`
- No `forceUpdate` / `forceApprove` / edit-raw-state UI
- Finance: `/ops/finance` is entry only → Batch 7; settlement/payout/refund execution remain OFF
- Marketplace: Ops final Venue approval; MBDP recommend ≠ approve
- Connect: System proposes → BDP assists → Platform confirms
- Opportunity Desk: fallback/escalation; candidate ≠ assignment; contact reveal server-authorized; paid Lead Assist OFF
- Compliance holds: create/release with reason — not a toggle; safe non-legal wording
- Support: cannot invent business-state overrides

---

## Shared Ops components

| Component | Foundation |
|-----------|------------|
| OpsKpiStrip | KpiCard |
| OpsQueueCard | GCE card language |
| ApprovalQueue + ApprovalActions | PartnerDataTable + AlertDialog |
| ExceptionQueue | PartnerDataTable / cards |
| CaseDetail | Timeline + StatusBadge |
| ComplianceHoldCard + actions | StatusBadge + AlertDialog |
| AuditTimeline | Timeline |
| IncidentCard | OpsQueueCard |
| ModerationReviewList | OpsQueueCard |
| OpsSearch | Dialog + ⌘K (21st command palette structure) |
| DeskReviewActions | AlertDialog + lead-assist API |

---

## 21st.dev (search-only)

| Search | IDs | Adopted | Rejected |
|--------|-----|---------|----------|
| Ops / approval | 23595, 23792, 8371, 2737 | Confirm footer / dense overview structure | Blue admin themes, Super Admin sidebar, rainbow KPI |
| Command palette | 2075, 23522, 5530, 8115 | Keyboard search + categorized results | Neon overlays, unscoped data dump |
| Audit timeline | 23363 | Vertical activity structure | Heavy spring dial chrome |

ui-ux-pro-max “Financial Dashboard / Sales Intelligence” blue trust colours — **rejected**; MASTER orange/cream retained.

---

## Visual / motion / glass

- No decorative blue in Batch 8 owned paths
- Ops denser than partner CX; restrained motion (dialogs, search)
- Glass: optional status strip on `/ops` hub only — not on tables/queues
- StatusBadge semantic tones only

---

## Backend gaps (Batch 8)

| ID | Gap | Class |
|----|-----|-------|
| BG-08 | Opportunity Desk dedicated filters API | Convenience (confirmed) |
| BG-10 | Global ops search DTO redaction contract docs | Search (confirmed) |
| BG-30 | Ops queue cursor pagination beyond limit 100 | Pagination |
| BG-31 | Full compliance hold state machine (proposed / release_requested / rejected) | UX read-model — backend today active/released |
| BG-32 | Authenticated Playwright smoke identities for Ops roles | Test infra |

---

## Tests / gates

- Unit: `tests/unit/batch8-ops-presentation.test.ts` (SoD, RBAC scope, boundary copy, masking)
- Existing Phase 13 SoD tests remain
- Authenticated browser smoke: **deferred** (no test identities) — BG-32

---

## Security / privacy

- Direct URL authorization on every page
- Search requires `ops.search`
- Desk lead page uses `presentLeadPrivacySafe` — no email/phone render
- Hold subject ids masked in cards
- Root/emergency admin not linked in nav

---

## Replacement register (owned)

| OLD | Action | NEW | Reason |
|-----|--------|-----|--------|
| Plain `/ops` list markup | REPLACE | PageHeader + OpsKpiStrip + ActionCenter | GCE Ops language |
| `approval-actions.tsx` inline | REFINE | `components/ops/ApprovalActions` | Confirm + SoD UI |
| Neutral vertical-ops cards | REPLACE | Shared queues + boundary copy | Consistency |
| Generic workspace desk panel | REPLACE | `/desk/*` + desk dashboard | Inventory DESK routes |
| Legacy mega-admin assumption | RETIRE (owned paths) | Scoped nav + permissions | No Super Admin |

Unrelated dirty `app/admin/**` WIP left untouched.
