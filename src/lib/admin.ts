import { supabase } from '@/integrations/supabase/client';

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    console.error('Erro ao verificar admin:', error);
    return false;
  }

  return data !== null;
}
