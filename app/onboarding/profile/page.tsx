"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { OnboardingStepper } from "@/components/auth/OnboardingStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageSkeleton } from "@/components/states/LoadingSkeletons";
import { FeatureGated } from "@/components/states/FeatureGated";

const STEPS = [
  { id: "account", label: "Account" },
  { id: "profile", label: "Profile" },
  { id: "intent", label: "Intent" },
  { id: "review", label: "Review" },
];

/**
 * AUTH-06 Profile completion — Batch 1.
 * Saves profile via /api/identity/me PATCH. Does not grant roles.
 */
export default function OnboardingProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState("explore");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/identity/me");
        if (res.status === 401) {
          router.replace("/login?next=/onboarding/profile");
          return;
        }
        if (!res.ok) throw new Error("Failed to load identity");
        const json = await res.json();
        const profile = json?.profile ?? json?.data?.profile;
        if (!cancelled) {
          setDisplayName(profile?.displayName || "");
          setPhone(profile?.phone || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Load failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function saveProfile() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/identity/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName || null,
          phone: phone || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || "Save failed");
      }
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AuthPanel title="Onboarding" description="Loading your profile…">
        <PageSkeleton />
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title="Complete your profile"
      description="Tell us how to address you. This does not activate memberships or partner roles."
    >
      <OnboardingStepper steps={STEPS} currentIndex={step} className="mb-6" />

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              autoComplete="nickname"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <FeatureGated
            mode="disabled_in_environment"
            title="KYC documents later"
            description="Aadhaar is not mandatory. Fit-for-purpose KYC happens in membership flows when required — not as a signup gate."
          />
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => router.push("/dashboard/personal")}
            >
              Skip for now
            </Button>
            <Button
              type="button"
              className="min-h-11 flex-1"
              disabled={saving}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            What brings you to GCE? This is intent only.
          </p>
          <div className="space-y-2">
            {[
              ["explore", "Explore Events & Offers"],
              ["connect-member", "Join Connect as a member"],
              ["partner", "Partner / BDP / Venue interest"],
              ["enterprise", "Enterprise inquiry"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="intent"
                  value={value}
                  checked={intent === value}
                  onChange={() => setIntent(value)}
                  className="accent-[hsl(var(--primary))]"
                />
                {label}
              </label>
            ))}
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              className="min-h-11 flex-1"
              disabled={saving}
              onClick={saveProfile}
            >
              {saving ? "Saving…" : "Save & continue"}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Profile saved. Your selected intent ({intent}) is recorded for
              guidance only — no role was granted.
            </AlertDescription>
          </Alert>
          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={() => router.push("/dashboard/personal")}
          >
            Enter personal workspace
          </Button>
          {intent === "connect-member" ? (
            <Button asChild variant="outline" className="min-h-11 w-full">
              <a href="/memberships">View memberships</a>
            </Button>
          ) : null}
          {intent === "partner" ? (
            <Button asChild variant="outline" className="min-h-11 w-full">
              <a href="/apply/role">Partner pathways</a>
            </Button>
          ) : null}
        </div>
      )}
    </AuthPanel>
  );
}
