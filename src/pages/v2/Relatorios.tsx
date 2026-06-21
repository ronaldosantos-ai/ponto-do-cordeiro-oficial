import BotaoVoltar from "@/components/v2/BotaoVoltar";
import { useNavigate } from "react-router-dom";
import { useAnimais } from "@/hooks/useAnimais";

export default function Relatorios() {
  const navigate = useNavigate();
  const { animais } = useAnimais();

  const total   = animais.length;
  const prontos = animais.filter(a => a.status === "pronto").length;
  const atencao = animais.filter(a => a.status === "atencao").length;
  const refugo  = animais.filter(a => a.status === "refugo").length;

  const gmdMedio = animais.length > 0
    ? Math.round(animais.filter(a => a.gmd).reduce((s, a) => s + (a.gmd ?? 0), 0) /
        animais.filter(a => a.gmd).length) || 0
    : 0;

  const pesoMedio = animais.length > 0
    ? Math.round(
        animais.filter(a => a.peso_atual).reduce((s, a) => s + (a.peso_atual ?? 0), 0) /
        animais.filter(a => a.peso_atual).length * 10
      ) / 10
    : 0;

  const cards = [
    {
      icon: "⚖️",
      titulo: "Ponto de equilíbrio",
      descricao: "Quanto cada animal precisa pesar para cobrir os custos e dar lucro",
      rota: "/equilibrio",
      destaque: prontos > 0 ? prontos + " prontos para venda" : null,
      cor: "hsl(113,48%,60%)",
      bg: "hsl(113,48%,10%)",
      borda: "hsl(113,48%,20%)",
    },
    {
      icon: "💰",
      titulo: "Custos",
      descricao: "Histórico de lançamentos por categoria: ração, medicamentos, frete e outros",
      rota: "/custos",
      destaque: null,
      cor: "hsl(36,75%,62%)",
      bg: "hsl(36,50%,10%)",
      borda: "hsl(36,50%,20%)",
    },
    {
      icon: "📈",
      titulo: "Desempenho do rebanho",
      descricao: "GMD médio, evolução de peso e comparativo entre lotes",
      rota: null,
      destaque: gmdMedio > 0 ? "GMD médio: " + gmdMedio + "g/dia" : null,
      cor: "hsl(95,30%,75%)",
      bg: "hsl(100,18%,15%)",
      borda: "hsl(100,18%,22%)",
      emBreve: true,
    },
    {
      icon: "🐑",
      titulo: "Resumo do rebanho",
      descricao: "Visão geral de todos os animais por status, lote e raça",
      rota: "/rebanho",
      destaque: total > 0 ? total + " animais ativos" : null,
      cor: "hsl(95,30%,85%)",
      bg: "hsl(100,18%,15%)",
      borda: "hsl(100,18%,22%)",
    },
    {
      icon: "⚠️",
      titulo: "Alertas e descarte",
      descricao: "Animais com GMD baixo, pesos discrepantes no lote e sugestões de refugo",
      rota: "/rebanho",
      destaque: (atencao + refugo) > 0 ? (atencao + refugo) + " animais precisam de atenção" : null,
      cor: atencao + refugo > 0 ? "hsl(36,75%,62%)" : "hsl(95,30%,75%)",
      bg: atencao + refugo > 0 ? "hsl(36,50%,10%)" : "hsl(100,18%,15%)",
      borda: atencao + refugo > 0 ? "hsl(36,50%,20%)" : "hsl(100,18%,22%)",
    },
    {
      icon: "📊",
      titulo: "Comparativo de mercado",
      descricao: "Rentabilidade: venda para frigorífico vs mercado informal",
      rota: null,
      destaque: null,
      cor: "hsl(95,30%,75%)",
      bg: "hsl(100,18%,15%)",
      borda: "hsl(100,18%,22%)",
      emBreve: true,
    },
  ];

  return (
    <div className="page">
      <BotaoVoltar para="/dashboard" />
      {/* Indicadores rápidos */}
      {total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <div style={{ borderRadius: 12, padding: "12px 14px",
            background: "hsl(100,18%,15%)", border: "0.5px solid hsl(100,18%,20%)" }}>
            <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
              {pesoMedio > 0 ? pesoMedio + " kg" : "—"}
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>Peso médio atual</p>
          </div>
          <div style={{ borderRadius: 12, padding: "12px 14px",
            background: gmdMedio >= 133 ? "hsl(113,48%,10%)" : "hsl(36,50%,10%)",
            border: "0.5px solid " + (gmdMedio >= 133 ? "hsl(113,48%,20%)" : "hsl(36,50%,20%)") }}>
            <p style={{ fontSize: 22, fontWeight: 600, lineHeight: 1,
              color: gmdMedio >= 133 ? "hsl(113,48%,62%)" : "hsl(36,75%,62%)" }}>
              {gmdMedio > 0 ? gmdMedio + "g" : "—"}
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>
              GMD médio {gmdMedio > 0 ? (gmdMedio >= 133 ? "✓ acima da meta" : "⚠ abaixo da meta") : ""}
            </p>
          </div>
        </div>
      )}

      {/* Cards de navegação */}
      <p className="section-label">Relatórios disponíveis</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {cards.map((card, i) => (
          <button key={i}
            onClick={() => card.rota && !card.emBreve && navigate(card.rota)}
            disabled={!card.rota || card.emBreve}
            style={{
              width: "100%",
              background: card.bg,
              border: "0.5px solid " + card.borda,
              borderRadius: 14,
              padding: "16px",
              cursor: card.rota && !card.emBreve ? "pointer" : "default",
              textAlign: "left",
              opacity: card.emBreve ? 0.55 : 1,
              transition: "opacity 0.15s",
            }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 26, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>
                {card.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,92%)" }}>
                    {card.titulo}
                  </p>
                  {card.emBreve ? (
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, flexShrink: 0,
                      background: "hsl(100,18%,22%)", color: "hsl(100,18%,50%)", fontWeight: 500 }}>
                      em breve
                    </span>
                  ) : (
                    <span style={{ color: card.cor, fontSize: 16, flexShrink: 0 }}>›</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "hsl(100,18%,48%)", lineHeight: 1.4 }}>
                  {card.descricao}
                </p>
                {card.destaque && (
                  <p style={{ fontSize: 11, fontWeight: 500, color: card.cor, marginTop: 6 }}>
                    {card.destaque}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
