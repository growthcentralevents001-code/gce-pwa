# AI Lead Assist Spec (Canonical)

## Purpose

This document is the **single source of truth** for GCE AI Lead Assist: objectives, lifecycle, fees, matching, Rainmaker / Pass Lead, ground verification, fairness rules, logging, and security.

Narrative partners:

- Historical explainer: `10_AI_Lead_Assist.md` (must defer here for rules)
- Broader AI engine rules: `22_AI_Rules.md` (must defer here for Lead Assist; may retain non–Lead Assist AI modules)

Commercial amounts: `36_Commercial_Constants.md`.
Circle context: `38_Circle_Architecture.md`.
Roles: `35_Role_Taxonomy.md`.

Always use vertical names **GCE Connect**, **GCE Marketplace**, **GCE Enterprise** when referring to lead sources or members.

---

## Objectives

AI Lead Assist is designed to (`10_AI_Lead_Assist.md`, `22_AI_Rules.md`):

- Generate verified business leads
- Eliminate fake enquiries
- Improve lead quality
- Match the right business with the right opportunity
- Reward active business contributors
- Increase business conversion
- Maintain transparency
- Prevent duplicate lead distribution
- Work **with** human verification (PRM, Members, Platform Admin) — AI does not replace human verification

---

## Lead sources (documented)

- GCE Public Website
- Mobile Application
- GCE Marketplace
- GCE Enterprise enquiries
- Referral Network
- QR Campaigns
- Advertisement Campaigns
- Partner Integrations

---

## End-to-end lifecycle

```text
Business Requirement Submitted (free)
        ↓
Identity Verification
        ↓
PRM Verification / Approval
        ↓
Validation Fee Payment
        ↓
AI Business Matching
        ↓
Rainmaker Selection
        ↓
Lead Assignment to Rainmaker Giver
        ↓
Pass Lead → Eligible non-competing Circle Member
        ↓
Ground Verification
        ↓
Genuine → business discussion + subscription credit
   or
Non-Genuine → reject / forfeit / flag / possible block
```

---

## Stage rules

### 1. Public requirement submission

User submits (free):

- Requirement
- Budget
- Location
- Timeline
- Contact details

### 2. Identity verification

Government ID proof examples documented: Aadhaar, Passport, Driving Licence, PAN (where applicable).

Purpose: prevent fake enquiries and spam; verify genuine users.

AI processes requirements only from verified users (email, mobile, ID where required) — `22_AI_Rules.md` Rule 1.

### 3. PRM validation

Platform Relationship Manager verifies:

- Requirement authenticity
- Budget
- Timeline
- Business category
- Required specialization
- Location
- Circle availability

Only verified requirements proceed.
AI **cannot** distribute leads until PRM approval (`22_AI_Rules.md` Rule 2).
PRM cannot assign leads manually outside system rules (`19_Permissions_Roles.md`).

### 4. Validation fee

After PRM approval, user pays validation fee:

- Amount: see `36_Commercial_Constants.md` (**₹500**)
- Without successful payment, AI does not process the request (`22_AI_Rules.md` Rule 3)
- After payment, lead becomes active

### 5. AI matching inputs

Documented factors include:

- Business Category / Type / Industry
- Business Tags
- Specialization Tags
- City / geographic priority
- Circle / member / category availability
- Member activity
- Internal Giving Score
- Referral history / contribution
- Performance score / historical performance
- Availability
- Business ranking
- Attendance
- Platform engagement

Tags are mandatory for accurate matching (`22_AI_Rules.md` Rule 5).
Only active circles participate (`22_AI_Rules.md` Rule 6).

### 6. Geographic priority

Documented order (`22_AI_Rules.md` Rule 7):

1. Same City
2. Nearby Areas
3. Same District
4. Same State (if required)

Nationwide intelligent matching: **Future**.

---

## Deficit Reward Model

From `10_AI_Lead_Assist.md`:

Instead of giving every lead to the highest-performing member, the system identifies members who:

- Frequently give referrals
- Actively participate
- Receive comparatively fewer business opportunities

These members receive priority. This is the **Deficit Reward Model**.

---

## Business priority when multiple qualify

From `22_AI_Rules.md` Rule 13, when multiple businesses qualify, AI considers:

- Tag match
- Specialization match
- Location
- Availability
- Circle participation
- Historical performance

The best match receives higher priority.

### Documented tension (do not silently drop either rule)

Both of the following are documented:

1. **Deficit Reward Model** prioritizing high-givers who receive fewer opportunities (`10_AI_Lead_Assist.md`)
2. **Rule 13** prioritizing best match including historical performance (`22_AI_Rules.md`)

Fair distribution also requires preventing repeated allocation to the same members (`22_AI_Rules.md` Rule 14).

**Implementation must preserve all three intents.** Exact weighting between Deficit Reward and historical-performance priority is **not numerically documented** and requires product clarification — do not invent weights.

---

## Rainmaker Giver

The selected member is the **Rainmaker Giver**.

Responsibilities (`10_AI_Lead_Assist.md`):

- Review the business requirement
- Verify relevance
- Pass the lead to the most suitable **non-competing** member within the circle

Selection considerations (`22_AI_Rules.md` Rule 8):

- Internal Giving Activity
- Referral Contribution
- Business Participation
- Platform Engagement

---

## Pass Lead workflow

```text
Rainmaker Giver
  ↓
PASS LEAD
  ↓
Eligible Circle Member
  ↓
Business Discussion
  ↓
Project Conversion
  ↓
Business Transaction
```

AI records (`22_AI_Rules.md` Rule 9):

- Who received the lead
- When it was passed
- Final recipient
- Current status

---

## Ground verification

Receiving member verifies outcome:

### Genuine lead

- Lead accepted
- Business discussion starts
- Member receives **₹500 Subscription Credit** (`10_AI_Lead_Assist.md`; also listed in `36_Commercial_Constants.md`)

### Non-genuine lead

- Lead rejected
- User account flagged
- ₹500 Validation Fee forfeited
- User ID blocked after repeated violations

Feedback improves future AI decisions (`22_AI_Rules.md` Rule 10).

---

## Fraud detection

AI continuously detects (`22_AI_Rules.md` Rule 11):

- Fake users
- Duplicate accounts
- Fake business leads
- Spam requests
- Suspicious activities

Fraudulent requests are flagged for review.

---

## Manual override

Stakeholders cannot manually override (`22_AI_Rules.md` Rule 15):

- AI Matching
- Rainmaker Selection
- Lead Priority

**Only Platform Admins** may intervene in exceptional circumstances.

---

## Logging (mandatory)

Every AI decision is recorded (`22_AI_Rules.md` Rule 16), including:

- Requirement ID
- User ID
- PRM Approval
- Validation Status
- Matching Result
- Rainmaker Selected
- Lead Receiver
- Final Status
- Timestamp

---

## Metrics

Tracked (`22_AI_Rules.md` Rule 17; `23_Analytics_Reports.md`):

- Total / verified / converted / rejected leads
- Average response time
- Conversion rate
- Fraud detection rate
- Member participation
- Rainmaker performance
- Validation fee revenue (analytics)

---

## Notifications

AI generates notifications for (`22_AI_Rules.md` Rule 18):

- Lead Assigned / Passed / Verified / Rejected
- Validation Pending
- Payment Pending

---

## Dashboard modules (documented)

From `10_AI_Lead_Assist.md`:

- New Leads, Assigned Leads, Passed Leads
- Lead Status, Lead Verification, Lead History
- AI Recommendations, Business Matching Score
- Subscription Credit, Analytics

Role access summary: `19_Permissions_Roles.md` / `35_Role_Taxonomy.md` (Admin full; PRM full; partners view; Member use; User submit; Venue no).

---

## Related AI modules (not expanded here)

`22_AI_Rules.md` also lists: Business Matching, Circle Matching, Tag Matching, Rainmaker Engine, Lead Verification, Referral Intelligence; Recommendations / Analytics (**Future**).

Future Lead Assist–adjacent features (Rule 19): AI business recommendations, smart event suggestions, referral prediction, opportunity forecasting, personalized networking, performance ranking, predictive analytics.

---

## Security

AI Lead Assist follows platform security standards (`22_AI_Rules.md`): verified identity, JWT authentication, RBAC, audit logs, fraud detection, secure API access, encrypted communication.

---

## Cross References

- Commercial amounts: `36_Commercial_Constants.md`
- Circles: `38_Circle_Architecture.md`
- Roles: `35_Role_Taxonomy.md`
- Memberships: `05_Memberships.md`
- PRM role: `03_Stakeholders.md`, `19_Permissions_Roles.md`
- Payments: `21_Payments.md`
- Analytics: `23_Analytics_Reports.md`
- Historical narrative: `10_AI_Lead_Assist.md`
- Broader AI rules: `22_AI_Rules.md`
