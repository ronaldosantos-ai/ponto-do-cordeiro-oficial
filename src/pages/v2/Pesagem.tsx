import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pesagem() {
  const navigate = useNavigate();
  const [brinco, setBrinco] = useState("");
  const [peso, setPeso] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [obs, setObs] = useState("");
  const [salvo, setSalvo] = useState(false);

  const registrar = () => {
    if (!brinco || !peso) return;
    // TODO: salvar no Supabase
    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      setBrinco(""); setPeso(""); setObs("");
    }, 2000);
  };

  return (
    <div className="page">
      <p style={{ fontSize: 14, color: "hsl(100 18% 55%)", marginBottom: 20 }}>
        Registre o peso de cada animal. O GMD será calculado automaticamente.
      </p>

      <p className="section-label">Animal</p>
      <input
        className="field"
        placeholder="Brinco / chip / tatuagem *"
        value={brinco}
        onChange={e => setBrinco(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <p className="section-label">Pesagem</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <input
          className="field"
          placeholder="Peso (kg) *"
          type="number"
          step="0.1"
          value={peso}
          onChange={e => setPeso(e.target.value)}
        />
        <input
          className="field"
          type="date"
          value={data}
          onChange={e => setData(e.target.value)}
        />
      </div>

      <p className="section-label">Observações</p>
      <textarea
        className="field"
        rows={3}
        placeholder="Ex: animal com diarreia, separado do lote..."
        value={obs}
        onChange={e => setObs(e.target.value)}
        style={{ marginBottom: 24, resize: "none" }}
      />

      {salvo ? (
        <div style={{
          background: "hsl(113 48% 10%)",
          border: "0.5px solid hsl(113 48% 30%)",
          borderRadius: 12,
          padding: "16px",
          textAlign: "center",
          color: "hsl(113 48% 60%)",
          fontSize: 15,
          fontWeight: 500,
        }}>
          ✓ Pesagem registrada
        </div>
      ) : (
        <button className="btn-primary" onClick={registrar}>
          Registrar pesagem
        </button>
      )}

      <button
        className="btn-secondary"
        style={{ marginTop: 10 }}
        onClick={() => navigate("/rebanho")}
      >
        Ver rebanho
      </button>
    </div>
  );
}
