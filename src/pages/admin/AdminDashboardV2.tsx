import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const kpis = { totalUsuarios: 142, ativos: 89, premium: 34, trial: 55, mrr: 2312.60, churn: 3, novosHoje: 4, animais: 8743 };

const mrrData = [
  { mes: "Nov", mrr: 980 },  { mes: "Dez", mrr: 1100 }, { mes: "Jan", mrr: 1340 },
  { mes: "Fev", mrr: 1580 }, { mes: "Mar", mrr: 1890 }, { mes: "Abr", mrr: 2100 },
  { mes: "Mai", mrr: 2312 },
];

const usuariosData = [
  { mes: "Nov", novos: 8, cancel: 2 }, { mes: "Dez", novos: 12, cancel: 1 },
  { mes: "Jan", novos: 9, cancel: 3 }, { mes: "Fev", novos: 15, cancel: 2 },
  { mes: "Mar", novos: 11, cancel: 1 }, { mes: "Abr", novos: 18, cancel: 2 },
  { mes: "Mai", novos: 14, cancel: 3 },
];

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

const tickStyle = { fill: "hsl(100,18%,45%)", fontSize: 11 };
const gridColor = "hsl(100,18%,20%)";
const tooltipStyle = { background: "hsl(100,18%,13%)", border: "0.5px solid hsl(100,18%,22%)", borderRadius: 8 };
const tooltipLabel = { color: "hsl(95,30%,85%)", fontSize: 12 };

function Kpi({ valor, label, sub, cor, bg }: { valor: string; label: string; sub?: string; cor: string; bg?: string }) {
  return (
    <div style={{ borderRadius: 12, padding: 18, background: bg ?? "hsl(100,18%,15%)", border: "0.5px solid hsl(100,18%,20%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <p style={{ fontSize: 28, fontWeight: 600, color: cor, lineHeight: 1 }}>{valor}</p>
        {sub && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6,
          background: "hsl(100,18%,20%)", color: "hsl(100,18%,50%)", fontWeight: 500 }}>{sub}</span>}
      </div>
      <p style={{ fontSize: 12, color: "hsl(100,18%,45%)" }}>{label}</p>
    </div>
  );
}

function Card({ title, action, children, noPad }: { title: string; action?: React.ReactNode; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14, border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)" }}>{title}</p>
        {action}
      </div>
      <div style={noPad ? undefined : { padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

export default function AdminDashboardV2() {
  const navigate = useNavigate();
  const [aba, setAba] = useState("visao");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "hsl(100,20%,9%)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "hsl(100,20%,11%)",
        borderRight: "0.5px solid hsl(100,18%,16%)", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px",
          borderBottom: "0.5px solid hsl(100,18%,16%)" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113,48%,62%)" }}>🐑 Ponto do Cordeiro</p>
            <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginTop: 3 }}>Painel super admin</p>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setAba(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10, marginBottom: 2,
              border: "none", cursor: "pointer", textAlign: "left",
              background: aba === item.id ? "hsl(113,48%,14%)" : "transparent",
              color: aba === item.id ? "hsl(113,48%,65%)" : "hsl(100,18%,50%)",
              fontSize: 13, fontWeight: aba === item.id ? 500 : 400,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "0.5px solid hsl(100,18%,16%)" }}>
          <button onClick={() => navigate("/dashboard")} style={{
            background: "none", border: "none", color: "hsl(100,18%,40%)", fontSize: 12, cursor: "pointer", padding: 0 }}>
            ← Sair do admin
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 64, flexShrink: 0, background: "hsl(100,20%,11%)",
          borderBottom: "0.5px solid hsl(100,18%,16%)",
          display: "flex", alignItems: "center", padding: "0 28px", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "hsl(100,18%,40%)" }}>Admin</span>
            <span style={{ fontSize: 12, color: "hsl(100,18%,28%)" }}>›</span>
            <span style={{ fontSize: 12, color: "hsl(95,30%,72%)" }}>{NAV.find(n => n.id === aba)?.label}</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 34, height: 34, borderRadius: "50%",
            background: "hsl(113,48%,14%)", border: "1.5px solid hsl(113,48%,30%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "hsl(113,48%,65%)" }}>R</div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
            {NAV.find(n => n.id === aba)?.label}
          </h1>

          {/* VISÃO GERAL */}
          {aba === "visao" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={String(kpis.totalUsuarios)} label="Total usuários" sub={`↑ ${kpis.novosHoje} hoje`} cor="hsl(95,30%,92%)" />
                <Kpi valor={String(kpis.premium)} label="Assinantes premium" cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                <Kpi valor={`R$ ${kpis.mrr.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} label="MRR" sub="↑ 11%" cor="hsl(36,75%,62%)" bg="hsl(36,50%,10%)" />
                <Kpi valor={String(kpis.churn)} label="Cancelamentos (mês)" cor="hsl(0,65%,62%)" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card title="Evolução do MRR">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={mrrData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="gradMrr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(113,48%,60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(113,48%,60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="mes" tick={tickStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(1)}k`} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "MRR"]} />
                      <Area type="monotone" dataKey="mrr" stroke="hsl(113,48%,60%)" strokeWidth={2} fill="url(#gradMrr)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
                <Card title="Novos vs Cancelamentos">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={usuariosData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="mes" tick={tickStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "hsl(100,18%,55%)" }} />
                      <Bar dataKey="novos" name="Novos" fill="hsl(113,48%,50%)" radius={[4,4,0,0]} />
                      <Bar dataKey="cancel" name="Cancelamentos" fill="hsl(0,65%,50%)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          )}

          {/* USUÁRIOS */}
          {aba === "usuarios" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={String(kpis.totalUsuarios)} label="Total cadastrados" cor="hsl(95,30%,92%)" />
                <Kpi valor={String(kpis.ativos)} label="Ativos (30 dias)" cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                <Kpi valor={String(kpis.trial)} label="Em trial" cor="hsl(36,75%,62%)" />
              </div>
              <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14, border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)" }}>Usuários recentes</p>
                  <button style={{ background: "none", border: "0.5px solid hsl(100,18%,25%)", borderRadius: 8,
                    padding: "5px 12px", color: "hsl(100,18%,55%)", fontSize: 12, cursor: "pointer" }}>Exportar CSV</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Usuário","Plano","Animais","Status","Cadastro"].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 500,
                      color: "hsl(100,18%,38%)", textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "0.5px solid hsl(100,18%,18%)" }}>{h}</th>
                  ))}</tr></thead>
                  <tbody>{usuarios.map((u,i) => (
                    <tr key={i} style={{ borderBottom: "0.5px solid hsl(100,18%,16%)", cursor: "pointer" }}>
                      <td style={{ padding: "12px 20px" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>{u.nome}</p>
                        <p style={{ fontSize: 11, color: "hsl(100,18%,42%)" }}>{u.email}</p>
                      </td>
                      <td style={{ padding: "12px 20px" }}><span className={planoCls[u.plano]}>{u.plano.charAt(0).toUpperCase()+u.plano.slice(1)}</span></td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "hsl(95,30%,80%)" }}>{u.animais}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ fontSize: 12, color: u.status === "ativo" ? "hsl(113,48%,55%)" : "hsl(0,65%,55%)" }}>● {u.status}</span>
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: 12, color: "hsl(100,18%,42%)" }}>{u.data}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* FINANCEIRO */}
          {aba === "financeiro" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={`R$ ${kpis.mrr.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} label="MRR atual" sub="↑ 11%" cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                <Kpi valor="R$ 27.751" label="ARR estimado" cor="hsl(36,75%,62%)" />
                <Kpi valor={String(kpis.churn)} label="Cancelamentos" sub="2,1% churn" cor="hsl(0,65%,62%)" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <Card title="Evolução do MRR">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={mrrData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="gradMrr2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(113,48%,60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(113,48%,60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="mes" tick={tickStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(1)}k`} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "MRR"]} />
                      <Area type="monotone" dataKey="mrr" stroke="hsl(113,48%,60%)" strokeWidth={2} fill="url(#gradMrr2)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <Card title="Planos ativos" noPad>
                {[
                  { plano: "Mensal (R$ 19,90)", qtd: 28, receita: 557.20, cor: "hsl(113,48%,60%)" },
                  { plano: "Anual (R$ 98,00)",  qtd: 6,  receita: 588.00, cor: "hsl(36,75%,60%)"  },
                  { plano: "Trial (gratuito)",   qtd: 55, receita: 0,      cor: "hsl(100,18%,45%)" },
                ].map((p,i,arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 20px", borderBottom: i < arr.length-1 ? "0.5px solid hsl(100,18%,18%)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.cor }} />
                      <p style={{ fontSize: 13, color: "hsl(95,30%,80%)" }}>{p.plano}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: p.cor }}>
                        {p.receita > 0 ? `R$ ${p.receita.toLocaleString("pt-BR",{minimumFractionDigits:2})}` : "—"}
                      </p>
                      <p style={{ fontSize: 11, color: "hsl(100,18%,40%)" }}>{p.qtd} usuários</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* SISTEMA */}
          {aba === "sistema" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Kpi valor={kpis.animais.toLocaleString("pt-BR")} label="Animais na plataforma" cor="hsl(95,30%,85%)" />
                <Kpi valor="99,8%" label="Uptime (30 dias)" cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                <Kpi valor="OK" label="Webhook Ticto" cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
              </div>
              <Card title="Log de eventos recentes" noPad>
                {[
                  { hora: "09:14", msg: "Webhook Ticto — pedro@ex.com ativou Premium", tipo: "ok" },
                  { hora: "08:52", msg: "Novo cadastro — carlos@ex.com (trial)", tipo: "ok" },
                  { hora: "07:30", msg: "Trial expirado sem renovação — user5@ex.com", tipo: "alerta" },
                  { hora: "Ontem", msg: "Backup automático do banco concluído", tipo: "ok" },
                  { hora: "Ontem", msg: "3 usuários cancelaram esta semana", tipo: "erro" },
                ].map((log,i,arr) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 20px", borderBottom: i < arr.length-1 ? "0.5px solid hsl(100,18%,16%)" : "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                      background: log.tipo === "ok" ? "hsl(113,48%,55%)" : log.tipo === "alerta" ? "hsl(36,75%,55%)" : "hsl(0,65%,55%)" }} />
                    <div>
                      <p style={{ fontSize: 13, color: "hsl(95,30%,82%)" }}>{log.msg}</p>
                      <p style={{ fontSize: 11, color: "hsl(100,18%,40%)", marginTop: 3 }}>{log.hora}</p>
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
