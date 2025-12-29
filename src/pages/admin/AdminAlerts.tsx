import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Eye,
  Search,
  Bell,
  BellOff,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { initMockData, MockAlerta } from '@/lib/mockAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function AdminAlerts() {
  const { toast } = useToast();
  const mockData = useMemo(() => initMockData(), []);
  const [alertas, setAlertas] = useState(mockData.alertas);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  
  // Delete confirmation
  const [alertToDelete, setAlertToDelete] = useState<MockAlerta | null>(null);

  // Filter alerts
  const filteredAlertas = useMemo(() => {
    let result = [...alertas];

    // Status filter
    if (statusFilter !== 'todos') {
      result = result.filter(a => a.status === statusFilter);
    }

    // Search
    if (busca) {
      const searchLower = busca.toLowerCase();
      result = result.filter(a => 
        a.userEmail.toLowerCase().includes(searchLower) ||
        a.identificacao.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [alertas, statusFilter, busca]);

  // Calculate stats
  const stats = useMemo(() => {
    const ativos = alertas.filter(a => a.status === 'ativo').length;
    const disparadosHoje = alertas.filter(a => {
      const hoje = new Date().toISOString().split('T')[0];
      return a.status === 'disparado' && a.dataAlerta === hoje;
    }).length;
    const concluidos = alertas.filter(a => a.status === 'disparado').length;
    const total = alertas.length;
    const taxaConclusao = total > 0 ? ((concluidos / total) * 100).toFixed(1) : 0;

    return { ativos, disparadosHoje, concluidos, taxaConclusao };
  }, [alertas]);

  const handleToggleStatus = (alerta: MockAlerta) => {
    const newStatus = alerta.status === 'ativo' ? 'inativo' : 'ativo';
    setAlertas(prev => prev.map(a => 
      a.id === alerta.id ? { ...a, status: newStatus } : a
    ));
    toast({
      title: newStatus === 'ativo' ? 'Alerta ativado' : 'Alerta desativado',
      description: `Alerta para ${alerta.identificacao} atualizado`
    });
  };

  const handleDelete = () => {
    if (alertToDelete) {
      setAlertas(prev => prev.filter(a => a.id !== alertToDelete.id));
      toast({
        title: 'Alerta deletado',
        description: `Alerta para ${alertToDelete.identificacao} foi removido`
      });
      setAlertToDelete(null);
    }
  };

  const getStatusBadge = (status: MockAlerta['status']) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-600"><Bell className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary"><BellOff className="w-3 h-3 mr-1" />Inativo</Badge>;
      case 'disparado':
        return <Badge className="bg-blue-600"><CheckCircle className="w-3 h-3 mr-1" />Disparado</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Alertas</h1>
          <p className="text-muted-foreground">{alertas.length} alertas no sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Disparados Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.disparadosHoje}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.concluidos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taxaConclusao}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por usuário ou animal..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                  <SelectItem value="disparado">Disparados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Data do Alerta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlertas.map((alerta) => (
                    <TableRow key={alerta.id}>
                      <TableCell className="text-sm truncate max-w-[150px]">
                        {alerta.userEmail}
                      </TableCell>
                      <TableCell className="text-sm">{alerta.identificacao}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(alerta.dataAlerta), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(alerta.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(alerta.criadoEm), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(alerta)}
                            disabled={alerta.status === 'disparado'}
                          >
                            {alerta.status === 'ativo' ? (
                              <BellOff className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setAlertToDelete(alerta)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        <AlertDialog open={!!alertToDelete} onOpenChange={() => setAlertToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar o alerta para {alertToDelete?.identificacao}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
