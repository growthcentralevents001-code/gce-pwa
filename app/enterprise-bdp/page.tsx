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
  EBDP_ATTRIBUTION_COPY,
  EBDP_CLIENTS_PER_PACK,
  EBDP_EARNINGS_DISCLAIMER,
  EBDP_ENTITLEMENT_COPY,
  EBDP_HANDOFF_COPY,
  EBDP_PERSON_MAX_PACKS,
  ENTERPRISE_BDP_ROLE_LABEL,
} from "@/lib/frontend/enterprise/format";

export const metadata = publicMetadata({
  title: "Enterprise BDP Opportunity",
  description:
    "Become an Enterprise BDP — develop corporate opportunities and bring structured B2B requirements into GCE Enterprise under platform attribution and approval.",
  path: "/enterprise-bdp",
});

const APPLY_HREF = "/login?next=/enterprise-bdp/apply";

const SECTIONS = [
  {
    id: "what",
    title: `What is an ${ENTERPRISE_BDP_ROLE_LABEL}?`,
    body: `${ENTERPRISE_BDP_ROLE_LABEL} is an independent GCE commercial partner focused on corporate relationship development and qualified B2B opportunity generation. You bring structured requirements into GCE Enterprise — you are not the final approver, quotation authority, project execution owner, or Finance administrator.`,
  },
  {
    id: "focus",
    title: "Corporate opportunity focus",
    body: "Build relevant corporate relationships, understand genuine enterprise requirements, and capture structured opportunities that enter the canonical GCE Enterprise workflow after qualification and platform attribution.",
  },
  {
    id: "handoff",
    title: "Into GCE Enterprise",
    body: EBDP_HANDOFF_COPY,
  },
  {
    id: "attribution",
    title: "Client-based attribution",
    body: EBDP_ATTRIBUTION_COPY,
  },
  {
    id: "capacity",
    title: "Franchise Pack capacity",
    body: `Each Enterprise BDP Franchise Pack supports up to ${EBDP_CLIENTS_PER_PACK} active attributed clients. A person may hold up to ${EBDP_PERSON_MAX_PACKS} packs subject to platform approval.`,
  },
  {
    id: "earnings",
    title: "Performance-linked earning concept",
    body: "On successful eligible attributed Enterprise projects, Enterprise BDP may receive 25% of eligible GCE platform commission — calculated on the backend from governed financial truth, not quotation or project value alone.",
  },
  {
    id: "eligibility",
    title: "Application & activation",
    body: "Apply for a Franchise Pack package. Platform review, terms acceptance, and Ops approval precede activation. Applicants cannot self-approve or self-grant the Enterprise BDP workspace.",
  },
] as const;

const FAQS = [
  {
    q: "Is this salaried employment or guaranteed commission?",
    a: "No. Enterprise BDP is an independent commercial partner pathway. Earnings are performance-linked on eligible attributed projects — not guaranteed projects, contracts, or monthly income.",
  },
  {
    q: "Do I approve quotations or run project execution?",
    a: "No. Enterprise Platform Experts and governed platform roles handle requirement structuring, proposals, quotations, Finance co-sign where required, and project execution. Enterprise BDP receives read-only status visibility for attributed work.",
  },
  {
    q: "How is Enterprise BDP earning calculated?",
    a: EBDP_ENTITLEMENT_COPY,
  },
  {
    q: "Is this the same as Enterprise Client intake?",
    a: "No. Enterprise Client representatives submit requirements for their organisation. Enterprise BDP develops corporate opportunities and attribution for clients they source — a separate governed partner pathway.",
  },
] as const;

export default function EnterpriseBdpOpportunityPage() {
  return (
    <div className="relative isolate">
      <PageAtmosphere />

      <MarketingHero
        headline={`${ENTERPRISE_BDP_ROLE_LABEL} opportunity`}
        description="Develop corporate opportunities and bring qualified B2B requirements into GCE Enterprise. Application required — platform approval before activation."
        primaryCta={{ label: "Apply now", href: APPLY_HREF }}
        secondaryCta={{ label: "Enterprise Client pathway", href: "/enterprise" }}
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
            <h2 className="font-body text-lg font-semibold">Earnings notice</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {EBDP_EARNINGS_DISCLAIMER}
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
              Sign in or create a GCE account, then complete the Enterprise BDP
              Franchise Pack application.
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
