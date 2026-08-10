import Link from "next/link";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { opsStatusTone } from "@/lib/frontend/ops/format";
import { cn } from "@/lib/utils";

export function OpsQueueCard({
  title,
  meta,
  summary,
  status,
  href,
  actions,
  warning,
  className,
}: {
  title: string;
  meta?: string;
  summary?: string | null;
  status?: string | null;
  href?: string;
  actions?: React.ReactNode;
  warning?: string | null;
  className?: string;
}) {
  const body = (
    <div
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.card,
        GCE_SPACING.cardPad,
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          {meta ? (
            <p className="text-xs text-muted-foreground">{meta}</p>
          ) : null}
        </div>
        {status ? (
          <StatusBadge label={status} tone={opsStatusTone(status)} />
        ) : null}
      </div>
      {summary ? (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {summary}
        </p>
      ) : null}
      {warning ? (
        <p
          className="mt-2 rounded-md border border-warning/40 bg-warning/10 px-2 py-1.5 text-xs text-warning"
          role="status"
        >
          {warning}
        </p>
      ) : null}
      {actions ? <div className="mt-3">{actions}</div> : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {body}
      </Link>
    );
  }
  return body;
}
