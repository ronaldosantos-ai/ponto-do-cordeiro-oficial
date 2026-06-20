import { useNavigate } from "react-router-dom";
import { useState } from "react";

const resumo = {
  fazenda: "Fazenda São Pedro",
  total: 87,
  prontos: 62,
  atencao: 14,
  refugo: 3,
  gmdMedio: 148,
  pesoMedio: 33.4,
  margemMedia: 58,
};

const alertas = [
  { id: "A-0042", sexo: "Macho", peso: 34.2, dias: 94,  lote: "Verão",  status: "atencao", gmd: 112 },
  { id: "B-0017", sexo: "Fêmea", peso: 28.1, dias: 112, lote: "Verão",  status: "refugo",  gmd: 88  },
  { id: "A-0055", sexo: "Macho", peso: 41.0, dias: 78,  lote: "Outono", status: "pronto",  gmd: 165 },
  { id: "B-0023", sexo: "Fêmea", peso: 31.0, dias: 88,  lote: "Verão",  status: "atencao", gmd: 120 },
];

const evolucaoPeso = [22, 25, 28, 30, 31, 33, 34];
const meses = ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"];

const statusCfg = {
  pronto:  { label: "Pronto",  cls: "badge-pronto",  cor: "hsl(113 48% 60%)" },
  atencao: { label: "Atenção", cls: "badge-atencao", cor: "hsl(36 75% 60%)"  },
  refugo:  { label: "Refugo",  cls: "badge-refugo",  cor: "hsl(0 65% 62%)"   },
};

const hora = new Date().getHours();
const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

function MiniBarChart({ values, cor }: { values: number[]; cor: string }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          borderRadius: 3,
          background: i === values.length - 1 ? cor : cor.replace("60%", "25%"),
          transition: "height 0.3s",
        }} />
      ))}
    </div>
  );
}

function StatCard({
  valor, label, sub, cor, bgCls, children
}: {
  valor: string; label: string; sub?: string;
  cor: string; bgCls?: string; children?: React.ReactNode;
}) {
  return (
    <div className={`stat-card ${bgCls ?? ""}`} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 28, fontWeight: 500, color: cor, lineHeight: 1 }}>{valor}</p>
          <p style={{ fontSize: 12, color: "hsl(100 18% 50%)", marginTop: 4 }}>{label}</p>
        </div>
        {sub && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6,
            background: "hsl(100 18% 22%)", color: "hsl(100 18% 55%)"
          }}>{sub}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [periodoGMD, setPeriodoGMD] = useState<"mes" | "ano">("mes");

  return (
    <div className="page">

      {/* ── Cabeçalho ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: "hsl(113 48% 55%)", marginBottom: 2 }}>{saudacao}</p>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "hsl(95 30% 92%)" }}>{resumo.fazenda}</h1>
        </div>
        <button
          onClick={() => navigate("/rebanho/novo")}
          style={{
            background: "hsl(113 48% 60%)", color: "hsl(100 20% 11%)",
            border: "none", borderRadius: 10, padding: "8px 14px",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}
        >+ Animal</button>
      </div>

      {/* ── Row 1: 4 cards principais ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <StatCard valor={String(resumo.total)} label="Animais ativos"
          cor="hsl(95 30% 92%)" sub="↑ 4 novos" />
        <StatCard valor={String(resumo.prontos)} label="Prontos p/ venda"
          cor="hsl(113 48% 60%)" bgCls="stat-card-good" sub={`${Math.round(resumo.prontos/resumo.total*100)}%`} />
        <StatCard valor={String(resumo.atencao)} label="GMD abaixo da meta"
          cor="hsl(36 75% 60%)" bgCls="stat-card-alert" />
        <StatCard valor={String(resumo.refugo)} label="Sugestão de refugo"
          cor="hsl(0 65% 62%)" bgCls="stat-card-danger" />
      </div>

      {/* ── Row 2: métricas financeiras ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        <div className="stat-card" style={{
          background: "linear-gradient(135deg, hsl(113 40% 15%) 0%, hsl(113 30% 12%) 100%)",
          border: "0.5px solid hsl(113 40% 22%)",
        }}>
          <p style={{ fontSize: 11, color: "hsl(113 48% 40%)", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            GMD médio
          </p>
          <p style={{ fontSize: 26, fontWeight: 500, color: "hsl(113 48% 65%)", lineHeight: 1 }}>
            {resumo.gmdMedio}g
          </p>
          <p style={{ fontSize: 11, color: "hsl(113 48% 35%)", marginTop: 4 }}>
            Meta: 133g/dia ✓
          </p>
          <div style={{ marginTop: 8 }}>
            <MiniBarChart values={[120,135,128,142,138,151,148]} cor="hsl(113 48% 60%)" />
          </div>
        </div>

        <div className="stat-card" style={{
          background: "linear-gradient(135deg, hsl(36 50% 14%) 0%, hsl(36 40% 11%) 100%)",
          border: "0.5px solid hsl(36 50% 20%)",
        }}>
          <p style={{ fontSize: 11, color: "hsl(36 75% 40%)", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Margem/cabeça
          </p>
          <p style={{ fontSize: 26, fontWeight: 500, color: "hsl(36 75% 65%)", lineHeight: 1 }}>
            R$ {resumo.margemMedia}
          </p>
          <p style={{ fontSize: 11, color: "hsl(36 75% 35%)", marginTop: 4 }}>
            Meta: R$ 50–70 ✓
          </p>
          <div style={{ marginTop: 8 }}>
            <MiniBarChart values={[40,45,38,55,52,60,58]} cor="hsl(36 75% 60%)" />
          </div>
        </div>
      </div>

      {/* ── Evolução do peso médio ── */}
      <div className="stat-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95 30% 85%)" }}>Evolução do peso médio</p>
          <div style={{ display: "flex", gap: 6 }}>
            {(["mes","ano"] as const).map(p => (
              <button key={p} onClick={() => setPeriodoGMD(p)} style={{
                padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                cursor: "pointer", border: "0.5px solid",
                background: periodoGMD === p ? "hsl(113 48% 60%)" : "transparent",
                color: periodoGMD === p ? "hsl(100 20% 11%)" : "hsl(100 18% 50%)",
                borderColor: periodoGMD === p ? "hsl(113 48% 60%)" : "hsl(100 18% 25%)",
              }}>
                {p === "mes" ? "Mês" : "Ano"}
              </button>
            ))}
          </div>
        </div>
        {/* Gráfico de barras simples */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64 }}>
          {evolucaoPeso.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%",
                height: `${(v / Math.max(...evolucaoPeso)) * 56}px`,
                borderRadius: "4px 4px 0 0",
                background: i === evolucaoPeso.length - 1
                  ? "hsl(113 48% 60%)"
                  : "hsl(113 48% 22%)",
              }} />
              <span style={{ fontSize: 10, color: "hsl(100 18% 40%)" }}>{meses[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>Início: 22 kg</span>
          <span style={{ fontSize: 11, color: "hsl(113 48% 55%)" }}>Atual: {resumo.pesoMedio} kg</span>
        </div>
      </div>

      {/* ── Atenção imediata ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p className="section-label" style={{ margin: 0 }}>Atenção imediata</p>
        <button onClick={() => navigate("/rebanho")} style={{
          background: "none", border: "none", color: "hsl(113 48% 55%)",
          fontSize: 12, cursor: "pointer", padding: 0
        }}>Ver todos →</button>
      </div>

      {alertas.map(a => {
        const s = statusCfg[a.status as keyof typeof statusCfg];
        const gmdOk = a.gmd >= 133;
        return (
          <div key={a.id} className="animal-row" onClick={() => navigate(`/rebanho/${a.id}`)}
            style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${s.cor.replace("60%","10%").replace("62%","10%")}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>
                {a.sexo === "Macho" ? "♂" : "♀"}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 92%)", marginBottom: 2 }}>
                  #{a.id}
                </p>
                <p style={{ fontSize: 12, color: "hsl(100 18% 50%)" }}>
                  {a.peso} kg · {a.dias} dias · GMD: <span style={{ color: gmdOk ? "hsl(113 48% 55%)" : "hsl(36 75% 55%)" }}>{a.gmd}g</span>
                </p>
              </div>
            </div>
            <span className={s.cls}>{s.label}</span>
          </div>
        );
      })}

      <button className="btn-secondary" onClick={() => navigate("/rebanho")} style={{ marginTop: 16 }}>
        Ver todo o rebanho
      </button>
    </div>
  );
}
