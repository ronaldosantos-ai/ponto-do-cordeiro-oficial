import BotaoVoltar from "@/components/v2/BotaoVoltar";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAnimais } from "@/hooks/useAnimais";

export default function Pesagem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { animais } = useAnimais();
  const [searchParams] = useSearchParams();

  const brincoParam   = searchParams.get("brinco") || "";
  const animalIdParam = searchParams.get("animal_id") || "";

  // Modo: "fixo" quando veio do detalhe do animal, "busca" quando veio direto
  const modoFixo = !!animalIdParam;

  const [brinco, setBrinco] = useState(brincoParam);
  const [peso, setPeso]     = useState("");
  const [data, setData]     = useState(new Date().toISOString().slice(0, 10));
  const [obs, setObs]       = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo]   = useState(false);
  const [erro, setErro]     = useState<string | null>(null);

  const animalEncontrado = animais.find(
    a => a.brinco.toLowerCase() === brinco.toLowerCase()
  );

  async function registrar() {
    if (!peso) { setErro("Preencha o peso"); return; }
    if (!animalEncontrado) { setErro("Animal não encontrado. Verifique o brinco."); return; }
    if (!user) return;

    setSalvando(true);
    setErro(null);

    const { error } = await supabase.from("pesagens").insert({
      animal_id:    animalEncontrado.id,
      user_id:      user.id,
      peso_kg:      parseFloat(peso),
      data_pesagem: data,
      observacoes:  obs.trim() || null,
    });

    if (error) {
      setErro(error.message);
    } else {
      setSalvo(true);
      setTimeout(() => {
        setSalvo(false);
        if (modoFixo) {
          navigate("/rebanho/" + animalIdParam);
        } else {
          setBrinco(""); setPeso(""); setObs("");
          setData(new Date().toISOString().slice(0, 10));
        }
      }, 2000);
    }
    setSalvando(false);
  }

  return (
    <div className="page">
      <BotaoVoltar para={modoFixo ? "/rebanho/" + animalIdParam : "/rebanho"} />

      {/* ── MODO FIXO: veio do detalhe do animal ── */}
      {modoFixo && animalEncontrado && (
        <>
          {/* Card do animal — somente leitura */}
          <div style={{
            background: "hsl(100,18%,13%)", borderRadius: 14,
            border: "0.5px solid hsl(100,18%,20%)", padding: "16px",
            marginBottom: 20
          }}>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Animal selecionado
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 4 }}>
                  #{animalEncontrado.brinco}
                </p>
                <p style={{ fontSize: 13, color: "hsl(100,18%,50%)" }}>
                  {animalEncontrado.sexo === "M" ? "Macho" : "Fêmea"}
                  {animalEncontrado.raca ? " · " + animalEncontrado.raca : ""}
                  {animalEncontrado.lote_nome ? " · " + animalEncontrado.lote_nome : ""}
                </p>
                {animalEncontrado.peso_atual && (
                  <p style={{ fontSize: 13, color: "hsl(113,48%,55%)", marginTop: 4 }}>
                    Última pesagem: {animalEncontrado.peso_atual} kg
                    {animalEncontrado.gmd ? " · GMD " + animalEncontrado.gmd + "g/d" : ""}
                  </p>
                )}
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,25%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22
              }}>
                {animalEncontrado.sexo === "M" ? "♂" : "♀"}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODO BUSCA: veio direto, sem animal pré-selecionado ── */}
      {!modoFixo && (
        <>
          <p style={{ fontSize: 14, color: "hsl(100,18%,50%)", marginBottom: 16 }}>
            Registre o peso. O GMD é calculado automaticamente.
          </p>

          <p className="section-label">Animal</p>
          <input className="field" placeholder="Brinco / chip / tatuagem *"
            value={brinco} onChange={e => { setBrinco(e.target.value); setErro(null); }}
            style={{ marginBottom: 8 }} />

          {brinco && animalEncontrado && (
            <div style={{
              background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,25%)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(113,48%,65%)" }}>
                  #{animalEncontrado.brinco}
                </p>
                <p style={{ fontSize: 11, color: "hsl(113,48%,40%)" }}>
                  {animalEncontrado.sexo === "M" ? "Macho" : "Fêmea"}
                  {animalEncontrado.lote_nome ? " · " + animalEncontrado.lote_nome : ""}
                  {animalEncontrado.peso_atual ? " · " + animalEncontrado.peso_atual + " kg atual" : ""}
                </p>
              </div>
              <span style={{ fontSize: 20 }}>✓</span>
            </div>
          )}

          {brinco && !animalEncontrado && (
            <p style={{ fontSize: 12, color: "hsl(36,75%,55%)", marginBottom: 16 }}>
              Animal não encontrado
            </p>
          )}
        </>
      )}

      {/* ── CAMPOS DE PESAGEM ── */}
      {erro && (
        <div style={{
          background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          color: "hsl(0,65%,62%)", fontSize: 13
        }}>
          {erro}
        </div>
      )}

      <p className="section-label">Pesagem</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <input className="field" placeholder="Peso (kg) *"
          type="number" step="0.1"
          value={peso} onChange={e => setPeso(e.target.value)} />
        <input className="field" type="date"
          value={data} onChange={e => setData(e.target.value)} />
      </div>

      <p className="section-label">Observações</p>
      <textarea className="field" rows={3}
        placeholder="Ex: animal com diarreia, separado do lote..."
        value={obs} onChange={e => setObs(e.target.value)}
        style={{ marginBottom: 24, resize: "none", height: "auto", paddingTop: 12 }} />

      {salvo ? (
        <div style={{
          background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,30%)",
          borderRadius: 12, padding: 16, textAlign: "center",
          color: "hsl(113,48%,60%)", fontSize: 15, fontWeight: 500
        }}>
          ✓ Pesagem registrada
        </div>
      ) : (
        <button className="btn-primary" onClick={registrar} disabled={salvando}
          style={{ opacity: salvando ? 0.7 : 1 }}>
          {salvando ? "Salvando..." : "Registrar pesagem"}
        </button>
      )}

      {/* Botão registrar novo animal */}
      <button
        onClick={() => navigate("/rebanho/novo")}
        style={{
          marginTop: 12, width: "100%", padding: "12px 16px",
          background: "transparent", border: "0.5px solid hsl(100,18%,25%)",
          borderRadius: 12, color: "hsl(100,18%,55%)", fontSize: 14,
          fontWeight: 500, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 8
        }}>
        + Registrar novo animal
      </button>
    </div>
  );
}
