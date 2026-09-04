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
          initial: { y: 16 },
          whileInView: { y: 0 },
          transition: { duration: 0.35, delay, ease: EASE_OUT },
        }
      : {
          initial: { y: 10 },
          whileInView: { y: 0 },
          transition: { duration: 0.3, delay, ease: EASE_OUT },
        };

  return (
    <motion.div
      className={cn(className)}
      viewport={{ once: true, amount: 0.15 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
