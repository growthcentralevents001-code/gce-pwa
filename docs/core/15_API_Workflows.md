 API Workflows

 Overview

The GCE platform follows a modular REST API architecture where every business module communicates through secure APIs.

All APIs use JWT Authentication, RoleBased Access Control (RBAC), Supabase Database, and standardized request/response formats.

Each stakeholder only has access to APIs permitted for their role.

 API Architecture

\`\`\`  
Frontend (Next.js PWA)

↓

API Layer

↓

Authentication Middleware

↓

Business Logic

↓

Supabase Database

↓

Response  
\`\`\`

 Authentication APIs

 Register User

\`\`\`  
POST /api/auth/register  
\`\`\`

Purpose

 Register a new user

Request

 Name  
 Mobile  
 Email  
 Password

Response

 User Created  
 Verification Required

 Login

\`\`\`  
POST /api/auth/login  
\`\`\`

Purpose

 User Login

Response

 JWT Token  
 Refresh Token  
 User Profile  
 User Role

 Logout

\`\`\`  
POST /api/auth/logout  
\`\`\`

Purpose

 End User Session

 Forgot Password

\`\`\`  
POST /api/auth/forgotpassword  
\`\`\`

 Reset Password

\`\`\`  
POST /api/auth/resetpassword  
\`\`\`

 User APIs

 Get Profile

\`\`\`  
GET /api/user/profile  
\`\`\`

 Update Profile

\`\`\`  
PUT /api/user/profile  
\`\`\`

 Upload Profile Image

\`\`\`  
POST /api/user/avatar  
\`\`\`

 Business Profile

\`\`\`  
PUT /api/user/business  
\`\`\`

 Membership APIs

 Membership Plans

\`\`\`  
GET /api/memberships/plans  
\`\`\`

 Purchase Membership

\`\`\`  
POST /api/memberships/purchase  
\`\`\`

 Renew Membership

\`\`\`  
POST /api/memberships/renew  
\`\`\`

 Membership History

\`\`\`  
GET /api/memberships/history  
\`\`\`

 Event APIs

 Get Events

\`\`\`  
GET /api/events  
\`\`\`

 Event Details

\`\`\`  
GET /api/events/{id}  
\`\`\`

 Create Event

\`\`\`  
POST /api/events  
\`\`\`

Venue/Admin Only

 Update Event

\`\`\`  
PUT /api/events/{id}  
\`\`\`

 Delete Event

\`\`\`  
DELETE /api/events/{id}  
\`\`\`

 Booking APIs

 Book Event

\`\`\`  
POST /api/bookings  
\`\`\`

 Booking Details

\`\`\`  
GET /api/bookings/{id}  
\`\`\`

 Cancel Booking

\`\`\`  
PUT /api/bookings/cancel  
\`\`\`

 Booking History

\`\`\`  
GET /api/bookings/history  
\`\`\`

 QR Ticket APIs

 Generate Ticket

\`\`\`  
POST /api/ticket/generate  
\`\`\`

 Scan Ticket

\`\`\`  
POST /api/ticket/scan  
\`\`\`

 Verify Ticket

\`\`\`  
POST /api/ticket/verify  
\`\`\`

 Marketplace APIs

 Business Listing

\`\`\`  
POST /api/marketplace/business  
\`\`\`

 Get Businesses

\`\`\`  
GET /api/marketplace/businesses  
\`\`\`

 Marketplace Offers

\`\`\`  
GET /api/marketplace/offers  
\`\`\`

 Create Offer

\`\`\`  
POST /api/marketplace/offers  
\`\`\`

 Update Offer

\`\`\`  
PUT /api/marketplace/offers/{id}  
\`\`\`

 Delete Offer

\`\`\`  
DELETE /api/marketplace/offers/{id}  
\`\`\`

 Venue APIs

 Venue Registration

\`\`\`  
POST /api/venue/register  
\`\`\`

 Venue Dashboard

\`\`\`  
GET /api/venue/dashboard  
\`\`\`

 Venue Analytics

\`\`\`  
GET /api/venue/analytics  
\`\`\`

 Venue Revenue

\`\`\`  
GET /api/venue/revenue  
\`\`\`

 CBDP APIs

 Dashboard

\`\`\`  
GET /api/cbdp/dashboard  
\`\`\`

 Members

\`\`\`  
GET /api/cbdp/members  
\`\`\`

 Circles

\`\`\`  
GET /api/cbdp/circles  
\`\`\`

 Membership Sales

\`\`\`  
GET /api/cbdp/sales  
\`\`\`

 Commission

\`\`\`  
GET /api/cbdp/commission  
\`\`\`

 MBDP APIs

 Dashboard

\`\`\`  
GET /api/mbdp/dashboard  
\`\`\`

 Venue Partners

\`\`\`  
GET /api/mbdp/venuepartners  
\`\`\`

 Marketplace Revenue

\`\`\`  
GET /api/mbdp/revenue  
\`\`\`

 Offer Analytics

\`\`\`  
GET /api/mbdp/offers  
\`\`\`

 Franchise Details

\`\`\`  
GET /api/mbdp/franchise  
\`\`\`

 Enterprise APIs

 Dashboard

\`\`\`  
GET /api/enterprise/dashboard  
\`\`\`

 Enterprise Clients

\`\`\`  
GET /api/enterprise/clients  
\`\`\`

 Projects

\`\`\`  
GET /api/enterprise/projects  
\`\`\`

 Create Quotation

\`\`\`  
POST /api/enterprise/quotation  
\`\`\`

 Vendor & Venue Quotation

\`\`\`  
POST /api/enterprise/sendquotation  
\`\`\`

 AI Lead Assist APIs

 Submit Requirement

\`\`\`  
POST /api/leads/create  
\`\`\`

 Upload ID

\`\`\`  
POST /api/leads/uploadid  
\`\`\`

 Lead Validation

\`\`\`  
POST /api/leads/validate  
\`\`\`

PRM Only

 Validation Payment

\`\`\`  
POST /api/leads/payment  
\`\`\`

 AI Matching

\`\`\`  
POST /api/leads/assign  
\`\`\`

System Only

 Pass Lead

\`\`\`  
POST /api/leads/pass  
\`\`\`

Rainmaker Giver Only

 Lead Status

\`\`\`  
GET /api/leads/status  
\`\`\`

 Ground Verification

\`\`\`  
POST /api/leads/verify  
\`\`\`

 Dashboard APIs

Each stakeholder has dedicated dashboard endpoints.

Examples

\`\`\`  
GET /api/admin/dashboard  
GET /api/user/dashboard  
GET /api/member/dashboard  
GET /api/venue/dashboard  
GET /api/venueadmin/dashboard  
GET /api/cbdp/dashboard  
GET /api/mbdp/dashboard  
GET /api/enterprise/dashboard  
GET /api/prm/dashboard  
GET /api/rm/dashboard  
GET /api/governance/dashboard  
\`\`\`

 Notification APIs

 Get Notifications

\`\`\`  
GET /api/notifications  
\`\`\`

 Mark as Read

\`\`\`  
PUT /api/notifications/read  
\`\`\`

 Push Notifications

\`\`\`  
POST /api/notifications/push  
\`\`\`

 Payment APIs

 Create Payment

\`\`\`  
POST /api/payments/create  
\`\`\`

 Verify Payment

\`\`\`  
POST /api/payments/verify  
\`\`\`

 Payment History

\`\`\`  
GET /api/payments/history  
\`\`\`

 Wallet

\`\`\`  
GET /api/wallet  
\`\`\`

 Reports APIs

\`\`\`  
GET /api/reports  
GET /api/reports/export  
GET /api/analytics  
\`\`\`

 Admin APIs

Platform Admin can manage:

 Users  
 Members  
 Venue Partners  
 CBDPs  
 MBDPs  
 Enterprise BDPs  
 Events  
 Offers  
 Memberships  
 Payments  
 AI Lead Assist  
 Reports  
 Settings

Examples

\`\`\`  
GET /api/admin/users  
GET /api/admin/members  
GET /api/admin/venues  
GET /api/admin/events  
GET /api/admin/payments  
GET /api/admin/reports  
\`\`\`

 API Security

Every API follows:

 JWT Authentication  
 RoleBased Access Control (RBAC)  
 HTTPS Only  
 Request Validation  
 Rate Limiting  
 Input Sanitization  
 Audit Logging  
 Secure Headers

 Standard API Response

Successful Response

\`\`\`json  
{  
  "success": true,  
  "message": "Request completed successfully.",  
  "data": {}  
}  
\`\`\`

Error Response

\`\`\`json  
{  
  "success": false,  
  "message": "Something went wrong.",  
  "error": {}  
}  
\`\`\`

 Future APIs

Future modules will include APIs for:

 AI Recommendations  
 Loyalty & Rewards  
 Wallet & Credits  
 Subscription Credits  
 CRM  
 Marketing Automation  
 Chat & Messaging  
 Video Meetings  
 Digital Contracts  
 Vendor Marketplace  
 Business Ranking

 LongTerm Vision

The GCE API architecture is designed as a scalable, modular, and secure service layer that powers every module of the platform.

Each API follows standardized authentication, validation, and business rules, allowing seamless communication between the Next.js PWA, Supabase database, AI Lead Assist engine, dashboards, and future integrations while supporting millions of users and businesses across the GCE ecosystem.  
