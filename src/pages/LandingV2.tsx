import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  LogIn,
  Menu,
  Shield,
  Smartphone,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPontoCordeiro from "@/assets/logo-ponto-cordeiro.png";
import heroBackground from "@/assets/hero-background.jpg";
import SimulacaoPopup from "@/components/SimulacaoPopup";

const LandingV2 = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToPrecos = () => {
    document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const scrollToComoFunciona = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleCTA = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Menu Hambúrguer Fixo */}
      <nav className="fixed top-0 right-0 z-50 p-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-2.5 shadow-md hover:shadow-lg transition-all"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-16 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl w-56 overflow-hidden">
              <div className="py-2">
                <button
                  onClick={scrollToComoFunciona}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Target className="w-4 h-4 text-emerald-600" />
                  Como funciona
                </button>
                <button
                  onClick={scrollToPrecos}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Planos
                </button>
                <button
                  onClick={() => { navigate("/simulador"); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  Testar grátis
                </button>
                <button
                  onClick={() => { navigate("/install"); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Instalar App
                </button>
                <div className="mx-4 my-1 border-t border-gray-100" />
                <button
                  onClick={() => { navigate("/auth"); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/88 to-amber-50/80 dark:from-background/95 dark:via-background/90 dark:to-emerald-950/70" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -left-24 bottom-16 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <img src={logoPontoCordeiro} alt="Ponto do Cordeiro" className="h-12 lg:h-16 w-auto" />
                <span className="text-xl lg:text-2xl font-bold text-foreground">Ponto do Cordeiro</span>
              </div>

              <Badge className="mb-5 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-4 py-2 text-sm font-bold border border-emerald-200 dark:border-emerald-800">
                Para criadores que querem vender com número, não com achismo
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground leading-[0.98] mb-6 tracking-tight">
                Saiba se vender hoje dá lucro ou se o cordeiro ainda paga a ração.
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                Em menos de 60 segundos, coloque peso, dias de engorda, custo diário e preço por kg para receber uma decisão clara: <strong className="text-foreground">vender agora</strong> ou <strong className="text-foreground">segurar mais tempo</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <SimulacaoPopup>
                  <Button
                    size="lg"
                    className="h-16 lg:h-20 px-8 lg:px-12 text-lg lg:text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300 w-full sm:w-auto"
                  >
                    <Zap className="w-6 h-6 mr-3" />
                    Fazer simulação gratuita agora
                  </Button>
                </SimulacaoPopup>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToPrecos}
                  className="h-16 lg:h-20 px-8 lg:px-10 text-lg font-bold border-2 bg-white/70 backdrop-blur hover:bg-white dark:bg-background/70"
                >
                  Ver planos
                </Button>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm text-muted-foreground max-w-2xl">
                <div className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-background/70 px-4 py-2 border border-border backdrop-blur">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Sem cartão</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-background/70 px-4 py-2 border border-border backdrop-blur">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>4 campos, 60 segundos</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-background/70 px-4 py-2 border border-border backdrop-blur">
                  <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Garantia de 30 dias</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1.200+ simulações realizadas</span>
                <span className="hidden sm:inline">•</span>
                <span>Feito para uso no curral, no pasto ou no celular</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-3xl blur-3xl opacity-20" />

              <Card className="relative bg-card/95 p-6 lg:p-8 rounded-3xl shadow-2xl border-2 border-border backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Simulação rápida
                      </div>
                      <div className="text-2xl font-extrabold text-foreground mt-1">Lote 12 • Terminação</div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300">
                      Exemplo real
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="text-xs text-muted-foreground">Peso atual</div>
                      <div className="text-xl font-bold text-foreground">35 kg</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="text-xs text-muted-foreground">Dias em engorda</div>
                      <div className="text-xl font-bold text-foreground">45 dias</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="text-xs text-muted-foreground">Custo diário</div>
                      <div className="text-xl font-bold text-foreground">R$ 8,00</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="text-xs text-muted-foreground">Preço/kg</div>
                      <div className="text-xl font-bold text-foreground">R$ 18,00</div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 rounded-2xl p-6 border-2 border-emerald-600">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-8 h-8 text-emerald-600" />
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        VENDER HOJE
                      </div>
                    </div>

                    <div className="text-3xl font-extrabold text-foreground">Lucro estimado: R$ 270,00</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      A decisão aparece com receita, custo acumulado e lucro estimado para evitar venda no escuro.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Público */}
      <section className="py-16 bg-gradient-to-b from-amber-50/60 to-background dark:from-amber-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 mb-4">
              Feito para o produtor rural
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Se você vende cordeiro por peso, margem e tempo de engorda, esta página é para você.
            </h2>
            <p className="text-lg text-muted-foreground">
              O Ponto do Cordeiro ajuda quem precisa decidir o ponto de venda do animal com base em custo diário, preço de mercado e lucro esperado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-7 border-2 bg-card/80 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
              <Calculator className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Criador que calcula no caderno</h3>
              <p className="text-muted-foreground leading-relaxed">
                Troque contas soltas por uma decisão padronizada, rápida e fácil de repetir em cada animal ou lote.
              </p>
            </Card>

            <Card className="p-7 border-2 bg-card/80 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
              <Target className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Quem termina cordeiros em lote</h3>
              <p className="text-muted-foreground leading-relaxed">
                Compare custo de manter o animal por mais dias contra o preço de venda atual e o ganho projetado.
              </p>
            </Card>

            <Card className="p-7 border-2 bg-card/80 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
              <DollarSign className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Produtor que quer proteger margem</h3>
              <p className="text-muted-foreground leading-relaxed">
                Veja o impacto de ração, tempo e preço por kg antes de aceitar uma oferta ou segurar o animal.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Problema */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 mb-4">
              O prejuízo raramente aparece na hora
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              A pergunta não é apenas "quanto pesa?". É: "ainda compensa manter?"
            </h2>
            <p className="text-xl text-muted-foreground">
              Sem uma conta clara, o produtor pode perder margem tanto vendendo cedo quanto segurando demais.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
              <XCircle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Vendeu cedo demais</h3>
              <p className="text-muted-foreground leading-relaxed">
                O cordeiro ainda podia ganhar peso e transformar alguns dias de trato em mais receita líquida.
              </p>
            </Card>

            <Card className="p-8 border-2 border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
              <TrendingDown className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Segurou além do ponto</h3>
              <p className="text-muted-foreground leading-relaxed">
                O animal comeu mais, exigiu manejo e o ganho final não pagou o custo acumulado.
              </p>
            </Card>

            <Card className="p-8 border-2 border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Aceitou oferta no impulso</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sem receita, custo e lucro na tela, a decisão fica na conversa, na pressa ou no "acho que está bom".
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Solução */}
      <section id="como-funciona" className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
              Decisão certa em 3 passos
            </h2>
            <p className="text-xl text-muted-foreground">
              Você coloca os dados do animal e enxerga rapidamente se o custo de manter por mais dias ainda faz sentido.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">1</div>
              <Card className="p-8 pt-12 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all h-full">
                <Calculator className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">Informe os números</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Peso atual, dias de engorda, custo por dia e preço de venda por kg.
                </p>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">2</div>
              <Card className="p-8 pt-12 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all h-full">
                <Target className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">Receba a recomendação</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Verde indica venda hoje. Vermelho indica segurar. Tudo acompanhado de receita, custo e lucro.
                </p>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">3</div>
              <Card className="p-8 pt-12 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all h-full">
                <TrendingUp className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">Evolua para gestão</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  No Premium, compare cenários, acompanhe histórico, crie alertas e analise seus lotes com mais controle.
                </p>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <SimulacaoPopup>
              <Button size="lg" className="h-16 px-10 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                Testar com meus números agora
              </Button>
            </SimulacaoPopup>
          </div>
        </div>
      </section>

      {/* Seção de valor */}
      <section className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
            <div>
              <Badge className="bg-white/10 text-white hover:bg-white/10 border border-white/20 mb-5">
                Valor percebido antes da assinatura
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                O produto resolve a decisão que pesa direto no bolso.
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                O foco não é prometer tecnologia complicada. É mostrar, com uma conta simples, se a decisão de venda protege sua margem ou se está custando ração, manejo e tempo sem retorno.
              </p>
            </div>

            <Card className="p-6 lg:p-8 bg-white text-foreground rounded-3xl shadow-2xl">
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl bg-red-50 p-5 border border-red-100">
                  <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Sem cálculo</p>
                  <p className="font-bold">Decisão no achismo</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-5 border border-amber-100">
                  <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Em 60 segundos</p>
                  <p className="font-bold">Resultado na tela</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Com números</p>
                  <p className="font-bold">Venda com margem</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Pricing */}
      <section id="precos" className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 mb-4">
              Comece grátis e evolua quando fizer sentido
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Escolha seu plano</h2>
            <p className="text-xl text-muted-foreground">
              Use a versão gratuita para decidir o básico. Assine o Premium quando quiser histórico, projeção, alertas e gestão recorrente.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            <Card className="p-8 border-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Gratuito</h3>
                <div className="text-4xl font-extrabold text-foreground">R$ 0</div>
                <div className="text-muted-foreground">para começar hoje</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Simulação básica</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Cálculo de receita, custo e lucro</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Envio do resultado por WhatsApp</span></li>
                <li className="flex items-start gap-3 text-muted-foreground"><XCircle className="w-5 h-5 flex-shrink-0 mt-1" /><span>Histórico e alertas</span></li>
                <li className="flex items-start gap-3 text-muted-foreground"><XCircle className="w-5 h-5 flex-shrink-0 mt-1" /><span>Comparação de cenários futuros</span></li>
              </ul>

              <SimulacaoPopup>
                <Button variant="outline" className="w-full h-12 font-bold">
                  Fazer simulação grátis
                </Button>
              </SimulacaoPopup>
            </Card>

            <Card className="p-8 border-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Premium Mensal</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-muted-foreground line-through">R$ 49,90</span>
                  <span className="text-4xl font-extrabold text-foreground">R$ 19,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">7 dias grátis, sem cartão</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="font-semibold text-foreground">Tudo do Gratuito</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Simulação de ganho futuro</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Histórico completo por animal ou lote</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Alertas automáticos de venda</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Gráficos, análises e Google Sheets</span></li>
              </ul>

              <Button className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg" onClick={handleCTA}>
                Experimentar Premium grátis
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-3">Cancele quando quiser</p>
            </Card>

            <Card className="relative p-8 border-4 border-emerald-600 shadow-2xl shadow-emerald-600/20 lg:scale-105 bg-gradient-to-br from-card to-emerald-50/50 dark:to-emerald-950/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold hover:bg-emerald-600">
                  Mais escolhido
                </Badge>
              </div>
              <div className="mb-6 mt-4">
                <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 mb-2 hover:bg-amber-100">
                  Melhor custo anual
                </Badge>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Premium Anual</h3>
                <div className="flex items-baseline gap-1 flex-nowrap whitespace-nowrap">
                  <span className="text-xs sm:text-sm text-muted-foreground line-through">R$ 499</span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-600 leading-none">R$ 98</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">/ano</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">Tudo do Premium Mensal</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">2 meses de economia</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">🎁 Suporte prioritário</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /><span className="text-foreground">🎁 Planilha de controle complementar</span></li>
              </ul>

              <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={handleCTA}>
                Assinar anual
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">Cancele quando quiser</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Garantia */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <Card className="max-w-3xl mx-auto p-10 text-center border-4 border-blue-200 dark:border-blue-800 shadow-xl">
            <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-foreground">Teste sem risco por 30 dias</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Se o Ponto do Cordeiro não facilitar suas decisões ou não ajudar você a enxergar melhor sua margem, devolvemos 100% do valor. Sem perguntas. Sem burocracia.
            </p>
          </Card>
        </div>
      </section>

      {/* Seção FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16 text-foreground">Perguntas frequentes</h2>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-foreground">Funciona no celular?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">Sim. A experiência foi pensada para uso rápido no celular, no curral, no pasto ou no escritório.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-foreground">Precisa de internet?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">O cálculo pode ser feito no aparelho. A internet é necessária para login, histórico, sincronização e recursos online.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-foreground">É difícil de usar?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">Não. Se você sabe informar peso, dias, custo diário e preço de venda, consegue simular em menos de um minuto.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-foreground">Posso testar grátis?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">Sim. A página prioriza a simulação gratuita para você ver valor antes de assinar. O Premium também oferece teste de 7 dias.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-foreground">Como cancelo?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">Você pode cancelar quando quiser. A proposta é reduzir risco e deixar o produtor testar com tranquilidade.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Antes de vender o próximo cordeiro, faça a conta.
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Em 60 segundos você vê se a venda faz sentido hoje ou se ainda vale segurar para buscar mais margem.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SimulacaoPopup>
              <Button size="lg" className="h-16 px-12 text-lg bg-white text-emerald-700 hover:bg-gray-100 font-bold shadow-2xl">
                Simular gratuitamente
              </Button>
            </SimulacaoPopup>
            <Button size="lg" variant="outline" onClick={handleCTA} className="h-16 px-12 text-lg border-white/40 text-white bg-white/10 hover:bg-white/20 font-bold">
              Criar conta
            </Button>
          </div>

          <p className="mt-6 text-white/80 text-sm">7 dias grátis no Premium • Sem cartão • Garantia de 30 dias</p>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoPontoCordeiro} alt="Ponto do Cordeiro" className="h-10 w-auto" />
                <span className="text-white font-bold">Ponto do Cordeiro</span>
              </div>
              <p className="text-sm">Decisão inteligente para venda de cordeiros.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#precos" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="/auth" className="hover:text-white transition-colors">Login</a></li>
                <li><a href="/install" className="hover:text-white transition-colors flex items-center gap-1"><Smartphone className="w-4 h-4" />Instalar App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="/politica-privacidade" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2025 Ponto do Cordeiro • Para o produtor rural
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
