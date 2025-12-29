import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download } from 'lucide-react';
import { initMockData, MockLog } from '@/lib/mockAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogs() {
  const { toast } = useToast();
  const mockData = useMemo(() => initMockData(), []);
  const [logs] = useState(mockData.logs);
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const filteredLogs = useMemo(() => {
    let result = [...logs];
    if (tipoFilter !== 'todos') result = result.filter(l => l.tipo === tipoFilter);
    if (busca) result = result.filter(l => l.userEmail?.toLowerCase().includes(busca.toLowerCase()) || l.acao.toLowerCase().includes(busca.toLowerCase()));
    return result;
  }, [logs, tipoFilter, busca]);

  const getTipoBadge = (tipo: MockLog['tipo']) => {
    const config: Record<MockLog['tipo'], { label: string; className: string }> = {
      login_sucesso: { label: '🟢 Login', className: 'bg-green-600' },
      login_falha: { label: '🔴 Login Falhou', className: 'bg-red-600' },
      simulacao: { label: '🟡 Simulação', className: 'bg-yellow-600' },
      premium_ativado: { label: '🟢 Premium +', className: 'bg-green-600' },
      premium_cancelado: { label: '🔴 Premium -', className: 'bg-red-600' },
      erro: { label: '⚠️ Erro', className: 'bg-orange-600' }
    };
    const c = config[tipo];
    return <Badge className={c.className}>{c.label}</Badge>;
  };

  const handleExport = () => {
    const csv = filteredLogs.map(l => `${l.timestamp},${l.tipo},${l.userEmail || ''},${l.acao}`).join('\n');
    const blob = new Blob([`Timestamp,Tipo,Usuario,Acao\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'logs.csv'; a.click();
    toast({ title: 'Logs exportados', description: 'Arquivo CSV gerado' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl font-bold">Logs de Auditoria</h1><p className="text-muted-foreground">{logs.length} registros</p></div>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Exportar CSV</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" /></div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="login_sucesso">Login Sucesso</SelectItem>
                  <SelectItem value="login_falha">Login Falha</SelectItem>
                  <SelectItem value="simulacao">Simulação</SelectItem>
                  <SelectItem value="premium_ativado">Premium Ativado</SelectItem>
                  <SelectItem value="premium_cancelado">Premium Cancelado</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Tipo</TableHead><TableHead>Usuário</TableHead><TableHead>Ação</TableHead><TableHead>IP</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 50).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm font-mono">{format(new Date(log.timestamp), "dd/MM HH:mm:ss", { locale: ptBR })}</TableCell>
                    <TableCell>{getTipoBadge(log.tipo)}</TableCell>
                    <TableCell className="text-sm truncate max-w-[150px]">{log.userEmail || '-'}</TableCell>
                    <TableCell className="text-sm">{log.acao}</TableCell>
                    <TableCell className="text-sm font-mono">{log.ip || '-'}</TableCell>
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
