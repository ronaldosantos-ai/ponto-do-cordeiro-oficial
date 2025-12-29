import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  TrendingUp,
  Crown,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { initMockData } from '@/lib/mockAdminData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const mockData = useMemo(() => initMockData(), []);
  const { users, simulacoes, estatisticas } = mockData;

  // Últimas 10 simulações
  const ultimasSimulacoes = simulacoes.slice(0, 10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do Ponto do Cordeiro</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Usuários */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground mt-1">
                usuários cadastrados
              </p>
              <p className="text-xs text-green-600 mt-1">
                +3 esta semana
              </p>
            </CardContent>
          </Card>

          {/* Simulações Hoje */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Simulações Hoje
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.simulacoesHoje}</div>
              <p className="text-xs text-muted-foreground mt-1">
                simulações hoje
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total: {estatisticas.totalSimulacoes} simulações
              </p>
            </CardContent>
          </Card>

          {/* Usuários Premium */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuários Premium
              </CardTitle>
              <Crown className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.usuariosPremium}</div>
              <p className="text-xs text-muted-foreground mt-1">
                assinantes ativos
              </p>
              <p className="text-xs text-green-600 mt-1">
                {estatisticas.percentualPremium}% do total
              </p>
            </CardContent>
          </Card>

          {/* Receita Mensal */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Mensal
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(estatisticas.mrr)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                receita recorrente
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(estatisticas.arr)}/ano
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Simulações */}
        <Card>
          <CardHeader>
            <CardTitle>Simulações nos últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={estatisticas.simulacoesPorDia}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="dia" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Últimas Atividades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas Atividades</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/simulations')}>
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Animal</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Decisão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasSimulacoes.map((sim) => (
                  <TableRow key={sim.id}>
                    <TableCell className="text-sm">
                      {format(new Date(sim.criadoEm), "dd/MM HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm truncate max-w-[150px]">
                      {sim.userEmail}
                    </TableCell>
                    <TableCell className="text-sm">{sim.identificacao}</TableCell>
                    <TableCell className="text-sm">{sim.peso} kg</TableCell>
                    <TableCell>
                      <Badge 
                        variant={sim.decisao === 'vender' ? 'default' : 'destructive'}
                        className={sim.decisao === 'vender' ? 'bg-green-600' : ''}
                      >
                        {sim.decisao === 'vender' ? 'Vender' : 'Segurar'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/admin/users')}>
            <Users className="w-4 h-4 mr-2" />
            Ver todos usuários
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/settings')}>
            Configurações
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/exports')}>
            Exportar dados
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
