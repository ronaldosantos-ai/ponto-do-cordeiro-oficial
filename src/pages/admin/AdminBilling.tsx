import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { initMockData } from '@/lib/mockAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

export default function AdminBilling() {
  const { toast } = useToast();
  const mockData = useMemo(() => initMockData(), []);
  const [assinaturas] = useState(mockData.assinaturas);
  const [precoMensal, setPrecoMensal] = useState('19.90');
  const [precoAnual, setPrecoAnual] = useState('197.00');

  const stats = useMemo(() => {
    const ativos = assinaturas.filter(a => a.status === 'ativo').length;
    const mrr = assinaturas.filter(a => a.status === 'ativo' && a.plano === 'mensal').length * 19.90;
    return { ativos, mrr, churn: '2.5' };
  }, [assinaturas]);

  const mrrData = [
    { mes: 'Jul', valor: 150 }, { mes: 'Ago', valor: 180 }, { mes: 'Set', valor: 200 },
    { mes: 'Out', valor: 220 }, { mes: 'Nov', valor: 250 }, { mes: 'Dez', valor: stats.mrr }
  ];

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleSavePrices = () => {
    localStorage.setItem('admin_preco_mensal', precoMensal);
    localStorage.setItem('admin_preco_anual', precoAnual);
    toast({ title: 'Preços salvos', description: 'Configurações atualizadas' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Financeiro</h1><p className="text-muted-foreground">Gestão de receita e assinaturas</p></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{formatCurrency(stats.mrr)}</div><p className="text-sm text-muted-foreground">MRR</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.ativos}</div><p className="text-sm text-muted-foreground">Assinantes Ativos</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">3</div><p className="text-sm text-muted-foreground">Novos este mês</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.churn}%</div><p className="text-sm text-muted-foreground">Churn Rate</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Evolução MRR</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Configurar Preços</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-muted-foreground">Premium Mensal (R$)</label><Input value={precoMensal} onChange={e => setPrecoMensal(e.target.value)} /></div>
              <div><label className="text-sm text-muted-foreground">Premium Anual (R$)</label><Input value={precoAnual} onChange={e => setPrecoAnual(e.target.value)} /></div>
            </div>
            <Button onClick={handleSavePrices}>Salvar Preços</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assinaturas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Plano</TableHead><TableHead>Status</TableHead><TableHead>Início</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
              <TableBody>
                {assinaturas.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="truncate max-w-[150px]">{a.userEmail}</TableCell>
                    <TableCell><Badge variant="secondary">{a.plano}</Badge></TableCell>
                    <TableCell><Badge className={a.status === 'ativo' ? 'bg-green-600' : 'bg-red-600'}>{a.status}</Badge></TableCell>
                    <TableCell>{format(new Date(a.inicio), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>{formatCurrency(a.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
