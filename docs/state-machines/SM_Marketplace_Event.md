# SM_Marketplace_Event — Marketplace Event (Ticketing)

## Authority

- **FD-037** Marketplace Transaction, Approval, and Unattributed Revenue Rules
- **FD-033** Marketplace BDP Commercial and Operating Architecture
- **FD-039** Phase 2 Commercial Acceptance (48h cancel cutoff; Logixia intended MoR)
- Related: FD-020/021/028/029 (payment, settlement, revenue, commission)

## Purpose

Model ticketed **Marketplace Event** lifecycle from draft through completion/cancellation. Platform Marketplace Operations has **final approval**. Customer cancellation cutoff default: **48 hours before event start** (FD-039). Exact **refund percentage** is **not** locked.

## States

| State | Meaning |
|-------|---------|
| Draft | Venue / BDP drafting |
| Submitted | Submitted for platform review |
| Approved | Approved; not yet on sale |
| Published / On Sale | Tickets available |
| Sold Out | Inventory exhausted |
| Live / In Progress | Event started |
| Completed | Event finished; fulfilment recorded |
| Cancellation Requested | Customer or organiser cancel path started |
| Cancelled | Cancelled per policy |
| Under Review | Moderation / compliance hold |
| Rejected | Approval denied |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Draft → Submitted | Venue / Marketplace BDP | Required event fields; venue Active |
| Submitted → Approved | Platform Marketplace Ops | Moderation + commercial rules; ₹50k campaign rule applies where relevant (FD-037) |
| Submitted → Rejected / Under Review | Ops | Fail or more info |
| Under Review → Approved / Rejected / Draft | Ops | Review outcome |
| Approved → Published / On Sale | Ops / System | Go-live checks; MoR payment path configured for production (FD-039 validation gate) |
| Published → Sold Out | System | Inventory = 0 |
| Sold Out → Published | Ops | Inventory increased |
| Published / Sold Out → Live / In Progress | System | Event start time |
| Live → Completed | System / Ops | Event end + completion evidence as required |
| Published → Cancellation Requested | Customer / organiser / Ops | Policy path invoked |
| Cancellation Requested → Cancelled | Ops / System | **Customer cancel:** now ≤ event_start − **48h** unless event-specific variation approved (FD-039 §14–15); organiser/platform cancels per separate rules |
| Cancellation Requested → Published | System | Request denied (e.g. inside 48h without approved exception) |
| * → Under Review | Ops | Moderation |
| Approved / Published → Cancelled | Ops | Platform/organiser cancellation |

**Guards (commerce):** Attribution at earning → 80/10/10 else 80/0/20. Commission base excludes GST, refunded/cancelled value per FD-037. Logixia = **intended MoR** for tickets; production money movement validation-gated (FD-039).

## Side effects

- Create ticket inventory and payment intents (SM_Payment)
- On cancel: initiate SM_Refund per policy (**refund % pending**)
- On complete: settlement eligibility countdown / hold checks (SM_Settlement)
- Emit commission estimates only when rules allow (SM_Commission)
- No double commission with Enterprise components

## Audit events

`event.submitted`, `event.approved`, `event.published`, `event.sold_out`, `event.started`, `event.completed`, `event.cancel_requested`, `event.cancelled`, `event.rejected`, `event.under_review` — include cancel cutoff evaluation result, actor, reason.

## Failure handling

- Approval by BDP alone → invalid
- Cancel inside 48h without approved variation → deny customer cancel (refund still subject to separate policy)
- Payment captured but event Rejected → refund / reverse path
- MoR validation incomplete → **block production ticket money movement** (architecture may proceed)

## Terminal states

Completed, Cancelled, Rejected.

## Not in scope

- Offer Event / Offer Claim (separate machines)
- Exact refund percentages, chargeback SLAs
- Affiliate

## Unresolved

- Exact refund percentage / schedule — Pending Finance, Legal, Tax, Product (FD-039 §16; FD-037 §44)
- Event-specific cancel variations process — Pending Product / Ops Design
- Chargeback treatment — Pending Finance, Legal, Technical Design
