import BotaoVoltar from "@/components/v2/BotaoVoltar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFazenda } from "@/hooks/useFazenda";
import { useAnimais } from "@/hooks/useAnimais";

interface Lote {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
}

export default function Lotes() {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const { fazenda } = useFazenda();
  const { animais, loading: loadingAnimais } = useAnimais();
  const [lotes, setLotes]       = useState<Lote[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    carregarLotes();
  }, [user]);

  async function carregarLotes() {
    setLoading(true);
    const { data } = await supabase
      .from("lotes")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setLotes((data ?? []) as Lote[]);
    setLoading(false);
  }

  async function criarLote() {
    if (!novoNome.trim() || !user || !fazenda) return;
    setSalvando(true);
    await supabase.from("lotes").insert({
      user_id:    user.id,
      fazenda_id: fazenda.id,
      nome:       novoNome.trim(),
    });
    setNovoNome("");
    setShowForm(false);
    setSalvando(false);
    carregarLotes();
  }

  async function encerrarLote(id: string) {
    await supabase.from("lotes").update({ ativo: false }).eq("id", id);
    carregarLotes();
  }

  // Enriquecer lotes com dados dos animais
  const lotesEnriquecidos = lotes.map(lote => {
    const animaisLote = animais.filter(a => a.lote_id === lote.id);
    const comPeso     = animaisLote.filter(a => a.peso_atual !== null);

    const pesos       = comPeso.map(a => a.peso_atual as number);
    const pesoMax     = pesos.length ? Math.max(...pesos) : null;
    const pesoMin     = pesos.length ? Math.min(...pesos) : null;
    const pesoMedio   = pesos.length
      ? Math.round(pesos.reduce((s, p) => s + p, 0) / pesos.length * 10) / 10
      : null;
    const discrepancia = pesoMax !== null && pesoMin !== null
      ? Math.round((pesoMax - pesoMin) * 10) / 10
      : null;

    const gmdMedio = animaisLote.filter(a => a.gmd).length
      ? Math.round(animaisLote.filter(a => a.gmd).reduce((s, a) => s + (a.gmd ?? 0), 0) /
          animaisLote.filter(a => a.gmd).length)
      : null;

    const prontos  = animaisLote.filter(a => a.status === "pronto").length;
    const atencao  = animaisLote.filter(a => a.status === "atencao").length;
    const refugo   = animaisLote.filter(a => a.status === "refugo").length;

    return {
      ...lote,
      animaisLote,
      total:       animaisLote.length,
      pesoMedio,
      pesoMin,
      pesoMax,
      discrepancia,
      gmdMedio,
      prontos,
      atencao,
      refugo,
      alertaDiscrepancia: discrepancia !== null && discrepancia > 5,
    };
  });

  return (
    <div className="page">
      <BotaoVoltar para="/rebanho" />

      {/* Resumo geral */}
      {!loading && lotes.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div style={{ borderRadius: 12, padding: "12px 14px",
            background: "hsl(100,18%,15%)", border: "0.5px solid hsl(100,18%,20%)" }}>
            <p style={{ fontSize: 24, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
              {lotes.filter(l => l.ativo).length}
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>Lotes ativos</p>
          </div>
          <div style={{ borderRadius: 12, padding: "12px 14px",
            background: "hsl(100,18%,15%)", border: "0.5px solid hsl(100,18%,20%)" }}>
            <p style={{ fontSize: 24, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
              {animais.length}
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>Animais distribuídos</p>
          </div>
        </div>
      )}

      {/* Formulário novo lote */}
      {showForm && (
        <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
          border: "0.5px solid hsl(100,18%,22%)", padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)", marginBottom: 12 }}>
            Novo lote
          </p>
          <input className="field" placeholder="Nome do lote (ex: Verão 2026, Lote A)"
            value={novoNome} onChange={e => setNovoNome(e.target.value)}
            style={{ marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={criarLote}
              disabled={salvando || !novoNome.trim()}
              style={{ flex: 1, opacity: salvando ? 0.7 : 1 }}>
              {salvando ? "Criando..." : "Criar lote"}
            </button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}
              style={{ flex: 1 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {(loading || loadingAnimais) && (
        <div style={{ textAlign: "center", padding: 40,
          color: "hsl(100,18%,40%)", fontSize: 13 }}>
          Carregando lotes...
        </div>
      )}

      {/* Sem lotes */}
      {!loading && !loadingAnimais && lotes.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>🐑</p>
          <p style={{ fontSize: 15, fontWeight: 500, color: "hsl(95,30%,80%)", marginBottom: 6 }}>
            Nenhum lote criado
          </p>
          <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", marginBottom: 20 }}>
            Agrupe seus animais por idade e peso para garantir homogeneidade
          </p>
          <button className="btn-primary" onClick={() => setShowForm(true)}
            style={{ maxWidth: 220, margin: "0 auto" }}>
            + Criar primeiro lote
          </button>
        </div>
      )}

      {/* Lista de lotes */}
      {!loading && !loadingAnimais && lotesEnriquecidos.map(lote => (
        <div key={lote.id} style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
          border: "0.5px solid " + (lote.alertaDiscrepancia ? "hsl(36,50%,25%)" : "hsl(100,18%,18%)"),
          marginBottom: 10, overflow: "hidden" }}>

          {/* Header do lote */}
          <div style={{ padding: "14px 16px",
            borderBottom: expandido === lote.id ? "0.5px solid hsl(100,18%,18%)" : "none",
            cursor: "pointer" }}
            onClick={() => setExpandido(expandido === lote.id ? null : lote.id)}>

            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "hsl(95,30%,92%)" }}>
                    {lote.nome}
                  </p>
                  {!lote.ativo && (
                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4,
                      background: "hsl(100,18%,20%)", color: "hsl(100,18%,45%)" }}>
                      encerrado
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "hsl(100,18%,45%)", marginTop: 3 }}>
                  {lote.total} animal{lote.total !== 1 ? "is" : ""}
                  {lote.pesoMedio ? " · " + lote.pesoMedio + " kg médio" : ""}
                  {lote.gmdMedio ? " · GMD " + lote.gmdMedio + "g" : ""}
                </p>
              </div>
              <span style={{ color: "hsl(100,18%,40%)", fontSize: 18, transition: "transform 0.2s",
                transform: expandido === lote.id ? "rotate(90deg)" : "none" }}>›</span>
            </div>

            {/* Badges de status */}
            {lote.total > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {lote.prontos > 0 && (
                  <span className="badge-pronto">{lote.prontos} pronto{lote.prontos > 1 ? "s" : ""}</span>
                )}
                {lote.atencao > 0 && (
                  <span className="badge-atencao">{lote.atencao} atenção</span>
                )}
                {lote.refugo > 0 && (
                  <span className="badge-refugo">{lote.refugo} refugo</span>
                )}
                {lote.alertaDiscrepancia && (
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 7px",
                    borderRadius: 4, background: "hsl(36,50%,14%)", color: "hsl(36,75%,62%)" }}>
                    ⚠ {lote.discrepancia} kg discrepância
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Detalhe expandido */}
          {expandido === lote.id && (
            <div>
              {/* Alerta de discrepância */}
              {lote.alertaDiscrepancia && (
                <div style={{ margin: "0 14px 12px", padding: "10px 12px",
                  borderRadius: 10, background: "hsl(36,50%,11%)",
                  border: "0.5px solid hsl(36,50%,22%)" }}>
                  <p style={{ fontSize: 12, color: "hsl(36,75%,62%)", fontWeight: 500, marginBottom: 4 }}>
                    ⚠ Pesos discrepantes no lote
                  </p>
                  <p style={{ fontSize: 12, color: "hsl(100,18%,55%)", lineHeight: 1.4 }}>
                    Diferença de {lote.discrepancia} kg entre os animais
                    ({lote.pesoMin} kg e {lote.pesoMax} kg).
                    Considere separar os menores para evitar dominância no cocho.
                  </p>
                </div>
              )}

              {/* Indicadores do lote */}
              {lote.total > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8, padding: "0 14px 12px" }}>
                  {[
                    { label: "Peso mín.",  valor: lote.pesoMin  ? lote.pesoMin  + " kg" : "—", cor: "hsl(0,65%,62%)"   },
                    { label: "Peso médio", valor: lote.pesoMedio ? lote.pesoMedio + " kg" : "—", cor: "hsl(95,30%,85%)" },
                    { label: "Peso máx.",  valor: lote.pesoMax  ? lote.pesoMax  + " kg" : "—", cor: "hsl(113,48%,60%)" },
                  ].map((k, i) => (
                    <div key={i} style={{ borderRadius: 10, padding: "10px 10px",
                      background: "hsl(100,18%,17%)", textAlign: "center" }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: k.cor, lineHeight: 1 }}>
                        {k.valor}
                      </p>
                      <p style={{ fontSize: 10, color: "hsl(100,18%,45%)", marginTop: 3 }}>{k.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Lista de animais do lote */}
              {lote.animaisLote.length === 0 ? (
                <div style={{ padding: "12px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "hsl(100,18%,40%)" }}>
                    Nenhum animal neste lote ainda
                  </p>
                </div>
              ) : (
                lote.animaisLote.map((a, i) => {
                  const badgeCls = a.status === "pronto"  ? "badge-pronto"
                    : a.status === "atencao" ? "badge-atencao"
                    : a.status === "refugo"  ? "badge-refugo"
                    : "badge-pronto";
                  const badgeLabel = a.status === "pronto"  ? "Pronto"
                    : a.status === "atencao" ? "Atenção"
                    : a.status === "refugo"  ? "Refugo"
                    : "Normal";
                  return (
                    <div key={a.id} onClick={() => navigate("/rebanho/" + a.id)}
                      style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "10px 16px", cursor: "pointer",
                        borderTop: "0.5px solid hsl(100,18%,16%)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8,
                          background: "hsl(100,18%,20%)", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: 14, flexShrink: 0 }}>
                          {a.sexo === "M" ? "♂" : "♀"}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                            #{a.brinco}
                          </p>
                          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)" }}>
                            {a.peso_atual ? a.peso_atual + " kg" : "Sem pesagem"}
                            {a.gmd ? " · " + a.gmd + "g/d" : ""}
                          </p>
                        </div>
                      </div>
                      <span className={badgeCls}>{badgeLabel}</span>
                    </div>
                  );
                })
              )}

              {/* Ações do lote */}
              <div style={{ padding: "12px 14px", borderTop: "0.5px solid hsl(100,18%,16%)",
                display: "flex", gap: 8 }}>
                <button onClick={() => navigate("/rebanho/novo")}
                  style={{ flex: 1, padding: "8px", borderRadius: 8,
                    background: "hsl(113,48%,14%)", border: "none",
                    color: "hsl(113,48%,60%)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  + Adicionar animal
                </button>
                {lote.ativo && (
                  <button onClick={() => encerrarLote(lote.id)}
                    style={{ padding: "8px 12px", borderRadius: 8,
                      border: "0.5px solid hsl(100,18%,25%)",
                      background: "transparent", color: "hsl(100,18%,50%)",
                      fontSize: 12, cursor: "pointer" }}>
                    Encerrar lote
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* FAB novo lote */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{
          position: "fixed", bottom: 80, right: 20,
          width: 52, height: 52, borderRadius: "50%",
          background: "hsl(113,48%,60%)", color: "hsl(100,20%,11%)",
          fontSize: 24, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px hsl(113,48%,20%,0.6)" }}>
          +
        </button>
      )}
    </div>
  );
}
