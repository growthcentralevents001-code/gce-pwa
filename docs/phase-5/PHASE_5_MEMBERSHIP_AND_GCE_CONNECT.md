# Phase 5 — Membership and GCE Connect

| Field | Value |
|-------|-------|
| **Phase** | 5 |
| **Status** | Documentation — implementation-ready |
| **Classification** | Primarily **Business** (FD-022, FD-027, FD-030, FD-032, FD-036, FD-039) |
| **Date** | 2026-08-08 |

---

## 1. Authority

| Source | Owns |
|--------|------|
| **FD-022** | Membership lifecycle |
| **FD-027** | Membership commercial and operating architecture |
| **FD-030** | Circle architecture and governance |
| **FD-032** | Dual status mapping; activation credit; GB supersessions |
| **FD-036** | Attribution, approval, activation ≠ allocation, waitlist, transfer, geographic routing, RM |
| **FD-039** | Aadhaar not mandatory by default; Core direct purchase inactive; compliance gates |
| **FD-024** | Circle lifecycle ownership boundaries (with FD-030/032) |
| **FD-025 / FD-029** | Connect BDP commission interaction (attribution required) — detail in Phase 6 |
| Constants | `docs/core/36_Commercial_Constants.md` |
| Living | `docs/core/38_Circle_Architecture.md`, `05_Memberships.md` |

**Label key:** **Business** · **Technical** · **PENDING PROFESSIONAL VALIDATION**

---

## 2. Purpose

Specify implementation-ready rules for GCE Connect Circle Membership (Associate launch tier), Circle dual statuses, seats, payments/activation, waitlist, transfer, Governing Body operations support, attendance/meetings, renewal/suspension/cancellation, member dashboard, and audit — without collapsing activation into allocation or inventing Core purchase.

---

## 3. Scope

1. Associate membership (official launch product)
2. Core tier as **future / achievement-based** boundary — **not** directly purchasable at launch (FD-027/039)
3. Registration and profile completion
4. KYC posture (Aadhaar not mandatory by default)
5. Category / specialisation (one approved Business Specialization)
6. Business Tags (Tag 1–2 included; Tag 3/4 paid additives)
7. Seat availability and reservation
8. Payment collection and reconciliation hooks
9. **Activation ≠ Circle allocation** (hard invariant)
10. Waitlist
11. Circle seat allocation / occupancy
12. Circle lifecycle + constitutional status (dual families)
13. Thresholds **15 / 20 / 40** and platform activation credit at 15
14. Transfer rules
15. Governing Body, Circle Finance Coordinator, Sergeant-at-Arms
16. Attendance and meetings
17. Renewal, grace, freeze, suspension, cancellation
18. Member dashboard
19. Audit requirements
20. Links to state machines

---

## 4. Not in scope

- Connect BDP onboarding, franchise fees, recovery finance — Phase 6
- Paid Lead Assist / ₹500 fee / escrow — **inactive** (FD-031/039)
- Core Tier direct purchase / nationwide Core launch — **inactive**
- Wallet cash-out — **inactive**
- Affiliate membership commission programmes — inactive
- Exact post-activation refund matrix — Pending Founder/Legal Approval (FD-027)
- GST/TDS rates — PENDING PROFESSIONAL VALIDATION
- Workshop pricing/commission — Unresolved (FD-030)

---

## 5. Dependencies

| Dependency | Why |
|------------|-----|
| Phase 3 | Payments clients, jobs, flags, validation |
| Phase 4 | User, assignments, member workspace |
| FD-028 | Recognition: collection + activation conditions |
| FD-021 / Phase settlement docs | Payment ≠ settlement |
| `SM_Membership`, `SM_Circle`, `SM_Circle_Seat`, `SM_Payment`, `SM_Connect_BDP_Attribution`, `SM_KYC_Verification` | Lifecycles |

---

## 6. Entry criteria

- Phase 4 identity/workspace usable for Member workspace
- Commercial constants file current for Associate pricing and Tags
- Dual Circle status rules accepted (FD-032)
- Payment provider staging available (or Admin offline bank recording path per FD-039)

## 7. Exit criteria

- Activation path cannot allocate a seat as a side effect without explicit allocation workflow
- Dual status fields preserved (lifecycle + constitutional)
- Seat reservation **7 days**, renewal notice **30 days**, grace **30 days**, freeze max **90 days** enforced per FD-027/022
- Waitlist and transfer flows match FD-036/027
- Member dashboard shows membership + seat + Circle statuses without exposing admin finance
- Audit events for approve/activate/allocate/transfer/suspend/cancel
- Core purchase and paid Lead Assist remain flagged off
- Aadhaar not required by default in KYC UX

---

## 8. Domain model summary

### 8.1 Membership product (**Business**)

| Item | Rule | Source |
|------|------|--------|
| Launch product | GCE Connect Circle Membership — **Associate Tier** | FD-027 |
| Member title | GCE Connect Circle Member | FD-027 |
| Billing cadence (launch) | **Quarterly only** | FD-027 |
| Associate price | **₹6,000 per quarter** + applicable taxes | FD-027 |
| Future Core price | **₹9,000 per quarter** + taxes — **not directly purchasable at launch** | FD-027/039 |
| Tags included | Tag 1 and Tag 2 | FD-027 |
| Tag 3 / Tag 4 | Each **+25%** of active base subscription | FD-027 |
| Max Tags | **4** | FD-027 |
| Specializations | **1** approved Business Specialization | FD-027 |
| Primary seats | **1** physical Circle seat per membership | FD-027 |

### 8.2 Hard invariant — activation ≠ allocation (**Business**)

> Membership **activation** (commercial/platform active membership after payment/approval conditions) is **not** the same event as **Circle seat allocation**.

- Legitimate activation may occur without immediate seat allocation (waitlist / capacity).
- Allocation requires seat availability, specialisation fit, and workflow approval per FD-036/022.
- Absence of Connect BDP attribution must **not** block legitimate membership activation (FD-036); unattributed share remains with GCE — not “pending CBDP commission.”

### 8.3 Circle dual status (**Business** — FD-032)

Preserve **both** families; do not collapse to one enum.

| Approved & paid active members | Lifecycle | Constitutional |
|--------------------------------|-----------|----------------|
| 0–14 | Formation | Formation Circle |
| 15–19 | Active Growth | Formation Circle |
| 20–39 | Active Growth | Provisionally Active Circle |
| 40 | Full Capacity | Fully Constituted Circle |

- Max seats **40**; seat distribution across four GC Power Sectors is **flexible** (not rigid 10/10/10/10).
- Platform activation may occur at **15** after verification, seat allocation, onboarding, platform confirmation, no blocking compliance issue, and audit recording.
- Connect BDP **target credit** is earned **once** at formal 15-member platform activation — **not** again at 20 or 40.
- Do **not** describe 20 as a full Circle.

### 8.4 Governance roles (within Circle)

| Role | Notes |
|------|-------|
| Governing Body | Support governance; does not own Circles (FD-030) |
| Circle Finance Coordinator | Current finance-support title; not personal fee collector; Treasurer = legacy |
| Sergeant-at-Arms | GB role family (FD-030/taxonomy) |
| Term | **Six months** (FD-030/032) |

---

## 9. Workflows

### 9.1 Registration → KYC → category (**Business**)

1. User registers; enters Member workspace when eligible.
2. Profile + category/specialisation application (one specialization).
3. KYC as required by workflow — **Aadhaar not mandatory by default** (FD-039). Collect minimum necessary PII.
4. Platform Taxonomy / ops approve specialization/tags per FD-030 limits (GB does not finally invent taxonomy).

### 9.2 Seat availability → reservation → payment (**Business**)

1. Check seat availability for specialization/Circle routing (geographic routing per FD-036).
2. Seat reservation window: **7 days** (FD-027/022).
3. Payment: online platform payment is **default**; rare offline bank payment only via authorised Admin-recorded workflow with evidence/audit (FD-039). Cash is not a normal activation method.
4. Recognition conditions follow FD-028 (collection + activation) — payment record ≠ settlement.

### 9.3 Approval → activation → (optional) allocation (**Business**)

1. Approval authority per FD-036 (platform rules; GB cannot independently approve/activate membership).
2. Activation marks membership commercially/platform-active when conditions met.
3. Allocation assigns Circle seat when capacity and rules allow; else waitlist.
4. Attribution to Connect BDP recorded only when valid (Phase 6 / `SM_Connect_BDP_Attribution`).

### 9.4 Waitlist (**Business**)

- When no seat: membership may still activate per rules; seat allocation deferred.
- Waitlist ordering/routing: follow FD-036; do not invent preferential paid queue.

### 9.5 Transfer (**Business**)

| Rule | Value |
|------|-------|
| First transfer in 12 months | Free |
| Additional transfer same 12 months | **₹1,000 + tax** (Administrative Fee Revenue — not automatically Connect BDP commissionable) |
| Circle transfer | Does **not** automatically transfer Connect BDP attribution (FD-036/029) |

### 9.6 Renewal / grace / freeze (**Business**)

| Parameter | Value |
|-----------|-------|
| Renewal notice | 30 days before expiry |
| Grace | 30 days after expiry |
| Freeze maximum | 90 days |
| Recommended seat protection during freeze | Up to 30 days (not automatic full-90-day seat protection) |
| Rejoining fee at launch | None |

### 9.7 Suspension / cancellation (**Business**)

- Progressive operational holds vs misconduct escalation per FD-022/027.
- Post-activation refunds normally **non-refundable**; exact matrix Pending Founder/Legal Approval.
- GB cannot independently terminate membership (FD-030).

### 9.8 Attendance and meetings (**Business**)

- Circles operate meetings/attendance under Circle operating rules (FD-030 / living Circle docs).
- Attendance may affect operational standing; do not invent undocumented financial penalties.
- Workshop payments via approved platform channels; Connect BDP does **not** automatically earn 20% of workshop revenue (FD-030).

### 9.9 Member dashboard (**Business** + **Technical**)

Show: membership tier/status, Tags, specialization, seat/waitlist state, Circle dual statuses, renewal dates, transferable actions, KYC state.  
Do not expose ledger internals, other members’ PII beyond allowed Circle context, or Admin finance tools.

---

## 10. State machines refs

| Machine | Path |
|---------|------|
| Membership | `docs/state-machines/SM_Membership.md` |
| Circle | `docs/state-machines/SM_Circle.md` |
| Circle seat | `docs/state-machines/SM_Circle_Seat.md` |
| Payment | `docs/state-machines/SM_Payment.md` |
| Connect BDP attribution | `docs/state-machines/SM_Connect_BDP_Attribution.md` |
| KYC | `docs/state-machines/SM_KYC_Verification.md` |
| Commission (downstream) | `docs/state-machines/SM_Commission.md` |

---

## 11. Permissions notes

| Actor | May | Must not |
|-------|-----|----------|
| Member | Manage own profile, pay, request transfer, view own dashboard | Approve own exceptional entitlements; change fees/taxonomy |
| GB | Governance support, attendance/meeting ops as scoped | Own Circles; independently activate/terminate membership; hold Circle funds |
| Circle Finance Coordinator | Coordinating finance support | Personal fee collection; unauthorised Circle bank accounts |
| Platform Admin / Membership ops | Approvals per FD-036 | Bypass audit; self-approve conflicted cases |
| Connect BDP | View attributed pipeline per Phase 6 | Force allocation; take unattributed commission |
| RM | Operational support | Automatic commission or settlement authority |

Enforce via Phase 4 assignments + RLS matrices.

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Collapsing activation into allocation | Separate state fields + DoD tests |
| Collapsing dual Circle statuses | Two fields; SM_Circle tests |
| Requiring Aadhaar for all | Default optional; FD-039 |
| Paying Core at launch | Feature flag off; FD-039 |
| Crediting BDP at 20/40 again | Credit once at 15 activation only |
| Transfer moving historical commission | Attribution rules FD-036/029 |

---

## 13. Unresolved items

| Item | Status |
|------|--------|
| Exact refund matrix post-activation | Pending Founder/Legal Approval |
| Workshop fee/refund/platform fee/commission | Unresolved |
| Tax rates on membership | PENDING PROFESSIONAL VALIDATION |
| Banking-day payout adjustments for related commission | Pending Technical Design |
| Core achievement criteria beyond recommended six months Associate | Future / FD-027 guidance only |
| Pilot city | Undecided — does not block (FD-039) |

---

## 14. Implementation notes (Technical)

1. Persist membership status and seat allocation status as **separate** columns/entities.
2. Persist Circle `lifecycle_status` and `constitutional_status` separately.
3. Reservation expiry job (ADR-014) releases seats after 7 days if unpaid/incomplete.
4. Renewal reminder job at 30 days; grace expiry job at +30.
5. Zod-validate Tag counts and specialization uniqueness.
6. Offline bank payment: Admin-only Route Handler/Server Action with evidence upload + audit (FD-039).
7. Never compute Connect BDP commission without valid attribution record.
8. Member dashboard uses Member workspace only; no service role in client.
9. Link payment records to membership ids idempotently (ADR-006/007).
10. Feature flags: `membership.core_direct_purchase=false`, Lead Assist paid paths off.

---

## 15. Cross references

- FD-022, FD-027, FD-030, FD-032, FD-036, FD-039
- `docs/core/36_Commercial_Constants.md` (Membership section)
- `docs/core/38_Circle_Architecture.md`
- Phase 6 for Connect BDP commission/operations
