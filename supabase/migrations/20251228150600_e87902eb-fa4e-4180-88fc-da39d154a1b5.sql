-- Remover registros sem user_id (dados antigos do device_id)
DELETE FROM public.historico_simulacoes WHERE user_id IS NULL;

-- Tornar user_id NOT NULL para garantir autenticação
ALTER TABLE public.historico_simulacoes 
ALTER COLUMN user_id SET NOT NULL;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Usuarios podem inserir suas simulacoes" ON public.historico_simulacoes;
DROP POLICY IF EXISTS "Usuarios podem ver suas simulacoes" ON public.historico_simulacoes;
DROP POLICY IF EXISTS "Usuarios podem deletar suas simulacoes" ON public.historico_simulacoes;

-- Novas políticas com verificação explícita de autenticação
CREATE POLICY "Usuarios autenticados podem inserir suas simulacoes"
ON public.historico_simulacoes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios autenticados podem ver suas simulacoes"
ON public.historico_simulacoes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios autenticados podem deletar suas simulacoes"
ON public.historico_simulacoes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);