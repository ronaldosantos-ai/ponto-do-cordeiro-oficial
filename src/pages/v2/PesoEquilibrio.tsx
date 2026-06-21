import BotaoVoltar from "@/components/v2/BotaoVoltar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFazenda } from "@/hooks/useFazenda";
import { useAnimais } from "@/hooks/useAnimais";

interface ResultadoAnimal {
  id: string;
  brinco: string;
  sexo: string;
  peso_atual: number | null;
  gmd: number | null;
  custo_total: number;
  peso_equilibrio: number;
  dias_restantes: number | null;
  margem_projetada: number | null;
  status_financeiro: "lucro" | "prejuizo" | "no_ponto" | "sem_dados";
}

export default function PesoEquilibrio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fazenda } = useFazenda();
  const { animais } = useAnimais();

  const [custosPorAnimal, setCustosPorAnimal] = useState<Record<string, number>>({});
  const [custoGeral, setCustoGeral]           = useState(0);
  const [loading, setLoading]                 = useState(true);

  // Parâmetros editáveis pelo usuário
  const [precoVenda, setPrecoVenda]     = useState(fazenda?.preco_venda?.toString() ?? "10.50");
  const [custoDiario, setCustoDiario]   = useState(fazenda?.custo_diario?.toString() ?? "3.20");
  const [pesoMeta, setPesoMeta]         = useState(fazenda?.meta_peso_kg?.toString() ?? "40");

  useEffect(() => {
    if (!user) return;
    carregarCustos();
  }, [user, animais]);

  async function carregarCustos() {
    setLoading(true);
    const { data } = await supabase
      .from("custos")
      .select("animal_id, valor")
      .eq("user_id", user!.id);

    const porAnimal: Record<string, number> = {};
    let totalGeral = 0;

    for (const c of data ?? []) {
      totalGeral += Number(c.valor);
      if (c.animal_id) {
        porAnimal[c.animal_id] = (porAnimal[c.animal_id] ?? 0) + Number(c.valor);
      }
    }

    setCustosPorAnimal(porAnimal);
    setCustoGeral(totalGeral);
    setLoading(false);
  }

  const preco   = parseFloat(precoVenda)  || 0;
  const diario  = parseFloat(custoDiario) || 0;
  const metaKg  = parseFloat(pesoMeta)    || 40;

  // Distribuir custos gerais (sem animal específico) proporcionalmente
  const custoGeralPorAnimal = animais.length > 0
    ? (custoGeral - Object.values(custosPorAnimal).reduce((a, b) => a + b, 0)) / animais.length
    : 0;

  const resultados: ResultadoAnimal[] = animais.map(a => {
    const custoEspecifico = custosPorAnimal[a.id] ?? 0;
    const custoTotal      = custoEspecifico + Math.max(0, custoGeralPorAnimal);

    // Peso de equilíbrio = custo total / preço por kg
    const pesoEquilibrio = preco > 0 ? custoTotal / preco : 0;

    const pesoAtual = a.peso_atual ?? 0;
    const gmd       = a.gmd ?? 0;

    // Dias restantes para atingir o peso meta
    let diasRestantes: number | null = null;
    if (gmd > 0 && pesoAtual < metaKg) {
      diasRestantes = Math.ceil(((metaKg - pesoAtual) / gmd) * 1000);
    } else if (pesoAtual >= metaKg) {
      diasRestantes = 0;
    }

    // Custo projetado incluindo dias restantes
    const custoProjetado = custoTotal + (diasRestantes ? diasRestantes * diario : 0);
    const receitaProjetada = metaKg * preco;
    const margemProjetada  = preco > 0 ? receitaProjetada - custoProjetado : null;

    let statusFinanceiro: ResultadoAnimal["status_financeiro"] = "sem_dados";
    if (preco > 0 && custoTotal > 0) {
      if (pesoAtual >= pesoEquilibrio + 2)       statusFinanceiro = "lucro";
      else if (pesoAtual < pesoEquilibrio - 2)   statusFinanceiro = "prejuizo";
      else                                        statusFinanceiro = "no_ponto";
    }

    return {
      id:               a.id,
      brinco:           a.brinco,
      sexo:             a.sexo,
      peso_atual:       a.peso_atual,
      gmd:              a.gmd,
      custo_total:      custoTotal,
      peso_equilibrio:  Math.round(pesoEquilibrio * 10) / 10,
      dias_restantes:   diasRestantes,
      margem_projetada: margemProjetada !== null ? Math.round(margemProjetada * 100) / 100 : null,
      status_financeiro: statusFinanceiro,
    };
  }).sort((a, b) => {
    // Ordenar por: prejuízo primeiro, depois no ponto, depois lucro
    const ordem = { prejuizo: 0, no_ponto: 1, lucro: 2, sem_dados: 3 };
    return ordem[a.status_financeiro] - ordem[b.status_financeiro];
  });

  const totalLucro    = resultados.filter(r => r.status_financeiro === "lucro").length;
  const totalPrejuizo = resultados.filter(r => r.status_financeiro === "prejuizo").length;
  const margemTotal   = resultados.reduce((s, r) => s + (r.margem_projetada ?? 0), 0);

  const statusCor: Record<string, { bg: string; cor: string; label: string }> = {
    lucro:    { bg: "hsl(113,48%,10%)", cor: "hsl(113,48%,62%)", label: "No lucro"   },
    prejuizo: { bg: "hsl(0,65%,12%)",   cor: "hsl(0,65%,62%)",   label: "Prejuízo"   },
    no_ponto: { bg: "hsl(36,50%,12%)",  cor: "hsl(36,75%,62%)",  label: "No limite"  },
    sem_dados:{ bg: "hsl(100,18%,15%)", cor: "hsl(100,18%,50%)", label: "Sem dados"  },
  };

  return (
    <div className="page">
      <BotaoVoltar para="/relatorios" />
      <style>{`
        .eq-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        @media (max-width: 767px) { .eq-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* Parâmetros */}
      <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
        border: "0.5px solid hsl(100,18%,18%)", padding: "16px", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)", marginBottom: 14 }}>
          Parâmetros do cálculo
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>Preço venda (R$/kg)</p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", fontSize: 12, color: "hsl(100,18%,50%)" }}>R$</span>
              <input className="field" type="number" step="0.01"
                value={precoVenda} onChange={e => setPrecoVenda(e.target.value)}
                style={{ paddingLeft: 28, fontSize: 13 }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>Custo diário/cab.</p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", fontSize: 12, color: "hsl(100,18%,50%)" }}>R$</span>
              <input className="field" type="number" step="0.01"
                value={custoDiario} onChange={e => setCustoDiario(e.target.value)}
                style={{ paddingLeft: 28, fontSize: 13 }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>Peso alvo (kg)</p>
            <input className="field" type="number" step="0.5"
              value={pesoMeta} onChange={e => setPesoMeta(e.target.value)}
              style={{ fontSize: 13 }} />
          </div>
        </div>
      </div>

      {/* Resumo geral */}
      <div className="eq-grid">
        {[
          { valor: animais.length,    label: "Animais",          cor: "hsl(95,30%,92%)",  bg: "hsl(100,18%,15%)" },
          { valor: totalLucro,        label: "No lucro",         cor: "hsl(113,48%,62%)", bg: "hsl(113,48%,10%)" },
          { valor: totalPrejuizo,     label: "Em prejuízo",      cor: "hsl(0,65%,62%)",   bg: "hsl(0,65%,12%)"   },
        ].map((k, i) => (
          <div key={i} style={{ borderRadius: 12, padding: "12px 14px",
            background: k.bg, border: "0.5px solid hsl(100,18%,20%)" }}>
            <p style={{ fontSize: 24, fontWeight: 600, color: k.cor, lineHeight: 1 }}>{k.valor}</p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Margem total projetada */}
      {margemTotal !== 0 && (
        <div style={{
          borderRadius: 12, padding: "14px 16px", marginBottom: 16,
          background: margemTotal > 0 ? "hsl(113,48%,10%)" : "hsl(0,65%,12%)",
          border: "0.5px solid " + (margemTotal > 0 ? "hsl(113,48%,22%)" : "hsl(0,65%,25%)"),
        }}>
          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginBottom: 4 }}>
            Margem total projetada (todos os animais)
          </p>
          <p style={{ fontSize: 22, fontWeight: 600,
            color: margemTotal > 0 ? "hsl(113,48%,62%)" : "hsl(0,65%,62%)" }}>
            R$ {margemTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}

      {/* Lista por animal */}
      <p className="section-label">Por animal</p>

      {loading && (
        <div style={{ textAlign: "center", padding: 32, color: "hsl(100,18%,40%)", fontSize: 13 }}>
          Calculando...
        </div>
      )}

      {!loading && animais.length === 0 && (
        <div style={{ textAlign: "center", padding: 32 }}>
          <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", marginBottom: 16 }}>
            Cadastre animais para ver o ponto de equilíbrio
          </p>
          <button className="btn-primary" onClick={() => navigate("/rebanho/novo")}
            style={{ maxWidth: 220, margin: "0 auto" }}>
            + Cadastrar animal
          </button>
        </div>
      )}

      {!loading && resultados.map((r, i) => {
        const st = statusCor[r.status_financeiro];
        return (
          <div key={r.id} onClick={() => navigate("/rebanho/" + r.id)}
            style={{ background: "hsl(100,18%,13%)", borderRadius: 12,
              border: "0.5px solid hsl(100,18%,18%)", marginBottom: 8, cursor: "pointer",
              overflow: "hidden" }}>

            {/* Cabeçalho do card */}
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "12px 14px",
              borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8,
                  background: "hsl(100,18%,20%)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {r.sexo === "M" ? "♂" : "♀"}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                    #{r.brinco}
                  </p>
                  <p style={{ fontSize: 11, color: "hsl(100,18%,50%)" }}>
                    {r.peso_atual ? r.peso_atual + " kg atual" : "Sem pesagem"}
                    {r.gmd ? " · " + r.gmd + "g/d" : ""}
                  </p>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px",
                borderRadius: 6, background: st.bg, color: st.cor }}>
                {st.label}
              </span>
            </div>

            {/* Dados financeiros */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              padding: "10px 14px", gap: 8 }}>
              <div>
                <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginBottom: 2 }}>
                  Custo total
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(0,65%,62%)" }}>
                  {r.custo_total > 0
                    ? "R$ " + r.custo_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                    : "—"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginBottom: 2 }}>
                  Peso equilíbrio
                </p>
                <p style={{ fontSize: 13, fontWeight: 500,
                  color: r.peso_equilibrio > 0 ? "hsl(36,75%,62%)" : "hsl(100,18%,45%)" }}>
                  {r.peso_equilibrio > 0 ? r.peso_equilibrio + " kg" : "—"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginBottom: 2 }}>
                  Margem projetada
                </p>
                <p style={{ fontSize: 13, fontWeight: 500,
                  color: r.margem_projetada !== null
                    ? r.margem_projetada >= 0 ? "hsl(113,48%,62%)" : "hsl(0,65%,62%)"
                    : "hsl(100,18%,45%)" }}>
                  {r.margem_projetada !== null
                    ? "R$ " + r.margem_projetada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Barra de progresso: peso atual vs equilíbrio vs meta */}
            {r.peso_atual && r.peso_equilibrio > 0 && (
              <div style={{ padding: "0 14px 12px" }}>
                <div style={{ height: 6, borderRadius: 3,
                  background: "hsl(100,18%,22%)", position: "relative", overflow: "hidden" }}>
                  {/* Barra de progresso até a meta */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, height: "100%",
                    width: Math.min(100, (r.peso_atual / metaKg) * 100) + "%",
                    borderRadius: 3,
                    background: r.status_financeiro === "lucro"   ? "hsl(113,48%,55%)"
                               : r.status_financeiro === "prejuizo" ? "hsl(0,65%,55%)"
                               : "hsl(36,75%,55%)",
                    transition: "width 0.3s",
                  }} />
                  {/* Marcador do peso de equilíbrio */}
                  <div style={{
                    position: "absolute", top: -2, height: 10, width: 2,
                    background: "hsl(36,75%,70%)",
                    left: Math.min(98, (r.peso_equilibrio / metaKg) * 100) + "%",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "hsl(100,18%,40%)" }}>
                    {r.peso_atual} kg
                  </span>
                  <span style={{ fontSize: 10, color: "hsl(36,75%,50%)" }}>
                    equil. {r.peso_equilibrio} kg
                  </span>
                  <span style={{ fontSize: 10, color: "hsl(100,18%,40%)" }}>
                    meta {metaKg} kg
                  </span>
                </div>
              </div>
            )}

            {/* Dias restantes */}
            {r.dias_restantes !== null && r.dias_restantes > 0 && (
              <div style={{ padding: "0 14px 12px" }}>
                <p style={{ fontSize: 11, color: "hsl(100,18%,40%)" }}>
                  Estimativa: <span style={{ color: "hsl(95,30%,75%)", fontWeight: 500 }}>
                    {r.dias_restantes} dias
                  </span> para atingir {metaKg} kg
                  {r.gmd ? " (GMD " + r.gmd + "g/d)" : ""}
                </p>
              </div>
            )}
            {r.dias_restantes === 0 && (
              <div style={{ padding: "0 14px 12px" }}>
                <p style={{ fontSize: 11, color: "hsl(113,48%,55%)", fontWeight: 500 }}>
                  ✓ Atingiu o peso alvo — pronto para venda
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
