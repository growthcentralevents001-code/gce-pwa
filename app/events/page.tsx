import { Suspense } from "react";
import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { DiscoveryFilters } from "@/components/customer/DiscoveryFilters";
import { EventCatalogue } from "@/components/customer/CatalogueMasterDetail";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { discoverEvents } from "@/lib/architecture/customer-cx";

export const metadata = publicMetadata({
  title: "Events",
  description:
    "Discover published GCE Marketplace events. Booking continues in the customer experience.",
  path: "/events",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PublicEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : null;
  const q = typeof sp.q === "string" ? sp.q : null;
  const category = typeof sp.category === "string" ? sp.category : null;
  const offset =
    typeof sp.offset === "string" ? Math.max(0, Number(sp.offset) || 0) : 0;
  const selected = typeof sp.selected === "string" ? sp.selected : null;
  const limit = 12;

  const admin = createPrivilegedSupabaseClient();
  let result: Awaited<ReturnType<typeof discoverEvents>> | null = null;
  let failed = false;
  try {
    result = await discoverEvents(admin, {
      city,
      q,
      category,
      limit,
      offset,
    });
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
  if (category) moreParams.set("category", category);
  moreParams.set("offset", String(nextOffset));

  return (
    <>
      <MarketingHero
        headline="Marketplace Events"
        description="Published events from GCE Marketplace. Seat inventory, tickets, and checkout stay in the canonical customer journey."
        primaryCta={{ label: "Browse offers", href: "/offers" }}
        secondaryCta={{ label: "Marketplace overview", href: "/marketplace" }}
        compact
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Suspense fallback={<Skeleton className="mb-6 h-11 w-full rounded-lg" />}>
          <DiscoveryFilters basePath="/events" showCategory />
        </Suspense>

        {failed ? (
          <ErrorState
            title="Could not load events"
            description="Please try again shortly."
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No published events yet"
            description="When Marketplace Events are published, they will appear here. You can still explore venues and partner pathways."
            primaryAction={{ label: "Clear filters", href: "/events" }}
            secondaryAction={{ label: "Explore venues", href: "/venues" }}
          />
        ) : (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              Showing {items.length} of {total}
            </p>
            <EventCatalogue
              items={items.map((event) => ({
                id: event.id,
                title: event.title,
                category: event.category,
                startsAt: event.startsAt,
                priceMinor: event.priceMinor,
                currency: event.currency,
                venue: event.venue,
              }))}
              selectedId={selected}
              basePath="/events"
              detailHref={(id) => `/events/${id}`}
              query={(() => {
                const p = new URLSearchParams();
                if (q) p.set("q", q);
                if (city) p.set("city", city);
                if (category) p.set("category", category);
                if (offset) p.set("offset", String(offset));
                return p;
              })()}
            />
            {hasMore ? (
              <div className="mt-8 flex justify-center">
                <Button asChild variant="outline" className="min-h-11">
                  <Link href={`/events?${moreParams.toString()}`}>Load more</Link>
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
