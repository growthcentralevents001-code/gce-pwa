import {
  JOB_TYPES,
  dispatchNotificationIntent,
  createRetentionReview,
  upsertOperationalAlert,
} from "@/lib/architecture/ops-governance";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Phase 12 job handlers — wired into /api/jobs/run.
 * Idempotent; never enables live providers or retention purge.
 */
export async function handlePhase12Job(
  client: SupabaseClient,
  job: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const jobType = String(job.job_type ?? "");
  const payload = (job.payload ?? {}) as Record<string, unknown>;

  if (
    jobType === JOB_TYPES.notificationDispatch ||
    jobType === JOB_TYPES.notificationRetry
  ) {
    const intentId = String(payload.intentId ?? "");
    if (!intentId) return { ok: false, error: "missing_intentId" };
    const result = await dispatchNotificationIntent(client, intentId);
    return { ok: true, ...result };
  }

  if (jobType === JOB_TYPES.alertEvaluate) {
    const { count } = await client
      .from("notification_dead_letters")
      .select("id", { count: "exact", head: true })
      .eq("disposition", "open");
    if ((count ?? 0) >= 10) {
      await upsertOperationalAlert(client, {
        alertKey: "notifications:dead_letter_growth",
        severity: "medium",
        title: "Notification dead-letter growth",
        summary: `Open dead letters: ${count}`,
        thresholdConfig: { openDeadLetters: 10 },
        details: { openDeadLetters: count },
      });
    }
    return { ok: true, openDeadLetters: count ?? 0 };
  }

  if (jobType === JOB_TYPES.retentionReview) {
    // Non-destructive: create review rows only; enforcement flag must stay OFF.
    const review = await createRetentionReview(client, {
      policyKey: String(payload.policyKey ?? "analytics_events"),
      subjectRef: payload.subjectRef ? String(payload.subjectRef) : null,
      eligibility: "review_required",
    });
    return { ok: true, reviewId: review.id };
  }

  if (jobType === JOB_TYPES.analyticsIngest) {
    // Analytics ingest is synchronous via API/services; job acknowledges fan-in hooks.
    return { ok: true, acknowledged: true };
  }

  return { ok: false, error: "unhandled_phase12_job", jobType };
}

export function isPhase12JobType(jobType: string): boolean {
  return Object.values(JOB_TYPES).includes(jobType as (typeof JOB_TYPES)[keyof typeof JOB_TYPES]);
}
