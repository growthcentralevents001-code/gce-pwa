# Dashboards

## Authority

**Roles / workspaces:** FD-023 / `35_Role_Taxonomy.md` · **Identity model:** FD-001 · **Connect BDP commercial / Franchise Unit performance:** FD-025 · **GCE Enterprise / Franchise Pack / Platform Expert:** FD-026 · **Revenue recognition:** FD-028 · **Commission Engine / entitlement states:** FD-029 · **Circle governance / attendance / verification:** FD-030 / `38_Circle_Architecture.md` · **AI Lead Assist / Opportunity Desk:** FD-031 / `39_AI_Lead_Assist_Spec.md`

Dashboards are **role-based workspaces**, not separate accounts. Prefer Connect BDP / Marketplace BDP / Enterprise BDP naming. Venue Admin remains **platform-ops** console for managing Venue Partners — do not conflate with Venue Representative / Venue Manager (venue-side; FD-035 / FD-037) unless Founder-approved as a distinct role. Financial modules must respect FD-020/FD-021/FD-023/FD-028/FD-029 (no automatic RM/PRM finance authority; no self-approval of commission exceptions). Do not use one unqualified “Revenue” or “earnings” figure — distinguish Booked Value, Collected Value, Eligible Revenue, GCE Platform Revenue, Estimated Commission, Provisional Commission, Earned Commission, Commission on Hold, Settlement-Eligible Commission, Paid Commission, Reversed Commission, Recoverable Balance, TDS, franchise finance recovery, Net payout, Original Currency, and Payout/Reporting Currency (FD-028 / FD-029). Connect BDP modules must reflect Franchise Unit targets and eligible commission (not guaranteed income) plus finance recovery when applicable. Marketplace BDP modules must reflect 10% commission only with valid attribution (unattributed venues use 80/0/20 — FD-037) and finance recovery. Enterprise modules must reflect Franchise Pack capacity/targets and platform-commission-based BDP commission (FD-026). Governing Body dashboards support Circle ops but must not imply independent membership approval/termination (FD-030). Lead Assist / PRM surfaces should evolve toward the **GCE Lead Intelligence and Opportunity Desk** and member lead states from FD-031; payment modules appear only for optional paid products (not as a gate on ordinary referrals). Exact dashboard workflows remain Pending Technical Design.

Overview

The GCE platform follows a rolebased dashboard architecture.

Every stakeholder receives a dedicated dashboard with features, permissions, reports, and analytics relevant to their responsibilities.

The dashboard system is designed to provide a simple, secure, and datadriven experience while allowing each stakeholder to manage their daily business activities efficiently.

 Dashboard Architecture

The GCE platform includes the following dashboards:

1\. Platform Admin Dashboard
2\. Venue Partner Dashboard
3\. Venue Admin Dashboard
4\. GCE Connect Business Development Partner (Connect BDP) Dashboard
5\. GCE Marketplace Business Development Partner (Marketplace BDP) Dashboard
6\. Enterprise Business Development Partner Dashboard
7\. Circle Member Dashboard
8\. User Dashboard
9\. Relationship Manager (RM) Dashboard
10\. Platform Relationship Manager (PRM) Dashboard
11\. Board of Governance Dashboard

 1\. Platform Admin Dashboard

The Platform Admin Dashboard provides complete control over the GCE ecosystem.

Modules:

 Dashboard Overview
 User Management
 Membership Management
 Venue Partner Management
 Connect BDP Management
 Marketplace BDP Management
 Enterprise BDP Management
 Marketplace Management
 Enterprise Management
 Events Management
 Offers Management
 AI Lead Assist
 Revenue Dashboard
 Commission Dashboard
 Payments
 Reports & Analytics
 Notifications
 Franchise Management
 System Settings

 2\. Venue Partner Dashboard

The Venue Partner Dashboard helps businesses manage their marketplace activities.

Modules:

 Business Profile
 Event Management
 Offer Management
 Booking Management
 Customer Management
 Revenue Dashboard
 QR Ticket Scanner
 Reports
 Notifications
 Business Analytics

 3\. Venue Admin Dashboard

The Venue Admin Dashboard is used by the GCE platform to manage all Venue Partners.

Modules:

 Venue Partner List
 Business Verification
 Offer Approval
 Event Approval
 Revenue Monitoring
 Venue Performance
 Customer Reports
 Marketplace Analytics
 Business Status
 Notifications

 4\. GCE Connect Business Development Partner (Connect BDP) Dashboard

The Connect BDP Dashboard is designed to manage GCE Connect operations for assigned **Franchise Unit(s)** (FD-025).

Modules:

 Dashboard Overview
 Circle Management
 Membership Sales
 Active Members
 Member Registration
 Franchise Unit Circle Milestone Target (5 activated Circles / 10 months — not “one Circle per month”)
 Commission Dashboard (20% eligible subscription revenue; not guaranteed income)
 Franchise Unit Management
 Performance Analytics
 Notifications
 Reports
 Territory / assignment visibility (Performance-Protected Assigned Territory — not ownership)

 5\. GCE Marketplace Business Development Partner (Marketplace BDP) Dashboard

The Marketplace BDP Dashboard manages Marketplace business growth.

Modules:

 Dashboard Overview
 Venue Partner Management
 Business Listings
 Marketplace Revenue
 Offer Campaigns
 Event Listings
 Franchise Management
 Commission Dashboard
 Monthly Revenue
 Performance Analytics
 Notifications

 6\. Enterprise Business Development Partner Dashboard

The Enterprise Dashboard manages attributed Enterprise Clients and Franchise Pack performance (FD-026). GCE does not use this dashboard to imply direct physical event execution.

Modules:

 Dashboard Overview
 Active Client Capacity (30 per Franchise Pack; max two packs standard)
 Corporate Leads / Attribution Status
 Client Management (client-based — not territory ownership)
 Project Pipeline (including Master Project / City Units for multi-city)
 Event Requirement Brief / Proposal Status
 Quotation and Approval Tracking
 Venue / Vendor Coordination (with Platform Expert)
 Revenue Dashboard (eligible collected revenue vs ₹3L / ₹9L targets)
 Commission Dashboard (25% of eligible platform commission; not guaranteed)
 Finance Recovery Visibility (financed pack, where applicable)
 Performance Analytics
 Reports
 Notifications

 7\. Circle Member Dashboard

The Circle Member Dashboard is used by GCE Connect members.

Modules:

 Dashboard Overview
 My Profile
 Membership Status
 Business Category
 Business Tags
 Specialization Tags
 Meeting Schedule
 Referrals Given
 Referrals Received
 AI Lead Assist (member lead states / Core Lead Rights — FD-031)
 Business Ranking
 Notifications

 8\. User Dashboard

The User Dashboard is designed for general platform users.

Modules:

 Dashboard Overview
 My Profile
 Event Bookings
 Marketplace Offers
 My Tickets
 Business Requirements
 AI Lead Requests
 Payments
 Notifications
 Settings

 9\. Relationship Manager (RM) Dashboard

The RM Dashboard supports platform operations.

Modules:

 Member Support
 Followups
 Business Meetings
 Issue Resolution
 Training Management
 Reports
 Notifications

 10\. Platform Relationship Manager (PRM) / Opportunity Desk Dashboard

Legacy **PRM** dashboard language maps toward the **GCE Lead Intelligence and Opportunity Desk** (FD-031). Desk operators support verification and coordination; they do **not** own leads and must not receive hidden personal commission from selected members.

Modules (conceptual — exact UI Pending Technical Design):

 New / Submitted Leads
 Verification Queue (quality states: Unverified → Preliminarily Verified → Qualified → Rejected/Invalid)
 Human Review Queue (low-confidence / sensitive / disputed)
 Consent / Privacy Flags
 Classification & Match Recommendations
 Offer / Assignment Status
 Member Lead States (Offered · Response Due · Accepted · Clarification Required · Declined · Reassigned · In Contact · Won · Lost · Disputed · Invalid · Expired · Closed)
 Duplicate / Invalid Reviews
 Optional Paid-Product Payment Status (Pro / verification / Expert / Managed only — not a gate on ordinary referrals)
 Reports / Audit
 Notifications

Do not centre the desk on Validation Fee / Rainmaker Pass Lead workflows.

 11\. Board of Governance / Governing Body Dashboard

The Governing Body Dashboard supports GCE Connect Circle governance. Membership approval, activation, and termination remain **platform-controlled** (FD-030).

Modules:

 Circle Overview
 Member Recommendations / Escalations (not independent approval or removal)
 Attendance Reports (75% expected physical attendance; CAP thresholds — FD-030)
 Circle Performance
 Dispute Escalation
 Governance Reports
 Meeting Support (GCE Phygital Circle Meeting Framework)
 Notifications

Governing Body status does not grant unrestricted finance or data access (FD-023 / FD-030).

 Common Dashboard Features

Every dashboard includes:

 Dashboard Home
 Notifications
 Search
 Reports
 Analytics
 Profile Management
 Settings
 Help & Support

 Dashboard Security

All dashboards follow RoleBased Access Control (RBAC).

Security Features:

 Secure Login
 JWT Authentication
 RoleBased Permissions
 Session Management
 Activity Logs
 Audit Trails

Users can only access modules assigned to their role.

 Dashboard Analytics

Each dashboard provides realtime analytics based on stakeholder responsibilities.

Examples include:

 Revenue
 Performance
 Business Growth
 Memberships
 Events
 Marketplace Activity
 Enterprise Projects
 AI Lead Distribution
 Customer Engagement

 Dashboard Design Guidelines

All dashboards follow a consistent UI/UX design.

Design Principles:

 MobileFirst Design
 Responsive Layout
 Fast Navigation
 RoleBased Widgets
 RealTime Statistics
 Simple User Experience
 Orange & White GCE Branding
 Interactive Charts
 Quick Actions
 AI Recommendations

 LongTerm Vision

The dashboard system is designed to become the operational control center of the GCE ecosystem.

Every stakeholder will have access to rolespecific tools, analytics, AI insights, and business management features, enabling efficient operations and datadriven decisionmaking across the entire platform.
