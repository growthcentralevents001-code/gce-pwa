import { OpsQueueCard } from "@/components/ops/OpsQueueCard";

export type IncidentRow = {
  id: string;
  title: string;
  summary?: string | null;
  severity?: string | null;
  status: string;
  source?: string | null;
  category?: string | null;
};

export function IncidentCard({
  incident,
  actions,
}: {
  incident: IncidentRow;
  actions?: React.ReactNode;
}) {
  return (
    <OpsQueueCard
      title={incident.title}
      summary={incident.summary}
      status={incident.status}
      meta={[incident.severity, incident.source, incident.category]
        .filter(Boolean)
        .join(" · ")}
      actions={actions}
    />
  );
}
