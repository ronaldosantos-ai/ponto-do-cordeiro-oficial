-- ============================================================
-- V2: Ponto do Cordeiro — Tabelas principais
-- ============================================================

-- ── 1. FAZENDAS ──────────────────────────────────────────────
CREATE TABLE public.fazendas (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  cidade        TEXT,
  estado        TEXT,
  meta_gmd_g    INTEGER NOT NULL DEFAULT 133,
  meta_peso_kg  NUMERIC(6,2) NOT NULL DEFAULT 40,
  preco_venda   NUMERIC(8,2),
  custo_diario  NUMERIC(8,2),
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fazendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve proprias fazendas"
  ON public.fazendas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario cria proprias fazendas"
  ON public.fazendas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita proprias fazendas"
  ON public.fazendas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario deleta proprias fazendas"
  ON public.fazendas FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_fazendas_user_id ON public.fazendas(user_id);


-- ── 2. LOTES ─────────────────────────────────────────────────
CREATE TABLE public.lotes (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fazenda_id  UUID NOT NULL REFERENCES public.fazendas(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  descricao   TEXT,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve proprios lotes"
  ON public.lotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario cria proprios lotes"
  ON public.lotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita proprios lotes"
  ON public.lotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario deleta proprios lotes"
  ON public.lotes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_lotes_fazenda_id ON public.lotes(fazenda_id);
CREATE INDEX idx_lotes_user_id    ON public.lotes(user_id);


-- ── 3. ANIMAIS ───────────────────────────────────────────────
CREATE TABLE public.animais (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fazenda_id      UUID NOT NULL REFERENCES public.fazendas(id) ON DELETE CASCADE,
  lote_id         UUID REFERENCES public.lotes(id) ON DELETE SET NULL,

  -- Identificacao
  brinco          TEXT NOT NULL,
  sexo            TEXT NOT NULL CHECK (sexo IN ('M', 'F')),
  raca            TEXT,
  data_nascimento DATE,
  peso_inicial_kg NUMERIC(6,2),

  -- Genealogia
  brinco_mae      TEXT,
  brinco_pai      TEXT,

  -- Status
  status          TEXT NOT NULL DEFAULT 'ativo'
                  CHECK (status IN ('ativo', 'vendido', 'morto', 'refugo')),

  observacoes     TEXT,

  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE (user_id, brinco)
);

ALTER TABLE public.animais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve proprios animais"
  ON public.animais FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario cria proprios animais"
  ON public.animais FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita proprios animais"
  ON public.animais FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario deleta proprios animais"
  ON public.animais FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_animais_user_id    ON public.animais(user_id);
CREATE INDEX idx_animais_fazenda_id ON public.animais(fazenda_id);
CREATE INDEX idx_animais_lote_id    ON public.animais(lote_id);
CREATE INDEX idx_animais_status     ON public.animais(status);
CREATE INDEX idx_animais_brinco     ON public.animais(user_id, brinco);


-- ── 4. PESAGENS ──────────────────────────────────────────────
CREATE TABLE public.pesagens (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id   UUID NOT NULL REFERENCES public.animais(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_pesagem DATE NOT NULL DEFAULT CURRENT_DATE,
  peso_kg     NUMERIC(6,2) NOT NULL,
  observacoes TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pesagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve proprias pesagens"
  ON public.pesagens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario cria proprias pesagens"
  ON public.pesagens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita proprias pesagens"
  ON public.pesagens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario deleta proprias pesagens"
  ON public.pesagens FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_pesagens_animal_id   ON public.pesagens(animal_id);
CREATE INDEX idx_pesagens_user_id     ON public.pesagens(user_id);
CREATE INDEX idx_pesagens_data        ON public.pesagens(data_pesagem DESC);


-- ── 5. CUSTOS ────────────────────────────────────────────────
CREATE TABLE public.custos (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id   UUID REFERENCES public.animais(id) ON DELETE CASCADE,
  lote_id     UUID REFERENCES public.lotes(id) ON DELETE SET NULL,
  fazenda_id  UUID NOT NULL REFERENCES public.fazendas(id) ON DELETE CASCADE,

  categoria   TEXT NOT NULL
              CHECK (categoria IN (
                'concentrado', 'volumoso', 'medicamento',
                'frete', 'mao_de_obra', 'outros'
              )),
  descricao   TEXT,
  valor       NUMERIC(10,2) NOT NULL,
  data_custo  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve proprios custos"
  ON public.custos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario cria proprios custos"
  ON public.custos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario edita proprios custos"
  ON public.custos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario deleta proprios custos"
  ON public.custos FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_custos_user_id    ON public.custos(user_id);
CREATE INDEX idx_custos_animal_id  ON public.custos(animal_id);
CREATE INDEX idx_custos_fazenda_id ON public.custos(fazenda_id);
CREATE INDEX idx_custos_data       ON public.custos(data_custo DESC);


-- ── 6. FUNÇÃO: calcular GMD de um animal ─────────────────────
CREATE OR REPLACE FUNCTION public.calcular_gmd(p_animal_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_primeira  pesagens%ROWTYPE;
  v_ultima    pesagens%ROWTYPE;
  v_dias      INTEGER;
  v_gmd       NUMERIC;
BEGIN
  SELECT * INTO v_primeira
  FROM public.pesagens
  WHERE animal_id = p_animal_id
  ORDER BY data_pesagem ASC
  LIMIT 1;

  SELECT * INTO v_ultima
  FROM public.pesagens
  WHERE animal_id = p_animal_id
  ORDER BY data_pesagem DESC
  LIMIT 1;

  IF v_primeira.id IS NULL OR v_ultima.id IS NULL OR v_primeira.id = v_ultima.id THEN
    RETURN NULL;
  END IF;

  v_dias := v_ultima.data_pesagem - v_primeira.data_pesagem;

  IF v_dias <= 0 THEN
    RETURN NULL;
  END IF;

  v_gmd := ((v_ultima.peso_kg - v_primeira.peso_kg) / v_dias) * 1000;

  RETURN ROUND(v_gmd, 0);
END;
$$;


-- ── 7. FUNÇÃO: status automático do animal ───────────────────
CREATE OR REPLACE FUNCTION public.status_animal(
  p_animal_id  UUID,
  p_meta_gmd   INTEGER DEFAULT 133
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_gmd         NUMERIC;
  v_peso_atual  NUMERIC;
  v_status      TEXT;
BEGIN
  v_gmd := public.calcular_gmd(p_animal_id);

  SELECT peso_kg INTO v_peso_atual
  FROM public.pesagens
  WHERE animal_id = p_animal_id
  ORDER BY data_pesagem DESC
  LIMIT 1;

  IF v_peso_atual IS NULL THEN
    RETURN 'sem_dados';
  END IF;

  -- Refugo: GMD muito abaixo por longo tempo
  IF v_gmd IS NOT NULL AND v_gmd < (p_meta_gmd * 0.7) THEN
    RETURN 'refugo';
  END IF;

  -- Pronto: atingiu 38kg ou mais
  IF v_peso_atual >= 38 THEN
    RETURN 'pronto';
  END IF;

  -- Atencao: GMD abaixo da meta
  IF v_gmd IS NOT NULL AND v_gmd < p_meta_gmd THEN
    RETURN 'atencao';
  END IF;

  RETURN 'normal';
END;
$$;


-- ── 8. UPDATED_AT automático ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_fazendas_updated_at
  BEFORE UPDATE ON public.fazendas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lotes_updated_at
  BEFORE UPDATE ON public.lotes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_animais_updated_at
  BEFORE UPDATE ON public.animais
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 9. Realtime ───────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.animais;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pesagens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custos;
