import { StatusBadge } from "@/components/states/StatusBadge";
import { AuditTimeline, type AuditEventRow } from "@/components/ops/AuditTimeline";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { opsStatusTone } from "@/lib/frontend/ops/format";
import { cn } from "@/lib/utils";

export type CaseDetailModel = {
  id: string;
  case_number: string;
  summary: string;
  case_type: string;
  vertical: string;
  status: string;
  priority?: string | null;
  subject_type?: string | null;
  subject_id?: string | null;
};

export type CaseNote = {
  id: string;
  visibility: string;
  body: string;
  author_user_id?: string | null;
  created_at?: string;
};

/**
 * Canonical case detail layout for Support / Ops.
 * Support cannot invent business-state overrides here — actions come from CaseActions.
 */
export function CaseDetail({
  caseRow,
  notes,
  events,
  actions,
  className,
}: {
  caseRow: CaseDetailModel;
  notes: CaseNote[];
  events: AuditEventRow[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <header
        className={cn(GCE_RADIUS.card, GCE_SURFACE.card, GCE_SPACING.cardPad)}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Case
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">
              {caseRow.case_number}
            </h1>
          </div>
          <StatusBadge
            label={caseRow.status}
            tone={opsStatusTone(caseRow.status)}
          />
        </div>
        <p className="mt-3 text-sm text-foreground">{caseRow.summary}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {caseRow.case_type} · {caseRow.vertical}
          {caseRow.priority ? ` · Priority ${caseRow.priority}` : ""}
          {caseRow.subject_type
            ? ` · ${caseRow.subject_type}:${(caseRow.subject_id ?? "").slice(0, 8)}…`
            : ""}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Support and Ops actions must use canonical commands. Protected business
          state machines cannot be bypassed from this view.
        </p>
      </header>

      {actions ? <section>{actions}</section> : null}

      <section
        className={cn(GCE_RADIUS.card, GCE_SURFACE.card, GCE_SPACING.cardPad)}
      >
        <h2 className="text-sm font-semibold">Internal notes</h2>
        <ul className="mt-3 space-y-2">
          {notes.length === 0 ? (
            <li className="text-sm text-muted-foreground">No notes yet.</li>
          ) : (
            notes.map((n) => (
              <li
                key={n.id}
                className="rounded-md border border-border bg-muted/30 p-3 text-sm"
              >
                <p className="text-xs text-muted-foreground">
                  {n.visibility}
                  {n.created_at ? ` · ${n.created_at}` : ""}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <AuditTimeline events={events} title="Case timeline" />
    </div>
  );
}
