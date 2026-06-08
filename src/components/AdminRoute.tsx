import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { checkIsAdmin } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsAuthorized(true);
      return;
    }

    if (loading) return;

    if (!user) {
      toast({
        title: '⛔ Acesso negado',
        description: 'Você precisa estar logado',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    // Check admin role via database
    checkIsAdmin(user.id).then((isAdmin) => {
      if (!isAdmin) {
        toast({
          title: '⛔ Acesso negado',
          description: 'Apenas administradores podem acessar esta área',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }
      setIsAuthorized(true);
    });
  }, [user, loading, navigate, toast]);

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
