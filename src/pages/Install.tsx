import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, Share, Plus, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoPontoCordeiro from "@/assets/logo-ponto-cordeiro.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detectar sistema operacional
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Verificar se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Capturar evento de instalação (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background">
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        {/* Logo e Título */}
        <div className="text-center mb-8">
          <img
            src={logoPontoCordeiro}
            alt="Ponto do Cordeiro"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Instalar App
          </h1>
          <p className="text-muted-foreground">
            Adicione o Ponto do Cordeiro na tela inicial do seu celular
          </p>
        </div>

        {/* Status de instalação */}
        {isInstalled && (
          <Card className="p-6 mb-8 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">App já instalado!</h3>
                <p className="text-sm text-muted-foreground">
                  O Ponto do Cordeiro está na sua tela inicial
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Benefícios */}
        <Card className="p-6 mb-8">
          <h2 className="font-bold text-lg text-foreground mb-4">
            Por que instalar?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="font-medium text-foreground">Acesso rápido</span>
                <p className="text-sm text-muted-foreground">
                  Abra direto da tela inicial, sem navegar pelo navegador
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="font-medium text-foreground">Funciona offline</span>
                <p className="text-sm text-muted-foreground">
                  Continue usando mesmo sem internet
                </p>
              </div>
            </li>
          </ul>
        </Card>

        {/* Instruções por plataforma */}
        {!isInstalled && (
          <>
            {/* Android com prompt disponível */}
            {deferredPrompt && (
              <Card className="p-6 mb-6">
                <h2 className="font-bold text-lg text-foreground mb-4">
                  Instalar agora
                </h2>
                <Button
                  className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleInstall}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Adicionar à Tela Inicial
                </Button>
              </Card>
            )}

            {/* iOS - Instruções manuais */}
            {isIOS && (
              <Card className="p-6 mb-6">
                <h2 className="font-bold text-lg text-foreground mb-4">
                  Como instalar no iPhone/iPad
                </h2>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Toque no botão Compartilhar</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Share className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          (ícone de quadrado com seta para cima)
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Role e toque em "Adicionar à Tela de Início"</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Plus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          (pode precisar rolar para baixo)
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Toque em "Adicionar"</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        O ícone aparecerá na sua tela inicial
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>
            )}

            {/* Android sem prompt (navegador não suportado) */}
            {isAndroid && !deferredPrompt && (
              <Card className="p-6 mb-6">
                <h2 className="font-bold text-lg text-foreground mb-4">
                  Como instalar no Android
                </h2>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Abra no Chrome</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Se estiver em outro navegador, copie o link e abra no Chrome
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Toque no menu (3 pontos)</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        No canto superior direito
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Selecione "Adicionar à tela inicial"</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        O app será instalado automaticamente
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>
            )}

            {/* Desktop */}
            {!isIOS && !isAndroid && !deferredPrompt && (
              <Card className="p-6 mb-6">
                <h2 className="font-bold text-lg text-foreground mb-4">
                  Como instalar no computador
                </h2>
                <p className="text-muted-foreground mb-4">
                  No Chrome ou Edge, clique no ícone de instalação na barra de endereços ou:
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span>Clique no menu (3 pontos)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span>Selecione "Instalar Ponto do Cordeiro"</span>
                  </li>
                </ol>
              </Card>
            )}
          </>
        )}

        {/* CTA de volta */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate("/landing")}>
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Install;
