import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { initMockData } from '@/lib/mockAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

export default function AdminExports() {
  const { toast } = useToast();
  const mockData = useMemo(() => initMockData(), []);
  const [exportacoes] = useState(mockData.exportacoes);

  const stats = useMemo(() => {
    const csv = exportacoes.filter(e => e.tipo === 'CSV').length;
    const pdf = exportacoes.filter(e => e.tipo === 'PDF').length;
    const json = exportacoes.filter(e => e.tipo === 'JSON').length;
    const hoje = new Date().toISOString().split('T')[0];
    const exportacoesHoje = exportacoes.filter(e => e.criadoEm.startsWith(hoje)).length;
    return { total: exportacoes.length, csv, pdf, json, exportacoesHoje };
  }, [exportacoes]);

  const chartData = [
    { tipo: 'CSV', total: stats.csv },
    { tipo: 'PDF', total: stats.pdf },
    { tipo: 'JSON', total: stats.json },
  ];

  const handleExportAll = () => {
    toast({ title: 'Exportação iniciada', description: 'Gerando backup completo...' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Controle de Exportações</h1>
            <p className="text-muted-foreground">{stats.total} exportações realizadas</p>
          </div>
          <Button onClick={handleExportAll}><Download className="w-4 h-4 mr-2" />Backup Completo</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.total}</div><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.csv}</div><p className="text-sm text-muted-foreground">CSV</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.pdf}</div><p className="text-sm text-muted-foreground">PDF</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.json}</div><p className="text-sm text-muted-foreground">JSON</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Exportações por Tipo</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportacoes.slice(0, 20).map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>{format(new Date(exp.criadoEm), "dd/MM HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell className="truncate max-w-[150px]">{exp.userEmail}</TableCell>
                    <TableCell><Badge variant="secondary">{exp.tipo}</Badge></TableCell>
                    <TableCell>{exp.tamanho}</TableCell>
                    <TableCell><Badge className={exp.status === 'concluido' ? 'bg-green-600' : 'bg-red-600'}>{exp.status}</Badge></TableCell>
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
