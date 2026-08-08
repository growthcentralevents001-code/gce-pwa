# Frontend Component Inventory

| Field | Value |
|-------|-------|
| **Status** | Audit only — no component installs this pass |
| **Date** | 2026-08-08 |
| **shadcn config** | [`components.json`](../../components.json) — style `new-york`, RSC, CSS variables, Lucide |
| **Installed ui/** | `button.tsx`, `interactive-hover-button.tsx` only (dirty/untracked WIP) |

---

## Classification legend

KEEP · REFACTOR · REPLACE · LEGACY · DIRTY-WIP · MISSING

---

## Shell / layout

| Component | Location | Class | Notes |
|-----------|----------|-------|-------|
| Root layout | `app/layout.tsx` | DIRTY-WIP | Rebuild Batch 0 |
| Header / HeaderWrapper | `app/components/*` | DIRTY-WIP | Replace; remove affiliate/zbp/bdm maps |
| Footer | `app/components/Footer.tsx` | DIRTY-WIP | Rebuild public |
| HeroBanner | `app/components/HeroBanner.tsx` | DIRTY-WIP | Rebuild Batch 1 with `banner-design` + brand |
| Admin sidebar | `components/admin/gce-sidebar.tsx` | LEGACY | Retire with `/admin` |
| Workspace switcher | `app/dashboard/[workspaceKey]/workspace-switcher.tsx` | REFACTOR | Canonical — Batch 0 |
| Ops vertical page helper | `app/ops/_components/vertical-ops-page.tsx` | KEEP | Extend Batch 8 |
| Theme provider/toggle | `components/theme-*` | DIRTY-WIP (untracked) | Align MASTER dark Layer A |

---

## Discovery / commerce

| Component | Class | Action |
|-----------|-------|--------|
| EventSearch / HeaderEventSearch / SimpleSearch / SearchBar | DIRTY-WIP / duplicate | Consolidate Batch 2 |
| EventFiltersPanel | DIRTY-WIP untracked | Rebuild filters with shadcn |
| FilterModal | DIRTY-WIP | Replace Drawer/Sheet |
| TrendingEvents / Reviews | DIRTY-WIP | Rebuild or drop from hero budget |
| GeoLocation* / CitySelector / LocationBar | DIRTY-WIP | Refactor; city SoT later |
| WishlistButton | DIRTY-WIP | Keep pattern; API migrate |
| BecomeVenueButton | LEGACY empty | Delete later |

---

## shadcn/ui matrix (primary primitive layer)

| Primitive | Installed? | Class | Needs | Primary consumers |
|-----------|------------|-------|-------|-------------------|
| Button | Yes (minimal) | REFACTOR | Align tokens | All |
| Interactive hover button | Yes | REPLACE? | Prefer standard Button | Marketing only |
| Card | No | MISSING | Create Batch 0 | Discovery, dashboards |
| Input / Textarea / Label | No | MISSING | Batch 0 | Forms |
| Select / Combobox / Command | No | MISSING | Batch 0–2 | Filters, city |
| Dialog / AlertDialog | No | MISSING | Batch 0 | Confirmations |
| Sheet / Drawer | No | MISSING | Batch 0/2 | Mobile nav, filters |
| Tabs | No | MISSING | Batch 0 | Partner shells |
| Accordion | No | MISSING | Batch 1 | FAQs |
| Dropdown Menu | No | MISSING | Batch 0 | Account menu |
| Popover / Tooltip | No | MISSING | Batch 0 | Ops help |
| Toast / Sonner | No | MISSING | Batch 0 | Mutations |
| Form (RHF+zod) | No | MISSING | Batch 0 | Auth, onboarding |
| Checkbox / Radio / Switch | No | MISSING | Batch 0/9 | Prefs |
| Badge | No | MISSING | Batch 0 | Status |
| Avatar | No | MISSING | Batch 0 | Profiles |
| Table / DataTable | No | MISSING | Batch 5–8 | Ops/partner |
| Pagination | No | MISSING | Batch 2+ | Lists |
| Calendar / DatePicker | No | MISSING | Batch 2/5 | Events |
| Skeleton | No | MISSING | Batch 0 | Loading |
| Progress | No | MISSING | Batch 4–6 | Targets |
| Alert | No | MISSING | Batch 0 | Errors |
| Breadcrumb | No | MISSING | Batch 0 | Desktop |
| Sidebar / Navigation Menu | No | MISSING | Batch 0 | Partner/ops |
| Carousel | No | MISSING (optional) | Batch 1 only if justified | Marketing |
| Separator / ScrollArea | No | MISSING | Batch 0 | Layout |

**Install timing:** Batch 0 — add needed primitives as **new files**; avoid stomping dirty `components/ui` until Checkpoint A. Prefer `npx shadcn@latest add` after explicit implementation approval.

---

## Product composite components (MISSING — create in batches)

| Composite | Batch | Skills | 21st search theme |
|-----------|-------|--------|-------------------|
| AppShell (public/customer/partner/ops) | 0 | ux, ds, sty | mobile shell, sidebar |
| EventCard / OfferCard / VenueCard | 2 | ux, sty | event cards |
| TicketCard + QR display | 2 | ux | ticket/QR |
| MembershipCard / TagChips | 3 | ux, ds | — |
| CircleCapacityMeter | 3 | ux | progress |
| LeadCard / DeskQueueRow | 3/8 | ux | queue lists |
| KpiCard / QueueCard | 0/7/8 | ux | KPI card (21st 6537) |
| ApprovalQueueTable | 8 | ux, sty | admin tables |
| CaseTimeline | 8 | ux | timelines |
| EmptyState / ErrorState / PermissionDenied / FeatureGated | 0 | ux, sty | empty states |
| Stepper (onboarding) | 1/3/4 | ux | steppers |
| NotificationCenter | 9 | ux | — |

---

## Charts

| Tool | Status |
|------|--------|
| Recharts (dep present) | KEEP for Finance/ops charts Batch 7–8 |
| Invented Circle Health formula | FORBIDDEN |

---

## Backup noise

~21 `*.backup*` under `components/` → LEGACY; ignore in redevelopment; delete only in a dedicated cleanup PR after Batch 10.
