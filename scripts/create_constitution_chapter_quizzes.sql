BEGIN;


-- 1. Archive old monolithic Constitution quiz
UPDATE quizzes 
SET is_archived = true, 
    is_public = false,
    title = 'AR Konstitusiyası (Arxivləşdirilmiş Tam Bank — 507 Sual)'
WHERE id = 'c0000000-0000-4000-a000-000000000002';

-- 2. Update balanced mock exam quiz settings
UPDATE quizzes
SET title = 'AR Konstitusiyası — 9. Yekun Sınaq İmtahanı (Balanslaşdırılmış 105 Sual)',
    duration = 0,
    show_feedback = true,
    feedback_timing = 'immediate',
    shuffle_questions = false,
    questions_per_page = 1,
    allow_backtracking = true,
    allow_bookmarks = true,
    show_question_nav = true,
    is_public = true,
    is_published = true,
    is_archived = false,
    subject = 'Hüquq',
    exam_category = 'Dövlət Qulluğu'
WHERE id = '5feef9ec-80cf-45c2-834b-41a224fe1ffb';


-- Quiz: AR Konstitusiyası — 1. Preambula və Dövlətin Əsasları (Fəsil 1-2)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '211c30a5-0cea-452c-8063-ca97135ff02e', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 1. Preambula və Dövlətin Əsasları (Fəsil 1-2)', 'Preambula, I Fəsil (Xalq hakimiyyəti, Maddə 1-6) və II Fəsil (Dövlətin əsasları, Maddə 7-23).',
    'Hüquq', 'medium', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '458f7db6-c3e0-4e59-9956-498a3d5416de', '211c30a5-0cea-452c-8063-ca97135ff02e', '0132822b-8f0c-4c4d-901a-c82ea92fa972', 'Azərbaycan Respublikası Konstitusiyasının preambulasında (Giriş hissəsində) hansı hüquqi norma müəyyən edilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasının preambulasında heç bir hüquqi norma müəyyən edilməmişdir, Konstitusiyamızın qəbul edilməsinin məqsədi və bir sıra mühüm niyyətlər bəyan olunmuşdur.", "Azərbaycan Respublikasının Konstitusiyasının preambulasında tətbiq edildiyi subyektlərin dairəsinə görə — ümumi və ya müəyyən ərazi, müəyyən kateqoriya şəxslər üçün tətbiqi nəzərdə tutulmuş normalar müəyyən edilmişdir", "Azərbaycan Respublikasının Konstitusiyasının preambulasında hüququn sahələrinə görə — mülki hüquq normaları, cinayət hüquq normaları, əmək hüquq normaları müəyyən edilmişdir", "Azərbaycan Respublikasının Konstitusiyasının preambulasında qüvvədə olma müddətinə görə — müddətsiz və müvəqqəti normalar müəyyən edilmişdir"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasının preambulasında heç bir hüquqi norma müəyyən edilməmişdir, Konstitusiyamızın qəbul edilməsinin məqsədi və bir sıra mühüm niyyətlər bəyan olunmuşdur.', 'AR Konstitusiyası Preambula — Düzgün cavab A variantıdır. Preambula heç bir hüquqi norma müəyyən etmir, Konstitusiyanın qəbul edilməsinin ali məqsədini və xalqın 6 ülvi niyyətini bəyan edir.', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '45c78d23-78fb-49d1-9449-ee2ff039856e', '211c30a5-0cea-452c-8063-ca97135ff02e', '08056134-d675-4fad-b15d-5c3cb9b6acfa', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasında dövlət hakimiyyəti hansı prinsip əsasında təşkil edilir?', 'multiple_choice',
    '["Azərbaycan Respublikasında dövlət hakimiyyəti hakimiyyətlərin vahidliyi prinsipi əsasında təşkil edilir;", "Azərbaycan Respublikasında dövlət hakimiyyəti hakimiyyətlərin müstəqilliyi prinsipi əsasında təşkil edilir;", "Azərbaycan Respublikasında dövlət hakimiyyəti hakimiyyətlərin bölünməsi prinsipi əsasında təşkil edilir;", "Azərbaycan Respublikasında dövlət hakimiyyəti unitarizm prinsipi əsasında təşkil edilir."]'::jsonb, 'Azərbaycan Respublikasında dövlət hakimiyyəti hakimiyyətlərin bölünməsi prinsipi əsasında təşkil edilir;', 'AR Konstitusiyası Maddə 7.III (Hakimiyyətlərin bölünməsi) — Düzgün cavab C variantıdır. Dövlət hakimiyyəti hakimiyyətlərin bölünməsi prinsipi əsasında təşkil olunur: Qanunvericilik — Milli Məclis, İcra — AR Prezidenti, Məhkəmə — AR məhkəmələri.', 1, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a1503889-b367-40c9-a84f-1b4ef5f89a01', '211c30a5-0cea-452c-8063-ca97135ff02e', '0812924b-c191-427a-8311-773a742460ed', 'Azərbaycan Respublikası Konstitusiyasının birinci bölməsi neçə fəsil və neçə maddədən ibarətdir?', 'multiple_choice',
    '["I bölmə iki fəsildən (xalq hakimiyyəti (1-6-cı maddələr – bu fəsildə xalq hakimiyyətinin başlıca prinsipləri və əlamətləri, eləcə də onun mahiyyyəti açıqlanır) və dövlətin əsasları (7-23-cü maddələr – bu fəsildə dövləti səciyyələndirən əsas elementlərin xüsusiyyətləri və onun fundamental əsasları ilə bağlı məsələlər tənzimlənir) ) ibarətdir.", "I bölmə iki fəsildən (xalq hakimiyyəti (1-7-ci maddələr – bu fəsildə xalq hakimiyyətinin başlıca prinsipləri və əlamətləri, eləcə də onun mahiyyyəti açıqlanır) və dövlətin əsasları (10-23-cü maddələr – bu fəsildə dövləti səciyyələndirən əsas elementlərin xüsusiyyətləri və onun fundamental əsasları ilə bağlı məsələlər tənzimlənir) ) ibarətdir.", "I bölmə üç fəsildən (xalq hakimiyyəti (1-6-cı maddələr – bu fəsildə xalq hakimiyyətinin başlıca prinsipləri və əlamətləri, eləcə də onun mahiyyyəti açıqlanır), dövlətin əsasları (7-23-cü maddələr – bu fəsildə dövləti səciyyələndirən əsas elementlərin xüsusiyyətləri və onun fundamental əsasları ilə bağlı məsələlər tənzimlənir) və əsas insan və hüquq azadlıqlarından(24-72-ci maddələr,əsasən hüquqlar və azadlıqlarla bağlı məsələlər açıqlanır) ibarətdir.", "I bölmə bir fəsildən (xalq hakimiyyəti (1-6-cı maddələr – bu fəsildə xalq hakimiyyətinin başlıca prinsipləri və əlamətləri, eləcə də onun mahiyyyəti açıqlanır)) ibarətdir."]'::jsonb, 'I bölmə iki fəsildən (xalq hakimiyyəti (1-6-cı maddələr – bu fəsildə xalq hakimiyyətinin başlıca prinsipləri və əlamətləri, eləcə də onun mahiyyyəti açıqlanır) və dövlətin əsasları (7-23-cü maddələr – bu fəsildə dövləti səciyyələndirən əsas elementlərin xüsusiyyətləri və onun fundamental əsasları ilə bağlı məsələlər tənzimlənir) ) ibarətdir.', 'AR Konstitusiyası I Bölmə (Ümumi müddəalar) — Düzgün cavab A variantıdır. I Bölmə 2 fəsildən (I Fəsil: Xalq hakimiyyəti, II Fəsil: Dövlətin əsasları) və 23 maddədən ibarətdir.', 2, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd1fb4bbd-85d2-4494-8362-9e7a452ef240', '211c30a5-0cea-452c-8063-ca97135ff02e', '0d21bc7c-b261-4e5b-be8f-f473b5c6e063', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan xalqı hansı niyyətlərini bəyan edir?
1. Azərbaycan dövlətinin müstəqilliyini, suverenliyini və ərazi bütövlüyünü qorumaq
2. Demokratik prinsiplərə əsaslanaraq, xalqın layiqli həyat səviyyəsinin təmin edilməsini
3. İnsan və vətəndaşları hüquq və azadlıqlarının təmin olunması
4. Konstitusiya çərçivəsində demokratik quruluşa təminat vermək
5. Vətəndaş cəmiyyətinin bərqərar edilməsinə nail olmaq', 'multiple_choice',
    '["1,2,3", "1,3,4", "1,4,5", "2,4,5"]'::jsonb, '1,4,5', 'AR Konstitusiyası Preambula (Xalqın niyyətləri) — Düzgün cavab C variantıdır. Xalqın 6 niyyətinə: müstəqilliyi və ərazi bütövlüyünü qorumaq, demokratik quruluşa təminat, vətəndaş cəmiyyəti, hüquqi-dünyəvi dövlət, layiqli həyat səviyyəsi və ümumbəşəri dəyərlərə sadiqlik daxildir.', 3, NULL, 'İnsan hüquqları və layiqli həyat səviyyəsinin təmini dövlətin ali məqsədidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7e1c4b40-d6f1-4de9-ae81-d045b7c50b39', '211c30a5-0cea-452c-8063-ca97135ff02e', '1073478b-e383-4aad-8b6d-478f986e2685', 'Azərbaycan Respublikasının Konstitusiyasına edilmiş əlavə və dəyiikliklərin düzgün siyahısı seçin
1. 2002-ci il avqustun 24-də ümumxalq səsverməsində (referendumda) qəbul edilmiş əlavə və dəyişikliklər
2. 2009-cu il martın 18-də ümumxalq səsverməsində (referendumda) qəbul edilmiş əlavə və dəyişikliklər
3. 2016-cı il sentyabrın 26-da keçirilmiş ümumxalq səsverməsində (referendumda) qəbul edilmiş dəyişikliklər
4. 2002-ci il avqustun 24-də ümumxalq səsverməsində (referendumda) qəbul edilmiş dəyişikliklər
5. 2009-cu il martın 18-də ümumxalq səsverməsində (referendumda) qəbul edilmiş dəyişikliklər
6. 2016-cı il sentyabrın 26-da keçirilmiş ümumxalq səsverməsində (referendumda) qəbul edilmiş əlavə və dəyişikliklər', 'multiple_choice',
    '["1,3,5", "2,3,4", "2,4,6", "4,5,6"]'::jsonb, '2,4,6', 'AR Konstitusiyası Referendum Tarixləri — Düzgün cavab C (2, 4, 6) variantıdır. 2002-ci il 24 avqust və 2009-cu il 18 mart referendumları ilə ''əlavə və dəyişikliklər'', 2016-cı il 26 sentyabr referendumu ilə isə ''dəyişikliklər'' edilmişdir.', 4, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '368bf2ab-366d-414a-8264-fc762bb39bd1', '211c30a5-0cea-452c-8063-ca97135ff02e', '1af9c06e-75d7-436e-8d94-451e1684757d', 'Azərbaycan Respublikası Konstitusiyasının preambulasında Azərbaycan xalqı təntənəli surətdə neçə niyyətini bəyan edir?', 'multiple_choice',
    '["6 niyyətini", "5 niyyətini", "4 niyyətini", "7 niyyətini"]'::jsonb, '6 niyyətini', 'AR Konstitusiyası Preambula — Düzgün cavab A variantıdır. Azərbaycan xalqı təntənəli surətdə 6 mühüm niyyətini bəyan edir.', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c2f0a6f5-b92c-443f-84b6-c82c2084b3ad', '211c30a5-0cea-452c-8063-ca97135ff02e', '367bc297-9ffd-4b8e-840b-3ea5aa08a3c0', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan dövlətinin başçısı ilə fikirlərdən biri doğru deyil', 'multiple_choice',
    '["Azərbaycan dövlətinin başçısı Azərbaycan Respublikasının Prezidentidir. O, ölkənin daxilində və xarici münasibətlərdə Azərbaycan dövlətini təmsil edir.", "Azərbaycan Respublikasının Prezidenti Azərbaycan xalqının vahidliyini təcəssüm etdirir və Azərbaycan dövlətçiliyinin varisliyini təmin edir.", "Azərbaycan Respublikasının Prezidenti Azərbaycan dövlətinin müstəqilliyinin, ərazi bütövlüyünün və Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrə riayət olunmasının təminatçısıdır.", "Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası təhlükəsizliyini və müdafiəsini təmin etmək məqsədi ilə Silahlı Qüvvələr və başqa silahlı birləşmələr yaradır."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası təhlükəsizliyini və müdafiəsini təmin etmək məqsədi ilə Silahlı Qüvvələr və başqa silahlı birləşmələr yaradır.', 'AR Konstitusiyası Maddə 9 (Silahlı Qüvvələr) — Düzgün cavab D variantıdır. Azərbaycan Respublikası öz təhlükəsizliyini və müdafiəsini təmin etmək üçün Silahlı Qüvvələr yaradır. Baş komandan AR Prezidentidir.', 6, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5ea1cc71-89b8-4687-9062-6a77df8eeaa3', '211c30a5-0cea-452c-8063-ca97135ff02e', '3b6ac544-49c8-4a74-bf43-09eef0ba27d6', 'Azərbaycan Respublikasının Konstitusiyasına görə ailə və uşaqların hüquqları ilə bağlı doğru olmayan fikir hansıdır?', 'multiple_choice',
    '["Cəmiyyətin əsas özəyi kimi ailə dövlətin ümumi himayəsindədir.", "Uşaqların qayğısına qalmaq və onları tərbiyə etmək valideynlərin borcudur. Bu borcun yerinə yetirilməsinə dövlət nəzarət edir.", "Valideynləri və ya qəyyumları olmayan, valideyn qayğısından məhrum olan uşaqlar dövlətin himayəsindədirlər.", "15 yaşına çatmamış uşaqlar işə götürülə bilməzlər."]'::jsonb, 'Cəmiyyətin əsas özəyi kimi ailə dövlətin ümumi himayəsindədir.', 'AR Konstitusiyası Maddə 17 (Ailə, uşaqlar və dövlət) — Düzgün cavab A variantıdır. Ailə cəmiyyətin əsas özəyidir və dövlətin xüsusi himayəsindədir. 15 yaşına çatmamış uşaqlar işə qəbul edilə bilməzlər.', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd29ce3c5-a349-4528-85de-19b5771dde0b', '211c30a5-0cea-452c-8063-ca97135ff02e', '3c40d333-3231-44a5-b399-f607f1a83f1c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası dövlət bayrağı, dövlət gerbinin təsviri, dövlət Himninin musiqisi və mətni müəyyən edilir:', 'multiple_choice',
    '["Qanunla", "Qərarla", "Konstitusiya qanunu ilə", "Sərəncamla İkinci bölmə(Əsas İnsan və vətəndaş hüquqları və azadlıqları)"]'::jsonb, 'Konstitusiya qanunu ilə', 'AR Konstitusiyası Maddə 23 (Dövlət rəmzləri) — Düzgün cavab C variantıdır. AR dövlət rəmzləri Dövlət bayrağı, Dövlət gerbi və Dövlət himnidir.', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '75f94b0d-fa84-46c4-b3e9-3b50db46e8f1', '211c30a5-0cea-452c-8063-ca97135ff02e', '3cfc1d0f-eb36-4234-98a6-05dbf5f0e9eb', 'Azərbaycan Respublikasının Konstitusiyasına görə doğrudur', 'multiple_choice',
    '["Hakimiyyətin mənimsənilməsi millətə qarşı ən ağır cinayətdir.", "Hakimiyyətin mənimsənilməsi xalqa qarşı ən ağır cinayətdir.", "Hakimiyyətin mənimsənilməsi dövlətə qarşı ən ağır cinayətdir.", "Hakimiyyətin mənimsənilməsi vətənə qarşı ən ağır cinayətdir."]'::jsonb, 'Hakimiyyətin mənimsənilməsi xalqa qarşı ən ağır cinayətdir.', 'AR Konstitusiyası Maddə 6 (Hakimiyyətin mənimsənilməsi) — Hakimiyyətin mənimsənilməsi xalqa qarşı ən ağır cinayətdir.', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4d850b93-7d49-457d-acaf-bdec3a01a971', '211c30a5-0cea-452c-8063-ca97135ff02e', '4c08750e-8f8b-4c25-b0e4-9eba4a88d835', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq düzgün olan bənd müəyyən edin:
1. Azərbaycan Respublikasının dövlət rəmzləri Azərbaycan Respublikasının Dövlət bayrağı, Azərbaycan Respublikasının Dövlət gerbi və Azərbaycan Respublikasının Dövlət himnidir.
2. Azərbaycan Respublikasının Dövlət bayrağı bərabər enli üç üfüqi zolaqdan ibarətdir.Yuxarı zolaq göy, orta zolaq qırmızı, aşağı zolaq yaşıl rəngdədir və qırmızı zolağın ortasında bayrağın hər iki üzündə ağ rəngli aypara ilə səkkizguşəli ulduz təsvir edilmişdir.
3. Bayrağın uzunluğunun eninə nisbəti 1:2-dir.
4. Azərbaycan Respublikası Dövlət bayrağının və Azərbaycan Respublikası Dövlət gerbinin təsviri, Azərbaycan Respublikası Dövlət himninin musiqisi və mətni Konstitusiya qanunu ilə müəyyən edilir.', 'multiple_choice',
    '["1,2,4", "1,4", "2,3,4", "1,2,3,4"]'::jsonb, '1,4', 'AR Konstitusiyası Maddə 23 (Dövlət rəmzləri) — Düzgün cavab B variantıdır. AR dövlət rəmzləri Dövlət bayrağı, Dövlət gerbi və Dövlət himnidir.', 10, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8a2414fc-69cb-4336-b506-1c6c7745503e', '211c30a5-0cea-452c-8063-ca97135ff02e', '506334ff-539b-4f33-9328-1e0a9757da40', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq düzgün olmayan bəndi müəyyən edin:', 'multiple_choice',
    '["Azərbaycan Respublikasının dövlət dili Azərbaycan dilidir", "Dövlət dilini bilmək hər bir Azərbaycan Respublikası vətəndaşının borcudur.", "Azərbaycan Respublikası Azərbaycan dilinin inkişafını təmin edir.", "Azərbaycan Respublikası əhalinin danışdığı başqa dillərin sərbəst işlədilməsini və inkişafını təmin edir."]'::jsonb, 'Dövlət dilini bilmək hər bir Azərbaycan Respublikası vətəndaşının borcudur.', 'AR Konstitusiyası Maddə 21 (Dövlət dili) — Düzgün cavab B variantıdır. Azərbaycan Respublikasının dövlət dili Azərbaycan dilidir. Dövlət başqa dillərin sərbəst işlədilməsini və inkişafını təmin edir.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6925b9d4-c7e4-4078-84af-9eae2cdbf7a5', '211c30a5-0cea-452c-8063-ca97135ff02e', '52c88a92-adce-4059-92c4-0d1361a0c919', 'Azərbaycan Respublikasının Konstitusiyasına əsasən uşaqları hansı fəaliyyətə cəlb etmək qadağandır?
1. Həyatına təhlükə törədə bilən
2. Normal inkişafına təhlükə törədə bilən
3. Sağlamlığına təhlükə törədə bilən
4. Əqli inkişafına təhlükə törədə bilən
5. Mənəviyyatına təhlükə törədə bilən', 'multiple_choice',
    '["1,2,3", "2,3,5", "2,4,5", "1,3,5"]'::jsonb, '1,3,5', 'AR Konstitusiyası Maddə 17 (Ailə, uşaqlar və dövlət) — Düzgün cavab D variantıdır. Ailə cəmiyyətin əsas özəyidir və dövlətin xüsusi himayəsindədir. 15 yaşına çatmamış uşaqlar işə qəbul edilə bilməzlər.', 12, NULL, 'Uşaqların həyatına, sağlamlığına və mənəviyyatına təhlükə törədən fəaliyyət qadağandır.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '64adbd82-384f-4135-ab98-40f36aec5a24', '211c30a5-0cea-452c-8063-ca97135ff02e', '5ce90269-e6f3-4e31-81f2-7e4254ccb69e', '“Azərbaycan Respublikası öz təhlükəsizliyini və müdafiəsini təmin etmək məqsədi ilə Silahlı Qüvvələr yaradır. Silahlı Qüvvələr Azərbaycan Ordusundan və başqa silahlı birləşmələrdən ibarətdir” cümləsi Azərbaycan Respublikasının Konstitusiyasına hansı ildə yeni redaksiya ilə verilmişdir?', 'multiple_choice',
    '["1995-ci il noyabrın 12-də ümumxalq səsverməsində (referendumda)", "2002-ci il avqustun 24-də ümumxalq səsverməsində (referendumda) qəbul edilmiş dəyişikliklərlэ", "2009-cu il martın 18-də ümumxalq səsverməsində (referendumda) qəbul edilmiş əlavə və dəyişikliklərlə.", "2016-cı il sentyabrın 26-da keçirilmiş ümumxalq səsverməsində (referendumda) qəbul edilmiş əlavə və dəyişikliklərlə."]'::jsonb, '2016-cı il sentyabrın 26-da keçirilmiş ümumxalq səsverməsində (referendumda) qəbul edilmiş əlavə və dəyişikliklərlə.', 'AR Konstitusiyası Maddə 9 (Silahlı Qüvvələr) — Düzgün cavab D variantıdır. Azərbaycan Respublikası öz təhlükəsizliyini və müdafiəsini təmin etmək üçün Silahlı Qüvvələr yaradır. Baş komandan AR Prezidentidir.', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'dc4d6d3d-a9eb-439a-9515-24d65889da18', '211c30a5-0cea-452c-8063-ca97135ff02e', '5d0a7ac9-9c89-482d-b340-dd01def10572', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı borclar Azərbaycan Respublikası tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz?', 'multiple_choice',
    '["Azərbaycan xalqına qarşı və ya dövlət çevrilişinə kömək məqsədi ilə alınmış borclar Azərbaycan Respublikası tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz.", "Azərbaycan dövlətinə qarşı qiyama və dövlət çevrilişinə kömək məqsədi ilə alınmış borclar Azərbaycan Respublikası tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz.", "Azərbaycan hakimiyyətinə qarşı qiyama və ya dövlət çevrilişinə kömək məqsədi ilə alınmış borclar Azərbaycan Respublikası tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz.", "Azərbaycan vətəndaşlarına qarşı qiyama və ya hakimiyyət çevrilişinə kömək məqsədi ilə alınmış borclar Azərbaycan Respublikası tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz."]'::jsonb, 'Azərbaycan dövlətinə qarşı qiyama və dövlət çevrilişinə kömək məqsədi ilə alınmış borclar Azərbaycan Respublikası tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz.', 'AR Konstitusiyası Maddə 20 (Dövlətin borclarına qoyulan məhdudiyyətlər) — Düzgün cavab B variantıdır. Qiyama və dövlət çevrilişinə kömək məqsədi ilə alınmış borclar AR tərəfindən öhdəlik kimi qəbul edilə və ödənilə bilməz.', 14, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6212d583-a9fd-4e7c-a3d4-537ecad89b9c', '211c30a5-0cea-452c-8063-ca97135ff02e', '615643e4-02e4-4156-8a80-64c640b1777b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Qanun Azərbaycan Respublikası Prezidentinin etirazını doğurursa, o, qanunu imzalamayıb öz etirazları ilə birlikdə istənilən vaxt Azərbaycan Respublikasının Milli Məclisinə qaytara bilər.", "Qanun Azərbaycan Respublikası Prezidentinin etirazını doğurursa, o, qanunu imzalamayıb öz etirazları ilə birlikdə göstərilən müddət ərzində Azərbaycan Respublikasının Konstitusiya Məhkəməsinə qaytara bilər.", "Qanun Azərbaycan Respublikası Prezidentinin etirazını doğurursa, o, qanunu imzalamayıb öz etirazları ilə birlikdə göstərilən müddət ərzində Azərbaycan Respublikasının Milli Məclisinin sədrinə qaytara bilər.", "Qanun Azərbaycan Respublikası Prezidentinin etirazını doğurursa, o, qanunu imzalamayıb öz etirazları ilə birlikdə göstərilən müddət ərzində Azərbaycan Respublikasının Milli Məclisinə qaytara bilər."]'::jsonb, 'Qanun Azərbaycan Respublikası Prezidentinin etirazını doğurursa, o, qanunu imzalamayıb öz etirazları ilə birlikdə göstərilən müddət ərzində Azərbaycan Respublikasının Milli Məclisinə qaytara bilər.', 'AR Konstitusiyası', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3fcbe4d0-dbcd-414c-9805-32807f2d666d', '211c30a5-0cea-452c-8063-ca97135ff02e', '6b4d3d1a-ba40-4ffd-b663-b804ec8dcbc4', 'Azərbaycan Respublikasında mülkiyyət necə müdafiə olunur?', 'multiple_choice',
    '["Azərbaycan Respublikasında mülkiyyət yalnız dövlətə məxsusdur və dövlət tərəfindən müdafiə olunur", "Azərbaycan Respublikasında mülkiyyət sahibkarlara məxsusdur və beynəlxalq sazişlərlə qorunur", "Azərbaycan Respublikasında mülkiyyət toxunulmazdır və dövlət tərəfindən müdafiə olunur", "Azərbaycan Respublikasında mülkiyyət toxunulmazdır və beynəlxalq təşkilatlar tərəfindən qorunur"]'::jsonb, 'Azərbaycan Respublikasında mülkiyyət toxunulmazdır və dövlət tərəfindən müdafiə olunur', 'AR Konstitusiyası Maddə 13 (Mülkiyyət) — Düzgün cavab C variantıdır. Mülkiyyət toxunulmazdır və dövlət tərəfindən müdafiə olunur. Xüsusi, dövlət və bələdiyyə mülkiyyəti növləri bərabər hüquqa malikdir.', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2bce10c4-ef3c-4f2b-8720-e4661c9c62f5', '211c30a5-0cea-452c-8063-ca97135ff02e', '6bbccb31-257a-464c-9025-d9d51e2bed1f', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan xalqı hansı niyyətlərini bəyan edir?
1. Xalqın iradəsinin ifadəsi kimi, qanunların aliliyini təmin edən hüquqi, dünyəvi dövlət qurmaq
2. Ədalətli iqtisadi və sosial qaydalara uyğun olaraq , hamının layiqli həyat səviyyəsini təmin etmək
3. Konstitusiya çərçivəsində unitar respublika yaratmaq
4. Azərbaycan Respublikasının beynəlxalq müqavilələrə qoşulmasını təmin etmək
5. Ümumbəşəri dəyərlərə sadiq olaraq, bütün dünya xalqları ilə dostluq, sülh və əmin-amanlıq şəraitində yaşamaq və bu məqsədlə qarşılıqlı fəaliyyət göstərmək', 'multiple_choice',
    '["1,2,3", "1,3,5", "1,2,5", "1,4,5"]'::jsonb, '1,2,5', 'AR Konstitusiyası Preambula (Xalqın niyyətləri) — Düzgün cavab C variantıdır. Xalqın 6 niyyətinə: müstəqilliyi və ərazi bütövlüyünü qorumaq, demokratik quruluşa təminat, vətəndaş cəmiyyəti, hüquqi-dünyəvi dövlət, layiqli həyat səviyyəsi və ümumbəşəri dəyərlərə sadiqlik daxildir.', 17, NULL, 'İnsan hüquqları və layiqli həyat səviyyəsinin təmini dövlətin ali məqsədidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd84cc8c0-9b76-4181-b55d-8cf68a22148d', '211c30a5-0cea-452c-8063-ca97135ff02e', '6f30178d-a0e8-4f05-afbc-d1faf9344677', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakılardan hansı Azərbaycan xalqının suveren hüququdur?', 'multiple_choice',
    '["bilavasitə ümumxalq səsverməsi - referendum və ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, gizli və şəxsi səsvermə yolu ilə seçilmiş nümayəndələri vasitəsi ilə həyata keçirmək", "Azərbaycan xalqı öz hüquqları və mənafeləri ilə bağlı olan hər bir məsələni referendumla həll etmək", "Azərbaycan dövlətinin müstəqilliyini, suverenliyini və ərazi bütövlüyünü qorumaq", "Sərbəst və müstəqil öz müqəddəratını həll etmək və öz idarəetmə formasını müəyyən etmək"]'::jsonb, 'Sərbəst və müstəqil öz müqəddəratını həll etmək və öz idarəetmə formasını müəyyən etmək', 'AR Konstitusiyası Maddə 2.I (Xalqın suverenliyi) — Düzgün cavab D variantıdır. Sərbəst və müstəqil öz müqəddəratını həll etmək və öz idarəetmə formasını müəyyən etmək Azərbaycan xalqının suveren hüququdur.', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7dc23d34-bddc-4468-94e0-42cda500fd3e', '211c30a5-0cea-452c-8063-ca97135ff02e', '7066f9ba-02a6-4fa6-b9ad-f7748c2ff8d1', 'Azərbaycan Respublikasının Konstitusiyasına əsasən yalnız referendumla həll edilə bilən məsələlərdir:', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi, Azərbaycan Respublikasının Konstitusiyasına əlavə və dəyişikliklər edilməsi, idarəetmə formasının və dövlət sərhədlərinin dəyişdirilməsi", "Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi, Azərbaycan Respublikasının Konstitusiyasına əlavə və dəyişikliklər edilməsi, idarəetmə formasının və dövlət dilinin dəyişdirilməsi", "Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi, Azərbaycan Respublikasının Konstitusiyasına dəyişikliklər edilməsi, dövlət sərhədlərinin dəyişdirilməsi", "Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi, Azərbaycan Respublikasının Konstitusiyasına əlavə və dəyişikliklər edilməsi, müharibə elan edilməsi"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi, Azərbaycan Respublikasının Konstitusiyasına dəyişikliklər edilməsi, dövlət sərhədlərinin dəyişdirilməsi', 'AR Konstitusiyası Maddə 3.I (Yalnız referendumla həll olunan məsələlər) — Düzgün cavab C variantıdır. Yalnız referendumla həll olunur: 1) Konstitusiyanın qəbulu və ona dəyişikliklər edilməsi; 2) AR dövlət sərhədlərinin dəyişdirilməsi.', 19, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fcfc9fad-2dd4-4b29-99f8-a73fa83150d5', '211c30a5-0cea-452c-8063-ca97135ff02e', '7bc5be76-39ca-4e27-af41-45dbe3a6b57e', 'Azərbaycan Respublikasının Konstitusiyasına əsasən xalqın vahidliyi maddəsinə görə doğru deyil', 'multiple_choice',
    '["Azərbaycan xalqı vahiddir.", "Azərbaycan xalqının vahidliyi Azərbaycan dövlətinin təməlini təşkil edir.", "Azərbaycan dövləti bütün Azərbaycan Respublikasında yaşayan insan vəvətəndaşların ümumi və bölünməz vətənidir.", "Azərbaycan Respublikası bütün Azərbaycan Respublikası vətəndaşlarının ümumi və bölünməz vətənidir."]'::jsonb, 'Azərbaycan dövləti bütün Azərbaycan Respublikasında yaşayan insan vəvətəndaşların ümumi və bölünməz vətənidir.', 'AR Konstitusiyası Maddə 5 (Xalqın vahidliyi) — Düzgün cavab C variantıdır. Azərbaycan xalqı vahiddir və Azərbaycan dövlətinin əsasını təşkil edir.', 20, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f0e8eccb-98e2-46fb-8541-69033d77291f', '211c30a5-0cea-452c-8063-ca97135ff02e', '7d8c2ab7-a4d6-4e33-8e85-e0555d8e38a3', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının ərazisi haqqında fikirlərdən biri doğru deyil', 'multiple_choice',
    '["Azərbaycan Respublikasının ərazisi vahiddir, toxunulmazdır və bölünməzdir", "Azərbaycan Respublikasının daxili suları, Xəzər dənizinin (gölünün) Azərbaycan Respublikasına mənsub olan bölməsi, Azərbaycan Respublikasının üzərindəki hava məkanı Azərbaycan Respublikası ərazisinin tərkib hissəsidir", "Azərbaycan Respublikasının ərazisi özgəninkiləşdirilə bilməz", "Azərbaycan Respublikası öz ərazisinin heç bir hissəsini heç bir şəkildə kimsəyə vermir; yalnız Azərbaycan Respublikası Prezidentinin qərarı ilə Azərbaycanın bütün əhalisi arasında referendum keçirmək yolu ilə Azərbaycan xalqının iradəsi əsasında dövlət sərhədləri dəyişdirilə bilər."]'::jsonb, 'Azərbaycan Respublikası öz ərazisinin heç bir hissəsini heç bir şəkildə kimsəyə vermir; yalnız Azərbaycan Respublikası Prezidentinin qərarı ilə Azərbaycanın bütün əhalisi arasında referendum keçirmək yolu ilə Azərbaycan xalqının iradəsi əsasında dövlət sərhədləri dəyişdirilə bilər.', 'AR Konstitusiyası Maddə 11 (Ərazi) — Düzgün cavab D variantıdır. D bəndi səhvdir, çünki dövlət sərhədləri Prezidentin qərarı ilə deyil, yalnız ümumxalq referendumunda xalqın iradəsi ilə dəyişdirilə bilər (Maddə 3 və 11).', 21, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd0572c99-b861-4906-a1b6-5bed4c9a41b4', '211c30a5-0cea-452c-8063-ca97135ff02e', '7f82423b-cde6-4855-afc8-c475968a323c', 'Azərbaycan Respublikasının Konstitusiyasına əsasənqanunvericilik, icra və məhkəmə hakimiyyətləri necə fəaliyyət göstərir?', 'multiple_choice',
    '["Bu Konstitusiyanın müddəalarına əsasən birgə fəaliyyət göstərir və qarşılıqlı hesabat verir", "Bu Konstitusiyanın müddəalarına əsasən qarşılıqlı fəaliyyət göstərir və öz səlahiyyətləri çərçivəsində müstəqildirlər", "Bu Konstitusiyanın müddəalarına əsasən qarşılıqlı fəaliyyət göstərir və vətəndaşlara hesabat verir", "Bu Konstitusiyanın müddəalarına əsasən birgə fəaliyyət göstərir və beynəlxalq təşkilatlara hesabat verir"]'::jsonb, 'Bu Konstitusiyanın müddəalarına əsasən qarşılıqlı fəaliyyət göstərir və öz səlahiyyətləri çərçivəsində müstəqildirlər', 'AR Konstitusiyası Maddə 7.IV (Hakimiyyətlərin qarşılıqlı fəaliyyəti) — Düzgün cavab B variantıdır. Qanunvericilik, icra və məhkəmə hakimiyyətləri qarşılıqlı fəaliyyət göstərir və öz səlahiyyətləri çərçivəsində müstəqildirlər.', 22, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'be0b6b8e-b0b9-4a0a-9924-f982c27d8fb5', '211c30a5-0cea-452c-8063-ca97135ff02e', '8aa6c7ef-91ac-4e3b-84af-fa510c14d5e3', 'Azərbaycan Respublikasının suverenliyinin bütün ərazisinə şamil edilməsi ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarı Azərbaycan Respublikası ərazisində məcburi qüvvəyə malik deyil və dərc edilməlidir", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarı Azərbaycan Respublikası ərazisində məcburi qüvvəyə malikdir və ancaq dərc edilmir", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarı Azərbaycan Respublikası ərazisində və ondan kənarda məcburi qüvvəyə malikdir və dərc edilməlidir", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarı Azərbaycan Respublikası ərazisində məcburi qüvvəyə malikdir və dərc edilməlidir"]'::jsonb, 'Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarı Azərbaycan Respublikası ərazisində məcburi qüvvəyə malikdir və dərc edilməlidir', 'AR Konstitusiyası Maddə 11.I (Ərazi) — Düzgün cavab D variantıdır. Azərbaycan Respublikasının suverenliyi onun bütün ərazisinə şamil edilir.', 23, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5632cd91-e409-4aa6-a8f4-81176df5fb15', '211c30a5-0cea-452c-8063-ca97135ff02e', '8e0b2fb0-733c-4cc1-bb5e-e7a0c2c908b5', 'Azərbaycan Respublikasının Konstitusiyasına görə məntiqi uyğunluğu müəyyən edin:
1. Fikir və söz azadlığı
2. Vicdan azadlığı
3. ..............', 'multiple_choice',
    '["Sərbəst toplaşmaq", "Şərəf və ləyaqətin müdafiəsi", "Təhsil almaq", "Sağlamlığın qorunması"]'::jsonb, 'Sərbəst toplaşmaq', 'AR Konstitusiyası — Düzgün cavab A variantıdır.', 24, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3a4c1a24-edbf-4b41-86c6-e85d2b43f0f7', '211c30a5-0cea-452c-8063-ca97135ff02e', '9330d831-dc56-46bb-905b-6512cc1d28b2', 'Azərbaycan Respublikası Konstitusiyasının preambulasında Azərbaycan xalqı hansı aktda əks olunan prinsipləri əsas götürür?', 'multiple_choice',
    '["\"Azərbaycan Respublikasında Ümumxalq səsverməsinin təmin edilməsi haqqında\"Konstitusiya Aktında əks olunan prinsipləri.", "\"Azərbaycan Respublikasının dövlət müstəqilliyi haqqında\"Konstitusiya Aktında əks olunan prinsipləri.", "\"Azərbaycan Respublikasının dövlət suverenliyi haqqında\"Konstitusiya Aktında əks olunan prinsipləri.", "\"Azərbaycan Respublikasının dövlətçiliyi haqqında\"Konstitusiya Aktında əks olunan prinsipləri."]'::jsonb, '"Azərbaycan Respublikasının dövlət müstəqilliyi haqqında"Konstitusiya Aktında əks olunan prinsipləri.', 'AR Konstitusiyası Preambula — Düzgün cavab B variantıdır. Preambula ''Azərbaycan Respublikasının dövlət müstəqilliyi haqqında'' 1991-ci il 18 oktyabr tarixli Konstitusiya Aktında əks olunan prinsipləri əsas götürür.', 25, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '442cdd27-5b5c-4e02-b8fb-11104d720e2c', '211c30a5-0cea-452c-8063-ca97135ff02e', '98005460-5708-47fe-9ce3-deeb2767fa11', 'Azərbaycan Respublikasının Konstitusiyasına əsasən xalqı təmsil etmək hüququna aid deyil', 'multiple_choice',
    '["Xalqın seçdiyi səlahiyyətli nümayəndələrindən başqa heç kəsin xalqı təmsil etmək hüququ yoxdur.", "Xalqın seçdiyi səlahiyyətli nümayəndələrindən başqa heç kəsin xalqın adından danışmaq hüququ yoxdur.", "Xalqın seçdiyi səlahiyyətli nümayəndələrindən başqa heç kəsin xalqın adından müraciət etmək hüququ yoxdur.", "Xalqın seçdiyi səlahiyyətli nümayəndələrindən başqa heç kəsin xalqı təmsil etmək, öz adından danışmaq və xalqın adından müraciət etmək hüququ yoxdur."]'::jsonb, 'Xalqın seçdiyi səlahiyyətli nümayəndələrindən başqa heç kəsin xalqı təmsil etmək, öz adından danışmaq və xalqın adından müraciət etmək hüququ yoxdur.', 'AR Konstitusiyası Maddə 4 (Xalqı təmsil etmək hüququ) — Düzgün cavab D variantıdır. Yalnız xalqın seçdiyi səlahiyyətli nümayəndələrin (Prezident, MM deputatları, bələdiyyə üzvləri) xalqı təmsil etmək, xalqın adından danışmaq və müraciət etmək hüququ vardır.', 26, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8063ae35-9030-4422-aada-50d27ec8a8ff', '211c30a5-0cea-452c-8063-ca97135ff02e', 'aae8828c-3879-4955-afed-fb261794785d', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı dinlərin (dini cərəyanların) yayılması və təbliği qadağandır?', 'multiple_choice',
    '["İnsan ləyaqətini alçaldan və ya insanpərvərlik prinsiplərinə zidd olan dinlərin (dini cərəyanların) yayılması və təbliği qadağandır;", "Qeyri-ənənəvi dinlərin (dini cərəyanların) yayılması və təbliği qadağandır;", "Bütpərəst və çoxallahlığa əsaslanan dinlərin (dini cərəyanların) yayılması və təbliği qadağandır;", "İslam dinindən başqa, bütün dinlərin (dini cərəyanların) yayılması və təbliği qadağandır."]'::jsonb, 'İnsan ləyaqətini alçaldan və ya insanpərvərlik prinsiplərinə zidd olan dinlərin (dini cərəyanların) yayılması və təbliği qadağandır;', 'AR Konstitusiyası Maddə 18 (Din və dövlət) — Düzgün cavab A variantıdır. Din dövlətdən ayrıdır, bütün dini etiqadlar qanun qarşısında bərabərdir, dövlət təhsil sistemi dünyəvidir. İnsan ləyaqətini alçaldan dini cərəyanların yayılması qadağandır.', 27, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b47ba457-6d51-42e1-ab48-4b06ddbbf421', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ad597b65-b24b-4880-a870-6a4d0c0f67c5', 'Azərbaycan Respublikasının Konstitusiyasının birinci bölməsi və birinci fəslini seçin', 'multiple_choice',
    '["Ümumi müddəalar və hakimiyyətin mənbəyi", "Ümumi müddəalar və dövlətin əsasları", "Ümumi müddəalar və xalq hakimiyyəti", "Ümumi müddəalar və əsas hüquqlar,azadlıqlar və vəzifələr"]'::jsonb, 'Ümumi müddəalar və xalq hakimiyyəti', 'AR Konstitusiyası I Bölmə (Ümumi müddəalar) — Düzgün cavab C variantıdır. I Bölmə 2 fəsildən (I Fəsil: Xalq hakimiyyəti, II Fəsil: Dövlətin əsasları) və 23 maddədən ibarətdir.', 28, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ea996667-3280-4c16-98b8-97d1a14de773', '211c30a5-0cea-452c-8063-ca97135ff02e', 'b87fcc59-d92f-4217-84c9-103e8c848303', 'Azərbaycan Respublikasının suverenliyinin bütün ərazisinə şamil edilməsi ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının bütün ərazisində və ayrı-ayrı yerlərində fövqəladə vəziyyət tətbiq edir və bu barədə qəbul etdiyi fərmanı 24 saat müddətində Azərbaycan Respublikası Milli Məclisinin təsdiqinə verir.", "Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının ayrı-ayrı yerlərində fövqəladə vəziyyət tətbiq edir və bu barədə qəbul etdiyi sərəncamı 24 saat müddətində Azərbaycan Respublikası Milli Məclisinin təsdiqinə verir", "Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının ayrı-ayrı yerlərində fövqəladə vəziyyət tətbiq edir və bu barədə qəbul etdiyi fərmanı 24 saat müddətində Azərbaycan Respublikası Milli Məclisinin razılığına verir", "Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının ayrı-ayrı yerlərində fövqəladə vəziyyət tətbiq edir və bu barədə qəbul etdiyi fərmanı 24 saat müddətində Azərbaycan Respublikası Milli Məclisinin təsdiqinə verir"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının ayrı-ayrı yerlərində fövqəladə vəziyyət tətbiq edir və bu barədə qəbul etdiyi fərmanı 24 saat müddətində Azərbaycan Respublikası Milli Məclisinin təsdiqinə verir', 'AR Konstitusiyası Maddə 11.I (Ərazi) — Azərbaycan Respublikasının suverenliyi onun bütün ərazisinə şamil edilir.', 29, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cd111ec6-947d-4459-89ec-a170d4b962b8', '211c30a5-0cea-452c-8063-ca97135ff02e', 'bb5dd544-15ef-471c-8b4e-59e97f46b722', 'Azərbaycan Respublikası Konstitusiyasının preambulasında təntənəli surətdə niyyətlərini bəyan edən subyekt hansıdır?', 'multiple_choice',
    '["Azərbaycan Dövləti", "Azərbaycan Respublikası", "Azərbaycan hakimiyyəti", "Azərbaycan xalqı"]'::jsonb, 'Azərbaycan xalqı', 'AR Konstitusiyası Preambula — Düzgün cavab D variantıdır. Niyyətləri təntənəli surətdə bəyan edən subyekt Azərbaycan xalqıdır.', 30, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '38dcbf34-a60b-464e-8192-fb7c2a1ed225', '211c30a5-0cea-452c-8063-ca97135ff02e', 'bf3c5cf1-b1eb-448a-ad82-00ac58151c6c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının dövlət dilinin Azərbaycan dili olması hansı maddədə öz əksini tapmışdır?', 'multiple_choice',
    '["23-cü maddədə", "20-ci maddədə", "21-ci maddədə", "19-cu maddədə"]'::jsonb, '21-ci maddədə', 'AR Konstitusiyası Maddə 21 (Dövlət dili) — Düzgün cavab C variantıdır. Azərbaycan Respublikasının dövlət dili Azərbaycan dilidir. Dövlət başqa dillərin sərbəst işlədilməsini və inkişafını təmin edir.', 31, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd011a7b7-0657-46a7-988c-e08a2fda0e15', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ca4e2b6f-21f5-4dc4-8066-55cfffcda3f1', 'Konstitusiyaya əsasən Azərbaycan Respublikası başqa dövlətlərlə beynəlxalq münasibətlər qurur:', 'multiple_choice',
    '["Hamılıqla qəbul edilmiş beynəlxalq hüquq normalarında nəzərdə tutulan prinsiplər əsasında", "Konstitusiya məhkəmsinin təsdiq etdiyi prinsip və qaydalar əsasında", "Xalqın mənafeyinə uyğun gələn və Prerzidentin imzaladığı sərəncamlar əsasında", "Milli Məclisin müəyyən etdiyi ümumi qaydalar əsasında"]'::jsonb, 'Hamılıqla qəbul edilmiş beynəlxalq hüquq normalarında nəzərdə tutulan prinsiplər əsasında', 'AR Konstitusiyası Maddə 10 (Beynəlxalq münasibətlərin prinsipləri) — Düzgün cavab A variantıdır. AR başqa dövlətlərlə münasibətlərini hamılıqla qəbul edilmiş beynəlxalq hüquq normaları və prinsipləri əsasında qurur.', 32, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e239c70f-3d8e-4d05-b025-9979213e2c50', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ceb4b19f-c786-4610-a159-bfdcc1388ceb', 'Din və dövlət maddəsinə aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikasında din dövlətdən ayrıdır.", "Bütün dini etiqadlar qanun qarşısında bərabərdir.", "Dövlət təhsil sistemi dünyəvi xarakter daşıyır.", "Təhsil sisteminə dövlət tərəfindən nəzarət edilir."]'::jsonb, 'Təhsil sisteminə dövlət tərəfindən nəzarət edilir.', 'AR Konstitusiyası Maddə 18 (Din və dövlət) — Düzgün cavab D variantıdır. Din dövlətdən ayrıdır, bütün dini etiqadlar qanun qarşısında bərabərdir, dövlət təhsil sistemi dünyəvidir. İnsan ləyaqətini alçaldan dini cərəyanların yayılması qadağandır.', 33, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '20447401-daef-4084-9d54-284682788e71', '211c30a5-0cea-452c-8063-ca97135ff02e', 'd1060574-b699-43cb-8d12-08a909f6a899', 'Azərbaycan Respublikasının Konstitusiyasına əsasən dövlətin ali məqsədi nədən ibarətdir?', 'multiple_choice',
    '["Azərbaycan Respublikasının vətəndaşlarına layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir", "İnsan və vətəndaş hüquqlarının və azadlıqlarının təmin edilməsi dövlətin ali məqsədidir", "İnsan və vətəndaş hüquqlarının və azadlıqlarının, Azərbaycan Respublikasının vətəndaşlarına layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir", "İnsan və vətəndaş hüquqlarının və azadlıqlarının, Azərbaycan Respublikasının vətəndaşlarına və əcnəbi, vətəndaşlığı olmayan şəxslərə layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir"]'::jsonb, 'İnsan və vətəndaş hüquqlarının və azadlıqlarının, Azərbaycan Respublikasının vətəndaşlarına layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir', 'AR Konstitusiyası Maddə 12 (Dövlətin ali məqsədi) — Düzgün cavab C variantıdır. İnsan və vətəndaş hüquq və azadlıqlarının, vətəndaşlara layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir.', 34, NULL, 'İnsan hüquqları və layiqli həyat səviyyəsinin təmini dövlətin ali məqsədidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a7a7e819-1225-40d7-a8af-a1c55924050c', '211c30a5-0cea-452c-8063-ca97135ff02e', 'd8388b1f-42f6-4d92-a770-d8714d18a784', 'Azərbaycan Respublikasının Konstitusiyasına görə məntiqi uyğunluğu müəyyən edin:
1. Şəxsi toxunulmazlıq
2. Mənzil toxunulmazlığı
3. ...', 'multiple_choice',
    '["Sağlam ətraf mühitdə yaşamaq", "Ətraf mühitin qorunması", "Vətənə sədaqət", "Dövlət rəmzlərinə hörmət"]'::jsonb, 'Sağlam ətraf mühitdə yaşamaq', 'AR Konstitusiyası — Düzgün cavab A variantıdır.', 35, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ed4ed481-fb0a-4885-837b-52481881602e', '211c30a5-0cea-452c-8063-ca97135ff02e', 'd9a92d18-f183-4951-8204-fd8727f2c9ff', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakılardan hansı düzgündür?', 'multiple_choice',
    '["Azərbaycan dövləti xalqın, əcnəbilərin, vətəndaşlığı olmayan şəxslərin rifahının yüksəldilməsi, onların sosial müdafiəsi və layiqli həyat səviyyəsi qayğısına qalır", "Azərbaycan dövləti xalqın və hər bir vətəndaşın rifahının yüksəldilməsi, onun sosial müdafiəsi və layiqli həyat səviyyəsi qayğısına qalır", "Azərbaycan dövləti xalqın və hər bir vətəndaşın rifahının yüksəldilməsi, onun maddi-sosial müdafiəsi və layiqli həyat səviyyəsi qayğısına qalır", "Azərbaycan dövləti xalqın və hər bir vətəndaşın rifahının yüksəldilməsi, onun hər tərəfli müdafiəsi və layiqli həyat səviyyəsi qayğısına qalır"]'::jsonb, 'Azərbaycan dövləti xalqın və hər bir vətəndaşın rifahının yüksəldilməsi, onun sosial müdafiəsi və layiqli həyat səviyyəsi qayğısına qalır', 'AR Konstitusiyası Maddə 16 (Sosial inkişaf və dövlət) — Düzgün cavab B variantıdır. Dövlət xalqın və hər bir vətəndaşın rifahının yüksəldilməsi, sosial müdafiəsi və layiqli həyat səviyyəsinin qayğısına qalır, mədəniyyət, təhsil, səhiyyə və elmin inkişafına yardım edir.', 36, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fad9a659-aa14-44c3-9ae0-03a0e374180e', '211c30a5-0cea-452c-8063-ca97135ff02e', 'de127bdc-436c-42ae-ad33-e3b089890c53', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasında iqtisadiyyatın inkişafı xidmət edir:', 'multiple_choice',
    '["Azərbaycan Respublikasında iqtisadiyyatın inkişafı bazar münasibətləri əsasında sosial yönümlü iqtisadiyyatın inkişafına xidmət edir", "Azərbaycan Respublikasında iqtisadiyyatın inkişafı azad sahibkarlığın təminatına xidmət edir", "Azərbaycan Respublikasında iqtisadiyyatın inkişafı iqtisadi münasibətlərdə inhisarçılığa və haqsız rəqabətə yol verilməməsinə xidmət edir", "Azərbaycan Respublikasında iqtisadiyyatın inkişafı müxtəlif mülkiyyət növlərinə əsaslanaraq xalqın rifahının yüksəldilməsinə xidmət edir."]'::jsonb, 'Azərbaycan Respublikasında iqtisadiyyatın inkişafı müxtəlif mülkiyyət növlərinə əsaslanaraq xalqın rifahının yüksəldilməsinə xidmət edir.', 'AR Konstitusiyası Maddə 13 (Mülkiyyət) — Düzgün cavab D variantıdır. Mülkiyyət toxunulmazdır və dövlət tərəfindən müdafiə olunur. Xüsusi, dövlət və bələdiyyə mülkiyyəti növləri bərabər hüquqa malikdir.', 37, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '05bd9b82-f77a-4b47-86e4-26a6a5a98ca4', '211c30a5-0cea-452c-8063-ca97135ff02e', 'e0071b81-f0fe-42d2-ba2d-0cbe371f82c9', 'Azərbaycan Respublikasının Konstitusiyasına görə Sakit okean adalarında yerləşən  Nauru dövləti Azərbaycan Respublikasının tərkib hissəsi olmaq niyyətindədir. Bununla bağlı həmin dövlət bütün şərtləri yerinə yetirməyə hazırdır. Azərbaycan Respublikasına inzibati bölgə kimi Nauru dövlətinin daxil olması üçün Azərbaycan dövləti nə etməlidir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisində növbədənkənar iclas keçirilməlidir və qərar qəbul edilməlidir", "Azərbaycan Respublikasının Prezidentinin fərmanına əsasən ümumxalq səsverməsi – referendum keçirilməlidir.", "Azərbaycan Respublikasının Xarici İşlər Nazirliyinin Prezidentə təqdimatı əsasında Azərbaycan Respublikasının əhalisi arasında ümumxalq səsverməsi – referendum keçirilməlidir.", "Azərbaycan Respublikasının əhalisi arasında ümumxalq səsverməsi – referendum keçirilməlidir."]'::jsonb, 'Azərbaycan Respublikasının əhalisi arasında ümumxalq səsverməsi – referendum keçirilməlidir.', 'AR Konstitusiyası Maddə 10 (Beynəlxalq münasibətlərin prinsipləri) — Düzgün cavab D variantıdır. AR başqa dövlətlərlə münasibətlərini hamılıqla qəbul edilmiş beynəlxalq hüquq normaları və prinsipləri əsasında qurur.', 38, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2f36c8e6-1449-4556-8d6f-ca6441bbbbd7', '211c30a5-0cea-452c-8063-ca97135ff02e', 'e036a295-747b-4474-bfa3-fa5dcc0c54cf', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq doğru olan bəndi müəyyən edin:
1. Azərbaycan Respublikasının pul vahidi manatdır.
2. Pul nişanlarının tədavülə buraxılması və tədavüldən çıxarılması hüququ Mərkəzi Bank və Beynəlxalq Banka mənsubdur.
3. Azərbaycan Respublikasının Mərkəzi Bankı dövlətin müstəsna mülkiyyətindədir.
4. Azərbaycan Respublikasının ərazisində manatdan başqa pul vahidlərinin ödəniş vasitəsi kimi işlədilməsi qanunla müəyyən olunmuş hallarda mümkündür', 'multiple_choice',
    '["1,2", "2,3", "1,3", "1,3,4"]'::jsonb, '1,3', 'AR Konstitusiyası Maddə 11 (Ərazi) — Düzgün cavab C variantıdır. AR ərazisi vahiddir, toxunulmazdır və bölünməzdir; özgəninkiləşdirilə bilməz.', 39, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '65b5ec37-fec1-4312-a3d8-9e2125463694', '211c30a5-0cea-452c-8063-ca97135ff02e', 'e0a94b21-e044-4c10-86c9-f850e268173c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakılardan hansı düzgündür?', 'multiple_choice',
    '["Azərbaycan dövləti mədəniyyətin, təhsilin, səhiyyənin, elmin, incəsənətin, iqtisadiyyatın inkişafına yardım göstərir, ölkənin təbiətini, xalqın tarixi, maddi və mənəvi irsini qoruyur", "Azərbaycan dövləti mədəniyyətin, təhsilin, səhiyyənin, elmin, incəsənətin inkişafına yardım göstərir, ölkənin təbiətini, xalqın tarixi, maddi və mənəvi irsini qoruyur", "Azərbaycan dövləti mədəniyyətin, təhsilin, səhiyyənin, elmin, tədqiqat işlərinin, incəsənətin inkişafına yardım göstərir, ölkənin təbiətini, xalqın tarixi, maddi və mənəvi irsini qoruyur", "Azərbaycan dövləti mədəniyyətin, təhsilin, səhiyyənin, elmin, incəsənətin inkişafına yardım göstərir, ölkənin təbiətini, bütün xalqların tarixi, maddi və mənəvi irsini qoruyur"]'::jsonb, 'Azərbaycan dövləti mədəniyyətin, təhsilin, səhiyyənin, elmin, incəsənətin inkişafına yardım göstərir, ölkənin təbiətini, xalqın tarixi, maddi və mənəvi irsini qoruyur', 'AR Konstitusiyası Maddə 16 (Sosial inkişaf və dövlət) — Dövlət xalqın və hər bir vətəndaşın rifahının yüksəldilməsi, sosial müdafiəsi və layiqli həyat səviyyəsinin qayğısına qalır, mədəniyyət, təhsil, səhiyyə və elmin inkişafına yardım edir.', 40, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e0079b27-2435-4214-bd99-2e95c189dfb6', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ec1f2b7d-95a0-450c-8ad6-5bd8dbf77130', 'Azərbaycan Respublikasının Konstitusiyasında sadalanan insan və vətəndaş hüquqları və azadlıqları necə tətbiq edilir?', 'multiple_choice',
    '["Konstitusiyada sadalanan insan və vətəndaş hüquqları və azadlıqları Azərbaycan Respublikasının qanunvericiliyinə uyğun tətbiq edilir;", "Konstitusiyada sadalanan insan və vətəndaş hüquqları və azadlıqları Azərbaycan Respublikası Prezidentinin müəyyən etdiyi qaydalara uyğun tətbiq edilir;", "Konstitusiyada sadalanan insan və vətəndaş hüquqları və azadlıqları Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrə uyğun tətbiq edilir;", "Konstitusiyada sadalanan insan və vətəndaş hüquqları və azadlıqları haqq-ədalətə və qanunçuluğa uyğun tətbiq edilir."]'::jsonb, 'Konstitusiyada sadalanan insan və vətəndaş hüquqları və azadlıqları Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrə uyğun tətbiq edilir;', 'AR Konstitusiyası Maddə 12 (Dövlətin ali məqsədi) — Düzgün cavab C variantıdır. İnsan və vətəndaş hüquq və azadlıqlarının, vətəndaşlara layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir.', 41, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'dffe9b7e-3b86-4abc-b344-2e9ed3f2545b', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ed46772e-e50b-4d04-be36-c45b9e3e9d9d', 'Azərbaycan Respublikasının Konstitusiyasının qəbul tarixi və layihə komissiyası ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti Heydər Əliyevin sədrliyi ilə Azərbaycan Respublikasının yeni Konstitusiya layihəsini hazırlayan komissiya tərəfindən hazırlanmış, 1995-ci il noyabrın 27-də ümumxalq səsverməsində (referendumda) qəbul edilmişdir.", "Azərbaycan Respublikasının Prezidenti Heydər Əliyevin sədrliyi ilə Azərbaycan Respublikasının yeni Konstitusiya layihəsini hazırlayan komissiya tərəfindən hazırlanmış, 2002-ci il noyabrın 12-də ümumxalq səsverməsində (referendumda) qəbul edilmişdir.", "Azərbaycan Respublikasının Prezidenti Heydər Əliyevin sədrliyi ilə Azərbaycan Respublikasının yeni Konstitusiya layihəsini hazırlayan komissiya tərəfindən hazırlanmış, 1995-ci il noyabrın 12-də ümumxalq səsverməsində (referendumda) qəbul edilmişdir.", "Azərbaycan Respublikasının Prezidenti Heydər Əliyevin sədrliyi ilə Azərbaycan Respublikasının yeni Konstitusiya layihəsini hazırlayan komissiya tərəfindən hazırlanmış, 1995-ci il noyabrın 12-də Milli Məclisin Plenar iclasında qəbul edilmişdir."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti Heydər Əliyevin sədrliyi ilə Azərbaycan Respublikasının yeni Konstitusiya layihəsini hazırlayan komissiya tərəfindən hazırlanmış, 1995-ci il noyabrın 12-də ümumxalq səsverməsində (referendumda) qəbul edilmişdir.', 'AR Konstitusiyası Preambula — Düzgün cavab C variantıdır. Konstitusiya Heydər Əliyevin sədrliyi ilə komissiya tərəfindən hazırlanmış, 1995-ci il noyabrın 12-də referendumda qəbul edilmiş və noyabrın 27-də qüvvəyə minmişdir.', 42, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '18c59fc4-34f8-47fb-872f-3e68c322c411', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ef1ecacb-ee81-40ce-b830-40b241a0e349', 'Azərbaycan Respublikasının Konstitusiyasına əsasən ümumxalq səsverməsi-referendum yolu ilə həll edilən məsələlər maddəsinə görə doğrudur', 'multiple_choice',
    '["Azərbaycan xalqı öz hüquqları və mənafeləri ilə bağlı olan bir çox məsələni referendumla həll edə bilər.", "Azərbaycan Respublikası Konstitusiyasının qəbul edilməsi və ona dəyişikliklər edilməsi məsələsi digər üsullarla yanaşı referendumla da həll oluna bilər", "Azərbaycan Respublikasının dövlət sərhədlərinin dəyişdirilməsi yalnız referendumla da həll oluna bilər", "seçilməsi, təyin edilməsi və ya təsdiq edilməsi müvafiq olaraq qanunvericilik və (və ya) icra hakimiyyəti orqanlarının, habelə Azərbaycan Respublikasının xalqının səlahiyyətlərinə aid edilmiş vəzifəli şəxslərin seçilməsi, təyin edilməsi və ya təsdiq edilməsi üzrə referendum keçirilə bilməz"]'::jsonb, 'Azərbaycan Respublikasının dövlət sərhədlərinin dəyişdirilməsi yalnız referendumla da həll oluna bilər', 'AR Konstitusiyası Maddə 3.II (Referenduma çıxarıla bilməyən məsələlər) — Düzgün cavab C variantıdır. Vergilər və dövlət büdcəsi; amnistiya və əfv etmə; seçilməsi/təyini qanunvericilik və (və ya) icra orqanlarının səlahiyyətinə aid şəxslərin seçilməsi/təyini referenduma çıxarıla bilməz.', 43, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '76c3eefb-b56c-4339-86d2-7d99fdf46123', '211c30a5-0cea-452c-8063-ca97135ff02e', 'f5891941-e376-468a-a201-d6d93d9aa958', 'Azərbaycan Respublikasının Konstitusiyasına əsasən mülkiyyət hansı növlərdə ola bilər?', 'multiple_choice',
    '["Mülkiyyət dövlət mülkiyyəti, xüsusi mülkiyyət və bələdiyyə mülkiyyəti növündə ola bilər;", "Mülkiyyət dövlət mülkiyyəti, ümumxalq mülkiyyəti və xüsusi mülkiyyət növündə ola bilər;", "Mülkiyyət dövlət mülkiyyəti, xüsusi mülkiyyət və ictimai mülkiyyəti növündə ola bilər;", "Mülkiyyət ümumxalq mülkiyyəti, ictimai mülkiyyət və özəl mülkiyyət növündə ola bilər."]'::jsonb, 'Mülkiyyət dövlət mülkiyyəti, xüsusi mülkiyyət və bələdiyyə mülkiyyəti növündə ola bilər;', 'AR Konstitusiyası Maddə 13 (Mülkiyyət) — Düzgün cavab A variantıdır. Mülkiyyət toxunulmazdır və dövlət tərəfindən müdafiə olunur. Xüsusi, dövlət və bələdiyyə mülkiyyəti növləri bərabər hüquqa malikdir.', 44, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2ffb05ea-7a22-4409-b1f6-25facf38d756', '211c30a5-0cea-452c-8063-ca97135ff02e', 'f8611958-daf3-4ab0-8669-433dd9aa8d0e', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Prezidenti nələrin təminatçısıdır?
1)Azərbaycan dövlətinin müstəqilliyinin
2)Seçkilərin
3) Azərbaycan dövlətinin ərazi bütövlüyünün
4)Hakimlərin toxunulmazlığının
5)beynəlxalq müqavilələrə riayət olunmasının
6)Məhkəmə hakimiyyətinin müstəqilliyinin', 'multiple_choice',
    '["1,2,3", "2,3,5", "2,3,4", "1,3,6"]'::jsonb, '1,3,6', 'AR Konstitusiyası Maddə 12 (Dövlətin ali məqsədi) — Düzgün cavab D variantıdır. İnsan və vətəndaş hüquq və azadlıqlarının, vətəndaşlara layiqli həyat səviyyəsinin təmin edilməsi dövlətin ali məqsədidir.', 45, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '315b81c2-9786-4d86-83b1-a10fd39fa2e3', '211c30a5-0cea-452c-8063-ca97135ff02e', 'f97d3ae8-b045-48d5-94b8-0466c21cbe22', 'Azərbaycan Respublikasının Konstitusiyasına əsasən mülkiyyətdən istifadə hüququ necə məhdudlaşdırılır?', 'multiple_choice',
    '["Mülkiyyətdən dövlət orqanlarının və vəzifəli şəxslərin mənafeləri, vətəndaşın ləyaqəti əleyhinə istifadə edilə bilməz;", "Mülkiyyətdən Konstitusiyanın “Ümumi müddəalar” bölməsində nəzərdə tutulanlar əleyhinə istifadə edilə bilməz;", "Mülkiyyətdən insan və vətəndaş hüquqları və azadlıqları, cəmiyyətin və dövlətin mənafeləri, şəxsiyyətin ləyaqəti əleyhinə istifadə edilə bilməz;", "Azərbaycan Respublikasının Konstitusiyasında mülkiyyətdən istifadə hüququ məhdudlaşdırılmır."]'::jsonb, 'Mülkiyyətdən insan və vətəndaş hüquqları və azadlıqları, cəmiyyətin və dövlətin mənafeləri, şəxsiyyətin ləyaqəti əleyhinə istifadə edilə bilməz;', 'AR Konstitusiyası Maddə 13 (Mülkiyyət) — Düzgün cavab C variantıdır. Mülkiyyət toxunulmazdır və dövlət tərəfindən müdafiə olunur. Xüsusi, dövlət və bələdiyyə mülkiyyəti növləri bərabər hüquqa malikdir.', 46, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5a30b713-43f9-409b-945c-630095a7c886', '211c30a5-0cea-452c-8063-ca97135ff02e', 'fbe6b5cc-2ffa-41cb-87a0-5e7b1d63d2c1', 'Azərbaycan Respublikasının Konstitusiyasına əsasən təbii ehtiyatlar kimə mənsubdur?', 'multiple_choice',
    '["Təbii ehtiyatlar Azərbaycan Respublikasıın hüquqlarına və mənafelərinə xələl gətirmədən hər hansı fiziki və ya hüquqi şəxslərə mənsubdur.", "Təbii ehtiyatlar Azərbaycan Respublikasıın hüquqlarına və mənafelərinə xələl gətirmədən dövlətin konsessiya verdiyi hər bir vətəndaşa mənsubdur", "Təbii ehtiyatlar Azərbaycan Respublikasıın hüquqlarına və mənafelərinə xələl gətirmədən yalnız hüquqi şəxslərə mənsubdur.", "Təbii ehtiyatlar hər hansı fiziki və ya hüquqi şəxslərin hüquqlarına və mənafelərinə xələl gətirmədən Azərbaycan Respublikasına mənsubdur."]'::jsonb, 'Təbii ehtiyatlar hər hansı fiziki və ya hüquqi şəxslərin hüquqlarına və mənafelərinə xələl gətirmədən Azərbaycan Respublikasına mənsubdur.', 'AR Konstitusiyası Maddə 14 (Təbii ehtiyatlar) — Düzgün cavab D variantıdır. Təbii ehtiyatlar hər hansı fiziki və ya hüquqi şəxslərin hüquqlarına və mənafelərinə xələl gətirmədən Azərbaycan Respublikasına mənsubdur.', 47, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2db687e3-05e6-462c-9caf-7ea2454ba2d1', '211c30a5-0cea-452c-8063-ca97135ff02e', 'ff3772ee-d38f-49be-aed2-7fab844bb9ec', 'Azərbaycan Respublikasında dövlət hakimiyyəti daxili və xarici məsələlərdə necə məhdudlaşır?', 'multiple_choice',
    '["Azərbaycan Respublikasında dövlət hakimiyyəti daxili məsələlərdə yalnız qanunla xarici məsələlərdə isə yalnız Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdən irəli gələn müddəalarla məhdudlaşır.", "Azərbaycan Respublikasında dövlət hakimiyyəti daxili məsələlərdə yalnız hüquqla xarici məsələlərdə isə yalnız Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdən irəli gələn müddəalarla məhdudlaşır.", "Azərbaycan Respublikasında dövlət hakimiyyəti daxili məsələlərdə yalnız hüquqla xarici məsələlərdə isə yalnız Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq hüquq normalarından irəli gələn müddəalarla məhdudlaşır.", "Azərbaycan Respublikasında dövlət hakimiyyəti daxili məsələlərdə yalnız qanunla xarici məsələlərdə isə yalnız Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdən irəli gələn müddəalarla və digər normativ xarakterli aktlarla məhdudlaşır."]'::jsonb, 'Azərbaycan Respublikasında dövlət hakimiyyəti daxili məsələlərdə yalnız hüquqla xarici məsələlərdə isə yalnız Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdən irəli gələn müddəalarla məhdudlaşır.', 'AR Konstitusiyası Maddə 7.II (Dövlət hakimiyyətinin hüdudları) — Düzgün cavab B variantıdır. AR dövlət hakimiyyəti daxili məsələlərdə yalnız hüquqla, xarici məsələlərdə isə yalnız beynəlxalq müqavilələrlə məhdudlaşır.', 48, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 1/2: Maddə 24-45)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '58b1a5a4-8235-4d6e-af90-fd24f212c767', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 1/2: Maddə 24-45)', 'Bərabərlik, Yaşamaq, Azadlıq, Mülkiyyət, Şəxsi toxunulmazlıq, Nikah, Əmək, Sosial təminat, Təhsil hüquqları.',
    'Hüquq', 'medium', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '71a4ee1d-7173-4e5d-a39e-380a94e96bfa', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '03694d2f-6c84-45fc-97f6-784d85e87dfa', 'Azərbaycan Respublikasının Konstitusiyasına əsasən təhsil hüququna aiddir', 'multiple_choice',
    '["Hər bir vətəndaşın təhsil almaq hüququ vardır.", "Hər bir şəxsin təhsil almaq hüququ vardır.", "Hər kəsin təhsil almaq hüququ vardır.", "Təhsil yaşına çatan hər bir şəxsin təhsil almaq hüququ vardır."]'::jsonb, 'Hər bir vətəndaşın təhsil almaq hüququ vardır.', 'AR Konstitusiyası Maddə 42 (Təhsil hüququ) — Düzgün cavab A variantıdır. Dövlət pulsuz icbari ümumi orta təhsil almaq hüququnu təmin edir və istedadlı şəxslərin maddi vəziyyətindən asılı olmayaraq təhsilini davam etdirməsinə zəmanət verir.', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e00e737a-4e64-44db-82bc-30811b76d283', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '078a66f9-aa2b-4570-9fde-a234b2d440c4', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı hallarda vətəndaşlara tələb olunan işləri gördürmək hallarına yol verilir?', 'multiple_choice',
    '["Məhkəmə qərarı əsasında şərtləri və müddətləri qərarla nəzərdə tutulan məcburi əməyə cəlb etmək, hərbi xidmət zamanı səlahiyyətli şəxslərin əmrlərinin yerinə yetirilməsi ilə əlaqədar işlətmək, fövqəladə vəziyyət zamanı və hәrbi vəziyyət vətəndaşlara tələb olunan işləri gördürmək hallarına yol verilir.", "Məhkəmə qərarı əsasında şərtləri və müddətləri qanunla nəzərdə tutulan məcburi əməyə cəlb etmək, hərbi xidmət zamanı bütün şəxslərin əmrlərinin yerinə yetirilməsi ilə əlaqədar işlətmək, fövqəladə vəziyyət zamanı və hәrbi vəziyyət vətəndaşlara tələb olunan işləri gördürmək hallarına yol verilir.", "Məhkəmə qərarı əsasında şərtləri və müddətləri qanunla nəzərdə tutulan məcburi əməyə cəlb etmək, hərbi xidmət zamanı səlahiyyətli şəxslərin əmrlərinin yerinə yetirilməsi ilə əlaqədar işlətmək, fövqəladə vəziyyət zamanı və hәrbi vəziyyət vətəndaşlara tələb olunan işləri zorla gördürmək hallarına yol verilir.", "Məhkəmə qərarı əsasında şərtləri və müddətləri qanunla nəzərdə tutulan məcburi əməyə cəlb etmək, hərbi xidmət zamanı səlahiyyətli şəxslərin əmrlərinin yerinə yetirilməsi ilə əlaqədar işlətmək, fövqəladə vəziyyət zamanı və hәrbi vəziyyət vətəndaşlara tələb olunan işləri gördürmək hallarına yol verilir."]'::jsonb, 'Məhkəmə qərarı əsasında şərtləri və müddətləri qanunla nəzərdə tutulan məcburi əməyə cəlb etmək, hərbi xidmət zamanı səlahiyyətli şəxslərin əmrlərinin yerinə yetirilməsi ilə əlaqədar işlətmək, fövqəladə vəziyyət zamanı və hәrbi vəziyyət vətəndaşlara tələb olunan işləri gördürmək hallarına yol verilir.', 'AR Konstitusiyası Maddə 35 (Əmək hüququ) — Düzgün cavab D variantıdır. Hər kəsin sərbəst surətdə fəaliyyət növü, peşə və iş yeri seçmək hüququ vardır. Məcburi əmək qadağandır. Dövlət işsizliyin aradan qaldırılması üçün imkanlarından istifadə edir.', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ec1c1d40-46f0-4403-8187-eec8586314ee', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '0a34d40f-7d70-4e4b-aba9-fb4d32501bc4', 'Azərbaycan Respublikasının Konstitusiyasında insan və vətəndaşlar hüquqlarının və azadlıqlarının toxunulmaz, pozulmaz və ayrılmazlığı necə təsbit edilir?', 'multiple_choice',
    '["Hamının doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır;", "Hər kəsin doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır;", "Hər bir insanın və vətəndaşın doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır;", "Azərbaycan Respublikası vətəndaşlarının doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır."]'::jsonb, 'Hər kəsin doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır;', 'AR Konstitusiyası Maddə 24 (İnsan və vətəndaş hüquqlarının və azadlıqlarının əsas prinsipi) — Düzgün cavab B variantıdır. Hər kəsin doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır.', 2, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '479d5a98-b41c-4a1c-a379-ee9be823e671', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '0b584a2b-ebc7-432e-bd5c-e9b1210315f4', 'Azərbaycan Respublikasının Konstitusiyasına əsasən kimlərin azadlıq hüququ vardır?', 'multiple_choice',
    '["Valideynlərin", "Uşaqların", "Məhbusların", "Hər kəsin"]'::jsonb, 'Hər kəsin', 'AR Konstitusiyası Maddə 28 (Azadlıq hüququ) — Düzgün cavab D variantıdır. Hər kəs yalnız qanunla nəzərdə tutulmuş qaydada tutula, həbsə alına və ya azadlıqdan məhrum edilə bilər. Sərbəst hərəkət və yaşayış yeri seçmək hüququ təmin edilir.', 3, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fb44f768-131c-41e4-a5c1-dbc6a5a532fc', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '0cc844ee-d0dd-40ea-bc34-cefe255ffdd0', 'Azərbaycan Respublikasının Konstitusiyasına əsasən kimlərin dövlətdən sosial müavinət almaq hüququ vardır?', 'multiple_choice',
    '["Hər kəsin dövlətdən sosial müavinət almaq hüququ vardır.", "Hər bir şəxsin dövlətdən sosial müavinət almaq hüququ vardır.", "Yardıma ehtiyacı olanların dövlətdən sosial müavinət almaq hüququ vardır.", "İşsizlərin dövlətdən sosial müavinət almaq hüququ vardır."]'::jsonb, 'İşsizlərin dövlətdən sosial müavinət almaq hüququ vardır.', 'AR Konstitusiyası Maddə 35 (Əmək hüququ) — Düzgün cavab D variantıdır. Hər kəsin sərbəst surətdə fəaliyyət növü, peşə və iş yeri seçmək hüququ vardır. Məcburi əmək qadağandır. Dövlət işsizliyin aradan qaldırılması üçün imkanlarından istifadə edir.', 4, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8275fc4c-4fe1-4d42-98ad-1eb3d80488fb', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '18a14a27-6b4c-4dc0-a6c4-a79d90c07957', 'Azərbaycan Respublikasının Konstitusiyasında kişi ilə qadının hüquq bərabərliyi necə ifadə olunur?', 'multiple_choice',
    '["Kişi ilə qadının bərabər hüquqları və azadlıqları vardır;", "Kişi ilə qadının bərabər hüquqları, azadlıqları və vəzifələri vardır;", "Kişi ilə qadının eyni hüquqları və azadlıqları vardır;", "Kişi ilə qadının eyni hüquqları, azadlıqları və vəzifələri vardır."]'::jsonb, 'Kişi ilə qadının eyni hüquqları və azadlıqları vardır;', 'AR Konstitusiyası Maddə 25 (Bərabərlik hüququ) — Düzgün cavab C variantıdır. Hamı qanun və məhkəmə qarşısında bərabərdir. Kişi ilə qadının eyni hüquq və azadlıqları vardır. Sağlamlıq imkanları məhdud olanlar bərabər hüquqlardan istifadə edirlər (2016).', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '50eb18ea-5957-4b0b-aa49-e8ca72d9fd2d', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '199a49f4-38b1-4033-ab6c-15ec8c698247', 'Azərbaycan Respublikasının Konstitusiyasında nəzərdə tutulan “ Hər kəsin təhlükəsiz və sağlam şəraitdə işləmək, heç bir ayrı-seçkilik qoyulmadan öz işinə görə dövlətin müəyyənləşdirdiyi minimum əmək haqqı miqdarından az olmayan haqq almaq hüququ vardır ” müddəası hansı hüquqa aiddir?', 'multiple_choice',
    '["əmək hüququ;", "təhlükəsiz əmək hüququ;", "əmək toxunulmazlığı hüququ;", "sağlam ətraf mühitdə yaşamaq hüququ."]'::jsonb, 'əmək hüququ;', 'AR Konstitusiyası Maddə 34 (Nikah hüququ) — Düzgün cavab A variantıdır. Nikah könüllü razılıq əsasında bağlanır. Ər və arvad bərabər hüquqlara malikdir. Valideynlərə qayğı uşaqların borcudur.', 6, NULL, 'Əmək həm fərdi, həm də ictimai rifahın təməlidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ce442d25-93a1-4d94-b7e7-50e1de9b3b41', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '1b593c2a-316f-4269-b3d0-e072f87049ac', 'Azərbaycan Respublikasının Konstitusiyasında nəzərdə tutulan “ Qanunla müəyyən edilmiş hallar və məhkəmə qərarı istisna olmaqla, mənzildə yaşayanların iradəsi ziddinə heç kəs mənzilə daxil ola bilməz ” müddəası hansı hüquqa aiddir?', 'multiple_choice',
    '["mənzil hüququ;", "mənzil toxunulmazlığı hüququ;", "mülkiyyət hüququ;", "təhlükəsiz yaşamaq hüququ."]'::jsonb, 'mənzil toxunulmazlığı hüququ;', 'AR Konstitusiyası Maddə 33 (Mənzil toxunulmazlığı) — Düzgün cavab B variantıdır. Qanunla müəyyən edilmiş hallar və məhkəmə qərarı istisna olmaqla, mənzildə yaşayanların iradəsi ziddinə heç kəs mənzilə daxil ola bilməz.', 7, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '15c12692-f11f-44d0-aea4-a92eb79a502f', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '1bfaa3ef-845a-4f16-bf4d-57de823b6c84', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq müstəsna cəza tədbiri kimi ölüm cəzası (tam ləğv edilənədək) hansı hallarda müəyyən edilə bilər?', 'multiple_choice',
    '["Müstəsna cəza tədbiri kimi ölüm cəzası, tam ləğv edilənədək yalnız dövlətə qarşı xüsusilə ağır cinayətlərə uyğun olaraq qanunla müəyyən olunmuş qaydada müəyyən edilə bilər.", "Müstəsna cəza tədbiri kimi ölüm cəzası, tam ləğv edilənədək , yalnız insan həyatına və sağlamlığına qarşı xüsusilə ağır cinayətlərə uyğun olaraq qanunla müəyyən olunmuş qaydada müəyyən edilə bilər.", "Müstəsna cəza tədbiri kimi ölüm cəzası, tam ləğv edilənədək , yalnız dövlətə, insan həyatına və sağlamlığına qarşı xüsusilə ağır cinayətlərə görə qanunla müəyyən edilə bilər.", "Müstəsna cəza tədbiri kimi ölüm cəzası, tam ləğv edilənədək , yalnız dövlətə,fiziki və hüquqi şəxslərə, insan həyatına və sağlamlığına qarşı xüsusilə ağır cinayətlərə uyğun olaraq qanunla müəyyən olunmuş qaydada müəyyən edilə bilər."]'::jsonb, 'Müstəsna cəza tədbiri kimi ölüm cəzası, tam ləğv edilənədək , yalnız dövlətə, insan həyatına və sağlamlığına qarşı xüsusilə ağır cinayətlərə görə qanunla müəyyən edilə bilər.', 'AR Konstitusiyası Maddə 27 (Yaşamaq hüququ) — Düzgün cavab C variantıdır. Yaşamaq hüququ yalnız dövlətə silahlı basqın zamanı düşmən əsgərlərinin öldürülməsi, məhkəmə hökmü ilə ölüm cəzası və qanunla nəzərdə tutulmuş hallarda toxunulmaz deyildir.', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '889b3c2d-f6a8-46d2-8e3d-3724023861be', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '23bc296f-c46d-429c-9119-45bfbaaaca7a', 'Azərbaycan Respublikasının Konstitusiyasında nəzərdə tutulan “ Hər kəsin şəxsi və ailə həyatına qanunsuz müdaxilədən müdafiə hüququ vardır ” müddəası hansı hüquqa aiddir?', 'multiple_choice',
    '["şəxsi toxunulmazlıq hüququ;", "ailə toxunulmazlıq hüququ;", "təhlükəsiz yaşamaq hüququ;", "mənzil toxunulmazlığı hüququ."]'::jsonb, 'şəxsi toxunulmazlıq hüququ;', 'AR Konstitusiyası Maddə 30 (Əqli mülkiyyət hüququ) — Düzgün cavab A variantıdır. Hər kəsin əqli mülkiyyət hüququ vardır (müəlliflik, ixtiraçılıq və digər əqli mülkiyyət növləri qanunla qorunur).', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f7850f52-1895-42a1-a673-0b7045c1dec9', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '23be9249-0533-4b49-bf72-e6c2a7cb02e6', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Dövlət xeyriyyəçilik fəaliyyətinin, məcburi sosial sığortanın və sosial təminatın başqa növlərinin inkişafı üçün imkanlar yaradır.", "Dövlət xeyriyyəçilik fəaliyyətinin, könüllü sosial sığortanın və sosial təminatın bütün növlərinin inkişafı üçün imkanlar yaradır.", "Dövlət xeyriyyəçilik fəaliyyətinin, könüllü sosial sığortanın və sosial təminatın başqa növlərinin inkişafı üçün imkanlar yaradır.", "Dövlət xeyriyyəçilik fəaliyyətinin, şəxsi sahibkarlıq fəaliyyətinin, məcburi sosial sığortanın və sosial təminatın başqa növlərinin inkişafı üçün imkanlar yaradır."]'::jsonb, 'Dövlət xeyriyyəçilik fəaliyyətinin, könüllü sosial sığortanın və sosial təminatın başqa növlərinin inkişafı üçün imkanlar yaradır.', 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) — Qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə görə sosial təminat almaq hüququ vardır. Pensiya və müavinətlərin minimum məbləği qanunla müəyyən edilir.', 10, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd64f03fd-5ea1-43e5-b7af-099c728ba869', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '27b767d9-b5ea-47fc-be3b-b748745e88b0', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sağlamlığın qorunması hüququ nədir?', 'multiple_choice',
    '["Hər kəsin sağlamlığını qorumaq və tibbi yardım almaq hüququ vardır.", "Hər kəsin həyatını sığortalaması və tibbi yardım almaq hüququ vardır", "Hər bir şəxsin sağlamlığını qorumaq və tibbi yardım almaq hüququ vardır", "Hər kəsin sağlamlığını qorumaq və tibbi arayış almaq hüququ vardır"]'::jsonb, 'Hər kəsin sağlamlığını qorumaq və tibbi yardım almaq hüququ vardır.', 'AR Konstitusiyası Maddə 40 (Mədəniyyət hüququ) — Düzgün cavab A variantıdır. Hər kəsin mədəni həyatda iştirak etmək, mədəniyyət müəssisələrindən və sərvətlərindən istifadə etmək hüququ vardır.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5a775eba-c34a-4d14-b683-365f21827dc6', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '2a9b42c6-596d-410c-bd5c-387668909778', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxsi toxunulmazlıq hüququna aiddir', 'multiple_choice',
    '["Məlumatın aid olduğu şəxsin buna razılığını aşkar ifadə etdiyi hallar, ayrı-seçkiliyə yol verməmək şərtilə fərdi xarakterli statistik məlumatların emalı və qanunun yol verdiyi digər hallar istisna olmaqla, informasiya texnologiyalarından şəxsi həyata, o cümlədən əqidəyə, dini və etnik mənsubiyyətə dair məlumatların açıqlanması üçün istifadə edilə bilməz.", "Məlumatın aid olduğu şəxsin buna razılığını aşkar ifadə etdiyi hallar, ayrı-seçkiliyə yol verməmək şərtilə anonim xarakterli statistik məlumatların emalı və qanunun yol verdiyi digər hallar da daxil olmaqla, informasiya texnologiyalarından şəxsi həyata, o cümlədən əqidəyə, dini və etnik mənsubiyyətə dair məlumatların açıqlanması üçün istifadə edilə bilməz.", "Məlumatın aid olduğu şəxsin buna razılığını aşkar ifadə etdiyi hallar, ayrı-seçkiliyə yol verməmək şərtilə anonim xarakterli statistik məlumatların emalı və qanunun yol verdiyi digər hallar istisna olmaqla, informasiya texnologiyalarından şəxsi həyata, o cümlədən əqidəyə, dini və etnik mənsubiyyətə dair məlumatların açıqlanması üçün istifadə edilə bilər", "Məlumatın aid olduğu şəxsin buna razılığını aşkar ifadə etdiyi hallar, ayrı-seçkiliyə yol verməmək şərtilə anonim xarakterli statistik məlumatların emalı və qanunun yol verdiyi digər hallar istisna olmaqla, informasiya texnologiyalarından şəxsi həyata, o cümlədən əqidəyə, dini və etnik mənsubiyyətə dair məlumatların açıqlanması üçün istifadə edilə bilməz."]'::jsonb, 'Məlumatın aid olduğu şəxsin buna razılığını aşkar ifadə etdiyi hallar, ayrı-seçkiliyə yol verməmək şərtilə anonim xarakterli statistik məlumatların emalı və qanunun yol verdiyi digər hallar istisna olmaqla, informasiya texnologiyalarından şəxsi həyata, o cümlədən əqidəyə, dini və etnik mənsubiyyətə dair məlumatların açıqlanması üçün istifadə edilə bilməz.', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab D variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 12, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e9626291-10d7-4f39-be4d-aa02ab5bc652', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '2c9a352a-7866-42f5-a1bc-767c6e216997', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının Silahlı Qüvvələrində və digər silahlı birləşmələrdə xidmət edən hərbi qulluqçular və mülki şəxslər tətil edə bilməzlər", "Azərbaycan Respublikasının Silahlı Qüvvələrində  xidmət edən hərbi qulluqçular tətil edə bilməzlər", "Azərbaycan Respublikasının Silahlı Qüvvələrində və digər silahlı birləşmələrdə xidmət edən mülki şəxslər tətil edə bilməzlər", "Azərbaycan Respublikasının Silahlı Qüvvələrində  xidmət edən hərbi qulluqçular və mülki şəxslər tətil edə bilməzlər"]'::jsonb, 'Azərbaycan Respublikasının Silahlı Qüvvələrində  xidmət edən hərbi qulluqçular və mülki şəxslər tətil edə bilməzlər', 'AR Konstitusiyası Maddə 36 (Tətil hüququ) — Hər kəsin təkbaşına və ya başqaları ilə birlikdə tətil etmək hüququ vardır. Qanunla müəyyən edilmiş hallar istisna olmaqla, lokaut qadağandır (2016).', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '970d4c80-9f0e-4c79-b957-d6dee95ab160', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '2d6ba167-ea11-44e2-9a62-4b4137170a6c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən əqli mülkiyyət hüququna aiddir', 'multiple_choice',
    '["Hər kəsin əqli mülkiyyət hüququ vardır.", "Hər bir vətəndaşın əqli mülkiyyət hüququ vardır.", "Hər bir əcnəbinin və vətəndaşlığı olmayan şəxsin əqli mülkiyyət hüququ vardır.", "Hər bir millətin əqli mülkiyyət hüququ vardır."]'::jsonb, 'Hər kəsin əqli mülkiyyət hüququ vardır.', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab A variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 14, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c12da8e9-35d0-46d2-9cc6-ce6c737fedb9', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '326c5060-fb46-445c-8095-3f4b3618c31f', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq “analıq, atalıq, uşaqlıq qanunla mühafizə edilir”.Göstərilən müddəa hansı maddəyə aiddir?', 'multiple_choice',
    '["Ailə,uşaqlar və dövlət", "Nigah hüququ", "Bərabərlik hüququ", "İnsan və vətəndaşların hüquq və azadlıqlarının müdafiəsi"]'::jsonb, 'Nigah hüququ', 'AR Konstitusiyası Maddə 34 (Nikah hüququ) — Düzgün cavab B variantıdır. Nikah könüllü razılıq əsasında bağlanır. Ər və arvad bərabər hüquqlara malikdir. Valideynlərə qayğı uşaqların borcudur.', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd3b6fe1e-845f-45aa-a0d2-7104d42d8cbb', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '34e64e1f-a7a3-42da-8196-1da1b4f8fd9d', 'Aşağıdakı müddəalardan hansı Azərbaycan Respublikasının Konstitusiyasında təsbit olunmuş təhlükəsiz yaşamaq hüququna aiddir?', 'multiple_choice',
    '["Hər kəsin təhlükəsiz və sağlam şəraitdə yaşamaq və işləmək hüququ vardır;", "Qanunda nəzərdə tutulmuş hallar istisna olmaqla, heç kəs insan ləyaqətini alçaldan rəftara və cəzaya məruz qala bilməz;", "Qanunda nəzərdə tutulmuş hallar istisna olmaqla, şəxsin həyatına, fiziki və mənəvi sağlamlığına, mülkiyyətinə, mənzilinə qəsd etmək, ona qarşı zor işlətmək qadağandır;", "Qanunda nəzərdə tutulmuş hallar istisna olmaqla, özünün könüllü razılığı olmadan şəxsin üzərində tibbi, elmi və başqa təcrübələr aparılması qadağandır."]'::jsonb, 'Qanunda nəzərdə tutulmuş hallar istisna olmaqla, şəxsin həyatına, fiziki və mənəvi sağlamlığına, mülkiyyətinə, mənzilinə qəsd etmək, ona qarşı zor işlətmək qadağandır;', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab C variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1db9830a-0cbd-430b-bc25-26730482bbcf', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '4176c1b8-c917-4e57-9888-3975fb71728b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sağlamlıq imkanları məhdud olanlar hansı hüquq və vəzifələri daşıyırlar?', 'multiple_choice',
    '["Sağlamlıq imkanları məhdud olanlar, onların məhdud imkanlarına görə həyata keçirilməsi çətinləşən hüquq və vəzifələrlə yanaşı, bu Konstitusiyada təsbit olunmuş bütün hüquqlardan istifadə edir və vəzifələri daşıyırlar.", "Sağlamlıq imkanları məhdud olanlar, onların məhdud imkanlarına görə həyata keçirilməsi çətinləşən hüquq və vəzifələrdən başqa, bu Konstitusiyada təsbit olunmuş bütün hüquqlardan istifadə edir və vəzifələri daşıyırlar.", "Sağlamlıq imkanları məhdud olanlar, onların məhdud imkanlarına görə həyata keçirilməsi çətinləşən hüquq və vəzifələrdən başqa, bu Konstitusiyada təsbit olunmamış bütün hüquqlardan istifadə edir və vəzifələri daşıyırlar.", "Sağlamlıq imkanları məhdud olanlar, onların məhdud imkanlarına görə həyata keçirilməsi çətinləşən hüquq və vəzifələrdən başqa, bu Konstitusiyada təsbit olunmuş bütün hüquqlardan istifadə edə və vəzifələri daşıya bilməzlər."]'::jsonb, 'Sağlamlıq imkanları məhdud olanlar, onların məhdud imkanlarına görə həyata keçirilməsi çətinləşən hüquq və vəzifələrdən başqa, bu Konstitusiyada təsbit olunmuş bütün hüquqlardan istifadə edir və vəzifələri daşıyırlar.', 'AR Konstitusiyası Maddə 25 (Bərabərlik hüququ) — Düzgün cavab B variantıdır. Hamı qanun və məhkəmə qarşısında bərabərdir. Kişi ilə qadının eyni hüquq və azadlıqları vardır. Sağlamlıq imkanları məhdud olanlar bərabər hüquqlardan istifadə edirlər (2016).', 17, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a97a5014-0a67-49c8-bcf6-e903e27e0567', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '440b7985-8286-4cce-a691-b2224c51c2e7', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq doğru olan bəndi müəyyən edin1.Hər kəsin qanunla nəzərdə tutulmuş yaşa çatdıqda ailə qurmaq hüququ vardır.
2. Heç kəs zorla evləndirilə (ərə verilə) bilməz.
3. Dövlət çoxuşaqlı ailələrə yardım göstərir.
4. Uşaqlara qayğı göstərmək, onları tərbiyə etmək valideynlərin borcudur.
5. Valideynlərə hörmət etmək, onların qayğısına qalmaq uşaqların borcudur.18 yaşına çatmış əmək qabiliyyətli uşaqlar əmək qabiliyyətli valideynlərini saxlamağa borcludurlar.', 'multiple_choice',
    '["1,2,4", "3,4,5", "1,2,3", "2,4,5"]'::jsonb, '1,2,3', 'AR Konstitusiyası Maddə 33 (Mənzil toxunulmazlığı) — Düzgün cavab C variantıdır. Qanunla müəyyən edilmiş hallar və məhkəmə qərarı istisna olmaqla, mənzildə yaşayanların iradəsi ziddinə heç kəs mənzilə daxil ola bilməz.', 18, NULL, 'Əmək həm fərdi, həm də ictimai rifahın təməlidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f2eafcb2-1b60-4d32-aed7-4040281ce5bd', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '450a07ef-61e5-43c7-95ff-d483d6d4e9c9', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı subyekt hər kəsin hüquqlarının və azadlıqlarının müdafiəsinə təminat verir?', 'multiple_choice',
    '["Dövlət hər kəsin hüquqlarının və azadlıqlarının müdafiəsinə təminat verir;", "Xalq hər kəsin hüquqlarının və azadlıqlarının müdafiəsinə təminat verir;", "Prezident hər kəsin hüquqlarının və azadlıqlarının müdafiəsinə təminat verir;", "Məhkəmə hər kəsin hüquqlarının və azadlıqlarının müdafiəsinə təminat verir."]'::jsonb, 'Dövlət hər kəsin hüquqlarının və azadlıqlarının müdafiəsinə təminat verir;', 'AR Konstitusiyası Maddə 26 (Hüquq və azadlıqların müdafiəsi) — Düzgün cavab A variantıdır. Hər kəsin qanunla qadağan olunmayan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır.', 19, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2a6c7c22-cb86-43f0-9c74-a9b3a67f8aa8', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '483bf011-b150-4314-bfa0-d28239035e0e', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq kimlərin seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur?', 'multiple_choice',
    '["Məhkəmənin qanuni qüvvəyə minmiş hökmü ilə azadlıqdan məhrum edilmiş şəxslərin seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur.", "Hərbi qulluqçuların seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur.", "Din xadimlərinin seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur.", "Məhkəmənin qərarı ilə fəaliyyət qabiliyyətsizliyi təsdiq olunmuş şəxslərin seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur."]'::jsonb, 'Məhkəmənin qərarı ilə fəaliyyət qabiliyyətsizliyi təsdiq olunmuş şəxslərin seçkilərdə, habelə referendumda iştirak etmək hüququ yoxdur.', 'AR Konstitusiyası — Düzgün cavab D variantıdır.', 20, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '45debf22-cf42-4f1b-adf8-99008bbad1f5', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '4b2daa3a-67cb-46b0-a510-c9c3cbddd974', 'Azərbaycan Respublikasının Konstitusiyasına əsasən mədəniyyət hüququ nədir?', 'multiple_choice',
    '["Hər kəsin ictimai həyatda iştirak etməsi, mədəniyyət təsisatlarından və mədəni nailiyyətlərdən istifadə etməsi", "Hər kəsin ictimai-siyasi həyatda iştirak etməsi, dövlət təsisatlarından və sərvətlərindən istifadə etməsi", "Hər kəsin mədəni həyatda iştirak etməsi, mədəniyyət təsisatlarından və mədəni sərvətlərdən istifadə etməsi", "Hər kəsin sosial həyatda iştirak etməsi, dövlətin sosial təsisatlarından və sərvətlərindən istifadə etməsi"]'::jsonb, 'Hər kəsin mədəni həyatda iştirak etməsi, mədəniyyət təsisatlarından və mədəni sərvətlərdən istifadə etməsi', 'AR Konstitusiyası Maddə 39 (Sağlam ətraf mühitdə yaşamaq hüququ) — Düzgün cavab C variantıdır. Hər kəsin ətraf mühitin vəziyyəti haqqında məlumat toplamaq və ekoloji hüquqpozma nəticəsində vurulmuş zərərin əvəzini almaq hüququ vardır.', 21, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '04fb03c1-1e04-43f2-ae4f-04d488d31351', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '4b873430-c03e-45e7-8f0c-75d49691b3b0', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq fərdi məlumatların dairəsi, habelə onların emalı, toplanması, ötürülməsi, istifadəsi və mühafizəsi şərtləri müəyyən edilir:', 'multiple_choice',
    '["Qanunla", "Konstitusiya qanunu ilə", "Qərarla", "Heç biri"]'::jsonb, 'Qanunla', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab A variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 22, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6c56d940-454c-4878-a723-99f335138f46', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '4bd293d5-1b02-4aba-823f-9f622bea377f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxs mülkiyyətdən məhrum edilə bilərmi?', 'multiple_choice',
    '["Heç kəs məhkəmənin qərarı olmadan mülkiyyətindən məhrum edilə bilməz;", "Konstitusiyada nəzərdə tutulmuş hallar istisna olmaqla, heç kəs mülkiyyətindən məhrum edilə bilməz;", "Azərbaycan Respublikası Milli Məclisinin qərarı olmadan heç kəs mülkiyyətindən məhrum edilə bilməz;", "Heç kəs heç bir halda mülkiyyətindən məhrum edilə bilməz."]'::jsonb, 'Heç kəs məhkəmənin qərarı olmadan mülkiyyətindən məhrum edilə bilməz;', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab A variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 23, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2fd3b148-a11c-4c48-a0e9-e22f27f27fcc', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '50691579-22bd-435e-a1d3-bde14e353f84', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Dövlət işsizliyin aradan qaldırılması üçün qanunla nəzərdə tutulmuş imkanlarından istifadə edir.", "Dövlət işsizliyin aradan qaldırılması üçün beynəlxalq müqavilələrə əsaslanan imkanlarından istifadə edir.", "Dövlət işsizliyin aradan qaldırılması üçün bütün imkanlarından istifadə edir.", "Dövlət işsizliyin aradan qaldırılması üçün dövlət və qeyri-hökumət təşkilatlarının imkanlarından istifadə edir."]'::jsonb, 'Dövlət işsizliyin aradan qaldırılması üçün bütün imkanlarından istifadə edir.', 'AR Konstitusiyası Maddə 35 (Əmək hüququ) — Düzgün cavab C variantıdır. Hər kəsin sərbəst surətdə fəaliyyət növü, peşə və iş yeri seçmək hüququ vardır. Məcburi əmək qadağandır. Dövlət işsizliyin aradan qaldırılması üçün imkanlarından istifadə edir.', 24, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '76fec12a-c1ea-4c39-a96c-f4f9da76a029', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '5e7e4092-a5b9-4243-a72d-67d1f1d17d26', '2016 – ci il sentyabrın 26 – da keçirilmiş referendumla Azərbaycan Respublikası Konstitusiyasına edilmiş əlavə və dəyişikliklərə aiddir:
1. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Qanunla nəzərdə tutulan hallardan başqa, şəxsi və ailə həyatına müdaxilə etmək qadağandır. Hər kəsin şəxsi və ailə həyatına qanunsuz müdaxilədən müdafiə hüququ vardır.
2. Öz razılığı olmadan kimsənin şəxsi həyatı haqqında məlumatın toplanılmasına, saxlanılmasına, istifadəsinə və yayılmasına yol verilmir. Qanunla müəyyən edilmiş hallar istisna olmaqla, heç kəs onun xəbəri olmadan və ya etirazına baxmadan izlənilə bilməz, video və foto çəkilişinə, səs yazısına və digər bu cür hərəkətlərə məruz qoyula bilməz.
3. Hər kəsin yazışma, telefon danışıqları, poçt, teleqraf və digər rabitə vasitələri ilə ötürülən məlumatın sirrini saxlamaq hüququna dövlət təminat verir. Bu hüquq qanunla nəzərdə tutulmuş qaydada cinayətin qarşısını almaqdan və ya cinayət işinin istintaqı zamanı həqiqəti üzə çıxarmaqdan ötrü məhdudlaşdırıla bilər.
4. Qanunla müəyyən edilmiş hallar istisna olmaqla, üçüncü şəxslər haqqında məlumat almaq məqsədi ilə elektron formada və ya kağız üzərində aparılan informasiya ehtiyatlarına daxil olmaq qadağandır.
5. Məlumatın aid olduğu şəxsin buna razılığını aşkar ifadə etdiyi hallar, ayrı-seçkiliyə yol verməmək şərtilə anonim xarakterli statistik məlumatların emalı və qanunun yol verdiyi digər hallar istisna olmaqla, informasiya texnologiyalarından şəxsi həyata, o cümlədən əqidəyə, dini və etnik mənsubiyyətə dair məlumatların açıqlanması üçün istifadə edilə bilməz.
6. Fərdi məlumatların dairəsi, habelə onların emalı, toplanması, ötürülməsi, istifadəsi və mühafizəsi şərtləri qanunla müəyyən edilir.', 'multiple_choice',
    '["1,2,3", "4,5,6", "2,4,5", "1,3,6"]'::jsonb, '4,5,6', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab B variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 25, NULL, 'Əmək həm fərdi, həm də ictimai rifahın təməlidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '137fc7ed-41a1-40a5-9e14-34e835963606', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '654a942e-b6e9-40ad-9e5f-050d5a785286', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı halda torpaq üzərində mülkiyyət hüququ məhdudlaşdırıla bilər?
1. Sosial ədalət
2. Maraqların təmin olunması
3. Torpaqlardan səmərəli istifadə
4. Mülki müdafiə', 'multiple_choice',
    '["1,2", "1,3", "3,4", "2,4"]'::jsonb, '3,4', 'AR Konstitusiyası Maddə 28 (Azadlıq hüququ) — Düzgün cavab C variantıdır. Hər kəs yalnız qanunla nəzərdə tutulmuş qaydada tutula, həbsə alına və ya azadlıqdan məhrum edilə bilər. Sərbəst hərəkət və yaşayış yeri seçmək hüququ təmin edilir.', 26, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '41b22eb8-b112-4a9d-aa56-6264d3c80c4a', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '6bfa3a9f-6d3a-4d93-ba9c-35e43e814d97', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hər bir şəxsin yaşamaq hüququ hansı hallarda toxunulmaz deyildir?
1. Dövlətə silahlı basqın zamanı düşmən əsgərlərinin öldürülməsi
2. Qanunla nəzərdə tutulmuş zəruri müdafiə
3. Məhkəmənin qanuni qüvvəyə minmiş hökmünə uyğun olaraq ölüm cəzasının tətbiqi
4. Son zərurət
5. Cinayətkarın yaxalanması və tutulması, həbsdə olanın həbs yerindən qaçmasının qarşısının alınması
6. Dövlətə qarşı qiyamın yatırılması və ya dövlət çevrilişinin qarşısının alınması
7. Qanunla nəzərdə tutulmuş hallarda
8. Ölkəyə silahlı basqın edilməsi hallarında', 'multiple_choice',
    '["1,3,7", "2,4,5,6,8", "1,4,5,6,7,8", "1,2 ,5,6,7,8"]'::jsonb, '1,3,7', 'AR Konstitusiyası Maddə 27 (Yaşamaq hüququ) — Düzgün cavab A variantıdır. Yaşamaq hüququ yalnız dövlətə silahlı basqın zamanı düşmən əsgərlərinin öldürülməsi, məhkəmə hökmü ilə ölüm cəzası və qanunla nəzərdə tutulmuş hallarda toxunulmaz deyildir.', 27, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7f9e93e3-13a3-4edb-ab19-b307ec11b4c4', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '7123c810-7dfd-4c76-a3f1-37c4fe940e18', '“Azərbaycan Respublikası vətəndaşlarının hər zaman maneəsiz öz ölkəsinə qayıtmaq hüququ vardır” cümləsi Azərbaycan Respublikasının Konstitusiyasının hansı maddəsində öz əksini tapmışdır?', 'multiple_choice',
    '["Vətəndaşlıq hüququ", "Şəxsi toxunulmazlıq hüququ", "Azadlıq hüququ", "Vətəndaşlıq hüququnun təminatı"]'::jsonb, 'Azadlıq hüququ', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab C variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 28, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '256e69ea-4e05-4cd2-866f-fff46112b62d', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '71906313-9715-4732-af79-3bd1069747bd', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğru deyil', 'multiple_choice',
    '["Heç kəs ətraf mühitə, təbii ehtiyatlara qanunla müəyyən edilmiş hədlərdən artıq təhlükə törədə bilməz.", "Sağlam ətraf mühitdə yaşamaq hüququna görə dövlət təminat verir", "Dövlət ekoloji tarazlığın saxlanılmasına, yabanı bitkilərin və vəhşi heyvanların bütün növlərinin qorunmasına təminat verir.", "Heç kəs ətraf mühitə, təbii ehtiyatlara qanunla müəyyən edilmiş hədlərdən artıq zərər vura bilməz."]'::jsonb, 'Dövlət ekoloji tarazlığın saxlanılmasına, yabanı bitkilərin və vəhşi heyvanların bütün növlərinin qorunmasına təminat verir.', 'AR Konstitusiyası Maddə 39 (Sağlam ətraf mühitdə yaşamaq hüququ) — Düzgün cavab C variantıdır. C bəndi səhvdir, çünki dövlət flora və faunanın ''bütün'' növlərinin deyil, ''qanunla müəyyən edilmiş növlərinin'' qorunmasına təminat verir (Maddə 39.IV).', 29, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fad887e5-2a74-4b94-ae7d-397e7b0e2915', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '72e3718d-4fc7-45a9-be20-723be466f151', 'Azərbaycan Respublikasının Konstitusiyasına əsasən mənzil hüququna aiddir', 'multiple_choice',
    '["Dövlət yaşayış binalarının və evlərin tikintisinə rəvac verir, insanların mənzil hüququnu gerçəkləşdirmək üçün ümumi tədbirlər görür.", "Dövlət yaşayış binalarının, obyektlərin və evlərin tikintisinə rəvac verir, insanların mənzil hüququnu gerçəkləşdirmək üçün xüsusi tədbirlər görür.", "Dövlət yaşayış binalarının və evlərin tikintisinə rəvac verir, insanların mənzil hüququnu gerçəkləşdirmək üçün xüsusi tədbirlər görür.", "Azərbaycan Respublikasının Prezidenti yaşayış binalarının və evlərin tikintisinə rəvac verir, insanların mənzil hüququnu gerçəkləşdirmək üçün xüsusi tədbirlər görür."]'::jsonb, 'Dövlət yaşayış binalarının və evlərin tikintisinə rəvac verir, insanların mənzil hüququnu gerçəkləşdirmək üçün xüsusi tədbirlər görür.', 'AR Konstitusiyası Maddə 43 (Mənzil hüququ) — Düzgün cavab C variantıdır. Heç kəs yaşadığı mənzildən qanunsuz məhrum edilə bilməz.', 30, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c8bfbae9-3cba-4968-b5dc-cae6ce516039', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '733002dd-2985-4710-a590-a608233d3ddc', 'Azərbaycan Respublikasının Konstitusiyasına əsasən saglamlığın qorunması hüququna aiddir.', 'multiple_choice',
    '["Dövlət müxtəlif mülkiyyət növləri əsasında fəaliyyət göstərən səhiyyənin bütün növlərinin inkişafı üçün zəruri tədbirlər görür, sanitariya-epidemiologiya salamatlığına təminat verir, tibbi sığortanın yalnız zəruri növləri üçün imkanlar yaradır.", "Dövlət müxtəlif mülkiyyət növləri əsasında fəaliyyət göstərən səhiyyənin qanunla nəzərdə tutulan növlərinin inkişafı üçün zəruri tədbirlər görür, sanitariya-epidemiologiya salamatlığına təminat verir, tibbi sığortanın müxtəlif növləri üçün imkanlar yaradır.", "Dövlət müxtəlif mülkiyyət növləri əsasında fəaliyyət göstərən səhiyyənin bütün növlərinin inkişafı üçün zəruri tədbirlər görür, sanitariya-epidemiologiya salamatlığına təminat verir, tibbi sığortanın müxtəlif növləri üçün imkanlar yaradır.", "Dövlət xüsusi mülkiyyət növü əsasında fəaliyyət göstərən səhiyyənin bütün növlərinin inkişafı üçün zəruri tədbirlər görür, sanitariya-epidemiologiya salamatlığına təminat verir, tibbi sığortanın müxtəlif növləri üçün imkanlar yaradır."]'::jsonb, 'Dövlət müxtəlif mülkiyyət növləri əsasında fəaliyyət göstərən səhiyyənin bütün növlərinin inkişafı üçün zəruri tədbirlər görür, sanitariya-epidemiologiya salamatlığına təminat verir, tibbi sığortanın müxtəlif növləri üçün imkanlar yaradır.', 'AR Konstitusiyası Maddə 41 (Sağlamlığın qorunması hüququ) — Düzgün cavab C variantıdır. Hər kəsin sağlamlığını qorumaq və tibbi yardım almaq hüququ vardır. Tibbi sığorta inkişaf etdirilir.', 31, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3bd3491b-8424-4570-a25d-e7cc937cb54a', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '742a2278-ba0d-4212-9517-e4d9b4551e19', 'Azərbaycan Respublikasının Konstitusiyasında mülkiyyət hüququ necə təsbit edilir?', 'multiple_choice',
    '["Hər kəsin mülkiyyət hüququ vardır;", "Hamının mülkiyyət hüququ vardır;", "Bütün insanların mülkiyyət hüququ vardır;", "Bütün şəxslərin mülkiyyət hüququ vardır."]'::jsonb, 'Hər kəsin mülkiyyət hüququ vardır;', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab A variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 32, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '72a40975-8d05-4832-a915-83854c3a500d', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '76a31750-dc3a-4cbc-816a-d1d531ffe1b1', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı halda bu maddənin (bərabərlik hüququ) III hissəsində göstərilən əsaslara uyğun olaraq zərər vurula bilər, güzəştlər və ya imtiyazlar verilə bilər, yaxud güzəştlərin və ya imtiyazların verilməsindən imtina oluna bilər?', 'multiple_choice',
    '["Konstitusiya ilə müəyyən olunmuş qaydada", "qanunla müəyyən olunmuş hallarda", "Məhkəmə qərarı ilə", "Heç bir halda"]'::jsonb, 'Heç bir halda', 'AR Konstitusiyası Maddə 25 (Bərabərlik hüququ) — Düzgün cavab D variantıdır. Hamı qanun və məhkəmə qarşısında bərabərdir. Kişi ilə qadının eyni hüquq və azadlıqları vardır. Sağlamlıq imkanları məhdud olanlar bərabər hüquqlardan istifadə edirlər (2016).', 33, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e73f746b-0c3c-4182-9ce8-6ee48c02fca4', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '779b3501-27e2-4c7c-999e-c8ef7f6516fe', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı cümlə hansı hüquqa aiddir:
“Heç kəs yaşadığı mənzildən qanunsuz məhrum edilə bilməz.”', 'multiple_choice',
    '["Mənzil toxunulmazlığı hüququ", "Mənzil hüququ", "Yaşamaq hüququ", "Şəxsi toxunulmazlıq hüququ"]'::jsonb, 'Mənzil hüququ', 'AR Konstitusiyası Maddə 42 (Təhsil hüququ) — Düzgün cavab B variantıdır. Dövlət pulsuz icbari ümumi orta təhsil almaq hüququnu təmin edir və istedadlı şəxslərin maddi vəziyyətindən asılı olmayaraq təhsilini davam etdirməsinə zəmanət verir.', 34, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '15955ef0-3c39-4a86-be3f-d9195c6c33c2', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '7ae51b18-0e09-472b-afd0-348e8dc5972b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakı müddəalardan hansılar şəxsi toxunulmazlıq hüququna aiddir?
1. hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır
2. hər kəsin şərəf və ləyaqətin toxunulmazlığı hüququ vardır
3. qanunla müəyyən edilmiş hallar istisna olmaqla, heç kəs onun xəbəri olmadan və etirazına baxmadan izlənilə bilməz, video və foto çəkilişinə, səs yazısına və digər bu cür hərəkətlərə məruz qoyula bilməz
4. heç bir hal şəxsiyyətin ləyaqətinin alçaldılmasına əsas verə bilməz
5. insanların həyatı və sağlamlığı üçün təhlükə törədən faktları və halları gizlədən vəzifəli şəxslər qanun əsasında məsuliyyətə cəlb edilirlər
6. hər kəsin yazışma, telefon danışıqları, poçt, teleqraf və digər rabitə vasitələri ilə ötürülən məlumatın sirrini saxlamaq hüququna dövlət təminat verir', 'multiple_choice',
    '["1; 2; 4;", "1; 3; 5;", "1; 3; 6;", "1; 4; 5."]'::jsonb, '1; 3; 6;', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab C variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 35, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '011fb436-0398-40f7-bc6e-0f01a8d684a7', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '7beabcbb-2c50-4efa-9001-4bcf8f50ce5c', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq doğru olmayan bəndi müəyyən edin:', 'multiple_choice',
    '["Hamı qanun və məhkəmə qarşısında bərabərdir.", "Kişi ilə qadının bərabər hüquqları və azadlıqları vardır", "Dövlət, irqindən, etnik mənsubiyyətindən, dinindən, dilindən, cinsindən, mənşəyindən, əmlak vəziyyətindən, qulluq mövqeyindən, əqidəsindən, siyasi partiyalara, həmkarlar ittifaqlarına və digər ictimai birliklərə mənsubiyyətindən asılı olmayaraq, hər kəsin hüquq və azadlıqlarının bərabərliyinə təminat verir.", "İnsan və vətəndaş hüquqlarını və azadlıqlarını irqi,etnik, dini, dil, cinsi, mənşəyi, əqidə, siyasi və sosial mənsubiyyətə uyğun olaraq məhdudlaşdırmaq qadağandır."]'::jsonb, 'Kişi ilə qadının bərabər hüquqları və azadlıqları vardır', 'AR Konstitusiyası Maddə 24 (İnsan və vətəndaş hüquqlarının və azadlıqlarının əsas prinsipi) — Düzgün cavab B variantıdır. Hər kəsin doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır.', 36, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'acf280e2-4cba-4966-ab5c-2b92318741c3', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '7da4d146-c04a-495b-89d3-2a67d2a15fe3', '2016 – ci il sentyabrın 26 – da keçirilmiş referendumla Azərbaycan Respublikası Konstitusiyasına edilmiş əlavə və dəyişikliklərə aiddir:
1. Mülkiyyətin heç bir növünə üstünlük verilmir.
2. Mülkiyyət hüququ, o cümlədən xüsusi mülkiyyət hüququ qanunla qorunur.
3. Hər kəsin mülkiyyətində daşınar və daşınmaz əmlak ola bilər. Mülkiyyət hüququ mülkiyyətçinin təkbaşına və ya başqaları ilə birlikdə əmlaka sahib olmaq, əmlakdan istifadə etmək və onun barəsində sərəncam vermək hüquqlarından ibarətdir.
4. Dövlət ehtiyacları və ya ictimai ehtiyaclar üçün mülkiyyətin özgəninkiləşdirilməsinə yalnız qabaqcadan onun dəyərini ədalətli ödəmək şərti ilə yol verilə bilər.
5. Xüsusi mülkiyyət sosial öhdəliklərə səbəb olur.
6. Sosial ədalət və torpaqlardan səmərəli istifadə məqsədi ilə torpaq üzərində mülkiyyət hüququ qanunla məhdudlaşdırıla bilər', 'multiple_choice',
    '["2,3", "5,6", "1,4", "2,5"]'::jsonb, '5,6', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab B variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 37, NULL, 'Əmək həm fərdi, həm də ictimai rifahın təməlidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1a47bde6-8585-4429-adf1-0432bcd86455', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '8f887918-7a58-4e54-916e-b0b76c0080d1', 'Konstitusiyaya əsasən aşağıdakılardan biri doğru deyil', 'multiple_choice',
    '["Dövlət xeyriyyəçilik fəaliyyətinin, könüllü sosial sığortanın və sosial təminatın başqa növlərinin inkişafı üçün imkanlar yaradır", "Hər kəsin ətraf mühitin əsl vəziyyəti haqqında məlumat toplamaq və ekoloji hüquqpozma ilə əlaqədar onun sağlamlığına və əmlakına vurulmuş zərərin əvəzini almaq hüququ vardır.", "Qanunla müəyyən edilmiş şəxslərdən başqa heç kəs ətraf mühitə, təbii ehtiyatlara qanunla müəyyən edilmiş hədlərdən artıq təhlükə törədə və ya zərər vura bilməz", "Hər kəs tarixi, mədəni və mənəvi irsə hörmətlə yanaşmalı, ona qayğı göstərməli, tarix və mədəniyyət abidələrini qorumalıdır"]'::jsonb, 'Qanunla müəyyən edilmiş şəxslərdən başqa heç kəs ətraf mühitə, təbii ehtiyatlara qanunla müəyyən edilmiş hədlərdən artıq təhlükə törədə və ya zərər vura bilməz', 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) — Düzgün cavab C variantıdır. Qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə görə sosial təminat almaq hüququ vardır. Pensiya və müavinətlərin minimum məbləği qanunla müəyyən edilir.', 38, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8a70e556-d05d-4629-9b1d-da8c9b10cb50', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '919b87b6-d72c-49fa-8a6d-31dbcd222ac2', 'Azərbaycan Respublikasının Konstitusiyasına əsasən qanunla nəzərdə tutulmuş hansı hallar istisna olmaqla, insana qarşı silah işlədilməsinə yol verilmir?
1. zəruri müdafiə, son zərurət
2. müharibə vəziyyəti
3. cinayətkarın yaxalanması və tutulması, həbsdə olanın həbs yerindən qaçmasının qarşısının alınması
4. fövqəladə vəziyyət, hərbi vəziyyət
5. dövlətə qarşı qiyamın yatırılması və ya dövlət çevrilişinin qarşısının alınması
6. ölkəyə silahlı basqın edilməsi
7. səfərbərlik vəziyyəti', 'multiple_choice',
    '["1; 2; 4; 5;", "1; 3; 5; 6;", "2; 3; 4; 6;", "2; 5; 6; 7."]'::jsonb, '1; 3; 5; 6;', 'AR Konstitusiyası Maddə 28 (Azadlıq hüququ) — Düzgün cavab B variantıdır. Hər kəs yalnız qanunla nəzərdə tutulmuş qaydada tutula, həbsə alına və ya azadlıqdan məhrum edilə bilər. Sərbəst hərəkət və yaşayış yeri seçmək hüququ təmin edilir.', 39, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c6c704c9-eb3f-45e5-a9d6-42de858d0958', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '91e743b6-3488-4954-b940-be55109f4405', 'Azərbaycan Respublikasının Konstitusiyasına əsasən istirahət hüququ maddəsinə aiddir', 'multiple_choice',
    '["Hər kəsin istirahət hüququ vardır.", "Hər bir şəxsin istirahət hüququ vardır.", "Hər bir vətəndaşın istirahət hüququ vardır.", "Hər bir işləyən şəxsin istirahət hüququ vardır."]'::jsonb, 'Hər kəsin istirahət hüququ vardır.', 'AR Konstitusiyası Maddə 37 (İstirahət hüququ) — Düzgün cavab A variantıdır. Əmək müqaviləsi ilə işləyənlərə gündə 8 saatdan artıq olmayan iş günü, istirahət günləri və ildə azı 21 təqvim günü ödənişli məzuniyyət təmin edilir.', 40, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5c401d9f-8d32-440e-99d3-460f545d677e', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '92456b03-616e-4c3d-8f9f-1c045d71f4a5', 'Azərbaycan Respublikasının Konstitusiyasına əsasən mülkiyyət hüququ hansı hüquqlardan ibarətdir?', 'multiple_choice',
    '["Mülkiyyət hüququ mülkiyyətçinin təkbaşına əmlaka sahib olmaq, əmlakdan istifadə etmək və onun hüquqi taleyini müəyyənləşdirmək hüquqlarından ibarətdir;", "Mülkiyyət hüququ mülkiyyətçinin təkbaşına və ya başqaları ilə birlikdə müəyyən əmlaka malik olmaq, həmin əmlakdan istifadə etmək və onu özgəninkiləşdirmək hüquqlarından ibarətdir;", "Mülkiyyət hüququ mülkiyyətçinin təkbaşına və ya başqaları ilə birlikdə müəyyən əmlakı əldə etmək, həmin əmlakdan istifadə etmək və onu özgəninkiləşdirmək hüquqlarından ibarətdir;", "Mülkiyyət hüququ mülkiyyətçinin təkbaşına və ya başqaları ilə birlikdə əmlaka sahib olmaq, əmlakdan istifadə etmək və onun barəsində sərəncam vermək hüquqlarından ibarətdir."]'::jsonb, 'Mülkiyyət hüququ mülkiyyətçinin təkbaşına və ya başqaları ilə birlikdə əmlaka sahib olmaq, əmlakdan istifadə etmək və onun barəsində sərəncam vermək hüquqlarından ibarətdir.', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab D variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 41, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd1a2ccc5-87fa-4e71-9fb5-3dfe5a56a8d4', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '92bb04ae-baca-4603-9633-2854f63c4ab1', 'Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına hansı qaydada müraciət etmək hüququ vardır?', 'multiple_choice',
    '["Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına şəxsən müraciət etmək, habelə fərdi və kollektiv şifahi müraciətlər göndərmək hüququ vardır.", "Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına yalnız fərdi və kollektiv yazılı müraciətlər göndərmək hüququ vardır.", "Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına şəxsən müraciət etmək, habelə fərdi və kollektiv yazılı və şifahi müraciətlər göndərmək hüququ vardır.", "Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına şəxsən müraciət etmək, habelə fərdi və kollektiv yazılı müraciətlər göndərmək hüququ vardır."]'::jsonb, 'Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına şəxsən müraciət etmək, habelə fərdi və kollektiv yazılı müraciətlər göndərmək hüququ vardır.', 'AR Konstitusiyası — Düzgün cavab D variantıdır.', 42, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '79ce7bc6-6588-4b76-8d66-275a80fe2cd3', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '92f0e26a-65dc-405e-b5d2-c081a4cf1180', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı hallarda üçüncü şəxslər haqqında məlumat almaq məqsədi ilə elektron formada və ya kağız üzərində aparılan informasiya ehtiyatlarına daxil olmaq mümkün olar?', 'multiple_choice',
    '["Öz razılığı olduqda", "Qanunla müəyyən olunmuş hallarda", "Konstitusiaya qanunu ilə müəyyən olunmuş hallarda", "Bütün hallarda"]'::jsonb, 'Qanunla müəyyən olunmuş hallarda', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab B variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 43, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'db2546de-0751-4bf9-a3a8-19a8f2344551', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '93c7ab65-d9f9-49d8-9da9-9b49729e7ac9', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxsin onun barəsində toplanmış və həqiqətə uyğun olmayan, tam olmayan, habelə qanunun tələbləri pozulmaqla əldə edilmiş məlumatların düzəldilməsini və ya çıxarılmasını (ləğv edilməsini) tələb etmək hüququ vardırmı?', 'multiple_choice',
    '["bəli, vardır;", "xeyr, yoxdur;", "qanunda nəzərdə tutulan müstəsna hallarda vardır;", "qanunla nəzərdə tutulan bəzi hallar istisna olmaqla, vardır."]'::jsonb, 'bəli, vardır;', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab A variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 44, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a0006e57-7b56-4262-9b49-6caeeb7b4def', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '97d921da-9806-4c4d-9b82-75a1105c456a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən uyğunluğu müəyyən edin
1) ər ilə arvadın hüquqları
2)Kişi ilə qadının hüquqları
3) Kişi ilə qadının azadlıqları', 'multiple_choice',
    '["1-b,2-a,3-a", "1-a,2-b,3-b", "1-a,2-b,3-c", "1-c,2-a,3-b"]'::jsonb, '1-a,2-b,3-b', 'AR Konstitusiyası Maddə 34 (Nikah hüququ) — Düzgün cavab B variantıdır. Nikah könüllü razılıq əsasında bağlanır. Ər və arvad bərabər hüquqlara malikdir. Valideynlərə qayğı uşaqların borcudur.', 45, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0bf2d226-23dc-4aef-8895-08af66d23a21', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '97dedad3-9e86-4ce8-8ebf-3c68b6d2643f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Əmək müqaviləsi ilə işləyənlərə qanunla müəyyən edilmiş, lakin gündə 12 saatdan artıq olmayan iş günü, istirahət və bayram günləri, ildə azı bir dəfə 21 təqvim günündən çox olmayan ödənişli məzuniyyət verilməsi təmin edilir.", "Əmək müqaviləsi ilə işləyənlərə qanunla müəyyən edilmiş, lakin gündə 8 saatdan artıq olmayan iş günü, istirahət və bayram günləri, ildə azı bir dəfə 21 təqvim günündən az olmayan ödənişli məzuniyyət verilməsi təmin edilir.", "Əmək müqaviləsi ilə işləyənlərə qanunla müəyyən edilmiş, lakin gündə 8 saatdan artıq olmayan iş günü, istirahət və bayram günləri, ildə azı bir dəfə 21 iş günündən az olmayan ödənişli məzuniyyət verilməsi təmin edilir.", "Əmək müqaviləsi ilə işləyənlərə qanunla müəyyən edilmiş, lakin gündə 8 saatdan artıq olmayan iş günü, istirahət və bayram günləri, ildə çoxu bir dəfə 21 təqvim günündən az olmayan ödənişli məzuniyyət verilməsi təmin edilir."]'::jsonb, 'Əmək müqaviləsi ilə işləyənlərə qanunla müəyyən edilmiş, lakin gündə 8 saatdan artıq olmayan iş günü, istirahət və bayram günləri, ildə azı bir dəfə 21 təqvim günündən az olmayan ödənişli məzuniyyət verilməsi təmin edilir.', 'AR Konstitusiyası Maddə 37 (İstirahət hüququ) — Əmək müqaviləsi ilə işləyənlərə gündə 8 saatdan artıq olmayan iş günü, istirahət günləri və ildə azı 21 təqvim günü ödənişli məzuniyyət təmin edilir.', 46, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b4981177-ac8d-49b2-9533-2deee45f0f11', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '9860577e-28b4-4710-ad17-945c9e28b797', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sağlam ətraf mühitdə yaşamaq hüququna aiddir', 'multiple_choice',
    '["Hər bir şəxsin sağlam ətraf mühitdə yaşamaq hüququ vardır.", "Hər bir vətəndaşın sağlam ətraf mühitdə yaşamaq hüququ vardır.", "Hər kəsin sağlam ətraf mühitdə yaşamaq hüququ vardır.", "Hər bir əcnəbi və vətəndaşlığı olmayan şəxsin sağlam ətraf mühitdə yaşamaq hüququ vardır."]'::jsonb, 'Hər kəsin sağlam ətraf mühitdə yaşamaq hüququ vardır.', 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) — Düzgün cavab C variantıdır. Qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə görə sosial təminat almaq hüququ vardır. Pensiya və müavinətlərin minimum məbləği qanunla müəyyən edilir.', 47, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd200f13b-0739-4e54-8768-bddb44b7f75e', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '9b8e9e68-9e84-45a1-8f55-3f740f7b5969', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq müəlliflik hüququ, ixtiraçılıq hüququ və əqli mülkiyyət hüququnun başqa növləri qorunur:', 'multiple_choice',
    '["Qanunla", "Konstitusiya Qanunu ilə", "Konstitusiya ilə", "Qərarla"]'::jsonb, 'Qanunla', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab A variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 48, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0a3dae28-9a2f-4465-9afb-aeb8645020b6', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '9e1e8483-0aa7-4724-ad15-3975cc6fa0d1', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sosial təminat hüququna aid deyil
1. İşsizlərin dövlətdən sosial müavinət almaq hüququ vardır.
2. Hər kəsin sosial təminat hüququ vardır.
3. Yardıma möhtac olanlara kömək etmək ilk növbədə onların ailə üzvlərinin borcudur.
4. Dövlət işsizliyin aradan qaldırılması üçün bütün imkanlarından istifadə edir.', 'multiple_choice',
    '["2,3", "1,4", "1,2", "3,4"]'::jsonb, '1,4', 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) — Düzgün cavab B (1, 4) variantıdır. 1 və 4-cü müddəalar Sosial təminat hüququna (Maddə 38) deyil, Əmək hüququna (Maddə 35.VII və 35.VIII) aiddir.', 49, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9dc59a5c-01fc-4d62-acba-cf653aea9608', '58b1a5a4-8235-4d6e-af90-fd24f212c767', '9fc73aa5-68f5-441d-b8b0-2205a19b0890', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sosial təminat hüququna aid deyil:', 'multiple_choice',
    '["Yardıma möhtac olanlara kömək etmək, ilk növbədə, onların ailə üzvlərinin borcudur", "Hər kəs xəstəliyinə, əlilliyinə, ailə başçısını və əmək qabiliyyətini itirdiyinə, işsizliyə görə sosial təminat almaq hüququna malikdir", "Təqaüdlərin və sosial müavinətlərin minimum məbləği Konstitusiya ilə müəyyən edilir", "Dövlət xeyriyyəçilik fəaliyyətinin, könüllü sosial sığortanın və sosial təminatın başqa növlərinin inkişafı üçün imkanlar yaradır"]'::jsonb, 'Təqaüdlərin və sosial müavinətlərin minimum məbləği Konstitusiya ilə müəyyən edilir', 'AR Konstitusiyası — Düzgün cavab C variantıdır.', 50, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cd1bfdbe-418a-469b-a704-4350ba2ae0be', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'a0175474-e483-45ce-a85d-3bf6b9c16b2f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən təhsil hüququna aid deyil
1. Dövlət təhsil sistemi dünyəvi xarakter daşıyır.
2. Təhsil sisteminə dövlət tərəfindən nəzarət edilir.
3. Dövlət pulsuz icbari ümumi orta təhsil almaq hüququnu təmin edir.
4. Dövlət maksimum təhsil standartlarını müəyyən edir.', 'multiple_choice',
    '["2,3", "1,4", "3,4", "1,2"]'::jsonb, '1,4', 'AR Konstitusiyası Maddə 42 (Təhsil hüququ) — Düzgün cavab B variantıdır. Dövlət pulsuz icbari ümumi orta təhsil almaq hüququnu təmin edir və istedadlı şəxslərin maddi vəziyyətindən asılı olmayaraq təhsilini davam etdirməsinə zəmanət verir.', 51, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '837ac01a-369b-4c7c-b751-08e2aed2f657', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'a3050ec2-c276-4dad-95e9-ecb68b720b41', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Təqaüdlərin və sosial müavinətlərin maksimum məbləği qanunla müəyyən edilir.", "Təqaüdlərin və sosial müavinətlərin minimum məbləği qərarla müəyyən edilir.", "Təqaüdlərin və sosial müavinətlərin minimum məbləği sərəncamla müəyyən edilir.", "Təqaüdlərin və sosial müavinətlərin minimum məbləği qanunla müəyyən edilir."]'::jsonb, 'Təqaüdlərin və sosial müavinətlərin minimum məbləği qanunla müəyyən edilir.', 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) — Qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə görə sosial təminat almaq hüququ vardır. Pensiya və müavinətlərin minimum məbləği qanunla müəyyən edilir.', 52, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd8885a9b-98a1-4d78-9027-93860ab91e98', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'a9be63df-ec4b-4c35-a322-6c13cff14f86', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı subyektlərlə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir?', 'multiple_choice',
    '["Məhkəmələr və digər dövlət orqanları ilə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir;", "Fiziki və hüquqi şəxslərlə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir;", "Hüquq və vəzifələrlə bağlı qərarlar qəbul edən dövlət orqanları və dövlət hakimiyyəti səlahiyyətlərinin daşıyıcıları ilə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir;", "Bütün hüquq subyektləri ilə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir."]'::jsonb, 'Hüquq və vəzifələrlə bağlı qərarlar qəbul edən dövlət orqanları və dövlət hakimiyyəti səlahiyyətlərinin daşıyıcıları ilə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir;', 'AR Konstitusiyası Maddə 25 (Bərabərlik hüququ) — Düzgün cavab C variantıdır. Hamı qanun və məhkəmə qarşısında bərabərdir. Kişi ilə qadının eyni hüquq və azadlıqları vardır. Sağlamlıq imkanları məhdud olanlar bərabər hüquqlardan istifadə edirlər (2016).', 53, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ef236793-afcd-429c-9846-a8d5fe877d99', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'aa6110e3-8f0e-4be7-acd4-25f35216ed57', 'Azərbaycan Respublikasının Konstitusiyasına əsasən kimlər sərbəst hərəkət edə bilər, özünə yaşayış yeri seçə bilər və Azərbaycan Respublikasının ərazisindən kənara gedə bilər?', 'multiple_choice',
    '["Qanuni surətdə Azərbaycan Respublikasının ərazisində olan hər kəs sərbəst hərəkət edə bilər, özünə yaşayış yeri seçə bilər və Azərbaycan Respublikasının ərazisindən kənara gedə bilər;", "Azərbaycan Respublikasının ərazisində daimi yaşayan hər kəs sərbəst hərəkət edə bilər, özünə yaşayış yeri seçə bilər və Azərbaycan Respublikasının ərazisindən kənara gedə bilər;", "Azərbaycan Respublikasının ərazisində olan hər kəs sərbəst hərəkət edə bilər, özünə yaşayış yeri seçə bilər və Azərbaycan Respublikasının ərazisindən kənara gedə bilər;", "Azərbaycan Respublikasının vətəndaşları Azərbaycan Respublikasının ərazisində sərbəst hərəkət edə bilər, özünə yaşayış yeri seçə bilər və Azərbaycan Respublikasının ərazisindən kənara gedə bilər."]'::jsonb, 'Qanuni surətdə Azərbaycan Respublikasının ərazisində olan hər kəs sərbəst hərəkət edə bilər, özünə yaşayış yeri seçə bilər və Azərbaycan Respublikasının ərazisindən kənara gedə bilər;', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab A variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 54, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1951af90-ddf6-4c2a-9f14-174f40b896b8', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'ac360ccd-3873-488c-ac1a-06baee140c25', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq nikah və ailə himayəsindədir:', 'multiple_choice',
    '["Dövlətin", "Xalqın", "Milli Məclisin", "Məhkəmənin"]'::jsonb, 'Dövlətin', 'AR Konstitusiyası Maddə 34 (Nikah hüququ) — Düzgün cavab A variantıdır. Nikah könüllü razılıq əsasında bağlanır. Ər və arvad bərabər hüquqlara malikdir. Valideynlərə qayğı uşaqların borcudur.', 55, NULL, 'Ailə dövlətin ümumi deyil, xüsusi himayəsindədir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3e3fb7bf-c6ca-452e-8c87-ada532da2208', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'b57f849d-f833-4259-b853-85a623d4d207', 'Azərbaycan Respublikasının Konstitusiyasına əsasən insan və vətəndaş hüquqlarının və azadlıqlarının əsas prinsipi maddəsinə 2016 cı il 26 sentyabr tarixli əlavəni seçin
1. İnsan ləyaqəti qorunur və ona hörmət edilir
2. Hər kəsin doğulduğu andan toxunulmaz, pozulmaz və ayrılmaz hüquqları və azadlıqları vardır.
3. Hüquqlar və azadlıqlar hər kəsin cəmiyyət və başqa şəxslər qarşısında məsuliyyətini və vəzifələrini də əhatə edir
4. Hüquqlardan sui-istifadəyə yol verilmir.', 'multiple_choice',
    '["1,2", "1,4", "3,4", "2,3"]'::jsonb, '1,4', 'AR Konstitusiyası Maddə 24.II və 24.III (2016-cı il referendum əlavələri) — Düzgün cavab B (1, 4) variantıdır. 2016-cı ildə Maddə 24-ə ''İnsan ləyaqəti qorunur və ona hörmət edilir'' (1) və ''Hüquqlardan sui-istifadəyə yol verilmir'' (4) müddəaları əlavə edilmişdir.', 56, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '387c2e91-d744-4da2-ae27-d37bd044cd3e', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'b68630d4-576f-4aa3-9116-1a003d6b3c1a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən xüsusi mülkiyyət səbəb olur:', 'multiple_choice',
    '["Xüsusi mülkiyyət sosial öhdəliklərə səbəb olur.", "Xüsusi mülkiyyət torpaqlardan səmərəli istifadəyə səbəb olur", "Xüsusi mülkiyyət azad hüquqların təminatına səbəb olur", "Xüsusi mülkiyyət daxili nizamnamənin tətbiqinə səbəb olur"]'::jsonb, 'Xüsusi mülkiyyət sosial öhdəliklərə səbəb olur.', 'AR Konstitusiyası Maddə 29 (Mülkiyyət hüququ) — Düzgün cavab A variantıdır. Mülkiyyət hüququ qanunla qorunur. Dövlət ehtiyacları üçün özgəninkiləşdirmə yalnız qabaqcadan ədalətli haqqı ödənilməklə həyata keçirilə bilər. Əmlakın tam müsadirəsinə yol verilmir (2016). Torpaq mülkiyyəti sosial ədalət məqsədilə qanunla məhdudlaşdırıla bilər.', 57, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '48760afc-b438-4797-aa2c-b58944f3eb27', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'bf617e45-e0d8-48be-b750-6a1eba4349ed', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["İnsanların həyatı və sağlamlığı üçün təhlükə törədən faktları və halları gizlədən vəzifəli şəxslər qanun əsasında məsuliyyətə cəlb edilə bilməzlər", "İnsanların həyatı və sağlamlığı üçün təhlükə törədən faktları və halları gizlədən vəzifəli şəxslər qanun əsasında məsuliyyətə cəlb edilirlər.", "İnsanların həyatı və sağlamlığı üçün təhlükə törədən faktları və halları gizlədən vəzifəli şəxslər qərar əsasında məsuliyyətə cəlb edilirlər.", "İnsanların həyatı və sağlamlığı üçün təhlükə törədən faktları və halları gizlədən vəzifəli şəxslər fərman əsasında məsuliyyətə cəlb edilirlər."]'::jsonb, 'İnsanların həyatı və sağlamlığı üçün təhlükə törədən faktları və halları gizlədən vəzifəli şəxslər qanun əsasında məsuliyyətə cəlb edilirlər.', 'AR Konstitusiyası Maddə 42 (Təhsil hüququ) — Dövlət pulsuz icbari ümumi orta təhsil almaq hüququnu təmin edir və istedadlı şəxslərin maddi vəziyyətindən asılı olmayaraq təhsilini davam etdirməsinə zəmanət verir.', 58, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f2f4a53e-e866-4c91-8542-5f31fac498ef', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'd4794c23-5600-4832-a1a0-c74af9826e3a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən dövlət kimlərin təhsilini davam etdirməsinə zəmanət verir?', 'multiple_choice',
    '["Maddi vəziyyətindən asılı olaraq istedadlı şəxslərin təhsili davam etdirməsinə dövlət zəmanət verir.", "Maddi vəziyyətdən asılı olmayaraq istedadlı şəxslərin təhsili davam etdirməsinə dövlət zəmanət verir.", "Maddi vəziyyətindən asılı olmayaraq sağlamlıq imkanları məhdud olan şəxslərin təhsili davam etdirməsinə dövlət zəmanət verir.", "Maddi vəziyyətindən asılı olaraq sağlamlıq imkanları məhdud olan şəxslərin təhsili davam etdirməsinə dövlət zəmanət verir."]'::jsonb, 'Maddi vəziyyətdən asılı olmayaraq istedadlı şəxslərin təhsili davam etdirməsinə dövlət zəmanət verir.', 'AR Konstitusiyası Maddə 42 (Təhsil hüququ) — Düzgün cavab B variantıdır. Dövlət pulsuz icbari ümumi orta təhsil almaq hüququnu təmin edir və istedadlı şəxslərin maddi vəziyyətindən asılı olmayaraq təhsilini davam etdirməsinə zəmanət verir.', 59, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8b082434-67fa-4975-8bd9-0346a67af168', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'd62b3f84-111f-4155-b5d5-b81dd68ead7d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı cümlə hansı hüquqa aiddir:
“Hər kəsin istədiyi dildə tərbiyə və təhsil almaq, yaradıcılıqla məşğul olmaq hüququ vardır.”', 'multiple_choice',
    '["Din və dövlət", "Yaradıcılıq azadlığı", "Təhsil hüququ", "Ana dilindən istifadə hüququ"]'::jsonb, 'Ana dilindən istifadə hüququ', 'AR Konstitusiyası Maddə 45 (Ana dilindən istifadə hüququ) — Düzgün cavab D variantıdır. Hər kəsin ana dilindən istifadə etmək, istədiyi dildə tərbiyə və təhsil almaq hüququ vardır.', 60, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '714fe234-996a-4bc2-97be-932bb8323671', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'd62b5269-3e2e-482c-9606-5039710ab131', 'Azərbaycan Respublikasının Konstitusiyasına əsasən azadlıq hüququ hansı yolla məhdudlaşdırıla bilər?
1. Tutulma
2. Müvəqqəti saxlama
3. Həbsəalma
4. Cəmiyyətdən kənarlaşdırma
5. Azadlıqdan məhrumetmə', 'multiple_choice',
    '["1,2,3", "2,3,4", "3,4,5", "1,3,5"]'::jsonb, '1,3,5', 'AR Konstitusiyası Maddə 28 (Azadlıq hüququ) — Düzgün cavab D variantıdır. Hər kəs yalnız qanunla nəzərdə tutulmuş qaydada tutula, həbsə alına və ya azadlıqdan məhrum edilə bilər. Sərbəst hərəkət və yaşayış yeri seçmək hüququ təmin edilir.', 61, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '46efc914-2afb-4caf-a767-4a475f53f4a3', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'd751d313-e3f5-4f4b-bc89-e467821e3535', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Hər bir şəxsin təhlükəsiz və sağlam şəraitdə işləmək, heç bir ayrı-seçkilik qoyulmadan öz işinə görə dövlətin müəyyənləşdirdiyi minimum əmək haqqı miqdarından az olmayan haqq almaq hüququ vardır.", "Hər bir vətəndaşın təhlükəsiz və sağlam şəraitdə işləmək, heç bir ayrı-seçkilik qoyulmadan öz işinə görə dövlətin müəyyənləşdirdiyi minimum əmək haqqı miqdarından az olmayan haqq almaq hüququ vardır.", "Hər kəsin təhlükəsiz və sağlam şəraitdə işləmək, heç bir ayrı-seçkilik qoyulmadan öz işinə görə dövlətin müəyyənləşdirdiyi minimum əmək haqqı miqdarından çox olmayan haqq almaq hüququ vardır.", "Hər kəsin təhlükəsiz və sağlam şəraitdə işləmək, heç bir ayrı-seçkilik qoyulmadan öz işinə görə dövlətin müəyyənləşdirdiyi minimum əmək haqqı miqdarından az olmayan haqq almaq hüququ vardır."]'::jsonb, 'Hər kəsin təhlükəsiz və sağlam şəraitdə işləmək, heç bir ayrı-seçkilik qoyulmadan öz işinə görə dövlətin müəyyənləşdirdiyi minimum əmək haqqı miqdarından az olmayan haqq almaq hüququ vardır.', 'AR Konstitusiyası Maddə 35 (Əmək hüququ) — Hər kəsin sərbəst surətdə fəaliyyət növü, peşə və iş yeri seçmək hüququ vardır. Məcburi əmək qadağandır. Dövlət işsizliyin aradan qaldırılması üçün imkanlarından istifadə edir.', 62, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '08ad8e7f-f98b-495b-a3dd-2325d7a82f96', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'd9a514bf-4782-40c2-8cc3-cade0973d920', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğru deyil
1. Əmək kollektiv və ictimai rifahın əsasıdır.
2. Hər kəsin əməyə olan qabiliyyəti əsasında sərbəst surətdə özünə fəaliyyət növü, peşə, məşğuliyyət və iş yeri seçmək hüququ vardır.
3. Heç kəs zorla işlədilə bilməz.
4. Əmək müqavilələri könüllü bağlanılır.
5. Heç kəs əmək müqaviləsi bağlamağa məcbur edilə bilməz.', 'multiple_choice',
    '["2,5", "3,5", "1,4", "1,2"]'::jsonb, '1,4', 'AR Konstitusiyası Maddə 35 (Əmək hüququ) — Düzgün cavab C (1, 4) variantıdır. 1-ci bənd səhvdir, çünki əmək ''kollektiv'' deyil, ''fərdi və ictimai'' rifahın əsasıdır; 4-cü bənd səhvdir, çünki əmək müqavilələri ''könüllü'' deyil, ''sərbəst'' bağlanır.', 63, NULL, 'Əmək həm fərdi, həm də ictimai rifahın təməlidir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9ed3bcfd-055d-4600-853b-bd9b27ec33b4', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'e407dd44-cfe6-4e9c-b64d-77127e3307fa', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sosial təminat hüququna aiddir', 'multiple_choice',
    '["Hər bir şəxs qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə, ailə başçısını itirdiyinə, əmək qabiliyyətini itirdiyinə, işsizliyə görə və qanunla nəzərdə tutulmuş digər hallarda sosial təminat hüququna malikdir.", "Hər kəs qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə, ailə üzvlərini itirdiyinə, əmək qabiliyyətini itirdiyinə, işsizliyə görə və qanunla nəzərdə tutulmuş digər hallarda sosial təminat hüququna malikdir.", "Hər bir şəxs qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə, ailə başçısını itirdiyinə, əmək qabiliyyətini müvəqqəti itirdiyinə, işsizliyə görə və qanunla nəzərdə tutulmuş digər hallarda sosial təminat hüququna malikdir.", "Hər kəs qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə, ailə başçısını itirdiyinə, əmək qabiliyyətini itirdiyinə, işsizliyə görə və qanunla nəzərdə tutulmuş digər hallarda sosial təminat hüququna malikdir."]'::jsonb, 'Hər kəs qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə, ailə başçısını itirdiyinə, əmək qabiliyyətini itirdiyinə, işsizliyə görə və qanunla nəzərdə tutulmuş digər hallarda sosial təminat hüququna malikdir.', 'AR Konstitusiyası Maddə 38 (Sosial təminat hüququ) — Düzgün cavab D variantıdır. Qanunla müəyyən edilmiş yaş həddinə çatdıqda, xəstəliyinə, əlilliyinə görə sosial təminat almaq hüququ vardır. Pensiya və müavinətlərin minimum məbləği qanunla müəyyən edilir.', 64, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '06facd14-a804-4a03-94b8-0f44e84a0fbf', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'e4610ebb-669c-4101-a346-258e754ef86f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hər kəsin hansı üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır?', 'multiple_choice',
    '["Hər kəsin qanunla müəyyən olunan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır;", "Hər kəsin qanunla qadağan olunmayan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır;", "Hər kəsin qanuna zidd olmayan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır;", "Hər kəsin beynəlxalq hüquq normaları ilə müəyyən olunan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır."]'::jsonb, 'Hər kəsin qanunla qadağan olunmayan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır;', 'AR Konstitusiyası Maddə 25 (Bərabərlik hüququ) — Düzgün cavab B variantıdır. Hamı qanun və məhkəmə qarşısında bərabərdir. Kişi ilə qadının eyni hüquq və azadlıqları vardır. Sağlamlıq imkanları məhdud olanlar bərabər hüquqlardan istifadə edirlər (2016).', 65, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '27290d43-7c84-4eed-86de-0bf9567a60e9', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'e72e90b0-388a-4903-972a-d1ecb409ecb1', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq kimlərin yaşamaq hüququ vardır?', 'multiple_choice',
    '["Yalnız hər bir vətəndaşın yaşamaq hüququ vardır", "Hər kəsin yaşamaq hüququ vardır", "Hər bir şəxsin yaşamaq hüququ vardır", "Hər bir əcnəbinin və vətəndaşlığı olmayan şəxsin yaşamaq hüququ vardır"]'::jsonb, 'Hər kəsin yaşamaq hüququ vardır', 'AR Konstitusiyası Maddə 26 (Hüquq və azadlıqların müdafiəsi) — Düzgün cavab B variantıdır. Hər kəsin qanunla qadağan olunmayan üsul və vasitələrlə öz hüquqlarını və azadlıqlarını müdafiə etmək hüququ vardır.', 66, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0b46af4a-b6e1-471b-98f1-7fe3db4869d0', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'ea23d992-fe6a-4478-aeb8-122c92c91b4a', 'Milli mənsubiyyət hüququna aid deyil
1. Hər kəsin milli mənsubiyyətini qoruyub saxlamaq hüququ vardır.
2. Heç kəs milli mənsubiyyətini dəyişdirməyə məcbur edilə bilməz.
3. Hər kəsin ana dilindən istifadə etmək hüququ vardır.
4. Heç kəs ana dilindən istifadə hüququndan məhrum edilə bilməz.', 'multiple_choice',
    '["1,2", "3,4", "1,3", "2,3"]'::jsonb, '3,4', 'AR Konstitusiyası Maddə 44 (Milli mənsubiyyət hüququ) — Düzgün cavab B (3, 4) variantıdır. 3 və 4-cü bəndlər Milli mənsubiyyət (Maddə 44) deyil, Ana dilindən istifadə hüququna (Maddə 45) aiddir.', 67, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4497a98a-8856-44a1-b04c-e0e665ddc95d', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'ec027650-e5a4-4738-9b77-3615a660266c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hər kəsin yazışma, telefon danışıqları, poçt, teleqraf və digər rabitə vasitələri ilə ötürülən məlumatın sirrini saxlamaq hüququ nə məqsədlə məhdudlaşdırıla bilər?
1. qanunla nəzərdə tutulmuş qaydada cinayətin qarşısını almaqdan ötrü
2. dövlət təhlükəsizliyi və ölkənin iqtisadi rifahı mənafeləri üçün
3. başqa şəxslərin hüquqlarının və azadlıqlarının təmini məqsədilə
4. ictimai qaydanın təmin edilməsi üçün, iğtişaşların və cinayətin qarşısının alınması məqsədilə
5. cinayət işinin istintaqı zamanı həqiqəti üzə çıxarmaqdan ötrü', 'multiple_choice',
    '["1; 5", "2; 3", "4; 5", "2; 4"]'::jsonb, '1; 5', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab A variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 68, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '301f21ef-f058-4bae-924a-f4a4035634be', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'ed85f0ab-539a-404e-be32-468fcf6cc8a1', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakılardan hansı düzgündür?', 'multiple_choice',
    '["Milli Məclisin qərarı olmadan kimsənin şəxsi həyatı haqqında məlumatın toplanılmasına, saxlanılmasına, istifadəsinə və yayılmasına yol verilmir", "Nazirlər Kabinetinin sərəncamı olmadan kimsənin şəxsi həyatı haqqında məlumatın toplanılmasına, saxlanılmasına, istifadəsinə və yayılmasına yol verilmir", "Öz razılığı olmadan kimsənin şəxsi həyatı haqqında məlumatın toplanılmasına, çap olunmasına, istifadəsinə və yerləşdirilməsinə yol verilmir", "Öz razılığı olmadan kimsənin şəxsi həyatı haqqında məlumatın toplanılmasına, saxlanılmasına, istifadəsinə və yayılmasına yol verilmir"]'::jsonb, 'Öz razılığı olmadan kimsənin şəxsi həyatı haqqında məlumatın toplanılmasına, saxlanılmasına, istifadəsinə və yayılmasına yol verilmir', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 69, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3ea8ff4c-a90a-4661-b82b-757caae93531', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'f690a657-2bc1-4466-b56d-eda6db2d8895', 'Azərbaycan Respublikasının Konstitusiyasında nəzərdə tutulan “ Qanunla müəyyən edilmiş hallar istisna olmaqla, hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər ” müddəası hansı hüquqa aiddir?', 'multiple_choice',
    '["məlumat azadlığı hüququ;", "fərdi məlumatlarla tanış olmaq hüququ;", "şəxsi toxunulmazlıq hüququ;", "məlumat əldə etmək hüququ."]'::jsonb, 'şəxsi toxunulmazlıq hüququ;', 'AR Konstitusiyası Maddə 32 (Şəxsi toxunulmazlıq hüququ) — Düzgün cavab C variantıdır. Hər kəsin şəxsi və ailə həyatının sirrini saxlamaq hüququ vardır. Şəxsi məlumatların qanunsuz toplanması qadağandır. Hər kəs onun haqqında toplanmış məlumatlarla tanış ola bilər (2016).', 70, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a095c431-f207-4f8b-9184-77290a824aef', '58b1a5a4-8235-4d6e-af90-fd24f212c767', 'f849b9d3-5c2f-4f0b-b4fa-6c2084f96da5', 'Azərbaycan Respublikasının Konstitusiyasına əsasən mədəniyyət hüququnda təsbit edilmişdir:', 'multiple_choice',
    '["Hər kəs tarixi, mədəni və mənəvi irsə hörmətlə yanaşmalı, onu bərpa etməli, tarix və mədəniyyət abidələrini qorumalıdır.", "Hər kəs tarixi, maddi, mədəni və mənəvi irsə hörmətlə yanaşmalı, ona qayğı göstərməli, tarix və mədəniyyət abidələrini qorumalıdır.", "Hər kəs tarixi, mədəni və mənəvi irsə hörmətlə yanaşmalı, ona qayğı göstərməli, tarix və mədəniyyət abidələrini qorumalıdır.", "Hər kəs tarixi,siyasi, mədəni və mənəvi irsə hörmətlə yanaşmalı, ona qayğı göstərməli, tarix və mədəniyyət abidələrini qorumalıdır."]'::jsonb, 'Hər kəs tarixi, mədəni və mənəvi irsə hörmətlə yanaşmalı, ona qayğı göstərməli, tarix və mədəniyyət abidələrini qorumalıdır.', 'AR Konstitusiyası Maddə 39 (Sağlam ətraf mühitdə yaşamaq hüququ) — Düzgün cavab C variantıdır. Hər kəsin ətraf mühitin vəziyyəti haqqında məlumat toplamaq və ekoloji hüquqpozma nəticəsində vurulmuş zərərin əvəzini almaq hüququ vardır.', 71, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 2/2: Maddə 46-71)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    'd28436aa-819f-4f59-9c8c-2afee5bd0593', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 2/2: Maddə 46-71)', 'Vicdan azadlığı, Müraciət, Birləşmək, Seçki, Məhkəmə təminatı, Təqsirsizlik prezumpsiyası, Hüquq və azadlıqların təminatı.',
    'Hüquq', 'hard', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cf110533-27ed-47d3-9763-d52f6d9e555a', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '007d2457-5cb2-4abc-b818-06a57738583c', 'Azərbaycan Respublikasının Konstitusiyasına görə hər hansı bir şəxs hansı qohumlar əleyhinə ifadə verilməyə məcbur edilə bilməz?
1. Arvad (ər)
2. Dayı oğlu (dayı qızı)
3. Övladlar
4. Xala oğlu (xala qızı)
5. Valideynlər
6. Bibi oğlu (bibi qızı)
7. Qardaş (bacı)', 'multiple_choice',
    '["1,2,3", "3,4,5,7", "5,6,7", "1,3,5,7"]'::jsonb, '1,3,5,7', 'AR Konstitusiyası Maddə 65 (Məhkəməyə təkrar müraciət etmək hüququ) — Düzgün cavab D variantıdır. Məhkum edilmiş hər bir şəxsin hökmün yuxarı məhkəmə tərəfindən yenidən baxılması haqqında müraciət etmək hüququ vardır.', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c10415fd-50b8-4c09-b936-8589862269ef', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '01c9ac61-82c7-43f4-82b1-ad2db56e2e33', 'Azərbaycan Respublikasının Konstitusiyasına görə əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquqları maddəsinə aiddir', 'multiple_choice',
    '["Əcnəbilər və vətəndaşlığı olmayan şəxslər Azərbaycan Respublikasında olarkən, qərarla və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilə ilə başqa hal nəzərdə tutulmayıbsa, Azərbaycan Respublikasının vətəndaşları ilə bərabər bütün hüquqlardan istifadə edə bilər və bütün vəzifələri yerinə yetirməlidirlər.", "Əcnəbilər və vətəndaşlığı olmayan şəxslər Azərbaycan Respublikasında olarkən, qanunla və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilə ilə başqa hal nəzərdə tutulmayıbsa, Azərbaycan Respublikasının vətəndaşları ilə bərabər bütün hüquqlardan istifadə edə bilməzlər və bütün vəzifələri yerinə yetirə bilməzlər", "Əcnəbilər və vətəndaşlığı olmayan şəxslər Azərbaycan Respublikasında olarkən, qanunla və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq saziş ilə başqa hal nəzərdə tutulmayıbsa, Azərbaycan Respublikasının vətəndaşları ilə bərabər bütün hüquqlardan istifadə edə bilər və bütün vəzifələri yerinə yetirməlidirlər.", "Əcnəbilər və vətəndaşlığı olmayan şəxslər Azərbaycan Respublikasında olarkən, qanunla və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilə ilə başqa hal nəzərdə tutulmayıbsa, Azərbaycan Respublikasının vətəndaşları ilə bərabər bütün hüquqlardan istifadə edə bilər və bütün vəzifələri yerinə yetirməlidirlər."]'::jsonb, 'Əcnəbilər və vətəndaşlığı olmayan şəxslər Azərbaycan Respublikasında olarkən, qanunla və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilə ilə başqa hal nəzərdə tutulmayıbsa, Azərbaycan Respublikasının vətəndaşları ilə bərabər bütün hüquqlardan istifadə edə bilər və bütün vəzifələri yerinə yetirməlidirlər.', 'AR Konstitusiyası Maddə 70 (Siyasi sığınacaq hüququ) — Düzgün cavab D variantıdır. AR ümumtanınmış beynəlxalq hüquq normalarına uyğun olaraq əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0934bb52-15d6-439e-ba2f-d462d3c817da', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '184f10c5-5a2f-46f2-a272-972cd1398eea', 'Azərbaycan Respublikasının Konstitusiyasına əsasən sərbəst toplaşmaq azadlığı nədir?', 'multiple_choice',
    '["Hər kəsin başqaları ilə birlikdə müvafiq dövlət orqanlarından qabaqcadan icazə almaqla, dinc, silahsız yığışmaq, yığıncaqlar, mitinqlər, nümayişlər, küçə yürüşləri keçirmək, piketlər düzəltmək hüququ vardır", "Hər kəsin başqaları ilə birlikdə müvafiq dövlət orqanlarını qabaqcadan xəbərdar etmədən dinc, yığıncaqlar, mitinqlər, nümayişlər, küçə yürüşləri keçirmək, piketlər düzəltmək hüququ vardır", "Hər kəsin başqaları ilə birlikdə müvafiq dövlət orqanlarını qabaqcadan xəbərdar etməklə dinc, silahlı və ya silahsız yığışmaq, yığıncaqlar, mitinqlər, nümayişlər, küçə yürüşləri keçirmək, piketlər düzəltmək hüququ vardır", "Hər kəsin başqaları ilə birlikdə müvafiq dövlət orqanlarını qabaqcadan xəbərdar etməklə, ictimai qaydanı və ya ictimai əxlaqı pozmamaq şərtilə dinc, silahsız yığışmaq, yığıncaqlar, mitinqlər, nümayişlər, küçə yürüşləri keçirmək, piketlər düzəltmək hüququ vardır"]'::jsonb, 'Hər kəsin başqaları ilə birlikdə müvafiq dövlət orqanlarını qabaqcadan xəbərdar etməklə, ictimai qaydanı və ya ictimai əxlaqı pozmamaq şərtilə dinc, silahsız yığışmaq, yığıncaqlar, mitinqlər, nümayişlər, küçə yürüşləri keçirmək, piketlər düzəltmək hüququ vardır', 'AR Konstitusiyası Maddə 48 (Vicdan azadlığı) — Düzgün cavab D variantıdır. Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək hüququ vardır. Dini etiqad və əqidə hüquq pozuntusuna bəraət qazandırmır.', 2, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '45468bea-79a7-4c12-88bf-e6433f305dd6', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '1e96984b-51a2-4f24-85b0-f35d0484866f', '”Qanunu bilməmək məsuliyyətdən azad etmir” cümləsi Konstitusiyanın hansı maddəsində təsbit olunmuşdur?', 'multiple_choice',
    '["İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı", "Zərərin ödənilməsini tələb etmək hüququ", "Vətəndaşların vəzifələrinin əsası", "Vətənə sədaqət"]'::jsonb, 'Vətəndaşların vəzifələrinin əsası', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab C variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 3, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '088a024d-5aa0-410a-9f31-d77f008db52f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '22785044-b112-4b66-94ab-159afda7999a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən fikir və söz azadlığı maddəsinə aid deyil
1. Hər kəsin fikir və söz azadlığı vardır.
2. Heç kəs öz fikir və əqidəsini açıqlamağa və ya fikir və əqidəsindən dönməyə məcbur edilə bilməz.
3. Hər bir şəxsin fikir və söz azadlığı vardır.
4. Fərdi və kollektiv əmək mübahisələri qanunla müəyyənləşdirilmiş qaydada həll edilir.', 'multiple_choice',
    '["1,2", "3,4", "1,3", "2,3"]'::jsonb, '3,4', 'AR Konstitusiyası Maddə 47 (Fikir və söz azadlığı) — Düzgün cavab B variantıdır. Heç kəs öz fikir və əqidəsini bildirməyə məcbur edilə bilməz. İrqi, milli, dini nifrət və düşmənçilik təbliği qadağandır.', 4, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'dacf3f4e-334f-4abf-a5f6-d5e6eab419c3', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '247e3590-73d4-4ce2-9fe8-bce91781c96f', 'Azərbaycan Respublikasının Konstitusiyasına görə hansı hallarda insan və vətəndaş hüquqlarının və azadlıqlarının həyata keçirilməsi Azərbaycan Respublikasının beynəlxalq öhdəliklərini nəzərə almaq şərti ilə qismən və müvəqqəti məhdudlaşdırıla bilər?
1. Müharibə elan edildikdə
2. İctimai toplandılar keçirildikdə
3. Hərbi vəziyyət elan edildikdə
4. Seçkilər keçirildikdə
5. Fövqəladə vəziyyət elan edildikdə
6. Azərbaycan Respublikasının Nazirlər Kabinetinin toplantısı keçirildikdə
7. Səfərbərlik elan edilərkən', 'multiple_choice',
    '["1,2,3,6", "4,5,6", "5,6,7", "1,3,5,7"]'::jsonb, '1,3,5,7', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab D variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 5, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd4352e77-a23a-49d5-aa06-683310a97b06', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '26c2194a-c1bf-4118-b975-3bd0fa37718b', 'Azərbaycan Respublikasının Konstitusiyasına görə cinayət, habelə hakimiyyətdən sui-istifadə nəticəsində zərər çəkmiş şəxsin hüquqları hansı aktla qorunur?', 'multiple_choice',
    '["qanunla", "qərarla", "Azərbaycan Respublikası Nazirlər Kabinetinin sərəncamı ilə", "Azərbaycan Respublikası Prezidentinin fərmanı ilə"]'::jsonb, 'qanunla', 'AR Konstitusiyası Maddə 68 (Özbaşınalıqdan müdafiə və vicdanlı davranış) — Düzgün cavab A variantıdır. Zərər çəkmiş şəxsin ədalət mühakiməsində iştirak etmək və ona vurulmuş zərərin ödənilməsini tələb etmək hüququ vardır (2016).', 6, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1aa61cc8-27a0-4464-a418-71c77216dedd', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '26ec7279-51fb-4e60-8f0c-1cca4823b632', 'Azərbaycan Respublikasının Konstitusiyasına görə vətəndaşların əsas hüquqlarından biridir:', 'multiple_choice',
    '["Dövlət rəmzlərinə hörmət", "Vətəni müdafiə etmək", "Vətənə sədaqət", "Dövlətin siyasi həyatında iştirak etmək"]'::jsonb, 'Dövlətin siyasi həyatında iştirak etmək', 'AR Konstitusiyası Maddə 69 (Əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquqları) — Düzgün cavab D variantıdır. Əcnəbilər və vətəndaşlığı olmayan şəxslər AR vətəndaşları ilə bərabər hüquqlardan istifadə edir və vəzifələri daşıyırlar (seçki hüququ və dövlət qulluğu kimi qanunla istisna hallar xaricində).', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bed2e6df-1adb-4fb1-8682-73e8c56456de', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '29566b1e-690d-4ce6-8ca9-6989e2eb8f36', 'Azərbaycan Respublikasının Konstitusiyasına görə azad sahibkarlıq hüququ nədir?', 'multiple_choice',
    '["Hər kəs öz imkanlarından, qabiliyyətindən və əmlakından sərbəst istifadə edərək təkbaşına və ya başqaları ilə birlikdə azad sahibkarlıq fəaliyyəti və ya qanunla qadağan edilməmiş digər siyasi fəaliyyət növü ilə məşğul ola bilər.", "Hər kəs öz imkanlarından, qabiliyyətindən və əmlakından sərbəst istifadə edərək təkbaşına və ya başqaları ilə birlikdə azad sahibkarlıq fəaliyyəti və ya qanunla qadağan edilməmiş digər sosial fəaliyyət növü ilə məşğul ola bilər.", "Hər kəs öz imkanlarından, qabiliyyətindən və əmlakından sərbəst istifadə edərək təkbaşına və ya başqaları ilə birlikdə azad sahibkarlıq fəaliyyəti və ya qanunla qadağan edilməmiş digər ictimai fəaliyyət növü ilə məşğul ola bilər.", "Hər kəs öz imkanlarından, qabiliyyətindən və əmlakından sərbəst istifadə edərək təkbaşına və ya başqaları ilə birlikdə azad sahibkarlıq fəaliyyəti və ya qanunla qadağan edilməmiş digər iqtisadi fəaliyyət növü ilə məşğul ola bilər."]'::jsonb, 'Hər kəs öz imkanlarından, qabiliyyətindən və əmlakından sərbəst istifadə edərək təkbaşına və ya başqaları ilə birlikdə azad sahibkarlıq fəaliyyəti və ya qanunla qadağan edilməmiş digər iqtisadi fəaliyyət növü ilə məşğul ola bilər.', 'AR Konstitusiyası Maddə 58 (Birləşmək hüququ) — Düzgün cavab D variantıdır. Hər kəsin siyasi partiya, həmkarlar ittifaqı və digər ictimai birliklər yaratmaq hüququ vardır. Bütün cəmiyyəti təmsil etmək iddiasında olan birliklərin fəaliyyəti qadağandır.', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd81d268b-1a5a-4ac6-a641-51602ef1494d', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '2a36ca09-349b-4fed-9221-2dcae30dc9bb', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məlumat azadlığına aid deyil', 'multiple_choice',
    '["Kütləvi informasiyanın azadlığına təminat verilir.", "Hər kəsin kütləvi informasiya vasitələrində dərc edilən və onun hüquqlarını pozan məlumatı təkzib etmək və ya ona cavab vermək hüququna təminat verilir.", "Kütləvi informasiya vasitələrində, o cümlədən mətbuatda dövlət senzurası qadağandır.", "Yalnız əmək müqaviləsi əsasında işləyənlərin kütləvi informasiya vasitələrində dərc edilən və onun mənafelərinə xələl gətirən məlumatı təkzib etmək və ya ona cavab vermək hüququna təminat verilir."]'::jsonb, 'Yalnız əmək müqaviləsi əsasında işləyənlərin kütləvi informasiya vasitələrində dərc edilən və onun mənafelərinə xələl gətirən məlumatı təkzib etmək və ya ona cavab vermək hüququna təminat verilir.', 'AR Konstitusiyası Maddə 50 (Məlumat azadlığı) — Düzgün cavab D variantıdır. Hər kəsin qanuni yolla məlumatı axtarmaq, əldə etmək, hazırlamaq və yaymaq azadlığı vardır. KİV senzurası qadağandır.', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8948270c-05b6-4aaf-b892-4333c47eb7df', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '30cc24e6-f315-4339-9d0f-cad39b60aedc', 'Azərbaycan Respublikasının Konstitusiyasına görə doğrudur', 'multiple_choice',
    '["Konstitusiyanı və qanunları pozan birliklərin fəaliyyətinə yalnız məhkəmə qaydasında xitam verilə bilər.", "Konstitusiyanı və qanunları pozan birliklərin fəaliyyətinə Azərbaycan Respublikasının Prezidentinin Fərmanı ilə xitam verilə bilər.", "Konstitusiyanı və qanunları pozan birliklərin fəaliyyətinə Azərbaycan Respublikasının Prezidentinin təqdimatı ilə Milli Məclisin qərarı əsasında xitam verilə bilər.", "Konstitusiyanı və qanunları pozan birliklərin fəaliyyətinə yanız Azərbaycan Respublikasının Nazirlər Kabinetinin sərəncamı ilə xitam verilə bilər."]'::jsonb, 'Konstitusiyanı və qanunları pozan birliklərin fəaliyyətinə yalnız məhkəmə qaydasında xitam verilə bilər.', 'AR Konstitusiyası Maddə 58 (Birləşmək hüququ) — Hər kəsin siyasi partiya, həmkarlar ittifaqı və digər ictimai birliklər yaratmaq hüququ vardır. Bütün cəmiyyəti təmsil etmək iddiasında olan birliklərin fəaliyyəti qadağandır.', 10, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'be141897-63bf-4326-92d8-e082d680d070', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '32f13b26-6197-4429-8723-32223a083567', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şərəf və ləyaqətin müdafiəsi hüququna aid deyil', 'multiple_choice',
    '["Hər kəsin öz şərəf və ləyaqətini müdafiə etmək hüququ vardır.", "Şəxsiyyətin ləyaqəti dövlət tərəfindən qorunur.", "Heç bir hal şəxsiyyətin ləyaqətinin alçaldılmasına əsas verə bilməz.", "İnsan ləyaqətini alçaldan rəftara və ya cəzaya yalnız qanunla nəzərdə tutulmuş qaydada məruz qala bilməz;"]'::jsonb, 'İnsan ləyaqətini alçaldan rəftara və ya cəzaya yalnız qanunla nəzərdə tutulmuş qaydada məruz qala bilməz;', 'AR Konstitusiyası Maddə 46 (Şərəf və ləyaqətin müdafiəsi) — Düzgün cavab D variantıdır. Şəxsiyyətin ləyaqəti dövlət tərəfindən qorunur. Heç kəsə işgəncə və ya əzab verilə bilməz, insan ləyaqətini alçaldan rəftara və ya cəzaya məruz qala bilməz.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5519ca72-e89c-41d7-8ae7-88f1c45926af', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '39218c52-a92b-47c6-944e-e033c9710e70', 'Azərbaycan Respublikasının Konstitusiyasında “ Hüquqi yardım almaq hüququ ” necə ifadə olunur?', 'multiple_choice',
    '["Hər kəsin ixtisaslı hüquqi yardım almaq hüququ vardır", "Hər kəsin peşəkar hüquqi yardım almaq hüququ vardır", "Hər kəsin ədalətli hüquqi yardım almaq hüququ vardır", "Hər kəsin yüksək keyfiyyətli hüquqi yardım almaq hüququ vardır."]'::jsonb, 'Hər kəsin yüksək keyfiyyətli hüquqi yardım almaq hüququ vardır.', 'AR Konstitusiyası Maddə 60 (Hüquq və azadlıqların inzibati və məhkəmə təminatı) — Düzgün cavab D variantıdır. Hər kəsin hüquq və azadlıqlarının inzibati qaydada və məhkəmədə müdafiəsinə təminat verilir (2016).', 12, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6957d726-3927-4d5f-a931-642fc690542f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '3ce18795-7b28-473c-a02f-d92d3bcd1018', 'Azərbaycan Respublikasının Konstitusiyasına əsasən vicdan azadlığına aid deyil', 'multiple_choice',
    '["Hər kəsin vicdan azadlığı vardır.", "Dini etiqad və əqidə hüquq pozuntusuna bəraət qazandırmır.", "Heç kəs öz dini etiqadını və əqidəsini ifadə etməyə (nümayiş etdirməyə), dini mərasimləri yerinə yetirməyə və ya dini mərasimlərdə iştirak etməyə məcbur edilə bilməz.", "Dini etiqad və əqidə hüquq pozuntusuna yalnız qanunla nəzərdə tutulan hallarda bəraət qazandırmır."]'::jsonb, 'Dini etiqad və əqidə hüquq pozuntusuna yalnız qanunla nəzərdə tutulan hallarda bəraət qazandırmır.', 'AR Konstitusiyası Maddə 48 (Vicdan azadlığı) — Düzgün cavab D variantıdır. Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək hüququ vardır. Dini etiqad və əqidə hüquq pozuntusuna bəraət qazandırmır.', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a3c8fe9e-6412-4347-8554-e73d407f034f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '452ab311-de63-4b7f-88f6-a9569005350f', 'Azərbaycan Respublikası Konstitusiyasına uyğun olaraq insan və vətəndaş hüquqlarının və azadlıqlarının təminatı maddəsinə aiddir', 'multiple_choice',
    '["Dövlət orqanları yalnız bu Konstitusiya əsasında, qanunla müəyyən edilmiş qaydada və hüdudlarda fəaliyyət göstərə bilərlər.", "Dövlət orqanları yalnız bu Konstitusiya əsasında, beynəlxalq öhdəlikləri nəzərə alınmaqla, qanunla müəyyən edilmiş qaydada və hüdudlarda fəaliyyət göstərə bilərlər.", "Dövlət orqanları yalnız, qanunla müəyyən edilmiş qaydada və hüdudlarda fəaliyyət göstərə bilərlər.", "Dövlət orqanları yalnız bu Konstitusiya əsasında fəaliyyət göstərə bilərlər."]'::jsonb, 'Dövlət orqanları yalnız bu Konstitusiya əsasında, qanunla müəyyən edilmiş qaydada və hüdudlarda fəaliyyət göstərə bilərlər.', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab A variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 14, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b42ea374-fb24-4fb8-ac54-bc1091e68b6f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '46156c2d-0f27-4d60-aa3a-16572f2e66f2', 'Azərbaycan Respublikasının Konstitusiyasında nəzərdə tutulan Azərbaycan Respublikasının Konstitusiyasında “ Dövlətə qarşı qiyama və ya dövlət çevrilişinə müstəqil müqavimət göstərmək Azərbaycan Respublikasının hər bir vətəndaşının hüququdur ” müddəası hansı hüquqa aiddir?', 'multiple_choice',
    '["dövlətə qarşı qiyama və ya dövlət çevrilişinə müstəqil müqavimət göstərmək hüququ;", "dövlətin idarə olunmasında iştirak etmək hüququ;", "cəmiyyətin və dövlətin siyasi həyatında iştirak hüququ;", "Vətənə sədaqət hüququ."]'::jsonb, 'cəmiyyətin və dövlətin siyasi həyatında iştirak hüququ;', 'AR Konstitusiyası Maddə 55 (Dövlətin idarə olunmasında iştirak) — Düzgün cavab C variantıdır. AR vətəndaşlarının dövlətin idarə olunmasında iştirak etmək və dövlət orqanlarında qulluq etmək hüququ vardır.', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '67994bdf-5c80-40b1-a037-8e4370bc7241', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '46a63022-9e09-4175-8ba2-18ec0d160c8d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq əcnəbilər və vətəndaşlığı olmayan şəxslər dövlət qulluğuna qəbul edilə bilərlər?', 'multiple_choice',
    '["Əcnəbilər və vətəndaşlığı olmayan şəxslər dövlət qulluğuna heç bir halda qəbul edilə bilməzlər", "Əcnəbilər və vətəndaşlığı olmayan şəxslər dövlət qulluğuna qanunla müəyyənləşdirilmiş qaydada qəbul edilə bilərlər.", "Əcnəbilər və vətəndaşlığı olmayan şəxslər dövlət qulluğuna qanunla müəyyənləşdirilmiş qaydada qəbul edilə bilərməzlər", "Əcnəbilər və vətəndaşlığı olmayan şəxslər dövlət qulluğuna bütün hallarda qəbul edilə bilərlər."]'::jsonb, 'Əcnəbilər və vətəndaşlığı olmayan şəxslər dövlət qulluğuna qanunla müəyyənləşdirilmiş qaydada qəbul edilə bilərlər.', 'AR Konstitusiyası Maddə 69 (Əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquqları) — Düzgün cavab B variantıdır. Əcnəbilər və vətəndaşlığı olmayan şəxslər AR vətəndaşları ilə bərabər hüquqlardan istifadə edir və vəzifələri daşıyırlar (seçki hüququ və dövlət qulluğu kimi qanunla istisna hallar xaricində).', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '805c9c36-525c-4dee-8e5d-d6077e932eaf', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '4f1beb68-f15c-4b22-8ba5-6b43608016f0', '“Dövlət qulluğu haqqında” AR Qanununa əsasən intizam tənbehlərinin tətbiqi qaydası ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Dövlət, dövlət qulluqçuları ilə birlikdə, dövlət qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə maddi məsuliyyət daşıyır", "Dövlət, dövlət qulluqçuları ilə birlikdə, dövlət qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə inzibati məsuliyyət daşıyır", "Dövlət, dövlət qulluqçuları ilə birlikdə, dövlət qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə intizam məsuliyyəti daşıyır", "Dövlət, dövlət qulluqçuları ilə birlikdə, dövlət qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə mülki məsuliyyət daşıyır"]'::jsonb, 'Dövlət, dövlət qulluqçuları ilə birlikdə, dövlət qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə mülki məsuliyyət daşıyır', 'AR Konstitusiyası Maddə 55 və ''Dövlət qulluğu haqqında'' Qanun — Düzgün cavab D variantıdır. Dövlət qulluğuna qəbul edilən şəxs sədaqət andı içir (Maddə 17) və xidməti vəzifəsini pozduqda intizam tənbehinə məruz qalır (Maddə 25).', 17, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ad97b2a8-7505-4720-a2c2-c7d3da2bbc30', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '52867fc4-271d-47c3-891a-a7ff6a90ff3e', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxs hansı hallarda din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilər?', 'multiple_choice',
    '["Şəxs yalnız Konstitusiyada nəzərdə tutulan müstəsna hallarda din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilər və bunlara görə təqsirləndirilə bilər;", "Şəxs yalnız Konstitusiyada nəzərdə tutulan hallarda din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilər, lakin bunlara görə təqsirləndirilə bilməz;", "Şəxs yalnız məhkəmənin qərarı ilə din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilər, lakin bunlara görə təqsirləndirilə bilməz;", "Heç bir halda heç kəs din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilməz və bunlara görə təqsirləndirilə bilməz."]'::jsonb, 'Heç bir halda heç kəs din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilməz və bunlara görə təqsirləndirilə bilməz.', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab D variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '013026a7-6c8a-4ad6-b03e-859e2f86e3fe', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '53c2052c-1ce0-4408-8573-4be37ddd92cd', 'Azərbaycan Respublikasının Konstitusiyasına görə təqsirsizlik prezumpsiyası nədir?', 'multiple_choice',
    '["Cinayətin törədilməsində təqsirləndirilən hər bir şəxsin, onun təqsiri qanunla nəzərdə tutulan qaydada sübuta yetirilibsə və bu barədə məhkəmənin qanuni qüvvəyə minmiş hökmü varsa təqsirsiz sayılır", "Cinayətin törədilməsində təqsirləndirilən hər bir şəxsin təqsiri daxili işlər orqanları tərəfindən nəzərdə tutulan qaydada sübuta yetirilməyibsə və bu barədə Azərbaycan Respublikasının Ali Məhkəməsinin Plenumunun qanuni qüvvəyə minmiş qərarı yoxdursa təqsirsiz sayılır", "Cinayətin törədilməsində təqsirləndirilən hər bir şəxs, onun təqsiri qanunla nəzərdə tutulan qaydada sübuta yetirilməyibsə və bu barədə məhkəmənin qanuni qüvvəyə minmiş hökmü yoxdursa təqsirsiz sayılır", "Cinayətin törədilməsində təqsirləndirilən hər bir şəxsin təqsiri qanunla nəzərdə tutulan qaydada sübuta yetirilməyibsə və bu barədə Azərbaycan Respublikasının Məhkəmə-Hüquq Şurasının qanuni qüvvəyə minmiş qərarı yoxdursa təqsirsiz sayılır"]'::jsonb, 'Cinayətin törədilməsində təqsirləndirilən hər bir şəxs, onun təqsiri qanunla nəzərdə tutulan qaydada sübuta yetirilməyibsə və bu barədə məhkəmənin qanuni qüvvəyə minmiş hökmü yoxdursa təqsirsiz sayılır', 'AR Konstitusiyası Maddə 63 (Təqsirsizlik prezumpsiyası) — Düzgün cavab C variantıdır. Şəxsin təqsiri qanuni qüvvəyə minmiş məhkəmə hökmü ilə sübuta yetirilməyibsə, o təqsirsiz sayılır. Əsaslı şübhələr təqsirləndirilənin xeyrinə şərh olunur.', 19, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '75e654f4-1ca7-49a1-adf9-00ab229f9e4f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '53e3dc5f-1a57-45d0-b270-ed8e2a6c9048', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq cinayət törədilməsində təqsirləndirilən hər şəxs nə zaman dinlənilməlidir?', 'multiple_choice',
    '["Cinayət törədilməsində təqsirləndirilən hər bir şəxs tutulmazdan əvvəl dinlənilməlidir.", "Cinayət törədilməsində təqsirləndirilən hər bir şəxs həbsə alınmazdan əvvəl dinlənilməlidir.", "Cinayət törədilməsində təqsirləndirilən hər bir şəxs məhkum edilməzdən əvvəl dinlənilməlidir.", "A) Cinayət törədilməsində təqsirləndirilən hər bir şəxs tutulandan sonra dinlənilməlidir."]'::jsonb, 'Cinayət törədilməsində təqsirləndirilən hər bir şəxs məhkum edilməzdən əvvəl dinlənilməlidir.', 'AR Konstitusiyası Maddə 67 (Tutulan, həbsə alınanların hüquqları) — Düzgün cavab C variantıdır. Şəxsə tutulmanın səbəbləri dərhal izah edilir, müdafiəçi köməyi təmin olunur və susmaq hüququ verilir.', 20, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd25b1b6b-f586-4c7f-8a8c-f3d9cd11e866', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '5530d727-bddb-4f49-81a6-297336f9aa08', 'Azərbaycan Respublikasının Konstitusiyasına görə doğrudur', 'multiple_choice',
    '["Hərbi qulluqçular müraciət hüququndan fərdi və kollektiv qaydada istifadə edə bilərlər.", "Hərbi qulluqçular müraciət hüququndan yalnız fərdi qaydada istifadə edə bilərlər.", "Hərbi qulluqçular müraciət hüququndan yalnız kollektiv qaydada istifadə edə bilərlər.", "Hərbi qulluqçular müraciət hüququndan yalnız xidmət rəisinə təqdimat vermək qaydasında istifadə edə bilərlər."]'::jsonb, 'Hərbi qulluqçular müraciət hüququndan yalnız fərdi qaydada istifadə edə bilərlər.', 'AR Konstitusiyası Maddə 56 (Seçki hüququ) — Məhkəmə qərarı ilə fəaliyyət qabiliyyətsizliyi təsdiq olunmuş şəxslərin seçkilərdə iştirak etmək hüququ yoxdur. Hakimlərin, hərbçilərin, din xadimlərinin seçilmək hüququ qanunla məhdudlaşdırıla bilər.', 21, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '561f50f9-a6c7-484b-80b7-8c6b38f0204b', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '57c01411-fcb2-43ca-ae04-f863df01caa4', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hər kəsin onun işinə hansı məhkəmədə baxılması hüququ vardır?', 'multiple_choice',
    '["Hər kəsin onun işinə ədalətli məhkəmədə baxılması hüququ vardır;", "Hər kəsin onun işinə andlılar məhkəməsində baxılması hüququ vardır;", "Hər kəsin onun işinə qanunla müəyyən edilmiş məhkəmədə baxılması hüququ vardır;", "Hər kəsin onun işinə özünün müəyyən etdiyi məhkəmədə baxılması hüququ vardır."]'::jsonb, 'Hər kəsin onun işinə qanunla müəyyən edilmiş məhkəmədə baxılması hüququ vardır;', 'AR Konstitusiyası Maddə 62 (Məhkəmə aidiyyətinin dəyişdirilməsinə yol verilməməsi) — Düzgün cavab C variantıdır. Şəxsin razılığı olmadan onun işinə başqa məhkəmədə baxılmasına yol verilmir.', 22, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e288a8c6-7562-4782-9ba8-719c9266f79b', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '5b0de7e4-091d-4707-8b2d-8564ae78c6fb', 'Azərbaycan Respublikasının Konstitusiyasına görə Azərbaycan Respublikası əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacağı hansı aktlara uyğun olaraq verir?', 'multiple_choice',
    '["Hamılıqla qəbul edilmiş beynəlxalq hüquq normalarına uyğun olaraq Azərbaycan Respublikası əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.", "Azərbaycan Respublikasının qanunlarına uyğun olaraq Azərbaycan Respublikası əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.", "Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrə uyğun olaraq Azərbaycan Respublikası əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.", "Beynəlxalq müqavilələrə uyğun olaraq Azərbaycan Respublikası əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir."]'::jsonb, 'Hamılıqla qəbul edilmiş beynəlxalq hüquq normalarına uyğun olaraq Azərbaycan Respublikası əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.', 'AR Konstitusiyası Maddə 70 (Siyasi sığınacaq hüququ) — Düzgün cavab A variantıdır. AR ümumtanınmış beynəlxalq hüquq normalarına uyğun olaraq əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.', 23, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ebc0911b-d3a9-47c6-8713-5048a6b5953a', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '60177f1c-545a-400e-8458-009bbfbc0398', 'Azərbaycan Respublikasının Konstitusiyasında nəzərdə tutulan “ Ədalət mühakiməsi həyata keçirilərkən qanunu pozmaqla əldə edilmiş sübutlardan istifadə oluna bilməz ” müddəası hansı hüquqa aiddir?', 'multiple_choice',
    '["məhkəmə araşdırması hüququ;", "ədalətli məhkəmə hüququ;", "sübutların araşdırılmasını tələb etmək hüququ;", "təqsirsizlik prezumpsiyası."]'::jsonb, 'təqsirsizlik prezumpsiyası.', 'AR Konstitusiyası Maddə 63 (Təqsirsizlik prezumpsiyası) — Düzgün cavab D variantıdır. Şəxsin təqsiri qanuni qüvvəyə minmiş məhkəmə hökmü ilə sübuta yetirilməyibsə, o təqsirsiz sayılır. Əsaslı şübhələr təqsirləndirilənin xeyrinə şərh olunur.', 24, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '95d71917-3bc6-4dad-8560-1c89a8c430ac', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '63aab0da-be9d-4b53-a3a0-0d20e0fef859', 'Aşağıdakı müddəalardan hansı Azərbaycan Respublikasının Konstitusiyasında təsbit olunan “Şərəf və ləyaqətin müdafiəsi hüququ”-na aid deyil?', 'multiple_choice',
    '["Hər kəsin şəxsiyyətin şərəf və ləyaqəti toxunulmaz və ən yüksək nemətdir;", "Heç kəsə işgəncə və əzab verilə bilməz;", "Heç kəs insan ləyaqətini alçaldan rəftara və ya cəzaya məruz qala bilməz;", "Özünün könüllü razılığı olmadan heç kəsin üzərində tibbi, elmi və başqa təcrübələr aparıla bilməz."]'::jsonb, 'Hər kəsin şəxsiyyətin şərəf və ləyaqəti toxunulmaz və ən yüksək nemətdir;', 'AR Konstitusiyası Maddə 46 (Şərəf və ləyaqətin müdafiəsi) — Düzgün cavab A variantıdır. Şəxsiyyətin ləyaqəti dövlət tərəfindən qorunur. Heç kəsə işgəncə və ya əzab verilə bilməz, insan ləyaqətini alçaldan rəftara və ya cəzaya məruz qala bilməz.', 25, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0fa2ead1-cfae-4397-9d1a-5729638bb300', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '63d399a2-f3d5-498e-a8dc-8bc7c4a4e865', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq göstərilənlər hansı müddəaya aiddir:
1. Hər kəsin dövlət orqanlarının ona münasibətdə özbaşınalığı istisna edən vicdanlı davranışına hüququ vardır.
2. Zərər çəkmiş şəxsin ədalət mühakiməsinin həyata keçirilməsində iştirak etmək və ona vurulmuş zərərin ödənilməsini tələb etmək hüququ vardır
3. Hər kəsin dövlət orqanlarının yaxud onların vəzifəli şəxslərinin qanuna zidd hərəkətləri və ya hərəkətsizliyi nəticəsində vurulmuş zərərin dövlət tərəfindən ödənilməsi hüququ vardır.', 'multiple_choice',
    '["Şəxsi toxunulmazlıq", "Özbaşınalıqdan müdafiə və vicdanlı davranış hüququ", "İnsan və vətəndaş hüquq və azadlıqlarının təminatı", "Heç biri"]'::jsonb, 'Özbaşınalıqdan müdafiə və vicdanlı davranış hüququ', 'AR Konstitusiyası Maddə 67 (Tutulan, həbsə alınanların hüquqları) — Düzgün cavab B variantıdır. Şəxsə tutulmanın səbəbləri dərhal izah edilir, müdafiəçi köməyi təmin olunur və susmaq hüququ verilir.', 26, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8da92231-a67d-43ad-a32f-9a7734c4a838', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '6b7185af-f6c0-4392-b26c-de726d6211ab', 'Azərbaycan Respublikasının Konstitusiyasına əsasən kimlərin başqa dövlətə verilməsinə yol verilmir?', 'multiple_choice',
    '["Dini əqidəsinə görə, habelə Azərbaycan Respublikasında ağır cinayət sayılmayan əmələ görə təqib edilən şəxslərin başqa dövlətə verilməsinə yol verilmir;", "Siyasi əqidəsinə görə, habelə Azərbaycan Respublikasında cinayət sayılmayan əmələ görə təqib edilən şəxslərin başqa dövlətə verilməsinə yol verilmir;", "Siyasi xarakterli cinayətə görə təqib edilən şəxslərin başqa dövlətə verilməsinə yol verilmir;", "Hərbi xarakterli cinayətə görə təqib edilən şəxslərin başqa dövlətə verilməsinə yol verilmir."]'::jsonb, 'Siyasi əqidəsinə görə, habelə Azərbaycan Respublikasında cinayət sayılmayan əmələ görə təqib edilən şəxslərin başqa dövlətə verilməsinə yol verilmir;', 'AR Konstitusiyası Maddə 70 (Siyasi sığınacaq hüququ) — Düzgün cavab B variantıdır. AR ümumtanınmış beynəlxalq hüquq normalarına uyğun olaraq əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.', 27, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1b30d4cc-b6b5-4ee5-aad1-4fdc47664d66', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '78383a53-34eb-4cdd-a6fe-c7016a253011', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının vətəndaşı kimdir?', 'multiple_choice',
    '["Azərbaycan dövlətinə mənsub olan, onunla siyasi və hüquqi bağlılığı, habelə qarşılıqlı hüquq və vəzifələri olmayan şəxs Azərbaycan Respublikasının vətəndaşıdır", "Azərbaycan dövlətinə və ya digər dövlətə mənsub olan, onlarla siyasi və hüquqi bağlılığı, habelə qarşılıqlı hüquq və vəzifələri olan şəxs Azərbaycan Respublikasının vətəndaşıdır", "Azərbaycan dövlətinə mənsub olan, onunla siyasi və hüquqi bağlılığı, habelə qarşılıqlı hüquq və vəzifələri olan şəxs Azərbaycan Respublikasının vətəndaşıdır", "Xarici dövlətə mənsub olan, onunla siyasi və hüquqi bağlılığı, habelə qarşılıqlı hüquq və vəzifələri olan şəxs Azərbaycan Respublikasının vətəndaşıdır"]'::jsonb, 'Azərbaycan dövlətinə mənsub olan, onunla siyasi və hüquqi bağlılığı, habelə qarşılıqlı hüquq və vəzifələri olan şəxs Azərbaycan Respublikasının vətəndaşıdır', 'AR Konstitusiyası Maddə 50 (Məlumat azadlığı) — Düzgün cavab C variantıdır. Hər kəsin qanuni yolla məlumatı axtarmaq, əldə etmək, hazırlamaq və yaymaq azadlığı vardır. KİV senzurası qadağandır.', 28, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'eedd9562-9b67-447a-94e7-d33d7c92ff82', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '828bb647-c896-4468-b676-5b53fad233b0', 'Azərbaycan Respublikasının Konstitusiyasına aid deyil:', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyası 12 fəsil, 158 maddədən ibarətdir", "Azərbaycan Respublikasının Konstitusiyası 1995-ci ildə qəbul olunmuşdur", "Azərbaycan Respublikasının Konstitusiyasının əsas maddələri insan və vətəndaş hüquqları və azadlıqlarına həsr edilmişdi", "Azərbaycan Respublikasının Konstitusiyası hər bir vətəndaşa seçki hüququ vermişdi"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyası hər bir vətəndaşa seçki hüququ vermişdi', 'AR Konstitusiyası Maddə 69 (Əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquqları) — Düzgün cavab D variantıdır. Əcnəbilər və vətəndaşlığı olmayan şəxslər AR vətəndaşları ilə bərabər hüquqlardan istifadə edir və vəzifələri daşıyırlar (seçki hüququ və dövlət qulluğu kimi qanunla istisna hallar xaricində).', 29, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '052f2cfd-7018-491a-b2f9-2449eb3c2e87', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '82e92204-9f30-495d-83fa-904caeba9de8', 'Azərbaycan Respublikasının Konstitusiyasına əsasən vətəndaşların tənqid etmək hüququ ilə bağlı hansı fikir doğru deyil?', 'multiple_choice',
    '["Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarının və onların vəzifəli şəxslərinin, siyasi partiyaların, həmkarlar ittifaqlarının və digər ictimai birliklərin fəaliyyətini və ya işini tənqid etmək hüququ vardır.", "Tənqidə görə təqib qadağandır.", "Təhqir və böhtan tənqid sayıla bilməz.", "Azərbaycan Respublikası vətəndaşlarının ayrı-ayrı vətəndaşların fəaliyyətini və ya işini tənqid etmək hüququ yoxdur"]'::jsonb, 'Azərbaycan Respublikası vətəndaşlarının ayrı-ayrı vətəndaşların fəaliyyətini və ya işini tənqid etmək hüququ yoxdur', 'AR Konstitusiyası Maddə 57.II (Müraciət etmək hüququ) — Maddə 57.II-yə əsasən, vətəndaşların dövlət orqanları, onların vəzifəli şəxsləri, siyasi partiyalar, həmkarlar ittifaqları və digər ictimai birliklərlə yanaşı, habelə ayrı-ayrı vətəndaşların da fəaliyyətini və ya işini tənqid etmək hüququ vardır. Tənqidə görə təqib qadağandır, təhqir və böhtan isə tənqid sayıla bilməz.', 30, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a9792b6c-9eb3-4c40-a376-257f185e5626', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '84edf8c3-bf24-4cf7-9fc6-583861a7e042', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxs qanunla nəzər tutulmayan hərəkətləri etməyə məcbur edilə bilərmi?', 'multiple_choice',
    '["Şəxs yalnız dövlət təhlükəsizliyi mülahizələrinə görə qanunla nəzər tutulmayan hərəkətləri etməyə məcbur edilə bilər;", "Şəxs yalnız cinayət hadisəsinin qarşısının alınması ilə əlaqədar olaraq qanunla nəzər tutulmayan hərəkətləri etməyə məcbur edilə bilər;", "Şəxs yalnız fövqəladə və hərbi vəziyyət dövründə qanunla nəzər tutulmayan hərəkətləri etməyə məcbur edilə bilər;", "Heç kəs qanunla nəzər tutulmayan hərəkətləri etməyə məcbur edilə bilməz."]'::jsonb, 'Heç kəs qanunla nəzər tutulmayan hərəkətləri etməyə məcbur edilə bilməz.', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab D variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 31, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6cc0bc0b-307e-4713-b2ce-79c42a1a39db', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '8c9e30dc-9e1f-4826-b9f1-c57df453326d', 'Azərbaycan Respublikasının Konstitusiyasına əsasən vətəndaşlıq hüququnun təminatına görə doğru deyil', 'multiple_choice',
    '["Azərbaycan Respublikasının vətəndaşı Azərbaycan Respublikası vətəndaşlığından (onun qanunla müəyyən edilmiş itirilmə halları istisna olmaqla) məhrum edilə bilməz", "Azərbaycan Respublikasının vətəndaşı heç bir halda Azərbaycan Respublikasından qovula və ya xarici dövlətə verilə bilməz.", "Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının hüquqi müdafiəsinə təminat verir və onlara hamilik edir.", "Azərbaycan Respublikasının vətəndaşı heç bir halda Azərbaycan Respublikası vətəndaşlığından məhrum edilə bilməz"]'::jsonb, 'Azərbaycan Respublikasının vətəndaşı heç bir halda Azərbaycan Respublikası vətəndaşlığından məhrum edilə bilməz', 'AR Konstitusiyası Maddə 52 və 53 (Vətəndaşlıq hüququ və təminatı) — Düzgün cavab D variantıdır. AR vətəndaşı heç bir halda vətəndaşlıqdan məhrum edilə bilməz (qanunla itirilmə halları istisna olmaqla), AR-dən qovula və ya xarici dövlətə verilə bilməz.', 32, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a2c62336-d959-4793-a556-56be7cd57060', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', '98c39f64-a629-4035-a33e-53be91041881', 'Azərbaycan Respublikası ərazisndə daimi və ya müvəqqəti yaşayan əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquq və azadlıqları hansı aktlarla məhdudlaşdırıla bilər?', 'multiple_choice',
    '["Azərbaycan Respublikası ərazisində daimi yaşayan və ya müvəqqəti qalan əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquq və azadlıqları yalnız vətəndaşı olduğu ölkənin qanunlarına və ictimai qurumlarının tələbinə uyğun olaraq məhdudlaşdırıla bilər.", "Azərbaycan Respublikası ərazisində daimi yaşayan və ya müvəqqəti qalan əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquq və azadlıqları yalnız beynəlxalq hüquq normalarına və Azərbaycan Respublikasının qanunlarına uyğun olaraq məhdudlaşdırıla bilər.", "Azərbaycan Respublikası ərazisində daimi yaşayan və ya müvəqqəti qalan əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquq və azadlıqları yalnız beynəlxalq hüquq normalarına uyğun olaraq məhdudlaşdırıla bilər.", "Azərbaycan Respublikası ərazisində daimi yaşayan və ya müvəqqəti qalan əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquq və azadlıqları yalnız Prezidentin fərmanlarına uyğun olaraq məhdudlaşdırıla bilər."]'::jsonb, 'Azərbaycan Respublikası ərazisində daimi yaşayan və ya müvəqqəti qalan əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquq və azadlıqları yalnız beynəlxalq hüquq normalarına və Azərbaycan Respublikasının qanunlarına uyğun olaraq məhdudlaşdırıla bilər.', 'AR Konstitusiyası Maddə 70 (Siyasi sığınacaq hüququ) — Düzgün cavab B variantıdır. AR ümumtanınmış beynəlxalq hüquq normalarına uyğun olaraq əcnəbilərə və vətəndaşlığı olmayan şəxslərə siyasi sığınacaq verir.', 33, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ec117354-78d8-4c4a-a57e-89d8f6bac7eb', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'a678861a-a78c-467a-8c5e-8dd1b0a0310d', 'Azərbaycan Respublikasının Konstitusiyasına görə təqsirsizlik prezumpsiyası maddəsinə ad deyil', 'multiple_choice',
    '["Cinayətin törədilməsində təqsirləndirilən hər bir şəxs, onun təqsiri qanunla nəzərdə tutulan qaydada sübuta yetirilməyibsə və bu barədə məhkəmənin qanuni qüvvəyə minmiş hökmü yoxdursa, təqsirsiz sayılır.", "Cinayətin törədilməsində təqsirləndirilən şəxs özünün təqsirsizliyini sübuta yetirməyə borclu deyildir.", "Məhkəmənin hökmü olmasa, kimsə cinayətdə təqsirli sayıla bilməz.", "Heç kəs bir cinayətə görə təkrarən məhkum edilə bilməz."]'::jsonb, 'Heç kəs bir cinayətə görə təkrarən məhkum edilə bilməz.', 'AR Konstitusiyası Maddə 64 (Bir cinayətə görə təkrarən məhkum etməyə yol verilməməsi) — Düzgün cavab D variantıdır. Heç kəs bir cinayətə görə təkrarən məhkum edilə bilməz.', 34, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '810ecde6-c238-4f15-a28e-9ba79af33c78', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'ab83013c-4e32-4978-846f-d6ac0f836d5a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən, hər kəsin hüquq və azadlıqları nə ilə məhdudlaşır?', 'multiple_choice',
    '["Hər kəsin hüquq və azadlıqları Konstitusiyada və qanunlarda müəyyən edilmiş əsaslarla, habelə dövlətin maraqları ilə məhdudlaşır;", "Hər kəsin hüquq və azadlıqları Konstitusiyada və qanunlarda müəyyən edilmiş əsaslarla, habelə digərlərinin hüquq və azadlıqları ilə məhdudlaşır;", "Hər kəsin hüquq və azadlıqları ümumxalq maraqları, habelə digərlərinin hüquq və azadlıqları ilə məhdudlaşır;", "Hər kəsin hüquq və azadlıqları ictimai əxlaq və mənəviyyatla, habelə dövlət təhlükəsizliyi mülahizələrinə görə məhdudlaşır."]'::jsonb, 'Hər kəsin hüquq və azadlıqları Konstitusiyada və qanunlarda müəyyən edilmiş əsaslarla, habelə digərlərinin hüquq və azadlıqları ilə məhdudlaşır;', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab B variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 35, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cee2b626-7067-4d3d-8317-85d0d053377f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'b1ee8630-0a79-4f87-b70f-3b70429ad25b', 'Azərbaycan Respublikasının Konstitusiyasına görə hüquqi yardım hansı formada göstərilir?', 'multiple_choice',
    '["Qanunla nəzərdə tutulmuş hallarda hüquqi yardım ödənişli, dövlət hesabına göstərilir.", "Qanunla nəzərdə tutulmuş hallarda hüquqi yardım ödənişsiz, dövlət və şəxsi təminatlar hesabına göstərilir.", "Qanunla nəzərdə tutulmuş hallarda hüquqi yardım ödənişsiz, dövlət hesabına göstərilir.", "Bütün hallarda hüquqi yardım ödənişsiz, dövlət hesabına göstərilir."]'::jsonb, 'Qanunla nəzərdə tutulmuş hallarda hüquqi yardım ödənişsiz, dövlət hesabına göstərilir.', 'AR Konstitusiyası Maddə 61 (Hüquqi yardım almaq hüququ) — Düzgün cavab C variantıdır. Hər kəsin yüksək keyfiyyətli hüquqi yardım almaq hüququ vardır. Qanunla nəzərdə tutulmuş hallarda hüquqi yardım dövlət hesabına pulsuzdur.', 36, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1072a29b-3c2c-4069-925f-28994e7920c0', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'b2c56468-c2a7-4c86-88c0-6fcf286ebc7d', 'Azərbaycoan Respublikasının Konstitusiyasında Azərbaycan dövlətinin onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarına münasibətdə hansı vəzifələri nəzərdə tutur?', 'multiple_choice',
    '["Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının müdafiəsinə təminat verir və onların hüquqlarını qoruyur;", "Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının hüquqi müdafiəsinə təminat verir və onlara hamilik edir;", "Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının hüquq və azadlıqlarının müdafiəsinə təminat verir və onlara hamilik edir;", "Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının hüquqi müdafiəsinə və layiqli həyat səviyyəsinə təminat verir."]'::jsonb, 'Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının hüquqi müdafiəsinə təminat verir və onlara hamilik edir;', 'AR Konstitusiyası Maddə 52 və 53 (Vətəndaşlıq hüququ və təminatı) — Düzgün cavab B variantıdır. AR vətəndaşı heç bir halda vətəndaşlıqdan məhrum edilə bilməz (qanunla itirilmə halları istisna olmaqla), AR-dən qovula və ya xarici dövlətə verilə bilməz.', 37, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '97cd7fee-92f6-4d8e-96f5-dbff9d42b2d2', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'b5485765-29b5-47c9-860e-80fe3e205243', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı təbliğata yol verilmir?', 'multiple_choice',
    '["İrqi, milli, dini, siyasi və hər hansı digər meyara əsaslanan ədavət və düşmənçilik oyadan təşviqata və təbliğata yol verilmir", "İrqi, milli, dini, sosial və hər hansı digər meyara əsaslanan ədavət və düşmənçilik oyadan təşviqata və təbliğata yol verilmir", "İrqi, milli, dini, sosial və hər hansı siyasi meyara əsaslanan ədavət və düşmənçilik oyadan təşviqata və təbliğata yol verilmir", "İrqi, milli, dini, sosial və hər hansı digər meyara əsaslanan ədavət və düşmənçilik oyatmayan təşviqata və təbliğata yol verilmir"]'::jsonb, 'İrqi, milli, dini, sosial və hər hansı digər meyara əsaslanan ədavət və düşmənçilik oyadan təşviqata və təbliğata yol verilmir', 'AR Konstitusiyası Maddə 47 (Fikir və söz azadlığı) — Düzgün cavab B variantıdır. Heç kəs öz fikir və əqidəsini bildirməyə məcbur edilə bilməz. İrqi, milli, dini nifrət və düşmənçilik təbliği qadağandır.', 38, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f08c4250-a6c1-452c-b176-7052e2b1b550', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'b76e6aef-247c-43cf-a5d0-77339d4eb8dd', 'Azərbaycan Respublikasının Konstitusiyasına görə aşağıdakı cümlə hansı maddəyə aiddir?
“Şəxsin razılığı olmadan onun işinə başqa məhkəmədə baxılmasına yol verilmir”', 'multiple_choice',
    '["Təqsirsizlik prezumpsiyası", "Hüquqi yardım almaq hüququ", "Məhkəmə aidiyyətinin dəyişdirilməsinə yol verilməməsi", "Məhkəməyə təkrar müraciət hüququ"]'::jsonb, 'Məhkəmə aidiyyətinin dəyişdirilməsinə yol verilməməsi', 'AR Konstitusiyası Maddə 62 (Məhkəmə aidiyyətinin dəyişdirilməsinə yol verilməməsi) — Düzgün cavab C variantıdır. Şəxsin razılığı olmadan onun işinə başqa məhkəmədə baxılmasına yol verilmir.', 39, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '13935586-728b-4714-8225-7e0658305f29', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'b7a1f88f-d34e-4693-8fcc-b0c317223a17', 'Azərbaycan Respublikasının Konstitusiyasına görə doğrudur', 'multiple_choice',
    '["Məhkəmənin məhkum etdiyi hər bir şəxsin öz barəsində çıxarılmış hökmə qanunla nəzərdə tutulan qaydada yuxarı məhkəmədə yenidən baxılması, habelə özünün əfv edilməsi və cəzasının yüngülləşdirilməsi haqqında müraciət etmək hüququ vardır.", "Məhkəmənin məhkum etdiyi hər bir şəxsin öz barəsində çıxarılmış hökmə qanunla nəzərdə tutulan qaydada yuxarı məhkəmədə yenidən baxılması, cəzasının yüngülləşdirilməsi haqqında müraciət etmək hüququ vardır.", "Məhkəmənin məhkum etdiyi hər bir şəxsin öz barəsində çıxarılmış hökmə qanunla nəzərdə tutulan qaydada yuxarı məhkəmədə yenidən baxılması, habelə özünün əfv edilməsi haqqında müraciət etmək hüququ vardır.", "Məhkəmənin məhkum etdiyi hər bir şəxsin öz barəsində çıxarılmış hökmə qanunla nəzərdə tutulan qaydada yuxarı məhkəmədə yenidən baxılması, habelə özünün əfv və amnistiya edilməsi və cəzasının yüngülləşdirilməsi haqqında müraciət etmək hüququ vardır."]'::jsonb, 'Məhkəmənin məhkum etdiyi hər bir şəxsin öz barəsində çıxarılmış hökmə qanunla nəzərdə tutulan qaydada yuxarı məhkəmədə yenidən baxılması, habelə özünün əfv edilməsi və cəzasının yüngülləşdirilməsi haqqında müraciət etmək hüququ vardır.', 'AR Konstitusiyası Maddə 64 (Bir cinayətə görə təkrarən məhkum etməyə yol verilməməsi) — Heç kəs bir cinayətə görə təkrarən məhkum edilə bilməz.', 40, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '620d6cb8-eed2-402f-9c1b-54b638f5af63', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'b9c737af-9d8a-49c1-8947-0d8047452e5b', 'Səlahiyyətli dövlət orqanlarının tutduğu, həbsə aldığı, cinayət törədilməsində təqsirləndirdiyi hər bir şəxsə nə izah edilir?', 'multiple_choice',
    '["Səlahiyyətli dövlət orqanlarının tutduğu, həbsə aldığı, cinayət törədilməsində təqsirləndirdiyi hər bir şəxsə dərhal onun hüquqları bildirilir və kimə müraciət etməsi izah edilir", "Səlahiyyətli dövlət orqanlarının tutduğu, həbsə aldığı, cinayət törədilməsində təqsirləndirdiyi hər bir şəxsə yalnız vəkilin iştirakı ilə hüquqları bildirilir", "Səlahiyyətli dövlət orqanlarının tutduğu, həbsə aldığı, cinayət törədilməsində təqsirləndirdiyi hər bir şəxsə dərhal onun hüquqları bildirilir və tutulmasının, həbsə alınmasının və cinayət məsuliyyətinə cəlb edilməsinin səbəbləri izah edilir.", "Səlahiyyətli dövlət orqanlarının tutduğu, həbsə aldığı, cinayət törədilməsində təqsirləndirdiyi hər bir şəxsə yalnız məhkəmə dinləmələri zamanı onun hüquqları bildirilir və tutulmasının, həbsə alınmasının və cinayət məsuliyyətinə cəlb edilməsinin səbəbləri izah edilir"]'::jsonb, 'Səlahiyyətli dövlət orqanlarının tutduğu, həbsə aldığı, cinayət törədilməsində təqsirləndirdiyi hər bir şəxsə dərhal onun hüquqları bildirilir və tutulmasının, həbsə alınmasının və cinayət məsuliyyətinə cəlb edilməsinin səbəbləri izah edilir.', 'AR Konstitusiyası Maddə 67 (Tutulan, həbsə alınanların hüquqları) — Düzgün cavab C variantıdır. Şəxsə tutulmanın səbəbləri dərhal izah edilir, müdafiəçi köməyi təmin olunur və susmaq hüququ verilir.', 41, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7c5534f1-2930-4adf-9a4d-5891d44785d8', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'ba072a3e-159a-4c47-82e3-3c633c5a4e74', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq dövlətin idarə olunmasında iştirak etmək hüququ hansı vasitə ilə həyata keçirilə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikası vətəndaşları dövlətin idarə olunmasında iştirak etmək hüququnu bilavasitə və ya nümayəndələri vasitəsi ilə həyata keçirə bilərlər.", "Azərbaycan Respublikası vətəndaşları dövlətin idarə olunmasında iştirak etmək hüququnu yalnız bilavasitə həyata keçirə bilərlər.", "Azərbaycan Respublikası vətəndaşları dövlətin idarə olunmasında iştirak etmək hüququnu yalnız nümayəndələri vasitəsi ilə həyata keçirə bilərlər.Hər kəsin nümayəndələri vasitəsilə", "Hər kəs dövlətin idarə olunmasında iştirak etmək hüququnu bilavasitə və ya nümayəndələri vasitəsi ilə həyata keçirə bilərlər."]'::jsonb, 'Azərbaycan Respublikası vətəndaşları dövlətin idarə olunmasında iştirak etmək hüququnu bilavasitə və ya nümayəndələri vasitəsi ilə həyata keçirə bilərlər.', 'AR Konstitusiyası Maddə 55 (Dövlətin idarə olunmasında iştirak) — Düzgün cavab A variantıdır. AR vətəndaşlarının dövlətin idarə olunmasında iştirak etmək və dövlət orqanlarında qulluq etmək hüququ vardır.', 42, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8d245da4-8048-4e50-a930-4ef28db9049b', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'bdd15acd-34b5-4daf-ac17-47764437d89a', 'Azərbaycan Respublikasının Konstitusiyasına görə hüquq və azadlıqların inzibati və məhkəmə təminatına aid deyil', 'multiple_choice',
    '["Hər kəsin hüquq və azadlıqlarının intizam qaydasında və məhkəmədə müdafiəsinə təminat verilir.", "Hər kəsin hüququ var ki, onun işinə qərəzsiz yanaşılsın və həmin işə inzibati icraat və məhkəmə prosesində ağlabatan müddətdə baxılsın.", "Hər kəsin inzibati icraat və məhkəmə prosesində dinlənilmək hüququ vardır.", "Hər kəs dövlət orqanlarının, siyasi partiyaların, hüquqi şəxslərin, bələdiyyələrin və vəzifəli şəxslərin hərəkətlərindən və hərəkətsizliyindən inzibati qaydada və məhkəməyə şikayət edə bilər."]'::jsonb, 'Hər kəsin hüquq və azadlıqlarının intizam qaydasında və məhkəmədə müdafiəsinə təminat verilir.', 'AR Konstitusiyası Maddə 60 (Hüquq və azadlıqların inzibati və məhkəmə təminatı) — Düzgün cavab A variantıdır. Hər kəsin hüquq və azadlıqlarının inzibati qaydada və məhkəmədə müdafiəsinə təminat verilir (2016).', 43, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '784cd36f-93e1-4962-b318-bcfc6aeffb1c', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'befdd0cd-05df-403d-b350-df61fa81c9de', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq əleyhinə ifadə verilməsi məcburi olmayan qohumların tam siyahısı hansı normativ aktla müəyyən edilir?', 'multiple_choice',
    '["Qanunla", "Konstitusiya ilə", "Konstitusiya qanunu ilə", "Qərarla"]'::jsonb, 'Qanunla', 'AR Konstitusiyası Maddə 66 (Qohumların əleyhinə ifadə verməyə məcbur edilməmək) — Düzgün cavab A variantıdır. Heç kəs özünə, arvadına (ərinə), övladlarına, valideynlərinə, qardaşına, bacısına qarşı ifadə verməyə məcbur edilə bilməz.', 44, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '111fcda0-2a24-480f-8454-57501e9fddfc', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'c0c9f754-9c02-40d4-8675-282bda17dd63', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası vətəndaşlarının iştirak etmək hüququ vardır:
1. Dövlət orqanlarına seçmək
2. Tətil etmək
3. Yaşamaq
4. Dövlət orqanlarına seçilmək
5. Referendumda iştirak etmək', 'multiple_choice',
    '["1,2,3", "1,4,5", "1,3,5", "2,3,4"]'::jsonb, '1,4,5', 'AR Konstitusiyası Maddə 52 və 53 (Vətəndaşlıq hüququ və təminatı) — Düzgün cavab B variantıdır. AR vətəndaşı heç bir halda vətəndaşlıqdan məhrum edilə bilməz (qanunla itirilmə halları istisna olmaqla), AR-dən qovula və ya xarici dövlətə verilə bilməz.', 45, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '80a95773-96ad-4fc6-83a7-001358bdeda3', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'c3d43d58-8b63-477f-9571-e4807cb4cd47', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxs qanunla qadağan olunmayan hərəkətləri edə bilərmi?', 'multiple_choice',
    '["Hər kəs qanunla qadağan olunmayan hərəkətləri edə bilər;", "Heç kəs qanunla qadağan olunmayan hərəkətləri edə bilməz;", "Şəxs yalnız zəruri müdafiə vəziyyətində qanunla qadağan olunmayan hərəkətləri edə bilər;", "Şəxs yalnız son zərurət vəziyyətində qanunla qadağan olunmayan hərəkətləri edə bilər."]'::jsonb, 'Hər kəs qanunla qadağan olunmayan hərəkətləri edə bilər;', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab A variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 46, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '82542a7e-4dcb-45e3-8a75-7cdff4a50d6a', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'c42f3aad-8a0b-4dbb-830c-4c6f057cc7d0', 'Azərbaycan Respublikasının Konstitusiyasına görə şəxsin təqsirli olduğuna əsaslı şübhələr varsa,şəxs təsirli sayılırmı?', 'multiple_choice',
    '["Şəxsin təqsirli olduğuna əsaslı şübhələr varsa o, təqsirli hesab olunur", "Şəxsin təqsirli olduğuna əsaslı şübhələr varsa, onun təqsirli bilinməsinə yol verilmir.", "Şəxsin təqsirli olduğuna əsaslı şübhələr varsa o, ev dustağı hesab edilir", "Şəxsin təqsirli olduğuna əsaslı şübhələr varsa şəxs bütün hallarda təqsirli sayılır"]'::jsonb, 'Şəxsin təqsirli olduğuna əsaslı şübhələr varsa, onun təqsirli bilinməsinə yol verilmir.', 'AR Konstitusiyası Maddə 63 (Təqsirsizlik prezumpsiyası) — Düzgün cavab B variantıdır. Şəxsin təqsiri qanuni qüvvəyə minmiş məhkəmə hökmü ilə sübuta yetirilməyibsə, o təqsirsiz sayılır. Əsaslı şübhələr təqsirləndirilənin xeyrinə şərh olunur.', 47, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a38ad326-cb35-462a-aea0-e784ea77a30f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'c6ac456f-0e94-4c4f-8996-4c75767a050b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Hər bir şəxsin başqaları ilə birlikdə sərbəst toplaşmaq azadlığı vardır.", "Hər kəsin başqaları ilə birlikdə sərbəst toplaşmaq azadlığı vardır.", "Hər bir vətəndaşın başqaları ilə birlikdə sərbəst toplaşmaq azadlığı vardır.", "Yetkinlik yaşına catmış hər kəsin başqaları ilə birlikdə sərbəst toplaşmaq azadlığı vardır."]'::jsonb, 'Hər kəsin başqaları ilə birlikdə sərbəst toplaşmaq azadlığı vardır.', 'AR Konstitusiyası Maddə 48 (Vicdan azadlığı) — Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək hüququ vardır. Dini etiqad və əqidə hüquq pozuntusuna bəraət qazandırmır.', 48, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a0b9deaa-8db4-4c2d-a73a-ade888542ef6', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'c8e918b6-de5a-4d11-adcf-ee0d94496295', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası vətəndaşlarının maneəsiz öz ölkəsinə qayıtmaq hüququ necə ifadə olunur?', 'multiple_choice',
    '["Azərbaycan Respublikası vətəndaşlarının öz ölkəsinə qayıtmaq hüququ vardır;", "Azərbaycan Respublikası vətəndaşlarının hər zaman maneəsiz öz ölkəsinə qayıtmaq hüququ vardır;", "Konstitusiya və qanunlarla nəzərdə tutulmuş hallar istisna olmaqla, Azərbaycan Respublikası vətəndaşlarının hər zaman maneəsiz öz ölkəsinə qayıtmaq hüququ vardır;", "Azərbaycan Respublikası vətəndaşlarının maneəsiz öz ölkəsinə qayıtmaq hüququ vardır; bu hüquq yalnız müharibə dövründə məhdudlaşdırıla bilər."]'::jsonb, 'Azərbaycan Respublikası vətəndaşlarının hər zaman maneəsiz öz ölkəsinə qayıtmaq hüququ vardır;', 'AR Konstitusiyası Maddə 52 və 53 (Vətəndaşlıq hüququ və təminatı) — Düzgün cavab B variantıdır. AR vətəndaşı heç bir halda vətəndaşlıqdan məhrum edilə bilməz (qanunla itirilmə halları istisna olmaqla), AR-dən qovula və ya xarici dövlətə verilə bilməz.', 49, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6222cc12-9ff9-4408-97a5-a9f3c625b344', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'cd83e0a2-cc3e-4f1d-a74e-63c9cbb65fa9', 'Azərbaycan Respublikasının Konstitusiyasına görə insan və vətəndaş hüquqlarının və azadlıqlarının təminatı ilə bağlı fikirlərdən biri doğru deyil', 'multiple_choice',
    '["Heç bir halda heç kəs din, vicdan, fikir və əqidəsini açıqlamağa məcbur edilə bilməz və bunlara görə təqsirləndirilə bilməz.", "Hüquq pozuntusu törədildikdən sonra yeni qanunla bu cür hərəkətlərə görə məsuliyyət aradan qaldırılmışsa və ya yüngülləşdirilmişsə, yeni qanun tətbiq edilir.", "Həyata keçirilməsi məhdudlaşdırılan hüquq və azadlıqlar haqqında əhaliyə qabaqcadan məlumat verilir.", "Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını gözləmək və qorumaq hər bir vətəndaşın borcudur."]'::jsonb, 'Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını gözləmək və qorumaq hər bir vətəndaşın borcudur.', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab D variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 50, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9ed050a2-7aab-4285-960c-5ce162d2769a', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'cea9563a-6d36-4ed8-8232-aad32bd22cd7', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq dövlət orqanlarının vəzifəli şəxsləri olaraq kimlər təyin edilirlər?', 'multiple_choice',
    '["Dövlət orqanlarının vəzifəli şəxsləri Azərbaycan Respublikasının vətəndaşları sırasından təyin edilirlər.", "Dövlət orqanlarının vəzifəli şəxsləri olaraq hər kəs təyin edilə bilər.", "Dövlət orqanlarının vəzifəli şəxsləri olaraq hər bir şəxs təyin edilə bilər.", "Dövlət orqanlarının vəzifəli şəxsləri olaraq əcnəbilər və vətəndaşlığı olmayan şəxslər təyin edilə bilər."]'::jsonb, 'Dövlət orqanlarının vəzifəli şəxsləri Azərbaycan Respublikasının vətəndaşları sırasından təyin edilirlər.', 'AR Konstitusiyası Maddə 57 (Müraciət etmək hüququ) — Düzgün cavab A variantıdır. Hər bir vətəndaşın dövlət orqanlarına müraciət etmək və qanunla müəyyən edilmiş müddətdə yazılı cavab almaq hüququ vardır. Hərbi qulluqçular fərdi qaydada müraciət edirlər.', 51, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'dfeb75d5-119a-460b-b522-436dfc53754f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'd2b536cf-0fbf-476f-87ea-f63c4cf89cde', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq ......... ədəbi-bədii, elmi-texniki və başqa yaradıcılıq növlərinin azad həyata keçirilməsinə təminat verir:', 'multiple_choice',
    '["Dövlət", "Məhkəmələr", "Prokurorluq", "Şəxsin özü"]'::jsonb, 'Dövlət', 'AR Konstitusiyası Maddə 50 (Məlumat azadlığı) — Düzgün cavab A variantıdır. Hər kəsin qanuni yolla məlumatı axtarmaq, əldə etmək, hazırlamaq və yaymaq azadlığı vardır. KİV senzurası qadağandır.', 52, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1ade0b7d-23c2-40d5-9ca6-32f0be35ff83', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'd5269a82-6ef3-4c93-8a07-37d2d653427b', 'Azərbaycan Respublikasının Konstitusiyasına görə dövlət sahibkarlıq sahəsində həyata keçirdiyi tənzimləmələri seçin', 'multiple_choice',
    '["Dövlət sahibkarlıq sahəsində yalnız dövlət maraqlarının, insan həyatının və sağlamlığının müdafiəsi ilə bağlı tənzimləməni həyata keçirir", "Dövlət sahibkarlıq sahəsində yalnız şəxsi maraqların, insan həyatının və sağlamlığının müdafiəsi ilə bağlı tənzimləməni həyata keçirir", "Dövlət sahibkarlıq sahəsində yalnız dövlət maraqlarının, cəmiyyətin həyatının və sağlamlığının müdafiəsi ilə bağlı tənzimləməni həyata keçirir", "Dövlət sahibkarlıq sahəsində yalnız dövlət maraqlarının, insan həyatının və millətin sağlamlığının müdafiəsi ilə bağlı tənzimləməni həyata keçirir"]'::jsonb, 'Dövlət sahibkarlıq sahəsində yalnız dövlət maraqlarının, insan həyatının və sağlamlığının müdafiəsi ilə bağlı tənzimləməni həyata keçirir', 'AR Konstitusiyası Maddə 59 (Azad sahibkarlıq hüququ) — Düzgün cavab A variantıdır. Hər kəsin qanunla qadağan edilməyən sahibkarlıq və digər iqtisadi fəaliyyətlə məşğul olmaq hüququ vardır.', 53, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '434a964b-998f-4e9f-bd58-d621ab07ccb4', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'd90cc3f3-7b4d-46aa-bc88-b0d8c12669f5', 'Azərbaycan Respublikasının Konstitusiyasına görə hər bir kəsin dinə müstəqil münasibətini müəyyənləşdirir:', 'multiple_choice',
    '["Məlumat azadlığı", "Vicdan azadlığı", "Mənsubiyyət hüququ", "Fikir və söz azadlığı"]'::jsonb, 'Vicdan azadlığı', 'AR Konstitusiyası Maddə 56 (Seçki hüququ) — Düzgün cavab B variantıdır. Məhkəmə qərarı ilə fəaliyyət qabiliyyətsizliyi təsdiq olunmuş şəxslərin seçkilərdə iştirak etmək hüququ yoxdur. Hakimlərin, hərbçilərin, din xadimlərinin seçilmək hüququ qanunla məhdudlaşdırıla bilər.', 54, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '39dfefd5-4f5c-4b6f-80e9-b3404803cdcc', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'dce0a9b8-b1fa-4488-bfa3-afc616e03e0c', 'Azərbaycan Respublikasının Konstitusiyasına görə birləşmək hüququ nədir?', 'multiple_choice',
    '["Hər kəs istənilən birlik, o cümlədən siyasi partiya, həmkarlar ittifaqı və digər ictimai və hərbi birlik yaratmaq və ya mövcud birliyə daxil olmaq hüququna malikdir.", "Hər kəs istənilən birlik, o cümlədən şəxsi maraqlara xidmət edən siyasi partiya, həmkarlar ittifaqı və digər ictimai birlik yaratmaq və ya mövcud birliyə daxil olmaq hüququna malikdir.", "Hər kəs istənilən birlik, o cümlədən siyasi partiya, həmkarlar ittifaqı və digər ictimai birlik yaratmaq və ya mövcud birliyə daxil olmaq hüququna malikdir.", "Hər kəs istənilən birlik, o cümlədən siyasi partiya yaratmaq və ya mövcud birliyə daxil olmaq hüququna malikdir."]'::jsonb, 'Hər kəs istənilən birlik, o cümlədən siyasi partiya, həmkarlar ittifaqı və digər ictimai birlik yaratmaq və ya mövcud birliyə daxil olmaq hüququna malikdir.', 'AR Konstitusiyası Maddə 58 (Birləşmək hüququ) — Düzgün cavab C variantıdır. Hər kəsin siyasi partiya, həmkarlar ittifaqı və digər ictimai birliklər yaratmaq hüququ vardır. Bütün cəmiyyəti təmsil etmək iddiasında olan birliklərin fəaliyyəti qadağandır.', 55, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f9af3318-d261-4b9c-941d-ed2c2f1386cc', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'df40f278-f537-41af-b391-bb771b0b9ce0', 'Azərbaycan Respublikasının Konstitusiyasına görə müraciətə hansı formada cavab verilməlidir?', 'multiple_choice',
    '["Hər bir müraciətə qanunla müəyyən edilmiş qaydada və müddətlərdə şifahi cavab verilməlidir.", "Hər bir müraciətə qanunla müəyyən edilmiş qaydada və müddətlərdə yazılı və şifahi cavab verilməlidir.", "Hər bir müraciətə qanunla müəyyən edilmiş qaydada və müddətlərdə yazılı cavab verilməlidir.", "Hər bir müraciətə qanunla müəyyən edilməmiş qaydada və müddətlərdə yazılı cavab verilməlidir."]'::jsonb, 'Hər bir müraciətə qanunla müəyyən edilmiş qaydada və müddətlərdə yazılı cavab verilməlidir.', 'AR Konstitusiyası Maddə 57 (Müraciət etmək hüququ) — Düzgün cavab C variantıdır. Hər bir vətəndaşın dövlət orqanlarına müraciət etmək və qanunla müəyyən edilmiş müddətdə yazılı cavab almaq hüququ vardır. Hərbi qulluqçular fərdi qaydada müraciət edirlər.', 56, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '52a12769-122f-4859-a6ab-406206d35878', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'e34325be-1156-4bf8-9468-ed07066cd308', 'Azərbaycan Respublikasının Konstitusiyasına görə hansı birliklərin yaradılması qadağandır?', 'multiple_choice',
    '["Azərbaycan Respublikasının bütün ərazisində və ya hər hansı hissəsində qanuni dövlət hakimiyyətini zorla devirmək məqsədi, cinayət hesab edilən digər məqsədlər güdən və ya cinayətkar üsullardan istifadə edən, insanların hüquq və azadlıqlarının təmin olunmasına xidmət edən birliklər qadağandır.", "Azərbaycan Respublikasının bütün ərazisində və ya hər hansı hissəsində qanuni dövlət hakimiyyətini zorla devirmək məqsədi, cinayət hesab edilən digər məqsədlər güdən və ya cinayətkar üsullardan istifadə edən, vətəndaş cəmiyyətinin yaradılmasına xidmət edən birliklər qadağandır.", "Azərbaycan Respublikasının bütün ərazisində və ya hər hansı hissəsində qanuni dövlət hakimiyyətini zorla devirmək məqsədi, cinayət hesab edilən digər məqsədlər güdən və ya cinayətkar üsullardan istifadə edən birliklər qadağandır.", "Azərbaycan Respublikasının bütün ərazisində və ya hər hansı hissəsində qanuni dövlət hakimiyyətini zorla devirməmək məqsədi, cinayət hesab edilməyən digər məqsədlər güdən və ya cinayətkar üsullardan istifadə edən birliklər qadağandır."]'::jsonb, 'Azərbaycan Respublikasının bütün ərazisində və ya hər hansı hissəsində qanuni dövlət hakimiyyətini zorla devirmək məqsədi, cinayət hesab edilən digər məqsədlər güdən və ya cinayətkar üsullardan istifadə edən birliklər qadağandır.', 'AR Konstitusiyası Maddə 58 (Birləşmək hüququ) — Düzgün cavab C variantıdır. Hər kəsin siyasi partiya, həmkarlar ittifaqı və digər ictimai birliklər yaratmaq hüququ vardır. Bütün cəmiyyəti təmsil etmək iddiasında olan birliklərin fəaliyyəti qadağandır.', 57, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e93b4205-b500-4684-898e-458b0ce7598d', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'e5fa28d2-cf7d-4f22-bac0-4eda08e50d5c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən vicdan azadlığı maddəsinə görə hər kəsin hansı hüquqları vardır', 'multiple_choice',
    '["Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək, hər hansı dinə təkbaşına və ya başqaları ilə birlikdə etiqad etmək, yaxud heç bir dinə etiqad etməmək, dinə münasibəti ilə bağlı əqidəsini ifadə etmək və yaymaq hüququ vardır.", "Hər kəsin dinə münasibətini başqalarından asılı şəkildə müəyyənləşdirmək, hər hansı dinə təkbaşına və ya başqaları ilə birlikdə etiqad etmək, yaxud heç bir dinə etiqad etməmək, dinə münasibəti ilə bağlı əqidəsini ifadə etmək və yaymaq hüququ vardır.", "Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək, hər hansı dinə yalnız təkbaşına etiqad etmək, yaxud heç bir dinə etiqad etməmək, dinə münasibəti ilə bağlı əqidəsini ifadə etmək və yaymaq hüququ vardır.", "Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək, hər hansı dinə yalnız başqaları ilə birlikdə etiqad etmək, yaxud heç bir dinə etiqad etməmək, dinə münasibəti ilə bağlı əqidəsini ifadə etmək və yaymaq hüququ vardır."]'::jsonb, 'Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək, hər hansı dinə təkbaşına və ya başqaları ilə birlikdə etiqad etmək, yaxud heç bir dinə etiqad etməmək, dinə münasibəti ilə bağlı əqidəsini ifadə etmək və yaymaq hüququ vardır.', 'AR Konstitusiyası Maddə 47 (Fikir və söz azadlığı) — Düzgün cavab A variantıdır. Heç kəs öz fikir və əqidəsini bildirməyə məcbur edilə bilməz. İrqi, milli, dini nifrət və düşmənçilik təbliği qadağandır.', 58, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0250e658-084c-4ad7-b425-390fcd9eff80', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'e648cd61-d1b4-4634-b8e2-1fd9389af8bc', 'Azərbaycan Respublikasının Konstitusiyasına görə aşağıdakılardan hansı halda hər bir şəxsin müdafiəçinin köməyindən istifadə etmək hüququ vardır?', 'multiple_choice',
    '["Hər bir şəxsin səlahiyyətli dövlət orqanları tərəfindən azad olunduğu andan müdafiəçinin köməyindən istifadə etmək hüququ vardır.", "Hər bir şəxsin Azərbaycan Respublikasının Ədliyyə nazirinin yazılı rəyi əsasında müdafiəçinin köməyindən istifadə etmək hüququ vardır.", "Hər bir şəxsin səlahiyyətli dövlət orqanları tərəfindən tutulduğu, həbsə alındığı, cinayət törədilməsində ittiham olunduğu andan müdafiəçinin köməyindən istifadə etmək hüququ vardır.", "Hər bir şəxsin Azərbaycan Respublikasının Ali Məhkəməsinin Plenumunun qərarı əsasında müdafiəçinin köməyindən istifadə etmək hüququ vardır."]'::jsonb, 'Hər bir şəxsin səlahiyyətli dövlət orqanları tərəfindən tutulduğu, həbsə alındığı, cinayət törədilməsində ittiham olunduğu andan müdafiəçinin köməyindən istifadə etmək hüququ vardır.', 'AR Konstitusiyası Maddə 60 (Hüquq və azadlıqların inzibati və məhkəmə təminatı) — Düzgün cavab C variantıdır. Hər kəsin hüquq və azadlıqlarının inzibati qaydada və məhkəmədə müdafiəsinə təminat verilir (2016).', 59, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f7c3292b-2fa8-4b03-b497-d46ffbabf5b8', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'e8f9b6da-9412-40e6-9c51-05260af84afc', 'Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədədirmi?', 'multiple_choice',
    '["Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədədir;", "Azərbaycan Respublikası ərazisində yalnız şəxsi hüquqlar və azadlıqlar birbaşa qüvvədədir;", "fövqəladə və hərbi vəziyyət istisna olmaqla, qalan hallarda Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədədir;", "Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədə deyil."]'::jsonb, 'Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədədir;', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab A variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 60, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '22abef84-aedc-4e02-977b-c7c6b8a4ec9f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'eb72dbf5-caef-4251-8ff3-7a9f4e73aa41', '“Dövlət qulluğu haqqında” AR Qanununa əsasən dövlət qulluqçusunun and içmə qaydası ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarının və onların vəzifəli şəxslərinin, siyasi partiyaların, həmkarlar ittifaqlarının və digər ictimai birliklərin fəaliyyətini və ya işini tənqid etmək hüququ vardır.", "Tənqidə görə təqib qadağandır.", "Təhqir və böhtan tənqid sayıla bilməz.", "Azərbaycan Respublikası vətəndaşlarının ayrı-ayrı vətəndaşların fəaliyyətini və ya işini tənqid etmək hüququ yoxdur"]'::jsonb, 'Azərbaycan Respublikası vətəndaşlarının ayrı-ayrı vətəndaşların fəaliyyətini və ya işini tənqid etmək hüququ yoxdur', 'AR Konstitusiyası Maddə 55 və ''Dövlət qulluğu haqqında'' Qanun — Dövlət qulluğuna qəbul edilən şəxs sədaqət andı içir (Maddə 17) və xidməti vəzifəsini pozduqda intizam tənbehinə məruz qalır (Maddə 25).', 61, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e641efa3-ace9-49dc-94cf-5eb2b400457e', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'f0ad90ce-a9b7-469d-8f50-9a0679a8d4b8', 'Azərbaycan Respublikasının Konstitusiyasına əsasən şəxsin üzərinə vəzifələr hansı normativ-hüquqi aktlarla qoyula bilər?', 'multiple_choice',
    '["Hər kəsin üzərinə vəzifələr yalnız Konstitusiya ilə və ya qanunla qoyula bilər;", "Hər kəsin üzərinə vəzifələr yalnız qanunla və prezidentin fərmanı ilə qoyula bilər;", "Hər kəsin üzərinə vəzifələr yalnız prezidentin fərmanı və müvafiq icra hakimiyyəti orqanlarının qərarı ilə qoyula bilər;", "Hər kəsin üzərinə vəzifələr yalnız müvafiq icra hakimiyyəti orqanlarının və bələdiyyələrin qərarı ilə qoyula bilər."]'::jsonb, 'Hər kəsin üzərinə vəzifələr yalnız Konstitusiya ilə və ya qanunla qoyula bilər;', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab A variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 62, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8d016696-7389-44e3-8a25-8b0b315cb45f', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'f17251a8-1a63-414f-83a7-8f45441e528b', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq doğrudur
1. Məhkəmənin qərarı ilə fəaliyyət qabiliyyətsizliyi təsdiq olunmuş şəxslərin seçilmək hüququ qanunla məhdudlaşdırıla bilər
2. Hərbi qulluqçuların seçilmək qərarla hüququ məhdudlaşdırıla bilər
3. Hakimlərin seçilmək hüququ qanunla məhdudlaşdırıla bilər
4. Dövlət məmurlarının seçilmək hüququ qərarla məhdudlaşdırıla bilər
5. Din xadimlərinin seçilmək hüququ qanunla məhdudlaşdırıla bilər
6. Məhkəmənin qanuni qüvvəyə minmiş hökmü ilə azadlıqdan məhrum edilmiş şəxslərin seçilmək hüququ qanunla məhdudlaşdırıla bilər', 'multiple_choice',
    '["3,5,6", "2,3,4", "1,3,5", "1,2,4"]'::jsonb, '3,5,6', 'AR Konstitusiyası Maddə 55 (Dövlətin idarə olunmasında iştirak) — Düzgün cavab A variantıdır. AR vətəndaşlarının dövlətin idarə olunmasında iştirak etmək və dövlət orqanlarında qulluq etmək hüququ vardır.', 63, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '77f5a42e-90f5-423d-bd21-9646758b0758', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'fa5d52e6-005d-4787-ae0f-e1d550915f1f', 'Azərbaycan Respublikasının Konstitusiyasına görə hər hansı bir şəxs bir cinayətə görə neçə dəfə məhkum edilə bilər?', 'multiple_choice',
    '["2", "1", "3", "Törədilmiş cinayətin ağırlıq dərəcəsinə uyğun olaraq müəyyən edilir"]'::jsonb, '1', 'AR Konstitusiyası Maddə 64 (Bir cinayətə görə təkrarən məhkum etməyə yol verilməməsi) — Düzgün cavab B variantıdır. Heç kəs bir cinayətə görə təkrarən məhkum edilə bilməz.', 64, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bb608f21-9c65-4662-a168-340c73b1e4ee', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'fb6b4c25-0876-4577-ba8d-44e5d6244657', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məlumat azadlığı nədir?', 'multiple_choice',
    '["Hər kəsin müvafiq dövlət orqanının icazəsi ilə istədiyi məlumatı axtarmaq, əldə etmək, ötürmək, hazırlamaq və yaymaq azadlığı vardır", "Hər kəsin İnformasiya müvəkkilinin razılığı ilə istədiyi məlumatı axtarmaq, əldə etmək, ötürmək, hazırlamaq və yaymaq azadlığı vardır", "Hər kəsin qanuni yolla istədiyi məlumatı axtarmaq, əldə etmək, ötürmək, hazırlamaq və yaymaq azadlığı vardır", "Hər kəsin istənilən yolla lazımi məlumatı axtarmaq, əldə etmək, ötürmək, hazırlamaq və yaymaq azadlığı vardır"]'::jsonb, 'Hər kəsin qanuni yolla istədiyi məlumatı axtarmaq, əldə etmək, ötürmək, hazırlamaq və yaymaq azadlığı vardır', 'AR Konstitusiyası Maddə 49 (Sərbəst toplaşmaq azadlığı) — Düzgün cavab C variantıdır. Hər kəsin dinc, silahsız yığışmaq, yığıncaqlar, mitinqlər, nümayişlər və piketlər keçirmək azadlığı vardır.', 65, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cfe80b0e-545b-4449-88c3-1f5d8e7a5b14', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'fd59da3b-aa43-4b74-986f-02d7c2b83496', 'Azərbaycan Respublikasının Konstitusiyasına əsasən dini mərasimlərin yerinə yetirilməsi nə zaman sərbəstdir?', 'multiple_choice',
    '["siyasi qaydanı pozmursa və ya ictimai əxlaqa zidd deyildirsə, sərbəstdir.", "ictimai qaydanı pozmursa və ya ictimai əxlaqa ziddirsə, sərbəstdir.", "ictimai qaydanı pozmursa və ya ictimai əxlaqa zidd deyildirsə, sərbəstdir.", "ictimai qaydanı pozmursa və ya mədəni əxlaqa zidd deyildirsə, sərbəstdir."]'::jsonb, 'ictimai qaydanı pozmursa və ya ictimai əxlaqa zidd deyildirsə, sərbəstdir.', 'AR Konstitusiyası Maddə 48 (Vicdan azadlığı) — Düzgün cavab C variantıdır. Hər kəsin dinə münasibətini müstəqil müəyyənləşdirmək hüququ vardır. Dini etiqad və əqidə hüquq pozuntusuna bəraət qazandırmır.', 66, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2b8994ac-d145-44ef-89c0-eb33b5d0516a', 'd28436aa-819f-4f59-9c8c-2afee5bd0593', 'ffd4032b-56cd-47b5-ba0d-37bd8d3acc30', 'Azərbaycan Respublikasının Konstitusiyasına əsasən insan və vətəndaş hüquqları və azadlıqlarının pozulması ilə əlaqədar mübahisələri hansı orqan həll edir?', 'multiple_choice',
    '["İnsan və vətəndaş hüquqları və azadlıqlarının pozulması ilə əlaqədar mübahisələri ombudsman həll edir;", "İnsan və vətəndaş hüquqları və azadlıqlarının pozulması ilə əlaqədar mübahisələri İnsan Hüquqları Komissiyası həll edir;", "İnsan və vətəndaş hüquqları və azadlıqlarının pozulması ilə əlaqədar mübahisələri məhkəmələr həll edir;", "İnsan və vətəndaş hüquqları və azadlıqlarının pozulması ilə əlaqədar mübahisələri sadalanan orqanların hamısı öz səlahiyyətləri daxilində həll edir."]'::jsonb, 'İnsan və vətəndaş hüquqları və azadlıqlarının pozulması ilə əlaqədar mübahisələri məhkəmələr həll edir;', 'AR Konstitusiyası Maddə 71 (İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı) — Düzgün cavab C variantıdır. Hüquq və azadlıqların məhdudlaşdırılması yalnız müharibə, hərbi və fövqəladə vəziyyət zamanı beynəlxalq öhdəliklər çərçivəsində və gözlənilən nəticəyə mütənasib olmalıdır (Maddə 71.V - 2016).', 67, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 3. Vətəndaşların Əsas Vəzifələri (Fəsil 4: Maddə 72-80)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 3. Vətəndaşların Əsas Vəzifələri (Fəsil 4: Maddə 72-80)', 'Vergilər, Vətənə sədaqət, Dövlət rəmzlərinə hörmət, Vətəni müdafiə, Tarix və mədəniyyət abidələrinin qorunması, Ətraf mühitin qorunması.',
    'Hüquq', 'easy', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cd111e2e-6122-45ef-b575-cf53f953874b', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '05f474d7-a32a-40d6-b8d7-e42f89341cd4', 'Azərbaycan Respublikası Konstitusiyasına görə insan və vətəndaşların əsas hüquqlarından biri:', 'multiple_choice',
    '["dövlət rəmzlərinə hörmət", "ətraf mühitin qorunması", "sosial təminat", "tarixi abidələrin qorunması"]'::jsonb, 'sosial təminat', 'AR Konstitusiyası Maddə 80 (Məsuliyyət) — Konstitusiyanı və qanunları pozma, hüquqlardan sui-istifadə etmə qanunla müəyyən edilmiş məsuliyyətə səbəb olur.', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6102ad9a-dd6e-4e5f-bf6e-faeca1850cb9', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '115a870c-32c7-414a-9418-52099c1babaf', 'Vəzifəyə seçilmə və ya təyinat yolu ilə qanunvericilik, icra və ya məhkəmə hakimiyyəti orqanlarında işləyən, Azərbaycan Respublikasının Konstitusiyasına sadiq qalacağına and içmiş şəxs hansı halda vəzifədən getmiş sayılır və bir daha həmin vəzifəni tuta bilməz?', 'multiple_choice',
    '["İnsanlığa qarşı cinayətlərdə ittiham edilibsə və bu ittiham əsasında məhkum olunubsa", "Terrorçuluqda ittiham edilibsə və bu ittiham əsasında məhkum olunubsa", "Dövlətə qarşı cinayətdə, o cümlədən dövlətə qarşı qiyamda və ya dövlət çevrilişində ittiham edilibsə və bu ittiham əsasında məhkum olunubsa", "İstənilən ağır cinayətdə məhkum olunubsa"]'::jsonb, 'Dövlətə qarşı cinayətdə, o cümlədən dövlətə qarşı qiyamda və ya dövlət çevrilişində ittiham edilibsə və bu ittiham əsasında məhkum olunubsa', 'AR Konstitusiyası Maddə 74 (Vətənə sədaqət) — Düzgün cavab C variantıdır. Vətənə sədaqət müqəddəsdir. Dövlət vəzifəsi tutan şəxslər vəzifələrini layiqincə yerinə yetirməyə görə məsuliyyət daşıyırlar.', 1, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd11e1350-9670-4e3b-8fce-58011c9c4d0d', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '14ca83b9-d4ee-47fb-a4a7-33b577fa50e5', 'Azərbaycan Respublikası Konstitusiyasına görə qanuna zidd vəzifələrin icrasına yol verilməməsi maddəsinə görə doğrudur', 'multiple_choice',
    '["Heç kəs Azərbaycan Respublikasının Konstitusiyasına və ya qanunlarına zidd vəzifələrin icrasına məcbur edilə bilməz.", "Heç bir şəxs Azərbaycan Respublikasının Konstitusiyasına və ya qanunlarına zidd vəzifələrin icrasına məcbur edilə bilməz.", "Hər kəs Azərbaycan Respublikasının Konstitusiyasına və ya qanunlarına zidd vəzifələrin icrasına məcbur edilə bilər", "Yalnız fiziki və hüquqi şəxslərAzərbaycan Respublikasının Konstitusiyasına və ya qanunlarına zidd vəzifələrin icrasına məcbur edilə bilməz."]'::jsonb, 'Heç kəs Azərbaycan Respublikasının Konstitusiyasına və ya qanunlarına zidd vəzifələrin icrasına məcbur edilə bilməz.', 'AR Konstitusiyası Maddə 77 (Tarix və mədəniyyət abidələrinin qorunması) — Düzgün cavab A variantıdır. Tarix və mədəniyyət abidələrini qorumaq hər bir şəxsin borcudur.', 2, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7b6b845e-082b-4cd7-8b10-b952033d126f', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '1a11983d-06a0-4c58-89c0-a9143261bff7', 'Azərbaycan Respublikası Konstitusiyasına görə Azərbaycan dövlətinin siyasi quruluşu:', 'multiple_choice',
    '["aristokratik respublikadır.", "demokratik, hüquqi, dünyəvi, unitar respublikadır.", "demokoratik, dünyəvi, federativ respublikadır.", "demokoratik, hüquqi, dünyəvi, konfederativ respublikadır."]'::jsonb, 'demokratik, hüquqi, dünyəvi, unitar respublikadır.', 'AR Konstitusiyası Maddə 80 (Məsuliyyət) — Düzgün cavab B variantıdır. Konstitusiyanı və qanunları pozma, hüquqlardan sui-istifadə etmə qanunla müəyyən edilmiş məsuliyyətə səbəb olur.', 3, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1f7da2b0-3a31-4c8a-936f-bc86be4b5a07', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '1c54c4a7-07b6-4876-8283-823e01f72a7f', 'Aşağıdakı cümlə Azərbaycan Respublikası Konstitusiyasına görə hansı maddədə təsbit edilmişdir?
“Konstitusiyanın və qanunların pozulması, o cümlədən Konstitusiyada və qanunlarda nəzərdə tutulan hüquqlardan sui-istifadə və ya vəzifələrin yerinə yetirilməməsi qanunla müəyyən edilən məsuliyyətə səbəb olur.”', 'multiple_choice',
    '["Qanuna zidd vəzifələrin icrasına yol verilməməsi", "Məsuliyyət", "Vətəndaşların vəzifələrinin əsası", "İnsan və vətəndaş hüquqlarının və azadlıqlarının təminatı"]'::jsonb, 'Məsuliyyət', 'AR Konstitusiyası Maddə 77 (Tarix və mədəniyyət abidələrinin qorunması) — Düzgün cavab B variantıdır. Tarix və mədəniyyət abidələrini qorumaq hər bir şəxsin borcudur.', 4, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '554d424f-c0dd-4fae-b559-22e0a0db8319', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '1d5f41c9-9adf-4a1d-8644-d1afc6aedd1d', 'Azərbaycan Respublikası Konstitusiyasına görə vətəni müdafiə kimin borcudur?', 'multiple_choice',
    '["Vətəni müdafiə hər bir vətəndaşın borcudur.", "Vətəni müdafiə hər bir şəxsin borcudur.", "Vətəni müdafiə hər kəsin borcudur.", "Vətəni müdafiə əsgərlik yaşına çatan hər bir şəxsin vətəndaşın borcudur."]'::jsonb, 'Vətəni müdafiə hər bir vətəndaşın borcudur.', 'AR Konstitusiyası Maddə 76 (Vətəni müdafiə) — Düzgün cavab A variantıdır. Vətəni müdafiə hər bir vətəndaşın borcudur. Qanunla müəyyən edilmiş qaydada hərbi xidmət (və ya alternativ xidmət) keçirlər.', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9369729d-51e1-48cf-902f-933ead744f8b', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '33591fa2-eda6-4125-a065-b8f2ce0552fd', 'Azərbaycan Respublikası Konstitusiyasına görə vətəndaşların əsas vəzifələrdən biri:', 'multiple_choice',
    '["dövlətin idarə olunmasında iştirak etmək", "ana dilindən istifadə etmək", "sağlamlığın qorunması", "ətraf mühitin qorunması"]'::jsonb, 'ətraf mühitin qorunması', 'AR Konstitusiyası Maddə 79 (Qanuna zidd vəzifələrin icrasına yol verilməməsi) — Düzgün cavab D variantıdır. Heç kəs Konstitusiyaya və qanunlara zidd vəzifələrin icrasına məcbur edilə bilməz.', 6, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b1196d25-b130-484b-b67c-d3b0ab41f2cf', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '3ec2fa52-0d90-4309-8951-1aa644a8bf73', 'Azərbaycan Respublikasının Konstitusiyasına görə birləşmək hüququn aid deyil', 'multiple_choice',
    '["Hər kəsin başqaları ilə birləşmək hüququ vardır.", "Bütün birliklərin sərbəst fəaliyyətinə təminat verilir.", "Heç kəs hər hansı birliyə daxil olmağa və onun üzvlüyündə qalmağa məcbur edilə bilməz.", "Hüquq və vəzifələrlə bağlı qərarlar qəbul edən dövlət orqanları və dövlət hakimiyyəti səlahiyyətlərinin daşıyıcıları ilə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir."]'::jsonb, 'Hüquq və vəzifələrlə bağlı qərarlar qəbul edən dövlət orqanları və dövlət hakimiyyəti səlahiyyətlərinin daşıyıcıları ilə münasibətlərdə hər kəsin bərabər hüquqları təmin edilir.', 'AR Konstitusiyası Maddə 76 (Vətəni müdafiə) — Düzgün cavab D variantıdır. Vətəni müdafiə hər bir vətəndaşın borcudur. Qanunla müəyyən edilmiş qaydada hərbi xidmət (və ya alternativ xidmət) keçirlər.', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fd2b99d9-f6ab-4b7d-9c84-4ea5237f3b4c', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '60d4decf-cd02-44d0-ab27-afb3fa75bb2b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı hallarda həqiqi hərbi xidmətin alternativ xidmətlə əvəz olunmasına yol verilir?', 'multiple_choice',
    '["vətəndaşın əqidəsi həqiqi hərbi xidmət keçməyə ziddirsə, qanunla müəyyən edilmiş hallarda həqiqi hərbi xidmətin alternativ xidmətlə əvəz olunmasına yol verilir;", "vətəndaşın sağlamlığı həqiqi hərbi xidmət keçməyə imkan vermirsə, qanunla müəyyən edilmiş hallarda həqiqi hərbi xidmətin alternativ xidmətlə əvəz olunmasına yol verilir;", "vətəndaşın siyasi mənsubiyyəti həqiqi hərbi xidmət keçməyə ziddirsə, qanunla müəyyən edilmiş hallarda həqiqi hərbi xidmətin alternativ xidmətlə əvəz olunmasına yol verilir;", "Azərbaycan Respublikasının Konstitusiyasına əsasən həqiqi hərbi xidmətin alternativ xidmətlə əvəz olunmasına yol verilmir."]'::jsonb, 'vətəndaşın əqidəsi həqiqi hərbi xidmət keçməyə ziddirsə, qanunla müəyyən edilmiş hallarda həqiqi hərbi xidmətin alternativ xidmətlə əvəz olunmasına yol verilir;', 'AR Konstitusiyası Maddə 76 (Vətəni müdafiə) — Düzgün cavab A variantıdır. Vətəni müdafiə hər bir vətəndaşın borcudur. Qanunla müəyyən edilmiş qaydada hərbi xidmət (və ya alternativ xidmət) keçirlər.', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7ac168fd-f0e6-4171-a9cc-49b337d00220', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '78cdca65-d021-4ee2-9110-18d5b001e628', 'Azərbaycan Respublikası Konstitusiyasına əsasən dövlət və cəmiyyət qarşısında hər bir şəxs hansı vəzifələri daşıyır?', 'multiple_choice',
    '["Dövlət və cəmiyyət qarşısında hər bir şəxs beynəlxalq hüquq normaları əsasında müəyyən edilən vəzifələr daşıyır", "Dövlət və cəmiyyət qarşısında hər bir şəxs onun hüquq və azadlıqlarından bilavasitə irəli gələn vəzifələr daşıyır.", "Dövlət və cəmiyyət qarşısında hər bir şəxs “Dövlət Qulluğu haqqında” Azərbaycan Respublikası Qanunundan irəli gələn vəzifələr daşıyır", "Dövlət və cəmiyyət qarşısında hər bir şəxs hüquq və vəzifələrindən dolayısı ilə irəli gələn vəzifələr daşıyır."]'::jsonb, 'Dövlət və cəmiyyət qarşısında hər bir şəxs onun hüquq və azadlıqlarından bilavasitə irəli gələn vəzifələr daşıyır.', 'AR Konstitusiyası Maddə 72 (Dövlət və cəmiyyət qarşısında vəzifələrin əsası) — Düzgün cavab B variantıdır. Hər bir şəxs AR Konstitusiyasına və qanunlarına əməl etməli, başqalarının hüquqlarına hörmət etməlidir. Qanunu bilməmək məsuliyyətdən azad etmir.', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2c6eff72-2387-4757-8f97-de0061affd7a', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '8293d639-b727-4864-b626-10b9bb12c01c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən vətəndaşların hansı vəzifəsi müqəddəsdir?', 'multiple_choice',
    '["Vətəni müdafiə müqəddəsdir;", "Vətənə sədaqət müqəddəsdir;", "dövlət rəmzlərinə hörmət müqəddəsdir;", "Azərbaycan Respublikasının Konstitusiyasına əsasən sadalanan vəzifələrin hamısı müqəddəsdir."]'::jsonb, 'Vətənə sədaqət müqəddəsdir;', 'AR Konstitusiyası Maddə 73 (Vergilər və başqa dövlət ödənişləri) — Düzgün cavab B variantıdır. Qanunla müəyyən edilmiş vergiləri ödəmək borcdur. Qanunla nəzərdə tutulmayan vergiləri ödəməyə heç kəs məcbur edilə bilməz.', 10, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fbd85cf2-2028-4ca8-b6e8-3c1e204b514c', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '867988f5-e43f-4e6d-adac-955cd802df6b', 'Azərbaycan Respublikası Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Hər bir şəxs Azərbaycan Respublikasının Konstitusiyasına və qanunlarına əməl etməli, başqa şəxslərin hüquq və azadlıqlarına hörmət bəsləməli, qanunla müəyyən edilmiş digər vəzifələri yerinə yetirməlidir.", "Hər bir şəxs Azərbaycan Respublikasının Konstitusiyasına və qanunlarına əməl etməli, başqa şəxslərin hüquq və azadlıqlarına hörmət bəsləməli, qərardadla müəyyən edilmiş digər vəzifələri yerinə yetirməlidir.", "Hər bir şəxs Azərbaycan Respublikasının Konstitusiyasına və qanunlarına və beynəlxalq müqavilələrə əməl etməli, başqa şəxslərin hüquq və azadlıqlarına hörmət bəsləməli, qanunla müəyyən edilmiş digər vəzifələri yerinə yetirməlidir.", "Hər bir şəxs Azərbaycan Respublikasının Konstitusiyasına və qanunlarına əməl etməli, başqa şəxslərin hüquq və azadlıqlarına qayğı bəsləməli, qanunla müəyyən edilmiş digər vəzifələri yerinə yetirməlidir."]'::jsonb, 'Hər bir şəxs Azərbaycan Respublikasının Konstitusiyasına və qanunlarına əməl etməli, başqa şəxslərin hüquq və azadlıqlarına hörmət bəsləməli, qanunla müəyyən edilmiş digər vəzifələri yerinə yetirməlidir.', 'AR Konstitusiyası Maddə 72 (Dövlət və cəmiyyət qarşısında vəzifələrin əsası) — Düzgün cavab A variantıdır. Hər bir şəxs AR Konstitusiyasına və qanunlarına əməl etməli, başqalarının hüquqlarına hörmət etməlidir. Qanunu bilməmək məsuliyyətdən azad etmir.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '49ecb237-93ef-45b3-9f08-8f11cb0b77e3', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '89916d52-0437-4ec3-96d4-36f0dfa14518', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Qanunla müəyyən edilmiş vergiləri və başqa dövlət ödənişlərini tam həcmdə və vaxtında ödəmək borcudur:', 'multiple_choice',
    '["Hər bir vətəndaşın", "Hər bir kəsin", "Hər bir şəxsin", "Hüquqi şəxslərin"]'::jsonb, 'Hər bir kəsin', 'AR Konstitusiyası Maddə 72 (Dövlət və cəmiyyət qarşısında vəzifələrin əsası) — Düzgün cavab B variantıdır. Hər bir şəxs AR Konstitusiyasına və qanunlarına əməl etməli, başqalarının hüquqlarına hörmət etməlidir. Qanunu bilməmək məsuliyyətdən azad etmir.', 12, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bc331aa1-ec85-47bc-9e64-79496595d4ff', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', '8bc0f517-5f73-4639-860b-9632d78677a3', 'Azərbaycan Respublikası Konstitusiyasına görə doğrudur', 'multiple_choice',
    '["Dövlət rəmzlərinə hörmətsizliyin nümayiş etdirilməsi qərarla müəyyən edilmiş məsuliyyətə səbəb olur", "Dövlət rəmzlərinə hörmətsizliyin nümayiş etdirilməsi Konstitusiya qanunu ilə müəyyən edilmiş məsuliyyətə səbəb olur", "Dövlət rəmzlərinə hörmətsizliyin nümayiş etdirilməsi sərəncamla müəyyən edilmiş məsuliyyətə səbəb olur", "Dövlət rəmzlərinə hörmətsizliyin nümayiş etdirilməsi qanunla müəyyən edilmiş məsuliyyətə səbəb olur"]'::jsonb, 'Dövlət rəmzlərinə hörmətsizliyin nümayiş etdirilməsi qanunla müəyyən edilmiş məsuliyyətə səbəb olur', 'AR Konstitusiyası Maddə 75 (Dövlət rəmzlərinə hörmət) — Düzgün cavab D variantıdır. Dövlət bayrağına, gerbinə və himninə hörmət etmək hər bir vətəndaşın borcudur.', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c3db514b-51f4-4ac5-931a-dc4078fb918d', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', 'd3ac217f-4fb1-4f31-a873-de64a63b4b8d', 'Azərbaycan Respublikası Konstitusiyasına görə vətəndaşların əsas azadlıqlarından biri:', 'multiple_choice',
    '["sağlam ətraf mühitdə yaşamaq", "təhlükəsiz yaşamaq", "sərbəst toplaşmaq", "ana dilindən istifadə etmək"]'::jsonb, 'sərbəst toplaşmaq', 'AR Konstitusiyası Maddə 78 (Ətraf mühitin qorunması) — Düzgün cavab C variantıdır. Ətraf mühiti qorumaq hər bir şəxsin borcudur. Təbii ehtiyatlara qanunla müəyyən edilmiş həddən artıq zərər vurmaq qadağandır.', 14, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7e18e5d1-4807-4146-a366-90dd8b148b4a', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', 'e14cce78-705d-4e7c-9a8a-ad62e1c05636', 'Azərbaycan Respublikasının Konstitusiyasına görə insan və vətəndaşların əsas vəzifələrindəndir:', 'multiple_choice',
    '["vətənə sədaqət", "əmək", "əqli mülkiyyət", "yaşamaq"]'::jsonb, 'vətənə sədaqət', 'AR Konstitusiyası Maddə 79 (Qanuna zidd vəzifələrin icrasına yol verilməməsi) — Düzgün cavab A variantıdır. Heç kəs Konstitusiyaya və qanunlara zidd vəzifələrin icrasına məcbur edilə bilməz.', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2c4faae5-3e13-4690-9656-ed233acbe3af', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', 'e57729ec-d8ad-4689-a552-cf7b9914eda6', 'Azərbaycan Respublikasının Konstitusiyası insan və vətəndaş hüquqlarının və azadlıqlarının təminatı sahəsində qanunvericilik, icra və məhkəmə hakimiyyəti orqanlarının vəzifələrini necə müəyyən edir?', 'multiple_choice',
    '["Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını gözləmək və qorumaq qanunvericilik, icra və məhkəmə hakimiyyəti orqanlarının borcudur;", "Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını təmin etmək qanunvericilik, icra və məhkəmə hakimiyyəti orqanlarının borcudur;", "Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını müdafiə etmək qanunvericilik, icra və məhkəmə hakimiyyəti orqanlarının borcudur;", "Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını təmin və müdafiə etmək qanunvericilik, icra və məhkəmə hakimiyyəti orqanlarının borcudur."]'::jsonb, 'Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarını və azadlıqlarını gözləmək və qorumaq qanunvericilik, icra və məhkəmə hakimiyyəti orqanlarının borcudur;', 'AR Konstitusiyası Maddə 78 (Ətraf mühitin qorunması) — Düzgün cavab A variantıdır. Ətraf mühiti qorumaq hər bir şəxsin borcudur. Təbii ehtiyatlara qanunla müəyyən edilmiş həddən artıq zərər vurmaq qadağandır.', 16, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b025b620-3cbc-464c-b36f-b55a2d7528a4', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', 'f0f34ee2-6509-49c9-a5ff-29c67cb65414', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq . Kimlər qanunla nəzərdə tutulmuş əsaslar olmadan və qanunda göstərilmiş həcmdən əlavə vergiləri və başqa dövlət ödənişləri ödəməyə məcbur edilə bilməz?', 'multiple_choice',
    '["Heç kəs", "Dövlət qulluqçuları", "Vəzifəli şəxslər və əcnəbilər", "Hüquqi və fiziki şəxslər"]'::jsonb, 'Heç kəs', 'AR Konstitusiyası Maddə 73 (Vergilər və başqa dövlət ödənişləri) — Düzgün cavab A variantıdır. Qanunla müəyyən edilmiş vergiləri ödəmək borcdur. Qanunla nəzərdə tutulmayan vergiləri ödəməyə heç kəs məcbur edilə bilməz.', 17, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '05b23a91-c54b-45ff-a363-0ee6ce6c8af7', '7ec2fe7e-8367-4d1e-a216-dbfe2305dfd2', 'fdae40a1-8ba0-4e1c-9425-ea2aa82035bf', 'Azərbaycan Respublikası Konstitusiyasına əsasən vətənə sədaqət maddəsinə aiddir', 'multiple_choice',
    '["Vəzifəyə seçilmə və ya təyinat yolu ilə qanunvericilik, icra və ya məhkəmə hakimiyyəti orqanlarında işləyən şəxslər öz vəzifələrini dürüst və layiqincə yerinə yetirməməyə görə məsuliyyət daşıyırlar və qanunla müəyyən edilmiş hallarda and içirlər.", "Azərbaycan Respublikasının vətəndaşı heç bir halda Azərbaycan Respublikasından qovula və ya xarici dövlətə verilə bilməz.", "Azərbaycan Respublikası onun ərazisindən kənarda müvəqqəti və ya daimi yaşayan Azərbaycan Respublikası vətəndaşlarının hüquqi müdafiəsinə təminat verir və onlara hamilik edir.", "Azərbaycan Respublikası vətəndaşlarının dövlət orqanlarına seçmək və seçilmək, habelə referendumda iştirak etmək hüququ vardır."]'::jsonb, 'Vəzifəyə seçilmə və ya təyinat yolu ilə qanunvericilik, icra və ya məhkəmə hakimiyyəti orqanlarında işləyən şəxslər öz vəzifələrini dürüst və layiqincə yerinə yetirməməyə görə məsuliyyət daşıyırlar və qanunla müəyyən edilmiş hallarda and içirlər.', 'AR Konstitusiyası Maddə 74 (Vətənə sədaqət) — Düzgün cavab A variantıdır. Vətənə sədaqət müqəddəsdir. Dövlət vəzifəsi tutan şəxslər vəzifələrini layiqincə yerinə yetirməyə görə məsuliyyət daşıyırlar.', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 1/2: Maddə 81-93)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '390e685c-0c2a-4e93-8365-fc527af81791', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 1/2: Maddə 81-93)', 'Milli Məclisin say tərkibi, seçkilər, səlahiyyət müddəti, deputatlığa namizədlər, deputat statusu, toxunulmazlıq və sessiyalar.',
    'Hüquq', 'medium', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '14e66bc6-4130-44d9-9cb7-d39f2fdcd73f', '390e685c-0c2a-4e93-8365-fc527af81791', '04b8b027-443e-4d7f-a4a4-837483b5fc62', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq deputat ola bilər:
1. Elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla ,başqa ödənişli fəaliyyətlə məşğul olan şəxslər.
2. Din xadimləri olmayan , fəaliyyət qabiliyyətsizliyi məhkəmə tərəfindən təsdiq edilməyən şəxslər.
3. Cinayətə uyğun olaraq məhkum olunmuş şəxslər.
4. Məhkəmənin qanuni qüvvəyə minmiş hökmü ilə azadlıqdan məhrumetmə yerlərində cəza çəkmiş şəxslər.', 'multiple_choice',
    '["1,2", "1,3", "2,4", "1,2,3,4"]'::jsonb, '1,2', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab A variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 0, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5cd467c0-5541-4755-9475-ace5038dfda5', '390e685c-0c2a-4e93-8365-fc527af81791', '081c103d-a915-4d31-9143-6401400cd237', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyaları çağrılır:', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin təklifi və ya Azərbaycan Respublikası Milli Məclisinin 42 deputatının tələbi əsasında", "Azərbaycan Respublikası Prezidentinin tələbi və ya Azərbaycan Respublikası Milli Məclisinin 42 deputatının təklifi əsasında", "Azərbaycan Respublikası Prezidentinin və ya Azərbaycan Respublikası Milli Məclisinin 42 deputatının tələbi əsasında", "Azərbaycan Respublikası Prezidentinin və Azərbaycan Respublikası Milli Məclisinin 42 deputatının tələbi əsasında"]'::jsonb, 'Azərbaycan Respublikası Prezidentinin və ya Azərbaycan Respublikası Milli Məclisinin 42 deputatının tələbi əsasında', 'AR Konstitusiyası Maddə 87 (Deputat səlahiyyətlərinin başlanması) — Düzgün cavab C variantıdır. Deputatların səlahiyyətləri Milli Məclisin ilk iclas günü başlayır. 83 deputatın səlahiyyəti təsdiq edildikdə MM səlahiyyətlidir.', 1, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '55f052f7-4782-4c7d-8399-f5b801916be4', '390e685c-0c2a-4e93-8365-fc527af81791', '0a62ea27-dbdb-4399-85c2-e6f184d28e2b', 'Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddəti neçə ildir?', 'multiple_choice',
    '["4", "5", "7", "10"]'::jsonb, '5', 'AR Konstitusiyası Maddə 84 (Milli Məclisin səlahiyyət müddəti) — Düzgün cavab B variantıdır. Milli Məclisin səlahiyyət müddəti 5 ildir. Seçkilər hər beş ildən bir noyabr ayının birinci bazar günü keçirilir. Müharibə şəraitində səlahiyyət müddəti hərbi vəziyyətin sonunadək uzadılır.', 2, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '548dbbdc-ab6e-4ecd-a585-23c9a4bb19af', '390e685c-0c2a-4e93-8365-fc527af81791', '0ebe239d-10e6-443c-9ee7-3854043f41c9', 'Aşağıdakı hallardan hansında Azərbaycan Respublikasının Milli Məclisinin deputatları mandatdan məhrum edilmir?', 'multiple_choice',
    '["seçkilər zamanı səslərin düzgün hesablandığı aşkar olunduqda və ya nizam-intizam qaydaları pozduqda", "Azərbaycan Respublikası vətəndaşlığından çıxdıqda və ya başqa dövlətin vətəndaşlığını qəbul etdikdə", "cinayət törətdikdə və məhkəmənin qanuni qüvvəyə minmiş hökmü olduqda", "dövlət orqanlarında vəzifə tutduqda və ya din xadimi olduqda"]'::jsonb, 'seçkilər zamanı səslərin düzgün hesablandığı aşkar olunduqda və ya nizam-intizam qaydaları pozduqda', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab A variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 3, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '139b5774-ba03-49bc-919d-0212165206b9', '390e685c-0c2a-4e93-8365-fc527af81791', '0ff1805a-ccb6-42c3-b436-547838950ca8', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı halda Azərbaycan Respublikası Milli
Azərbaycan Respublikası Milli Məclisinin sessiyası hansı halda qapalı keçirilə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin qapalı sessiyası Azərbaycan Respublikası Milli Məclisinin 83 deputatının tələbi ilə keçirilə bilər", "Azərbaycan Respublikası Milli Məclisinin qapalı sessiyası Azərbaycan Respublikası Prezidentinin tələbi ilə keçirilə bilər", "Azərbaycan Respublikası Milli Məclisinin qapalı sessiyası Azərbaycan Respublikası Milli Məclisinin 42 deputatının və ya Azərbaycan Respublikası Konstitusiya Məhkəməsinin 6 hakiminin tələbi ilə keçirilə bilər", "Azərbaycan Respublikası Milli Məclisinin qapalı sessiyası Azərbaycan Respublikası Milli Məclisinin 83 deputatının və ya Azərbaycan Respublikası Prezidentinin tələbi ilə keçirilə bilər"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin qapalı sessiyası Azərbaycan Respublikası Milli Məclisinin 83 deputatının tələbi ilə keçirilə bilər', 'AR Konstitusiyası Maddə 88 (Milli Məclisin sessiyaları) — Düzgün cavab A variantıdır. Milli Məclis hər il iki növbəti yaz (1 fevral - 31 may) və payız (30 sentyabr - 30 dekabr) sessiyalarına yığılır. Növbədənkənar sessiyanı Prezidentin və ya 42 deputatın tələbi ilə MM Sədri çağırır. İclaslar açıqdır (83 deputatın tələbi və ya Prezidentin təklifi ilə qapalı keçirilə bilər).', 4, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '298f36f6-f33d-4851-b15a-130b3f379108', '390e685c-0c2a-4e93-8365-fc527af81791', '1496331d-61a9-435b-804c-98136b9587a1', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin deputatları səlahiyyətlərinin itirilməsi barədə qərarın qəbul edilmə qaydası müəyyən edilir:', 'multiple_choice',
    '["Əsasnamə ilə", "Qanunla", "Azərbaycan Respublikası Milli məclisinin sədrinin qərarı ilə", "Konstitusiya qanunu ilə"]'::jsonb, 'Qanunla', 'AR Konstitusiyası Maddə 89 (Deputatlıq səlahiyyətlərinin itirilməsi) — Düzgün cavab B variantıdır. Deputat başqa dövlətin vətəndaşlığını qəbul etdikdə, cinayət törətdikdə, dövlət orqanlarında vəzifə tutduqda, sahibkarlıqla məşğul olduqda deputat mandatını itirir.', 5, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '38a55434-da6a-4ad3-8b77-614b74f7a20e', '390e685c-0c2a-4e93-8365-fc527af81791', '1512d317-605f-4542-89de-ca1946260ab9', 'Azərbaycan Respublikasının Milli Məclisinin say tərkibi ibarətdir:', 'multiple_choice',
    '["45", "120", "80", "125"]'::jsonb, '125', 'AR Konstitusiyası Maddə 83 (Milli Məclis deputatlarının seçkilərinin əsasları) — Düzgün cavab D variantıdır. Milli Məclisin deputatları majoritar seçki sistemi, ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər.', 6, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '949d3363-83c1-489c-bf8d-6e3adeccecad', '390e685c-0c2a-4e93-8365-fc527af81791', '1d5c181b-854f-472f-856a-0f5a277866e7', 'Azərbaycan Respublikası Konstitusiyası Azərbaycan Respublikası Milli Məclisi deputatının məsuliyyətə cəlb olunmasına hansı qadağalar qoyur?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatları heç bir halda məsuliyyətə cəlb oluna bilməzlər;", "Azərbaycan Respublikası Milli Məclisinin deputatları Azərbaycan Respublikası Milli Məclisindəki fəaliyyətinə, səsverməyə və söylədiyi fikrə görə məsuliyyətə cəlb oluna bilməzlər. Razılığı olmadan onlardan bu hallarla əlaqədar izahat, ifadə tələb edilə bilməz;", "Azərbaycan Respublikası Milli Məclisinin deputatları Azərbaycan Respublikası Milli Məclisindən kənardakı fəaliyyətinə, səsverməyə və söylədiyi fikrə görə məsuliyyətə cəlb oluna bilməzlər. Razılığı olmadan onlardan bu hallarla əlaqədar izahat, ifadə tələb edilə bilməz;", "Azərbaycan Respublikasının Konstitusiyası Azərbaycan Respublikası Milli Məclisi deputatının məsuliyyətə cəlb olunmasına heç bir qadağa qoymur."]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatları Azərbaycan Respublikası Milli Məclisindəki fəaliyyətinə, səsverməyə və söylədiyi fikrə görə məsuliyyətə cəlb oluna bilməzlər. Razılığı olmadan onlardan bu hallarla əlaqədar izahat, ifadə tələb edilə bilməz;', 'AR Konstitusiyası Maddə 90 və 91 (Deputat toxunulmazlığı və məsuliyyətdən azadlıq) — Düzgün cavab B variantıdır. Deputatın şəxsiyyəti toxunulmazdır. Cinayət başında yaxalanma halı istisna olmaqla, yalnız MM-in razılığı ilə (Baş prokurorun təqdimatı əsasında) cinayət məsuliyyətinə cəlb edilə bilər.', 7, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '022d51b2-2aa2-4bfc-ae97-d2caa803b918', '390e685c-0c2a-4e93-8365-fc527af81791', '27bfaff8-a068-422a-8313-a96b30d55407', 'Azərbaycan Respublikasının Milli Məclisinin işinin təşkilinə aiddir:', 'multiple_choice',
    '["Öz iş qaydasını müəyyən edir və Milli Məclisin müvafiq orqanlarını yaradır, o cümlədən öz sədrini və onun müavinlərini seçir, nazirliklər, komitələr və komissiyalar təşkil edir, hesablama palatası yaradır", "Öz iş qaydasını müəyyən edir və öz sədrini və onun müavinlərini seçir, komitələr və komissiyalar təşkil edir, hesablama palatası yaradır", "Öz iş qaydasını müəyyən edir və Milli Məclisin müvafiq orqanlarını yaradır, o cümlədən öz sədrini və onun müavinlərini seçir, komitələr və komissiyalar təşkil edir, hesablama palatası yaradır", "Milli Məclisin müvafiq orqanlarını yaradır, o cümlədən öz sədrini və onun müavinlərini seçir, komitələr və komissiyalar təşkil edir, hesablama palatası yaradır"]'::jsonb, 'Öz iş qaydasını müəyyən edir və Milli Məclisin müvafiq orqanlarını yaradır, o cümlədən öz sədrini və onun müavinlərini seçir, komitələr və komissiyalar təşkil edir, hesablama palatası yaradır', 'AR Konstitusiyası Maddə 92 və 93 (MM işinin təşkili və aktları) — Düzgün cavab C variantıdır. Milli Məclis öz tərkibindən Sədr və müavinlərini seçir. Qanunlar və Qərarlar qəbul edir. Deputatlar şəxsən səs verirlər.', 8, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6c39f950-e330-4446-bcac-b36fdc80e1c0', '390e685c-0c2a-4e93-8365-fc527af81791', '2895f7dd-425f-414f-9a5d-811b2b23f214', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Milli Məclisə Seçkilərin nəticələrinin düzgünlüyünü yoxlayır və təsdiq edir:', 'multiple_choice',
    '["Qanunla müəyyən olunmuş qaydada Azərbaycan Respublikasının Ali Məhkəməsi", "Qanunla müəyyən olunmuş qaydada Azərbaycan Respublikasının Konstitusiya Məhkəməsi", "Qanunla müəyyən olunmuş qaydada Azərbaycan Respublikasının Mərkəzi Seçki Komissiyası", "Qanunla müəyyən olunmuş qaydada Azərbaycan Respublikasının Prezidenti"]'::jsonb, 'Qanunla müəyyən olunmuş qaydada Azərbaycan Respublikasının Konstitusiya Məhkəməsi', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab B variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 9, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e2a79ab4-1537-402d-8484-c5aa4b8c679f', '390e685c-0c2a-4e93-8365-fc527af81791', '2f427705-6463-4bac-bb4f-aedf97849826', 'Milli Məclisin deputatı səlahiyyət müddəti ərzində cinayət məsuliyyətinə cəlb edilə bilər?', 'multiple_choice',
    '["heç bir halda", "hakim partiyanın siyasi kursunu tənqid etdikdə", "sahibkarlıq,kommersiya və başqa ödənişli fəaliyyətlə məşğul olduqda", "cinayət başında yaxalandıqda"]'::jsonb, 'cinayət başında yaxalandıqda', 'AR Konstitusiyası Maddə 89 (Deputatlıq səlahiyyətlərinin itirilməsi) — Düzgün cavab D variantıdır. Deputat başqa dövlətin vətəndaşlığını qəbul etdikdə, cinayət törətdikdə, dövlət orqanlarında vəzifə tutduqda, sahibkarlıqla məşğul olduqda deputat mandatını itirir.', 10, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '71cf7279-aa69-43fd-8ce5-342d50f54865', '390e685c-0c2a-4e93-8365-fc527af81791', '3f4b643d-ecb8-4204-907e-95891ff73471', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisinin iş qaydasını hansı orqan müəyyən edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Kostitusiya Məhkəməsi Azərbaycan Respublikasının Milli Məclisinin iş qaydasını müəyyən edir", "Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikasının Milli Məclisinin iş qaydasını müəyyən edir", "Azərbaycan Respublikasının Milli Məclisi öz iş qaydasını müəyyən edir", "Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Milli Məclisinin iş qaydasını müəyyən edir"]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisi öz iş qaydasını müəyyən edir', 'AR Konstitusiyası Maddə 90 və 91 (Deputat toxunulmazlığı və məsuliyyətdən azadlıq) — Düzgün cavab C variantıdır. Deputatın şəxsiyyəti toxunulmazdır. Cinayət başında yaxalanma halı istisna olmaqla, yalnız MM-in razılığı ilə (Baş prokurorun təqdimatı əsasında) cinayət məsuliyyətinə cəlb edilə bilər.', 11, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e8d8a1aa-d360-4e94-9b1c-8f4afc6da44b', '390e685c-0c2a-4e93-8365-fc527af81791', '4400a9e6-db6c-4026-8b14-a79865943645', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Milli Məclis deputatının toxunulmazlığı ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında intizam tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, intizam məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz ancaq şəxsi müayinə edilə bilər"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.', 'AR Konstitusiyası Maddə 90.I (Deputatın toxunulmazlığı) — AR Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.', 12, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '36f4c815-95f2-405d-8393-53308e1b408a', '390e685c-0c2a-4e93-8365-fc527af81791', '57f7538c-165e-4586-87b6-9d3e5a04d92b', 'Azərbaycan Respublikasının Kostitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisi deputatlığından çıxanların yerinə seçkilər Azərbaycan Respublikası Milli Məclisinin səlahiyyət müddətinin bitməsinə 120 gündən çox müddət qalarsa, keçirilmir.", "Azərbaycan Respublikasının Milli Məclisi 63 deputatının səlahiyyətləri təsdiq olunduqda səlahiyyətlidir.", "Azərbaycan Respublikasının Milli Məclisi hər il dörd növbəti yaz , payız, qapalı və növbədənkənar sessiyalarına yığılır.", "Azərbaycan Respublikası Milli Məclisinin 83 deputatının səlahiyyətləri təsdiq edildikdən sonra Azərbaycan Respublikası Milli Məclisinin ilk iclası həmin gündən başlayaraq bir həftədən gec olmayaraq çağırılır."]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin 83 deputatının səlahiyyətləri təsdiq edildikdən sonra Azərbaycan Respublikası Milli Məclisinin ilk iclası həmin gündən başlayaraq bir həftədən gec olmayaraq çağırılır.', 'AR Konstitusiyası Maddə 86 (Seçkilərin nəticələrinin təsdiqi) — Düzgün cavab D variantıdır. Seçkilərin nəticələrinin düzgünlüyünü Konstitusiya Məhkəməsi yoxlayır və təsdiq edir.', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '65b58f10-ba2c-4c6a-89a7-d8f1441192cd', '390e685c-0c2a-4e93-8365-fc527af81791', '6586eaff-0146-4aa5-b462-1065ae48c2f2', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq deputat ola bilər:
1. Azərbaycan Respublikasının seçkilərdə iştirak etmək hüququna malik olan hər bir vətəndaşı qanunla müəyyən edilmiş qaydada
2. İkili vətəndaşlığı olan şəxslər
3. Başqa dövlətlər qarşısında öhdəliyi olmayan şəxslər
4. İcra və ya məhkəmə hakimiyyəti sistemlərində qulluq etməyən şəxslər
5. Elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olan şəxslər', 'multiple_choice',
    '["1,2,3,4", "1,3,4,5", "1,2,4", "1,2,3,4,5"]'::jsonb, '1,3,4,5', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab B variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 14, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '30ac9983-4947-4454-bec1-dc21968b4291', '390e685c-0c2a-4e93-8365-fc527af81791', '6710b3ba-2f25-487d-a832-650d84350979', 'Azərbaycan Respublikası Milli Məclisinin deputatları hansı formada seçilirlər?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatları majoritar seçki sistemi ümumi, qeyri-bərabər və dolayı seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər", "Azərbaycan Respublikası Milli Məclisinin deputatları proporsional seçki sistemi ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər", "Azərbaycan Respublikası Milli Məclisinin deputatları majoritar seçki sistemi, ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər.", "Azərbaycan Respublikası Milli Məclisinin deputatları proporsional seçki sistemi ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və açıq səsvermə yolu ilə seçilirlər"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatları majoritar seçki sistemi, ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər.', 'AR Konstitusiyası Maddə 84 (Milli Məclisin səlahiyyət müddəti) — Düzgün cavab C variantıdır. Milli Məclisin səlahiyyət müddəti 5 ildir. Seçkilər hər beş ildən bir noyabr ayının birinci bazar günü keçirilir. Müharibə şəraitində səlahiyyət müddəti hərbi vəziyyətin sonunadək uzadılır.', 15, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '21fce45c-b992-4e0a-9469-c8ce8b6bccc4', '390e685c-0c2a-4e93-8365-fc527af81791', '6d3c1b20-897f-4315-a413-0af0a393d1cb', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyalarını kim çağırır?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyalarını Azərbaycan Respublikası Milli Məclisinin sədri çağırır", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyalarını Azərbaycan Respublikası Prezidenti və ya Azərbaycan Respublikası Milli Məclisinin 42 deputatı çağırır", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyalarını Azərbaycan Respublikası Prezidenti və Azərbaycan Respublikası Milli Məclisinin 42 deputatı çağırır", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyalarını Azərbaycan Respublikası Prezidenti və ya Azərbaycan Respublikası Milli Məclisinin 42 deputatı və Azərbaycan Respublikası Milli Məclisinin sədri çağırır"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyalarını Azərbaycan Respublikası Milli Məclisinin sədri çağırır', 'AR Konstitusiyası Maddə 87 (Deputat səlahiyyətlərinin başlanması) — Düzgün cavab A variantıdır. Deputatların səlahiyyətləri Milli Məclisin ilk iclas günü başlayır. 83 deputatın səlahiyyəti təsdiq edildikdə MM səlahiyyətlidir.', 16, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '47f9d967-9401-496e-aeb5-ad91c8e71833', '390e685c-0c2a-4e93-8365-fc527af81791', '71fb8cb6-ecc3-48cd-ab82-7d6ac2e3b4fd', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisi deputatlarının səlahiyyətləri nə zaman bitir?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisi deputatlarının səlahiyyətləri Azərbaycan Respublikası Milli Məclisinin yeni çağırışının ilk iclas günü bitir", "Azərbaycan Respublikası Milli Məclisi deputatlarının səlahiyyətləri Azərbaycan Respublikası Milli Məclisinin təsdiq olunması barədə Konstitusiya Məkəməsinin rəsmən elan olunmasından sonra bitir", "Azərbaycan Respublikası Milli Məclisi deputatlarının səlahiyyətləri Azərbaycan Respublikası Milli Məclisinə seçkilərin keçrildiyi gün bitir", "Azərbaycan Respublikası Milli Məclisi deputatlarının səlahiyyətləri qanunla müəyyən olunmuş qaydada Azərbaycan Respublikası Konstitusiya Məhkəməsinin müəyyən etdiyi vaxt bitir"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisi deputatlarının səlahiyyətləri Azərbaycan Respublikası Milli Məclisinin yeni çağırışının ilk iclas günü bitir', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab A variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 17, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7da5e048-9221-4a71-a2c1-2c84ec460c62', '390e685c-0c2a-4e93-8365-fc527af81791', '74025d4c-80bf-434c-a54e-3b555c2a8ffc', 'Azərbaycan Respublikasının Konstitusiyasına görə insan və vətəndaşların əsas hüquqlarındandır:', 'multiple_choice',
    '["dövlət rəmzlərinə hörmət", "məsuliyyət", "istirahət", "qanunla müəyyən edilmiş vergilərin ödənilməsi"]'::jsonb, 'istirahət', 'AR Konstitusiyası Maddə 82 (Milli Məclisin say tərkibi) — Düzgün cavab C variantıdır. Milli Məclis 125 deputatdan ibarətdir.', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '259d8efa-2328-4e0a-b0cf-926cda79bdb6', '390e685c-0c2a-4e93-8365-fc527af81791', '7889fb58-cbb2-4923-830a-5c88a26b6ec7', 'Azərbaycan Respublikası Milli Məclisinin deputatlarının səlahiyyət müddəti hansı müddətlə məhdudlaşır?', 'multiple_choice',
    '["Milli Məclisinin deputatlarının səlahiyyət müddəti Azərbaycan Respublikası Prezidentinin səlahiyyət müddəti ilə məhdudlaşır.", "Milli Məclisinin deputatlarının səlahiyyət müddəti Azərbaycan Respublikası Konstitusiya məhkəməsinin hakimlərinin səlahiyyət müddəti ilə məhdudlaşır.", "Milli Məclisinin deputatlarının səlahiyyət müddəti Azərbaycan Respublikası Nazirlər Kabinetinin səlahiyyət müddəti ilə məhdudlaşır.", "Milli Məclisinin deputatlarının səlahiyyət müddəti Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddəti ilə məhdudlaşır."]'::jsonb, 'Milli Məclisinin deputatlarının səlahiyyət müddəti Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddəti ilə məhdudlaşır.', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab D variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 19, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6000ff50-a5d2-4cf0-976f-88020b4870bf', '390e685c-0c2a-4e93-8365-fc527af81791', '78ea1dea-cfb2-40b6-94c5-a121b6770873', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddəti nə zaman uzadılır?', 'multiple_choice',
    '["Müharibə şəraitində hərbi əməliyyatların aparılması Azərbaycan Respublikasının Milli Məclisinə seçkilərin keçirilməsini mümkün etmədikdə.", "Fövqaladə vəziyyət zamanı və ya Müharibə şəraitində hərbi əməliyyatların aparılması Azərbaycan Respublikasının Milli Məclisinə seçkilərin keçirilməsini mümkün etmədikdə.", "Müharibə və ya sülh şəraitində hərbi əməliyyatların aparılması Azərbaycan Respublikasının Milli Məclisinə seçkilərin keçirilməsini mümkün etmədikdə.", "Müharibə şəraitində hərbi əməliyyatların aparılması Azərbaycan Respublikasının Milli Məclisinə seçkilərin keçirilməsini mümkün etmədikdə Prezidentin təklifi ilə."]'::jsonb, 'Müharibə şəraitində hərbi əməliyyatların aparılması Azərbaycan Respublikasının Milli Məclisinə seçkilərin keçirilməsini mümkün etmədikdə.', 'AR Konstitusiyası Maddə 84 (Milli Məclisin səlahiyyət müddəti) — Düzgün cavab A variantıdır. Milli Məclisin səlahiyyət müddəti 5 ildir. Seçkilər hər beş ildən bir noyabr ayının birinci bazar günü keçirilir. Müharibə şəraitində səlahiyyət müddəti hərbi vəziyyətin sonunadək uzadılır.', 20, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f222095a-7f1e-4ba5-84f2-4a654c6fd888', '390e685c-0c2a-4e93-8365-fc527af81791', '7dfcfa09-e178-4e4b-aeee-1417684dc181', '“Dövlət qulluğu haqqında” AR Qanununa əsasən intizam tənbehlərinin tətbiqi qaydası ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında intizam tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, intizam məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz ancaq şəxsi müayinə edilə bilər"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatı səlahiyyət müddəti ərzində cinayət başında yaxalanma hallarından başqa, cinayət məsuliyyətinə cəlb edilə bilməz, tutula bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.', 'AR Konstitusiyası Maddə 89 (Deputatlıq səlahiyyətlərinin itirilməsi) — Deputat başqa dövlətin vətəndaşlığını qəbul etdikdə, cinayət törətdikdə, dövlət orqanlarında vəzifə tutduqda, sahibkarlıqla məşğul olduqda deputat mandatını itirir.', 21, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '02201b09-14e2-49bb-840f-7ea5f8f36c47', '390e685c-0c2a-4e93-8365-fc527af81791', '82a285d5-8882-49b5-a32b-ab0af228ddb1', 'Azərbaycan Respublikası Konstitusiyasına görə insan və vətəndaşların əsas hüquqlarından biri:', 'multiple_choice',
    '["vətənə sədaqət", "dövlət rəmzlərinə hörmət", "mənzil toxununlmazlığı", "mədəniyyət abidələrinin qorunması"]'::jsonb, 'mənzil toxununlmazlığı', 'AR Konstitusiyası Maddə 83 (Milli Məclis deputatlarının seçkilərinin əsasları) — Düzgün cavab C variantıdır. Milli Məclisin deputatları majoritar seçki sistemi, ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər.', 22, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2f9894f0-dbca-44c1-8036-08f3145a4400', '390e685c-0c2a-4e93-8365-fc527af81791', '83407919-1e34-4060-8554-a07ab37a36b4', 'Azərbaycan Respublikasının Konstitusiyasına görə insan və vətəndaşların əsas hüquqularındandır:', 'multiple_choice',
    '["vətəni müdafiə", "məsuliyyət", "qanunla müəyyən edilmiş vergilərin ödənilməsi", "bərabərlik"]'::jsonb, 'bərabərlik', 'AR Konstitusiyası Maddə 81 (Qanunvericilik hakimiyyəti) — Qanunvericilik hakimiyyətini Azərbaycan Respublikasının Milli Məclisi həyata keçirir.', 23, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8688b25b-c204-4b9e-8049-37f8618817ce', '390e685c-0c2a-4e93-8365-fc527af81791', '89583a0e-f3b4-4d39-a881-dac74e4d5ce5', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin deputatlığından çıxanların yerinə yeni seçkilər keçirilərsə, yeni seçilən deputatın səlahiyyət müddəti nə ilə məhdudlaşır?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatlığından çıxanların yerinə yeni seçkilər keçirilərsə, yeni seçilən deputatın səlahiyyət müddəti deputatlıqdan çıxanın qalan səlahiyyət müddəti ilə məhdudlaşır.", "Azərbaycan Respublikası Milli Məclisinin deputatlığından çıxanların yerinə yeni seçkilər keçirilərsə, yeni seçilən deputatın səlahiyyət müddətini Milli Məclisin sədri müəyyən edir", "Azərbaycan Respublikası Milli Məclisinin deputatlığından çıxanların yerinə yeni seçkilər keçirilərsə, yeni seçilən deputatın səlahiyyət müddətini Konstitusiya Məhkəməsi müəyyən edir", "Azərbaycan Respublikası Milli Məclisinin deputatlığından çıxanların yerinə yeni seçkilər keçirilərsə, yeni seçilən deputatın səlahiyyət müddəti yenidən 5 il olacaqdır"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatlığından çıxanların yerinə yeni seçkilər keçirilərsə, yeni seçilən deputatın səlahiyyət müddəti deputatlıqdan çıxanın qalan səlahiyyət müddəti ilə məhdudlaşır.', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab A variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 24, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '76ec12c8-3a1c-42e1-9ce4-d469d9ffbb23', '390e685c-0c2a-4e93-8365-fc527af81791', '8985a1cc-adfc-4f6b-8a51-9421a68a5600', 'Azərbaycan Respublikası Milli Məclisinin hər çağırışının seçkiləri nə zaman keçirilir?', 'multiple_choice',
    '["Hər beş ildən bir noyabr ayının ikinci bazar günü", "Hər beş ildən bir noyabr ayının birinci bazar günü", "Hər beş ildən bir oktyabr ayının birinci bazar günü", "Hər beş ildən bir oktyabr ayının ikinci bazar günü"]'::jsonb, 'Hər beş ildən bir noyabr ayının birinci bazar günü', 'AR Konstitusiyası Maddə 85 (Deputatlığa namizədlərə aid tələblər) — Düzgün cavab B variantıdır. Seçki hüququ olan hər bir AR vətəndaşı deputat seçilə bilər. İkili vətəndaşlığı, başqa dövlətlər qarşısında öhdəliyi olan, icra/məhkəmə sistemində qulluq edən, din xadimləri, fəaliyyət qabiliyyətsizliyi olan və ağır cinayətlərə görə məhkum edilmiş şəxslər deputat seçilə bilməzlər (2016-cı ildə 25 yaş senzi ləğv edilmişdir).', 25, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f1b03ea0-1173-4a95-9c72-60939d8b9995', '390e685c-0c2a-4e93-8365-fc527af81791', '990b0b33-d753-45a3-bf0c-e0bf7f73641b', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq səlahiyyət müddəti ərzində Azərbaycan Respublikası Milli Məclisi deputatının toxunulmazdır:', 'multiple_choice',
    '["Səlahiyyət müddəti ərzində Azərbaycan Respublikası Milli Məclisi deputatının şəxsiyyəti toxunulmazdır.", "Bütün hallarda Azərbaycan Respublikası Milli Məclisi deputatının şəxsiyyəti toxunulmazdır.", "Səlahiyyət müddəti ərzində və ondan sonrakı müddətdə Azərbaycan Respublikası Milli Məclisi deputatının şəxsiyyəti toxunulmazdır.", "Səlahiyyət müddəti ərzində Azərbaycan Respublikası Milli Məclisi deputatının şəxsiyyəti, mülkiyyəti və əmlakı toxunulmazdır."]'::jsonb, 'Səlahiyyət müddəti ərzində Azərbaycan Respublikası Milli Məclisi deputatının şəxsiyyəti toxunulmazdır.', 'AR Konstitusiyası Maddə 89 (Deputatlıq səlahiyyətlərinin itirilməsi) — Düzgün cavab A variantıdır. Deputat başqa dövlətin vətəndaşlığını qəbul etdikdə, cinayət törətdikdə, dövlət orqanlarında vəzifə tutduqda, sahibkarlıqla məşğul olduqda deputat mandatını itirir.', 26, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e1a918f3-1a42-4ba6-96f7-4f0ab3ab0d37', '390e685c-0c2a-4e93-8365-fc527af81791', '9d9e8841-39e2-4c8d-a1d6-cf0aacef7732', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası Milli Məclisinin deputatı hansı hallarda mandatından məhrum edilmir?', 'multiple_choice',
    '["seçkilər zamanı səslərin düzgün hesablanmadığı aşkar olunduqda;", "Milli Məclisinin deputatları öz səlahiyyətlərini daimi icra edə bilmədikdə və qanunda nəzərdə tutulmuş digər hallarda", "Azərbaycan Respublikası vətəndaşlığından çıxdıqda və ya başqa dövlətin vətəndaşlığını qəbul etdikdə;", "cinayət törətdikdə və məhkəmənin qanuni qüvvəyə minmiş hökmü olduqda;"]'::jsonb, 'Milli Məclisinin deputatları öz səlahiyyətlərini daimi icra edə bilmədikdə və qanunda nəzərdə tutulmuş digər hallarda', 'AR Konstitusiyası Maddə 88 (Milli Məclisin sessiyaları) — Düzgün cavab B variantıdır. Milli Məclis hər il iki növbəti yaz (1 fevral - 31 may) və payız (30 sentyabr - 30 dekabr) sessiyalarına yığılır. Növbədənkənar sessiyanı Prezidentin və ya 42 deputatın tələbi ilə MM Sədri çağırır. İclaslar açıqdır (83 deputatın tələbi və ya Prezidentin təklifi ilə qapalı keçirilə bilər).', 27, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3a7af866-5209-4b7e-b731-eb7e9a7bdabb', '390e685c-0c2a-4e93-8365-fc527af81791', 'b0e1df69-6672-4c09-96e7-fe12a533baf9', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası Milli Məclisinin deputatı hansı hallarda mandatından məhrum edilmir', 'multiple_choice',
    '["dövlət orqanlarında vəzifə tutduqda, din xadimi olduqda, sahibkarlıq, kommersiya və başqa ödənişli fəaliyyətlə məşğul olduqda (elmi, pedaqoji və yaradıcılıq fəaliyyəti daxil olmaqla);", "özü imtina etdikdə;", "Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu şəxsən həyata keçirmədikdə", "deputat üçün qanunla müəyyən edilmiş etik davranış qaydalarını kobud surətdə pozduqda"]'::jsonb, 'dövlət orqanlarında vəzifə tutduqda, din xadimi olduqda, sahibkarlıq, kommersiya və başqa ödənişli fəaliyyətlə məşğul olduqda (elmi, pedaqoji və yaradıcılıq fəaliyyəti daxil olmaqla);', 'AR Konstitusiyası Maddə 88 (Milli Məclisin sessiyaları) — Düzgün cavab A variantıdır. Milli Məclis hər il iki növbəti yaz (1 fevral - 31 may) və payız (30 sentyabr - 30 dekabr) sessiyalarına yığılır. Növbədənkənar sessiyanı Prezidentin və ya 42 deputatın tələbi ilə MM Sədri çağırır. İclaslar açıqdır (83 deputatın tələbi və ya Prezidentin təklifi ilə qapalı keçirilə bilər).', 28, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4e1ed0d2-d8e8-431d-92b9-924623e0493f', '390e685c-0c2a-4e93-8365-fc527af81791', 'b1b8cd30-016a-4c73-8225-f0bd84a6d5f5', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddətinin uzadılması barədə qərar hansı qaydada qəbul olunur?', 'multiple_choice',
    '["Seçkilərin (referendumun) keçirilməsini təmin edən dövlət orqanının müraciətinə əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən qəbul edilir", "Azərbaycan Respublikası nın Ali Məhkəməsinin müraciəti əsasında Azərbaycan Respublikası nın Konstitusiya Məhkəməsi tərəfindən qəbul edilir", "Azərbaycan Respublikası Prezidentinin müraciəti əsasında Azərbaycan Respublikası nın Konstitusiya Məhkəməsi tərəfindən qəbul edilir", "Azərbaycan Respublikası Baş nazirinin müraciəti əsasında Azərbaycan Respublikası Prezidenti tərəfindən"]'::jsonb, 'Seçkilərin (referendumun) keçirilməsini təmin edən dövlət orqanının müraciətinə əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən qəbul edilir', 'AR Konstitusiyası Maddə 84 (Milli Məclisin səlahiyyət müddəti) — Düzgün cavab A variantıdır. Milli Məclisin səlahiyyət müddəti 5 ildir. Seçkilər hər beş ildən bir noyabr ayının birinci bazar günü keçirilir. Müharibə şəraitində səlahiyyət müddəti hərbi vəziyyətin sonunadək uzadılır.', 29, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1aa7b823-8824-416b-91f8-75422950213d', '390e685c-0c2a-4e93-8365-fc527af81791', 'b80a801b-e7df-4688-97dc-69a93d838db7', 'Azərbaycan Respublikasının Konstitusiyasına görə insan və vətəndaşların əsas hüquqularındandır:', 'multiple_choice',
    '["seçki", "dövlət rəmzlərinə hörmət", "məsuliyyət", "vətəni müdafiə"]'::jsonb, 'seçki', 'AR Konstitusiyası Maddə 81 (Qanunvericilik hakimiyyəti) — Düzgün cavab A variantıdır. Qanunvericilik hakimiyyətini Azərbaycan Respublikasının Milli Məclisi həyata keçirir.', 30, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f1d6f8a8-3e0d-46cc-83e1-4350c51d7275', '390e685c-0c2a-4e93-8365-fc527af81791', 'bffa94a8-427a-45ac-86d9-1a1d3bf0b407', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Respublikası Milli Məclisinin ilk iclasının keçirilmə vaxtını Azərbaycan Respublikasının Konstitusiya Məhkəməsi müəyyən edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisinə seçkilərdən sonra martın 5-dək onun 63 deputatının səlahiyyətləri təsdiq edilməzsə, Azərbaycan Respublikası Milli Məclisinin ilk iclasının keçirilmə vaxtını Azərbaycan Respublikasının Konstitusiya Məhkəməsi müəyyən edir", "Azərbaycan Respublikasının Milli Məclisinə seçkilərdən sonra martın 10-dək onun 83 deputatının səlahiyyətləri təsdiq edilməzsə, Azərbaycan Respublikası Milli Məclisinin ilk iclasının keçirilmə vaxtını Azərbaycan Respublikasının Konstitusiya Məhkəməsi müəyyən edir", "Azərbaycan Respublikasının Milli Məclisinə seçkilərdən sonra martın 15-dək onun 95 deputatının səlahiyyətləri təsdiq edilməzsə, Azərbaycan Respublikası Milli Məclisinin ilk iclasının keçirilmə vaxtını Azərbaycan Respublikasının Konstitusiya Məhkəməsi müəyyən edir", "Azərbaycan Respublikasının Milli Məclisinə seçkilərdən sonra martın 10-dək onun 95 deputatının səlahiyyətləri təsdiq edilməzsə, Azərbaycan Respublikası Milli Məclisinin ilk iclasının keçirilmə vaxtını Azərbaycan Respublikasının Konstitusiya Məhkəməsi müəyyən edir"]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisinə seçkilərdən sonra martın 10-dək onun 83 deputatının səlahiyyətləri təsdiq edilməzsə, Azərbaycan Respublikası Milli Məclisinin ilk iclasının keçirilmə vaxtını Azərbaycan Respublikasının Konstitusiya Məhkəməsi müəyyən edir', 'AR Konstitusiyası Maddə 86 (Seçkilərin nəticələrinin təsdiqi) — Düzgün cavab B variantıdır. Seçkilərin nəticələrinin düzgünlüyünü Konstitusiya Məhkəməsi yoxlayır və təsdiq edir.', 31, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '11702220-e144-4e6d-bc2d-f7dc9d224223', '390e685c-0c2a-4e93-8365-fc527af81791', 'd08ab46b-869f-438b-a467-2cba29e3e659', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəliyini kim müəyyənləşdirir?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəliyini müvafiq olaraq onun çağırılmasını tələb edənlər müəyyənləşdirir", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəliyini müvafiq olaraq Azərbaycan Respublikasının Milli Məclisin sədri müəyyənləşdirir", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəliyini müvafiq olaraq Azərbaycan Respublikası Konstitusiya Məhkəməsinin sədri müəyyənləşdirir", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəliyini müvafiq olaraq onun çağırılmasını tələb edənlər və Azərbaycan Respublikasının Milli Məclisin sədri müəyyənləşdirir"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəliyini müvafiq olaraq onun çağırılmasını tələb edənlər müəyyənləşdirir', 'AR Konstitusiyası Maddə 88 (Milli Məclisin sessiyaları) — Düzgün cavab A variantıdır. Milli Məclis hər il iki növbəti yaz (1 fevral - 31 may) və payız (30 sentyabr - 30 dekabr) sessiyalarına yığılır. Növbədənkənar sessiyanı Prezidentin və ya 42 deputatın tələbi ilə MM Sədri çağırır. İclaslar açıqdır (83 deputatın tələbi və ya Prezidentin təklifi ilə qapalı keçirilə bilər).', 32, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b0708cbc-5804-4327-9866-5d72705906d7', '390e685c-0c2a-4e93-8365-fc527af81791', 'd8b0c472-dc6f-4cf5-97de-bde2fc35d4bf', 'Azərbaycan Respublikasının Milli Məclisinin qəbul etdiyi aktları seçin:
1. Konstitusiya qanunu
2. Fərman
3. Qanun
4. Sərəncam
5. Qərar', 'multiple_choice',
    '["1,2,3", "3,4,5", "1,3,5", "2,3,4"]'::jsonb, '1,3,5', 'AR Konstitusiyası Maddə 92 və 93 (MM işinin təşkili və aktları) — Düzgün cavab C variantıdır. Milli Məclis öz tərkibindən Sədr və müavinlərini seçir. Qanunlar və Qərarlar qəbul edir. Deputatlar şəxsən səs verirlər.', 33, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '45e6b4e3-8444-4375-a356-4988236abdd5', '390e685c-0c2a-4e93-8365-fc527af81791', 'e66af216-7831-453d-b4f7-5483c04a7046', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin deputatlığından məhrumetmə haqqında qərar hansı qaydada qəbul edilir?', 'multiple_choice',
    '["Əsasnamə ilə", "Qanunla qəbul edilmiş qaydada", "Azərbaycan Respublikası Milli məclisinin sədrinin qərarı ilə", "Konstitusiya qanunu ilə"]'::jsonb, 'Qanunla qəbul edilmiş qaydada', 'AR Konstitusiyası Maddə 89 (Deputatlıq səlahiyyətlərinin itirilməsi) — Düzgün cavab B variantıdır. Deputat başqa dövlətin vətəndaşlığını qəbul etdikdə, cinayət törətdikdə, dövlət orqanlarında vəzifə tutduqda, sahibkarlıqla məşğul olduqda deputat mandatını itirir.', 34, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4675f0ea-6f95-4604-8d4b-a4207fcb62ed', '390e685c-0c2a-4e93-8365-fc527af81791', 'e7808cef-1797-41ad-9a36-48200f17f59a', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı halda Azərbaycan Respublikası Milli Məclisinin deputatlarının səlahiyyətləri itirilir?', 'multiple_choice',
    '["Özü imtina etdikdə", "Bu Konstitusiyanın 93-cü maddəsinin III hissəsinin tələbini pozduqda", "Deputat üçün qanunla müəyyən edilmiş etik davranış qaydalarını kobud surətdə pozduqda", "Öz səlahiyyətlərini daimi icra edə bilmədikdə və qanunda nəzərdə tutulmuş digər hallarda"]'::jsonb, 'Öz səlahiyyətlərini daimi icra edə bilmədikdə və qanunda nəzərdə tutulmuş digər hallarda', 'AR Konstitusiyası Maddə 89 (Deputatlıq səlahiyyətlərinin itirilməsi) — Düzgün cavab D variantıdır. Deputat başqa dövlətin vətəndaşlığını qəbul etdikdə, cinayət törətdikdə, dövlət orqanlarında vəzifə tutduqda, sahibkarlıqla məşğul olduqda deputat mandatını itirir.', 35, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a513d303-804c-4f42-8e12-7376bd5e0050', '390e685c-0c2a-4e93-8365-fc527af81791', 'e8c31e87-7268-4a21-ac92-6365889770c5', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisində Konstitusiya qanunları, qanunlar və qərarlar hansı qaydada qəbul edilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisində Konstitusiya qanunları, qanunlar və qərarlar Konstitusiya ilə nəzərdə tutulmuş qaydada qəbul edilir", "Azərbaycan Respublikasının Milli Məclisində Konstitusiya qanunları, qanunlar və qərarlar qanunla nəzərdə tutulmuş qaydada qaydada qəbul edilir", "Azərbaycan Respublikasının Milli Məclisində Konstitusiya qanunları, qanunlar və qərarlar Konstittusiya qanunu ilə nəzərdə tutulmuş qaydada qaydada qəbul edilir", "Azərbaycan Respublikasının Milli Məclisində Konstitusiya qanunları, qanunlar və qərarlar sərəncamla nəzərdə tutulmuş qaydada qəbul edilir"]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisində Konstitusiya qanunları, qanunlar və qərarlar Konstitusiya ilə nəzərdə tutulmuş qaydada qəbul edilir', 'AR Konstitusiyası Maddə 92 və 93 (MM işinin təşkili və aktları) — Düzgün cavab A variantıdır. Milli Məclis öz tərkibindən Sədr və müavinlərini seçir. Qanunlar və Qərarlar qəbul edir. Deputatlar şəxsən səs verirlər.', 36, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e3d7576d-815a-4a8f-842b-74c09937f3a5', '390e685c-0c2a-4e93-8365-fc527af81791', 'eb38f5d8-85fd-40d7-a226-91cbad564255', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu necə həyata keçirirlər:', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu şəxsən həyata keçirirlər", "Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu nümayəndələri vasitəsilə həyata keçirirlər", "Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu şəxsən və ya nümayəndələri vasitəsilə həyata keçirirlər", "Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu vəkilləri vasitəsilə həyata keçirirlər"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatları səsvermə hüququnu şəxsən həyata keçirirlər', 'AR Konstitusiyası Maddə 92 və 93 (MM işinin təşkili və aktları) — Düzgün cavab A variantıdır. Milli Məclis öz tərkibindən Sədr və müavinlərini seçir. Qanunlar və Qərarlar qəbul edir. Deputatlar şəxsən səs verirlər.', 37, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '420e6bff-ac36-45d7-b2df-16bd786ed7fc', '390e685c-0c2a-4e93-8365-fc527af81791', 'f14c949b-628b-4c7c-be5d-c9847710fa0d', 'Azərbaycan Respublikasında qanunvericilik hakimiyyətini hansı orqan həyata keçirir?', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiya Məhkəməsi", "Azərbaycan Respublikası Milli Məclisi", "Azərbaycan Respublikası Prezident Administrasiyası", "Azərbaycan Respublikası Nazirlər Kabineti"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisi', 'AR Konstitusiyası Maddə 83 (Milli Məclis deputatlarının seçkilərinin əsasları) — Düzgün cavab B variantıdır. Milli Məclisin deputatları majoritar seçki sistemi, ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə seçilirlər.', 38, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1dedfbde-0d44-461f-ab65-099ff9d53261', '390e685c-0c2a-4e93-8365-fc527af81791', 'f3fb38db-591b-4f5d-8b51-f2cebbca1d5f', 'Azərbaycan Respublikası Milli Məclisinin deputatının toxunulmazlığına xitam verilməsi prosedurunu seçin:', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatı cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikası Ali Məhkəməsinin sədrinə xəbər verir və Azərbaycan Respublikası Ali Məhkəməsinin sədrinin təqdimatına əsasən Azərbaycan Respublikası Milli Məclisi xitam barəsində qərar çıxarır", "Azərbaycan Respublikası Milli Məclisinin deputatı cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikası Baş prokuroruna xəbər verir və Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikası Milli Məclisi xitam barəsində qərar çıxarır", "Azərbaycan Respublikası Milli Məclisinin deputatı cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikası Baş prokuroruna xəbər verir və Baş prokurorun qərarı ilə Azərbaycan Respublikası Milli Məclisinin deputattının toxunulmazlığına xitam verilir", "Azərbaycan Respublikası Milli Məclisinin deputatı cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikası Baş prokuroruna xəbər verir və Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikası Prezindeti xitam barəsində qərar çıxarır"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatı cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikası Baş prokuroruna xəbər verir və Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikası Milli Məclisi xitam barəsində qərar çıxarır', 'AR Konstitusiyası Maddə 90 və 91 (Deputat toxunulmazlığı və məsuliyyətdən azadlıq) — Düzgün cavab B variantıdır. Deputatın şəxsiyyəti toxunulmazdır. Cinayət başında yaxalanma halı istisna olmaqla, yalnız MM-in razılığı ilə (Baş prokurorun təqdimatı əsasında) cinayət məsuliyyətinə cəlb edilə bilər.', 39, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '881814de-33b0-4319-afec-1c4cc363a7ba', '390e685c-0c2a-4e93-8365-fc527af81791', 'f4c6cb1f-4ade-4a45-9e49-69d76ea26c0b', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin sessiyalarının iclasları necə keçirilir?', 'multiple_choice',
    '["Yalnız açıq", "Yalnız qapalı", "Açıq (zərurət olduqda qapalı keçirilə bilər)", "Gizli"]'::jsonb, 'Açıq (zərurət olduqda qapalı keçirilə bilər)', 'AR Konstitusiyası Maddə 88 (Milli Məclisin sessiyaları) — Düzgün cavab C variantıdır. Milli Məclis hər il iki növbəti yaz (1 fevral - 31 may) və payız (30 sentyabr - 30 dekabr) sessiyalarına yığılır. Növbədənkənar sessiyanı Prezidentin və ya 42 deputatın tələbi ilə MM Sədri çağırır. İclaslar açıqdır (83 deputatın tələbi və ya Prezidentin təklifi ilə qapalı keçirilə bilər).', 40, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0d2588bc-c71a-4be6-99ba-93a428c3623a', '390e685c-0c2a-4e93-8365-fc527af81791', 'fefcb565-82aa-4ebd-83af-b0f2bedff7ba', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq nə zaman növbədənkənar sessiyanın işi bitir?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəlikdəki məsələlərə baxılmaq zərurətinin yaranmadığı hallarda növbədənkənar sessiyanın işi bitir", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəlikdəki məsələlərin bir qisminə baxıldıqdan sonra növbədənkənar sessiyanın işi bitir", "Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəlikdəki məsələlərə baxıldıqdan sonra növbədənkənar sessiyanın işi bitir", "Azərbaycan Respublikası Milli Məclisinin yaz və payız sessiyasının gündəlikdəki məsələlərə baxıldıqdan sonra növbədənkənar sessiyanın işi bitir"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin növbədənkənar sessiyasının gündəlikdəki məsələlərə baxıldıqdan sonra növbədənkənar sessiyanın işi bitir', 'AR Konstitusiyası Maddə 88 (Milli Məclisin sessiyaları) — Düzgün cavab C variantıdır. Milli Məclis hər il iki növbəti yaz (1 fevral - 31 may) və payız (30 sentyabr - 30 dekabr) sessiyalarına yığılır. Növbədənkənar sessiyanı Prezidentin və ya 42 deputatın tələbi ilə MM Sədri çağırır. İclaslar açıqdır (83 deputatın tələbi və ya Prezidentin təklifi ilə qapalı keçirilə bilər).', 41, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 2/2: Maddə 94-98-1)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '24bdb4e5-eb9b-483b-84e8-6025c6779990', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 2/2: Maddə 94-98-1)', 'MM-in müəyyən etdiyi ümumi qaydalar (Maddə 94), MM-in həll etdiyi məsələlər (Maddə 95), qanunvericilik təşəbbüsü və MM-in buraxılması.',
    'Hüquq', 'hard', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3b4b1c56-6302-4f53-a28a-1500f96eff11', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '014de31f-01e2-4704-bb61-49c84f449b8c', 'Azərbaycan Respublikası Milli Məclisinin müzakirəsinə verilən qanun və ya qərar layihələri hansı şəkildə müzakirəyə çıxarılır və səsə qoyulur?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin müzakirəsinə verilən qanun və ya qərar layihələri Azərbaycan Respublikası Milli Məclisinin müvafiq komitəsində baxıldıqdan sonra müzakirəyə çıxarılır və səsə qoyulur", "Azərbaycan Respublikası Milli Məclisinin müzakirəsinə verilən qanun və ya qərar layihələri müzakirəyə təqdim olunmuş şəkildə müzakirəyə çıxarılır və səsə qoyulur", "Azərbaycan Respublikası Milli Məclisinin müzakirəsinə verilən qanun və ya qərar layihələri qeyri-hökumət təşkilatlarının rəyi əsasında müzakirəyə çıxarılır və səsə qoyulur", "Azərbaycan Respublikası Milli Məclisinin müzakirəsinə verilən qanun və ya qərar layihələri Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi əsasında müzakirəyə çıxarılır və səsə qoyulur"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin müzakirəsinə verilən qanun və ya qərar layihələri müzakirəyə təqdim olunmuş şəkildə müzakirəyə çıxarılır və səsə qoyulur', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab B variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 0, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a0d9a8f4-4832-4b1a-9657-5b76ff72fea5', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '02fa9384-e709-4f69-bac4-07580049b0d5', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü hüququ nədir?', 'multiple_choice',
    '["Qanun layihələrini və başqa məsələləri Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim etmək hüququdur", "Qanun layihələrini və başqa məsələləri Azərbaycan Respublikası Konstitusiya Məhkəməsinin müzakirəsinə təqdim etmək hüququdur", "Qanun layihələrini və başqa məsələləri Azərbaycan Respublikası Ali Məhkəməsinin müzakirəsinə təqdim etmək hüququdur", "Qanun layihələrini və başqa məsələləri Azərbaycan Respublikası Prezidentin müzakirəsinə təqdim etmək hüququ"]'::jsonb, 'Qanun layihələrini və başqa məsələləri Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim etmək hüququdur', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab A variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '604b891a-44c3-468e-999f-b7ff8c5c8b3a', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '05d69f21-202c-4407-a4ec-da6d2de0dbfb', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı məsələlərdən hansıların həlli Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aiddir?
1) təhlükəsizliyin əsasları
2) Azərbaycan Respublikasının Milli Məclisinə seçkilər və Azərbaycan Respublikası Milli Məclisinin deputatlarının statusu
3) Azərbaycan Respublikası Prezidentinin seçkiləri
4) Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikası diplomatik nümayəndəliklərinin təsis edilməsi
5) dövlətlərarası müqavilələrin təsdiq və ləğv edilməsi
6) Azərbaycan Respublikası Prezidentinin müraciətinə əsasən müharibə elan edilməsinə və sülh bağlanmasına razılıq verilməsi
7) bələdiyyələrə seçkilər və bələdiyyələrin statusu
8) Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikası dövlət büdcəsinin təsdiq edilməsi və onun icrasına nəzarət', 'multiple_choice',
    '["1,2,5,6", "2,4,6,8", "2,3,5,7", "4,5,6,8"]'::jsonb, '4,5,6,8', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab D variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 2, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f82cdace-8255-428d-b71e-10dbc6a6e3dc', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '110e09ef-ac02-4434-94a6-ac52d8ad169e', 'Azərbaycan Respublikası Milli Məclisində qanunvericilik təşəbbüsü hüququ kimlərə məxsus deyildir?
1. Azərbaycan Respublikasının 40 min vətəndaşına
2. Azərbaycan Respublikası Apelyasiya Məhkəməsinə
3. Azərbaycan Respublikası Prokurorluğuna
4. Azərbaycan Respublikası mərkəzi icra hakimiyyəti orqanlarının rəhbərlərinə
5. Naxçıvan Muxtar Respublikasının Ali Məclisinə', 'multiple_choice',
    '["1,2,3", "3,4,5", "1,2,4", "2,4,5"]'::jsonb, '1,2,4', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 3, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c5e5757a-1498-4b99-b680-60de2b107c87', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '17e9b832-063c-4b57-a56a-9ff4061efc39', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin səlahiyyətinə aşağıdakı məsələlərin həlli aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikasının Nazirlər Kabinetinə etimad məsələsinin həll edilməsi;", "Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyəti üzvlərinin vəzifəyə təyin və vəzifədən azad edilməsi;", "Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Silahlı Qüvvələrinin təyinatı ilə bağlı olmayan vəzifələrin icrasına cəlb edilməsinə razılıq verilməsi;", "xarici dövlətlərin diplomatik nümayəndələrinin etimadnamə və övdətnamələrini qəbul edilməsi"]'::jsonb, 'xarici dövlətlərin diplomatik nümayəndələrinin etimadnamə və övdətnamələrini qəbul edilməsi', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 4, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8289b6d6-6c64-4dc3-ba9e-ce9b7ae5115e', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '1e236550-74ff-4c70-8bee-c28c026a80e7', 'Azərbaycan Respublikasının Konstitusiyasına əsasən qanun və Milli Məclisin qərarı nə zamandan qüvvəyə minir?', 'multiple_choice',
    '["Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar imzalandığı gündən qüvvəyə minir.", "Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən sonrakı gün qüvvəyə minir.", "Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən sonrakı iş günü qüvvəyə minir.", "Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən qüvvəyə minir."]'::jsonb, 'Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən qüvvəyə minir.', 'AR Konstitusiyası Maddə 98 (Qanunların və Milli Məclisin qərarlarının qüvvəyə minməsi) — Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən qüvvəyə minir.', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3a97c7da-37b6-4483-93b6-e670eafbfbe9', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '2178bf5e-744f-42c0-b086-c17e40cfc8c4', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi aşağıdakı məsələlərə dair ümumi qaydalar müəyyən edir?
1) fiziki və hüquqi şəxslərin statusu
2) referendum təyin edilməsi
3) dövlətlərarası müqavilələrin təsdiq və ləğv edilməsi
4) beynəlxalq müqavilələrin təsdiqi və ləğvi
5) dövlət qulluğu
6) Azərbaycan Respublikası Milli Məclisinin işinin təşkili
7) amnistiya
8) Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının hərbi doktrinasının təsdiqi', 'multiple_choice',
    '["1,2,4,7", "2,3,6,8", "1,4,5", "1,2,4,5"]'::jsonb, '1,4,5', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 6, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f74958fe-d832-4754-b0d1-cae8f573881a', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '2538189e-6001-4acf-ab5d-b5930c7639df', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi səlahiyyətlərinə aid məsələlərdən hansıların həllinə dair qərarlar qəbul edir?
1) Azərbaycan Respublikasının Nazirlər Kabinetinə etimad məsələsinin həll edilməsi
2) Azərbaycan Respublikası Prezidentinin seçkiləri
3) fiziki və hüquqi şəxslərin statusu
4) referendum təyin edilməsi
5) məhkəmə icraatı, məhkəmə qərarlarının icrası
6) Azərbaycan Respublikasının Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının hərbi doktrinasının təsdiqi
7) Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikası diplomatik nümayəndəliklərinin təsis edilməsi', 'multiple_choice',
    '["2,4,6,7", "1,4,6", "1,2,4,6,7", "2,3,5"]'::jsonb, '1,4,6', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab B variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 7, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '12ea4ce1-0a71-44e3-954d-3aa36e63f4d8', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '26aaa507-9534-4682-a073-d9ca616e1a7e', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq “bu Konstitusiyada nəzərdə tutulmuş hallarda Azərbaycan Respublikası Prezidentinin fərmanlarının təsdiqi” -- Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi:', 'multiple_choice',
    '["Ümumi Qayda, 83 səs çoxluğu ilə qanun", "Ümumi Qayda, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qərar"]'::jsonb, 'Məsələ, 63 səs çoxluğu ilə qərar', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab D variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 8, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5d105838-5a71-4cc8-897c-286dd7785c7f', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '2be4db8b-85a3-4bf3-a5a1-7c9897f86d06', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Qanun və ya qərar layihəsini Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının Prokurorluğu və ya Naxçıvan Muxtar Respublikasının Ali Məclisi təcili elan edibsə, bu müddət iki ay təşkil edir.", "Qanun və ya qərar layihəsini Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının Prokurorluğu və ya Naxçıvan Muxtar Respublikasının Ali Məclisi təcili elan edibsə, bu müddət 14 gün təşkil edir.", "Qanun və ya qərar layihəsini Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının Prokurorluğu və ya Naxçıvan Muxtar Respublikasının Ali Məclisi təcili elan edibsə, bu müddət 56 gün təşkil edir.", "Qanun və ya qərar layihəsini Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının Prokurorluğu və ya Naxçıvan Muxtar Respublikasının Ali Məclisi təcili elan edibsə, bu müddət 20 gün təşkil edir."]'::jsonb, 'Qanun və ya qərar layihəsini Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının Prokurorluğu və ya Naxçıvan Muxtar Respublikasının Ali Məclisi təcili elan edibsə, bu müddət 20 gün təşkil edir.', 'AR Konstitusiyası Maddə 96 (Qanunvericilik təşəbbüsü hüququ) — Qanunvericilik təşəbbüsü hüququ MM deputatlarına, AR Prezidentinə, Ali Məhkəməyə, Baş Prokurorluğa, Naxçıvan MR Ali Məclisinə və 40 min seçici vətəndaşa mənsubdur.', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c8c2515e-a240-4195-a030-a1fa3a69bc88', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '48b46361-54da-4acf-a6e1-fc37f745829e', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı məsələlərdən hansıların həlli Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid deyil?
1) inzibati ərazi bölgüsü
2) referendum
3) məhkəmə quruluşu
4) Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının hərbi doktrinasının təsdiqi
5) beynəlxalq müqavilələrin təsdiqi və ləğvi
6) amnistiya
7) bələdiyyələrin statusu
8) Azərbaycan Respublikası Milli Məclisinin işinin təşkili', 'multiple_choice',
    '["1,4,5,6", "2,5,7,8", "2,3,5,7", "2,3,7,8"]'::jsonb, '2,3,5,7', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 10, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cd2650d3-d7f9-4441-be28-7fec3b352681', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '4a458bd1-0999-4cc6-b96b-1d1ab6414214', 'Azərbaycan Respublikası Konstitusiyasına əsasən hansı halda Azərbaycan Respublikası Prezidenti Azərbaycan Respublikası Milli Məclisini buraxa bilər?
1. Qəbul olunmuş qanunlar imzalanmaq üçün Azərbaycan Respublikası Prezidentinə təqdim olunmadıqda
2. Qanunvericilik təşəbbüsü ilə təqdim olunmuş aktlar müzakirəyə çıxarılmadıqda
3. Təqdim olumuş qanunvericilik aktlarının layihələri geri çağrıldıqda
4. Azərbaycan Respublikası Milli Məclisinin deputatı iş yerini dəyişdikdə', 'multiple_choice',
    '["1,2", "1,3", "3,4", "2,4"]'::jsonb, '1,2', 'AR Konstitusiyası Maddə 98-1 (Milli Məclisin buraxılması) — Düzgün cavab A variantıdır. Eyni çağırış MM bir il ərzində iki dəfə NK-ya etimadsızlıq göstərdikdə və ya vəzifələrini icra etmədikdə AR Prezidenti tərəfindən buraxıla bilər (2016).', 11, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2956fb06-2f04-4733-a863-ebeae5cd0717', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '4faa193d-7305-44e1-91ad-1c1f25376a3d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin səlahiyyətinə aşağıdakı məsələlərin həlli aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin işinin təşkili;", "Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikası diplomatik nümayəndəliklərinin təsis edilməsi;", "Azərbaycan Respublikasının xarici ölkələrdə və beynəlxalq təşkilatlarda diplomatik nümayəndələrini təyin edilməsi və geri çağrılması", "Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası dövlət büdcəsinin təsdiq edilməsi və onun icrasına nəzarət;"]'::jsonb, 'Azərbaycan Respublikasının xarici ölkələrdə və beynəlxalq təşkilatlarda diplomatik nümayəndələrini təyin edilməsi və geri çağrılması', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 12, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7927db10-0174-4557-a44b-8924d49a3813', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '54449ecb-09a4-4499-9ce4-da8cc8f3f21f', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq “bu Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarından və azadlıqlarından istifadə, bu hüquqların və azadlıqların dövlət təminatı” -- Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi:', 'multiple_choice',
    '["Ümumi Qayda, 83 səs çoxluğu ilə qanun", "Ümumi Qayda, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qərar"]'::jsonb, 'Ümumi Qayda, 63 səs çoxluğu ilə qanun', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab B variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 13, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '72658c50-8157-4e28-babd-370f9eb70d2d', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '544755b0-0d16-427b-afb0-036f6b8feb58', 'Azərbaycan Respublikasının Konstitusiyasında yalnız hansı məsələyə dair qərarın Azərbaycan Respublikasının Milli Məclisi tərəfindən 95 səs çoxluğu ilə qəbul edilməsi qaydası nəzərdə tutulmuşdur?', 'multiple_choice',
    '["Referendum təyin edilməsi;", "Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması;", "Amnistiya;", "Beynəlxalq müqavilələrin təsdiqi və ləğvi."]'::jsonb, 'Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması;', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab B variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 14, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e62bdec5-4b7d-4f64-bb95-d07bac2fe333', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '580cb7c1-699e-453f-8c38-4da7017d142d', 'Azərbaycan Respublikası Milli Məclisində qanunvericilik təşəbbüsü hüququ kimlərə məxsusdur?
1. Azərbaycan Respublikası Milli Məclisinin deputatlarına
2. Azərbaycan Respublikası Prezidentinə
3. Azərbaycan Respublikası ədliyyə nazirinə
4. Yerli özünü idarəetmə orqanlarının sədrlərinə
5. Azərbaycan Respublikası Ali Məhkəməsinə', 'multiple_choice',
    '["1,2,5", "3,4,5", "1,3,5", "1,2,4"]'::jsonb, '1,2,5', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab A variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 15, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2ded8760-9ff4-41b5-a55c-02465d35bc9c', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '5e09a79f-cab1-497a-bb2a-fbf589578cd6', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq “inzibati ərazi bölgüsü” -- Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi:', 'multiple_choice',
    '["Ümumi Qayda, 83 səs çoxluğu ilə qanun", "Ümumi Qayda, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qərar"]'::jsonb, 'Məsələ, 63 səs çoxluğu ilə qanun', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 16, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4a1a2687-b621-4ac8-aa2e-69b01392d994', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '5e88b60f-3a18-48b7-b7d3-a661183a0e4f', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi ümumi qaydalar müəyyən edərkən hansı aktı qəbul edir?', 'multiple_choice',
    '["Qanun", "Qərar", "Qanun və qərar", "Fərman"]'::jsonb, 'Qanun', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab A variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 17, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f1e15688-b4f0-4242-9aab-d7ff7f6ff34e', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '6017f949-e87f-45e0-a211-c55cc500665c', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq “müdafiə və hərbi qulluq”-- Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi:', 'multiple_choice',
    '["Ümumi Qayda, 83 səs çoxluğu ilə qanun", "Ümumi Qayda, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qərar"]'::jsonb, 'Ümumi Qayda, 63 səs çoxluğu ilə qanun', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab B variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 18, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5621cba5-6096-468b-b3e8-c4361e11eb23', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '605e11d4-3189-4fc9-905a-b07a1be7f46c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən qanunlar qəbul edildiyi gündən neçə gün müddətində Azərbaycan Respublikası Prezidentinə imzalanmaq üçün təqdim edilir?', 'multiple_choice',
    '["14", "24", "56", "60"]'::jsonb, '14', 'AR Konstitusiyası Maddə 97 və 98 (Qanunların təqdim edilməsi və qüvvəyə minməsi) — Düzgün cavab A variantıdır. Qanunlar 14 gün ərzində (təcili qanunlar 24 saat ərzində) Prezidentə təqdim olunur və dərc edildiyi gündən qüvvəyə minir.', 19, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '746c529b-993c-4b80-9d70-a5a676fc1101', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '6f12276c-9868-408f-ab7d-0579a63c1116', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi səlahiyyətlərinə aid məsələlərdən hansıların həllinə dair qərarlar qəbul edir?
1) referendum təyin edilməsi
2) Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Konstitusiya Məhkəməsi hakimlərinin təyin edilməsi
3) ailə münasibətləri
4) dövlətlərarası müqavilələrin ləğv edilməsi
5) amnistiya
6) inzibati ərazi bölgüsü
7) hərbi vəziyyət rejimi
8) Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikası dövlət büdcəsinin təsdiq edilməsi və onun icrasına nəzarət', 'multiple_choice',
    '["1,2,5,6", "1,2,3,8", "1,2,5", "4,6,7,8"]'::jsonb, '1,2,5', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 20, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '271ffe7c-c0fa-4b76-b813-816e6ff14242', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '6f69d98e-1b76-494a-9aeb-3a32ba9caa84', 'Azərbaycan Respublikasının Konstitusiyasına uyğun Azərbaycan Respublikasının Milli Məclisi aşağıdakı məsələlərdən hansılara dair ümumi qaydalar müəyyən edərkən 83 səs çoxluğu ilə qanunlar qəbul edir?
1) bələdiyyələrə seçkilər və bələdiyyələrin statusu
2) referendum
3) Azərbaycan Respublikası Milli Məclisinin işinin təşkili
4) dövlətlərarası müqavilələrin təsdiq və ləğv edilməsi
5) Azərbaycan Respublikası Milli Məclisinin deputatlarının statusu
6) məhkəmə quruluşu və hakimlərin statusu
7) Azərbaycan Respublikası Prezidentinin seçkiləri', 'multiple_choice',
    '["1,3,5", "1,4,7", "2,3,7", "2,5,7"]'::jsonb, '2,5,7', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab D variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 21, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0d7ea0f0-f5a7-4dcb-9b95-7db3e23c6b6e', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '71917d07-e1d0-4b31-831d-51333a1b00b7', '“Dövlət qulluğu haqqında” AR Qanununa əsasən dövlət qulluqçusunun and içmə qaydası ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar imzalandığı gündən qüvvəyə minir.", "Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən sonrakı gün qüvvəyə minir.", "Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən sonrakı iş günü qüvvəyə minir.", "Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən qüvvəyə minir."]'::jsonb, 'Qanunun və Azərbaycan Respublikası Milli Məclisinin qərarının özündə başqa qayda nəzərdə tutulmayıbsa, qanun və qərar dərc edildiyi gündən qüvvəyə minir.', 'AR Konstitusiyası Maddə 97 və 98 (Qanunların təqdim edilməsi və qüvvəyə minməsi) — Qanunlar 14 gün ərzində (təcili qanunlar 24 saat ərzində) Prezidentə təqdim olunur və dərc edildiyi gündən qüvvəyə minir.', 22, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1b6092b7-f4d2-4a82-b691-05db19600d3e', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '763c3526-0a6e-4e91-b5e6-9291faa78238', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi aşağıdakı məsələlərdən hansılara dair ümumi qaydalar müəyyən edərkən 63 səs çoxluğu ilə qanunlar qəbul edir?
1) fövqəladə vəziyyət rejimi
2) referendum
3) inzibati ərazi bölgüsü
4) mülki hüquq obyektləri
5) amnistiya
6) dövlət sərhədi rejimi
7) dövlətlərarasi müqavilələrin təsdiq və ləğv edilməsi', 'multiple_choice',
    '["1,3,5", "1,4,6", "1,4,7", "2,4,7"]'::jsonb, '1,4,6', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab B variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 23, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '434ac755-d3af-4be0-b63b-bf87b6016632', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '77c60d7a-ea24-4eb4-8cf3-a19303225d6e', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin səlahiyyətinə aşağıdakı məsələlərin həlli aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Konstitusiya Məhkəməsi, Azərbaycan Respublikası Ali Məhkəməsi və Azərbaycan Respublikası apellyasiya məhkəmələri hakimlərinin təyin edilməsi;", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin təqdimatına əsasən Azərbaycan Respublikası Prezidentinin impiçment qaydasında vəzifədən kənarlaşdırılması;", "Azərbaycan Respublikası Prezidentinin təqdimatına əsasən hakimlərin vəzifədən kənarlaşdırılması;", "Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyətinin üzvləri sırasından Azərbaycan Respublikası Mərkəzi Bankının sədrinin təyin edilməsi"]'::jsonb, 'Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyətinin üzvləri sırasından Azərbaycan Respublikası Mərkəzi Bankının sədrinin təyin edilməsi', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 24, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '95be1acd-6cad-4c30-aec2-fed02465b740', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '81dfc8b4-52b7-4792-9e51-915746b461e6', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı hallarda Qanunlarda və Azərbaycan Respublikası Milli Məclisinin qərarlarında icra hakimiyyəti və məhkəmə orqanlarına konkret tapşırıqlar nəzərdə tutula bilər?', 'multiple_choice',
    '["Qanunlarda və Azərbaycan Respublikası Milli Məclisinin qərarlarında icra hakimiyyəti və məhkəmə orqanlarına konkret tapşırıqlar Konstitusiya ilə nəzərdə tutulmuş hallarda nəzərdə tutula bilər", "Qanunlarda və Azərbaycan Respublikası Milli Məclisinin qərarlarında icra hakimiyyəti və məhkəmə orqanlarına konkret tapşırıqlar qanunla nəzərdə tutulmuş hallarda nəzərdə tutula bilər", "Qanunlarda və Azərbaycan Respublikası Milli Məclisinin qərarlarında icra hakimiyyəti və məhkəmə orqanlarına konkret tapşırıqlar bütün hallarda nəzərdə tutula bilər", "Qanunlarda və Azərbaycan Respublikası Milli Məclisinin qərarlarında icra hakimiyyəti və məhkəmə orqanlarına konkret tapşırıqlar nəzərdə tutula bilməz."]'::jsonb, 'Qanunlarda və Azərbaycan Respublikası Milli Məclisinin qərarlarında icra hakimiyyəti və məhkəmə orqanlarına konkret tapşırıqlar nəzərdə tutula bilməz.', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab D variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 25, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '46b8e620-b77c-4526-848b-3a70cd0e7e3d', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '88a6dbda-cc9b-4bda-b962-014afc26b26d', 'Milli Məclisin müzakirəsinə verilmiş qanun və ya qərar lahiyələrində dəyişikliklər edilə bilər:', 'multiple_choice',
    '["Milli Məclisin müzakirəsinə verilmiş qanun və ya qərar lahiyələrində dəyişikliklər qanunvericilik təşəbbüsü hüququndan istifadə edən subyektin razılığı ilə edilə bilər", "Milli Məclisin müzakirəsinə verilmiş qanun və ya qərar lahiyələrində dəyişikliklər yalnız Konstitusiya Məhkəməsinin razılığı ilə edilə bilər", "Milli Məclisin müzakirəsinə verilmiş qanun və ya qərar lahiyələrində dəyişikliklər Nazirlər Kabinetinin razılığı ilə edilə bilər", "Milli Məclisin müzakirəsinə verilmiş qanun və ya qərar lahiyələrində dəyişikliklər yalnız Ombudsmanın razılığı ilə edilə bilər"]'::jsonb, 'Milli Məclisin müzakirəsinə verilmiş qanun və ya qərar lahiyələrində dəyişikliklər qanunvericilik təşəbbüsü hüququndan istifadə edən subyektin razılığı ilə edilə bilər', 'AR Konstitusiyası Maddə 96 (Qanunvericilik təşəbbüsü hüququ) — Düzgün cavab A variantıdır. Qanunvericilik təşəbbüsü hüququ MM deputatlarına, AR Prezidentinə, Ali Məhkəməyə, Baş Prokurorluğa, Naxçıvan MR Ali Məclisinə və 40 min seçici vətəndaşa mənsubdur.', 26, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '05c4e934-783f-44ec-bbce-9cfd124617db', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '8af8d148-f92a-409b-b3a4-97ce7d982518', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Bu Konstitusiyada Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid edilən digər məsələlərə, Azərbaycan Respublikası Milli Məclisinin işinin təşkili ilə əlaqədar məsələlərə, Azərbaycan Respublikası Milli Məclisinin münasibətinin bildirilməsi zəruri olan məsələlərə dair də qanunlar qəbul edilir.", "Bu Konstitusiyada Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid edilən digər məsələlərə, Azərbaycan Respublikası Milli Məclisinin işinin təşkili ilə əlaqədar məsələlərə, Azərbaycan Respublikası Milli Məclisinin münasibətinin bildirilməsi zəruri olan məsələlərə dair də sərəncamlar qəbul edilir.", "Bu Konstitusiyada Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid edilən digər məsələlərə, Azərbaycan Respublikası Milli Məclisinin işinin təşkili ilə əlaqədar məsələlərə, Azərbaycan Respublikası Milli Məclisinin münasibətinin bildirilməsi zəruri olan məsələlərə dair də Konstitusiya qanunları qəbul edilir.", "Bu Konstitusiyada Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid edilən digər məsələlərə, Azərbaycan Respublikası Milli Məclisinin işinin təşkili ilə əlaqədar məsələlərə, Azərbaycan Respublikası Milli Məclisinin münasibətinin bildirilməsi zəruri olan məsələlərə dair də qərarlar qəbul edilir."]'::jsonb, 'Bu Konstitusiyada Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid edilən digər məsələlərə, Azərbaycan Respublikası Milli Məclisinin işinin təşkili ilə əlaqədar məsələlərə, Azərbaycan Respublikası Milli Məclisinin münasibətinin bildirilməsi zəruri olan məsələlərə dair də qərarlar qəbul edilir.', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 27, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c060b0a8-e87f-4f75-8a36-86a0a2bf4a0c', '24bdb4e5-eb9b-483b-84e8-6025c6779990', '9f5cf84a-3b50-46d0-8414-c7f9b230d5f2', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı məsələlərdən hansıların həlli Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aid deyil?
1) təhlükəsizliyin əsasları
2) Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyəti üzvlərinin vəzifəyə təyin və vəzifədən azad edilməsi
3) Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Baş Prokurorunun vəzifəyə təyin və vəzifədən azad edilməsinə razılıq verilməsi
4) mülkiyyət hüququ, o cümlədən dövlət, xüsusi və bələdiyyə mülkiyyətinin hüquqi rejimi
5) Azərbaycan Respublikasının Milli Məclisinə seçkilər və Azərbaycan Respublikası Milli Məclisinin deputatlarının statusu
6) referendum təyin edilməsi
7) Azərbaycan Respublikası Milli Məclisinin işinin təşkili', 'multiple_choice',
    '["1,4,5", "2,4,5", "3,5,6,7", "4,5,6,7"]'::jsonb, '1,4,5', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab A variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 28, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e702ee59-473e-48dd-87f7-d928203b71e4', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'aff51444-2c63-46e8-9cf7-2a5bd1d32f52', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi məsələ üzrə razılıq verir:
1. Azərbaycan Respublikası Prezidentinin təqdimatına uyğun olaraq Azərbaycan Respublikasının Baş nazirinin vəzifəyə təyin edilməsinə
2. Azərbaycan Respublikası Prezidentinin təqdimatına uyğun olaraq Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyəti üzvlərinin vəzifəyə təyin və vəzifədən azad edilməsinə
3. Azərbaycan Respublikası Prezidentinin təqdimatına uyğun olaraq Azərbaycan Respublikası Silahlı Qüvvələrinin təyinatı ilə bağlı olmayan vəzifələrin icrasına cəlb edilməsinə
4. Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının İnsan hüquqları üzrə müvəkkilinin seçilməsinə
5. Azərbaycan Respublikası Prezidentinin müraciətinə uyğun olaraq müharibə elan edilməsinə və sülh bağlanmasına
6. Azərbaycan Respublikasının Prezidentinin təqdimatına uyğun olaraq Azərbaycan Respublikası Baş prokurorunun vəzifəyə təyin və vəzifədən azad edilməsinə', 'multiple_choice',
    '["1,2,3,4", "1,4,5,6", "1,3,5,6", "1,2,3,4,5,6"]'::jsonb, '1,3,5,6', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 29, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9edb0587-501c-4baa-9a78-750e5e2f27c0', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'b0e1cc67-a481-4ab1-9cc1-037a7f3edf9c', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı məsələlərdən hansıların həlli Azərbaycan Respublikası Milli Məclisinin səlahiyyətlərinə aiddir?
1) Azərbaycan Respublikasının Prezidentinin təqdimatına əsasən hakimlərin vəzifədən kənarlaşdırılması
2) Konstitusiyada təsbit edilmiş insan və vətəndaş hüquqlarından və azadlıqlarından istifadə, bu hüquqların və azadlıqların dövlət təminatı
3) cinayətlərin və başqa hüquq pozuntularının müəyyən edilməsi, onların törədilməsinə görə məsuliyyətin təyin edilməsi
4) dövlətlərarası müqavilələrin təsdiq və ləğv edilməsi
5) Azərbaycan Respublikasının Milli Məclisinə seçkilər
6) məhkəmə quruluşu və hakimlərin statusu; prokurorluq; vəkillik və notariat
7) Azərbaycan Respublikası Milli Məclisinin işinin təşkili
8) Azərbaycan Respublikasının Nazirlər Kabinetinə etimad məsələsinin həll edilməsi', 'multiple_choice',
    '["1,4,7,8", "2,5,6,7", "2,3,5,6", "1,4,5,7"]'::jsonb, '1,4,7,8', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab A variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 30, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4c1913d9-e772-4696-be3e-e42809c5ac64', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'b21841c9-0a12-40b9-981d-005600f91b96', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq “beynəlxalq müqavilələrin təsdiqi və ləğvi” -- Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi:', 'multiple_choice',
    '["Ümumi Qayda, 83 səs çoxluğu ilə qanun", "Ümumi Qayda, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qanun", "Məsələ, 63 səs çoxluğu ilə qərar"]'::jsonb, 'Ümumi Qayda, 63 səs çoxluğu ilə qanun', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab B variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 31, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '39c06c8b-2393-40fa-addf-face275161e5', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'bebb46e0-531d-4073-92e7-47893c6c43be', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı subyektlər qanunvericilik təşəbbüsü hüququndan istifadə edərək qanun və qərar layihələrini təcili elan edə bilməzlər?
1. Azərbaycan Respublikası Milli Məclisinin deputatları
2. Azərbaycan Respublikası Prezidenti
3. Azərbaycan Respublikası Ali Məhkəməsi
4. Azərbaycan Respublikasının seçki hüququ olan 40 min vətəndaşı
5. Azərbaycan Respublikası Prokurorluğu
6. Naxçıvan Muxtar Respublikasının Ali Məclisinə', 'multiple_choice',
    '["2,5", "1,4", "3,6", "1,5"]'::jsonb, '1,4', 'AR Konstitusiyası Maddə 96 (Qanunvericilik təşəbbüsü hüququ) — Düzgün cavab B variantıdır. Qanunvericilik təşəbbüsü hüququ MM deputatlarına, AR Prezidentinə, Ali Məhkəməyə, Baş Prokurorluğa, Naxçıvan MR Ali Məclisinə və 40 min seçici vətəndaşa mənsubdur.', 32, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4dcc72c3-a1a3-4bf2-b5c1-1b0fd28fc6d2', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'c5ccac4b-16fa-4bf0-af6c-e8c617b4eddd', 'Azərbaycan Respublikasının Konstitusiyasına əsasən qanunvericilik təşəbbüsü hüququna aiddir', 'multiple_choice',
    '["Qanun və qərar layihələri əsaslandırılmalı və onların qəbul edilməsinin səbəbləri göstərilməlidir.", "Qanun və qərar layihələri əsaslandırılmalı və onların qəbul edilməsinin məqsədləri göstərilməlidir", "Qanun və qərar layihələri əsaslandırılmalı və onların qəbul edilməsinin mahiyyəti göstərilməlidir", "Qanun və qərar layihələri əsaslandırılmalı və onların qəbul edilməsinin vəziyyətləri göstərilməlidir"]'::jsonb, 'Qanun və qərar layihələri əsaslandırılmalı və onların qəbul edilməsinin məqsədləri göstərilməlidir', 'AR Konstitusiyası Maddə 96 (Qanunvericilik təşəbbüsü hüququ) — Düzgün cavab B variantıdır. Qanunvericilik təşəbbüsü hüququ MM deputatlarına, AR Prezidentinə, Ali Məhkəməyə, Baş Prokurorluğa, Naxçıvan MR Ali Məclisinə və 40 min seçici vətəndaşa mənsubdur.', 33, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd7f137e2-8c25-4afd-a60b-5767a3eac9d8', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'ccefc20f-7c4f-4b8f-9c1a-f18d5738f9ec', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü qaydasında təqdim edilən qanun və ya qərar layihələri hansı müddətdə səsə qoyulur?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü qaydasında təqdim edilən qanun və ya qərar layihələri bir ay ərzində səsə qoyulur", "Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü qaydasında təqdim edilən qanun və ya qərar layihələri iki ay ərzində səsə qoyulur", "Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü qaydasında təqdim edilən qanun və ya qərar layihələri üç ay ərzində səsə qoyulur", "Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü qaydasında təqdim edilən qanun və ya qərar layihələri altı ay ərzində səsə qoyulur"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq qanunvericilik təşəbbüsü qaydasında təqdim edilən qanun və ya qərar layihələri iki ay ərzində səsə qoyulur', 'AR Konstitusiyası Maddə 96 (Qanunvericilik təşəbbüsü hüququ) — Düzgün cavab B variantıdır. Qanunvericilik təşəbbüsü hüququ MM deputatlarına, AR Prezidentinə, Ali Məhkəməyə, Baş Prokurorluğa, Naxçıvan MR Ali Məclisinə və 40 min seçici vətəndaşa mənsubdur.', 34, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '77749d93-4911-4791-8de5-e31c6fe0b976', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'da32bb11-8762-4e6b-ac8b-2e589b913ca3', 'Azərbaycan Respublikasının Konstitusiyasına əsasən təcili elan olunan qanun layihəsi Azərbaycan Respublikası nın Prezidentinə imzalanmaq üçün qəbul edildiyi gündən neçə saat ərzində təqdim edilir?', 'multiple_choice',
    '["12", "24", "36", "72"]'::jsonb, '24', 'AR Konstitusiyası Maddə 97 və 98 (Qanunların təqdim edilməsi və qüvvəyə minməsi) — Düzgün cavab B variantıdır. Qanunlar 14 gün ərzində (təcili qanunlar 24 saat ərzində) Prezidentə təqdim olunur və dərc edildiyi gündən qüvvəyə minir.', 35, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '21b957f1-f704-4f16-989e-e7381bbfb890', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'dfb679a2-90e0-4100-a907-d8a5592450b6', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin səlahiyyətinə aşağıdakı məsələlərin həlli aid deyil', 'multiple_choice',
    '["dövlətlərarası və Azərbaycan Respublikasının qanunlarından fərqli qaydalar nəzərdə tutan hökumətlərarası müqavilələrin təsdiq və ləğv edilməsi;", "Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının İnsan hüquqları üzrə müvəkkilinin seçilməsi;", "Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının hərbi doktrinasının təsdiqi;", "Azərbaycan Respublikası vətəndaşlarının müddətli hərbi xidmətdə çağırılması və müddətli hərbi xidmətdə olan hərbi qulluqçuların ehtiyata buraxılması barədə qərar qəbul edilməsi"]'::jsonb, 'Azərbaycan Respublikası vətəndaşlarının müddətli hərbi xidmətdə çağırılması və müddətli hərbi xidmətdə olan hərbi qulluqçuların ehtiyata buraxılması barədə qərar qəbul edilməsi', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab D variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 36, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '937fa12c-fa4d-4d11-bfb2-1a760d8b26c4', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'e0528622-4ec1-451a-a779-52b243d3c052', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi səlahiyyətlərinə aid məsələlərdən hansıların həllinə dair 63 səs çoxluğu ilə qanunlar qəbul edir?
1) referendum təyin edilməsi
2) Azərbaycan Respublikasının Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının hərbi doktrinasının təsdiqi
3) Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikası dövlət büdcəsinin təsdiq edilməsi və onun icrasına nəzarət
4) inzibati ərazi bölgüsü
5) məhkəmə quruluşu və hakimlərin statusu
6) Azərbaycan Respublikası Milli Məclisin işinin təşkili
7) əmək münasibətləri və sosial təminat
8) Azərbaycan Respublikası Milli Məclisinin deputatlarının statusu', 'multiple_choice',
    '["1,2,3,8", "1,3,4", "3,4,6", "2,3,4,8"]'::jsonb, '3,4,6', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab C variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 37, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '16ae33f7-a8cb-42d9-b1f3-f03011d506de', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'eb425d79-831e-4935-90b8-796a5641f0b3', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi aşağıdakı məsələlərə dair ümumi qaydalar müəyyən etmir', 'multiple_choice',
    '["təhlükəsizliyin əsasları;", "ərazi quruluşu; dövlət sərhədi rejimi;", "beynəlxalq müqavilələrin bağlanması", "rabitə və nəqliyyat işi;"]'::jsonb, 'beynəlxalq müqavilələrin bağlanması', 'AR Konstitusiyası Maddə 94 (Milli Məclisin müəyyən etdiyi ümumi qaydalar) — Düzgün cavab C variantıdır. Milli Məclis 27 sahə üzrə ümumi qaydalar müəyyən edir və Qanunlar qəbul edir (Konstitusiya qanunları 95 səslə, digər qanunlar 63 və ya 83 səslə qəbul olunur).', 38, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '67fd5fdb-615b-4675-9f58-51be334e474c', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'f75d8ea7-2234-4f18-89fc-a75f13b28bd0', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin səlahiyyətinə aşağıdakı məsələlərin həlli aid deyil', 'multiple_choice',
    '["bu Konstitusiyada nəzərdə tutulmuş hallarda Azərbaycan Respublikası Prezidentinin fərmanlarının təsdiqi;", "Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının Baş nazirinin vəzifəyə təyin edilməsinə razılıq verilməsi;", "Azərbaycan Respublikasının digər məhkəmələrinin hakimlərini vəzifəyə təyin edilməsi", "Azərbaycan Respublikasının Prezidentinin təqdimatına əsasən Azərbaycan Respublikası Baş prokurorunun vəzifəyə təyin və vəzifədən azad edilməsinə razılıq verilməsi;"]'::jsonb, 'Azərbaycan Respublikasının digər məhkəmələrinin hakimlərini vəzifəyə təyin edilməsi', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 39, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '755223c8-3d3e-4ecc-9408-05979bfbcede', '24bdb4e5-eb9b-483b-84e8-6025c6779990', 'fe066954-809d-4208-a86a-257fd1c70833', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq doğru variantı seçin', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasının 95-ci maddəsinin(Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi ümumi qaydalar) I hissəsinə Konstitusiya qanunu ilə əlavələr edilə bilər", "Azərbaycan Respublikasının Konstitusiyasının 95-ci maddəsinin(Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi ümumi qaydalar) II hissəsinə Konstitusiya qanunu ilə əlavələr edilə bilər", "Azərbaycan Respublikasının Konstitusiyasının 95-ci maddəsinin(Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi ümumi qaydalar) bütün hissələrinə Konstitusiya qanunu ilə əlavələr edilə bilər", "Azərbaycan Respublikasının Konstitusiyasının 95-ci maddəsinin(Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi ümumi qaydalar) III hissəsinə Konstitusiya qanunu ilə əlavələr edilə bilər"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasının 95-ci maddəsinin(Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi ümumi qaydalar) I hissəsinə Konstitusiya qanunu ilə əlavələr edilə bilər', 'AR Konstitusiyası Maddə 95 (Milli Məclisin həll etdiyi məsələlər) — Düzgün cavab A variantıdır. Milli Məclis 21 konkret məsələ üzrə Qərarlar qəbul edir (təyinatlar, etimad, dövlət büdcəsinin təsdiqi və icrasına nəzarət, beynəlxalq müqavilələrin təsdiqi/ləğvi və s.).', 40, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 5. İcra Hakimiyyəti — Prezident (Hissə 1/2: Maddə 99-109)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    'c50d01d5-9126-497e-bd1c-856cf5c616e8', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 5. İcra Hakimiyyəti — Prezident (Hissə 1/2: Maddə 99-109)', 'İcra hakimiyyətinin mənsubiyyəti, Prezident seçkiləri, And, İmpiçment və AR Prezidentinin müstəsna səlahiyyətləri (Maddə 109).',
    'Hüquq', 'hard', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a411afef-9ab7-4cd2-bbb4-25df986cc92a', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '041512d7-644a-4557-b4eb-6ae1219eefdc', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraqAzərbaycan Respublikasının Prezidenti seçilmiş şəxsin andı hansı formada həyata keçirilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti seçilmiş şəxs Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatın elan olunduğu gündən başlayaraq 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir", "Azərbaycan Respublikasının Prezidenti seçilmiş şəxs Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatın elan olunduğu gündən başlayaraq 3 iş gün sonra Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir", "Azərbaycan Respublikasının Prezidenti seçilmiş şəxs Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatın elan olunduğu gündən başlayaraq 3 gün ərzində Konstitusiya Məhkəməsi sədrinin iştirakı ilə and içir", "Azərbaycan Respublikasının Prezidenti seçilmiş şəxs Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatın elan olunduğu gündən sonra 3 iş gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti seçilmiş şəxs Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatın elan olunduğu gündən başlayaraq 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir', 'AR Konstitusiyası Maddə 103 (Prezidentin andı) — Düzgün cavab A variantıdır. Prezident seçkilərin yekunları elan olunduğu gündən 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir və and içdiyi gündən səlahiyyətlərinin icrasına başlayır.', 0, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8ba365b8-696d-46b5-96e8-e9ea28b274e5', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '1571baaf-2a23-4b37-8a1d-be1232013f86', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Prezidentinin səlahiyyətlərini Azərbaycan Respublikasının Baş nazirinin icra etməsi mümkün olmadıqda hansı subyekt icra edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti səlahiyyətlərini Azərbaycan Respublikasının Baş nazirinin müavini icra edir.", "Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Baş prokuroru icra edir.", "Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Xarici işlər naziri icra edir.", "Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Prezidentinin səlahiyyətlərini Azərbaycan Respublikası Milli Məclisinin sədri icra edir."]'::jsonb, 'Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Prezidentinin səlahiyyətlərini Azərbaycan Respublikası Milli Məclisinin sədri icra edir.', 'AR Konstitusiyası Maddə 103-1 və 105 (Vitse-prezidentlər və səlahiyyətlərin icrası) — Düzgün cavab D variantıdır. Prezident vaxtından əvvəl vəzifədən getdikdə onun səlahiyyətlərini Birinci vitse-prezident icra edir və 60 gün müddətində növbədənkənar Prezident seçkiləri keçirilir (2016).', 1, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8f7e5451-68ea-4102-afcc-cf418029e4ff', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '2017b7f6-d65d-4f6d-a1ed-ac8a9a9e2bab', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti istefa verdikdə onun istefa ərizəsi hansı orqana təqdim olunur?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsinə", "Azərbaycan Respublikasının Baş prokurorluğuna", "Azərbaycan Respublikasının Milli Məclisinin sədrinə", "Azərbaycan Respublikasının Baş nazirinə"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsinə', 'AR Konstitusiyası Maddə 104, 106 və 107 (Prezidentin statusu, vaxtından əvvəl xitam və impiçment) — Düzgün cavab A variantıdır. Prezidentin şəxsiyyəti toxunulmazdır. Ağır cinayət törətdikdə Konstitusiya Məhkəməsinin təşəbbüsü, Ali Məhkəmənin rəyi və MM-in 95 səs çoxluğu qərarı ilə vəzifədən kənarlaşdırılır.', 2, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '28d90810-cf01-4ec4-924f-ea5f7a7cdec2', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '230d1c3e-47a9-433f-a311-408661e13a94', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı müddətdə növbədənkənar Azərbaycan Respublikasının Prezidenti seçkiləri keçirilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti vaxtından əvvəl vəzifədən getdikdə 60 iş günü müddətində növbədənkənar Azərbaycan Respublikasının Prezidenti seçkiləri keçirilir", "Azərbaycan Respublikasının Prezidenti vaxtından əvvəl vəzifədən getdikdə 60 gün müddətində növbədənkənar Azərbaycan Respublikasının Prezidenti seçkiləri keçirilir", "Azərbaycan Respublikasının Prezidenti vaxtından əvvəl vəzifədən getdikdə 90 gün müddətində növbədənkənar Azərbaycan Respublikasının Prezidenti seçkiləri keçirilir", "Azərbaycan Respublikasının Prezidenti vaxtından əvvəl vəzifədən getdikdə 120 gün müddətində növbədənkənar Azərbaycan Respublikasının Prezidenti seçkiləri keçirilir"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti vaxtından əvvəl vəzifədən getdikdə 60 gün müddətində növbədənkənar Azərbaycan Respublikasının Prezidenti seçkiləri keçirilir', 'AR Konstitusiyası Maddə 103-1 və 105 (Vitse-prezidentlər və səlahiyyətlərin icrası) — Düzgün cavab B variantıdır. Prezident vaxtından əvvəl vəzifədən getdikdə onun səlahiyyətlərini Birinci vitse-prezident icra edir və 60 gün müddətində növbədənkənar Prezident seçkiləri keçirilir (2016).', 3, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ebaf6240-45c7-439e-9208-829f8a2af61f', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '28800362-af02-4701-9289-dc7cfaac93af', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Prezidentinin səlahiyyətlərini Azərbaycan Respublikası Milli Məclisinin sədrinin icra etməsi mümkün olmadıqda hansı subyekt icra edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikası Prezidentinin səlahiyyətlərinin başqa vəzifəli şəxs tərəfindən icrası haqqında qərar qəbul edir.", "Azərbaycan Respublikasının Konstitisiya Məhkəməsi Azərbaycan Respublikası Prezidentinin səlahiyyətlərinin başqa vəzifəli şəxs tərəfindən icrası haqqında qərar qəbul edir.", "Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikası Prezidentinin səlahiyyətlərinin başqa vəzifəli şəxs tərəfindən icrası haqqında qərar qəbul edir.", "Azərbaycan Respublikasının Baş prokuroru Azərbaycan Respublikası Prezidentinin səlahiyyətlərinin başqa vəzifəli şəxs tərəfindən icrası haqqında qərar qəbul edir."]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikası Prezidentinin səlahiyyətlərinin başqa vəzifəli şəxs tərəfindən icrası haqqında qərar qəbul edir.', 'AR Konstitusiyası Maddə 103-1 və 105 (Vitse-prezidentlər və səlahiyyətlərin icrası) — Düzgün cavab A variantıdır. Prezident vaxtından əvvəl vəzifədən getdikdə onun səlahiyyətlərini Birinci vitse-prezident icra edir və 60 gün müddətində növbədənkənar Prezident seçkiləri keçirilir (2016).', 4, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f69b2035-6977-4889-ba6a-1f354e8d183b', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '2fdf543e-36b8-44ad-a7a3-c821f7c2cb39', 'Hansı orqanların kollegial fəaliyyəti üçün zəruri olan sayda üzvlüyə namizədləri Azərbaycan Respublikasının Prezidenti tərəfindən iki dəfə təqdim edildikdən sonra, qanunla müəyyən edilmiş müddətdə təyin etmədikdə Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Milli Məclisini buraxır?
1. Azərbaycan Respublikası Konstitusiya Məhkəməsinin
2. Azərbaycan Respublikası Ali Məhkəməsinin
3. Azərbaycan Respublikası Apellyasiya Məhkəmələrinin
4. Azərbaycan Respublikası Korrupsiyaya qarşı Mübarizə Komsisiyyasının
5. Azərbaycan Respublikası Mərkəzi Bankının', 'multiple_choice',
    '["1,2.3", "1,3,5", "1,2,5", "1,4,5"]'::jsonb, '1,2,5', 'AR Konstitusiyası Maddə 99 və 100 (İcra hakimiyyəti və Prezidentliyə namizədlər) — Düzgün cavab C variantıdır. İcra hakimiyyəti AR Prezidentinə mənsubdur. 10 ildən artıq daimi yaşayan, ali təhsilli, ikili vətəndaşlığı olmayan AR vətəndaşı Prezident seçilə bilər (2016-cı ildə 35 yaş senzi ləğv edilmişdir).', 5, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9abfdace-9aae-4d5b-a6ed-fbff5d1de928', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '350fbd61-a64e-4152-9791-a42f682494a2', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Prezidentinin səhhətinə uyğun olaraq öz səlahiyyətlərini icra etmək qabiliyyətini tamamilə itirdiyi barədə məlumat verildikdə Azərbaycan Respublikasının Milli Məclisi bu faktın aydınlaşdırılması üçün hansı orqana müraciət edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Ali Məhkəməsinə", "Azərbaycan Respublikasının Apelyasiya Məhkəməsinə", "Azərbaycan Respublikasının Konstitusiya Məhkəməsinə", "Azərbaycan Respublikasının Baş prokuroruna"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsinə', 'AR Konstitusiyası Maddə 104, 106 və 107 (Prezidentin statusu, vaxtından əvvəl xitam və impiçment) — Düzgün cavab C variantıdır. Prezidentin şəxsiyyəti toxunulmazdır. Ağır cinayət törətdikdə Konstitusiya Məhkəməsinin təşəbbüsü, Ali Məhkəmənin rəyi və MM-in 95 səs çoxluğu qərarı ilə vəzifədən kənarlaşdırılır.', 6, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '305acf2c-f9b4-41b2-99f9-ad0a557a9f32', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '3d1637ff-288a-4884-a979-ceb4b53a8423', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səaliyyətlərinə aid deyil
1) referendum;
2) qanunları imzalayır və dərc edir və Hüquqi aktların dövlət reyestrindən keçirir
3) vətəndaşlıq məsələlərini həll edir;
4) siyasi sığınacaq verilməsi məsələlərini həll edir;
5) amnistiya və əfv edir
6) dövlət təltifləri ilə təltif edir;
7) ali hərbi və ali xüsusi rütbələr verir;', 'multiple_choice',
    '["3,4,6", "1,2,5", "3,5,6", "1,2,4"]'::jsonb, '1,2,5', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 7, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1b09d6fb-e53f-4749-9440-51fc408592f3', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '3e9010b6-b221-48e5-a54f-e4e18a21aef4', 'Azərbaycan Respublikası Prezidenti seçkilərinin əsaslarına aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə 7 il müddətinə seçilir", "Azərbaycan Respublikasının Prezidenti majoritar seçki sistemi, ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə 7 il müddətinə seçilir", "Azərbaycan Respublikasının Prezidenti ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, açıq, şəxsi və gizli səsvermə yolu ilə 7 il müddətinə seçilir", "Azərbaycan Respublikasının Prezidenti ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə 5 il müddətinə seçilir"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti ümumi, bərabər və birbaşa seçki hüququ əsasında sərbəst, şəxsi və gizli səsvermə yolu ilə 7 il müddətinə seçilir', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab A variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 8, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c0b5fac0-9f52-459e-9297-0d8625e6b3ac', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '43ecb4d3-34ea-4dab-9a3f-e9e8dd364e9a', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Nazirlər Kabinetinin istefası haqqında qəbul edir:', 'multiple_choice',
    '["Qərar", "Qanun", "Fərman", "Sərəncam"]'::jsonb, 'Qərar', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab A variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 9, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3ef6bd11-3cd2-4d7e-9fc5-1527ba30f1f5', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '44f626dd-adde-4f73-a839-b5b79b33f937', 'Azərbaycan Respublikası Prezidenti seçkilərinin əsaslarına aid deyil', 'multiple_choice',
    '["Səs çoxluğu səsvermənin birinci dövrəsində toplanmayıbsa, səsvermə günündən sonra ikinci bazar günü səsvermənin ikinci dövrəsi keçirilir.", "İkinci dövrədə ancaq birinci dövrədə ən çox səs toplamış iki namizəd yaxud ən çox səs toplamış və öz namizədliyini geri götürmüş namizədlərdən sonra gələn iki namizəd iştirak edir.", "Səsvermənin ikinci dövrəsində səs çoxluğu toplayan namizəd Azərbaycan Respublikasının Prezidenti seçilmiş sayılır.", "Səsvermənin ikinci dövrəsində Azərbaycan Respublikasının Prezidenti səsvermədə iştirak edənlərin yarısından çoxunun səs çoxluğu ilə seçilir."]'::jsonb, 'Səsvermənin ikinci dövrəsində Azərbaycan Respublikasının Prezidenti səsvermədə iştirak edənlərin yarısından çoxunun səs çoxluğu ilə seçilir.', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab D variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 10, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '83e83d2a-d807-46a0-98a5-2d9282db10b8', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '46d2e6d9-454c-42c2-a609-cee82a05b7b3', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması təşəbbüsü hansı halda Konstitusiya Məhkəməsinin təşəbbüsü ilə Ali Məhkəməsinin 30 gün müddətində verilən rəyi əsasında Azərbaycan Respublikasının Milli Məclisi qarşısında irəli sürülə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin şəxsi mülahizəsi əsasında", "Azərbaycan Respublikası Prezidentinin özü istefa ərizəsi verdikdə", "Azərbaycan Respublikasının Prezidenti ağır cinayət törətdikdə", "Dövlət Qulluğu İdarəetmə Şurasının qərarı olduqda"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti ağır cinayət törətdikdə', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 11, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '04dfbb52-b2ab-48bc-99a5-011d2a36e06b', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '4aa3a30f-27a0-4c8a-b51a-763fa5c17423', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti öz səlahiyyətlərinin icrasına nə zaman başlamış sayılır?', 'multiple_choice',
    '["And içdiyi andan Azərbaycan Respublikasının Prezidenti öz səlahiyyətlərinin icrasına başlamış sayılır.", "And içdiyi saatdan etibarən Azərbaycan Respublikasının Prezidenti öz səlahiyyətlərinin icrasına başlamış sayılır.", "And içdiyi gündən Azərbaycan Respublikasının Prezidenti öz səlahiyyətlərinin icrasına başlamış sayılır.", "And içdiyi gündən 3 gün ərzində Azərbaycan Respublikasının Prezidenti öz səlahiyyətlərinin icrasına başlamış sayılır."]'::jsonb, 'And içdiyi gündən Azərbaycan Respublikasının Prezidenti öz səlahiyyətlərinin icrasına başlamış sayılır.', 'AR Konstitusiyası Maddə 103 (Prezidentin andı) — Düzgün cavab C variantıdır. Prezident seçkilərin yekunları elan olunduğu gündən 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir və and içdiyi gündən səlahiyyətlərinin icrasına başlayır.', 12, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e0acc4be-af5a-441d-9afa-2e52a90672fe', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '586e6700-d061-4294-95f7-0848795c2c4d', 'Azərbaycan Respublikası Konstitusiyasına görə Azərbaycan Respublikasının Baş nazirini vəzifədən azad edir:', 'multiple_choice',
    '["Azərbaycan Respublikası Apelyasiya məhkəməsinin sədri", "Azərbaycan Respublikası Konstitusiya məhkəməsinin sədri", "Azərbaycan Respublikası Milli Məclisin sədri", "Azərbaycan Respublikası Prezident"]'::jsonb, 'Azərbaycan Respublikası Prezident', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '42102302-ec65-4612-8df0-f32bba2a358f', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '5b8edf99-6466-4109-9285-5400b1be0615', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səaliyyətlərinə aid deyil
1) Azərbaycan Respublikasının hərbi doktrinasını Azərbaycan Respublikası təsdiq edir
2) Azərbaycan Respublikası Silahlı Qüvvələrinin ali komanda heyətini vəzifəyə təyin və vəzifədən azad edir;
3) Azərbaycan Respublikası Prezidentinin Administrasiyasını təşkil edir və onun rəhbərini təyin edir;
4)Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi və Azərbaycan Respublikasının apellyasiya məhkəmələri hakimlərinin vəzifəyə təyin edilməsi haqqında Azərbaycan Respublikasının Milli Məclisinə təqdimatlar verir;
5)Azərbaycan Respublikasının bütün məhkəmələrinin hakimlərini vəzifəyə təyin edir;
6)Azərbaycan Respublikasının Baş prokurorunu Azərbaycan Respublikası vəzifəyə təyin və vəzifədən azad edir;', 'multiple_choice',
    '["3,4,5", "1,5,6", "1,2,4", "2,3.6"]'::jsonb, '1,5,6', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 14, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fdd85c6f-1dd8-4d2b-8455-42f6ee256978', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '5c097d72-d4d6-4a75-844c-5600b622ebc4', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti hansı hallarda vaxtından əvvəl vəzifədən getmiş sayılmır?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti istefa verdikdə", "Azərbaycan Respublikasının Prezidenti səhhətinə uyğun olaraq öz səlahiyyətlərinin icra etmək qabiliyyətini tamamilə itirdikdə", "Azərbaycan Respublikasının Prezidenti bu Konstitusiya ilə nəzərdə tutulmuş hallarda və qaydada vəzifəsindən kənarlaşdırıldıqda", "Azərbaycan Respublikasının Prezidenti haqqında inzibati xarakterli araşdırılma aparıldıqda"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti haqqında inzibati xarakterli araşdırılma aparıldıqda', 'AR Konstitusiyası Maddə 104, 106 və 107 (Prezidentin statusu, vaxtından əvvəl xitam və impiçment) — Düzgün cavab D variantıdır. Prezidentin şəxsiyyəti toxunulmazdır. Ağır cinayət törətdikdə Konstitusiya Məhkəməsinin təşəbbüsü, Ali Məhkəmənin rəyi və MM-in 95 səs çoxluğu qərarı ilə vəzifədən kənarlaşdırılır.', 15, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0d950648-d01d-4a41-b450-83f39099de68', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '65130883-9290-48b3-ac8d-b9df71ac87a4', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının vitse-prezidentləri maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının vitse-prezidenti vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan şəxs təyin edilir.", "Azərbaycan Respublikasının vitse-prezidenti vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan,ağır cinayətə görə məhkum olunmayan Azərbaycan Respublikası vətəndaşı təyin edilir.", "Azərbaycan Respublikasının vitse-prezidenti vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, ikili vətəndaşlığı olmayan, başqa dövlətlər qarşısında öhdəliyi olmayan Azərbaycan Respublikası vətəndaşı təyin edilir.", "Azərbaycan Respublikasının vitse-prezidenti vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan Azərbaycan Respublikası vətəndaşı təyin edilir."]'::jsonb, 'Azərbaycan Respublikasının vitse-prezidenti vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan Azərbaycan Respublikası vətəndaşı təyin edilir.', 'AR Konstitusiyası Maddə 103 (Prezidentin andı) — Düzgün cavab D variantıdır. Prezident seçkilərin yekunları elan olunduğu gündən 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir və and içdiyi gündən səlahiyyətlərinin icrasına başlayır.', 16, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a4541211-3ddd-4455-ad9c-ed562e53e37c', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '65edf378-827f-4859-925a-1a9baa2754f3', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səahiyyətlərinə aiddir', 'multiple_choice',
    '["dövlət iqtisadi proqramlarının həyata keçirilməsini təmin edir;", "dövlət sosial təminat proqramlarının həyata keçirilməsini təmin edir;", "nazirliklərə və digər mərkəzi icra hakimiyyəti orqanlarına rəhbərlik edir, onların aktlarını ləğv edir;", "dövlət iqtisadi və sosial proqramlarını təsdiq edir;"]'::jsonb, 'dövlət iqtisadi və sosial proqramlarını təsdiq edir;', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 17, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f099d7da-1c8f-4149-a0c6-2a7871933e19', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '660a4f36-a2f5-48ee-8bde-4f100f012ac3', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səaliyyətlərinə aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikasının xarici ölkələrdə və beynəlxalq təşkilatlarda diplomatik nümayəndəliklərinin təsis edilməsi haqqında Azərbaycan Respublikası Milli Məclisinə təqdimat verir,", "Azərbaycan Respublikasının xarici ölkələrdə və beynəlxalq təşkilatlarda diplomatik nümayəndələrini təyin edir və geri çağırır;", "dövlətlərarası və hökumətlərarası beynəlxalq müqavilələri bağlayır, dövlətlərarası və Azərbaycan Respublikasının qanunlarından fərqli qaydalar nəzərdə tutan hökumətlərarası müqavilələri təsdiq və ləğv olunmaq üçün Azərbaycan Respublikasının Milli Məclisinə təqdim edir;", "Azərbaycan Respublikasının dövlət büdcəsində bu məqsədlər üçün nəzərdə tutulmuş xərclər çərçivəsində xüsusi mühafizə xidmətlərinin yaradılması üçün Milli Məclisə təqdimat verir"]'::jsonb, 'Azərbaycan Respublikasının dövlət büdcəsində bu məqsədlər üçün nəzərdə tutulmuş xərclər çərçivəsində xüsusi mühafizə xidmətlərinin yaradılması üçün Milli Məclisə təqdimat verir', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 18, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bc08e051-fc92-4144-ae27-322e6d2292f4', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '6e53543b-bba5-4894-96e1-5b5cf0df7c2e', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası vitse-prezidentlərinin toxunulmazlığı maddəsinə aid deyil', 'multiple_choice',
    '["Səlahiyyət müddəti ərzində Azərbaycan Respublikasının vitse-prezidentinin şəxsiyyəti toxunulmazdır.", "Azərbaycan Respublikasının vitse-prezidenti cinayət başında yaxalanma hallarından başqa tutula bilməz, cinayət məsuliyyətinə cəlb edilə bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz.", "Azərbaycan Respublikasının vitse-prezidenti cinayət başında yaxalanarsa, tutula bilər.", "Azərbaycan Respublikasının vitse-prezidenti cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikasının Prezidentinə xəbər verməlidir."]'::jsonb, 'Azərbaycan Respublikasının vitse-prezidenti cinayət başında yaxalanarsa onu tutan orqan bu barədə dərhal Azərbaycan Respublikasının Prezidentinə xəbər verməlidir.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 19, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '84c74cf6-49f7-4f52-bd0a-33f4880a12f3', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '7112d9de-aab7-4d88-b1c0-be1dc4d75c18', 'Azərbaycan Respublikası Konstitusiyaya görə Azərbaycan Respublikası Prezidentinin səlahiyyətlərinə daxildir:', 'multiple_choice',
    '["Azərbaycan Respublikası Millisinin deputatlarının təyin edilməsi haqqında Milli Məclisə təqdimat verir", "Azərbaycan Respublikası Ali məhkəməsinin hakimlərinin təyin edilməsi haqqında Milli Məclisə təqdimat verir", "Azərbaycan Respublikasının inzibati bölgüsünü həll edir", "Azərbaycan Respublikası bələdiyyələrinin statusunu müəyyən edir"]'::jsonb, 'Azərbaycan Respublikası Ali məhkəməsinin hakimlərinin təyin edilməsi haqqında Milli Məclisə təqdimat verir', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 20, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ef8fff63-bd6d-4b80-80bb-a5306e4f7d6b', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '73842441-47d7-45f3-8434-814ae0c9618e', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması haqqında qərar Azərbaycan Respublikası Konstitusiya Məhkəməsinin Azərbaycan Respublikasının Milli Məclisinə müraciət etdiyi gündən başlayaraq bir ay ərzində qəbul olunmalıdır və bu müddətə göstərilən qərar qəbul edilməsə, Azərbaycan Respublikasının Prezidentinə qarşı irəli sürülmüş ittiham rədd edilmiş sayılır.", "Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması haqqında qərar Azərbaycan Respublikası Konstitusiya Məhkəməsinin Azərbaycan Respublikasının Milli Məclisinə müraciət etdiyi gündən başlayaraq bir həftə ərzində qəbul olunmalıdır və bu müddətə göstərilən qərar qəbul edilməsə, Azərbaycan Respublikasının Prezidentinə qarşı irəli sürülmüş ittiham rədd edilmiş sayılır", "Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması haqqında qərar Azərbaycan Respublikası Konstitusiya Məhkəməsinin Azərbaycan Respublikasının Milli Məclisinə müraciət etdiyi gündən başlayaraq 2 ay ərzində qəbul olunmalıdır və bu müddətə göstərilən qərar qəbul edilməsə, Azərbaycan Respublikasının Prezidentinə qarşı irəli sürülmüş ittiham rədd edilmiş sayılır", "Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması haqqında qərar Azərbaycan Respublikası Konstitusiya Məhkəməsinin Azərbaycan Respublikasının Milli Məclisinə müraciət etdiyi gündən başlayaraq iki həftə ərzində qəbul olunmalıdır və bu müddətə göstərilən qərar qəbul edilməsə, Azərbaycan Respublikasının Prezidentinə qarşı irəli sürülmüş ittiham rədd edilmiş sayılır"]'::jsonb, 'Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması haqqında qərar Azərbaycan Respublikası Konstitusiya Məhkəməsinin Azərbaycan Respublikasının Milli Məclisinə müraciət etdiyi gündən başlayaraq 2 ay ərzində qəbul olunmalıdır və bu müddətə göstərilən qərar qəbul edilməsə, Azərbaycan Respublikasının Prezidentinə qarşı irəli sürülmüş ittiham rədd edilmiş sayılır', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 21, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '028a7b15-7248-4f99-a27a-471e68d2b566', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '73eec251-db75-4e8d-b045-dd8539f70d59', 'Azərbaycan Respublikasının Kostitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti və onun ailəsi necə təmin olunur?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti və onun ailəsi büdcədənkənar fondların hesabına təmin edilir.", "Azərbaycan Respublikasının Prezidenti və onun ailəsi beynəlxlaq fondların təmin edilir.", "Azərbaycan Respublikasının Prezidenti və onun ailəsi dövlət hesabına təmin edilir.", "Azərbaycan Respublikasının Prezidenti və onun ailəsi yalnız onlar üçün ayrılmış mülkiyyətdən ayrılmış gəlirlər hesabına hesabına təmin edilir."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti və onun ailəsi dövlət hesabına təmin edilir.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 22, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '796d3333-3d34-4a4b-99ae-39e2aade2f33', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '753dc4b4-5ac2-41ca-b39d-7bb300749187', 'Azərbaycan Respublikasını Konstitusiyasına əsasən Azərbaycan Respublikasının Prezidenti necə seçilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti səsvermədə iştirak edənlərin 51%-dən çoxunun səs çoxluğu ilə seçilir.", "Azərbaycan Respublikasının Prezidenti respublika əhalisinin yarısından çoxunun səs çoxluğu ilə seçilir.", "Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasında və ondan kənarda məskunlaşan vətəndaşlarının yarısından çoxunun səs çoxluğu ilə seçilir.", "Azərbaycan Respublikasının Prezidenti səsvermədə iştirak edənlərin yarısından çoxunun səs çoxluğu ilə seçilir."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti səsvermədə iştirak edənlərin yarısından çoxunun səs çoxluğu ilə seçilir.', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab D variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 23, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a56cbbb4-f040-4cc4-9b91-8d28ae21d664', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '7556f0eb-e047-4c04-a6e2-a99aed3054ad', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq nə zaman Azərbaycan Respublikasının Prezidenti istefa verdiyinə uyğun olaraq vəzifədən getmiş sayılır?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi qərar qəbul etdiyi andan", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi qərar qəbul etdiyi gündən", "Azərbaycan Respublikasının Milli Məclisinin sədri qərar qəbul etdiyi gündən", "Azərbaycan Respublikasının Ali Məhkəməsinin sədri rəy verdiyi andan"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi qərar qəbul etdiyi andan', 'AR Konstitusiyası Maddə 104, 106 və 107 (Prezidentin statusu, vaxtından əvvəl xitam və impiçment) — Düzgün cavab A variantıdır. Prezidentin şəxsiyyəti toxunulmazdır. Ağır cinayət törətdikdə Konstitusiya Məhkəməsinin təşəbbüsü, Ali Məhkəmənin rəyi və MM-in 95 səs çoxluğu qərarı ilə vəzifədən kənarlaşdırılır.', 24, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'de8a151c-75ee-4845-a9b1-8d77adcfa973', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '79d0afdd-ce8c-4337-b22a-12f00101fa92', 'Azərbaycan Respublikasını Konstitusiyasının 101-ci maddəsinin(Azərbaycan Respublikası Prezidenti seçkilərinin əsasları) tətbiqi qaydası hansı hüquqi normativ aktla müəyyən edilir?', 'multiple_choice',
    '["Qərarla", "Qanunla", "Konstitusiya qanunu ilə", "Fərmanla"]'::jsonb, 'Qanunla', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab B variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 25, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e7701918-2b4a-45ac-bc7d-03e61ae86fcb', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '844df303-1e04-4844-97e7-13a0e5ace9b3', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq əvvəllər Azərbaycan Respublikasının Prezidenti seçilmiş şəxsin təminatı qaydaları hansı aktla müəyyən edilir?', 'multiple_choice',
    '["Konstitusiya ilə", "Konstitusiya qanunu ilə", "Qanunla", "Qərarla"]'::jsonb, 'Konstitusiya qanunu ilə', 'AR Konstitusiyası Maddə 103-1 və 105 (Vitse-prezidentlər və səlahiyyətlərin icrası) — Düzgün cavab B variantıdır. Prezident vaxtından əvvəl vəzifədən getdikdə onun səlahiyyətlərini Birinci vitse-prezident icra edir və 60 gün müddətində növbədənkənar Prezident seçkiləri keçirilir (2016).', 26, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e670788a-1c90-43af-bacd-97ae8498b1bb', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '849ac70b-e263-47a0-95a6-e37d47d2f718', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının birinci vitse-prezidenti və vitse-prezidentləri vəzifəyə hansı subyekt təyin və vəzifədən azad edir?', 'multiple_choice',
    '["Konstitusiya Məhkəməsinin sədri", "Azərbaycan Respublikasının Prezidenti", "Azərbaycan Respublikasının Milli Məclisi", "Prezidentin təqdimatına uyğun olaraq Azərbaycan Respublikasının Milli Məclisi"]'::jsonb, 'Azərbaycan Respublikasının Prezidenti', 'AR Konstitusiyası Maddə 103 (Prezidentin andı) — Düzgün cavab B variantıdır. Prezident seçkilərin yekunları elan olunduğu gündən 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir və and içdiyi gündən səlahiyyətlərinin icrasına başlayır.', 27, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cb478b25-ba4b-4664-9d55-2d75725337c8', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '858bb585-2176-4703-9a5d-35069dd31cab', 'Azərbaycan Respublikası Konstitusiyasına görə Azərbaycan Respublikası Prezidentinin səlahiyyətlərinə aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinə seçkilərin təyin edilməsi", "Azərbaycan Respublikasının diplomatik nümayəndəliklərin təsis edilməsi", "Azərbaycan Respublikası dövlət büdcəsinin Milli Məclisin təsdiqinə təqdim edilməsi", "ali hərbi və ali xüsusi rütbələrin verilməsi"]'::jsonb, 'Azərbaycan Respublikasının diplomatik nümayəndəliklərin təsis edilməsi', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 28, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3b0b4cf2-7cd8-4575-ba48-f393ffbbfd52', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '886b6499-93ad-474b-9e7d-643cdaf64a63', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı normativ aktlar Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa, qüvvəyə minmir?', 'multiple_choice',
    '["Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa, qüvvəyə minmir", "Qanunlar Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa, qüvvəyə minmir", "Qərarlar Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa, qüvvəyə minmir", "Müvafiq icra hakimiyyətinin aktları Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa, qüvvəyə minmir"]'::jsonb, 'Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən imzalanmazsa, qüvvəyə minmir', 'AR Konstitusiyası — Düzgün cavab A variantıdır.', 29, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd6c8be02-dc40-4e5c-8eb4-94b65b9b6a38', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '8dd3e5d7-5f40-4080-8240-c1583ef30f1a', 'Azərbaycan Respublikası Konstitusiyasına əsasən Azərbaycan Respublikası Prezidentinin toxunulmazlığı maddəsinə aid deyil
1. Azərbaycan Respublikasının Prezidenti toxunulmazlıq hüququna malikdir.
2. Azərbaycan Respublikası Prezidentinin şərəf və ləyaqəti qanunla qorunur.
3. Səlahiyyət müddəti ərzində Azərbaycan Respublikasının Prezidentinin şəxsiyyəti toxunulmazdır.
4. Azərbaycan Respublikasının Prezidenti seçilmiş şəxsin təminatı qaydaları Konstitusiya qanunu ilə müəyyən edilir.', 'multiple_choice',
    '["1,2", "2,3", "3,4", "1,4"]'::jsonb, '3,4', 'AR Konstitusiyası Maddə 103-1 və 105 (Vitse-prezidentlər və səlahiyyətlərin icrası) — Düzgün cavab C variantıdır. Prezident vaxtından əvvəl vəzifədən getdikdə onun səlahiyyətlərini Birinci vitse-prezident icra edir və 60 gün müddətində növbədənkənar Prezident seçkiləri keçirilir (2016).', 30, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e0c3850a-1f43-4bdf-a208-98531c2d6138', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '951eeab9-0d5d-4a3d-ae6f-78da90b8e146', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikası Milli Məclisinin Prezidentin vəzifədən kənarlaşdırılması ilə bağlı qəbul etdiyi qərarın imzalanmasına iki ay ərzində tərəfdar çıxmazsa, qərar qüvvəyə minmir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikası Milli Məclisinin Prezidentin vəzifədən kənarlaşdırılması ilə bağlı qəbul etdiyi qərarın imzalanmasına bir ay ərzində tərəfdar çıxmazsa, qərar qüvvəyə minmir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikası Milli Məclisinin Prezidentin vəzifədən kənarlaşdırılması ilə bağlı qəbul etdiyi qərarın imzalanmasına iki həftə ərzində tərəfdar çıxmazsa, qərar qüvvəyə minmir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikası Milli Məclisinin Prezidentin vəzifədən kənarlaşdırılması ilə bağlı qəbul etdiyi qərarın imzalanmasına bir həftə ərzində tərəfdar çıxmazsa, qərar qüvvəyə minmir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikası Milli Məclisinin Prezidentin vəzifədən kənarlaşdırılması ilə bağlı qəbul etdiyi qərarın imzalanmasına bir həftə ərzində tərəfdar çıxmazsa, qərar qüvvəyə minmir.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 31, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5b4272f3-44ea-44a4-906d-92b9dbfd8f85', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '96312cb9-9a36-4d47-83b2-3d201d0ca845', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikasının vitse-prezidentinin toxunulmazlığına hansı formada xitam verilə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikasının vitse-prezidentinin toxunulmazlığına yalnız Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının Baş prokuroru tərəfindən xitam verilə bilər.", "Azərbaycan Respublikasının vitse-prezidentinin toxunulmazlığına yalnız Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının Milli Məclisi tərəfindən xitam verilə bilər.", "Azərbaycan Respublikasının vitse-prezidentinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Prezidenti tərəfindən xitam verilə bilər.", "Azərbaycan Respublikasının vitse-prezidentinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən xitam verilə bilər."]'::jsonb, 'Azərbaycan Respublikasının vitse-prezidentinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Prezidenti tərəfindən xitam verilə bilər.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 32, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8caf1897-9841-423e-acee-0505317c1b01', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', '96a33e82-3794-4a6f-a68b-edc5303d01a9', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Prezidentinin səaliyyətləri Azərbaycan Respublikası Konstitusiya­sının neçənci maddəsində təsbit olunmuşdur?', 'multiple_choice',
    '["107-ci maddəsində", "108-ci maddəsində", "109-cu maddəsində", "110-cu maddəsində"]'::jsonb, '109-cu maddəsində', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 33, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '25d4c602-1a17-4961-bd9e-e9eb3bb6ffc3', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'a1eb5485-1569-449d-9338-72fec9b74ff8', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səahiyyətlərinə aid deyil', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisinə seçkiləri təyin edir;", "Azərbaycan Respublikasının dövlət büdcəsini Azərbaycan Respublikası Milli Məclisinin təsdiqinə təqdim edir;", "Azərbaycan Respublikası Nazirlər Kabinetinin istefası haqqında qərar qəbul edir", "Azərbaycan Respublikası Milli Məclisinin razılığı ilə Azərbaycan Respublikasının Baş nazirini vəzifəyə təyin edir və vəzifədən azad edir;"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin razılığı ilə Azərbaycan Respublikasının Baş nazirini vəzifəyə təyin edir və vəzifədən azad edir;', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 34, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2352de84-8f8f-4586-89a9-98248eb7847b', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'a5b662a9-5bdf-4ba4-98b4-0754cadd6b09', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Milli Məclisinə seçkiləri hansı orqan təyin edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisinə seçkiləri Azərbaycan Respublikasının Mərkəzi Seçki Komissiyası təyin edir;", "Azərbaycan Respublikasının Milli Məclisinə seçkiləri Milli Məclisi özü təyin edir;", "Azərbaycan Respublikasının Milli Məclisinə seçkiləri Azərbaycan Respublikasının Prezidenti təyin edir;", "Azərbaycan Respublikasının Milli Məclisinə seçkiləri Azərbaycan Respublikasının Konstitusiya Məhkəməsi təyin edir."]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisinə seçkiləri Azərbaycan Respublikasının Prezidenti təyin edir;', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 35, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '571de8c4-210e-4d7d-9bc5-1aa037b7fe5e', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'a772dffb-8153-4e28-ba5d-d48d14afc81d', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səaliyyətlərini seçin
1) Azərbaycan Respublikası Nazirlər Kabinetinin üzvlərini Milli Məclisin razılığı ilə vəzifəyə təyin və vəzifədən azad edir;
2) Azərbaycan Respublikasının dövlət büdcəsində icra hakimiyyəti üçün nəzərdə tutulmuş xərclər çərçivəsində mərkəzi və yerli icra hakimiyyəti orqanları yaradır;
3) Azərbaycan Respublikası Nazirlər Kabinetinin və Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərar və sərəncamlarını, mərkəzi və yerli icra hakimiyyəti orqanlarının aktlarını ləğv edir;
4) Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyəti üzvlərinin vəzifəyə təyin və vəzifədən azad edir
5) Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyətinin üzvləri sırasından Azərbaycan Respublikası Mərkəzi Bankının sədrini təyin edilməsi barədə Azərbaycan Respublikasının Milli Məclisinə təqdimat verir,
6) Azərbaycan Respublikasının İnsan hüquqları üzrə müvəkkilinin seçilməsi haqqında Azərbaycan Respublikası Milli Məclisinə təqdimat verir;', 'multiple_choice',
    '["1,2,4", "2,3,6", "3,4,5", "1,5,6"]'::jsonb, '2,3,6', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 36, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cd1f9410-3a42-4fa3-8dbe-e91174bdb83d', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'ae2d515c-d76a-4482-91de-de171a49a458', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti xarici dövlətlərin diplomatik nümayəndələrinin ....... qəbul edir:', 'multiple_choice',
    '["Yalnız etimadnamələrini", "Yalnız övdətnamələrini", "Etimadnamələrini və övdətnamələrini", "Yalnız təsdiqnamələrini"]'::jsonb, 'Etimadnamələrini və övdətnamələrini', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 37, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd843ef39-8be6-4684-bca8-75ca76df90b8', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'b1d4e93b-afd0-405b-8944-0461ffa93828', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi istefa ərizəsini Azərbaycan Respublikası Prezidentinin təqdimatı əsasında Baş prokurorun verdiyinə əmin olduğu təqdirdə Azərbaycan Respublikası Prezidentinin istefasının qəbul olunması haqqında qərar qəbul edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsinin sədri istefa ərizəsini Azərbaycan Respublikası Prezidentinin özünün verdiyinə əmin olduğu təqdirdə Azərbaycan Respublikası Prezidentinin istefasının qəbul olunması haqqında qanun qəbul edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi istefa ərizəsini Azərbaycan Respublikası Milli Məclisinin təqdimatı əsasında verdiyinə əmin olduğu təqdirdə Azərbaycan Respublikası Prezidentinin istefasının qəbul olunması haqqında qərar qəbul edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi istefa ərizəsini Azərbaycan Respublikası Prezidentinin özünün verdiyinə əmin olduğu təqdirdə Azərbaycan Respublikası Prezidentinin istefasının qəbul olunması haqqında qərar qəbul edir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi istefa ərizəsini Azərbaycan Respublikası Prezidentinin özünün verdiyinə əmin olduğu təqdirdə Azərbaycan Respublikası Prezidentinin istefasının qəbul olunması haqqında qərar qəbul edir.', 'AR Konstitusiyası Maddə 104, 106 və 107 (Prezidentin statusu, vaxtından əvvəl xitam və impiçment) — Düzgün cavab D variantıdır. Prezidentin şəxsiyyəti toxunulmazdır. Ağır cinayət törətdikdə Konstitusiya Məhkəməsinin təşəbbüsü, Ali Məhkəmənin rəyi və MM-in 95 səs çoxluğu qərarı ilə vəzifədən kənarlaşdırılır.', 38, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '998a3734-cc4e-484a-8a9b-be8614f80af2', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'b6465b77-6725-4e80-8ef9-6f17066aa9bf', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Birinci vitse-prezidentinin təminatı maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Birinci vitse-prezidenti və onun ailəsi dövlət hesabına təmin edilir.", "Azərbaycan Respublikasının Birinci vitse-prezidentinin və onun ailəsinin təhlükəsizliyini dövlət mühafizə xidmətləri təmin edir.", "Azərbaycan Respublikasının vitse-prezidenti seçilmiş şəxsin təminatı qaydaları qərarla müəyyən edilir", "Azərbaycan Respublikasının vitse-prezidenti seçilmiş şəxsə ali təhsil tələbi müəyyən edilməmişdir"]'::jsonb, 'Azərbaycan Respublikasının Birinci vitse-prezidenti və onun ailəsi dövlət hesabına təmin edilir.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab A variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 39, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '27099541-06d9-49d8-ac06-9da224d478a4', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'b92e07bb-b0cb-4f41-b42c-58e6d975d56d', 'Azərbaycan Respublikası Konstitusiyasına görə Azərbaycan Respublikası Prezidentinin səlahiyyətlərinə daxildir:', 'multiple_choice',
    '["Azərbaycan Respublikası dövlət büdcəsinin təsdiq edilməsi", "Azərbaycan Respublikası bələdiyyələrin qərarlarının təsdiq edilməsi", "Azərbaycan Respublikası bələdiyyələrin yaradılması", "Azərbaycan Respublikası Silahlı Qüvvələrinin Silahlı Qüvvələrin ali komanda heyətinin vəzifədən azad edilməsi"]'::jsonb, 'Azərbaycan Respublikası Silahlı Qüvvələrinin Silahlı Qüvvələrin ali komanda heyətinin vəzifədən azad edilməsi', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 40, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '96d7e0d5-4609-4788-af91-4d0d9f2f847b', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'c6608307-088c-4e74-9aff-09a20193150f', 'Azərbaycan Respublikasını Konstitusiyasına əsasən növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini hansı subyekt elan edə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisinin sədri növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər.", "Azərbaycan Respublikasının Prezidenti növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər.", "Azərbaycan Respublikası Konstitusiya məhkəməsinin sədri növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər.", "Azərbaycan Respublikasının vitse-prezidenti növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər.', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab B variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 41, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9e9a2297-1813-4203-bcd2-7cbac322b440', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'd520e461-790e-47d8-ae2e-68444343066d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı hallarda Prezident Azərbaycan Respublikası Nazirlər Kabinetinin iclaslarına sədrlik edir?', 'multiple_choice',
    '["Bütün hallarda", "Zəruri hallarda", "Heç bir halda", "Baş nazir təyin edilənədək"]'::jsonb, 'Zəruri hallarda', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 42, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '922ce0cd-44cc-49cb-a0ab-584e1a101428', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'dbcbe427-7175-4fca-a388-def85cc3b0ae', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti səlahiyyətlərini Azərbaycan Respublikasının Birinci vitse-prezidenti icra edir:", "Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti səlahiyyətlərini Azərbaycan Respublikasının vitse-prezidenti icra edir", "Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti səlahiyyətlərini Azərbaycan Respublikasının Baş naziri icra edir", "Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti səlahiyyətlərini Azərbaycan Respublikasının Milli Məclisin sədri icra edir"]'::jsonb, 'Azərbaycan Respublikasının yeni Prezidenti seçilənədək Azərbaycan Respublikasının Prezidenti səlahiyyətlərini Azərbaycan Respublikasının Birinci vitse-prezidenti icra edir:', 'AR Konstitusiyası Maddə 103-1 və 105 (Vitse-prezidentlər və səlahiyyətlərin icrası) — Prezident vaxtından əvvəl vəzifədən getdikdə onun səlahiyyətlərini Birinci vitse-prezident icra edir və 60 gün müddətində növbədənkənar Prezident seçkiləri keçirilir (2016).', 43, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'cd4af88e-8edf-4c31-8430-2739528f9bee', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'de0461dd-9068-4a65-a483-683e82ebec24', 'Azərbaycan Respublikası Konstitusiyasına əsasən Prezidenti Azərbaycan Respublikasının Milli Məclisini nə zaman buraxır?
1. Azərbaycan Respublikası Konstitusiya Məhkəməsinin, Azərbaycan Respublikası Ali Məhkəməsinin və Azərbaycan Respublikası Mərkəzi Bankı İdarə Heyətinin kollegial fəaliyyəti üçün zəruri olan sayda üzvlüyə namizədləri Azərbaycan Respublikasının Prezidenti tərəfindən üç dəfə təqdim edildikdən sonra, qanunla müəyyən edilmiş müddətdə təyin etmədikdə
2. Azərbaycan Respublikası Milli Məclisinin müəyyən etdiyi ümumi qaydalarda göstərilən vəzifələrini aradan qaldırıla bilməyən səbəblər üzündən icra etmədikdə
3. .Azərbaycan Respublikası Milli Məclisinin həll etdiyi məsələlərdə göstərilən vəzifələrini aradan qaldırıla bilməyən səbəblər üzündən icra etmədikdə
4. .Qanunlar qəbul edildiyi gündən 14 gün müddətində Azərbaycan Respublikasının Prezidentinə imzalanmaq üçün təqdim etmədikdə
5. Təcili elan olunan qanun layihəsi Azərbaycan Respublikasının Prezidentinə imzalanmaq üçün qəbul edildiyi gündən 48 saat ərzində təqdim etmədikdə', 'multiple_choice',
    '["2,3,4", "1,3,5", "1,2,3", "3,4,5"]'::jsonb, '2,3,4', 'AR Konstitusiyası Maddə 99 və 100 (İcra hakimiyyəti və Prezidentliyə namizədlər) — Düzgün cavab A variantıdır. İcra hakimiyyəti AR Prezidentinə mənsubdur. 10 ildən artıq daimi yaşayan, ali təhsilli, ikili vətəndaşlığı olmayan AR vətəndaşı Prezident seçilə bilər (2016-cı ildə 35 yaş senzi ləğv edilmişdir).', 44, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4fab47e7-7498-4150-897f-5d92aa5760ea', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'e435b86a-ef9d-43d4-9393-449e7508cb40', '2016 – ci il sentyabrın 26 – da keçirilmiş referendumla Azərbaycan Respublikası Konstitusiyasına edilmiş əlavə və dəyişikliklərə aiddir:', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər.", "Azərbaycan Respublikasının Prezidenti səsvermədə iştirak edənlərin yarısından çoxunun səs çoxluğu ilə seçilir.", "Bu səs çoxluğu səsvermənin birinci dövrəsində toplanmayıbsa, səsvermə günündən sonra ikinci bazar günü səsvermənin ikinci dövrəsi keçirilir.", "Səsvermənin ikinci dövrəsində səs çoxluğu toplayan namizəd Azərbaycan Respublikasının Prezidenti seçilmiş sayılır."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti növbədənkənar Azərbaycan Respublikası Prezidenti seçkilərini elan edə bilər.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab A variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 45, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '781f7209-bc34-4f46-bff5-c48fabcc386c', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'e4f6a0e4-355d-445b-a915-131772ea0524', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin Prezidentin vəzifədən kənarlaşdırılması ilə bağlı qəbul etdiyi qərarı hansı subyekt imzalayır?', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiya Məhkəməsi", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin sədri", "Azərbaycan Respublikasının Prezidenti", "Azərbaycan Respublikası Ali məhkəməsi"]'::jsonb, 'Azərbaycan Respublikası Konstitusiya Məhkəməsinin sədri', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab B variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 46, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '156e8194-5a2a-479e-89b1-0fc821ffcaf5', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'e5eac504-23c9-4ccd-97d8-b36ed5138e59', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası Prezidentinin vəzifədən kənarlaşdırılması maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin deputatlarının 95 səs çoxluğu ilə qəbul olunmuş qanun əsasında Azərbaycan Respublikasının Prezidenti vəzifədən kənarlaşdırıla bilər.", "Azərbaycan Respublikası Milli Məclisinin deputatlarının 83 səs çoxluğu ilə qəbul olunmuş qərar əsasında Azərbaycan Respublikasının Prezidenti vəzifədən kənarlaşdırıla bilər.", "Azərbaycan Respublikası Milli Məclisinin deputatlarının 63 səs çoxluğu ilə qəbul olunmuş qərar əsasında Azərbaycan Respublikasının Prezidenti vəzifədən kənarlaşdırıla bilər.", "Azərbaycan Respublikası Milli Məclisinin deputatlarının 95 səs çoxluğu ilə qəbul olunmuş qərar əsasında Azərbaycan Respublikasının Prezidenti vəzifədən kənarlaşdırıla bilər."]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin deputatlarının 95 səs çoxluğu ilə qəbul olunmuş qərar əsasında Azərbaycan Respublikasının Prezidenti vəzifədən kənarlaşdırıla bilər.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 47, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '09e58702-5900-4471-ab86-ed8ed1cdb801', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'e98dd9c4-3499-4cb2-a2d8-fba45e09646a', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq aşağıdakı səlahiyyətlərdən biri həm Azərbaycan Respublikasının Milli Məclisinə, həm də Azərbaycan Respublikasının Prezidentinə məxsusdur:', 'multiple_choice',
    '["Dövlətlərarası müqavilələrin təsdiq və ləğv edilməsi;", "Müharibə elan etmək və sülh bağlamaq;", "Referendum təyin etmək;", "Xarici dövlətlərin diplomatik nümayəndələrinin etimadnamə və övdətnamələrini qəbul etmək;", "Azərbaycan Respublikası Mərkəzi Seçki Komissiyasının üzvlərini təyin etmək."]'::jsonb, 'Referendum təyin etmək;', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab C variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 48, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '82e46ee2-5cb9-4ea6-842a-2f53294c6cbd', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'ebd3ad7f-2bfc-48bf-b6ef-5eebe0244547', 'Azərbaycan Respublikasının Prezidentliyinə namizədlərə aid tələbləri seçin', 'multiple_choice',
    '["Azərbaycan Respublikasının ərazisində 10 ildən artıq yaşayan, seçkilərdə iştirak etmək hüququna malik olan, o cümlədən ağır cinayətə görə məhkum olunmayan, başqa dövlətlər qarşısında öhdəliyi olmayan, ali təhsilli, ikili vətəndaşlığı olmayan Azərbaycan Respublikasının vətəndaşı Azərbaycan Respublikasının Prezidenti seçilə bilər.", "Azərbaycan Respublikasının ərazisində 10 ildən artıq daimi yaşayan, seçkilərdə iştirak etmək hüququna malik olan, o cümlədən ağır cinayətə görə məhkum olunmayan, başqa dövlətlər qarşısında öhdəliyi olmayan, ali təhsilli, ikili vətəndaşlığı olmayan Azərbaycan Respublikasının vətəndaşı Azərbaycan Respublikasının Prezidenti seçilə bilər.", "Azərbaycan Respublikasının ərazisində 10 ildən artıq daimi yaşayan, seçkilərdə iştirak etmək hüququna malik olan, o cümlədən cinayətə görə məhkum olunmayan, başqa dövlətlər qarşısında öhdəliyi olmayan, ali təhsilli, ikili vətəndaşlığı olmayan Azərbaycan Respublikasının vətəndaşı Azərbaycan Respublikasının Prezidenti seçilə bilər.", "Azərbaycan Respublikasının ərazisində 10 ildən artıq daimi yaşayan, seçkilərdə iştirak etmək hüququna malik olan, o cümlədən ağır cinayətə görə məhkum olunmayan, başqa dövlətlər qarşısında öhdəliyi olmayan, ali təhsilli, ikili vətəndaşlığı olmayan şəxs Azərbaycan Respublikasının Prezidenti seçilə bilər."]'::jsonb, 'Azərbaycan Respublikasının ərazisində 10 ildən artıq daimi yaşayan, seçkilərdə iştirak etmək hüququna malik olan, o cümlədən ağır cinayətə görə məhkum olunmayan, başqa dövlətlər qarşısında öhdəliyi olmayan, ali təhsilli, ikili vətəndaşlığı olmayan Azərbaycan Respublikasının vətəndaşı Azərbaycan Respublikasının Prezidenti seçilə bilər.', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab B variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 49, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'dc884638-9088-46c2-8ae2-fafdad2589d3', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'ec27d617-9923-42aa-8bfa-6f956f61959d', 'Azərbaycan Respublikasını Konstitusiyasına əsasən Azərbaycan Respublikası Prezidenti seçkilərinin yekunları maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatı səsvermə günündən sonra 14 gün sonra Azərbaycan Respublikasının Konstitusiya məhkəməsi rəsmən təsdiq edir", "Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatı səsvermə günündən sonra 14 gün ərzində Azərbaycan Respublikasının Konstitusiya məhkəməsinin sədri rəsmən elan edir.", "Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatı səsvermə günü də daxil olmaqla 14 gün ərzində Azərbaycan Respublikasının Konstitusiya məhkəməsi rəsmən açıqlayır", "Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatı səsvermə günündən sonra 14 gün ərzində Azərbaycan Respublikasının Konstitusiya məhkəməsi rəsmən elan edir."]'::jsonb, 'Azərbaycan Respublikası Prezidenti seçkilərinin yekunları haqqında məlumatı səsvermə günündən sonra 14 gün ərzində Azərbaycan Respublikasının Konstitusiya məhkəməsi rəsmən elan edir.', 'AR Konstitusiyası Maddə 103 (Prezidentin andı) — Düzgün cavab D variantıdır. Prezident seçkilərin yekunları elan olunduğu gündən 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə and içir və and içdiyi gündən səlahiyyətlərinin icrasına başlayır.', 50, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '49de30b8-d052-4bf9-b455-ae9e81aa3435', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'ef4e01d0-62cd-48e1-9f97-46e3f9f4fa5e', 'Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Milli Məclisini buraxır:', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin eyni çağırışı bir il ərzində üç dəfə Azərbaycan Respublikasının Nazirlər Kabinetinə etimadsızlıq göstərdikdə", "Azərbaycan Respublikası Milli Məclisinin eyni çağırışı iki il ərzində iki dəfə Azərbaycan Respublikasının Nazirlər Kabinetinə etimadsızlıq göstərdikdə", "Azərbaycan Respublikası Milli Məclisinin eyni çağırışı bir il ərzində bir dəfə Azərbaycan Respublikasının Nazirlər Kabinetinə etimadsızlıq göstərdikdə", "Azərbaycan Respublikası Milli Məclisinin eyni çağırışı bir il ərzində iki dəfə Azərbaycan Respublikasının Nazirlər Kabinetinə etimadsızlıq göstərdikdə"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin eyni çağırışı bir il ərzində iki dəfə Azərbaycan Respublikasının Nazirlər Kabinetinə etimadsızlıq göstərdikdə', 'AR Konstitusiyası Maddə 99 və 100 (İcra hakimiyyəti və Prezidentliyə namizədlər) — Düzgün cavab D variantıdır. İcra hakimiyyəti AR Prezidentinə mənsubdur. 10 ildən artıq daimi yaşayan, ali təhsilli, ikili vətəndaşlığı olmayan AR vətəndaşı Prezident seçilə bilər (2016-cı ildə 35 yaş senzi ləğv edilmişdir).', 51, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '84cf7c8a-b355-49db-919b-5b544eb1ba2a', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'f6e1232d-aaeb-43be-8034-c0c5bd086485', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakılardan biri yalnışdır:', 'multiple_choice',
    '["Azərbaycan Respublikasının seçki hüququ olan 40 min vətəndaşının qanunvericilik təşəbbüsü hüququndan istifadə etməsi qaydası qanunla müəyyən edilir.", "Milli Məclisə təqdim edilən qanun və qərar layihələri əsaslandırılmalı və onların qəbul edilməsinin məqsədləri göstərilməlidir", "Növbədənkənar seçkilərdə seçilən Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddəti beş ildən az ola bilməz", "Azərbaycan Respublikasının Milli Məclisinə növbəti seçkilər növbədənkənar seçkilərdə seçilən Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddətinin beşinci ilinin noyabr ayının birinci bazar günü keçirilir"]'::jsonb, 'Növbədənkənar seçkilərdə seçilən Azərbaycan Respublikası Milli Məclisinin çağırışının səlahiyyət müddəti beş ildən az ola bilməz', 'AR Konstitusiyası Maddə 101 və 102 (Prezident seçkiləri və yekunları) — Düzgün cavab C variantıdır. AR Prezidenti 7 il müddətinə seçilir (2016). Səsvermədə iştirak edənlərin yarıdan çoxunun səs çoxluğu ilə seçilir. Yekunları 14 gün ərzində Konstitusiya Məhkəməsi elan edir.', 52, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7504ac30-a74d-46c6-b1aa-338072372e6b', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'f956d66f-7683-4167-bbf1-462235b60e6b', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikasının Prezidentinin səaliyyətlərinə aiddir
1) ümumi və qismən səfərbərlik elan edir, habelə səfərbərlik üzrə çağırılanları tərxis edir;
2) Azərbaycan Respublikasının Təhlükəsizlik Şurasını yaradır;
3) Azərbaycan Respublikası Silahlı Qüvvələrinin təyinatı ilə bağlı olmayan vəzifələrin icrasına cəlb edilməsi ilə bağlı Azərbaycan Respublikasının Milli Məclisinə təqdimat verir;
4) fövqəladə və hərbi vəziyyət elan edilməsi ilə bağlı Milli Məclisinə təqdimat verir;
5) Azərbaycan Respublikası Milli Məclisinin təqdimatı ilə müharibə elan edir və sülh bağlayır;', 'multiple_choice',
    '["1,2", "3,5", "2,4", "1,5"]'::jsonb, '1,2', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab A variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 53, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4502eae4-0d63-407b-a0c0-8f543a677715', 'c50d01d5-9126-497e-bd1c-856cf5c616e8', 'fb1e52bb-3ff3-4711-8697-715f5a2c535b', 'Azərbaycan Respublikasının Kostitusiyasına əsasən Azərbaycan Respublikası Prezidentinin təminatı maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin və onun ailəsinin təhlükəsizliyini Dövlət Təhlükəsizlik Xidməti təmin edir.", "Azərbaycan Respublikası Prezidentinin və onun ailəsinin təhlükəsizliyini Prezidentin yaratdığı Təhlükəsizlik Şurası təmin edir.", "Azərbaycan Respublikası Prezidentinin və onun ailəsinin təhlükəsizliyini Azərbaycan Respublikası Daxili Qoşunları təmin edir.", "Azərbaycan Respublikası Prezidentinin və onun ailəsinin təhlükəsizliyini xüsusi mühafizə xidmətləri təmin edir."]'::jsonb, 'Azərbaycan Respublikası Prezidentinin və onun ailəsinin təhlükəsizliyini xüsusi mühafizə xidmətləri təmin edir.', 'AR Konstitusiyası Maddə 109 (AR Prezidentinin səlahiyyətləri) — Düzgün cavab D variantıdır. Maddə 109-da təsbit edilmiş 32 müstəsna səlahiyyət (Nazirlər Kabinetinin təyini, Silahlı Qüvvələrə rəhbərlik, Təhlükəsizlik Şurasının yaradılması, əfv etmə, səfirlərin təyini və s.) AR Prezidentinə mənsubdur.', 54, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 5. İcra Hakimiyyəti — Nazirlər Kabineti və Yerli İcra (Hissə 2/2: Maddə 110-124)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '34b5248d-3269-4c73-9923-3c03547a0a66', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 5. İcra Hakimiyyəti — Nazirlər Kabineti və Yerli İcra (Hissə 2/2: Maddə 110-124)', 'Qanunların imzalanması, hərbi və fövqəladə vəziyyət, Vitse-prezidentlər, Nazirlər Kabineti və Yerli icra hakimiyyəti.',
    'Hüquq', 'medium', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e70302a6-c998-4658-be04-091b5267df02', '34b5248d-3269-4c73-9923-3c03547a0a66', '0f2debbd-ad83-4e97-9a13-ffb95014793b', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Konstitusiya ilə Azərbaycan Respublikası Milli Məclisinin və məhkəmə orqanlarının səlahiyyətlərinə aid edilməyən digər məsələləri icra qaydasında həll edir:', 'multiple_choice',
    '["Milli Məclis", "Prezident", "Konstitusiya Məhkəməsinin sədri", "Ali Məhkəmənin sədri"]'::jsonb, 'Prezident', 'AR Konstitusiyası Maddə 113 (AR Prezidentinin aktları) — Düzgün cavab B variantıdır. AR Prezidenti ümumi qaydalar müəyyən etdikdə Fərmanlar, digər məsələlər üzrə Sərəncamlar qəbul edir.', 0, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c7883e94-b80c-47d9-9dbb-f5dbb95d8f4f', '34b5248d-3269-4c73-9923-3c03547a0a66', '108abf5e-6437-452d-a499-dc11a5616c0b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Nazirlər Kabinetinin üzvlüyünə namizədlərə dair tələblərə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş naziri, Baş nazirin müavini, nazir, digər mərkəzi icra hakimiyyəti orqanı rəhbəri vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ağır cinayətə görə məhkum olunmayan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan Azərbaycan Respublikası vətəndaşı təyin edilir.", "Azərbaycan Respublikasının Baş naziri, Baş nazirin müavini, nazir, digər mərkəzi icra hakimiyyəti orqanı rəhbəri vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan şəxs təyin edilir.", "Azərbaycan Respublikasının Baş naziri, Baş nazirin müavini, nazir, digər mərkəzi icra hakimiyyəti orqanı rəhbəri vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan Azərbaycan Respublikası vətəndaşı təyin edilir.", "Azərbaycan Respublikasının Baş naziri, Baş nazirin müavini, nazir, digər mərkəzi icra hakimiyyəti orqanı rəhbəri vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan vətəndaş təyin edilir."]'::jsonb, 'Azərbaycan Respublikasının Baş naziri, Baş nazirin müavini, nazir, digər mərkəzi icra hakimiyyəti orqanı rəhbəri vəzifəsinə seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli, başqa dövlətlər qarşısında öhdəliyi olmayan Azərbaycan Respublikası vətəndaşı təyin edilir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e484483d-89a8-41dc-bca7-74241e212f25', '34b5248d-3269-4c73-9923-3c03547a0a66', '175bd550-b118-474c-bfc2-132ea979df90', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Nazirlər Kabinetinin səlahiyyətləri ilə bağlı fikirlərdən biri doğru deyil', 'multiple_choice',
    '["maliyyə-kredit və pul siyasətinin həyata keçirilməsini təmin edir", "Azərbaycan Respublikası dövlət büdcəsinin layihəsini hazırlayıb Azərbaycan Respublikasının Prezidentinin təsdiqinə verir.", "dövlət sosial təminat proqramlarının həyata keçirilməsini təmin edir", "nazirliklərə və digər mərkəzi icra hakimiyyəti orqanlarına rəhbərlik edir, onların aktlarını ləğv edir."]'::jsonb, 'Azərbaycan Respublikası dövlət büdcəsinin layihəsini hazırlayıb Azərbaycan Respublikasının Prezidentinin təsdiqinə verir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab B variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 2, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd6ea4361-dc0d-4a80-a0f5-d494b5e2374c', '34b5248d-3269-4c73-9923-3c03547a0a66', '25e43659-695f-44ef-965f-f7027933085a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Prezidenti dövlətlərarası və hökumətlərarası beynəlxalq müqavilələr bağlamaq hüququnu kimlərə verə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti dövlətlərarası və hökumətlərarası beynəlxalq müqavilələr bağlamaq hüququnu vitse-prezidentə, Azərbaycan Respublikası Nazirlər Kabinetinin üzvlərinə və Azərbaycan Respublikası Milli Məclisinin sədrinə verə bilər;", "Azərbaycan Respublikasının Prezidenti dövlətlərarası və hökumətlərarası beynəlxalq müqavilələr bağlamaq hüququnu vitse-prezidentə, Azərbaycan Respublikası Baş nazirinə və Azərbaycan Respublikası Prezidentinin müəyyən etdiyi digər şəxslərə verə bilər;", "Azərbaycan Respublikasının Prezidenti dövlətlərarası və hökumətlərarası beynəlxalq müqavilələr bağlamaq hüququnu vitse-prezidentə, Azərbaycan Respublikası Milli Məclisinin deputatlarına və Azərbaycan Respublikası Prezidentinin müəyyən etdiyi digər şəxslərə verə bilər;", "Azərbaycan Respublikasının Prezidenti dövlətlərarası və hökumətlərarası beynəlxalq müqavilələr bağlamaq hüququnu vitse-prezidentə, Azərbaycan Respublikası Nazirlər Kabinetinin üzvlərinə və Azərbaycan Respublikası Prezidentinin müəyyən etdiyi digər şəxslərə verə bilər."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti dövlətlərarası və hökumətlərarası beynəlxalq müqavilələr bağlamaq hüququnu vitse-prezidentə, Azərbaycan Respublikası Nazirlər Kabinetinin üzvlərinə və Azərbaycan Respublikası Prezidentinin müəyyən etdiyi digər şəxslərə verə bilər.', 'AR Konstitusiyası Maddə 111 (Hərbi vəziyyət elan edilməsi) — Düzgün cavab D variantıdır. Faktiki işğal, müharibə təhlükəsi yarandıqda Prezident hərbi vəziyyət elan edir və 24 saat ərzində MM-in təsdiqinə təqdim edir.', 3, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd9a895c3-be32-4a65-816f-49a2d8109445', '34b5248d-3269-4c73-9923-3c03547a0a66', '3b2ec8db-09e1-48cd-8da1-b2b140631afc', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Nazirlər Kabineti hansı aktları qəbul edir?', 'multiple_choice',
    '["ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Nazirlər Kabineti qanunlar, başqa məsələlər üzrə sərəncamlar qəbul edir;", "ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Nazirlər Kabineti qanunlar, başqa məsələlər üzrə qərarlar qəbul edir;", "ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Nazirlər Kabineti qərarlar, başqa məsələlər üzrə sərəncamlar qəbul edir;", "ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Nazirlər Kabineti fərmanlar, başqa məsələlər üzrə sərəncamlar qəbul edir."]'::jsonb, 'ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Nazirlər Kabineti qərarlar, başqa məsələlər üzrə sərəncamlar qəbul edir;', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 4, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd8d6ec88-c0ff-48b2-82cb-10d5e58e4f59', '34b5248d-3269-4c73-9923-3c03547a0a66', '49cdf6d5-ea4c-43b6-a3ce-424d3cc0a3b0', 'Azərbaycan Respublikasının Konstitusiyasına əsasən təsdiqnamələri imzalamaq səlahiyyəti hansı subyektə aiddir?', 'multiple_choice',
    '["Azərbaycan Respublikası Prezindentinə", "Azərbaycan Respublikası Milli Məclisinin sədrinə", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin sədrinə", "Azərbaycan Respublikası Baş Prokuroruna"]'::jsonb, 'Azərbaycan Respublikası Prezindentinə', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab A variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c71452cc-9ff4-4c63-a527-fb59ad370eaa', '34b5248d-3269-4c73-9923-3c03547a0a66', '5f32277b-4524-4643-a36a-aab1639f6b3c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Nazirlər Kabinetinin iclaslarına, bir qayda olaraq, hansı subyekt sədrlik edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş nazirinin müavini", "Azərbaycan Respublikasının Baş naziri", "Azərbaycan Respublikasının Prezidenti", "Azərbaycan Respublikasının Prezident Administrasiyasının rəhbəri"]'::jsonb, 'Azərbaycan Respublikasının Baş naziri', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab B variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 6, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '441e81d5-c6be-4dbd-af1f-c45cc48e9442', '34b5248d-3269-4c73-9923-3c03547a0a66', '61a2ff60-fd22-4b2a-ab81-49062e6f6457', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisi 83 səs çoxluğu ilə qəbul edilən Konstitusiya qanunlarını 95 səs çoxluğu ilə, 63 səs çoxluğu ilə qəbul edilən Konstitusiya qanunlarını isə 83 səs çoxluğu ilə yenidən qəbul edirsə, belə qanunlar təkrar səsvermədən sonra qüvvəyə minir.", "Azərbaycan Respublikasının Milli Məclisi 83 səs çoxluğu ilə qəbul edilən qanunları 63 səs çoxluğu ilə, 63 səs çoxluğu ilə qəbul edilən qanunları isə 95 səs çoxluğu ilə yenidən qəbul edirsə, belə qanunlar təkrar səsvermədən sonra qüvvəyə minir.", "Azərbaycan Respublikasının Milli Məclisi 95 səs çoxluğu ilə qəbul edilən qanunları 83 səs çoxluğu ilə, 63 səs çoxluğu ilə qəbul edilən qanunları isə 95 səs çoxluğu ilə yenidən qəbul edirsə, belə qanunlar təkrar səsvermədən sonra qüvvəyə minir.", "Azərbaycan Respublikasının Milli Məclisi 83 səs çoxluğu ilə qəbul edilən qanunları 95 səs çoxluğu ilə, 63 səs çoxluğu ilə qəbul edilən qanunları isə 83 səs çoxluğu ilə yenidən qəbul edirsə, belə qanunlar təkrar səsvermədən sonra qüvvəyə minir."]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisi 83 səs çoxluğu ilə qəbul edilən qanunları 95 səs çoxluğu ilə, 63 səs çoxluğu ilə qəbul edilən qanunları isə 83 səs çoxluğu ilə yenidən qəbul edirsə, belə qanunlar təkrar səsvermədən sonra qüvvəyə minir.', 'AR Konstitusiyası Maddə 111 (Hərbi vəziyyət elan edilməsi) — Faktiki işğal, müharibə təhlükəsi yarandıqda Prezident hərbi vəziyyət elan edir və 24 saat ərzində MM-in təsdiqinə təqdim edir.', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0fdae190-9bce-4e7f-9104-19b83e229c2b', '34b5248d-3269-4c73-9923-3c03547a0a66', '648413d1-319a-4568-b208-381ea71504e3', '“Dövlət qulluğu haqqında” AR Qanununa əsasən dövlət qulluqçusunun and içmə qaydası ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar imzalandığı gündən qüvvəyə minir.", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən sonrakı iş günü qüvvəyə minir.", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən sonrakı gün qüvvəyə minir.", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir."]'::jsonb, 'Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab D variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3f160e63-e6f8-470c-a5ee-e83f62ad1fa1', '34b5248d-3269-4c73-9923-3c03547a0a66', '6a537161-aca6-41d9-90a8-35f307105e43', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Prezidenti hansı aktları qəbul edir?', 'multiple_choice',
    '["ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Prezidenti dekretlər, başqa məsələlər barəsində isə sərəncamlar qəbul edir;", "ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Prezidenti fərmanlar, başqa məsələlər barəsində isə sərəncamlar qəbul edir;", "ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Prezidenti qərarlar, başqa məsələlər barəsində isə fərmanlar qəbul edir;", "ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Prezidenti sərəncamlar, başqa məsələlər barəsində isə qərarlar qəbul edir."]'::jsonb, 'ümumi qaydalar müəyyən etdikdə Azərbaycan Respublikasının Prezidenti fərmanlar, başqa məsələlər barəsində isə sərəncamlar qəbul edir;', 'AR Konstitusiyası Maddə 113 (AR Prezidentinin aktları) — Düzgün cavab B variantıdır. AR Prezidenti ümumi qaydalar müəyyən etdikdə Fərmanlar, digər məsələlər üzrə Sərəncamlar qəbul edir.', 9, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '36e42100-47d5-414d-a7c1-9c90e35ebd9d', '34b5248d-3269-4c73-9923-3c03547a0a66', '6b45cb50-0362-4c3f-94a0-57558f65a373', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında təklifi Azərbaycan Respublikası Prezidenti Azərbaycan Respublikası Milli Məclisinin müzakirəsinə nə zaman təqdim edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında təklifi Azərbaycan Respublikasının Prezidenti onun öz vəzifələrinin icrasına başladığı gündən iki həftə və ya Azərbaycan Respublikası Nazirlər Kabinetinin istefa verdiyi gündən bir ay müddətindən gec olmayaraq Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim edir.", "Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında təklifi Azərbaycan Respublikasının Prezidenti onun öz vəzifələrinin icrasına başladığı gündən iki ay və ya Azərbaycan Respublikası Nazirlər Kabinetinin istefa verdiyi gündən bir həftə müddətindən gec olmayaraq Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim edir.", "Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında təklifi Azərbaycan Respublikasının Prezidenti onun öz vəzifələrinin icrasına başladığı gündən bir həftə və ya Azərbaycan Respublikası Nazirlər Kabinetinin istefa verdiyi gündən iki ay müddətindən gec olmayaraq Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim edir.", "Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında təklifi Azərbaycan Respublikasının Prezidenti onun öz vəzifələrinin icrasına başladığı gündən bir ay və ya Azərbaycan Respublikası Nazirlər Kabinetinin istefa verdiyi gündən iki həftə müddətindən gec olmayaraq Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim edir."]'::jsonb, 'Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında təklifi Azərbaycan Respublikasının Prezidenti onun öz vəzifələrinin icrasına başladığı gündən bir ay və ya Azərbaycan Respublikası Nazirlər Kabinetinin istefa verdiyi gündən iki həftə müddətindən gec olmayaraq Azərbaycan Respublikası Milli Məclisinin müzakirəsinə təqdim edir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab D variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 10, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fb0ef3dc-2b85-4427-bc3c-58953269972e', '34b5248d-3269-4c73-9923-3c03547a0a66', '756cfc3d-7f97-4b8f-b762-17acdf19d177', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Prezidentin fərman və sərəncamları nə zamandan qüvvəyə minir?', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar imzalandığı gündən qüvvəyə minir.", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən sonrakı iş günü qüvvəyə minir.", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən sonrakı gün qüvvəyə minir.", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir."]'::jsonb, 'Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir.', 'AR Konstitusiyası Maddə 113.IV (Azərbaycan Respublikası Prezidentinin aktları) — AR Prezidentinin fərman və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '35a35c40-4dbc-4883-b3e0-83a194e137a4', '34b5248d-3269-4c73-9923-3c03547a0a66', '795c1a55-1064-48e0-a65e-956b929f465a', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Nazirlər Kabinetinin üzvlərinə aid tələbləri seçin', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər, digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri heç bir başqa seçkili və ya təyinatlı vəzifə tuta bilməzlər, elmi, pedaqoji və yaradıcılıq fəaliyyəti də daxil olmaqla, heç bir sahibkarlıq, kommersiya və digər ödənişli fəaliyyətlə məşğul ola bilməzlər, vəzifə maaşından, habelə elmi, pedaqoji və yaradıcılıq fəaliyyətinə görə aldığı vəsaitdən başqa məvacib ala bilməzlər.", "Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər, digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri heç bir başqa seçkili və ya təyinatlı vəzifə tuta bilməzlər, elmi, pedaqoji və yaradıcılıq fəaliyyətindən başqa heç bir sahibkarlıq, kommersiya və digər ödənişli fəaliyyətlə məşğul ola bilməzlər, vəzifə maaşından, habelə elmi, pedaqoji və yaradıcılıq fəaliyyətinə görə aldığı vəsaitdən başqa məvacib ala bilməzlər.", "Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər, digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri heç bir başqa seçkili və ya təyinatlı vəzifə tuta bilməzlər, elmi, pedaqoji və yaradıcılıq fəaliyyətindən başqa heç bir sahibkarlıq, kommersiya və digər ödənişli fəaliyyətlə məşğul ola bilməzlər, vəzifə maaşından, habelə elmi, pedaqoji və yaradıcılıq fəaliyyətinə görə aldığı vəsait də daxil olmaqla heç bir məvacib ala bilməzlər.", "Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər, digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri yalnız heç bir başqa təyinatlı vəzifə tuta bilməzlər, elmi, pedaqoji və yaradıcılıq fəaliyyətindən başqa heç bir sahibkarlıq, kommersiya və digər ödənişli fəaliyyətlə məşğul ola bilməzlər, vəzifə maaşından, habelə elmi, pedaqoji və yaradıcılıq fəaliyyətinə görə aldığı vəsaitdən başqa məvacib ala bilməzlər."]'::jsonb, 'Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər, digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri heç bir başqa seçkili və ya təyinatlı vəzifə tuta bilməzlər, elmi, pedaqoji və yaradıcılıq fəaliyyətindən başqa heç bir sahibkarlıq, kommersiya və digər ödənişli fəaliyyətlə məşğul ola bilməzlər, vəzifə maaşından, habelə elmi, pedaqoji və yaradıcılıq fəaliyyətinə görə aldığı vəsaitdən başqa məvacib ala bilməzlər.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab B variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 12, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2e8bdf07-37bf-4446-88d0-30f01e8ab619', '34b5248d-3269-4c73-9923-3c03547a0a66', '81a65fb8-f365-46d2-b1f5-71a8e6d07001', 'Azərbaycan Respublikasının Konstitusiyasında Azərbaycan Respublikasının Baş nazirinin toxunulmazlığı necə müəyyən edilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş naziri, cinayət başında yaxalanma hallarından başqa, tutula bilməz, cinayət məsuliyyətinə cəlb edilə bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz;", "Azərbaycan Respublikasının Baş naziri tutula bilməz, cinayət məsuliyyətinə cəlb edilə bilməz, onun barəsində inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz;", "Azərbaycan Respublikasının Baş naziri tutula və həbs edilə bilməz, cinayət məsuliyyətinə cəlb edilə bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz, axtarışa məruz qala bilməz, şəxsi müayinə edilə bilməz;", "Azərbaycan Respublikasının Konstitusiyasında Azərbaycan Respublikasının Baş nazirinin toxunulmazlığı nəzərdə tutulmayıb."]'::jsonb, 'Azərbaycan Respublikasının Baş naziri, cinayət başında yaxalanma hallarından başqa, tutula bilməz, cinayət məsuliyyətinə cəlb edilə bilməz, onun barəsində məhkəmə qaydasında inzibati tənbeh tədbirləri tətbiq edilə bilməz;', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab A variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f8b8a221-5dc7-4a78-88b1-2506b8d0046c', '34b5248d-3269-4c73-9923-3c03547a0a66', '83b06edd-a579-4aef-b723-37002cff3b99', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakılardan hansı hallarda Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Baş nazirini Azərbaycan Respublikasının Milli Məclisinin razılığı olmadan təyin edə bilər?
1. Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərar həmin namizədliyin təqdim edildiyi gündən bir həftədən gec qəbul edildikdə
2. Azərbaycan Respublikasının Konstitusiya Məhkəməsinin xüsusi qərarı olduqda
3. Azərbaycan Respublikasının Prezidentinin təqdim etdiyi namizədlərin Azərbaycan Respublikasının Baş naziri vəzifəsinə təyin olunmasına üç dəfə razılıq verilməzsə
4. Azərbaycan Respublikasının Milli Məclisinin sədrinin narazılığı olduqda', 'multiple_choice',
    '["1,2", "3,4", "2,3", "1,3"]'::jsonb, '1,3', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab D variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 14, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1440a588-f1b5-4cee-8121-768de6f1cb57', '34b5248d-3269-4c73-9923-3c03547a0a66', '8799acb0-49d6-43c5-91d8-52dde1ddc4f2', 'Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Baş nazirinin təyin edilməsi qaydasını düzgün seçin', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş nazirini Azərbaycan Respublikası Milli Məclisinin təklifi ilə Azərbaycan Respublikasının Prezidenti təyin edir.", "Azərbaycan Respublikasının Baş nazirini Azərbaycan Respublikası Milli Məclisinin təqdimatı ilə Azərbaycan Respublikasının Prezidenti təyin edir.", "Azərbaycan Respublikasının Baş nazirini Azərbaycan Respublikası Milli Məclisinin razılığı ilə Azərbaycan Respublikasının Prezidenti təyin edir.", "Azərbaycan Respublikasının Baş nazirini Azərbaycan Respublikası Prezidentinin razılığı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir."]'::jsonb, 'Azərbaycan Respublikasının Baş nazirini Azərbaycan Respublikası Milli Məclisinin razılığı ilə Azərbaycan Respublikasının Prezidenti təyin edir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7e9674c8-41f2-4545-b39c-01da5c85c76e', '34b5248d-3269-4c73-9923-3c03547a0a66', '8f07aab8-79f5-49c5-acd4-dc0ee8e69724', 'Respublikasının Konstitusiyasına uyğun olaraq qanunların imzalanması maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti qanunları ona təqdim olunmuş gündən sonrakı gündən başlayaraq 56 gün ərzində imzalayır.", "Azərbaycan Respublikasının Prezidenti qanunları ona təqdim olunmuş gündən sonrakı iş günündən başlayaraq 56 gün ərzində imzalayır.", "Azərbaycan Respublikasının Prezidenti qanunları ona təqdim olunmuş gündən başlayaraq 14 gün ərzində imzalayır.", "Azərbaycan Respublikasının Prezidenti qanunları ona təqdim olunmuş gündən başlayaraq 56 gün ərzində imzalayır."]'::jsonb, 'Azərbaycan Respublikasının Prezidenti qanunları ona təqdim olunmuş gündən başlayaraq 56 gün ərzində imzalayır.', 'AR Konstitusiyası Maddə 110 (Qanunların imzalanması) — Düzgün cavab D variantıdır. AR Prezidenti qanunları ona təqdim edildiyi gündən 56 gün ərzində imzalayır (və ya etirazı ilə MM-ə qaytarır).', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '43201bb0-0f67-42b1-8a6a-a69286437769', '34b5248d-3269-4c73-9923-3c03547a0a66', '9b46a333-0534-4b2b-97a5-40330f364404', 'Azərbaycan Respublikasının Konstitusiyasına görə doğru deyil', 'multiple_choice',
    '["Azərbaycan Respublikasının Prezidenti icra səlahiyyətlərinin həyata keçirilməsinin təşkili məqsədi ilə Azərbaycan Respublikasının Nazirlər Kabinetini yaradır.", "Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikası Prezidentinin yuxarı icra orqanıdır.", "Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikasının Prezidentinə tabedir və Baş nazirin qarşısında cavabdehdir.", "Azərbaycan Respublikası Nazirlər Kabinetinin iş qaydasını Azərbaycan Respublikasının Prezidenti müəyyənləşdirir."]'::jsonb, 'Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikasının Prezidentinə tabedir və Baş nazirin qarşısında cavabdehdir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 17, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1a67f23c-ff85-4441-a298-7a346df265d3', '34b5248d-3269-4c73-9923-3c03547a0a66', 'a3eb86b6-147d-4e6a-9264-aa7782ec1eca', 'Azərbaycan Respublikasında mülkiyyət növləri və onların hüquqi bərabərliyi ilə bağlı hansı fikir doğrudur?', 'multiple_choice',
    '["Səlahiyyət müddəti ərzində Azərbaycan Respublikası Baş nazirinin şəxsiyyəti,mülkiyyəti və əmlakı toxunulmazdır.", "Bütün hallarda Azərbaycan Respublikası Baş nazirinin şəxsiyyəti toxunulmazdır.", "Səlahiyyət müddəti ərzində Azərbaycan Respublikası Baş nazirinin şəxsiyyəti toxunulmazdır.", "Səlahiyyət müddəti ərzində Azərbaycan Respublikası Baş nazirinin şəxsiyyəti,şərəf və ləyaqəti toxunulmazdır."]'::jsonb, 'Səlahiyyət müddəti ərzində Azərbaycan Respublikası Baş nazirinin şəxsiyyəti toxunulmazdır.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0a973d2a-f269-4a27-be75-f675e7d6a15f', '34b5248d-3269-4c73-9923-3c03547a0a66', 'aa449e2b-b8b3-4c7e-9bfd-979ce29b64f8', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamları nə vaxtdan qüvvəyə minir?', 'multiple_choice',
    '["Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamları dərc edildiyi gündən qüvvəyə minir.", "Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar imzalandığı gündən qüvvəyə minir.", "Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar qəbul edildiyi gündən qüvvəyə minir.", "Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir."]'::jsonb, 'Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamlarında başqa qayda nəzərdə tutulmayıbsa, onlar dərc edildiyi gündən qüvvəyə minir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab D variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 19, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8801f190-f62c-4030-aaf8-eebf2b29ead4', '34b5248d-3269-4c73-9923-3c03547a0a66', 'b7b6d881-e517-46d6-a5f9-2a3d7b1c2339', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Baş naziri hansı hallarda tutula bilər?', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş naziri cinayət törətməkdə əsaslı şübhələr olarsa, tutula bilər;", "Azərbaycan Respublikasının Baş naziri cinayət törədilən yerin yaxınlığında yaxalanarsa, tutula bilər;", "Azərbaycan Respublikasının Baş naziri cinayət başında yaxalanarsa, tutula bilər;", "Azərbaycan Respublikasının Baş naziri ümumiyyətlə tutula bilməz."]'::jsonb, 'Azərbaycan Respublikasının Baş naziri cinayət başında yaxalanarsa, tutula bilər;', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 20, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '33fb067e-2db6-448c-8db1-118c0333b0ad', '34b5248d-3269-4c73-9923-3c03547a0a66', 'bc57bd4c-bb1d-47f1-9150-786499eab913', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Prezidenti fövqəladə vəziyyət tətbiq edir:
1. Təbii fəlakətlər, epidemiyalar baş verdikdə
2. Epizootiyalar baş verdikdə
3. Azərbaycan Respublikasına qarşı real silahlı hücum təhlükəsi yarandıqda
4. Böyük ekoloji və başqa qəzalar baş verdikdə
5. Azərbaycan Respublikasının ərazi bütövlüyünün pozulmasına, dövlətə qarşı qiyama və ya dövlət çevrilişinə yönəldilən hərəkətlər edildikdə
6. Zorakılıqla müşayiət olunan kütləvi iğtişaşlar yarandıqda
7. Xarici dövlət və ya dövlətlər Azərbaycan Respublikasına müharibə elan etdikdə
8. Vətəndaşların həyatı və təhlükəsizliyi yaxud dövlət təsisatlarının normal fəaliyyəti üçün qorxu törədən digər münaqişələr meydana gəldikdə', 'multiple_choice',
    '["1,3,5,7,8", "2,3,4,5,6", "1,2,4.6,8", "1,2,3,4,5"]'::jsonb, '1,2,4.6,8', 'AR Konstitusiyası Maddə 112 (Fövqəladə vəziyyət elan edilməsi) — Düzgün cavab C variantıdır. Təbii fəlakətlər, epidemiyalar, kütləvi iğtişaşlar baş verdikdə Prezident fövqəladə vəziyyət elan edir və 24 saat ərzində MM-in təsdiqinə verir.', 21, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0cc931db-11e5-4381-9424-a994880e9013', '34b5248d-3269-4c73-9923-3c03547a0a66', 'caa4d7fb-f391-474d-a034-c991fe77904c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Nazirlər Kabinetinin istefasına aiddir', 'multiple_choice',
    '["Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini tutduğu və səlahiyyətlərini icra etməyə başladığı an Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikası Prezidentinə istefa verir.", "Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini tutduğu və səlahiyyətlərini icra etməyə başladığı gündən bir həftə ərzinə Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikası Prezidentinə istefa verir.", "Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini tutduğu və səlahiyyətlərini icra etməyə başladığı gündən bir ay Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikası Prezidentinə istefa verir.", "Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini tutduğu və səlahiyyətlərini icra etməyə başladığı gün Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikası Prezidentinə istefa verir."]'::jsonb, 'Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini tutduğu və səlahiyyətlərini icra etməyə başladığı gün Azərbaycan Respublikasının Nazirlər Kabineti Azərbaycan Respublikası Prezidentinə istefa verir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab D variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 22, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e16d901e-a7df-46ab-8368-d0c028cddb51', '34b5248d-3269-4c73-9923-3c03547a0a66', 'd5d418e3-2d2e-455a-9cbc-c9008efcf2d2', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərarı hansı müddətdə qəbul etməlidir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərarı həmin namizədliyin təqdim edildiyi gündən bir aydan gec olmayaraq qəbul edir.", "Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərarı həmin namizədliyin təqdim edildiyi gündən bir həftədən tez olmayaraq qəbul edir.", "Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərarı həmin namizədliyin təqdim edildiyi gündən iki həftədən gec olmayaraq qəbul edir.", "Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərarı həmin namizədliyin təqdim edildiyi gündən bir həftədən gec olmayaraq qəbul edir."]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisi Azərbaycan Respublikasının Baş naziri vəzifəsinə namizədlik haqqında qərarı həmin namizədliyin təqdim edildiyi gündən bir həftədən gec olmayaraq qəbul edir.', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab D variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 23, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f1e8b0b7-632a-4d2a-ab66-24587b506007', '34b5248d-3269-4c73-9923-3c03547a0a66', 'ea8af6bd-29fa-4880-8c5d-cf032ee6e8ec', 'Azərbaycan Respublikası Konstitusiyaya əsasən Azərbaycan Respublikası vətəndaşlarının müddətli hərbi xidmətdə çağırılması və müddətli hərbi xidmətdə olan hərbi qulluqçuların ehtiyata buraxılması barədə Azərbaycan Respublikasının Prezidenti hansı aktı qəbul edir?', 'multiple_choice',
    '["Konstitusiya qanunu", "qərar", "qanun", "sərəncam"]'::jsonb, 'qərar', 'AR Konstitusiyası Maddə 113 (AR Prezidentinin aktları) — Düzgün cavab B variantıdır. AR Prezidenti ümumi qaydalar müəyyən etdikdə Fərmanlar, digər məsələlər üzrə Sərəncamlar qəbul edir.', 24, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '30af70b6-b1cf-46ac-b297-c362e2f9001a', '34b5248d-3269-4c73-9923-3c03547a0a66', 'ed476a15-e722-4492-8eea-aeb86d6d8a5d', 'Azərbaycan Respublikasının Prezidenti hansı hallarda Azərbaycan Respublikasının bütün ərazisində və ayrı-ayrı yerlərində hərbi vəziyyət elan edir?
1. təbii fəlakətlər, epidemiyalar, epizootiyalar, böyük ekoloji və başqa qəzalar baş verdikdə
2. Azərbaycan Respublikası ərazisinin müəyyən hissəsi faktiki işğal olunduqda
3. xarici dövlət və ya dövlətlər Azərbaycan Respublikasına müharibə elan etdikdə
4. Azərbaycan Respublikasının ərazi bütövlüyünün pozulmasına, dövlətə qarşı qiyama və ya dövlət çevrilişinə yönəldilən hərəkətlər edildikdə
5. Azərbaycan Respublikasına qarşı real silahlı hücum təhlükəsi yarandıqda
6. Azərbaycan Respublikasının ərazisi blokadaya alındıqda, habelə blokada üçün real təhlükə olduqda
7. zorakılıqla müşayiət olunan kütləvi iğtişaşlar yarandıqda
8. vətəndaşların həyatı və təhlükəsizliyi, yaxud dövlət təsisatlarının normal fəaliyyəti üçün qorxu törədən digər münaqişələr meydana gəldikdə', 'multiple_choice',
    '["1; 3; 4; 7;", "2; 3; 5; 6;", "2; 4; 6; 8;", "2; 4; 7; 8."]'::jsonb, '2; 3; 5; 6;', 'AR Konstitusiyası Maddə 111 (Hərbi vəziyyət elan edilməsi) — Düzgün cavab B variantıdır. Faktiki işğal, müharibə təhlükəsi yarandıqda Prezident hərbi vəziyyət elan edir və 24 saat ərzində MM-in təsdiqinə təqdim edir.', 25, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '22f5b647-ffdc-4cae-b41f-724789ff85f9', '34b5248d-3269-4c73-9923-3c03547a0a66', 'f355bb6d-3725-4a6e-bd1b-dea55ac917f7', 'Azərbaycan Respublikası Nazirlər Kabinetinin tərkibi ibarətdir:', 'multiple_choice',
    '["Azərbaycan Respublikası Nazirlər Kabinetinin tərkibi Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər və yerli icra hakimiyyəti orqanlarının rəhbərlərindən ibarətdir", "Azərbaycan Respublikası Nazirlər Kabinetinin tərkibi Azərbaycan Respublikasının Baş naziri, mərkəzi icra hakimiyyəti orqanlarının rəhbərləri və bələdiyyə sədrlərindən ibarətdir", "Azərbaycan Respublikası Nazirlər Kabinetinin tərkibi Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər və başqa mərkəzi icra hakimiyyəti orqanlarının rəhbərlərindən ibarətdir", "Azərbaycan Respublikası Nazirlər Kabinetinin tərkibi Azərbaycan Respublikasının Baş naziri, onun müavinləri və dövlət qulluğunun xüsusi növünə aid mərkəzi icra hakimiyyəti orqanlarının rəhbərlərindən ibarətdir"]'::jsonb, 'Azərbaycan Respublikası Nazirlər Kabinetinin tərkibi Azərbaycan Respublikasının Baş naziri, onun müavinləri, nazirlər və başqa mərkəzi icra hakimiyyəti orqanlarının rəhbərlərindən ibarətdir', 'AR Konstitusiyası Maddə 114 - 124 (Nazirlər Kabineti və Yerli icra hakimiyyəti) — Düzgün cavab C variantıdır. Nazirlər Kabineti Prezidentin yuxarı icra orqanıdır. Baş nazir Prezidentin təqdimatı ilə MM-in razılığı ilə təyin edilir. Ümumi qaydalar üzrə Qərarlar, digər məsələlər üzrə Sərəncamlar qəbul edir. Baş nazirin toxunulmazlığı Prezidentin razılığı ilə qaldırıla bilər.', 26, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f065f7fb-01d3-4053-8283-d6c3b3bf91a3', '34b5248d-3269-4c73-9923-3c03547a0a66', 'ffdeaee5-de36-454f-a579-1a0913537e51', 'Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının bütün ərazisində və ayrı-ayrı yerlərində hərbi vəziyyət elan edilməsi barədə fərmanı hansı müddətdə Azərbaycan Respublikası Milli Məclisinin təsdiqinə verir?', 'multiple_choice',
    '["dərhal;", "12 saat müddətində;", "24 saat müddətində;", "48 saat müddətində."]'::jsonb, '24 saat müddətində;', 'AR Konstitusiyası Maddə 111 (Hərbi vəziyyət elan edilməsi) — Düzgün cavab C variantıdır. Faktiki işğal, müharibə təhlükəsi yarandıqda Prezident hərbi vəziyyət elan edir və 24 saat ərzində MM-in təsdiqinə təqdim edir.', 27, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 6. Məhkəmə Hakimiyyəti və Prokurorluq (Fəsil 7: Maddə 125-133)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 6. Məhkəmə Hakimiyyəti və Prokurorluq (Fəsil 7: Maddə 125-133)', 'Məhkəmə hakimiyyətinin həyata keçirilməsi, Hakimlərin statusu və müstəqilliyi, Konstitusiya Məhkəməsi, Ali Məhkəmə və Prokurorluq.',
    'Hüquq', 'hard', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '974535e4-bd6b-4b3e-a0dc-93629d4a3483', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '019f6a29-57f8-4793-bbb8-6caed016a845', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi öz səlahiyyətlərinə aid edilən məsələlərə dair qanunlar və qərarlar qəbul edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi öz səlahiyyətlərinə aid edilən məsələlərə dair qanunlar qəbul edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi öz səlahiyyətlərinə aid edilən məsələlərə dair Konstitusiya qanunları və qərarlar qəbul edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi öz səlahiyyətlərinə aid edilən məsələlərə dair qərarlar qəbul edir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi öz səlahiyyətlərinə aid edilən məsələlərə dair qərarlar qəbul edir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4973590f-fc90-4af5-b8a7-42a97dbdd0fa', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '04ee3f22-e87b-4a9e-9689-28247eb4461f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Baş prokurorunun müavinləri hansı qaydada vəzifəyə təyin olunurlar?', 'multiple_choice',
    '["Azərbaycan Respublikası Baş prokurorunun müavinləri Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Milli Məclisi tərəfindən vəzifəyə təyin olunurlar", "Azərbaycan Respublikası Baş prokurorunun müavinləri Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar", "Azərbaycan Respublikası Baş prokurorunun müavinləri Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Məhkəmə-Hüquq Şurası tərəfindən vəzifəyə təyin olunurlar", "Azərbaycan Respublikası Baş prokurorunun müavinləri Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar"]'::jsonb, 'Azərbaycan Respublikası Baş prokurorunun müavinləri Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab B variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0c492bf8-b2c4-46e7-b7d3-f5f7499ceceb', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '07a4305f-4297-4ddf-b600-092f1d4e6b74', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsinin həll etdiyi məsələlərdən biri düzgün göstərilməyib.', 'multiple_choice',
    '["Mərkəzi icra hakimiyyəti orqanlarının normativ hüquqi aktlarının Azərbaycan Respublikası Konstitusiyasına uyğunluğunu müəyyən etmək", "Mərkəzi icra hakimiyyəti orqanlarının normativ hüquqi aktlarının Azərbaycan Respublikası Prezidentinin sərəncamlarına uyğunluğunu müəyyən etmək", "Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarlarının Azərbaycan Respublikası Prezidentinin fərmanlarına və Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarına uyğunluğunu müəyyən etmək", "Azərbaycan Respublikasının hökumətlərarası müqavilələrinin Azərbaycan Respublikası Konstitusiyasına və qanunlarına uyğunluğunu müəyyən etmək"]'::jsonb, 'Mərkəzi icra hakimiyyəti orqanlarının normativ hüquqi aktlarının Azərbaycan Respublikası Prezidentinin sərəncamlarına uyğunluğunu müəyyən etmək', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab B variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 2, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '036a361a-df0f-4840-89ba-6f1e94869422', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '09ad3f22-bae2-4433-81a4-e4380a904231', 'Azərbaycan Respublikasının Konstitusiyasına əsasən cinayət məhkəmə icraatında hansı subyektlər iştirak edirlər?', 'multiple_choice',
    '["cinayət məhkəmə icraatında dövlət və ittiham olunan tərəf iştirak edir;", "cinayət məhkəmə icraatında məhkəmə və müdafiə tərəfi iştirak edir;", "cinayət məhkəmə icraatında Azərbaycan Respublikasının Prokurorluğu və ittiham olunan tərəf iştirak edir;", "cinayət məhkəmə icraatında Azərbaycan Respublikasının Prokurorluğu və müdafiə tərəfi iştirak edir."]'::jsonb, 'cinayət məhkəmə icraatında Azərbaycan Respublikasının Prokurorluğu və müdafiə tərəfi iştirak edir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab D variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 3, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3a1a4894-f3e5-4950-8a4b-fa1fef6176b9', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '121690e6-77fa-4415-907d-803ea9c3551c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hakimlərin vəzifədən kənarlaşdırılması təşəbbüsünü kim və necə irəli sürə bilər?', 'multiple_choice',
    '["Hakimlərin vəzifədən kənarlaşdırılması təşəbbüsünü hakimlər cinayət törətdikdə Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Ali Məhkəməsinin rəyi əsasında Azərbaycan Respublikasının Milli Məclisi qarşısında irəli sürə bilər;", "Hakimlərin vəzifədən kənarlaşdırılması təşəbbüsünü hakimlər cinayət törətdikdə Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi əsasında Azərbaycan Respublikasının Milli Məclisi qarşısında irəli sürə bilər;", "Hakimlərin vəzifədən kənarlaşdırılması təşəbbüsünü hakimlər cinayət törətdikdə Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Ali Məhkəməsinin rəyi əsasında Azərbaycan Respublikasının Məhkəmə-Hüquq Şurası qarşısında irəli sürə bilər;", "Hakimlərin vəzifədən kənarlaşdırılması təşəbbüsünü hakimlər cinayət törətdikdə Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi əsasında Azərbaycan Respublikasının Məhkəmə-Hüquq Şurası qarşısında irəli sürə bilər."]'::jsonb, 'Hakimlərin vəzifədən kənarlaşdırılması təşəbbüsünü hakimlər cinayət törətdikdə Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikası Ali Məhkəməsinin rəyi əsasında Azərbaycan Respublikasının Milli Məclisi qarşısında irəli sürə bilər;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab A variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 4, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a76cee63-91df-4107-bb3c-8c10d9b6668d', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '19db830a-dfa8-4b0a-b11b-d7589d258b5b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Hakimlər müstəqildir, yalnız Azərbaycan Respublikasının Konstitusiyasına, qanunlarına və Azərbaycan Respublikası Prezidentinin fərmanlarına tabedirlər və səlahiyyətləri müddətində dəyişilməzdirlər.", "Hakimlər müstəqildir, yalnız Azərbaycan Respublikasının Konstitusiyasına və qanunlarına tabedirlər və bütün hallarda dəyişilməzdirlər.", "Hakimlər müstəqildir, yalnız Azərbaycan Respublikasının Konstitusiyasına və qanunlarına tabedirlər və səlahiyyətləri müddətində dəyişilməzdirlər.", "Hakimlər müstəqildir, yalnız Azərbaycan Respublikasının Konstitusiyasına və qanunlarına və Azərbaycan Respublikasının Məhkəmə Hüquq-Şurasının aktlarına tabedirlər və səlahiyyətləri müddətində dəyişilməzdirlər."]'::jsonb, 'Hakimlər müstəqildir, yalnız Azərbaycan Respublikasının Konstitusiyasına və qanunlarına tabedirlər və səlahiyyətləri müddətində dəyişilməzdirlər.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a5992a50-6604-46d5-b419-97a5b3ac5ae3', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '1eaf04bd-cbbe-40d3-a77a-e6a241225204', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmələrin səlahiyyətlərinin dəyişdirilməsi məqsədilə müəyyən olunmamış hüquqi üsulların tətbiq edilməsi və fövqəladə məhkəmələrin yaradılmasına yol verilirmi?', 'multiple_choice',
    '["məhkəmələrin səlahiyyətlərinin dəyişdirilməsi məqsədilə müəyyən olunmamış hüquqi üsulların tətbiq edilməsi və fövqəladə məhkəmələrin yaradılması qadağandır;", "məhkəmələrin səlahiyyətlərinin dəyişdirilməsi məqsədilə müəyyən olunmamış hüquqi üsulların tətbiq edilməsi və fövqəladə məhkəmələrin yaradılmasına yalnız hərbi vəziyyət dövründə yol verilir;", "məhkəmələrin səlahiyyətlərinin dəyişdirilməsi məqsədilə müəyyən olunmamış hüquqi üsulların tətbiq edilməsi və fövqəladə məhkəmələrin yaradılmasına yalnız müharibə dövründə yol verilir;", "məhkəmələrin səlahiyyətlərinin dəyişdirilməsi məqsədilə müəyyən olunmamış hüquqi üsulların tətbiq edilməsi və fövqəladə məhkəmələrin yaradılmasına yalnız Konstitusiya Məhkəməsinin razılığı ilə yol verilir."]'::jsonb, 'məhkəmələrin səlahiyyətlərinin dəyişdirilməsi məqsədilə müəyyən olunmamış hüquqi üsulların tətbiq edilməsi və fövqəladə məhkəmələrin yaradılması qadağandır;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab A variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 6, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0cd013c9-2406-4f12-a068-72532b475fe7', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '25985201-d7ec-4324-9a7e-042deb22f3cf', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Hər bir vətəndaş onun hüquq və azadlıqlarını pozan qanunvericilik və icra hakimiyyəti orqanlarının normativ aktlarından, bələdiyyə və məhkəmə aktlarından qanunla müəyyən edilmiş qaydada bu maddənin III hissəsinin 1-7-ci bəndlərində göstərilən məsələlərin Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən həll edilməsi üçün Azərbaycan Respublikasının Konstitusiya Məhkəməsinə pozulmuş insan hüquq və azadlıqlarının bərpa edilməsi məqsədi ilə şikayət verə bilər.", "Hər kəs onun hüquq və azadlıqlarını pozan qanunvericilik və icra hakimiyyəti orqanlarının normativ aktlarından, bələdiyyə və məhkəmə aktlarından qanunla müəyyən edilmiş qaydada bu maddənin III hissəsinin 1-7-ci bəndlərində göstərilən məsələlərin Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən həll edilməsi üçün Azərbaycan Respublikasının Konstitusiya Məhkəməsinə pozulmuş insan hüquq və azadlıqlarının bərpa edilməsi məqsədi ilə şikayət verə bilər.", "Hər kəs onun hüquq və azadlıqlarını pozan qanunvericilik və icra hakimiyyəti orqanlarının normativ aktlarından, bələdiyyə və məhkəmə aktlarından qanunla müəyyən edilmiş qaydada bu maddənin III hissəsinin 1-7-ci bəndlərində göstərilən məsələlərin Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən həll edilməsi üçün Azərbaycan Respublikasının Konstitusiya Məhkəməsinə pozulmuş insan hüquq və azadlıqlarının bərpa edilməsi məqsədi ilə nota verə bilər.", "Hər bir şəxs onun hüquq və azadlıqlarını pozan qanunvericilik və icra hakimiyyəti orqanlarının normativ aktlarından, bələdiyyə və məhkəmə aktlarından qanunla müəyyən edilmiş qaydada bu maddənin III hissəsinin 1-7-ci bəndlərində göstərilən məsələlərin Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən həll edilməsi üçün Azərbaycan Respublikasının Konstitusiya Məhkəməsinə pozulmuş insan hüquq və azadlıqlarının bərpa edilməsi məqsədi ilə ərizə verə bilər."]'::jsonb, 'Hər kəs onun hüquq və azadlıqlarını pozan qanunvericilik və icra hakimiyyəti orqanlarının normativ aktlarından, bələdiyyə və məhkəmə aktlarından qanunla müəyyən edilmiş qaydada bu maddənin III hissəsinin 1-7-ci bəndlərində göstərilən məsələlərin Azərbaycan Respublikasının Konstitusiya Məhkəməsi tərəfindən həll edilməsi üçün Azərbaycan Respublikasının Konstitusiya Məhkəməsinə pozulmuş insan hüquq və azadlıqlarının bərpa edilməsi məqsədi ilə şikayət verə bilər.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bb049d5a-5c75-4e66-957a-4190eee743b7', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '2a5cea69-efb8-4187-8ed9-aca165703502', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmə icraatı hansı prinsipə əsaslanır?', 'multiple_choice',
    '["Məhkəmə icraatı ədalət prinsipi əsasında həyata keçirilir.", "Məhkəmə icraatı qərəzsizlik prinsipi əsasında həyata keçirilir.", "Məhkəmə icraatı çəkişmə prinsipi əsasında həyata keçirilir.", "Məhkəmə icraatı qanunçuluq prinsipi əsasında həyata keçirilir."]'::jsonb, 'Məhkəmə icraatı çəkişmə prinsipi əsasında həyata keçirilir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 8, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e2076d7c-0c29-4c9e-8ba7-c4c4b5b0b8a8', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '2c5409fe-d54d-43e1-a042-94195abae7f7', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının Nazirlər Kabinetinin qəbul etdiyi qərarlar hansı aktlara zidd olmamalıdır?
1. Azərbaycan Respublikası Prezidentinin sərəncamlarına
2. Azərbaycan Respublikası qanunlarına
3. Azərbaycan Respublikası Nazirlər Kabinetinin sərəncamlarına
4. Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarına
5. Azərbaycan Respublikası Konstitusiyasına
6. Azərbaycan Respublikası Prezidentinin fərmanlarına', 'multiple_choice',
    '["2,4,5,6", "1,3,4,5", "1,2,4,6", "3,4,5,6"]'::jsonb, '2,4,5,6', 'AR Konstitusiyası Maddə 133 (Azərbaycan Respublikasının Prokurorluğu) — Düzgün cavab A variantıdır. AR Prokurorluğu vahid mərkəzləşdirilmiş orqandır. AR Baş Prokuroru Prezidentin təqdimatı ilə MM-in razılığı ilə 5 il müddətinə təyin olunur.', 9, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '40a4c872-f942-4c69-aec1-79ff92f01271', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '2c5692c1-81a2-468d-870e-56527d52cb68', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının apellyasiya məhkəmələri qanunla onların səlahiyyətlərinə aid edilmiş işlər üzrə yuxarı instansiyavə kassasiya məhkəmələridir.", "Azərbaycan Respublikasının apellyasiya məhkəmələri qanunla onların səlahiyyətlərinə aid edilmiş işlər üzrə ali instansiya məhkəmələridir.", "Azərbaycan Respublikasının apellyasiya məhkəmələri qanunla onların səlahiyyətlərinə aid edilmiş işlər üzrə birinci instansiya məhkəmələridir.", "Azərbaycan Respublikasının apellyasiya məhkəmələri qanunla onların səlahiyyətlərinə aid edilmiş işlər üzrə yuxarı instansiya məhkəmələridir."]'::jsonb, 'Azərbaycan Respublikasının apellyasiya məhkəmələri qanunla onların səlahiyyətlərinə aid edilmiş işlər üzrə yuxarı instansiya məhkəmələridir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 10, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8e660860-d78a-409d-b017-f02cee127dd3', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '2c6f9f92-f538-47d3-8b32-ac79f71e7d70', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmələr hansı məsələlərlə bağlı Konstitusiya Məhkəməsinə müraciət edə bilərlər?', 'multiple_choice',
    '["Azərbaycan Respublikasının qanunları ilə müəyyən edilmiş qaydada məhkəmələr yalnız vətəndaşların hüquq və azadlıqlarının həyata keçirilməsi məsələləri ilə bağlı Azərbaycan Respublikası Konstitusiyasının və qanunlarının şərh edilməsi haqqında Azərbaycan Respublikasının Konstitusiya Məhkəməsinə müraciət edə bilərlər.", "Azərbaycan Respublikasının qanunları ilə müəyyən edilmiş qaydada məhkəmələr insan hüquq və azadlıqlarının həyata keçirilməsi məsələləri ilə bağlı Azərbaycan Respublikası Konstitusiyası və qanunlarından izahat verilməsi haqqında Azərbaycan Respublikasının Konstitusiya Məhkəməsinə müraciət edə bilərlər.", "Azərbaycan Respublikasının qanunları ilə müəyyən edilmiş qaydada məhkəmələr insan hüquq və azadlıqlarının həyata keçirilməsi məsələləri ilə bağlı Azərbaycan Respublikası Konstitusiyasının və qanunlarının şərh edilməsi haqqında Azərbaycan Respublikasının Konstitusiya Məhkəməsinə müraciət edə bilərlər.", "Azərbaycan Respublikasının qanunları ilə müəyyən edilməmiş qaydada məhkəmələr insan hüquq və azadlıqlarının həyata keçirilməsi məsələləri ilə bağlı Azərbaycan Respublikası Konstitusiyasının və qanunlarının şərh edilməsi haqqında Azərbaycan Respublikasının Konstitusiya Məhkəməsinə müraciət edə bilərlər."]'::jsonb, 'Azərbaycan Respublikasının qanunları ilə müəyyən edilmiş qaydada məhkəmələr insan hüquq və azadlıqlarının həyata keçirilməsi məsələləri ilə bağlı Azərbaycan Respublikası Konstitusiyasının və qanunlarının şərh edilməsi haqqında Azərbaycan Respublikasının Konstitusiya Məhkəməsinə müraciət edə bilərlər.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab C variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 11, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '27858f28-b2b8-41e0-904e-cc0599738286', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '303d86d1-a562-4d2c-a4a5-f170e805d6f5', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hakimliyə namizədlərə aid tələblərə aiddir', 'multiple_choice',
    '["Seçkilərdə iştirak etmək hüququna malik olan, ali təhsilli və hüquqşünas ixtisası üzrə 5 ildən artıq işləyən Azərbaycan Respublikası vətəndaşları hakim ola bilərlər", "Seçkilərdə iştirak etmək hüququna malik olan, ali hüquq təhsilli və hüquqşünas ixtisası üzrə 5 ildən artıq işləyən Azərbaycan Respublikası vətəndaşları hakim ola bilərlər", "Seçkilərdə iştirak etmək hüququna malik olan, ali hüquq təhsilli və hüquqşünas ixtisası üzrə 10 ildən artıq işləyən Azərbaycan Respublikası vətəndaşları hakim ola bilərlər", "Seçkilərdə iştirak etmək hüququna malik olan, ali hüquq təhsilli və ixtisası üzrə 5 ildən artıq işləyən Azərbaycan Respublikası vətəndaşları hakim ola bilərlər"]'::jsonb, 'Seçkilərdə iştirak etmək hüququna malik olan, ali hüquq təhsilli və hüquqşünas ixtisası üzrə 5 ildən artıq işləyən Azərbaycan Respublikası vətəndaşları hakim ola bilərlər', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab B variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 12, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '594a0c9d-01d5-488c-8d98-89d81e632f88', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '32bd1ab6-f9de-43f1-8442-c76fd6141099', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Prokurorluğunun səaliyyətlərinə aidir
1. Bütün hallarda qanunların icra və tətbiq olunmasına nəzarət edir
2. Qanunla nəzərdə tutulmuş hallarda cinayət işləri başlayır və istintaq aparır
3. Kassasiya qaydasında ədalət mühakiməsini həyata keçirir
4. Məhkəmədə iddia qaldırır; məhkəmə qərarlarından protest verir
5. Məhkəmələrin praktikasına aid məsələlər üzrə izahatlar verir
6. Məhkəmədə dövlət ittihamını müdafiə edir', 'multiple_choice',
    '["2,4,6", "1,3,5", "2,3,4", "1,2,5"]'::jsonb, '2,4,6', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab A variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 13, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'fb59203d-52ae-4d49-9c7b-ef4464545baf', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '35ab3478-7b8d-46cd-90b3-f28668e57de6', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasında məhkəmə hakimiyyətini hansı orqanlar və necə həyata keçirirlər?', 'multiple_choice',
    '["Azərbaycan Respublikasında məhkəmə hakimiyyətini ədalət mühakiməsi yolu ilə məhkəmələr və prokurorluq orqanları həyata keçirirlər;", "Azərbaycan Respublikasında məhkəmə hakimiyyətini səsvermə yolu ilə əhalinin seçdiyi müstəqil nümayəndələr həyata keçirirlər;", "Azərbaycan Respublikasında məhkəmə hakimiyyətini ədalət mühakiməsi yolu ilə məhkəmələr həyata keçirirlər;", "Azərbaycan Respublikasında məhkəmə hakimiyyətini ədalət mühakiməsi yolu ilə əhalinin seçdiyi inzibati orqanlar həyata keçirirlər."]'::jsonb, 'Azərbaycan Respublikasında məhkəmə hakimiyyətini ədalət mühakiməsi yolu ilə məhkəmələr həyata keçirirlər;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 14, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c89125ad-5e3b-4633-b8e3-65a9f753c43a', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '3784e46b-f061-46f6-9e7a-21922bbefc7c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsinin həll etdiyi məsələləri seçin
1)Azərbaycan Respublikası Prezidentinin fərmanlarının, Azərbaycan Respublikası qərarlarına uyğunluğunu müəyyən etmək
2)Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarının, Azərbaycan Respublikası qanunlarına uyğunluğunu müəyyən etmək
3)mərkəzi icra hakimiyyəti orqanlarının normativ hüquqi aktlarının Azərbaycan Respublikası qanunlarına uyğunluğunu müəyyən etmək
4) Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarının, Azərbaycan Respublikası Prezidentin sərəncamlarına uyğunluğunu müəyyən etmək
5)mərkəzi icra hakimiyyəti orqanlarının normativ hüquqi aktlarının Azərbaycan Respublikası Prezidentinin fərmanlarına uyğunluğunu müəyyən etmək
6) Azərbaycan Respublikası Ali Məhkəməsinin qərarlarının qanunda nəzərdə tutulmamış hallarda Azərbaycan Respublikası Konstitusiyasına və qanunlarına uyğunluğunu müəyyən etmək', 'multiple_choice',
    '["1,4,6", "2,3,5", "1,2,3", "4,5,6"]'::jsonb, '2,3,5', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab B variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 15, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ebee00ee-e23d-4af4-933a-6af7a4b7393f', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '38612b85-b175-4a7d-8dfd-a03570ccc38f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən respublika ixtisaslaşdırılmış prokurorluqlara rəhbərlik edən prokurorlar hansı qaydada vəzifəyə təyin olunurlar?', 'multiple_choice',
    '["Respublika ixtisaslaşdırılmış prokurorluqlara rəhbərlik edən prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Milli Məclisi tərəfindən vəzifəyə təyin olunurlar", "Respublika ixtisaslaşdırılmış prokurorluqlara rəhbərlik edən prokurorlar Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar", "Respublika ixtisaslaşdırılmış prokurorluqlara rəhbərlik edən prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Məhkəmə-Hüquq Şurası tərəfindən vəzifəyə təyin olunurlar", "Respublika ixtisaslaşdırılmış prokurorluqlara rəhbərlik edən prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar"]'::jsonb, 'Respublika ixtisaslaşdırılmış prokurorluqlara rəhbərlik edən prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab D variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '12276739-ece9-4079-8ad2-3c2aa5bdbac1', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '391ec593-9c30-47e5-88cc-9c6cf5707d96', 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi və Azərbaycan Respublikasının apellyasiya məhkəmələri hakimlərinin işdən kənarlaşdırılması haqqında qərarı hansı orqan qəbul edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Milli Məclisi 83 səs çoxluğu ilə qəbul edir;", "Azərbaycan Respublikasının Milli Məclisi 95 səs çoxluğu ilə qəbul edir;", "Azərbaycan Respublikasının Məhkəmə-Hüquq Şurası üzvlərinin 2/3 səs çoxluğu ilə qəbul edir;", "Azərbaycan Respublikasının Məhkəmə-Hüquq Şurası üzvlərinin 3/4 səs çoxluğu ilə qəbul edir."]'::jsonb, 'Azərbaycan Respublikasının Milli Məclisi 83 səs çoxluğu ilə qəbul edir;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab A variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 17, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0db77304-9ae2-469d-bca5-a85361f32907', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '3ad21b18-cd55-4d10-bf43-6adcfab02a77', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Ali Məhkəməsi hansı məsələlər üzrə izahatlar verir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Ali Məhkəməsi məhkəmələrin fəaliyyətinin təşkilinə aid məsələlər üzrə izahatlar verir;", "Azərbaycan Respublikasının Ali Məhkəməsi məhkəmələrin fəaliyyət istiqamətlərinə aid məsələlər üzrə izahatlar verir;", "Azərbaycan Respublikasının Ali Məhkəməsi məhkəmələrin praktikasına aid məsələlər üzrə izahatlar verir;", "Azərbaycan Respublikasının Ali Məhkəməsi məhkəmələrin fəaliyyət bölgüsünə aid məsələlər üzrə izahatlar verir."]'::jsonb, 'Azərbaycan Respublikasının Ali Məhkəməsi məhkəmələrin praktikasına aid məsələlər üzrə izahatlar verir;', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab C variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 18, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4d93885d-a510-4903-bb68-76433c4bb4c3', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '3c9c5e80-24b9-49ce-a564-d62dbfb8d814', 'Azərbaycan Respublikasının Konstitusiyasında Azərbaycan Respublikasının Ali məhkəməsinin statusu necə müəyyən olunur?', 'multiple_choice',
    '["Azərbaycan Respublikasının Ali məhkəməsi ümumi və ixtisaslaşdırılmış məhkəmələrin icraatına aid edilən mülki, cinayət və digər işlər üzrə ali məhkəmə orqanıdır; o, qanunla müəyyən edilə işlər üzrə birinci instansiya məhkəməsi kimi ədalət mühakiməsini həyata keçirir;", "Azərbaycan Respublikasının Ali məhkəməsi ümumi və ixtisaslaşdırılmış məhkəmələrin icraatına aid edilən mülki, cinayət və digər işlər üzrə ali məhkəmə orqanıdır; o, apelyasiya qaydasında ədalət mühakiməsini həyata keçirir;", "Azərbaycan Respublikasının Ali məhkəməsi ümumi və ixtisaslaşdırılmış məhkəmələrin icraatına aid edilən mülki, cinayət və digər işlər üzrə ali məhkəmə orqanıdır; o, kassasiya qaydasında ədalət mühakiməsini həyata keçirir;", "Azərbaycan Respublikasının Ali məhkəməsi Azərbaycan Respublikasının ali məhkəmə orqanıdır; o, bütün məhkəmələrin fəaliyyətinə rəhbərlik və nəzarət edir."]'::jsonb, 'Azərbaycan Respublikasının Ali məhkəməsi ümumi və ixtisaslaşdırılmış məhkəmələrin icraatına aid edilən mülki, cinayət və digər işlər üzrə ali məhkəmə orqanıdır; o, kassasiya qaydasında ədalət mühakiməsini həyata keçirir;', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab C variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 19, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b6609468-7a6f-48ad-a7e0-91db53c4fb5b', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '3d94b75c-5622-4a2f-bbf9-fd2a573123e0', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Konstitusiya Məhkəməsinin hakimləri necə təyin edilir?', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiya Məhkəməsinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir;", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin hakimlərini Azərbaycan Respublikası Milli Məclisinin sədrinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir;", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin hakimlərini Azərbaycan Respublikasının Milli Məclisinin təqdimatı ilə Azərbaycan Respublikasının Prezidenti təyin edir;", "Azərbaycan Respublikası Konstitusiya Məhkəməsinin hakimlərini yarısını Azərbaycan Respublikası Prezidenti, digər yarısını isə Azərbaycan Respublikasının Milli Məclisi təyin edir."]'::jsonb, 'Azərbaycan Respublikası Konstitusiya Məhkəməsinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab A variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 20, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9cb4cc87-422c-4540-84bd-f566b39f3f9b', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '4309f51c-e5d8-4b4c-8e02-7a9395c959ca', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmə quruluşu və məhkəmə icraatı qaydası hansı normativ-hüquqi aktla müəyyən olunur?', 'multiple_choice',
    '["məhkəmə quruluşu və məhkəmə icraatı qaydası Konstitusiya ilə müəyyən olunur;", "məhkəmə quruluşu və məhkəmə icraatı qaydası Konstitusiya qanunu ilə müəyyən olunur;", "məhkəmə quruluşu və məhkəmə icraatı qaydası qanunla müəyyən olunur;", "məhkəmə quruluşu və məhkəmə icraatı qaydası müvafiq icra hakimiyyəti orqanının normativ-hüquqi aktı ilə müəyyən olunur."]'::jsonb, 'məhkəmə quruluşu və məhkəmə icraatı qaydası qanunla müəyyən olunur;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 21, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4dbac1d5-9ecc-4260-9f89-75b6d947b59f', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '47b0c688-70ca-4285-bdfe-93f9182bbee5', 'Azərbaycan Respublikasının Baş nazirini tutan orqan bu barədə dərhal kimə xəbər verməlidir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş nazirini tutan orqan bu barədə dərhal Azərbaycan Respublikasının Prezidentinə xəbər verməlidir;", "Azərbaycan Respublikasının Baş nazirini tutan orqan bu barədə dərhal Azərbaycan Respublikasının Baş prokuroruna xəbər verməlidir;", "Azərbaycan Respublikasının Baş nazirini tutan orqan bu barədə dərhal Azərbaycan Respublikasının Milli Məclisinin sədrinə xəbər verməlidir;", "Azərbaycan Respublikasının Baş nazirini tutan orqan bu barədə dərhal Azərbaycan Respublikasının Ali məhkəməsinin sədrinə xəbər verməlidir."]'::jsonb, 'Azərbaycan Respublikasının Baş nazirini tutan orqan bu barədə dərhal Azərbaycan Respublikasının Baş prokuroruna xəbər verməlidir;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab B variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 22, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8fcb2ba8-9389-4325-803c-8eb7171b8862', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '4893796b-b21c-4a5b-8c42-f9fa8227cb6b', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Ali Məhkəməsinin hakimlərini vəzifəyə kim təyin edir?', 'multiple_choice',
    '["Ali Məhkəməsinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir.", "Ali Məhkəməsinin hakimlərini Azərbaycan Respublikası Prezidenti təyin edir.", "Ali Məhkəməsinin hakimlərini Azərbaycan Respublikası Konstitusiya Məhkəməsinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir.", "Ali Məhkəməsinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Konstitusiya Məhkəməsi təyin edir."]'::jsonb, 'Ali Məhkəməsinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab A variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 23, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2ea0f257-e9f4-4663-840f-f6ddb4666fc0', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '49eedcba-7176-46eb-9572-bad607ce7542', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Baş nazirinin toxunulmazlığına necə xitam verilə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikası Baş nazirinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Milli Məclisi tərəfindən xitam verilə bilər;", "Azərbaycan Respublikası Baş nazirinin toxunulmazlığına yalnız Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Azərbaycan Respublikasının Milli Məclisi tərəfindən xitam verilə bilər;", "Azərbaycan Respublikası Baş nazirinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Prezidenti tərəfindən xitam verilə bilər;", "Azərbaycan Respublikası Baş nazirinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Ali Məhkəməsi tərəfindən xitam verilə bilər."]'::jsonb, 'Azərbaycan Respublikası Baş nazirinin toxunulmazlığına yalnız Azərbaycan Respublikası Baş prokurorunun təqdimatına əsasən Azərbaycan Respublikasının Prezidenti tərəfindən xitam verilə bilər;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 24, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd99374d0-e0a4-499c-a04c-1358922c22ef', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '4d23921f-83ca-4e59-8415-5bcb8af0e373', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmənin qəbul etdiyi qərarlar kimin adından çıxarılır?', 'multiple_choice',
    '["Məhkəmənin qəbul etdiyi qərarlar Respublikanın adından çıxarılır və onların icrası məcburidir.", "Məhkəmənin qəbul etdiyi qərarlar dövlətin adından çıxarılır və onların icrası məcburidir.", "Məhkəmənin qəbul etdiyi qərarlar məhkəmənin adından çıxarılır və onların icrası məcburidir.", "Məhkəmənin qəbul etdiyi qərarlar hüquqi şəxsin adından çıxarılır və onların icrası məcburi deyil"]'::jsonb, 'Məhkəmənin qəbul etdiyi qərarlar dövlətin adından çıxarılır və onların icrası məcburidir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab B variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 25, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b8c52fa6-16c3-418f-b552-30b11dd87519', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '4d25974e-7f9b-498e-a0d4-ffd2a9042706', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Prokurorluğuna aiddir', 'multiple_choice',
    '["Ərazi və ixtisaslaşdırılmış prokurorların, həmçinin yerli ədliyyə orqanlarının Azərbaycan Respublikasının Baş prokuroruna tabeliyinə əsaslanan vahid mərkəzləşdirilmiş orqandır", "Ərazi və ixtisaslaşdırılmış prokurorların Azərbaycan Respublikasının Baş prokuroruna tabeliyinə əsaslanan vahid mərkəzləşdirilmiş orqandır", "Ərazi və ixtisaslaşdırılmış prokurorların Azərbaycan Respublikasının Baş prokuroruna ikili tabeliyinə əsaslanan orqandır", "Ərazi prokurorların Azərbaycan Respublikasının Baş prokuroruna tabeliyinə əsaslanan vahid mərkəzləşdirilməmiş orqandır"]'::jsonb, 'Ərazi və ixtisaslaşdırılmış prokurorların Azərbaycan Respublikasının Baş prokuroruna tabeliyinə əsaslanan vahid mərkəzləşdirilmiş orqandır', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab B variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 26, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'af5198c6-4f99-4a5a-b750-573518c21c81', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '54df07b6-233a-42f4-8684-f54810f4077f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən yerlərdə icra hakimiyyəti maddəsinə aid deyil', 'multiple_choice',
    '["Yerlərdə icra hakimiyyətini yerli icra hakimiyyətlərinin başçıları həyata keçirirlər.", "İcra hakimiyyəti başçılarını Azərbaycan Respublikasının Prezidenti vəzifədən azad edir.", "Yerli icra hakimiyyətlərinin səlahiyyətlərini Azərbaycan Respublikasının Prezidenti müəyyən edir.", "Yerli İcra hakimiyyəti başçılarını Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Milli Məclisinin razılığı ilə vəzifəyə təyin edir."]'::jsonb, 'Yerli İcra hakimiyyəti başçılarını Azərbaycan Respublikasının Prezidenti Azərbaycan Respublikasının Milli Məclisinin razılığı ilə vəzifəyə təyin edir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab D variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 27, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6883c45b-c92d-4b1e-8553-92251deccbac', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '64b218fa-5df4-40a3-852b-4da42044aa48', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Qanunlar və digər aktlar yaxud onların ayrı-ayrı müddəaları, Azərbaycan Respublikasının hökumətlərarası müqavilələri Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarında müəyyən edilmiş müddətdə qüvvədən düşməyə bilər, Azərbaycan Respublikasının dövlətlərarası müqavilələri isə qüvvəyə minmir.", "Qanunlar və digər aktlar yaxud onların ayrı-ayrı müddəaları, Azərbaycan Respublikasının hökumətlərarası müqavilələri Azərbaycan Respublikası Prezidentinin fərmanında müəyyən edilmiş müddətdə qüvvədən düşür, Azərbaycan Respublikasının dövlətlərarası müqavilələri isə qüvvəyə minir", "Qanunlar və digər aktlar yaxud onların ayrı-ayrı müddəaları, Azərbaycan Respublikasının hökumətlərarası müqavilələri Azərbaycan Respublikası Milli Məclisinin qərarında müəyyən edilmiş müddətdə qüvvədən düşür, Azərbaycan Respublikasının dövlətlərarası müqavilələri isə qüvvəyə minmir.", "Qanunlar və digər aktlar yaxud onların ayrı-ayrı müddəaları, Azərbaycan Respublikasının hökumətlərarası müqavilələri Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarında müəyyən edilmiş müddətdə qüvvədən düşür, Azərbaycan Respublikasının dövlətlərarası müqavilələri isə qüvvəyə minmir."]'::jsonb, 'Qanunlar və digər aktlar yaxud onların ayrı-ayrı müddəaları, Azərbaycan Respublikasının hökumətlərarası müqavilələri Azərbaycan Respublikası Konstitusiya Məhkəməsinin qərarında müəyyən edilmiş müddətdə qüvvədən düşür, Azərbaycan Respublikasının dövlətlərarası müqavilələri isə qüvvəyə minmir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 28, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e387fdf3-4ca2-47ac-a2fb-9416cb58fb0d', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '68e5c12a-895b-42d8-b0eb-1f41e1d16906', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hakimlərə aid olan məhdudiyyətləri müəyyən edin:
1)seçkili və təyinatlı vəzifə tutmaq
2)elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olmaq
3)sahibkarlıq, kommersiya və digər ödənişli fəaliyyətlə məşğul olmaq
4) siyasi fəaliyyətlə məşğul olmaq
5) siyasi partiyalara üzv olmaq
6)vəzifə məvacibi almaq
7) elmi, pedaqoji və yaradıcılıq fəaliyyətinə görə vəsait almaq', 'multiple_choice',
    '["2,4,6,7", "3,4,5,6", "1,3,4,5", "1,2,6,7"]'::jsonb, '1,3,4,5', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 29, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '02bc5b0b-b45e-45f9-904b-13958be3bcdb', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '768a13c8-b23d-49cc-b0e6-093214e84d62', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğru olmayan variantı seçin', 'multiple_choice',
    '["Hakimlər işlərə qərəzsiz, ədalətlə, tərəflərin hüquq bərabərliyinə, faktlara əsasən və qanuna müvafiq baxırlar.", "Hər hansı bir şəxs tərəfindən və hər hansı bir səbəbdən bilavasitə, yaxud dolayı yolla məhkəmə icraatına məhdudiyyət qoyulması, qanunla zidd təsir, hədə və müdaxilə edilməsi yolverilməzdir.", "Ədalət mühakiməsi vətəndaşların qanun və məhkəmə qarşısında bərabərliyi əsasında həyata keçirilir.", "Yalnız qanunla nəzərdə tutulmuş hallarda məhkəmələrdə işlərin icraatı açıq aparılır."]'::jsonb, 'Yalnız qanunla nəzərdə tutulmuş hallarda məhkəmələrdə işlərin icraatı açıq aparılır.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab D variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 30, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '58858a1b-85bb-41d3-82a4-b1de6f225afd', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '873b47fb-11ef-4ea5-978e-e88e62523500', 'Azərbaycan Respublikasının Konstitusiyasına əsasən cinayət işlərinin qiyabi məhkəmə icraatına yol verilirmi?', 'multiple_choice',
    '["Qanunda nəzərdə tutulmuş hallar istisna olmaqla, cinayət işlərinin qiyabi məhkəmə icraatına yol verilir", "Qanunda nəzərdə tutulmuş bütün hallarda, cinayət işlərinin qiyabi məhkəmə icraatına yol verilmir.", "Qanunda nəzərdə tutulmuş hallar da daxil olmaqla, cinayət işlərinin qiyabi məhkəmə icraatına yol verilmir.", "Qanunda nəzərdə tutulmuş hallar istisna olmaqla, cinayət işlərinin qiyabi məhkəmə icraatına yol verilmir."]'::jsonb, 'Qanunda nəzərdə tutulmuş hallar istisna olmaqla, cinayət işlərinin qiyabi məhkəmə icraatına yol verilmir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab D variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 31, NULL, 'Qiyabi məhkəmə icraatı yalnız qanunla birbaşa müəyyən olunmuş istisna hallarda mümkündür.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a820b327-b909-42de-8469-4d36bbbb12d2', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '88bde86d-43b4-4046-b972-c54bc53cfda1', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğru deyil', 'multiple_choice',
    '["Hakimlər toxunulmazdırlar.", "Hakimlərin səlahiyyətlərinə yalnız qanunda nəzərdə tutulmuş əsaslara və qaydalara müvafiq surətdə xitam verilə bilər.", "Ədalət mühakiməsi vətəndaşların qanun və inzibati orqan qarşısında bərabərliyi əsasında həyata keçirilir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi və Azərbaycan Respublikasının apellyasiya məhkəmələrindən başqa məhkəmələrin hakimlərinin işdən kənarlaşdırılması haqqında qərar Azərbaycan Respublikasının Milli Məclisində 63 səs çoxluğu ilə qəbul edilir."]'::jsonb, 'Ədalət mühakiməsi vətəndaşların qanun və inzibati orqan qarşısında bərabərliyi əsasında həyata keçirilir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 32, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '22714cb4-ec47-4493-a58b-26e2daf8be72', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '8c2d2581-3437-4825-bb41-51eb744fe0a5', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsinin həll etdiyi məsələlərdən biri doğru deyil
1. bələdiyyə aktlarının Azərbaycan Respublikası Konstitusiyasına, Azərbaycan Respublikası qanunlarına, Azərbaycan Respublikası Prezidentinin fərmanlarına, Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarına (Naxçıvan Muxtar Respublikasında Naxçıvan Muxtar Respublikasının Konstitusiyasına, qanunlarına və Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarlarına uyğunluq istisna olmaqla) uyğunluğunu müəyyən etmək
2. Azərbaycan Respublikasının qüvvəyə minmiş dövlətlərarası müqavilələrinin Azərbaycan Respublikası Konstitusiyasına uyğunluğunu müəyyən etmək
3. Azərbaycan Respublikasının hökumətlərarası müqavilələrinin Azərbaycan Respublikası Konstitusiyasına və qanunlarına uyğunluğunu müəyyən etmək
4. Naxçıvan Muxtar Respublikası Konstitusiyasının, qanunlarının, Naxçıvan Muxtar Respublikası Ali Məclisinin qərarlarının və Nazirlər Kabinetinin qərarlarının Azərbaycan Respublikası Konstitusiyasına uyğunluğunu müəyyən etmək
5. Naxçıvan Muxtar Respublikası qanunlarının, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarlarının Azərbaycan Respublikası qanunlarına uyğunluğunu müəyyən etmək', 'multiple_choice',
    '["1,2", "2,3", "4,5", "3,5"]'::jsonb, '1,2', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab A variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 33, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '91b7516c-29fd-4915-9ba7-8e20260ffe6e', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '8e1f049e-09e4-41f6-ae9a-5f3cf8478efe', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası apellyasiya məhkəmələrinin hakimlərini vəzifəyə kim təyin edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının apellyasiya məhkəmələrinin hakimlərini Azərbaycan Respublikası Prezidentinin razılığı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir.", "Azərbaycan Respublikasının apellyasiya məhkəmələrinin hakimlərini Azərbaycan Respublikası Prezidentinin təklifi ilə Azərbaycan Respublikasının Milli Məclisi təyin edir.", "Azərbaycan Respublikasının apellyasiya məhkəmələrinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisinin sədri təyin edir.", "Azərbaycan Respublikasının apellyasiya məhkəmələrinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir."]'::jsonb, 'Azərbaycan Respublikasının apellyasiya məhkəmələrinin hakimlərini Azərbaycan Respublikası Prezidentinin təqdimatı ilə Azərbaycan Respublikasının Milli Məclisi təyin edir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab D variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 34, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1c05ca02-0de1-4037-a37b-9f2daa4a40d9', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '8e4e5a50-121e-411a-92b0-1ad97c1751e0', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının Azərbaycan Respublikasının Konstitusiyasında təsbit olunmuş statusunu göstərin', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikası Azərbaycan Respublikasının tərkibində muxtar vilayətdir", "Naxçıvan Muxtar Respublikası Azərbaycan Respublikasının tərkibində unitar dövlətdir", "Naxçıvan Muxtar Respublikası Azərbaycan Respublikasının tərkibində müstəqil dövlətdir", "Naxçıvan Muxtar Respublikası Azərbaycan Respublikasının tərkibində muxtar dövlətdir"]'::jsonb, 'Naxçıvan Muxtar Respublikası Azərbaycan Respublikasının tərkibində muxtar dövlətdir', 'AR Konstitusiyası Maddə 133 (Azərbaycan Respublikasının Prokurorluğu) — Düzgün cavab D variantıdır. AR Prokurorluğu vahid mərkəzləşdirilmiş orqandır. AR Baş Prokuroru Prezidentin təqdimatı ilə MM-in razılığı ilə 5 il müddətinə təyin olunur.', 35, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '867fa9d7-2ee2-4f80-af57-847f4cd2f992', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '97c4d807-8038-44aa-8e7b-7c8ebb77496d', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmə icraatı nəyi təmin etməlidir?', 'multiple_choice',
    '["Məhkəmə icraatı demokratikliyin müəyyən edilməsini təmin etməlidir", "Məhkəmə icraatı insaniyyətin müəyyən edilməsini təmin etməlidir", "Məhkəmə icraatı cəmiyyətin hüquq bərabərliyinin müəyyən edilməsini təmin etməlidir", "Məhkəmə icraatı həqiqətin müəyyən edilməsini təmin etməlidir"]'::jsonb, 'Məhkəmə icraatı həqiqətin müəyyən edilməsini təmin etməlidir', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab D variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 36, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2c1fe6b1-8407-4173-a483-4e1a9f6eff8b', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '9aff6174-7ed9-44d9-a0b4-3672978b5a3c', 'Azərbaycan Respublikasının Konstitusiyası, qanunları, Azərbaycan Respublikası Prezidentinin fərmanları və Azərbaycan Respublikası Nazirlər Kabinetinin qərarları Naxçıvan Muxtar Respublikasının ərazisində hansı qüvvəyə malikdir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyası, qanunları, Azərbaycan Respublikası Prezidentinin fərmanları və Azərbaycan Respublikası Nazirlər Kabinetinin qərarları Naxçıvan Muxtar Respublikasının ərazisində tövsiyə xarakteri daşıyır;", "Azərbaycan Respublikasının Konstitusiyası, qanunları, Azərbaycan Respublikası Prezidentinin fərmanları və Azərbaycan Respublikası Nazirlər Kabinetinin qərarları Naxçıvan Muxtar Respublikasının ərazisində məcburidir;", "Azərbaycan Respublikasının Konstitusiyası, qanunları, Azərbaycan Respublikası Prezidentinin fərmanları və Azərbaycan Respublikası Nazirlər Kabinetinin qərarları Naxçıvan Muxtar Respublikasının Ali Məclisi tərəfindən təsdiq edildikdən sonra Muxtar Respublika ərazisində qüvvəyə minir;", "Azərbaycan Respublikasının Konstitusiyası, qanunları, Azərbaycan Respublikası Prezidentinin fərmanları və Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarının Naxçıvan Muxtar Respublikasının ərazisində heç bir hüquqi qüvvəsi yoxdur."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyası, qanunları, Azərbaycan Respublikası Prezidentinin fərmanları və Azərbaycan Respublikası Nazirlər Kabinetinin qərarları Naxçıvan Muxtar Respublikasının ərazisində məcburidir;', 'AR Konstitusiyası Maddə 133 (Azərbaycan Respublikasının Prokurorluğu) — Düzgün cavab B variantıdır. AR Prokurorluğu vahid mərkəzləşdirilmiş orqandır. AR Baş Prokuroru Prezidentin təqdimatı ilə MM-in razılığı ilə 5 il müddətinə təyin olunur.', 37, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3e7ee872-34fe-464d-bf24-e8233544d893', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '9bc7cfdf-2481-4cda-8e99-209296876669', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmədə işə qapalı iclasda baxılmasına hansı halda icazə verilir?', 'multiple_choice',
    '["İşə qapalı iclasda baxılmasına yalnız o halda icazə verilir ki, məhkəmə açıq icraatın dövlət, peşə və kommersiya sirrinin açılmasına səbəb olacağını güman edir, ya da vətəndaşların şəxsi və ya ailə həyatının məxfiliyini qorumaq zərurətini mövcudluğunu müəyyən edir.", "İşə qapalı iclasda baxılmasına yalnız o halda icazə verilir ki, məhkəmə açıq icraatın dövlət, peşə və kommersiya sirrinin açılmasına səbəb olacağını güman edir, ya da vətəndaşların şəxsi və ya ailə həyatının məxfiliyini qorumaq zərurətini mövcudluğunu müəyyən etmir", "İşə qapalı iclasda baxılmasına yalnız o halda icazə verilir ki, məhkəmə açıq icraatın dövlət, peşə və kommersiya sirrinin açılmasına səbəb olamayacağını güman edir, ya da vətəndaşların şəxsi və ya ailə həyatının məxfiliyini qorumaq zərurətini mövcudluğunu müəyyən edir.", "İşə qapalı iclasda baxılmasına yalnız o halda icazə verilir ki, məhkəmə açıq icraatın dövlət, peşə və kommersiya, ictimai informasiyaların sirrinin açılmasına səbəb olacağını güman edir, ya da vətəndaşların şəxsi və ya ailə həyatının məxfiliyini qorumaq zərurətini mövcudluğunu müəyyən edir."]'::jsonb, 'İşə qapalı iclasda baxılmasına yalnız o halda icazə verilir ki, məhkəmə açıq icraatın dövlət, peşə və kommersiya sirrinin açılmasına səbəb olacağını güman edir, ya da vətəndaşların şəxsi və ya ailə həyatının məxfiliyini qorumaq zərurətini mövcudluğunu müəyyən edir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab A variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 38, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '417e2e37-ec7f-4b4d-aec2-717feb8f436d', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', '9d42e038-2ef9-4c80-9096-6dcc539aa696', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmə hakimiyyətini hansı məhkəmələr həyata keçirirlər?', 'multiple_choice',
    '["Məhkəmə hakimiyyətini Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının apellyasiya məhkəmələri, Azərbaycan Respublikasının rayon və şəhər məhkəmələri həyata keçirirlər;", "Məhkəmə hakimiyyətini Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının apellyasiya məhkəmələri, Azərbaycan Respublikasının ümumi məhkəmələri və digər ixtisaslaşdırılmış məhkəmələri həyata keçirirlər;", "Məhkəmə hakimiyyətini Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının apellyasiya məhkəmələri, Azərbaycan Respublikasının Ali İqtisad Məhkəməsi və Azərbaycan Respublikasının ümumi məhkəmələri həyata keçirirlər;", "Məhkəmə hakimiyyətini Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının apellyasiya məhkəmələri, Azərbaycan Respublikasının Ali İnzibati-İqtisad Məhkəməsi və Azərbaycan Respublikasının ümumi məhkəmələri həyata keçirirlər."]'::jsonb, 'Məhkəmə hakimiyyətini Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının apellyasiya məhkəmələri, Azərbaycan Respublikasının ümumi məhkəmələri və digər ixtisaslaşdırılmış məhkəmələri həyata keçirirlər;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab B variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 39, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ba06b3da-8164-484d-a5af-c90bde90b405', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'a1c68061-7c44-4320-9aaa-8833ee18fa42', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasında qanunvericilik, icra və məhkəmə hakimiyyətləri arasında səlahiyyətlər bölgüsü ilə bağlı mübahisəli məsələləri hansı orqan həll edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi", "Azərbaycan Respublikasının Prezidenti", "Azərbaycan Respublikasının Milli Məclisi", "Azərbaycan Respublikasının Prezidenti və Milli Məclisi"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab A variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 40, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '395baba7-d353-489d-ab50-56c29befe062', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'af2fbe36-224b-47ca-b404-3ca3cc8759e2', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikası Ali Məclisinin qəbul etdiyi Naxçıvan Muxtar Respublikasının Konstitusiyası və qanunları hansıaktlara zidd olmamalıdır?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasına və Azərbaycan Respublikası Prezidentinin fərmanlarına", "Azərbaycan Respublikasının qanunlarına və Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarına", "Azərbaycan Respublikasının Konstitusiyasına və qanunlarına", "Azərbaycan Respublikasının qanunlarına və Azərbaycan Respublikası Prezidentinin fərmanlarına"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasına və qanunlarına', 'AR Konstitusiyası Maddə 133 (Azərbaycan Respublikasının Prokurorluğu) — Düzgün cavab C variantıdır. AR Prokurorluğu vahid mərkəzləşdirilmiş orqandır. AR Baş Prokuroru Prezidentin təqdimatı ilə MM-in razılığı ilə 5 il müddətinə təyin olunur.', 41, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1c4aa732-7879-4869-9c07-aa6ab13140e7', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'afd0a7dd-c35d-417f-b998-42afb210fb90', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikası Prokuroru hansı qaydada vəzifəyə təyin olunur?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikası Prokuroru Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Milli Məclisi tərəfindən vəzifəyə təyin olunur", "Naxçıvan Muxtar Respublikası Prokuroru Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunur", "Naxçıvan Muxtar Respublikası Prokuroru Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Məhkəmə-Hüquq Şurası tərəfindən vəzifəyə təyin olunur", "Naxçıvan Muxtar Respublikası Prokuroru Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunur"]'::jsonb, 'Naxçıvan Muxtar Respublikası Prokuroru Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunur', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab B variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 42, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '757668aa-dbd0-424c-9a9f-d13904f004a4', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'bd1b1d5f-36bd-4563-8874-2bb0eb7a6645', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasıın statusu hansı akt ilə müəyyən edilir?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasıın statusu Naxçıvan Muxtar Respublikasıın Konstitusiyası ilə müəyyən edilir", "Naxçıvan Muxtar Respublikasıın statusu Azərbaycan Respublikasının Konstitusiyası ilə müəyyən edilir", "Naxçıvan Muxtar Respublikasıın statusu Qanunla müəyyən edilir", "Naxçıvan Muxtar Respublikasıın statusu Konstitusiya qanunu ilə müəyyən edilir"]'::jsonb, 'Naxçıvan Muxtar Respublikasıın statusu Azərbaycan Respublikasının Konstitusiyası ilə müəyyən edilir', 'AR Konstitusiyası Maddə 133 (Azərbaycan Respublikasının Prokurorluğu) — Düzgün cavab B variantıdır. AR Prokurorluğu vahid mərkəzləşdirilmiş orqandır. AR Baş Prokuroru Prezidentin təqdimatı ilə MM-in razılığı ilə 5 il müddətinə təyin olunur.', 43, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd86c95ff-0b5d-4fcd-b526-ccf02669de4f', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'c0f96bdf-553f-46d7-8d20-6269d984ea5f', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Məhkəmə hakimiyyəti Konstitusiya, mülki ,inzibati və cinayət məhkəmə icraatı vasitəsi ilə və qanunla nəzərdə tutulmuş digər vasitələr ilə həyata keçirilir.", "Məhkəmə hakimiyyəti Konstitusiya, mülki-hüquq və cinayət məhkəmə icraatı vasitəsi ilə və qanunla nəzərdə tutulmuş digər vasitələr ilə həyata keçirilir.", "Məhkəmə hakimiyyəti Konstitusiya qanunları, mülki və cinayət məhkəmə icraatı vasitəsi ilə və qanunla nəzərdə tutulmuş digər vasitələr ilə həyata keçirilir.", "Məhkəmə hakimiyyəti Konstitusiya, mülki və cinayət məhkəmə icraatı vasitəsi ilə və qanunla nəzərdə tutulmuş digər vasitələr ilə həyata keçirilir."]'::jsonb, 'Məhkəmə hakimiyyəti Konstitusiya, mülki və cinayət məhkəmə icraatı vasitəsi ilə və qanunla nəzərdə tutulmuş digər vasitələr ilə həyata keçirilir.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 44, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '71545672-73fe-4d12-a7b3-a80b46c59ba3', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'c6465c72-fdf8-46b6-93e0-c7f990b41824', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hakimlərin vəzifədən kənarlaşdırılmasına dair müvafiq rəyi Azərbaycan Respublikasının Ali Məhkəməsi hansı müddətdə təqdim etməlidir?', 'multiple_choice',
    '["Müvafiq rəyi Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikası Prezidentinin sorğusundan sonra 15 gün müddətində təqdim etməlidir;", "Müvafiq rəyi Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikası Prezidentinin sorğusundan sonra 30 gün müddətində təqdim etməlidir;", "Müvafiq rəyi Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikası Prezidentinin sorğusundan sonra 45 gün müddətində təqdim etməlidir;", "Müvafiq rəyi Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikası Prezidentinin sorğusundan sonra 60 gün müddətində təqdim etməlidir."]'::jsonb, 'Müvafiq rəyi Azərbaycan Respublikasının Ali Məhkəməsi Azərbaycan Respublikası Prezidentinin sorğusundan sonra 30 gün müddətində təqdim etməlidir;', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab B variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 45, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '949c9d7b-3578-44c1-a69e-23485b4fba61', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'cf68a45a-218f-47b0-9944-d7b2bbe059ff', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğru deyil', 'multiple_choice',
    '["Məhkəmə icraatının ilkin mərhələsində hər kəsin müdafiə hüququ təmin olunur.", "Ədalət məhkəməsi təqsirsizlik prezumpsiyasına əsaslanır.", "Azərbaycan Respublikasında məhkəmə icraatı Azərbaycan Respublikasının dövlət dilində və ya müvafiq yerin əhalisinin çoxluq təşkil edən hissəsinin dilində aparılır.", "İşin iştirakçısı olub məhkəmə icraatının aparıldığı dili bilməyən şəxslərin işin materialları ilə tam tanış olmaq, məhkəmədə tərcüməçi vasitəsi ilə iştirak etmək və məhkəmədə ana dilində çıxış etmək hüququ təmin edilir."]'::jsonb, 'Məhkəmə icraatının ilkin mərhələsində hər kəsin müdafiə hüququ təmin olunur.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 46, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '255bb6c4-2acc-49a3-bdd8-2592a1429165', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'dd8d3531-3876-4ef0-9528-28e93f5d8cc8', 'Azərbaycan Respublikasının Konstitusiyasına əsasən ərazi və ixtisaslaşdırılmış prokurorlar hansı qaydada vəzifəyə təyin olunurlar?', 'multiple_choice',
    '["Ərazi və ixtisaslaşdırılmış prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Milli Məclisi tərəfindən vəzifəyə təyin olunurlar", "Ərazi və ixtisaslaşdırılmış prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Prezidenti tərəfindən vəzifəyə təyin olunurlar", "Ərazi və ixtisaslaşdırılmış prokurorlar Azərbaycan Respublikası Baş prokurorunun təqdimatı ilə Azərbaycan Respublikası Məhkəmə-Hüquq Şurası tərəfindən vəzifəyə təyin olunurlar", "Ərazi və ixtisaslaşdırılmış prokurorlar Azərbaycan Respublikası Prezidentinin razılığı ilə Azərbaycan Respublikası Baş prokuroru vəzifəyə təyin olunurlar"]'::jsonb, 'Ərazi və ixtisaslaşdırılmış prokurorlar Azərbaycan Respublikası Prezidentinin razılığı ilə Azərbaycan Respublikası Baş prokuroru vəzifəyə təyin olunurlar', 'AR Konstitusiyası Maddə 133 (Azərbaycan Respublikasının Prokurorluğu) — Düzgün cavab D variantıdır. AR Prokurorluğu vahid mərkəzləşdirilmiş orqandır. AR Baş Prokuroru Prezidentin təqdimatı ilə MM-in razılığı ilə 5 il müddətinə təyin olunur.', 47, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '21cd9eeb-a03f-4088-a9d6-82e64876d45a', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'e24a8c2c-36ab-48bb-85cf-b67ea6cac49d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hakim cinayət məsuliyyətinə hansı qayada cəlb oluna bilər?', 'multiple_choice',
    '["Hakim cinayət məsuliyyətinə yalnız konstitusiyada nəzərdə tutulan qaydada cəlb oluna bilər", "Hakim cinayət məsuliyyətinə yalnız konstitusiya qanununda nəzərdə tutulan qaydada cəlb oluna bilər", "Hakim cinayət məsuliyyətinə yalnız qanunda nəzərdə tutulan qaydada cəlb oluna bilər.", "Hakim cinayət məsuliyyətinə yalnız fərman və sərəncamda nəzərdə tutulan qaydada cəlb oluna bilər"]'::jsonb, 'Hakim cinayət məsuliyyətinə yalnız qanunda nəzərdə tutulan qaydada cəlb oluna bilər.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 48, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '29f49926-140a-473e-b2a9-169b369cb5ba', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'e926979f-3ae7-4ce9-b91e-5484cade0161', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Konstitusiya Məhkəməsinin həll etdiyi məsələlərə aid olmayanı müəyyən edin:', 'multiple_choice',
    '["Azərbaycan Respublikası qanunlarının, Azərbaycan Respublikası Konstitusiyasına uyğunluğunu müəyyən etmək", "Azərbaycan Respublikası Prezidentinin fərman və sərəncamlarının, Azərbaycan Respublikası Konstitusiyasına uyğunluğunu müəyyən etmək", "Azərbaycan Respublikası Milli Məclisinin qərarlarının, Azərbaycan Respublikası Konstitusiya qanunlarına uyğunluğunu müəyyən etmək", "Azərbaycan Respublikası Nazirlər Kabinetinin qərar və sərəncamlarının, Azərbaycan Respublikası Konstitusiyasına uyğunluğunu müəyyən etmək"]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin qərarlarının, Azərbaycan Respublikası Konstitusiya qanunlarına uyğunluğunu müəyyən etmək', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab C variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 49, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '66818e5b-edd8-4f2b-be1d-9961eb4a3030', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'ebc2013c-ed59-45b8-a5fc-9630eabd30f7', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Konstitusiya Məhkəməsi hansı subyektlərin sorğusu əsasında Azərbaycan Respublikasının Konstitusiyasını və qanunlarını şərh edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi Azərbaycan Respublikası Prezidentinin, Azərbaycan Respublikası Milli Məclisinin, Azərbaycan Respublikası Nazirlər Kabinetinin, Azərbaycan Respublikası Ali Məhkəməsinin, Azərbaycan Respublikası Prokurorluğunun, Naxçıvan Muxtar Respublikası Ali Məhkəməsinin sorğusu əsasında Azərbaycan Respublikasının Konstitusiyasını və qanunlarını şərh edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi Azərbaycan Respublikası Prezidentinin, Azərbaycan Respublikası Milli Məclisinin, Azərbaycan Respublikası Nazirlər Kabinetinin, Azərbaycan Respublikası Ali Məhkəməsinin, Azərbaycan Respublikası Prokurorluğunun, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin sorğusu əsasında Azərbaycan Respublikasının Konstitusiyasını və qanunlarını şərh edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi Azərbaycan Respublikası Prezidentinin, Azərbaycan Respublikası Milli Məclisinin, Azərbaycan Respublikası Nazirlər Kabinetinin, Azərbaycan Respublikası Ali Məhkəməsinin, Azərbaycan Respublikası Prokurorluğunun, Naxçıvan Muxtar Respublikası Ali Məclisinin və Naxçıvan Muxtar Respublikası Ali Məhkəməsinin sorğusu əsasında Azərbaycan Respublikasının Konstitusiyasını və qanunlarını şərh edir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi Azərbaycan Respublikası Prezidentinin, Azərbaycan Respublikası Milli Məclisinin, Azərbaycan Respublikası Nazirlər Kabinetinin, Azərbaycan Respublikası Ali Məhkəməsinin, Azərbaycan Respublikası Prokurorluğunun, Naxçıvan Muxtar Respublikası Ali Məclisinin sorğusu əsasında Azərbaycan Respublikasının Konstitusiyasını və qanunlarını şərh edir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi Azərbaycan Respublikası Prezidentinin, Azərbaycan Respublikası Milli Məclisinin, Azərbaycan Respublikası Nazirlər Kabinetinin, Azərbaycan Respublikası Ali Məhkəməsinin, Azərbaycan Respublikası Prokurorluğunun, Naxçıvan Muxtar Respublikası Ali Məclisinin sorğusu əsasında Azərbaycan Respublikasının Konstitusiyasını və qanunlarını şərh edir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab D variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 50, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9525d895-8fb6-42e7-bf7b-adbc2cbd782e', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'f0959588-b96c-4ff1-affd-97c26b06bb47', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının Baş prokuroru
hansı qaydada vəzifəyə təyin və vəzifədən azad edilir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Baş prokurorunu Azərbaycan Respublikasının Milli Məclisinin razılığı ilə ədliyyə naziri vəzifəyə təyin və vəzifədən azad edir", "Azərbaycan Respublikasının Baş prokurorunu Azərbaycan Respublikasının Milli Məclisinin razılığı ilə Azərbaycan Respublikasının Prezidenti vəzifəyə təyin və vəzifədən azad edir", "Azərbaycan Respublikasının Baş prokurorunu Azərbaycan Respublikasının Prezidentinin razılığı ilə Azərbaycan Respublikasının Milli Məclisi vəzifəyə təyin və vəzifədən azad edir", "Azərbaycan Respublikasının Baş prokurorunu Azərbaycan Respublikasının Prezidentinin razılığı ilə Azərbaycan Respublikasının Milli Məclisinin sədri vəzifəyə təyin və vəzifədən azad edir"]'::jsonb, 'Azərbaycan Respublikasının Baş prokurorunu Azərbaycan Respublikasının Milli Məclisinin razılığı ilə Azərbaycan Respublikasının Prezidenti vəzifəyə təyin və vəzifədən azad edir', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab B variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 51, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c783af23-2ec6-4fc5-bcdc-949042f09475', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'f41284ef-254b-4552-837d-9b5222400a72', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Ali Məhkəməsinin qərarları:', 'multiple_choice',
    '["Dərc edilməlidir.", "Milli Məclisin qərarları ilə eyni hüquqi qüvvəyə malikdir.", "Yalnız Konstitusiya Məhkəməsinin sorğusu ilə dərc edilə bilər", "Yalnız Milli Məclisin sorğusu ilə dərc edilə bilər"]'::jsonb, 'Dərc edilməlidir.', 'AR Konstitusiyası Maddə 130 və 131 (Konstitusiya Məhkəməsi və Ali Məhkəmə) — Düzgün cavab A variantıdır. Konstitusiya Məhkəməsi 9 hakimdən ibarətdir, 15 il müddətinə MM tərəfindən təyin olunur. Ali Məhkəmə kassasiya instansiyasıdır.', 52, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3143dbd2-9068-4f49-8e21-22e6b487f63d', '92a387c1-7ba4-48ca-89f6-12a03ce581fd', 'fb7ddd7a-9016-4857-a1c4-86701069d709', 'Azərbaycan Respublikasının Konstitusiyasına əsasən məhkəmə qərarı nəyə əsaslanmalıdır?', 'multiple_choice',
    '["Məhkəmə qərarı qanuna və hakimlərin daxili inamına əsaslanmalıdır;", "Məhkəmə qərarı qanuna və hakimlərin hüquq düşüncəsinə əsaslanmalıdır;", "Məhkəmə qərarı hakimlərin daxili inamına və sübutlara əsaslanmalıdır;", "Məhkəmə qərarı qanuna və sübutlara əsaslanmalıdır."]'::jsonb, 'Məhkəmə qərarı qanuna və sübutlara əsaslanmalıdır.', 'AR Konstitusiyası Maddə 125 - 129 (Məhkəmə hakimiyyətinin əsasları və hakimlərin statusu) — Düzgün cavab D variantıdır. Məhkəmə hakimiyyətini yalnız məhkəmələr ədalət mühakiməsi yolu ilə həyata keçirir. Yaşı 30-dan aşağı olmayan, 5 ildən artıq hüquqşünas işləyən şəxs hakim ola bilər. Hakimlər müstəqildir və dəyişilməzdirlər. Məhkəmə qərarları dövlətin adından çıxarılır.', 53, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 7. Naxçıvan MR və Bələdiyyələr (Fəsil 8-9: Maddə 134-146)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    '2536afc6-3585-4925-9514-ac21e33ef800', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 7. Naxçıvan MR və Bələdiyyələr (Fəsil 8-9: Maddə 134-146)', 'Naxçıvan Muxtar Respublikasının hüquqi statusu, Ali Məclisi, Nazirlər Kabineti; Bələdiyyələrin təşkili və səlahiyyətləri.',
    'Hüquq', 'medium', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '788f6360-0dd9-4921-91f2-c95bbbccd155', '2536afc6-3585-4925-9514-ac21e33ef800', '1223c41f-eef4-4440-914a-4b31e3964bcf', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Bələdiyyələr, bələdiyyə qulluqçuları ilə birlikdə, bələdiyyə qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə maddi məsuliyyət daşıyırlar.", "Bələdiyyələr, bələdiyyə qulluqçuları ilə birlikdə, bələdiyyə qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə inzibati məsuliyyət daşıyırlar.", "Bələdiyyələr, bələdiyyə qulluqçuları ilə birlikdə, bələdiyyə qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə mülki-hüquqi məsuliyyət daşıyırlar.", "Bələdiyyələr, bələdiyyə qulluqçuları ilə birlikdə, bələdiyyə qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə mülki məsuliyyət daşıyırlar."]'::jsonb, 'Bələdiyyələr, bələdiyyə qulluqçuları ilə birlikdə, bələdiyyə qulluqçularının qanuna zidd hərəkətləri və hərəkətsizliyi nəticəsində insan hüquq və azadlıqlarına dəymiş ziyana görə və onların təminatının pozulmasına görə mülki məsuliyyət daşıyırlar.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '49fefef9-04f2-4ffc-af35-5f5f1f1a9882', '2536afc6-3585-4925-9514-ac21e33ef800', '183d6187-84b1-4ab7-864f-99edb2280dd4', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələrin iclaslarını hansı subyekt çağırır?', 'multiple_choice',
    '["Bələdiyyənin iclaslarını bələdiyyənin üzvləri çağırır.", "Bələdiyyənin iclaslarını bələdiyyənin sədri çağırır.", "Bələdiyyənin iclaslarını bələdiyyənin sədri və üzvləri çağırır.", "Bələdiyyənin iclaslarını bələdiyyənin sədri və komitələrin sədri çağırır."]'::jsonb, 'Bələdiyyənin iclaslarını bələdiyyənin sədri çağırır.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab B variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '1ab34df2-2a71-4abf-b250-fa2a111869e3', '2536afc6-3585-4925-9514-ac21e33ef800', '38e998f1-d789-48be-a307-279ec778ba77', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasıın Baş naziri hansı qaydada təyin olunur?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasıın Baş naziri Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Naxçıvan Muxtar Respublikasıın Ali Məclisi tərəfindən təyin olunur", "Naxçıvan Muxtar Respublikasıın Baş naziri Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Naxçıvan Muxtar Respublikasıın Ali Məclisinin sədri tərəfindən təyin olunur", "Naxçıvan Muxtar Respublikasıın Baş naziri Naxçıvan Muxtar Respublikasıın Ali Məclisinin sədrinin təqdimatına əsasən Naxçıvan Muxtar Respublikasıın Ali Məclisi tərəfindən təyin olunur", "Naxçıvan Muxtar Respublikasıın Baş naziri Azərbaycan Respublikası Prezidenti tərəfindən təyin olunur"]'::jsonb, 'Naxçıvan Muxtar Respublikasıın Baş naziri Azərbaycan Respublikası Prezidentinin təqdimatına əsasən Naxçıvan Muxtar Respublikasıın Ali Məclisi tərəfindən təyin olunur', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab A variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 2, NULL, 'Baş nazirin təyinatı AR Prezidentinin təqdimatı və Ali Məclisin qərarı ilə həyata keçirilir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5d2bf5c2-bd51-4bcb-86f3-635bcdf3f454', '2536afc6-3585-4925-9514-ac21e33ef800', '40287530-3a3a-4a0b-808f-ca6e4fe0cf53', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələr hansı əsasda yaradılır?', 'multiple_choice',
    '["Bələdiyyələr seçkilər əsasında yaradılır", "Bələdiyyələr Azərbaycan Respublikası Milli Məclisinin qərarı ilə yaradılır", "Bələdiyyələr Azərbaycan Respublikası Prezidentinin fərmanı ilə yaradılır", "Bələdiyyələr Azərbaycan Respublikası NazirlərKabinetinin qərarı ilə yaradılır"]'::jsonb, 'Bələdiyyələr seçkilər əsasında yaradılır', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab A variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 3, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3e4cdf67-1103-4b3f-bd95-ed82d6673450', '2536afc6-3585-4925-9514-ac21e33ef800', '41aa2ec6-f714-463e-98b9-04766346597b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hüquqi qüvvəsinə görə ən alidən ən aşağıya doğru sıralayın.
1. Azərbaycan Respublikasının Konstitusiyası;
2. Referendumla qəbul edilmiş aktlar;
3. Azərbaycan Respublikasının qanunları;
4. Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr;
5. Mərkəzi icra hakimiyyəti orqanlarının normativ aktları;
6. Azərbaycan Respublikası Prezidentinin fərmanları;
7. Azərbaycan Respublikası Nazirlər Kabinetinin qərarları.', 'multiple_choice',
    '["4-1-2-3-6-7-5;", "1-2-3-4-6-7-5;", "1-4-2-3-6-7-5;", "4-1-3-2-6-7-5;", "1-2-4-3-6-7-5."]'::jsonb, '4-1-3-2-6-7-5;', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab D variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 4, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '074e90a7-0fa3-4922-9e94-111bac3daaaa', '2536afc6-3585-4925-9514-ac21e33ef800', '45f7a736-9007-4911-ae87-804f2342766c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələrin müstəqilliyinin təminatı ilə bağlı fikirlərdən biri yalnışdır.', 'multiple_choice',
    '["Bələdiyyələrin öz səlahiyyətlərini müstəqil həyata keçirməsi Azərbaycan dövlətinin suverenliyinə xələl gətirə bilməz.", "Qanunla müəyyən edilmiş hallarda və qaydada bələdiyyələr öz fəaliyyətləri barəsində Azərbaycan Respublikasının müvafiq icra hakimiyyəti orqanına hesabat təqdim edirlər.", "Bələdiyyələrin məhkəmə tərəfindən müdafiəsinə, dövlət orqanlarının qərarları nəticəsində yaranan əlavə xərclərinin ödənilməsinə təminat verir.", "Bələdiyyə üzvlərinin seçilməsi, səlahiyyətlərinin dayandırılması və ya səlahiyyətlərinə xitam verilməsi, bələdiyyələrin vaxtından əvvəl buraxılması halları və qaydası qanunla müəyyən edilir."]'::jsonb, 'Qanunla müəyyən edilmiş hallarda və qaydada bələdiyyələr öz fəaliyyətləri barəsində Azərbaycan Respublikasının müvafiq icra hakimiyyəti orqanına hesabat təqdim edirlər.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab B variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 5, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4f8104fa-d7b2-4997-99d1-ef7fe1ca28da', '2536afc6-3585-4925-9514-ac21e33ef800', '48f76efd-f26f-4f24-b3ca-b3b3be2c47ed', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının Nazirlər Kabineti hansı aktları qəbul edir?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasının Nazirlər Kabineti qanun və sərəncamlar qəbul edir.", "Naxçıvan Muxtar Respublikasının Nazirlər Kabineti qərar və qanunlar qəbul edir.", "Naxçıvan Muxtar Respublikasının Nazirlər Kabineti qərar və fərmanlar qəbul edir.", "Naxçıvan Muxtar Respublikasının Nazirlər Kabineti qərar və sərəncamlar qəbul edir."]'::jsonb, 'Naxçıvan Muxtar Respublikasının Nazirlər Kabineti qərar və sərəncamlar qəbul edir.', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab D variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 6, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8209cf67-ff35-4eed-8c01-9ecb45b7614d', '2536afc6-3585-4925-9514-ac21e33ef800', '5b97e410-f0dd-42b4-a02b-46f096529ceb', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının Konstitusiyası necə təqdim və təsdiq edilir?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasının Konstitusiyası Azərbaycan Respublikasının Milli Məclisinə Naxçıvan Muxtar Respublikasının Ali Məclisinin sədri tərəfindən təqdim edilir və Konstitusiya qanunu ilə təsdiq edilir;", "Naxçıvan Muxtar Respublikasının Konstitusiyası Azərbaycan Respublikasının Milli Məclisinə Naxçıvan Muxtar Respublikasının Ali Məclisinin sədri tərəfindən təqdim edilir və qanunla təsdiq edilir;", "Naxçıvan Muxtar Respublikasının Konstitusiyası Azərbaycan Respublikasının Milli Məclisinə Azərbaycan Respublikasının Milli Məclisinin sədri tərəfində təqdim edilir və qanunla təsdiq edilir;", "Naxçıvan Muxtar Respublikasının Konstitusiyası Azərbaycan Respublikasının Milli Məclisinə Azərbaycan Respublikasının Prezidenti tərəfindən təqdim edilir və Konstitusiya qanunu ilə təsdiq edilir."]'::jsonb, 'Naxçıvan Muxtar Respublikasının Konstitusiyası Azərbaycan Respublikasının Milli Məclisinə Azərbaycan Respublikasının Prezidenti tərəfindən təqdim edilir və Konstitusiya qanunu ilə təsdiq edilir.', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab D variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '50e40745-0342-430b-bd53-2f59e62e3d22', '2536afc6-3585-4925-9514-ac21e33ef800', '5bd5001a-250f-4226-89e8-2a303e0f1a84', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələrin müstəqilliyinin təminatına aid deyil', 'multiple_choice',
    '["Bələdiyyələr öz səlahiyyətlərini həyata keçirməkdə müstəqildirlər.", "Dövlət bələdiyyələrin fəaliyyətinə nəzarət edir.", "Qanunla müəyyən edilmiş hallarda və qaydada bələdiyyələr öz fəaliyyətləri barəsində Azərbaycan Respublikasının Milli Məclisinə hesabat təqdim edirlər.", "Bələdiyyələrin öz səlahiyyətlərini həyata keçirməkdə müstəqil olmağı bələdiyyə ərazisində yaşayan vətəndaşlar qarşısında onların məsuliyyətini istisna edir"]'::jsonb, 'Bələdiyyələrin öz səlahiyyətlərini həyata keçirməkdə müstəqil olmağı bələdiyyə ərazisində yaşayan vətəndaşlar qarşısında onların məsuliyyətini istisna edir', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab D variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6212eb8a-e4b9-4748-89e6-b9216c709f4f', '2536afc6-3585-4925-9514-ac21e33ef800', '6061d478-75b7-4393-ac19-928fcd72b137', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının Ali Məclisinin işinin təşkilinə aiddir', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasının Ali Məclisi Naxçıvan Muxtar Respublikası Ali Məclisinin sədrinin və onun müavinlərini seçir, daimi və digər komissiyalar, habelə Hesablama palatası təşkil edir.", "Naxçıvan Muxtar Respublikasının Ali Məclisi Naxçıvan Muxtar Respublikası Ali Məclisinin sədrinin və onun müavinlərini seçir, daimi və digər komissiyalar, habelə İdarəetmə şurası təşkil edir.", "Naxçıvan Muxtar Respublikasının Ali Məclisi Naxçıvan Muxtar Respublikası Ali Məclisinin sədrinin və onun müavinlərini seçir, daimi və digər komissiyalar,habelə komitələr təşkil edir.", "Naxçıvan Muxtar Respublikasının Ali Məclisi Naxçıvan Muxtar Respublikası Ali Məclisinin sədrinin və onun müavinlərini seçir, daimi və digər komissiyalar təşkil edir."]'::jsonb, 'Naxçıvan Muxtar Respublikasının Ali Məclisi Naxçıvan Muxtar Respublikası Ali Məclisinin sədrinin və onun müavinlərini seçir, daimi və digər komissiyalar təşkil edir.', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab D variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '52abdcc1-f319-45bc-8edc-6923d8c9ddd9', '2536afc6-3585-4925-9514-ac21e33ef800', '622325e5-c469-4804-a690-82354c620081', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasıın Nazirlər Kabinetinin tərkibini hansı qaydada təsdiq olunur?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasıın Nazirlər Kabinetinin tərkibi Naxçıvan Muxtar Respublikasıın Baş nazirinin təklifi ilə Ali Məclis tərəfindən təsdiq olunur", "Naxçıvan Muxtar Respublikasıın Nazirlər Kabinetinin tərkibi Naxçıvan Muxtar Respublikasıın Baş nazirinin təklifi ilə Ali Məclisin sədri tərəfindən təsdiq olunur", "Naxçıvan Muxtar Respublikasıın Nazirlər Kabinetinin tərkibi Naxçıvan Muxtar Respublikasıın Ali Məclisinin sədrinin təklifi ilə Azərbaycan Respublikasının Prezidenti tərəfindən təsdiq olunur", "Naxçıvan Muxtar Respublikasıın Nazirlər Kabinetinin tərkibi Azərbaycan Respublikası Prezidentinin təklifi ilə Ali Məclis tərəfindən təsdiq olunur"]'::jsonb, 'Naxçıvan Muxtar Respublikasıın Nazirlər Kabinetinin tərkibi Naxçıvan Muxtar Respublikasıın Baş nazirinin təklifi ilə Ali Məclis tərəfindən təsdiq olunur', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab A variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 10, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'eacb4b4a-540c-44e3-8991-775222967e65', '2536afc6-3585-4925-9514-ac21e33ef800', '656d50b9-fed7-4173-9ed4-2f23703e0367', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı məsələlərə dair Naxçıvan Naxçıvan Muxtar Respublikasıın Ali Məclisi qanunlar qəbul edir?
1. Naxçıvan Naxçıvan Muxtar Respublikasıın iqtisadiyyatının inkişafı istiqamətləri
2. Naxçıvan Naxçıvan Muxtar Respublikasıın Ali Məclisinin işinin təşkili
3. Səhiyyə
4. Naxçıvan Naxçıvan Muxtar Respublikasıın büdcəsinin təsdiqi
5. Elm
6. Naxçıvan Naxçıvan Muxtar Respublikasıın Nazirlər Kabineti tərkibinin təsdiqi', 'multiple_choice',
    '["1,2,3", "4,5,6", "1,3,5", "2,3,5"]'::jsonb, '1,3,5', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab C variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '25f4463a-0bba-4990-a006-cc6cce3ed61a', '2536afc6-3585-4925-9514-ac21e33ef800', '7311f960-8351-404d-a67c-36b646f89be3', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrin qanunvericilik sistemində yerini necə müəyyən edir?', 'multiple_choice',
    '["Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrin Azərbaycan Respublikasının qanunvericilik sisteminin ayrılmaz tərkib hissəsidir;", "Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrin Azərbaycan Respublikasının qanunvericilik sisteminə daxil deyil;", "Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr yalnız həmin müqavilələrin ratifikasiya edilməsi haqqında qanunda birbaşa nəzərdə tutulduğu halda Azərbaycan Respublikasının qanunvericilik sisteminə daxil edilir;", "Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrin Konstitusiya Məhkəməsi tərəfindən Azərbaycan Respublikasının qanunvericilik sisteminə daxil edilə bilər."]'::jsonb, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrin Azərbaycan Respublikasının qanunvericilik sisteminin ayrılmaz tərkib hissəsidir;', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab A variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 12, NULL, 'Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr rəhbər tutulur.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '57a8fac1-b879-4c2a-a2e3-5ff50eaaf2e4', '2536afc6-3585-4925-9514-ac21e33ef800', '7aec6b54-bf14-45b9-b0e1-740454a58856', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasında həm də Naxçıvan Muxtar Respublikasının Konstitusiyası və qanunları, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarları və yerli icra hakimiyətlərinin əmrləri hüquqi qüvvəyə malikdir.", "Naxçıvan Muxtar Respublikasında həm də Naxçıvan Muxtar Respublikasının Konstitusiyası və qanunları, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarları hüquqi qüvvəyə malik deyil", "Naxçıvan Muxtar Respublikasında həm də Naxçıvan Muxtar Respublikasının Konstitusiyası və qanunları, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarları hüquqi qüvvəyə malikdir.", "Naxçıvan Muxtar Respublikasında həm də Naxçıvan Muxtar Respublikasının Konstitusiya qanunları və Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarları hüquqi qüvvəyə malikdir."]'::jsonb, 'Naxçıvan Muxtar Respublikasında həm də Naxçıvan Muxtar Respublikasının Konstitusiyası və qanunları, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarları hüquqi qüvvəyə malikdir.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '261fb174-91cd-49d2-9d2e-8d5341a4b1e6', '2536afc6-3585-4925-9514-ac21e33ef800', '7ef772b4-a446-435c-ae4c-68c9e16d5f89', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələrin səlahiyyətlərinə aid deyil', 'multiple_choice',
    '["bələdiyyə üzvlərinin səlahiyyətlərinin tanınması, qanunla müəyyən edilmiş hallarda onların səlahiyyətlərinin itirilməsi və səlahiyyətlərinə xitam verilməsi;", "bələdiyyənin reqlamentinin təsdiq edilməsi;", "bələdiyyənin üzvlərinin və sədrin müavinlərinin, daimi və başqa komissiyaların seçilməsi;", "yerli vergilərin və ödənişlərin müəyyən edilməsi;"]'::jsonb, 'bələdiyyənin üzvlərinin və sədrin müavinlərinin, daimi və başqa komissiyaların seçilməsi;', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab C variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 14, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '5e7c3861-fef5-45fe-895a-03827c462405', '2536afc6-3585-4925-9514-ac21e33ef800', '86c78339-c122-4ac3-aa1b-a04f465f7d16', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələrin işinin təşkilinə aiddir', 'multiple_choice',
    '["Bələdiyyə öz fəaliyyətini iclaslar, daimi və müvəqqəti komissiyalar vasitəsi ilə həyata keçirir.", "Bələdiyyə öz fəaliyyətini iclaslar, daimi və növbədənkənar komissiyalar vasitəsi ilə həyata keçirir.", "Bələdiyyə öz fəaliyyətini iclaslar, daimi və başqa komitələr vasitəsi ilə həyata keçirir.", "Bələdiyyə öz fəaliyyətini iclaslar, daimi və başqa komissiyalar vasitəsi ilə həyata keçirir."]'::jsonb, 'Bələdiyyə öz fəaliyyətini iclaslar, daimi və başqa komissiyalar vasitəsi ilə həyata keçirir.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab D variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '61f3b17c-414a-4205-93a0-da0efde66865', '2536afc6-3585-4925-9514-ac21e33ef800', '86f02f8b-9f9e-4b20-9173-bef32c8d34f3', 'Azərbaycan Respublikasının Konstitusiyasına əsasən yerli özünüidarəni hansı orqan həyata keçirir?', 'multiple_choice',
    '["Yerli özünüidarəni Yerli İcra Hakimiyyəti həyata keçirir", "Yerli özünüidarəni Bələdiyyə həyata keçirir", "Yerli özünüidarəni mərkəzi İcra Hakimiyyətinin yerli nümayəndələri həyata keçirir", "Yerli özünüidarəni ictimai birliklər həyata keçirir"]'::jsonb, 'Yerli özünüidarəni Bələdiyyə həyata keçirir', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab B variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '567d3c2c-07ca-4be9-a423-4b3995ee8659', '2536afc6-3585-4925-9514-ac21e33ef800', '9223d553-73e4-42e2-9d46-4e536aee2648', 'Azərbaycan Respublikasının Konstitusiyasına əsasən icra hakimiyyəti orqanları hansı aktları qəbul edə bilərlər?', 'multiple_choice',
    '["Öz səlahiyyətləri daxilində yerli icra hakimiyyəti orqanları qanunvericilik sisteminə daxil olan aktlara zidd gəlməyən normativ hüquqi aktlar qəbul edə bilərlər.", "Öz səlahiyyətləri daxilində yerli icra hakimiyyəti orqanları qanunvericilik sisteminə daxil olan aktlara zidd gəlməyən normativ xarakterli aktlar qəbul edə bilərlər.", "Öz səlahiyyətləri daxilində yerli icra hakimiyyəti orqanları qanunvericilik sisteminə daxil olan aktlardan asılı olmayaraq istənilən normativ xarakterli aktlar qəbul edə bilərlər.", "Bütün hallarda yerli icra hakimiyyəti orqanları qanunvericilik sisteminə daxil olan aktlara zidd gəlməyən normativ aktlar qəbul edə bilərlər."]'::jsonb, 'Öz səlahiyyətləri daxilində yerli icra hakimiyyəti orqanları qanunvericilik sisteminə daxil olan aktlara zidd gəlməyən normativ xarakterli aktlar qəbul edə bilərlər.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab B variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 17, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6c575751-f79d-490d-aeb8-306927a15c6a', '2536afc6-3585-4925-9514-ac21e33ef800', '9b9bc82f-ece4-44c0-9630-771e99353e51', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının Nazirlər Kabinetinin səlahiyyətlərinə aid deyil', 'multiple_choice',
    '["muxtar respublika büdcəsinin layihəsini hazırlayıb Naxçıvan Muxtar Respublikasının Ali Məclisinə təqdim edir;", "muxtar respublikanın büdcəsini icra edir;", "Naxçıvan Muxtar Respublikasının iqtisadi və sosial proqramlarının təsdiq edir", "Azərbaycan Respublikası Prezidentinin onun səlahiyyətlərinə aid etdiyi digər məsələləri həll edir."]'::jsonb, 'Naxçıvan Muxtar Respublikasının iqtisadi və sosial proqramlarının təsdiq edir', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab C variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bf924256-61c3-4efa-93e2-836720828da3', '2536afc6-3585-4925-9514-ac21e33ef800', '9c24e8f2-02c1-4f03-b9ea-a4e9417ef5a9', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı akt qanunvericilik sisteminin əsasıdır?', 'multiple_choice',
    '["Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələr Azərbaycan Respublikasının qanunvericilik sisteminin əsasıdır.", "Azərbaycan Respublikasının Konstitusiya qanunları Azərbaycan Respublikasının qanunvericilik sisteminin əsasıdır.", "Azərbaycan Respublikasının referendumla qəbul edilmiş aktları Azərbaycan Respublikasının qanunvericilik sisteminin əsasıdır.", "Azərbaycan Respublikasının Konstitusiyası Azərbaycan Respublikasının qanunvericilik sisteminin əsasıdır."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyası Azərbaycan Respublikasının qanunvericilik sisteminin əsasıdır.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab D variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 19, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9689bf7a-4897-4cb7-96fb-a78e70416ff1', '2536afc6-3585-4925-9514-ac21e33ef800', 'a310d940-f838-48ec-b151-05d41673dc8c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası ərazisində birbaşa qüvvədədir:', 'multiple_choice',
    '["Azərbaycan Respublikası ərazisində yalnız vətəndaşların hüquqları və azadlıqları birbaşa qüvvədədir.", "Azərbaycan Respublikası ərazisində yalnız fiziki vəhüquqi şəxslərin hüquqları və azadlıqları birbaşa qüvvədədir.", "Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədədir.", "Azərbaycan Respublikası ərazisində insan və əcnəbilərin hüquqları və azadlıqları birbaşa qüvvədədir."]'::jsonb, 'Azərbaycan Respublikası ərazisində insan və vətəndaş hüquqları və azadlıqları birbaşa qüvvədədir.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab C variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 20, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '50a4b9fa-1d78-48dd-bc2c-fd1eb24b8ab7', '2536afc6-3585-4925-9514-ac21e33ef800', 'b37e432a-ba74-4eb6-9421-cdab29699483', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur
1. Naxçıvan Muxtar Respublikasının Ali Məclisi Azərbaycan Respublikasının Konstitusiyası və qanunları ilə onun səlahiyyətlərinə aid edilən məsələlərin həllində müstəqildirlər.
2. Naxçıvan Muxtar Respublikasının Nazirlər Kabineti Azərbaycan Respublikasının Konstitusiyası, qanunları və Azərbaycan Respublikası Prezidentinin sərəncamları ilə onun səlahiyyətlərinə aid edilən məsələlərin həllində müstəqildirlər.
3. Naxçıvan Muxtar Respublikasının məhkəmələri isə Azərbaycan Respublikası Konstitusiyası,Naxçıvan Muxtar Respublikasının Ali Məclisinin qərarları və qanunlar ilə onların səlahiyyətlərinə aid edilən məsələlərin həllində müstəqildirlər.
4. Naxçıvan Muxtar Respublikasının ali vəzifəli şəxsi Naxçıvan Muxtar Respublikası Ali Məclisinin sədridir.
5. Naxçıvan Muxtar Respublikasının Ali Məclisi 125 üzvdən ibarətdir.
6. Naxçıvan Muxtar Respublikası Ali Məclisinin səlahiyyət müddəti 5 ildir.', 'multiple_choice',
    '["2,3,5", "1,4,6", "1,2,3", "4,5,6"]'::jsonb, '1,4,6', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab B variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 21, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7f57e08e-d574-41dd-9961-5779b74fcfdc', '2536afc6-3585-4925-9514-ac21e33ef800', 'b86a1a66-0c1b-48d2-9c2b-a42abea82b76', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasının qanunvericilik sistemi ilə Azərbaycan Respublikasının qanunvericilik sistemi arasında hansı əlaqə olmalıdır?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasının qanunvericilik sistemi Azərbaycan Respublikasının qanunvericilik sistemindən asılı olmalıdır.", "Azərbaycan Respublikasının qanunvericilik sistemi Naxçıvan Muxtar Respublikasının qanunvericilik sisteminə uyğun olmalıdır.", "Naxçıvan Muxtar Respublikasının qanunvericilik sistemi Azərbaycan Respublikasının qanunvericilik sisteminə bərabər olmalıdır.", "Naxçıvan Muxtar Respublikasının qanunvericilik sistemi Azərbaycan Respublikasının qanunvericilik sisteminə uyğun olmalıdır."]'::jsonb, 'Naxçıvan Muxtar Respublikasının qanunvericilik sistemi Azərbaycan Respublikasının qanunvericilik sisteminə uyğun olmalıdır.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab D variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 22, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '259d1403-6043-4d51-a1c4-6551ae5594d6', '2536afc6-3585-4925-9514-ac21e33ef800', 'be764eb7-26f4-4044-b576-de314595c609', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Bələdiyyələrin statusunun əsasları Konstitusiya qanunu ilə, bələdiyyələrə seçkilərin qaydaları isə qanunla müəyyən edilir.", "Bələdiyyələrin statusunun əsasları bu Konstitusiya ilə, bələdiyyələrə seçkilərin qaydaları isə Konstitusiya qanunu ilə müəyyən edilir.", "Bələdiyyələrin statusunun əsasları bu Konstitusiya ilə, bələdiyyələrə seçkilərin qaydaları isə qərarla müəyyən edilir.", "Bələdiyyələrin statusunun əsasları bu Konstitusiya ilə, bələdiyyələrə seçkilərin qaydaları isə qanunla müəyyən edilir."]'::jsonb, 'Bələdiyyələrin statusunun əsasları bu Konstitusiya ilə, bələdiyyələrə seçkilərin qaydaları isə qanunla müəyyən edilir.', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 23, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '98603bb6-a0a7-44f7-b8fb-40cf592f0fbb', '2536afc6-3585-4925-9514-ac21e33ef800', 'c55e5a0b-5cb5-454d-8868-499885cb2b71', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasıın yerli icra hakimiyyətlərinin başçıları hansı qaydada təyin olunur?', 'multiple_choice',
    '["Naxçıvan Muxtar Respublikasıın yerli icra hakimiyyətlərinin başçıları Naxçıvan Muxtar Respublikasıın Ali Məclisi sədrinin təqdimatı əsasında Azərbaycan Respublikası Prezidenti tərəfindən təyin olunurlar", "Naxçıvan Muxtar Respublikasıın yerli icra hakimiyyətlərinin başçıları Azərbaycan Respublikası Prezidenti ilə razılaşdırmaqla Naxçıvan Muxtar Respublikasıın Ali Məclisi sədri tərəfindən təyin olunurlar", "Naxçıvan Muxtar Respublikasıın yerli icra hakimiyyətlərinin başçıları Naxçıvan Muxtar Respublikasıın Ali Məclisi tərəfindən təyin olunurlar", "Naxçıvan Muxtar Respublikasıın yerli icra hakimiyyətlərinin başçıları Azərbaycan Respublikası Prezidenti tərəfindən təyin olunurlar"]'::jsonb, 'Naxçıvan Muxtar Respublikasıın yerli icra hakimiyyətlərinin başçıları Naxçıvan Muxtar Respublikasıın Ali Məclisi sədrinin təqdimatı əsasında Azərbaycan Respublikası Prezidenti tərəfindən təyin olunurlar', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab A variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 24, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'e1bbb3da-3e5f-4bbb-a5dc-1b5d6dfe5118', '2536afc6-3585-4925-9514-ac21e33ef800', 'd169744a-4ebd-4417-9943-d659903111e3', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur
1. Bələdiyyələrə qanunvericilik,məhkəmə və icra hakimiyyətləri tərəfindən əlavə səlahiyyətlər də verilə bilər .
2. Bələdiyyələrə verilən səlahiyyətlərin həyata keçirilməsi üçün bələdiyyə üzrə müvafiq zəruri maliyyə vəsaiti də ayrılmalıdır.
3. Belə səlahiyyətlərin həyata keçirilməsinə müvafiq olaraq qanunvericilik,məhkəmə və icra hakimiyyətləri nəzarət edirlər.
4. Bələdiyyənin iclaslarında baxılan məsələlərə dair qərarlar qəbul edilir.
5. Bələdiyyənin qərarları bələdiyyə üzvlərinin üçdə iki səs çoxluğu ilə qəbul edilir.
6. Yerli vergilər və ödənişlər ilə bağlı qərarlar bələdiyyə üzvlərinin üçdə iki səs çoxluğu ilə qəbul edilir.', 'multiple_choice',
    '["1,3,5", "2,4,6", "3,5,6", "1,2,4"]'::jsonb, '2,4,6', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab B variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 25, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b73e5946-c0ca-44e1-8bf9-e96ebf05d157', '2536afc6-3585-4925-9514-ac21e33ef800', 'd42e42f1-599e-4fe9-9408-7b54d819c037', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı məsələlərə dair Naxçıvan Naxçıvan Muxtar Respublikasıın Ali Məclisi qərarlar qəbul edir?
1. Naxçıvan Naxçıvan Muxtar Respublikasıın iqtisadiyyatının inkişafı istiqamətləri
2. Naxçıvan Naxçıvan Muxtar Respublikasıın iqtisadi və sosial proqramlarının təsdiqi
3. Naxçıvan Muxtar Respublikası Baş Nazirinin vəzifəyə təyin və vəzifədən azad edilməsi
4. muxtar respublikanın iqtisadi proqramlarının həyata keçirilməsini təmin edir;
5. muxtar respublikanın sosial proqramlarının həyata keçirilməsini təmin edir;
6. Naxçıvan Muxtar Respublikasının Nazirlər Kabinetinə etimad', 'multiple_choice',
    '["1,2,3", "4,5,6", "1,3,5", "2,3,6"]'::jsonb, '2,3,6', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab D variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 26, NULL, 'Baş nazirin təyinatı AR Prezidentinin təqdimatı və Ali Məclisin qərarı ilə həyata keçirilir.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ac7e0728-abd3-449d-9a26-2735157aa0c5', '2536afc6-3585-4925-9514-ac21e33ef800', 'd5f8071f-4bcb-44af-87f2-9ff711bdf300', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasıın Ali Məclisi hansı məsələlərə dair ümumi qaydalar müəyyən edir?
1. Naxçıvan Muxtar Respublikasıın ərazisində fəaliyyət göstərən bələdiyyələrə seçkilər
2. Naxçıvan Muxtar Respublikasıın Ali Məclisinə seçkilər
3. Vergilər və sosial təminat
4. Ali xüsusi rütbələrin verilməsi
5. Ətraf mühitin qorunması və turizm', 'multiple_choice',
    '["1,2,3", "3,4,5", "1,3,5", "2,3,5"]'::jsonb, '2,3,5', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab D variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 27, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '7e534954-3fb5-4a69-b4fc-5a9bab576db7', '2536afc6-3585-4925-9514-ac21e33ef800', 'f248a30c-7029-4064-b9f9-685fa84a1531', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Naxçıvan Muxtar Respublikasında hakimiyyətin bölünməsi prinsipini seçin:', 'multiple_choice',
    '["qanunvericilik hakimiyyətini Nazirlər Kabineti, icra hakimiyyətini yerli icra hakimiyyətləri, məhkəmə hakimiyyətini məhkəmələr həyata keçirir", "qanunvericilik hakimiyyətini məhkəmələr, icra hakimiyyətini Nazirlər Kabineti, məhkəmə hakimiyyətini ali məcllis həyata keçirir", "qanunvericilik hakimiyyətini Ali Məclis, icra hakimiyyətini Nazirlər Kabineti, məhkəmə hakimiyyətini apelyasiya məhkəmələri həyata keçirir", "qanunvericilik hakimiyyətini Ali Məclis, icra hakimiyyətini Nazirlər Kabineti, məhkəmə hakimiyyətini məhkəmələr həyata keçirir"]'::jsonb, 'qanunvericilik hakimiyyətini Ali Məclis, icra hakimiyyətini Nazirlər Kabineti, məhkəmə hakimiyyətini məhkəmələr həyata keçirir', 'AR Konstitusiyası Maddə 134 - 141 (Naxçıvan Muxtar Respublikası) — Düzgün cavab D variantıdır. Naxçıvan MR AR tərkibində muxtar dövlətdir. Qanunvericilik orqanı 45 deputatdan ibarət Ali Məclisdir (5 il). Ali vəzifəli şəxs Ali Məclisin Sədridir. Baş nazir Prezidentin təqdimatı ilə Ali Məclis tərəfindən təsdiq edilir.', 28, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ca26b1fb-9aca-473c-bd5a-26a42f85df91', '2536afc6-3585-4925-9514-ac21e33ef800', 'fe1a3836-0895-420e-b80e-2d0d1b06a22b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyələrin səlahiyyətlərini seçin
1) dövlət büdcənin və onun icrası haqqında hesabatların təsdiq edilməsi;
2) bələdiyyə mülkiyyətinə sahiblik, ondan istifadə və onun barəsində sərəncam;
3) yerli sosial müdafiə və sosial inkişaf proqramlarının qəbul və icra edilməsi;
4) iqtisadi inkişaf proqramlarının qəbul və icra edilməsi;
5) ekoloji proqramların qəbul və icra edilməsi.', 'multiple_choice',
    '["4,5", "2,3", "1,5", "2,4"]'::jsonb, '2,3', 'AR Konstitusiyası Maddə 142 - 146 (Bələdiyyələr) — Düzgün cavab B variantıdır. Yerli özünüidarəni bələdiyyələr həyata keçirir. Bələdiyyələr 5 il müddətinə seçilir. Qərarlar sadə səs çoxluğu ilə (yerli vergilər üzrə 2/3 səslə) qəbul edilir və fəaliyyətləri barədə MM-ə hesabat təqdim edirlər. Bələdiyyələr zərərə görə mülki məsuliyyət daşıyırlar (2016).', 29, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


-- Quiz: AR Konstitusiyası — 8. Qanunvericilik Sistemi və Əlavə/Dəyişikliklər (Fəsil 10-12 + Keçid)
INSERT INTO quizzes (
    id, creator_id, title, description, subject, difficulty, 
    duration, is_public, is_published, is_archived,
    shuffle_questions, show_feedback, feedback_timing,
    pass_percentage, questions_per_page, allow_backtracking,
    allow_bookmarks, show_question_nav, exam_category, created_at, updated_at
) VALUES (
    'f7baac9f-fa37-45f7-be38-d99627d9bada', '81cebd9d-586b-4460-8615-6cb0ed9d1094', 'AR Konstitusiyası — 8. Qanunvericilik Sistemi və Əlavə/Dəyişikliklər (Fəsil 10-12 + Keçid)', 'Hüquqi aktların qüvvəsi və iyerarxiyası (Maddə 147-151), Konstitusiyada dəyişikliklər (Maddə 152-155), əlavələr (Maddə 156-158) və Keçid müddəaları.',
    'Hüquq', 'hard', 0, true, true, false,
    false, true, 'immediate', 60, 1, true, true, true, 'Dövlət Qulluğu', now(), now()
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4675e97c-b834-4a43-9ed6-b92f135de800', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '00875025-ed60-4f58-bd15-18eb23698b4b', 'Azərbaycan Respublikasının Konstitusiyasına əsasən beynəlxalq aktların hüquqi qüvvəsi üzgün təsbit edilmişdir', 'multiple_choice',
    '["Azərbaycan Respublikasının qanunvericilik sisteminə daxil olan normativ hüquqi aktlar ilə (Azərbaycan Respublikasının Konstitusiyası və referendumla qəbul edilən aktlar da daxil olmaqla) Azərbaycan Respublikasının tərəfdar çıxdığı dövlətlərarası müqavilələr arasında ziddiyyət yaranarsa, həmin beynəlxalq müqavilələr tətbiq edilir.", "Azərbaycan Respublikasının qanunvericilik sisteminə daxil olan normativ hüquqi aktlar ilə (Azərbaycan Respublikasının Konstitusiyası və referendumla qəbul edilən aktlar istisna olmaqla) Azərbaycan Respublikasının tərəfdar çıxdığı dövlətlərarası müqavilələr arasında ziddiyyət yaranarsa, Konstitusiya tətbiq edilir.", "Azərbaycan Respublikasının qanunvericilik sisteminə daxil olan normativ hüquqi aktlar ilə (Azərbaycan Respublikasının Konstitusiyası və referendumla qəbul edilən aktlar istisna olmaqla) Azərbaycan Respublikasının tərəfdar çıxdığı dövlətlərarası müqavilələr arasında ziddiyyət yaranarsa, Azərbaycan Respublikasının qanunları tətbiq edilir.", "Azərbaycan Respublikasının qanunvericilik sisteminə daxil olan normativ hüquqi aktlar ilə (Azərbaycan Respublikasının Konstitusiyası və referendumla qəbul edilən aktlar istisna olmaqla) Azərbaycan Respublikasının tərəfdar çıxdığı dövlətlərarası müqavilələr arasında ziddiyyət yaranarsa, həmin beynəlxalq müqavilələr tətbiq edilir."]'::jsonb, 'Azərbaycan Respublikasının qanunvericilik sisteminə daxil olan normativ hüquqi aktlar ilə (Azərbaycan Respublikasının Konstitusiyası və referendumla qəbul edilən aktlar istisna olmaqla) Azərbaycan Respublikasının tərəfdar çıxdığı dövlətlərarası müqavilələr arasında ziddiyyət yaranarsa, həmin beynəlxalq müqavilələr tətbiq edilir.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab D variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 0, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '981d2cbb-3e45-462b-a2bd-206625d570f2', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '05d94cad-cb9f-4e2b-852e-8a3b20062b84', 'Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri hansı subyektlər təklif edə bilər?', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri Azərbaycan Respublikasının Milli Məclisinin sədri və ya Azərbaycan Respublikasının Prezidenti təklif edə bilər", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri Azərbaycan Respublikasının Milli Məclisinin 95 deputatı və ya Azərbaycan Respublikasının Prezidenti təklif edə bilər", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri Azərbaycan Respublikasının Milli Məclisi və Azərbaycan Respublikasının Prezidenti təklif edə bilər", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri Azərbaycan Respublikasının Milli Məclisi və ya Azərbaycan Respublikasının Prezidenti təklif edə bilər"]'::jsonb, 'Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri Azərbaycan Respublikasının Milli Məclisi və ya Azərbaycan Respublikasının Prezidenti təklif edə bilər', 'AR Konstitusiyası Maddə 152 - 155 (Konstitusiyada dəyişikliklər edilməsi) — Düzgün cavab D variantıdır. Dəyişikliklər yalnız referendumla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər. 1, 2, 6, 7, 8 və 21-ci maddələrdə dəyişikliklər, habelə III fəsildə hüquq və azadlıqların ləğvi/məhdudlaşdırılması referenduma çıxarıla bilməz (Maddə 155).', 1, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2ffa3e7d-ca7b-4f8a-a0ef-0b05d4391d0d', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '066ceaa7-3148-4786-b23a-24455e738b94', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunlarının imzalanmasına aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları ancaq birinci səsvermədən sonra bu konstitusiyada qanunlar üçün nəzərdə tutulmuş qaydada Azərbaycan Respublikası Prezidentinə imzalanmaq üçün təqdim olunur.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları ancaq ikinci səsvermədən sonra bu konstitusiyada qanunlar üçün nəzərdə tutulmuş qaydada Azərbaycan Respublikası Prezidentinə imzalanmaq üçün təqdim olunur.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları həm birinci, həm də ikinci səsvermədən sonra bu konstitusiyada qanunlar üçün nəzərdə tutulmuş qaydada Azərbaycan Respublikası Prezidentinə imzalanmaq üçün təqdim olunur.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları həm birinci, həm də ikinci səsvermədən sonra bu konstitusiyada qanunlar üçün nəzərdə tutulmuş qaydada Azərbaycan Respublikası Konstitusiya Məhkəməsinin sədrinə imzalanmaq üçün təqdim olunur"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları həm birinci, həm də ikinci səsvermədən sonra bu konstitusiyada qanunlar üçün nəzərdə tutulmuş qaydada Azərbaycan Respublikası Prezidentinə imzalanmaq üçün təqdim olunur.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab C variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 2, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b46c80e4-76ea-4ccc-9edc-f8af2473a161', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '090e1154-57a1-4d01-9b58-c4f459c6ed50', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq göstərilən maddələrin hansında dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["Paytaxt", "Pul vahidi", "Dövlət dili", "Şəxsi toxunulmazlıq hüququ"]'::jsonb, 'Dövlət dili', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 3, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '634977bf-7989-4867-b5ae-919384937a0a', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '0baab2da-3354-4379-9de7-26fff16ffcfb', 'Azərbaycan Respublikası Konstitusiyasının neçənci maddələrində dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["1, 2, 6, 7, 8 və 21-ci maddələrində;", "1,2, 6, 7, 20 və 21-ci maddələrində;", "1, 2, 3, 6 və 21-ci maddələrində;", "1, 2, 7, 9 və 23-cü maddələrində."]'::jsonb, '1, 2, 6, 7, 8 və 21-ci maddələrində;', 'AR Konstitusiyası Maddə 152 - 155 (Konstitusiyada dəyişikliklər edilməsi) — Düzgün cavab A variantıdır. Dəyişikliklər yalnız referendumla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər. 1, 2, 6, 7, 8 və 21-ci maddələrdə dəyişikliklər, habelə III fəsildə hüquq və azadlıqların ləğvi/məhdudlaşdırılması referenduma çıxarıla bilməz (Maddə 155).', 4, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3a929f5b-4278-4aa0-ac6d-8a31c7bf8d58', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '0fdbe778-4eb4-4caf-a0d6-928a4deb31a7', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Konstitusiya Məhkəməsinin səlahiyyətlərinin məhdudlaşdırılması maddəsinə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya Məhkəməsi, qanunla nəzərdə tutulmuş hallarda, referendumla qəbul olunmuş Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklərə dair qərar qəbul edə bilər.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi, qanunla nəzərdə tulumuş hallardan başqa digər hallarda referendumla qəbul olunmuş Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklərə dair qərar qəbul edə bilər", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi, Konstitusiya ilə müəyyən edilmiş hallarda, referendumla qəbul olunmuş Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklərə dair qərar qəbul edə bilər", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi referendumla qəbul olunmuş Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklərə dair qərar qəbul edə bilməz."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsi referendumla qəbul olunmuş Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklərə dair qərar qəbul edə bilməz.', 'AR Konstitusiyası Maddə 152 - 155 (Konstitusiyada dəyişikliklər edilməsi) — Düzgün cavab D variantıdır. Dəyişikliklər yalnız referendumla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər. 1, 2, 6, 7, 8 və 21-ci maddələrdə dəyişikliklər, habelə III fəsildə hüquq və azadlıqların ləğvi/məhdudlaşdırılması referenduma çıxarıla bilməz (Maddə 155).', 5, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c9d7c8b9-f291-4d3a-9d8a-559998c46815', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '14176df3-2fea-4308-b605-f4f57a20ba60', 'Azərbaycan Respublikasının Konstitusiyasına əlavələrin qəbul edilməsi qaydasına aiddir', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiyasına əlavələr Azərbaycan Respublikasının Milli Məclisində 95 səs çoxluğu ilə qanunlar şəklində qəbul edilir.", "Azərbaycan Respublikası Konstitusiyasına əlavələr Azərbaycan Respublikasının Milli Məclisində 95 səs çoxluğu ilə Konstitusiya qanunları şəklində qəbul edilir.", "Azərbaycan Respublikası Konstitusiyasına əlavələr Azərbaycan Respublikasının Milli Məclisində 83 səs çoxluğu ilə Konstitusiya qanunları şəklində qəbul edilir.", "Azərbaycan Respublikası Konstitusiyasına əlavələr ümumxalq səsverməsi yolu ilə qəbul edilir."]'::jsonb, 'Azərbaycan Respublikası Konstitusiyasına əlavələr Azərbaycan Respublikasının Milli Məclisində 95 səs çoxluğu ilə Konstitusiya qanunları şəklində qəbul edilir.', 'AR Konstitusiyası Maddə 152 - 155 (Konstitusiyada dəyişikliklər edilməsi) — Düzgün cavab B variantıdır. Dəyişikliklər yalnız referendumla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər. 1, 2, 6, 7, 8 və 21-ci maddələrdə dəyişikliklər, habelə III fəsildə hüquq və azadlıqların ləğvi/məhdudlaşdırılması referenduma çıxarıla bilməz (Maddə 155).', 6, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6662c935-8b32-4697-963b-d0aae8764768', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '14a99ae7-fa12-4421-912b-df2b403d09fc', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Yalnız qəbul edilmiş fərmanların tətbiqi və icrası bütün vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti,, hüquqi şəxslər üçün məcburidir.", "Yalnız imzalanmış fərmanların tətbiqi və icrası bütün vətəndaşlar, icra hakimiyyəti orqanları, hüquqi şəxslər üçün məcburidir.", "Yalnız dərc edilmiş fərmanların tətbiqi və icrası bütün vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər üçün məcburidir.", "Yalnız dərc edilmiş fərmanların tətbiqi və icrası bütün vətəndaşlar, icra hakimiyyəti orqanları, hüquqi şəxslər üçün məcburidir."]'::jsonb, 'Yalnız dərc edilmiş fərmanların tətbiqi və icrası bütün vətəndaşlar, icra hakimiyyəti orqanları, hüquqi şəxslər üçün məcburidir.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 7, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '46afc804-7652-434d-9503-ed9816c81aad', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '1553151b-ad68-457a-acca-6dd1ce0d7e1b', 'Azərbaycan Respublikası Konstitusiyasına əlavələrin təklif edilməsi təşəbbüsünə aiddir', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasına əlavələri Azərbaycan Respublikasının Prezidenti və Azərbaycan Respublikası Milli Məclisinin azı 63 deputatı təklif edə bilərlər.", "Azərbaycan Respublikasının Konstitusiyasına əlavələri Azərbaycan Respublikasının Prezidenti və ya Azərbaycan Respublikası Milli Məclisinin çoxu 63 deputatı təklif edə bilərlər.", "Azərbaycan Respublikasının Konstitusiyasına əlavələri Azərbaycan Respublikasının Prezidenti və ya Azərbaycan Respublikası Milli Məclisinin ən çoxu 83 deputatı təklif edə bilərlər.", "Azərbaycan Respublikasının Konstitusiyasına əlavələri Azərbaycan Respublikasının Prezidenti və ya Azərbaycan Respublikası Milli Məclisinin azı 63 deputatı təklif edə bilərlər."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasına əlavələri Azərbaycan Respublikasının Prezidenti və ya Azərbaycan Respublikası Milli Məclisinin azı 63 deputatı təklif edə bilərlər.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab D variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 8, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c8ed00f0-1f07-4182-88b8-793c712442c8', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '1b92696d-ebd5-4770-8788-3bc49339d20d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Göstərilən maddələrin hansında dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["Beynəlxalq münasibətlər prinsipi", "Pul vahidi", "Azərbaycan dövlətinin rəmzləri", "Azərbaycan dövləti"]'::jsonb, 'Azərbaycan dövləti', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 9, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '243fa34d-df3a-49ba-bcfb-834ff940fba1', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '2469be53-8c65-461e-8706-7e866b26b71f', 'Azərbaycan Respublikasının Konstitusiyası qüvvəyə mindiyi gündən Azərbaycan Respubli­ka­sının Ali Arbitraj Məhkəməsi necə adlandırılmışdır?', 'multiple_choice',
    '["Azərbaycan Respublikasının Ali Məhkəməsi;", "Azərbaycan Respublikasının hərbi məhkəməsi;", "Azərbaycan Respublikasının İqtisad Məhkəməsi;", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi; Açıq suallar"]'::jsonb, 'Azərbaycan Respublikasının İqtisad Məhkəməsi;', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab C variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 10, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '16e65e4c-53c9-45d4-90dd-101fe0b52d90', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '25c50b86-dda0-4da2-b058-581bf05762d2', 'Azərbaycan Respublikasinin Konstitusiyasinda dəyişikliklər ilə bağlı fikirlərdən biri yalnışdir.', 'multiple_choice',
    '["Bu Konstitusiyanın 1-ci, 2-ci, 6-cı, 7-ci, 8-ci və 21-ci maddələrində dəyişikliklər və ya onların ləğv edilməsi haqqında, III-cü fəslində nəzərdə tutulmuş insan və vətəndaş hüquqları və azadlıqlarının ləğvi və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə nəzərdə tutulduğundan daha artıq dərəcədə məhdudlaşdırılması haqqında təkliflər referenduma çıxarıla bilməz.", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişiklikləri Azərbaycan Respublikasının Milli Məclisi və ya Azərbaycan Respublikasının Prezidenti təklif etdikdə, təklif olunan dəyişikliklərə dair əvvəlcədən Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi alınır.", "Azərbaycan Respublikası Konstitusiyasına dəyişikliklər Azərbaycan Respublikasının Milli Məclisində 95 səs çoxluğu ilə Konstitusiya qanunları şəklində qəbul edilir.", "Azərbaycan Respublikasının Konstitusiya Məhkəməsi referendumla qəbul olunmuş Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklərə dair qərar qəbul edə bilməz."]'::jsonb, 'Azərbaycan Respublikası Konstitusiyasına dəyişikliklər Azərbaycan Respublikasının Milli Məclisində 95 səs çoxluğu ilə Konstitusiya qanunları şəklində qəbul edilir.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab C variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 11, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '578abf2f-d26a-44a8-87d5-0459eba26cde', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '29e3e59d-e8b5-41c6-a448-46c770b570fc', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası Milli Məclisinin ilk sessiyası hansı müddətə qədər davam edib?', 'multiple_choice',
    '["1995-ci il noyabrın 12-dək", "1996-cı il mayın 31-dək", "1996-ci 29 senytabrınadək", "1997-cil il 18 iyunadək"]'::jsonb, '1996-cı il mayın 31-dək', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab B variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 12, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a8a70fa3-3bc7-4dc7-aedb-511ad025d2f6', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '2f8e3738-6d7b-47ef-9e7e-dff6eda76741', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğru deyil', 'multiple_choice',
    '["Azərbaycan Respublikası Nazirlər Kabinetinin qərarları Azərbaycan Respublikasının Konstitusiyasına, qanunlarına və Azərbaycan Respublikası Prezidentinin fərmanlarına zidd olmamalıdır.", "Azərbaycan Respublikası Nazirlər Kabinetinin qərarları yalnız dərc edildikdə onların tətbiqi və icrası vətəndaşlar, mərkəzi və yerli icra hakimiyyəti orqanları, hüquqi şəxslər üçün məcburidir.", "Mərkəzi icra hakimiyyəti orqanlarının aktları Azərbaycan Respublikasının Konstitusiyasına, qanunlarına, Azərbaycan Respublikası Prezidentinin fərmanlarına və Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarına və bələdiyyələrin aktlarına zidd olmamalıdır.", "Normativ hüquqi aktlar dərc edilməlidir."]'::jsonb, 'Mərkəzi icra hakimiyyəti orqanlarının aktları Azərbaycan Respublikasının Konstitusiyasına, qanunlarına, Azərbaycan Respublikası Prezidentinin fərmanlarına və Azərbaycan Respublikası Nazirlər Kabinetinin qərarlarına və bələdiyyələrin aktlarına zidd olmamalıdır.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 13, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'd8912b7d-a3f6-48a3-b303-484994021635', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '301832ed-55be-470e-a6bd-072c344e9431', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası yerli xalq Deputatları Sovetlərinin səlahiyyətlərinə nə zaman xitam verilir?', 'multiple_choice',
    '["Konstitusiyanın qüvvəyə mindiyi gündən", "Konstitusiya qəbul olunduğu gündən", "Konstitusiya dərc olunduğu gündən", "Heç biri"]'::jsonb, 'Konstitusiyanın qüvvəyə mindiyi gündən', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab A variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 14, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c3ad6d73-f868-401b-ba2c-3fe485773b11', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '311d9915-3869-4011-bc53-a2b23e4c6c70', 'Azərbaycan Respublikasının Konstitusiyasına əsasən referendumla qəbul olunmuş aktlar nə zaman məcburidir?', 'multiple_choice',
    '["Referendumla qəbul olunmuş aktlar yalnız dərc edildikdə onların tətbiqi və icrası vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.", "Referendumla qəbul olunmuş aktlar yalnız imzalandıqda onların tətbiqi və icrası vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.", "Referendumla qəbul olunmuş aktlar yalnız qəbul olunduqda onların tətbiqi və icrası vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.", "Referendumla qəbul olunmuş aktlar yalnız Konstitusiya Məhkəməsinin sorğusu olduqda onların tətbiqi və icrası vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir."]'::jsonb, 'Referendumla qəbul olunmuş aktlar yalnız dərc edildikdə onların tətbiqi və icrası vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab A variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 15, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'c9b26b56-897f-4644-abaf-6870c3a3c2d6', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '3c5acfee-e53d-4de5-9b87-82400533bf61', 'Azərbaycan Respublikasının Konstitusiyasına əsasən normativ hüquqi aktlar nəyə əsaslanmalıdır?', 'multiple_choice',
    '["Normativ hüquqi aktlar Konstitusiyaya və sağlam hüquq düşüncəsinə əsaslanmalıdır;", "Normativ hüquqi aktlar Konstitusiyaya, qanunlara və vicdana (bərabər mənafelərə bərabər münasibətə) əsaslanmalıdır;", "Normativ hüquqi aktlar hüquqa və haqq-ədalətə (bərabər mənafelərə bərabər münasibətə) əsaslanmalıdır;", "Normativ hüquqi aktlar hüquqa və insafa (bərabər mənafelərə bərabər münasibətə) əsaslanmalıdır."]'::jsonb, 'Normativ hüquqi aktlar hüquqa və haqq-ədalətə (bərabər mənafelərə bərabər münasibətə) əsaslanmalıdır;', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab C variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 16, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '90648955-24f6-4f92-9dd4-8d3f4e414ff4', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '456e033d-6c19-40e5-b431-14067e7549c9', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Milli Məclisində iki dəfə səsə qoyulur və ikinci səsvermə birinci səsvermədən 2 ay sonra keçirilir.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Milli Məclisində iki dəfə səsə qoyulur və ikinci səsvermə birinci səsvermədən 1 ay sonra keçirilir.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Milli Məclisində iki dəfə səsə qoyulur və ikinci səsvermə birinci səsvermədən 6 ay sonra keçirilir.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Milli Məclisində iki dəfə səsə qoyulur və ikinci səsvermə birinci səsvermədən 12 ay sonra keçirilir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Milli Məclisində iki dəfə səsə qoyulur və ikinci səsvermə birinci səsvermədən 6 ay sonra keçirilir.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 17, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '67354c97-fe35-4f47-8650-d63b88eb61d2', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '4a482406-2b66-4305-8508-75310a54f7f2', 'Azərbaycan Respublikasının Konstitusiyasına əsasən normativ hüquqi aktların dərc edilməsi qaydası hansı aktla müəyyən edilir?', 'multiple_choice',
    '["Normativ hüquqi aktların dərc edilməsi qaydası qanunla müəyyən edilir.", "Normativ hüquqi aktların dərc edilməsi qaydası qərarla müəyyən edilir.", "Normativ hüquqi aktların dərc edilməsi qaydası Konstitusiya ilə müəyyən edilir.", "Normativ hüquqi aktların dərc edilməsi qaydası Konstitusiya qanunu ilə müəyyən edilir."]'::jsonb, 'Normativ hüquqi aktların dərc edilməsi qaydası Konstitusiya qanunu ilə müəyyən edilir.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab D variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 18, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b79a7750-ac8b-42ea-b035-f907411fd50b', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '54d252a5-ef43-44d0-a46d-d9574a7e36d4', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiyasının mətnində təklif olunan dəyişikliklərə dair əvvəlcədən Azərbaycan Respublikası Ali Məhkəməsinin 30 gün ərzində rəyi alınır.", "Azərbaycan Respublikası Konstitusiyasının mətnində təklif olunan dəyişikliklərə dair əvvəlcədən Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi alınır.", "Azərbaycan Respublikası Konstitusiyasının mətnində təklif olunan dəyişikliklərə dair sonradan Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi alınır.", "Azərbaycan Respublikası Konstitusiyasının mətnində təklif olunan dəyişikliklərə dair əvvəlcədən Azərbaycan Respublikası Konstitusiya Məhkəməsinin sədrinin rəyi alınır."]'::jsonb, 'Azərbaycan Respublikası Konstitusiyasının mətnində təklif olunan dəyişikliklərə dair əvvəlcədən Azərbaycan Respublikası Konstitusiya Məhkəməsinin rəyi alınır.', 'AR Konstitusiyası Maddə 152 - 155 (Konstitusiyada dəyişikliklər edilməsi) — Dəyişikliklər yalnız referendumla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər. 1, 2, 6, 7, 8 və 21-ci maddələrdə dəyişikliklər, habelə III fəsildə hüquq və azadlıqların ləğvi/məhdudlaşdırılması referenduma çıxarıla bilməz (Maddə 155).', 19, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'f461cae5-18cb-4ef9-b150-60dbda16dffe', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '5f2280e8-4464-4c56-a546-7c89d87afb8c', 'Azərbaycan Respublikasının Konstitusiyasına əsasən bələdiyyə aktlarına aid deyil', 'multiple_choice',
    '["Bələdiyyələrin qəbul etdikləri aktlar hüquqa və haqq-ədalətə (bərabər mənafelərə bərabər münasibətə) əsaslanmalıdır", "Bələdiyyələrin qəbul etdikləri aktlar Azərbaycan Respublikasının Konstitusiyasına, qanunlarına, Azərbaycan Respublikası Prezidentinin fərmanlarına, Azərbaycan Respublikası Nazirlər Kabinetinin zidd olmamalıdır.", "Bələdiyyələrin qəbul etdiyi aktın icrası onun ərazisində yaşayan vətəndaşlar və hüquqi şəxslər üçün məcburidir.", "Bələdiyyələrin qəbul etdikləri aktlar Naxçıvan Muxtar Respublikasında həm də Naxçıvan Muxtar Respublikasının Konstitusiyasına, qanunlarına, Naxçıvan Muxtar Respublikası Nazirlər Kabinetinin qərarlarına zidd olmamalıdır."]'::jsonb, 'Bələdiyyələrin qəbul etdiyi aktın icrası onun ərazisində yaşayan vətəndaşlar və hüquqi şəxslər üçün məcburidir.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab C variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 20, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '29c47035-3ffc-490c-9ff9-d36ba9ca0f2d', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '63ae3ca7-ac61-425e-a3b7-88c9c8bb2294', 'Azərbaycan Respublikasının Konstitusiyasına əsasən yalnız dərc edilmiş qanunlar hansı subyektlər üçün məcburidir?', 'multiple_choice',
    '["Yalnız dərc edilmiş qanunların tətbiqi və icrası bütün vətəndaşlar,yanız icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.", "Yalnız dərc edilmiş qanunların tətbiqi və icrası bütün vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti və yalnız hüquqi şəxslər üçün məcburidir.", "Yalnız dərc edilmiş qanunların tətbiqi və icrası yalnız qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.", "Yalnız dərc edilmiş qanunların tətbiqi və icrası bütün vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir."]'::jsonb, 'Yalnız dərc edilmiş qanunların tətbiqi və icrası bütün vətəndaşlar, qanunvericilik, icra və məhkəmə hakimiyyəti, hüquqi şəxslər və bələdiyyələr üçün məcburidir.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab D variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 21, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8c9d6a7e-8a09-4b17-ac07-ff9c2b26573c', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '6a09f3f2-b5f8-4deb-a83f-6fcafe8cc6bc', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikası xalq deputatlarının və Azərbaycan Respublikası Ali Sovetinin yaratdığı Milli Məclisin səlahiyyətləri nə zaman bitir?', 'multiple_choice',
    '["Yeni seçilmiş Azərbaycan Respublikası Milli Məclisinin ilk iclas günü başa çatır.", "Yeni seçilmiş Azərbaycan Respublikası Milli Məclisinin seçki günü başa çatır.", "Yeni seçilmiş Azərbaycan Respublikası Milli Məclisinin son iclas günü başa çatır.", "A)Yeni seçilmiş Azərbaycan Respublikası Milli Məclisinin andiçmə günü başa çatır."]'::jsonb, 'Yeni seçilmiş Azərbaycan Respublikası Milli Məclisinin ilk iclas günü başa çatır.', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab A variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 22, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '025ee79f-584d-4c48-8d5e-8eac186d3067', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '71b9ecef-70ec-4658-aa43-02b2ab3cddc7', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq yeni seçilmiş Azərbaycan Respublikası Milli Məclisinin ilk iclası nə zaman keçirilir?', 'multiple_choice',
    '["Azərbaycan Respublikası Milli Məclisinin çoxu 42 deputatının seçildiyi gündən bir həftə sonra keçirilir.", "Azərbaycan Respublikası Milli Məclisinin azı 83 deputatının seçildiyi gündən bir həftə sonra keçirilir.", "Azərbaycan Respublikası Milli Məclisinin azı 63 deputatının seçildiyi gündən bir həftə sonra keçirilir.", "Azərbaycan Respublikası Milli Məclisinin azı 95 deputatının seçildiyi gündən bir həftə sonra keçirilir."]'::jsonb, 'Azərbaycan Respublikası Milli Məclisinin azı 83 deputatının seçildiyi gündən bir həftə sonra keçirilir.', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab B variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 23, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'a179a4c3-e9a9-461e-82e3-d525edefabfb', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '73cb1c60-0159-4a98-892b-d674a47b122c', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının qanunvericiliyi yerli xalq deputatları sovetlərinə aid edilmiş səlahiyyətləri hansı orqan həyata keçirir?', 'multiple_choice',
    '["Yuxarı icra hakimiyyəti orqanları", "Mərkəzi icra hakimiyyəti orqanları", "Yerli icra hakimiyyəti orqanları", "Milli Məclis"]'::jsonb, 'Yerli icra hakimiyyəti orqanları', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab C variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 24, NULL, 'Milli Məclisin səlahiyyətləri və qanunvericilik təşəbbüsü normalarını rəhbər tutun.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'ba8f29b0-680f-4fdf-8e99-1ccc90dc84ad', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '75c33d35-ff3c-4ae0-8ae1-7af6c7e7a857', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq göstərilən maddələrin hansında dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["Ərazi", "Dövlətin ali məqsədi", "Xalqın suverenliyi", "Dövlətin borclarına qoyulan məhdudiyyətlər"]'::jsonb, 'Xalqın suverenliyi', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 25, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'bdfa96f5-5844-4a19-8fc7-e71a29767aa2', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '80c5d5b2-480e-40f7-874a-91921d35d6c8', 'Azərbaycan Respublikasının Konstitusiyasına əsasən hansı normativ hüquqi aktların qüvvəsi geriyə şamil edilir?', 'multiple_choice',
    '["Bütün normativ hüquqi aktların qüvvəsi geriyə şamil edilir;", "Fiziki və hüquqi şəxslərin hüquqi vəziyyətini yaxşılaşdıran, hüquq məsuliyyətini aradan qaldıran və ya yüngülləşdirən normativ hüquqi aktların qüvvəsi geriyə şamil edilir;", "Cinayət qanunvericiliyi istisna olmaqla, normativ hüquqi aktların qüvvəsi geriyə şamil edilir;", "Normativ hüquqi aktların qüvvəsi heç bir halda geriyə şamil edilmir."]'::jsonb, 'Fiziki və hüquqi şəxslərin hüquqi vəziyyətini yaxşılaşdıran, hüquq məsuliyyətini aradan qaldıran və ya yüngülləşdirən normativ hüquqi aktların qüvvəsi geriyə şamil edilir;', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab B variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 26, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8d8c2468-126f-4eeb-ad58-d78a3b96b08d', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '81bfa001-b697-4cff-abc1-c0de8462ec4c', 'Azərbaycan Respublikasının Konstitusiyasında dəyişikliklərin qəbul edilməsi qaydasına aiddir', 'multiple_choice',
    '["Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklər yalnız Azərbaycan Respublikasının Milli Məclisində 95 səs çoxluğu ilə qəbul edilə bilər.", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklər yalnız Azərbaycan Respublikasının Prezidenti tərəfindən ikinci dəfə imzalanmaqla qəbul edilə bilər.", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklər yalnız referendumla qəbul edilə bilər.", "Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklər yalnız hər 7 ildən sonra qəbul edilə bilər."]'::jsonb, 'Azərbaycan Respublikası Konstitusiyasının mətnində dəyişikliklər yalnız referendumla qəbul edilə bilər.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab C variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 27, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4fa1a37e-efc4-436b-8643-46943515f4f6', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '8415e1de-985e-4c55-b6b4-2fb146a84976', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikası Prezidentinin fərmanları ilə bağlı olan variantı seçin', 'multiple_choice',
    '["Azərbaycan Respublikası Prezidentinin fərmanları Azərbaycan Respublikasının Konstitusiyasına və qanunlarına zidd olmamalıdır.", "Azərbaycan Respublikası Prezidentinin fərmanları Azərbaycan Respublikasının Konstitusiyasına və qanunlarına, habelə Nazirlər Kabinetinin qərarlaına zidd olmamalıdır.", "Azərbaycan Respublikası Prezidentinin fərmanları Azərbaycan Respublikasının Konstitusiyasına və qanunlarına, habelə mərkəzi icra hakimiyyəti orqanlarının qərarlarına zidd olmamalıdır.", "Azərbaycan Respublikası Prezidentinin fərmanları yalnız Azərbaycan Respublikasının Konstitusiyasına və Konstitusiya qanunlarına zidd olmamalıdır."]'::jsonb, 'Azərbaycan Respublikası Prezidentinin fərmanları Azərbaycan Respublikasının Konstitusiyasına və qanunlarına zidd olmamalıdır.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab A variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 28, NULL, 'AR Prezidentinin konstitusion səlahiyyətləri və fərman/sərəncam hüququna diqqət yetirin.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'dd66a4f0-a4f2-4822-8c09-84ea5cdd0331', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '8b35e49c-67c8-446a-8ffa-bb460ade2e74', '1995-ci il 12 noyabr tarixli Azərbaycan Respublikasının Konstitusiyası qüvvəyə mindiyi gündən hansı akt qüvvədən düşür?', 'multiple_choice',
    '["Bu Konstitusiyanın qüvvəyə mindiyi gündən 1956-ci il aprelin 30-də qəbul edilmiş Azərbaycan Respublikasının Konstitusiyası (Əsas Qanunu) qüvvədən düşür.", "Bu Konstitusiyanın qüvvəyə mindiyi gündən 1978-ci il aprelin 21-də qəbul edilmiş Azərbaycan Respublikasının Konstitusiyası (Əsas Qanunu) qüvvədən düşür.", "Bu Konstitusiyanın qüvvəyə mindiyi gündən 1921-ci il aprelin 3-də qəbul edilmiş Azərbaycan Respublikasının Konstitusiyası (Əsas Qanunu) qüvvədən düşür.", "Bu Konstitusiyanın qüvvəyə mindiyi gündən 1918-ci il aprelin 11-də qəbul edilmiş Azərbaycan Respublikasının Konstitusiyası (Əsas Qanunu) qüvvədən düşür."]'::jsonb, 'Bu Konstitusiyanın qüvvəyə mindiyi gündən 1978-ci il aprelin 21-də qəbul edilmiş Azərbaycan Respublikasının Konstitusiyası (Əsas Qanunu) qüvvədən düşür.', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab B variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 29, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '4eff8d16-a03e-4cc5-950c-b40a609496c1', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '8f5c5805-50f3-45de-9d4f-36a040972041', 'Azərbaycan Respublikasının Konstitusiyasına əsasən aşağıdakı aktlardan hansı qanunvericilik sisteminə daxil deyil?', 'multiple_choice',
    '["Konstitusiya, referendumla qəbul edilmiş aktlar;", "qanunlar, fərmanlar;", "Azərbaycan Respublikası Nazirlər Kabinetinin qərarları, mərkəzi icra hakimiyyəti orqanlarının normativ aktları;", "Azərbaycan Respublikasının Konstitusiya Məhkəməsinin Konstitusiyanın və qanunların təfsir edilməsinə dair qərarları."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiya Məhkəməsinin Konstitusiyanın və qanunların təfsir edilməsinə dair qərarları.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab D variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 30, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    'b82f5d8e-e08c-49cd-ba37-3cf1c4b51ae2', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '92fd4916-8b8a-4de4-881e-b0c92555a9c5', 'Azərbaycan Respublikasının Konstitusiyasında dəyişikliklər təklif edilməsi təşəbbüsünün məhdudlaşdırılması maddəsinə aiddir', 'multiple_choice',
    '["Bu Konstitusiyanın III fəslində nəzərdə tutulmuş insan və vətəndaş hüquqları və azadlıqlarının ləğvi və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə nəzərdə tutulduğundan daha az dərəcədə məhdudlaşdırılması haqqında təkliflər referenduma çıxarıla bilməz.", "Bu Konstitusiyanın III fəslində nəzərdə tutulmuş insan və vətəndaş hüquqları və azadlıqlarının ləğvi və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə nəzərdə tutulduğundan daha artıq dərəcədə məhdudlaşdırılması haqqında təkliflər referenduma çıxarıla bilər", "Bu Konstitusiyanın III fəslində nəzərdə tutulmuş insan və vətəndaş hüquqları və azadlıqlarının ləğvi və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə nəzərdə tutulduğundan daha artıq dərəcədə məhdudlaşdırılmaması haqqında təkliflər referenduma çıxarıla bilməz.", "Bu Konstitusiyanın III fəslində nəzərdə tutulmuş insan və vətəndaş hüquqları və azadlıqlarının ləğvi və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə nəzərdə tutulduğundan daha artıq dərəcədə məhdudlaşdırılması haqqında təkliflər referenduma çıxarıla bilməz."]'::jsonb, 'Bu Konstitusiyanın III fəslində nəzərdə tutulmuş insan və vətəndaş hüquqları və azadlıqlarının ləğvi və ya Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə nəzərdə tutulduğundan daha artıq dərəcədə məhdudlaşdırılması haqqında təkliflər referenduma çıxarıla bilməz.', 'AR Konstitusiyası Maddə 152 - 155 (Konstitusiyada dəyişikliklər edilməsi) — Düzgün cavab D variantıdır. Dəyişikliklər yalnız referendumla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər. 1, 2, 6, 7, 8 və 21-ci maddələrdə dəyişikliklər, habelə III fəsildə hüquq və azadlıqların ləğvi/məhdudlaşdırılması referenduma çıxarıla bilməz (Maddə 155).', 31, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '87163ae0-2627-47bd-9aae-5453c44aa4e3', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '93e38e9a-f5c1-471a-9023-4ec19d6df13d', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq göstərilən maddələrin hansında dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["Hakimiyyətin mənbəyi", "Ümumxalq səsverməsi-referendum yolu ilə həll edilən məsələlər", "Xalqı təmsil etmək hüququ", "Xalqın vahidliyi"]'::jsonb, 'Ümumxalq səsverməsi-referendum yolu ilə həll edilən məsələlər', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 32, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '9e1be7a5-4939-4d4d-8d49-0051d1c3f504', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '97f25be6-5246-4407-b4f0-1b96882b6748', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı müddətdə yerli özünüidarə haqqında qanun qəbul edilməli və bələdiyyələrə seçkilər keçirilməlidir?', 'multiple_choice',
    '["Konstitusiya qüvvəyə mindikdən sonra bir il müddətində", "Konstitusiya qüvvəyə mindikdən sonra iki il müddətində", "Konstitusiya qüvvəyə mindikdən sonra üç il müddətində", "Konstitusiya qüvvəyə mindikdən sonra dörd il müddətində"]'::jsonb, 'Konstitusiya qüvvəyə mindikdən sonra iki il müddətində', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab B variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 33, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '12360ee5-0538-41c5-bd6a-2e36a29f0547', 'f7baac9f-fa37-45f7-be38-d99627d9bada', '996443c2-ccb1-4ec0-94bc-e0d7020e0fd2', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Nazirlər Kabineti nə zamandan etibarən bu Konstitusiyada müəyyən edilən səlahiyyətləri həyata keçirir?', 'multiple_choice',
    '["Konstitusiyanın qüvvəyə mindiyi gündən", "Konstitusiyanın qəbul olunduğu gündən", "Konstitusiyanın imzalandığı gündən", "Konstitusiyanın elan olunduğu gündən"]'::jsonb, 'Konstitusiyanın qüvvəyə mindiyi gündən', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab A variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 34, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '6a252758-0f68-481c-b3f6-9d29146516ca', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'a6eb6c24-dea0-4aa7-8193-5a2df652985a', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq göstərilən maddələrin hansında dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["Hakimiyyətin mənimsənilməsinə yol verilməməsi", "Xalqı təmsil etmək hüququ", "Təbii ehtiyatlar", "Silahlı Qüvvələr"]'::jsonb, 'Hakimiyyətin mənimsənilməsinə yol verilməməsi', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 35, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3d790d25-87bd-4dde-8d23-3f23e4d2e4ba', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'a8a2bd9f-5c34-4c28-8376-67ac57a04855', 'Azərbaycan Respublikasının Konstitusiyası nə zaman qüvvəyə minir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyası referendumla qəbul edildikdən sonra rəsmən imzalandığı gündən qüvvəyə minir.", "Azərbaycan Respublikasının Konstitusiyası referendumla qəbul edildikdən sonra nəticələr elan edildiyi gündən qüvvəyə minir.", "Azərbaycan Respublikasının Konstitusiyası referendumla qəbul edildikdən sonra rəsmən dərc olunduğu gündən qüvvəyə minir.", "Azərbaycan Respublikasının Konstitusiyası Milli Məclisin Plenar iclasında qəbul edildikdən sonra rəsmən dərc olunduğu gündən qüvvəyə minir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyası referendumla qəbul edildikdən sonra rəsmən dərc olunduğu gündən qüvvəyə minir.', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab C variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 36, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '2c371f0c-5167-4985-8bf4-3b55e7b44ec1', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'b387dfe7-390d-4818-ab39-a9891392d9da', 'Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları nə zaman qüvvəyə minir?', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən ikinci səsvermədən sonra imzalandıqda qüvvəyə minir.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən birinci səsvermədən sonra imzalandıqda qüvvəyə minir.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Konstitusiya Məhkəməsinin qərarına əsasən ikinci səsvermədən sonra imzalandıqda qüvvəyə minir.", "Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən ikinci səsvermədən sonra imzalandıqda və Ali Məhkəmənin rəyi olduqda qüvvəyə minir."]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyasına əlavələr haqqında Konstitusiya qanunları Azərbaycan Respublikasının Prezidenti tərəfindən ikinci səsvermədən sonra imzalandıqda qüvvəyə minir.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab A variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 37, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '042d062f-c06d-4c52-8535-bd72eb7143b4', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'b5594258-8cac-49b0-accf-86ddc5f2def8', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Konstitusiya qanunları haqqında doğru fikri seçin', 'multiple_choice',
    '["Konstitusiya qanunları Azərbaycan Respublikası Konstitusiyasının ayrılmaz hissəsidir və Azərbaycan Respublikası Konstitusiyasının keçid müddəalarına zidd olmamalıdır.", "Konstitusiya qanunları Azərbaycan Respublikası Konstitusiyasının ayrılmaz hissəsidir və Azərbaycan Respublikası Konstitusiyasının ilk üç bölməsinə zidd olmamalıdır.", "Konstitusiya qanunları Azərbaycan Respublikası Konstitusiyasının ayrılmaz hissəsidir və Azərbaycan Respublikası Konstitusiyasının dövləthakimiyyəti bölməsinə zidd olmamalıdır.", "Konstitusiya qanunları Azərbaycan Respublikası Konstitusiyasının ayrılmaz hissəsidir və Azərbaycan Respublikası Konstitusiyasının əsas mətninə zidd olmamalıdır."]'::jsonb, 'Konstitusiya qanunları Azərbaycan Respublikası Konstitusiyasının ayrılmaz hissəsidir və Azərbaycan Respublikası Konstitusiyasının əsas mətninə zidd olmamalıdır.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab D variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 38, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3f962536-2dcb-45c6-af11-a71426c36212', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'c715ec27-6502-4832-81f9-881a2f8a6c2e', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı müddət ərzində hakimlərin statusu, məhkəmə quruluşu və məhkəmə islahatı ilə əlaqədar Azərbaycan Respublikasının bu Konstitusiyaya uyğun olan qanunvericiliyi qəbul edilməlidir və Azərbaycan Respublikası məhkəmələrinin hakimləri yenidən təyin edilməlidir?', 'multiple_choice',
    '["Konstitusiya qüvvəyə mindikdən sonra bir il müddətində", "Konstitusiya qüvvəyə mindikdən sonra iki il müddətində", "Konstitusiya qüvvəyə mindikdən sonra üç il müddətində", "Konstitusiya qüvvəyə mindikdən sonra dörd il müddətində"]'::jsonb, 'Konstitusiya qüvvəyə mindikdən sonra bir il müddətində', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab A variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 39, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '791ea3c8-7000-4919-b46b-48a25cdc2112', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'c95bc2aa-9259-4fcb-92b5-da75c0db0b26', 'Azərbaycan Respublikasının Konstitusiyasına əlavələrin təklif edilməsi təşəbbüsünün məhdudlaşdırılması maddəsinə aiddir', 'multiple_choice',
    '["Bu Konstitusiyanın ikinci bölməsində əks etdirilmiş müddəalarla əlaqədar Azərbaycan Respublikası Konstitusiyasına əlavələr təklif edilə bilməz.", "Bu Konstitusiyanın birinci bölməsində əks etdirilmiş müddəalarla əlaqədar Azərbaycan Respublikası Konstitusiyasına əlavələr təklif edilə bilməz.", "Bu Konstitusiyanın üçüncü bölməsində əks etdirilmiş müddəalarla əlaqədar Azərbaycan Respublikası Konstitusiyasına əlavələr təklif edilə bilməz.", "Bu Konstitusiyanın dördüncü bölməsində əks etdirilmiş müddəalarla əlaqədar Azərbaycan Respublikası Konstitusiyasına əlavələr təklif edilə bilməz."]'::jsonb, 'Bu Konstitusiyanın birinci bölməsində əks etdirilmiş müddəalarla əlaqədar Azərbaycan Respublikası Konstitusiyasına əlavələr təklif edilə bilməz.', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab B variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 40, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '87365891-ddc6-4006-9a6c-2a848f3ea185', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'cad36097-4a6b-472c-a723-b511040aa515', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq göstərilən maddələrin hansında dəyişikliklər və ya onların ləğv edilməsi haqqında təkliflər referenduma çıxarıla bilməz?', 'multiple_choice',
    '["Azərbaycan dövlətinin başçısı", "Xalqın vahidliyi", "Xalqı təmsil etmək hüququ", "Sosial inkişaf və dövlət"]'::jsonb, 'Azərbaycan dövlətinin başçısı', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab A variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 41, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '72ce88f7-da6e-4d17-bcfe-caaaa3cd4a60', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'd0d863ad-e3f6-4a62-9357-5c658f05b794', 'Azərbaycan Respublikasının Konstitusiyasına əsasən birbaşa hüquqi qüvvədə olan aktı seçin', 'multiple_choice',
    '["Azərbaycan Respublikasının Konstitusiya qanunları", "Azərbaycan Respublikasının Konstitusiyası", "Azərbaycan Respublikasının Konstitusiyası və qanunları", "Azərbaycan Respublikasının Konstitusiyası və Konstitusiya Məhkəməsinin qərarları Keçid müddəaları"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyası', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab B variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 42, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '72858d89-4eda-4ee7-9f4f-16da3ccb231b', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'd66e569c-f9d8-45ea-9a37-235e8a1dae70', 'Azərbaycan Respublikasının Konstitusiyasına görə doğrudur', 'multiple_choice',
    '["Qanunlar fərmanlara zidd olmamalıdır.", "Qanunlar Nazirlər Kabinetinin qərarlarına zidd olmamalıdır.", "Qanunlar Konstitusiyaya zidd olmamalıdır.", "Qanunlar Yerli İcra Hakimiyyəti orqanlarının normativ aktlarına zidd olmamalıdır."]'::jsonb, 'Qanunlar Konstitusiyaya zidd olmamalıdır.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Düzgün cavab C variantıdır. Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 43, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '3c0e5b0e-b067-4d35-912c-347a89547188', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'e41f8c45-f90a-4ccd-a297-4ef85ee0b655', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq Azərbaycan Respublikasının Konstitusiya Məhkəməsi yaradılanadək bu Konstitusiyada nəzərdə tutulmuş Azərbaycan Respublikası Konstitusiya Məhkəməsinin səlahiyyətlərini hansı orqan həyata keçirir?', 'multiple_choice',
    '["Milli Məclis", "Nazirlər Kabineti", "Ali Məhkəmə", "Həyata keçirilmir"]'::jsonb, 'Həyata keçirilmir', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab D variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 44, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '8c3abd13-3d0a-482f-8976-c0ab2ae78336', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'e76aa47e-62f6-44c0-8551-486110004956', 'Azərbaycan Respublikasının Konstitusiyasına əsasən doğrudur', 'multiple_choice',
    '["Hər kəs dərc edilməyən normativ hüquqi aktın icrasına (ona riayət olunmasına) məcbur edilə bilər və belə aktın icra olunmamasına (ona riayət olunmamasına) görə məsuliyyətə cəlb edilə bilər", "Hamı dərc edilməyən normativ hüquqi aktın icrasına (ona riayət olunmasına) məcbur edilə bilər və belə aktın icra olunmamasına (ona riayət olunmamasına) görə məsuliyyətə cəlb edilə bilər", "Hər bir şəxs dərc edilməyən normativ hüquqi aktın icrasına (ona riayət olunmasına) məcbur edilə bilər və belə aktın icra olunmamasına (ona riayət olunmamasına) görə məsuliyyətə cəlb edilə bilər", "Heç kəs dərc edilməyən normativ hüquqi aktın icrasına (ona riayət olunmasına) məcbur edilə bilməz və belə aktın icra olunmamasına (ona riayət olunmamasına) görə məsuliyyətə cəlb edilə bilməz."]'::jsonb, 'Heç kəs dərc edilməyən normativ hüquqi aktın icrasına (ona riayət olunmasına) məcbur edilə bilməz və belə aktın icra olunmamasına (ona riayət olunmamasına) görə məsuliyyətə cəlb edilə bilməz.', 'AR Konstitusiyası Maddə 147 - 151 (Qanunvericilik sistemi və Normativ aktlar) — Konstitusiya ən yüksək və birbaşa hüquqi qüvvəyə malikdir. Normativ aktlar hüquqa və haqq-ədalətə əsaslanmalıdır. Qanunvericilik aktları ilə beynəlxalq müqavilələr arasında ziddiyyət yarandıqda beynəlxalq müqavilələr tətbiq edilir (Maddə 151).', 45, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '12563aa6-60ce-4054-a5b1-ec41ab92c206', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'f237ca3f-a01a-482c-ad75-2378af0b8d12', 'Azərbaycan Respublikasının Konstitusiyasının keçid müddəalarına aiddir', 'multiple_choice',
    '["Bu Konstitusiyanın qəbul edildiyi günədək Azərbaycan Respublikasının ərazisində qüvvədə olan qanunlar və başqa normativ hüquqi aktlar bütün hallarda öz qüvvəsini saxlayır.", "Bu Konstitusiyanın qəbul edildiyi günədək Azərbaycan Respublikasının ərazisində qüvvədə olan qanunlar və başqa normativ hüquqi aktlar bu Konstitusiyaya zidd olmayan hissədə öz qüvvəsini itirir", "Bu Konstitusiyanın qəbul edildiyi günədək Azərbaycan Respublikasının ərazisində qüvvədə olan qanunlar və başqa normativ hüquqi aktlar bu Konstitusiyaya zidd olan hissədə öz qüvvəsini saxlayır.", "Bu Konstitusiyanın qəbul edildiyi günədək Azərbaycan Respublikasının ərazisində qüvvədə olan qanunlar və başqa normativ hüquqi aktlar bu Konstitusiyaya zidd olmayan hissədə öz qüvvəsini saxlayır."]'::jsonb, 'Bu Konstitusiyanın qəbul edildiyi günədək Azərbaycan Respublikasının ərazisində qüvvədə olan qanunlar və başqa normativ hüquqi aktlar bu Konstitusiyaya zidd olmayan hissədə öz qüvvəsini saxlayır.', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab D variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 46, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '04e338d9-0d4c-4051-a520-03d7861b57a9', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'f34057e2-c205-4812-9a23-36c57fa4646e', 'Azərbaycan Respublikasının Konstitusiyasına uyğun olaraq hansı müddətdə Azərbaycan Respublikasının Konstitusiya Məhkəməsi haqqında Azərbaycan Respublikasının Qanunu qəbul edilməli və Azərbaycan Respublikasının Konstitusiya Məhkəməsi yaradılmalıdır?', 'multiple_choice',
    '["Konstitusiya qüvvəyə mindikdən sonra bir il müddətində", "Konstitusiya qüvvəyə mindikdən sonra iki il müddətində", "Konstitusiya qüvvəyə mindikdən sonra üç il müddətində", "Konstitusiya qüvvəyə mindikdən sonra dörd il müddətində"]'::jsonb, 'Konstitusiya qüvvəyə mindikdən sonra bir il müddətində', 'AR Konstitusiyası Keçid Müddəaları (Bənd 1 - 12) — Düzgün cavab A variantıdır. Konstitusiya 1995-ci il 27 noyabrda rəsmi dərc edildiyi gün qüvvəyə minmiş və 1978-ci il Konstitusiyası qüvvədən düşmüşdür. Ali Arbitraj Məhkəməsi ''İqtisad Məhkəməsi'' adlandırılmışdır.', 47, NULL, 'Məhkəmə hakimiyyətinin müstəqilliyi və ədalət mühakiməsi prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);


INSERT INTO questions (
    id, quiz_id, bank_question_id, question_text, question_type,
    options, correct_answer, explanation, order_index, title, hint,
    question_image_url, option_images, media_type, media_url, is_required
) VALUES (
    '0b201116-486a-476a-94df-110e4d2a25bb', 'f7baac9f-fa37-45f7-be38-d99627d9bada', 'f3ab781b-c31f-4274-8df9-bc5e3f6a0d93', 'Azərbaycan Respublikasının Konstitusiyasına əsasən Azərbaycan Respublikasında ən yüksək hüquqi qüvvəyə malikdir:', 'multiple_choice',
    '["Rreferendumla qəbul olunmuş aktlar", "Azərbaycan Respublikasının Konstitusiyası", "Qanun", "Beynəlxalq müqavilələr"]'::jsonb, 'Azərbaycan Respublikasının Konstitusiyası', 'AR Konstitusiyası Maddə 156 - 158 (Konstitusiyaya əlavələr edilməsi) — Düzgün cavab B variantıdır. Əlavələr MM-də 95 səs çoxluğu ilə Konstitusiya Qanunları şəklində 6 ay fasilə ilə iki dəfə səsə qoyulmaqla qəbul edilir. Prezident və ya MM-in azı 63 deputatı təklif edə bilər.', 48, NULL, 'Azərbaycan Respublikasının Konstitusiyasının əsas prinsiplərini nəzərə alın.',
    NULL, '[]'::jsonb, NULL, NULL, true
);

COMMIT;
