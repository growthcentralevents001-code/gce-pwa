# Commercial Constants (Canonical)

## Authority

Commercial **numeric** constants historically documented in partner narratives.

**Commission Engine / stakeholder entitlement / BDP finance recovery / Marketplace 80/10/10:** highest authority is `docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md`. On Connect BDP finance and Marketplace BDP commission/fee/finance conflict, **FD-029 wins**. FD-029 supersedes only FD-025’s prior “deferred finance inactive” position and finalises Marketplace BDP rules previously unresolved under FD-028.

**Revenue recognition / commercial classification:** highest authority is `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md` (except where FD-029 finalises commission/finance numbers).

**Connect BDP commercial and operating numbers (other than finance activation):** FD-025, as amended by FD-029 for Commission-Recovery Finance Option.

**GCE Enterprise commercial and operating numbers:** FD-026 (FD-029 does not alter Enterprise BDP finance).

**GCE Connect Circle Membership commercial numbers:** FD-027.

Founder Decisions FD-020/FD-021 govern wallet, ledgers, and settlement **principles**. Exact tax rates, GST/TDS, advertising/premium/sponsorship prices, Lead Assist commercial activation, Vendor Opportunity Fee %, FX, rounding, max MBDP units per person, and MBDP target schedules remain **Pending** where not Founder-approved — do not invent.

Prefer role names **Connect BDP** / **Marketplace BDP** / **Enterprise BDP** in prose; section headers below may retain legacy CBDP/MBDP labels for search continuity with `06_CBDP.md` / `07_MBDP.md`.

## Purpose

This document is the **single source of truth** for every numeric commercial constant documented in GCE business documentation: fees, commissions, splits, limits, and targets.

Partner narrative, workflows, and KPIs remain in partner documents. Those documents must **reference this file** for numbers instead of restating them.

**Do not invent missing values.** Where a number is not stated in source docs or Founder Decisions, it is listed under **Undocumented** or **Pending Founder Approval**.

---

## Vertical Naming

Always use:

- GCE Connect
- GCE Marketplace
- GCE Enterprise

---

## Core financial concepts (FD-028 / FD-029)

| Concept | Rule |
|---------|------|
| Gross Transaction Value | Not automatically GCE revenue |
| Collected Amount | Successfully received and reconciled only |
| Eligible Revenue | After exclusions (taxes, refunds, reversals, chargebacks, invalid amounts, excluded credits, Founder-approved non-commissionable components) |
| Platform Revenue | GCE earned share — not total transaction value |
| Settlement-Eligible Amount | After FD-020 / FD-021 conditions; payment ≠ settlement |
| Commission states (FD-029) | Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed / Recoverable Balance — not interchangeable |

**Universal calculation order (FD-029):** Gross Transaction Value → exclude GST/taxes → discounts/credits → remove refunds/reversals/chargebacks/invalid amounts → Eligible Revenue → Platform Revenue or Stakeholder Entitlement → Stakeholder Commission → attribution → holds/deductions → Earned → Settlement Eligible → Settle.

---

## GCE Marketplace revenue share (FD-029)

| Constant | Value | Source |
|----------|-------|--------|
| Venue Partner Entitlement | **80%** of Eligible Marketplace Event Revenue | FD-029 |
| GCE Gross Marketplace Platform Commission | **20%** of Eligible Marketplace Event Revenue | FD-029 |
| Marketplace BDP commission | **10%** of Eligible Marketplace Event Revenue (paid from GCE’s 20%) | FD-029 |
| GCE Net Retained Share (after standard MBDP commission) | **10%** of Eligible Marketplace Event Revenue | FD-029 |
| After-MBDP split summary | 80% Venue Partner · 10% Marketplace BDP · 10% GCE net | FD-029 |
| Documented example | ₹1,00,000 Eligible → Venue ₹80,000 / MBDP ₹10,000 / GCE net ₹10,000 | FD-029 |
| Marketplace Affiliate commission | **Not active** (future-only) | FD-029 / FD-028 |

Equivalent interpretation: Marketplace BDP receives **50% of GCE’s standard 20%** Marketplace Platform Commission. Do **not** state MBDP commission is unresolved. Do **not** add MBDP 10% on top of a retained GCE 20%.

**Scope note:** Applies to Eligible Marketplace Event Revenue after recognition conditions. Event-category-specific variants remain **not enumerated** — do not invent.

---

## GCE Connect — Connect BDP constants (legacy label: CBDP)

**Operating authority:** FD-025. **Commission / finance recovery:** FD-029 (supersedes FD-025 “deferred finance inactive” only). Narrative: `06_CBDP.md`.

Commercial operating unit: **Connect BDP Franchise Unit**. Circles, members, territory, and data remain with **GCE**. Territory model: **Performance-Protected Assigned Territory** (not permanently owned).

| Constant | Value | Source |
|----------|-------|--------|
| Direct Franchise Unit fee | **₹50,000 per unit** (upfront; one-time; non-refundable after activation; not a security deposit; payable separately for every Franchise Unit) | FD-025 / FD-029 |
| Commission-Recovery Finance Option — total package | **₹60,000** | FD-029 |
| Financed initial activation payment | **₹5,000** | FD-029 |
| Financed Recoverable Balance | **₹55,000** | FD-029 |
| Maximum recovery per commission cycle | Lower of **₹5,000** or available earned and approved Connect BDP commission | FD-029 |
| Recovery start | **Month 0** — first cycle with valid earned, approved, settlement-eligible Connect BDP commission after activation (not registration/calendar month; not estimated/provisional/held commission) | FD-029 |
| Recovery source | Earned and approved Connect BDP commission only | FD-029 |
| Compulsory cash shortfall | **No** | FD-029 |
| Automatic personal-bank debit | **No** | FD-029 |
| Additional interest after activation | **No** | FD-029 |
| Unrecovered balance | Carries forward; exit/suspension does not automatically erase Recoverable Balance | FD-029 |
| Circle capacity per Franchise Unit | **Up to 5** GCE Connect Circles | FD-025 |
| Development target per Franchise Unit | **5 platform-activated Circles within 10 months** | FD-025 |
| Average pace | Approximately **one activated Circle every two months** (must not be described as one Circle every month) | FD-025 |
| Milestone reviews (cumulative activated Circles) | Month 2: 1 · Month 4: 2 · Month 6: 3 · Month 8: 4 · Month 10: 5 | FD-025 |
| Commission | **20%** of eligible GCE Connect subscription revenue attributed to the Franchise Unit | FD-025 / FD-029 |
| Renewal commission | Continues at **20%** on eligible renewals while the Franchise Unit remains active, the Connect BDP remains responsible, required retention/operating duties continue, and revenue remains eligible | FD-025 |
| Commission calculation base | Eligible successfully collected, linked, activated, settlement-eligible, correctly attributed subscription revenue | FD-025 / FD-029 |
| Commissionable items (when eligible) | Associate subscription/renewal, Core upgrade/renewal, Tag 3, Tag 4 | FD-025 / FD-027 / FD-029 |
| Not automatically commissionable | GST/taxes, transfer/admin fees, event/training/advertising/sponsorship/technology fees, Lead Assist, Marketplace/Enterprise revenue, penalties, complimentary/promotional credits, uncollected amounts | FD-025 / FD-029 |
| Renewal / reassignment attribution | Commission belongs to validly attributed Franchise Unit on the earning date; later reassignment does not automatically transfer historical earned commission | FD-029 |
| Commission payout cadence | Calculated monthly; normally processed on the first day of the following month (exact banking-day adjustment: Pending Technical Design) | FD-025 |
| Tier 1 maximum Franchise Units | **10** (5 zones × up to 2 units; maxima, not guaranteed appointments) | FD-025 |
| Tier 2 maximum Franchise Units | **5** (5 zones × up to 1 unit) | FD-025 |
| Tier 3 maximum Franchise Units | **2** (2 platform-defined operating territories; “2.5 zones” is planning reference only) | FD-025 |
| Marketplace / Enterprise territory | Remain **separate** from Connect BDP territory rights (Enterprise BDP allocation is **client-based**, not territory-based — FD-026) | FD-025 / FD-026 |
| Expansion | Not automatic; after qualifying (5 Circles + performance/compliance); GCE may reserve an additional unit opportunity up to **5 months**; separate fee; separate 5-Circle / 10-month target | FD-025 |
| Standard person / controlled-entity limit | Maximum **2** active Franchise Units (higher count requires special platform approval) | FD-025 |
| Illustrative full-capacity commission example | 40 × ₹2,000 → ₹80,000/Circle; × 5 Circles → ₹4,00,000; × 20% → ₹80,000 monthly commission — **illustrative only, not guaranteed income** | FD-025 |

Circle lifecycle capacity (members per Circle): minimum activation **15** founding members; maximum **40** members — FD-024. Constitution thresholds (FD-030): **Provisionally Active** at **20–39** approved and paid members; **Fully Constituted** at **40** (do not describe 20 as a full Circle). Seat distribution across four GC Power Sectors is **flexible** (not rigid 10/10/10/10).

**GCE Circle Business Growth Workshops** (FD-030): normally optional; payments via approved platform channels; Connect BDP does **not** automatically earn 20% of workshop revenue; Governing Body does not automatically receive a share; workshop pricing/fee/refund/platform fee/commission remain Unresolved — do not infer from membership or BDP commission.

**Historical note:** FD-025 previously stated deferred finance was not active. **FD-029 supersedes that finance-inactive position only** and activates the Commission-Recovery Finance Option above. Other FD-025 operating rules remain in force.

**Performance (FD-025):** missing two consecutive milestone review periods triggers formal performance review and a sixty-day corrective process — **not** automatic cancellation. Serious misconduct may trigger immediate suspension or termination.

---

## GCE Marketplace — Marketplace BDP constants (legacy label: MBDP)

**Authority:** FD-029 (finalises commission and finance previously unresolved under FD-028). Narrative: `07_MBDP.md`.

| Constant | Value | Source |
|----------|-------|--------|
| Direct Marketplace BDP Franchise Unit fee | **₹50,000** (upfront; one-time; non-refundable after activation) | FD-029 |
| Active Venue Partners per Franchise Unit | Maximum **20** | FD-029 |
| Additional capacity | More than 20 active Venue Partners requires another approved Franchise Unit | FD-029 |
| Maximum units per Marketplace BDP | **Pending Founder Approval** | FD-029 |
| Commission | **10%** of Eligible Marketplace Event Revenue (from GCE’s 20%) | FD-029 |
| Commission-Recovery Finance Option — total package | **₹60,000** | FD-029 |
| Financed initial activation payment | **₹5,000** | FD-029 |
| Financed Recoverable Balance | **₹55,000** | FD-029 |
| Maximum recovery per commission cycle | Lower of **₹5,000** or available earned and approved Marketplace BDP commission | FD-029 |
| Recovery start | **Month 0** — first cycle with valid earned, approved, settlement-eligible Marketplace BDP commission | FD-029 |
| Recovery source | Earned and approved Marketplace BDP commission only | FD-029 |
| Compulsory cash shortfall / automatic bank debit | **No** | FD-029 |
| Additional interest after activation | **No** | FD-029 |
| Unrecovered balance | Carries forward; exit/suspension does not automatically erase Recoverable Balance | FD-029 |
| Exact Month 1 / Month 2+ revenue targets | **Pending Founder Approval** | FD-029 |

**Not commission-creating alone (FD-029):** venue onboarding, event/offer listing, expected campaign value, proposal value, booking enquiry, unpaid/failed/reversed payment, uncompleted event, invalid/fraudulent transaction.

**Historical narrative superseded:** older text that treated MBDP fee/commission as unresolved, used ₹10,000 initial, ₹50,000 recoverable, Month 2 recovery start, first-month recovery holiday, or 50% recovery cap must not be treated as current. FD-029 figures above are Founder-final for fee, commission, finance, and capacity.

---

## GCE Enterprise — Enterprise BDP constants

**Authority:** FD-026. Recognition: FD-028. Commission Engine interaction: FD-029 (does **not** alter Enterprise finance structure).

Commercial operating unit: **Enterprise BDP Franchise Pack**. Allocation is **client-based**, not territory-based. Enterprise Clients, projects, and data remain with **GCE**. Physical fulfilment is vendor/stakeholder-led — GCE does not directly execute events (FD-026).

| Constant | Value | Source |
|----------|-------|--------|
| Minimum Enterprise project value | **₹1,00,000** eligible event revenue (excludes GST and statutory taxes) | FD-026 / FD-028 |
| Direct-payment Franchise Pack fee | **₹30,000** upfront per Franchise Pack (one-time; non-refundable after training or activation; not a security deposit; separate fee for every additional pack; no launch-phase discount) | FD-026 |
| Financed package total value | **₹36,000** per Franchise Pack | FD-026 |
| Financed initial payment | **₹5,000** | FD-026 |
| Financed recoverable balance | **₹31,000** (recoverable balance is **not** event revenue — FD-028) | FD-026 / FD-028 |
| Maximum monthly finance recovery | Up to **₹5,000** from earned and approved Enterprise BDP commission only (lower of ₹5,000 or available approved commission; no automatic cash-shortfall demand; unrecovered balance carries forward; no interest beyond fixed ₹36,000) | FD-026 |
| Active-client capacity per Franchise Pack | **30** | FD-026 |
| Standard packs per individual / controlled entity | Maximum **2** active packs (**60** active clients); more requires special platform approval | FD-026 |
| Monthly target per Franchise Pack | **₹3,00,000** eligible Enterprise event revenue (collected, attributed; excludes GST/taxes/refunds/reversals/chargebacks/cancelled/uncollected) | FD-026 |
| Rolling three-month target per Franchise Pack | **₹9,00,000** eligible Enterprise event revenue | FD-026 |
| Standard GCE platform commission | **20%** of eligible Enterprise event revenue | FD-026 / FD-028 |
| Reduced platform commission range | **15%–19%** for qualifying strategic projects (not automatic); **below 15%** requires special Founder or senior-authority approval | FD-026 / FD-028 |
| Enterprise BDP commission | Flat **25%** of eligible GCE platform commission actually earned (not 25% of total project value) | FD-026 / FD-029 |
| Enterprise Vendor Opportunity Fee | Success-based concept approved; **non-active**; **exact % and distribution unresolved** — do not invent | FD-026 / FD-028 |
| Standard client payment structure | **30% / 40% / 30%** (confirmation / readiness-or-execution milestone / completion) — standard model, not inflexible; payment ≠ settlement eligibility | FD-026 / FD-021 / FD-028 |
| Recommended Enterprise Platform Expert capacity | Maximum **10** active standard Enterprise projects (weighted major/multi-city capacity unresolved) | FD-026 |

Illustrative commission examples at ₹10,00,000 eligible event revenue (not guaranteed income):

- At 20% platform commission → ₹2,00,000 platform commission → ₹50,000 Enterprise BDP commission → ₹1,50,000 retained by GCE
- At 15% platform commission → ₹1,50,000 platform commission → ₹37,500 Enterprise BDP commission → ₹1,12,500 retained by GCE

**Historical note:** older documentation recorded Enterprise franchise fee as ₹25,000 and commission as undocumented. Those figures are **superseded** by FD-026.

**Performance (FD-026):** formal review may be triggered by two consecutive missed monthly targets, missed rolling three-month target, or material servicing failure — progressive sixty-day corrective process; **not** automatic cancellation after one or two weak months. Serious misconduct may trigger immediate suspension or termination.

---

## Offer / campaign constants

| Constant | Value | Source |
|----------|-------|--------|
| Minimum Marketplace campaign commercial value | **₹50,000** | FD-028 |
| Treatment | Minimum approved campaign value — **not** guaranteed collected revenue and **not** automatically recognised revenue | FD-028 |

---

## AI Lead Assist commercial constants

| Constant | Value | Status |
|----------|-------|--------|
| Validation fee / credit amounts historically documented | **₹500** (narrative) | **Pending Lead Assist Commercial Revenue** — FD-028 / FD-029 do **not** activate ₹500 fee, escrow, voucher, forfeiture, or Lead Assist commission |
| Credit recipient | Documented as the receiving member after genuine ground verification | Lead Assist docs only |
| Whether validation fee funds the credit | **Undocumented** | — |

Full AI workflow: `39_AI_Lead_Assist_Spec.md`. Non-commissionable by default under FD-029 until a separate commission model is approved.

---

## Membership commercial constants

**Authority:** FD-027. Lifecycle: FD-022. Recognition: FD-028. Commission: FD-029 / FD-025.

Official launch product: **GCE Connect Circle Membership — Associate Tier**. Member title: **GCE Connect Circle Member**. Core Tier is future / achievement-based and **not** directly purchasable at launch.

| Constant | Value | Source |
|----------|-------|--------|
| Launch billing cadence | **Quarterly only** (monthly/annual plans not active) | FD-027 |
| Associate Tier price | **₹6,000 per quarter** plus applicable taxes | FD-027 |
| Future Core Tier price | **₹9,000 per quarter** plus applicable taxes (not directly purchasable at launch) | FD-027 |
| Included Business Tags | **Tag 1 and Tag 2** included | FD-027 |
| Tag 3 | **+25%** of active base subscription | FD-027 |
| Tag 4 | **+25%** of active base subscription (not +50%) | FD-027 |
| Max Business Tags | **4** | FD-027 |
| Business Specializations per member | **1** approved | FD-027 |
| Primary Circle seats per membership | **1** (one member = one physical Circle seat) | FD-027 |
| Seat reservation | **7 days** | FD-027 / FD-022 |
| Renewal notice | **30 days** before expiry | FD-027 / FD-022 |
| Grace period | **30 days** after expiry | FD-027 / FD-022 |
| Freeze maximum | **90 days** | FD-027 / FD-022 |
| Recommended seat protection during freeze | **Up to 30 days** (not automatic full-90-day seat protection) | FD-027 |
| First transfer in 12 months | **Free** | FD-027 |
| Additional transfer in same 12 months | **₹1,000 plus tax** (Administrative Fee Revenue — not automatically Connect BDP commissionable — FD-028 / FD-029) | FD-027 / FD-028 / FD-029 |
| Rejoining fee at launch | **None** | FD-027 |
| Post-activation refund | Normally **non-refundable** (exact matrix Pending Founder/Legal Approval) | FD-027 |
| Recommended Associate tenure before Core eligibility | **Six months** continuous active Associate Tier | FD-027 |
| Connect BDP commission on eligible membership / Tag 3 / Tag 4 revenue | **20%** of eligible GCE Connect subscription revenue; recognition requires collection + activation | FD-025 / FD-027 / FD-029 |
| Core upgrade recognition | Actual upgrade amount collected only — not full Core subscription again | FD-028 |

Associate example before tax: ₹6,000 + Tag 3 ₹1,500 + Tag 4 ₹1,500 = ₹9,000 maximum quarterly. Future Core example: ₹9,000 + Tag 3 ₹2,250 + Tag 4 ₹2,250.

**Lead Assist commercial constants** remain under Lead Assist documentation — not approved under FD-027 and not activated under FD-028 / FD-029 as base membership commission.

Membership benefits and rules: `05_Memberships.md`. Circle rules: `38_Circle_Architecture.md`.

---

## Non-commissionable-by-default revenue (FD-029)

A revenue category is **not** commissionable merely because it exists. Non-commissionable by default until a separate Founder-approved commission model exists:

Advertising · Promotional Visibility · Sponsorship · Administrative Fee · Franchise and Partner-Pack Fee · Ticketing/Booking · Technology/Digital-Service · Training/Workshop/Masterclass · Lead Assist · Vendor Opportunity Fee · other newly introduced revenue.

---

## Deposits and removed ZBP model (FD-028 / FD-029)

| Item | Rule |
|------|------|
| Refundable security / partner deposit | **Liability** when received — not revenue |
| ZBP role / commission / security deposit / wallet / settlement | **Removed completely** — not active |

---

## Multi-currency commission (FD-028 / FD-029)

| Item | Rule |
|------|------|
| Architecture | Multi-currency-capable — not permanently INR-only |
| Commission records | Preserve original transaction currency, Eligible Revenue, rate, calculation currency amount, settlement currency, FX rate/source/timestamp, FX fee, reporting equivalent, payout amount |
| Calculation first | Approved transaction currency or contractual settlement currency |
| Historical FX | Must not be recalculated using later rates |
| FX gain/loss, provider-fee allocation, rounding | Pending Technical and Finance Approval |

---

## Franchise payment applicability (payments doc)

Franchise / Franchise Unit / Franchise Pack payments apply to:

- **Connect BDP Franchise Unit** — ₹50,000 direct, or Commission-Recovery Finance Option ₹60,000 (₹5,000 + ₹55,000 Recoverable Balance) (FD-029)
- **Marketplace BDP Franchise Unit** — ₹50,000 direct, or financed ₹60,000 (₹5,000 + ₹55,000 Recoverable Balance) (FD-029)
- **Enterprise BDP Franchise Pack** — ₹30,000 direct per pack, or financed ₹36,000 (₹5,000 initial + ₹31,000 recoverable from approved commission only) (FD-026)

Exact payment-route implementation, GST/TDS treatment, and banking-day payout adjustment remain Pending Technical Design / Pending Accounting Review / Pending Legal Review / Pending Tax Review where not stated in Founder Decisions.

---

## Referral rewards

| Constant | Value | Source docs |
|----------|-------|-------------|
| Referral rewards as distribution bucket | Mentioned | `04_Revenue_Model.md` |
| Referral reward amounts | **Undocumented** | — |
| Wallet holding referral rewards | Future | `21_Payments.md` |

---

## Maintenance rule

When business changes a commercial number:

1. Update **this file first**.
2. Update the owning partner/membership/AI doc narrative if needed.
3. Do not leave divergent copies of the number in other files.

---

## Cross References

- Commission Engine authority: `docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md`
- Revenue recognition authority: `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md`
- Connect BDP commercial authority: `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md` (finance superseded in part by FD-029)
- GCE Enterprise commercial authority: `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md`
- Membership commercial authority: `docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md`
- Revenue narrative: `04_Revenue_Model.md`, `37_Revenue_Flow.md`
- Roles: `35_Role_Taxonomy.md`
- Connect BDP: `06_CBDP.md`
- Marketplace BDP: `07_MBDP.md`
- Enterprise BDP: `08_Enterprise_BDP.md`
- Venue Partner: `09_Venue_Partner.md`
- Memberships: `05_Memberships.md`
- AI Lead Assist: `39_AI_Lead_Assist_Spec.md`
- Payments: `21_Payments.md`
- Business rules index: `14_Business_Rules.md`
