#!/usr/bin/env python3
"""
IX sinif Zəfər Olimpiadası hazırlıq və icra skripti.
1. question_bank-dakı 160 sualın təsnifatı və şəkillərin ayrılması
2. 8 Zəfər Olimpiadası quizinin yaradılması və sualların bağlanması
"""
import json
import re
import subprocess
import sys

SUBJECT_INDICES = {
    'Azərbaycan dili': [3, 4, 5, 6, 7, 8, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    'Riyaziyyat': [1, 2, 9, 11, 12, 26, 27, 30, 33, 34, 36, 37, 40, 41, 42, 43, 44, 45, 48, 49],
    'Fizika': [28, 29, 31, 32, 35, 38, 39, 46, 47, 50, 55, 56, 58, 59, 60, 64, 65, 67, 68, 70],
    'Kimya': [51, 52, 53, 54, 57, 61, 62, 63, 66, 69, 71, 72, 73, 74, 75, 78, 87, 90, 97, 99],
    'Biologiya': [76, 77, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 91, 92, 93, 94, 95, 96, 98, 100],
    'Coğrafiya': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 114, 115, 117, 118, 119, 120, 121, 123, 124],
    'Tarix': [112, 113, 116, 122, 125, 126, 127, 128, 130, 131, 133, 134, 136, 138, 140, 141, 144, 146, 148, 150],
    'Ədəbiyyat': [129, 132, 135, 137, 139, 142, 143, 145, 147, 149, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160]
}

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"
ACCESS_PASSWORD = "parol"
GRADE = "9"
ROMAN_GRADE = "IX"
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
    WHERE created_at >= '2026-10-31 12:26:00' AND created_at < '2026-10-31 12:30:00'
    ORDER BY created_at, id;''']

    res = subprocess.run(cmd, capture_output=True, text=True)
    items = [json.loads(line) for line in res.stdout.strip().split('\n') if line]

    if len(items) != 160:
        print(f"Xəta: 160 sual gözlənilirdi, {len(items)} tapıldı!")
        sys.exit(1)

    items_by_idx = {it['idx']: it for it in items}

    statements = ["BEGIN;"]

    # 1. Update question_bank with clean text, image_url, category and tags
    statements.append("-- 1. Update question_bank classification and image separation")
    
    img_regex = re.compile(r'!\[([^\]]*)\]\((data:image\/[^;]+;base64,[^)]+)\)')

    for subject, indices in SUBJECT_INDICES.items():
        tag_sql = f"ARRAY['9-cu sinif', {sql_str(subject)}]"
        for i, idx in enumerate(indices, 1):
            it = items_by_idx[idx]
            cid = it['id']
            txt = it['text']
            img_url = it['img_url']

            # Check if there is an embedded base64 image in markdown
            match = img_regex.search(txt)
            if match:
                img_url = match.group(2)
                # Clean text: remove markdown image link
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
        title = f"Zəfər Olimpiadası ({ROMAN_GRADE} sinif) — {subject}"
        desc = f"9-cu sinif şagirdləri üçün {subject} fənni üzrə Zəfər olimpiadası sınaq imtahanı (20 sual)."

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

    out_file = "/srv/quizspark-azeri/scripts/create_grade9_zafar_olympiad.sql"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"[✓] Tam SQL faylı uğurla yaradıldı: {out_file} ({len(full_sql)} bayt)")

if __name__ == '__main__':
    generate_sql()
