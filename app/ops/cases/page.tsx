import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
  listCases,
} from "@/lib/architecture/ops-admin";
import { CreateCaseForm } from "./create-case-form";

export default async function OpsCasesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.cases.manage"
    )
  ) {
    redirect("/ops");
  }
  const items = await listCases(createPrivilegedSupabaseClient());

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Cases
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Cases & disputes</h1>
      <p className="mt-1 text-xs text-neutral-500">
        Shared ops_cases umbrella · Phase 6/8 domain disputes remain linked SoT
      </p>
      <CreateCaseForm />
      <ul className="mt-6 space-y-3 text-sm">
        {items.map((c) => (
          <li key={c.id} className="rounded border border-neutral-200 p-3">
            <Link className="font-medium underline" href={`/ops/cases/${c.id}`}>
              {c.case_number}
            </Link>
            <div className="mt-1">{c.summary}</div>
            <div className="mt-1 text-xs text-neutral-500">
              {c.case_type} · {c.vertical} · {c.status} · {c.priority}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
