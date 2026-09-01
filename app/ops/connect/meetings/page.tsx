import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConnectCircleMeetingsOps } from "@/components/ops/ConnectCircleMeetingsOps";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { listCirclesForOps } from "@/lib/architecture/connect/meetings";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Circle meetings · Connect Ops",
};

export default async function ConnectOpsMeetingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/connect/meetings");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (!actorHasOpsAdminPermission(entitlements.activeAssignments, "ops.connect")) {
    redirect("/ops");
  }

  const admin = createPrivilegedSupabaseClient();
  const circles = await listCirclesForOps(admin).catch(() => []);

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Circle meetings"
        description="Schedule and manage persisted Circle meetings. Standard cadence is every 15 days (FD-030). Connect BDP cannot schedule here."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Connect Ops", href: "/ops/connect" },
          { label: "Circle meetings" },
        ]}
        secondaryActions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/ops/connect">Back to Connect Ops</Link>
          </Button>
        }
      />
      <ConnectCircleMeetingsOps circles={circles} />
    </main>
  );
}
