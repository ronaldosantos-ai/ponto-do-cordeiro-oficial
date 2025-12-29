import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MessageCircle, Save, Bell, LogOut, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calcularProjecao, SimulationData, ResultData } from "@/lib/calculations";
import { salvarSimulacao, verificarPremium } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { gerarPDFSimulacao } from "@/lib/pdf";
import { useAuth } from "@/hooks/useAuth";

const Premium = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();

  // Estados básicos
  const [peso, setPeso] = useState('');
  const [dias, setDias] = useState('');
  const [custo, setCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  
  // Estados Premium
  const [ganhoPesoEsperado, setGanhoPesoEsperado] = useState('');
  const [diasAdicionais, setDiasAdicionais] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  
  const [resultado, setResultado] = useState<ResultData | null>(null);
  const [dadosSimulacao, setDadosSimulacao] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erroDetalhes, setErroDetalhes] = useState('');

  // Verificar acesso Premium e autenticação
  useEffect(() => {
    if (!verificarPremium()) {
      navigate('/premium-info');
      return;
    }
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [navigate, user, authLoading]);

  // Se não for premium ou não autenticado, não renderiza nada
  if (!verificarPremium() || authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Carregando">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.value);
    setResultado(null);
  };

  // Validação de campos
  const validarCampos = (): string | null => {
    if (!peso || parseFloat(peso) <= 0) {
      return "Peso deve ser maior que zero";
    }
    if (!dias || parseInt(dias) <= 0) {
      return "Dias deve ser maior que zero";
    }
    if (!custo || parseFloat(custo) < 0) {
      return "Custo não pode ser negativo";
    }
    if (!precoVenda || parseFloat(precoVenda) <= 0) {
      return "Preço de venda deve ser maior que zero";
    }
    if (!ganhoPesoEsperado || parseFloat(ganhoPesoEsperado) <= 0) {
      return "Ganho de peso deve ser maior que zero";
    }
    if (!diasAdicionais || parseInt(diasAdicionais) <= 0) {
      return "Dias adicionais deve ser maior que zero";
    }
    return null;
  };

  const handleCalcular = async () => {
    const erro = validarCampos();
    if (erro) {
      toast({
        title: "⚠️ Dados inválidos",
        description: erro,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data: SimulationData = {
      peso: parseFloat(peso),
      dias: parseInt(dias),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
      ganhoPesoEsperado: parseFloat(ganhoPesoEsperado),
      diasAdicionais: parseInt(diasAdicionais)
    };
    
    const result = calcularProjecao(data);
    setResultado(result);
    setDadosSimulacao(data);
    setSalvo(false);
    setIsLoading(false);
  };

  const handleNovaSimulacao = () => {
    setPeso('');
    setDias('');
    setCusto('');
    setPrecoVenda('');
    setGanhoPesoEsperado('');
    setDiasAdicionais('');
    setIdentificacao('');
    setResultado(null);
    setDadosSimulacao(null);
    setSalvo(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSalvar = async () => {
    if (!resultado || !dadosSimulacao) {
      toast({
        title: "⚠️ Atenção",
        description: "Faça uma simulação primeiro",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSalvando(true);
      setErroDetalhes('');
      
      const itemParaSalvar = {
        tipo: 'premium' as const,
        dados: dadosSimulacao,
        resultado: resultado,
        identificacao: identificacao || undefined
      };
      
      await salvarSimulacao(itemParaSalvar);
      
      setSalvo(true);
      toast({
        title: "✅ Simulação salva",
        description: "Acesse o histórico para visualizar"
      });
      
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido';
      setErroDetalhes(mensagemErro);
      
      toast({
        title: "❌ Erro ao salvar",
        description: mensagemErro,
        variant: "destructive"
      });
    } finally {
      setSalvando(false);
    }
  };

  const compartilharWhatsApp = () => {
    if (!resultado) return;
    
    const dados: SimulationData = {
      peso: parseFloat(peso),
      dias: parseInt(dias),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
      ganhoPesoEsperado: parseFloat(ganhoPesoEsperado),
      diasAdicionais: parseInt(diasAdicionais)
    };
    
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
    
    const mensagem = `${emoji} *Ponto do Cordeiro Premium*

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

🕐 ${new Date(resultado.timestamp).toLocaleString('pt-BR')}

---
Gerado por Ponto do Cordeiro Premium`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const isFormValid = peso && dias && custo && precoVenda && ganhoPesoEsperado && diasAdicionais;

  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="p-2 hover:bg-secondary h-12"
          aria-label="Voltar para página inicial"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold text-sm">
            ⭐ Premium
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="h-10 w-10 text-muted-foreground hover:text-destructive"
            aria-label="Sair da conta"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Ponto do Cordeiro Premium</h1>
        <p className="text-muted-foreground text-sm mt-1">Simule ganho futuro e tome a melhor decisão</p>
      </div>

      {/* Formulário */}
      <div className="card-container space-y-4">
        {/* Campos básicos */}
        <div>
          <label htmlFor="peso" className="text-label">Peso atual (kg)</label>
          <input
            id="peso"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="Ex: 35.5"
            value={peso}
            onChange={handleInputChange(setPeso)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="dias" className="text-label">Dias em cativeiro</label>
          <input
            id="dias"
            type="number"
            inputMode="decimal"
            min="1"
            placeholder="Ex: 60"
            value={dias}
            onChange={handleInputChange(setDias)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="custo" className="text-label">Custo diário (R$/dia)</label>
          <input
            id="custo"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="Ex: 2.50"
            value={custo}
            onChange={handleInputChange(setCusto)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="precoVenda" className="text-label">Preço de venda (R$/kg)</label>
          <input
            id="precoVenda"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="Ex: 18.50"
            value={precoVenda}
            onChange={handleInputChange(setPrecoVenda)}
            className="input-field"
          />
        </div>

        {/* Campo identificação */}
        <div>
          <label htmlFor="identificacao" className="text-label">Identificação do animal (opcional)</label>
          <input
            id="identificacao"
            type="text"
            placeholder="Ex: Cordeiro 23, Lote A"
            value={identificacao}
            onChange={(e) => {
              setIdentificacao(e.target.value);
              setResultado(null);
            }}
            className="input-field"
          />
        </div>

        {/* Separador - Projeção futura */}
        <div className="flex items-center gap-3 pt-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground font-medium">Projeção futura</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Campos Premium */}
        <div>
          <label htmlFor="ganhoPeso" className="text-label">Ganho de peso esperado (kg/mês)</label>
          <input
            id="ganhoPeso"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="Ex: 4.5"
            value={ganhoPesoEsperado}
            onChange={handleInputChange(setGanhoPesoEsperado)}
            className="input-field"
          />
          <span className="text-xs text-muted-foreground mt-1 block">Quanto o cordeiro ganha por mês</span>
        </div>

        <div>
          <label htmlFor="diasAdicionais" className="text-label">Segurar quantos dias a mais?</label>
          <input
            id="diasAdicionais"
            type="number"
            inputMode="decimal"
            min="1"
            max="120"
            placeholder="Ex: 30"
            value={diasAdicionais}
            onChange={handleInputChange(setDiasAdicionais)}
            className="input-field"
          />
          <span className="text-xs text-muted-foreground mt-1 block">Período para projetar ganho</span>
        </div>

        {/* Botão calcular */}
        <Button
          onClick={handleCalcular}
          disabled={!isFormValid || isLoading}
          className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg mt-4"
          aria-label="Calcular projeção de venda"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              <span role="status">Calculando...</span>
            </>
          ) : (
            'Calcular projeção'
          )}
        </Button>
      </div>

      {/* Resultado Premium */}
      {resultado && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" role="region" aria-label="Resultado da projeção">
          {/* Cards de comparação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vender Hoje */}
            <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50 shadow-lg">
              <h3 className="text-lg font-bold text-foreground mb-4">📊 Vender hoje</h3>
              <div className="space-y-2 text-foreground">
                <p>Peso: <span className="font-medium">{peso} kg</span></p>
                <p>Receita: <span className="font-medium">R$ {resultado.receitaAtual.toFixed(2)}</span></p>
                <p>Custo: <span className="font-medium">R$ {resultado.custoTotal.toFixed(2)}</span></p>
                <p className={`text-xl font-bold mt-3 ${resultado.lucroAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Lucro: R$ {resultado.lucroAtual.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Projeção Futura */}
            <div className="p-5 rounded-xl border-2 border-purple-200 bg-purple-50 shadow-lg">
              <h3 className="text-lg font-bold text-foreground mb-4">🔮 Daqui a {resultado.diasAdicionais} dias</h3>
              <div className="space-y-2 text-foreground">
                <p>
                  Peso: <span className="font-medium">{resultado.pesoFuturo?.toFixed(2)} kg</span>
                  <span className="text-green-600 text-sm ml-1">
                    (+{((resultado.pesoFuturo || 0) - parseFloat(peso)).toFixed(2)} kg)
                  </span>
                </p>
                <p>Receita: <span className="font-medium">R$ {resultado.receitaFutura?.toFixed(2)}</span></p>
                <p>Custo: <span className="font-medium">R$ {(resultado.custoTotal + (resultado.custoAdicional || 0)).toFixed(2)}</span></p>
                <p className={`text-xl font-bold mt-3 ${(resultado.lucroFuturo || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Lucro: R$ {resultado.lucroFuturo?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Decisão Final */}
          {resultado.lucroFuturo !== undefined && (
            <div className={`p-5 rounded-xl text-white shadow-lg ${
              resultado.lucroFuturo > resultado.lucroAtual 
                ? 'bg-green-600' 
                : 'bg-amber-600'
            }`}>
              <p className="text-2xl font-bold">
                {resultado.lucroFuturo > resultado.lucroAtual 
                  ? '✅ Vale a pena segurar!' 
                  : '💰 Melhor vender hoje!'}
              </p>
              <p className="mt-2 opacity-90 text-base">
                {resultado.lucroFuturo > resultado.lucroAtual 
                  ? `Ganho adicional de R$ ${(resultado.lucroFuturo - resultado.lucroAtual).toFixed(2)}`
                  : `Você economiza R$ ${Math.abs(resultado.lucroFuturo - resultado.lucroAtual).toFixed(2)} em custos`}
              </p>
            </div>
          )}

          {/* Card para criar alerta */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Bell className="text-blue-600 w-5 h-5 mt-1 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Criar alerta para este animal?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Receba um lembrete para reavaliar a venda
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full mt-3 h-12"
              onClick={() => navigate('/alertas')}
            >
              Configurar alerta
            </Button>
          </div>

          {/* Botões finais */}
          <Button
            onClick={handleSalvar}
            disabled={salvando || salvo}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white"
            aria-label={salvo ? "Simulação salva" : "Salvar simulação"}
          >
            {salvando ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                <span role="status">Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                {salvo ? 'Salvo no histórico ✓' : 'Salvar no histórico'}
              </>
            )}
          </Button>

          {erroDetalhes && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">
              Erro: {erroDetalhes}
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              if (dadosSimulacao && resultado) {
                gerarPDFSimulacao(dadosSimulacao, resultado, identificacao || undefined);
                toast({ title: "✅ Relatório gerado", description: "Arquivo baixado com sucesso" });
              }
            }}
            className="w-full h-14"
          >
            <FileDown className="w-5 h-5 mr-2" aria-hidden="true" />
            Baixar relatório
          </Button>

          <Button
            variant="outline"
            onClick={compartilharWhatsApp}
            className="w-full h-14 border-2 border-green-600 text-green-600 hover:bg-green-50"
            aria-label="Enviar resultado para WhatsApp"
          >
            <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
            Enviar resultado para WhatsApp
          </Button>

          <Button
            variant="outline"
            onClick={handleNovaSimulacao}
            className="w-full h-12 border-2 border-border"
          >
            Nova simulação
          </Button>
        </div>
      )}
    </div>
  );
};

export default Premium;
