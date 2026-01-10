-- Add SELECT policy for anonymous users to read their query counts
-- They can only read records where user_id IS NULL (anonymous records)
-- Client code filters by device_id in the WHERE clause
CREATE POLICY "Anon users can view their queries"
ON public.daily_queries
FOR SELECT
TO anon
USING (user_id IS NULL);