# Final GCE Redevelopment Batch Plan

| Field | Value |
|-------|-------|
| **Status** | **Batch 0 complete (Checkpoint A approved)** · **Batch 1 complete** · **Batch 2 complete (Checkpoint B accepted)** · **Batch 3 complete** · **Batch 4 complete — Partner Dashboard Checkpoint C ready for review** · Batches 5–10 not started |
| **Date** | 2026-08-09 |
| **Numbering** | Exactly Batch **0** through Batch **10** (11 batches) |

### Batch 0 implementation status

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Checkpoint A approved** |
| **Evidence** | `docs/frontend/implementation/BATCH_0_DESIGN_SYSTEM_AND_SHELL_IMPLEMENTATION.md` |

### Batch 1 implementation status

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Public/Auth product review ready** |
| **Evidence** | `docs/frontend/implementation/BATCH_1_PUBLIC_AUTH_ONBOARDING_IMPLEMENTATION.md` |

### Batch 2 implementation status

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Customer Mobile Checkpoint B ready for review** |
| **Evidence** | `docs/frontend/implementation/BATCH_2_CUSTOMER_EVENTS_OFFERS_BOOKING_TICKETS_IMPLEMENTATION.md` |

### Batch 3 implementation status

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Connect Member experience ready for review** |
| **Evidence** | `docs/frontend/implementation/BATCH_3_MEMBER_CONNECT_CIRCLE_LEAD_ASSIST_IMPLEMENTATION.md` |
| **Visual** | No-blue supersession + `GLOBAL_FRONTEND_VISUAL_CONSISTENCY_REGISTER.md` |

### Batch 4 implementation status

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Partner Dashboard Checkpoint C ready for review** |
| **Evidence** | `docs/frontend/implementation/BATCH_4_CONNECT_BDP_IMPLEMENTATION.md` |
| **Checkpoint C** | Canonical Partner Dashboard Pattern established |
| **Batch 5** | Not started |

---

## Design checkpoints (hard gates)

| Checkpoint | After | Review focus |
|------------|-------|--------------|
| **A** | Batch 0 | Tokens, shells, nav, workspace switcher vs MASTER.md |
| **B** | Early Batch 2 | Customer mobile UX / bottom nav / Event&Offer cards |
| **C** | Before mass Batch 4–6 | Partner dashboard sidebar pattern |
| **D** | Before mass Batch 8 | Ops table/queue pattern |
| **E** | Batch 10 | Responsive + a11y + PWA consistency |

Do not mass-build past a checkpoint if Founder/Product rejects the pattern.

---

## MANDATORY TOOLING STRATEGY (all batches)

### Batch 0 — Design system + shells + navigation + workspace switcher

| Dimension | Specification |
|-----------|---------------|
| **Skills (invoke)** | `design-system` (MASTER tokens), `ui-ux-pro-max` (shell/IA/responsive), `ui-styling` (spacing/states), `brand` (identity) |
| **21st.dev** | Search: app shell, sidebar, KPI card, empty states — **search-only**; adapt to MASTER |
| **shadcn** | Add Card, Input, Form, Dialog, Sheet, Dropdown, Sidebar/Nav, Badge, Skeleton, Toast, Alert, Breadcrumb (**after** implementation approval) |
| **Backend tools** | Read `/api/identity/*` contracts; no schema change |
| **Browser** | Playwright MCP / browser for shell screenshots at end of batch |
| **Tests** | Vitest for nav helpers; no E2E install yet |
| **Complexity** | High | **Commit boundary** | `feat(ui): batch0 shells and tokens` |

### Batch 1 — Public website + Auth + Onboarding

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `brand`, `banner-design` (Home hero), `ui-ux-pro-max`, `ui-styling`, `design` (marketing layouts) |
| **21st.dev** | Search hero, steppers, auth forms |
| **shadcn** | Form, Button, Accordion, Tabs for partner page |
| **Backend** | Auth + identity; remove affiliate track from signup |
| **Browser** | Smoke public+login |
| **Tests** | Unit form validation; lint paths |
| **Complexity** | High | **Commit** | `feat(ui): batch1 public and auth` |

### Batch 2 — Customer Events / Offers / Booking / Tickets

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max` (mobile flows), `ui-styling`, `design-system` |
| **21st.dev** | Event cards, filters, booking visualize, bottom nav (already researched 2582/2687/8343) |
| **shadcn** | Card, Calendar, Drawer filters, Dialog cancel/refund, Skeleton |
| **Backend** | `/api/customer` only; payments gated |
| **Checkpoint** | **B** mid-batch |
| **Browser** | Mobile viewport booking smoke |
| **Tests** | Integration against CX API mocks/helpers |
| **Complexity** | High | **Commit** | `feat(ui): batch2 customer cx` |

### Batch 3 — Member / Connect / Circle / Lead Assist

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max`, `ui-styling`, `design-system`; `design` for lead flows |
| **21st.dev** | Steppers, queue lists, capacity meters |
| **shadcn** | Progress, Tabs, Badge, Dialog |
| **Backend** | `/api/connect/*`, `/api/lead-assist`; paid flags OFF |
| **Tests** | Permission denied states |
| **Complexity** | High | **Commit** | `feat(ui): batch3 connect member` |

### Batch 4 — Connect BDP

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max` (partner dashboards), `ui-styling`, `design-system`, `brand` |
| **21st.dev** | KPI cards, tables (6537/19070) |
| **Checkpoint** | **C** before expanding venue/MBDP |
| **Backend** | `/api/connect/bdp`; pack payments OFF |
| **Complexity** | Medium-High | **Commit** | `feat(ui): batch4 connect bdp` |

### Batch 5 — Marketplace BDP + Venue Partner

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max`, `ui-styling`, `design-system` |
| **21st.dev** | Data tables, check-in patterns |
| **shadcn** | Table, Pagination, Calendar, Sheet |
| **Backend** | `/api/marketplace/bdp` + CX venue actions; note BG-03 |
| **Complexity** | High | **Commit** | `feat(ui): batch5 marketplace venue` |

### Batch 6 — Enterprise Client + BDP + Expert

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max`, `ui-styling`, `design-system`, `brand` |
| **21st.dev** | Multi-step proposal/quote UX |
| **Backend** | `/api/enterprise`; show co-sign status; no bypass |
| **Complexity** | High | **Commit** | `feat(ui): batch6 enterprise` |

### Batch 7 — Finance

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max` (dense data), `ui-styling`, `design-system` |
| **21st.dev** | Finance dashboard grids (13985) — simplify; no invent KPIs |
| **shadcn** | Table, Badge, Alert, Tabs |
| **Backend** | `/api/finance` read-only mutations of review type; flags OFF |
| **Charts** | Recharts |
| **Complexity** | Medium-High | **Commit** | `feat(ui): batch7 finance` |

### Batch 8 — Ops + Compliance + Support + Opportunity Desk

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max`, `ui-styling`, `design-system` |
| **21st.dev** | Approval queues, timelines, empty states |
| **Checkpoint** | **D** after ops pattern |
| **Backend** | `/api/ops`, `/api/ops/admin`, lead-assist desk |
| **Preserve** | Existing clean `/ops` pages — enhance, don’t replace with `/admin` |
| **Complexity** | High | **Commit** | `feat(ui): batch8 ops support desk` |

### Batch 9 — Settings + Notifications + Privacy

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-styling`, `design-system`, `ui-ux-pro-max` (forms), `brand` (minimal) |
| **21st.dev** | Settings forms optional |
| **shadcn** | Switch, Checkbox, Form, Tabs |
| **Backend** | identity + notification prefs + privacy requests (BG-07) |
| **Complexity** | Medium | **Commit** | `feat(ui): batch9 settings` |

### Batch 10 — PWA + responsive + a11y + polish

| Dimension | Specification |
|-----------|---------------|
| **Skills** | `ui-ux-pro-max` (responsive), `ui-styling`, `design-system`, `brand` |
| **PWA** | Manifest/icons; carefully replace/regenerate SW — **do not blind-overwrite dirty sw.js**; coordinate |
| **Tools to install** | Playwright + Testing Library + axe (**authorise install here or start of Batch 10**) |
| **Browser/a11y** | Playwright MCP + axe checks |
| **Checkpoint** | **E** |
| **Complexity** | Medium | **Commit** | `feat(ui): batch10 pwa a11y polish` |

---

## Skill usage matrix (every installed frontend skill)

| Skill | Used in batches | Explicit tasks |
|-------|-----------------|----------------|
| ui-ux-pro-max | 0–10 | IA, mobile, dashboards, forms, empty/error, responsive |
| ui-styling | 0–10 | Spacing, hierarchy, states, responsive CSS |
| design-system | 0–10 | MASTER tokens, consistency |
| brand | 0,1,4,6,10 | Identity, marketing, partner public |
| design | 1,3,6 | Broader layout/logo-adjacent marketing assets if needed |
| banner-design | 1 | Home hero / campaign banners |
| slides | **Not used** in product UI batches | Internal decks only if Founder asks separately |

---

## Testing strategy per batch

| Layer | When |
|-------|------|
| Vitest unit | Every batch (components/helpers) |
| API contract smoke | Every batch touching APIs |
| Browser smoke (Playwright MCP) | End of each batch once Playwright available |
| Full E2E / UAT / a11y cert | **Phase 14B** after Batch 10 |

---

## Inactive features (all batches)

No UX for Affiliate, ZBP, Core direct purchase, paid Lead Assist, wallet cashout, vendor self-serve, Super Admin product role, premium ads, multi-currency.
