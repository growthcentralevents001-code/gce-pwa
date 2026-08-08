/**
 * Batch 0 layout tokens — mirror CSS vars in app/globals.css.
 * Prefer these constants over arbitrary per-page values.
 */

export const LAYOUT = {
  pageMaxWidth: "72rem", // max-w-6xl / --layout-page-max
  dashboardMaxWidth: "80rem", // max-w-7xl
  contentMaxWidth: "64rem",
  gutterMobile: "1rem",
  gutterDesktop: "1.5rem",
  sectionGap: "2rem",
  gridGap: "1rem",
  sidebarWidth: "16rem",
  sidebarCollapsedWidth: "4rem",
  headerHeight: "3.5rem",
  bottomNavHeight: "4rem",
  /** Touch target minimum (a11y) */
  touchTarget: "2.75rem",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
