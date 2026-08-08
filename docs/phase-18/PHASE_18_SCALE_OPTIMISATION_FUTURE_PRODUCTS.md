# Phase 18 — Scale Optimisation & Future Products

**Document ID:** PHASE-18  
**Title:** Scale Optimisation & Future Products  
**Status:** Working Framework — Future Items Inactive  
**Authority Level:** Phase documentation subordinate to Founder Decisions  
**Legal Entity:** Logixia Solutions Private Limited  
**Platform and Master Brand:** Growth Central Events (GCE)  
**Primary Authority:** [FD-039 — GCE Phase 2 Commercial Acceptance and Compliance Direction](../founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md) especially Part J (§26), Part I, Part K, Part M, Part L  
**Related:** [Phase 15](../phase-15/PHASE_15_LEGAL_TAX_PRIVACY_PRODUCTION_READINESS.md), [Phase 16](../phase-16/PHASE_16_PILOT_LAUNCH.md), [Phase 17](../phase-17/PHASE_17_CONTROLLED_PRODUCTION_LAUNCH.md), [Compliance Register](../compliance/APPLICABLE_LAW_AND_COMPLIANCE_REGISTER.md)

---

## Authority

1. FD-039 Part J lists items that **remain inactive unless later approved**. Phase 18 records scale-optimisation for the **approved commercial spine** and catalogues future items as **NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL**.
2. Multi-city scale does **not** reopen MoR, BDP Commercial Licence/IBP, Aadhaar-minimisation, or 48-hour cancellation direction without a Founder Decision; professional validation remains required for money movement in each expansion context (FD-039 §5, §32–§33).
3. Pilot/production city choices remain Founder-owned where not yet decided (FD-039 Part K). This document must not select cities.
4. Technical defaults (e.g. Razorpay candidate, Supabase Auth) are ADR-layer items, not immutable Founder business rules (FD-039 §30–§31).
5. Do **not** invent GST/TDS rates, RBI classifications, referral reward rates, or enforceability conclusions.
6. AI first-draft legal model (FD-039 Part D) continues to apply to any future contract packs — drafts are not production-final.

---

## Purpose

- Define a post-controlled-launch programme for **multi-city scale**, capacity, cost, performance, analytics, automation, and ops efficiency on the **approved Phase 2 commercial spine**.  
- Explicitly park future product/infra items as **NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL**, aligned to FD-039 §26.

---

## Scope

### Active scale-optimisation scope (approved spine only)

- Multi-city expansion planning (after Founder city decisions)  
- Capacity and cost management  
- Performance and reliability  
- Analytics for operating the live spine  
- Automation and ops efficiency  
- Compliance Register upkeep as geography/SKU surface grows  

### Future catalogue scope (documentation only)

- Explicit inactive list with status labels (below)

---

## Not in scope

- Activating any Part J / future item without a later Founder Decision.  
- Setting referral reward rates, advertising SKU prices, or Lead Assist fees.  
- Declaring Docker/Edge, native apps, or international go-live as current mandates.  
- Treating Super Admin as an ordinary product role.  
- Code / SQL delivery in this document.  
- Inventing tax/RBI conclusions for new cities.

---

## Dependencies

| Dependency | Why |
|---|---|
| FD-039 Part J | Inactive catalogue authority |
| Phase 17 exit | Controlled production stability before aggressive scale |
| Compliance Register | Per-city / per-SKU gate hygiene |
| FD-020–FD-038 | Commercial/ops constraints during scale |
| Technical ADRs | Performance, observability, payment capacity |

---

## Entry criteria

1. Phase 17 post-launch review accepts steady-state or scale-ready status.  
2. Hard money gates (MoR/GST/TDS/settlement/PSP) remain Validated for live surfaces.  
3. Support/finance capacity model for multi-city exists (even if second city not yet Founder-selected).  
4. Feature flags for all future/inactive items remain **hard off**.  

---

## Exit criteria

Phase 18 is a **continuous optimisation programme**, not a single ship date. A programme milestone exits when:

1. Multi-city operating playbook exists (city names only where Founder-approved).  
2. Capacity/cost/performance baselines and review cadence are running.  
3. Future-product catalogue remains accurately labelled NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL.  
4. Any item promoted from the catalogue has an explicit later Founder Decision cited.

---

## 1. Multi-city scale (approved spine)

| Topic | Guidance |
|---|---|
| City addition | Founder selects cities; local rollout/RACI/Venue/Circle/BDP plans follow FD-039 §29 pattern |
| MoR | Logixia intended Marketplace ticket MoR remains; re-validate tax/PSP/settlement for material new facts |
| Compliance | Extend Compliance Register evidence for local sector/Venue requirements — no single DPIIT Act assumption |
| Partners | Scale Circles, Venues, Connect BDP, Marketplace BDP, Enterprise within validated agreements |
| Cancellation | 48h default remains unless Founder/policy change; event-specific variations still disclosure-gated |
| KYC | Aadhaar not mandatory by default remains |

---

## 2. Capacity

- Seat / Circle capacity planning  
- Event/ticket throughput and PSP rate limits  
- Support headcount vs booking volume  
- Finance reconciliation capacity vs settlement volume  
- Admin offline payment path kept rare by design  

Numeric capacity targets: set in ops plans after production baselines — not invented as Founder constants here.

---

## 3. Cost

- PSP fees, infrastructure, support, compliance counsel retainers  
- Unit economics review for tickets / memberships / BDP packs / Enterprise (use FD commercial constants; do not invent new fees)  
- Cost alerts before Wave expansion  

Tax amounts: use professionally validated schedules only.

---

## 4. Performance

- Continue Phase 17 performance discipline at higher concurrency  
- Load test before each material city or partner cohort expansion  
- Prioritise money-path reliability over non-critical UI polish  
- Dark mode MVP remains **NOT ACTIVE** (do not spend scale budget on it as mandatory)

---

## 5. Analytics

- Operating analytics for spine KPIs (activation, tickets, cancellations, settlements, incidents)  
- Cohort health by city **after** Founder city decisions  
- **NOT ACTIVE:** advanced analytics productisation, advertising analytics SKUs, premium listing performance products — require future Founder Approval  

---

## 6. Automation and ops efficiency

Allowed on approved spine (examples):

- Reconciliation assistants  
- Alert routing  
- Allowlist/cohort activation tooling  
- Compliance Register status reminders  

Not allowed without Founder Approval:

- Partner lead-ingest API programme  
- Vendor self-service portal  
- Wallet cash-out automation  
- Referral reward engines with rates  

---

## 7. Future products & initiatives catalogue

> Every row below is **NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL** unless and until a later Founder Decision expressly activates it.  
> Source alignment: FD-039 §26 (and related inactive directions).

| Item | Status | Notes |
|---|---|---|
| Core Tier direct purchase / nationwide Core launch | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Marketplace Affiliate commercial activation | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Paid Lead Assist (incl. legacy ₹500 fee, escrow/forfeiture/success-fee mechanics) | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | Unpaid Stage 1 foundations may already exist under Phase 2 spine; **paid** remains inactive |
| Wallet cash-out / consumer withdrawals | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26; FD-020 posture |
| Vendor self-service login portal | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Native iOS / Android apps | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | PWA-first near-term (FD-039 §35) |
| International expansion | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Multi-currency go-live | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Partner lead-ingest API programme | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Advanced analytics (as commercial/product expansion beyond ops KPIs) | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | Keep ops analytics separate |
| Advertising / premium listings as active commercial SKUs | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Referral reward programmes **with rates** | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | Do not invent rates; requires future Founder Approval |
| Dark mode MVP | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Docker / Edge as **mandatory** production architecture | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | May exist as technical experiments; not Founder-mandatory |
| ZBP commercial model revival | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |
| Super Admin as an ordinary product role | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26; RBAC remains FD-023 / FD-035 governed |
| Marketplace category-specific revenue-share variants | NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL | FD-039 §26 |

**Promotion rule:** No engineering “soft launch,” sales promise, or feature flag enable for catalogue items without citing a later Founder Decision ID.

---

## 8. Scale go / no-go (programme milestones)

Before each material multi-city or capacity jump:

| Gate | Required |
|---|---|
| MoR/GST/TDS/settlement/PSP | Still Validated for affected surfaces (FD-039 §32) |
| Compliance Register | Local/sector rows addressed; no DPIIT single-Act assumption |
| Support/finance capacity | Demonstrable |
| Part J catalogue | All still NOT ACTIVE unless Founder-activated |
| Cancellation / KYC postures | Still compliant with FD-039 Parts F and H |

---

## Risks

| Risk | Mitigation |
|---|---|
| Silent activation of future items | Catalogue + hard-off flags + Founder Approval rule |
| Scale before tax validation in new contexts | Re-run Hard Gates from Phase 17 |
| City selection pressure in this doc | Forbidden; Founder-only |
| Cost of inactive builds | Do not staff Part J delivery without Approval |
| Super Admin role creep | Explicit NOT ACTIVE row |

---

## Unresolved

- Which future catalogue item (if any) Founder prioritises next  
- Exact multi-city sequence (Founder)  
- Exact capacity/cost numeric targets post-baseline  
- Any tax/RBI deltas for new geographies — professional  
- Referral rates, advertising SKUs, paid Lead Assist commercials — only if future Founder Decision provides them  

---

## Document control

| Field | Value |
|---|---|
| Phase | 18 |
| Future catalogue | All listed items NOT ACTIVE / REQUIRES FUTURE FOUNDER APPROVAL |
| Type | Scale + future parking documentation only |
| Code / SQL | None |

**End of Phase 18 document**
