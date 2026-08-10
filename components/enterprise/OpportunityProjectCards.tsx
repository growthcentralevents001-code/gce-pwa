import Link from "next/link";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  opportunityStatusLabel,
  projectStatusLabel,
} from "@/lib/frontend/enterprise/format";
import { cn } from "@/lib/utils";

export function OpportunityCard({
  id,
  title,
  status,
  summary,
  href,
  className,
}: {
  id: string;
  title: string;
  status: string;
  summary?: string | null;
  href?: string;
  className?: string;
}) {
  const body = (
    <article
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.card,
        "p-4 transition-shadow hover:shadow-lg hover:shadow-orange-950/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug">{title}</h3>
        <StatusBadge
          label={opportunityStatusLabel(status)}
          tone={
            status === "won"
              ? "success"
              : status === "lost" || status === "cancelled"
                ? "error"
                : "neutral"
          }
        />
      </div>
      {summary ? (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{summary}</p>
      ) : null}
      <p className="mt-2 text-[11px] text-muted-foreground">Ref {id.slice(0, 8)}</p>
    </article>
  );
  return href ? (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
      {body}
    </Link>
  ) : (
    body
  );
}

export function ProjectCard({
  id,
  title,
  status,
  href,
  executionNote,
  className,
}: {
  id: string;
  title: string;
  status: string;
  href?: string;
  executionNote?: string;
  className?: string;
}) {
  const body = (
    <article
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.card,
        "p-4 transition-shadow hover:shadow-lg hover:shadow-orange-950/10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <StatusBadge label={projectStatusLabel(status)} tone="neutral" />
      </div>
      {executionNote ? (
        <p className="mt-2 text-xs text-muted-foreground">{executionNote}</p>
      ) : null}
      <p className="mt-2 text-[11px] text-muted-foreground">Project {id.slice(0, 8)}</p>
    </article>
  );
  return href ? (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
      {body}
    </Link>
  ) : (
    body
  );
}
