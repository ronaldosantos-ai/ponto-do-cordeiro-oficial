import { useParams, useNavigate } from "react-router-dom";

// Mock — será substituído por query Supabase
const dados: Record<string, any> = {
  "A-0042": {
    id: "A-0042", sexo: "Macho", raca: "Santa Inês",
    nascimento: "2025-12-18", peso_inicial: 4.2,
    lote: "Verão", mae: "M-0011", pai: "P-0003",
    pesagens: [
      { data: "2026-01-15", peso: 12.0 },
      { data: "2026-02-15", peso: 20.5 },
      { data: "2026-03-15", peso: 27.1 },
      { data: "2026-04-15", peso: 30.8 },
      { data: "2026-05-15", peso: 34.2 },
    ],
    status: "atencao",
    observacoes: "Verificar altura do cocho — dominância no lote",
  },
};

function calcGMD(pesagens: {data: string, peso: number}[]) {
  if (pesagens.length < 2) return null;
  const first = pesagens[0];
  const last = pesagens[pesagens.length - 1];
  const dias = Math.round(
    (new Date(last.data).getTime() - new Date(first.data).getTime()) / 86400000
  );
  return ((last.peso - first.peso) / dias * 1000).toFixed(0);
}

export default function AnimalDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const animal = dados[id ?? ""] ?? dados["A-0042"];
  const gmd = calcGMD(animal.pesagens);
  const metaGMD = 133;
  const gmdOk = gmd && parseInt(gmd) >= metaGMD;

  return (
    <div className="page">
      {/* Voltar */}
      <button
        onClick={() => navigate("/rebanho")}
        style={{ background: "none", border: "none", color: "hsl(113 48% 60%)",
          fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}
      >
        ← Rebanho
      </button>

      {/* Identidade */}
      <div className="stat-card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 500, color: "hsl(95 30% 92%)" }}>
              #{animal.id}
            </p>
            <p style={{ fontSize: 13, color: "hsl(100 18% 55%)", marginTop: 4 }}>
              {animal.sexo} · {animal.raca} · Lote {animal.lote}
            </p>
          </div>
          <span className={
            animal.status === "pronto" ? "badge-pronto" :
            animal.status === "atencao" ? "badge-atencao" : "badge-refugo"
          }>
            {animal.status === "pronto" ? "Pronto" :
             animal.status === "atencao" ? "Atenção" : "Refugo"}
          </span>
        </div>
        <div style={{ borderTop: "0.5px solid hsl(100 18% 22%)", marginTop: 12, paddingTop: 12,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>Nascimento</p>
            <p style={{ fontSize: 13, color: "hsl(95 30% 85%)" }}>
              {new Date(animal.nascimento).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>Mãe / Pai</p>
            <p style={{ fontSize: 13, color: "hsl(95 30% 85%)" }}>{animal.mae} / {animal.pai}</p>
          </div>
        </div>
      </div>

      {/* GMD */}
      <p className="section-label">Ganho médio diário</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div className={`stat-card ${gmdOk ? "stat-card-good" : "stat-card-alert"}`}>
          <p style={{ fontSize: 26, fontWeight: 500,
            color: gmdOk ? "hsl(113 48% 60%)" : "hsl(36 75% 60%)", lineHeight: 1 }}>
            {gmd}g
          </p>
          <p style={{ fontSize: 12,
            color: gmdOk ? "hsl(113 48% 35%)" : "hsl(36 75% 40%)", marginTop: 4 }}>
            GMD atual
          </p>
        </div>
        <div className="stat-card">
          <p style={{ fontSize: 26, fontWeight: 500, color: "hsl(95 30% 92%)", lineHeight: 1 }}>
            {animal.pesagens[animal.pesagens.length - 1].peso} kg
          </p>
          <p style={{ fontSize: 12, color: "hsl(100 18% 55%)", marginTop: 4 }}>Peso atual</p>
        </div>
      </div>

      {/* Histórico de pesagens */}
      <p className="section-label">Histórico de pesagens</p>
      {[...animal.pesagens].reverse().map((p: any, i: number) => (
        <div key={i} className="animal-row" style={{ cursor: "default" }}>
          <p style={{ fontSize: 14, color: "hsl(95 30% 85%)" }}>
            {new Date(p.data).toLocaleDateString("pt-BR")}
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 92%)" }}>
            {p.peso} kg
          </p>
        </div>
      ))}

      {/* Observações */}
      {animal.observacoes && (
        <>
          <p className="section-label" style={{ marginTop: 20 }}>Observações</p>
          <div className="stat-card stat-card-alert">
            <p style={{ fontSize: 14, color: "hsl(36 75% 70%)" }}>{animal.observacoes}</p>
          </div>
        </>
      )}

      {/* Ações */}
      <button
        onClick={() => navigate("/pesagem")}
        className="btn-primary"
        style={{ marginTop: 24 }}
      >
        Registrar pesagem
      </button>
    </div>
  );
}
