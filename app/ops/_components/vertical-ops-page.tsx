import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
  getOpsDashboard,
  getApprovalQueue,
  getExceptionQueue,
  listCases,
  type OpsVertical,
  type OpsAdminPermission,
} from "@/lib/architecture/ops-admin";

export async function VerticalOpsPage(props: {
  vertical: OpsVertical;
  title: string;
  permission: OpsAdminPermission;
  description: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      props.permission
    )
  ) {
    redirect("/ops");
  }
  const admin = createPrivilegedSupabaseClient();
  const [dash, approvals, exceptions, cases] = await Promise.all([
    getOpsDashboard(admin, { vertical: props.vertical }),
    getApprovalQueue(admin, { vertical: props.vertical }),
    getExceptionQueue(admin, { vertical: props.vertical }),
    listCases(admin, { vertical: props.vertical }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / {props.title}
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{props.title}</h1>
      <p className="mt-1 text-sm text-neutral-600">{props.description}</p>
      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Approvals", dash.cards.pendingApprovals],
          ["Exceptions", dash.cards.openExceptions],
          ["Cases", cases.length],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded border border-neutral-200 p-3 text-sm"
          >
            <div className="text-neutral-500">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
          </div>
        ))}
      </section>
      <section className="mt-6 text-sm">
        <h2 className="font-medium">Open approvals ({approvals.length})</h2>
        <ul className="mt-2 space-y-2">
          {approvals.slice(0, 10).map((a) => (
            <li key={a.id} className="rounded border border-neutral-200 p-2">
              {a.title} · {a.status}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6 text-sm">
        <h2 className="font-medium">Open exceptions ({exceptions.length})</h2>
        <ul className="mt-2 space-y-2">
          {exceptions.slice(0, 10).map((e) => (
            <li key={e.id} className="rounded border border-neutral-200 p-2">
              {e.title} · {e.severity}
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-6 text-xs text-neutral-500">
        Domain mutations continue via Phase 4–12 services only. No ledger edit
        here.
      </p>
    </main>
  );
}
