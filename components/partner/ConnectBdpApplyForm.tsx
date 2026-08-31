"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GCE_RADIUS,
  GCE_SURFACE,
} from "@/lib/frontend/design-language";
import { packageOptionLabel } from "@/lib/frontend/partner/format";
import { cn } from "@/lib/utils";
import type { ConnectBdpApplicationFields } from "@/lib/architecture/connect-bdp/application";

const OPTIONS = [
  {
    id: "direct_50000" as const,
    title: "Direct",
    detail: "₹50,000 upfront per Franchise Unit",
  },
  {
    id: "finance_recovery_60000" as const,
    title: "Commission-Recovery Finance",
    detail: "₹60,000 total · ₹5,000 initial · ₹55,000 recoverable (max ₹5,000/cycle)",
  },
];

export type ConnectBdpApplyPrefill = {
  fullName?: string;
  mobile?: string;
  email?: string;
};

export function ConnectBdpApplyForm({
  className,
  prefill,
}: {
  className?: string;
  prefill?: ConnectBdpApplyPrefill;
}) {
  const router = useRouter();
  const [option, setOption] = useState<(typeof OPTIONS)[number]["id"]>(
    "finance_recovery_60000"
  );
  const [fullName, setFullName] = useState(prefill?.fullName ?? "");
  const [mobile, setMobile] = useState(prefill?.mobile ?? "");
  const [email] = useState(prefill?.email ?? "");
  const [city, setCity] = useState("");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [experience, setExperience] = useState("");
  const [reasonForApplying, setReasonForApplying] = useState("");
  const [communityBuildingAbility, setCommunityBuildingAbility] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    if (!consentAccepted) {
      setError("You must accept the application terms to continue.");
      return;
    }

    const application: ConnectBdpApplicationFields = {
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      city: city.trim(),
      professionalBackground: professionalBackground.trim(),
      currentOccupation: currentOccupation.trim(),
      experience: experience.trim(),
      reasonForApplying: reasonForApplying.trim(),
      communityBuildingAbility: communityBuildingAbility.trim(),
      consentAccepted: true,
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/connect/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "apply", packageOption: option, application }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Application failed");
        }
        router.push("/connect-bdp/unit");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Application failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold">Applicant details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-full-name">Full name</Label>
            <Input
              id="cbdp-full-name"
              className="min-h-11"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cbdp-mobile">Mobile</Label>
            <Input
              id="cbdp-mobile"
              type="tel"
              className="min-h-11"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cbdp-email">Email</Label>
            <Input
              id="cbdp-email"
              type="email"
              className="min-h-11 bg-muted/50"
              value={email}
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-city">City</Label>
            <Input
              id="cbdp-city"
              className="min-h-11"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              autoComplete="address-level2"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-background">Professional / business background</Label>
            <Textarea
              id="cbdp-background"
              value={professionalBackground}
              onChange={(e) => setProfessionalBackground(e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-occupation">Current occupation / business</Label>
            <Input
              id="cbdp-occupation"
              className="min-h-11"
              value={currentOccupation}
              onChange={(e) => setCurrentOccupation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-experience">Experience</Label>
            <Textarea
              id="cbdp-experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              rows={2}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-reason">Reason for applying</Label>
            <Textarea
              id="cbdp-reason"
              value={reasonForApplying}
              onChange={(e) => setReasonForApplying(e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cbdp-community">
              Ability to build a business community
            </Label>
            <Textarea
              id="cbdp-community"
              value={communityBuildingAbility}
              onChange={(e) => setCommunityBuildingAbility(e.target.value)}
              required
              rows={3}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-semibold">Package option</legend>
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              "flex cursor-pointer gap-3 rounded-xl border p-3 touch-manipulation",
              option === opt.id
                ? "border-primary bg-orange-50/80 dark:bg-orange-950/30"
                : "border-border"
            )}
          >
            <input
              type="radio"
              name="packageOption"
              className="mt-1"
              checked={option === opt.id}
              onChange={() => setOption(opt.id)}
            />
            <span>
              <span className="block text-sm font-medium">{opt.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {opt.detail}
              </span>
              <span className="sr-only">{packageOptionLabel(opt.id)}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="mt-5 flex cursor-pointer gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
        />
        <span className="text-muted-foreground">
          I confirm the information provided is accurate. I understand Connect BDP
          is an independent commercial partner role requiring platform approval —
          not employment, and payment does not activate the unit.
        </span>
      </label>

      <p className="mt-4 text-xs text-muted-foreground">
        Connect BDP operates a Franchise Unit under platform assignment. Platform
        Ops reviews applications — you cannot self-approve or self-assign territory.
      </p>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4 min-h-11 w-full sm:w-auto"
        disabled={pending}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </div>
  );
}
