export default function Relatorios() {
  const cards = [
    { titulo: "GMD médio do rebanho",   valor: "148g/dia",  ok: true  },
    { titulo: "Peso médio atual",        valor: "33,4 kg",   ok: true  },
    { titulo: "Animais prontos p/ venda",valor: "62",        ok: true  },
    { titulo: "Custo médio por cabeça",  valor: "R$ 312",    ok: null  },
    { titulo: "Margem média por cabeça", valor: "R$ 58",     ok: true  },
    { titulo: "Mortalidade no período",  valor: "1,1%",      ok: true  },
  ];

  return (
    <div className="page">
      <p style={{ fontSize: 14, color: "hsl(100 18% 55%)", marginBottom: 20 }}>
        Resumo do rebanho — últimos 90 dias
      </p>

      <p className="section-label">Indicadores</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        {cards.map((c, i) => (
          <div key={i} className={`stat-card ${c.ok === true ? "stat-card-good" : ""}`}>
            <p style={{
              fontSize: 22, fontWeight: 500, lineHeight: 1,
              color: c.ok === true ? "hsl(113 48% 60%)" : "hsl(95 30% 92%)"
            }}>
              {c.valor}
            </p>
            <p style={{
              fontSize: 11, marginTop: 4,
              color: c.ok === true ? "hsl(113 48% 35%)" : "hsl(100 18% 55%)"
            }}>
              {c.titulo}
            </p>
          </div>
        ))}
      </div>

      <p className="section-label">Em breve</p>
      {["Gráfico de evolução de peso por lote",
        "Comparativo de lucratividade por período",
        "Relatório de causas de descarte",
        "Exportar para PDF"].map((item, i) => (
        <div key={i} className="animal-row" style={{ cursor: "default", opacity: 0.5 }}>
          <p style={{ fontSize: 14, color: "hsl(95 30% 85%)" }}>{item}</p>
          <span style={{ fontSize: 11, color: "hsl(100 18% 45%)" }}>em breve</span>
        </div>
      ))}
    </div>
  );
}
