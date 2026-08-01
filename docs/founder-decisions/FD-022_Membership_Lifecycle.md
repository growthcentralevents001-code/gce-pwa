# FD-022 — Membership Lifecycle

**Decision ID:** FD-022
**Title:** Membership Lifecycle
**Status:** Founder Approved
**Decision Type:** Membership Constitution
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** GCE Connect membership and shared membership services

---

## 1. Purpose

This Founder Decision defines the approved lifecycle of a GCE membership.

It establishes:

- When a membership becomes active
- The difference between membership and a Circle seat
- Seat reservation
- Waitlist handling
- Renewal
- Grace period
- Upgrade and downgrade
- Transfer
- Freeze
- Suspension
- Termination
- Rejoining
- Membership identity
- Preservation of trust and performance history
- Unresolved items that must not be invented

This file defines business and architecture rules.

It does not define:

- Exact membership pricing
- Exact KYC document lists
- Database tables
- UI screens
- Payment-gateway integration
- Notification templates
- Legal or tax advice

Those subjects must be implemented later without contradicting this Founder Decision.

---

## 2. Core Membership Principle

The approved principle is:

> **A GCE Membership and a GCE Connect Circle Seat are separate business concepts.**

A membership belongs to the approved individual or account.

A Circle seat belongs to:

- A specific GCE Connect Circle
- A specific business specialization
- An approved member
- A defined seat status

A user may have an active membership without having an active Circle seat.

---

## 3. Membership Ownership

Membership belongs to the approved member account.

Membership does not belong to:

- A Connect BDP
- A Circle Board
- An RM
- A PRM
- A venue
- Any other member

A Connect BDP may support onboarding, verification, Circle allocation, and member success, but does not own the membership.

---

## 4. Membership Lifecycle States

A membership may pass through statuses such as:

1. Draft
2. Applied
3. Pending Payment
4. Pending Verification
5. Pending Approval
6. Active
7. Grace Period
8. Frozen
9. Restricted
10. Suspended
11. Expired
12. Terminated
13. Rejoining Review
14. Archived

The exact technical enum names may be refined later, but the business meaning must remain consistent.

---

## 5. Membership Application

A membership application may begin when a registered GCE user applies for an approved membership product.

The application should be capable of recording:

- Applicant identity
- Business identity
- Contact details
- Membership plan
- City or geography
- Business category
- Business specialization
- Relevant tags
- KYC status
- Payment status
- Terms acceptance
- Application status
- Approval history

The exact form fields are not finalised in this Founder Decision.

---

## 6. Membership Activation Conditions

A membership becomes active only after the applicable activation conditions are satisfied.

Approved activation conditions include:

- Successful payment
- Required KYC completion
- Business verification where applicable
- Category eligibility
- Acceptance of applicable terms and policies
- Platform approval where required

The exact activation sequence may vary by membership product, but the membership must not be treated as active before mandatory conditions are complete.

---

## 7. Payment Success but Activation Pending

If payment succeeds but membership activation remains incomplete:

- The payment must remain linked to the application
- Duplicate charging must be prevented
- The membership must not be activated twice
- The issue must enter a controlled pending state
- The applicant should receive an appropriate status
- Refund or manual resolution must follow an approved workflow
- All actions must remain auditable

The exact retry and resolution SLA are not finalised.

---

## 8. Membership and Circle Allocation

Membership activation and Circle allocation are separate actions.

After membership activation, the member may be:

- Allocated to a Circle
- Waiting for a suitable Circle
- Waiting for a specialization seat
- Placed on a waitlist
- Offered another Circle
- Offered a transfer option
- Pending city or category review

An active membership does not automatically guarantee immediate Circle placement.

---

## 9. Circle Seat Reservation

The approved Circle seat reservation period is:

> **7 days**

During the reservation period:

- The seat is temporarily protected
- Required payment or verification may be completed
- The member must satisfy applicable eligibility conditions
- The seat should not be allocated to another applicant unless the reservation expires or is cancelled

If the reservation expires without completion, the seat may be released according to the approved workflow.

---

## 10. Waitlist

The platform must support a waitlist where:

- The requested specialization seat is unavailable
- The requested Circle is full
- The desired geography has no suitable Circle
- Verification or transfer conditions are pending

A waitlisted member may be offered:

- The same specialization in another Circle
- Another suitable Circle
- A future seat opening
- A controlled category or specialization review

Waitlist order and priority rules are not finalised in this Founder Decision.

---

## 11. Membership Renewal

The platform should begin renewal communication before membership expiry.

The approved renewal-notification window begins:

> **30 days before expiry**

Renewal communication may include:

- Expiry date
- Renewal amount
- Applicable benefits
- Pending dues
- Seat-protection information
- Grace-period information
- Upgrade or downgrade options

The exact notification schedule may be refined later.

---

## 12. Grace Period

The approved membership grace period is:

> **30 days after expiry**

During the grace period:

- The membership is not fully active
- Some benefits may be restricted
- The Circle seat remains protected
- Renewal remains possible
- Access may be limited according to the approved permission model
- Referral, voting, event, or other benefits may be restricted where required

The exact benefit restrictions must be defined in the RBAC and product architecture.

---

## 13. Grace Period Expiry

If the member does not renew within the 30-day grace period:

- Membership may move to Expired status
- Circle seat protection may end
- The seat may be released
- Governance eligibility may end
- Member access may be reduced
- Rejoining may require a new eligibility review

Historical membership records must remain preserved.

---

## 14. Membership Upgrade

A member may upgrade to a higher approved membership plan.

The approved principle is:

> **Upgrade may be applied on a prorated basis.**

An upgrade may affect:

- Benefits
- Access
- Membership expiry
- Pricing
- Credits
- Circle or cross-city privileges

The exact proration formula is not finalised in this Founder Decision.

---

## 15. Membership Downgrade

A downgrade should normally become effective at the next renewal cycle.

The approved principle is:

> **Downgrade applies at renewal unless a separate approved exception exists.**

A downgrade must not silently remove already-paid benefits during the active paid period unless a policy violation or approved exception applies.

---

## 16. Membership Transfer

A member may request a controlled transfer involving:

- City
- Circle
- Business category
- Business specialization

Transfer is not automatic.

The platform must review:

- Eligibility
- Seat availability
- Category conflicts
- Specialization conflicts
- Current dues
- Governance responsibilities
- Existing Circle obligations
- Historical conduct

The original history must remain preserved.

---

## 17. City Transfer

A city transfer may require:

- New Circle search
- New seat validation
- Geography eligibility
- Connect BDP reassignment
- Member confirmation
- Release of the previous Circle seat
- Activation of the new Circle seat

The member’s general GCE membership may remain active while the Circle transfer is processed.

---

## 18. Category or Specialization Change

A member may request a category or specialization change.

The change must be controlled because it may affect:

- Seat exclusivity
- Referral conflicts
- Taxonomy integrity
- Member directory
- Tags
- Circle governance eligibility

The Platform Taxonomy function retains final authority over official taxonomy.

---

## 19. Membership Freeze

The approved membership freeze rule is:

> **A membership may be frozen for up to 90 days in one applicable membership cycle.**

A freeze may be considered for valid reasons such as:

- Medical circumstances
- Temporary relocation
- Business disruption
- Other approved reasons

During a freeze:

- Membership status becomes Frozen
- Applicable benefits may be restricted
- Circle participation may be paused
- Seat treatment must follow the approved product rules
- Expiry adjustment may apply if separately defined

The exact seat-protection and expiry-extension rules during freeze are not fully finalised.

---

## 20. Suspension

Membership suspension is a temporary restriction imposed because of a policy, conduct, compliance, payment, or risk issue.

Possible reasons include:

- Misconduct
- Fraud
- Serious complaint
- KYC failure
- Non-payment
- Governance breach
- Referral abuse
- Platform risk
- Investigation

Suspension must record:

- Reason
- Effective date
- Scope of restriction
- Review authority
- Review date
- Reinstatement conditions
- Audit history

Suspension is not the same as termination.

---

## 21. Termination

Membership termination ends the approved membership relationship.

Possible reasons may include:

- Serious fraud
- Repeated misconduct
- Material policy violation
- False business information
- Abuse of the platform
- Legal or compliance requirement
- Other Founder-approved grounds

Termination must not erase:

- Payment history
- Membership history
- Circle history
- Referral history
- Governance history
- Complaint history
- Audit records

---

## 22. Rejoining

A previously expired, suspended, or terminated member may request to rejoin.

Rejoining is conditional.

The platform may review:

- Previous membership history
- Reason for exit
- Disciplinary record
- Outstanding dues
- KYC
- Business eligibility
- Category eligibility
- Seat availability
- Current platform policy

Rejoining does not automatically restore the previous Circle seat.

---

## 23. Digital Membership Identity

Every active member should have a digital membership identity or card.

It may display:

- Member name
- Membership ID
- Membership plan
- Membership status
- Validity period
- Business details
- Circle allocation
- Verification badge
- QR or digital verification reference

Exact design and security details are not finalised here.

---

## 24. Trust and Performance History

The approved principle is:

> **Trust, participation, referral, and performance history should normally be preserved across renewal, transfer, freeze, or temporary inactivity.**

History must not be reset merely because:

- A member changes Circle
- A member changes city
- A membership renews
- A membership freezes
- A membership temporarily expires

However, active benefits and current-status calculations may still depend on the current membership state.

---

## 25. Seat Protection During Grace

During the approved 30-day grace period:

- The existing Circle seat remains protected
- The seat should not be permanently reassigned
- The member may have restricted participation
- Renewal should restore active membership subject to payment and compliance

After the grace period expires, seat protection may end.

---

## 26. Membership Dues

A membership may have statuses related to dues, including:

- Paid
- Payment Pending
- Overdue
- Grace
- Settled
- Refunded
- Reversed

Exact billing and accounting statuses belong in the Financial and Settlement Architecture.

---

## 27. Refund Principle

Membership refund eligibility depends on the approved refund policy.

This Founder Decision does not independently approve:

- Full refund period
- Partial refund formula
- Non-refundable components
- Administrative deductions
- Tax treatment

Cursor and developers must not invent a refund matrix.

---

## 28. Governance Eligibility

Membership status may affect eligibility to:

- Vote
- Hold Board office
- Propose governance action
- Participate in no-confidence voting
- Access governance records

A member in Grace, Frozen, Restricted, Suspended, Expired, or Terminated status may have reduced or no governance rights according to RBAC.

---

## 29. Membership Notifications

The platform should support notifications for:

- Application received
- Payment required
- Verification pending
- Membership activated
- Circle allocation
- Seat reserved
- Seat reservation expiring
- Waitlist update
- Renewal due
- Grace period started
- Grace period ending
- Freeze approved
- Suspension
- Reinstatement
- Expiry
- Termination
- Transfer status

Exact channels and timing belong in the Notification Architecture.

---

## 30. Membership Audit Trail

Important membership actions must be auditable.

Examples include:

- Application
- Payment
- Verification
- Approval
- Activation
- Plan change
- Seat reservation
- Circle allocation
- Transfer
- Freeze
- Renewal
- Grace
- Suspension
- Reinstatement
- Termination
- Rejoining

Audit records should capture:

- Actor
- Action
- Timestamp
- Previous state
- New state
- Reason
- Approval authority
- Related evidence

---

## 31. Role-Based Access

Membership access must follow the RBAC architecture.

Examples:

### Member

May view:

- Own membership status
- Own plan
- Own renewal date
- Own Circle allocation
- Own seat status
- Own payment history

### Connect BDP

May access only assigned membership operations, such as:

- Onboarding support
- Verification support
- Circle allocation support
- Renewal follow-up
- Member-success support

### Circle Governance

May access only governance-relevant membership information.

### RM or PRM

May access only information required for assigned operational duties.

### Platform Administration

May access membership functions according to explicit permissions.

---

## 32. Data Preservation

Membership data must remain preserved even when:

- Membership expires
- Member transfers
- Member freezes membership
- Member is suspended
- Member is terminated
- Circle is merged
- Circle is archived
- User account is closed, subject to applicable law

Retention and deletion must follow approved legal, privacy, and security policies.

---

## 33. Prohibited Interpretations

This Founder Decision must not be interpreted to mean:

- Membership automatically guarantees a Circle seat
- Payment alone always activates membership
- A Circle seat belongs permanently to a member
- Grace status equals fully active status
- Downgrade applies immediately in every case
- Transfer is automatic
- Freeze automatically extends expiry
- Rejoining restores the previous seat automatically
- Trust history should be deleted on expiry
- Cursor may invent refund rules
- Cursor may invent KYC requirements
- Cursor may invent waitlist priority

---

## 34. Canonical Document Impact

This Founder Decision should be reflected in:

- Business Model
- Membership Architecture
- Circle Architecture
- Role Taxonomy
- RBAC and Permissions
- Revenue Model
- Financial Architecture
- Settlement Engine
- Notification Architecture
- Dashboard Architecture
- Database Architecture
- API Architecture
- Audit and Compliance Architecture

Lower-level documents must reference this Founder Decision and must not contradict it.

---

## 35. Related Founder Decisions

This Founder Decision works together with:

- FD-001 — GCE Business Model
- FD-020 — Financial and Wallet Architecture
- FD-021 — Settlement Engine
- FD-023 — RBAC and Permissions
- FD-024 — GCE Connect Circle Lifecycle

Where FD-024 defines a specific Circle-seat rule, FD-024 governs the Circle subject.

---

## 36. Items Not Finalised

The following remain unresolved:

- Exact membership plan pricing
- Exact KYC document list
- Exact refund matrix
- Exact activation SLA
- Exact waitlist priority
- Exact freeze eligibility criteria
- Exact freeze seat-protection rule
- Exact freeze expiry-extension rule
- Exact transfer fee
- Exact category-change fee
- Exact upgrade proration formula
- Exact downgrade exceptions
- Exact grace-period benefit restrictions
- Exact rejoining fee
- Exact digital card design
- Exact notification schedule
- Exact database state machine

Cursor and developers must not invent these rules.

---

## 37. Founder Approval Summary

| Membership Principle | Status |
|---|---|
| Membership and Circle seat are separate | Founder Approved |
| Membership activation after payment, verification, eligibility, and terms | Founder Approved |
| Seat reservation period of 7 days | Founder Approved |
| Waitlist support | Founder Approved |
| Renewal communication begins 30 days before expiry | Founder Approved |
| Grace period of 30 days | Founder Approved |
| Seat protected during grace period | Founder Approved |
| Upgrade may be prorated | Founder Approved |
| Downgrade normally applies at renewal | Founder Approved |
| Controlled city transfer | Founder Approved |
| Controlled category or specialization transfer | Founder Approved |
| Freeze up to 90 days per applicable cycle | Founder Approved |
| Suspension and termination are separate | Founder Approved |
| Rejoining is conditional | Founder Approved |
| Digital membership identity | Founder Approved |
| Trust and performance history preserved | Founder Approved |
| Historical membership data preserved | Founder Approved |

---

## 38. Decision Statement

GCE will manage membership as a controlled lifecycle separate from Circle-seat allocation.

Membership status, Circle allocation, seat status, payments, verification, renewal, grace, freeze, transfer, suspension, termination, and rejoining must be tracked separately and audibly.

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-022**
