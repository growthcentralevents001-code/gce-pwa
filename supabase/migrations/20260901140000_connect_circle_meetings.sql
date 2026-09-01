-- GCE Connect Circle meetings — minimum persisted schedule (FD-030).
-- Development only. No attendance / Phygital framework in this migration.

DO $$ BEGIN
  CREATE TYPE public.circle_meeting_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.connect_circle_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  status public.circle_meeting_status NOT NULL DEFAULT 'scheduled',
  title text,
  location text,
  notes text,
  created_by uuid REFERENCES public.users(id),
  updated_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_circle_meetings_scheduled_at_chk CHECK (scheduled_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_connect_circle_meetings_circle_scheduled
  ON public.connect_circle_meetings (circle_id, scheduled_at DESC);

CREATE INDEX IF NOT EXISTS idx_connect_circle_meetings_circle_status
  ON public.connect_circle_meetings (circle_id, status);

DROP TRIGGER IF EXISTS trg_connect_circle_meetings_updated_at ON public.connect_circle_meetings;
CREATE TRIGGER trg_connect_circle_meetings_updated_at
  BEFORE UPDATE ON public.connect_circle_meetings
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Read scope: platform admin, Circle seat holder, or assigned Connect BDP unit owner.
CREATE OR REPLACE FUNCTION public.gce_user_can_read_circle_meetings(p_circle_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM public.connect_circle_seats s
      JOIN public.connect_memberships m ON m.id = s.membership_id
      WHERE s.circle_id = p_circle_id
        AND m.user_id = public.gce_current_user_id()
        AND s.status IN ('allocated', 'reserved', 'protected_grace')
    )
    OR EXISTS (
      SELECT 1
      FROM public.connect_bdp_circle_assignments a
      WHERE a.circle_id = p_circle_id
        AND a.status = 'active'
        AND public.gce_is_connect_bdp_owner(a.unit_id)
    );
$$;

ALTER TABLE public.connect_circle_meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_meetings_select ON public.connect_circle_meetings;
CREATE POLICY circle_meetings_select ON public.connect_circle_meetings
  FOR SELECT TO authenticated
  USING (public.gce_user_can_read_circle_meetings(circle_id));

DROP POLICY IF EXISTS circle_meetings_admin_write ON public.connect_circle_meetings;
CREATE POLICY circle_meetings_admin_write ON public.connect_circle_meetings
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

COMMENT ON TABLE public.connect_circle_meetings IS
  'FD-030 Circle meeting schedule — Ops-managed; members/BDP read-only via RLS';
