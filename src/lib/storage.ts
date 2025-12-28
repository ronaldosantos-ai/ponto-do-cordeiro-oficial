import { SimulationData, ResultData } from './calculations';

export interface HistoricoItem {
  id: string;
  tipo: 'mvp' | 'premium';
  dados: SimulationData;
  resultado: ResultData;
  identificacao?: string;
  timestamp: string;
}

// Usar window.storage ao invés de localStorage
export async function salvarSimulacao(item: Omit<HistoricoItem, 'id' | 'timestamp'>): Promise<HistoricoItem> {
  try {
    const novoItem: HistoricoItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    // Salvar com chave única
    await (window as any).storage.set(
      `simulacao:${novoItem.id}`,
      JSON.stringify(novoItem),
      false // false = dados pessoais do usuário
    );
    
    return novoItem;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    throw error;
  }
}

export async function obterHistorico(): Promise<HistoricoItem[]> {
  try {
    // Listar todas as chaves que começam com 'simulacao:'
    const result = await (window as any).storage.list('simulacao:', false);
    
    if (!result || !result.keys) {
      return [];
    }
    
    // Buscar cada simulação
    const promises = result.keys.map(async (key: string) => {
      try {
        const item = await (window as any).storage.get(key, false);
        if (item && item.value) {
          return JSON.parse(item.value) as HistoricoItem;
        }
        return null;
      } catch (error) {
        console.error(`Erro ao ler ${key}:`, error);
        return null;
      }
    });
    
    const items = await Promise.all(promises);
    
    // Filtrar nulls e ordenar por data (mais recente primeiro)
    return items
      .filter((item): item is HistoricoItem => item !== null)
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return [];
  }
}

export async function deletarItem(id: string): Promise<void> {
  try {
    await (window as any).storage.delete(`simulacao:${id}`, false);
  } catch (error) {
    console.error('Erro ao deletar:', error);
    throw error;
  }
}

export async function limparHistorico(): Promise<void> {
  try {
    const result = await (window as any).storage.list('simulacao:', false);
    if (result && result.keys) {
      // Deletar todas as simulações
      await Promise.all(
        result.keys.map((key: string) => (window as any).storage.delete(key, false))
      );
    }
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    throw error;
  }
}

// Sistema de Premium (mantém no localStorage por enquanto)
export function verificarPremium(): boolean {
  const premium = localStorage.getItem('ponto_cordeiro_premium');
  return premium === 'ativo';
}

export function ativarPremium(): void {
  localStorage.setItem('ponto_cordeiro_premium', 'ativo');
}

export function desativarPremium(): void {
  localStorage.removeItem('ponto_cordeiro_premium');
}
