-- ============================================================
-- Admin Stats Function — Ponto do Cordeiro V2
-- Retorna KPIs agregados sem expor dados individuais
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Apenas admins podem chamar esta função
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  SELECT json_build_object(

    -- ── Usuários ──────────────────────────────────────────
    'total_usuarios',
      (SELECT COUNT(*) FROM auth.users),

    'novos_este_mes',
      (SELECT COUNT(*) FROM auth.users
       WHERE created_at >= date_trunc('month', now())),

    'ativos_30_dias',
      (SELECT COUNT(DISTINCT user_id) FROM public.animais
       WHERE created_at >= now() - interval '30 days'
       UNION
       SELECT COUNT(DISTINCT user_id) FROM public.pesagens
       WHERE created_at >= now() - interval '30 days'
      ),

    'tempo_medio_uso_dias',
      (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (now() - created_at)) / 86400))
       FROM auth.users),

    -- ── Rebanho ───────────────────────────────────────────
    'total_animais',
      (SELECT COUNT(*) FROM public.animais),

    'animais_ativos',
      (SELECT COUNT(*) FROM public.animais WHERE status = 'ativo'),

    'total_pesagens',
      (SELECT COUNT(*) FROM public.pesagens),

    'total_lotes',
      (SELECT COUNT(*) FROM public.lotes WHERE ativo = true),

    'total_custos',
      (SELECT COUNT(*) FROM public.custos),

    'media_animais_por_usuario',
      (SELECT ROUND(AVG(cnt))
       FROM (
         SELECT user_id, COUNT(*) as cnt
         FROM public.animais
         WHERE status = 'ativo'
         GROUP BY user_id
       ) sub),

    -- ── Saúde do rebanho ──────────────────────────────────
    'total_alertas_custom',
      (SELECT COUNT(*) FROM public.alertas_custom WHERE resolvido = false),

    -- ── Geografia ─────────────────────────────────────────
    'usuarios_por_estado',
      (SELECT json_agg(row_to_json(t))
       FROM (
         SELECT estado, COUNT(*) as total
         FROM public.fazendas
         WHERE estado IS NOT NULL AND estado != ''
         GROUP BY estado
         ORDER BY total DESC
         LIMIT 10
       ) t),

    'top_cidades',
      (SELECT json_agg(row_to_json(t))
       FROM (
         SELECT cidade, estado, COUNT(*) as total
         FROM public.fazendas
         WHERE cidade IS NOT NULL AND cidade != ''
         GROUP BY cidade, estado
         ORDER BY total DESC
         LIMIT 5
       ) t),

    -- ── Engajamento por funcionalidade ────────────────────
    'uso_funcionalidades',
      json_build_object(
        'pesagens',    (SELECT COUNT(*) FROM public.pesagens),
        'custos',      (SELECT COUNT(*) FROM public.custos),
        'lotes',       (SELECT COUNT(*) FROM public.lotes),
        'alertas',     (SELECT COUNT(*) FROM public.alertas_custom),
        'animais',     (SELECT COUNT(*) FROM public.animais)
      ),

    -- ── Crescimento mensal (últimos 6 meses) ──────────────
    'novos_por_mes',
      (SELECT json_agg(row_to_json(t))
       FROM (
         SELECT
           TO_CHAR(DATE_TRUNC('month', created_at), 'Mon/YY') as mes,
           COUNT(*) as novos
         FROM auth.users
         WHERE created_at >= now() - interval '6 months'
         GROUP BY DATE_TRUNC('month', created_at)
         ORDER BY DATE_TRUNC('month', created_at)
       ) t),

    -- ── Usuários mais ativos (top 10 por animais) ─────────
    'top_usuarios',
      (SELECT json_agg(row_to_json(t))
       FROM (
         SELECT
           u.email,
           u.raw_user_meta_data->>'full_name' as nome,
           COUNT(a.id) as animais,
           f.cidade,
           f.estado,
           u.created_at
         FROM auth.users u
         LEFT JOIN public.fazendas f ON f.user_id = u.id
         LEFT JOIN public.animais a ON a.user_id = u.id AND a.status = 'ativo'
         GROUP BY u.id, u.email, u.raw_user_meta_data, f.cidade, f.estado, u.created_at
         ORDER BY animais DESC
         LIMIT 10
       ) t),

    -- ── Timestamp ─────────────────────────────────────────
    'gerado_em', now()

  ) INTO v_result;

  RETURN v_result;
END;
$$;
