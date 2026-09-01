import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsVenueReviewPanel } from "@/components/marketplace/OpsVenueReviewPanel";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { actorHasMarketplacePermission } from "@/lib/architecture/marketplace/permissions";
import {
  buildOnboardingProgress,
  parseVenueOnboarding,
} from "@/lib/architecture/marketplace/onboarding";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Venue review · Marketplace Ops",
};

type PageProps = {
  params: Promise<{ venueId: string }>;
};

export default async function OpsMarketplaceVenueReviewPage({ params }: PageProps) {
  const { venueId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/ops/marketplace/venues/${venueId}`);

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const canOps =
    actorHasOpsAdminPermission(entitlements.activeAssignments, "ops.marketplace") ||
    actorHasMarketplacePermission(
      entitlements.activeAssignments,
      "marketplace.venue.approve"
    );
  if (!canOps) redirect("/ops");

  const admin = createPrivilegedSupabaseClient();
  const { data: venue, error } = await admin
    .from("marketplace_venues")
    .select("*")
    .eq("id", venueId)
    .maybeSingle();

  if (error || !venue) notFound();

  const onboarding = parseVenueOnboarding(venue.metadata);
  const progress = buildOnboardingProgress({
    status: String(venue.status),
    onboarding,
    hasRecommendation: Boolean(venue.recommended_by_user_id),
  });

  const canReview = actorHasMarketplacePermission(
    entitlements.activeAssignments,
    "marketplace.venue.approve"
  );

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Venue onboarding review"
        description="Inspect MBDP recommendation, eligibility, and document manifest. Final approval is Marketplace Ops only."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Marketplace", href: "/ops/marketplace" },
          { label: String(venue.display_name) },
        ]}
      />
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/ops/marketplace">Back to queue</Link>
        </Button>
      </div>
      <OpsVenueReviewPanel
        venueId={venueId}
        displayName={String(venue.display_name)}
        status={String(venue.status)}
        category={venue.category ? String(venue.category) : null}
        city={venue.city ? String(venue.city) : null}
        state={venue.state ? String(venue.state) : null}
        address={venue.address ? String(venue.address) : null}
        onboarding={onboarding}
        progress={progress}
        canReview={canReview}
      />
    </main>
  );
}
