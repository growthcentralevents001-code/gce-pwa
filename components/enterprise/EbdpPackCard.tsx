import { StatusBadge } from "@/components/states/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  EBDP_CLIENTS_PER_PACK,
  clientCapacityLabel,
  ebdpPackageOptionLabel,
} from "@/lib/frontend/enterprise/format";
import { cn } from "@/lib/utils";

export function EbdpPackCard({
  packageOption,
  applicationStatus,
  activeClientCount,
  clientsCapacity,
  remainingRecoverableMinor,
  className,
}: {
  packageOption: string;
  applicationStatus: string;
  activeClientCount: number;
  clientsCapacity?: number;
  remainingRecoverableMinor?: number;
  className?: string;
}) {
  const capacity = clientsCapacity ?? EBDP_CLIENTS_PER_PACK;
  const pct = Math.min(
    100,
    Math.round((Math.min(activeClientCount, capacity) / Math.max(capacity, 1)) * 100)
  );

  return (
    <section
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}
      aria-labelledby="ebdp-pack-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="ebdp-pack-title" className="text-base font-semibold">
            Franchise Pack
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {ebdpPackageOptionLabel(packageOption)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Client-based attribution — no territory ownership.
          </p>
        </div>
        <StatusBadge
          label={applicationStatus.replace(/_/g, " ")}
          tone={applicationStatus === "active" ? "success" : "pending"}
        />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-sm">
          <span>Active clients</span>
          <span className="tabular-nums font-medium">
            {clientCapacityLabel(activeClientCount, capacity)}
          </span>
        </div>
        <Progress value={pct} aria-label="Client capacity" />
      </div>
      {typeof remainingRecoverableMinor === "number" &&
      remainingRecoverableMinor > 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Remaining recoverable balance is backend-managed (finance package only).
        </p>
      ) : null}
    </section>
  );
}

export function EnterpriseRelationshipCard({
  title = "Organisation",
  organisationName,
  representativeNote,
  className,
}: {
  title?: string;
  organisationName: string;
  representativeNote?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(GCE_RADIUS.card, GCE_SURFACE.glassLight, "p-4", className)}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <p className="mt-1 text-sm font-semibold">{organisationName}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {representativeNote ??
          "Enterprise Client organisation is separate from the logged-in representative."}
      </p>
    </section>
  );
}
