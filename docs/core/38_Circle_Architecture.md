# Circle Architecture (Canonical)

## Authority

**Highest authority for GCE Connect Circle lifecycle stages and transitions:**
`docs/founder-decisions/FD-024_GCE_Connect_Circle_Lifecycle.md`

**Highest authority for Circle internal structure and governance** (capacity constitution thresholds, GC Power Sectors, Specializations, Protected Tag Scope, Tags, business verification, Governing Body, meetings, attendance, referrals, workshops, conduct, discipline, seat operations, digital governance, voting limits):
`docs/founder-decisions/FD-030_GCE_Connect_Circle_Architecture_and_Governance.md`

**Highest authority for dual Circle status mapping, Connect BDP activation-credit logic, and current Governing Body tenure/role supersession clarification:**
`docs/founder-decisions/FD-032_Phase_1_Authority_Status_Mapping_and_Supersession_Clarification.md`

**Corporate ownership / operator principles:** `docs/founder-decisions/FD-034_Logixia_and_GCE_Corporate_Platform_Constitution.md`

**Membership allocation / activation-vs-allocation / geographic routing / transfer attribution:** `docs/founder-decisions/FD-036_GCE_Membership_Attribution_Approval_and_Allocation_Authority.md`

**Related Founder Decisions:**

- Membership vs Circle seat, reservation, waitlist, grace: `FD-022_Membership_Lifecycle.md`
- Membership commercial (tiers, Tags, Core, transfers, freeze seat protection): `FD-027_Membership_Commercial_and_Operating_Architecture.md`
- Circle access and role boundaries: `FD-023_RBAC_and_Permissions.md`
- Platform ownership and vertical model: `FD-001_Business_Model.md`
- Connect BDP Franchise Unit capacity, targets, and commercial pack: `FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`
- Commission Engine / entitlements: `FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md`
- Revenue recognition: `FD-028_Revenue_Recognition_and_Commercial_Architecture.md`

This document is the living **canonical core** summary of Circle architecture. Where this file conflicts with FD-024 on **lifecycle**, **FD-024 wins**. Where this file conflicts with FD-030 on **internal structure and governance**, **FD-030 wins**. Where this file conflicts with FD-032 on **status mapping / activation credit / current GB term and Circle Finance Coordinator**, **FD-032 wins**. Where this file conflicts with FD-036 on **membership activation vs Circle allocation, allocation authority, waitlist/geo routing, transfer attribution**, **FD-036 wins**. Where partner commercial capacity conflicts with FD-025, **FD-025 wins**. Where membership commercial Tag/seat-scope rules conflict with FD-027, **FD-027 wins**. Corporate identity: **FD-034**. Do not invent Health Score formulas, Annual Circle Certification, Mature-status criteria, merger/split voting rules, workshop prices/commission, substitute limits, voting quorum, or other Unresolved items. Do **not** collapse lifecycle and constitutional status into a single enum without retaining the approved FD-032 mapping.

---

## Purpose

Owns detailed GCE Connect Circle architecture for the repository: formation, activation, capacity, seats, taxonomy, verification, Governing Body, meetings, attendance, referrals, workshops, discipline, expansion, merger/closure, and archival.

Membership plan benefits: `05_Memberships.md` (defers to **FD-027** for commercial rules; **FD-036** for approval/attribution/allocation; **FD-030** for Circle seat/verification/governance ops).
Connect BDP narrative: `06_CBDP.md` (legacy filename; approved term **Connect BDP**).
Commercial partner numbers: `36_Commercial_Constants.md`.
Roles: `35_Role_Taxonomy.md`.

Always use **GCE Connect** (never “Connect” alone).

---

## What a GCE Connect Circle is

A **GCE Connect Circle** is (FD-030):

> A platform-governed local business networking unit consisting of up to **40 active physical members**, organised through approved Business Specializations, Business Tags, GC Power Sectors, referral workflows, meetings, and Circle governance.

It is a GCE platform entity with unique identity, geographic association, lifecycle status, maximum membership capacity, Protected Tag Scope seats, Governing Body roles, and meeting/referral/performance/compliance/audit history.

A Circle is **not**:

- An independently owned association
- A private member-owned club
- A Connect BDP-owned business asset
- A member-owned database
- An independently controlled financial entity

Membership does **not** guarantee referrals, leads, sales, revenue, contracts, or business success (FD-030).

---

## Ownership (Founder Approved — FD-001 / FD-024 / FD-030 / FD-034)

| Party | Role |
|-------|------|
| **Logixia Solutions Private Limited** (legal company) / **GCE** (platform and master brand) | Owns and controls every Circle at the platform layer (identity, records, taxonomy, Specializations, Protected Tag Scope, Tags, referral/closed-business records, Governing Body permissions, activation/suspension/merger/closure, financial/commercial/audit records). GCE is **not** currently a separate legal company (FD-034). Exact legal wording Pending Legal Review. |
| **Connect BDP** | Manages and supports — **does not own** the Circle |
| **Governing Body** (legacy: Board of Governance / Circle Board) | Supports internal operations — **does not own** the Circle |
| **Circle Members** | Participate and occupy seats — **do not own** the Circle |

Platform ownership remains with Logixia / GCE if a Connect BDP resigns, is suspended, or is terminated; if Governing Body or members change; if territory changes; or if the Circle is merged or closed/archived. BDPs and members do not become owners of Circles or the GCE vertical.

---

## Creation and activation (lifecycle — FD-024)

### Initiation

An approved **Connect BDP** may initiate a Circle creation request within assigned territory / approved operating scope.

- Connect BDP **cannot** independently activate a Circle.
- Governing Body **does not** create Circles.
- Platform validation and approval are **mandatory** before Formation.

Conceptual flow (FD-024):

```text
Identify opportunity
  → Submit creation request
  → Platform validates
  → Approve / Reject / Return / Hold
  → Approved Circles enter Formation
```

### Dual Circle status architecture (Founder Approved — FD-032)

Phase 2 and living docs must preserve **two linked status families**. Do **not** collapse them into one status without retaining this mapping.

**Circle Lifecycle Status (FD-024, as mapped by FD-032):** Formation · Active Growth · Full Capacity

**Circle Constitutional Status (FD-030):** Formation Circle · Provisionally Active Circle · Fully Constituted Circle

| Approved and Paid Active Members | Lifecycle Status | Constitutional Status |
|---:|---|---|
| **0–14** | Formation | Formation Circle |
| **15–19** | Active Growth | Formation Circle |
| **20–39** | Active Growth | Provisionally Active Circle |
| **40** | Full Capacity | Fully Constituted Circle |

Critical clarity:

- **15–19 members are Active Growth lifecycle, not constitutionally Provisionally Active.**
- Constitutional **Provisionally Active** begins at **20** approved and paid members.
- **Full Capacity** (lifecycle) and **Fully Constituted** (constitution) both require **40**.
- Do **not** describe 20 members as a full Circle.
- **Maximum capacity: 40 active physical members** (Primary Physical Circle Seats).

### Platform activation and Connect BDP target credit (FD-032)

A Circle may become **platform-activated** at **15** approved and paid founding members only after:

- Business verification
- Seat allocation
- Required onboarding
- Platform confirmation
- No blocking compliance issue
- Audit recording

Member count alone does not create platform activation.

**Connect BDP target credit** for a Circle is earned **once** at formal **15-member platform activation**.

- Reaching **20** members changes constitutional status to Provisionally Active but does **not** create a second target credit.
- Reaching **40** members does **not** create another activation credit.

Broader FD-024 operational statuses (`Draft`, `Pending Activation`, `Mature`, `Under Review`, `Suspended`, `Merged`, `Archived`, etc.) and FD-030 operating stages (Performance Review, Suspended, Merged, Closed) remain valid for non-capacity workflow. Do not invent Mature criteria or Under Review SLAs.

Closure must result in Suspended, Merged, Archived, or Closed — **never silent deletion**. Circle history must be preserved.

Seat notes:

- One active membership normally equals one primary physical Circle seat.
- A member may not hold two primary seats in the same Circle; a member normally belongs to one primary Circle.
- Tags, digital access, and cross-city opportunities do **not** create additional physical seats.
- Pending, suspended, expired, frozen, and waitlisted users do not count as active seats except where an approved seat-protection rule applies.

---

## GC Power Sectors (FD-030)

Every Circle uses these **four fixed** GC Power Sectors (platform taxonomy — **not** separate Circles):

1. **Real Estate, Infrastructure & Construction Sector**
2. **Industrial, Manufacturing & Logistics Sector**
3. **Professional, Financial & Business Services Sector**
4. **Consumer, Hospitality, Health & Lifestyle Sector**

Used for Specialization organisation, collaboration, referral relevance, training, lead routing, and reporting.

### Flexible seat distribution

The four sectors are fixed. The **40 seats are not rigidly divided 10/10/10/10**.

- Every Specialization belongs to one primary GC Power Sector.
- Seat distribution may vary by local verified demand.
- Platform taxonomy should prevent one sector from dominating the Circle.
- Final seat approval remains subject to Circle balance and conflict review.

Do **not** preserve or invent a mandatory 10-seat-per-sector rule.

FD-024 historically wrote **GCE Power Sector**. Prefer **GC Power Sector** (FD-027 / FD-030). Do not use **Power Circle** as current taxonomy.

---

## Seats, Specialization, Protected Tag Scope, Tags

### Taxonomy hierarchy

```text
GC Power Sector
  → Business Specialization (one primary per member; protected seat)
    → Protected Tag Scope (commercial boundary of the protected seat)
      → Business Tags (max four; Tags 1–2 included; Tag 3/4 +25% each — FD-027 / FD-030)
```

**Business Specialization** = the member’s primary approved business category under which the physical Circle seat is allocated and protected.

- One member → one primary Business Specialization.
- Two active members should not hold the same protected Specialization in the same Circle.
- Specialization must represent verified principal business activity; broad/misleading categories cannot block competitors.
- Specialization changes require approved workflow; historical records preserved.
- Specialization exclusivity does **not** automatically apply across an entire city.

**Protected Tag Scope** = approved commercial boundary of the member’s protected Circle seat (protected activities, allowed overlap, Tag eligibility, referral relevance, Specialization conflict). It does **not** automatically cover every product or service the member offers.

**Business Tags** (FD-027 / FD-030):

- Maximum **four** active Tags per member.
- First two included in base membership; Tag 3 and Tag 4 each cost **25%** of the active base subscription.
- The earlier **50%** fourth-Tag rule is **obsolete**.
- Tags do not create additional physical seats; cannot disguise a second primary business; cannot override another member’s Protected Tag Scope; cannot create false exclusivity.
- Tag 3/4 require approval and payment; commission treatment follows FD-027 / FD-029.

### Specialization overlap review (FD-030)

1. Applicant selects Business Specialization
2. Platform checks existing protected seats
3. Connect BDP verifies business
4. Protected Tag Scope assessed
5. Platform decides: no conflict · compatible alternate · limited approved overlap · hold · rejection
6. Decision and reason recorded

Final authority remains with the **platform**. An existing member, Governing Body, or Connect BDP does not independently approve or reject the final taxonomy outcome.

### Membership vs Circle seat (FD-022 / FD-024 / FD-030 / FD-036)

| Concept | Belongs to |
|---------|------------|
| **Membership** | Approved member account (may be Active pending allocation — FD-036) |
| **Primary Physical Circle Seat** | Specific Business Specialization inside a specific Circle |

- Membership activation and Circle allocation are **separate business states** (FD-036).
- Active membership does **not** automatically guarantee immediate Circle placement or a specific Circle seat.
- Circle-specific rights begin only after formal allocation (FD-036).
- Allocation model: **System proposes → Connect BDP assists → Platform confirms** (FD-036).
- Operating target: normally aim to resolve standard Circle allocation within **up to seven business days** — operating target, not contractual SLA (FD-036).
- Geographic routing: Locality / practical proximity → City → District → State (City primary); does not create permanent Connect BDP territorial ownership (FD-036).
- Category-full alternatives: other same-city Circle → nearby Circle → waitlist → new Circle formation where justified → manual Platform review; do **not** force Core Tier (FD-036).
- Seat reservation period: **7 days** after preliminary approval (not activation); payment/onboarding within seven days or reservation may be released (FD-022 / FD-030).
- Waitlist is Circle- and Specialization-specific; position does not guarantee admission; verification and platform approval remain required.
- Circle transfer preserves history; does not automatically transfer Connect BDP attribution (FD-036).
- Controlled taxonomy for rule-critical fields; Platform retains final taxonomy authority (FD-036).

---

## Business verification (FD-030)

No Circle seat is activated until platform-recorded verification covers:

- Identity
- Authority
- Business existence
- Operating capability
- Specialization eligibility
- Compliance

Verification uses a **risk-based multi-evidence** approach. **GST registration alone is not the only test** of legitimacy.

Evidence may include (as applicable): government identity / PAN or tax identity; address/contact; owner/partner/director/authorised-representative proof; GST, Udyam, company/LLP, Shop & Establishment, trade/professional licence, partnership deed, business bank proof, recent invoice; physical visit and/or live video; website/profile; signage/location; operating setup; customer/supplier references where required.

Specialization verification must confirm principal activity, capability, no category blocking, no material protected-seat conflict, genuine Tags, valid licences, and legally permitted activity.

### Verification outcomes

| Outcome | Meaning |
|---------|---------|
| **Verified** | Required checks complete; applicant may proceed |
| **Conditionally Verified** | Minor non-critical item pending; temporary approval with deadline |
| **On Hold** | Material evidence, compliance, authenticity, or conflict issue requires review |
| **Rejected** | Legality, ownership, authenticity, capability, or eligibility not established |

Preserve: documents reviewed, method, visit/video result, verified Specialization, approved Tags, risk observations, verifier, date, evidence, conditions, re-verification date, decision and reason.

Re-verification may be required after ownership, activity, location, Specialization, licence, or serious compliance change.

---

## Naming and multi-Circle territories

- Official Circle names are **platform controlled**.
- Recommended pattern: `[Geography] + Circle + [Sequence Number]` (example: Delhi South Circle 01).
- Members, Connect BDPs, or Governing Bodies must not invent unrestricted informal names as the primary system name.
- **Multiple Circles may exist in the same territory.**
- A new Circle may begin formation when an existing Circle reaches approximately **80% occupancy** ≈ **32 active members** (for a 40-member Circle) — FD-024.
- Every additional Circle is a **separate platform entity**.

---

## Connect BDP and Circle operations

Connect BDP **should** (FD-030): verify businesses; explain membership; form and support Circles; coordinate onboarding; maintain Circle health; support Governing Body; review attendance/engagement; recommend corrective action; escalate disputes; support retention and vacancies.

Connect BDP **must not**: own the Circle; override Founder Decisions; change fees or commission; guarantee business; alter financial records manually; approve their own commission exception; permanently control member data; independently activate/suspend/merge/archive Circles or delete Circle history (FD-024 / FD-025 / FD-030).

### Partner capacity packs

Each **Connect BDP Franchise Unit** may develop up to **five** GCE Connect Circles, with a target of five **platform-activated** Circles within ten months (FD-025). Only platform-activated Circles count toward the completed target.

Under **FD-032**, target credit is earned **once** when a Circle is formally **platform-activated at 15** approved and paid founding members (after verification, seat allocation, onboarding, platform confirmation, no blocking compliance issue, and audit recording). Reaching **20** (Provisionally Active constitutionally) or **40** (Full Capacity / Fully Constituted) does **not** create additional activation credits for the same Circle. Preserve both lifecycle and constitutional status families (`38` dual-status table).

Partner commercial pack rules: **FD-025** / **FD-029** finance recovery. Circle internal ops: **FD-030**. Status mapping: **FD-032**.

---

## Governing Body (FD-030 / FD-032)

Approved term for Circle internal governance: **Governing Body** (legacy labels Board of Governance / Circle Board may appear pending migration — dual-use/legacy per FD-032).

### Core roles

1. Circle President
2. Circle Vice President
3. Secretary
4. **Circle Finance Coordinator** — current finance-support role under FD-030 / FD-032. Supersedes **Treasurer** as the *current* Circle governance title. Historical Treasurer records remain auditable and must be mapped on migration.
5. Sergeant at Arms
6. Membership and Growth Coordinator
7. Referral and Performance Coordinator

Formation Circles may temporarily combine compatible roles with platform approval.

### Term and appointment

- Standard term: **six months** (FD-030 / FD-032). Earlier **one-year** Board tenure references in FD-024 are superseded **only for current Governing Body tenure** (FD-032). Historical one-year records remain auditable.
- Reappointment requires performance and platform approval.
- Exact minimum tenure for eligibility: **Unresolved**.
- Hybrid appointment: eligible members may nominate or vote → Connect BDP verifies eligibility → **platform confirms** appointment; platform may reject or remove for compliance, conflict, misconduct, or governance risk.

### Eligibility (summary)

Active membership; current KYC and business verification; satisfactory attendance and conduct; no serious disciplinary hold; no unresolved fraud or material financial dispute; required orientation; consent to serve.

### Role limits (highlights)

- **Circle President** cannot independently suspend, terminate, fine, refund, or settle a member.
- **Circle Finance Coordinator** must not collect membership fees personally, hold Circle funds, approve their own reimbursement, modify commission, release settlement, or operate an unauthorised Circle bank account.
- **Sergeant at Arms** manages punctuality, agenda timing, visitor protocol, speaking order, and meeting behaviour — not a security officer; cannot independently impose punishment.
- **Referral and Performance Coordinator** cannot manually alter referral or closed-business values.

### Governing Body limitations

The Governing Body does **not**: own the Circle; change fees or commission; change taxonomy; approve final Specializations or Tags; activate or terminate membership; forfeit fees; change wallet balances; reverse commission; release settlement; open unauthorised bank accounts; override platform decisions.

No Circle officer may unilaterally terminate a member.

Conflict of interest: disclose and recuse from affected decisions.

Detailed historical election/no-confidence math in FD-024 remains lifecycle/governance history. Living GB structure, six-month term, role names (including Circle Finance Coordinator), and limits defer to **FD-030**; **FD-032** confirms that FD-030 governs current internal Governing Body structure and that Treasurer / one-year are not current governance rules.

---

## GCE Phygital Circle Meeting Framework (FD-030)

Approved name: **GCE Phygital Circle Meeting Framework**.

- Physical meetings every **15 days** remain the core GCE Connect relationship format (two standard meetings per month where the calendar permits).
- Digital systems may support preparation, attendance confirmation, leave, referral recording, action tracking, visitors, agenda, summaries, workshops, training, and **exceptional** remote participation.
- Digitalisation must **not** replace or dilute physical relationship-building.
- A Circle may **not** convert all standard meetings to online meetings for convenience.
- Digital-only sessions may be used for training, orientation, committee work, or urgent matters.

### Agenda (recommended)

Welcome/attendance → visitors/new members → business introductions → referral updates → dual-confirmed closed-business updates → Power Sector collaboration → featured presentation → training/platform update → Governing Body announcements → upcoming events → issues/actions → closing.

### Pre- / during- / post-meeting digital support

Pre-meeting may collect attendance confirmation, leave, introductions, referral requirements, opportunities, presentation material, visitor details, agenda suggestions, prior action status.

During meeting, an authorised operator may record attendance, visitors, referrals, action items, notes, Power Sector commitments, follow-up deadlines.

Post-meeting may distribute summary, referrals received, tasks/deadlines, workshop announcements, next meeting date, attendance status, feedback form.

Do not design meetings so all members spend the physical session on phones.

### Remote participation (exceptional)

Permitted reasons may include medical, essential business travel, emergency, temporary absence from city, or platform-approved reason.

Safeguards:

- At least **75%** of standard Circle meetings should be attended **physically** by the member personally.
- Remote attendance is separately labelled and does not fully replace physical attendance.
- Substitute attendance does not fully replace personal attendance (exact substitute limits: **Unresolved**).

---

## Attendance (FD-030)

| Standard | Rule |
|----------|------|
| Expected attendance | At least **75%** |
| Two consecutive unexplained absences | Warning |
| Three consecutive unexplained absences | Formal review |
| Below **60%** over rolling three months | **Corrective Action Plan** |
| Continued failure after CAP | Possible suspension or seat review |

Attendance alone does **not** automatically terminate membership.

Valid reasons may include health/family emergency, essential business travel, religious or public obligation, or platform-approved reason.

### Visitors

Invitation recorded; identity and business details collected; Specialization conflicts checked; visitor cannot represent themselves as a member or access confidential Circle data; follow-up via authorised onboarding; **visitor attendance does not reserve a seat**.

### Substitutes

Verified authorised business representative may attend on limited occasions; separately recorded; does not automatically count as full personal attendance; cannot vote unless separately authorised; must follow confidentiality/conduct; repeated substitution cannot replace personal participation. Exact limits: **Unresolved**.

---

## Referrals and Dual-Confirmed Closed Business (FD-030)

A referral becomes part of official Circle performance only when **recorded through the platform**.

Referral records should include: lead giver, lead receiver, date, type, relevant Specialization or Tag, status, follow-up, outcome, closed-business confirmation where applicable.

### Dual-Confirmed Closed Business

1. Lead giver enters business amount
2. Lead receiver confirms it
3. Only then does it become part of the official digital ledger

No unilateral final amount; disputed amounts remain pending; corrections require audit history; no silent overwrite; manipulation may trigger discipline.

### Referral quality

Track accepted/rejected/relevant/invalid referrals, follow-up time, conversion, dual-confirmed closed business, disputes, and repeated low-quality referrals. Volume alone is not the only performance measure.

---

## GCE Circle Business Growth Workshops (FD-030)

Approved program name: **GCE Circle Business Growth Workshops**.

- Normally **optional** (mandatory sessions limited to approved orientation, compliance, or platform training included in membership or separately disclosed).
- Formats: Circle-exclusive; multi-Circle; GC Power Sector masterclass; platform-wide digital masterclass; premium small-group business clinic.
- Speakers require verification (identity, credentials, experience, references, conflict, content, fee, no misleading income guarantee, no undisclosed aggressive selling, data/confidentiality compliance). Workshops must remain educational — not undisclosed sales events.
- Verified members may speak under the same approval process; no automatic preference.

### Approval workflow (summary)

Members identify need → Governing Body recommends → Connect BDP reviews → platform identifies/approves speaker → speaker submits agenda/commercial proposal → platform approves price/capacity/refund rule/delivery mode → listed → members purchase via approved platform channel → attendance recorded → feedback → speaker payment after approved delivery.

### Commercial controls

Allowed pricing models: per-member ticket; fixed Circle booking fee; platform-sponsored/subsidised. **No universal price is approved.**

- Payments use approved platform channels.
- Speaker fee contractually recorded; platform fee, taxes, refunds, venue cost, and expenses shown separately.
- Connect BDP does **not** automatically receive **20%** of workshop revenue.
- Governing Body does **not** automatically receive a share.
- No workshop commission may be inferred without separate Founder approval.
- Workshop pricing, speaker fee structure, refund matrix, platform fee, and commission remain **Unresolved**.

Commission and settlement for other streams follow FD-020, FD-021, FD-028, and FD-029. FD-030 does not create unapproved event or workshop commission.

---

## Conduct, complaints, and discipline (FD-030)

Members must not: harass/threaten; misrepresent capability; make false referral claims; manipulate closed-business figures; misuse customer data; bypass payment controls; collect unauthorised fees; discriminate unlawfully; repeatedly disrupt meetings; damage the GCE brand; create unofficial competing records; misrepresent authority.

### Progressive discipline

1. Informal guidance
2. Written warning
3. Corrective Action Plan
4. Temporary restriction
5. Suspension
6. Membership or seat termination

Serious fraud, violence, harassment, data theft, financial misconduct, or legal risk may bypass earlier stages.

A **Corrective Action Plan** should include: issue, evidence, required correction, responsible person, review period, support provided, consequence, reviewer, outcome.

### Complaint process (summary)

Submit → acknowledgement → conflict check → evidence → temporary protective measure where needed → response opportunity → authorised review → decision and reason → appeal where permitted → audit record.

Exact complaint-resolution and appeal timelines: **Unresolved**.

---

## Seat operations (FD-022 / FD-027 / FD-030)

| Topic | Rule |
|-------|------|
| Seat reservation | **Seven days** after preliminary approval; not activation |
| Renewal notice | **30 days** |
| Grace period | **30 days**; seat active until membership expiry; participation may be restricted in grace; after grace seat may become vacant |
| Freeze | Up to **90 days**; primary seat protection recommended up to **30 days**; after 30 days platform may review continued protection; freeze does not erase obligations or create another seat. Exact protection after 30 days: **Unresolved** |
| Transfer | First within 12 months **free**; later **₹1,000 plus tax**; requires valid reason, vacancy, Specialization/Protected Tag Scope review, effective date, preserved history, **platform approval**. Governing Body cannot promise or independently approve transfer |
| Specialization change | Updated verification, taxonomy/conflict/Protected Tag Scope/Tag review, Connect BDP recommendation, platform approval, effective date, audit trail — cannot displace an existing protected member |
| Vacancies / waitlist | Published via authorised platform process; waitlist Circle- and Specialization-specific; no guaranteed admission |

---

## Merger and closure (FD-024 / FD-030)

Merger may be considered for unsustainably low membership, repeated meeting failure, governance breakdown, insufficient local demand, complementary nearby vacancies, or platform strategy.

Closure may result from persistent inactivity, insufficient membership, governance failure, legal/compliance risk, market restructuring, platform strategy, or merger.

**Closure does not automatically cancel active memberships.**

Merger/closure must preserve: membership history, referral history, closed-business history, financial history, disciplinary history, attribution history.

Exact merger voting/notice/consent rules: **Unresolved** (do not invent).

---

## Circle performance indicators (FD-030)

May include: active member count, seat occupancy, retention, renewal, attendance, referral participation/quality, dual-confirmed closed business, visitor conversion, governance compliance, complaint levels, sector balance, member engagement, event participation, data completeness.

No single metric automatically determines closure.

---

## Financial controls (FD-030)

- Payments use approved platform channels.
- No personal collection account; no unauthorised cash pool.
- No Circle bank account without Founder and legal approval.
- Approved expenses must be recorded; no self-approval of reimbursement.
- Commission and settlement follow FD-020, FD-021, FD-028, and FD-029.

---

## Digital governance and access (FD-023 / FD-030)

The platform should maintain: Circle roster, seat map, Specialization map, Tag records, Governing Body appointments, attendance, referrals, closed-business confirmations, complaints, warnings, Corrective Action Plans, transfers, vacancies, freeze, suspension, Circle status, audit history.

Access follows FD-023: members see authorised Circle/personal information; Governing Body receives limited role-based access; Connect BDP sees assigned operational data; finance data remains restricted; sensitive complaints have restricted access. Governing Body status does not create unrestricted access.

---

## Voting (FD-030)

Voting may be used for advisory matters and Governing Body nominations.

Voting **cannot** independently determine: membership approval, taxonomy, Specialization conflict, fees, commission, refunds, suspension, termination, data access, Circle closure, or platform policy.

Exact quorum and voting percentages: **Unresolved**.

---

## Platform final authority (FD-030)

GCE retains final authority over: Circle creation and identity; activation; membership status; taxonomy; Business Specializations; Business Tags; Protected Tag Scope; seat conflicts; Governing Body permissions; suspension; termination; merger; closure; data access; finance; commission; settlement; appeals; compliance; rule interpretation (**Platform-Controlled Decision**).

---

## Circle Health Score and certification

| Item | Status |
|------|--------|
| Circle Health Score **as a concept** | Founder Approved (FD-024) |
| Exact formula, weightage, thresholds | **Not approved** — Pending Founder Approval |
| Annual Circle Certification | **Not approved** — Future / Pending Founder Approval |

Do not present invented Health Score math or Annual Certification as final rules.

---

## Unresolved (do not invent)

From FD-030 and related decisions, including:

- Minimum Governing Body tenure
- Substitute-attendance limits
- Voting quorum / percentages
- Sector-balance ranges
- Formation period for reaching 40 members
- Exact seat protection after 30-day freeze
- Attendance evidence requirements
- Appeal and complaint-resolution timelines
- Workshop prices, speaker fee structure, refund matrix, platform fee, commission model, recording/IP/certificate policy
- Exact database enums/schemas, APIs, Supabase RLS, notification workflows, dashboard implementation
- Exact Mature / Under Review criteria (FD-024)

---

## AI Lead Assist and Circles

Authority: **FD-031** / `39_AI_Lead_Assist_Spec.md` (with Dual-Confirmed Closed Business under **FD-030**).

Ordinary local Connect leads use **Circle-first** routing within eligibility, Business Specialization, Protected Tag Scope, and non-competing rules. AI matching may consider Circle membership, seat/specialization availability, and activity. Do **not** describe Rainmaker Pass Lead as the current Circle lead-routing model.

Closed business recognition for Circle referrals remains **Dual-Confirmed Closed Business** (lead giver + receiving member). Lead Assist payment is not required for Core Lead Rights on ordinary eligible Circle referrals.

Membership eligibility and seat rules remain governed by FD-022 / FD-024 / FD-027 / FD-030.

---

## Cross references

- FD-030 Circle internal architecture and governance (highest for structure/ops)
- FD-024 Circle lifecycle (highest for lifecycle transitions)
- FD-022 Membership lifecycle
- FD-023 RBAC
- FD-025 / FD-029 Connect BDP commercial and commission
- FD-027 Membership commercial
- FD-031 AI Lead Assist / Circle-first routing context
- `05_Memberships.md`
- `06_CBDP.md` (Connect BDP narrative; legacy filename)
- `14_Business_Rules.md`
- `35_Role_Taxonomy.md`
- `36_Commercial_Constants.md`
- `39_AI_Lead_Assist_Spec.md`
