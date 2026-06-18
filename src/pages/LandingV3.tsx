import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";

const LandingV3 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full mb-6">
            <TrendingUp className="w-4 h-4" />
            Gestor de Cria de Cordeiros
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Saiba exatamente se seu cordeiro <span className="text-green-600">está dando lucro</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Controle seu rebanho, calcule custos e maximize o lucro da sua criação. 
            A ferramenta feita por criadores para criadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-7 bg-green-600 hover:bg-green-700" asChild>
              <a href="/simulador">Experimentar Grátis</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-7">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Por que criadores estão escolhendo o Ponto do Cordeiro?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-8">
                <DollarSign className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Controle Financeiro</h3>
                <p className="text-gray-600">Saiba o custo real por animal e identifique quais estão gerando prejuízo antes que seja tarde.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8">
                <Users className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Gestão do Rebanho</h3>
                <p className="text-gray-600">Cadastre lotes, acompanhe peso, idade, raça e histórico de cada animal de forma simples.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8">
                <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">Aumente seu Lucro</h3>
                <p className="text-gray-600">Previsões de lucratividade e relatórios claros para tomar as melhores decisões.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-green-600 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Pronto para lucrar mais com sua criação?</h2>
          <p className="text-xl mb-10">Milhares de produtores já estão usando. Comece agora mesmo.</p>
          <Button size="lg" variant="secondary" className="text-lg px-10 py-7" asChild>
            <a href="/simulador">Acessar o Sistema Gratuitamente →</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingV3;
