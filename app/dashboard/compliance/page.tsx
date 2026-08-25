import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { COMPLIANCE_SAFE_COPY } from "@/lib/frontend/ops/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Compliance · GCE",
};

/** CMP-01 */
export default async function ComplianceDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/compliance");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const allowed = workspacesForAssignments(assignments);
  const can =
    actorHasOpsAdminPermission(assignments, "ops.compliance") ||
    allowed.includes("compliance");

  const shell = (children: React.ReactNode) => (
    <PartnerShell
      forcedWorkspaceKey="compliance"
      allowedWorkspaces={allowed}
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel="Compliance"
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );

  if (!can) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader title="Compliance" />
        <EmptyState
          title="Compliance access required"
          description="Requires compliance_admin (or platform ops.compliance)."
        />
      </main>
    );
  }

  return shell(
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Compliance"
        description={COMPLIANCE_SAFE_COPY.notLegalDetermination}
      />
      <PartnerActionCenter
        items={[
          {
            id: "holds",
            title: "Compliance holds",
            href: "/compliance/holds",
            description: "Explicit · reasoned · audited",
          },
          {
            id: "ops",
            title: "Compliance Ops",
            href: "/ops/compliance",
          },
          {
            id: "risk",
            title: "Risk review",
            href: "/ops/security?tab=risk",
          },
          {
            id: "privacy",
            title: "Privacy requests",
            href: "/ops/privacy",
          },
          {
            id: "mod",
            title: "Moderation",
            href: "/ops/moderation",
          },
        ]}
      />
      <Button asChild variant="outline" size="sm">
        <Link href="/ops">Ops control plane</Link>
      </Button>
    </main>
  );
}
