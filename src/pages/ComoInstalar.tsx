import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const C = {
  bg: "hsl(100,20%,9%)", surface: "hsl(100,20%,11%)", card: "hsl(100,18%,15%)",
  border: "hsl(100,18%,18%)", text: "hsl(95,30%,92%)", sub: "hsl(100,18%,55%)",
  primary: "hsl(113,48%,60%)",
};

export default function ComoInstalar() {
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalado(true);
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler as any);
    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  async function instalar() {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") { setInstallPrompt(null); setInstalado(true); }
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ background: C.surface, borderBottom: `0.5px solid ${C.border}`,
        padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", cursor: "pointer",
          color: C.primary, fontSize: 14, fontWeight: 500, padding: 0 }}>← Voltar</button>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.primary }}>🐑 Ponto do Cordeiro</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 28 }}>📲 Instalar o app</h1>

        {/* Android */}
        <div style={{ background: C.card, borderRadius: 16, border: `0.5px solid ${C.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>🤖</span>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.text }}>Android</p>
          </div>
          {instalado ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(113,48%,62%)" }}>App já instalado!</p>
            </div>
          ) : (
            <button onClick={instalar} style={{
              width: "100%", padding: "18px", background: C.primary,
              color: "hsl(100,20%,10%)", border: "none", borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              📲 Instalar Ponto do Cordeiro
            </button>
          )}
        </div>

        {/* iPhone */}
        <div style={{ background: C.card, borderRadius: 16, border: `0.5px solid ${C.border}`, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>🍎</span>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.text }}>iPhone / iPad</p>
          </div>
          {[
            { n: "1", t: "Abra no Safari", d: "Acesse pontodocordeiro.com.br pelo Safari." },
            { n: "2", t: "Toque em compartilhar ↑", d: "Toque no ícone de quadrado com seta na barra inferior." },
            { n: "3", t: '"Adicionar à Tela de Início"', d: "Role as opções e toque nessa opção." },
            { n: "4", t: 'Toque em "Adicionar"', d: "Confirme no canto superior direito. Pronto!" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 3 ? 18 : 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "hsl(113,48%,14%)", border: "0.5px solid hsl(113,48%,28%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: C.primary }}>{p.n}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 3 }}>{p.t}</p>
                <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "none", cursor: "pointer", color: C.sub, fontSize: 13 }}>
            ← Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
