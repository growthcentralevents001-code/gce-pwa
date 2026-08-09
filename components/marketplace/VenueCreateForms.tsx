"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  OFFER_CUSTOMER_CAP,
  OFFER_MIN_PLANNED_VALUE_MINOR,
  plannedSaleValueNote,
  offerCampaignRulesNote,
} from "@/lib/frontend/marketplace/format";
import { cn } from "@/lib/utils";

export function CreateEventForm({
  venueId,
  className,
}: {
  venueId: string;
  className?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [priceRupees, setPriceRupees] = useState("0");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(andSubmit: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        const priceMinor = Math.round(Number(priceRupees || 0) * 100);
        const res = await fetch("/api/marketplace/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_event",
            venueId,
            title,
            startsAt: new Date(startsAt).toISOString(),
            capacity: Number(capacity) || 0,
            priceMinor,
            description: description || undefined,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Create failed");
        }
        const eventId = json?.data?.event?.id ?? json?.event?.id;
        if (andSubmit && eventId) {
          const sub = await fetch("/api/marketplace/bdp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "submit_event", eventId }),
          });
          const subJson = await sub.json().catch(() => ({}));
          if (!sub.ok) {
            throw new Error(
              subJson?.error?.message || "Created but submit for review failed"
            );
          }
        }
        router.push("/venue/events");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Create failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5 space-y-3", className)}>
      <h3 className="text-sm font-semibold">Create Event</h3>
      <p className="text-xs text-muted-foreground">
        Marketplace BDP may recommend; Platform Marketplace Ops final-approves.
        Venue cannot self-approve publication.
      </p>
      <div>
        <Label htmlFor="evTitle">Title</Label>
        <Input id="evTitle" className="mt-1 min-h-11" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="evStart">Starts at</Label>
        <Input id="evStart" type="datetime-local" className="mt-1 min-h-11" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="evCap">Capacity</Label>
          <Input id="evCap" className="mt-1 min-h-11" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="evPrice">Ticket price (₹)</Label>
          <Input id="evPrice" className="mt-1 min-h-11" value={priceRupees} onChange={(e) => setPriceRupees(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="evDesc">Description</Label>
        <Textarea id="evDesc" className="mt-1" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" className="min-h-11" disabled={pending || !title || !startsAt} onClick={() => submit(false)}>
          Save draft
        </Button>
        <Button type="button" variant="outline" className="min-h-11" disabled={pending || !title || !startsAt} onClick={() => submit(true)}>
          Save & submit for review
        </Button>
      </div>
    </div>
  );
}

export function CreateOfferForm({
  venueId,
  className,
}: {
  venueId: string;
  className?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [plannedRupees, setPlannedRupees] = useState("50000");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [cap, setCap] = useState(String(OFFER_CUSTOMER_CAP));
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const plannedCommercialValueMinor = Math.round(
          Number(plannedRupees || 0) * 100
        );
        if (plannedCommercialValueMinor < OFFER_MIN_PLANNED_VALUE_MINOR) {
          throw new Error("Planned sale value must be at least ₹50,000");
        }
        const res = await fetch("/api/marketplace/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_offer",
            venueId,
            title,
            plannedCommercialValueMinor,
            campaignStartsAt: new Date(start).toISOString(),
            campaignEndsAt: new Date(end).toISOString(),
            customerCap: Math.min(
              OFFER_CUSTOMER_CAP,
              Math.max(1, Number(cap) || 1)
            ),
            description: description || undefined,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Create failed");
        }
        router.push("/venue/offers");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Create failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5 space-y-3", className)}>
      <h3 className="text-sm font-semibold">Create Offer Event</h3>
      <p className="text-xs text-muted-foreground">{plannedSaleValueNote()}</p>
      <p className="text-xs text-muted-foreground">{offerCampaignRulesNote()}</p>
      <div>
        <Label htmlFor="ofTitle">Title</Label>
        <Input id="ofTitle" className="mt-1 min-h-11" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="ofPlanned">Expected/planned sale value (₹)</Label>
        <Input id="ofPlanned" className="mt-1 min-h-11" value={plannedRupees} onChange={(e) => setPlannedRupees(e.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="ofStart">Campaign start</Label>
          <Input id="ofStart" type="datetime-local" className="mt-1 min-h-11" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ofEnd">Campaign end</Label>
          <Input id="ofEnd" type="datetime-local" className="mt-1 min-h-11" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="ofCap">Customer cap (max {OFFER_CUSTOMER_CAP})</Label>
        <Input id="ofCap" className="mt-1 min-h-11" value={cap} onChange={(e) => setCap(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="ofDesc">Description</Label>
        <Textarea id="ofDesc" className="mt-1" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <Button type="button" className="min-h-11" disabled={pending || !title || !start || !end} onClick={submit}>
        {pending ? "Creating…" : "Create offer (pending Platform approval)"}
      </Button>
    </div>
  );
}
