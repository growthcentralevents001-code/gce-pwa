# Analytics & Reports

## Authority

Pending commission and settlement metrics must not treat pending commission as guaranteed payable (FD-021). Circle Health Score may appear as a concept (FD-024); exact formulas/thresholds are **not approved**. Circle attendance, Dual-Confirmed Closed Business, Governing Body, and verification analytics follow **FD-030** / `38_Circle_Architecture.md` (expected ≥75% physical attendance; visitor does not reserve a seat; no automatic membership termination from attendance alone). Connect BDP commercial analytics must follow **FD-025** / **FD-029**. GCE Enterprise analytics must follow **FD-026** (Franchise Pack targets on eligible collected revenue; platform commission vs Enterprise BDP 25% of platform commission; proposal value does not count as achieved revenue; Vendor Opportunity Fee % unresolved). Revenue recognition follows **FD-028**. Commission Engine states and Marketplace 80/10/10 follow **FD-029**. Lead Assist analytics follow **FD-031** / `39_AI_Lead_Assist_Spec.md` — use quality states and Core Lead Rights metrics; do not treat Validation Fee / Rainmaker Pass Lead language as current. Reports should separately show Gross Transaction Value, Collected Amount, Eligible Revenue, Platform Revenue, Estimated/Provisional/Earned/On-Hold/Settlement-Eligible/Paid/Reversed Commission, Recoverable Balance, stakeholder entitlement, refunds, reversals, chargebacks, taxes, TDS, finance recovery, pending/paid settlement, net retained platform amount, and original vs reporting currency. Do not invent workshop commission shares. Exact dashboard report designs remain Pending Technical Design.

Analytics & Reports

 Overview

The GCE Analytics & Reporting System provides realtime business intelligence for every stakeholder.

It collects data from all platform activities, processes it into meaningful insights, and displays it through rolebased dashboards and reports.

The objective is to help users make informed business decisions while enabling the platform to monitor growth, performance, and revenue.

 Analytics Objectives

The analytics system is designed to:

 Measure Business Growth
 Monitor Platform Performance
 Track Revenue
 Analyze User Activity
 Improve Decision Making
 Monitor AI Performance
 Support Business Intelligence

 Analytics Modules

The platform provides analytics for:

 Users
 Memberships
 Events
 Marketplace
 Enterprise
 AI Lead Assist
 Payments
 Revenue
 Business Development Partners
 Venue Partners
 Platform Administration

 User Analytics

Available Metrics

 Total Users
 Active Users
 New Registrations
 Verified Users
 Membership Conversions
 Login Activity
 User Growth
 User Retention

 Membership Analytics

Reports include:

 Total Membership Sales
 Active Memberships
 Expired Memberships
 Membership Revenue
 Renewals
 Conversion Rate
 Membership Growth

 Event Analytics

Metrics include:

 Total Events
 Upcoming Events
 Completed Events
 Event Bookings
 Event Attendance
 Ticket Sales
 Revenue Per Event
 Popular Event Categories

 Marketplace Analytics

Marketplace reports include:

 Total Venue Partners
 Active Businesses
 Offers Created
 Offers Redeemed
 Marketplace Revenue
 Customer Visits
 Conversion Rate

 Venue Partner Analytics

Venue Partners can view:

 Total Bookings
 Revenue
 Offer Performance
 Event Performance
 Customer Footfall
 Repeat Customers
 Business Growth

 Connect BDP Analytics

Connect BDPs can monitor:

 Membership Sales (eligible subscription activity)
 Monthly Attributed Revenue (not guaranteed commission)
 Active Members
 Platform-Activated Circles (only activated Circles count toward FD-025 target)
 Franchise Unit Milestone Achievement (5 Circles / 10 months)
 Commission Earned (subject to settlement eligibility, refunds, holds — FD-021 / FD-025)
 Performance Ranking

 Marketplace BDP Analytics

Marketplace BDPs can view:

 Venue Partners Added
 Marketplace Revenue
 Franchise Performance
 Offer Campaign Performance
 Monthly Sales
 Commission Earned
 Revenue Target Achievement

 Enterprise Analytics

Enterprise dashboards include:

 Enterprise Clients (active-client capacity utilization)
 Active Projects (including Master Project / City Units where multi-city)
 Completed Projects
 Vendor / Venue Quotations
 Eligible Collected Project Revenue (vs ₹3,00,000 monthly / ₹9,00,000 rolling targets — not proposal value)
 GCE Platform Commission vs Enterprise BDP Commission (25% of eligible platform commission)
 Finance Recovery Status (financed pack, where applicable)
 Client Satisfaction / Feedback Signals

 AI Lead Assist Analytics

Authority: **FD-031** / `39_AI_Lead_Assist_Spec.md`.

Lead Assist reports include (exact designs Pending Technical Design):

 Total Leads Submitted
 Quality-State Counts (Unverified / Preliminarily Verified / Qualified / Rejected-Invalid)
 Human-Review Queue Volume
 Acceptance / Decline / Clarify / Duplicate / Invalid / Collaborate Rates
 Routing and Response Times
 Reassignment Rate
 Conversion / Dual-Confirmed Closed Business Signals
 Consent / Privacy Incident Flags
 Fraud Flags
 Optional Paid-Product Adoption (Pro / verification / Expert / Managed — when activated)

Do not use “Verified Leads / Rainmaker Performance / Validation Fee Revenue” as the primary Lead Assist metric language.

 Revenue Analytics

Platformwide revenue reports include:

 Membership Revenue
 Marketplace Revenue
 Enterprise Revenue
 Franchise Revenue
 Optional Lead Assist Paid-Product Revenue (Unresolved / Pending activation — FD-031 / FD-028)
 Event Revenue
 Total Revenue

 Payment Analytics

Payment reports include:

 Successful Payments
 Failed Payments
 Refunds
 Pending Payments
 Daily Collections
 Monthly Collections
 Payment Method Analysis

 Commission Analytics

Reports include:

 Connect BDP Commission
 Marketplace BDP Commission
 Enterprise BDP Commission
 Monthly Earnings
 Lifetime Earnings
 Pending Commission

 Circle Analytics

Business Circle reports include:

 Active Circles
 Members Per Circle (max 40; Provisionally Active 20–39; Fully Constituted at 40 — FD-030)
 Attendance (≥75% expected physical; CAP thresholds — FD-030)
 Referrals Given (platform-recorded)
 Referrals Received
 Dual-Confirmed Closed Business
 Circle Performance Ranking
 Sector Balance / Specialization Occupancy
 Governance Compliance

 Business Performance Analytics

The platform tracks:

 Business Growth
 Revenue Growth
 Lead Conversion
 Customer Growth
 Business Category Performance
 Tag Performance

 Dashboard Widgets

Typical dashboard widgets include:

 KPI Cards
 Revenue Charts
 Monthly Trends
 Growth Graphs
 Top Performers
 Recent Activities
 AI Insights
 Notifications

 Reports

The platform supports:

 Daily Reports
 Weekly Reports
 Monthly Reports
 Quarterly Reports
 Yearly Reports
 Custom Reports

 Export Options

Reports can be exported as:

 PDF
 Excel (.xlsx)
 CSV

Future:

 PowerPoint
 Google Sheets

 Search & Filters

Reports support:

 Date Range
 Business Category
 City
 Circle
 Stakeholder
 Revenue
 Status
 Membership Type

 RealTime Analytics

The platform provides realtime data for:

 Bookings
 Payments
 Revenue
 AI Leads
 Membership Sales
 Event Registrations
 Marketplace Orders

 Predictive Analytics (Future)

Future AI analytics will include:

 Revenue Forecasting
 Lead Conversion Prediction
 Membership Forecast
 Customer Retention Analysis
 Business Growth Prediction
 Event Demand Forecasting

 API Endpoints

Example analytics APIs:

\`\`\`
GET /api/analytics/dashboard
GET /api/analytics/revenue
GET /api/analytics/users
GET /api/analytics/events
GET /api/analytics/marketplace
GET /api/analytics/enterprise
GET /api/analytics/ai
GET /api/reports
GET /api/reports/export
\`\`\`

 LongTerm Vision

The GCE Analytics & Reporting System is designed to become the central Business Intelligence (BI) engine of the platform.

By providing realtime dashboards, automated reports, AIdriven insights, and predictive analytics, it enables every stakeholder—from Users and Venue Partners to Business Development Partners, Enterprise Teams, and Platform Administrators—to make faster, datadriven decisions and continuously improve business performance across the GCE ecosystem.
