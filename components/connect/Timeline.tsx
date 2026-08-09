import { cn } from "@/lib/utils";
import { GCE_RADIUS } from "@/lib/frontend/design-language";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  at?: string | null;
  tone?: "neutral" | "success" | "warning" | "pending";
};

const DOT: Record<NonNullable<TimelineItem["tone"]>, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  pending: "bg-primary",
};

/**
 * Canonical Timeline — reuse across leads, membership, cases (Batch 3+).
 */
export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No activity yet.</p>
    );
  }

  return (
    <ol className={cn("relative space-y-4 border-l border-border pl-5", className)}>
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className={cn(
              "absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background",
              DOT[item.tone ?? "neutral"]
            )}
            aria-hidden
          />
          <p className="text-sm font-medium">{item.title}</p>
          {item.description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.description}
            </p>
          ) : null}
          {item.at ? (
            <p className={cn("mt-1 text-[11px] text-muted-foreground", GCE_RADIUS.chip)}>
              {new Date(item.at).toLocaleString("en-IN")}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
