-- Tabela para armazenar histórico de simulações
CREATE TABLE public.historico_simulacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('mvp', 'premium')),
  dados JSONB NOT NULL,
  resultado JSONB NOT NULL,
  identificacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para buscar por device_id
CREATE INDEX idx_historico_device_id ON public.historico_simulacoes(device_id);

-- Índice para ordenação por data
CREATE INDEX idx_historico_created_at ON public.historico_simulacoes(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.historico_simulacoes ENABLE ROW LEVEL SECURITY;

-- Política pública para inserir (qualquer dispositivo pode inserir)
CREATE POLICY "Qualquer um pode inserir simulacoes"
ON public.historico_simulacoes
FOR INSERT
WITH CHECK (true);

-- Política pública para selecionar pelo device_id
CREATE POLICY "Qualquer um pode ver suas simulacoes"
ON public.historico_simulacoes
FOR SELECT
USING (true);

-- Política pública para deletar suas próprias simulações
CREATE POLICY "Qualquer um pode deletar suas simulacoes"
ON public.historico_simulacoes
FOR DELETE
USING (true);

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.historico_simulacoes;