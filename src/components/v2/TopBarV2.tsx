import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/dashboard":     "",
  "/rebanho":       "Rebanho",
  "/rebanho/novo":  "Cadastrar animal",
  "/pesagem":       "Registrar pesagem",
  "/relatorios":    "Relatórios",
  "/configuracoes": "Configurações",
};

export default function TopBarV2() {
  const location = useLocation();
  const hide = ["/auth", "/admin"].some(p => location.pathname.startsWith(p));
  if (hide) return null;
  const title = titles[location.pathname] ?? "";
  if (!title) return null;

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      height: 56,
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      background: "hsl(100 20% 9%)",
      borderBottom: "0.5px solid hsl(100 18% 18%)",
    }}>
      <span style={{
        fontSize: 17,
        fontWeight: 500,
        color: "hsl(95 30% 92%)"
      }}>{title}</span>
    </header>
  );
}
