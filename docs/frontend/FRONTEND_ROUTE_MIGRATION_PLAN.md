# Frontend Route Migration Plan

| Field | Value |
|-------|-------|
| **Status** | Planning — no deletions this pass |
| **Date** | 2026-08-08 |

## Strategy

1. Ship canonical routes first.  
2. Add redirects/adapters.  
3. Retire legacy only after Batch 8–10 cutover.  
4. Never grant entitlement via legacy path.

## Classification

| Route | Action | Target | Notes |
|-------|--------|--------|-------|
| `/dashboard/[workspaceKey]` | **keep** | — | Canonical shell |
| `/ops/*` | **keep** | — | Canonical ops |
| `/customer/*` | **keep** | — | Canonical CX |
| `/dashboard` | **rebuild** | workspace picker | Remove stale franchisee/admin links |
| `/dashboard/member` | **redirect** | `connect-member` | Already in LEGACY_DASHBOARD_REDIRECTS |
| `/dashboard/venue` | **redirect** | `venue` | Compat |
| `/dashboard/user` | **redirect** | `personal` | Alias |
| `/dashboard/zbp` | **deprecate→unauthorized** | `/unauthorized` | FD-039 inactive |
| `/dashboard/affiliate` | **deprecate→unauthorized** | `/unauthorized` | Inactive |
| `/dashboard/franchisee` | **deprecate→unauthorized** | `/unauthorized` | Not RBAC |
| `/dashboard/bdm` | **deprecate→unauthorized** | `/unauthorized` | No auto-map |
| `/dashboard/enterprise` | **deprecate→unauthorized** | assignment-scoped | Ambiguous |
| `/booking/*` `/bookings` `/checkout` | **redirect** | `/customer/...` | Single booking truth |
| `/events` `/offers` | **adapter** | SEO shell → same APIs as CX | Batch 1–2 |
| `/wishlist` | **redirect** | `/customer/wishlist` | |
| `/profile` | **redirect** | `/settings/profile` | |
| `/partner-dashboard` | **retire** | `venue` workspace | |
| `/venue/plans` | **retire/rebuild** | marketplace venue apply | Remove invent fees |
| `/admin/*` (all) | **deprecate** | `/ops` + workspaces | After Batch 8 parity |
| `/admin-events` `/admin-partners` | **retire** | `/ops` | |
| `/zbp` `/zbp/apply` `/affiliate` `/affiliate/signup` `/bdm-dashboard` | **retire** | `/unauthorized` or For Partners | No entitlement |
| `/apply/role` | **rebuild** | Remove ZBP/Affiliate cards | Keep Venue/Connect/MBDP/Enterprise |
| Legacy wishlist/affiliate APIs | **deprecate** | Canonical APIs | Feature-flag / 410 later |

## Counts

| Action | Count |
|--------|------:|
| Keep (canonical families) | ~35 existing → growing |
| Redirect/adapters | **28** |
| Retire/deprecate legacy pages | **40** |

## Redirect implementation note (future)

Use Next.js redirects in `next.config` / middleware **after** AuthZ rules confirmed — planning only now.
