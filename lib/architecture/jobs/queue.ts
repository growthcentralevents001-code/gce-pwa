import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { createCorrelationId, logStructured } from "../logging";
import { writeAuditEvent } from "../audit/write";

export type JobStatus =
  | "pending"
  | "leased"
  | "running"
  | "succeeded"
  | "failed"
  | "dead_letter";

export type EnqueueJobInput = {
  jobType: string;
  payload?: Record<string, unknown>;
  idempotencyKey: string;
  availableAt?: string;
  maxAttempts?: number;
  correlationId?: string;
};

/**
 * ADR-014 background job foundation — enqueue + lease + complete pattern.
 * Workers must use a service-role client. Money-adjacent jobs must remain
 * idempotent and feature-gated by callers.
 */
export async function enqueueBackgroundJob(
  client: SupabaseClient,
  input: EnqueueJobInput
): Promise<{ id: string; created: boolean }> {
  const correlationId = input.correlationId ?? createCorrelationId();
  const { data, error } = await client
    .from("background_jobs")
    .upsert(
      {
        job_type: input.jobType,
        payload: input.payload ?? {},
        idempotency_key: input.idempotencyKey,
        available_at: input.availableAt ?? new Date().toISOString(),
        max_attempts: input.maxAttempts ?? 5,
        correlation_id: correlationId,
        status: "pending",
      },
      { onConflict: "job_type,idempotency_key", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    // Unique race: fetch existing
    const existing = await client
      .from("background_jobs")
      .select("id")
      .eq("job_type", input.jobType)
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing.data?.id) {
      return { id: existing.data.id as string, created: false };
    }
    throw new AppError("INTERNAL_ERROR", "Failed to enqueue job", {
      cause: error,
    });
  }

  if (!data?.id) {
    const existing = await client
      .from("background_jobs")
      .select("id")
      .eq("job_type", input.jobType)
      .eq("idempotency_key", input.idempotencyKey)
      .single();
    return { id: existing.data!.id as string, created: false };
  }

  await writeAuditEvent(client, {
    action: "background_job.enqueue",
    resourceType: "background_job",
    resourceId: String(data.id),
    correlationId,
    metadata: { jobType: input.jobType },
    source: "jobs",
  });

  return { id: data.id as string, created: true };
}

export async function leaseNextJob(
  client: SupabaseClient,
  options: {
    jobType?: string;
    leaseOwner: string;
    leaseSeconds?: number;
  }
) {
  const leaseSeconds = options.leaseSeconds ?? 60;
  const now = new Date();
  const leasedUntil = new Date(now.getTime() + leaseSeconds * 1000).toISOString();

  let query = client
    .from("background_jobs")
    .select("*")
    .in("status", ["pending", "failed"])
    .lte("available_at", now.toISOString())
    .order("available_at", { ascending: true })
    .limit(1);

  if (options.jobType) {
    query = query.eq("job_type", options.jobType);
  }

  const { data: candidates, error } = await query;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to poll jobs", { cause: error });
  }
  const job = candidates?.[0];
  if (!job) return null;

  const { data: leased, error: leaseError } = await client
    .from("background_jobs")
    .update({
      status: "leased",
      lease_owner: options.leaseOwner,
      leased_until: leasedUntil,
      attempt_count: (job.attempt_count as number) + 1,
      updated_at: now.toISOString(),
    })
    .eq("id", job.id)
    .in("status", ["pending", "failed"])
    .select("*")
    .maybeSingle();

  if (leaseError) {
    throw new AppError("INTERNAL_ERROR", "Failed to lease job", {
      cause: leaseError,
    });
  }
  return leased;
}

export async function completeJob(
  client: SupabaseClient,
  jobId: string,
  result: { ok: true } | { ok: false; error: string }
): Promise<void> {
  const { data: job } = await client
    .from("background_jobs")
    .select("attempt_count,max_attempts,correlation_id,job_type")
    .eq("id", jobId)
    .single();

  if (!job) {
    throw new AppError("NOT_FOUND", "Job not found", { status: 404 });
  }

  if (result.ok) {
    await client
      .from("background_jobs")
      .update({
        status: "succeeded",
        completed_at: new Date().toISOString(),
        last_error: null,
        leased_until: null,
      })
      .eq("id", jobId);
    return;
  }

  const attempts = job.attempt_count as number;
  const max = job.max_attempts as number;
  const dead = attempts >= max;
  const nextStatus = dead ? "dead_letter" : "failed";

  logStructured({
    level: "error",
    message: "background_job_failed",
    correlationId: (job.correlation_id as string) ?? undefined,
    code: "JOB_FAILED",
    meta: {
      jobId,
      jobType: job.job_type,
      error: result.error,
      dead,
    },
  });

  await client
    .from("background_jobs")
    .update({
      status: nextStatus,
      last_error: result.error,
      available_at: new Date(Date.now() + 30_000).toISOString(),
      leased_until: null,
      completed_at: dead ? new Date().toISOString() : null,
    })
    .eq("id", jobId);
}

export async function runJobOnce<T>(
  client: SupabaseClient,
  options: {
    leaseOwner: string;
    jobType?: string;
    handler: (job: Record<string, unknown>) => Promise<T>;
  }
): Promise<{ handled: false } | { handled: true; result: T; jobId: string }> {
  const leased = await leaseNextJob(client, {
    leaseOwner: options.leaseOwner,
    jobType: options.jobType,
  });
  if (!leased) return { handled: false };

  await client
    .from("background_jobs")
    .update({ status: "running" })
    .eq("id", leased.id);

  try {
    const result = await options.handler(leased as Record<string, unknown>);
    await completeJob(client, String(leased.id), { ok: true });
    return { handled: true, result, jobId: String(leased.id) };
  } catch (error) {
    await completeJob(client, String(leased.id), {
      ok: false,
      error: error instanceof Error ? error.message : "unknown",
    });
    throw error;
  }
}
