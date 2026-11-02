import json
import re

# Load raw dump
with open('/tmp/modul7_full_dump.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

modul7_updates = []

for x in d:
    idx = x['order_index']
    qid = x['question_id']
    comm = x.get('comment')

    if idx == 24:
        # Order 24 has no comment, we refine it directly
        item = {
            "id": qid,
            "order_index": idx,
            "question_text": "“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanununa əsasən, dövlət qulluqçusunun xidmətdən kənar davranışı necə tənzimlənir?",
            "options": [
                "Yalnız xidməti vəzifə səlahiyyətlərini həyata keçirdiyi iş saatlarında etik normalara riayət etməyə borcludur",
                "Xidmətdən kənar vaxtlarda törədilən hüquqazidd hərəkətlərə görə dövlət orqanı qarşısında heç bir intizam məsuliyyəti daşımır",
                "Şəxsi həyat toxunulmazlığı prinsipinə əsasən, xidmətdən kənar davranışı dövlət qulluqçusu statusuna heç bir təsir göstərmir",
                "Cəmiyyətdə qəbul olunmuş ümumi əxlaq və milli mənəvi dəyərlərə riayət etməli, dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməlidir"
            ],
            "correct_answer": "Cəmiyyətdə qəbul olunmuş ümumi əxlaq və milli mənəvi dəyərlərə riayət etməli, dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməlidir",
            "explanation": "“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanunu Maddə 7.2 — Qanunun 7.2-ci maddəsinə əsasən, dövlət qulluqçusu xidmətdən kənar vaxtlarda da dövlət orqanının və dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməli, cəmiyyətdə qəbul olunmuş yüksək əxlaq normalarına və ictimai asayiş qaydalarına ciddi riayət etməlidir.",
            "hint": "Dövlət qulluqçusu xidmətdən kənar vaxtda da dövlət orqanının nüfuzuna xələl gətirəcək hərəkətlərdən çəkinməlidir."
        }
        modul7_updates.append(item)
        continue

    # Extract Sual, İpucu, Variantlar, Doğru Cavab, İzah
    q_m = re.search(r'(?:\*\*|\b)Sual:?(?:\*\*|\b)?\s*(.*?)\n\s*(?:(?:\*\*|\b)İpucu:?|$)', comm, re.DOTALL | re.IGNORECASE)
    h_m = re.search(r'(?:\*\*|\b)İpucu:?(?:\*\*|\b)?\s*(.*?)\n\s*(?:(?:\*\*|\b)Variantlar:?|$)', comm, re.DOTALL | re.IGNORECASE)
    v_m = re.search(r'(?:\*\*|\b)Variantlar:?(?:\*\*|\b)?\s*\n(.*?)\n\s*(?:---+|\*\*Doğru Cavab:|\bDoğru Cavab:)', comm, re.DOTALL | re.IGNORECASE)
    a_m = re.search(r'Doğru Cavab:?(?:\*\*|\b)?\s*(?:\*\*)?([A-E])', comm, re.IGNORECASE)
    e_m = re.search(r'(?:\*\*|\b)İzah:?(?:\*\*|\b)?\s*(.*)', comm, re.DOTALL | re.IGNORECASE)

    q_txt = q_m.group(1).strip() if q_m else x['question_text'].strip()
    hint = h_m.group(1).strip() if h_m else x['hint'].strip()
    ans_letter = a_m.group(1).strip() if a_m else 'A'
    exp = e_m.group(1).strip() if e_m else x['explanation'].strip()
    vars_text = v_m.group(1).strip() if v_m else ''

    # Clean markdown bold formatting
    q_txt = re.sub(r'\*\*', '', q_txt).strip()
    hint = re.sub(r'\*\*', '', hint).strip()
    exp = re.sub(r'\*\*', '', exp).strip()

    # parse options A, B, C, D
    opt_map = {}
    for letter in ['A', 'B', 'C', 'D', 'E']:
        pattern = rf'(?:^|\n)\s*(?:\*\s*)?(?:\*\*)?{letter}\)\s*(?:\*\*)?\s*(.*?)(?=(?:\n\s*(?:\*\s*)?(?:\*\*)?[A-E]\)|$))'
        m = re.search(pattern, vars_text, re.DOTALL)
        if m:
            val = m.group(1).strip()
            val = re.sub(r'^\*\*', '', val)
            val = re.sub(r'\*\*$', '', val)
            val = val.strip()
            opt_map[letter] = val

    options = [opt_map['A'], opt_map['B'], opt_map['C'], opt_map['D']]
    ans = opt_map[ans_letter]

    # Fix Order 31 typo
    if idx == 31:
        options = [o.replace("Qarazlilik", "Qərəzlilik") for o in options]
        ans = ans.replace("Qarazlilik", "Qərəzlilik")
        hint = hint.replace("Qarazlilik", "Qərəzlilik").replace('"qarazlilik"', '"qərəzlilik"')
        exp = exp.replace("Qarazlilik", "Qərəzlilik").replace('"Qarazlilik"', '"Qərəzlilik"')

    item = {
        "id": qid,
        "order_index": idx,
        "question_text": q_txt,
        "options": options,
        "correct_answer": ans,
        "explanation": exp,
        "hint": hint
    }
    modul7_updates.append(item)

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

errors = []
lines = [
    "-- Refinement of Modul 7: Etik Davranis Qaydalari (32 Questions)",
    "-- Atomic transaction updating both questions and question_bank tables",
    "BEGIN;",
    ""
]

if len(modul7_updates) != 32:
    errors.append(f"Expected 32 questions, got {len(modul7_updates)}")

seen_ids = set()
for idx, q in enumerate(modul7_updates):
    qid = q["id"]
    if qid in seen_ids:
        errors.append(f"Duplicate id: {qid}")
    seen_ids.add(qid)

    txt = q["question_text"].strip()
    opts = q["options"]
    ans = q["correct_answer"].strip()
    exp = q["explanation"].strip()
    hint = q["hint"].strip()

    if len(opts) != 4:
        errors.append(f"Order {idx} (ID {qid}): Expected 4 options, got {len(opts)}")

    if ans not in opts:
        errors.append(f"Order {idx} (ID {qid}): Correct answer not in options! Ans: {ans}")

    if re.search(r'düzgün cavab [a-e]|doğru cavab [a-e]|variantı', exp, re.IGNORECASE):
        errors.append(f"Order {idx} (ID {qid}): Static letter in explanation: {exp}")

    if "nəzərə alın" in hint.lower():
        errors.append(f"Order {idx} (ID {qid}): Template hint: {hint}")

    sql_txt = escape_sql(txt)
    sql_opts = escape_sql(json.dumps(opts, ensure_ascii=False))
    sql_ans = escape_sql(ans)
    sql_exp = escape_sql(exp)
    sql_hint = escape_sql(hint)

    lines.append(f"-- Order {idx}: ID {qid}")
    lines.append("UPDATE questions SET")
    lines.append(f"    question_text = {sql_txt},")
    lines.append(f"    options = {sql_opts}::jsonb,")
    lines.append(f"    correct_answer = {sql_ans},")
    lines.append(f"    explanation = {sql_exp},")
    lines.append(f"    hint = {sql_hint}")
    lines.append(f"WHERE id = '{qid}';")
    lines.append("")
    # Also update question_bank row
    lines.append("UPDATE question_bank SET")
    lines.append(f"    question_text = {sql_txt},")
    lines.append(f"    options = {sql_opts}::jsonb,")
    lines.append(f"    correct_answer = {sql_ans},")
    lines.append(f"    explanation = {sql_exp},")
    lines.append(f"    hint = {sql_hint}")
    lines.append(f"WHERE id = (SELECT bank_question_id FROM questions WHERE id = '{qid}');")
    lines.append("")

lines.append("COMMIT;")

if errors:
    print("VALIDATION FAILED:")
    for err in errors:
        print(" -", err)
    exit(1)

out_file = "/srv/quizspark-azeri/scripts/update_modul7.sql"
with open(out_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Validation 100% PASSED! All 32 questions valid.")
print(f"SQL written to: {out_file}")
