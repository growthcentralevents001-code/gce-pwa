import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  formatFinanceDate,
  formatMinorInr,
  recognitionStatusLabel,
  entitlementStatusLabel,
  stakeholderTypeLabel,
  GROSS_IMMUTABLE_COPY,
} from "@/lib/frontend/finance/format";
import { cn } from "@/lib/utils";

export function RevenueComponentCard({
  revenueComponentKey,
  vertical,
  recognitionStatus,
  grossAmountMinor,
  eligibleBaseMinor,
  className,
}: {
  revenueComponentKey: string;
  vertical: string;
  recognitionStatus: string;
  grossAmountMinor: number;
  eligibleBaseMinor?: number;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Revenue component
          </p>
          <h3 className="mt-1 break-all text-sm font-semibold">
            {revenueComponentKey}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {vertical.replace(/_/g, " ")}
          </p>
        </div>
        <StatusBadge
          label={recognitionStatusLabel(recognitionStatus)}
          tone={
            recognitionStatus === "recognised"
              ? "success"
              : recognitionStatus === "payment_received"
                ? "pending"
                : "neutral"
          }
        />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Gross (immutable)</dt>
          <dd className="font-medium tabular-nums">
            {formatMinorInr(grossAmountMinor)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Eligible base</dt>
          <dd className="font-medium tabular-nums">
            {typeof eligibleBaseMinor === "number"
              ? formatMinorInr(eligibleBaseMinor)
              : "—"}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] text-muted-foreground">{GROSS_IMMUTABLE_COPY}</p>
    </article>
  );
}

export function EntitlementSummaryCard({
  stakeholderType,
  status,
  grossEntitlementMinor,
  recoveryDeductionMinor,
  reversalAmountMinor,
  netSettlementEligibleMinor,
  revenueComponentKey,
  className,
}: {
  stakeholderType: string;
  status: string;
  grossEntitlementMinor: number;
  recoveryDeductionMinor: number;
  reversalAmountMinor: number;
  netSettlementEligibleMinor: number;
  revenueComponentKey?: string;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            {stakeholderTypeLabel(stakeholderType)}
          </h3>
          {revenueComponentKey ? (
            <p className="mt-1 break-all text-[11px] text-muted-foreground">
              {revenueComponentKey}
            </p>
          ) : null}
        </div>
        <StatusBadge label={entitlementStatusLabel(status)} tone="neutral" />
      </div>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Gross</dt>
          <dd className="tabular-nums font-medium">
            {formatMinorInr(grossEntitlementMinor)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Recovery</dt>
          <dd className="tabular-nums">
            {formatMinorInr(recoveryDeductionMinor)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Reversal</dt>
          <dd className="tabular-nums">{formatMinorInr(reversalAmountMinor)}</dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border/60 pt-2">
          <dt className="font-medium">Net settlement-eligible</dt>
          <dd className="tabular-nums font-semibold">
            {formatMinorInr(netSettlementEligibleMinor)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function HoldCard({
  reason,
  status,
  amountMinor,
  scopeType,
  createdAt,
  className,
}: {
  reason: string;
  status: string;
  amountMinor?: number | null;
  scopeType?: string | null;
  createdAt?: string | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{reason}</h3>
        <StatusBadge
          label={status.replace(/_/g, " ")}
          tone={status === "active" ? "warning" : "neutral"}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {[scopeType ? scopeType.replace(/_/g, " ") : null, formatFinanceDate(createdAt)]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {typeof amountMinor === "number" ? (
        <p className="mt-2 text-sm font-medium tabular-nums">
          {formatMinorInr(amountMinor)}
        </p>
      ) : null}
    </article>
  );
}

export function SettlementBatchCard({
  batchRef,
  status,
  payableTotalMinor,
  periodLabel,
  className,
}: {
  batchRef: string;
  status: string;
  payableTotalMinor?: number | null;
  periodLabel?: string | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{batchRef}</h3>
          {periodLabel ? (
            <p className="mt-1 text-xs text-muted-foreground">{periodLabel}</p>
          ) : null}
        </div>
        <StatusBadge label={status.replace(/_/g, " ")} tone="neutral" />
      </div>
      {typeof payableTotalMinor === "number" ? (
        <p className="mt-3 text-lg font-semibold tabular-nums">
          {formatMinorInr(payableTotalMinor)}
        </p>
      ) : null}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Execution gated OFF — review only.
      </p>
    </article>
  );
}

export function OfflinePaymentCard({
  method,
  amountMinor,
  bankReferenceMasked,
  reconciliationStatus,
  receivedOn,
  className,
}: {
  method: string;
  amountMinor: number;
  bankReferenceMasked: string;
  reconciliationStatus: string;
  receivedOn?: string | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase">{method}</h3>
        <StatusBadge
          label={reconciliationStatus.replace(/_/g, " ")}
          tone={
            reconciliationStatus === "matched"
              ? "success"
              : reconciliationStatus === "unmatched"
                ? "warning"
                : "neutral"
          }
        />
      </div>
      <p className="mt-2 text-lg font-semibold tabular-nums">
        {formatMinorInr(amountMinor)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Ref {bankReferenceMasked} · {formatFinanceDate(receivedOn)}
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Offline payment recorded ≠ automatic revenue recognition.
      </p>
    </article>
  );
}

export function FinanceExceptionCard({
  title,
  description,
  status,
  className,
}: {
  title: string;
  description?: string;
  status?: string;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {status ? (
          <StatusBadge label={status.replace(/_/g, " ")} tone="warning" />
        ) : null}
      </div>
      {description ? (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </article>
  );
}
