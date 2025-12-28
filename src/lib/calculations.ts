export interface SimulationData {
  peso: number;
  dias: number;
  custo: number;
}

export interface ResultData {
  decisao: 'vender' | 'segurar';
  custoTotal: number;
  custoKg: number;
  timestamp: string;
}

export function calcularDecisao(data: SimulationData): ResultData {
  const custoTotal = data.dias * data.custo;
  const custoKg = custoTotal / data.peso;

  // Lógica: se custo por kg > R$ 15, sugerir vender
  // Se custo por kg <= R$ 15, sugerir segurar
  const decisao = custoKg > 15 ? 'vender' : 'segurar';

  return {
    decisao,
    custoTotal,
    custoKg,
    timestamp: new Date().toISOString()
  };
}
