import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsKpiStrip } from "@/components/ops/OpsKpiStrip";
import { ApprovalQueue } from "@/components/ops/ApprovalQueue";
import { ExceptionQueue } from "@/components/ops/ExceptionQueue";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
  type OpsAdminPermission,
  type OpsVertical,
} from "@/lib/architecture/ops-admin";
import {
  loadApprovals,
  loadCases,
  loadExceptions,
  loadOpsDashboardCards,
} from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";

const VERTICAL_COPY: Partial<
  Record<
    OpsVertical,
    { boundary: string; extraLinks?: Array<{ href: string; label: string }> }
  >
> = {
  connect: {
    boundary:
      "System proposes → Connect BDP assists → Platform confirms. No self-approval. Treasurer legacy absent.",
  },
  marketplace: {
    boundary:
      "Marketplace Ops final Venue approval. MBDP recommend ≠ approve. Unattributed economics not altered here.",
  },
  enterprise: {
    boundary:
      "No territory ownership. Finance co-sign strictly > ₹5,00,000 remains Finance. Expert has no automatic commission. No vendor portal.",
  },
  finance: {
    boundary:
      "Ops entry only — Batch 7 Finance workspace owns presentation. Settlement / payout / refund execution remain OFF.",
    extraLinks: [
      { href: "/dashboard/finance", label: "Open Finance workspace" },
      { href: "/finance/holds", label: "Finance holds" },
      { href: "/finance/reconciliation", label: "Reconciliation" },
    ],
  },
  compliance: {
    boundary:
      "Holds are explicit, reasoned, audited — not a toggle. Flags require review; they are not legal determinations.",
    extraLinks: [
      { href: "/compliance/holds", label: "Compliance holds" },
      { href: "/ops/privacy", label: "Privacy requests" },
      { href: "/ops/security?tab=risk", label: "Risk review" },
    ],
  },
  support: {
    boundary:
      "Support cannot bypass protected business state machines. Sensitive data minimized. No fake SLA.",
    extraLinks: [
      { href: "/ops/cases", label: "Open cases" },
      { href: "/dashboard/support", label: "Support dashboard" },
    ],
  },
};

export async function VerticalOpsPage(props: {
  vertical: OpsVertical;
  title: string;
  permission: OpsAdminPermission;
  description: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      props.permission
    )
  ) {
    redirect("/ops");
  }

  const admin = createPrivilegedSupabaseClient();
  const [cards, approvals, exceptions, cases] = await Promise.all([
    loadOpsDashboardCards(admin, props.vertical),
    loadApprovals(admin, props.vertical),
    loadExceptions(admin, props.vertical),
    loadCases(admin, { vertical: props.vertical }),
  ]);

  const copy = VERTICAL_COPY[props.vertical];
  const canReviewApprovals = actorHasOpsAdminPermission(
    entitlements.activeAssignments,
    "ops.approvals.review"
  );

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title={props.title}
        description={props.description}
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: props.title },
        ]}
      />

      {copy?.boundary ? (
        <p className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {copy.boundary}
        </p>
      ) : null}

      {copy?.extraLinks && copy.extraLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {copy.extraLinks.map((l) => (
            <Button key={l.href} asChild variant="outline" size="sm">
              <Link href={l.href}>{l.label}</Link>
            </Button>
          ))}
        </div>
      ) : null}

      {cards ? (
        <OpsKpiStrip
          items={[
            {
              label: "Approvals",
              value: cards.pendingApprovals,
              href: `/ops/approvals?vertical=${props.vertical}`,
            },
            {
              label: "Exceptions",
              value: cards.openExceptions,
              href: `/ops/exceptions?vertical=${props.vertical}`,
            },
            {
              label: "Cases",
              value: cases.length,
              href: "/ops/cases",
            },
          ]}
        />
      ) : (
        <EmptyState
          title="Queue metrics unavailable"
          description="Could not load ops dashboard cards for this vertical."
        />
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">
          Open approvals ({approvals.length})
        </h2>
        <ApprovalQueue
          items={approvals.slice(0, 15)}
          actorUserId={user.id}
          showActions={canReviewApprovals}
          dense={!canReviewApprovals}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">
          Open exceptions ({exceptions.length})
        </h2>
        <ExceptionQueue items={exceptions.slice(0, 15)} dense={false} showActions />
      </section>
    </main>
  );
}
