import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { obterAlertasVencidos, toggleAlerta } from "@/lib/alertas";
import { useToast } from "@/hooks/use-toast";
import { verificarPremium } from "@/lib/storage";

export const AlertasNotifier = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!user || !verificarPremium()) return;

    const verificarAlertas = async () => {
      try {
        const vencidos = await obterAlertasVencidos();
        
        for (const alerta of vencidos) {
          toast({
            title: "🔔 Lembrete",
            description: alerta.mensagem || 
              `Hora de reavaliar: ${alerta.identificacaoAnimal || 'seu animal'}`,
            duration: 10000
          });
          
          // Desativar alerta após mostrar
          await toggleAlerta(alerta.id, false);
        }
      } catch (error) {
        console.error('Erro ao verificar alertas:', error);
      }
    };

    // Verificar imediatamente ao carregar (apenas uma vez)
    if (!checkedRef.current) {
      checkedRef.current = true;
      verificarAlertas();
    }

    // Verificar a cada 5 minutos
    const intervalo = setInterval(verificarAlertas, 5 * 60 * 1000);

    return () => clearInterval(intervalo);
  }, [user, toast]);

  return null;
};
