# GCE Events — Design System (Master)

**Status:** Founder-approved brand language · **Checkpoint E (Batch 10)**  
**Date:** 2026-08-11

## Brand pattern
Immersive, warm, product-system coherent — one visual family across marketing, customer, Connect, partner, Finance, Ops, and Settings shells.

## Style
Vibrant & Block-based — bold, energetic, geometric accents within a **single** component language. Consistency > novelty. 21st.dev informs structure only; GCE tokens control appearance.

## Colors (authoritative)

| Role | Value | Notes |
|------|-------|-------|
| Primary | `#EA580C` | Brand orange — CTAs, focus, active nav |
| Secondary | `#F97316` | Lighter orange — hover/secondary emphasis |
| On Primary | `#FFFFFF` | |
| Background | `#FFF7ED` | Warm cream |
| Foreground | `#0F172A` | Near-slate text |
| Neutrals | slate/warm borders | Surfaces, disabled, tables |

### Supersession — NO BLUE

**Founder direction:** Blue is **not** a GCE brand or decorative accent.

- Do **not** use `#2563EB` or Tailwind `blue-*` / `sky-*` / `cyan-*` / `indigo-*` for decorative UI.
- Do **not** use orange→blue, blue→purple, or rainbow gradients.
- Links, focus rings, badges, charts, and glass use the orange/warm-neutral family (or restrained semantic colors).

Semantic exceptions (standardized, not decorative):

- Success — green family
- Warning — amber family  
- Destructive — red family
- Info — remapped to orange (`#F97316` / chart secondary), **not** blue

## Dark mode (Layer A — FD-039 §26A)
- Default: system `prefers-color-scheme`; shell ThemeToggle may exist for Layer A
- Settings must **not** productize a separate theme/accent picker
- Dark background: true black `#000000`
- Brand orange remains primary CTA

## Typography
- Display: Righteous (brand mark only)
- Body: Poppins (headlines, UI, CTAs)
- Scale via `lib/frontend/typography.ts` — do not invent per-page sizes

## Consistency tokens (`lib/frontend/design-language.ts`)

| Token | Default |
|-------|---------|
| Radius card / panel / dialog | `rounded-2xl` |
| Radius control | `rounded-md` |
| Radius chip | `rounded-full` (chips/avatars only) |
| Elevation | surface / raised (`shadow-sm`) / hover (`shadow-lg shadow-orange-950/10`) / overlay |
| Card padding | `p-4` / `p-5` |
| Page container | `max-w-7xl` + `px-4 py-8 sm:px-6` |
| Section gap | `space-y-8` |
| Button height | `min-h-11` (44px) touch |
| Motion fast | 150–200ms |
| Motion normal | 250–350ms |
| Motion entrance | 300–350ms easeOut |
| Hover lift | `y: -2` to `-3` (respect reduced-motion) |

## Card families

1. **Standard Card** — `GCE_SURFACE.card`
2. **Interactive Card** — `GCE_SURFACE.cardInteractive`
3. **KPI Card** — `components/connect/KpiCard`
4. **Operational Card** — `GCE_SURFACE.operational` / Ops queue cards
5. **Glass Highlight** — `glassLight` / `glassElevated` only

## Glass (canonical recipes only)

1. **Glass Surface — Light:** `bg-white/70 dark:bg-black/50 border-white/40 backdrop-blur-md`
2. **Glass Surface — Elevated:** same + `shadow-lg shadow-orange-950/5`

Use sparingly (status strips, hero highlights). Never blue-tinted glass. Avoid on tables, long forms, QR, check-in, compliance, support timelines.

## Motion
Entrance fade/slide 200–350ms, hover scale ~1.02, orange CTA hover. All motion respects `prefers-reduced-motion`.

## Forms / badges / tables
- Shared shadcn primitives + GCE orange focus (`ring-ring` → brand)
- StatusBadge semantic tones only (no blue info default)
- PartnerDataTable / Ops queues: desktop table, mobile stacked cards

## 21st.dev rule
Search-only inspiration. Do not import marketplace themes or paid generation into product identity.

## Avoid
- Blue accents anywhere in product UI
- AI-generated one-offs (random bento, blobs, glow, mismatched radii)
- Rainbow sector/category colors
- Fake metrics
- Unrelated component languages per page
- User accent/theme pickers
- Emoji-as-icons; hero badge clutter
