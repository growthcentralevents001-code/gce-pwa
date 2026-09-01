"use client";

import { LeadCard } from "@/components/connect/LeadCard";
import { EmptyState } from "@/components/states/EmptyState";
import {
  LeadListFilters,
  useLeadListFilter,
  type LeadFilterKey,
} from "@/components/connect/LeadListFilters";

export function FilteredLeadList({
  items,
  emptyTitle,
  emptyAction,
}: {
  items: Array<{
    id: string;
    title: string;
    workStatus: string;
    city?: string | null;
    urgency?: string | null;
  }>;
  emptyTitle: string;
  emptyAction?: { label: string; href: string };
}) {
  const { filter, setFilter, filtered } = useLeadListFilter(items);

  return (
    <>
      <LeadListFilters
        value={filter}
        onChange={setFilter as (next: LeadFilterKey) => void}
        className="mb-4"
      />
      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} primaryAction={emptyAction} />
      ) : (
        <div className="grid gap-3">
          {filtered.map((l) => (
            <LeadCard
              key={l.id}
              id={l.id}
              title={l.title}
              workStatus={l.workStatus}
              city={l.city}
              urgency={l.urgency}
            />
          ))}
        </div>
      )}
    </>
  );
}
