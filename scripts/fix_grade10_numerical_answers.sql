-- Fix mismatched numerical answers in Grade 10 Olympiad questions and question_bank

BEGIN;

-- 1. Coğrafiya (X sinif): Railway density = 20,000,000 m / 500,000 km^2 = 40 m/km^2
UPDATE questions
SET correct_answer = '40',
    numerical_answer = 40
WHERE id = '9eb68d50-9e25-4785-a317-a4d42ad14b87';

UPDATE question_bank
SET correct_answer = '40',
    numerical_answer = 40
WHERE id = '4a479d63-4870-4bbe-a2c6-61823aee0bf5';

-- 2. Tarix (X sinif): Chronology (Manna süqut: e.ə. 590 [2], Əhəmənilər: e.ə. 550 [1], Maurya Hindistan: e.ə. 322 [3]) -> 213
UPDATE questions
SET correct_answer = '213',
    numerical_answer = 213
WHERE id = '07503d54-729e-4cbc-a807-9f9bbb696d3a';

UPDATE question_bank
SET correct_answer = '213',
    numerical_answer = 213
WHERE id = '896a08aa-79a3-45be-a5f0-a1ef55e6849e';

-- 3. Biologiya (X sinif): Balıq qan növü (1 növ) və İtin çiyin sümük növü (1 növ) bərabərdir -> 24
UPDATE questions
SET correct_answer = '24',
    numerical_answer = 24
WHERE id = 'a20b5246-c291-43b0-b24a-bea3d2cd8f8d';

UPDATE question_bank
SET correct_answer = '24',
    numerical_answer = 24
WHERE id = 'c1b5103b-f8de-46b1-9fe9-e37fe2a5934c';

COMMIT;
