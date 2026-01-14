import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for admin data
export interface AdminSubscription {
  id: string;
  email: string;
  user_id: string | null;
  plan_type: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
  ticto_transaction_id: string | null;
}

export interface AdminSimulation {
  id: string;
  user_id: string;
  device_id: string;
  tipo: string;
  identificacao: string | null;
  dados: Record<string, unknown>;
  resultado: Record<string, unknown>;
  created_at: string;
}

export interface AdminAlert {
  id: string;
  user_id: string;
  data_alerta: string;
  simulacao_id: string | null;
  ativo: boolean;
  identificacao_animal: string | null;
  mensagem: string | null;
  tipo: string;
  created_at: string;
}

export interface AdminRoleAudit {
  id: string;
  user_id: string;
  role: string;
  action: string;
  performed_at: string;
  performed_by: string | null;
}

export interface AdminUserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string | null;
}

// Fetch all subscriptions (admin only)
export function useAdminSubscriptions() {
  return useQuery({
    queryKey: ['admin', 'subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AdminSubscription[];
    },
  });
}

// Fetch all simulations (admin only)
export function useAdminSimulations() {
  return useQuery({
    queryKey: ['admin', 'simulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('historico_simulacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data as AdminSimulation[];
    },
  });
}

// Fetch all alerts (admin only)
export function useAdminAlerts() {
  return useQuery({
    queryKey: ['admin', 'alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alertas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AdminAlert[];
    },
  });
}

// Fetch role audit logs (admin only)
export function useAdminRoleAudit() {
  return useQuery({
    queryKey: ['admin', 'role-audit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles_audit')
        .select('*')
        .order('performed_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AdminRoleAudit[];
    },
  });
}

// Fetch all user roles (admin only)
export function useAdminUserRoles() {
  return useQuery({
    queryKey: ['admin', 'user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AdminUserRole[];
    },
  });
}

// Calculate admin dashboard statistics
export function useAdminStats() {
  const { data: subscriptions, isLoading: loadingSubs } = useAdminSubscriptions();
  const { data: simulations, isLoading: loadingSims } = useAdminSimulations();
  const { data: alerts, isLoading: loadingAlerts } = useAdminAlerts();
  
  const stats = {
    // Subscription stats
    totalSubscriptions: subscriptions?.length ?? 0,
    activeSubscriptions: subscriptions?.filter(s => s.status === 'active').length ?? 0,
    monthlySubscriptions: subscriptions?.filter(s => s.status === 'active' && s.plan_type === 'monthly').length ?? 0,
    yearlySubscriptions: subscriptions?.filter(s => s.status === 'active' && s.plan_type === 'yearly').length ?? 0,
    
    // Simulation stats
    totalSimulations: simulations?.length ?? 0,
    simulationsToday: simulations?.filter(s => {
      const today = new Date().toISOString().split('T')[0];
      return s.created_at.startsWith(today);
    }).length ?? 0,
    
    // Alert stats
    totalAlerts: alerts?.length ?? 0,
    activeAlerts: alerts?.filter(a => a.ativo).length ?? 0,
    
    // Financial (estimated)
    mrr: (subscriptions?.filter(s => s.status === 'active' && s.plan_type === 'monthly').length ?? 0) * 19.90 +
         (subscriptions?.filter(s => s.status === 'active' && s.plan_type === 'yearly').length ?? 0) * (197 / 12),
  };
  
  // Simulations per day (last 7 days)
  const simulationsPerDay: { dia: string; total: number }[] = [];
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    const diaStr = data.toISOString().split('T')[0];
    simulationsPerDay.push({
      dia: diasSemana[data.getDay()],
      total: simulations?.filter(s => s.created_at.startsWith(diaStr)).length ?? 0
    });
  }
  
  return {
    stats,
    simulationsPerDay,
    isLoading: loadingSubs || loadingSims || loadingAlerts,
    subscriptions,
    simulations,
    alerts,
  };
}
