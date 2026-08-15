# Phase 15 — Professional Sign-off Matrix

| Field | Value |
|-------|-------|
| **Document ID** | P15-PSM-001 |
| **Status** | NOT REVIEWED (all rows) unless a genuine human professional record is later attached |
| **Checked** | 2026-08-15 |
| **Rule** | Cursor/AI **cannot** set status to `APPROVED`. Do not fabricate reviewer names. |

Allowed status values only:

`NOT REVIEWED` / `REVIEW REQUESTED` / `COMMENTS RECEIVED` / `CHANGES REQUIRED` / `CONDITIONALLY APPROVED` / `APPROVED`

---

## How to record a later professional decision

When a human professional returns comments, append to [PHASE_15_FINAL_SIGNOFF_REPORT.md](./PHASE_15_FINAL_SIGNOFF_REPORT.md) § Professional decision log:

- reviewer name/role
- organisation
- date
- document/version reviewed
- finding
- conditions
- required change
- sign-off status

---

## Founder / Product

| ID | Item | Why | Pack | Status |
|----|------|-----|------|--------|
| PS-F-001 | Marketplace contractual seller / intended MoR vs alternatives | Customer contract + tax + PSP | Merchant model; FD-039 | NOT REVIEWED |
| PS-F-002 | Refund %, timelines, convenience fee, no-show, chargeback, Force Majeure | OD-006 | Refund matrix | NOT REVIEWED |
| PS-F-003 | Membership refund matrix | OD-007 | Membership terms | NOT REVIEWED |
| PS-F-004 | Customer age / minor eligibility | Child-data risk | Privacy notice; Founder register | NOT REVIEWED |
| PS-F-005 | Pilot launch scope (which verticals, money on/off, city) | OD-017 city deferred | Pilot checklist | NOT REVIEWED |
| PS-F-006 | Contract execution / authorised signatories | FD-034 | Publication plan | NOT REVIEWED |
| PS-F-007 | Marketing consent strategy (keep channels OFF until decided) | Flags OFF | Marketing review | NOT REVIEWED |
| PS-F-008 | Data retention business needs | OD-009 | Retention matrix | NOT REVIEWED |
| PS-F-009 | Customer promises in public copy vs inactive features | Part J inactive | Terms drafts | NOT REVIEWED |
| PS-F-010 | Risk acceptance of unpaid/manual Pilot vs money Pilot | Phase 16 gate | Open issues | NOT REVIEWED |

## Corporate / commercial lawyer

| ID | Item | Pack | Status |
|----|------|------|--------|
| PS-L-001 | Customer Terms | `legal/drafts/GCE_CUSTOMER_TERMS_DRAFT.md` | NOT REVIEWED |
| PS-L-002 | Connect Membership Terms | membership draft | NOT REVIEWED |
| PS-L-003 | BDP Master Commercial Licence + Connect/Marketplace/Enterprise schedules | BDP draft | NOT REVIEWED |
| PS-L-004 | Whether “Franchise Unit” is a legal franchise | FD-039; BDP draft | NOT REVIEWED |
| PS-L-005 | Venue Partner Agreement | Venue draft | NOT REVIEWED |
| PS-L-006 | Marketplace Offer Terms | Offer draft | NOT REVIEWED |
| PS-L-007 | Enterprise MSA + SOW | Enterprise drafts | NOT REVIEWED |
| PS-L-008 | Enterprise Vendor Terms | Vendor draft | NOT REVIEWED |
| PS-L-009 | Lead Assist Terms | Lead Assist draft | NOT REVIEWED |
| PS-L-010 | Limitation of liability / indemnity / dispute resolution / IP | All drafts | NOT REVIEWED |
| PS-L-011 | Agency / non-agency / authority to bind | BDP + RM | NOT REVIEWED |
| PS-L-012 | Cancellation/refund clauses vs consumer law | Refund matrix + terms | NOT REVIEWED |
| PS-L-013 | E-commerce entity classification vs intended MoR | Merchant model | NOT REVIEWED |
| PS-L-014 | Intermediary vs principal (IT Act) | Contracting map | NOT REVIEWED |
| PS-L-015 | Grievance officer appointment & SLA (do not invent SLA) | Grievance process | NOT REVIEWED |
| PS-L-016 | Event safety / permits allocation of responsibility | Event safety section | NOT REVIEWED |
| PS-L-017 | Clickwrap vs wet-ink vs e-sign per relationship | Publication plan | NOT REVIEWED |
| PS-L-018 | Companies Act website/letterhead disclosures | Corporate gaps | NOT REVIEWED |

## Privacy / data-protection lawyer or DPO-level reviewer

| ID | Item | Pack | Status |
|----|------|------|--------|
| PS-P-001 | Data Fiduciary classification (OD-008) | Processing register | NOT REVIEWED |
| PS-P-002 | Privacy Notice draft | privacy draft | NOT REVIEWED |
| PS-P-003 | DPDP phased timeline vs Pilot date | SRC-002/003 | NOT REVIEWED |
| PS-P-004 | Notice/consent UX recommendations (no auto-checkboxes) | Consent audit | NOT REVIEWED |
| PS-P-005 | Consent evidence gap P15-GAP-001 | Gap register | NOT REVIEWED |
| PS-P-006 | Retention / deletion | Retention matrix | NOT REVIEWED |
| PS-P-007 | Data Principal rights handling | Grievance + privacy ops | NOT REVIEWED |
| PS-P-008 | Processors / DPAs | Vendor register | NOT REVIEWED |
| PS-P-009 | Breach intimation (CERT-In vs DPDP — do not invent DPDP clocks) | IR plan | NOT REVIEWED |
| PS-P-010 | Children’s data if Events are open to minors | Age decision | NOT REVIEWED |
| PS-P-011 | Cross-border processing (Supabase/Sentry/AI regions) | Vendor register | NOT REVIEWED |
| PS-P-012 | Aadhaar / government ID minimisation | KYC matrix | NOT REVIEWED |
| PS-P-013 | Opportunity Desk Lead access justification | Internal access | NOT REVIEWED |
| PS-P-014 | Logging / redaction | Logging matrix | NOT REVIEWED |
| PS-P-015 | Cookie/tracking (none found in app code) | Cookie audit | NOT REVIEWED |
| PS-P-016 | Marketing opt-in (channels OFF) | Marketing review | NOT REVIEWED |

## Chartered Accountant / GST specialist

| ID | Item | Pack | Status |
|----|------|------|--------|
| PS-CA-001 | GST on tickets under Model A vs B vs C | GST review; merchant model | NOT REVIEWED |
| PS-CA-002 | GST on Connect memberships / Tags | GST review | NOT REVIEWED |
| PS-CA-003 | GST on BDP packs (Direct ₹50k / Finance ₹60k) | GST review | NOT REVIEWED |
| PS-CA-004 | GST on Enterprise components / platform commission | GST review | NOT REVIEWED |
| PS-CA-005 | ECO definition / s.52 TCS applicability per flow | GST review | NOT REVIEWED |
| PS-CA-006 | s.9(5) notified services — any GCE SKU? | GST review | NOT REVIEWED |
| PS-CA-007 | Invoice issuer / recipient / credit notes | Invoice matrix | NOT REVIEWED |
| PS-CA-008 | Commission accounting vs funds collected | Revenue recognition review | NOT REVIEWED |
| PS-CA-009 | Settlement / payout vs revenue | Money-flow map | NOT REVIEWED |
| PS-CA-010 | Refund / cancellation accounting | Refund matrix | NOT REVIEWED |
| PS-CA-011 | TDS on BDP / Venue / vendor payouts | TDS review | NOT REVIEWED |
| PS-CA-012 | GSTIN registration need for Pilot | Corporate gaps | NOT REVIEWED |

## Payments / fintech legal or compliance specialist

| ID | Item | Pack | Status |
|----|------|------|--------|
| PS-PAY-001 | Razorpay merchant account vs Route/split vs marketplace | Merchant model | NOT REVIEWED |
| PS-PAY-002 | PA implications of collecting and paying out Venue/MBDP | SRC-010 | NOT REVIEWED |
| PS-PAY-003 | Escrow/nodal if any | Payment flow | NOT REVIEWED |
| PS-PAY-004 | Chargeback ownership | Refund matrix | NOT REVIEWED |
| PS-PAY-005 | Card data / tokenisation | Card review | NOT REVIEWED |
| PS-PAY-006 | Settlement destination / timing | Money-flow | NOT REVIEWED |

## Information security reviewer

| ID | Item | Pack | Status |
|----|------|------|--------|
| PS-SEC-001 | Production secrets / credential encryption key | Secrets checklist | NOT REVIEWED |
| PS-SEC-002 | QR credential crypto + key management | Phase 14B + secrets | NOT REVIEWED |
| PS-SEC-003 | Privileged access / break-glass | Privileged access | NOT REVIEWED |
| PS-SEC-004 | Logging PII / Lead contacts / KYC | Logging matrix | NOT REVIEWED |
| PS-SEC-005 | Incident / CERT-In 6-hour process | IR plan | NOT REVIEWED |
| PS-SEC-006 | Vendor security (Supabase, host, PSP, Sentry, AI) | Vendor register | NOT REVIEWED |
| PS-SEC-007 | Backup / recovery | Secrets + IR | NOT REVIEWED |
| PS-SEC-008 | Distributed rate limit (P2) | Credential APIs | NOT REVIEWED |
| PS-SEC-009 | Historical credential backfill | Backfill plan | NOT REVIEWED |
| PS-SEC-010 | Fraud controls (review-only) | Fraud review | NOT REVIEWED |

---

## QUESTIONS FOR PROFESSIONAL REVIEW

Each reviewer should start from [PHASE_15_EXTERNAL_REVIEW_PACK.md](./PHASE_15_EXTERNAL_REVIEW_PACK.md) and return written comments against the IDs above.

## QUESTIONS REQUIRING FOUNDER DECISION

Founder rows PS-F-001–010 must be decided **before** lawyers/CA can finalise money-moving instruments. Sequence is in the Founder Decision Register.
