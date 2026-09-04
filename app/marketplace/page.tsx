import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GCE_SURFACE } from "@/lib/frontend/design-language";

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

const DISCOVERY = [
  {
    t: "Events",
    d: "Published Marketplace Events from verified venues. Booking continues in the customer journey after you sign in.",
    href: "/events",
    action: "Browse Events",
  },
  {
    t: "Offers",
    d: "Offer Events customers can claim. Claiming is not a purchase and does not create revenue.",
    href: "/offers",
    action: "Browse Offers",
  },
  {
    t: "Venues",
    d: "Active Marketplace Venues with published listings. Onboarding remains approval-based.",
    href: "/venues",
    action: "Verified businesses",
  },
] as const;

export default function MarketplaceLandingPage() {
  return (
    <>
      <MarketingHero
        headline="GCE Marketplace"
        description="Discover published Events and Offers from verified businesses. Booking and claims continue after you sign in — only approved inventory appears here."
        primaryCta={{ label: "Browse Events", href: "/events" }}
        secondaryCta={{ label: "Browse Offers", href: "/offers" }}
        compact
        showBrandMark={false}
      />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6">
        <ol className="grid gap-8 md:grid-cols-3">
          {DISCOVERY.map((item, i) => (
            <li key={item.href} className="border-t border-border pt-5">
              <AnimatedSection delay={i * 0.04}>
                <h2 className="font-body text-lg font-semibold">{item.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.d}
                </p>
                <Link
                  href={item.href}
                  className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {item.action}
                </Link>
              </AnimatedSection>
            </li>
          ))}
        </ol>

        <AnimatedSection className="mt-12">
          <p className="max-w-2xl text-sm text-muted-foreground">
            Venue partners see backend-derived views, bookings, and claims in
            their workspace — not invented metrics.{" "}
            <Link
              href="/for-partners"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Partner pathways
            </Link>
          </p>
        </AnimatedSection>
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
