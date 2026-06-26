import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Pesagem {
  id: string;
  data_pesagem: string;
  peso_kg: number;
  observacoes: string | null;
}

interface AnimalCompleto {
  id: string;
  brinco: string;
  sexo: string;
  raca: string | null;
  data_nascimento: string | null;
  brinco_mae: string | null;
  brinco_pai: string | null;
  observacoes: string | null;
  lotes: { nome: string } | null;
  pesagens: Pesagem[];
}

export default function AnimalDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<AnimalCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    carregar();
  }, [id]);

  async function carregar() {
    setLoading(true);
    const { data } = await supabase
      .from("animais")
      .select("*, lotes(nome), pesagens(id, data_pesagem, peso_kg, observacoes)")
      .eq("id", id)
      .single();
    setAnimal(data as any);
    setLoading(false);
  }

  if (loading) return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <p style={{ color: "hsl(100,18%,45%)" }}>Carregando...</p>
    </div>
  );

  if (!animal) return (
    <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
      <p style={{ color: "hsl(0,65%,55%)" }}>Animal não encontrado</p>
      <button className="btn-secondary" onClick={() => navigate("/rebanho")}
        style={{ marginTop: 16, maxWidth: 200, margin: "16px auto 0" }}>
        Voltar
      </button>
    </div>
  );

  const pesagens = [...(animal.pesagens ?? [])].sort(
    (a, b) => new Date(a.data_pesagem).getTime() - new Date(b.data_pesagem).getTime()
  );

  const primeira  = pesagens[0];
  const ultima    = pesagens[pesagens.length - 1];
  const pesoAtual = ultima?.peso_kg ?? null;

  let gmd: number | null = null;
  let dias: number | null = null;
  if (primeira && ultima && primeira.id !== ultima.id) {
    dias = Math.round(
      (new Date(ultima.data_pesagem).getTime() - new Date(primeira.data_pesagem).getTime()) / 86400000
    );
    if (dias > 0) gmd = Math.round(((ultima.peso_kg - primeira.peso_kg) / dias) * 1000);
  }

  const gmdOk = gmd !== null && gmd >= 133;
  let status = "normal";
  if (pesoAtual !== null && pesoAtual >= 40)          status = "pronto";
  else if (gmd !== null && gmd < 133 * 0.7)           status = "refugo";
  else if (gmd !== null && gmd < 133)                 status = "atencao";

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

      {/* Identidade */}
      <div className="stat-card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)" }}>
              #{animal.brinco}
            </p>
            <p style={{ fontSize: 13, color: "hsl(100,18%,55%)", marginTop: 4 }}>
              {animal.sexo === "M" ? "Macho" : "Fêmea"}
              {animal.raca ? " · " + animal.raca : ""}
              {animal.lotes?.nome ? " · Lote " + animal.lotes.nome : ""}
            </p>
          </div>
          <span className={badgeCls}>{badgeLabel}</span>
        </div>

        {(animal.data_nascimento || animal.brinco_mae) && (
          <div style={{ borderTop: "0.5px solid hsl(100,18%,22%)", marginTop: 12, paddingTop: 12,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {animal.data_nascimento && (
              <div>
                <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Nascimento</p>
                <p style={{ fontSize: 13, color: "hsl(95,30%,85%)" }}>
                  {new Date(animal.data_nascimento).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            {(animal.brinco_mae || animal.brinco_pai) && (
              <div>
                <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Mãe / Pai</p>
                <p style={{ fontSize: 13, color: "hsl(95,30%,85%)" }}>
                  {animal.brinco_mae ?? "—"} / {animal.brinco_pai ?? "—"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GMD */}
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

      {/* Histórico pesagens */}
      <p className="section-label">Histórico de pesagens</p>
      {pesagens.length === 0 ? (
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

      {animal.observacoes && (
        <>
          <p className="section-label" style={{ marginTop: 20 }}>Observações</p>
          <div className="stat-card stat-card-alert">
            <p style={{ fontSize: 14, color: "hsl(36,75%,70%)" }}>{animal.observacoes}</p>
          </div>
        </>
      )}

      <button className="btn-primary" onClick={() => navigate("/pesagem?animal_id=" + id + "&brinco=" + animal.brinco)} style={{ marginTop: 24 }}>
        + Registrar pesagem
      </button>
    </div>
  );
}
