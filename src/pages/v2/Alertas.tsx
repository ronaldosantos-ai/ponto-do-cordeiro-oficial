import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertas, TipoAlerta } from "@/hooks/useAlertas";
import { useAnimais } from "@/hooks/useAnimais";

const TIPO_CFG: Record<TipoAlerta, { icon: string; label: string }> = {
  refugo:          { icon: "🔴", label: "Descarte"        },
  gmd_baixo:       { icon: "⚠️",  label: "GMD baixo"       },
  lote_discrepante:{ icon: "⚖️",  label: "Lote"            },
  recem_nascido:   { icon: "🐣",  label: "Recém-nascido"   },
  pronto_venda:    { icon: "✅",  label: "Pronto p/ venda" },
  custom:          { icon: "📌",  label: "Personalizado"   },
};

const SEV_CFG = {
  alta:  { bg: "hsl(0,65%,12%)",   borda: "hsl(0,65%,25%)",   cor: "hsl(0,65%,62%)",   label: "Urgente" },
  media: { bg: "hsl(36,50%,11%)",  borda: "hsl(36,50%,22%)",  cor: "hsl(36,75%,62%)",  label: "Atenção" },
  info:  { bg: "hsl(113,48%,10%)", borda: "hsl(113,48%,22%)", cor: "hsl(113,48%,60%)", label: "Info"    },
};

const FILTROS = [
  { valor: "todos",            label: "Todos"           },
  { valor: "alta",             label: "Urgente"         },
  { valor: "media",            label: "Atenção"         },
  { valor: "refugo",           label: "Descarte"        },
  { valor: "gmd_baixo",        label: "GMD baixo"       },
  { valor: "lote_discrepante", label: "Lote"            },
  { valor: "recem_nascido",    label: "Recém-nascido"   },
  { valor: "pronto_venda",     label: "Prontos"         },
  { valor: "custom",           label: "Personalizados"  },
];

export default function Alertas() {
  const navigate  = useNavigate();
  const { animais } = useAnimais();
  const {
    alertas, loading, porSeveridade,
    criarAlertaCustom, resolverAlerta, excluirAlerta,
  } = useAlertas();

  const [filtro, setFiltro]         = useState("todos");
  const [showForm, setShowForm]     = useState(false);
  const [salvando, setSalvando]     = useState(false);
  const [form, setForm]             = useState({
    mensagem:   "",
    detalhe:    "",
    severidade: "media" as "alta" | "media" | "info",
    animal_id:  "",
    lote_nome:  "",
  });

  const lista = alertas.filter(a => {
    if (filtro === "todos")  return true;
    if (filtro === "alta")   return a.severidade === "alta";
    if (filtro === "media")  return a.severidade === "media";
    return a.tipo === filtro;
  });

  // Lotes únicos
  const lotes = Array.from(new Set(animais.filter(a => a.lote_nome).map(a => a.lote_nome!)));

  async function salvarCustom() {
    if (!form.mensagem.trim()) return;
    setSalvando(true);
    await criarAlertaCustom({
      mensagem:   form.mensagem.trim(),
      detalhe:    form.detalhe.trim() || undefined,
      severidade: form.severidade,
      animal_id:  form.animal_id || null,
      lote_nome:  form.lote_nome || null,
    });
    setForm({ mensagem: "", detalhe: "", severidade: "media", animal_id: "", lote_nome: "" });
    setShowForm(false);
    setSalvando(false);
  }

  return (
    <div className="page">

      {/* Resumo */}
      {!loading && alertas.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 16 }}>
          {[
            { label: "Urgentes", valor: porSeveridade.alta,  ...SEV_CFG.alta  },
            { label: "Atenção",  valor: porSeveridade.media, ...SEV_CFG.media },
            { label: "Info",     valor: porSeveridade.info,  ...SEV_CFG.info  },
          ].map((s, i) => (
            <div key={i} style={{ borderRadius: 12, padding: "12px 10px",
              background: s.bg, border: "0.5px solid " + s.borda, textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 600, color: s.cor, lineHeight: 1 }}>{s.valor}</p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16,
        overflowX: "auto", paddingBottom: 4 }}>
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

      {/* Formulário alerta personalizado */}
      {showForm && (
        <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
          border: "0.5px solid hsl(100,18%,22%)", padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)", marginBottom: 14 }}>
            Novo alerta personalizado
          </p>

          {/* Severidade */}
          <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 8 }}>Severidade</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {(["alta","media","info"] as const).map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, severidade: s }))} style={{
                padding: "8px 4px", borderRadius: 8, border: "0.5px solid", cursor: "pointer",
                fontSize: 12, fontWeight: form.severidade === s ? 500 : 400,
                background: form.severidade === s ? SEV_CFG[s].bg : "hsl(100,18%,17%)",
                color:      form.severidade === s ? SEV_CFG[s].cor : "hsl(95,30%,75%)",
                borderColor:form.severidade === s ? SEV_CFG[s].borda : "hsl(100,18%,25%)",
              }}>
                {s === "alta" ? "🔴 Urgente" : s === "media" ? "⚠️ Atenção" : "✅ Info"}
              </button>
            ))}
          </div>

          {/* Mensagem */}
          <input className="field" placeholder="Mensagem do alerta *"
            value={form.mensagem} onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
            style={{ marginBottom: 10 }} />

          {/* Detalhe */}
          <textarea className="field" rows={2} placeholder="Detalhe ou instrução (opcional)"
            value={form.detalhe} onChange={e => setForm(f => ({ ...f, detalhe: e.target.value }))}
            style={{ marginBottom: 10, resize: "none", height: "auto", paddingTop: 12 }} />

          {/* Vincular */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <select className="field" value={form.animal_id}
              onChange={e => setForm(f => ({ ...f, animal_id: e.target.value, lote_nome: "" }))}>
              <option value="">Nenhum animal</option>
              {animais.map(a => (
                <option key={a.id} value={a.id}>#{a.brinco}</option>
              ))}
            </select>
            {!form.animal_id && (
              <select className="field" value={form.lote_nome}
                onChange={e => setForm(f => ({ ...f, lote_nome: e.target.value }))}>
                <option value="">Nenhum lote</option>
                {lotes.map(l => (
                  <option key={l} value={l}>Lote {l}</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={salvarCustom} disabled={salvando}
              style={{ opacity: salvando ? 0.7 : 1, flex: 1 }}>
              {salvando ? "Salvando..." : "Criar alerta"}
            </button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}
              style={{ flex: 1 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40,
          color: "hsl(100,18%,40%)", fontSize: 13 }}>
          Verificando alertas...
        </div>
      )}

      {/* Sem alertas */}
      {!loading && lista.length === 0 && (
        <div style={{ textAlign: "center", padding: 32 }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>
            {filtro === "todos" ? "✅" : "🔍"}
          </p>
          <p style={{ fontSize: 15, fontWeight: 500,
            color: "hsl(95,30%,80%)", marginBottom: 6 }}>
            {filtro === "todos" && alertas.length === 0
              ? "Nenhum animal cadastrado"
              : filtro === "todos"
              ? "Tudo certo com o rebanho"
              : "Nenhum alerta nessa categoria"}
          </p>
          <p style={{ fontSize: 13, color: "hsl(100,18%,45%)" }}>
            {filtro === "todos" && alertas.length === 0
              ? "Cadastre animais para monitorar alertas"
              : "Continue monitorando o rebanho"}
          </p>
        </div>
      )}

      {/* Lista */}
      {!loading && lista.map(alerta => {
        const tipo = TIPO_CFG[alerta.tipo];
        const sev  = SEV_CFG[alerta.severidade];
        return (
          <div key={alerta.id} style={{ borderRadius: 14, border: "0.5px solid " + sev.borda,
            background: sev.bg, marginBottom: 10, overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", borderBottom: "0.5px solid " + sev.borda }}
              onClick={() => alerta.animal_id && navigate("/rebanho/" + alerta.animal_id)}
              style2={{ cursor: alerta.animal_id ? "pointer" : "default" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{tipo.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: sev.cor }}>
                  {alerta.mensagem}
                </p>
                <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 2 }}>
                  {alerta.brinco ? "#" + alerta.brinco + " · " : ""}
                  {alerta.lote_nome ? "Lote " + alerta.lote_nome + " · " : ""}
                  {tipo.label}
                </p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 8px",
                borderRadius: 5, background: "hsl(100,18%,12%)", color: sev.cor, flexShrink: 0 }}>
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

            {/* Checklist recém-nascido */}
            {alerta.tipo === "recem_nascido" && (
              <div style={{ padding: "0 14px 12px" }}>
                <p style={{ fontSize: 11, fontWeight: 500,
                  color: "hsl(36,75%,60%)", marginBottom: 6 }}>
                  Checklist obrigatório:
                </p>
                {["Cura do umbigo com iodo 10%",
                  "Ingestão de colostro nas primeiras 6 horas",
                  "Identificação (brinco/tatuagem)"].map((item, j) => (
                  <p key={j} style={{ fontSize: 12, color: "hsl(100,18%,55%)",
                    marginBottom: 3, paddingLeft: 10 }}>· {item}</p>
                ))}
              </div>
            )}

            {/* Ações para alertas personalizados */}
            {alerta.custom && (
              <div style={{ display: "flex", gap: 8, padding: "0 14px 12px" }}>
                <button onClick={() => resolverAlerta(alerta.id.replace("custom_", ""))}
                  style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none",
                    cursor: "pointer", fontSize: 12, fontWeight: 500,
                    background: "hsl(113,48%,14%)", color: "hsl(113,48%,60%)" }}>
                  ✓ Marcar resolvido
                </button>
                <button onClick={() => excluirAlerta(alerta.id.replace("custom_", ""))}
                  style={{ padding: "7px 12px", borderRadius: 8,
                    border: "0.5px solid hsl(0,65%,25%)", cursor: "pointer",
                    fontSize: 12, background: "transparent", color: "hsl(0,65%,55%)" }}>
                  Excluir
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* FAB — novo alerta personalizado */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{
          position: "fixed", bottom: 80, right: 20,
          width: 52, height: 52, borderRadius: "50%",
          background: "hsl(113,48%,60%)", color: "hsl(100,20%,11%)",
          fontSize: 24, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px hsl(113,48%,20%,0.6)" }}>
          +
        </button>
      )}
    </div>
  );
}
