import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { PromoteSignalButton } from "./promote-button";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Support · Ops · GCE",
};

export default async function SupportOpsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/support");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.support"
    )
  ) {
    redirect("/ops");
  }
  const admin = createPrivilegedSupabaseClient();
  const { data: signals } = await admin
    .from("customer_support_signals")
    .select("id, user_id, message, status, created_at")
    .eq("status", "queued_for_phase13")
    .order("created_at", { ascending: true })
    .limit(50);

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Support"
        description="Tier-1 signals and case promotion. No ledger, commission, or KYC dump. No fake SLA."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Support" },
        ]}
        primaryAction={
          <Button asChild variant="outline" size="sm">
            <Link href="/ops/cases">Open cases</Link>
          </Button>
        }
      />
      {(signals ?? []).length === 0 ? (
        <EmptyState
          title="No queued support signals"
          description="Promote signals to cases only through the canonical command."
        />
      ) : (
        <ul className="space-y-3">
          {(signals ?? []).map((s) => (
            <li key={s.id}>
              <OpsQueueCard
                title="Support signal"
                summary={s.message}
                status={s.status}
                meta={s.created_at}
                actions={<PromoteSignalButton signalId={s.id} />}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
