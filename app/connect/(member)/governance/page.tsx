import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { MemberCard } from "@/components/connect/MemberCard";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import {
  findSeatForMembership,
  listCircleGovernance,
} from "@/lib/frontend/connect/reads";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Governance · GCE Connect",
};

const ROLE_LABELS: Record<string, string> = {
  governing_body_member: "Governing Body",
  circle_finance_coordinator: "Circle Finance Coordinator",
  sergeant_at_arms: "Sergeant-at-Arms",
};

export default async function GovernancePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/governance");

  const admin = createPrivilegedSupabaseClient();
  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];
  const seat = primary
    ? await findSeatForMembership(admin, primary.id).catch(() => null)
    : null;
  const circleId = seat?.circle_id as string | undefined;
  const appointments = circleId
    ? await listCircleGovernance(admin, circleId).catch(() => [])
    : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Circle governance"
        description="Governing Body · Circle Finance Coordinator · Sergeant-at-Arms. GB may request taxonomy changes; it cannot directly alter platform taxonomy."
        backHref="/connect/circle"
      />

      {!circleId ? (
        <EmptyState
          title="No Circle allocated"
          description="Governance appears after Circle allocation."
          primaryAction={{ label: "My Circle", href: "/connect/circle" }}
        />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No active appointments listed"
          description="Platform Ops may still be constituting Circle governance."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {appointments.map((a) => (
            <MemberCard
              key={a.id}
              name={ROLE_LABELS[a.role_key] ?? a.role_key.replaceAll("_", " ")}
              specialisation={`User ${String(a.user_id).slice(0, 8)}`}
              status={a.status}
            />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Do not use legacy “Treasurer” labelling. Circle Finance Coordinator is
        the current role name.
      </p>
    </main>
  );
}
