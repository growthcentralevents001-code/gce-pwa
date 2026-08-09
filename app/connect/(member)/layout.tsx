import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

/**
 * Authenticated Connect member CX under /connect/* (inventory MEM-02+).
 * Public marketing /connect remains outside this route group.
 */
export default async function ConnectMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/connect/membership");
  }

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);
  if (!allowed.includes("connect-member") && !allowed.includes("personal")) {
    // Allow platform users to view membership draft flows via personal + CTA
    // Strict circle_member still preferred for full Circle data.
  }

  const primaryRole = entitlements.activeAssignments[0]?.roleKey;

  return (
    <PartnerShell
      forcedWorkspaceKey="connect-member"
      allowedWorkspaces={
        allowed.includes("connect-member")
          ? allowed
          : [...allowed, "connect-member"]
      }
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel={
        primaryRole ? String(primaryRole).replace(/_/g, " ") : "Connect member"
      }
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );
}
