# Phase 15 — Legal, Tax, Privacy & Production Readiness

**Document ID:** PHASE-15  
**Title:** Legal, Tax, Privacy & Production Readiness  
**Status:** Working Draft — Documentation / Checklists / Matrices  
**Authority Level:** Phase documentation subordinate to Founder Decisions  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Authority:** [FD-039 — GCE Phase 2 Commercial Acceptance and Compliance Direction](../founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md)  
**Related Authority:** FD-001, FD-020, FD-021, FD-025, FD-026, FD-028, FD-029, FD-033, FD-034, FD-035, FD-036, FD-037, FD-038  
**Companion Register:** [Applicable Law & Compliance Register](../compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md)

---

## Authority

1. **FD-039** is the highest business authority for Phase 15 commercial acceptance, Merchant-of-Record (MoR) direction, BDP legal packaging, cancellation cutoff direction, BDP pack payment collection, KYC/Aadhaar posture, AI-assisted legal drafting, Applicable Law & Compliance Register requirement, pilot-city timing, and production compliance gates.
2. This document prepares **drafts, checklists, and matrices**. It does **not** invent GST rates, TDS rates/sections, RBI/payment-aggregator classification, enforceability conclusions, refund percentages, retention periods, liability caps, or jurisdiction outcomes.
3. Per FD-039 Part D: AI is the primary **first-draft** legal/compliance drafting assistant. AI drafts are **working documents**, not production-final, and must undergo final Legal/Tax/Privacy/Finance/Payment professional validation before publication or contractual reliance.
4. Per FD-039 Part M / §33: unresolved compliance items may block **money go-live**, final contract publication, and production reliance — but must **not** automatically block Technical Architecture, schema design, ADRs, mock integrations, or non-production development unless the unresolved item changes the technical model itself.
5. Professional validation must not silently rewrite Founder-approved business rules. Genuine prohibition or material conflict → escalate to Founder (FD-039 §2).

**PENDING PROFESSIONAL VALIDATION** markers appear wherever rates, classifications, clause language, or legal conclusions would otherwise be asserted.

---

## Purpose

Phase 15 exists to:

- Convert FD-039 compliance workstream priorities into an executable readiness programme.
- Produce first-draft legal pack inventories and review matrices for Marketplace MoR, BDP packs, Venue Partners, Enterprise Clients, Vendors, consumers, and privacy/KYC.
- Separate **architecture-allowed progress** from **money-movement go-live gates**.
- Feed the Applicable Law & Compliance Register and later Phase 16–18 launch controls.

---

## Scope

In scope for Phase 15 documentation and readiness preparation:

| Workstream | Phase 15 deliverable type |
|---|---|
| Marketplace ticket MoR (Logixia intended) | Validation matrix + review checklist |
| Invoicing / GST / TDS / settlement / PSP | Review checklist (**PENDING PROFESSIONAL VALIDATION**) |
| BDP legal pack (Commercial Licence / IBP) | Draft inventory + clause checklist |
| Venue Partner terms | Draft inventory + checklist |
| Enterprise Client agreement | Draft inventory + checklist |
| Vendor terms | Draft inventory + checklist |
| Platform Terms of Use (ToU) | First-draft inventory |
| Membership terms | First-draft inventory |
| Cancellation / refund | Cutoff direction + open refund items |
| Privacy / consent / PII / retention | Policy draft inventory + gaps |
| KYC / Aadhaar posture | Posture checklist (Aadhaar not mandatory by default) |
| Incident response (legal/privacy) | Checklist |
| Legal notices / IP / confidentiality | Clause inventory |
| Dispute resolution / liability | Open items (**PENDING PROFESSIONAL VALIDATION**) |
| Consumer protection / e-commerce / dark patterns | Review matrix |
| Go-live legal checklist | Gate checklist |

---

## Not in scope

- Exact GST rates, place-of-supply logic, or invoice templates as final law.
- Exact TDS sections/rates.
- Exact RBI / payment-aggregator / payment-system classification of Logixia or any PSP.
- Exact refund percentages, timelines, chargeback rules, convenience-fee tax treatment.
- Exact Aadhaar handling implementation, KYC retention periods, consent wording as final.
- Exact contract clauses, jurisdiction, forum, liability caps as final.
- Pilot city selection (intentionally undecided — FD-039 Part K; see Phase 16).
- Activation of FD-039 Part J inactive / future products.
- Production code, SQL, schema, or live money movement.

---

## Dependencies

| Dependency | Why required |
|---|---|
| FD-039 | MoR, BDP legal model, AI drafting, register, gates, cancellation, KYC |
| FD-034 | Logixia / GCE corporate constitution |
| FD-020 / FD-021 / FD-028 / FD-029 | Wallet, settlement, revenue recognition, commissions |
| FD-025 / FD-033 / FD-026 | Connect / Marketplace / Enterprise BDP commercial models |
| FD-036 / FD-037 / FD-038 | Membership attribution, Marketplace transactions, Enterprise rules |
| Applicable Law & Compliance Register | Mandatory mapping (FD-039 Part E) |
| Technical ADRs (payment, refund, KYC state machines) | Architecture may proceed in parallel (FD-039 §33, §38) |
| Professional counsel / CA / privacy / PSP specialists | Layer 2 validation (FD-039 §2) |

---

## Entry criteria

- FD-039 Founder Approved.
- Phase 2 commercial spine acknowledged (FD-039 Part I).
- Compliance workstream opened in parallel with Technical Architecture (FD-039 §39).
- Razorpay acknowledged only as **India-launch PSP candidate**, not legally mandatory (FD-039 §30–§31).

---

## Exit criteria

Phase 15 exits when **all** of the following are true, or remaining blockers are expressly accepted as Phase 16/17 gates:

1. First-draft inventories exist for all instruments listed in Scope.
2. Applicable Law & Compliance Register is populated for the FD-039-required applicability areas (at least Status = Pending Validation or In Progress for each row).
3. MoR / GST / TDS / settlement / PSP validation matrix is complete as a **review artefact** (values remain PENDING PROFESSIONAL VALIDATION until specialists sign off).
4. Go-live legal checklist is agreed as the money-movement gate list.
5. Explicit record that architecture may continue; money go-live remains gated.

**Exit does not mean** production-final contracts or tax filings are complete.

---

## 1. Founder-approved business direction (Layer 1) vs validation (Layer 2)

| Topic | Founder-approved direction (FD-039) | Still Layer 2 |
|---|---|---|
| Marketplace event ticket MoR | Logixia Solutions Private Limited is the **intended** MoR | GST, invoice, refund accounting, TDS, PSP config, settlement, PA applicability |
| BDP legal packaging | Commercial Licence / Independent Business Partner (IBP) drafting model | Final executed clauses; whether relationship is a legal franchise |
| “Franchise Unit” | Commercial unit/package; **not** automatically a legal franchise | Franchise-law analysis if counsel raises it |
| BDP status | Not automatic employment / partnership / agency / JV / fiduciary / authority to bind Logixia | Final agreement wording |
| Cancellation cutoff | **48 hours** before event start (default); event-specific variation if disclosed, approved, reasonable, lawful | Refund %, timelines, fees, tax reversal, chargebacks, no-shows |
| BDP pack payment | Online default; rare controlled offline bank (NEFT/RTGS/cheque/approved bank method); cash not normal | Offline SOP finalisation; bank reconciliation rules |
| Aadhaar | **Not mandatory by default**; minimise; use only if legally permitted, justified, proportionate, consented | Exact workflows, retention, edge cases |
| AI legal drafting | Primary first-draft assistant | Final validation before reliance |
| Architecture vs go-live | Architecture may proceed | Money go-live / contract publication blocked until validation |

---

## 2. Marketplace ticket MoR — intended model & validation matrix

### 2.1 Intended commercial model (FD-039 Part B)

Logixia/GCE, as intended MoR for Marketplace event tickets, is directed to:

- Collect customer ticket payment through the approved platform payment architecture.
- Record the transaction.
- Apply approved revenue and commission rules.
- Settle applicable Venue Partner and Marketplace BDP entitlements.
- Maintain the financial audit trail.

### 2.2 MoR validation matrix (production money gate)

| Validation item | Owner (proposed) | Status | Go-live gate | Notes |
|---|---|---|---|---|
| Tax treatment of ticket sale under intended MoR | Tax / CA | PENDING PROFESSIONAL VALIDATION | Y | Do not invent GST rate or place-of-supply |
| Invoice issuer / supplier presentation | Tax + Legal | PENDING PROFESSIONAL VALIDATION | Y | Supplier / platform / Venue identity on invoice |
| GST handling (collection, remittance, credit notes) | Tax / Finance | PENDING PROFESSIONAL VALIDATION | Y | Rates and logic TBD by professionals |
| Refund and credit-note treatment | Tax + Finance | PENDING PROFESSIONAL VALIDATION | Y | Separate from 48h cutoff direction |
| TDS / withholding | Tax / CA | PENDING PROFESSIONAL VALIDATION | Y | Sections/rates TBD — do not invent |
| Payment-provider configuration (Razorpay candidate) | Finance + Tech + Legal | PENDING PROFESSIONAL VALIDATION | Y | Candidate only; not legally mandatory |
| Settlement mechanics vs FD-021 / FD-029 | Finance + Ops | PENDING PROFESSIONAL VALIDATION | Y | Align with ledger / commission engines |
| Banking / payment-system / PA applicability | Legal + Banking counsel | PENDING PROFESSIONAL VALIDATION | Y | **No assumed RBI classification** |
| Conflict escalation path | Founder + Legal | Open | Y | If prohibition/material conflict → Founder |

---

## 3. Invoicing / GST / TDS / settlement / PSP review checklist

**Status:** Checklist only — **PENDING PROFESSIONAL VALIDATION** for all numeric/tax conclusions.

### 3.1 GST treatment surfaces (FD-039 §32)

Validate GST treatment on:

- [ ] Event tickets  
- [ ] Memberships  
- [ ] BDP packs  
- [ ] Enterprise invoices  

### 3.2 Invoice structure

Validate presentation of:

- [ ] Supplier identity  
- [ ] Platform identity  
- [ ] Venue identity (where relevant)  
- [ ] Tax presentation  

### 3.3 Other money-movement controls

- [ ] Payment-gateway configuration (Razorpay as candidate)  
- [ ] Refund accounting  
- [ ] TDS / withholding  
- [ ] Settlement compliance  
- [ ] Offline Admin payment controls (BDP packs)  

**Forbidden in this Phase doc:** stating specific GST %, HSN/SAC codes, TDS sections, or RBI PA conclusions.

---

## 4. BDP legal pack — Commercial Licence / IBP

### 4.1 Drafting direction (FD-039 Part C)

Working legal architecture for Connect BDP, Marketplace BDP, and Enterprise BDP:

> **Commercial Licence / Independent Business Partner model**

unless a later Founder Decision creates a different structure.

### 4.2 First-draft pack inventory

| Instrument | Verticals | Draft status | Validation |
|---|---|---|---|
| Connect BDP Agreement | GCE Connect | AI first draft allowed | PENDING PROFESSIONAL VALIDATION |
| Marketplace BDP Agreement | GCE Marketplace | AI first draft allowed | PENDING PROFESSIONAL VALIDATION |
| Enterprise BDP Agreement | GCE Enterprise | AI first draft allowed | PENDING PROFESSIONAL VALIDATION |
| Commission & settlement clauses | All BDP | Align FD-029 / FD-021 | PENDING PROFESSIONAL VALIDATION |
| Conflict-of-interest clauses | All BDP | Draft | PENDING PROFESSIONAL VALIDATION |
| IP / confidentiality / termination | All BDP | Draft | PENDING PROFESSIONAL VALIDATION |
| Offline pack payment schedule / SOP | All BDP | Ops + Legal | PENDING PROFESSIONAL VALIDATION |

### 4.3 Clause checklist (non-exhaustive)

- [ ] Commercial Licence / IBP characterisation (not automatic franchise)  
- [ ] No automatic employment / agency / partnership / JV  
- [ ] No authority to bind Logixia unless expressly granted  
- [ ] Territory / pack (“Franchise Unit” as commercial package language)  
- [ ] Fees, packs, online payment default, rare offline bank workflow  
- [ ] Attribution / commission entitlement boundaries (FD-036 / FD-037 / FD-038)  
- [ ] Suspension, termination, audit, confidentiality, IP  
- [ ] Dispute resolution — **forum/jurisdiction PENDING PROFESSIONAL VALIDATION**  
- [ ] Limitation of liability — **caps PENDING PROFESSIONAL VALIDATION**  

---

## 5. Venue Partner terms — draft inventory

| Topic | Notes | Status |
|---|---|---|
| Venue onboarding / KYC preference (PAN, GST, bank, registration — not Aadhaar-by-default) | FD-039 Part H | Draft + PENDING PROFESSIONAL VALIDATION |
| Event listing / approval hooks (FD-037) | Business rules from FD-037 | Architecture may proceed |
| Ticket MoR interaction (Logixia collects; Venue entitlement settlement) | FD-039 Part B | Money gate |
| Cancellation / refund operational duties | Cutoff 48h default; refund math open | PENDING PROFESSIONAL VALIDATION |
| IP / brand / content licence | Draft | PENDING PROFESSIONAL VALIDATION |
| Data sharing / customer PII | Privacy pack | PENDING PROFESSIONAL VALIDATION |
| Settlement / payout direction | FD-037 / FD-021 | PENDING PROFESSIONAL VALIDATION |
| Consumer-facing disclosures Venue must support | CPA / E-Commerce mapping via Register | PENDING PROFESSIONAL VALIDATION |

---

## 6. Enterprise Client agreement — draft inventory

| Topic | Notes | Status |
|---|---|---|
| Enterprise Client ≠ Enterprise BDP (FD-038) | Keep roles distinct | Draft |
| Quotation / Finance co-sign threshold (₹5,00,000 — FD-039 acceptance of prior rules) | Do not invent new thresholds here | Cite FD-038 / FD-039 |
| Vendors / milestones / componentised settlement | FD-038 | Draft alignment |
| No double commission | FD-038 / FD-029 | Draft |
| Confidentiality / IP / liability | Open caps | PENDING PROFESSIONAL VALIDATION |
| Payment / invoicing / GST on Enterprise invoices | §32 gate | PENDING PROFESSIONAL VALIDATION |

---

## 7. Vendor terms — draft inventory

| Topic | Notes | Status |
|---|---|---|
| Vendor engagement under Enterprise projects | FD-038 | Draft |
| Payment direction / milestone linkage | No invented rates | PENDING PROFESSIONAL VALIDATION |
| No Vendor self-serve portal in Phase 2 active scope | FD-039 Part J inactive | Out of active product scope |
| Confidentiality / IP / subcontracting | Draft | PENDING PROFESSIONAL VALIDATION |
| Data protection / PII handling | Privacy pack | PENDING PROFESSIONAL VALIDATION |

---

## 8. Platform Terms of Use (ToU) — first-draft inventory

AI may prepare first drafts of Platform Terms of Use / User Terms & Conditions (FD-039 §9). Required coverage checklist:

- [ ] Acceptance / eligibility  
- [ ] Account / multi-role identity (FD-035)  
- [ ] Acceptable Use Policy  
- [ ] Platform disclaimers  
- [ ] Marketplace booking terms (cross-link)  
- [ ] Membership terms (cross-link)  
- [ ] Payment / MoR description consistent with intended model  
- [ ] Cancellation / refund pointers  
- [ ] Privacy / consent pointers  
- [ ] IP / user content  
- [ ] Suspension / termination  
- [ ] Dispute resolution — PENDING PROFESSIONAL VALIDATION  
- [ ] Limitation of liability — PENDING PROFESSIONAL VALIDATION  
- [ ] Governing law — PENDING PROFESSIONAL VALIDATION  
- [ ] Required compliance notices  

**Drafts are not production-final** (FD-039 §10).

---

## 9. Membership terms — first-draft inventory

- [ ] Associate Membership commercial terms (FD-027 / FD-036)  
- [ ] Activation vs Circle allocation separation (FD-036)  
- [ ] Unattributed Connect membership allowed (FD-039 acceptance)  
- [ ] No Connect BDP commission without valid attribution  
- [ ] Fees — cite commercial constants; do not invent new fees here  
- [ ] Cancellation / refund for membership — PENDING PROFESSIONAL VALIDATION where not Founder-locked  
- [ ] Privacy / KYC for members — Aadhaar not mandatory by default  

---

## 10. Cancellation / refund

### 10.1 Locked by FD-039

- Default Marketplace event customer cancellation cutoff: **48 hours before event start**.
- Event-specific variation allowed if: customer clearly informed before purchase; variation approved; operationally reasonable; permitted by applicable law/policy.
- Platform must preserve applicable policy version per booking.

### 10.2 Explicitly not finalised by FD-039 (§16, §40)

Mark **PENDING PROFESSIONAL VALIDATION / Product-Finance policy**:

- Exact refund percentage  
- Refund processing time  
- Convenience-fee treatment  
- Tax reversal treatment  
- Chargeback handling  
- No-show treatment  

### 10.3 Consumer disclosure checklist

- [ ] Pre-purchase cancellation cutoff display  
- [ ] Event-specific variation disclosure  
- [ ] Refund policy versioning on booking  
- [ ] Dark-pattern review of cancel/refund UX (see §18)  

---

## 11. Privacy, consent, PII, retention

| Area | Direction | Status |
|---|---|---|
| Privacy Policy first draft | AI allowed (FD-039 §9) | Draft — PENDING PROFESSIONAL VALIDATION |
| Cookie / tracking disclosures | Where applicable | PENDING PROFESSIONAL VALIDATION |
| Consent wording | Exact wording open (FD-039 §40) | PENDING PROFESSIONAL VALIDATION |
| PII inventory (stakeholders: Member, BDP, Venue, Enterprise Client, Vendor, staff) | Minimise collection | In Progress |
| Retention periods | Exact periods open (FD-039 §40) | PENDING PROFESSIONAL VALIDATION |
| Cross-border transfer (if any) | Not assumed | PENDING PROFESSIONAL VALIDATION |
| Data subject request process | Operational design | PENDING PROFESSIONAL VALIDATION |

---

## 12. KYC and Aadhaar posture

### 12.1 Approved posture (FD-039 Part H)

- Data-minimisation principle.
- **Aadhaar is not mandatory by default.**
- Prefer fit-for-purpose documents: PAN, Driving Licence, Passport, business registration, GST records where applicable, company documents, bank verification, other appropriate evidence.
- Aadhaar only where legally permitted, operationally justified, privacy implications understood, proportionate, with appropriate consent/handling.
- No workflow may require Aadhaar merely for technical convenience.

### 12.2 Checklist

- [ ] Stakeholder-type KYC matrix (Member / BDP / Venue / Enterprise Client / Vendor) without Aadhaar-as-default  
- [ ] Aadhaar edge-case workflow register (FD-039 §32 item 10) — PENDING PROFESSIONAL VALIDATION  
- [ ] KYC declarations first draft  
- [ ] Retention for KYC artefacts — PENDING PROFESSIONAL VALIDATION  
- [ ] Privacy impact for any Aadhaar edge case  

---

## 13. Incident response (legal / privacy / security liaison)

Checklist (operational — not a final playbook):

- [ ] Incident severity classes (privacy breach, payment incident, fraud, ToU violation)  
- [ ] Internal owners (Legal, Privacy, Security, Ops, Founder escalation)  
- [ ] Evidence preservation / audit trail  
- [ ] Notification decision path — **legal notification duties PENDING PROFESSIONAL VALIDATION**  
- [ ] Link to Phase 16/17 operational incident response  

---

## 14. Legal notices, IP, confidentiality

| Topic | Draft status | Validation |
|---|---|---|
| Platform / website legal notices | Inventory | PENDING PROFESSIONAL VALIDATION |
| IP ownership (Logixia platform IP; partner content licences) | Draft clauses | PENDING PROFESSIONAL VALIDATION |
| User-generated content licence | Draft | PENDING PROFESSIONAL VALIDATION |
| Confidentiality (BDP / Venue / Enterprise / Vendor) | Draft | PENDING PROFESSIONAL VALIDATION |
| Trade mark / brand use of GCE / Logixia | Draft | PENDING PROFESSIONAL VALIDATION |

---

## 15. Dispute resolution and liability

**Do not invent forum, seat, or caps.**

| Item | Status |
|---|---|
| Dispute-resolution clauses (draft placeholders only) | PENDING PROFESSIONAL VALIDATION |
| Limitation-of-liability clauses | PENDING PROFESSIONAL VALIDATION |
| Consumer statutory rights interaction | Map via Compliance Register; no enforceability conclusion here |
| B2B vs B2C split in templates | Draft structure only |

---

## 16. Consumer protection and e-commerce

Map applicability through the Compliance Register (not a single DPIIT Act assumption — FD-039 §12):

- Consumer Protection Act, 2019  
- Consumer Protection (E-Commerce) Rules, 2020 + applicable amendments/advisories  
- Applicable CCPA guidance including dark-pattern guidance  
- Platform disclosures, grievance redressal, and unfair trade practice controls as counsel confirms  

All applicability cells: **PENDING PROFESSIONAL VALIDATION**.

---

## 17. Dark-pattern review checklist

Review surfaces (UX + Legal joint):

- [ ] Ticket purchase flow — price clarity, mandatory fees disclosure  
- [ ] Cancellation path discoverability vs 48h cutoff  
- [ ] Membership upsell / consent checkboxes  
- [ ] BDP pack purchase disclosures  
- [ ] Pre-ticked consents / obstruction of withdrawal  
- [ ] False urgency / scarcity claims on events  
- [ ] Privacy consent bundling  

Findings → Compliance Register + Product backlog. **No enforceability conclusion in this doc.**

---

## 18. Go-live legal checklist (money-movement gate)

Per FD-039 §32 / §33 — validate before production reliance / money go-live:

1. [ ] GST treatment (tickets, memberships, BDP packs, Enterprise invoices) — PENDING PROFESSIONAL VALIDATION  
2. [ ] Invoice structure (supplier / platform / Venue / tax presentation)  
3. [ ] Payment-gateway configuration (Razorpay candidate)  
4. [ ] Refund accounting  
5. [ ] TDS / withholding — PENDING PROFESSIONAL VALIDATION  
6. [ ] Settlement compliance  
7. [ ] Final BDP legal agreements (or Founder-approved interim with counsel sign-off)  
8. [ ] Applicable Law & Compliance Register completeness for go-live-gated rows  
9. [ ] Privacy / KYC retention — PENDING PROFESSIONAL VALIDATION  
10. [ ] Aadhaar edge-case workflows  
11. [ ] Consumer cancellation/refund disclosures  
12. [ ] Venue Partner / Enterprise Client / Vendor agreements  
13. [ ] Offline Admin payment controls  

**Architecture may proceed. Money go-live remains gated.**

---

## 19. Draft-vs-final status matrix

| Artefact | AI first draft | Production-final | Blocks architecture? | Blocks money go-live? |
|---|---|---|---|---|
| ToU / Membership / Booking terms | Allowed | Requires validation | N | Y (publication / reliance) |
| BDP Commercial Licence / IBP pack | Allowed | Requires validation | N | Y |
| Venue / Enterprise Client / Vendor | Allowed | Requires validation | N | Y |
| Privacy / consent / KYC | Allowed | Requires validation | N | Y |
| MoR tax/PSP implementation | N/A (professional) | Required | N (unless model changes) | Y |
| Cancellation cutoff 48h | Direction locked | Refund math open | N | Partial (disclosures) |
| Compliance Register | Required living doc | Continuous | N | Y for gated rows |

---

## Risks

| Risk | Mitigation |
|---|---|
| Treating AI drafts as binding | FD-039 §10; mark all drafts non-final |
| Inventing GST/TDS/RBI conclusions | Explicit bans in this doc + Register notes |
| Single “DPIIT Act” assumption | Forbidden; use Compliance Register (FD-039 §12) |
| Compliance gates blocking architecture | FD-039 §33 separation |
| Silent rewrite of MoR or BDP model | Escalate conflicts to Founder only |
| Aadhaar creep into default KYC | Explicit not-mandatory-by-default rule |
| Refund policy conflated with cutoff | Keep §16 open items separate |

---

## Unresolved

Carried from FD-039 §40 (and Phase 15 open work):

- Exact GST rates and place-of-supply logic  
- Exact invoice templates  
- Exact TDS sections/rates  
- Exact payment-aggregator / RBI classification  
- Exact refund percentages, timelines, chargebacks  
- Exact Razorpay account configuration and bank settlement timing  
- Exact Aadhaar handling implementation and KYC retention  
- Exact consent wording  
- Exact contract clauses, jurisdiction, forum, liability caps  
- Exact pilot city (Phase 16 Founder gate)  

---

## Document control

| Field | Value |
|---|---|
| Phase | 15 |
| Type | Documentation / checklists / matrices only |
| Code / SQL | None |
| Next phases | Phase 16 Pilot Launch; Phase 17 Controlled Production; Phase 18 Scale / Future |

**End of Phase 15 document**
