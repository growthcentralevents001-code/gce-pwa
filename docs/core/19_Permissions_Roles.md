 Permissions & Roles

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
5\. Connect Business Development Partner (CBDP)  
6\. Marketplace Business Development Partner (MBDP)  
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

Full System Access

 Permissions

 Manage Users  
 Manage Memberships  
 Manage Events  
 Manage Marketplace  
 Manage Enterprise  
 Manage Venue Partners  
 Manage CBDPs  
 Manage MBDPs  
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

 Connect Business Development Partner (CBDP)

 Access Level

Connect Business Operations

 Permissions

 Register Members  
 Sell Memberships  
 Create Business Circles  
 Manage Assigned Circles  
 View Sales  
 View Commissions  
 Manage Franchise  
 View Performance Reports

Cannot manage Marketplace or Enterprise modules.

 Marketplace Business Development Partner (MBDP)

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

Cannot access Connect Circle management.

 Enterprise Business Development Partner

 Access Level

Enterprise Business Development

 Permissions

 Manage Enterprise Clients  
 Create Quotations  
 Send Vendor Quotations  
 Send Venue Quotations  
 Track Enterprise Projects  
 View Revenue  
 View Performance Reports

Cannot modify platform settings.

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

| Module | Admin | BOG | RM | PRM | CBDP | MBDP | Enterprise BDP | Venue | Member | User |  
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
 CBDP → CBDP Dashboard Only  
 MBDP → MBDP Dashboard Only  
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
