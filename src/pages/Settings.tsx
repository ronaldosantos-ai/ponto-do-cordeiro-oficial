import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Crown, Database, Info, Trash2, Download, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { obterHistorico, limparHistorico, verificarPremium, desativarPremium } from "@/lib/storage";
import { obterAlertas, deletarAlerta } from "@/lib/alertas";

interface SettingsItemProps {
  icone: React.ReactNode;
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  onClick?: () => void;
}

function SettingsItem({ icone, titulo, descricao, acao, onClick }: SettingsItemProps) {
  return (
    <div 
      className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 ${onClick ? 'cursor-pointer hover:bg-secondary/50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="text-muted-foreground mt-0.5">
          {icone}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{titulo}</p>
          {descricao && (
            <p className="text-xs text-muted-foreground mt-1">{descricao}</p>
          )}
        </div>
      </div>
      {acao && (
        <div className="ml-4">
          {acao}
        </div>
      )}
    </div>
  );
}

function calcularTamanhoStorage(): string {
  let tamanho = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (chave) {
      const valor = localStorage.getItem(chave) || '';
      tamanho += chave.length + valor.length;
    }
  }
  
  const kb = (tamanho / 1024).toFixed(2);
  return `${kb} KB`;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [alertasAtivados, setAlertasAtivados] = useState(true);
  const [notificacoesGerais, setNotificacoesGerais] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [numSimulacoes, setNumSimulacoes] = useState(0);
  const [numAlertas, setNumAlertas] = useState(0);
  const [espacoUsado, setEspacoUsado] = useState('0 KB');

  useEffect(() => {
    // Carregar configurações
    const alertas = localStorage.getItem('config_alertas_ativados');
    const notifs = localStorage.getItem('config_notificacoes_gerais');
    
    setAlertasAtivados(alertas !== 'false');
    setNotificacoesGerais(notifs !== 'false');
    setIsPremium(verificarPremium());
    setEspacoUsado(calcularTamanhoStorage());
    
    // Carregar estatísticas
    carregarEstatisticas();
  }, []);

  async function carregarEstatisticas() {
    try {
      const historico = await obterHistorico();
      const alertas = await obterAlertas();
      
      setNumSimulacoes(historico.length);
      setNumAlertas(alertas.filter(a => a.ativo).length);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  function toggleAlertasConfig(valor: boolean) {
    setAlertasAtivados(valor);
    localStorage.setItem('config_alertas_ativados', valor.toString());
    toast({ 
      title: valor ? "✅ Alertas ativados" : "⏸️ Alertas pausados" 
    });
  }

  function toggleNotificacoes(valor: boolean) {
    setNotificacoesGerais(valor);
    localStorage.setItem('config_notificacoes_gerais', valor.toString());
    toast({ 
      title: valor ? "✅ Notificações ativadas" : "🔕 Notificações desativadas" 
    });
  }

  function handleLimparCache() {
    // Limpar apenas dados temporários (não alertas nem histórico)
    const keysToKeep = ['ponto_cordeiro_premium', 'config_alertas_ativados', 'config_notificacoes_gerais'];
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key) && key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setEspacoUsado(calcularTamanhoStorage());
    
    toast({ title: "✅ Cache limpo" });
  }

  async function exportarDados() {
    try {
      const historico = await obterHistorico();
      const alertas = await obterAlertas();
      
      const dados = {
        versao: '1.0',
        exportadoEm: new Date().toISOString(),
        historico,
        alertas
      };
      
      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ponto_cordeiro_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({ title: "✅ Dados exportados" });
    } catch (error) {
      toast({ 
        title: "❌ Erro ao exportar",
        variant: "destructive"
      });
    }
  }

  async function handleLimparTudo() {
    try {
      // Limpar histórico
      await limparHistorico();
      
      // Deletar todos os alertas
      const alertas = await obterAlertas();
      for (const alerta of alertas) {
        await deletarAlerta(alerta.id);
      }
      
      // Limpar configurações
      localStorage.removeItem('config_alertas_ativados');
      localStorage.removeItem('config_notificacoes_gerais');
      
      toast({ title: "✅ Todos os dados foram deletados" });
      navigate('/');
    } catch (error) {
      toast({ 
        title: "❌ Erro ao limpar dados",
        variant: "destructive"
      });
    }
  }

  function handleDesativarPremium() {
    desativarPremium();
    toast({ title: "Premium desativado" });
    navigate('/');
  }

  function abrirLink(url: string) {
    window.open(url, '_blank');
  }

  return (
    <div className="page-container pb-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <SettingsIcon className="w-5 h-5 text-muted-foreground" />
      </header>

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
      </div>

      <div className="space-y-4">
        {/* SEÇÃO 1 - NOTIFICAÇÕES */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-5 h-5 text-blue-600" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingsItem
              icone={<Bell className="w-4 h-4" />}
              titulo="Alertas ativados"
              descricao="Receber lembretes de alertas configurados"
              acao={
                <Switch
                  checked={alertasAtivados}
                  onCheckedChange={toggleAlertasConfig}
                />
              }
            />
            <SettingsItem
              icone={<Bell className="w-4 h-4" />}
              titulo="Notificações gerais"
              descricao="Receber avisos e atualizações do app"
              acao={
                <Switch
                  checked={notificacoesGerais}
                  onCheckedChange={toggleNotificacoes}
                />
              }
            />
          </CardContent>
        </Card>

        {/* SEÇÃO 2 - CONTA PREMIUM */}
        {isPremium && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="w-5 h-5 text-amber-600" />
                Conta Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingsItem
                icone={<Crown className="w-4 h-4" />}
                titulo="Status da conta"
                descricao="Você tem acesso a todos os recursos"
                acao={
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    ✅ Premium Ativo
                  </Badge>
                }
              />
              <SettingsItem
                icone={<Database className="w-4 h-4" />}
                titulo="Dados sincronizados"
                descricao={`${numSimulacoes} simulações no histórico • ${numAlertas} alertas ativos`}
              />
              <div className="p-4 border-t border-border">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Desativar Premium
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Desativar Premium?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Você perderá acesso aos recursos premium. Seus dados serão mantidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDesativarPremium}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Desativar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SEÇÃO 3 - DADOS E USO */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="w-5 h-5 text-purple-600" />
              Dados e Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingsItem
              icone={<Database className="w-4 h-4" />}
              titulo="Espaço utilizado"
              descricao={`Aproximadamente ${espacoUsado} em uso local`}
            />
            <div className="p-4 space-y-3 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLimparCache}
              >
                Limpar cache
              </Button>
              
              {isPremium && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={exportarDados}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar dados
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar todos os dados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>⚠️ Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div>
                        <p>Esta ação é IRREVERSÍVEL. Todos os seus dados serão perdidos permanentemente:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Todas as simulações salvas</li>
                          <li>Todos os alertas configurados</li>
                          <li>Todas as configurações</li>
                        </ul>
                        <p className="mt-2 font-semibold">Você não poderá recuperar esses dados.</p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLimparTudo}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sim, deletar tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* SEÇÃO 4 - SOBRE */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-5 h-5 text-gray-600" />
              Sobre o App
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingsItem
              icone={<Info className="w-4 h-4" />}
              titulo="Ponto do Cordeiro"
              descricao="Versão 1.0.0"
            />
            <SettingsItem
              icone={<Info className="w-4 h-4" />}
              titulo="Descrição"
              descricao="Decisão rápida de venda de cordeiros para produtores rurais"
            />
            <SettingsItem
              icone={<Info className="w-4 h-4" />}
              titulo="Termos de uso"
              onClick={() => abrirLink('#')}
            />
            <SettingsItem
              icone={<Info className="w-4 h-4" />}
              titulo="Política de privacidade"
              onClick={() => abrirLink('#')}
            />
            <SettingsItem
              icone={<Info className="w-4 h-4" />}
              titulo="Suporte via WhatsApp"
              onClick={() => abrirLink('https://wa.me/5500000000000')}
            />
            <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
              Desenvolvido com ❤️ para o produtor rural
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
