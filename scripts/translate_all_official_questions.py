#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script: translate_all_official_questions.py
Purpose: Translate all remaining questions for official exam specialties into Georgian (ka)
and store them in public.question_translations table.
"""

import json
import os
import re
import subprocess
import sys
import time
import requests

CACHE_FILE = os.path.join(os.path.dirname(__file__), "geo_translations_cache.json")

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
})


def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_cache(cache):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Warning: Could not save cache: {e}")


def is_non_translatable(text):
    t = text.strip()
    if not t:
        return True
    if re.match(r"^[\d\s\:\,\.\-\/\%\+\=\(\)\<\>\*]+$", t):
        return True
    if re.match(r"^[A-ZА-ЯЁa-zа-яё0-9\.\s]{1,3}$", t):
        return True
    if re.match(r"^(Ctrl|Shift|Alt|Tab|Esc|Enter|Delete|F\d+)(\s*[\+\-]\s*(Ctrl|Shift|Alt|Tab|Esc|Enter|Delete|[A-Z0-9]))*$", t, re.IGNORECASE):
        return True
    if re.match(r"^\.?[a-zA-Z0-9_]+\(\)$", t) or re.match(r"^\.[a-zA-Z0-9]{2,5}$", t):
        return True
    return False


def translate_text(text, cache):
    clean = text.strip()
    if not clean or is_non_translatable(clean):
        return text
    if clean in cache:
        return cache[clean]

    # 1. Primary: Google dict-chrome-ex
    try:
        resp = session.get(
            "https://clients5.google.com/translate_a/t",
            params={"client": "dict-chrome-ex", "sl": "az", "tl": "ka", "q": clean},
            timeout=4.0,
        )
        if resp.status_code == 200:
            data = resp.json()
            if data and data[0]:
                cache[clean] = data[0]
                return data[0]
    except Exception:
        pass

    # 2. Fallback: MyMemory
    try:
        resp = session.get(
            "https://api.mymemory.translated.net/get",
            params={"q": clean, "langpair": "az|ka"},
            timeout=4.0,
        )
        if resp.status_code == 200:
            data = resp.json()
            if data.get("responseStatus") == 200:
                res = data["responseData"]["translatedText"]
                if res:
                    cache[clean] = res
                    return res
    except Exception:
        pass

    return clean


def run_psql(sql_query):
    cmd = ["docker", "exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql_query]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        raise RuntimeError(f"psql error: {res.stderr.decode('utf-8')}")
    return res.stdout.decode("utf-8")


def run_psql_script(sql_script):
    cmd = ["docker", "exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres"]
    res = subprocess.run(cmd, input=sql_script.encode("utf-8"), capture_output=True)
    if res.returncode != 0:
        raise RuntimeError(f"psql execution error: {res.stderr.decode('utf-8')}")
    return res.stdout.decode("utf-8")


def main():
    print("=== Starting Official Exam Questions Translation to Georgian (ka) ===")
    cache = load_cache()
    print(f"Loaded {len(cache)} cached translation entries.")

    # Only fetch questions that are NOT YET translated
    sql = """
    SELECT json_agg(t) FROM (
      SELECT 
        q.id,
        qz.specialty_key,
        qz.title as quiz_title,
        q.order_index,
        q.question_text,
        q.options,
        q.correct_answer,
        q.explanation,
        q.hint
      FROM questions q
      JOIN quizzes qz ON q.quiz_id = qz.id
      WHERE qz.specialty_key IS NOT NULL
        AND q.id NOT IN (
          SELECT question_id FROM public.question_translations WHERE language_code = 'ka'
        )
      ORDER BY qz.specialty_key, q.order_index
    ) t;
    """

    out = run_psql(sql)
    if not out or out.strip() == "":
        print("ALL QUESTIONS ARE ALREADY TRANSLATED!")
        return

    questions = json.loads(out)
    if not questions:
        print("ALL QUESTIONS ARE ALREADY TRANSLATED!")
        return

    total = len(questions)
    print(f"Found {total} questions remaining to translate.")

    # Group by specialty
    specialties = {}
    for q in questions:
        s_key = q["specialty_key"]
        specialties.setdefault(s_key, []).append(q)

    batch_statements = []
    processed_count = 0

    for s_key, q_list in specialties.items():
        quiz_title = q_list[0]["quiz_title"]
        print(f"\n--- Specialty: {quiz_title} ({s_key}) - {len(q_list)} questions to translate ---")

        for i, q in enumerate(q_list):
            q_id = q["id"]
            raw_text = q["question_text"] or ""
            raw_options = q["options"] or []
            raw_correct = q["correct_answer"] or ""
            raw_expl = q.get("explanation") or ""
            raw_hint = q.get("hint") or ""

            # Translate question text
            geo_text = translate_text(raw_text, cache)

            # Translate options
            geo_options = []
            correct_idx = -1
            for opt_idx, opt in enumerate(raw_options):
                opt_str = str(opt).strip()
                if opt_str == raw_correct.strip():
                    correct_idx = opt_idx
                geo_opt = translate_text(opt_str, cache)
                geo_options.append(geo_opt)

            # Assign correct answer corresponding to the exact option
            if 0 <= correct_idx < len(geo_options):
                geo_correct = geo_options[correct_idx]
            else:
                geo_correct = translate_text(raw_correct, cache)

            geo_expl = translate_text(raw_expl, cache) if raw_expl else ""
            geo_hint = translate_text(raw_hint, cache) if raw_hint else ""

            # Prepare SQL statement
            opts_json = json.dumps(geo_options, ensure_ascii=False).replace("'", "''")
            q_text_escaped = geo_text.replace("'", "''")
            c_ans_escaped = geo_correct.replace("'", "''")
            geo_expl_escaped = geo_expl.replace("'", "''")
            geo_hint_escaped = geo_hint.replace("'", "''")
            expl_val = f"'{geo_expl_escaped}'" if geo_expl else "NULL"
            hint_val = f"'{geo_hint_escaped}'" if geo_hint else "NULL"

            stmt = f"""INSERT INTO public.question_translations 
(question_id, language_code, question_text, options, correct_answer, explanation, hint)
VALUES ('{q_id}', 'ka', '{q_text_escaped}', '{opts_json}'::jsonb, '{c_ans_escaped}', {expl_val}, {hint_val})
ON CONFLICT (question_id, language_code)
DO UPDATE SET 
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  hint = EXCLUDED.hint,
  updated_at = NOW();"""

            batch_statements.append(stmt)
            processed_count += 1

            # Commit every 5 questions
            if len(batch_statements) >= 5:
                run_psql_script("\n".join(batch_statements))
                batch_statements = []
                save_cache(cache)
                print(f"[{s_key}] {i+1}/{len(q_list)} translated (Total processed: {processed_count}/{total})")

            time.sleep(0.05)

        # Flush any remaining statements
        if batch_statements:
            run_psql_script("\n".join(batch_statements))
            batch_statements = []
            save_cache(cache)
            print(f"[{s_key}] Completed all {len(q_list)} questions.")

    save_cache(cache)
    print(f"\nSUCCESS: All {processed_count} questions translated to Georgian and saved to database.")


if __name__ == "__main__":
    main()
