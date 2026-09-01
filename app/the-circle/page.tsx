import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { PageAtmosphere } from "@/components/marketing/PageAtmosphere";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { PowerSectorGrid } from "@/components/connect/PowerSectorGrid";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { CIRCLE_CAPACITY_MAX } from "@/lib/frontend/connect/format";
import { CONNECT_BDP_ROLE_LABEL } from "@/lib/frontend/partner/format";

export const metadata = publicMetadata({
  title: "How GCE Connect Circle Works",
  description:
    "Verified professionals, capacity-managed Circles, four GC Power Sectors, structured meetings, and app-based referrals — GCE Connect.",
  path: "/the-circle",
});

const APPLY_HREF = "/login?next=/memberships/apply";

const JOURNEY_STEPS = [
  "Verified professional",
  "Category & specialisation",
  "Circle seat approval",
  "GC Power Sector placement",
  "Structured Circle membership",
  "Regular Circle meetings",
  "App-based referrals",
  "Relevant business relationships",
] as const;

const SECTIONS = [
  {
    id: "verified",
    title: "Verified professionals",
    body: "GCE Connect is built for verified business professionals. Identity and membership approval are separate from account creation — unverified applicants do not become active Circle members.",
  },
  {
    id: "capacity",
    title: `Maximum ${CIRCLE_CAPACITY_MAX} members per Circle`,
    body: `Each GCE Connect Circle supports a maximum of ${CIRCLE_CAPACITY_MAX} members. Capacity is enforced platform-side — when a Circle is full, additional seat allocation is denied until a seat opens.`,
  },
  {
    id: "sectors",
    title: "Four GC Power Sectors",
    body: "Every Circle is organised across four fixed GC Power Sectors. Members are placed by specialisation and sector — flexible distribution, not a rigid 10/10/10/10 split.",
  },
  {
    id: "taxonomy",
    title: "Category, specialisation & Tags",
    body: "Members carry a business specialisation and optional Tags so introductions stay relevant. Directory search and filters help you find the right expertise inside your Circle.",
  },
  {
    id: "meetings",
    title: "Meet every 15 days",
    body: "Circles meet every 15 days for structured business discussions and relationship-building. Digital tools support preparation and follow-up — they do not replace in-person Circle meetings.",
  },
  {
    id: "referrals",
    title: "App-based referrals",
    body: "Official business referrals are created and managed through GCE Lead Assist in the app — not exchanged verbally in meetings or via WhatsApp.",
  },
  {
    id: "bdp",
    title: `${CONNECT_BDP_ROLE_LABEL} support`,
    body: `${CONNECT_BDP_ROLE_LABEL} partners assist Circle formation, professional identification, verification support, and onboarding coordination. The platform confirms attribution, allocation, and lifecycle — partners do not self-approve.`,
  },
  {
    id: "progress",
    title: "Circle progress & capacity",
    body: "Authorized members see real Circle status, member count, remaining seats, sector distribution, and referral activity — backed by platform data, not marketing placeholders.",
  },
] as const;

const FAQS = [
  {
    q: "Does paying for membership guarantee a Circle seat?",
    a: "No. Account creation, membership approval, activation, and Circle seat allocation are separate governed steps.",
  },
  {
    q: "How many members can a Circle have?",
    a: `Each Circle supports up to ${CIRCLE_CAPACITY_MAX} members at full capacity. Individual Circles may have fewer members while forming.`,
  },
  {
    q: "Where do referrals happen?",
    a: "Through GCE Lead Assist in the app. Meetings are for relationship-building — referrals are recorded and managed digitally.",
  },
  {
    q: "What are GC Power Sectors?",
    a: "Four fixed sectors that organise members by industry family: Real Estate & Construction; Industrial & Logistics; Professional & Financial; Consumer & Lifestyle.",
  },
] as const;

export default function TheCirclePage() {
  return (
    <div className="relative isolate">
      <PageAtmosphere />

      <MarketingHero
        headline="How GCE Connect Circle works"
        description="Structured business networks for verified professionals — capacity-managed, sector-organised, and referral-ready through the GCE app."
        primaryCta={{ label: "Join GCE Connect", href: APPLY_HREF }}
        secondaryCta={{ label: "View membership plans", href: "/memberships" }}
        compact
        seamless
      />

      <section className="mx-auto max-w-3xl px-4 py-6 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {CIRCLE_CAPACITY_MAX} Members · 4 GC Power Sectors
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Each GCE Connect Circle supports a maximum of {CIRCLE_CAPACITY_MAX}{" "}
          members, organised across four GC Power Sectors to create a focused and
          structured business ecosystem — not every Circle has {CIRCLE_CAPACITY_MAX}{" "}
          members while forming.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <AnimatedSection>
          <div className={`${GCE_SURFACE.card} rounded-2xl p-6`}>
            <h2 className="font-body text-lg font-semibold">Your journey</h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {JOURNEY_STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Four GC Power Sectors
        </h2>
        <PowerSectorGrid />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {SECTIONS.map((section, i) => (
            <AnimatedSection key={section.id} delay={i * 0.03}>
              <div
                id={section.id}
                className={`${GCE_SURFACE.card} h-full scroll-mt-24 rounded-2xl p-6`}
              >
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
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h2 className="mb-4 text-center text-xl font-semibold">Common questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left text-sm">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 text-center sm:px-6">
        <Button asChild size="lg" className="min-h-11">
          <Link href={APPLY_HREF}>Apply for Membership</Link>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login?next=/memberships/apply" className="text-primary hover:underline">
            Sign in to continue your application
          </Link>
        </p>
      </section>

      <CtaBand
        title="Join GCE Connect"
        description="Apply as a verified professional. Platform review required before membership activation and Circle allocation."
        primary={{ label: "Apply for Membership", href: APPLY_HREF }}
        secondary={{ label: "Explore GCE Connect", href: "/connect" }}
      />
    </div>
  );
}
