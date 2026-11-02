BEGIN;

UPDATE questions SET
    question_text = 'Aşkar riyazi operator müəyyən edilmişdir: $m \mathbin{\#} n = \frac{m \cdot n}{2} + 1$. Buna əsasən, $6 \mathbin{\#} 8$ ifadəsinin qiymətini tapın.',
    options = '["25", "24", "27", "16", "49"]'::jsonb,
    correct_answer = '25',
    explanation = 'Operator düsturuna əsasən: $m \mathbin{\#} n = \frac{m \cdot n}{2} + 1$.
Verilmiş $6 \mathbin{\#} 8$ ifadəsi üçün $m = 6$ və $n = 8$ yerinə yazılır:
1) Vurma əməli: $6 \cdot 8 = 48$
2) Bölmə əməli: $\frac{48}{2} = 24$
3) Toplama əməli: $24 + 1 = 25$

Beləliklə, $6 \mathbin{\#} 8 = 25$ alınır.',
    hint = 'Düsturda $m=6$ və $n=8$ qiymətlərini yerinə yazın. Riyazi əməllər ardıcıllığına (vurma $\rightarrow$ bölmə $\rightarrow$ toplama) diqqət yetirin: $\frac{6 \cdot 8}{2} + 1 = 25$.',
    per_option_explanations = '{"25": "Düzgün cavab: (6 * 8) / 2 + 1 = 24 + 1 = 25.", "24": "Yanıltıcı xəta: Düsturun sonundakı +1 əməliyyatı unudulub ((6 * 8) / 2 = 24).", "27": "Yanıltıcı xəta: Əməllər sırası pozularaq +1 vurmadan əvvəl tətbiq edilib (6 * (8 + 1) / 2 = 27).", "16": "Yanıltıcı xəta: Əməllər sırası qarışdırılaraq +1 məxrəcə aid edilib ((6 * 8) / (2 + 1) = 16).", "49": "Yanıltıcı xəta: Kəsr xətti (2-yə bölmə) nəzərdən qaçırılıb (6 * 8 + 1 = 49)."}'::jsonb
WHERE id = '1eeeb5a0-f646-406a-89d9-c48090243911';

UPDATE question_bank SET
    question_text = 'Aşkar riyazi operator müəyyən edilmişdir: $m \mathbin{\#} n = \frac{m \cdot n}{2} + 1$. Buna əsasən, $6 \mathbin{\#} 8$ ifadəsinin qiymətini tapın.',
    options = '["25", "24", "27", "16", "49"]'::jsonb,
    correct_answer = '25',
    explanation = 'Operator düsturuna əsasən: $m \mathbin{\#} n = \frac{m \cdot n}{2} + 1$.
Verilmiş $6 \mathbin{\#} 8$ ifadəsi üçün $m = 6$ və $n = 8$ yerinə yazılır:
1) Vurma əməli: $6 \cdot 8 = 48$
2) Bölmə əməli: $\frac{48}{2} = 24$
3) Toplama əməli: $24 + 1 = 25$

Beləliklə, $6 \mathbin{\#} 8 = 25$ alınır.',
    hint = 'Düsturda $m=6$ və $n=8$ qiymətlərini yerinə yazın. Riyazi əməllər ardıcıllığına (vurma $\rightarrow$ bölmə $\rightarrow$ toplama) diqqət yetirin: $\frac{6 \cdot 8}{2} + 1 = 25$.',
    per_option_explanations = '{"25": "Düzgün cavab: (6 * 8) / 2 + 1 = 24 + 1 = 25.", "24": "Yanıltıcı xəta: Düsturun sonundakı +1 əməliyyatı unudulub ((6 * 8) / 2 = 24).", "27": "Yanıltıcı xəta: Əməllər sırası pozularaq +1 vurmadan əvvəl tətbiq edilib (6 * (8 + 1) / 2 = 27).", "16": "Yanıltıcı xəta: Əməllər sırası qarışdırılaraq +1 məxrəcə aid edilib ((6 * 8) / (2 + 1) = 16).", "49": "Yanıltıcı xəta: Kəsr xətti (2-yə bölmə) nəzərdən qaçırılıb (6 * 8 + 1 = 49)."}'::jsonb,
    bloom_level = 'tətbiq',
    difficulty = 'orta',
    tags = ARRAY['məntiq', 'operatorlar', 'aşkar_operatorlar', 'əməllər_sırası']
WHERE id = '0216a33e-66d0-4054-8406-f22b8f773882';

COMMIT;
