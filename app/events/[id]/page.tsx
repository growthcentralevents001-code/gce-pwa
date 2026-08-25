import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getEventDetail } from "@/lib/architecture/customer-cx";
import {
  formatInrMinor,
  formatWhen,
  venueDisplayName,
} from "@/lib/frontend/customer/format";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await getEventDetail(createPrivilegedSupabaseClient(), id);
    return {
      title: `${event.title} · GCE Events`,
      description: event.description?.slice(0, 160) ?? "GCE Marketplace event",
      alternates: { canonical: `/events/${id}` },
    };
  } catch {
    return { title: "Event · GCE" };
  }
}

/**
 * PUB Event detail SEO wrapper — transactional booking lives under /customer.
 */
export default async function PublicEventDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  let event: Awaited<ReturnType<typeof getEventDetail>> | null = null;
  try {
    event = await getEventDetail(createPrivilegedSupabaseClient(), id);
  } catch {
    notFound();
  }
  if (!event) notFound();

  const venue = venueDisplayName(event.venue);

  return (
    <>
      <MarketingHero
        showBrandMark={false}
        headline={event.title}
        description={`${formatWhen(event.starts_at)}${venue ? ` · ${venue}` : ""}`}
        primaryCta={{
          label: event.soldOut ? "View event" : "Continue to booking",
          href: event.soldOut
            ? `/customer/events/${event.id}`
            : `/customer/events/${event.id}/book`,
        }}
        secondaryCta={{ label: "All events", href: "/events" }}
        compact
      />
      <section className={cn(GCE_SPACING.pageNarrow, "pt-0")}>
        <article className={cn(GCE_SURFACE.card, "rounded-2xl p-6 sm:p-8")}>
          {event.category ? (
            <p className="text-sm font-medium text-primary">{event.category}</p>
          ) : null}
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {event.description ?? "No description."}
          </p>
          <p className="mt-4 text-sm font-medium">
            From {formatInrMinor(event.price_minor, event.currency ?? "INR")}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Booking, tickets, and payments use the canonical customer
            experience. Live ticket payments remain gated off until Founder
            activation.
          </p>
          <Button asChild className="mt-6 min-h-11">
            <Link href={`/customer/events/${event.id}`}>Open customer detail</Link>
          </Button>
        </article>
      </section>
    </>
  );
}
