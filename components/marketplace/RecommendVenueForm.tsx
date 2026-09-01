"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

const CATEGORY_HINTS = [
  "Hotel",
  "Restaurant",
  "Coworking Space",
  "Studio",
  "Salon",
  "Gym",
  "Travel Agency",
  "Jeweler",
  "Electronics Business",
  "Other",
];

export function RecommendVenueForm({
  unitId,
  organisationId,
  className,
}: {
  unitId: string;
  organisationId?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [orgId, setOrgId] = useState(organisationId ?? "");
  const [displayName, setDisplayName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription] = useState("");
  const [recommendationNotes, setRecommendationNotes] = useState("");
  const [docLabel, setDocLabel] = useState("Business registration");
  const [docRef, setDocRef] = useState("");
  const [eligibilityNotes, setEligibilityNotes] = useState("");
  const [createdVenueId, setCreatedVenueId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function post(action: string, payload: Record<string, unknown>) {
    const res = await fetch("/api/marketplace/bdp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error?.message || json?.message || "Request failed");
    }
    return json?.data ?? json;
  }

  function submit() {
    setError(null);
    setOk(null);
    startTransition(async () => {
      try {
        const created = await post("create_venue", {
          organisationId: orgId,
          displayName,
          legalName: legalName || undefined,
          city,
          state: state || undefined,
          address: address || undefined,
          category: category || undefined,
          recommendUnitId: unitId,
          recommendationNotes: recommendationNotes || undefined,
          businessProfile: {
            ownerContactName: ownerContact || undefined,
            contactPhone: contactPhone || undefined,
            contactEmail: contactEmail || undefined,
            businessDescription: description || undefined,
          },
        });
        const venueId = String(created?.venue?.id ?? "");
        if (!venueId) throw new Error("Venue created but id missing");

        await post("record_venue_eligibility", {
          venueId,
          result: "eligible",
          notes: eligibilityNotes || "MBDP initial eligibility check completed",
        });

        if (docRef.trim()) {
          await post("record_venue_documents", {
            venueId,
            documents: [{ label: docLabel, referenceNote: docRef.trim() }],
          });
        }

        setCreatedVenueId(venueId);
        setOk(
          "Venue recommended with eligibility and document manifest. Marketplace Ops must final-approve — you cannot self-approve."
        );
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Recommend failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h3 className="text-sm font-semibold">Recommend a Venue</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        MBDP-led onboarding — recommendation, eligibility assist, and document
        manifest only. Platform Marketplace Ops final-approves.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="rec-org">Organisation ID</Label>
          <Input
            id="rec-org"
            className="mt-1 min-h-11"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="rec-name">Venue display name</Label>
            <Input
              id="rec-name"
              className="mt-1 min-h-11"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="rec-legal">Legal business name</Label>
            <Input
              id="rec-legal"
              className="mt-1 min-h-11"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="rec-category">Business type / category</Label>
          <Input
            id="rec-category"
            className="mt-1 min-h-11"
            list="venue-category-hints"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Restaurant, Hotel, Gym"
          />
          <datalist id="venue-category-hints">
            {CATEGORY_HINTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="rec-city">City</Label>
            <Input
              id="rec-city"
              className="mt-1 min-h-11"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="rec-state">State</Label>
            <Input
              id="rec-state"
              className="mt-1 min-h-11"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="rec-address">Address</Label>
          <Input
            id="rec-address"
            className="mt-1 min-h-11"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="rec-owner">Owner / authorized contact</Label>
            <Input
              id="rec-owner"
              className="mt-1 min-h-11"
              value={ownerContact}
              onChange={(e) => setOwnerContact(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rec-phone">Phone</Label>
            <Input
              id="rec-phone"
              className="mt-1 min-h-11"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="rec-email">Email</Label>
          <Input
            id="rec-email"
            type="email"
            className="mt-1 min-h-11"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rec-desc">Business description</Label>
          <Textarea
            id="rec-desc"
            className="mt-1"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rec-elig">Eligibility notes (MBDP assist)</Label>
          <Textarea
            id="rec-elig"
            className="mt-1"
            rows={2}
            value={eligibilityNotes}
            onChange={(e) => setEligibilityNotes(e.target.value)}
            placeholder="Initial eligibility evidence — not final Platform approval"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="rec-doc-label">Document label</Label>
            <Input
              id="rec-doc-label"
              className="mt-1 min-h-11"
              value={docLabel}
              onChange={(e) => setDocLabel(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rec-doc-ref">Document reference</Label>
            <Input
              id="rec-doc-ref"
              className="mt-1 min-h-11"
              value={docRef}
              onChange={(e) => setDocRef(e.target.value)}
              placeholder="Secure reference / case ID — not a file upload"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="rec-notes">Recommendation notes</Label>
          <Textarea
            id="rec-notes"
            className="mt-1"
            rows={2}
            value={recommendationNotes}
            onChange={(e) => setRecommendationNotes(e.target.value)}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="mt-3 text-sm text-success" role="status">
          {ok}
          {createdVenueId ? (
            <>
              {" "}
              Venue ID: <span className="font-mono text-xs">{createdVenueId}</span>
            </>
          ) : null}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4 min-h-11"
        disabled={pending || !orgId || !displayName || !city}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Submit recommendation"}
      </Button>
    </div>
  );
}
