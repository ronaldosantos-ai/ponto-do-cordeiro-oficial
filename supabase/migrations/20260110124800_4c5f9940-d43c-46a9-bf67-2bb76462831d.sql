-- Explicitly deny INSERT for all users (subscriptions created via webhook only using service role)
CREATE POLICY "Subscriptions insert denied for users"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Explicitly deny UPDATE for all users (subscriptions updated via webhook only using service role)
CREATE POLICY "Subscriptions update denied for users"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (false);

-- Explicitly deny DELETE for all users (subscriptions deleted via admin/webhook only using service role)
CREATE POLICY "Subscriptions delete denied for users"
ON public.subscriptions
FOR DELETE
TO authenticated
USING (false);