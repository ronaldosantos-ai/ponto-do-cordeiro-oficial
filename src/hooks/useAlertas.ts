import { useMemo } from "react";
import { useAnimais } from "./useAnimais";
import { useFazenda } from "./useFazenda";

export type TipoAlerta =
  | "gmd_baixo"
  | "refugo"
  | "lote_discrepante"
  | "recem_nascido"
  | "pronto_venda";

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  animal_id: string;
  brinco: string;
  sexo: string;
  lote_nome: string | null;
  mensagem: string;
  detalhe: string | null;
  severidade: "alta" | "media" | "info";
}

export function useAlertas() {
  const { animais, loading } = useAnimais();
  const { fazenda } = useFazenda();

  const alertas = useMemo(() => {
    if (!animais.length || !fazenda) return [];

    const lista: Alerta[] = [];
    const metaGMD  = fazenda.meta_gmd_g  ?? 133;
    const metaPeso = fazenda.meta_peso_kg ?? 40;

    // ── 1. GMD abaixo da meta e refugo ────────────────────────
    for (const a of animais) {
      if (a.gmd !== null && a.gmd !== undefined) {
        if (a.gmd < metaGMD * 0.7) {
          lista.push({
            id:         "refugo_" + a.id,
            tipo:       "refugo",
            animal_id:  a.id,
            brinco:     a.brinco,
            sexo:       a.sexo,
            lote_nome:  a.lote_nome,
            mensagem:   "Sugestão de descarte",
            detalhe:    "GMD de " + a.gmd + "g/dia — muito abaixo da meta de " + metaGMD + "g. Verifique saúde e manejo.",
            severidade: "alta",
          });
        } else if (a.gmd < metaGMD) {
          lista.push({
            id:         "gmd_" + a.id,
            tipo:       "gmd_baixo",
            animal_id:  a.id,
            brinco:     a.brinco,
            sexo:       a.sexo,
            lote_nome:  a.lote_nome,
            mensagem:   "GMD abaixo da meta",
            detalhe:    "GMD de " + a.gmd + "g/dia — meta é " + metaGMD + "g. Verifique limpeza de bebedouros e altura do cocho.",
            severidade: "media",
          });
        }
      }

      // ── 2. Pronto para venda ───────────────────────────────
      if (a.peso_atual !== null && a.peso_atual >= metaPeso) {
        lista.push({
          id:         "pronto_" + a.id,
          tipo:       "pronto_venda",
          animal_id:  a.id,
          brinco:     a.brinco,
          sexo:       a.sexo,
          lote_nome:  a.lote_nome,
          mensagem:   "Pronto para venda",
          detalhe:    "Atingiu " + a.peso_atual + " kg — meta de " + metaPeso + " kg alcançada.",
          severidade: "info",
        });
      }

      // ── 3. Protocolo recém-nascido (0–30 dias) ─────────────
      if (a.data_nascimento) {
        const nascimento = new Date(a.data_nascimento);
        const hoje       = new Date();
        const diasVida   = Math.floor(
          (hoje.getTime() - nascimento.getTime()) / 86400000
        );

        if (diasVida >= 0 && diasVida <= 30) {
          lista.push({
            id:         "recem_" + a.id,
            tipo:       "recem_nascido",
            animal_id:  a.id,
            brinco:     a.brinco,
            sexo:       a.sexo,
            lote_nome:  a.lote_nome,
            mensagem:   "Protocolo recém-nascido (" + diasVida + " dias)",
            detalhe:    diasVida === 0
              ? "Nasceu hoje — verifique: cura do umbigo com iodo 10%, colostro nas primeiras 6h, identificação."
              : diasVida <= 3
              ? "Primeiros dias críticos — confirme ingestão de colostro e cura do umbigo."
              : "Acompanhamento 0-30 dias — monitore ganho de peso e saúde geral.",
            severidade: diasVida <= 3 ? "alta" : "media",
          });
        }
      }
    }

    // ── 4. Lote com pesos discrepantes (> 5 kg) ───────────────
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
        const maisLeve = comPeso.find(a => a.peso_atual === minP)!;
        const maisPesado = comPeso.find(a => a.peso_atual === maxP)!;
        lista.push({
          id:         "lote_" + loteNome,
          tipo:       "lote_discrepante",
          animal_id:  maisLeve.id,
          brinco:     maisLeve.brinco,
          sexo:       maisLeve.sexo,
          lote_nome:  loteNome,
          mensagem:   "Pesos discrepantes no lote " + loteNome,
          detalhe:    "Diferença de " + diff + " kg entre animais (" +
            minP + " kg e " + maxP + " kg). Considere separar animais menores para evitar dominância no cocho. " +
            "Menor: #" + maisLeve.brinco + " · Maior: #" + maisPesado.brinco,
          severidade: diff > 10 ? "alta" : "media",
        });
      }
    }

    // Ordenar: alta → media → info
    const ordem = { alta: 0, media: 1, info: 2 };
    return lista.sort((a, b) => ordem[a.severidade] - ordem[b.severidade]);
  }, [animais, fazenda]);

  const porSeveridade = {
    alta:  alertas.filter(a => a.severidade === "alta").length,
    media: alertas.filter(a => a.severidade === "media").length,
    info:  alertas.filter(a => a.severidade === "info").length,
  };

  return { alertas, loading, porSeveridade };
}
