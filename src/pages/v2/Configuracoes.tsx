import BotaoVoltar from "@/components/v2/BotaoVoltar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFazenda } from "@/hooks/useFazenda";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { fazenda, recarregar } = useFazenda();

  const [form, setForm] = useState({
    nome:         "",
    cidade:       "",
    estado:       "",
    meta_gmd_g:   "133",
    meta_peso_kg: "40",
    preco_venda:  "",
    custo_diario: "",
  });
  const [salvando, setSalvando]   = useState(false);
  const [salvo, setSalvo]         = useState(false);
  const [erro, setErro]           = useState<string | null>(null);
  const [secao, setSecao]         = useState<string | null>(null);

  // Nome do usuário
  const nomeUsuario = user?.user_metadata?.full_name ?? user?.email ?? "";

  useEffect(() => {
    if (!fazenda) return;
    setForm({
      nome:         fazenda.nome ?? "",
      cidade:       (fazenda as any).cidade ?? "",
      estado:       (fazenda as any).estado ?? "",
      meta_gmd_g:   String(fazenda.meta_gmd_g ?? 133),
      meta_peso_kg: String(fazenda.meta_peso_kg ?? 40),
      preco_venda:  fazenda.preco_venda ? String(fazenda.preco_venda) : "",
      custo_diario: fazenda.custo_diario ? String(fazenda.custo_diario) : "",
    });
  }, [fazenda?.id]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function salvar() {
    if (!user || !fazenda) return;
    setSalvando(true);
    setErro(null);

    const { error } = await supabase
      .from("fazendas")
      .update({
        nome:         form.nome.trim() || "Minha Fazenda",
        cidade:       form.cidade.trim() || null,
        estado:       form.estado.trim() || null,
        meta_gmd_g:   parseInt(form.meta_gmd_g) || 133,
        meta_peso_kg: parseFloat(form.meta_peso_kg) || 40,
        preco_venda:  form.preco_venda ? parseFloat(form.preco_venda) : null,
        custo_diario: form.custo_diario ? parseFloat(form.custo_diario) : null,
      })
      .eq("id", fazenda.id);

    if (error) {
      setErro(error.message);
    } else {
      setSalvo(true);
      recarregar();
      setTimeout(() => setSalvo(false), 2500);
    }
    setSalvando(false);
  }

  async function sair() {
    await signOut();
    navigate("/auth", { replace: true });
  }

  const ESTADOS = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
    "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
    "SP","SE","TO"
  ];

  function Secao({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
    const aberta = secao === id;
    return (
      <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
        border: "0.5px solid hsl(100,18%,18%)", overflow: "hidden", marginBottom: 10 }}>
        <button onClick={() => setSecao(aberta ? null : id)} style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "14px 16px",
          background: "none", border: "none", cursor: "pointer",
          borderBottom: aberta ? "0.5px solid hsl(100,18%,18%)" : "none" }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(95,30%,88%)" }}>{titulo}</p>
          <span style={{ color: "hsl(100,18%,40%)", fontSize: 18,
            transition: "transform 0.2s",
            transform: aberta ? "rotate(90deg)" : "none" }}>›</span>
        </button>
        {aberta && <div style={{ padding: "14px 16px" }}>{children}</div>}
      </div>
    );
  }

  return (
    <div className="page">
      <BotaoVoltar para="/dashboard" />

      {/* Perfil do usuário */}
      <div style={{ background: "hsl(100,18%,13%)", borderRadius: 14,
        border: "0.5px solid hsl(100,18%,18%)", padding: "16px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%",
            background: "hsl(113,48%,14%)", border: "2px solid hsl(113,48%,30%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 600, color: "hsl(113,48%,65%)", flexShrink: 0 }}>
            {nomeUsuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "hsl(95,30%,92%)" }}>
              {nomeUsuario}
            </p>
            <p style={{ fontSize: 12, color: "hsl(100,18%,45%)", marginTop: 2 }}>
              {user?.email}
            </p>
            <p style={{ fontSize: 11, color: "hsl(113,48%,50%)", marginTop: 2 }}>
              Plano Premium
            </p>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {erro && (
        <div style={{ background: "hsl(0,65%,12%)", border: "0.5px solid hsl(0,65%,30%)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 12,
          color: "hsl(0,65%,62%)", fontSize: 13 }}>{erro}</div>
      )}
      {salvo && (
        <div style={{ background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,30%)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 12,
          color: "hsl(113,48%,62%)", fontSize: 13 }}>
          ✓ Configurações salvas com sucesso
        </div>
      )}

      {/* Seção: Fazenda */}
      <Secao id="fazenda" titulo="Dados da fazenda">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>
              Nome da fazenda
            </p>
            <input className="field" placeholder="Ex: Fazenda São Pedro"
              value={form.nome} onChange={e => set("nome", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
            <div>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>Cidade</p>
              <input className="field" placeholder="Ex: Sorocaba"
                value={form.cidade} onChange={e => set("cidade", e.target.value)} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 6 }}>Estado</p>
              <select className="field" value={form.estado}
                onChange={e => set("estado", e.target.value)}>
                <option value="">UF</option>
                {ESTADOS.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Secao>

      {/* Seção: Metas de produção */}
      <Secao id="metas" titulo="Metas de produção">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 4 }}>
              Meta de GMD (g/dia)
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,35%)", marginBottom: 6 }}>
              Padrão: 133g para sistemas de volumoso
            </p>
            <input className="field" type="number" placeholder="133"
              value={form.meta_gmd_g} onChange={e => set("meta_gmd_g", e.target.value)} />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 4 }}>
              Peso alvo de abate (kg)
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,35%)", marginBottom: 6 }}>
              Peso mínimo para o animal ser considerado pronto
            </p>
            <input className="field" type="number" step="0.5" placeholder="40"
              value={form.meta_peso_kg} onChange={e => set("meta_peso_kg", e.target.value)} />
          </div>
        </div>
      </Secao>

      {/* Seção: Parâmetros financeiros */}
      <Secao id="financeiro" titulo="Parâmetros financeiros">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 4 }}>
              Preço de venda (R$/kg vivo)
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,35%)", marginBottom: 6 }}>
              Usado no cálculo do ponto de equilíbrio
            </p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%",
                transform: "translateY(-50%)", fontSize: 13,
                color: "hsl(100,18%,50%)", pointerEvents: "none" }}>R$</span>
              <input className="field" type="number" step="0.01" placeholder="10,50"
                value={form.preco_venda} onChange={e => set("preco_venda", e.target.value)}
                style={{ paddingLeft: 36 }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "hsl(100,18%,45%)", marginBottom: 4 }}>
              Custo diário por cabeça (R$)
            </p>
            <p style={{ fontSize: 11, color: "hsl(100,18%,35%)", marginBottom: 6 }}>
              Custo médio diário de alimentação + manejo por animal
            </p>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%",
                transform: "translateY(-50%)", fontSize: 13,
                color: "hsl(100,18%,50%)", pointerEvents: "none" }}>R$</span>
              <input className="field" type="number" step="0.01" placeholder="3,20"
                value={form.custo_diario} onChange={e => set("custo_diario", e.target.value)}
                style={{ paddingLeft: 36 }} />
            </div>
          </div>
        </div>
      </Secao>

      {/* Seção: Links legais */}
      <Secao id="legal" titulo="Informações legais">
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Política de privacidade", rota: "/politica-privacidade" },
            { label: "Termos de uso",           rota: "/termos-de-uso"        },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.rota)} style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "12px 0",
              background: "none", border: "none", cursor: "pointer",
              borderBottom: i === 0 ? "0.5px solid hsl(100,18%,18%)" : "none" }}>
              <p style={{ fontSize: 14, color: "hsl(95,30%,82%)" }}>{item.label}</p>
              <span style={{ color: "hsl(100,18%,40%)", fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Botão salvar */}
      <button className="btn-primary" onClick={salvar} disabled={salvando}
        style={{ marginTop: 8, opacity: salvando ? 0.7 : 1 }}>
        {salvando ? "Salvando..." : "Salvar configurações"}
      </button>

      {/* Sair */}
      <button onClick={sair} style={{
        marginTop: 12, width: "100%", padding: "14px",
        borderRadius: 12, background: "none",
        border: "0.5px solid hsl(0,65%,28%)",
        color: "hsl(0,65%,55%)", fontSize: 14,
        cursor: "pointer", fontWeight: 500 }}>
        Sair da conta
      </button>

      {/* Versão */}
      <p style={{ textAlign: "center", fontSize: 11, color: "hsl(100,18%,30%)",
        marginTop: 24 }}>
        Ponto do Cordeiro v2.0
      </p>
    </div>
  );
}
