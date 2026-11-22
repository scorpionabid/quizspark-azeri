BEGIN;

-- 1. Update question_bank tags and categories
UPDATE question_bank 
SET category = 'Azərbaycan dili', tags = ARRAY['8-ci sinif', 'Azərbaycan dili']
WHERE id = 'da5d33cb-f72f-48fa-b272-2d3d0b323e1a';

UPDATE question_bank 
SET category = 'Coğrafiya', tags = ARRAY['8-ci sinif', 'Coğrafiya']
WHERE id = '1ac9d671-8289-4e71-b74e-2d1bd0eb919e';

-- 2. Insert into questions table for Azərbaycan dili quiz (Order index 20)
INSERT INTO questions (
    quiz_id, question_text, question_type, options, correct_answer,
    explanation, matching_pairs, order_index, bank_question_id, is_graded, shuffle_options
)
SELECT 
    'd2b21f14-8611-4151-9d9c-d45a292a025f'::uuid,
    qb.question_text,
    qb.question_type,
    qb.options,
    qb.correct_answer,
    qb.explanation,
    qb.matching_pairs,
    20,
    qb.id,
    true,
    false
FROM question_bank qb
WHERE qb.id = 'da5d33cb-f72f-48fa-b272-2d3d0b323e1a'
ON CONFLICT DO NOTHING;

-- 3. Insert into questions table for Coğrafiya quiz (Order index 20)
INSERT INTO questions (
    quiz_id, question_text, question_type, options, correct_answer,
    explanation, matching_pairs, order_index, bank_question_id, is_graded, shuffle_options
)
SELECT 
    'cc21098a-194f-4bf7-850a-06b491c15783'::uuid,
    qb.question_text,
    qb.question_type,
    qb.options,
    qb.correct_answer,
    qb.explanation,
    qb.matching_pairs,
    20,
    qb.id,
    true,
    false
FROM question_bank qb
WHERE qb.id = '1ac9d671-8289-4e71-b74e-2d1bd0eb919e'
ON CONFLICT DO NOTHING;

-- 4. Update question_count in quizzes
UPDATE quizzes 
SET question_count = (SELECT count(*) FROM questions WHERE quiz_id = 'd2b21f14-8611-4151-9d9c-d45a292a025f')
WHERE id = 'd2b21f14-8611-4151-9d9c-d45a292a025f';

UPDATE quizzes 
SET question_count = (SELECT count(*) FROM questions WHERE quiz_id = 'cc21098a-194f-4bf7-850a-06b491c15783')
WHERE id = 'cc21098a-194f-4bf7-850a-06b491c15783';

COMMIT;