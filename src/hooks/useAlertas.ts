import { useMemo, useState, useEffect } from "react";
import { useAnimais } from "./useAnimais";
import { useFazenda } from "./useFazenda";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export type TipoAlerta =
  | "gmd_baixo"
  | "refugo"
  | "lote_discrepante"
  | "recem_nascido"
  | "pronto_venda"
  | "custom";

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  animal_id: string | null;
  brinco: string | null;
  sexo: string | null;
  lote_nome: string | null;
  mensagem: string;
  detalhe: string | null;
  severidade: "alta" | "media" | "info";
  resolvido?: boolean;
  custom?: boolean;
}

export interface AlertaCustom {
  id: string;
  user_id: string;
  animal_id: string | null;
  lote_nome: string | null;
  mensagem: string;
  detalhe: string | null;
  severidade: "alta" | "media" | "info";
  resolvido: boolean;
  created_at: string;
}

export function useAlertas() {
  const { user } = useAuth();
  const { animais, loading: loadingAnimais } = useAnimais();
  const { fazenda } = useFazenda();
  const [alertasCustom, setAlertasCustom] = useState<AlertaCustom[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(true);

  useEffect(() => {
    if (!user) return;
    carregarCustom();
  }, [user?.id]);

  async function carregarCustom() {
    setLoadingCustom(true);
    const { data } = await supabase
      .from("alertas_custom")
      .select("*")
      .eq("user_id", user!.id)
      .eq("resolvido", false)
      .order("created_at", { ascending: false });
    setAlertasCustom((data ?? []) as AlertaCustom[]);
    setLoadingCustom(false);
  }

  async function criarAlertaCustom(dados: {
    mensagem: string;
    detalhe?: string;
    severidade: "alta" | "media" | "info";
    animal_id?: string | null;
    lote_nome?: string | null;
  }) {
    if (!user) return { error: "Não autenticado" };
    const { error } = await supabase.from("alertas_custom").insert({
      user_id:    user.id,
      mensagem:   dados.mensagem,
      detalhe:    dados.detalhe ?? null,
      severidade: dados.severidade,
      animal_id:  dados.animal_id ?? null,
      lote_nome:  dados.lote_nome ?? null,
    });
    if (!error) carregarCustom();
    return { error };
  }

  async function resolverAlerta(id: string) {
    await supabase
      .from("alertas_custom")
      .update({ resolvido: true })
      .eq("id", id);
    carregarCustom();
  }

  async function excluirAlerta(id: string) {
    await supabase.from("alertas_custom").delete().eq("id", id);
    carregarCustom();
  }

  const alertasAutomaticos = useMemo(() => {
    if (!animais.length || !fazenda) return [];

    const lista: Alerta[] = [];
    const metaGMD  = fazenda.meta_gmd_g  ?? 133;
    const metaPeso = fazenda.meta_peso_kg ?? 40;

    for (const a of animais) {
      if (a.gmd !== null && a.gmd !== undefined) {
        if (a.gmd < metaGMD * 0.7) {
          lista.push({
            id: "refugo_" + a.id, tipo: "refugo",
            animal_id: a.id, brinco: a.brinco, sexo: a.sexo, lote_nome: a.lote_nome,
            mensagem: "Sugestão de descarte",
            detalhe: "GMD de " + a.gmd + "g/dia — muito abaixo da meta de " + metaGMD + "g. Verifique saúde e manejo.",
            severidade: "alta",
          });
        } else if (a.gmd < metaGMD) {
          lista.push({
            id: "gmd_" + a.id, tipo: "gmd_baixo",
            animal_id: a.id, brinco: a.brinco, sexo: a.sexo, lote_nome: a.lote_nome,
            mensagem: "GMD abaixo da meta",
            detalhe: "GMD de " + a.gmd + "g/dia — meta é " + metaGMD + "g. Verifique limpeza de bebedouros e altura do cocho.",
            severidade: "media",
          });
        }
      }

      if (a.peso_atual !== null && a.peso_atual >= metaPeso) {
        lista.push({
          id: "pronto_" + a.id, tipo: "pronto_venda",
          animal_id: a.id, brinco: a.brinco, sexo: a.sexo, lote_nome: a.lote_nome,
          mensagem: "Pronto para venda",
          detalhe: "Atingiu " + a.peso_atual + " kg — meta de " + metaPeso + " kg alcançada.",
          severidade: "info",
        });
      }

      if (a.data_nascimento) {
        const diasVida = Math.floor(
          (new Date().getTime() - new Date(a.data_nascimento).getTime()) / 86400000
        );
        if (diasVida >= 0 && diasVida <= 30) {
          lista.push({
            id: "recem_" + a.id, tipo: "recem_nascido",
            animal_id: a.id, brinco: a.brinco, sexo: a.sexo, lote_nome: a.lote_nome,
            mensagem: "Protocolo recém-nascido (" + diasVida + " dias)",
            detalhe: diasVida <= 3
              ? "Primeiros dias críticos — confirme: cura do umbigo com iodo 10%, colostro nas primeiras 6h, identificação."
              : "Acompanhamento 0-30 dias — monitore ganho de peso e saúde geral.",
            severidade: diasVida <= 3 ? "alta" : "media",
          });
        }
      }
    }

    // Lote discrepante
    const loteMap: Record<string, typeof animais> = {};
    for (const a of animais) {
      if (!a.lote_nome) continue;
      if (!loteMap[a.lote_nome]) loteMap[a.lote_nome] = [];
      loteMap[a.lote_nome].push(a);
    }
    for (const [loteNome, animaisLote] of Object.entries(loteMap)) {
      const comPeso = animaisLote.filter(a => a.peso_atual !== null);
      if (comPeso.length < 2) continue;
      const pesos  = comPeso.map(a => a.peso_atual as number);
      const maxP   = Math.max(...pesos);
      const minP   = Math.min(...pesos);
      const diff   = Math.round((maxP - minP) * 10) / 10;
      if (diff > 5) {
        const maisLeve   = comPeso.find(a => a.peso_atual === minP)!;
        const maisPesado = comPeso.find(a => a.peso_atual === maxP)!;
        lista.push({
          id: "lote_" + loteNome, tipo: "lote_discrepante",
          animal_id: maisLeve.id, brinco: maisLeve.brinco, sexo: maisLeve.sexo, lote_nome: loteNome,
          mensagem: "Pesos discrepantes — Lote " + loteNome,
          detalhe: "Diferença de " + diff + " kg entre #" + maisLeve.brinco + " (" + minP + "kg) e #" + maisPesado.brinco + " (" + maxP + "kg). Considere separar os menores.",
          severidade: diff > 10 ? "alta" : "media",
        });
      }
    }

    return lista;
  }, [animais, fazenda]);

  // Converter alertas custom para o formato padrão
  const alertasCustomFormatados: Alerta[] = alertasCustom.map(c => {
    const animal = c.animal_id ? animais.find(a => a.id === c.animal_id) : null;
    return {
      id:         "custom_" + c.id,
      tipo:       "custom" as TipoAlerta,
      animal_id:  c.animal_id,
      brinco:     animal?.brinco ?? null,
      sexo:       animal?.sexo ?? null,
      lote_nome:  c.lote_nome,
      mensagem:   c.mensagem,
      detalhe:    c.detalhe,
      severidade: c.severidade,
      resolvido:  c.resolvido,
      custom:     true,
    };
  });

  const todos = [...alertasAutomaticos, ...alertasCustomFormatados]
    .sort((a, b) => {
      const ordem = { alta: 0, media: 1, info: 2 };
      return ordem[a.severidade] - ordem[b.severidade];
    });

  const porSeveridade = {
    alta:  todos.filter(a => a.severidade === "alta").length,
    media: todos.filter(a => a.severidade === "media").length,
    info:  todos.filter(a => a.severidade === "info").length,
  };

  return {
    alertas: todos,
    alertasCustom,
    loading: loadingAnimais || loadingCustom,
    porSeveridade,
    criarAlertaCustom,
    resolverAlerta,
    excluirAlerta,
    recarregar: carregarCustom,
  };
}
