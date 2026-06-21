import { useNavigate } from "react-router-dom";

interface Props {
  para?: string; // rota específica, se não informar usa navigate(-1)
  label?: string;
}

export default function BotaoVoltar({ para, label = "Voltar" }: Props) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => para ? navigate(para) : navigate(-1)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "hsl(113,48%,55%)",
        fontSize: 14,
        fontWeight: 500,
        padding: "0 0 16px 0",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
      {label}
    </button>
  );
}
