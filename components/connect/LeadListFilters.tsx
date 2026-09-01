"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type LeadFilterKey =
  | "all"
  | "active"
  | "accepted"
  | "closed"
  | "confirmed"
  | "declined";

const FILTERS: { key: LeadFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "accepted", label: "Accepted" },
  { key: "closed", label: "Closed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "declined", label: "Declined" },
];

const ACTIVE_STATUSES = new Set([
  "submitted",
  "classifying",
  "classified",
  "routing",
  "routed",
  "review_required",
  "offered",
  "accepted",
  "contact_revealed",
  "in_follow_up",
  "outcome_pending",
]);

const CLOSED_STATUSES = new Set([
  "closed_dual_confirmed",
  "closed_unconverted",
  "expired",
  "cancelled",
  "disputed",
]);

export function matchesLeadFilter(
  workStatus: string,
  filter: LeadFilterKey
): boolean {
  if (filter === "all") return true;
  if (filter === "active") return ACTIVE_STATUSES.has(workStatus);
  if (filter === "accepted") {
    return [
      "accepted",
      "contact_revealed",
      "in_follow_up",
      "outcome_pending",
    ].includes(workStatus);
  }
  if (filter === "closed") return CLOSED_STATUSES.has(workStatus);
  if (filter === "confirmed") return workStatus === "closed_dual_confirmed";
  if (filter === "declined") return workStatus === "declined";
  return true;
}

export function LeadListFilters({
  value,
  onChange,
  className,
}: {
  value: LeadFilterKey;
  onChange: (next: LeadFilterKey) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="Filter referrals"
    >
      {FILTERS.map((f) => (
        <Button
          key={f.key}
          type="button"
          size="sm"
          variant={value === f.key ? "default" : "outline"}
          className="min-h-9"
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}

export function useLeadListFilter<T extends { workStatus: string }>(
  items: T[],
  initial: LeadFilterKey = "all"
) {
  const [filter, setFilter] = useState<LeadFilterKey>(initial);
  const filtered = useMemo(
    () => items.filter((item) => matchesLeadFilter(item.workStatus, filter)),
    [items, filter]
  );
  return { filter, setFilter, filtered };
}
