import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadOfferOpsInspection } from "@/lib/architecture/marketplace/ops-inspection";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { formatWhen } from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Offer inspection · Marketplace Ops",
};

type PageProps = {
  params: Promise<{ offerId: string }>;
};

export default async function OpsMarketplaceOfferInspectionPage({
  params,
}: PageProps) {
  const { offerId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/ops/marketplace/offers/${offerId}`);

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const canOps = actorHasOpsAdminPermission(
    entitlements.activeAssignments,
    "ops.marketplace"
  );
  if (!canOps) redirect("/ops");

  const admin = createPrivilegedSupabaseClient();
  let inspection: Awaited<ReturnType<typeof loadOfferOpsInspection>> | null =
    null;
  try {
    inspection = await loadOfferOpsInspection(admin, offerId);
  } catch {
    notFound();
  }

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Offer Event inspection"
        description="Read-only operational view: claims, visit confirmations, redemptions, and domain events. No rank or revenue mutation."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Marketplace", href: "/ops/marketplace" },
          { label: inspection.offer.title },
        ]}
      />
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/ops/marketplace">Back to queue</Link>
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-4 text-sm">
        <h2 className="font-semibold">{inspection.offer.title}</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Offer status</dt>
            <dd>
              <StatusBadge label={inspection.offer.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Venue</dt>
            <dd>
              {inspection.venue.displayName}
              {inspection.venue.city ? ` · ${inspection.venue.city}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Campaign</dt>
            <dd>
              {formatWhen(inspection.offer.campaignStartsAt)} →{" "}
              {formatWhen(inspection.offer.campaignEndsAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Claims</dt>
            <dd>
              {inspection.offer.claimsCount}/{inspection.offer.customerCap}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Claims</h2>
        <PartnerDataTable
          rows={inspection.claims.map((c) => ({ ...c, id: c.id }))}
          mobileTitle={(r) => `Claim ${r.id.slice(0, 8)}`}
          columns={[
            { id: "id", header: "Claim", cell: (r) => r.id.slice(0, 8) },
            { id: "status", header: "Status", cell: (r) => <StatusBadge label={r.status} /> },
            {
              id: "claimed",
              header: "Claimed",
              cell: (r) => formatWhen(r.claimedAt),
              hideOnMobile: true,
            },
            {
              id: "expires",
              header: "Expires",
              cell: (r) => formatWhen(r.expiresAt),
              hideOnMobile: true,
            },
            {
              id: "visit",
              header: "Visit",
              cell: (r) =>
                r.visit ? formatWhen(r.visit.confirmedAt) : "—",
            },
            {
              id: "redeem",
              header: "Redemption",
              cell: (r) =>
                r.redemption ? formatWhen(r.redemption.createdAt) : "—",
            },
            {
              id: "customer",
              header: "Customer",
              cell: (r) => r.customerUserId.slice(0, 8),
              hideOnMobile: true,
            },
          ]}
          empty={<p className="text-sm text-muted-foreground">No claims yet.</p>}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Domain events</h2>
        {inspection.domainEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No related events.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {inspection.domainEvents.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-border px-3 py-2"
              >
                <span className="font-medium">{e.eventType}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {formatWhen(e.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
