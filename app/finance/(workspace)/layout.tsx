import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { actorHasFinancePermission } from "@/lib/architecture/finance/permissions";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/finance");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);
  const canFinance = actorHasFinancePermission(
    entitlements.activeAssignments,
    "finance.report.read"
  );
  if (!canFinance && !allowed.includes("finance")) {
    redirect("/unauthorized");
  }

  return (
    <PartnerShell
      forcedWorkspaceKey="finance"
      allowedWorkspaces={allowed}
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel="Finance"
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );
}
