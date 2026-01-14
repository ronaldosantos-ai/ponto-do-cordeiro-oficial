export interface SimulationData {
  peso: number;
  dias: number;
  custo: number;
  precoVenda: number;
  ganhoPesoEsperado?: number; // opcional, Premium
  diasAdicionais?: number; // opcional, Premium
  regiao?: string; // nome da região selecionada
  precoUsado?: number; // preço usado na simulação
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
  pesoFuturo?: number;
  custoAdicional?: number;
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

export function calcularProjecao(data: SimulationData): ResultData {
  // Cálculo atual (igual ao MVP)
  const custoTotal = data.dias * data.custo;
  const custoKg = custoTotal / data.peso;
  const receitaAtual = data.peso * data.precoVenda;
  const lucroAtual = receitaAtual - custoTotal;

  // Cálculo futuro (Premium)
  let receitaFutura: number | undefined;
  let lucroFuturo: number | undefined;
  let pesoFuturo: number | undefined;
  let custoAdicional: number | undefined;

  if (data.ganhoPesoEsperado && data.diasAdicionais) {
    const diasAdicionais = data.diasAdicionais;
    const ganhoDiario = data.ganhoPesoEsperado / 30; // converter mês para dia
    const ganhoTotal = ganhoDiario * diasAdicionais;

    pesoFuturo = data.peso + ganhoTotal;
    custoAdicional = diasAdicionais * data.custo;
    const custoTotalFuturo = custoTotal + custoAdicional;

    receitaFutura = pesoFuturo * data.precoVenda;
    lucroFuturo = receitaFutura - custoTotalFuturo;
  }

  // Decisão Premium: compara lucro atual vs futuro
  const decisao = (lucroFuturo !== undefined && lucroFuturo > lucroAtual) ? 'segurar' : 'vender';

  return {
    decisao,
    custoTotal,
    custoKg,
    receitaAtual,
    lucroAtual,
    timestamp: new Date().toISOString(),
    // Dados Premium:
    receitaFutura,
    lucroFuturo,
    diasAdicionais: data.diasAdicionais,
    pesoFuturo,
    custoAdicional
  };
}
