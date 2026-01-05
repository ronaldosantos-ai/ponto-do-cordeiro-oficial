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
export async function verificarConsultasDiarias(): Promise<{ count: number; remaining: number; canQuery: boolean }> {
  const deviceId = getDeviceId();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_queries')
    .select('query_count')
    .eq('device_id', deviceId)
    .eq('query_date', today)
    .maybeSingle();
  
  if (error) {
    // Em caso de erro, permitir consulta (fail-open para não bloquear usuários)
    return { count: 0, remaining: LIMITE_CONSULTAS_DIARIAS, canQuery: true };
  }
  
  const count = data?.query_count || 0;
  const remaining = Math.max(0, LIMITE_CONSULTAS_DIARIAS - count);
  
  return { count, remaining, canQuery: count < LIMITE_CONSULTAS_DIARIAS };
}

// Incrementar contador de consultas no backend
export async function incrementarConsultasDiarias(): Promise<{ count: number; remaining: number }> {
  const deviceId = getDeviceId();
  const today = new Date().toISOString().split('T')[0];
  
  // Tentar atualizar registro existente
  const { data: existing } = await supabase
    .from('daily_queries')
    .select('id, query_count')
    .eq('device_id', deviceId)
    .eq('query_date', today)
    .maybeSingle();
  
  let newCount: number;
  
  if (existing) {
    // Atualizar registro existente
    const { error } = await supabase
      .from('daily_queries')
      .update({ query_count: existing.query_count + 1 })
      .eq('id', existing.id);
    
    if (error) {
      // Retornar contagem atual em caso de erro
      return { count: existing.query_count, remaining: LIMITE_CONSULTAS_DIARIAS - existing.query_count };
    }
    
    newCount = existing.query_count + 1;
  } else {
    // Criar novo registro
    const { error } = await supabase
      .from('daily_queries')
      .insert({ device_id: deviceId, query_count: 1 });
    
    if (error) {
      return { count: 0, remaining: LIMITE_CONSULTAS_DIARIAS };
    }
    
    newCount = 1;
  }
  
  return { count: newCount, remaining: Math.max(0, LIMITE_CONSULTAS_DIARIAS - newCount) };
}

export const LIMITE_DIARIO = LIMITE_CONSULTAS_DIARIAS;
