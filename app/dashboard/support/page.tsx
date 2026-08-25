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
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Support · GCE",
};

/** SUP-01 */
export default async function SupportDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/support");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const allowed = workspacesForAssignments(assignments);
  const can =
    actorHasOpsAdminPermission(assignments, "ops.support") ||
    allowed.includes("support");

  const shell = (children: React.ReactNode) => (
    <PartnerShell
      forcedWorkspaceKey="support"
      allowedWorkspaces={allowed}
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel="Support"
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );

  if (!can) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader title="Support" />
        <EmptyState
          title="Support access required"
          description="Requires support_admin assignment (or ops.support)."
        />
      </main>
    );
  }

  return shell(
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Support"
        description="Case queue and signal promotion. Cannot bypass protected business state machines. No fake SLA."
      />
      <PartnerActionCenter
        items={[
          {
            id: "signals",
            title: "Support signals",
            href: "/ops/support",
          },
          { id: "cases", title: "Cases", href: "/ops/cases" },
          {
            id: "exceptions",
            title: "Exceptions",
            href: "/ops/exceptions",
            description: "When assigned resolution permission",
          },
        ]}
      />
      <Button asChild variant="outline" size="sm">
        <Link href="/ops/support">Open Support Ops</Link>
      </Button>
    </main>
  );
}
