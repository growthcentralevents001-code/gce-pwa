import Link from "next/link";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { venueStatusLabel } from "@/lib/frontend/marketplace/format";
import { cn } from "@/lib/utils";

export function VenuePortfolioCard({
  name,
  city,
  status,
  category,
  attributionLabel,
  href,
  className,
}: {
  name: string;
  city?: string | null;
  status: string;
  category?: string | null;
  attributionLabel?: string | null;
  href?: string;
  className?: string;
}) {
  const body = (
    <article
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.cardInteractive,
        "p-5",
        className
      )}
      style={{ transitionDuration: `${GCE_MOTION.normalMs}ms` }}
    >
      <h3 className="text-base font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {[city, category].filter(Boolean).join(" · ") || "Venue"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge label={venueStatusLabel(status)} tone="neutral" />
        {attributionLabel ? (
          <StatusBadge label={attributionLabel} tone="info" />
        ) : null}
      </div>
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
