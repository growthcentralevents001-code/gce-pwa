-- Enterprise Core integrity gate (Task 5 closeout)
-- A) One active project per opportunity (concurrency-safe duplicate guard)
-- B) Retire writable legacy enterprise_applications client inserts (historical_only)

CREATE UNIQUE INDEX IF NOT EXISTS uq_enterprise_project_one_active_per_opportunity
  ON public.enterprise_projects (opportunity_id)
  WHERE opportunity_id IS NOT NULL
    AND status IN ('setup', 'approved', 'active', 'on_hold');

-- enterprise_applications is historical_only (Phase 8 registry); block new client writes.
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.enterprise_applications;

CREATE POLICY enterprise_applications_no_client_insert ON public.enterprise_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (false);
