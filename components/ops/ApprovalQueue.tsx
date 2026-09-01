import { EmptyState } from "@/components/states/EmptyState";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { ApprovalActions } from "@/components/ops/ApprovalActions";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { opsStatusTone } from "@/lib/frontend/ops/format";

export type ApprovalQueueItem = {
  id: string;
  title: string;
  queue_key: string;
  vertical: string;
  status: string;
  subject_type: string;
  subject_id: string;
  requester_user_id?: string | null;
  created_at?: string;
};

/**
 * Shared approval queue — filters via page query params; no bulk approve.
 */
export function ApprovalQueue({
  items,
  actorUserId,
  showActions = true,
  dense = false,
}: {
  items: ApprovalQueueItem[];
  actorUserId?: string | null;
  showActions?: boolean;
  dense?: boolean;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No pending approvals"
        description="Queue is empty for this scope. Domain approve services remain source of truth."
      />
    );
  }

  if (dense) {
    return (
      <PartnerDataTable
        rows={items}
        mobileTitle={(r) => r.title}
        empty={null}
        columns={[
          {
            id: "title",
            header: "Title",
            cell: (r) => r.title,
          },
          {
            id: "queue",
            header: "Queue",
            cell: (r) => r.queue_key,
            hideOnMobile: true,
          },
          {
            id: "vertical",
            header: "Vertical",
            cell: (r) => r.vertical,
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
            status={item.status}
            meta={`${item.queue_key} · ${item.vertical} · ${item.subject_type}:${item.subject_id.slice(0, 8)}…`}
            actions={
              showActions ? (
                <div className="flex flex-col gap-2 sm:items-end">
                  {item.subject_type === "marketplace_venue" ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/ops/marketplace/venues/${item.subject_id}`}>
                        Open venue review
                      </Link>
                    </Button>
                  ) : null}
                  <ApprovalActions
                    approvalId={item.id}
                    title={item.title}
                    actorUserId={actorUserId}
                    requesterUserId={item.requester_user_id}
                  />
                </div>
              ) : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
