import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = publicMetadata({
  title: "GCE Marketplace",
  description:
    "Discover Events, Offers, and verified businesses on GCE Marketplace. Claim Offers, book Events, and explore curated listings.",
  path: "/marketplace",
});

const BUSINESS_TYPES = [
  "Hotels",
  "Restaurants",
  "Coworking spaces",
  "Studios",
  "Salons",
  "Gyms",
  "Travel agencies",
  "Jewelers",
  "Electronics businesses",
  "Other verified businesses",
] as const;

export default function MarketplaceLandingPage() {
  return (
    <>
      <MarketingHero
        headline="GCE Marketplace"
        description="An open business marketplace where verified venues list Events and Offers, customers discover and engage, and businesses track measurable first-party engagement in their dashboard."
        primaryCta={{ label: "Explore GCE Marketplace", href: "/events" }}
        secondaryCta={{ label: "Browse Offers", href: "/offers" }}
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <AnimatedSection className="md:col-span-2">
            <div className={`${GCE_SURFACE.card} rounded-2xl p-6`}>
              <h2 className="font-body text-lg font-semibold">For customers</h2>
              <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                Discover published Events and Offers, explore verified
                businesses, claim Offers (not purchases), and book Events through
                the customer experience. Only approved published inventory appears
                in discovery.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/events">Events</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/offers">Offers</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/venues">Verified businesses</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {[
            {
              t: "Events",
              d: "Curated Marketplace Events from verified venues. Booking uses the canonical customer journey.",
              href: "/events",
            },
            {
              t: "Offers",
              d: "Offer Events customers can claim — claiming is not a purchase and does not create revenue.",
              href: "/offers",
            },
            {
              t: "Verified businesses",
              d: "Active Marketplace Venues with published listings. Onboarding remains approval-based.",
              href: "/venues",
            },
            {
              t: "Measurable engagement",
              d: "Venue partners see backend-derived views, bookings, and claims in their dashboard — not invented metrics.",
              href: "/for-partners",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.t} delay={i * 0.05}>
              <Link
                href={item.href}
                className={cn(
                  GCE_SURFACE.cardInteractive,
                  "block h-full rounded-2xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <h2 className="font-body text-lg font-semibold">{item.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
        <div className={`${GCE_SURFACE.muted} rounded-2xl p-6`}>
          <h2 className="text-base font-semibold">Supported business types</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Categories are stored on each Marketplace Venue record (free-text
            today). Examples aligned with current product scope:
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {BUSINESS_TYPES.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="For businesses"
        description="Get discovered, publish Events and Offers, reach customers, and track engagement after Platform verification. MBDP recommendation ≠ final approval."
        primary={{ label: "Join GCE Marketplace", href: "/venue/apply" }}
        secondary={{ label: "Explore GCE Marketplace", href: "/events" }}
      />
    </>
  );
}
