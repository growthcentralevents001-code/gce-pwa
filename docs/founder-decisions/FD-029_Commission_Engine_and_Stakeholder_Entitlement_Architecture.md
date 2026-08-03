# FD-029 — Commission Engine and Stakeholder Entitlement Architecture

**Decision ID:** FD-029
**Title:** Commission Engine and Stakeholder Entitlement Architecture
**Status:** Founder Approved
**Decision Type:** Commission, Entitlement, Recovery, Attribution, and Settlement Constitution
**Authority Level:** Founder Decision
**Platform:** Growth Central Events (GCE)
**Applies To:** GCE Connect, GCE Marketplace, GCE Enterprise, Connect BDP, Marketplace BDP, Enterprise BDP, Venue Partners, future Affiliates, stakeholder commissions, franchise finance recovery, refunds, chargebacks, reversals, negative balances, attribution, split commissions, multi-currency calculations, approvals, dashboards, reporting, and audit

---

## 1. Purpose

This Founder Decision defines the approved Commission Engine and Stakeholder Entitlement Architecture for GCE.

It establishes:

- Commission and entitlement terminology
- Calculation bases and calculation order
- Connect BDP commission rules
- Marketplace BDP commission rules
- Enterprise BDP commission rules
- Venue Partner entitlement
- Connect BDP and Marketplace BDP Commission-Recovery Finance Options
- Recovery, negative balance, refund, chargeback, and reversal treatment
- Attribution and reassignment rules
- Split commissions
- Rule versioning and effective dates
- Multi-currency commission handling
- Approval controls and separation of duties
- Dashboard, statement, reporting, and audit requirements
- Non-commissionable-by-default revenue rules
- Unresolved matters that must not be invented

This Founder Decision must be read together with FD-001 and FD-020 through FD-028.

---

## 2. Superseding Effect

FD-029 supersedes only the earlier FD-025 position that deferred finance was inactive for the Connect BDP.

FD-029 does not otherwise replace FD-025.

FD-029 also finalises the Marketplace BDP commission and finance rules that were previously unresolved under FD-028.

---

# PART A — COMMISSION ENGINE PURPOSE

## 3. Platform-Controlled Commission Engine

The Commission Engine is the single platform-controlled system responsible for:

- Selecting the applicable commercial rule
- Determining the eligible calculation base
- Calculating stakeholder entitlement
- Recording stakeholder attribution
- Applying exclusions, holds, recoveries, and deductions
- Reversing commission after refunds, chargebacks, or invalidation
- Creating Recoverable Balances
- Determining settlement eligibility
- Preserving rule version and effective dates
- Supporting multi-currency transactions
- Producing auditable statements and reports

No stakeholder may calculate, approve, alter, or settle their own final commission outside the authorised platform workflow.

---

# PART B — TERMINOLOGY

## 4. Stakeholder Entitlement

Stakeholder Entitlement means:

> The commercial amount allocated to a stakeholder under an approved Founder Decision or commercial rule.

## 5. Estimated Commission

Estimated Commission means:

> An informational calculation shown before all earning conditions are completed.

Estimated Commission is not earned, payable, or settlement eligible.

## 6. Provisional Commission

Provisional Commission means:

> A calculated amount awaiting final validation, attribution, fulfilment, evidence, or approval.

## 7. Earned Commission

Earned Commission means:

> A commission whose approved earning conditions have been completed and whose underlying transaction is valid, attributable, and not excluded.

Earned Commission is not automatically settlement eligible.

## 8. Commission on Hold

Commission on Hold means:

> A provisional or earned amount temporarily blocked because of a refund window, dispute, compliance review, chargeback, attribution conflict, missing evidence, or another approved hold reason.

## 9. Settlement-Eligible Commission

Settlement-Eligible Commission means:

> Earned Commission that has passed all applicable reconciliation, hold, tax, recovery, approval, and settlement conditions.

## 10. Paid Commission

Paid Commission means:

> A Settlement-Eligible Commission successfully paid through an approved settlement channel.

## 11. Reversed Commission

Reversed Commission means:

> A commission cancelled because the underlying transaction, earning event, attribution, or commercial entitlement was reversed, refunded, charged back, invalidated, or corrected.

## 12. Recoverable Balance

Recoverable Balance means:

> An amount previously paid or financed that remains recoverable through future approved earnings or another authorised recovery mechanism.

A Recoverable Balance may arise from:

- Refund after commission payment
- Chargeback after settlement
- Duplicate payment
- Attribution correction
- Calculation error
- Fraudulent transaction
- Connect BDP finance recovery
- Marketplace BDP finance recovery
- Enterprise BDP finance recovery
- Other authorised adjustment

---

# PART C — UNIVERSAL CALCULATION ORDER

## 13. Commission Calculation Sequence

```text
Gross Transaction Value
→ Exclude GST and statutory taxes
→ Apply approved discounts and credits
→ Remove refunds, reversals, chargebacks, invalid and fraudulent amounts
→ Determine Eligible Revenue
→ Determine Platform Revenue or Stakeholder Entitlement
→ Calculate Stakeholder Commission
→ Apply attribution
→ Apply holds and approved deductions
→ Mark Earned
→ Mark Settlement Eligible
→ Settle
```

A payment appearing in the platform does not automatically become commission payable.

## 14. Percentage of Eligible Revenue

```text
Eligible Revenue × Approved Percentage
= Stakeholder Entitlement
```

## 15. Percentage of Platform Revenue

```text
Eligible Platform Revenue × Approved Percentage
= Stakeholder Commission
```

The Commission Engine must not confuse these calculation bases.

---

# PART D — CONNECT BDP COMMISSION

## 16. Approved Connect BDP Commission

The Connect BDP earns:

> **20% of eligible GCE Connect subscription revenue**

Eligible revenue may include:

- Associate Tier initial subscription
- Associate Tier renewal
- Future Core Tier upgrade payment
- Future Core Tier renewal
- Tag 3 subscription
- Tag 4 subscription

## 17. Connect BDP Earning Conditions

Connect BDP commission becomes earned only after:

- Payment is successfully collected
- Membership or Tag is activated
- Correct member, Circle, and Connect BDP Franchise Unit attribution exists
- No unresolved refund, reversal, chargeback, dispute, fraud, or compliance hold exists
- Applicable settlement conditions are met

## 18. Connect BDP Examples

```text
Eligible Associate Tier subscription revenue: ₹6,000
Connect BDP commission rate: 20%
Connect BDP commission: ₹1,200
```

```text
Eligible Tag revenue: ₹1,500
Connect BDP commission rate: 20%
Connect BDP commission: ₹300
```

GST and statutory taxes are excluded from the commission base.

## 19. Connect BDP Renewal Attribution

Commission belongs to the validly attributed Connect BDP Franchise Unit on the earning date.

A later reassignment does not automatically transfer historical earned commission.

## 20. Connect BDP Non-Commissionable Revenue by Default

The Connect BDP’s 20% rule does not automatically apply to:

- Transfer or administrative fees
- Event ticket revenue
- Sponsorship
- Advertising
- Promotional Visibility
- Training or masterclass revenue
- Technology services
- Lead Assist
- Marketplace revenue
- Enterprise revenue
- Penalties
- Taxes
- Complimentary or promotional credits

---

# PART E — CONNECT BDP COMMISSION-RECOVERY FINANCE OPTION

## 21. Direct Connect BDP Franchise Unit

> **₹50,000 per unit, upfront, one-time, and non-refundable after activation**

## 22. Financed Connect BDP Franchise Unit

```text
Total financed package value: ₹60,000
Initial activation payment: ₹5,000
Recoverable Balance: ₹55,000
Maximum recovery per commission cycle: ₹5,000
Recovery commencement: Month 0
Recovery source: Earned and approved Connect BDP commission only
```

## 23. Meaning of Month 0

Month 0 means:

> The first commission cycle in which valid, earned, approved, and settlement-eligible Connect BDP commission becomes available after Franchise Unit activation.

If no commission is earned, no recovery occurs.

## 24. Connect BDP Recovery Rule

Recovery is the lower of:

- ₹5,000, or
- Available earned and approved Connect BDP commission for that cycle

There is:

- No compulsory cash shortfall
- No automatic personal-bank debit
- No recovery from estimated, provisional, or held commission
- No additional interest after activation
- Full carry-forward of unrecovered balance

Exit or suspension does not automatically erase the Recoverable Balance.

## 25. Connect BDP Recovery Examples

```text
Gross earned commission: ₹12,000
Finance recovery: ₹5,000
Balance before tax and other deductions: ₹7,000
Remaining Recoverable Balance: ₹50,000
```

```text
Gross earned commission: ₹1,200
Finance recovery: ₹1,200
Balance before tax and other deductions: ₹0
Remaining Recoverable Balance: ₹53,800
```

---

# PART F — MARKETPLACE COMMERCIAL ENTITLEMENTS

## 26. Active Marketplace Split

```text
Eligible Marketplace Event Revenue
→ 80% Venue Partner Entitlement
→ 20% GCE Gross Marketplace Platform Commission
```

## 27. Marketplace BDP Commission

The Marketplace BDP earns:

> **10% of Eligible Marketplace Event Revenue**

This 10% is paid from GCE’s existing 20% Marketplace Platform Commission.

Equivalent interpretation:

> Marketplace BDP receives 50% of GCE’s standard 20% Marketplace Platform Commission.

## 28. Marketplace Net Retention

```text
Eligible Marketplace Event Revenue
→ 80% Venue Partner
→ 10% Marketplace BDP
→ 10% GCE net retained share
```

## 29. Marketplace Example

```text
Eligible Marketplace Event Revenue: ₹2,00,000
Venue Partner Entitlement: ₹1,60,000
GCE Gross Platform Commission: ₹40,000
Marketplace BDP Commission: ₹20,000
GCE Net Retained Share: ₹20,000
```

## 30. Marketplace BDP Earning Conditions

Marketplace BDP commission becomes earned only after:

- Valid Marketplace BDP attribution
- Venue onboarded by or validly assigned to that MBDP
- Valid Marketplace Event or Offer Event
- Successful customer payment
- Required event, booking, attendance, redemption, or fulfilment completed
- Eligible Revenue calculated after taxes and exclusions
- No unresolved refund, reversal, chargeback, dispute, fraud, compliance, or attribution hold
- Required evidence accepted
- Commission becomes settlement eligible

## 31. Marketplace Non-Earning Events

No commission arises from:

- Venue onboarding alone
- Event or Offer listing
- Expected campaign value
- Proposal value
- Booking enquiry
- Unpaid booking
- Failed or reversed payment
- Uncompleted event
- Invalid or fraudulent transaction

---

# PART G — MARKETPLACE BDP FRANCHISE UNIT AND FINANCE

## 32. Direct Marketplace BDP Franchise Unit

> **₹50,000, upfront, one-time, and non-refundable after activation**

## 33. Marketplace BDP Venue Capacity

One Marketplace BDP Franchise Unit supports:

> **Maximum 20 active Venue Partners**

More than 20 active Venue Partners requires another approved Franchise Unit.

The maximum number of units per Marketplace BDP remains Pending Founder Approval.

## 34. Financed Marketplace BDP Franchise Unit

```text
Total financed package value: ₹60,000
Initial activation payment: ₹5,000
Recoverable Balance: ₹55,000
Maximum recovery per commission cycle: ₹5,000
Recovery commencement: Month 0
Recovery source: Earned and approved Marketplace BDP commission only
```

## 35. Marketplace BDP Month 0

Month 0 means the first commission cycle in which valid, earned, approved, and settlement-eligible Marketplace BDP commission becomes available.

## 36. Marketplace BDP Recovery Rule

Recovery is the lower of:

- ₹5,000, or
- Available earned and approved Marketplace BDP commission for that cycle

There is:

- No compulsory cash shortfall
- No automatic bank debit
- No recovery from estimated, provisional, or held commission
- No additional interest after activation
- Carry-forward of unrecovered balance
- Full audit history

Exit or suspension does not automatically erase the Recoverable Balance.

## 37. Marketplace BDP Recovery Examples

```text
Gross earned Marketplace BDP commission: ₹20,000
Finance recovery: ₹5,000
Balance before tax and other deductions: ₹15,000
Remaining Recoverable Balance: ₹50,000
```

```text
Gross earned Marketplace BDP commission: ₹3,000
Finance recovery: ₹3,000
Balance before tax and other deductions: ₹0
Remaining Recoverable Balance: ₹52,000
```

---

# PART H — ENTERPRISE BDP COMMISSION

## 38. Approved Enterprise BDP Commission

The Enterprise BDP earns:

> **25% of the eligible GCE Platform Commission actually earned by GCE**

The Enterprise BDP does not earn 25% of total project value.

## 39. Enterprise Formula

```text
Eligible Enterprise Event Revenue
× Approved GCE Platform Commission Rate
= Eligible GCE Platform Commission

Eligible GCE Platform Commission
× 25%
= Enterprise BDP Commission
```

## 40. Enterprise Example

```text
Eligible Enterprise Event Revenue: ₹5,00,000
Approved Platform Commission Rate: 20%
GCE Platform Commission: ₹1,00,000
Enterprise BDP Commission: ₹25,000
GCE retained before other approved costs: ₹75,000
```

## 41. Enterprise BDP Earning Conditions

Enterprise BDP commission becomes earned only after:

- Client payment collected
- Relevant milestone approved
- GCE Platform Commission earned
- Valid client and Enterprise BDP attribution
- No duplicate-client dispute
- No unresolved refund, chargeback, fraud, compliance, or attribution hold
- Required evidence accepted
- Applicable finance recovery calculated
- Settlement conditions met

## 42. Enterprise BDP Finance Recovery

Enterprise BDP financing remains governed by FD-026:

```text
Direct pack: ₹30,000
Financed pack total: ₹36,000
Initial payment: ₹5,000
Recoverable Balance: ₹31,000
Maximum monthly recovery: Up to ₹5,000
Recovery source: Earned and approved Enterprise BDP commission only
No compulsory cash shortfall
Balance carries forward
```

FD-029 does not alter the Enterprise BDP finance structure.

---

# PART I — AFFILIATE AND ZBP STATUS

## 43. Affiliate Future Only

No active Affiliate commission, rate, entitlement, attribution, wallet, or settlement exists.

Any future Affiliate model requires a separate Founder Decision.

## 44. ZBP Removed

No ZBP role, commission, wallet, entitlement, security deposit, attribution, or settlement rule is active.

---

# PART J — NON-COMMISSIONABLE-BY-DEFAULT REVENUE

## 45. General Principle

> A revenue category is not commissionable merely because it exists.

## 46. Non-Commissionable-by-Default Categories

- Advertising Revenue
- Promotional Visibility Revenue
- Sponsorship Revenue
- Administrative Fee Revenue
- Franchise and Partner-Pack Fee Revenue
- Ticketing or Booking Service Revenue
- Technology and Digital-Service Revenue
- Training, Workshop, and Masterclass Revenue
- Lead Assist Revenue
- Vendor Opportunity Fee Revenue
- Other newly introduced revenue

Each future commission model requires an eligible stakeholder, calculation base, rate or fixed amount, earning trigger, attribution rule, refund treatment, settlement rule, and approval authority.

---

# PART K — SPLIT COMMISSIONS

## 47. Split-Commission Capability

The Commission Engine should support split commissions technically, but no split may occur without an approved rule or authorised case-specific approval.

## 48. Split Record

A split record should include:

- Total commission pool
- Each beneficiary
- Percentage or amount
- Reason
- Approver
- Effective date
- Evidence
- Rule version

The total split must never exceed the approved commission pool.

---

# PART L — ATTRIBUTION AND REASSIGNMENT

## 49. Duplicate Attribution

Where two stakeholders claim the same entity or transaction:

- Disputed commission remains on hold
- No disputed amount settles
- Platform reviews verified evidence
- Historical timestamps remain preserved
- Decision and reason are recorded

## 50. Reassignment Record

Every reassignment should include:

- Previous stakeholder
- New stakeholder
- Effective date and time
- Reason
- Approver
- Affected entities
- Treatment of earned and pending commission

## 51. Reassignment Principle

> Reassignment normally affects future earning events only.

Previously earned commission remains with the previously valid stakeholder unless fraud, attribution error, or an approved transition rule applies.

---

# PART M — RULE VERSIONING

## 52. Commission Rule Versioning

Every commission calculation must retain:

- Rule ID
- Rule version
- Vertical
- Revenue category
- Calculation method
- Calculation base
- Rate
- Effective date
- Approval authority

A later rule change must not silently recalculate historical commission.

---

# PART N — REFUNDS, REVERSALS, AND CHARGEBACKS

## 53. Refund Reversal

A valid refund proportionately reduces:

- Eligible Revenue
- Platform Revenue
- Stakeholder commission or entitlement

Pending commission is cancelled, unpaid settlement eligibility is withdrawn, and paid commission may become Recoverable Balance.

## 54. Marketplace Partial Refund Example

```text
Original Eligible Marketplace Revenue: ₹10,000
Venue Partner Entitlement: ₹8,000
Marketplace BDP Commission: ₹1,000
GCE Net Retained Share: ₹1,000
```

After a valid ₹2,000 refund:

```text
Remaining Eligible Revenue: ₹8,000
Venue Partner Entitlement: ₹6,400
Marketplace BDP Commission: ₹800
GCE Net Retained Share: ₹800
```

## 55. Chargeback Treatment

A chargeback:

- Places related commission on hold or reversal
- Removes settlement eligibility
- Reverses pending commission
- May create Recoverable Balance if already paid
- Records chargeback fees separately
- Preserves dispute evidence

Chargeback fees do not generate commission.

---

# PART O — RECOVERABLE BALANCES AND NEGATIVE WALLETS

## 56. Recoverable Balance Controls

Every Recoverable Balance must be:

- Separately recorded
- Linked to its source
- Visible to authorised stakeholders
- Offset only through approved rules
- Preserved in audit history

## 57. Negative Commission Balance

A stakeholder wallet may show a negative Recoverable Balance.

It may be offset against future eligible earnings where legally and contractually permitted.

It must not automatically debit a personal bank account.

---

# PART P — COMMISSION HOLDS

## 58. Hold Reasons

Commission may be held for:

- Refund window
- Payment reconciliation
- Fulfilment validation
- Dispute
- Chargeback
- Fraud investigation
- Compliance review
- KYC expiry
- Attribution conflict
- Missing evidence
- Tax-document issue
- Settlement-account issue
- Court or regulatory instruction
- Other approved reason

## 59. Hold Record

A hold should record its reason, authority, start date, expected review date, evidence, and resolution.

No indefinite unexplained hold should exist.

---

# PART Q — SUSPENSION AND TERMINATION

## 60. Suspension

Suspension does not automatically erase already earned commission.

Estimated and provisional amounts may remain blocked; valid earned amounts may be held, paid, or reversed according to the underlying reason.

## 61. Termination

Commission earned before valid termination remains payable subject to refunds, reversals, recoveries, tax, compliance, and settlement rules.

Future commission normally stops after the termination effective date unless an approved residual rule exists.

---

# PART R — MANUAL ADJUSTMENTS, BONUSES, AND INCENTIVES

## 62. Manual Adjustments

Manual adjustments are exceptional and require:

- Authorised role
- Reason
- Evidence
- Source transaction
- Amount and currency
- Approval
- Audit trail

No direct overwrite of earned commission is permitted.

## 63. Bonus and Incentive Separation

Commission, bonus, and incentive are separate.

Each bonus or incentive requires an approved program, eligibility period, conditions, maximum amount, funding source, tax treatment, and approval authority.

---

# PART S — MULTI-CURRENCY COMMISSION

## 64. Multi-Currency Capability

Every commission record should preserve:

- Original transaction currency
- Eligible Revenue in original currency
- Commission rate
- Commission amount in calculation currency
- Settlement currency
- Exchange rate and source
- Conversion timestamp
- FX fee
- Reporting-currency equivalent
- Payout-currency amount

## 65. Calculation Currency

Commission should first be calculated in the approved transaction currency or contractual settlement currency.

Historical commission must not be recalculated using later FX rates.

## 66. Rounding

Money should be stored in the smallest supported currency unit, without floating-point calculation.

Exact rounding policy remains Pending Technical and Finance Approval.

---

# PART T — APPROVALS AND SEPARATION OF DUTIES

## 67. Approval-Controlled Actions

Sensitive actions requiring role-based approval include:

- Reduced or special rates
- Manual adjustments
- Split commissions
- Attribution corrections
- Hold releases
- Recovery waivers
- Exceptional settlements
- Bonuses
- Historical corrections

No stakeholder may approve their own commission-affecting exception.

## 68. Separation of Duties

Operations verifies fulfilment, Finance verifies collection, platform rules calculate commission, authorised approvers handle exceptions, the Settlement Engine releases payment, and audit records every action.

---

# PART U — DASHBOARDS, STATEMENTS, REPORTS, AND AUDIT

## 69. Stakeholder Dashboard

Dashboards should separately display:

- Eligible transaction value
- Estimated Commission
- Provisional Commission
- Earned Commission
- Commission on Hold
- Settlement-Eligible Commission
- Paid Commission
- Reversed Commission
- Recoverable Balance
- TDS deducted
- Franchise finance recovery
- Net payout
- Original and payout currencies

## 70. Commission Statement

Every commission statement should show transaction reference, revenue category, calculation base, rate, gross commission, holds, reversals, recoveries, taxes, net settlement, currency, earning date, settlement date, rule version, and attribution source.

## 71. Audit Requirements

Every commission-impacting action should record actor, timestamp, stakeholder, transaction, revenue category, eligible base, rate, calculated amount, currency, previous state, new state, reason, evidence, rule version, approver, settlement reference, and recovery reference.

No commission record may be hard-deleted.

---

# PART V — ACTIVE COMMISSION MATRIX

## 72. Approved Matrix

| Revenue or Entitlement | Stakeholder | Active Rule |
|---|---|---|
| Connect membership and eligible Tags | Connect BDP | 20% of Eligible Connect Subscription Revenue |
| Marketplace Eligible Event Revenue | Venue Partner | 80% entitlement |
| Marketplace Eligible Event Revenue | Marketplace BDP | 10% commission |
| Marketplace Eligible Event Revenue | GCE | 10% net retained after standard MBDP commission |
| Enterprise Platform Commission | Enterprise BDP | 25% of Eligible GCE Platform Commission |
| Marketplace Affiliate | Affiliate | Future-only; no active rate |
| Advertising | Any stakeholder | Non-commissionable by default |
| Promotional Visibility | Any stakeholder | Non-commissionable by default |
| Sponsorship | Any stakeholder | Non-commissionable by default |
| Transfer fee | Connect BDP | Non-commissionable by default |
| Lead Assist | Any stakeholder | Unresolved |
| Vendor Opportunity Fee | Any stakeholder | Unresolved |
| Franchise fees | Any stakeholder | No automatic transaction commission |
| Training and technology services | Any stakeholder | Non-commissionable unless approved |

---

# PART W — PROHIBITED INTERPRETATIONS

## 73. Prohibited Interpretations

FD-029 must not be interpreted to mean:

- Collected payment automatically means earned commission
- Earned commission automatically means immediate payout
- Connect BDP earns 20% on every GCE revenue stream
- Enterprise BDP earns 25% of project value
- Venue Partner receives 80% before fulfilment
- Marketplace BDP commission is unresolved
- Marketplace BDP earns from venue onboarding alone
- Affiliate receives 5%
- ZBP exists
- Advertising or sponsorship is automatically commissionable
- Taxes are included in commission base
- Proposal or invoice value generates commission
- Reassignment transfers past commission automatically
- Refund does not reverse commission
- Paid commission can never become recoverable
- A negative balance may automatically debit a personal bank account
- Historical commission may be recalculated using current rules
- Current FX rates may replace historical records
- Stakeholders may approve their own exceptions
- Manual commission edits may occur without audit
- Commission records may be hard-deleted
- Connect or Marketplace BDP financing requires monthly cash shortfall
- Recovery may occur from estimated or held commission
- Month 0 means calendar month rather than first earned-commission cycle
- Recoverable Balance is erased on exit or suspension

---

# PART X — UNRESOLVED ITEMS

## 74. Items Not Finalised

The following remain unresolved:

- Maximum Marketplace BDP Franchise Units per person
- Exact Marketplace BDP performance target schedule
- Split-commission percentages
- Duplicate-attribution evidence priority
- Transition-period commission rules
- Exact hold periods
- Exact suspension payout rules
- Residual commission after termination
- Exact legal order between TDS and finance recovery
- Recovery-waiver authority
- Direct bank recovery rules
- FX gain or loss ownership
- Payment-provider fee allocation
- Exact rounding policy
- Exact approval matrix
- Exact database enums and schemas
- Exact APIs and Supabase RLS
- Exact dashboard workflows
- Lead Assist commission
- Vendor Opportunity Fee distribution
- Advertising, premium-listing, sponsorship, training, technology, and ticketing commissions
- Any future Affiliate commission

Cursor and developers must not invent these rules.

---

## 75. Founder Approval Summary

| Area | Approved Rule |
|---|---|
| Connect BDP commission | 20% of Eligible Connect Subscription Revenue |
| Connect BDP direct fee | ₹50,000 |
| Connect BDP financed package | ₹60,000 |
| Connect BDP activation payment | ₹5,000 |
| Connect BDP Recoverable Balance | ₹55,000 |
| Connect BDP recovery cap | ₹5,000 per commission cycle |
| Connect BDP recovery start | Month 0 |
| Venue Partner | 80% of Eligible Marketplace Event Revenue |
| Marketplace BDP commission | 10% of Eligible Marketplace Event Revenue |
| GCE Marketplace net retained | 10% after standard MBDP commission |
| Marketplace BDP direct fee | ₹50,000 |
| Marketplace BDP financed package | ₹60,000 |
| Marketplace BDP activation payment | ₹5,000 |
| Marketplace BDP Recoverable Balance | ₹55,000 |
| Marketplace BDP recovery cap | ₹5,000 per commission cycle |
| Marketplace BDP recovery start | Month 0 |
| Marketplace BDP capacity | 20 active Venue Partners per unit |
| Enterprise BDP commission | 25% of Eligible GCE Platform Commission |
| Enterprise BDP finance | Preserved under FD-026 |
| Cash shortfall | Not required |
| Automatic bank debit | Prohibited |
| Affiliate | Future-only |
| ZBP | Removed |
| Refund treatment | Proportional revenue and commission reversal |
| Paid commission recovery | Recoverable Balance |
| Reassignment | Future earning events only by default |
| Historical rule changes | No silent recalculation |
| Multi-currency | Required capability |
| Non-approved revenue streams | Non-commissionable by default |

---

## 76. Decision Statement

GCE shall operate a central Commission Engine that calculates stakeholder entitlements only from approved Eligible Revenue or Platform Revenue bases, applies valid attribution, preserves rule versions, manages holds and recoveries, and determines settlement eligibility.

The Connect BDP earns 20% of Eligible GCE Connect Subscription Revenue.

The active Marketplace structure is:

```text
80% Venue Partner
10% Marketplace BDP
10% GCE net retained share
```

The Marketplace BDP commission is calculated as 10% of Eligible Marketplace Event Revenue and is paid from GCE’s existing 20% Marketplace Platform Commission.

Connect BDP and Marketplace BDP Franchise Units each support a Commission-Recovery Finance Option with:

```text
₹60,000 financed package
₹5,000 activation payment
₹55,000 Recoverable Balance
Recovery up to ₹5,000 per commission cycle
Recovery beginning from Month 0
No compulsory cash shortfall
No automatic personal-bank debit
```

Month 0 means the first earned-commission cycle after activation.

The Enterprise BDP continues to earn 25% of the Eligible GCE Platform Commission under FD-026, and its financed-pack structure remains unchanged.

No Affiliate commission is active. ZBP remains removed.

Revenue streams not explicitly approved as commissionable remain non-commissionable by default.

This decision remains active until explicitly amended or superseded by a later Founder Decision.

---

**End of FD-029**
