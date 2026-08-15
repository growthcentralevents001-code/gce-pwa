# Marketplace Merchant and Payment Legal Model

| Field | Value |
|-------|-------|
| **Document ID** | P15-MOR-001 |
| **Status** | **FOUNDER + LAWYER + CA DECISION REQUIRED** |
| **Checked** | 2026-08-15 |
| **Do not** | Use “Merchant of Record” as if legally confirmed. FD-039 is **intended direction**, Validation Pending (OD-001). |

Using Razorpay/PSP **does not** make Logixia an RBI-authorised Payment Aggregator (SRC-010).

---

## Parties (actual product)

| Party | Role in product |
|-------|-----------------|
| Logixia / GCE brand | Platform; intended collector under FD-039 |
| Customer | Books Event; claims Offers |
| Venue Partner | Fulfils Event/Offer at location |
| Event organiser | May equal Venue or differ — **confirm per Event** |
| Marketplace BDP | Recommends Venue; **not** city owner; 10% only if attributed |
| Payment provider | Candidate: Razorpay; flags OFF |

## Technical payment facts (today)

| Question | Technical answer |
|----------|------------------|
| Who creates order | Platform payment-intent architecture (Phase 9/11); **live capture OFF** |
| Who is merchant in PSP | **UNKNOWN** — not production-configured |
| Whose account receives funds | Intended Logixia (FD-034/039) — **not evidenced in PSP** |
| Split/transfer | Business split 80/10/10 or 80/0/20 is **ledger economics**, not proof of Razorpay Route |
| Venue payout | Platform-initiated later; `payout_execution` OFF |
| MBDP commission | Entitlement then settlement; not automatic |
| GCE share | Residual after Venue (+ MBDP if attributed) |
| Refund initiation | Manual review; `refund_processing` OFF |
| Chargeback ownership | **Unresolved** (OD-006) |

**Collected funds are not automatically Logixia revenue** (FD-028).

---

## Model A — Logixia/GCE contracts with customer as principal

*(Aligned with FD-039 intended MoR.)*

| Lens | Sketch (not advice) |
|------|---------------------|
| Customer contract | Customer ↔ Logixia |
| Payment flow | Customer → PSP → Logixia merchant account |
| Invoice flow | Logixia tax invoice to customer — **CA confirm** |
| GST | Own-account supply? Rate/HSN/POS — **CA**. TCS s.52 typically about supplies **by other suppliers** — may **not** mechanically apply if Logixia is the supplier — **CA must confirm** |
| Cancel/refund | Logixia responsible to customer; recovery from Venue via contract |
| Grievance | Logixia |
| Platform liability | Higher operational/legal exposure |
| RBI/payment | Merchant using PA/PG; **not automatically a PA**. If Logixia also pools and pays Venues, counsel must test PA-like activity |
| Commercial | Matches intended MoR; Venue is fulfilment partner |

## Model B — Venue/organiser contracts with customer; GCE intermediary/tech

| Lens | Sketch (not advice) |
|------|---------------------|
| Customer contract | Customer ↔ Venue |
| Payment flow | Often ECO collects consideration — **may** engage s.52 TCS and e-commerce duties — **CA/lawyer** |
| Invoice | Venue invoices customer; GCE invoices commission — **CA** |
| GST | Marketplace vs own-account |
| Refund | Venue primary; platform facilitation |
| Grievance | E-commerce marketplace duties more likely |
| Liability | Different; not “safe” automatically |
| RBI | Collecting for many merchants is closer to **PA** territory — **payments counsel** |
| Commercial | Conflicts with FD-039 intended MoR unless Founder supersedes |

## Model C — Componentised / project-specific

More natural for **Enterprise**. For Marketplace tickets, only if counsel designs it. Do not default.

---

## Output

**FOUNDER + LAWYER + CA DECISION REQUIRED** (plus payments counsel before money). Not conclusively governed: FD-039 is Layer 1 business direction, not Layer 2 validation.

## QUESTIONS FOR PROFESSIONAL REVIEW

1. Does intended MoR survive GST + PA analysis?  
2. Offer in-store payment: who is supplier of the **goods/services redeemed** vs platform claim mechanic?  
3. Razorpay marketplace vs standard merchant product.

## QUESTIONS REQUIRING FOUNDER DECISION

FD15-MOR-001.
