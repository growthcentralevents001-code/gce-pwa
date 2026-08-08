# Phase 11 — Events, Offers, Bookings & Customer Experience

| Field | Value |
|-------|-------|
| **Phase** | 11 |
| **Document** | `PHASE_11_EVENTS_OFFERS_BOOKINGS_CUSTOMER_EXPERIENCE.md` |
| **Type** | Phase planning / living architecture summary (documentation only) |
| **Status** | Draft for Marketplace customer & Venue Partner experience |
| **Date** | 2026-08-08 |

---

## Authority

**Highest business authority:**

| Topic | Authority |
|-------|-----------|
| Marketplace transaction families, offer/event approval, unattributed revenue, redemption, payout direction | **FD-037** |
| Marketplace ticket MoR direction; 48h cancellation default; compliance gates | **FD-039** |
| Settlement / post-event holds | **FD-021** |
| Commission share (80/10/10 attributed; 80/0/20 unattributed) | **FD-029** / **FD-037** |
| Wallet / payment principles | **FD-020** |
| Marketplace BDP ops / venue attribution | **FD-033** |
| Venue Representative identity | **FD-035** |
| Corporate / Logixia payment entity | **FD-034** |

**State machines (linkage):**

- [`SM_Marketplace_Event`](../state-machines/SM_Marketplace_Event.md)
- [`SM_Marketplace_Offer_Event`](../state-machines/SM_Marketplace_Offer_Event.md)
- [`SM_Offer_Claim`](../state-machines/SM_Offer_Claim.md)
- [`SM_Redemption`](../state-machines/SM_Redemption.md)
- [`SM_Payment`](../state-machines/SM_Payment.md)
- [`SM_Refund`](../state-machines/SM_Refund.md)
- [`SM_Settlement`](../state-machines/SM_Settlement.md)
- [`SM_Venue_Partner`](../state-machines/SM_Venue_Partner.md)

**Technical ADRs:**

- [`ADR-006`](../phase-2/adrs/ADR-006_Payment_Gateway_and_Webhook_Architecture.md) — PSP candidate / webhooks
- [`ADR-013`](../phase-2/adrs/ADR-013_Feature_Flags.md) — MoR production money gate

**Living companions:** `docs/core/09_Venue_Partner.md`, `04_Revenue_Model.md`, `13_UI_Guidelines.md`, `18_User_Flows.md`.

---

## Purpose

Define Phase 11 documentation for the **customer-facing Marketplace experience** and supporting Venue Partner fulfilment surfaces:

- Discover and list Marketplace Events and Offer Events
- Book tickets, pay, receive tickets / QR
- Cancel under the **48-hour default** cutoff (FD-039)
- Claim offers and redeem (claim ≠ revenue)
- Capture feedback and no-purchase reasons
- Surface Trust Rank / Venue Performance Rank concepts without inventing formulas
- Deliver mobile-first PWA accessibility for booking flows

Money truth remains owned by Phase 9; this phase owns **customer journey and fulfilment UX** constraints.

---

## Scope

### In scope

- Discovery / search / listing
- Event detail pages
- Booking / ticket issuance
- Payment initiation and confirmation UX (gateway via ADR-006)
- Cancellation (48h default) and refund **placeholder** UX
- QR admission / validation for ticketed Marketplace Events
- Offers, claims, redemption codes/tokens
- Customer feedback collection
- No-purchase reason capture (analytics input — not inventing commercial penalties)
- Customer Trust Rank (concept; formula Unresolved)
- Venue Performance Rank (concept; formula Unresolved)
- Booking history
- Customer notifications (event-driven — Phase 12 owns channel architecture)
- Customer dashboard workspace surfaces
- Accessibility and mobile-first PWA behaviours
- MoR disclosure posture: Logixia **intended** MoR (FD-039)

### Not in scope

- Inventing refund percentages, convenience-fee treatment, or no-show refund rules (FD-039 §16)
- Activating Marketplace Affiliate commercial model
- Category-specific revenue-share variants (inactive unless later approved — FD-039)
- Native iOS / Android apps (inactive — FD-039)
- Dark mode MVP requirement (inactive — FD-039)
- Treating Offer Claim as recognised revenue (FD-037)
- Venue Partner or Marketplace BDP self-releasing settlement
- Enterprise full project CX (Enterprise owns Phase docs / FD-038 — Marketplace venue use does not convert whole Enterprise project to 80/10/10)

---

## Dependencies

| Dependency | Why |
|------------|-----|
| FD-037 / FD-039 / FD-021 | Transaction families, cancel default, settlement timing |
| Phase 9 finance | Payment, refund placeholder, settlement |
| Phase 12 | Notifications, analytics for feedback / no-purchase |
| Approval queues (Phase 13) | Event/offer final approval by Platform Marketplace Operations |
| Venue Partner onboarding (FD-033 / FD-035) | Listing eligibility |
| PWA / UI guidelines | Mobile-first delivery |

---

## Entry criteria

- Marketplace Event vs Offer Event vs Offer Claim vs Redemption distinctions locked in FD-037
- 48h cancellation default documented (FD-039)
- SM_Payment / SM_Refund / Marketplace SMs available
- MoR intended entity disclosed as Logixia; production capture feature-flagged until compliance gate
- Listing approval path: Venue draft → MBDP may recommend → **Platform Marketplace Operations final-approves** (FD-037)

---

## Exit criteria

- Customer journeys documented end-to-end for ticketed event and offer claim/redeem
- Cancellation cutoff behaviour documented including event-specific variation rules
- Refund UX labelled placeholder where % unknown
- QR vs offer-token distinction documented
- Accessibility checklist for booking/pay/cancel flows
- Pilot UAT scripts cover happy path + cancel-before-48h + reject-inside-48h without inventing refund amounts

---

## Transaction families (FD-037 — do not collapse)

Keep separate:

1. **Marketplace Event** — ticketed / attendance event
2. **Marketplace Offer Event** — campaign / offer programme (planned commercial value threshold ₹50,000 is qualification — not a GCE fee or guaranteed GMV)
3. **Event Booking / Event Transaction** — customer purchase of ticket/access
4. **Offer Claim** — customer claims an offer (**not revenue**)
5. **Offer Redemption / Conversion** — fulfilment evidence path
6. **Settlement / Payout** — platform-initiated stakeholder payment (Phase 9)

---

## Discovery & listing

- Customers discover approved, published Events and Offers by city/category/time (exact ranking Unresolved — do not let ads silently override organic integrity if ads activate later)
- Listings show only **final-approved** inventory (FD-037)
- Venue Partners manage own listings within permissions; Marketplace BDP may assist/recommend; Platform Marketplace Ops final-approves
- Self-listing does not remove verification or financial controls

---

## Event detail & booking

Event detail should present (product minimum — copy TBD):

- Title, venue, schedule, city
- Policy version applicable to booking (especially cancellation cutoff)
- Price components **without inventing tax rate display rules** beyond “applicable taxes” until professional validation
- MoR / seller disclosure aligned with validated invoice posture when live
- CTA to book / pay

Booking creates a payment intent (`SM_Payment`) then ticket only after successful capture / approved offline path (tickets are not offline-BDP-pack; customer tickets are online via gateway when money movement is live).

**Production money movement** remains compliance-gated (FD-039). Architecture and UX may proceed behind flags.

---

## Payment & Merchant of Record

- **Intended MoR for Marketplace event tickets:** Logixia Solutions Private Limited (FD-039)
- Platform collects then settles Venue Partner / MBDP per Phase 9 rules
- Razorpay = PSP **candidate** (ADR-006), not Founder law
- Customer UX must never imply Venue Partner is MoR unless a later validated structure says so

---

## Cancellation (48h default) & refund placeholder

### Cancellation cutoff (Founder-locked direction)

Default customer cancellation cutoff:

> **48 hours before event start** (FD-039)

Event-specific variation allowed only if:

- Customer clearly informed **before purchase**
- Variation approved
- Operationally reasonable
- Permitted by applicable law/policy

Preserve applicable **policy version** on each booking.

### Refund economics (explicitly not locked)

FD-039 does **not** define:

- Exact refund percentage
- Refund processing time
- Convenience-fee treatment
- Tax reversal treatment
- Chargeback handling
- No-show treatment

Phase 11 UX must:

- Allow cancel request / status per `SM_Refund`
- Show policy version and cutoff clearly
- Label refund amount rules as **policy pending** until Finance/Legal/Tax approve a schedule
- **Not** hard-code invented percentages in docs or UI copy as Founder-approved

---

## Tickets & QR

- Ticketed Marketplace Events: QR (or equivalent) for admission / validation (FD-037)
- QR validation is fulfilment evidence input toward settlement eligibility — not itself Platform Revenue
- Failed / refunded bookings must invalidate QR per refund completion

---

## Offers, claims, redemption

- Offer Claim ≠ revenue (FD-037)
- Offer Events use redemption code / token / equivalent — do not treat claim token as proof of revenue
- Redemption lifecycle: `SM_Offer_Claim` → `SM_Redemption`
- Abuse / fraud flags route to Ops / Finance holds (Phases 12–13)

---

## Customer feedback & no-purchase reason

### Feedback

Post-attendance / post-redemption feedback capture supports Trust / Venue Performance analytics inputs and support quality — formulas Unresolved.

### No-purchase reason

When a customer abandons booking or declines an offer path, optional structured **no-purchase reason** improves discovery and Venue coaching.

- Reasons are analytics / ops signals
- Do not invent automatic commercial penalties or Trust Rank hits from a single no-purchase reason without Founder approval

---

## Customer Trust Rank & Venue Performance Rank

| Concept | Phase 11 posture |
|---------|------------------|
| **Customer Trust Rank** | Recognised concept in membership / Circle docs; **exact formula Unresolved**. Lead Assist does not directly alter it at launch (FD-031). Booking CX may **display** if product already exposes it — do not invent scoring here |
| **Venue Performance Rank** | Ops/analytics concept for Venue quality (see dashboards narrative). **Exact formula Unresolved**. Must not be secretly sold as paid ranking that bypasses verification |

Advertising / premium visibility (inactive SKUs) must not corrupt Trust Rank, organic ranking integrity, or compliance decisions (FD-028 principles).

---

## Booking history & customer dashboard

Customer dashboard (workspace-scoped per FD-035 / ADR-003) should support:

- Upcoming bookings / tickets
- Past attendance
- Offer claims / redemption status
- Payment / refund status (labels aligned to SM_Payment / SM_Refund)
- Feedback pending
- Notification centre entry points

Do not show estimated Venue/BDP commissions to customers.

---

## Notifications (CX triggers)

Event-driven triggers (channel architecture → Phase 12):

- Booking confirmed / payment failed
- Ticket / QR ready
- Event reminder
- Cancellation cutoff approaching
- Refund requested / completed / rejected
- Offer claimed / redemption confirmed / expired
- Feedback request

Do not invent SLAs beyond Founder-approved timing concepts elsewhere.

---

## Accessibility & mobile-first PWA

- Primary delivery: Progressive Web App (native apps inactive — FD-039)
- Booking / pay / cancel / QR display must work on small viewports
- Follow `docs/core/13_UI_Guidelines.md` accessibility practices (labels, focus, contrast, error text)
- Avoid dark-pattern cancel flows; respect Consumer Protection / e-commerce disclosure direction in FD-039 compliance register
- QR and ticket screens must remain readable offline-enough for venue entry where PWA caching allows (exact offline ticket strategy Pending Technical Design)

---

## Settlement timing note (customer-visible honesty)

Customers pay for tickets; Venue Partner settlement follows completion + hold rules (FD-021) and platform batch payout (FD-037). Customer UX should not promise instant Venue payout.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Invented refund % in UI | Placeholder + policy version; Phase 9 Unresolved |
| Offer Claim treated as GMV/revenue | FD-037 separation + analytics definitions |
| MoR mis-disclosure | FD-039 intended MoR + validation gate |
| Cancel after cutoff without exception audit | SM_Refund + Ops exception queue |
| Inaccessible checkout | A11y checklist in Phase 14 UAT |
| Ads corrupting Trust / ranking | Keep ad SKUs inactive; integrity rules |

---

## Unresolved

- Exact refund percentage schedules and timelines
- Tax display / invoice PDF customer artefacts pending professional validation
- Exact Trust Rank and Venue Performance Rank formulas
- No-purchase reason taxonomy final list
- Exact QR crypto/rotating-code design
- Offline ticket cache behaviour
- Chargeback customer messaging matrix

---

## Related documents

- FD-037, FD-039, FD-021, FD-029, FD-033, FD-034, FD-035
- Marketplace & payment state machines listed above
- Phase 9 (finance), Phase 12 (notifications/analytics), Phase 13 (approval/moderation), Phase 14 (e2e booking tests)
