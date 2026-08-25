"use client";

import { useMemo, useState } from "react";
import { MemberCard } from "@/components/connect/MemberCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Input } from "@/components/ui/input";
import type { CircleDirectoryCard } from "@/lib/frontend/connect/format";

export function CircleDirectory({
  members,
}: {
  members: CircleDirectoryCard[];
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((m) =>
      [m.name, m.specialisation, m.sectorLabel, ...(m.tagLabels ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [members, q]);

  return (
    <div className="space-y-3">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search members, specialisation, Tags"
        aria-label="Search Circle directory"
        className="h-11 max-w-md"
      />
      {filtered.length === 0 ? (
        <EmptyState
          title={members.length === 0 ? "No directory rows" : "No matches"}
          description={
            members.length === 0
              ? "Seats will appear when allocated."
              : "Try a different search."
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((row) => (
            <MemberCard
              key={row.id}
              name={row.name}
              specialisation={row.specialisation}
              sectorLabel={row.sectorLabel}
              tagLabels={row.tagLabels}
              status={row.status}
            />
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Contact details are not listed here. Authorized Lead Assist receivers
        receive contact only after server reveal.
      </p>
    </div>
  );
}
