export interface SimulationData {
  peso: number;
  dias: number;
  custo: number;
  precoVenda: number;
  ganhoPesoEsperado?: number; // opcional, Premium
}

export interface ResultData {
  decisao: 'vender' | 'segurar';
  custoTotal: number;
  custoKg: number;
  receitaAtual: number;
  lucroAtual: number;
  timestamp: string;
  // Para Premium:
  receitaFutura?: number;
  lucroFuturo?: number;
  diasAdicionais?: number;
}

export function calcularDecisao(data: SimulationData): ResultData {
  const custoTotal = data.dias * data.custo;
  const custoKg = custoTotal / data.peso;
  const receitaAtual = data.peso * data.precoVenda;
  const lucroAtual = receitaAtual - custoTotal;

  // Lógica: se lucro atual > 10% do custo total → VENDER
  // Se lucro <= 10% do custo total → SEGURAR
  const decisao = lucroAtual > (custoTotal * 0.1) ? 'vender' : 'segurar';

  return {
    decisao,
    custoTotal,
    custoKg,
    receitaAtual,
    lucroAtual,
    timestamp: new Date().toISOString()
  };
}
