"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
        <p className="text-sm text-slate-500 mt-2">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
        >
          Try again
        </button>
        <Link href="/" className="block mt-4 text-orange-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
