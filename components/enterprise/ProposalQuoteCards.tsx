import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  FINANCE_COSIGN_COPY,
  financeCosignStatusLabel,
  formatMinorInr,
} from "@/lib/frontend/enterprise/format";
import { cn } from "@/lib/utils";

export function ProposalSummaryCard({
  title,
  status,
  summary,
  pricingMinor,
  className,
}: {
  title: string;
  status: string;
  summary?: string | null;
  pricingMinor?: number | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <StatusBadge label={status.replace(/_/g, " ")} tone="neutral" />
      </div>
      {summary ? (
        <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{summary}</p>
      ) : null}
      {typeof pricingMinor === "number" ? (
        <p className="mt-3 text-sm font-medium tabular-nums">
          {formatMinorInr(pricingMinor)}
        </p>
      ) : null}
    </article>
  );
}

export function QuoteSummaryCard({
  title,
  status,
  totalProposedMinor,
  financeCosignRequired,
  financeCosignedAt,
  hideInternalCommission,
  className,
}: {
  title?: string;
  status: string;
  totalProposedMinor?: number | null;
  financeCosignRequired?: boolean | null;
  financeCosignedAt?: string | null;
  /** Client view must not show partner entitlement. */
  hideInternalCommission?: boolean;
  className?: string;
}) {
  const cosign = financeCosignStatusLabel({
    required: financeCosignRequired,
    status,
    cosignedAt: financeCosignedAt,
  });
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{title ?? "Quote"}</h3>
        <StatusBadge label={status.replace(/_/g, " ")} tone="neutral" />
      </div>
      {typeof totalProposedMinor === "number" ? (
        <p className="mt-3 text-lg font-semibold tabular-nums">
          {formatMinorInr(totalProposedMinor)}
        </p>
      ) : null}
      <div className="mt-3">
        <StatusBadge label={cosign.label} tone={cosign.tone} />
      </div>
      {financeCosignRequired ? (
        <p className="mt-2 text-[11px] text-muted-foreground">{FINANCE_COSIGN_COPY}</p>
      ) : null}
      {hideInternalCommission ? (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Partner entitlement is not shown on the client quote view.
        </p>
      ) : null}
    </article>
  );
}

export function FinanceCosignStatus({
  required,
  status,
  cosignedAt,
  className,
}: {
  required?: boolean | null;
  status?: string | null;
  cosignedAt?: string | null;
  className?: string;
}) {
  const cosign = financeCosignStatusLabel({ required, status, cosignedAt });
  return (
    <div
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.glassLight,
        "p-4",
        className
      )}
      role="status"
      aria-label="Finance co-sign status"
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Finance co-sign
      </p>
      <div className="mt-2">
        <StatusBadge label={cosign.label} tone={cosign.tone} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{FINANCE_COSIGN_COPY}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Threshold is strictly greater than ₹5,00,000. Approval execution belongs to Finance/Ops.
      </p>
    </div>
  );
}
