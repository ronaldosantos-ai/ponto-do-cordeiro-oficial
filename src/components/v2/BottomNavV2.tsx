import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/dashboard", icon: "⊞", label: "Início" },
  { path: "/rebanho",   icon: "🐑", label: "Rebanho" },
  { path: "/pesagem",   icon: "⚖",  label: "Pesagem" },
  { path: "/relatorios",icon: "📊", label: "Relatórios" },
  { path: "/configuracoes", icon: "⚙", label: "Config." },
];

export default function BottomNavV2() {
  const location = useLocation();
  const navigate = useNavigate();
  const hide = ["/auth", "/admin"].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const active = location.pathname === tab.path ||
          (tab.path !== "/dashboard" && location.pathname.startsWith(tab.path));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{
              fontSize: 20,
              opacity: active ? 1 : 0.35,
              filter: active ? "none" : "grayscale(1)"
            }}>{tab.icon}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              color: active ? "hsl(113 48% 60%)" : "hsl(100 18% 45%)"
            }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
