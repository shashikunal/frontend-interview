-- =============================================================================
-- Remove the 'pro_member' tier and the per-feature entitlement system.
--
-- Context: the platform had a two-tier model where a 'candidate' was gated out
-- of system_design / video_mock / compiler_studios, and only an admin-granted
-- 'pro_member' got full access. That concept is removed: every authenticated
-- account now has full access to every module.
--
-- Postgres cannot DROP a value from an ENUM, so the legacy 'pro_member' enum
-- label is intentionally left in place (harmless and unused) while all rows
-- are remapped to 'candidate'.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Remap every 'pro_member' profile to 'candidate'
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  migrated INTEGER;
BEGIN
  UPDATE public.profiles SET role = 'candidate', updated_at = NOW()
   WHERE role = 'pro_member';
  GET DIAGNOSTICS migrated = ROW_COUNT;
  RAISE NOTICE 'Remapped % pro_member profile(s) to candidate', migrated;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Remap user_roles join rows
-- -----------------------------------------------------------------------------
DELETE FROM public.user_roles WHERE role_id = 'pro_member';

-- -----------------------------------------------------------------------------
-- 3. Remap role_permissions: give 'candidate' everything pro_member had, then
--    drop the pro_member rows.
-- -----------------------------------------------------------------------------
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'candidate', permission_id
  FROM public.role_permissions
 WHERE role_id = 'pro_member'
ON CONFLICT (role_id, permission_id) DO NOTHING;

DELETE FROM public.role_permissions WHERE role_id = 'pro_member';

-- Ensure candidate holds the full feature permission set.
INSERT INTO public.role_permissions (role_id, permission_id)
VALUES
  ('candidate', 'questions:read_basic'),
  ('candidate', 'questions:read_full'),
  ('candidate', 'coding:execute'),
  ('candidate', 'system_design:access'),
  ('candidate', 'mocks:video_ai'),
  ('candidate', 'studios:compilers'),
  ('candidate', 'sync:cloud_database')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- interviewer had no rows at all; give it the same full-access set.
INSERT INTO public.role_permissions (role_id, permission_id)
VALUES
  ('interviewer', 'questions:read_basic'),
  ('interviewer', 'questions:read_full'),
  ('interviewer', 'coding:execute'),
  ('interviewer', 'system_design:access'),
  ('interviewer', 'mocks:video_ai'),
  ('interviewer', 'studios:compilers'),
  ('interviewer', 'sync:cloud_database')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Remove the 'pro_member' role definition and collapse the hierarchy gap
-- -----------------------------------------------------------------------------
DELETE FROM public.roles WHERE id = 'pro_member';

UPDATE public.roles SET hierarchy_level = 2 WHERE id = 'interviewer';
UPDATE public.roles SET hierarchy_level = 3 WHERE id = 'admin';

UPDATE public.roles SET description = 'Standard candidate tier with full feature access'
 WHERE id = 'candidate';

-- -----------------------------------------------------------------------------
-- 5. Drop the entitlement column
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name    = 'profiles'
       AND column_name   = 'feature_entitlements'
  ) THEN
    ALTER TABLE public.profiles DROP COLUMN feature_entitlements;
    RAISE NOTICE 'Dropped public.profiles.feature_entitlements';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 6. Drop the 'pro' substring role heuristic from the signup trigger.
--    Previously ANY signup whose email contained "pro" (profile@, proctor@,
--    prometheus@) was silently promoted to pro_member.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role public.app_role;
BEGIN
  IF (new.raw_user_meta_data->>'role' = 'admin' OR new.email ILIKE '%admin%') THEN
    v_role := 'admin';
  ELSIF (new.raw_user_meta_data->>'role' = 'interviewer') THEN
    v_role := 'interviewer';
  ELSE
    v_role := 'candidate';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    v_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  BEGIN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (new.id, v_role::text)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  EXCEPTION
    WHEN undefined_table THEN NULL;
  END;

  RETURN new;
END;
$$;