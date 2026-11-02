#!/usr/bin/env python3
import json
import subprocess
import sys

SUBJECTS = [
    ("Azərbaycan dili", "Zəfər Olimpiadası (XI sinif) — Azərbaycan dili"),
    ("Ədəbiyyat", "Zəfər Olimpiadası (XI sinif) — Ədəbiyyat"),
    ("Riyaziyyat", "Zəfər Olimpiadası (XI sinif) — Riyaziyyat"),
    ("Fizika", "Zəfər Olimpiadası (XI sinif) — Fizika"),
    ("Kimya", "Zəfər Olimpiadası (XI sinif) — Kimya"),
    ("Biologiya", "Zəfər Olimpiadası (XI sinif) — Biologiya"),
    ("Tarix", "Zəfər Olimpiadası (XI sinif) — Tarix"),
    ("Coğrafiya", "Zəfər Olimpiadası (XI sinif) — Coğrafiya"),
]

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"
ACCESS_PASSWORD = "parol"
GRADE = "11"
DURATION = 40
DIFFICULTY = "medium"
PASS_PERCENTAGE = 60
EXAM_CATEGORY = "Olimpiada"

def main():
    sql_statements = ["BEGIN;"]

    for subject, title in SUBJECTS:
        desc = f"11-ci sinif şagirdləri üçün {subject} fənni üzrə Zəfər olimpiadası sınaq imtahanı (20 sual)."
        
        # 1. Insert Quiz
        sql_statements.append(f"""
-- ========================================================
-- Quiz: {title}
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
        '{CREATOR_ID}'::uuid,
        '{title}',
        '{desc}',
        '{subject}',
        '{GRADE}',
        '{DIFFICULTY}',
        {DURATION},
        true,
        true,
        {PASS_PERCENTAGE},
        '{ACCESS_PASSWORD}',
        '{EXAM_CATEGORY}',
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
    WHERE qb.category = '{subject}'
      AND qb.created_at >= '2026-10-31 11:56:00'
      AND qb.user_id = '{CREATOR_ID}'::uuid
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
""")

    sql_statements.append("COMMIT;")
    
    full_sql = "\n".join(sql_statements)
    with open("/srv/quizspark-azeri/scripts/create_grade11_olympiad.sql", "w", encoding="utf-8") as f:
        f.write(full_sql)

    print("Generated SQL script: /srv/quizspark-azeri/scripts/create_grade11_olympiad.sql")

if __name__ == "__main__":
    main()
