# SM_Payment — Payment

## Authority

- **FD-020** Financial and Wallet Architecture
- **FD-021** Settlement Engine
- **FD-028** Revenue Recognition and Commercial Architecture
- **FD-039** Phase 2 Commercial Acceptance (Logixia intended MoR; BDP pack online default + controlled offline)
- Related: FD-027/033 (commercial packs), FD-037 (Marketplace money movement)

## Purpose

Model platform **payment records** across membership, Marketplace tickets/offers, Enterprise milestones, and BDP commercial packs. Escrow-first principles apply where required (FD-020). Marketplace ticket MoR: **Logixia Solutions Private Limited (intended)**; production go-live validation-gated (FD-039).

## States

| State | Meaning |
|-------|---------|
| Draft / Intent Created | Payment intent created; not authorised |
| Pending Authorisation | At gateway / bank confirmation |
| Authorised | Auth hold (if used) |
| Captured / Received | Funds successfully received |
| In Escrow | Held pending activation/fulfilment/milestone rules |
| Failed | Authorisation/capture failed |
| Cancelled | Intent cancelled before success |
| Partially Refunded | Linked refunds reduced net |
| Fully Refunded | Net zero via refunds |
| Chargeback | Chargeback signalled |
| Offline Pending Evidence | Controlled offline BDP-pack bank payment awaiting proof (FD-039) |
| Offline Confirmed | Offline evidence accepted by Finance/Ops |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Draft → Pending Authorisation | System | Amount, currency, payer, purpose, MoR/merchant config present |
| Pending Authorisation → Authorised / Captured | Gateway / System | Gateway success |
| Pending Authorisation → Failed | Gateway | Decline/timeout |
| Authorised → Captured | System | Capture rules |
| Authorised → Cancelled | System / Ops | Void before capture |
| Captured → In Escrow | System | Escrow-required product (membership activation pending, event, milestone, etc.) |
| In Escrow → Captured (released to settlement path) | Settlement engine | Activation/fulfilment/milestone guards per FD-021 |
| Captured / In Escrow → Partially / Fully Refunded | Refund flow | SM_Refund Approved + processed |
| Captured / In Escrow → Chargeback | Gateway / Finance | Chargeback notice |
| Draft → Offline Pending Evidence | Finance / Ops | Rare offline BDP pack path; bank transfer only; **cash not normal** (FD-039) |
| Offline Pending Evidence → Offline Confirmed / Failed | Finance | Evidence complete/rejected |
| Offline Confirmed → Captured / In Escrow | Finance | Mapped into ledger |

**Guards:** Idempotent gateway handling (FD-021). Payment success ≠ membership Active, ≠ commission earned, ≠ settlement eligible.

## Side effects

- Immutable financial entries / compensating entries (FD-020)
- Customer / Escrow / Tax ledger updates as applicable
- Trigger membership Pending Verification / activation workflow
- Trigger commission **Estimated** only (not Earned)
- Block production ticket capture if MoR compliance gate open (ops policy)

## Audit events

`payment.intent_created`, `payment.authorised`, `payment.captured`, `payment.escrowed`, `payment.failed`, `payment.cancelled`, `payment.offline_pending`, `payment.offline_confirmed`, `payment.chargeback` — gateway refs, amounts, purpose, actor, MoR entity.

## Failure handling

- Double capture → idempotent no-op
- Captured but activation fails → remain In Escrow / controlled pending; do not activate twice
- Offline without evidence → do not activate BDP pack
- Chargeback → freeze related settlement/commission (SM_Settlement / SM_Commission)

## Terminal states

Failed, Cancelled, Fully Refunded; Chargeback may resolve to restored or refunded (pending detailed policy).

## Not in scope

- Wallet consumer cash-out (**inactive**, FD-039)
- Exact Razorpay technical mapping — Pending Technical / validation

## Unresolved

- MoR implementation validation checklist completion — Compliance gate (FD-039)
- Exact auth-vs-capture product matrix — Pending Technical / Finance Design
- Chargeback final states — Pending Finance, Legal, Technical Design
