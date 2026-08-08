# GCE Master Implementation Roadmap

| Field | Value |
|-------|-------|
| **Document** | `docs/MASTER_IMPLEMENTATION_ROADMAP.md` |
| **Type** | Documentation-only master roadmap (no code / SQL) |
| **Authority** | Subordinate to Founder Decisions FD-001, FD-020–FD-039 |
| **Companion docs** | Phase folders `docs/phase-2/` … `docs/phase-18/`; `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md`; `docs/IMPLEMENTATION_BACKLOG.md` |
| **Date** | 2026-08-08 |

---

## How to read this roadmap

**Status values (only):** `Complete` · `Documentation Complete` · `Architecture Ready` · `Implementation Pending` · `Blocked` · `Future`

Where a phase has both documentation/architecture readiness and a later gate, the Status cell may combine allowed values (e.g. `Documentation Complete; Implementation Pending`).

**Owner type:** Founder · Legal/Compliance · Product · Engineering · Finance · Ops · Security · Privacy · Mixed

**Blocking decisions** lists only Founder / Legal / Tax / Privacy / Finance / Security / Ops gates — not routine technical design choices (those stay in ADRs).

---

## Current posture (summary)

| Track | Current state |
|-------|----------------|
| **Founder Decision phase** | **Phase 1 Complete** — FD-001 and FD-020–FD-039 approved as business law |
| **Current architecture phase** | **Phase 2** — Documentation Complete; **implementation PARTIAL (architecture spine in repo; migration not yet applied to production)** |
| **Legal / compliance** | **Parallel track** from Phase 2 onward (FD-039 Part M); blocks money go-live / contract reliance, not architecture planning |
| **Pilot city** | **Deferred** — intentionally undecided; does **not** block architecture; Founder selection required before Phase 16 deployment-planning finalisation |
| **Future / inactive products** | Remain **Future** / inactive unless a later Founder Decision activates them (FD-039 Part J) |

---

## Master phase table (Phases 1–18)

| Phase | Purpose | Dependencies | Status | Deliverables | Entry criteria | Exit criteria | Blocking decisions | Owner type | Implementation order | Parallel workstreams |
|------:|---------|--------------|--------|--------------|----------------|---------------|--------------------|------------|---------------------:|----------------------|
| **1** | Founder Decisions complete through FD-039: business model, wallet/settlement, membership, RBAC, Circles, BDPs, Enterprise, commission, MoR direction, compliance gates, Phase 2 spine | None (constitutional baseline) | **Complete** | FD-001; FD-020–FD-039; Docs Manifest / living-core sync | Founder authority to decide commercial and operating law | All Phase 1 FDs approved; living docs and Cursor rules synchronised to FD-039 | None remaining for Phase 1 itself | Founder | 1 (done) | Documentation sync; Clarification registers |
| **2** | Technical Architecture Master Plan + ADR catalogue for shared identity, payments (candidate), ledger, state machines, RLS, audit, feature flags, jobs, PWA deploy — **not Connect-only** | Phase 1 Complete; state-machine docs; role taxonomy | **Documentation Complete / Architecture Ready**; **Implementation Complete** (gce-dev applied; types from gce-dev; non-blocking legacy SoT reconciliation remains) | `PHASE_2_TECHNICAL_ARCHITECTURE_MASTER_PLAN.md`; ADRs; `docs/phase-2/implementation/PHASE_2_IMPLEMENTATION_NOTES.md`; `lib/architecture/**`; migration `20260808130000_phase2_architecture_foundation.sql` | Governing FDs treated as SoT; compliance workstream started in parallel | ADR catalogue accepted; architecture modules + RLS policies in migrations; unit tests green; staging migration apply + type regen | MoR/tax/contract validation does **not** block architecture; pilot city does **not** block architecture | Engineering (+ Legal parallel) | 2 (current architecture) | **Legal/compliance parallel track**; Product state machines; Finance concept alignment |
| **3** | Core platform foundation: repo layout, TS/ESLint, domain boundaries, validation, errors, logging/Sentry, feature flags, env/secrets, Supabase clients, Server Actions vs Route Handlers, jobs, CI/CD, VPS deploy/rollback | Phase 2 Architecture Ready | **Implementation Complete** — non-blocking technical debt remains (`docs/phase-3/PHASE_3_IMPLEMENTATION_NOTES.md`) | Phase 3 doc; foundation modules; CI; observability baseline; DoD | Phase 2 ADRs accepted for stack defaults | Shared foundation usable by Phases 4–8 without re-litigating primitives | None for architecture; production money still gated by Phase 15 validation | Engineering | 3 | Compliance register drafting; ADR maintenance |
| **4** | Identity, RBAC, organisation: User permanent identity; role assignments + scope; workspaces; legacy role migration; SoD; RLS deny-by-default | Phases 2–3 | **Complete** (gce-dev; non-blocking legacy mapping ops remain) | Auth/session; assignment model; workspace routing; RBAC/RLS matrices; legacy migration map | Phase 3 foundation; FD-023/035; ADR-001/002/003/005 | Users can hold scoped multi-role assignments; workspace switch enforces scope; Super Admin not ordinary product role | Employment classification / data-fiduciary labels remain Legal/Privacy (do not hard-code) | Engineering + Product | 4 (P0 spine) | Security review of SoD; Privacy notice drafting |
| **5** | Membership & GCE Connect: Associate membership; dual Circle statuses; activation ≠ allocation; waitlist; transfer; GB support; Tags; Aadhaar not mandatory by default | Phase 4; FD-022/027/030/032/036 | **Complete** (gce-dev; non-blocking refund/waitlist-policy items remain) | Membership/payment/activation SMs; Circle lifecycle; allocation workflows; member dashboard hooks | Identity/RBAC live enough for membership actors | Activation and allocation are separate states; unattributed membership allowed; Core direct purchase inactive | Membership refund matrix (Founder/Legal); exact GST on memberships (Tax); KYC retention (Privacy) | Product + Engineering | 5 | Connect ops playbooks; Compliance KYC posture |
| **6** | Connect BDP: Franchise Unit packs; online-default + audited offline bank payment; attribution; 20% attributed-only commission; recovery finance; RM; territory non-ownership | Phase 5 events; FD-025/029/036/039 | **Complete** (gce-dev; non-blocking Legal/Tax/OD-021/022 remain) | Connect BDP onboarding; pack payment; attribution; commission hooks; dashboards; `PHASE_6_IMPLEMENTATION_NOTES.md` | Membership attribution events available | No commission without valid attribution; target credit at 15 once; Circles remain platform assets | Final BDP agreement wording (Legal); GST/TDS on packs (Tax); post-activation Circle stability period if still Founder-open | Product + Engineering + Finance | 6 (done on gce-dev) | Legal BDP pack drafts; Finance recovery ops |
| **7** | Marketplace & Marketplace BDP: Events/Offers; Venue Partners; 80/10/10 vs 80/0/20; MoR direction Logixia; 48h cancel default; units 20/2/40 | Phase 4; payment skeleton; FD-033/037/039 | **Complete** (gce-dev; non-blocking refund/MoR validation remain) | Venue/MBDP workflows; Offer claim/redeem; entitlement boundary; `PHASE_7_IMPLEMENTATION_NOTES.md` | Identity + payment webhook skeleton | Unattributed path correct; Affiliate inactive; refund % not invented | MoR implementation validation; refund/chargeback economics; Venue Partner agreement | Product + Engineering + Finance | 7 (done on gce-dev) | MoR Legal/Tax validation; Venue agreement drafts |
| **8** | GCE Enterprise: Client orgs; Enterprise BDP; managed vendors (no mandatory login); Finance co-sign > ₹5,00,000; componentised entitlement boundary; no double commission | Phase 4; Phase 9 concepts; FD-026/038 | **Complete on gce-dev** (`20260808190000`) — non-blocking OD-027 / legal-tax validation remain | Enterprise Client/BDP; quotation path; milestones; vendor records; cross-vertical components; entitlement refs | Identity/org model; commission/settlement architecture defined | Finance co-sign enforced above threshold; vendor portal inactive; no automatic cross-vertical commission | Enterprise/Vendor agreement finalisation; Vendor Opportunity Fee % (Founder — concept only); GST/TDS on Enterprise; OD-027 cut-off | Product + Engineering + Finance | 8 (done on gce-dev) | Legal Enterprise/Vendor packs; Finance co-sign SOP; Phase 9 settlement |
| **9** | Finance, revenue, commission & settlement: GMV/Collected/Eligible/Platform; Commission Engine states; settlement ≠ payment success; ledgers; wallet cash-out inactive | Phases 5–8 revenue events; FD-020/021/028/029 | **Complete on gce-dev** (`20260808200000`) — professional tax/MoR/refund validation remain; execution flags OFF | Ledger model; commission SM; settlement batches; Finance Admin ops; reconciliation | Payment + vertical earning events | Entitlements versioned; payouts gated; cash-out inactive; rule versioning preserved | Exact GST/TDS rates; TDS sections; settlement banking timing; PA/RBI classification; OD-006/007 refund % | Finance + Engineering | 9 (done on gce-dev; money OFF) | Tax/Finance professional validation; MoR invoice model |
| **10** | AI Lead Assist Stage 1 unpaid only: classify/match/route/track; Core Lead Rights; Opportunity Desk; paid/₹500/escrow inactive | Phase 4–5; FD-031/039 | **Implementation Complete on gce-dev** (see `docs/phase-10/PHASE_10_IMPLEMENTATION_NOTES.md`) | Lead Assist SM; Desk workflows; consent-gated contact reveal; feature flags for paid stages | Identity + Circle context | Stage 1 unpaid live-capable; paid stages flagged inactive | Lead Assist retention & model-training policy (Privacy/Legal); paid commercial model remains Future | Product + Engineering | 10 | Privacy AI policy; Ops Desk staffing model |
| **11** | Events, offers, bookings & customer experience: discovery, booking, QR, 48h cancel UX, offer claim/redeem, PWA mobile-first | Phase 7 domain; Phase 9 money truth; FD-037/039 | **Implementation Complete on gce-dev** (see `docs/phase-11/PHASE_11_IMPLEMENTATION_NOTES.md`) | Customer booking UX; ticket/QR; cancel/refund UX placeholders; Venue fulfilment surfaces | Marketplace transaction SMs; MoR-aware payment path (non-prod OK) | 48h default enforced in UX; claim ≠ revenue; no invented refund % | Consumer refund disclosures; chargeback/no-show economics; convenience fee if any | Product + Engineering | 11 (done on gce-dev; money OFF) | Legal consumer disclosures; Ops fulfilment SLAs |
| **12** | Notifications, analytics, audit & security: multi-channel notify; KPI posture; immutable audit; fraud-review architecture; privacy controls | Phases 4–11 producers; ADR-010/005 | **Implementation Complete on gce-dev** (see `docs/phase-12/PHASE_12_IMPLEMENTATION_NOTES.md`) | Notification catalogue; audit pipeline; analytics domains; Sentry/logs; fraud queue interface | Domain events defined | Audit covers finance/KYC/Admin; retention placeholders marked pending Privacy | Retention periods (Privacy); fraud threshold policy (Ops/Security — commercial thresholds not invented) | Engineering + Security + Privacy | 12 (done on gce-dev; live providers OFF) | Privacy retention programme; Security monitoring |
| **13** | Admin operations & support: department-scoped ops; approval/exception/dispute queues; offline BDP pack Admin; holds; support playbooks | Phases 4–12; FD-023/035/039 | **Implementation Complete on gce-dev** (see `docs/phase-13/PHASE_13_IMPLEMENTATION_NOTES.md`) | Ops dashboards; queues; override/hold flows; escalation matrix (Operational Recommendation) | RBAC + audit + domain approval events | SoD preserved; Super Admin not ordinary role; offline payments audited | Offline-payment SOP final (Ops/Finance/Legal); support SLA contractual claims if any | Ops + Engineering | 13 (done on gce-dev; money/live providers OFF) | Compliance incident SOPs; Support training |
| **14** | Testing, migration & data validation: test strategy; legacy migration; RLS tests; financial reconciliation tests; no silent rewrite | Phases 3–13 artefacts; FD-032 migration principles | **Phase 14A COMPLETE** (backend/platform). **Frontend gap audit/planning COMPLETE** (`docs/frontend/*`) — **Website/PWA redevelopment NOT started**. **Phase 14B DEFERRED**. Phase 14 overall **not** complete | Test plans; migration maps; data validation suites; go/no-go evidence packs | Implementable verticals + finance spine | Migration controlled; historical rule versions preserved; critical RLS/finance tests green in non-prod | None Founder-commercial for test itself; production money still Phase 15 | Engineering + QA | 14A done; FE audit done; redesign + 14B pending | Security testing; Finance recon samples; product E2E/UAT |
| **15** | Legal, tax, privacy & production readiness: MoR/GST/TDS/invoice/PSP; agreements; Applicable Law Register; go-live legal checklist | FD-039 Part M; parallel from Phase 2 | **Documentation Complete**; money go-live items **Blocked** on professional validation (**architecture not blocked**) | Compliance Register; MoR validation matrix; agreement draft packs; privacy/KYC checklists; go-live gate checklist | Architecture may proceed without completion | Professional validation sign-off for production money/contracts **or** explicit Founder escalation of conflicts | MoR implementation; GST/TDS; refund economics; PA/RBI; fiduciary classification; retention; final agreements | Legal + Tax + Finance + Privacy | Parallel from 2; gate before money go-live | Continues beside Phases 3–14 implementation |
| **16** | Pilot launch (city-agnostic framework): pilot objectives, readiness, KPIs, rollback; **Founder selects pilot city** before deployment planning finalisation | Phases 3–15 readiness; FD-039 Part K | **Documentation Complete**; deployment-planning finalisation **Blocked** on Founder pilot city (**architecture not blocked**) | City-agnostic pilot plan; post-city RACI/calendar templates; success/failure criteria | Non-prod spine tested; Phase 15 gates understood | Founder city selected; city RACI/calendar final; pilot go/no-go recorded | **Pilot city selection (Founder)**; money movement still needs Phase 15 validation | Founder + Ops + Product | After architecture/impl readiness; city gate before final deploy plan | Local partner onboarding prep (city-agnostic); Support readiness |
| **17** | Controlled production launch: release waves; feature flags; money/settlement monitoring; support; incidents; go/no-go including MoR/GST/TDS | Phase 16 Go/Conditional Go; Phase 15 validation | **Documentation Complete / Future** (execution after pilot) | Launch waves; production ops runbooks; post-launch review; scale-or-hold decision | Pilot evidence; compliance gates for money | Steady-state production ops **or** proceed to Phase 18 **or** scale-back | Any unresolved Phase 15 money gates; inactive Part J products must stay off | Ops + Engineering + Finance + Legal | After Phase 16 | Compliance monitoring; Finance settlement ops |
| **18** | Scale optimisation & future products: multi-city scale on approved spine; catalogue inactive future items | Phase 17 production posture; FD-039 Part J | **Documentation Complete / Future** | Scale programme; inactive-product catalogue; future FD hooks | Controlled launch stable **or** explicit Founder scale decision | Scale plan approved for live spine; future items remain inactive without new FD | Future product activation requires **new Founder Decision**; city expansion may need further compliance | Founder + Product + Engineering | Future | Inactive: Affiliate, ZBP, Core purchase, paid Lead Assist, wallet cash-out, native apps, etc. (Dark mode MVP activated per FD-039 §26A) |

---

## Recommended sequencing notes

1. **Phase 1** is complete — do not reopen commercial law except via new Founder Decisions.
2. **Phase 2** is the current architecture phase; implementation begins from Phase 3 onward against accepted ADRs.
3. **Phase 4 (Identity/RBAC)** is the hard technical prerequisite for verticals (5–8) and Admin (13).
4. **Phase 9 payment/commission/settlement skeleton** should start early (webhook + ledger + commission states) even while vertical UX lands in 5–8 / 11.
5. **Phase 15 Legal/compliance** runs **in parallel** from Phase 2; it blocks **production money movement and contract reliance**, not schema/ADR/mock work.
6. **Phase 16 pilot city** is Founder-deferred; it blocks **deployment planning finalisation**, not architecture.
7. **Phases 17–18** are post-pilot / future execution; Part J products stay Future/inactive.

---

## Future inactive products (do not schedule as active spine work)

From FD-039 Part J (non-exhaustive pointer — see Phase 18 doc for full catalogue):

- Marketplace Affiliate commercial activation  
- ZBP commercial model  
- Core Tier direct purchase / nationwide Core launch  
- Paid Lead Assist / legacy ₹500 fee / escrow / forfeiture / success-fee mechanics  
- Wallet cash-out / consumer withdrawals  
- Advertising / premium listings as active commercial SKUs  
- Referral reward programmes with approved rates  
- Super Admin as ordinary product role  
- Vendor self-serve login portal  
- Native iOS / Android apps  
- International expansion / multi-currency go-live  
- Partner lead-ingest API programme  
- Docker / Edge as mandatory production architecture  
- Marketplace category-specific revenue-share variants  

**Activated (no longer inactive):** Dark mode MVP — FD-039 §26A (system default + manual toggle; Layer A chrome).

---

## Related registers

| Document | Role |
|----------|------|
| [`docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md`](./OPEN_DECISIONS_AND_VALIDATION_REGISTER.md) | Genuine Founder/Legal/Tax/Privacy/Finance/Security/Ops open items |
| [`docs/IMPLEMENTATION_BACKLOG.md`](./IMPLEMENTATION_BACKLOG.md) | Epic/feature backlog by phase |
| [`docs/compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md`](./compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md) | Applicable law mapping (parallel compliance) |

---

**End of Master Implementation Roadmap**
