# SM_Enterprise_Opportunity — Enterprise Opportunity

## Authority

- **FD-026** GCE Enterprise Business and Operating Architecture
- **FD-038** Enterprise Cross-Vertical Commercial and Approval Rules
- Related: FD-029 (commission later), FD-035 (roles), FD-031 (lead routing may feed intake)

## Purpose

Model early **Enterprise opportunity / requirement intake** before quotation and project execution. Client-based attribution (not territorial exclusivity). Opportunity is distinct from Quote and Project machines.

## States

| State | Meaning |
|-------|---------|
| Lead Captured | Raw lead / inbound requirement |
| Qualified | Meets minimum qualification |
| Client Verification | Organisation / representative verification |
| Requirement Discovery | Discovery in progress |
| Brief Ready | Event/requirement brief prepared |
| Expert Assigned | Enterprise Platform Expert assigned |
| Vendor Exploration | Vendor search / shortlist (optional stage) |
| Ready for Quotation | Hand-off to SM_Enterprise_Quote |
| On Hold | Paused |
| Disqualified / Lost | Not progressing |
| Converted | Linked project/quote created |
| Cancelled | Withdrawn |

FD-026 §45 lists a long recommended path; this machine covers the pre-contract band. Exact enums Pending Technical Design.

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Lead Captured → Qualified | Enterprise BDP / Opportunity Desk / Expert | Minimum data; consent where required |
| Qualified → Client Verification | Ops / Expert | Client org identity path started |
| Client Verification → Requirement Discovery | Expert / BDP | Verification acceptable |
| Requirement Discovery → Brief Ready | Expert | Brief complete |
| Brief Ready → Expert Assigned | Ops | Expert assignment (may already exist) |
| Expert Assigned → Vendor Exploration / Ready for Quotation | Expert | Complexity needs vendors or direct quote |
| Vendor Exploration → Ready for Quotation | Expert | Shortlist/comparison adequate |
| * → On Hold | BDP / Expert / Ops | Client delay |
| On Hold → prior active state | Ops | Resume |
| * → Disqualified / Lost | BDP / Ops | Lost reasons |
| Ready for Quotation → Converted | System | Quote record created |
| * → Cancelled | Client / Ops | Withdrawal |

Enterprise BDP may present opportunities; cannot independently approve commercials, settlements, or personal commission (FD-026).

## Side effects

- Create/update Enterprise Client + Representative links (FD-038)
- Record/confirm Enterprise BDP client attribution status
- Assign Enterprise Platform Expert
- No commission earned at opportunity stage
- May reference Marketplace venues without merging vertical economics

## Audit events

`ent_opp.captured`, `ent_opp.qualified`, `ent_opp.client_verified`, `ent_opp.brief_ready`, `ent_opp.expert_assigned`, `ent_opp.ready_for_quote`, `ent_opp.on_hold`, `ent_opp.lost`, `ent_opp.converted`, `ent_opp.cancelled` — client id, BDP attribution id, actor, reason.

## Failure handling

- Missing client attribution → may continue intake; commission later blocked without valid attribution
- Self-dealing BDP as client — prohibited architecture (FD-038 §4)
- Duplicate opportunities — merge/link under Ops rules (Pending detailed dedupe design)

## Terminal states

Disqualified / Lost, Converted, Cancelled.

## Not in scope

- Quote Finance co-sign
- Milestone percentages
- Marketplace ticket MoR

## Unresolved

- Exact technical enum for full FD-026 lifecycle string — Pending Technical Design
- Dedupe / multi-city opportunity rules detail — Pending Operational Design where not explicit
