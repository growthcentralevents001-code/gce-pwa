# Phase 4 Implementation Notes — Identity, RBAC & Organisation

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Branch** | `development` |
| **Production** | Untouched |

---

## Authority

FD-023, FD-032, FD-034, FD-035, FD-036, FD-038, FD-039; ADR-001/002/003/005; `SM_Role_Assignment.md`; Phase 2–3 foundation.

---

## What shipped

### Database (additive migration)

`supabase/migrations/20260808150000_phase4_identity_rbac_organisation.sql`

- `assignment_status` + `terminated`
- `gce_role_key` + `enterprise_platform_expert`, `opportunity_desk`
- Assignment approval/suspension/termination audit columns
- `identity_suspensions` (platform-wide identity hold ≠ role suspension)
- `emergency_access_grants` + `emergency_access_uses` (break-glass; not Super Admin)
- SoD trigger on `role_assignments`
- Legacy `user_roles` insert quarantine for `zbp` / `affiliate` / `franchisee` / `bdm`
- RLS for new tables + strengthened org visibility

Applied to **gce-dev only** via `supabase db query --linked -f …` then `migration repair 20260808150000 --status applied`. City migration and production not touched.

### Application services

| Area | Path |
|------|------|
| Current identity | `lib/architecture/identity/current.ts` |
| Profile ensure/update | `lib/architecture/identity/profile.ts` |
| Assignment lifecycle | `lib/architecture/identity/assignments.ts` + `sod.ts` |
| Identity suspension | `lib/architecture/identity/suspension.ts` |
| Emergency access | `lib/architecture/identity/emergency.ts` |
| Organisations / memberships | `lib/architecture/organisations/*` |
| AuthZ helpers | `lib/architecture/rbac/authz.ts`, `matrix.ts`, `scope.ts` |
| Workspace derivation | `lib/architecture/workspace/registry.ts` (extra role → shell map) |

### APIs

- `GET /api/identity/me`
- `GET /api/identity/workspaces`
- `POST|PATCH /api/admin/role-assignments`
- `POST /api/admin/organisations`
- `POST|PATCH /api/admin/organisation-memberships`
- `POST /api/admin/emergency-access`

### Client verification surfaces

- `/dashboard/[workspaceKey]` — server-side workspace AuthZ; suspended/no-role/denied states
- `/unauthorized` — reason query param for legacy quarantine redirects
- Existing workspace switcher persists preference after server check

### Tests

- `tests/unit/phase4-identity-rbac.test.ts`
- `tests/integration/rls.phase4.test.ts` + SQL (`tests/integration/sql/phase4_rls_identity.sql`)

---

## Explicit non-goals (Phase 5+)

Membership engine, Circle allocation, BDP commercial activation, commission/settlement, Lead Assist.

---

## Gaps / non-blocking legacy

- Historical `user_roles` rows remain; they never grant entitlement via `resolveActiveEntitlements`.
- Ambiguous legacy `enterprise` / `bdm` still require manual mapping evidence before any assignment grant.
- Legacy admin UI pages that *read* `user_roles` still exist; new grants of quarantined roles are DB-blocked.
- Full historical bulk migration job of legacy → assignments is operational follow-up (not auto-map).

---

## Security notes

- Emergency path: service-role admin API + reason ≥ 12 chars + audit on activate/use/revoke; no authenticated INSERT policy.
- SoD enforced in app + DB when JWT present; service role still requires app SoD.
- Workspace keys are never entitlement; assignment status gates access.
