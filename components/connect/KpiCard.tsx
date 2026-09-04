"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  FileCheck,
  FolderOpen,
  GitBranch,
  LifeBuoy,
  Lock,
  Scale,
  Shield,
  Store,
  Tag,
  Target,
  Ticket,
  TicketCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

/** Serializable names only — Lucide components cannot cross the RSC boundary. */
export type KpiIconName =
  | "alert-triangle"
  | "briefcase"
  | "building"
  | "calendar"
  | "calendar-days"
  | "check-square"
  | "circle-dollar"
  | "file-check"
  | "folder-open"
  | "git-branch"
  | "life-buoy"
  | "lock"
  | "scale"
  | "shield"
  | "store"
  | "tag"
  | "target"
  | "ticket"
  | "ticket-check"
  | "users";

const KPI_ICONS: Record<KpiIconName, LucideIcon> = {
  "alert-triangle": AlertTriangle,
  briefcase: Briefcase,
  building: Building2,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  "check-square": CheckSquare,
  "circle-dollar": CircleDollarSign,
  "file-check": FileCheck,
  "folder-open": FolderOpen,
  "git-branch": GitBranch,
  "life-buoy": LifeBuoy,
  lock: Lock,
  scale: Scale,
  shield: Shield,
  store: Store,
  tag: Tag,
  target: Target,
  ticket: Ticket,
  "ticket-check": TicketCheck,
  users: Users,
};

export function KpiCard({
  label,
  value,
  href,
  icon,
  hint,
  className,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: KpiIconName;
  hint?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Icon = icon ? KPI_ICONS[icon] : undefined;
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon ? <Icon className="h-4 w-4 text-primary" aria-hidden /> : null}
      </div>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </>
  );

  const body = (
    <motion.div
      className={cn(GCE_RADIUS.control, GCE_SURFACE.card, "p-3", className)}
      whileHover={reduce || !href ? undefined : { y: GCE_MOTION.hoverY }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {inner}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {body}
      </Link>
    );
  }
  return body;
}
