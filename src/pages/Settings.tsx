import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Trash2, Info } from "lucide-react";

const Settings = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 animate-fade-in">
        <Link
          to="/"
          className="p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">Personalize o app</p>
        </div>
      </header>

      {/* Settings List */}
      <main className="space-y-4">
        {/* Default Price */}
        <div className="card-container animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Preço padrão por kg</h3>
              <p className="text-sm text-muted-foreground">Define o valor inicial</p>
            </div>
          </div>
          <input
            type="number"
            placeholder="Ex: 45.00"
            className="input-field"
            step="0.01"
            min="0"
          />
        </div>

        {/* Clear History */}
        <div className="card-container animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Limpar histórico</h3>
                <p className="text-sm text-muted-foreground">Remove todas as simulações</p>
              </div>
            </div>
            <button className="btn-destructive px-4 h-11 text-base">
              Limpar
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card-container animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Sobre o app</h3>
              <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
