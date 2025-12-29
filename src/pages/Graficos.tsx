import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  Scale, 
  PieChart as PieChartIcon,
  AlertCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Button } from "@/components/ui/button";
import { HistoricoItem, obterHistorico, verificarPremium } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";

type FiltroPeriodo = 7 | 30 | 90 | 'todos';

const filtros: { label: string; value: FiltroPeriodo }[] = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "Todos", value: 'todos' },
];

// Funções de preparação de dados
function prepararDadosGraficoLucro(historico: HistoricoItem[], dias: FiltroPeriodo) {
  let filtrado = historico;
  
  if (dias !== 'todos') {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    filtrado = historico.filter(item => 
      new Date(item.timestamp) >= dataLimite
    );
  }
  
  const agrupado = filtrado.reduce((acc, item) => {
    const data = new Date(item.timestamp).toLocaleDateString('pt-BR');
    
    if (!acc[data]) {
      acc[data] = {
        data,
        lucroTotal: 0,
        quantidade: 0
      };
    }
    
    acc[data].lucroTotal += item.resultado.lucroAtual || 0;
    acc[data].quantidade += 1;
    
    return acc;
  }, {} as Record<string, { data: string; lucroTotal: number; quantidade: number }>);
  
  return Object.values(agrupado).sort((a, b) => {
    return new Date(a.data.split('/').reverse().join('-')).getTime() - 
           new Date(b.data.split('/').reverse().join('-')).getTime();
  });
}

function prepararDadosGraficoPizza(historico: HistoricoItem[]) {
  const vender = historico.filter(item => item.resultado.decisao === 'vender').length;
  const segurar = historico.filter(item => item.resultado.decisao === 'segurar').length;
  
  return [
    { name: 'Vender', value: vender, color: 'hsl(var(--primary))' },
    { name: 'Segurar', value: segurar, color: 'hsl(var(--destructive))' }
  ];
}

function prepararDadosGraficoPeso(historico: HistoricoItem[], dias: FiltroPeriodo) {
  let filtrado = historico;
  
  if (dias !== 'todos') {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    filtrado = historico.filter(item => 
      new Date(item.timestamp) >= dataLimite
    );
  }
  
  const agrupado = filtrado.reduce((acc, item) => {
    const data = new Date(item.timestamp).toLocaleDateString('pt-BR');
    
    if (!acc[data]) {
      acc[data] = {
        data,
        pesoTotal: 0,
        quantidade: 0
      };
    }
    
    acc[data].pesoTotal += item.dados.peso || 0;
    acc[data].quantidade += 1;
    
    return acc;
  }, {} as Record<string, { data: string; pesoTotal: number; quantidade: number }>);
  
  return Object.values(agrupado).map((item) => ({
    data: item.data,
    pesoMedio: item.pesoTotal / item.quantidade
  })).sort((a, b) => {
    return new Date(a.data.split('/').reverse().join('-')).getTime() - 
           new Date(b.data.split('/').reverse().join('-')).getTime();
  });
}

function prepararDadosGraficoBarras(historico: HistoricoItem[]) {
  return historico
    .slice(0, 10)
    .reverse()
    .map((item, index) => ({
      nome: item.identificacao || `Sim ${index + 1}`,
      custo: item.resultado.custoTotal || 0,
      receita: item.resultado.receitaAtual || 0
    }));
}

const Graficos = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [periodo, setPeriodo] = useState<FiltroPeriodo>(30);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Verificar acesso Premium e autenticação
  useEffect(() => {
    if (!verificarPremium()) {
      navigate('/premium-info');
      return;
    }
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [navigate, user, authLoading]);

  // Carregar histórico
  useEffect(() => {
    async function carregar() {
      if (!user) return;
      setCarregando(true);
      const dados = await obterHistorico();
      setHistorico(dados);
      setCarregando(false);
    }
    carregar();
  }, [user]);

  // Se não for premium ou não autenticado, mostrar loading
  if (!verificarPremium() || authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Preparar dados dos gráficos
  const dadosLucro = prepararDadosGraficoLucro(historico, periodo);
  const dadosPizza = prepararDadosGraficoPizza(historico);
  const dadosPeso = prepararDadosGraficoPeso(historico, periodo);
  const dadosBarras = prepararDadosGraficoBarras(historico);

  // Calcular métricas
  const totalSimulacoes = historico.length;
  const lucroTotal = historico.reduce((acc, item) => acc + (item.resultado.lucroAtual || 0), 0);
  const pesoMedioGeral = historico.length > 0 
    ? historico.reduce((acc, item) => acc + (item.dados.peso || 0), 0) / historico.length 
    : 0;
  const taxaVenda = historico.length > 0 
    ? (historico.filter(item => item.resultado.decisao === 'vender').length / historico.length) * 100 
    : 0;

  return (
    <div className="page-container pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/historico')}
            className="p-2 hover:bg-secondary h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Evolução</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold text-sm">
            ⭐ Premium
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="h-10 w-10 rounded-full"
          >
            👤
          </Button>
        </div>
      </header>

      {/* Seletor de período */}
      <div className="flex gap-2 mb-6">
        {filtros.map((f) => (
          <Button
            key={f.value}
            variant={periodo === f.value ? "default" : "outline"}
            size="lg"
            onClick={() => setPeriodo(f.value)}
            className={`flex-1 h-12 ${
              periodo === f.value
                ? "bg-primary hover:bg-primary/90" 
                : "hover:bg-secondary"
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Aviso de poucos dados */}
      {!carregando && historico.length > 0 && historico.length < 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Poucos dados disponíveis
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Faça mais simulações para ter análises mais completas
              </p>
            </div>
          </div>
        </div>
      )}

      {carregando ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : historico.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Sem dados disponíveis</h3>
          <p className="text-muted-foreground text-sm mb-4">Faça simulações para ver os gráficos</p>
          <Button onClick={() => navigate('/premium')} className="bg-primary hover:bg-primary/90">
            Fazer simulação
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards de resumo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalSimulacoes}</p>
              <p className="text-xs text-muted-foreground">simulações realizadas</p>
            </div>

            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Lucro</span>
              </div>
              <p className={`text-2xl font-bold ${lucroTotal >= 0 ? 'text-primary' : 'text-destructive'}`}>
                R$ {lucroTotal.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">lucro total projetado</p>
            </div>

            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-amber-500" />
                <span className="text-xs text-muted-foreground">Peso</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{pesoMedioGeral.toFixed(0)} kg</p>
              <p className="text-xs text-muted-foreground">peso médio dos animais</p>
            </div>

            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-muted-foreground">Decisão</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{taxaVenda.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">sugestões de venda</p>
            </div>
          </div>

          {/* Gráfico de Lucro */}
          {dadosLucro.length > 0 ? (
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Evolução do Lucro</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dadosLucro}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="data" 
                    style={{ fontSize: '10px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    style={{ fontSize: '10px' }}
                    tickFormatter={(valor) => `R$ ${valor.toFixed(0)}`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    formatter={(valor: number) => [`R$ ${valor.toFixed(2)}`, 'Lucro']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="lucroTotal" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Lucro Total"
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-card p-6 rounded-lg border text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Sem dados suficientes para o período</p>
            </div>
          )}

          {/* Grid com Pizza e Peso */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Decisões Tomadas</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Peso */}
            {dadosPeso.length > 0 ? (
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Peso Médio dos Animais</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dadosPeso}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="data" 
                      style={{ fontSize: '10px' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      style={{ fontSize: '10px' }}
                      tickFormatter={(valor) => `${valor.toFixed(0)} kg`}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      formatter={(valor: number) => [`${valor.toFixed(1)} kg`, 'Peso Médio']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pesoMedio" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Peso Médio"
                      dot={{ fill: '#F59E0B', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-card p-6 rounded-lg border text-center">
                <Scale className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Sem dados de peso para o período</p>
              </div>
            )}
          </div>

          {/* Gráfico de Barras */}
          {dadosBarras.length > 0 && (
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Custo vs Receita (Últimas 10)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosBarras}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="nome" 
                    style={{ fontSize: '9px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    style={{ fontSize: '10px' }}
                    tickFormatter={(valor) => `R$ ${valor.toFixed(0)}`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    formatter={(valor: number) => `R$ ${valor.toFixed(2)}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="custo" fill="hsl(var(--destructive))" name="Custo" />
                  <Bar dataKey="receita" fill="hsl(var(--primary))" name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Graficos;
