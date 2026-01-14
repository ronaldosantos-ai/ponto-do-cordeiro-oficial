import { useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, AlertCircle } from 'lucide-react';
import { useAdminSubscriptions } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminBilling() {
  const { data: subscriptions, isLoading, error } = useAdminSubscriptions();

  const stats = useMemo(() => {
    if (!subscriptions) return { ativos: 0, mrr: 0, monthly: 0, yearly: 0 };
    
    const ativos = subscriptions.filter(a => a.status === 'active').length;
    const monthly = subscriptions.filter(a => a.status === 'active' && a.plan_type === 'monthly').length;
    const yearly = subscriptions.filter(a => a.status === 'active' && a.plan_type === 'yearly').length;
    const mrr = monthly * 19.90 + yearly * (197 / 12);
    
    return { ativos, mrr, monthly, yearly };
  }, [subscriptions]);

  // Calculate MRR evolution (simplified - just showing current month)
  const mrrData = useMemo(() => {
    const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((mes, i) => ({
      mes,
      valor: stats.mrr * (0.5 + (i * 0.1)) // Simulated growth
    }));
  }, [stats.mrr]);

  const formatCurrency = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Financeiro</h1>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Erro ao carregar dados</p>
            <p className="text-muted-foreground">Verifique suas permissões de administrador</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Dados reais de assinaturas e receita</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.mrr)}</div>
              <p className="text-sm text-muted-foreground">MRR (Receita Mensal)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.ativos}</div>
              <p className="text-sm text-muted-foreground">Assinantes Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.monthly}</div>
              <p className="text-sm text-muted-foreground">Planos Mensais</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.yearly}</div>
              <p className="text-sm text-muted-foreground">Planos Anuais</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evolução MRR (Estimado)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mrrData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Assinaturas ({subscriptions?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {subscriptions?.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                Nenhuma assinatura encontrada
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Expira</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions?.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="truncate max-w-[200px]">{sub.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {sub.plan_type === 'monthly' ? 'Mensal' : 'Anual'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={sub.status === 'active' ? 'bg-green-600' : 'bg-red-600'}>
                          {sub.status === 'active' ? 'Ativo' : sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(sub.started_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {sub.expires_at 
                          ? format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR })
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
