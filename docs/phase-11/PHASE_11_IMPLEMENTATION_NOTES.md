# Phase 11 — Events, Offers, Booking & Customer Experience Implementation Notes

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Authority** | FD-037 / FD-039 / FD-028 / FD-029 / FD-033; Phase 7 + Phase 9 SoT |
| **Migration** | `supabase/migrations/20260808220000_phase11_customer_experience.sql` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |
| **Money stage** | Ticket payments / settlement / payout / refund_processing **OFF** |

---

## Authority map used

| Topic | Controlling source | Implementation choice |
|-------|--------------------|----------------------|
| Event / Offer discovery (published only) | FD-037 | `discoverEvents` / `discoverOffers` filter approval + publication + dates |
| Booking / tickets / claims | FD-037 + Phase 7 tables | Orchestrate `marketplace_*`; no `_v2` tables |
| 48h cancellation default | FD-039 | `EVENT_DEFAULT_CANCEL_CUTOFF_HOURS=48`; event-specific override via policy version |
| Refund economics | OD-006 / FD-039 | `customer_refund_requests.amount_determination = manual_review_required` — **no invented %** |
| Offer claim validity / cap | FD-037 / Phase 7 | 72h `expires_at`; customer cap 100; claim ≠ revenue |
| Trust Rank levels/weights | Phase 11 plan Unresolved | Snapshot + immutable rank events; `level_label = unresolved`; no Starter/Elite invention |
| Venue Performance Rank weights | Unresolved | Event collection + snapshot cache; `venue_rank_display` OFF |
| Payment / settlement money | Phase 9 + FD-039 | Consume `payment_intents`; sandbox confirm only while ticket payments OFF |

## Prompt-vs-FD discrepancies recorded

1. Prompt filename `…BOOKING…` — repo plan file is `PHASE_11_EVENTS_OFFERS_BOOKINGS_CUSTOMER_EXPERIENCE.md` (used).
2. Prompt named concrete Customer Trust Rank levels (Starter/Active/Trusted/Elite/Legend) and implied weights — **not Founder-approved**; Phase 11 plan marks formula Unresolved → foundation/display only.
3. Prompt suggested inventing refund % / convenience-fee / no-show — **forbidden** by OD-006 / FD-039; manual review only.

---

## Phase 7 domain reuse

Canonical SoT (unchanged ownership):

- `marketplace_events`, `marketplace_offer_events`
- `marketplace_bookings`, `marketplace_tickets`
- `marketplace_offer_claims`, `marketplace_redemptions`
- Customer / Venue rank-event tables
- RPCs: `gce_marketplace_ticket_check_in`, `gce_marketplace_redeem_claim`

Phase 11 adds orchestration RPCs only:

- `gce_marketplace_create_booking` (capacity `FOR UPDATE`)
- `gce_marketplace_claim_offer` (cap + one active claim)

No duplicate booking/ticket/claim tables.

## Phase 9 finance reuse

- Booking sandbox path attaches `payment_intents` then issues tickets when `marketplace_ticket_payments` is OFF.
- Cancel / refund request does **not** invent refund accounting; links to Phase 9 reversal boundary when Finance processes.
- Claim and redemption **never** post revenue components.

## Additive CX schema

- `customer_cx_preferences`
- `customer_refund_requests`
- `customer_feedback`
- `customer_non_purchase_reasons`
- `customer_domain_events` (Phase 12 notification hooks)
- `customer_trust_rank_snapshots` / `venue_performance_rank_snapshots`
- `customer_support_signals`
- Search indexes (`pg_trgm`) on public Event/Offer text fields only

## Feature flags

| Flag | Enabled |
|------|---------|
| `customer_booking` | ON |
| `offer_claims` | ON |
| `customer_rank_display` | ON |
| `venue_rank_display` | OFF |
| `marketplace_ticket_payments` | **OFF** |
| `settlement_execution` | **OFF** |
| `payout_execution` | **OFF** |
| `refund_processing` | **OFF** |

## APIs / UI

- API: `GET/POST /api/customer`
- Domain: `lib/architecture/customer-cx/*`
- Isolated routes: `/customer`, `/customer/events`, `/customer/offers`, `/customer/tickets`
- Personal workspace panel links to `/customer` on canonical dashboard only

## Dirty UI / prototype strategy

| Area | Classification | Action |
|------|----------------|--------|
| `app/page.tsx`, HeroBanner, Header | unrelated WIP | Untouched / unstaged |
| `app/events/*`, venue dashboard pages | prototype / dirty WIP | Untouched; CX lives under `/customer/*` |
| `EventFiltersPanel`, globals/tailwind/sw | unrelated WIP | Untouched |
| City migration `20260703110000_*` | unrelated | Not applied / not committed |
| FD-039 dirty edits | Founder WIP | Never staged |

## Verification (gce-dev)

- Migration applied via session pooler to **gce-dev only**
- SQL harness: `PHASE11_CUSTOMER_CX_OK` (capacity concurrency, claim cap, claim≠revenue)
- Unit / integration Phase 11 suites green
- `lib/database.types.ts` regenerated from gce-dev
- Production project untouched; money flags OFF

## Not started

- Phase 12 notification delivery engine / analytics warehouse / fraud ops (domain-event hooks only)
- Invented refund percentages or Trust/Venue rank formulas
- Overwrite of dirty home/venue prototype UI
