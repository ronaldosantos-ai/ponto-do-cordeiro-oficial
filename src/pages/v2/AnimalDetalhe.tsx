import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnimais } from "@/hooks/useAnimais";

interface Pesagem {
  id: string;
  data_pesagem: string;
  peso_kg: number;
  observacoes: string | null;
}

interface Observacao {
  id: string;
  data: string;
  texto: string;
}

// ── Modal de edição de pesagem ──────────────────────────────────────────────
function ModalEditarPesagem({ pesagem, onSalvar, onFechar }: {
  pesagem: Pesagem;
  onSalvar: (id: string, peso: number, data: string) => Promise<void>;
  onFechar: () => void;
}) {
  const [peso, setPeso] = useState(String(pesagem.peso_kg));
  const [data, setData] = useState(pesagem.data_pesagem.slice(0, 10));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!peso || isNaN(Number(peso))) return;
    setSalvando(true);
    await onSalvar(pesagem.id, Number(peso), data);
    setSalvando(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "flex-end", justifyContent: "center",
    }} onClick={onFechar}>
      <div style={{
        background: "hsl(100,18%,13%)", borderRadius: "16px 16px 0 0",
        padding: "24px 20px 32px", width: "100%", maxWidth: 480,
      }} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
          ✏️ Editar pesagem
        </p>
        <p style={{ fontSize: 12, color: "hsl(100,18%,45%)", marginBottom: 4 }}>Peso (kg)</p>
        <input className="field" type="number" step="0.1" value={peso}
          onChange={e => setPeso(e.target.value)}
          style={{ marginBottom: 14 }} />
        <p style={{ fontSize: 12, color: "hsl(100,18%,45%)", marginBottom: 4 }}>Data</p>
        <input className="field" type="date" value={data}
          onChange={e => setData(e.target.value)}
          style={{ marginBottom: 24 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onFechar} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: "transparent", border: "0.5px solid hsl(100,18%,25%)",
            color: "hsl(100,18%,55%)", fontSize: 14, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={salvar} disabled={salvando} style={{
            flex: 2, padding: "12px", borderRadius: 12,
            background: "hsl(113,48%,40%)", border: "none",
            color: "hsl(100,20%,10%)", fontSize: 14, fontWeight: 600,
            cursor: "pointer", opacity: salvando ? 0.7 : 1 }}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de edição de observação ───────────────────────────────────────────
function ModalEditarObs({ obs, onSalvar, onFechar }: {
  obs: Observacao;
  onSalvar: (id: string, texto: string) => Promise<void>;
  onFechar: () => void;
}) {
  const [texto, setTexto] = useState(obs.texto);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!texto.trim()) return;
    setSalvando(true);
    await onSalvar(obs.id, texto.trim());
    setSalvando(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "flex-end", justifyContent: "center",
    }} onClick={onFechar}>
      <div style={{
        background: "hsl(100,18%,13%)", borderRadius: "16px 16px 0 0",
        padding: "24px 20px 32px", width: "100%", maxWidth: 480,
      }} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 4 }}>
          ✏️ Editar observação
        </p>
        <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 16 }}>
          {new Date(obs.data).toLocaleDateString("pt-BR")}
        </p>
        <textarea className="field" rows={4} value={texto}
          onChange={e => setTexto(e.target.value)}
          style={{ marginBottom: 24, resize: "none" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onFechar} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: "transparent", border: "0.5px solid hsl(100,18%,25%)",
            color: "hsl(100,18%,55%)", fontSize: 14, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={salvar} disabled={salvando} style={{
            flex: 2, padding: "12px", borderRadius: 12,
            background: "hsl(113,48%,40%)", border: "none",
            color: "hsl(100,20%,10%)", fontSize: 14, fontWeight: 600,
            cursor: "pointer", opacity: salvando ? 0.7 : 1 }}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ────────────────────────────────────────────────────────
export default function AnimalDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animais } = useAnimais();

  const animalCache = animais.find(a => a.id === id) ?? null;

  const [pesagens, setPesagens]       = useState<Pesagem[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [loteNome, setLoteNome]       = useState<string | null>(animalCache?.lote_nome ?? null);
  const [loadingPesagens, setLoadingPesagens] = useState(true);
  const [extra, setExtra] = useState<{
    data_nascimento: string | null;
    brinco_mae: string | null;
    brinco_pai: string | null;
    observacoes: string | null;
  } | null>(null);

  // Modo edição
  const [modoEditar, setModoEditar]         = useState(false);
  const [editandoPesagem, setEditandoPesagem] = useState<Pesagem | null>(null);
  const [editandoObs, setEditandoObs]         = useState<Observacao | null>(null);

  useEffect(() => {
    if (!id) return;
    carregarDetalhes();
  }, [id]);

  async function carregarDetalhes() {
    setLoadingPesagens(true);
    const [animalRes, obsRes] = await Promise.all([
      supabase
        .from("animais")
        .select("data_nascimento, brinco_mae, brinco_pai, observacoes, lotes(nome), pesagens(id, data_pesagem, peso_kg, observacoes)")
        .eq("id", id)
        .single(),
      supabase
        .from("observacoes_animal")
        .select("id, data, texto")
        .eq("animal_id", id)
        .order("data", { ascending: false }),
    ]);

    if (animalRes.data) {
      setExtra({
        data_nascimento: animalRes.data.data_nascimento,
        brinco_mae: animalRes.data.brinco_mae,
        brinco_pai: animalRes.data.brinco_pai,
        observacoes: animalRes.data.observacoes,
      });
      setLoteNome((animalRes.data as any).lotes?.nome ?? null);
      const sorted = [...((animalRes.data as any).pesagens ?? [])].sort(
        (a: any, b: any) => new Date(a.data_pesagem).getTime() - new Date(b.data_pesagem).getTime()
      );
      setPesagens(sorted);
    }
    setObservacoes((obsRes.data ?? []) as Observacao[]);
    setLoadingPesagens(false);
  }

  async function salvarPesagem(pesId: string, peso: number, data: string) {
    await supabase.from("pesagens")
      .update({ peso_kg: peso, data_pesagem: data })
      .eq("id", pesId);
    setEditandoPesagem(null);
    carregarDetalhes();
  }

  async function salvarObs(obsId: string, texto: string) {
    await supabase.from("observacoes_animal")
      .update({ texto })
      .eq("id", obsId);
    setEditandoObs(null);
    carregarDetalhes();
  }

  if (!animalCache && loadingPesagens) return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <p style={{ color: "hsl(100,18%,45%)" }}>Carregando...</p>
    </div>
  );

  if (!animalCache) return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <p style={{ color: "hsl(0,65%,55%)" }}>Animal não encontrado</p>
      <button className="btn-secondary" onClick={() => navigate("/rebanho")}
        style={{ marginTop: 16 }}>Voltar</button>
    </div>
  );

  const pesoAtual = animalCache.peso_atual ?? null;
  const gmd       = animalCache.gmd ?? null;
  const dias      = animalCache.dias ?? null;
  const gmdOk     = gmd !== null && gmd >= 133;
  const status    = animalCache.status;

  const badgeCls   = status === "pronto" ? "badge-pronto" : status === "atencao" ? "badge-atencao" : status === "refugo" ? "badge-refugo" : "badge-pronto";
  const badgeLabel = status === "pronto" ? "Pronto" : status === "atencao" ? "Atenção" : status === "refugo" ? "Refugo" : "Normal";

  return (
    <div className="page">
      {/* Modais */}
      {editandoPesagem && (
        <ModalEditarPesagem
          pesagem={editandoPesagem}
          onSalvar={salvarPesagem}
          onFechar={() => setEditandoPesagem(null)}
        />
      )}
      {editandoObs && (
        <ModalEditarObs
          obs={editandoObs}
          onSalvar={salvarObs}
          onFechar={() => setEditandoObs(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={() => navigate("/rebanho")} style={{
          background: "none", border: "none", color: "hsl(113,48%,60%)",
          fontSize: 14, cursor: "pointer", padding: 0 }}>
          ← Rebanho
        </button>
        {/* Lápis de edição */}
        <button onClick={() => setModoEditar(o => !o)} style={{
          background: modoEditar ? "hsl(113,48%,15%)" : "transparent",
          border: `0.5px solid ${modoEditar ? "hsl(113,48%,35%)" : "hsl(100,18%,25%)"}`,
          borderRadius: 8, width: 36, height: 36, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          ✏️
        </button>
      </div>

      {modoEditar && (
        <div style={{
          background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,25%)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 16,
          fontSize: 12, color: "hsl(113,48%,55%)"
        }}>
          Modo edição ativo — toque em qualquer pesagem ou observação para editar
        </div>
      )}

      {/* Identidade */}
      <div className="stat-card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)" }}>
              #{animalCache.brinco}
            </p>
            <p style={{ fontSize: 13, color: "hsl(100,18%,55%)", marginTop: 4 }}>
              {animalCache.sexo === "M" ? "Macho" : "Fêmea"}
              {animalCache.raca ? " · " + animalCache.raca : ""}
              {loteNome ? " · Lote " + loteNome : ""}
            </p>
          </div>
          <span className={badgeCls}>{badgeLabel}</span>
        </div>
        {extra && (extra.data_nascimento || extra.brinco_mae || extra.brinco_pai) && (
          <div style={{ borderTop: "0.5px solid hsl(100,18%,22%)", marginTop: 12, paddingTop: 12,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {extra.data_nascimento && (
              <div>
                <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Nascimento</p>
                <p style={{ fontSize: 13, color: "hsl(95,30%,85%)" }}>
                  {new Date(extra.data_nascimento).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            {(extra.brinco_mae || extra.brinco_pai) && (
              <div>
                <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Mãe / Pai</p>
                <p style={{ fontSize: 13, color: "hsl(95,30%,85%)" }}>
                  {extra.brinco_mae ?? "—"} / {extra.brinco_pai ?? "—"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desempenho */}
      <p className="section-label">Desempenho</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div className={"stat-card " + (gmd === null ? "" : gmdOk ? "stat-card-good" : "stat-card-alert")}>
          <p style={{ fontSize: 26, fontWeight: 600, lineHeight: 1,
            color: gmd === null ? "hsl(100,18%,50%)" : gmdOk ? "hsl(113,48%,62%)" : "hsl(36,75%,62%)" }}>
            {gmd !== null ? gmd + "g" : "—"}
          </p>
          <p style={{ fontSize: 11, marginTop: 4,
            color: gmd === null ? "hsl(100,18%,40%)" : gmdOk ? "hsl(113,48%,38%)" : "hsl(36,75%,42%)" }}>
            GMD/dia {gmd !== null ? (gmdOk ? "✓ acima da meta" : "⚠ abaixo da meta") : "sem dados"}
          </p>
        </div>
        <div className="stat-card">
          <p style={{ fontSize: 26, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
            {pesoAtual !== null ? pesoAtual + " kg" : "—"}
          </p>
          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>
            Peso atual {dias ? "· " + dias + " dias" : ""}
          </p>
        </div>
      </div>

      {/* Histórico de pesagens */}
      <p className="section-label">Histórico de pesagens</p>
      {loadingPesagens ? (
        <div style={{ padding: "16px 0", color: "hsl(100,18%,40%)", fontSize: 13, textAlign: "center" }}>
          Carregando pesagens...
        </div>
      ) : pesagens.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: "hsl(100,18%,45%)", fontSize: 13 }}>
          Nenhuma pesagem registrada
        </div>
      ) : (
        [...pesagens].reverse().map((p, i) => (
          <div key={p.id} className="animal-row"
            onClick={() => modoEditar && setEditandoPesagem(p)}
            style={{ cursor: modoEditar ? "pointer" : "default",
              background: modoEditar ? "hsl(100,18%,14%)" : undefined }}>
            <div>
              <p style={{ fontSize: 14, color: "hsl(95,30%,85%)" }}>
                {new Date(p.data_pesagem).toLocaleDateString("pt-BR")}
              </p>
              {modoEditar && (
                <p style={{ fontSize: 11, color: "hsl(113,48%,50%)", marginTop: 2 }}>
                  Toque para editar
                </p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,92%)" }}>
                {p.peso_kg} kg
              </p>
              {modoEditar && <span style={{ fontSize: 14 }}>✏️</span>}
            </div>
          </div>
        ))
      )}

      {/* Observações */}
      {!loadingPesagens && observacoes.length > 0 && (
        <>
          <p className="section-label" style={{ marginTop: 20 }}>
            Observações
            <span style={{ marginLeft: 8, fontSize: 11, color: "hsl(100,18%,45%)", fontWeight: 400, fontStyle: "italic" }}>
              {observacoes.length} registro{observacoes.length > 1 ? "s" : ""}
            </span>
          </p>
          <div style={{ borderRadius: 12, border: "0.5px solid hsl(100,18%,20%)", overflow: "hidden" }}>
            <div style={{ maxHeight: 160, overflowY: observacoes.length > 2 ? "auto" : "hidden" }}>
              {observacoes.map((obs, i) => (
                <div key={obs.id}
                  onClick={() => modoEditar && setEditandoObs(obs)}
                  style={{
                    padding: "12px 14px",
                    borderBottom: i < observacoes.length - 1 ? "0.5px solid hsl(100,18%,18%)" : "none",
                    background: i === 0 ? "hsl(100,18%,14%)" : "hsl(100,18%,12%)",
                    cursor: modoEditar ? "pointer" : "default",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "hsl(113,48%,50%)", fontWeight: 500 }}>
                      {i === 0 ? "📌 Mais recente" : new Date(obs.data).toLocaleDateString("pt-BR")}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {i === 0 && <span style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>{new Date(obs.data).toLocaleDateString("pt-BR")}</span>}
                      {modoEditar && <span style={{ fontSize: 13 }}>✏️</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "hsl(95,30%,82%)", lineHeight: 1.5, margin: 0 }}>
                    {obs.texto}
                  </p>
                </div>
              ))}
            </div>
            {observacoes.length > 2 && (
              <div style={{ padding: "6px 14px", background: "linear-gradient(to bottom, hsl(100,18%,11%), hsl(100,18%,13%))",
                borderTop: "0.5px solid hsl(100,18%,18%)", textAlign: "center" }}>
                <span style={{ fontSize: 11, color: "hsl(100,18%,40%)" }}>
                  ↕ Role para ver todas as {observacoes.length} observações
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {!loadingPesagens && observacoes.length === 0 && extra?.observacoes && (
        <>
          <p className="section-label" style={{ marginTop: 20 }}>Observações</p>
          <div className="stat-card stat-card-alert">
            <p style={{ fontSize: 14, color: "hsl(36,75%,70%)" }}>{extra.observacoes}</p>
          </div>
        </>
      )}

      <button className="btn-primary"
        onClick={() => navigate("/pesagem?animal_id=" + id + "&brinco=" + animalCache.brinco)}
        style={{ marginTop: 24 }}>
        + Registrar pesagem
      </button>
    </div>
  );
}
