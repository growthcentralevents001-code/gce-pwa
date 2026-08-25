import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExceptionQueue } from "@/components/ops/ExceptionQueue";
import { OpsQueueFilter } from "@/components/ops/OpsQueueFilter";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadExceptions } from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import type { OpsVertical } from "@/lib/architecture/ops-admin";

type PageProps = {
  searchParams: Promise<{ vertical?: string }>;
};

export const metadata = {
  robots: { index: false, follow: false },
  title: "Exceptions · Ops · GCE",
};

export default async function OpsExceptionsPage({ searchParams }: PageProps) {
  const { vertical: verticalRaw } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/exceptions");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.exceptions.resolve"
    )
  ) {
    redirect("/ops");
  }
  const vertical = (verticalRaw as OpsVertical | undefined) ?? null;
  const items = await loadExceptions(
    createPrivilegedSupabaseClient(),
    vertical
  );

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Exception queues"
        description="Severity and status come from backend. Do not invent SLA clocks."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Exceptions" },
        ]}
      />
      <OpsQueueFilter basePath="/ops/exceptions" active={verticalRaw} />
      <ExceptionQueue items={items} showActions />
    </main>
  );
}
