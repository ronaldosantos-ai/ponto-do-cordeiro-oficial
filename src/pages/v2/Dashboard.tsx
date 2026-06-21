import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimais } from "@/hooks/useAnimais";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

// Gráficos ainda mock — precisam de meses de dados reais
const pesoData = [
  { mes: "Nov", peso: 22 }, { mes: "Dez", peso: 25 }, { mes: "Jan", peso: 28 },
  { mes: "Fev", peso: 30 }, { mes: "Mar", peso: 31 }, { mes: "Abr", peso: 33 }, { mes: "Mai", peso: 34 },
];
const gmdData = [
  { mes: "Nov", real: 120 }, { mes: "Dez", real: 135 }, { mes: "Jan", real: 128 },
  { mes: "Fev", real: 142 }, { mes: "Mar", real: 138 }, { mes: "Abr", real: 151 }, { mes: "Mai", real: 148 },
];

const tick  = { fill: "hsl(100,18%,45%)", fontSize: 10 };
const gridC = "hsl(100,18%,20%)";
const tip   = { background: "hsl(100,18%,13%)", border: "0.5px solid hsl(100,18%,22%)", borderRadius: 8, fontSize: 12 };

const hora = new Date().getHours();
const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

const statusCfg = {
  pronto:   { label: "Pronto",   cls: "badge-pronto"  },
  atencao:  { label: "Atenção",  cls: "badge-atencao" },
  refugo:   { label: "Refugo",   cls: "badge-refugo"  },
  normal:   { label: "Normal",   cls: "badge-pronto"  },
  sem_dados:{ label: "Sem dados",cls: "badge-atencao" },
};

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { animais, loading } = useAnimais();
  const [periodo, setPeriodo] = useState<"mes"|"ano">("mes");

  // KPIs calculados dos dados reais
  const total   = animais.length;
  const prontos = animais.filter(a => a.status === "pronto").length;
  const atencao = animais.filter(a => a.status === "atencao").length;
  const refugo  = animais.filter(a => a.status === "refugo").length;

  // Lista de atenção imediata — refugo e atenção primeiro, máx 5
  const criticos = [...animais]
    .filter(a => a.status === "atencao" || a.status === "refugo")
    .sort((a, b) => {
      if (a.status === "refugo" && b.status !== "refugo") return -1;
      if (b.status === "refugo" && a.status !== "refugo") return 1;
      return (a.gmd ?? 999) - (b.gmd ?? 999);
    })
    .slice(0, 5);

  return (
    <div>
      <style>{`
        .kpi-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .charts-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        .btm-grid    { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 768px) {
          .kpi-grid    { grid-template-columns: repeat(4,1fr); }
          .charts-grid { grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
          .btm-grid    { grid-template-columns: 2fr 1fr; gap: 12px; }
        }
      `}</style>

      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, color: "hsl(113,48%,50%)", marginBottom: 3 }}>{saudacao}</p>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1.2 }}>
            Visão geral
          </h1>
        </div>
        <button onClick={() => navigate("/rebanho/novo")} style={{
          background: "hsl(113,48%,60%)", color: "hsl(100,20%,10%)",
          border: "none", borderRadius: 10, padding: "9px 14px",
          fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
          + Animal
        </button>
      </div>

      {/* KPIs — dados reais */}
      <div className="kpi-grid">
        {[
          { valor: loading ? "..." : total,   label: "Animais ativos",   sub: undefined,                               cor: "hsl(95,30%,92%)",  bg: "hsl(100,18%,15%)" },
          { valor: loading ? "..." : prontos, label: "Prontos p/ venda", sub: total > 0 ? Math.round(prontos/total*100) + "%" : undefined, cor: "hsl(113,48%,62%)", bg: "hsl(113,48%,10%)" },
          { valor: loading ? "..." : atencao, label: "GMD baixo",        sub: undefined,                               cor: "hsl(36,75%,62%)",  bg: "hsl(36,50%,10%)"  },
          { valor: loading ? "..." : refugo,  label: "Refugo",           sub: undefined,                               cor: "hsl(0,65%,62%)",   bg: "hsl(0,50%,10%)"   },
        ].map((k, i) => (
          <div key={i} style={{ borderRadius: 12, padding: 14,
            background: k.bg, border: "0.5px solid hsl(100,18%,20%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <p style={{ fontSize: 28, fontWeight: 600, color: k.cor, lineHeight: 1 }}>{k.valor}</p>
              {k.sub && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5,
                background: "hsl(100,18%,20%)", color: "hsl(100,18%,55%)", fontWeight: 500 }}>{k.sub}</span>}
            </div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", lineHeight: 1.3 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Gráficos — mock até ter histórico real */}
      <div className="charts-grid">
        <Card title="Peso médio" action={
          <div style={{ display: "flex", gap: 4 }}>
            {(["mes","ano"] as const).map(p => (
              <button key={p} onClick={() => setPeriodo(p)} style={{
                padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                cursor: "pointer", border: "0.5px solid",
                background: periodo === p ? "hsl(113,48%,60%)" : "transparent",
                color: periodo === p ? "hsl(100,20%,10%)" : "hsl(100,18%,50%)",
                borderColor: periodo === p ? "hsl(113,48%,60%)" : "hsl(100,18%,25%)" }}>
                {p === "mes" ? "Mês" : "Ano"}
              </button>
            ))}
          </div>
        }>
          <p style={{ fontSize: 11, color: "hsl(100,18%,38%)", marginBottom: 10, fontStyle: "italic" }}>
            Disponível após registrar pesagens ao longo do tempo
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={pesoData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="gPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="hsl(113,48%,60%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(113,48%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridC} vertical={false} />
              <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} unit="kg" />
              <Tooltip contentStyle={tip} formatter={(v) => [v + " kg", "Peso médio"]} />
              <Area type="monotone" dataKey="peso" stroke="hsl(113,48%,60%)" strokeWidth={2}
                fill="url(#gPeso)" dot={false} strokeOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="GMD por mês" action={
          <span style={{ fontSize: 11, color: "hsl(100,18%,38%)", fontStyle: "italic" }}>exemplo</span>
        }>
          <p style={{ fontSize: 11, color: "hsl(100,18%,38%)", marginBottom: 10, fontStyle: "italic" }}>
            Disponível após registrar pesagens ao longo do tempo
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={gmdData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={gridC} vertical={false} />
              <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} unit="g" />
              <Tooltip contentStyle={tip} formatter={(v) => [v + "g", "GMD"]} />
              <ReferenceLine y={133} stroke="hsl(36,75%,50%)" strokeDasharray="4 4" />
              <Bar dataKey="real" fill="hsl(113,48%,50%)" radius={[4,4,0,0]} fillOpacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Atenção imediata — dados reais */}
      <div className="btm-grid">
        <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
          border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>
              Atenção imediata
              {!loading && criticos.length > 0 && (
                <span style={{ marginLeft: 8, fontSize: 11, padding: "2px 7px", borderRadius: 5,
                  background: "hsl(36,50%,14%)", color: "hsl(36,75%,60%)" }}>
                  {criticos.length}
                </span>
              )}
            </p>
            <button onClick={() => navigate("/rebanho")} style={{
              background: "none", border: "0.5px solid hsl(100,18%,25%)", borderRadius: 7,
              padding: "4px 10px", color: "hsl(100,18%,55%)", fontSize: 11, cursor: "pointer" }}>
              Ver todos
            </button>
          </div>

          {loading && (
            <div style={{ padding: 24, textAlign: "center", color: "hsl(100,18%,40%)", fontSize: 13 }}>
              Carregando...
            </div>
          )}

          {!loading && criticos.length === 0 && (
            <div style={{ padding: 24, textAlign: "center" }}>
              <p style={{ fontSize: 22, marginBottom: 8 }}>✓</p>
              <p style={{ fontSize: 13, color: "hsl(113,48%,55%)", fontWeight: 500 }}>
                {total === 0 ? "Nenhum animal cadastrado ainda" : "Todos os animais estão bem"}
              </p>
            </div>
          )}

          {!loading && criticos.map((a, i) => {
            const s = statusCfg[a.status as keyof typeof statusCfg] ?? statusCfg.normal;
            return (
              <div key={a.id} onClick={() => navigate("/rebanho/" + a.id)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", cursor: "pointer",
                  borderBottom: i < criticos.length - 1 ? "0.5px solid hsl(100,18%,16%)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8,
                    background: "hsl(100,18%,20%)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0 }}>
                    {a.sexo === "M" ? "♂" : "♀"}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                      #{a.brinco}
                    </p>
                    <p style={{ fontSize: 11, color: "hsl(100,18%,50%)" }}>
                      {a.peso_atual ? a.peso_atual + " kg" : "Sem pesagem"}
                      {a.gmd ? " · " + a.gmd + "g/d" : ""}
                      {a.lote_nome ? " · " + a.lote_nome : ""}
                    </p>
                  </div>
                </div>
                <span className={s.cls}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Resumo financeiro — mock */}
        <Card title="Financeiro">
          <p style={{ fontSize: 11, color: "hsl(100,18%,38%)", marginBottom: 14, fontStyle: "italic" }}>
            Disponível após lançar custos
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0.4 }}>
            {[
              { label: "Receita projetada", valor: "—", cor: "hsl(113,48%,62%)" },
              { label: "Custo estimado",    valor: "—", cor: "hsl(95,30%,72%)"  },
              { label: "Margem total",      valor: "—", cor: "hsl(36,75%,62%)"  },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: 11, color: "hsl(100,18%,40%)", marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: item.cor }}>{item.valor}</p>
                {i < 2 && <div style={{ height: "0.5px", background: "hsl(100,18%,20%)", marginTop: 10 }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
