# Global Frontend Visual Consistency Register

| Field | Value |
|-------|-------|
| **Status** | Active (Batch 3) |
| **Date** | 2026-08-09 |
| **Authority** | Founder Batch 3 supersession — no blue; one GCE component language |

## Rules

1. Decorative **blue is prohibited** (`#2563EB`, `blue-*`, `sky-*` as brand accent).
2. Product UI uses orange + warm cream + neutrals.
3. Semantic success/warning/destructive remain allowed.
4. One radius/shadow/motion/glass language (`lib/frontend/design-language.ts` + `design-system/MASTER.md`).
5. Do not mass-rewrite Batch 1–2 pages in later batches — register P1/P2 here.

## Blue audit (2026-08-09)

| Class | Count (approx) | Action |
|-------|----------------|--------|
| A — decorative/brand in Batch 0–3 owned surfaces | Fixed in shared tokens + EventCard/detail sky→orange | Fixed Batch 3 |
| B — semantic | info remapped to orange in `globals.css` | OK |
| C — dirty admin/dashboard WIP (`app/admin/*`, `app/dashboard/venue`, affiliate, zbp, bdm, etc.) | 40+ | Deferred Batch 8–10 / owners |
| C — `_archive/*` | Many | Ignore (archive) |

### Fixed in Batch 3 (shared / owned)

- `design-system/MASTER.md` — no-blue supersession documented
- `app/globals.css` — already orange charts/info/ring (verified)
- `components/customer/EventCard.tsx` — removed sky gradient
- `app/customer/events/[id]/page.tsx` — removed sky/blue radial
- `proxy.ts` — `/connect` exact public only (auth for `/connect/*`)

### Deferred (dirty / unowned)

- `app/admin/**` blue badges/KPI cards
- `app/dashboard/venue|affiliate|zbp|bdm|enterprise/**`
- Archive trees

## Consistency checklist

| Item | Status |
|------|--------|
| Radius card `rounded-2xl` | Enforced in Connect + Customer cards |
| Shadow orange-tinted hover | Enforced |
| Button `min-h-11` | Enforced on Connect CTAs |
| Glass recipes | 2 canonical (Light / Elevated) |
| KPI card family | `components/connect/KpiCard.tsx` |
| Timeline family | `components/connect/Timeline.tsx` |
| No rainbow Power Sector colors | Icon + orange border only |

## Follow-ups

| ID | Item | Priority | Target |
|----|------|----------|--------|
| VC-01 | Admin blue cleanup | P1 | Batch 8/10 |
| VC-02 | Legacy dashboard blue | P1 | Batch 10 |
| VC-03 | MarketingHero side-by-side polish vs Connect | P2 | Batch 10 |
| VC-04 | Public Batch 1 page token sweep | P2 | Batch 10 |
