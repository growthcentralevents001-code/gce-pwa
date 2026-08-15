# Phase 15 — Founder Decision Register

| Field | Value |
|-------|-------|
| **Document ID** | P15-FDR-001 |
| **Status** | OUTSTANDING — Cursor has **not** decided on the Founder’s behalf |
| **Checked** | 2026-08-15 |
| **Rule** | Search existing FDs first. Do not re-ask questions already answered. Do not recommend illegal options. |

Existing OD cross-walk: `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md` (CURRENT). This file is the Phase 15 **decision sequence** for Pilot, not a competing OD list.

---

## Already decided (do not re-open without new FD)

| Topic | Authority | Do not re-ask |
|-------|-----------|----------------|
| Legal company vs GCE brand | FD-034 | GCE is not automatically a separate company |
| Intended Marketplace ticket MoR **direction** | FD-039 | Direction exists; **implementation validation** still open (OD-001) |
| BDP packaging model | FD-039 | Commercial Licence / IBP; Franchise Unit ≠ automatic legal franchise |
| 48-hour default cancellation **cutoff** | FD-039 | Cutoff decided; **refund %** not decided (OD-006) |
| Aadhaar not mandatory by default | FD-039 | |
| Connect BDP 20%, 5 Circles / 10 months, packs ₹50k / ₹60k | FD-025/029 | Not legacy 10% / 10 Circles |
| Marketplace 80/10/10 and 80/0/20 | FD-029/037 | Affiliate inactive |
| Enterprise BDP 25% of eligible **GCE platform commission** | FD-026/038 | Not 25% of project value |
| Finance co-sign **strictly > ₹5,00,000** | FD-038 | Internal rule; not automatically customer contract language |
| Lead Assist Stage 1 unpaid | FD-031/039 | No ₹500 / escrow / voucher / success fee |
| Payment ≠ revenue ≠ entitlement ≠ settlement ≠ payout | FD-020/021/028/029 | |
| Pilot city | FD-039 Part K | Intentionally undecided (OD-017) — does not block architecture |
| Inactive Part J products | FD-039 | Stay off |

---

## Decisions still required

### FD15-MOR-001 — Marketplace contractual seller / payment presentation

| Field | Value |
|-------|-------|
| Question | For Pilot ticket sales, is Logixia the contractual seller/principal (Model A), the Venue/organiser the seller with GCE as intermediary/technology (Model B), or a project-specific mix (Model C)? |
| Why required | Drives customer terms, invoices, GST/TCS, refunds, grievance, PSP merchant account, possible PA analysis |
| Current implementation | FD-039 **intended** MoR = Logixia. Payments flags OFF. No production merchant confirmation. |
| Option A | Logixia contracts with customer as principal (aligned with intended MoR) |
| Option B | Venue/organiser contracts with customer; GCE provides marketplace/tech |
| Option C | Componentised / event-specific (Enterprise-like) |
| Operational effect | Who the customer sues; who issues tickets; who refunds |
| Legal/tax | Lawyer + CA + payments counsel **must** review before money |
| Recommended sequence | Founder selects intended Pilot model → lawyer/CA validate feasibility → only then PSP configuration |
| Founder decision | **OUTSTANDING** |

### FD15-REF-001 — Refund / cancellation economics (OD-006)

| Field | Value |
|-------|-------|
| Question | What refund percentage, timeline, convenience/platform-fee treatment, post-cutoff rule, no-show, Event/Venue cancellation, partial refund, reschedule, and chargeback allocation apply? |
| Why required | Consumer disclosures; Finance; PSP |
| Current | 48h **cutoff** approved. Refund requests = `manual_review`. `refund_processing` OFF. **No % invented.** |
| Options | Counsel-safe menus only: (i) full refund before cutoff except disclosed non-refundable fee; (ii) tiered % by time; (iii) Venue-set disclosed policy within platform min standards. **Do not pick numbers here.** |
| Sequence | Founder commercial choice → lawyer consumer-law check → CA credit-note/GST → then copy |
| Founder decision | **OUTSTANDING** |

### FD15-MEM-001 — Membership refund matrix (OD-007)

| Field | Value |
|-------|-------|
| Question | Exact pre-activation / post-activation / error-exception refund rules for Associate (and inactive Core)? |
| Current | Commercial posture: non-refundable after activation; exceptions for verified platform/legal errors (FD-027) — matrix not final |
| Founder decision | **OUTSTANDING** |

### FD15-AGE-001 — Age / minor eligibility

| Field | Value |
|-------|-------|
| Question | Are GCE customer Event surfaces adults-only / business users only, or may minors attend/book? |
| Why | Child personal-data duties under DPDP Rules (when commenced) are material |
| Current | **No age threshold invented.** Product is substantially B2B + event tickets. |
| Options | (A) 18+ accounts only; (B) 18+ accounts with child attendees as guests under adult booker; (C) minors as users (major privacy programme) |
| Founder decision | **OUTSTANDING** |

### FD15-ENT-001 — Corporate identifiers and grievance officer

| Field | Value |
|-------|-------|
| Question | Supply CIN, registered office, GSTIN (if any), PAN, authorised signatories, grievance officer name/contact, privacy contact — or confirm they do not yet exist. |
| Current | **MISSING — FOUNDER/PROFESSIONAL INPUT REQUIRED.** Not placed in live UI. |
| Founder decision | **OUTSTANDING** |

### FD15-PIL-001 — Pilot scope

| Field | Value |
|-------|-------|
| Question | Which of Connect / Marketplace / Enterprise / BDP onboarding / paid tickets are in the first Pilot? Money on or off? City (OD-017) still deferred. |
| Why | Determines which P1 professional holds actually block Phase 16 |
| Options | (A) Unpaid technical Pilot, no public customers; (B) Invite-only customers, payments OFF; (C) Paid Pilot after MoR/GST/refund sign-off |
| Founder decision | **OUTSTANDING** |

### FD15-PAY-001 — Production payment architecture (after Phase 15)

| Field | Value |
|-------|-------|
| Question | Confirm Razorpay (or other) merchant entity, split/transfer vs platform settlement, and that Phase 15 will **not** enable flags. |
| Current | Candidate PSP; flags OFF |
| Founder decision | **OUTSTANDING** (do not enable in Phase 15) |

### FD15-MKT-001 — Marketing consent

| Field | Value |
|-------|-------|
| Question | Keep all live email/SMS/push/marketing OFF (recommended until notice/consent exist) or authorise a specific opt-in channel? |
| Current | OFF |
| Founder decision | Default remain OFF unless Founder later authorises |

### FD15-RET-001 — Business retention needs

| Field | Value |
|-------|-------|
| Question | Business-side minimum retention for tickets, KYC, finance, leads — **not** legal periods (those are Legal/CA). |
| Current | Enforcement OFF; periods unconfirmed |
| Founder decision | **OUTSTANDING** |

### FD15-SIGN-001 — Who may execute which contracts

| Field | Value |
|-------|-------|
| Question | Named Logixia officials for BDP, Venue, Enterprise, high-value contracts. BDP/RM/Ops must **not** auto-bind Logixia (FD-034). |
| Founder decision | **OUTSTANDING** |

---

## Recommended decision sequence

1. FD15-PIL-001 Pilot scope  
2. FD15-MOR-001 if Marketplace money or public tickets  
3. FD15-REF-001 / FD15-MEM-001  
4. FD15-ENT-001 identifiers + grievance officer  
5. FD15-AGE-001  
6. FD15-SIGN-001  
7. Then professional packs (lawyer / CA / privacy / payments / security)  
8. FD15-PAY-001 only after those reviews  
9. FD15-MKT-001 / FD15-RET-001 can trail unpaid Pilot  

---

## QUESTIONS REQUIRING FOUNDER DECISION

The IDs above. Do not ask Founder to invent GST rates or DPDP legal conclusions.

## QUESTIONS FOR PROFESSIONAL REVIEW

Professionals should not substitute for Founder commercial choices on refund % or Pilot scope.
