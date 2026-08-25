import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const metadata = publicMetadata({
  title: "Venues",
  description: "Browse active GCE Marketplace venues.",
  path: "/venues",
});

export default async function PublicVenuesPage() {
  const admin = createPrivilegedSupabaseClient();
  let venues: { id: string; display_name: string; city: string | null }[] = [];
  let failed = false;
  try {
    const { data, error } = await admin
      .from("marketplace_venues")
      .select("id,display_name,city")
      .eq("status", "active")
      .order("display_name", { ascending: true })
      .limit(48);
    if (error) throw error;
    venues = data ?? [];
  } catch {
    failed = true;
  }

  return (
    <>
      <MarketingHero
        headline="Venues"
        description="Active Marketplace venues. Partner onboarding is application-based — listing here is not self-serve."
        primaryCta={{
          label: "Become a venue partner",
          href: "/apply/role?intent=venue",
        }}
        secondaryCta={{ label: "Events", href: "/events" }}
        compact
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        {failed ? (
          <ErrorState
            title="Could not load venues"
            description="Please try again shortly."
          />
        ) : venues.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No active venues published yet"
            description="When Venue Partners are approved and active, they will appear here."
            primaryAction={{ label: "For Partners", href: "/for-partners" }}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <li key={venue.id}>
                <Link
                  href={
                    venue.city
                      ? `/events?city=${encodeURIComponent(venue.city)}`
                      : "/events"
                  }
                  className={cn(
                    GCE_SURFACE.cardInteractive,
                    "block rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <h2 className="font-body text-base font-semibold text-foreground">
                    {venue.display_name}
                  </h2>
                  {venue.city ? (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {venue.city}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm font-medium text-primary">
                    See events in this city
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
