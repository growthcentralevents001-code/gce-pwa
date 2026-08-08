"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { setWorkspacePreference } from "@/lib/architecture/workspace/preferences";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { createCorrelationId } from "@/lib/architecture/logging";

export type SwitchWorkspaceResult =
  | { ok: true; workspaceKey: WorkspaceKey }
  | { ok: false; error: string };

/**
 * Persist workspace preference after server-side authorization (ADR-003).
 */
export async function switchWorkspaceAction(
  workspaceKey: string,
  setAsDefault = false
): Promise<SwitchWorkspaceResult> {
  if (!(WORKSPACE_KEYS as readonly string[]).includes(workspaceKey)) {
    return { ok: false, error: "Unknown workspace" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  try {
    await setWorkspacePreference(supabase, {
      userId: user.id,
      workspaceKey: workspaceKey as WorkspaceKey,
      assignments: entitlements.activeAssignments,
      setAsDefault,
      correlationId: createCorrelationId(),
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Switch failed",
    };
  }

  revalidatePath(`/dashboard/${workspaceKey}`);
  return { ok: true, workspaceKey: workspaceKey as WorkspaceKey };
}
