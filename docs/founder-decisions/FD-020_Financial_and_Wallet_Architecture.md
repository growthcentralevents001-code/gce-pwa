# FD-020 — Financial and Wallet Architecture

**Decision ID:** FD-020
**Title:** Financial and Wallet Architecture
**Status:** Founder Approved
**Decision Type:** Financial Architecture Constitution
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** GCE Connect, GCE Marketplace, GCE Enterprise, shared platform services

---

## 1. Purpose

This Founder Decision defines the approved high-level financial and wallet architecture of the Growth Central Events platform.

It establishes:

- The relationship between the user-facing GCE Wallet and internal financial ledgers
- The separation of financial balances by purpose
- Escrow and settlement principles
- Commission accounting
- Refund accounting
- Reward accounting
- Franchise-recovery accounting
- Tax accounting
- Audit and immutability principles
- Restrictions on manual financial movement
- The treatment of negative balances
- The financial authority hierarchy

This file defines business and architecture rules.

It does not define:

- Database table structures
- Payment-gateway code
- Accounting software integration
- GST configuration
- Bank settlement APIs
- Detailed reconciliation jobs
- Legal or tax advice

Those subjects must be implemented later without contradicting this Founder Decision.

---

## 2. Core Financial Principle

The approved financial architecture is:

> **One simple user-facing financial experience, supported by multiple separate internal ledgers.**

A user may see one GCE Wallet interface.

Internally, GCE must not treat all money as one combined balance.

Every financial amount must be classified according to its purpose, ownership, availability, and settlement state.

---

## 3. Unified GCE Wallet

The GCE Wallet is the user-facing financial interface of the platform.

Depending on the user’s approved roles and platform features, the Wallet may display:

- Available balance
- Pending balance
- Refund balance
- Reward balance
- Commission earnings
- Settlement history
- Recovery deductions
- Transaction history
- Payment status
- Withdrawal or payout status
- Promotional or platform credits where approved

The Wallet must present information clearly without exposing unnecessary internal accounting complexity.

---

## 4. Wallet Is Not a Single Accounting Ledger

The visible GCE Wallet must not be implemented as one undifferentiated balance.

The platform must distinguish between:

- Customer money
- Money held temporarily
- Money owed to merchants
- Money owed to business-development partners
- Platform revenue
- Refund liabilities
- Reward liabilities
- Tax liabilities
- Franchise-recovery amounts

The Wallet interface may combine views for convenience, but internal accounting must remain separated.

---

## 5. Approved Internal Ledger Categories

The approved internal financial architecture includes the following ledger categories.

### 5.1 Customer Ledger

Tracks money belonging to or paid by a customer.

It may include:

- Event payments
- Offer payments
- Membership payments
- Deposits
- Refund entitlements
- Wallet credits
- Transaction adjustments

The Customer Ledger must not be treated as platform revenue merely because the payment passed through GCE.

---

### 5.2 Escrow Ledger

Tracks money temporarily held pending completion of an approved condition.

Examples may include:

- Event completion
- Offer redemption
- Service fulfilment
- Enterprise milestone completion
- Dispute resolution
- Chargeback review
- Refund review

Money in escrow is not automatically available for final settlement.

---

### 5.3 Settlement Ledger

Tracks amounts approved and payable to external parties.

Possible beneficiaries include:

- Venue Partners
- Business partners
- Enterprise vendors
- Other approved recipients

The Settlement Ledger should record:

- Gross transaction amount
- Platform deductions
- Commission deductions
- Tax deductions
- Refund adjustments
- Net payable amount
- Settlement eligibility date
- Settlement status
- Payout reference

---

### 5.4 Commission Ledger

Tracks commission earned by approved stakeholders.

Possible commission beneficiaries may include:

- Connect BDP
- Marketplace BDP
- Enterprise BDP
- Other Founder-approved roles

The Commission Ledger should separately record:

- Commission source
- Commission basis
- Applicable percentage or rule
- Earned amount
- Pending amount
- Approved amount
- Recovered amount
- Paid amount
- Reversed amount
- Clawback amount
- Settlement period

Commission must not be merged into merchant settlement records without identifiable accounting.

---

### 5.5 Rewards Ledger

Tracks non-cash or restricted-value benefits.

Possible examples include:

- Cashback
- Loyalty rewards
- Promotional credits
- Referral rewards
- Service credits
- Platform-issued benefits

Reward balances must remain separate from:

- Cash balances
- Merchant settlements
- BDP commissions
- Tax liabilities

The exact reward products are not approved by this Founder Decision.

---

### 5.6 Refund Ledger

Tracks refund obligations and refund processing.

It may record:

- Original transaction
- Refund reason
- Refund amount
- Partial or full refund
- Refund approval
- Refund source
- Refund destination
- Processing status
- Completion reference
- Reversal or failure

Refund obligations must not be hidden inside general transaction records.

---

### 5.7 Franchise Recovery Ledger

Tracks approved recoveries related to a business-partner finance or deferred-payment arrangement.

It may record:

- Original amount financed
- Upfront amount paid
- Outstanding recovery amount
- Monthly recovery
- Commission retained toward recovery
- Remaining balance
- Recovery completion
- Adjustment or waiver, if separately approved

This ledger is especially relevant where GCE allows a business partner to recover a deferred package amount from future commissions.

---

### 5.8 Tax Ledger

Tracks financial amounts related to tax obligations.

It may include:

- GST
- TDS
- Tax collected
- Tax withheld
- Tax payable
- Tax adjustments
- Invoice references

Exact tax rules must be validated separately by qualified legal, accounting, and tax professionals.

Cursor and developers must not invent tax rates or treatments.

---

## 6. Ledger Separation Rule

Each ledger category must remain logically separated.

The platform must be able to answer:

- Who legally or commercially owns the amount?
- Is the amount pending, held, earned, payable, refunded, or restricted?
- What transaction created it?
- What rule changed it?
- Who approved the change?
- When did the state change?
- Has it been paid, reversed, refunded, or recovered?

No ledger entry should exist without an identifiable source and purpose.

---

## 7. Escrow-First Principle

Where a transaction requires completion, fulfilment, redemption, approval, or review, funds should first enter an escrow or controlled pending state.

Examples may include:

- Marketplace event booking
- Marketplace offer transaction
- Venue settlement
- Enterprise milestone payment
- Disputed transaction
- Chargeback-sensitive payment

Funds should move from escrow only when the approved settlement condition is satisfied.

The detailed settlement timing is governed by:

> `FD-021_Settlement_Engine.md`

---

## 8. Automated Settlement Principle

Settlement should be automated wherever practical.

The system should automatically evaluate:

- Transaction success
- Fulfilment status
- Completion status
- Refund status
- Chargeback status
- Commission rules
- Recovery rules
- Tax deductions
- Settlement hold periods
- Beneficiary eligibility

Manual settlement should be treated as an exception, not the default.

---

## 9. Financial Entry Immutability

Financial history must be preserved.

Approved principle:

> **Posted financial entries must not be silently edited or deleted.**

Corrections should be handled through:

- Reversal entries
- Adjustment entries
- Credit entries
- Debit entries
- Clawback entries
- Refund entries
- Recovery entries

The original entry should remain visible in the audit trail.

---

## 10. No Uncontrolled Manual Movement

No user, BDP, RM, PRM, or administrator should be able to move money manually without:

- Explicit permission
- Valid business reason
- Recorded authorisation
- Audit log
- Source ledger
- Destination ledger
- Transaction reference

High-risk financial actions should require additional controls.

The exact approval mechanism may include:

- Maker-checker approval
- Dual approval
- Finance review
- Automated policy validation

The technical control is not finalised in this Founder Decision.

---

## 11. Negative Balance Rule

Ordinary user, merchant, commission, and reward ledgers should not casually become negative.

The approved exception is:

> An outstanding franchise or deferred-package recovery may be represented as an amount still recoverable.

This recovery obligation should be tracked in the Franchise Recovery Ledger.

It should not be displayed as an ordinary negative cash balance unless the product design explicitly clarifies the meaning.

---

## 12. Recovery from Commission

Where a Founder-approved business-partner finance arrangement applies:

- Recovery may be deducted from earned commission
- Recovery must not exceed the approved monthly or earned amount
- If earned commission is less than the approved recovery cap, only the available earned commission may be retained
- The partner should not automatically be required to pay the monthly shortfall in cash unless a separate approved rule says so
- Remaining recovery must carry forward
- All deductions must be visible and auditable

Exact values and limits belong in the relevant business-partner Founder Decision.

---

## 13. Commission Recognition

Commission must be recognised only when the approved earning condition is satisfied.

Depending on the transaction, this may require:

- Successful membership activation
- Successful event completion
- Successful offer fulfilment
- Successful enterprise milestone
- Successful settlement eligibility
- Absence of unresolved fraud or dispute

Commission may pass through statuses such as:

- Estimated
- Pending
- Earned
- Approved
- Recoverable
- Payable
- Paid
- Reversed
- Clawed Back

Exact status names may be refined in technical design.

---

## 14. Refund Architecture

Refunds must be processed through a controlled refund flow.

The platform should identify:

- Original transaction
- Reason for refund
- Refund policy
- Amount eligible
- Funding source
- Beneficiary
- Approval status
- Payment-gateway status
- Final completion status

A refund may be:

- Full
- Partial
- Adjusted
- Credited to Wallet
- Returned to original payment method

The exact rule depends on the product and transaction type.

---

## 15. Chargebacks and Disputes

When a chargeback, fraud review, or material dispute exists:

- Related settlement may be frozen
- Related commission may remain pending
- Related merchant payout may remain pending
- Evidence must be preserved
- Resolution must be auditable
- Final adjustments must be recorded through ledger entries

The platform must not erase the original transaction.

---

## 16. Role-Based Financial Access

Financial access must follow the RBAC architecture.

Examples:

### 16.1 Customer

May view:

- Own payments
- Own refunds
- Own credits
- Own transaction history

### 16.2 Venue Partner

May view:

- Own gross revenue
- Own deductions
- Own settlements
- Own refunds
- Own payout status

### 16.3 BDP

May view:

- Own eligible commission
- Own recovery deductions
- Own payout status
- Own historical commission

### 16.4 RM or PRM

May view only financial information explicitly required for approved operational duties.

They do not automatically receive authority to:

- Move money
- Approve settlement
- Alter ledgers
- Issue refunds

### 16.5 Finance Administrator

May access approved financial operations subject to:

- Permission
- Audit
- Segregation of duties
- Approval controls

---

## 17. Single Wallet, Multiple Role Views

A user with multiple roles should not require multiple separate login accounts.

However, the Wallet should clearly distinguish balances and records by role or purpose.

Example:

```text
My GCE Wallet
    |
    |-- Customer Transactions
    |-- Member Payments
    |-- Venue Settlements
    |-- BDP Commissions
    |-- Rewards
    |-- Refunds
    `-- Recovery Schedule
```

The interface may be unified.

The accounting must remain separated.

---

## 18. Transaction Traceability

Every financial transaction should be traceable to:

- User or business account
- Role
- Vertical
- Product
- Transaction type
- Source document
- Payment reference
- Order, booking, membership, campaign, or project
- Gross amount
- Deductions
- Tax
- Commission
- Net amount
- Ledger entries
- Status changes
- Settlement or refund outcome

---

## 19. Cross-Vertical Financial Separation

GCE Connect, GCE Marketplace, and GCE Enterprise may share financial infrastructure.

They must not share undefined commercial logic.

The platform must separately identify:

- GCE Connect revenue
- GCE Marketplace revenue
- GCE Enterprise revenue
- Vertical-specific commissions
- Vertical-specific settlements
- Vertical-specific refunds
- Vertical-specific taxes

Shared infrastructure does not mean shared business rules.

---

## 20. Platform Revenue Recognition

Platform revenue must be recognised according to the approved commercial event.

Examples may include:

- Membership activation
- Campaign activation
- Event completion
- Enterprise milestone completion
- Service delivery
- Non-refundable approved fee

Exact revenue-recognition rules must be confirmed through the relevant Founder Decision and accounting review.

---

## 21. Financial Status Architecture

A transaction may use statuses such as:

- Created
- Pending Payment
- Paid
- Failed
- In Escrow
- Partially Fulfilled
- Fulfilled
- Eligible for Settlement
- Settlement Pending
- Settled
- Refund Pending
- Refunded
- Disputed
- Chargeback
- Reversed
- Cancelled

The exact state machine must be defined during technical architecture.

---

## 22. Reconciliation Principle

The platform should support regular reconciliation between:

- Payment gateway
- Bank account
- Internal ledgers
- Settlements
- Refunds
- Commissions
- Taxes
- Recovery balances

Unmatched items must be:

- Flagged
- Investigated
- Resolved
- Audited

The exact reconciliation frequency is not defined in this Founder Decision.

---

## 23. Audit Requirements

Every financial change should capture:

- Actor
- Action
- Timestamp
- Source ledger
- Destination ledger
- Original amount
- Adjustment amount
- Reason
- Approval authority
- Related transaction
- Previous state
- New state

Sensitive actions should be retained according to approved security and legal policies.

---

## 24. Segregation of Duties

No single operational role should automatically control the full financial lifecycle.

Where practical, the platform should separate:

- Transaction creation
- Refund request
- Refund approval
- Settlement approval
- Payout execution
- Reconciliation
- Audit review

Exact department and approval structures remain subject to organisational design.

---

## 25. Data Preservation

Financial data must be preserved even when:

- A user closes an account
- A membership expires
- A Venue Partner leaves
- A BDP is terminated
- A Circle is archived
- An enterprise project closes
- A refund is completed
- A transaction is reversed

Retention and deletion must comply with applicable law and approved data-governance policies.

---

## 26. Security Principles

The financial architecture must support:

- Least-privilege access
- Encryption
- Secure payment integration
- Audit logging
- Idempotent financial operations
- Fraud review
- Duplicate-payment prevention
- Duplicate-settlement prevention
- Secure webhook handling
- Authorised adjustments only

Exact technical controls must be documented later.

---

## 27. Prohibited Interpretations

This Founder Decision must not be interpreted to mean:

- Every balance is cash-withdrawable
- Rewards are the same as cash
- Escrow belongs to GCE immediately
- Pending commission is guaranteed commission
- A BDP may manually withdraw commission before eligibility
- RM or PRM has automatic finance authority
- Ledger entries may be deleted
- A visible Wallet balance equals one accounting ledger
- One settlement rule applies to every vertical
- Tax rates may be invented by Cursor or developers

---

## 28. Canonical Document Impact

This Founder Decision should be reflected in:

- Business Model
- Revenue Model
- Payment Architecture
- Settlement Architecture
- Commission Architecture
- Refund Architecture
- Wallet Architecture
- Role Taxonomy
- RBAC and Permissions
- Database Architecture
- API Architecture
- Dashboard Architecture
- Audit and Compliance Architecture

Lower-level documents must reference this Founder Decision and must not contradict it.

---

## 29. Related Founder Decisions

This Founder Decision works together with:

- FD-001 — GCE Business Model
- FD-021 — Settlement Engine
- FD-022 — Membership Lifecycle
- FD-023 — RBAC and Permissions
- FD-024 — GCE Connect Circle Lifecycle

Where FD-021 defines a specific settlement trigger, FD-021 governs that settlement subject.

---

## 30. Items Not Finalised

The following remain unresolved or require later technical, legal, or accounting approval:

- Exact database schema
- Exact ledger table design
- Exact payment-gateway provider
- Exact bank-payout process
- Exact GST treatment
- Exact TDS treatment
- Exact invoice format
- Exact reconciliation schedule
- Exact refund SLA
- Exact chargeback process
- Exact reward conversion rules
- Exact withdrawal limits
- Exact maker-checker thresholds
- Exact accounting software integration
- Exact data-retention periods
- Exact financial reporting format

Cursor and developers must not invent these rules.

---

## 31. Founder Approval Summary

The Founder approves the following principles:

| Financial Principle | Status |
|---|---|
| One user-facing GCE Wallet | Founder Approved |
| Multiple internal ledgers | Founder Approved |
| Customer Ledger | Founder Approved |
| Escrow Ledger | Founder Approved |
| Settlement Ledger | Founder Approved |
| Commission Ledger | Founder Approved |
| Rewards Ledger | Founder Approved |
| Refund Ledger | Founder Approved |
| Franchise Recovery Ledger | Founder Approved |
| Tax Ledger | Founder Approved |
| Escrow-first approach where applicable | Founder Approved |
| Automated settlement where practical | Founder Approved |
| Immutable financial history | Founder Approved |
| No uncontrolled manual money movement | Founder Approved |
| Recovery may be deducted from earned commission | Founder Approved |
| Ordinary balances should not casually become negative | Founder Approved |
| Role-based financial access | Founder Approved |
| Cross-vertical accounting separation | Founder Approved |

---

## 32. Decision Statement

GCE will operate a unified user-facing financial experience supported by separate, auditable, purpose-specific internal ledgers.

All financial implementation must preserve:

- Ownership clarity
- Transaction traceability
- Ledger separation
- Settlement control
- Auditability
- Role-based authority
- Historical integrity

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-020**
