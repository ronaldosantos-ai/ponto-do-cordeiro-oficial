import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { EmptyState } from "@/components/EmptyState";

interface Regiao {
  id: string;
  nome: string;
  preco: number;
}

function gerarId(): string {
  return crypto.randomUUID();
}

function obterRegioes(): Regiao[] {
  const data = localStorage.getItem("regioes");
  return data ? JSON.parse(data) : [];
}

function salvarRegioes(regioes: Regiao[]) {
  localStorage.setItem("regioes", JSON.stringify(regioes));
}

const Regioes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();

  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRegiao, setEditingRegiao] = useState<Regiao | null>(null);
  const [deletingRegiao, setDeletingRegiao] = useState<Regiao | null>(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!premiumLoading && !isPremium) {
      navigate("/");
    }
  }, [navigate, user, authLoading, isPremium, premiumLoading]);

  useEffect(() => {
    setRegioes(obterRegioes());
  }, []);

  function abrirDialogNova() {
    setEditingRegiao(null);
    setNome("");
    setPreco("");
    setDialogOpen(true);
  }

  function abrirDialogEditar(regiao: Regiao) {
    setEditingRegiao(regiao);
    setNome(regiao.nome);
    setPreco(regiao.preco.toFixed(2));
    setDialogOpen(true);
  }

  function handleSalvar() {
    const nomeFormatado = nome.trim();
    const precoNumero = parseFloat(preco.replace(",", "."));

    if (!nomeFormatado) {
      toast({ title: "❌ Nome da região é obrigatório", variant: "destructive" });
      return;
    }

    if (isNaN(precoNumero) || precoNumero <= 0) {
      toast({ title: "❌ Preço inválido", variant: "destructive" });
      return;
    }

    let novasRegioes: Regiao[];

    if (editingRegiao) {
      novasRegioes = regioes.map((r) =>
        r.id === editingRegiao.id
          ? { ...r, nome: nomeFormatado, preco: precoNumero }
          : r
      );
      toast({ title: "✅ Região atualizada" });
    } else {
      const novaRegiao: Regiao = {
        id: gerarId(),
        nome: nomeFormatado,
        preco: precoNumero,
      };
      novasRegioes = [...regioes, novaRegiao];
      toast({ title: "✅ Região adicionada" });
    }

    salvarRegioes(novasRegioes);
    setRegioes(novasRegioes);
    setDialogOpen(false);
  }

  function confirmarDeletar(regiao: Regiao) {
    setDeletingRegiao(regiao);
    setDeleteDialogOpen(true);
  }

  function handleDeletar() {
    if (!deletingRegiao) return;

    const novasRegioes = regioes.filter((r) => r.id !== deletingRegiao.id);
    salvarRegioes(novasRegioes);
    setRegioes(novasRegioes);
    setDeleteDialogOpen(false);
    setDeletingRegiao(null);
    toast({ title: "✅ Região removida" });
  }

  if (premiumLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Carregando">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isPremium) {
    return null;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/settings")}
          className="p-2 hover:bg-secondary h-12"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={abrirDialogNova}
          className="bg-green-600 hover:bg-green-700 h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Região
        </Button>
      </header>

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Preços por Região</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie os preços médios de cada região
        </p>
      </div>

      {/* Lista de Regiões */}
      {regioes.length === 0 ? (
        <EmptyState
          icone={<MapPin className="w-12 h-12" />}
          titulo="Nenhuma região cadastrada"
          descricao="Adicione regiões para gerenciar os preços por localidade"
          acao={{
            texto: "Adicionar Primeira Região",
            onClick: abrirDialogNova
          }}
        />
      ) : (
        <div className="space-y-3">
          {regioes.map((regiao) => (
            <Card key={regiao.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{regiao.nome}</p>
                      <p className="text-lg font-bold text-primary">
                        R$ {regiao.preco.toFixed(2)}/kg
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirDialogEditar(regiao)}
                      aria-label={`Editar ${regiao.nome}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => confirmarDeletar(regiao)}
                      className="text-red-600 hover:bg-red-50"
                      aria-label={`Deletar ${regiao.nome}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Adicionar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRegiao ? "Editar Região" : "Nova Região"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da região</Label>
              <Input
                id="nome"
                placeholder="Ex: SP Interior"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço médio (R$/kg)</Label>
              <Input
                id="preco"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="Ex: 20.50"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="h-12"
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="h-12">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir região?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deletingRegiao?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletar}
              className="bg-red-600 hover:bg-red-700 h-12"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Regioes;
