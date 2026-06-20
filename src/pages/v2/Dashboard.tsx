import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

// ── Mock data ──
const resumo = { total: 87, prontos: 62, atencao: 14, refugo: 3, gmdMedio: 148, margemMedia: 58 };

const alertas = [
  { id: "A-0042", sexo: "M", peso: 34.2, dias: 94,  lote: "Verão",  status: "atencao", gmd: 112 },
  { id: "B-0017", sexo: "F", peso: 28.1, dias: 112, lote: "Verão",  status: "refugo",  gmd: 88  },
  { id: "A-0055", sexo: "M", peso: 41.0, dias: 78,  lote: "Outono", status: "pronto",  gmd: 165 },
  { id: "B-0023", sexo: "F", peso: 31.0, dias: 88,  lote: "Verão",  status: "atencao", gmd: 120 },
];

const statusCfg = {
  pronto:  { label: "Pronto",  cls: "badge-pronto",  dot: "hsl(113 48% 55%)" },
  atencao: { label: "Atenção", cls: "badge-atencao", dot: "hsl(36 75% 55%)"  },
  refugo:  { label: "Refugo",  cls: "badge-refugo",  dot: "hsl(0 65% 55%)"   },
};

const hora = new Date().getHours();
const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

// ── Gráfico: evolução do peso médio (ApexCharts line) ──
const lineChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "area", toolbar: { show: false }, sparkline: { enabled: false }, background: "transparent" },
  stroke: { curve: "smooth", width: 2 },
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.01 } },
  colors: ["#7CC96A"],
  xaxis: {
    categories: ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"],
    labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" } },
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" }, formatter: (v) => `${v} kg` } },
  grid: { borderColor: "hsl(100 18% 20%)", strokeDashArray: 4 },
  tooltip: { theme: "dark", y: { formatter: (v) => `${v} kg` } },
  dataLabels: { enabled: false },
  markers: { size: 0 },
};
const lineChartSeries = [{ name: "Peso médio", data: [22, 25, 28, 30, 31, 33, 34] }];

// ── Gráfico: GMD por mês (ApexCharts bar) ──
const barChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
  colors: ["#7CC96A", "#E8A84A"],
  plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
  xaxis: {
    categories: ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"],
    labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" } },
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" }, formatter: (v) => `${v}g` } },
  grid: { borderColor: "hsl(100 18% 20%)", strokeDashArray: 4 },
  legend: { labels: { colors: "hsl(100 18% 55%)" } },
  tooltip: { theme: "dark" },
  dataLabels: { enabled: false },
};
const barChartSeries = [
  { name: "GMD real",  data: [120, 135, 128, 142, 138, 151, 148] },
  { name: "Meta",      data: [133, 133, 133, 133, 133, 133, 133] },
];

// ── Sub-componentes ──
function KpiCard({ valor, label, sub, cor, bgCls }: {
  valor: string; label: string; sub?: string; cor: string; bgCls?: string;
}) {
  return (
    <div className={`stat-card ${bgCls ?? ""}`} style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <p style={{ fontSize: 30, fontWeight: 600, color: cor, lineHeight: 1 }}>{valor}</p>
        {sub && (
          <span style={{
            fontSize: 11, padding: "3px 8px", borderRadius: 6,
            background: "hsl(100 18% 22%)", color: "hsl(100 18% 55%)", fontWeight: 500,
          }}>{sub}</span>
        )}
      </div>
      <p style={{ fontSize: 12, color: "hsl(100 18% 50%)" }}>{label}</p>
    </div>
  );
}

function Card({ title, action, children }: {
  title: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "hsl(100 18% 13%)",
      borderRadius: 14,
      border: "0.5px solid hsl(100 18% 18%)",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px",
        borderBottom: "0.5px solid hsl(100 18% 18%)",
      }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>{title}</p>
        {action}
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState<"mes"|"ano">("mes");

  return (
    <div>
      {/* ── Cabeçalho ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: "hsl(113 48% 50%)", marginBottom: 4 }}>{saudacao}, Ronaldo</p>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "hsl(95 30% 92%)" }}>Visão geral do rebanho</h1>
        </div>
        <button onClick={() => navigate("/rebanho/novo")} style={{
          background: "hsl(113 48% 60%)", color: "hsl(100 20% 10%)",
          border: "none", borderRadius: 10, padding: "10px 18px",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>+ Cadastrar animal</button>
      </div>

      {/* ── Row 1: KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard valor={String(resumo.total)} label="Animais ativos" sub="↑ 4 novos" cor="hsl(95 30% 92%)" />
        <KpiCard valor={String(resumo.prontos)} label="Prontos p/ venda"
          sub={`${Math.round(resumo.prontos/resumo.total*100)}%`}
          cor="hsl(113 48% 62%)" bgCls="stat-card-good" />
        <KpiCard valor={String(resumo.atencao)} label="GMD abaixo da meta"
          cor="hsl(36 75% 62%)" bgCls="stat-card-alert" />
        <KpiCard valor={String(resumo.refugo)} label="Sugestão de refugo"
          cor="hsl(0 65% 62%)" bgCls="stat-card-danger" />
      </div>

      {/* ── Row 2: gráficos ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Gráfico: Evolução do peso */}
        <Card title="Evolução do peso médio" action={
          <div style={{ display: "flex", gap: 6 }}>
            {(["mes","ano"] as const).map(p => (
              <button key={p} onClick={() => setPeriodo(p)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                cursor: "pointer", border: "0.5px solid",
                background: periodo === p ? "hsl(113 48% 60%)" : "transparent",
                color: periodo === p ? "hsl(100 20% 10%)" : "hsl(100 18% 50%)",
                borderColor: periodo === p ? "hsl(113 48% 60%)" : "hsl(100 18% 25%)",
              }}>{p === "mes" ? "Mês" : "Ano"}</button>
            ))}
          </div>
        }>
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 24, fontWeight: 600, color: "hsl(113 48% 62%)" }}>34 kg</p>
              <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>Peso médio atual</p>
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 600, color: "hsl(95 30% 85%)" }}>+12 kg</p>
              <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>Ganho no período</p>
            </div>
          </div>
          <Chart options={lineChartOptions} series={lineChartSeries} type="area" height={160} />
        </Card>

        {/* Gráfico: GMD por mês */}
        <Card title="GMD por mês" action={
          <span style={{ fontSize: 11, color: "hsl(113 48% 50%)" }}>Meta: 133g/dia</span>
        }>
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 24, fontWeight: 600, color: "hsl(113 48% 62%)" }}>{resumo.gmdMedio}g</p>
              <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>GMD médio atual</p>
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 600, color: "hsl(36 75% 62%)" }}>R$ {resumo.margemMedia}</p>
              <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>Margem por cabeça</p>
            </div>
          </div>
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={160} />
        </Card>
      </div>

      {/* ── Row 3: alertas + lote ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Tabela de atenção imediata */}
        <div style={{
          background: "hsl(100 18% 13%)",
          borderRadius: 14,
          border: "0.5px solid hsl(100 18% 18%)",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 20px", borderBottom: "0.5px solid hsl(100 18% 18%)",
          }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>Atenção imediata</p>
            <button onClick={() => navigate("/rebanho")} style={{
              background: "none", border: "0.5px solid hsl(100 18% 25%)",
              borderRadius: 8, padding: "5px 12px",
              color: "hsl(100 18% 55%)", fontSize: 12, cursor: "pointer",
            }}>Ver todos</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Animal", "Peso", "Dias", "GMD", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "10px 20px", textAlign: "left",
                    fontSize: 11, fontWeight: 500,
                    color: "hsl(100 18% 38%)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    borderBottom: "0.5px solid hsl(100 18% 18%)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alertas.map((a, i) => {
                const s = statusCfg[a.status as keyof typeof statusCfg];
                const gmdOk = a.gmd >= 133;
                return (
                  <tr key={i} onClick={() => navigate(`/rebanho/${a.id}`)}
                    style={{ cursor: "pointer", borderBottom: "0.5px solid hsl(100 18% 16%)" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: "hsl(100 18% 20%)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14,
                        }}>{a.sexo === "M" ? "♂" : "♀"}</div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(95 30% 88%)" }}>#{a.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "hsl(95 30% 80%)" }}>{a.peso} kg</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "hsl(95 30% 80%)" }}>{a.dias}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13,
                      color: gmdOk ? "hsl(113 48% 55%)" : "hsl(36 75% 55%)",
                      fontWeight: 500 }}>{a.gmd}g</td>
                    <td style={{ padding: "12px 20px" }}>
                      <span className={s.cls}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card de resumo financeiro */}
        <Card title="Resumo financeiro">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Receita projetada (lote)",  valor: "R$ 25.420",   cor: "hsl(113 48% 62%)" },
              { label: "Custo estimado total",       valor: "R$ 19.488",   cor: "hsl(95 30% 75%)"  },
              { label: "Margem total projetada",     valor: "R$ 5.932",    cor: "hsl(36 75% 62%)"  },
              { label: "Animais prontos × preço",    valor: "62 × R$ 410", cor: "hsl(95 30% 60%)"  },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: 11, color: "hsl(100 18% 40%)", marginBottom: 3 }}>{item.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: item.cor }}>{item.valor}</p>
                {i < 3 && <div style={{ height: "0.5px", background: "hsl(100 18% 20%)", marginTop: 14 }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
