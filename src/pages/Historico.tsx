import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, RefreshCw, Search, Loader2, CalendarIcon, BarChart3, FileDown } from "lucide-react";
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
import { EmptyState } from "@/components/EmptyState";
import { FileQuestion } from "lucide-react";
import { gerarPDFHistorico } from "@/lib/pdf";

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

  const [filtro, setFiltro] = useState<FiltroTipo>(7);
  const [busca, setBusca] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [exportando, setExportando] = useState(false);

  const carregarHistorico = async (mostrarToast = false) => {
    if (!user) return;
    
    try {
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
          title: "✅ Sincronizado",
          description: `${filtrados.length} simulação(ões) encontrada(s)`
        });
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast({
        title: "❌ Erro ao sincronizar",
        description: "Tente novamente",
        variant: "destructive"
      });
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
    const carregar = async () => {
      setCarregando(true);
      await carregarHistorico();
      setCarregando(false);
    };
    if (user) {
      carregar();
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
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Carregando">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleAtualizar = async () => {
    setAtualizando(true);
    await carregarHistorico(true);
    setAtualizando(false);
  };

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
      setFiltro('todos');
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
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/premium')}
          className="p-2 hover:bg-secondary h-12"
          aria-label="Voltar para Premium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (historico.length === 0) return;
              setExportando(true);
              try {
                gerarPDFHistorico(historico);
                toast({ title: "✅ Histórico exportado" });
              } finally {
                setExportando(false);
              }
            }}
            disabled={historico.length === 0 || exportando}
            className="h-10"
          >
            {exportando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/graficos')}
            className="h-10"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Gráficos
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAtualizar}
            disabled={atualizando || carregando}
            className="h-10 w-10 hover:bg-secondary"
            aria-label="Atualizar histórico"
          >
            {atualizando ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
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
        <p className="text-muted-foreground text-sm mt-1">Suas simulações salvas aparecerão aqui</p>
      </div>

      {/* Campo de busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
        <Input
          type="text"
          placeholder="Buscar por nome do animal..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="h-14 pl-12 text-lg"
          aria-label="Buscar simulações"
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
                  "flex-1 justify-start text-left font-normal h-14 text-base",
                  dataSelecionada && "border-primary bg-primary/5"
                )}
                aria-label="Selecionar data específica"
              >
                <CalendarIcon className="mr-2 h-5 w-5" aria-hidden="true" />
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
              size="icon"
              onClick={limparDataSelecionada}
              className="h-14 w-14 text-muted-foreground hover:text-foreground"
              aria-label="Limpar data selecionada"
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
              size="lg"
              onClick={() => {
                setFiltro(f.value);
                setDataSelecionada(undefined);
              }}
              className={cn(
                "whitespace-nowrap h-12",
                filtro === f.value && !dataSelecionada
                  ? "bg-primary hover:bg-primary/90" 
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
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200 mb-4 shadow-sm">
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
        <div className="flex flex-col items-center justify-center py-12" role="status" aria-label="Carregando simulações">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Carregando simulações...</p>
        </div>
      ) : historico.length === 0 ? (
        busca.trim() ? (
          <EmptyState
            icone={<Search className="w-20 h-20" />}
            titulo="Nenhuma simulação encontrada"
            descricao={`Nenhuma simulação encontrada para "${busca}"`}
            acao={{
              texto: "Limpar busca",
              onClick: () => setBusca('')
            }}
          />
        ) : (
          <EmptyState
            icone={<FileQuestion className="w-20 h-20" />}
            titulo="Nenhuma simulação salva ainda"
            descricao="Suas simulações salvas aparecerão aqui"
            acao={{
              texto: "Fazer simulação",
              onClick: () => navigate('/premium')
            }}
          />
        )
      ) : (
        <div className="space-y-3">
          {historico.map((item) => (
            <div
              key={item.id}
              className={`card-container border-l-4 shadow-sm ${
                item.resultado.decisao === 'vender' 
                  ? 'border-l-green-600' 
                  : 'border-l-amber-600'
              }`}
            >
              {/* Header do card */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  {item.identificacao && (
                    <p className="font-semibold text-foreground text-base">{item.identificacao}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.tipo === 'premium' ? 'default' : 'secondary'} className={item.tipo === 'premium' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}>
                    {item.tipo === 'premium' ? '⭐ Premium' : 'MVP'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Deletar simulação ${item.identificacao || ''}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Corpo do card */}
              <div className="grid grid-cols-2 gap-2 text-base text-foreground">
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
                <p className="text-sm text-muted-foreground">
                  Decisão: {item.resultado.decisao === 'vender' ? '💰 Vender' : '⏳ Segurar'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão flutuante */}
      {!carregando && historico.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-14 border-2 border-red-600 text-red-600 hover:bg-red-50 bg-background shadow-lg text-base"
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
                <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLimparTudo}
                  className="bg-red-600 hover:bg-red-700 h-12"
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
