"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { GlassSurface } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

export interface InteractiveTravelCardProps {
  title: string;
  /** Brief description shown inside the card body. */
  description: string;
  actionText: string;
  href: string;
  onActionClick?: () => void;
  /** Portrait cards for verticals; landscape for Events / Offers. */
  layout?: "vertical" | "horizontal";
  /** `glass` swaps the solid panel for liquid glass and drops the glow. */
  surface?: "solid" | "glass";
  className?: string;
}

const glowClass =
  "shadow-[0_0_0_1px_hsl(var(--primary)/0.12),0_8px_28px_-6px_hsl(var(--primary)/0.35),0_0_48px_-12px_hsl(var(--primary)/0.28)] hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.22),0_12px_36px_-6px_hsl(var(--primary)/0.45),0_0_64px_-10px_hsl(var(--primary)/0.38)]";

/**
 * Theme-adaptive card with a 3D tilt effect on hover.
 * `solid` keeps the card surface + orange glow; `glass` swaps in liquid glass.
 */
export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    {
      title,
      description,
      actionText,
      href,
      onActionClick,
      layout = "vertical",
      surface = "solid",
      className,
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const isHorizontal = layout === "horizontal";
    const isGlass = surface === "glass";

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      mouseX.set((e.clientX - left) / width - 0.5);
      mouseY.set((e.clientY - top) / height - 0.5);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const isExternal = /^https?:\/\//i.test(href);

    const cornerLinkClass =
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary/20";

    const ctaClass = cn(
      "rounded-lg py-3 text-center font-semibold transition-colors",
      "bg-primary text-primary-foreground hover:bg-secondary",
      isHorizontal ? "w-full sm:w-auto sm:min-w-[10rem] sm:px-6" : "mt-6 w-full",
    );

    const actionControl = isExternal ? (
      <motion.button
        type="button"
        onClick={onActionClick}
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        style={{ transform: "translateZ(16px)" }}
        className={ctaClass}
      >
        {actionText}
      </motion.button>
    ) : (
      <motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        style={{ transform: "translateZ(16px)" }}
        className={isHorizontal ? undefined : "mt-6"}
      >
        <Link href={href} onClick={onActionClick} className={cn("block", ctaClass)}>
          {actionText}
        </Link>
      </motion.div>
    );

    const cornerLink = isExternal ? (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: "2.5deg" }}
        whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        aria-label={`Learn more about ${title}`}
        style={{ transform: "translateZ(28px)" }}
        className={cornerLinkClass}
      >
        <ArrowUpRight className="h-5 w-5" />
      </motion.a>
    ) : (
      <motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: "2.5deg" }}
        whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        style={{ transform: "translateZ(28px)" }}
      >
        <Link
          href={href}
          aria-label={`Learn more about ${title}`}
          className={cornerLinkClass}
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </motion.div>
    );

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative rounded-2xl bg-transparent p-4",
          // `isolate` would create a backdrop root and starve the glass of a backdrop.
          !isGlass && "isolate transition-shadow duration-300",
          !isGlass && glowClass,
          isHorizontal
            ? "mx-auto w-full max-w-none"
            : "mx-auto flex h-[26rem] w-full max-w-80 flex-col",
          className,
        )}
      >
        <div
          style={{
            transform: "translateZ(24px)",
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative h-full w-full rounded-xl border",
            isGlass
              ? "border-white/40 dark:border-white/10"
              : "overflow-hidden border-border bg-card",
            !isHorizontal && "flex min-h-0 flex-1 flex-col",
          )}
        >
          {isGlass ? <GlassSurface radiusClassName="rounded-xl" /> : null}
          <div
            className={cn(
              "relative z-10 text-foreground",
              isHorizontal
                ? "flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6"
                : "flex min-h-0 flex-1 flex-col justify-between p-5",
            )}
          >
            <div className={cn(isHorizontal && "min-w-0 flex-1")}>
              <div className="flex items-start justify-between gap-3">
                <motion.h2
                  style={{ transform: "translateZ(20px)" }}
                  className="font-body text-2xl font-bold tracking-tight"
                >
                  {title}
                </motion.h2>
                {cornerLink}
              </div>
              <motion.p
                style={{ transform: "translateZ(16px)" }}
                className={cn(
                  "mt-3 max-w-xl text-sm leading-relaxed",
                  isGlass ? "text-foreground/80" : "text-muted-foreground",
                )}
              >
                {description}
              </motion.p>
            </div>

            <div
              className={cn(
                isHorizontal && "shrink-0 self-stretch sm:self-center",
              )}
            >
              {actionControl}
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

InteractiveTravelCard.displayName = "InteractiveTravelCard";
