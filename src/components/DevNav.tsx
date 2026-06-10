import { useState } from "react";
import { useNavigate } from "react-router-dom";

const pages = [
  { group: "Públicas", items: [
    { label: "Landing Page", path: "/" },
    { label: "Calculadora (Simulador)", path: "/simulador" },
    { label: "Login / Cadastro", path: "/auth" },
    { label: "Instalar PWA", path: "/install" },
    { label: "Política de Privacidade", path: "/politica-privacidade" },
    { label: "Termos de Uso", path: "/termos-de-uso" },
  ]},
  { group: "Usuário Logado", items: [
    { label: "Histórico", path: "/historico" },
    { label: "Gráficos", path: "/graficos" },
    { label: "Alertas", path: "/alertas" },
    { label: "Configurações", path: "/settings" },
    { label: "Google Sheets", path: "/settings/google-sheets" },
    { label: "Regiões", path: "/configuracoes/regioes" },
  ]},
  { group: "Premium", items: [
    { label: "Planos", path: "/premium" },
    { label: "Info Premium", path: "/premium-info" },
    { label: "Premium Ativado", path: "/premium/ativado" },
  ]},
  { group: "Admin", items: [
    { label: "Dashboard", path: "/admin" },
    { label: "Usuários", path: "/admin/users" },
    { label: "Simulações", path: "/admin/simulations" },
    { label: "Alertas", path: "/admin/alerts" },
    { label: "Exportações", path: "/admin/exports" },
    { label: "Faturamento", path: "/admin/billing" },
    { label: "Config Admin", path: "/admin/settings" },
    { label: "Logs", path: "/admin/logs" },
  ]},
];

export function DevNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!import.meta.env.DEV) return null;

  return (
    <div style={{ position: "fixed", bottom: 80, right: 16, zIndex: 99999 }}>
      {open && (
        <div style={{
          background: "#1e1e2e",
          border: "1px solid #3a3a5c",
          borderRadius: 10,
          padding: "8px 0",
          marginBottom: 8,
          width: 220,
          maxHeight: 440,
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
          {pages.map((group) => (
            <div key={group.group}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#7c7ca0",
                padding: "8px 14px 3px",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}>
                {group.group}
              </div>
              {group.items.map((page) => (
                <button
                  key={page.path}
                  onClick={() => { navigate(page.path); setOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    color: "#d0d0e8",
                    padding: "5px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#2e2e4a")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  {page.label}
                  <span style={{ color: "#555570", fontSize: 11, marginLeft: 6 }}>{page.path}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        title="Navegar entre páginas (só em desenvolvimento)"
        style={{
          background: "#5b4cdb",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 44,
          height: 44,
          fontSize: 20,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(91,76,219,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        {open ? "✕" : "🗺"}
      </button>
    </div>
  );
}
