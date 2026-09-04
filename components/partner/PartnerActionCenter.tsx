"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { KpiIconName } from "@/components/connect/KpiCard";
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
 * Attention list — a work list, not a nested card stack.
 * Empty state is quiet (no warning icon).
 */
export function PartnerActionCenter({
  title = "Needs your attention",
  items,
  emptyLabel = "Nothing waiting on you right now.",
  className,
}: {
  title?: string;
  items: PartnerActionItem[];
  emptyLabel?: string;
  className?: string;
}) {
  const hasWork = items.length > 0;

  return (
    <section className={cn("mb-6", className)} aria-labelledby="partner-action-center-title">
      <h2
        id="partner-action-center-title"
        className="text-sm font-semibold tracking-tight"
      >
        {title}
      </h2>
      {hasWork ? (
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {items.map((item) => {
            const Icon = item.icon ? ACTION_ICONS[item.icon] : undefined;
            const tone =
              item.severity === "critical"
                ? "text-destructive"
                : item.severity === "warning"
                  ? "text-warning"
                  : "text-primary";
            const body = (
              <div className="flex min-h-11 items-start justify-between gap-3 py-3">
                <div className="flex min-w-0 gap-3">
                  {Icon ? (
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", tone)} aria-hidden />
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                {item.href ? (
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                ) : null}
              </div>
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </section>
  );
}
