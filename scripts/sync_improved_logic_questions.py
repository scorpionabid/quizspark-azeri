#!/usr/bin/env python3
"""
sync_improved_logic_questions.py

Synchronizes the 620 newly imported logic questions in question_bank (created at 15:00)
into the corresponding 26 sub-divided Məntiq quizzes and the 4 Bütöv Blok quizzes.
Maps all rich question types (matching, ordering, multiple_select, numerical, multiple_choice)
and sets partial_credit_enabled for matching/multiple_select.
"""

import subprocess
import json
import uuid
import math

def run_psql(query):
    cmd = [
        'docker', 'exec', '-i', 'supabase-db',
        'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-t', '-A'
    ]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = p.communicate(input=query)
    if p.returncode != 0:
        raise RuntimeError(f"psql error: {err}\nQuery sample:\n{query[:300]}")
    return out

def get_new_questions_by_category():
    sql = """
    SELECT json_agg(row_to_json(t))
    FROM (
        SELECT id, category, question_text, question_type, options,
               correct_answer, explanation, matching_pairs, sequence_items,
               question_image_url
        FROM question_bank
        WHERE created_at >= '2026-11-08 05:00:00+00'
        ORDER BY category, id
    ) t;
    """
    raw = run_psql(sql).strip()
    data = json.loads(raw)
    by_cat = {}
    for q in data:
        cat = q['category']
        by_cat.setdefault(cat, []).append(q)
    return by_cat

def get_logic_quizzes():
    sql = """
    SELECT json_agg(row_to_json(t))
    FROM (
        SELECT id, title
        FROM quizzes
        WHERE title ILIKE '%Məntiq%' AND is_published = true
        ORDER BY title
    ) t;
    """
    raw = run_psql(sql).strip()
    return json.loads(raw)

def main():
    questions_by_cat = get_new_questions_by_category()
    quizzes = get_logic_quizzes()

    print(f"Loaded newly imported questions across {len(questions_by_cat)} categories:")
    for cat, qs in questions_by_cat.items():
        print(f"  • {cat}: {len(qs)} questions")

    # Map categories to quizzes
    # 1. Məkan və Fiqur Əlaqələri
    cat_mapping = {
        "Məkan və Fiqur Əlaqələri": {
            "parts": [
                q for q in quizzes if "1. Məkan və Fiqur Əlaqələri (Hissə" in q["title"]
            ],
            "block": next((q for q in quizzes if "[Bütöv Blok] — 1. Məkan və Fiqur Əlaqələri" in q["title"]), None)
        },
        "Qanunauyğunluqlar, Operatorlar və Kriptohesab": {
            "parts": [
                q for q in quizzes if "2. Qanunauyğunluqlar, Operatorlar və Kriptohesab (Hissə" in q["title"]
            ],
            "block": next((q for q in quizzes if "[Bütöv Blok] — 2. Qanunauyğunluqlar" in q["title"]), None)
        },
        "Məntiqi-Riyazi Məsələlər": {
            "parts": [
                q for q in quizzes if "3. Məntiqi-Riyazi Məsələlər (Hissə" in q["title"]
            ],
            "block": next((q for q in quizzes if "[Bütöv Blok] — 3. Məntiqi-Riyazi" in q["title"]), None)
        },
        "Verbal Məntiq və Mətn Təhlili": {
            "parts": [
                q for q in quizzes if "4. Verbal Məntiq və Mətn Təhlili (Hissə" in q["title"]
            ],
            "block": next((q for q in quizzes if "[Bütöv Blok] — 4. Verbal Məntiq" in q["title"]), None)
        },
        "Məntiqi Təfəkkür və Analitik Təhlil": {
            "parts": [
                q for q in quizzes if "5. Analitik Təhlil və Məntiqi Təfəkkür (Hissə" in q["title"]
            ],
            "block": None
        }
    }

    total_inserted = 0

    for cat, mapping in cat_mapping.items():
        cat_questions = questions_by_cat.get(cat, [])
        if not cat_questions:
            print(f"Warning: No questions found for category '{cat}'")
            continue

        parts = mapping["parts"]
        # Sort parts naturally by (Hissə X/Y)
        def part_key(p):
            import re
            m = re.search(r'Hissə\s*(\d+)/', p["title"])
            return int(m.group(1)) if m else 0
        parts.sort(key=part_key)

        num_parts = len(parts)
        print(f"\nProcessing category: '{cat}' ({len(cat_questions)} questions across {num_parts} parts)...")

        # Distribute into parts
        chunk_size = math.ceil(len(cat_questions) / num_parts)
        for i, part_quiz in enumerate(parts):
            quiz_id = part_quiz["id"]
            quiz_title = part_quiz["title"]
            start_idx = i * chunk_size
            end_idx = min(len(cat_questions), (i + 1) * chunk_size)
            part_qs = cat_questions[start_idx:end_idx]

            # Clear old questions for this quiz
            run_psql(f"DELETE FROM questions WHERE quiz_id = '{quiz_id}';")

            # Insert new questions
            insert_statements = []
            for order_idx, q in enumerate(part_qs, start=1):
                new_q_id = str(uuid.uuid4())
                bank_id = q["id"]
                q_text = (q["question_text"] or "").replace("'", "''")
                q_type = q["question_type"] or "multiple_choice"
                title = q_text[:80].replace("'", "''")
                explanation = (q["explanation"] or "").replace("'", "''")
                correct_ans = (q["correct_answer"] or "").replace("'", "''")
                img_url = f"'{q['question_image_url']}'" if q.get("question_image_url") else "NULL"
                partial_credit = "true" if q_type in ["matching", "multiple_select"] else "false"

                opts_escaped = json.dumps(q['options'], ensure_ascii=False).replace("'", "''") if q.get("options") else None
                opts_json = f"'{opts_escaped}'::jsonb" if opts_escaped else "NULL"
                matching_escaped = json.dumps(q['matching_pairs'], ensure_ascii=False).replace("'", "''") if q.get("matching_pairs") else None
                matching_json = f"'{matching_escaped}'::jsonb" if matching_escaped else "NULL"
                seq_escaped = json.dumps(q['sequence_items'], ensure_ascii=False).replace("'", "''") if q.get("sequence_items") else None
                seq_json = f"'{seq_escaped}'::jsonb" if seq_escaped else "NULL"

                insert_statements.append(f"""
                (
                    '{new_q_id}'::uuid,
                    '{quiz_id}'::uuid,
                    '{bank_id}'::uuid,
                    '{title}',
                    '{q_text}',
                    '{q_type}',
                    {opts_json},
                    {matching_json},
                    {seq_json},
                    '{correct_ans}',
                    '{explanation}',
                    {img_url},
                    {partial_credit},
                    {order_idx}
                )
                """)

            if insert_statements:
                batch_sql = f"""
                INSERT INTO questions (
                    id, quiz_id, bank_question_id, title, question_text,
                    question_type, options, matching_pairs, sequence_items,
                    correct_answer, explanation, question_image_url,
                    partial_credit_enabled, order_index
                ) VALUES {','.join(insert_statements)};
                """
                run_psql(batch_sql)
                total_inserted += len(part_qs)

            print(f"  ✓ {quiz_title}: {len(part_qs)} questions inserted.")

        # Update Bütöv Blok if exists
        block_quiz = mapping.get("block")
        if block_quiz:
            block_quiz_id = block_quiz["id"]
            block_title = block_quiz["title"]
            run_psql(f"DELETE FROM questions WHERE quiz_id = '{block_quiz_id}';")
            block_inserts = []
            for order_idx, q in enumerate(cat_questions, start=1):
                new_q_id = str(uuid.uuid4())
                bank_id = q["id"]
                q_text = (q["question_text"] or "").replace("'", "''")
                q_type = q["question_type"] or "multiple_choice"
                title = q_text[:80].replace("'", "''")
                explanation = (q["explanation"] or "").replace("'", "''")
                correct_ans = (q["correct_answer"] or "").replace("'", "''")
                img_url = f"'{q['question_image_url']}'" if q.get("question_image_url") else "NULL"
                partial_credit = "true" if q_type in ["matching", "multiple_select"] else "false"

                opts_escaped = json.dumps(q['options'], ensure_ascii=False).replace("'", "''") if q.get("options") else None
                opts_json = f"'{opts_escaped}'::jsonb" if opts_escaped else "NULL"
                matching_escaped = json.dumps(q['matching_pairs'], ensure_ascii=False).replace("'", "''") if q.get("matching_pairs") else None
                matching_json = f"'{matching_escaped}'::jsonb" if matching_escaped else "NULL"
                seq_escaped = json.dumps(q['sequence_items'], ensure_ascii=False).replace("'", "''") if q.get("sequence_items") else None
                seq_json = f"'{seq_escaped}'::jsonb" if seq_escaped else "NULL"

                block_inserts.append(f"""
                (
                    '{new_q_id}'::uuid,
                    '{block_quiz_id}'::uuid,
                    '{bank_id}'::uuid,
                    '{title}',
                    '{q_text}',
                    '{q_type}',
                    {opts_json},
                    {matching_json},
                    {seq_json},
                    '{correct_ans}',
                    '{explanation}',
                    {img_url},
                    {partial_credit},
                    {order_idx}
                )
                """)

            if block_inserts:
                batch_sql = f"""
                INSERT INTO questions (
                    id, quiz_id, bank_question_id, title, question_text,
                    question_type, options, matching_pairs, sequence_items,
                    correct_answer, explanation, question_image_url,
                    partial_credit_enabled, order_index
                ) VALUES {','.join(block_inserts)};
                """
                run_psql(batch_sql)
                total_inserted += len(cat_questions)

            # Update title with exact count
            import re
            new_title = re.sub(r'\(\d+\s*Sual\)', f'({len(cat_questions)} Sual)', block_title)
            run_psql(f"UPDATE quizzes SET title = '{new_title}' WHERE id = '{block_quiz_id}';")
            print(f"  ✓ [Bütöv Blok] {new_title}: {len(cat_questions)} questions inserted.")

    # Update question_count for all logic quizzes
    count_sql = """
    UPDATE quizzes qz
    SET question_count = (
        SELECT COUNT(*) FROM questions q WHERE q.quiz_id = qz.id
    )
    WHERE qz.title ILIKE '%Məntiq%';
    """
    run_psql(count_sql)
    print(f"\nAll logic quizzes updated with exact question_counts! Total questions placed: {total_inserted}")

if __name__ == '__main__':
    main()
