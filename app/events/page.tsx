import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/EmptyState";
import { CalendarDays } from "lucide-react";

export const metadata = publicMetadata({
  title: "Events",
  description:
    "Discover GCE Marketplace events. Booking continues in the customer experience.",
  path: "/events",
});

/**
 * PUB-09 Public Events SEO wrapper — Batch 1.
 * No separate booking engine; CTA into /customer/events.
 */
export default function PublicEventsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Marketplace"
        headline="Events"
        description="Public discovery for published marketplace events. Seat inventory and checkout use the canonical customer APIs."
        primaryCta={{ label: "Open customer events", href: "/customer/events" }}
        compact
      />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <GlassPanel className="p-2">
          <EmptyState
            icon={CalendarDays}
            title="Continue in Customer CX"
            description="Event cards, filters, and booking belong to Batch 2 customer surfaces. This public page is the SEO/marketing entry."
            primaryAction={{
              label: "Browse as customer",
              href: "/customer/events",
            }}
            secondaryAction={{ label: "Marketplace overview", href: "/marketplace" }}
          />
        </GlassPanel>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/venues">Explore venues</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
