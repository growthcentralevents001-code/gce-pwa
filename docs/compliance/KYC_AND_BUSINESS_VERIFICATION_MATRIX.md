# KYC and Business Verification Matrix

| Field | Value |
|-------|-------|
| **Document ID** | P15-KYC-001 |
| **Status** | DRAFT — exact document lists **Open (OD-020)** |
| **Checked** | 2026-08-15 |
| **Aadhaar** | **Not mandatory by default** (FD-039). Do not implement Aadhaar collection without legal basis + Founder approval. |

Distinguish **legal/business verification** from unnecessary personal ID collection.

---

| Actor | Why verify | Suggested fit-for-purpose (not final) | Aadhaar | Payout recipient | Professional |
|-------|------------|----------------------------------------|---------|------------------|--------------|
| Customer (ticket) | Account integrity | Email/phone; payment via PSP | No | N/A | Privacy |
| Connect Member | Business community | Business proof / GST if claimed; PAN if CA requires | No default | If refunds | Ops + Legal |
| Connect BDP | Pack + commission | Business KYC; bank for later payout | No default | Yes when payouts ON | Legal + CA + PSP |
| Marketplace BDP | Same | Same | No default | Yes | Same |
| Enterprise BDP | Same | Same | No default | Yes | Same |
| Venue Partner | Listing + fulfilment + later payout | Business identity, address, GST if registered, capacity authority | No default | Yes | Legal + CA |
| Enterprise Client | Contract | Org identity, signatory authority | No | Pays in | Legal |
| Vendor (managed) | Project quality | Business identity; no self-serve portal | No default | If paid | Legal + CA |
| Staff | Employment | HR — out of product | — | Payroll | HR/Legal |

Code/docs scan: Aadhaar appears as **posture / redaction / `aadhaar_used` flags**, not as a mandatory onboarding field on public forms. Admin WIP is **unrelated** and must not silently add Aadhaar fields.

## QUESTIONS FOR PROFESSIONAL REVIEW

OD-020 exact lists; whether PAN is required for BDP payouts; PSP merchant KYC vs GCE KYC.

## QUESTIONS REQUIRING FOUNDER DECISION

Do not add Aadhaar workflows (OD-019) without this matrix signed.
