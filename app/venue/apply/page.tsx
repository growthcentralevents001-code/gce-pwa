import Link from "next/link";
import { redirect } from "next/navigation";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createServerSupabaseClient } from "@/lib/supabase/clients";

export const metadata = {
  title: "Join GCE Marketplace · Venue Partner",
  description:
    "Venue onboarding is approval-based. Marketplace Ops final-approves verified businesses.",
};

/**
 * Canonical Venue interest page — does not write legacy `venues` or auto-grant roles.
 * Governed path: partner interest → MBDP recommendation / org linkage → Marketplace Ops approval.
 */
export default async function VenueApplyPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/venue/apply");
  }

  return (
    <>
      <MarketingHero
        headline="Join GCE Marketplace"
        description="Verified hotels, restaurants, coworking spaces, studios, salons, gyms, travel agencies, jewelers, electronics businesses, and other approved businesses can list Events and Offers after Platform verification."
        compact
      />
      <section className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <Alert className="mb-6">
          <AlertTitle>Approval-based onboarding</AlertTitle>
          <AlertDescription>
            This form does not auto-activate a Venue role or publish listings.
            Marketplace Ops final-approves verified businesses (FD-037). MBDP
            recommendation is assistive — not final approval.
          </AlertDescription>
        </Alert>
        <div className={`${GCE_SURFACE.card} space-y-4 rounded-2xl p-6`}>
          <h2 className="text-base font-semibold">Next steps</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Express partner interest and complete your organisation profile.</li>
            <li>
              Work with a Marketplace BDP to recommend your business, or await
              Platform Ops review when your organisation is linked.
            </li>
            <li>
              After verification and approval, access the Venue Partner dashboard
              to create Events and Offers.
            </li>
          </ol>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="min-h-11">
              <Link href="/for-partners">Partner pathways</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/dashboard/venue">Venue dashboard</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported business types use your Marketplace Venue category field
            (free-text today). Becoming a Marketplace BDP is a separate journey
            at{" "}
            <Link href="/marketplace-bdp" className="underline">
              Marketplace BDP
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
