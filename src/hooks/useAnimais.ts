import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useFazenda } from "./useFazenda";

export interface Animal {
  id: string;
  brinco: string;
  sexo: "M" | "F";
  raca: string | null;
  data_nascimento: string | null;
  peso_inicial_kg: number | null;
  lote_id: string | null;
  brinco_mae: string | null;
  brinco_pai: string | null;
  status: string;
  observacoes: string | null;
  created_at: string;
  peso_atual?: number | null;
  gmd?: number | null;
  dias?: number | null;
  lote_nome?: string | null;
}

export function useAnimais() {
  const { user } = useAuth();
  const { fazenda } = useFazenda();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Dispara apenas quando user?.id muda (login/logout).
  // fazenda é usada dentro de carregar() via closure — não precisa ser dependência.
  useEffect(() => {
    if (!user?.id) {
      setAnimais([]);
      setLoading(false);
      return;
    }
    carregar();
  }, [user?.id]); // <-- SÓ user?.id. Estável, sem loop.

  async function carregar() {
    if (!user?.id) return;
    setLoading(true);
    setErro(null);

    const { data, error } = await supabase
      .from("animais")
      .select("*, lotes(nome), pesagens(peso_kg, data_pesagem)")
      .eq("user_id", user.id)
      .eq("status", "ativo")
      .order("created_at", { ascending: false });

    if (error) { setErro(error.message); setLoading(false); return; }

    // Usa valores padrão se fazenda ainda não carregou
    const meta     = fazenda?.meta_gmd_g  ?? 133;
    const metaPeso = fazenda?.meta_peso_kg ?? 40;

    const lista = (data ?? []).map((a: any) => {
      const pesagens = [...(a.pesagens ?? [])].sort(
        (x: any, y: any) => new Date(x.data_pesagem).getTime() - new Date(y.data_pesagem).getTime()
      );
      const primeira   = pesagens[0];
      const ultima     = pesagens[pesagens.length - 1];
      const peso_atual = ultima?.peso_kg ?? null;

      let gmd: number | null  = null;
      let dias: number | null = null;
      if (primeira && ultima && primeira.data_pesagem !== ultima.data_pesagem) {
        dias = Math.round(
          (new Date(ultima.data_pesagem).getTime() - new Date(primeira.data_pesagem).getTime()) / 86400000
        );
        if (dias > 0) gmd = Math.round(((ultima.peso_kg - primeira.peso_kg) / dias) * 1000);
      }

      let status = "normal";
      if (peso_atual !== null && peso_atual >= metaPeso)  status = "pronto";
      else if (gmd !== null && gmd < meta * 0.7)          status = "refugo";
      else if (gmd !== null && gmd < meta)                status = "atencao";

      return { ...a, peso_atual, gmd, dias, lote_nome: a.lotes?.nome ?? null, status };
    });

    setAnimais(lista);
    setLoading(false);
  }

  return { animais, loading, erro, recarregar: carregar };
}
