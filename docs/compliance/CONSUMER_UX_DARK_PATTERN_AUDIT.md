# Consumer UX Dark Pattern Audit

| Field | Value |
|-------|-------|
| **Document ID** | P15-DP-001 |
| **Status** | INTERNAL AUDIT — NOT a CCPA clearance |
| **Checked** | 2026-08-15 |
| **Instrument** | CCPA Guidelines for Prevention and Regulation of Dark Patterns, 2023 (effective 30 Nov 2023) — SRC-006 |

Classification: **PASS** / **REVIEW** / **CHANGE REQUIRED**.

This is a documentation review of intended customer UX plus public pages. It is **not** a full live production crawl of every state. Payments and marketing automation are **OFF**, which removes several live-risk patterns.

---

| Specified pattern (Guidelines Annexure 1) | GCE observation | Class |
|-------------------------------------------|-----------------|-------|
| False urgency | No invented countdown scarcity found as a platform rule. Venue-generated Event copy could still create urgency — **moderation later**. | REVIEW (UGC) |
| Basket sneaking | No extra items injected at checkout in architecture. Convenience fee **not** invented — if added later, must be disclosed before payment (drip pricing overlap). | PASS (current) |
| Confirm shaming | Public terms/privacy are informational; no “No thanks, I hate events” patterns identified in orientation pages. | PASS (current) |
| Forced action | Registration needed for bookings (ordinary). Do **not** force unrelated marketing consent. Marketing flags OFF. | REVIEW (when consent UX ships) |
| Subscription trap | Associate membership is a commercial subscription — cancellation/refund matrix **Open (OD-007)**. Must not hide exit. Core direct purchase **inactive**. | REVIEW |
| Interface interference | Brand uses orange, not deceptive colour-contrast tricks as a documented pattern. Full a11y is Phase 14B baseline, not this audit. | REVIEW |
| Bait and switch | Offers: claim ≠ redemption ≠ revenue; ₹50,000 is planned sale value **not** a listing fee (FD-037). Must not advertise otherwise. | PASS (rules) / REVIEW (copy) |
| Drip pricing | Ticket tax/fee presentation **CA pending**. Hidden charges would be CHANGE REQUIRED if introduced. | REVIEW |
| Disguised advertisement | No ads/pixels found. Ranking/recommendation **inactive** unresolved formula. | PASS (current) |
| Nagging | Live push/email/SMS OFF. | PASS (current) |
| Trick questions | Consent checkboxes **not** auto-added in Phase 15. | PASS (current) |
| SaaS billing | Membership renewals exist as product; auto-renew mechanics/disclosures need lawyer review before money. | REVIEW |
| Rogue malware | N/A | NOT APPLICABLE — REASONED |

## Other consumer mapping (not dark-pattern labels)

| Topic | Status |
|-------|--------|
| Platform/entity identity | Partial (Logixia named; CIN/address missing) — REVIEW |
| Event seller / Venue information | Depends on MoR model — REVIEW |
| Pricing / taxes | CA pending — REVIEW |
| Cancellation | 48h cutoff directed; % Open — CHANGE REQUIRED before paid Pilot **copy** |
| Grievance | Process drafted; officer missing — CHANGE REQUIRED before public e-commerce |
| Misleading claims | Drafts forbid guaranteed referrals/revenue | REVIEW of marketing pages (out of Phase 15 design scope) |

No Phase 15 UI redesign. Only flag copy issues.

## QUESTIONS FOR PROFESSIONAL REVIEW

Lawyer to confirm whether current `/terms` stub itself is misleading by omission for live users.

## QUESTIONS REQUIRING FOUNDER DECISION

Refund economics so cancellation UX can be honest.
