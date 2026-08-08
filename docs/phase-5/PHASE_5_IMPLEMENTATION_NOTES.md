# Phase 5 Implementation Notes — Membership & GCE Connect

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Branch** | `development` |
| **Production** | Untouched |

---

## Authority

FD-022, FD-024, FD-027, FD-030, FD-032, FD-035, FD-036, FD-039; SM_Membership / SM_Circle / SM_Circle_Seat / SM_KYC; Phase 2–4 spine.

---

## Migration

`supabase/migrations/20260808160000_phase5_membership_gce_connect.sql`

Applied to gce-dev via `supabase db query --linked -f …` + `migration repair 20260808160000 --status applied`.

### Domain tables

- `membership_plans` — Associate purchasable ₹6,000; Core future/inactive not purchasable
- `connect_memberships` — status + **allocation_status** separate
- `membership_tags` — max 4 slots; 1–2 included; 3–4 +25% each
- `business_specialisations`
- `kyc_verification_cases` — Aadhaar not required by default
- `connect_circles` — dual `lifecycle_status` + `constitution_status`
- `connect_circle_seats` + `gce_confirm_circle_seat` (blocks seat 41)
- `gce_refresh_circle_capacity` — 15 one-time activation + BDP credit hook id (Phase 6 consumes)
- waitlist / allocation proposals / transfers / governance appointments
- `legacy_membership_migration_map` — basic/gold/platinum historical_only

---

## Services

`lib/architecture/connect/*` — memberships, tags, circles, allocation, governance/KYC/transfer.

### APIs

- `GET|POST|PATCH /api/connect/memberships`
- `GET|POST /api/connect/circles`

---

## Hard invariants verified

- Payment success → `pending_verification` (not `active`)
- Active membership may remain `unallocated`
- Tag 3/4 = +25% each; max 4
- Dual Circle statuses at 0–14 / 15–19 / 20–39 / 40
- Seat 41 rejected; BDP target credit event id issued once at 15

---

## Non-blocking / deferred

- OD-007 membership refund matrix — request/review placeholders only
- OD-023 contractual waitlist formula — operational `created_at` + `admin_priority` only
- GST / payment-provider production gates remain off (`membership_associate_purchase` flag default false)
- Phase 6 Connect BDP commercial engine not started

---

## UI

Minimal Connect membership panel on `/dashboard/[workspaceKey]` for `connect-member` / `personal`. No redesign; dirty WIP untouched.
