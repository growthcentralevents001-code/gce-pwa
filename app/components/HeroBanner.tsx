"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

const COLORS = {
  primary: "#EA580C",
  secondary: "#F97316",
  accent: "#2563EB",
  onPrimary: "#FFFFFF",
  foreground: "#0F172A",
} as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=80";

const SPRING = { stiffness: 90, damping: 22, mass: 0.35 };

export default function HeroBanner() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  const bgX = useTransform(springX, [-0.5, 0.5], ["5%", "-5%"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["4%", "-4%"]);
  const shapeX = useTransform(springX, [-0.5, 0.5], [-56, 56]);
  const shapeY = useTransform(springY, [-0.5, 0.5], [-40, 40]);
  const shapeRotate = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const accentX = useTransform(springX, [-0.5, 0.5], [24, -24]);
  const accentY = useTransform(springY, [-0.5, 0.5], [18, -18]);
  const contentX = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const contentY = useTransform(springY, [-0.5, 0.5], [-10, 10]);
  const contentRotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const contentRotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const glowX = useTransform(springX, [-0.5, 0.5], ["18%", "82%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["22%", "78%"]);
  const stripeX = useTransform(springX, [-0.5, 0.5], [-18, 18]);

  const enter = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
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
        alignItems: "flex-end",
        overflow: "hidden",
        backgroundColor: COLORS.foreground,
        perspective: reduceMotion ? undefined : 1200,
        ["--color-primary" as string]: COLORS.primary,
        ["--color-secondary" as string]: COLORS.secondary,
        ["--color-accent" as string]: COLORS.accent,
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-8%",
          x: reduceMotion ? 0 : bgX,
          y: reduceMotion ? 0 : bgY,
          backgroundImage: `
            linear-gradient(115deg, rgba(15,23,42,0.82) 0%, rgba(234,88,12,0.55) 48%, rgba(15,23,42,0.45) 100%),
            linear-gradient(to top, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.25) 42%, transparent 70%),
            url(${HERO_IMAGE})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />

      {!reduceMotion && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            width: "min(55vw, 480px)",
            height: "min(55vw, 480px)",
            left: glowX,
            top: glowY,
            x: "-50%",
            y: "-50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.secondary}55 0%, ${COLORS.accent}22 35%, transparent 70%)`,
            pointerEvents: "none",
            mixBlendMode: "screen",
            willChange: "left, top",
          }}
        />
      )}

      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          x: reduceMotion ? 0 : stripeX,
          backgroundImage: `
            linear-gradient(90deg, ${COLORS.primary} 0 12px, transparent 12px),
            linear-gradient(0deg, ${COLORS.accent}22 0%, transparent 35%)
          `,
          opacity: 0.9,
        }}
      />

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={
          reduceMotion
            ? { opacity: 0.55, scale: 1 }
            : { opacity: [0.45, 0.65, 0.45], scale: 1 }
        }
        transition={
          reduceMotion
            ? { duration: 0.4 }
            : {
                opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                duration: 0.5,
                delay: 0.12,
              }
        }
        style={{
          position: "absolute",
          right: "8%",
          top: "18%",
          width: "min(28vw, 220px)",
          height: "min(28vw, 220px)",
          x: reduceMotion ? 0 : shapeX,
          y: reduceMotion ? 0 : shapeY,
          rotate: reduceMotion ? 0 : shapeRotate,
          background: `linear-gradient(145deg, ${COLORS.secondary}, ${COLORS.primary})`,
          clipPath: "polygon(18% 0, 100% 0, 100% 82%, 0 100%)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {!reduceMotion && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            left: "62%",
            bottom: "28%",
            x: accentX,
            y: accentY,
            pointerEvents: "none",
          }}
        >
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [12, 18, 12] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "min(12vw, 96px)",
              height: "min(12vw, 96px)",
              background: COLORS.accent,
              opacity: 0.35,
              clipPath: "polygon(0 18%, 100% 0, 82% 100%, 0 100%)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
      )}

      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 40px)",
          x: reduceMotion ? 0 : contentX,
          y: reduceMotion ? 0 : contentY,
          rotateX: reduceMotion ? 0 : contentRotateX,
          rotateY: reduceMotion ? 0 : contentRotateY,
          transformStyle: "preserve-3d",
          willChange: reduceMotion ? undefined : "transform",
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
            textShadow: reduceMotion ? undefined : "0 12px 40px rgba(0,0,0,0.35)",
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
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
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

          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
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
      </motion.div>
    </section>
  );
}
