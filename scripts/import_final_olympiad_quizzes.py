#!/usr/bin/env python3
"""
Zəfər Olimpiadası — Final Mərhələsi (AYQ və YYQ) İdxal və Quiz Yaradıcısı
Müəllif: Abid Ağayev (scorpionabid82@gmail.com / 81cebd9d-586b-4460-8615-6cb0ed9d1094)
"""
import os
import sys
import re
import glob
import json
import uuid
import random
import base64
import hashlib
import requests
import subprocess

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"
ACCESS_PASSWORD = "ZEFER_FINAL_2026"
DURATION = 40
DIFFICULTY = "hard"
PASS_PERCENTAGE = 60
EXAM_CATEGORY = "Olimpiada"

STORAGE_UPLOAD_URL = "http://127.0.0.1:8090/storage/v1/object/question-images/final_olympiad"
PUBLIC_URL_PREFIX = "https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM2MDA1MTQsImV4cCI6MjA4ODk2MDUxNH0.w1RU2ZEvkqGPUrrum3Mq0GP3cA41RzBsftpFq81Gx1Y"

BASE_DIR = "/srv/quizspark-azeri/imports/Imtahan_Store_Final_Import"
IMAGES_DIR = os.path.join(BASE_DIR, "images")

SUBJECT_MAP = {
    '01_AYQ_Final': {
        'AYQ_Azerbaycan_Dili.md': {'subject': 'Azərbaycan dili', 'grade': 'AYQ', 'title': 'Azərbaycan dili (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
        'AYQ_Riyaziyyat.md': {'subject': 'Riyaziyyat', 'grade': 'AYQ', 'title': 'Riyaziyyat (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
        'AYQ_Fizika.md': {'subject': 'Fizika', 'grade': 'AYQ', 'title': 'Fizika (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
        'AYQ_Kimya.md': {'subject': 'Kimya', 'grade': 'AYQ', 'title': 'Kimya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
        'AYQ_Biologiya.md': {'subject': 'Biologiya', 'grade': 'AYQ', 'title': 'Biologiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
        'AYQ_Tarix.md': {'subject': 'Tarix', 'grade': 'AYQ', 'title': 'Tarix (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
        'AYQ_Cografiya.md': {'subject': 'Coğrafiya', 'grade': 'AYQ', 'title': 'Coğrafiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)'},
    },
    '02_YYQ_Final': {
        'YYQ_Azerbaycan_Dili.md': {'subject': 'Azərbaycan dili', 'grade': 'YYQ', 'title': 'Azərbaycan dili (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
        'YYQ_Riyaziyyat.md': {'subject': 'Riyaziyyat', 'grade': 'YYQ', 'title': 'Riyaziyyat (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
        'YYQ_Fizika.md': {'subject': 'Fizika', 'grade': 'YYQ', 'title': 'Fizika (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
        'YYQ_Kimya.md': {'subject': 'Kimya', 'grade': 'YYQ', 'title': 'Kimya (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
        'YYQ_Biologiya.md': {'subject': 'Biologiya', 'grade': 'YYQ', 'title': 'Biologiya (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
        'YYQ_Tarix.md': {'subject': 'Tarix', 'grade': 'YYQ', 'title': 'Tarix (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
        'YYQ_Cografiya.md': {'subject': 'Coğrafiya', 'grade': 'YYQ', 'title': 'Coğrafiya (YYQ / X-XI) — Zəfər Olimpiadası (Final)'},
    }
}

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

def sql_array(val):
    if val is None:
        return "NULL"
    items = [f'"{str(v).replace(chr(34), chr(92)+chr(34))}"' for v in val]
    inner = ','.join(items)
    return f"'{{{inner}}}'::text[]"

def upload_images():
    print("[1/5] Şəkillər Supabase Storage-a yüklənir...")
    img_files = sorted(glob.glob(os.path.join(IMAGES_DIR, "*.png")))
    hash_to_url = {}
    
    headers = {
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "image/png",
        "x-upsert": "true"
    }
    
    for img_path in img_files:
        fname = os.path.basename(img_path)
        with open(img_path, "rb") as fp:
            data = fp.read()
        
        md5_hash = hashlib.md5(data).hexdigest()
        pub_url = f"{PUBLIC_URL_PREFIX}/{fname}"
        hash_to_url[md5_hash] = pub_url
        
        url = f"{STORAGE_UPLOAD_URL}/{fname}"
        resp = requests.post(url, headers=headers, data=data)
        if resp.status_code not in (200, 201):
            print(f"  [XƏTA] Şəkil yüklənə bilmədi: {fname} (Status: {resp.status_code})")
        else:
            print(f"  [+] {fname} -> {pub_url}")
            
    print(f"  Cəmi {len(hash_to_url)} şəkil bazaya hazırlandı.")
    return hash_to_url

def get_existing_share_codes():
    cmd = ["docker", "exec", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", 
           "SELECT share_code FROM quizzes WHERE share_code IS NOT NULL;"]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return set(line.strip() for line in res.stdout.split("\n") if line.strip())

def generate_unique_share_code(existing_codes):
    while True:
        code = str(random.randint(100000, 999999))
        if code not in existing_codes:
            existing_codes.add(code)
            return code

def parse_markdown_questions(filepath, hash_to_url):
    with open(filepath, "r", encoding="utf-8") as fp:
        content = fp.read()
        
    blocks = [b.strip() for b in re.split(r'\n---+\n', content) if b.strip()]
    questions = []
    
    for idx, b in enumerate(blocks):
        lines = b.split('\n')
        q_lines = []
        options_dict = {}
        ans_letter = None
        img_url = None
        category = None
        tags = []
        
        for l in lines:
            ls = l.strip()
            if not ls:
                if q_lines and not options_dict:
                    q_lines.append('')
                continue
            
            # Options A) ...
            opt_m = re.match(r'^([A-Ea-e])\)\s*(.+)$', ls)
            if opt_m:
                options_dict[opt_m.group(1).upper()] = opt_m.group(2).strip()
                continue
                
            # Cavab: C
            ans_m = re.match(r'^Cavab\s*:\s*([A-Ea-e])', ls)
            if ans_m:
                ans_letter = ans_m.group(1).upper()
                continue
                
            # Sekil: data:image/png;base64,...
            img_m = re.match(r'^Şəkil:\s*(data:image/[^;]+;base64,([A-Za-z0-9+/=]+))', ls)
            if img_m:
                b64 = img_m.group(2)
                raw = base64.b64decode(b64)
                h = hashlib.md5(raw).hexdigest()
                if h in hash_to_url:
                    img_url = hash_to_url[h]
                else:
                    print(f"  [XƏRDARLIQ] Hash uyğunsuzluğu: {os.path.basename(filepath)} Q{idx+1}")
                continue
                
            # Kateqoriya / Taqlar / Çətinlik
            cat_m = re.match(r'^Kateqoriya\s*:\s*(.+)$', ls)
            if cat_m:
                category = cat_m.group(1).strip()
                continue
                
            tag_m = re.match(r'^Taqlar\s*:\s*(.+)$', ls)
            if tag_m:
                tags = [t.strip() for t in tag_m.group(1).split(',') if t.strip()]
                continue
                
            if ls.startswith('Çətinlik:'):
                continue
                
            q_lines.append(ls)
            
        q_text = '\n'.join(q_lines).strip()
        # Clean heading Markdown prefixes: '# 1. ' or '# '
        q_text = re.sub(r'^#\s+', '', q_text)
        q_text = re.sub(r'^\d+[\.\)]\s*', '', q_text)
        
        ordered_opts = [options_dict.get(k, '') for k in ['A', 'B', 'C', 'D', 'E']]
        correct_answer_text = options_dict.get(ans_letter, '')
        
        questions.append({
            'order_index': idx + 1,
            'question_text': q_text,
            'options': ordered_opts,
            'correct_answer': correct_answer_text,
            'correct_letter': ans_letter,
            'image_url': img_url,
            'category': category,
            'tags': tags
        })
        
    return questions

def main():
    print("=" * 70)
    print("ZƏFƏR OLİMPİADASI FINAL MƏRHƏLƏSİ — İDXAL VƏ QUİZ YARADILMASI")
    print("=" * 70)
    
    # 1. Upload images
    hash_to_url = upload_images()
    
    # 2. Get existing share codes
    existing_share_codes = get_existing_share_codes()
    print(f"[2/5] Mövcud share_code-lar oxundu: {len(existing_share_codes)} ədəd.")
    
    # 3. Generate SQL script
    print("[3/5] İdxal SQL transaksiyası hazırlanır...")
    sql_lines = [
        "BEGIN;",
        "-- 1. Qəbələ turunun əvvəlki 32 quizini arxivləşdiririk",
        "UPDATE quizzes SET is_archived = true WHERE exam_category = 'Olimpiada' AND title LIKE '%Qəbələ%';"
    ]
    
    total_quizzes = 0
    total_questions = 0
    created_quiz_ids = []
    
    for group_folder, files_map in SUBJECT_MAP.items():
        folder_path = os.path.join(BASE_DIR, group_folder)
        for filename, meta in files_map.items():
            filepath = os.path.join(folder_path, filename)
            if not os.path.exists(filepath):
                print(f"[XƏTA] Fayl tapılmadı: {filepath}")
                sys.exit(1)
                
            parsed_questions = parse_markdown_questions(filepath, hash_to_url)
            if len(parsed_questions) != 20:
                print(f"[XƏTA] {filename} faylında 20 deyil, {len(parsed_questions)} sual tapıldı!")
                sys.exit(1)
                
            quiz_id = str(uuid.uuid4())
            share_code = generate_unique_share_code(existing_share_codes)
            title = meta['title']
            subject = meta['subject']
            grade = meta['grade']
            desc = f"{grade} (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün {subject} fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual)."
            
            sql_lines.append(f"\n-- ========================================================")
            sql_lines.append(f"-- QUIZ: {title} ({subject} - {grade})")
            sql_lines.append(f"-- ========================================================")
            
            quiz_insert = f"""
INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    {sql_str(quiz_id)}::uuid,
    {sql_str(CREATOR_ID)}::uuid,
    {sql_str(title)},
    {sql_str(desc)},
    {sql_str(subject)},
    {sql_str(grade)},
    {sql_str(DIFFICULTY)},
    {DURATION},
    20,
    {PASS_PERCENTAGE},
    {sql_str(EXAM_CATEGORY)},
    {sql_str(ACCESS_PASSWORD)},
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    {sql_str(share_code)},
    NOW(),
    NOW()
);"""
            sql_lines.append(quiz_insert)
            created_quiz_ids.append((quiz_id, title, subject, grade, share_code))
            total_quizzes += 1
            
            for q in parsed_questions:
                bank_q_id = str(uuid.uuid4())
                q_id = str(uuid.uuid4())
                
                # Tags
                tags = ['Zəfər Olimpiadası', 'Final', f'{grade} Sinif', subject]
                
                # Insert into question_bank
                qb_insert = f"""
INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    {sql_str(bank_q_id)}::uuid,
    {sql_str(CREATOR_ID)}::uuid,
    {sql_str(q['question_text'])},
    'multiple_choice',
    {sql_json(q['options'])},
    {sql_str(q['correct_answer'])},
    {sql_str(subject)},
    {sql_str(DIFFICULTY)},
    {sql_array(tags)},
    {sql_str(q['image_url'])},
    true,
    NOW(),
    NOW()
);"""
                sql_lines.append(qb_insert)
                
                # Insert into questions table (linked to quiz)
                q_insert = f"""
INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    {sql_str(q_id)}::uuid,
    {sql_str(quiz_id)}::uuid,
    {sql_str(q['question_text'])},
    'multiple_choice',
    {sql_json(q['options'])},
    {sql_str(q['correct_answer'])},
    {q['order_index']},
    {sql_str(bank_q_id)}::uuid,
    {sql_str(q['image_url'])},
    true,
    1,
    NOW()
);"""
                sql_lines.append(q_insert)
                total_questions += 1
                
    sql_lines.append("\nCOMMIT;")
    
    sql_file = "/srv/quizspark-azeri/scripts/import_final_olympiad.sql"
    with open(sql_file, "w", encoding="utf-8") as fp:
        fp.write("\n".join(sql_lines))
        
    print(f"  SQL faylı saxlanıldı: {sql_file}")
    print(f"  Cəmi {total_quizzes} quiz və {total_questions} sual icraya hazırdır.")
    
    # 4. Execute SQL via psql in Docker
    print("[4/5] SQL transaksiyası PostgreSQL bazasında icra olunur...")
    cmd = ["docker", "exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres"]
    with open(sql_file, "rb") as fp:
        res = subprocess.run(cmd, stdin=fp, capture_output=True, text=True)
        
    if res.returncode != 0:
        print("[XƏTA] psql icra olunarkən xəta baş verdi:")
        print(res.stderr)
        sys.exit(1)
    else:
        print("  SQL transaksiyası uğurla tamamlandı!")
        
    # 5. Verification
    print("[5/5] Bazada keyfiyyət və dəqiqlik yoxlanışı aparılır...")
    verify_cmd = ["docker", "exec", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-c", """
SELECT 
    z.grade as qrup,
    z.subject,
    z.title,
    z.share_code,
    z.access_password,
    z.question_count,
    COUNT(q.id) as real_questions,
    COUNT(CASE WHEN q.question_image_url IS NOT NULL THEN 1 END) as images_count
FROM quizzes z
LEFT JOIN questions q ON q.quiz_id = z.id
WHERE z.creator_id = '81cebd9d-586b-4460-8615-6cb0ed9d1094'
  AND z.access_password = 'ZEFER_FINAL_2026'
GROUP BY z.grade, z.subject, z.title, z.share_code, z.access_password, z.question_count, z.created_at
ORDER BY z.grade, z.subject;
"""]
    v_res = subprocess.run(verify_cmd, capture_output=True, text=True, check=True)
    print("\n" + v_res.stdout)
    
    print("=" * 70)
    print("BÜTÜN 14 FƏNN QUİZİ VƏ 280 SUAL UĞURLA YARADILDI VƏ BAZAYA ƏLAVƏ EDİLDİ!")
    print("=" * 70)

if __name__ == "__main__":
    main()
