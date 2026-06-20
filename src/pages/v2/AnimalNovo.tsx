import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AnimalNovo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brinco: "", sexo: "M", raca: "", lote: "",
    nascimento: "", peso_inicial: "", mae: "", pai: "", obs: ""
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const salvar = () => {
    // TODO: salvar no Supabase
    alert("Animal cadastrado! (mock)");
    navigate("/rebanho");
  };

  return (
    <div className="page">
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

        <input className="field" placeholder="Lote"
          value={form.lote} onChange={e => set("lote", e.target.value)} />
      </div>

      <p className="section-label">Nascimento e peso</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <input className="field" type="date"
          value={form.nascimento} onChange={e => set("nascimento", e.target.value)} />
        <input className="field" placeholder="Peso ao nascer (kg)"
          type="number" value={form.peso_inicial} onChange={e => set("peso_inicial", e.target.value)} />
      </div>

      <p className="section-label">Genealogia (opcional)</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <input className="field" placeholder="Brinco da mãe"
          value={form.mae} onChange={e => set("mae", e.target.value)} />
        <input className="field" placeholder="Brinco do pai"
          value={form.pai} onChange={e => set("pai", e.target.value)} />
      </div>

      <p className="section-label">Observações</p>
      <textarea className="field" rows={3} placeholder="Notas iniciais..."
        value={form.obs} onChange={e => set("obs", e.target.value)}
        style={{ marginBottom: 24, resize: "none" }} />

      <button className="btn-primary" onClick={salvar}>Cadastrar animal</button>
      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: 10 }}>
        Cancelar
      </button>
    </div>
  );
}
