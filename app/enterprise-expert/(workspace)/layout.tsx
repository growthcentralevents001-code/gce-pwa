import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export default async function EnterpriseExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);
  const isExpert = entitlements.activeAssignments.some(
    (a) =>
      a.roleKey === "enterprise_platform_expert" ||
      a.roleKey === "platform_admin"
  );
  if (!isExpert) {
    redirect("/unauthorized");
  }

  const primaryRole = entitlements.activeAssignments.find(
    (a) => a.roleKey === "enterprise_platform_expert"
  )?.roleKey;

  return (
    <PartnerShell
      forcedWorkspaceKey="platform-ops"
      allowedWorkspaces={allowed}
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel={
        primaryRole
          ? "Enterprise Platform Expert"
          : "Platform Ops · Enterprise"
      }
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );
}
