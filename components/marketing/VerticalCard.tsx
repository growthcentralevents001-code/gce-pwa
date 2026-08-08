"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/marketing/GlassPanel";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  store: Store,
  briefcase: Briefcase,
};

type VerticalCardProps = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  /** Client-safe icon key (avoid passing Lucide components from RSC). */
  icon: keyof typeof ICONS;
  accent?: "connect" | "marketplace" | "enterprise";
};

const accentRing = {
  connect: "from-orange-500/20 to-amber-400/10 hover:border-primary/40",
  marketplace: "from-blue-500/15 to-orange-400/10 hover:border-info/40",
  enterprise: "from-slate-500/15 to-orange-400/10 hover:border-foreground/20",
} as const;

export function VerticalCard({
  title,
  eyebrow,
  description,
  href,
  icon,
  accent = "connect",
}: VerticalCardProps) {
  const reduce = useReducedMotion();
  const Icon = ICONS[icon] ?? Users;

  const inner = (
    <GlassPanel
      className={cn(
        "group relative h-full overflow-hidden p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        "bg-gradient-to-br",
        accentRing[accent]
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
      <h3 className="mt-1 font-body text-xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Explore
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </GlassPanel>
  );

  if (reduce) {
    return (
      <Link
        href={href}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {inner}
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {inner}
      </Link>
    </motion.div>
  );
}
