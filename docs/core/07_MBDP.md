# GCE Marketplace Business Development Partner (Marketplace BDP)

## Authority

**Operating architecture (appointment, units, venues, attribution, RM, performance, reassignment, suspension, exit, handover, data access):**
`docs/founder-decisions/FD-033_GCE_Marketplace_BDP_Commercial_and_Operating_Architecture.md`

**Commission / fee / finance / Marketplace attributed 80/10/10 share:**
`docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md`

**Marketplace transaction families, offer/event approval, unattributed revenue (80/0/20), redemption, payout direction, inactivity/reassignment cut-off, cross-vertical boundaries:**
`docs/founder-decisions/FD-037_GCE_Marketplace_Transaction_Approval_and_Unattributed_Revenue_Rules.md`

**Related:** FD-028 (revenue recognition) · FD-001 (platform model) · FD-023 (RBAC) · FD-021 (settlement) · FD-020 (ledgers) · FD-032 (supersession / Affiliate inactive / Phase 2 bounds) · FD-034 (Logixia contracting / payment / IP / no BDP bind-by-default) · FD-035 (Venue Representative / Venue Manager distinct from Marketplace BDP) · FD-039 (Commercial Licence / Independent Business Partner packaging; Franchise Unit = commercial package not automatic legal franchise; BDP pack online-default + controlled offline Admin bank payment; Marketplace ticket MoR direction; 48h cancellation default) · Commercial numbers: `36_Commercial_Constants.md`

On Marketplace BDP **operating** conflict, **FD-033 wins**. On fee / commission / finance / Recoverable Balance numbers, **FD-029 wins**. On transaction classification, approval authority, unattributed 80/0/20, QR vs offer redemption, launch payout cadence, and cross-vertical no-double-commission, **FD-037 wins**. On MoR business direction, cancellation default, and BDP pack payment collection, **FD-039 wins**. Marketplace Affiliate remains **future-only / inactive** (FD-028 / FD-029 / FD-032 / FD-033 / FD-039). Working legal packaging is **Commercial Licence / Independent Business Partner** — do not describe Marketplace BDP as an automatic formal legal franchisee, employee, partner, or agent (FD-039). Do not invent exact notice periods, appeal timelines, inactivity durations, utilisation thresholds, SLAs, tax rates, refund matrices, or insurance requirements (Pending Founder / Legal / Tax / Operational / Technical Design).

Approved role name: **GCE Marketplace Business Development Partner**. Short form: **Marketplace BDP**. Legacy abbreviation: **MBDP**.

---

## Role summary

The Marketplace BDP expands **GCE Marketplace** by identifying eligible Venue Partners, coordinating verification and onboarding, acting as **primary Relationship Manager** for assigned venues, supporting Marketplace Event and Marketplace Offer Event readiness, recommending campaigns for platform approval, maintaining venue information, supporting platform adoption, coordinating issue resolution, and supporting legitimate Marketplace revenue (FD-033 / FD-037).

Marketplace BDP authority is **vertical-specific**. Marketplace BDP must **not**:

- Final-approve Marketplace Events or Offer Events (recommends only — Platform Marketplace Operations final-approves — FD-037)
- Approve refunds or release settlement
- Alter commission, taxes, or customer rank
- Approve its own exception
- Hold customer or platform funds personally
- Promise guaranteed sales, events, or footfall
- Sell venue or customer data
- Permanently own a city, zone, district, market, or venue category
- Bind **Logixia Solutions Private Limited** without written/recorded authority (FD-034)
- Earn automatically from Connect, Enterprise, Lead Assist, sponsorship, advertising, training, workshops, or other unapproved streams
- Earn Marketplace commission without valid Venue Partner attribution (FD-037)

Settlement eligibility for Marketplace events follows completion + approved hold (FD-021), not payment alone. Distinguish Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed / Recoverable Balance (FD-029). Pending commission is not guaranteed payable. **No Marketplace BDP income is guaranteed** (FD-033).

**Revenue share (FD-029 / FD-037):** with valid attribution → 80% Venue / 10% Marketplace BDP / 10% GCE; without valid attribution → 80% Venue / 0% Marketplace BDP / 20% GCE. Do not call the unattributed GCE share “pending MBDP commission.” Later attribution is prospective by default.

**Transaction families (FD-037):** Marketplace Event; Marketplace Offer Event; Event Booking / Event Transaction; Offer Claim; Offer Redemption / Conversion; Settlement / Payout. Do not use “Marketplace Order” as an undefined umbrella.

**Venue Partner model (FD-037):** one canonical Venue Partner role family; business types are attributes/categories, not separate permission roles. Venue Representative / Venue Manager is distinct from Marketplace BDP.

**Inactivity / reassignment (FD-037):** temporary inactivity does not automatically terminate Marketplace BDP attribution; prolonged inactivity must be reviewed; dead/inactive venues must not consume capacity indefinitely; exact inactivity duration remains Operational Design. Reassignment cut-off = platform-recorded effective attribution date; historical entitlement preserved; future entitlement follows new valid attribution; no silent history rewrite.

**Payout (FD-037):** launch direction is monthly Platform-initiated payout batch; technical architecture must remain configurable for future cycles.

---

## Appointment and eligibility (FD-033)

Only **GCE** (platform operated under Logixia — FD-034) may appoint a Marketplace BDP. Package payment alone does **not** create appointment.

Appointment requires appropriate KYC, identity verification, background review, agreement acceptance, confidentiality and data-protection acceptance, training, platform approval, package or finance activation, and compliance clearance. Exact agreement wording: **Pending Legal Review**.

A Marketplace BDP is an appointed commercial and operating partner — not automatically an employee, shareholder, director, legal partner, owner of GCE Marketplace, or authorised signatory of Logixia (FD-034).

---

## Marketplace BDP Franchise Unit (FD-033 / FD-029)

The commercial operating unit is the **Marketplace BDP Franchise Unit** (commercial package/unit under Commercial Licence / Independent Business Partner packaging — FD-039; not automatic legal franchise).

| Rule | Value |
|------|-------|
| Active Venue Partners per unit | Up to **20** |
| Maximum active units per person / controlled entity | **2** (second unit not automatic) |
| Standard maximum portfolio | **40** active Venue Partners |
| Direct package | **₹50,000** |
| Financed package | **₹60,000** total; **₹5,000** initial; **₹55,000** Recoverable Balance; max **₹5,000** recovery per eligible commission cycle from **Month 0** |

**Pack payment collection (FD-039):** online payment through the approved platform payment architecture is the default. Rare offline bank-based payment (NEFT / RTGS / cheque / other approved bank method) may be accepted only through authorised Admin recording with full evidence and audit trail. Cash is not a normal activation method.

Second unit requires first-unit utilisation, good compliance, support quality, data accuracy, platform demand, operational capacity, platform approval, and applicable package activation. Exact utilisation threshold: **Pending Operational Design** — do not invent.

Numbers: `36_Commercial_Constants.md`.

---

## Territory and attribution model (FD-033)

Marketplace BDP operations are **venue-attribution based**, not permanent territory-owned.

A Marketplace BDP does **not** permanently own city, zone, district, market, or venue category. GCE may appoint multiple Marketplace BDPs in the same city.

New Marketplace Venue Partners should ordinarily be onboarded through an approved Marketplace BDP. GCE retains final approval. The validly onboarding Marketplace BDP becomes the venue’s **primary Relationship Manager**. No additional automatic RM commission layer is created.

Attribution and commission history must remain auditable. Reassignment does **not** erase prior attribution or already earned and approved commission. Future revenue after attribution ends does not automatically remain commissionable to the former Marketplace BDP.

---

## Venue onboarding workflow (FD-033)

1. Venue identified
2. Venue interest recorded
3. Venue consent
4. Venue profile
5. Ownership or operating authority verification
6. KYC and due diligence
7. Venue category and capability
8. Location and capacity
9. Commercial terms
10. Venue Partner agreement
11. Platform approval
12. Marketplace BDP assignment
13. Venue activation
14. Support initiation

Verification may include legal/business identity, ownership/authority, address, contacts, bank/tax details where required, photographs, capacity, facilities, licences, safety/statutory evidence, category eligibility, and platform-policy acceptance. No single document is absolute proof in every case.

---

## Relationship Manager duties (FD-033)

Marketplace BDP supports feature understanding, Event and Offer readiness, accurate information, issue escalation, response discipline, compliance, venue activity, renewal/reactivation where applicable, settlement workflow explanation, and coordination with GCE teams — for **assigned venues** only.

Data access must be role-based, purpose-limited, logged, revocable, and restricted to assigned venues and approved operations (FD-033 / FD-034).

---

## Commission and revenue split

**After standard Marketplace BDP commission (FD-029 / FD-033):**

| Party | Share of Eligible Marketplace Event Revenue |
|-------|-----------------------------------------------|
| Venue Partner | **80%** |
| Marketplace BDP | **10%** |
| GCE net retained | **10%** |

Marketplace BDP earns **10% of Eligible Marketplace Event Revenue**. It does **not** automatically earn from enquiry value, unpaid/cancelled/refunded amounts, tax, security deposit, refundable amounts, Enterprise, Connect, Lead Assist, sponsorship, advertising, training, workshops, or other unapproved streams.

No commission merely for finding a venue, draft profile, KYC submission, meeting, unapproved listing, enquiry, non-revenue assistance, or claim without evidence.

Commission cut-off on reassignment must consider revenue event date, earning event, attribution date, reassignment effective date, refund/reversal, rule version, and settlement state (FD-033). Exact cut-off implementation: **Pending Technical Design**.

---

## Performance objective (FD-033)

Recommended per-unit portfolio objective: **up to 20 active Venue Partners within ten months**.

This is an operating objective — **not** guaranteed income and **not** permission to onboard unsuitable venues. Exact Month-1 / Month-2+ ₹ revenue schedules remain **Pending Founder Approval** where not stated — do not invent.

---

## Venue inactivity and reassignment (FD-033)

Possible venue states include: Temporarily Inactive · Under Remediation · Suspended · Voluntarily Paused · Terminated · Transferred.

Temporary inactivity does **not** automatically end attribution.

Reassignment may occur due to Marketplace BDP exit, suspension, termination, persistent non-response, service failure, venue request, conflict of interest, fraud, incorrect assignment, portfolio restructuring, or mutual agreement with GCE approval.

Reassignment requires recorded reason, notice, evidence, response opportunity, effective date, attribution history, access update, and financial audit preservation. Exact notice/appeal timelines: **Pending Operational / Legal Design**.

Marketplace BDP may not privately sell or transfer venue attribution.

---

## Suspension, termination, exit, and handover (FD-033)

Documentation and systems must support suspension grounds and effects, termination grounds, voluntary exit, access revocation, venue continuity, portfolio handover, open disputes, pending compliance, pending settlement, and data controls.

Historical records and rule versions must remain auditable. Do not hard-delete attribution or financial history except approved legal privacy workflows (**Pending Privacy / Technical Design**).

---

## Marketplace Affiliate

**Inactive.** No current appointment, commission, attribution, settlement, wallet, dashboard, or revenue share (FD-029 / FD-032 / FD-033).

---

## Cross-vertical entitlement boundaries

Marketplace BDP has **no automatic entitlement** to Connect revenue, Enterprise revenue, Lead Assist revenue, sponsorship, advertising, workshops, or other non-approved streams (FD-029 / FD-033).

---

## Overview (product narrative)

Unlike Connect BDPs (memberships and Circles in **GCE Connect**), Marketplace BDPs focus on Venue Partner / business onboarding, marketplace growth, and eligible Marketplace revenue. Businesses may include hotels, restaurants, banquet halls, resorts, cafes, coworking spaces, retail shops, and other verified Venue Partner-eligible businesses under platform policy.

### Core responsibilities (summary)

- Identify and assess eligible Venue Partners
- Coordinate verification and onboarding
- Act as primary Relationship Manager for assigned venues
- Support Marketplace Event and Offer Event readiness
- Maintain accurate venue information
- Support platform adoption and issue resolution
- Support legitimate Marketplace revenue under approved attribution

---

## Finance Option (FD-029)

| Item | Value |
|------|-------|
| Total financed package | **₹60,000** |
| Initial activation payment | **₹5,000** |
| Recoverable Balance | **₹55,000** |
| Max recovery per commission cycle | Lower of **₹5,000** or available earned and approved Marketplace BDP commission |
| Recovery start | **Month 0** — first cycle with valid earned, approved, settlement-eligible Marketplace BDP commission |

No compulsory cash shortfall; no automatic bank debit; no recovery from estimated, provisional, or held commission; no additional interest after activation; unrecovered balance carries forward; exit/suspension does not automatically erase Recoverable Balance.

---

## Offer Campaign Rules

Every Venue Partner can create promotional campaigns through the GCE Marketplace.

Minimum Campaign commercial value: **₹50,000** (`36_Commercial_Constants.md` / FD-037) — minimum **planned commercial value**, **not** a GCE fee, guaranteed sales/GMV, mandatory deposit, or automatically recognised revenue.

---

## Dashboard Access

Every Marketplace BDP receives a dedicated dashboard with access limited to assigned / authorised scope, including Venue Partner management, attributed Marketplace revenue views, listings/offers, campaign analytics, notifications, Franchise Unit management, and performance views — subject to FD-023 / FD-033 / FD-034 data limits. Exact UI: **Pending Technical Design**.

---

## Typical business workflow

Venue identified → interest & consent → profile & verification → agreement → platform approval → Marketplace BDP assignment → venue activation → Event/Offer support → eligible collected revenue → commission engine (FD-029) → settlement eligibility (FD-021).

---

## Key Performance Indicators (KPIs)

Platform may measure: active Venue Partners, portfolio utilisation, data accuracy, support quality, attributed Eligible Marketplace Event Revenue, listing/offer readiness, renewal/reactivation support, and compliance. Exact scoring model: **Pending Operational Design**.

---

## Benefits (non-exhaustive)

- Commission **10%** of Eligible Marketplace Event Revenue when earning conditions are met (FD-029 / FD-033)
- Franchise expansion opportunity up to two units / 40 venues with platform approval
- Dedicated dashboard and training/support under platform policy
- Long-term Marketplace development opportunity — **not** guaranteed income

---

## Long-Term Vision

The Marketplace BDP program builds a network of verified Marketplace Venue Partners under platform governance, expanding **GCE Marketplace** while preserving venue attribution history, fair commission entitlement, and Logixia / GCE corporate boundaries (FD-033 / FD-034).
