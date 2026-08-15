# GCE Design Authority

This file is a **bridge for external design skills** (Taste, Impeccable, Emil). It is **not** a second design system.

## Canonical sources

- Visual identity: `design-system/MASTER.md`
- Implementation tokens: `lib/frontend/design-language.ts`
- Typography scale: `lib/frontend/typography.ts`
- Motion helpers: `lib/frontend/motion.ts`
- Motion standards: `docs/engineering/27_Frontend_Animations.md`
- Shared primitives: `components/ui/` (shadcn)
- UI rules: `.cursor/rules/02_UI_Rules.mdc`
- Tool governance: `.cursor/rules/09_Design_Tooling_Governance.mdc`

Do **not** create a new palette, typography system, spacing scale, radius system, shadow system, glass system, or motion system in this file.

Taste, Impeccable, and Emil must read MASTER and the canonical token files **before** recommending visual changes. If a skill recommendation conflicts with MASTER, reject the recommendation.

## Identity snapshot (pointer only)

Authoritative values live in MASTER. Do not treat this snapshot as a place to invent variants:

- Primary: `#EA580C` · Secondary: `#F97316` · Background: `#FFF7ED` · Foreground: `#0F172A`
- Display font: Righteous (brand mark only) · Body/UI: Poppins
- No decorative blue / cyan / sky / indigo / teal / purple SaaS themes
- Dark surface: true black `#000000` (Layer A; Settings must not add a theme/accent picker)
- Glass: only `GCE_SURFACE.glassLight` / `glassElevated`
- Motion runtime: installed `motion` package via `lib/frontend/motion.ts`

## Precedence

Founder Decisions → MASTER → design-language/motion tokens → UI rules → this file → ui-ux-pro-max / ui-styling → Taste → Impeccable → Emil → 21st.dev search-only.
