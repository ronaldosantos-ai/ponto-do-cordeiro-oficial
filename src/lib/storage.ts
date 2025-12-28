import { SimulationData, ResultData } from './calculations';

export interface HistoricoItem {
  id: string;
  tipo: 'mvp' | 'premium';
  dados: SimulationData;
  resultado: ResultData;
  identificacao?: string;
  timestamp: string;
}

// Função auxiliar para gerar ID único
function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// SALVAR SIMULAÇÃO
export async function salvarSimulacao(item: Omit<HistoricoItem, 'id' | 'timestamp'>): Promise<HistoricoItem> {
  console.log('🔵 Tentando salvar simulação...', item);
  
  const novoItem: HistoricoItem = {
    ...item,
    id: gerarId(),
    timestamp: new Date().toISOString()
  };
  
  // Método 1: Tentar window.storage
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      console.log('🔵 Tentando window.storage...');
      const chave = `simulacao:${novoItem.id}`;
      const resultado = await (window as any).storage.set(chave, JSON.stringify(novoItem), false);
      
      if (resultado) {
        console.log('✅ Salvo com window.storage');
        return novoItem;
      }
    }
  } catch (erro) {
    console.warn('⚠️ window.storage falhou:', erro);
  }
  
  // Método 2: Fallback para localStorage
  try {
    console.log('🔵 Usando localStorage como fallback...');
    const chave = 'ponto_cordeiro_historico';
    const historicoStr = localStorage.getItem(chave);
    const historico: HistoricoItem[] = historicoStr ? JSON.parse(historicoStr) : [];
    
    historico.unshift(novoItem);
    
    // Limitar a 100 itens
    if (historico.length > 100) {
      historico.splice(100);
    }
    
    localStorage.setItem(chave, JSON.stringify(historico));
    console.log('✅ Salvo com localStorage');
    return novoItem;
  } catch (erro) {
    console.error('❌ Todos os métodos falharam:', erro);
    throw new Error('Não foi possível salvar a simulação');
  }
}

// OBTER HISTÓRICO
export async function obterHistorico(): Promise<HistoricoItem[]> {
  console.log('🔵 Carregando histórico...');
  
  let itensStorage: HistoricoItem[] = [];
  let itensLocal: HistoricoItem[] = [];
  
  // Método 1: Tentar window.storage
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      console.log('🔵 Tentando carregar de window.storage...');
      const resultado = await (window as any).storage.list('simulacao:', false);
      
      if (resultado && resultado.keys && resultado.keys.length > 0) {
        for (const chave of resultado.keys) {
          try {
            const item = await (window as any).storage.get(chave, false);
            if (item && item.value) {
              itensStorage.push(JSON.parse(item.value));
            }
          } catch (erro) {
            console.warn(`⚠️ Erro ao ler ${chave}:`, erro);
          }
        }
        console.log(`✅ Carregados ${itensStorage.length} itens do window.storage`);
      }
    }
  } catch (erro) {
    console.warn('⚠️ window.storage falhou:', erro);
  }
  
  // Método 2: Carregar do localStorage
  try {
    const chave = 'ponto_cordeiro_historico';
    const historicoStr = localStorage.getItem(chave);
    if (historicoStr) {
      itensLocal = JSON.parse(historicoStr);
      console.log(`✅ Carregados ${itensLocal.length} itens do localStorage`);
    }
  } catch (erro) {
    console.warn('⚠️ localStorage falhou:', erro);
  }
  
  // Combinar e remover duplicatas
  const todosCombinados = [...itensStorage, ...itensLocal];
  const mapaUnico = new Map<string, HistoricoItem>();
  
  todosCombinados.forEach(item => {
    if (!mapaUnico.has(item.id)) {
      mapaUnico.set(item.id, item);
    }
  });
  
  const resultado = Array.from(mapaUnico.values()).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  console.log(`✅ Total final: ${resultado.length} itens`);
  return resultado;
}

// DELETAR ITEM
export async function deletarItem(id: string): Promise<void> {
  console.log('🔵 Deletando item:', id);
  
  // Tentar window.storage
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      await (window as any).storage.delete(`simulacao:${id}`, false);
      console.log('✅ Deletado do window.storage');
    }
  } catch (erro) {
    console.warn('⚠️ Erro ao deletar de window.storage:', erro);
  }
  
  // Deletar do localStorage
  try {
    const chave = 'ponto_cordeiro_historico';
    const historicoStr = localStorage.getItem(chave);
    if (historicoStr) {
      const historico: HistoricoItem[] = JSON.parse(historicoStr);
      const atualizado = historico.filter(item => item.id !== id);
      localStorage.setItem(chave, JSON.stringify(atualizado));
      console.log('✅ Deletado do localStorage');
    }
  } catch (erro) {
    console.warn('⚠️ Erro ao deletar de localStorage:', erro);
  }
}

// LIMPAR HISTÓRICO
export async function limparHistorico(): Promise<void> {
  console.log('🔵 Limpando histórico completo...');
  
  // Limpar window.storage
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      const resultado = await (window as any).storage.list('simulacao:', false);
      if (resultado && resultado.keys) {
        for (const chave of resultado.keys) {
          await (window as any).storage.delete(chave, false);
        }
      }
      console.log('✅ window.storage limpo');
    }
  } catch (erro) {
    console.warn('⚠️ Erro ao limpar window.storage:', erro);
  }
  
  // Limpar localStorage
  try {
    localStorage.removeItem('ponto_cordeiro_historico');
    console.log('✅ localStorage limpo');
  } catch (erro) {
    console.warn('⚠️ Erro ao limpar localStorage:', erro);
  }
}

// PREMIUM
export function verificarPremium(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ponto_cordeiro_premium') === 'ativo';
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
