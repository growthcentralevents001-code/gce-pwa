# Payments

## Authority

**Wallet / internal ledgers:** `docs/founder-decisions/FD-020_Financial_and_Wallet_Architecture.md`
**Settlement eligibility & operations:** `docs/founder-decisions/FD-021_Settlement_Engine.md`
**Commercial amounts:** `36_Commercial_Constants.md`
**Revenue narrative:** `37_Revenue_Flow.md`

Where this file conflicts with FD-020 or FD-021, the Founder Decision wins.

### Founder-aligned payment/settlement principles (summary)

- User-facing **GCE Wallet** may be unified; internal accounting uses **separate ledgers** (Customer, Escrow, Settlement, Commission, Rewards, Refund, Franchise Recovery, Tax).
- A visible Wallet balance is **not** one undifferentiated accounting ledger.
- **Payment collection does not automatically mean settlement eligibility.**
- Membership settlement follows successful payment **and** membership activation (FD-021 / FD-022).
- Marketplace event settlement follows successful completion **and** the approved post-event hold (**48 hours** per FD-021).
- Enterprise may use the approved standard milestone model: **30% initial / 40% execution / 30% completion** (unless a separately approved contract specifies otherwise).
- Refunds, disputes, fraud reviews, and chargebacks may freeze, reverse, or adjust settlement.
- BDP commissions are separately calculated, recorded, and audited; **pending commission is not guaranteed payable**.
- Financial entries must not be silently edited or deleted; corrections use reversal/adjustment entries.
- RM and PRM do not automatically have financial movement authority.
- Exact tax rates, GST/TDS treatment, gateway provider, refund matrix: **Pending Legal/Accounting Review** or **Pending Technical Design** — do not invent.


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

Choose Membership

↓

Online Payment

↓

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

 Marketplace BDP Franchise
 Enterprise BDP Franchise
 Future Franchise Models

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

Certain franchise models include a mandatory training fee.

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

**Founder-approved standard milestone model (FD-021)** unless a separately approved contract specifies otherwise:

- **30%** Initial
- **40%** Execution
- **30%** Completion

Client payment to GCE does **not** by itself settle vendors. Settlement eligibility follows milestone completion conditions (FD-021).

Typical Flow

Quotation

↓

Approval

↓

Initial / Advance Payment (per milestone rules)

↓

Project Execution

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
 Future Affiliate Programs

The system automatically calculates commissions based on predefined business rules.

 Refund Policy

Refund eligibility depends on the service.

Examples

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
