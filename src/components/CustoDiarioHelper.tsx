import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const CustoDiarioHelper = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-start gap-1 mt-1.5">
        <p className="text-xs text-muted-foreground">
          💡 Inclua: ração + matriz (R$ 1-2/dia) + fixos + medicamentos
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 underline underline-offset-2 whitespace-nowrap"
          aria-label="Abrir explicação sobre como calcular custo"
        >
          <HelpCircle className="w-3 h-3" />
          Como calcular?
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Como Calcular Custo Total por Dia
            </DialogTitle>
            <DialogDescription className="sr-only">
              Instruções para calcular o custo diário do cordeiro
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm text-foreground">
            <p>O custo diário deve incluir <strong>TODOS</strong> os gastos:</p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-base">📊 EXEMPLO PRÁTICO:</p>
              <ul className="space-y-1.5">
                <li className="flex justify-between">
                  <span>• Ração:</span>
                  <span className="font-medium">R$ 5,00/dia</span>
                </li>
                <li className="flex justify-between">
                  <span>• Matriz*:</span>
                  <span className="font-medium">R$ 1,50/dia</span>
                </li>
                <li className="flex justify-between">
                  <span>• Custos fixos:</span>
                  <span className="font-medium">R$ 0,80/dia</span>
                </li>
                <li className="flex justify-between">
                  <span>• Medicamentos:</span>
                  <span className="font-medium">R$ 0,50/dia</span>
                </li>
              </ul>
              <div className="border-t border-border pt-2 mt-2">
                <p className="flex justify-between font-bold text-base">
                  <span>TOTAL:</span>
                  <span>R$ 7,80/dia</span>
                </p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              *Custo matriz = R$ 45/mês ÷ 30 dias
            </p>
            
            <p className="text-center font-medium text-primary">
              💡 Quanto mais completo o custo, mais precisa sua decisão!
            </p>
          </div>
          
          <DialogClose asChild>
            <Button className="w-full h-12 mt-2">
              Entendi
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
