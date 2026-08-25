import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = publicMetadata({
  title: "GCE Circles",
  description:
    "How GCE Connect Circles work — capacity, allocation, and membership lifecycle.",
  path: "/the-circle",
});

const CIRCLE_POINTS = [
  {
    t: "Capacity",
    d: "Circles are capacity-managed. Waitlist and transfer rules apply when seats are constrained.",
  },
  {
    t: "Allocation",
    d: "Paying or activating membership does not silently equal Circle seat allocation — those remain distinct steps.",
  },
  {
    t: "Governance",
    d: "Governing Body roles exist inside Circles. They are not a Super Admin platform workspace.",
  },
] as const;

export default function TheCirclePage() {
  return (
    <>
      <MarketingHero
        headline="Circles, explained"
        description="Circles are curated networking groups with capacity and governance. Membership activation and Circle allocation are separate steps."
        primaryCta={{ label: "Memberships", href: "/memberships" }}
        compact
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
          {CIRCLE_POINTS.map((x, i) => (
            <AnimatedSection
              key={x.t}
              delay={i * 0.05}
              className={i === 0 ? "md:row-span-2" : undefined}
            >
              <div className={`${GCE_SURFACE.card} h-full rounded-2xl p-6`}>
                <h2 className="font-semibold">{x.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {x.d}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
      <CtaBand
        title="Start with Associate membership"
        description="Create your identity, then proceed through approved Connect membership flows."
        primary={{ label: "View plans", href: "/memberships" }}
        secondary={{ label: "Join", href: "/signup" }}
      />
    </>
  );
}
