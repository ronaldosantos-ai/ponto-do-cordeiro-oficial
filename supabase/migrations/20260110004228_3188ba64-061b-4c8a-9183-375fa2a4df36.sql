-- Fix email enumeration vulnerability in subscriptions policy
-- Solution: Use only user_id for SELECT policy and auto-link subscriptions on user sign-in

-- Step 1: Drop the existing SELECT policy with email lookup
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Step 2: Create new SELECT policy using ONLY user_id (prevents email enumeration)
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Step 3: Create a function to link subscriptions to user_id on login
-- This runs when a user signs in and links any pending subscriptions by email
CREATE OR REPLACE FUNCTION public.link_subscription_to_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the user's email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.id;
  
  IF user_email IS NOT NULL THEN
    -- Update any subscriptions with matching email that don't have user_id set
    UPDATE public.subscriptions
    SET user_id = NEW.id
    WHERE LOWER(email) = LOWER(user_email)
      AND user_id IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 4: Create trigger on auth.users for new user signups
-- Note: We can't create triggers on auth.users directly, so we use a different approach

-- Step 5: Create a function that can be called to link subscriptions (called from client after login)
CREATE OR REPLACE FUNCTION public.link_my_subscription()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  user_email TEXT;
  rows_updated INTEGER;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = current_user_id;
  
  IF user_email IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Link any subscriptions with matching email
  UPDATE public.subscriptions
  SET user_id = current_user_id
  WHERE LOWER(email) = LOWER(user_email)
    AND user_id IS NULL;
    
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  RETURN rows_updated > 0;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.link_my_subscription() TO authenticated;

-- Step 6: Update is_premium_user to also attempt linking on check
-- This ensures subscriptions are linked when premium status is checked
CREATE OR REPLACE FUNCTION public.is_premium_user(check_user_id UUID DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  user_email TEXT;
  has_premium BOOLEAN;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(check_user_id, auth.uid());
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = target_user_id;
  
  IF user_email IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- First, attempt to link any unlinked subscriptions (one-time operation per subscription)
  UPDATE public.subscriptions
  SET user_id = target_user_id
  WHERE LOWER(email) = LOWER(user_email)
    AND user_id IS NULL;
  
  -- Check for active subscription by user_id only (secure - no email enumeration)
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = target_user_id
      AND status = 'active'
      AND expires_at > (now() - interval '7 days')
  ) INTO has_premium;
  
  RETURN has_premium;
END;
$$;