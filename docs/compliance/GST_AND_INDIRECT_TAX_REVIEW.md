# GST and Indirect Tax Review

| Field | Value |
|-------|-------|
| **Document ID** | P15-GST-001 |
| **Status** | **NOT TAX ADVICE** — CA validation required |
| **Checked** | 2026-08-15 |
| **Rates** | **Do not hardcode** into legal docs or engines until CA approves |

Sources: CGST Act s.2 / s.9(5) / s.52 (SRC-007); TCS **rate** notifications 10 Jul 2024 **if TCS applies** (SRC-008). Applicability ≠ rate.

---

## E-commerce operator / TCS / s.9(5) — method

1. Identify **contractual supplier** (depends on FD15-MOR-001).  
2. Identify who **collects consideration**.  
3. If Logixia supplies **on own account**, s.52 TCS is **not automatically** engaged merely because a website is used (Act concerns supplies **by other suppliers** through an ECO). **CA confirm.**  
4. If Logixia is ECO collecting for **other** suppliers, s.52 **may** apply at the **notified** rate.  
5. s.9(5) applies only to **notified service categories** (commonly discussed examples in commentary: specified passenger transport, accommodation, restaurant — **verify current notification list**). **Do not assume Event tickets are s.9(5).**  
6. Do not assume TCS applies to every GCE transaction. Do not assume it never applies.

---

## Component map (questions, not conclusions)

| Flow | Payer | Recipient of funds (intended) | Contractual supplier (open) | Invoicing party (open) | Consideration | System accounting | GST question | ECO/TCS question | Professional conclusion |
|------|-------|-------------------------------|-----------------------------|------------------------|---------------|-------------------|--------------|------------------|-------------------------|
| Connect Associate membership | Member | Logixia | Likely Logixia | Likely Logixia | Subscription | Eligible revenue after exclusions | Rate/exemption? | Own-account vs ECO | **CA** |
| Tag fees (if charged) | Member | Logixia | Likely Logixia | Logixia | Fee | Per constants | Same | Same | **CA** |
| Connect BDP pack ₹50k / ₹60k | BDP | Logixia | Licence fee characterisation | Logixia | Pack | Not Circle ownership | SAC? | Unlikely TCS (own account) — **CA** | **CA** |
| Connect BDP commission 20% | Platform pays BDP | BDP | BDP supply to Logixia? | BDP invoice / self-bill? | Commission | Entitlement then settlement | GST on commission | TCS N/A; **TDS** see other memo | **CA** |
| Marketplace ticket (attributed) | Customer | Intended Logixia | **A vs B** | **Open** | Ticket price | Split 80/10/10 of **Eligible** after tax exclusions | Ticket GST; whether GCE 10% is commission or residual | If Model B: TCS possible | **CA + lawyer** |
| Marketplace ticket (unattributed) | Customer | Intended Logixia | **A vs B** | **Open** | Ticket | 80/0/20 | Same | Same | **CA** |
| Platform vs Venue vs MBDP components | — | Ledger only today | — | — | — | Not three customer invoices unless CA says so | How many supplies? | — | **CA** |
| Offer (in-store conversion) | Customer at store | Venue typically | Venue for goods? | Venue | Store sale | Claim ≠ revenue | Usually Venue supply | Platform may not collect that consideration | **CA** |
| Enterprise platform commission | Client | Logixia | Project-specific | MSA | Commission/component | Componentised | Rate | Unlikely marketplace TCS — **CA** | **CA** |
| Enterprise vendor component | Client or Logixia | Vendor | Project-specific | Vendor or pass-through | Fees | Not GCE revenue automatically | — | — | **CA** |
| EBDP 25% of **GCE platform commission** | Platform pays EBDP | EBDP | Commission supply | EBDP invoice? | 25% of eligible platform commission **not** project value | Entitlement | GST on commission | TDS | **CA** |

## QUESTIONS FOR PROFESSIONAL REVIEW

Place of supply for Events; e-invoicing threshold; whether Pilot without GSTIN is lawful; credit notes on refunds.

## QUESTIONS REQUIRING FOUNDER DECISION

FD15-MOR-001 before GST conclusions can be stable.
