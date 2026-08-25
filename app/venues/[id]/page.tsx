import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, CalendarDays } from "lucide-react";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { EventCard } from "@/components/customer/EventCard";
import { EmptyState } from "@/components/states/EmptyState";
import { GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import {
  discoverEvents,
  getPublicMarketplaceVenue,
} from "@/lib/architecture/customer-cx";

type Params = Promise<{ id: string }>;

function locationLine(venue: {
  address: string | null;
  city: string;
  state: string | null;
}): string {
  const parts = [venue.address, venue.city, venue.state].filter(
    (part): part is string => Boolean(part && part.trim()),
  );
  return parts.join(", ");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const venue = await getPublicMarketplaceVenue(
      createPrivilegedSupabaseClient(),
      id,
    );
    return {
      title: `${venue.displayName} · GCE Venues`,
      description: venue.city
        ? `${venue.displayName} in ${venue.city}`
        : venue.displayName,
      alternates: { canonical: `/venues/${id}` },
    };
  } catch {
    return { title: "Venue · GCE" };
  }
}

/**
 * Public Marketplace venue detail — active marketplace_venues only.
 */
export default async function PublicVenueDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const admin = createPrivilegedSupabaseClient();

  let venue: Awaited<ReturnType<typeof getPublicMarketplaceVenue>> | null =
    null;
  try {
    venue = await getPublicMarketplaceVenue(admin, id);
  } catch {
    notFound();
  }
  if (!venue) notFound();

  let events: Awaited<ReturnType<typeof discoverEvents>>["items"] = [];
  try {
    const result = await discoverEvents(admin, {
      venueId: venue.id,
      limit: 12,
    });
    events = result.items;
  } catch {
    events = [];
  }

  const where = locationLine(venue);

  return (
    <>
      <MarketingHero
        showBrandMark={false}
        headline={venue.displayName}
        description={where || "GCE Marketplace venue"}
        primaryCta={{ label: "Browse events", href: "/events" }}
        secondaryCta={{ label: "All venues", href: "/venues" }}
        compact
      />
      <section className={cn(GCE_SPACING.page, "pt-0")}>
        <article className={cn(GCE_SURFACE.card, "rounded-2xl p-6 sm:p-8")}>
          {venue.category ? (
            <p className="text-sm font-medium text-primary">{venue.category}</p>
          ) : null}
          {where ? (
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{where}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Address is not published for this venue.
            </p>
          )}
        </article>

        <div className="mt-10">
          <h2 className="font-body text-xl font-semibold text-foreground">
            Published events
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Booking continues in the customer experience. Live ticket payments
            remain gated off until Founder activation.
          </p>
          {events.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={CalendarDays}
                title="No published events at this venue"
                description="When Marketplace Events are published here, they will appear on this page."
                primaryAction={{ label: "Browse all events", href: "/events" }}
              />
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard
                    href={`/events/${event.id}`}
                    event={{
                      id: event.id,
                      title: event.title,
                      category: event.category,
                      startsAt: event.startsAt,
                      priceMinor: event.priceMinor,
                      currency: event.currency,
                      venue: event.venue,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-8">
          <Link
            href="/venues"
            className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to venues
          </Link>
        </p>
      </section>
    </>
  );
}
