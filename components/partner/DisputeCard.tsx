import Link from "next/link";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Timeline, type TimelineItem } from "@/components/connect/Timeline";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function DisputeCard({
  id,
  subject,
  status,
  details,
  href,
  timeline,
  className,
}: {
  id: string;
  subject: string;
  status: string;
  details?: string | null;
  href?: string;
  timeline?: TimelineItem[];
  className?: string;
}) {
  const body = (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{subject}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Dispute · {id.slice(0, 8)}</p>
        </div>
        <StatusBadge label={status.replace(/_/g, " ")} tone="warning" />
      </div>
      {details ? (
        <p className="mt-3 text-sm text-muted-foreground">{details}</p>
      ) : null}
      {timeline && timeline.length > 0 ? (
        <div className="mt-4">
          <Timeline items={timeline} />
        </div>
      ) : null}
      <p className="mt-4 text-[11px] text-muted-foreground">
        First-level handling is Connect BDP. Unresolved cases escalate to Platform
        Relationship Manager. Resolution authority remains platform-governed.
      </p>
    </article>
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
