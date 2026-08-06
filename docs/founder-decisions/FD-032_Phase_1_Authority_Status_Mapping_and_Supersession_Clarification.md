# FD-032 — Phase 1 Authority, Status Mapping, and Supersession Clarification

**Decision ID:** FD-032
**Title:** Phase 1 Authority, Status Mapping, and Supersession Clarification
**Status:** Founder Approved
**Decision Type:** Constitutional Clarification, Status Mapping, Narrow Supersession Register, and Phase 2 Readiness Control
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** All GCE Founder Decisions, canonical business documentation, Cursor rules, engineering documentation, technical architecture, database design, APIs, RBAC, Circle workflows, Connect BDP target logic, Governing Body roles, financial interpretation, legacy-role migration, and Phase 2 implementation planning

---

## 1. Purpose

This Founder Decision resolves the confirmed Phase 1 ambiguities identified through the repository-wide Founder Decision conflict and authority audit.

It does not redesign the GCE business model and does not replace earlier Founder Decisions in full.

It only:

- Confirms the authority hierarchy for approved GCE business rules
- Prohibits conflict resolution by assumption
- Establishes an official mapping between Circle lifecycle status and Circle constitutional status
- Defines when a Circle counts toward the Connect BDP activation target
- Clarifies which Founder Decision governs the current Governing Body structure, role names, and term
- Records already-effective narrow supersessions so earlier files are not misread
- Establishes canonical role terminology and migration principles
- Confirms which subjects require separate Founder Decisions
- Establishes Phase 2 implementation boundaries

This decision must be read together with FD-001 and FD-020 through FD-031.

---

# PART A — AUTHORITY AND INTERPRETATION

## 2. Founder Decisions as Highest Business Authority

Approved Founder Decision `.md` files are the highest approved source of truth for the GCE business model.

They govern:

- Business rules
- Commercial rights
- Pricing
- Commission
- Stakeholder entitlements
- Membership rules
- Circle rules
- Governance
- Role authority
- Revenue treatment
- Settlement principles
- Lead rights
- Vertical boundaries
- Founder-approved terminology

Canonical documentation, Cursor rules, engineering documents, database schemas, APIs, dashboards, and application code must implement these decisions and must not contradict them.

## 3. Authority Hierarchy

The approved hierarchy is:

1. A later Founder Decision that expressly supersedes an earlier rule
2. A Founder Decision that is more specific to the subject
3. FD-001 foundational business principles
4. Founder-approved canonical business documentation
5. Cursor business rules
6. Engineering documentation
7. Technical implementation
8. Historical drafts, infographics, notes, and legacy workflows

Where two Founder Decisions address different aspects of the same subject, both may remain valid through an approved mapping.

A later date alone does not automatically prove supersession.

## 4. Narrow Supersession Principle

Supersession must be explicit, narrow, subject-specific, and limited to the conflicting rule.

A later decision that supersedes one clause does not invalidate the full earlier Founder Decision.

All unaffected provisions remain active.

## 5. No Reconciliation by Assumption

No AI, developer, consultant, employee, BDP, Governing Body, or platform team may resolve an apparent conflict by:

- Selecting one rule silently
- Averaging values
- Inventing a hybrid rule
- Using historical memory
- Using an infographic as higher authority
- Treating an unresolved point as approved
- Allowing technical convenience to determine the business rule

If the conflict is not expressly resolved by an approved Founder Decision, the affected implementation must remain blocked or pending.

---

# PART B — CIRCLE STATUS MAPPING

## 6. Two Distinct but Linked Circle Status Families

FD-024 and FD-030 remain valid because they govern two related but different Circle status families.

### 6.1 Circle Lifecycle Status

FD-024 governs the Circle’s operating lifecycle.

Approved lifecycle states:

- Formation
- Active Growth
- Full Capacity

### 6.2 Circle Constitutional Status

FD-030 governs the Circle’s constitutional and membership-composition status.

Approved constitutional states:

- Formation Circle
- Provisionally Active Circle
- Fully Constituted Circle

The two status families must not be collapsed into one enum without preserving the approved mapping below.

## 7. Official Circle Status Mapping

| Approved and Paid Active Members | FD-024 Lifecycle Status | FD-030 Constitutional Status |
|---:|---|---|
| 0–14 | Formation | Formation Circle |
| 15–19 | Active Growth | Formation Circle |
| 20–39 | Active Growth | Provisionally Active Circle |
| 40 | Full Capacity | Fully Constituted Circle |

## 8. Interpretation of the Mapping

### 8.1 At 0–14 Members

The Circle remains:

- In lifecycle Formation
- Constitutionally a Formation Circle
- Not platform-activated for Connect BDP target credit
- Not eligible to be counted as an activated Circle

### 8.2 At 15–19 Members

The Circle becomes:

- Lifecycle Active Growth
- Constitutionally still a Formation Circle
- Eligible for formal platform activation, subject to all activation conditions
- Eligible to count toward the Connect BDP activation target after platform confirmation

This stage is not Fully Constituted and must not be described as such.

### 8.3 At 20–39 Members

The Circle remains:

- Lifecycle Active Growth
- Constitutionally Provisionally Active
- Activated
- Still growing toward full capacity

### 8.4 At 40 Members

The Circle becomes:

- Lifecycle Full Capacity
- Constitutionally Fully Constituted
- Subject to the hard maximum of 40 active physical members

## 9. Circle Activation Conditions

A Circle may count as formally activated at 15 approved and paid founding members only when:

- At least 15 members are approved
- At least 15 members are paid
- Required business verification is complete
- Seats are validly allocated
- Required onboarding is complete
- Platform activation is recorded
- No blocking compliance issue exists

Member count alone does not create platform activation.

## 10. Connect BDP Target Credit

A Circle counts toward the Connect BDP target of five activated Circles in ten months when:

- It has at least 15 approved and paid founding members
- All activation conditions in Section 9 are complete
- The platform formally grants activated status
- The activation is recorded in the audit trail

Reaching 20 members changes the Circle’s constitutional status to Provisionally Active but does not create a second target credit.

Reaching 40 members changes the Circle to Full Capacity and Fully Constituted but does not create an additional activation credit.

## 11. Technical Status Requirement

Phase 2 must preserve both status families.

Recommended technical structure:

- `circle_lifecycle_status`
- `circle_constitution_status`

The final technical names may differ, but the two concepts must remain separate and auditable.

The system must preserve:

- Member count
- Activation date
- Platform activation authority
- Lifecycle status
- Constitutional status
- Status-change history
- Rule version

---

# PART C — GOVERNING BODY CLARIFICATION

## 12. Governing Body Authority Split

### FD-024 governs:

- Overall Circle lifecycle
- Formation
- Activation
- Growth
- Capacity
- Lifecycle transitions
- Related operational milestones

### FD-030 governs:

- Current Governing Body structure
- Current Governing Body role names
- Internal Circle governance
- Governing Body powers
- Governing Body limitations
- Governing Body term
- Circle Finance Coordinator role
- Current Circle governance architecture

### FD-023 governs:

- Platform RBAC principles
- Permission boundaries
- Separation of duties
- No wallet control by Circle office-bearers
- No unrestricted platform authority

## 13. Current Governing Body Term

The current Governing Body term is:

> **Six months**

Any earlier one-year term reference in FD-024 is superseded only for the current Governing Body term.

Historical records created under earlier approved terminology remain valid and auditable.

## 14. Current Finance-Support Role

The current Circle finance-support role is:

> **Circle Finance Coordinator**

This role supersedes the use of **Treasurer** as the current Circle governance title.

The Circle Finance Coordinator:

- May support Circle-level finance coordination
- May view only approved Circle-level financial information
- Does not control platform wallets
- Does not approve settlement
- Does not release funds
- Does not alter revenue or commission records
- Does not receive platform-admin authority
- Remains subject to FD-023 RBAC restrictions

Earlier historical records using Treasurer remain historically valid but must be mapped to the current role during migration.

## 15. Governing Body Role Migration

Phase 2 must preserve:

- Historical role title
- Current role title
- Appointment date
- Term dates
- Role authority version
- Migration date
- Migration reason
- Audit history

No historical appointment record may be silently overwritten.

---

# PART D — ALREADY-EFFECTIVE SUPERSESSIONS

## 16. Connect BDP Deferred Finance

FD-029 expressly supersedes only the FD-025 position that deferred Connect BDP finance was inactive.

Current approved financed structure:

- Total package: ₹60,000
- Initial payment: ₹5,000
- Recoverable balance: ₹55,000
- Maximum recovery per eligible commission cycle: ₹5,000
- Recovery only from earned, approved, settlement-eligible commission

All other unaffected FD-025 provisions remain active.

## 17. Marketplace BDP Commercial Rules

FD-029 finalises the Marketplace BDP commercial rules that were unresolved under FD-028, including:

- Marketplace BDP commission: 10% of eligible Marketplace Event Revenue
- Venue Partner share: 80%
- GCE net share after Marketplace BDP entitlement: 10%
- Direct package: ₹50,000
- Financed package: ₹60,000
- Initial payment: ₹5,000
- Recoverable balance: ₹55,000
- Maximum recovery per eligible commission cycle: ₹5,000
- Maximum 20 active Venue Partners per unit

FD-029 does not by itself create a complete Marketplace BDP operating constitution.

## 18. Tag 4 Pricing

Earlier references to Tag 4 at +50% are obsolete.

Current approved Tag pricing:

- Tag 1: Included
- Tag 2: Included
- Tag 3: +25% of active base subscription
- Tag 4: +25% of active base subscription

## 19. ZBP and Marketplace Affiliate

### ZBP

ZBP is removed from the current model.

No new role, commission, settlement, territory, or entitlement may be inferred for ZBP.

### Marketplace Affiliate

Marketplace Affiliate is future-only and inactive.

No current Affiliate commission, attribution, settlement, wallet entitlement, dashboard, or payment rule may be activated without a later Founder Decision.

## 20. AI Lead Assist Legacy Paid Concepts

Earlier active concepts such as:

- ₹500 mandatory fee
- Pay-to-receive
- Escrow
- Forfeiture
- Voucher conversion
- Subscription credit
- Success fee
- Automatic Lead Assist commission

are not active under FD-031.

Core Lead Rights remain protected.

Exact paid-service prices and commission rules remain unresolved.

---

# PART E — ROLE TERMINOLOGY AND MIGRATION

## 21. Canonical Current Roles

| Canonical Role | Approved Short Form | Status |
|---|---|---|
| GCE Connect Business Development Partner | Connect BDP | Current |
| GCE Marketplace Business Development Partner | Marketplace BDP | Current |
| GCE Enterprise Business Development Partner | Enterprise BDP | Current |
| Enterprise Platform Expert | Enterprise Platform Expert | Current |
| GCE Lead Intelligence and Opportunity Desk | Opportunity Desk | Current |
| Governing Body | Governing Body | Current |
| Circle Finance Coordinator | Circle Finance Coordinator | Current |

## 22. Legacy, Inactive, and Ambiguous Terms

| Term | Classification | Approved Treatment |
|---|---|---|
| CBDP | Legacy | Map to Connect BDP where historically equivalent |
| MBDP | Legacy | Map to Marketplace BDP where historically equivalent |
| BDM | Ambiguous / Legacy | Do not auto-map without context |
| Franchisee | Context-dependent | Use only where approved Franchise Unit or legal context requires |
| ZBP | Inactive / Removed | No current entitlement |
| Affiliate | Future / Inactive | No current Marketplace entitlement |
| Treasurer | Legacy Circle role | Map to Circle Finance Coordinator for current governance |
| Board of Governance / Circle Board | Legacy or dual-use | Map carefully to current Governing Body terminology |
| Rainmaker / Pass Lead | Legacy Lead Assist terminology | No current standalone commercial entitlement |
| PRM / Relationship Manager | Current platform operations term where approved | Not an automatic commission stakeholder |

## 23. Migration Principle

Phase 2 must create a controlled migration map before changing technical identifiers.

Do not silently rename:

- Database enums
- Historical commission records
- Audit records
- Existing contracts
- Existing role assignments
- External references
- Legacy API payloads
- Existing dashboards
- Historical Circle appointments

New user-facing labels should use canonical names.

Technical migration must preserve historical meaning.

---

# PART F — SEPARATE FOUNDER DECISIONS REQUIRED

## 24. Marketplace BDP Operating Architecture

The approved Marketplace BDP commercial rules are not a complete operating constitution.

A separate Founder Decision shall be created for:

> **GCE Marketplace BDP Commercial and Operating Architecture**

It should cover only unresolved operating matters, including:

- Appointment eligibility
- Maximum units per person
- Territory or non-territory model
- City deployment rules
- Performance targets
- Additional-unit eligibility
- Venue attribution
- Venue reassignment
- Inactive Venue Partner treatment
- Suspension
- Termination
- Handover
- Exit
- Misconduct
- Data access after exit
- Relationship Manager continuity

It must defer approved commission and finance numbers to FD-029.

## 25. Corporate and Platform Constitution

A separate Founder Decision shall be created for:

> **Logixia and GCE Corporate Platform Constitution**

It should define, subject to legal review:

- Logixia Solutions Private Limited
- Growth Central Events as platform and master brand
- Legal owner/operator relationship
- Contracting entity
- Payment-receiving entity
- Intellectual-property ownership
- Brand hierarchy
- Data-controller/operator position
- BDP contractual relationship
- Venue Partner and Enterprise contracting position
- Future subsidiary and restructuring principles

No legal conclusion may be invented before that decision and appropriate legal review.

---

# PART G — PHASE 2 IMPLEMENTATION BOUNDARIES

## 26. Phase 2 Areas That May Proceed

Phase 2 may proceed using:

- Separate Circle lifecycle and constitutional status families
- Activation at 15 approved and paid founding members after platform confirmation
- Provisionally Active constitutional status at 20 members
- Fully Constituted status at 40 members
- Connect BDP target credit at formal 15-member activation
- Current Governing Body term of six months
- Circle Finance Coordinator as the current finance-support role
- FD-029 Connect finance rules
- FD-029 Marketplace commercial rules
- Current Tag pricing
- ZBP removed
- Marketplace Affiliate inactive
- FD-031 Lead Assist Core Rights
- Existing Founder-approved revenue, commission, wallet, and settlement rules

## 27. Phase 2 Areas That Remain Blocked or Constrained

Phase 2 must not finalise:

- Full Marketplace BDP operating module before its dedicated Founder Decision
- Logixia legal-entity hardcoding before the corporate/platform constitution and legal review
- Marketplace Affiliate
- Core Tier launch
- Lead Assist paid products
- Lead Assist commission
- Unapproved tax logic
- Unapproved GST/TDS treatment
- Unapproved legal agreements
- Unapproved privacy-retention rules
- Unapproved AI model-training rules
- Unapproved workshop commercial rules

Extensible placeholders may be designed, but they must remain inactive and clearly marked pending.

## 28. Living Documentation Correction

The stale statement in:

`docs/core/21_Payments.md`

that Connect BDP deferred finance is inactive must be corrected during FD-032 documentation synchronisation.

The correction must point to FD-029 as the governing authority.

This is a living-document correction and does not require another Founder Decision.

---

# PART H — TECHNICAL IMPLEMENTATION PRINCIPLES

## 29. Rule Versioning

Phase 2 must support:

- Business-rule version
- Effective date
- Source Founder Decision
- Superseded rule reference
- Current rule reference
- Transaction date
- Earning-event date
- Settlement-event date

## 30. No Automatic Retrospective Recalculation

A new approved rule does not automatically recalculate historical transactions or statuses unless a Founder Decision expressly requires retrospective application.

Historical records must remain under their applicable rule version.

## 31. No Silent Data Rewrite

The system must not silently overwrite:

- Historical role names
- Historical Circle status
- Historical appointment term
- Historical commission basis
- Historical finance treatment
- Historical attribution
- Historical settlement state

Migration must be explicit, versioned, and auditable.

---

# PART I — FORMAL SUPERSESSION AND MAPPING REGISTER

## 32. Register

| Topic | Earlier Position | Current Position | Scope |
|---|---|---|---|
| Circle status | FD-024 lifecycle states | Dual-axis mapping with FD-030 constitutional states | Status interpretation only |
| Circle activation | 15 founding members | Retained for lifecycle activation and BDP target credit | No supersession; clarified |
| Constitutional threshold | Not defined as separate axis in FD-024 | 20–39 Provisionally Active; 40 Fully Constituted | Constitutional status only |
| Governing Body term | One year in FD-024 | Six months under FD-030 | Current internal governance only |
| Circle finance role | Treasurer in FD-023/024 | Circle Finance Coordinator under FD-030 | Current governance title only |
| Connect finance | Inactive under FD-025 | Active under FD-029 | Financing restriction only |
| Marketplace BDP commercial rules | Unresolved in FD-028 | Finalised in FD-029 | Commission and finance only |
| Tag 4 | Earlier +50% | +25% | Tag 4 pricing only |
| ZBP | Earlier role references | Removed | Current model only |
| Marketplace Affiliate | Earlier active references | Future/inactive | Current commercial activation only |
| Lead Assist paid concepts | Earlier active fee concepts | Core rights protected; prices unresolved | Stage-1 and monetisation only |

All unaffected earlier provisions remain active.

---

# PART J — FOUNDER APPROVAL SUMMARY

## 33. Approved Decisions

| Area | Approved Rule |
|---|---|
| Business authority | Founder Decisions are highest business authority |
| Conflict handling | No reconciliation by assumption |
| Supersession | Narrow and explicit |
| Circle status architecture | Two linked status families |
| 0–14 members | Lifecycle Formation / Constitutional Formation |
| 15–19 members | Lifecycle Active Growth / Constitutional Formation |
| 20–39 members | Lifecycle Active Growth / Provisionally Active |
| 40 members | Lifecycle Full Capacity / Fully Constituted |
| Connect BDP target credit | At formal 15-member platform activation |
| Governing Body authority | FD-030 for current internal governance |
| Governing Body term | Six months |
| Current finance role | Circle Finance Coordinator |
| Connect BDP finance | FD-029 financed model active |
| Marketplace BDP commercial rules | FD-029 governs |
| Tag 4 | +25% |
| ZBP | Removed |
| Marketplace Affiliate | Future/inactive |
| Canonical roles | Connect BDP, Marketplace BDP, Enterprise BDP |
| Legacy terms | Migration mapping required |
| Marketplace BDP operating FD | Required separately |
| Corporate/platform constitution FD | Required separately |
| Phase 2 | May proceed only within approved boundaries |

## 34. Decision Statement

FD-032 establishes the authoritative mapping between FD-024 Circle lifecycle status and FD-030 Circle constitutional status.

A Circle may become platform-activated at 15 approved and paid founding members after all activation conditions are complete and the platform formally records activation.

That activation counts once toward the Connect BDP target.

At 20 members, the Circle becomes constitutionally Provisionally Active.

At 40 members, it becomes lifecycle Full Capacity and constitutionally Fully Constituted.

FD-030 governs the current Governing Body structure, six-month term, and Circle Finance Coordinator role.

FD-029 remains authoritative for Connect BDP financing and Marketplace BDP commercial rules.

Role terminology must be migrated carefully without silent historical rewriting.

Marketplace BDP operating architecture and the Logixia–GCE corporate/platform constitution require separate Founder Decisions.

All unresolved matters remain unresolved and must not be invented during Phase 2.

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-032**
