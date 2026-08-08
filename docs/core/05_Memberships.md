# Memberships

## Authority

**Highest authority for GCE Connect Circle Membership commercial and operating rules:**
`docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md`

**Highest authority for membership approval, activation vs Circle allocation, Connect BDP attribution, RM, waitlist, transfer, geographic routing:**
`docs/founder-decisions/FD-036_GCE_Membership_Attribution_Approval_and_Allocation_Authority.md`

**Highest authority for membership lifecycle timing/state concepts:**
`docs/founder-decisions/FD-022_Membership_Lifecycle.md`

**Related:** FD-024 (Circle seats / lifecycle) · FD-030 (Circle verification, Protected Tag Scope, Governing Body, attendance, seat ops) · FD-032 (dual Circle status mapping; Tag +25%/+25%; GB six-month / Circle Finance Coordinator) · FD-021 (membership settlement) · FD-023 (access during grace/suspension) · FD-025 (Connect BDP 20% on eligible subscription/Tag revenue) · FD-028 (revenue recognition — payment + activation required; Tag Subscription Revenue; transfer fee is Administrative Fee Revenue) · FD-029 (Connect BDP commission states and finance recovery) · FD-031 (Lead Assist separate from membership; Core Lead Rights) · FD-001 (platform model) · FD-034 (members are not employees/shareholders/owners of GCE) · FD-035 (User as permanent base identity; membership as separate entitlement)

This living document summarises membership commercial and operating rules for **GCE Connect**. On commercial/operating numbers and tier rules conflict, **FD-027 wins**. On approval / activation-vs-allocation / attribution / waitlist / transfer / geo routing conflict, **FD-036 wins**. On pure lifecycle-state conflict, **FD-022 wins**. On recognition / commercial classification of membership and Tag money, **FD-028 wins**. On Circle internal verification/governance/seat-ops conflict, **FD-030 wins**. On dual status mapping, **FD-032 wins**. Do not invent unresolved FD-027 / FD-036 items (exact Core thresholds, weighted scores, daily proration formula, refund matrix, waitlist tie-breaks, Lead Assist commercial rules).

## Canonical references

- **Membership commercial (Founder):** FD-027
- **Membership approval / attribution / allocation (Founder):** FD-036
- **Revenue recognition (Founder):** FD-028
- **Membership lifecycle (Founder):** FD-022
- **Circle seats / architecture:** `38_Circle_Architecture.md` / FD-024 (lifecycle) / FD-030 (internal structure, verification, governance) / FD-032 (dual status mapping)
- **Commercial numbers:** `36_Commercial_Constants.md` (defers to FD-027 for membership; FD-028 for recognition; FD-036 for attribution eligibility)
- **AI Lead Assist (separate service):** FD-031 / `39_AI_Lead_Assist_Spec.md` — separate from base membership; **Core Lead Rights** protected; commercial prices/success fee **Unresolved**; not approved under FD-027
- **Roles:** `35_Role_Taxonomy.md` / FD-035

---

## Official naming

| Concept | Approved name |
|---------|---------------|
| Formal launch membership | **GCE Connect Circle Membership — Associate Tier** |
| Future formal membership | **GCE Connect Circle Membership — Core Tier** |
| Member title | **GCE Connect Circle Member** |
| Launch tier | **Associate Tier** |
| Future upgrade tier | **Core Tier** |

Hierarchy:

```text
GCE Connect
└── Circle Membership
    ├── Associate Tier
    └── Core Tier
```

The person remains a GCE Connect Circle Member. Associate and Core are **tier labels**. Do not use “Associate Member” as the primary permanent member identity where the approved naming can be used.

Legacy labels such as “Associate Membership” / “Core Membership” may appear in older text or code — treat as legacy pending migration.

---

## Launch membership model

- Only **Associate Tier** is directly purchasable during launch.
- **Core Tier** is not directly purchasable during launch.
- Associate Tier price: **₹6,000 per quarter** plus applicable taxes.
- Billing is **quarterly only** at launch.
- Monthly and annual membership plans are **not active**. Any future monthly or annual plan requires separate Founder approval.

Numeric summary: `36_Commercial_Constants.md`.

---

## Platform-only membership

Membership may be applied for, verified, paid for, activated, renewed, upgraded, downgraded, transferred, frozen, suspended, terminated, or rejoined **only** through the authorised GCE platform workflow.

No offline, verbal, unofficial, privately issued, or manually activated membership is valid.

Connect BDP may assist with onboarding, verify business information, recommend category/Tag fit, help identify a suitable Circle, and recommend approval or hold — but may **not** activate membership manually, self-approve, collect payment into a personal account, change pricing, issue unofficial membership, promise a seat without platform confirmation, add unapproved Tags, bypass KYC, override seat exclusivity, create commission by unsupported attribution, guarantee Core eligibility, or guarantee referrals or revenue (FD-027 / FD-025 / FD-036).

Governing Body may provide Circle-specific input; it does **not** unilaterally approve payment, override KYC/capacity/taxonomy, or create Connect BDP commission (FD-036).

**Platform Operations retains final authority** to activate, hold, reject, confirm Circle allocation, correct attribution errors, and resolve conflicts (FD-036).

---

## Associate Tier

Associate Tier may include eligibility for one approved primary Circle seat, one approved Business Specialization, two included Business Tags, ability to purchase Tag 3 and Tag 4, local Circle networking, local referrals and opportunities, digital member profile, app-based referral management, dual-confirmed closed-business records, Trust and performance history, attendance and meeting tools, Circle governance participation, member support, available platform opportunities, Core progress tracking, approved GCE Connect activities, and dashboards/analytics/security/notifications according to policy.

Membership does **not** guarantee referrals, leads, revenue, closed business, client acquisition, nationwide opportunities, Core upgrade, permanent Circle seat, lifetime category protection, or any fixed return.

Lead Assist is a **separate service** (FD-031); base membership does not sell Lead Assist Pro. **Core Lead Rights** for ordinary eligible referrals remain protected and are not a membership upsell gate.

---

## Membership and Circle seat separation

**Membership activation and Circle allocation are separate business states** (FD-036).

A paid membership does **not** automatically guarantee a particular Circle seat, category seat, business specialisation, geography, Connect BDP, or immediate allocation.

A member requires:

1. Active eligible membership (may temporarily exist without final Circle allocation)
2. Separately confirmed Circle allocation / seat

An Active member who is not yet allocated may receive only approved pre-allocation benefits. Circle-specific rights (voting, Governing Body eligibility, attendance credit, category exclusivity, internal referral routing, governance authority) begin only after formal Circle allocation (FD-036).

Seat approval remains subject to verification, KYC/compliance, business eligibility, Business Specialization availability, Circle capacity, taxonomy compatibility, platform confirmation, and governance/conduct requirements (FD-022 / FD-024 / FD-027 / FD-030 / FD-036). Business verification uses multi-evidence outcomes **Verified / Conditionally Verified / On Hold / Rejected** — GST alone is not the only legitimacy test (FD-030).

Approved allocation model: **System proposes → Connect BDP assists → Platform confirms** (FD-036).

Operating target: GCE should normally aim to resolve a standard Circle allocation within **up to seven business days** from activation and required allocation inputs — an **operating target**, not a guaranteed contractual SLA (FD-036).

Approved principle: **One member = one physical Circle seat**.

Multiple Tags do **not** create additional physical seats, introductions, voting rights, identities, or Circle ownership.

User remains the permanent base identity; Membership is a separate GCE Connect entitlement (FD-035 / FD-036).

---

## Business Specialization and Tags

Each active Circle Member may hold:

- One approved **Business Specialization**
- Maximum **four** approved **Business Tags**

| Tag | Pricing |
|-----|---------|
| Tag 1 | Included |
| Tag 2 | Included |
| Tag 3 | **+25%** of active base subscription |
| Tag 4 | **+25%** of active base subscription |

The fourth Tag is **not** +50%. Any old +50% reference is obsolete.

Associate Tier example (before tax):

- Base: ₹6,000 / quarter
- Tag 3: ₹1,500 / quarter
- Tag 4: ₹1,500 / quarter
- Maximum quarterly before tax: ₹9,000

Future Core Tier example (before tax): base ₹9,000; Tag 3 ₹2,250; Tag 4 ₹2,250.

Paid Tags follow the active membership term, may be prorated mid-cycle (exact proration Pending Technical Design), renew with membership, may be removed at renewal, require taxonomy validation, and do not bypass specialization exclusivity.

Use **Protected Tag Scope**. Do not use “business monopoly” as a constitutional term. Unassigned vacant Tags remain available to another eligible non-competing business, subject to conflict review and platform approval.

---

## Taxonomy governance

Use: **GC Power Sector** · Business Specialization · Protected Tag Scope · Business Tags · Digital Member Profile · Intelligent Referral Routing.

Four fixed GC Power Sectors (FD-030): Real Estate, Infrastructure & Construction; Industrial, Manufacturing & Logistics; Professional, Financial & Business Services; Consumer, Hospitality, Health & Lifestyle. Seat distribution is flexible (not rigid 10/10/10/10). Circle capacity: max **40**. Dual status (FD-032): platform activation at **15**; constitutional Provisionally Active at **20–39**; Full Capacity / Fully Constituted at **40**; **15–19** remain Formation Circle constitutionally while lifecycle Active Growth.

Rule-critical categories, specialisations, and Tags use **controlled GCE taxonomy**. Governing Bodies may request changes; **Platform retains final taxonomy authority** (FD-036). Free-text may supplement but not replace controlled classification.

Do not use the outdated term **Power Circle** as current taxonomy.

Local governance may recommend taxonomy changes. Platform Taxonomy Team has final authority. Regional or district Tags are not valid until published by the platform. Existing members, Governing Body, or Connect BDP do not independently approve final Specialization/Tag outcomes (FD-030).

Note: Circle lifecycle documentation historically used “GCE Power Sector” (FD-024). For membership commercial terminology under FD-027 / FD-030, use **GC Power Sector**.

---

## Referrals and closed business

Official referral activity must be recorded through the GCE platform. Verbal, meeting-only, WhatsApp-only, or off-platform referrals do **not** count for official records, performance, Trust, Core eligibility, leaderboards, or rewards/commission calculations.

Closed business requires **dual confirmation** by the lead giver and the receiving member. Revenue is not verified until both confirmations are complete.

Do not count toward performance or Core eligibility: self-referrals, duplicates, fake referrals, cancelled/reversed/unconfirmed business, circular manipulation, fake attendance, off-platform claims, activity under investigation, or fraudulent transactions.

Exact referral-routing algorithm remains unresolved unless separately approved.

---

## Core Tier architecture (future)

Core Tier is a future **achievement-based** upgrade. It is **not** directly purchasable during launch, **not** automatically activated, and **not** permanent for life.

Approved principle: Eligibility is earned; Core activation is purchased only after eligibility and network readiness are confirmed.

Recommended minimum Associate tenure: **six months** of continuous active Associate Tier membership (usually two completed quarterly cycles).

Core activation requires member eligibility, GCE network readiness, platform review, member acceptance, upgrade payment, and no compliance hold.

### Core eligibility (concepts)

Mandatory conditions should include six months active Associate tenure, valid verification/KYC, no unresolved serious compliance/disciplinary case, fully paid dues, required profile completeness, platform-recorded referral activity, no manipulation/fraud, and satisfactory Circle participation.

Achievement conditions may include attendance, qualified referrals given/accepted, dual-confirmed closed business, Trust Rank, timely lead response, positive feedback, platform usage, Circle participation, governance contribution, profile completeness, and complaint history.

Recommended launch rule: all mandatory conditions plus at least **four** approved achievement conditions.

Exact numerical thresholds remain **Pending Founder Approval**. A complex weighted eligibility score is **not** approved at launch — do not invent one.

### Network readiness

Core activation also requires adequate GCE network readiness. Do **not** promise nationwide access at launch.

Approved wording: Access to eligible cross-city and expanded business opportunities available through the active GCE network.

Exact city count / launch gate remains Pending Founder Approval. A three-city benchmark may be mentioned only as a recommendation, not a fixed rule.

### Core price and upgrade

Future Core Tier price: **₹9,000 per quarter** plus applicable taxes.

For a mid-cycle approved upgrade: member pays prorated difference; existing expiry date remains unchanged; Core benefits activate after approval and payment; no additional Circle seat is created. Full-quarter difference: ₹3,000. Exact proration formula remains Pending Technical Design.

### Core Progress module

The PWA should support a Core Progress module (statuses and enums Pending Technical Design) showing tenure, status, attendance, referrals, dual-confirmed business, Trust Rank, complaints, profile completeness, platform participation, completed/pending conditions, network-readiness status, and upgrade-offer status.

### Core retention and reversion

One weak quarter must **not** automatically cause reversion. Recommended process: warning → review → improvement period → reversion at renewal after persistent failure; immediate suspension for serious misconduct. History and Trust records must remain preserved.

---

## Activation and seat reservation

Membership may become Active after valid User identity, required profile, applicable KYC/business verification, terms acceptance, confirmed payment, no blocking compliance issue, membership record creation, and platform activation recording. **Circle allocation is not required** for the membership record itself to become Active (FD-036).

Payment success does not by itself prove completed membership activation — distinguish payment, pending activation, Active, activation failed, and remediation states (FD-036).

Seat reservation: **seven days** after seat eligibility approval; payment and activation must complete within the period; seat releases after seven days if incomplete; extension requires authorised approval; indefinite manual holds are not allowed (FD-022 / FD-027). The platform must not falsely represent a seat as guaranteed until allocation is formally confirmed (FD-036).

---

## Renewal and grace

- Renewal notice: **30 days** before expiry
- Grace period: **30 days** after expiry

During grace: renewal eligibility remains; seat remains protected; full access may be restricted; new Tags may not be added; new benefits may not activate; certain financial/commissionable actions may be restricted; full access restores after renewal.

After grace: membership becomes inactive; seat may be released; waitlisted member may receive seat; history remains preserved; rejoining may be required.

Renewal uses the plan price applicable on the renewal date. Original joining price is not permanently guaranteed.

---

## Downgrade, freeze, transfers, waitlist, geographic routing

**Downgrade (Core → Associate):** may be requested during active term; normally takes effect at renewal; no mid-cycle refund; Tag pricing recalculates at renewal; history preserved.

**Freeze:** up to **90 days**; requires approved reason; one active freeze at a time; pauses benefits; may extend expiry by approved freeze duration; preserves history. Recommended Circle seat protection during freeze: **up to 30 days**. Do **not** state that a 90-day freeze automatically protects the seat for 90 days. Beyond 30 days, seat may be released where continuity requires.

**Transfers** (city, Circle, Specialization, Tag, category-related): subject to destination capacity, category compatibility, Tag compatibility, membership status, open disputes, governance obligations, pending financial issues where relevant, attribution review, verification, conflict review, platform approval, effective date, and compliance (FD-027 / FD-036).

- First approved transfer in 12 months — **Free**
- Additional transfer in same 12 months — **₹1,000 plus tax**

History remains preserved. Previous seat is not permanently owned. Old Circle seat releases on effective transfer; historical attendance/referral records remain in the old Circle context; new Circle rights begin from the transfer effective date. **No silent historical rewrite.** Circle transfer does **not** automatically transfer Connect BDP commission attribution — platform must determine whether existing attribution continues, new attribution begins, or none applies (FD-036).

**Category full / waitlist alternatives (FD-036) — standard order:**

1. Another suitable Circle in the same city
2. Practical nearby Circle within the approved geographic hierarchy
3. Waitlist for preferred Circle / category
4. New Circle formation pathway where commercially and operationally justified
5. Manual Platform review

Category unavailability must **not** automatically force a User into future Core Tier (FD-036).

**Waitlist:** verified eligible applicant, payment readiness, waitlist timestamp, Circle suitability, conflict review. No Connect BDP or governance body may privately sell or promise a waitlist position. Exact tie-break / prioritisation rules remain unresolved.

**Geographic routing hierarchy (FD-036):** Locality / practical proximity → City → District → State. City remains the primary Connect operating geography. Geographic routing does **not** itself grant Connect BDP permanent territorial ownership.

**Relationship Manager:** RM assignment is operational and does **not** automatically create commission. Platform Operations controls assignment; Connect BDP may recommend but does not automatically control RM assignment (FD-036).

---

## Refunds, suspension, termination, rejoining

Before activation, refund may be considered for GCE rejection, inability to provide approved seat or activate service, duplicate payment, or billing error.

After activation, membership is normally **non-refundable**. No refund merely because the member did not attend, did not receive referrals, did not use the platform, changed their mind, did not achieve Core eligibility, did not receive nationwide opportunities, was suspended for misconduct, or had below-expectation business outcomes.

Exact refund matrix remains Pending Founder and Legal Approval.

Suspension/termination may apply for KYC/compliance issues, payment dispute, data misuse, referral manipulation, harassment, false claims, governance breach, platform-security abuse, fraud, or repeated violations. Suspension or termination does not automatically create a refund.

Rejoining requires cooling-off where applicable, resolution of dues and compliance matters, fresh verification where required, current pricing/policies, and available Circle seat. **No separate rejoining fee at launch.** Previous price, seat, Circle, specialization, or Tags are not guaranteed.

---

## Membership revenue and Connect BDP commission

Under FD-025 / FD-029, Connect BDP earns **20%** of eligible GCE Connect subscription revenue **only where valid Connect BDP attribution exists** at the relevant earning event (FD-036).

**Organic / unattributed memberships are allowed.** Absence of Connect BDP attribution must not prevent legitimate membership activation where other requirements are satisfied. Where no valid attribution exists: **no Connect BDP commission entitlement arises**. Do **not** describe that amount as “pending CBDP commission” — it remains with GCE under the applicable revenue architecture (FD-036).

Later Connect BDP assignment does **not** automatically create retroactive commission on earlier membership revenue; future eligible revenue may become attributable from the approved effective date. Retroactive correction only for documented platform error or authorised dispute outcome (FD-036).

Eligible commissionable items may include Associate subscription/renewal, Core upgrade/renewal (when applicable), and Tag 3 / Tag 4 subscriptions — when collected, validly attributed, activated, settlement-eligible, and not refunded/reversed.

Not automatically commissionable: GST and statutory taxes, refunds/reversals/chargebacks, transfer fees, penalties, Lead Assist fees, complimentary/promotional credits, uncollected amounts, unattributed organic membership revenue (FD-027 / FD-036).

---

## Lead Assist separation

GCE Connect Lead Assist is a **separate service** from base membership (FD-031 / `39_AI_Lead_Assist_Spec.md`). FD-027 does **not** approve Lead Assist ₹500 fee, escrow, deficit-reward, subscription credit voucher, forfeiture, blocking, or Lead Assist commission.

**Core Lead Rights** (ordinary give/receive, Accept/Decline/Clarify/Duplicate/Invalid/Collaborate, Dual-Confirmed Closed Business, fair eligibility-based routing) must not require purchase of Lead Assist Pro or other paid products. Optional Pro / verification / Expert Selection / Managed Opportunity prices and any success-fee model remain **Unresolved**. Do not merge Lead Assist into membership commercial benefits.

---

## Long-term vision

The GCE Connect Circle Membership program builds a trusted business networking community through platform-governed Associate Tier membership, Protected Tag Scope, dual-confirmed referrals, and a future achievement-based Core Tier — without guaranteeing referrals, revenue, nationwide access, or permanent seats.
