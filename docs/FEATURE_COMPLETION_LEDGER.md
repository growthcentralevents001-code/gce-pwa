# GCE Feature Completion Ledger

| Field | Value |
|-------|-------|
| **Document** | `docs/FEATURE_COMPLETION_LEDGER.md` |
| **Type** | Living index + evidence map for completed / partial / inactive features |
| **Authority** | Subordinate to Founder Decisions, canonical business docs, backend/security truth, and phase ADRs |
| **Not a substitute for** | Founder Decisions · phase plans · state machines · UI/UX Architecture 2.0 · implementation specs |
| **Companion docs** | `docs/MASTER_IMPLEMENTATION_ROADMAP.md` · `docs/IMPLEMENTATION_BACKLOG.md` · `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md` · phase `PHASE_*_IMPLEMENTATION_NOTES.md` · frontend batch implementation docs |
| **Governance rule** | `.cursor/rules/10_Feature_Completion_Ledger.mdc` |
| **Date** | 2026-09-04 |

---

## Purpose

This ledger lets future agents **quickly determine what is already verified** without re-auditing entire subsystems when a new feature brief mentions them.

It is an **index and evidence map**, not a duplicate implementation specification.

---

## Status taxonomy

Use these ledger statuses (map from existing repo language where noted):

| Ledger status | Repo equivalents | Meaning |
|---------------|------------------|---------|
| **COMPLETE** | Complete · DONE · LIVE | Verified; reuse without full re-audit |
| **COMPLETE_WITH_P2** | Complete with non-blocking P2 · VALIDATION PASSED WITH NON-BLOCKING ITEMS | Shipped; known non-blocking gaps only |
| **PARTIAL** | PARTIAL · Implementation Pending | Canonical path exists; material gaps remain |
| **BLOCKED** | Blocked · Validation Pending (money/legal) | Cannot treat as production-ready |
| **INTENTIONALLY_INACTIVE** | Future · OFF · INACTIVE_FEATURE_FLAGS | Governed but not live |
| **SUPERSEDED** | Historical · legacy | Replaced by canonical subsystem; do not extend |
| **RETIRED** | RETIRE (UI roadmap) | Redirect/preserve only; never template |
| **EVIDENCE_INCOMPLETE** | — | Do **not** re-audit now; verify when next touched |

---

## Delta-audit rule (permanent)

Before any feature audit or implementation task:

1. **Consult this ledger first.**
2. **Do not comprehensively re-audit** a subsystem marked **COMPLETE** or **COMPLETE_WITH_P2** merely because a new brief mentions it.
3. **Re-open** a completed entry only on a **material trigger**:
   - genuinely new requirement not covered by indexed evidence
   - dependency / schema / RLS change affecting the subsystem
   - newer Founder Decision or canonical business conflict
   - failing relevant test for that subsystem
   - missing or weak completion evidence discovered during the new task
   - security / privacy / RLS regression
   - direct semantic conflict with governed behavior
4. Otherwise **reuse** prior evidence and implement **delta only**.

---

## Requirement classification (future agents)

Agents may classify normalized requirements from a **Feature Delta Brief** as:

| Class | Action |
|-------|--------|
| **CORE / BLOCKING** | Must implement or fix using canonical subsystem |
| **SUPPORTING / NON-BLOCKING** | Implement if cheap; else record P2 |
| **ALREADY SATISFIED / DUPLICATE** | Point to ledger entry; no rebuild |
| **SUPERSEDED** | Follow newer authority; update lower doc if needed |
| **INTENTIONALLY_INACTIVE** | FeatureGated / flags; do not expose live |
| **MARKETING / CLAIM-ONLY** | Safe copy classification only; no new engine |
| **NON-SOFTWARE BUSINESS OUTCOME** | Do not build CRM/score engines (e.g. “relationship building”, “meaningful interaction”) unless a governed operational requirement exists |

Agents **may not** dismiss Founder Decisions, security, economic rules, legal gates, or core user journeys by labelling them “non-important”. Report conflicts instead of inventing decisions.

---

## Future input model

Feature work normally arrives as a **clean English Feature Delta Brief** (normalized from source materials).

Operating stack (higher authority wins):

1. Founder Decisions / explicit supersession  
2. Canonical business / state-machine / security docs  
3. Approved phase architecture + ADRs  
4. **This ledger**  
5. UI/UX Architecture 2.0 + design system  
6. Cursor rules  
7. Delta Brief (input only — not business law)

Source campaign materials are **inputs**, not operating instructions. Use English-normalized requirements only in architecture, governance, and completion records.

---

## Completion update protocol

Every completed feature task must append or update one ledger row with:

- final status  
- canonical subsystem reused / extended  
- key routes · tables · services  
- security / RLS evidence pointer (if relevant)  
- tests that establish completion  
- completion commit (or **uncommitted** + branch if not yet committed)  
- remaining P2s  
- intentionally inactive / superseded items  
- re-audit trigger (when to reopen)

Keep rows concise.

---

## Normalized Connect scope (English — completion reference)

These English requirements govern Connect completion records. Do not treat raw campaign dialogue as architecture.

### Connect member experience

The canonical product supports an approved GCE Connect member through:

- governed business verification and membership approval
- Circle assignment and seat locking
- hard maximum Circle capacity of 40 members
- category and specialisation
- governed member tags
- business identity / profile
- exactly 4 GC Power Sectors
- app-based canonical Lead Assist / referral workflow (routing, assignment, accept/decline, protected contact disclosure, follow-up, tracking, dual confirmation where applicable)
- eligible cross-Circle / wider-network opportunities
- regular structured Circle meetings with Member / CBDP / Ops visibility
- authorization / RLS, notifications, and audit history

No duplicate Member, Circle, Lead Assist, Meeting, Category, Specialisation, Dashboard, Notification, Audit, or Authorization systems.

### Connect meetings

Circle meetings follow an approximately **15-day governed cadence** (advisory scheduling; no hard auto-recurrence engine).

The meeting experience reuses canonical systems to support or surface:

- member business identity
- current business requirements and relevant opportunities (via existing member / Lead Assist context — not a meeting-specific requirement engine)
- category and specialisation context
- Circle / member context
- schedule, date, time, location or meeting mode
- attendance / RSVP where governed
- meeting history
- creation of canonical Lead Assist records from meeting context
- normal referral routing, assignment, contact protection, follow-up, tracking, and confirmation

### Marketing / non-software outcomes (not built)

Do not build scores, tables, engines, or workflows for:

- meaningful business interaction
- relationship building
- focused or organised meetings (as product mechanics)
- long-term business development / growth

Claims must reflect actual implementation and must not imply guaranteed leads, business, referrals, relationships, revenue, or growth.

---

## Ledger index

### A. Platform spine (Phases 2–4)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Commit / env | P2 / inactive | Re-audit when |
|---------------------|--------|---------------------|----------|-------|--------------|---------------|---------------|
| Architecture foundation (flags, audit, jobs, ledger hooks) | **COMPLETE** | `lib/architecture/*` Phase 2 modules | `docs/phase-2/implementation/PHASE_2_IMPLEMENTATION_NOTES.md`; migration `20260808130000` | `tests/unit/phase2-completion.test.ts` | gce-dev applied | Legacy schema baseline dump (ADR-004) | Schema/RLS change to foundation tables |
| Identity, RBAC, workspaces, SoD | **COMPLETE** | `lib/architecture/identity/*`; `role_assignments` | `docs/phase-4/PHASE_4_IMPLEMENTATION_NOTES.md`; `20260808150000` | `tests/unit/phase4-identity-rbac.test.ts`; E2E auth matrix | gce-dev | Bulk legacy→assignment migration ops | Assignment model or RLS change |
| Feature flags / inactive commercial SKUs | **COMPLETE** | `lib/architecture/feature-flags` | FD-039 Part J; `INACTIVE_FEATURE_FLAGS` | Phase 10/11 flag-off tests | gce-dev | — | New paid SKU activation without FD |

### B. GCE Connect — membership & Circle (Phase 5 + Batch 3)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Commit / env | P2 / inactive | Re-audit when |
|---------------------|--------|---------------------|----------|-------|--------------|---------------|---------------|
| Associate membership lifecycle (payment ≠ activation ≠ allocation) | **COMPLETE** | `lib/architecture/connect/memberships.ts`; `connect_memberships` | FD-022/027/036; Phase 5 notes; `IMPLEMENTATION_BACKLOG` DONE rows | `tests/unit/phase5-membership-connect.test.ts`; `tests/e2e/connect/membership-application.spec.ts` | gce-dev | OD-007 refund matrix | Membership SM or allocation rules change |
| 40-member Circle capacity | **COMPLETE** | `lib/architecture/connect/allocation.ts`; `CIRCLE_CAPACITY_MAX=40` | FD-030; Phase 5 | `tests/e2e/connect/circle-capacity.spec.ts`; unit batch3 | gce-dev | — | Capacity rule change |
| 4 GC Power Sectors | **COMPLETE** | `GC_POWER_SECTORS` in `lib/frontend/design-language.ts` | FD-030; `docs/core/38_Circle_Architecture.md` | `tests/unit/batch3-connect-frontend.test.ts` | gce-dev | — | Sector taxonomy change |
| Connect member workspace (home, membership, circle, waitlist, tags) | **COMPLETE_WITH_P2** | `/dashboard/connect-member`, `/connect/*` | `docs/frontend/implementation/BATCH_3_*`; UI roadmap IMPROVE/KEEP | `tests/unit/batch3-connect-frontend.test.ts`; membership E2E | Batch 3 era commits | BG-13 transfer API; BG-14 tag self-serve | New member journey requirement |
| Public Connect marketing (`/connect`, `/memberships`, `/the-circle`) | **COMPLETE_WITH_P2** | PublicShell routes | Batch 1 + public E2E | `tests/e2e/memberships-public.spec.ts`; `tests/e2e/the-circle-public.spec.ts` | gce-dev | Marketing claim safety reviews | New public claims |

### C. GCE Connect — Lead Assist / referrals (Phase 10)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Commit / env | P2 / inactive | Re-audit when |
|---------------------|--------|---------------------|----------|-------|--------------|---------------|---------------|
| Stage 1 unpaid Lead Assist (create, route, desk, timeline) | **COMPLETE** | `assist_leads`; `lib/architecture/lead-assist/*`; `/connect/leads/*` | FD-031; Phase 10 notes; `20260808210000` | `tests/e2e/connect/lead-assist*.spec.ts`; `tests/e2e/connect/lead-routing.spec.ts`; `tests/unit/phase10-lead-assist.test.ts` | gce-dev | Paid Lead Assist / escrow / ₹500 **INTENTIONALLY_INACTIVE** | Routing SM, RLS, or paid-flag activation |
| Circle-first → cross-circle → wider routing | **COMPLETE** | `lib/architecture/lead-assist/operations.ts` | FD-031 | `tests/e2e/connect/lead-routing.spec.ts` | gce-dev | — | Routing policy change |
| Contact protection + dual confirmation | **COMPLETE** | Lead Assist lifecycle | Phase 10; 14B-P1 closeout | `tests/e2e/connect/lead-assist-lifecycle.spec.ts` | gce-dev | — | Privacy/reveal rule change |
| Legacy `referrals` table / `/dashboard/member` | **RETIRED** | — | UI roadmap RETIRE | — | — | Do not extend | — |

### D. GCE Connect — Circle meetings (FD-030)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Commit / env | P2 / inactive | Re-audit when |
|---------------------|--------|---------------------|----------|-------|--------------|---------------|---------------|
| Structured Circle meetings (~15-day cadence) | **COMPLETE_WITH_P2** | `connect_circle_meetings`; `connect_circle_meeting_attendance`; `lib/architecture/connect/meetings.ts` | Connect meetings closeout 2026-09-04; migration `20260904180000` (gce-dev); UI/IA updates in `docs/ui-ux/` | `tests/unit/connect-circle-meetings.test.ts`; `tests/e2e/connect/circle-meetings.spec.ts` | `3ddeb74` on `development`; gce-dev applied | No auto-recurring cron; Ops attendance roster uses truncated user ids; meeting notify may no-op if flags suppress | Meeting SM, attendance RLS, or referral-source rules change |
| Meeting → Lead Assist context (`meeting_id`, `meeting_followup`) | **COMPLETE** | `assist_leads.meeting_id`; Lead Assist create | Same closeout; no second referral engine | E2E meeting→lead in `circle-meetings.spec.ts` | Same as above | — | Lead Assist schema/source enum change |
| 15-day cadence (advisory) | **COMPLETE** (advisory) | `CIRCLE_MEETING_CADENCE_DAYS=15`; Ops advisory on schedule | FD-030; advisory scheduling only | Unit cadence tests | Same as above | Auto-scheduler not implemented (intentional) | Founder mandates hard recurrence |

### E. GCE Connect — Member experience (normalized scope)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Commit / env | P2 / inactive | Re-audit when |
|---------------------|--------|---------------------|----------|-------|--------------|---------------|---------------|
| Governed Connect member journey (verification → allocation → workspace) | **COMPLETE_WITH_P2** | Composes B + C + D above (no parallel member product) | Connect member experience closeout 2026-09-04 | Membership apply E2E; circle capacity; lead lifecycle; meetings E2E | Same as D | Relationship scores / guaranteed outcomes **not built**; unified business-identity card partial (`businessName` on MembershipCard + directory) | New governed requirement contradicting FDs; member journey regression |
| Business identity in Circle | **COMPLETE_WITH_P2** | `connect_memberships.metadata.application`; MembershipCard; directory | Application schema; reads use `businessName` | Membership application E2E | Same as D | Full dedicated business-identity surface not a separate product | — |
| Tag catalog enforcement on write | **COMPLETE** | `lib/architecture/connect/tags.ts` + `tagCatalog.ts` | Tag validation closeout 2026-09-04 | Via membership/tag flows | Same as D | — | Tag catalog change |

### F. Connect BDP (Phase 6 + Batch 4)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Commit / env | P2 / inactive | Re-audit when |
|---------------------|--------|---------------------|----------|-------|--------------|---------------|---------------|
| Connect BDP unit, circles portfolio, attribution boundary | **COMPLETE_WITH_P2** | `/connect-bdp/*`; `lib/architecture/connect-bdp/*` | Phase 6 notes; Batch 4 doc | `tests/unit/phase6-connect-bdp.test.ts`; `tests/e2e/connect/bdp-workspace.spec.ts` | gce-dev | Commission/settlement execution **INACTIVE** | FD-025/029 change |
| CBDP Circle meeting read-only visibility | **COMPLETE_WITH_P2** | `/connect-bdp/circles` upcoming meeting label | Connect meetings closeout 2026-09-04 | BDP workspace E2E (structure panel skip when no fixture Circles) | Same as D | — | CBDP meeting permissions change |

### G. Marketplace, Enterprise, Finance, Ops (indexed — not re-audited here)

| Feature / subsystem | Status | Canonical subsystem | Evidence | Tests | Re-audit when |
|---------------------|--------|---------------------|----------|-------|---------------|
| Marketplace + MBDP + Venue (Phase 7, Batch 5) | **COMPLETE_WITH_P2** | `lib/architecture/marketplace/*`; `/marketplace-bdp/*`; `/venue/*` | Phase 7 notes; Batch 5 doc; 14B report | Phase 7 unit; customer/venue E2E in 14B | MoR/refund economics validation (OD-001/006) |
| **Venue Partner business insights** (customer reach / repeat / visibility) | **COMPLETE_WITH_P2** | `lib/architecture/marketplace/insights.ts`; `/venue/performance`; `GET /api/venue/insights` | Venue insights delta 2026-09-04 (`bc7c691`); `assertVenueInsightsAccess`; qualifying-activity definition | `tests/unit/venue-business-insights.test.ts`; `tests/unit/venue-insights-access.test.ts`; `tests/e2e/venue/venue-insights-auth.spec.ts` | Qualifying-activity or customer-identity schema change; customer feedback UI **P2**; rank **INACTIVE** |
| **Marketplace revenue allocation** (80/10/10 vs 80/0/20) | **COMPLETE_WITH_P2** | `lib/architecture/marketplace/allocation.ts`; `calculateMarketplaceSplit`; `marketplace_revenue_entitlements`; `GET /api/venue/allocations` | Booking confirm → `allocateMarketplaceBookingRevenue`; cancel → `reverseMarketplaceBookingAllocation`; claim ≠ revenue | `tests/unit/marketplace-allocation.test.ts`; `tests/unit/phase7-marketplace.test.ts`; `tests/e2e/venue/venue-allocations-auth.spec.ts` | `COMMIT` on `development` | Refund % economics **BLOCKED** (OD-001/006); Phase 9 `stakeholder_entitlements` bridge on booking **P2**; settlement/payout **INACTIVE** |
| Enterprise Client/BDP/Expert (Phase 8, Batch 6) | **COMPLETE_WITH_P2** | `lib/architecture/enterprise/*`; enterprise routes | Phase 8 notes; Batch 6 doc | Enterprise E2E in 14B | FD-038 / co-sign threshold change |
| Finance / commission / settlement spine (Phase 9, Batch 7) | **COMPLETE** (execution **INACTIVE**) | `lib/architecture/finance/*` | Phase 9 notes; settlement flags OFF | Finance unit + 14B probes | Money go-live / Phase 15 gates |
| Notifications / audit / security (Phase 12) | **COMPLETE_WITH_P2** | Phase 12 modules | Phase 12 notes | Security/audit tests | Live provider activation |
| Platform Ops / Desk / Support (Phase 13, Batch 8) | **COMPLETE_WITH_P2** | `/ops/*`; `/desk/*` | Phase 13 notes; Batch 8 doc | Ops E2E in 14B | Ops RBAC change |
| Full-stack E2E / UAT baseline | **COMPLETE_WITH_P2** | Playwright fixtures gce-dev | `docs/phase-14/PHASE_14B_FULL_PRODUCT_E2E_UAT_VALIDATION_REPORT.md` | 14B / 14B-P1 / 14B-R suites | Major journey regression |

### H. UI/UX Architecture 2.0 program

| Feature / subsystem | Status | Canonical subsystem | Evidence | Re-audit when |
|---------------------|--------|---------------------|----------|---------------|
| Frontend redevelopment batches 0–10 | **COMPLETE_WITH_P2** | `docs/ui-ux/*`; shells/components | `docs/frontend/FINAL_GCE_REDEVELOPMENT_BATCH_PLAN.md`; batch implementation docs | IA/shell/route architecture change |
| UI quality gate (partner homes + landings) | **COMPLETE_WITH_P2** | Architecture 2.0 densification | Prior session audit; commit `6208e5e` on `development` | Material UI architecture change |

### I. Evidence incomplete (do not bulk re-audit)

| Area | Status | Notes | Re-audit when |
|------|--------|-------|---------------|
| Legacy `/admin/*`, `/dashboard/zbp`, `/dashboard/affiliate` trees | **EVIDENCE_INCOMPLETE** | UI roadmap RETIRE; not re-verified feature-by-feature | Touching legacy route or redirect |
| Historical pre-Phase-2 legacy tables in gce-dev | **EVIDENCE_INCOMPLETE** | Inventory in `SCHEMA_SOT_RECONCILIATION.md` | Migration touching legacy table |
| Production (`tzeqeywezmqslovpflqu`) parity | **EVIDENCE_INCOMPLETE** | Dev-only verification culture; prod untouched by design | Explicit production deployment task |

---

## Intentionally inactive (global pointer)

Do not expose live without new Founder Decision + ledger update:

Paid Lead Assist · escrow · success fees · wallet cash-out · ticket payments go-live · settlement execution · Affiliate · ZBP · Core direct purchase · rank ladders · Super Admin as ordinary role · vendor self-serve portal · referral reward programmes.

Source: FD-039 Part J · `INACTIVE_FEATURE_FLAGS` · `docs/MASTER_IMPLEMENTATION_ROADMAP.md`.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-09-04 | Ledger created. Indexed Phase 2–14 completion evidence without full re-audit. Recorded Connect member experience and structured Circle meetings as **COMPLETE_WITH_P2** using English-normalized requirements. |
| 2026-09-04 | English-only closeout: removed source-material titles from completion rows; added normalized Connect scope section. |
| 2026-09-04 | Venue Partner business insights layer recorded as **COMPLETE_WITH_P2** (customer reach, repeat classification, visibility vs engagement). |
| 2026-09-04 | Marketplace revenue allocation layer recorded — canonical booking allocation, attribution snapshot, finance split unification. |
