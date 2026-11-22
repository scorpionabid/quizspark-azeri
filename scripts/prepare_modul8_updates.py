import json
import re

# Load raw dump
with open('/tmp/modul8_full_dump.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

modul8_updates = []

for x in d:
    idx = x['order_index']
    qid = x['question_id']
    comm = x.get('comment')
    
    if idx == 0:
        item = {
            "id": qid,
            "order_index": idx,
            "question_text": "“Vətəndaşların müraciətləri haqqında” AR Qanununa əsasən, xüsusi hallar istisna olmaqla, vətəndaşların müraciətlərinə ən geci hansı müddətdə baxılmalıdır?",
            "options": [
                "Ən geci 15 iş günü müddətində",
                "Ən geci 30 təqvim günü müddətində",
                "Ən geci 7 iş günü müddətində",
                "Ən geci 1 ay müddətində"
            ],
            "correct_answer": "Ən geci 15 iş günü müddətində",
            "explanation": "“Vətəndaşların müraciətləri haqqında” AR Qanunu Maddə 10.1 — Qanunun 10.1-ci maddəsinə əsasən, xüsusi hallar istisna olmaqla, vətəndaşların müraciətlərinə ən geci 15 iş günü müddətində baxılır. Qanunvericilikdə nəzərdə tutulan baxılma müddəti təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.",
            "hint": "Vətəndaşların müraciətlərinə baxılma müddəti təqvim günləri ilə deyil, ən geci 15 iş günü ilə müəyyən edilir."
        }
        modul8_updates.append(item)
        continue

    if idx == 3:
        item = {
            "id": qid,
            "order_index": idx,
            "question_text": "“Vətəndaşların müraciətləri haqqında” AR Qanununa əsasən, aşağıdakı hallardan hansında müraciətə baxılmasına xitam verilir?",
            "options": [
                "Vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş şəxs vəfat etdikdə",
                "Müraciətə baxan dövlət orqanında daxili struktur dəyişikliyi və ya ştat ixtisarı aparıldıqda",
                "Müraciətin araşdırılması üçün tələb olunan müddət 15 iş gününü keçdikdə",
                "Müraciət edən vətəndaş daimi yaşayış və ya iş yerini dəyişdikdə"
            ],
            "correct_answer": "Vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş şəxs vəfat etdikdə",
            "explanation": "“Vətəndaşların müraciətləri haqqında” AR Qanunu Maddə 11.2 — Qanunun 11.2-ci maddəsinə əsasən, vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş fiziki şəxs vəfat etdikdə müraciətə baxılmasına xitam verilir.",
            "hint": "Müraciət yazılı ərizə ilə geri götürüldükdə və ya müraciət edən şəxs vəfat etdikdə icraata xitam verilir."
        }
        modul8_updates.append(item)
        continue

    q_m = re.search(r'Sual:\s*(.*?)\n\s*(?:İpucu:|$)', comm, re.DOTALL)
    h_m = re.search(r'İpucu:\s*(.*?)\n\s*(?:Variantlar:|$)', comm, re.DOTALL)
    v_m = re.search(r'Variantlar:\s*\n(.*?)\n\s*Doğru Cavab:\s*([A-E])', comm, re.DOTALL)
    e_m = re.search(r'İzah:\s*(.*)', comm, re.DOTALL)

    q_txt = q_m.group(1).strip() if q_m else x['question_text'].strip()
    hint = h_m.group(1).strip() if h_m else x['hint'].strip()
    ans_letter = v_m.group(2).strip()
    exp = e_m.group(1).strip() if e_m else x['explanation'].strip()

    vars_text = v_m.group(1).strip()
    opt_map = {}
    for letter in ['A', 'B', 'C', 'D', 'E']:
        m = re.search(rf'{letter}\)\s*(.*?)(?=(?:[A-E]\)|$))', vars_text, re.DOTALL)
        if m:
            opt_map[letter] = m.group(1).strip()

    options = [opt_map['A'], opt_map['B'], opt_map['C'], opt_map['D']]
    ans = opt_map[ans_letter]

    # Cleanups
    if idx == 19:
        exp = exp.replace('"təqvim günü" variantını seçməkdir', 'təqvim günü seçimidir').replace('rast glinən', 'rast gəlinən')

    q_txt = q_txt.replace('**', '')

    item = {
        "id": qid,
        "order_index": idx,
        "question_text": q_txt,
        "options": options,
        "correct_answer": ans,
        "explanation": exp,
        "hint": hint
    }
    modul8_updates.append(item)

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

errors = []
lines = [
    "-- Refinement of Modul 8: Vetendashlarin Muracietleri (38 Questions)",
    "-- Atomic transaction updating both questions and question_bank tables",
    "BEGIN;",
    ""
]

if len(modul8_updates) != 38:
    errors.append(f"Expected 38 questions, got {len(modul8_updates)}")

seen_ids = set()
for idx, q in enumerate(modul8_updates):
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

out_file = "/srv/quizspark-azeri/scripts/update_modul8.sql"
with open(out_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Validation 100% PASSED! All 38 questions valid.")
print(f"SQL written to: {out_file}")
