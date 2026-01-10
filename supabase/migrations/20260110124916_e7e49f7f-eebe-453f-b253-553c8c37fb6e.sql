-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Create new SELECT policy requiring authentication
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);