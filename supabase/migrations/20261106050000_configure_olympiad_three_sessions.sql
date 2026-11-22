-- =================================================================
-- Zəfər Olimpiadası (Final) — 3 Seanslı Şifrə və Saat Bölgüsü
-- 1. I SESİYA: 10:30 – 12:30 -> Parol: alma18
--    - Riyaziyyat AYQ (8-9), Azərbaycan dili AYQ (8-9), Coğrafiya AYQ & YYQ
-- 2. II SESİYA: 13:00 – 15:00 -> Parol: armud12
--    - Riyaziyyat YYQ (10-11), Tarix AYQ & YYQ, Fizika AYQ & YYQ
-- 3. III SESİYA: 15:30 – 17:30 -> Parol: xurma82
--    - Azərbaycan dili YYQ (10-11), Kimya AYQ & YYQ, Biologiya AYQ & YYQ
-- =================================================================

BEGIN;

-- 1. final_olympiad_participants cədvəlinə seans sütunları
ALTER TABLE public.final_olympiad_participants 
ADD COLUMN IF NOT EXISTS session_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS session_time TEXT DEFAULT '10:30 – 12:30';

-- 2. Quiz şifrələrinin seanslara uyğun təyini
-- I SESİYA: alma18
UPDATE public.quizzes
SET access_password = 'alma18'
WHERE id IN (
  '4829380c-0d43-4cb9-afef-01ddc4bd9350', -- Riyaziyyat (AYQ / VIII-IX)
  '92eb6532-eafa-42ec-ac4b-f3234bd11c2f', -- Azərbaycan dili (AYQ / VIII-IX)
  'a8c79034-fcb4-4530-b937-21ec4a133d02', -- Coğrafiya (AYQ / VIII-IX)
  '4d27b049-a8e0-4041-9fb6-ce5852d09a03'  -- Coğrafiya (YYQ / X-XI)
);

-- II SESİYA: armud12
UPDATE public.quizzes
SET access_password = 'armud12'
WHERE id IN (
  'c6a1e226-2759-4640-bf46-798e229a9b9e', -- Riyaziyyat (YYQ / X-XI)
  '13c9f2a0-b0cb-4f35-918b-8c61e1dada03', -- Tarix (AYQ / VIII-IX)
  '469740c0-c64f-4890-add0-629661f77509', -- Tarix (YYQ / X-XI)
  'a625247c-3a35-4758-a81e-76784744c3f9', -- Fizika (AYQ / VIII-IX)
  '10410fe3-0ac1-48e6-aec8-c557bc5f0415'  -- Fizika (YYQ / X-XI)
);

-- III SESİYA: xurma82
UPDATE public.quizzes
SET access_password = 'xurma82'
WHERE id IN (
  'e79a2dcb-954f-4973-9564-5dc5e5c7112e', -- Azərbaycan dili (YYQ / X-XI)
  'd51c2166-a707-476c-8a8d-54452e9b9ad3', -- Kimya (AYQ / VIII-IX)
  'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d', -- Kimya (YYQ / X-XI)
  '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f', -- Biologiya (AYQ / VIII-IX)
  'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'  -- Biologiya (YYQ / X-XI)
);

-- 3. İştirakçıların seans nömrəsi və saatlarının yenilənməsi
UPDATE public.final_olympiad_participants p
SET 
  session_number = CASE 
    WHEN qz.title IN (
      'Riyaziyyat (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Azərbaycan dili (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Coğrafiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Coğrafiya (YYQ / X-XI) — Zəfər Olimpiadası (Final)'
    ) THEN 1
    WHEN qz.title IN (
      'Riyaziyyat (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
      'Tarix (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Tarix (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
      'Fizika (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Fizika (YYQ / X-XI) — Zəfər Olimpiadası (Final)'
    ) THEN 2
    ELSE 3
  END,
  session_time = CASE 
    WHEN qz.title IN (
      'Riyaziyyat (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Azərbaycan dili (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Coğrafiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Coğrafiya (YYQ / X-XI) — Zəfər Olimpiadası (Final)'
    ) THEN '10:30 – 12:30'
    WHEN qz.title IN (
      'Riyaziyyat (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
      'Tarix (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Tarix (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
      'Fizika (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
      'Fizika (YYQ / X-XI) — Zəfər Olimpiadası (Final)'
    ) THEN '13:00 – 15:00'
    ELSE '15:30 – 17:30'
  END
FROM public.quizzes qz
WHERE qz.id = p.target_quiz_id;

-- 4. get_final_participant_by_utis funksiyasının session_number və session_time qaytarması
CREATE OR REPLACE FUNCTION public.get_final_participant_by_utis(p_utis text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_clean TEXT;
    v_p RECORD;
    v_quiz_id UUID := NULL;
    v_quiz_title TEXT := NULL;
    v_quiz_duration INT := NULL;
    v_quiz_share_code TEXT := NULL;
    v_is_completed BOOLEAN := false;
    v_completed_score INT := NULL;
    v_completed_at TIMESTAMPTZ := NULL;
    v_active_attempt_id UUID := NULL;
    v_prof RECORD;
    v_session_num INT := 1;
    v_session_time TEXT := '10:30 – 12:30';
BEGIN
    v_clean := upper(trim(regexp_replace(COALESCE(p_utis, ''), '\D', '', 'g')));

    IF length(v_clean) <> 7 THEN
        RETURN jsonb_build_object(
            'found', false,
            'message', 'UTİS kodu 7 rəqəmdən ibarət olmalıdır.'
        );
    END IF;

    -- 1. final_olympiad_participants cədvəlindən axtarış
    SELECT * INTO v_p
    FROM public.final_olympiad_participants
    WHERE utis_code = v_clean
    LIMIT 1;

    IF FOUND THEN
        -- Əlaqəli quiz məlumatı
        IF v_p.target_quiz_id IS NOT NULL THEN
            SELECT id, title, duration, share_code
            INTO v_quiz_id, v_quiz_title, v_quiz_duration, v_quiz_share_code
            FROM public.quizzes
            WHERE id = v_p.target_quiz_id;
        END IF;

        -- Sessiya təyini
        v_session_num := COALESCE(v_p.session_number, 1);
        v_session_time := COALESCE(v_p.session_time, '10:30 – 12:30');

        -- İmtahan tamamlanıb ya yox yoxla
        IF v_p.user_id IS NOT NULL AND v_quiz_id IS NOT NULL THEN
            SELECT id, score, completed_at
            INTO v_active_attempt_id, v_completed_score, v_completed_at
            FROM public.quiz_attempts
            WHERE user_id = v_p.user_id 
              AND quiz_id = v_quiz_id 
              AND completed_at IS NOT NULL
            ORDER BY completed_at DESC
            LIMIT 1;

            IF v_active_attempt_id IS NOT NULL THEN
                v_is_completed := true;
            END IF;
        END IF;

        RETURN jsonb_build_object(
            'found', true,
            'source', 'final_participants',
            'participant_id', v_p.id,
            'utis_code', v_p.utis_code,
            'first_name', v_p.first_name,
            'last_name', v_p.last_name,
            'father_name', v_p.father_name,
            'full_name', v_p.full_name,
            'district', v_p.district,
            'school', v_p.school,
            'class_name', v_p.class_name,
            'grade_level', v_p.grade_level,
            'age_group', v_p.age_group,
            'raw_subject', v_p.raw_subject,
            'subject', v_p.subject,
            'target_quiz_id', v_quiz_id,
            'target_share_code', v_quiz_share_code,
            'quiz_title', v_quiz_title,
            'quiz_duration', v_quiz_duration,
            'session_number', v_session_num,
            'session_time', v_session_time,
            'is_completed', v_is_completed,
            'completed_score', v_completed_score,
            'completed_at', v_completed_at,
            'active_attempt_id', v_active_attempt_id
        );
    END IF;

    -- 2. Əgər final_olympiad_participants-də tapılmadısa, profiles cədvəlindən fallback
    SELECT user_id, full_name, school, grade, utis_code
    INTO v_prof
    FROM public.profiles
    WHERE utis_code = v_clean OR fin = v_clean
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'found', true,
            'source', 'profile_fallback',
            'utis_code', v_clean,
            'full_name', v_prof.full_name,
            'school', v_prof.school,
            'grade_level', CASE
                WHEN v_prof.grade ~ '^\d+' THEN substring(v_prof.grade from '^\d+')::int
                ELSE 9
            END,
            'age_group', CASE
                WHEN v_prof.grade ~ '^\d+' AND substring(v_prof.grade from '^\d+')::int IN (10, 11) THEN 'YYQ'
                ELSE 'AYQ'
            END,
            'subject', NULL,
            'target_quiz_id', NULL,
            'target_share_code', NULL,
            'session_number', 1,
            'session_time', '10:30 – 12:30'
        );
    END IF;

    RETURN jsonb_build_object(
        'found', false,
        'message', 'Bu UTİS kodu ilə iştirakçı tapılmadı.'
    );
END;
$function$;

COMMIT;
