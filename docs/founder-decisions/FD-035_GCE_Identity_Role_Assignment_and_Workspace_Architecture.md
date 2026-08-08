# FD-035 — GCE Identity, Role Assignment, and Workspace Architecture

**Decision ID:** FD-035  
**Title:** GCE Identity, Role Assignment, and Workspace Architecture  
**Status:** Founder Approved  
**Decision Type:** Identity, Multi-Role, Role Assignment, Workspace, Role Migration, Access-Scope, Suspension, and Administrative Authority Constitution  
**Authority Level:** Founder Decision  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Applies To:** All GCE users, members, Connect BDPs, Marketplace BDPs, Enterprise BDPs, Venue representatives, Enterprise client representatives, Governing Body appointments, Relationship Managers, Platform Relationship Managers, Enterprise Platform Experts, Opportunity Desk personnel, platform administrators, finance users, compliance users, support users, technical teams, and all future role-based access implementations

---

## 1. Purpose

This Founder Decision establishes the authoritative identity and role architecture for Growth Central Events.

It resolves the outstanding business questions concerning:

- What a User is
- Whether one person may hold multiple roles
- How multiple roles coexist
- Which role combinations are allowed or restricted
- How roles are scoped
- How roles are assigned, activated, suspended, expired, revoked, or terminated
- How legacy role names are treated
- How Connect BDP, Marketplace BDP, Enterprise BDP, Member, Venue, Enterprise Client, Governing Body, RM, PRM, and platform roles coexist
- How users with multiple roles enter and switch workspaces
- How high-privilege administrative access is handled
- How historical role records remain auditable
- What must be implemented in Phase 2 without overloading a single global role enum

This decision establishes business architecture.

It does not prescribe exact database table names, enum names, API routes, Supabase policies, or implementation code. Those remain Technical Design decisions and must implement this Founder Decision.

This decision must be read together with:

- FD-001 — Business Model
- FD-022 — Membership Lifecycle
- FD-023 — RBAC and Permissions
- FD-024 — GCE Connect Circle Lifecycle
- FD-025 — Connect BDP Commercial and Operating Architecture
- FD-026 — GCE Enterprise Business and Operating Architecture
- FD-027 — Membership Commercial and Operating Architecture
- FD-028 — Revenue Recognition and Commercial Architecture
- FD-029 — Commission Engine and Stakeholder Entitlement Architecture
- FD-030 — GCE Connect Circle Architecture and Governance
- FD-031 — GCE Connect AI Lead Assist Architecture
- FD-032 — Phase 1 Authority, Status Mapping, and Supersession Clarification
- FD-033 — GCE Marketplace BDP Commercial and Operating Architecture
- FD-034 — Logixia and GCE Corporate Platform Constitution

---

# PART A — CORE IDENTITY MODEL

## 2. Permanent Base Identity

Every registered natural person on GCE shall have one permanent base account identity.

Approved business concept:

> **User is the permanent base identity, not a replaceable business role.**

A person does not stop being a User when they become:

- A Circle Member
- A Connect BDP
- A Marketplace BDP
- An Enterprise BDP
- A Venue representative
- An Enterprise Client representative
- A Governing Body member
- A Relationship Manager
- A Platform Relationship Manager
- A Platform Admin
- A Finance Admin
- A Compliance Admin
- A Support Admin
- An Enterprise Platform Expert
- An Opportunity Desk team member

Business roles are added to the person’s base identity through approved role assignments.

---

## 3. User Does Not Mean Permission Level

The term **User** must not be treated as a privileged business role.

User means:

- Registered account holder
- Base profile owner
- Authentication identity
- Holder of one or more optional business or operational assignments

A User with no additional assignment may still be allowed to use approved public or consumer-facing GCE features.

---

## 4. One Person, One Base Account

One natural person should ordinarily have one base GCE account.

Duplicate accounts should not be used to separate roles.

A person holding multiple roles should use one identity with multiple scoped assignments.

Exceptions for duplicate identity records require technical or compliance handling and must not become the normal operating model.

---

# PART B — MULTI-ROLE ARCHITECTURE

## 5. Multiple Roles Are Allowed

A single User may hold multiple approved roles simultaneously.

Examples include:

- User + Circle Member
- User + Connect BDP
- User + Marketplace BDP
- User + Enterprise BDP
- User + Venue representative
- User + Enterprise Client representative
- User + Governing Body appointment
- User + Platform operations role
- User + more than one approved business role

Multi-role capability is a core architectural principle.

---

## 6. Roles Must Be Separate Assignments

Roles must not be represented only by one overloaded global user-role value.

The business architecture requires separate role assignments capable of recording:

- Role type
- Scope
- Status
- Start date
- End date
- Approval authority
- Suspension state
- Termination state
- Relevant organisation
- Relevant Circle
- Relevant Venue Partner
- Relevant Enterprise Client
- Relevant business unit
- Historical audit trail

The exact technical representation remains Technical Design.

---

## 7. Role Scope

A role may be scoped to:

- Entire platform
- Legal entity
- Vertical
- City
- Circle
- Marketplace BDP unit
- Venue Partner
- Enterprise client
- Enterprise project
- Department
- Case
- Lead or opportunity
- Temporary assignment

Holding the same role name in one scope does not automatically grant the same authority in another scope.

---

# PART C — CONFLICT AND SEPARATION-OF-DUTIES RULES

## 8. No Automatic Blanket Ban on Multi-Role Users

Multi-role participation is allowed unless a specific conflict exists.

The platform should use:

- Scope restrictions
- Approval restrictions
- Separation of duties
- Conflict disclosures
- Self-approval prohibitions
- Audit controls

rather than banning all multi-role combinations.

---

## 9. Self-Approval Prohibited

No person may approve their own:

- Role appointment
- Membership exception
- Circle exception
- Venue exception
- Commission exception
- Settlement exception
- Refund exception
- Reassignment
- KYC exception
- Compliance exception
- Financial adjustment
- Suspension appeal
- Termination reversal

where that person is the beneficiary of the decision.

---

## 10. Beneficiary and Approver Separation

A person must not be both:

- Beneficiary and sole approver
- Payee and sole settlement approver
- Subject of investigation and final investigator
- Venue owner and sole venue-approval authority
- BDP and sole approver of their own commission
- Governing Body office-holder and controller of platform money

The platform must maintain human and technical separation of duties for sensitive decisions.

---

## 11. Connect BDP and Member Combination

A Connect BDP may also hold a Member role, subject to conflict controls.

A blanket prohibition on being both is not required.

However, where the Connect BDP is also a Member in a Circle under their operational responsibility:

- They may not self-approve their membership
- They may not use Connect BDP authority to bypass seat rules
- They may not alter their own commission or membership entitlement
- They may not receive duplicate entitlement merely because they hold both roles
- Governance decisions affecting their own commercial interest require conflict handling
- Relevant conflicts must be logged where material

---

## 12. Marketplace BDP and Venue Relationship

A Marketplace BDP may have a disclosed ownership, employment, or financial relationship with a Venue Partner only where permitted by GCE.

Such relationship must be disclosed.

The Marketplace BDP may not:

- Solely approve their own related venue
- Solely approve their own exception
- Manipulate attribution
- Manipulate commission
- Suppress complaints
- Receive hidden consideration

GCE may impose additional controls or deny the arrangement.

---

## 13. Platform Staff and Commercial Roles

A platform employee, contractor, or administrator may hold an external commercial role only if:

- Conflict is disclosed
- GCE approves it
- Permission boundaries are preserved
- No self-approval exists
- No confidential information is misused
- No unfair commercial advantage is created

Exact HR and legal restrictions remain subject to employment and contractor agreements.

---

# PART D — CANONICAL CURRENT ROLE FAMILIES

## 14. Canonical Business and Operational Roles

The current canonical role families include:

### Base Identity
- User

### GCE Connect
- Circle Member
- Connect BDP
- Governing Body Member
- Circle Finance Coordinator
- Sergeant-at-Arms

### GCE Marketplace
- Marketplace BDP
- Venue Representative / Venue Manager

### GCE Enterprise
- Enterprise BDP
- Enterprise Client Representative
- Enterprise Platform Expert

### Lead and Opportunity Operations
- GCE Lead Intelligence and Opportunity Desk

### Platform Operations
- Relationship Manager
- Platform Relationship Manager
- Platform Admin
- Finance Admin
- Compliance Admin
- Support Admin

These are business concepts.

The exact technical identifiers are not defined by this Founder Decision.

---

# PART E — SPECIFIC ROLE DEFINITIONS

## 15. Circle Member

A Circle Member is an approved person holding active GCE Connect membership and an approved Circle seat where applicable.

The Member role is separate from:

- Base User identity
- Connect BDP
- Governing Body appointment
- Platform operations roles

Membership status and Circle seat status remain governed by FD-022, FD-024, FD-027, FD-030, and FD-032.

---

## 16. Connect BDP

Connect BDP is the canonical current commercial and operating role under FD-025 and related Founder Decisions.

Connect BDP is not a replacement for User identity.

A Connect BDP role assignment may carry approved scope such as:

- Unit
- City
- Circle portfolio
- Appointment period

Exact technical representation remains Technical Design.

---

## 17. Marketplace BDP

Marketplace BDP is the canonical current role under FD-033.

A Marketplace BDP role assignment may be associated with:

- One or more Marketplace BDP Franchise Units
- Approved Venue Partner portfolio
- Operating area
- Attribution records

The person remains a User underneath the assignment.

---

## 18. Enterprise BDP

Enterprise BDP is the canonical current client-sourcing and relationship role under FD-026.

It must be represented separately from Enterprise Client.

The technical system must not overload one role identifier to mean both.

---

## 19. Enterprise Client Representative

An Enterprise Client Representative is an authorised natural person connected to an Enterprise client organisation.

The role:

- Represents the client organisation in approved platform workflows
- Is not an Enterprise BDP
- Does not automatically receive BDP commission
- Does not automatically receive platform administrative authority

The Enterprise client organisation and its authorised users must remain conceptually distinct.

---

## 20. Venue Representative / Venue Manager

A Venue Representative or Venue Manager is a natural person authorised to act for a Venue Partner on GCE.

This role is:

- Scoped to one or more approved Venue Partners
- Separate from Marketplace BDP
- Separate from Platform Admin
- Not automatically entitled to Marketplace BDP commission

Multiple authorised Venue Representatives may exist for one Venue Partner where approved.

---

# PART F — GOVERNING BODY, RM, AND PRM PERSISTENCE PRINCIPLES

## 21. Governing Body Is a Scoped Appointment

Governing Body status is not an unrestricted global platform role.

It is a scoped Circle appointment.

The record must preserve:

- User
- Circle
- Governing Body role
- Appointment start
- Appointment end
- Term
- Status
- Approval or election source
- Historical role
- Replacement or expiry
- Audit history

FD-030 and FD-032 remain authoritative for current Governing Body structure and six-month term.

---

## 22. Circle Finance Coordinator

Circle Finance Coordinator is a scoped Circle governance appointment.

It does not grant:

- Platform wallet authority
- Settlement authority
- Commission authority
- Refund authority
- Unrestricted financial access

Historical Treasurer records must remain auditable and mapped as legacy where required.

---

## 23. Relationship Manager

Relationship Manager is an operational assignment, not an automatic commercial entitlement role.

It may be scoped to:

- Member
- Circle
- Venue Partner
- Enterprise client
- Project
- Case
- Portfolio

RM assignment does not automatically create commission.

---

## 24. Platform Relationship Manager

Platform Relationship Manager is a platform-side operational or escalation assignment.

It must not be treated as:

- Marketplace BDP
- Connect BDP
- Enterprise BDP
- Automatic commission stakeholder

Any financial entitlement requires explicit Founder approval.

---

## 25. BOG / Circle Board Legacy Treatment

Terms such as:

- Board of Governance
- BOG
- Circle Board

are legacy or dual-use references.

Current internal Circle governance terminology should use:

> **Governing Body**

Historical records must not be silently rewritten.

---

# PART G — LEGACY ROLE MIGRATION

## 26. ZBP

`ZBP` is inactive and removed from the current business model.

Approved migration principle:

> Do not automatically map ZBP to Connect BDP.

Historical ZBP records must remain historical.

If a former ZBP later becomes a Connect BDP, that requires an approved current appointment rather than automatic migration.

---

## 27. CBDP

CBDP is a legacy abbreviation that may map to Connect BDP where historical context clearly proves equivalence.

The migration must preserve:

- Original value
- Current mapped value
- Mapping date
- Mapping authority
- Audit history

---

## 28. MBDP

MBDP is a legacy abbreviation that may map to Marketplace BDP where historical context clearly proves equivalence.

The system should use Marketplace BDP for new business-facing terminology.

---

## 29. BDM

`BDM` is ambiguous and must not be automatically mapped to any one modern role.

Possible historical meanings must be reviewed case by case.

Technical migration must:

- Preserve original BDM value
- Determine context
- Map only when evidence exists
- Flag unresolved records
- Avoid automatic financial entitlement

---

## 30. Affiliate

Affiliate is future-only and inactive.

Legacy technical values may remain for historical compatibility, but:

- No active Affiliate workspace
- No active Affiliate commission
- No active Affiliate attribution
- No active Affiliate settlement

may be created without a later Founder Decision.

---

## 31. Franchisee

Franchisee is not a canonical permission role.

It should be treated as a commercial relationship or unit/pack ownership concept where applicable.

Examples may include:

- Connect BDP Franchise Unit
- Marketplace BDP Franchise Unit

A user receives operational authority from the corresponding approved BDP assignment, not merely from a generic `franchisee` label.

---

## 32. Enterprise Legacy Role

A legacy `enterprise` role must not continue to represent both:

- Enterprise BDP
- Enterprise Client

Phase 2 must separate these concepts.

Historical records require migration and classification.

---

# PART H — WORKSPACE ARCHITECTURE

## 33. Workspace Definition

A Workspace is the user-facing operational context in which a User acts under a specific approved role or scope.

Examples include:

- Personal
- GCE Connect Member
- Connect BDP
- Marketplace BDP
- Venue Partner
- Enterprise BDP
- Enterprise Client
- Platform Operations

A workspace is not itself a legal entity or commercial entitlement.

---

## 34. Workspace Selector

Users with more than one active workspace should receive a clear workspace selector after authentication or from persistent navigation.

Approved MVP principle:

> **Use an explicit workspace switcher rather than silently choosing one role by priority.**

This reduces:

- Permission ambiguity
- Wrong-dashboard entry
- Cross-role mistakes
- Accidental financial actions
- Support confusion

---

## 35. Single-Workspace Users

Where a User has only one active workspace, the platform may redirect directly to that workspace.

The user should still retain access to their base account/profile.

---

## 36. Workspace Switching

Switching workspace must:

- Change active operational context
- Recalculate permissions
- Restrict data to the selected scope
- Preserve auditability
- Not create a second login
- Not duplicate the User account

Sensitive actions may require step-up authentication.

---

## 37. No Unified Mega-Dashboard for MVP

The MVP should not merge all role functions into one unrestricted mega-dashboard.

A future unified home may aggregate:

- Notifications
- Pending tasks
- Summaries
- Workspace shortcuts

but sensitive operations must remain inside the correct workspace and scope.

---

# PART I — ADMINISTRATIVE ROLES

## 38. Platform Admin

Platform Admin is a current operational role family used for approved internal administration.

Exact sub-roles and permissions must follow FD-023 and future technical RBAC design.

Platform Admin does not automatically have unlimited financial or compliance authority.

---

## 39. Finance Admin

Finance Admin handles approved finance operations.

Finance Admin must not automatically:

- Grant itself commercial roles
- Approve its own payout
- Alter business rules
- Change commission percentages
- Bypass settlement controls

---

## 40. Compliance Admin

Compliance Admin may support:

- KYC review
- Holds
- Investigation
- Fraud review
- Policy enforcement
- Suspension recommendations

Exact final authority depends on the relevant workflow.

---

## 41. Support Admin

Support Admin may assist users and manage support workflows within approved permissions.

Support Admin should not automatically receive:

- Financial override
- Commission override
- KYC override
- Legal authority
- Unrestricted PII access

---

## 42. Root / Emergency Administrative Capability

A highly privileged technical administration capability is required for platform continuity.

It should not be treated as an ordinary business role.

Approved principle:

> A restricted Root Administrator or Platform Owner capability may exist for emergency technical administration and recovery.

It must be:

- Extremely limited in membership
- Protected with strong authentication
- Fully audited
- Not used for routine daily operations
- Unable to silently erase audit history
- Subject to access review

Exact technical implementation remains Security and Technical Design.

---

## 43. Super Admin Terminology

The user-facing business role **Super Admin** is not required as a standard Phase 2 role.

Where a root-level technical capability exists, it should be treated as:

- Emergency platform authority
- Restricted technical control
- Not an ordinary workspace
- Not a commercial stakeholder

A later Founder Decision may introduce a formal Super Admin business role if required.

---

# PART J — VENUE ADMIN CLARIFICATION

## 44. Venue Admin Is Not One Ambiguous Role

The term `Venue Admin` must not be used to mean both:

1. A Venue Partner’s own authorised representative; and
2. A GCE internal administrator managing venues.

These are separate concepts.

---

## 45. Venue-Side Role

The venue-side user should be represented as:

> **Venue Representative** or **Venue Manager**

scoped to the Venue Partner.

---

## 46. Platform-Side Venue Administration

GCE internal venue administration should be handled through an appropriate Platform Admin or Marketplace Operations permission set.

It does not create Marketplace BDP commission or Venue ownership.

---

# PART K — ROLE LIFECYCLE

## 47. Role Assignment Statuses

Every assignable role should support business states equivalent to:

- Pending
- Active
- Suspended
- Expired
- Revoked
- Terminated

Exact technical enum values may differ.

---

## 48. Pending

Pending means:

- Assignment has been requested or created
- Required approval, KYC, agreement, payment, training, or verification is not complete
- No full operational authority exists yet

---

## 49. Active

Active means:

- Required activation conditions are satisfied
- Assignment is currently valid
- Approved permissions may be used within scope

---

## 50. Suspended

Suspended means:

- Assignment temporarily cannot exercise some or all authorities
- Underlying User account may remain active
- Other unrelated roles do not automatically become suspended

Platform-wide suspension may be applied only where the risk affects the whole User account.

---

## 51. Expired

Expired means:

- Assignment ended automatically at the end of an approved term or validity period

Historical access must remain auditable.

---

## 52. Revoked

Revoked means:

- Authority was withdrawn before ordinary expiry
- Reason and authority must be recorded

---

## 53. Terminated

Terminated means:

- Commercial or operational relationship ended under applicable rules
- Current authority ends
- Historical record remains

---

# PART L — ROLE-SPECIFIC SUSPENSION

## 54. Suspension Does Not Automatically Disable Entire User

Suspending one role assignment should ordinarily affect only that role.

Examples:

- Suspended Marketplace BDP may still remain a normal User
- Suspended Governing Body appointment may still retain Circle membership if membership itself remains valid
- Suspended Venue Manager may retain unrelated roles

Platform-wide account suspension is reserved for:

- Serious fraud
- Security compromise
- Legal requirement
- Platform-wide abuse
- Identity fraud
- Other approved critical cases

---

# PART M — ACCESS AND PERMISSION PRINCIPLES

## 55. Permission Is Derived From Assignment and Scope

Access must depend on:

- User identity
- Active role assignment
- Scope
- Assignment status
- Business-rule state
- Resource ownership or attribution
- Applicable restrictions
- Compliance holds

A role name alone is insufficient.

---

## 56. Minimum Necessary Access

Each role should receive only the minimum access required to perform approved responsibilities.

This applies especially to:

- PII
- Financial information
- KYC
- Leads
- Venue records
- Enterprise projects
- Member contact data
- Commission
- Settlement
- Compliance investigations

---

## 57. No Automatic Cross-Workspace Data Access

Holding multiple workspaces does not automatically merge all data.

A User with both Member and Marketplace BDP roles must not automatically see:

- All Circle financial data
- All Venue records
- All Enterprise clients
- All customer PII

Each workspace remains scope-controlled.

---

# PART N — APPROVAL AUTHORITY

## 58. Role Appointment Authority

Role appointment must be performed by an authorised GCE authority or workflow.

A person cannot grant themselves a business role.

Exact approval matrices remain governed by:

- Founder Decisions
- FD-023
- Future Technical and Operational design

---

## 59. Appointment Evidence

Role assignment records should preserve:

- Applicant or User
- Role
- Scope
- Requested date
- Approver
- Approval date
- Conditions
- Agreement version
- Relevant KYC
- Relevant payment or package
- Effective date
- Expiry
- Suspension
- Termination

---

# PART O — DASHBOARD AND ROUTING PRINCIPLES

## 60. Dashboard Is a Presentation of Workspace

A dashboard is the interface for a workspace.

Dashboard names must not become the source of truth for business roles.

The canonical role model should drive dashboard access.

---

## 61. Legacy Routes

Legacy routes may remain temporarily for compatibility.

They should:

- Redirect to current workspace routes
- Not create legacy permissions
- Not preserve obsolete business entitlements
- Be retired through a controlled migration

Exact route names remain Technical and Product Design.

---

## 62. Canonical Routing Direction

Phase 2 should move toward clear workspace-oriented routing.

Examples may include:

- Member workspace
- Connect BDP workspace
- Marketplace BDP workspace
- Venue workspace
- Enterprise BDP workspace
- Enterprise Client workspace
- Platform Operations workspace

Exact URLs are not defined by this Founder Decision.

---

# PART P — AUTHENTICATION BOUNDARY

## 63. Authentication and Role Are Separate

Authentication answers:

> Who is the User?

Role assignment answers:

> What may the User do, and where?

These concepts must not be conflated.

---

## 64. Authentication Provider

FD-035 does not itself mandate a particular authentication provider.

However, Phase 2 Technical Architecture should use one authoritative authentication system and avoid parallel user-auth systems unless a documented technical requirement exists.

The specific approval of Supabase Auth belongs in the Phase 2 Technical Architecture or ADR layer.

---

# PART Q — DATABASE AND TECHNICAL BOUNDARIES

## 65. No Single Overloaded Role Enum Requirement

Phase 2 must not force the full business model into one global role enum if doing so creates:

- Ambiguity
- Loss of scope
- Loss of history
- Multi-role conflicts
- Enterprise BDP/client collision
- BOG/RM/PRM ambiguity
- Legacy-role confusion

A scoped role-assignment architecture is required at the business level.

---

## 66. Exact Schema Is Technical Design

FD-035 does not define:

- Table names
- Column names
- Foreign keys
- Enum syntax
- RLS code
- API routes
- Generated types
- Supabase migration names

These must be designed after this business architecture is accepted.

---

## 67. Migration Must Preserve History

Legacy role migration must preserve:

- Original value
- Original assignment
- Original dates
- Original scope where known
- Mapped current concept
- Mapping method
- Mapping confidence
- Unresolved status
- Audit record

Do not rewrite historical records as if the current terminology always existed.

---

# PART R — AUDIT REQUIREMENTS

## 68. Role Audit Trail

The platform should preserve:

- Role requested
- Role approved
- Scope
- Approver
- Effective date
- Status change
- Suspension
- Reactivation
- Expiry
- Revocation
- Termination
- Workspace access changes
- Permission overrides
- Migration events
- Reason
- Actor
- Timestamp

---

## 69. Sensitive Action Audit

At minimum, the following should be auditable:

- Role grant
- Role removal
- Scope change
- Financial permission change
- KYC access
- Settlement approval
- Refund approval
- Compliance hold
- Reassignment
- Root administration
- Impersonation
- Manual override

---

# PART S — PHASE 2 IMPLEMENTATION REQUIREMENTS

## 70. Required Business Capabilities

Phase 2 must support:

- Permanent User identity
- Multiple role assignments
- Scoped assignments
- Multiple workspaces
- Workspace switching
- Role lifecycle
- Role-specific suspension
- Legacy mapping
- Enterprise BDP/client separation
- BOG/RM/PRM scoped appointments
- Venue Representative separation
- Platform Admin separation
- Audit
- Separation of duties

---

## 71. Required Technical Design Topics

The Phase 2 Technical Architecture must decide:

- Role-assignment schema
- Role taxonomy
- Scope model
- User-to-organisation model
- User-to-Circle model
- User-to-Venue model
- User-to-Enterprise-client model
- Governing Body appointment model
- RM/PRM assignment model
- RLS
- Workspace routing
- Authentication integration
- Step-up authentication
- Legacy migration
- Root-admin controls
- Session handling
- Audit implementation

---

# PART T — UNRESOLVED ITEMS

## 72. Matters Not Finalised by FD-035

FD-035 does not finalise:

- Exact database enum names
- Exact database tables
- Exact role-assignment schema
- Exact Supabase RLS
- Exact auth provider configuration
- Exact OTP policy
- Exact session duration
- Exact route URLs
- Exact workspace UI
- Exact admin impersonation procedure
- Exact emergency root-access process
- Exact employment classification
- Exact contractor classification
- Exact legal wording
- Exact role approval SLAs
- Exact organisation ownership model
- Exact technical migration scripts
- Exact backfill process

These remain Pending Technical, Security, Legal, Operational, or Product Design as appropriate.

---

# PART U — SUPERSESSION AND CLARIFICATION REGISTER

## 73. Clarified Positions

| Topic | Earlier Ambiguity | Current Approved Position |
|---|---|---|
| User role | User vs Member replacement unclear | User is permanent base identity |
| Multi-role | Unclear | Multiple roles allowed through scoped assignments |
| Global role enum | Existing implementation overloaded | Must not be sole business architecture |
| ZBP | Legacy enum | Inactive; do not auto-map to Connect BDP |
| CBDP | Legacy term | Map to Connect BDP where historically equivalent |
| MBDP | Legacy term | Map to Marketplace BDP where historically equivalent |
| BDM | Ambiguous | Case-by-case migration |
| Affiliate | Legacy/current enum ambiguity | Future-only and inactive |
| Franchisee | Role ambiguity | Commercial relationship/unit concept, not canonical permission role |
| Enterprise | BDP/client collision | Separate Enterprise BDP and Enterprise Client Representative |
| BOG | Global-role ambiguity | Scoped Circle appointment |
| RM | Role ambiguity | Scoped operational assignment |
| PRM | Role ambiguity | Scoped platform operational assignment |
| Venue Admin | Mixed internal/external meaning | Split Venue Representative from platform admin |
| Multi-role landing | Undefined | Workspace selector for multi-workspace users |
| Super Admin | Scope unclear | No ordinary business role required; restricted root capability may exist |

---

# PART V — FOUNDER APPROVAL SUMMARY

## 74. Approved Rules

| Area | Approved Rule |
|---|---|
| Base identity | User is permanent base identity |
| One account principle | One natural person ordinarily has one base account |
| Multi-role | Allowed |
| Role architecture | Scoped role assignments |
| User replacement | Membership/BDP roles do not replace User |
| Self-approval | Prohibited |
| Separation of duties | Required |
| Connect BDP + Member | Allowed with conflict controls |
| Marketplace BDP + related venue | Requires disclosure and controls |
| Enterprise BDP vs Client | Separate role concepts |
| BOG | Scoped Circle appointment |
| RM | Scoped operational assignment |
| PRM | Scoped platform assignment |
| Circle Finance Coordinator | Scoped Circle governance role |
| Venue-side admin | Venue Representative / Venue Manager |
| Platform-side venue admin | Internal Platform Admin permission |
| ZBP | Inactive; no automatic migration |
| CBDP | Legacy → Connect BDP where proven |
| MBDP | Legacy → Marketplace BDP where proven |
| BDM | Ambiguous; case-by-case |
| Affiliate | Future/inactive |
| Franchisee | Commercial relationship/unit concept, not RBAC role |
| Workspace model | Explicit workspace switcher for multi-role users |
| Single-workspace user | May redirect directly |
| Mega-dashboard | Not required for MVP |
| Role lifecycle | Pending, Active, Suspended, Expired, Revoked, Terminated |
| Suspension | Role-specific unless platform-wide risk |
| Permissions | Derived from role + scope + status |
| Root admin | Restricted emergency technical capability |
| Super Admin | Not required as ordinary Phase 2 business role |
| Legacy migration | Must preserve historical audit |
| Technical schema | Pending Technical Design |

---

## 75. Decision Statement

Every registered natural person on GCE shall have one permanent base User identity.

Business, commercial, governance, client, venue, and platform authorities shall be added through separate scoped role assignments rather than replacing the User identity.

A User may hold multiple approved roles simultaneously, subject to conflict-of-interest controls, self-approval restrictions, separation of duties, and scope limitations.

The current canonical business concepts include Circle Member, Connect BDP, Marketplace BDP, Enterprise BDP, Enterprise Client Representative, Venue Representative, Governing Body appointments, Relationship Manager, Platform Relationship Manager, Enterprise Platform Expert, Opportunity Desk, and approved platform administrative roles.

Legacy identifiers must not be blindly reused as current roles.

ZBP is inactive and must not automatically become Connect BDP.

CBDP and MBDP may be mapped to Connect BDP and Marketplace BDP only where historical equivalence is clear.

BDM remains ambiguous and requires case-by-case migration.

Affiliate remains future-only and inactive.

Franchisee is a commercial relationship or unit concept rather than a canonical RBAC role.

The legacy Enterprise concept must be separated into Enterprise BDP and Enterprise Client Representative.

Governing Body, RM, and PRM must be represented as scoped assignments rather than unrestricted global roles.

Users with multiple active workspaces shall use an explicit workspace selector for MVP.

A highly privileged root-administration capability may exist for emergency technical administration, but it is not an ordinary business role and must be tightly restricted and audited.

Historical role records must remain preserved and auditable.

Exact schemas, enums, APIs, RLS policies, route URLs, auth configuration, session rules, and migration scripts remain Technical Design matters.

This decision remains active until expressly amended or superseded by a later Founder Decision.

---

**End of FD-035**
