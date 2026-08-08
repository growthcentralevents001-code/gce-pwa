import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = publicMetadata({
  title: "About GCE",
  description:
    "About Growth Central Events — Logixia Solutions Private Limited platform for Connect, Marketplace, and Enterprise.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        eyebrow="About"
        headline="Built for serious business growth"
        description="Growth Central Events (GCE) is the platform brand of Logixia Solutions Private Limited. We organise curated networking, marketplace experiences, and enterprise programmes under one identity architecture."
        primaryCta={{ label: "Contact", href: "/contact" }}
        compact
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <AnimatedSection>
          <GlassPanel className="space-y-4 p-6 sm:p-8">
            <h2 className="font-body text-xl font-semibold">Brand hierarchy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Logixia Solutions Private Limited → GCE → GCE Connect · GCE
              Marketplace · GCE Enterprise. Vertical sub-products remain inside
              their parent vertical.
            </p>
            <h2 className="pt-4 font-body text-xl font-semibold">Identity</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              One natural person ordinarily has one base account. Commercial
              roles arrive through scoped assignments — never by inventing a
              Super Admin or legacy ZBP/Affiliate entitlement at signup.
            </p>
          </GlassPanel>
        </AnimatedSection>
      </section>
      <CtaBand
        title="See the platform"
        description="Explore verticals or create your GCE identity."
        primary={{ label: "Home", href: "/" }}
        secondary={{ label: "Join", href: "/signup" }}
      />
    </>
  );
}
