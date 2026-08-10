# Global Frontend Visual Consistency Register

| Field | Value |
|-------|-------|
| **Status** | Active (Batch 8 — Ops / Compliance / Support / Desk) |
| **Date** | 2026-08-10 |
| **Authority** | Founder no-blue + Checkpoint C partner pattern + Checkpoint D Ops queue |

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

## Batch 4 notes

- Established Checkpoint C partner primitives under `components/partner/`
- Reused Batch 3 `KpiCard` / `CircleCard` / `Timeline` — no new BDP-only visual system
- No decorative blue in Batch 4-owned Connect BDP surfaces
- Legacy BDM/ZBP dashboards remain quarantined (not Batch 4 rewrite)

## Batch 5 notes

- Marketplace BDP + Venue reuse Checkpoint C partner primitives
- Legacy `/dashboard/venue` client WIP replaced with canonical Marketplace-backed dashboard (allowlisted)
- No decorative blue in Batch 5-owned marketplace/venue surfaces
- Stale Venue RM / Affiliate / ₹30k / 24h claim language avoided in owned copy

## Batch 6 notes

- Enterprise Client / BDP / Expert reuse Checkpoint C — denser information, same visual family
- Rejected ui-ux-pro-max navy/blue “Trust & Authority” suggestion; MASTER.md orange/cream retained
- No Vendor self-service portal; no Expert commission widgets; no territory ownership UI
- Stale 30/40/30, 25%-of-project-value, and “₹5L and above” wording blocked in owned copy
- Deferred: legacy `/dashboard/enterprise`, admin enterprise-proposals blue (unowned)

## Batch 7 notes

- Finance reuses Checkpoint C with denser, restrained presentation — not a separate fintech theme
- Rejected ui-ux-pro-max dark OLED + blue finance palette; charts optional/deferred
- Settlement/payout/refund execution FeatureGated OFF; no Pay Now / Edit Ledger
- Partner commercial summaries and Finance entitlement views share DNA
- Deferred: admin finance blue (unowned)

## Batch 8 notes

- Ops queue/table/detail language under `components/ops/` — denser than CX, same GCE family
- `/ops` shell: orange active nav, warm neutrals — **no blue admin sidebar**
- Glass: optional hub strip only; queues/tables/cases/holds stay opaque
- Approval / exception / case / incident / moderation share OpsQueueCard + StatusBadge
- Legacy admin blue in `app/admin/**` remains deferred (unowned dirty WIP)
- `/ops/finance` is Finance entry only — Batch 7 owns presentation

## Follow-ups

| ID | Item | Priority | Target |
|----|------|----------|--------|
| VC-01 | Admin blue cleanup | P1 | Batch 10 |
| VC-02 | Legacy dashboard blue | P1 | Batch 10 |
| VC-03 | MarketingHero side-by-side polish vs Connect | P2 | Batch 10 |
| VC-04 | Public Batch 1 page token sweep | P2 | Batch 10 |
| VC-05 | Marketplace/Enterprise BDP must reuse Checkpoint C pattern | P0 | Batch 5–6 done |
| VC-06 | Legacy `/venue/plans` invent-pricing retirement polish | P2 | Batch 10 |
| VC-07 | Finance ↔ partner commercial summary visual parity | P1 | Batch 7 done / Batch 10 polish |
| VC-08 | Ops split-pane moderation polish | P2 | Batch 10 |
