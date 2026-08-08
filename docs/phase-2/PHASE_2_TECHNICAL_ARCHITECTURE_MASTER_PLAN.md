# Phase 2 Technical Architecture — Master Plan

| Field | Value |
|-------|-------|
| **Document** | `docs/phase-2/PHASE_2_TECHNICAL_ARCHITECTURE_MASTER_PLAN.md` |
| **Authority class** | Authoritative **Phase 2 technical blueprint** (implementation planning) |
| **Business authority** | Founder Decisions FD-001, FD-020–FD-039 (highest business law) |
| **Technical authority** | Accepted ADRs under `docs/phase-2/adrs/` (Technical recommendations — **not** Founder law) |
| **Status** | **PHASE 2 IMPLEMENTATION COMPLETE** — gce-dev applied; types regenerated; non-blocking legacy SoT reconciliation remains |
| **Date** | 2026-08-08 |
| **Scope** | Technical blueprint + in-repo foundation code/migrations/tests; schema SoT is `supabase/migrations/` for Phase 2 tables; legacy reconstruction path documented in `implementation/SCHEMA_SOT_RECONCILIATION.md`. |

---

## How to read this document

| Label | Meaning |
|-------|---------|
| **Founder law** | Binding business rule from a Founder Decision |
| **Technical (ADR)** | Locked engineering default; may be superseded by a later ADR without rewriting commercial FDs |
| **Validation-gated** | Founder direction exists; production enablement requires Legal / Tax / Finance / Privacy validation |
| **Inactive** | Must not ship as live commercial capability unless a later Founder Decision activates it (FD-039) |
| **Unresolved** | Not finalised — do not invent rates, clauses, enums, or pilot city |

Do **not** invent GST/TDS rates, refund percentages, commission rates beyond what FDs already lock, MoR implementation detail, or entitlements from legacy dashboard enums.

---

## Verified stack

| Layer | Choice | Classification |
|-------|--------|----------------|
| App framework | Next.js **16.2.4** App Router | Technical (ADR) |
| UI runtime | React **19** | Technical (ADR) |
| Auth + DB | Supabase Auth + Postgres via `@supabase/ssr` + `supabase-js` | Technical (ADR-001, ADR-004) |
| Styling / motion / state | Tailwind, `motion`, Zustand | Technical (ADR) |
| PWA | `next-pwa` | Technical (ADR-012); native iOS/Android **inactive** (FD-039) |
| Errors | Sentry (`@sentry/nextjs`, devDependency) | Technical (ADR-010) |
| Payments | Razorpay **candidate** | Technical (ADR-006); **not** Founder law (FD-039) |
| Hosting / CI | Hostinger VPS / PM2 / Nginx; GitHub Actions | Technical (ADR-012) |
| Schema SoT | `supabase/migrations/` | Technical (ADR-004) |

Legacy auth helper `@supabase/auth-helpers-nextjs` may remain transitional only; new auth code prefers `@supabase/ssr` (ADR-001).

---

## Entry criteria

Phase 2 technical architecture work may proceed when:

1. Governing FDs FD-001 and FD-020–FD-039 are treated as business SoT.
2. ADR catalogue ADR-001–ADR-014 is Accepted (or explicitly superseded).
3. Business state machines exist under `docs/state-machines/` for domains in scope.
4. Compliance workstream runs **in parallel** — compliance gates ≠ architecture blockers (FD-039).
5. Pilot city remains undecided **without** blocking architecture (FD-039); city selection is required before pilot *deployment* planning only.

---

## Dependencies

| Dependency | Owner | Notes |
|------------|-------|-------|
| Founder Decisions FD-001, FD-020–FD-039 | Founder / docs | Commercial and operating law |
| `docs/core/35_Role_Taxonomy.md` | Product/docs | Legacy → canonical role mapping |
| `docs/state-machines/` | Product/engineering docs | Business lifecycles (not SQL enums) |
| `docs/phase-2/adrs/` | Engineering | Technical defaults |
| `supabase/migrations/` | Engineering | Physical schema SoT |
| Applicable Law & Compliance Register | Compliance (FD-039) | Parallel; validation-gated production |
| Professional validation (MoR, GST/TDS, contracts) | Legal/Tax/Finance | Blocks **production money movement**, not architecture planning |

---

## Not in scope (Phase 2 architecture)

| Item | Status |
|------|--------|
| Exact SQL table/column/enum definitions | Pending Technical Design; migrations SoT |
| Exact RLS policy SQL | Pending Technical Design (ADR-005 principles only) |
| Exact GST/TDS rates, invoice templates, refund % / timelines | Unresolved / validation-gated (FD-039) |
| Exact Razorpay account / aggregator classification | Unresolved (FD-039) |
| Pilot city selection and city RACI | Undecided; blocks deployment planning only (FD-039) |
| Native mobile apps, international multi-currency go-live | **Inactive** (FD-039) |
| Docker / Edge as mandatory production architecture | **Inactive** / optional (FD-039, ADR-012) |
| Dark mode MVP | **Inactive** (FD-039) |
| Vendor self-serve login portal | **Inactive** (FD-039) |
| Inventing entitlements from legacy `/dashboard/*` role enums | Forbidden (FD-035, ADR-011) |

---

## A. Technical authority hierarchy

| Priority | Source | Owns |
|----------|--------|------|
| 1 | `docs/founder-decisions/` (esp. FD-001, FD-020–FD-039) | Business model, commercial rules, inactivity, MoR *direction*, cancellation default, BDP packaging |
| 2 | Founder-approved business specs (if present) | Product contracts |
| 3 | `docs/core/` living docs | Narrative SoT subordinate to FDs |
| 4 | `.cursor/rules/` | Agent/engineering constraints |
| 5 | `docs/engineering/` | How to build |
| 6 | `design-system/MASTER.md` | Visual tokens |
| 7 | `docs/phase-2/adrs/` | **Technical (ADR)** defaults |
| 8 | Official Next.js docs for installed version | Framework behaviour |

**Rule:** Never change a Founder Decision to match an ADR. Never treat an ADR as Founder law (FD-039 Part L).

---

## B. System context

GCE is **one platform** with three primary verticals (FD-001):

| Vertical | Full name | Phase 2 spine (FD-039) |
|----------|-----------|-------------------------|
| Connect | GCE Connect | Associate Membership, Circles, Connect BDP, Stage 1 unpaid Lead Assist foundations |
| Marketplace | GCE Marketplace | Events, Venue Partners, Marketplace BDP, BDP packs |
| Enterprise | GCE Enterprise | Enterprise architecture, Enterprise BDP |

**Phase 2 is not Connect-only** (FD-039). Shared identity, RBAC, finance, attribution, and cross-vertical data design must be planned from the start.

```text
[Clients: Browser PWA]
        │
        ▼
[Next.js App Router — Server Actions / Route Handlers / RSC]
        │
        ├─ Supabase Auth (JWT/cookies via @supabase/ssr)
        ├─ Postgres + RLS (Supabase)
        ├─ Background workers (VPS/PM2 and/or Supabase schedulers) — ADR-014
        └─ PSP webhooks (Razorpay candidate) — ADR-006
```

---

## C. Legal entity / brand / vertical representation

| Concept | Rule | Source |
|---------|------|--------|
| Legal company | **Logixia Solutions Private Limited** intended owner/operator | FD-034 |
| Platform / master brand | **Growth Central Events (GCE)**; domain `growthcentralevents.com` | FD-001, FD-034 |
| Verticals | Connect / Marketplace / Enterprise — brand children under GCE | FD-001, FD-034 |
| Contracting / invoice / payment-receiving entity | Logixia (subject to validation) | FD-034 |
| Marketplace ticket MoR | Logixia **intended** MoR; implementation **validation-gated** | FD-039, FD-034 |
| BDP legal packaging | Commercial Licence / Independent Business Partner; “Franchise Unit” ≠ automatic legal franchise | FD-039 |
| AI legal drafts | Allowed as first drafts; **not** automatically final | FD-039 |
| Applicable Law Register | Required compliance artefact | FD-039 |

UX branding ≠ legal entity. Auth screens may say GCE; contracts/invoices follow Logixia rules when validated.

---

## D. Base User identity

| Rule | Classification | Source |
|------|----------------|--------|
| One permanent base identity per person | Founder law | FD-035 |
| User ≠ permission level | Founder law | FD-035, FD-023 |
| Auth subject maps 1:1 to User | Technical (ADR-001) | ADR-001 |
| Roles/workspaces are not login identities | Founder law + Technical | FD-035, ADR-001–003 |
| Prefer merge over duplicate accounts on migration | Technical (ADR-011) | FD-035, ADR-011 |

---

## E. Organisation model

Logical organisations (not necessarily one physical table):

| Organisation type | Purpose | Governing FDs |
|-------------------|---------|---------------|
| Platform (Logixia/GCE ops) | Platform Admin / Finance / Compliance / Support | FD-034, FD-035 |
| Circle | Connect community unit; dual status families | FD-024, FD-030, FD-032 |
| Venue Partner | Marketplace venue commercial party | FD-033, FD-037 |
| Enterprise Client | Enterprise contracting party | FD-026, FD-038 |
| BDP commercial pack / unit | Commercial package; not automatic employment/agency/franchise | FD-025, FD-033, FD-039 |

Exact organisation schema → migrations (ADR-004). Docs under `docs/data/` describe logical models when populated.

---

## F. Role-assignment model

| Principle | Detail | Source |
|-----------|--------|--------|
| Assignment-based RBAC | Permissions from **role assignments**, not a single `users.role` | FD-023, FD-035, ADR-002 |
| Multi-role allowed | Separate assignments with scope + status + validity | FD-035 |
| Canonical families | Connect, Marketplace, Enterprise, Lead ops, Platform ops | FD-035; taxonomy `35_Role_Taxonomy` |
| SoD | No self-approval; beneficiary ≠ approver; BDP/member and BDP/venue rules | FD-035 Part C |
| Super Admin | **Not** an ordinary product role — **inactive** as product workspace | FD-035, FD-039 |
| Legacy labels | ZBP, BDM, affiliate, franchisee, BOG map via taxonomy; **no automatic entitlement** | FD-035 Part G, ADR-011 |

Approved BDP short names: **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**.

---

## G. Scope model

Assignments and data access are **scoped**. Typical scope kinds (conceptual):

| Scope kind | Examples | Notes |
|------------|----------|-------|
| Platform | Global ops | Narrow admin families only |
| Circle | One Circle / seat context | Dual Circle statuses must not collapse (FD-032) |
| Venue | One Venue Partner | Marketplace attribution & offers |
| Enterprise Client / Project | Client, opportunity, project, milestone | FD-038 componentisation |
| Geographic / city | Routing, pilot, RM | Pilot city undecided — architecture still designs geo hooks (FD-036, FD-039) |
| Attribution | Connect BDP ↔ membership; Marketplace BDP ↔ venue | FD-036, FD-037 |

Route presence ≠ authorisation (ADR-003).

---

## H. Workspace model

| Rule | Classification | Source |
|------|----------------|--------|
| Workspace = operational UI context under approved assignment/scope | Founder law | FD-035 |
| Workspace ≠ account, legal entity, or entitlement | Founder law | FD-035 |
| Prefer `/dashboard/{workspaceKey}/...` | **Technical (ADR-003)** | FD-039 lists as technical default |
| Multi-workspace → explicit selector; no silent priority | Founder law | FD-035 |
| No unrestricted mega-dashboard MVP | Founder law | FD-035 |

**Legacy routes (exist today — migrate toward ADR-003):**

`/dashboard/member` · `/dashboard/venue` · `/dashboard/enterprise` · `/dashboard/affiliate` · `/dashboard/bdm` · `/dashboard/zbp` · `/dashboard/franchisee` · `/dashboard/user`

Migration must **not** invent commercial entitlements from these path/enums (ADR-011, FD-039 inactive items).

Illustrative `workspaceKey` catalogue (implementation-owned; align to FD-035): `personal`, `connect-member`, `connect-bdp`, `marketplace-bdp`, `venue`, `enterprise-bdp`, `enterprise-client`, `platform`.

---

## I. Auth architecture

| Decision | Classification | ADR / FD |
|----------|----------------|----------|
| Prefer Supabase Auth | Technical (ADR) | ADR-001; FD-039 |
| Cookie/JWT via `@supabase/ssr` | Technical (ADR) | ADR-001 |
| Email/OTP (and product-allowed methods) | Technical (ADR) | ADR-001 |
| Step-up for sensitive workspace actions | Founder direction + product UX | FD-035 |
| Service role server-only | Technical (ADR) | ADR-005 |
| Enterprise SSO/SAML | Out of Phase 2 mandatory scope | ADR-001 |

---

## J. RBAC and RLS architecture

| Layer | Responsibility | Source |
|-------|----------------|--------|
| Domain services / Server Actions | Business RBAC, SoD, state transitions | FD-023, FD-035, ADR-002, ADR-008, ADR-009 |
| Postgres RLS | Deny-by-default tenant/assignment isolation for client-key access | ADR-005 |
| Service role | Trusted server/jobs only; bypasses RLS | ADR-005 |
| Audit | Assignment grant/revoke/suspend; break-glass | ADR-010, FD-035 |

RLS does **not** replace workflow rules (e.g. self-approval bans). Exact policy SQL is not invented here.

---

## K. Membership domain

| Topic | Rule | Source |
|-------|------|--------|
| Lifecycle | Explicit states; illegal jumps forbidden | FD-022; `SM_Membership.md` |
| Activation ≠ Circle allocation | Hard separation | FD-022, FD-036 |
| Approval / attribution / RM / waitlist / transfer / geo routing | As FD-036 | FD-036 |
| Commercial pack / Associate Membership spine | Phase 2 included | FD-027, FD-039 |
| Core Tier direct purchase / nationwide Core | **Inactive** | FD-039 |
| State machine | Documented business machine | `docs/state-machines/SM_Membership.md` |

---

## L. Circle domain

| Topic | Rule | Source |
|-------|------|--------|
| Lifecycle thresholds | **15 / 20 / 40**; max **40** seats | FD-024, FD-030, FD-032 |
| Dual status | Lifecycle **and** constitutional — do not collapse | FD-024, FD-030, FD-032 |
| Governing Body / Finance Coordinator / RM / PRM | Scoped appointments | FD-030, FD-035 |
| BOG / Circle Board legacy | Map carefully; no unlimited powers from titles | FD-035 |
| Machines | Circle + seat | `SM_Circle.md`, `SM_Circle_Seat.md` |

---

## M. Connect BDP domain

| Topic | Rule | Source |
|-------|------|--------|
| Commercial / operating architecture | FD-025 | FD-025 |
| Attribution required for commission | Valid attribution only | FD-025, FD-029, FD-036 |
| Pack payments | Online default; rare offline Admin bank; cash not normal | FD-039 |
| Legal packaging | Commercial Licence / Independent Business Partner | FD-039 |
| Machine | Attribution lifecycle | `SM_Connect_BDP_Attribution.md` |

ZBP commercial model remains **inactive** (FD-039); legacy ZBP history preserved without auto-entitlement (ADR-011).

---

## N. Marketplace domain

| Topic | Rule | Source |
|-------|------|--------|
| Events, Venue Partners, Marketplace BDP, packs | Phase 2 spine | FD-033, FD-037, FD-039 |
| Attributed vs unattributed revenue families | **80/10/10** attributed vs **80/0/20** unattributed (Founder-locked splits — do not invent new rates) | FD-033, FD-037 |
| Offer claim ≠ revenue; claim validity where applicable | e.g. **72h** claim validity | FD-037 |
| Ticket MoR | Logixia intended; **validation-gated** for production | FD-039 |
| Cancellation default | **48h** before start; event-specific variation allowed if approved/disclosed/lawful | FD-039 |
| Refund economics | Separate from cancel cutoff; %/timelines unresolved | FD-039 |
| Marketplace Affiliate commercial activation | **Inactive** | FD-032, FD-039 |
| Category-specific revenue-share variants | **Inactive** | FD-039 |
| Machines | Event, offer event, claim, redemption, venue, MBDP attribution | `docs/state-machines/SM_Marketplace_*.md`, `SM_Venue_Partner.md`, `SM_Offer_Claim.md`, `SM_Redemption.md` |

---

## O. Enterprise domain

| Topic | Rule | Source |
|-------|------|--------|
| Client / opportunity / quote / project / milestones | Componentised settlement; project-specific milestones (not fixed 30/40/30) | FD-026, FD-038 |
| Finance co-sign threshold | Quotation Finance co-sign at **₹5,00,000** | FD-038 |
| Vendors / executors | No automatic vendor self-serve portal | FD-038; portal **inactive** (FD-039) |
| No double commission | Same rupee/component cannot pay twice | FD-029, FD-038 |
| Cross-vertical boundaries | Respect FD-037/038 | FD-037, FD-038 |
| Machines | Opportunity, quote, project, milestone | `SM_Enterprise_*.md` |

---

## P. Finance / ledger domain

| Topic | Rule | Source |
|-------|------|--------|
| Wallet UX vs ledgers | Unified wallet experience; **separate internal ledgers** | FD-020, ADR-007 |
| Append-only | Corrections via reversals, not silent rewrite | FD-020, ADR-007 |
| Traceability | Source transaction / purpose / settlement context | FD-020 |
| Cash-out / consumer withdrawals | **Inactive** | FD-039 |
| Tax lines | Structure may reserve hooks; **no invented rates** | FD-039, ADR-007 |
| Payments | Online PSP + rare offline Admin bank evidence/reconcile | FD-039, ADR-006 |
| Machines | Payment, refund | `SM_Payment.md`, `SM_Refund.md` |

---

## Q. Commission / entitlement domain

| Topic | Rule | Source |
|-------|------|--------|
| Commission engine | Stakeholder entitlement architecture | FD-029 |
| Attribution gates | Connect/Marketplace attribution validity | FD-036, FD-037 |
| No double commission | Cross-vertical enforcement | FD-029, FD-037, FD-038 |
| Inactive programmes | Referral rewards with approved rates; Affiliate commercial; ZBP commercial | FD-039 |
| Machine | Commission entitlement | `SM_Commission.md` |

Do not invent commission percentages beyond Founder-locked Marketplace families above.

---

## R. Settlement domain

| Topic | Rule | Source |
|-------|------|--------|
| Settlement engine principles | Triggers, holds, eligibility, auditability | FD-021 |
| No universal one-rule settlement across verticals | Forbidden | FD-021, ADR-007 |
| Async sweeps | Idempotent workers | ADR-014 |
| Machine | Settlement | `SM_Settlement.md` |
| Bank timing / payout files | Unresolved / ops+validation | FD-039 |

---

## S. Lead Assist domain

| Topic | Rule | Source |
|-------|------|--------|
| Architecture | FD-031; living summary `docs/core/39_AI_Lead_Assist_Spec.md` | FD-031 |
| Phase 2 | Approved **unpaid Stage 1 foundations** only | FD-039 |
| Paid Lead Assist / legacy ₹500 / escrow / forfeiture / success-fee | **Inactive** | FD-031, FD-032, FD-039 |
| Partner lead-ingest API programme | **Inactive** | FD-039 |
| Machine | `SM_Lead_Assist.md` | |

---

## T. Event / Offer / Booking domain

| Area | Phase 2 posture | Sources |
|------|-----------------|--------|
| Marketplace ticketed events | In spine | FD-033, FD-037, `SM_Marketplace_Event.md` |
| Offer events + claims | Claim ≠ revenue | FD-037, `SM_Marketplace_Offer_Event.md`, `SM_Offer_Claim.md` |
| Redemption (QR / offer) | Explicit machine | `SM_Redemption.md` |
| Booking + 48h cancel cutoff | Default cancel; refund policy separate | FD-039 |
| Advertising / premium listings as SKUs | **Inactive** | FD-039 |

---

## U. Notification domain

| Decision | Classification | Notes |
|----------|----------------|-------|
| Delivery via app + async workers | Technical (ADR-014) | Email/SMS/push channels product-owned |
| Prefer actionable, workspace-scoped notices | Product + FD-035 | Avoid dumping sensitive finance into wrong workspace |
| Idempotent send / retry | Technical (ADR) | Align with job idempotency |
| Exact template copy / providers | Unresolved product/ops | Not Founder law |

---

## V. Audit domain

| Requirement | Source |
|-------------|--------|
| Immutable audit events for sensitive mutations | ADR-010 |
| No silent hard-delete of financial / attribution history | ADR-010, ADR-007, FD-020 |
| Assignment lifecycle audited | FD-035, `SM_Role_Assignment.md` |
| Offline bank evidence + Admin actions audited | FD-039, ADR-006 |
| Break-glass narrowly controlled and audited | FD-035 |

---

## W. Security architecture

| Control | Posture | Source |
|---------|---------|--------|
| Authn | Supabase Auth sessions | ADR-001 |
| Authz | Assignment RBAC + SoD in services | ADR-002, FD-023/035 |
| Data isolation | RLS deny-by-default | ADR-005 |
| Secrets | Service role, PSP, webhooks server-only | ADR-005, ADR-006, ADR-012 |
| KYC / Aadhaar | Data-minimisation; Aadhaar **not mandatory by default** | FD-039; `SM_KYC_Verification.md` |
| PII retention / consent wording | Unresolved / privacy validation | FD-039 |
| Detailed controls catalogue | To be elaborated under `docs/security/` | Cross-ref |

Compliance production gate ≠ architecture blocker (FD-039 Part M).

---

## X. API / backend architecture

| Surface | Use | Classification |
|---------|-----|----------------|
| Server Actions | In-app authenticated mutations | Technical (ADR-009) |
| Route Handlers | Webhooks, public callbacks, selected HTTP APIs | Technical (ADR-009) |
| RSC / loaders | Read models with server auth context | Technical (ADR) |
| Background jobs | Webhooks drain, settlement, reconcile, notify | Technical (ADR-014) |
| Validation | Both Server Actions and Route Handlers validated | ADR-009 |
| Partner ingest APIs | **Inactive** programme | FD-039 |

Never trust client-reported “paid” alone (ADR-006).

---

## Y. State-machine architecture

| Decision | Detail | Source |
|----------|--------|--------|
| Explicit states/transitions in domain services | Illegal jumps rejected | ADR-008 |
| Business machines documented first | `docs/state-machines/` | ADR-008 |
| Technical enums | Pending Technical Design unless FD locks them | FD-039 unresolved list |
| Dual Circle statuses | Two families, not one enum | FD-032 |

Index: `docs/state-machines/README.md`.

---

## Z. Migration architecture

| Concern | Approach | Source |
|---------|----------|--------|
| Schema | Forward-only migrations in `supabase/migrations/` | ADR-004 |
| Legacy roles/history | Preserve; map via taxonomy; **no auto entitlement** | ADR-011, FD-035 |
| Dashboard routes | Migrate toward `/dashboard/{workspaceKey}` | ADR-003 |
| Inactive commercials | Must not be re-enabled by migration scripts | FD-039, ADR-011 |
| Dual-read cutover | Allowed temporarily; auditable | ADR-011 |

---

## AA. Feature flags

| Rule | Source |
|------|--------|
| Gate inactive / validation-blocked capabilities | ADR-013 |
| Flag flip ≠ Founder activation or MoR production clearance | ADR-013, FD-039 |
| Defaults off in `pilot`/`prod` for FD-039 inactive items | ADR-013 |
| Material flag changes auditable | ADR-010, ADR-013 |

Examples (names illustrative): `wallet.cash_out`, `marketplace.affiliate_commercial`, `lead_assist.paid`, `payments.marketplace_tickets_live` (MoR validation-gated).

---

## AB. Environment strategy

| Env | Purpose |
|-----|---------|
| `local` | Developer machines |
| `staging` | Integration / QA |
| `pilot` | Controlled live pilot (city TBD) |
| `prod` | Production |

Hosting default: VPS + Nginx + PM2 + GitHub Actions; Docker/Edge optional not mandatory (ADR-012, FD-039). Secrets per env; never commit.

---

## AC. Observability

| Capability | Default | Source |
|------------|---------|--------|
| Error tracking | Sentry | ADR-010; FD-039 technical default |
| Logs | Structured server logs | ADR-010 |
| Job failures | Alert ops on critical money paths | ADR-014, ADR-010 |
| Product analytics depth | Product-owned; not Founder law | — |

---

## AD. Backup / restore

| Area | Posture | Classification |
|------|---------|----------------|
| Postgres | Use Supabase/project backup posture + verified restore drills | Technical (ops) |
| App/config | Treat env secrets and migration history as restore inputs | Technical (ADR-012/004) |
| RPO/RTO targets | Ops-owned; not Founder law | Unresolved until runbook |
| Financial integrity | Restore must preserve ledger/audit append-only history | FD-020, ADR-007, ADR-010 |

Detailed runbooks belong under ops/`docs/security/` when written — not invented here.

---

## AE. Technical risks

| Risk | Mitigation |
|------|------------|
| Treating ADRs as Founder law | Label every tech default; FD-039 Part L |
| Enabling inactive commercials via flags/migrations | ADR-013 + ADR-011 + FD-039 checklist |
| MoR/tax production before validation | Feature-gate money movement; compliance parallel track |
| Legacy enum → entitlement leakage | Taxonomy + ADR-011; no invent from `/dashboard/*` |
| RLS gaps / service-role leak | ADR-005; secrets hygiene |
| Silent financial history loss | Append-only + audit (ADR-007/010) |
| Connect-only architecture drift | FD-039 spine checklist in design reviews |
| Pilot city assumed in code | Geo configurable; city selection before deployment planning only |

---

## AF. ADR register

Canonical index: [`docs/phase-2/adrs/README.md`](./adrs/README.md)

| ID | Title | One-liner |
|----|-------|-----------|
| [ADR-001](./adrs/ADR-001_Authentication_Architecture.md) | Authentication | Supabase Auth + `@supabase/ssr` |
| [ADR-002](./adrs/ADR-002_Role_Assignment_and_RBAC_Model.md) | Role assignment / RBAC | User ≠ role; assignments |
| [ADR-003](./adrs/ADR-003_Workspace_and_Routing_Model.md) | Workspace routing | `/dashboard/{workspaceKey}` |
| [ADR-004](./adrs/ADR-004_Database_Schema_Source_of_Truth.md) | Schema SoT | `supabase/migrations/` |
| [ADR-005](./adrs/ADR-005_RLS_Strategy.md) | RLS | Deny-by-default; service role server-only |
| [ADR-006](./adrs/ADR-006_Payment_Gateway_and_Webhook_Architecture.md) | Payments / webhooks | Razorpay candidate; idempotent webhooks; MoR gated |
| [ADR-007](./adrs/ADR-007_Financial_Ledger_Architecture.md) | Ledgers | Separate ledgers; append-only; cash-out inactive |
| [ADR-008](./adrs/ADR-008_State_Machine_Architecture.md) | State machines | Explicit transitions; docs under `state-machines/` |
| [ADR-009](./adrs/ADR-009_API_Server_Actions_Route_Handlers.md) | API surfaces | Server Actions + Route Handlers |
| [ADR-010](./adrs/ADR-010_Audit_and_Observability.md) | Audit / observability | Immutable audit + Sentry |
| [ADR-011](./adrs/ADR-011_Legacy_Migration_Strategy.md) | Legacy migration | Preserve history; no auto entitlement |
| [ADR-012](./adrs/ADR-012_Environment_and_Deployment_Architecture.md) | Env / deploy | VPS/PM2/Nginx + GH Actions |
| [ADR-013](./adrs/ADR-013_Feature_Flags.md) | Feature flags | Gate inactive / validation-blocked |
| [ADR-014](./adrs/ADR-014_Background_Jobs_and_Scheduling.md) | Jobs | Idempotent VPS/Supabase workers |

---

## AG. Phase 2 exit criteria

Phase 2 technical architecture is **exit-ready** when:

1. This Master Plan + ADR-001–014 remain coherent with FD-001 and FD-020–FD-039.
2. Business state machines cover the Phase 2 commercial spine domains (index complete and consistent).
3. Logical data notes exist or are tracked under `docs/data/` without contradicting migrations SoT.
4. Security posture documented under `docs/security/` (or explicitly deferred with owners) covering RLS, secrets, KYC direction.
5. Legacy dashboard migration path to `/dashboard/{workspaceKey}` is defined without entitlement invention.
6. Inactive FD-039 items are feature-flagged **off** by default in pilot/prod designs.
7. MoR / GST / contract / KYC items remain explicitly **validation-gated** — not falsely marked “done.”
8. Pilot city still may be undecided for architecture exit; **must** be decided before pilot deployment planning (FD-039).
9. No production Marketplace ticket money movement without MoR/compliance clearance (FD-039).
10. Implementation may proceed against migrations + ADRs without inventing Founder commercial numbers.

---

## Unresolved (validation-gated / pending authority)

From FD-039 Part Q and related — **do not invent**:

| Item | Pending authority |
|------|-------------------|
| Exact GST rates / place-of-supply / invoice templates | Tax / Finance / Legal |
| Exact TDS sections/rates | Tax |
| Payment-aggregator regulatory classification; Razorpay account config | Legal / Finance / ops |
| Exact refund % / timelines / chargebacks; bank settlement timing | Finance / Legal / Product |
| Exact Aadhaar handling implementation; KYC retention; consent wording | Privacy / Legal |
| Exact contract clauses, jurisdiction, dispute forum, liability caps | Legal |
| Exact technical enum names / DB schemas / RLS SQL | Technical Design (migrations) |
| Pilot city | Founder (before deployment planning) |

---

## Cross-references

| Area | Location |
|------|----------|
| Founder Decisions | `docs/founder-decisions/` (FD-001, FD-020–FD-039) |
| Role taxonomy | `docs/core/35_Role_Taxonomy.md` |
| Commercial constants (living) | `docs/core/36_Commercial_Constants.md` — defer to FDs on conflict |
| Revenue flow narrative | `docs/core/37_Revenue_Flow.md` |
| Circle living doc | `docs/core/38_Circle_Architecture.md` |
| Lead Assist living doc | `docs/core/39_AI_Lead_Assist_Spec.md` |
| State machines | `docs/state-machines/` |
| Logical data models | `docs/data/` (populate alongside implementation; no DDL invention here) |
| Security docs | `docs/security/` |
| Technical ADRs | `docs/phase-2/adrs/` |
| Schema SoT | `supabase/migrations/` |
| Deployment narrative | `docs/core/24_Deployment_Architecture.md` |

---

## Inactive products checklist (must stay off unless later Founder approval)

Per FD-039 (and related): Marketplace Affiliate commercial activation · ZBP commercial model · Core Tier direct purchase / nationwide Core · Paid Lead Assist · Legacy ₹500 Lead Assist fee · Escrow / forfeiture / success-fee Lead Assist · Wallet cash-out / consumer withdrawals · Advertising / premium listings as active SKUs · Referral reward programmes with approved rates · Super Admin as ordinary product role · Vendor self-serve login portal · Native iOS/Android apps · International expansion · Multi-currency go-live · Partner lead-ingest API programme · Docker/Edge as mandatory prod architecture · Dark mode MVP · Marketplace category-specific revenue-share variants.

---

## Document control

| Change type | Process |
|-------------|---------|
| Business rule change | New/amended Founder Decision |
| Technical default change | New ADR that supersedes an Accepted ADR; update ADR index |
| Schema change | Migration under `supabase/migrations/` (ADR-004) |
| This Master Plan | Update when ADR/FD catalogue or Phase 2 spine materially changes |

**End of Phase 2 Technical Architecture Master Plan.**
