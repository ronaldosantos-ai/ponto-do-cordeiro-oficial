import { Link } from "react-router-dom";
import { ArrowLeft, Crown, Check, Sparkles } from "lucide-react";

const Premium = () => {
  const features = [
    "Histórico ilimitado de simulações",
    "Exportar relatórios em PDF",
    "Sincronização na nuvem",
    "Múltiplos perfis de preço",
    "Suporte prioritário",
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 animate-fade-in">
        <Link
          to="/"
          className="p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Premium</h1>
          <p className="text-muted-foreground text-sm mt-1">Recursos exclusivos</p>
        </div>
      </header>

      {/* Premium Card */}
      <main className="space-y-6">
        <div className="card-container bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Crown className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Ponto do Cordeiro Pro</h2>
              <p className="text-muted-foreground text-sm">Acesso completo</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-foreground">R$ 19,90</span>
            <span className="text-muted-foreground">/mês</span>
          </div>

          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="p-1 bg-primary/10 rounded-full">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Assinar Premium
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">Cancele a qualquer momento. Sem compromisso.</p>
      </main>
    </div>
  );
};

export default Premium;
