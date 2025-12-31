import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { verificarPremiumAsync, verificarPremium } from '@/lib/storage';

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(verificarPremium());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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