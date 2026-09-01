import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { PageAtmosphere } from "@/components/marketing/PageAtmosphere";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  ATTRIBUTED_SPLIT_COPY,
  MARKETPLACE_BDP_ROLE_LABEL,
  MBDP_EARNINGS_DISCLAIMER,
  MBDP_PERSON_MAX_UNITS,
  MBDP_STANDARD_MAX_VENUES,
  MBDP_VENUES_PER_UNIT,
  UNATTRIBUTED_SPLIT_COPY,
  VENUE_MBDP_RELATIONSHIP_COPY,
} from "@/lib/frontend/marketplace/format";

export const metadata = publicMetadata({
  title: "Marketplace BDP Opportunity",
  description:
    "Become a Marketplace BDP — identify Venue Partners, assist onboarding, and earn performance-linked commission on eligible attributed Marketplace revenue.",
  path: "/marketplace-bdp",
});

const APPLY_HREF = "/login?next=/marketplace-bdp/apply";

const SECTIONS = [
  {
    id: "what",
    title: `What is a ${MARKETPLACE_BDP_ROLE_LABEL}?`,
    body: `${MARKETPLACE_BDP_ROLE_LABEL} is an appointed GCE commercial partner who develops Venue Partner relationships on GCE Marketplace. You assist verification and onboarding, act as the Marketplace relationship contact for attributed venues, and support Events and Offers — you are not an employee, city owner, or authority to bind Logixia.`,
  },
  {
    id: "pipeline",
    title: "Venue pipeline & onboarding",
    body: "Identify Venue prospects, capture governed business details, assist Venue onboarding, and recommend venues for Platform Marketplace Ops final approval. Your recommendation is not platform approval — activation remains server-side.",
  },
  {
    id: "attribution",
    title: "Venue attribution",
    body: "Each onboarded Venue can be formally attributed to your Franchise Unit with auditable evidence. Attribution determines eligible commission — organic/unattributed venues do not generate Marketplace BDP commission.",
  },
  {
    id: "units",
    title: "Franchise Units & capacity",
    body: `Each unit supports up to ${MBDP_VENUES_PER_UNIT} active Venue Partners. A person may hold up to ${MBDP_PERSON_MAX_UNITS} units (${MBDP_STANDARD_MAX_VENUES} venues standard maximum). This is venue-attribution based — not city or territory ownership.`,
  },
  {
    id: "economics",
    title: "Eligible commission model",
    body: `${ATTRIBUTED_SPLIT_COPY}. ${UNATTRIBUTED_SPLIT_COPY} Offer Claims and redemptions alone are not automatic revenue or commission.`,
  },
  {
    id: "relationship",
    title: "Venue relationship management",
    body: VENUE_MBDP_RELATIONSHIP_COPY,
  },
  {
    id: "eligibility",
    title: "Application & activation",
    body: "Apply for a Franchise Unit package (Direct or Finance-Recovery). Platform review, terms acceptance, and Ops approval precede activation. Package payment alone does not activate your unit or assign venues.",
  },
] as const;

const FAQS = [
  {
    q: "Is this an instant role after signup?",
    a: "No. Signup creates identity only. Marketplace BDP is an application subject to review, verification, and Platform Ops approval before activation.",
  },
  {
    q: "Can I final-approve my recommended venues?",
    a: "No. Marketplace BDP assists and recommends. Platform Marketplace Ops performs final Venue, Event, and Offer approval.",
  },
  {
    q: "How much can I earn?",
    a: "Commission is performance-linked on eligible attributed Marketplace Event revenue (10% of eligible basis when attribution is valid). Unattributed revenue earns 0% MBDP share. Earnings are not guaranteed.",
  },
  {
    q: "Do Offer Claims generate commission?",
    a: "No. Offer Claims and redemptions are not automatic revenue. Commission follows eligible attributed Marketplace transactions per FD-037.",
  },
  {
    q: "What about ZBP or Marketplace Affiliate?",
    a: "Legacy ZBP and Marketplace Affiliate tracks are inactive. Marketplace BDP is the current Marketplace partner pathway.",
  },
] as const;

export default function MarketplaceBdpOpportunityPage() {
  return (
    <div className="relative isolate">
      <PageAtmosphere />

      <MarketingHero
        headline={`${MARKETPLACE_BDP_ROLE_LABEL} opportunity`}
        description="Develop Venue Partner relationships on GCE Marketplace. Application required — Platform Ops approval before activation."
        primaryCta={{ label: "Apply now", href: APPLY_HREF }}
        secondaryCta={{ label: "All partner pathways", href: "/for-partners" }}
        compact
        seamless
      />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {SECTIONS.map((section, i) => (
            <AnimatedSection key={section.id} delay={i * 0.03}>
              <div className={`${GCE_SURFACE.card} h-full rounded-2xl p-6`}>
                <h2 className="font-body text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-10">
          <div className={`${GCE_SURFACE.card} rounded-2xl p-6`}>
            <h2 className="font-body text-lg font-semibold">
              Recurring earning potential
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Active attributed Venue relationships may create recurring earning
              potential as eligible Marketplace activity continues — actual
              earnings depend on Venue performance, attribution validity, and
              applicable rules. This is opportunity, not assured income.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-10">
          <div className={`${GCE_SURFACE.card} rounded-2xl p-6`}>
            <h2 className="font-body text-lg font-semibold">Earnings notice</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {MBDP_EARNINGS_DISCLAIMER}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-10">
          <h2 className="font-body text-xl font-semibold text-foreground">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-4">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>

        <AnimatedSection className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-body text-xl font-semibold text-foreground">
              Ready to apply?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Sign in or create a GCE account, then complete the Marketplace BDP
              Franchise Unit application.
            </p>
          </div>
          <Button asChild size="lg" className="min-h-11 shrink-0">
            <Link href={APPLY_HREF}>Apply now</Link>
          </Button>
        </AnimatedSection>
      </section>
    </div>
  );
}
