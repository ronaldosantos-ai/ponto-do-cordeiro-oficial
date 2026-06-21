import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimais } from "@/hooks/useAnimais";

const statusCfg = {
  pronto:   { label: "Pronto",   cls: "badge-pronto"  },
  atencao:  { label: "Atenção",  cls: "badge-atencao" },
  refugo:   { label: "Refugo",   cls: "badge-refugo"  },
  normal:   { label: "Normal",   cls: "badge-pronto"  },
  sem_dados:{ label: "Sem dados",cls: "badge-atencao" },
};

const filtros = ["Todos", "Prontos", "Atenção", "Refugo"];
const filtroMap: Record<string, string> = {
  "Prontos": "pronto", "Atenção": "atencao", "Refugo": "refugo"
};

export default function Rebanho() {
  const navigate = useNavigate();
  const { animais, loading, erro, recarregar } = useAnimais();
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca]   = useState("");

  const lista = animais.filter(a => {
    const matchFiltro = filtro === "Todos" || a.status === filtroMap[filtro];
    const matchBusca  = a.brinco.toLowerCase().includes(busca.toLowerCase()) ||
      (a.lote_nome ?? "").toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="page">
      <input className="field" placeholder="Buscar por brinco ou lote..."
        value={busca} onChange={e => setBusca(e.target.value)}
        style={{ marginBottom: 12 }} />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 8,
            fontSize: 13, fontWeight: 500, border: "0.5px solid", cursor: "pointer",
            background: filtro === f ? "hsl(113,48%,60%)" : "hsl(100,18%,17%)",
            color:      filtro === f ? "hsl(100,20%,11%)" : "hsl(95,30%,75%)",
            borderColor:filtro === f ? "hsl(113,48%,60%)" : "hsl(100,18%,25%)",
          }}>{f}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "hsl(100,18%,45%)", fontSize: 14 }}>
          Carregando rebanho...
        </div>
      )}

      {erro && (
        <div style={{ background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
          borderRadius: 10, padding: 14, marginBottom: 16, color: "hsl(0,65%,62%)", fontSize: 13 }}>
          Erro: {erro}
        </div>
      )}

      {!loading && !erro && lista.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🐑</p>
          <p style={{ fontSize: 15, fontWeight: 500, color: "hsl(95,30%,80%)", marginBottom: 6 }}>
            {busca || filtro !== "Todos" ? "Nenhum animal encontrado" : "Nenhum animal cadastrado"}
          </p>
          <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", marginBottom: 20 }}>
            {busca || filtro !== "Todos" ? "Tente outro filtro" : "Cadastre seu primeiro animal"}
          </p>
          {filtro === "Todos" && !busca && (
            <button className="btn-primary" onClick={() => navigate("/rebanho/novo")}
              style={{ maxWidth: 240, margin: "0 auto" }}>
              + Cadastrar animal
            </button>
          )}
        </div>
      )}

      {!loading && lista.map(a => {
        const s = statusCfg[a.status as keyof typeof statusCfg] ?? statusCfg.normal;
        return (
          <div key={a.id} className="animal-row"
            onClick={() => navigate("/rebanho/" + a.id)}
            style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10,
                background: "hsl(100,18%,22%)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0 }}>
                {a.sexo === "M" ? "♂" : "♀"}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,92%)", marginBottom: 2 }}>
                  #{a.brinco}
                </p>
                <p style={{ fontSize: 12, color: "hsl(100,18%,55%)" }}>
                  {a.peso_atual ? a.peso_atual + " kg" : "Sem pesagem"}
                  {a.dias ? " · " + a.dias + "d" : ""}
                  {a.lote_nome ? " · " + a.lote_nome : ""}
                </p>
              </div>
            </div>
            <span className={s.cls}>{s.label}</span>
          </div>
        );
      })}

      <button onClick={() => navigate("/rebanho/novo")} style={{
        position: "fixed", bottom: 80, right: 20,
        width: 52, height: 52, borderRadius: "50%",
        background: "hsl(113,48%,60%)", color: "hsl(100,20%,11%)",
        fontSize: 24, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px hsl(113,48%,20%,0.6)",
      }}>+</button>
    </div>
  );
}
