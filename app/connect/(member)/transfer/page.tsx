import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Circle transfer · GCE Connect",
};

/** MEM-08 — transfer UI; member self-serve POST is not exposed (admin-gated API). */
export default async function TransferPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/transfer");

  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Circle transfer"
        description="Transfers are reviewed by the platform. This UI does not auto-transfer seats."
        backHref="/connect/circle"
      />

      {!primary ? (
        <EmptyState
          title="No membership"
          primaryAction={{ label: "Membership", href: "/connect/membership" }}
        />
      ) : (
        <FeatureGated
          mode="coming_later"
          title="Member transfer request pending API"
          description="Canonical transfer_request exists for ops/admin actors. A member-facing request endpoint is registered as a backend gap — do not invent client-side transfer."
        />
      )}
    </main>
  );
}
