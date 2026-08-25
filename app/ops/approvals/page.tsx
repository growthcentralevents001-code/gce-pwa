import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApprovalQueue } from "@/components/ops/ApprovalQueue";
import { OpsQueueFilter } from "@/components/ops/OpsQueueFilter";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadApprovals } from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import type { OpsVertical } from "@/lib/architecture/ops-admin";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Approvals · Ops · GCE",
};

type PageProps = {
  searchParams: Promise<{ vertical?: string }>;
};

export default async function OpsApprovalsPage({ searchParams }: PageProps) {
  const { vertical: verticalRaw } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/approvals");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.approvals.review"
    )
  ) {
    redirect("/ops");
  }

  const vertical = (verticalRaw as OpsVertical | undefined) ?? null;
  const items = await loadApprovals(
    createPrivilegedSupabaseClient(),
    vertical
  );

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Approval queues"
        description="Projection queue — domain approve services remain source of truth. Self-approval blocked (UI + backend SoD). No bulk approve."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Approvals" },
        ]}
      />
      <OpsQueueFilter basePath="/ops/approvals" active={verticalRaw} />
      <ApprovalQueue items={items} actorUserId={user.id} />
    </main>
  );
}
