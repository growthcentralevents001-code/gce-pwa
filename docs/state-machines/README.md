# GCE PWA — State Machines (Business)

Documentation-only models of Founder-approved business lifecycles for Growth Central Events (GCE). These files describe **business states and transitions**; they are not database enums or implementation schemas.

Exact technical enum names remain **Pending Technical Design** unless a Founder Decision already locks them.

---

## Authority

Highest business authority: `docs/founder-decisions/`. Living docs in `docs/core/` defer to Founder Decisions on conflict.

Locked commercial / operating rules reflected across these machines:

| Rule | Source |
|------|--------|
| Membership **activation ≠** Circle **allocation** | FD-022, FD-036 |
| Circle thresholds **15 / 20 / 40**; max **40** seats | FD-024, FD-030, FD-032 |
| Dual Circle status families (lifecycle + constitutional) — do not collapse | FD-024, FD-030, FD-032 |
| Connect BDP commission requires **valid attribution** | FD-025, FD-029, FD-036 |
| Marketplace **80/10/10** (attributed) vs **80/0/20** (unattributed) | FD-033, FD-037 |
| Marketplace **Affiliate** inactive | FD-032, FD-039 |
| **No double commission** on the same rupee / component | FD-029, FD-037, FD-038 |
| Logixia **intended MoR** for Marketplace tickets (validation-gated) | FD-039, FD-034 |
| Paid Lead Assist / ₹500 / escrow / success-fee mechanics **inactive** (Stage 1 unpaid) | FD-031, FD-032, FD-039 |
| Default event cancel cutoff **48h** before start; refund % pending | FD-039 |
| Offer claim ≠ revenue; **72h** claim validity where applicable | FD-037 |
| Enterprise quote Finance co-sign at **₹5,00,000** | FD-038 |
| Project-specific milestones (not fixed 30/40/30) | FD-038 |
| Aadhaar **not mandatory by default** | FD-039 |

---

## Index

| File | Domain |
|------|--------|
| [SM_Membership.md](./SM_Membership.md) | Connect membership lifecycle |
| [SM_Circle.md](./SM_Circle.md) | Circle dual lifecycle + constitutional status |
| [SM_Circle_Seat.md](./SM_Circle_Seat.md) | Specialization seat reservation / allocation |
| [SM_Connect_BDP_Attribution.md](./SM_Connect_BDP_Attribution.md) | Connect BDP ↔ membership attribution |
| [SM_Marketplace_BDP_Attribution.md](./SM_Marketplace_BDP_Attribution.md) | Marketplace BDP ↔ Venue attribution |
| [SM_Venue_Partner.md](./SM_Venue_Partner.md) | Venue Partner onboarding / activity |
| [SM_Marketplace_Event.md](./SM_Marketplace_Event.md) | Ticketed Marketplace Event |
| [SM_Marketplace_Offer_Event.md](./SM_Marketplace_Offer_Event.md) | Marketplace Offer Event |
| [SM_Offer_Claim.md](./SM_Offer_Claim.md) | Customer offer claim (non-revenue) |
| [SM_Redemption.md](./SM_Redemption.md) | Event QR / offer redemption |
| [SM_Payment.md](./SM_Payment.md) | Platform payment records |
| [SM_Refund.md](./SM_Refund.md) | Refund workflow (economics placeholder) |
| [SM_Commission.md](./SM_Commission.md) | Stakeholder commission entitlement |
| [SM_Settlement.md](./SM_Settlement.md) | Settlement / payout eligibility |
| [SM_Enterprise_Opportunity.md](./SM_Enterprise_Opportunity.md) | Enterprise opportunity intake |
| [SM_Enterprise_Quote.md](./SM_Enterprise_Quote.md) | Enterprise quotation + Finance co-sign |
| [SM_Enterprise_Project.md](./SM_Enterprise_Project.md) | Enterprise project delivery |
| [SM_Enterprise_Milestone.md](./SM_Enterprise_Milestone.md) | Project-specific milestones |
| [SM_Lead_Assist.md](./SM_Lead_Assist.md) | AI Lead Assist Stage 1 (unpaid) |
| [SM_Role_Assignment.md](./SM_Role_Assignment.md) | Scoped role assignment lifecycle |
| [SM_KYC_Verification.md](./SM_KYC_Verification.md) | Identity / KYC verification |
| [SM_Ops_Case.md](./SM_Ops_Case.md) | Phase 13 shared ops case lifecycle |

---

## How to use

1. Treat each machine as a **business contract** for product and engineering.
2. Preserve dual Circle status fields; do not merge into one enum.
3. Do not invent transitions for items marked **Unresolved / Pending**.
4. Side effects and audit events are mandatory design inputs for Phase 2 workflows.
5. Implementation schemas, SQL, and API contracts live elsewhere — not in these files.

---

## Out of scope for this folder

- Database migrations / RLS / SQL
- API route contracts
- UI wireframes
- Exact refund percentages, chargeback SLAs, and pilot city (pending Founder / Legal / Finance where noted)
