import Link from "next/link";
import { WorkspaceSwitcher } from "@/app/dashboard/[workspaceKey]/workspace-switcher";
import { PartnerPageHeader } from "@/components/partner";
import { AttentionHome } from "@/components/workspace/AttentionHome";
import type { PartnerActionItem } from "@/components/partner/PartnerActionCenter";
import type { PartnerStatusItem } from "@/components/partner/PartnerStatusStrip";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { workspaceLabel } from "@/lib/frontend/workspace/labels";
import type { WorkspaceKey } from "@/lib/architecture/types";
import type { getCurrentIdentity } from "@/lib/architecture/identity/current";

type Identity = Awaited<ReturnType<typeof getCurrentIdentity>>;
type Loose = Record<string, unknown>;

function num(row: Loose | null | undefined, key: string): number {
  const v = row?.[key];
  return typeof v === "number" ? v : 0;
}

function str(row: Loose | null | undefined, key: string): string {
  const v = row?.[key];
  return typeof v === "string" ? v : "";
}

function flag(row: Loose | null | undefined, path: string): boolean {
  const [a, b] = path.split(".");
  const nested = a ? row?.[a] : undefined;
  if (!b) return Boolean(nested);
  if (!nested || typeof nested !== "object") return false;
  return Boolean((nested as Loose)[b]);
}

export function WorkspaceKeyHomeView({
  workspaceKey,
  identity,
  canAccess,
  activeCount,
  suspendedCount,
  membershipSummary,
  bdpReports,
  mbdpReports,
  venueHint,
  ebdpReports,
  clientReports,
  expertReport,
  financeReport,
  sentLeads,
  receivedLeadCount,
  cxHint,
  deskQueue,
  showConnectPanel,
  showBdpPanel,
  showMbdpPanel,
  showVenuePanel,
  showEbdpPanel,
  showEnterpriseClientPanel,
  showExpertPanel,
  showFinancePanel,
  showLeadAssistPanel,
  showCustomerCxPanel,
  showOpportunityDeskPanel,
}: {
  workspaceKey: WorkspaceKey;
  identity: Identity;
  canAccess: boolean;
  activeCount: number;
  suspendedCount: number;
  membershipSummary: Array<{
    id: string;
    status: string;
    allocationStatus: string;
    tagCount: number;
  }>;
  bdpReports: Array<Record<string, unknown> | null | undefined>;
  mbdpReports: Array<Record<string, unknown> | null | undefined>;
  venueHint: string;
  ebdpReports: Array<Record<string, unknown> | null | undefined>;
  clientReports: Array<Record<string, unknown> | null | undefined>;
  expertReport: Record<string, unknown> | null;
  financeReport: Record<string, unknown> | null;
  sentLeads: Array<{ id: string; title: string; workStatus: string; city?: string | null }>;
  receivedLeadCount: number;
  cxHint: { upcoming: number; claims: number } | null;
  deskQueue: Array<Record<string, unknown>>;
  showConnectPanel: boolean;
  showBdpPanel: boolean;
  showMbdpPanel: boolean;
  showVenuePanel: boolean;
  showEbdpPanel: boolean;
  showEnterpriseClientPanel: boolean;
  showExpertPanel: boolean;
  showFinancePanel: boolean;
  showLeadAssistPanel: boolean;
  showCustomerCxPanel: boolean;
  showOpportunityDeskPanel: boolean;
}) {
  const label = workspaceLabel(workspaceKey);

  if (!canAccess) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Workspace {label} is not available for your active role assignments.
          Legacy dashboard routes do not grant entitlement.
        </p>
        <WorkspaceSwitcher
          current={identity.currentWorkspace}
          allowed={identity.workspaces}
        />
        {activeCount === 0 ? (
          <p className="mt-4 text-sm text-amber-800">
            No active role assignments. You may use the personal workspace only.
          </p>
        ) : null}
        {suspendedCount > 0 ? (
          <p className="mt-2 text-sm text-amber-800">
            {suspendedCount} assignment(s) suspended — those workspaces are excluded.
          </p>
        ) : null}
      </main>
    );
  }

  const attention: PartnerActionItem[] = [];

  if (showCustomerCxPanel && cxHint) {
    if (cxHint.claims > 0) {
      attention.push({
        id: "claims",
        title: `${cxHint.claims} active offer claim(s)`,
        description: "Claims are not purchases.",
        href: "/customer/claims",
        severity: "warning",
        icon: "tag",
      });
    }
    if (cxHint.upcoming > 0) {
      attention.push({
        id: "bookings",
        title: `${cxHint.upcoming} upcoming booking(s)`,
        href: "/customer",
        severity: "info",
        icon: "ticket",
      });
    }
    attention.push({
      id: "cx-home",
      title: "Open customer activity",
      description: "Tickets, bookings, and claims live in the customer workspace.",
      href: "/customer",
      severity: "info",
    });
  }

  if (showLeadAssistPanel && receivedLeadCount > 0) {
    attention.push({
      id: "leads-in",
      title: `${receivedLeadCount} Lead Assist item(s) received`,
      description: "Accept, decline, or clarify — not a board.",
      href: "/connect/leads/received",
      severity: "warning",
      icon: "target",
    });
  }

  const unallocated = membershipSummary.filter(
    (m) => m.allocationStatus && m.allocationStatus !== "allocated"
  );
  if (showConnectPanel && unallocated.length > 0) {
    attention.push({
      id: "alloc",
      title: "Membership allocation needs attention",
      description: unallocated
        .map((m) => m.allocationStatus.replaceAll("_", " "))
        .join(" · "),
      href: "/connect/waitlist",
      severity: "warning",
    });
  }

  const firstBdp = bdpReports.find(Boolean) ?? null;
  if (showBdpPanel && firstBdp) {
    if (num(firstBdp, "openDisputes") > 0) {
      attention.push({
        id: "bdp-disputes",
        title: `${num(firstBdp, "openDisputes")} open Connect BDP dispute(s)`,
        href: "/connect-bdp/disputes",
        severity: "critical",
        icon: "scale",
      });
    }
    if (str(firstBdp, "applicationStatus") !== "active") {
      attention.push({
        id: "bdp-app",
        title: "Connect BDP application / package action",
        description: str(firstBdp, "applicationStatus").replaceAll("_", " "),
        href: "/connect-bdp/unit",
        severity: "warning",
      });
    }
  }

  const firstMbdp = mbdpReports.find(Boolean) ?? null;
  if (showMbdpPanel && num(firstMbdp, "proposedAttributions") > 0) {
    attention.push({
      id: "mbdp-attr",
      title: `${num(firstMbdp, "proposedAttributions")} venue attribution(s) proposed`,
      href: "/marketplace-bdp/attribution",
      severity: "info",
      icon: "users",
    });
  }

  if (showVenuePanel) {
    attention.push({
      id: "venue-ops",
      title: "Today’s Venue operations",
      description: "Check-in, events, and redemptions.",
      href: "/venue/check-in",
      severity: "info",
      icon: "ticket-check",
    });
  }

  const firstEbdp = ebdpReports.find(Boolean) ?? null;
  if (showEbdpPanel && firstEbdp) {
    if (num(firstEbdp, "openOpportunities") > 0) {
      attention.push({
        id: "ebdp-pipe",
        title: `${num(firstEbdp, "openOpportunities")} open opportunities`,
        href: "/enterprise-bdp/pipeline",
        severity: "info",
        icon: "git-branch",
      });
    }
    if (num(firstEbdp, "activeProjects") > 0) {
      attention.push({
        id: "ebdp-proj",
        title: `${num(firstEbdp, "activeProjects")} active project(s)`,
        href: "/enterprise-bdp/pipeline",
        severity: "info",
        icon: "briefcase",
      });
    }
  }

  const firstClient = clientReports.find(Boolean) ?? null;
  if (showEnterpriseClientPanel && firstClient) {
    if (num(firstClient, "milestonesDue") > 0) {
      attention.push({
        id: "ms-due",
        title: `${num(firstClient, "milestonesDue")} milestone(s) due`,
        href: "/enterprise/projects",
        severity: "warning",
        icon: "calendar",
      });
    }
    if (num(firstClient, "quotesAwaitingAcceptance") > 0) {
      attention.push({
        id: "quotes",
        title: `${num(firstClient, "quotesAwaitingAcceptance")} quote(s) awaiting acceptance`,
        href: "/enterprise/quotes",
        severity: "info",
      });
    }
    attention.push({
      id: "pcc",
      title: "Open Project Command Center",
      href: "/enterprise/projects",
      severity: "info",
      icon: "briefcase",
    });
  }

  if (showExpertPanel && num(expertReport, "quotesPendingFinanceCosign") > 0) {
    attention.push({
      id: "cosign",
      title: `${num(expertReport, "quotesPendingFinanceCosign")} quote(s) pending Finance co-sign`,
      href: "/enterprise-expert/proposals",
      severity: "warning",
    });
  }

  if (showFinancePanel && financeReport) {
    if (num(financeReport, "reconciliationExceptions") > 0) {
      attention.push({
        id: "recon",
        title: `${num(financeReport, "reconciliationExceptions")} reconciliation exception(s)`,
        href: "/finance/reconciliation",
        severity: "critical",
        icon: "scale",
      });
    }
    if (num(financeReport, "activeHolds") > 0) {
      attention.push({
        id: "holds",
        title: `${num(financeReport, "activeHolds")} active hold(s)`,
        href: "/finance/holds",
        severity: "warning",
        icon: "shield",
      });
    }
    if (num(financeReport, "offlineUnmatched") > 0) {
      attention.push({
        id: "offline",
        title: `${num(financeReport, "offlineUnmatched")} unmatched offline payment(s)`,
        href: "/finance/offline",
        severity: "warning",
      });
    }
  }

  if (showOpportunityDeskPanel && deskQueue.length > 0) {
    attention.push({
      id: "desk",
      title: `${deskQueue.length} Opportunity Desk item(s)`,
      href: "/desk/queue",
      severity: "warning",
      icon: "target",
    });
  }

  if (attention.length === 0) {
    attention.push({
      id: "ok",
      title: "No blocking items in this workspace",
      description: "Use the sidebar for day-to-day work.",
      severity: "info",
    });
  }

  const status: PartnerStatusItem[] = [
    {
      id: "ws",
      label: "Workspace",
      value: label,
      tone: "info",
    },
    {
      id: "assign",
      label: "Active assignments",
      value: String(activeCount),
      tone: activeCount > 0 ? "success" : "warning",
    },
  ];
  if (suspendedCount > 0) {
    status.push({
      id: "susp",
      label: "Suspended",
      value: String(suspendedCount),
      tone: "warning",
    });
  }

  const panelClass = `${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`;

  return (
    <AttentionHome
      header={
        <PartnerPageHeader
          title={label}
          description="What needs your attention today. Entitlement is role_assignments (FD-035)."
        />
      }
      statusItems={status}
      attentionItems={attention}
    >
      {showConnectPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Membership in flight</h2>
          {membershipSummary.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No memberships yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {membershipSummary.map((m) => (
                <li key={m.id}>
                  <Link href="/connect/membership" className="text-primary hover:underline">
                    {m.status} · allocation {m.allocationStatus.replaceAll("_", " ")} · tags{" "}
                    {m.tagCount}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {showLeadAssistPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Lead Assist (Stage 1 unpaid)</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Received {receivedLeadCount}. Paid mechanics remain off.
          </p>
          {sentLeads.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No sent leads yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {sentLeads.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/connect/leads/${l.id}`}
                    className="text-primary hover:underline"
                  >
                    {l.title} · {l.workStatus.replaceAll("_", " ")}
                    {l.city ? ` · ${l.city}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {showBdpPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Connect BDP units</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Dedicated overview:{" "}
            <Link href="/dashboard/connect-bdp" className="text-primary hover:underline">
              /dashboard/connect-bdp
            </Link>
          </p>
        </section>
      ) : null}

      {showMbdpPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Marketplace BDP units</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Dedicated overview:{" "}
            <Link
              href="/dashboard/marketplace-bdp"
              className="text-primary hover:underline"
            >
              /dashboard/marketplace-bdp
            </Link>
          </p>
        </section>
      ) : null}

      {showVenuePanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Venue operations</h2>
          <p className="mt-2 text-sm text-muted-foreground">{venueHint}</p>
          <p className="mt-2 text-sm">
            <Link href="/dashboard/venue" className="text-primary hover:underline">
              Open Venue home
            </Link>
          </p>
        </section>
      ) : null}

      {showEbdpPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Enterprise BDP pipeline</h2>
          <p className="mt-2 text-sm">
            <Link
              href="/dashboard/enterprise-bdp"
              className="text-primary hover:underline"
            >
              Open Enterprise BDP home
            </Link>
          </p>
        </section>
      ) : null}

      {showEnterpriseClientPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Enterprise Client projects</h2>
          {clientReports.filter(Boolean).length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No organisations linked to this representative.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {clientReports.filter(Boolean).map((r, i) =>
                r ? (
                  <li key={str(r, "clientId") || String(i)}>
                    {str(r, "displayName")} · {num(r, "projects")} project(s) ·{" "}
                    {num(r, "milestonesDue")} milestone(s) due
                  </li>
                ) : null
              )}
            </ul>
          )}
          <p className="mt-2 text-sm">
            <Link href="/enterprise/projects" className="text-primary hover:underline">
              Project Command Center
            </Link>
          </p>
        </section>
      ) : null}

      {showExpertPanel && expertReport ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Platform Expert queue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Assigned {num(expertReport, "assignedOpportunities")} · draft
            proposals {num(expertReport, "draftProposals")} · Finance co-sign{" "}
            {num(expertReport, "quotesPendingFinanceCosign")}
          </p>
        </section>
      ) : null}

      {showCustomerCxPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Customer activity</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {cxHint
              ? `Upcoming bookings ${cxHint.upcoming} · active claims ${cxHint.claims}. Ticket payments remain gated.`
              : "Open the customer workspace for bookings and claims."}
          </p>
          <p className="mt-2 text-sm">
            <Link href="/customer" className="text-primary hover:underline">
              Go to /customer
            </Link>
          </p>
        </section>
      ) : null}

      {showOpportunityDeskPanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Desk queue</h2>
          {deskQueue.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Queue empty.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {deskQueue.slice(0, 10).map((q, i) => (
                <li key={str(q, "id") || String(i)}>
                  <Link
                    href={`/desk/leads/${str(q, "lead_id")}`}
                    className="text-primary hover:underline"
                  >
                    {str(q, "reason")} · {str(q, "status")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {showFinancePanel ? (
        <section className={panelClass}>
          <h2 className="text-sm font-semibold">Finance ledger posture</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Payment ≠ revenue ≠ settlement. Payout execution gated. Dedicated home:{" "}
            <Link href="/dashboard/finance" className="text-primary hover:underline">
              /dashboard/finance
            </Link>
          </p>
          {financeReport ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Holds {num(financeReport, "activeHolds")} · recon exceptions{" "}
              {num(financeReport, "reconciliationExceptions")} · settlement
              execution {String(flag(financeReport, "moneyFlags.settlement_execution"))}{" "}
              · payout {String(flag(financeReport, "moneyFlags.payout_execution"))}
            </p>
          ) : null}
        </section>
      ) : null}
    </AttentionHome>
  );
}
