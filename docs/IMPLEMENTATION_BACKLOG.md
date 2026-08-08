# GCE Implementation Backlog

| Field | Value |
|-------|-------|
| **Document** | `docs/IMPLEMENTATION_BACKLOG.md` |
| **Type** | Documentation-only epic/feature backlog (no code / SQL) |
| **Authority** | Subordinate to Founder Decisions and Master Roadmap |
| **Companions** | `docs/MASTER_IMPLEMENTATION_ROADMAP.md`; `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md`; phase docs; ADRs |
| **Date** | 2026-08-08 |

---

## How to use

| Column | Notes |
|--------|-------|
| **Epic** | Phase/domain grouping |
| **Priority** | `P0` (foundation / money-safety) · `P1` (Phase 2 spine) · `P2` (important polish / ops) · `Future` (FD-039 Part J inactive or post-launch) |
| **Risk** | Implementation / compliance / correctness risk if deferred or wrong |
| **Migration impact** | Effect on existing schema/data/legacy roles — high where historical rewrite risk exists |

Do not invent GST%, refund%, or inactive commercial SKUs. Feature-flag validation-gated and Future items.

---

## Backlog

| Epic | Feature | Technical dependency | Business dependency | Phase | Priority | Risk | Acceptance criteria | Testing requirement | Migration impact | Impl status |
|------|---------|----------------------|---------------------|------:|----------|------|---------------------|---------------------|------------------|-------------|
| Platform foundation | Repo domain boundaries + shared validation (Zod) | Next.js 16 / React 19 stack | FD-039 Phase 2 spine | 3 | P0 | Medium | Domains isolated; shared types live under agreed paths | Lint + unit for validators | Low | **DONE** — `lib/validation` + platform modules |
| Platform foundation | Error taxonomy + structured logging + Sentry | ADR-010 | FD-039 observability default | 3 | P0 | Medium | User-safe errors; structured logs; Sentry wired in non-prod | Error path tests; Sentry smoke | Low | **DONE** — `lib/errors` + `lib/logging` + observability |
| Platform foundation | Feature-flag service for inactive / validation-gated money | ADR-013 | FD-039 Part J + Part M | 3 | P0 | High | Flags default **off** for inactive & MoR production money | Flag matrix tests | Low | **DONE** — `lib/feature-flags` service |
| Platform foundation | Env/secrets hygiene + Supabase client triad (browser/SSR/service) | ADR-001/004 | FD-034 entity posture | 3 | P0 | High | No service-role in browser; secrets not committed | Client boundary tests | Low | **DONE** — `lib/config` + `lib/supabase` |
| Platform foundation | CI/CD + VPS deploy/rollback runbook hooks | ADR-012 | Phase 3 DoD | 3 | P1 | Medium | Main builds; documented rollback | Pipeline smoke | Low | **DONE** — CI gates + deploy/rollback doc |
| Identity & RBAC | Auth session (Supabase Auth + `@supabase/ssr`) | ADR-001 | FD-035 User permanent identity | 4 | P0 | Critical | Session binds to User; logout clears workspace claim | Auth integration tests | Medium (legacy auth helpers) | **DONE** — identity me API + profile ensure |
| Identity & RBAC | Role assignment model with explicit scope | ADR-002 | FD-023/035 | 4 | P0 | Critical | Multi-role via assignments; no entitlement from legacy enum alone | Assignment matrix tests | High (legacy roles) | **DONE** — lifecycle services + APIs |
| Identity & RBAC | Workspace routing `/dashboard/{workspace}` | ADR-003 | FD-035 | 4 | P0 | High | Switcher persists scope; data queries scoped | Workspace isolation tests | Medium | **DONE** — server AuthZ + switcher |
| Identity & RBAC | Legacy role migration map (zbp/bdm/affiliate/franchisee/enterprise dual) | Role taxonomy `35` | FD-032/035 | 4 | P0 | High | Controlled map; inactive roles not entitled | Migration rehearsal | High | **DONE** — quarantine trigger + map rows; bulk historical migration still ops |
| Identity & RBAC | SoD: no self-approval; department-scoped Admin | RBAC matrix | FD-023/029/037 | 4 | P0 | Critical | Self-approve blocked for commission/settlement/listing final | SoD negative tests | Low | **DONE** — app + DB SoD guards |
| Identity & RBAC | Super Admin **not** ordinary product role | Feature flags | FD-039 | 4 | P0 | High | No default god-mode product path | Access negative tests | Low | **DONE** — emergency break-glass tables/API only |
| Data & security | Migrations remain schema SoT; no ad-hoc prod DDL | ADR-004 | FD-032 no silent rewrite | 3–4 | P0 | Critical | All schema changes via `supabase/migrations/` | Migration apply on clean DB | High | **DONE** — Phase 4 additive on gce-dev |
| Data & security | RLS deny-by-default keyed to `auth.uid()` + assignments | ADR-005 | FD-023/035 | 4 | P0 | Critical | Cross-tenant reads fail closed | RLS policy suite | High | **DONE** — Phase 4 RLS + local suite |
| Data & security | Immutable audit log (security + business) | ADR-010 | FD-020/021/036 | 4 / 12 | P0 | Critical | Admin/finance/KYC actions audited; no silent overwrite | Audit append-only tests | Medium | **DONE** — assignment events + audit_events |
| Payments spine | Payment webhook skeleton (idempotent) | ADR-006 | FD-039 Razorpay candidate; MoR validation-gated | 9 | P0 | Critical | Duplicate webhooks safe; payment SM advances | Webhook replay tests | Low | **PARTIAL** — webhook route + idempotency |
| Payments spine | Payment & refund state machines implemented | `SM_Payment` / `SM_Refund` | FD-020/028/039 | 9 | P0 | Critical | Payment success ≠ settlement; refund reverses linked revenue hooks | SM transition tests | Medium |
| Payments spine | MoR-aware Marketplace ticket collection scaffolding | Payment SM + flags | FD-039 Logixia intended MoR | 7 / 9 / 11 | P0 | Critical | Collection path feature-flagged until OD-001 validated | Non-prod MoR config tests | Low |
| Payments spine | Offline BDP-pack Admin bank payment workflow | Audit + SoD | FD-039 online default / rare offline | 6 / 13 | P1 | High | Cash blocked as normal; offline reconciled & audited | Offline SOP test cases | Low |
| Membership & Connect | Membership purchase → Pending Activation flow | Payments + identity | FD-022/027/036 | 5 | P0 | High | Paid ≠ allocated; Pending Activation on payment success | E2E membership happy path | Medium | **DONE** — payment→pending_verification; activate separate |
| Membership & Connect | **Activation ≠ Circle allocation** hard invariant | Membership SM | FD-036 | 5 | P0 | Critical | Active membership may exist without seat; Circle rights gated | Invariant unit + E2E | Medium | **DONE** — allocation_status field + tests |
| Membership & Connect | Category/Tags before purchase; seat check when possible | Taxonomy | FD-036/027 | 5 | P1 | Medium | Initial category/Tags captured pre-pay | Form + seat-check tests | Low | **DONE** — specialisations + Tags pricing |
| Membership & Connect | Waitlist when category full | Allocation engine | FD-036; OD-023 formula open | 5 | P1 | Medium | Waitlist path without inventing priority formula as Founder law | Waitlist state tests | Low | **DONE** — operational ordering only |
| Membership & Connect | Circle dual status families (lifecycle + constitutional) | Circle SMs | FD-024/030/032 | 5 | P0 | High | Both families preserved; thresholds 15/20/40 | Status mapping tests | High | **DONE** — dual fields + refresh fn |
| Membership & Connect | Platform activation credit at 15 founding members | Circle + Connect BDP | FD-032/025 | 5–6 | P0 | High | Credit once at formal activation | Credit idempotency tests | Medium | **DONE** — one-time event id hook; Phase 6 consumes |
| Membership & Connect | Circle transfer controlled process | Allocation + audit | FD-036 | 5 | P1 | Medium | History preserved; seat released on transfer | Transfer E2E | Medium | **DONE** — transfer foundation; attribution preserved |
| Membership & Connect | Aadhaar not mandatory by default | KYC module | FD-039; OD-019 | 5 | P0 | High | Membership completable without Aadhaar | Negative KYC tests | Low | **DONE** — aadhaar_used default false |
| Connect BDP | Connect BDP onboarding + Franchise Unit pack | Identity + payments | FD-025/039 | 6 | P1 | High | Pack online-default; unit capacity enforced | Onboarding E2E | Medium | **DONE** — units + activation via `role_assignments`; money flags OFF |
| Connect BDP | Attribution required for 20% commission | Commission engine | FD-036/029 | 6 / 9 | P0 | Critical | Unattributed membership → **no** Connect BDP commission | Attribution negative tests | Medium | **DONE** — entitlement boundary; Phase 9 settlement remains |
| Connect BDP | Commission-Recovery Finance Option from Month 0 | FD-029 recovery | FD-029 supersession | 6 / 9 | P1 | High | Recovery capped per rules; audited | Recovery calculation tests | Medium | **DONE** — recovery ledger + cycle/total caps |
| Connect BDP | RM operational assignment (no auto commission) | Assignments | FD-036 | 6 | P1 | Medium | RM assigned; no default commission | Entitlement negative tests | Low | **DONE** — PRM dispute escalate; no commission grant |
| Marketplace | Venue Partner onboarding via Marketplace BDP | Identity + orgs | FD-033/037 | 7 | P1 | High | MBDP recommends; Platform final-approves | Approval SoD tests | Medium | **DONE** Phase 7 |
| Marketplace | Marketplace Event booking MoR-aware collection | Payments + Event SM | FD-037/039 | 7 / 11 | P0 | Critical | Ticket booking records MoR-intended entity; money flagged until validation | Booking + webhook E2E | Medium | **DONE** boundary; money gated |
| Marketplace | Unattributed split 80/0/20 vs attributed 80/10/10 | Commission engine | FD-037/029 | 7 / 9 | P0 | Critical | Correct split by attribution; no retroactive auto-commission | Split matrix tests | Medium | **DONE** entitlement boundary |
| Marketplace | Offer Event claim ≠ revenue; redemption token flow | Offer/Redemption SMs | FD-037 | 7 / 11 | P1 | High | Claim alone does not create Platform Revenue | Claim/redeem tests | Low | **DONE** claims/redemptions |
| Marketplace | 48-hour default cancellation cutoff | Event + Refund SM | FD-039; OD-006 open % | 11 | P0 | High | Cutoff enforced; refund % configurable/pending — not hard-coded invented | Cancel boundary tests | Low | **PARTIAL** policy version stored; % open |
| Marketplace | Event QR validation at launch | Redemption/check-in | FD-037 | 11 | P1 | Medium | QR validates ticket; replay protected | QR replay tests | Low | **DONE** foundation Phase 7 |
| Marketplace | Marketplace BDP unit caps 20 / max 2 units / 40 venues | Capacity engine | FD-033 | 7 | P1 | Medium | Caps enforced; second unit not automatic | Capacity tests | Low | **DONE** DB triggers |
| Marketplace | Affiliate commercial path feature-flagged **off** | Flags | FD-032/039 Part J | 7 | Future | Low | No Affiliate entitlements in production spine | Flag-off proof | Low |
| Enterprise | Enterprise Client org + Client Representative | Orgs + RBAC | FD-038/035 | 8 | P1 | High | Client ≠ Enterprise BDP | Org isolation tests | **Done on gce-dev** |
| Enterprise | Enterprise BDP pack + client-based attribution | Payments + commission | FD-026/038 | 8 | P1 | High | No territorial exclusivity entitlement | Attribution tests | **Done on gce-dev** |
| Enterprise | Quotation path + Finance co-sign > ₹5,00,000 | SoD + audit | FD-038/039 | 8 / 13 | P0 | Critical | Quotes above threshold blocked without Finance co-sign | Threshold boundary tests | **Done on gce-dev** |
| Enterprise | Project components + project-specific milestones | Project SM | FD-038 | 8 | P1 | High | No fixed mandatory 30/40/30; milestones negotiated | Milestone config tests | **Done on gce-dev** |
| Enterprise | Componentised entitlement boundary; **no double commission** | Settlement + commission | FD-038/037 | 8 / 9 | P0 | Critical | Same rupee component cannot pay two vertical commissions | Cross-vertical recon tests | **Boundary done; Phase 9 settlement pending** |
| Enterprise | Managed vendors without mandatory login | Vendor records | FD-038/039 | 8 | P1 | Medium | Vendor portal inactive; architecture allows future workspace | Vendor record CRUD tests | **Done on gce-dev** |
| Enterprise | Vendor Opportunity Fee % **not** activated | Flags | FD-026; OD-026 | 8 | Future | Medium | Fee concept stored inactive; no invented % | Flag-off proof | Low |
| Finance | Ledger principles (internal wallet; cash-out inactive) | ADR-007 | FD-020/039 | 9 | P0 | Critical | Ledgers auditable; cash-out flag off | Ledger invariant tests | High |
| Finance | Commission Engine entitlement states | `SM_Commission` | FD-029 | 9 | P0 | Critical | States versioned; self-approval impossible | Commission SM + SoD tests | High |
| Finance | Settlement batches; payment success ≠ settlement-eligible | `SM_Settlement` | FD-021 | 9 | P0 | Critical | Holds/overrides audited; monthly launch batch posture | Settlement batch tests | High |
| Finance | Rule versioning (no automatic retrospective recalc) | Commission/settlement | FD-032 | 9 | P0 | High | Historical transactions keep applicable rule version | Version freeze tests | High |
| Finance | GMV / Collected / Eligible / Platform measurement separation | Reporting views | FD-028 | 9 / 12 | P1 | Medium | Reports do not conflate concepts | Report fixture tests | Low |
| Lead Assist | Stage 1 unpaid Lead Assist create/route/Desk | `SM_Lead_Assist` | FD-031/039 | 10 | P1 | Medium | Unpaid Stage 1 works; AI assistive only | Lead Assist E2E | Medium |
| Lead Assist | Contact reveal consent-gated | Privacy controls | FD-031; OD-010 | 10 | P1 | High | No reveal without consent controls | Consent negative tests | Low |
| Lead Assist | Paid / ₹500 / escrow / success-fee paths flagged **off** | Flags | FD-039 Part J | 10 | Future | High if leaked | No paid Lead Assist charges in spine | Flag-off proof | Low |
| Customer UX | Event discovery + detail + booking PWA flows | Phase 7 domain | FD-037/039 | 11 | P1 | Medium | Mobile-first booking completable | Playwright booking smoke | Low |
| Customer UX | Offer claim + redeem UX | Offer SMs | FD-037 | 11 | P1 | Medium | Claim/redeem distinct from ticket booking | UX E2E | Low |
| Customer UX | Cancel UX respects 48h default + disclosure placeholders | Refund SM | FD-039; OD-006 | 11 | P1 | High | Cutoff shown; no invented refund % as final law | Cancel UX tests | Low |
| Notifications | Event-driven notification catalogue (email/SMS/push/in-app) | Jobs ADR-014 | Domain FDs | 12 | P1 | Medium | Critical lifecycle events notifiable; preferences respected | Notification contract tests | Low |
| Analytics | KPI domains without invented vanity formulas | Reporting | FD-028 concepts | 12 | P2 | Low | Dashboards separate GMV vs Collected vs Eligible | Fixture assertions | Low |
| Security | Fraud-review queue interface | Audit + Ops | Phase 12/13 | 12–13 | P1 | High | Signals → queue → human decision audited | Fraud workflow tests | Low |
| Privacy | Retention placeholders + access logging for KYC | Audit | OD-008/009 | 12 / 15 | P1 | High | Retention configurable; Aadhaar access logged | Access log tests | Medium |
| Admin Ops | Approval queues (membership, listings, Enterprise quotes, KYC, offline pay) | RBAC + audit | FD-036/037/038/039 | 13 | P1 | High | Queues enforce SoD; Platform final where required | Queue SoD tests | Low |
| Admin Ops | Exception / dispute / financial hold queues | Settlement | FD-021/029 | 13 | P1 | High | Holds block payout; overrides audited | Hold/override tests | Low |
| Admin Ops | Support playbooks + escalation (Operational Recommendation SLAs) | Notifications | Phase 13 | 13 | P2 | Low | Playbooks linked; no invented commercial rates | Ops checklist review | Low |
| QA & migration | RLS + finance reconciliation test packs | Phases 4–9 | FD-032 | 14 | P0 | Critical | Critical policies and money paths covered pre-pilot | Automated suites in CI | High |
| QA & migration | Legacy data migration rehearsal (roles, statuses) | Taxonomy + SMs | FD-032 | 14 | P0 | High | Dry-run report; no silent historical rewrite | Rehearsal sign-off | High |
| QA & migration | Non-prod MoR/payment config matrix | Flags + PSP sandbox | OD-001 | 14 | P0 | High | Sandbox paths tested without production claims | Config matrix tests | Low |
| Compliance readiness | Applicable Law Register ops updates | Docs | FD-039; OD-016 | 15 | P0 | High | Register current for launch SKUs/geography | Legal review checklist | Low |
| Compliance readiness | MoR / GST / TDS / invoice validation pack | Finance scaffolding | OD-001–005 | 15 | P0 | Critical | Professional sign-off recorded before money go-live | Evidence pack review | Low |
| Compliance readiness | Agreement packs (BDP / Venue / Enterprise / Vendor / ToU) | AI first drafts OK | OD-011–015 | 15 | P0 | Critical | Final Legal validation before contractual reliance | Contract checklist | Low |
| Pilot | City-agnostic pilot framework + post-city templates | Phases 3–15 | FD-039 Part K; OD-017 | 16 | P1 | Medium | Architecture unblocked; deploy plan waits on Founder city | Pilot readiness review | Low |
| Pilot | Pilot KPI / incident / rollback runbooks | Monitoring | Phase 16 | 16 | P1 | Medium | Go/no-go evidence pack defined | Tabletop exercise | Low |
| Production launch | Controlled release waves + money monitoring | Feature flags | Phase 17; Phase 15 gates | 17 | Future | High | Waves gated; inactive Part J stay off | Launch checklist | Medium |
| Scale / future | Multi-city scale programme (approved spine only) | Phase 17 stable | FD-039 | 18 | Future | Medium | Scale plan without activating Part J | Scale checklist | Medium |
| Scale / future | Marketplace Affiliate activation | Flags + FD | Requires **future FD** | 18 | Future | High if premature | Remains inactive until Founder Decision | N/A until FD | Low |
| Scale / future | Paid Lead Assist / escrow / success-fee | Flags + FD | Requires **future FD** | 18 | Future | High if premature | Remains inactive | N/A until FD | Low |
| Scale / future | Wallet cash-out / consumer withdrawals | Ledger + FD | FD-039 inactive | 18 | Future | Critical if leaked | Remains inactive | Flag-off proof | High |
| Scale / future | Core Tier direct purchase / nationwide Core | Membership | FD-027/039 inactive | 18 | Future | High if premature | Remains inactive; no forced Core overflow | Flag-off proof | Medium |
| Scale / future | Native iOS / Android apps | PWA-first | FD-039 inactive | 18 | Future | Low | Not in near-term spine | N/A | Low |
| Scale / future | Dark mode MVP | Design system | FD-039 inactive | 18 | Future | Low | Not MVP requirement | N/A | Low |
| Scale / future | Vendor self-serve login portal | Enterprise vendors | FD-039 inactive | 18 | Future | Medium | Architecture-ready only | N/A until FD | Medium |
| Scale / future | Advertising / premium listing SKUs | Catalogue | FD-028 category approved; activation inactive | 18 | Future | Medium | No live SKU/prices invented | N/A until FD | Low |

---

## Priority summary (approximate)

| Priority | Count (rows) | Intent |
|----------|-------------:|--------|
| P0 | ~28 | Identity, RLS, migrations SoT, payments/commission/settlement, activation≠allocation, MoR-aware collection, audit, Finance co-sign, compliance packs |
| P1 | ~30 | Vertical spine, Lead Assist Stage 1, UX, ops queues, pilot framework |
| P2 | ~3 | Analytics polish, support playbook depth |
| Future | ~10 | FD-039 Part J inactive / post-launch scale |
| **Total** | **~71** | Enough to steer implementation — not a thousand-row tracker |

---

## Related documents

| Document | Role |
|----------|------|
| [`docs/MASTER_IMPLEMENTATION_ROADMAP.md`](./MASTER_IMPLEMENTATION_ROADMAP.md) | Phase order and gates |
| [`docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md`](./OPEN_DECISIONS_AND_VALIDATION_REGISTER.md) | Non-technical open validations |
| Phase folders `docs/phase-3/` … `docs/phase-18/` | Detailed phase scope |
| `docs/phase-2/adrs/` | Technical defaults |

---

**End of Implementation Backlog**
