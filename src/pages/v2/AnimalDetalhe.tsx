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

export default function AnimalDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animais } = useAnimais();

  // Pega dados básicos do cache (instantâneo)
  const animalCache = animais.find(a => a.id === id) ?? null;

  const [pesagens, setPesagens] = useState<Pesagem[]>([]);
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
    const { data } = await supabase
      .from("animais")
      .select("data_nascimento, brinco_mae, brinco_pai, observacoes, lotes(nome), pesagens(id, data_pesagem, peso_kg, observacoes)")
      .eq("id", id)
      .single();

    if (data) {
      setExtra({
        data_nascimento: data.data_nascimento,
        brinco_mae: data.brinco_mae,
        brinco_pai: data.brinco_pai,
        observacoes: data.observacoes,
      });
      setLoteNome((data as any).lotes?.nome ?? null);
      const sorted = [...((data as any).pesagens ?? [])].sort(
        (a: any, b: any) => new Date(a.data_pesagem).getTime() - new Date(b.data_pesagem).getTime()
      );
      setPesagens(sorted);
    }
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

      {extra?.observacoes && (
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
