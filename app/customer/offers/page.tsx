import { Suspense } from "react";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { DiscoveryFilters } from "@/components/customer/DiscoveryFilters";
import { OfferCard } from "@/components/customer/OfferCard";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { discoverOffers } from "@/lib/architecture/customer-cx";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Offers · GCE Customer",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CustomerOffersPage({
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

  return (
    <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pb-10">
      <CxPageHeader
        title="Offers"
        description="Active Offer Events · claim ≠ purchase · claim ≠ revenue."
        backHref="/customer"
        backLabel="Home"
      />

      <Suspense fallback={<Skeleton className="mb-6 h-11 w-full rounded-lg" />}>
        <DiscoveryFilters basePath="/customer/offers" showCategory={false} />
      </Suspense>

      {failed ? (
        <ErrorState
          title="Could not load offers"
          description="Please try again shortly."
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No active offers"
          description="Check back soon for Venue Offer Events."
          primaryAction={{ label: "Clear filters", href: "/customer/offers" }}
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
                <Link
                  href={`/customer/offers?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(city ? { city } : {}),
                    offset: String(nextOffset),
                  }).toString()}`}
                >
                  Load more
                </Link>
              </Button>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
