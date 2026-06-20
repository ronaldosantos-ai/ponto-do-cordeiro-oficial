import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

const resumo = { total: 87, prontos: 62, atencao: 14, refugo: 3, gmdMedio: 148, margemMedia: 58 };

const alertas = [
  { id: "A-0042", sexo: "M", peso: 34.2, dias: 94,  lote: "Verão",  status: "atencao", gmd: 112 },
  { id: "B-0017", sexo: "F", peso: 28.1, dias: 112, lote: "Verão",  status: "refugo",  gmd: 88  },
  { id: "A-0055", sexo: "M", peso: 41.0, dias: 78,  lote: "Outono", status: "pronto",  gmd: 165 },
  { id: "B-0023", sexo: "F", peso: 31.0, dias: 88,  lote: "Verão",  status: "atencao", gmd: 120 },
];

const statusCfg = {
  pronto:  { label: "Pronto",  cls: "badge-pronto"  },
  atencao: { label: "Atenção", cls: "badge-atencao" },
  refugo:  { label: "Refugo",  cls: "badge-refugo"  },
};

const pesoData = [
  { mes: "Nov", peso: 22 }, { mes: "Dez", peso: 25 }, { mes: "Jan", peso: 28 },
  { mes: "Fev", peso: 30 }, { mes: "Mar", peso: 31 }, { mes: "Abr", peso: 33 }, { mes: "Mai", peso: 34 },
];

const gmdData = [
  { mes: "Nov", real: 120, meta: 133 }, { mes: "Dez", real: 135, meta: 133 },
  { mes: "Jan", real: 128, meta: 133 }, { mes: "Fev", real: 142, meta: 133 },
  { mes: "Mar", real: 138, meta: 133 }, { mes: "Abr", real: 151, meta: 133 },
  { mes: "Mai", real: 148, meta: 133 },
];

const tickStyle = { fill: "hsl(100,18%,45%)", fontSize: 11 };
const gridColor = "hsl(100,18%,20%)";
const tooltipStyle = { background: "hsl(100,18%,13%)", border: "0.5px solid hsl(100,18%,22%)", borderRadius: 8 };
const tooltipLabel = { color: "hsl(95,30%,85%)", fontSize: 12 };

const hora = new Date().getHours();
const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14, border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)" }}>{title}</p>
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
      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: "hsl(113,48%,50%)", marginBottom: 4 }}>{saudacao}, Ronaldo</p>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)" }}>Visão geral do rebanho</h1>
        </div>
        <button onClick={() => navigate("/rebanho/novo")} style={{
          background: "hsl(113,48%,60%)", color: "hsl(100,20%,10%)",
          border: "none", borderRadius: 10, padding: "10px 18px",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>+ Cadastrar animal</button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { valor: resumo.total,   label: "Animais ativos",       sub: "↑ 4 novos", cor: "hsl(95,30%,92%)",  bg: "hsl(100,18%,15%)" },
          { valor: resumo.prontos, label: "Prontos p/ venda",     sub: `${Math.round(resumo.prontos/resumo.total*100)}%`, cor: "hsl(113,48%,62%)", bg: "hsl(113,48%,10%)" },
          { valor: resumo.atencao, label: "GMD abaixo da meta",   sub: undefined,    cor: "hsl(36,75%,62%)",  bg: "hsl(36,50%,10%)"  },
          { valor: resumo.refugo,  label: "Sugestão de refugo",   sub: undefined,    cor: "hsl(0,65%,62%)",   bg: "hsl(0,50%,10%)"   },
        ].map((k,i) => (
          <div key={i} style={{ borderRadius: 12, padding: 18, background: k.bg, border: "0.5px solid hsl(100,18%,20%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <p style={{ fontSize: 30, fontWeight: 600, color: k.cor, lineHeight: 1 }}>{k.valor}</p>
              {k.sub && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6,
                background: "hsl(100,18%,20%)", color: "hsl(100,18%,55%)", fontWeight: 500 }}>{k.sub}</span>}
            </div>
            <p style={{ fontSize: 12, color: "hsl(100,18%,50%)" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card title="Evolução do peso médio" action={
          <div style={{ display: "flex", gap: 6 }}>
            {(["mes","ano"] as const).map(p => (
              <button key={p} onClick={() => setPeriodo(p)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer",
                border: "0.5px solid",
                background: periodo === p ? "hsl(113,48%,60%)" : "transparent",
                color: periodo === p ? "hsl(100,20%,10%)" : "hsl(100,18%,50%)",
                borderColor: periodo === p ? "hsl(113,48%,60%)" : "hsl(100,18%,25%)",
              }}>{p === "mes" ? "Mês" : "Ano"}</button>
            ))}
          </div>
        }>
          <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(113,48%,62%)" }}>34 kg</p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Peso médio atual</p>
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,85%)" }}>+12 kg</p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Ganho no período</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={pesoData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(113,48%,60%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(113,48%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="mes" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} unit=" kg" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} formatter={(v) => [`${v} kg`, "Peso médio"]} />
              <Area type="monotone" dataKey="peso" stroke="hsl(113,48%,60%)" strokeWidth={2} fill="url(#gradPeso)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="GMD por mês" action={
          <span style={{ fontSize: 11, color: "hsl(113,48%,50%)" }}>Meta: 133g/dia</span>
        }>
          <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(113,48%,62%)" }}>{resumo.gmdMedio}g</p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>GMD médio atual</p>
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(36,75%,62%)" }}>R$ {resumo.margemMedia}</p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)" }}>Margem/cabeça</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={gmdData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis dataKey="mes" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} unit="g" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} formatter={(v) => [`${v}g`]} />
              <ReferenceLine y={133} stroke="hsl(36,75%,50%)" strokeDasharray="4 4" />
              <Bar dataKey="real" name="GMD real" fill="hsl(113,48%,50%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabela + financeiro */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14, border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 20px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)" }}>Atenção imediata</p>
            <button onClick={() => navigate("/rebanho")} style={{
              background: "none", border: "0.5px solid hsl(100,18%,25%)", borderRadius: 8,
              padding: "5px 12px", color: "hsl(100,18%,55%)", fontSize: 12, cursor: "pointer" }}>
              Ver todos
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Animal","Peso","Dias","GMD","Status"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left",
                  fontSize: 11, fontWeight: 500, color: "hsl(100,18%,38%)",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  borderBottom: "0.5px solid hsl(100,18%,18%)" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {alertas.map((a,i) => {
                const s = statusCfg[a.status as keyof typeof statusCfg];
                return (
                  <tr key={i} onClick={() => navigate(`/rebanho/${a.id}`)}
                    style={{ cursor: "pointer", borderBottom: "0.5px solid hsl(100,18%,16%)" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8,
                          background: "hsl(100,18%,20%)", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 14 }}>
                          {a.sexo === "M" ? "♂" : "♀"}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>#{a.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "hsl(95,30%,80%)" }}>{a.peso} kg</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "hsl(95,30%,80%)" }}>{a.dias}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500,
                      color: a.gmd >= 133 ? "hsl(113,48%,55%)" : "hsl(36,75%,55%)" }}>{a.gmd}g</td>
                    <td style={{ padding: "12px 20px" }}><span className={s.cls}>{s.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Card title="Resumo financeiro">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Receita projetada",   valor: "R$ 25.420", cor: "hsl(113,48%,62%)" },
              { label: "Custo estimado",       valor: "R$ 19.488", cor: "hsl(95,30%,75%)"  },
              { label: "Margem total",         valor: "R$ 5.932",  cor: "hsl(36,75%,62%)"  },
              { label: "Prontos × preço",      valor: "62 × R$410",cor: "hsl(95,30%,60%)"  },
            ].map((item,i) => (
              <div key={i}>
                <p style={{ fontSize: 11, color: "hsl(100,18%,40%)", marginBottom: 3 }}>{item.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: item.cor }}>{item.valor}</p>
                {i < 3 && <div style={{ height: "0.5px", background: "hsl(100,18%,20%)", marginTop: 12 }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
