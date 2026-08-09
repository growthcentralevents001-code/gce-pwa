"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export type PipelineStage = {
  id: string;
  label: string;
  count: number;
  description?: string;
};

/**
 * Non-draggable pipeline presentation — counts from backend/grouping only.
 */
export function PartnerPipelineList({
  title = "Pipeline",
  stages,
  className,
}: {
  title?: string;
  stages: PipelineStage[];
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(stages[0]?.id ?? null);
  const total = useMemo(
    () => stages.reduce((s, st) => s + st.count, 0),
    [stages]
  );

  return (
    <section
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}
      aria-labelledby="partner-pipeline-title"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2 id="partner-pipeline-title" className="text-base font-semibold">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground tabular-nums">{total} records</p>
      </div>
      <ul className="space-y-2">
        {stages.map((stage) => {
          const open = openId === stage.id;
          return (
            <li key={stage.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-left touch-manipulation transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : stage.id)}
              >
                <span className="text-sm font-medium">{stage.label}</span>
                <StatusBadge label={String(stage.count)} tone="neutral" />
              </button>
              {open && stage.description ? (
                <p className="mt-1 px-3 text-xs text-muted-foreground">
                  {stage.description}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Stages are read-only. Drag-and-drop mutation is not supported.
      </p>
    </section>
  );
}
