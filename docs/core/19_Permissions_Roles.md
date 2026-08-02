# Permissions & Roles

## Authority

**Highest authority for RBAC principles:** `docs/founder-decisions/FD-023_RBAC_and_Permissions.md`

**Role names / taxonomy:** `35_Role_Taxonomy.md`
**Connect BDP commercial authority limits:** `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`
**GCE Enterprise commercial / Platform Expert authority limits:** `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md`

This file retains detailed permission narrative and historical matrices. Where it conflicts with FD-023, **FD-023 wins**. Connect BDP commercial operating limits defer to **FD-025**. Enterprise BDP and Enterprise Platform Expert limits defer to **FD-026**.

### Founder-aligned access principles (summary)

- One GCE account; multiple compatible roles; role ≠ account; workspace ≠ account.
- Least privilege; role title alone does not grant unrestricted access.
- Department-scoped administration; **no universal admin god mode by default**.
- Financial permissions separate from operational permissions.
- RM and PRM do **not** automatically have refund, settlement, payout, or ledger authority.
- BDPs cannot approve or release **personal** commission.
- Circle Member cannot simultaneously be Connect BDP for the same Circle / directly conflicting Connect structure.
- Connect BDP may initiate/support Circles but cannot independently activate, suspend, merge, archive, or delete Circle history (FD-024 / FD-025).
- Enterprise BDP cannot independently approve quotations, select vendors finally, approve payments/refunds/settlements, or execute physical events (FD-026).
- Enterprise Platform Expert is project-scoped; must not access unrelated project data or physically execute events (FD-026).
- Exact permission codes and matrix: **Pending Technical Design** — do not invent.

### Terminology note

Prefer **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**, **Enterprise Platform Expert**, **Circle Member**, **Enterprise Client**. Legacy labels CBDP/MBDP may appear in historical sections and filenames (`06_CBDP.md`, `07_MBDP.md`) pending migration mapping. **Connect BDP Franchise Unit** (FD-025) and **Enterprise BDP Franchise Pack** (FD-026) are commercial constructs, not automatically separate RBAC role enums.


Overview

The GCE platform follows a RoleBased Access Control (RBAC) architecture.

Every stakeholder is assigned a predefined role with specific permissions. Users can only access the dashboards, modules, APIs, and data required for their responsibilities.

This ensures platform security, operational transparency, and efficient business management.

 Supported Roles

The platform currently supports the following roles:

1\. Platform Admin
2\. Board of Governance
3\. Relationship Manager (RM)
4\. Platform Relationship Manager (PRM)
5. Connect BDP (legacy label: CBDP)
6. Marketplace BDP (legacy label: MBDP)
7\. Enterprise Business Development Partner
8\. Venue Partner
9\. Circle Member
10\. User

 Permission Levels

The platform defines four permission levels:

 Read

View information only.

 Create

Create new records.

 Update

Edit existing records.

 Delete

Delete records where permitted.

 Platform Admin

 Access Level

Assigned administrative domains (FD-023: not unrestricted god mode by default)

 Permissions

 Manage Users
 Manage Memberships
 Manage Events
 Manage Marketplace
 Manage Enterprise
 Manage Venue Partners
 Manage Connect BDPs
 Manage Marketplace BDPs
 Manage Enterprise BDPs
 Manage AI Lead Assist
 View Reports
 Manage Payments
 Manage Notifications
 Configure Platform Settings
 Access All Dashboards

 Board of Governance

 Access Level

Circle Governance

 Permissions

 View Assigned Circles
 Manage Circle Members
 Approve Member Requests
 Remove Members
 View Attendance
 Resolve Disputes
 View Circle Reports

Cannot access financial data or platform settings.

 Relationship Manager (RM)

 Access Level

Customer Support

 Permissions

 View Assigned Members
 Manage FollowUps
 Schedule Meetings
 Resolve Member Issues
 View Reports

Cannot modify system settings.

Does **not** automatically receive settlement, refund, ledger, or payout authority (FD-023).

 Platform Relationship Manager (PRM)

 Access Level

AI Lead Verification

 Permissions

 View New Lead Requests
 Verify User Identity
 Verify Business Requirements
 Verify Business Tags
 Verify Circle Availability
 Approve Leads
 Reject Leads
 View Lead Reports

Cannot assign leads manually outside system rules.

Does **not** automatically receive settlement, refund, ledger, or payout authority (FD-023).

 Connect BDP (legacy: CBDP)

 Access Level

Connect Business Operations (scoped to assigned Franchise Unit(s) — FD-025)

 Permissions

 Register Members
 Support Membership Sales
 Create Business Circles (request/initiate; cannot independently activate — FD-024 / FD-025)
 Manage Assigned Circles
 View Sales / Eligible Subscription Attribution
 View Commissions (not self-approve personal commission)
 Manage Franchise Unit (view/support assigned unit; cannot privately sell/transfer unit)
 View Performance Reports / Milestone Progress

Cannot manage **GCE Marketplace** or **GCE Enterprise** modules. Cannot independently change Circle lifecycle status, move platform funds, or change official taxonomy (FD-025).

 Marketplace BDP (legacy: MBDP)

 Access Level

Marketplace Business Operations

 Permissions

 Register Venue Partners
 Manage Marketplace Businesses
 View Revenue
 View Offer Campaigns
 Manage Franchise
 View Commissions
 View Marketplace Analytics

Cannot access **GCE Connect** circle management.

 Enterprise Business Development Partner

 Access Level

Enterprise Business Development (scoped to attributed Franchise Pack clients — FD-026)

 Permissions

 Support Enterprise Client attribution and relationship management
 Capture / coordinate requirements and Event Requirement Briefs
 Create and present proposals (cannot independently approve quotations or final vendor selection)
 Coordinate with Enterprise Platform Expert
 Track Enterprise Projects
 View Revenue / Eligible Collected Target Progress
 View Commissions (25% of eligible platform commission — not self-approve)
 View Performance Reports / Franchise Pack Capacity

Cannot modify platform settings, approve refunds/settlements, move funds, execute physical events, or access unrelated client/vendor data.

 Enterprise Platform Expert (internal / controlled)

 Access Level

Assigned Enterprise project operations (project-scoped — FD-026)

 Permissions

 Review Event Requirement Briefs
 Break projects into Service Requirements
 Search approved GCE stakeholder / vendor data for assigned projects
 Prepare vendor shortlists and quotation comparisons
 Recommend vendors (not unrestricted unilateral approval)
 Track readiness and completion evidence
 Maintain project records for assigned projects

Cannot physically execute events, collect money personally, approve personal compensation, approve refunds/settlements independently, access unrelated project data, or add unverified vendors without approval. Exact permission codes: Pending Technical Design.

 Venue Partner

 Access Level

Business Management

 Permissions

 Manage Business Profile
 Create Events
 Create Offers
 Manage Bookings
 Scan QR Tickets
 View Revenue
 View Business Analytics

Cannot access other Venue Partner accounts.

 Circle Member

 Access Level

Networking

 Permissions

 View Profile
 Manage Business Information
 Manage Business Tags
 View Meetings
 Submit Referrals
 Receive Referrals
 Use AI Lead Assist
 View Business Ranking

Cannot manage circle administration.

 User

 Access Level

General Platform Access

 Permissions

 Browse Events
 Book Events
 View Marketplace Offers
 Submit Business Requirements
 Purchase Membership
 Manage Profile
 View Tickets

Cannot access business management modules.

 Permission Matrix

| Module | Admin | BOG | RM | PRM | Connect BDP | Marketplace BDP | Enterprise BDP | Venue | Member | User |
||::|::|::|::|::|::|::|::|::|::|
| Users | ✅ | ❌ | 👁 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Self |
| Memberships | ✅ | ❌ | 👁 | ❌ | ✅ | ❌ | ❌ | ❌ | 👁 | Purchase |
| Events | ✅ | ❌ | ❌ | ❌ | ❌ | 👁 | ❌ | ✅ | 👁 | Book |
| Marketplace | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | 👁 | Browse |
| Enterprise | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| AI Lead Assist | ✅ | ❌ | ❌ | ✅ | 👁 | 👁 | 👁 | ❌ | Use | Submit |
| Reports | ✅ | 👁 | 👁 | 👁 | 👁 | 👁 | 👁 | 👁 | 👁 | ❌ |

Legend:

 ✅ Full Access
 👁 View Only
 ❌ No Access

 API Permissions

Every API validates:

 User Authentication
 User Role
 Module Permission
 Resource Ownership

Unauthorized requests return:

 401 Unauthorized
 403 Forbidden

 Dashboard Permissions

Each role receives a dedicated dashboard.

Users cannot access dashboards belonging to other roles.

Example:

 Venue Partner → Venue Dashboard Only
 Connect BDP → Connect BDP Dashboard Only
 Marketplace BDP → Marketplace BDP Dashboard Only
 Platform Admin → Full Dashboard Access

 Future Roles

The permission system is designed to support future roles, including:

 Finance Manager
 Marketing Manager
 HR Manager
 Regional Manager
 State Manager
 Super Admin
 AI Administrator

 LongTerm Vision

The GCE Role & Permission System is designed to ensure that every stakeholder operates within clearly defined responsibilities.

By implementing strict RoleBased Access Control (RBAC), the platform maintains security, protects sensitive data, simplifies operations, and provides a scalable permission framework that can grow alongside the GCE ecosystem.
