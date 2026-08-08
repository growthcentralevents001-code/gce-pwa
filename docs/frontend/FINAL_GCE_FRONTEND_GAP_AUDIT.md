# Final GCE Frontend Gap Audit

| Field | Value |
|-------|-------|
| **Status** | Audit / planning complete — **redevelopment not started** |
| **Date** | 2026-08-08 |
| **Baseline HEAD** | `3c399bee3aeddf646640dca8609f7909437122d7` (Phase 14A) |
| **Branch** | `development` |
| **Design authority** | [`design-system/MASTER.md`](../../design-system/MASTER.md) |
| **Backend authority** | Phase 14A report + `lib/architecture/*` + canonical `/api/*` |
| **Commit/push this pass** | **None** (docs written to workspace only) |

---

## Verdict inputs

| Metric | Count |
|--------|------:|
| Existing App Router `page.tsx` | **100** |
| Dirty `page.tsx` / `layout.tsx` (git `M`) | **~82** |
| Clean ops pages | **15** (`app/ops/**`) |
| Canonical workspace keys | **12** |
| API routes | **35** (~21 architecture / ~13 legacy / 1 health compat) |
| Planned final product pages (full routes) | **118** — see inventory |
| Planned dashboards/workspaces | **12** keys + `/ops` shell |
| Legacy routes to retire | **~40** (admin + inactive partner shells) |

---

## Maturity summary

| Layer | Maturity |
|-------|----------|
| Canonical backend (Phases 2–13) | Validated (Phase 14A) |
| Canonical workspace shell `/dashboard/[workspaceKey]` | Minimal / usable |
| Canonical CX `/customer/*` | Verification-only |
| Canonical ops `/ops/*` | Verification-only, **git-clean** |
| Public marketing / discovery | Dirty WIP — redesign required |
| Legacy `/admin/*` | Dirty + obsolete role UX — retire after Batch 8 |
| Inactive product UI (ZBP/Affiliate/BDM) | Present + dirty — must not entitle |

**Frontend must not be treated as Founder law.** Where UI shows BDM/ZBP/Affiliate/Gold–Silver tiers/₹500 Lead Assist, UI is wrong.

---

## Dirty / untracked WIP to preserve (do not destroy)

Captured from `git status --short` (~131 dirty/untracked paths). Critical frontend isolates:

- `app/components/HeroBanner.tsx`, `Header.tsx`, `HeaderWrapper.tsx`, `Footer.tsx`, search/location components
- `app/page.tsx`, `app/globals.css`, `app/layout.tsx`
- `app/events/**`, `app/venues/**`, `app/offers/**`, booking/checkout
- Entire dirty `app/admin/**` + `app/admin/layout.tsx`
- Dirty legacy dashboards: `dashboard/zbp|bdm|affiliate|franchisee|enterprise|member|venue/**`
- Untracked: `components/ui/**`, `components/EventFiltersPanel.tsx`, `components.json`, `lib/venuePartner.ts`, `lib/eventCategories.ts`, city migration `20260703110000_*`, `.cursor/skills/**`
- `public/sw.js` (dirty Workbox artifact — do not overwrite blindly)

---

## Existing route classification (100 pages)

### Legend

| Code | Meaning |
|------|---------|
| U | Usable / verification-capable |
| L | Legacy |
| M | Mock/static |
| D | Dirty WIP |
| V | Verification-only (canonical path, thin UI) |
| X | Unsafe / deprecated for entitlement |

### Public / marketing (10)

| Route | Status | Canonical? | Action |
|-------|--------|------------|--------|
| `/` | D | Yes (rebuild) | Rebuild Batch 1 |
| `/about` `/contact` `/terms` `/privacy` | D | Yes | Rebuild Batch 1 |
| `/for-partners` | D + legacy copy | Yes (rewrite) | Rebuild; remove Basic/20% invent |
| `/the-circle` `/memberships` | D/M | Marketing yes | Rebuild under Founder membership |
| `/offline` | U clean | Yes | Keep/adapt Batch 10 |
| `/unauthorized` | D | Yes | Polish Batch 0/1 |

### Auth (5)

| Route | Status | Action |
|-------|--------|--------|
| `/login` `/signup` `/forgot-password` `/auth/callback` | D/U | Rebuild Batch 1 |
| `/apply/role` | D + ZBP path | Rebuild; remove ZBP/Affiliate CTAs |

### Customer / commerce (11)

| Route | Status | Action |
|-------|--------|--------|
| `/customer` `/customer/events` `/customer/events/[id]` `/customer/offers` `/customer/offers/[id]` `/customer/tickets` | D/V | Canonical CX — rebuild Batch 2 |
| `/booking/[eventId]` `/bookings` `/checkout` `/wishlist` | D/L | Redirect/merge into `/customer/*` |
| `/profile` | D | Fold into settings Batch 9 |

### Catalog duplicates (5)

| Route | Status | Action |
|-------|--------|--------|
| `/events` `/events/[id]` `/offers` `/venues` `/venues/[id]` | D | SEO marketing shells **or** redirect to `/customer/*` / venue profiles — Batch 1–2 |

### Venue partner entry (3)

| Route | Status | Action |
|-------|--------|--------|
| `/venue/apply` `/venue/plans` | D | Rebuild Batch 5 |
| `/partner-dashboard` | D/M/L | Retire → `workspace:venue` |

### Enterprise entry (1)

| Route | Status | Action |
|-------|--------|--------|
| `/enterprise/signup` | D | Rebuild Batch 6 |

### Settings (3)

| Route | Status | Action |
|-------|--------|--------|
| `/settings` `/settings/notifications` `/settings/privacy` | D | Rebuild Batch 9; prefer canonical prefs APIs |

### Dashboard (15)

| Route | Status | Action |
|-------|--------|--------|
| `/dashboard/[workspaceKey]` | D but canonical | Rebuild shell Batch 0 |
| `/dashboard` index | Clean but stale links | Rebuild Batch 0 |
| `/dashboard/user` `/member` `/venue/**` | D/compat | Redirect to workspace keys |
| `/dashboard/zbp|bdm|affiliate|franchisee|enterprise` | D/X | `/unauthorized` or retire |

### Ops (15) — clean

All `/ops` routes: **V** — extend in Batch 8 (do not replace with `/admin`).

### Admin (25) — dirty / retire

All `/admin/*`: **D + L + X** for new RBAC — migrate capabilities to `/ops` + workspace, then retire.

### Legacy top-level (7)

`/zbp` `/zbp/apply` `/affiliate` `/affiliate/signup` `/bdm-dashboard` `/admin-events` `/admin-partners`: **X** — retire / unauthorized.

---

## Missing required product surfaces (not present as dedicated routes)

Relative to Founder-complete IA (inventory):

- Full Connect member lifecycle UI (Tags, waitlist, transfer, governance)
- Connect BDP portfolio / targets / recovery views
- Marketplace BDP unit/venue portfolio
- Venue check-in + redemption consoles on canonical APIs
- Enterprise Client/BDP/Expert multi-step workspaces
- Finance multi-queue dashboards (beyond `/ops/finance` stub)
- Opportunity Desk dedicated queue UI
- Account security / organisation settings
- Public SEO Event structured data pages (policy-gated)

---

## Frontend business-logic leaks (must move to backend)

| Current frontend risk | Canonical owner |
|----------------------|-----------------|
| Mock Gold/Silver/Bronze stats in admin dashboard | Phase 5 membership services |
| Affiliate approve/reject via `user_roles` | Quarantine + FD-039 inactive — no product path |
| ZBP referral fee tiers Basic/Gold/Platinum | Inactive FD-039 |
| BDM lead verification mock data | Lead Assist Desk Phase 10 |
| Partner plan “Commission: 20%” invent | FD-025/029 server entitlements |
| Venue tier Basic labels | Marketplace venue status from Phase 7 |
| Client-side role nav maps (Header affiliate/zbp/bdm) | `workspacesForAssignments` |

Pattern: **request action → show server state**. No commission/split/capacity math in UI.

---

## Design system conflicts (audit only — do not fix now)

| Conflict | Location signal |
|----------|-----------------|
| Ad-hoc `#f97316` inline styles | Affiliate, franchisee, apply flows |
| Orange gradient shells not using token CSS vars | `bdm-dashboard` |
| Possibly non-MASTER fonts in globals WIP | `app/globals.css` dirty |
| Minimal shadcn install vs custom `.card`/`.btn-primary` | Mixed |
| Dark mode tokens in MASTER vs incomplete app wiring | Theme provider untracked |

Canonical tokens remain MASTER.md (`#EA580C` / `#F97316` / `#2563EB`, Righteous + Poppins).

---

## 21st.dev research used this pass (search-only)

| Query intent | Reference IDs (metadata only) | Redevelopment use |
|--------------|-------------------------------|-------------------|
| Event/booking cards | Event Countdown Card `2582`, Visualize Booking `2687` | Batch 2 patterns — adapt to MASTER, no paid `get_component` without approval |
| Ops KPI / tables | KPI Card `6537`, Advanced Stats `19070`, Efferd Dashboard `13985` | Batch 0/7/8 inspiration |
| Mobile nav | Bottom Nav Bar `8343`, Drawer `11444` | Batch 0/2 mobile shell |

Per `.cursor/rules/08_21st_Dev_MCP.mdc`: **search only**; no generate/install in this pass.

---

## Security / access concerns

1. Dirty `/admin/*` must not remain co-equal with `/ops` after Batch 8.
2. Header legacy role links can spoof UX into unauthorized dashboards — fix in Batch 0/1.
3. Legacy affiliate APIs still reachable — feature-flag / retire with Batch 1.
4. No client-side permission as sole gate — keep server AuthZ on all APIs.

---

## Related planning docs

See all siblings under `docs/frontend/` and Phase 14A contract map.

**Frontend audit/planning complete. Frontend redevelopment not started. Phase 14B not started.**
