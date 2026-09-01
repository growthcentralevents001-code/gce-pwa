-- Venue onboarding: MBDP can read venues they proposed (proposed or active attribution).

DROP POLICY IF EXISTS mkt_venues_select ON public.marketplace_venues;
CREATE POLICY mkt_venues_select ON public.marketplace_venues
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(id)
    OR submitted_by = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1 FROM public.marketplace_venue_attributions a
      WHERE a.venue_id = id
        AND a.bdp_user_id = public.gce_current_user_id()
    )
    OR status IN ('active', 'temporarily_inactive')
  );
