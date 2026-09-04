import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Shield } from "lucide-react";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { MembershipCard } from "@/components/connect/MembershipCard";
import { CircleCard } from "@/components/connect/CircleCard";
import { KpiCard } from "@/components/connect/KpiCard";
import { LeadCard } from "@/components/connect/LeadCard";
import { PowerSectorGrid } from "@/components/connect/PowerSectorGrid";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { listMembershipTags } from "@/lib/architecture/connect/tags";
import {
  getMyReceivedLeads,
  getMySentLeads,
  presentLeadPrivacySafe,
  assertPaidMechanicsInactive,
} from "@/lib/architecture/lead-assist";
import { findSeatForMembership } from "@/lib/frontend/connect/reads";
import { CIRCLE_CAPACITY_MAX } from "@/lib/frontend/connect/format";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import type { PartnerActionItem } from "@/components/partner/PartnerActionCenter";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Connect Member · GCE",
};

/** MEM-01 — canonical Connect member home */
export default async function ConnectMemberHomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/connect-member");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "connect-member",
  });

  if (!identity.workspaces.includes("connect-member")) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ConnectPageHeader
          title="Connect Member"
          description="This workspace requires an active Circle Member (or governance) assignment."
        />
        <EmptyState
          title="Workspace not entitled"
          description="Complete membership onboarding or ask Platform Ops if you expect access."
          primaryAction={{ label: "Memberships", href: "/memberships" }}
          secondaryAction={{ label: "Personal workspace", href: "/dashboard/personal" }}
        />
      </main>
    );
  }

  const admin = createPrivilegedSupabaseClient();
  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0] ?? null;
  const tags = primary
    ? await listMembershipTags(supabase, primary.id).catch(() => [])
    : [];
  const seat = primary
    ? await findSeatForMembership(admin, primary.id).catch(() => null)
    : null;
  const circleRaw = seat?.connect_circles;
  const circle = Array.isArray(circleRaw) ? circleRaw[0] : circleRaw;

  let sent: ReturnType<typeof presentLeadPrivacySafe>[] = [];
  let receivedCount = 0;
  try {
    sent = (await getMySentLeads(admin, user.id)).map(presentLeadPrivacySafe);
    receivedCount = (await getMyReceivedLeads(admin, user.id)).length;
    await assertPaidMechanicsInactive(admin);
  } catch {
    sent = [];
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Connect overview"
        description="What needs your attention in the network today — membership, Circle, and Lead Assist."
        actions={
          <Button asChild className="min-h-11">
            <Link href="/connect/leads">Send a lead</Link>
          </Button>
        }
      />

      <PartnerActionCenter
        className="mb-8"
        items={
          [
            receivedCount > 0
              ? {
                  id: "recv",
                  title: `${receivedCount} received lead(s) need a response`,
                  href: "/connect/leads/received",
                  severity: "warning" as const,
                  icon: "target" as const,
                }
              : null,
            primary && primary.allocationStatus !== "allocated"
              ? {
                  id: "alloc",
                  title: "Circle allocation is not complete",
                  description: String(primary.allocationStatus).replaceAll("_", " "),
                  href: "/connect/waitlist",
                  severity: "warning" as const,
                }
              : null,
            !primary
              ? {
                  id: "join",
                  title: "No membership on file",
                  href: "/memberships",
                  severity: "info" as const,
                }
              : null,
            {
              id: "compose",
              title: "Share a governed referral",
              description: "In-app Lead Assist — not WhatsApp, not a Kanban board.",
              href: "/connect/leads",
              severity: "info" as const,
            },
          ].filter(Boolean) as PartnerActionItem[]
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Membership" value={primary?.status ?? "—"} href="/connect/membership" />
        <KpiCard
          label="Allocation"
          value={(primary?.allocationStatus ?? "—").replaceAll("_", " ")}
          href="/connect/waitlist"
        />
        <KpiCard label="Tags" value={`${tags.length}/4`} href="/connect/tags" icon="tag" />
        <KpiCard
          label="Leads"
          value={`${sent.length} / ${receivedCount}`}
          href="/connect/leads"
          icon="target"
          hint="sent / received"
        />
      </div>

      {!primary ? (
        <EmptyState
          title="No membership on file"
          description="Associate Membership is the launch plan (₹6,000 / quarter)."
          primaryAction={{ label: "View memberships", href: "/memberships" }}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <MembershipCard
            status={primary.status}
            allocationStatus={primary.allocationStatus}
            tagCount={tags.length}
          />
          {circle ? (
            <CircleCard
              name={String(circle.name)}
              city={circle.city ? String(circle.city) : null}
              lifecycleStatus={String(circle.lifecycle_status)}
              constitutionStatus={String(circle.constitution_status)}
              activeSeatCount={Number(circle.active_seat_count ?? 0)}
              capacityMax={Math.min(
                Number(circle.capacity_max ?? CIRCLE_CAPACITY_MAX),
                CIRCLE_CAPACITY_MAX
              )}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-5">
              <Users className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="mt-2 text-sm font-semibold">My Circle</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Not allocated yet — membership can still be active.
              </p>
              <Button asChild variant="outline" className="mt-4 min-h-11">
                <Link href="/connect/circle">Open Circle</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">GC Power Sectors</h2>
          <Link href="/connect/circle" className="text-xs font-medium text-primary underline-offset-4 hover:underline">
            In Circle
          </Link>
        </div>
        <PowerSectorGrid />
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Recent leads</h2>
          <div className="flex gap-3 text-xs">
            <Link href="/connect/leads/sent" className="font-medium text-primary underline-offset-4 hover:underline">
              Sent
            </Link>
            <Link href="/connect/leads/received" className="font-medium text-primary underline-offset-4 hover:underline">
              Received
            </Link>
          </div>
        </div>
        {sent.length === 0 ? (
          <EmptyState
            title="No sent leads yet"
            description="Formal GCE leads are created in-app — not via WhatsApp."
            primaryAction={{ label: "Compose lead", href: "/connect/leads" }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sent.slice(0, 4).map((l) => (
              <LeadCard
                key={l.id}
                id={l.id}
                title={l.title}
                workStatus={l.workStatus}
                city={l.city}
                urgency={l.urgency}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-2">
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/connect/specialisation">Specialisation</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/connect/governance">
            <Shield className="mr-1 h-4 w-4" /> Governance
          </Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/connect/onboarding">Onboarding</Link>
        </Button>
      </div>

      <FeatureGated
        className="mt-8"
        mode="disabled_in_environment"
        title="Paid Lead Assist gated"
        description="No ₹500 pay-to-receive, escrow, forfeiture, voucher, or success fee in Stage 1."
      />
    </main>
  );
}
