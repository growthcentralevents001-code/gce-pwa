# Venue Partner

## Authority

**Settlement / hold:** FD-021 · **Ledgers:** FD-020 · **RBAC:** FD-023 · **Revenue recognition:** FD-028 · **Commission / Marketplace attributed share:** FD-029 · **Marketplace BDP onboarding / attribution / RM:** FD-033 · **Marketplace transactions / unattributed revenue / approval / payout:** FD-037 · **Marketplace ticket MoR / cancellation default / compliance gates:** FD-039 · **Corporate boundaries:** FD-034 · **Identity / Venue Representative:** FD-035 · **Commercial share:** `36_Commercial_Constants.md`

Venue Partner accesses **own** business data only. One canonical **Venue Partner** role family — business types are attributes/categories, not separate permission roles (FD-037). Venue-side users operate as **Venue Representative / Venue Manager** and do not become Marketplace BDPs merely by managing a venue (FD-035 / FD-037).

Settlement for Marketplace events follows successful completion and the approved **48-hour** post-event hold (FD-021), not payment alone. With valid Marketplace BDP attribution: **80% Venue Partner / 10% Marketplace BDP / 10% GCE net** of Eligible Marketplace Event Revenue (FD-029 / FD-033 / FD-037). Without valid Marketplace BDP attribution: **80% Venue Partner / 0% Marketplace BDP / 20% GCE** (FD-037) — do not describe the missing 10% as unpaid MBDP commission. Affiliate commission is not active. Minimum Marketplace Offer Event **planned commercial value** ₹50,000 is a campaign qualification threshold — not a GCE fee, guaranteed sales, mandatory deposit, or recognised revenue (FD-037). No category-specific share variants at launch unless expressly approved later. Offer Claim is not revenue. Launch payout direction: monthly Platform-initiated batch; architecture must remain configurable; Venue Partner cannot directly release settlement (FD-037).

**Merchant of Record (Marketplace event tickets):** Logixia Solutions Private Limited is the **intended MoR** — platform collects customer ticket payment then settles Venue Partner and Marketplace BDP entitlements (FD-039). GST, invoice structure, gateway configuration, refund accounting, TDS/withholding, settlement compliance, and payment-aggregator applicability remain validation-gated before production money movement.

**Customer cancellation default:** **48 hours before event start** (FD-039). Approved event-specific policy may differ if clearly disclosed before purchase and legally permitted. Refund percentage, refund timeline, convenience-fee treatment, chargeback handling, and no-show treatment are **not** defined by FD-039 and remain pending applicable policy.

New Venue Partners should ordinarily be onboarded through an approved Marketplace BDP; GCE retains final approval. Marketplace Events and Offer Events: Venue Partner may draft/submit; Marketplace BDP may assist and recommend; **Platform Marketplace Operations final-approves** (FD-037). The validly onboarding Marketplace BDP becomes primary Relationship Manager for that venue under a **venue-attribution** model — Marketplace BDP does not permanently own the venue, city, or attribution rights, and may not release settlement or approve refunds (FD-033). Temporary inactivity does not automatically terminate attribution; prolonged inactivity must be reviewed (FD-037). Venue Partners are independent businesses — not Logixia subsidiaries or employees (FD-034). When used inside an Enterprise project, Marketplace venue participation does not automatically apply 80/10/10 to the entire Enterprise project (FD-037 / FD-038).

## Canonical references

- **Revenue share and campaign minimum:** `36_Commercial_Constants.md`
- **Revenue flow (GCE Marketplace):** `37_Revenue_Flow.md`
- **Role identity:** `35_Role_Taxonomy.md`

This file retains Venue Partner narrative for **GCE Marketplace**.

 Overview

A Venue Partner is a verified business that joins the GCE Marketplace to promote products, services, events, customer offers, and business campaigns.

A Venue Partner can be any physical business or service provider that wants to acquire more customers through the GCE ecosystem.

Unlike GCE Connect Members, Venue Partners focus on customer acquisition, offer campaigns, event hosting, and business growth.

 Primary Objectives

The primary objectives of a Venue Partner are:

 Increase Customer Footfall
 Generate More Sales
 Promote Business Offers
 Host Marketplace Events
 Increase Brand Visibility
 Acquire New Customers
 Build Customer Loyalty

 Eligible Businesses

Any verified business can become a Venue Partner.

Examples include:

 Hotels
 Restaurants
 Cafes
 Banquet Halls
 Resorts
 Coworking Spaces
 Sweet Shops
 Clothing Stores
 Jewellery Stores
 Electronics Stores
 Furniture Stores
 Grocery Stores
 Medical Stores
 Salons
 Gyms
 Clinics
 Coaching Institutes
 Service Centers
 Retail Shops
 Supermarkets
 Home Decor Stores
 Automobile Dealers
 Any Verified Business

 Core Responsibilities

Venue Partners are responsible for:

 Maintaining Business Profile
 Creating Marketplace Offers
 Hosting Events
 Managing Bookings
 Responding to Customer Enquiries
 Updating Business Information
 Managing Campaign Performance
 Delivering Quality Customer Service

 Business Verification

Before becoming active on the platform, every Venue Partner must complete verification.

Verification includes:

 Business Registration
 Identity Verification
 Contact Verification
 Business Address Verification
 Business Category Selection
 Business Tags
 Specialization Tags

Only verified businesses can publish offers and events.

 Offer Management

Venue Partners can create promotional campaigns directly from their dashboard.

Offer types include:

 Discount Offers
 Cashback Offers
 Combo Offers
 Shopping Offers
 Festival Offers
 Product Launch Offers
 LimitedTime Offers
 Customer Loyalty Offers

 Offer Campaign Rules

Minimum Campaign Value

 **`36_Commercial_Constants.md`** (minimum campaign revenue value)

Campaigns below the minimum value cannot be published.

Every campaign must be approved according to platform business rules.

 Event Management

Venue Partners can create:

 Marketplace Events
 Shopping Events
 Product Launch Events
 Promotional Events
 Business Events
 Seasonal Events

Each event includes:

 Event Details
 Venue Information
 Ticket Pricing
 Capacity
 Booking Management
 QR Ticket Validation

 Revenue Model

Revenue share for **GCE Marketplace** activity, distribution percentages, and the documented ₹1,00,000 example: **`36_Commercial_Constants.md`** (GCE Marketplace revenue share).

Flow: **`37_Revenue_Flow.md`** (GCE Marketplace section).

 Dashboard Access

Every Venue Partner receives a dedicated dashboard.

Dashboard Modules include:

 Business Profile
 Offer Management
 Event Management
 Booking Management
 Customer Management
 Revenue Dashboard
 Sales Analytics
 QR Ticket Scanner
 Notifications
 Reports
 Support Center

 Performance Analytics

Venue performance is measured using:

 Total Revenue
 Monthly Revenue
 Active Offers
 Active Events
 Customer Visits
 Offer Redemption
 Customer Ratings
 Repeat Customers
 Campaign Performance

 Business Workflow

Typical Venue Partner workflow:

Business Registration

↓

Verification

↓

Dashboard Activation

↓

Business Profile Setup

↓

Create Offer / Event

↓

Campaign Launch

↓

Customer Booking

↓

Customer Visit

↓

Business Transaction

↓

Revenue Distribution

↓

Performance Analytics

 Key Performance Indicators (KPIs)

The platform tracks:

 Monthly Revenue
 Offer Performance
 Event Performance
 Customer Acquisition
 Customer Retention
 Campaign Success Rate
 Booking Conversion Rate
 Business Growth

 Benefits

Venue Partners receive:

 Increased Customer Footfall
 Digital Business Presence
 Marketplace Visibility
 Event Promotion
 Offer Promotion
 Business Analytics
 Revenue Tracking
 Customer Insights
 AI Business Recommendations
 Dedicated Business Dashboard

 Integration with GCE Ecosystem

Venue Partners work closely with:

 GCE Marketplace Business Development Partners (Marketplace BDP)
 Platform Relationship Managers (PRM)
 Marketplace Customers (Users)
 GCE Marketplace
 AI Lead Assist
 Offer Management System
 Event Management System

 LongTerm Vision

The Venue Partner program is designed to build India's largest verified business marketplace.

Every Venue Partner becomes part of the GCE Business Growth Ecosystem, where technology, AI, marketing, customer acquisition, and marketplace services work together to increase business revenue and longterm customer engagement.
