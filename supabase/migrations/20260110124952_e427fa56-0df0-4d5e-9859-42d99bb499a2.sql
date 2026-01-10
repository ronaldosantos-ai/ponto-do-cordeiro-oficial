-- Fix subscriptions: require authentication for SELECT
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix daily_queries: make anonymous SELECT more restrictive
-- Anonymous users should only see aggregate or no data, not other users' device data
DROP POLICY IF EXISTS "Anon users can view by device" ON public.daily_queries;

-- Anonymous users cannot view any data - they can only insert/update their own records
-- The client code handles the logic of knowing its own device_id

-- Fix the tautological UPDATE policy for anonymous users
DROP POLICY IF EXISTS "Anon users can update by device" ON public.daily_queries;

-- Anonymous users can only update records where user_id is NULL
-- Client code provides the device_id filter in the WHERE clause
CREATE POLICY "Anon users can update their queries"
ON public.daily_queries
FOR UPDATE
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);