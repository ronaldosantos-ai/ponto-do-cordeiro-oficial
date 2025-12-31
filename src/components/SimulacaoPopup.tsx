import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, MessageCircle, Gift, Share2, Instagram, Facebook, Copy, Zap, RotateCcw } from "lucide-react";
import { calcularDecisao, SimulationData, ResultData } from "@/lib/calculations";
import { gerarTextoCompartilhamento, compartilharWhatsApp } from "@/lib/share";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SimulacaoPopupProps {
  children: React.ReactNode;
}

const SimulacaoPopup = ({ children }: SimulacaoPopupProps) => {
  const [open, setOpen] = useState(false);
  const [peso, setPeso] = useState("");
  const [dias, setDias] = useState("");
  const [custo, setCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [resultado, setResultado] = useState<ResultData | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validarCampos = (): boolean => {
    const pesoNum = parseFloat(peso);
    const diasNum = parseInt(dias, 10);
    const custoNum = parseFloat(custo);
    const precoNum = parseFloat(precoVenda);

    if (isNaN(pesoNum) || pesoNum <= 0) {
      toast({
        title: "Peso inválido",
        description: "O peso deve ser maior que zero.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(diasNum) || diasNum <= 0) {
      toast({
        title: "Dias inválidos",
        description: "Os dias devem ser maior que zero.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(custoNum) || custoNum <= 0) {
      toast({
        title: "Custo inválido",
        description: "O custo diário deve ser maior que zero.",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(precoNum) || precoNum <= 0) {
      toast({
        title: "Preço inválido",
        description: "O preço de venda deve ser maior que zero.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCalcular = () => {
    if (!validarCampos()) return;

    const dados: SimulationData = {
      peso: parseFloat(peso),
      dias: parseInt(dias, 10),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
    };

    const result = calcularDecisao(dados);
    setResultado(result);
    setShowShareOptions(false);
  };

  const handleWhatsApp = () => {
    if (!resultado) return;

    const dados: SimulationData = {
      peso: parseFloat(peso),
      dias: parseInt(dias, 10),
      custo: parseFloat(custo),
      precoVenda: parseFloat(precoVenda),
    };

    const textoBase = gerarTextoCompartilhamento("simulacao", { dados, resultado });
    const textoCompleto = `${textoBase}\n\n🚀 Quer simulações avançadas com projeção de ganho?\n👉 https://pontodocordeiro.com.br/premium-info`;
    
    compartilharWhatsApp(textoCompleto);
    setOpen(false);
  };

  const handlePremium = () => {
    setOpen(false);
    navigate("/premium-info");
  };

  const handleNovaSimulacao = () => {
    setPeso("");
    setDias("");
    setCusto("");
    setPrecoVenda("");
    setResultado(null);
    setShowShareOptions(false);
  };

  const handleShareInstagram = () => {
    const texto = `🐑 Ponto do Cordeiro\n\nDecisão: ${resultado?.decisao === 'vender' ? 'VENDER HOJE 💰' : 'SEGURAR ⏳'}\nLucro: R$ ${resultado?.lucroAtual.toFixed(2)}\n\n👉 Simule grátis: pontodocordeiro.com.br`;
    navigator.clipboard.writeText(texto);
    toast({ title: "Texto copiado!", description: "Cole no Instagram." });
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://pontodocordeiro.com.br")}&quote=${encodeURIComponent(`Descubra o melhor momento para vender seu cordeiro! Lucro calculado: R$ ${resultado?.lucroAtual.toFixed(2)}`)}`;
    window.open(url, "_blank");
  };

  const handleCopyLink = async () => {
    const texto = `🐑 Ponto do Cordeiro - Simulação\n\nDecisão: ${resultado?.decisao === 'vender' ? 'VENDER HOJE' : 'SEGURAR'}\nReceita: R$ ${resultado?.receitaAtual.toFixed(2)}\nCusto: R$ ${resultado?.custoTotal.toFixed(2)}\nLucro: R$ ${resultado?.lucroAtual.toFixed(2)}\n\n👉 Faça sua simulação: pontodocordeiro.com.br`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Ponto do Cordeiro - Simulação",
          text: texto,
          url: "https://pontodocordeiro.com.br",
        });
      } else {
        await navigator.clipboard.writeText(texto);
        toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." });
      }
    } catch {
      await navigator.clipboard.writeText(texto);
      toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            Simulação Gratuita
          </DialogTitle>
        </DialogHeader>

        {!resultado ? (
          <div className="space-y-4 py-4">
            {/* Peso */}
            <div className="space-y-2">
              <Label htmlFor="popup-peso" className="text-base font-medium">
                Peso do animal (kg)
              </Label>
              <Input
                id="popup-peso"
                type="number"
                inputMode="decimal"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ex: 35"
                className="h-14 text-lg"
              />
            </div>

            {/* Dias */}
            <div className="space-y-2">
              <Label htmlFor="popup-dias" className="text-base font-medium">
                Dias em cativeiro
              </Label>
              <Input
                id="popup-dias"
                type="number"
                inputMode="numeric"
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                placeholder="Ex: 45"
                className="h-14 text-lg"
              />
            </div>

            {/* Custo */}
            <div className="space-y-2">
              <Label htmlFor="popup-custo" className="text-base font-medium">
                Custo por dia (R$)
              </Label>
              <Input
                id="popup-custo"
                type="number"
                inputMode="decimal"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                placeholder="Ex: 8.00"
                className="h-14 text-lg"
              />
            </div>

            {/* Preço Venda */}
            <div className="space-y-2">
              <Label htmlFor="popup-preco" className="text-base font-medium">
                Preço de venda por kg (R$)
              </Label>
              <Input
                id="popup-preco"
                type="number"
                inputMode="decimal"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                placeholder="Ex: 18.00"
                className="h-14 text-lg"
              />
            </div>

            <Button
              onClick={handleCalcular}
              className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 mt-4"
            >
              Calcular Agora
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Resultado */}
            <div
              className={`rounded-xl p-6 border-2 ${
                resultado.decisao === "vender"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-600"
                  : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-600"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {resultado.decisao === "vender" ? (
                  <TrendingUp className="w-10 h-10 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-10 h-10 text-red-600" />
                )}
                <div
                  className={`text-2xl font-bold ${
                    resultado.decisao === "vender"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {resultado.decisao === "vender" ? "VENDER HOJE" : "SEGURAR"}
                </div>
              </div>

              <div className="space-y-2 text-foreground">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receita:</span>
                  <span className="font-semibold">R$ {resultado.receitaAtual.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custo Total:</span>
                  <span className="font-semibold">R$ {resultado.custoTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Lucro:</span>
                  <span
                    className={`font-bold ${
                      resultado.lucroAtual >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    R$ {resultado.lucroAtual.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs Principais */}
            <Button
              onClick={handleWhatsApp}
              className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              📱 Receber no WhatsApp
            </Button>

            <Button
              onClick={handlePremium}
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              <Gift className="w-5 h-5 mr-2" />
              🎁 Premium Completo - 7 Dias Grátis
            </Button>

            {/* Compartilhamento discreto */}
            <div className="pt-2">
              {!showShareOptions ? (
                <button
                  onClick={() => setShowShareOptions(true)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Ou compartilhar de outra forma
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">Compartilhar via:</p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareInstagram}
                      className="h-10 w-10"
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareFacebook}
                      className="h-10 w-10"
                    >
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      className="h-10 w-10"
                    >
                      {navigator.share ? <Share2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Nova Simulação */}
            <Button
              onClick={handleNovaSimulacao}
              variant="ghost"
              className="w-full h-10 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Fazer nova simulação
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SimulacaoPopup;
