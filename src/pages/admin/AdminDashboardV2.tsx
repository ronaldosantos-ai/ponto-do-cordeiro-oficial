import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

const kpis = {
  totalUsuarios: 142, ativos: 89, premium: 34, trial: 55,
  mrr: 2312.60, churn: 3, novosHoje: 4, animais: 8743,
};

const meses = ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"];
const mrrSeries = [{ name: "MRR (R$)", data: [980, 1100, 1340, 1580, 1890, 2100, 2312] }];
const usuariosSeries = [
  { name: "Novos", data: [8, 12, 9, 15, 11, 18, 14] },
  { name: "Cancelamentos", data: [2, 1, 3, 2, 1, 2, 3] },
];

const mrrOptions: ApexCharts.ApexOptions = {
  chart: { type: "area", toolbar: { show: false }, background: "transparent" },
  stroke: { curve: "smooth", width: 2 },
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.01 } },
  colors: ["#7CC96A"],
  xaxis: {
    categories: meses,
    labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" } },
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" }, formatter: v => `R$${(v/1000).toFixed(1)}k` } },
  grid: { borderColor: "hsl(100 18% 20%)", strokeDashArray: 4 },
  tooltip: { theme: "dark", y: { formatter: v => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  dataLabels: { enabled: false },
};

const usuariosOptions: ApexCharts.ApexOptions = {
  chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
  colors: ["#7CC96A", "#E06060"],
  plotOptions: { bar: { columnWidth: "60%", borderRadius: 4 } },
  xaxis: {
    categories: meses,
    labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" } },
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: "hsl(100 18% 45%)", fontSize: "11px" } } },
  legend: { labels: { colors: "hsl(100 18% 55%)" } },
  grid: { borderColor: "hsl(100 18% 20%)", strokeDashArray: 4 },
  tooltip: { theme: "dark" },
  dataLabels: { enabled: false },
};

const usuarios = [
  { nome: "João Alves",     email: "joao@ex.com",   plano: "premium", status: "ativo",    animais: 87,  data: "21/05" },
  { nome: "Maria Santos",   email: "maria@ex.com",  plano: "trial",   status: "ativo",    animais: 23,  data: "20/05" },
  { nome: "Pedro Oliveira", email: "pedro@ex.com",  plano: "premium", status: "ativo",    animais: 142, data: "19/05" },
  { nome: "Ana Costa",      email: "ana@ex.com",    plano: "trial",   status: "expirado", animais: 8,   data: "18/05" },
  { nome: "Carlos Mendes",  email: "carlos@ex.com", plano: "premium", status: "ativo",    animais: 64,  data: "17/05" },
];

const planoCls: Record<string,string> = { premium: "badge-pronto", trial: "badge-atencao", expirado: "badge-refugo" };

const NAV = [
  { id: "visao",      icon: "⊞", label: "Visão geral" },
  { id: "usuarios",   icon: "👥", label: "Usuários"    },
  { id: "financeiro", icon: "💰", label: "Financeiro"  },
  { id: "sistema",    icon: "⚙️", label: "Sistema"     },
];

function Card({ title, action, children, noPad }: {
  title: string; action?: React.ReactNode; children: React.ReactNode; noPad?: boolean;
}) {
  return (
    <div style={{ background: "hsl(100 18% 13%)", borderRadius: 14, border: "0.5px solid hsl(100 18% 18%)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px", borderBottom: "0.5px solid hsl(100 18% 18%)" }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>{title}</p>
        {action}
      </div>
      <div style={noPad ? undefined : { padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

function Kpi({ valor, label, sub, cor, bg }: {
  valor: string; label: string; sub?: string; cor: string; bg?: string;
}) {
  return (
    <div style={{ borderRadius: 12, padding: 18, background: bg ?? "hsl(100 18% 15%)", border: "0.5px solid hsl(100 18% 20%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <p style={{ fontSize: 28, fontWeight: 600, color: cor, lineHeight: 1 }}>{valor}</p>
        {sub && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6,
          background: "hsl(100 18% 20%)", color: "hsl(100 18% 50%)", fontWeight: 500 }}>{sub}</span>}
      </div>
      <p style={{ fontSize: 12, color: "hsl(100 18% 45%)" }}>{label}</p>
    </div>
  );
}

export default function AdminDashboardV2() {
  const navigate = useNavigate();
  const [aba, setAba] = useState("visao");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "hsl(100 20% 9%)" }}>

      {/* Sidebar admin */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "hsl(100 20% 11%)",
        borderRight: "0.5px solid hsl(100 18% 16%)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px",
          borderBottom: "0.5px solid hsl(100 18% 16%)" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113 48% 62%)" }}>🐑 Ponto do Cordeiro</p>
            <p style={{ fontSize: 10, color: "hsl(100 18% 40%)", marginTop: 3 }}>Painel super admin</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setAba(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10, marginBottom: 2,
              border: "none", cursor: "pointer",
              background: aba === item.id ? "hsl(113 48% 14%)" : "transparent",
              color: aba === item.id ? "hsl(113 48% 65%)" : "hsl(100 18% 50%)",
              fontSize: 13, fontWeight: aba === item.id ? 500 : 400,
              textAlign: "left",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "0.5px solid hsl(100 18% 16%)" }}>
          <button onClick={() => navigate("/dashboard")} style={{
            background: "none", border: "none",
            color: "hsl(100 18% 40%)", fontSize: 12, cursor: "pointer", padding: 0,
          }}>← Sair do admin</button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: 64, flexShrink: 0,
          background: "hsl(100 20% 11%)",
          borderBottom: "0.5px solid hsl(100 18% 16%)",
          display: "flex", alignItems: "center", padding: "0 28px", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "hsl(100 18% 40%)" }}>Admin</span>
            <span style={{ fontSize: 12, color: "hsl(100 18% 28%)" }}>›</span>
            <span style={{ fontSize: 12, color: "hsl(95 30% 72%)" }}>
              {NAV.find(n => n.id === aba)?.label}
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "hsl(100 18% 38%)" }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
          </span>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "hsl(113 48% 14%)", border: "1.5px solid hsl(113 48% 30%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "hsl(113 48% 65%)",
          }}>R</div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>

          {/* ── VISÃO GERAL ── */}
          {aba === "visao" && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95 30% 92%)", marginBottom: 20 }}>Visão geral</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={String(kpis.totalUsuarios)} label="Total de usuários" sub={`↑ ${kpis.novosHoje} hoje`} cor="hsl(95 30% 92%)" />
                <Kpi valor={String(kpis.premium)} label="Assinantes premium"
                  cor="hsl(113 48% 62%)" bg="linear-gradient(135deg,hsl(113 40% 12%),hsl(113 30% 9%))" />
                <Kpi valor={`R$ ${kpis.mrr.toLocaleString("pt-BR",{minimumFractionDigits:2})}`}
                  label="MRR" sub="↑ 11%" cor="hsl(36 75% 62%)"
                  bg="linear-gradient(135deg,hsl(36 50% 13%),hsl(36 40% 10%))" />
                <Kpi valor={String(kpis.churn)} label="Cancelamentos (mês)" sub="2,1%" cor="hsl(0 65% 62%)" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <Card title="Evolução do MRR" action={
                  <span style={{ fontSize: 22, fontWeight: 600, color: "hsl(113 48% 60%)" }}>
                    R$ 2,3k
                  </span>
                }>
                  <Chart options={mrrOptions} series={mrrSeries} type="area" height={160} />
                </Card>
                <Card title="Novos vs Cancelamentos" action={
                  <span style={{ fontSize: 12, color: "hsl(100 18% 45%)" }}>Últimos 7 meses</span>
                }>
                  <Chart options={usuariosOptions} series={usuariosSeries} type="bar" height={160} />
                </Card>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { label: "Animais na plataforma", valor: kpis.animais.toLocaleString("pt-BR"), cor: "hsl(95 30% 85%)" },
                  { label: "Usuários ativos (30d)",  valor: String(kpis.ativos), cor: "hsl(113 48% 60%)" },
                  { label: "Em período trial",       valor: String(kpis.trial),  cor: "hsl(36 75% 60%)" },
                ].map((c,i) => (
                  <Kpi key={i} valor={c.valor} label={c.label} cor={c.cor} />
                ))}
              </div>
            </div>
          )}

          {/* ── USUÁRIOS ── */}
          {aba === "usuarios" && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95 30% 92%)", marginBottom: 20 }}>Usuários</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={String(kpis.totalUsuarios)} label="Total cadastrados" cor="hsl(95 30% 92%)" />
                <Kpi valor={String(kpis.ativos)} label="Ativos (30 dias)"
                  cor="hsl(113 48% 62%)" bg="linear-gradient(135deg,hsl(113 40% 12%),hsl(113 30% 9%))" />
                <Kpi valor={String(kpis.trial)} label="Em trial" cor="hsl(36 75% 62%)" />
              </div>
              <div style={{
                background: "hsl(100 18% 13%)", borderRadius: 14,
                border: "0.5px solid hsl(100 18% 18%)", overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderBottom: "0.5px solid hsl(100 18% 18%)" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>Usuários recentes</p>
                  <button style={{ background: "none", border: "0.5px solid hsl(100 18% 25%)",
                    borderRadius: 8, padding: "5px 12px", color: "hsl(100 18% 55%)", fontSize: 12, cursor: "pointer" }}>
                    Exportar CSV
                  </button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["Usuário","Plano","Animais","Status","Cadastro"].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left",
                        fontSize: 11, fontWeight: 500, color: "hsl(100 18% 38%)",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        borderBottom: "0.5px solid hsl(100 18% 18%)" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u,i) => (
                      <tr key={i} style={{ borderBottom: "0.5px solid hsl(100 18% 16%)", cursor: "pointer" }}>
                        <td style={{ padding: "12px 20px" }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95 30% 90%)" }}>{u.nome}</p>
                          <p style={{ fontSize: 11, color: "hsl(100 18% 42%)" }}>{u.email}</p>
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          <span className={planoCls[u.plano]}>
                            {u.plano.charAt(0).toUpperCase() + u.plano.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: "12px 20px", fontSize: 13, color: "hsl(95 30% 80%)" }}>{u.animais}</td>
                        <td style={{ padding: "12px 20px" }}>
                          <span style={{ fontSize: 12,
                            color: u.status === "ativo" ? "hsl(113 48% 55%)" : "hsl(0 65% 55%)" }}>
                            ● {u.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 20px", fontSize: 12, color: "hsl(100 18% 42%)" }}>{u.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── FINANCEIRO ── */}
          {aba === "financeiro" && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95 30% 92%)", marginBottom: 20 }}>Financeiro</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={`R$ ${kpis.mrr.toLocaleString("pt-BR",{minimumFractionDigits:2})}`}
                  label="MRR atual" sub="↑ 11%" cor="hsl(113 48% 62%)"
                  bg="linear-gradient(135deg,hsl(113 40% 12%),hsl(113 30% 9%))" />
                <Kpi valor="R$ 27.751" label="ARR estimado" cor="hsl(36 75% 62%)" />
                <Kpi valor={String(kpis.churn)} label="Cancelamentos (mês)" sub="2,1% churn" cor="hsl(0 65% 62%)" />
              </div>
              <Card title="Evolução do MRR — últimos 7 meses">
                <Chart options={mrrOptions} series={mrrSeries} type="area" height={220} />
              </Card>
              <div style={{ marginTop: 16 }}>
                <Card title="Planos ativos" noPad>
                  {[
                    { plano: "Mensal (R$ 19,90)", qtd: 28, receita: 557.20, cor: "hsl(113 48% 60%)" },
                    { plano: "Anual (R$ 98,00)",  qtd: 6,  receita: 588.00, cor: "hsl(36 75% 60%)"  },
                    { plano: "Trial (gratuito)",   qtd: 55, receita: 0,      cor: "hsl(100 18% 45%)" },
                  ].map((p,i,arr) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 20px",
                      borderBottom: i < arr.length-1 ? "0.5px solid hsl(100 18% 18%)" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.cor }} />
                        <p style={{ fontSize: 13, color: "hsl(95 30% 80%)" }}>{p.plano}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: p.cor }}>
                          {p.receita > 0
                            ? `R$ ${p.receita.toLocaleString("pt-BR",{minimumFractionDigits:2})}`
                            : "—"}
                        </p>
                        <p style={{ fontSize: 11, color: "hsl(100 18% 40%)" }}>{p.qtd} usuários</p>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── SISTEMA ── */}
          {aba === "sistema" && (
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95 30% 92%)", marginBottom: 20 }}>Sistema</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={kpis.animais.toLocaleString("pt-BR")} label="Animais na plataforma" cor="hsl(95 30% 85%)" />
                <Kpi valor="99,8%" label="Uptime (30 dias)"
                  cor="hsl(113 48% 62%)" bg="linear-gradient(135deg,hsl(113 40% 12%),hsl(113 30% 9%))" />
                <Kpi valor="OK" label="Webhook Ticto"
                  cor="hsl(113 48% 62%)" bg="linear-gradient(135deg,hsl(113 40% 12%),hsl(113 30% 9%))" />
              </div>
              <Card title="Log de eventos recentes" noPad>
                {[
                  { hora: "09:14", msg: "Webhook Ticto — pedro@ex.com ativou Premium", tipo: "ok" },
                  { hora: "08:52", msg: "Novo cadastro — carlos@ex.com (trial)", tipo: "ok" },
                  { hora: "07:30", msg: "Trial expirado sem renovação — user5@ex.com", tipo: "alerta" },
                  { hora: "Ontem", msg: "Backup automático do banco concluído", tipo: "ok" },
                  { hora: "Ontem", msg: "3 usuários cancelaram esta semana", tipo: "erro" },
                ].map((log,i,arr) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 20px",
                    borderBottom: i < arr.length-1 ? "0.5px solid hsl(100 18% 16%)" : "none",
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                      background: log.tipo === "ok" ? "hsl(113 48% 55%)"
                        : log.tipo === "alerta" ? "hsl(36 75% 55%)"
                        : "hsl(0 65% 55%)",
                    }} />
                    <div>
                      <p style={{ fontSize: 13, color: "hsl(95 30% 82%)" }}>{log.msg}</p>
                      <p style={{ fontSize: 11, color: "hsl(100 18% 40%)", marginTop: 3 }}>{log.hora}</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
