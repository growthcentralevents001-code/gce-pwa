# Refund, Cancellation and Chargeback Decision Matrix

| Field | Value |
|-------|-------|
| **Document ID** | P15-REF-001 |
| **Status** | FOUNDER + LAWYER + CA DECISION REQUIRED |
| **Checked** | 2026-08-15 |
| **Locked** | Default cancellation **cutoff 48 hours** before Event start (FD-039); event-specific variation only if disclosed, approved, reasonable, lawful |
| **Not locked** | Percentages, payout timelines, convenience fee, no-show, chargeback allocation (OD-006) |
| **Execution** | `refund_processing` **OFF** — Phase 15 must **not** enable it |

No fake precision.

---

| Scenario | Technical capability | Current product text | Unresolved commercial question | Consumer-law concern | Finance/accounting | Options (illustrative — not chosen) | Founder | Lawyer | CA/payments |
|----------|----------------------|----------------------|--------------------------------|----------------------|--------------------|-------------------------------------|---------|--------|-------------|
| Customer cancel **before** 48h cutoff | Cancel request; refund = `manual_review` | Orientation terms; no % | What % of ticket? How fast? | Disclosure + fairness | Credit note; GST reversal | Full / tiered / Venue policy within platform floor | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Customer cancel **after** cutoff | Same | Cutoff directed | Zero vs goodwill vs Venue discretion | Must match disclosed policy | Same | No refund / exceptional ops | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Convenience / platform fee | Fee **not** invented as a live SKU | None | If a fee exists later, is it refundable? | Drip pricing if hidden | Fee vs tax | Disclose before pay; refundability explicit | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| No-show | Ticket states exist | None | Forfeit vs credit | Unfair term risk | Revenue timing | Forfeit if disclosed / Venue rule | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Event cancelled by Venue/platform | Ops cases | None | Who funds full refund? | Strong consumer expectation of refund | Who bears | Platform vs Venue vs MoR model | Depends on FD15-MOR-001 | NOT REVIEWED | NOT REVIEWED |
| Venue cancelled / capacity fail | Ops | None | Same | Same | Chargeback risk | Same | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Partial refund / reschedule | Manual review | None | Allowed? Who approves? | Transparency | Partial credit notes | Ops policy | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Force Majeure | None coded as auto | None | Definition + outcome | Unfair terms | — | Counsel clause | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Chargeback | Ledger concepts exist; execution OFF | None | Who pays PSP fee? Venue vs Logixia | Customer still has bank rights | Recovery vs entitlement reversal | Allocate per MoR model | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| Offer claim unused in 72h | Claim expiry | Product rule 72h | Not a ticket refund | Do not call it a paid good if unpaid | Claim ≠ revenue | Keep | N/A (product) | NOT REVIEWED | N/A |
| Membership after activation | States exist | FD-027 non-refundable posture | Exact exceptions (OD-007) | If consumer | Revenue | Exceptions for platform/legal error only | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |
| BDP pack after activation | Pack states | Non-refundable after activation (constants) | Cooling-off? | Franchise/consumer characterisation | Recovery balance | Counsel | OUTSTANDING | NOT REVIEWED | NOT REVIEWED |

## QUESTIONS FOR PROFESSIONAL REVIEW

Consumer-code fairness of any chosen %; GST on cancelled tickets under chosen MoR.

## QUESTIONS REQUIRING FOUNDER DECISION

FD15-REF-001 and FD15-MEM-001. Do not ask Cursor to pick percentages.
