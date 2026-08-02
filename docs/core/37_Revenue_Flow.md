# Revenue Flow (Canonical)

## Authority

**Foundational model:** FD-001 · **Ledgers:** FD-020 · **Settlement triggers:** FD-021 · **Membership activation:** FD-022 · **Connect BDP commercial:** FD-025 · **GCE Enterprise:** FD-026

Numeric commercial constants: `36_Commercial_Constants.md`. This document describes **flow relationships**. Where conflicts exist, Founder Decisions win.

**Rule:** Payment receipt ≠ automatic settlement eligibility. Vertical-specific settlement triggers apply (FD-021).

## Purpose

This document is the **single source of truth** for how money moves through the GCE ecosystem: sources, splits, commissions, and lifecycle flows.

Numeric constants are defined only in `36_Commercial_Constants.md`. This document describes **flow and relationships**.

Always use vertical names: **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.

---

## Diversified revenue strategy

GCE generates revenue through multiple channels so the platform is not dependent on ticket sales alone (`04_Revenue_Model.md`).

### Primary streams (documented)

1. Membership subscriptions (GCE Connect)
2. GCE Marketplace revenue (listings, offers, commissions, promotions)
3. GCE Enterprise project revenue
4. Venue Partner–linked Marketplace activity (platform share)
5. Event revenue sharing
6. Franchise fees (Connect BDP / Marketplace BDP / Enterprise BDP models)
7. Offer management / campaign-related revenue
8. Business services (**Future**)
9. Advertising & promotions (**Future**)
10. Premium platform services (**Future**)

---

## Ecosystem business lifecycle

From `02_Business_Model.md`:

```text
Business Onboarding
        ↓
Membership / Partnership
        ↓
Business Networking
        ↓
Lead Generation
        ↓
AI Lead Distribution
        ↓
Business Transactions
        ↓
Revenue Generation
        ↓
Business Growth
        ↓
Renewal & Retention
```

---

## Flow by vertical

### A. GCE Connect — membership revenue

```text
Prospect
  ↓
Membership presentation / registration (often via Connect BDP)
  ↓
Quarterly subscription payment (Associate or Core)
  ↓
Verification / terms / applicable approval
  ↓
Membership activated (payment alone is insufficient — FD-022)
  ↓
Settlement eligibility for membership revenue (FD-021)
  ↓
Circle allocation + category seat
  ↓
Networking / referrals / AI Lead Assist eligibility
  ↓
Renewal (or temporary benefit suspension if not renewed)
```

**Platform income:** membership subscription fees.
**Partner income:** Connect BDP commission = **20%** of eligible GCE Connect subscription revenue attributed to the relevant Franchise Unit, including eligible renewals while the Franchise Unit remains active and responsible (FD-025). Commission is not guaranteed income. Rate and base summary: `36_Commercial_Constants.md`.
**Detail docs:** `05_Memberships.md`, `06_CBDP.md` (Connect BDP narrative), FD-025.

### B. GCE Marketplace — venue / offer / event revenue

```text
Venue Partner onboarded (often via Marketplace BDP)
  ↓
Verification
  ↓
Events / offers / campaigns published
  ↓
Customer booking or campaign conversion
  ↓
Gross transaction value
  ↓
Revenue share: per **`36_Commercial_Constants.md`** (GCE Marketplace revenue share)
  ↓
Marketplace BDP commission (where applicable; rate in Commercial Constants)
```

**Campaign floor:** minimum campaign revenue value in `36_Commercial_Constants.md`.
**Detail docs:** `07_MBDP.md` (Marketplace BDP narrative), `09_Venue_Partner.md`.

### C. GCE Enterprise — project revenue

```text
Corporate / institutional lead
  ↓
Enterprise BDP qualification and client attribution (client-based — FD-026)
  ↓
Event Requirement Brief → Enterprise Platform Expert assignment
  ↓
Service breakdown → vendor search / shortlist / quotations
  ↓
Proposal → client approval → Contract / Purchase Order
  ↓
Client payments (standard 30% / 40% / 30% — FD-021 / FD-026)
  ↓
Vendor work orders → Vendor-Led Physical Execution
  ↓
Completion evidence → client confirmation
  ↓
Settlement eligibility (payment ≠ automatic settlement)
  ↓
GCE platform commission → Enterprise BDP commission (25% of eligible platform commission)
  ↓
Vendor Opportunity Fee tracking where applicable (% unresolved)
  ↓
Project closure
```

**Platform income:** eligible GCE platform commission on Enterprise event revenue (standard **20%**; authorised reduced **15%–19%**).
**Partner income:** Enterprise BDP commission = flat **25%** of eligible platform commission (FD-026). Not guaranteed income. Illustrative examples in `36_Commercial_Constants.md`.
**Payment pattern:** Quotation → Approval → milestones. **Standard Founder-approved model (FD-021 / FD-026):** 30% confirmation / 40% readiness-or-execution / 30% completion (unless separately approved contract). Vendor settlement ≠ mere client payment to GCE.
**Detail docs:** `08_Enterprise_BDP.md`, `18_User_Flows.md`, FD-026.

### D. Franchise fee revenue

```text
Partner application (Connect BDP / Marketplace BDP / Enterprise BDP)
  ↓
Approval
  ↓
Franchise fee
  (Connect BDP: ₹50,000 per Franchise Unit — FD-025)
  (Enterprise BDP: ₹30,000 direct per Franchise Pack, or financed ₹36,000 — FD-026)
  ↓
Training / package inclusions where documented for that vertical
  ↓
Optional finance path only where documented and Founder-approved for that vertical
  (Connect BDP deferred finance: not active under FD-025)
  (Enterprise BDP financed pack: recovery from approved commission only — FD-026)
  ↓
Franchise / Franchise Unit / Franchise Pack active → capacity limits apply
```

Fees and finance math: `36_Commercial_Constants.md`.
Connect BDP Franchise Unit commercial rules: FD-025.
Enterprise BDP Franchise Pack commercial rules: FD-026.
Payments applicability: `21_Payments.md`.

### E. AI Lead Assist validation fee

```text
User submits requirement (free)
  ↓
Identity verification
  ↓
PRM validation
  ↓
User pays validation fee
  ↓
Lead becomes active → AI matching → Rainmaker → Pass Lead
  ↓
Ground verification
  ├─ Genuine → receiving member gets subscription credit
  └─ Non-genuine → fee forfeited; user flagged / possible block after repeats
```

Amounts: `36_Commercial_Constants.md`.
Full rules: `39_AI_Lead_Assist_Spec.md`.

---

## Revenue distribution buckets

From `04_Revenue_Model.md`, revenue may be distributed as:

- Platform revenue
- Stakeholder commissions
- Business incentives
- Referral rewards
- Franchise earnings

**Documented constraint:** distribution percentages vary by business module. Module-specific rates that *are* documented live in `36_Commercial_Constants.md`. Undocumented percentages must not be invented.

---

## Payment types inventory

From `21_Payments.md`:

- Memberships
- Event bookings
- Marketplace orders
- AI validation fees
- Franchise fees
- Training fees
- Enterprise projects
- Future subscriptions / wallet-related credits

Methods documented: UPI, cards, net banking, wallets, QR; future EMI, BNPL, international.

Statuses documented: Pending, Processing, Successful, Failed, Refunded, Cancelled.

---

## GCE Wallet and internal ledgers (FD-020)

`21_Payments.md` describes a future wallet that may hold:

- Membership credits
- AI lead credits
- Referral rewards
- Cashback
- Subscription credits
- Refund balance

User-facing Wallet may be unified. Internal ledgers (Customer, Escrow, Settlement, Commission, Rewards, Refund, Franchise Recovery, Tax) are Founder-approved categories (FD-020). Settlement timing: FD-021. Exact reward products / payout providers remain unresolved where not approved.

---

## Cross References

- Constants: `36_Commercial_Constants.md`
- Business model: `02_Business_Model.md`
- Revenue narrative: `04_Revenue_Model.md`
- Payments: `21_Payments.md`
- Roles: `35_Role_Taxonomy.md`
- AI Lead Assist: `39_AI_Lead_Assist_Spec.md`