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

// PREMIUM - Legacy sync check (fallback)
export function verificarPremium(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ponto_cordeiro_premium') === 'ativo';
}

// PREMIUM - Async check from database
export async function verificarPremiumAsync(userEmail?: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user && !userEmail) {
      return verificarPremium();
    }

    const email = userEmail || user?.email;
    
    if (!email) {
      return verificarPremium();
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('status, expires_at')
      .eq('email', email.toLowerCase())
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      return verificarPremium();
    }

    if (!subscription) {
      return verificarPremium();
    }

    // Check if subscription is still valid
    const expiresAt = new Date(subscription.expires_at);
    const isValid = subscription.status === 'active' && expiresAt > new Date();

    if (isValid) {
      localStorage.setItem('ponto_cordeiro_premium', 'ativo');
    } else {
      localStorage.removeItem('ponto_cordeiro_premium');
    }

    return isValid;
  } catch {
    return verificarPremium();
  }
}

export function ativarPremium(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ponto_cordeiro_premium', 'ativo');
  }
}

export function desativarPremium(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ponto_cordeiro_premium');
  }
}
