-- Create a SECURITY DEFINER function to check premium status server-side
-- This prevents client-side manipulation of premium status

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
  
  -- Check for active subscription by user_id OR email (with 7-day grace period)
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE (user_id = target_user_id OR LOWER(email) = LOWER(user_email))
      AND status = 'active'
      AND expires_at > (now() - interval '7 days')
  ) INTO has_premium;
  
  RETURN has_premium;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_premium_user(UUID) TO authenticated;

-- Update alertas policies to include premium check for INSERT
-- First drop existing INSERT policy
DROP POLICY IF EXISTS "Usuarios podem criar alertas" ON public.alertas;

-- Create new INSERT policy with premium check
CREATE POLICY "Premium users can create alertas" 
ON public.alertas 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND public.is_premium_user(auth.uid())
);

-- Update historico_simulacoes INSERT policy to require premium for 'premium' type simulations
-- First drop existing INSERT policy
DROP POLICY IF EXISTS "Usuarios autenticados podem inserir suas simulacoes" ON public.historico_simulacoes;

-- Create new INSERT policy - allows all authenticated users to insert, 
-- but premium type requires premium status
CREATE POLICY "Usuarios podem inserir simulacoes" 
ON public.historico_simulacoes 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    tipo = 'mvp' 
    OR public.is_premium_user(auth.uid())
  )
);