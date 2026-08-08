# Open Decisions and Validation Register

| Field | Value |
|-------|-------|
| **Document** | `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md` |
| **Type** | Documentation-only register of genuine Founder / Legal / Tax / Privacy / Finance / Security / Ops items |
| **Authority** | Subordinate to Founder Decisions; does not invent commercial products or rates |
| **Exclusions** | Routine technical design (exact enums, schemas, RLS SQL, API shapes, UX copy polish) — those belong in ADRs / technical backlog |
| **Date** | 2026-08-08 |
| **Phase 2 note** | Architecture spine is **COMPLETE on gce-dev** (migrations applied; types regenerated from gce-dev). Non-blocking: historical legacy schema baseline dump (ADR-004). Open OD items below are **unchanged** — money/legal gates remain Validation Pending / Deferred. |

---

## Status legend

| Status | Meaning |
|--------|---------|
| **Open** | Direction incomplete or Founder commercial gap still pending |
| **Validation Pending** | Founder direction exists; professional validation required before production reliance |
| **Deferred** | Intentionally later; may not block architecture |

## Severity

| Severity | Meaning |
|----------|---------|
| **Critical** | Blocks production money movement, binding contracts, or regulated launch claims |
| **High** | Blocks pilot money / partner go-live / consumer disclosures |
| **Medium** | Needed before scale or specific workflows; architecture may proceed with placeholders |
| **Low** | Important for completeness; does not block spine architecture |

## Columns

ID · Topic · Type · Current approved direction · Missing validation · Blocking phase · Severity · Owner · Due before · Status

---

## Register

| ID | Topic | Type | Current approved direction | Missing validation | Blocking phase | Severity | Owner | Due before | Status |
|----|-------|------|----------------------------|--------------------|----------------|----------|-------|------------|--------|
| OD-001 | Marketplace event ticket Merchant of Record (MoR) implementation | Legal / Tax / Finance | Logixia Solutions Private Limited is the **intended** MoR for Marketplace event tickets (FD-039); business direction approved | GST on tickets; invoice supplier identity; payment-gateway account structure; refund accounting; TDS/withholding; settlement compliance; payment-aggregator implications | Phase 15 (money go-live); Phase 17 production money | Critical | Legal + Tax + Finance | Marketplace ticket money go-live | Validation Pending |
| OD-002 | RBI / payment-aggregator (PA) applicability | Legal / Finance | Razorpay may be India PSP **candidate** (technical ADR; not Founder law). Logixia intended payment-receiving entity subject to professional validation (FD-034/039) | Exact PA/regulatory classification; account structuring; settlement compliance for MoR model | Phase 15 (money go-live) | Critical | Legal + Finance | First live ticket / pack collection | Validation Pending |
| OD-003 | Exact GST rates and place-of-supply logic | Tax | GST excluded from Platform Revenue concept (FD-028); exact rates unresolved (FD-039) | Rates for tickets, memberships, BDP packs, Enterprise invoices; place-of-supply; tax presentation on invoices | Phase 15 | Critical | Tax | Invoice / money go-live | Validation Pending |
| OD-004 | Exact TDS sections and rates | Tax | TDS separately recorded (FD-028); exact sections/rates unresolved (FD-039) | Sections/rates; withholding workflows; stakeholder payout treatment | Phase 15 | Critical | Tax + Finance | Settlement / payout go-live | Validation Pending |
| OD-005 | Invoice structure and templates | Legal / Tax / Finance | Logixia ordinarily invoice-issuing entity subject to validation (FD-034); MoR direction for tickets (FD-039) | Final templates: supplier / platform / venue identity; tax lines; credit notes | Phase 15 | High | Finance + Legal | First production invoice | Validation Pending |
| OD-006 | Refund percentages, timelines, convenience fee, chargeback, no-show | Founder / Legal / Finance | 48-hour **default cancellation cutoff** approved (FD-039). Exact refund %, timelines, convenience fee, chargeback, no-show economics **not** finalised | Consumer refund matrix; chargeback fee treatment; no-show rules; convenience fee if any; disclosure wording | Phase 15 (disclosures/contracts); Phase 11 UX may use placeholders | High | Founder + Legal + Finance | Consumer ticket sales go-live | Open |
| OD-007 | Membership refund matrix | Founder / Legal | Non-refundable after activation as commercial posture; exceptional refunds for verified platform/legal errors (FD-027). Exact matrix pending | Exact post-purchase / pre-activation / exceptional refund matrix | Phase 15; Phase 5 may scaffold states | High | Founder + Legal | Membership money go-live | Open |
| OD-008 | Data fiduciary / controller classification | Privacy / Legal | Data inventory fields required (FD-034); exact legal classifications pending | Controller/fiduciary vs processor roles for Logixia/GCE surfaces; cross-border rules | Phase 15 | Critical | Privacy + Legal | Privacy notice publication / PII production reliance | Validation Pending |
| OD-009 | Privacy / KYC retention periods | Privacy | Aadhaar minimisation; Aadhaar not mandatory by default (FD-039). Retention periods unresolved across FDs | Exact retention for KYC docs, tickets, finance, Lead Assist, audit | Phase 15; Phase 12 retention placeholders | High | Privacy | Production PII retention claims | Validation Pending |
| OD-010 | Lead Assist data retention and model-training policy | Privacy / Legal | Stage 1 unpaid approved; paid/escrow inactive (FD-031/039). Retention & model-training pending Legal/Technical Approval (FD-031) | Retention period; training/opt-out; vendor model terms | Phase 15; Phase 10 feature may run with strict no-train default until validated | High | Privacy + Legal | Any model-training or long retention claim | Open |
| OD-011 | Final BDP agreement wording (Connect / Marketplace / Enterprise) | Legal | Working legal model: Commercial Licence / Independent Business Partner; “Franchise Unit” = commercial package, **not** automatic legal franchise (FD-039) | Exact clauses; jurisdiction; liability caps; indemnity; insurance; notice/appeal timelines | Phase 15 (contract reliance); Phase 16 partner onboarding | Critical | Legal | Binding BDP pack activation | Validation Pending |
| OD-012 | Venue Partner agreement finalisation | Legal | Venue Partner role family + attributes; payouts platform-initiated (FD-037); MoR direction for tickets (FD-039) | Exact Venue Partner terms; tax presentation; payout/refund/chargeback allocation | Phase 15 | High | Legal | Venue live ticketed events | Validation Pending |
| OD-013 | Enterprise Client agreement finalisation | Legal | Enterprise Client = organisation; project legal role explicit per contract; Logixia not automatic physical executor (FD-034/038) | Exact contract form; authority proof; refund/cancellation; liability | Phase 15 | High | Legal | First binding Enterprise project | Validation Pending |
| OD-014 | Vendor agreement finalisation | Legal | Managed vendor records at launch; vendor self-serve portal inactive (FD-038/039) | Exact vendor terms; settlement; dispute SLA; insurance | Phase 15 | High | Legal | Vendor settlement / project execution contracts | Validation Pending |
| OD-015 | Platform Terms of Use / Membership terms / consumer disclosures | Legal | AI may prepare first drafts; final validation required before publication (FD-039) | Production ToU, membership terms, cancellation/refund disclosures | Phase 15 | High | Legal | Public consumer/member go-live | Validation Pending |
| OD-016 | Applicable Law & Compliance Register completeness | Legal / Ops | Register required; avoid single-law assumptions (FD-039) | Completeness for launch geography/SKUs; ownership of updates | Phase 15; ongoing | High | Legal + Ops | Production reliance / pilot money | Validation Pending |
| OD-017 | Pilot city selection | Founder | Intentionally undecided; does **not** block Phase 2 Technical Architecture (FD-039 Part K) | Founder selection of first live pilot city | Phase 16 **deployment planning finalisation** only | Medium | Founder | Finalising city RACI, local BDP/venue/Circle launch calendar | Deferred |
| OD-018 | Offline BDP-pack bank payment SOP | Ops / Finance / Legal | Online default; rare controlled audited Admin bank payment; cash not normal activation (FD-039) | Authorised roles; reconciliation; evidence pack; anti-fraud controls | Phase 15 / Phase 13 before offline path production | Medium | Ops + Finance + Legal | Enabling offline pack activation in production | Validation Pending |
| OD-019 | Aadhaar handling implementation (edge cases) | Privacy / Legal / Ops | Minimise; not mandatory by default; use only if legally permitted and proportionate (FD-039) | Edge-case workflows; consent; storage; access logging; deletion | Phase 15 before any Aadhaar-required workflow | Medium | Privacy + Legal + Ops | Any Aadhaar-required production flow | Validation Pending |
| OD-020 | Exact KYC document list for membership / BDP / venue / Enterprise | Privacy / Ops / Legal | KYC posture exists; Aadhaar not default-mandatory (FD-036/039). Exact lists pending | Document checklist per actor; verification standards | Phase 15 / Phase 5–8 onboarding | Medium | Ops + Privacy + Legal | Binding KYC gate enforcement | Open |
| OD-021 | Connect BDP post-activation Circle stability period | Founder | Circle counts only after platform activation + readiness (FD-025). Exact post-activation stability period pending Founder Approval | Exact stability window before target credit / performance counting | Phase 6 credit/ops rules | Medium | Founder | Connect BDP performance/target production rules | Open |
| OD-022 | Connect BDP subscriptions paid before reassignment, eligible after | Founder | Attribution effective date / no automatic retroactive commission principles exist (FD-036/029). Exact treatment of edge timing pending Founder Approval (FD-025) | Edge-case entitlement rule when payment precedes reassignment | Phase 6 / Phase 9 commission eligibility | Medium | Founder + Finance | Commission disputes on reassignment edges | Open |
| OD-023 | Membership waitlist prioritisation formula | Founder / Product | Waitlist path approved when category full (FD-036). Exact prioritisation pending Founder or Product Design | Priority formula (FIFO vs score vs RM discretion bounds) | Phase 5 waitlist production fairness claims | Medium | Founder / Product | Publishing contractual waitlist priority | Open |
| OD-024 | Marketplace BDP Month 1 / Month 2+ ₹ revenue targets (if still unset) | Founder | Unit capacity and commercial pack numbers approved (FD-033/029). Some performance ₹ targets remain Pending Founder Approval per Marketplace BDP docs | Exact numeric Month 1 / later revenue targets if required for ops scorecards | Phase 7 ops scorecards (not architecture) | Low | Founder | Publishing guaranteed/target scorecards | Open |
| OD-025 | Marketplace BDP notice / appeal / inactivity duration details | Legal / Ops | Due process and inactivity review required (FD-033). Exact notice period, appeal timeline, inactivity duration before capacity release pending | Exact durations and appeal SLAs | Phase 15 agreements; Phase 7 ops | Medium | Legal + Ops | Binding suspension/termination notices | Open |
| OD-026 | Enterprise Vendor Opportunity Fee rate and distribution | Founder | Success-based **concept** approved; exact % and distribution **unresolved**; must not invent (FD-026/028/029) | Rate; beneficiary split; eligibility timing | Future commercial activation (not Phase 2 spine SKU) | Medium | Founder | Activating Vendor Opportunity Fee as live commercial SKU | Open |
| OD-027 | Enterprise project reassignment spanning cut-off | Founder | Componentised settlement; no double commission (FD-038). Exact treatment of projects spanning reassignment date pending Founder Approval (FD-026) | Cut-off entitlement rule across reassignment | Phase 8 / Phase 9 | Medium | Founder + Finance | Enterprise BDP reassignment with live projects | Open |
| OD-028 | Dispute-resolution forum, jurisdiction, limitation-of-liability caps | Legal | AI first-draft allowed; final legal validation required (FD-034/039) | Exact jurisdiction clauses; forum; liability caps; indemnities | Phase 15 contract packs | High | Legal | Binding agreements | Validation Pending |
| OD-029 | Statutory accounting recognition / refund reversal policy detail | Finance / Tax | Refunds reverse revenue and commission (FD-028); statutory recognition policy unresolved | Accounting policy pack aligned to MoR/GST | Phase 15 | High | Finance + Tax | Audited financial reporting of live money | Validation Pending |
| OD-030 | Security production controls for payment webhooks / Admin money paths | Security / Finance / Ops | Immutable audit and least privilege required (FD-023/020/021/039); Super Admin not ordinary role | Production hardening sign-off for webhook secrets, offline payment Admin, settlement release SoD | Phase 15 / Phase 17 money go-live | High | Security + Finance | Production money movement | Validation Pending |

---

## Counts

| Status | Count |
|--------|------:|
| Open | 10 |
| Validation Pending | 18 |
| Deferred | 1 |
| **Total** | **~29** |

*(OD-001–OD-030; one Deferred = pilot city.)*

---

## Explicitly out of this register

Do **not** add as “open Founder decisions” without a later FD:

- Marketplace Affiliate, ZBP, Core Tier direct purchase, paid Lead Assist, wallet cash-out, advertising/premium SKUs, referral rewards, native apps, dark mode MVP, vendor self-serve portal — these are **Future / inactive** (FD-039 Part J), not open commercial products awaiting rates.
- Exact database schemas, enums, RLS SQL, API routes, Razorpay SDK wiring — **Technical Design / ADR**.
- Invented GST%, refund%, or Vendor Opportunity Fee% — **forbidden**.

---

## Related documents

| Document | Role |
|----------|------|
| [`docs/MASTER_IMPLEMENTATION_ROADMAP.md`](./MASTER_IMPLEMENTATION_ROADMAP.md) | Phase gates |
| [`docs/IMPLEMENTATION_BACKLOG.md`](./IMPLEMENTATION_BACKLOG.md) | Implementation epics |
| [`docs/founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md`](./founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md) | Compliance gates & MoR direction |
| [`docs/compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md`](./compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md) | Law mapping companion |

---

**End of Open Decisions and Validation Register**
