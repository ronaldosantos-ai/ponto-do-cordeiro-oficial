-- Criar tabela de alertas
CREATE TABLE public.alertas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  simulacao_id TEXT,
  tipo TEXT NOT NULL DEFAULT 'data',
  data_alerta TIMESTAMP WITH TIME ZONE NOT NULL,
  identificacao_animal TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuarios podem ver seus alertas"
ON public.alertas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem criar alertas"
ON public.alertas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seus alertas"
ON public.alertas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem deletar seus alertas"
ON public.alertas FOR DELETE
USING (auth.uid() = user_id);