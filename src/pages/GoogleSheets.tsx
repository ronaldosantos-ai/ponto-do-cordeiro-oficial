import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, HelpCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { obterHistorico, HistoricoItem } from "@/lib/storage";

function baixarCSV(historico: HistoricoItem[]) {
  // Cabeçalhos do CSV
  const headers = [
    "Data",
    "Animal",
    "Peso Atual (kg)",
    "Dias Confinamento",
    "Peso Futuro (kg)",
    "Custo Total (R$)",
    "Receita Atual (R$)",
    "Receita Futura (R$)",
    "Lucro Atual (R$)",
    "Lucro Futuro (R$)",
    "Decisão"
  ];

  // Converter dados para linhas CSV
  const rows = historico.map(item => {
    const data = new Date(item.timestamp).toLocaleDateString('pt-BR');
    const animal = item.identificacao || '-';
    const pesoAtual = item.dados.peso?.toFixed(1) || '-';
    const diasConfinamento = item.dados.dias?.toString() || '-';
    const pesoFuturo = item.resultado.pesoFuturo?.toFixed(1) || '-';
    const custoTotal = item.resultado.custoTotal?.toFixed(2) || '-';
    const receitaAtual = item.resultado.receitaAtual?.toFixed(2) || '-';
    const receitaFutura = item.resultado.receitaFutura?.toFixed(2) || '-';
    const lucroAtual = item.resultado.lucroAtual?.toFixed(2) || '-';
    const lucroFuturo = item.resultado.lucroFuturo?.toFixed(2) || '-';
    const decisao = item.resultado.decisao === 'vender' ? 'Vender Agora' : 'Aguardar';

    return [
      data,
      animal,
      pesoAtual,
      diasConfinamento,
      pesoFuturo,
      custoTotal,
      receitaAtual,
      receitaFutura,
      lucroAtual,
      lucroFuturo,
      decisao
    ].join(',');
  });

  // Montar CSV
  const csv = [headers.join(','), ...rows].join('\n');

  // Fazer download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ponto_cordeiro_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const GoogleSheets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [carregando, setCarregando] = useState(false);

  async function handleExportarCSV() {
    try {
      const historico = await obterHistorico();

      if (historico.length === 0) {
        toast({
          title: "⚠️ Nenhuma simulação encontrada",
          description: "Faça algumas simulações Premium primeiro",
          variant: "destructive"
        });
        return;
      }

      setCarregando(true);
      baixarCSV(historico);

      toast({
        title: "✅ Arquivo CSV baixado",
        description: `${historico.length} simulações exportadas. Agora importe no Google Sheets!`,
        duration: 5000
      });

      // Mostrar tutorial rápido (primeira vez)
      const primeiraVez = !localStorage.getItem("csv_exportado_antes");
      if (primeiraVez) {
        localStorage.setItem("csv_exportado_antes", "true");

        setTimeout(() => {
          toast({
            title: "💡 Próximos passos",
            description: "1) Abra Google Sheets  2) Arquivo → Importar  3) Upload do CSV baixado",
            duration: 8000
          });
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "❌ Erro ao exportar",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
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
      </header>

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Google Sheets</h1>
        <p className="text-muted-foreground mt-1">Exporte suas simulações para planilhas</p>
      </div>

      <div className="space-y-4">
        {/* Card Principal - Exportar CSV */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-600">
              ✅ Exportar para Google Sheets
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-normal">
                Recomendado
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* O que é CSV */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">
                📊 O que é CSV?
              </p>
              <p className="text-sm text-blue-800">
                CSV é um arquivo de planilha que o Google Sheets entende perfeitamente.
                Ao exportar, você baixa todas as suas simulações organizadas em formato
                de tabela, pronto para importar no Google Sheets em segundos.
              </p>
            </div>

            {/* Passos */}
            <ol className="text-sm text-muted-foreground space-y-3 ml-4 list-decimal">
              <li>
                <strong className="text-foreground">Clique no botão verde abaixo</strong>
                <p className="text-xs mt-1">
                  Um arquivo .csv será baixado automaticamente
                </p>
              </li>
              <li>
                <strong className="text-foreground">Abra o Google Sheets</strong>
                <p className="text-xs mt-1">
                  Acesse sheets.google.com ou crie nova planilha
                </p>
              </li>
              <li>
                <strong className="text-foreground">Importe o arquivo</strong>
                <p className="text-xs mt-1">
                  Menu: Arquivo → Importar → Upload → Selecione o arquivo CSV
                </p>
              </li>
              <li>
                <strong className="text-foreground">Pronto! Seus dados estão organizados</strong>
                <p className="text-xs mt-1">
                  Colunas: Data, Animal, Peso, Dias, Custos, Lucro, Decisão...
                </p>
              </li>
            </ol>

            {/* Botão de Download */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleExportarCSV}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-base"
                disabled={carregando}
              >
                {carregando ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando arquivo...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Baixar CSV para Google Sheets
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                💡 Exporte sempre que quiser atualizar sua planilha
              </p>
            </div>

            {/* Links Rápidos */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://sheets.google.com", "_blank")}
                className="flex-1 h-10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Google Sheets
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://support.google.com/docs/answer/40608", "_blank")}
                className="flex-1 h-10"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Como importar?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Perguntas Frequentes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">❓ Perguntas frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <details className="bg-secondary/50 rounded-lg p-4">
              <summary className="text-sm font-medium cursor-pointer">
                Posso exportar quantas vezes quiser?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                Sim! Exporte sempre que fizer novas simulações. O arquivo sempre
                terá todos os seus dados mais recentes.
              </p>
            </details>

            <details className="bg-secondary/50 rounded-lg p-4">
              <summary className="text-sm font-medium cursor-pointer">
                Como atualizar a planilha que já criei?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                Exporte o CSV novamente e importe na mesma planilha. Você pode
                substituir os dados antigos ou adicionar em outra aba.
              </p>
            </details>

            <details className="bg-secondary/50 rounded-lg p-4">
              <summary className="text-sm font-medium cursor-pointer">
                Posso editar a planilha depois de importar?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                Sim! Depois de importar, a planilha é totalmente sua. Pode adicionar
                colunas, criar gráficos, fórmulas e o que mais precisar.
              </p>
            </details>

            <details className="bg-secondary/50 rounded-lg p-4">
              <summary className="text-sm font-medium cursor-pointer">
                Preciso ter conta Google?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                Sim, o Google Sheets é gratuito mas precisa de conta Google (Gmail).
                Se não tiver, pode criar em gmail.com.
              </p>
            </details>
          </CardContent>
        </Card>

        {/* Aviso Sincronização Automática */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                🚀 Sincronização automática em breve
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Estamos trabalhando para que suas simulações sejam enviadas
                automaticamente para o Google Sheets, sem precisar exportar.
                Enquanto isso, o CSV funciona perfeitamente!
              </p>
            </div>
          </div>
        </div>

        {/* Seção Em Desenvolvimento */}
        <div className="pt-4 border-t border-border opacity-50">
          <h4 className="font-medium text-muted-foreground mb-2 flex items-center gap-2">
            🔒 Sincronização Automática
            <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full font-normal">
              Em desenvolvimento
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá conectar sua conta Google e suas simulações
            serão enviadas automaticamente para a planilha, sem precisar exportar manualmente.
          </p>
        </div>
      </div>

      {/* Espaço para BottomNav */}
      <div className="h-24" />
    </div>
  );
};

export default GoogleSheets;
