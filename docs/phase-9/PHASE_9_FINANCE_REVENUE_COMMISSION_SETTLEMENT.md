# Phase 9 — Finance, Revenue, Commission & Settlement

| Field | Value |
|-------|-------|
| **Phase** | 9 |
| **Document** | `PHASE_9_FINANCE_REVENUE_COMMISSION_SETTLEMENT.md` |
| **Type** | Phase planning / living architecture summary (documentation only) |
| **Status** | **Implemented on gce-dev** — see `PHASE_9_IMPLEMENTATION_NOTES.md` |
| **Date** | 2026-08-08 |

---

## Authority

**Highest business authority (do not invent commercial rates or tax percentages):**

| Topic | Authority |
|-------|-----------|
| Wallet / internal ledgers / cash-out inactive | **FD-020** |
| Settlement eligibility, holds, batches, reconciliation | **FD-021** |
| Revenue recognition concepts (GMV vs Collected vs Eligible vs Platform) | **FD-028** |
| Commission Engine, entitlement states, recovery / clawback, Marketplace **80/10/10** | **FD-029** |
| Connect BDP commercial / finance recovery | **FD-025** (as amended by FD-029) |
| Marketplace BDP commercial / attribution | **FD-033** |
| Unattributed Marketplace **80/0/20**, payout direction | **FD-037** |
| Enterprise componentised settlement / no-double-commission | **FD-038** |
| Logixia intended Marketplace ticket MoR; offline BDP pack bank payment; cash-out inactive; Razorpay candidate | **FD-039** |
| Corporate / payment receipt entity principles | **FD-034** |
| Membership attribution (commission eligibility inputs) | **FD-036** |

**Technical ADRs (not Founder law):**

- [`ADR-006`](../phase-2/adrs/ADR-006_Payment_Gateway_and_Webhook_Architecture.md) — Razorpay PSP **candidate**; idempotent webhooks; MoR validation-gated
- [`ADR-007`](../phase-2/adrs/ADR-007_Financial_Ledger_Architecture.md) — ledger architecture
- [`ADR-008`](../phase-2/adrs/ADR-008_State_Machine_Architecture.md) — state-machine architecture
- [`ADR-010`](../phase-2/adrs/ADR-010_Audit_and_Observability.md) — immutable audit / observability
- [`ADR-013`](../phase-2/adrs/ADR-013_Feature_Flags.md) — feature flags for inactive / validation-gated money paths
- [`ADR-014`](../phase-2/adrs/ADR-014_Background_Jobs_and_Scheduling.md) — settlement sweeps / reconciliation jobs

**State machines (mandatory linkage):**

- [`SM_Payment`](../state-machines/SM_Payment.md)
- [`SM_Refund`](../state-machines/SM_Refund.md)
- [`SM_Commission`](../state-machines/SM_Commission.md)
- [`SM_Settlement`](../state-machines/SM_Settlement.md)

**Living narrative companions:** `docs/core/04_Revenue_Model.md`, `36_Commercial_Constants.md`, `37_Revenue_Flow.md`, `21_Payments.md`.

---

## Purpose

Define the Phase 9 documentation scope for **money truth** across GCE Connect, GCE Marketplace, and GCE Enterprise:

1. Separate commercial measurement concepts (GMV / Collected / Eligible / Platform).
2. Drive stakeholder entitlements through the Commission Engine (FD-029).
3. Gate payouts through Settlement (FD-021) — payment success ≠ settlement eligibility.
4. Support Finance Admin operations, rule versioning, reconciliation, and audit.
5. Preserve wallet/ledger principles (FD-020) while keeping **wallet cash-out inactive** (FD-039).

This phase does **not** invent GST/TDS rates, refund percentage tables, chargeback commercial matrices, or FX policy.

---

## Scope

### In scope (architecture & process documentation)

- Financial concept taxonomy (below)
- Commission calculation inputs and entitlement lifecycle
- Settlement eligibility, batches, payouts, holds, reversals
- Marketplace attributed vs unattributed share rules (cited only)
- Franchise / BDP finance recovery and Recoverable Balance concepts (FD-029)
- Refund interaction with commission/settlement (placeholder economics)
- Chargeback **placeholder** architecture (freeze / recover — exact outcome matrix Unresolved)
- Offline bank payment recording for BDP commercial packs (FD-039)
- Finance Admin capabilities (high-level)
- Rule versioning and financial audit
- Wallet / internal ledger posture (FD-020)
- Financial reports (high-level KPI families — not invented formulas)
- Linkage to payment gateway candidate architecture (ADR-006)
- Logixia intended Merchant of Record for Marketplace event tickets (FD-039)

### Not in scope

- Production SQL / migrations / package installs
- Exact GST, TDS, withholding, or invoice line rates (**PENDING PROFESSIONAL VALIDATION**)
- Exact refund %, processing SLA, convenience-fee treatment, no-show refundability (FD-039 §16)
- Activating wallet consumer cash-out / withdrawals (FD-039 inactive)
- Activating Marketplace Affiliate commercial model (inactive)
- Inventing Lead Assist success fees or paid Stage 1 Lead Assist economics (Phase 10 / FD-031)
- Making Razorpay immutable Founder law (candidate only — FD-039 / ADR-006)
- Declaring MoR implementation details production-ready without compliance validation

---

## Dependencies

| Dependency | Why |
|------------|-----|
| Phase 2 ADRs 006–008, 010, 013–014 | Payment, ledger, SM, audit, flags, jobs |
| Identity / RBAC (FD-023 / FD-035) | Finance Admin ≠ self-approving beneficiary |
| Attribution systems (FD-036 / FD-037 / FD-038) | Commission eligibility inputs |
| Marketplace / membership / Enterprise commercial FDs | Vertical earning rules |
| Compliance gate register (FD-039 Part M) | Money-movement go-live blocked until validated |
| State machines SM_Payment / Refund / Commission / Settlement | Lifecycle source of truth |

---

## Entry criteria

- Founder Decisions FD-020, FD-021, FD-028, FD-029, FD-037, FD-038, FD-039 available and indexed
- ADR-006 / ADR-007 Accepted (technical defaults)
- SM_Payment, SM_Refund, SM_Commission, SM_Settlement documented
- Role taxonomy distinguishes Finance Admin / Compliance / Ops (no universal god mode)
- Feature-flag strategy exists so cash-out and unvalidated MoR ticket capture stay off in pilot/prod until gates clear

---

## Exit criteria

- Documented mapping from payment capture → escrow/holds → eligible revenue → commission states → settlement batch → paid / reversed / recoverable
- Finance Admin capability list agreed (docs)
- Rule-version fields required on commission and settlement calculations (docs)
- Offline BDP pack Admin workflow documented with evidence + dual control where required
- Explicit Unresolved register for tax, refund %, chargeback matrix
- UAT/pilot finance scenarios listed for Phase 14 (no production money without FD-039 compliance gates)

---

## Core financial concepts (do not collapse)

Per FD-028 / living `04_Revenue_Model.md`:

| Concept | Meaning |
|---------|---------|
| **Gross Merchandise / Gross Transaction Value (GMV / GTV)** | Total commercial value before exclusions — **not** automatically GCE revenue |
| **Collected Amount** | Money successfully received and reconciled — excludes failed, unpaid, pending, reversed, disputed, verbal, proposal, or unconfirmed amounts |
| **Tax** | Statutory components (GST/TDS/withholding as applicable). **Rates: PENDING PROFESSIONAL VALIDATION** — do not invent |
| **Refundable Amount** | Portion of Collected Amount still subject to refund/cancel policy — **exact % Unresolved** (FD-039) |
| **Eligible Revenue** | Approved calculation base after exclusions (taxes, refunds, reversals, chargebacks, invalid amounts, excluded credits, Founder-approved non-commissionable components) |
| **Platform Revenue** | GCE’s earned commercial share — not equal to total transaction value or Collected Amount |
| **Settlement-Eligible Amount** | Cleared for payout after reconciliation, attribution, fulfilment, holds, approvals, tax treatment, and settlement conditions (FD-020 / FD-021) |
| **Outstanding** | Settlement-eligible or payable amounts not yet successfully paid (operational reporting concept — not a guarantee of payment) |

**Hard rule:** Collected funds ≠ automatic company revenue (FD-034 / FD-028). Payment success ≠ commission earned ≠ settlement eligible (FD-021 / FD-029).

---

## Merchant of Record & payment rails

### Logixia intended MoR (FD-039)

- For **Marketplace event tickets**, **Logixia Solutions Private Limited** is the **intended Merchant of Record**.
- Platform collects customer ticket payment, then settles Venue Partner and Marketplace BDP entitlements per approved rules.
- MoR **implementation** (GST presentation, invoice structure, gateway merchant mapping, refund accounting, TDS/withholding, payment-aggregator applicability) remains **validation-gated** before production money movement.

### Razorpay candidate (ADR-006 / FD-039)

- Razorpay may be the preferred India-launch PSP **candidate**.
- Not Founder law; swappable if validation or commercial terms require.
- Webhooks: signature-verified, idempotent, Route Handler ingest (ADR-006).
- Never trust client-only “paid” signals for ledger credit.

### Offline bank payment — BDP commercial packs (FD-039)

- **Online is default** for BDP commercial packs / franchise units.
- Rare offline via NEFT / RTGS / cheque / other approved bank method only through authorised Admin-recorded workflow.
- **Cash is not a normal activation method.**
- Required evidence (minimum): payer identity, BDP type, package/unit, amount, date, bank reference, payment proof, recording Admin, approving Admin where required, reconciliation status, activation status, audit trail.
- Offline path maps into `SM_Payment` states: Offline Pending Evidence → Offline Confirmed → Captured / In Escrow.

---

## Commission rules (cite only — FD-029 / FD-037)

### Marketplace — valid Marketplace BDP attribution (FD-029 / FD-033 / FD-037)

```text
Eligible Marketplace Event Revenue
→ 80% Venue Partner Entitlement
→ 20% GCE Gross Marketplace Platform Commission
   → 10% Marketplace BDP commission (from GCE’s 20%)
   → 10% GCE Net Retained Share
```

After standard MBDP commission: **80 / 10 / 10** (Venue / MBDP / GCE net).

### Marketplace — no valid MBDP attribution (FD-037)

```text
Eligible Marketplace Event Revenue
→ 80% Venue Partner Entitlement
→ 0% Marketplace BDP
→ 20% GCE
```

Do **not** describe the missing 10% as unpaid / pending Marketplace BDP commission. Later MBDP assignment does **not** automatically create retroactive entitlement.

### Other verticals (summary only)

- **Connect BDP:** attribution-required commission on eligible membership / Tag revenue per FD-025 / FD-029 / FD-036 — organic/unattributed membership creates **no** Connect BDP commission.
- **Enterprise BDP:** earns from eligible **platform commission**, not whole project GMV (FD-026 / FD-038). Componentised settlement; **no double commission** on the same eligible revenue component across verticals unless a later Founder Decision expressly authorises it.
- **Affiliate:** inactive (FD-032 / FD-039).
- **Lead Assist:** no automatic success fee at Stage 1; Connect BDP does not automatically earn on Lead Assist (FD-029 / FD-031) — see Phase 10.

### Entitlement lifecycle (FD-029 / SM_Commission)

Estimated → Provisional → Earned → On Hold → Settlement-Eligible → Approved → Payable → Paid  
with Reversed / Recoverable Balance / Clawed Back as applicable.

**Guards:** beneficiary ≠ approver; no self-approval; franchise recovery only from earned/approved paths per FD-029 caps — do not invent new %.

---

## Settlement, payout & batches (FD-021 / FD-037)

- Settlement is **platform-controlled**. Venue Partners and BDPs must not directly release settlement.
- Marketplace launch payout direction: **monthly Platform-initiated batch**; architecture must remain **configurable** (FD-037).
- Marketplace event settlement follows successful completion and approved post-event hold principles (FD-021) — not payment alone.
- States per `SM_Settlement`: escrow / awaiting fulfilment / under hold / eligible / approved / processing / settled / reversed / chargeback freeze, etc.
- Idempotent payout processing mandatory (FD-021). Manual overrides audited, never silent.

### Outstanding reporting

Finance reports may show Outstanding = Payable + Settlement Processing not yet Settled, excluding On Hold / Under Review unless labelled separately. Outstanding is operational — not a promise of payment.

---

## Recovery, clawback, refund, chargeback

| Path | Posture |
|------|---------|
| **Refund** | Controlled via `SM_Refund`. Cancellation cutoff default **48h before event start** (FD-039). **Exact refund % / schedules not Founder-locked** — placeholder policy required before go-live |
| **Commission reversal** | Pending/unpaid eligibility withdrawn; paid amounts may become Recoverable Balance (FD-029) |
| **Clawback / recovery** | Recoverable Balance against future approved earnings or authorised mechanism; franchise finance recovery rules per FD-029 |
| **Chargeback** | **Placeholder:** on signal → freeze related settlement/commission; final adjustment follows chargeback outcome; exact evidence SLA / win-loss matrix **Unresolved** (FD-021) |

---

## Wallet & ledger (FD-020)

- Internal ledgers separate commercial truth from UI “balance” displays (ADR-007).
- Append-only with compensating / reversal entries — no silent mutation of historical financial facts.
- Escrow-first principles where product requires (membership activation, events, milestones).
- **Wallet cash-out / consumer withdrawals: inactive** (FD-039). Feature-flagged off; do not implement as live product path in Phase 9.

---

## Finance Admin (capabilities — high level)

Finance Admin (permission-scoped; FD-023) may:

- Review / approve settlement batches (dual control where required)
- Place / release financial holds (dispute, compliance, refund window, chargeback)
- Record / confirm offline BDP pack bank payments with evidence
- Trigger reconciliation jobs and investigate mismatches
- Approve refunds within authorised policy (not invent %)
- View Recoverable Balances and recovery progress
- Export financial reports for CA / audit support
- Inspect rule version applied to historical calculations

Finance Admin may **not**:

- Self-approve personal commission
- Bypass MoR / tax compliance gates for production ticket money movement
- Hard-delete ledger / attribution history
- Activate inactive products (cash-out, Affiliate, paid Lead Assist) via UI alone

---

## Rule versioning & audit

Every commission and settlement calculation must persist:

- Rule version id / hash
- Attribution snapshot id (where applicable)
- Eligible revenue base and exclusion codes
- Actor / system id for approvals
- Correlation ids to payment, refund, chargeback events

Audit events align with SM_* and ADR-010 (`payment.*`, `refund.*`, `commission.*`, `settlement.*`, offline payment events). Immutable strategy: append-only; corrections via reversals.

---

## Reconciliation

Reconciliation domains (FD-021 §35 concepts):

1. Gateway / PSP settlement files ↔ platform payment captures (ADR-006)
2. Offline bank evidence ↔ Offline Confirmed payments ↔ pack activation
3. Commission Payable totals ↔ settlement batch lines
4. Tax / withholding placeholders ↔ professional advice once rates validated
5. Refunds / chargebacks ↔ commission Recoverable Balances

Mismatches open Finance exception queues (Phase 13) — do not auto-force Settled.

---

## Financial reports (high-level families)

Reports must distinguish — never one unqualified “Revenue”:

- GMV / Booked Value
- Collected Amount
- Eligible Revenue
- Platform Revenue
- Estimated / Provisional / Earned / On Hold / Settlement-Eligible / Paid / Reversed commission
- Recoverable Balance
- Outstanding payouts
- Refund / chargeback volumes (counts and amounts)
- Offline vs online BDP pack collections

KPI formulas beyond Founder-approved commercial constants remain **Pending Product / Finance design** — do not invent.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Collapsing GMV into Platform Revenue | Enforce concept separation in schemas and reports |
| Paying commission before settlement eligibility | SM_Commission + SM_Settlement guards |
| Retroactive MBDP entitlement on 80/0/20 history | FD-037 rule; immutable attribution effective date |
| Production ticket capture before MoR validation | Feature flag + compliance gate (FD-039) |
| Invented tax / refund % | Explicit PENDING / Unresolved labels |
| Silent ledger edits | ADR-007 / ADR-010 append-only |
| Accidental cash-out enablement | FD-039 inactive + ADR-013 flags |

---

## Unresolved

- GST / TDS / withholding **rates** and invoice templates — **PENDING PROFESSIONAL VALIDATION**
- Exact refund percentage tables and processing times (FD-039 §16)
- Chargeback win/loss / evidence SLA matrix
- Convenience-fee and no-show financial treatment
- Exact Razorpay account configuration and provider fee schedules (ADR-006)
- Full MoR implementation mapping for production
- Multi-currency / FX (inactive for go-live per FD-039 posture)
- Some franchise recovery edge cases vs chargeback interaction — Pending Finance/Legal Design

---

## Related documents

- Founder Decisions: FD-020, FD-021, FD-028, FD-029, FD-034, FD-036, FD-037, FD-038, FD-039
- State machines: `SM_Payment`, `SM_Refund`, `SM_Commission`, `SM_Settlement`
- ADRs: `ADR-006`, `ADR-007`, `ADR-008`, `ADR-010`, `ADR-013`, `ADR-014`
- Phase 10 (Lead Assist commercial boundaries), Phase 11 (ticket CX / 48h cancel), Phase 12 (audit/security), Phase 13 (Finance Ops queues), Phase 14 (financial tests & release gates)
