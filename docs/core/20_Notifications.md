# Notifications

## Authority

**FD-022** — membership lifecycle notification *events* (seat reservation, renewal window, grace, freeze, suspension, reinstatement, transfer, rejoining). Exact channels, copy, and schedules beyond Founder-approved timing rules remain **Pending Technical Design** / Notification Architecture.
**FD-024** — Circle lifecycle notifications must not imply Connect BDP independent activation.
**FD-030** — Circle governance / attendance / verification notifications must not imply Governing Body independent membership approval/termination, or that visitor attendance reserves a seat.
**FD-025** — Connect BDP Franchise Unit milestone, performance-review, expansion, and commission notifications must not imply guaranteed income or automatic cancellation.
**FD-027** — Membership commercial notifications (renewal, grace, freeze seat-protection up to 30 days recommended, transfer, Core Progress) must not imply guaranteed referrals/nationwide access or invent Core thresholds.
**FD-026** — Enterprise Franchise Pack target, finance-recovery, attribution/dormancy, Platform Expert assignment, and commission notifications must not imply guaranteed income, territory ownership, or automatic cancellation.
**FD-023** — notifications are role- and permission-scoped.
**FD-001** — one account; role-based delivery.

Founder-approved timing already fixed elsewhere: seat reservation **7 days**; renewal communication begins **30 days** before expiry; grace **30 days**. Do not invent additional SLAs.

---

Overview

The GCE platform includes a centralized notification system to keep every stakeholder informed about important business activities, transactions, approvals, meetings, payments, leads, and system updates.

Notifications are rolebased and delivered in realtime to ensure timely actions and improved user engagement.

 Notification Objectives

The notification system is designed to:

 Keep users informed
 Improve business communication
 Increase user engagement
 Reduce missed actions
 Support realtime business operations
 Improve customer experience

 Notification Channels

The platform supports multiple notification channels.

 InApp Notifications
 Push Notifications (PWA)
 Email Notifications
 SMS Notifications
 WhatsApp Notifications (Future)

 Notification Types

The platform generates notifications for:

 Information
 Success
 Warning
 Error
 Reminder
 Action Required

 User Notifications

Users receive notifications for:

 Account Registration
 Email Verification
 Mobile Verification
 Membership Purchase / Activation
 Membership Expiry
 Membership Renewal Reminder
 Membership Grace Period
 Seat Reservation / Waitlist (when applicable)
 Event Booking
 QR Ticket Generation
 Payment Success
 Payment Failure
 AI Lead Status
 Marketplace Offers
 Profile Updates

 Circle Member Notifications

Members / GCE Connect Members may receive notifications for (FD-022 aligned concepts; channels **Pending Technical Design**):

 Upcoming Meetings
 Referral Received
 Referral Given
 AI Lead Assigned
 Membership Renewal (communication begins **30 days** before expiry)
 Membership Grace Period started / ending
 Membership Freeze approved / ended
 Membership Suspension / Reinstatement
 Membership Transfer status
 Rejoining status
 Circle Seat Reserved
 Circle Seat Reservation Expiring
 Circle Seat Allocated / Waitlist Update
 Circle Announcements
 Business Ranking Updates
 Attendance Reminders

 Venue Partner Notifications

Venue Partners receive notifications for:

 New Booking
 Booking Cancellation
 Offer Performance
 Event Approval
 Event Booking
 Revenue Updates
 Customer Reviews
 Business Verification

 Connect BDP Notifications

Connect BDPs receive notifications for:

 New Member Registration
 Membership Sales / Eligible Subscription Activity
 Franchise Unit Milestone Progress (5 activated Circles / 10 months — FD-025)
 Commission Updates (subject to settlement eligibility; not guaranteed income)
 Circle Creation Request / Formation Status (platform activation required — FD-024)
 Franchise Unit Updates / Expansion Reservation Status
 Performance Review / Corrective-Plan Notices (missing consecutive milestones does not auto-cancel)

 Marketplace BDP Notifications

Marketplace BDPs receive notifications for:

 New Venue Partner
 Marketplace Revenue
 Offer Campaign Performance
 Franchise Performance
 Commission Updates
 Monthly Revenue Target

 Enterprise BDP Notifications

Enterprise BDPs receive notifications for:

 New Enterprise Lead / Attribution Events
 Client Approval
 Quotation / Proposal Status
 Vendor / Venue Confirmation (via Platform Expert workflow)
 Project Status / Readiness / Completion Evidence
 Franchise Pack Target Progress (₹3L monthly / ₹9L rolling)
 Commission Updates (subject to settlement eligibility; not guaranteed)
 Finance Recovery Deductions (financed pack, where applicable)
 Performance Review / Corrective-Plan Notices
 Dormancy / Reassignment Review Notices

 PRM Notifications

Platform Relationship Managers receive notifications for:

 New AI Lead Request
 ID Verification Pending
 Lead Verification Required
 Payment Confirmation
 Lead Approval
 Lead Rejection

 RM Notifications

Relationship Managers receive notifications for:

 Member Support Request
 FollowUp Reminder
 Scheduled Meeting
 Issue Resolution
 Customer Feedback

 Board of Governance / Governing Body Notifications

Governing Body members receive notifications for:

 Member Recommendation / Escalation (platform decides approval / activation / termination — FD-030)
 Attendance Reports (75% expected physical attendance thresholds — FD-030)
 Governance Requests
 Member Complaints
 Circle Announcements
 Meeting Prep / Post-Meeting Summaries (GCE Phygital Circle Meeting Framework)

 Platform Admin Notifications

Admins receive notifications for:

 New User Registration
 Membership Sales
 Revenue Reports
 Payment Failures
 System Errors
 Security Alerts
 AI Lead Activity
 Enterprise Activity
 Marketplace Activity

 System Notifications

The platform automatically generates notifications for:

 Login Alerts
 Password Reset
 Account Verification
 Profile Completion
 Dashboard Updates
 Platform Maintenance
 New Features
 Security Updates

 Notification Priority

Notifications are categorized by priority.

 High Priority

 Payment Failure
 Security Alert
 AI Lead Assignment
 Enterprise Approval
 System Error

 Medium Priority

 Meeting Reminder
 Membership Renewal
 Event Reminder
 Booking Confirmation

 Low Priority

 New Features
 General Announcements
 Tips & Updates

 Notification Status

Each notification includes a status.

 Unread
 Read
 Archived
 Deleted

Users can manage notification history from their dashboard.

 Notification Settings

Users can customize notification preferences.

Options include:

 Enable/Disable Push Notifications
 Email Notifications
 SMS Notifications
 WhatsApp Notifications (Future)
 Marketing Notifications
 Event Reminders
 Business Alerts

 RealTime Notifications

The platform supports realtime notifications for:

 AI Lead Assignment
 New Booking
 Payment Success
 Referral Received
 Enterprise Updates
 Offer Redemption
 Revenue Updates

 Notification Retention

Notifications are stored for future reference.

Retention includes:

 Recent Notifications
 Notification History
 Search
 Filter by Type
 Filter by Date

 API Endpoints

Example notification APIs:

\`\`\`
GET    /api/notifications
GET    /api/notifications/unread
PUT    /api/notifications/read
PUT    /api/notifications/readall
DELETE /api/notifications/{id}
POST   /api/notifications/push
\`\`\`

 Future Enhancements

Planned notification features include:

 AI Smart Notifications
 GeoBased Notifications
 Scheduled Notifications
 Voice Notifications
 WhatsApp Business Integration
 Telegram Integration
 Smart Reminder Engine

 LongTerm Vision

The GCE Notification System is designed to become a centralized communication engine that delivers timely, relevant, and role-based information to every stakeholder.

By combining realtime alerts, intelligent reminders, and multichannel communication, the notification system ensures that users never miss important business opportunities, meetings, payments, leads, or platform activities.
