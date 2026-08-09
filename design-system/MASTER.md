# GCE Events — Design System (Master)

**Status:** Founder-approved brand language (Batch 3 supersession)  
**Date:** 2026-08-09

## Brand pattern
Immersive, warm, product-system coherent — one visual family across marketing, customer, Connect, and partner shells.

## Style
Vibrant & Block-based — bold, energetic, geometric accents within a **single** component language.

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

**Founder direction (Batch 3):** Blue is **not** a GCE brand or decorative accent.

- Do **not** use `#2563EB` or Tailwind `blue-*` / `sky-*` for decorative UI.
- Do **not** use orange→blue, blue→purple, or rainbow gradients.
- Links, focus rings, badges, charts, and glass must use the orange/warm-neutral family (or restrained semantic colors).

Semantic exceptions (standardized, not decorative):

- Success — green family
- Warning — amber family  
- Destructive — red family
- Info — remapped to orange (`#F97316` / chart secondary), **not** blue

## Dark mode (Layer A — FD-039 §26A)
- Default: system `prefers-color-scheme`; manual toggle in global header
- Dark background: true black `#000000`
- Dark foreground: near `#F8FAFC`
- Dark surfaces: `#121212`
- Brand orange remains primary CTA
- Transitions: ~200–300ms

## Typography
- Display: Righteous (brand mark only)
- Body: Poppins (headlines, UI, CTAs)

## Consistency tokens

| Token | Default |
|-------|---------|
| Radius card | `1rem` (rounded-2xl) |
| Radius control | `0.5rem` (rounded-md / --radius) |
| Radius chip | `9999px` (rounded-full) only for chips/avatars |
| Shadow card | `shadow-sm` → hover `shadow-lg shadow-orange-950/10` |
| Card padding | `p-4` / `p-5` |
| Section gap | `2rem` |
| Button height | `min-h-11` (44px) touch |
| Motion fast | 150–200ms |
| Motion normal | 250–350ms |
| Motion entrance | 300–350ms easeOut |
| Hover lift | `y: -2` to `-3` (respect reduced-motion) |

## Glass (canonical recipes only)

1. **Glass Surface — Light:** `bg-white/70 dark:bg-black/50 border-white/40 backdrop-blur-md`
2. **Glass Surface — Elevated:** same + `shadow-lg shadow-orange-950/5`

Use sparingly. Never blue-tinted glass. Avoid on tables, long text, QR.

## Effects
Entrance fade/slide 200–350ms, hover scale ~1.02, orange CTA hover, `prefers-reduced-motion` respected.

## Avoid
- Blue accents anywhere in product UI
- AI-generated one-offs (random bento, blobs, glow, mismatched radii)
- Rainbow sector/category colors
- Fake metrics
- Unrelated component languages per page
- Emoji-as-icons; hero badge clutter
