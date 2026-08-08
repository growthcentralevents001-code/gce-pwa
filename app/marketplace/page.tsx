import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GlassPanel } from "@/components/marketing/GlassPanel";

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
        eyebrow="GCE Marketplace"
        headline="Events, Offers, and venue experiences"
        description="Browse published marketplace inventory publicly, then continue into the canonical customer journey for booking and claims. Marketplace Affiliate is not an active pathway."
        primaryCta={{ label: "Browse Events", href: "/events" }}
        secondaryCta={{ label: "Browse Offers", href: "/offers" }}
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Events",
              d: "Public discovery and SEO wrappers share the same marketplace truth as Customer CX.",
              href: "/events",
            },
            {
              t: "Offers",
              d: "Offer listings lead into customer claim flows — no parallel redemption engine.",
              href: "/offers",
            },
            {
              t: "Venues",
              d: "Explore published venues. Venue partner applications remain approval-based.",
              href: "/venues",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.t} delay={i * 0.05}>
              <a href={item.href} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <GlassPanel className="h-full p-5 transition-transform duration-300 hover:-translate-y-1">
                  <h2 className="font-body text-lg font-semibold">{item.t}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
                </GlassPanel>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <CtaBand
        title="Operate on the Marketplace"
        description="Venue and Marketplace BDP pathways start as applications. Privileged roles are assigned after review."
        primary={{ label: "For Partners", href: "/for-partners" }}
        secondary={{ label: "Customer app", href: "/customer" }}
      />
    </>
  );
}
