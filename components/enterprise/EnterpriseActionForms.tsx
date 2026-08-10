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

export function AcceptQuoteButton({
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
              await postEnterprise({ action: "accept_quote", quoteId });
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Accept failed");
            }
          });
        }}
      >
        {pending ? "Accepting…" : "Accept quote"}
      </Button>
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ChangeOrderForm({
  projectId,
  className,
}: {
  projectId: string;
  className?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [requestedChange, setRequestedChange] = useState("");
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
              action: "change_order",
              projectId,
              title,
              requestedChange,
            });
            setTitle("");
            setRequestedChange("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Request change order</h3>
      <div className="space-y-1">
        <Label htmlFor="co-title">Title</Label>
        <Input
          id="co-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="co-change">Requested change</Label>
        <Textarea
          id="co-change"
          value={requestedChange}
          onChange={(e) => setRequestedChange(e.target.value)}
          required
          rows={4}
          maxLength={10000}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Submitting…" : "Submit change order"}
      </Button>
    </form>
  );
}

export function RequirementVersionForm({
  opportunityId,
  className,
}: {
  opportunityId: string;
  className?: string;
}) {
  const router = useRouter();
  const [structuredScope, setStructuredScope] = useState("");
  const [objectives, setObjectives] = useState("");
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
              action: "requirement_version",
              opportunityId,
              structuredScope,
              objectives,
            });
            setStructuredScope("");
            setObjectives("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Structure requirement</h3>
      <p className="text-xs text-muted-foreground">
        Expert structures scope for proposal readiness. Finance co-sign is not Expert
        authority.
      </p>
      <div className="space-y-1">
        <Label htmlFor="req-scope">Structured scope</Label>
        <Textarea
          id="req-scope"
          value={structuredScope}
          onChange={(e) => setStructuredScope(e.target.value)}
          rows={4}
          maxLength={20000}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="req-obj">Objectives</Label>
        <Textarea
          id="req-obj"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          rows={3}
          maxLength={10000}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Saving…" : "Save requirement version"}
      </Button>
    </form>
  );
}

export function CreateProposalForm({
  opportunityId,
  className,
}: {
  opportunityId: string;
  className?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [solutionSummary, setSolutionSummary] = useState("");
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
              action: "create_proposal",
              opportunityId,
              title,
              solutionSummary,
            });
            setTitle("");
            setSolutionSummary("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Draft proposal</h3>
      <div className="space-y-1">
        <Label htmlFor="prop-title">Title</Label>
        <Input
          id="prop-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="prop-summary">Solution summary</Label>
        <Textarea
          id="prop-summary"
          value={solutionSummary}
          onChange={(e) => setSolutionSummary(e.target.value)}
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
        {pending ? "Creating…" : "Create proposal draft"}
      </Button>
    </form>
  );
}

export function CreateVendorForm({ className }: { className?: string }) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
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
              action: "create_vendor",
              businessName,
              category: category || null,
            });
            setBusinessName("");
            setCategory("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Add managed vendor record</h3>
      <p className="text-xs text-muted-foreground">
        Creates a managed record only — not a vendor login or self-service workspace.
      </p>
      <div className="space-y-1">
        <Label htmlFor="vendor-name">Business name</Label>
        <Input
          id="vendor-name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="vendor-cat">Category</Label>
        <Input
          id="vendor-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={200}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Saving…" : "Save vendor record"}
      </Button>
    </form>
  );
}

export function ProposeAttributionForm({
  packId,
  bdpUserId,
  className,
}: {
  packId: string;
  bdpUserId: string;
  className?: string;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [basis, setBasis] = useState("");
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
              action: "propose_attribution",
              clientId,
              packId,
              bdpUserId,
              basis: basis || undefined,
            });
            setClientId("");
            setBasis("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Propose client attribution</h3>
      <p className="text-xs text-muted-foreground">
        Propose only — Platform activates attribution. Do not claim arbitrary clients.
      </p>
      <div className="space-y-1">
        <Label htmlFor="attr-client">Client ID</Label>
        <Input
          id="attr-client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="attr-basis">Basis</Label>
        <Textarea
          id="attr-basis"
          value={basis}
          onChange={(e) => setBasis(e.target.value)}
          rows={2}
          maxLength={500}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Submitting…" : "Propose attribution"}
      </Button>
    </form>
  );
}
