-- Update is_premium_user() to grant automatic Premium access to admins
CREATE OR REPLACE FUNCTION public.is_premium_user(check_user_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
  user_email TEXT;
  has_premium BOOLEAN;
  caller_id UUID;
  caller_is_admin BOOLEAN;
BEGIN
  caller_id := auth.uid();

  IF caller_id IS NULL THEN
    RETURN FALSE;
  END IF;

  target_user_id := COALESCE(check_user_id, caller_id);

  -- Only allow checking other users if caller is admin
  IF target_user_id <> caller_id THEN
    caller_is_admin := public.has_role(caller_id, 'admin');
    IF NOT caller_is_admin THEN
      RETURN FALSE;
    END IF;
  END IF;

  -- SUPER ADMIN: Admins automatically get Premium access
  IF public.has_role(target_user_id, 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = target_user_id;

  IF user_email IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Only auto-link when the caller is checking themselves
  IF target_user_id = caller_id THEN
    UPDATE public.subscriptions
    SET user_id = target_user_id
    WHERE LOWER(email) = LOWER(user_email)
      AND user_id IS NULL;
  END IF;

  -- Check for active subscription by user_id only
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = target_user_id
      AND status = 'active'
      AND expires_at > (now() - interval '7 days')
  ) INTO has_premium;

  RETURN has_premium;
END;
$$;