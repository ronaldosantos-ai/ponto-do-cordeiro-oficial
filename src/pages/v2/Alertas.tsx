import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertas, TipoAlerta } from "@/hooks/useAlertas";

const TIPO_CFG: Record<TipoAlerta, { icon: string; label: string }> = {
  refugo:          { icon: "🔴", label: "Descarte"       },
  gmd_baixo:       { icon: "⚠️",  label: "GMD baixo"      },
  lote_discrepante:{ icon: "⚖️",  label: "Lote"           },
  recem_nascido:   { icon: "🐣",  label: "Recém-nascido"  },
  pronto_venda:    { icon: "✅",  label: "Pronto p/ venda"},
};

const SEV_CFG = {
  alta:  { bg: "hsl(0,65%,12%)",   borda: "hsl(0,65%,25%)",   cor: "hsl(0,65%,62%)",   label: "Urgente"  },
  media: { bg: "hsl(36,50%,11%)",  borda: "hsl(36,50%,22%)",  cor: "hsl(36,75%,62%)",  label: "Atenção"  },
  info:  { bg: "hsl(113,48%,10%)", borda: "hsl(113,48%,22%)", cor: "hsl(113,48%,60%)", label: "Info"     },
};

const FILTROS: { valor: string; label: string }[] = [
  { valor: "todos",           label: "Todos"          },
  { valor: "alta",            label: "Urgente"        },
  { valor: "media",           label: "Atenção"        },
  { valor: "refugo",          label: "Descarte"       },
  { valor: "gmd_baixo",       label: "GMD baixo"      },
  { valor: "lote_discrepante",label: "Lote"           },
  { valor: "recem_nascido",   label: "Recém-nascido"  },
  { valor: "pronto_venda",    label: "Prontos"        },
];

export default function Alertas() {
  const navigate = useNavigate();
  const { alertas, loading, porSeveridade } = useAlertas();
  const [filtro, setFiltro] = useState("todos");

  const lista = alertas.filter(a => {
    if (filtro === "todos")  return true;
    if (filtro === "alta")   return a.severidade === "alta";
    if (filtro === "media")  return a.severidade === "media";
    return a.tipo === filtro;
  });

  return (
    <div className="page">

      {/* Resumo de severidade */}
      {!loading && alertas.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 16 }}>
          {[
            { label: "Urgentes",  valor: porSeveridade.alta,  ...SEV_CFG.alta  },
            { label: "Atenção",   valor: porSeveridade.media, ...SEV_CFG.media },
            { label: "Prontos",   valor: porSeveridade.info,  ...SEV_CFG.info  },
          ].map((s, i) => (
            <div key={i} style={{ borderRadius: 12, padding: "12px 10px",
              background: s.bg, border: "0.5px solid " + s.borda, textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 600, color: s.cor, lineHeight: 1 }}>
                {s.valor}
              </p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto",
        paddingBottom: 4 }}>
        {FILTROS.map(f => (
          <button key={f.valor} onClick={() => setFiltro(f.valor)} style={{
            whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 8,
            fontSize: 12, fontWeight: 500, border: "0.5px solid", cursor: "pointer",
            background: filtro === f.valor ? "hsl(113,48%,60%)" : "hsl(100,18%,17%)",
            color:      filtro === f.valor ? "hsl(100,20%,11%)" : "hsl(95,30%,75%)",
            borderColor:filtro === f.valor ? "hsl(113,48%,60%)" : "hsl(100,18%,25%)",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40,
          color: "hsl(100,18%,40%)", fontSize: 13 }}>
          Verificando alertas...
        </div>
      )}

      {/* Sem alertas */}
      {!loading && lista.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>
            {filtro === "todos" ? "✅" : "🔍"}
          </p>
          <p style={{ fontSize: 15, fontWeight: 500,
            color: "hsl(95,30%,80%)", marginBottom: 6 }}>
            {filtro === "todos"
              ? alertas.length === 0
                ? "Nenhum animal cadastrado"
                : "Tudo certo com o rebanho"
              : "Nenhum alerta nessa categoria"}
          </p>
          <p style={{ fontSize: 13, color: "hsl(100,18%,45%)" }}>
            {filtro === "todos" && alertas.length === 0
              ? "Cadastre animais para monitorar alertas"
              : "Continue monitorando o rebanho"}
          </p>
        </div>
      )}

      {/* Lista de alertas */}
      {!loading && lista.map((alerta, i) => {
        const tipo = TIPO_CFG[alerta.tipo];
        const sev  = SEV_CFG[alerta.severidade];

        return (
          <div key={alerta.id}
            onClick={() => navigate("/rebanho/" + alerta.animal_id)}
            style={{ borderRadius: 14, border: "0.5px solid " + sev.borda,
              background: sev.bg, marginBottom: 10, cursor: "pointer",
              overflow: "hidden" }}>

            {/* Header do alerta */}
            <div style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", borderBottom: "0.5px solid " + sev.borda }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{tipo.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: sev.cor }}>
                  {alerta.mensagem}
                </p>
                <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 2 }}>
                  #{alerta.brinco}
                  {" · "}
                  {alerta.sexo === "M" ? "Macho" : "Fêmea"}
                  {alerta.lote_nome ? " · Lote " + alerta.lote_nome : ""}
                </p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 8px",
                borderRadius: 5, background: "hsl(100,18%,12%)", color: sev.cor,
                flexShrink: 0 }}>
                {sev.label}
              </span>
            </div>

            {/* Detalhe */}
            {alerta.detalhe && (
              <div style={{ padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "hsl(100,18%,55%)", lineHeight: 1.5 }}>
                  {alerta.detalhe}
                </p>
              </div>
            )}

            {/* Ação específica por tipo */}
            {alerta.tipo === "recem_nascido" && (
              <div style={{ padding: "0 14px 12px" }}>
                <p style={{ fontSize: 11, fontWeight: 500,
                  color: "hsl(36,75%,60%)", marginBottom: 6 }}>
                  Checklist obrigatório:
                </p>
                {[
                  "Cura do umbigo com iodo 10%",
                  "Ingestão de colostro nas primeiras 6 horas",
                  "Identificação (brinco/tatuagem)",
                ].map((item, j) => (
                  <p key={j} style={{ fontSize: 12, color: "hsl(100,18%,55%)",
                    marginBottom: 3, paddingLeft: 10 }}>
                    · {item}
                  </p>
                ))}
              </div>
            )}

            {alerta.tipo === "lote_discrepante" && (
              <div style={{ padding: "0 14px 12px" }}>
                <p style={{ fontSize: 12, color: "hsl(36,75%,55%)" }}>
                  Recomendação: separe os animais menores em um sublote para evitar
                  competição no cocho e garantir crescimento homogêneo.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
