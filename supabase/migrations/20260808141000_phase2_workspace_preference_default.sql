-- Phase 2 workspace preference columns hardening (ADR-003)
ALTER TABLE public.user_workspace_preferences
  ADD COLUMN IF NOT EXISTS default_workspace_key text REFERENCES public.workspaces(workspace_key);

COMMENT ON COLUMN public.user_workspace_preferences.default_workspace_key IS
  'Preferred default workspace; last_workspace_key tracks most recent switch';
