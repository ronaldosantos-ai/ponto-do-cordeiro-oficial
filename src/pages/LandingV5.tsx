import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Benefícios",    id: "beneficios"    },
  { label: "Planos",        id: "planos"        },
  { label: "FAQ",           id: "faq"           },
];

const BENEFICIOS = [
  { icon: "⚖️", titulo: "Ponto de equilíbrio em segundos",
    desc: "Saiba exatamente qual peso seu cordeiro precisa atingir para cobrir os custos e gerar lucro." },
  { icon: "📈", titulo: "GMD monitorado automaticamente",
    desc: "O Ganho Médio Diário de cada animal é calculado a cada pesagem. Você recebe alerta quando está abaixo da meta." },
  { icon: "💰", titulo: "Controle total dos custos",
    desc: "Lance concentrado, volumoso, medicamentos, frete. Veja onde o dinheiro está indo." },
  { icon: "🔔", titulo: "Alertas que trabalham por você",
    desc: "O app identifica automaticamente animais para descarte, lotes discrepantes e recém-nascidos." },
  { icon: "🏭", titulo: "Frigorífico ou mercado informal?",
    desc: "Calcule qual canal de venda dá mais retorno para cada animal." },
  { icon: "📊", titulo: "Painel de gestão completo",
    desc: "Dashboard com visão geral do rebanho, histórico de GMD, gestão de lotes e relatórios." },
];

const PASSOS = [
  { num: "01", titulo: "Cadastre seus animais", desc: "Registre cada cordeiro com brinco, raça, data de nascimento e peso inicial." },
  { num: "02", titulo: "Registre pesagens e custos", desc: "A cada pesagem, o GMD é calculado automaticamente." },
  { num: "03", titulo: "Tome decisões com dados", desc: "Veja o ponto de equilíbrio, compare canais de venda e receba alertas." },
];

const PLANOS = [
  { nome: "Mensal", preco: "R$ 19,90", periodo: "/mês", sub: "Menos de R$ 1 por dia", destaque: false,
    url: "https://checkout.ticto.app/O2FA58E8D",
    itens: ["Animais ilimitados","Pesagens ilimitadas","Alertas automáticos","Ponto de equilíbrio","Comparativo de mercado","Gestão de lotes","Suporte por WhatsApp"],
    cta: "Começar 7 dias grátis" },
  { nome: "Anual", preco: "R$ 98,00", periodo: "/ano", sub: "Equivale a R$ 8,17/mês — economize 59%", destaque: true,
    url: "https://checkout.ticto.app/O8DA770A5",
    itens: ["Tudo do plano mensal","Prioridade no suporte","Acesso antecipado a novas funcionalidades","Relatórios avançados"],
    cta: "Melhor custo-benefício" },
];

const FAQS = [
  { p: "Preciso ter experiência com tecnologia para usar?", r: "Não. O app foi criado pensando no produtor rural, que usa o celular no campo. Tudo é simples e direto ao ponto." },
  { p: "Funciona no celular?", r: "Sim. O Ponto do Cordeiro foi desenvolvido primeiro para celular. Funciona em qualquer smartphone com internet." },
  { p: "Meus dados ficam seguros?", r: "Sim. Cada produtor vê apenas seus próprios dados. Usamos criptografia e infraestrutura profissional." },
  { p: "Posso cancelar quando quiser?", r: "Sim. Sem fidelidade, sem multa. No plano mensal você cancela a qualquer momento." },
  { p: "O app calcula o GMD automaticamente?", r: "Sim. Basta registrar as pesagens nas datas certas. O sistema calcula o GMD de cada animal." },
  { p: "Posso usar para outros animais além de cordeiros?", r: "Por enquanto o foco é na ovinocultura. Caprinos e bovinos estão nas próximas versões." },
];

export default function LandingV5() {
  const navigate  = useNavigate();
  const [faqAberta, setFaqAberta] = useState<number | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [instalado, setInstalado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalado(true);
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler as any);
    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  async function instalarApp() {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") { setInstallPrompt(null); setInstalado(true); }
    }
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const C = {
    bg: "hsl(100,20%,9%)", surface: "hsl(100,20%,11%)", card: "hsl(100,18%,15%)",
    border: "hsl(100,18%,18%)", text: "hsl(95,30%,92%)", sub: "hsl(100,18%,55%)",
    muted: "hsl(100,18%,40%)", primary: "hsl(113,48%,60%)",
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "hsl(100,20%,9%,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `0.5px solid ${C.border}` }}>

        {/* Barra principal */}
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>

          {/* Logo + Nome */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <img src="/logo-cordeiro.png" alt="Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: C.primary }}>Ponto do Cordeiro</span>
          </div>

          {/* DESKTOP */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              {NAV_LINKS.map(link => (
                <button key={link.id} onClick={() => scrollTo(link.id)} style={{
                  background: "transparent", border: "none", color: C.sub,
                  fontSize: 14, fontWeight: 500, cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.sub)}>
                  {link.label}
                </button>
              ))}
              <button onClick={() => navigate("/auth")} style={{
                background: "transparent", color: C.sub, border: `0.5px solid ${C.border}`,
                borderRadius: 10, padding: "8px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Entrar
              </button>
              <button onClick={() => scrollTo("planos")} style={{
                background: C.primary, color: "hsl(100,20%,10%)", border: "none",
                borderRadius: 10, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                🎯 7 dias grátis
              </button>
            </div>
          )}

          {/* MOBILE */}
          {isMobile && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => scrollTo("planos")} style={{
                background: C.primary, color: "hsl(100,20%,10%)", border: "none",
                borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                🎯 7 dias grátis
              </button>
              <button onClick={() => setMenuAberto(o => !o)} style={{
                background: "transparent", border: `0.5px solid ${C.border}`,
                borderRadius: 8, width: 38, height: 38, cursor: "pointer",
                color: C.sub, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {menuAberto ? "✕" : "☰"}
              </button>
            </div>
          )}
        </div>

        {/* MOBILE dropdown */}
        {isMobile && menuAberto && (
          <div style={{
            display: "flex", flexDirection: "column",
            borderTop: `0.5px solid ${C.border}`,
            background: "hsl(100,20%,10%)",
            padding: "8px 20px 16px" }}>
            {NAV_LINKS.map((link, i) => (
              <button key={link.id}
                onClick={() => { scrollTo(link.id); setMenuAberto(false); }}
                style={{
                  background: "transparent", border: "none", color: C.sub,
                  fontSize: 15, fontWeight: 500, cursor: "pointer",
                  padding: "12px 0", textAlign: "left",
                  borderBottom: i < NAV_LINKS.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                {link.label}
              </button>
            ))}
            <button onClick={() => { navigate("/auth"); setMenuAberto(false); }}
              style={{
                background: "transparent", border: "none", color: C.sub,
                fontSize: 15, fontWeight: 500, cursor: "pointer",
                padding: "12px 0", textAlign: "left",
                borderTop: `0.5px solid ${C.border}`, marginTop: 4 }}>
              Entrar
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 80, padding: "120px 24px 80px",
        textAlign: "center", position: "relative", overflow: "hidden",
        backgroundImage: "url(/hero-background.jpg)",
        backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, hsl(100,20%,9%,0.88) 0%, hsl(100,20%,9%,0.96) 100%)",
          zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            background: "hsl(113,48%,10%)", border: "0.5px solid hsl(113,48%,25%)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, display: "inline-block" }} />
            <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>Gestão profissional para ovinocultores</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20, color: C.text }}>
            Pare de criar cordeiro <span style={{ color: C.primary }}>no escuro</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: C.sub, lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            Cadastre cada animal, monitore o GMD, calcule o ponto de equilíbrio e receba alertas automáticos. Tudo no celular, feito para o campo.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <button onClick={() => scrollTo("planos")} style={{
              background: C.primary, color: "hsl(100,20%,10%)", border: "none",
              borderRadius: 12, padding: "18px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 8px 32px hsl(113,48%,30%,0.4)" }}>
              Ver planos e preços →
            </button>
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ icon: "🎯", text: "7 dias grátis" }, { icon: "📱", text: "Funciona no celular" }, { icon: "🔒", text: "Cancele quando quiser" }]
              .map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted }}>
                <span>{item.icon}</span><span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section style={{ padding: "48px 24px", background: C.surface, borderTop: `0.5px solid ${C.border}`, borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, textAlign: "center" }}>
          {[{ valor: "40 kg", desc: "peso alvo em 4 a 6 meses" }, { valor: "133g", desc: "GMD mínimo recomendado" }, { valor: "< R$ 1", desc: "por dia para ter controle total" }, { valor: "100%", desc: "feito para o produtor rural" }]
            .map((item, i) => (
            <div key={i}>
              <p style={{ fontSize: 36, fontWeight: 700, color: C.primary, lineHeight: 1, marginBottom: 8 }}>{item.valor}</p>
              <p style={{ fontSize: 13, color: C.muted }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Como funciona</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: 16 }}>Três passos para ter controle total</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {PASSOS.map((passo, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 16, border: `0.5px solid ${C.border}`, padding: 28 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "hsl(113,48%,20%)", marginBottom: 16, lineHeight: 1 }}>{passo.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: C.text }}>{passo.titulo}</h3>
                <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6 }}>{passo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" style={{ padding: "80px 24px", background: C.surface, borderTop: `0.5px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Benefícios</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700 }}>Tudo que você precisa para criar com lucro</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {BENEFICIOS.map((b, i) => (
              <div key={i} style={{ background: C.bg, borderRadius: 14, border: `0.5px solid ${C.border}`, padding: 24 }}>
                <span style={{ fontSize: 28, display: "block", marginBottom: 14 }}>{b.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: C.text }}>{b.titulo}</h3>
                <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEM/COM */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <style>{`@media (max-width: 640px) { .compare-grid { grid-template-columns: 1fr !important; } }`}</style>
          <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "hsl(0,65%,10%)", border: "0.5px solid hsl(0,65%,20%)", borderRadius: 16, padding: 28 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,65%,55%)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>❌ Sem o app</p>
              {["Não sabe qual animal está dando lucro","GMD calculado no papel","Custos misturados, sem visibilidade","Descobre o prejuízo tarde demais","Gestão no modo bombeiro"]
                .map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "hsl(0,65%,55%)", flexShrink: 0, marginTop: 2 }}>✕</span>
                  <p style={{ fontSize: 15, color: "hsl(0,65%,75%)", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "hsl(113,48%,9%)", border: "0.5px solid hsl(113,48%,20%)", borderRadius: 16, padding: 28 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>✅ Com o Ponto do Cordeiro</p>
              {["Ponto de equilíbrio calculado por animal","GMD atualizado a cada pesagem","Custos organizados por categoria","Alertas antes que vire problema","Gestão proativa e lucrativa"]
                .map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{ color: C.primary, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <p style={{ fontSize: 15, color: "hsl(113,48%,78%)", lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: "80px 24px", background: C.surface, borderTop: `0.5px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Planos</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: 12 }}>Simples e transparente</h2>
            <p style={{ fontSize: 16, color: C.sub }}>Sem taxa de adesão. Sem surpresa. Cancele quando quiser.</p>
          </div>
          <style>{`@media (max-width: 640px) { .planos-grid { grid-template-columns: 1fr !important; } }`}</style>
          <div className="planos-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PLANOS.map((plano, i) => (
              <div key={i} style={{ background: plano.destaque ? "hsl(113,48%,10%)" : C.bg,
                border: `${plano.destaque ? "1.5px" : "0.5px"} solid ${plano.destaque ? C.primary : C.border}`,
                borderRadius: 16, padding: 28, position: "relative" }}>
                {plano.destaque && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: C.primary, color: "hsl(100,20%,10%)", fontSize: 11, fontWeight: 700,
                    padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap" }}>
                    MELHOR ESCOLHA
                  </div>
                )}
                <p style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 16 }}>{plano.nome}</p>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: plano.destaque ? C.primary : C.text }}>{plano.preco}</span>
                  <span style={{ fontSize: 14, color: C.muted }}>{plano.periodo}</span>
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>{plano.sub}</p>
                <div style={{ marginBottom: 28 }}>
                  {plano.itens.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                      <span style={{ color: C.primary, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <p style={{ fontSize: 13, color: C.sub }}>{item}</p>
                    </div>
                  ))}
                </div>
                <a href={plano.url} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", width: "100%", padding: "14px", borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none",
                  textDecoration: "none", textAlign: "center",
                  background: plano.destaque ? C.primary : C.card,
                  color: plano.destaque ? "hsl(100,20%,10%)" : C.text }}>
                  {plano.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: C.primary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Dúvidas frequentes</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700 }}>Perguntas e respostas</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 12,
                border: `0.5px solid ${faqAberta === i ? C.primary : C.border}`, overflow: "hidden" }}>
                <button onClick={() => setFaqAberta(faqAberta === i ? null : i)} style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
                  <p style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{faq.p}</p>
                  <span style={{ fontSize: 20, color: C.muted, flexShrink: 0, transition: "transform 0.2s",
                    transform: faqAberta === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {faqAberta === i && (
                  <div style={{ padding: "0 20px 16px" }}>
                    <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.7 }}>{faq.r}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "80px 24px", background: C.surface, borderTop: `0.5px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <img src="/logo-cordeiro.png" alt="Logo" style={{ width: 80, height: 80, objectFit: "contain", display: "block", margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: 16, color: C.text }}>
            Comece hoje a criar com lucro
          </h2>
          <p style={{ fontSize: 16, color: C.sub, lineHeight: 1.7, marginBottom: 32 }}>
            Junte-se aos produtores que já estão tomando decisões com dados.
          </p>
          <a href="https://checkout.ticto.app/O2FA58E8D" target="_blank" rel="noopener noreferrer" style={{
            background: C.primary, color: "hsl(100,20%,10%)", border: "none", borderRadius: 12,
            padding: "18px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer",
            display: "inline-block", textDecoration: "none" }}>
            Começar 7 dias grátis
          </a>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            {["7 dias grátis", "Cancele quando quiser", "Suporte por WhatsApp"].map((t, i) => (
              <span key={i} style={{ fontSize: 12, color: C.muted }}>✓ {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", borderTop: `0.5px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/logo-cordeiro.png" alt="Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Ponto do Cordeiro</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => navigate("/politica-privacidade")} style={{
              background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12 }}>
              Política de privacidade
            </button>
            <button onClick={() => navigate("/termos-de-uso")} style={{
              background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12 }}>
              Termos de uso
            </button>
            <button onClick={() => navigate("/como-instalar")} style={{
              background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12 }}>
              📲 Instalar o app
            </button>
          </div>
          <p style={{ fontSize: 12, color: C.muted }}>© 2026 RS Marketer Ltda</p>
        </div>
      </footer>
    </div>
  );
}
