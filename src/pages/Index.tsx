import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [peso, setPeso] = useState("");
  const [dias, setDias] = useState("");
  const [custo, setCusto] = useState("");

  const isFormValid = peso !== "" && dias !== "" && custo !== "";

  const handleCalcular = () => {
    if (!isFormValid) return;

    console.log({
      peso: parseFloat(peso),
      dias: parseInt(dias),
      custo: parseFloat(custo),
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Ponto do Cordeiro</h1>
          <p className="text-muted-foreground text-base">
            Decidir vender ou segurar em 60 segundos
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          {/* Peso do cordeiro */}
          <div className="space-y-2">
            <Label htmlFor="peso" className="text-foreground">
              Peso do cordeiro (kg)
            </Label>
            <Input
              id="peso"
              type="number"
              step="0.1"
              min="0"
              placeholder="Ex: 35.5"
              autoFocus
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </div>

          {/* Dias em cativeiro */}
          <div className="space-y-2">
            <Label htmlFor="dias" className="text-foreground">
              Dias em cativeiro
            </Label>
            <Input
              id="dias"
              type="number"
              min="0"
              placeholder="Ex: 45"
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
            />
          </div>

          {/* Custo diário */}
          <div className="space-y-2">
            <Label htmlFor="custo" className="text-foreground">
              Custo diário (R$/dia)
            </Label>
            <Input
              id="custo"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 3.50"
              inputMode="decimal"
              className="h-14 text-lg border-2"
              value={custo}
              onChange={(e) => setCusto(e.target.value)}
            />
          </div>

          {/* Botão Calcular */}
          <Button
            variant="default"
            className="w-full h-14 text-lg bg-positive hover:bg-positive-hover"
            disabled={!isFormValid}
            onClick={handleCalcular}
          >
            Calcular agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
