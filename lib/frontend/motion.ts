/**
 * Canonical motion helpers — Batch 10 / Checkpoint E.
 * Always pair interactive motion with prefers-reduced-motion.
 */

import { GCE_MOTION } from "@/lib/frontend/design-language";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Transition duration in ms — collapses under reduced motion. */
export function motionDuration(
  kind: "fast" | "normal" | "entrance" = "normal"
): number {
  if (prefersReducedMotion()) return 0;
  if (kind === "fast") return GCE_MOTION.fastMs;
  if (kind === "entrance") return GCE_MOTION.entranceMs;
  return GCE_MOTION.normalMs;
}

/** Framer/motion-style transition object for shared cards/sheets. */
export function gceTransition(kind: "fast" | "normal" | "entrance" = "normal") {
  const duration = motionDuration(kind) / 1000;
  return {
    duration,
    ease: [0.22, 1, 0.36, 1] as const,
  };
}

export function gceHoverLift() {
  if (prefersReducedMotion()) {
    return { y: 0, transition: { duration: 0 } };
  }
  return {
    y: GCE_MOTION.hoverY,
    transition: gceTransition("fast"),
  };
}
