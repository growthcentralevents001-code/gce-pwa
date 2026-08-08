# Revenue Flow (Canonical)

## Authority

**Highest authority for revenue recognition / commercial classification:** FD-028 · **Commission Engine / entitlement / BDP finance recovery:** FD-029 · **Marketplace BDP ops:** FD-033 · **Marketplace transaction / unattributed / approval / payout:** FD-037 · **Marketplace ticket MoR direction / BDP pack payment / cancellation default / compliance gates:** FD-039 · **Corporate / payment-entity principles:** FD-034 · **Foundational model:** FD-001 · **Ledgers:** FD-020 · **Settlement triggers:** FD-021 · **Membership activation:** FD-022 · **Membership commercial:** FD-027 · **Membership attribution / allocation:** FD-036 · **Connect BDP commercial:** FD-025 (finance amended by FD-029; confirmed FD-032) · **GCE Enterprise:** FD-026 · **Enterprise cross-vertical / quotation:** FD-038 · **Circle workshops / fee-collection controls:** FD-030 · **Lead Assist / Lead Intelligence monetisation principles:** FD-031

Numeric commercial constants: `36_Commercial_Constants.md`. This document describes **flow relationships**. Where conflicts exist, Founder Decisions win — for recognition **FD-028**; for commission/entitlement/recovery/Marketplace attributed 80/10/10 **FD-029**; for unattributed Marketplace 80/0/20 and transaction families **FD-037**; for Marketplace BDP operating rules **FD-033**; for membership attribution **FD-036**; for Enterprise cross-vertical / Finance co-sign / no-double-commission **FD-038**; for Circle workshop commercial controls **FD-030**; for Lead Assist monetisation architecture **FD-031**; for legal-entity vs brand and collected-funds identity **FD-034**; for **Marketplace ticket MoR business direction, 48-hour cancellation default, BDP pack online/offline payment, and money-movement compliance gates** **FD-039**.

**Rule:** Payment receipt ≠ automatic settlement eligibility. Vertical-specific settlement triggers apply (FD-021). Keep Gross Transaction Value, Collected Amount, Eligible Revenue, Platform Revenue, and Settlement-Eligible Amount separate (FD-028). Distinguish Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed / Recoverable Balance (FD-029). Pipeline/proposal values are not recognised revenue.

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
4. GCE Marketplace Platform Commission — attributed: **80% Venue Partner / 10% Marketplace BDP / 10% GCE net** (FD-029 / FD-037); unattributed: **80% / 0% / 20%** (FD-037)
5. GCE Enterprise Platform Commission
6. Advertising Revenue (products/prices unresolved; non-commissionable by default — FD-029)
7. Promotional Visibility Revenue (prices unresolved; non-commissionable by default)
8. Sponsorship Revenue (cash vs In-Kind Sponsorship Value; non-commissionable by default)
9. Administrative Fee Revenue (non-commissionable by default)
10. Franchise and Partner-Pack Fee Revenue (Connect / Marketplace / Enterprise per FD-025/026/029)
11. Vendor Opportunity Fee Revenue (concept only — non-active)
12. Pending Lead Assist Commercial Revenue (not activated; non-commissionable by default)
13. Ticketing / Booking, Technology / Digital-Service, Training / Workshop / Masterclass, Other Founder-Approved Revenue (details unresolved where not approved; non-commissionable by default). **GCE Circle Business Growth Workshops** (FD-030): normally optional; no automatic Connect BDP 20% or Governing Body share; pricing/fee/refund/platform fee/commission Unresolved.

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
Profile / business / geography / category / Tags / seat-availability check (before purchase — FD-036)
  ↓
Verification / KYC / terms
  ↓
Quarterly subscription payment (Associate ₹6,000 + tax; optional Tag 3/4 at +25% each) — payment does not guarantee a specific Circle seat
  ↓
Membership activated (payment alone is insufficient; may be Active pending allocation — FD-022 / FD-027 / FD-028 / FD-036)
  ↓
Separate Circle allocation (System proposes → Connect BDP assists → Platform confirms; 7-day reservation where applicable — FD-022 / FD-027 / FD-036)
  ↓
Connect BDP attribution confirmation (organic / unattributed members allowed — FD-036)
  ↓
Eligible / Platform recognition after activation + attribution where applicable; Settlement eligibility (FD-021 / FD-028)
  ↓
Networking / platform-recorded referrals / dual-confirmed closed business
  ↓
Renewal (30-day notice) / Grace (30 days) / Freeze / Transfer as applicable
  ↓
Future Core upgrade path only after eligibility + network readiness (not direct purchase at launch; not forced by category-full waitlist)
```

**Platform income:** Associate Tier subscription, Tag 3/4 subscriptions (Tag Subscription Revenue), future Core upgrade/renewal when applicable — only after payment + activation.
**Partner income:** Connect BDP commission = **20%** of eligible GCE Connect subscription revenue **validly attributed** to the Franchise Unit, including eligible Associate/Core and Tag 3/4 revenue when collected, attributed, activated, and settlement-eligible (FD-025 / FD-027 / FD-029 / FD-036). Where no valid attribution exists, no Connect BDP commission arises — do not call it pending CBDP commission. Transfer fees (Administrative Fee Revenue), event/training/advertising/sponsorship/Lead Assist/Marketplace/Enterprise amounts are not automatically commissionable. Commission is not guaranteed income. Finance recovery (if financed): up to ₹5,000 per cycle from earned/approved commission only from **Month 0** (FD-029).
**Lead Assist** remains Pending Lead Assist Commercial Revenue (not FD-028/FD-029-activated).
**Detail docs:** `05_Memberships.md`, `06_CBDP.md`, FD-027, FD-025, FD-028, FD-029, FD-036.

### B. GCE Marketplace — venue / offer / event revenue

```text
Venue Partner onboarded (often via Marketplace BDP; may temporarily lack valid MBDP attribution — FD-037)
  ↓
Verification
  ↓
Marketplace Event or Marketplace Offer Event drafted → Marketplace BDP recommends → Platform Marketplace Operations final-approves
  ↓
Customer Event Booking / Event Transaction OR Offer Claim → Offer Redemption / Conversion (Offer Claim ≠ revenue)
  ↓
Gross Transaction Value (not automatically GCE revenue)
  ↓
Collected Amount → Eligible Marketplace Event Revenue (after taxes/refunds/exclusions)
  ↓
Revenue share:
  With valid MBDP attribution (FD-029 / FD-037):
    80% Venue Partner · 10% Marketplace BDP · 10% GCE net
  Without valid MBDP attribution (FD-037):
    80% Venue Partner · 0% Marketplace BDP · 20% GCE
  ↓
Settlement / Payout — launch: monthly Platform-initiated batch; architecture configurable (FD-037)
  Settlement-Eligible Amount only after fulfilment/hold rules (FD-021 / FD-029)
```

**Campaign floor:** minimum Marketplace Offer Event **planned commercial value** **₹50,000** — not a GCE fee, guaranteed sales, mandatory deposit, or automatically recognised revenue (FD-037).
**Affiliate:** not active.
**Marketplace BDP:** commission **10%** only with valid attribution; direct fee **₹50,000** or financed **₹60,000** (₹5,000 + ₹55,000 Recoverable Balance from Month 0); **20** active Venue Partners per unit (FD-029 / FD-033).
**Detail docs:** `07_MBDP.md`, `09_Venue_Partner.md`, `36_Commercial_Constants.md`, FD-037.

### C. GCE Enterprise — project revenue

```text
Corporate / institutional lead (Enterprise Client organisation + Enterprise Client Representative — FD-038)
  ↓
Enterprise BDP qualification and client attribution (client-based; no territorial exclusivity — FD-026 / FD-038)
  ↓
Event Requirement Brief → Enterprise Platform Expert assignment
  ↓
Service breakdown → vendor / Venue Partner search (managed vendor records without mandatory login at launch — FD-038)
  ↓
Quotation: Expert prepares → commercial/platform review → Finance co-sign if > ₹5,00,000 → official issue
  ↓
Proposal → client approval → Contract / Purchase Order
  (Proposal / PO without payment = not recognised revenue — FD-028)
  ↓
Client payments per project-specific approved milestone schedule (FD-038; illustrative 30/40/30 is not universal)
  ↓
Componentised commercial model (platform/service · venue · vendor · other) — no double commission on same component (FD-037 / FD-038)
  ↓
Vendor work orders → Vendor-Led Physical Execution (GCE not ordinarily physical executor — FD-034 / FD-038)
  ↓
Completion evidence → client confirmation / milestone approval
  ↓
Settlement eligibility (payment ≠ automatic settlement)
  ↓
GCE Enterprise Platform Commission → Enterprise BDP commission (25% of eligible platform commission — not of total project value)
  ↓
Vendor Opportunity Fee tracking where applicable (% unresolved; non-active)
  ↓
Project closure / change orders versioned where material
```

**Platform income:** eligible GCE platform commission on Enterprise event revenue (standard **20%**; authorised reduced **15%–19%**).
**Partner income:** Enterprise BDP commission = flat **25%** of eligible platform commission (FD-026 / FD-038). Not guaranteed income. Illustrative examples in `36_Commercial_Constants.md`.
**Payment pattern:** Quotation → Approval → project-specific milestones. Marketplace venue use inside Enterprise does not apply Marketplace 80/10/10 to the entire project. Vendor settlement ≠ mere client payment to GCE.
**Detail docs:** `08_Enterprise_BDP.md`, `18_User_Flows.md`, FD-026, FD-028, FD-038.

### D. Franchise fee revenue

```text
Partner application (Connect BDP / Marketplace BDP / Enterprise BDP)
  ↓
Approval
  ↓
Franchise / Partner-Pack fee
  (Connect BDP: ₹50,000 direct per Franchise Unit, or financed ₹60,000 — FD-029)
  (Enterprise BDP: ₹30,000 direct per Franchise Pack, or financed ₹36,000 — FD-026)
  (Marketplace BDP: ₹50,000 direct, or financed ₹60,000 — FD-029)
  ↓
Training / package inclusions where documented and Founder-approved for that vertical
  ↓
Optional finance path only where documented and Founder-approved for that vertical
  (Connect BDP Commission-Recovery Finance Option: ₹5,000 + ₹55,000 Recoverable Balance from Month 0 — FD-029)
  (Marketplace BDP Commission-Recovery Finance Option: ₹5,000 + ₹55,000 Recoverable Balance from Month 0 — FD-029)
  (Enterprise BDP financed pack: recovery from approved commission only — FD-026; recoverable balance ≠ event revenue)
  ↓
Franchise / Franchise Unit / Franchise Pack active → capacity limits apply
```

Fees and finance math: `36_Commercial_Constants.md`.
Connect BDP Franchise Unit commercial rules: FD-025 (operating) / FD-029 (finance recovery).
Marketplace BDP Franchise Unit: FD-029.
Enterprise BDP Franchise Pack commercial rules: FD-026.
Payments applicability: `21_Payments.md`.

### E. AI Lead Assist / Lead Intelligence (FD-031)

```text
Lead submitted (Core Lead Rights — ordinary referral not gated by premium)
  ↓
Consent / quality verification (Unverified → Preliminarily Verified → Qualified / Rejected)
  ↓
AI classification + eligibility-first / Circle-first routing
  ↓
Human review where required (Opportunity Desk)
  ↓
Offered → Accept / Decline / Clarify / Duplicate / Invalid / Collaborate
  ↓
Follow-up → Dual-Confirmed Closed Business where applicable
  ↓
Optional paid layers (prices Unresolved): Lead Assist Pro · Expert-Assisted Lead Selection · Managed Opportunity
```

Historical ₹500 validation fee / Rainmaker-only / subscription-credit / forfeiture narrative is **not** active Stage-1 commercial. Success fee = Stage 4 / separate approval. Connect BDP does not automatically earn Lead Assist commission.
Full rules: FD-031 / `39_AI_Lead_Assist_Spec.md`.

---

## Revenue distribution buckets

From `04_Revenue_Model.md` / FD-028 / FD-029, amounts may be distributed as:

- Platform Revenue
- Stakeholder commissions (Estimated → Provisional → Earned → Settlement eligible → Paid / Recoverable)
- Business incentives
- Referral rewards
- Franchise earnings

**Documented constraint:** distribution percentages vary by business module. Module-specific rates that *are* documented live in `36_Commercial_Constants.md`. Undocumented percentages must not be invented.

Refunds reverse Eligible Revenue, Platform Revenue, and stakeholder commission proportionally. Chargebacks remove settlement eligibility and may create Recoverable Balance. GST/TDS excluded from Platform Revenue / commission bases unless separately approved. Recovery only from earned and approved commission — never from estimated, provisional, or held commission (FD-029).

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

Methods documented: UPI, cards, net banking, wallets, QR; future EMI, BNPL, international. Revenue normally through approved platform-connected channels; exceptional bank transfer requires proof, reconciliation, authorised finance approval, audited manual entry — no personal-account collection; cash is not a standard launch workflow (FD-028). **BDP commercial pack / Franchise Unit payments (FD-039):** online is the default; rare Admin-recorded offline bank payment (NEFT / RTGS / cheque / other approved bank method) is permitted with full evidence/audit trail; cash is not a normal activation method. **Marketplace event ticket MoR (FD-039):** Logixia is the intended MoR (collect then settle); GST/invoice/gateway/refund-accounting/TDS/settlement remain validation-gated. Default customer cancellation cutoff: **48 hours before event start** (FD-039); refund %/timeline/convenience-fee/chargeback/no-show remain separately pending. Wallet cash-out / consumer withdrawals and multi-currency go-live remain inactive until later Founder approval (FD-039).

Statuses documented: Pending, Processing, Successful, Failed, Refunded, Cancelled.

---

## GCE Wallet and internal ledgers (FD-020 / FD-028 / FD-029)

`21_Payments.md` describes a future wallet that may hold:

- Membership credits
- AI lead credits
- Referral rewards
- Cashback
- Subscription credits
- Refund balance

A wallet credit is **not** automatically revenue — it may be refund liability, promotional liability, earned stakeholder balance, pending commission, settlement payable, membership credit, Lead Assist credit, recovery balance, or manual adjustment (FD-028). A stakeholder wallet may show a **negative Recoverable Balance**, offset only against future eligible earnings — no automatic personal-bank debit (FD-029). User-facing Wallet may be unified. Internal ledgers (Customer, Escrow, Settlement, Commission, Rewards, Refund, Franchise Recovery, Tax) are Founder-approved categories (FD-020). Settlement timing: FD-021. Refundable security deposits are **liabilities**, not revenue when received. Exact reward products / payout providers remain unresolved where not approved.

---

## Multi-currency (FD-028 / FD-029)

Financial architecture must be multi-currency-capable. INR may be initial domestic transaction / reporting currency — not a permanently INR-only architecture. Activate currencies country-by-country after Founder and operational approvals. Commission records must preserve original currency, FX rate/source/timestamp, calculation/settlement/payout amounts — do not silently recalculate historical FX. Distinguish Transaction / Settlement / Reporting / Stakeholder Payout currencies.

---

## Cross References

- Commission Engine authority: FD-029
- Revenue recognition authority: FD-028
- Constants: `36_Commercial_Constants.md`
- Business model: `02_Business_Model.md`
- Revenue narrative: `04_Revenue_Model.md`
- Payments: `21_Payments.md`
- Roles: `35_Role_Taxonomy.md`
- AI Lead Assist: `39_AI_Lead_Assist_Spec.md`
