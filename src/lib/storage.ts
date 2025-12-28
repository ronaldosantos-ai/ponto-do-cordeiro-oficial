import { SimulationData, ResultData } from './calculations';

export interface HistoricoItem {
  id: string;
  tipo: 'mvp' | 'premium';
  dados: SimulationData;
  resultado: ResultData;
  identificacao?: string;
  timestamp: string;
}

const STORAGE_KEY = 'ponto_cordeiro_historico';

export function salvarSimulacao(item: Omit<HistoricoItem, 'id' | 'timestamp'>): HistoricoItem {
  const historico = obterHistorico();
  const novoItem: HistoricoItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  
  historico.unshift(novoItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
  return novoItem;
}

export function obterHistorico(): HistoricoItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao ler histórico:', error);
    return [];
  }
}

export function limparHistorico(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deletarItem(id: string): void {
  const historico = obterHistorico();
  const atualizado = historico.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
}

export function filtrarHistorico(dias: number | 'todos'): HistoricoItem[] {
  const historico = obterHistorico();
  if (dias === 'todos') return historico;
  
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - dias);
  
  return historico.filter(item => 
    new Date(item.timestamp) >= dataLimite
  );
}

// Funções de verificação Premium
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
