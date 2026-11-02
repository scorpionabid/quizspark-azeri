import json

q_id = "c07d83fd-b3a2-42ee-a926-f343e99c8323"
bank_id = "10ee2622-e618-496d-adb9-ea4af129f304"

q_text = "Aşkar riyazi operator müəyyən edilmişdir: $a \\odot b = (a + b) \\cdot (a - b)$. Buna əsasən, $8 \\odot 6$ ifadəsinin qiymətini tapın."
options = ["28", "14", "16", "26", "48"]
correct_answer = "28"
explanation = (
    "Operator düsturuna əsasən: $a \\odot b = (a + b) \\cdot (a - b)$.\n"
    "Verilmiş $8 \\odot 6$ ifadəsi üçün $a = 8$ və $b = 6$ qəbul edilir:\n"
    "1) Birinci mötərizənin qiyməti: $a + b = 8 + 6 = 14$\n"
    "2) İkinci mötərizənin qiyməti: $a - b = 8 - 6 = 2$\n"
    "3) Mötərizələrin hasili: $14 \\cdot 2 = 28$\n\n"
    "(Qeyd: Bu operator eyni zamanda kvadratlar fərqini ifadə edir: $a^2 - b^2 = 8^2 - 6^2 = 64 - 36 = 28$).\n"
    "Beləliklə, $8 \\odot 6 = 28$ alınır."
)
hint = "Düsturda $a=8$ və $b=6$ yerinə yazaraq hər iki mötərizənin qiymətini ayrıca hesablayın və bir-birinə vurun: $(8 + 6) \\cdot (8 - 6) = 14 \\cdot 2 = 28$."

per_opts = {
    "28": "Düzgün cavab: (8 + 6) * (8 - 6) = 14 * 2 = 28 (və ya 8^2 - 6^2 = 64 - 36 = 28).",
    "14": "Yanıltıcı xəta: Natamam əməliyyat — yalnız birinci mötərizə (8 + 6 = 14) hesablanıb, ikinci mötərizəyə vurulmayıb.",
    "16": "Yanıltıcı xəta: Əməl işarəsi xətası — mötərizələr arasındakı vurma əməli toplama kimi qəbul edilib ((8 + 6) + (8 - 6) = 14 + 2 = 16).",
    "26": "Yanıltıcı xəta: Hesablama xətası — 14 * 2 hasili hesablanarkən tələskənlikdən 26 yazılıb.",
    "48": "Yanıltıcı xəta: Operatorun strukturu nəzərə alınmadan birbaşa ədədlər bir-birinə vurulub (8 * 6 = 48)."
}

def esc(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

sql = f"""BEGIN;

UPDATE questions SET
    question_text = {esc(q_text)},
    options = {esc(json.dumps(options, ensure_ascii=False))}::jsonb,
    correct_answer = {esc(correct_answer)},
    explanation = {esc(explanation)},
    hint = {esc(hint)},
    per_option_explanations = {esc(json.dumps(per_opts, ensure_ascii=False))}::jsonb
WHERE id = '{q_id}';

UPDATE question_bank SET
    question_text = {esc(q_text)},
    options = {esc(json.dumps(options, ensure_ascii=False))}::jsonb,
    correct_answer = {esc(correct_answer)},
    explanation = {esc(explanation)},
    hint = {esc(hint)},
    per_option_explanations = {esc(json.dumps(per_opts, ensure_ascii=False))}::jsonb,
    bloom_level = 'tətbiq',
    difficulty = 'orta',
    tags = ARRAY['məntiq', 'operatorlar', 'aşkar_operatorlar', 'mötərizə_əməlləri']
WHERE id = '{bank_id}';

COMMIT;
"""

with open("/srv/quizspark-azeri/scripts/update_operator_question_1.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("SQL for Question 1 generated successfully.")
