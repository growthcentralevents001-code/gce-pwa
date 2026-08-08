# Phase 6 Implementation Notes — Connect BDP

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Branch** | `development` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |

---

## Authority

FD-025, FD-029, FD-032, FD-034, FD-035, FD-036, FD-039; SM_Connect_BDP_Attribution; `docs/core/36_Commercial_Constants.md`.

**Number resolution:** Where the implementation brief conflicted with Founder law (e.g. 10% commission, 10 Circles, Tier caps 5/2/1), **Founder Decisions + commercial constants win**:

| Rule | Implemented (FD) |
|------|------------------|
| Commission | **20%** attributed Connect subscription only |
| Target | **5 Circles in 10 months** |
| Circles / unit | **5** |
| City unit maxima | T1:**10** · T2:**5** · T3:**2** |
| Package | Direct ₹50,000 **or** finance ₹60,000 (₹5k + ₹55k recoverable) |
| Recovery | Max ₹5,000/cycle from Month 0 earned/settlement-eligible commission |

---

## What shipped

### Database

`supabase/migrations/20260808170000_phase6_connect_bdp.sql`

- `connect_bdp_city_configs`, `connect_bdp_units`, `connect_bdp_city_assignments`
- `connect_bdp_member_attributions`, `connect_bdp_circle_assignments`
- `connect_bdp_target_credits` (unique per circle + event)
- `connect_bdp_commission_entitlements`, `connect_bdp_recovery_entries`
- `connect_bdp_disputes`, `connect_bdp_handovers`
- `legacy_connect_bdp_migration_map` (cbdp mapped / bdm ambiguous / zbp+franchisee historical)
- Caps: person 2 units, city max by tier, 5 circles/unit
- Functions: credit at formal 15 activation, recovery apply, portfolio refresh
- Extends `gce_refresh_circle_capacity` to call BDP target credit (idempotent)
- Feature flags **OFF**: `connect_bdp_pack_payments`, `connect_bdp_offline_bank_payment`
- RLS: own-scope BDP; Finance on commission/recovery read; no client write to target credits

### Application

- `lib/architecture/connect-bdp/**` — constants, units, operations, lifecycle, reporting, permissions
- `app/api/connect/bdp/route.ts` — apply/activate/city/attribution/circle/entitlement/recovery/dispute/handover
- Minimal Connect BDP panel on `/dashboard/connect-bdp`

### Tests

- Unit: package amounts, 20% boundary, unattributed=0, recovery caps
- Integration SQL: Tier-3 city max 2, recovery cycle cap, one-time target credit

---

## Explicit non-goals / gates

- Marketplace BDP / Phase 7 not started
- Full Phase 9 settlement engine not implemented (entitlement boundary + recovery hooks only)
- Production money collection remains feature-flagged OFF
- OD-021 stability window: **not invented** — credit remains at formal 15 activation
- GST/TDS/final BDP agreement: professional validation pending

---

## Verification

- Applied to gce-dev only; production untouched
- `lib/database.types.ts` regenerated from gce-dev
- Migration history repaired: `20260808170000` applied
