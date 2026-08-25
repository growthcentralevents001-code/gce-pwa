"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /**
   * `fade` reveals with opacity; `rise` is transform-only so children using
   * backdrop-filter (glass) keep sampling the page behind them mid-reveal.
   */
  variant?: "fade" | "rise";
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Scroll reveal island — respects prefers-reduced-motion. */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  variant = "fade",
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const motionProps =
    variant === "rise"
      ? {
          initial: { y: 40, scale: 0.97 },
          whileInView: { y: 0, scale: 1 },
          transition: { duration: 0.35, delay, ease: EASE_OUT },
        }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay, ease: EASE_OUT },
        };

  return (
    <motion.div
      className={cn(className)}
      viewport={{ once: true, margin: "-80px" }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
