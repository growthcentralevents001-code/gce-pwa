import { NextRequest } from "next/server";
import { withApiHandler, jsonSuccess } from "@/lib/api";
import {
  assertJobRunnerAuthorized,
  claimAndRunJob,
  createJobWorkerClient,
} from "@/lib/jobs";
import { logger } from "@/lib/logging";
import {
  handlePhase12Job,
  isPhase12JobType,
} from "@/lib/architecture/ops-governance/jobs";

/**
 * ADR-014 / Phase 3 job runner + Phase 12 notification/ops handlers.
 * Protected by CRON_SECRET. Does not execute settlement or live providers.
 */
export async function POST(request: NextRequest) {
  return withApiHandler(
    request,
    async (ctx) => {
      assertJobRunnerAuthorized(request.headers.get("x-cron-secret"));
      const client = createJobWorkerClient();

      const result = await claimAndRunJob(client, {
        leaseOwner: `cron:${ctx.correlationId}`,
        handler: async (job) => {
          const jobType = String(job.job_type ?? "");
          if (isPhase12JobType(jobType)) {
            return handlePhase12Job(client, job);
          }
          logger.info("job_handler_skeleton", {
            correlationId: ctx.correlationId,
            eventType: "background_job.run",
            meta: { jobType, jobId: job.id },
          });
          return { acknowledged: true, jobType };
        },
      });

      return jsonSuccess(
        {
          ok: true,
          phase: 12,
          correlationId: ctx.correlationId,
          ...result,
        },
        ctx
      );
    },
    { rateLimitKey: "jobs-run", rateLimitMax: 30, rateLimitWindowMs: 60_000 }
  );
}
