# SM_Lead_Assist — AI Lead Assist (Stage 1 Unpaid)

## Authority

- **FD-031** GCE Connect AI Lead Assist Architecture (primary)
- **FD-032** Supersession: legacy paid Lead Assist concepts inactive
- **FD-039** Paid Lead Assist / ₹500 / escrow / success-fee mechanics **inactive**
- Related: FD-035 (Opportunity Desk roles)

## Purpose

Model **Stage 1 unpaid** Lead Assist: core lead rights, basic AI classification/routing, expert verification, human review, basic tracking. **No** hidden paid priority, **no** automatic success fee, **no** legacy ₹500 fee, **no** escrow/forfeiture monetisation in this stage.

## States

### Lead quality / record states (FD-031 §24)

| State | Meaning |
|-------|---------|
| Unverified Lead | Submitted; not verified |
| Preliminarily Verified | Initial checks passed |
| Qualified Lead | Minimum qualification conditions met |
| Rejected / Invalid Lead | Failed verification or invalid |

### Assignment / working states (operational)

| State | Meaning |
|-------|---------|
| Classified | AI classification complete (assistive) |
| Routed | Routed per hierarchy (Circle-first where applicable) |
| Offered to Receiver | Presented to eligible Lead Receiver |
| Accepted | Receiver accepted |
| Declined | Receiver declined |
| No Response | Deadline elapsed without action |
| In Follow-Up | Tracking follow-ups |
| Closed — Dual Confirmed | Dual-confirmed closed business (where applicable) |
| Closed — Unconverted | Closed without conversion |
| Reassigned | Reassigned under approved rules |
| Disputed | Attribution/quality dispute |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| (none) → Unverified Lead | Lead Giver / System | Consent/source recorded; original source preserved |
| Unverified → Preliminarily Verified / Rejected | Opportunity Desk / verifier | Verification methods (FD-031) |
| Preliminarily Verified → Qualified / Rejected | Verifier / human review | Minimum qualification conditions |
| Qualified → Classified → Routed | AI + Desk | Human-control principle; AI does not auto-finalise commercial outcomes |
| Routed → Offered to Receiver | System | Receiver eligibility; no paid priority queue |
| Offered → Accepted / Declined / No Response | Receiver / System | Response deadlines (FD-031) |
| Accepted → In Follow-Up | Receiver | Follow-up tracking |
| In Follow-Up → Closed — Dual Confirmed / Unconverted | Parties / System | Dual confirmation rules where closed business claimed |
| * → Reassigned | Desk / Ops | No-response or decline reassignment rules |
| * → Disputed | Parties / Desk | Dispute |
| Disputed → prior / Rejected / Reassigned | Dispute reviewer | Resolution |

**Hard guards:** No ₹500 fee collection; no escrow hold for Lead Assist monetisation; no success-fee posting; no Affiliate. Stage 2+ paid tools remain inactive until separately activated.

## Side effects

- Preserve Lead Giver / Receiver / verifier / closer identities separately
- Notify receivers via Phase 10 `assist_domain_events` hooks (full delivery = Phase 12)
- May feed Enterprise/Marketplace intake **without** creating commission by lead submit alone (FD-031)
- Performance metrics for Desk — non-punitive to genuine members per FD-031 abuse rules
- **Implemented (Phase 10 / gce-dev):** `assist_*` tables; see `docs/phase-10/PHASE_10_IMPLEMENTATION_NOTES.md`

## Audit events

`lead.submitted`, `lead.verified`, `lead.qualified`, `lead.rejected`, `lead.classified`, `lead.routed`, `lead.offered`, `lead.accepted`, `lead.declined`, `lead.no_response`, `lead.reassigned`, `lead.closed`, `lead.disputed` — source, actors, no monetisation fields inventing paid Stage 1.

## Failure handling

- AI misroute → human reassignment; do not charge fees
- Duplicate leads → merge/link per FD-031 duplicate rules
- Attempt to collect success fee in Stage 1 → reject / non-compliant

## Terminal states

Rejected / Invalid Lead; Closed — Dual Confirmed; Closed — Unconverted.

## Not in scope

- Lead Assist Pro / Managed Opportunity / paid SKUs (Stage 2–4)
- Escrow / forfeiture / success-fee mechanics
- ₹500 legacy fee

## Unresolved

- Exact response deadline values — see FD-031; if numeric SLAs incomplete, Pending Operational Design
- Stage 2 activation criteria — Pending future Founder Decision / launch approval
