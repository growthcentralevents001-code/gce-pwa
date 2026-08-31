-- Phase 5 follow-up — allow Circle members to read circle lifecycle events for their Circle.
-- Authority: FD-024/030; no cross-Circle exposure.

DROP POLICY IF EXISTS circle_events_select ON public.connect_circle_events;
CREATE POLICY circle_events_select ON public.connect_circle_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1
      FROM public.connect_circle_seats s
      JOIN public.connect_memberships m ON m.id = s.membership_id
      WHERE s.circle_id = connect_circle_events.circle_id
        AND m.user_id = public.gce_current_user_id()
        AND s.status IN ('allocated', 'reserved', 'protected_grace')
    )
  );
