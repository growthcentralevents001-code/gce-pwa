# Data Retention and Deletion Matrix

| Field | Value |
|-------|-------|
| **Document ID** | P15-RET-001 |
| **Status** | DRAFT — periods **TO BE CONFIRMED BY LEGAL/CA** |
| **Checked** | 2026-08-15 |
| **Enforcement** | `retention_enforcement` **OFF** — do not enable in Phase 15 |

Do **not** invent retention periods. CERT-In **180-day rolling ICT logs** is a **log** duty (SRC-012), not a business-data retention schedule.

---

| Data type | Business purpose | Current behaviour | Legal/accounting dependency | Proposed period | Deletion / anonymisation | Professional owner | Approval |
|-----------|------------------|-------------------|-----------------------------|-----------------|--------------------------|--------------------|----------|
| Account / profile | Operate identity | Kept while account exists | DPDP storage limitation (when commenced); company records | TO BE CONFIRMED BY LEGAL/CA | Privacy request + legal hold | Privacy + Legal | NOT REVIEWED |
| Auth sessions | Security | Provider-managed | CERT-In logs 180 days | Align logs 180 days; sessions shorter | Expiry | Security | NOT REVIEWED |
| KYC documents | Verification | Stored; contents not to be logged | Possible tax/PMLA-like expectations — **do not assume FI status**; Aadhaar extra rules if used | TO BE CONFIRMED | Secure delete; keep audit of deletion | Privacy + Legal | NOT REVIEWED |
| Payment / ledger | Finance truth | Phase 9 ledgers; execution OFF | Books of account — CA | TO BE CONFIRMED BY CA | No casual purge | CA | NOT REVIEWED |
| Invoices / credit notes | Tax | Not automated | GST/IT retention — CA | TO BE CONFIRMED BY CA | Archive | CA | NOT REVIEWED |
| Bookings / tickets / QR ciphertext | Fulfilment + disputes | Kept; pre-migration tickets lack ciphertext | Consumer disputes; tax | TO BE CONFIRMED | Credential key destruction ≠ row delete | Legal + Security | NOT REVIEWED |
| Offer claims | Fulfilment | Kept | Consumer | TO BE CONFIRMED | Same | Legal | NOT REVIEWED |
| Membership / Circle | Operate Connect | Kept | Contract + tax | TO BE CONFIRMED | Anonymise after | Legal | NOT REVIEWED |
| Lead Assist | Matching Stage 1 | Kept; no-train default | OD-010 | TO BE CONFIRMED; **no model training** until approved | Minimise contacts | Privacy | NOT REVIEWED |
| Enterprise files | Projects | Kept | Contract + tax | TO BE CONFIRMED | Project SOP | Legal + CA | NOT REVIEWED |
| Audit / ops cases | Security / grievance | Kept | CERT-In; disputes | Logs ≥ 180 days; cases TO BE CONFIRMED | Legal hold | Security + Legal | NOT REVIEWED |
| Marketing | N/A | Flag OFF | Consent | N/A while OFF | — | Privacy | NOT APPLICABLE — REASONED |
| Sentry errors | Reliability | Vendor | Minimise PII | TO BE CONFIRMED vs vendor default | Redaction | Security | NOT REVIEWED |

Deletion capability: privacy request workflow exists; **destructive purge gated**. Do not claim automated erasure.

## QUESTIONS FOR PROFESSIONAL REVIEW

Statutory vs contractual vs CERT-In clocks per row.

## QUESTIONS REQUIRING FOUNDER DECISION

FD15-RET-001 business minimums (not legal periods).
