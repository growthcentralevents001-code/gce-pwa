# Legal Document Publication Plan

| Field | Value |
|-------|-------|
| **Document ID** | P15-PUB-001 |
| **Status** | PLAN — drafts remain unpublished |
| **Checked** | 2026-08-15 |

Every external draft begins: `DRAFT — NOT FOR PUBLICATION OR EXECUTION — PROFESSIONAL LEGAL/TAX/PRIVACY REVIEW REQUIRED`.

---

## Classification

| Document | Internal | Public | Acceptance required | Downloadable | Checkout | Onboarding | Signature | Version history |
|----------|----------|--------|---------------------|--------------|----------|------------|-----------|-----------------|
| Privacy Notice | After approval | Yes | Notice + consent where required | Yes | Link | Link | No | Yes |
| Customer Terms | After approval | Yes | Clickwrap | Yes | Yes | Registration | Clickwrap | Yes |
| Refund policy (once decided) | | Yes | With terms | Yes | Yes | — | — | Yes |
| Connect Membership Terms | | Members | Yes | Yes | — | Membership | Clickwrap or sign | Yes |
| BDP Master Licence + schedules | | Counterparties | Yes | Yes | — | BDP | E-sign/PDF | Yes |
| Venue Partner Agreement | | Venues | Yes | Yes | — | Venue | E-sign/PDF | Yes |
| Offer Terms | | Customers + Venues | Claim flow | Yes | Claim | — | Clickwrap | Yes |
| Enterprise MSA / SOW | | Parties | Yes | Yes | — | Project | Sign | Yes |
| Vendor Terms | | Vendors | Yes | Yes | — | Vendor record | Sign | Yes |
| Lead Assist Terms | | Members using Assist | Yes | Yes | — | Assist | Clickwrap | Yes |
| Phase 15 registers | Internal | No | — | — | — | — | — | — |

## Versioning proposal (do not migrate schema without approval)

- `document_id` (e.g. GCE-CT-001)  
- `version` (semver or date)  
- `effective_date`  
- `acceptance_timestamp`  
- `user_id`  
- `surface` (checkout / register / pdf)  

P15-GAP-001.

Current public pages `/terms` and `/privacy` are **orientation stubs** — NEEDS UPDATE after professional approval. Do not paste unapproved drafts into production UI in Phase 15 without Founder+lawyer.

## QUESTIONS FOR PROFESSIONAL REVIEW

Clickwrap enforceability; bilingual need; consumer cooling-off.

## QUESTIONS REQUIRING FOUNDER DECISION

When to replace stubs; FD15-SIGN-001.
