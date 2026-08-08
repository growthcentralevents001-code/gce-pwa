import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { PrivacyRequestForm } from "./privacy-form";

export default async function OpsPrivacyPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("privacy_requests")
    .select("id, request_type, status, created_at, completed_at")
    .eq("requester_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Privacy
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Privacy requests</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Erasure does not auto-delete ledger/audit records. Retention periods
        remain pending validation (OD-009).
      </p>
      <PrivacyRequestForm />
      <ul className="mt-6 space-y-2 text-sm">
        {(rows ?? []).map((r) => (
          <li key={r.id} className="rounded border border-neutral-200 p-3">
            {r.request_type} · {r.status} · {r.created_at}
          </li>
        ))}
      </ul>
    </main>
  );
}
