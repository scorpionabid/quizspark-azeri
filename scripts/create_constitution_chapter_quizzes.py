#!/usr/bin/env python3
"""
Creates chapter-by-chapter quizzes for the Constitution of the Republic of Azerbaijan.
Classifies all 507 Constitution questions into 11 coherent, article-based quizzes.
Applies:
- duration = 0 (No time limit)
- show_feedback = true
- feedback_timing = 'immediate' (instant answer and legal explanation)
- shuffle_questions = false (orderly, pedagogical article sequence)
- questions_per_page = 1
- allow_backtracking = true
- allow_bookmarks = true
- subject = 'Hüquq'
- exam_category = 'Dövlət Qulluğu'
"""

import json
import re
import subprocess
import uuid

CREATOR_ID = "81cebd9d-586b-4460-8615-6cb0ed9d1094"

QUIZ_DEFS = [
    {
        "key": "q1",
        "title": "AR Konstitusiyası — 1. Preambula və Dövlətin Əsasları (Fəsil 1-2)",
        "description": "Preambula, I Fəsil (Xalq hakimiyyəti, Maddə 1-6) və II Fəsil (Dövlətin əsasları, Maddə 7-23).",
        "difficulty": "medium",
        "min_m": 1,
        "max_m": 23,
    },
    {
        "key": "q2",
        "title": "AR Konstitusiyası — 2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 1/2: Maddə 24-45)",
        "description": "Bərabərlik, Yaşamaq, Azadlıq, Mülkiyyət, Şəxsi toxunulmazlıq, Nikah, Əmək, Sosial təminat, Təhsil hüquqları.",
        "difficulty": "medium",
        "min_m": 24,
        "max_m": 45,
    },
    {
        "key": "q3",
        "title": "AR Konstitusiyası — 2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 2/2: Maddə 46-71)",
        "description": "Vicdan azadlığı, Müraciət, Birləşmək, Seçki, Məhkəmə təminatı, Təqsirsizlik prezumpsiyası, Hüquq və azadlıqların təminatı.",
        "difficulty": "hard",
        "min_m": 46,
        "max_m": 71,
    },
    {
        "key": "q4",
        "title": "AR Konstitusiyası — 3. Vətəndaşların Əsas Vəzifələri (Fəsil 4: Maddə 72-80)",
        "description": "Vergilər, Vətənə sədaqət, Dövlət rəmzlərinə hörmət, Vətəni müdafiə, Tarix və mədəniyyət abidələrinin qorunması, Ətraf mühitin qorunması.",
        "difficulty": "easy",
        "min_m": 72,
        "max_m": 80,
    },
    {
        "key": "q5",
        "title": "AR Konstitusiyası — 4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 1/2: Maddə 81-93)",
        "description": "Milli Məclisin say tərkibi, seçkilər, səlahiyyət müddəti, deputatlığa namizədlər, deputat statusu, toxunulmazlıq və sessiyalar.",
        "difficulty": "medium",
        "min_m": 81,
        "max_m": 93,
    },
    {
        "key": "q6",
        "title": "AR Konstitusiyası — 4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 2/2: Maddə 94-98-1)",
        "description": "MM-in müəyyən etdiyi ümumi qaydalar (Maddə 94), MM-in həll etdiyi məsələlər (Maddə 95), qanunvericilik təşəbbüsü və MM-in buraxılması.",
        "difficulty": "hard",
        "min_m": 94,
        "max_m": 98,
    },
    {
        "key": "q7",
        "title": "AR Konstitusiyası — 5. İcra Hakimiyyəti — Prezident (Hissə 1/2: Maddə 99-109)",
        "description": "İcra hakimiyyətinin mənsubiyyəti, Prezident seçkiləri, And, İmpiçment və AR Prezidentinin müstəsna səlahiyyətləri (Maddə 109).",
        "difficulty": "hard",
        "min_m": 99,
        "max_m": 109,
    },
    {
        "key": "q8",
        "title": "AR Konstitusiyası — 5. İcra Hakimiyyəti — Nazirlər Kabineti və Yerli İcra (Hissə 2/2: Maddə 110-124)",
        "description": "Qanunların imzalanması, hərbi və fövqəladə vəziyyət, Vitse-prezidentlər, Nazirlər Kabineti və Yerli icra hakimiyyəti.",
        "difficulty": "medium",
        "min_m": 110,
        "max_m": 124,
    },
    {
        "key": "q9",
        "title": "AR Konstitusiyası — 6. Məhkəmə Hakimiyyəti və Prokurorluq (Fəsil 7: Maddə 125-133)",
        "description": "Məhkəmə hakimiyyətinin həyata keçirilməsi, Hakimlərin statusu və müstəqilliyi, Konstitusiya Məhkəməsi, Ali Məhkəmə və Prokurorluq.",
        "difficulty": "hard",
        "min_m": 125,
        "max_m": 133,
    },
    {
        "key": "q10",
        "title": "AR Konstitusiyası — 7. Naxçıvan MR və Bələdiyyələr (Fəsil 8-9: Maddə 134-146)",
        "description": "Naxçıvan Muxtar Respublikasının hüquqi statusu, Ali Məclisi, Nazirlər Kabineti; Bələdiyyələrin təşkili və səlahiyyətləri.",
        "difficulty": "medium",
        "min_m": 134,
        "max_m": 146,
    },
    {
        "key": "q11",
        "title": "AR Konstitusiyası — 8. Qanunvericilik Sistemi və Əlavə/Dəyişikliklər (Fəsil 10-12 + Keçid)",
        "description": "Hüquqi aktların qüvvəsi və iyerarxiyası (Maddə 147-151), Konstitusiyada dəyişikliklər (Maddə 152-155), əlavələr (Maddə 156-158) və Keçid müddəaları.",
        "difficulty": "hard",
        "min_m": 147,
        "max_m": 158,
    },
]

def fetch_questions():
    cmd = '''docker exec -i supabase-db psql -U postgres -d postgres -t -A -c "
SELECT json_build_object(
    'id', id,
    'question_text', question_text,
    'question_type', question_type,
    'options', options,
    'correct_answer', correct_answer,
    'explanation', explanation,
    'title', title,
    'hint', hint,
    'question_image_url', question_image_url,
    'option_images', option_images,
    'media_type', media_type,
    'media_url', media_url,
    'accepted_answers', accepted_answers,
    'difficulty', difficulty
)
FROM question_bank 
WHERE category = 'Azərbaycan Respublikasının Konstitusiyası'
ORDER BY id;
"'''
    out = subprocess.check_output(cmd, shell=True).decode()
    questions = []
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            questions.append(json.loads(line))
        except Exception as e:
            print(f"JSON parse error on line: {e}")
    return questions

def classify_question(q):
    exp = (q.get("explanation") or "").lower()
    qtxt = (q.get("question_text") or "").lower()
    
    if "preambula" in exp or "i bölmə" in exp:
        return "q1"
    if "keçid" in exp or "kecid" in exp:
        return "q11"
    
    # search for article number in explanation
    nums = [int(n) for n in re.findall(r'\b\d+\b', (q.get("explanation") or "")[:70])]
    if nums:
        n = nums[0]
        if 1 <= n <= 23: return "q1"
        elif 24 <= n <= 45: return "q2"
        elif 46 <= n <= 71: return "q3"
        elif 72 <= n <= 80: return "q4"
        elif 81 <= n <= 93: return "q5"
        elif 94 <= n <= 98: return "q6"
        elif 99 <= n <= 109: return "q7"
        elif 110 <= n <= 124: return "q8"
        elif 125 <= n <= 133: return "q9"
        elif 134 <= n <= 146: return "q10"
        elif 147 <= n <= 158: return "q11"

    # fallback search in question text
    nums_q = [int(n) for n in re.findall(r'(\d+)[-– ]*c[iüı]', qtxt)]
    if nums_q:
        n = nums_q[0]
        if 1 <= n <= 23: return "q1"
        elif 24 <= n <= 45: return "q2"
        elif 46 <= n <= 71: return "q3"
        elif 72 <= n <= 80: return "q4"
        elif 81 <= n <= 93: return "q5"
        elif 94 <= n <= 98: return "q6"
        elif 99 <= n <= 109: return "q7"
        elif 110 <= n <= 124: return "q8"
        elif 125 <= n <= 133: return "q9"
        elif 134 <= n <= 146: return "q10"
        elif 147 <= n <= 158: return "q11"

    # contextual keywords
    if any(k in qtxt for k in ["milli məclis", "deputat", "qanunvericilik təşəbbüsü"]):
        return "q5"
    if any(k in qtxt for k in ["prezident", "nazirlər kabineti", "baş nazir", "vitse-prezident"]):
        return "q7"
    if any(k in qtxt for k in ["məhkəmə", "hakim", "prokuror"]):
        return "q9"
    if any(k in qtxt for k in ["bələdiyyə", "naxçıvan"]):
        return "q10"
    if any(k in qtxt for k in ["vəzifə", "vergi", "hərbi xidmət", "abidə"]):
        return "q4"
    if any(k in qtxt for k in ["hüquq", "azadlıq"]):
        return "q2"

    return "q1"

def escape_sql(val):
    if val is None:
        return "NULL"
    if isinstance(val, (dict, list)):
        return "'" + json.dumps(val, ensure_ascii=False).replace("'", "''") + "'::jsonb"
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, (int, float)):
        return str(val)
    return "'" + str(val).replace("'", "''") + "'"

def main():
    questions = fetch_questions()
    print(f"Fetched {len(questions)} questions from question_bank.")

    buckets = {qdef["key"]: [] for qdef in QUIZ_DEFS}
    for q in questions:
        key = classify_question(q)
        buckets[key].append(q)

    for qdef in QUIZ_DEFS:
        print(f"[{qdef['key']}] {qdef['title']}: {len(buckets[qdef['key']])} questions")

    sql_lines = ["BEGIN;\n"]

    # 1. Archive the old giant 507-question quiz
    sql_lines.append("""
-- 1. Archive old monolithic Constitution quiz
UPDATE quizzes 
SET is_archived = true, 
    is_public = false,
    title = 'AR Konstitusiyası (Arxivləşdirilmiş Tam Bank — 507 Sual)'
WHERE id = 'c0000000-0000-4000-a000-000000000002';

-- 2. Update balanced mock exam quiz settings
UPDATE quizzes
SET title = 'AR Konstitusiyası — 9. Yekun Sınaq İmtahanı (Balanslaşdırılmış 105 Sual)',
    duration = 0,
    show_feedback = true,
    feedback_timing = 'immediate',
    shuffle_questions = false,
    questions_per_page = 1,
    allow_backtracking = true,
    allow_bookmarks = true,
    show_question_nav = true,
    is_public = true,
    is_published = true,
    is_archived = false,
    subject = 'Hüquq',
    exam_category = 'Dövlət Qulluğu'
WHERE id = '5feef9ec-80cf-45c2-834b-41a224fe1ffb';
""")

    # 2. Insert new quizzes and their questions
    for qdef in QUIZ_DEFS:
        quiz_id = str(uuid.uuid4())
        qlist = buckets[qdef["key"]]
        
        sql_lines.append(f"""
-- Quiz: {qdef['title']}
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '{quiz_id}', '{CREATOR_ID}', {escape_sql(qdef['title'])}, {escape_sql(qdef['description'])},
    'Hüquq', {escape_sql(qdef['difficulty'])}, 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);
""")
        for idx, q in enumerate(qlist):
            qid = str(uuid.uuid4())
            bank_id = q["id"]
            qtxt = escape_sql(q["question_text"])
            qtype = escape_sql(q.get("question_type") or "multiple_choice")
            opts = escape_sql(q.get("options") or [])
            ans = escape_sql(q["correct_answer"])
            exp = escape_sql(q.get("explanation"))
            title = escape_sql(q.get("title"))
            hint = escape_sql(q.get("hint"))
            img_url = escape_sql(q.get("question_image_url"))
            opt_imgs = escape_sql(q.get("option_images") or [])
            mtype = escape_sql(q.get("media_type"))
            murl = escape_sql(q.get("media_url"))
            
            sql_lines.append(f"""
INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '{qid}', '{quiz_id}', '{bank_id}', {qtxt}, {qtype},
    {opts}, {ans}, {exp}, {idx}, {title}, {hint},
    {img_url}, {opt_imgs}, {mtype}, {murl}, true
);
""")

    sql_lines.append("COMMIT;\n")

    sql_file = "/srv/quizspark-azeri/scripts/create_constitution_chapter_quizzes.sql"
    with open(sql_file, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))

    print(f"Generated SQL file at {sql_file}")

if __name__ == "__main__":
    main()
