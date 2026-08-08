# Phase 16 — Pilot Launch

**Document ID:** PHASE-16  
**Title:** Pilot Launch  
**Status:** Working Framework — Pilot City Intentionally Undecided  
**Authority Level:** Phase documentation subordinate to Founder Decisions  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Authority:** [FD-039 — GCE Phase 2 Commercial Acceptance and Compliance Direction](../founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md) especially Part K (§27–§29), Part I, Part M, Part J  
**Related:** [Phase 15](../phase-15/PHASE_15_LEGAL_TAX_PRIVACY_PRODUCTION_READINESS.md), [Compliance Register](../compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md), Phase 17–18

---

## Authority

1. FD-039 §27: **The first live pilot city is intentionally not fixed.** This Phase 16 document **must not ask for, select, or recommend a specific pilot city.**
2. FD-039 §28: Pilot-city selection must **not** block Phase 2 Technical Architecture, database design, Auth/RBAC, Marketplace transaction architecture, Enterprise architecture, Finance ledger design, or state-machine design.
3. FD-039 §29: **Founder selection of the pilot city is required** before finalising: local rollout plan, city launch RACI, city-specific BDP deployment, Venue onboarding target, Circle launch plan, local support readiness, and pilot go-live calendar.
4. Money movement in pilot remains subject to FD-039 production compliance gates (MoR/GST/TDS/settlement/PSP validation, agreements, register completeness, etc.). Architecture and non-production work may proceed.
5. Operational Recommendation labels below are **planning heuristics only** — not Founder Decisions and not city-selection.

---

## Purpose

Provide a **city-agnostic** pilot launch framework so Product, Ops, Finance, Compliance, and Support can prepare for a controlled first live market once the Founder selects the city — without treating city choice as an architecture blocker.

---

## Scope

- Pilot objectives and scope boundaries  
- Entry criteria and Founder city-selection gate  
- Generic Circle / Venue / BDP / Enterprise targets (**Operational Recommendation**)  
- Support, finance, and compliance readiness  
- Monitoring, KPI dashboard, incident response, rollback  
- Duration recommendation (**Operational Recommendation**)  
- Success / failure criteria and post-pilot review  

---

## Not in scope

- Selecting, shortlisting, or requesting a pilot city name.  
- Final GST/TDS rates, RBI classification, or enforceability conclusions.  
- Activating FD-039 Part J inactive / future products.  
- Nationwide or multi-city production scale (Phase 17–18).  
- Code / SQL delivery.

---

## Dependencies

| Dependency | Why |
|---|---|
| FD-039 Part K | City undecided; architecture unblocked; Founder gate before deployment planning |
| Phase 15 + Compliance Register | Legal/tax/privacy readiness; money gates |
| FD-020 / FD-021 / FD-028 / FD-029 | Finance / settlement / commission behaviour in pilot |
| FD-024 / FD-030 / FD-036 | Circles and membership allocation |
| FD-037 / FD-025 / FD-033 / FD-038 | Marketplace, BDPs, Enterprise |
| Technical ADRs / environments | Non-prod → pilot env promotion path |
| Founder city decision | Unlocks city-specific final plans (FD-039 §29) |

---

## Entry criteria

1. Phase 2 commercial spine architecture path agreed (FD-039 Part I) — city not required.  
2. Phase 15 artefacts exist at least as drafts/checklists; go-live-gated Compliance Register rows identified.  
3. For **any pilot money movement**: MoR / GST / TDS / settlement / PSP validation status is either Validated or expressly Founder-accepted after escalation (FD-039 §5, §32).  
4. Feature flags / kill switches designed for pilot surfaces (detail in Phase 17 patterns).  
5. Support and incident contacts named for pilot window (city-agnostic roster; local contacts after city selection).  
6. **Founder city-selection gate** completed before city-specific deployment planning artefacts are marked Final (FD-039 §29).

---

## Exit criteria

1. Pilot duration complete (or early stop under failure criteria).  
2. Post-pilot review signed (Product, Ops, Finance, Legal/Compliance, Founder).  
3. Go / No-Go recommendation for Phase 17 Controlled Production Launch recorded.  
4. Open compliance/tax/legal issues logged with owners — no invented closures.  
5. Rollback or scale-back decision documented if triggered.

---

## 1. Pilot objectives (city-agnostic)

| Objective | Description |
|---|---|
| Validate commercial spine | Associate Membership, Circles, Connect BDP, Marketplace events/Venues/Marketplace BDP, BDP packs, Enterprise foundations, unpaid Lead Assist Stage 1 — per FD-039 Part I |
| Validate MoR operating path | Logixia intended Marketplace ticket MoR under professionally validated implementation where money moves |
| Validate BDP packaging | Commercial Licence / IBP operating reality (not automatic franchise) |
| Validate cancellation UX | 48-hour default cutoff disclosures; refund policy as then validated |
| Validate KYC posture | Aadhaar not mandatory by default; minimisation |
| Prove ops readiness | Support, finance reconciliation, incident response, monitoring |
| Inform Phase 17 | Evidence for controlled production waves |

---

## 2. Pilot scope

### In pilot (subject to money gates)

- Limited Circles path in the **Founder-selected** city (city TBD).  
- Limited Venue Partner onboarding and Marketplace events.  
- Limited BDP activation (Connect and Marketplace).  
- Controlled Enterprise pipeline exposure (not full national scale).  
- Unpaid Lead Assist Stage 1 foundations only.  

### Explicitly out of pilot

All FD-039 Part J inactive items, including (non-exhaustive): Marketplace Affiliate activation, ZBP, Core Tier direct purchase / nationwide Core, paid Lead Assist, wallet cash-out, advertising/premium listings SKUs, referral rewards with rates, Vendor self-serve portal, native apps, international, multi-currency go-live, partner lead-ingest APIs, dark mode MVP, Docker/Edge as mandatory infra, Super Admin as ordinary product role.

---

## 3. Founder city-selection gate

**Status:** Pilot city INTENTIONALLY UNDECIDED (FD-039 §27).

| Gate artefact | When allowed |
|---|---|
| City name selection | Founder only — **not this document** |
| Local rollout plan | After Founder city selection |
| City launch RACI | After Founder city selection |
| City-specific BDP deployment plan | After Founder city selection |
| Venue onboarding target (city numbers) | After Founder city selection |
| Circle launch plan (city) | After Founder city selection |
| Local support readiness | After Founder city selection |
| Pilot go-live calendar | After Founder city selection |

Until the Founder selects the city, teams may prepare **generic** runbooks, training, dashboards, and compliance packs only.

---

## 4. Pilot targets — Operational Recommendation

> **Label:** Operational Recommendation only. Not Founder Decision. Not city-specific. Adjust after Founder city selection and capacity reality.

| Dimension | Operational Recommendation | Notes |
|---|---|---|
| Circles | **1–2 Circles** live path, with operating intent toward **~15 seats** utilisation path as Circles mature | Align FD-024 / Circle architecture; do not invent commercial fees |
| Venue Partners | **5–10** onboarded venues (quality over volume) | Subject to KYC/terms readiness |
| Connect BDP | **1** active Connect BDP | Commercial Licence / IBP pack |
| Marketplace BDP | **1** active Marketplace BDP | Attribution rules FD-037 |
| Enterprise | **0–1** controlled Enterprise Client opportunity (pipeline or light engagement) | FD-038; Finance co-sign rules apply |
| Events | Small number of live ticketed events sufficient to exercise MoR path | Money gated |
| Duration | **8–12 weeks** pilot window | Operational Recommendation |

---

## 5. Support / finance / compliance readiness

### Support

- [ ] Pilot support hours and escalation tree (city-agnostic template)  
- [ ] Local contacts placeholder — fill **after** Founder city selection  
- [ ] Playbooks: booking failure, refund request, KYC delay, BDP pack payment (online / rare offline)  

### Finance

- [ ] Reconciliation cadence for ticket / membership / BDP pack / settlement  
- [ ] MoR audit trail checks  
- [ ] Offline Admin payment evidence checklist (FD-039 §19) if used  
- [ ] No invented GST/TDS rates in runbooks — cite Tax-validated schedules when available  

### Compliance

- [ ] Compliance Register go-live-gated rows reviewed for pilot money surfaces  
- [ ] Consumer cancellation disclosures live for ticketed events  
- [ ] Privacy / KYC retention schedule status recorded (PENDING PROFESSIONAL VALIDATION until Validated)  
- [ ] Aadhaar not required by default in pilot KYC flows  

---

## 6. Monitoring and KPI dashboard (framework)

City-agnostic KPI set (implement after env ready):

| Category | Example KPIs (framework) |
|---|---|
| Acquisition | Membership activations; Venue applications; BDP pack completions |
| Marketplace | Events published; tickets sold; cancellation rate vs 48h window |
| Circles | Circle seats filled; allocation vs activation mismatches |
| Finance | Settlement exceptions; refund exceptions; offline payment count (should be rare) |
| Reliability | Payment success rate; incident count/severity |
| Compliance | Open Validated vs Pending Validation gated items |
| Support | Ticket volume; time-to-first-response; reopen rate |

Exact targets/thresholds: set at Founder city selection + Phase 16 kickoff — do not invent commercial SLAs here.

---

## 7. Incident response (pilot)

| Severity | Examples | Response |
|---|---|---|
| Sev-1 | Payment outage; incorrect MoR settlement; privacy breach | Immediate freeze of affected money paths; Founder + Legal + Finance notify |
| Sev-2 | Partial booking failure; KYC backlog blocking activations | Ops lead; daily stand-up until clear |
| Sev-3 | UX / disclosure defects; non-money defects | Backlog within pilot window |

Legal notification duties: **PENDING PROFESSIONAL VALIDATION** (Phase 15). Preserve audit logs always.

---

## 8. Rollback

Triggers (examples):

- Material compliance prohibition discovered against live money model (escalate Founder — FD-039 §2).  
- Uncontained Sev-1 payment/settlement/privacy incident.  
- Failure criteria met (below).  

Rollback actions (generic):

1. Disable ticket purchase / BDP pack online payment feature flags.  
2. Pause new Venue/event publications if required.  
3. Preserve ledgers; no destructive data wipes.  
4. Communicate to active pilot partners via Ops.  
5. Post-incident review before any re-enable.

---

## 9. Duration — Operational Recommendation

**8–12 weeks** from pilot go-live calendar start (calendar itself requires Founder city selection — FD-039 §29).

Shorter exit allowed if failure criteria hit; longer extension requires Founder approval.

---

## 10. Success criteria

- Money paths used in pilot operated only under validated (or Founder-accepted) MoR/tax/PSP controls.  
- At least the Operational Recommendation minimum partner set exercised **or** intentional downscope recorded with reason.  
- 48h cancellation disclosure verified on live bookings.  
- Aadhaar-not-default KYC verified.  
- No silent rewrite of Founder rules; escalations documented.  
- KPI dashboard reviewed weekly; post-pilot report complete.  
- Phase 17 Go/No-Go recommendation with evidence.

---

## 11. Failure criteria

- Unvalidated money movement at scale against FD-039 gates.  
- Systemic settlement/commission errors without recoverable audit trail.  
- Material dark-pattern / consumer disclosure failure uncorrected.  
- Aadhaar made mandatory by convenience without legal justification.  
- Inability to staff support/finance for pilot window.  
- Founder city still undecided when teams attempt to finalise city-specific go-live calendar (process failure — stop and wait).

---

## 12. Post-pilot review agenda

1. Objectives vs outcomes  
2. Compliance Register deltas  
3. MoR / GST / TDS / PSP open items  
4. Partner feedback (Circle / Venue / BDP / Enterprise)  
5. Support & incident chronology  
6. KPI trends  
7. Rollback lessons  
8. Phase 17 recommendation (Go / Conditional Go / No-Go)  
9. Explicit confirmation: inactive Part J items remain inactive  

---

## Risks

| Risk | Mitigation |
|---|---|
| Pressure to pick city in this doc | Explicit undecided rule; no city names |
| Architecture wait-for-city | FD-039 §28 |
| Premature money go-live | Phase 15 gates + Register |
| Over-scope into Part J features | Explicit out-of-pilot list |
| Treating Operational Recommendations as Founder locks | Clear labelling |

---

## Unresolved

- Exact pilot city (Founder)  
- Exact city-specific licensing overlays  
- Exact refund % / timelines (until Product-Finance-Tax lock)  
- Exact GST/TDS/RBI outcomes (professional)  
- Final KPI numeric thresholds  

---

## Document control

| Field | Value |
|---|---|
| Phase | 16 |
| Pilot city | Intentionally undecided |
| Type | Documentation framework only |
| Code / SQL | None |

**End of Phase 16 document**
