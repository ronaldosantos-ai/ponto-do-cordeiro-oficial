-- Fix RLS policies to explicitly require authenticated role

-- Drop existing policies for alertas table
DROP POLICY IF EXISTS "Usuarios podem ver seus alertas" ON public.alertas;
DROP POLICY IF EXISTS "Usuarios podem atualizar seus alertas" ON public.alertas;
DROP POLICY IF EXISTS "Usuarios podem deletar seus alertas" ON public.alertas;
DROP POLICY IF EXISTS "Premium users can create alertas" ON public.alertas;

-- Recreate alertas policies with TO authenticated
CREATE POLICY "Usuarios podem ver seus alertas"
ON public.alertas FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seus alertas"
ON public.alertas FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem deletar seus alertas"
ON public.alertas FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Premium users can create alertas"
ON public.alertas FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND is_premium_user(auth.uid()));

-- Drop and recreate INSERT policy for historico_simulacoes
DROP POLICY IF EXISTS "Usuarios podem inserir simulacoes" ON public.historico_simulacoes;

CREATE POLICY "Usuarios podem inserir simulacoes"
ON public.historico_simulacoes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (tipo = 'mvp' OR is_premium_user(auth.uid())));