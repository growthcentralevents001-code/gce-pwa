# AI Lead Assist Spec (Canonical)

## Authority

**Highest authority for AI Lead Assist / Lead Intelligence architecture:**
`docs/founder-decisions/FD-031_GCE_Connect_AI_Lead_Assist_Architecture.md`

**Related Founder Decisions:**

- Revenue recognition / Lead Assist commercial classification: `FD-028`
- Commission / non-commissionable-by-default / settlement eligibility: `FD-029`
- Circle referrals, Protected Tag Scope, Dual-Confirmed Closed Business: `FD-030`
- Enterprise project / vendor selection: `FD-026`
- RBAC: `FD-023`
- Wallet / settlement principles: `FD-020` / `FD-021`
- Membership commercial (Lead Assist is separate from base membership): `FD-027`

This document is the living **canonical core** summary of Lead Assist. Where it conflicts with FD-031, **FD-031 wins**. Do not invent Unresolved prices, commissions, escrow, forfeiture, voucher/credit, routing weights, exclusivity rules, retention periods, schemas, APIs, or RLS.

Narrative partner: `10_AI_Lead_Assist.md` (must defer here and to FD-031).
Broader AI modules: `22_AI_Rules.md` (Lead Assist sections must defer here; do not restate obsolete ₹500 / Rainmaker-only rules as active).
Commercial constants: `36_Commercial_Constants.md`.
Circle context: `38_Circle_Architecture.md`.
Roles: `35_Role_Taxonomy.md`.

Always use vertical names **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.

---

## Definition

**GCE Connect AI Lead Assist** is a platform-controlled opportunity-assistance system that helps classify, verify, match, route, track, coordinate, and improve business opportunities among eligible GCE stakeholders.

It is **not**:

- A guaranteed lead-selling or revenue service
- An autonomous contract-awarding system
- A substitute for human judgment
- A hidden pay-to-win routing engine
- A credit-rating system
- A replacement for Circle relationship-building
- A right to buy another member’s protected opportunity

**No guarantee:** AI Lead Assist does not guarantee sale, contract, conversion, payment, customer response, referral, revenue, or business success.

---

## Central architecture

GCE operates **one central GCE Lead Intelligence Engine** with vertical-specific routing, verification, commercial, fulfilment, commission, and settlement rules.

The shared intelligence layer may support:

- GCE Connect
- GCE Connect Networking
- GCE Connect Offer Events
- Future GCE Connect Marketing
- Future GCE Connect Travel
- GCE Marketplace
- GCE Enterprise
- Future approved GCE sub-verticals

Do **not** describe Lead Assist as Connect-only where architecture is cross-vertical. Each vertical retains its own approved commercial and operating rules (FD-026 / FD-028 / FD-029 / FD-030 as applicable).

---

## Human-control principle

AI **may**: recommend, classify, match, rank, route, flag, detect possible duplicates/fraud signals, support shortlisting, support analytics.

AI **may not** independently: accept a contract; set member pricing; award a project; transfer money; approve refunds; release settlement; suspend or terminate membership; permanently change Trust Rank; grant or deny Core Tier; resolve serious disputes; determine legal liability; override taxonomy without authority.

Final commercial and disciplinary decisions remain **human-controlled**.

---

## GCE Lead Intelligence and Opportunity Desk

Approved name: **GCE Lead Intelligence and Opportunity Desk**.

May include: Lead Verification Experts, Business Matching Experts, Sector Specialists, Opportunity Coordinators, Data and AI Analysts, Compliance and Privacy Reviewers, Customer Requirement Specialists, Lead Dispute and Attribution Reviewers.

The team is retained/employed/directly controlled by GCE; **not** an independent franchise layer; **not** an owner of leads; subject to RBAC, confidentiality, conflict-of-interest controls, and audit. Prohibited from receiving hidden personal commission from selected members.

**May:** verify requirements; clarify leads; prepare briefs; recommend classifications; prepare shortlists; review low-confidence AI output; coordinate customer discussions; recommend collaboration; escalate to Marketplace or Enterprise; review duplicate/fraud/privacy/routing/attribution disputes; support Managed Opportunities.

**May not:** secretly favour members; sell customer data; accept contracts for members; set member pricing; guarantee provider performance; override taxonomy without authority; approve their own commercial exception; receive undisclosed benefit from selected providers.

Legacy **PRM** language in older docs may map to desk operational support pending role migration — PRM is not Lead Owner and does not receive hidden commission.

---

## Protected Core Lead Rights

Must not require purchase of Lead Assist Pro, advertising, sponsorship, premium visibility, workshops, Expert Selection, or Managed Opportunity:

- Giving a genuine referral
- Receiving an ordinary eligible referral
- Original-source attribution
- Accepting or declining
- Asking for clarification
- Reporting duplicate / invalid
- Requesting collaboration
- Recording follow-up
- Participating in Dual-Confirmed Closed Business
- Viewing basic status
- Raising a dispute
- Receiving fair eligibility-based routing

**Monetisation principle:** GCE monetises additional intelligence, verification, expert selection, coordination, analytics, and execution support — **not** the basic right to give or receive an ordinary lead.

Do **not** charge merely to view or receive an ordinary valid Circle referral. Do **not** withhold ordinary leads until premium purchase.

---

## Parties (do not collapse into “Lead Owner”)

Distinguish:

| Role | Meaning |
|------|---------|
| **Lead Source** | Origin channel / system source |
| **Lead Giver** | Stakeholder who submitted / referred the opportunity |
| **Lead Verifier** | Desk / system verification actor |
| **Lead Receiver** | Offered / assigned eligible stakeholder |
| **Selected Provider** | Provider chosen by customer or process |
| **Lead Closer** | Party that closed the business (where applicable) |
| **Collaborator** | Multi-member collaboration participant |
| **Commercial Beneficiary** | Party entitled under approved commercial rules |

Lead submission does **not** automatically create commission (FD-028 / FD-029).

### Lead Giver rights

Original source preservation; submission timestamp; attribution history; no silent replacement; no deletion of assignment history; free dispute access; protection from paid services transferring credit; Dual-Confirmed Closed Business recognition; privacy controls.

### Lead Receiver rights

Fair and explainable routing; no hidden paid priority; clear lead-quality status and deadline; Accept / Decline / Clarify / Duplicate / Invalid / Collaborate; no charge merely to receive an ordinary valid Circle referral; no retroactive or undisclosed success fee; human review for incorrect AI routing; customer-consent checks; reassignment history; valid decline without automatic Trust Rank penalty.

### Customer rights

Consent or lawful basis before sharing; purpose limitation; limited recipient access; withdrawal rights; no bulk marketing without consent; **no sale of personal data**; provider choice; human review for sensitive/high-value cases; transparent disclosure of paid services; complaint access; retention controls; no repeated unauthorised contact after withdrawal.

### Other boundaries

- **Governing Body** does not privately allocate leads or override fair routing.
- **Connect BDP** does **not** automatically earn 20% (or any rate) on Lead Assist revenue; Lead Assist is not automatically Connect BDP commissionable (FD-025 / FD-029 / FD-031).
- Advertising / sponsorship / premium visibility must **not** buy routing priority.

---

## Lead sources

May include: Circle member referrals; platform enquiries; Marketplace enquiries; Enterprise enquiries; event-generated leads; Venue Partner enquiries; visitor enquiries; member-submitted opportunities; approved campaign responses; platform forms; future approved integrations.

Every lead must preserve the **original source**. No silent overwrite.

Lead records should preserve: original source, source stakeholder, Lead Giver, Circle, city, vertical, date/time, consent status, requirement, Business Specialization, relevant Tags, urgency, budget range if provided, location, supporting evidence, personal-data status.

---

## Lead quality states

| State | Meaning |
|-------|---------|
| **Unverified Lead** | Submitted; not yet verified |
| **Preliminarily Verified Lead** | Early checks passed; not yet Qualified |
| **Qualified Lead** | Meets qualification conditions |
| **Rejected / Invalid Lead** | Invalid, rejected, or not eligible to proceed |

Do **not** describe every submitted lead as verified. Only Qualified leads (after required checks) enter distribution under approved rules.

### Qualification conditions (summary)

Genuine requirement; valid contact permission; sufficiently complete information; permitted category; identifiable location where relevant; not a known duplicate; not closed/expired/withdrawn; submitter has authority or valid basis; no obvious privacy/policy conflict.

Human review required for: high-value, regulated, privacy-sensitive, disputed, fraud-flagged, and low-confidence leads.

### Verification methods

May use: OTP; phone/email confirmation; platform identity; member/customer confirmation; requirement document; appointment confirmation; human call; duplicate/fraud screening; historical behaviour signals; Enterprise project verification.

No single automated signal is absolute proof.

---

## AI classification

AI may identify: GCE vertical; Business Specialization; relevant Tags; GC Power Sector; geography; budget category; urgency; complexity; required licences; single- vs multi-provider need; Connect / Marketplace / Enterprise / future sub-vertical destination.

Low-confidence output requires **Human Review**.

---

## Routing

### Eligibility-first hierarchy

1. Regulatory and eligibility checks
2. Correct vertical
3. Business Specialization
4. Protected Tag Scope
5. Relevant Tags
6. Geography
7. Availability
8. Capacity
9. Response performance
10. Referral relevance
11. Duplicate and conflict checks
12. Customer preference
13. Human review where required

Paid products must **not** override these factors.

### Circle-First Routing (ordinary local Connect)

1. Eligible member in source Circle
2. Eligible member in nearby active Circle
3. Eligible member in same city
4. Eligible member in another city where appropriate
5. Marketplace or Enterprise where the lead belongs elsewhere

Circle-first does **not** mean automatic permanent exclusivity. Marketplace/Enterprise escalation must preserve original Lead Giver attribution.

### Assignment types

A lead may be: **Exclusive** · **Limited Distribution** · **Open Distribution** · **Multi-Member Collaboration** · **Enterprise-Managed**.

No automatic exclusivity without an approved rule. Exact exclusivity rules: **Unresolved**.

### Member eligibility

Active membership; current business verification; relevant Specialization or Tag active; required licence valid; no serious compliance hold; not suspended; geography serviceable; capacity available; lead rules accepted; no serious misuse pattern. Advertising payment alone does **not** create eligibility.

---

## Response deadlines (recommended)

| Urgency | Initial response deadline |
|---------|---------------------------|
| Urgent | 2 hours |
| High Priority | 6 hours |
| Standard | 24 hours |
| Low Urgency | 48 hours |

Exact operating-hour treatment: **Unresolved**.

### Member actions

**Accept** · **Decline** · **Ask for Clarification** · **Report Duplicate** · **Report Invalid** · **Request Collaboration**

Acceptance means responsible follow-up — not guaranteed sale, permanent customer ownership, automatic contract, or permission to misuse data.

Valid decline may include: outside Specialization/area; no capacity; budget mismatch; duplicate; invalid contact; conflict; licence limitation; already serving customer; other valid reason. Valid decline does **not** automatically reduce Trust Rank.

### No-response treatment (recommended)

First missed response → reminder; repeated → routing priority may reduce; persistent → temporary restriction may apply; serious pattern → performance review. Do **not** invent automatic fixed Trust Rank penalties.

---

## Duplicate detection and reassignment

Possible duplicate checks: contact details, requirement text, business identity, location, time proximity, source, project reference, customer confirmation.

Outcomes: Confirmed Duplicate · Possible Duplicate · Related but Distinct · Separate Project. High similarity alone does **not** automatically reject the lead.

Reassignment may occur on decline, deadline expiry, unavailability, ineligibility, customer request, conflict, collaboration need, or incorrect routing. **Earlier assignment history must remain preserved.** Paid Expert Selection must not transfer Lead Giver credit.

---

## Collaboration leads

Support: Lead Coordinator; participating members; defined scopes; customer consent; restricted data access; collaboration acceptance; outcome attribution; dispute handling.

No commission or commercial split inferred without separate Founder approval.

---

## Lead lifecycle states

Architecture should support: Draft · Submitted · Verification Pending · Preliminarily Verified · Qualified · Routing Pending · Offered · Accepted · Clarification Required · Declined · Reassigned · In Contact · Proposal Shared · Negotiation · Won · Lost · Expired · Withdrawn · Disputed · Invalid · Closed.

Not every vertical must use every state. Exact enums: **Pending Technical Design**.

Follow-up may track: first response, customer contact, clarification, meeting, proposal, negotiation, outcome, reason lost, completion, complaint, Dual-Confirmed Closed Business. Minimise confidential commercial information.

---

## Privacy, consent, and AI data use

Capture: consent source, date, scope, sharing purpose, permitted recipients, withdrawal status, retention basis.

Recipients must not: export for unrelated marketing; add to bulk messaging without consent; sell or share leads; contact repeatedly after withdrawal; use data outside approved purpose; upload to unrelated systems without authority.

Lead data may be processed only for approved purposes (classification, routing, fraud detection, assistance, analytics, service improvement). Exact retention and AI model-training rules: **Pending Privacy Review / Unresolved** — do not invent.

No hard deletion of lead-impacting records except through an approved legal privacy workflow.

---

## Fraud, disputes, and human review

Fraud signals may include: fake contacts; repeated duplicates; self-created leads; circular referrals; artificial conversion reporting; impersonation; paid lead reselling; manipulated values; unauthorised data harvesting; false rejection claims; coordinated routing abuse. AI may flag; serious action requires **Human Review**.

### Dispute workflow

1. Submitted → 2. Hold → 3. Evidence → 4. Parties notified → 5. Response opportunity → 6. Human review → 7. Decision and reason → 8. Routing/attribution corrected → 9. Appeal where permitted → 10. Audit preserved.

AI does **not** issue final serious-dispute decisions.

### Mandatory human review

Required where: AI confidence low; lead value high; regulated; privacy concern; fraud signal; multiple priority claims; customer disputes routing; classification challenged; Enterprise escalation possible; restriction or suspension proposed.

---

## Trust Rank and Core Tier

- AI Lead Assist does **not** directly alter Customer Trust Rank at launch.
- Business lead behaviour should use a separate **Lead Responsiveness and Quality Profile**.
- Any future Trust Rank interaction requires separate Founder approval.
- Lead Assist performance may become a future supporting Core Tier indicator — it may **not** independently grant or deny Core Tier. Exact thresholds: **Unresolved**.

---

## Paid priority prohibition

Paying for advertising, sponsorship, premium visibility, workshops, Lead Assist Pro, Expert Selection, or Managed Opportunity must **not** buy hidden priority or override: eligibility, Business Specialization, Protected Tag Scope, geography, compliance, customer preference, or fair-routing rules.

---

## Cross-vertical use (summary)

| Vertical / surface | Lead Assist role |
|--------------------|------------------|
| GCE Connect | Member referrals; Circle-first; cross-Circle/city; collaboration; Dual-Confirmed Closed Business |
| GCE Connect Networking | Meeting referrals; follow-up; visitor enquiries; reminders |
| GCE Connect Offer Events | Demand ID; group-buying; Offer Event opportunities |
| Future Marketing / Travel | Campaign/travel matching under future Founder rules |
| GCE Marketplace | Venue/event/offer enquiries; preserve Marketplace attribution |
| GCE Enterprise | High-value / multi-city / multi-vendor; FD-026 remains authoritative for project/vendor treatment |

Do not invent commercial rules outside the relevant Founder Decisions.

---

## Monetisation product levels

### Level 1 — Core Lead Rights (protected / included)

Lead giving; ordinary eligible lead receipt; basic classification and routing; accept/decline/clarify; basic tracking; attribution; dispute access.

### Level 2 — Lead Assist Pro (optional)

Advanced pipeline; team access; smart reminders; response templates; capacity management; conversion analytics; lead-quality insights; advanced reports. **Price: Unresolved.**

### Level 3 — Expert-managed services (optional)

- **GCE Expert-Assisted Lead Selection** — verification, requirement brief, eligibility screening, AI match, human review, customer preference, selection, tracking.
- **GCE Managed Opportunity Service** — documentation, shortlisting, proposal/meeting coordination, comparison, follow-up, milestones, collaboration, outcome/dispute coordination.
- Collaboration coordination; customer-side provider selection; institutional lead processing; Enterprise escalation support; Marketplace conversion support.

Exact fees: **Unresolved**. Success-fee model: **Future Founder Decision / Stage 4**.

### Approved monetisation categories in principle

Lead Assist Pro subscription; verification fee; Expert Selection fee; Managed Opportunity fee; collaboration-coordination fee; customer-side selection fee; analytics subscription; institutional processing fee; API/integration fee; cross-vertical Enterprise and Marketplace services.

### Prohibited monetisation

- Paying to bypass Specialization or override Protected Tag Scope
- Paying to suppress competitors or buy hidden routing priority
- Paying to alter Trust Rank or obtain Core Tier
- Selling customer data
- Charging for dispute access
- Charging to record a genuine Circle referral or merely to view an ordinary valid referral
- Withholding ordinary leads until premium purchase
- Selling one exclusive lead to multiple members without disclosure
- Retroactive fees or hidden deductions

Historical narrative ₹500 validation fee / escrow / forfeiture / voucher / subscription credit is **not active** under FD-031. Do not implement as live commercial rules.

---

## UX, explainability, dashboards, notifications

Lead Receiver should see: requirement, match reason, location, urgency, lead-quality status, response deadline, consent status, assignment type — plus the six simple actions above.

Guided submission questions: what / where / when / budget / one vs multiple providers / permission to share contact / urgency / required licence. Progressive support for English, Hindi, Hinglish-friendly input, regional languages, voice, and human-help option may be provided.

Explainability: practical reasons (Specialization, Tag, location, availability, licence, capacity, customer preference). Exact proprietary scoring weights need not be disclosed if disclosure enables manipulation.

### Member dashboard (may include)

New Leads · Verification Pending · Offered · Response Due · Accepted · Clarification Required · In Contact · Proposal Shared · Won · Lost · Reassigned · Disputed · Invalid · Expired · Closed.

### Platform dashboard (may track)

Submitted / verification / qualification / duplicate / invalid rates; routing and response times; acceptance / reassignment / conversion; complaints; privacy incidents; fraud flags; source/Circle/Specialization/Tag/city demand; human-review queue.

### Notifications (examples)

Lead received; deadline approaching; clarification; accepted/declined/reassigned; customer withdrew; disputed; human review required; expired; outcome update due; privacy/compliance warning. Avoid spam.

Exact notification/dashboard implementation: **Pending Technical Design**.

---

## AI confidence, override, and audit

Every AI-supported decision should preserve: confidence level; model or rule version; input source; human-review status; final classification; override reason; override authority.

Every manual override must record: previous recommendation; new decision; reason; actor; timestamp; evidence; rule or model version.

Low-confidence output must **not** silently become final.

Lead-impacting actions should preserve: actor, timestamp, lead ID, source, consent, classification, Specialization/Tags, routing recommendation, assigned member, accept/decline, response time, reassignment, human override, dispute, outcome, closure, rule version, AI model version where applicable.

---

## Phased launch

| Stage | Scope |
|-------|--------|
| **1** | Core Lead Rights; basic AI classification/routing; expert team; basic verification; human review; basic tracking; no hidden paid priority; no automatic success fee |
| **2** | Lead Assist Pro; enhanced verification; customer-side Expert Selection; advanced analytics |
| **3** | Managed Opportunity; collaboration coordination; high-value opportunity management; deeper Marketplace/Enterprise conversion |
| **4** | Subject to separate approval: success-linked fees; institutional partnerships; API services; advanced analytics products |

---

## Unresolved (do not invent)

From FD-031 §92, including: Lead Assist Pro / verification / Expert Selection / Managed Opportunity / collaboration / customer-side / analytics / institutional / API prices; success-fee and Lead Assist commission models; refund/escrow/forfeiture/voucher/subscription-credit treatment; lead-capacity thresholds; routing weights; exclusivity rules; operating-hours deadlines; appeal timelines; data-retention; AI model-training policy; prohibited-data matrix; DB enums/schemas; APIs; Supabase RLS; notification/dashboard implementation; legal disclaimers; institutional integration terms.

---

## Legacy terminology

Older docs may still say: Validation Fee, Rainmaker Selection, Pass Lead, Deficit Reward, subscription credit, forfeiture. Treat these as **legacy / obsolete as active Stage-1 rules** unless a later Founder Decision reactivates specific commercial terms. Prefer FD-031 terminology above.

---

## Cross references

- FD-031 (highest for Lead Assist / Lead Intelligence)
- FD-028 / FD-029 (recognition and commission)
- FD-030 (Circle referrals / Dual-Confirmed Closed Business)
- FD-026 (Enterprise project treatment)
- `10_AI_Lead_Assist.md`
- `36_Commercial_Constants.md`
- `38_Circle_Architecture.md`
- `35_Role_Taxonomy.md`
- `14_Business_Rules.md`
- `.cursor/rules/07_AI_Rules.mdc`
