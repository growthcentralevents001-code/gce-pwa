# FD-037 — GCE Marketplace Transaction, Approval, and Unattributed Revenue Rules

**Decision ID:** FD-037  
**Title:** GCE Marketplace Transaction, Approval, and Unattributed Revenue Rules  
**Status:** Founder Approved  
**Decision Type:** Marketplace Transaction Classification, Offer/Event Approval, Venue Attribution, Unattributed Revenue, Redemption, Settlement Direction, Campaign Value, Moderation, Reassignment, and Cross-Vertical Commercial Boundary Constitution  
**Authority Level:** Founder Decision  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Vertical:** GCE Marketplace  
**Applies To:** Marketplace BDPs, Venue Partners, Marketplace Events, Marketplace Offer Events, Marketplace transactions, customer claims, bookings, redemptions, Marketplace Operations, Finance, Compliance, Support, Relationship Managers, Platform Admins, revenue attribution, settlement, and all Phase 2 implementation concerning GCE Marketplace

---

## 1. Purpose

This Founder Decision establishes the authoritative transaction, approval, attribution, and unattributed-revenue rules for GCE Marketplace.

It resolves the outstanding questions concerning:

- What constitutes a Marketplace Event, Offer Event, and other Marketplace transaction
- Who approves Marketplace Events and Offer Events
- Whether a Venue Partner may exist without an active Marketplace BDP attribution
- How revenue is treated when no valid Marketplace BDP attribution exists
- Whether the Marketplace BDP 10% share is automatically payable without attribution
- How the 80/10/10 model operates when attribution is valid
- How ticketing and offer-redemption flows differ
- What the ₹50,000 minimum campaign rule means
- Whether multiple revenue-share variants exist at launch
- How Venue Partner subtypes should be represented
- How payout timing should operate at launch
- How reassignment affects future commission
- How inactive venues are handled
- How Marketplace moderation and approval authority is structured
- How cross-vertical Marketplace/Enterprise activity avoids duplicate commission on the same revenue

This decision does not replace:

- FD-028 revenue-recognition principles
- FD-029 commission and entitlement rules
- FD-033 Marketplace BDP operating architecture
- FD-034 corporate/platform constitution

Instead, it clarifies and completes the Marketplace transaction and approval model.

This decision must be read together with:

- FD-001 — Business Model
- FD-020 — Financial and Wallet Architecture
- FD-021 — Settlement Engine
- FD-023 — RBAC and Permissions
- FD-028 — Revenue Recognition and Commercial Architecture
- FD-029 — Commission Engine and Stakeholder Entitlement Architecture
- FD-031 — GCE Connect AI Lead Assist Architecture
- FD-032 — Phase 1 Authority, Status Mapping, and Supersession Clarification
- FD-033 — GCE Marketplace BDP Commercial and Operating Architecture
- FD-034 — Logixia and GCE Corporate Platform Constitution
- FD-035 — GCE Identity, Role Assignment, and Workspace Architecture

---

# PART A — MARKETPLACE TRANSACTION FAMILIES

## 2. Marketplace Transaction Families

GCE Marketplace must distinguish between separate commercial transaction families rather than treating every Marketplace activity as one generic order.

The approved launch transaction families are:

1. Marketplace Event
2. Marketplace Offer Event
3. Marketplace Booking / Reservation, where applicable
4. Marketplace Redemption / Conversion record
5. Venue Partner payout / settlement record

Future Marketplace commerce categories may be added later but are not activated by FD-037.

---

## 3. Marketplace Event

A Marketplace Event is a ticketed or bookable event listed by an eligible Venue Partner under GCE Marketplace.

Examples may include:

- Workshops
- Networking events
- Dining experiences
- Entertainment events
- Hospitality events
- Experiences
- Venue-hosted sessions

Marketplace Event revenue must follow approved revenue-recognition and commission rules.

---

## 4. Marketplace Offer Event

A Marketplace Offer Event is a time-limited commercial campaign offered by an eligible Venue Partner to attract customers through GCE Marketplace.

It may include:

- Discounts
- Value-added packages
- Limited-time offers
- Promotional bundles
- Visit-and-purchase campaigns
- In-store redemption offers

Marketplace Offer Events are not automatically the same object as ticketed Marketplace Events.

They must have their own offer lifecycle and redemption state.

---

## 5. Marketplace Orders

The term **Marketplace Order** should not be used as an undefined umbrella for all Marketplace activities.

At launch:

- Ticketed event purchase = Event Booking / Event Transaction
- Offer claim = Offer Claim
- Offer use = Offer Redemption / Conversion
- Venue payout = Settlement / Payout
- Future product-commerce order = Future feature unless separately approved

This avoids mixing unlike commercial flows.

---

# PART B — VENUE PARTNER MODEL

## 6. One Venue Partner Role Family

Hotels, restaurants, studios, salons, jewellers, electronics businesses, gyms, travel agencies, coworking spaces, and other approved businesses should generally use one canonical Venue Partner business role family.

Differences should be expressed through attributes such as:

- Venue category
- Business category
- Facilities
- Offer capabilities
- Event capabilities
- Licences
- Service attributes
- Operating hours
- Settlement settings

Separate permission roles should not be created for every business type unless operationally necessary.

---

## 7. Venue Representative

Venue-side users operate through the Venue Representative / Venue Manager concept approved under FD-035.

They do not become Marketplace BDPs merely because they manage a Venue Partner account.

---

# PART C — MARKETPLACE BDP ATTRIBUTION

## 8. Valid Marketplace BDP Attribution

Marketplace BDP commission applies only where valid Venue Partner attribution exists under FD-033.

A valid attribution must preserve:

- Venue Partner
- Marketplace BDP
- Marketplace BDP Unit
- Attribution start date
- Attribution status
- Reassignment date where applicable
- Revenue event date
- Rule version
- Audit history

---

## 9. Venue Partner Without Valid Marketplace BDP Attribution

A Venue Partner may temporarily exist without a valid Marketplace BDP attribution where:

- GCE directly onboarded or migrated the venue
- Attribution is under dispute
- Marketplace BDP exited
- Marketplace BDP is suspended or terminated
- Venue was transferred
- Historical data lacks valid attribution
- Platform remediation is underway

This does not create an automatic Marketplace BDP entitlement.

---

# PART D — UNATTRIBUTED MARKETPLACE REVENUE

## 10. No Marketplace BDP Entitlement Without Attribution

Where there is no valid Marketplace BDP attribution at the relevant earning event:

> **No Marketplace BDP commission entitlement arises for that transaction.**

The amount must not be described as unpaid or temporarily owed Marketplace BDP commission.

---

## 11. GCE Retains the Unattributed Platform Share

Where the standard Marketplace economics would otherwise be:

- Venue Partner: 80%
- Marketplace BDP: 10%
- GCE: 10%

but no valid Marketplace BDP attribution exists, the approved unattributed treatment is:

- Venue Partner: 80%
- Marketplace BDP: 0%
- GCE: 20%

subject to:

- Valid transaction
- Revenue recognition
- Refund/reversal treatment
- Tax treatment
- Settlement eligibility

This rule applies only while no valid Marketplace BDP entitlement exists.

---

## 12. No Retroactive Marketplace BDP Commission by Default

A later Marketplace BDP assignment does not automatically create retroactive commission on historical unattributed Marketplace revenue.

Future eligible revenue may become attributable from the approved effective date.

Retroactive correction is allowed only where:

- The original attribution was a documented platform error; or
- An authorised dispute resolution establishes that valid attribution should have existed earlier.

Corrections must be auditable.

---

# PART E — STANDARD MARKETPLACE ECONOMICS

## 13. Standard Attributed Marketplace Split

For Eligible Marketplace Event Revenue with valid Marketplace BDP attribution:

| Stakeholder | Share |
|---|---:|
| Venue Partner | 80% |
| Marketplace BDP | 10% |
| GCE | 10% |

FD-037 does not alter the approved FD-029 basis.

---

## 14. No Category-Specific Share Variants at Launch

At launch, the standard 80/10/10 model should apply across approved Marketplace Event categories unless a later Founder Decision explicitly creates a different model.

Do not create hidden or category-specific share variants merely because a Venue Partner belongs to a different business type.

---

## 15. Commission Base

Marketplace BDP entitlement remains:

> **10% of Eligible Marketplace Event Revenue**

It is not automatically calculated on:

- Unpaid GMV
- Cancelled transaction value
- Refunded value
- Tax
- Security deposit
- Refundable amount
- Non-revenue offer claim
- Enterprise project value
- Connect revenue
- Lead Assist revenue

---

# PART F — EVENT AND OFFER APPROVAL AUTHORITY

## 16. Platform Marketplace Operations Has Final Approval Authority

Marketplace Events and Marketplace Offer Events require final approval by authorised GCE Marketplace Operations or an approved Platform workflow.

Approved principle:

> **Marketplace BDP recommends; Platform Marketplace Operations final-approves.**

---

## 17. Marketplace BDP Role in Approval

Marketplace BDP may:

- Assist Venue Partner
- Review completeness
- Recommend offer/event
- Verify commercial logic
- Check venue readiness
- Flag policy issues
- Suggest corrections
- Support launch readiness

Marketplace BDP may not:

- Final-approve their own related exception
- Override prohibited content
- Override compliance hold
- Override platform campaign rules
- Override settlement or refund rules

---

## 18. Venue Partner Role

Venue Partner may:

- Draft event
- Draft offer
- Propose pricing
- Propose customer limits
- Propose validity
- Upload creative and commercial details
- Request approval

Venue Partner may not publish a campaign requiring approval until the platform approves it.

---

# PART G — MARKETPLACE MODERATION

## 19. Moderation Principles

Marketplace Events and Offer Events should be reviewed for:

- Truthfulness
- Legal compliance
- Customer clarity
- Price transparency
- Availability
- Capacity
- Venue eligibility
- Misleading claims
- Prohibited products/services
- Fraud indicators
- Safety concerns
- Duplicate campaigns
- Terms consistency

---

## 20. Prohibited Approval Practices

No Marketplace actor may approve:

- Fake scarcity
- False discount
- Misleading savings claim
- Unavailable inventory
- Fraudulent venue
- Hidden mandatory charges
- Prohibited or unlawful activity
- Offer inconsistent with approved customer terms
- Campaign created merely to generate false GMV

---

# PART H — ₹50,000 MINIMUM CAMPAIGN RULE

## 21. Meaning of ₹50,000

The approved Marketplace Offer Event minimum:

> **₹50,000 minimum planned commercial value**

means the campaign should reasonably target at least ₹50,000 of expected gross customer purchase value or commercial sales opportunity over the approved campaign period.

It is not:

- A GCE platform fee
- A guaranteed sale amount
- A guaranteed GMV outcome
- A mandatory cash deposit
- A guaranteed Venue Partner revenue amount

---

## 22. Campaign Value Estimate

The Venue Partner should provide the planned commercial value based on reasonable inputs such as:

- Offer price
- Expected customer count
- Average expected purchase value
- Campaign capacity
- Campaign duration

Marketplace BDP may review the estimate.

Platform Marketplace Operations has final approval authority.

---

## 23. No Guarantee

GCE, Marketplace BDP, or Venue Partner must not represent the ₹50,000 value as guaranteed performance.

It is a campaign qualification and planning threshold.

---

# PART I — OFFER EVENT LIFECYCLE

## 24. Launch Offer Event Rules

Existing approved Marketplace Offer Event principles remain:

- Offer validity to customer: 72 hours after claim, where applicable
- Venue campaign duration: maximum 15 days
- Customer cap: maximum 100 customers
- Campaign may close earlier when capacity is reached
- Customer visit and outcome should be recorded
- Valid non-purchase reasons may prevent penalty
- Venue performance remains accountable

---

## 25. Offer Claim Is Not Revenue

An Offer Claim by itself does not create Marketplace revenue.

Revenue recognition requires the applicable approved conversion or payment event.

---

## 26. Offer Conversion

A Marketplace Offer Event conversion should preserve:

- Customer
- Offer
- Venue
- Claim time
- Validity window
- Visit
- Redemption or purchase confirmation
- Purchase outcome
- Valid non-purchase reason where applicable
- Venue confirmation
- Customer confirmation where required
- Rule version
- Audit

---

# PART J — QR AND REDEMPTION

## 27. Event QR at Launch

QR tickets should be used for ticketed Marketplace Event attendance and validation at launch.

The QR should support:

- Booking validation
- Event admission
- Duplicate-scan prevention
- Attendance record
- Venue verification

---

## 28. Offer Redemption at Launch

Marketplace Offer Events should use an offer redemption code, claim token, or equivalent redemption mechanism rather than requiring the same event-ticket QR flow.

The technical design may later use QR for offers, but the business model should distinguish:

- Event admission
- Offer redemption

---

## 29. Redemption Does Not Override Payment Rules

A redemption token does not itself prove:

- Revenue recognition
- Settlement eligibility
- Marketplace BDP commission
- Completed purchase

The applicable commercial evidence must still exist.

---

# PART K — SETTLEMENT DIRECTION

## 30. Platform-Initiated Venue Payouts

Marketplace Venue Partner payouts should be initiated by the platform after applicable post-event or post-transaction checks.

Venue Partners and Marketplace BDPs must not directly release settlement.

---

## 31. Launch Settlement Cadence

Approved launch direction:

> **Monthly Platform-initiated payout batch**

This provides:

- Controlled reconciliation
- Refund review
- Fraud review
- Commission calculation
- Finance supervision
- Pilot safety

---

## 32. Settlement Architecture Must Remain Configurable

The technical architecture must not hard-code monthly settlement as permanently universal.

Future approved settlement cycles may include:

- T+N
- Weekly
- Fortnightly
- Monthly
- Event-based
- Risk-based

Any future change must preserve rule version and audit history.

---

## 33. Settlement Eligibility

A Venue Partner payout becomes settlement-eligible only after applicable:

- Collection confirmation
- Event / transaction completion where required
- Refund window checks
- Fraud checks
- Commission calculation
- Hold release
- Reconciliation
- Finance approval
- Tax or withholding handling where applicable

Exact timing remains subject to Finance, Tax, and Technical Design.

---

# PART L — VENUE INACTIVITY

## 34. Venue Inactivity

Venue inactivity may result from:

- No Marketplace activity
- Seasonal closure
- Renovation
- Non-response
- Compliance issue
- Venue-requested pause
- Marketplace BDP exit
- Verification expiry
- Business closure

---

## 35. Temporary Inactivity Does Not Automatically End Attribution

Temporary inactivity does not automatically terminate Marketplace BDP attribution.

The platform should first determine whether the venue is:

- Temporarily inactive
- Under remediation
- Suspended
- Transferred
- Permanently terminated

---

## 36. Inactivity Review

At launch, exact automatic inactivity duration remains an operational configuration rather than a permanently fixed Founder threshold.

However, the platform must:

- Detect prolonged inactivity
- Notify relevant Marketplace BDP and Venue Partner
- Record inactivity reason
- Allow remediation
- Review capacity consumption
- Prevent permanently dead venues from occupying capacity indefinitely

Exact time thresholds remain Pending Operational Design.

---

# PART M — VENUE REASSIGNMENT

## 37. Reassignment Principle

Venue reassignment must follow FD-033 and preserve historical attribution.

A reassignment does not rewrite historical ownership.

---

## 38. Future Commission After Reassignment

After the effective reassignment date:

- Future eligible Marketplace BDP commission follows the new valid attribution
- Former Marketplace BDP does not automatically retain entitlement
- Already earned and approved commission remains subject to existing rules
- Refunds or reversals may affect historical entitlements under the rule applicable to the original transaction

---

## 39. Reassignment Cut-Off

The business cut-off is:

> **The platform-recorded effective attribution date**

Exact timestamp handling and transaction edge cases remain Technical Design.

---

# PART N — CROSS-VERTICAL MARKETPLACE / ENTERPRISE RULES

## 40. Cross-Vertical Use Is Allowed

An Enterprise project may use:

- Marketplace Venue Partners
- Marketplace inventory
- Marketplace-sourced relationships

where commercially appropriate.

However, the same commercial value must not automatically receive duplicate commissions merely because two GCE verticals are involved.

---

## 41. No Double Commission on the Same Rupee

Approved principle:

> **The same eligible revenue component must not be commissionable twice under two different vertical entitlement systems unless a Founder Decision expressly authorises it.**

---

## 42. Componentised Settlement

Where a project contains distinct commercial components, the system should separate them.

Example:

- Enterprise project-management/platform component
- Marketplace Venue Partner component
- Vendor component
- Other approved component

Each component should carry:

- Revenue type
- Vertical
- Beneficiary
- Commission rule
- Settlement rule
- Tax treatment placeholder
- Rule version

---

## 43. Marketplace Venue in Enterprise Project

Use of a Marketplace Venue Partner in an Enterprise project does not automatically mean the standard Marketplace 80/10/10 model applies to the entire Enterprise project.

Only the specifically approved Marketplace component, if any, should use Marketplace economics.

Enterprise economics remain governed by FD-026 and FD-029.

---

# PART O — REFUNDS, REVERSALS, AND CHARGEBACKS

## 44. Refund and Reversal Principle

Marketplace commission and settlement must not remain permanently payable on value that is validly refunded or reversed.

Exact refund policy remains subject to future Founder, Legal, Finance, and Tax approval.

---

## 45. Chargeback Treatment

Chargeback treatment remains Pending Finance, Legal, and Technical Design.

No stakeholder should receive irreversible settlement before applicable risk controls where chargeback exposure exists.

---

# PART P — PAYMENT GATEWAY AND MERCHANT-OF-RECORD BOUNDARY

## 46. Payment Gateway

FD-037 does not itself mandate a technical payment gateway.

The Phase 2 Technical Architecture may adopt Razorpay for India launch, subject to:

- Legal confirmation
- Tax confirmation
- Banking/provider approval
- Merchant structure
- Refund requirements

---

## 47. Merchant of Record

The exact merchant-of-record structure for Marketplace ticket transactions remains Pending Legal and Tax Review.

FD-034 remains authoritative that Logixia Solutions Private Limited is the intended legal company and ordinarily the platform contracting/payment entity, subject to professional validation.

Do not hard-code unsupported merchant-of-record assumptions.

---

# PART Q — MARKETPLACE BDP AUTHORITY BOUNDARY

## 48. Marketplace BDP Is Primary Relationship Manager

The validly onboarding Marketplace BDP remains the primary Relationship Manager for the Venue Partner under FD-033.

This does not grant:

- Settlement authority
- Refund authority
- Platform-final approval authority
- Tax authority
- Legal-signatory authority
- Commission override authority

---

## 49. Platform Marketplace Operations

Platform Marketplace Operations retains final control over:

- Campaign approval
- Policy enforcement
- Manual exception
- Venue hold
- Venue suspension
- Reassignment
- Moderation
- Escalation

subject to applicable Founder Decisions and RBAC.

---

# PART R — CUSTOMER PROTECTION

## 50. Customer Clarity

Marketplace listings must clearly communicate:

- Price
- Validity
- Capacity
- Eligibility
- Redemption method
- Venue
- Material exclusions
- Cancellation or refund terms where applicable
- Whether purchase occurs on-platform or at venue
- Any required verification

---

## 51. No Hidden Platform Dependency

A Venue Partner must not represent an off-platform discount as a GCE Marketplace Offer if the customer did not validly claim or book through the approved GCE flow where such claim is required.

---

# PART S — DATA AND AUDIT

## 52. Transaction Audit Trail

The platform should preserve:

- Venue Partner
- Marketplace BDP attribution
- Event / Offer
- Customer
- Booking or claim
- Payment
- Redemption
- Revenue event
- Refund
- Reversal
- Commission
- Settlement
- Reassignment
- Approval
- Moderator
- Rule version
- Actor
- Timestamp

---

## 53. No Silent Reclassification

The platform must not silently change:

- Event to Offer
- Offer to Event
- Attributed revenue to unattributed
- Unattributed revenue to attributed
- Marketplace revenue to Enterprise revenue
- Venue Partner
- Marketplace BDP
- Commission basis

All material changes require audit history.

---

# PART T — PHASE 2 IMPLEMENTATION REQUIREMENTS

## 54. Required Business Capabilities

Phase 2 must support:

- Marketplace Event object
- Marketplace Offer Event object
- Offer Claim
- Offer Redemption / Conversion
- Venue Partner
- Venue Representative
- Marketplace BDP attribution
- Unattributed venue state
- Campaign approval
- Moderation
- ₹50,000 campaign-value validation
- Event QR
- Offer redemption token
- Revenue classification
- 80/10/10 attributed split
- 80/0/20 unattributed split
- Settlement eligibility
- Monthly launch payout batch
- Reassignment effective date
- Cross-vertical componentisation
- Audit

---

## 55. Required State Separation

The technical design must keep distinct:

- Venue status
- Attribution status
- Event status
- Offer status
- Claim status
- Redemption status
- Payment status
- Revenue-recognition state
- Commission state
- Settlement state
- Refund state
- Reassignment state

These must not be collapsed into one generic Marketplace status.

---

## 56. Technical Design Topics

Phase 2 Technical Architecture must decide:

- Exact database schemas
- Exact Marketplace Event schema
- Exact Offer Event schema
- Claim/redemption model
- QR implementation
- Payment integration
- Settlement engine integration
- Attribution table
- Reassignment logic
- Cross-vertical component model
- RLS
- Admin approval queues
- Moderation tools
- Notifications
- Reconciliation
- Reporting

---

# PART U — UNRESOLVED ITEMS

## 57. Matters Not Finalised by FD-037

FD-037 does not finalise:

- Exact GST rate
- Exact TDS treatment
- Exact merchant-of-record structure
- Exact refund policy
- Exact chargeback policy
- Exact payment provider contract
- Exact payout provider
- Exact T+N timing for future cycles
- Exact inactivity time threshold
- Exact offer moderation checklist wording
- Exact event cancellation cutoff
- Exact event waitlist rules
- Exact customer refund timelines
- Exact data-retention period
- Exact fraud thresholds
- Exact database tables
- Exact APIs
- Exact RLS
- Exact QR/token implementation
- Exact notification rules
- Exact cross-vertical tax treatment

These remain Pending Founder, Legal, Tax, Finance, Privacy, Operations, Product, or Technical Design as applicable.

---

# PART V — CLARIFICATION REGISTER

## 58. Clarified Positions

| Topic | Earlier Ambiguity | Current Approved Position |
|---|---|---|
| Venue Partner types | Multiple roles possible | One Venue Partner family + attributes |
| Marketplace Event vs Offer | Mixed terminology | Separate transaction families |
| Marketplace Order | Undefined umbrella | Do not use as generic launch object |
| MBDP-less venue | Commission treatment unclear | Venue 80%, GCE 20%, MBDP 0% |
| Retroactive MBDP commission | Unclear | Not automatic |
| Offer/Event approval | Multiple actors | MBDP recommends; Platform final-approves |
| Revenue share variants | Possible category variants | No category-specific variants at launch |
| ₹50k campaign rule | Meaning unclear | Minimum planned commercial value |
| QR | Offer/event scope unclear | Event QR at launch; offer token/redemption flow |
| Settlement cycle | Undefined | Monthly platform-initiated launch batch |
| Inactivity | Undefined | Review/remediation required; exact threshold operational |
| Reassignment cut-off | Undefined | Platform-recorded effective attribution date |
| Cross-vertical money | Duplicate risk | No double commission on same rupee |
| Enterprise + Marketplace | Entire project split unclear | Componentised settlement |
| Merchant of record | Unclear | Pending Legal/Tax; do not hard-code |

---

# PART W — FOUNDER APPROVAL SUMMARY

## 59. Approved Rules

| Area | Approved Rule |
|---|---|
| Marketplace Event | Separate launch transaction family |
| Marketplace Offer Event | Separate launch transaction family |
| Marketplace Order | Not generic umbrella for all launch activity |
| Venue Partner role | One role family + category attributes |
| Marketplace BDP attribution | Required for BDP commission |
| No valid MBDP attribution | No MBDP entitlement |
| Unattributed split | Venue 80% / GCE 20% / MBDP 0% |
| Retroactive MBDP commission | Not automatic |
| Attributed split | Venue 80% / MBDP 10% / GCE 10% |
| Category-specific split variants | Not active at launch |
| Offer/event approval | MBDP recommends; Platform final-approves |
| ₹50,000 rule | Minimum planned commercial value |
| ₹50,000 | Not guaranteed revenue or fee |
| Offer claim | Not revenue by itself |
| Event validation | QR at launch |
| Offer redemption | Redemption token/code at launch |
| Venue payouts | Platform initiated |
| Launch payout cadence | Monthly batch |
| Future payout cadence | Configurable |
| Temporary venue inactivity | Does not automatically end attribution |
| Reassignment cut-off | Effective attribution date |
| Cross-vertical principle | No double commission on same rupee |
| Cross-vertical settlement | Componentised |
| Merchant of record | Pending Legal/Tax confirmation |
| Refund/chargeback detail | Pending appropriate review |
| Historical records | Must remain auditable |

---

## 60. Decision Statement

GCE Marketplace shall distinguish Marketplace Events, Marketplace Offer Events, Offer Claims, Offer Redemptions, and settlement records as separate commercial objects.

One canonical Venue Partner role family shall be used at launch, with business and venue differences represented through attributes rather than unnecessary permission-role proliferation.

Marketplace BDP commission exists only where valid Venue Partner attribution exists at the relevant earning event.

Where valid Marketplace BDP attribution exists, Eligible Marketplace Event Revenue follows the approved 80% Venue Partner / 10% Marketplace BDP / 10% GCE model.

Where no valid Marketplace BDP attribution exists, no Marketplace BDP entitlement arises and the approved unattributed model is 80% Venue Partner / 0% Marketplace BDP / 20% GCE.

Later attribution does not automatically create retroactive Marketplace BDP commission.

Marketplace BDPs may recommend Marketplace Events and Offer Events, but final campaign approval belongs to authorised GCE Marketplace Operations or an approved platform workflow.

At launch, category-specific revenue-share variants are not active unless separately approved.

The ₹50,000 minimum Marketplace Offer Event rule means minimum planned commercial value, not a platform fee and not guaranteed revenue.

Ticketed Marketplace Events should use QR-based admission at launch, while Marketplace Offer Events should use a distinct claim/redemption token or equivalent redemption flow.

Venue Partner payouts should be platform-initiated, with a monthly payout batch as the approved launch direction. Technical architecture must remain capable of supporting future approved settlement cycles.

Temporary venue inactivity does not automatically end Marketplace BDP attribution, but prolonged inactivity must be reviewed and must not permanently consume unit capacity without reason.

Venue reassignment takes effect from the platform-recorded attribution effective date. Future commission follows valid future attribution; already earned historical entitlement remains subject to the applicable transaction rule.

Where Marketplace and Enterprise interact, the same revenue component must not receive duplicate commission under two vertical systems unless expressly approved. Cross-vertical projects should use componentised revenue and settlement.

Exact GST, TDS, merchant-of-record, refund, chargeback, payout-provider, fraud, retention, and technical implementation details remain pending the appropriate professional or technical authority.

This decision remains active until expressly amended or superseded by a later Founder Decision.

---

**End of FD-037**
