import { NextRequest } from "next/server";
import { withApiHandler, jsonSuccess } from "@/lib/api";
import { INACTIVE_FEATURE_FLAGS, WORKSPACE_KEYS, GCE_ROLE_KEYS } from "@/lib/architecture/types";
import { getReadiness } from "@/lib/observability";

/** Architecture + platform health — no secrets. */
export async function GET(request: NextRequest) {
  return withApiHandler(request, async (ctx) => {
    const readiness = getReadiness();
    return jsonSuccess(
      {
        ok: readiness.status !== "fail",
        phase: 3,
        readiness: readiness.status,
        architecture: {
          roleKeys: GCE_ROLE_KEYS.length,
          workspaceKeys: WORKSPACE_KEYS.length,
          featureFlagsDefined: INACTIVE_FEATURE_FLAGS.length,
          modules: [
            "config",
            "validation",
            "errors",
            "logging",
            "observability",
            "feature_flags",
            "supabase_clients",
            "api_conventions",
            "database_helpers",
            "jobs_conventions",
            "rate_limit",
            "identity",
            "rbac",
            "audit",
            "state_machine",
            "payments_webhook_skeleton",
            "ledger_foundation",
          ],
        },
      },
      ctx
    );
  });
}
