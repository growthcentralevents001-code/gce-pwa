import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Button } from "@/components/ui/button";
import { ASSOCIATE_PRICE_MINOR } from "@/lib/architecture/connect/types";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveSignedInMembershipCta } from "@/lib/frontend/connect/membershipCta";

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

export default async function MembershipsPage() {
  const price = formatInrMinor(ASSOCIATE_PRICE_MINOR);
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signedInCta = user
    ? await resolveSignedInMembershipCta(user.id)
    : null;

  const primaryCta = signedInCta
    ? { label: signedInCta.heroLabel, href: signedInCta.href }
    : { label: "Create account", href: "/signup" };

  const cardHref = signedInCta?.href ?? "/signup";
  const cardLabel = signedInCta?.cardLabel ?? "Get started";

  return (
    <>
      <MarketingHero
        headline="Associate Membership"
        description="Official launch product: GCE Connect Circle Membership — Associate Tier. Core Tier is not directly purchasable at launch."
        primaryCta={primaryCta}
        secondaryCta={{ label: "About Circles", href: "/the-circle" }}
        compact
      />
      <section className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <div className={`${GCE_SURFACE.card} rounded-2xl p-6 sm:p-8`}>
          <p className="text-sm font-semibold text-primary">
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
            <Link href={cardHref}>{cardLabel}</Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            {signedInCta
              ? "Online Associate purchase is not live yet. Your account is separate from paid membership and Circle seat allocation (FD-036)."
              : "Completing signup does not auto-activate membership or allocate a Circle seat."}
          </p>
        </div>
      </section>
    </>
  );
}
