import { Suspense } from "react";
import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { DiscoveryFilters } from "@/components/customer/DiscoveryFilters";
import { OfferCard } from "@/components/customer/OfferCard";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { discoverOffers } from "@/lib/architecture/customer-cx";

export const metadata = publicMetadata({
  title: "Offers",
  description:
    "Discover published GCE Marketplace Offer Events. Claims continue in the customer experience.",
  path: "/offers",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PublicOffersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : null;
  const q = typeof sp.q === "string" ? sp.q : null;
  const offset =
    typeof sp.offset === "string" ? Math.max(0, Number(sp.offset) || 0) : 0;
  const limit = 12;

  const admin = createPrivilegedSupabaseClient();
  let result: Awaited<ReturnType<typeof discoverOffers>> | null = null;
  let failed = false;
  try {
    result = await discoverOffers(admin, { city, q, limit, offset });
  } catch {
    failed = true;
  }

  const items = result?.items ?? [];
  const total = result?.total ?? 0;
  const nextOffset = offset + limit;
  const hasMore = nextOffset < total;
  const moreParams = new URLSearchParams();
  if (q) moreParams.set("q", q);
  if (city) moreParams.set("city", city);
  moreParams.set("offset", String(nextOffset));

  return (
    <>
      <MarketingHero
        headline="Offer Events"
        description="Active Offer Events from GCE Marketplace. Claiming an offer is not a purchase and is not treated as revenue."
        primaryCta={{ label: "Browse events", href: "/events" }}
        secondaryCta={{ label: "Marketplace overview", href: "/marketplace" }}
        compact
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Suspense fallback={<Skeleton className="mb-6 h-11 w-full rounded-lg" />}>
          <DiscoveryFilters basePath="/offers" showCategory={false} />
        </Suspense>

        {failed ? (
          <ErrorState
            title="Could not load offers"
            description="Please try again shortly."
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No active offers right now"
            description="Published Offer Events appear here while their campaign window is open."
            primaryAction={{ label: "Clear filters", href: "/offers" }}
            secondaryAction={{ label: "Browse events", href: "/events" }}
          />
        ) : (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              Showing {items.length} of {total}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((o) => (
                <OfferCard
                  key={o.id}
                  href={`/offers/${o.id}`}
                  offer={{
                    id: o.id,
                    title: o.title,
                    remainingClaims: o.remainingClaims,
                    claimValidityHours: o.claimValidityHours,
                    customerCap: o.customerCap,
                    venue: o.venue,
                    campaignEndsAt: o.campaignEndsAt,
                  }}
                />
              ))}
            </div>
            {hasMore ? (
              <div className="mt-8 flex justify-center">
                <Button asChild variant="outline" className="min-h-11">
                  <Link href={`/offers?${moreParams.toString()}`}>Load more</Link>
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
