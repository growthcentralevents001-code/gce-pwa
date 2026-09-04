-- Circle meeting attendance + Lead Assist meeting context (FD-030 / PDFs 1.1 + 6.1).
-- Extends connect_circle_meetings. Does not create a second referral or meeting engine.

DO $$ BEGIN
  CREATE TYPE public.circle_meeting_attendance_status AS ENUM (
    'scheduled',
    'attended',
    'absent',
    'excused'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.connect_circle_meeting_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES public.connect_circle_meetings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  membership_id uuid REFERENCES public.connect_memberships(id) ON DELETE SET NULL,
  status public.circle_meeting_attendance_status NOT NULL DEFAULT 'scheduled',
  recorded_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_circle_meeting_attendance_user UNIQUE (meeting_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_meeting_attendance_meeting
  ON public.connect_circle_meeting_attendance (meeting_id, status);

DROP TRIGGER IF EXISTS trg_connect_circle_meeting_attendance_updated_at
  ON public.connect_circle_meeting_attendance;
CREATE TRIGGER trg_connect_circle_meeting_attendance_updated_at
  BEFORE UPDATE ON public.connect_circle_meeting_attendance
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

ALTER TABLE public.connect_circle_meeting_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_meeting_attendance_select ON public.connect_circle_meeting_attendance;
CREATE POLICY circle_meeting_attendance_select ON public.connect_circle_meeting_attendance
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR user_id = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1
      FROM public.connect_circle_meetings m
      WHERE m.id = meeting_id
        AND public.gce_user_can_read_circle_meetings(m.circle_id)
    )
  );

DROP POLICY IF EXISTS circle_meeting_attendance_own_write ON public.connect_circle_meeting_attendance;
CREATE POLICY circle_meeting_attendance_own_write ON public.connect_circle_meeting_attendance
  FOR INSERT TO authenticated
  WITH CHECK (
    public.gce_is_platform_admin()
    OR (
      user_id = public.gce_current_user_id()
      AND status IN (
        'scheduled'::public.circle_meeting_attendance_status,
        'excused'::public.circle_meeting_attendance_status
      )
      AND EXISTS (
        SELECT 1
        FROM public.connect_circle_meetings m
        WHERE m.id = meeting_id
          AND public.gce_user_can_read_circle_meetings(m.circle_id)
      )
    )
  );

DROP POLICY IF EXISTS circle_meeting_attendance_own_update ON public.connect_circle_meeting_attendance;
CREATE POLICY circle_meeting_attendance_own_update ON public.connect_circle_meeting_attendance
  FOR UPDATE TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR user_id = public.gce_current_user_id()
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR (
      user_id = public.gce_current_user_id()
      AND status IN (
        'scheduled'::public.circle_meeting_attendance_status,
        'excused'::public.circle_meeting_attendance_status
      )
    )
  );

COMMENT ON TABLE public.connect_circle_meeting_attendance IS
  'FD-030 Circle meeting attendance — members RSVP own row; Ops records attended/absent';

ALTER TABLE public.assist_leads
  ADD COLUMN IF NOT EXISTS meeting_id uuid REFERENCES public.connect_circle_meetings(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_assist_leads_meeting
  ON public.assist_leads (meeting_id)
  WHERE meeting_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_connect_circle_meetings_circle_scheduled_at
  ON public.connect_circle_meetings (circle_id, scheduled_at)
  WHERE status = 'scheduled';

INSERT INTO public.notification_templates (
  template_key, version, channel, locale, category,
  subject_template, title_template, body_template, variables_schema
) VALUES
  ('connect.circle_meeting', 1, 'in_app', 'en-IN', 'operational',
   NULL, 'Circle meeting update', '{{summary}}',
   '{"required":["summary"]}'::jsonb)
ON CONFLICT (template_key, version, channel, locale) DO NOTHING;
