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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Edit,
  XCircle,
  Trash2,
  Search,
  Crown,
  User
} from 'lucide-react';
import { initMockData, MockUser } from '@/lib/mockAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const { toast } = useToast();
  const mockData = useMemo(() => initMockData(), []);
  const [users, setUsers] = useState(mockData.users);
  
  // Filters
  const [busca, setBusca] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [ordenar, setOrdenar] = useState<string>('recente');
  
  // Modals
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<MockUser | null>(null);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (busca) {
      const searchLower = busca.toLowerCase();
      result = result.filter(
        u => u.nome.toLowerCase().includes(searchLower) || 
             u.email.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter === 'premium') {
      result = result.filter(u => u.isPremium);
    } else if (statusFilter === 'gratuito') {
      result = result.filter(u => !u.isPremium);
    }

    // Sort
    if (ordenar === 'recente') {
      result.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
    } else if (ordenar === 'nome') {
      result.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenar === 'email') {
      result.sort((a, b) => a.email.localeCompare(b.email));
    }

    return result;
  }, [users, busca, statusFilter, ordenar]);

  const handleTogglePremium = (user: MockUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, isPremium: !u.isPremium } : u
    ));
    toast({
      title: user.isPremium ? 'Premium desativado' : 'Premium ativado',
      description: `Status de ${user.nome} atualizado`
    });
    setShowDetails(false);
  };

  const handleDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      toast({
        title: 'Usuário deletado',
        description: `${userToDelete.nome} foi removido`
      });
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      setShowDetails(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground">{users.length} usuários cadastrados</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
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
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="gratuito">Gratuito</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ordenar} onValueChange={setOrdenar}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recente">Mais recente</SelectItem>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead>Simulações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{user.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        {user.isPremium ? (
                          <Badge className="bg-yellow-500">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(user.criadoEm), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(user.ultimaAtividade), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-sm">{user.totalSimulacoes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePremium(user)}
                          >
                            {user.isPremium ? (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteConfirm(true);
                            }}
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

        {/* User Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                Informações completas da conta
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedUser.nome}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {selectedUser.isPremium ? 'Premium' : 'Gratuito'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Simulações</p>
                    <p className="font-medium">{selectedUser.totalSimulacoes}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cadastrado em</p>
                    <p className="font-medium">
                      {format(new Date(selectedUser.criadoEm), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última atividade</p>
                    <p className="font-medium">
                      {format(new Date(selectedUser.ultimaAtividade), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant={selectedUser?.isPremium ? 'destructive' : 'default'}
                onClick={() => selectedUser && handleTogglePremium(selectedUser)}
              >
                {selectedUser?.isPremium ? 'Desativar Premium' : 'Ativar Premium'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedUser) {
                    setUserToDelete(selectedUser);
                    setShowDeleteConfirm(true);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar conta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar a conta de {userToDelete?.nome}? 
                Esta ação não pode ser desfeita.
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
