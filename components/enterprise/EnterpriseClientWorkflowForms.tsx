"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

async function postEnterprise(body: Record<string, unknown>) {
  const res = await fetch("/api/enterprise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || json?.message || "Request failed");
  }
  return json;
}

export function SubmitClientRequirementForm({
  clientId,
  className,
}: {
  clientId: string;
  className?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [rawRequirement, setRawRequirement] = useState("");
  const [locations, setLocations] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "space-y-3 p-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            const json = await postEnterprise({
              action: "submit_client_requirement",
              clientId,
              title,
              rawRequirement,
              locations: locations || undefined,
            });
            const oppId = json?.opportunity?.id as string | undefined;
            if (oppId) {
              router.push(`/enterprise/opportunities/${oppId}`);
              router.refresh();
            } else {
              router.push("/enterprise/opportunities");
              router.refresh();
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Submit Enterprise requirement</h3>
      <p className="text-xs text-muted-foreground">
        Creates a real requirement record for GCE review. Submission does not guarantee
        project award, delivery, or commercial outcomes.
      </p>
      <div className="space-y-1">
        <Label htmlFor="req-title">Requirement title</Label>
        <Input
          id="req-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="req-body">Describe your business requirement</Label>
        <Textarea
          id="req-body"
          value={rawRequirement}
          onChange={(e) => setRawRequirement(e.target.value)}
          required
          rows={6}
          maxLength={20000}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="req-locations">Locations (optional)</Label>
        <Input
          id="req-locations"
          value={locations}
          onChange={(e) => setLocations(e.target.value)}
          maxLength={2000}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Submitting…" : "Submit requirement"}
      </Button>
    </form>
  );
}

export function RespondRequirementInfoForm({
  opportunityId,
  clientId,
  message,
  className,
}: {
  opportunityId: string;
  clientId: string;
  message?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "space-y-3 p-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            await postEnterprise({
              action: "respond_requirement_info",
              opportunityId,
              clientId,
              response,
            });
            setResponse("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Respond to information request</h3>
      {message ? (
        <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
          GCE requested: {message}
        </p>
      ) : null}
      <div className="space-y-1">
        <Label htmlFor="info-response">Your response</Label>
        <Textarea
          id="info-response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
          rows={4}
          maxLength={20000}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Sending…" : "Send response"}
      </Button>
    </form>
  );
}

export function EnterpriseExpertWorkflowPanel({
  opportunityId,
  readinessStatus,
  expertUserId,
  className,
}: {
  opportunityId: string;
  readinessStatus: string;
  expertUserId?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [infoMessage, setInfoMessage] = useState("");
  const [assignExpertId, setAssignExpertId] = useState(expertUserId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (body: Record<string, unknown>) => {
    setError(null);
    startTransition(async () => {
      try {
        await postEnterprise(body);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Action failed");
      }
    });
  };

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "space-y-4 p-4", className)}>
      <h3 className="text-sm font-semibold">Enterprise review actions</h3>
      <p className="text-xs text-muted-foreground">
        Server-authorised workflow only. Clients cannot qualify or assign experts.
      </p>
      <div className="flex flex-wrap gap-2">
        {["submitted", "info_requested"].includes(readinessStatus) ? (
          <Button
            type="button"
            variant="secondary"
            className="min-h-11"
            disabled={pending}
            onClick={() =>
              run({ action: "start_requirement_review", opportunityId })
            }
          >
            Start review
          </Button>
        ) : null}
        {["under_review", "structuring", "submitted"].includes(readinessStatus) ? (
          <Button
            type="button"
            variant="secondary"
            className="min-h-11"
            disabled={pending}
            onClick={() =>
              run({ action: "qualify_requirement", opportunityId })
            }
          >
            Mark qualified
          </Button>
        ) : null}
      </div>
      <div className="space-y-2 border-t border-border pt-3">
        <Label htmlFor="info-msg">Request more information</Label>
        <Textarea
          id="info-msg"
          value={infoMessage}
          onChange={(e) => setInfoMessage(e.target.value)}
          rows={2}
          maxLength={5000}
        />
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={pending || !infoMessage.trim()}
          onClick={() =>
            run({
              action: "request_requirement_info",
              opportunityId,
              message: infoMessage,
            })
          }
        >
          Request information
        </Button>
      </div>
      <div className="space-y-2 border-t border-border pt-3">
        <Label htmlFor="expert-id">Assign expert user ID</Label>
        <Input
          id="expert-id"
          value={assignExpertId}
          onChange={(e) => setAssignExpertId(e.target.value)}
          placeholder="Expert user UUID"
        />
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={pending || !assignExpertId.trim()}
          onClick={() =>
            run({
              action: "assign_expert",
              opportunityId,
              expertUserId: assignExpertId.trim(),
            })
          }
        >
          Assign expert
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CreateQuoteForm({
  opportunityId,
  clientId,
  className,
}: {
  opportunityId: string;
  clientId: string;
  className?: string;
}) {
  const router = useRouter();
  const [label, setLabel] = useState("Enterprise service line");
  const [amountMinor, setAmountMinor] = useState("10000000");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "space-y-3 p-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const amount = Number(amountMinor);
        startTransition(async () => {
          try {
            await postEnterprise({
              action: "create_quote",
              opportunityId,
              clientId,
              totalProposedMinor: amount,
              lines: [
                {
                  label,
                  amountMinor: amount,
                  revenueComponentKey: `ent-quote-${Date.now()}`,
                },
              ],
            });
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Create quotation draft</h3>
      <p className="text-xs text-muted-foreground">
        Proposal covers scope; quotation covers commercial terms. Finance co-sign applies
        above governed thresholds.
      </p>
      <div className="space-y-1">
        <Label htmlFor="quote-label">Line label</Label>
        <Input
          id="quote-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="quote-amount">Amount (minor units, paise)</Label>
        <Input
          id="quote-amount"
          value={amountMinor}
          onChange={(e) => setAmountMinor(e.target.value)}
          required
          inputMode="numeric"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Creating…" : "Create quote"}
      </Button>
    </form>
  );
}

export function IssueQuoteButton({
  quoteId,
  className,
}: {
  quoteId: string;
  className?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className={className}>
      <Button
        className="min-h-11"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await postEnterprise({ action: "issue_quote", quoteId });
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Issue failed");
            }
          });
        }}
      >
        {pending ? "Issuing…" : "Issue quote to client"}
      </Button>
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
