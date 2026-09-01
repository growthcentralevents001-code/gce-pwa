"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  VENUE_RELATIONSHIP_STATUSES,
  type VenueRelationshipState,
} from "@/lib/architecture/marketplace/relationship";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  engaged: "Engaged",
  onboarding: "Onboarding",
  active_partnership: "Active partnership",
  needs_attention: "Needs attention",
  dormant: "Dormant",
};

function toLocalDatetimeValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalDatetimeValue(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function VenueRelationshipPanel({
  attributionId,
  venueName,
  venueStatus,
  attributionStatus,
  relationship,
  recentActivity,
}: {
  attributionId: string;
  venueName: string;
  venueStatus: string;
  attributionStatus: string;
  relationship: VenueRelationshipState;
  recentActivity: Array<{ label: string; at: string }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [relationshipStatus, setRelationshipStatus] = useState(
    relationship.relationshipStatus ?? ""
  );
  const [lastInteractionAt, setLastInteractionAt] = useState(
    toLocalDatetimeValue(relationship.lastInteractionAt)
  );
  const [lastInteractionNote, setLastInteractionNote] = useState(
    relationship.lastInteractionNote ?? ""
  );
  const [nextFollowUpAt, setNextFollowUpAt] = useState(
    toLocalDatetimeValue(relationship.nextFollowUpAt)
  );
  const [supportRequired, setSupportRequired] = useState(
    relationship.supportRequired ?? false
  );
  const [supportNote, setSupportNote] = useState(relationship.supportNote ?? "");

  const hasRelationshipData =
    Boolean(relationship.relationshipStatus) ||
    Boolean(relationship.lastInteractionAt) ||
    Boolean(relationship.nextFollowUpAt) ||
    relationship.supportRequired === true;

  function save() {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/marketplace/bdp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "update_venue_relationship",
          attributionId,
          relationshipStatus: relationshipStatus || undefined,
          lastInteractionAt: fromLocalDatetimeValue(lastInteractionAt),
          lastInteractionNote: lastInteractionNote.trim() || null,
          nextFollowUpAt: fromLocalDatetimeValue(nextFollowUpAt),
          supportRequired,
          supportNote: supportNote.trim() || null,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(body?.error?.message ?? "Could not save relationship notes");
        return;
      }
      setMsg("Saved");
      router.refresh();
    });
  }

  return (
    <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} space-y-5 p-5`}>
      <div>
        <h2 className="text-base font-semibold">Venue relationship</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lightweight notes for {venueName}. Does not change attribution or assignment authority.
        </p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Venue status</dt>
          <dd className="font-medium">{venueStatus}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Attribution</dt>
          <dd className="font-medium">{attributionStatus}</dd>
        </div>
        {relationship.updatedAt ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Last updated</dt>
            <dd className="font-medium">
              {new Date(relationship.updatedAt).toLocaleString()}
            </dd>
          </div>
        ) : null}
      </dl>

      {!hasRelationshipData ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
          No relationship notes yet. Add your first follow-up below.
        </p>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rel-status">Relationship status</Label>
          <select
            id="rel-status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={relationshipStatus}
            onChange={(e) => setRelationshipStatus(e.target.value)}
            disabled={pending}
          >
            <option value="">Select status</option>
            {VENUE_RELATIONSHIP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="last-interaction">Last interaction</Label>
            <Input
              id="last-interaction"
              type="datetime-local"
              value={lastInteractionAt}
              onChange={(e) => setLastInteractionAt(e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next-follow-up">Next follow-up</Label>
            <Input
              id="next-follow-up"
              type="datetime-local"
              value={nextFollowUpAt}
              onChange={(e) => setNextFollowUpAt(e.target.value)}
              disabled={pending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interaction-note">Interaction note</Label>
          <Textarea
            id="interaction-note"
            value={lastInteractionNote}
            onChange={(e) => setLastInteractionNote(e.target.value)}
            maxLength={1000}
            rows={3}
            disabled={pending}
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
          <div>
            <p className="text-sm font-medium">Support required</p>
            <p className="text-xs text-muted-foreground">
              Flag when Platform Ops support is needed for this Venue.
            </p>
          </div>
          <Switch
            checked={supportRequired}
            onCheckedChange={setSupportRequired}
            disabled={pending}
            aria-label="Support required"
          />
        </div>

        {supportRequired ? (
          <div className="space-y-2">
            <Label htmlFor="support-note">Support note</Label>
            <Textarea
              id="support-note"
              value={supportNote}
              onChange={(e) => setSupportNote(e.target.value)}
              maxLength={1000}
              rows={2}
              disabled={pending}
            />
          </div>
        ) : null}

        <Button type="button" onClick={save} disabled={pending} className="min-h-11">
          {pending ? "Saving…" : "Save relationship notes"}
        </Button>
        {msg ? (
          <p className="text-xs text-muted-foreground" role="status">
            {msg}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="text-sm font-semibold">Recent Marketplace activity</h3>
        {recentActivity.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No recent events or offers for this Venue.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {recentActivity.map((item) => (
              <li key={`${item.label}-${item.at}`} className="flex justify-between gap-2">
                <span>{item.label}</span>
                <time className="shrink-0 text-muted-foreground">
                  {new Date(item.at).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
