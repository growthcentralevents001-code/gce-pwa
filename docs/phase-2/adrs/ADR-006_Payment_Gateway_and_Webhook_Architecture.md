# ADR-006 — Payment Gateway and Webhook Architecture

| Field | Value |
|-------|-------|
| **ID** | ADR-006 |
| **Title** | Payment Gateway and Webhook Architecture |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation; MoR direction is Founder law but **implementation-validation-gated** |
| **Supersedes** | None |
| **Dependencies** | ADR-007, ADR-009, ADR-010 |

---

## Context

GCE needs online collection for Marketplace tickets and BDP commercial packs, plus rare controlled offline bank recording (FD-039). Logixia Solutions Private Limited is the **intended** Marketplace ticket Merchant of Record (MoR); **implementation details remain validation-gated** (FD-034, FD-039). Razorpay is an India PSP **candidate**, not Founder law (FD-039).

Wallet cash-out / consumer withdrawals remain **inactive** (FD-039).

---

## Decision

1. **PSP candidate:** Prefer **Razorpay** as India-launch payment service provider candidate for online collection. Swappable if validation or commercial terms require it.
2. **Webhook architecture:**
   - Ingest via Next.js **Route Handlers** (public callback endpoints).
   - Verify signatures with server-only secrets.
   - Persist provider event id; process **idempotently** (at-least-once delivery assumed).
   - Drive ledger/settlement domain services; do not trust client-reported “paid” alone.
3. **MoR:** Business direction = Logixia intended MoR for Marketplace event tickets. Exact account mapping, invoicing, GST/TDS, refunds, and provider configuration are **not** decided in this ADR and require professional validation before production money movement.
4. **BDP packs:** Online payment default. Rare offline NEFT/RTGS/cheque/other approved bank method only via authorised, reconciled, audited Admin workflow (FD-039). Cash is not a normal activation method.
5. **No invented commercial rates** or MoR implementation specifics in this ADR.

**Labels:**

- Razorpay choice → **Technical recommendation (not Founder law)**
- Logixia intended ticket MoR → **Founder business direction; implementation validation-gated**
- Offline Admin bank workflow → **Founder law (FD-039)**

---

## Consequences

### Positive

- Clear online vs offline paths; auditable activations.
- Idempotent webhooks reduce double-credit risk.
- Keeps PSP choice reversible without rewriting Founder MoR intent.

### Negative / trade-offs

- Dual path (online + rare offline) increases Admin controls burden.
- MoR validation may force account/flow changes before go-live.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Hard-code Razorpay as Founder law | Explicitly rejected by FD-039 |
| Client-only payment confirmation | Unsafe; no webhook/ledger integrity |
| Cash activation as normal path | Forbidden as normal method (FD-039) |

---

## Governing FDs

- **FD-034** — Logixia legal company; payment receipt entity subject to validation
- **FD-037** — Marketplace transaction families / revenue rules (commercial)
- **FD-039** — MoR direction; Razorpay candidate; BDP pack online/offline; cash-out inactive
- **FD-020 / FD-021** — Ledger and settlement principles after payment success

---

## Not in scope

- Exact Razorpay account configuration, settlement timing, or fee schedules
- GST/TDS rates, invoice templates, refund accounting entries
- Chargeback playbooks detail
- Wallet cash-out product

---

## Professional validation

**Mandatory before production Marketplace ticket money movement:** legal, tax, banking, payment-provider, and accounting validation of MoR structure, invoicing, refunds, and provider setup (FD-039). BDP pack offline bank workflows require Finance/ops control design review.
