# Applicable Law & Compliance Register

**Document ID:** COMPLIANCE-REGISTER-001  
**Title:** Applicable Law & Compliance Register  
**Status:** Living Register — Pending Professional Validation  
**Authority Level:** Required by Founder Decision; content subject to Legal/Tax/Privacy/Finance validation  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Authority:** [FD-039 — GCE Phase 2 Commercial Acceptance and Compliance Direction](../founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md) Part E (§11–§13), Part M (§32–§33)  
**Related Phase Doc:** [Phase 15 — Legal, Tax, Privacy & Production Readiness](../phase-15/PHASE_15_LEGAL_TAX_PRIVACY_PRODUCTION_READINESS.md)  
**Applies To:** GCE Connect, GCE Marketplace, GCE Enterprise, Finance, Legal, Tax, Privacy, Product, Operations, Technical Architecture

---

## Authority

1. FD-039 §11 requires GCE to maintain an **Applicable Law & Compliance Register** mapping the **actual** GCE business model to laws, rules, policies, regulations, advisories, and sector-specific requirements that are **genuinely applicable**.
2. FD-039 §12 — **No single-law assumption:**
   > GCE must **not** assume that one single “DPIIT Act and Rules 2023” governs the entire platform.
3. This register assesses **DPIIT policies / requirements** (plural, as applicable) — **not** a fictional consolidated “DPIIT Act and Rules 2023.”
4. This document does **not** invent GST rates, TDS rates/sections, RBI/payment-aggregator classifications, or enforceability conclusions. Cells marked **PENDING PROFESSIONAL VALIDATION** require counsel / CA / privacy / banking specialist input.
5. Professional validation may block production go-live or contract reliance but must not silently rewrite Founder commercial rules (FD-039 §2, §33). Escalate genuine prohibition or material conflict to Founder.

---

## Purpose

- Provide the mandatory compliance mapping artefact required by FD-039.
- Track applicability, GCE relevance, evidence, ownership, validation status, and go-live gate flags.
- Prevent single-statute over-simplification (especially DPIIT).
- Feed Phase 15 readiness and Phase 16–17 go/no-go gates.

---

## Scope

Coverage of applicability **areas** listed in FD-039 §12 (non-exhaustive):

- Applicable DPIIT policies / requirements  
- Consumer Protection Act, 2019  
- Consumer Protection (E-Commerce) Rules, 2020 and applicable amendments/advisories  
- Applicable CCPA guidance, including relevant dark-pattern guidance  
- Applicable data-protection law and rules  
- Information Technology requirements where applicable  
- Companies Act / corporate requirements where applicable  
- GST requirements  
- Income-tax / TDS requirements  
- RBI / payment-aggregator or payment-system requirements where applicable  
- Intellectual-property law  
- Contract law  
- Sector-specific requirements for Venue Partners, events, or Enterprise projects  

FD-039 §13 output dimensions are reflected via columns below (condensed for operational use). Expanded control/clause/disclosure/record fields may be attached as annexes without changing this register’s authority.

---

## Not in scope

- Declaring a single DPIIT statute as governing all of GCE.  
- Final legal opinions, tax opinions, or RBI classifications.  
- Exact rates, sections, or liability conclusions.  
- Replacing Phase 15 draft inventories or executed contracts.  
- Code, SQL, or product feature implementation.

---

## Dependencies

| Dependency | Role |
|---|---|
| FD-039 | Register mandate; applicability list; production gates |
| FD-034 | Corporate constitution (Logixia) |
| Phase 15 | Draft packs and go-live legal checklist |
| Legal counsel / CA / privacy / banking / PSP specialists | Layer 2 validation |
| Technical ADRs / payment & KYC designs | Evidence of controls (architecture may proceed) |

---

## Entry / Exit

### Entry

- FD-039 approved.  
- Register file created and owned.  
- Initial rows populated for all FD-039 §12 areas (Status may be Pending Validation).

### Exit (continuous living document)

There is no permanent “closed” exit. **Go-live readiness** for money movement requires:

- Every row with **Go-live gate = Y** at Status **Validated** (or Founder-accepted risk with recorded escalation), and  
- No unresolved material conflict against Founder MoR / BDP / KYC / cancellation directions without Founder review.

---

## Status vocabulary

| Status | Meaning |
|---|---|
| Pending Validation | Row identified; specialist review not complete |
| In Progress | Evidence gathering / drafting / counsel engagement underway |
| Validated | Professional owner has confirmed applicability treatment for go-live purposes (or confirmed N/A with rationale) |

**Potentially applicable?** values: `Yes` / `Likely` / `Possible` / `Unlikely` / `TBD` — all remain subject to professional confirmation. **Do not treat “Likely/Possible” as a legal conclusion.**

---

## Explicit prohibition — DPIIT wording

| Forbidden assumption | Required practice |
|---|---|
| “DPIIT Act and Rules 2023” governs the whole platform | Map **specific** DPIIT **policies / requirements** that actually apply to GCE’s activities, if any |
| One ministry statute covers consumer, e-commerce, payments, tax, and data | Separate rows for CPA, E-Commerce Rules, data protection, IT, GST, Income-tax, RBI/PA, etc. |
| Silence = compliance | Evidence Needed column must be filled; Status remains Pending Validation until reviewed |

---

## Register matrix

> Columns: **Area** | **Potentially applicable?** | **Relevance to GCE** | **Evidence needed** | **Owner** | **Status** | **Go-live gate** | **Notes**

### A. DPIIT policies / requirements (not a single fictional Act)

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Applicable DPIIT policies / requirements (as separately identified) | TBD | May touch startup / industry / e-commerce policy interfaces depending on activities; **must not** be treated as one omnibus “DPIIT Act” | Counsel memo listing **specific** DPIIT instruments actually engaged by GCE ops (if any); none assumed | Legal | Pending Validation | Y | **FORBID** assuming one “DPIIT Act and Rules 2023” governs all. Assess policies/requirements only. |

### B. Consumer protection

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Consumer Protection Act, 2019 | Likely | Marketplace ticket buyers and possibly other B2C surfaces; unfair trade / deficiency / product liability interfaces TBD by counsel | Applicability memo; grievance redressal design; disclosure checklist | Legal | Pending Validation | Y | No enforceability conclusion in this register |
| Consumer Protection (E-Commerce) Rules, 2020 + applicable amendments/advisories | Likely | Platform marketplace / e-commerce intermediary vs seller characterisation under intended MoR | Classification analysis vs Logixia intended MoR (FD-039 Part B); disclosure / liability / ranking / seller info requirements as counsel confirms | Legal | Pending Validation | Y | MoR direction is Founder business rule; e-commerce characterisation is Layer 2 |

### C. CCPA / dark patterns guidance

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Applicable CCPA guidance, including dark-pattern guidance | Possible | UX for purchase, cancellation (48h default), consent, membership, BDP packs | Map which CCPA instruments/advisories apply; dark-pattern UX review (Phase 15 §17) | Legal + Product | Pending Validation | Y | “CCPA” here follows FD-039 wording; confirm exact instrument set with counsel — do not invent |

### D. Data protection and privacy

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Applicable data-protection law and rules | Likely | PII of Members, BDPs, Venues, Enterprise Clients, Vendors, staff; consent; retention; KYC artefacts | Privacy policy draft; processing inventory; retention schedule; consent wording — all PENDING PROFESSIONAL VALIDATION for final periods/wording | Privacy + Legal | Pending Validation | Y | Exact retention periods open (FD-039 §40) |
| Consent management | Likely | Account, marketing, KYC, cookies/tracking where used | Consent wording; records of consent; withdrawal path | Privacy + Product | Pending Validation | Y | Exact wording open |
| PII minimisation (incl. Aadhaar posture) | Yes (Founder direction) | FD-039: Aadhaar not mandatory by default; minimise identity docs | KYC matrix by stakeholder; Aadhaar edge-case register | Privacy + Ops + Legal | In Progress | Y | Business posture locked; implementation details open |

### E. Information Technology

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Information Technology requirements where applicable | Possible | Intermediary / safe harbour / due diligence / cybersecurity / takedown interfaces TBD | Counsel memo on IT Act / rules / directions actually engaged by GCE platform | Legal + Security | Pending Validation | Y | Do not assume full applicability set |

### F. Corporate

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Companies Act / corporate requirements where applicable | Likely | Logixia as Legal Entity; board/authority for contracts; MoR commercial posture | Corporate authority for MoR operations; signatory matrix; filings as CA/CS advise | Legal + Company Secretary / Finance | Pending Validation | Y | Cite FD-034 constitution; no invented filing list |

### G. Indirect tax — GST

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| GST — event tickets | TBD | Intended MoR ticket collection (FD-039) | Professional GST opinion: rate, place of supply, invoice issuer — **do not invent rates** | Tax / CA | Pending Validation | Y | FD-039 §32 / §40 |
| GST — memberships | TBD | Associate Membership fees | Same as above | Tax / CA | Pending Validation | Y | |
| GST — BDP packs | TBD | Online (default) / rare offline pack payments | Same as above | Tax / CA | Pending Validation | Y | |
| GST — Enterprise invoices | TBD | Enterprise Client billing | Same as above | Tax / CA | Pending Validation | Y | |
| Invoice structure (supplier / platform / Venue / tax presentation) | Yes (process requirement) | MoR + multi-party settlement | Sample invoice templates validated by Tax | Tax + Finance | Pending Validation | Y | Templates open |

### H. Direct tax — Income-tax / TDS

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Income-tax / TDS requirements | TBD | Settlements to Venue Partners, BDPs, Vendors; platform income | CA opinion on sections/rates/withholding mechanics — **do not invent** | Tax / CA | Pending Validation | Y | FD-039 §32 / §40 |

### I. RBI / payment systems / PSP

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| RBI / payment-aggregator or payment-system requirements where applicable | TBD | Marketplace collections; BDP pack payments; settlements; Razorpay as **candidate** PSP | Banking/payment counsel + PSP: account structure, PA applicability to Logixia and/or provider — **no assumed RBI classification** | Legal + Finance + Banking counsel | Pending Validation | Y | Razorpay not legally mandatory (FD-039 §31) |
| PSP configuration (Razorpay candidate) | Yes (operational) | India launch candidate | MoR-aligned config; refunds; settlement timing — exact config open | Finance + Tech | Pending Validation | Y | Technical ADR may proceed; production activation gated |
| Refund accounting / chargebacks | TBD | Ticket/membership/BDP refunds | Finance + Tax + PSP policy pack | Finance + Tax | Pending Validation | Y | Refund % / timelines not finalised by FD-039 |

### J. Intellectual property

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Intellectual-property law | Likely | Platform IP; partner content; brand licences; user content | IP clauses in ToU / BDP / Venue / Enterprise / Vendor packs | Legal | Pending Validation | N* | *Publication of terms is gated; architecture not blocked |

### K. Contract law

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Contract law (formation, e-contracts, enforceability of online terms) | Likely | ToU, Membership, BDP Commercial Licence/IBP, Venue, Enterprise Client, Vendor | Counsel review of formation, clickwrap/sign, capacity | Legal | Pending Validation | Y | **No enforceability conclusions** in this register |
| Dispute resolution / jurisdiction / liability caps | TBD | All commercial packs | Exact forum/caps PENDING PROFESSIONAL VALIDATION (FD-039 §40) | Legal | Pending Validation | Y | Do not invent |

### L. Sector / vertical-specific

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Venue / event sector requirements | Possible | Licensing, safety, local permissions for events hosted via Marketplace | Per-Venue / per-event checklist; Venue Partner terms duties | Legal + Ops + Venue | Pending Validation | Y (per event go-live) | City-specific after pilot city chosen (Phase 16) — city undecided |
| Enterprise project sector requirements | Possible | Client industry regulation (varies by engagement) | Per-engagement compliance annex | Legal + Enterprise Ops | Pending Validation | Y (per engagement) | No generic assumption |
| BDP Commercial Licence / IBP vs franchise characterisation | Possible | FD-039: Franchise Unit is commercial package; not automatic legal franchise | Counsel note if franchise statutes/policies engaged | Legal | Pending Validation | Y | Escalate if conflict with IBP model |

### M. Cross-cutting operational controls (FD-039 §32)

| Area | Potentially applicable? | Relevance to GCE | Evidence needed | Owner | Status | Go-live gate | Notes |
|---|---|---|---|---|---|---|---|
| Settlement compliance | Yes | FD-021 / FD-029 entitlements under MoR | Settlement SOP + audit trail | Finance + Ops | Pending Validation | Y | |
| Offline Admin BDP pack payment controls | Yes | Rare NEFT/RTGS/cheque workflow; cash not normal | Offline payment SOP + evidence fields (FD-039 §19) | Finance + Ops + Legal | Pending Validation | Y | |
| Consumer cancellation / refund disclosures | Yes | 48h default cutoff; refund math open | Pre-purchase disclosure + versioned booking policy | Legal + Product | Pending Validation | Y | |
| Final BDP / Venue / Enterprise Client / Vendor agreements | Yes | Contract reliance | Executed or counsel-cleared templates | Legal | Pending Validation | Y | AI drafts ≠ final |
| Privacy / KYC retention | Yes | FD-039 gates | Retention schedule validated | Privacy + Legal | Pending Validation | Y | Periods open |
| Aadhaar edge-case workflows | Possible | Only if legally justified | Edge-case register + privacy review | Privacy + Legal + Ops | Pending Validation | Y | Not mandatory by default |
| Applicable Law & Compliance Register completeness | Yes | This document | All go-live-gated rows Validated or Founder-accepted | Legal (custodian) | In Progress | Y | Living register |

---

## Owner RACI (proposed)

| Role | Responsibility |
|---|---|
| Legal (custodian) | Register completeness; counsel engagement; escalation to Founder |
| Tax / CA | GST, invoicing, TDS rows |
| Privacy | Data protection, consent, retention, Aadhaar posture implementation |
| Finance | Settlement, PSP config, refund accounting, offline payments |
| Product / UX | Dark-pattern review; consumer disclosures |
| Security / Tech | IT controls evidence; payment state machines (architecture) |
| Founder | Conflicts with Layer 1 business rules; pilot city (separate Phase 16) |

---

## Risks

| Risk | Mitigation |
|---|---|
| Single DPIIT Act myth | Explicit prohibition section + DPIIT row wording |
| Premature “Validated” status | Require named professional sign-off evidence |
| Invented tax/RBI facts | Notes forbid rates/classifications; Status stays Pending Validation |
| Register used to reopen MoR/IBP | FD-039 §2 / §4 — escalate only genuine prohibition |
| Architecture frozen by incomplete rows | FD-039 §33 — architecture may proceed |

---

## Unresolved

- Full instrument-by-instrument counsel list under each Area.  
- Exact GST rates, place-of-supply, invoice templates.  
- Exact TDS sections/rates.  
- Exact RBI/PA classification of Logixia and/or PSP.  
- Exact retention periods, consent wording, liability caps, jurisdiction.  
- Pilot-city local licensing overlays (city intentionally undecided — FD-039 Part K).  
- Whether any DPIIT policy/requirement applies at all — **TBD**, not assumed.

### Phase 12 technical hooks (non-legal conclusion)

Phase 12 implemented platform hooks for notifications consent categories, privacy request workflow, retention policy metadata (`pending_validation`), compliance holds, and sensitive-access logging. **Exact legal retention periods and production SMS/DLT / email provider compliance remain PENDING PROFESSIONAL VALIDATION** (OD-008/009). Destructive retention enforcement remains feature-flagged OFF.

---

## Document control

| Field | Value |
|---|---|
| Required by | FD-039 Part E |
| Type | Living compliance register (documentation only) |
| Code / SQL | None |
| Review cadence | At least each Phase 15 exit review and each Phase 16/17 go/no-go |

**End of Applicable Law & Compliance Register**
