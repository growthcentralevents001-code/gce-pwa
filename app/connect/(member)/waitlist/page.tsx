import Link from "next/link";
import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import {
  allocationStatusTone,
  waitlistCopy,
} from "@/lib/frontend/connect/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Waitlist · GCE Connect",
};

export default async function WaitlistPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/waitlist");

  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];
  const copy = waitlistCopy(primary?.allocationStatus ?? "unallocated");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Allocation & waitlist"
        description="Queue position is not invented. Membership remains valid while allocation is pending."
        backHref="/connect/circle"
        backLabel="My Circle"
      />

      {!primary ? (
        <EmptyState
          title="No membership"
          primaryAction={{ label: "Membership", href: "/connect/membership" }}
        />
      ) : (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <StatusBadge
            label={primary.allocationStatus.replaceAll("_", " ")}
            tone={allocationStatusTone(primary.allocationStatus)}
          />
          <h2 className="text-lg font-semibold">{copy.title}</h2>
          <p className="text-sm text-muted-foreground">{copy.description}</p>
          <p className="text-xs text-muted-foreground">
            Preferred city: {primary.preferredCity ?? "—"} · state:{" "}
            {primary.preferredState ?? "—"}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/connect/transfer">Transfer</Link>
            </Button>
            <Button asChild className="min-h-11">
              <Link href="/connect/membership">Membership</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
