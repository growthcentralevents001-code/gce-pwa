# FD-021 — Settlement Engine

**Decision ID:** FD-021
**Title:** Settlement Engine
**Status:** Founder Approved
**Decision Type:** Financial Operations Constitution
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** GCE Connect, GCE Marketplace, GCE Enterprise, shared payment and finance services

---

## 1. Purpose

This Founder Decision defines the approved settlement architecture for the Growth Central Events platform.

It establishes:

- When a transaction becomes eligible for settlement
- How settlement differs by transaction type
- How commissions are recognised and paid
- How refunds, cancellations, disputes, fraud reviews, and chargebacks affect settlement
- How enterprise milestone payments are handled
- How platform holds may be applied
- How settlement history must remain auditable
- Which matters remain unresolved and must not be invented

This file defines business and architecture rules.

It does not define:

- Payment-gateway code
- Bank API integration
- Database tables
- Exact tax treatment
- Exact settlement-day calculations
- Exact banking-holiday handling
- Legal or accounting advice

Those subjects must be implemented later without contradicting this Founder Decision.

---

## 2. Core Settlement Principle

The approved settlement principle is:

> **Money must not be released merely because payment was collected. Settlement becomes eligible only when the approved business condition for that transaction has been satisfied.**

Each transaction type must have its own:

- Settlement trigger
- Hold period
- Beneficiary
- Deductions
- Refund rule
- Dispute rule
- Commission rule
- Audit trail

One universal settlement rule must not be applied across all GCE verticals.

---

## 3. Relationship with Financial Architecture

This Founder Decision operates together with:

> `FD-020_Financial_and_Wallet_Architecture.md`

FD-020 defines the internal financial ledgers.

FD-021 defines when and how money may move from pending or escrow status into settlement, commission, refund, or platform-revenue status.

The approved conceptual flow is:

```text
Payment Collected
        ↓
Customer / Escrow Ledger
        ↓
Business Condition Verified
        ↓
Deductions Calculated
        ↓
Settlement Eligibility Confirmed
        ↓
Settlement Ledger
        ↓
Payout
```

Where a refund, dispute, chargeback, fraud review, or cancellation applies, the normal settlement flow may be paused, reversed, or redirected.

---

## 4. Settlement Entities

A settlement record should be able to identify:

- Transaction ID
- Vertical
- Product or service
- Payer
- Beneficiary
- Gross amount
- Platform revenue
- Commission
- Tax deductions
- Refund adjustments
- Recovery deductions
- Net payable amount
- Settlement trigger
- Eligibility date
- Hold period
- Settlement status
- Payout status
- Payout reference
- Dispute or chargeback status
- Audit history

The technical schema is not finalised in this Founder Decision.

---

## 5. Settlement Status Architecture

A settlement may pass through statuses such as:

- Not Applicable
- Pending Payment
- Payment Received
- In Escrow
- Awaiting Activation
- Awaiting Fulfilment
- Awaiting Event Completion
- Awaiting Milestone Approval
- Under Hold
- Under Review
- Eligible for Settlement
- Settlement Approved
- Settlement Processing
- Partially Settled
- Settled
- Refund Pending
- Refunded
- Reversed
- Disputed
- Chargeback
- Cancelled

The exact technical enum names may be refined later, but the business meaning must remain consistent.

---

# PART A — GCE CONNECT SETTLEMENT

## 6. Membership Payment Settlement

For an approved GCE Connect membership payment, settlement eligibility begins only after:

- Payment is successfully received
- Required KYC or business verification is complete
- Membership terms are accepted
- Membership activation is completed

The approved principle is:

> **Membership revenue is recognised after successful payment and membership activation.**

A payment that succeeds but remains unactivated must not be treated as fully completed membership revenue without an approved exception process.

---

## 7. Membership Payment Failure or Activation Failure

If payment is successful but membership activation fails or remains pending:

- The amount should remain in a controlled pending state
- The issue must be investigated
- Duplicate activation must be prevented
- The member must not be charged twice
- Refund or manual resolution must follow an approved workflow
- All changes must remain auditable

The exact SLA and automated retry process are not finalised.

---

## 8. GCE Connect Event Settlement

Where GCE Connect conducts a paid event, settlement eligibility should begin after:

- The event is completed
- Attendance or completion is confirmed
- Applicable cancellation and refund windows are closed
- No material fraud, dispute, or chargeback hold exists

The exact revenue split and beneficiary structure depend on the approved event model.

This Founder Decision does not create a universal event commission percentage.

---

## 9. Connect BDP Commission Settlement

Connect BDP commission should be:

- Calculated from eligible approved revenue
- Recorded in the Commission Ledger
- Subject to any approved recovery deduction
- Processed monthly
- Paid after the relevant earning condition is satisfied

The approved monthly payout timing is:

> **Commission payout is processed on the first day of the following month, subject to reconciliation, eligibility, holds, and approved recovery rules.**

If the first day is not operationally available because of banking or payment-processing constraints, the exact adjustment rule must be defined later.

---

## 10. Connect BDP Recovery Deduction

Where a Connect BDP uses an approved deferred finance arrangement:

- Earned commission may be retained toward the outstanding recovery amount
- Recovery must not exceed the approved monthly cap
- If earned commission is less than the recovery cap, only the available earned commission may be retained
- The unpaid difference carries forward
- No additional cash shortfall payment is automatically required unless separately approved
- The deduction must be visible and auditable

Exact package values belong in the Connect BDP commercial Founder Decision.

---

# PART B — GCE MARKETPLACE SETTLEMENT

## 11. Marketplace Event Settlement

For a GCE Marketplace event transaction, the approved principle is:

> **Venue settlement becomes eligible after successful event completion and the applicable post-event hold period.**

The approved standard hold period is:

> **48 hours after successful event completion**

During this period, the platform may review:

- Attendance
- Cancellation issues
- Customer complaints
- Refund requests
- Fraud indicators
- Payment failures
- Chargebacks
- Fulfilment concerns

If no material hold exists, settlement may proceed.

---

## 12. Marketplace Event Settlement Calculation

The settlement calculation may include:

```text
Gross Event Revenue
        ↓
Less Platform Commission
        ↓
Less Approved BDP Commission Allocation
        ↓
Less Taxes or Withholding
        ↓
Less Refunds / Chargebacks / Adjustments
        ↓
Net Venue Settlement
```

The exact commercial split must come from the approved Marketplace commercial rules.

This Founder Decision does not independently define every commission percentage.

---

## 13. Marketplace Offer Campaign Fees

Where a Venue Partner pays a campaign-listing or activation fee:

- Platform revenue becomes eligible after the campaign is successfully activated
- A failed or rejected campaign must follow the applicable refund or correction policy
- A campaign that is never activated must not automatically be treated as fully delivered
- The exact refundability rule depends on the approved campaign product

This rule applies to campaign fees, not necessarily to customer purchase transactions.

---

## 14. Marketplace Offer Transaction Settlement

Where customers pay through GCE for an offer:

Settlement eligibility should depend on the offer type.

### 14.1 Fixed-Price or Prepaid Offer

Settlement may become eligible after:

- Payment success
- Redemption or fulfilment confirmation
- Applicable complaint or dispute hold
- No unresolved chargeback

### 14.2 Variable-Price or Reserve Offer

Settlement may depend on:

- Reservation fee payment
- In-store or service fulfilment
- Final bill confirmation
- Offer adjustment
- Customer and venue confirmation where applicable
- Dispute review

The exact operational design must be defined in the Marketplace Offer Architecture.

---

## 15. Marketplace BDP Commission Settlement

Marketplace BDP commission should be:

- Calculated from eligible approved Marketplace revenue
- Attributed according to the approved venue relationship
- Recorded separately from Venue Partner settlement
- Subject to reassignment rules
- Paid after successful event or campaign eligibility
- Processed according to the approved commission cycle

Where the approved Marketplace BDP model uses monthly payout, the commission should be included in the monthly commission process.

---

## 16. Venue Relationship Reassignment

If a Venue Partner is reassigned from one Marketplace BDP to another:

- Transactions earned before the effective reassignment date remain attributed according to the prior approved relationship
- Future eligible revenue after the effective date follows the new approved relationship
- No retroactive reassignment should occur without a documented Founder-approved exception
- Historical attribution must remain preserved
- Commission already earned must not be silently transferred

The exact cut-off and pending-transaction treatment must be documented in the Marketplace BDP architecture.

---

# PART C — GCE ENTERPRISE SETTLEMENT

## 17. Enterprise Milestone Model

The approved enterprise settlement structure is milestone based.

The approved standard recommendation is:

```text
30% — Initial Payment
40% — Execution Milestone
30% — Completion Payment
```

This structure applies as the standard enterprise model unless a separately approved contract specifies another milestone arrangement.

---

## 18. Initial Enterprise Payment

The initial 30% payment becomes eligible according to approved contract conditions, which may include:

- Client acceptance
- Signed proposal or agreement
- Initial invoice
- Payment receipt
- Project activation

This payment supports project initiation and approved preparation costs.

---

## 19. Execution Milestone Payment

The 40% execution payment becomes eligible after the agreed execution milestone is completed and approved.

Possible evidence may include:

- Delivery progress
- Vendor confirmation
- Client milestone approval
- Completion of agreed project stage
- Approved change-order adjustments

Exact milestone evidence must be defined in the enterprise contract or workflow.

---

## 20. Completion Payment

The final 30% payment becomes eligible after:

- Project completion
- Final delivery
- Client approval or completion confirmation
- Resolution of approved adjustments
- Applicable final hold period

The exact completion-acceptance SLA remains unresolved.

---

## 21. Enterprise Vendor Settlement

Vendor settlement must be based on:

- Approved vendor engagement
- Contracted deliverables
- Milestone completion
- Evidence of fulfilment
- Enterprise client status where relevant
- Approved pass-through costs
- Deductions
- Disputes
- Tax requirements

Vendor settlement must not occur solely because the client paid GCE.

---

## 22. Enterprise BDP Commission

Enterprise BDP commission becomes eligible only when:

- The enterprise opportunity is validly attributed
- The relevant client payment is received
- The corresponding milestone or commercial condition is satisfied
- No material dispute or clawback condition exists

Exact commission percentages and attribution rules belong in the Enterprise BDP Founder Decision.

---

# PART D — CANCELLATIONS, REFUNDS, AND NO-SHOWS

## 23. Cancellation Principle

A cancelled transaction must follow the applicable cancellation policy.

Possible outcomes include:

- Full refund
- Partial refund
- Credit adjustment
- Wallet credit
- Non-refundable fee retention
- Settlement cancellation
- Commission reversal
- Charge deduction

The correct outcome depends on the product and approved policy.

---

## 24. Cancelled Events

For a cancelled event:

- Venue settlement must not proceed as if the event completed
- Customer refund obligations must be calculated
- Platform-retained amounts must follow approved policy
- Commission must be reversed or withheld where not earned
- Payment-gateway fees and tax treatment must be handled separately
- All adjustments must remain auditable

---

## 25. Customer No-Show

A customer no-show must follow the approved no-show policy for the relevant product.

A no-show does not automatically create the same result for every transaction.

Depending on the product:

- Deposit may be forfeited
- Refund may be denied
- Venue settlement may proceed
- Platform fee may be retained
- Trust or restriction rules may apply

Exact no-show rules belong in the relevant product policy.

---

## 26. Venue or Provider Failure

If the Venue Partner or service provider fails to fulfil:

- Customer refund should be prioritised according to policy
- Settlement should be held or reversed
- Commission should be held or reversed
- Complaint and compliance workflows should be triggered
- Performance impact may apply
- Fraud review may apply

---

# PART E — HOLDS, DISPUTES, AND CHARGEBACKS

## 27. Settlement Hold Authority

GCE may place a settlement on hold for a defined reason.

Approved hold reasons may include:

- Fraud suspicion
- Chargeback
- Customer complaint
- Venue complaint
- KYC failure
- Compliance investigation
- Duplicate payment
- Duplicate settlement risk
- Incomplete fulfilment
- Data mismatch
- Tax or invoice issue
- Court or regulatory requirement
- Material contractual dispute

A hold must not be arbitrary.

---

## 28. Hold Requirements

Every settlement hold should record:

- Hold reason
- Amount held
- Scope
- Effective date
- Authorised actor
- Supporting evidence
- Review date
- Resolution status
- Final outcome

---

## 29. Chargeback Freeze

When a chargeback is received:

- Related settlement may be frozen
- Related commission may be frozen
- Evidence must be preserved
- Merchant or partner response may be requested
- Final adjustment must follow the chargeback outcome
- Reversal or clawback entries must be created where necessary

The original transaction must remain in the audit trail.

---

## 30. Fraud Review

If fraud is suspected:

- Settlement may be paused
- Account access may be restricted
- Evidence must be reviewed
- Relevant compliance roles must be notified
- Financial movement must remain controlled
- Final action must be documented

Fraud rules and thresholds are not defined in this Founder Decision.

---

## 31. Dispute Resolution

A settlement-related dispute should follow an approved escalation process.

Possible stages include:

- Automated review
- Support review
- Finance review
- Compliance review
- PRM or authorised operational review
- Final platform decision
- External dispute or legal process where required

Exact SLAs and appeal rights are not finalised here.

---

# PART F — AUTOMATION AND CONTROL

## 32. Automated Settlement Engine

The Settlement Engine should automatically evaluate:

- Payment status
- Activation status
- Event completion
- Offer fulfilment
- Enterprise milestone
- Refund status
- Chargeback status
- Fraud hold
- Commission rule
- Recovery deduction
- Tax deduction
- Beneficiary eligibility
- Settlement hold period

Settlement should be automated where practical.

---

## 33. Idempotency

The platform must prevent:

- Duplicate settlement
- Duplicate commission payment
- Duplicate refund
- Duplicate recovery deduction
- Duplicate tax posting

Repeated processing of the same event must not create multiple financial outcomes.

---

## 34. Manual Override

Manual override should be rare.

Any override must require:

- Explicit permission
- Business reason
- Recorded evidence
- Audit log
- Previous state
- New state
- Approval authority
- Financial impact

High-value or high-risk overrides should use additional approval controls.

---

## 35. Settlement Reconciliation

Before final payout, the system should reconcile:

- Payment received
- Gateway status
- Internal ledger amount
- Refund adjustments
- Commission amount
- Recovery deduction
- Tax deduction
- Net payable amount
- Beneficiary identity
- Bank or payout destination

Unmatched items should remain on hold until resolved.

---

# PART G — PAYOUTS

## 36. Payout Eligibility

A beneficiary becomes eligible for payout only when:

- Settlement status is eligible
- KYC is complete
- Bank or payout details are valid
- No material hold exists
- Reconciliation is complete
- Required tax information is available

---

## 37. Payout Failure

If payout fails:

- The amount remains payable
- It must not be treated as successfully settled
- Failure reason must be stored
- Retry must be controlled
- Duplicate payout must be prevented
- Beneficiary must be notified where appropriate

---

## 38. Partial Settlement

Partial settlement may occur when:

- Part of a transaction is disputed
- A partial refund exists
- A milestone is partially approved
- Some line items are eligible and others are not

Partial settlement must clearly identify:

- Amount settled
- Amount held
- Reason
- Remaining conditions
- Future eligibility

---

# PART H — AUDIT AND DATA PRESERVATION

## 39. Settlement Audit Trail

Every settlement action should record:

- Actor
- Timestamp
- Transaction
- Beneficiary
- Gross amount
- Deductions
- Net amount
- Previous status
- New status
- Reason
- Approval
- Related evidence
- Payout reference

---

## 40. Historical Preservation

Settlement records must remain preserved even when:

- A user account closes
- A Venue Partner leaves
- A BDP is terminated
- A Circle is archived
- An enterprise project closes
- A refund is completed
- A chargeback is lost or won
- A transaction is reversed

Financial history must not be deleted merely because the business relationship ends.

---

# PART I — ROLE-BASED AUTHORITY

## 41. Customer

A customer may view:

- Own payments
- Own refunds
- Own settlement-related transaction status where relevant

A customer cannot approve platform settlement.

---

## 42. Venue Partner

A Venue Partner may view:

- Gross transaction amount
- Deductions
- Refund adjustments
- Net settlement
- Hold reason where disclosure is permitted
- Payout status

A Venue Partner cannot alter settlement rules.

---

## 43. BDP

A BDP may view:

- Own eligible commission
- Pending commission
- Recovery deduction
- Clawback
- Payout status
- Historical commission

A BDP cannot manually mark commission as earned.

---

## 44. RM and PRM

RM and PRM access must be limited to the financial visibility required for assigned operational duties.

They do not automatically receive authority to:

- Release settlement
- Issue refunds
- Move ledger balances
- Override commission
- Change tax calculations

---

## 45. Finance Administrator

A Finance Administrator may perform approved settlement operations subject to:

- RBAC
- Audit logging
- Segregation of duties
- Approval controls
- Reconciliation requirements

---

# PART J — PROHIBITED INTERPRETATIONS

## 46. Prohibited Interpretations

This Founder Decision must not be interpreted to mean:

- Payment received equals immediate settlement
- Every event settles on the same timeline
- Every commission is payable immediately
- Pending commission is guaranteed
- A cancelled event may settle normally
- A chargeback may be ignored
- A hold may be placed without reason
- Manual override may bypass audit
- One percentage applies to all verticals
- Enterprise 30/40/30 may be changed informally
- Tax rules may be invented
- Historical settlement entries may be deleted

---

# PART K — RELATED DOCUMENTS

## 47. Canonical Document Impact

This Founder Decision should be reflected in:

- Financial and Wallet Architecture
- Revenue Model
- Commission Engine
- Refund Architecture
- Payment Architecture
- Membership Architecture
- Marketplace Architecture
- Enterprise Architecture
- BDP Architecture
- Role Taxonomy
- RBAC and Permissions
- Database Architecture
- API Architecture
- Audit Architecture
- Dashboard Architecture

---

## 48. Related Founder Decisions

This Founder Decision works together with:

- FD-001 — GCE Business Model
- FD-020 — Financial and Wallet Architecture
- FD-022 — Membership Lifecycle
- FD-023 — RBAC and Permissions
- FD-024 — GCE Connect Circle Lifecycle

Where a more specific product Founder Decision defines a commercial rule, that more specific rule applies without contradicting the settlement principles in this file.

---

# PART L — UNRESOLVED ITEMS

## 49. Items Not Finalised

The following are not finalised in this Founder Decision:

- Exact banking-day adjustments
- Exact settlement calendar
- Exact payment-gateway provider
- Exact payout provider
- Exact GST treatment
- Exact TDS treatment
- Exact invoice workflow
- Exact refund SLA
- Exact chargeback evidence SLA
- Exact event-cancellation cut-offs
- Exact no-show settlement rules by product
- Exact enterprise completion-acceptance period
- Exact hold-review SLA
- Exact manual-override thresholds
- Exact payout minimums
- Exact partial-settlement policy
- Exact reconciliation frequency
- Exact foreign-currency handling
- Exact international payout rules

Cursor and developers must not invent these rules.

---

## 50. Founder Approval Summary

| Settlement Principle | Status |
|---|---|
| Transaction-specific settlement triggers | Founder Approved |
| Membership settlement after payment and activation | Founder Approved |
| Marketplace event settlement after completion plus 48 hours | Founder Approved |
| Campaign fee recognition after activation | Founder Approved |
| Enterprise standard milestone model of 30% / 40% / 30% | Founder Approved |
| Monthly BDP commission processing | Founder Approved |
| Commission payout on first day of following month, subject to controls | Founder Approved |
| Refund handling for cancelled transactions | Founder Approved |
| Chargeback and dispute freeze | Founder Approved |
| Platform authority to delay settlement for defined reasons | Founder Approved |
| Automated settlement where practical | Founder Approved |
| Immutable settlement history | Founder Approved |
| Controlled manual override | Founder Approved |
| Reconciliation before payout | Founder Approved |
| Historical preservation | Founder Approved |

---

## 51. Decision Statement

GCE will use a transaction-specific, auditable Settlement Engine.

Money will become eligible for settlement only after the relevant approved business condition is satisfied.

Settlement, commission, refund, hold, reversal, and payout activity must remain traceable and must not be silently altered or deleted.

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-021**
