# Commercial Constants (Canonical)

## Authority

Commercial **numeric** constants historically documented in partner narratives.

**Connect BDP commercial and operating numbers:** highest authority is `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`. Values in this file for Connect BDP must defer to FD-025 on conflict.

Founder Decisions FD-020/FD-021 govern wallet, ledgers, and settlement **principles**. Exact tax rates, GST/TDS, and many non-Connect partner package values remain **Undocumented** or pending dedicated commercial Founder Decisions — do not invent.

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
| Marketplace / Enterprise territory | Remain **separate** from Connect BDP territory rights | FD-025 |
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

| Constant | Value | Source docs |
|----------|-------|-------------|
| Enterprise franchise fee | **₹25,000** | `08_Enterprise_BDP.md` |
| Commission % | **Undocumented** | `08_Enterprise_BDP.md` states commission exists; no percentage |
| Training fee (₹) | **Undocumented** (mandatory under finance option; amount not stated) | `08_Enterprise_BDP.md` |
| Fixed monthly sales target (₹) | **Undocumented** (capacity monitored via analytics rather than fixed sales volume alone) | `08_Enterprise_BDP.md` |

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

| Constant | Value | Source docs |
|----------|-------|-------------|
| Subscription model | **Quarterly** | `05_Memberships.md`, `04_Revenue_Model.md` (plans described as quarterly) |
| Plans | Associate Membership; Core Membership | `05_Memberships.md`, `04_Revenue_Model.md` |
| Associate price (₹) | **Undocumented** | — |
| Core price (₹) | **Undocumented** | — |

**Language note:** `04_Revenue_Model.md` also states memberships generate recurring “monthly and quarterly” cash flow. Plan structure in `05_Memberships.md` is quarterly. Treat **plan cadence as quarterly** per `05_Memberships.md`; the monthly phrasing in `04` is cash-flow language, not a second plan cadence, until business clarifies.

Membership benefits and rules: `05_Memberships.md`. Circle rules: `38_Circle_Architecture.md`.

---

## Franchise payment applicability (payments doc)

Franchise Activation Fee payments apply to:

- **Connect BDP Franchise Unit** — ₹50,000 per unit (FD-025); deferred finance not active under FD-025
- Marketplace BDP Franchise — see Marketplace BDP constants above
- Enterprise BDP Franchise — see Enterprise BDP constants above

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
