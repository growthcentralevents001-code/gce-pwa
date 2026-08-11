"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/settings/SettingsSection";

/**
 * Personal profile form — displayName + phone via /api/identity/me.
 * Does not edit business/org verification fields.
 */
export function ProfileSettingsForm({
  initialDisplayName,
  initialPhone,
  email,
}: {
  initialDisplayName: string;
  initialPhone: string;
  email: string | null;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [phone, setPhone] = useState(initialPhone);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setMsg(null);
      setError(null);
      const res = await fetch("/api/identity/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
          phone: phone.trim() || null,
        }),
      });
      if (!res.ok) {
        setError("Could not save profile.");
        return;
      }
      setMsg("Profile saved.");
      router.refresh();
    });
  }

  return (
    <SettingsSection
      title="Personal profile"
      description="Profile is not a role. Business/org details live in the relevant workspace."
      footer={
        <Button type="submit" form="profile-form" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      }
    >
      <form id="profile-form" className="space-y-4" onSubmit={save}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Primary email</Label>
          <Input id="email" value={email ?? ""} disabled readOnly />
          <p className="text-xs text-muted-foreground">
            Email is managed by authentication — not editable here.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={120}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={32}
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {msg ? (
          <p className="text-sm text-muted-foreground" role="status">
            {msg}
          </p>
        ) : null}
      </form>
    </SettingsSection>
  );
}
