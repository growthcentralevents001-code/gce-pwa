import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    href: "/apply/role?intent=connect-bdp",
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
        eyebrow="Partners"
        headline="Build with GCE"
        description="Partner pathways are applications and approvals. Signup creates identity only — privileged roles never auto-activate."
        primaryCta={{ label: "Choose a pathway", href: "/apply/role" }}
        secondaryCta={{ label: "Create account", href: "/signup" }}
        compact
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Tabs defaultValue="connect">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            {TRACKS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="min-h-10">
                {t.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {TRACKS.map((t) => (
            <TabsContent key={t.id} value={t.id}>
              <AnimatedSection>
                <GlassPanel className="p-6">
                  <h2 className="font-body text-xl font-semibold">{t.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                  <Button asChild className="mt-6 min-h-11">
                    <Link href={t.href}>Continue</Link>
                  </Button>
                </GlassPanel>
              </AnimatedSection>
            </TabsContent>
          ))}
        </Tabs>
        <p className="mt-8 text-sm text-muted-foreground">
          Inactive / retired marketing tracks such as ZBP and Marketplace
          Affiliate are not offered here.
        </p>
      </section>
    </>
  );
}
