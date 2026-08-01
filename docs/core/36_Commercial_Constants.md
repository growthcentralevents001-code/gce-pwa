# Commercial Constants (Canonical)

## Authority

Commercial **numeric** constants historically documented in partner narratives. Founder Decisions FD-020/FD-021 govern wallet, ledgers, and settlement **principles**. Exact tax rates, GST/TDS, and many partner package values remain **Undocumented** or pending dedicated commercial Founder Decisions — do not invent.

Prefer role names **Connect BDP** / **Marketplace BDP** / **Enterprise BDP** in prose; section headers below may retain legacy CBDP/MBDP labels for search continuity with `06_CBDP.md` / `07_MBDP.md`.

## Purpose

This document is the **single source of truth** for every numeric commercial constant documented in GCE business documentation: fees, commissions, splits, limits, and targets.

Partner narrative, workflows, and KPIs remain in partner documents. Those documents must **reference this file** for numbers instead of restating them.

**Do not invent missing values.** Where a number is not stated in source docs, it is listed under **Undocumented**.

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

| Constant | Value | Source docs |
|----------|-------|-------------|
| Max business circles per Connect BDP (historical pack claim) | **5** (pending dedicated commercial Founder Decision; Circle lifecycle capacity 15/40 is FD-024) | `03_Stakeholders.md`, `06_CBDP.md`, `14_Business_Rules.md` |
| Monthly sales target | **₹5,00,000** | `03_Stakeholders.md`, `06_CBDP.md`, `14_Business_Rules.md` |
| Commission | **20%** | `03_Stakeholders.md`, `06_CBDP.md` |
| Franchise allocation | One franchise on approval; additional franchise reservation purchasable | `06_CBDP.md` |
| Franchise fee (₹) | **Undocumented** | — |
| Training fee (₹) | **Undocumented** (training fee described as mandatory under finance option; amount not stated) | `06_CBDP.md` |
| Commission calculation base | **Undocumented** (membership gross vs other base not stated) | — |

Month 1 expectations (non-numeric): build initial circle; start membership sales (`06_CBDP.md`).

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

`21_Payments.md` lists franchise payments as applicable for:

- Marketplace BDP Franchise
- Enterprise BDP Franchise
- Future Franchise Models

`06_CBDP.md` states every approved Connect BDP receives a franchise allocation and may purchase additional franchise reservation. **Connect BDP franchise fee amount remains undocumented**, and Connect BDP is not named in the `21_Payments.md` franchise payment applicability list. Both facts are preserved; reconciliation is a documentation gap, not a license to invent a fee.

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
