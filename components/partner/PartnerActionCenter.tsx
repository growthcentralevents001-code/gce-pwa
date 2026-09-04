"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { KpiIconName } from "@/components/connect/KpiCard";
import {
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
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

const ACTION_ICONS: Record<KpiIconName, LucideIcon> = {
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

export type PartnerActionItem = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  severity?: "info" | "warning" | "critical";
  icon?: KpiIconName;
};

/**
 * Reusable Partner Action Center — Checkpoint C baseline for Batches 5/6.
 */
export function PartnerActionCenter({
  title = "Needs your attention",
  items,
  emptyLabel = "No actions required right now.",
  className,
}: {
  title?: string;
  items: PartnerActionItem[];
  emptyLabel?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}
      aria-labelledby="partner-action-center-title"
    >
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-primary" aria-hidden />
        <h2 id="partner-action-center-title" className="text-base font-semibold">
          {title}
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon ? ACTION_ICONS[item.icon] : undefined;
            const border =
              item.severity === "critical"
                ? "border-destructive/40"
                : item.severity === "warning"
                  ? "border-warning/40"
                  : "border-border";
            const body = (
              <div
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl border bg-muted/30 p-3",
                  border
                )}
              >
                <div className="flex gap-3">
                  {Icon ? (
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  ) : null}
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                {item.href ? (
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                ) : null}
              </div>
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
