# Phase 7 Implementation Notes — Marketplace & Marketplace BDP

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Branch** | `development` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |

---

## Authority map (Founder SoT)

| Rule | Value | Source |
|------|-------|--------|
| Attributed split | 80% Venue · 10% MBDP · 10% GCE | FD-029/037 |
| Unattributed split | 80% Venue · **0%** MBDP · 20% GCE | FD-037 |
| Unit capacity | **20** Venues / unit | FD-033 |
| Person max units | **2** (second needs approval) | FD-033 |
| Standard max venues | **40** | FD-033 |
| Territory | Venue-attribution based; **no** city ownership | FD-033 |
| Pack | ₹50k direct or ₹60k finance (₹5k+₹55k) | FD-029/033 |
| Recovery | Month 0; ≤₹5k/cycle from MBDP commission | FD-029 |
| Offer min planned value | ₹50,000 (qualification only; not fee/revenue) | FD-028/037 |
| Campaign max | 15 days; ≤100 customers; 72h claim | FD-037 |
| Cancel default | 48h before start | FD-039 |
| MoR direction | Logixia; production money gated | FD-039/034 |
| Venue final approval | Platform Ops (MBDP recommend only) | FD-037 |

**Prompt vs FD:** No conflicting commercial numbers requiring override in this Implementation Notes set; Phase 7 brief aligned with FD-029/033/037 after authority read.

---

## What shipped

### Database

`supabase/migrations/20260808180000_phase7_marketplace_and_mbdp.sql`

- `marketplace_bdp_units`, `marketplace_venues`, `marketplace_venue_attributions`
- `marketplace_events`, `marketplace_offer_events`
- `marketplace_bookings`, `marketplace_tickets`
- `marketplace_offer_claims`, `marketplace_redemptions`
- `marketplace_revenue_entitlements`, `marketplace_bdp_recovery_entries`
- `marketplace_venue_handovers`, rank event foundations, legacy map
- Split helper `gce_marketplace_split`; QR check-in + redeem RPCs
- Enabled RLS on legacy `venues`; dropped dangerous `events.allow_all_delete`
- Flags: `marketplace_bdp_pack_payments` OFF; ticket payments remain OFF

### Application

- `lib/architecture/marketplace/**`
- `app/api/marketplace/bdp/route.ts`
- Workspace panels for `marketplace-bdp` and `venue` on `/dashboard/[workspaceKey]`
- Did **not** overwrite dirty legacy `/dashboard/venue/*` WIP

### Legacy prototype posture

| Object | Status |
|--------|--------|
| `venues` (53 rows preserved) | Shell + RLS enabled; bridge via `legacy_venue_id` |
| `events` | Shell only; canonical = `marketplace_events` |
| `bookings` | Historical only; schema drift → `marketplace_bookings` |
| `offers` / `offer_claims` | Historical; Offer Event is `marketplace_offer_events` |
| `zbp_*` / affiliate | Quarantined / inactive |

---

## Gates remaining (non-blocking)

- OD-006 refund economics
- Exact public rank weights (foundation only)
- GST/TDS/MoR professional validation — money flags OFF
- Full Phase 9 settlement execution

---

## Verification

- Applied to gce-dev; production untouched
- Legacy venue count unchanged (53)
- Types regenerated from gce-dev
- Migration history repaired: `20260808180000`
