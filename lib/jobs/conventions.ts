import type { SupabaseClient } from "@supabase/supabase-js";
import {
  completeJob,
  enqueueBackgroundJob,
  leaseNextJob,
  runJobOnce,
  type EnqueueJobInput,
  type JobStatus,
} from "@/lib/architecture/jobs/queue";
import { assertCronAuthorized, getServerConfig } from "@/lib/config/env";
import { AuthenticationError, ConfigurationError } from "@/lib/errors";
import { createCorrelationId, logger } from "@/lib/logging";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/clients";
import { writeAuditEvent } from "@/lib/architecture/audit/write";

export type { EnqueueJobInput, JobStatus };

export const JOB_CONVENTIONS = {
  defaultMaxAttempts: 5,
  defaultLeaseSeconds: 60,
  defaultBackoffMs: 30_000,
} as const;

/**
 * Authorize job runner (cron / PM2). Requires CRON_SECRET.
 */
export function assertJobRunnerAuthorized(cronSecretHeader: string | null | undefined): void {
  if (!assertCronAuthorized(cronSecretHeader)) {
    throw new AuthenticationError("Invalid or missing cron secret");
  }
  const cfg = getServerConfig();
  if (!cfg.hasServiceRole) {
    throw new ConfigurationError("Service role required for job runner");
  }
}

export function createJobWorkerClient(): SupabaseClient {
  return createServiceRoleSupabaseClient();
}

export async function enqueueJob(
  client: SupabaseClient,
  input: EnqueueJobInput
) {
  const correlationId = input.correlationId ?? createCorrelationId();
  logger.info("job_enqueue", {
    correlationId,
    eventType: "background_job.enqueue",
    meta: { jobType: input.jobType, idempotencyKey: input.idempotencyKey },
  });
  return enqueueBackgroundJob(client, { ...input, correlationId });
}

export async function claimAndRunJob(
  client: SupabaseClient,
  options: {
    leaseOwner: string;
    jobType?: string;
    handler: (job: Record<string, unknown>) => Promise<unknown>;
  }
) {
  return runJobOnce(client, options);
}

export async function markJobSucceeded(client: SupabaseClient, jobId: string) {
  await completeJob(client, jobId, { ok: true });
  await writeAuditEvent(client, {
    action: "background_job.succeeded",
    resourceType: "background_job",
    resourceId: jobId,
    source: "jobs",
  });
}

export async function markJobFailed(
  client: SupabaseClient,
  jobId: string,
  errorMessage: string
) {
  logger.error("job_failed", {
    eventType: "background_job.failed",
    meta: { jobId, errorMessage },
  });
  await completeJob(client, jobId, { ok: false, error: errorMessage });
}

export { leaseNextJob, completeJob, runJobOnce, enqueueBackgroundJob };
