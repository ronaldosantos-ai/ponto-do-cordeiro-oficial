import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, MessageCircle, Crown, Loader2, LogIn } from "lucide-react";
import { calcularDecisao, ResultData } from "@/lib/calculations";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { useToast } from "@/hooks/use-toast";
import { gerarTextoCompartilhamento, compartilharWhatsApp } from "@/lib/share";

const LIMITE_CONSULTAS_DIARIAS = 5;
const STORAGE_KEY = "mvp_consultas";

interface ConsultasDiarias {
  data: string;
  count: number;
}

const getConsultasDiarias = (): ConsultasDiarias => {
  const hoje = new Date().toISOString().split("T")[0];
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    const parsed: ConsultasDiarias = JSON.parse(stored);
    if (parsed.data === hoje) {
      return parsed;
    }
  }
  
  return { data: hoje, count: 0 };
};

const incrementarConsultas = (): number => {
  const consultas = getConsultasDiarias();
  consultas.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
  return consultas.count;
};

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const { toast } = useToast();

  // Redirecionar usuários Premium para /premium
  useEffect(() => {
    if (!premiumLoading && !authLoading && isPremium && user) {
      navigate("/premium", { replace: true });
    }
  }, [isPremium, premiumLoading, authLoading, user, navigate]);

  const [peso, setPeso] = useState("");
  const [dias, setDias] = useState("");
  const [custo, setCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [resultado, setResultado] = useState<ResultData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [consultasRestantes, setConsultasRestantes] = useState(() => {
    const consultas = getConsultasDiarias();
    return LIMITE_CONSULTAS_DIARIAS - consultas.count;
  });

  const isFormValid = peso !== "" && dias !== "" && custo !== "" && precoVenda !== "";

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
    return null;
  };

  const handleCalcular = async () => {
    // Verificar limite de consultas
    const consultas = getConsultasDiarias();
    if (consultas.count >= LIMITE_CONSULTAS_DIARIAS) {
      toast({
        title: "🔒 Limite diário atingido",
        description: "Você atingiu o limite de 5 consultas gratuitas por dia. Acesse o Premium para consultas ilimitadas!",
        variant: "destructive",
      });
      navigate("/premium-info");
      return;
    }

    const erro = validarCampos();
    if (erro) {
      toast({
        title: "⚠️ Dados inválidos",
        description: erro,
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = calcularDecisao({
      peso: parseFloat(peso),
      dias: parseInt(dias),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
    });
    
    // Incrementar contador e atualizar restantes
    const novoCount = incrementarConsultas();
    setConsultasRestantes(LIMITE_CONSULTAS_DIARIAS - novoCount);
    
    setResultado(result);
    setIsCalculating(false);
  };

  const handleCompartilharWhatsApp = () => {
    if (!resultado) return;

    const mensagem = gerarTextoCompartilhamento("simulacao", {
      dados: {
        peso: parseFloat(peso),
        dias: parseInt(dias),
        custo: parseFloat(custo),
        precoVenda: parseFloat(precoVenda),
      },
      resultado,
      identificacao: undefined,
    });

    compartilharWhatsApp(mensagem);
    toast({ title: "✅ Abrindo WhatsApp..." });
  };

  const handleNovaSimulacao = () => {
    setPeso("");
    setDias("");
    setCusto("");
    setPrecoVenda("");
    setResultado(null);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setResultado(null);
  };

  // Mostrar loading enquanto verifica premium
  if (premiumLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Carregando">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se for premium, não renderizar (será redirecionado)
  if (isPremium && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-md md:max-w-sm lg:max-w-md mx-auto space-y-6">
          {/* Header com Login */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 h-12"
              aria-label="Entrar na conta"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Button>
          </div>

          {/* Título */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Ponto do Cordeiro</h1>
            <p className="text-muted-foreground text-base">Decisão inteligente em 60 segundos</p>
          </div>

          {/* Formulário */}
          <div className="space-y-4">
            {/* Peso do cordeiro */}
            <div className="space-y-2">
              <Label htmlFor="peso" className="text-foreground text-base">
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
                aria-describedby="peso-desc"
              />
            </div>

            {/* Dias em cativeiro */}
            <div className="space-y-2">
              <Label htmlFor="dias" className="text-foreground text-base">
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
              <Label htmlFor="custo" className="text-foreground text-base">
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
              <Label htmlFor="precoVenda" className="text-foreground text-base">
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
              aria-label="Calcular decisão de venda"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="animate-spin mr-2" aria-hidden="true" />
                  <span role="status">Calculando...</span>
                </>
              ) : (
                "Calcular agora"
              )}
            </Button>

            {/* Contador de consultas e CTA simples antes do resultado */}
            {!resultado && (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {consultasRestantes > 0 
                    ? `${consultasRestantes} consulta${consultasRestantes !== 1 ? 's' : ''} gratuita${consultasRestantes !== 1 ? 's' : ''} restante${consultasRestantes !== 1 ? 's' : ''} hoje`
                    : "Limite de consultas atingido"
                  }
                </p>
                <button
                  onClick={() => navigate("/premium-info")}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium underline underline-offset-2"
                >
                  Quer consultas ilimitadas? Conheça o Premium
                </button>
              </div>
            )}
          </div>

          {/* Card de Resultado */}
          {resultado && (
            <div
              className={`mt-8 p-6 rounded-lg border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                resultado.decisao === "vender" ? "border-positive bg-green-50" : "border-destructive bg-red-50"
              }`}
              role="region"
              aria-label="Resultado da simulação"
            >
              <div className="flex flex-col items-center text-center">
                {resultado.decisao === "vender" ? (
                  <TrendingUp className="w-12 h-12 text-positive" aria-hidden="true" />
                ) : (
                  <TrendingDown className="w-12 h-12 text-destructive" aria-hidden="true" />
                )}

                <p
                  className={`text-3xl font-bold mt-4 ${
                    resultado.decisao === "vender" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {resultado.decisao === "vender" ? "💰 Vale a pena vender" : "⏳ Melhor segurar e engordar mais"}
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
                  className="mt-6 w-full h-14 border-2 border-positive text-positive hover:bg-green-50"
                  onClick={handleCompartilharWhatsApp}
                  aria-label="Enviar resultado para WhatsApp"
                >
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                  Enviar resultado para WhatsApp
                </Button>

                <Button variant="outline" className="mt-3 w-full h-12 border-2" onClick={handleNovaSimulacao}>
                  Nova simulação
                </Button>
              </div>
            </div>
          )}

          {/* CTA Premium Completo - Aparece após resultado */}
          {resultado && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <p className="text-base font-semibold text-gray-900 text-center">
                Quer saber se vale mais segurar e engordar?
              </p>
              <ul className="text-sm text-gray-700 mt-3 space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <Crown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Simular ganho de peso futuro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Comparar lucro hoje vs daqui X dias</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Histórico completo + alertas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Consultas ilimitadas</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/premium-info")}
                className="mt-4 w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Ver Premium
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Upgrade Premium */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-600 to-orange-700 text-white py-3 px-4 shadow-lg z-50">
        <button
          onClick={() => navigate("/premium-info")}
          className="w-full flex items-center justify-center gap-2 text-base font-semibold"
        >
          <Crown className="w-5 h-5" />
          Upgrade Premium
        </button>
      </footer>
    </div>
  );
};

export default Index;
