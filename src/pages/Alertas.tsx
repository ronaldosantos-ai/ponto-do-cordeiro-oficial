import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BellOff, Plus, Trash2, Calendar, Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { verificarPremium, obterHistorico, HistoricoItem } from "@/lib/storage";
import { obterAlertas, salvarAlerta, toggleAlerta, deletarAlerta, Alerta } from "@/lib/alertas";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Alertas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form states
  const [tipoAlerta, setTipoAlerta] = useState<'data' | 'animal'>('data');
  const [dataAlerta, setDataAlerta] = useState('');
  const [horaAlerta, setHoraAlerta] = useState('09:00');
  const [identificacaoAnimal, setIdentificacaoAnimal] = useState('');
  const [simulacaoSelecionada, setSimulacaoSelecionada] = useState<string>('');
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [alertasData, historicoData] = await Promise.all([
        obterAlertas(),
        obterHistorico()
      ]);
      setAlertas(alertasData);
      setHistorico(historicoData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  // Loading state
  if (!verificarPremium() || authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSalvarAlerta = async () => {
    if (!dataAlerta) {
      toast({
        title: "⚠️ Selecione uma data",
        variant: "destructive"
      });
      return;
    }

    const dataCompleta = new Date(`${dataAlerta}T${horaAlerta}:00`);
    if (dataCompleta <= new Date()) {
      toast({
        title: "⚠️ A data deve ser no futuro",
        variant: "destructive"
      });
      return;
    }

    try {
      setSalvando(true);
      
      await salvarAlerta({
        tipo: tipoAlerta,
        dataAlerta: dataCompleta.toISOString(),
        identificacaoAnimal: tipoAlerta === 'animal' ? identificacaoAnimal : undefined,
        mensagem: mensagem || undefined,
        ativo: true
      });

      toast({
        title: "✅ Alerta criado",
        description: "Você será lembrado na data selecionada"
      });

      // Reset form
      setDialogOpen(false);
      setTipoAlerta('data');
      setDataAlerta('');
      setHoraAlerta('09:00');
      setIdentificacaoAnimal('');
      setSimulacaoSelecionada('');
      setMensagem('');
      
      // Recarregar lista
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao salvar alerta:', error);
      toast({
        title: "❌ Erro ao criar alerta",
        variant: "destructive"
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleToggle = async (id: string, ativo: boolean) => {
    try {
      await toggleAlerta(id, ativo);
      setAlertas(prev => 
        prev.map(a => a.id === id ? { ...a, ativo } : a)
      );
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletarAlerta(id);
      setAlertas(prev => prev.filter(a => a.id !== id));
      toast({
        title: "🗑️ Alerta removido"
      });
    } catch (error) {
      console.error('Erro ao deletar alerta:', error);
      toast({
        title: "❌ Erro ao remover",
        variant: "destructive"
      });
    }
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container">
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
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold text-sm">
          ⭐ Premium
        </span>
      </header>

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Alertas e Lembretes</h1>
        <p className="text-muted-foreground text-sm mt-1">Receba lembretes para reavaliar vendas</p>
      </div>

      {/* Botão Novo Alerta */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-12 mb-6 bg-primary hover:bg-primary/90">
            <Plus className="w-5 h-5 mr-2" />
            Novo alerta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar novo alerta</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 pt-4">
            {/* Tipo de alerta */}
            <div className="space-y-3">
              <Label>Tipo de alerta</Label>
              <RadioGroup
                value={tipoAlerta}
                onValueChange={(v) => setTipoAlerta(v as 'data' | 'animal')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="data" id="tipo-data" />
                  <Label htmlFor="tipo-data" className="cursor-pointer">Por data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="animal" id="tipo-animal" />
                  <Label htmlFor="tipo-animal" className="cursor-pointer">Por animal</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Data do alerta */}
            <div className="space-y-2">
              <Label htmlFor="data">Quando lembrar?</Label>
              <input
                type="date"
                id="data"
                min={hoje}
                value={dataAlerta}
                onChange={(e) => setDataAlerta(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Hora */}
            <div className="space-y-2">
              <Label htmlFor="hora">Que horas?</Label>
              <input
                type="time"
                id="hora"
                value={horaAlerta}
                onChange={(e) => setHoraAlerta(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Identificação do animal (se tipo = animal) */}
            {tipoAlerta === 'animal' && (
              <div className="space-y-4">
                {/* Selecionar do histórico */}
                {historico.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Selecionar do histórico
                    </Label>
                    <Select
                      value={simulacaoSelecionada}
                      onValueChange={(value) => {
                        setSimulacaoSelecionada(value);
                        if (value) {
                          const sim = historico.find(h => h.id === value);
                          if (sim) {
                            setIdentificacaoAnimal(sim.identificacao || `${sim.dados.peso}kg - ${sim.dados.dias} dias`);
                            setMensagem(`Reavaliar: ${sim.identificacao || 'animal'} - Lucro atual: R$ ${sim.resultado.lucroAtual.toFixed(2)}`);
                          }
                        } else {
                          setIdentificacaoAnimal('');
                          setMensagem('');
                        }
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Escolher simulação salva..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma (inserir manualmente)</SelectItem>
                        {historico.map((sim) => (
                          <SelectItem key={sim.id} value={sim.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {sim.identificacao || `${sim.dados.peso}kg`}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(sim.timestamp).toLocaleDateString('pt-BR')} - R$ {sim.resultado.lucroAtual.toFixed(2)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Campo manual */}
                <div className="space-y-2">
                  <Label htmlFor="animal">
                    {historico.length > 0 ? 'Ou digite manualmente' : 'Qual animal?'}
                  </Label>
                  <input
                    type="text"
                    id="animal"
                    placeholder="Ex: Cordeiro 23, Lote A"
                    value={identificacaoAnimal}
                    onChange={(e) => {
                      setIdentificacaoAnimal(e.target.value);
                      setSimulacaoSelecionada(''); // Limpar seleção ao digitar
                    }}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {/* Mensagem */}
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem (opcional)</Label>
              <Textarea
                id="mensagem"
                placeholder="Ex: Reavaliar venda do lote A"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value.slice(0, 200))}
                className="resize-none"
                rows={3}
              />
              <span className="text-xs text-muted-foreground">{mensagem.length}/200</span>
            </div>

            {/* Botão salvar */}
            <Button
              onClick={handleSalvarAlerta}
              disabled={salvando}
              className="w-full h-12"
            >
              {salvando ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Criar alerta'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista de alertas */}
      {carregando ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-12">
          <BellOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Nenhum alerta configurado</p>
          <p className="text-sm text-muted-foreground mt-1">Crie alertas para lembrar de reavaliar vendas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alertas.map((alerta) => (
            <Card key={alerta.id} className={`p-4 ${!alerta.ativo ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {alerta.tipo === 'animal' ? (
                    <Bell className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Calendar className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="font-semibold text-foreground">
                    {formatarData(alerta.dataAlerta)}
                  </span>
                </div>
                <Switch
                  checked={alerta.ativo}
                  onCheckedChange={(checked) => handleToggle(alerta.id, checked)}
                />
              </div>

              {alerta.identificacaoAnimal && (
                <p className="text-sm font-medium text-foreground mb-1">
                  {alerta.identificacaoAnimal}
                </p>
              )}

              {alerta.mensagem && (
                <p className="text-sm text-muted-foreground mb-2">
                  {alerta.mensagem}
                </p>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Criado em {new Date(alerta.criado).toLocaleDateString('pt-BR')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(alerta.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alertas;
