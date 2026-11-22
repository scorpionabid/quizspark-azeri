BEGIN;

-- Normalize all ./images/ and /images/ paths to Supabase Storage public URLs


-- File: ardnf_neft_diaqram_sual_100.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), '/images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), 'images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'),
    explanation = replace(replace(replace(explanation, './images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), '/images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), 'images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'
WHERE question_image_url IN ('/images/ardnf_neft_diaqram_sual_100.png', './images/ardnf_neft_diaqram_sual_100.png', 'images/ardnf_neft_diaqram_sual_100.png')
   OR question_text LIKE '%ardnf_neft_diaqram_sual_100.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), '/images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), 'images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'),
    explanation = replace(replace(replace(explanation, './images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), '/images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'), 'images/ardnf_neft_diaqram_sual_100.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/ardnf_neft_diaqram_sual_100.png'
WHERE question_image_url IN ('/images/ardnf_neft_diaqram_sual_100.png', './images/ardnf_neft_diaqram_sual_100.png', 'images/ardnf_neft_diaqram_sual_100.png')
   OR question_text LIKE '%ardnf_neft_diaqram_sual_100.png%';


-- File: cedvel_izahli_sehife_4.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), '/images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), 'images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), '/images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), 'images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_4.png', './images/cedvel_izahli_sehife_4.png', 'images/cedvel_izahli_sehife_4.png')
   OR question_text LIKE '%cedvel_izahli_sehife_4.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), '/images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), 'images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), '/images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'), 'images/cedvel_izahli_sehife_4.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_4.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_4.png', './images/cedvel_izahli_sehife_4.png', 'images/cedvel_izahli_sehife_4.png')
   OR question_text LIKE '%cedvel_izahli_sehife_4.png%';


-- File: cedvel_izahli_sehife_5.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), '/images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), 'images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), '/images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), 'images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_5.png', './images/cedvel_izahli_sehife_5.png', 'images/cedvel_izahli_sehife_5.png')
   OR question_text LIKE '%cedvel_izahli_sehife_5.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), '/images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), 'images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), '/images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'), 'images/cedvel_izahli_sehife_5.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_5.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_5.png', './images/cedvel_izahli_sehife_5.png', 'images/cedvel_izahli_sehife_5.png')
   OR question_text LIKE '%cedvel_izahli_sehife_5.png%';


-- File: cedvel_izahli_sehife_7.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), '/images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), 'images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), '/images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), 'images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_7.png', './images/cedvel_izahli_sehife_7.png', 'images/cedvel_izahli_sehife_7.png')
   OR question_text LIKE '%cedvel_izahli_sehife_7.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), '/images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), 'images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), '/images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'), 'images/cedvel_izahli_sehife_7.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_7.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_7.png', './images/cedvel_izahli_sehife_7.png', 'images/cedvel_izahli_sehife_7.png')
   OR question_text LIKE '%cedvel_izahli_sehife_7.png%';


-- File: cedvel_izahli_sehife_8.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), '/images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), 'images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), '/images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), 'images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_8.png', './images/cedvel_izahli_sehife_8.png', 'images/cedvel_izahli_sehife_8.png')
   OR question_text LIKE '%cedvel_izahli_sehife_8.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), '/images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), 'images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), '/images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'), 'images/cedvel_izahli_sehife_8.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_8.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_8.png', './images/cedvel_izahli_sehife_8.png', 'images/cedvel_izahli_sehife_8.png')
   OR question_text LIKE '%cedvel_izahli_sehife_8.png%';


-- File: cedvel_izahli_sehife_9.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), '/images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), 'images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), '/images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), 'images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_9.png', './images/cedvel_izahli_sehife_9.png', 'images/cedvel_izahli_sehife_9.png')
   OR question_text LIKE '%cedvel_izahli_sehife_9.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), '/images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), 'images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'),
    explanation = replace(replace(replace(explanation, './images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), '/images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'), 'images/cedvel_izahli_sehife_9.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/cedvel_izahli_sehife_9.png'
WHERE question_image_url IN ('/images/cedvel_izahli_sehife_9.png', './images/cedvel_izahli_sehife_9.png', 'images/cedvel_izahli_sehife_9.png')
   OR question_text LIKE '%cedvel_izahli_sehife_9.png%';


-- File: dairevi_diaqram_sual_98.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), '/images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), 'images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'),
    explanation = replace(replace(replace(explanation, './images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), '/images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), 'images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'
WHERE question_image_url IN ('/images/dairevi_diaqram_sual_98.png', './images/dairevi_diaqram_sual_98.png', 'images/dairevi_diaqram_sual_98.png')
   OR question_text LIKE '%dairevi_diaqram_sual_98.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), '/images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), 'images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'),
    explanation = replace(replace(replace(explanation, './images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), '/images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'), 'images/dairevi_diaqram_sual_98.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/dairevi_diaqram_sual_98.png'
WHERE question_image_url IN ('/images/dairevi_diaqram_sual_98.png', './images/dairevi_diaqram_sual_98.png', 'images/dairevi_diaqram_sual_98.png')
   OR question_text LIKE '%dairevi_diaqram_sual_98.png%';


-- File: deformasiya_halqalar_sual_85.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), '/images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), 'images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'),
    explanation = replace(replace(replace(explanation, './images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), '/images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), 'images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'
WHERE question_image_url IN ('/images/deformasiya_halqalar_sual_85.png', './images/deformasiya_halqalar_sual_85.png', 'images/deformasiya_halqalar_sual_85.png')
   OR question_text LIKE '%deformasiya_halqalar_sual_85.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), '/images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), 'images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'),
    explanation = replace(replace(replace(explanation, './images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), '/images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'), 'images/deformasiya_halqalar_sual_85.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/deformasiya_halqalar_sual_85.png'
WHERE question_image_url IN ('/images/deformasiya_halqalar_sual_85.png', './images/deformasiya_halqalar_sual_85.png', 'images/deformasiya_halqalar_sual_85.png')
   OR question_text LIKE '%deformasiya_halqalar_sual_85.png%';


-- File: feza_sual_p14_im2_386x367.jpeg
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), '/images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), 'images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), '/images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), 'images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'
WHERE question_image_url IN ('/images/feza_sual_p14_im2_386x367.jpeg', './images/feza_sual_p14_im2_386x367.jpeg', 'images/feza_sual_p14_im2_386x367.jpeg')
   OR question_text LIKE '%feza_sual_p14_im2_386x367.jpeg%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), '/images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), 'images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), '/images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'), 'images/feza_sual_p14_im2_386x367.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p14_im2_386x367.jpeg'
WHERE question_image_url IN ('/images/feza_sual_p14_im2_386x367.jpeg', './images/feza_sual_p14_im2_386x367.jpeg', 'images/feza_sual_p14_im2_386x367.jpeg')
   OR question_text LIKE '%feza_sual_p14_im2_386x367.jpeg%';


-- File: feza_sual_p16_im3_260x272.jpeg
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), '/images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), 'images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), '/images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), 'images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'
WHERE question_image_url IN ('/images/feza_sual_p16_im3_260x272.jpeg', './images/feza_sual_p16_im3_260x272.jpeg', 'images/feza_sual_p16_im3_260x272.jpeg')
   OR question_text LIKE '%feza_sual_p16_im3_260x272.jpeg%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), '/images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), 'images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), '/images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'), 'images/feza_sual_p16_im3_260x272.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p16_im3_260x272.jpeg'
WHERE question_image_url IN ('/images/feza_sual_p16_im3_260x272.jpeg', './images/feza_sual_p16_im3_260x272.jpeg', 'images/feza_sual_p16_im3_260x272.jpeg')
   OR question_text LIKE '%feza_sual_p16_im3_260x272.jpeg%';


-- File: feza_sual_p17_im3_201x258.jpeg
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), '/images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), 'images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), '/images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), 'images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'
WHERE question_image_url IN ('/images/feza_sual_p17_im3_201x258.jpeg', './images/feza_sual_p17_im3_201x258.jpeg', 'images/feza_sual_p17_im3_201x258.jpeg')
   OR question_text LIKE '%feza_sual_p17_im3_201x258.jpeg%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), '/images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), 'images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), '/images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'), 'images/feza_sual_p17_im3_201x258.jpeg', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p17_im3_201x258.jpeg'
WHERE question_image_url IN ('/images/feza_sual_p17_im3_201x258.jpeg', './images/feza_sual_p17_im3_201x258.jpeg', 'images/feza_sual_p17_im3_201x258.jpeg')
   OR question_text LIKE '%feza_sual_p17_im3_201x258.jpeg%';


-- File: feza_sual_p19_im3_549x382.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), '/images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), 'images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), '/images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), 'images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'
WHERE question_image_url IN ('/images/feza_sual_p19_im3_549x382.png', './images/feza_sual_p19_im3_549x382.png', 'images/feza_sual_p19_im3_549x382.png')
   OR question_text LIKE '%feza_sual_p19_im3_549x382.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), '/images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), 'images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'),
    explanation = replace(replace(replace(explanation, './images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), '/images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'), 'images/feza_sual_p19_im3_549x382.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/feza_sual_p19_im3_549x382.png'
WHERE question_image_url IN ('/images/feza_sual_p19_im3_549x382.png', './images/feza_sual_p19_im3_549x382.png', 'images/feza_sual_p19_im3_549x382.png')
   OR question_text LIKE '%feza_sual_p19_im3_549x382.png%';


-- File: fiqur_3_firlanma.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), '/images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), 'images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), '/images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), 'images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'
WHERE question_image_url IN ('/images/fiqur_3_firlanma.png', './images/fiqur_3_firlanma.png', 'images/fiqur_3_firlanma.png')
   OR question_text LIKE '%fiqur_3_firlanma.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), '/images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), 'images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), '/images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'), 'images/fiqur_3_firlanma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_3_firlanma.png'
WHERE question_image_url IN ('/images/fiqur_3_firlanma.png', './images/fiqur_3_firlanma.png', 'images/fiqur_3_firlanma.png')
   OR question_text LIKE '%fiqur_3_firlanma.png%';


-- File: fiqur_4_simmetriya_guzgu.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), '/images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), 'images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), '/images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), 'images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'
WHERE question_image_url IN ('/images/fiqur_4_simmetriya_guzgu.png', './images/fiqur_4_simmetriya_guzgu.png', 'images/fiqur_4_simmetriya_guzgu.png')
   OR question_text LIKE '%fiqur_4_simmetriya_guzgu.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), '/images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), 'images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), '/images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'), 'images/fiqur_4_simmetriya_guzgu.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_4_simmetriya_guzgu.png'
WHERE question_image_url IN ('/images/fiqur_4_simmetriya_guzgu.png', './images/fiqur_4_simmetriya_guzgu.png', 'images/fiqur_4_simmetriya_guzgu.png')
   OR question_text LIKE '%fiqur_4_simmetriya_guzgu.png%';


-- File: fiqur_5_yerdeyisme.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), '/images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), 'images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), '/images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), 'images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'
WHERE question_image_url IN ('/images/fiqur_5_yerdeyisme.png', './images/fiqur_5_yerdeyisme.png', 'images/fiqur_5_yerdeyisme.png')
   OR question_text LIKE '%fiqur_5_yerdeyisme.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), '/images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), 'images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), '/images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'), 'images/fiqur_5_yerdeyisme.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_5_yerdeyisme.png'
WHERE question_image_url IN ('/images/fiqur_5_yerdeyisme.png', './images/fiqur_5_yerdeyisme.png', 'images/fiqur_5_yerdeyisme.png')
   OR question_text LIKE '%fiqur_5_yerdeyisme.png%';


-- File: fiqur_6_bucaqlarin_deyismesi.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), '/images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), 'images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), '/images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), 'images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'
WHERE question_image_url IN ('/images/fiqur_6_bucaqlarin_deyismesi.png', './images/fiqur_6_bucaqlarin_deyismesi.png', 'images/fiqur_6_bucaqlarin_deyismesi.png')
   OR question_text LIKE '%fiqur_6_bucaqlarin_deyismesi.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), '/images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), 'images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), '/images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'), 'images/fiqur_6_bucaqlarin_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_6_bucaqlarin_deyismesi.png'
WHERE question_image_url IN ('/images/fiqur_6_bucaqlarin_deyismesi.png', './images/fiqur_6_bucaqlarin_deyismesi.png', 'images/fiqur_6_bucaqlarin_deyismesi.png')
   OR question_text LIKE '%fiqur_6_bucaqlarin_deyismesi.png%';


-- File: fiqur_7_reng_deyismesi.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), '/images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), 'images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), '/images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), 'images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'
WHERE question_image_url IN ('/images/fiqur_7_reng_deyismesi.png', './images/fiqur_7_reng_deyismesi.png', 'images/fiqur_7_reng_deyismesi.png')
   OR question_text LIKE '%fiqur_7_reng_deyismesi.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), '/images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), 'images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), '/images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'), 'images/fiqur_7_reng_deyismesi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_7_reng_deyismesi.png'
WHERE question_image_url IN ('/images/fiqur_7_reng_deyismesi.png', './images/fiqur_7_reng_deyismesi.png', 'images/fiqur_7_reng_deyismesi.png')
   OR question_text LIKE '%fiqur_7_reng_deyismesi.png%';


-- File: fiqur_8_renglerin_toplanmasi.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), '/images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), 'images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), '/images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), 'images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'
WHERE question_image_url IN ('/images/fiqur_8_renglerin_toplanmasi.png', './images/fiqur_8_renglerin_toplanmasi.png', 'images/fiqur_8_renglerin_toplanmasi.png')
   OR question_text LIKE '%fiqur_8_renglerin_toplanmasi.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), '/images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), 'images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), '/images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'), 'images/fiqur_8_renglerin_toplanmasi.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_8_renglerin_toplanmasi.png'
WHERE question_image_url IN ('/images/fiqur_8_renglerin_toplanmasi.png', './images/fiqur_8_renglerin_toplanmasi.png', 'images/fiqur_8_renglerin_toplanmasi.png')
   OR question_text LIKE '%fiqur_8_renglerin_toplanmasi.png%';


-- File: fiqur_9_ust_uste_qoyma.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), '/images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), 'images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), '/images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), 'images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'
WHERE question_image_url IN ('/images/fiqur_9_ust_uste_qoyma.png', './images/fiqur_9_ust_uste_qoyma.png', 'images/fiqur_9_ust_uste_qoyma.png')
   OR question_text LIKE '%fiqur_9_ust_uste_qoyma.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), '/images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), 'images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), '/images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'), 'images/fiqur_9_ust_uste_qoyma.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_9_ust_uste_qoyma.png'
WHERE question_image_url IN ('/images/fiqur_9_ust_uste_qoyma.png', './images/fiqur_9_ust_uste_qoyma.png', 'images/fiqur_9_ust_uste_qoyma.png')
   OR question_text LIKE '%fiqur_9_ust_uste_qoyma.png%';


-- File: fiqur_derece_sual_91.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), '/images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), 'images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), '/images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), 'images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'
WHERE question_image_url IN ('/images/fiqur_derece_sual_91.png', './images/fiqur_derece_sual_91.png', 'images/fiqur_derece_sual_91.png')
   OR question_text LIKE '%fiqur_derece_sual_91.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), '/images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), 'images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'),
    explanation = replace(replace(replace(explanation, './images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), '/images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'), 'images/fiqur_derece_sual_91.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/fiqur_derece_sual_91.png'
WHERE question_image_url IN ('/images/fiqur_derece_sual_91.png', './images/fiqur_derece_sual_91.png', 'images/fiqur_derece_sual_91.png')
   OR question_text LIKE '%fiqur_derece_sual_91.png%';


-- File: kakuro_tapmacasi_sual_75.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), '/images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), 'images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'),
    explanation = replace(replace(replace(explanation, './images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), '/images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), 'images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'
WHERE question_image_url IN ('/images/kakuro_tapmacasi_sual_75.png', './images/kakuro_tapmacasi_sual_75.png', 'images/kakuro_tapmacasi_sual_75.png')
   OR question_text LIKE '%kakuro_tapmacasi_sual_75.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), '/images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), 'images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'),
    explanation = replace(replace(replace(explanation, './images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), '/images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'), 'images/kakuro_tapmacasi_sual_75.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kakuro_tapmacasi_sual_75.png'
WHERE question_image_url IN ('/images/kakuro_tapmacasi_sual_75.png', './images/kakuro_tapmacasi_sual_75.png', 'images/kakuro_tapmacasi_sual_75.png')
   OR question_text LIKE '%kakuro_tapmacasi_sual_75.png%';


-- File: kesik_fiqur_sual_1.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), '/images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), 'images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'),
    explanation = replace(replace(replace(explanation, './images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), '/images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), 'images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'
WHERE question_image_url IN ('/images/kesik_fiqur_sual_1.png', './images/kesik_fiqur_sual_1.png', 'images/kesik_fiqur_sual_1.png')
   OR question_text LIKE '%kesik_fiqur_sual_1.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), '/images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), 'images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'),
    explanation = replace(replace(replace(explanation, './images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), '/images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'), 'images/kesik_fiqur_sual_1.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_1.png'
WHERE question_image_url IN ('/images/kesik_fiqur_sual_1.png', './images/kesik_fiqur_sual_1.png', 'images/kesik_fiqur_sual_1.png')
   OR question_text LIKE '%kesik_fiqur_sual_1.png%';


-- File: kesik_fiqur_sual_2.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), '/images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), 'images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'),
    explanation = replace(replace(replace(explanation, './images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), '/images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), 'images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'
WHERE question_image_url IN ('/images/kesik_fiqur_sual_2.png', './images/kesik_fiqur_sual_2.png', 'images/kesik_fiqur_sual_2.png')
   OR question_text LIKE '%kesik_fiqur_sual_2.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), '/images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), 'images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'),
    explanation = replace(replace(replace(explanation, './images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), '/images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'), 'images/kesik_fiqur_sual_2.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kesik_fiqur_sual_2.png'
WHERE question_image_url IN ('/images/kesik_fiqur_sual_2.png', './images/kesik_fiqur_sual_2.png', 'images/kesik_fiqur_sual_2.png')
   OR question_text LIKE '%kesik_fiqur_sual_2.png%';


-- File: komplekt_sekiller_sual_71.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), '/images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), 'images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'),
    explanation = replace(replace(replace(explanation, './images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), '/images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), 'images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'
WHERE question_image_url IN ('/images/komplekt_sekiller_sual_71.png', './images/komplekt_sekiller_sual_71.png', 'images/komplekt_sekiller_sual_71.png')
   OR question_text LIKE '%komplekt_sekiller_sual_71.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), '/images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), 'images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'),
    explanation = replace(replace(replace(explanation, './images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), '/images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'), 'images/komplekt_sekiller_sual_71.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/komplekt_sekiller_sual_71.png'
WHERE question_image_url IN ('/images/komplekt_sekiller_sual_71.png', './images/komplekt_sekiller_sual_71.png', 'images/komplekt_sekiller_sual_71.png')
   OR question_text LIKE '%komplekt_sekiller_sual_71.png%';


-- File: kub_feza_sehife_11_img_2_921x657.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), '/images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), 'images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'),
    explanation = replace(replace(replace(explanation, './images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), '/images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), 'images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'
WHERE question_image_url IN ('/images/kub_feza_sehife_11_img_2_921x657.png', './images/kub_feza_sehife_11_img_2_921x657.png', 'images/kub_feza_sehife_11_img_2_921x657.png')
   OR question_text LIKE '%kub_feza_sehife_11_img_2_921x657.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), '/images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), 'images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'),
    explanation = replace(replace(replace(explanation, './images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), '/images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'), 'images/kub_feza_sehife_11_img_2_921x657.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_11_img_2_921x657.png'
WHERE question_image_url IN ('/images/kub_feza_sehife_11_img_2_921x657.png', './images/kub_feza_sehife_11_img_2_921x657.png', 'images/kub_feza_sehife_11_img_2_921x657.png')
   OR question_text LIKE '%kub_feza_sehife_11_img_2_921x657.png%';


-- File: kub_feza_sehife_12_img_2_972x647.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), '/images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), 'images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'),
    explanation = replace(replace(replace(explanation, './images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), '/images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), 'images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'
WHERE question_image_url IN ('/images/kub_feza_sehife_12_img_2_972x647.png', './images/kub_feza_sehife_12_img_2_972x647.png', 'images/kub_feza_sehife_12_img_2_972x647.png')
   OR question_text LIKE '%kub_feza_sehife_12_img_2_972x647.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), '/images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), 'images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'),
    explanation = replace(replace(replace(explanation, './images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), '/images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'), 'images/kub_feza_sehife_12_img_2_972x647.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_feza_sehife_12_img_2_972x647.png'
WHERE question_image_url IN ('/images/kub_feza_sehife_12_img_2_972x647.png', './images/kub_feza_sehife_12_img_2_972x647.png', 'images/kub_feza_sehife_12_img_2_972x647.png')
   OR question_text LIKE '%kub_feza_sehife_12_img_2_972x647.png%';


-- File: kub_xetti_acilis_4_xana.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), '/images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), 'images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'),
    explanation = replace(replace(replace(explanation, './images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), '/images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), 'images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'
WHERE question_image_url IN ('/images/kub_xetti_acilis_4_xana.png', './images/kub_xetti_acilis_4_xana.png', 'images/kub_xetti_acilis_4_xana.png')
   OR question_text LIKE '%kub_xetti_acilis_4_xana.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), '/images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), 'images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'),
    explanation = replace(replace(replace(explanation, './images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), '/images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'), 'images/kub_xetti_acilis_4_xana.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/kub_xetti_acilis_4_xana.png'
WHERE question_image_url IN ('/images/kub_xetti_acilis_4_xana.png', './images/kub_xetti_acilis_4_xana.png', 'images/kub_xetti_acilis_4_xana.png')
   OR question_text LIKE '%kub_xetti_acilis_4_xana.png%';


-- File: ucbucaq_sayma_sual_76.png
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), '/images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), 'images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'),
    explanation = replace(replace(replace(explanation, './images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), '/images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), 'images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'
WHERE question_image_url IN ('/images/ucbucaq_sayma_sual_76.png', './images/ucbucaq_sayma_sual_76.png', 'images/ucbucaq_sayma_sual_76.png')
   OR question_text LIKE '%ucbucaq_sayma_sual_76.png%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), '/images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), 'images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'),
    explanation = replace(replace(replace(explanation, './images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), '/images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'), 'images/ucbucaq_sayma_sual_76.png', 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'),
    question_image_url = 'https://supa.imtahan.store/storage/v1/object/public/question-images/ucbucaq_sayma_sual_76.png'
WHERE question_image_url IN ('/images/ucbucaq_sayma_sual_76.png', './images/ucbucaq_sayma_sual_76.png', 'images/ucbucaq_sayma_sual_76.png')
   OR question_text LIKE '%ucbucaq_sayma_sual_76.png%';

COMMIT;
