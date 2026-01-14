import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminData';
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
  const { stats, simulationsPerDay, isLoading, simulations } = useAdminStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get last 10 simulations
  const ultimasSimulacoes = simulations?.slice(0, 10) ?? [];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do Ponto do Cordeiro - Dados em tempo real</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Assinantes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Assinaturas
              </CardTitle>
              <Users className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSubscriptions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                registradas no sistema
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
              <div className="text-3xl font-bold">{stats.simulationsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                simulações hoje
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total: {stats.totalSimulations} simulações
              </p>
            </CardContent>
          </Card>

          {/* Assinantes Ativos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assinantes Ativos
              </CardTitle>
              <Crown className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                assinaturas ativas
              </p>
              <p className="text-xs text-green-600 mt-1">
                {stats.monthlySubscriptions} mensais, {stats.yearlySubscriptions} anuais
              </p>
            </CardContent>
          </Card>

          {/* Receita Mensal */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Mensal (MRR)
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.mrr)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                receita recorrente
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.mrr * 12)}/ano estimado
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
                <LineChart data={simulationsPerDay}>
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
            <CardTitle>Últimas Simulações</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/simulations')}>
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {ultimasSimulacoes.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                Nenhuma simulação encontrada
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Decisão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ultimasSimulacoes.map((sim) => {
                    const resultado = sim.resultado as Record<string, unknown>;
                    const decisao = resultado?.decisao as string | undefined;
                    
                    return (
                      <TableRow key={sim.id}>
                        <TableCell className="text-sm">
                          {format(new Date(sim.created_at), "dd/MM HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-sm">{sim.tipo}</TableCell>
                        <TableCell className="text-sm">{sim.identificacao || '-'}</TableCell>
                        <TableCell>
                          {decisao ? (
                            <Badge 
                              variant={decisao === 'vender' ? 'default' : 'destructive'}
                              className={decisao === 'vender' ? 'bg-green-600' : ''}
                            >
                              {decisao === 'vender' ? 'Vender' : 'Segurar'}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">-</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/admin/billing')}>
            <Crown className="w-4 h-4 mr-2" />
            Ver assinaturas
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/simulations')}>
            Ver simulações
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/logs')}>
            Ver logs de auditoria
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
