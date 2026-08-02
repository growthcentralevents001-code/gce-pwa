# Business Rules

## Authority

**Founder Decisions are highest authority:** FD-001, FD-020, FD-021, FD-022, FD-023, FD-024, FD-025, FD-026.

This file is a consolidated rules index. Prefer Founder Decisions and canonical cores (`35`, `36`, `37`, `38`, `39`) over duplicated narrative. Specialization exclusivity is **per Circle** (FD-024), not automatically city-wide. Membership ≠ automatic Circle seat (FD-022). Connect BDP commercial and operating rules defer to **FD-025**. GCE Enterprise commercial and operating rules defer to **FD-026**.

Overview

The GCE platform operates on a centralized Business Rule Engine that ensures every stakeholder follows the same policies, workflows, permissions, and operational standards.

These rules maintain consistency, transparency, security, and fairness across the entire ecosystem.

 General Platform Rules

 Every user must have a verified account.
 Every stakeholder has rolebased permissions.
 Unauthorized access is strictly prohibited.
 Every important activity is logged.
 All financial transactions are recorded.
 Platform rules apply equally to all stakeholders.

 User Rules

Users can:

 Register on the platform
 Browse events
 Book events
 Submit business requirements
 Purchase memberships
 Claim marketplace offers

Users cannot:

 Submit fake business enquiries
 Create duplicate accounts
 Upload false documents
 Misuse platform services

 Identity Verification Rules

Certain platform activities require identity verification.

Accepted documents may include:

 Aadhaar
 Passport
 Driving Licence
 PAN (where applicable)

Unverified users may have limited platform access.

 Membership Rules

 Memberships are subscriptionbased.
 Memberships must be renewed before expiry.
 Expired memberships lose premium benefits.
 Memberships are nontransferable.
 One individual can hold only one active membership account.

 Business Category Rules

Each GCE Connect Circle follows Founder-approved specialization exclusivity: **One Business Specialization = One Exclusive Seat per Circle** (FD-024). Not automatically city-wide.

This means:

 Only one member per primary business category in a circle.
 Direct competitors cannot occupy the same category seat.
 Business category changes require approval.

 Business Tag Rules

Every business profile must include:

 Business Category
 Business Tags
 Specialization Tags

These tags are mandatory because they are used by:

 AI Lead Assist
 Search
 Business Matching
 Marketplace
 Enterprise
 Analytics

 Circle Rules

Every business circle must:

 Follow attendance guidelines
 Maintain professional conduct
 Encourage referral sharing
 Follow governance policies
 Respect business exclusivity

The Board of Governance oversees circle discipline.

 Referral Rules

Members should:

 Share genuine referrals
 Avoid fake referrals
 Maintain professional ethics
 Update referral status

Repeated misuse may result in platform action.

 AI Lead Assist Rules

Every submitted business requirement follows:

User Submission

↓

Identity Verification

↓

PRM Verification

↓

Validation Fee

↓

AI Matching

↓

Lead Distribution

↓

Ground Verification

↓

Final Status

Only verified leads are distributed.

 Validation Fee Rules

Business requirements requiring AI Lead Assist must complete the validation process.

Validation Fee: **`36_Commercial_Constants.md`** / full rules in **`39_AI_Lead_Assist_Spec.md`**.

The fee is required before the lead becomes active.

 Genuine Lead Rules

If a lead is marked as genuine:

 Business discussion continues.
 Lead remains active.
 Eligible member receives subscription credit.

 NonGenuine Lead Rules

If a lead is marked as fake:

 Lead is rejected.
 Validation fee is forfeited.
 Fraudulent activity is recorded.
 User account may be suspended after repeated violations.

 Marketplace Rules

Only verified businesses may become Venue Partners.

Venue Partners may:

 Create offers
 Host events
 Accept bookings
 Manage campaigns

Every offer must follow platform policies.

Minimum campaign value: **`36_Commercial_Constants.md`** (Offer / campaign constants).

 Revenue Sharing Rules

**GCE Marketplace** revenue sharing percentages: **`36_Commercial_Constants.md`**.

Flow: **`37_Revenue_Flow.md`**.

Revenue distribution is calculated automatically.

 Connect BDP Rules

Commercial and operating authority: **FD-025**. Numeric summary: **`36_Commercial_Constants.md`** (Connect BDP). Narrative: `06_CBDP.md`. Circle lifecycle: FD-024 / `38_Circle_Architecture.md`.

Key rules (do not invent beyond FD-025):

- Operating unit: **Connect BDP Franchise Unit**; fee **₹50,000 per unit**; deferred finance **not active**
- Capacity: up to **5** Circles per Franchise Unit; target **5 platform-activated Circles in 10 months** (~one every two months)
- Commission: **20%** of eligible GCE Connect subscription revenue, including eligible renewals while responsible
- Territory: **Performance-Protected Assigned Territory** (not permanently owned); Tier maxima 10 / 5 / 2
- Expansion: not automatic; separate fee; standard max **two** active Franchise Units
- Performance: missing two consecutive milestone reviews → formal review + sixty-day corrective process (**not** automatic cancellation)
- Circles, members, and data remain with GCE; Connect BDP cannot independently activate Circles
- Serious misconduct may trigger immediate suspension or termination

 Marketplace BDP Rules

Venue Partner limit, franchise/training fees, finance math, targets, and commission: **`36_Commercial_Constants.md`** (Marketplace BDP).
Additional franchise required beyond the documented Venue Partner limit.
Finance option available.

 Enterprise BDP Rules

Commercial and operating authority: **FD-026**. Numeric summary: **`36_Commercial_Constants.md`** (Enterprise BDP). Narrative: `08_Enterprise_BDP.md`.

Key rules (do not invent beyond FD-026):

- GCE Enterprise is a technology / workflow / financial-control platform — **not** a direct physical event executor; fulfilment is vendor/stakeholder-led
- Operating unit: **Enterprise BDP Franchise Pack**; up to **30** active clients per pack; standard max **two** packs / **60** clients
- Direct fee **₹30,000** / financed **₹36,000** (₹5,000 + ₹31,000 recoverable from approved commission only, max ₹5,000/month)
- Allocation is **client-based**, not territory-based; BDP does not own clients
- Minimum project value **₹1,00,000** (excludes GST/taxes)
- Targets per pack: **₹3,00,000** monthly · **₹9,00,000** rolling three months (eligible collected revenue only)
- Platform commission **20%** standard (authorised reduced **15%–19%**; below 15% special approval)
- Enterprise BDP commission: flat **25%** of eligible platform commission (not tiered; not guaranteed income)
- Enterprise Platform Expert is internal/controlled — not a franchisee; recommends vendors; does not physically execute
- Standard payment **30% / 40% / 30%**; payment ≠ settlement eligibility
- Vendor Opportunity Fee is an approved success-based concept; **% and distribution unresolved**
- Performance: progressive sixty-day process — **not** automatic cancellation after one or two weak months
- Serious misconduct may trigger immediate suspension or termination

 Venue Partner Rules

Venue Partners must:

 Complete business verification.
 Maintain accurate business information.
 Deliver genuine offers.
 Honor published campaigns.
 Follow customer service standards.

 Event Rules

Every event must include:

 Event Details
 Venue
 Date & Time
 Capacity
 Pricing
 Booking Information

Bookings generate QR tickets.

 QR Ticket Rules

Every booked ticket receives a unique QR code.

QR codes:

 Are unique.
 Can be scanned only once.
 Cannot be duplicated.
 Expire after event completion.

 Payment Rules

All payments must be processed through approved payment gateways.

Supported payment types include:

 Membership Payments
 Event Bookings
 Marketplace Payments
 Franchise Payments
 Validation Fees

 Dashboard Rules

Each stakeholder can only access their assigned dashboard.

RoleBased Access Control (RBAC) applies throughout the platform.

No stakeholder may access confidential information belonging to another role.

 Notification Rules

The platform sends notifications for:

 Membership Expiry
 Payments
 Event Bookings
 Lead Assignment
 Offer Approval
 Revenue Updates
 Performance Alerts
 System Announcements

 Data Security Rules

The platform follows strict security policies.

Includes:

 JWT Authentication
 RoleBased Access
 Row Level Security (RLS)
 Audit Logs
 Encrypted Data
 Secure APIs

 Audit Rules

Important activities are recorded, including:

 Login
 Registration
 Payments
 Membership Purchases
 Event Creation
 Offer Creation
 Lead Assignment
 Revenue Distribution
 Dashboard Activity

 Compliance Rules

All stakeholders are expected to:

 Follow platform policies.
 Respect business ethics.
 Maintain accurate information.
 Avoid fraudulent activities.
 Cooperate with platform verification processes.

Violation of business rules may result in:

 Warning
 Temporary Restriction
 Account Suspension
 Permanent Removal
 Legal Action (where applicable)

 LongTerm Vision

The GCE Business Rule Engine is designed to ensure that every transaction, business interaction, membership, referral, marketplace activity, enterprise project, and AIpowered lead distribution follows a standardized, transparent, secure, and scalable framework.

These rules form the operational foundation of the entire GCE Business Growth Ecosystem.
