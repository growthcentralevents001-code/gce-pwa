# GCE Design System (UI/UX 2.0)

| Field | Value |
|-------|-------|
| **Status** | Living — **how UI/UX 2.0 uses MASTER** |
| **Date** | 2026-09-04 |
| **Owns** | Composition rules, component hierarchy, anti-patterns for pages |
| **Does not own** | Token values, business rules, route IA |
| **Visual authority** | `design-system/MASTER.md` + `lib/frontend/design-language.ts` + `lib/frontend/motion.ts` + `lib/frontend/typography.ts` |

This file does **not** replace MASTER. If this document and MASTER disagree on palette, type, radius, glass, or dark surface, **MASTER wins**.

Older narrative `docs/core/13_UI_Guidelines.md` used `#F97316` as “primary” and white as the platform background. That is **superseded** for tokens. Primary is `#EA580C`; secondary `#F97316`; cream `#FFF7ED`; text `#0F172A`.

---

## Token map (do not fork)

| Role | Value | Use |
|------|-------|-----|
| Primary | `#EA580C` | CTAs, focus, active nav |
| Secondary | `#F97316` | Hover / secondary emphasis; **info** (not blue) |
| On primary | `#FFFFFF` | |
| Background | `#FFF7ED` | Warm cream page |
| Foreground | `#0F172A` | Near-slate **text** — not dark-mode chrome |
| Dark surface | `#000000` | FD-039 Layer A true black |
| Display type | Righteous | Brand mark only |
| UI type | Poppins | Headlines, body, CTAs |
| Card radius | `rounded-2xl` | Cards, panels, dialogs |
| Control radius | `rounded-md` | Inputs, buttons |
| Chip radius | `rounded-full` | Chips / avatars only |
| Motion fast / normal / entrance | 180 / 300 / 350 ms | `GCE_MOTION` |
| Hover lift | `y: -3` | Respect reduced motion |
| Page frame | `GCE_SPACING.page` | `max-w-7xl` + `px-4 py-8 sm:px-6` |

Forbidden decorative families: `blue-*`, `sky-*`, `cyan-*`, `indigo-*`, `#2563EB`, orange→blue or rainbow gradients.

Semantic only: success green, warning amber, destructive red. Info remaps to orange.

Theme: system `prefers-color-scheme` + optional shell `ThemeToggle`. Settings must **not** productize a theme/accent picker.

---

## Shared component hierarchy (target)

```text
MASTER tokens
  └── design-language / motion / typography
        └── components/ui/*                 shadcn primitives
              └── components/states/*       Empty, Error, FeatureGated, StatusBadge, AccessDenied
                    └── shells
                    │     PublicShell
                    │     WorkspaceShell specializations:
                    │       PartnerShell · CustomerShell · OpsShell · SettingsShell
                    └── domain
                          connect/ · customer/ · marketplace/ · enterprise/
                          partner/ · ops/ · finance/ · settings/
```

| Layer | Reuse | Do not |
|-------|-------|--------|
| Primitives | `components/ui/button`, dialog, sheet, table, tabs | New button kits, Base UI, Sonner |
| States | `components/states/*` | Ad-hoc “no data” copy in pages |
| Shells | `components/app-shell/*` | New headers per vertical |
| Switcher | `components/workspace/WorkspaceSwitcher.tsx` (singular) | Second switcher |
| Partner | `PartnerActionCenter`, `PartnerStatusStrip`, `PartnerDataTable`, `KpiCard` (triage only) | KPI-wall layouts |
| Connect | `LeadCard`, `LeadActions`, `LeadComposer`, `MembershipCard`, `CircleCard` | Kanban columns |
| Marketplace / CX | `EventCard`, `OfferCard`, `TicketPassCard`, `CheckInPanel`, `RedemptionPanel`, `ClaimTimeline` | Duplicate card languages |
| Enterprise | `ProjectOpsCards`, `OpportunityProjectCards`, `ProposalQuoteCards` | Settlement-first cards on project home |
| Ops | `ApprovalQueue`, `ExceptionQueue`, `OpsQueueCard`, `AuditTimeline` | Admin sidebar (`components/admin/*`) |
| Finance | `FinanceCards`, `FinanceVerticalFilter` | Consumer Wallet widgets |
| Marketing | `MarketingHero`, `CtaBand`, `Vertical3dSection` | Extra glass/atmosphere on ops tables |

Glass recipes (`GCE_SURFACE.glassLight` / `glassElevated`) are **highlights** (status strips, rare heroes). Not tables, long forms, QR, check-in, compliance, or support timelines.

---

## Layout recipes (target)

Match vertical metaphor, not a generic SaaS grid.

| Surface | Recipe |
|---------|--------|
| Marketing landing | Hero + one vertical explanation + CTA. Not bento-everywhere. |
| Workspace home | Attention list first (`PartnerActionCenter` or equivalent). Status strip. Then in-flight list. Optional one triage KPI row. |
| Connect referral detail | Header + **timeline** + action strip. |
| Marketplace catalogue desktop | Master–detail (list + detail pane) at 1366. |
| Marketplace catalogue mobile | List → full detail. |
| Venue day | Today’s events + check-in/redemption queues. |
| Enterprise project | Command Center: milestone timeline, blockers, vendors, documents. |
| Ops hub | Queue counts that are real + oldest waiting items. |
| Finance home | Holds / unmatched / exceptions. Ledgers as tables. |
| Settings | Section nav + forms. No theme store. |

Avoid: three equal KPI cards as the default page; decorative 3D on authenticated work; `liquid-glass` / extra glass switchers as product chrome.

## Quality principles (learned)

These are architectural, not per-page cosmetics:

1. **Job before widget.** If a screen’s job is a queue, use a list. If it is discovery, use catalogue. If it is a project, use a command center. Do not default to four KPI tiles + an attention card.
2. **Status strips are compact and wrap.** Mobile: two columns (or stacked). Desktop: a single wrapping row. Do not force equal `flex-1` cells that collide at 390.
3. **Attention is quiet when empty.** No warning icon for “nothing waiting.” Nested action rows only when there are actions.
4. **Customer width.** Phone: `max-w-lg` + bottom nav. `lg+`: page frame up to `max-w-6xl`, bottom nav hidden, primary items in the header so Events/Offers master–detail has room.
5. **Shells are singular.** Nested WorkspaceShells duplicate chrome (seen on `/dashboard/finance`). Pathname → workspace key in `PartnerShell` is enough inside `app/dashboard/layout.tsx`.
6. **Muted UI is warm, not blue-slate.** `--muted-foreground` must not sit in the blue hue range; status dots inherit it.
7. **Marketing composition.** Hero + immediate vertical body in the first viewport. Asymmetric vertical stories on the homepage — never three clones with the same orange CTA.
8. **Copy is human.** `platform_intermediary` → “Platform intermediary”. Do not leak enum keys into headers.

---

## Motion

Use `lib/frontend/motion.ts` (`motionDuration`, `gceTransition`, `gceHoverLift`).

Allowed: feedback, spatial continuity, state change, short entrance (≤350ms), hover lift on interactive cards.

Entrance motion must never hide content (`opacity: 0` as the resting first paint). Prefer transform-only reveals so SSR, reduced-motion, and screenshot/QA still show the page.

Not allowed: animate-everything, `transition: all`, long UI transitions, width/height animation for layout, uninterruptible motion, ignoring `prefers-reduced-motion`.

Emil / Taste / Impeccable skills are **advisory**. They must not fork durations or palettes. See `.cursor/rules/09_Design_Tooling_Governance.mdc`.

---

## Copy and naming

- Full vertical names: **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.
- BDP short names: Connect BDP, Marketplace BDP, Enterprise BDP.
- Governing Body (not “the circle” as a product brand in app chrome).
- Feature-gated inactive mechanics: `FeatureGated` copy, never fake checkout.

When tokens, shells, or shared components change, update this file and MASTER (if visual identity changed with Founder approval) in the same task.
