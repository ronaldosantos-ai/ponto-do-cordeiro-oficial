import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Fazenda {
  id: string;
  nome: string;
  meta_gmd_g: number;
  meta_peso_kg: number;
  preco_venda: number | null;
  custo_diario: number | null;
}

interface FazendaContextType {
  fazenda: Fazenda | null;
  loading: boolean;
  recarregar: () => void;
}

const FazendaContext = createContext<FazendaContextType | undefined>(undefined);

export function FazendaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [fazenda, setFazenda] = useState<Fazenda | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    carregar(user.id);
  }, [user?.id]);

  async function carregar(userId: string) {
    setLoading(true);
    const { data } = await supabase
      .from("fazendas")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (data) {
      setFazenda(data as Fazenda);
    } else {
      const { data: nova } = await supabase
        .from("fazendas")
        .insert({ user_id: userId, nome: "Minha Fazenda", meta_gmd_g: 133, meta_peso_kg: 40 })
        .select()
        .single();
      setFazenda(nova as Fazenda | null);
    }
    setLoading(false);
  }

  function recarregar() {
    if (user?.id) carregar(user.id);
  }

  return (
    <FazendaContext.Provider value={{ fazenda, loading, recarregar }}>
      {children}
    </FazendaContext.Provider>
  );
}

export function useFazenda() {
  const ctx = useContext(FazendaContext);
  if (!ctx) throw new Error("useFazenda must be used within FazendaProvider");
  return ctx;
}
