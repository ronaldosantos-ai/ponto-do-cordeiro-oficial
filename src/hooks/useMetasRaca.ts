import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface MetaRaca {
  id: string;
  raca: string;
  meta_gmd_g: number;
}

export const RACAS_PADRAO = [
  { raca: "Santa Inês",    meta_gmd_g: 150 },
  { raca: "Dorper",        meta_gmd_g: 200 },
  { raca: "Morada Nova",   meta_gmd_g: 133 },
  { raca: "Suffolk",       meta_gmd_g: 180 },
  { raca: "Ile de France", meta_gmd_g: 190 },
  { raca: "Texel",         meta_gmd_g: 175 },
  { raca: "SRD",           meta_gmd_g: 120 },
  { raca: "Sem raça",      meta_gmd_g: 133 },
];

export function useMetasRaca() {
  const { user } = useAuth();
  const [metas, setMetas] = useState<MetaRaca[]>([]);

  useEffect(() => {
    if (!user) return;
    carregar();
  }, [user]);

  async function carregar() {
    try {
      const { data } = await supabase
        .from("metas_raca")
        .select("id, raca, meta_gmd_g")
        .eq("user_id", user!.id);
      if (data) setMetas(data as MetaRaca[]);
    } catch (e) {}
  }

  async function salvar(raca: string, meta_gmd_g: number, fazenda_id: string) {
    if (!user) return;
    try {
      const { data: existing } = await supabase
        .from("metas_raca").select("id")
        .eq("user_id", user!.id).eq("raca", raca).maybeSingle();
      if (existing) {
        await supabase.from("metas_raca").update({ meta_gmd_g }).eq("id", existing.id);
      } else {
        await supabase.from("metas_raca").insert({ user_id: user!.id, fazenda_id, raca, meta_gmd_g });
      }
      carregar();
    } catch (e) {}
  }

  async function excluir(id: string) {
    try { await supabase.from("metas_raca").delete().eq("id", id); carregar(); } catch (e) {}
  }

  function getMetaParaRaca(raca: string | null, metaGlobal: number): number {
    if (!raca || metas.length === 0) return metaGlobal;
    const meta = metas.find(m => m.raca.toLowerCase() === raca.toLowerCase());
    return meta?.meta_gmd_g ?? metaGlobal;
  }

  return { metas, salvar, excluir, getMetaParaRaca, recarregar: carregar };
}
