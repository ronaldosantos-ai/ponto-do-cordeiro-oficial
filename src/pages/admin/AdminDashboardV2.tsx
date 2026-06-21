import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface AdminStats {
  total_usuarios: number;
  novos_este_mes: number;
  tempo_medio_uso_dias: number;
  total_animais: number;
  animais_ativos: number;
  total_pesagens: number;
  total_lotes: number;
  total_custos: number;
  media_animais_por_usuario: number;
  total_alertas_custom: number;
  usuarios_por_estado: { estado: string; total: number }[] | null;
  top_cidades: { cidade: string; estado: string; total: number }[] | null;
  uso_funcionalidades: {
    pesagens: number; custos: number; lotes: number;
    alertas: number; animais: number;
  };
  novos_por_mes: { mes: string; novos: number }[] | null;
  top_usuarios: {
    email: string; nome: string | null; animais: number;
    cidade: string | null; estado: string | null; created_at: string;
  }[] | null;
  gerado_em: string;
}

const NAV = [
  { id: "visao",        icon: "⊞", label: "Visão geral"    },
  { id: "usuarios",     icon: "👥", label: "Usuários"       },
  { id: "rebanho",      icon: "🐑", label: "Rebanho"        },
  { id: "engajamento",  icon: "📊", label: "Engajamento"    },
  { id: "geografia",    icon: "🗺️",  label: "Geografia"      },
];

const tick  = { fill: "hsl(100,18%,45%)", fontSize: 10 };
const gridC = "hsl(100,18%,20%)";
const tip   = { background: "hsl(100,18%,13%)", border: "0.5px solid hsl(100,18%,22%)", borderRadius: 8, fontSize: 12 };

function Kpi({ valor, label, sub, cor, bg }: {
  valor: string; label: string; sub?: string; cor: string; bg?: string;
}) {
  return (
    <div style={{ borderRadius: 12, padding: "14px", background: bg ?? "hsl(100,18%,15%)",
      border: "0.5px solid hsl(100,18%,20%)" }}>
      <p style={{ fontSize: 26, fontWeight: 600, color: cor, lineHeight: 1 }}>{valor}</p>
      <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>{label}</p>
      {sub && <p style={{ fontSize: 10, color: "hsl(100,18%,38%)", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

function Card({ title, children, action }: {
  title: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
      border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>{title}</p>
        {action}
      </div>
      <div style={{ padding: "14px 16px" }}>{children}</div>
    </div>
  );
}

export default function AdminDashboardV2() {
  const navigate  = useNavigate();
  const [aba, setAba]     = useState("visao");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]   = useState<string | null>(null);

  useEffect(() => { carregarStats(); }, []);

  async function carregarStats() {
    setLoading(true);
    setErro(null);
    const { data, error } = await supabase.rpc("get_admin_stats");
    if (error) { setErro(error.message); setLoading(false); return; }
    setStats(data as AdminStats);
    setLoading(false);
  }

  const funcionalidades = stats ? [
    { nome: "Animais cadastrados", valor: stats.uso_funcionalidades.animais,  icon: "🐑" },
    { nome: "Pesagens registradas", valor: stats.uso_funcionalidades.pesagens, icon: "⚖️" },
    { nome: "Custos lançados",      valor: stats.uso_funcionalidades.custos,   icon: "💰" },
    { nome: "Lotes criados",        valor: stats.uso_funcionalidades.lotes,    icon: "📋" },
    { nome: "Alertas personalizados",valor: stats.uso_funcionalidades.alertas, icon: "🔔" },
  ].sort((a, b) => b.valor - a.valor) : [];

  const maxFuncionalidade = Math.max(...funcionalidades.map(f => f.valor), 1);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "hsl(100,20%,9%)" }}>

      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "hsl(100,20%,11%)",
        borderRight: "0.5px solid hsl(100,18%,16%)",
        display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px",
          borderBottom: "0.5px solid hsl(100,18%,16%)" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
              🐑 Ponto do Cordeiro
            </p>
            <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginTop: 3 }}>
              Painel Super Admin
            </p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setAba(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, marginBottom: 2,
              border: "none", cursor: "pointer", textAlign: "left",
              background: aba === item.id ? "hsl(113,48%,14%)" : "transparent",
              color: aba === item.id ? "hsl(113,48%,65%)" : "hsl(100,18%,50%)",
              fontSize: 13, fontWeight: aba === item.id ? 500 : 400,
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "0.5px solid hsl(100,18%,16%)" }}>
          <button onClick={() => navigate("/dashboard")} style={{
            background: "none", border: "none", color: "hsl(100,18%,40%)",
            fontSize: 12, cursor: "pointer", padding: 0 }}>
            ← Sair do admin
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{ height: 64, flexShrink: 0, background: "hsl(100,20%,11%)",
          borderBottom: "0.5px solid hsl(100,18%,16%)",
          display: "flex", alignItems: "center", padding: "0 28px", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "hsl(100,18%,40%)" }}>Admin</span>
            <span style={{ fontSize: 12, color: "hsl(100,18%,28%)" }}>›</span>
            <span style={{ fontSize: 12, color: "hsl(95,30%,72%)" }}>
              {NAV.find(n => n.id === aba)?.label}
            </span>
          </div>
          <div style={{ flex: 1 }} />
          {stats && (
            <p style={{ fontSize: 11, color: "hsl(100,18%,38%)" }}>
              Atualizado: {new Date(stats.gerado_em).toLocaleTimeString("pt-BR")}
            </p>
          )}
          <button onClick={carregarStats} style={{
            background: "hsl(100,18%,17%)", border: "0.5px solid hsl(100,18%,22%)",
            borderRadius: 8, padding: "6px 12px", color: "hsl(100,18%,55%)",
            fontSize: 12, cursor: "pointer" }}>
            ↻ Atualizar
          </button>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>

          {loading && (
            <div style={{ textAlign: "center", padding: 60, color: "hsl(100,18%,40%)" }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🐑</p>
              <p style={{ fontSize: 14 }}>Carregando dados...</p>
            </div>
          )}

          {erro && (
            <div style={{ background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
              borderRadius: 12, padding: 20, color: "hsl(0,65%,62%)", fontSize: 13 }}>
              Erro: {erro}
            </div>
          )}

          {!loading && stats && (

            <>
              {/* ── VISÃO GERAL ── */}
              {aba === "visao" && (
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
                    Visão geral
                  </h1>

                  {/* KPIs principais */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                    <Kpi valor={String(stats.total_usuarios)} label="Usuários cadastrados"
                      sub={`+${stats.novos_este_mes} este mês`} cor="hsl(95,30%,92%)" />
                    <Kpi valor={String(stats.animais_ativos)} label="Animais ativos na plataforma"
                      cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                    <Kpi valor={String(stats.total_pesagens)} label="Pesagens registradas"
                      cor="hsl(36,75%,62%)" bg="hsl(36,50%,10%)" />
                    <Kpi valor={stats.tempo_medio_uso_dias ? stats.tempo_medio_uso_dias + " dias" : "—"}
                      label="Tempo médio de uso" sub="desde o cadastro" cor="hsl(95,30%,75%)" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
                    <Kpi valor={String(stats.total_lotes)} label="Lotes ativos" cor="hsl(95,30%,85%)" />
                    <Kpi valor={String(stats.total_custos)} label="Lançamentos de custo" cor="hsl(95,30%,85%)" />
                    <Kpi valor={stats.media_animais_por_usuario ? String(stats.media_animais_por_usuario) : "—"}
                      label="Média animais/usuário" cor="hsl(95,30%,85%)" />
                    <Kpi valor={String(stats.total_alertas_custom)} label="Alertas personalizados ativos"
                      cor="hsl(36,75%,62%)" />
                  </div>

                  {/* Gráfico crescimento */}
                  {stats.novos_por_mes && stats.novos_por_mes.length > 0 && (
                    <Card title="Novos usuários por mês">
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={stats.novos_por_mes}
                          margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                          <CartesianGrid strokeDasharray="4 4" stroke={gridC} vertical={false} />
                          <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
                          <YAxis tick={tick} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tip} formatter={(v) => [v, "Novos usuários"]} />
                          <Bar dataKey="novos" fill="hsl(113,48%,50%)" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  {/* Funcionalidades mais usadas */}
                  <Card title="Funcionalidades mais utilizadas">
                    {funcionalidades.map((f, i) => (
                      <div key={i} style={{ marginBottom: i < funcionalidades.length-1 ? 12 : 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 5 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{f.icon}</span>
                            <p style={{ fontSize: 13, color: "hsl(95,30%,82%)" }}>{f.nome}</p>
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
                            {f.valor.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: "hsl(100,18%,20%)" }}>
                          <div style={{
                            height: "100%", borderRadius: 3,
                            background: i === 0 ? "hsl(113,48%,55%)"
                              : i === 1 ? "hsl(113,48%,40%)"
                              : "hsl(113,48%,28%)",
                            width: `${Math.round((f.valor / maxFuncionalidade) * 100)}%`,
                            transition: "width 0.5s",
                          }} />
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}

              {/* ── USUÁRIOS ── */}
              {aba === "usuarios" && (
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
                    Usuários
                  </h1>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                    <Kpi valor={String(stats.total_usuarios)} label="Total cadastrados" cor="hsl(95,30%,92%)" />
                    <Kpi valor={String(stats.novos_este_mes)} label="Novos este mês"
                      cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                    <Kpi valor={stats.tempo_medio_uso_dias + " dias"} label="Tempo médio de uso"
                      cor="hsl(36,75%,62%)" />
                  </div>

                  {/* Top usuários */}
                  {stats.top_usuarios && stats.top_usuarios.length > 0 && (
                    <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
                      border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden" }}>
                      <div style={{ padding: "14px 16px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>
                          Usuários mais ativos
                        </p>
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>{["Usuário","Animais","Localização","Cadastro"].map(h => (
                            <th key={h} style={{ padding: "10px 16px", textAlign: "left",
                              fontSize: 11, fontWeight: 500, color: "hsl(100,18%,38%)",
                              textTransform: "uppercase", letterSpacing: "0.05em",
                              borderBottom: "0.5px solid hsl(100,18%,18%)" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {stats.top_usuarios.map((u, i) => (
                            <tr key={i} style={{ borderBottom: "0.5px solid hsl(100,18%,16%)" }}>
                              <td style={{ padding: "12px 16px" }}>
                                <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                                  {u.nome || "—"}
                                </p>
                                <p style={{ fontSize: 11, color: "hsl(100,18%,42%)" }}>{u.email}</p>
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <span style={{ fontSize: 14, fontWeight: 600,
                                  color: u.animais > 0 ? "hsl(113,48%,62%)" : "hsl(100,18%,45%)" }}>
                                  {u.animais}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", fontSize: 12,
                                color: "hsl(100,18%,55%)" }}>
                                {u.cidade ? `${u.cidade}/${u.estado}` : u.estado || "—"}
                              </td>
                              <td style={{ padding: "12px 16px", fontSize: 11,
                                color: "hsl(100,18%,42%)" }}>
                                {new Date(u.created_at).toLocaleDateString("pt-BR")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── REBANHO ── */}
              {aba === "rebanho" && (
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
                    Rebanho na plataforma
                  </h1>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                    <Kpi valor={String(stats.total_animais)} label="Total de animais cadastrados"
                      cor="hsl(95,30%,92%)" />
                    <Kpi valor={String(stats.animais_ativos)} label="Animais ativos"
                      cor="hsl(113,48%,62%)" bg="hsl(113,48%,10%)" />
                    <Kpi valor={String(stats.total_pesagens)} label="Pesagens registradas"
                      cor="hsl(36,75%,62%)" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                    <Kpi valor={String(stats.total_lotes)} label="Lotes ativos" cor="hsl(95,30%,85%)" />
                    <Kpi valor={String(stats.total_custos)} label="Lançamentos de custo" cor="hsl(95,30%,85%)" />
                    <Kpi valor={stats.media_animais_por_usuario ? String(stats.media_animais_por_usuario) : "—"}
                      label="Média de animais por produtor" cor="hsl(95,30%,85%)" />
                  </div>

                  <Card title="O que os produtores estão registrando">
                    <p style={{ fontSize: 13, color: "hsl(100,18%,50%)", lineHeight: 1.6 }}>
                      Cada pesagem registrada representa um produtor tomando uma decisão baseada em dados.
                      Com <strong style={{ color: "hsl(113,48%,60%)" }}>{stats.total_pesagens.toLocaleString("pt-BR")} pesagens</strong> na
                      plataforma e média de <strong style={{ color: "hsl(113,48%,60%)" }}>{stats.media_animais_por_usuario} animais por produtor</strong>,
                      o Ponto do Cordeiro já está gerando impacto real no manejo dos rebanhos.
                    </p>
                  </Card>
                </div>
              )}

              {/* ── ENGAJAMENTO ── */}
              {aba === "engajamento" && (
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
                    Engajamento
                  </h1>

                  {/* Gráfico crescimento */}
                  {stats.novos_por_mes && stats.novos_por_mes.length > 0 && (
                    <Card title="Crescimento de usuários — últimos 6 meses">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.novos_por_mes}
                          margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                          <CartesianGrid strokeDasharray="4 4" stroke={gridC} vertical={false} />
                          <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
                          <YAxis tick={tick} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tip} formatter={(v) => [v, "Novos usuários"]} />
                          <Bar dataKey="novos" fill="hsl(113,48%,50%)" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  {/* Ranking funcionalidades */}
                  <Card title="Ranking de uso das funcionalidades">
                    {funcionalidades.map((f, i) => (
                      <div key={i} style={{ marginBottom: i < funcionalidades.length-1 ? 16 : 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{f.icon}</span>
                            <p style={{ fontSize: 13, color: "hsl(95,30%,82%)" }}>{f.nome}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
                              {f.valor.toLocaleString("pt-BR")}
                            </p>
                            <p style={{ fontSize: 10, color: "hsl(100,18%,40%)" }}>
                              {Math.round(f.valor / maxFuncionalidade * 100)}% do líder
                            </p>
                          </div>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, background: "hsl(100,18%,20%)" }}>
                          <div style={{
                            height: "100%", borderRadius: 4,
                            background: `hsl(113,48%,${55 - i * 8}%)`,
                            width: `${Math.round((f.valor / maxFuncionalidade) * 100)}%`,
                          }} />
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* Alertas ativos */}
                  <Card title="Alertas personalizados ativos">
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <p style={{ fontSize: 36, fontWeight: 600, color: "hsl(36,75%,62%)" }}>
                        {stats.total_alertas_custom}
                      </p>
                      <p style={{ fontSize: 13, color: "hsl(100,18%,50%)", lineHeight: 1.5 }}>
                        alertas criados pelos produtores ainda não resolvidos.
                        Isso indica que os produtores estão usando o sistema de forma proativa.
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* ── GEOGRAFIA ── */}
              {aba === "geografia" && (
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 20 }}>
                    Geografia
                  </h1>

                  {/* Por estado */}
                  {stats.usuarios_por_estado && stats.usuarios_por_estado.length > 0 ? (
                    <Card title="Produtores por estado">
                      {stats.usuarios_por_estado.map((e, i) => {
                        const max = stats.usuarios_por_estado![0].total;
                        return (
                          <div key={i} style={{ marginBottom: i < stats.usuarios_por_estado!.length-1 ? 12 : 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between",
                              alignItems: "center", marginBottom: 5 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 36, height: 24, borderRadius: 4,
                                  background: "hsl(100,18%,22%)", display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                  fontSize: 11, fontWeight: 600, color: "hsl(95,30%,80%)" }}>
                                  {e.estado}
                                </div>
                              </div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
                                {e.total} produtor{e.total !== 1 ? "es" : ""}
                              </p>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: "hsl(100,18%,20%)" }}>
                              <div style={{
                                height: "100%", borderRadius: 3,
                                background: "hsl(113,48%,50%)",
                                width: `${Math.round((e.total / max) * 100)}%`,
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </Card>
                  ) : (
                    <Card title="Produtores por estado">
                      <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", textAlign: "center", padding: "16px 0" }}>
                        Nenhum produtor preencheu o estado ainda nas configurações
                      </p>
                    </Card>
                  )}

                  {/* Top cidades */}
                  {stats.top_cidades && stats.top_cidades.length > 0 ? (
                    <Card title="Top cidades">
                      {stats.top_cidades.map((c, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", padding: "10px 0",
                          borderBottom: i < stats.top_cidades!.length-1 ? "0.5px solid hsl(100,18%,18%)" : "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16, color: "hsl(100,18%,45%)" }}>
                              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "•"}
                            </span>
                            <p style={{ fontSize: 13, color: "hsl(95,30%,82%)" }}>
                              {c.cidade}
                              {c.estado ? <span style={{ color: "hsl(100,18%,45%)" }}> / {c.estado}</span> : ""}
                            </p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
                            {c.total}
                          </p>
                        </div>
                      ))}
                    </Card>
                  ) : (
                    <Card title="Top cidades">
                      <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", textAlign: "center", padding: "16px 0" }}>
                        Nenhum produtor preencheu a cidade ainda
                      </p>
                    </Card>
                  )}

                  <div style={{ background: "hsl(113,48%,10%)", borderRadius: 12,
                    border: "0.5px solid hsl(113,48%,20%)", padding: "14px 16px" }}>
                    <p style={{ fontSize: 12, color: "hsl(113,48%,55%)", lineHeight: 1.6 }}>
                      💡 <strong>Oportunidade:</strong> Regiões com mais produtores são candidatas a parcerias
                      com fornecedores locais de ração, medicamentos e equipamentos.
                      Um desconto coletivo para os produtores da plataforma pode ser um diferencial competitivo.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
