import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function AnimalNovo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    brinco: "", sexo: "M", raca: "", lote_nome: "",
    data_nascimento: "", peso_inicial_kg: "",
    brinco_mae: "", brinco_pai: "", observacoes: ""
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function getOuCriarFazenda(userId: string): Promise<string | null> {
    // Buscar fazenda existente
    const { data: existente } = await supabase
      .from("fazendas")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (existente) return existente.id;

    // Criar fazenda padrão
    const { data: nova, error } = await supabase
      .from("fazendas")
      .insert({
        user_id:      userId,
        nome:         "Minha Fazenda",
        meta_gmd_g:   133,
        meta_peso_kg: 40,
      })
      .select("id")
      .single();

    if (error) { console.error("Erro ao criar fazenda:", error); return null; }
    return nova.id;
  }

  async function salvar() {
    if (!form.brinco.trim()) { setErro("Brinco é obrigatório"); return; }
    if (!user)               { setErro("Faça login para continuar"); return; }

    setSalvando(true);
    setErro(null);

    try {
      // 1. Garantir que existe uma fazenda
      const fazendaId = await getOuCriarFazenda(user.id);
      if (!fazendaId) throw new Error("Não foi possível criar a fazenda");

      // 2. Criar ou buscar lote se informado
      let lote_id: string | null = null;
      if (form.lote_nome.trim()) {
        const { data: loteExist } = await supabase
          .from("lotes")
          .select("id")
          .eq("user_id", user.id)
          .eq("nome", form.lote_nome.trim())
          .maybeSingle();

        if (loteExist) {
          lote_id = loteExist.id;
        } else {
          const { data: novoLote, error: erroLote } = await supabase
            .from("lotes")
            .insert({
              user_id:    user.id,
              fazenda_id: fazendaId,
              nome:       form.lote_nome.trim(),
            })
            .select("id")
            .single();
          if (erroLote) console.error("Erro ao criar lote:", erroLote);
          lote_id = novoLote?.id ?? null;
        }
      }

      // 3. Inserir animal
      const { data: animalCriado, error: erroAnimal } = await supabase
        .from("animais")
        .insert({
          user_id:         user.id,
          fazenda_id:      fazendaId,
          lote_id,
          brinco:          form.brinco.trim(),
          sexo:            form.sexo,
          raca:            form.raca.trim() || null,
          data_nascimento: form.data_nascimento || null,
          peso_inicial_kg: form.peso_inicial_kg ? parseFloat(form.peso_inicial_kg) : null,
          brinco_mae:      form.brinco_mae.trim() || null,
          brinco_pai:      form.brinco_pai.trim() || null,
          observacoes:     form.observacoes.trim() || null,
          status:          "ativo",
        })
        .select("id")
        .single();

      if (erroAnimal) throw erroAnimal;

      // 4. Registrar peso inicial como primeira pesagem
      if (form.peso_inicial_kg && animalCriado) {
        await supabase.from("pesagens").insert({
          animal_id:    animalCriado.id,
          user_id:      user.id,
          peso_kg:      parseFloat(form.peso_inicial_kg),
          data_pesagem: form.data_nascimento || new Date().toISOString().slice(0, 10),
        });
      }

      navigate("/rebanho");
    } catch (e: any) {
      console.error("Erro completo:", e);
      setErro(e.message ?? "Erro ao salvar animal");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page">
      {erro && (
        <div style={{
          background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          color: "hsl(0,65%,62%)", fontSize: 13
        }}>
          {erro}
        </div>
      )}

      <p className="section-label">Identificação</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <input className="field" placeholder="Brinco / chip / tatuagem *"
          value={form.brinco} onChange={e => set("brinco", e.target.value)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <select className="field" value={form.sexo} onChange={e => set("sexo", e.target.value)}>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
          <input className="field" placeholder="Raça"
            value={form.raca} onChange={e => set("raca", e.target.value)} />
        </div>
        <input className="field" placeholder="Lote (ex: Verão 2026)"
          value={form.lote_nome} onChange={e => set("lote_nome", e.target.value)} />
      </div>

      <p className="section-label">Nascimento e peso</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <input className="field" type="date"
          value={form.data_nascimento} onChange={e => set("data_nascimento", e.target.value)} />
        <input className="field" placeholder="Peso ao nascer (kg)"
          type="number" step="0.1"
          value={form.peso_inicial_kg} onChange={e => set("peso_inicial_kg", e.target.value)} />
      </div>

      <p className="section-label">Genealogia (opcional)</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <input className="field" placeholder="Brinco da mãe"
          value={form.brinco_mae} onChange={e => set("brinco_mae", e.target.value)} />
        <input className="field" placeholder="Brinco do pai"
          value={form.brinco_pai} onChange={e => set("brinco_pai", e.target.value)} />
      </div>

      <p className="section-label">Observações</p>
      <textarea className="field" rows={3} placeholder="Notas iniciais..."
        value={form.observacoes} onChange={e => set("observacoes", e.target.value)}
        style={{ marginBottom: 24, resize: "none", height: "auto", paddingTop: 12 }} />

      <button className="btn-primary" onClick={salvar} disabled={salvando}
        style={{ opacity: salvando ? 0.7 : 1 }}>
        {salvando ? "Salvando..." : "Cadastrar animal"}
      </button>
      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: 10 }}>
        Cancelar
      </button>
    </div>
  );
}
