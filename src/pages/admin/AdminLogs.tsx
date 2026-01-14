import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, AlertCircle, Shield, UserPlus, UserMinus } from 'lucide-react';
import { useAdminRoleAudit } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogs() {
  const { toast } = useToast();
  const { data: auditLogs, isLoading, error } = useAdminRoleAudit();
  const [actionFilter, setActionFilter] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const filteredLogs = useMemo(() => {
    if (!auditLogs) return [];
    let result = [...auditLogs];
    
    if (actionFilter !== 'todos') {
      result = result.filter(l => l.action === actionFilter);
    }
    
    if (busca) {
      const searchLower = busca.toLowerCase();
      result = result.filter(l => 
        l.user_id.toLowerCase().includes(searchLower) ||
        l.role.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  }, [auditLogs, actionFilter, busca]);

  const getActionBadge = (action: string) => {
    if (action === 'INSERT') {
      return (
        <Badge className="bg-green-600">
          <UserPlus className="w-3 h-3 mr-1" />
          Role Adicionada
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-600">
        <UserMinus className="w-3 h-3 mr-1" />
        Role Removida
      </Badge>
    );
  };

  const handleExport = () => {
    if (!filteredLogs.length) {
      toast({ title: 'Sem dados', description: 'Nenhum log para exportar' });
      return;
    }
    
    const csv = filteredLogs.map(l => 
      `${l.performed_at},${l.action},${l.user_id},${l.role},${l.performed_by || 'system'}`
    ).join('\n');
    
    const blob = new Blob([`Timestamp,Ação,UserID,Role,ExecutadoPor\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = 'role_audit_logs.csv'; 
    a.click();
    
    toast({ title: 'Logs exportados', description: 'Arquivo CSV gerado com sucesso' });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Logs de Auditoria</h1>
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))}
            </CardContent>
          </Card>
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
            <p className="text-lg font-medium">Erro ao carregar logs</p>
            <p className="text-muted-foreground">Verifique suas permissões de administrador</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Logs de Auditoria de Roles
            </h1>
            <p className="text-muted-foreground">
              {auditLogs?.length ?? 0} registros - Dados em tempo real
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{auditLogs?.length ?? 0}</div>
              <p className="text-sm text-muted-foreground">Total de registros</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {auditLogs?.filter(l => l.action === 'INSERT').length ?? 0}
              </div>
              <p className="text-sm text-muted-foreground">Roles adicionadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {auditLogs?.filter(l => l.action === 'DELETE').length ?? 0}
              </div>
              <p className="text-sm text-muted-foreground">Roles removidas</p>
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
                  placeholder="Buscar por user ID ou role..." 
                  value={busca} 
                  onChange={e => setBusca(e.target.value)} 
                  className="pl-10" 
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="INSERT">Role Adicionada</SelectItem>
                  <SelectItem value="DELETE">Role Removida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                Nenhum log de auditoria encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Executado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.slice(0, 50).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-mono">
                        {format(new Date(log.performed_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="text-sm font-mono truncate max-w-[150px]">
                        {log.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {log.performed_by ? `${log.performed_by.substring(0, 8)}...` : 'Sistema'}
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
