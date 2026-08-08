# Revenue Model

## Authority

**Highest authority for revenue recognition and commercial classification:** `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md`

**Highest authority for Commission Engine / stakeholder entitlement / BDP finance recovery / Marketplace attributed 80/10/10:** `docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md`

**Highest authority for Marketplace transaction families, approval, unattributed 80/0/20, redemption, payout direction:** `docs/founder-decisions/FD-037_GCE_Marketplace_Transaction_Approval_and_Unattributed_Revenue_Rules.md`

**Related:** FD-001 · FD-020 (wallets/ledgers) · FD-021 (settlement) · FD-025 (Connect BDP operations) · FD-026 (Enterprise) · FD-027 (Membership commercial) · FD-031 (Lead Assist commercial boundaries) · FD-032 (supersession register; Connect finance active) · FD-033 (Marketplace BDP ops) · FD-034 (Logixia payment/invoice principles; collected funds ≠ automatic company revenue) · FD-036 (membership attribution) · FD-038 (Enterprise cross-vertical / Finance co-sign / no-double-commission) · **Constants:** `36_Commercial_Constants.md` · **Flows:** `37_Revenue_Flow.md` · **Lead Assist living:** `39_AI_Lead_Assist_Spec.md`

Do not assume one universal commission or settlement rule across verticals. Payment ≠ settlement eligibility. Do not invent advertising prices, Lead Assist commission, Vendor Opportunity Fee %, GST/TDS rates, Affiliate model, FX policy, or split-commission percentages. Tax and formal accounting remain Pending Tax / CA / audit review. Subject to Legal / Tax / Banking approval, platform payments ordinarily receivable by **Logixia Solutions Private Limited** (FD-034).

## Core financial concepts (FD-028)

Keep these separate — do not collapse into one unqualified “Revenue” figure:

| Concept | Meaning |
|---------|---------|
| **Gross Transaction Value** | Total commercial value before exclusions — **not** automatically GCE revenue |
| **Collected Amount** | Money successfully received and reconciled — excludes failed, unpaid, pending, reversed, disputed, verbal, proposal, or unconfirmed amounts |
| **Eligible Revenue** | Approved calculation base after exclusions (taxes, refunds, reversals, chargebacks, invalid amounts, excluded credits, Founder-approved non-commissionable components) |
| **Platform Revenue** | GCE’s earned commercial share — not equal to total transaction value |
| **Settlement-Eligible Amount** | Amount cleared for payout after reconciliation, attribution, fulfilment, holds, approvals, tax treatment, and settlement conditions (FD-020 / FD-021) |

**Operating recognition** requires successful collection, substantially completed earning obligation, correct attribution, activation/fulfilment where relevant, no unresolved fraud/dispute/refund/reversal/chargeback/compliance hold, determinable commercial rate, and required evidence/approvals. Collected but unearned money remains separate from earned Platform Revenue.

**Not recognised revenue:** lead/proposal/quotation/forecast/expected project value, verbal commitment, unsigned contract, PO without payment, uncollected invoice, unconfirmed advertising/sponsorship booking, cancelled milestone — pipeline/forecast analytics only.

---

Overview

The GCE (Growth Central Events) Revenue Model is designed to generate sustainable recurring income while creating value for every stakeholder within the ecosystem.

Unlike traditional event companies that depend only on ticket sales, GCE generates revenue through multiple business verticals, memberships, marketplace services, enterprise projects, and franchise operations.

The platform follows a diversified revenue strategy to ensure longterm growth and financial sustainability.

 Revenue Sources

The GCE ecosystem generates revenue from multiple independent business channels.

 Primary Revenue Streams (approved categories — FD-028)

 GCE Connect Membership Subscription Revenue
 GCE Connect Tag Subscription Revenue
 GCE Connect Event Revenue
 GCE Marketplace Platform Commission
 GCE Enterprise Platform Commission
 Advertising Revenue (products/prices Pending Founder Approval)
 Promotional Visibility Revenue (premium listings / paid placement — prices unresolved)
 Sponsorship Revenue (cash vs In-Kind Sponsorship Value separated)
 Administrative Fee Revenue (e.g. FD-027 transfer fee)
 Franchise and Partner-Pack Fee Revenue
 Vendor Opportunity Fee Revenue (concept only — rate unresolved)
 Pending Lead Assist Commercial Revenue (not activated under FD-028)
 Ticketing or Booking Service Revenue (details unresolved)
 Technology and Digital-Service Revenue (details unresolved)
 Training, Workshop, and Masterclass Revenue (details unresolved)
 Other Founder-Approved Revenue

Category existence does **not** automatically activate product, price, commission, tax, refund, or settlement rules.

 1\. Membership Revenue

Membership subscriptions are one of the primary recurring revenue sources for GCE Connect.

Members pay a quarterly subscription to participate in business networking, referrals, and community activities.

 Membership Plans

Launch product (FD-027):

 GCE Connect Circle Membership — Associate Tier
 Quarterly subscription only (**₹6,000** per quarter + applicable taxes)
 Local Circle networking eligibility (one primary Circle seat — separately approved)
 Business networking and referral opportunities (not guaranteed)
 Two included Business Tags; Tag 3 / Tag 4 available at +25% each

Future Core Tier (not directly purchasable at launch):

 GCE Connect Circle Membership — Core Tier
 Future achievement-based upgrade (**₹9,000** per quarter + tax when offered)
 Access to eligible cross-city and expanded opportunities through the active GCE network (not a nationwide guarantee)

Billing: quarterly only at launch. Monthly/annual plans are not active. Numbers: `36_Commercial_Constants.md`.

**Recognition (FD-028):** membership revenue requires payment + activation + correct attribution + no unresolved payment/compliance hold. Collected but unactivated payment remains **collected but unearned** and non-commissionable. Renewal requires payment + renewal activation. Core upgrade recognition uses only the **actual upgrade amount collected**, not the full Core subscription again. Grace status does not create new revenue. Tag 3 / Tag 4 are **GCE Connect Tag Subscription Revenue** and require Tag approval, payment, activation, attribution, and no unresolved hold.

 2. GCE Marketplace Revenue

**GCE Marketplace** allows verified businesses to promote events, products, services, and customer offers.

**Active Marketplace model (FD-029 / FD-037):**

With **valid Marketplace BDP attribution**:

```text
Eligible Marketplace Event Revenue
→ 80% Venue Partner Entitlement
→ 20% GCE Gross Marketplace Platform Commission
   → 10% Marketplace BDP commission (from GCE’s 20%)
   → 10% GCE Net Retained Share
```

After standard Marketplace BDP commission: **80% Venue Partner / 10% Marketplace BDP / 10% GCE net**. Marketplace BDP earns **10%** of Eligible Marketplace Event Revenue only where valid attribution exists (equivalent to 50% of GCE’s standard 20%). Do **not** state MBDP commission is unresolved. Do **not** retain GCE at 20% after paying MBDP when attribution is valid.

Without **valid Marketplace BDP attribution** (FD-037):

```text
Eligible Marketplace Event Revenue
→ 80% Venue Partner Entitlement
→ 0% Marketplace BDP
→ 20% GCE
```

Do **not** describe the missing 10% as unpaid or pending Marketplace BDP commission. Later MBDP assignment does not automatically create retroactive entitlement.

There is **no active Marketplace Affiliate** commission. Any Affiliate model is **future-only**. Do not use **“Marketplace Order”** as an undefined umbrella — distinguish Marketplace Event, Marketplace Offer Event, Event Booking / Event Transaction, Offer Claim, Offer Redemption / Conversion, and Settlement / Payout (FD-037).

Marketplace recognition requires verified Venue Partner, valid event/offer/campaign, collected payment, genuine transaction, fulfilment/redemption where required, refund/reversal adjustment, and no unresolved hold (FD-028). Marketplace BDP earning also requires valid MBDP attribution and accepted evidence (FD-029 / FD-037). Self-listing does not remove verification or financial controls. Offer Claim itself is **not** revenue.

**Approval:** Marketplace BDP recommends → Platform Marketplace Operations final-approves (FD-037).

Minimum Marketplace Offer Event **planned commercial value**: **₹50,000** — campaign qualification threshold; not a GCE fee, guaranteed sales/GMV, mandatory deposit, or automatically recognised revenue (FD-037).

**QR / redemption at launch (FD-037):** QR for ticketed Marketplace Event admission/validation; Offer Events use redemption code/token/equivalent — do not treat offer claim token as proof of revenue. Launch Venue Partner payout direction: **monthly Platform-initiated payout batch**; architecture must remain configurable for future cycles; Venue Partner / Marketplace BDP cannot directly release settlement.

**Marketplace BDP Franchise Unit (FD-029 / FD-033):** direct **₹50,000** or financed **₹60,000** (₹5,000 activation + ₹55,000 Recoverable Balance from Month 0); max **20** active Venue Partners per unit; maximum **2** units / **40** venues; venue-attribution model (no permanent city ownership). Temporary inactivity does not automatically terminate attribution; prolonged inactivity must be reviewed so dead venues do not consume capacity indefinitely (FD-037).

Canonical numbers: **`36_Commercial_Constants.md`**. Flow: **`37_Revenue_Flow.md`**.

 3\. Enterprise Revenue

**GCE Enterprise** generates **GCE Enterprise Platform Commission** on eligible corporate event procurement projects coordinated through the platform (FD-026 / FD-028 / FD-038).

GCE does **not** ordinarily directly execute physical events. Physical fulfilment is performed by approved stakeholders and vendors. Exact legal role may vary by contract (FD-034 / FD-038).

Standard GCE platform commission: **20%** of eligible Enterprise event revenue (authorised reduced range **15%–19%**; below 15% requires special approval). Enterprise BDP earns flat **25%** of eligible platform commission actually earned by GCE — **not** 25% of total project value. Minimum project value: **₹1,00,000** (excludes GST/taxes). Vendor Opportunity Fee remains an approved concept but **non-active**; % and distribution unresolved — keep separate from platform and Enterprise BDP commission.

Enterprise recognition should occur by approved milestone. **Milestones are project-specific and negotiated** — no universal mandatory advance/mid/final percentages for all projects (FD-038). An illustrative 30% / 40% / 30% pattern may appear in older narrative but is not a fixed universal rule. Each instalment requires collection, milestone approval, valid attribution, determinable platform commission, and no unresolved hold.

Quotations above **₹5,00,000** total proposed project value require Finance co-sign before final issue (approval threshold only — FD-038). Enterprise BDP alone may not issue binding quotations.

Enterprise may use Marketplace Venue Partners; this does **not** convert the whole project into a Marketplace transaction. Use componentised settlement. **No double commission** on the same eligible revenue component across Enterprise and Marketplace unless a later Founder Decision expressly authorises it (FD-037 / FD-038). Marketplace BDP does not automatically earn merely because its venue appears in an Enterprise project; Enterprise BDP does not automatically earn ordinary Marketplace revenue.

Numbers: `36_Commercial_Constants.md`.

 4\. Membership Subscription Revenue

Membership subscriptions generate recurring quarterly cash flow at launch (FD-027).

Revenue increases through:

 New Member Acquisition
 Membership Renewals
 Circle Expansion
 City Expansion

Recurring subscriptions provide predictable platform income. At launch, membership billing is **quarterly only** (FD-027). Phrasing about “monthly and quarterly” cash flow must not be read as an active monthly membership plan.

 5\. Franchise Revenue

Franchise, unit, and partner-pack fees are **Franchise and Partner-Pack Fee Revenue** — separate from membership, Marketplace transaction, and Enterprise transaction revenue (FD-028).

Revenue is generated through:

 GCE Connect Business Development Partner (Connect BDP) — Direct Franchise Unit **₹50,000** or Commission-Recovery Finance Option **₹60,000** (₹5,000 + ₹55,000 Recoverable Balance from Month 0) (FD-029; supersedes FD-025 finance-inactive only)
 GCE Marketplace Business Development Partner (Marketplace BDP) — Direct **₹50,000** or financed **₹60,000** (₹5,000 + ₹55,000 Recoverable Balance from Month 0); **20** active Venue Partners per unit; max **2** units (FD-029 / FD-033)
 Enterprise Business Development Partner (Enterprise BDP) — Franchise Pack **₹30,000** direct or financed **₹36,000** (₹5,000 initial + ₹31,000 recoverable from earned/approved Enterprise BDP commission only) (FD-026); financed recoverable balance is **not** event revenue

Connect BDP also earns **20%** of eligible GCE Connect subscription revenue attributed to the Franchise Unit, including eligible Associate/Core subscription and Tag 3 / Tag 4 revenue when collected, activated, attributed, and settlement-eligible (FD-025 / FD-027 / FD-029). Event fees, training, administrative fees, advertising, premium listings, sponsorships, technology services, Lead Assist, Marketplace, and Enterprise revenue do **not** automatically use this subscription-commission rule. Transfer fees are Administrative Fee Revenue and not automatically commissionable.

Enterprise BDP earns flat **25%** of eligible GCE platform commission on attributed Enterprise projects (FD-026 / FD-029). Commission is not guaranteed income.

**ZBP:** No ZBP role, commission, security deposit, wallet, settlement, or attribution is active (FD-028 / FD-029). Refundable deposits are **liabilities**, not revenue when received.

 6\. Venue Partner Revenue

Venue Partners generate Marketplace activity. Active share after standard MBDP commission: **80% Venue Partner / 10% Marketplace BDP / 10% GCE net** of Eligible Marketplace Event Revenue (FD-029). GCE Gross Marketplace Platform Commission remains 20% before MBDP share.

 7\. Event Revenue

Revenue is generated from:

 GCE Hosted Events
 Marketplace Events
 Enterprise Events
 Partner Hosted Events

Different event categories may have different pricing and revenuesharing structures. Event fees do not automatically use Connect BDP subscription commission.

 8\. Offer Campaign Revenue

Businesses can launch promotional campaigns through GCE Marketplace.

Examples:

 Discounts
 Cashback Offers
 Shopping Festivals
 Seasonal Campaigns
 Customer Acquisition Programs

Minimum campaign value ₹50,000 is not guaranteed collected or recognised revenue (FD-028). Revenue is generated through offer listing, campaign management, and platform commissions on valid collected transactions.

 9\. Advertising, Promotional Visibility, and Sponsorship (FD-028)

**Advertising Revenue** is an approved category (banner, category/city/event/dashboard ads, sponsored notifications, newsletter sponsorship, search-result promotion — exact products/prices unresolved). Paid ads must be labelled **Sponsored** and must not affect Trust Rank, Core eligibility, taxonomy, Circle-seat eligibility, compliance, organic referral routing, or verification.

**Promotional Visibility Revenue** covers premium listing / paid placement (Featured Venue/Event/Offer/Business Profile, search priority, homepage/category/city spotlight, time-limited campaign placement). Purchases exposure only — does not guarantee leads, referrals, sales, bookings, ranking, approval, Trust Rank, or Core eligibility, and cannot bypass verification, taxonomy, seat, relevance, compliance, or organic ranking integrity.

**Sponsorship Revenue** is an independent category (title, co-, session, venue, category, city, Circle-event, digital, hospitality, merchandise, technology, community sponsorship). Cash sponsorship requires contract, collection, attribution, obligation delivery, and hold clearance. **In-kind sponsorship** must not be shown as cash revenue — classify separately as **In-Kind Sponsorship Value**.

 10\. Administrative and other service revenue (FD-028)

Administrative Fee Revenue may include approved transfer, verification, document-processing, and service fees. The FD-027 ₹1,000 additional transfer fee is Administrative Fee Revenue — separate from membership subscription, not automatically Connect BDP commissionable, subject to tax, and excluded from membership-performance metrics.

Training, workshop, masterclass, ticketing/booking, and technology/digital-service revenue are approved categories in principle; exact prices, refunds, commissions, and tax treatment remain unresolved unless approved elsewhere. **GCE Circle Business Growth Workshops** (FD-030) are normally optional; Connect BDP does **not** automatically earn 20% of workshop revenue; Governing Body does not automatically receive a share; workshop commission must not be inferred from membership or BDP commission rules.

**Lead Assist** commercial treatment: **FD-031** / `39_AI_Lead_Assist_Spec.md` (with recognition classification under FD-028). Remains **Pending Lead Assist Commercial Revenue** under FD-028 — do not activate historical ₹500 fee, escrow, voucher, or Lead Assist commission as current. Optional Pro / verification / Expert Selection / Managed Opportunity prices and any success-fee model remain **Unresolved**. Stage 1 has **no automatic success fee**. Ordinary referrals are not payment-gated. Do not merge into membership, Connect BDP subscription commission, Marketplace, or Enterprise revenue. Connect BDP does not automatically earn on Lead Assist revenue (FD-029 / FD-031).

 Revenue Distribution

Revenue generated within the ecosystem is distributed according to predefined business rules.

Typical distribution includes:

 Platform Revenue
 Stakeholder Commissions — distinguish Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed / Recoverable Balance (FD-029); do not collapse into one generic “earnings” figure
 Business Incentives
 Referral Rewards
 Franchise Earnings

Distribution percentages vary depending on the business module. Recommended calculation sequence (FD-029): Gross Transaction Value → excluded taxes → discounts/credits → refunds/reversals → Eligible Revenue → Platform commission / Stakeholder Entitlement → Stakeholder commission → holds/deductions → Settlement-Eligible Amount → Net payout.

GST and statutory taxes are separately recorded and excluded from Platform Revenue and commission bases unless legally required or separately approved. TDS: gross entitlement first; TDS recorded separately at payout; show gross, TDS, and net separately. Exact rates Pending Tax Review. Exact order between TDS and finance recovery remains unresolved.

Discounts/coupons/credits must identify funding source. Wallet credits are not automatically revenue; a wallet may show a negative Recoverable Balance offset only against future eligible earnings — no automatic personal-bank debit (FD-029). Refunds reverse Eligible Revenue, Platform Revenue, and stakeholder commission proportionally; paid commission creates Recoverable Balance. Chargebacks remove settlement eligibility and may create recovery. No hard-delete of financial/commission records; attribution corrections use new correction entries with rule-version linkage; reassignment normally affects future earning events only (FD-028 / FD-029).

A revenue category is **not** commissionable merely because it exists (FD-029 non-commissionable-by-default).

 Multi-currency (FD-028)

GCE must use a **multi-currency-capable** financial architecture. Do not state the platform is permanently INR-only. INR may be used initially as domestic transaction and internal reporting currency. A currency becomes commercially active only after payment-provider, banking, settlement, invoicing, tax, refund, chargeback, FX, regulatory, payout, and Founder approval. Distinguish Transaction / Settlement / Reporting / Stakeholder Payout currencies. Preserve immutable original-currency and FX history; do not recalculate historical FX with later rates. Rounding policy Pending Technical and Finance Approval.

 Business Growth Strategy

Revenue growth is achieved through:

 Membership Growth
 Marketplace Expansion
 Enterprise Projects
 Franchise Network Expansion
 City Expansion
 AI Lead Distribution
 Business Retention
 Customer Acquisition

 LongTerm Revenue Vision

The longterm objective is to build a highly scalable recurring revenue model where income is generated from multiple independent business channels.

The platform is designed to reduce dependency on any single revenue source while continuously expanding through memberships, business partnerships, marketplace activity, enterprise projects, and franchise development.

This diversified approach ensures longterm financial stability and sustainable business growth.
