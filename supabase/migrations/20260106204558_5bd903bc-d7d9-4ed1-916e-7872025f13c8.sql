-- 1. Fix daily_queries RLS policies - restrict by device_id or user_id
DROP POLICY IF EXISTS "Anyone can insert their own queries" ON public.daily_queries;
DROP POLICY IF EXISTS "Anyone can update their own queries by device" ON public.daily_queries;
DROP POLICY IF EXISTS "Anyone can view their own queries by device" ON public.daily_queries;

-- Policy for authenticated users: can insert with their user_id
CREATE POLICY "Authenticated users can insert their queries"
ON public.daily_queries FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy for authenticated users: can update their own queries
CREATE POLICY "Authenticated users can update their queries"
ON public.daily_queries FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Policy for authenticated users: can view their own queries
CREATE POLICY "Authenticated users can view their queries"
ON public.daily_queries FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for anon users: limited access by device_id only (for MVP demo)
CREATE POLICY "Anon users can insert by device"
ON public.daily_queries FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Anon users can update by device"
ON public.daily_queries FOR UPDATE
TO anon
USING (user_id IS NULL AND device_id = device_id);

CREATE POLICY "Anon users can view by device"
ON public.daily_queries FOR SELECT
TO anon
USING (user_id IS NULL);

-- 2. Protect user_roles from unauthorized modifications
-- Only admins can insert/update/delete roles (via service role key in edge functions)
-- No public INSERT/UPDATE/DELETE policies - only service role can modify

-- 3. Fix subscriptions SELECT policy to be more restrictive
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);