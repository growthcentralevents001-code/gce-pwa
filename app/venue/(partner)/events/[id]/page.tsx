import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PartnerPageHeader, Timeline } from "@/components/partner";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";
import { formatMinorInr } from "@/lib/frontend/marketplace/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Event · Venue" };

type Props = { params: Promise<{ id: string }> };

export default async function VenueEventDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/venue/events/${id}`);
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  const event = bundle.events.find((e) => String(e.id) === id);
  if (!event) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16 space-y-6">
      <PartnerPageHeader title={String(event.title)} backHref="/venue/events" backLabel="Events" actions={
        <Button asChild variant="outline" className="min-h-11"><Link href="/venue/check-in">Check-in</Link></Button>
      } />
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <StatusBadge label={String(event.status).replace(/_/g, " ")} />
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Starts</dt><dd>{event.starts_at ? new Date(String(event.starts_at)).toLocaleString("en-IN") : "—"}</dd></div>
          <div><dt className="text-muted-foreground">Capacity</dt><dd>{String(event.capacity ?? "—")}</dd></div>
          <div><dt className="text-muted-foreground">Price</dt><dd>{typeof event.price_minor === "number" ? formatMinorInr(event.price_minor) : "—"}</dd></div>
        </dl>
        {event.description ? <p className="mt-4 text-sm text-muted-foreground">{String(event.description)}</p> : null}
      </section>
      <Timeline items={[
        { id: "created", title: "Created", at: event.created_at ? String(event.created_at) : null },
        { id: "status", title: `Status: ${String(event.status)}`, tone: "pending" },
        ...(event.published_at ? [{ id: "pub", title: "Published", at: String(event.published_at), tone: "success" as const }] : []),
      ]} />
      <FeatureGated mode="unavailable" title="Platform approval" description="Final Event approval/publish is Marketplace Ops — not available in Venue workspace." />
    </main>
  );
}
