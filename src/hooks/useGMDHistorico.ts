import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useFazenda } from "./useFazenda";

export interface PontoGMD {
  mes: string;       // "Jan", "Fev", etc
  gmd: number;       // GMD médio do rebanho naquele mês
  peso: number;      // Peso médio do rebanho naquele mês
  animais: number;   // Qtd de animais com pesagem naquele mês
}

export function useGMDHistorico() {
  const { user } = useAuth();
  const { fazenda } = useFazenda();
  const [dados, setDados]     = useState<PontoGMD[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    carregar();
  }, [user]);

  async function carregar() {
    setLoading(true);

    // Buscar todas as pesagens dos últimos 7 meses
    const dataInicio = new Date();
    dataInicio.setMonth(dataInicio.getMonth() - 6);

    const { data: pesagens } = await supabase
      .from("pesagens")
      .select("animal_id, peso_kg, data_pesagem")
      .eq("user_id", user!.id)
      .gte("data_pesagem", dataInicio.toISOString().slice(0, 10))
      .order("data_pesagem", { ascending: true });

    if (!pesagens || pesagens.length === 0) {
      setDados([]);
      setLoading(false);
      return;
    }

    // Agrupar por mês
    const porMes: Record<string, { pesos: number[]; animais: Set<string> }> = {};
    const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

    for (const p of pesagens) {
      const d    = new Date(p.data_pesagem);
      const chave = MESES[d.getMonth()] + "/" + String(d.getFullYear()).slice(2);
      if (!porMes[chave]) porMes[chave] = { pesos: [], animais: new Set() };
      porMes[chave].pesos.push(Number(p.peso_kg));
      porMes[chave].animais.add(p.animal_id);
    }

    // Calcular GMD entre meses consecutivos por animal
    // Agrupar pesagens por animal para calcular GMD real
    const porAnimal: Record<string, { data: string; peso: number }[]> = {};
    for (const p of pesagens) {
      if (!porAnimal[p.animal_id]) porAnimal[p.animal_id] = [];
      porAnimal[p.animal_id].push({ data: p.data_pesagem, peso: Number(p.peso_kg) });
    }

    // GMD por mês = média dos GMDs individuais calculados naquele mês
    const gmdPorMes: Record<string, number[]> = {};

    for (const [animalId, pesos] of Object.entries(porAnimal)) {
      if (pesos.length < 2) continue;
      pesos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

      for (let i = 1; i < pesos.length; i++) {
        const anterior = pesos[i - 1];
        const atual    = pesos[i];
        const dias     = Math.round(
          (new Date(atual.data).getTime() - new Date(anterior.data).getTime()) / 86400000
        );
        if (dias <= 0) continue;

        const gmd = Math.round(((atual.peso - anterior.peso) / dias) * 1000);
        if (gmd < 0 || gmd > 500) continue; // filtrar outliers

        const d    = new Date(atual.data);
        const chave = MESES[d.getMonth()] + "/" + String(d.getFullYear()).slice(2);
        if (!gmdPorMes[chave]) gmdPorMes[chave] = [];
        gmdPorMes[chave].push(gmd);
      }
    }

    // Montar array final ordenado
    const resultado: PontoGMD[] = Object.entries(porMes)
      .map(([mes, v]) => ({
        mes,
        peso:    Math.round(v.pesos.reduce((s, p) => s + p, 0) / v.pesos.length * 10) / 10,
        animais: v.animais.size,
        gmd:     gmdPorMes[mes]
          ? Math.round(gmdPorMes[mes].reduce((s, g) => s + g, 0) / gmdPorMes[mes].length)
          : 0,
      }))
      .sort((a, b) => {
        const [mA, aA] = a.mes.split("/");
        const [mB, aB] = b.mes.split("/");
        const MESES_IDX = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
        const dateA = parseInt(aA) * 12 + MESES_IDX.indexOf(mA);
        const dateB = parseInt(aB) * 12 + MESES_IDX.indexOf(mB);
        return dateA - dateB;
      });

    setDados(resultado);
    setLoading(false);
  }

  const metaGMD = fazenda?.meta_gmd_g ?? 133;
  const temDados = dados.some(d => d.gmd > 0);

  return { dados, loading, metaGMD, temDados };
}
