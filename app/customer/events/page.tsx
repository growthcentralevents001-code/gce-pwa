import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { DiscoveryFilters } from "@/components/customer/DiscoveryFilters";
import { EventCatalogue } from "@/components/customer/CatalogueMasterDetail";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { discoverEvents } from "@/lib/architecture/customer-cx";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Events · GCE Customer",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CustomerEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer/events");

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

  return (
    <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pb-10">
      <CxPageHeader
        title="Events"
        description="Published Marketplace inventory · filters use server discovery."
        backHref="/customer"
        backLabel="Home"
      />

      <Suspense
        fallback={<Skeleton className="mb-6 h-11 w-full rounded-lg" />}
      >
        <DiscoveryFilters basePath="/customer/events" showCategory />
      </Suspense>

      {failed ? (
        <ErrorState
          title="Could not load events"
          description="Please try again shortly."
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No events match"
          description="Try clearing filters or browsing another city."
          primaryAction={{ label: "Clear filters", href: "/customer/events" }}
        />
      ) : (
        <>
            <p className="mb-4 text-xs text-muted-foreground">
              Showing {items.length} of {total}
            </p>
            <EventCatalogue
              items={items.map((e) => ({
                id: e.id,
                title: e.title,
                category: e.category,
                startsAt: e.startsAt,
                priceMinor: e.priceMinor,
                currency: e.currency,
                venue: e.venue,
              }))}
              selectedId={selected}
              basePath="/customer/events"
              detailHref={(id) => `/customer/events/${id}`}
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
                <Link
                  href={`/customer/events?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(city ? { city } : {}),
                    ...(category ? { category } : {}),
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
