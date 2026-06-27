import BotaoVoltar from "@/components/v2/BotaoVoltar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFazenda } from "@/hooks/useFazenda";

const CATEGORIAS: Record<string, { label: string; icon: string }> = {
  concentrado: { label: "Concentrado", icon: "🌾" },
  volumoso:    { label: "Volumoso",    icon: "🌿" },
  medicamento: { label: "Medicamento", icon: "💊" },
  frete:       { label: "Frete",       icon: "🚛" },
  mao_de_obra: { label: "Mão de obra", icon: "👷" },
  outros:      { label: "Outros",      icon: "📦" },
};

interface Custo {
  id: string;
  categoria: string;
  valor: number;
  data_custo: string;
  descricao: string | null;
  animais: { brinco: string } | null;
  lotes:   { nome: string }   | null;
}

export default function Custos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fazenda } = useFazenda();
  const [custos, setCustos]   = useState<Custo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro]   = useState("todos");

  useEffect(() => {
    if (!user || !fazenda) return;
    carregar();
  }, [user?.id, fazenda?.id]);

  async function carregar() {
    setLoading(true);
    const { data } = await supabase
      .from("custos")
      .select("*, animais(brinco), lotes(nome)")
      .eq("user_id", user!.id)
      .order("data_custo", { ascending: false })
      .limit(100);
    setCustos((data ?? []) as Custo[]);
    setLoading(false);
  }

  const lista = filtro === "todos"
    ? custos
    : custos.filter(c => c.categoria === filtro);

  const total = lista.reduce((s, c) => s + Number(c.valor), 0);

  // Totais por categoria
  const porCategoria = Object.entries(CATEGORIAS).map(([k, v]) => ({
    ...v,
    valor: custos.filter(c => c.categoria === k).reduce((s, c) => s + Number(c.valor), 0),
    key: k,
  })).filter(c => c.valor > 0).sort((a, b) => b.valor - a.valor);

  return (
    <div className="page">
      <BotaoVoltar para="/relatorios" />
      {/* Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div style={{ borderRadius: 12, padding: 14, background: "hsl(100,18%,15%)",
          border: "0.5px solid hsl(100,18%,20%)" }}>
          <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(0,65%,62%)", lineHeight: 1 }}>
            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>Total de custos</p>
        </div>
        <div style={{ borderRadius: 12, padding: 14, background: "hsl(100,18%,15%)",
          border: "0.5px solid hsl(100,18%,20%)" }}>
          <p style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,85%)", lineHeight: 1 }}>
            {custos.length}
          </p>
          <p style={{ fontSize: 11, color: "hsl(100,18%,50%)", marginTop: 4 }}>Lançamentos</p>
        </div>
      </div>

      {/* Breakdown por categoria */}
      {porCategoria.length > 0 && (
        <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
          border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "14px 16px", borderBottom: "0.5px solid hsl(100,18%,18%)" }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,88%)" }}>Por categoria</p>
          </div>
          {porCategoria.map((c, i) => (
            <div key={c.key} style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "11px 16px",
              borderBottom: i < porCategoria.length - 1 ? "0.5px solid hsl(100,18%,16%)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <p style={{ fontSize: 13, color: "hsl(95,30%,82%)" }}>{c.label}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                  R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p style={{ fontSize: 10, color: "hsl(100,18%,40%)" }}>
                  {total > 0 ? Math.round(c.valor / total * 100) + "%" : "0%"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
        {[{ valor: "todos", label: "Todos" }, ...Object.entries(CATEGORIAS).map(([k, v]) => ({ valor: k, label: v.label }))].map(f => (
          <button key={f.valor} onClick={() => setFiltro(f.valor)} style={{
            whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 8,
            fontSize: 12, fontWeight: 500, border: "0.5px solid", cursor: "pointer",
            background: filtro === f.valor ? "hsl(113,48%,60%)" : "hsl(100,18%,17%)",
            color:      filtro === f.valor ? "hsl(100,20%,11%)" : "hsl(95,30%,75%)",
            borderColor:filtro === f.valor ? "hsl(113,48%,60%)" : "hsl(100,18%,25%)",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Lista */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "hsl(100,18%,40%)", fontSize: 13 }}>
          Carregando...
        </div>
      )}

      {!loading && lista.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>💰</p>
          <p style={{ fontSize: 15, fontWeight: 500, color: "hsl(95,30%,80%)", marginBottom: 6 }}>
            Nenhum custo registrado
          </p>
          <p style={{ fontSize: 13, color: "hsl(100,18%,45%)", marginBottom: 20 }}>
            Registre concentrado, medicamentos e outros gastos
          </p>
          <button className="btn-primary" onClick={() => navigate("/custos/novo")}
            style={{ maxWidth: 220, margin: "0 auto" }}>
            + Registrar custo
          </button>
        </div>
      )}

      {!loading && lista.map((c, i) => {
        const cat = CATEGORIAS[c.categoria] ?? { label: c.categoria, icon: "📦" };
        return (
          <div key={c.id} style={{ background: "hsl(100,18%,13%)", borderRadius: 12,
            border: "0.5px solid hsl(100,18%,18%)", padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8,
                  background: "hsl(100,18%,20%)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {cat.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95,30%,90%)" }}>
                    {cat.label}
                  </p>
                  <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginTop: 2 }}>
                    {new Date(c.data_custo).toLocaleDateString("pt-BR")}
                    {c.animais ? " · #" + c.animais.brinco : ""}
                    {c.lotes   ? " · Lote " + c.lotes.nome  : ""}
                  </p>
                  {c.descricao && (
                    <p style={{ fontSize: 11, color: "hsl(100,18%,40%)", marginTop: 2 }}>
                      {c.descricao}
                    </p>
                  )}
                </div>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(0,65%,62%)", flexShrink: 0, marginLeft: 8 }}>
                R$ {Number(c.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        );
      })}

      {/* FAB */}
      <button onClick={() => navigate("/custos/novo")} style={{
        position: "fixed", bottom: 80, right: 20,
        width: 52, height: 52, borderRadius: "50%",
        background: "hsl(113,48%,60%)", color: "hsl(100,20%,11%)",
        fontSize: 24, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px hsl(113,48%,20%,0.6)" }}>
        +
      </button>
    </div>
  );
}
