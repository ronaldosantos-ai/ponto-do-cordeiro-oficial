import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <EmptyState
        icone={<AlertCircle className="w-20 h-20" />}
        titulo="Página não encontrada"
        descricao="A página que você procura não existe ou foi movida"
        acao={{
          texto: "Voltar ao início",
          onClick: () => navigate('/')
        }}
      />
    </div>
  );
};

export default NotFound;
