import { supabase } from "@/integrations/supabase/client";

const LIMITE_CONSULTAS_DIARIAS = 5;

// Gerar device_id único para usuários não autenticados
function getDeviceId(): string {
  const key = 'ponto_cordeiro_device_id';
  let deviceId = localStorage.getItem(key);
  
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(key, deviceId);
  }
  
  return deviceId;
}

// Verificar consultas diárias no backend
// Note: Anonymous users may not have SELECT access, so we use fail-open approach
// The real limit is enforced on INSERT/UPDATE via RLS
export async function verificarConsultasDiarias(): Promise<{ count: number; remaining: number; canQuery: boolean }> {
  const deviceId = getDeviceId();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // Authenticated users can query their own records
    const { data, error } = await supabase
      .from('daily_queries')
      .select('query_count')
      .eq('device_id', deviceId)
      .eq('query_date', today)
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (error) {
      // Fail-open to not block users
      return { count: 0, remaining: LIMITE_CONSULTAS_DIARIAS, canQuery: true };
    }
    
    const count = data?.query_count || 0;
    const remaining = Math.max(0, LIMITE_CONSULTAS_DIARIAS - count);
    
    return { count, remaining, canQuery: count < LIMITE_CONSULTAS_DIARIAS };
  }
  
  // Anonymous users: optimistically allow queries
  // The real limit is enforced server-side on INSERT/UPDATE
  // We track locally as a UI hint, but server is source of truth
  const localKey = `daily_query_count_${today}`;
  const localCount = parseInt(localStorage.getItem(localKey) || '0', 10);
  const remaining = Math.max(0, LIMITE_CONSULTAS_DIARIAS - localCount);
  
  return { count: localCount, remaining, canQuery: localCount < LIMITE_CONSULTAS_DIARIAS };
}

// Incrementar contador de consultas no backend
export async function incrementarConsultasDiarias(): Promise<{ count: number; remaining: number }> {
  const deviceId = getDeviceId();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;
  
  let newCount: number;
  
  if (userId) {
    // Authenticated user flow - can read and write
    const { data: existing } = await supabase
      .from('daily_queries')
      .select('id, query_count')
      .eq('device_id', deviceId)
      .eq('query_date', today)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existing) {
      const { error } = await supabase
        .from('daily_queries')
        .update({ query_count: existing.query_count + 1 })
        .eq('id', existing.id);
      
      if (error) {
        return { count: existing.query_count, remaining: LIMITE_CONSULTAS_DIARIAS - existing.query_count };
      }
      newCount = existing.query_count + 1;
    } else {
      const { error } = await supabase
        .from('daily_queries')
        .insert({ device_id: deviceId, query_count: 1, user_id: userId });
      
      if (error) {
        return { count: 0, remaining: LIMITE_CONSULTAS_DIARIAS };
      }
      newCount = 1;
    }
  } else {
    // Anonymous user flow - try INSERT first, then UPDATE if exists
    // We can't SELECT to check, so we use upsert-like pattern
    const localKey = `daily_query_count_${today}`;
    const localCount = parseInt(localStorage.getItem(localKey) || '0', 10);
    
    if (localCount === 0) {
      // First query today - try INSERT
      const { error } = await supabase
        .from('daily_queries')
        .insert({ device_id: deviceId, query_count: 1, user_id: null });
      
      if (error) {
        // Might already exist, try UPDATE
        const { error: updateError } = await supabase
          .from('daily_queries')
          .update({ query_count: localCount + 1 })
          .eq('device_id', deviceId)
          .eq('query_date', today)
          .is('user_id', null);
        
        if (updateError) {
          return { count: localCount, remaining: LIMITE_CONSULTAS_DIARIAS - localCount };
        }
      }
    } else {
      // Subsequent queries - try UPDATE
      const { error } = await supabase
        .from('daily_queries')
        .update({ query_count: localCount + 1 })
        .eq('device_id', deviceId)
        .eq('query_date', today)
        .is('user_id', null);
      
      if (error) {
        return { count: localCount, remaining: LIMITE_CONSULTAS_DIARIAS - localCount };
      }
    }
    
    newCount = localCount + 1;
    localStorage.setItem(localKey, newCount.toString());
  }
  
  return { count: newCount, remaining: Math.max(0, LIMITE_CONSULTAS_DIARIAS - newCount) };
}

export const LIMITE_DIARIO = LIMITE_CONSULTAS_DIARIAS;
