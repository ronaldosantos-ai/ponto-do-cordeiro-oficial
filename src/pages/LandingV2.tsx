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
  Zap,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calculator,
  Target,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoPontoCordeiro from "@/assets/logo-ponto-cordeiro.png";
import heroBackground from "@/assets/hero-background.jpg";
import SimulacaoPopup from "@/components/SimulacaoPopup";

const LandingV2 = () => {
  const navigate = useNavigate();

  const scrollToPrecos = () => {
    document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCTA = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center relative"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay branco com 20% de opacidade */}
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <img src={logoPontoCordeiro} alt="Ponto do Cordeiro" className="h-12 lg:h-16 w-auto" />
                <span className="text-xl lg:text-2xl font-bold text-foreground">Ponto do Cordeiro</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-none mb-6">
                Venda no Momento Certo.
                <br />
                Lucre Mais.
              </h1>

              {/* Subheadline */}
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Descubra em 60 segundos se vale a pena vender o cordeiro hoje ou segurar mais tempo.
                <br />
                Sistema usado por produtores que aumentaram o lucro em até 23%.
              </p>

              {/* CTA Principal */}
              <SimulacaoPopup>
                <Button
                  size="lg"
                  className="h-16 lg:h-20 px-8 lg:px-12 text-lg lg:text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-2xl hover:shadow-emerald-600/50 transition-all duration-300 w-full lg:w-auto"
                >
                  <Zap className="w-6 h-6 mr-3" />
                  ⚡ Simulação Gratuita Instantânea
                </Button>
              </SimulacaoPopup>

              {/* Benefícios */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-base">Sem cartão • Sem compromisso • Cancele quando quiser</span>
                </div>
              </div>

              {/* Prova social */}
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span>⭐⭐⭐⭐⭐ 4.9/5 • 1.200+ simulações realizadas</span>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl blur-3xl opacity-20"></div>

              <Card className="relative bg-card p-8 rounded-2xl shadow-2xl border-2 border-border">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Simulação Rápida
                  </div>

                  {/* Campos preenchidos */}
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <div className="text-xs text-muted-foreground">Peso</div>
                      <div className="text-lg font-bold text-foreground">35 kg</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <div className="text-xs text-muted-foreground">Dias</div>
                      <div className="text-lg font-bold text-foreground">45 dias</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <div className="text-xs text-muted-foreground">Custo diário</div>
                      <div className="text-lg font-bold text-foreground">R$ 8,00</div>
                    </div>
                  </div>

                  {/* Resultado */}
                  <div className="mt-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 rounded-xl p-6 border-2 border-emerald-600">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-8 h-8 text-emerald-600" />
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        VENDER HOJE
                      </div>
                    </div>

                    <div className="text-3xl font-extrabold text-foreground">
                      Lucro: R$ 340,00
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Problema */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16 max-w-3xl mx-auto text-foreground">
            Você está perdendo dinheiro sem perceber?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
              <XCircle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Vendeu cedo demais</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deixou R$ 200+ na mesa porque o animal ainda ia engordar 5kg em 2 semanas.
              </p>
            </Card>

            <Card className="p-8 border-2 border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
              <TrendingDown className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Segurou além do ponto</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gastou R$ 300 de ração extra para ganhar apenas R$ 150 na venda.
              </p>
            </Card>

            <Card className="p-8 border-2 border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-all">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Decidiu no "achismo"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sem números concretos, cada decisão é um tiro no escuro.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Solução */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-6 text-foreground">
            Decisão certa em 3 passos
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16">
            Simples. Rápido. Baseado em números reais.
          </p>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Passo 1 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">
                1
              </div>
              <Card className="p-8 pt-12 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                <Calculator className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">Digite os dados</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Peso, dias, custo diário e preço de venda. Leva 30 segundos.
                </p>
              </Card>
            </div>

            {/* Passo 2 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">
                2
              </div>
              <Card className="p-8 pt-12 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                <Target className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">Receba a decisão</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  <span className="font-semibold text-emerald-600">🟢 Verde:</span> Vender hoje
                  <br />
                  <span className="font-semibold text-red-600">🔴 Vermelho:</span> Segurar mais
                </p>
              </Card>
            </div>

            {/* Passo 3 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">
                3
              </div>
              <Card className="p-8 pt-12 border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                <TrendingUp className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-foreground">Compare cenários</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Simule ganho de peso futuro e veja exatamente quanto pode ganhar esperando.
                </p>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={scrollToPrecos}
              className="h-16 px-10 text-lg bg-emerald-600 hover:bg-emerald-700"
            >
              Começar Agora →
            </Button>
          </div>
        </div>
      </section>

      {/* Seção Pricing */}
      <section id="precos" className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16 text-foreground">
            Escolha seu plano
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {/* Card Gratuito */}
            <Card className="p-8 border-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Gratuito</h3>
                <div className="text-4xl font-extrabold text-foreground">R$ 0</div>
                <div className="text-muted-foreground">para sempre</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Decisão básica ilimitada</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Cálculo de lucro</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Enviar por WhatsApp</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Histórico e alertas</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Simulação de ganho</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full h-12" onClick={handleCTA}>
                Começar Grátis
              </Button>
            </Card>

            {/* Card Premium (Destaque) */}
            <Card className="relative p-8 border-4 border-emerald-600 shadow-2xl shadow-emerald-600/20 lg:scale-105 bg-gradient-to-br from-card to-emerald-50/50 dark:to-emerald-950/20">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold hover:bg-emerald-600">
                  👑 MAIS POPULAR
                </Badge>
              </div>

              <div className="mb-6 mt-4">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Premium</h3>
                <div className="flex items-baseline gap-1 flex-nowrap whitespace-nowrap">
                  <span className="text-xs sm:text-sm text-muted-foreground line-through">R$ 29,90</span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-600 leading-none">R$ 19,90</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">/mês</span>
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Por tempo limitado!</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="font-semibold text-foreground">Tudo do Gratuito</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Simulação de ganho futuro</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Histórico completo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Alertas automáticos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Gráficos e análises</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Google Sheets</span>
                </li>
              </ul>

              <Button
                className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                onClick={handleCTA}
              >
                Experimentar 7 Dias Grátis
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-3">
                Sem cartão de crédito
              </p>
            </Card>

            {/* Card Anual */}
            <Card className="p-8 border-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mb-2 hover:bg-blue-100">
                  💎 Economize 34%
                </Badge>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Premium Anual</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-muted-foreground line-through">R$ 297</span>
                  <span className="text-4xl font-extrabold text-foreground">R$ 197</span>
                  <span className="text-muted-foreground">/ano</span>
                </div>
                <div className="text-sm text-emerald-600 font-semibold mt-1">Por tempo limitado!</div>
                <div className="text-sm text-muted-foreground mt-1">12x R$ 16,41</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">Tudo do Premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">🎁 2 meses grátis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">🎁 Grupo VIP</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-foreground">🎁 Planilha controle</span>
                </li>
              </ul>

              <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700" onClick={handleCTA}>
                Assinar Anual
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Garantia */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <Card className="max-w-3xl mx-auto p-10 text-center border-4 border-blue-200 dark:border-blue-800 shadow-xl">
            <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-foreground">Garantia de 30 dias</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Teste sem risco. Se não aumentar seu lucro ou facilitar suas decisões, devolvemos 100%
              do valor. Sem perguntas. Sem burocracia.
            </p>
          </Card>
        </div>
      </section>

      {/* Seção FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16 text-foreground">
            Perguntas frequentes
          </h2>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-foreground">
                Funciona no celular?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Sim, 100% mobile. Use no pasto, no curral ou onde estiver.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-foreground">
                Precisa de internet?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Não. O cálculo funciona offline. Você só precisa de internet para salvar no
                histórico.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-foreground">
                É difícil de usar?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Se você pesa cordeiro, sabe usar o app. Interface simples com apenas 4 campos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-foreground">
                Posso testar grátis?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Sim, 7 dias totalmente grátis sem precisar colocar cartão de crédito.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-foreground">
                Como cancelo?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Pelo próprio app, quando quiser. Sem multa, sem burocracia.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Pare de perder dinheiro no achismo
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Produtores inteligentes já usam dados para decidir o momento certo. E você?
          </p>

          <Button
            size="lg"
            onClick={handleCTA}
            className="h-16 px-12 text-lg bg-white text-emerald-700 hover:bg-gray-100 font-bold shadow-2xl"
          >
            Começar Teste Grátis Agora
          </Button>

          <p className="mt-6 text-white/80 text-sm">
            ✓ 7 dias grátis • ✓ Sem cartão • ✓ Garantia 30 dias
          </p>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐑</span>
                <span className="text-white font-bold">Ponto do Cordeiro</span>
              </div>
              <p className="text-sm">Decisão inteligente para venda de cordeiros.</p>
            </div>

            {/* Produto */}
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#precos" className="hover:text-white transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="/auth" className="hover:text-white transition-colors">
                    Login
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    WhatsApp
                  </a>
                </li>
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
