"use client";

import { useMemo, useState } from "react";
import { MemberCard } from "@/components/connect/MemberCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Input } from "@/components/ui/input";
import type { CircleDirectoryCard } from "@/lib/frontend/connect/format";

const ALL = "__all__";

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v?.trim())))].sort(
    (a, b) => a.localeCompare(b)
  );
}

export function CircleDirectory({
  members,
}: {
  members: CircleDirectoryCard[];
}) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState(ALL);
  const [specialisation, setSpecialisation] = useState(ALL);
  const [tag, setTag] = useState(ALL);

  const sectorOptions = useMemo(
    () => uniqueSorted(members.map((m) => m.sectorLabel)),
    [members]
  );
  const specialisationOptions = useMemo(
    () => uniqueSorted(members.map((m) => m.specialisation)),
    [members]
  );
  const tagOptions = useMemo(() => {
    const tags = members.flatMap((m) => m.tagLabels ?? []);
    return uniqueSorted(tags);
  }, [members]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members.filter((m) => {
      if (sector !== ALL && m.sectorLabel !== sector) return false;
      if (specialisation !== ALL && m.specialisation !== specialisation) {
        return false;
      }
      if (tag !== ALL && !(m.tagLabels ?? []).includes(tag)) return false;
      if (!needle) return true;
      return [m.name, m.specialisation, m.sectorLabel, ...(m.tagLabels ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [members, q, sector, specialisation, tag]);

  const selectClass =
    "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search members, specialisation, Tags"
          aria-label="Search Circle directory"
          className="h-11 max-w-md"
        />
        {sectorOptions.length > 0 ? (
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            aria-label="Filter by GC Power Sector"
            className={selectClass + " lg:max-w-[220px]"}
          >
            <option value={ALL}>All Power Sectors</option>
            {sectorOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : null}
        {specialisationOptions.length > 0 ? (
          <select
            value={specialisation}
            onChange={(e) => setSpecialisation(e.target.value)}
            aria-label="Filter by specialisation"
            className={selectClass + " lg:max-w-[220px]"}
          >
            <option value={ALL}>All specialisations</option>
            {specialisationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : null}
        {tagOptions.length > 0 ? (
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            aria-label="Filter by Tag"
            className={selectClass + " lg:max-w-[200px]"}
          >
            <option value={ALL}>All Tags</option>
            {tagOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title={members.length === 0 ? "No directory rows" : "No matches"}
          description={
            members.length === 0
              ? "Seats will appear when allocated."
              : "Try a different search or filter."
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
