import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimais } from "@/hooks/useAnimais";
import { useFazenda } from "@/hooks/useFazenda";
import BotaoVoltar from "@/components/v2/BotaoVoltar";

export default function ComparativoMercado() {
  const navigate  = useNavigate();
  const { animais } = useAnimais();
  const { fazenda } = useFazenda();

  // Parâmetros editáveis
  const [precoFrigorifico, setPrecoFrigorifico] = useState("22.00");
  const [rendimentoCarcaca, setRendimentoCarcaca] = useState("48");
  const [precoInformal, setPrecoInformal] = useState(
    fazenda?.preco_venda?.toString() ?? "10.50"
  );
  const [filtro, setFiltro] = useState<"todos"|"frigorifico"|"informal">("todos");

  const pFrig    = parseFloat(precoFrigorifico)  || 0;
  const rendimento = parseFloat(rendimentoCarcaca) / 100 || 0.48;
  const pInformal  = parseFloat(precoInformal)    || 0;

  // Calcular por animal
  const resultados = animais
    .filter(a => a.peso_atual !== null)
    .map(a => {
      const peso          = a.peso_atual!;
      const pesoCarcaca   = Math.round(peso * rendimento * 10) / 10;
      const receitaFrig   = Math.round(pesoCarcaca * pFrig * 100) / 100;
      const receitaInform = Math.round(peso * pInformal * 100) / 100;
      const melhor        = receitaFrig >= receitaInform ? "frigorifico" : "informal";
      const diferenca     = Math.round(Math.abs(receitaFrig - receitaInform) * 100) / 100;

      return {
        ...a,
        pesoCarcaca,
        receitaFrig,
        receitaInform,
        melhor,
        diferenca,
      };
    })
    .sort((a, b) => b.diferenca - a.diferenca);

  const filtrados = filtro === "todos"
    ? resultados
    : resultados.filter(r => r.melhor === filtro);

  // Totais
  const totalFrig    = resultados.reduce((s, r) => s + r.receitaFrig, 0);
  const totalInform  = resultados.reduce((s, r) => s + r.receitaInform, 0);
  const melhorTotal  = totalFrig >= totalInform ? "frigorifico" : "informal";
  const diffTotal    = Math.abs(totalFrig - totalInform);
  const qtdFrig      = resultados.filter(r => r.melhor === "frigorifico").length;
  const qtdInformal  = resultados.filter(r => r.melhor === "informal").length;

  return (
    <div className="page">
      <BotaoVoltar para="/relatorios" />

      <h1 style={{ fontSize: 20, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 4 }}>
        Comparativo de mercado
      </h1>
      <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", marginBottom: 20 }}>
        Frigorífico (carcaça) vs mercado informal (vivo)
      </p>

      {/* Parâmetros */}
      <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
        border: "0.5px solid hsl(100,18%,18%)", padding: 16, marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)", marginBottom: 14 }}>
          Parâmetros de venda
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>
              Frigorífico (R$/kg carcaça)
            </p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", fontSize: 11,
                color: "hsl(100,18%,50%)", pointerEvents: "none" }}>R$</span>
              <input className="field" type="number" step="0.01"
                value={precoFrigorifico}
                onChange={e => setPrecoFrigorifico(e.target.value)}
                style={{ paddingLeft: 28, fontSize: 13 }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>
              Rendimento carcaça (%)
            </p>
            <div style={{ position: "relative" }}>
              <input className="field" type="number" step="1" min="30" max="70"
                value={rendimentoCarcaca}
                onChange={e => setRendimentoCarcaca(e.target.value)}
                style={{ paddingRight: 28, fontSize: 13 }} />
              <span style={{ position: "absolute", right: 10, top: "50%",
                transform: "translateY(-50%)", fontSize: 11,
                color: "hsl(100,18%,50%)", pointerEvents: "none" }}>%</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>
              Informal (R$/kg vivo)
            </p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", fontSize: 11,
                color: "hsl(100,18%,50%)", pointerEvents: "none" }}>R$</span>
              <input className="field" type="number" step="0.01"
                value={precoInformal}
                onChange={e => setPrecoInformal(e.target.value)}
                style={{ paddingLeft: 28, fontSize: 13 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Resultado geral */}
      {resultados.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            <div style={{ borderRadius: 12, padding: 14,
              background: melhorTotal === "frigorifico" ? "hsl(113,48%,10%)" : "hsl(100,18%,15%)",
              border: "0.5px solid " + (melhorTotal === "frigorifico" ? "hsl(113,48%,22%)" : "hsl(100,18%,20%)") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>🏭</span>
                <p style={{ fontSize: 12, fontWeight: 500,
                  color: melhorTotal === "frigorifico" ? "hsl(113,48%,62%)" : "hsl(95,30%,75%)" }}>
                  Frigorífico
                </p>
                {melhorTotal === "frigorifico" && (
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4,
                    background: "hsl(113,48%,18%)", color: "hsl(113,48%,62%)" }}>
                    Melhor opção
                  </span>
                )}
              </div>
              <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
                R$ {totalFrig.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginTop: 4 }}>
                {qtdFrig} animal{qtdFrig !== 1 ? "is" : ""} com melhor retorno
              </p>
            </div>

            <div style={{ borderRadius: 12, padding: 14,
              background: melhorTotal === "informal" ? "hsl(113,48%,10%)" : "hsl(100,18%,15%)",
              border: "0.5px solid " + (melhorTotal === "informal" ? "hsl(113,48%,22%)" : "hsl(100,18%,20%)") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>🤝</span>
                <p style={{ fontSize: 12, fontWeight: 500,
                  color: melhorTotal === "informal" ? "hsl(113,48%,62%)" : "hsl(95,30%,75%)" }}>
                  Informal/feira
                </p>
                {melhorTotal === "informal" && (
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4,
                    background: "hsl(113,48%,18%)", color: "hsl(113,48%,62%)" }}>
                    Melhor opção
                  </span>
                )}
              </div>
              <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)", lineHeight: 1 }}>
                R$ {totalInform.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginTop: 4 }}>
                {qtdInformal} animal{qtdInformal !== 1 ? "is" : ""} com melhor retorno
              </p>
            </div>
          </div>

          {/* Diferença total */}
          <div style={{ borderRadius: 12, padding: "12px 16px", marginBottom: 16,
            background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,20%)" }}>
            <p style={{ fontSize: 12, color: "hsl(100,18%,45%)", marginBottom: 4 }}>
              Vantagem do {melhorTotal === "frigorifico" ? "frigorífico" : "mercado informal"}
            </p>
            <p style={{ fontSize: 20, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
              + R$ {diffTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} no total
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,40%)", marginTop: 4 }}>
              Considerando {resultados.length} animais com pesagem registrada
            </p>
          </div>
        </>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[
          { valor: "todos",        label: "Todos"        },
          { valor: "frigorifico",  label: "🏭 Frigorífico" },
          { valor: "informal",     label: "🤝 Informal"   },
        ].map(f => (
          <button key={f.valor}
            onClick={() => setFiltro(f.valor as any)} style={{
            padding: "6px 12px", borderRadius: 8,
            fontSize: 12, fontWeight: 500, border: "0.5px solid", cursor: "pointer",
            background: filtro === f.valor ? "hsl(113,48%,60%)" : "hsl(100,18%,17%)",
            color:      filtro === f.valor ? "hsl(100,20%,11%)" : "hsl(95,30%,75%)",
            borderColor:filtro === f.valor ? "hsl(113,48%,60%)" : "hsl(100,18%,25%)",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Sem animais */}
      {animais.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 13, color: "hsl(100,18%,40%)", marginBottom: 16 }}>
            Cadastre animais e registre pesagens para ver o comparativo
          </p>
          <button className="btn-primary" onClick={() => navigate("/rebanho/novo")}
            style={{ maxWidth: 220, margin: "0 auto" }}>
            + Cadastrar animal
          </button>
        </div>
      )}

      {resultados.length === 0 && animais.length > 0 && (
        <div style={{ textAlign: "center", padding: 32 }}>
          <p style={{ fontSize: 13, color: "hsl(100,18%,40%)" }}>
            Registre pesagens para calcular o comparativo
          </p>
        </div>
      )}

      {/* Lista por animal */}
      <p style={{ fontSize: 11, fontWeight: 500, color: "hsl(113,48%,55%)",
        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Por animal
      </p>

      {filtrados.map((r, i) => (
        <div key={r.id} onClick={() => navigate("/rebanho/" + r.id)}
          style={{ background: "hsl(100,18%,13%)", borderRadius: 12,
            border: "0.5px solid hsl(100,18%,18%)", marginBottom: 8,
            overflow: "hidden", cursor: "pointer" }}>

          {/* Cabeçalho */}
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "12px 14px",
            borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8,
                background: "hsl(100,18%,20%)", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                {r.sexo === "M" ? "♂" : "♀"}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                  #{r.brinco}
                </p>
                <p style={{ fontSize: 11, color: "hsl(100,18%,50%)" }}>
                  {r.peso_atual} kg vivo · {r.pesoCarcaca} kg carcaça
                </p>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 8px",
              borderRadius: 5, flexShrink: 0,
              background: r.melhor === "frigorifico" ? "hsl(113,48%,12%)" : "hsl(36,50%,12%)",
              color: r.melhor === "frigorifico" ? "hsl(113,48%,62%)" : "hsl(36,75%,62%)" }}>
              {r.melhor === "frigorifico" ? "🏭 Frigorífico" : "🤝 Informal"}
            </span>
          </div>

          {/* Valores lado a lado */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            padding: "10px 14px", gap: 8 }}>
            <div>
              <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginBottom: 2 }}>Frigorífico</p>
              <p style={{ fontSize: 14, fontWeight: 600,
                color: r.melhor === "frigorifico" ? "hsl(113,48%,62%)" : "hsl(95,30%,75%)" }}>
                R$ {r.receitaFrig.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginBottom: 2 }}>Informal</p>
              <p style={{ fontSize: 14, fontWeight: 600,
                color: r.melhor === "informal" ? "hsl(113,48%,62%)" : "hsl(95,30%,75%)" }}>
                R$ {r.receitaInform.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "hsl(100,18%,40%)", marginBottom: 2 }}>Diferença</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113,48%,62%)" }}>
                + R$ {r.diferenca.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
