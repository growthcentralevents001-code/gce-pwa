"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/states/StatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export type InboxItem = {
  id: string;
  title: string;
  body?: string | null;
  deep_link?: string | null;
  read_at?: string | null;
  created_at?: string;
  notification_type?: string | null;
};

export function NotificationInbox({
  items,
  unread,
}: {
  items: InboxItem[];
  unread: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function markAll() {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "mark_read" }),
      });
      setMsg(res.ok ? "Marked read" : "Could not mark read");
      router.refresh();
    });
  }

  function markOne(id: string) {
    startTransition(async () => {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "mark_read", notificationId: id }),
      });
      router.refresh();
    });
  }

  return (
    <SettingsSection
      title="In-app inbox"
      description={`Unread: ${unread}. Counts come from the server — not fabricated.`}
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending || unread === 0}
            onClick={markAll}
          >
            Mark all read
          </Button>
          {msg ? (
            <p className="text-xs text-muted-foreground" role="status">
              {msg}
            </p>
          ) : null}
        </div>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="When in-app notices arrive, they appear here."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn(
                GCE_RADIUS.control,
                GCE_SURFACE.muted,
                "p-3 text-sm"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium">{n.title}</p>
                <StatusBadge
                  label={n.read_at ? "read" : "unread"}
                  tone={n.read_at ? "neutral" : "pending"}
                />
              </div>
              {n.body ? (
                <p className="mt-1 text-muted-foreground">{n.body}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {n.deep_link ? (
                  <Link
                    href={n.deep_link}
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open
                  </Link>
                ) : null}
                {!n.read_at ? (
                  <button
                    type="button"
                    className="text-muted-foreground underline-offset-4 hover:underline"
                    onClick={() => markOne(n.id)}
                    disabled={pending}
                  >
                    Mark read
                  </button>
                ) : null}
                <span className="text-muted-foreground">
                  {n.notification_type ?? "notice"}
                  {n.created_at ? ` · ${n.created_at}` : ""}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SettingsSection>
  );
}
