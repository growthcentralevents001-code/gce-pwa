# Batch 0 — Design System + Application Shells + Navigation + Workspace Switcher

| Field | Value |
|-------|-------|
| **Status** | Implemented — **CHECKPOINT A ready for review** |
| **Date** | 2026-08-09 |
| **Branch** | `development` |
| **Batch 1** | **Not started** |

---

## Verdict

Batch 0 establishes the reusable frontend foundation for later batches. Business content pages (public marketing, booking, BDP dashboards, etc.) were intentionally not built.

---

## Authority used

1. `design-system/MASTER.md` — visual tokens (Primary `#EA580C`, Secondary `#F97316`, Accent `#2563EB`, Righteous + Poppins)
2. Frontend planning pack under `docs/frontend/`
3. Canonical workspace registry (`lib/architecture/workspace/registry.ts`, 12 keys)
4. FD-035 / FD-039 — workspace model + legacy quarantine (no ZBP/BDM/Affiliate/Super Admin nav)
5. Phase 13 `/ops/*` — chrome alignment only

---

## MASTER.md token implementation

| Token | Implementation |
|-------|----------------|
| Primary `#EA580C` | `--primary: 21 90% 48%` (existing dirty globals preserved + extended) |
| Secondary `#F97316` | Secondary surfaces / dark primary |
| Accent `#2563EB` | `--info` semantic (CTA/info); shadcn `--accent` kept as soft orange surface |
| Background `#FFF7ED` | `--background: 33 100% 97%` |
| Foreground `#0F172A` | `--foreground: 222 47% 11%` |
| Dark Layer A | Vars present; full theme productization deferred (FD-039) |
| Typography | `--font-display` Righteous, `--font-body` Poppins + utility classes |
| Layout | `--layout-*` CSS vars + `lib/frontend/layout-tokens.ts` |
| Status | `--success` / `--warning` / `--info` + `StatusBadge` |

**Dirty WIP handling:** Appended Batch 0 tokens to existing `app/globals.css` / `tailwind.config.js` without discarding prior token WIP. Did not mass-format unrelated CSS.

---

## Skills used

| Skill | Informed | Patterns / components | Adopted / rejected |
|-------|----------|----------------------|--------------------|
| **ui-ux-pro-max** | Shell IA, a11y (keyboard, headings, skip links), sidebar/mobile nav density | SkipToContent, SidebarNav, MobileBottomNav, PartnerShell collapse | Adopted a11y baseline; rejected dense glassmorphism |
| **design-system** | Three-layer tokens (primitive→semantic→component) | globals CSS vars, Tailwind semantic colors, typography helpers | Adopted; did not invent competing palette |
| **ui-styling** | shadcn + Tailwind consistency, hover/focus, empty/loading | Badge/Card/Sheet/Dropdown, EmptyState, skeletons | Adopted clean SaaS feel; rejected over-decoration |
| **brand** | GCE identity from MASTER | PublicShell brand mark, themeColor `#EA580C` | Adopted exact MASTER values; rejected second orange palette |
| **design** | Layout hierarchy for shells | ContentContainer, PageHeader | Light use; no marketing art |

---

## 21st.dev searches (search-only)

| Query | Notable IDs | Adopted | Rejected |
|-------|-------------|---------|----------|
| SaaS sidebar / workspace switcher | 19357, 14941, 4511, 8252, 1603 | Structure: collapsible sidebar + dropdown workspace switcher + user menu | Glassmorphic Workbench (19357), WhatsApp clone, paid `get_component` install |
| Mobile bottom nav / empty / skeleton / permission | 1626, 19026, 18844, 11444, 11878, 2307 | Bottom nav + sheet drawer + access-denied pattern ideas | Motion-heavy nav menu; paid installs |

---

## shadcn audit

| Item | Result |
|------|--------|
| `components.json` | Present (new-york, CSS vars, lucide) |
| Pre-existing | `button.tsx`, `interactive-hover-button.tsx` — **KEEP** (dirty button not overwritten) |
| Added | badge, card, separator, skeleton, alert, avatar, sheet, dropdown-menu, tooltip |
| Radix deps added | dialog, dropdown-menu, separator, avatar, tooltip, collapsible |
| Not installed | Full catalog, Sidebar package monolith, Command, Toast (defer) |

---

## Shells

| Shell | Path | Notes |
|-------|------|-------|
| Public | `components/app-shell/PublicShell.tsx` via `AppChrome` | Brand + nav + auth actions + mobile sheet + footer structure |
| Customer | `app/customer/layout.tsx` → `CustomerShell` | Mobile-first + bottom nav |
| Partner | `app/dashboard/layout.tsx` → `PartnerShell` | Desktop sidebar + mobile drawer + workspace switcher |
| Ops | `app/ops/layout.tsx` → `OpsShell` | Aligns Phase 13 routes; no business rewrite |

Root `AppChrome` hides public chrome on `/dashboard`, `/customer`, `/ops`, `/unauthorized`. Dirty `app/components/Header.tsx` left untouched.

---

## Navigation

Centralized under `lib/frontend/navigation/`:

- `public.ts` · `customer.ts` · `workspace.ts` · `ops.ts`
- `filter.ts` — permission / workspace / feature-flag / quarantine filters
- `legacy-quarantine.ts` — ZBP, BDM, Affiliate, Franchisee, Super Admin

Workspace switcher: `components/workspace/WorkspaceSwitcher.tsx` — allowed keys from `workspacesForAssignments` / page identity; persists via `switchWorkspaceAction`.

---

## States & layout primitives

- `EmptyState`, `ErrorState`, `AccessDenied`, `FeatureGated`, `StatusBadge`
- Loading: `PageSkeleton`, `DashboardSkeleton`, `CardSkeleton`, `ListSkeleton`, `NavSkeleton`, `WorkspaceResolverSkeleton`
- `PageHeader`, `ContentContainer`, `SkipToContent`

---

## Server / client boundary

| Server | Client |
|--------|--------|
| dashboard/customer/ops layouts (auth + entitlements) | Shell chrome, sheets, switcher, menus, bottom nav |
| Static nav config modules | Active route highlighting |

---

## Security review (Batch 0)

- Nav filters are **presentation only**; pages/layouts still authorize
- Switcher only accepts `WORKSPACE_KEYS`; unknown keys rejected in action
- No Super Admin / connect-ops workspace keys invented
- Legacy hrefs quarantined from active nav
- Feature-gated copy avoids leaking internal flag names
- Notification placeholders disabled (no fake privileged routes)

---

## Dirty WIP conflicts avoided

| Area | Action |
|------|--------|
| `Header.tsx` / Hero / Home / admin / venues | Untouched |
| `components/ui/button.tsx` | Kept; not regenerated |
| `globals.css` / tailwind | Minimal append / extend |
| Dashboard page business panels | Only removed duplicate switcher on success path |
| Planning docs | Already committed separately (`9a5475f`) |

---

## Testing

| Suite | Result |
|-------|--------|
| `tests/unit/batch0-*.test.ts(x)` | 16 passed |
| Full `npm test` | (run in quality gate) |
| typecheck | Pass |
| Scoped eslint Batch 0 paths | Pass (`--max-warnings 0`) |

---

## Deferred (non-blocking for Checkpoint A)

- next/font migration for Righteous/Poppins
- Full dark-mode productization
- Ops permission-precise nav filtering (pages still gate)
- Command palette / toast primitives
- Batch 1 public marketing pages
- Replacing dirty Header entirely (currently unused by AppChrome)

### Follow-up cleanup (Checkpoint A)

- Duplicate success-path dashboard `WorkspaceSwitcher` removed; canonical switcher remains in `PartnerShell` (access-denied path may still offer switcher for recovery).

---

## Checkpoint A review items

1. Brand tokens vs MASTER.md
2. Typography (Righteous display / Poppins body)
3. Public / Customer / Partner / Ops shells
4. Workspace switcher + 12-key model
5. Sidebar + mobile bottom nav
6. Status / loading / empty / error / AccessDenied / FeatureGated
7. Legacy nav quarantine

**Founder/Product review recommended before Batch 1.**
