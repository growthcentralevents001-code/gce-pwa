import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = publicMetadata({
  title: "GCE Circles",
  description:
    "How GCE Connect Circles work — capacity, allocation, and membership lifecycle.",
  path: "/the-circle",
});

export default function TheCirclePage() {
  return (
    <>
      <MarketingHero
        eyebrow="GCE Connect"
        headline="Circles, explained"
        description="Circles are curated networking groups with capacity and governance. Membership activation and Circle allocation are separate steps."
        primaryCta={{ label: "Memberships", href: "/memberships" }}
        compact
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Capacity",
              d: "Circles are capacity-managed. Waitlist and transfer rules apply when seats are constrained.",
            },
            {
              t: "Allocation",
              d: "Paying or activating membership does not silently equal Circle seat allocation — FD-036 keeps them distinct.",
            },
            {
              t: "Governance",
              d: "Governing Body roles exist inside Circles. They are not a Super Admin platform workspace.",
            },
          ].map((x, i) => (
            <AnimatedSection key={x.t} delay={i * 0.05}>
              <GlassPanel className="h-full p-5">
                <h2 className="font-semibold">{x.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              </GlassPanel>
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
