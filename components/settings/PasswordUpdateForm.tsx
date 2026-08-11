"use client";

import { useState, useTransition } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";

/**
 * Password update via Supabase Auth (session required).
 * No client-side password storage.
 */
export function PasswordUpdateForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    startTransition(async () => {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message || "Could not update password.");
        return;
      }
      setPassword("");
      setConfirm("");
      setMsg("Password updated.");
    });
  }

  return (
    <SettingsSection
      title="Password"
      description="Uses your current authenticated session. Prefer a password reset email if you are signed out."
    >
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
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
      <p className="mt-4 text-xs text-muted-foreground">{SETTINGS_COPY.noMfa}</p>
    </SettingsSection>
  );
}

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      await supabase.auth.signOut();
      window.location.href = "/login";
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={signOut}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
