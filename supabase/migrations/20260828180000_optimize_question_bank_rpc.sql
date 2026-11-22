-- Create optimized RPC function for Question Bank statistics
CREATE OR REPLACE FUNCTION public.get_question_bank_stats(p_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := COALESCE(p_user_id, auth.uid());
  v_total integer;
  v_this_week integer;
  v_categories jsonb;
  v_difficulties jsonb;
  v_types jsonb;
  v_blooms jsonb;
BEGIN
  -- Total questions count
  SELECT count(*) INTO v_total
  FROM public.question_bank
  WHERE (user_id = v_uid OR user_id IS NULL);

  -- This week questions count
  SELECT count(*) INTO v_this_week
  FROM public.question_bank
  WHERE (user_id = v_uid OR user_id IS NULL)
    AND created_at >= (now() - interval '7 days');

  -- Category counts
  SELECT COALESCE(jsonb_object_agg(COALESCE(category, 'Kateqoriyasız'), cnt), '{}'::jsonb)
  INTO v_categories
  FROM (
    SELECT category, count(*) as cnt
    FROM public.question_bank
    WHERE (user_id = v_uid OR user_id IS NULL)
    GROUP BY category
  ) c;

  -- Difficulty counts
  SELECT COALESCE(jsonb_object_agg(COALESCE(difficulty, 'Təyin edilməyib'), cnt), '{}'::jsonb)
  INTO v_difficulties
  FROM (
    SELECT difficulty, count(*) as cnt
    FROM public.question_bank
    WHERE (user_id = v_uid OR user_id IS NULL)
    GROUP BY difficulty
  ) d;

  -- Question Type counts
  SELECT COALESCE(jsonb_object_agg(COALESCE(question_type, 'multiple_choice'), cnt), '{}'::jsonb)
  INTO v_types
  FROM (
    SELECT question_type, count(*) as cnt
    FROM public.question_bank
    WHERE (user_id = v_uid OR user_id IS NULL)
    GROUP BY question_type
  ) t;

  -- Bloom level counts
  SELECT COALESCE(jsonb_object_agg(COALESCE(bloom_level, 'Təyin edilməyib'), cnt), '{}'::jsonb)
  INTO v_blooms
  FROM (
    SELECT bloom_level, count(*) as cnt
    FROM public.question_bank
    WHERE (user_id = v_uid OR user_id IS NULL)
    GROUP BY bloom_level
  ) b;

  RETURN jsonb_build_object(
    'totalQuestions', v_total,
    'thisWeekCount', v_this_week,
    'categoryCounts', v_categories,
    'difficultyCounts', v_difficulties,
    'typeCounts', v_types,
    'bloomLevelCounts', v_blooms
  );
END;
$$;

-- Create optimized RPC function for unique categories
CREATE OR REPLACE FUNCTION public.get_unique_question_bank_categories(p_user_id uuid DEFAULT NULL)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := COALESCE(p_user_id, auth.uid());
  v_result text[];
BEGIN
  SELECT COALESCE(array_agg(DISTINCT category ORDER BY category), ARRAY[]::text[])
  INTO v_result
  FROM public.question_bank
  WHERE category IS NOT NULL
    AND (user_id = v_uid OR user_id IS NULL);

  RETURN v_result;
END;
$$;

-- Create optimized RPC function for detailed analytics
CREATE OR REPLACE FUNCTION public.get_question_bank_detailed_analytics(p_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid := COALESCE(p_user_id, auth.uid());
  v_stats jsonb;
  v_cat_list jsonb;
  v_total integer;
  v_total_attempts integer := 0;
  v_total_correct integer := 0;
BEGIN
  -- Get base stats
  v_stats := public.get_question_bank_stats(v_uid);
  v_total := COALESCE((v_stats->>'totalQuestions')::integer, 0);

  -- Category detailed items
  SELECT COALESCE(jsonb_agg(item), '[]'::jsonb)
  INTO v_cat_list
  FROM (
    SELECT 
      jsonb_build_object(
        'category', q_cat.cat,
        'questionCount', q_cat.total_cnt,
        'percentage', CASE WHEN v_total > 0 THEN ROUND((q_cat.total_cnt::numeric / v_total::numeric) * 100, 1) ELSE 0 END,
        'easyCount', q_cat.easy_cnt,
        'mediumCount', q_cat.medium_cnt,
        'hardCount', q_cat.hard_cnt,
        'attemptsCount', COALESCE(m.attempts, 0),
        'correctCount', COALESCE(m.correct, 0),
        'incorrectCount', GREATEST(0, COALESCE(m.attempts, 0) - COALESCE(m.correct, 0)),
        'accuracyPercentage', CASE WHEN COALESCE(m.attempts, 0) > 0 THEN ROUND((COALESCE(m.correct, 0)::numeric / m.attempts::numeric) * 100, 1) ELSE 0 END
      ) as item
    FROM (
      SELECT 
        COALESCE(category, 'Kateqoriyasız') as cat,
        count(*) as total_cnt,
        count(*) FILTER (WHERE lower(difficulty) = 'asan') as easy_cnt,
        count(*) FILTER (WHERE lower(difficulty) = 'çətin') as hard_cnt,
        count(*) FILTER (WHERE lower(difficulty) NOT IN ('asan', 'çətin') OR difficulty IS NULL) as medium_cnt
      FROM public.question_bank
      WHERE (user_id = v_uid OR user_id IS NULL)
      GROUP BY COALESCE(category, 'Kateqoriyasız')
    ) q_cat
    LEFT JOIN (
      SELECT 
        COALESCE(category, 'Kateqoriyasız') as cat,
        SUM(COALESCE(attempt_count, 0))::integer as attempts,
        SUM(COALESCE(correct_count, 0))::integer as correct
      FROM public.student_mastery
      GROUP BY COALESCE(category, 'Kateqoriyasız')
    ) m ON m.cat = q_cat.cat
    ORDER BY q_cat.total_cnt DESC
  ) t;

  -- Calculate totals
  SELECT 
    COALESCE(SUM((elem->>'attemptsCount')::integer), 0),
    COALESCE(SUM((elem->>'correctCount')::integer), 0)
  INTO v_total_attempts, v_total_correct
  FROM jsonb_array_elements(v_cat_list) AS elem;

  RETURN jsonb_build_object(
    'totalQuestions', v_total,
    'totalCategories', jsonb_array_length(v_cat_list),
    'thisWeekCount', COALESCE((v_stats->>'thisWeekCount')::integer, 0),
    'difficultyCounts', v_stats->'difficultyCounts',
    'bloomLevelCounts', v_stats->'bloomLevelCounts',
    'typeCounts', v_stats->'typeCounts',
    'categories', v_cat_list,
    'totalAttempts', v_total_attempts,
    'totalCorrect', v_total_correct,
    'totalIncorrect', GREATEST(0, v_total_attempts - v_total_correct),
    'overallAccuracy', CASE WHEN v_total_attempts > 0 THEN ROUND((v_total_correct::numeric / v_total_attempts::numeric) * 100, 1) ELSE 0 END
  );
END;
$$;

-- Ensure indexes for question_bank_shares
CREATE INDEX IF NOT EXISTS idx_qbs_question_shared ON public.question_bank_shares (question_id, shared_with);
