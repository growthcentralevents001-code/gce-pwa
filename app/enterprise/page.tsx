import { publicMetadata } from "@/lib/frontend/seo/metadata";
import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Button } from "@/components/ui/button";

export const metadata = publicMetadata({
  title: "GCE Enterprise",
  description:
    "GCE Enterprise handles corporate and B2B requirements through structured review, expert coordination, proposals, quotations, and project-status visibility.",
  path: "/enterprise",
});

export default function EnterpriseLandingPage() {
  return (
    <>
      <MarketingHero
        headline="Enterprise Problems → GCE Solutions"
        description="GCE Enterprise is a governed B2B workflow: submit a requirement, receive structured GCE review, work with appropriate experts, move through proposal and quotation, then track project execution — without guaranteed outcomes or invented case studies."
        primaryCta={{ label: "Submit a requirement", href: "/enterprise/intake" }}
        secondaryCta={{ label: "Client workspace", href: "/dashboard/enterprise-client" }}
        compact
        showBrandMark={false}
      />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <AnimatedSection className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Structured process
            </p>
            <h2 className="mt-2 font-body text-xl font-semibold">
              One canonical Enterprise client workflow
            </h2>
            <ol className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>1. Submit a real Enterprise requirement</li>
              <li>2. GCE review and qualification</li>
              <li>3. Appropriate expert / delivery team assignment</li>
              <li>4. Proposal and quotation (distinct commercial steps)</li>
              <li>5. Project execution with status visibility</li>
            </ol>
          </AnimatedSection>
          <AnimatedSection className="md:col-span-5" delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What we do not claim
            </p>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
              No guaranteed project success, delivery, cost savings, or business results.
              Scope and commercial terms remain engagement-specific. Settlement execution
              remains governed separately in Finance.
            </p>
            <Button asChild className="mt-4 min-h-11">
              <Link href="/enterprise/intake">Start requirement intake</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <CtaBand
        title="Ready to describe your Enterprise requirement?"
        description="Authenticated Enterprise Client representatives submit requirements through one intake flow — not a separate marketing lead form."
        primary={{ label: "Submit requirement", href: "/enterprise/intake" }}
        secondary={{ label: "Partner pathways", href: "/for-partners" }}
      />
    </>
  );
}
