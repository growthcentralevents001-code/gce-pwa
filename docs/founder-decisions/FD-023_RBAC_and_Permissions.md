# FD-023 — RBAC and Permissions

**Decision ID:** FD-023
**Title:** Role-Based Access Control and Permissions
**Status:** Founder Approved
**Decision Type:** Access-Control Constitution
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** GCE Connect, GCE Marketplace, GCE Enterprise, shared platform services, administration, governance, finance, and operations

---

## 1. Purpose

This Founder Decision defines the approved Role-Based Access Control architecture of the Growth Central Events platform.

It establishes:

- One-account, multi-role access
- Role-based workspaces
- Permission-based access
- Role compatibility
- Conflict-of-interest controls
- Separation of business roles and administrative roles
- Department-scoped administration
- Emergency overrides
- Financial-access restrictions
- Governance-role restrictions
- Legacy-role migration principles
- Audit requirements
- Unresolved items that must not be invented

This file defines business and architecture rules.

It does not define:

- Database enum names
- Supabase RLS policies
- API middleware
- Route names
- UI menu implementation
- Exact permission codes
- Technical authentication flows
- Session duration
- Password or OTP rules

Those subjects must be designed later without contradicting this Founder Decision.

---

## 2. Core RBAC Principle

The approved access-control model is:

```text
One GCE Account
        ↓
One or More Approved Roles
        ↓
Role-Based Workspaces
        ↓
Explicit Permissions
        ↓
Auditable Actions
```

A role is not a separate account.

A workspace is not a separate account.

A user may hold more than one compatible role through the same GCE account.

---

## 3. One Account, Multiple Roles

Every person should have one primary GCE account.

That account may be assigned one or more approved roles.

Examples may include:

- Registered User
- GCE Connect Member
- GCE Connect Circle Member
- Connect BDP
- Marketplace BDP
- Enterprise BDP
- Venue Partner
- Enterprise Client
- Circle Governance role
- RM
- PRM
- Platform administrative role

Each role must be separately assigned, approved, suspended, revoked, and audited.

---

## 4. Role-Based Workspaces

Each approved role may provide access to one or more role-based workspaces.

Examples:

- User Workspace
- Member Workspace
- Circle Workspace
- Connect BDP Workspace
- Marketplace BDP Workspace
- Enterprise BDP Workspace
- Venue Partner Workspace
- Enterprise Client Workspace
- Circle Governance Workspace
- Relationship Management Workspace
- Platform Administration Workspace
- Finance Workspace
- Compliance Workspace
- Support Workspace

A workspace only exposes the modules and actions permitted for that role.

---

## 5. Permission-Based Access

Role names alone must not grant unlimited access.

Every sensitive action must be controlled by explicit permission.

Permissions should be granular enough to distinguish actions such as:

- View
- Create
- Edit
- Submit
- Approve
- Reject
- Suspend
- Reassign
- Refund
- Settle
- Export
- Audit
- Override

The exact permission-code naming convention is not finalised in this Founder Decision.

---

## 6. No Automatic Permission Inheritance

A role must not automatically inherit every permission of another role.

Examples:

- A PRM does not automatically inherit Finance Administrator permissions.
- A Connect BDP does not automatically inherit Circle Board permissions.
- A Circle Chairperson does not automatically inherit Platform Administrator permissions.
- A Marketplace BDP does not automatically inherit Venue Partner permissions.
- A Support Administrator does not automatically inherit Compliance or Finance permissions.

Where permission inheritance is used technically, it must remain controlled and explicit.

---

## 7. Least-Privilege Principle

Every role should receive only the minimum access necessary to perform approved responsibilities.

The platform should avoid:

- Universal superuser access
- Shared administrator accounts
- Unrestricted cross-vertical access
- Broad access to personal data
- Broad financial access
- Uncontrolled manual overrides
- Permanent emergency permissions

---

## 8. Role Families

The approved role families are:

1. Public and General User Roles
2. GCE Connect Roles
3. GCE Marketplace Roles
4. GCE Enterprise Roles
5. Circle Governance Roles
6. Platform Operations Roles
7. Platform Administration Roles
8. Finance, Compliance, Support, and Security Roles
9. Legacy or Retired Roles

Detailed role names are maintained in:

> `docs/core/35_Role_Taxonomy.md`

---

# PART A — PUBLIC AND GENERAL ACCESS

## 9. Visitor

A Visitor may access approved public content.

Typical public access may include:

- Public platform information
- Public event information
- Public Marketplace listings
- Public membership information
- Public business-partner information
- Registration pages

A Visitor must not access:

- Private dashboards
- Circle member data
- Referral data
- Internal financial data
- Governance tools
- Administrative functions

---

## 10. Registered User

A Registered User may access approved authenticated user functions.

Typical access may include:

- Personal profile
- Bookings
- Transactions
- Applications
- Notifications
- Marketplace participation
- Membership application
- Business-partner application

A Registered User is not automatically granted business, governance, partner, or administrative authority.

---

# PART B — GCE CONNECT ACCESS

## 11. GCE Connect Member

A GCE Connect Member may access approved membership functions, including:

- Own membership profile
- Membership status
- Renewal information
- Approved member benefits
- Applicable event access
- Own payment history
- Own trust or participation information

A Connect Member without an active Circle seat must not automatically receive full Circle access.

---

## 12. Circle Member

A Circle Member may access approved functions for the assigned Circle.

Typical access may include:

- Circle directory
- Own specialization seat
- Meeting information
- Referral functions
- Own performance records
- Voting functions when eligible
- Governance notices

A Circle Member must not access:

- Other Circles’ private records without approved access
- Platform financial administration
- Unrestricted member personal data
- BDP administration
- Platform-wide governance controls

---

## 13. Connect BDP

The Connect BDP may access assigned GCE Connect operations.

Typical approved access may include:

- Assigned prospect pipeline
- Assigned member onboarding
- Business verification support
- Seat availability
- Circle formation
- Assigned Circle operations
- Member-success support
- Performance monitoring
- Governance support
- Assigned compliance follow-up
- Circle Health Score information
- Approved reports

The Connect BDP must not automatically access:

- Unassigned Circles
- Marketplace BDP workspace
- Enterprise BDP workspace
- Platform tax settings
- Platform-wide finance
- Other users’ unrelated personal records
- Unrestricted administrative controls

---

# PART C — GCE MARKETPLACE ACCESS

## 14. Venue Partner

A Venue Partner may access approved functions for the Venue Partner’s own business.

Typical access may include:

- Business profile
- Venue profile
- Listings
- Events
- Offer campaigns
- Bookings
- Orders
- Redemptions
- Reviews
- Own settlement reports
- Own refunds
- Performance analytics

A Venue Partner must not access:

- Other Venue Partners’ private data
- Marketplace BDP commission records
- Platform-wide settlement controls
- GCE Connect governance
- Enterprise administration

---

## 15. Marketplace BDP

A Marketplace BDP may access assigned venue and Marketplace operations.

Typical approved access may include:

- Assigned venue pipeline
- Venue onboarding
- Business verification support
- Assigned venue records
- Event-listing support
- Offer-campaign support
- Venue engagement
- Assigned performance information
- Own commission records
- Approved reports

A Marketplace BDP must not automatically:

- Act as the Venue Partner
- Edit venue financial records without permission
- Release settlements
- Issue refunds
- Access unassigned venues
- Access GCE Connect or GCE Enterprise authority

---

# PART D — GCE ENTERPRISE ACCESS

## 16. Enterprise Client

An Enterprise Client may access approved project and client functions.

Typical access may include:

- Submit requirements
- View proposals
- View quotations
- Approve milestones
- View project progress
- Make payments
- View invoices
- Raise approved change requests
- Confirm project completion

An Enterprise Client must not access:

- Internal vendor margins
- Other enterprise clients’ data
- BDP commission information
- Internal platform administration
- GCE Connect governance

---

## 17. Enterprise BDP

An Enterprise BDP may access assigned enterprise opportunity functions.

Typical approved access may include:

- Assigned leads
- Client pipeline
- Requirement records
- Discovery notes
- Proposal coordination
- Follow-up
- Relationship management
- Own commission records
- Approved opportunity reports

An Enterprise BDP must not automatically:

- Approve final quotations
- Select vendors without approval
- Release payments
- Approve settlements
- Alter contracts
- Access unrelated enterprise accounts
- Access other verticals’ authority

---

# PART E — CIRCLE GOVERNANCE ACCESS

## 18. Board of Governance

The Circle Board may access approved governance functions for its own Circle.

Typical access may include:

- Governance agenda
- Meeting minutes
- Member notices
- Election tools
- Governance reports
- Approved member-status visibility
- Complaint-routing tools
- Circle performance summaries

The Board must not:

- Own the Circle
- Activate a Circle
- Create a new Circle independently
- Override platform decisions
- Move platform funds
- Change platform taxonomy directly
- Access other Circles without authority

---

## 19. Governance Officers

Individual governance roles may receive role-specific permissions.

Examples:

### Chairperson

- Chair governance meetings
- View governance agenda
- Submit approved Circle reports
- Coordinate Board activity

### Secretary

- Maintain minutes
- Maintain approved records
- Send approved notices

### Treasurer

- View approved Circle-level financial information
- Maintain approved Circle financial records

The Treasurer must not automatically access platform wallets, settlements, or bank accounts.

### Membership Coordinator

- View approved seat and onboarding information
- Support waitlist and member queries

### Referral Coordinator

- View approved referral-performance data
- Support referral follow-up

### Events Coordinator

- Manage approved Circle meeting logistics

### Compliance Coordinator

- View and submit approved compliance records

---

## 20. Sergeant-at-Arms

The Sergeant-at-Arms may receive permissions related to:

- Attendance
- Guest registration
- Meeting timing
- Meeting discipline
- Meeting-support records

The Sergeant-at-Arms must not receive unrestricted disciplinary or administrative authority.

---

# PART F — PLATFORM OPERATIONS ACCESS

## 21. Relationship Manager

An RM may access only information necessary for assigned relationship and operational duties.

Possible access may include:

- Assigned member records
- Assigned venue records
- Assigned cases
- Communication history
- Service-quality information
- Approved operational reports

An RM does not automatically receive:

- Settlement authority
- Refund authority
- Tax authority
- Platform-wide user administration
- Security administration
- Final dispute authority

---

## 22. Platform Relationship Manager

A PRM may access approved escalation, investigation, and platform-relationship functions.

Possible access may include:

- Escalated cases
- Assigned investigation records
- Compliance evidence
- Partner-performance information
- Circle or venue intervention records
- Platform decision workflows

A PRM does not automatically receive unrestricted financial authority.

A PRM must not move funds, issue refunds, alter ledgers, or release settlements unless explicitly granted that permission and audited.

---

## 23. Platform Taxonomy Team

The Platform Taxonomy Team may access:

- Taxonomy requests
- Duplicate checks
- Conflict analysis
- Taxonomy review
- Taxonomy approval
- Taxonomy rejection
- Taxonomy editing
- Taxonomy publishing
- Taxonomy audit history

Final taxonomy publishing authority belongs to the authorised Platform Taxonomy function.

---

# PART G — PLATFORM ADMINISTRATION

## 24. Department-Scoped Administration

Platform administration must be divided by responsibility.

The platform must not assume that every administrator is a universal superuser.

Possible administrative domains include:

- User Administration
- Membership Administration
- Connect Administration
- Marketplace Administration
- Enterprise Administration
- Finance Administration
- Compliance Administration
- Taxonomy Administration
- Support Administration
- Security Administration
- Reporting Administration

Each administrative role should have its own permission scope.

---

## 25. Platform Administrator

A Platform Administrator receives only the permissions assigned to that administrative role.

Possible functions may include:

- User support
- Role assignment
- Workspace management
- Status management
- Operational configuration
- Reporting

The Platform Administrator role must not automatically include unrestricted finance, security, or tax authority.

---

## 26. Finance Administrator

A Finance Administrator may receive approved permissions for:

- Settlement review
- Refund review
- Commission review
- Reconciliation
- Ledger exception review
- Chargeback coordination
- Payout support

Financial actions must remain:

- Auditable
- Permission controlled
- Subject to segregation of duties
- Subject to approval rules

---

## 27. Compliance Administrator

A Compliance Administrator may receive approved permissions for:

- KYC review
- Business verification
- Fraud review
- Policy enforcement
- Suspension recommendations
- Compliance cases
- Evidence review
- Audit support

---

## 28. Support Administrator

A Support Administrator may receive approved permissions for:

- Ticket handling
- Account support
- Case routing
- Communication
- Basic profile assistance
- Escalation support

Support access must not automatically expose unrestricted financial, identity, or confidential business data.

---

## 29. Security Administrator

A Security Administrator may receive approved permissions for:

- Access review
- Security incidents
- Account compromise response
- Role audit
- Suspicious activity review
- Emergency-access governance
- Forced logout or restriction workflows

---

# PART H — MULTI-ROLE COMPATIBILITY

## 30. Compatible Multi-Role Principle

A user may hold multiple compatible roles.

Examples may include:

- Registered User + Venue Partner
- Registered User + Enterprise Client
- Connect Member + Enterprise Client
- Circle Member + Circle governance role
- Venue Partner + Marketplace customer role

Every combination must still be checked against:

- Conflict of interest
- Data visibility
- Financial separation
- Governance independence
- Reporting lines
- Beneficiary status

---

## 31. Approved Conflict Rule

The following conflict is explicitly prohibited:

> A user must not simultaneously act as a Circle Member and as the Connect BDP responsible for the same Circle or directly conflicting GCE Connect structure.

The system must prevent this role combination within the conflicting scope.

---

## 32. Other Restricted Combinations

The following combinations require additional review:

- BDP + Platform Administrator
- Finance Administrator + Beneficiary of the same transaction
- Governance Officer + Investigator of the same complaint
- PRM + Final approver in a personally conflicted case
- Taxonomy approver + Applicant for the same taxonomy request
- Support role + unrestricted access to sensitive identity data
- Compliance reviewer + subject of the same investigation

The exact conflict matrix must be documented later.

---

# PART I — ROLE ASSIGNMENT AND STATUS

## 33. Role Assignment

Every role assignment should record:

- User account
- Role
- Vertical
- Scope
- Assigned entity
- Territory where applicable
- Approval authority
- Effective date
- Expiry date where applicable
- Status
- Suspension reason
- Termination reason
- Audit history

---

## 34. Role Statuses

Role assignments may use statuses such as:

- Applied
- Pending Verification
- Pending Approval
- Active
- Restricted
- Under Review
- Suspended
- Expired
- Terminated
- Revoked
- Archived

The exact technical statuses may differ by role.

---

## 35. Role Revocation

When a role is revoked:

- Access must be removed
- Workspace access must be removed
- Active sessions should be re-evaluated
- Historical actions must remain preserved
- Financial history must remain linked
- Audit history must remain visible
- New role assignment must require approval

Revocation must not delete the user account unless separately required.

---

# PART J — DATA ACCESS

## 36. Scope-Based Data Access

Access must be limited by scope.

Possible scopes include:

- Own record
- Assigned Circle
- Assigned venue
- Assigned enterprise client
- Assigned territory
- Assigned department
- Platform-wide, only where explicitly approved

A role with access to one entity must not automatically access all entities of the same type.

---

## 37. Sensitive Data

Sensitive data may include:

- Identity documents
- Financial information
- Bank details
- Tax information
- Personal contact details
- Complaint evidence
- Investigation records
- Internal commercial information

Sensitive data access must require explicit permission.

---

## 38. Contact Information

The platform should avoid exposing unrestricted member, customer, venue, or enterprise-client contact information.

Exact masking and reveal rules are not finalised in this Founder Decision.

---

# PART K — FINANCIAL PERMISSIONS

## 39. Financial Access Separation

Financial permissions must be separated from operational permissions.

Examples of distinct financial permissions include:

- View own transactions
- View assigned settlement
- Request refund
- Approve refund
- Release settlement
- Adjust ledger
- Approve commission
- Execute payout
- Reconcile account
- Export financial report

No operational role should receive all financial permissions automatically.

---

## 40. RM and PRM Financial Restriction

RM and PRM roles may view limited financial context where required for a case.

They do not automatically receive authority to:

- Release funds
- Alter ledgers
- Approve refunds
- Change commissions
- Override tax
- Execute payouts

---

## 41. BDP Financial Restriction

A BDP may view:

- Own commission
- Own recovery deductions
- Own payout status
- Assigned commercial performance

A BDP may not:

- Mark commission as earned
- Alter commission percentage
- Release own payout
- Modify venue settlement
- Issue customer refund
- Move platform funds

---

# PART L — EMERGENCY ACCESS

## 42. Emergency Override

The platform may support emergency access for exceptional situations.

Emergency override must be:

- Time limited
- Reason based
- Explicitly authorised
- Fully logged
- Reviewed after use
- Revoked automatically where possible

Emergency override must not become permanent administrator access.

---

## 43. Emergency Override Audit

The audit record should include:

- User
- Role
- Reason
- Approver
- Start time
- End time
- Data accessed
- Actions performed
- Financial impact
- Review outcome

The exact technical implementation is not finalised.

---

# PART M — AUDIT

## 44. Access Audit

The platform must preserve audit history for:

- Role assignment
- Role approval
- Role suspension
- Role revocation
- Permission changes
- Workspace access
- Sensitive-data access
- Administrative actions
- Financial actions
- Emergency override
- Failed access attempts where appropriate

---

## 45. Immutable Permission History

Permission history must not be silently overwritten.

Changes should preserve:

- Previous permission
- New permission
- Actor
- Time
- Reason
- Approval
- Scope

---

# PART N — LEGACY ROLE MIGRATION

## 46. Legacy Role Policy

Legacy terms or technical role values may exist in older documents, code, or database structures.

Examples include:

- ZBP
- BDM
- CBDP
- MBDP
- Affiliate
- Franchisee
- Generic Enterprise role

These must not be assumed to be current canonical roles.

---

## 47. Current Approved Role Names

The approved business-development role names are:

- GCE Connect Business Development Partner
- Connect BDP
- GCE Marketplace Business Development Partner
- Marketplace BDP
- GCE Enterprise Business Development Partner
- Enterprise BDP

---

## 48. Migration Rule

Legacy values may remain temporarily for backward compatibility.

However:

- User-facing names must use approved terminology
- Canonical documents must use approved terminology
- New code should not introduce obsolete names
- Database migration must use explicit mapping
- No legacy value may be retired without impact review

---

# PART O — PROHIBITED INTERPRETATIONS

## 49. Prohibited Interpretations

This Founder Decision must not be interpreted to mean:

- One role equals one account
- One user may not hold multiple compatible roles
- Every administrator is a superuser
- PRM has unrestricted finance authority
- Connect BDP may access all Circles
- Marketplace BDP may act as Venue Partner
- Circle Board owns the Circle
- Governance role grants platform administration
- Role title alone grants every permission
- Emergency access may be permanent
- Legacy database enums are automatically approved
- Cursor may invent missing permissions

---

# PART P — CANONICAL DOCUMENT IMPACT

## 50. Documents Affected

This Founder Decision should be reflected in:

- Role Taxonomy
- Platform Identity and Workspace Architecture
- Business Model
- Membership Architecture
- Circle Architecture
- Marketplace Architecture
- Enterprise Architecture
- Financial Architecture
- Settlement Engine
- Dashboard Architecture
- Database Architecture
- API Architecture
- Security Architecture
- Audit Architecture
- Cursor Rules

---

## 51. Related Founder Decisions

This Founder Decision works together with:

- FD-001 — GCE Business Model
- FD-020 — Financial and Wallet Architecture
- FD-021 — Settlement Engine
- FD-022 — Membership Lifecycle
- FD-024 — GCE Connect Circle Lifecycle

Where a role-specific Founder Decision defines more detailed authority, that specific decision applies without contradicting the least-privilege and audit principles in this file.

---

# PART Q — UNRESOLVED ITEMS

## 52. Items Not Finalised

The following remain unresolved:

- Exact permission-code list
- Exact permission matrix
- Exact database role enums
- Exact RLS policies
- Exact route guards
- Exact workspace URLs
- Exact RM scope by vertical
- Exact PRM final-authority matrix
- Exact finance maker-checker rules
- Exact emergency-access approval chain
- Exact sensitive-data masking rules
- Exact contact-reveal rules
- Exact session-revocation process
- Exact role-expiry rules
- Exact conflict-of-interest matrix
- Exact legacy-role migration plan
- Exact audit-retention period

Cursor and developers must not invent these rules.

---

## 53. Founder Approval Summary

| RBAC Principle | Status |
|---|---|
| One GCE account | Founder Approved |
| Multiple compatible roles | Founder Approved |
| Role-based workspaces | Founder Approved |
| Explicit permission-based access | Founder Approved |
| No automatic unrestricted inheritance | Founder Approved |
| Least-privilege access | Founder Approved |
| Department-scoped administration | Founder Approved |
| No universal admin god mode by default | Founder Approved |
| PRM has no automatic finance authority | Founder Approved |
| BDP financial restrictions | Founder Approved |
| Circle governance authority is limited | Founder Approved |
| Connect BDP and Circle Member conflict rule | Founder Approved |
| Emergency override must be logged and controlled | Founder Approved |
| Permission history must remain auditable | Founder Approved |
| Legacy roles require explicit migration mapping | Founder Approved |

---

## 54. Decision Statement

GCE will use a permission-based, least-privilege RBAC architecture.

Users may hold multiple compatible roles through one account, but every role, workspace, permission, scope, and sensitive action must remain explicit, controlled, and auditable.

No role title alone grants unrestricted platform authority.

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-023**
