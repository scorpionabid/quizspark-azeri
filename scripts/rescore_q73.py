import subprocess
import json
import os

Q73_ID = '6539fb63-246a-41d0-9343-875165660f52'

print("Fetching attempts for Q73 rescore...")
cmd = '''docker exec supabase-db psql -U postgres -d postgres -t -A -c "
SELECT json_agg(t) FROM (
  SELECT id, score, answers
  FROM public.quiz_attempts
  WHERE quiz_id = 'e2b6aa65-84e3-496c-a073-a035ffb87a4b'
    AND completed_at IS NOT NULL
) t;
"'''
out = subprocess.check_output(cmd, shell=True).decode()
attempts = json.loads(out)
print(f"Loaded {len(attempts)} attempts.")

tsv_file = "/tmp/rescore_q73.tsv"
updated_count = 0

with open(tsv_file, "w") as f:
    for att in attempts:
        aid = att['id']
        old_score = att.get('score') or 0
        ans_list = att.get('answers') or []
        
        changed = False
        correct_points = 0
        
        for a in ans_list:
            qid = a.get('questionId')
            is_corr = a.get('isCorrect')
            user_ans = (a.get('textAnswer') or '').strip()
            
            if qid == Q73_ID:
                # Any answer provided or if already correct:
                if user_ans or is_corr:
                    if not is_corr:
                        a['isCorrect'] = True
                        a['pointsEarned'] = 1
                        changed = True
                    correct_points += 1
            elif is_corr:
                correct_points += 1
                
        if changed:
            new_score = round((correct_points / 75.0) * 100)
            answers_json = json.dumps(ans_list).replace('\\', '\\\\').replace('\t', '\\t').replace('\n', '\\n')
            f.write(f"{aid}\t{new_score}\t{answers_json}\n")
            updated_count += 1

print(f"Generated Q73 TSV with {updated_count} rows.")

if updated_count > 0:
    subprocess.check_call('''docker exec supabase-db psql -U postgres -d postgres -c "
    DROP TABLE IF EXISTS staging_rescore_q73;
    CREATE TABLE staging_rescore_q73 (
      id uuid PRIMARY KEY,
      new_score integer,
      new_answers jsonb
    );
    "''', shell=True)

    subprocess.check_call(f"cat {tsv_file} | docker exec -i supabase-db psql -U postgres -d postgres -c '\\copy staging_rescore_q73 FROM STDIN WITH (FORMAT text)'", shell=True)

    sql = """
    BEGIN;

    UPDATE public.quiz_attempts qa
    SET score = t.new_score,
        answers = t.new_answers
    FROM staging_rescore_q73 t
    WHERE qa.id = t.id;

    UPDATE public.quiz_results qr
    SET score = t.new_score,
        percentage = t.new_score
    FROM staging_rescore_q73 t
    WHERE qr.attempt_id = t.id;

    DROP TABLE staging_rescore_q73;

    -- Also remove image from Q73
    UPDATE public.questions
    SET question_image_url = NULL,
        media_url = NULL
    WHERE id = '6539fb63-246a-41d0-9343-875165660f52';

    COMMIT;
    """
    res = subprocess.check_output(f'docker exec -i supabase-db psql -U postgres -d postgres -c "{sql}"', shell=True).decode()
    print("SQL Execution Result:\n", res)

os.remove(tsv_file)
print("Q73 Rescore complete!")
