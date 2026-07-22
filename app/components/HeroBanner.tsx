"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const COLORS = {
  primary: "#EA580C",
  secondary: "#F97316",
  accent: "#2563EB",
  onPrimary: "#FFFFFF",
  foreground: "#0F172A",
} as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=80";

export default function HeroBanner() {
  const reduceMotion = useReducedMotion();

  const enter = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, ease: "easeOut" as const, delay },
        };

  return (
    <section
      aria-label="GCE Events hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "min(78vh, 720px)",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        backgroundColor: COLORS.foreground,
        ["--color-primary" as string]: COLORS.primary,
        ["--color-secondary" as string]: COLORS.secondary,
        ["--color-accent" as string]: COLORS.accent,
      }}
    >
      {/* Full-bleed atmosphere */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(115deg, rgba(15,23,42,0.82) 0%, rgba(234,88,12,0.55) 48%, rgba(15,23,42,0.45) 100%),
            linear-gradient(to top, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.25) 42%, transparent 70%),
            url(${HERO_IMAGE})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Vibrant block accents (design-system style) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(90deg, ${COLORS.primary} 0 12px, transparent 12px),
            linear-gradient(0deg, ${COLORS.accent}22 0%, transparent 35%)
          `,
          opacity: 0.9,
        }}
      />
      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        style={{
          position: "absolute",
          right: "8%",
          top: "18%",
          width: "min(28vw, 220px)",
          height: "min(28vw, 220px)",
          background: `linear-gradient(145deg, ${COLORS.secondary}, ${COLORS.primary})`,
          clipPath: "polygon(18% 0, 100% 0, 100% 82%, 0 100%)",
          opacity: 0.55,
          mixBlendMode: "screen",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 40px)",
        }}
      >
        <motion.p
          {...enter(0)}
          style={{
            fontFamily: "var(--font-display, Righteous, cursive)",
            fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            color: COLORS.onPrimary,
            margin: "0 0 20px",
          }}
        >
          GCE
        </motion.p>

        <motion.h1
          {...enter(0.08)}
          style={{
            fontFamily: "var(--font-body, Poppins, sans-serif)",
            fontSize: "clamp(1.5rem, 3.6vw, 2.35rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            color: COLORS.onPrimary,
            maxWidth: "18ch",
            margin: "0 0 14px",
          }}
        >
          Discover events that bring people together
        </motion.h1>

        <motion.p
          {...enter(0.14)}
          style={{
            fontFamily: "var(--font-body, Poppins, sans-serif)",
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.9)",
            maxWidth: "36ch",
            margin: "0 0 28px",
          }}
        >
          Find networking, learning, and entertainment near you—built for India&apos;s event community.
        </motion.p>

        <motion.div
          {...enter(0.2)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <motion.div whileHover={reduceMotion ? undefined : { scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            <Link
              href="/events"
              className="cursor-pointer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: COLORS.onPrimary,
                color: COLORS.primary,
                padding: "14px 26px",
                textDecoration: "none",
                fontFamily: "var(--font-body, Poppins, sans-serif)",
                fontWeight: 600,
                fontSize: "15px",
                transition: "background-color 200ms ease, color 200ms ease",
                outlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.accent;
                e.currentTarget.style.color = COLORS.onPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.onPrimary;
                e.currentTarget.style.color = COLORS.primary;
              }}
            >
              Explore Events <ArrowRight size={16} aria-hidden />
            </Link>
          </motion.div>

          <motion.div whileHover={reduceMotion ? undefined : { scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            <Link
              href="/signup"
              className="cursor-pointer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: COLORS.onPrimary,
                padding: "14px 26px",
                textDecoration: "none",
                fontFamily: "var(--font-body, Poppins, sans-serif)",
                fontWeight: 500,
                fontSize: "15px",
                border: "1.5px solid rgba(255,255,255,0.65)",
                transition: "border-color 200ms ease, background-color 200ms ease",
                outlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = COLORS.onPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.65)";
              }}
            >
              Become a Member
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
