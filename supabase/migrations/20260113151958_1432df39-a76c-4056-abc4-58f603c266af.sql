-- Add explicit policy to deny anonymous users from accessing subscriptions
-- This is a defense-in-depth measure to explicitly block anon access
CREATE POLICY "Deny anonymous access to subscriptions"
ON public.subscriptions
FOR SELECT
TO anon
USING (false);