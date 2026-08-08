"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { resolveAuthRedirectParam } from "@/lib/frontend/auth/redirect";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { PageSkeleton } from "@/components/states/LoadingSkeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) {
          // Exchange code if present (PKCE)
          const code = searchParams.get("code");
          if (code) {
            const { error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) throw exchangeError;
          } else {
            throw new Error("No session available");
          }
        }
        if (cancelled) return;
        const next = resolveAuthRedirectParam(searchParams, "/onboarding/profile");
        router.replace(next);
        router.refresh();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Auth callback failed");
          setTimeout(() => router.replace("/login"), 2000);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <AuthPanel title="Completing sign-in" description="Please wait…">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <PageSkeleton />
      )}
    </AuthPanel>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AuthCallbackInner />
    </Suspense>
  );
}
