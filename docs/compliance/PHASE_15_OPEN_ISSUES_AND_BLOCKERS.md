# Phase 15 — Open Issues and Blockers

| Field | Value |
|-------|-------|
| **Document ID** | P15-OIB-001 |
| **Checked** | 2026-08-15 |
| **Technical baseline** | PHASE 14B COMPLETE — VALIDATION PASSED WITH NON-BLOCKING ITEMS (`43dcaa1`) |
| **BG-11 / BG-12 / BG-32** | Remain CLOSED — no regression evidence in Phase 15 |

Cursor has **not** marked Phase 15 ready for Phase 16.

---

## P0 — Stop immediately

**None identified** in this documentation pass.

- No full PAN/CVV storage found in application code.
- Payment / settlement / payout / refund execution flags remain OFF.
- Production database not touched.
- No fabricated “DPIIT Act 2023” used as governing law.

If later review finds prohibited card data or live unauthorised money movement, escalate to P0 immediately.

---

## P1 — Pilot blockers (professional / contractual)

These block **customer-facing or money-moving Pilot**, not unpaid internal technical use.

| ID | Issue | Why Pilot-blocking | Owner |
|----|-------|--------------------|-------|
| P15-P1-001 | Public `/terms` and `/privacy` are orientation stubs; professional drafts unpublished | No adequate customer contractual/privacy basis | Lawyer + Founder |
| P15-P1-002 | Marketplace seller/MoR model not professionally validated | OD-001; cannot truthfully present seller/tax/refund party | Founder + Lawyer + CA |
| P15-P1-003 | Refund % / timelines / fees / no-show / chargeback Open (OD-006) | Cannot disclose a complete consumer cancellation policy | Founder + Lawyer + CA |
| P15-P1-004 | GST / invoice / possible TCS model unvalidated | Cannot issue lawful invoices or describe tax on tickets | CA |
| P15-P1-005 | Grievance officer / legal entity identifiers missing | E-commerce / company disclosure likely incomplete | Founder + Lawyer |
| P15-P1-006 | BDP / Venue / Enterprise agreements not professionally approved or executed | Cannot onboard those counterparties on binding terms | Lawyer |
| P15-P1-007 | Age/minor policy undecided if consumer Events are in Pilot | Child-data risk | Founder + Privacy |
| P15-P1-008 | CERT-In / log-retention evidence for the actual Pilot host not proven | Body-corporate cyber directions | Security + Legal |

**Narrow unpaid internal Pilot** (no public customers, no money, no partner contracts) can proceed as **OUT OF PILOT SCOPE** for several of the above — **only if Founder selects that scope (FD15-PIL-001)** and features stay disabled and unadvertised.

---

## P2 — Production / scale

| ID | Item |
|----|------|
| P15-P2-001 | Distributed rate limit on credential APIs |
| P15-P2-002 | Production DB migration + historical credential backfill |
| P15-P2-003 | Consent/acceptance ledger (P15-GAP-001) |
| P15-P2-004 | Tax/invoice automation |
| P15-P2-005 | Settlement/payout operational staffing |
| P15-P2-006 | Live messaging compliance |
| P15-P2-007 | Trademark registration (if desired) |
| P15-P2-008 | Local licence matrix after Pilot city chosen |

---

## Professional Holds

Every row in [PHASE_15_PROFESSIONAL_SIGNOFF_MATRIX.md](./PHASE_15_PROFESSIONAL_SIGNOFF_MATRIX.md) is `NOT REVIEWED`.

No genuine external lawyer / CA / privacy / payments / security **APPROVED** records were found in the repository.

---

## LEGAL/COMPLIANCE CONFLICT — FOUNDER REVIEW REQUIRED

No silent FD rewrite. Potential **tension** (not a Cursor conclusion of illegality):

| ID | Founder rule | Apparent requirement | Conflict | Compliant options (for professionals) | Reviewer |
|----|--------------|----------------------|----------|----------------------------------------|----------|
| P15-CON-001 | Intended MoR = Logixia (FD-039) | If Model B (Venue as seller) is later chosen for tax/PA reasons | Business direction vs possible tax/PA structuring | Keep A and validate; or Founder supersedes to B after advice | Founder + Lawyer + CA + payments |
| P15-CON-002 | Membership commercially non-refundable after activation (FD-027 posture) | Consumer-law fairness if members are “consumers” | Possible | Counsel-designed exceptions already contemplated for platform/legal error; do not invent % | Lawyer |
| P15-CON-003 | 48h cutoff | Must be disclosed, reasonable, lawful (FD-039) | None yet — refund **amount** still open | Disclose cutoff + decided economics together | Lawyer |

---

## Gaps

- P15-GAP-001 Consent evidence ledger — no schema migration without Founder approval  
- P15-GAP-002 Corporate identifiers  
- P15-GAP-003 Public legal pages vs drafts  

---

## Explicitly not blockers

- Phase 14B non-blocking items  
- Cross-Circle Lead Assist permutations (P2 technical)  
- Inactive Part J products  
- Pilot city (architecture); **is** a Phase 16 deployment-planning gate  
- Design / Taste / Impeccable work  

---

## QUESTIONS FOR PROFESSIONAL REVIEW

Which of P15-P1-001–008 remain blocking if Founder chooses unpaid invite-only Pilot?

## QUESTIONS REQUIRING FOUNDER DECISION

FD15-PIL-001 first.
