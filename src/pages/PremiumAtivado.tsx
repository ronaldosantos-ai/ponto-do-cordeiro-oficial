import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyPopper, Crown } from "lucide-react";

const PremiumAtivado = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Celebration Icons */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <PartyPopper className="w-12 h-12 text-amber-500 animate-bounce" />
          <Crown className="w-16 h-16 text-amber-500" />
          <PartyPopper className="w-12 h-12 text-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          🎉 Premium Ativado!
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-2">
          Seu teste grátis de 7 dias começou
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Aproveite todos os recursos Premium para tomar as melhores decisões na sua produção.
        </p>

        {/* Benefits reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
          <p className="font-semibold text-amber-800 mb-2">Agora você tem acesso a:</p>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>✓ Projeção de ganho de peso</li>
            <li>✓ Histórico completo de simulações</li>
            <li>✓ Alertas e lembretes</li>
            <li>✓ Gráficos de evolução</li>
            <li>✓ Exportação de relatórios</li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate('/premium')}
          className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
        >
          Começar a Usar
        </Button>

        {/* Secondary action */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mt-4 text-muted-foreground"
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
};

export default PremiumAtivado;