# Batch 4 — Connect BDP Implementation

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Partner Dashboard Checkpoint C ready for review** (non-blocking gaps remain) |
| **Date** | 2026-08-09 |
| **Branch** | `development` |
| **Batch 5** | Not started |
| **Checkpoint** | **C — Canonical Partner Dashboard Pattern** |

---

## Commercial authority check

Prompt values matched repo Founder/constants (`lib/architecture/connect-bdp/constants.ts`, FD-025/029, `36_Commercial_Constants.md`):

| Item | Value |
|------|-------|
| Commission | 20% (2000 bps) |
| Target | 5 Circles / 10 months |
| Unit Circle cap | 5 |
| City caps | Tier-1 10 · Tier-2 5 · Tier-3 2 |
| Direct package | ₹50,000 |
| Finance package | ₹60,000 (₹5,000 + ₹55,000) |
| Recovery cycle cap | ₹5,000 |

No silent prompt override required.

---

## CANONICAL PARTNER DASHBOARD PATTERN (Checkpoint C)

Baseline for Marketplace BDP / Venue / Enterprise BDP (Batches 5–6):

1. **Shell:** `PartnerShell` + workspace nav (`connect-bdp`)
2. **Header:** `PartnerPageHeader` (alias of ConnectPageHeader)
3. **Status strip:** `PartnerStatusStrip` (glass Light recipe sparingly)
4. **KPI row:** shared `KpiCard` (Batch 3 family)
5. **Primary:** pipeline / portfolio (`PartnerPipelineList`, `CircleCard`, `PartnerDataTable`)
6. **Secondary:** `PartnerActionCenter`
7. **Commercial:** `PartnerCommercialSummary` (labels from backend/caller)
8. **Activity:** shared `Timeline`
9. **Targets:** `TargetProgressCard`
10. **Mobile:** stacked cards; tables → card list under `md`
11. **Motion / glass / radius / orange palette:** `design-language.ts` + MASTER
12. **Empty / FeatureGated:** shared states

Do **not** invent new visual systems per partner vertical.

---

## Routes

| ID | Route | Status |
|----|-------|--------|
| CBDP-01 | `/dashboard/connect-bdp` | Created |
| CBDP-02 | `/connect-bdp/apply` | Created |
| CBDP-03 | `/connect-bdp/unit` | Created |
| CBDP-04 | `/connect-bdp/city` | Created |
| CBDP-05 | `/connect-bdp/members` | Created |
| CBDP-06 | `/connect-bdp/circles` | Created |
| CBDP-07 | `/connect-bdp/targets` | Created |
| CBDP-08 | `/connect-bdp/entitlements` | Created |
| CBDP-09 | `/connect-bdp/disputes` | Created |
| CBDP-10 | `/connect-bdp/handover` | Created |
| CBDP-M1 | Attribution propose form | Inline on members |
| CBDP-M2 | Offline pack evidence | FeatureGated OFF |

---

## APIs

- `GET/POST /api/connect/bdp` — units, dashboard report, apply, propose attribution, open dispute
- Privileged reads for city/circle/attribution/dispute/handover/entitlement/recovery tables

Finance execution (settlement/payout/ledger) not exposed.

---

## 21st.dev (search-only)

| Search | Useful IDs | Adopted | Rejected |
|--------|------------|---------|----------|
| Partner/sales KPI dashboard | 13985, 6535, 19070 | KPI/grid composition | Dense rainbow charts |
| Progress / meter | 19138, 8698, 19006, 8035 | Progress card structure | Multi-color skill meters |
| Pipeline / status list | 2514, 23569 | Expandable stage list | Drag kanban / AI agent viz |
| Tables | 23604, 22187 | Responsive table/list hybrid | Neon tag systems |
| Commercial summary | 7498 | Summary row layout | Unrelated workout themes |

---

## Skills

ui-ux-pro-max, ui-styling, design-system, brand, design, 21st search-only.

---

## Component consistency register

| Component | Family | Radius | Surface | Border | Shadow | Motion | Color | 21st | shadcn |
|-----------|--------|--------|---------|--------|--------|--------|-------|------|--------|
| KpiCard | KPI | 2xl | cardInteractive | warm | orange hover | hoverY | orange | 6535 | — |
| PartnerStatusStrip | Status | 2xl | glassLight | warm | sm | none | orange/neutral | 2514 | Badge |
| PartnerActionCenter | Action | 2xl | card | warm | sm | none | orange + semantic | task queue | — |
| PartnerCommercialSummary | Commercial | 2xl | card | warm | sm | none | orange numbers | 7498 | — |
| TargetProgressCard | Progress | 2xl | card | warm | sm | entrance | primary bar | 8698/19006 | Progress |
| PartnerPipelineList | Pipeline | 2xl | card | warm | sm | expand | orange | 2514 | Badge |
| PartnerDataTable | Table/List | 2xl | card | warm | sm | none | neutral | 23604 | table |
| DisputeCard | Case | 2xl | card | warm | sm | none | warning semantic | case card | Badge |
| CircleCard | Portfolio | 2xl | cardInteractive | warm | orange hover | hoverY | dual status | Batch 3 | — |
| HandoverSummary | Case | 2xl | card | warm | sm | none | pending | timeline | Badge |

---

## Component replacement register

| Old | Action | New | Why | Preserved |
|-----|--------|-----|-----|-----------|
| Generic `[workspaceKey]` Connect BDP stub | Supersede for CBDP-01 | `/dashboard/connect-bdp` | Checkpoint C pattern | `buildConnectBdpDashboard` |
| Empty `connect-bdp` nav | Expand | Full CBDP nav | Inventory routes | Workspace key |
| Legacy BDM/ZBP dashboards | Remain quarantined | — | Not Batch 4 owned | Quarantine list |

---

## Backend gaps

| ID | Gap | Class |
|----|-----|-------|
| BG-16 | Member sourcing stage machine beyond attribution statuses | UX read-model |
| BG-17 | Paginated BDP portfolios (members/circles/entitlements) | Pagination (BG-02 related) |
| BG-18 | BDP-facing reassignment request (vs Platform handover) | Action API / P2 |

---

## Security / privacy / finance

- Auth required for `/connect-bdp/*`
- No self-approval of unit/attribution/handover
- Contact/KYC documents not exposed
- Settlement/payout FeatureGated
- Paid Lead Assist untouched

---

## Testing / gates

- `tests/unit/batch4-connect-bdp-frontend.test.ts` (13)
- Full suite: 198 passed / 11 skipped
- typecheck / scoped lint / build → 0
- Playwright/HTTP smoke (`next start` :3060): `/` `/login` `/events` `/connect` 200; `/dashboard/connect-bdp` and `/connect-bdp/*` → login redirect
- Authenticated deep CX deferred (no Connect BDP test identity)

## Deferred

- Authenticated deep Playwright CX (test identity)
- Member pipeline stages beyond attribution records (BG-16)
- Batch 5 Marketplace BDP
