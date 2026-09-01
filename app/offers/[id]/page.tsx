import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { Button } from "@/components/ui/button";
import { GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getOfferDetail } from "@/lib/architecture/customer-cx";
import { MarketplaceEngagementBeacon } from "@/components/marketplace/MarketplaceEngagementBeacon";
import { formatWhen, venueDisplayName } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const offer = await getOfferDetail(createPrivilegedSupabaseClient(), id);
    return {
      title: `${offer.title} · GCE Offers`,
      description: offer.description?.slice(0, 160) ?? "GCE Marketplace Offer Event",
      alternates: { canonical: `/offers/${id}` },
    };
  } catch {
    return { title: "Offer · GCE" };
  }
}

export default async function PublicOfferDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  let offer: Awaited<ReturnType<typeof getOfferDetail>> | null = null;
  try {
    offer = await getOfferDetail(createPrivilegedSupabaseClient(), id);
  } catch {
    notFound();
  }
  if (!offer) notFound();

  const venue = venueDisplayName(offer.venue);

  return (
    <>
      <MarketplaceEngagementBeacon
        engagementType="marketplace_offer_view"
        subjectId={offer.id}
        venueId={
          offer.venue && typeof offer.venue === "object" && "id" in offer.venue
            ? String((offer.venue as { id: string }).id)
            : null
        }
      />
      <MarketingHero
        showBrandMark={false}
        headline={offer.title}
        description={`${formatWhen(offer.campaignStartsAt)} – ${formatWhen(offer.campaignEndsAt)}${venue ? ` · ${venue}` : ""}`}
        primaryCta={{
          label: "Continue to claim",
          href: `/customer/offers/${offer.id}`,
        }}
        secondaryCta={{ label: "All offers", href: "/offers" }}
        compact
      />
      <section className={cn(GCE_SPACING.pageNarrow, "pt-0")}>
        <article className={cn(GCE_SURFACE.card, "rounded-2xl p-6 sm:p-8")}>
          <p className="text-sm text-muted-foreground">
            Claiming an offer is not a purchase and is not recorded as revenue.
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {offer.description ?? "No description."}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {offer.remainingClaims} claim
            {offer.remainingClaims === 1 ? "" : "s"} remaining
            {offer.claimValidityHours
              ? ` · ${offer.claimValidityHours}h claim window`
              : ""}
          </p>
          <Button asChild className="mt-6 min-h-11">
            <Link href={`/customer/offers/${offer.id}`}>Open customer detail</Link>
          </Button>
        </article>
      </section>
    </>
  );
}
