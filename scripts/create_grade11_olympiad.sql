BEGIN;

-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Azərbaycan dili
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Azərbaycan dili',
        '11-ci sinif şagirdləri üçün Azərbaycan dili fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Azərbaycan dili',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Azərbaycan dili'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Ədəbiyyat
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Ədəbiyyat',
        '11-ci sinif şagirdləri üçün Ədəbiyyat fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Ədəbiyyat',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Ədəbiyyat'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Riyaziyyat
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Riyaziyyat',
        '11-ci sinif şagirdləri üçün Riyaziyyat fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Riyaziyyat',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Riyaziyyat'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Fizika
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Fizika',
        '11-ci sinif şagirdləri üçün Fizika fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Fizika',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Fizika'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Kimya
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Kimya',
        '11-ci sinif şagirdləri üçün Kimya fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Kimya',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Kimya'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Biologiya
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Biologiya',
        '11-ci sinif şagirdləri üçün Biologiya fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Biologiya',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Biologiya'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Tarix
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Tarix',
        '11-ci sinif şagirdləri üçün Tarix fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Tarix',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Tarix'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (XI sinif) — Coğrafiya
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (XI sinif) — Coğrafiya',
        '11-ci sinif şagirdləri üçün Coğrafiya fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Coğrafiya',
        '11',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.category = 'Coğrafiya'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;

COMMIT;