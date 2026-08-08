# Business Model

## Authority

**Highest authority for foundational business model:** `docs/founder-decisions/FD-001_Business_Model.md`

**Related Founder Decisions:** FD-020 (Wallet/ledgers), FD-021 (Settlement), FD-022 (Membership), FD-023 (RBAC), FD-024 (Circle lifecycle), FD-025 (Connect BDP commercial and operating architecture), FD-026 (GCE Enterprise business and operating architecture), FD-027 (Membership commercial and operating architecture), FD-028 (Revenue recognition and commercial architecture), FD-029 (Commission Engine and stakeholder entitlement), FD-030 (GCE Connect Circle architecture and governance), FD-031 (GCE Connect AI Lead Assist / Lead Intelligence architecture), FD-032 (Phase 1 authority / dual Circle status mapping / narrow supersessions), FD-033 (Marketplace BDP commercial and operating architecture), FD-034 (Logixia and GCE corporate/platform constitution), FD-035 (Identity / role / workspace), FD-036 (Membership attribution / approval / allocation), FD-037 (Marketplace transaction / unattributed revenue / approval), FD-038 (Enterprise cross-vertical commercial / approval), FD-039 (Phase 2 commercial acceptance / MoR direction / BDP legal packaging / cancellation / KYC / compliance gates).

This file is the living high-level **GCE business model** summary. Where it conflicts with FD-001 or a more specific later Founder Decision, the Founder Decision wins.

Official platform domain (FD-001): **growthcentralevents.com**.

## Corporate constitution (Founder Approved — FD-034)

```text
Logixia Solutions Private Limited
└── Growth Central Events — GCE Platform and Master Brand
    ├── GCE Connect
    ├── GCE Marketplace
    └── GCE Enterprise
```

- **Logixia Solutions Private Limited** is the intended legal company that owns, operates, manages, commercialises, and develops the GCE platform (subject to corporate documentation and Legal Review).
- **GCE** is the platform and master brand — currently a product/operating division under Logixia, **not** a separate legal company.
- Subject to Legal Review, Logixia should ordinarily be the contracting entity, payment-receiving entity, and invoice-issuing entity (GCE may appear as brand).
- For **GCE Marketplace event tickets**, Logixia Solutions Private Limited is the **intended Merchant of Record** — platform collects customer payment then settles Venue Partner and Marketplace BDP entitlements (FD-039). GST, invoice structure, gateway configuration, refund accounting, TDS/withholding, settlement compliance, and payment-aggregator applicability remain **validation-gated** before production money movement — do not invent rates or reopen the MoR business direction merely because validation is pending.
- Collected funds are not automatically Logixia revenue (stakeholder entitlements, tax, deposits, advances remain distinct).
- Logixia is the intended primary platform operator for data; exact data-fiduciary / controller / processor classification remains **Pending Legal and Privacy Review**. Personal data is not unrestricted company property.
- BDPs, members, Venue Partners, vendors, and Governing Body members do not automatically become employees, shareholders, directors, legal partners, owners of GCE/verticals, or persons able to bind Logixia. Working BDP legal packaging is **Commercial Licence / Independent Business Partner**; “Franchise Unit” is a commercial package/unit concept and does **not** automatically create a formal legal franchise (FD-039 / FD-034).
- Exact CIN, registered office, shareholding, directors, GST/TDS rates, invoice formats, and final contract wording remain Pending Legal / Corporate / Tax Review — do not invent.
- **AI-assisted legal drafting (FD-039):** AI is the primary first-draft assistant for platform legal/compliance instruments (Terms of Use, Membership Terms, BDP agreements, Venue Partner / Enterprise Client / Vendor Terms, Event Booking / Offer / Cancellation / Refund / Privacy policies, KYC declarations, AUP, commission/settlement clauses, COI/IP/confidentiality, suspension/termination, dispute resolution, limitation of liability, disclosures, and similar). AI drafts are **not** automatically production-final — final applicable legal/compliance validation is required before publication or binding reliance. Do not require that legal counsel must draft every instrument from scratch.
- **Applicable Law & Compliance Register (FD-039):** Canonical compliance work must maintain a register mapping actual applicability across relevant areas (including, where applicable: DPIIT policies/requirements; Consumer Protection Act, 2019; Consumer Protection (E-Commerce) Rules, 2020 and amendments/advisories; CCPA guidance including dark-pattern guidance; applicable data-protection law/rules; IT requirements; Companies Act / corporate requirements; GST; Income-tax / TDS; RBI / payment-aggregator / payment-system requirements; IP law; Contract law; sector-specific venue/event/enterprise requirements). Do **not** assume one single “DPIIT Act and Rules 2023” governs GCE.
- Architecture/build may proceed while production money-movement go-live remains compliance-gated (GST/invoice/gateway/refund-accounting/TDS/settlement, final BDP agreements, register completeness, privacy/KYC retention, cancellation/refund disclosures, Venue/Enterprise/Vendor agreements, offline payment controls) — FD-039.

## Founder-approved platform principles (summary)

- GCE is **one unified platform** (not separate disconnected apps per vertical).
- Primary verticals: **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.
- **One GCE account**; multiple compatible roles; **role-based workspaces** (a workspace is not a separate account).
- BDP roles are **vertical-specific**; one BDP role does not automatically control another vertical.
- Membership and Circle seat are **separate** concepts; membership does not automatically guarantee a Circle seat.
- Circles are **platform assets** under Logixia / GCE; Connect BDP and Governing Body (legacy Circle Board) do **not** own Circles (FD-024 / FD-030 / FD-034).
- Circle dual status families (FD-032): lifecycle Formation / Active Growth / Full Capacity and constitutional Formation / Provisionally Active / Fully Constituted — official mapping in `38_Circle_Architecture.md`. Platform activation and Connect BDP target credit at formal **15**; Provisionally Active at **20**; Full Capacity/Fully Constituted at **40**.
- Circle internal structure uses four fixed **GC Power Sectors**, one primary Business Specialization, Protected Tag Scope, and max four Tags; seats are flexible across sectors (not rigid 10/10/10/10) — FD-030. Governing Body term **six months**; **Circle Finance Coordinator** is current finance-support role (Treasurer legacy — FD-032).
- Connect BDP commercial unit is the **Connect BDP Franchise Unit** (FD-025): assigned Performance-Protected territory, separate fee per unit, up to five Circles per unit — not ownership of territory, Circles, members, or data. Franchise Unit = commercial construct under Commercial Licence / Independent Business Partner packaging (FD-039) — not automatic legal franchise, employment, partnership, or agency.
- Marketplace BDP commercial unit (FD-033): up to **20** venues/unit, max **2** units / **40** venues; venue-attribution model; no permanent city ownership; primary RM for assigned venues.
- GCE Enterprise is a technology-enabled, stakeholder-fulfilled procurement / workflow / financial-control platform (FD-026 / FD-034). GCE does **not** ordinarily become the physical venue/caterer/decorator/production/security executor unless Logixia expressly contracts that service. Exact Enterprise legal role may vary by contract.
- GCE Connect Circle Membership launch product is **Associate Tier** at ₹6,000/quarter (FD-027); Core Tier is future/achievement-based and not directly purchasable; membership ≠ automatic Circle seat; activation ≠ allocation; organic/unattributed members allowed (FD-036).
- User-facing Wallet may be unified; internal accounting uses **separate ledgers** (FD-020). Wallet credits are not automatically revenue (FD-028). Wallet cash-out / consumer withdrawals remain **inactive** until later Founder approval (FD-039).
- Payment collection does **not** automatically mean settlement eligibility or earned Platform Revenue (FD-021 / FD-028). Keep Gross Transaction Value, Collected Amount, Eligible Revenue, Platform Revenue, and Settlement-Eligible Amount separate.
- Active Marketplace model: with valid MBDP attribution **80% Venue Partner / 10% Marketplace BDP / 10% GCE net**; without valid attribution **80% / 0% / 20%** (FD-029 / FD-037); Affiliate is future-only; ZBP is removed.
- Default Marketplace event customer cancellation cutoff: **48 hours before event start** (FD-039); approved event-specific variation may apply if disclosed before purchase and legally permitted. Refund %, timelines, convenience-fee, chargeback, and no-show rules remain separately pending.
- Phase 2 commercial spine includes Associate Membership, Circles, Connect/Marketplace/Enterprise BDP architectures, Marketplace Events & Venue Partners, BDP packs, Enterprise architecture, and unpaid Lead Assist Stage 1 — **not Connect-only** (FD-039). Pilot city remains intentionally undecided and must not block Phase 2 Technical Architecture.
- Connect BDP / Marketplace BDP Commission-Recovery Finance Options are active under FD-029 (Connect finance supersedes FD-025 finance-inactive only — FD-032).
- Commercial rules are separated by vertical and transaction type — do not assume one universal commission or settlement rule.
- Financial architecture must be **multi-currency-capable**; INR may be initial domestic/reporting currency — not permanently INR-only (FD-028 / FD-029). Multi-currency **go-live** and international expansion remain inactive until later approval (FD-039).

Do not invent missing commercial percentages, tax rates, advertising prices, Lead Assist commercial activation, split-commission rates, future Affiliate products, or final legal/tax/privacy classifications. Category existence does not automatically make revenue commissionable (FD-029). Do not reconcile Founder Decision conflicts by assumption (FD-032).

---

Overview

The GCE (Growth Central Events) Business Model is designed to create a sustainable business ecosystem by combining business networking, marketplace services, enterprise solutions, AIpowered lead distribution, memberships, and franchise operations into one integrated platform.

Unlike traditional event companies, GCE operates as a Business Growth Ecosystem where every stakeholder contributes to and benefits from the platform.

The business model is built around recurring memberships, business partnerships, franchise expansion, AIassisted referrals, and business collaborations.

 Business Ecosystem

The GCE ecosystem consists of three core business verticals.

 1\. GCE Connect

The networking and membership ecosystem.

Purpose:

 Build professional business communities
 Generate qualified referrals
 Create structured networking
 Increase member visibility
 Build longterm business relationships

Revenue Sources:

 Membership Subscriptions
 Circle Expansion
 Business Networking Programs

 2\. GCE Marketplace

The marketplace ecosystem where verified businesses can promote products, services, events, and offers.

Purpose:

 Help businesses acquire customers
 Increase business visibility
 Generate sales through promotional campaigns
 Support local businesses

Revenue Sources:

 Marketplace Commissions
 Offer Campaign Fees
 Event Listing Fees
 Venue Partnerships

 3\. GCE Enterprise

The corporate business division of GCE — a technology-enabled, stakeholder-fulfilled procurement, matching, coordination, workflow, and financial-control platform (FD-026).

Purpose:

 Coordinate corporate event procurement on the GCE platform
 Capture requirements and match verified stakeholders / vendors
 Control digital workflow, payments, settlements, and commission
 Do **not** directly execute physical events (vendor-led fulfilment)

Revenue Sources:

 Eligible GCE platform commission on Enterprise projects
 Enterprise BDP Franchise Pack fees
 Enterprise BDP commission share of platform commission
 Vendor Opportunity Fee tracking where applicable (% unresolved)

 Business Growth Strategy

The GCE business model focuses on creating recurring business opportunities through a structured ecosystem.

The platform grows through:

 Membership Expansion
 Business Referrals
 Marketplace Growth
 Enterprise Projects
 Franchise Network Expansion
 AIPowered Lead Distribution
 Community Building

 Business Lifecycle

The overall business flow follows this lifecycle:

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

 Business Categories

GCE Connect Circles organise businesses under four fixed **GC Power Sectors** (FD-030) — taxonomy structures, not separate Circles; seat distribution is flexible (not rigid 10/10/10/10):

1. Real Estate, Infrastructure & Construction Sector
2. Industrial, Manufacturing & Logistics Sector
3. Professional, Financial & Business Services Sector
4. Consumer, Hospitality, Health & Lifestyle Sector

Illustrative industries within those sectors may include professional services, retail, hospitality, restaurants, hotels, banquet halls, healthcare, education, technology, manufacturing, real estate, financial services, legal services, home services, event services, and corporate organizations.

Every business is classified using:

 GC Power Sector
 Business Specialization
 Protected Tag Scope
 Business Tags

This allows the AI engine to accurately match business opportunities.

 Revenue Generation Model

The GCE ecosystem generates revenue from multiple business channels.

Primary revenue streams include:

 Membership Fees
 Marketplace Revenue
 Enterprise Revenue
 Franchise Fees
 Event Revenue Sharing
 Venue Commissions
 Marketplace Offer Campaigns
 Business Services

This diversified revenue model ensures longterm business sustainability.

 Business Intelligence

The platform continuously tracks business performance using:

 Member Activity
 Business Referrals
 Revenue Generation
 Attendance
 Marketplace Performance
 Enterprise Projects
 AI Lead Distribution
 Business Rankings

This data is used to improve recommendations, rankings, and platform performance.

 AIDriven Business Model

Artificial Intelligence is one of the core components of GCE.

AI assists in:

 Business Matching
 Circle Matching
 Lead Routing
 Referral Distribution
 Opportunity Allocation
 Business Recommendations
 Performance Analysis

The AI engine (**GCE Lead Intelligence Engine**, with Opportunity Desk oversight — FD-031) supports fair and intelligent distribution of business opportunities across the ecosystem. Core Lead Rights are protected; optional paid Lead Assist products remain Unresolved commercially.

 Integrated Business Modules

The complete GCE ecosystem consists of interconnected business modules:

 GCE Connect
 GCE Marketplace
 GCE Enterprise
 Membership
 AI Lead Assist / GCE Lead Intelligence Engine (FD-031)
 Referral Engine
 Business Ranking
 Offer Management
 Event Management
 Payment System
 QR Ticketing
 Dashboards
 Notifications
 Analytics

Each module operates independently while sharing a centralized database and business rules.

 Business Value Proposition

GCE creates value for every stakeholder by providing:

For Users

 Business Opportunities
 Professional Networking
 Verified Business Connections

For Members

 Referrals
 AI Lead Allocation
 Business Growth

For Venue Partners

 Customer Acquisition
 Event Hosting
 GCE Marketplace Visibility

For Businesses

 Marketing
 Sales Growth
 Customer Engagement

For Corporate Clients

 Enterprise Event Procurement and Coordination Solutions
 Verified Vendor / Stakeholder Network
 Vendor-Led Professional Fulfilment (GCE controls the digital workflow)

For Franchise Partners

 Business Partner Opportunity (Franchise Unit / Franchise Pack operation — not ownership of territory, Circles, clients, members, or platform assets)
 Recurring Eligible Commission Income (not guaranteed)
 Community Development

 LongTerm Business Vision

The longterm objective of GCE is to build India's largest AIpowered Business Growth Ecosystem by integrating:

 Networking
 GCE Marketplace
 GCE Enterprise
 AI
 Business Communities
 Referrals
 Memberships
 Franchise Network

into one scalable digital platform capable of supporting millions of businesses across India.
