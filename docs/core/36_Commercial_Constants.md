# Commercial Constants (Canonical)

## Authority

Commercial **numeric** constants historically documented in partner narratives.

**Connect BDP commercial and operating numbers:** highest authority is `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`. Values in this file for Connect BDP must defer to FD-025 on conflict.

**GCE Enterprise commercial and operating numbers:** highest authority is `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md`. Values in this file for Enterprise must defer to FD-026 on conflict.

**GCE Connect Circle Membership commercial numbers:** highest authority is `docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md`. Values in this file for membership must defer to FD-027 on conflict.

Founder Decisions FD-020/FD-021 govern wallet, ledgers, and settlement **principles**. Exact tax rates, GST/TDS, and many Marketplace partner package values remain **Undocumented** or pending dedicated commercial Founder Decisions — do not invent.

Prefer role names **Connect BDP** / **Marketplace BDP** / **Enterprise BDP** in prose; section headers below may retain legacy CBDP/MBDP labels for search continuity with `06_CBDP.md` / `07_MBDP.md`.

## Purpose

This document is the **single source of truth** for every numeric commercial constant documented in GCE business documentation: fees, commissions, splits, limits, and targets.

Partner narrative, workflows, and KPIs remain in partner documents. Those documents must **reference this file** for numbers instead of restating them. For Connect BDP, this file summarises FD-025 — it does not replace FD-025.

**Do not invent missing values.** Where a number is not stated in source docs or Founder Decisions, it is listed under **Undocumented**.

---

## Vertical Naming

Always use:

- GCE Connect
- GCE Marketplace
- GCE Enterprise

---

## GCE Marketplace revenue share

| Constant | Value | Source docs |
|----------|-------|-------------|
| Venue Partner share | **80%** | `04_Revenue_Model.md`, `09_Venue_Partner.md`, `14_Business_Rules.md`, `21_Payments.md` |
| GCE Platform share | **20%** | same |
| Documented example base | ₹1,00,000 → Venue ₹80,000 / GCE ₹20,000 | `04_Revenue_Model.md`, `09_Venue_Partner.md` |

**Scope note (documented):** Marketplace revenue sharing is described for Marketplace business activity. Event-category-specific sharing “may differ” (`04_Revenue_Model.md`) — exact per-category variants are **not enumerated** in documentation.

---

## GCE Connect — Connect BDP constants (legacy label: CBDP)

**Authority:** FD-025. Full commercial and operating rules: `FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`. Narrative: `06_CBDP.md`.

Commercial operating unit: **Connect BDP Franchise Unit**. Circles, members, territory, and data remain with **GCE**. Territory model: **Performance-Protected Assigned Territory** (not permanently owned).

| Constant | Value | Source |
|----------|-------|--------|
| Franchise Activation Fee | **₹50,000 per Franchise Unit** (one-time; non-refundable after activation; not a security deposit; payable separately for every Franchise Unit) | FD-025 |
| Deferred finance for Connect BDP | **Not active** under FD-025 | FD-025 |
| Circle capacity per Franchise Unit | **Up to 5** GCE Connect Circles | FD-025 |
| Development target per Franchise Unit | **5 platform-activated Circles within 10 months** | FD-025 |
| Average pace | Approximately **one activated Circle every two months** (must not be described as one Circle every month) | FD-025 |
| Milestone reviews (cumulative activated Circles) | Month 2: 1 · Month 4: 2 · Month 6: 3 · Month 8: 4 · Month 10: 5 | FD-025 |
| Commission | **20%** of eligible GCE Connect subscription revenue attributed to the Franchise Unit | FD-025 |
| Renewal commission | Continues at **20%** on eligible renewals while the Franchise Unit remains active, the Connect BDP remains responsible, required retention/operating duties continue, and revenue remains eligible | FD-025 |
| Commission calculation base | Eligible successfully collected, linked, activated, settlement-eligible, correctly attributed subscription revenue (exclusions in FD-025) | FD-025 |
| Commission payout cadence | Calculated monthly; normally processed on the first day of the following month (exact banking-day adjustment: Pending Technical Design) | FD-025 |
| Tier 1 maximum Franchise Units | **10** (5 zones × up to 2 units; maxima, not guaranteed appointments) | FD-025 |
| Tier 2 maximum Franchise Units | **5** (5 zones × up to 1 unit) | FD-025 |
| Tier 3 maximum Franchise Units | **2** (2 platform-defined operating territories; “2.5 zones” is planning reference only) | FD-025 |
| Marketplace / Enterprise territory | Remain **separate** from Connect BDP territory rights (Enterprise BDP allocation is **client-based**, not territory-based — FD-026) | FD-025 / FD-026 |
| Expansion | Not automatic; after qualifying (5 Circles + performance/compliance); GCE may reserve an additional unit opportunity up to **5 months**; separate ₹50,000 fee; separate 5-Circle / 10-month target | FD-025 |
| Standard person / controlled-entity limit | Maximum **2** active Franchise Units (higher count requires special platform approval) | FD-025 |
| Illustrative full-capacity commission example | 40 × ₹2,000 → ₹80,000/Circle; × 5 Circles → ₹4,00,000; × 20% → ₹80,000 monthly commission — **illustrative only, not guaranteed income** | FD-025 |

Circle lifecycle capacity (members per Circle): minimum activation **15** founding members; maximum **40** members — FD-024 (not redefined by FD-025).

**Historical note (not FD-025-approved Connect target):** older partner narratives recorded a ₹5,00,000 monthly sales target. That figure is **not** the Founder-approved Connect BDP Franchise Unit target under FD-025. Do not treat it as current approved target unless a future Founder Decision reinstates it.

**Performance (FD-025):** missing two consecutive milestone review periods triggers formal performance review and a sixty-day corrective process — **not** automatic cancellation. Serious misconduct may trigger immediate suspension or termination.

---

## GCE Marketplace — Marketplace BDP constants (legacy label: MBDP)

| Constant | Value | Source docs |
|----------|-------|-------------|
| Max Venue Partners per franchise | **20** | `03_Stakeholders.md`, `07_MBDP.md`, `14_Business_Rules.md` |
| Marketplace franchise fee | **₹50,000** | `07_MBDP.md`, `14_Business_Rules.md` |
| Initial training fee (mandatory) | **₹5,000** | `07_MBDP.md`, `14_Business_Rules.md` |
| Finance company charge on financed amount | **20%** | `07_MBDP.md` |
| Total repayment under documented finance example | **₹60,000** | `07_MBDP.md` |
| Remaining payable after training fee | **₹55,000** | `07_MBDP.md` |
| EMI start | From **2nd month** | `07_MBDP.md` |
| Month 1 revenue target | **₹2,00,000** | `07_MBDP.md`, `14_Business_Rules.md` |
| Month 2+ minimum monthly revenue target | **₹5,00,000** | `07_MBDP.md`, `14_Business_Rules.md` |
| Commission | **10%** | `07_MBDP.md` |
| Commission calculation base | **Undocumented** | — |
| Definition of “revenue” for targets (GMV vs platform share) | **Undocumented** | — |

---

## GCE Enterprise — Enterprise BDP constants

**Authority:** FD-026. Full business and operating rules: `FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md`. Narrative: `08_Enterprise_BDP.md`.

Commercial operating unit: **Enterprise BDP Franchise Pack**. Allocation is **client-based**, not territory-based. Enterprise Clients, projects, and data remain with **GCE**. Physical fulfilment is vendor/stakeholder-led — GCE does not directly execute events (FD-026).

| Constant | Value | Source |
|----------|-------|--------|
| Minimum Enterprise project value | **₹1,00,000** eligible event revenue (excludes GST and statutory taxes) | FD-026 |
| Direct-payment Franchise Pack fee | **₹30,000** upfront per Franchise Pack (one-time; non-refundable after training or activation; not a security deposit; separate fee for every additional pack; no launch-phase discount) | FD-026 |
| Financed package total value | **₹36,000** per Franchise Pack | FD-026 |
| Financed initial payment | **₹5,000** | FD-026 |
| Financed recoverable balance | **₹31,000** | FD-026 |
| Maximum monthly finance recovery | Up to **₹5,000** from earned and approved Enterprise BDP commission only (lower of ₹5,000 or available approved commission; no automatic cash-shortfall demand; unrecovered balance carries forward; no interest beyond fixed ₹36,000) | FD-026 |
| Active-client capacity per Franchise Pack | **30** | FD-026 |
| Standard packs per individual / controlled entity | Maximum **2** active packs (**60** active clients); more requires special platform approval | FD-026 |
| Monthly target per Franchise Pack | **₹3,00,000** eligible Enterprise event revenue (collected, attributed; excludes GST/taxes/refunds/reversals/chargebacks/cancelled/uncollected) | FD-026 |
| Rolling three-month target per Franchise Pack | **₹9,00,000** eligible Enterprise event revenue | FD-026 |
| Standard GCE platform commission | **20%** of eligible Enterprise event revenue | FD-026 |
| Reduced platform commission range | **15%–19%** for qualifying strategic projects (not automatic); **below 15%** requires special Founder or senior-authority approval | FD-026 |
| Enterprise BDP commission | Flat **25%** of eligible GCE platform commission actually earned (no tiered launch commission) | FD-026 |
| Enterprise Vendor Opportunity Fee | Success-based concept approved; **exact % and distribution unresolved** — do not invent | FD-026 |
| Standard client payment structure | **30% / 40% / 30%** (confirmation / readiness-or-execution milestone / completion) — standard model, not inflexible; payment ≠ settlement eligibility | FD-026 / FD-021 |
| Recommended Enterprise Platform Expert capacity | Maximum **10** active standard Enterprise projects (weighted major/multi-city capacity unresolved) | FD-026 |

Illustrative commission examples at ₹10,00,000 eligible event revenue (not guaranteed income):

- At 20% platform commission → ₹2,00,000 platform commission → ₹50,000 Enterprise BDP commission → ₹1,50,000 retained by GCE
- At 15% platform commission → ₹1,50,000 platform commission → ₹37,500 Enterprise BDP commission → ₹1,12,500 retained by GCE

**Historical note:** older documentation recorded Enterprise franchise fee as ₹25,000 and commission as undocumented. Those figures are **superseded** by FD-026.

**Performance (FD-026):** formal review may be triggered by two consecutive missed monthly targets, missed rolling three-month target, or material servicing failure — progressive sixty-day corrective process; **not** automatic cancellation after one or two weak months. Serious misconduct may trigger immediate suspension or termination.

---

## Offer / campaign constants

| Constant | Value | Source docs |
|----------|-------|-------------|
| Minimum campaign revenue value | **₹50,000** | `07_MBDP.md`, `09_Venue_Partner.md`, `14_Business_Rules.md` |

---

## AI Lead Assist commercial constants

| Constant | Value | Source docs |
|----------|-------|-------------|
| Validation fee | **₹500** | `10_AI_Lead_Assist.md`, `14_Business_Rules.md`, `18_User_Flows.md`, `21_Payments.md`, `22_AI_Rules.md` |
| Genuine-lead subscription credit | **₹500** | `10_AI_Lead_Assist.md` |
| Credit recipient | Documented as the receiving member after genuine ground verification | `10_AI_Lead_Assist.md` |
| Whether validation fee funds the credit | **Undocumented** | — |

Full AI workflow: `39_AI_Lead_Assist_Spec.md`.

---

## Membership commercial constants

**Authority:** FD-027. Full commercial and operating rules: `FD-027_Membership_Commercial_and_Operating_Architecture.md`. Narrative: `05_Memberships.md`. Lifecycle timing: FD-022.

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
| Additional transfer in same 12 months | **₹1,000 plus tax** | FD-027 |
| Rejoining fee at launch | **None** | FD-027 |
| Post-activation refund | Normally **non-refundable** (exact matrix Pending Founder/Legal Approval) | FD-027 |
| Recommended Associate tenure before Core eligibility | **Six months** continuous active Associate Tier | FD-027 |
| Connect BDP commission on eligible membership / Tag 3 / Tag 4 revenue | **20%** of eligible GCE Connect subscription revenue (FD-025 / FD-027); transfer fees and Lead Assist fees not automatically commissionable | FD-025 / FD-027 |

Associate example before tax: ₹6,000 + Tag 3 ₹1,500 + Tag 4 ₹1,500 = ₹9,000 maximum quarterly. Future Core example: ₹9,000 + Tag 3 ₹2,250 + Tag 4 ₹2,250.

**Lead Assist commercial constants** (₹500 validation fee, credits, etc.) remain under Lead Assist documentation — **not** approved under FD-027 as base membership rules.

Membership benefits and rules: `05_Memberships.md`. Circle rules: `38_Circle_Architecture.md`.

---

## Franchise payment applicability (payments doc)

Franchise Activation Fee payments apply to:

- **Connect BDP Franchise Unit** — ₹50,000 per unit (FD-025); deferred finance not active under FD-025
- Marketplace BDP Franchise — see Marketplace BDP constants above
- **Enterprise BDP Franchise Pack** — ₹30,000 direct per pack, or financed ₹36,000 (₹5,000 initial + ₹31,000 recoverable from approved commission only) (FD-026)

Exact payment-route implementation, GST/TDS treatment, and banking-day payout adjustment remain Pending Technical Design / Pending Accounting Review / Pending Legal Review where not stated in Founder Decisions.

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

- Connect BDP commercial authority: `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`
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
