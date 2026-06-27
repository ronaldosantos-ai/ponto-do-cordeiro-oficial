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

export default function AnimalDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animais } = useAnimais();

  const animalCache = animais.find(a => a.id === id) ?? null;

  const [pesagens, setPesagens] = useState<Pesagem[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [loteNome, setLoteNome] = useState<string | null>(animalCache?.lote_nome ?? null);
  const [loadingPesagens, setLoadingPesagens] = useState(true);
  const [extra, setExtra] = useState<{
    data_nascimento: string | null;
    brinco_mae: string | null;
    brinco_pai: string | null;
    observacoes: string | null;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    carregarDetalhes();
  }, [id]);

  async function carregarDetalhes() {
    setLoadingPesagens(true);

    // Busca dados do animal + pesagens em paralelo com observações
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

  // Se não tem nem no cache, mostra loading
  if (!animalCache && loadingPesagens) return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <p style={{ color: "hsl(100,18%,45%)" }}>Carregando...</p>
    </div>
  );

  if (!animalCache) return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <p style={{ color: "hsl(0,65%,55%)" }}>Animal não encontrado</p>
      <button className="btn-secondary" onClick={() => navigate("/rebanho")}
        style={{ marginTop: 16, maxWidth: 200, margin: "16px auto 0" }}>
        Voltar
      </button>
    </div>
  );

  // Usa dados do cache para mostrar imediatamente
  const pesoAtual = animalCache.peso_atual ?? null;
  const gmd       = animalCache.gmd ?? null;
  const dias      = animalCache.dias ?? null;

  const gmdOk = gmd !== null && gmd >= 133;
  const status = animalCache.status;

  const badgeCls = status === "pronto" ? "badge-pronto"
    : status === "atencao" ? "badge-atencao"
    : status === "refugo"  ? "badge-refugo"
    : "badge-pronto";
  const badgeLabel = status === "pronto" ? "Pronto"
    : status === "atencao" ? "Atenção"
    : status === "refugo"  ? "Refugo"
    : "Normal";

  return (
    <div className="page">
      <button onClick={() => navigate("/rebanho")} style={{
        background: "none", border: "none", color: "hsl(113,48%,60%)",
        fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        ← Rebanho
      </button>

      {/* Identidade — do cache, aparece instantâneo */}
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

        {/* Dados extras — carregam depois, sem bloquear */}
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

      {/* GMD — do cache, instantâneo */}
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

      {/* Histórico pesagens — carrega em segundo plano */}
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
          <div key={i} className="animal-row" style={{ cursor: "default" }}>
            <p style={{ fontSize: 14, color: "hsl(95,30%,85%)" }}>
              {new Date(p.data_pesagem).toLocaleDateString("pt-BR")}
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,92%)" }}>
              {p.peso_kg} kg
            </p>
          </div>
        ))
      )}

      {/* Observações — todas da tabela observacoes_animal, mais recente primeiro */}
      {!loadingPesagens && observacoes.length > 0 && (
        <>
          <p className="section-label" style={{ marginTop: 20 }}>
            Observações
            <span style={{ marginLeft: 8, fontSize: 11, color: "hsl(100,18%,45%)",
              fontWeight: 400, fontStyle: "italic" }}>
              {observacoes.length} registro{observacoes.length > 1 ? "s" : ""}
            </span>
          </p>
          <div style={{
            maxHeight: 280,
            overflowY: "auto",
            borderRadius: 12,
            border: "0.5px solid hsl(100,18%,20%)",
          }}>
            {observacoes.map((obs, i) => (
              <div key={obs.id} style={{
                padding: "12px 14px",
                borderBottom: i < observacoes.length - 1
                  ? "0.5px solid hsl(100,18%,18%)" : "none",
                background: i === 0 ? "hsl(100,18%,14%)" : "hsl(100,18%,12%)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "hsl(113,48%,50%)", fontWeight: 500 }}>
                    {i === 0 ? "📌 Mais recente" : new Date(obs.data).toLocaleDateString("pt-BR")}
                  </span>
                  {i === 0 && (
                    <span style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>
                      {new Date(obs.data).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, color: "hsl(95,30%,82%)", lineHeight: 1.5 }}>
                  {obs.texto}
                </p>
              </div>
            ))}
            {observacoes.length > 3 && (
              <div style={{ padding: "8px 14px", textAlign: "center",
                background: "hsl(100,18%,11%)",
                borderTop: "0.5px solid hsl(100,18%,18%)" }}>
                <p style={{ fontSize: 11, color: "hsl(100,18%,40%)" }}>
                  Role para ver todas as {observacoes.length} observações
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Observação do campo animais (legado) — mostra só se não tem na tabela */}
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
