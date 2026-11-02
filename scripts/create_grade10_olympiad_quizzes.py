#!/usr/bin/env python3
import json
import subprocess

SUBJECT_TITLES = [
    ("Azərbaycan dili", "Zəfər Olimpiadası (X sinif) — Azərbaycan dili"),
    ("Ədəbiyyat", "Zəfər Olimpiadası (X sinif) — Ədəbiyyat"),
    ("Riyaziyyat", "Zəfər Olimpiadası (X sinif) — Riyaziyyat"),
    ("Fizika", "Zəfər Olimpiadası (X sinif) — Fizika"),
    ("Kimya", "Zəfər Olimpiadası (X sinif) — Kimya"),
    ("Biologiya", "Zəfər Olimpiadası (X sinif) — Biologiya"),
    ("Tarix", "Zəfər Olimpiadası (X sinif) — Tarix"),
    ("Coğrafiya", "Zəfər Olimpiadası (X sinif) — Coğrafiya"),
]

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"
ACCESS_PASSWORD = "parol"
GRADE = "10"
DURATION = 40
DIFFICULTY = "medium"
PASS_PERCENTAGE = 60
EXAM_CATEGORY = "Olimpiada"

def get_questions_mapping():
    cmd = ['docker', 'exec', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', 
    '''SELECT json_build_object('id', id, 'category', category, 'text', question_text) 
    FROM question_bank 
    WHERE created_at >= '2026-10-31 12:06:00' 
    ORDER BY created_at, id;''']

    res = subprocess.run(cmd, capture_output=True, text=True)
    items = [json.loads(line) for line in res.stdout.strip().split('\n') if line]

    def get_subject(it):
        cid = it['id']
        cat = it['category']
        txt = it['text']
        
        if cid in ['0b36bc0a-918d-4753-a291-b5752c65207c', '5b0bb821-df26-4169-a86a-acdf051ba061', '247b650f-800b-410a-a03c-6eafb7fafcc8', 'ba4a45be-851a-45ba-8d5d-7a443de4b48d']:
            return 'Azərbaycan dili'
        if cid in ['67a3fd1c-ac71-43a5-9859-7076c3bb6f86', '72b54e45-428e-49b6-9dd8-eef9e3961929']:
            return 'Ədəbiyyat'
        if cid in ['038b486f-2b21-43d2-b895-588da757b45b', '565f3ae5-8a14-4bbb-8332-e28aedf7a9b4']:
            return 'Coğrafiya'
        if cid in ['d43cd113-c5ee-48a5-adca-9d127db992a1', 'e382a4be-2c1a-44e1-a526-321cb94eef92', '25503c13-6094-482c-ac3a-8568b94b4906', '9e29f8a7-2401-4345-8167-c43be1d85daf']:
            return 'Tarix'
        if cid in ['c9ba1660-2e0d-468f-b001-5146ea08329e']:
            return 'Biologiya'
            
        if cat in ['Riyaziyyat', 'Fizika', 'Kimya', 'Coğrafiya']:
            return cat
            
        if any(w in txt for w in ['Ən ideal insan', 'omonim', 'üslub', 'leksik norma', 'mürəkkəb cümlə', 'numerativ', 'Yazının', 'Buğa bürcünü', 'əlavə nəyə aiddir', 'Dilə aid', 'isdirahət']):
            return 'Azərbaycan dili'
        if any(w in txt for w in ['Guş qıl', 'H.Cavid', 'obrazların danışıq', 'Yanıltmaclar', 'Manqurt', 'Müsibəti-Fəxrəddin', 'Leyli və Məcnun', 'Nəsimi', 'N.Gəncəvi', 'Dədə Qorqud', 'M.P.Vaqif', 'Müşfiq', 'dastan yaradıcılığı', 'Yusif Sərrac', 'Azad hekayəsində', 'Çinar ömrü', 'Heydərbabaya', 'Namərd gülləsi', 'Qoca və dəniz']):
            return 'Ədəbiyyat'
        if any(w in txt for w in ['Qədim Roma', 'Şirvanşahlar', 'Mehranilər', 'Mezolit', 'ABŞ-də baş vermiş', 'Səbəb-nəticə', 'xanlıqlarını', 'XI əsrə aid memarlıq', 'monqol ağalığı', '1736-cı ildə', 'Osmanlı', 'XIX yüzilliyin 30-cu', 'Əhəmənilər', 'sülh konfransı', 'AXC-nin', 'partiya: - 1906', 'İngiltərə tarixi', 'Uyğunluq gözlənilmişdir:\n1. Şah İsmayıl']):
            return 'Tarix'
        if any(w in txt for w in ['parazitin', 'quşlar sinfinə', 'Tetraploid', 'meyvənin əmələ', 'krossinqover', 'qanun özünü təbii', 'əzələlərində vətər', 'bakteriya', 'Noxudun', 'mikozlara', 'Prokariot', 'genotipə', 'Endotoksinlərə', 'autosom', 'Ağız suyunun', 'Şereşevski', 'Təkamül baxımından', 'Hörümçəkdə', 'Daun sindromlu', 'genotipli fərdlərin']):
            return 'Biologiya'
        if any(w in txt for w in ['Tektonik', 'Palçıq vulkanları', 'Rütubətlilik', 'süxurlarının', 'q.u.-də', 'cavan dağları', 'dəmiryol xətlərinin', 'Doğru fikri müəyyən edin:\nA) Şor göllər', 'aqlomerasiyalarında', 'külək:', 'təbii artımı', 'Ştrixlənmiş ərazilər', 'mütləq hündürlüyünün', 'nisbi rütubətliyi', 'Kür çayının', 'Eyler-Venn diaqramına əsasən uyğunluğu müəyyən edin:\n![Eyler-Venn](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYgAAADACAY', 'Verilmiş diaqrama uyğun gələn', 'İqtisadi coğrafiyanın', 'zonal amil']):
            return 'Coğrafiya'
        if any(w in txt for w in ['metall', 'Reaksiyadan alınan', 'reaksiya', 'alkan', 'Alkinin', 'bromlu suyu', 'Amfoter', 'Heterogen', 'oksigen qazı', 'tsiklopentan']):
            return 'Kimya'
        if any(w in txt for w in ['hündürlükdən', 'ideal qaz', 'Kapilyar', 'Mayelərdə']):
            return 'Fizika'
        return 'UNKNOWN'

    mapping = {}
    for it in items:
        s = get_subject(it)
        mapping.setdefault(s, []).append(it['id'])

    return mapping

def main():
    mapping = get_questions_mapping()
    
    sql_statements = ["BEGIN;"]

    # 1. Update question_bank category and tags
    sql_statements.append("-- 1. Update categories and tags in question_bank for Grade 10")
    for subject, title in SUBJECT_TITLES:
        ids = mapping.get(subject, [])
        if not ids:
            continue
        ids_formatted = ", ".join(f"'{qid}'::uuid" for qid in ids)
        sql_statements.append(f"""
UPDATE public.question_bank
SET category = '{subject}',
    tags = ARRAY['10-cu sinif', '{subject}']
WHERE id IN ({ids_formatted});
""")

    # 2. Insert 8 Quizzes and questions
    sql_statements.append("-- 2. Create 8 Quizzes and insert questions")
    for subject, title in SUBJECT_TITLES:
        ids = mapping.get(subject, [])
        ids_formatted = ", ".join(f"'{qid}'::uuid" for qid in ids)
        desc = f"10-cu sinif şagirdləri üçün {subject} fənni üzrə olimpiada sınaq imtahanı (20 sual)."

        sql_statements.append(f"""
-- ========================================================
-- Quiz: {title} ({len(ids)} sual)
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
    WHERE qb.id IN ({ids_formatted})
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
    with open("/srv/quizspark-azeri/scripts/create_grade10_olympiad.sql", "w", encoding="utf-8") as f:
        f.write(full_sql)

    print("Generated SQL script: /srv/quizspark-azeri/scripts/create_grade10_olympiad.sql")

if __name__ == "__main__":
    main()
