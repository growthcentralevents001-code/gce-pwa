import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Button } from "@/components/ui/button";

export const metadata = publicMetadata({
  title: "For Partners",
  description:
    "Apply to Connect BDP, Marketplace BDP, Venue, or Enterprise pathways — applications, not instant roles.",
  path: "/for-partners",
});

const TRACKS = [
  {
    id: "connect",
    title: "Connect BDP",
    body: "Grow Connect Circles commercially under approved Connect BDP rules. Application required — no self-grant.",
    href: "/connect-bdp",
  },
  {
    id: "marketplace",
    title: "Marketplace BDP",
    body: "Marketplace BDP units operate under FD-033 / FD-037. Affiliate tracks are inactive.",
    href: "/apply/role?intent=marketplace-bdp",
  },
  {
    id: "venue",
    title: "Venue Partner",
    body: "List and operate venues in the Marketplace ecosystem through the Venue pathway.",
    href: "/apply/role?intent=venue",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    body: "Enterprise Client or Enterprise BDP interest is routed for review — not automatic entitlement.",
    href: "/apply/role?intent=enterprise",
  },
] as const;

export default function ForPartnersPage() {
  return (
    <>
      <MarketingHero
        headline="Build with GCE as a partner"
        description="Partner pathways are applications and approvals. Signup creates identity only — privileged roles never auto-activate."
        primaryCta={{ label: "Choose a pathway", href: "/apply/role" }}
        secondaryCta={{ label: "Create account", href: "/signup" }}
        compact
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {TRACKS.map((t, i) => (
            <AnimatedSection key={t.id} delay={i * 0.04}>
              <div className={`${GCE_SURFACE.card} flex h-full flex-col rounded-2xl p-6`}>
                <h2 className="font-body text-xl font-semibold">{t.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
                <Button asChild className="mt-6 min-h-11 w-fit">
                  <Link href={t.href}>Continue</Link>
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Inactive / retired marketing tracks such as ZBP and Marketplace
          Affiliate are not offered here.
        </p>
      </section>
    </>
  );
}
