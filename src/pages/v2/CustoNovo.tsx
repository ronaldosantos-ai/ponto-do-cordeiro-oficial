import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAnimais } from "@/hooks/useAnimais";
import { useFazenda } from "@/hooks/useFazenda";

const CATEGORIAS = [
  { valor: "concentrado",  label: "Concentrado",   icon: "🌾" },
  { valor: "volumoso",     label: "Volumoso",       icon: "🌿" },
  { valor: "medicamento",  label: "Medicamento",    icon: "💊" },
  { valor: "frete",        label: "Frete",          icon: "🚛" },
  { valor: "mao_de_obra",  label: "Mão de obra",    icon: "👷" },
  { valor: "outros",       label: "Outros",         icon: "📦" },
];

export default function CustoNovo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fazenda } = useFazenda();
  const { animais } = useAnimais();

  const [form, setForm] = useState({
    categoria:  "concentrado",
    valor:      "",
    data_custo: new Date().toISOString().slice(0, 10),
    descricao:  "",
    animal_id:  "",   // opcional — custo por animal específico
    lote_id:    "",   // opcional — custo por lote
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro]         = useState<string | null>(null);
  const [salvo, setSalvo]       = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Lotes únicos dos animais
  const lotes = Array.from(
    new Map(
      animais
        .filter(a => a.lote_id && a.lote_nome)
        .map(a => [a.lote_id, { id: a.lote_id!, nome: a.lote_nome! }])
    ).values()
  );

  async function salvar() {
    if (!form.valor || parseFloat(form.valor) <= 0) {
      setErro("Informe um valor válido");
      return;
    }
    if (!user || !fazenda) { setErro("Usuário não autenticado"); return; }

    setSalvando(true);
    setErro(null);

    const { error } = await supabase.from("custos").insert({
      user_id:    user.id,
      fazenda_id: fazenda.id,
      categoria:  form.categoria,
      valor:      parseFloat(form.valor),
      data_custo: form.data_custo,
      descricao:  form.descricao.trim() || null,
      animal_id:  form.animal_id || null,
      lote_id:    form.lote_id   || null,
    });

    if (error) {
      setErro(error.message);
    } else {
      setSalvo(true);
      setTimeout(() => {
        setSalvo(false);
        setForm(f => ({ ...f, valor: "", descricao: "", animal_id: "", lote_id: "" }));
      }, 2000);
    }
    setSalvando(false);
  }

  return (
    <div className="page">
      {erro && (
        <div style={{ background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          color: "hsl(0,65%,62%)", fontSize: 13 }}>
          {erro}
        </div>
      )}

      {/* Categoria */}
      <p className="section-label">Categoria</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {CATEGORIAS.map(c => (
          <button key={c.valor} onClick={() => set("categoria", c.valor)} style={{
            padding: "12px 10px",
            borderRadius: 10,
            border: "0.5px solid",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: form.categoria === c.valor ? 500 : 400,
            background: form.categoria === c.valor ? "hsl(113,48%,12%)" : "hsl(100,18%,15%)",
            color:      form.categoria === c.valor ? "hsl(113,48%,65%)" : "hsl(95,30%,75%)",
            borderColor:form.categoria === c.valor ? "hsl(113,48%,35%)" : "hsl(100,18%,22%)",
          }}>
            <span style={{ fontSize: 18 }}>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Valor e data */}
      <p className="section-label">Valor e data</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, color: "hsl(100,18%,50%)", pointerEvents: "none" }}>R$</span>
          <input className="field" type="number" step="0.01" placeholder="0,00"
            value={form.valor} onChange={e => set("valor", e.target.value)}
            style={{ paddingLeft: 36 }} />
        </div>
        <input className="field" type="date"
          value={form.data_custo} onChange={e => set("data_custo", e.target.value)} />
      </div>

      {/* Vincular a animal ou lote (opcional) */}
      <p className="section-label">Vincular a (opcional)</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <select className="field" value={form.animal_id}
          onChange={e => { set("animal_id", e.target.value); if (e.target.value) set("lote_id", ""); }}>
          <option value="">Nenhum animal específico</option>
          {animais.map(a => (
            <option key={a.id} value={a.id}>#{a.brinco} — {a.sexo === "M" ? "Macho" : "Fêmea"}</option>
          ))}
        </select>

        {!form.animal_id && (
          <select className="field" value={form.lote_id}
            onChange={e => set("lote_id", e.target.value)}>
            <option value="">Nenhum lote específico</option>
            {lotes.map(l => (
              <option key={l.id} value={l.id}>Lote {l.nome}</option>
            ))}
          </select>
        )}
      </div>

      {/* Descrição */}
      <p className="section-label">Descrição (opcional)</p>
      <textarea className="field" rows={3}
        placeholder="Ex: ração 20kg saco, aplicação ivermectina..."
        value={form.descricao} onChange={e => set("descricao", e.target.value)}
        style={{ marginBottom: 24, resize: "none", height: "auto", paddingTop: 12 }} />

      {salvo ? (
        <div style={{ background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,30%)",
          borderRadius: 12, padding: 16, textAlign: "center",
          color: "hsl(113,48%,60%)", fontSize: 15, fontWeight: 500 }}>
          ✓ Custo registrado
        </div>
      ) : (
        <button className="btn-primary" onClick={salvar} disabled={salvando}
          style={{ opacity: salvando ? 0.7 : 1 }}>
          {salvando ? "Salvando..." : "Registrar custo"}
        </button>
      )}

      <button className="btn-secondary" onClick={() => navigate("/custos")} style={{ marginTop: 10 }}>
        Ver histórico
      </button>
    </div>
  );
}
