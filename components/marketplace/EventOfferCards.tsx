import Link from "next/link";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { formatMinorInr } from "@/lib/frontend/marketplace/format";
import { cn } from "@/lib/utils";

export function EventManagementCard({
  title,
  status,
  startsAt,
  capacity,
  priceMinor,
  href,
  className,
}: {
  title: string;
  status: string;
  startsAt?: string | null;
  capacity?: number | null;
  priceMinor?: number | null;
  href?: string;
  className?: string;
}) {
  const body = (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <StatusBadge label={status.replace(/_/g, " ")} tone="pending" />
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
        <div>
          <dt className="sr-only">Starts</dt>
          <dd>
            {startsAt
              ? new Date(startsAt).toLocaleString("en-IN")
              : "Schedule TBD"}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Capacity</dt>
          <dd>{typeof capacity === "number" ? `Cap ${capacity}` : "—"}</dd>
        </div>
        <div>
          <dt className="sr-only">Price</dt>
          <dd>
            {typeof priceMinor === "number" ? formatMinorInr(priceMinor) : "—"}
          </dd>
        </div>
      </dl>
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

export function OfferManagementCard({
  title,
  status,
  campaignStartsAt,
  campaignEndsAt,
  customerCap,
  claimsCount,
  plannedValueMinor,
  claimValidityHours,
  href,
  className,
}: {
  title: string;
  status: string;
  campaignStartsAt?: string | null;
  campaignEndsAt?: string | null;
  customerCap?: number | null;
  claimsCount?: number | null;
  plannedValueMinor?: number | null;
  claimValidityHours?: number | null;
  href?: string;
  className?: string;
}) {
  const body = (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <StatusBadge label={status.replace(/_/g, " ")} tone="pending" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {campaignStartsAt
          ? new Date(campaignStartsAt).toLocaleDateString("en-IN")
          : "—"}{" "}
        →{" "}
        {campaignEndsAt
          ? new Date(campaignEndsAt).toLocaleDateString("en-IN")
          : "—"}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Claims {claimsCount ?? 0}/{customerCap ?? "—"}
        {typeof claimValidityHours === "number"
          ? ` · ${claimValidityHours}h claim validity`
          : null}
      </p>
      {typeof plannedValueMinor === "number" ? (
        <p className="mt-2 text-xs">
          Planned sale value {formatMinorInr(plannedValueMinor)}{" "}
          <span className="text-muted-foreground">(not a fee/guarantee)</span>
        </p>
      ) : null}
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
