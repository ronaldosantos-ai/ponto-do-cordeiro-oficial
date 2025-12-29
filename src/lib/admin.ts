import { supabase } from '@/integrations/supabase/client';

const SUPER_ADMIN_EMAIL = 'ronaldosantosjp01@gmail.com';

export async function getCurrentUserEmail(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export function isSuperAdminEmail(email: string | null): boolean {
  return email === SUPER_ADMIN_EMAIL;
}

export async function checkIsSuperAdmin(): Promise<boolean> {
  const email = await getCurrentUserEmail();
  return isSuperAdminEmail(email);
}

// Sync version for components that already have user data
export function isSuperAdmin(email: string | null | undefined): boolean {
  return email === SUPER_ADMIN_EMAIL;
}
