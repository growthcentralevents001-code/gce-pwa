import Link from "next/link";
import { PartnerPageHeader } from "@/components/partner";
import { ConnectBdpApplyForm } from "@/components/partner/ConnectBdpApplyForm";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listConnectBdpUnitsForUser } from "@/lib/architecture/connect-bdp";
import { normalizeConnectBdpApplicationMetadata } from "@/lib/architecture/connect-bdp/application";
import {
  applicationStatusLabel,
  packageOptionLabel,
  CONNECT_BDP_ROLE_LABEL,
} from "@/lib/frontend/partner/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { StatusBadge } from "@/components/states/StatusBadge";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Apply · Connect BDP",
};

/** CBDP-02 — Application / activation entry */
export default async function ConnectBdpApplyPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const units = user
    ? await listConnectBdpUnitsForUser(supabase, user.id).catch(() => [])
    : [];

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("display_name, legal_name, phone")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const prefill = {
    fullName:
      profile?.legal_name ||
      profile?.display_name ||
      (user?.user_metadata?.full_name as string | undefined) ||
      "",
    mobile: profile?.phone ?? "",
    email: user?.email ?? "",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <PartnerPageHeader
        title={`${CONNECT_BDP_ROLE_LABEL} application`}
        description="Independent commercial partner licence to operate a Connect Franchise Unit. Platform assignment and approval required — applicants cannot self-approve."
        backHref="/dashboard/connect-bdp"
        backLabel="Overview"
      />

      {units.length > 0 ? (
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-semibold">Existing units</h2>
          {units.map((u) => {
            const application = normalizeConnectBdpApplicationMetadata(
              u.metadata
            );
            return (
              <div
                key={String(u.id)}
                className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} flex flex-col gap-3 p-4`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {packageOptionLabel(String(u.package_option))}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Unit {String(u.id).slice(0, 8)}
                    </p>
                  </div>
                  <StatusBadge
                    label={applicationStatusLabel(String(u.application_status))}
                    tone={
                      u.application_status === "active" ? "success" : "pending"
                    }
                  />
                  <Button asChild variant="outline" className="min-h-11">
                    <Link href="/connect-bdp/unit">View unit</Link>
                  </Button>
                </div>
                {application ? (
                  <dl className="grid gap-2 border-t border-border pt-3 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Applicant</dt>
                      <dd>{application.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">City</dt>
                      <dd>{application.city}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Mobile</dt>
                      <dd>{application.mobile}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>{application.email}</dd>
                    </div>
                  </dl>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <ConnectBdpApplyForm prefill={prefill} />

      <div className="mt-6">
        <FeatureGated
          mode="disabled_in_environment"
          title="Offline pack evidence"
          description="Offline package evidence capture remains flagged OFF. Live payment settlement is not enabled from this surface."
        />
      </div>
    </main>
  );
}
