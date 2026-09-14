-- 1. Activate Portal Lock
UPDATE official_exam_settings 
SET is_active = true, access_code = 'EXAM2026', updated_at = NOW() 
WHERE id = 'current';

-- 2. Clean previous demo if exists
DELETE FROM quizzes WHERE specialty_key = 'demo_test';

-- 3. Insert Demo Quiz
INSERT INTO quizzes (
  id,
  creator_id,
  title,
  description,
  subject,
  difficulty,
  duration,
  is_public,
  is_published,
  shuffle_questions,
  show_feedback,
  pass_percentage,
  attempts_limit,
  allow_backtracking,
  questions_per_page,
  allow_bookmarks,
  show_question_nav,
  feedback_timing,
  question_count,
  exam_category,
  specialty_key
) VALUES (
  'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  '81cebd9d-586b-4460-8615-6cb0ed9d1094',
  'Demo İmtahan (Sınaq - 5 Sual)',
  'Namizədlər üçün sistemi yoxlamaq məqsədilə 5 sualdan ibarət sınaq imtahanı.',
  'Sınaq İmtahanı',
  'medium',
  15,
  true,
  true,
  false,
  false,
  60,
  10,
  true,
  1,
  true,
  true,
  'never',
  5,
  'official_exam',
  'demo_test'
);

-- 4. Insert 5 Questions
INSERT INTO questions (
  id,
  quiz_id,
  order_index,
  question_text,
  question_type,
  options,
  correct_answer,
  weight,
  is_required,
  shuffle_options
) VALUES
(
  gen_random_uuid(),
  'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  0,
  'Azərbaycan Respublikasının Dövlət Bayrağı haqqında qanuna əsasən, bayrağın eninin uzunluğuna nisbəti necədir?',
  'multiple_choice',
  '["1:2", "2:3", "3:4", "1:3"]'::jsonb,
  '1:2',
  1.0,
  true,
  false
),
(
  gen_random_uuid(),
  'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  1,
  'Kompüterdə fayl və ya qovluğu tamamilə (Zibil qutusuna göndərmədən) birdəfəlik silmək üçün hansı klaviatura qısayolundan istifadə olunur?',
  'multiple_choice',
  '["Ctrl + Delete", "Shift + Delete", "Alt + Delete", "Ctrl + Shift + D"]'::jsonb,
  'Shift + Delete',
  1.0,
  true,
  false
),
(
  gen_random_uuid(),
  'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  2,
  'Məktəb və tədris müəssisələrində yanğın təhlükəsizliyi qaydalarına əsasən, ilkin yanğınsöndürmə vasitələrinə aşağıdakılardan hansı aid DEYİL?',
  'multiple_choice',
  '["Qum qutusu", "Yanğınsöndürən balon (OP / OU)", "Kran-dəst və yanğın şlanqı", "Binanın təxliyə planı"]'::jsonb,
  'Binanın təxliyə planı',
  1.0,
  true,
  false
),
(
  gen_random_uuid(),
  'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  3,
  'Elektron cədvəl proqramı olan MS Excel-də xanalardakı ədədlərin cəmini hesablamaq üçün hansı əsas funksiyadan istifadə edilir?',
  'multiple_choice',
  '["SUM (СУММ)", "AVERAGE (СРЗНАЧ)", "COUNT (СЧЁТ)", "MAX (МАКС)"]'::jsonb,
  'SUM (СУММ)',
  1.0,
  true,
  false
),
(
  gen_random_uuid(),
  'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  4,
  'İmtahan zamanı şəbəkə kəsildikdə və ya kompüter gözlənilmədən söndükdə qeyd olunan cavabların itməməsi üçün sistem hansı qaydada işləyir?',
  'multiple_choice',
  '["Cavablar yalnız ən sonda «Bitir» basıldıqda yadda saxlanılır", "Hər seçimdə həm brauzerin daxili yaddaşında, həm də serverdə avtomatik sinxronlaşdırılır", "İnternet kəsilən kimi imtahan ləğv edilir", "Namizəd cavabları kağız vərəqə köçürməlidir"]'::jsonb,
  'Hər seçimdə həm brauzerin daxili yaddaşında, həm də serverdə avtomatik sinxronlaşdırılır',
  1.0,
  true,
  false
);
