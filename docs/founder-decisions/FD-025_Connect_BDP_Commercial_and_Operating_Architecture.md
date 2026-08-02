# FD-025 — Connect BDP Commercial and Operating Architecture

**Decision ID:** FD-025
**Title:** Connect BDP Commercial and Operating Architecture
**Status:** Founder Approved
**Decision Type:** GCE Connect Commercial and Operating Constitution
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** GCE Connect Business Development Partners, Connect BDP Franchise Units, assigned territories, GCE Connect Circles, subscription revenue, commission, performance, expansion, reassignment, and related platform operations

---

## 1. Purpose

This Founder Decision defines the approved commercial and operating architecture for the:

> **GCE Connect Business Development Partner**

Short name:

> **Connect BDP**

It establishes:

- The official Connect BDP role
- The Connect BDP Franchise Unit
- Franchise activation fee
- Territory allocation
- City-tier allocation limits
- Circle-development capacity
- Circle-development targets
- Subscription-revenue commission
- Renewal commission
- Commission attribution
- Performance review
- Expansion rights
- Additional Franchise Units
- Suspension, termination, and reassignment
- Ownership and data boundaries
- Prohibited conduct
- Unresolved items that must not be invented

This Founder Decision must be read together with:

- FD-001 — Business Model
- FD-020 — Financial and Wallet Architecture
- FD-021 — Settlement Engine
- FD-022 — Membership Lifecycle
- FD-023 — RBAC and Permissions
- FD-024 — GCE Connect Circle Lifecycle

---

## 2. Official Role Name

The approved full role name is:

> **GCE Connect Business Development Partner**

The approved short name is:

> **Connect BDP**

Legacy terms such as `CBDP`, `BDM`, `ZBP`, `Franchisee`, or `BD Partner` must not be treated as current approved role names unless explicitly mapped.

Legacy filenames, routes, database values, or code references may remain temporarily for technical compatibility.

---

## 3. Commercial Status

A Connect BDP is:

> An independent GCE business partner authorised to operate an approved Connect BDP Franchise Unit within a platform-assigned territory.

A Connect BDP is not automatically:

- An employee of GCE
- An owner of GCE
- An owner of the assigned territory
- An owner of GCE Connect Circles
- An owner of GCE members
- An owner of GCE data
- An agent authorised to bind GCE legally
- A Marketplace BDP
- An Enterprise BDP
- A platform administrator

The exact legal relationship must be governed by the signed agreement and applicable law.

---

# PART A — CONNECT BDP FRANCHISE UNIT

## 4. Definition

A **Connect BDP Franchise Unit** is a platform-approved commercial and operational allocation through which a Connect BDP may develop, activate, support, and maintain up to five GCE Connect Circles within an assigned territory.

One Franchise Unit must have its own:

- Franchise Unit ID
- Assigned Connect BDP
- Assigned territory
- Activation date
- Fee status
- Circle allocation capacity
- Circle-development target
- Commission records
- Performance records
- Compliance records
- Status
- Audit history

---

## 5. Franchise Unit Independence

Each Franchise Unit is treated as a separate commercial and operational unit.

A second Franchise Unit must not be treated as an automatic extension of the first.

Each additional Franchise Unit requires:

- Separate platform approval
- Separate territory allocation
- Separate activation
- Separate franchise activation fee
- Separate five-Circle capacity
- Separate ten-month target period
- Separate performance review
- Separate commission attribution

---

## 6. Suggested Franchise Unit Statuses

A Connect BDP Franchise Unit may use statuses such as:

- Applied
- Pending Verification
- Approved
- Pending Fee
- Training
- Active
- Restricted
- Under Review
- Suspended
- Terminated
- Archived

The exact technical enum names remain Pending Technical Design.

---

# PART B — FRANCHISE ACTIVATION FEE

## 7. Approved Fee

The approved Connect BDP Franchise Activation Fee is:

> **₹50,000 per Franchise Unit**

The fee is:

- One-time
- Non-refundable after activation
- Payable separately for every Franchise Unit
- Not a security deposit
- Not a payment for ownership of territory
- Not a payment for ownership of Circles or members

---

## 8. Package Inclusions

The ₹50,000 Franchise Activation Fee includes:

- Business Partner certification
- Platform licence
- Connect BDP dashboard access
- Connect operations training
- Community-building training
- Business-development training
- Circle-formation tools
- Initial operational support
- Ongoing platform support according to GCE policy

It does not automatically include:

- Marketplace BDP rights
- Enterprise BDP rights
- Unlimited Circle rights
- Unlimited territory rights
- Permanent territory ownership
- Additional Franchise Units
- Guaranteed income
- Guaranteed member acquisition

---

## 9. Refund Principle

The Franchise Activation Fee is non-refundable after activation.

A refund may be considered only when:

- GCE rejects the application before training and activation begin; or
- GCE cannot provide the approved Franchise Unit for a platform-controlled reason.

No refund should normally apply after:

- Certification begins
- Training begins
- Dashboard access is granted
- Territory is allocated
- The Franchise Unit is activated
- The Connect BDP resigns
- The Connect BDP underperforms
- The Connect BDP is suspended or terminated after activation

The exact pre-activation administrative deduction remains subject to the signed agreement.

---

## 10. Deferred Finance

The active launch model under this Founder Decision is:

> **₹50,000 upfront per Franchise Unit**

A deferred-finance option is not activated by this Founder Decision.

Any future deferred package, commission-recovery arrangement, or financing premium requires:

- Separate Founder approval
- Separate commercial schedule
- Clear recovery rules
- Financial-ledger treatment
- Legal and accounting review

---

# PART C — TERRITORY AND CITY-TIER MODEL

## 11. Territory Principle

A territory is assigned by GCE.

A Connect BDP receives a conditional operating right, not permanent ownership.

The approved territory description is:

> **Performance-Protected Assigned Territory**

The territory remains protected while the Franchise Unit:

- Remains active
- Meets approved performance standards
- Remains compliant
- Maintains required Circle operations
- Follows GCE policies

GCE retains authority to restructure territory boundaries because of:

- Market demand
- City growth
- Performance
- Compliance
- Operational requirements
- Territory imbalance
- Platform strategy

---

## 12. Territory Allocation Is Not Guaranteed

City-tier limits represent maximum permitted Franchise Units.

They do not guarantee that GCE will appoint the maximum number.

GCE may appoint fewer Connect BDPs depending on:

- Local market demand
- Member pipeline
- Circle viability
- Existing occupancy
- Territory performance
- Compliance capacity
- Platform strategy

---

## 13. Tier 1 City Model

A Tier 1 city may have:

- Five platform-defined zones
- Up to two Connect BDP Franchise Units in each zone
- A maximum of ten active Connect BDP Franchise Units

Approved formula:

```text
5 Zones × 2 Connect BDP Franchise Units
= Maximum 10 Franchise Units
```

Where two Connect BDPs operate in one zone:

- The zone must be divided into separate operating clusters or clearly defined scopes
- The same unrestricted territory must not be assigned to both
- Boundaries may be defined through localities, wards, pin codes, business clusters, or platform maps
- Member and commission attribution must remain clear

---

## 14. Tier 2 City Model

A Tier 2 city may have:

- Five platform-defined zones
- Up to one Connect BDP Franchise Unit in each zone
- A maximum of five active Connect BDP Franchise Units

Approved formula:

```text
5 Zones × 1 Connect BDP Franchise Unit
= Maximum 5 Franchise Units
```

---

## 15. Tier 3 City Model

A Tier 3 city may have:

- Approximately five planning zones
- Two platform-defined operating territories
- One Connect BDP Franchise Unit in each operating territory
- A maximum of two active Connect BDP Franchise Units

The two operating territories may each cover approximately half of the city’s planning zones.

The final boundary must be defined through practical geographic references such as:

- Localities
- Wards
- Pin codes
- Business clusters
- Platform-approved maps

The phrase “2.5 zones” may be used only as a planning reference.

It must not create an undefined or overlapping operating boundary.

---

## 16. Approved City-Tier Table

| City Tier | Planning Structure | Connect BDP Allocation | Maximum Franchise Units |
|---|---|---:|---:|
| Tier 1 | Five zones, each divided into two operating clusters | Up to two per zone | 10 |
| Tier 2 | Five platform-defined zones | Up to one per zone | 5 |
| Tier 3 | Two operating territories covering approximately five planning zones | One per territory | 2 |

---

## 17. Cross-Vertical Territory Separation

Connect BDP territory rights apply only to GCE Connect.

They do not automatically grant:

- Marketplace BDP territory rights
- Enterprise BDP territory rights
- Venue onboarding authority
- Enterprise-client authority

Each vertical must maintain separate territory and role approval.

---

# PART D — CIRCLE CAPACITY AND TARGETS

## 18. Initial Circle Capacity

Each active Connect BDP Franchise Unit receives capacity to develop:

> **Up to five GCE Connect Circles**

This capacity does not mean automatic Circle activation.

Every Circle must separately follow FD-024.

---

## 19. Circle Development Target

The approved target for each Franchise Unit is:

> **Five platform-activated Circles within ten months**

The average target pace is:

> **Approximately one activated Circle every two months**

It must not be described as one Circle every month.

---

## 20. Recommended Milestone Reviews

The approved target may be reviewed through these cumulative milestones:

| Review Month | Cumulative Activated-Circle Target |
|---:|---:|
| Month 2 | 1 |
| Month 4 | 2 |
| Month 6 | 3 |
| Month 8 | 4 |
| Month 10 | 5 |

These are performance review milestones.

They do not automatically cause termination when missed.

---

## 21. What Counts as a Completed Circle

Only a platform-activated Circle counts toward the target.

A Circle does not count merely because it is:

- Draft
- In Formation
- Pending Activation
- Recorded as a prospect
- Planned informally

A Circle should count only when:

- Platform activation is complete
- At least 15 verified founding members are active
- Specialization seats are validated
- Mandatory readiness is complete
- No material compliance hold exists

The exact post-activation stability period remains Pending Founder Approval.

---

## 22. Circle Quality

The Connect BDP must not create weak or artificial Circles merely to meet numerical targets.

Performance must consider:

- Active-member count
- Member retention
- Membership renewals
- Attendance
- Circle governance
- Complaint levels
- Compliance
- Circle continuity
- Member satisfaction
- Circle Health Score when its formula is later approved

The exact performance formula remains unresolved.

---

# PART E — SUBSCRIPTION REVENUE AND COMMISSION

## 23. Approved Commission

The Connect BDP earns:

> **20% of eligible GCE Connect subscription revenue attributed to the relevant Connect BDP Franchise Unit**

This commission is a revenue share.

It is not guaranteed income.

---

## 24. Eligible Subscription Revenue

Commission is calculated only on subscription revenue that is:

- Successfully collected
- Linked to an eligible membership
- Activated
- Eligible for settlement
- Attributed to the relevant Franchise Unit
- Not under material dispute or hold

---

## 25. Exclusions from Commission Base

The following are excluded from eligible subscription revenue:

- GST
- Other statutory taxes
- Refunded amounts
- Reversed payments
- Chargebacks
- Failed payments
- Complimentary memberships
- Free trials
- Platform promotional credits
- Unauthorised collections
- Amounts not actually received
- Fraudulent transactions
- Suspended transactions
- Transactions not validly attributed

---

## 26. Commission Formula

```text
Eligible GCE Connect Subscription Revenue
× 20%
= Connect BDP Commission
```

---

## 27. Full-Capacity Revenue Illustration

For one full Circle:

```text
40 Members × ₹2,000 Monthly Subscription Equivalent
= ₹80,000 Monthly Subscription Revenue
```

For five full Circles:

```text
₹80,000 × 5 Circles
= ₹4,00,000 Monthly Subscription Revenue
```

Connect BDP commission:

```text
₹4,00,000 × 20%
= ₹80,000 Monthly Commission
```

This is an illustrative full-capacity example.

It is not guaranteed income.

Actual commission may vary because of:

- Member count
- Subscription plan
- Collection success
- Discounts
- Refunds
- Taxes
- Renewals
- Circle retention
- Compliance
- Attribution
- Settlement eligibility

---

## 28. Commission on Renewals

The Connect BDP continues earning the approved 20% commission on eligible subscription renewals when:

- The Franchise Unit remains active
- The Connect BDP remains responsible for the Circle
- Required operating and retention responsibilities continue
- The renewal is successfully collected and activated
- No material hold, refund, or chargeback exists

Renewal commission is intended to reward:

- Circle stability
- Member retention
- Member satisfaction
- Renewal support
- Governance support
- Continued engagement

---

## 29. Commission Attribution

Every commission record should be linked to:

- Member
- Membership
- Circle
- Franchise Unit
- Connect BDP
- Subscription period
- Payment
- Activation
- Settlement status
- Refund or reversal
- Commission amount

The approved attribution principle is:

> Revenue is attributed to the Franchise Unit responsible for the Circle on the date the subscription becomes eligible for commission.

Historical attribution must remain preserved after reassignment.

---

## 30. Commission Payout Cycle

Commission is:

- Calculated monthly
- Reconciled before payout
- Normally processed on the first day of the following month

Payout remains subject to:

- Membership activation
- Settlement eligibility
- Refunds
- Chargebacks
- Fraud review
- Compliance hold
- Attribution validation
- Financial reconciliation

The exact banking-day adjustment remains Pending Technical Design.

---

## 31. Commission Status

Commission may use statuses such as:

- Estimated
- Pending
- Earned
- Approved
- Payable
- Paid
- Held
- Reversed
- Clawed Back

Exact technical enum names remain Pending Technical Design.

---

## 32. Commission Restrictions

A Connect BDP must not:

- Approve personal commission
- Change the commission percentage
- Mark commission as earned
- Release personal payout
- Alter subscription records
- Alter settlement records
- Bypass reconciliation
- Move platform funds

---

# PART F — CONNECT BDP RESPONSIBILITIES

## 33. Core Responsibilities

The Connect BDP may be responsible for:

- Prospect identification
- Membership consultation
- Business verification support
- KYC coordination
- Category guidance
- Business Specialization guidance
- Business Tag guidance
- Seat-availability checks
- Founding-member recruitment
- Circle creation requests
- Activation preparation
- Circle growth
- Member retention
- Renewal support
- Governance guidance
- Meeting-quality oversight
- Complaint escalation
- Compliance support
- Performance reporting
- Coordination with GCE Platform roles

---

## 34. Circle Lifecycle Authority

The Connect BDP may:

- Initiate a Circle request
- Recruit founding members
- Support verification
- Prepare activation requirements
- Support governance readiness
- Support Circle growth

The Connect BDP may not independently:

- Activate a Circle
- Change the Circle lifecycle status without authority
- Suspend a Circle
- Merge a Circle
- Archive a Circle
- Delete Circle history

Final platform authority remains governed by FD-024 and FD-023.

---

# PART G — PROHIBITED ACTIVITIES

## 35. Prohibited Conduct

The Connect BDP must not:

- Collect money in an unauthorised personal account
- Promise guaranteed income
- Promise permanent territory ownership
- Claim ownership of a Circle
- Claim ownership of members
- Activate a Circle independently
- Bypass KYC
- Create fake members
- Create duplicate specialization seats
- Alter official subscription pricing
- Offer unauthorised discounts
- Approve personal commission
- Move platform money
- Change official taxonomy
- Misuse member data
- Sell or transfer the Franchise Unit privately
- Sub-license territory without approval
- Present themselves as a GCE employee
- Delete or manipulate Circle history
- Create fake payments
- Create fake referrals
- Create fake attendance
- Misrepresent GCE policy
- Use the GCE brand outside approved guidelines

---

# PART H — PERFORMANCE MANAGEMENT

## 36. Performance Review Inputs

The Connect BDP may be evaluated through:

- Activated Circles
- Active members
- Subscription collections
- Member retention
- Renewals
- Circle attendance
- Circle governance
- Complaint levels
- Compliance
- Member satisfaction
- Circle stability
- Circle Health Score when approved

The exact scoring formula remains unresolved.

---

## 37. Performance Underachievement

Missing two consecutive milestone review periods triggers:

> **Formal Performance Review**

It does not automatically trigger cancellation.

---

## 38. Corrective Process

The approved progressive process is:

1. Performance review
2. Written corrective plan
3. Sixty-day improvement period
4. Additional training or supervision
5. Temporary restriction on new Circle requests where required
6. Territory or Circle reassignment where necessary
7. Cancellation after continued failure

GCE may consider external conditions such as:

- Platform-verification delays
- Local market conditions
- Seasonal conditions
- Member KYC delays
- Category conflicts
- Operational disruptions

---

## 39. Restriction

During a restricted period, GCE may:

- Pause new Circle requests
- Pause additional territory allocation
- Increase reporting requirements
- Require additional training
- Assign platform supervision
- Reassign weak Circles where necessary
- Limit access according to RBAC

Existing members and Circles must remain protected.

---

## 40. Serious Misconduct

Immediate suspension or termination may apply for:

- Fraud
- Unauthorised money collection
- False KYC
- Fake members
- Commission manipulation
- Data theft
- Brand misuse
- Member harassment
- Serious conflict of interest
- Repeated compliance violations
- Criminal or regulatory risk
- Deliberate false reporting
- Platform-security abuse

A sixty-day improvement period is not required for serious misconduct.

---

# PART I — EXPANSION POLICY

## 41. Qualification for an Additional Franchise Unit

A Connect BDP may apply for an additional Franchise Unit after:

- Five Circles are platform activated
- Circle operations are stable
- Membership retention is satisfactory
- No serious compliance case exists
- Payments and reporting are current
- Governance support is satisfactory
- GCE confirms territory demand
- The Connect BDP demonstrates sufficient operating capacity

Approval is not automatic.

---

## 42. Five-Month Expansion Reservation

After qualification, GCE may reserve an additional Franchise Unit opportunity for up to:

> **Five months**

The reservation:

- Is conditional
- Does not transfer territory ownership
- Does not block GCE indefinitely
- Expires if the separate fee is not paid
- Expires if activation is not completed
- May be cancelled for compliance, performance, or business reasons

---

## 43. Separate Fee for Expansion

Every additional Franchise Unit requires:

> **A separate ₹50,000 Franchise Activation Fee**

The fee for the original Franchise Unit does not cover expansion.

---

## 44. Separate Expansion Target

Each additional Franchise Unit receives its own target:

> **Five additional platform-activated Circles within ten months of the additional Franchise Unit’s activation**

Targets must not be mixed across Franchise Units.

---

## 45. Maximum Franchise Units per Person

The approved standard limit is:

> **Maximum two active Connect BDP Franchise Units per individual or controlled business entity**

A higher number requires special platform approval based on:

- Proven performance
- Operating capacity
- Compliance
- Territory demand
- Governance quality
- Platform strategy

---

# PART J — OWNERSHIP AND DATA

## 46. No Ownership of Territory

The Connect BDP does not own the assigned territory.

The territory remains a GCE platform allocation.

---

## 47. No Ownership of Circles or Members

The Connect BDP does not own:

- GCE Connect Circles
- Circle Members
- Membership records
- Referral data
- Member contact data
- Platform leads
- GCE branding
- GCE intellectual property
- Platform financial records

---

## 48. Data Access

The Connect BDP may access only:

- Assigned Franchise Units
- Assigned territories
- Assigned Circles
- Assigned member operations
- Approved performance information
- Own commission information

Access must follow FD-023.

---

# PART K — EXIT, SUSPENSION, TERMINATION, AND REASSIGNMENT

## 49. Exit or Termination

When a Connect BDP exits or is terminated:

- All Circles remain with GCE
- Members remain with GCE
- Territory returns to GCE
- Circle operations should continue
- Member access should remain protected
- Historical attribution remains preserved
- Future operating authority ends on the effective date
- A replacement Connect BDP or platform manager may be assigned

---

## 50. Commission After Exit

After exit or termination:

- Earned and approved commission remains payable subject to valid deductions
- Pending commission remains subject to eligibility review
- Refunded or reversed transactions may reverse commission
- Fraudulent commission may be clawed back
- Future revenue follows the approved reassignment rule
- Historical earned commission must not be silently transferred

---

## 51. Reassignment Rule

Future subscription revenue is attributed to the newly responsible Franchise Unit from the approved reassignment date.

Historical attribution must remain preserved.

The exact treatment of subscriptions paid before reassignment but becoming eligible afterward remains Pending Founder Approval.

---

## 52. Franchise Fee After Exit

The Franchise Activation Fee is not refundable merely because the Connect BDP:

- Resigns
- Underperforms
- Is restricted
- Is suspended
- Is terminated after activation

---

# PART L — AUDIT AND CONTROL

## 53. Audit Requirements

Important Connect BDP actions must be auditable, including:

- Application
- Verification
- Approval
- Fee payment
- Training
- Franchise Unit activation
- Territory assignment
- Territory change
- Circle creation request
- Circle activation attribution
- Commission calculation
- Commission hold
- Commission payout
- Performance review
- Restriction
- Expansion approval
- Reassignment
- Suspension
- Termination

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

## 54. Financial Controls

The Connect BDP’s:

- Fee
- Subscription attribution
- Commission
- Refund adjustment
- Chargeback adjustment
- Payout
- Clawback

must remain linked to the approved financial ledgers under FD-020 and FD-021.

No manual financial movement is allowed without explicit permission and audit.

---

# PART M — PROHIBITED INTERPRETATIONS

## 55. Prohibited Interpretations

This Founder Decision must not be interpreted to mean:

- ₹50,000 purchases permanent territory
- ₹50,000 purchases ownership of Circles
- One fee activates unlimited Franchise Units
- One Franchise Unit may create unlimited Circles
- A Connect BDP is guaranteed ₹80,000 monthly income
- Five Circles in ten months means one Circle every month
- Tier maximums guarantee appointment
- Two BDPs in one Tier 1 zone may share an undefined territory
- A Connect BDP may activate a Circle independently
- A Connect BDP owns member data
- A Connect BDP may approve personal commission
- Missing two reviews causes automatic cancellation
- Expansion is automatic
- Renewal commission continues after responsibility ends
- The deferred package is active under this decision

---

# PART N — CANONICAL DOCUMENT IMPACT

## 56. Documents Affected

This Founder Decision should be reflected in:

- Business Model
- Stakeholders
- Revenue Model
- Connect BDP Architecture
- Business Rules
- Permissions and Roles
- Payments
- Analytics and Reports
- Role Taxonomy
- Commercial Constants
- Revenue Flow
- Circle Architecture
- Territory Architecture
- Notification Architecture
- Audit and Compliance Architecture
- Cursor business rules

Lower-level documents must not contradict this Founder Decision.

---

## 57. Related Founder Decisions

This Founder Decision operates together with:

- FD-001 — Business Model
- FD-020 — Financial and Wallet Architecture
- FD-021 — Settlement Engine
- FD-022 — Membership Lifecycle
- FD-023 — RBAC and Permissions
- FD-024 — GCE Connect Circle Lifecycle

Where FD-024 defines Circle ownership, activation, capacity, or lifecycle, FD-024 governs that Circle subject.

Where FD-023 defines permissions, FD-023 governs access.

---

# PART O — UNRESOLVED ITEMS

## 58. Items Not Finalised

The following remain unresolved:

- Exact post-activation stability period before a Circle fully counts for performance
- Exact Connect BDP performance score formula
- Exact retention threshold
- Exact attendance threshold
- Exact complaint threshold
- Exact Circle Health Score formula
- Exact banking-day payout adjustment
- Exact treatment of subscriptions spanning a reassignment date
- Exact pre-activation refund deduction
- Exact territory-boundary map standards
- Exact legal franchise terminology
- Exact tax treatment of the Franchise Activation Fee
- Exact GST and TDS treatment
- Exact database enums
- Exact API routes
- Exact RLS policies
- Exact dashboard workflow
- Any future deferred-finance package

Cursor and developers must not invent these rules.

---

## 59. Founder Approval Summary

| Decision | Approved Rule |
|---|---|
| Official role | GCE Connect Business Development Partner |
| Short name | Connect BDP |
| Commercial unit | Connect BDP Franchise Unit |
| Activation fee | ₹50,000 per Franchise Unit |
| Fee nature | One-time and non-refundable after activation |
| Deferred finance | Not active under FD-025 |
| Initial Circle capacity | Up to five Circles |
| Circle target | Five activated Circles in ten months |
| Target pace | Approximately one Circle every two months |
| Commission | 20% of eligible GCE Connect subscription revenue |
| Renewal commission | Continues while active and responsible |
| Payout cycle | Monthly, normally first day of following month |
| Tier 1 maximum | 10 Franchise Units |
| Tier 2 maximum | 5 Franchise Units |
| Tier 3 maximum | 2 Franchise Units |
| Additional unit | Separate approval and separate ₹50,000 fee |
| Expansion reservation | Up to five months |
| Standard person-level limit | Two active Franchise Units |
| Territory model | Performance-Protected Assigned Territory |
| Missed performance | Review and sixty-day corrective process |
| Serious misconduct | Immediate suspension or termination allowed |
| Circle ownership | Always remains with GCE |
| Member and data ownership | Always remains with GCE |
| ₹80,000 example | Illustrative, not guaranteed |

---

## 60. Decision Statement

GCE will operate the Connect BDP model through separately activated Connect BDP Franchise Units.

Each Franchise Unit requires a separate ₹50,000 activation fee, receives an assigned performance-protected territory, may develop up to five GCE Connect Circles, and has a target of five platform-activated Circles within ten months.

The Connect BDP earns 20% of eligible GCE Connect subscription revenue attributed to the Franchise Unit, including eligible renewals while the Franchise Unit remains active and responsible.

Territory, Circles, members, data, and platform assets remain owned and controlled by GCE.

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-025**
