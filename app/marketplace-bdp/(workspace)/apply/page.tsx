import Link from "next/link";
import { PartnerPageHeader } from "@/components/partner";
import { MbdpApplyForm } from "@/components/marketplace/MbdpApplyForm";
import { FeatureGated } from "@/components/states/FeatureGated";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listMbdpUnitsForUser } from "@/lib/architecture/marketplace";
import {
  MARKETPLACE_BDP_ROLE_LABEL,
  mbdpPackageOptionLabel,
} from "@/lib/frontend/marketplace/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Apply · Marketplace BDP" };

export default async function MbdpApplyPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const units = user ? await listMbdpUnitsForUser(supabase, user.id).catch(() => []) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title={`${MARKETPLACE_BDP_ROLE_LABEL} application`}
        description="Venue-attribution based Franchise Unit. No city ownership. Platform activation required — applicants cannot self-approve. Marketplace Affiliate is inactive."
        backHref="/dashboard/marketplace-bdp"
      />
      {units.length > 0 ? (
        <div className="space-y-3">
          {units.map((u) => (
            <div key={String(u.id)} className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} flex flex-wrap items-center justify-between gap-3 p-4`}>
              <div>
                <p className="text-sm font-medium">{mbdpPackageOptionLabel(String(u.package_option))}</p>
                <p className="text-xs text-muted-foreground">Unit {String(u.id).slice(0, 8)}</p>
              </div>
              <StatusBadge label={String(u.application_status).replace(/_/g, " ")} tone="pending" />
              <Button asChild variant="outline" className="min-h-11"><Link href="/marketplace-bdp/units">View units</Link></Button>
            </div>
          ))}
        </div>
      ) : null}
      <MbdpApplyForm />
      <FeatureGated mode="disabled_in_environment" title="Marketplace Affiliate" description="Marketplace Affiliate remains inactive / future-only." />
    </main>
  );
}
