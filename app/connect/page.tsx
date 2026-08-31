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
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveSignedInMembershipCta } from "@/lib/frontend/connect/membershipCta";

export const metadata = publicMetadata({
  title: "GCE Connect",
  description:
    "Curated business networking Circles, structured referrals, and Lead Assist — GCE Connect.",
  path: "/connect",
});

const FEATURES = [
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
] as const;

/**
 * Connect landing — Zoom-style continuous atmosphere (brand orange wash).
 */
export default async function ConnectLandingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signedInCta = user
    ? await resolveSignedInMembershipCta(user.id)
    : null;

  return (
    <div className="relative isolate">
      <PageAtmosphere />

      <MarketingHero
        headline="Connect — curated business networking"
        description="Join Circles organised around geography and specialisation. Share referrals in-app, manage Tags, and grow through disciplined networking — not spam."
        primaryCta={{ label: "View memberships", href: "/memberships" }}
        secondaryCta={{ label: "How Circles work", href: "/the-circle" }}
        compact
        seamless
      />

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          {FEATURES.map((item, i) => (
            <AnimatedSection key={item.t} delay={i * 0.05}>
              <h2 className="font-body text-lg font-semibold text-foreground">
                {item.t}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.d}
              </p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-16">
          <h2 className="font-body text-xl font-semibold text-foreground">
            Good to know
          </h2>
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

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6">
        <AnimatedSection>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-body text-2xl font-semibold text-foreground sm:text-3xl">
                Ready to join Connect?
              </h2>
              <p className="mt-3 text-muted-foreground">
                {signedInCta
                  ? "Continue membership onboarding through approved flows. Online Associate purchase is not live yet — account, paid membership, and Circle seat stay separate."
                  : "Create your GCE identity first, then start membership onboarding through approved flows."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="min-h-11">
                <Link href={signedInCta?.href ?? "/signup"}>
                  {signedInCta ? signedInCta.heroLabel : "Create account"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-11">
                <Link href="/connect-bdp">Connect BDP opportunity</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <p className="mt-10 pb-4 text-center text-sm text-muted-foreground">
          Prefer Circles detail?{" "}
          <Link href="/the-circle" className="text-primary hover:underline">
            Read about Circles
          </Link>
        </p>
      </div>
    </div>
  );
}
