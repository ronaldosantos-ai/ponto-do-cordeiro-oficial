import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAdminAlerts } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminAlerts() {
  const { data: alertas, isLoading, error } = useAdminAlerts();
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  // Filter alerts
  const filteredAlertas = useMemo(() => {
    if (!alertas) return [];
    let result = [...alertas];

    // Status filter
    if (statusFilter === 'ativo') {
      result = result.filter(a => a.ativo);
    } else if (statusFilter === 'inativo') {
      result = result.filter(a => !a.ativo);
    }

    // Search
    if (busca) {
      const searchLower = busca.toLowerCase();
      result = result.filter(a => 
        a.identificacao_animal?.toLowerCase().includes(searchLower) ||
        a.mensagem?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [alertas, statusFilter, busca]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!alertas) return { ativos: 0, inativos: 0, total: 0 };
    
    const ativos = alertas.filter(a => a.ativo).length;
    const inativos = alertas.filter(a => !a.ativo).length;
    
    return { 
      ativos, 
      inativos, 
      total: alertas.length 
    };
  }, [alertas]);

  const getStatusBadge = (ativo: boolean) => {
    if (ativo) {
      return <Badge className="bg-green-600"><Bell className="w-3 h-3 mr-1" />Ativo</Badge>;
    }
    return <Badge variant="secondary"><BellOff className="w-3 h-3 mr-1" />Inativo</Badge>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestão de Alertas</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-16 mb-2" />
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
            <p className="text-lg font-medium">Erro ao carregar alertas</p>
            <p className="text-muted-foreground">Verifique suas permissões</p>
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
          <h1 className="text-2xl font-bold text-foreground">Gestão de Alertas</h1>
          <p className="text-muted-foreground">{stats.total} alertas no sistema - Dados em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total de Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-sm text-muted-foreground">Alertas Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{stats.inativos}</div>
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
                  placeholder="Buscar por animal ou mensagem..."
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filteredAlertas.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                Nenhum alerta encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data do Alerta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlertas.map((alerta) => (
                      <TableRow key={alerta.id}>
                        <TableCell className="text-sm">
                          {alerta.identificacao_animal || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          <Badge variant="outline">{alerta.tipo}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(alerta.data_alerta), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(alerta.ativo)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(alerta.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
