import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { verificarPremiumAsync } from '@/lib/storage';

// Premium status is now validated entirely server-side via the is_premium_user() RPC function
// This prevents any client-side manipulation of premium status

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      setLoading(true);
      try {
        // Server-side verification via RPC function
        const status = await verificarPremiumAsync(user?.email || undefined);
        setIsPremium(status);
      } catch (error) {
        console.error('Erro ao verificar premium:', error);
        // On error, assume not premium for security
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    // Only check if user is authenticated
    if (user) {
      checkPremium();
    } else {
      setIsPremium(false);
      setLoading(false);
    }
  }, [user?.email, user]);

  return { isPremium, loading };
}