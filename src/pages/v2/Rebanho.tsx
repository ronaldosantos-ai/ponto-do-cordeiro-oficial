import { useState } from "react";
import { useNavigate } from "react-router-dom";

const animais = [
  { id: "A-0042", sexo: "M", peso: 34.2, dias: 94,  lote: "Verão",  status: "atencao" },
  { id: "A-0055", sexo: "M", peso: 41.0, dias: 78,  lote: "Outono", status: "pronto"  },
  { id: "B-0017", sexo: "F", peso: 28.1, dias: 112, lote: "Verão",  status: "refugo"  },
  { id: "A-0031", sexo: "M", peso: 38.5, dias: 65,  lote: "Outono", status: "pronto"  },
  { id: "B-0023", sexo: "F", peso: 31.0, dias: 88,  lote: "Verão",  status: "atencao" },
  { id: "A-0061", sexo: "M", peso: 22.4, dias: 45,  lote: "Inverno",status: "atencao" },
  { id: "B-0008", sexo: "F", peso: 40.2, dias: 102, lote: "Outono", status: "pronto"  },
];

const statusConfig = {
  pronto:  { label: "Pronto",    cls: "badge-pronto" },
  atencao: { label: "Atenção",   cls: "badge-atencao" },
  refugo:  { label: "Refugo",    cls: "badge-refugo" },
};

const filtros = ["Todos", "Prontos", "Atenção", "Refugo"];
const filtroMap: Record<string, string> = {
  "Prontos": "pronto", "Atenção": "atencao", "Refugo": "refugo"
};

export default function Rebanho() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const lista = animais.filter(a => {
    const matchFiltro = filtro === "Todos" || a.status === filtroMap[filtro];
    const matchBusca = a.id.toLowerCase().includes(busca.toLowerCase()) ||
      a.lote.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="page">
      {/* Busca */}
      <input
        className="field"
        placeholder="Buscar por brinco ou lote..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {filtros.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              whiteSpace: "nowrap",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              border: "0.5px solid",
              cursor: "pointer",
              background: filtro === f ? "hsl(113 48% 60%)" : "hsl(100 18% 17%)",
              color: filtro === f ? "hsl(100 20% 11%)" : "hsl(95 30% 75%)",
              borderColor: filtro === f ? "hsl(113 48% 60%)" : "hsl(100 18% 25%)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Contagem */}
      <p style={{ fontSize: 12, color: "hsl(100 18% 45%)", marginBottom: 12 }}>
        {lista.length} animal{lista.length !== 1 ? "is" : ""}
      </p>

      {/* Lista */}
      {lista.map(a => {
        const s = statusConfig[a.status as keyof typeof statusConfig];
        return (
          <div
            key={a.id}
            className="animal-row"
            onClick={() => navigate(`/rebanho/${a.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "hsl(100 18% 22%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0
              }}>
                {a.sexo === "M" ? "♂" : "♀"}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95 30% 92%)", marginBottom: 2 }}>
                  #{a.id}
                </p>
                <p style={{ fontSize: 12, color: "hsl(100 18% 55%)" }}>
                  {a.peso} kg · {a.dias} dias · Lote {a.lote}
                </p>
              </div>
            </div>
            <span className={s.cls}>{s.label}</span>
          </div>
        );
      })}

      {/* FAB novo animal */}
      <button
        onClick={() => navigate("/rebanho/novo")}
        style={{
          position: "fixed",
          bottom: 80,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "hsl(113 48% 60%)",
          color: "hsl(100 20% 11%)",
          fontSize: 24,
          fontWeight: 300,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px hsl(113 48% 20% / 0.6)",
        }}
      >
        +
      </button>
    </div>
  );
}
