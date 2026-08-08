# Phase 10 — AI Lead Assist (Stage 1 Unpaid Launch)

| Field | Value |
|-------|-------|
| **Phase** | 10 |
| **Document** | `PHASE_10_AI_LEAD_ASSIST.md` |
| **Type** | Phase planning / living architecture summary (documentation only) |
| **Status** | Implemented on gce-dev — Stage 1 unpaid only |
| **Date** | 2026-08-08 |

---

## Authority

**Highest business authority:**

| Topic | Authority |
|-------|-----------|
| AI Lead Assist / Lead Intelligence architecture | **FD-031** |
| Supersession of legacy paid Lead Assist narrative; dual status mapping | **FD-032** |
| Phase 2 scope includes unpaid Lead Assist Stage 1; paid / ₹500 / escrow / success-fee **inactive** | **FD-039** |
| Commission / non-automatic Lead Assist success fee; Connect BDP not auto-earn on Lead Assist | **FD-029** |
| Revenue recognition — Pending Lead Assist Commercial Revenue | **FD-028** |
| Opportunity Desk / identity / workspace roles | **FD-035** |
| Circle referrals / Protected Tag Scope / Dual-Confirmed Closed Business | **FD-030** |
| RBAC | **FD-023** |

**Living companions:** `docs/core/39_AI_Lead_Assist_Spec.md`, `10_AI_Lead_Assist.md`, `22_AI_Rules.md`.

**State machine (mandatory linkage):**

- [`SM_Lead_Assist`](../state-machines/SM_Lead_Assist.md)

**Technical ADRs:**

- [`ADR-013`](../phase-2/adrs/ADR-013_Feature_Flags.md) — future/paid stages feature-flagged inactive
- [`ADR-010`](../phase-2/adrs/ADR-010_Audit_and_Observability.md) — audit of routing / overrides
- [`ADR-008`](../phase-2/adrs/ADR-008_State_Machine_Architecture.md)

---

## Purpose

Document Phase 10 for **approved unpaid Stage 1** Lead Assist only — the launch surface for GCE Connect AI Lead Assist / Lead Intelligence:

- Help classify, verify, match, route, track, and improve business opportunities
- Preserve Core Lead Rights without payment gates
- Keep AI assistive; humans control commercial and disciplinary outcomes
- Explicitly exclude legacy monetisation (₹500 fee, escrow, forfeiture, Rainmaker commercial revival, automatic success fee)

Future paid / Pro / Managed Opportunity stages may exist in architecture as **feature-flagged inactive** until separate Founder activation (FD-031 / FD-039 / ADR-013).

---

## Scope

### In scope (Stage 1 unpaid)

- Lead creation and identity of parties (Giver / Receiver — not collapsed into “Lead Owner”)
- Category and Business Tags context for eligibility / Protected Tag Scope awareness
- Circle-first routing hierarchy
- Cross-Circle routing where approved
- Cross-vertical escalation (Marketplace / Enterprise) where approved — without inventing commission from lead submit alone
- GCE Lead Intelligence and Opportunity Desk human review
- Matching / shortlisting (assistive)
- Lead quality and assignment status lifecycle (`SM_Lead_Assist`)
- Acceptance / rejection / clarify / no-response / reassignment
- Contact reveal controls (consent / privacy gated)
- Audit of submissions, routing, overrides, disputes
- Notifications concepts (channels Pending Technical Design — see Phase 12)

### Not in scope (explicit launch exclusions)

| Item | Status |
|------|--------|
| Legacy **₹500** Lead Assist validation fee | **Inactive** — do not implement (FD-031 / FD-032 / FD-039) |
| Escrow / forfeiture / voucher / subscription credit monetisation | **Inactive** |
| Rainmaker-only commercial revival as live Stage 1 law | **Inactive / superseded** (FD-032) |
| Automatic success fee | **Not Stage 1** — no automatic success fee (FD-031 / FD-029) |
| Paid Lead Assist / Pro / Expert Selection / Managed Opportunity commercial SKUs | Future — **feature-flagged inactive** |
| AI independently awarding contracts, moving money, approving refunds/settlement, permanently altering Trust Rank, granting Core Tier, or deciding serious disputes | **Forbidden** |
| Inventing scoring weights, exclusivity rules, or automatic Trust Rank penalties | **Forbidden** |
| Partner lead-ingest API programme as live launch product | Inactive (FD-039) |

---

## Dependencies

| Dependency | Why |
|------------|-----|
| FD-031 / FD-032 / FD-039 | Stage 1 boundaries and inactive commercial items |
| Circle architecture FD-024 / FD-030 | Circle-first routing and Dual-Confirmed Closed Business |
| Membership / Tags FD-027 | Eligibility without merging Lead Assist into membership SKU |
| FD-035 Opportunity Desk roles | Human review staffing model |
| SM_Lead_Assist | Lifecycle SoT |
| Phase 12 notifications / audit | Delivery and immutable history |
| ADR-013 | Keep future stages off |

---

## Entry criteria

- FD-031 indexed as highest Lead Assist authority; living `39_AI_Lead_Assist_Spec.md` defers to it
- SM_Lead_Assist documented for Stage 1 unpaid
- Opportunity Desk role family present in taxonomy (FD-035)
- Feature flags defined for paid / escrow / success-fee surfaces (default off in pilot/prod)
- Consent / privacy principles acknowledged (exact retention Pending — Phase 12)

---

## Exit criteria

- Stage 1 user journeys documented: create → verify → route → offer → accept/decline → follow-up → close / dispute
- Explicit “no payment gate on Core Lead Rights” checklist passed in UAT scripts (Phase 14)
- Contact reveal requires consent/privacy checks in documented controls
- Audit event list mapped to SM_Lead_Assist
- Future stages listed as inactive with flag names
- No documentation or test fixtures that treat ₹500 / escrow / automatic success fee as live

---

## Stage 1 product definition

**GCE Connect AI Lead Assist** is a platform-controlled opportunity-assistance system.

It is **not**: a guaranteed lead-selling service; an autonomous contract-awarding system; a substitute for human judgment; a hidden pay-to-win router; a credit-rating system; a replacement for Circle relationship-building; or a right to buy another member’s protected opportunity.

**No guarantee:** sale, contract, conversion, payment, customer response, referral, revenue, or business success.

### Monetisation principle (FD-031)

GCE monetises additional intelligence, verification, expert selection, coordination, analytics, and execution support — **not** the basic right to give or receive an ordinary lead.

Stage 1 launch = unpaid foundations only (FD-039 Part I / Part J).

---

## Parties (do not collapse)

| Role | Meaning |
|------|---------|
| **Lead Giver** | Source of the opportunity / referral |
| **Lead Receiver** | Eligible stakeholder offered the opportunity |
| **Customer / requirement source** | Where applicable — consent subject |
| **Opportunity Desk** | Human verification, matching, dispute, escalation support |
| **AI Lead Intelligence Engine** | Assistive classify / match / route / flag |

Preserve original-source attribution. Do not invent a single “Lead Owner” that erases giver/receiver distinction.

---

## Lead creation

Minimum documented fields (logical — schemas Pending Technical Design):

- Giver identity / Circle context where applicable
- Category / sector
- Related Business Tags (eligibility / Protected Tag Scope awareness)
- Requirement summary
- Urgency / preferred geography (as product allows)
- Consent / source markers
- Quality state starts at **Unverified Lead** (`SM_Lead_Assist`)

Hard rules:

- Ordinary referrals are **not** payment-gated
- Do not withhold ordinary valid Circle referrals pending premium purchase
- Do not require Lead Assist Pro (inactive) to exercise Core Lead Rights

---

## Category, Tags & eligibility

- Routing and matching must respect approved taxonomy and Business Tag / Specialization rules (FD-030 / FD-031)
- Protected Tag Scope: do not invent exclusivity weights here
- Invalid / out-of-scope category → human review or reject path — not silent drop without audit

---

## Routing hierarchy

### Circle-first

Where applicable, prefer eligible receivers in the giver’s primary Circle before broader network — Circle relationship-building remains primary (FD-031 / FD-030).

### Cross-Circle

Allowed only under approved rules (capacity, category fit, consent, restrictions). Document reassignment and audit; do not invent nationwide guarantees.

### Cross-vertical escalation (where approved)

Opportunity Desk / rules may escalate into GCE Marketplace or GCE Enterprise intake when appropriate.

**Hard boundaries:**

- Lead submit alone does **not** create Marketplace or Enterprise commission
- Escalation does not auto-apply 80/10/10 or Enterprise platform commission
- Enterprise / Marketplace commercial rules remain owned by their FDs (FD-037 / FD-038)

---

## Opportunity Desk & human review

Approved name: **GCE Lead Intelligence and Opportunity Desk**.

**May:** verify requirements; clarify leads; prepare briefs; recommend classifications; prepare shortlists; review low-confidence AI output; coordinate discussions; recommend collaboration; escalate verticals; review duplicate / fraud / privacy / routing / attribution disputes.

**May not:** secretly favour members; sell customer data; accept contracts for members; set member pricing; guarantee provider performance; override taxonomy without authority; approve own commercial exception; receive undisclosed benefit from selected providers; own leads as a franchise layer.

**Human review mandatory** for: low-confidence, high-value, regulated, privacy-sensitive, fraud-flagged, disputed, Enterprise-escalation, or restriction cases (FD-031).

Legacy PRM language may map to desk operational support pending role migration — PRM is not Lead Owner and does not receive hidden commission.

---

## Matching, status, acceptance / rejection

### Assistive matching

AI may recommend ranked shortlists. Humans / receivers decide. No pay-to-win priority queue at Stage 1.

### Status lifecycle

Align to `SM_Lead_Assist`:

- Quality: Unverified → Preliminarily Verified → Qualified / Rejected
- Working: Classified → Routed → Offered → Accepted / Declined / No Response → In Follow-Up → Closed (Dual Confirmed / Unconverted) / Reassigned / Disputed

### Acceptance & rejection

- Receivers may Accept, Decline, Clarify, report Duplicate / Invalid, request Collaborate
- Valid decline does **not** automatically reduce Trust Rank (FD-031)
- No-response: reminder → possible routing priority reduction → possible temporary restriction for persistent abuse — **do not invent fixed Trust Rank penalties**
- Reassignment under approved Desk / Ops rules with audit

### Dual-Confirmed Closed Business

Where claimed, follow FD-030 / FD-031 confirmation rules. Closed business claims are not automatic commission events for Lead Assist Stage 1.

---

## Contact reveal controls

Contact / PII reveal must be gated by:

- Consent and purpose limitation
- Receiver acceptance / authorised Desk workflow as product defines
- Least-privilege RBAC (FD-023)
- Audit of reveal events (who, when, lead id, lawful basis / consent ref)

Do not expose customer contact by default to the entire Circle. Exact retention of contact artefacts: **PENDING PRIVACY VALIDATION** (Phase 12).

---

## Trust Rank interaction (launch)

- AI Lead Assist does **not** directly alter Customer Trust Rank at launch (FD-031)
- Any future Trust Rank interaction requires separate Founder approval
- Do not implement automatic Stage 1 Trust Rank penalties for valid declines

---

## Audit requirements

Minimum event families (see `SM_Lead_Assist`):

`lead.submitted`, `lead.verified`, `lead.qualified`, `lead.rejected`, `lead.classified`, `lead.routed`, `lead.offered`, `lead.accepted`, `lead.declined`, `lead.no_response`, `lead.reassigned`, `lead.closed`, `lead.disputed`, plus contact reveal and human-override events.

Preserve assignment history. No hard-delete of lead/assignment history except approved legal privacy workflow (FD-031 / ADR-010).

Stage 1 audit must **not** invent monetisation fields that imply ₹500 / escrow / success fee collection.

---

## Future stages (inactive)

Document for architecture awareness; **feature-flagged inactive** (ADR-013 / FD-039):

- Paid Lead Assist / Pro tools
- Expert Selection commercial SKU
- Managed Opportunity commercial SKU
- Any success-fee model
- Escrow / forfeiture mechanics
- Advertising-influenced routing (forbidden to affect organic integrity even if ads activate later)

Flag flips alone cannot override Founder inactivity.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Reintroducing ₹500 / escrow as “temporary” | FD-032 / FD-039 + code/docs gates + flags |
| Pay-to-win routing | Core Lead Rights + audit + Desk ethics |
| AI auto-finalising commercial outcomes | Human-control principle |
| Collapsing giver/receiver | Party model + attribution fields |
| Cross-vertical commission leakage | Explicit non-earning on lead submit; FD-029/037/038 |
| Privacy oversharing on contact reveal | Consent gates + audit + Phase 12 retention |

---

## Unresolved

- Exact notification channel copy and operating-hours SLAs (FD-031 concepts exist; schedules Pending Technical Design)
- Exact data-retention and model-training policy — Pending Legal / Privacy
- Exact matching score weights / exclusivity rules — do not invent
- Optional Pro / verification / Expert Selection / Managed Opportunity **prices** — Unresolved
- Any future success-fee model — Unresolved / inactive
- Exact schema / RLS — Pending Technical Design (ADR-004 / ADR-005)

---

## Related documents

- FD-031, FD-032, FD-039, FD-029, FD-028, FD-030, FD-035, FD-023
- `SM_Lead_Assist`
- `39_AI_Lead_Assist_Spec.md`
- Phase 9 (no Lead Assist auto commission), Phase 12 (notifications/audit/privacy), Phase 13 (Desk / dispute ops), Phase 14 (permission & state-machine tests)
