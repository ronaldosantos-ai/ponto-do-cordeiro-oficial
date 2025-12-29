import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, TrendingUp, History, Bell, Filter, Check, X, BarChart3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ativarPremium } from "@/lib/storage";

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

  const handleAssinar = () => {
    alert('Integração com pagamento em breve');
  };

  const handleAtivarTeste = () => {
    ativarPremium();
    navigate('/premium');
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

      {/* Card de Preço */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl text-white text-center mb-6 animate-fade-in">
        <p className="text-sm opacity-90 mb-2">Acesso completo por apenas</p>
        <p className="text-4xl font-bold">R$ 29,90<span className="text-lg font-normal">/mês</span></p>
        <p className="text-sm opacity-80 mt-2">Cancele quando quiser</p>
      </div>

      {/* Botão de Ação Principal */}
      <Button
        onClick={handleAssinar}
        className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white mb-3"
      >
        Assinar Premium
      </Button>

      {/* Botão de Teste (temporário) */}
      <Button
        variant="outline"
        onClick={handleAtivarTeste}
        className="w-full h-12 border-2"
      >
        🔓 Ativar Premium (Teste)
      </Button>

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
