# Phase 17 — Controlled Production Launch

**Document ID:** PHASE-17  
**Title:** Controlled Production Launch  
**Status:** Working Framework  
**Authority Level:** Phase documentation subordinate to Founder Decisions  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Authority:** [FD-039 — GCE Phase 2 Commercial Acceptance and Compliance Direction](../founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md) especially Part B (§3–§5), Part M (§32–§33), Part L (§30–§31), Part J, Part K  
**Related:** [Phase 15](../phase-15/PHASE_15_LEGAL_TAX_PRIVACY_PRODUCTION_READINESS.md), [Phase 16](../phase-16/PHASE_16_PILOT_LAUNCH.md), [Compliance Register](../compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md), Phase 18

---

## Authority

1. FD-039 separates **Founder-approved business direction** from **professional validation**. Controlled production may expand operating footprint only where Layer 2 validation (or Founder-accepted escalation) clears money-movement and contract-reliance gates.
2. Logixia remains the **intended** Marketplace ticket MoR; GST, invoicing, TDS, settlement, PSP configuration, and payment-system applicability remain validation-gated (FD-039 §4–§5, §32).
3. Razorpay is an India-launch **PSP candidate**, not legally mandatory; production activation gated by MoR/tax/settlement/refund/TDS validation (FD-039 §31).
4. Architecture and feature planning may have proceeded under FD-039 §33; **production money movement** and **final contract publication** remain gated.
5. This document does **not** invent GST/TDS rates, RBI classifications, or enforceability conclusions.
6. FD-039 Part J inactive items remain **not activated** in Phase 17 unless a later Founder Decision says otherwise.

---

## Purpose

Define a controlled production launch after (or concurrent with clear exit from) Phase 16 pilot learnings: release waves, feature flags, partner/customer activation, money-movement and settlement/fraud monitoring, support, incidents, performance, analytics, compliance checks, rollback, post-launch review, and explicit go/no-go gates including **MoR / GST / TDS validation**.

---

## Scope

- Release waves and feature-flag strategy  
- Partner and customer activation controls  
- Money-movement, settlement, and fraud monitoring  
- Support, incident, performance, analytics operations  
- Compliance checks tied to FD-039 §32 and the Compliance Register  
- Rollback and post-launch review  
- Go / No-Go gates (including MoR/GST/TDS)  

---

## Not in scope

- Pilot city selection (still Founder-owned if not yet decided — FD-039 Part K).  
- Multi-city scale optimisation programme (Phase 18).  
- Activation of inactive future products (FD-039 Part J / Phase 18 list).  
- Final tax opinions or RBI classifications.  
- Code / SQL implementation details.

---

## Dependencies

| Dependency | Why |
|---|---|
| FD-039 | MoR, gates, PSP candidate, inactive list, architecture vs go-live split |
| Phase 15 | Legal/tax/privacy checklists; go-live legal checklist |
| Compliance Register | Go-live gate Y rows must be Validated (or Founder-accepted) |
| Phase 16 | Pilot evidence, success/failure outcomes, post-pilot Go recommendation |
| FD-020 / FD-021 / FD-029 | Wallet, settlement, commissions monitoring |
| Technical observability (Sentry/logging ADRs) | Production monitoring |

---

## Entry criteria

1. Phase 16 post-pilot review recommends **Go** or **Conditional Go** with conditions listed.  
2. Compliance Register: all rows with **Go-live gate = Y** that apply to the intended production wave are **Validated**, or escalated and **Founder-accepted**.  
3. MoR / GST / TDS / invoice / settlement / PSP validation evidence attached for surfaces enabling money movement in Wave 1.  
4. Feature flags and kill switches tested in non-prod.  
5. Support staffing and on-call for production hours agreed.  
6. Rollback runbook rehearsed (tabletop minimum).  
7. BDP / Venue / Enterprise Client / Vendor / consumer terms required for the wave are counsel-cleared for reliance (AI drafts alone insufficient — FD-039 §10).

---

## Exit criteria

1. Planned release waves for the controlled launch window completed or consciously deferred.  
2. Post-launch review published.  
3. No open Sev-1 money/compliance incidents without remediation plan.  
4. Decision recorded: steady-state production ops **or** proceed to Phase 18 scale programme **or** scale-back.  
5. Part J items remain inactive unless Founder Decision opened them.

---

## 1. Release waves (framework)

| Wave | Intent | Typical surfaces | Money? |
|---|---|---|---|
| Wave 0 | Production hardening | Flags, monitoring, support tools, read-only dashboards | N |
| Wave 1 | Controlled paid spine | Membership activation; validated ticket MoR path; online BDP packs | Y — gated |
| Wave 2 | Partner expansion | Additional Venues/events; additional BDP activations within approved capacity | Y — gated |
| Wave 3 | Enterprise controlled intake | Enterprise Client opportunities under FD-038 controls | Y — gated per engagement |
| Wave 4 | Optimisation hooks | Analytics depth, ops automation (non-Part-J) | As applicable |

Waves may be parallelised only if go/no-go gates for each money surface remain green.

---

## 2. Feature flags

| Flag domain | Default production | Notes |
|---|---|---|
| Marketplace ticket purchase | Off until MoR/GST/TDS/PSP Validated | Kill switch required |
| Membership paid activation | Off until fee/tax path Validated | |
| BDP pack online payment | Off until pack tax/PSP Validated | Offline rare path Admin-only |
| Event publication | Off/on by Ops allowlist | |
| Enterprise quote acceptance | Off until Finance co-sign path live | FD-038 / FD-039 |
| Lead Assist Stage 1 (unpaid) | Per product readiness | Paid Lead Assist = Part J inactive |
| Part J features | **Hard off** | Requires future Founder Approval |

Flag changes: dual control (Product + Ops) for money flags; Finance/Legal consult for tax-sensitive enables.

---

## 3. Partner / customer activation

| Cohort | Activation control |
|---|---|
| Members | Allowlist or open within approved geo after city/ops readiness |
| Circles | Capacity caps; allocation ≠ activation (FD-036) |
| Connect BDP / Marketplace BDP | Agreement executed; KYC without Aadhaar-by-default; pack payment validated |
| Venue Partners | Terms + KYC + settlement coordinates validated |
| Enterprise Clients | Distinct from Enterprise BDP; quotation/Finance rules |
| Vendors | Engagement terms; no Vendor self-serve portal (Part J inactive) |

Activation checklists must reference counsel-cleared templates, not AI first drafts alone.

---

## 4. Money-movement monitoring

Monitor (minimum):

- Payment success / failure / pending rates (PSP candidate path)  
- MoR ticket capture vs ledger entries  
- Membership and BDP pack payment states  
- Refund initiation vs completion vs credit-note status (**tax treatment PENDING PROFESSIONAL VALIDATION** until Validated schedules exist)  
- Offline BDP pack payments count (expect rare) and reconciliation lag  
- Settlement batch exceptions  

**Do not** hardcode GST/TDS rates in this phase doc — pull from Tax-validated schedules when available.

---

## 5. Settlement and fraud monitoring

| Domain | Checks |
|---|---|
| Settlement | Venue / BDP / Enterprise component entitlements vs FD-021 / FD-029; no double commission (FD-038) |
| Attribution | Connect / Marketplace attribution validity before commission |
| Fraud | Velocity, chargeback spikes, duplicate bookings, anomalous refunds, Admin offline payment abuse |
| Audit | Immutable trail for MoR, settlements, Admin overrides |

Unexplained settlement breaks → freeze affected payout path → Finance + Founder as needed.

---

## 6. Support

- Production support hours and escalation (Legal/Finance for money disputes).  
- Scripts for cancellation (48h default), refund status (policy as validated), KYC delays.  
- Partner support separate from consumer support where volume requires.  

---

## 7. Incidents

Reuse Phase 16 severity model; add production requirements:

- Sev-1 money/privacy: immediate feature-flag kill; preserve evidence; Founder notify.  
- Legal/regulatory notification path: **PENDING PROFESSIONAL VALIDATION** until Privacy/Legal playbook Validated.  
- Post-incident: Compliance Register update if new applicability discovered.

---

## 8. Performance

- Track p95 latency for booking, payment redirect/return, dashboard critical paths.  
- Capacity headroom before Wave 2/3 expansion.  
- Degrade non-critical analytics before money paths under load.  

Exact SLOs: set in Technical ADRs / ops runbooks — not invented here as Founder rules.

---

## 9. Analytics

- Funnel: visit → membership / ticket / BDP pack  
- Cancellation within/outside 48h window  
- Settlement exception rate  
- Support contact rate per booking  
- Compliance: gated-item burn-down (Pending Validation → Validated)  

Advanced analytics / advertising / premium listings SKUs: **Part J inactive**.

---

## 10. Compliance checks (recurring)

At each wave go/no-go and on a defined cadence (e.g. weekly during launch):

1. MoR direction still matches live config (Logixia intended MoR).  
2. GST treatment evidence current for live SKUs — **PENDING PROFESSIONAL VALIDATION** cells must not be silently assumed Validated.  
3. TDS/withholding ops match CA guidance when issued.  
4. Invoice samples spot-checked (supplier/platform/Venue/tax presentation).  
5. PSP config (Razorpay candidate or successor) matches validated account structure.  
6. Refund/cancellation disclosures still accurate.  
7. Aadhaar still not mandatory by default.  
8. BDP legal model still Commercial Licence / IBP; Franchise Unit language not implying automatic franchise.  
9. Compliance Register go-live-gated rows remain Validated.  
10. Part J flags remain off.

---

## 11. Rollback

| Trigger | Action |
|---|---|
| MoR/tax/PSP material conflict | Kill money flags; escalate Founder (FD-039 §2) |
| Settlement integrity failure | Freeze settlements; Finance war room |
| Privacy Sev-1 | Contain; Legal/Privacy lead |
| Fraud surge | Tighten velocity rules; pause high-risk paths |
| Wave entry criteria fail mid-wave | Halt wave; do not expand partners |

Rollback preserves ledgers and audit data.

---

## 12. Post-launch review

Within 2–4 weeks after Wave 1 money enable (Operational Recommendation for timing):

- Gate scorecard (below)  
- Incident chronology  
- Partner/customer feedback  
- Tax/Finance exception log  
- Dark-pattern / disclosure follow-ups  
- Phase 18 readiness (scale vs hold)  
- Confirm inactive products stay inactive  

---

## 13. Go / No-Go gates

### 13.1 Hard gates (money / contract reliance)

| Gate | Source | Pass condition |
|---|---|---|
| Marketplace ticket MoR validation | FD-039 §5, §32 | Professional validation complete **or** Founder-accepted after escalation of prohibition/conflict |
| GST treatment (tickets, memberships, BDP packs, Enterprise as in wave) | FD-039 §32 | Tax/CA Validated — **no invented rates** |
| Invoice structure | FD-039 §32 | Supplier/platform/Venue/tax presentation Validated |
| TDS / withholding | FD-039 §32, §40 | CA guidance Validated for live payout types — **no invented sections/rates** |
| Payment-gateway / PSP config | FD-039 §31–§32 | Config matches validated MoR structure; Razorpay candidate not assumed mandatory |
| Settlement compliance | FD-039 §32; FD-021/029 | Exception rate within Finance-accepted band; audit trail complete |
| Refund accounting | FD-039 §32 | Finance/Tax treatment Validated for live policies |
| BDP agreements | FD-039 §32 | Counsel-cleared / executed as required for activated BDPs |
| Venue / Enterprise Client / Vendor agreements | FD-039 §32 | As required for activated partners |
| Compliance Register completeness (gate Y) | FD-039 §11, §32 | Validated or Founder-accepted |
| Privacy / KYC retention | FD-039 §32 | Schedule Validated (periods not invented in phase docs) |
| Aadhaar edge cases | FD-039 §32; Part H | Documented; default remains non-mandatory |
| Consumer cancellation/refund disclosures | FD-039 §14–§16, §32 | 48h default live; refund open items disclosed per validated policy |
| Offline Admin payment controls | FD-039 §18–§20, §32 | SOP live if offline path enabled; cash not normal |

**Any Hard Gate = No-Go for enabling the related money flag.**

### 13.2 Soft gates (ops / quality)

| Gate | Pass condition |
|---|---|
| Support staffing | Roster confirmed for wave |
| Monitoring dashboards | Live and alerting |
| Feature-flag kill test | Passed within last pre-wave window |
| Performance headroom | Ops acceptance |
| Phase 16 lessons | Incorporated or explicitly deferred with owner |

### 13.3 Decision vocabulary

| Decision | Meaning |
|---|---|
| Go | Enable listed flags for the wave |
| Conditional Go | Enable with named constraints (caps, allowlists, time-boxes) |
| No-Go | Do not enable; remediate gates; re-review |

---

## Risks

| Risk | Mitigation |
|---|---|
| Enabling money before GST/TDS validation | Hard gates above |
| Assuming RBI/PA status | Forbidden; Register row TBD until counsel |
| Feature creep into Part J | Hard-off flags |
| Silent MoR rewrite via PSP config | Config review vs FD-039 Part B |
| Wave expansion without settlement health | Settlement freeze rules |

---

## Unresolved

- Exact GST rates, place-of-supply, invoice templates  
- Exact TDS sections/rates  
- Exact RBI/payment-aggregator classification  
- Exact refund percentages/timelines if still open after Phase 15/16  
- Exact PSP account topology  
- Pilot/production city overlays if Founder city decision still pending  

---

## Document control

| Field | Value |
|---|---|
| Phase | 17 |
| Type | Controlled production framework (documentation only) |
| Code / SQL | None |
| Next | Phase 18 Scale Optimisation & Future Products |

**End of Phase 17 document**
