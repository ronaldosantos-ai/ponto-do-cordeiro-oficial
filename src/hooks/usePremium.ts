import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { verificarPremiumAsync, verificarPremium } from '@/lib/storage';

// DEV MODE: Desabilitado em produção para segurança
const DEV_MODE_PREMIUM = false;

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(DEV_MODE_PREMIUM || verificarPremium());
  const [loading, setLoading] = useState(!DEV_MODE_PREMIUM);

  useEffect(() => {
    // Se DEV_MODE_PREMIUM está ativo, pular verificação
    if (DEV_MODE_PREMIUM) {
      setIsPremium(true);
      setLoading(false);
      return;
    }

    const checkPremium = async () => {
      setLoading(true);
      try {
        const status = await verificarPremiumAsync(user?.email || undefined);
        setIsPremium(status);
      } catch (error) {
        console.error('Erro ao verificar premium:', error);
        setIsPremium(verificarPremium());
      } finally {
        setLoading(false);
      }
    };

    checkPremium();
  }, [user?.email]);

  return { isPremium, loading };
}