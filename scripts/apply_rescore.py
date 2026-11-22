import subprocess
import json
import os

disputed_qids = {
    'a1190713-84da-4e75-a356-81303326f411': 'Q2',
    '17278fcc-dbdd-47a3-abc4-4cbf8dde25aa': 'Q4',
    '57ce95a9-25b9-4da5-9fde-fbeafd3bfe0b': 'Q10',
    '3f9dfe82-b0e5-4723-a045-b470d174668e': 'Q49',
    '01e3fe41-6760-4624-927f-37f31b65379c': 'Q55',
}

print("Fetching attempts...")
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

tsv_file = "/tmp/rescore_data.tsv"
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
            
            if qid in disputed_qids:
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

print(f"Generated TSV with {updated_count} rows.")

# Create persistent staging table
subprocess.check_call('''docker exec supabase-db psql -U postgres -d postgres -c "
DROP TABLE IF EXISTS staging_rescore;
CREATE TABLE staging_rescore (
  id uuid PRIMARY KEY,
  new_score integer,
  new_answers jsonb
);
"''', shell=True)

# Copy data into staging table using psql \copy stdin
subprocess.check_call(f"cat {tsv_file} | docker exec -i supabase-db psql -U postgres -d postgres -c '\\copy staging_rescore FROM STDIN WITH (FORMAT text)'", shell=True)

# Run update transaction
sql = """
BEGIN;

UPDATE public.quiz_attempts qa
SET score = t.new_score,
    answers = t.new_answers
FROM staging_rescore t
WHERE qa.id = t.id;

UPDATE public.quiz_results qr
SET score = t.new_score,
    percentage = t.new_score
FROM staging_rescore t
WHERE qr.attempt_id = t.id;

DROP TABLE staging_rescore;

COMMIT;
"""

res = subprocess.check_output(f'docker exec -i supabase-db psql -U postgres -d postgres -c "{sql}"', shell=True).decode()
print("SQL Execution Result:\n", res)

# Cleanup
os.remove(tsv_file)
print("Rescore successfully applied!")
