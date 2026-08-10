import { EmptyState } from "@/components/states/EmptyState";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { StatusBadge } from "@/components/states/StatusBadge";
import { opsStatusTone } from "@/lib/frontend/ops/format";

export type ExceptionQueueItem = {
  id: string;
  title: string;
  summary?: string | null;
  exception_key: string;
  severity?: string | null;
  status: string;
  vertical: string;
};

export function ExceptionQueue({
  items,
  dense = false,
}: {
  items: ExceptionQueueItem[];
  dense?: boolean;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No open exceptions"
        description="Exception queue is empty for this scope. Severity comes from backend only."
      />
    );
  }

  if (dense) {
    return (
      <PartnerDataTable
        rows={items}
        mobileTitle={(r) => r.title}
        columns={[
          { id: "title", header: "Title", cell: (r) => r.title },
          {
            id: "key",
            header: "Key",
            cell: (r) => r.exception_key,
            hideOnMobile: true,
          },
          {
            id: "severity",
            header: "Severity",
            cell: (r) => r.severity ?? "—",
          },
          {
            id: "status",
            header: "Status",
            cell: (r) => (
              <StatusBadge label={r.status} tone={opsStatusTone(r.status)} />
            ),
          },
        ]}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <OpsQueueCard
            title={item.title}
            summary={item.summary}
            status={item.status}
            meta={`${item.exception_key} · ${item.severity ?? "n/a"} · ${item.vertical}`}
          />
        </li>
      ))}
    </ul>
  );
}
