#!/usr/bin/env python3
"""
Standartlaşdırılmış Olimpiada Quiz Yaradıcısı:
Zəfər Olimpiadası (X, XI və digər siniflər üçün)
İstifadə: python3 create_grade_olympiad_quizzes.py --grade 9
"""
import argparse
import json
import subprocess
import sys

SUBJECTS = [
    "Azərbaycan dili",
    "Ədəbiyyat",
    "Riyaziyyat",
    "Fizika",
    "Kimya",
    "Biologiya",
    "Tarix",
    "Coğrafiya"
]

ROMAN_GRADES = {
    "1": "I", "2": "II", "3": "III", "4": "IV", "5": "V",
    "6": "VI", "7": "VII", "8": "VIII", "9": "IX", "10": "X", "11": "XI"
}

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"
ACCESS_PASSWORD = "parol"
DURATION = 40
DIFFICULTY = "medium"
PASS_PERCENTAGE = 60
EXAM_CATEGORY = "Olimpiada"

def sql_str(val):
    if val is None:
        return "NULL"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def sql_json(val):
    if val is None:
        return "NULL"
    escaped = json.dumps(val, ensure_ascii=False).replace("'", "''")
    return f"'{escaped}'::jsonb"

def main():
    parser = argparse.ArgumentParser(description="Create Olympiad Quizzes for a specific grade")
    parser.add_argument("--grade", required=True, help="Grade number, e.g. 9, 10, 11")
    parser.add_argument("--password", default=ACCESS_PASSWORD, help="Access password, default 'parol'")
    args = parser.parse_args()

    grade_num = args.grade.strip()
    roman = ROMAN_GRADES.get(grade_num, f"{grade_num}-cu")
    tag_name = f"{grade_num}-cu sinif"

    print(f"[*] Hazırlanır: Zəfər Olimpiadası ({roman} sinif), Tag: {tag_name}")

    sql_statements = ["BEGIN;"]

    for subject in SUBJECTS:
        title = f"Zəfər Olimpiadası ({roman} sinif) — {subject}"
        desc = f"{grade_num}-cu sinif şagirdləri üçün {subject} fənni üzrə Zəfər olimpiadası sınaq imtahanı (20 sual)."

        quiz_cte = f"""
WITH new_quiz AS (
    INSERT INTO quizzes (
        title, description, subject, grade, duration, difficulty,
        is_published, creator_id, access_password, pass_percentage,
        exam_category, show_feedback_after_test, allow_retakes,
        shuffle_questions, shuffle_answers
    ) VALUES (
        {sql_str(title)},
        {sql_str(desc)},
        {sql_str(subject)},
        {sql_str(grade_num)},
        {DURATION},
        {sql_str(DIFFICULTY)},
        true,
        {sql_str(CREATOR_ID)},
        {sql_str(args.password)},
        {PASS_PERCENTAGE},
        {sql_str(EXAM_CATEGORY)},
        true,
        true,
        false,
        true
    ) RETURNING id
),
bank_q AS (
    SELECT id, question_text, question_type, options, correct_answer,
           explanation, question_image_url, option_images,
           ROW_NUMBER() OVER (ORDER BY created_at, id) as rn
    FROM question_bank
    WHERE (
        category = {sql_str(subject)} 
        AND ({sql_str(tag_name)} = ANY(tags) OR tags IS NULL)
    )
    ORDER BY created_at, id
    LIMIT 20
)
INSERT INTO questions (
    quiz_id, question_text, question_type, options, correct_answer,
    explanation, question_image_url, option_images, order_index,
    bank_question_id, is_graded, shuffle_options
)
SELECT 
    new_quiz.id,
    bank_q.question_text,
    bank_q.question_type,
    bank_q.options,
    bank_q.correct_answer,
    bank_q.explanation,
    bank_q.question_image_url,
    bank_q.option_images,
    bank_q.rn,
    bank_q.id,
    true,
    true
FROM bank_q, new_quiz;
"""
        sql_statements.append(quiz_cte.strip())

    sql_statements.append("COMMIT;")
    full_sql = "\n\n".join(sql_statements)
    
    sql_path = f"/srv/quizspark-azeri/scripts/create_grade{grade_num}_zafar_olympiad.sql"
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"[✓] SQL faylı hazırlandı: {sql_path}")

if __name__ == "__main__":
    main()
