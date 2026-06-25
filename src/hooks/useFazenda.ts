import { useState, useEffect } from "react";
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

export function useFazenda() {
  const { user } = useAuth();
  const [fazenda, setFazenda] = useState<Fazenda | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    carregarOuCriar();
  }, [user]);

  async function carregarOuCriar() {
    setLoading(true);
    const { data } = await supabase
      .from("fazendas")
      .select("*")
      .eq("user_id", user!.id)
      .limit(1)
      .single();

    if (data) {
      setFazenda(data);
    } else {
      // Cria fazenda padrão na primeira vez
      const { data: nova } = await supabase
        .from("fazendas")
        .insert({ user_id: user!.id, nome: "Minha Fazenda", meta_gmd_g: 133, meta_peso_kg: 40 })
        .select()
        .single();
      setFazenda(nova);
    }
    setLoading(false);
  }

  return { fazenda, loading, recarregar: carregarOuCriar };
}
