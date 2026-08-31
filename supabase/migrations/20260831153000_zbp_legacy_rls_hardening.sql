-- Legacy ZBP tables (FD-039 inactive). Closes Supabase CRITICAL rls_disabled_in_public.
-- Active product uses marketplace_bdp / marketplace_venues — not zbp_*.

DO $$
BEGIN
  IF to_regclass('public.zbp_partners') IS NOT NULL THEN
    ALTER TABLE public.zbp_partners ENABLE ROW LEVEL SECURITY;
    -- Policy "ZBP can view own partner" (SELECT own row) may already exist from legacy schema.
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.zbp_applications') IS NOT NULL THEN
    ALTER TABLE public.zbp_applications ENABLE ROW LEVEL SECURITY;
    -- Deny-by-default for JWT roles: no policies on inactive commercial model.
  END IF;
END $$;

-- Narrow grants: block anon; authenticated read-only on own zbp_partners row via existing policy.
DO $$
BEGIN
  IF to_regclass('public.zbp_applications') IS NOT NULL THEN
    REVOKE ALL ON TABLE public.zbp_applications FROM anon, authenticated;
    GRANT ALL ON TABLE public.zbp_applications TO service_role;
  END IF;

  IF to_regclass('public.zbp_partners') IS NOT NULL THEN
    REVOKE ALL ON TABLE public.zbp_partners FROM anon;
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.zbp_partners FROM authenticated;
    GRANT SELECT ON TABLE public.zbp_partners TO authenticated;
    GRANT ALL ON TABLE public.zbp_partners TO service_role;
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

COMMENT ON TABLE public.zbp_partners IS
  'Legacy ZBP (inactive FD-039). RLS enforced — not Marketplace BDP.';
COMMENT ON TABLE public.zbp_applications IS
  'Legacy ZBP applications (inactive FD-039). RLS deny-by-default for JWT roles.';
