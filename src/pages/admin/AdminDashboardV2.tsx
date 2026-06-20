import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock data — substituir por queries Supabase ──
const kpis = {
  totalUsuarios: 142,
  ativos30dias: 89,
  premium: 34,
  trial: 55,
  mrr: 2312.60,
  churnMes: 3,
  novosHoje: 4,
  animaisCadastrados: 8743,
};

const receitaMeses = [980, 1100, 1340, 1580, 1890, 2100, 2312];
const meses = ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"];

const usuariosRecentes = [
  { nome: "João Alves",      email: "joao@exemplo.com",  plano: "premium", status: "ativo",    animais: 87,  data: "21/05" },
  { nome: "Maria Santos",    email: "maria@exemplo.com", plano: "trial",   status: "ativo",    animais: 23,  data: "20/05" },
  { nome: "Pedro Oliveira",  email: "pedro@exemplo.com", plano: "premium", status: "ativo",    animais: 142, data: "19/05" },
  { nome: "Ana Costa",       email: "ana@exemplo.com",   plano: "trial",   status: "expirado", animais: 8,   data: "18/05" },
  { nome: "Carlos Mendes",   email: "carlos@exemplo.com",plano: "premium", status: "ativo",    animais: 64,  data: "17/05" },
];

const alertasSistema = [
  { tipo: "churn",   msg: "3 usuários cancelaram esta semana", cor: "hsl(0 65% 62%)" },
  { tipo: "trial",   msg: "12 trials vencem nos próximos 7 dias", cor: "hsl(36 75% 60%)" },
  { tipo: "webhook", msg: "Último webhook Ticto: OK · 21/05 09:14", cor: "hsl(113 48% 55%)" },
];

function MiniBar({ values, cor }: { values: number[]; cor: string }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          borderRadius: "3px 3px 0 0",
          background: i === values.length - 1 ? cor : cor.replace("60%","20%").replace("62%","20%").replace("55%","20%"),
        }} />
      ))}
    </div>
  );
}

function KpiCard({
  valor, label, sub, cor, bgGrad, children
}: {
  valor: string; label: string; sub?: string;
  cor: string; bgGrad?: string; children?: React.ReactNode;
}) {
  return (
    <div style={{
      borderRadius: 12, padding: "14px",
      background: bgGrad ?? "hsl(100 18% 17%)",
      border: "0.5px solid hsl(100 18% 22%)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 26, fontWeight: 500, color: cor, lineHeight: 1 }}>{valor}</p>
          <p style={{ fontSize: 11, color: "hsl(100 18% 50%)", marginTop: 4 }}>{label}</p>
        </div>
        {sub && (
          <span style={{
            fontSize: 11, padding: "3px 8px", borderRadius: 6,
            background: "hsl(100 18% 12%)", color: "hsl(100 18% 50%)", fontWeight: 500,
          }}>{sub}</span>
        )}
      </div>
      {children}
    </div>
  );
}

const planoCor = { premium: "badge-pronto", trial: "badge-atencao", expirado: "badge-refugo" };
const planoLabel = { premium: "Premium", trial: "Trial", expirado: "Expirado" };
const statusCor: Record<string, string> = { ativo: "hsl(113 48% 55%)", expirado: "hsl(0 65% 55%)" };

export default function AdminDashboardV2() {
  const navigate = useNavigate();
  const [aba, setAba] = useState<"usuarios"|"financeiro"|"sistema">("usuarios");

  return (
    <div style={{
      minHeight: "100vh",
      background: "hsl(100 20% 8%)",
      display: "flex",
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: "hsl(100 20% 9%)",
        borderRight: "0.5px solid hsl(100 18% 15%)",
        padding: "24px 0",
        display: "flex", flexDirection: "column",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "0.5px solid hsl(100 18% 15%)" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "hsl(113 48% 60%)" }}>🐑 Ponto do Cordeiro</p>
          <p style={{ fontSize: 11, color: "hsl(100 18% 40%)", marginTop: 2 }}>Painel Admin</p>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {[
            { id: "usuarios",   icon: "👥", label: "Usuários" },
            { id: "financeiro", icon: "💰", label: "Financeiro" },
            { id: "sistema",    icon: "⚙️",  label: "Sistema" },
          ].map(item => (
            <button key={item.id}
              onClick={() => setAba(item.id as any)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, marginBottom: 4,
                background: aba === item.id ? "hsl(113 48% 12%)" : "transparent",
                border: "none", cursor: "pointer",
                color: aba === item.id ? "hsl(113 48% 65%)" : "hsl(100 18% 50%)",
                fontSize: 13, fontWeight: aba === item.id ? 500 : 400,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "0.5px solid hsl(100 18% 15%)" }}>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "none", color: "hsl(100 18% 40%)",
            fontSize: 12, cursor: "pointer", padding: 0
          }}>
            ← Sair do admin
          </button>
        </div>
      </aside>

      {/* ── Conteúdo principal ── */}
      <main style={{ flex: 1, padding: "28px 28px 40px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "hsl(95 30% 92%)", marginBottom: 4 }}>
            {aba === "usuarios" ? "Usuários" : aba === "financeiro" ? "Financeiro" : "Sistema"}
          </h1>
          <p style={{ fontSize: 13, color: "hsl(100 18% 45%)" }}>
            Atualizado agora · {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* ── ABA: USUÁRIOS ── */}
        {aba === "usuarios" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
              <KpiCard valor={String(kpis.totalUsuarios)} label="Total de usuários" sub="↑ 4 hoje"
                cor="hsl(95 30% 92%)" />
              <KpiCard valor={String(kpis.ativos30dias)} label="Ativos (30 dias)"
                sub={`${Math.round(kpis.ativos30dias/kpis.totalUsuarios*100)}%`}
                cor="hsl(113 48% 60%)"
                bgGrad="linear-gradient(135deg, hsl(113 40% 13%) 0%, hsl(113 30% 10%) 100%)" />
              <KpiCard valor={String(kpis.premium)} label="Assinantes premium"
                cor="hsl(36 75% 60%)"
                bgGrad="linear-gradient(135deg, hsl(36 50% 13%) 0%, hsl(36 40% 10%) 100%)" />
              <KpiCard valor={String(kpis.trial)} label="Em período trial"
                cor="hsl(95 30% 75%)" />
            </div>

            {/* Alertas rápidos */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {alertasSistema.map((a, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 10, padding: "10px 14px",
                  background: "hsl(100 18% 13%)",
                  borderLeft: `3px solid ${a.cor}`,
                }}>
                  <p style={{ fontSize: 12, color: "hsl(95 30% 80%)" }}>{a.msg}</p>
                </div>
              ))}
            </div>

            {/* Tabela de usuários */}
            <div style={{
              background: "hsl(100 18% 13%)",
              borderRadius: 12,
              border: "0.5px solid hsl(100 18% 18%)",
              overflow: "hidden",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 18px",
                borderBottom: "0.5px solid hsl(100 18% 18%)",
              }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>Usuários recentes</p>
                <button style={{
                  background: "none", border: "0.5px solid hsl(100 18% 25%)",
                  borderRadius: 8, padding: "5px 12px", color: "hsl(100 18% 55%)",
                  fontSize: 12, cursor: "pointer",
                }}>Ver todos</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Usuário", "Plano", "Animais", "Status", "Cadastro"].map(h => (
                      <th key={h} style={{
                        padding: "10px 18px", textAlign: "left",
                        fontSize: 11, fontWeight: 500, color: "hsl(100 18% 40%)",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        borderBottom: "0.5px solid hsl(100 18% 18%)",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuariosRecentes.map((u, i) => (
                    <tr key={i} style={{ borderBottom: "0.5px solid hsl(100 18% 16%)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95 30% 90%)" }}>{u.nome}</p>
                        <p style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>{u.email}</p>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span className={planoCor[u.plano as keyof typeof planoCor]}>
                          {planoLabel[u.plano as keyof typeof planoLabel]}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", fontSize: 13, color: "hsl(95 30% 80%)" }}>
                        {u.animais}
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ fontSize: 12, color: statusCor[u.status] }}>● {u.status}</span>
                      </td>
                      <td style={{ padding: "12px 18px", fontSize: 12, color: "hsl(100 18% 45%)" }}>
                        {u.data}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ABA: FINANCEIRO ── */}
        {aba === "financeiro" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              <KpiCard
                valor={`R$ ${kpis.mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                label="MRR (receita mensal recorrente)"
                sub="↑ 11%"
                cor="hsl(113 48% 65%)"
                bgGrad="linear-gradient(135deg, hsl(113 40% 13%) 0%, hsl(113 30% 10%) 100%)"
              />
              <KpiCard valor={String(kpis.premium)} label="Assinantes ativos"
                sub="R$ 19,90/mês" cor="hsl(36 75% 65%)"
                bgGrad="linear-gradient(135deg, hsl(36 50% 13%) 0%, hsl(36 40% 10%) 100%)" />
              <KpiCard valor={String(kpis.churnMes)} label="Cancelamentos este mês"
                sub="2,1% churn" cor="hsl(0 65% 62%)" />
            </div>

            {/* Gráfico MRR */}
            <div style={{
              background: "hsl(100 18% 13%)", borderRadius: 12,
              border: "0.5px solid hsl(100 18% 18%)", padding: "18px 20px", marginBottom: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>Evolução do MRR</p>
                <p style={{ fontSize: 12, color: "hsl(113 48% 55%)" }}>R$ 2.312,60 este mês</p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {receitaMeses.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: 10, color: "hsl(113 48% 50%)" }}>
                      {i === receitaMeses.length - 1 ? `R$${(v/1000).toFixed(1)}k` : ""}
                    </p>
                    <div style={{
                      width: "100%",
                      height: `${(v / Math.max(...receitaMeses)) * 64}px`,
                      borderRadius: "4px 4px 0 0",
                      background: i === receitaMeses.length - 1
                        ? "hsl(113 48% 60%)"
                        : "hsl(113 48% 20%)",
                    }} />
                    <span style={{ fontSize: 10, color: "hsl(100 18% 35%)" }}>{meses[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown planos */}
            <div style={{
              background: "hsl(100 18% 13%)", borderRadius: 12,
              border: "0.5px solid hsl(100 18% 18%)", padding: "18px 20px",
            }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)", marginBottom: 16 }}>
                Breakdown de planos
              </p>
              {[
                { plano: "Mensal (R$ 19,90)", qtd: 28, receita: 557.20, cor: "hsl(113 48% 60%)" },
                { plano: "Anual (R$ 98,00)",  qtd: 6,  receita: 588.00, cor: "hsl(36 75% 60%)"  },
                { plano: "Trial (gratuito)",   qtd: 55, receita: 0,      cor: "hsl(100 18% 45%)" },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < 2 ? "0.5px solid hsl(100 18% 18%)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.cor }} />
                    <p style={{ fontSize: 13, color: "hsl(95 30% 80%)" }}>{p.plano}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: p.cor }}>
                      {p.receita > 0 ? `R$ ${p.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                    </p>
                    <p style={{ fontSize: 11, color: "hsl(100 18% 40%)" }}>{p.qtd} usuários</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ABA: SISTEMA ── */}
        {aba === "sistema" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              <KpiCard valor={kpis.animaisCadastrados.toLocaleString("pt-BR")} label="Animais cadastrados na plataforma"
                cor="hsl(95 30% 92%)" />
              <KpiCard valor="99,8%" label="Uptime últimos 30 dias"
                cor="hsl(113 48% 60%)"
                bgGrad="linear-gradient(135deg, hsl(113 40% 13%) 0%, hsl(113 30% 10%) 100%)" />
              <KpiCard valor="OK" label="Status do webhook Ticto"
                cor="hsl(113 48% 60%)"
                bgGrad="linear-gradient(135deg, hsl(113 40% 13%) 0%, hsl(113 30% 10%) 100%)" />
            </div>

            {/* Log de eventos */}
            <div style={{
              background: "hsl(100 18% 13%)", borderRadius: 12,
              border: "0.5px solid hsl(100 18% 18%)", overflow: "hidden",
            }}>
              <div style={{ padding: "14px 18px", borderBottom: "0.5px solid hsl(100 18% 18%)" }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 88%)" }}>Log de eventos recentes</p>
              </div>
              {[
                { hora: "09:14", evento: "Webhook Ticto recebido — usuário pedro@exemplo.com ativou Premium", tipo: "ok" },
                { hora: "08:52", evento: "Novo cadastro — carlos@exemplo.com (trial)", tipo: "ok" },
                { hora: "07:30", evento: "Trial expirado — sem renovação — usuario5@exemplo.com", tipo: "alerta" },
                { hora: "Ontem", evento: "Backup automático do banco de dados concluído", tipo: "ok" },
                { hora: "Ontem", evento: "3 usuários cancelaram assinatura esta semana", tipo: "erro" },
              ].map((log, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  padding: "12px 18px",
                  borderBottom: i < 4 ? "0.5px solid hsl(100 18% 16%)" : "none",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                    background: log.tipo === "ok" ? "hsl(113 48% 55%)"
                      : log.tipo === "alerta" ? "hsl(36 75% 55%)"
                      : "hsl(0 65% 55%)",
                  }} />
                  <div>
                    <p style={{ fontSize: 13, color: "hsl(95 30% 82%)" }}>{log.evento}</p>
                    <p style={{ fontSize: 11, color: "hsl(100 18% 40%)", marginTop: 2 }}>{log.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
