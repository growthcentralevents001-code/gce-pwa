"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const GLASS_FILTER_ID = "glass-distortion";

/**
 * SVG displacement filter powering the liquid-glass refraction.
 * Render once per page — the filter id is shared across every GlassSurface.
 */
export function GlassFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <filter
        id={GLASS_FILTER_ID}
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004 0.008"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="50"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

type GlassSurfaceProps = {
  className?: string;
  /** Matches the radius of the element this surface sits behind. */
  radiusClassName?: string;
  /**
   * When false, skip the refraction / backdrop-blur layer.
   * Use inside ancestors that already form a backdrop root (sticky headers).
   */
  blur?: boolean;
};

/**
 * Layered liquid-glass surface — blur/refraction, tint, and edge highlights.
 * Renders behind content (never as its ancestor) so parent `preserve-3d` survives.
 */
export function GlassSurface({
  className,
  radiusClassName = "rounded-2xl",
  blur = true,
}: GlassSurfaceProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        radiusClassName,
        className,
      )}
    >
      {blur ? (
        <div
          className={cn(
            "absolute inset-0 supports-[backdrop-filter]:backdrop-blur-[7px]",
            radiusClassName,
          )}
          style={{
            filter: `url(#${GLASS_FILTER_ID})`,
            isolation: "isolate",
          }}
        />
      ) : null}

      {/* Neutral tint only — colour comes from whatever the glass refracts */}
      <div
        className={cn(
          "absolute inset-0 bg-white/45 dark:bg-white/[0.07]",
          radiusClassName,
        )}
      />

      {/* Edge highlights */}
      <div
        className={cn(
          "absolute inset-0 shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.5),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.5)]",
          "dark:shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.14),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.1)]",
          radiusClassName,
        )}
      />
    </div>
  );
}
