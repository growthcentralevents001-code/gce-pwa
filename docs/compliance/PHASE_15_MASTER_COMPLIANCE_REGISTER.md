# Phase 15 — Master Compliance Register

| Field | Value |
|-------|-------|
| **Document ID** | P15-MCR-001 |
| **Status** | PHASE 15 DOCUMENTATION COMPLETE — PROFESSIONAL SIGN-OFF REQUIRED |
| **Checked** | 2026-08-15 |
| **Starting commit** | `43dcaa1` |
| **Legal entity** | Logixia Solutions Private Limited |
| **Brand** | Growth Central Events (GCE) — master brand / operating division, **not** evidenced as a separate company |
| **Does not duplicate** | [APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md](./APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md) remains the FD-039 living law map. This file is the Phase 15 **control** register. |

**AI is not the professional signatory.** Status values never include `LEGAL PASS` from Cursor analysis.

---

## Status vocabulary (mandatory)

| Status | Meaning |
|--------|---------|
| PASS — TECHNICALLY EVIDENCED | Code/docs show the control exists; **not** a legal conclusion |
| PROFESSIONAL REVIEW REQUIRED | Specialist must review |
| FOUNDER DECISION REQUIRED | Commercial/policy choice still open |
| GAP | Missing control or evidence |
| BLOCKED | Cannot proceed in the stated scope |
| NOT APPLICABLE — REASONED | Out of scope with reason |
| DEFERRED — NON-PILOT | Needed later; Pilot can proceed without it **if** feature stays off |

## Severity

| Level | Meaning |
|-------|---------|
| P0 | Stop immediately |
| P1 | Pilot blocker (including professional holds that block customer/money Pilot) |
| P2 | Production / scale hardening |
| PROFESSIONAL HOLD | Technically described but cannot close without human sign-off |

---

## Corporate / disclosure

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-001 | Corporate | Contracting entity is Logixia, not a separate GCE company unless incorporation evidence exists | FD-034; SRC-014 | All contracts / public copy | Terms page states Logixia operates GCE | `app/terms/page.tsx`; FD-034 | CIN/address/GSTIN missing | Founder + CS | Corporate lawyer | P1 | Yes for published contracts | Yes | FOUNDER DECISION REQUIRED |
| P15-C-002 | Corporate | Do not insert placeholder legal IDs into live UI | Phase 15 brief §9 | Public site | No fake CIN/GSTIN in UI | Privacy/terms pages | Identifiers still missing for invoices | Product | Lawyer | P2 | No if invoices not issued | Yes before invoices | PASS — TECHNICALLY EVIDENCED |
| P15-C-003 | Corporate | Brand vs legal name relationship disclosed | FD-034 | Public | “GCE is operated by Logixia” | `app/terms/page.tsx` | Full registered-office disclosure pending | Legal | Lawyer | P1 | Yes for e-commerce disclosures | Yes | PROFESSIONAL REVIEW REQUIRED |

## Privacy / DPDP

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-010 | Privacy | Map processing by purpose | SRC-001–003 | All PII | Inventory drafted | `PRIVACY_DATA_PROCESSING_REGISTER.md` | Lawful basis not confirmed | Privacy | Privacy lawyer | P1 | Yes for public notice | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-011 | Privacy | Phased DPDP commencement — do not assume all sections live | SRC-002 | Privacy programme | Timeline documented | Primary source register | Counsel must confirm Pilot-date duties | Privacy | Privacy lawyer | PROFESSIONAL HOLD | Depends on Pilot date vs May 2027 | Yes by 18-month mark | PROFESSIONAL REVIEW REQUIRED |
| P15-C-012 | Privacy | Public privacy notice covering actual processing | SRC-003; OD-008 | `/privacy` | Orientation page only — **not** a full notice | `app/privacy/page.tsx`; draft in `legal/drafts/` | Live page is incomplete vs draft | Product + Legal | Privacy lawyer | P1 | Yes if customers create accounts | Yes | GAP |
| P15-C-013 | Privacy | Aadhaar not mandatory by default | FD-039; SRC-016 | KYC | Product direction + public copy | FD-039; privacy page | Edge workflows open (OD-019) | Ops | Privacy lawyer | P1 if Aadhaar collected | No if not collected | Yes if collected | PASS — TECHNICALLY EVIDENCED |
| P15-C-014 | Privacy | Consent/terms evidence (user, version, time, purpose, surface, withdrawal) | SRC-003 | Auth / onboarding | Partial `policy_version` / `terms_accepted_at` on some tables | Phase 13 migration; types dumps | No complete consent ledger | Engineering | Privacy lawyer | P2 / PROFESSIONAL HOLD | Manual Pilot possible | Yes for scale | GAP (P15-GAP-001) |
| P15-C-015 | Privacy | Data Principal request process | SRC-003 (when commenced: max 90 days per PIB — confirm in Rules) | Ops privacy | `privacy_requests` + `/ops/privacy` + settings form | Phase 12/13 | Manual identity-verification SOP incomplete | Ops | Privacy lawyer | P1 | Process must exist even if UI is manual | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-016 | Privacy | Retention periods | OD-009 | All stores | Placeholders; `retention_enforcement` OFF | Phase 12 | Periods TO BE CONFIRMED BY LEGAL/CA | Privacy + CA | Privacy + CA | P2 | No if enforcement stays OFF and Pilot is short | Yes | FOUNDER DECISION REQUIRED |
| P15-C-017 | Privacy | Children’s data | SRC-003 | Eligibility | Age threshold **not invented** | Founder register FD15-AGE-001 | If minors use Events, major review | Founder | Privacy lawyer | P1 if minors in scope | Yes if children in Pilot | Yes | FOUNDER DECISION REQUIRED |

## Consumer / e-commerce / UX

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-020 | Consumer | Customer contractual basis | SRC-004/005; OD-015 | `/terms` | Orientation only | `app/terms/page.tsx`; customer terms draft | Not professionally reviewed; not acceptance-versioned | Legal | Lawyer | P1 | Yes for customer Pilot | Yes | GAP |
| P15-C-021 | Consumer | Refund/cancellation economics disclosed | FD-039 48h cutoff; OD-006 | Booking | Cutoff technically defaulted; % **not** invented | SM_Refund; customer CX | % / timeline / fee / no-show / chargeback Open | Founder | Lawyer + CA | P1 | Yes for paid tickets | Yes | FOUNDER DECISION REQUIRED |
| P15-C-022 | Consumer | Grievance officer / process | E-Commerce Rules (counsel) | Support | Ops cases exist; **no** named officer | `GRIEVANCE_AND_COMPLAINT_PROCESS.md` | Contact placeholders | Founder | Lawyer | P1 | Yes for public e-commerce | Yes | GAP |
| P15-C-023 | Consumer | Dark-pattern self-audit | SRC-006 | Public UX | Audit documented | `CONSUMER_UX_DARK_PATTERN_AUDIT.md` | Lawyer confirmation | Product | Lawyer | PROFESSIONAL HOLD | Unlikely if audit PASS items hold | Scale | PROFESSIONAL REVIEW REQUIRED |
| P15-C-024 | Consumer | No live marketing automation | FD-039; flags | Email/SMS/push | `marketing_notifications` fail-closed | `lib/architecture/feature-flags/flags.ts` | Must stay OFF until consent model approved | Product | Privacy + lawyer | P1 if enabled | No while OFF | Yes if enabled without consent | PASS — TECHNICALLY EVIDENCED |

## Payments / MoR / RBI

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-030 | Payments | Intended Marketplace ticket MoR = Logixia | FD-039; OD-001 | Tickets | Direction only; **Validation Pending** | FD-039; merchant model doc | GST/invoice/PSP/PA | Founder + Lawyer + CA | All three | P1 for money Pilot | Yes if Pilot takes ticket money | Yes | FOUNDER DECISION REQUIRED |
| P15-C-031 | Payments | Do not claim Logixia is an RBI PA | SRC-010; OD-002 | Payments copy | Razorpay is **candidate** PSP; flags OFF | `INACTIVE_FEATURE_FLAGS`; FD-039 §31 | PA analysis still required | Finance | Payments counsel | P1 if misrepresented | No while payments OFF | Yes | PASS — TECHNICALLY EVIDENCED (non-claim) |
| P15-C-032 | Payments | Money flags remain OFF | Phase 15 §71–72 | Payments | `marketplace_ticket_payments`, settlement, payout, refund_processing OFF | `lib/architecture/types.ts`; flags.ts | Must not enable in Phase 15 | Engineering | Security | P0 if enabled | N/A while OFF | Yes | PASS — TECHNICALLY EVIDENCED |
| P15-C-033 | Payments | No full PAN/CVV storage | SRC-011 | DB / logs | No card_number/cvv fields found in app code | repo grep 2026-08-15 | Production integration still gated | Security | Payments + security | P0 if found | N/A | Yes | PASS — TECHNICALLY EVIDENCED |
| P15-C-034 | Payments | Payment ≠ revenue ≠ entitlement ≠ settlement ≠ payout | FD-020/021/028/029 | Finance | Phase 9 model on gce-dev; execution OFF | Phase 9 notes; commercial constants | CA must validate accounting | Finance | CA | PROFESSIONAL HOLD | No for unpaid Pilot | Yes for money | PROFESSIONAL REVIEW REQUIRED |

## Tax / invoice

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-040 | GST | Map each revenue component; no invented rates | SRC-007/008; OD-003 | All SKUs | Review pack only | `GST_AND_INDIRECT_TAX_REVIEW.md` | Rates/POS/ECO/TCS | CA | CA | P1 for invoiced Pilot | Yes if invoices/money | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-041 | TCS | Transaction-by-transaction ECO analysis | SRC-007 | Marketplace vs own-account | Questions posed; **no** automatic TCS conclusion | GST review | CA conclusion | CA | CA | P1 for money | Yes if ECO | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-042 | TDS | Withholding on payouts | SRC-009; OD-004 | BDP/Venue/vendor | Execution OFF | `TDS_WITHHOLDING_REVIEW.md` | Sections/rates | CA | CA | P2 until payouts | No while payout OFF | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-043 | Invoice | Issuer/recipient matrix | OD-005; FD-034 | Finance | Matrix drafted; **not implemented** | `INVOICE_CREDIT_NOTE_DOCUMENT_MATRIX.md` | Templates | Finance | CA + lawyer | P1 for first invoice | Yes if invoicing | Yes | PROFESSIONAL REVIEW REQUIRED |

## Contracts

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-050 | Contract | Customer terms draft | OD-015 | Customers | Draft created | `legal/drafts/GCE_CUSTOMER_TERMS_DRAFT.md` | Review + publication | Legal | Lawyer | P1 | Yes for customer Pilot | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-051 | Contract | Connect membership terms | FD-027/036 | Members | Draft created | membership terms draft | Review | Legal | Lawyer | P1 if members in Pilot | If Connect in Pilot | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-052 | Contract | BDP Commercial Licence / IBP | FD-039; OD-011 | BDPs | Draft + schedules | BDP master draft | Execution authority | Legal | Lawyer | P1 if BDP onboarded | If BDP in Pilot | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-053 | Contract | Venue Partner agreement | OD-012 | Venues | Draft created | Venue draft | Tax/refund clauses gated | Legal | Lawyer | P1 if Venues live | If Marketplace Pilot | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-054 | Contract | Enterprise MSA / SOW / vendor | OD-013/014 | Enterprise | Drafts created | MSA/SOW/vendor drafts | Project-specific role | Legal | Lawyer | P1 if Enterprise Pilot | If Enterprise in Pilot | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-055 | Contract | Lead Assist unpaid Stage 1 terms | FD-031 | Connect | Draft; no ₹500/escrow | Lead Assist draft | Desk access justification | Legal | Lawyer + privacy | DEFERRED — NON-PILOT if unused | If Lead Assist in Pilot | Scale | PROFESSIONAL REVIEW REQUIRED |
| P15-C-056 | Contract | BDP/RM/Ops cannot bind Logixia | FD-034 | Signing | Documented | `LEGAL_DOCUMENT_PUBLICATION_PLAN.md` | Named signatories missing | Founder | Lawyer | P1 for executed contracts | Yes | Yes | FOUNDER DECISION REQUIRED |

## Security / production

| ID | Domain | Requirement | Source | GCE area | Current implementation | Evidence | Gap | Owner | Reviewer | Severity | Pilot blocker? | Production blocker? | Status |
|----|--------|-------------|--------|----------|------------------------|----------|-----|-------|----------|----------|----------------|---------------------|--------|
| P15-C-060 | Security | QR display credentials AES-256-GCM; no raw token logs | Phase 14B | Tickets/claims | Implemented gce-dev; production migration **not** applied | Phase 14B report; `marketplace_display_credentials` | Production key management; historical backfill | Security | Security | P2 for prod migration | No (dev only) | Yes | PASS — TECHNICALLY EVIDENCED (non-prod) |
| P15-C-061 | Security | In-memory credential API rate limit | Phase 14B | APIs | Documented as P2 | backfill/secrets docs | Distributed limit | Engineering | Security | P2 | No unless security says otherwise | Recommended | DEFERRED — NON-PILOT |
| P15-C-062 | Security | Privileged access / no Super Admin product role | FD-023/035 | RBAC | No ordinary Super Admin | Phase 13; privileged access review | Named production operators | Security | Security | P1 for prod | Process for Pilot | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-063 | Security | SoD: no self-approval; MBDP ≠ Ops approval; Finance co-sign > ₹5L | FD-038 | Approvals | Technically evidenced Phase 13/8/14B | Phase 14B IDOR/SoD | Production operator staffing | Ops | Security | P1 if operators overlap | If dual-hatted | Yes | PASS — TECHNICALLY EVIDENCED |
| P15-C-064 | Security | CERT-In 6h / 180-day logs | SRC-012 | Hosting | Plan drafted; evidence of 180-day India logs **not** proven | IR plan | Hosting region + log retention proof | Security | Security + legal | P1 for production hosting | Possibly for live Pilot hosting | Yes | PROFESSIONAL REVIEW REQUIRED |
| P15-C-065 | Security | Production secrets / credential key | Env docs | Prod | Checklist only; **no secrets in git** | secrets checklist | Rotation owners | Security | Security | P1 before prod | Before any prod | Yes | GAP |
| P15-C-066 | Security | Historical credential backfill | Phase 14B | Prod tickets | Plan only; **do not migrate prod in Phase 15** | backfill plan | Founder rollout decision | Engineering | Security | P2 | No if Pilot uses new tickets only | Yes for old tickets | DEFERRED — NON-PILOT |

## Inactive features (must stay off)

| ID | Domain | Requirement | Source | Status |
|----|--------|-------------|--------|--------|
| P15-C-070 | Product | paid Lead Assist, Core direct purchase, Marketplace Affiliate, ZBP, wallet cashout, vendor self-service, Super Admin, live email/SMS/push/marketing | FD-039 Part J; flags | PASS — TECHNICALLY EVIDENCED (inactive) |

---

## Gap register

### P15-GAP-001 — Consent / terms acceptance evidence ledger

| Field | Value |
|-------|-------|
| Requirement | Durable record: user ID, policy version, timestamp, purpose, source/surface, withdrawal, metadata |
| Current | Partial timestamps/versions on some onboarding tables; not a complete purpose-level ledger |
| Risk | Weak evidence of notice/consent when DPDP substantive rules commence; consumer-contract formation evidence |
| Proposed | Dedicated acceptance/consent events table + versioned document IDs |
| Schema impact | Yes — **do not migrate in Phase 15 without Founder approval** |
| API / UI | Later |
| Rollback | N/A (not implemented) |
| Professional dependency | Privacy lawyer defines required evidence |
| Severity | PROFESSIONAL HOLD / P2 until Pilot uses manual countersignature |

### P15-GAP-002 — Legal entity identifiers unpublished

CIN, registered office, GSTIN, PAN, grievance officer, authorised signatory: **MISSING — FOUNDER/PROFESSIONAL INPUT REQUIRED**. Not inserted into live UI.

### P15-GAP-003 — Public legal pages are orientation stubs

`/privacy` and `/terms` are not the professional drafts. Publishing drafts requires lawyer + Founder.

---

## P0 / P1 counts (Cursor assessment — not a legal clearance)

| Class | Count | Notes |
|-------|-------|-------|
| Technical P0 | **0** | No PAN/CVV storage found; money flags OFF; production untouched |
| Technical P1 | **0** | Phase 14B closeout preserved |
| Professional P1 (Pilot with customers/money) | See open issues | Terms, privacy notice, grievance identity, MoR, refund economics, GST/invoice |
| P2 | Distributed rate limit, backfill, tax automation, live messaging | |

---

## QUESTIONS FOR PROFESSIONAL REVIEW

See [PHASE_15_PROFESSIONAL_SIGNOFF_MATRIX.md](./PHASE_15_PROFESSIONAL_SIGNOFF_MATRIX.md).

## QUESTIONS REQUIRING FOUNDER DECISION

See [PHASE_15_FOUNDER_DECISION_REGISTER.md](./PHASE_15_FOUNDER_DECISION_REGISTER.md).
