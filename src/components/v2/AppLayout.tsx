import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard",     icon: "⊞", label: "Início"       },
  { path: "/rebanho",       icon: "🐑", label: "Rebanho"      },
  { path: "/pesagem",       icon: "⚖️",  label: "Pesagem"      },
  { path: "/relatorios",    icon: "📊", label: "Relatórios"   },
  { path: "/configuracoes", icon: "⚙️",  label: "Config."      },
];

const TITLES: Record<string, string> = {
  "/dashboard":     "Início",
  "/rebanho":       "Rebanho",
  "/rebanho/novo":  "Cadastrar animal",
  "/pesagem":       "Pesagem",
  "/relatorios":    "Relatórios",
  "/configuracoes": "Configurações",
};

const C = {
  bg:        "hsl(100,20%,9%)",
  surface:   "hsl(100,20%,11%)",
  card:      "hsl(100,18%,15%)",
  border:    "hsl(100,18%,18%)",
  muted:     "hsl(100,18%,40%)",
  text:      "hsl(95,30%,92%)",
  textSub:   "hsl(100,18%,55%)",
  primary:   "hsl(113,48%,60%)",
  primaryBg: "hsl(113,48%,12%)",
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const title = TITLES[location.pathname] ?? "Ponto do Cordeiro";

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(path));

  const goTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>

      {/* ════════════════════════════════
          SIDEBAR — só desktop (≥768px)
          ════════════════════════════════ */}
      <style>{`
        @media (max-width: 767px) {
          .pdc-sidebar { display: none !important; }
          .pdc-desktop-header { display: none !important; }
          .pdc-main { padding: 0 !important; }
          .pdc-content { padding: 16px 16px 88px !important; }
          .pdc-bottom-nav { display: flex !important; }
          .pdc-mobile-header { display: flex !important; }
        }
        @media (min-width: 768px) {
          .pdc-bottom-nav { display: none !important; }
          .pdc-mobile-header { display: none !important; }
        }
      `}</style>

      <aside className="pdc-sidebar" style={{
        width: sidebarOpen ? 240 : 64,
        flexShrink: 0,
        background: C.surface,
        borderRight: \`0.5px solid \${C.border}\`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        {/* Logo */}
        <div style={{
          height: 64, display: "flex", alignItems: "center",
          padding: sidebarOpen ? "0 20px" : "0",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          borderBottom: \`0.5px solid \${C.border}\`,
          flexShrink: 0,
        }}>
          {sidebarOpen ? (
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.primary, lineHeight: 1 }}>🐑 Ponto do Cordeiro</p>
              <p style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Gestão de rebanho</p>
            </div>
          ) : (
            <span style={{ fontSize: 22 }}>🐑</span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => goTo(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: 12, borderRadius: 10, marginBottom: 2, border: "none",
                  cursor: "pointer", fontSize: 13, transition: "all 0.15s",
                  padding: sidebarOpen ? "10px 14px" : "10px 0",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  background: active ? C.primaryBg : "transparent",
                  color: active ? C.primary : C.textSub,
                  fontWeight: active ? 500 : 400,
                }}>
                <span style={{ fontSize: 18, flexShrink: 0, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && (
                  <div style={{ marginLeft: "auto", width: 5, height: 5,
                    borderRadius: "50%", background: C.primary }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Fazenda */}
        {sidebarOpen && (
          <div style={{ margin: "0 8px 16px", padding: "12px 14px",
            borderRadius: 10, background: C.primaryBg,
            border: \`0.5px solid hsl(113,48%,18%)\` }}>
            <p style={{ fontSize: 11, color: "hsl(113,48%,40%)", marginBottom: 3 }}>Fazenda ativa</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Fazenda São Pedro</p>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>87 animais · Premium</p>
          </div>
        )}
      </aside>

      {/* ════════════════════════════
          ÁREA DIREITA
          ════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header desktop */}
        <header className="pdc-desktop-header" style={{
          height: 64, flexShrink: 0, background: C.surface,
          borderBottom: \`0.5px solid \${C.border}\`,
          display: "flex", alignItems: "center", padding: "0 24px", gap: 16,
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: C.card, border: \`0.5px solid \${C.border}\`,
            borderRadius: 8, width: 36, height: 36, cursor: "pointer",
            color: C.textSub, fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>☰</button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: C.muted }}>Início</span>
            {title !== "Início" && <>
              <span style={{ fontSize: 12, color: "hsl(100,18%,28%)" }}>›</span>
              <span style={{ fontSize: 12, color: "hsl(95,30%,72%)" }}>{title}</span>
            </>}
          </div>
          <div style={{ flex: 1 }} />

          <button style={{ position: "relative", background: C.card, border: \`0.5px solid \${C.border}\`,
            borderRadius: 8, width: 36, height: 36, cursor: "pointer",
            color: C.textSub, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            🔔
            <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7,
              borderRadius: "50%", background: "hsl(36,75%,60%)",
              border: \`1.5px solid \${C.surface}\` }} />
          </button>

          <div style={{ width: 36, height: 36, borderRadius: "50%",
            background: C.primaryBg, border: \`1.5px solid hsl(113,48%,28%)\`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: C.primary, cursor: "pointer" }}>R</div>
        </header>

        {/* Header mobile */}
        <header className="pdc-mobile-header" style={{
          height: 56, flexShrink: 0, background: C.surface,
          borderBottom: \`0.5px solid \${C.border}\`,
          alignItems: "center", padding: "0 16px",
          justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
          display: "none",
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>🐑 Ponto do Cordeiro</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ position: "relative", background: "none", border: "none",
              cursor: "pointer", color: C.textSub, fontSize: 20,
              display: "flex", alignItems: "center" }}>
              🔔
              <span style={{ position: "absolute", top: 0, right: 0, width: 7, height: 7,
                borderRadius: "50%", background: "hsl(36,75%,60%)" }} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: "50%",
              background: C.primaryBg, border: \`1.5px solid hsl(113,48%,28%)\`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, color: C.primary }}>R</div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="pdc-main" style={{ flex: 1, overflowY: "auto" }}>
          <div className="pdc-content" style={{ padding: "24px 28px 40px" }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* ════════════════════════════
          BOTTOM NAV — só mobile
          ════════════════════════════ */}
      <nav className="pdc-bottom-nav" style={{
        display: "none",
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: C.surface,
        borderTop: \`0.5px solid \${C.border}\`,
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button key={item.path} onClick={() => goTo(item.path)} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 3, padding: "10px 0 12px",
              background: "none", border: "none", cursor: "pointer",
            }}>
              <span style={{ fontSize: 20, opacity: active ? 1 : 0.4, lineHeight: 1 }}>{item.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: active ? 500 : 400,
                color: active ? C.primary : C.muted,
              }}>{item.label}</span>
              {active && (
                <div style={{ position: "absolute", bottom: 0,
                  width: 20, height: 2, borderRadius: 1,
                  background: C.primary,
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
