# Phase 15 — Production Compliance Checklist

| Field | Value |
|-------|-------|
| **Document ID** | P15-PRC-001 |
| **Checked** | 2026-08-15 |
| **Result** | **NOT READY** — Pilot ≠ production |

Do **not** conflate Phase 16 Controlled Pilot with Phase 17 production-scale launch.

---

## Additional production items (beyond Pilot)

- [ ] Production payment enablement authorised after professional sign-off
- [ ] Production DB migrations applied with rollback
- [ ] Historical credential backfill or support strategy executed
- [ ] Distributed rate limits as security requires
- [ ] Production secret/key management (including `GCE_CREDENTIAL_ENCRYPTION_KEY`) with rotation owners
- [ ] Tax automation / e-invoicing as CA requires
- [ ] Invoice / credit-note operational process
- [ ] Settlement and payout controls + SoD staffing
- [ ] Live messaging compliance (consent, DLT/SMS, email)
- [ ] Expanded monitoring (Sentry, logs, CERT-In 180-day evidence)
- [ ] Operational staffing (Support, Finance, Compliance, Opportunity Desk)
- [ ] Professional sign-offs covering **production** scope (may be wider than Pilot)
- [ ] CERT-In incident reporting drill
- [ ] Backup/restore tested
- [ ] Vendor DPAs executed
- [ ] Trademark/brand instructions
- [ ] Local licences for live Event types/city
- [ ] Insurance programme as counsel advises (not a coding decision)

## Flags that must stay controlled

Remain OFF until **separate Founder authorization after Phase 15**:

- `marketplace_ticket_payments`
- production payment execution
- `settlement_execution` / `payout_execution`
- `refund_processing`
- `wallet_cashout`
- live email / SMS / push / marketing automation
- paid Lead Assist and other Part J products

## Production safety (this phase)

- [x] Production not deployed by Phase 15
- [x] Production Supabase not touched
- [x] No money movement enabled

**Production readiness: NOT READY**
