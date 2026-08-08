import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
  getExceptionQueue,
} from "@/lib/architecture/ops-admin";

export default async function OpsExceptionsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.exceptions.resolve"
    )
  ) {
    redirect("/ops");
  }
  const items = await getExceptionQueue(createPrivilegedSupabaseClient());

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Exceptions
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Exception queues</h1>
      <ul className="mt-6 space-y-3 text-sm">
        {items.length === 0 ? (
          <li className="text-neutral-600">No open exceptions.</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="rounded border border-neutral-200 p-3"
            >
              <div className="font-medium">{item.title}</div>
              <p className="mt-1 text-neutral-700">{item.summary}</p>
              <div className="mt-1 text-xs text-neutral-500">
                {item.exception_key} · {item.severity} · {item.status} ·{" "}
                {item.vertical}
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
