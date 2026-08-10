"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { COMPLIANCE_SAFE_COPY } from "@/lib/frontend/ops/format";

export function ComplianceHoldActions({
  holdId,
  subjectLabel,
  canRelease,
}: {
  holdId: string;
  subjectLabel: string;
  canRelease: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  if (!canRelease) return null;

  function release() {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/ops/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "release_hold",
          holdId,
        }),
      });
      setMsg(res.ok ? "Release recorded" : "Release failed — check permission");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="sm" variant="outline" disabled={pending}>
            Request release
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release compliance hold</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Entity:{" "}
                  <span className="text-foreground">{subjectLabel}</span>
                </p>
                <p>
                  Consequence: Active hold will be released through the audited
                  backend process. This is not a generic toggle.
                </p>
                <p className="text-xs">
                  {COMPLIANCE_SAFE_COPY.notLegalDetermination}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={release}>
              Confirm release
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

export function CreateComplianceHoldForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [subjectType, setSubjectType] = useState("organisation");
  const [subjectId, setSubjectId] = useState("");
  const [reason, setReason] = useState("");

  if (!enabled) return null;

  function submit() {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/ops/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create_hold",
          subjectType,
          subjectId,
          reason,
        }),
      });
      setMsg(
        res.ok
          ? "Hold created (active)"
          : "Failed — reason, permission, or feature flag"
      );
      if (res.ok) {
        setSubjectId("");
        setReason("");
      }
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-sm font-semibold">Create compliance hold</p>
      <p className="text-xs text-muted-foreground">
        Explicit, reasoned, audited. {COMPLIANCE_SAFE_COPY.notLegalDetermination}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hold-subject-type">Subject type</Label>
          <Input
            id="hold-subject-type"
            value={subjectType}
            onChange={(e) => setSubjectType(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hold-subject-id">Subject id</Label>
          <Input
            id="hold-subject-id"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="hold-reason">Reason (required)</Label>
        <Input
          id="hold-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          minLength={5}
          placeholder="Why is a hold required for review?"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending || reason.trim().length < 5}>
        Activate hold
      </Button>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </form>
  );
}
