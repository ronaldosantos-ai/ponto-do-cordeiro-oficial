import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "hsl(100,20%,9%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
      }}>
        <span style={{ fontSize: 32 }}>🐑</span>
        <p style={{ fontSize: 14, color: "hsl(100,18%,45%)" }}>Carregando...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
