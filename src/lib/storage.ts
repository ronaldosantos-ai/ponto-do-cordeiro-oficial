import { supabase } from "@/integrations/supabase/client";
import { SimulationData, ResultData } from './calculations';

export interface HistoricoItem {
  id: string;
  tipo: 'mvp' | 'premium';
  dados: SimulationData;
  resultado: ResultData;
  identificacao?: string;
  timestamp: string;
}

// Obter usuário atual
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// SALVAR SIMULAÇÃO
export async function salvarSimulacao(item: Omit<HistoricoItem, 'id' | 'timestamp'>): Promise<HistoricoItem> {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }
  
  const { data, error } = await supabase
    .from('historico_simulacoes')
    .insert({
      user_id: userId,
      device_id: 'web',
      tipo: item.tipo,
      dados: item.dados as any,
      resultado: item.resultado as any,
      identificacao: item.identificacao || null
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  return {
    id: data.id,
    tipo: data.tipo as 'mvp' | 'premium',
    dados: data.dados as unknown as SimulationData,
    resultado: data.resultado as unknown as ResultData,
    identificacao: data.identificacao || undefined,
    timestamp: data.created_at
  };
}

// OBTER HISTÓRICO
export async function obterHistorico(): Promise<HistoricoItem[]> {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('historico_simulacoes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    tipo: item.tipo as 'mvp' | 'premium',
    dados: item.dados as unknown as SimulationData,
    resultado: item.resultado as unknown as ResultData,
    identificacao: item.identificacao || undefined,
    timestamp: item.created_at
  }));
}

// DELETAR ITEM
export async function deletarItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('historico_simulacoes')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

// LIMPAR HISTÓRICO
export async function limparHistorico(): Promise<void> {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }
  
  const { error } = await supabase
    .from('historico_simulacoes')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

// PREMIUM - Server-side check using RPC function
// This uses the is_premium_user() function defined in the database
// which is a SECURITY DEFINER function that validates subscription status
export async function verificarPremiumAsync(userEmail?: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Not authenticated - cannot have premium
      return false;
    }

    // Call the server-side RPC function to check premium status
    // This function checks the subscriptions table with proper security
    const { data: isPremium, error } = await supabase
      .rpc('is_premium_user', { check_user_id: user.id });

    if (error) {
      console.error('Erro ao verificar premium via RPC:', error);
      return false;
    }

    return isPremium === true;
  } catch (error) {
    console.error('Erro ao verificar premium:', error);
    return false;
  }
}

// Legacy function kept for backward compatibility but always returns false
// Server-side RPC is the only source of truth for premium status
export function verificarPremium(): boolean {
  // Always return false - premium status must be verified via verificarPremiumAsync
  // This prevents localStorage manipulation attacks
  return false;
}

// These functions are deprecated - premium status is managed server-side only
// Kept for backward compatibility but they no longer affect premium verification
export function ativarPremium(): void {
  // No-op - premium status is managed via webhook and database only
  console.warn('ativarPremium() is deprecated. Premium is managed server-side.');
}

export function desativarPremium(): void {
  // No-op - premium status is managed via webhook and database only
  console.warn('desativarPremium() is deprecated. Premium is managed server-side.');
}
