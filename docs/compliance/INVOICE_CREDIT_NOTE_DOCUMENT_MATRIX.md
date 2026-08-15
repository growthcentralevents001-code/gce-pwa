# Invoice and Credit Note Document Matrix

| Field | Value |
|-------|-------|
| **Document ID** | P15-INV-001 |
| **Status** | PROPOSED — **do not implement** until CA/legal model approved |
| **Checked** | 2026-08-15 |

Issuer/recipient depend on FD15-MOR-001. Placeholders: GSTIN **MISSING**.

---

| Flow | Proposed issuer (if Model A) | Recipient | Tax invoice vs other | Notes |
|------|------------------------------|-----------|----------------------|-------|
| Ticket sale | Logixia | Customer | Tax invoice if taxable supply | Model B: Venue may invoice |
| Ticket refund | Logixia | Customer | Credit note | GST reversal — CA |
| Connect membership | Logixia | Member | Tax invoice | |
| BDP pack | Logixia | BDP | Tax invoice | Characterise licence vs service — CA |
| GCE platform commission (Marketplace) | Logixia? or not a customer line | — | May be internal residual | CA: one invoice vs three |
| Venue 80% | Settlement statement ± Venue invoice to Logixia | Logixia or customer | **Open** | Self-billing question |
| MBDP 10% | MBDP invoice to Logixia or self-bill | Logixia | Commission invoice | CA |
| EBDP 25% of platform commission | EBDP → Logixia | Logixia | Commission | |
| Enterprise client | Logixia and/or vendors per SOW | Client | Tax invoices per component | No universal 30/40/30 |
| Offer in-store | Venue | Customer | Venue bill | Platform claim is not automatically an invoice |

Settlement statement ≠ tax invoice unless CA says the statement is the invoice.

## QUESTIONS FOR PROFESSIONAL REVIEW

Self-billing agreements; e-invoice IRN; series of documents.

## QUESTIONS REQUIRING FOUNDER DECISION

Whether Pilot will issue any invoices at all (FD15-PIL-001).
