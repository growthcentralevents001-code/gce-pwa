# Payments

## Authority

**Wallet / internal ledgers:** `docs/founder-decisions/FD-020_Financial_and_Wallet_Architecture.md`
**Settlement eligibility & operations:** `docs/founder-decisions/FD-021_Settlement_Engine.md`
**Connect BDP Franchise Unit fee / commission commercial rules:** `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`
**GCE Enterprise Franchise Pack / commission / payment commercial rules:** `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md`
**Membership commercial (tiers, Tags, transfers, refunds):** `docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md`
**Membership approval / attribution / allocation:** `docs/founder-decisions/FD-036_GCE_Membership_Attribution_Approval_and_Allocation_Authority.md`
**Revenue recognition / commercial classification:** `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md`
**Commission Engine / stakeholder entitlement / BDP finance recovery:** `docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md`
**Marketplace BDP operating architecture:** `docs/founder-decisions/FD-033_GCE_Marketplace_BDP_Commercial_and_Operating_Architecture.md`
**Marketplace transaction / unattributed revenue / payout direction:** `docs/founder-decisions/FD-037_GCE_Marketplace_Transaction_Approval_and_Unattributed_Revenue_Rules.md`
**Enterprise cross-vertical / quotation / Finance co-sign / milestones:** `docs/founder-decisions/FD-038_GCE_Enterprise_Cross_Vertical_Commercial_and_Approval_Rules.md`
**Phase 2 commercial acceptance / Marketplace ticket MoR direction / BDP pack payments / cancellation / compliance gates:** `docs/founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md`
**Narrow supersession / status mapping:** `docs/founder-decisions/FD-032_Phase_1_Authority_Status_Mapping_and_Supersession_Clarification.md`
**Corporate / payment-receiving entity principles:** `docs/founder-decisions/FD-034_Logixia_and_GCE_Corporate_Platform_Constitution.md`
**AI Lead Assist / Lead Intelligence commercial boundaries:** `docs/founder-decisions/FD-031_GCE_Connect_AI_Lead_Assist_Architecture.md` / `39_AI_Lead_Assist_Spec.md`
**Commercial amounts:** `36_Commercial_Constants.md`
**Revenue narrative:** `37_Revenue_Flow.md`

Where this file conflicts with FD-020 through FD-039, the Founder Decision wins — for recognition **FD-028**; for commission/entitlement/recovery/Marketplace attributed 80/10/10 **FD-029**; for unattributed Marketplace 80/0/20 and payout direction **FD-037**; for Marketplace BDP ops **FD-033**; for membership attribution **FD-036**; for Enterprise Finance co-sign / project-specific milestones / no-double-commission **FD-038**; for Circle fee collection / unauthorised Circle bank accounts / workshop payment channels **FD-030**; for Lead Assist payment gates and Core Lead Rights **FD-031**; for legal-entity / payment-receiving principles **FD-034**; for **Marketplace ticket MoR business direction, 48-hour cancellation default, BDP pack online/offline payment rules, and money-movement compliance gates** **FD-039**.

### Founder-aligned payment/settlement principles (summary)

- Keep **Gross Transaction Value**, **Collected Amount**, **Eligible Revenue**, **Platform Revenue**, and **Settlement-Eligible Amount** separate (FD-028).
- Commission states: Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed / Recoverable Balance (FD-029) — not interchangeable; no generic “earnings” collapse.
- User-facing **GCE Wallet** may be unified; internal accounting uses **separate ledgers**. A wallet credit is **not** automatically revenue; wallets may show negative Recoverable Balance without automatic personal-bank debit. Wallet cash-out / consumer withdrawals remain **inactive** until later Founder approval (FD-039).
- **Payment collection does not automatically mean settlement eligibility** or earned Platform Revenue / commission.
- Membership / Tag recognition requires successful payment **and** activation (FD-021 / FD-022 / FD-028). Collected but unactivated remains collected-but-unearned and non-commissionable. Payment does not guarantee a specific Circle seat; activation and Circle allocation are separate (FD-036). Organic/unattributed memberships create no Connect BDP commission entitlement.
- Marketplace event settlement follows successful completion **and** the approved post-event hold (**48 hours** per FD-021). With valid MBDP attribution: **80% Venue Partner / 10% Marketplace BDP / 10% GCE net**; without: **80% / 0% / 20%** (FD-029 / FD-037). Affiliate commission is **not active**. Launch Venue Partner payout: monthly Platform-initiated batch; architecture must remain configurable (FD-037). Offer Claim is not revenue.
- **Merchant of Record (Marketplace event tickets):** Logixia Solutions Private Limited is the **intended MoR** — Logixia/GCE collects customer ticket payment through the approved platform payment architecture, then settles Venue Partner and Marketplace BDP entitlements under approved rules (FD-039). Do **not** describe ticket MoR as fully undecided. GST treatment, invoice structure, payment-gateway account/configuration, refund accounting, TDS/withholding, settlement compliance, and payment-aggregator applicability remain **Pending Legal / Tax / Finance / Payment validation** before production money movement — do not invent rates or reopen the MoR business direction.
- Default Marketplace event **customer cancellation cutoff** = **48 hours before event start** (FD-039). Approved event-specific policy may differ if clearly disclosed before purchase, approved, operationally reasonable, and legally permitted. FD-039 does **not** define refund %, refund timeline, convenience-fee treatment, chargeback handling, or no-show treatment — those remain pending applicable refund/Finance/Tax/Legal/Product policy.
- Enterprise milestones are **project-specific and negotiated** (FD-038). An illustrative 30/40/30 pattern may appear in older narrative but is not a fixed universal rule. Proposal value is not revenue. Enterprise BDP = **25% of eligible GCE Platform Commission** (not project value). Quotations above **₹5,00,000** require Finance co-sign (approval threshold only — FD-038).
- Connect BDP / Marketplace BDP Commission-Recovery Finance Options: recovery only from earned and approved commission from **Month 0**; max ₹5,000/cycle; no cash shortfall; no auto bank debit (FD-029). Connect finance supersedes FD-025 finance-inactive only.
- **BDP commercial pack / Franchise Unit payments:** online through the approved platform payment architecture is the **default**. Rare offline bank-based payment (NEFT / RTGS / cheque / other approved bank method) may be accepted only via authorised Admin-recorded workflow with payer identity, BDP type, package/unit, amount, date, bank reference, payment proof, recording Admin, approving Admin where required, reconciliation status, activation status, and audit trail (FD-039). **Cash is not a normal activation method.**
- Refunds reverse Eligible Revenue, Platform Revenue, and stakeholder commission proportionally; paid commission creates **Recoverable Balance**. Chargebacks place amount on hold/reversal and may create recovery (FD-029).
- BDP commissions are platform-calculated; no stakeholder may approve their own commission-affecting exception. Historical earned commission is not automatically transferred on reassignment.
- GST/TDS recorded separately and excluded from Platform Revenue / commission bases unless separately approved; exact rates Pending Tax Review.
- Revenue normally via approved platform-connected channels; no personal-account collection; cash is not a standard launch workflow (FD-028 / FD-039). No unauthorised Circle bank account or personal fee collection for Circle membership/workshops (FD-030). Workshop payments use approved platform channels; Connect BDP does not automatically earn 20% of workshop revenue (FD-030).
- Financial/commission entries must not be silently edited or hard-deleted; corrections use reversal/adjustment entries with rule-version linkage (FD-020 / FD-028 / FD-029).
- Multi-currency-capable architecture required; preserve original-currency and FX history for commission records (FD-028 / FD-029). Multi-currency **go-live** remains inactive until later approval (FD-039).
- RM and PRM do not automatically have financial movement authority.
- Exact tax rates, GST/TDS treatment, refund matrices (beyond proportional reversal principles), FX, rounding, hold periods: **Pending Legal/Accounting/Tax Review** or **Pending Technical Design** — do not invent. Razorpay may be the preferred India-launch PSP **candidate** (Technical Architecture default) but production activation remains gated by MoR implementation validation and related tax/payment compliance (FD-039) — do not treat Razorpay as immutable Founder business law.
- Subject to Legal / Tax / Banking / provider approval, platform payments should ordinarily be received by **Logixia Solutions Private Limited**; GCE may appear as the platform brand on customer-facing surfaces; invoices where Logixia is supplier should ordinarily identify Logixia as legal issuer (FD-034 / FD-039). Collected funds are **not** automatically Logixia revenue (Venue share, BDP entitlement, tax, deposits, advances remain distinct).
- No BDP, member, Venue Partner, or Governing Body member may personally collect platform money unless expressly authorised (FD-033 / FD-034).
- Lead Assist: ordinary referral give/receive is **not** Stage-1 payment-gated; optional Pro / verification / Expert Selection / Managed Opportunity fees and any success-fee model remain **Unresolved / inactive** (FD-031 / FD-032 / FD-039). No automatic success fee in Stage 1. **ZBP** is obsolete (FD-028 / FD-029 / FD-032). Refundable deposits are liabilities, not revenue.
- **Architecture may proceed** while money-movement go-live remains compliance-gated (FD-039). Do not treat pending GST/invoice/gateway/TDS validation as a reason to stop Phase 2 Technical Architecture unless the technical model itself must change.


Overview

The GCE platform includes a centralized payment management system that securely handles all financial transactions across the ecosystem.

The payment system supports memberships, event bookings, **GCE Marketplace** transactions, **GCE Enterprise** projects, franchise fees, optional Lead Assist paid products (when activated under FD-031), and future walletbased transactions.

All payments are processed through secure payment gateways and automatically recorded for reporting and auditing.

 Payment Objectives

The payment system is designed to:

 Process secure online payments
 Automate revenue collection
 Track all financial transactions
 Generate payment history
 Support stakeholder commissions
 Maintain financial transparency
 Enable future wallet integration

 Supported Payment Types

The platform supports payments for:

 Membership Fees
 Event Bookings / Event Transactions
 Marketplace Offer Claims / Redemptions (claim ≠ revenue — FD-037)
 Optional Lead Assist paid products (Pro / verification / Expert / Managed — Unresolved; not a gate on ordinary referrals — FD-031)
 Franchise Fees
 Training Fees
 Enterprise Projects
 Future Subscription Services

(Do not use “Marketplace Orders” as an undefined umbrella for unlike Marketplace flows — FD-037.)

 Payment Workflow

User

↓

Select Service

↓

Payment Gateway

↓

Payment Verification

↓

Database Update

↓

Notification

↓

Invoice Generation

↓

Dashboard Update

 Membership Payments

Payment Flow

User

↓

Choose Associate Tier (launch) / optional Tag 3–4 (after category/Tag/geo/seat check — FD-027 / FD-036)

↓

Online Payment (platform only — does not guarantee a specific Circle seat)

↓

Membership Activation (when platform conditions met; may be Active pending allocation)

↓

Separate Circle Allocation (System proposes → Connect BDP assists → Platform confirms)

↓

Connect BDP attribution confirmation (organic/unattributed allowed)

↓

Dashboard Update

Membership payments may also include Tag 3 / Tag 4 add-ons and, when Core is offered after eligibility, Core upgrade/renewal payments. Transfer administrative fees (₹1,000 + tax after the first free transfer in 12 months) are separate and not automatically commissionable to Connect BDP (FD-027). Circle transfer does not automatically transfer Connect BDP attribution (FD-036).

Membership Activated

↓

Receipt Generated

↓

Dashboard Updated

 Event Booking Payments

Flow

Select Event

↓

Book Ticket

↓

Online Payment

↓

QR Ticket Generated

↓

Booking Confirmed

 Marketplace Payments

Marketplace payment flow:

Customer

↓

Select Offer / Event

↓

Payment

↓

Venue Partner

↓

Revenue Distribution

↓

Reports

 AI Lead Assist Payment

Authority: **FD-031** / `39_AI_Lead_Assist_Spec.md`.

Lead Assist payment is **not** a Stage-1 gate on ordinary eligible referrals. Core Lead Rights (give/receive ordinary referral, Accept/Decline/Clarify/Duplicate/Invalid/Collaborate, Dual-Confirmed Closed Business) must not require purchase.

Optional paid products — Lead Assist Pro, enhanced verification, Expert Selection, Managed Opportunity — and any success-fee / commission model remain **Unresolved**. Stage 1 has **no automatic success fee**. Exact amounts: `36_Commercial_Constants.md` (defers to FD-031 / FD-028).

When an optional paid product is activated and collected, payment follows the standard gateway → reconciliation → recognition path (FD-020 / FD-021 / FD-028); collection alone does not create Lead Assist commission (FD-029 / FD-031).

 Franchise Payments

Applicable for:

 Connect BDP Franchise Unit (₹50,000 direct or financed ₹60,000 — FD-029; supersedes FD-025 finance-inactive only)
 Marketplace BDP Franchise
 Enterprise BDP Franchise Pack (₹30,000 direct per pack, or financed ₹36,000 with ₹5,000 initial + ₹31,000 recoverable from approved commission only — FD-026; no launch discount)

Flow

Application

↓

Approval

↓

Franchise Fee Payment

↓

Agreement

↓

Dashboard Activation

 Training Fee

Certain franchise models (for example Marketplace BDP) include a mandatory training fee under their documented finance package.

Connect BDP Franchise Activation Fee package inclusions (training and platform support) are defined in FD-025. The Connect BDP **Commission-Recovery Finance Option is active under FD-029** (₹60,000 total; ₹5,000 initial; ₹55,000 Recoverable Balance; max ₹5,000 per eligible commission cycle from Month 0) — FD-029 supersedes only FD-025’s prior “deferred finance inactive” position (confirmed by FD-032). Do not invent Marketplace/Enterprise finance terms for Connect beyond FD-029.

Enterprise BDP may use the Founder-approved financed Franchise Pack (₹36,000 total; ₹5,000 initial; ₹31,000 recoverable from earned and approved Enterprise BDP commission only, up to ₹5,000 per month). Recovery does not create an automatic monthly cash-shortfall demand. Exit does not automatically erase the balance (FD-026).

Flow

Registration

↓

Training Fee Payment

↓

Training Completion

↓

Business Activation

 Enterprise Payments

Enterprise projects follow milestone-based payments.

**Milestones are project-specific and negotiated** (FD-038). There is no universal mandatory advance/mid/final percentage structure for all Enterprise projects. Store the approved milestone schedule per project. An illustrative historical pattern of **30%** confirmation / **40%** readiness-or-execution / **30%** completion may appear in older FD-021 / FD-026 narrative but is **not** a fixed universal rule.

Quotations above **₹5,00,000** total proposed project value require Finance co-sign before final issue (approval threshold only — FD-038). Enterprise BDP alone may not issue binding quotations.

Client payment to GCE does **not** by itself settle vendors, earn Enterprise BDP commission, or earn Vendor Opportunity Fee. Settlement eligibility follows milestone completion conditions (FD-021 / FD-026 / FD-038). Componentise cross-vertical venue/vendor amounts — no double commission on the same revenue component (FD-037 / FD-038).

Typical Flow

Quotation

↓

Approval

↓

Initial / Advance Payment (per milestone rules)

↓

Vendor-Led Physical Execution (GCE coordinates digitally — FD-026)

↓

Final Payment

↓

Project Completion

 Payment Methods

Supported methods include:

 UPI
 Credit Card
 Debit Card
 Net Banking
 Wallets
 QR Payments

Future:

 EMI
 BNPL (Buy Now Pay Later)
 International Payments

 Payment Status

Every payment has one of the following statuses:

 Pending
 Processing
 Successful
 Failed
 Refunded
 Cancelled

 Payment History

Every user has access to payment history.

Information includes:

 Transaction ID
 Date
 Amount
 Payment Method
 Payment Status
 Invoice
 Receipt

 Revenue Distribution

 GCE Marketplace Model

Revenue Split

Venue Partner / GCE Platform split: **`36_Commercial_Constants.md`** (GCE Marketplace revenue share).

Revenue is automatically calculated and recorded.

 Commission Distribution

Applicable for:

 Connect BDP
 Marketplace BDP
 Enterprise BDP
 Future Affiliate Programs (future-only — no active Affiliate commission under FD-028)

The system automatically calculates commissions based on predefined business rules.

 Refund Policy

Refund eligibility depends on the service.

Membership (FD-027):

- Before activation, refund may be considered for GCE rejection, inability to provide approved seat or activate service, duplicate payment, or billing error.
- After activation, membership is normally **non-refundable**.
- Exact membership refund matrix remains Pending Founder and Legal Approval.

Other examples:

 Event Cancellation
 Duplicate Payment
 Failed Booking
 Approved Refund Request

Refunds are processed through the original payment method.

 Invoices

Every successful payment generates:

 Digital Invoice
 Payment Receipt
 Transaction Number
 GST Details (Future)

Invoices can be downloaded from the dashboard.

 Payment Security

Security measures include:

 SSL Encryption
 Secure Payment Gateway
 Webhook Verification
 Transaction Validation
 Audit Logging

The platform never stores card details.

 GCE Wallet (user-facing; internal ledgers per FD-020)

The GCE Wallet will support:

 Membership Credits
 Optional Lead Assist credits (only if an approved paid product uses them — Unresolved under FD-031)
 Referral Rewards
 Cashback
 Subscription Credits
 Refund Balance

Wallet balance can be used for future platform payments.

 Payment Notifications

Users receive notifications for:

 Payment Success
 Payment Failure
 Refund Initiated
 Refund Completed
 Invoice Generated
 Membership Activated
 Booking Confirmed

 Payment Reports

Financial reports include:

 Daily Revenue
 Monthly Revenue
 Yearly Revenue
 Membership Revenue
 Marketplace Revenue
 Enterprise Revenue
 Franchise Revenue
 Commission Reports

 Admin Controls

Platform Admin can:

 View All Transactions
 Search Payments
 Filter Transactions
 Export Reports
 Process Refund Requests
 Monitor Revenue
 View Failed Payments

 API Endpoints

Example payment APIs:

\`\`\`
POST   /api/payments/create
POST   /api/payments/verify
POST   /api/payments/refund
GET    /api/payments/history
GET    /api/payments/invoice/{id}
GET    /api/payments/reports
\`\`\`

 Future Enhancements

Planned payment features:

 Wallet System
 Auto Payouts
 Subscription AutoRenewal
 EMI Support
 International Payments
 MultiCurrency Support
 GST Invoice Automation
 Financial Analytics Dashboard

 LongTerm Vision

The GCE Payment System is designed to serve as the financial backbone of the platform.

It securely manages all monetary transactions across memberships, events, marketplace operations, enterprise projects, AI Lead Assist, and franchise programs while ensuring transparency, automation, compliance, and scalability for every stakeholder in the GCE ecosystem.
