import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Crown } from "lucide-react";

const Index = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">🐑 Ponto do Cordeiro</h1>
          <p className="text-muted-foreground text-sm mt-1">Calculadora de preços</p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/premium" 
            className="p-3 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
            aria-label="Premium"
          >
            <Crown className="w-5 h-5" />
          </Link>
          <Link 
            to="/settings" 
            className="p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content Placeholder */}
      <main className="space-y-6">
        <div className="card-container animate-slide-up">
          <h2 className="section-title">Simulação de Preço</h2>
          <p className="text-muted-foreground">
            Componente SimulationForm será adicionado aqui
          </p>
        </div>

        <div className="card-container animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="section-title">Resultado</h2>
          <p className="text-muted-foreground">
            Componente ResultDisplay será adicionado aqui
          </p>
        </div>

        <div className="card-container animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="section-title">Histórico</h2>
          <p className="text-muted-foreground">
            Componente HistoryList será adicionado aqui
          </p>
        </div>
      </main>

      {/* Bottom Navigation Spacer */}
      <div className="h-20" />
    </div>
  );
};

export default Index;
