import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Fazenda {
  id: string;
  nome: string;
  meta_gmd_g: number;
  meta_peso_kg: number;
  preco_venda: number | null;
  custo_diario: number | null;
}

// Cache em módulo — evita múltiplas chamadas ao Supabase quando vários
// componentes usam useFazenda() ao mesmo tempo na mesma sessão.
let _cache: Fazenda | null = null;
let _userId: string | null = null;
let _promise: Promise<Fazenda | null> | null = null;

function limparCache() {
  _cache = null;
  _userId = null;
  _promise = null;
}

async function buscarOuCriarFazenda(userId: string): Promise<Fazenda | null> {
  // Já temos no cache para este user
  if (_cache && _userId === userId) return _cache;

  // Já existe uma busca em andamento — reutiliza
  if (_promise && _userId === userId) return _promise;

  _userId = userId;
  _promise = (async () => {
    const { data } = await supabase
      .from("fazendas")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (data) {
      _cache = data as Fazenda;
      return _cache;
    }

    // Cria fazenda padrão na primeira vez
    const { data: nova } = await supabase
      .from("fazendas")
      .insert({ user_id: userId, nome: "Minha Fazenda", meta_gmd_g: 133, meta_peso_kg: 40 })
      .select()
      .single();

    _cache = nova as Fazenda | null;
    return _cache;
  })();

  return _promise;
}

export function useFazenda() {
  const { user } = useAuth();
  const [fazenda, setFazenda] = useState<Fazenda | null>(_cache);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    // Se já está no cache para este user, usa direto
    if (_cache && _userId === user.id) {
      setFazenda(_cache);
      setLoading(false);
      return;
    }

    setLoading(true);
    buscarOuCriarFazenda(user.id).then(f => {
      setFazenda(f);
      setLoading(false);
    });
  }, [user?.id]);

  async function recarregar() {
    if (!user) return;
    limparCache();
    setLoading(true);
    const f = await buscarOuCriarFazenda(user.id);
    setFazenda(f);
    setLoading(false);
  }

  return { fazenda, loading, recarregar };
}
