BEGIN;

UPDATE questions SET
    question_text = 'Aşkar riyazi operator müəyyən edilmişdir: $a \odot b = (a + b) \cdot (a - b)$. Buna əsasən, $8 \odot 6$ ifadəsinin qiymətini tapın.',
    options = '["28", "14", "16", "26", "48"]'::jsonb,
    correct_answer = '28',
    explanation = 'Operator düsturuna əsasən: $a \odot b = (a + b) \cdot (a - b)$.
Verilmiş $8 \odot 6$ ifadəsi üçün $a = 8$ və $b = 6$ qəbul edilir:
1) Birinci mötərizənin qiyməti: $a + b = 8 + 6 = 14$
2) İkinci mötərizənin qiyməti: $a - b = 8 - 6 = 2$
3) Mötərizələrin hasili: $14 \cdot 2 = 28$

(Qeyd: Bu operator eyni zamanda kvadratlar fərqini ifadə edir: $a^2 - b^2 = 8^2 - 6^2 = 64 - 36 = 28$).
Beləliklə, $8 \odot 6 = 28$ alınır.',
    hint = 'Düsturda $a=8$ və $b=6$ yerinə yazaraq hər iki mötərizənin qiymətini ayrıca hesablayın və bir-birinə vurun: $(8 + 6) \cdot (8 - 6) = 14 \cdot 2 = 28$.',
    per_option_explanations = '{"28": "Düzgün cavab: (8 + 6) * (8 - 6) = 14 * 2 = 28 (və ya 8^2 - 6^2 = 64 - 36 = 28).", "14": "Yanıltıcı xəta: Natamam əməliyyat — yalnız birinci mötərizə (8 + 6 = 14) hesablanıb, ikinci mötərizəyə vurulmayıb.", "16": "Yanıltıcı xəta: Əməl işarəsi xətası — mötərizələr arasındakı vurma əməli toplama kimi qəbul edilib ((8 + 6) + (8 - 6) = 14 + 2 = 16).", "26": "Yanıltıcı xəta: Hesablama xətası — 14 * 2 hasili hesablanarkən tələskənlikdən 26 yazılıb.", "48": "Yanıltıcı xəta: Operatorun strukturu nəzərə alınmadan birbaşa ədədlər bir-birinə vurulub (8 * 6 = 48)."}'::jsonb
WHERE id = 'c07d83fd-b3a2-42ee-a926-f343e99c8323';

UPDATE question_bank SET
    question_text = 'Aşkar riyazi operator müəyyən edilmişdir: $a \odot b = (a + b) \cdot (a - b)$. Buna əsasən, $8 \odot 6$ ifadəsinin qiymətini tapın.',
    options = '["28", "14", "16", "26", "48"]'::jsonb,
    correct_answer = '28',
    explanation = 'Operator düsturuna əsasən: $a \odot b = (a + b) \cdot (a - b)$.
Verilmiş $8 \odot 6$ ifadəsi üçün $a = 8$ və $b = 6$ qəbul edilir:
1) Birinci mötərizənin qiyməti: $a + b = 8 + 6 = 14$
2) İkinci mötərizənin qiyməti: $a - b = 8 - 6 = 2$
3) Mötərizələrin hasili: $14 \cdot 2 = 28$

(Qeyd: Bu operator eyni zamanda kvadratlar fərqini ifadə edir: $a^2 - b^2 = 8^2 - 6^2 = 64 - 36 = 28$).
Beləliklə, $8 \odot 6 = 28$ alınır.',
    hint = 'Düsturda $a=8$ və $b=6$ yerinə yazaraq hər iki mötərizənin qiymətini ayrıca hesablayın və bir-birinə vurun: $(8 + 6) \cdot (8 - 6) = 14 \cdot 2 = 28$.',
    per_option_explanations = '{"28": "Düzgün cavab: (8 + 6) * (8 - 6) = 14 * 2 = 28 (və ya 8^2 - 6^2 = 64 - 36 = 28).", "14": "Yanıltıcı xəta: Natamam əməliyyat — yalnız birinci mötərizə (8 + 6 = 14) hesablanıb, ikinci mötərizəyə vurulmayıb.", "16": "Yanıltıcı xəta: Əməl işarəsi xətası — mötərizələr arasındakı vurma əməli toplama kimi qəbul edilib ((8 + 6) + (8 - 6) = 14 + 2 = 16).", "26": "Yanıltıcı xəta: Hesablama xətası — 14 * 2 hasili hesablanarkən tələskənlikdən 26 yazılıb.", "48": "Yanıltıcı xəta: Operatorun strukturu nəzərə alınmadan birbaşa ədədlər bir-birinə vurulub (8 * 6 = 48)."}'::jsonb,
    bloom_level = 'tətbiq',
    difficulty = 'orta',
    tags = ARRAY['məntiq', 'operatorlar', 'aşkar_operatorlar', 'mötərizə_əməlləri']
WHERE id = '10ee2622-e618-496d-adb9-ea4af129f304';

COMMIT;
