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
  CONNECT_BDP_EARNINGS_DISCLAIMER,
  CONNECT_BDP_ROLE_LABEL,
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
  formatCommissionRateLabel,
} from "@/lib/frontend/partner/format";
import { CIRCLE_CAPACITY_MAX } from "@/lib/frontend/connect/format";

export const metadata = publicMetadata({
  title: "Connect BDP Opportunity",
  description:
    "Become a Connect BDP — independent commercial partner building GCE Connect Circles under platform assignment and approval.",
  path: "/connect-bdp",
});

const APPLY_HREF = "/login?next=/connect-bdp/apply";

const SECTIONS = [
  {
    id: "what",
    title: `What is a ${CONNECT_BDP_ROLE_LABEL}?`,
    body: `${CONNECT_BDP_ROLE_LABEL} is an independent GCE business partner authorised to operate an approved Connect BDP Franchise Unit within a platform-assigned territory. You are not an employee, city owner, or authority to bind Logixia.`,
  },
  {
    id: "why",
    title: `Why become a ${CONNECT_BDP_ROLE_LABEL}?`,
    body: `Build curated business communities through GCE Connect Circles, earn ${formatCommissionRateLabel()} of eligible attributed Connect subscription revenue, and grow with structured platform support — training, Circle-formation tools, and operational guidance under Founder-approved rules.`,
  },
  {
    id: "responsibilities",
    title: "Your responsibilities",
    body: "Source and support verified professionals, assist membership onboarding through approved flows, propose attribution for platform confirmation, support Circle governance establishment, and maintain compliance with platform policies. You cannot self-approve units, attribution, or Circle lifecycle changes.",
  },
  {
    id: "circles",
    title: "Circle-building responsibility",
    body: `Each Franchise Unit may develop up to ${CONNECT_BDP_TARGET_CIRCLES} platform-activated Circles within ${CONNECT_BDP_TARGET_MONTHS} months. Circles are capacity-managed (${CIRCLE_CAPACITY_MAX} members at full capacity), structured around geography and specialisation, with in-app referrals — not spam outreach.`,
  },
  {
    id: "benefits",
    title: "Opportunity & benefits",
    body: "Commercial licence to operate a Franchise Unit, partner dashboard access, Circle portfolio tools, attribution workflow, commission entitlements on valid attributed revenue, and platform operational support. Territory assignment is performance-protected — not permanent ownership.",
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: "Experienced business professionals with the ability to build and nurture a verified business community in an assigned city. Application, qualification, verification, and platform approval are required. Payment alone does not activate a unit.",
  },
  {
    id: "geography",
    title: "City & operating area",
    body: "Connect BDP operates on a city-based model. Platform Ops assigns your Performance-Protected Assigned Territory after application review — you cannot self-assign city or zone scope.",
  },
] as const;

const FAQS = [
  {
    q: "Is this an instant role after signup?",
    a: "No. Signup creates identity only. Connect BDP is an application subject to qualification, verification, training, and platform approval.",
  },
  {
    q: "How much can I earn?",
    a: `Connect BDP earns ${formatCommissionRateLabel()} of eligible attributed Connect subscription revenue where valid attribution exists. Organic memberships without attribution do not generate Connect BDP commission. Earnings are performance-based and not guaranteed.`,
  },
  {
    q: "How many Circles can I build?",
    a: `Each Franchise Unit targets ${CONNECT_BDP_TARGET_CIRCLES} platform-activated Circles in ${CONNECT_BDP_TARGET_MONTHS} months, with up to ${CONNECT_BDP_TARGET_CIRCLES} Circles in active portfolio capacity per unit.`,
  },
  {
    q: "Can I activate Circles myself?",
    a: "No. Connect BDP initiates and supports Circle development but cannot independently activate, suspend, or change Circle lifecycle status.",
  },
  {
    q: "What about BDM or ZBP pathways?",
    a: "Legacy BDM and ZBP commercial tracks are inactive. Connect BDP is the current Connect partner pathway.",
  },
] as const;

export default function ConnectBdpOpportunityPage() {
  return (
    <div className="relative isolate">
      <PageAtmosphere />

      <MarketingHero
        headline={`${CONNECT_BDP_ROLE_LABEL} opportunity`}
        description="Build GCE Connect Circles as an independent commercial partner. Application required — approval before activation."
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
            <h2 className="font-body text-lg font-semibold">Earnings notice</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {CONNECT_BDP_EARNINGS_DISCLAIMER}
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
              Sign in or create a GCE account, then complete the Connect BDP
              application form with your professional details.
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
