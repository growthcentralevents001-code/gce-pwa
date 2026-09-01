"use client";

import { InteractiveTravelCard } from "@/components/ui/3d-card";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";

const VERTICALS = [
  {
    title: "GCE Connect",
    description:
      "Curated business networking Circles, structured referrals, and in-app Lead Assist for members.",
    actionText: "Explore Connect",
    href: "/connect",
  },
  {
    title: "GCE Marketplace",
    description:
      "Discover Events, Offers, and venue experiences — booking continues in the customer journey.",
    actionText: "Explore Marketplace",
    href: "/marketplace",
  },
  {
    title: "GCE Enterprise",
    description:
      "Programme design and commercial architecture for organisations — scoped engagements, not blank guarantees.",
    actionText: "Explore Enterprise",
    href: "/enterprise",
  },
] as const;

/** Homepage vertical showcase using 3D tilt cards. */
export function Vertical3dSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <AnimatedSection>
        <h2 className="font-body text-2xl font-semibold text-foreground sm:text-3xl">
          Three verticals. One GCE.
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Sub-brands stay inside their parent vertical — never peer master
          companies.
        </p>
      </AnimatedSection>

      <GlassFilter />

      <div className="relative mt-12">
        <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {VERTICALS.map((item, index) => (
            <AnimatedSection
              key={item.href}
              variant="rise"
              delay={0.08 * index}
              className="relative z-0 w-full max-w-80 hover:z-10"
            >
              <div className="w-full" style={{ perspective: "1000px" }}>
                <InteractiveTravelCard
                  title={item.title}
                  description={item.description}
                  actionText={item.actionText}
                  href={item.href}
                  surface="glass"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
