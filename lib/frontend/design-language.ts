/**
 * Canonical GCE visual language — Batch 3.
 * Compose these classes; do not invent per-page magic numbers.
 */

export const GCE_RADIUS = {
  card: "rounded-2xl",
  control: "rounded-md",
  chip: "rounded-full",
  panel: "rounded-2xl",
} as const;

export const GCE_SURFACE = {
  card: "border border-border/80 bg-card shadow-sm",
  cardInteractive:
    "border border-border/80 bg-card shadow-sm transition-[box-shadow,transform] duration-300 hover:shadow-lg hover:shadow-orange-950/10 active:scale-[0.99] touch-manipulation",
  muted: "border border-border bg-muted/40",
  glassLight:
    "rounded-2xl border border-white/40 bg-white/70 shadow-lg shadow-orange-950/5 backdrop-blur-md dark:border-white/10 dark:bg-black/50",
  glassElevated:
    "rounded-2xl border border-white/50 bg-white/80 shadow-lg shadow-orange-950/10 backdrop-blur-md dark:border-white/10 dark:bg-black/60",
  warmHero:
    "bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 dark:from-orange-950/40 dark:via-neutral-900 dark:to-orange-950/20",
} as const;

export const GCE_MOTION = {
  fastMs: 180,
  normalMs: 300,
  entranceMs: 350,
  hoverY: -3,
} as const;

export const GCE_SPACING = {
  cardPad: "p-4",
  cardPadLg: "p-5",
  section: "space-y-8",
  stack: "space-y-4",
  grid: "gap-4",
} as const;

/** Four fixed GC Power Sectors (FD-030) — differentiate by icon/label, not rainbow. */
export const GC_POWER_SECTORS = [
  {
    id: "real_estate",
    label: "Real Estate, Infrastructure & Construction Sector",
    shortLabel: "Real Estate & Construction",
  },
  {
    id: "industrial",
    label: "Industrial, Manufacturing & Logistics Sector",
    shortLabel: "Industrial & Logistics",
  },
  {
    id: "professional",
    label: "Professional, Financial & Business Services Sector",
    shortLabel: "Professional & Financial",
  },
  {
    id: "consumer",
    label: "Consumer, Hospitality, Health & Lifestyle Sector",
    shortLabel: "Consumer & Lifestyle",
  },
] as const;

export type GcPowerSectorId = (typeof GC_POWER_SECTORS)[number]["id"];
