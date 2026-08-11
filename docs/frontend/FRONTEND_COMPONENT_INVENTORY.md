# Frontend Component Inventory

| Field | Value |
|-------|-------|
| **Status** | **Batch 10 Checkpoint E** — canonical families documented |
| **Date** | 2026-08-11 |
| **shadcn config** | [`components.json`](../../components.json) — style `new-york`, RSC, CSS variables, Lucide |
| **Authority** | `design-system/MASTER.md` + `lib/frontend/design-language.ts` |

---

## Classification legend

**canonical** · **shared** · **batch-specific** · **legacy** · **retired** · **dirty-WIP**

---

## Canonical families (Batch 10)

| Family | Primary | Class |
|--------|---------|-------|
| Card / Interactive | `GCE_SURFACE.*` | canonical |
| KPI | `components/connect/KpiCard.tsx` | shared |
| Page / shells | `PartnerShell` `CustomerShell` `OpsShell` `SettingsShell` | canonical |
| StatusBadge | `components/states/StatusBadge.tsx` | shared |
| Button / Form | `components/ui/*` | shared (shadcn) |
| Empty / Error / Loading / FeatureGated / AccessDenied | `components/states/*` | canonical |
| WorkspaceSwitcher | `components/workspace/WorkspaceSwitcher.tsx` | canonical (singular) |
| Partner tables / commercial | `components/partner/*` | shared Checkpoint C |
| Ops queue / search | `components/ops/*` | shared Checkpoint D |
| Glass | `GCE_SURFACE.glassLight|glassElevated` | canonical |
| Motion | `lib/frontend/motion.ts` | canonical |

---

## Shell / layout

| Component | Location | Class | Notes |
|-----------|----------|-------|-------|
| Root layout | `app/layout.tsx` | canonical | Metadata + viewport theme Batch 10 |
| Public header/footer | app chrome | shared | Batches 0–1 |
| Admin sidebar | `components/admin/*` | **retired** | Routes → `/ops`; source dirty-WIP |
| WorkspaceSwitcher | `components/workspace/WorkspaceSwitcher.tsx` | canonical | Single success-path switcher |
| Theme provider | `components/theme-*` | shared | Layer A system theme only — no Settings accent picker |

---

## Discovery / commerce

| Component | Class | Notes |
|-----------|-------|-------|
| EventCard / OfferCard | canonical | Batch 2 |
| Ticket / QR | shared | Batch 2 — QR redisplay BG-11 |
| Filters / sheets | shared | Batch 2 |

---

## Legacy / retired

| Component | Class | Notes |
|-----------|-------|-------|
| `/admin/*` pages | retired | Redirected Batch 10 |
| `/venue/plans` invent tiers | retired | Redirected Batch 10 |
| Legacy BDM/ZBP/Affiliate dashboards | retired | Unauthorized / for-partners |

Do not delete dirty-WIP sources without Founder approval — redirects already remove them from active product.
