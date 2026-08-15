# Phase 15 — External Professional Review Pack

| Field | Value |
|-------|-------|
| **Document ID** | P15-ERP-001 |
| **Checked** | 2026-08-15 |
| **Starting commit** | `43dcaa1` |
| **Verdict** | Documentation complete — **no professional sign-off recorded** |

Hand this file plus the listed artefacts to each professional. Do not treat Cursor text as their opinion.

---

## Lawyer pack

Read first:

- FD-034, FD-039  
- `PHASE_15_PRIMARY_SOURCE_REGISTER.md` (SRC-004–006, 013–015, 017)  
- `CONTRACTING_PARTY_MAP.md`  
- `MARKETPLACE_MERCHANT_AND_PAYMENT_LEGAL_MODEL.md`  
- `REFUND_CANCELLATION_CHARGEBACK_DECISION_MATRIX.md`  
- `GRIEVANCE_AND_COMPLAINT_PROCESS.md`  
- `CONSUMER_UX_DARK_PATTERN_AUDIT.md`  
- `IP_AND_USER_CONTENT_POLICY_REVIEW.md`  
- All files under `legal/drafts/`  
- Open issues P15-P1-001–007; conflicts P15-CON-001–003  

Ask them to mark `PHASE_15_PROFESSIONAL_SIGNOFF_MATRIX.md` rows PS-L-*.

Open decisions: MoR model; refunds; e-commerce classification; franchise risk; intermediary; liability; signing.

---

## CA / tax pack

- `COMMERCIAL_MONEY_FLOW_MAP.md`  
- `GST_AND_INDIRECT_TAX_REVIEW.md`  
- `TDS_WITHHOLDING_REVIEW.md`  
- `INVOICE_CREDIT_NOTE_DOCUMENT_MATRIX.md`  
- `REVENUE_RECOGNITION_PROFESSIONAL_REVIEW.md`  
- `docs/core/36_Commercial_Constants.md`  
- FD-020/021/028/029/037/038  
- Merchant model (A/B/C)  

Ask: GST per SKU; s.52 / s.9(5); TDS sections; invoices/credit notes; Recoverable Balance; GSTIN for Pilot.

---

## Privacy pack

- `PRIVACY_DATA_PROCESSING_REGISTER.md`  
- `legal/drafts/GCE_PRIVACY_NOTICE_DRAFT.md`  
- Retention, breach, vendor, logging matrices  
- SRC-001–003, 012, 016  
- KYC matrix; internal access (Desk)  
- P15-GAP-001  

Ask: fiduciary; commencement vs Pilot date; notice; consent evidence; processors; children; cross-border.

---

## Security / payment pack

- Merchant model + money-flow  
- Secrets checklist; privileged access; fraud review  
- Credential backfill plan; Phase 14B report (do not reopen BG-11/12/32 without regression)  
- SRC-010–012  
- Feature flags still OFF  

Ask: PA vs merchant; card data; key management; CERT-In 6h/180d; rate limit P2.

---

## Founder pack

- `PHASE_15_FOUNDER_DECISION_REGISTER.md`  
- Pilot + production checklists  
- Open issues  

Sequence: Pilot scope → MoR if money → refunds → identifiers → age → signatories.
