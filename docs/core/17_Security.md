# Security

## Authority

**FD-023** — RBAC, least privilege, department-scoped administration, no default universal admin god mode; RM/PRM have no automatic financial authority.
**FD-001** — one GCE account; multiple compatible roles; workspaces ≠ separate accounts.
**FD-020 / FD-021** — financial access and settlement controls are permission-separated; payment ≠ settlement.
**FD-022 / FD-027 / FD-024 / FD-030** — membership and Circle seat are separate; membership is platform-only (FD-027); Connect BDP cannot independently activate Circles or manually activate membership; Governing Body cannot independently terminate members or hold Circle funds (FD-030).
**FD-025** — Connect BDP does not own territory, Circles, members, or data; cannot self-approve personal commission or move platform funds; Franchise Unit access remains permission-scoped.
**FD-026** — Enterprise BDP and Enterprise Platform Expert do not own clients, projects, or data; Expert access is project-scoped; neither may physically execute events or approve refunds/settlements independently.
**FD-031** — Lead Assist / Lead Intelligence: consent and privacy before sharing; quality states (not “only verified”); human review for sensitive/high-value/low-confidence cases; no hard-delete of lead/assignment history except approved legal privacy workflow; Opportunity Desk must not secretly favour members or own leads.

Exact Supabase RLS policy definitions and the full permission matrix are **Pending Technical Design** — not Founder-approved as a finished code matrix. Prefer role names in `35_Role_Taxonomy.md`.

---

Overview

The GCE platform follows an enterprisegrade security architecture designed to protect users, businesses, financial transactions, AI Lead Assist, enterprise projects, and platform data.

Security is implemented across every layer of the platform, including authentication, authorization, APIs, databases, dashboards, payments, infrastructure, and AI services.

The goal is to provide a secure, scalable, and productionready ecosystem.

 Security Objectives

The GCE Security Framework is designed to:

 Protect User Data
 Prevent Unauthorized Access
 Secure Financial Transactions
 Prevent Fraud
 Protect Business Information
 Secure AI Lead Assist
 Protect APIs
 Secure Dashboards
 Ensure Data Privacy
 Maintain Business Integrity

 Security Architecture

The platform follows a layered security model.

Security Layers

 Authentication Security
 Authorization Security
 API Security
 Database Security
 Dashboard Security
 Payment Security
 Infrastructure Security
 AI Security
 Monitoring & Auditing

 Authentication Security

Authentication is handled using Supabase Authentication.

Features include:

 JWT Authentication
 Refresh Tokens
 Password Hashing
 Email Verification
 Mobile OTP Verification
 Session Management
 Device Tracking

 RoleBased Access Control (RBAC)

Every authenticated user is assigned a predefined role.

Supported Roles

 Platform Admin
 Board of Governance
 Relationship Manager (RM)
 Platform Relationship Manager (PRM)
 Connect BDP (GCE Connect Business Development Partner)
 Marketplace BDP (GCE Marketplace Business Development Partner)
 Enterprise Business Development Partner
 Enterprise Platform Expert (internal/controlled — FD-026)
 Venue Partner
 Circle Member
 User

Every role has its own:

 Dashboard
 API Access
 Module Permissions
 Business Permissions

Unauthorized access is automatically blocked.

 Database Security

The platform uses PostgreSQL on Supabase.

Security Features

 Row Level Security (RLS) — required engineering practice; exact policies **Pending Technical Design** (FD-023)

 UUID Primary Keys
 Foreign Key Constraints
 Secure Database Policies
 Automatic Backups
 Encrypted Connections

Sensitive data is never exposed directly to the client.

 API Security

Every protected API requires:

 JWT Authentication
 Role Validation
 Input Validation
 Request Sanitization
 Rate Limiting
 HTTPS
 Audit Logging

Every request is validated before executing business logic.

 Password Security

Password Requirements

 Minimum 8 Characters
 Uppercase Letter
 Lowercase Letter
 Number
 Special Character

Passwords are hashed before storage.

Plain text passwords are never stored.

 Session Security

Each active session stores:

 Device
 Browser
 Login Time
 Last Activity
 IP Address

Users can:

 View Active Sessions
 Logout Current Device
 Logout All Devices

 Dashboard Security

Every dashboard follows strict access control.

Security Features

 Role Verification
 Module Permissions
 Session Validation
 Activity Tracking
 Secure Navigation

Users can only access their assigned dashboard.

 AI Lead Assist Security

Authority: **FD-031** / `39_AI_Lead_Assist_Spec.md`.

Every business lead passes through classification and verification with consent/privacy controls. Distribution is **not** limited to a single “verified” label — quality states are Unverified → Preliminarily Verified → Qualified → Rejected/Invalid. Only Qualified leads enter distribution under approved rules.

Lead Workflow (conceptual)

Submission (Lead Source / Lead Giver) + Consent / Lawful Basis

↓

Quality State + AI Classification (GCE Lead Intelligence Engine)

↓

Human Review when required (GCE Lead Intelligence and Opportunity Desk)

↓

Offer / Assignment to Eligible Lead Receiver (history preserved)

↓

Receiver Actions: Accept · Decline · Clarify · Duplicate · Invalid · Collaborate

↓

Follow-up / Reassignment / Dual-Confirmed Closed Business / Closure

Security rules: customer consent or lawful basis before sharing personal data; purpose limitation; limited recipient access; no sale of personal data; human review for high-value, regulated, privacy-sensitive, disputed, fraud-flagged, and low-confidence leads. Do **not** hard-delete lead or assignment history except via an approved legal privacy workflow; preserve audit and assignment history.

 Identity Verification

Identity verification is required for selected platform activities.

KYC posture (FD-039): minimise identity-document collection. **Aadhaar is not mandatory by default.** Prefer fit-for-purpose lower-risk documents by stakeholder type. Aadhaar may be used only where legally permitted, operationally justified, proportionate, and privacy requirements are satisfied.

Supported Documents (examples — not a default-mandatory set)

 PAN
 Passport
 Driving Licence
 Business registration / GST / company documents where applicable
 Bank verification
 Aadhaar (only where justified under FD-039)

Verification helps prevent:

 Fake Accounts
 Fake Business Leads
 Duplicate Registrations
 Fraudulent Activities

 Fraud Prevention

The platform actively detects:

 Fake Users
 Duplicate Accounts
 Fake Business Leads
 Spam Requests
 Fake Venue Listings
 Payment Fraud
 QR Ticket Fraud

Repeated violations may result in:

 Warning
 Account Suspension
 Permanent Ban

 QR Ticket Security

Every ticket contains a unique QR Code.

Security Rules

 OneTime Scan
 Unique Identifier
 Duplicate Detection
 Expiry After Event Completion

QR codes cannot be reused.

 Payment Security

Payments are processed through secure payment gateways.

Security Features

 SSL Encryption
 Secure Gateway
 Webhook Verification
 Transaction Validation
 Payment Audit Logs

The platform never stores debit or credit card information.

 File Upload Security

Uploaded files are validated for:

 File Type
 File Size
 Virus Protection (Future)
 Secure Storage
 Access Permissions

Executable files are blocked.

 Data Encryption

Sensitive information is protected using encryption.

Includes:

 Password Hashing
 HTTPS
 JWT Signing
 Secure Token Storage
 Encrypted Database Connections

 Audit Logs

Every important platform activity is recorded.

Examples

 Registration
 Login
 Logout
 Password Reset
 Membership Purchase
 Event Booking
 Offer Creation
 Payment
 Lead Assignment
 Dashboard Activity
 Admin Actions

Audit logs cannot be modified by standard users.

 Backup Strategy

The database follows a multilevel backup strategy.

Includes

 Daily Backup
 Weekly Backup
 Monthly Archive
 Disaster Recovery Backup

 Infrastructure Security

The hosting environment follows industry best practices.

Includes

 HTTPS Only
 Firewall Protection
 Secure Environment Variables
 DDoS Protection
 Server Monitoring
 Automated Deployments
 Continuous Backup

 Monitoring & Alerts

The platform continuously monitors:

 Failed Login Attempts
 API Abuse
 Payment Failures
 Suspicious Activity
 Server Errors
 Database Health
 Security Events

Critical incidents automatically notify administrators.

 Compliance

The platform follows security best practices for:

 User Privacy
 Business Data Protection
 Secure Authentication
 Secure Payments
 Audit Trails

Future compliance goals include:

 GDPR
 ISO 27001
 PCIDSS (via payment gateway providers)

 Future Security Enhancements

Planned upgrades include:

 TwoFactor Authentication (2FA)
 Biometric Login
 Passkeys
 AI Fraud Detection
 Device Trust Management
 Security Dashboard
 Risk Scoring
 RealTime Threat Monitoring

 LongTerm Vision

The GCE Security Framework is designed to provide enterprisegrade protection across the entire GCE ecosystem.

Every module—including Authentication, Memberships, GCE Connect, Marketplace, Enterprise, AI Lead Assist, Payments, Dashboards, APIs, and Databases—operates within a secure, monitored, and scalable environment that protects users, businesses, and platform assets while supporting longterm growth.
