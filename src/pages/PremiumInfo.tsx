import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, TrendingUp, History, Bell, Filter, Check, X, BarChart3, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHECKOUT_MENSAL = "https://checkout.ticto.app/O01E1A700";
const CHECKOUT_ANUAL = "https://checkout.ticto.app/O7A8E915F";

const PremiumInfo = () => {
  const navigate = useNavigate();

  const beneficios = [
    {
      icon: TrendingUp,
      titulo: "Projeção de Ganho",
      descricao: "Simule quanto o cordeiro vai engordar e calcule se vale a pena segurar mais tempo"
    },
    {
      icon: History,
      titulo: "Histórico Completo",
      descricao: "Salve todas as simulações com identificação e acesse quando precisar"
    },
    {
      icon: Bell,
      titulo: "Alertas Inteligentes",
      descricao: "Receba lembretes para reavaliar a venda no momento certo"
    },
    {
      icon: BarChart3,
      titulo: "Gráficos de Evolução",
      descricao: "Visualize a evolução do lucro e peso ao longo do tempo"
    },
    {
      icon: Filter,
      titulo: "Relatórios e Filtros",
      descricao: "Filtre por período, animal, e veja lucro total acumulado"
    },
    {
      icon: Share2,
      titulo: "Compartilhamento Completo",
      descricao: "Envie resultados via Telegram, Email e mais opções além do WhatsApp"
    }
  ];

  const comparacao = [
    { recurso: "Simulação básica", gratuito: true, premium: true },
    { recurso: "Enviar para WhatsApp", gratuito: true, premium: true },
    { recurso: "Projeção de ganho futuro", gratuito: false, premium: true },
    { recurso: "Comparar lucro hoje vs futuro", gratuito: false, premium: true },
    { recurso: "Salvar com identificação", gratuito: false, premium: true },
    { recurso: "Histórico completo com filtros", gratuito: false, premium: true },
    { recurso: "Alertas e lembretes", gratuito: false, premium: true },
    { recurso: "Gráficos de evolução", gratuito: false, premium: true },
    { recurso: "Compartilhar via Telegram/Email", gratuito: false, premium: true },
    { recurso: "Exportar relatórios PDF/CSV", gratuito: false, premium: true },
  ];

  const handleCheckoutMensal = () => {
    window.open(CHECKOUT_MENSAL, '_blank');
  };

  const handleCheckoutAnual = () => {
    window.open(CHECKOUT_ANUAL, '_blank');
  };

  return (
    <div className="page-container pb-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="p-2 hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      </header>

      {/* Hero Section */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <Crown className="w-16 h-16 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Ponto do Cordeiro Premium</h1>
        <p className="text-muted-foreground mt-2">
          Tome decisões mais inteligentes com projeção de ganho
        </p>
      </div>

      {/* Benefícios */}
      <div className="grid gap-4 mb-8">
        {beneficios.map((beneficio, index) => (
          <div
            key={index}
            className="card-container flex items-start gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-3 rounded-full bg-amber-100">
              <beneficio.icon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{beneficio.titulo}</h3>
              <p className="text-sm text-muted-foreground mt-1">{beneficio.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de Comparação */}
      <div className="card-container mb-8 animate-fade-in">
        <h2 className="text-lg font-bold text-foreground mb-4 text-center">Compare os planos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center py-3 text-muted-foreground font-medium">Gratuito</th>
                <th className="text-center py-3 text-amber-600 font-medium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {comparacao.map((item, index) => (
                <tr key={index} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-foreground">{item.recurso}</td>
                  <td className="py-3 text-center">
                    {item.gratuito ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {item.premium ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planos de Preço */}
      <div className="grid gap-4 mb-6">
        {/* Plano Anual - DESTAQUE */}
        <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl text-white animate-fade-in overflow-hidden">
          <div className="absolute top-3 right-3 bg-white text-amber-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            MAIS VANTAJOSO
          </div>
          <p className="text-sm opacity-90 mb-1">Programa Fundadores</p>
          <p className="font-bold text-lg mb-2">Plano Anual</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">R$ 197</span>
            <span className="text-sm opacity-80">/ano</span>
          </div>
          <p className="text-xs opacity-80 mb-4">Apenas R$ 16,42/mês • Economia de 18%</p>
          <Button
            onClick={handleCheckoutAnual}
            className="w-full h-12 text-base font-bold bg-white text-amber-600 hover:bg-amber-50"
          >
            Começar Teste Grátis
          </Button>
          <p className="text-xs text-center mt-2 opacity-80">7 dias grátis • Cancele quando quiser</p>
        </div>

        {/* Plano Mensal */}
        <div className="card-container border-2 border-border animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">Oferta de Lançamento</p>
          <p className="font-bold text-lg text-foreground mb-2">Plano Mensal</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-foreground">R$ 19,90</span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Cobrança mensal recorrente</p>
          <Button
            onClick={handleCheckoutMensal}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-2"
          >
            Começar Teste Grátis
          </Button>
          <p className="text-xs text-center mt-2 text-muted-foreground">7 dias grátis • Cancele quando quiser</p>
        </div>
      </div>

      {/* Garantia */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center animate-fade-in">
        <p className="text-green-800 font-semibold">🛡️ Garantia de 30 dias</p>
        <p className="text-sm text-green-700 mt-1">Se não gostar, devolvemos 100% do valor</p>
      </div>

      {/* Rodapé */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">Dúvidas? Fale conosco</p>
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-600 hover:underline"
        >
          WhatsApp Suporte
        </a>
      </div>
    </div>
  );
};

export default PremiumInfo;
