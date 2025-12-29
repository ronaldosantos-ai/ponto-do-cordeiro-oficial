// Funções de exportação de relatórios em TXT (compatível com PDF visual futuro)

interface SimulacaoDados {
  peso: number;
  dias: number;
  custo: number;
  precoVenda: number;
  ganhoPesoEsperado?: number;
  diasAdicionais?: number;
}

interface SimulacaoResultado {
  decisao: 'vender' | 'segurar';
  receitaAtual: number;
  custoTotal: number;
  lucroAtual: number;
  custoKg?: number;
  receitaFutura?: number;
  custoAdicional?: number;
  lucroFuturo?: number;
  pesoFuturo?: number;
}

interface HistoricoItem {
  id: string;
  tipo: 'mvp' | 'premium';
  dados: SimulacaoDados;
  resultado: SimulacaoResultado;
  timestamp: string;
  identificacao?: string;
}

// Função auxiliar para formatar data
function formatarData(data: string | Date): string {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
}

// Gerar relatório de uma simulação individual
export function gerarPDFSimulacao(
  dados: SimulacaoDados, 
  resultado: SimulacaoResultado, 
  identificacao?: string
): void {
  const custoKg = dados.peso > 0 ? resultado.custoTotal / dados.peso : 0;
  
  const conteudo = `
═══════════════════════════════════════
        PONTO DO CORDEIRO
   Relatório de Simulação
═══════════════════════════════════════

IDENTIFICAÇÃO: ${identificacao || 'Não informado'}
DATA: ${formatarData(new Date())}

─────────────────────────────────────
DADOS DA SIMULAÇÃO:

- Peso do cordeiro: ${dados.peso} kg
- Dias em cativeiro: ${dados.dias} dias
- Custo diário: R$ ${dados.custo.toFixed(2)}
- Preço de venda: R$ ${dados.precoVenda.toFixed(2)}/kg
${dados.ganhoPesoEsperado ? `
PROJEÇÃO PREMIUM:
- Ganho esperado: ${dados.ganhoPesoEsperado} kg/mês
- Período: ${dados.diasAdicionais} dias
` : ''}
─────────────────────────────────────
RESULTADO - ${resultado.decisao === 'vender' ? '✓ VENDER' : '✗ SEGURAR'}

HOJE:
- Receita: R$ ${resultado.receitaAtual.toFixed(2)}
- Custo total: R$ ${resultado.custoTotal.toFixed(2)}
- Lucro: R$ ${resultado.lucroAtual.toFixed(2)}
- Custo/kg: R$ ${custoKg.toFixed(2)}
${resultado.receitaFutura ? `
PROJEÇÃO FUTURA (${dados.diasAdicionais} dias):
- Peso futuro: ${resultado.pesoFuturo?.toFixed(1)} kg
- Receita: R$ ${resultado.receitaFutura.toFixed(2)}
- Custo adicional: R$ ${resultado.custoAdicional?.toFixed(2)}
- Lucro: R$ ${resultado.lucroFuturo?.toFixed(2)}

DIFERENÇA: R$ ${((resultado.lucroFuturo || 0) - resultado.lucroAtual).toFixed(2)}
` : ''}
─────────────────────────────────────
DECISÃO RECOMENDADA:

${resultado.decisao === 'vender' 
  ? '💰 Vale a pena vender hoje' 
  : '⏳ Melhor segurar e engordar mais'}

═══════════════════════════════════════
Gerado por Ponto do Cordeiro
${formatarData(new Date())}
═══════════════════════════════════════
`;

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `simulacao_${identificacao?.replace(/\s/g, '_') || Date.now()}_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Gerar relatório do histórico
export function gerarPDFHistorico(historico: HistoricoItem[]): void {
  if (historico.length === 0) return;
  
  const lucroTotal = historico.reduce((acc, item) => acc + (item.resultado.lucroAtual || 0), 0);
  const pesoMedio = historico.reduce((acc, item) => acc + (item.dados.peso || 0), 0) / historico.length;
  const vender = historico.filter(item => item.resultado.decisao === 'vender').length;
  const segurar = historico.filter(item => item.resultado.decisao === 'segurar').length;
  
  let conteudo = `
═══════════════════════════════════════
        PONTO DO CORDEIRO
   Relatório de Histórico
═══════════════════════════════════════

DATA: ${formatarData(new Date())}
PERÍODO: ${historico.length} simulações

─────────────────────────────────────
RESUMO GERAL:

- Total de simulações: ${historico.length}
- Lucro acumulado: R$ ${lucroTotal.toFixed(2)}
- Peso médio: ${pesoMedio.toFixed(1)} kg
- Decisões VENDER: ${vender} (${((vender/historico.length)*100).toFixed(0)}%)
- Decisões SEGURAR: ${segurar} (${((segurar/historico.length)*100).toFixed(0)}%)

─────────────────────────────────────
SIMULAÇÕES DETALHADAS:
`;

  historico.forEach((item, index) => {
    conteudo += `
${index + 1}. ${item.identificacao || 'Sem identificação'}
   Data: ${formatarData(item.timestamp)}
   Peso: ${item.dados.peso} kg | Dias: ${item.dados.dias}
   Decisão: ${item.resultado.decisao === 'vender' ? '✓ VENDER' : '✗ SEGURAR'}
   Lucro: R$ ${item.resultado.lucroAtual.toFixed(2)}
   ─────────────────────────────────────
`;
  });

  conteudo += `
═══════════════════════════════════════
Gerado por Ponto do Cordeiro
${formatarData(new Date())}
═══════════════════════════════════════
`;

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `historico_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Gerar relatório com análises e gráficos (texto descritivo)
export function gerarPDFAnalises(historico: HistoricoItem[], periodo: string): void {
  if (historico.length === 0) return;
  
  const lucroTotal = historico.reduce((acc, item) => acc + (item.resultado.lucroAtual || 0), 0);
  const pesoMedio = historico.reduce((acc, item) => acc + (item.dados.peso || 0), 0) / historico.length;
  const custoMedio = historico.reduce((acc, item) => acc + (item.resultado.custoTotal || 0), 0) / historico.length;
  const receitaMedia = historico.reduce((acc, item) => acc + (item.resultado.receitaAtual || 0), 0) / historico.length;
  const vender = historico.filter(item => item.resultado.decisao === 'vender').length;
  const segurar = historico.filter(item => item.resultado.decisao === 'segurar').length;
  const margemMedia = receitaMedia > 0 ? ((receitaMedia - custoMedio) / receitaMedia) * 100 : 0;
  
  const conteudo = `
═══════════════════════════════════════
        PONTO DO CORDEIRO
   Relatório de Análises
═══════════════════════════════════════

DATA: ${formatarData(new Date())}
PERÍODO: ${periodo}
SIMULAÇÕES ANALISADAS: ${historico.length}

─────────────────────────────────────
📊 INDICADORES GERAIS:

- Lucro Total Acumulado: R$ ${lucroTotal.toFixed(2)}
- Lucro Médio por Simulação: R$ ${(lucroTotal/historico.length).toFixed(2)}
- Peso Médio dos Animais: ${pesoMedio.toFixed(1)} kg
- Custo Médio Total: R$ ${custoMedio.toFixed(2)}
- Receita Média: R$ ${receitaMedia.toFixed(2)}
- Margem Média: ${margemMedia.toFixed(1)}%

─────────────────────────────────────
📈 DISTRIBUIÇÃO DE DECISÕES:

- VENDER: ${vender} simulações (${((vender/historico.length)*100).toFixed(1)}%)
- SEGURAR: ${segurar} simulações (${((segurar/historico.length)*100).toFixed(1)}%)

${vender > segurar 
  ? '→ Maioria das simulações indicou venda imediata'
  : '→ Maioria das simulações indicou segurar'}

─────────────────────────────────────
💡 INSIGHTS:

${lucroTotal > 0 
  ? '✓ O período analisado mostra resultados positivos'
  : '✗ Atenção: período com resultados negativos'}

${pesoMedio > 35 
  ? '✓ Peso médio dos animais está adequado'
  : '→ Considere aumentar o peso antes da venda'}

${(receitaMedia/custoMedio) > 1.3
  ? '✓ Boa margem de lucro observada'
  : '→ Margem de lucro pode ser melhorada'}

─────────────────────────────────────
🎯 RECOMENDAÇÕES:

${vender > segurar
  ? '• Momento favorável para vendas\n• Continue monitorando preços de mercado'
  : '• Considere segurar para melhor ganho de peso\n• Avalie custo x benefício do período adicional'}

- Mantenha registro das simulações
- Compare resultados reais com projeções
- Ajuste estratégia conforme mercado

═══════════════════════════════════════
Gerado por Ponto do Cordeiro
${formatarData(new Date())}
═══════════════════════════════════════
`;

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analises_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
