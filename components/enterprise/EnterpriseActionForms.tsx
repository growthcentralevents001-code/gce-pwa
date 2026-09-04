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

export function CreateOpportunityForm({
  clients,
  packId,
  attributedBdpUserId,
  className,
}: {
  clients: Array<{ id: string; label: string }>;
  packId?: string | null;
  attributedBdpUserId?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
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
              action: "create_opportunity",
              clientId,
              title,
              summary: summary || undefined,
              packId: packId || undefined,
              attributedBdpUserId: attributedBdpUserId || undefined,
            });
            setTitle("");
            setSummary("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Open opportunity</h3>
      <p className="text-xs text-muted-foreground">
        Creates a live pipeline record for an attributed client. Client
        representatives cannot open opportunities.
      </p>
      <div className="space-y-1">
        <Label htmlFor="opp-client">Client</Label>
        {clients.length > 0 ? (
          <select
            id="opp-client"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id="opp-client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            placeholder="Client ID"
          />
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="opp-title">Title</Label>
        <Input
          id="opp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={300}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="opp-summary">Summary</Label>
        <Textarea
          id="opp-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          maxLength={5000}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11" disabled={pending || !clientId}>
        {pending ? "Creating…" : "Create opportunity"}
      </Button>
    </form>
  );
}

export function ProposeCorporateClientForm({
  packId,
  className,
}: {
  packId: string;
  className?: string;
}) {
  const router = useRouter();
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
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
              action: "propose_corporate_client",
              packId,
              legalName,
              displayName,
              industry: industry || undefined,
              contactName: contactName || undefined,
              contactEmail: contactEmail || undefined,
              contactPhone: contactPhone || undefined,
              basis: basis || undefined,
            });
            setLegalName("");
            setDisplayName("");
            setIndustry("");
            setContactName("");
            setContactEmail("");
            setContactPhone("");
            setBasis("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Propose corporate lead</h3>
      <p className="text-xs text-muted-foreground">
        Creates a prospect client organisation and proposes attribution. Platform
        activates attribution — this is not automatic entitlement.
      </p>
      <div className="space-y-1">
        <Label htmlFor="corp-legal">Legal organisation name</Label>
        <Input id="corp-legal" value={legalName} onChange={(e) => setLegalName(e.target.value)} required maxLength={300} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="corp-display">Display name</Label>
        <Input id="corp-display" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={300} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="corp-industry">Industry</Label>
        <Input id="corp-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} maxLength={200} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="corp-contact">Contact person</Label>
          <Input id="corp-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} maxLength={200} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="corp-phone">Phone</Label>
          <Input id="corp-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} maxLength={40} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="corp-email">Contact email</Label>
        <Input id="corp-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} maxLength={200} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="corp-basis">Relationship basis</Label>
        <Textarea id="corp-basis" value={basis} onChange={(e) => setBasis(e.target.value)} rows={2} maxLength={500} />
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Submitting…" : "Propose corporate lead"}
      </Button>
    </form>
  );
}

export function RequestHandoffForm({
  opportunityId,
  packId,
  className,
}: {
  opportunityId: string;
  packId: string;
  className?: string;
}) {
  const router = useRouter();
  const [rawRequirement, setRawRequirement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={cn(GCE_RADIUS.card, GCE_SURFACE.muted, "space-y-3 p-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            await postEnterprise({
              action: "request_handoff",
              opportunityId,
              packId,
              rawRequirement,
            });
            setRawRequirement("");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h3 className="text-sm font-semibold">Request Enterprise Core handoff</h3>
      <p className="text-xs text-muted-foreground">
        Submit structured requirement summary for Platform Expert qualification.
        Does not approve proposals or quotations.
      </p>
      <div className="space-y-1">
        <Label htmlFor="handoff-req">Requirement summary</Label>
        <Textarea
          id="handoff-req"
          value={rawRequirement}
          onChange={(e) => setRawRequirement(e.target.value)}
          rows={4}
          required
          maxLength={20000}
        />
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <Button type="submit" className="min-h-11" disabled={pending}>
        {pending ? "Submitting…" : "Request handoff"}
      </Button>
    </form>
  );
}
