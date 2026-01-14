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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Search,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useAdminSimulations, AdminSimulation } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

export default function AdminSimulations() {
  const { data: simulations, isLoading, error } = useAdminSimulations();
  
  // Filters
  const [periodo, setPeriodo] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [buscaAnimal, setBuscaAnimal] = useState('');
  
  // Modal
  const [selectedSim, setSelectedSim] = useState<AdminSimulation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter simulations
  const filteredSimulacoes = useMemo(() => {
    if (!simulations) return [];
    let result = [...simulations];
    const now = new Date();

    // Period filter
    if (periodo === 'hoje') {
      const hoje = now.toISOString().split('T')[0];
      result = result.filter(s => s.created_at.startsWith(hoje));
    } else if (periodo === '7d') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(s => new Date(s.created_at) >= weekAgo);
    } else if (periodo === '30d') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(s => new Date(s.created_at) >= monthAgo);
    }

    // Type filter
    if (tipoFilter !== 'todos') {
      result = result.filter(s => s.tipo === tipoFilter);
    }

    // Animal search
    if (buscaAnimal) {
      result = result.filter(s => 
        s.identificacao?.toLowerCase().includes(buscaAnimal.toLowerCase())
      );
    }

    return result;
  }, [simulations, periodo, tipoFilter, buscaAnimal]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredSimulacoes.length;
    const mvp = filteredSimulacoes.filter(s => s.tipo === 'mvp').length;
    const premium = filteredSimulacoes.filter(s => s.tipo !== 'mvp').length;
    
    // Count decisions
    let vender = 0;
    let segurar = 0;
    filteredSimulacoes.forEach(s => {
      const resultado = s.resultado as Record<string, unknown>;
      const decisao = resultado?.decisao as string | undefined;
      if (decisao === 'vender') vender++;
      else if (decisao === 'segurar') segurar++;
    });

    return {
      total,
      mvp,
      premium,
      vender,
      segurar,
      taxaVender: total > 0 ? ((vender / total) * 100).toFixed(1) : '0',
    };
  }, [filteredSimulacoes]);

  const pieData = [
    { name: 'Vender', value: stats.vender, color: '#059669' },
    { name: 'Segurar', value: stats.segurar, color: '#DC2626' }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Simulações</h1>
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
            <p className="text-lg font-medium">Erro ao carregar simulações</p>
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
          <h1 className="text-2xl font-bold text-foreground">Simulações</h1>
          <p className="text-muted-foreground">Todas as simulações do sistema - Dados em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">simulações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Taxa Vender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.taxaVender}%</div>
              <p className="text-xs text-muted-foreground">{stats.vender} vendas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Tipo MVP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mvp}</div>
              <p className="text-xs text-muted-foreground">simulações gratuitas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Tipo Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.premium}</div>
              <p className="text-xs text-muted-foreground">simulações premium</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Filters Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Decisões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="mvp">MVP (Gratuito)</SelectItem>
                    <SelectItem value="custo_diario">Custo Diário</SelectItem>
                    <SelectItem value="projecao">Projeção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por animal..."
                  value={buscaAnimal}
                  onChange={(e) => setBuscaAnimal(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filteredSimulacoes.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="w-5 h-5 mr-2" />
                Nenhuma simulação encontrada
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Animal</TableHead>
                      <TableHead>Decisão</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSimulacoes.slice(0, 50).map((sim) => {
                      const resultado = sim.resultado as Record<string, unknown>;
                      const decisao = resultado?.decisao as string | undefined;
                      
                      return (
                        <TableRow key={sim.id}>
                          <TableCell className="text-sm">
                            {format(new Date(sim.created_at), "dd/MM HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-sm">
                            <Badge variant="outline">{sim.tipo}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{sim.identificacao || '-'}</TableCell>
                          <TableCell>
                            {decisao ? (
                              <Badge className={decisao === 'vender' ? 'bg-green-600' : 'bg-red-600'}>
                                {decisao === 'vender' ? (
                                  <><TrendingUp className="w-3 h-3 mr-1" />Vender</>
                                ) : (
                                  <><TrendingDown className="w-3 h-3 mr-1" />Segurar</>
                                )}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">-</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedSim(sim);
                                setShowDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Simulação</DialogTitle>
              <DialogDescription>
                Informações completas da simulação
              </DialogDescription>
            </DialogHeader>
            {selectedSim && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-mono text-xs truncate">{selectedSim.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p>{format(new Date(selectedSim.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <Badge variant="outline">{selectedSim.tipo}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Animal</p>
                    <p>{selectedSim.identificacao || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dados de Entrada</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedSim.dados, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Resultado</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedSim.resultado, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
