import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard",    icon: "⊞", label: "Dashboard"   },
  { path: "/rebanho",      icon: "🐑", label: "Rebanho"     },
  { path: "/pesagem",      icon: "⚖️", label: "Pesagem"     },
  { path: "/relatorios",   icon: "📊", label: "Relatórios"  },
  { path: "/configuracoes",icon: "⚙️", label: "Configurações"},
];

const TITLES: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/rebanho":       "Rebanho",
  "/rebanho/novo":  "Cadastrar animal",
  "/pesagem":       "Registrar pesagem",
  "/relatorios":    "Relatórios",
  "/configuracoes": "Configurações",
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const title = TITLES[location.pathname] ?? "Ponto do Cordeiro";

  const active = (path: string) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(path));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "hsl(100 20% 9%)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        flexShrink: 0,
        background: "hsl(100 20% 11%)",
        borderRight: "0.5px solid hsl(100 18% 16%)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s ease",
        overflow: "hidden",
      }}>

        {/* Logo */}
        <div style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: sidebarOpen ? "0 20px" : "0",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          borderBottom: "0.5px solid hsl(100 18% 16%)",
          flexShrink: 0,
        }}>
          {sidebarOpen ? (
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(113 48% 62%)", lineHeight: 1 }}>
                🐑 Ponto do Cordeiro
              </p>
              <p style={{ fontSize: 10, color: "hsl(100 18% 40%)", marginTop: 3 }}>Gestão de rebanho</p>
            </div>
          ) : (
            <span style={{ fontSize: 22 }}>🐑</span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map(item => {
            const isActive = active(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: sidebarOpen ? "10px 14px" : "10px 0",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 10,
                  marginBottom: 2,
                  border: "none",
                  cursor: "pointer",
                  background: isActive ? "hsl(113 48% 14%)" : "transparent",
                  color: isActive ? "hsl(113 48% 65%)" : "hsl(100 18% 50%)",
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                <span style={{
                  fontSize: 18,
                  flexShrink: 0,
                  filter: isActive ? "none" : "grayscale(0.5)",
                  opacity: isActive ? 1 : 0.6,
                }}>{item.icon}</span>
                {sidebarOpen && item.label}
                {sidebarOpen && isActive && (
                  <div style={{
                    marginLeft: "auto",
                    width: 4, height: 4,
                    borderRadius: "50%",
                    background: "hsl(113 48% 60%)",
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Fazenda info */}
        {sidebarOpen && (
          <div style={{
            margin: "0 8px 16px",
            padding: "12px 14px",
            borderRadius: 10,
            background: "hsl(113 48% 8%)",
            border: "0.5px solid hsl(113 48% 16%)",
          }}>
            <p style={{ fontSize: 11, color: "hsl(113 48% 45%)", marginBottom: 4 }}>Fazenda ativa</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(95 30% 85%)" }}>Fazenda São Pedro</p>
            <p style={{ fontSize: 11, color: "hsl(100 18% 40%)", marginTop: 2 }}>87 animais · Premium</p>
          </div>
        )}
      </aside>

      {/* ── Área direita ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: 64,
          flexShrink: 0,
          background: "hsl(100 20% 11%)",
          borderBottom: "0.5px solid hsl(100 18% 16%)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
        }}>
          {/* Toggle sidebar */}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: "hsl(100 18% 17%)",
            border: "0.5px solid hsl(100 18% 22%)",
            borderRadius: 8,
            width: 36, height: 36,
            cursor: "pointer",
            color: "hsl(100 18% 55%)",
            fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {sidebarOpen ? "☰" : "☰"}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "hsl(100 18% 40%)" }}>Início</span>
            {title !== "Dashboard" && (
              <>
                <span style={{ fontSize: 12, color: "hsl(100 18% 30%)" }}>›</span>
                <span style={{ fontSize: 12, color: "hsl(95 30% 75%)" }}>{title}</span>
              </>
            )}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Notificações */}
          <button style={{
            background: "hsl(100 18% 17%)",
            border: "0.5px solid hsl(100 18% 22%)",
            borderRadius: 8,
            width: 36, height: 36,
            cursor: "pointer",
            color: "hsl(100 18% 55%)",
            fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            🔔
            <span style={{
              position: "absolute", top: 6, right: 6,
              width: 8, height: 8, borderRadius: "50%",
              background: "hsl(36 75% 60%)",
              border: "1.5px solid hsl(100 20% 11%)",
            }} />
          </button>

          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "hsl(113 48% 14%)",
            border: "1.5px solid hsl(113 48% 30%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: "hsl(113 48% 65%)",
            cursor: "pointer",
          }}>
            R
          </div>
        </header>

        {/* Conteúdo */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 28px 40px",
          background: "hsl(100 20% 9%)",
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
