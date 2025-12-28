import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, MessageCircle, Crown, Loader2, LogIn } from "lucide-react";
import { calcularDecisao, ResultData, SimulationData } from "@/lib/calculations";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [peso, setPeso] = useState("");
  const [dias, setDias] = useState("");
  const [custo, setCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [resultado, setResultado] = useState<ResultData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const isFormValid = peso !== "" && dias !== "" && custo !== "" && precoVenda !== "";

  const handleCalcular = async () => {
    if (!isFormValid) return;

    setIsCalculating(true);
    
    // Small delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    const result = calcularDecisao({
      peso: parseFloat(peso),
      dias: parseInt(dias),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
    });
    setResultado(result);
    setIsCalculating(false);
  };

  const compartilharWhatsApp = () => {
    if (!resultado) return;
    
    const dados: SimulationData = {
      peso: parseFloat(peso),
      dias: parseInt(dias),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
    };
    
    const emoji = resultado.decisao === 'vender' ? '💰' : '⏳';
    const decisaoTexto = resultado.decisao === 'vender' 
      ? 'Vale a pena vender hoje' 
      : 'Melhor segurar e engordar mais';
    
    const mensagem = `${emoji} *Ponto do Cordeiro*

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

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const handleNovaSimulacao = () => {
    setPeso("");
    setDias("");
    setCusto("");
    setPrecoVenda("");
    setResultado(null);
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setResultado(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md md:max-w-sm lg:max-w-md mx-auto space-y-6">
        {/* Header com Login */}
        <div className="flex justify-end">
          {!user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Button>
          )}
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Ponto do Cordeiro</h1>
          <p className="text-muted-foreground text-base">
            Decidir vender ou segurar em 60 segundos
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          {/* Peso do cordeiro */}
          <div className="space-y-2">
            <Label htmlFor="peso" className="text-foreground">
              Peso do cordeiro (kg)
            </Label>
            <Input
              id="peso"
              type="number"
              step="0.1"
              min="0"
              placeholder="Ex: 35.5"
              autoFocus
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={peso}
              onChange={(e) => handleInputChange(setPeso, e.target.value)}
            />
          </div>

          {/* Dias em cativeiro */}
          <div className="space-y-2">
            <Label htmlFor="dias" className="text-foreground">
              Dias em cativeiro
            </Label>
            <Input
              id="dias"
              type="number"
              min="0"
              placeholder="Ex: 45"
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={dias}
              onChange={(e) => handleInputChange(setDias, e.target.value)}
            />
          </div>

          {/* Custo diário */}
          <div className="space-y-2">
            <Label htmlFor="custo" className="text-foreground">
              Custo diário (R$/dia)
            </Label>
            <Input
              id="custo"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 3.50"
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={custo}
              onChange={(e) => handleInputChange(setCusto, e.target.value)}
            />
          </div>

          {/* Preço de venda */}
          <div className="space-y-2">
            <Label htmlFor="precoVenda" className="text-foreground">
              Preço de venda (R$/kg)
            </Label>
            <Input
              id="precoVenda"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 18.50"
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={precoVenda}
              onChange={(e) => handleInputChange(setPrecoVenda, e.target.value)}
            />
          </div>

          {/* Botão Calcular */}
          <Button
            variant="default"
            className="w-full h-14 text-lg bg-positive hover:bg-positive-hover"
            disabled={!isFormValid || isCalculating}
            onClick={handleCalcular}
          >
            {isCalculating ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Calculando...
              </>
            ) : (
              "Calcular agora"
            )}
          </Button>
        </div>

        {/* Card de Resultado */}
        {resultado && (
          <div
            className={`mt-8 p-6 rounded-lg border-2 ${
              resultado.decisao === "vender"
                ? "border-positive bg-green-50"
                : "border-destructive bg-red-50"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {resultado.decisao === "vender" ? (
                <TrendingUp className="w-12 h-12 text-positive" />
              ) : (
                <TrendingDown className="w-12 h-12 text-destructive" />
              )}

              <p
                className={`text-2xl font-bold mt-4 ${
                  resultado.decisao === "vender"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {resultado.decisao === "vender"
                  ? "💰 Vale a pena vender"
                  : "⏳ Melhor segurar e engordar mais"}
              </p>

              {/* Lucro em destaque */}
              <p
                className={`text-2xl font-bold mt-4 ${
                  resultado.lucroAtual >= 0 ? "text-positive" : "text-destructive"
                }`}
              >
                Lucro hoje: R$ {resultado.lucroAtual.toFixed(2)}
              </p>

              {/* Informações secundárias */}
              <div className="text-base text-muted-foreground mt-4 space-y-2 w-full text-left">
                <p>Receita: R$ {resultado.receitaAtual.toFixed(2)}</p>
                <p>Custo total: R$ {resultado.custoTotal.toFixed(2)}</p>
                <p>Custo/kg: R$ {resultado.custoKg.toFixed(2)}</p>
                <p>Peso atual: {peso} kg</p>
                
                <hr className="my-3 border-border" />
                
                <p className="text-sm">
                  Simulado em:{" "}
                  {new Date(resultado.timestamp).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                </p>
              </div>

              {/* Botão WhatsApp */}
              <Button
                variant="outline"
                className="mt-6 w-full h-12 border-2 border-positive text-positive hover:bg-green-50"
                onClick={compartilharWhatsApp}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar resultado para WhatsApp
              </Button>

              <Button
                variant="outline"
                className="mt-3 w-full h-12 border-2"
                onClick={handleNovaSimulacao}
              >
                Nova simulação
              </Button>
            </div>

            {/* Oferta Premium */}
            <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Crown className="text-amber-600 w-6 h-6 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    Recursos Premium
                  </h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Simular ganho de peso futuro</li>
                    <li>• Comparar lucro hoje vs daqui X dias</li>
                    <li>• Salvar simulações com identificação</li>
                    <li>• Histórico completo com filtros</li>
                    <li>• Alertas e lembretes</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Ajuda você a decidir o melhor momento de venda
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/premium-info')}
                className="w-full mt-4 h-10 bg-amber-600 hover:bg-amber-700 text-white"
              >
                Experimentar Premium
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
