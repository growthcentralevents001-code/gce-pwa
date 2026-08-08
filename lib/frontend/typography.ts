/**
 * Canonical typography classes from design-system/MASTER.md
 * Display: Righteous · Body: Poppins
 */

export const typography = {
  display: "font-display text-4xl font-normal tracking-tight md:text-5xl",
  pageTitle: "font-body text-2xl font-semibold tracking-tight text-foreground md:text-3xl",
  sectionHeading: "font-body text-xl font-semibold text-foreground",
  cardHeading: "font-body text-base font-semibold text-foreground",
  body: "font-body text-base font-normal text-foreground",
  bodySmall: "font-body text-sm font-normal text-foreground",
  label: "font-body text-sm font-medium text-foreground",
  helper: "font-body text-sm font-normal text-muted-foreground",
  caption: "font-body text-xs font-normal text-muted-foreground",
  kpi: "font-body text-2xl font-semibold tabular-nums tracking-tight text-foreground",
  brandMark: "font-display text-xl tracking-wide text-primary",
} as const;

export type TypographyKey = keyof typeof typography;
