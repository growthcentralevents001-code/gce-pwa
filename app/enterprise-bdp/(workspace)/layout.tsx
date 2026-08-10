import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export default async function EnterpriseBdpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-bdp/apply");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);
  const primaryRole = entitlements.activeAssignments[0]?.roleKey;

  return (
    <PartnerShell
      forcedWorkspaceKey="enterprise-bdp"
      allowedWorkspaces={
        allowed.includes("enterprise-bdp")
          ? allowed
          : [...allowed, "enterprise-bdp"]
      }
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel={
        primaryRole ? String(primaryRole).replace(/_/g, " ") : "Enterprise BDP"
      }
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );
}
