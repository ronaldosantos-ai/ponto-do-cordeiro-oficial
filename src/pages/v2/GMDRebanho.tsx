import { useNavigate } from "react-router-dom";
import { useGMDHistorico } from "@/hooks/useGMDHistorico";
import { useAnimais } from "@/hooks/useAnimais";
import BotaoVoltar from "@/components/v2/BotaoVoltar";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from "recharts";

const tick  = { fill: "hsl(100,18%,45%)", fontSize: 11 };
const gridC = "hsl(100,18%,20%)";
const tip   = {
  background: "hsl(100,18%,13%)",
  border: "0.5px solid hsl(100,18%,22%)",
  borderRadius: 8,
  fontSize: 12,
};

export default function GMDRebanho() {
  const navigate = useNavigate();
  const { dados, loading, metaGMD, temDados } = useGMDHistorico();
  const { animais } = useAnimais();

  // Indicadores atuais
  const comGMD     = animais.filter(a => a.gmd !== null);
  const gmdMedioAtual = comGMD.length
    ? Math.round(comGMD.reduce((s, a) => s + (a.gmd ?? 0), 0) / comGMD.length)
    : null;

  const comPeso    = animais.filter(a => a.peso_atual !== null);
  const pesoMedioAtual = comPeso.length
    ? Math.round(comPeso.reduce((s, a) => s + (a.peso_atual ?? 0), 0) / comPeso.length * 10) / 10
    : null;

  const acimaMeta  = comGMD.filter(a => (a.gmd ?? 0) >= metaGMD).length;
  const abaixoMeta = comGMD.filter(a => (a.gmd ?? 0) < metaGMD).length;

  return (
    <div className="page">
      <BotaoVoltar para="/relatorios" />

      <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 4 }}>
        Desempenho do rebanho
      </h1>
      <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", marginBottom: 20 }}>
        GMD e evolução de peso — últimos 7 meses
      </p>

      {/* KPIs atuais */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div style={{ borderRadius: 12, padding: 14,
          background: gmdMedioAtual && gmdMedioAtual >= metaGMD ? "hsl(113,48%,10%)" : "hsl(36,50%,10%)",
          border: "0.5px solid hsl(100,18%,20%)" }}>
          <p style={{ fontSize: 28, fontWeight: 600, lineHeight: 1,
            color: gmdMedioAtual && gmdMedioAtual >= metaGMD ? "hsl(113,48%,62%)" : "hsl(36,75%,62%)" }}>
            {gmdMedioAtual ? gmdMedioAtual + "g" : "—"}
          </p>
          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>
            GMD médio atual
          </p>
          <p style={{ fontSize: 10, color: "hsl(100,18%,38%)", marginTop: 2 }}>
            Meta: {metaGMD}g/dia
          </p>
        </div>
        <div style={{ borderRadius: 12, padding: 14,
          background: "hsl(100,18%,15%)", border: "0.5px solid hsl(100,18%,20%)" }}>
          <p style={{ fontSize: 28, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
            {pesoMedioAtual ? pesoMedioAtual + " kg" : "—"}
          </p>
          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>Peso médio atual</p>
          <p style={{ fontSize: 10, color: "hsl(100,18%,38%)", marginTop: 2 }}>
            {comPeso.length} animais com pesagem
          </p>
        </div>
      </div>

      {/* Distribuição GMD */}
      {comGMD.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <div style={{ borderRadius: 12, padding: 14,
            background: "hsl(113,48%,10%)", border: "0.5px solid hsl(100,18%,20%)" }}>
            <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(113,48%,62%)", lineHeight: 1 }}>
              {acimaMeta}
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>
              Acima da meta ({metaGMD}g)
            </p>
          </div>
          <div style={{ borderRadius: 12, padding: 14,
            background: "hsl(36,50%,10%)", border: "0.5px solid hsl(100,18%,20%)" }}>
            <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(36,75%,62%)", lineHeight: 1 }}>
              {abaixoMeta}
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>
              Abaixo da meta
            </p>
          </div>
        </div>
      )}

      {/* Gráfico GMD histórico */}
      <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
        border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden", marginBottom: 12 }}>
        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>
            GMD médio por mês
          </p>
          <p style={{ fontSize: 11, color: "hsl(100,18%,40%)", marginTop: 2 }}>
            Linha tracejada = meta de {metaGMD}g/dia
          </p>
        </div>
        <div style={{ padding: "16px 8px 8px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 32,
              color: "hsl(100,18%,40%)", fontSize: 13 }}>Calculando...</div>
          ) : !temDados ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <p style={{ fontSize: 13, color: "hsl(100,18%,40%)", marginBottom: 8 }}>
                Sem dados suficientes ainda
              </p>
              <p style={{ fontSize: 12, color: "hsl(100,18%,32%)" }}>
                Registre pesagens ao longo do tempo para ver o histórico de GMD
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dados} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={gridC} vertical={false} />
                <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} unit="g" />
                <Tooltip contentStyle={tip}
                  formatter={(v: number) => [v + "g/dia", "GMD médio"]} />
                <ReferenceLine y={metaGMD} stroke="hsl(36,75%,50%)"
                  strokeDasharray="4 4" label="" />
                <Bar dataKey="gmd" name="GMD" radius={[4,4,0,0]}
                  fill="hsl(113,48%,50%)"
                  label={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico peso médio histórico */}
      <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
        border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden", marginBottom: 12 }}>
        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>
            Evolução do peso médio
          </p>
        </div>
        <div style={{ padding: "16px 8px 8px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 32,
              color: "hsl(100,18%,40%)", fontSize: 13 }}>Calculando...</div>
          ) : !temDados ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <p style={{ fontSize: 13, color: "hsl(100,18%,40%)" }}>
                Registre pesagens para ver a evolução
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={dados} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(113,48%,60%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(113,48%,60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={gridC} vertical={false} />
                <XAxis dataKey="mes" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} unit="kg" />
                <Tooltip contentStyle={tip}
                  formatter={(v: number) => [v + " kg", "Peso médio"]} />
                <Area type="monotone" dataKey="peso" stroke="hsl(113,48%,60%)"
                  strokeWidth={2} fill="url(#gradPeso)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tabela por animal */}
      {comGMD.length > 0 && (
        <>
          <p style={{ fontSize: 11, fontWeight: 500, color: "hsl(113,48%,55%)",
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            GMD por animal
          </p>
          <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
            border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden" }}>
            {[...animais]
              .filter(a => a.gmd !== null)
              .sort((a, b) => (b.gmd ?? 0) - (a.gmd ?? 0))
              .map((a, i, arr) => {
                const ok = (a.gmd ?? 0) >= metaGMD;
                return (
                  <div key={a.id}
                    onClick={() => navigate("/rebanho/" + a.id)}
                    style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", padding: "11px 14px", cursor: "pointer",
                      borderBottom: i < arr.length - 1 ? "0.5px solid hsl(100,18%,16%)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8,
                        background: ok ? "hsl(113,48%,12%)" : "hsl(36,50%,12%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14 }}>
                        {a.sexo === "M" ? "♂" : "♀"}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                          #{a.brinco}
                        </p>
                        <p style={{ fontSize: 11, color: "hsl(100,18%,50%)" }}>
                          {a.peso_atual ? a.peso_atual + " kg" : "Sem peso"}
                          {a.lote_nome ? " · " + a.lote_nome : ""}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 14, fontWeight: 600,
                        color: ok ? "hsl(113,48%,62%)" : "hsl(36,75%,62%)" }}>
                        {a.gmd}g/d
                      </p>
                      <p style={{ fontSize: 10, color: "hsl(100,18%,40%)" }}>
                        {ok ? "✓ acima" : "⚠ abaixo"}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
