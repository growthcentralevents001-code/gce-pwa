# GCE Design Redesign Tooling Plan

| Field | Value |
|-------|-------|
| **Status** | Stage 0 complete — tooling integration only |
| **Date** | 2026-08-15 |
| **Redesign executed?** | **No** — Founder-authorised later |

This document is the implementation plan for **how** GCE will use Taste, Impeccable, and Emil Kowalski skills. It does not authorise a visual rewrite by itself.

Canonical future pipeline:

```text
MASTER identity
  → Taste composition / anti-slop
  → Cursor implementation with GCE tokens + shadcn
  → Emil interaction / motion craft
  → Impeccable critique / audit / polish
  → Playwright / a11y / runtime validation
```

Do not average conflicting tool advice. Resolve through `.cursor/rules/09_Design_Tooling_Governance.mdc`.

---

## Stage 0 — Tooling integration

Taste + Impeccable + Emil installed and governed. No page redesign in this stage.

### Installation commands actually used

```bash
# Impeccable (live CLI 3.6.0 — not the older `npx impeccable install`)
npx impeccable@latest skills install -y --providers=cursor --scope=project --no-hooks

# Taste — two skills only
npx skills@latest add https://github.com/Leonxlnx/taste-skill \
  -s "design-taste-frontend" -s "redesign-existing-projects" \
  -a cursor -y --copy

# Emil official collection
npx skills@latest add emilkowalski/skills -a cursor -y --copy
```

Node on this machine was `v20.20.2`. Installers warned they prefer Node `>=22.18` / `>=22.20`; install still succeeded.

### Installed locations

Canonical installer stores (skills.sh):

- `.agents/skills/design-taste-frontend`
- `.agents/skills/redesign-existing-projects`
- `.agents/skills/{animate,animation-vocabulary,apple-design,ask-sonner,emil-design-eng,find-animation-opportunities,improve-animations,pick-ui-library,prototype,review-animations}`
- `skills-lock.json`

Impeccable installer:

- `.cursor/skills/impeccable` (skill v4.1.1)
- `.cursor/agents/impeccable-*.md`

GCE Cursor discovery mirror (copied so this repo’s `.cursor/skills` convention still works):

- `.cursor/skills/design-taste-frontend`
- `.cursor/skills/redesign-existing-projects`
- `.cursor/skills/{animate,animation-vocabulary,apple-design,ask-sonner,emil-design-eng,find-animation-opportunities,improve-animations,pick-ui-library,prototype,review-animations}`

### Reload / restart

Reload Cursor or start a new Agent chat after skill install. Type `/impeccable` to confirm command discovery. Do **not** run `/impeccable init` as a free-form brand interview; `PRODUCT.md` and `DESIGN.md` already point at MASTER.

### Invocation examples (later only)

```text
/impeccable critique the public homepage
/impeccable audit the Connect member dashboard
```

Taste: ask the agent to apply `redesign-existing-projects` / `design-taste-frontend` for composition analysis.

Emil: `review-animations` on a specific surface; `improve-animations` for a motion plan; `find-animation-opportunities` only after existing motion is corrected.

---

## Stage 1 — Critique

Use Impeccable critique/audit to identify:

- AI-generated-looking patterns
- Weak hierarchy
- Repetitive cards
- Predictable layouts
- Poor whitespace
- Generic composition
- Unnecessary glass
- Unnecessary pills
- Weak typography hierarchy
- Weak CTA hierarchy

Do not implement yet unless a later Founder-authorised pass says so.

---

## Stage 2 — Taste redesign analysis

Use Taste `redesign-existing-projects` for:

- Composition
- Page hierarchy
- Visual rhythm
- Stronger layouts
- Reduction of generic patterns

Retain canonical GCE identity (orange, Poppins/Righteous, shells, shadcn).

---

## Stage 3 — Targeted implementation

Apply improvements **page-family by page-family**. Do not blindly globally rewrite everything. Reuse shadcn and GCE tokens.

---

## Stage 4 — Impeccable polish + Emil craft

Use targeted Impeccable `critique` / `audit` / `polish` / `animate` where appropriate.

Use Emil for motion only when motion is the issue:

1. `review-animations`
2. `improve-animations` where needed
3. `find-animation-opportunities` only after problematic existing motion is corrected

Do **not** turn motion into a mandatory step on every page.

---

## Stage 5 — Browser validation

- Playwright
- Responsive checks
- Accessibility checks
- Console / hydration checks
- next-devtools runtime inspection as needed

---

## Stage 6 — Design consistency validation

Confirm the product still feels like **one** product: same tokens, shells, card families, and motion language.

---

## Tool responsibility matrix

| Need | Primary authority / tool |
| --- | --- |
| GCE brand authority | MASTER |
| Product context | PRODUCT.md |
| Design bridge | DESIGN.md |
| UX reasoning | ui-ux-pro-max |
| Styling implementation | ui-styling |
| Anti-slop composition | Taste |
| Critique / audit / polish | Impeccable |
| Motion / easing / micro-interaction craft | Emil |
| Animation review | Emil `review-animations` |
| Motion audit / plans | Emil `improve-animations` |
| Motion opportunities | Emil `find-animation-opportunities` |
| Motion terminology | Emil `animation-vocabulary` |
| Gesture / fluid-motion principles | Emil `apple-design` (principles only) |
| Library advice | Emil `pick-ui-library`, advisory only |
| UI experiments | Emil `prototype`, later only |
| Component inspiration | 21st.dev search-only |
| UI primitives | shadcn |
| General animation runtime | existing Motion stack |
| Browser validation | Playwright |
| Runtime inspection | next-devtools |

---

## Conflict examples

- Taste: “Use Geist” → MASTER: Poppins → **Poppins wins**
- Impeccable: “avoid pure black” → MASTER true-black dark surface → **true black wins**
- 21st component: blue SaaS sidebar → study structure; **reject blue**
- Emil `pick-ui-library`: Base UI / Sonner → **keep shadcn and current toast stack**
- `apple-design`: SF / iOS chrome → **GCE orange identity remains**

---

## Emil skills discovered from live install

Authorised:

- `emil-design-eng`
- `animate` (**exists** in live `emilkowalski/skills`; governed as motion implementation guidance)
- `review-animations`
- `improve-animations`
- `find-animation-opportunities`
- `animation-vocabulary`
- `apple-design`
- `pick-ui-library`
- `prototype`

Installed — not authorised for active use:

- `ask-sonner` — do not add or swap to Sonner

---

## Motion restraint and future audit categories

Use motion for feedback, spatial consistency, state indication, explanation, and preventing jarring changes. High-frequency dashboards and keyboard flows should often use no animation.

Future audits (not this Stage 0 task): `transition: all`, `ease-in` on enter, `scale(0)`, long UI transitions, width/height/margin/padding animation, ignored `prefers-reduced-motion`, wrong transform-origin, uninterruptible gestures, excessive stagger.

Canonical tokens today: `GCE_MOTION` in `lib/frontend/design-language.ts` (fast 180ms, normal 300ms, entrance 350ms) via `lib/frontend/motion.ts`. Flag Emil mismatches; do not silently fork.

---

## Dark mode (record, do not productize)

- FD-039: Dark mode MVP — system default + manual toggle; Layer A chrome
- MASTER: `prefers-color-scheme`; shell ThemeToggle may exist; Settings must **not** productize a theme/accent picker; dark background `#000000`
- Live UI: ThemeToggle in shells; Settings comments “No dark-mode productization”

Interpretation: Layer A header toggle is approved. Settings must not gain a theme picker. True-black stays. External skills may not replace it with dark navy.

---

## Figma

Figma MCP is deferred because GCE currently does not use Figma as its canonical design source of truth.

---

## 21st.dev

Remains search-only per `.cursor/rules/08_21st_Dev_MCP.mdc`. No generate / paid install. Skills cannot bypass this.

---

## First future audit targets (do not modify in Stage 0)

- Public Homepage
- Customer Home / Events
- Connect Member Dashboard
- Connect BDP Dashboard

These cover marketing, consumer marketplace, community/network, and partner-dashboard surfaces.

---

## Recommended next redesign loop

Separately Founder-authorised. Do not execute from this document alone.

1. `/impeccable critique`
2. Taste `redesign-existing-projects` analysis
3. Cursor implementation using GCE design system
4. Emil `review-animations`
5. Emil `improve-animations` where needed
6. Emil `find-animation-opportunities` only after existing motion is corrected
7. `/impeccable polish` (targeted, not site-wide)
8. Playwright responsive / a11y / runtime validation
9. Product-wide consistency review
