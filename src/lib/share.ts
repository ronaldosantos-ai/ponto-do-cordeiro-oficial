import { SimulationData, ResultData } from './calculations';

interface ShareData {
  dados: SimulationData;
  resultado: ResultData;
  identificacao?: string;
}

export function gerarTextoCompartilhamento(tipo: 'simulacao' | 'premium', data: ShareData): string {
  const { dados, resultado, identificacao } = data;
  
  if (tipo === 'premium' && dados.ganhoPesoEsperado && dados.diasAdicionais) {
    const emoji = resultado.decisao === 'vender' ? '💰' : '✅';
    const decisaoTexto = resultado.decisao === 'vender' 
      ? 'Melhor vender hoje!' 
      : 'Vale a pena segurar!';
    
    const diferenca = resultado.lucroFuturo !== undefined 
      ? Math.abs(resultado.lucroFuturo - resultado.lucroAtual).toFixed(2)
      : '0.00';
    
    const ganhoTotal = resultado.pesoFuturo !== undefined 
      ? (resultado.pesoFuturo - dados.peso).toFixed(2)
      : '0.00';
    
    return `${emoji} *Ponto do Cordeiro Premium*
${identificacao ? `\n🏷️ Animal: ${identificacao}` : ''}

*Decisão: ${decisaoTexto}*

📊 Simulação:
• Peso atual: ${dados.peso} kg
• Dias em cativeiro: ${dados.dias}
• Custo diário: R$ ${dados.custo.toFixed(2)}
• Preço venda: R$ ${dados.precoVenda.toFixed(2)}/kg

💵 Vender Hoje:
• Receita: R$ ${resultado.receitaAtual.toFixed(2)}
• Custo total: R$ ${resultado.custoTotal.toFixed(2)}
• Lucro: R$ ${resultado.lucroAtual.toFixed(2)}

🔮 Projeção ${dados.diasAdicionais} dias:
• Peso futuro: ${resultado.pesoFuturo?.toFixed(2)} kg (+${ganhoTotal} kg)
• Lucro futuro: R$ ${resultado.lucroFuturo?.toFixed(2)}
• Diferença: R$ ${diferenca}

🕐 ${new Date(resultado.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

---
Gerado por Ponto do Cordeiro Premium`;
  }
  
  // Simulação básica
  const emoji = resultado.decisao === 'vender' ? '💰' : '⏳';
  const decisaoTexto = resultado.decisao === 'vender' 
    ? 'Vale a pena vender hoje' 
    : 'Melhor segurar e engordar mais';
  
  return `${emoji} *Ponto do Cordeiro*
${identificacao ? `\n🏷️ Animal: ${identificacao}` : ''}

*Decisão: ${decisaoTexto}*

📊 Simulação:
• Peso: ${dados.peso} kg
• Dias em cativeiro: ${dados.dias}
• Custo diário: R$ ${dados.custo.toFixed(2)}
• Preço venda: R$ ${dados.precoVenda.toFixed(2)}/kg

💵 Resultado:
• Receita: R$ ${resultado.receitaAtual.toFixed(2)}
• Custo total: R$ ${resultado.custoTotal.toFixed(2)}
• Lucro: R$ ${resultado.lucroAtual.toFixed(2)}

🕐 ${new Date(resultado.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

---
Gerado por Ponto do Cordeiro`;
}

export function compartilharWhatsApp(mensagem: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
