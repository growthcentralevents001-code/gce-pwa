# Revenue Flow (Canonical)

## Authority

**Highest authority for revenue recognition / commercial classification:** FD-028 · **Foundational model:** FD-001 · **Ledgers:** FD-020 · **Settlement triggers:** FD-021 · **Membership activation:** FD-022 · **Membership commercial:** FD-027 · **Connect BDP commercial:** FD-025 · **GCE Enterprise:** FD-026

Numeric commercial constants: `36_Commercial_Constants.md`. This document describes **flow relationships**. Where conflicts exist, Founder Decisions win — for recognition and commercial classification, **FD-028 wins**.

**Rule:** Payment receipt ≠ automatic settlement eligibility. Vertical-specific settlement triggers apply (FD-021). Keep Gross Transaction Value, Collected Amount, Eligible Revenue, Platform Revenue, and Settlement-Eligible Amount separate (FD-028). Pipeline/proposal values are not recognised revenue.

## Purpose

This document is the **single source of truth** for how money moves through the GCE ecosystem: sources, splits, commissions, and lifecycle flows.

Numeric constants are defined only in `36_Commercial_Constants.md`. This document describes **flow and relationships**.

Always use vertical names: **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.

---

## Diversified revenue strategy

GCE generates revenue through multiple channels so the platform is not dependent on ticket sales alone (`04_Revenue_Model.md` / FD-028).

### Primary streams (approved categories — FD-028)

1. GCE Connect Membership Subscription Revenue
2. GCE Connect Tag Subscription Revenue
3. GCE Connect Event Revenue
4. GCE Marketplace Platform Commission (80% Venue Partner / 20% GCE of Eligible Marketplace Revenue)
5. GCE Enterprise Platform Commission
6. Advertising Revenue (products/prices unresolved)
7. Promotional Visibility Revenue (prices unresolved)
8. Sponsorship Revenue (cash vs In-Kind Sponsorship Value)
9. Administrative Fee Revenue
10. Franchise and Partner-Pack Fee Revenue (Connect BDP / Enterprise BDP approved; Marketplace BDP fee unresolved)
11. Vendor Opportunity Fee Revenue (concept only — non-active)
12. Pending Lead Assist Commercial Revenue (not activated under FD-028)
13. Ticketing / Booking, Technology / Digital-Service, Training / Workshop / Masterclass, Other Founder-Approved Revenue (details unresolved where not approved)

**Affiliate:** future-only — no active Marketplace Affiliate commission. **ZBP:** removed completely from current commercial model.

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
Platform membership application (Associate Tier at launch — FD-027)
  ↓
Verification / KYC / terms
  ↓
Quarterly subscription payment (Associate ₹6,000 + tax; optional Tag 3/4 at +25% each)
  ↓
Membership activated (payment alone is insufficient — FD-022 / FD-027 / FD-028)
  ↓
Separate Circle seat reservation / allocation (7-day reservation — FD-022 / FD-027)
  ↓
Eligible / Platform recognition after activation + attribution; Settlement eligibility (FD-021 / FD-028)
  ↓
Networking / platform-recorded referrals / dual-confirmed closed business
  ↓
Renewal (30-day notice) / Grace (30 days) / Freeze / Transfer as applicable
  ↓
Future Core upgrade path only after eligibility + network readiness (not direct purchase at launch)
```

**Platform income:** Associate Tier subscription, Tag 3/4 subscriptions (Tag Subscription Revenue), future Core upgrade/renewal when applicable — only after payment + activation.
**Partner income:** Connect BDP commission = **20%** of eligible GCE Connect subscription revenue attributed to the Franchise Unit, including eligible Associate/Core and Tag 3/4 revenue when collected, attributed, activated, and settlement-eligible (FD-025 / FD-027 / FD-028). Transfer fees (Administrative Fee Revenue), event/training/advertising/sponsorship/Lead Assist amounts are not automatically commissionable. Commission is not guaranteed income.
**Lead Assist** remains Pending Lead Assist Commercial Revenue (not FD-028-activated).
**Detail docs:** `05_Memberships.md`, `06_CBDP.md`, FD-027, FD-025, FD-028.

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
Gross Transaction Value (not automatically GCE revenue)
  ↓
Collected Amount → Eligible Marketplace Revenue (after taxes/refunds/exclusions)
  ↓
Revenue share: 80% Venue Partner / 20% GCE Marketplace Platform Commission (FD-028)
  ↓
Settlement-Eligible Amount only after fulfilment/hold rules (FD-021)
```

**Campaign floor:** minimum campaign commercial value **₹50,000** — not guaranteed or automatically recognised revenue (FD-028).
**Affiliate:** not active.
**Marketplace BDP fee:** category only; exact fee Pending Founder Approval (FD-028). Older narrative numbers in `07_MBDP.md` are not Founder-final under FD-028.
**Detail docs:** `07_MBDP.md`, `09_Venue_Partner.md`, `36_Commercial_Constants.md`.

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
  (Proposal / PO without payment = not recognised revenue — FD-028)
  ↓
Client payments (standard 30% / 40% / 30% — FD-021 / FD-026)
  ↓
Vendor work orders → Vendor-Led Physical Execution
  ↓
Completion evidence → client confirmation / milestone approval
  ↓
Settlement eligibility (payment ≠ automatic settlement)
  ↓
GCE Enterprise Platform Commission → Enterprise BDP commission (25% of eligible platform commission)
  ↓
Vendor Opportunity Fee tracking where applicable (% unresolved; non-active)
  ↓
Project closure
```

**Platform income:** eligible GCE platform commission on Enterprise event revenue (standard **20%**; authorised reduced **15%–19%**).
**Partner income:** Enterprise BDP commission = flat **25%** of eligible platform commission (FD-026). Not guaranteed income. Illustrative examples in `36_Commercial_Constants.md`.
**Payment pattern:** Quotation → Approval → milestones. **Standard Founder-approved model (FD-021 / FD-026):** 30% confirmation / 40% readiness-or-execution / 30% completion (unless separately approved contract). Vendor settlement ≠ mere client payment to GCE.
**Detail docs:** `08_Enterprise_BDP.md`, `18_User_Flows.md`, FD-026, FD-028.

### D. Franchise fee revenue

```text
Partner application (Connect BDP / Marketplace BDP / Enterprise BDP)
  ↓
Approval
  ↓
Franchise / Partner-Pack fee
  (Connect BDP: ₹50,000 per Franchise Unit — FD-025)
  (Enterprise BDP: ₹30,000 direct per Franchise Pack, or financed ₹36,000 — FD-026)
  (Marketplace BDP: fee category recognised; exact model Pending Founder Approval — FD-028)
  ↓
Training / package inclusions where documented and Founder-approved for that vertical
  ↓
Optional finance path only where documented and Founder-approved for that vertical
  (Connect BDP deferred finance: not active under FD-025)
  (Enterprise BDP financed pack: recovery from approved commission only — FD-026; recoverable balance ≠ event revenue)
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
User pays validation fee  (Pending Lead Assist Commercial Revenue — FD-028 does not activate commercial model)
  ↓
Lead becomes active → AI matching → Rainmaker → Pass Lead
  ↓
Ground verification
  ├─ Genuine → receiving member gets subscription credit
  └─ Non-genuine → fee forfeited; user flagged / possible block after repeats
```

Amounts and workflow narrative remain under Lead Assist docs; commercial activation remains unresolved under FD-028.
Full rules: `39_AI_Lead_Assist_Spec.md`.

---

## Revenue distribution buckets

From `04_Revenue_Model.md` / FD-028, amounts may be distributed as:

- Platform Revenue
- Stakeholder commissions (Estimated → … → Earned → Settlement eligible → Paid / Recoverable)
- Business incentives
- Referral rewards
- Franchise earnings

**Documented constraint:** distribution percentages vary by business module. Module-specific rates that *are* documented live in `36_Commercial_Constants.md`. Undocumented percentages must not be invented.

Refunds reverse Eligible Revenue, Platform Revenue, and stakeholder commission proportionally. Chargebacks remove settlement eligibility and may create Recoverable Balance. GST/TDS excluded from Platform Revenue / commission bases unless separately approved (FD-028).

---

## Payment types inventory

From `21_Payments.md`:

- Memberships
- Event bookings
- Marketplace orders
- AI validation fees (Pending Lead Assist Commercial Revenue)
- Franchise fees
- Training fees
- Enterprise projects
- Advertising / promotional visibility / sponsorship (when products approved)
- Administrative fees
- Future subscriptions / wallet-related credits

Methods documented: UPI, cards, net banking, wallets, QR; future EMI, BNPL, international. Revenue normally through approved platform-connected channels; exceptional bank transfer requires proof, reconciliation, authorised finance approval, audited manual entry — no personal-account collection; cash is not a standard launch workflow (FD-028).

Statuses documented: Pending, Processing, Successful, Failed, Refunded, Cancelled.

---

## GCE Wallet and internal ledgers (FD-020 / FD-028)

`21_Payments.md` describes a future wallet that may hold:

- Membership credits
- AI lead credits
- Referral rewards
- Cashback
- Subscription credits
- Refund balance

A wallet credit is **not** automatically revenue — it may be refund liability, promotional liability, earned stakeholder balance, pending commission, settlement payable, membership credit, Lead Assist credit, recovery balance, or manual adjustment (FD-028). User-facing Wallet may be unified. Internal ledgers (Customer, Escrow, Settlement, Commission, Rewards, Refund, Franchise Recovery, Tax) are Founder-approved categories (FD-020). Settlement timing: FD-021. Refundable security deposits are **liabilities**, not revenue when received. Exact reward products / payout providers remain unresolved where not approved.

---

## Multi-currency (FD-028)

Financial architecture must be multi-currency-capable. INR may be initial domestic transaction / reporting currency — not a permanently INR-only architecture. Activate currencies country-by-country after Founder and operational approvals. Preserve original currency, FX rate/source/timestamp, and do not silently recalculate historical FX. Distinguish Transaction / Settlement / Reporting / Stakeholder Payout currencies.

---

## Cross References

- Revenue recognition authority: FD-028
- Constants: `36_Commercial_Constants.md`
- Business model: `02_Business_Model.md`
- Revenue narrative: `04_Revenue_Model.md`
- Payments: `21_Payments.md`
- Roles: `35_Role_Taxonomy.md`
- AI Lead Assist: `39_AI_Lead_Assist_Spec.md`
