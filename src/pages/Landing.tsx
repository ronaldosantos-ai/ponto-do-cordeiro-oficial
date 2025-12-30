import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Rocket,
  Check,
  XCircle,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Shield,
  BarChart3,
  DollarSign,
  Zap,
  Crown,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const scrollToPrecos = () => {
    document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl">🐑</span>
              <span className="text-xl font-bold text-foreground">Ponto do Cordeiro</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Decida em 60 Segundos se Vale a Pena Vender o Cordeiro Hoje ou Segurar
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
              Sistema inteligente que calcula lucro real e mostra quando é o melhor momento de venda
            </p>

            <Button
              size="lg"
              className="h-16 px-8 text-lg bg-primary hover:bg-primary/90 w-full lg:w-auto mb-6"
              onClick={scrollToPrecos}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Começar Grátis por 7 Dias
            </Button>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Grátis por 7 dias
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Cancele quando quiser
              </span>
            </div>
          </div>

          {/* Right Column - App Mockup */}
          <div className="flex justify-center">
            <Card className="w-full max-w-sm shadow-2xl border-2">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="text-2xl">🐑</span>
                  <p className="font-semibold text-foreground">Simulação Rápida</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Peso atual</span>
                    <span className="font-bold text-foreground">30 kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Dias em engorda</span>
                    <span className="font-bold text-foreground">45 dias</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Custo diário</span>
                    <span className="font-bold text-foreground">R$ 8,00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Preço/kg</span>
                    <span className="font-bold text-foreground">R$ 20,00</span>
                  </div>
                </div>

                <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 text-center">
                  <p className="text-primary font-bold text-xl mb-1">✅ VENDER HOJE</p>
                  <p className="text-3xl font-bold text-primary">Lucro: R$ 340,00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
            Você Já Perdeu Dinheiro Vendendo no Momento Errado?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card p-8 rounded-xl shadow-sm border-2 border-destructive/20">
              <CardContent className="p-0">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="font-bold text-lg mb-3 text-foreground">Vendeu cedo demais</h3>
                <p className="text-muted-foreground">
                  O cordeiro ainda ia engordar 5kg em 15 dias. Você deixou R$ 200 na mesa por falta de cálculo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card p-8 rounded-xl shadow-sm border-2 border-destructive/20">
              <CardContent className="p-0">
                <TrendingDown className="h-12 w-12 text-destructive mb-4" />
                <h3 className="font-bold text-lg mb-3 text-foreground">Segurou demais</h3>
                <p className="text-muted-foreground">
                  Gastou R$ 300 de ração extra para ganhar apenas R$ 150 na venda final.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card p-8 rounded-xl shadow-sm border-2 border-destructive/20">
              <CardContent className="p-0">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="font-bold text-lg mb-3 text-foreground">Decidiu no "achismo"</h3>
                <p className="text-muted-foreground">
                  Sem dados concretos, cada venda é um tiro no escuro. Hora de decidir com números reais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-foreground">
            A Decisão Certa em 3 Passos de 20 Segundos
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Simples assim. Sem complicação.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-card p-8 rounded-xl shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Digite os dados básicos</h3>
                <p className="text-muted-foreground">
                  Peso atual, dias em cativeiro, custo diário e preço de venda.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card p-8 rounded-xl shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Receba a decisão na hora</h3>
                <p className="text-muted-foreground mb-2">
                  <span className="text-primary font-semibold">🟢 Verde = Vender Hoje</span>
                </p>
                <p className="text-muted-foreground">
                  <span className="text-destructive font-semibold">🔴 Vermelho = Segurar mais tempo</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card p-8 rounded-xl shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Compare cenários (Premium)</h3>
                <p className="text-muted-foreground">
                  Simule: "E se eu segurar 30 dias?" Veja o ganho de peso futuro e lucro projetado.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-primary hover:bg-primary/90"
              onClick={scrollToPrecos}
            >
              Testar Grátis Agora
            </Button>
          </div>
        </div>
      </section>

      {/* VALUE STACK SECTION */}
      <section className="bg-gradient-to-br from-primary/5 to-blue-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
            Tudo Que Você Ganha Com o Ponto do Cordeiro
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              { feature: "Decisão inteligente ilimitada", value: "R$ 97/mês" },
              { feature: "Simulação de ganho de peso futuro", value: "R$ 67/mês" },
              { feature: "Histórico completo com filtros e busca", value: "R$ 47/mês" },
              { feature: "Alertas automáticos por data/animal", value: "R$ 37/mês" },
              { feature: "Gráficos de evolução e análises", value: "R$ 27/mês" },
              { feature: "Exportação para Google Sheets", value: "R$ 27/mês" },
              { feature: "Compartilhamento via WhatsApp/Telegram", value: "R$ 17/mês" },
              { feature: "Suporte via WhatsApp", value: "R$ 197/mês" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">{item.feature}</p>
                  <p className="text-sm text-muted-foreground">(Valor de mercado: {item.value})</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Card className="bg-card p-8 shadow-lg rounded-xl max-w-md text-center">
              <CardContent className="p-0">
                <p className="text-2xl line-through text-muted-foreground mb-2">Valor Total: R$ 516/mês</p>
                <p className="text-lg text-muted-foreground mb-2">Você paga apenas:</p>
                <p className="text-4xl font-bold text-primary mb-2">R$ 19,90/mês ou R$ 197/ano</p>
                <p className="text-sm text-muted-foreground mb-6">Economia de 97% do valor real</p>
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 w-full"
                  onClick={scrollToPrecos}
                >
                  Começar Meu Teste Grátis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
            Produtores Já Estão Usando
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card p-8 text-center">
              <CardContent className="p-0">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-5xl font-bold text-primary mb-2">1.247</p>
                <p className="text-muted-foreground">simulações realizadas</p>
              </CardContent>
            </Card>

            <Card className="bg-card p-8 text-center">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-5xl font-bold text-primary mb-2">R$ 89.340</p>
                <p className="text-muted-foreground">em lucro calculado</p>
              </CardContent>
            </Card>

            <Card className="bg-card p-8 text-center">
              <CardContent className="p-0">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-5xl font-bold text-primary mb-2">42 seg</p>
                <p className="text-muted-foreground">tempo médio de decisão</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="bg-blue-50 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Card className="bg-card p-10 rounded-2xl shadow-xl border-4 border-blue-200 text-center">
            <CardContent className="p-0">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                🛡️ GARANTIA INCONDICIONAL DE 30 DIAS
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Teste por 30 dias sem compromisso. Se o Ponto do Cordeiro não facilitar suas decisões ou aumentar seu lucro, devolvemos 100% do valor investido.
              </p>
              <p className="text-base text-muted-foreground">
                Sem burocracia. Sem perguntas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="precos" className="py-16 lg:py-24 scroll-mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
            Escolha Seu Plano
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-card p-8 rounded-xl shadow-md border-2">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-2 text-foreground">GRATUITO</h3>
                <p className="text-4xl font-bold text-foreground mb-1">R$ 0<span className="text-lg font-normal">/mês</span></p>
                <p className="text-muted-foreground mb-6">Para sempre</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Decisão básica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Cálculo de lucro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Ganho de peso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Histórico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Alertas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Gráficos</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-12" onClick={() => navigate("/auth")}>
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Premium Monthly - Featured */}
            <Card className="bg-card p-8 rounded-xl shadow-2xl border-4 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  👑 MAIS POPULAR
                </span>
              </div>
              <CardContent className="p-0 pt-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">PREMIUM MENSAL</h3>
                <p className="text-4xl font-bold text-primary mb-1">R$ 19,90<span className="text-lg font-normal text-foreground">/mês</span></p>
                <p className="text-muted-foreground mb-6">Cancele quando quiser</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Tudo do Gratuito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Ganho peso futuro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Histórico completo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Alertas ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Gráficos evolução</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Google Sheets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Relatórios PDF</span>
                  </div>
                </div>

                <Button className="w-full h-12 bg-primary hover:bg-primary/90" onClick={() => navigate("/auth")}>
                  Experimentar Grátis
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">7 dias sem pagar</p>
              </CardContent>
            </Card>

            {/* Premium Annual */}
            <Card className="bg-card p-8 rounded-xl shadow-md border-2 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-muted text-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  💎 ECONOMIZE 17%
                </span>
              </div>
              <CardContent className="p-0 pt-4">
                <h3 className="text-xl font-bold mb-2 text-foreground">PREMIUM ANUAL</h3>
                <p className="text-4xl font-bold text-foreground mb-1">R$ 197<span className="text-lg font-normal">/ano</span></p>
                <p className="text-muted-foreground mb-6">12x de R$ 16,41</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Tudo Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-semibold">🎁 2 meses GRÁTIS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-semibold">🎁 Grupo VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-semibold">🎁 Planilha Controle</span>
                  </div>
                </div>

                <Button className="w-full h-12 bg-primary hover:bg-primary/90" onClick={() => navigate("/auth")}>
                  Assinar Anual
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">Melhor custo-benefício</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            ✓ Aceito: Pix, Cartão, Boleto
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Perguntas Frequentes
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                Funciona no meu celular?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! 100% mobile. Use direto no pasto, no curral ou onde estiver. Funciona em qualquer smartphone Android ou iPhone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                Preciso de internet o tempo todo?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Não. O cálculo funciona offline. Você só precisa de internet para salvar no histórico ou sincronizar com Google Sheets.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                É difícil de usar?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Se você sabe pesar um cordeiro e contar dias, você sabe usar o app. Interface simples com apenas 4 campos para preencher.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                E se eu me arrepender da assinatura?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                30 dias de garantia incondicional. Cancele quando quiser pelo próprio app. Sem multa, sem burocracia.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                Posso testar antes de pagar?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! 7 dias totalmente grátis. Você testa todos os recursos Premium sem colocar cartão de crédito.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                Como funciona o suporte?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                WhatsApp direto com nossa equipe. Respondemos em até 2 horas úteis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                Meus dados ficam seguros?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim. Armazenamento criptografado e backup automático na nuvem. Seus dados nunca são compartilhados.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-card rounded-lg px-6 border">
              <AccordionTrigger className="text-left font-semibold">
                Posso usar em vários celulares?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim. Faça login em qualquer dispositivo e seus dados estarão sincronizados.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* URGENCY SECTION */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
              🎯 OFERTA LIMITADA
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8">
            Bônus Exclusivos para os 100 Primeiros Fundadores
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-primary-foreground/10 backdrop-blur border-0 p-6">
              <CardContent className="p-0 text-primary-foreground">
                <h3 className="font-bold text-lg mb-2">✅ 3 MESES PELO PREÇO DE 2</h3>
                <p className="text-sm opacity-90">Pague R$ 197 → ganhe até março de 2026</p>
                <p className="text-sm opacity-90">Economia de R$ 59,70</p>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 backdrop-blur border-0 p-6">
              <CardContent className="p-0 text-primary-foreground">
                <h3 className="font-bold text-lg mb-2">✅ GRUPO VIP FUNDADORES</h3>
                <ul className="text-sm opacity-90 space-y-1">
                  <li>• Acesso direto aos criadores</li>
                  <li>• Influencie funcionalidades</li>
                  <li>• Networking com produtores</li>
                  <li>• Suporte prioritário</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 backdrop-blur border-0 p-6">
              <CardContent className="p-0 text-primary-foreground">
                <h3 className="font-bold text-lg mb-2">✅ PLANILHA COMPLEMENTAR</h3>
                <p className="text-sm opacity-90">Gestão completa do rebanho</p>
                <p className="text-sm opacity-90">Controle financeiro integrado</p>
                <p className="text-sm opacity-90">(Valor: R$ 97 - Grátis)</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <Card className="bg-primary-foreground/20 backdrop-blur border-0 inline-block px-8 py-4">
              <CardContent className="p-0">
                <p className="text-lg font-semibold">⏰ Restam apenas:</p>
                <p className="text-4xl font-bold">87 vagas de fundador</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="h-16 px-12 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => navigate("/auth")}
            >
              Garantir Minha Vaga de Fundador Agora
            </Button>
            <p className="text-sm opacity-75 mt-4">Bônus válido apenas para plano anual</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-foreground text-background py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Pare de Decidir no Achismo. Comece a Lucrar Mais Hoje.
          </h2>

          <p className="text-lg lg:text-xl text-muted mb-8">
            Produtores inteligentes já usam dados reais para vender no momento exato de maior lucro.
            <br /><br />
            Enquanto outros arriscam no "feeling", você vai saber exatamente quando agir.
            <br /><br />
            A pergunta é: você vai continuar perdendo dinheiro ou vai tomar decisões baseadas em números concretos?
          </p>

          <Button
            size="lg"
            className="h-16 px-12 text-xl bg-primary hover:bg-primary/90 text-primary-foreground mb-8"
            onClick={() => navigate("/auth")}
          >
            Começar Meu Teste Grátis de 7 Dias
          </Button>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">
            <span>✓ Acesso imediato</span>
            <span>✓ Sem cartão de crédito</span>
            <span>✓ Cancele quando quiser</span>
            <span>✓ Garantia de 30 dias</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-muted-foreground text-muted py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐑</span>
                <span className="text-lg font-bold text-background">Ponto do Cordeiro</span>
              </div>
              <p className="text-sm">
                Decisão inteligente para venda de cordeiros
              </p>
            </div>

            <div>
              <h4 className="font-bold text-background mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToPrecos()} className="hover:text-background transition-colors">Como Funciona</button></li>
                <li><button onClick={() => scrollToPrecos()} className="hover:text-background transition-colors">Preços</button></li>
                <li><button onClick={() => document.querySelector('.bg-muted')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-background transition-colors">FAQ</button></li>
                <li><button onClick={() => navigate("/auth")} className="hover:text-background transition-colors">Login</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-background mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-background transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-background transition-colors">LGPD</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-background mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">WhatsApp</a></li>
                <li><a href="mailto:contato@pontodocordeiro.com.br" className="hover:text-background transition-colors">Email</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted/20 pt-8 text-center text-sm">
            <p>Copyright © 2025 Ponto do Cordeiro</p>
            <p className="mt-2">Desenvolvido com ❤️ para o produtor rural</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
