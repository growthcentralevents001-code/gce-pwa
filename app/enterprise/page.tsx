import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";

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
        headline="Enterprise — project and milestone programmes"
        description="GCE Enterprise is a Project Command Center: opportunities, quotations, milestones, and componentised commercial rules. Settlement lives in Finance. GCE does not automatically physically execute every project."
        primaryCta={{ label: "Talk to us", href: "/contact" }}
        secondaryCta={{ label: "Partner pathways", href: "/for-partners" }}
        compact
        showBrandMark={false}
      />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <AnimatedSection className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              What Enterprise is
            </p>
            <h2 className="mt-2 font-body text-xl font-semibold">
              A vertical for client programmes
            </h2>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Enterprise Client organisations, Enterprise BDP representation, and
              structured commercial operating rules under Founder Decisions.
              Delivery structure is project-specific.
            </p>
          </AnimatedSection>
          <AnimatedSection className="md:col-span-5" delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What we do not claim
            </p>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
              We do not invent case studies, client logos, or promises that GCE
              physically delivers every workstream. Scope is engagement-specific.
              Interest is an inquiry — not automatic entitlement.
            </p>
          </AnimatedSection>
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
