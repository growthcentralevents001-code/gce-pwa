import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Access denied · GCE",
};

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const sp = await searchParams;
  const reason =
    typeof sp.reason === "string" && sp.reason.trim()
      ? sp.reason
      : "You don't have permission to view this page. Legacy role dashboards do not grant entitlement.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600" aria-hidden />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">{reason}</p>
        <div className="space-y-3">
          <Link
            href="/dashboard/personal"
            className="flex min-h-11 w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Personal workspace
          </Link>
          <Link
            href="/"
            className="flex min-h-11 w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-muted-foreground hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
