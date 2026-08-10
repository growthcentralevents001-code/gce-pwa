import { EmptyState } from "@/components/states/EmptyState";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { StatusBadge } from "@/components/states/StatusBadge";
import { opsStatusTone } from "@/lib/frontend/ops/format";

export type ModerationRow = {
  id: string;
  subject_type: string;
  subject_id: string;
  action: string;
  reason: string;
  actor_user_id?: string | null;
  created_at?: string;
};

/**
 * Moderation history / review surface.
 * Actions that mutate content go through backend applyModerationAction only.
 */
export function ModerationReviewList({ items }: { items: ModerationRow[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No moderation actions"
        description="Moderation requires the ops_moderation flag and scoped permission. Arbitrary deletion is not available."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <OpsQueueCard
            title={`${item.subject_type} · ${item.subject_id.slice(0, 8)}…`}
            summary={item.reason}
            status={item.action}
            meta={item.created_at ?? undefined}
            actions={
              <StatusBadge
                label={item.action}
                tone={opsStatusTone(item.action)}
              />
            }
          />
        </li>
      ))}
    </ul>
  );
}
