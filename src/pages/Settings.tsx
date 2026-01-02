import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Crown, Database, Info, Trash2, Download, Settings as SettingsIcon, Loader2, FileText, FileSpreadsheet, ChevronRight, ShieldX } from "lucide-react";
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
import { gerarPDFHistorico, gerarPDFAnalises } from "@/lib/pdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 ${onClick ? 'cursor-pointer hover:bg-secondary/50 active:bg-secondary' : ''}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="text-muted-foreground mt-0.5" aria-hidden="true">
          {icone}
        </div>
        <div className="flex-1">
          <p className="text-base font-medium text-foreground">{titulo}</p>
          {descricao && (
            <p className="text-sm text-muted-foreground mt-1">{descricao}</p>
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
  const [limpando, setLimpando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [dialogRelatorioAberto, setDialogRelatorioAberto] = useState(false);

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
      setExportando(true);
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
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setExportando(false);
    }
  }

  async function handleLimparTudo() {
    try {
      setLimpando(true);
      
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
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setLimpando(false);
    }
  }

  function handleDesativarPremium() {
    desativarPremium();
    toast({ title: "ℹ️ Premium desativado" });
    navigate('/');
  }

  function abrirLink(url: string) {
    window.open(url, '_blank');
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary h-12"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <SettingsIcon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
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
              <Bell className="w-5 h-5 text-primary" aria-hidden="true" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingsItem
              icone={<Bell className="w-5 h-5" />}
              titulo="Alertas ativados"
              descricao="Receber lembretes de alertas configurados"
              acao={
                <Switch
                  checked={alertasAtivados}
                  onCheckedChange={toggleAlertasConfig}
                  aria-label="Ativar ou desativar alertas"
                />
              }
            />
            <SettingsItem
              icone={<Bell className="w-5 h-5" />}
              titulo="Notificações gerais"
              descricao="Receber avisos e atualizações do app"
              acao={
                <Switch
                  checked={notificacoesGerais}
                  onCheckedChange={toggleNotificacoes}
                  aria-label="Ativar ou desativar notificações gerais"
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
                <Crown className="w-5 h-5 text-amber-600" aria-hidden="true" />
                Conta Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SettingsItem
                icone={<Crown className="w-5 h-5" />}
                titulo="Plano Premium"
                descricao="Você tem acesso a todos os recursos"
                acao={
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Ativo
                    </Badge>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600"
                        >
                          <ShieldX className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza que quer cancelar?</AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="space-y-3">
                              <p className="text-green-600 font-semibold">
                                Com Premium você já economizou tempo e tomou decisões mais seguras!
                              </p>
                              <p>Por apenas R$ 19,90/mês você tem:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Projeções que evitam prejuízo</li>
                                <li>Histórico completo</li>
                                <li>Alertas automáticos</li>
                              </ul>
                              <p className="text-lg">Seus cordeiros agradecem! 🐑</p>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogAction className="bg-green-600 hover:bg-green-700 h-12">
                            Continuar Premium
                          </AlertDialogAction>
                          <AlertDialogCancel 
                            onClick={handleDesativarPremium}
                            className="text-red-600 text-sm h-10"
                          >
                            Cancelar mesmo assim
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                }
              />
              <SettingsItem
                icone={<Database className="w-5 h-5" />}
                titulo="Dados sincronizados"
                descricao={`${numSimulacoes} simulações • ${numAlertas} alertas ativos`}
              />
            </CardContent>
          </Card>
        )}

        {/* SEÇÃO 3 - DADOS E USO */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="w-5 h-5 text-purple-600" aria-hidden="true" />
              Dados e Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingsItem
              icone={<Database className="w-5 h-5" />}
              titulo="Espaço utilizado"
              descricao={`Aproximadamente ${espacoUsado} em uso local`}
            />
            
            {isPremium && (
              <>
                <SettingsItem
                  icone={<FileText className="w-5 h-5" />}
                  titulo="Exportar relatórios"
                  descricao="Baixe seus dados em formato legível"
                  acao={
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={exportando}>
                          {exportando ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-background">
                        <DropdownMenuItem onClick={() => setDialogRelatorioAberto(true)}>
                          <FileText className="w-4 h-4 mr-2" />
                          Relatório em TXT
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          toast({ 
                            title: "📄 PDF em breve",
                            description: "Exportação em PDF estará disponível em uma próxima atualização"
                          });
                        }}>
                          <FileText className="w-4 h-4 mr-2" />
                          Relatório em PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                />
                <SettingsItem
                  icone={<FileSpreadsheet className="w-5 h-5" />}
                  titulo="Exportar para Google Sheets"
                  descricao="Tutorial completo para organizar dados em planilhas"
                  onClick={() => navigate('/settings/google-sheets')}
                  acao={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
                />
              </>
            )}
            
            <div className="p-4 space-y-3 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full h-12"
                onClick={handleLimparCache}
              >
                Limpar cache
              </Button>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Limpar todos os dados</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>⚠️ Tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div>
                          <p>Use apenas se quiser recomeçar do zero. Esta ação é IRREVERSÍVEL. Todos os seus dados serão perdidos:</p>
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
                      <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLimparTudo}
                        className="bg-red-600 hover:bg-red-700 h-12"
                        disabled={limpando}
                      >
                        {limpando ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Limpando...
                          </>
                        ) : (
                          'Sim, limpar tudo'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEÇÃO 4 - AVANÇADO (Colapsável) */}
        {isPremium && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="avancado" className="border rounded-lg bg-card">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  <span className="text-base font-semibold">Avançado</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="border-t border-border">
                  <SettingsItem
                    icone={<Database className="w-5 h-5" />}
                    titulo="Backup completo"
                    descricao="Salve todos os seus dados para transferir para outro celular"
                    acao={
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={exportando}
                          >
                            {exportando ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Fazer backup dos dados?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Um arquivo será baixado com todas as suas simulações e alertas. Guarde esse arquivo para restaurar seus dados em outro aparelho.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={exportarDados}
                              className="h-12"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Baixar backup
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* SEÇÃO 5 - SOBRE */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-5 h-5 text-blue-600" aria-hidden="true" />
              Sobre
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingsItem
              icone={<Info className="w-5 h-5" />}
              titulo="Ponto do Cordeiro"
              descricao="Versão 1.0.0"
            />
            <SettingsItem
              icone={<Info className="w-5 h-5" />}
              titulo="Descrição"
              descricao="Decisão rápida de venda de cordeiros para produtores rurais"
            />
            <SettingsItem
              icone={<Info className="w-5 h-5" />}
              titulo="Termos de uso"
              onClick={() => abrirLink('#')}
            />
            <SettingsItem
              icone={<Info className="w-5 h-5" />}
              titulo="Política de privacidade"
              onClick={() => abrirLink('#')}
            />
            <SettingsItem
              icone={<Info className="w-5 h-5" />}
              titulo="Suporte via WhatsApp"
              onClick={() => abrirLink('https://wa.me/5500000000000')}
            />
            <div className="p-4 text-center text-sm text-muted-foreground border-t border-border">
              Desenvolvido com ❤️ para o produtor rural
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação Relatório TXT */}
      <AlertDialog open={dialogRelatorioAberto} onOpenChange={setDialogRelatorioAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Exportar relatório TXT?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Será gerado um relatório em texto com <strong>{numSimulacoes}</strong> simulação(ões) 
              salvas no histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setExportando(true);
                setDialogRelatorioAberto(false);
                try {
                  const historico = await obterHistorico();
                  if (historico.length > 0) {
                    gerarPDFHistorico(historico);
                    toast({ title: "✅ Relatório TXT exportado" });
                  } else {
                    toast({ title: "⚠️ Nenhum dado para exportar" });
                  }
                } finally {
                  setExportando(false);
                }
              }}
              className="h-12"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar TXT
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
