"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Progressive edge blur — stacked backdrop-filter layers, each masked to a
 * band, so content dissolves toward an edge instead of cutting off.
 *
 * Adapted from React Bits' GradualBlur. Note the container must NOT create a
 * backdrop root (no `isolation`, `opacity` < 1, or `filter`), or the layers
 * below have nothing to sample and the effect renders blank.
 */

export type GradualBlurPosition = "top" | "bottom" | "left" | "right";
export type GradualBlurCurve =
  | "linear"
  | "bezier"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export interface GradualBlurProps {
  /** Edge the overlay attaches to. */
  position?: GradualBlurPosition;
  /** Base blur multiplier applied to every layer. */
  strength?: number;
  /** Overlay thickness along the blur axis. */
  height?: string;
  /** Overrides the cross-axis size; defaults to 100% (or `height` when horizontal). */
  width?: string;
  /** Stacked layers — more is smoother and more expensive. */
  divCount?: number;
  /** Exponential rather than linear ramp, for a harder final blur. */
  exponential?: boolean;
  curve?: GradualBlurCurve;
  opacity?: number;
  /** `true` fades in on mount, `"scroll"` fades in when scrolled into view. */
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  /** Multiplies `strength` while hovered; also enables pointer events. */
  hoverIntensity?: number;
  /** `page` pins to the viewport; `parent` pins to the nearest positioned ancestor. */
  target?: "parent" | "page";
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  onAnimationComplete?: () => void;
}

const CURVE_FUNCTIONS: Record<GradualBlurCurve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) =>
    p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
};

const GRADIENT_DIRECTION: Record<GradualBlurPosition, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve: boolean,
) {
  const [isVisible, setIsVisible] = React.useState(!shouldObserve);

  React.useEffect(() => {
    if (!shouldObserve) {
      setIsVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

function GradualBlurBase({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  curve = "linear",
  opacity = 1,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  hoverIntensity,
  target = "parent",
  zIndex = 30,
  className,
  style,
  onAnimationComplete,
}: GradualBlurProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const isVisible = useIntersectionObserver(containerRef, animated === "scroll");

  const blurDivs = React.useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;
    const currentStrength =
      isHovered && hoverIntensity ? strength * hoverIntensity : strength;
    const curveFunc = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;
    const direction = GRADIENT_DIRECTION[position] ?? "to bottom";

    for (let i = 1; i <= divCount; i++) {
      const progress = curveFunc(i / divCount);
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * divCount + 1) * currentStrength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const mask = `linear-gradient(${direction}, ${gradient})`;

      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
            transition:
              animated && animated !== "scroll"
                ? `backdrop-filter ${duration} ${easing}`
                : undefined,
          }}
        />,
      );
    }

    return divs;
  }, [
    position,
    strength,
    divCount,
    exponential,
    curve,
    opacity,
    animated,
    duration,
    easing,
    hoverIntensity,
    isHovered,
  ]);

  const containerStyle = React.useMemo<React.CSSProperties>(() => {
    const isVertical = position === "top" || position === "bottom";
    const isPageTarget = target === "page";

    const base: React.CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: animated ? `opacity ${duration} ${easing}` : undefined,
      zIndex,
      ...style,
    };

    if (isVertical) {
      base.height = height;
      base.width = width ?? "100%";
      base[position] = 0;
      base.left = 0;
      base.right = 0;
    } else {
      base.width = width ?? height;
      base.height = "100%";
      base[position] = 0;
      base.top = 0;
      base.bottom = 0;
    }

    return base;
  }, [
    position,
    target,
    hoverIntensity,
    isVisible,
    animated,
    duration,
    easing,
    zIndex,
    height,
    width,
    style,
  ]);

  React.useEffect(() => {
    if (!isVisible || animated !== "scroll" || !onAnimationComplete) return;
    const timer = setTimeout(onAnimationComplete, parseFloat(duration) * 1000);
    return () => clearTimeout(timer);
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("gradual-blur", className)}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner">{blurDivs}</div>
    </div>
  );
}

export const GradualBlur = React.memo(GradualBlurBase);
GradualBlur.displayName = "GradualBlur";
