import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const LINK_MENSAL = "https://checkout.ticto.app/O2FA58E8D";
const LINK_ANUAL  = "https://checkout.ticto.app/O8DA770A5";

export default function SemAcesso() {
  const navigate    = useNavigate();
  const { signOut } = useAuth();
  const { subscription } = useSubscription();
  const isSuspended = subscription?.status === "suspended";

  async function sair() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <div style={{ minHeight: "100vh", background: "hsl(100,20%,9%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🐑</p>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "hsl(95,30%,92%)", marginBottom: 12, lineHeight: 1.3 }}>
          {isSuspended ? "Pagamento em atraso" : "Seu acesso encerrou"}
        </h1>
        <p style={{ fontSize: 15, color: "hsl(100,18%,55%)", lineHeight: 1.7, marginBottom: 28 }}>
          {isSuspended
            ? "Regularize o pagamento para continuar usando o Ponto do Cordeiro."
            : "Escolha um plano para continuar gerenciando seu rebanho."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <a href={LINK_ANUAL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", padding: "16px",
            background: "hsl(113,48%,60%)", color: "hsl(100,20%,10%)",
            borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 700 }}>
            🎯 Plano Anual — R$ 98,00/ano
            <p style={{ fontSize: 12, fontWeight: 400, marginTop: 4, opacity: 0.8 }}>
              Equivale a R$ 8,17/mês — economia de 59%
            </p>
          </a>
          <a href={LINK_MENSAL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", padding: "16px",
            background: "hsl(100,18%,17%)", border: "0.5px solid hsl(100,18%,25%)",
            color: "hsl(95,30%,85%)", borderRadius: 12, textDecoration: "none",
            fontSize: 15, fontWeight: 500 }}>
            Plano Mensal — R$ 19,90/mês
          </a>
        </div>
        <p style={{ fontSize: 12, color: "hsl(100,18%,38%)", marginBottom: 20 }}>
          Após o pagamento seu acesso é liberado automaticamente.
        </p>
        <button onClick={sair} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "hsl(100,18%,40%)", fontSize: 13 }}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
