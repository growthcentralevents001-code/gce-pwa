# GCE Responsive and Accessibility

| Field | Value |
|-------|-------|
| **Status** | Living **target** |
| **Date** | 2026-09-04 |
| **Owns** | Breakpoints, shell behavior, catalogue layouts, a11y/PWA baseline |
| **Does not own** | Visual tokens (MASTER), business rules |
| **Supersedes for responsive UX** | `docs/frontend/FRONTEND_RESPONSIVE_PWA_A11Y_SEO_PERFORMANCE.md` as the living target (that file remains Batch 10 evidence) |

Mobile-first. Design at **390**, then **768**, then **1366**.

---

## Breakpoints

| Name | CSS | Target device | Shell | Data density |
|------|-----|---------------|-------|--------------|
| Mobile | default, ~390 | Phones | Customer bottom nav; partner/ops **Sheet** | Cards, full-page detail |
| Tablet | `md` ~768 | Tablets / small laptops | Sheet or collapsible sidebar | Cards or compact table |
| Desktop | `lg`/`xl` ~1366 | Laptops | Persistent sidebar | Tables; Marketplace **master–detail** |

Page containers: `GCE_SPACING.page` (`max-w-7xl`). Customer shell may stay narrower (`max-w-lg` header is current; content can use `max-w-5xl` as today).

Touch: controls `min-h-11` (44px). Safe-area padding on customer bottom nav.

Never ship a desktop-only layout for a customer or member task.

---

## Shell behavior

| Shell | 390 | 768 | 1366 |
|-------|-----|-----|------|
| PublicShell | Hamburger Sheet + compact header | Same | Horizontal `PUBLIC_NAV` |
| CustomerShell | Sticky header + **bottom nav** (5) | Bottom nav or compact top | Top + bottom optional; keep thumb actions |
| PartnerShell | Icon header + Sheet nav + switcher | Sheet | Sidebar + switcher |
| OpsShell | Sheet + search in header | Sheet | Dense sidebar + `OpsSearch` |
| SettingsShell | Stacked sections | Nav + form | Nav + form |

Workspace switcher must be reachable on mobile (header or Sheet), not desktop-only.

---

## Vertical layout rules

### Marketplace catalogue (Events / Offers / Venues)

- **390:** list of cards → navigate to **full detail**. Book/claim is a full page. No split view.
- **768:** list + filters; detail still a page unless the pane is clearly usable.
- **1366:** **master–detail allowed** (list ~1/3, detail ~2/3) for Events and Offers. Venues directory may stay list → detail.

Public `/events` and `/customer/events` share this rule. Current implementation is list → page at all sizes — KEEP until a catalogue screen is materially rebuilt, then add desktop master–detail.

### Connect referrals

Timeline and action strip stack on 390. Actions stay visible (sticky footer OK). Never convert to horizontal Kanban at any breakpoint.

### Enterprise Project Command Center

390: attention → milestone list → accordions for vendors/docs.  
1366: attention + milestone timeline in the primary column; secondary column for vendors/docs.

### Venue check-in / redemption

390: large scan/action, then queue cards. Tables only from 768+ if they remain usable.

### Ops / Finance

390: queue cards. 1366: tables (`PartnerDataTable` pattern). Horizontal scroll on tables is a last resort; prefer stacked definition lists on mobile.

---

## Accessibility baseline

- Skip link on every shell (`SkipToContent`)
- Semantic landmarks: header, nav, main
- Focus rings use brand (`ring-ring` → orange), never blue
- Dialogs/Sheets keyboard-accessible (Radix/shadcn)
- Form labels + error association
- `StatusBadge` text + tone, not color-only
- Contrast against cream / true-black / orange CTAs per MASTER
- `prefers-reduced-motion`: `lib/frontend/motion.ts` collapses duration to 0
- Do not claim WCAG certification (professional audit remains outside this doc)

Authenticated app routes stay `noindex`. Public marketing/catalogue is indexable.

---

## PWA

- Manifest theme `#EA580C`, background `#FFF7ED`
- `/offline` restrained card
- Service worker: `/api` NetworkOnly (do not cache API as pages)
- Push remains gated off
- `public/sw.js` is a **build artifact** — do not commit drive-by changes

---

## Reduced-motion and density

High-frequency Ops/Finance interactions prioritize **speed** over entrance motion. Marketing may use the home 3D vertical tiles; WorkspaceShell must not inherit that atmosphere.

When breakpoints, shell chrome, or catalogue layout rules change, update this file in the same task.
