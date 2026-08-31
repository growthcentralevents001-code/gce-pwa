"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OnboardingStepper } from "@/components/auth/OnboardingStepper";
import { TagChip } from "@/components/connect/TagChip";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ASSOCIATE_TAG_CATALOG,
  type AssociateTagCatalogEntry,
} from "@/lib/architecture/connect/tagCatalog";
import { MAX_TAGS } from "@/lib/frontend/connect/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "geo", label: "Geography" },
  { id: "specialisation", label: "Specialisation" },
  { id: "tags", label: "Tags" },
  { id: "seat", label: "Seat check" },
  { id: "review", label: "Review" },
] as const;

type Specialisation = {
  id: string;
  code: string;
  label: string;
  powerSector: string | null;
};

type SeatMatch = {
  circleId: string;
  name: string;
  city: string;
  state: string | null;
  remaining: number;
  canAccept: boolean;
};

type SelectedTag = {
  slot: number;
  tagKey: string;
  tagLabel: string;
};

function apiErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const err = (json as { error?: { message?: string }; message?: string }).error;
  if (err?.message) return err.message;
  const msg = (json as { message?: string }).message;
  return msg || fallback;
}

export type MembershipApplyPrefill = {
  memberName?: string;
  phone?: string;
  email?: string;
};

/**
 * FD-036 Associate application wizard — creates draft and submits for review.
 * Live purchase remains gated OFF (membership_associate_purchase).
 */
export function MembershipApplyWizard({
  prefill,
}: {
  prefill?: MembershipApplyPrefill;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [memberName, setMemberName] = useState(prefill?.memberName ?? "");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [email] = useState(prefill?.email ?? "");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [websiteOrSocial, setWebsiteOrSocial] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [preferredState, setPreferredState] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [preferredDistrict, setPreferredDistrict] = useState("");
  const [preferredLocality, setPreferredLocality] = useState("");

  const [specialisations, setSpecialisations] = useState<Specialisation[]>([]);
  const [specialisationId, setSpecialisationId] = useState<string | null>(null);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  const [catalog, setCatalog] = useState<AssociateTagCatalogEntry[]>([
    ...ASSOCIATE_TAG_CATALOG,
  ]);
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);

  const [seatLoading, setSeatLoading] = useState(false);
  const [seatMatches, setSeatMatches] = useState<SeatMatch[]>([]);
  const [seatNote, setSeatNote] = useState("");
  const [seatNoMatch, setSeatNoMatch] = useState(false);

  const selectedSpec = useMemo(
    () => specialisations.find((s) => s.id === specialisationId) ?? null,
    [specialisations, specialisationId]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [specRes, tagRes] = await Promise.all([
          fetch("/api/connect/specialisations"),
          fetch("/api/connect/tag-catalog"),
        ]);
        const specJson = await specRes.json().catch(() => ({}));
        const tagJson = await tagRes.json().catch(() => ({}));
        if (!cancelled) {
          if (specRes.ok && Array.isArray(specJson.specialisations)) {
            setSpecialisations(specJson.specialisations);
          }
          if (tagRes.ok && Array.isArray(tagJson.tags)) {
            setCatalog(tagJson.tags);
          }
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load specialisations. Refresh and try again.");
        }
      } finally {
        if (!cancelled) setLoadingSpecs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runSeatCheck = useCallback(async () => {
    setSeatLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        city: preferredCity.trim(),
        state: preferredState.trim(),
      });
      if (preferredDistrict.trim()) {
        params.set("district", preferredDistrict.trim());
      }
      if (preferredLocality.trim()) {
        params.set("locality", preferredLocality.trim());
      }
      if (specialisationId) {
        params.set("specialisationId", specialisationId);
      }
      const res = await fetch(`/api/connect/seat-check?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(apiErrorMessage(json, "Seat check failed"));
      }
      setSeatMatches(Array.isArray(json.matches) ? json.matches : []);
      setSeatNoMatch(Boolean(json.noMatch));
      setSeatNote(
        typeof json.advisoryNote === "string"
          ? json.advisoryNote
          : "Advisory seat check complete."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Seat check failed");
      setSeatMatches([]);
      setSeatNoMatch(true);
      setSeatNote(
        "Seat check could not complete. You can still save a draft — Platform Ops will route later."
      );
    } finally {
      setSeatLoading(false);
    }
  }, [
    preferredCity,
    preferredState,
    preferredDistrict,
    preferredLocality,
    specialisationId,
  ]);

  function toggleCatalogTag(entry: AssociateTagCatalogEntry) {
    setSelectedTags((prev) => {
      const existing = prev.find((t) => t.tagKey === entry.key);
      if (existing) {
        return prev
          .filter((t) => t.tagKey !== entry.key)
          .map((t, i) => ({ ...t, slot: i + 1 }));
      }
      if (prev.length >= MAX_TAGS) return prev;
      return [
        ...prev,
        { slot: prev.length + 1, tagKey: entry.key, tagLabel: entry.label },
      ];
    });
  }

  function canAdvance(): boolean {
    if (step === 0) {
      return Boolean(
        preferredState.trim() &&
          preferredCity.trim() &&
          memberName.trim() &&
          businessName.trim() &&
          phone.trim() &&
          email.trim() &&
          businessDescription.trim()
      );
    }
    if (step === 1) {
      return Boolean(specialisationId);
    }
    return true;
  }

  async function goNext() {
    setError("");
    if (!canAdvance()) {
      setError(
        step === 0
          ? "Complete geography and business profile fields."
          : "Choose a business specialisation."
      );
      return;
    }
    if (step === 2) {
      // Entering seat check
      setStep(3);
      await runSeatCheck();
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  async function submitApplication() {
    if (!specialisationId) {
      setError("Specialisation is required.");
      return;
    }
    if (!consentAccepted) {
      setError("You must accept the application terms to submit.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/connect/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialisationId,
          preferredState: preferredState.trim(),
          preferredCity: preferredCity.trim(),
          preferredDistrict: preferredDistrict.trim() || null,
          preferredLocality: preferredLocality.trim() || null,
          application: {
            memberName: memberName.trim(),
            businessName: businessName.trim(),
            businessDescription: businessDescription.trim(),
            phone: phone.trim(),
            email: email.trim(),
            businessAddress: businessAddress.trim() || null,
            websiteOrSocial: websiteOrSocial.trim() || null,
            consentAccepted: true as const,
          },
          submit: true,
          tags: selectedTags.map((t) => ({
            slot: t.slot,
            tagKey: t.tagKey,
            tagLabel: t.tagLabel,
          })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(apiErrorMessage(json, "Failed to submit application"));
      }
      router.push("/connect/membership");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit application");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <OnboardingStepper steps={[...STEPS]} currentIndex={step} />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {step === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Where should we look for a Circle? Geography is used for advisory
            routing before purchase (FD-036).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferredState">State *</Label>
              <Input
                id="preferredState"
                value={preferredState}
                onChange={(e) => setPreferredState(e.target.value)}
                autoComplete="address-level1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredCity">City *</Label>
              <Input
                id="preferredCity"
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredDistrict">District</Label>
              <Input
                id="preferredDistrict"
                value={preferredDistrict}
                onChange={(e) => setPreferredDistrict(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredLocality">Locality</Label>
              <Input
                id="preferredLocality"
                value={preferredLocality}
                onChange={(e) => setPreferredLocality(e.target.value)}
              />
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-sm font-medium">Business profile</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="memberName">Your name *</Label>
                <Input
                  id="memberName"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="businessName">Business name *</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-muted/50"
                  aria-readonly="true"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="businessAddress">Business address</Label>
                <Input
                  id="businessAddress"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  autoComplete="street-address"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="businessDescription">Business description *</Label>
                <Textarea
                  id="businessDescription"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="websiteOrSocial">Website / social link</Label>
                <Input
                  id="websiteOrSocial"
                  value={websiteOrSocial}
                  onChange={(e) => setWebsiteOrSocial(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose one primary business specialisation. Platform rules decide
            final eligibility — this UI only captures your preference.
          </p>
          {loadingSpecs ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {specialisations.map((spec) => {
                const selected = specialisationId === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setSpecialisationId(spec.id)}
                    className={cn(
                      GCE_RADIUS.card,
                      GCE_SURFACE.card,
                      "border-l-4 p-4 text-left transition-colors",
                      selected
                        ? "border-l-primary ring-1 ring-primary/40"
                        : "border-l-border hover:border-l-primary/60"
                    )}
                    aria-pressed={selected}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {spec.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {spec.code.replaceAll("_", " ")}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select up to {MAX_TAGS} Tags from the catalog. Slots 1–2 are included
            with Associate; slots 3–4 add a surcharge when purchase goes live.
          </p>
          <div className="flex flex-wrap gap-2">
            {catalog.map((entry) => {
              const selected = selectedTags.some((t) => t.tagKey === entry.key);
              const slot =
                selectedTags.find((t) => t.tagKey === entry.key)?.slot ??
                selectedTags.length + 1;
              return (
                <TagChip
                  key={entry.key}
                  slot={selected ? slot : Math.min(slot, MAX_TAGS)}
                  label={entry.label}
                  selected={selected}
                  showPricing={selected}
                  disabled={!selected && selectedTags.length >= MAX_TAGS}
                  onToggle={() => toggleCatalogTag(entry)}
                />
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {selectedTags.length} / {MAX_TAGS}
            {selectedTags.length
              ? ` — ${selectedTags.map((t) => t.tagLabel).join(", ")}`
              : " (optional for draft)"}
          </p>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Advisory seat check for {preferredCity}, {preferredState}
            {selectedSpec ? ` · ${selectedSpec.label}` : ""}.
          </p>
          {seatLoading ? (
            <p className="text-sm text-muted-foreground">Checking Circles…</p>
          ) : (
            <>
              <Alert>
                <AlertDescription>{seatNote}</AlertDescription>
              </Alert>
              {seatNoMatch || seatMatches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No Circle matched yet. You can continue and save a draft.
                </p>
              ) : (
                <ul className="space-y-3">
                  {seatMatches.map((m) => (
                    <li
                      key={m.circleId}
                      className={cn(
                        GCE_RADIUS.card,
                        GCE_SURFACE.card,
                        "flex flex-wrap items-center justify-between gap-2 p-4"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.city}
                          {m.state ? `, ${m.state}` : ""}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {m.canAccept
                          ? `${m.remaining} seats remaining (advisory)`
                          : "No remaining capacity (advisory)"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => void runSeatCheck()}
                disabled={seatLoading}
              >
                Re-check
              </Button>
            </>
          )}
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          <div
            className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "space-y-3 p-5")}
          >
            <h3 className="text-sm font-semibold">Application summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Geography</dt>
                <dd className="text-right">
                  {preferredCity}, {preferredState}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Specialisation</dt>
                <dd className="text-right">
                  {selectedSpec?.label ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tags</dt>
                <dd className="text-right">
                  {selectedTags.length
                    ? selectedTags.map((t) => t.tagLabel).join(", ")
                    : "None"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Business</dt>
                <dd className="text-right">{businessName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Seat check</dt>
                <dd className="text-right">
                  {seatNoMatch
                    ? "No match (draft OK)"
                    : `${seatMatches.length} advisory match(es)`}
                </dd>
              </div>
            </dl>
          </div>
          <label className="flex cursor-pointer gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
            />
            <span className="text-muted-foreground">
              I confirm the information is accurate. I understand membership
              activation, payment, and Circle seat allocation are separate
              platform steps (FD-036).
            </span>
          </label>
          <p className="text-xs text-muted-foreground">
            Submitting sends your application for platform review. Online
            Associate purchase is not live — payment is not collected here.
          </p>
          <FeatureGated
            mode="disabled_in_environment"
            title="Associate purchase not live"
            description="Payment collection for Associate Membership remains OFF. Save your draft now; pay when purchase is enabled."
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={goBack}
              disabled={saving || seatLoading}
            >
              Back
            </Button>
          ) : (
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/memberships">Cancel</Link>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              className="min-h-11"
              onClick={() => void goNext()}
              disabled={saving || seatLoading || (step === 1 && loadingSpecs)}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              className="min-h-11"
              onClick={() => void submitApplication()}
              disabled={saving}
            >
              {saving ? "Submitting…" : "Submit application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
