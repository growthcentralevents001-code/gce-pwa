-- Phase 2 background job foundation (ADR-014)
-- Additive only. No money settlement execution.

DO $$ BEGIN
  CREATE TYPE public.background_job_status AS ENUM (
    'pending',
    'leased',
    'running',
    'succeeded',
    'failed',
    'dead_letter'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.background_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL,
  status public.background_job_status NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  available_at timestamptz NOT NULL DEFAULT now(),
  leased_until timestamptz,
  lease_owner text,
  last_error text,
  correlation_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (job_type, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_background_jobs_poll
  ON public.background_jobs (status, available_at);

DROP TRIGGER IF EXISTS trg_background_jobs_updated_at ON public.background_jobs;
CREATE TRIGGER trg_background_jobs_updated_at
  BEFORE UPDATE ON public.background_jobs
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;

-- Deny-by-default for authenticated clients; workers use service role.
DROP POLICY IF EXISTS background_jobs_admin_select ON public.background_jobs;
CREATE POLICY background_jobs_admin_select ON public.background_jobs
  FOR SELECT TO authenticated
  USING (public.gce_is_platform_admin());

DROP POLICY IF EXISTS background_jobs_admin_write ON public.background_jobs;
CREATE POLICY background_jobs_admin_write ON public.background_jobs
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

COMMENT ON TABLE public.background_jobs IS 'ADR-014 job foundation; money jobs must be idempotent and feature-gated';
