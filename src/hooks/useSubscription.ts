import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Subscription {
  id: string;
  status: "trial" | "active" | "suspended" | "cancelled";
  plan: "monthly" | "annual";
  expires_at: string | null;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    carregar();
  }, [user?.id]);

  async function carregar() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      setSubscription(data as Subscription | null);
    } catch (e) {}
    setLoading(false);
  }

  const isPremium   = subscription?.status === "active" || subscription?.status === "trial";
  const hasAccess   = !subscription || isPremium;
  const isCancelled = subscription?.status === "cancelled";
  const isSuspended = subscription?.status === "suspended";

  return { subscription, loading, isPremium, hasAccess, isCancelled, isSuspended, recarregar: carregar };
}
