"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";

const REQUEST_TYPES = [
  { id: "access", label: "Access request" },
  { id: "correction", label: "Correction request" },
  { id: "erasure", label: "Erasure / closure request" },
  { id: "restricted_processing", label: "Restricted processing" },
] as const;

/**
 * Privacy request creator — reviewed workflow, not client hard-delete.
 */
export function PrivacyRequestForm() {
  const router = useRouter();
  const [type, setType] =
    useState<(typeof REQUEST_TYPES)[number]["id"]>("access");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function submit() {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create_privacy_request",
          requestType: type,
        }),
      });
      setMsg(
        res.ok
          ? SETTINGS_COPY.privacyRequest
          : "Could not submit request — try again."
      );
      if (res.ok) router.refresh();
    });
  }

  return (
    <SettingsSection
      title="Privacy & data requests"
      description={`${SETTINGS_COPY.noHardDelete} ${SETTINGS_COPY.noDataOwnership}`}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="privacy-type">Request type</Label>
          <select
            id="privacy-type"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={type}
            onChange={(e) =>
              setType(e.target.value as (typeof REQUEST_TYPES)[number]["id"])
            }
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" size="sm" disabled={pending}>
              Submit request
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit privacy request</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Type:{" "}
                    <span className="text-foreground">
                      {REQUEST_TYPES.find((t) => t.id === type)?.label}
                    </span>
                  </p>
                  <p>{SETTINGS_COPY.privacyRequest}</p>
                  <p>{SETTINGS_COPY.noHardDelete}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={submit}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {msg ? (
          <p className="text-xs text-muted-foreground" role="status">
            {msg}
          </p>
        ) : null}
      </div>
    </SettingsSection>
  );
}
