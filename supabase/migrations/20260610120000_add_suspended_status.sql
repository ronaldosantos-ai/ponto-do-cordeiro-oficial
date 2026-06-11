-- Add 'suspended' status for subscriptions with failed/pending payment renewal
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_status_check
  CHECK (status IN ('active', 'canceled', 'expired', 'pending', 'suspended'));
