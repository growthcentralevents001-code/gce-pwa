import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { VENUE_MBDP_RELATIONSHIP_COPY } from "@/lib/frontend/marketplace/format";
import { cn } from "@/lib/utils";

export function PartnerRelationshipCard({
  mbdpUserId,
  unitId,
  className,
}: {
  mbdpUserId?: string | null;
  unitId?: string | null;
  className?: string;
}) {
  return (
    <section className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h2 className="text-base font-semibold">Your Marketplace BDP</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {VENUE_MBDP_RELATIONSHIP_COPY}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {mbdpUserId ? (
          <StatusBadge
            label={`MBDP ${mbdpUserId.slice(0, 8)}`}
            tone="success"
          />
        ) : (
          <StatusBadge label="Organic / unattributed" tone="info" />
        )}
        {unitId ? (
          <StatusBadge label={`Unit ${unitId.slice(0, 8)}`} tone="neutral" />
        ) : null}
      </div>
    </section>
  );
}
