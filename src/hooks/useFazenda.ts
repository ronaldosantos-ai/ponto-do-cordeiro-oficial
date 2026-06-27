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
    if (!user?.id) { setLoading(false); return; }
    carregarOuCriar(user.id);
  }, [user?.id]); // <-- string estável, não o objeto user

  async function carregarOuCriar(userId: string) {
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
    if (user?.id) carregarOuCriar(user.id);
  }

  return { fazenda, loading, recarregar };
}
