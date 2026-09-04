import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import HeroBanner from "@/app/components/HeroBanner";
import { Vertical3dSection } from "@/components/marketing/Vertical3dSection";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { PageAtmosphere } from "@/components/marketing/PageAtmosphere";
import { ParallaxLayer } from "@/components/marketing/ParallaxLayer";
import { Button } from "@/components/ui/button";

/**
 * Dissolves the wash into the hero above and the footer below. The hero already
 * resolves to `--background` at its bottom edge, so a transparent start here
 * means the two meet on the same colour with no seam.
 */
const WASH_FEATHER =
  "linear-gradient(to bottom, transparent 0%, black 26%, black 74%, transparent 100%)";

export const metadata = publicMetadata({
  title: "GCE Events",
  description:
    "Growth Central Events — Connect. Discover. Collaborate. Grow. Structured networking, Marketplace events and offers, and Enterprise programmes across India.",
  path: "/",
});

/**
 * PUB-01 Home — hero dissolving into one continuous brand wash.
 * Homepage features the three GCE verticals only.
 */
export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <div className="relative">
        {/* Full-bleed brand wash — edge to edge, feathered top and bottom.
            The feather is anchored to the section; only the orbs drift. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ maskImage: WASH_FEATHER, WebkitMaskImage: WASH_FEATHER }}
        >
          <ParallaxLayer className="absolute inset-x-0 -inset-y-20" distance={50}>
            <PageAtmosphere heightClassName="h-full" className="z-0 opacity-80" />
          </ParallaxLayer>
        </div>

        <Vertical3dSection />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <AnimatedSection>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-body text-2xl font-semibold text-foreground sm:text-3xl">
                  Build with GCE as a partner
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Connect BDP, Marketplace BDP, Venue, and Enterprise pathways
                  start as applications — privileged roles are never
                  self-granted.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="min-h-11">
                  <Link href="/for-partners">For Partners</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-11">
                  <Link href="/memberships">Memberships</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
