import Link from "next/link";
import { CalendarDays, Tag } from "lucide-react";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { VerticalCard } from "@/components/marketing/VerticalCard";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GlassPanel } from "@/components/marketing/GlassPanel";

export const metadata = publicMetadata({
  title: "GCE Events",
  description:
    "Growth Central Events — curated business networking (Connect), marketplace experiences, and enterprise programmes.",
  path: "/",
});

/**
 * PUB-01 Home — Batch 1 rebuild.
 * Replaces legacy Home + HeroBanner composition with MASTER-aligned marketing.
 */
export default function HomePage() {
  return (
    <>
      <MarketingHero
        eyebrow="Growth Central Events"
        headline="Where business networks meet marketplace experiences"
        description="GCE connects curated Circles, discovers Events & Offers, and supports enterprise programmes — one platform under Logixia Solutions Private Limited."
        primaryCta={{ label: "Explore Events", href: "/events" }}
        secondaryCta={{ label: "Join GCE", href: "/signup" }}
        showBrandHierarchy
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <AnimatedSection>
          <h2 className="font-body text-2xl font-semibold text-foreground sm:text-3xl">
            Three verticals. One GCE.
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sub-brands stay inside their parent vertical — never peer master
            companies.
          </p>
        </AnimatedSection>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <AnimatedSection delay={0.05}>
            <VerticalCard
              eyebrow="Vertical 1"
              title="GCE Connect"
              description="Curated business networking Circles, structured referrals, and in-app Lead Assist for members."
              href="/connect"
              icon="users"
              accent="connect"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <VerticalCard
              eyebrow="Vertical 2"
              title="GCE Marketplace"
              description="Discover Events, Offers, and venue experiences — booking continues in the customer journey."
              href="/marketplace"
              icon="store"
              accent="marketplace"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <VerticalCard
              eyebrow="Vertical 3"
              title="GCE Enterprise"
              description="Programme design and commercial architecture for organisations — scoped engagements, not blank guarantees."
              href="/enterprise"
              icon="briefcase"
              accent="enterprise"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          <AnimatedSection>
            <GlassPanel className="h-full p-6 transition-transform duration-300 hover:-translate-y-0.5">
              <CalendarDays className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-body text-lg font-semibold">Events</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse published marketplace events. Ticket purchase and seat
                truth live in the customer experience — not a second booking
                engine.
              </p>
              <Link
                href="/events"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                View events
              </Link>
            </GlassPanel>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <GlassPanel className="h-full p-6 transition-transform duration-300 hover:-translate-y-0.5">
              <Tag className="h-6 w-6 text-info" aria-hidden />
              <h3 className="mt-3 font-body text-lg font-semibold">Offers</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover marketplace offers and continue into the canonical
                customer claim path when you are ready.
              </p>
              <Link
                href="/offers"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                View offers
              </Link>
            </GlassPanel>
          </AnimatedSection>
        </div>
      </section>

      <CtaBand
        title="Build with GCE as a partner"
        description="Connect BDP, Marketplace BDP, Venue, and Enterprise pathways start as applications — privileged roles are never self-granted."
        primary={{ label: "For Partners", href: "/for-partners" }}
        secondary={{ label: "Memberships", href: "/memberships" }}
      />
    </>
  );
}
