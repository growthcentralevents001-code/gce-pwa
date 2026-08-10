import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import {
  COMPLIANCE_SAFE_COPY,
  complianceHoldLabel,
  maskSensitiveId,
  opsStatusTone,
} from "@/lib/frontend/ops/format";
import { cn } from "@/lib/utils";

export type ComplianceHoldRow = {
  id: string;
  subject_type: string;
  subject_id: string;
  reason: string;
  status: string;
  scope?: string | null;
  release_conditions?: string | null;
  started_at?: string | null;
  released_at?: string | null;
};

/**
 * Explicit hold presentation — not a generic toggle.
 * Wording avoids inventing legal/statutory determinations.
 */
export function ComplianceHoldCard({
  hold,
  actions,
  className,
}: {
  hold: ComplianceHoldRow;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.card,
        GCE_SPACING.cardPad,
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Compliance hold
          </p>
          <p className="mt-1 font-medium">
            {hold.subject_type} · {maskSensitiveId(hold.subject_id, 6)}
          </p>
        </div>
        <StatusBadge
          label={complianceHoldLabel(hold.status)}
          tone={opsStatusTone(hold.status)}
        />
      </div>
      <p className="mt-2 text-sm text-foreground">{hold.reason}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {COMPLIANCE_SAFE_COPY.notLegalDetermination}
      </p>
      {hold.release_conditions ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Release conditions: {hold.release_conditions}
        </p>
      ) : null}
      <p className="mt-1 text-xs text-muted-foreground">
        Scope: {hold.scope ?? "scoped"}
        {hold.started_at ? ` · Started ${hold.started_at}` : ""}
        {hold.released_at ? ` · Released ${hold.released_at}` : ""}
      </p>
      {actions ? <div className="mt-3">{actions}</div> : null}
    </article>
  );
}
