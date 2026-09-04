"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const LIGHT = {
  primary: "#EA580C",
  secondary: "#F97316",
  onPrimary: "#FFFFFF",
  /** Same as body --background: 33 100% 97% */
  background: "hsl(33 100% 97%)",
  soft: "hsl(33 100% 92%)",
  foreground: "#0F172A",
  muted: "rgba(15,23,42,0.72)",
  veil: `
    radial-gradient(ellipse 70% 55% at 50% 42%, hsl(33 100% 97% / 0.92) 0%, hsl(33 100% 97% / 0.55) 45%, hsl(33 100% 97% / 0.12) 70%, transparent 100%)
  `,
  bottomFade: `
    linear-gradient(to bottom, transparent 0%, transparent 62%, hsl(33 100% 97% / 0.55) 82%, hsl(33 100% 97%) 100%)
  `,
  secondaryCtaBg: "#FFFFFF",
  secondaryCtaHover: "#FFF7ED",
} as const;

const DARK = {
  primary: "#F97316",
  secondary: "#FB923C",
  onPrimary: "#FFFFFF",
  /** Same as body --background: 0 0% 0% */
  background: "hsl(0 0% 0%)",
  soft: "hsl(0 0% 4%)",
  foreground: "#F8FAFC",
  muted: "rgba(248,250,252,0.72)",
  veil: `
    radial-gradient(ellipse 70% 55% at 50% 42%, hsl(0 0% 0% / 0.88) 0%, hsl(0 0% 0% / 0.5) 45%, hsl(0 0% 0% / 0.12) 70%, transparent 100%)
  `,
  bottomFade: `
    linear-gradient(to bottom, transparent 0%, transparent 62%, hsl(0 0% 0% / 0.55) 82%, hsl(0 0% 0%) 100%)
  `,
  secondaryCtaBg: "transparent",
  secondaryCtaHover: "rgba(249,115,22,0.12)",
} as const;

const SPRING = { stiffness: 90, damping: 22, mass: 0.35 };
const BAR_COUNT = 15;

type Palette = typeof LIGHT | typeof DARK;

type GradientBarProps = {
  index: number;
  total: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduceMotion: boolean | null;
  colors: Palette;
};

function GradientBar({
  index,
  total,
  mouseX,
  mouseY,
  reduceMotion,
  colors,
}: GradientBarProps) {
  const position = index / (total - 1);
  const center = 0.5;
  const distanceFromCenter = Math.abs(position - center);
  const baseHeight =
    0.32 + Math.pow(distanceFromCenter * 2, 1.15) * 0.68;
  const pulseDelta = 0.08 + (index % 3) * 0.015;

  const mouseScale = useTransform([mouseX, mouseY], ([x, y]) => {
    if (reduceMotion) return 1;
    const mx = typeof x === "number" ? x : 0;
    const my = typeof y === "number" ? y : 0;
    const cursorPos = mx + 0.5;
    const proximity = 1 - Math.min(1, Math.abs(position - cursorPos) * 2.4);
    const intensity = 0.55 + Math.abs(my) * 0.9;
    const boost = proximity * proximity * intensity * 0.45;
    return 1 + boost;
  });

  const opacity = useTransform(mouseScale, [1, 1.45], [0.7, 0.95]);

  return (
    <motion.div
      aria-hidden
      initial={reduceMotion ? false : { scaleY: 0.2, opacity: 0 }}
      animate={
        reduceMotion
          ? { scaleY: baseHeight, opacity: 0.75 }
          : {
              scaleY: [
                baseHeight,
                Math.min(1.05, baseHeight + pulseDelta),
                baseHeight,
              ],
              opacity: 1,
            }
      }
      transition={
        reduceMotion
          ? { duration: 0.4 }
          : {
              scaleY: {
                duration: 2.4 + (index % 4) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              },
              opacity: { delay: index * 0.04, duration: 0.55, ease: "easeOut" },
            }
      }
      style={{
        flex: `1 0 calc(100% / ${total})`,
        maxWidth: `calc(100% / ${total})`,
        height: "100%",
        transformOrigin: "bottom",
        willChange: reduceMotion ? undefined : "transform",
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "bottom",
          scaleY: reduceMotion ? 1 : mouseScale,
          opacity: reduceMotion ? 0.75 : opacity,
          background: `linear-gradient(to top, ${colors.primary} 0%, ${colors.secondary} 42%, rgba(255,255,255,0) 100%)`,
          willChange: reduceMotion ? undefined : "transform, opacity",
        }}
      />
    </motion.div>
  );
}

function GradientBars({
  mouseX,
  mouseY,
  reduceMotion,
  colors,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduceMotion: boolean | null;
  colors: Palette;
}) {
  const bars = useMemo(
    () => Array.from({ length: BAR_COUNT }, (_, index) => index),
    [],
  );

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.45) 78%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.45) 78%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          transform: "translateZ(0)",
          alignItems: "stretch",
        }}
      >
        {bars.map((index) => (
          <GradientBar
            key={index}
            index={index}
            total={BAR_COUNT}
            mouseX={mouseX}
            mouseY={mouseY}
            reduceMotion={reduceMotion}
            colors={colors}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroBanner() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = mounted && resolvedTheme === "dark" ? DARK : LIGHT;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  const enter = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { y: 12 },
          animate: { y: 0 },
          transition: { duration: 0.4, ease: "easeOut" as const, delay },
        };

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      aria-label="GCE Events hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "min(78vh, 720px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: colors.background,
        /* Soft atmosphere at top; solid page color by the bottom edge */
        backgroundImage: `linear-gradient(180deg, ${colors.soft} 0%, ${colors.background} 72%, ${colors.background} 100%)`,
        transition: reduceMotion
          ? undefined
          : "background-color 280ms ease, background-image 280ms ease",
        ["--color-primary" as string]: colors.primary,
        ["--color-secondary" as string]: colors.secondary,
      }}
    >
      <GradientBars
        mouseX={springX}
        mouseY={springY}
        reduceMotion={reduceMotion}
        colors={colors}
      />

      {/* Readability veil over mid hero (does not create a hard bottom edge) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: colors.veil,
          transition: reduceMotion ? undefined : "background 280ms ease",
        }}
      />

      {/* Bottom dissolve into page background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: colors.bottomFade,
          transition: reduceMotion ? undefined : "background 280ms ease",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 40px) clamp(64px, 10vw, 112px)",
          textAlign: "center",
        }}
      >
        <motion.p
          {...enter(0)}
          style={{
            fontFamily: "var(--font-display, Righteous, cursive)",
            fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            color: colors.primary,
            margin: "0 0 20px",
            transition: reduceMotion ? undefined : "color 280ms ease",
          }}
        >
          GCE
        </motion.p>

        <motion.h1
          {...enter(0.08)}
          style={{
            fontFamily: "var(--font-body, Poppins, sans-serif)",
            fontSize: "clamp(1.35rem, 3.4vw, 2.15rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            color: colors.foreground,
            maxWidth: "100%",
            margin: "0 auto 14px",
            textWrap: "balance",
            transition: reduceMotion ? undefined : "color 280ms ease",
          }}
        >
          (GCE) Growth Central Events — Connect. Discover. Collaborate. Grow.
        </motion.h1>

        <motion.p
          {...enter(0.14)}
          style={{
            fontFamily: "var(--font-body, Poppins, sans-serif)",
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: colors.muted,
            maxWidth: "42em",
            margin: "0 auto 28px",
            transition: reduceMotion ? undefined : "color 280ms ease",
          }}
        >
          Connect and grow your business with the right people through GCE
          Connect, discover curated Marketplace and Offer Events through GCE
          Marketplace, and explore bigger business growth opportunities through
          GCE Enterprise.
        </motion.p>

        <motion.div
          {...enter(0.2)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <motion.div
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <InteractiveHoverButton
              text="Explore Events"
              href="/events"
              variant="primary"
            />
          </motion.div>

          <motion.div
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <InteractiveHoverButton
              text="Become a Member"
              href="/memberships"
              variant="outline"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
