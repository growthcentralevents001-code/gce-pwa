import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { formatMinorInr } from "@/lib/frontend/partner/format";
import { cn } from "@/lib/utils";

export type CommercialSummaryRow = {
  id: string;
  label: string;
  /** Prefer preformatted string; falls back to minor formatting when provided. */
  value?: string;
  amountMinor?: number;
  emphasize?: boolean;
  hint?: string;
};

/**
 * Generic partner commercial summary — labels come from caller/backend.
 * Do not hardcode Connect formulas into this component.
 */
export function PartnerCommercialSummary({
  title = "Commercial summary",
  rows,
  footerNote,
  className,
}: {
  title?: string;
  rows: CommercialSummaryRow[];
  footerNote?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}
      aria-labelledby="partner-commercial-title"
    >
      <h2 id="partner-commercial-title" className="text-base font-semibold">
        {title}
      </h2>
      <dl className="mt-4 space-y-3">
        {rows.map((row) => {
          const display =
            row.value ??
            (typeof row.amountMinor === "number"
              ? formatMinorInr(row.amountMinor)
              : "—");
          return (
            <div
              key={row.id}
              className={cn(
                "flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0",
                row.emphasize && "pt-1"
              )}
            >
              <div>
                <dt
                  className={cn(
                    "text-sm text-muted-foreground",
                    row.emphasize && "font-medium text-foreground"
                  )}
                >
                  {row.label}
                </dt>
                {row.hint ? (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{row.hint}</p>
                ) : null}
              </div>
              <dd
                className={cn(
                  "text-sm tabular-nums",
                  row.emphasize ? "text-lg font-semibold text-foreground" : "font-medium"
                )}
              >
                {display}
              </dd>
            </div>
          );
        })}
      </dl>
      {footerNote ? (
        <p className="mt-4 text-xs text-muted-foreground">{footerNote}</p>
      ) : null}
    </section>
  );
}
