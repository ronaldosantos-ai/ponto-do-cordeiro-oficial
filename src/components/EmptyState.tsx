import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icone: React.ReactNode;
  titulo: string;
  descricao: string;
  acao?: {
    texto: string;
    onClick: () => void;
  };
}

export function EmptyState({ icone, titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-muted-foreground/30 mb-4">
        {icone}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {titulo}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {descricao}
      </p>
      {acao && (
        <Button onClick={acao.onClick} className="h-12">
          {acao.texto}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
