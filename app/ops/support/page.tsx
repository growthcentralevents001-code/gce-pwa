import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { PromoteSignalButton } from "./promote-button";

export default async function SupportOpsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.support"
    )
  ) {
    redirect("/ops");
  }
  const admin = createPrivilegedSupabaseClient();
  const { data: signals } = await admin
    .from("customer_support_signals")
    .select("id, user_id, message, status, created_at")
    .eq("status", "queued_for_phase13")
    .order("created_at", { ascending: true })
    .limit(50);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Support
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Support Admin</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Customer/partner tier-1. No ledger/commission/KYC dump.{" "}
        <Link className="underline" href="/ops/cases">
          Open cases
        </Link>
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {(signals ?? []).length === 0 ? (
          <li className="text-neutral-600">No queued support signals.</li>
        ) : (
          (signals ?? []).map((s) => (
            <li key={s.id} className="rounded border border-neutral-200 p-3">
              <div>{s.message}</div>
              <div className="mt-1 text-xs text-neutral-500">{s.created_at}</div>
              <PromoteSignalButton signalId={s.id} />
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
