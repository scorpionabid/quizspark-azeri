#!/usr/bin/env python3
"""
VIII sinif Zəfər Olimpiadası hazırlıq və icra skripti.
1. question_bank-dakı 156 sualın təsnifatı və şəkillərin ayrılması
2. 8 Zəfər Olimpiadası quizinin yaradılması və sualların bağlanması
"""
import json
import re
import subprocess
import sys

SUBJECT_INDICES = {
    'Azərbaycan dili': [2, 3, 4, 5, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25],
    'Riyaziyyat': [1, 6, 10, 11, 19, 20, 26, 27, 28, 29, 30, 33, 36, 37, 41, 42, 47, 48, 49, 50],
    'Fizika': [31, 32, 34, 35, 38, 39, 40, 43, 44, 45, 46, 51, 53, 56, 57, 64, 67, 71, 74, 75],
    'Kimya': [52, 54, 55, 58, 59, 60, 61, 62, 63, 65, 66, 68, 69, 70, 72, 73, 76, 90, 93],
    'Biologiya': [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 91, 92, 94, 95, 96, 98, 99, 100],
    'Coğrafiya': [87, 97, 101, 102, 103, 104, 105, 107, 108, 111, 112, 114, 116, 118, 120, 121, 123, 124, 125],
    'Tarix': [106, 109, 110, 113, 115, 117, 119, 122, 128, 129, 130, 132, 135, 137, 138, 144, 145, 146, 147, 149],
    'Ədəbiyyat': [126, 127, 131, 133, 134, 136, 139, 140, 141, 142, 143, 148, 150, 151, 152, 153, 154, 155, 156]
}

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"
ACCESS_PASSWORD = "parol"
GRADE = "8"
ROMAN_GRADE = "VIII"
DURATION = 40
PASS_PERCENTAGE = 60
DIFFICULTY = "medium"
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

def generate_sql():
    cmd = ['docker', 'exec', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', 
    '''SELECT json_build_object('idx', row_number() over (order by created_at, id), 'id', id, 'text', question_text, 'type', question_type, 'options', options, 'answer', correct_answer, 'explanation', explanation, 'img_url', question_image_url) 
    FROM question_bank 
    WHERE created_at >= '2026-10-31 12:30:00' 
    ORDER BY created_at, id;''']

    res = subprocess.run(cmd, capture_output=True, text=True)
    items = [json.loads(line) for line in res.stdout.strip().split('\n') if line]

    if len(items) != 156:
        print(f"Xəta: 156 sual gözlənilirdi, {len(items)} tapıldı!")
        sys.exit(1)

    items_by_idx = {it['idx']: it for it in items}

    statements = ["BEGIN;"]

    # 1. Update question_bank with clean text, image_url, category and tags
    statements.append("-- 1. Update question_bank classification and image separation")
    
    img_regex = re.compile(r'!\[([^\]]*)\]\((data:image\/[^;]+;base64,[^)]+)\)')

    for subject, indices in SUBJECT_INDICES.items():
        tag_sql = f"ARRAY['8-ci sinif', {sql_str(subject)}]"
        for i, idx in enumerate(indices, 1):
            it = items_by_idx[idx]
            cid = it['id']
            txt = it['text']
            img_url = it['img_url']

            match = img_regex.search(txt)
            if match:
                img_url = match.group(2)
                clean_text = img_regex.sub('', txt).strip()
            else:
                clean_text = txt

            statements.append(f"""
UPDATE question_bank 
SET category = {sql_str(subject)},
    tags = {tag_sql},
    question_text = {sql_str(clean_text)},
    question_image_url = {sql_str(img_url)}
WHERE id = {sql_str(cid)};
""".strip())

    # 2. Insert Quizzes and questions
    statements.append("\n-- 2. Insert 8 Quizzes and questions")

    for subject, indices in SUBJECT_INDICES.items():
        q_count = len(indices)
        title = f"Zəfər Olimpiadası ({ROMAN_GRADE} sinif) — {subject}"
        desc = f"8-ci sinif şagirdləri üçün {subject} fənni üzrə Zəfər olimpiadası sınaq imtahanı ({q_count} sual)."

        quiz_cte = f"""
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
        {sql_str(CREATOR_ID)}::uuid,
        {sql_str(title)},
        {sql_str(desc)},
        {sql_str(subject)},
        {sql_str(GRADE)},
        {sql_str(DIFFICULTY)},
        {DURATION},
        true,
        true,
        {PASS_PERCENTAGE},
        {sql_str(ACCESS_PASSWORD)},
        {sql_str(EXAM_CATEGORY)},
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    ) RETURNING id
)
INSERT INTO questions (
    quiz_id, question_text, question_type, options, correct_answer,
    explanation, question_image_url, order_index,
    bank_question_id, is_graded, shuffle_options
)
"""
        values_list = []
        for order_idx, q_idx in enumerate(indices, 1):
            it = items_by_idx[q_idx]
            txt = it['text']
            img_url = it['img_url']
            match = img_regex.search(txt)
            if match:
                img_url = match.group(2)
                clean_text = img_regex.sub('', txt).strip()
            else:
                clean_text = txt

            val = f"""(
    (SELECT id FROM new_quiz),
    {sql_str(clean_text)},
    {sql_str(it['type'])},
    {sql_json(it['options'])},
    {sql_str(it['answer'])},
    {sql_str(it['explanation'])},
    {sql_str(img_url)},
    {order_idx},
    {sql_str(it['id'])},
    true,
    true
)"""
            values_list.append(val)

        quiz_sql = quiz_cte + "VALUES\n" + ",\n".join(values_list) + ";"
        statements.append(quiz_sql.strip())

    statements.append("\nCOMMIT;")
    full_sql = "\n\n".join(statements)

    out_file = "/srv/quizspark-azeri/scripts/create_grade8_zafar_olympiad.sql"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"[✓] Tam SQL faylı uğurla yaradıldı: {out_file} ({len(full_sql)} bayt)")

if __name__ == '__main__':
    generate_sql()
