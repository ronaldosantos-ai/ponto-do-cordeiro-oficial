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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Eye,
  Search,
  TrendingUp,
  TrendingDown,
  Scale,
  DollarSign
} from 'lucide-react';
import { initMockData, MockSimulacao } from '@/lib/mockAdminData';
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
  const mockData = useMemo(() => initMockData(), []);
  const [simulacoes] = useState(mockData.simulacoes);
  
  // Filters
  const [periodo, setPeriodo] = useState<string>('todos');
  const [decisaoFilter, setDecisaoFilter] = useState<string>('todas');
  const [buscaEmail, setBuscaEmail] = useState('');
  const [buscaAnimal, setBuscaAnimal] = useState('');
  
  // Modal
  const [selectedSim, setSelectedSim] = useState<MockSimulacao | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter simulations
  const filteredSimulacoes = useMemo(() => {
    let result = [...simulacoes];
    const now = new Date();

    // Period filter
    if (periodo === 'hoje') {
      const hoje = now.toISOString().split('T')[0];
      result = result.filter(s => s.criadoEm.startsWith(hoje));
    } else if (periodo === '7d') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(s => new Date(s.criadoEm) >= weekAgo);
    } else if (periodo === '30d') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(s => new Date(s.criadoEm) >= monthAgo);
    }

    // Decision filter
    if (decisaoFilter === 'vender') {
      result = result.filter(s => s.decisao === 'vender');
    } else if (decisaoFilter === 'segurar') {
      result = result.filter(s => s.decisao === 'segurar');
    }

    // Email search
    if (buscaEmail) {
      result = result.filter(s => 
        s.userEmail.toLowerCase().includes(buscaEmail.toLowerCase())
      );
    }

    // Animal search
    if (buscaAnimal) {
      result = result.filter(s => 
        s.identificacao.toLowerCase().includes(buscaAnimal.toLowerCase())
      );
    }

    return result;
  }, [simulacoes, periodo, decisaoFilter, buscaEmail, buscaAnimal]);

  // Calculate stats
  const stats = useMemo(() => {
    const vender = filteredSimulacoes.filter(s => s.decisao === 'vender').length;
    const segurar = filteredSimulacoes.filter(s => s.decisao === 'segurar').length;
    const total = filteredSimulacoes.length;
    const pesoMedio = total > 0 
      ? (filteredSimulacoes.reduce((acc, s) => acc + s.peso, 0) / total).toFixed(1)
      : 0;
    const lucroMedio = total > 0
      ? (filteredSimulacoes.reduce((acc, s) => acc + s.lucro, 0) / total).toFixed(2)
      : 0;

    return {
      total,
      vender,
      segurar,
      taxaVender: total > 0 ? ((vender / total) * 100).toFixed(1) : 0,
      taxaSegurar: total > 0 ? ((segurar / total) * 100).toFixed(1) : 0,
      pesoMedio,
      lucroMedio
    };
  }, [filteredSimulacoes]);

  const pieData = [
    { name: 'Vender', value: stats.vender, color: '#059669' },
    { name: 'Segurar', value: stats.segurar, color: '#DC2626' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Simulações</h1>
          <p className="text-muted-foreground">Todas as simulações do sistema</p>
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
              <CardTitle className="text-sm text-muted-foreground">Peso Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pesoMedio} kg</div>
              <p className="text-xs text-muted-foreground">por animal</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Lucro Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(Number(stats.lucroMedio))}</div>
              <p className="text-xs text-muted-foreground">por simulação</p>
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
                <Select value={decisaoFilter} onValueChange={setDecisaoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Decisão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="vender">Vender</SelectItem>
                    <SelectItem value="segurar">Segurar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email..."
                    value={buscaEmail}
                    onChange={(e) => setBuscaEmail(e.target.value)}
                    className="pl-10"
                  />
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Lucro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSimulacoes.slice(0, 50).map((sim) => (
                    <TableRow key={sim.id}>
                      <TableCell className="text-sm">
                        {format(new Date(sim.criadoEm), "dd/MM HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-sm truncate max-w-[150px]">
                        {sim.userEmail}
                      </TableCell>
                      <TableCell className="text-sm">{sim.identificacao}</TableCell>
                      <TableCell className="text-sm">{sim.peso} kg</TableCell>
                      <TableCell className="text-sm">{sim.dias}</TableCell>
                      <TableCell>
                        <Badge 
                          className={sim.decisao === 'vender' ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {sim.decisao === 'vender' ? (
                            <>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Vender
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Segurar
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className={sim.lucro >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(sim.lucro)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
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
                    <p className="font-mono text-sm">{selectedSim.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p>{format(new Date(selectedSim.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usuário</p>
                    <p className="text-sm">{selectedSim.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Animal</p>
                    <p>{selectedSim.identificacao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="flex items-center gap-1">
                      <Scale className="w-4 h-4" />
                      {selectedSim.peso} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dias</p>
                    <p>{selectedSim.dias} dias</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Decisão</p>
                    <Badge className={selectedSim.decisao === 'vender' ? 'bg-green-600' : 'bg-red-600'}>
                      {selectedSim.decisao === 'vender' ? 'Vender' : 'Segurar'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro</p>
                    <p className={`flex items-center gap-1 font-bold ${selectedSim.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(selectedSim.lucro)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
