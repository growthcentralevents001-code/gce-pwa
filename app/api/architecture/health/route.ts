import { NextRequest } from "next/server";
import { withApiArchitecture } from "@/lib/architecture/api/http";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { GCE_ROLE_KEYS } from "@/lib/architecture/types";

/** Architecture health endpoint — no secrets. */
export async function GET(request: NextRequest) {
  return withApiArchitecture(request, async () => ({
    status: 200,
    body: {
      ok: true,
      phase: 2,
      architecture: {
        roleKeys: GCE_ROLE_KEYS.length,
        workspaceKeys: WORKSPACE_KEYS.length,
        featureFlagsDefined: INACTIVE_FEATURE_FLAGS.length,
        modules: [
          "identity",
          "organisations",
          "role_assignments",
          "workspaces",
          "rbac",
          "rls_migrations",
          "audit",
          "state_machine",
          "feature_flags",
          "payments_webhook_skeleton",
          "ledger_foundation",
          "legacy_quarantine",
        ],
      },
    },
  }));
}
