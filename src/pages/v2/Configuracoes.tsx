import { useNavigate } from "react-router-dom";

const itens = [
  { label: "Nome da fazenda",     sub: "Fazenda São Pedro" },
  { label: "Meta de GMD",         sub: "133 g/dia (volumoso)" },
  { label: "Meta de peso de abate",sub: "40 kg" },
  { label: "Preço de venda",      sub: "R$ 10,50/kg vivo" },
  { label: "Custo diário/cabeça", sub: "R$ 3,20/dia" },
  { label: "Conta e plano",       sub: "Premium ativo" },
  { label: "Política de privacidade", sub: "" },
  { label: "Termos de uso",       sub: "" },
];

export default function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <p className="section-label">Parâmetros do rebanho</p>
      {itens.slice(0, 5).map((item, i) => (
        <div key={i} className="animal-row" style={{ cursor: "pointer" }}>
          <div>
            <p style={{ fontSize: 14, color: "hsl(95 30% 92%)" }}>{item.label}</p>
            {item.sub && (
              <p style={{ fontSize: 12, color: "hsl(100 18% 55%)", marginTop: 2 }}>{item.sub}</p>
            )}
          </div>
          <span style={{ color: "hsl(100 18% 40%)", fontSize: 16 }}>›</span>
        </div>
      ))}

      <p className="section-label" style={{ marginTop: 20 }}>Conta</p>
      {itens.slice(5).map((item, i) => (
        <div key={i} className="animal-row" style={{ cursor: "pointer" }}
          onClick={() => {
            if (item.label === "Política de privacidade") navigate("/politica-privacidade");
            if (item.label === "Termos de uso") navigate("/termos-de-uso");
          }}>
          <p style={{ fontSize: 14, color: "hsl(95 30% 92%)" }}>{item.label}</p>
          <span style={{ color: "hsl(100 18% 40%)", fontSize: 16 }}>›</span>
        </div>
      ))}

      <button
        style={{
          marginTop: 32, width: "100%", padding: "14px",
          borderRadius: 12, background: "none",
          border: "0.5px solid hsl(0 65% 30%)",
          color: "hsl(0 65% 62%)", fontSize: 14, cursor: "pointer"
        }}
      >
        Sair da conta
      </button>
    </div>
  );
}
