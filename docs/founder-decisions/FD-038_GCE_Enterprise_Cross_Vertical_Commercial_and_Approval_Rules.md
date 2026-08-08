# FD-038 — GCE Enterprise Cross-Vertical Commercial and Approval Rules

**Decision ID:** FD-038  
**Title:** GCE Enterprise Cross-Vertical Commercial and Approval Rules  
**Status:** Founder Approved  
**Decision Type:** Enterprise Client Architecture, Quotation Authority, Vendor Model, Cross-Vertical Commercial Allocation, Approval Thresholds, Componentised Settlement, and No-Double-Commission Constitution  
**Authority Level:** Founder Decision  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Vertical:** GCE Enterprise  
**Applies To:** Enterprise BDPs, Enterprise Clients, Enterprise Client Representatives, Enterprise Platform Experts, Marketplace Venue Partners used in Enterprise projects, approved vendors, Marketplace BDPs, Finance, Legal, Compliance, Platform Operations, quotations, project approvals, milestones, commercial allocation, settlement, and all Phase 2 implementation concerning GCE Enterprise cross-vertical activity

---

## 1. Purpose

This Founder Decision establishes the authoritative cross-vertical commercial and approval architecture for GCE Enterprise.

It resolves the outstanding questions concerning:

- How Enterprise Clients are represented
- How Enterprise BDP and Enterprise Client identities remain separate
- Whether Enterprise vendors require platform logins at launch
- Who prepares, reviews, approves, and issues quotations
- How finance approval operates for higher-value quotations
- Whether Enterprise projects may use Marketplace Venue Partners
- How Marketplace and Enterprise economics interact
- How the platform prevents duplicate commission on the same revenue
- How project components are separated for revenue, commission, settlement, and audit
- How Enterprise milestones are structured
- How Enterprise BDP attribution and entitlement remain client-based
- Whether Enterprise BDP receives territorial exclusivity
- How cross-vertical sourcing should be handled
- How physical execution versus platform coordination is recorded

This decision supplements, but does not replace:

- FD-026 — GCE Enterprise Business and Operating Architecture
- FD-028 — Revenue Recognition and Commercial Architecture
- FD-029 — Commission Engine and Stakeholder Entitlement Architecture
- FD-034 — Logixia and GCE Corporate Platform Constitution
- FD-037 — Marketplace Transaction, Approval, and Unattributed Revenue Rules

This decision must be read together with:

- FD-001 — Business Model
- FD-020 — Financial and Wallet Architecture
- FD-021 — Settlement Engine
- FD-023 — RBAC and Permissions
- FD-026 — GCE Enterprise Business and Operating Architecture
- FD-028 — Revenue Recognition and Commercial Architecture
- FD-029 — Commission Engine and Stakeholder Entitlement Architecture
- FD-031 — GCE Connect AI Lead Assist Architecture
- FD-033 — GCE Marketplace BDP Commercial and Operating Architecture
- FD-034 — Logixia and GCE Corporate Platform Constitution
- FD-035 — GCE Identity, Role Assignment, and Workspace Architecture
- FD-037 — GCE Marketplace Transaction, Approval, and Unattributed Revenue Rules

---

# PART A — ENTERPRISE CLIENT ARCHITECTURE

## 2. Enterprise Client Is an Organisation

An Enterprise Client should be represented as an organisation-level business entity rather than as a single overloaded user role.

Examples may include:

- Corporate company
- Institution
- Association
- Government or quasi-government organisation where legally permitted
- Educational institution
- Large business group
- Event buyer
- Institutional customer

---

## 3. Enterprise Client Representative

A natural person acting for the Enterprise Client shall be represented as:

> **Enterprise Client Representative**

This role is distinct from Enterprise BDP.

The representative may be authorised to:

- Submit requirements
- Review proposals
- Communicate with GCE
- Approve quotations within client authority
- Confirm milestones
- Accept deliverables
- Raise disputes
- View project records

The representative does not automatically receive Enterprise BDP commission.

---

## 4. Enterprise BDP and Enterprise Client Must Remain Separate

The same technical role or enum must not be used to represent both:

- Enterprise BDP
- Enterprise Client Representative

A person may hold multiple approved roles under FD-035, but the commercial meaning and permissions must remain separate.

---

# PART B — ENTERPRISE BDP ATTRIBUTION

## 5. Client-Based Attribution Preserved

Enterprise BDP attribution remains client-based.

An Enterprise BDP does not receive permanent ownership of:

- City
- District
- State
- Territory
- Venue
- Vendor
- Industry

Client attribution must be recorded through approved platform rules.

---

## 6. No Territorial Exclusivity

Enterprise BDP does not receive automatic territorial exclusivity.

Multiple Enterprise BDPs may operate in the same city or geography, subject to:

- Client attribution
- Non-duplication
- Conflict management
- Platform approval

---

## 7. Valid Client Attribution

A valid Enterprise BDP attribution should preserve:

- Enterprise Client
- Enterprise BDP
- Attribution source
- Attribution start date
- Attribution status
- Attribution end date
- Relevant opportunity
- Relevant project
- Rule version
- Audit history

---

# PART C — ENTERPRISE BDP COMMERCIAL ENTITLEMENT

## 8. Existing Commission Rule Preserved

FD-038 does not alter the Enterprise BDP commission rule.

Enterprise BDP entitlement remains:

> **25% of eligible GCE platform commission**

It is not 25% of total project value.

---

## 9. No Automatic Entitlement Outside Eligible Platform Commission

Enterprise BDP does not automatically earn from:

- Venue Partner gross revenue
- Vendor gross revenue
- Tax
- Refundable amounts
- Security deposits
- Client advance not yet eligible
- Marketplace BDP commission
- Connect revenue
- Lead Assist revenue
- Any unapproved cross-vertical amount

---

# PART D — ENTERPRISE VENDOR MODEL

## 10. Vendors at Launch

For launch, Enterprise vendors should ordinarily be represented as:

> **Managed vendor records without mandatory vendor login**

This reduces launch complexity while preserving vendor governance.

---

## 11. Vendor Record Requirements

A vendor record should preserve:

- Vendor legal or business identity
- Category
- Contact
- Verification
- Banking details where required
- Tax information where required
- Capability
- Pricing
- Project assignments
- Compliance status
- Contract or engagement record
- Settlement history

---

## 12. Future Vendor Login

The architecture should allow future migration to authenticated Vendor workspaces without rewriting historical project records.

A future vendor login may support:

- Proposal submission
- Milestone updates
- Document upload
- Invoice upload
- Acceptance
- Settlement status
- Compliance

Vendor login is not mandatory for launch.

---

# PART E — ENTERPRISE REQUIREMENT AND OPPORTUNITY FLOW

## 13. Enterprise Requirement Intake

Enterprise requirement flow should preserve:

1. Client / representative
2. Requirement
3. Budget or commercial range
4. Timeline
5. Location
6. Project category
7. Sourcing source
8. Enterprise BDP attribution where applicable
9. Platform qualification
10. Expert assignment
11. Vendor / Venue sourcing
12. Proposal
13. Quotation
14. Client approval
15. Contract / work order
16. Milestones
17. Delivery
18. Acceptance
19. Settlement
20. Closure

---

## 14. Enterprise Platform Expert

The Enterprise Platform Expert may:

- Structure requirements
- Coordinate vendors
- Build commercial proposals
- Prepare quotation inputs
- Support procurement
- Support milestone design
- Support execution governance

The Enterprise Platform Expert does not automatically have unrestricted finance approval authority.

---

# PART F — QUOTATION AUTHORITY

## 15. Quotation Preparation

Enterprise quotations may be prepared by:

- Enterprise Platform Expert
- Authorised Enterprise Operations user
- Approved commercial team

with input from:

- Enterprise BDP
- Vendors
- Venue Partners
- Finance
- Legal where required

---

## 16. Quotation Issuance

A quotation becomes official only after approval through the authorised GCE workflow.

Enterprise BDP alone does not have unrestricted authority to issue binding quotations on behalf of Logixia Solutions Private Limited.

---

## 17. Standard Approval Model

Approved direction:

> **Enterprise Platform Expert prepares → authorised commercial/platform authority reviews → Finance co-sign where threshold is triggered → official quotation issued**

The exact technical approvers may vary by project risk and size.

---

# PART G — FINANCE CO-SIGN THRESHOLD

## 18. Launch Finance Co-Sign Threshold

For launch, quotations with total proposed project value above:

> **₹5,00,000**

should require Finance co-sign before final issue.

This is a Founder-approved launch control threshold.

---

## 19. Threshold Interpretation

The ₹5,00,000 threshold is:

- A quotation approval threshold
- Not a commission threshold
- Not a tax threshold
- Not a guaranteed project value
- Not a minimum Enterprise project requirement

---

## 20. Future Configurability

The architecture must support future thresholds by:

- Project value
- Risk level
- Client type
- Margin
- Payment terms
- Vendor exposure

Any change must be versioned and approved.

---

# PART H — ENTERPRISE MILESTONE STRUCTURE

## 21. Milestones Are Project-Specific

Enterprise projects may use milestone-based commercial structures.

Approved principle:

> **Milestones are project-specific and negotiated, not permanently fixed to one universal percentage structure.**

---

## 22. Common Milestone Types

Examples may include:

- Booking / kickoff advance
- Procurement advance
- Pre-event milestone
- Mid-project milestone
- Delivery milestone
- Acceptance milestone
- Final settlement

Exact percentages must be defined per approved quotation or contract.

---

## 23. No Universal Advance Percentage

FD-038 does not impose one mandatory:

- Advance %
- Mid-payment %
- Final-payment %

for all Enterprise projects.

The project record must preserve the approved milestone schedule.

---

# PART I — MARKETPLACE VENUES IN ENTERPRISE PROJECTS

## 24. Cross-Vertical Use Permitted

GCE Enterprise may use:

- Marketplace Venue Partners
- Marketplace-sourced venue inventory
- Marketplace relationships
- Marketplace-originated venue leads

where commercially appropriate.

---

## 25. Cross-Vertical Use Does Not Merge the Verticals

Using a Marketplace Venue Partner inside an Enterprise project does not convert the whole Enterprise project into a Marketplace transaction.

The platform must preserve:

- Enterprise project identity
- Marketplace venue component
- Revenue type
- Commission rule
- Settlement rule
- Attribution

---

# PART J — NO DOUBLE COMMISSION

## 26. No Double Commission on Same Revenue Component

Approved principle:

> **The same eligible revenue component must not generate duplicate BDP commission under both Enterprise and Marketplace merely because both verticals participated.**

This principle supplements FD-037.

---

## 27. Component-Level Entitlement

Commission must be determined at the level of the specific commercial component.

Example:

- Enterprise platform/service component → Enterprise rules
- Marketplace venue component → Marketplace rules only where explicitly applicable
- Vendor execution component → Vendor settlement rules
- Other approved service component → Applicable rule

---

## 28. No Duplicate BDP Entitlement

A single rupee of eligible revenue must not automatically generate:

- Enterprise BDP commission and Marketplace BDP commission
- Two Marketplace BDP commissions
- Multiple Enterprise BDP commissions

unless an express later Founder Decision creates such a split.

---

# PART K — COMPONENTISED COMMERCIAL MODEL

## 29. Componentised Enterprise Project

An Enterprise project may include multiple commercial components.

Each component should preserve:

- Component type
- Vertical
- Supplier / beneficiary
- Revenue amount
- Collected amount
- Eligible revenue
- Platform commission
- BDP entitlement
- Tax placeholder
- Settlement status
- Rule version

---

## 30. Example Component Structure

Example only:

**Enterprise Project**
- Enterprise platform-management component
- Venue component
- Catering component
- Production component
- Technology component
- Transport component

Each component may have a different:

- Vendor
- Venue
- Margin
- settlement rule
- tax treatment
- entitlement rule

The example does not prescribe actual rates.

---

# PART L — MARKETPLACE BDP ENTITLEMENT IN ENTERPRISE PROJECTS

## 31. Marketplace BDP Does Not Automatically Earn

A Marketplace BDP does not automatically earn 10% merely because:

- Its Venue Partner is used in an Enterprise project
- It originally onboarded the Venue Partner
- The project uses Marketplace data
- The venue originated in Marketplace

Marketplace BDP entitlement applies only where the transaction component is expressly treated as Eligible Marketplace Event Revenue under an approved rule.

---

## 32. Enterprise Venue Procurement

Where Enterprise procures a Venue Partner as a project vendor or project component rather than as a Marketplace Event transaction, the commercial treatment should follow the Enterprise project structure unless expressly classified otherwise.

---

# PART M — ENTERPRISE BDP ENTITLEMENT IN MARKETPLACE ACTIVITY

## 33. Enterprise BDP Does Not Automatically Earn on Marketplace Revenue

An Enterprise BDP does not automatically earn from:

- Marketplace Event revenue
- Marketplace Offer Event revenue
- Marketplace BDP commission
- Venue Partner payout

unless the relevant revenue is explicitly included in eligible GCE Enterprise platform commission.

---

# PART N — ENTERPRISE CLIENT COMMERCIAL APPROVAL

## 34. Client Approval

Enterprise commercial approval should be captured through an authorised Enterprise Client Representative.

Approved client actions may include:

- Accept quotation
- Approve milestone
- Approve change request
- Accept deliverable
- Raise dispute

The platform should record:

- Representative
- Authority
- Date
- Version
- Commercial value
- Terms
- Audit trail

---

## 35. Client Authority

GCE should rely on an authorised client representative.

Exact proof of authority may include:

- Corporate email
- Written authorisation
- Purchase order
- Work order
- Contract
- Board / internal approval
- Other legally acceptable evidence

Exact legal evidence remains subject to Legal Review.

---

# PART O — CHANGE ORDERS

## 36. Change Order Principle

Material changes to:

- Scope
- Price
- Vendor
- Venue
- Milestone
- Timeline
- Deliverable

should be recorded as an approved change order or equivalent versioned commercial amendment.

---

## 37. No Silent Commercial Change

The platform must not silently change:

- Project value
- Platform commission
- Enterprise BDP entitlement
- Vendor settlement
- Venue component
- Client obligation

without an auditable approved change.

---

# PART P — PROJECT EXECUTION ROLE

## 38. Platform Versus Physical Executor

FD-034 remains authoritative:

GCE Enterprise ordinarily acts as:

- Technology platform
- Commercial coordinator
- Procurement workflow
- Vendor matching layer
- Governance layer
- Milestone-control layer
- Settlement-coordination layer

It does not automatically become the physical executor.

---

## 39. Project Role Must Be Explicit

For each Enterprise project, the commercial/legal role of Logixia should be identifiable, such as:

- Platform intermediary
- Procurement coordinator
- Technology provider
- Commercial coordinator
- Managed-services provider
- Principal contractor
- Agent

Exact legal classification remains subject to contract and Legal Review.

---

# PART Q — APPROVAL MATRIX PRINCIPLES

## 40. Approval Must Be Risk-Based

Enterprise approval flows should consider:

- Project value
- Margin
- Payment terms
- Client risk
- Vendor risk
- Legal complexity
- Refund/cancellation exposure
- Delivery complexity

---

## 41. No Self-Approval

No person may solely approve:

- Their own commission
- Their own project exception
- Their own vendor-related conflict
- Their own financial adjustment

FD-035 separation-of-duties rules apply.

---

# PART R — PAYMENT AND COLLECTION

## 42. Client Collection

Enterprise client payments should be collected through the approved Logixia/GCE financial architecture, subject to:

- Legal
- Tax
- Banking
- Merchant structure
- Contract

---

## 43. Milestone Payment State

Each milestone should distinguish:

- Due
- Invoiced
- Partially paid
- Paid
- On hold
- Disputed
- Refunded / reversed where applicable
- Settlement eligible

---

# PART S — VENDOR AND VENUE SETTLEMENT

## 44. Settlement Only After Eligibility

Vendor and Venue Partner settlement should occur only after applicable:

- Collection
- Milestone completion
- Acceptance
- Reconciliation
- Hold release
- Tax/withholding treatment
- Finance approval

---

## 45. No Direct Release Authority for Enterprise BDP

Enterprise BDP may not:

- Release settlement
- Alter payout amount
- Change tax
- Change platform commission
- Change approved vendor entitlement

---

# PART T — ENTERPRISE DISPUTES

## 46. Dispute Categories

Enterprise disputes may include:

- Client scope dispute
- Vendor quality dispute
- Venue dispute
- Milestone dispute
- Payment dispute
- Attribution dispute
- Commission dispute
- Change-order dispute
- Acceptance dispute

---

## 47. Dispute Handling

Disputes should preserve:

- Parties
- Project
- Component
- Evidence
- Hold
- Response
- Decision
- Appeal where applicable
- Financial consequence
- Audit

AI may assist but final serious financial decisions require human authority.

---

# PART U — PERFORMANCE STANDARDS

## 48. No Fixed Universal Enterprise Sales Target

FD-038 does not introduce a universal monthly or quarterly sales target for Enterprise BDP.

Performance should be assessed using factors such as:

- Qualified client opportunities
- Conversion
- Client responsiveness
- Proposal quality
- Compliance
- Project support
- Revenue quality
- Dispute rate

---

## 49. No Guaranteed Enterprise BDP Income

Enterprise BDP earnings are not guaranteed.

Entitlement arises only from:

- Valid client attribution
- Eligible GCE platform commission
- Approved earning event
- No disqualifying reversal
- Settlement eligibility

---

# PART V — CROSS-VERTICAL OPPORTUNITY SOURCING

## 50. Opportunity Source Does Not Automatically Determine Commission

An Enterprise opportunity may originate from:

- Connect
- Marketplace
- Enterprise BDP
- Direct GCE marketing
- Organic client
- Lead Assist
- Platform relationship
- Venue Partner
- Member

Source alone does not automatically create commission.

Commission requires an approved entitlement rule.

---

## 51. Lead Assist Boundary

FD-031 remains authoritative.

Lead Assist sourcing does not automatically create:

- Enterprise BDP commission
- Marketplace BDP commission
- Lead success fee

unless approved under the applicable Founder Decision.

---

# PART W — AUDIT AND RULE VERSIONING

## 52. Enterprise Commercial Audit Trail

The platform should preserve:

- Enterprise Client
- Enterprise Client Representative
- Enterprise BDP attribution
- Requirement
- Opportunity
- Quote version
- Approvals
- Finance co-sign
- Vendors
- Venue Partner
- Components
- Milestones
- Collections
- Platform commission
- BDP entitlement
- Settlement
- Change orders
- Disputes
- Rule version
- Actor
- Timestamp

---

## 53. No Silent Historical Rewrite

Historical:

- Client attribution
- Quote
- Vendor selection
- Venue selection
- Milestone
- Commission
- Settlement

must remain auditable.

---

# PART X — PHASE 2 IMPLEMENTATION REQUIREMENTS

## 54. Required Business Capabilities

Phase 2 must support:

- Enterprise Client organisation
- Enterprise Client Representative
- Enterprise BDP attribution
- Enterprise Platform Expert
- Managed vendor record
- Requirement
- Opportunity
- Quote
- Quote approval
- Finance co-sign threshold
- Project
- Commercial components
- Milestones
- Change orders
- Vendor settlement
- Venue component settlement
- Commission
- Cross-vertical classification
- Disputes
- Audit

---

## 55. Required Technical Separation

The technical architecture must distinguish:

- Enterprise Client
- Enterprise Client Representative
- Enterprise BDP
- Vendor
- Venue Partner
- Project
- Project component
- Revenue
- Platform commission
- BDP entitlement
- Settlement

These must not be collapsed into a single generic Enterprise object.

---

## 56. Technical Design Topics

Phase 2 Technical Architecture must decide:

- Exact schemas
- Client organisation model
- Representative model
- Vendor model
- Project component model
- Quotation workflow
- Approval routing
- Finance threshold engine
- Milestone engine
- Settlement
- Cross-vertical classification
- RLS
- Audit
- Notifications
- Reporting

---

# PART Y — UNRESOLVED ITEMS

## 57. Matters Not Finalised by FD-038

FD-038 does not finalise:

- Exact vendor login release date
- Exact quotation template
- Exact finance approval roles
- Exact contract form
- Exact legal authority proof
- Exact milestone percentages
- Exact Enterprise refund policy
- Exact cancellation policy
- Exact vendor dispute SLA
- Exact payment gateway
- Exact merchant-of-record structure
- Exact GST/TDS
- Exact tax allocation across components
- Exact payout timing
- Exact data retention
- Exact RLS
- Exact schemas
- Exact APIs
- Exact notification rules
- Exact performance-score formula
- Exact minimum Enterprise project value
- Exact legal role of Logixia in every Enterprise project

These remain Pending Founder, Legal, Tax, Finance, Privacy, Operations, Product, or Technical Design as applicable.

---

# PART Z — CLARIFICATION REGISTER

## 58. Clarified Positions

| Topic | Earlier Ambiguity | Current Approved Position |
|---|---|---|
| Enterprise client identity | User vs role unclear | Organisation + Enterprise Client Representative |
| Enterprise BDP vs client | Could share legacy `enterprise` | Must remain separate |
| Vendor login | Undefined | Managed vendor record at launch |
| Vendor future login | Undefined | Architecture must allow later migration |
| Quote authority | Enterprise BDP-only unclear | Expert prepares; authorised workflow issues |
| Finance approval | Undefined | Finance co-sign above ₹5,00,000 launch threshold |
| Milestones | Fixed percentages unclear | Project-specific and negotiated |
| Enterprise territory | Undefined | No permanent territorial exclusivity |
| Marketplace venues | Cross-vertical ambiguity | May be used as project components |
| Double commission | Risk of duplication | Prohibited on same revenue component |
| Commercial accounting | Whole-project blending | Componentised |
| Marketplace BDP in Enterprise | Automatic 10% risk | No automatic entitlement |
| Enterprise BDP in Marketplace | Automatic entitlement risk | No automatic entitlement |
| Project executor | Ambiguous | Role explicit per project; GCE not always physical executor |
| Opportunity source | Could imply entitlement | Source does not automatically create commission |

---

# PART AA — FOUNDER APPROVAL SUMMARY

## 59. Approved Rules

| Area | Approved Rule |
|---|---|
| Enterprise Client | Organisation-level entity |
| Enterprise Client Representative | Separate natural-person role |
| Enterprise BDP vs Client | Separate |
| Enterprise BDP attribution | Client-based |
| Territory exclusivity | None automatically |
| Enterprise BDP entitlement | 25% of eligible GCE platform commission |
| Vendor login at launch | Not mandatory |
| Vendor model | Managed vendor records |
| Future vendor workspace | Architecture-ready |
| Quote preparation | Enterprise Platform Expert / authorised operations |
| Quote issuance | Authorised platform workflow |
| Finance co-sign | Required above ₹5,00,000 launch threshold |
| Milestone percentages | Project-specific |
| Marketplace venues in Enterprise | Allowed |
| Entire project becomes Marketplace | No |
| Double commission | Prohibited on same revenue component |
| Project accounting | Componentised |
| Marketplace BDP automatic Enterprise entitlement | No |
| Enterprise BDP automatic Marketplace entitlement | No |
| Change orders | Versioned and approved |
| GCE physical executor | Not automatic |
| Project legal role | Explicit per contract |
| Enterprise BDP settlement authority | None |
| Universal Enterprise sales target | None |
| Guaranteed income | None |
| Opportunity source | Does not itself create commission |
| Historical records | Must remain auditable |

---

## 60. Decision Statement

GCE Enterprise shall represent Enterprise Clients as organisation-level entities with authorised Enterprise Client Representatives.

Enterprise Client Representatives and Enterprise BDPs are separate role concepts and must not share one overloaded role identity.

Enterprise BDP attribution remains client-based and does not create permanent territory ownership.

Enterprise BDP entitlement remains 25% of eligible GCE platform commission and is not calculated on total project value.

Enterprise vendors may be managed as non-login vendor records at launch, while the architecture should permit future authenticated Vendor workspaces without rewriting historical project data.

Enterprise quotations should be prepared by Enterprise Platform Experts or authorised operations personnel and become official only through the approved platform workflow.

For launch, quotations above ₹5,00,000 total proposed project value require Finance co-sign before issue.

Enterprise project payment milestones are project-specific and negotiated. No universal advance/mid/final percentage structure is imposed by this Founder Decision.

GCE Enterprise may use Marketplace Venue Partners and Marketplace-sourced inventory. Such use does not convert the whole Enterprise project into a Marketplace transaction.

The same eligible revenue component must not receive duplicate Enterprise and Marketplace BDP commission unless expressly approved by a later Founder Decision.

Cross-vertical Enterprise projects shall use componentised commercial treatment so that revenue, platform commission, stakeholder entitlement, settlement, tax placeholders, and rule versions remain separately auditable.

Marketplace BDP does not automatically receive commission merely because an attributed Venue Partner participates in an Enterprise project.

Enterprise BDP does not automatically receive commission from ordinary Marketplace activity.

Project scope, quotation, milestones, vendors, venue components, commercial changes, and settlements must remain versioned and auditable.

GCE Enterprise is not automatically the physical executor. The legal and commercial role of Logixia Solutions Private Limited must be identified per project and contract.

Exact legal, tax, merchant-of-record, GST/TDS, refund, payout, retention, schema, RLS, API, and implementation details remain pending the appropriate professional or technical authority.

This decision remains active until expressly amended or superseded by a later Founder Decision.

---

**End of FD-038**
