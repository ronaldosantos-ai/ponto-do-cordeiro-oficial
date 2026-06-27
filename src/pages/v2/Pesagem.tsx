import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAnimais } from "@/hooks/useAnimais";

interface AnimalBasico {
  id: string;
  brinco: string;
  sexo: "M" | "F";
  raca: string | null;
  lote_nome: string | null;
  peso_atual: number | null;
  gmd: number | null;
}

export default function Pesagem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { animais } = useAnimais();
  const [searchParams] = useSearchParams();

  const brincoParam   = searchParams.get("brinco") || "";
  const animalIdParam = searchParams.get("animal_id") || "";
  const modoFixo      = !!animalIdParam;

  // Animal pré-selecionado (modo fixo) — buscado diretamente pelo ID
  const [animalFixo, setAnimalFixo] = useState<AnimalBasico | null>(null);
  const [loadingAnimal, setLoadingAnimal] = useState(modoFixo);

  // Modo busca
  const [brinco, setBrinco] = useState(brincoParam);

  // Campos de pesagem
  const [peso, setPeso]   = useState("");
  const [data, setData]   = useState(new Date().toISOString().slice(0, 10));
  const [obs, setObs]     = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro]   = useState<string | null>(null);

  // Busca animal pelo ID direto no Supabase (modo fixo)
  useEffect(() => {
    if (!modoFixo || !user) return;
    setLoadingAnimal(true);
    supabase
      .from("animais")
      .select("id, brinco, sexo, raca, lote_id, lotes(nome), pesagens(peso_kg, data_pesagem)")
      .eq("id", animalIdParam)
      .single()
      .then(({ data: a }) => {
        if (!a) { setLoadingAnimal(false); return; }
        const pesagens = [...(a.pesagens ?? [])].sort(
          (x: any, y: any) => new Date(x.data_pesagem).getTime() - new Date(y.data_pesagem).getTime()
        );
        const ultima = pesagens[pesagens.length - 1];
        const peso_atual = ultima?.peso_kg ?? null;
        let gmd: number | null = null;
        const primeira = pesagens[0];
        if (primeira && ultima && primeira.data_pesagem !== ultima.data_pesagem) {
          const dias = Math.round(
            (new Date(ultima.data_pesagem).getTime() - new Date(primeira.data_pesagem).getTime()) / 86400000
          );
          if (dias > 0) gmd = Math.round(((ultima.peso_kg - primeira.peso_kg) / dias) * 1000);
        }
        setAnimalFixo({
          id: a.id,
          brinco: a.brinco,
          sexo: a.sexo,
          raca: a.raca,
          lote_nome: (a as any).lotes?.nome ?? null,
          peso_atual,
          gmd,
        });
        setLoadingAnimal(false);
      });
  }, [animalIdParam, user?.id]);

  // Modo busca — encontra pelo brinco na lista já carregada
  const animalBusca = !modoFixo && brinco
    ? animais.find(a => a.brinco.toLowerCase() === brinco.toLowerCase()) ?? null
    : null;

  const animalAtivo = modoFixo ? animalFixo : animalBusca;

  async function registrar() {
    if (!peso) { setErro("Preencha o peso"); return; }
    if (!animalAtivo) { setErro("Animal não identificado. Verifique o brinco."); return; }
    if (!user) return;

    setSalvando(true);
    setErro(null);

    const { error } = await supabase.from("pesagens").insert({
      animal_id:    animalAtivo.id,
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

      {/* ── MODO FIXO: card do animal pré-selecionado ── */}
      {modoFixo && (
        <div style={{
          background: "hsl(100,18%,13%)", borderRadius: 14,
          border: "0.5px solid hsl(100,18%,20%)", padding: 16,
          marginBottom: 20
        }}>
          <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Animal selecionado
          </p>

          {loadingAnimal ? (
            <p style={{ fontSize: 13, color: "hsl(100,18%,50%)" }}>Carregando...</p>
          ) : animalFixo ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 4 }}>
                  #{animalFixo.brinco}
                </p>
                <p style={{ fontSize: 13, color: "hsl(100,18%,50%)" }}>
                  {animalFixo.sexo === "M" ? "Macho" : "Fêmea"}
                  {animalFixo.raca ? " · " + animalFixo.raca : ""}
                  {animalFixo.lote_nome ? " · " + animalFixo.lote_nome : ""}
                </p>
                {animalFixo.peso_atual != null && (
                  <p style={{ fontSize: 13, color: "hsl(113,48%,55%)", marginTop: 4 }}>
                    Última pesagem: {animalFixo.peso_atual} kg
                    {animalFixo.gmd ? " · GMD " + animalFixo.gmd + "g/d" : ""}
                  </p>
                )}
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,25%)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
              }}>
                {animalFixo.sexo === "M" ? "♂" : "♀"}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "hsl(0,65%,55%)" }}>Animal não encontrado</p>
          )}
        </div>
      )}

      {/* ── MODO BUSCA: campo de brinco ── */}
      {!modoFixo && (
        <>
          <p style={{ fontSize: 14, color: "hsl(100,18%,50%)", marginBottom: 16 }}>
            Registre o peso. O GMD é calculado automaticamente.
          </p>
          <p className="section-label">Animal</p>
          <input className="field" placeholder="Brinco / chip / tatuagem *"
            value={brinco} onChange={e => { setBrinco(e.target.value); setErro(null); }}
            style={{ marginBottom: 8 }} />

          {brinco && animalBusca && (
            <div style={{
              background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,25%)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(113,48%,65%)" }}>
                  #{animalBusca.brinco}
                </p>
                <p style={{ fontSize: 11, color: "hsl(113,48%,40%)" }}>
                  {animalBusca.sexo === "M" ? "Macho" : "Fêmea"}
                  {animalBusca.lote_nome ? " · " + animalBusca.lote_nome : ""}
                  {animalBusca.peso_atual ? " · " + animalBusca.peso_atual + " kg" : ""}
                </p>
              </div>
              <span style={{ fontSize: 20 }}>✓</span>
            </div>
          )}

          {brinco && !animalBusca && (
            <p style={{ fontSize: 12, color: "hsl(36,75%,55%)", marginBottom: 16 }}>
              Animal não encontrado
            </p>
          )}
        </>
      )}

      {/* ── ERRO ── */}
      {erro && (
        <div style={{
          background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          color: "hsl(0,65%,62%)", fontSize: 13
        }}>
          {erro}
        </div>
      )}

      {/* ── CAMPOS DE PESAGEM ── */}
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
