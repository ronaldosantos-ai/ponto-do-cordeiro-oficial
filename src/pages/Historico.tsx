import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, FileQuestion, RefreshCw, Search, Loader2, CalendarIcon, Settings } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HistoricoItem, obterHistorico, deletarItem, limparHistorico, verificarPremium } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type FiltroTipo = 7 | 30 | 90 | 120 | 'todos';

const filtros: { label: string; value: FiltroTipo }[] = [
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
  { label: "120 dias", value: 120 },
  { label: "Todos", value: 'todos' },
];

const Historico = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // TODOS os useState devem vir ANTES de qualquer return
  const [filtro, setFiltro] = useState<FiltroTipo>(7);
  const [busca, setBusca] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarHistorico = async (mostrarToast = false) => {
    if (!user) return;
    
    try {
      setCarregando(true);
      const todos = await obterHistorico();
      
      let filtrados = todos;
      
      // Filtrar por data selecionada no calendário (prioridade)
      if (dataSelecionada) {
        const inicioDia = new Date(dataSelecionada);
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date(dataSelecionada);
        fimDia.setHours(23, 59, 59, 999);
        
        filtrados = filtrados.filter(item => {
          const dataItem = new Date(item.timestamp);
          return dataItem >= inicioDia && dataItem <= fimDia;
        });
      } else if (filtro !== 'todos') {
        // Filtrar por dias (apenas se não tiver data selecionada)
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - filtro);
        filtrados = filtrados.filter(item => 
          new Date(item.timestamp) >= dataLimite
        );
      }
      
      // Filtrar por busca
      if (busca.trim()) {
        filtrados = filtrados.filter(item =>
          item.identificacao?.toLowerCase().includes(busca.toLowerCase())
        );
      }
      
      setHistorico(filtrados);
      
      if (mostrarToast) {
        toast({
          title: "🔄 Sincronizado",
          description: `${filtrados.length} simulação(ões) encontrada(s)`
        });
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast({
        title: "❌ Erro ao sincronizar",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  };

  // Verificar acesso Premium e autenticação
  useEffect(() => {
    if (!verificarPremium()) {
      navigate('/premium-info');
      return;
    }
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [navigate, user, authLoading]);

  // Carregar histórico ao montar e quando filtros mudam
  useEffect(() => {
    if (user) {
      carregarHistorico();
    }
  }, [filtro, busca, dataSelecionada, user]);

  // Recarregar dados quando a página fica visível novamente
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        carregarHistorico();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [filtro, busca, user]);

  // Se não for premium ou não autenticado, mostrar loading
  if (!verificarPremium() || authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deletarItem(id);
      await carregarHistorico();
      toast({ title: "✅ Item deletado" });
    } catch (error) {
      toast({ 
        title: "❌ Erro ao deletar",
        variant: "destructive" 
      });
    }
  };

  const handleLimparTudo = async () => {
    try {
      await limparHistorico();
      await carregarHistorico();
      toast({ title: "✅ Histórico limpo" });
    } catch (error) {
      toast({ 
        title: "❌ Erro ao limpar",
        variant: "destructive" 
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  };
  
  const handleSelectDate = (date: Date | undefined) => {
    setDataSelecionada(date);
    if (date) {
      setFiltro('todos'); // Limpar filtro de dias quando seleciona data
    }
  };
  
  const limparDataSelecionada = () => {
    setDataSelecionada(undefined);
  };

  // Calcular resumo
  const lucroTotal = historico.reduce((acc, item) => {
    return acc + (item.resultado.lucroAtual || 0);
  }, 0);
  const quantidadeSimulacoes = historico.length;

  return (
    <div className="page-container pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/premium')}
          className="p-2 hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="h-9 w-9"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => carregarHistorico(true)}
            disabled={carregando}
            className="p-2 hover:bg-secondary"
            title="Sincronizar histórico"
          >
            {carregando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold text-sm">
            ⭐ Premium
          </span>
        </div>
      </header>

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Histórico de Simulações</h1>
      </div>

      {/* Campo de busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome do animal..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="h-12 pl-10"
        />
      </div>

      {/* Filtros: calendário e botões rápidos */}
      <div className="space-y-3 mb-4">
        {/* Seletor de data com calendário */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal h-12",
                  dataSelecionada && "border-blue-600 bg-blue-50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataSelecionada 
                  ? format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  : "Buscar por data específica"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataSelecionada}
                onSelect={handleSelectDate}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {dataSelecionada && (
            <Button
              variant="ghost"
              size="sm"
              onClick={limparDataSelecionada}
              className="h-12 px-3 text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          )}
        </div>
        
        {/* Filtros rápidos por período */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filtros.map((f) => (
            <Button
              key={f.value}
              variant={filtro === f.value && !dataSelecionada ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFiltro(f.value);
                setDataSelecionada(undefined);
              }}
              className={cn(
                "whitespace-nowrap",
                filtro === f.value && !dataSelecionada
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "hover:bg-secondary"
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Card de Resumo */}
      {!carregando && historico.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total de simulações</p>
              <p className="text-2xl font-bold text-foreground">{quantidadeSimulacoes}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Lucro acumulado</p>
              <p className={`text-2xl font-bold ${lucroTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {lucroTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de histórico */}
      {carregando ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-muted-foreground">Carregando simulações...</p>
        </div>
      ) : historico.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileQuestion className="w-20 h-20 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-foreground">Nenhuma simulação salva ainda</p>
          <p className="text-sm text-muted-foreground mt-1">Suas simulações salvas aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((item) => (
            <div
              key={item.id}
              className={`card-container border-l-4 ${
                item.resultado.decisao === 'vender' 
                  ? 'border-l-green-600' 
                  : 'border-l-amber-600'
              }`}
            >
              {/* Header do card */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  {item.identificacao && (
                    <p className="font-semibold text-foreground">{item.identificacao}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.tipo === 'premium' ? 'default' : 'secondary'} className={item.tipo === 'premium' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}>
                    {item.tipo === 'premium' ? '⭐ Premium' : 'MVP'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Corpo do card */}
              <div className="grid grid-cols-2 gap-2 text-sm text-foreground">
                <p>Peso: <span className="font-medium">{item.dados.peso} kg</span></p>
                <p>Dias: <span className="font-medium">{item.dados.dias}</span></p>
                <p className={`font-semibold ${item.resultado.lucroAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Lucro: R$ {item.resultado.lucroAtual.toFixed(2)}
                </p>
                {item.tipo === 'premium' && item.resultado.lucroFuturo !== undefined && (
                  <p className="text-purple-600 font-medium">
                    Projeção: R$ {item.resultado.lucroFuturo.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Footer do card */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Decisão: {item.resultado.decisao === 'vender' ? '💰 Vender' : '⏳ Segurar'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão flutuante */}
      {!carregando && historico.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-red-600 text-red-600 hover:bg-red-50 bg-background shadow-lg"
              >
                Limpar histórico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar todo o histórico?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza? Esta ação não pode ser desfeita. Todas as suas simulações salvas serão removidas permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLimparTudo}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default Historico;
