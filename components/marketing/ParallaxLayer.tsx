"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type ParallaxLayerProps = {
  children: React.ReactNode;
  className?: string;
  /** Total vertical drift in px across the layer's scroll range. */
  distance?: number;
};

/**
 * Scroll-linked vertical drift for decorative layers.
 * Transform-only, so it never becomes a backdrop root for glass siblings.
 */
export function ParallaxLayer({
  children,
  className,
  distance = 60,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={className}
      style={{ y: reduce ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}
