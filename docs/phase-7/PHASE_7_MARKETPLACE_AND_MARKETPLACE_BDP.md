# Phase 7 — Marketplace and Marketplace BDP

| Field | Value |
|-------|-------|
| **Phase** | 7 |
| **Status** | **Implementation Complete** on gce-dev (see `PHASE_7_IMPLEMENTATION_NOTES.md`) — non-blocking Legal/Tax/refund/rank-weight items remain |
| **Classification** | Primarily **Business** (FD-033, FD-037, FD-039, FD-029, FD-021) |
| **Date** | 2026-08-08 |

---

## 1. Authority

| Source | Owns |
|--------|------|
| **FD-033** | Marketplace BDP operating architecture (units, venues, RM, exit) |
| **FD-037** | Transaction families, approval, unattributed **80/0/20**, redemption, payout direction |
| **FD-039** | Intended MoR Logixia; 48h cancel default; pack payment online/offline; refund economics pending |
| **FD-029** | Commission/fee/finance numbers; attributed **80/10/10** |
| **FD-021** | Settlement engine principles |
| **FD-028** | Recognition / offer planned value treatment |
| **FD-034** | Contracting / payment-receiving constitution |
| Constants | `docs/core/36_Commercial_Constants.md` |

**Label key:** **Business** · **Technical** · **PENDING PROFESSIONAL VALIDATION**

---

## 2. Purpose

Specify Marketplace Events, Offer Events, claims, redemptions, Venue Partner / Venue Representative flows, Marketplace BDP Franchise Units (20/2/40), attribution vs unattributed splits, moderation/approval, inactivity/reassignment, settlement cadence, cancellation/MoR direction, analytics/dashboards — without activating Affiliate or inventing refund percentages.

---

## 3. Scope

1. Marketplace BDP Franchise Units: **20** venues / unit; max **2** units; **40** venues standard max
2. Venue Partner onboarding and lifecycle
3. Venue Representative (venue-side natural person)
4. Attribution to Marketplace BDP
5. Unattributed revenue path
6. Splits: attributed **80/10/10** vs unattributed **80/0/20**
7. Marketplace Event (ticketed)
8. Offer Event + offer claim + redemption + QR
9. ₹50,000 minimum **planned commercial value** for Offer Events
10. 72h claim validity; 15-day campaign max; 100-customer cap
11. Moderation and approval
12. Inactivity and reassignment
13. Settlement and monthly launch payout posture
14. 48h customer cancellation default
15. MoR intended: **Logixia Solutions Private Limited** (validation-gated)
16. Refund policy placeholder (economics pending)
17. Ranking, analytics, dashboards
18. State machines and audit

---

## 4. Not in scope

- Connect / Enterprise verticals — Phases 5–6 / 8
- Marketplace Affiliate commercial activation — **inactive** (FD-032/033/039)
- Category-specific revenue-share variants — inactive unless later FD (FD-037/039)
- Exact refund %, convenience fee, chargeback, no-show economics — **not** defined by FD-039
- MoR GST/invoice/TDS/PA production config — **PENDING PROFESSIONAL VALIDATION**
- Advertising/premium listing SKUs — inactive
- Wallet cash-out — inactive
- Exact Month 1 / Month 2+ ₹ revenue targets for MBDP — Pending Founder Approval

---

## 5. Dependencies

| Dependency | Why |
|------------|-----|
| Phase 4 | Marketplace BDP, Venue Rep assignments; workspaces |
| Phase 3 | Payments, webhooks, jobs, flags |
| FD-020/021 | Ledger + settlement eligibility |
| ADR-006 | Payment gateway + webhooks |
| State machines listed in §10 | Lifecycles |

---

## 6. Entry criteria

- Identity/workspaces for Marketplace BDP and Venue side
- Payment staging + webhook verification path
- Feature flags: Affiliate off; MoR live money gated
- Commercial constants current for 80/10/10 and 80/0/20

## 7. Exit criteria

- Unit caps 20/2/40 enforced
- Attribution required for MBDP 10%; unattributed path retains 20% GCE with **0%** MBDP (not “pending MBDP”)
- Offer Event gates: ₹50k planned value, 15-day max, 100 customers, 72h claim
- Offer claim is **not** revenue by itself
- Redemption/QR flows audited; settlement only after FD-021 eligibility
- 48h cancel default implemented with event-specific disclosed variations allowed per FD-039
- Refund module exists as workflow placeholder without invented percentages
- MoR production ticket money movement blocked until professional validation
- Dashboards for MBDP, Venue, Platform ops without cross-leakage

---

## 8. Domain model summary

### 8.1 Marketplace BDP unit (**Business**)

| Constant | Value | Source |
|----------|-------|--------|
| Direct unit fee | **₹50,000** (non-refundable after activation) | FD-029/033 |
| Finance option | **₹60,000** = ₹5,000 + ₹55,000 Recoverable Balance | FD-029/033 |
| Recovery | Month 0; ≤ ₹5,000/cycle from earned approved MBDP commission; no cash shortfall/auto-debit/interest | FD-029 |
| Active Venue Partners / unit | Max **20** | FD-029/033 |
| Max active units / MBDP | **2** (second not automatic) | FD-033 |
| Standard max venues | **40** (2×20) | FD-033 |
| Territory model | **Venue-attribution based**; no permanent city/zone ownership; multiple MBDPs may operate same city | FD-033 |
| Portfolio objective | Up to 20 active Venue Partners within ten months / unit (not guaranteed income) | FD-033 |
| Attributed commission | **10%** of Eligible Marketplace Event Revenue (from GCE’s 20%) | FD-029/033/037 |

### 8.2 Revenue splits (**Business**)

**Attributed (valid MBDP attribution)** — 80% Venue Partner · 10% Marketplace BDP · 10% GCE net.

**Unattributed** — 80% Venue Partner · **0%** Marketplace BDP · **20%** GCE.

Later MBDP assignment does **not** automatically create retroactive commission on historical unattributed revenue (FD-037).

### 8.3 Venue side (**Business**)

| Entity | Role |
|--------|------|
| Venue Partner | Commercial venue stakeholder (org-level as modelled) |
| Venue Representative | Natural person venue-side; **distinct** from Marketplace BDP |
| Marketplace BDP | Primary RM for assigned venues (FD-033); no settlement/refund authority |

### 8.4 Offer / campaign constants (**Business**)

| Constant | Value |
|----------|-------|
| Min planned commercial value | **₹50,000** — qualification threshold; **not** a GCE fee, guaranteed GMV, cash deposit, or recognised revenue |
| Claim validity | **72 hours** after claim (where applicable) |
| Campaign max duration | **15 days** |
| Max customers / campaign | **100** |
| Offer Claim | **Not revenue** — needs approved conversion/payment event |

### 8.5 Not commission-creating alone (**Business**)

Venue onboarding, listing, expected campaign value, proposal value, booking enquiry, unpaid/failed/reversed payment, uncompleted event, fraud, draft profile, KYC submit, meeting, non-revenue assistance (FD-029/033).

---

## 9. Workflows

### 9.1 MBDP onboarding and pack payment (**Business**)

1. Apply → approve with SoD → pay direct or financed pack (online default; offline Admin bank workflow per FD-039).
2. Activate unit; set recoverable balance if financed.
3. Onboard Venue Partners toward cap 20; second unit only with platform approval + utilisation conditions.

### 9.2 Venue Partner → attribution (**Business**)

1. Venue onboarding/verification (`SM_Venue_Partner`).
2. Attribution record to MBDP when valid (`SM_Marketplace_BDP_Attribution`).
3. If no valid attribution at earning event → unattributed split; do not park “pending MBDP 10%.”

### 9.3 Marketplace Event (ticketed) (**Business** + **PENDING PROFESSIONAL VALIDATION**)

1. Create/moderate/approve event (`SM_Marketplace_Event`).
2. Intended MoR: **Logixia** collects then settles Venue / MBDP entitlements (FD-039/034).
3. Production money movement gated on GST/invoice/gateway/refund accounting/TDS/settlement compliance/PA applicability validation — do not invent rates.
4. Default customer cancellation cutoff: **48 hours before event start**; event-specific variation allowed if disclosed, approved, reasonable, legally permitted.
5. Ranking/discovery: platform rules; no paid Lead Assist-style priority abuse; advertising SKUs inactive.

### 9.4 Offer Event → claim → redemption (**Business**)

1. Offer Event must meet ₹50k planned value, ≤15 days, ≤100 customers (`SM_Marketplace_Offer_Event`).
2. Customer claim (`SM_Offer_Claim`) — non-revenue; 72h validity where applicable.
3. Redemption via QR / approved flow (`SM_Redemption`).
4. Revenue recognition only on approved conversion/payment events (FD-037/028).

### 9.5 Moderation, approval, inactivity, reassignment (**Business**)

- Platform moderation/approval for events/offers per FD-037.
- Marketplace BDP has no settlement/refund authority (FD-033).
- Inactivity/reassignment of venues or units: audited; historical commission stays with valid attribution at earning date.
- Performance processes per FD-033; serious misconduct may suspend/terminate.

### 9.6 Settlement and payout (**Business** + **Technical**)

- Follow FD-021 eligibility (holds, reconciliation).
- Commission/recovery for financed MBDP mirrors FD-029 Month 0 rules.
- Launch posture: monthly calculation/payout cadence aligned with Connect-style monthly processing unless a later FD changes Marketplace-specific banking days (Pending Technical Design where not stated).
- Payout direction per FD-037 (Venue entitlement vs platform retained vs MBDP).

### 9.7 Refunds (**Business** placeholder)

- Refund **workflow** and state machine exist (`SM_Refund`).
- Refund %, timelines, convenience fees, chargebacks, no-shows: **pending applicable policy** — do not invent (FD-039).
- UI may show “policy pending / case-based” rather than fake percentages.

### 9.8 Analytics and dashboards (**Business** + **Technical**)

- Marketplace BDP dashboard: units, venues, attribution, commission states, recovery, event funnel.
- Venue dashboard: events/offers, claims, redemptions, entitlements (not MBDP-only finance tools).
- Platform ops: moderation queues, unattributed revenue reporting, MoR gates.
- Ranking/analytics must not leak PII across venues.

---

## 10. State machines refs

| Machine | Path |
|---------|------|
| Marketplace BDP attribution | `docs/state-machines/SM_Marketplace_BDP_Attribution.md` |
| Venue Partner | `docs/state-machines/SM_Venue_Partner.md` |
| Marketplace Event | `docs/state-machines/SM_Marketplace_Event.md` |
| Offer Event | `docs/state-machines/SM_Marketplace_Offer_Event.md` |
| Offer Claim | `docs/state-machines/SM_Offer_Claim.md` |
| Redemption | `docs/state-machines/SM_Redemption.md` |
| Payment | `docs/state-machines/SM_Payment.md` |
| Refund | `docs/state-machines/SM_Refund.md` |
| Commission | `docs/state-machines/SM_Commission.md` |
| Settlement | `docs/state-machines/SM_Settlement.md` |

---

## 11. Permissions notes

| Actor | May | Must not |
|-------|-----|----------|
| Marketplace BDP | Manage attributed venues (ops); view attributed earnings | Settlement/refund authority; take unattributed 10%; own city exclusivity |
| Venue Representative | Operate venue events/offers/redemptions as scoped | MBDP commission controls; platform finance |
| Platform Admin | Moderate/approve; offline pack payments; reassign | Self-deal |
| Finance Admin | Settlements per FD-021 | Bypass MoR validation gates |
| Customer | Claim/purchase/cancel per rules | Force recognition without payment |

Affiliate workspace: do not ship.

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Treating unattributed 10% as payable later | FD-037 hard rule + reports labelled GCE retained |
| MoR go-live without tax validation | Feature flag + compliance checklist |
| Inventing refund % | Placeholder only |
| Claim counted as revenue | Separate claim vs payment entities |
| MBDP settlement powers | RBAC deny |
| Retroactive attribution | Prospective by default |

---

## 13. Unresolved items

| Item | Status |
|------|--------|
| Refund/chargeback/no-show economics | Pending policy / Legal / Finance |
| MoR production compliance pack | PENDING PROFESSIONAL VALIDATION |
| Exact MBDP Month 1+ ₹ targets | Pending Founder Approval |
| Banking-day payout adjustment | Pending Technical Design |
| Category-specific share variants | Inactive |
| Pilot city | Undecided — non-blocking |

---

## 14. Implementation notes (Technical)

1. Enforce venue caps at unit and person levels in domain services.
2. Split calculator: branch on attribution presence → 80/10/10 vs 80/0/20.
3. Offer Event validators: planned value ≥ 50000 INR, duration ≤ 15 days, customers ≤ 100.
4. Claim expiry job at 72h (ADR-014).
5. QR redemption tokens: single-use, scoped, audited.
6. MoR live flag separate from staging sandbox payments.
7. Refund module: states without amount policy constants hardcoded as final.
8. Monthly settlement sweep job idempotent (FD-021).
9. Rankings: deterministic audited inputs; no covert paid priority for inactive SKUs.
10. Dashboards use workspace RLS; never service role in browser.

---

## 15. Cross references

- FD-033, FD-037, FD-039, FD-029, FD-021, FD-028, FD-034
- `docs/core/36_Commercial_Constants.md` (Marketplace sections)
- Phase 4 roles; Phase 3 payments/jobs
