-- ============================================================================
-- Final Olimpiada İştirakçıları və UTİS Giriş Dəstəyi
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.final_olympiad_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utis_code VARCHAR(50) NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT,
    full_name TEXT NOT NULL,
    district TEXT NOT NULL,
    school TEXT NOT NULL,
    class_name TEXT NOT NULL,
    grade_level INT NOT NULL,              -- 8, 9, 10, 11
    age_group VARCHAR(10) NOT NULL,        -- 'AYQ' və ya 'YYQ'
    raw_subject TEXT,                      -- Excel-dəki orijinal fənn
    subject TEXT,                          -- 7 əsas fəndən biri (və ya NULL)
    target_quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
    target_share_code VARCHAR(20),
    is_backup_entry BOOLEAN DEFAULT FALSE, -- Ehtiyat girişlə qeydiyyatdan keçibsə true
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_final_participants_utis ON public.final_olympiad_participants(utis_code);
CREATE INDEX IF NOT EXISTS idx_final_participants_district ON public.final_olympiad_participants(district);
CREATE INDEX IF NOT EXISTS idx_final_participants_quiz ON public.final_olympiad_participants(target_quiz_id);

-- RLS: Hər kəs UTİS ilə axtarış apara bilər, Adminlər hamısını görə bilər
ALTER TABLE public.final_olympiad_participants ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Allow public select on final_olympiad_participants' AND polrelid = 'public.final_olympiad_participants'::regclass) THEN
    CREATE POLICY "Allow public select on final_olympiad_participants" 
    ON public.final_olympiad_participants 
    FOR SELECT 
    USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Allow public insert backup on final_olympiad_participants' AND polrelid = 'public.final_olympiad_participants'::regclass) THEN
    CREATE POLICY "Allow public insert backup on final_olympiad_participants" 
    ON public.final_olympiad_participants 
    FOR INSERT 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Allow update for participants' AND polrelid = 'public.final_olympiad_participants'::regclass) THEN
    CREATE POLICY "Allow update for participants" 
    ON public.final_olympiad_participants 
    FOR UPDATE 
    USING (true);
  END IF;
END $$;

-- ============================================================================
-- RPC: get_final_participant_by_utis
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_final_participant_by_utis(p_utis TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean TEXT;
    v_p RECORD;
    v_quiz RECORD;
    v_attempt RECORD;
    v_active_attempt RECORD;
    v_prof RECORD;
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
            SELECT id, title, subject, grade, duration, question_count, share_code, access_password
            INTO v_quiz
            FROM public.quizzes
            WHERE id = v_p.target_quiz_id;
        END IF;

        -- Bitmiş imtahan cəhdi varmı?
        SELECT id, score, total_questions, completed_at, answers
        INTO v_attempt
        FROM public.quiz_attempts
        WHERE (
            (v_p.user_id IS NOT NULL AND user_id = v_p.user_id)
            OR user_id IN (SELECT user_id FROM public.profiles WHERE utis_code = v_clean OR fin = v_clean)
        )
        AND quiz_id = v_p.target_quiz_id
        AND completed_at IS NOT NULL
        ORDER BY completed_at DESC
        LIMIT 1;

        -- Davam edən imtahan cəhdi varmı?
        SELECT id, started_at
        INTO v_active_attempt
        FROM public.quiz_attempts
        WHERE (
            (v_p.user_id IS NOT NULL AND user_id = v_p.user_id)
            OR user_id IN (SELECT user_id FROM public.profiles WHERE utis_code = v_clean OR fin = v_clean)
        )
        AND quiz_id = v_p.target_quiz_id
        AND completed_at IS NULL
        ORDER BY started_at DESC
        LIMIT 1;

        RETURN jsonb_build_object(
            'found', true,
            'source', 'final_participants',
            'participant_id', v_p.id,
            'utis_code', v_p.utis_code,
            'full_name', v_p.full_name,
            'first_name', v_p.first_name,
            'last_name', v_p.last_name,
            'father_name', v_p.father_name,
            'district', v_p.district,
            'school', v_p.school,
            'class_name', v_p.class_name,
            'grade_level', v_p.grade_level,
            'age_group', v_p.age_group,
            'subject', v_p.subject,
            'raw_subject', v_p.raw_subject,
            'target_quiz_id', v_p.target_quiz_id,
            'target_share_code', COALESCE(v_quiz.share_code, v_p.target_share_code),
            'quiz_title', v_quiz.title,
            'quiz_duration', v_quiz.duration,
            'is_completed', (v_attempt.id IS NOT NULL),
            'completed_score', v_attempt.score,
            'completed_at', v_attempt.completed_at,
            'active_attempt_id', v_active_attempt.id
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
            'target_share_code', NULL
        );
    END IF;

    RETURN jsonb_build_object(
        'found', false,
        'message', 'Bu UTİS kodu ilə iştirakçı tapılmadı.'
    );
END;
$$;

-- ============================================================================
-- RPC: register_backup_olympiad_participant
-- ============================================================================
CREATE OR REPLACE FUNCTION public.register_backup_olympiad_participant(
    p_full_name TEXT,
    p_district TEXT,
    p_school TEXT,
    p_grade_level INT,
    p_subject TEXT,
    p_utis_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_utis TEXT;
    v_age_group VARCHAR(10);
    v_quiz RECORD;
    v_participant_id UUID;
    v_name_parts TEXT[];
    v_first_name TEXT := '';
    v_last_name TEXT := '';
    v_father_name TEXT := '';
BEGIN
    -- Yaş qrupunu təyin et
    IF p_grade_level IN (10, 11) THEN
        v_age_group := 'YYQ';
    ELSE
        v_age_group := 'AYQ';
    END IF;

    -- Ad və soyad hissələri
    v_name_parts := regexp_split_to_array(trim(p_full_name), '\s+');
    IF array_length(v_name_parts, 1) >= 1 THEN
        v_last_name := v_name_parts[1];
    END IF;
    IF array_length(v_name_parts, 1) >= 2 THEN
        v_first_name := v_name_parts[2];
    END IF;
    IF array_length(v_name_parts, 1) >= 3 THEN
        v_father_name := array_to_string(v_name_parts[3:], ' ');
    END IF;

    -- UTİS kodu yoxla və ya generasiya et
    v_clean_utis := upper(trim(regexp_replace(COALESCE(p_utis_code, ''), '\D', '', 'g')));
    IF length(v_clean_utis) <> 7 THEN
        -- Ehtiyat unikal kod: EHT + 6 rəqəm
        v_clean_utis := 'E' || lpad(floor(random() * 900000 + 100000)::text, 6, '0');
    END IF;

    -- Müvafiq Final Quizini tap
    SELECT id, title, subject, grade, duration, share_code
    INTO v_quiz
    FROM public.quizzes
    WHERE grade = v_age_group
      AND subject = p_subject
      AND title LIKE '%Zəfər Olimpiadası (Final)%'
    LIMIT 1;

    IF v_quiz IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Göstərilən fənn və yaş qrupu üçün final quizi tapılmadı.'
        );
    END IF;

    -- Cədvələ əlavə et və ya yenilə
    INSERT INTO public.final_olympiad_participants (
        utis_code,
        first_name,
        last_name,
        father_name,
        full_name,
        district,
        school,
        class_name,
        grade_level,
        age_group,
        raw_subject,
        subject,
        target_quiz_id,
        target_share_code,
        is_backup_entry
    ) VALUES (
        v_clean_utis,
        COALESCE(NULLIF(v_first_name, ''), trim(p_full_name)),
        COALESCE(NULLIF(v_last_name, ''), 'Şagird'),
        v_father_name,
        trim(p_full_name),
        trim(p_district),
        trim(p_school),
        p_grade_level::text || ' sinif',
        p_grade_level,
        v_age_group,
        p_subject,
        p_subject,
        v_quiz.id,
        v_quiz.share_code,
        true
    )
    ON CONFLICT (utis_code) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        district = EXCLUDED.district,
        school = EXCLUDED.school,
        grade_level = EXCLUDED.grade_level,
        age_group = EXCLUDED.age_group,
        subject = EXCLUDED.subject,
        target_quiz_id = EXCLUDED.target_quiz_id,
        target_share_code = EXCLUDED.target_share_code,
        is_backup_entry = true,
        updated_at = NOW()
    RETURNING id INTO v_participant_id;

    RETURN jsonb_build_object(
        'success', true,
        'participant_id', v_participant_id,
        'utis_code', v_clean_utis,
        'full_name', trim(p_full_name),
        'district', trim(p_district),
        'school', trim(p_school),
        'grade_level', p_grade_level,
        'age_group', v_age_group,
        'subject', p_subject,
        'target_quiz_id', v_quiz.id,
        'target_share_code', v_quiz.share_code,
        'quiz_title', v_quiz.title,
        'quiz_duration', v_quiz.duration
    );
END;
$$;
