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
  Crown,
  User,
  AlertCircle,
  Users
} from 'lucide-react';
import { useAdminSubscriptions, useAdminUserRoles } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminUsers() {
  const { data: subscriptions, isLoading: loadingSubs } = useAdminSubscriptions();
  const { data: userRoles, isLoading: loadingRoles } = useAdminUserRoles();
  
  // Filters
  const [busca, setBusca] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const isLoading = loadingSubs || loadingRoles;

  // Create user list from subscriptions (since we can't access auth.users)
  const users = useMemo(() => {
    if (!subscriptions) return [];
    
    // Deduplicate by email
    const emailMap = new Map<string, {
      email: string;
      user_id: string | null;
      isPremium: boolean;
      subscription_status: string;
      plan_type: string;
      expires_at: string | null;
      started_at: string;
      isAdmin: boolean;
    }>();
    
    subscriptions.forEach(sub => {
      const existing = emailMap.get(sub.email);
      const isActive = sub.status === 'active';
      
      // Keep the most recent or active subscription
      if (!existing || (isActive && existing.subscription_status !== 'active')) {
        emailMap.set(sub.email, {
          email: sub.email,
          user_id: sub.user_id,
          isPremium: isActive,
          subscription_status: sub.status,
          plan_type: sub.plan_type,
          expires_at: sub.expires_at,
          started_at: sub.started_at,
          isAdmin: userRoles?.some(r => r.user_id === sub.user_id && r.role === 'admin') ?? false,
        });
      }
    });
    
    return Array.from(emailMap.values());
  }, [subscriptions, userRoles]);

  // Filter users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (busca) {
      const searchLower = busca.toLowerCase();
      result = result.filter(u => u.email.toLowerCase().includes(searchLower));
    }

    // Status filter
    if (statusFilter === 'premium') {
      result = result.filter(u => u.isPremium);
    } else if (statusFilter === 'inativo') {
      result = result.filter(u => !u.isPremium);
    } else if (statusFilter === 'admin') {
      result = result.filter(u => u.isAdmin);
    }

    return result;
  }, [users, busca, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      premium: users.filter(u => u.isPremium).length,
      admins: users.filter(u => u.isAdmin).length,
    };
  }, [users]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">
            {stats.total} usuários com assinatura - Dados em tempo real
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total de usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.premium}</div>
              <p className="text-sm text-muted-foreground">Usuários Premium</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
              <p className="text-sm text-muted-foreground">Administradores</p>
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
                  placeholder="Buscar por email..."
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
                  <SelectItem value="premium">Premium Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                Nenhum usuário encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={`${user.email}-${index}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm truncate max-w-[200px]">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.isPremium ? (
                            <Badge className="bg-yellow-500">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.plan_type === 'monthly' ? 'Mensal' : 'Anual'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(user.started_at), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.expires_at 
                            ? format(new Date(user.expires_at), "dd/MM/yyyy", { locale: ptBR })
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {user.isAdmin ? (
                            <Badge className="bg-blue-600">Admin</Badge>
                          ) : (
                            <Badge variant="outline">User</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note about limitations */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Nota: Esta lista mostra apenas usuários com registro de assinatura. 
              Usuários que nunca assinaram não aparecem aqui por limitações de acesso à tabela de autenticação.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
