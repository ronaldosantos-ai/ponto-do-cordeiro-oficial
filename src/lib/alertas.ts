import { supabase } from "@/integrations/supabase/client";

export interface Alerta {
  id: string;
  tipo: 'data' | 'animal';
  dataAlerta: string;
  identificacaoAnimal?: string;
  ativo: boolean;
  mensagem?: string;
  criado: string;
}

// Obter usuário atual
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// SALVAR ALERTA
export async function salvarAlerta(alerta: Omit<Alerta, 'id' | 'criado'>): Promise<Alerta> {
  console.log('🔔 Salvando alerta...');
  
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }
  
  try {
    const { data, error } = await supabase
      .from('alertas')
      .insert({
        user_id: userId,
        tipo: alerta.tipo,
        data_alerta: alerta.dataAlerta,
        identificacao_animal: alerta.identificacaoAnimal || null,
        mensagem: alerta.mensagem || null,
        ativo: alerta.ativo
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao salvar alerta:', error);
      throw error;
    }

    console.log('✅ Alerta salvo:', data.id);
    
    return {
      id: data.id,
      tipo: data.tipo as 'data' | 'animal',
      dataAlerta: data.data_alerta,
      identificacaoAnimal: data.identificacao_animal || undefined,
      ativo: data.ativo,
      mensagem: data.mensagem || undefined,
      criado: data.created_at
    };
  } catch (error) {
    console.error('❌ Falha ao salvar alerta:', error);
    throw new Error('Não foi possível salvar o alerta');
  }
}

// OBTER ALERTAS
export async function obterAlertas(): Promise<Alerta[]> {
  console.log('🔔 Carregando alertas...');
  
  const userId = await getCurrentUserId();
  
  if (!userId) {
    console.warn('⚠️ Usuário não autenticado');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .eq('user_id', userId)
      .order('data_alerta', { ascending: true });

    if (error) {
      console.error('❌ Erro ao carregar alertas:', error);
      throw error;
    }

    console.log(`✅ Carregados ${data?.length || 0} alertas`);

    return (data || []).map(item => ({
      id: item.id,
      tipo: item.tipo as 'data' | 'animal',
      dataAlerta: item.data_alerta,
      identificacaoAnimal: item.identificacao_animal || undefined,
      ativo: item.ativo,
      mensagem: item.mensagem || undefined,
      criado: item.created_at
    }));
  } catch (error) {
    console.error('❌ Falha ao carregar alertas:', error);
    return [];
  }
}

// OBTER ALERTAS VENCIDOS (para notificações)
export async function obterAlertasVencidos(): Promise<Alerta[]> {
  const userId = await getCurrentUserId();
  
  if (!userId) return [];
  
  try {
    const agora = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)
      .lte('data_alerta', agora);

    if (error) {
      console.error('❌ Erro ao buscar alertas vencidos:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      tipo: item.tipo as 'data' | 'animal',
      dataAlerta: item.data_alerta,
      identificacaoAnimal: item.identificacao_animal || undefined,
      ativo: item.ativo,
      mensagem: item.mensagem || undefined,
      criado: item.created_at
    }));
  } catch (error) {
    console.error('❌ Falha ao buscar alertas vencidos:', error);
    return [];
  }
}

// ATUALIZAR STATUS DO ALERTA
export async function toggleAlerta(id: string, ativo: boolean): Promise<void> {
  console.log('🔔 Atualizando alerta:', id, ativo);
  
  try {
    const { error } = await supabase
      .from('alertas')
      .update({ ativo })
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao atualizar alerta:', error);
      throw error;
    }

    console.log('✅ Alerta atualizado');
  } catch (error) {
    console.error('❌ Falha ao atualizar alerta:', error);
    throw error;
  }
}

// DELETAR ALERTA
export async function deletarAlerta(id: string): Promise<void> {
  console.log('🔔 Deletando alerta:', id);
  
  try {
    const { error } = await supabase
      .from('alertas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar alerta:', error);
      throw error;
    }

    console.log('✅ Alerta deletado');
  } catch (error) {
    console.error('❌ Falha ao deletar alerta:', error);
    throw error;
  }
}
