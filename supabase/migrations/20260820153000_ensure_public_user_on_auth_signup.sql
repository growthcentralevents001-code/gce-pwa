-- Ensure auth.users signup also creates public.users (profiles FK target).
-- Legacy convention: public.users.id matches auth.users.id.
-- Also backfills auth users that were missing a public.users row.

CREATE OR REPLACE FUNCTION public.add_member_role_on_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.email, ''), NEW.id::text || '@unknown.local'),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NULL
    )
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role, approved, approved_at)
  VALUES (NEW.id, 'member', true, NOW())
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Backfill existing auth identities that never got a public.users row.
INSERT INTO public.users (id, email, name)
SELECT
  au.id,
  COALESCE(NULLIF(au.email, ''), au.id::text || '@unknown.local'),
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    NULL
  )
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
