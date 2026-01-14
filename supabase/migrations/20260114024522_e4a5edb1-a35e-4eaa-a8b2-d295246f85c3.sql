-- Create audit table for user roles changes
CREATE TABLE public.user_roles_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'DELETE')),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  performed_by UUID NULL -- NULL when done by service role/system
);

-- Enable RLS on audit table
ALTER TABLE public.user_roles_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view role audit logs"
ON public.user_roles_audit
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- No INSERT/UPDATE/DELETE for regular users (only trigger/service role can write)
CREATE POLICY "Deny user modifications to audit"
ON public.user_roles_audit
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Create the audit function
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_roles_audit (user_id, role, action, performed_by)
    VALUES (NEW.user_id, NEW.role, 'INSERT', auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.user_roles_audit (user_id, role, action, performed_by)
    VALUES (OLD.user_id, OLD.role, 'DELETE', auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for auditing role changes
CREATE TRIGGER audit_user_roles_changes
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.audit_role_changes();

-- Add index for efficient queries
CREATE INDEX idx_user_roles_audit_user_id ON public.user_roles_audit(user_id);
CREATE INDEX idx_user_roles_audit_performed_at ON public.user_roles_audit(performed_at DESC);