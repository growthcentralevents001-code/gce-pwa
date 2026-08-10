import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModerationReviewList } from "@/components/ops/ModerationReviewList";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadModerationActions } from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Moderation · Ops · GCE",
};

export default async function OpsModerationPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/moderation");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.moderation"
    )
  ) {
    redirect("/ops");
  }
  const items = await loadModerationActions(
    createPrivilegedSupabaseClient(),
    50
  );

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Moderation"
        description="Approve / reject / hide / suspend only via backend moderation actions. No arbitrary content deletion. Split detail pattern deferred to Batch 10 polish where needed."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Moderation" },
        ]}
      />
      <ModerationReviewList items={items} />
    </main>
  );
}
