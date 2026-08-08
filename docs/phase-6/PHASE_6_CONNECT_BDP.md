# Phase 6 — Connect BDP

| Field | Value |
|-------|-------|
| **Phase** | 6 |
| **Status** | **Implementation Complete** on gce-dev (see `PHASE_6_IMPLEMENTATION_NOTES.md`) — non-blocking Legal/Tax/OD items remain |
| **Classification** | Primarily **Business** (FD-025, FD-029, FD-034, FD-036, FD-039) |
| **Date** | 2026-08-08 |

---

## 1. Authority

| Source | Owns |
|--------|------|
| **FD-025** | Connect BDP commercial and operating architecture (except finance recovery superseded in part) |
| **FD-029** | Commission Engine; Commission-Recovery Finance Option; commission states |
| **FD-034** | Circles/members/territory/data remain Logixia/GCE platform assets — Connect BDP does not own them |
| **FD-036** | Attribution, organic/unattributed membership, RM operational assignment |
| **FD-039** | BDP pack online/offline bank payment; inactive items |
| **FD-032** | Target credit once at 15-member platform activation |
| Constants | `docs/core/36_Commercial_Constants.md` |
| Narrative | `docs/core/06_CBDP.md` (prefer FD numbers on conflict) |

**Label key:** **Business** · **Technical** · **PENDING PROFESSIONAL VALIDATION**

---

## 2. Purpose

Define Connect BDP Franchise Unit onboarding, licensing/payment, city deployment, Circle building, verification, attribution, 15-member target credit, 20% attributed-only commission, Month 0 recovery, disputes, RM, handover, inactivity, suspension/termination, reporting, dashboard, state machines, and audit — without granting ownership of Circles or commission on unattributed revenue.

---

## 3. Scope

1. Connect BDP onboarding and eligibility
2. Commercial Licence / Franchise Unit (IBP-style pack language only as synonymous commercial pack — prefer **Connect BDP Franchise Unit**)
3. BDP pack payment: online default; offline bank Admin workflow (FD-039)
4. Unit economics and capacity
5. City / territory deployment (Performance-Protected Assigned Territory — not permanent ownership)
6. Circle building and milestone reviews
7. Verification before platform activation credit
8. Attribution to membership revenue
9. Target credit at **15** (once)
10. Commission **20%** of eligible attributed Connect subscription revenue only
11. Commission-Recovery Finance Option; recovery from **Month 0**
12. Disputes on attribution/commission
13. Relationship Manager interaction
14. Handover / reassignment
15. Inactivity, suspension, termination
16. Reporting and Connect BDP dashboard
17. State machine links and audit

---

## 4. Not in scope

- Membership product internals — Phase 5 (consume activation/allocation events)
- Marketplace / Enterprise BDP — Phases 7–8
- Automatic commission on organic/unattributed membership — **forbidden** (FD-036)
- Automatic 20% on workshop/Lead Assist/Marketplace/Enterprise — not automatic (FD-025/029)
- Wallet cash-out — inactive
- Affiliate programmes — inactive
- Exact GST/TDS and banking-day payout adjustment — PENDING PROFESSIONAL VALIDATION / Pending Technical Design

---

## 5. Dependencies

| Dependency | Why |
|------------|-----|
| Phase 4 | Connect BDP role assignment + workspace |
| Phase 5 | Membership activation, Circle dual status, seat allocation |
| FD-020/021 | Ledger and settlement eligibility |
| ADR-006/007/014 | Payments, ledger, recovery jobs |
| `SM_Connect_BDP_Attribution`, `SM_Commission`, `SM_Payment`, `SM_Settlement`, `SM_Circle` | Lifecycles |

---

## 6. Entry criteria

- Member and Circle platform events available (Phase 5)
- Connect BDP workspace and assignment model (Phase 4)
- FD-029 recovery rules accepted
- Feature flags keep inactive commerce off

## 7. Exit criteria

- Unit fee paths: direct ₹50,000 **or** financed ₹60,000 (₹5,000 + ₹55,000 Recoverable Balance) implemented per FD-029
- Commission engine path only on **valid attribution**
- Target credit fires once at formal 15-member platform activation
- Recovery starts Month 0 on earned/approved/settlement-eligible commission; cap lower of ₹5,000 or available commission; no compulsory cash shortfall; no auto bank debit; no post-activation interest
- Unattributed membership revenue does not create CBDP entitlement
- Dashboard shows unit progress, attribution, commission states — not Circle ownership claims
- Suspension/termination does not silently erase Recoverable Balance
- Audit complete for payment, attribution changes, recovery, exit

---

## 8. Domain model summary

### 8.1 Commercial unit (**Business**)

| Constant | Value | Source |
|----------|-------|--------|
| Direct Franchise Unit fee | **₹50,000** per unit (upfront; one-time; non-refundable after activation; not a security deposit) | FD-025/029 |
| Finance option total | **₹60,000** | FD-029 |
| Financed initial payment | **₹5,000** | FD-029 |
| Recoverable Balance | **₹55,000** | FD-029 |
| Max recovery per commission cycle | Lower of **₹5,000** or available earned & approved commission | FD-029 |
| Recovery start | **Month 0** — first cycle with valid earned, approved, settlement-eligible commission after activation | FD-029 |
| Circles per unit | Up to **5** | FD-025 |
| Development target | **5** platform-activated Circles within **10** months | FD-025 |
| Pace note | ~one activated Circle every **two** months — not every month | FD-025 |
| Milestone reviews (cumulative activated Circles) | M2:1 · M4:2 · M6:3 · M8:4 · M10:5 | FD-025 |
| Commission | **20%** of eligible attributed GCE Connect subscription revenue | FD-025/029 |
| Renewal commission | Continues at 20% while unit active, duties continue, revenue eligible | FD-025 |
| Tier maxima (units) | T1: **10** · T2: **5** · T3: **2** (maxima, not guaranteed appointments) | FD-025 |
| Person/controlled-entity standard max | **2** active units (higher needs special approval) | FD-025 |

Territory: **Performance-Protected Assigned Territory** — not permanently owned (FD-025). Marketplace/Enterprise territories remain separate (FD-025/026).

### 8.2 Assets ownership (**Business** — FD-034)

Circles, members, territory definitions, and data remain platform assets under **Logixia Solutions Private Limited** / GCE brand. Connect BDP operates under licence; does not own Circles or bind Logixia by default.

### 8.3 Commissionability (**Business**)

**Commissionable when eligible & attributed:** Associate subscription/renewal; Core upgrade/renewal (when Core exists); Tag 3; Tag 4.

**Not automatically commissionable:** GST/taxes; transfer/admin fees; event/training/advertising/sponsorship/technology fees; Lead Assist; Marketplace/Enterprise revenue; penalties; complimentary credits; uncollected amounts; **organic/unattributed membership revenue** (FD-036).

Commission states (FD-029): Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed / Recoverable Balance — not interchangeable.

---

## 9. Workflows

### 9.1 Onboarding → pack payment → activation (**Business**)

1. Application / eligibility checks (ops-defined; SoD on approvals).
2. Select direct pay or Commission-Recovery Finance Option.
3. **Payment:** online platform default; rare offline NEFT/RTGS/cheque via Admin-recorded workflow with evidence (FD-039). Cash not normal.
4. Training/activation gates per FD-025 operating practice.
5. Franchise Unit becomes active; Recoverable Balance recorded if financed.
6. Assign Performance-Protected territory / operating city deployment metadata (not freehold).

### 9.2 Circle building → verification → activation credit (**Business**)

1. Build Circles toward capacity (up to 5 per unit).
2. Membership joins may be attributed when valid (FD-036).
3. At **15** approved & paid active members path: verification, seat allocation, onboarding, platform confirmation, compliance clear, audit → platform activation may occur.
4. **Target credit once** at that formal 15-member platform activation — not again at 20 or 40 (FD-032).
5. Milestone reviews at months 2/4/6/8/10 against cumulative activated Circles.

### 9.3 Attribution (**Business**)

1. Attribution record links membership earning events to Franchise Unit when rules satisfied (`SM_Connect_BDP_Attribution`).
2. Missing attribution ⇒ no CBDP commission; GCE retains share; later attribution **prospective by default** (FD-036).
3. Reassignment later does not automatically move historical earned commission (FD-029/036).
4. Circle transfer ≠ automatic attribution transfer.

### 9.4 Commission and recovery (**Business** + **Technical**)

1. Calculate monthly on eligible collected, linked, activated, settlement-eligible, **validly attributed** revenue.
2. Normal processing first day of following month (banking-day adjustment Pending Technical Design).
3. If financed: recover from earned & approved commission only, Month 0 onward, ≤ ₹5,000/cycle; unrecovered carries forward.
4. No compulsory cash shortfall; no automatic personal-bank debit; no additional interest after activation (FD-029).
5. Settlement eligibility still gated by FD-020/021 (payment ≠ settlement).

### 9.5 RM, handover, disputes (**Business**)

- Platform Operations may assign RM support (FD-036) — no automatic RM commission layer; no automatic finance authority.
- Handover/reassignment of unit responsibility: audited; prospective attribution rules apply.
- Disputes: attribution/commission holds per Commission Engine; SoD on resolution; no silent ledger deletes.

### 9.6 Performance, inactivity, suspension, termination (**Business**)

- Missing **two consecutive** milestone review periods → formal performance review + **sixty-day** corrective process — **not** automatic cancellation (FD-025).
- Serious misconduct → immediate suspension/termination possible.
- Exit/suspension does **not** automatically erase Recoverable Balance (FD-029).
- Expansion: not automatic; after qualifying (5 Circles + performance/compliance); GCE may reserve additional unit opportunity up to **5 months**; separate fee; separate 5-Circle/10-month target (FD-025).

### 9.7 Reporting and dashboard (**Business** + **Technical**)

Connect BDP dashboard: unit status, territory assignment, Circle build progress, milestone status, attribution pipeline, commission by state, recovery balance, disputes.  
Must not claim ownership of Circles/members or show unauthorised cross-territory PII.

---

## 10. State machines refs

| Machine | Path |
|---------|------|
| Connect BDP attribution | `docs/state-machines/SM_Connect_BDP_Attribution.md` |
| Commission | `docs/state-machines/SM_Commission.md` |
| Settlement | `docs/state-machines/SM_Settlement.md` |
| Payment | `docs/state-machines/SM_Payment.md` |
| Circle | `docs/state-machines/SM_Circle.md` |
| Membership | `docs/state-machines/SM_Membership.md` |
| Role assignment | `docs/state-machines/SM_Role_Assignment.md` |

---

## 11. Permissions notes

| Actor | May | Must not |
|-------|-----|----------|
| Connect BDP | Operate unit workspace; view attributed data; submit verification evidence | Own Circles; take unattributed commission; settle self; erase Recoverable Balance |
| Platform Admin | Activate units; record offline payments; resolve disputes with SoD | Self-deal on own unit |
| Finance Admin | Settlement operations per FD-021 | Bypass audit |
| RM | Operational support | Settlement/refund/ledger authority |
| Member/GB | Per Phase 5 | Grant CBDP commission |

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Commission without attribution | Hard gate in Commission Engine |
| Double target credit at 20/40 | Single credit flag on Circle activation event |
| Treating territory as owned freehold | FD-034/025 copy in UI + contracts |
| Recovery before earned commission | Month 0 definition = first eligible cycle only |
| Offline payment without audit | Admin workflow + evidence mandatory |
| Erasing recoverable on exit | Persist balance; settlement policy |

---

## 13. Unresolved items

| Item | Status |
|------|--------|
| Banking-day payout adjustment | Pending Technical Design |
| GST/TDS on franchise fees and commissions | PENDING PROFESSIONAL VALIDATION |
| Exact dispute SLA days | Pending ops design unless FD-stated |
| Illustrative ₹80,000 commission example | Illustrative only — not guaranteed income (FD-025) |

---

## 14. Implementation notes (Technical)

1. Model `connect_bdp_franchise_unit` with payment mode, recoverable balance, territory refs, status.
2. Attribution entity required before commission line creation.
3. Recovery job monthly: idempotent, cap ₹5,000, only from approved earned commission (ADR-014).
4. Milestone scheduler evaluates activated Circle counts at review boundaries.
5. Offline pack payment: Admin Server Action + immutable evidence metadata.
6. Dashboard reads via RLS scoped to unit assignment; service role only in workers.
7. Commission state transitions follow FD-029 vocabulary exactly.
8. Feature flags: no Affiliate, no wallet cash-out.
9. Audit: unit activation, attribution attach/detach, recovery postings, suspension/termination.
10. Do not implement ZBP deposits or legacy finance-inactive narrative superseded by FD-029.

---

## 15. Cross references

- FD-025, FD-029, FD-034, FD-036, FD-039, FD-032
- `docs/core/36_Commercial_Constants.md` (Connect BDP section)
- Phase 5 membership/Circle events; Phase 4 workspace
