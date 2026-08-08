import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { Button } from "@/components/ui/button";
import { ASSOCIATE_PRICE_MINOR } from "@/lib/architecture/connect/types";

export const metadata = publicMetadata({
  title: "Memberships",
  description:
    "GCE Connect Circle Membership — Associate Tier pricing and orientation.",
  path: "/memberships",
});

function formatInrMinor(minor: number): string {
  const major = minor / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(major);
}

export default function MembershipsPage() {
  const price = formatInrMinor(ASSOCIATE_PRICE_MINOR);

  return (
    <>
      <MarketingHero
        eyebrow="GCE Connect"
        headline="Associate Membership"
        description="Official launch product: GCE Connect Circle Membership — Associate Tier. Core Tier is not directly purchasable at launch."
        primaryCta={{ label: "Create account", href: "/signup" }}
        secondaryCta={{ label: "About Circles", href: "/the-circle" }}
        compact
      />
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <GlassPanel className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Associate Tier
          </p>
          <p className="mt-2 font-body text-3xl font-semibold tabular-nums">
            {price}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / quarter
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Plus applicable taxes (FD-027). Tag surcharges apply separately when
            selected.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>Circle networking under Connect architecture</li>
            <li>Specialisation + limited Tags</li>
            <li>In-app referral / Lead Assist workflows (paid features gated)</li>
          </ul>
          <Button asChild className="mt-8 min-h-11 w-full">
            <Link href="/signup">Get started</Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Completing signup does not auto-activate membership or allocate a
            Circle seat.
          </p>
        </GlassPanel>
      </section>
    </>
  );
}
