-- Adicionar coluna user_id à tabela existente
ALTER TABLE public.historico_simulacoes 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Criar índice para user_id
CREATE INDEX idx_historico_user_id ON public.historico_simulacoes(user_id);

-- Remover políticas antigas
DROP POLICY IF EXISTS "Qualquer um pode inserir simulacoes" ON public.historico_simulacoes;
DROP POLICY IF EXISTS "Qualquer um pode ver suas simulacoes" ON public.historico_simulacoes;
DROP POLICY IF EXISTS "Qualquer um pode deletar suas simulacoes" ON public.historico_simulacoes;

-- Novas políticas baseadas no user_id
CREATE POLICY "Usuarios podem inserir suas simulacoes"
ON public.historico_simulacoes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem ver suas simulacoes"
ON public.historico_simulacoes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem deletar suas simulacoes"
ON public.historico_simulacoes
FOR DELETE
USING (auth.uid() = user_id);