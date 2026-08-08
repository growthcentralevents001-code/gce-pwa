import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
  getApprovalQueue,
} from "@/lib/architecture/ops-admin";
import { ApprovalActions } from "./approval-actions";

export default async function OpsApprovalsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.approvals.review"
    )
  ) {
    redirect("/ops");
  }
  const admin = createPrivilegedSupabaseClient();
  const items = await getApprovalQueue(admin);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Approvals
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Approval queues</h1>
      <p className="mt-1 text-xs text-neutral-500">
        Projection queue — domain approve services remain SoT. Self-approval
        blocked.
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {items.length === 0 ? (
          <li className="text-neutral-600">No pending approvals.</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="rounded border border-neutral-200 p-3"
            >
              <div className="font-medium">{item.title}</div>
              <div className="mt-1 text-xs text-neutral-500">
                {item.queue_key} · {item.vertical} · {item.status} ·{" "}
                {item.subject_type}:{item.subject_id}
              </div>
              <ApprovalActions approvalId={item.id} />
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
