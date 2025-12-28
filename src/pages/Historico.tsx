import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, FileQuestion, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  // Verificar acesso Premium
  useEffect(() => {
    if (!verificarPremium()) {
      navigate('/premium-info');
    }
  }, [navigate]);

  // Se não for premium, não renderiza nada
  if (!verificarPremium()) {
    return null;
  }

  const [filtro, setFiltro] = useState<FiltroTipo>(7);
  const [busca, setBusca] = useState('');
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  const carregarHistorico = () => {
    let resultado = obterHistorico();
    
    // Filtrar por dias
    if (filtro !== 'todos') {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - filtro);
      resultado = resultado.filter(item => 
        new Date(item.timestamp) >= dataLimite
      );
    }
    
    // Filtrar por busca
    if (busca.trim()) {
      resultado = resultado.filter(item =>
        item.identificacao?.toLowerCase().includes(busca.toLowerCase())
      );
    }
    
    setHistorico(resultado);
  };

  // Carregar histórico ao montar e quando filtros mudam
  useEffect(() => {
    carregarHistorico();
  }, [filtro, busca]);

  // Recarregar dados quando a página fica visível novamente
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        carregarHistorico();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [filtro, busca]);

  const handleDelete = (id: string) => {
    deletarItem(id);
    carregarHistorico();
    toast({
      description: "Simulação removida do histórico",
    });
  };

  const handleLimparTudo = () => {
    limparHistorico();
    carregarHistorico();
    toast({
      description: "Histórico limpo com sucesso",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            size="sm"
            onClick={carregarHistorico}
            className="p-2 hover:bg-secondary"
            title="Atualizar histórico"
          >
            <RefreshCw className="w-4 h-4" />
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

      {/* Filtros rápidos */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {filtros.map((f) => (
          <Button
            key={f.value}
            variant={filtro === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro(f.value)}
            className={`whitespace-nowrap ${
              filtro === f.value 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "hover:bg-secondary"
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Card de Resumo */}
      {historico.length > 0 && (
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
      {historico.length === 0 ? (
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
      {historico.length > 0 && (
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