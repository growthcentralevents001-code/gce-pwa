import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = publicMetadata({
  title: "GCE Connect",
  description:
    "Curated business networking Circles, structured referrals, and Lead Assist — GCE Connect.",
  path: "/connect",
});

export default function ConnectLandingPage() {
  return (
    <>
      <MarketingHero
        eyebrow="GCE Connect"
        headline="Curated business networking that stays structured"
        description="Join Circles organised around geography and specialisation. Share referrals in-app, manage Tags, and grow through disciplined networking — not spam."
        primaryCta={{ label: "View memberships", href: "/memberships" }}
        secondaryCta={{ label: "How Circles work", href: "/the-circle" }}
        compact
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Circles",
              d: "Capacity-managed Circles with clear membership lifecycle — activation and Circle allocation remain separate.",
            },
            {
              t: "Specialisation & Tags",
              d: "Business specialisation and limited Tags keep introductions relevant. Surprises are priced by canonical rules.",
            },
            {
              t: "Lead Assist",
              d: "In-app referral workflows for members. Paid Lead Assist commercial activation remains gated until Founder approval.",
            },
          ].map((item, i) => (
            <AnimatedSection key={item.t} delay={i * 0.05}>
              <GlassPanel className="h-full p-5">
                <h2 className="font-body text-lg font-semibold">{item.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
              </GlassPanel>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12">
          <h2 className="font-body text-xl font-semibold">Good to know</h2>
          <Accordion type="single" collapsible className="mt-4 max-w-2xl">
            <AccordionItem value="pricing">
              <AccordionTrigger>Membership pricing</AccordionTrigger>
              <AccordionContent>
                Launch product is GCE Connect Circle Membership — Associate Tier
                at ₹6,000 per quarter plus applicable taxes (FD-027). Core Tier
                is not directly purchasable at launch.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="roles">
              <AccordionTrigger>Partner roles</AccordionTrigger>
              <AccordionContent>
                Connect BDP and related pathways are applications subject to
                approval. Signup never grants privileged commercial roles.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="legacy">
              <AccordionTrigger>Inactive legacy tracks</AccordionTrigger>
              <AccordionContent>
                ZBP commercial model and Marketplace Affiliate are inactive.
                Historical labels are not active partner pathways.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AnimatedSection>
      </section>

      <CtaBand
        title="Ready to join Connect?"
        description="Create your GCE identity first, then start membership onboarding through approved flows."
        primary={{ label: "Create account", href: "/signup" }}
        secondary={{ label: "Partner pathways", href: "/for-partners" }}
      />
      <p className="pb-8 text-center text-sm text-muted-foreground">
        Prefer Circles detail?{" "}
        <Link href="/the-circle" className="text-primary hover:underline">
          Read about Circles
        </Link>
      </p>
    </>
  );
}
