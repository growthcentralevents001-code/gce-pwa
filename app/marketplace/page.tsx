import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export const metadata = publicMetadata({
  title: "GCE Marketplace",
  description:
    "Discover Events, Offers, and venue experiences on GCE Marketplace.",
  path: "/marketplace",
});

export default function MarketplaceLandingPage() {
  return (
    <>
      <MarketingHero
        headline="Marketplace — events, offers, venues"
        description="Browse published marketplace inventory, then continue into the customer journey for booking and claims. Marketplace Affiliate is not an active pathway."
        primaryCta={{ label: "Browse Events", href: "/events" }}
        secondaryCta={{ label: "Browse Offers", href: "/offers" }}
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              t: "Events",
              d: "Public discovery shares the same published inventory as the customer experience.",
              href: "/events",
              wide: true,
            },
            {
              t: "Offers",
              d: "Offer listings lead into customer claim flows — claiming is not a purchase.",
              href: "/offers",
              wide: false,
            },
            {
              t: "Venues",
              d: "Explore active venues. Partner applications remain approval-based.",
              href: "/venues",
              wide: false,
            },
          ].map((item, i) => (
            <AnimatedSection
              key={item.t}
              delay={i * 0.05}
              className={item.wide ? "md:col-span-2" : undefined}
            >
              <Link
                href={item.href}
                className={cn(
                  GCE_SURFACE.cardInteractive,
                  "block h-full rounded-2xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <h2 className="font-body text-lg font-semibold">{item.t}</h2>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                  {item.d}
                </p>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <CtaBand
        title="Operate on the Marketplace"
        description="Venue and Marketplace BDP pathways start as applications. Privileged roles are assigned after review."
        primary={{ label: "For Partners", href: "/for-partners" }}
        secondary={{ label: "Browse events", href: "/events" }}
      />
    </>
  );
}
