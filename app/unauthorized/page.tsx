"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Suspense } from "react";

function UnauthorizedInner() {
  const router = useRouter();
  const params = useSearchParams();
  const reason =
    params.get("reason") ||
    "You don't have permission to view this page. Legacy role dashboards do not grant entitlement.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">{reason}</p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard/personal")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            <Home size={18} /> Personal workspace
          </button>

          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <UnauthorizedInner />
    </Suspense>
  );
}
