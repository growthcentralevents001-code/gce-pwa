# Frontend Route Migration Plan

| Field | Value |
|-------|-------|
| **Status** | **Batch 10 cutover applied** for planned retires — Phase 14B may delete dead sources |
| **Date** | 2026-08-11 |

## Strategy

1. Ship canonical routes first.  
2. Add redirects/adapters.  
3. Retire legacy after Batch 8–10 cutover.  
4. Never grant entitlement via legacy path.

## Classification

| Route | Action | Target | Notes |
|-------|--------|--------|-------|
| `/dashboard/[workspaceKey]` | **keep** | — | Canonical shell |
| `/ops/*` | **keep** | — | Canonical ops |
| `/customer/*` | **keep** | — | Canonical CX |
| `/settings/*` | **keep** | — | Batch 9 |
| `/dashboard` | **rebuild** | workspace picker | Soft |
| `/dashboard/member` | **redirect** | `connect-member` | LEGACY_DASHBOARD_REDIRECTS |
| `/dashboard/venue` | **redirect** | `venue` | Compat |
| `/dashboard/user` | **redirect** | `personal` | Alias |
| `/dashboard/zbp` | **deprecate→unauthorized** | `/unauthorized` | FD-039 |
| `/dashboard/affiliate` | **deprecate→unauthorized** | `/unauthorized` | Inactive |
| `/dashboard/franchisee` | **deprecate→unauthorized** | `/unauthorized` | Not RBAC |
| `/dashboard/bdm` | **deprecate→unauthorized** | `/unauthorized` | No auto-map |
| `/dashboard/enterprise` | **deprecate→unauthorized** | assignment-scoped | Ambiguous |
| `/booking/*` `/bookings` `/checkout` | **redirect** | `/customer/...` | **Batch 10 next.config** |
| `/events` `/offers` | **adapter** | SEO shell | Batch 1–2 |
| `/wishlist` | **redirect** | `/customer/wishlist` | **Batch 10** |
| `/profile` | **redirect** | `/settings/profile` | **Batch 10** |
| `/partner-dashboard` | **retire** | `/dashboard/venue` | **Batch 10** |
| `/venue/plans` | **retire** | `/venue/apply` | **Batch 10** — invent fees removed |
| `/admin/*` | **deprecate** | `/ops` | **Batch 10** next.config + proxy |
| `/admin-events` `/admin-partners` | **retire** | `/ops` | **Batch 10** |
| `/zbp` `/affiliate` `/bdm-dashboard` | **retire** | `/for-partners` | **Batch 10** public redirects |
| `/apply/role` | **rebuild** | Approved intents | Batch 1 |

## Counts

| Action | Count |
|--------|------:|
| Keep (canonical families) | Growing |
| Redirect/adapters live | **Batch 10 cutover** |
| Source file deletion | Phase 14B / Founder OK (dirty WIP preserved) |

## Redirect implementation (Batch 10)

- `next.config.ts` `redirects()`
- `proxy.ts` authenticated `/admin` → `/ops`
- Existing `LEGACY_DASHBOARD_REDIRECTS` unchanged
