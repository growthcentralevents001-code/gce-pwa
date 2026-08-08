import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GlassPanel } from "@/components/marketing/GlassPanel";

export const metadata = publicMetadata({
  title: "GCE Enterprise",
  description:
    "GCE Enterprise programmes for organisations — scoped commercial architecture, not blank execution guarantees.",
  path: "/enterprise",
});

export default function EnterpriseLandingPage() {
  return (
    <>
      <MarketingHero
        eyebrow="GCE Enterprise"
        headline="Programmes designed with commercial clarity"
        description="GCE Enterprise supports organisational engagements through quotations, milestones, and componentised settlement rules. GCE does not automatically physically execute every project."
        primaryCta={{ label: "Talk to us", href: "/contact" }}
        secondaryCta={{ label: "Partner pathways", href: "/for-partners" }}
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              t: "What Enterprise is",
              d: "A vertical for client programmes, Enterprise BDP representation, and structured commercial operating rules under Founder Decisions.",
            },
            {
              t: "What we do not claim",
              d: "We do not invent case studies, client logos, or promises that GCE physically delivers every workstream. Scope is engagement-specific.",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.t} delay={i * 0.05}>
              <GlassPanel className="h-full p-6">
                <h2 className="font-body text-lg font-semibold">{item.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
              </GlassPanel>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <CtaBand
        title="Explore an Enterprise conversation"
        description="Interest is an inquiry — not automatic Enterprise Client or BDP entitlement."
        primary={{ label: "Contact", href: "/contact" }}
        secondary={{ label: "Apply pathway", href: "/apply/role" }}
      />
    </>
  );
}
