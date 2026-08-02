# Payments

## Authority

**Wallet / internal ledgers:** `docs/founder-decisions/FD-020_Financial_and_Wallet_Architecture.md`
**Settlement eligibility & operations:** `docs/founder-decisions/FD-021_Settlement_Engine.md`
**Connect BDP Franchise Unit fee / commission commercial rules:** `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`
**GCE Enterprise Franchise Pack / commission / payment commercial rules:** `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md`
**Membership commercial (tiers, Tags, transfers, refunds):** `docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md`
**Revenue recognition / commercial classification:** `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md`
**Commercial amounts:** `36_Commercial_Constants.md`
**Revenue narrative:** `37_Revenue_Flow.md`

Where this file conflicts with FD-020, FD-021, FD-025, FD-026, FD-027, or FD-028, the Founder Decision wins — for recognition and commercial classification, **FD-028**.

### Founder-aligned payment/settlement principles (summary)

- Keep **Gross Transaction Value**, **Collected Amount**, **Eligible Revenue**, **Platform Revenue**, and **Settlement-Eligible Amount** separate (FD-028).
- User-facing **GCE Wallet** may be unified; internal accounting uses **separate ledgers** (Customer, Escrow, Settlement, Commission, Rewards, Refund, Franchise Recovery, Tax). A wallet credit is **not** automatically revenue.
- A visible Wallet balance is **not** one undifferentiated accounting ledger.
- **Payment collection does not automatically mean settlement eligibility** or earned Platform Revenue.
- Membership / Tag recognition requires successful payment **and** activation (FD-021 / FD-022 / FD-028). Collected but unactivated remains collected-but-unearned and non-commissionable.
- Marketplace event settlement follows successful completion **and** the approved post-event hold (**48 hours** per FD-021). Active Marketplace split: **80% Venue Partner / 20% GCE** of Eligible Marketplace Revenue. Affiliate commission is **not active** (FD-028).
- Enterprise may use the approved standard milestone model: **30% confirmation / 40% readiness-or-execution / 30% completion** (unless a separately approved contract specifies otherwise) (FD-021 / FD-026). Proposal value is not revenue.
- Refunds reverse Eligible Revenue, Platform Revenue, and stakeholder commission proportionally; paid commission creates **Recoverable Balance**. Chargebacks place amount on hold/reversal and may create recovery (FD-028).
- BDP commissions are separately calculated, recorded, and audited; distinguish Estimated / Earned / Settlement eligible / Paid / Recoverable — **pending commission is not guaranteed payable**.
- Enterprise BDP commission is flat **25%** of eligible GCE platform commission (FD-026); Enterprise financed-pack recovery deducts from earned and approved Enterprise BDP commission only (recoverable balance ≠ event revenue).
- GST/TDS recorded separately and excluded from Platform Revenue / commission bases unless separately approved; exact rates Pending Tax Review.
- Revenue normally via approved platform-connected channels; no personal-account collection; cash is not a standard launch workflow (FD-028).
- Financial entries must not be silently edited or hard-deleted; corrections use reversal/adjustment entries with rule-version linkage (FD-020 / FD-028).
- Multi-currency-capable architecture required; INR may be initial domestic/reporting currency — not permanently INR-only (FD-028).
- RM and PRM do not automatically have financial movement authority.
- Exact tax rates, GST/TDS treatment, gateway provider, refund matrix, FX, rounding: **Pending Legal/Accounting/Tax Review** or **Pending Technical Design** — do not invent.
- Marketplace BDP fee model and Lead Assist commercial activation remain unresolved under FD-028.
- **ZBP** security deposit / commission examples are obsolete (FD-028). Refundable deposits are liabilities, not revenue.


Overview

The GCE platform includes a centralized payment management system that securely handles all financial transactions across the ecosystem.

The payment system supports memberships, event bookings, **GCE Marketplace** transactions, **GCE Enterprise** projects, franchise fees, validation fees, and future walletbased transactions.

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
 Event Bookings
 Marketplace Orders
 Validation Fees (AI Lead Assist)
 Franchise Fees
 Training Fees
 Enterprise Projects
 Future Subscription Services

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

Choose Associate Tier (launch) / optional Tag 3–4 (FD-027)

↓

Online Payment (platform only)

↓

Membership Activation (when conditions met)

↓

Separate Circle Seat Reservation / Allocation

↓

Dashboard Update

Membership payments may also include Tag 3 / Tag 4 add-ons and, when Core is offered after eligibility, Core upgrade/renewal payments. Transfer administrative fees (₹1,000 + tax after the first free transfer in 12 months) are separate and not automatically commissionable to Connect BDP (FD-027).

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

AI Lead Assist requires a validation fee before lead processing.

Flow

Business Requirement

↓

PRM Verification

↓

Validation Fee amount: **`36_Commercial_Constants.md`** / **`39_AI_Lead_Assist_Spec.md`**

↓

Payment Success

↓

AI Matching

↓

Lead Distribution

 Franchise Payments

Applicable for:

 Connect BDP Franchise Unit (₹50,000 per Franchise Unit — FD-025; deferred finance not active under FD-025)
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

Connect BDP Franchise Activation Fee package inclusions (training and platform support) are defined in FD-025. Connect BDP deferred finance is **not active** under FD-025. Do not treat Marketplace/Enterprise finance-option language as applying to Connect BDP launch terms.

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

**Founder-approved standard milestone model (FD-021 / FD-026)** unless a separately approved contract specifies otherwise:

- **30%** Project confirmation
- **40%** Approved readiness or execution milestone
- **30%** Completion

Client payment to GCE does **not** by itself settle vendors, earn Enterprise BDP commission, or earn Vendor Opportunity Fee. Settlement eligibility follows milestone completion conditions (FD-021 / FD-026).

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
 AI Lead Credits
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
