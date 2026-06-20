import { useNavigate } from "react-router-dom";

// Dados mockados — serão substituídos por Supabase
const resumo = {
  fazenda: "Fazenda São Pedro",
  total: 87,
  prontos: 62,
  atencao: 14,
  refugo: 3,
};

const alertas = [
  { id: "A-0042", sexo: "Macho", peso: 34.2, dias: 94, lote: "Verão", status: "atencao" },
  { id: "B-0017", sexo: "Fêmea", peso: 28.1, dias: 112, lote: "Verão", status: "refugo" },
  { id: "A-0055", sexo: "Macho", peso: 41.0, dias: 78, lote: "Outono", status: "pronto" },
];

const statusConfig = {
  pronto:  { label: "Pronto",    cls: "badge-pronto" },
  atencao: { label: "GMD baixo", cls: "badge-atencao" },
  refugo:  { label: "Refugo",    cls: "badge-refugo" },
};

const hora = new Date().getHours();
const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p style={{ fontSize: 13, color: "hsl(113 48% 60%)", marginBottom: 2 }}>
            {saudacao}
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "hsl(95 30% 92%)" }}>
            {resumo.fazenda}
          </h1>
        </div>
        <button
          onClick={() => navigate("/rebanho/novo")}
          style={{
            background: "hsl(113 48% 60%)",
            color: "hsl(100 20% 11%)",
            border: "none",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Animal
        </button>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        <div className="stat-card">
          <p style={{ fontSize: 28, fontWeight: 500, color: "hsl(95 30% 92%)", lineHeight: 1 }}>
            {resumo.total}
          </p>
          <p style={{ fontSize: 12, color: "hsl(100 18% 55%)", marginTop: 4 }}>Animais ativos</p>
        </div>
        <div className="stat-card stat-card-good">
          <p style={{ fontSize: 28, fontWeight: 500, color: "hsl(113 48% 60%)", lineHeight: 1 }}>
            {resumo.prontos}
          </p>
          <p style={{ fontSize: 12, color: "hsl(113 48% 35%)", marginTop: 4 }}>No ponto de venda</p>
        </div>
        <div className="stat-card stat-card-alert">
          <p style={{ fontSize: 28, fontWeight: 500, color: "hsl(36 75% 60%)", lineHeight: 1 }}>
            {resumo.atencao}
          </p>
          <p style={{ fontSize: 12, color: "hsl(36 75% 40%)", marginTop: 4 }}>GMD abaixo da meta</p>
        </div>
        <div className="stat-card stat-card-danger">
          <p style={{ fontSize: 28, fontWeight: 500, color: "hsl(0 65% 62%)", lineHeight: 1 }}>
            {resumo.refugo}
          </p>
          <p style={{ fontSize: 12, color: "hsl(0 65% 40%)", marginTop: 4 }}>Sugestão de refugo</p>
        </div>
      </div>

      {/* Atenção imediata */}
      <p className="section-label">Atenção imediata</p>
      {alertas.map(a => {
        const s = statusConfig[a.status as keyof typeof statusConfig];
        return (
          <div
            key={a.id}
            className="animal-row"
            onClick={() => navigate(`/rebanho/${a.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 92%)", marginBottom: 2 }}>
                #{a.id} — {a.sexo}
              </p>
              <p style={{ fontSize: 12, color: "hsl(100 18% 55%)" }}>
                {a.peso} kg · {a.dias} dias · Lote {a.lote}
              </p>
            </div>
            <span className={s.cls}>{s.label}</span>
          </div>
        );
      })}

      {/* Atalho para ver todos */}
      <button
        onClick={() => navigate("/rebanho")}
        className="btn-secondary"
        style={{ marginTop: 16 }}
      >
        Ver todo o rebanho
      </button>
    </div>
  );
}
