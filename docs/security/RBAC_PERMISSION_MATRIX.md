# RBAC_PERMISSION_MATRIX

| Field | Value |
|-------|-------|
| **Status** | Living documentation (Phase 9 — Finance resources implemented on gce-dev) |
| **Classification** | Logical permission matrix — **Technical recommendation** where codes not Founder-finalised |
| **Authority** | FD-023 (RBAC principles), FD-035 (identity / assignment / workspace); role names → `docs/core/35_Role_Taxonomy.md` |
| **Related** | [`RLS_ACCESS_MATRIX.md`](./RLS_ACCESS_MATRIX.md), `docs/core/19_Permissions_Roles.md` (must defer to FD-023), `docs/phase-4/PHASE_4_IMPLEMENTATION_NOTES.md` |

---

## Authority

- **FD-023** — access-control architecture, role families, SoD, financial separation, scopes.
- **FD-035** — User as permanent identity; scoped assignments; workspace isolation; Super Admin not ordinary Phase 2 role.
- **Role taxonomy** — official names and legacy mapping: [`docs/core/35_Role_Taxonomy.md`](../core/35_Role_Taxonomy.md).

Exact **permission codes**, enums, and inheritance graphs are **not finalised** in Founder Decisions (FD-023). Cells below are **logical intents**. Where a cell is not Founder-explicit, it is marked **(TR)** = Technical recommendation.

---

## Purpose

Provide a role-family × resource × action matrix for Phase 2 design, with explicit **scope**, **self-approval bans**, and Super Admin exclusion.

---

## Not in scope

- Inventing final permission-code strings as Founder law
- Final workspace URLs or dashboard IA
- Equating legacy DB enums (`zbp`, `bdm`, …) to approved roles without taxonomy confirmation
- SQL RLS policies (see [`RLS_ACCESS_MATRIX.md`](./RLS_ACCESS_MATRIX.md))

---

## Action legend

| Action | Meaning |
|--------|---------|
| **R** | Read / view |
| **C** | Create |
| **U** | Update |
| **A** | Approve / reject workflow step |
| **D** | Delete / archive (soft preferred) |
| **F** | Finance-sensitive mutate (ledger adjust, settlement release, payout, commission state change) |
| **P** | Access PII / KYC / identity documents beyond masked defaults |
| **X** | Audit / investigation evidence access |

Scope values: **Self** · **Assigned** · **Org** · **Circle** · **Platform** · **None**.

Symbols: `✓` allowed within scope · `—` not by default · `✗` forbidden (SoD / Founder ban) · `(TR)` technical recommendation.

---

## Hard rules (Founder — apply to all rows)

1. **Least privilege** — role title alone does not grant unrestricted access (FD-023).
2. **Financial ≠ operational** — finance actions require explicit finance permissions (FD-023).
3. **Self-approval of own commission forbidden** — beneficiary ≠ approver (FD-023 / FD-029 / FD-035).
4. **RM / PRM** — no automatic settlement, refund, ledger, or payout authority (FD-023).
5. **Super Admin** — **not** an ordinary Phase 2 product role / workspace (FD-035 / FD-039). Emergency technical root ≠ commercial Super Admin role.
6. **Department-scoped admins** — no universal god mode by default (FD-023).

---

## Role families in this matrix

| Role family | Notes |
|-------------|-------|
| User | Base identity; consumer/authenticated features |
| Circle Member | Seat holder; Circle-scoped |
| Governing Body (limited) | Circle governance support — does not own Circle (FD-030) |
| Connect BDP | Franchise Unit / Circle development scope (FD-025) |
| Marketplace BDP | Venue attribution scope (FD-033) |
| Venue Partner / Rep | Org-scoped venue content (FD-037) |
| Enterprise BDP | Client attribution / Franchise Pack (FD-026 / FD-038) |
| Enterprise Client Rep | Client org scope (FD-038) |
| Platform Ops | Department-scoped platform operations |
| Finance Admin | Finance department admin |
| Compliance Admin | Compliance department admin |
| Support Admin | Support department admin |
| RM | Relationship Manager — ops; no auto finance |
| PRM | Platform Relationship Manager — escalation; no auto finance |

---

## Matrix A — Identity, membership, Circle

| Role | Resource | R | C | U | A | D | F | P | X | Scope |
|------|----------|---|---|---|---|---|---|---|---|-------|
| User | Own profile | ✓ | — | ✓ | — | — | — | Self | — | Self |
| User | Own KYC submit | ✓ | ✓ | ✓ | — | — | — | Self | — | Self |
| Circle Member | Own membership / seat | ✓ | — | limited | — | — | — | Self | — | Self / Circle |
| Circle Member | Other members’ PII | — | — | — | — | — | — | ✗ | — | None |
| Governing Body | Circle governance records | ✓ | ✓ | ✓ | limited | — | — | limited (TR) | — | Circle |
| Governing Body | Activate/terminate membership independently | — | — | — | ✗ | — | — | — | — | None |
| Governing Body | Platform fees / taxonomy publish | — | — | — | ✗ | — | ✗ | — | — | None |
| Connect BDP | Assigned Circles / prospects | ✓ | ✓ | ✓ | verify (TR) | — | — | Assigned (TR) | — | Assigned / FU |
| Connect BDP | Activate Circle independently | — | — | — | ✗ | — | — | — | — | None |
| Connect BDP | Own commission approve | ✓ view | — | — | ✗ | — | ✗ | — | — | Self view only |
| Connect BDP | Own unit / package / target / portfolio | ✓ | apply | limited | — | — | — | Own | — | Own FU |
| Connect BDP | Member attribution | ✓ propose | propose | — | ✗ self | — | — | Own proposed | — | Own FU |
| Connect BDP | City/Circle assignment | ✓ own | — | — | ✗ | — | — | — | — | Own FU |
| Connect BDP | Package recovery / entitlement mutate | ✓ view | — | — | ✗ | — | ✗ | — | — | Self view |
| Connect BDP | First-line dispute | ✓ | ✓ | ✓ | escalate (TR) | — | ✗ | Own | — | Own FU |
| Platform Ops | BDP activate / city / attribution / handover / suspend | ✓ | ✓ | ✓ | ✓ | soft (TR) | — | Assigned | ✓ | Platform |
| Finance Admin | BDP commission + recovery | ✓ | — | recovery (TR) | reconcile (TR) | — | ✓ | ✓ | ✓ | Platform finance |
| PRM | Escalated BDP disputes | ✓ assigned | — | limited | resolve (TR) | — | ✗ commission | Assigned | — | Assigned |
| Platform Ops | Membership workflows | ✓ | ✓ | ✓ | ✓ | soft (TR) | — | Assigned (TR) | ✓ (TR) | Assigned / Platform (TR) |
| RM | Assigned membership/venue cases | ✓ | — | limited | — | — | ✗ | limited (TR) | limited (TR) | Assigned |
| Finance Admin | Membership payment records | ✓ | — | — | refund A (TR) | — | ✓ | ✓ (TR) | ✓ | Platform finance |
| Compliance Admin | KYC / complaints | ✓ | — | — | ✓ | — | — | ✓ | ✓ | Platform compliance |

---

## Matrix B — Marketplace

| Role | Resource | R | C | U | A | D | F | P | X | Scope |
|------|----------|---|---|---|---|---|---|---|---|-------|
| Venue Partner / Rep | Own events / offers / bookings | ✓ | ✓ | ✓ | — | soft (TR) | — | Org customers limited (TR) | — | Org |
| Venue Partner / Rep | Other venues | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | None |
| Marketplace BDP | Attributed venues support | ✓ | onboard (TR) | support (TR) | ✗ sole self-related (FD-035) | — | ✗ settlement | limited (TR) | — | Assigned |
| Marketplace BDP | Settlement / refund release | — | — | — | ✗ | — | ✗ | — | — | None |
| Marketplace BDP | Own commission approve | ✓ view | — | — | ✗ | — | ✗ | — | — | Self view only |
| Marketplace BDP | Own unit / Venue portfolio | ✓ | recommend | limited | ✗ final | — | — | Own unit | — | Assigned venues |
| Marketplace BDP | Venue/Event/Offer final approve | — | — | — | ✗ | — | — | — | — | None |
| Venue Representative | Own Venue Events/Offers | ✓ | draft/submit | ✓ | ✗ self | soft (TR) | ✗ | Org | — | Org |
| Venue Representative | Settlement / commission rules | — | — | — | ✗ | — | ✗ | — | — | None |
| Platform Ops | Venue/Event/Offer/MBDP/attr final | ✓ | ✓ | ✓ | ✓ | soft (TR) | — | ✓ | ✓ | Platform |
| Finance Admin | Marketplace entitlements / recovery | ✓ | — | recovery (TR) | reconcile (TR) | — | ✓ | ✓ | ✓ | Platform finance |
| Customer / User | Browse / book / claim / own history | ✓ public | book/claim | own | — | — | — | Own | — | Self |
| Platform Ops | Venue onboarding approval | ✓ | — | ✓ | ✓ | — | — | ✓ (TR) | ✓ (TR) | Platform ops |
| Finance Admin | Marketplace payments / splits | ✓ | — | adjust (TR) | ✓ | — | ✓ | ✓ | ✓ | Platform finance |
| RM | Assigned venue relationship | ✓ | — | limited | — | — | ✗ | limited (TR) | — | Assigned |

---

## Matrix C — Enterprise

**Implementation note (Phase 8 / gce-dev):** Permission intents enforced in `lib/architecture/enterprise/permissions.ts` + API SoD. Enterprise BDP cannot issue binding quotes or Finance-co-sign. Finance co-sign required for quotes with `total_proposed_minor > 50000000`. Client Rep has no entitlement-read. Platform Expert drafts/structures/issues. See `docs/phase-8/PHASE_8_IMPLEMENTATION_NOTES.md`.

| Role | Resource | R | C | U | A | D | F | P | X | Scope |
|------|----------|---|---|---|---|---|---|---|---|-------|
| Enterprise Client Rep | Own quotes / projects / milestones | ✓ | C change req (TR) | limited | accept quote | — | — | Org | — | Org |
| Enterprise Platform Expert | Requirements / proposals / quotes / components | ✓ | ✓ | ✓ | issue (not finance) | — | ✗ | limited (TR) | — | Assigned |
| Enterprise BDP | Attributed clients / pipeline | ✓ | ✓ BD | ✓ | ✗ finance release / ✗ issue quote | — | ✗ | limited (TR) | — | Assigned |
| Enterprise BDP | Own commission approve | ✓ view | — | — | ✗ | — | ✗ | — | — | Self view only |
| Finance Admin | Quote co-sign / entitlement boundary | ✓ | — | — | ✓ co-sign (FD-038) | — | ✓ | ✓ | ✓ | Platform finance |
| Platform Ops / Admin | Enterprise ops / attribution / reassignment | ✓ | ✓ | ✓ | limited | — | ✗ | limited (TR) | ✓ (TR) | Assigned |

---

## Matrix D — Finance, commission, settlement

**Implementation note (Phase 9 / gce-dev):** Canonical `stakeholder_entitlements`, `settlement_batches`, `payout_items`, holds/reversals/recovery — Finance Admin only for mutate; stakeholders read own summaries. Self-approval of own entitlement/payout banned. Execution flags OFF. See `docs/phase-9/PHASE_9_IMPLEMENTATION_NOTES.md`.

| Role | Resource | R | C | U | A | D | F | P | X | Scope |
|------|----------|---|---|---|---|---|---|---|---|-------|
| Any BDP | Own commission / recovery / payout status | ✓ | — | — | ✗ | ✗ | ✗ | — | — | Self |
| Finance Admin | Ledger / commission / settlement | ✓ | reverse (TR) | — | ✓ | ✗ hard-delete | ✓ | ✓ | ✓ | Platform finance |
| Compliance Admin | Finance audit trail | ✓ | — | — | — | ✗ | — | ✓ (TR) | ✓ | Platform compliance |
| Support Admin | Payment status (masked) | ✓ limited (TR) | — | — | — | — | ✗ | ✗ full | limited (TR) | Case scope (TR) |
| RM / PRM | Case financial context | ✓ limited | — | — | ✗ | — | ✗ | ✗ | limited (TR) | Assigned case |
| Circle Finance Coordinator | Approved Circle financial views | ✓ | maintain records (TR) | — | ✗ own reimbursement (FD-030) | — | ✗ settlement | — | — | Circle |

**Hard-delete of finance/commission rows:** ✗ for all ordinary roles (FD-028 / FD-029). Privacy erasure is a controlled legal workflow, not a role click.

---

## Matrix E — Lead Assist & audit

| Role | Resource | R | C | U | A | D | F | P | X | Scope |
|------|----------|---|---|---|---|---|---|---|---|-------|
| Lead Giver (functional) | Own submitted leads | ✓ | ✓ | limited | — | ✗ history | — | Self | — | Self |
| Opportunity Desk / Platform Ops (TR) | Desk queue | ✓ | ✓ | ✓ | human review | ✗ history | ✗ | ✓ (TR) | ✓ | Desk scope (TR) |
| Circle Member | Received opportunities | ✓ | respond | limited | — | — | — | — | — | Assigned |
| PRM | Escalated lead cases | ✓ | — | limited | — | ✗ | ✗ | limited (TR) | ✓ (TR) | Assigned |
| Compliance Admin | AuditEvent | ✓ | — | — | — | ✗ | — | ✓ | ✓ | Platform |
| Support Admin | AuditEvent | limited (TR) | — | — | — | ✗ | — | — | limited (TR) | Case (TR) |
| Finance Admin | Finance-related AuditEvent | ✓ | — | — | — | ✗ | — | ✓ | ✓ | Platform finance |

Opportunity Desk must **not** own leads or take hidden personal commission (FD-031).

**Phase 10 implementation (gce-dev):** permission codes in `lib/architecture/lead-assist/permissions.ts` —
`lead.create.own`, `lead.read.own_sent`, `lead.read.assigned`, `lead.accept_decline`, `lead.reveal_contact`,
`lead.outcome.submit`, `lead.desk.review`, `lead.desk.assign`, `lead.desk.reassign`.
Canonical role key `opportunity_desk` (FD-035) unlocks workspace `opportunity-desk`.

**Phase 11 implementation (gce-dev):** permission codes in `lib/architecture/customer-cx/permissions.ts` —
`cx.discover`, `cx.book`, `cx.booking.read_own`, `cx.ticket.read_own`, `cx.cancel_own`, `cx.refund_request`,
`cx.offer_claim`, `cx.redeem_own`, `cx.feedback`, `cx.rank.read_own`, `cx.check_in.venue`, `cx.redeem.venue`.
Customers act on own records; Venue Rep scoped check-in/redeem; no customer self-approval of refunds (OD-006 manual review).

**Phase 12 implementation (gce-dev):** permission codes in `lib/architecture/ops-governance/permissions.ts` —
`notif.read_own`, `notif.prefs_own`, `notif.manage_templates`, `notif.dead_letter`, `analytics.read`, `audit.search`,
`security.read`, `risk.review`, `alerts.manage`, `compliance.hold`, `privacy.review`, `retention.review`,
`sensitive_access.log`. Ordinary BDP/Venue/Member roles have no unrestricted security-queue access.

**Phase 13 implementation (gce-dev):** permission codes in `lib/architecture/ops-admin/permissions.ts` —
`ops.dashboard`, `ops.search`, `ops.approvals.review`, `ops.exceptions.resolve`, `ops.cases.manage`,
`ops.cases.internal_notes`, `ops.moderation`, `ops.overrides.request`, `ops.overrides.approve`,
`ops.suspend.scoped`, `ops.incident.manage`, `ops.refund.review`, `ops.connect`, `ops.marketplace`,
`ops.enterprise`, `ops.finance`, `ops.compliance`, `ops.support`, `ops.rm`, `ops.prm`.
Self-approval denied via `assertOpsNotSelfApproval`. No Super Admin product role. Finance console cannot mutate ledgers.
RM/PRM have relationship/support scope without commission entitlement.

---

## Self-approval & conflict (SoD)

| Scenario | Rule |
|----------|------|
| BDP approves own commission / exception | **Forbidden** |
| Finance Admin is beneficiary of same transaction | **Forbidden combination** (FD-023) |
| Marketplace BDP solely approves own related venue / exception | **Forbidden** (FD-035) |
| Circle Finance Coordinator approves own reimbursement | **Forbidden** (FD-030) |
| Taxonomy approver + same applicant | Conflict controls (FD-023) |
| Staff + external commercial role | Only with disclosure, approval, **no self-approval** (FD-035) |

---

## Super Admin

| Statement | Authority |
|-----------|-----------|
| Super Admin is **not** an ordinary Phase 2 product role | FD-035 §43, FD-039 |
| Not listed as a standard workspace in this matrix | — |
| Emergency technical privileges, if any, are break-glass + audited — not “Super Admin” commercial RBAC | FD-035 (TR for implementation) |
| Future formal Super Admin requires Founder Decision | FD-035 / taxonomy |

---

## Unresolved

| Item | Status |
|------|--------|
| Exact permission-code list / naming | Pending Technical Design (FD-023) |
| Exact masking / reveal rules for contacts | Phase 10 Stage 1: accepted assignment required; paid reveal OFF; Legal consent copy = OD-010 |
| Opportunity Desk enum RBAC | Implemented Phase 10 (`opportunity_desk` + desk permissions); residual TR naming polish OK |
| Venue Admin (platform console) vs Venue Rep naming in product UI | Clarify per FD-035; map under Platform Ops until Founder-distinct |
| Security Administrator row detail | FD-023 family exists; expand when Phase 2 security ops design lands |

**(TR)** cells must not be treated as Founder-final permission law.
