BEGIN;
-- 1. Qəbələ turunun əvvəlki 32 quizini arxivləşdiririk
UPDATE quizzes SET is_archived = true WHERE exam_category = 'Olimpiada' AND title LIKE '%Qəbələ%';

-- ========================================================
-- QUIZ: Azərbaycan dili (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Azərbaycan dili - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azərbaycan dili (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Azərbaycan dili fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Azərbaycan dili',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '128330',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7b1660cf-f77f-4b1e-bf63-e9868ab77c52'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Mətni oxuyun və sualı mətn əsasında cavablandırın:
I Qafqaz Albaniyası Azərbaycanın şimalında və Xəzər dənizinin qərb sahillərində yaranmış qədim dövlətlərdən biridir. II B.e.ə. IV əsrin sonlarında yaranmış bu dövlətin ərazisində albanlar, qarqarlar, kaspi və leglər kimi müxtəlif tayfalar yaşayırdı. III Bu tayfalar, əsasən, əkinçilik, bağçılıq, üzümçülük və müxtəlif sənətkarlıq sahələri ilə məşğul olurdular. IV Roma mənbələrində Albaniyanın vilayətlərə bölündüyü və hər vilayətin öz xüsusi idarəçisinə sahib olduğu bildirilirdi. V Hökmdar Urnayrın mərkəzi hakimiyyəti möhkəmləndirmək siyasəti ölkənin hərbi gücünü artırmışdı. VI Urnayr həmçinin xarici siyasətdə güclü Sasanilər dövləti ilə diplomatiyaya və ittifaqa üstünlük verirdi. VII Müasir dövrdə də Azərbaycanın şimal-qərb bölgələrində Albaniya mədəniyyətinin izlərinə rast gəlinir. VIII Bunlar Şəki rayonundakı Kiş alban məbədi, Qəbələ şəhər xarabalıqları və digər tarixi-memarlıq abidələridir.
1. Mətni üç abzasa bölsək, ikinci və üçüncü abzaslar hansı cümlələrlə başlayar?',
    'multiple_choice',
    '["III və VII", "IV və VI", "IV və VII", "II və VIII", "III və V"]'::jsonb,
    'IV və VII',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5f78a6f3-5ebb-4fd1-9ce7-548dc51df367'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Mətni oxuyun və sualı mətn əsasında cavablandırın:
I Qafqaz Albaniyası Azərbaycanın şimalında və Xəzər dənizinin qərb sahillərində yaranmış qədim dövlətlərdən biridir. II B.e.ə. IV əsrin sonlarında yaranmış bu dövlətin ərazisində albanlar, qarqarlar, kaspi və leglər kimi müxtəlif tayfalar yaşayırdı. III Bu tayfalar, əsasən, əkinçilik, bağçılıq, üzümçülük və müxtəlif sənətkarlıq sahələri ilə məşğul olurdular. IV Roma mənbələrində Albaniyanın vilayətlərə bölündüyü və hər vilayətin öz xüsusi idarəçisinə sahib olduğu bildirilirdi. V Hökmdar Urnayrın mərkəzi hakimiyyəti möhkəmləndirmək siyasəti ölkənin hərbi gücünü artırmışdı. VI Urnayr həmçinin xarici siyasətdə güclü Sasanilər dövləti ilə diplomatiyaya və ittifaqa üstünlük verirdi. VII Müasir dövrdə də Azərbaycanın şimal-qərb bölgələrində Albaniya mədəniyyətinin izlərinə rast gəlinir. VIII Bunlar Şəki rayonundakı Kiş alban məbədi, Qəbələ şəhər xarabalıqları və digər tarixi-memarlıq abidələridir.
1. Mətni üç abzasa bölsək, ikinci və üçüncü abzaslar hansı cümlələrlə başlayar?',
    'multiple_choice',
    '["III və VII", "IV və VI", "IV və VII", "II və VIII", "III və V"]'::jsonb,
    'IV və VII',
    1,
    '7b1660cf-f77f-4b1e-bf63-e9868ab77c52'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4ed67f9d-664b-4d68-85e3-e9f976c50fd2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Mətni oxuyun və sualı mətn əsasında cavablandırın:
I Qafqaz Albaniyası Azərbaycanın şimalında və Xəzər dənizinin qərb sahillərində yaranmış qədim dövlətlərdən biridir. II B.e.ə. IV əsrin sonlarında yaranmış bu dövlətin ərazisində albanlar, qarqarlar, kaspi və leglər kimi müxtəlif tayfalar yaşayırdı. III Bu tayfalar, əsasən, əkinçilik, bağçılıq, üzümçülük və müxtəlif sənətkarlıq sahələri ilə məşğul olurdular. IV Roma mənbələrində Albaniyanın vilayətlərə bölündüyü və hər vilayətin öz xüsusi idarəçisinə sahib olduğu bildirilirdi. V Hökmdar Urnayrın mərkəzi hakimiyyəti möhkəmləndirmək siyasəti ölkənin hərbi gücünü artırmışdı. VI Urnayr həmçinin xarici siyasətdə güclü Sasanilər dövləti ilə diplomatiyaya və ittifaqa üstünlük verirdi. VII Müasir dövrdə də Azərbaycanın şimal-qərb bölgələrində Albaniya mədəniyyətinin izlərinə rast gəlinir. VIII Bunlar Şəki rayonundakı Kiş alban məbədi, Qəbələ şəhər xarabalıqları və digər tarixi-memarlıq abidələridir.
2. Mətndəki məntiqi ardıcıllığa əsasən hansı cümlədəki fikir bilavasitə tayfaların gündəlik həyatı və təsərrüfatı ilə bağlıdır?',
    'multiple_choice',
    '["I cümlə", "III cümlə", "V cümlə", "VI cümlə", "VIII cümlə"]'::jsonb,
    'III cümlə',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b9efc095-b489-4ebb-9ddc-33c5397b36df'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Mətni oxuyun və sualı mətn əsasında cavablandırın:
I Qafqaz Albaniyası Azərbaycanın şimalında və Xəzər dənizinin qərb sahillərində yaranmış qədim dövlətlərdən biridir. II B.e.ə. IV əsrin sonlarında yaranmış bu dövlətin ərazisində albanlar, qarqarlar, kaspi və leglər kimi müxtəlif tayfalar yaşayırdı. III Bu tayfalar, əsasən, əkinçilik, bağçılıq, üzümçülük və müxtəlif sənətkarlıq sahələri ilə məşğul olurdular. IV Roma mənbələrində Albaniyanın vilayətlərə bölündüyü və hər vilayətin öz xüsusi idarəçisinə sahib olduğu bildirilirdi. V Hökmdar Urnayrın mərkəzi hakimiyyəti möhkəmləndirmək siyasəti ölkənin hərbi gücünü artırmışdı. VI Urnayr həmçinin xarici siyasətdə güclü Sasanilər dövləti ilə diplomatiyaya və ittifaqa üstünlük verirdi. VII Müasir dövrdə də Azərbaycanın şimal-qərb bölgələrində Albaniya mədəniyyətinin izlərinə rast gəlinir. VIII Bunlar Şəki rayonundakı Kiş alban məbədi, Qəbələ şəhər xarabalıqları və digər tarixi-memarlıq abidələridir.
2. Mətndəki məntiqi ardıcıllığa əsasən hansı cümlədəki fikir bilavasitə tayfaların gündəlik həyatı və təsərrüfatı ilə bağlıdır?',
    'multiple_choice',
    '["I cümlə", "III cümlə", "V cümlə", "VI cümlə", "VIII cümlə"]'::jsonb,
    'III cümlə',
    2,
    '4ed67f9d-664b-4d68-85e3-e9f976c50fd2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4c14db39-fcfc-41f9-8a72-04108cd3552b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Mətni oxuyun və sualı mətn əsasında cavablandırın:
I Qafqaz Albaniyası Azərbaycanın şimalında və Xəzər dənizinin qərb sahillərində yaranmış qədim dövlətlərdən biridir. II B.e.ə. IV əsrin sonlarında yaranmış bu dövlətin ərazisində albanlar, qarqarlar, kaspi və leglər kimi müxtəlif tayfalar yaşayırdı. III Bu tayfalar, əsasən, əkinçilik, bağçılıq, üzümçülük və müxtəlif sənətkarlıq sahələri ilə məşğul olurdular. IV Roma mənbələrində Albaniyanın vilayətlərə bölündüyü və hər vilayətin öz xüsusi idarəçisinə sahib olduğu bildirilirdi. V Hökmdar Urnayrın mərkəzi hakimiyyəti möhkəmləndirmək siyasəti ölkənin hərbi gücünü artırmışdı. VI Urnayr həmçinin xarici siyasətdə güclü Sasanilər dövləti ilə diplomatiyaya və ittifaqa üstünlük verirdi. VII Müasir dövrdə də Azərbaycanın şimal-qərb bölgələrində Albaniya mədəniyyətinin izlərinə rast gəlinir. VIII Bunlar Şəki rayonundakı Kiş alban məbədi, Qəbələ şəhər xarabalıqları və digər tarixi-memarlıq abidələridir.
3. Mətnə əsasən hansı fikri dəqiq sübut etmək olar?',
    'multiple_choice',
    '["Albaniya dövlətində yalnız tək bir etnik tayfa məskunlaşmışdı.", "Roma mənbələri Albaniya haqqında məlumat verən yeganə yazılı mənbədir.", "Albaniya xarici siyasətdə Roma imperiyası ilə tam müttəfiq idi.", "Qədim Albaniyada ölkə idarəçiliyində vilayət bölgüsündən istifadə olunurdu.", "Şəkidəki Kiş alban məbədi Albaniya haqda daha çox məlumat verir."]'::jsonb,
    'Qədim Albaniyada ölkə idarəçiliyində vilayət bölgüsündən istifadə olunurdu.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '85528a92-05f5-49d6-b4c6-3560a75d570b'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Mətni oxuyun və sualı mətn əsasında cavablandırın:
I Qafqaz Albaniyası Azərbaycanın şimalında və Xəzər dənizinin qərb sahillərində yaranmış qədim dövlətlərdən biridir. II B.e.ə. IV əsrin sonlarında yaranmış bu dövlətin ərazisində albanlar, qarqarlar, kaspi və leglər kimi müxtəlif tayfalar yaşayırdı. III Bu tayfalar, əsasən, əkinçilik, bağçılıq, üzümçülük və müxtəlif sənətkarlıq sahələri ilə məşğul olurdular. IV Roma mənbələrində Albaniyanın vilayətlərə bölündüyü və hər vilayətin öz xüsusi idarəçisinə sahib olduğu bildirilirdi. V Hökmdar Urnayrın mərkəzi hakimiyyəti möhkəmləndirmək siyasəti ölkənin hərbi gücünü artırmışdı. VI Urnayr həmçinin xarici siyasətdə güclü Sasanilər dövləti ilə diplomatiyaya və ittifaqa üstünlük verirdi. VII Müasir dövrdə də Azərbaycanın şimal-qərb bölgələrində Albaniya mədəniyyətinin izlərinə rast gəlinir. VIII Bunlar Şəki rayonundakı Kiş alban məbədi, Qəbələ şəhər xarabalıqları və digər tarixi-memarlıq abidələridir.
3. Mətnə əsasən hansı fikri dəqiq sübut etmək olar?',
    'multiple_choice',
    '["Albaniya dövlətində yalnız tək bir etnik tayfa məskunlaşmışdı.", "Roma mənbələri Albaniya haqqında məlumat verən yeganə yazılı mənbədir.", "Albaniya xarici siyasətdə Roma imperiyası ilə tam müttəfiq idi.", "Qədim Albaniyada ölkə idarəçiliyində vilayət bölgüsündən istifadə olunurdu.", "Şəkidəki Kiş alban məbədi Albaniya haqda daha çox məlumat verir."]'::jsonb,
    'Qədim Albaniyada ölkə idarəçiliyində vilayət bölgüsündən istifadə olunurdu.',
    3,
    '4c14db39-fcfc-41f9-8a72-04108cd3552b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2f311c83-ad9f-4050-85cd-e7f1b699d821'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş sözlərə əsasən fonetik təhlillə bağlı uyğunluğu müəyyən edin:
1-ci xanada: «bədxasiyyət» | 2-ci xanada: «ondördlük» | 3-cü (ortaq) xanada: «tərəfkeşlik»',
    'multiple_choice',
    '["1. Deyiliş və yazılışı arasında tərkibindəki qapalı saitin sayı qədər fərq var; 2. Tərkibində birdən çox səsdəyişməsi müşahidə edilir; 3. Eyni səsdən iki dəfə istifadə olunub.", "1. Saitlərdən biri uzun tələffüz olunur; 2. Deyiliş və yazılışı arasında şəkilçilərinin sayı qədər fərq var; 3. Tərkibində cəmi bir qapalı sait iştirak edib.", "1. İlk sözünün son samiti kar qarşılığı kimi tələffüz olunur; 2. Deyiliş və yazılışı arasında ən az iki fərqli məqam var; 3. Sonu kar samitlə bitir.", "1. Cingiltili samitlə başlayıb kar samitlə bitir; 2. Açıq saitlərin sayı qapalılardan çoxdur; 3. [d] samitinin həm özü, həm də qarşılığı işlənib.", "1. Deyiliş və yazılışı arasında bir fərqli məqam var; 2. Sait uzanması müşahidə olunmur; 3. Bütün hecaları samitlə bitir."]'::jsonb,
    '1. Deyiliş və yazılışı arasında tərkibindəki qapalı saitin sayı qədər fərq var; 2. Tərkibində birdən çox səsdəyişməsi müşahidə edilir; 3. Eyni səsdən iki dəfə istifadə olunub.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '89b2a4e2-9844-4f76-8246-5aa5a2c82d48'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Verilmiş sözlərə əsasən fonetik təhlillə bağlı uyğunluğu müəyyən edin:
1-ci xanada: «bədxasiyyət» | 2-ci xanada: «ondördlük» | 3-cü (ortaq) xanada: «tərəfkeşlik»',
    'multiple_choice',
    '["1. Deyiliş və yazılışı arasında tərkibindəki qapalı saitin sayı qədər fərq var; 2. Tərkibində birdən çox səsdəyişməsi müşahidə edilir; 3. Eyni səsdən iki dəfə istifadə olunub.", "1. Saitlərdən biri uzun tələffüz olunur; 2. Deyiliş və yazılışı arasında şəkilçilərinin sayı qədər fərq var; 3. Tərkibində cəmi bir qapalı sait iştirak edib.", "1. İlk sözünün son samiti kar qarşılığı kimi tələffüz olunur; 2. Deyiliş və yazılışı arasında ən az iki fərqli məqam var; 3. Sonu kar samitlə bitir.", "1. Cingiltili samitlə başlayıb kar samitlə bitir; 2. Açıq saitlərin sayı qapalılardan çoxdur; 3. [d] samitinin həm özü, həm də qarşılığı işlənib.", "1. Deyiliş və yazılışı arasında bir fərqli məqam var; 2. Sait uzanması müşahidə olunmur; 3. Bütün hecaları samitlə bitir."]'::jsonb,
    '1. Deyiliş və yazılışı arasında tərkibindəki qapalı saitin sayı qədər fərq var; 2. Tərkibində birdən çox səsdəyişməsi müşahidə edilir; 3. Eyni səsdən iki dəfə istifadə olunub.',
    4,
    '2f311c83-ad9f-4050-85cd-e7f1b699d821'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5ceab33d-68a3-40c8-ad39-7b74973d49f3'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sözlərin leksik mənası ilə bağlı uyğunluğu müəyyən edin:
1. talant
2. truppa
3. təkamül
4. tənəzzül
a. inkişaf, dəyişmə, yeniləşmə
b. istedad
c. enmə, geri getmə
d. teatr və ya sirk aktyorları kollektivi, dəstəsi',
    'multiple_choice',
    '["1-b; 2-a; 3-c; 4-d", "1-c; 2-a; 3-d; 4-b", "1-b; 2-d; 3-a; 4-c", "1-c; 2-d; 3-b; 4-a", "1-a; 2-d; 3-b; 4-c"]'::jsonb,
    '1-b; 2-d; 3-a; 4-c',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '217e5423-ce62-413b-ad8f-7ad8aec8c2cf'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Sözlərin leksik mənası ilə bağlı uyğunluğu müəyyən edin:
1. talant
2. truppa
3. təkamül
4. tənəzzül
a. inkişaf, dəyişmə, yeniləşmə
b. istedad
c. enmə, geri getmə
d. teatr və ya sirk aktyorları kollektivi, dəstəsi',
    'multiple_choice',
    '["1-b; 2-a; 3-c; 4-d", "1-c; 2-a; 3-d; 4-b", "1-b; 2-d; 3-a; 4-c", "1-c; 2-d; 3-b; 4-a", "1-a; 2-d; 3-b; 4-c"]'::jsonb,
    '1-b; 2-d; 3-a; 4-c',
    5,
    '5ceab33d-68a3-40c8-ad39-7b74973d49f3'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f2bcebfb-9597-4e31-8f7e-d88b53b67803'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Nümunənin təhlili ilə bağlı doğru fikirləri müəyyən edin:
Həsrət bir ocaq çatıb,
Gecə dözər, gün dözər.
Nə Ay Günəşə çatar,
Nə də gecə gündüzə. (A. Cavad)
(Qeyd: 1-ci misrada «bir» sözü tünd-qara hərflərlə, «çatıb» və «çatar» sözlərinin isə altından xətt çəkilmişdir.)
1. İsmin üç müxtəlif halına aid nümunə işlənsə də, yalnız bir hal şəkilçili söz var.
2. Tünd-qara hərflərlə verilmiş söz («bir») ədatdır.
3. Altından xətt çəkilmiş sözlər («çatıb» və «çatar») bir-biri ilə münasibətdə omonim sayılır.
4. Feillər eyni şəkildə, iki müxtəlif zamandadır.
5. Köməkçi nitq hissələrindən yalnız birinə aid nümunə işlənib.
6. Nitq hissələrindən təkcə əvəzliyə aid nümunə yoxdur.',
    'multiple_choice',
    '["3, 4, 6", "1, 2, 5, 6", "2, 4, 5", "1, 3, 4, 5", "2, 3, 6"]'::jsonb,
    '1, 3, 4, 5',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8937ec2e-117a-4dd0-ac71-e49a216bf011'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Nümunənin təhlili ilə bağlı doğru fikirləri müəyyən edin:
Həsrət bir ocaq çatıb,
Gecə dözər, gün dözər.
Nə Ay Günəşə çatar,
Nə də gecə gündüzə. (A. Cavad)
(Qeyd: 1-ci misrada «bir» sözü tünd-qara hərflərlə, «çatıb» və «çatar» sözlərinin isə altından xətt çəkilmişdir.)
1. İsmin üç müxtəlif halına aid nümunə işlənsə də, yalnız bir hal şəkilçili söz var.
2. Tünd-qara hərflərlə verilmiş söz («bir») ədatdır.
3. Altından xətt çəkilmiş sözlər («çatıb» və «çatar») bir-biri ilə münasibətdə omonim sayılır.
4. Feillər eyni şəkildə, iki müxtəlif zamandadır.
5. Köməkçi nitq hissələrindən yalnız birinə aid nümunə işlənib.
6. Nitq hissələrindən təkcə əvəzliyə aid nümunə yoxdur.',
    'multiple_choice',
    '["3, 4, 6", "1, 2, 5, 6", "2, 4, 5", "1, 3, 4, 5", "2, 3, 6"]'::jsonb,
    '1, 3, 4, 5',
    6,
    'f2bcebfb-9597-4e31-8f7e-d88b53b67803'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a30d0ff4-82d3-49b9-8b62-c23f14412f01'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cədvəlin hər iki xanasında («Sintaktik yolla yaranmış azaltma dərəcəli sifət» | «Sintaktik yolla yaranmış çoxaltma dərəcəli sifət») uyğunluğun pozulduğu bəndi müəyyən edin:',
    'multiple_choice',
    '["qarayanız | ən yaxşı", "kəmsavad | dümdüz", "ala-seyrək | yekəpər", "ala-bəzək | dümqırmızı", "açıq-aydın | daha dəqiq"]'::jsonb,
    'kəmsavad | dümdüz',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c39ceeb6-0b8e-49be-a87d-d1a127adf164'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Cədvəlin hər iki xanasında («Sintaktik yolla yaranmış azaltma dərəcəli sifət» | «Sintaktik yolla yaranmış çoxaltma dərəcəli sifət») uyğunluğun pozulduğu bəndi müəyyən edin:',
    'multiple_choice',
    '["qarayanız | ən yaxşı", "kəmsavad | dümdüz", "ala-seyrək | yekəpər", "ala-bəzək | dümqırmızı", "açıq-aydın | daha dəqiq"]'::jsonb,
    'kəmsavad | dümdüz',
    7,
    'a30d0ff4-82d3-49b9-8b62-c23f14412f01'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8ff8139a-580c-43a8-9215-17754617c422'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Nümunələrdən birində digərlərindən fərqli zərfliyin əlavəsi işlənib:',
    'multiple_choice',
    '["Yanvarın sonu – qışın oğlan çağında, nəhayət, Ziyanurdan xəbər gəldi.", "Qurban kişi darvazadan çölə ilk addımı atar-atmaz, yəni gün ağarmamış evdə söz-söhbət başlardı.", "Turabgilin yeni aldıqları mənzil şəhərin mərkəzində – köhnə univermaq yaxınlığında idi.", "Axı mən sizi bayaq – on-on beş dəqiqə qabaq yola salmadım ki?", "Yazıq qız müəllimi iki saatdan çox, yəni bir imtahan boyu gözləyib."]'::jsonb,
    'Yazıq qız müəllimi iki saatdan çox, yəni bir imtahan boyu gözləyib.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b2c4cb32-35af-4834-b2f9-8042c3b3b281'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Nümunələrdən birində digərlərindən fərqli zərfliyin əlavəsi işlənib:',
    'multiple_choice',
    '["Yanvarın sonu – qışın oğlan çağında, nəhayət, Ziyanurdan xəbər gəldi.", "Qurban kişi darvazadan çölə ilk addımı atar-atmaz, yəni gün ağarmamış evdə söz-söhbət başlardı.", "Turabgilin yeni aldıqları mənzil şəhərin mərkəzində – köhnə univermaq yaxınlığında idi.", "Axı mən sizi bayaq – on-on beş dəqiqə qabaq yola salmadım ki?", "Yazıq qız müəllimi iki saatdan çox, yəni bir imtahan boyu gözləyib."]'::jsonb,
    'Yazıq qız müəllimi iki saatdan çox, yəni bir imtahan boyu gözləyib.',
    8,
    '8ff8139a-580c-43a8-9215-17754617c422'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '015349f4-1255-48b4-bd8e-b4b59f1a1784'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azərbaycan dilinin qrammatikası ilə bağlı fikirlərdən hansı yanlışdır?',
    'multiple_choice',
    '["Sözün yarandığı sözlə kökü eyni qrammatik mənaya malik ola bilər.", "«Mənimsəmə» sözündəki son şəkilçi vurğudan asılı olaraq, sözdüzəldici və ya sözdəyişdirici ola bilər.", "Qeyri-qəti gələcək zamanlı feilin şəkilçisinin samiti heç bir məqamda birinci şəxsin təkində -az/-əz şəklində ola bilməz.", "Leksik şəkilçili sözlər mürəkkəb ola bilər.", "Sözün başlanğıc formasına əsasən leksik mənasını təyin etmək olar."]'::jsonb,
    'Qeyri-qəti gələcək zamanlı feilin şəkilçisinin samiti heç bir məqamda birinci şəxsin təkində -az/-əz şəklində ola bilməz.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7ff905cc-5461-425d-b939-839bdd3a4a2a'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Azərbaycan dilinin qrammatikası ilə bağlı fikirlərdən hansı yanlışdır?',
    'multiple_choice',
    '["Sözün yarandığı sözlə kökü eyni qrammatik mənaya malik ola bilər.", "«Mənimsəmə» sözündəki son şəkilçi vurğudan asılı olaraq, sözdüzəldici və ya sözdəyişdirici ola bilər.", "Qeyri-qəti gələcək zamanlı feilin şəkilçisinin samiti heç bir məqamda birinci şəxsin təkində -az/-əz şəklində ola bilməz.", "Leksik şəkilçili sözlər mürəkkəb ola bilər.", "Sözün başlanğıc formasına əsasən leksik mənasını təyin etmək olar."]'::jsonb,
    'Qeyri-qəti gələcək zamanlı feilin şəkilçisinin samiti heç bir məqamda birinci şəxsin təkində -az/-əz şəklində ola bilməz.',
    9,
    '015349f4-1255-48b4-bd8e-b4b59f1a1784'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '66438d74-4cfd-4e27-8951-3b0fe20f6e20'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş nümunələrdən hansı şəxssiz cümlə deyil?',
    'multiple_choice',
    '["Mənim bu tipli yaltaq adamlardan həmişə zəhləm gedib də.", "Dünən, deyəsən, Hacı Əmirin ad günü idi.", "Hər yeni öyrəndiyim dərsi həmin axşam təkrarlamaq xoşuma gəlir.", "Ogünkü iclasda təxirə salınan məsələyə növbətisində baxılacaq.", "Xəndana artıq acığı tutmurdu."]'::jsonb,
    'Hər yeni öyrəndiyim dərsi həmin axşam təkrarlamaq xoşuma gəlir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '96117150-2265-41ad-a225-61ec64b14300'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Verilmiş nümunələrdən hansı şəxssiz cümlə deyil?',
    'multiple_choice',
    '["Mənim bu tipli yaltaq adamlardan həmişə zəhləm gedib də.", "Dünən, deyəsən, Hacı Əmirin ad günü idi.", "Hər yeni öyrəndiyim dərsi həmin axşam təkrarlamaq xoşuma gəlir.", "Ogünkü iclasda təxirə salınan məsələyə növbətisində baxılacaq.", "Xəndana artıq acığı tutmurdu."]'::jsonb,
    'Hər yeni öyrəndiyim dərsi həmin axşam təkrarlamaq xoşuma gəlir.',
    10,
    '66438d74-4cfd-4e27-8951-3b0fe20f6e20'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cbab65ef-9c79-455d-9400-333da763a4ac'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı nümunələrdəki sayların izah etdiyi isimlərin yazılışında səhvə yol verilib?
1. Budəfəki hücumdan sonra xeyli yaralılarımız var idi.
2. Min illərdən bəri bu torpaqlarda türklər yaşayıblar.
3. Bir sıra uşaqla, digəri isə böyüklərlə tam dolmuşdu.
4. Bu dəfə vitrində bir neçə maniken gözümə dəydi.
5. Ahıl yaşda qocanın yanında iki oğulu qalmışdı.',
    'multiple_choice',
    '["Yalnız 2, 3", "1, 4, 5", "1, 2, 3, 4", "Yalnız 4, 5", "1, 2, 3, 4, 5"]'::jsonb,
    'Yalnız 4, 5',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '710284cf-fc79-4bdb-8b29-b7cc43273711'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Hansı nümunələrdəki sayların izah etdiyi isimlərin yazılışında səhvə yol verilib?
1. Budəfəki hücumdan sonra xeyli yaralılarımız var idi.
2. Min illərdən bəri bu torpaqlarda türklər yaşayıblar.
3. Bir sıra uşaqla, digəri isə böyüklərlə tam dolmuşdu.
4. Bu dəfə vitrində bir neçə maniken gözümə dəydi.
5. Ahıl yaşda qocanın yanında iki oğulu qalmışdı.',
    'multiple_choice',
    '["Yalnız 2, 3", "1, 4, 5", "1, 2, 3, 4", "Yalnız 4, 5", "1, 2, 3, 4, 5"]'::jsonb,
    'Yalnız 4, 5',
    11,
    'cbab65ef-9c79-455d-9400-333da763a4ac'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '244bdc17-6475-442c-9656-5b683153a76a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Əvəzliyin iki müxtəlif məna növünün işləndiyi bəndi müəyyən edin:',
    'multiple_choice',
    '["Bizim sənlə elə ona görə problemimiz olub.", "Bunlara o qədər acıqlanmışam ki.", "Mən ağır işləri o olmadan görə biləcəyimi zənn etmirəm.", "Elə bildim, mənlik şüurunu itiribsən.", "Bunu ona demək lazımdır."]'::jsonb,
    'Bunu ona demək lazımdır.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b8235e18-c776-4d79-b5b3-581c85157026'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Əvəzliyin iki müxtəlif məna növünün işləndiyi bəndi müəyyən edin:',
    'multiple_choice',
    '["Bizim sənlə elə ona görə problemimiz olub.", "Bunlara o qədər acıqlanmışam ki.", "Mən ağır işləri o olmadan görə biləcəyimi zənn etmirəm.", "Elə bildim, mənlik şüurunu itiribsən.", "Bunu ona demək lazımdır."]'::jsonb,
    'Bunu ona demək lazımdır.',
    12,
    '244bdc17-6475-442c-9656-5b683153a76a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '063d2d0f-2f9c-4080-ac75-7af8293fd382'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Mübtəda və xəbəri eyni nitq hissəsi ilə ifadə olunan cümlədir:',
    'multiple_choice',
    '["Hamının üzünə gülmək olmaz.", "Yaralananlar qayıdıblar.", "Mən də sənsizəm.", "Gülbaharın qızı bizim şirkətdə katibədir.", "O biri sıradan dəftər də almışdı."]'::jsonb,
    'Yaralananlar qayıdıblar.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7fb92a1d-d559-4c01-b53b-369caf27681e'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Mübtəda və xəbəri eyni nitq hissəsi ilə ifadə olunan cümlədir:',
    'multiple_choice',
    '["Hamının üzünə gülmək olmaz.", "Yaralananlar qayıdıblar.", "Mən də sənsizəm.", "Gülbaharın qızı bizim şirkətdə katibədir.", "O biri sıradan dəftər də almışdı."]'::jsonb,
    'Yaralananlar qayıdıblar.',
    13,
    '063d2d0f-2f9c-4080-ac75-7af8293fd382'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '138ae569-608d-414a-ab9c-65b560950755'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Əhməd Cavadın «Azərbaycan bayrağına» şeiri ilə bağlı hansı fikir yanlışdır?',
    'multiple_choice',
    '["Bayrağın dalğalanmasının acı həsrətini çəkən lirik qəhrəman obrazı yaradılıb.", "Bayrağın kölgəsinin düşdüyü yer mübarək hesab olunur.", "Vətənə sonsuz məhəbbət əks olunub.", "Dövlət rəmzlərinin mənaları açıqlanmır.", "Şairin türkçülük ideyaları ifadə olunub."]'::jsonb,
    'Bayrağın dalğalanmasının acı həsrətini çəkən lirik qəhrəman obrazı yaradılıb.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ac7de07b-4e64-4a11-bf3d-be555a0a0ab4'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Əhməd Cavadın «Azərbaycan bayrağına» şeiri ilə bağlı hansı fikir yanlışdır?',
    'multiple_choice',
    '["Bayrağın dalğalanmasının acı həsrətini çəkən lirik qəhrəman obrazı yaradılıb.", "Bayrağın kölgəsinin düşdüyü yer mübarək hesab olunur.", "Vətənə sonsuz məhəbbət əks olunub.", "Dövlət rəmzlərinin mənaları açıqlanmır.", "Şairin türkçülük ideyaları ifadə olunub."]'::jsonb,
    'Bayrağın dalğalanmasının acı həsrətini çəkən lirik qəhrəman obrazı yaradılıb.',
    14,
    '138ae569-608d-414a-ab9c-65b560950755'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4fdbed69-b1ea-43a2-8e9d-d135336cdc08'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cəfər Cabbarlının «Ana» şeiri ilə bağlı hansı fikir nöqtələrin yerinə yazıla bilməz?
Lirik qəhrəman ...',
    'multiple_choice',
    '["xaraktercə əyilməz olsa da, ana qarşısında əyilir.", "ana qəlbini övlad odu ilə isitmək istəyir.", "anaya səcdə etməklə fəxr edir.", "ana laylasına olan məhəbbətini ifadə edib.", "ananın ayaqları altına yıxılmağı utanc hesab etmir."]'::jsonb,
    'ana qəlbini övlad odu ilə isitmək istəyir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f60ddc04-bb84-43ce-adc1-7f3a63a38886'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Cəfər Cabbarlının «Ana» şeiri ilə bağlı hansı fikir nöqtələrin yerinə yazıla bilməz?
Lirik qəhrəman ...',
    'multiple_choice',
    '["xaraktercə əyilməz olsa da, ana qarşısında əyilir.", "ana qəlbini övlad odu ilə isitmək istəyir.", "anaya səcdə etməklə fəxr edir.", "ana laylasına olan məhəbbətini ifadə edib.", "ananın ayaqları altına yıxılmağı utanc hesab etmir."]'::jsonb,
    'ana qəlbini övlad odu ilə isitmək istəyir.',
    15,
    '4fdbed69-b1ea-43a2-8e9d-d135336cdc08'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b469492c-2438-436b-8f72-abb8970ac8fa'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hüseyn Cavidin «Ana» pyesindəki Səlma obrazı ilə bağlı hansı fikir doğru deyil?',
    'multiple_choice',
    '["Savadsız, yazı-pozu bilməyən qadındır.", "Qonaqpərvər və humanistdir.", "Vüqarlı, əqidəsinə sadiq bir anadır.", "Oğlunun qatilini cəzalandırır.", "Verdiyi sözün üstündə sonadək qalır."]'::jsonb,
    'Oğlunun qatilini cəzalandırır.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '82d45aa5-fd0f-49ad-89ab-2ce3855b5199'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Hüseyn Cavidin «Ana» pyesindəki Səlma obrazı ilə bağlı hansı fikir doğru deyil?',
    'multiple_choice',
    '["Savadsız, yazı-pozu bilməyən qadındır.", "Qonaqpərvər və humanistdir.", "Vüqarlı, əqidəsinə sadiq bir anadır.", "Oğlunun qatilini cəzalandırır.", "Verdiyi sözün üstündə sonadək qalır."]'::jsonb,
    'Oğlunun qatilini cəzalandırır.',
    16,
    'b469492c-2438-436b-8f72-abb8970ac8fa'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '37bd438a-3163-430a-b4ad-0597ecd5685d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cəlil Məmmədquluzadənin «Qurbanəli bəy» əsəri ilə bağlı yanlış fikri müəyyən edin:',
    'multiple_choice',
    '["Qurbanəli bəy həm Kəblə Qasım, həm də aşpazı Əli ilə kobud rəftar edir.", "Qurbanəli bəyi elə nitqi tanıtdırmaq üçün kifayətdir.", "Qapazlı kəndi bütövlükdə Azərbaycan kəndi timsalında təqdim olunub.", "Xalqın avamlığından istifadə edərək onları soyan fırıldaqçı obrazına yer verilməyib.", "Qurbanəli bəy aid olduğu sinfi ləyaqətlə təmsil edir."]'::jsonb,
    'Qurbanəli bəy aid olduğu sinfi ləyaqətlə təmsil edir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '388939ab-9257-41ce-89cc-2a07707688f1'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Cəlil Məmmədquluzadənin «Qurbanəli bəy» əsəri ilə bağlı yanlış fikri müəyyən edin:',
    'multiple_choice',
    '["Qurbanəli bəy həm Kəblə Qasım, həm də aşpazı Əli ilə kobud rəftar edir.", "Qurbanəli bəyi elə nitqi tanıtdırmaq üçün kifayətdir.", "Qapazlı kəndi bütövlükdə Azərbaycan kəndi timsalında təqdim olunub.", "Xalqın avamlığından istifadə edərək onları soyan fırıldaqçı obrazına yer verilməyib.", "Qurbanəli bəy aid olduğu sinfi ləyaqətlə təmsil edir."]'::jsonb,
    'Qurbanəli bəy aid olduğu sinfi ləyaqətlə təmsil edir.',
    17,
    '37bd438a-3163-430a-b4ad-0597ecd5685d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cf90dbc1-38c0-4c50-adeb-42f8894d6323'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '«Koroğlu ilə Bolu bəy» və «Durna teli» («Koroğlu» dastanı) qolları ilə bağlı ortaq fikri müəyyən edin:',
    'multiple_choice',
    '["Koroğlu düşmənləri Çənlibeldə qarşılayır.", "Hadisələr Bağdadda cərəyan edir.", "Xoca Əziz Çənlibelə vacib xəbər çatdırır.", "Koroğlu Muradbəyli tərəfdən bir tacir olduğunu deyərək özünü gizlədir.", "Koroğlu düşmən əlinə keçməsin deyə özünü ilxıçı kimi təqdim edir."]'::jsonb,
    'Xoca Əziz Çənlibelə vacib xəbər çatdırır.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '346b1d7f-3a05-4c2a-a192-a7afabab9e0b'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    '«Koroğlu ilə Bolu bəy» və «Durna teli» («Koroğlu» dastanı) qolları ilə bağlı ortaq fikri müəyyən edin:',
    'multiple_choice',
    '["Koroğlu düşmənləri Çənlibeldə qarşılayır.", "Hadisələr Bağdadda cərəyan edir.", "Xoca Əziz Çənlibelə vacib xəbər çatdırır.", "Koroğlu Muradbəyli tərəfdən bir tacir olduğunu deyərək özünü gizlədir.", "Koroğlu düşmən əlinə keçməsin deyə özünü ilxıçı kimi təqdim edir."]'::jsonb,
    'Xoca Əziz Çənlibelə vacib xəbər çatdırır.',
    18,
    'cf90dbc1-38c0-4c50-adeb-42f8894d6323'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b1502aa5-23cc-4e3e-a644-55f241793bb2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Mirzə İbrahimovun «Azad» əsəri ilə bağlı doğru fikri müəyyən edin:',
    'multiple_choice',
    '["Azad nə qədər təmkinli olsa da, mübarizdir.", "Fərdanın dükandakı söhbətinə Azad olduqca həyəcanlı şəkildə reaksiya verir.", "Maddi durumu Fərdanın təhsilini yarımçıq qoymasına gətirib çıxarır.", "Azadın ölüm xəbərini sonda silahdaşları birgə anasına çatdırırlar.", "Azad bir müddət kənddə yaşamalı olur."]'::jsonb,
    'Azad nə qədər təmkinli olsa da, mübarizdir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ebd5f1b5-14e4-4bfe-b7f4-2718bd247d2c'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Mirzə İbrahimovun «Azad» əsəri ilə bağlı doğru fikri müəyyən edin:',
    'multiple_choice',
    '["Azad nə qədər təmkinli olsa da, mübarizdir.", "Fərdanın dükandakı söhbətinə Azad olduqca həyəcanlı şəkildə reaksiya verir.", "Maddi durumu Fərdanın təhsilini yarımçıq qoymasına gətirib çıxarır.", "Azadın ölüm xəbərini sonda silahdaşları birgə anasına çatdırırlar.", "Azad bir müddət kənddə yaşamalı olur."]'::jsonb,
    'Azad nə qədər təmkinli olsa da, mübarizdir.',
    19,
    'b1502aa5-23cc-4e3e-a644-55f241793bb2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '342c23ed-dc28-4d01-9973-4d1405e62da0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Məhəmməd Füzulinin «Söz» qəzəlindən verilmiş misralarda hansı fikir ifadə olunub?
Gər çox istərsən, Füzuli, izzətin, az et sözü,
Kim, çox olmaqdan qılıbdır çox əzizi xar söz.',
    'multiple_choice',
    '["Söz nə dəyərdə olsa, sahibi də o dəyərdə olar.", "Söz insanı qəflətdən oyada bilər.", "Yoxdan var olan sözlər sirli bir dünya yaradır.", "Hörmətdən düşməmək üçün az danışmaq lazımdır.", "Mərifət dənizinin üzgüçüləri arif olanlardır."]'::jsonb,
    'Hörmətdən düşməmək üçün az danışmaq lazımdır.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a938bb77-38cf-45c5-981f-8dee68cb7bb1'::uuid,
    '92eb6532-eafa-42ec-ac4b-f3234bd11c2f'::uuid,
    'Məhəmməd Füzulinin «Söz» qəzəlindən verilmiş misralarda hansı fikir ifadə olunub?
Gər çox istərsən, Füzuli, izzətin, az et sözü,
Kim, çox olmaqdan qılıbdır çox əzizi xar söz.',
    'multiple_choice',
    '["Söz nə dəyərdə olsa, sahibi də o dəyərdə olar.", "Söz insanı qəflətdən oyada bilər.", "Yoxdan var olan sözlər sirli bir dünya yaradır.", "Hörmətdən düşməmək üçün az danışmaq lazımdır.", "Mərifət dənizinin üzgüçüləri arif olanlardır."]'::jsonb,
    'Hörmətdən düşməmək üçün az danışmaq lazımdır.',
    20,
    '342c23ed-dc28-4d01-9973-4d1405e62da0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Riyaziyyat (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Riyaziyyat - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Riyaziyyat (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Riyaziyyat fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Riyaziyyat',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '663947',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'da9d9bae-1af0-4e69-810d-2acd2f7b3df6'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'ABC düzbucaqlı üçbucağında (∠BAC = 90°) A təpəsindən çəkilmiş A mərkəzli qövs BC hipotenuzuna D nöqtəsində toxunur və AC katetini kəsir. BD = 2 sm, DC = 8 sm olarsa, üçbucağın daxilində qövsdən kənarda qalan rəngli hissənin sahəsini tapın.',
    'multiple_choice',
    '["24 - 8π", "20 - 8π", "20 - 4π", "20 - 6π", "12 - 4π"]'::jsonb,
    '20 - 4π',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q01.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bdb442d1-4443-407f-b9be-223a03c62ffc'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'ABC düzbucaqlı üçbucağında (∠BAC = 90°) A təpəsindən çəkilmiş A mərkəzli qövs BC hipotenuzuna D nöqtəsində toxunur və AC katetini kəsir. BD = 2 sm, DC = 8 sm olarsa, üçbucağın daxilində qövsdən kənarda qalan rəngli hissənin sahəsini tapın.',
    'multiple_choice',
    '["24 - 8π", "20 - 8π", "20 - 4π", "20 - 6π", "12 - 4π"]'::jsonb,
    '20 - 4π',
    1,
    'da9d9bae-1af0-4e69-810d-2acd2f7b3df6'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q01.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '966b9687-2f51-42f3-a046-b5fd064a2476'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '1 < x < 2 olarsa, √(x² - x - 1 + √(x² - 4x + 4) · (x + 1)) = 2 tənliyindən x-i tapın.',
    'multiple_choice',
    '["√5 / 2", "√5 - 1", "√2", "√3", "√3 / 2 + 1"]'::jsonb,
    '√3',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a31602ec-ec60-4454-8e8a-6f380f6a701d'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '1 < x < 2 olarsa, √(x² - x - 1 + √(x² - 4x + 4) · (x + 1)) = 2 tənliyindən x-i tapın.',
    'multiple_choice',
    '["√5 / 2", "√5 - 1", "√2", "√3", "√3 / 2 + 1"]'::jsonb,
    '√3',
    2,
    '966b9687-2f51-42f3-a046-b5fd064a2476'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7a121841-2227-46ce-ae99-66de42177b97'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bir işi Saleh x/2 günə, Osman isə 2x/3 günə bitirə bilir. Eyni işin 2/3 hissəsini ikisi birlikdə 4 günə bitirirlərsə, x neçədir?',
    'multiple_choice',
    '["12", "14", "15", "16", "21"]'::jsonb,
    '21',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'afc2cf88-537f-458b-b8e9-a5ea43378474'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'Bir işi Saleh x/2 günə, Osman isə 2x/3 günə bitirə bilir. Eyni işin 2/3 hissəsini ikisi birlikdə 4 günə bitirirlərsə, x neçədir?',
    'multiple_choice',
    '["12", "14", "15", "16", "21"]'::jsonb,
    '21',
    3,
    '7a121841-2227-46ce-ae99-66de42177b97'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'fcb5565c-405e-4ac2-91fd-e1599ab3cd99'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'ABCD düzbucaqlı trapesiyasının (AD ⊥ DC, AB ⊥ AD) daxilinə mərkəzi AD oturacağı üzərində olan O mərkəzli yarımçevrə çəkilmişdir (yarımçevrə BC yan tərəfinə K nöqtəsində toxunur). DC = 4,5 sm, AO = OD = r = 3 sm olarsa, BK parçasının uzunluğunu tapın.',
    'multiple_choice',
    '["5", "4", "3", "2", "1"]'::jsonb,
    '2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q04.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b2fee0f7-45a9-4693-a5de-df8c6c0bf8e8'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'ABCD düzbucaqlı trapesiyasının (AD ⊥ DC, AB ⊥ AD) daxilinə mərkəzi AD oturacağı üzərində olan O mərkəzli yarımçevrə çəkilmişdir (yarımçevrə BC yan tərəfinə K nöqtəsində toxunur). DC = 4,5 sm, AO = OD = r = 3 sm olarsa, BK parçasının uzunluğunu tapın.',
    'multiple_choice',
    '["5", "4", "3", "2", "1"]'::jsonb,
    '2',
    4,
    'fcb5565c-405e-4ac2-91fd-e1599ab3cd99'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q04.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'c3717094-b5d5-4bc5-8ace-c401902af0f1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'a, b, c, d bir-birindən fərqli natural ədədləri üçün |1/a + 1/b + 1/c + 1/d - 1| ifadəsinin ala biləcəyi ən kiçik qiyməti tapın.',
    'multiple_choice',
    '["0", "1", "2", "10", "1/2"]'::jsonb,
    '0',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '89d70347-0939-402d-a846-d9d5204896fa'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'a, b, c, d bir-birindən fərqli natural ədədləri üçün |1/a + 1/b + 1/c + 1/d - 1| ifadəsinin ala biləcəyi ən kiçik qiyməti tapın.',
    'multiple_choice',
    '["0", "1", "2", "10", "1/2"]'::jsonb,
    '0',
    5,
    'c3717094-b5d5-4bc5-8ace-c401902af0f1'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'c4027974-073e-4f03-9036-82a027c4e9f6'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '1/(1·2·3) + 1/(2·3·4) + 1/(3·4·5) + ... + 1/(100·101·102) cəmini tapın.',
    'multiple_choice',
    '["2575 / 5151", "1", "5152 / 7575", "1,75", "5151 / 5150"]'::jsonb,
    '2575 / 5151',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c28d75de-cf28-41a9-a3b1-600cde2bba5a'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '1/(1·2·3) + 1/(2·3·4) + 1/(3·4·5) + ... + 1/(100·101·102) cəmini tapın.',
    'multiple_choice',
    '["2575 / 5151", "1", "5152 / 7575", "1,75", "5151 / 5150"]'::jsonb,
    '2575 / 5151',
    6,
    'c4027974-073e-4f03-9036-82a027c4e9f6'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '109fb57f-661e-4545-8361-114de1d3ce9b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'n² + n + 109 ifadəsi hər hansı natural ədədin kvadratıdır (n ∈ N). Belə n-lərin sayını tapın.',
    'multiple_choice',
    '["3", "4", "2", "5", "10"]'::jsonb,
    '4',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'dd58d11b-9ddf-4509-80c6-94b4d0d90a96'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'n² + n + 109 ifadəsi hər hansı natural ədədin kvadratıdır (n ∈ N). Belə n-lərin sayını tapın.',
    'multiple_choice',
    '["3", "4", "2", "5", "10"]'::jsonb,
    '4',
    7,
    '109fb57f-661e-4545-8361-114de1d3ce9b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '71bd921d-4285-4c55-a084-09722ee2d10f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '√(1000 · 1001 · 1002 · 1003 + 1) ədədinin 9-a bölünməsindən alınan qalığı tapın.',
    'multiple_choice',
    '["0", "3", "5", "7", "8"]'::jsonb,
    '5',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4ff3c98a-5ce9-41b8-be66-817fdd9b56ee'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '√(1000 · 1001 · 1002 · 1003 + 1) ədədinin 9-a bölünməsindən alınan qalığı tapın.',
    'multiple_choice',
    '["0", "3", "5", "7", "8"]'::jsonb,
    '5',
    8,
    '71bd921d-4285-4c55-a084-09722ee2d10f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '403d240a-1baf-4ce2-bf89-d5470bcba27b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'S = ((1·3·9 + 2·6·18 + 3·9·27 + ... + 10·30·90) / (1·2·4 + 2·4·8 + 3·6·12 + ... + 10·20·40))^(1/3) ifadəsini hesablayın.',
    'multiple_choice',
    '["3/2", "1/2", "2", "1", "1/3"]'::jsonb,
    '3/2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '73aa5716-719a-42d7-aef2-8fea8fa5a91d'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'S = ((1·3·9 + 2·6·18 + 3·9·27 + ... + 10·30·90) / (1·2·4 + 2·4·8 + 3·6·12 + ... + 10·20·40))^(1/3) ifadəsini hesablayın.',
    'multiple_choice',
    '["3/2", "1/2", "2", "1", "1/3"]'::jsonb,
    '3/2',
    9,
    '403d240a-1baf-4ce2-bf89-d5470bcba27b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd48ea9cc-d36c-4635-8bb1-79cebfb3d923'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '(b + 2c + a)/(2bc) + (a + 2c - b)/(2ac) = (a + b - 2c)/(ab) olarsa, (a² + b² + c²) / (10c² + 4ab) ifadəsinin qiymətini tapın.',
    'multiple_choice',
    '["1", "1/2", "1/5", "1/4", "1/3"]'::jsonb,
    '1/2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '3ddb47a6-e6d8-41eb-8cdf-0825672cc8fe'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '(b + 2c + a)/(2bc) + (a + 2c - b)/(2ac) = (a + b - 2c)/(ab) olarsa, (a² + b² + c²) / (10c² + 4ab) ifadəsinin qiymətini tapın.',
    'multiple_choice',
    '["1", "1/2", "1/5", "1/4", "1/3"]'::jsonb,
    '1/2',
    10,
    'd48ea9cc-d36c-4635-8bb1-79cebfb3d923'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'c07820fd-7d41-41f5-8b39-f7df3e1e36f2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '|15x² - 32x - 28| ifadəsinin sadə ədəd olması üçün neçə sayda x tam ədədi var?',
    'multiple_choice',
    '["0", "1", "2", "3", "4"]'::jsonb,
    '2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '14507f9d-43b2-47f1-b769-6aa8568afbad'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '|15x² - 32x - 28| ifadəsinin sadə ədəd olması üçün neçə sayda x tam ədədi var?',
    'multiple_choice',
    '["0", "1", "2", "3", "4"]'::jsonb,
    '2',
    11,
    'c07820fd-7d41-41f5-8b39-f7df3e1e36f2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '929de580-ef95-43b5-b08c-e6af6dc81ea1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '∛(6√3 + 10) - ∛(6√3 - 10) = a olarsa, a³ / (10 - 3a) kəsrinin qiymətini tapın.',
    'multiple_choice',
    '["1", "0", "2", "3", "4"]'::jsonb,
    '2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b1c51d92-6e0b-455a-b246-5011e91effa4'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '∛(6√3 + 10) - ∛(6√3 - 10) = a olarsa, a³ / (10 - 3a) kəsrinin qiymətini tapın.',
    'multiple_choice',
    '["1", "0", "2", "3", "4"]'::jsonb,
    '2',
    12,
    '929de580-ef95-43b5-b08c-e6af6dc81ea1'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '397bf3be-9a33-47bc-a00e-ceaa96b69a0c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sahəsi 72 sm² olan ABC üçbucağı verilmişdir. G nöqtəsi üçbucağın ağırlıq mərkəzi (medianların kəsişmə nöqtəsi), E və D uyğun olaraq yan tərəflərin orta nöqtələri, DF || AC olarsa, rəngli DFG üçbucağının sahəsini (sm² ilə) tapın.',
    'multiple_choice',
    '["8", "12", "9", "6", "3"]'::jsonb,
    '3',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q13.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4e0a2540-b697-491f-bc9b-bf650b71deb1'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'Sahəsi 72 sm² olan ABC üçbucağı verilmişdir. G nöqtəsi üçbucağın ağırlıq mərkəzi (medianların kəsişmə nöqtəsi), E və D uyğun olaraq yan tərəflərin orta nöqtələri, DF || AC olarsa, rəngli DFG üçbucağının sahəsini (sm² ilə) tapın.',
    'multiple_choice',
    '["8", "12", "9", "6", "3"]'::jsonb,
    '3',
    13,
    '397bf3be-9a33-47bc-a00e-ceaa96b69a0c'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q13.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '142f7cc1-8da7-4ab8-9cc7-062ef9c4533a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'a² + b² + c² + 4a - 6b + 14 çoxhədlisinin ən kiçik qiymətini tapın.',
    'multiple_choice',
    '["1", "2", "3", "0", "-1"]'::jsonb,
    '1',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0980d1c9-42e9-4334-b531-68b07b3a51e1'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'a² + b² + c² + 4a - 6b + 14 çoxhədlisinin ən kiçik qiymətini tapın.',
    'multiple_choice',
    '["1", "2", "3", "0", "-1"]'::jsonb,
    '1',
    14,
    '142f7cc1-8da7-4ab8-9cc7-062ef9c4533a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7f37fc11-3e8f-4400-94b2-834f4fceb2c0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '(3n + 11 + 13)/11 ; (3n + 12 + 14)/12 ; ... ; (3n + 55 + 57)/55 kəsrlərinin hər birinin ixtisar olunmayan kəsr olması üçün n-in ala biləcəyi ən kiçik natural ədədi tapın.',
    'multiple_choice',
    '["23", "17", "19", "57", "59"]'::jsonb,
    '19',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'aba66020-573c-44a2-ba4a-90530e30931e'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '(3n + 11 + 13)/11 ; (3n + 12 + 14)/12 ; ... ; (3n + 55 + 57)/55 kəsrlərinin hər birinin ixtisar olunmayan kəsr olması üçün n-in ala biləcəyi ən kiçik natural ədədi tapın.',
    'multiple_choice',
    '["23", "17", "19", "57", "59"]'::jsonb,
    '19',
    15,
    '7f37fc11-3e8f-4400-94b2-834f4fceb2c0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e71fee03-939e-4af8-962b-5e8abc4a5ad5'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'ABCD kvadratında M nöqtəsi BC üzərində, N nöqtəsi CD üzərindədir. AK ⊥ MN (K ∈ MN), AK = 6, NK = 4 və ∠BAK = ∠DAK olarsa, DN parçasının uzunluğunu tapın.',
    'multiple_choice',
    '["4", "3√2", "3", "2√2", "√2"]'::jsonb,
    '√2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q16.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2462db8b-26ca-46f8-9a26-b57c6bf5d9ee'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'ABCD kvadratında M nöqtəsi BC üzərində, N nöqtəsi CD üzərindədir. AK ⊥ MN (K ∈ MN), AK = 6, NK = 4 və ∠BAK = ∠DAK olarsa, DN parçasının uzunluğunu tapın.',
    'multiple_choice',
    '["4", "3√2", "3", "2√2", "√2"]'::jsonb,
    '√2',
    16,
    'e71fee03-939e-4af8-962b-5e8abc4a5ad5'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q16.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'eea671f1-d94f-4d8f-82ab-72c2db734918'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'ABCD kvadratında E nöqtəsi BA düz xəttinin A tərəfdən uzantısı üzərindədir (E-A-B düz xətti). ∠EDA = α, ∠DEF = β (burada EC parçası AD-ni F nöqtəsində kəsir), AE = 5√2, AB = 5 olarsa, α + β cəmini tapın.',
    'multiple_choice',
    '["77,5°", "67,5°", "62,5°", "60°", "45°"]'::jsonb,
    '67,5°',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q17.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '52a9dea0-d9b4-4644-af98-24750e2d85d3'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'ABCD kvadratında E nöqtəsi BA düz xəttinin A tərəfdən uzantısı üzərindədir (E-A-B düz xətti). ∠EDA = α, ∠DEF = β (burada EC parçası AD-ni F nöqtəsində kəsir), AE = 5√2, AB = 5 olarsa, α + β cəmini tapın.',
    'multiple_choice',
    '["77,5°", "67,5°", "62,5°", "60°", "45°"]'::jsonb,
    '67,5°',
    17,
    'eea671f1-d94f-4d8f-82ab-72c2db734918'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_math_q17.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '44acacb8-8247-4259-a897-02a56dcbb963'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '√(11p + 169) ədədinin tam ədəd olması üçün p sadə ədədinin ala biləcəyi ən böyük qiyməti tapın.',
    'multiple_choice',
    '["37", "31", "29", "19", "41"]'::jsonb,
    '37',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2c220cbe-c917-45b0-b915-3194b94c5512'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    '√(11p + 169) ədədinin tam ədəd olması üçün p sadə ədədinin ala biləcəyi ən böyük qiyməti tapın.',
    'multiple_choice',
    '["37", "31", "29", "19", "41"]'::jsonb,
    '37',
    18,
    '44acacb8-8247-4259-a897-02a56dcbb963'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0fd9f4fa-de23-4757-8562-2bc71f737be4'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'K = 2²⁰¹⁵ + 3²⁰¹⁵ + ... + 2000²⁰¹⁵ + 2001²⁰¹⁵ ədədinin 77-yə bölünməsindən alınan qalığı tapın.',
    'multiple_choice',
    '["4", "76", "12", "65", "0"]'::jsonb,
    '76',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ec13799b-18d6-47b5-a976-83c60ddcef08'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'K = 2²⁰¹⁵ + 3²⁰¹⁵ + ... + 2000²⁰¹⁵ + 2001²⁰¹⁵ ədədinin 77-yə bölünməsindən alınan qalığı tapın.',
    'multiple_choice',
    '["4", "76", "12", "65", "0"]'::jsonb,
    '76',
    19,
    '0fd9f4fa-de23-4757-8562-2bc71f737be4'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e3bf4c19-291e-4192-8b16-967807fd280e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'x < y < z sadə ədədləri üçün x + y + z = 68 və xy + yz + zx = 1121 olduğu məlumdursa, z ədədini tapın.',
    'multiple_choice',
    '["23", "43", "53", "37", "47"]'::jsonb,
    '43',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2a72e2c4-a859-461e-9ef2-a0d9b8005b27'::uuid,
    '4829380c-0d43-4cb9-afef-01ddc4bd9350'::uuid,
    'x < y < z sadə ədədləri üçün x + y + z = 68 və xy + yz + zx = 1121 olduğu məlumdursa, z ədədini tapın.',
    'multiple_choice',
    '["23", "43", "53", "37", "47"]'::jsonb,
    '43',
    20,
    'e3bf4c19-291e-4192-8b16-967807fd280e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Fizika (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Fizika - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Fizika (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Fizika fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Fizika',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '117954',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '19788bcd-7d90-4012-a03e-97d017569e7a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Avtomobil yolun ilk 1/3 hissəsini 20 km/saat, ikinci 1/3 hissəsini 30 km/saat sürətlə hərəkət etdi. Avtomobil yolun üçüncü 1/3 hissəsini hansı sürətlə hərəkət etməlidir ki, onun bütün yolda orta sürəti 20 km/saat olsun?',
    'multiple_choice',
    '["15 km/saat", "12 km/saat", "18 km/saat", "16 km/saat", "10 km/saat"]'::jsonb,
    '15 km/saat',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '30e18d8c-5987-43db-80cf-c74bb0faab6a'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Avtomobil yolun ilk 1/3 hissəsini 20 km/saat, ikinci 1/3 hissəsini 30 km/saat sürətlə hərəkət etdi. Avtomobil yolun üçüncü 1/3 hissəsini hansı sürətlə hərəkət etməlidir ki, onun bütün yolda orta sürəti 20 km/saat olsun?',
    'multiple_choice',
    '["15 km/saat", "12 km/saat", "18 km/saat", "16 km/saat", "10 km/saat"]'::jsonb,
    '15 km/saat',
    1,
    '19788bcd-7d90-4012-a03e-97d017569e7a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7f72604b-c06f-4eda-9096-32bb416119d8'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Dövrədən keçən cərəyan şiddəti zamandan asılı olaraq I = (2t + 3) A qanunu ilə dəyişir. İlk 4 saniyə ərzində naqilin en kəsiyindən keçən elektrik yükünü hesablayın.',
    'multiple_choice',
    '["16 Kl", "20 Kl", "24 Kl", "28 Kl", "32 Kl"]'::jsonb,
    '28 Kl',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f2d3dfa4-2527-49ff-8549-d9d202ab0199'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Dövrədən keçən cərəyan şiddəti zamandan asılı olaraq I = (2t + 3) A qanunu ilə dəyişir. İlk 4 saniyə ərzində naqilin en kəsiyindən keçən elektrik yükünü hesablayın.',
    'multiple_choice',
    '["16 Kl", "20 Kl", "24 Kl", "28 Kl", "32 Kl"]'::jsonb,
    '28 Kl',
    2,
    '7f72604b-c06f-4eda-9096-32bb416119d8'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'dd7f9b1d-2052-44a7-964b-b460f4f040a5'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Su ilə doldurulmuş hidravlik presin sağ qoluna sürtünməsiz hərəkət edə bilən, sahəsi S = 100 sm², kütləsi m = 2 kq olan porşen qoyulmuşdur (sol qol açıqdır). Porşenin üzərinə kütləsi M = 10 kq olan yük qoyulur və sistem tarazlığa gəlir. Tarazlıq vəziyyətində qolların maye səviyyələri arasındakı h hündürlük fərqini hesablayın (ρ_su = 1000 kq/m³, g = 10 m/san²).',
    'multiple_choice',
    '["50 sm", "120 sm", "100 sm", "60 sm", "180 sm"]'::jsonb,
    '120 sm',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q03.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b077ef57-31bc-448b-9a4a-00b9b5605415'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Su ilə doldurulmuş hidravlik presin sağ qoluna sürtünməsiz hərəkət edə bilən, sahəsi S = 100 sm², kütləsi m = 2 kq olan porşen qoyulmuşdur (sol qol açıqdır). Porşenin üzərinə kütləsi M = 10 kq olan yük qoyulur və sistem tarazlığa gəlir. Tarazlıq vəziyyətində qolların maye səviyyələri arasındakı h hündürlük fərqini hesablayın (ρ_su = 1000 kq/m³, g = 10 m/san²).',
    'multiple_choice',
    '["50 sm", "120 sm", "100 sm", "60 sm", "180 sm"]'::jsonb,
    '120 sm',
    3,
    'dd7f9b1d-2052-44a7-964b-b460f4f040a5'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q03.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2a9c0aab-9fb9-45e3-9490-26f1350c01b2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sərtlik əmsalı k = 50 N/m olan yayın bir ucu sıxlığı ρ_m = 1200 kq/m³ olan maye ilə doldurulmuş qabın dibinə bərkidilmiş, digər ucu isə materialının sıxlığı ρ_c = 400 kq/m³ olan bircins kürəyə bağlanmışdır (kürə tamamilə mayenin daxilindədir). Tarazlıq vəziyyətində yayın uzanma miqdarı Δx = 10 sm olarsa, kürənin m kütləsini hesablayın (g = 10 m/san²).',
    'multiple_choice',
    '["100 q", "150 q", "200 q", "250 q", "300 q"]'::jsonb,
    '250 q',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7973f8d2-e142-4e54-9ce6-e1ca1b6243da'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Sərtlik əmsalı k = 50 N/m olan yayın bir ucu sıxlığı ρ_m = 1200 kq/m³ olan maye ilə doldurulmuş qabın dibinə bərkidilmiş, digər ucu isə materialının sıxlığı ρ_c = 400 kq/m³ olan bircins kürəyə bağlanmışdır (kürə tamamilə mayenin daxilindədir). Tarazlıq vəziyyətində yayın uzanma miqdarı Δx = 10 sm olarsa, kürənin m kütləsini hesablayın (g = 10 m/san²).',
    'multiple_choice',
    '["100 q", "150 q", "200 q", "250 q", "300 q"]'::jsonb,
    '250 q',
    4,
    '2a9c0aab-9fb9-45e3-9490-26f1350c01b2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2065cf94-56a3-4096-b63e-77987f57ddb2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sükunət vəziyyətindən düzxətli bərabərtəcilli hərəkətə başlayan cismin 2-ci saniyədə getdiyi yol 1-ci saniyədə getdiyi yoldan 1 m çox olmuşdur. Cismin təcilini hesablayın.',
    'multiple_choice',
    '["0,5 m/san²", "1 m/san²", "1,5 m/san²", "2 m/san²", "3 m/san²"]'::jsonb,
    '1 m/san²',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c985aa6c-0a72-4677-86e7-3877b946f30c'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Sükunət vəziyyətindən düzxətli bərabərtəcilli hərəkətə başlayan cismin 2-ci saniyədə getdiyi yol 1-ci saniyədə getdiyi yoldan 1 m çox olmuşdur. Cismin təcilini hesablayın.',
    'multiple_choice',
    '["0,5 m/san²", "1 m/san²", "1,5 m/san²", "2 m/san²", "3 m/san²"]'::jsonb,
    '1 m/san²',
    5,
    '2065cf94-56a3-4096-b63e-77987f57ddb2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '311eb1ea-e0d5-42a4-92d3-963d233a59ae'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'm = 4 kq kütləli, 6 bərabər bölgüdən ibarət bircins çubuq sol ucundan 2 bölgü məsafədə yerləşən dayağın üzərinə üfüqi qoyulmuş və sol ucundan sərtliyi k = 200 N/m olan yayla yerə bərkidilmişdir. Sistem tarazlıqdadırsa, yayın uzanmasını hesablayın (g = 10 m/san²).',
    'multiple_choice',
    '["5 sm", "10 sm", "12,5 sm", "20 sm", "4 sm"]'::jsonb,
    '10 sm',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q06.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f356d697-b157-46d8-95e7-3aa4ae2c1963'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'm = 4 kq kütləli, 6 bərabər bölgüdən ibarət bircins çubuq sol ucundan 2 bölgü məsafədə yerləşən dayağın üzərinə üfüqi qoyulmuş və sol ucundan sərtliyi k = 200 N/m olan yayla yerə bərkidilmişdir. Sistem tarazlıqdadırsa, yayın uzanmasını hesablayın (g = 10 m/san²).',
    'multiple_choice',
    '["5 sm", "10 sm", "12,5 sm", "20 sm", "4 sm"]'::jsonb,
    '10 sm',
    6,
    '311eb1ea-e0d5-42a4-92d3-963d233a59ae'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q06.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7ea438fc-eb0e-40af-8d9f-14d325e301f7'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Daşı hansı H hündürlüyündən sərbəst buraxmaq lazımdır ki, o, yolun axırıncı 25 m məsafəsini 1 saniyəyə düşsün (g = 10 m/san², hava müqaviməti nəzərə alınmır)?',
    'multiple_choice',
    '["60 m", "80 m", "45 m", "90 m", "75 m"]'::jsonb,
    '45 m',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '746f78d5-8f7d-4342-ac91-949428750fa3'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Daşı hansı H hündürlüyündən sərbəst buraxmaq lazımdır ki, o, yolun axırıncı 25 m məsafəsini 1 saniyəyə düşsün (g = 10 m/san², hava müqaviməti nəzərə alınmır)?',
    'multiple_choice',
    '["60 m", "80 m", "45 m", "90 m", "75 m"]'::jsonb,
    '45 m',
    7,
    '7ea438fc-eb0e-40af-8d9f-14d325e301f7'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5a274751-a065-432f-bffb-bc7b6fedd400'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Üfüqi səth üzərində bir-birinə çəkisiz sapla bağlanmış m₁ = 2 kq və m₂ = 3 kq kütləli tirciklər yerləşir. Tirciklərlə səth arasındakı sürtünmə əmsalı μ = 0,2-dir. m₂ kütləli tirciyə üfüqi istiqamətdə F = 15 N dartı qüvvəsi tətbiq olunarsa, tircikləri birləşdirən sapın T gərilmə qüvvəsi nəyə bərabərdir?',
    'multiple_choice',
    '["8 N", "6 N", "4 N", "10 N", "12 N"]'::jsonb,
    '6 N',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q08.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a017b095-b247-4c68-bd26-7fd175b681d1'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Üfüqi səth üzərində bir-birinə çəkisiz sapla bağlanmış m₁ = 2 kq və m₂ = 3 kq kütləli tirciklər yerləşir. Tirciklərlə səth arasındakı sürtünmə əmsalı μ = 0,2-dir. m₂ kütləli tirciyə üfüqi istiqamətdə F = 15 N dartı qüvvəsi tətbiq olunarsa, tircikləri birləşdirən sapın T gərilmə qüvvəsi nəyə bərabərdir?',
    'multiple_choice',
    '["8 N", "6 N", "4 N", "10 N", "12 N"]'::jsonb,
    '6 N',
    8,
    '5a274751-a065-432f-bffb-bc7b6fedd400'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q08.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a28771a5-6ae3-4c1b-bbfb-80448be2a334'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sıxlıqları ρ₁ = 600 kq/m³ və ρ₂ = 1000 kq/m³ olan, bir-birinə qarışmayan iki mayenin sərhədində üzən bütöv cismin həcminin 25%-i böyük sıxlıqlı mayenin daxilindədirsə, cismin sıxlığını hesablayın.',
    'multiple_choice',
    '["650 kq/m³", "680 kq/m³", "620 kq/m³", "720 kq/m³", "700 kq/m³"]'::jsonb,
    '700 kq/m³',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5de22881-9b84-4dc7-a1e1-cb9891e09e2e'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Sıxlıqları ρ₁ = 600 kq/m³ və ρ₂ = 1000 kq/m³ olan, bir-birinə qarışmayan iki mayenin sərhədində üzən bütöv cismin həcminin 25%-i böyük sıxlıqlı mayenin daxilindədirsə, cismin sıxlığını hesablayın.',
    'multiple_choice',
    '["650 kq/m³", "680 kq/m³", "620 kq/m³", "720 kq/m³", "700 kq/m³"]'::jsonb,
    '700 kq/m³',
    9,
    'a28771a5-6ae3-4c1b-bbfb-80448be2a334'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a4b439ab-1fb4-4e6a-96c8-057b34699e7a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Silindrşəkilli çəndəki eyni həcmli, bir-birinə qarışmayan iki cür mayenin ümumi hündürlüyü 6 m-dir. Mayelərdən birinin sıxlığı o birindən 2 dəfə çoxdur. Sərbəst səthdən h₁ = 4 m dərinlikdəki hidrostatik təzyiqin h₂ = 5 m dərinlikdəki hidrostatik təzyiqə nisbəti (p₁ / p₂) nəyə bərabərdir?',
    'multiple_choice',
    '["5/7", "2/3", "9/11", "3/4", "5/6"]'::jsonb,
    '5/7',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q10.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fe2d69ff-28b1-4a99-9830-9f682c1e8ea6'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Silindrşəkilli çəndəki eyni həcmli, bir-birinə qarışmayan iki cür mayenin ümumi hündürlüyü 6 m-dir. Mayelərdən birinin sıxlığı o birindən 2 dəfə çoxdur. Sərbəst səthdən h₁ = 4 m dərinlikdəki hidrostatik təzyiqin h₂ = 5 m dərinlikdəki hidrostatik təzyiqə nisbəti (p₁ / p₂) nəyə bərabərdir?',
    'multiple_choice',
    '["5/7", "2/3", "9/11", "3/4", "5/6"]'::jsonb,
    '5/7',
    10,
    'a4b439ab-1fb4-4e6a-96c8-057b34699e7a'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q10.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '62caedb9-07c4-453f-86f1-cb011e244c0b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '64 ədəd eyni kiçik civə damlasının hər biri φ₀ = 20 V potensialına qədər yüklənmişdir. Bu damlaların birləşməsindən əmələ gələn böyük kürəvi damlanın potensialı nəyə bərabər olacaq?',
    'multiple_choice',
    '["480 V", "160 V", "20 V", "320 V", "80 V"]'::jsonb,
    '320 V',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a5cfab10-dbb5-46dc-aa2a-cabd56d68d70'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    '64 ədəd eyni kiçik civə damlasının hər biri φ₀ = 20 V potensialına qədər yüklənmişdir. Bu damlaların birləşməsindən əmələ gələn böyük kürəvi damlanın potensialı nəyə bərabər olacaq?',
    'multiple_choice',
    '["480 V", "160 V", "20 V", "320 V", "80 V"]'::jsonb,
    '320 V',
    11,
    '62caedb9-07c4-453f-86f1-cb011e244c0b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2e9fdbcd-e71b-4c8e-81d2-1d21d0c935ca'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Suda şaquli vəziyyətdə üzən nazikdivarlı silindrik borunun sudan kənarda qalan hissəsinin uzunluğu l = 40 sm-dir. Boru su ilə qarışmayan, sıxlığı ρ = 800 kq/m³ olan maye ilə tam doludur (borunun öz kütləsi nəzərə alınmır). Borunun ümumi uzunluğu nə qədərdir (ρ_su = 1000 kq/m³)?',
    'multiple_choice',
    '["150 sm", "140 sm", "300 sm", "200 sm", "110 sm"]'::jsonb,
    '200 sm',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '850b129b-6681-48bc-8c20-8d554f91a3cc'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Suda şaquli vəziyyətdə üzən nazikdivarlı silindrik borunun sudan kənarda qalan hissəsinin uzunluğu l = 40 sm-dir. Boru su ilə qarışmayan, sıxlığı ρ = 800 kq/m³ olan maye ilə tam doludur (borunun öz kütləsi nəzərə alınmır). Borunun ümumi uzunluğu nə qədərdir (ρ_su = 1000 kq/m³)?',
    'multiple_choice',
    '["150 sm", "140 sm", "300 sm", "200 sm", "110 sm"]'::jsonb,
    '200 sm',
    12,
    '2e9fdbcd-e71b-4c8e-81d2-1d21d0c935ca'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '40544389-7535-4439-a913-5780fcf67b79'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Eyni işarəli, ədədi qiymətcə q₁ = 6·10⁻¹⁰ Kl və q₂ = 4·10⁻¹⁰ Kl yükə malik olan iki eyniölçülü metal kürə müəyyən məsafədə bir-birinə 96 N qüvvə ilə təsir göstərir. Kürələri bir-birinə toxundurub əvvəlki məsafəyə qaytarsalar, onlar arasındakı qarşılıqlı təsir qüvvəsi neçə N olar?',
    'multiple_choice',
    '["90 N", "80 N", "100 N", "84 N", "112 N"]'::jsonb,
    '100 N',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c1a592dd-4b07-4063-898c-984a5d5a7784'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Eyni işarəli, ədədi qiymətcə q₁ = 6·10⁻¹⁰ Kl və q₂ = 4·10⁻¹⁰ Kl yükə malik olan iki eyniölçülü metal kürə müəyyən məsafədə bir-birinə 96 N qüvvə ilə təsir göstərir. Kürələri bir-birinə toxundurub əvvəlki məsafəyə qaytarsalar, onlar arasındakı qarşılıqlı təsir qüvvəsi neçə N olar?',
    'multiple_choice',
    '["90 N", "80 N", "100 N", "84 N", "112 N"]'::jsonb,
    '100 N',
    13,
    '40544389-7535-4439-a913-5780fcf67b79'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9dc8f1af-11db-40d5-9f45-fedc0778f197'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İki müxtəlif materialdan hazırlanmış silindrşəkilli naqillərin elektrik müqavimətləri və kütlələri bir-birinə bərabərdir (R₁ = R₂, m₁ = m₂). I naqilin materialının xüsusi müqaviməti ρ₁ = 6ρ₀, sıxlığı d₁ = 2d₀; II naqilin materialının xüsusi müqaviməti ρ₂ = 3ρ₀, sıxlığı d₂ = 4d₀-dır. Naqillərin uzunluqlarının l₂ / l₁ nisbəti nəyə bərabərdir?',
    'multiple_choice',
    '["4", "1,5", "2", "0,5", "1"]'::jsonb,
    '1',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a4c7f0cf-2387-49c0-ad47-76017d7a9ee5'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'İki müxtəlif materialdan hazırlanmış silindrşəkilli naqillərin elektrik müqavimətləri və kütlələri bir-birinə bərabərdir (R₁ = R₂, m₁ = m₂). I naqilin materialının xüsusi müqaviməti ρ₁ = 6ρ₀, sıxlığı d₁ = 2d₀; II naqilin materialının xüsusi müqaviməti ρ₂ = 3ρ₀, sıxlığı d₂ = 4d₀-dır. Naqillərin uzunluqlarının l₂ / l₁ nisbəti nəyə bərabərdir?',
    'multiple_choice',
    '["4", "1,5", "2", "0,5", "1"]'::jsonb,
    '1',
    14,
    '9dc8f1af-11db-40d5-9f45-fedc0778f197'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9225bcaf-8335-49bb-ad62-3e16631fd3d1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Avtomobil düz yolda v = 15 m/san sürətlə hərəkət edərkən sürüşmədən fırlanan təkərləri saniyədə 5 dövr edirsə, təkərlərin diametri nəyə bərabərdir (π = 3 götürün)?',
    'multiple_choice',
    '["1,5 m", "0,75 m", "1 m", "2 m", "0,5 m"]'::jsonb,
    '1 m',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b59f0528-0773-4ff0-872b-c8ba02d7b862'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Avtomobil düz yolda v = 15 m/san sürətlə hərəkət edərkən sürüşmədən fırlanan təkərləri saniyədə 5 dövr edirsə, təkərlərin diametri nəyə bərabərdir (π = 3 götürün)?',
    'multiple_choice',
    '["1,5 m", "0,75 m", "1 m", "2 m", "0,5 m"]'::jsonb,
    '1 m',
    15,
    '9225bcaf-8335-49bb-ad62-3e16631fd3d1'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4e4d5686-654e-4f09-831e-869722b64465'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Üfüqi müstəvinin üzərindəki cismə üfüqi istiqamətdə yönəlmiş dartı qüvvəsi təsir göstərir. Cismin səthlə sürüşmə sürtünmə qüvvəsi sabitdir. Dartı qüvvəsinin ədədi qiyməti 6 N olduqda cismin təcili 0,3 m/san², dartı qüvvəsinin ədədi qiyməti 8 N olduqda isə cismin təcili 0,5 m/san² olmuşdur. Cismə təsir göstərən sürtünmə qüvvəsinin qiymətini tapın.',
    'multiple_choice',
    '["4 N", "2 N", "3 N", "2,5 N", "3,5 N"]'::jsonb,
    '3 N',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '23fb361b-c65f-4acf-9414-b1f4e145d4bb'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Üfüqi müstəvinin üzərindəki cismə üfüqi istiqamətdə yönəlmiş dartı qüvvəsi təsir göstərir. Cismin səthlə sürüşmə sürtünmə qüvvəsi sabitdir. Dartı qüvvəsinin ədədi qiyməti 6 N olduqda cismin təcili 0,3 m/san², dartı qüvvəsinin ədədi qiyməti 8 N olduqda isə cismin təcili 0,5 m/san² olmuşdur. Cismə təsir göstərən sürtünmə qüvvəsinin qiymətini tapın.',
    'multiple_choice',
    '["4 N", "2 N", "3 N", "2,5 N", "3,5 N"]'::jsonb,
    '3 N',
    16,
    '4e4d5686-654e-4f09-831e-869722b64465'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '00b6916a-ddcf-42f3-b220-2eca1fd19b9c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kütləsi M = 6 kq, uzunluğu L olan bircins çubuğu sol ucundan 0,2L məsafədə yerləşən dayağın üzərində üfüqi tarazlıqda saxlamaq üçün onun sol ucundan hansı kütləli yük asmaq lazımdır?',
    'multiple_choice',
    '["9 kq", "6 kq", "7,5 kq", "10 kq", "12 kq"]'::jsonb,
    '9 kq',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8b9cd7e9-13c1-4b22-a626-3153e0ac5209'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Kütləsi M = 6 kq, uzunluğu L olan bircins çubuğu sol ucundan 0,2L məsafədə yerləşən dayağın üzərində üfüqi tarazlıqda saxlamaq üçün onun sol ucundan hansı kütləli yük asmaq lazımdır?',
    'multiple_choice',
    '["9 kq", "6 kq", "7,5 kq", "10 kq", "12 kq"]'::jsonb,
    '9 kq',
    17,
    '00b6916a-ddcf-42f3-b220-2eca1fd19b9c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '35c45f34-2c6f-4790-80e1-256509954b8f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kütləsi m = 2 kq olan tircik sürtünmə əmsalı μ = 0,5 olan üfüqi masanın üzərində sükunət halındadır. Onu sərtliyi k = 100 N/m olan çəkisiz yayla üfüqi istiqamətdə tədricən dartırlar. Tirciyi yerindən tərpədənə kimi dartı qüvvəsi minimum nə qədər iş görər (g = 10 m/san²)?',
    'multiple_choice',
    '["0,25 C", "1 C", "2 C", "1,5 C", "0,5 C"]'::jsonb,
    '0,5 C',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q18.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'edefbed5-bf36-42eb-9ce7-6929d02ee1c1'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Kütləsi m = 2 kq olan tircik sürtünmə əmsalı μ = 0,5 olan üfüqi masanın üzərində sükunət halındadır. Onu sərtliyi k = 100 N/m olan çəkisiz yayla üfüqi istiqamətdə tədricən dartırlar. Tirciyi yerindən tərpədənə kimi dartı qüvvəsi minimum nə qədər iş görər (g = 10 m/san²)?',
    'multiple_choice',
    '["0,25 C", "1 C", "2 C", "1,5 C", "0,5 C"]'::jsonb,
    '0,5 C',
    18,
    '35c45f34-2c6f-4790-80e1-256509954b8f'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q18.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '11eed394-21bb-426f-8499-2c3daa0b55bc'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'En kəsiklərinin sahələri S₁ = 9S₂ olan iki silindrik qab dibdən nazik boru ilə birləşdirilmiş və bir-birindən kranla ayrılmışdır. Qablarda eyni cins maye var. Kran bağlı olduqda qabların dibindəki hidrostatik təzyiqlər p₁ = 2,0 kPa və p₂ = 6,0 kPa idi. Kran açılıb mayelərin səviyyələri bərabərləşəndən sonra qabların dibindəki hidrostatik təzyiqi tapın.',
    'multiple_choice',
    '["2,75 kPa", "4,5 kPa", "3,25 kPa", "3,0 kPa", "2,4 kPa"]'::jsonb,
    '2,4 kPa',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q19.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fc190383-372d-40ba-92d9-b8e9709d7dec'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'En kəsiklərinin sahələri S₁ = 9S₂ olan iki silindrik qab dibdən nazik boru ilə birləşdirilmiş və bir-birindən kranla ayrılmışdır. Qablarda eyni cins maye var. Kran bağlı olduqda qabların dibindəki hidrostatik təzyiqlər p₁ = 2,0 kPa və p₂ = 6,0 kPa idi. Kran açılıb mayelərin səviyyələri bərabərləşəndən sonra qabların dibindəki hidrostatik təzyiqi tapın.',
    'multiple_choice',
    '["2,75 kPa", "4,5 kPa", "3,25 kPa", "3,0 kPa", "2,4 kPa"]'::jsonb,
    '2,4 kPa',
    19,
    '11eed394-21bb-426f-8499-2c3daa0b55bc'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_fiz_q19.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '65a20709-090e-4b05-9e6a-09f492a7b6e1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Üfüqi səthin üzərindəki m = 1 ton kütləli cismin sürəti, üfüqi istiqamətdə yönəlmiş sabit F = 1 kN dartı qüvvəsinin təsiri ilə t = 20 san müddətində v₁ = 10 m/san-dən v₂ = 20 m/san-yə kimi artırılmışdır. Cisimlə səth arasındakı sürtünmə əmsalını tapın (g = 10 m/san²).',
    'multiple_choice',
    '["0,01", "0,02", "0,03", "0,04", "0,05"]'::jsonb,
    '0,05',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '79ff2106-c084-4fa1-a706-de66244781fc'::uuid,
    'a625247c-3a35-4758-a81e-76784744c3f9'::uuid,
    'Üfüqi səthin üzərindəki m = 1 ton kütləli cismin sürəti, üfüqi istiqamətdə yönəlmiş sabit F = 1 kN dartı qüvvəsinin təsiri ilə t = 20 san müddətində v₁ = 10 m/san-dən v₂ = 20 m/san-yə kimi artırılmışdır. Cisimlə səth arasındakı sürtünmə əmsalını tapın (g = 10 m/san²).',
    'multiple_choice',
    '["0,01", "0,02", "0,03", "0,04", "0,05"]'::jsonb,
    '0,05',
    20,
    '65a20709-090e-4b05-9e6a-09f492a7b6e1'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Kimya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Kimya - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kimya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Kimya fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Kimya',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '166886',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '82ed2401-fd00-4846-bd00-b0d37015f925'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sabit həcmli qab adi şəraitdə (20°C, 1 atm) karbon qazı (CO₂) ilə dolu olduqda kütləsi 300 qram, oksigen qazı (O₂) ilə dolu olduqda isə 294 qram olur. Qabdakı karbon qazı və oksigen qazının kütləsini (qramla) hesablayın. Ar(C) = 12, Ar(O) = 16.',
    'multiple_choice',
    '["16 q CO₂ və 22 q O₂", "32 q CO₂ və 44 q O₂", "22 q CO₂ və 16 q O₂", "44 q CO₂ və 32 q O₂", "11 q CO₂ və 8 q O₂"]'::jsonb,
    '22 q CO₂ və 16 q O₂',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0a256fc1-a15d-4291-88dd-7e29a3e33a2d'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Sabit həcmli qab adi şəraitdə (20°C, 1 atm) karbon qazı (CO₂) ilə dolu olduqda kütləsi 300 qram, oksigen qazı (O₂) ilə dolu olduqda isə 294 qram olur. Qabdakı karbon qazı və oksigen qazının kütləsini (qramla) hesablayın. Ar(C) = 12, Ar(O) = 16.',
    'multiple_choice',
    '["16 q CO₂ və 22 q O₂", "32 q CO₂ və 44 q O₂", "22 q CO₂ və 16 q O₂", "44 q CO₂ və 32 q O₂", "11 q CO₂ və 8 q O₂"]'::jsonb,
    '22 q CO₂ və 16 q O₂',
    1,
    '82ed2401-fd00-4846-bd00-b0d37015f925'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd7af93d7-2179-4ff4-a77f-04687d0a3fb9'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində kütləcə 53,33% karbon, 15,56% hidrogen və qalanı azot olan üzvi birləşmənin molyar kütləsinin 90 q/mol olduğu müəyyən edilmişdir. Birləşmənin molekulyar formulunu müəyyən edin. Ar(C)=12, Ar(H)=1, Ar(N)=14.',
    'multiple_choice',
    '["C₄H₁₄N₄", "C₂H₇N", "C₃H₁₂N₂", "C₂H₁₄N₂", "C₄H₁₄N₂"]'::jsonb,
    'C₄H₁₄N₂',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2a16a4fc-6900-4de4-9cfb-eb6961263386'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Tərkibində kütləcə 53,33% karbon, 15,56% hidrogen və qalanı azot olan üzvi birləşmənin molyar kütləsinin 90 q/mol olduğu müəyyən edilmişdir. Birləşmənin molekulyar formulunu müəyyən edin. Ar(C)=12, Ar(H)=1, Ar(N)=14.',
    'multiple_choice',
    '["C₄H₁₄N₄", "C₂H₇N", "C₃H₁₂N₂", "C₂H₁₄N₂", "C₄H₁₄N₂"]'::jsonb,
    'C₄H₁₄N₂',
    2,
    'd7af93d7-2179-4ff4-a77f-04687d0a3fb9'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'fc76ede8-fc69-4320-9411-acf794458418'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '24 qram etan (C₂H₆) qazının natamam yanmasından əldə edilən CO və CO₂ qazlarının mol nisbəti 1:3-dür. Bu reaksiyadan alınan su buxarının kütləsi nə qədər olar? Ar(C)=12, Ar(H)=1, Ar(O)=16.',
    'multiple_choice',
    '["42,3 qram", "43,2 qram", "54,3 qram", "61,8 qram", "34,6 qram"]'::jsonb,
    '43,2 qram',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '3e7f41b2-73fd-4b56-9d33-bf0871f172c6'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    '24 qram etan (C₂H₆) qazının natamam yanmasından əldə edilən CO və CO₂ qazlarının mol nisbəti 1:3-dür. Bu reaksiyadan alınan su buxarının kütləsi nə qədər olar? Ar(C)=12, Ar(H)=1, Ar(O)=16.',
    'multiple_choice',
    '["42,3 qram", "43,2 qram", "54,3 qram", "61,8 qram", "34,6 qram"]'::jsonb,
    '43,2 qram',
    3,
    'fc76ede8-fc69-4320-9411-acf794458418'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'fe549046-3756-4ecf-9e8b-7a4739b75107'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '2Y + X → Z birmərhələli (elementar) qaz fazalı reaksiyası üçün aşağıda verilən mülahizələrdən hansı(-lar) doğrudur?
I. Reaksiyanın sürət tənliyi v = k·[Y]²·[X] şəklindədir.
II. Katalizator istifadə etdikdə sürət sabiti (k) dəyişər.
III. Sabit temperaturda X-in qatılığını 2 dəfə artırdıqda reaksiyanın sürət sabiti 2 dəfə artar.',
    'multiple_choice',
    '["I və II", "I və III", "II və III", "I, II və III", "Yalnız I"]'::jsonb,
    'I və II',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e609f492-1128-44b7-b698-08dcf6dff22d'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    '2Y + X → Z birmərhələli (elementar) qaz fazalı reaksiyası üçün aşağıda verilən mülahizələrdən hansı(-lar) doğrudur?
I. Reaksiyanın sürət tənliyi v = k·[Y]²·[X] şəklindədir.
II. Katalizator istifadə etdikdə sürət sabiti (k) dəyişər.
III. Sabit temperaturda X-in qatılığını 2 dəfə artırdıqda reaksiyanın sürət sabiti 2 dəfə artar.',
    'multiple_choice',
    '["I və II", "I və III", "II və III", "I, II və III", "Yalnız I"]'::jsonb,
    'I və II',
    4,
    'fe549046-3756-4ecf-9e8b-7a4739b75107'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '87062c9c-281a-4997-aa25-a88d19c7b74a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Ağzı bağlı qabda olan 8 mol ozonun (O₃) bir hissəsi oksigenə (O₂) çevrilir: 2O₃ → 3O₂. Müəyyən vaxtdan sonra alınan qaz qarışığının heliuma (Mr=4) görə nisbi sıxlığı 9,6 olarsa, son halda qabda cəmi neçə mol qaz olar? Ar(O)=16.',
    'multiple_choice',
    '["8", "9,6", "3,2", "10", "12"]'::jsonb,
    '10',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4d6527eb-d791-47a1-ac31-b90b18cfed86'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Ağzı bağlı qabda olan 8 mol ozonun (O₃) bir hissəsi oksigenə (O₂) çevrilir: 2O₃ → 3O₂. Müəyyən vaxtdan sonra alınan qaz qarışığının heliuma (Mr=4) görə nisbi sıxlığı 9,6 olarsa, son halda qabda cəmi neçə mol qaz olar? Ar(O)=16.',
    'multiple_choice',
    '["8", "9,6", "3,2", "10", "12"]'::jsonb,
    '10',
    5,
    '87062c9c-281a-4997-aa25-a88d19c7b74a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '846099d2-1b46-4fb2-a153-c49cc5f7d787'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş oksidləşmə-reduksiya reaksiyalarını əmsallaşdırın və hər iki tənlikdəki bütün əmsalların ümumi cəmini hesablayın:
1) Cu₂S + HNO₃ → Cu(NO₃)₂ + H₂SO₄ + NO₂ + H₂O
2) Fe₃O₄ + HNO₃ → Fe(NO₃)₃ + NH₄NO₃ + H₂O',
    'multiple_choice',
    '["88", "90", "89", "74", "35"]'::jsonb,
    '89',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a660e4ec-228e-4beb-8eb3-51a4d65a515b'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Verilmiş oksidləşmə-reduksiya reaksiyalarını əmsallaşdırın və hər iki tənlikdəki bütün əmsalların ümumi cəmini hesablayın:
1) Cu₂S + HNO₃ → Cu(NO₃)₂ + H₂SO₄ + NO₂ + H₂O
2) Fe₃O₄ + HNO₃ → Fe(NO₃)₃ + NH₄NO₃ + H₂O',
    'multiple_choice',
    '["88", "90", "89", "74", "35"]'::jsonb,
    '89',
    6,
    '846099d2-1b46-4fb2-a153-c49cc5f7d787'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9143d318-0a61-4198-b17b-566402711e2d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Elementin elektron quruluşu haqqındakı məlumatlardan istifadə edərək onun əmələ gətirə biləcəyi ionlardan hansının davamlı olacağını müəyyən etmək mümkündür. Aşağıdakı ionlardan hansı elektron konfiqurasiyasına görə daha davamsızdır?',
    'multiple_choice',
    '["Mg²⁺", "Cl⁻", "Pb²⁺", "Zn²⁺", "Rb⁺"]'::jsonb,
    'Zn²⁺',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0b78897b-b54f-4bde-8421-341e9e9cfe91'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Elementin elektron quruluşu haqqındakı məlumatlardan istifadə edərək onun əmələ gətirə biləcəyi ionlardan hansının davamlı olacağını müəyyən etmək mümkündür. Aşağıdakı ionlardan hansı elektron konfiqurasiyasına görə daha davamsızdır?',
    'multiple_choice',
    '["Mg²⁺", "Cl⁻", "Pb²⁺", "Zn²⁺", "Rb⁺"]'::jsonb,
    'Zn²⁺',
    7,
    '9143d318-0a61-4198-b17b-566402711e2d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '68922a5b-05fb-47e0-835a-bb444fd8ed77'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'C₆H₆ + Br₂ → C₆H₅Br + HBr reaksiyası üzrə 30,0 qram benzol (C₆H₆) və 65,0 qram brom (Br₂) qarşılıqlı təsirdə olduqda 32,0 qram brombenzol (C₆H₅Br) alınırsa, reaksiyanın praktiki çıxımını (%-lə, tam ədədə yuvarlaqlaşdıraraq) hesablayın. Ar(C)=12, Ar(Br)=80, Ar(H)=1.',
    'multiple_choice',
    '["47", "50", "32", "38", "64"]'::jsonb,
    '50',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'cc19107c-70af-4388-a2ec-f17cdc89c3a3'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'C₆H₆ + Br₂ → C₆H₅Br + HBr reaksiyası üzrə 30,0 qram benzol (C₆H₆) və 65,0 qram brom (Br₂) qarşılıqlı təsirdə olduqda 32,0 qram brombenzol (C₆H₅Br) alınırsa, reaksiyanın praktiki çıxımını (%-lə, tam ədədə yuvarlaqlaşdıraraq) hesablayın. Ar(C)=12, Ar(Br)=80, Ar(H)=1.',
    'multiple_choice',
    '["47", "50", "32", "38", "64"]'::jsonb,
    '50',
    8,
    '68922a5b-05fb-47e0-835a-bb444fd8ed77'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '763c015b-d393-48fb-8f66-e10a38be80f2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Fərz edək ki, bir stəkan (200 qram) sudakı bütün su molekullarını nişanlamışıq və həmin suyu bərabər səviyyədə dünya okeanına qarışdırmışıq. Müəyyən vaxtdan sonra istənilən yerdən yenidən bir stəkan (200 qram) su götürsək, həmin stəkanda əvvəlki nişanlanmış sudan təqribən neçə molekul olar? (Yer üzərindəki suyun stəkanlarla ümumi miqdarı 7·10²¹ stəkandır, Mr(H₂O)=18, N_A=6,02·10²³).',
    'multiple_choice',
    '["9,557", "6,02·10²³", "955,7", "0,035·10²¹", "28,57·10²¹"]'::jsonb,
    '955,7',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'badd4866-4cb0-439e-ab61-1169782a2c9c'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Fərz edək ki, bir stəkan (200 qram) sudakı bütün su molekullarını nişanlamışıq və həmin suyu bərabər səviyyədə dünya okeanına qarışdırmışıq. Müəyyən vaxtdan sonra istənilən yerdən yenidən bir stəkan (200 qram) su götürsək, həmin stəkanda əvvəlki nişanlanmış sudan təqribən neçə molekul olar? (Yer üzərindəki suyun stəkanlarla ümumi miqdarı 7·10²¹ stəkandır, Mr(H₂O)=18, N_A=6,02·10²³).',
    'multiple_choice',
    '["9,557", "6,02·10²³", "955,7", "0,035·10²¹", "28,57·10²¹"]'::jsonb,
    '955,7',
    9,
    '763c015b-d393-48fb-8f66-e10a38be80f2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9a65ea8d-5f5c-4827-885c-c86dbbd27b58'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıdakı duzlardan hansının suda məhlulu hidroliz nəticəsində fenolftaleini moruğu (çəhrayı) rəngə boyayır?',
    'multiple_choice',
    '["NH₄Cl", "BaSO₄", "Cr₃(PO₄)₂", "KCl", "Na₂CO₃"]'::jsonb,
    'Na₂CO₃',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8e7a4d72-9566-414c-bb13-853d1c35b131'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Aşağıdakı duzlardan hansının suda məhlulu hidroliz nəticəsində fenolftaleini moruğu (çəhrayı) rəngə boyayır?',
    'multiple_choice',
    '["NH₄Cl", "BaSO₄", "Cr₃(PO₄)₂", "KCl", "Na₂CO₃"]'::jsonb,
    'Na₂CO₃',
    10,
    '9a65ea8d-5f5c-4827-885c-c86dbbd27b58'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'c1510be5-bef9-4b0a-a26c-3c930497d361'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cədvəldə verilən təcrübələrdən hansılarda xlorid turşusu (HCl) və natrium-hidroksid (NaOH) məhlullarının qarışdırılması zamanı reaksiyanın nəticəsi və əmələ gələn mühit doğru göstərilmişdir?
I təcrübə: HCl (pH=1, 50 ml) + NaOH (pH=12, 50 ml) → Tam neytrallaşma (neytral mühit)
II təcrübə: HCl (pH=3, 100 ml) + NaOH (pH=11, 120 ml) → Turşunun qismən neytrallaşması (turş mühit)
III təcrübə: HCl (pH=2, 30 ml) + NaOH (pH=12, 30 ml) → Əsasın qismən neytrallaşması (əsasi mühit)
IV təcrübə: HCl (pH=1, 200 ml) + NaOH (pH=13, 100 ml) → Turşunun qismən neytrallaşması (turş mühit)',
    'multiple_choice',
    '["Yalnız II", "Yalnız IV", "I və III", "I, II və IV", "Heç biri"]'::jsonb,
    'Yalnız IV',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e2a42f7d-a9af-4208-968e-4e31d0d5e079'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Cədvəldə verilən təcrübələrdən hansılarda xlorid turşusu (HCl) və natrium-hidroksid (NaOH) məhlullarının qarışdırılması zamanı reaksiyanın nəticəsi və əmələ gələn mühit doğru göstərilmişdir?
I təcrübə: HCl (pH=1, 50 ml) + NaOH (pH=12, 50 ml) → Tam neytrallaşma (neytral mühit)
II təcrübə: HCl (pH=3, 100 ml) + NaOH (pH=11, 120 ml) → Turşunun qismən neytrallaşması (turş mühit)
III təcrübə: HCl (pH=2, 30 ml) + NaOH (pH=12, 30 ml) → Əsasın qismən neytrallaşması (əsasi mühit)
IV təcrübə: HCl (pH=1, 200 ml) + NaOH (pH=13, 100 ml) → Turşunun qismən neytrallaşması (turş mühit)',
    'multiple_choice',
    '["Yalnız II", "Yalnız IV", "I və III", "I, II və IV", "Heç biri"]'::jsonb,
    'Yalnız IV',
    11,
    'c1510be5-bef9-4b0a-a26c-3c930497d361'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '923487e4-1a63-43ed-95ab-ab4dff197154'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Misin təbiətdə yayılan iki ən mühüm izotopunun — ⁶³Cu və ⁶⁵Cu izotoplarının nisbi atom kütlələri müvafiq olaraq 62,9298 və 64,9278-dir. Misin orta nisbi atom kütləsinin 63,5460 olduğuna görə ⁶³Cu izotopunun təbiətdə yayılma faizini (%-lə) hesablayın.',
    'multiple_choice',
    '["31,8", "38,2", "43,9", "45,2", "69,2"]'::jsonb,
    '69,2',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '592dc6d7-7fe1-4980-9450-4b8cc408cbf1'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Misin təbiətdə yayılan iki ən mühüm izotopunun — ⁶³Cu və ⁶⁵Cu izotoplarının nisbi atom kütlələri müvafiq olaraq 62,9298 və 64,9278-dir. Misin orta nisbi atom kütləsinin 63,5460 olduğuna görə ⁶³Cu izotopunun təbiətdə yayılma faizini (%-lə) hesablayın.',
    'multiple_choice',
    '["31,8", "38,2", "43,9", "45,2", "69,2"]'::jsonb,
    '69,2',
    12,
    '923487e4-1a63-43ed-95ab-ab4dff197154'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0bce8d95-c63b-4e54-bb85-c1ebf01eea4f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Elektron düzülüşləri 1s² 2s² 2p⁶ şəklində (izoelektron) olan X²⁻, Y³⁺, Z⁰ və T²⁺ hissəciklərinin ion/atom radiusları arasındakı münasibət hansı bənddə doğru verilmişdir?',
    'multiple_choice',
    '["X²⁻ > Y³⁺ > Z > T²⁺", "Y³⁺ > T²⁺ > Z > X²⁻", "X²⁻ > Z > Y³⁺ > T²⁺", "X²⁻ > Z > T²⁺ > Y³⁺", "Z = X²⁻ = T²⁺ = Y³⁺"]'::jsonb,
    'X²⁻ > Z > T²⁺ > Y³⁺',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '326e46de-0ab2-43f5-b1c4-f77211ceb6b9'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Elektron düzülüşləri 1s² 2s² 2p⁶ şəklində (izoelektron) olan X²⁻, Y³⁺, Z⁰ və T²⁺ hissəciklərinin ion/atom radiusları arasındakı münasibət hansı bənddə doğru verilmişdir?',
    'multiple_choice',
    '["X²⁻ > Y³⁺ > Z > T²⁺", "Y³⁺ > T²⁺ > Z > X²⁻", "X²⁻ > Z > Y³⁺ > T²⁺", "X²⁻ > Z > T²⁺ > Y³⁺", "Z = X²⁻ = T²⁺ = Y³⁺"]'::jsonb,
    'X²⁻ > Z > T²⁺ > Y³⁺',
    13,
    '0bce8d95-c63b-4e54-bb85-c1ebf01eea4f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '476c7682-d116-4784-ab0f-f42e3efc7695'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Canlı orqanizmlərin qalıqlarının yaşını təyin etmək üçün ¹⁴C radioaktiv izotopundan istifadə olunur. Karbon-14 izotopunun yarımparçalanma dövrü 5730 ildir. Başlanğıcda götürülmüş 10 qram ¹⁴C izotopunun 57300 il sonra parçalanmadan qalan kütləsi neçə qramdır?',
    'multiple_choice',
    '["0,0098", "0,039", "0,0195", "0,625", "0,0049"]'::jsonb,
    '0,0098',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '283b6770-76c9-4e25-8200-bd949a3eecff'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Canlı orqanizmlərin qalıqlarının yaşını təyin etmək üçün ¹⁴C radioaktiv izotopundan istifadə olunur. Karbon-14 izotopunun yarımparçalanma dövrü 5730 ildir. Başlanğıcda götürülmüş 10 qram ¹⁴C izotopunun 57300 il sonra parçalanmadan qalan kütləsi neçə qramdır?',
    'multiple_choice',
    '["0,0098", "0,039", "0,0195", "0,625", "0,0049"]'::jsonb,
    '0,0098',
    14,
    '476c7682-d116-4784-ab0f-f42e3efc7695'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f69f2837-2371-4403-ad40-127ecca0ae90'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'X və Y elementlərindən XY₄ birləşməsi əmələ gəlir. Bu elementlər reaksiyaya girdikdə 1,00 q X ilə 5,07 q Y birləşir. X elementi oksigen ilə XO₂ birləşməsi əmələ gətirir və 1,00 q X elementi 1,14 q oksigen birləşdirir (Ar(O)=16). Buna görə Y elementinin nisbi atom kütləsini hesablayın.',
    'multiple_choice',
    '["35,5", "14,2", "81,1", "44,4", "79,9"]'::jsonb,
    '35,5',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'cbddca13-0777-4ce2-877b-9a6258db2c92'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'X və Y elementlərindən XY₄ birləşməsi əmələ gəlir. Bu elementlər reaksiyaya girdikdə 1,00 q X ilə 5,07 q Y birləşir. X elementi oksigen ilə XO₂ birləşməsi əmələ gətirir və 1,00 q X elementi 1,14 q oksigen birləşdirir (Ar(O)=16). Buna görə Y elementinin nisbi atom kütləsini hesablayın.',
    'multiple_choice',
    '["35,5", "14,2", "81,1", "44,4", "79,9"]'::jsonb,
    '35,5',
    15,
    'f69f2837-2371-4403-ad40-127ecca0ae90'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '171d2f3a-36de-44ec-b083-04fb58d4979b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '₂₉Cu¹⁺ ionunun qısa elektron konfiqurasiyası hansı variantda doğru verilmişdir?',
    'multiple_choice',
    '["...3d¹⁰ 4s¹", "...3d⁸ 4s²", "...3d⁹ 4s¹", "...3d⁹", "...3d¹⁰"]'::jsonb,
    '...3d¹⁰',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '3848036e-01d4-46bb-a3e3-d25394316a28'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    '₂₉Cu¹⁺ ionunun qısa elektron konfiqurasiyası hansı variantda doğru verilmişdir?',
    'multiple_choice',
    '["...3d¹⁰ 4s¹", "...3d⁸ 4s²", "...3d⁹ 4s¹", "...3d⁹", "...3d¹⁰"]'::jsonb,
    '...3d¹⁰',
    16,
    '171d2f3a-36de-44ec-b083-04fb58d4979b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e8019e97-7dff-4b7c-857a-d3d19259e5f2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Ölçüləri 2 sm × 3 sm × 5 sm olan təmiz alüminium lövhəciyin kifayət miqdarda HCl məhlulu ilə tam reaksiyasından neçə mol H₂ qazı ayrılar? (ρ_Al = 2,7 q/sm³, Ar(Al) = 27).',
    'multiple_choice',
    '["7,5", "3,5", "6", "9", "4,5"]'::jsonb,
    '4,5',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a10934c9-3034-4ba7-a18d-3716b0e17ea6'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Ölçüləri 2 sm × 3 sm × 5 sm olan təmiz alüminium lövhəciyin kifayət miqdarda HCl məhlulu ilə tam reaksiyasından neçə mol H₂ qazı ayrılar? (ρ_Al = 2,7 q/sm³, Ar(Al) = 27).',
    'multiple_choice',
    '["7,5", "3,5", "6", "9", "4,5"]'::jsonb,
    '4,5',
    17,
    'e8019e97-7dff-4b7c-857a-d3d19259e5f2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '95d3bcf7-7740-433d-b3e3-86d31a9f3495'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azot (N₂) və oksigen (O₂) qazları qarışığına aşağıdakı qazlardan hansıları əlavə edildikdə, ilkin qarışıqdakı V(O₂):V(N₂) həcm nisbətindən asılı olmayaraq qaz qarışığının orta sıxlığı (eyni şəraitdə) yalnız azalar? Ar(C)=12, Ar(N)=14, Ar(O)=16, Ar(H)=1.
1. N₂   2. CO   3. C₂H₆   4. CH₄   5. O₂   6. NO',
    'multiple_choice',
    '["3, 4", "1, 3, 6", "2, 3, 5", "4, 5, 6", "1, 2, 4"]'::jsonb,
    '3, 4',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd073cecd-ea74-4238-921d-d03c7289ae06'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Azot (N₂) və oksigen (O₂) qazları qarışığına aşağıdakı qazlardan hansıları əlavə edildikdə, ilkin qarışıqdakı V(O₂):V(N₂) həcm nisbətindən asılı olmayaraq qaz qarışığının orta sıxlığı (eyni şəraitdə) yalnız azalar? Ar(C)=12, Ar(N)=14, Ar(O)=16, Ar(H)=1.
1. N₂   2. CO   3. C₂H₆   4. CH₄   5. O₂   6. NO',
    'multiple_choice',
    '["3, 4", "1, 3, 6", "2, 3, 5", "4, 5, 6", "1, 2, 4"]'::jsonb,
    '3, 4',
    18,
    '95d3bcf7-7740-433d-b3e3-86d31a9f3495'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '768ff7f2-8ba5-4c28-8f08-e6326d522cb8'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıda verilmiş termokimyəvi tənliklərin istilik effektlərindən istifadə edərək CH₄(q) + Cl₂(q) = CH₃Cl(m) + HCl(q) reaksiyasının istilik effektini (kC/mol ilə) hesablayın:
1) CH₄(q) + 2O₂(q) = CO₂(q) + 2H₂O(m) + 892,0 kC
2) 2CH₃Cl(m) + 3O₂(q) = 2CO₂(q) + 2H₂O(m) + 2HCl(q) + 1374,0 kC
3) 2H₂(q) + O₂(q) = 2H₂O(m) + 572,0 kC
4) H₂(q) + Cl₂(q) = 2HCl(q) + 184,4 kC',
    'multiple_choice',
    '["87,2", "174,4", "349,0", "348,8", "206,8"]'::jsonb,
    '206,8',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8fcb42e0-f9d2-4b75-8e24-d7050c8acf55'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Aşağıda verilmiş termokimyəvi tənliklərin istilik effektlərindən istifadə edərək CH₄(q) + Cl₂(q) = CH₃Cl(m) + HCl(q) reaksiyasının istilik effektini (kC/mol ilə) hesablayın:
1) CH₄(q) + 2O₂(q) = CO₂(q) + 2H₂O(m) + 892,0 kC
2) 2CH₃Cl(m) + 3O₂(q) = 2CO₂(q) + 2H₂O(m) + 2HCl(q) + 1374,0 kC
3) 2H₂(q) + O₂(q) = 2H₂O(m) + 572,0 kC
4) H₂(q) + Cl₂(q) = 2HCl(q) + 184,4 kC',
    'multiple_choice',
    '["87,2", "174,4", "349,0", "348,8", "206,8"]'::jsonb,
    '206,8',
    19,
    '768ff7f2-8ba5-4c28-8f08-e6326d522cb8'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8e762fd0-9c34-47a1-8e17-7cf1b5984341'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Saf olmayan (tərkibində qarışıq olan) 3,68 qram Zn nümunəsi artıqlaması ilə götürülmüş duru H₂SO₄ məhlulu ilə reaksiyaya daxil olduqda 0,0764 qram H₂ qazı ayrılır. Qarışıqların turşu ilə reaksiyaya girmədiyini nəzərə alaraq nümunədəki sinkin təmizlik dərəcəsini (%-lə) hesablayın. Ar(Zn) = 65,4, Ar(H) = 1.',
    'multiple_choice',
    '["67,9", "38,2", "65,4", "40,8", "28,6"]'::jsonb,
    '67,9',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '089bc17a-6e29-4a3b-aa88-8bb53632b5d2'::uuid,
    'd51c2166-a707-476c-8a8d-54452e9b9ad3'::uuid,
    'Saf olmayan (tərkibində qarışıq olan) 3,68 qram Zn nümunəsi artıqlaması ilə götürülmüş duru H₂SO₄ məhlulu ilə reaksiyaya daxil olduqda 0,0764 qram H₂ qazı ayrılır. Qarışıqların turşu ilə reaksiyaya girmədiyini nəzərə alaraq nümunədəki sinkin təmizlik dərəcəsini (%-lə) hesablayın. Ar(Zn) = 65,4, Ar(H) = 1.',
    'multiple_choice',
    '["67,9", "38,2", "65,4", "40,8", "28,6"]'::jsonb,
    '67,9',
    20,
    '8e762fd0-9c34-47a1-8e17-7cf1b5984341'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Biologiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Biologiya - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Biologiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Biologiya fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Biologiya',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '931594',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'fe7cc211-3c5f-42f5-96c4-ae1b1cafaed0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Maltoza şəkəri maltaza fermenti vasitəsilə qlükoza molekullarına qədər parçalana bilir. Aşağıdakı amillərdən hansı bu fermentativ reaksiyanın sürətini azaldar?',
    'multiple_choice',
    '["Mühitə maltaza fermenti əlavə etmək", "Mühitə maltoza substratı əlavə etmək", "Mühitdən yaranan qlükozanı uzaqlaşdırmaq", "Mühiti su əlavə edərək həddindən artıq durulaşdırmaq", "Mühitə həm maltaza fermenti, həm də maltoza əlavə etmək"]'::jsonb,
    'Mühiti su əlavə edərək həddindən artıq durulaşdırmaq',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8005bf4f-1dfb-4920-a395-fa617cd00833'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Maltoza şəkəri maltaza fermenti vasitəsilə qlükoza molekullarına qədər parçalana bilir. Aşağıdakı amillərdən hansı bu fermentativ reaksiyanın sürətini azaldar?',
    'multiple_choice',
    '["Mühitə maltaza fermenti əlavə etmək", "Mühitə maltoza substratı əlavə etmək", "Mühitdən yaranan qlükozanı uzaqlaşdırmaq", "Mühiti su əlavə edərək həddindən artıq durulaşdırmaq", "Mühitə həm maltaza fermenti, həm də maltoza əlavə etmək"]'::jsonb,
    'Mühiti su əlavə edərək həddindən artıq durulaşdırmaq',
    1,
    'fe7cc211-3c5f-42f5-96c4-ae1b1cafaed0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6c0fa3e2-d287-43ec-b809-3cb3b82bf44d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Örtülütoxumlu bir bitkinin yarpaq en kəsiyində ötürücü dəstələrin yan-yana nizamlı düzülüşü, qalın kutikula qatı və ağızcıqların dərin çökəkliklərdə (kriptalarda) yerləşməsi müşahidə olunur. Bu anatomik xüsusiyyətləri nəzərə alaraq, sözügedən bitkinin aşağıdakı mühitlərin hansında yaşaması gözlənilir?',
    'multiple_choice',
    '["Daimi yağıntılı rütubətli tropik meşələrdə", "Su və bataqlıq ekosistemlərində (hidrofit mühit)", "Quraqlıq və yüksək buxarlanma olan mühitlərdə (kserofit mühit)", "Mülayim iqlim zonasının rütubətli çəmənliklərində", "İşıq düşməyən dərin mağara və sualtı biotoplarda"]'::jsonb,
    'Quraqlıq və yüksək buxarlanma olan mühitlərdə (kserofit mühit)',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q02.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '67fb7489-6256-47df-934f-33669b4e7e99'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Örtülütoxumlu bir bitkinin yarpaq en kəsiyində ötürücü dəstələrin yan-yana nizamlı düzülüşü, qalın kutikula qatı və ağızcıqların dərin çökəkliklərdə (kriptalarda) yerləşməsi müşahidə olunur. Bu anatomik xüsusiyyətləri nəzərə alaraq, sözügedən bitkinin aşağıdakı mühitlərin hansında yaşaması gözlənilir?',
    'multiple_choice',
    '["Daimi yağıntılı rütubətli tropik meşələrdə", "Su və bataqlıq ekosistemlərində (hidrofit mühit)", "Quraqlıq və yüksək buxarlanma olan mühitlərdə (kserofit mühit)", "Mülayim iqlim zonasının rütubətli çəmənliklərində", "İşıq düşməyən dərin mağara və sualtı biotoplarda"]'::jsonb,
    'Quraqlıq və yüksək buxarlanma olan mühitlərdə (kserofit mühit)',
    2,
    '6c0fa3e2-d287-43ec-b809-3cb3b82bf44d'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q02.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '956e443c-5a9b-4e7a-9b9d-c7e816878a24'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bitkilərdə hərəkət bitki orqanlarının stimullara məruz qaldıqdan sonra hüceyrələrin qeyri-bərabər böyüməsi (auksin asılı tropizm) və ya hüceyrələr arasında turqor təzyiqinin fərqli şəkildə dəyişməsi (nastiya) səbəbindən yarana bilər. Aşağıdakı bitki hərəkətlərindən hansı digərlərindən fərqli bir mexanizmdən istifadə edir?',
    'multiple_choice',
    '["Qarğıdalı köklərinin qravitropik hərəkəti", "Soya yarpaqcıqlarının gecə vaxtı qapanması (niktinastiya)", "Xiyar bığcıqlarının dayağa sarılaraq hərəkət etməsi (tiqmotropizm)", "Lobya cücərtilərinin fototropik hərəkəti", "Daşqın stressindən sonra pomidor yarpaqlarının etilen təsiri ilə aşağıya doğru epinastik bükülməsi"]'::jsonb,
    'Soya yarpaqcıqlarının gecə vaxtı qapanması (niktinastiya)',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0532995b-16d1-4148-b846-1faab58f1e1f'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Bitkilərdə hərəkət bitki orqanlarının stimullara məruz qaldıqdan sonra hüceyrələrin qeyri-bərabər böyüməsi (auksin asılı tropizm) və ya hüceyrələr arasında turqor təzyiqinin fərqli şəkildə dəyişməsi (nastiya) səbəbindən yarana bilər. Aşağıdakı bitki hərəkətlərindən hansı digərlərindən fərqli bir mexanizmdən istifadə edir?',
    'multiple_choice',
    '["Qarğıdalı köklərinin qravitropik hərəkəti", "Soya yarpaqcıqlarının gecə vaxtı qapanması (niktinastiya)", "Xiyar bığcıqlarının dayağa sarılaraq hərəkət etməsi (tiqmotropizm)", "Lobya cücərtilərinin fototropik hərəkəti", "Daşqın stressindən sonra pomidor yarpaqlarının etilen təsiri ilə aşağıya doğru epinastik bükülməsi"]'::jsonb,
    'Soya yarpaqcıqlarının gecə vaxtı qapanması (niktinastiya)',
    3,
    '956e443c-5a9b-4e7a-9b9d-c7e816878a24'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f7a8597f-f305-42ee-81e5-662934955c8e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Alim yüksək biokütlə əldə etmək üçün istixanada qarğıdalı becərir. O, istixanaya həddən çox işıq düşdüyü üçün daxili mühitin kəskin qızmasından narahat olur. İstixanaya düşən ümumi işıq enerjisinin (istiliyin) azalması, lakin bitkinin fotosintez və böyümə intensivliyinin maksimum qalması üçün istixananın yarıkeçirici örtüyü hansı rəngli işığı keçirməlidir?',
    'multiple_choice',
    '["Yaşıl", "Mavi", "Narıncı", "Qırmızı", "İstənilən rəng eyni effekt verir"]'::jsonb,
    'Qırmızı',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'da74140f-1913-406b-b5c8-eb3848cbdc1d'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Alim yüksək biokütlə əldə etmək üçün istixanada qarğıdalı becərir. O, istixanaya həddən çox işıq düşdüyü üçün daxili mühitin kəskin qızmasından narahat olur. İstixanaya düşən ümumi işıq enerjisinin (istiliyin) azalması, lakin bitkinin fotosintez və böyümə intensivliyinin maksimum qalması üçün istixananın yarıkeçirici örtüyü hansı rəngli işığı keçirməlidir?',
    'multiple_choice',
    '["Yaşıl", "Mavi", "Narıncı", "Qırmızı", "İstənilən rəng eyni effekt verir"]'::jsonb,
    'Qırmızı',
    4,
    'f7a8597f-f305-42ee-81e5-662934955c8e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2281e5a8-9d3a-4220-848c-e8f6b9b7f94b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsan orqanizmində hansı proses zamanı ürək döyüntülərinin tezliyi azalar?',
    'multiple_choice',
    '["Parasimpatik sinir sisteminin (azana sinirinin) oyanması zamanı", "Böyrəküstü vəzidən adrenalin ifrazı zamanı", "Hipertireodizm (tireotoksikoz) xəstəliyi zamanı", "Bədən temperaturunun yüksəlməsi zamanı", "Qanda karbon qazının parsial təzyiqinin artması zamanı"]'::jsonb,
    'Parasimpatik sinir sisteminin (azana sinirinin) oyanması zamanı',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0043cb8e-e54f-4a56-8baa-0c8fd88169c7'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'İnsan orqanizmində hansı proses zamanı ürək döyüntülərinin tezliyi azalar?',
    'multiple_choice',
    '["Parasimpatik sinir sisteminin (azana sinirinin) oyanması zamanı", "Böyrəküstü vəzidən adrenalin ifrazı zamanı", "Hipertireodizm (tireotoksikoz) xəstəliyi zamanı", "Bədən temperaturunun yüksəlməsi zamanı", "Qanda karbon qazının parsial təzyiqinin artması zamanı"]'::jsonb,
    'Parasimpatik sinir sisteminin (azana sinirinin) oyanması zamanı',
    5,
    '2281e5a8-9d3a-4220-848c-e8f6b9b7f94b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'c03ebbb6-ba0c-4ea4-a2a3-8d687eceaf82'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Balıq qəlsəməsindəki su axını (AB borusu: A ucunda O₂ doyma dərəcəsi 100%, B ucunda 15%) və qəlsəmə kapilyarındakı qan axını (CD borusu: C ucunda O₂ doyma dərəcəsi 85%, D ucunda 5%) əks-axın prinsipi ilə işləyir. Doğru mülahizələri seçin:
I. AB borusu su axınını, CD borusu isə qan axınını göstərir.
II. CD borusu su axınını, AB borusu isə qan axınını göstərir.
III. AB borusunda axın B → A istiqamətindədir.
IV. CD borusunda axın C → D istiqamətindədir.',
    'multiple_choice',
    '["Yalnız I", "Yalnız II", "I və III", "II və IV", "II, III və IV"]'::jsonb,
    'Yalnız I',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q06.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '095c2431-8d36-468b-bd51-ed5189d4c15f'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Balıq qəlsəməsindəki su axını (AB borusu: A ucunda O₂ doyma dərəcəsi 100%, B ucunda 15%) və qəlsəmə kapilyarındakı qan axını (CD borusu: C ucunda O₂ doyma dərəcəsi 85%, D ucunda 5%) əks-axın prinsipi ilə işləyir. Doğru mülahizələri seçin:
I. AB borusu su axınını, CD borusu isə qan axınını göstərir.
II. CD borusu su axınını, AB borusu isə qan axınını göstərir.
III. AB borusunda axın B → A istiqamətindədir.
IV. CD borusunda axın C → D istiqamətindədir.',
    'multiple_choice',
    '["Yalnız I", "Yalnız II", "I və III", "II və IV", "II, III və IV"]'::jsonb,
    'Yalnız I',
    6,
    'c03ebbb6-ba0c-4ea4-a2a3-8d687eceaf82'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q06.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '28203b13-7676-4bfe-87dd-dcef1a145be6'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qan plazması üzvi və qeyri-üzvi maddələrlə zəngindir. Üzvi maddələrdən bir qismi plazmanın onkotik təzyiqini tənzimləyir, digər qismi isə həzm sistemindən sorulmaqla və ya endokrin vəzilər tərəfindən ifraz olunmaqla qana keçir. Sağlam insanın qan plazmasında aşağıdakı maddələrdən hansılara sərbəst şəkildə rast gəlinə bilməz?',
    'multiple_choice',
    '["Qlükoza, adrenalin", "Albumin, fibrinogen", "Qlükoza, aminturşular", "Nişasta, qlikogen", "Antidiuretik hormon (ADH), fibrinogen"]'::jsonb,
    'Nişasta, qlikogen',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '9e789ab9-689b-49d3-8a94-7f20eab35302'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Qan plazması üzvi və qeyri-üzvi maddələrlə zəngindir. Üzvi maddələrdən bir qismi plazmanın onkotik təzyiqini tənzimləyir, digər qismi isə həzm sistemindən sorulmaqla və ya endokrin vəzilər tərəfindən ifraz olunmaqla qana keçir. Sağlam insanın qan plazmasında aşağıdakı maddələrdən hansılara sərbəst şəkildə rast gəlinə bilməz?',
    'multiple_choice',
    '["Qlükoza, adrenalin", "Albumin, fibrinogen", "Qlükoza, aminturşular", "Nişasta, qlikogen", "Antidiuretik hormon (ADH), fibrinogen"]'::jsonb,
    'Nişasta, qlikogen',
    7,
    '28203b13-7676-4bfe-87dd-dcef1a145be6'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9fc97bd1-1c8d-4981-8b6e-a0fb0f40879e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bir qrup şagird laboratoriya otağında hüceyrəsiz sınaq şüşəsində (ATF əlavə etmədən, yalnız müvafiq həzm fermenti və su iştirakı ilə) praktik iş aparır. Onlar bu şəraitdə sınaq şüşəsində hansı biokimyəvi prosesi həyata keçirə bilərlər?',
    'multiple_choice',
    '["Nişastanın hidrolizini", "Nişastanın sintezini", "Qlükozanın sintezini", "Sellülozanın sintezini", "Aminturşuların sintezini"]'::jsonb,
    'Nişastanın hidrolizini',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a30d4c58-35ac-484f-9bf9-a476a7d1539d'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Bir qrup şagird laboratoriya otağında hüceyrəsiz sınaq şüşəsində (ATF əlavə etmədən, yalnız müvafiq həzm fermenti və su iştirakı ilə) praktik iş aparır. Onlar bu şəraitdə sınaq şüşəsində hansı biokimyəvi prosesi həyata keçirə bilərlər?',
    'multiple_choice',
    '["Nişastanın hidrolizini", "Nişastanın sintezini", "Qlükozanın sintezini", "Sellülozanın sintezini", "Aminturşuların sintezini"]'::jsonb,
    'Nişastanın hidrolizini',
    8,
    '9fc97bd1-1c8d-4981-8b6e-a0fb0f40879e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3e9a8e44-47af-41f2-aaf0-ff9dd5d29b31'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sağlam insanda sakit nəfəsalma (inspirasiya) zamanı aşağıdakılardan hansı baş verə bilməz?',
    'multiple_choice',
    '["Tənəffüs yollarındakı havanın nəmliyinin artması", "Plevra boşluğundakı mənfi təzyiqin daha da azalması", "Diafraqma əzələlərinin təqəllüs aktivliyinin azalması (boşalması)", "Qarın boşluğunun həcminin azalması və təzyiqinin artması", "Alveoldaxili təzyiqin atmosfer təzyiqindən aşağı düşməsi"]'::jsonb,
    'Diafraqma əzələlərinin təqəllüs aktivliyinin azalması (boşalması)',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '82a95234-ac5c-4952-924d-44b70de2d865'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Sağlam insanda sakit nəfəsalma (inspirasiya) zamanı aşağıdakılardan hansı baş verə bilməz?',
    'multiple_choice',
    '["Tənəffüs yollarındakı havanın nəmliyinin artması", "Plevra boşluğundakı mənfi təzyiqin daha da azalması", "Diafraqma əzələlərinin təqəllüs aktivliyinin azalması (boşalması)", "Qarın boşluğunun həcminin azalması və təzyiqinin artması", "Alveoldaxili təzyiqin atmosfer təzyiqindən aşağı düşməsi"]'::jsonb,
    'Diafraqma əzələlərinin təqəllüs aktivliyinin azalması (boşalması)',
    9,
    '3e9a8e44-47af-41f2-aaf0-ff9dd5d29b31'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '814acebd-99a1-43c6-8608-a435c0b0b752'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Trofik şəbəkədə K növü produsentdir; L, M və N növləri yalnız K ilə qidalanır; P növü L və M ilə qidalanır; R isə şəbəkədəki bütün orqanizmlərin (K, L, M, N, P) qalıqlarını parçalayan orqanizmdir. Bu şəbəkə ilə bağlı hansı fikir səhvdir?',
    'multiple_choice',
    '["Bu qida şəbəkəsində üçüncü dərəcəli konsument yoxdur.", "L, M və N növləri bitkiyeyəndirlər (herbivordurlar).", "P qida zəncirinin zirvəsində dayanan ətyeyəndir (karnivordur).", "R üzvi qalıqları minerallaşdıran redusentdir.", "R omnivordur, çünki o həm K, həm də bütün konsumentlərlə canlı halda qidalanır."]'::jsonb,
    'R omnivordur, çünki o həm K, həm də bütün konsumentlərlə canlı halda qidalanır.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q10.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '1f179e79-c907-4f15-a71c-254af2ab7255'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Trofik şəbəkədə K növü produsentdir; L, M və N növləri yalnız K ilə qidalanır; P növü L və M ilə qidalanır; R isə şəbəkədəki bütün orqanizmlərin (K, L, M, N, P) qalıqlarını parçalayan orqanizmdir. Bu şəbəkə ilə bağlı hansı fikir səhvdir?',
    'multiple_choice',
    '["Bu qida şəbəkəsində üçüncü dərəcəli konsument yoxdur.", "L, M və N növləri bitkiyeyəndirlər (herbivordurlar).", "P qida zəncirinin zirvəsində dayanan ətyeyəndir (karnivordur).", "R üzvi qalıqları minerallaşdıran redusentdir.", "R omnivordur, çünki o həm K, həm də bütün konsumentlərlə canlı halda qidalanır."]'::jsonb,
    'R omnivordur, çünki o həm K, həm də bütün konsumentlərlə canlı halda qidalanır.',
    10,
    '814acebd-99a1-43c6-8608-a435c0b0b752'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q10.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f223e3f9-56fa-48f3-b65a-d09464511740'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Ananın bətnindəki döl ilə ana orqanizmi arasında cift (plasenta) üzərindən maddələr mübadiləsi gedir. Aşağıdakı mübadilə proseslərindən hansı endositoz (pinositoz/reseptor-vasitəli endositoz) yolu ilə baş verir?',
    'multiple_choice',
    '["Ananın qan plazmasından dölün qan plazmasına suyun keçməsi", "Ananın qan plazmasından dölün qan plazmasına qlükozanın keçməsi", "Ananın qan plazmasından dölün qan plazmasına oksigen qazının keçməsi", "Dölün qan plazmasından ananın qan plazmasına karbon qazının keçməsi", "Ananın qan plazmasından dölün qan plazmasına immunoqlobulinlərin (antikütlələrin) keçməsi"]'::jsonb,
    'Ananın qan plazmasından dölün qan plazmasına immunoqlobulinlərin (antikütlələrin) keçməsi',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c992ebe1-5ef4-4c97-afdc-5ada55b59de3'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Ananın bətnindəki döl ilə ana orqanizmi arasında cift (plasenta) üzərindən maddələr mübadiləsi gedir. Aşağıdakı mübadilə proseslərindən hansı endositoz (pinositoz/reseptor-vasitəli endositoz) yolu ilə baş verir?',
    'multiple_choice',
    '["Ananın qan plazmasından dölün qan plazmasına suyun keçməsi", "Ananın qan plazmasından dölün qan plazmasına qlükozanın keçməsi", "Ananın qan plazmasından dölün qan plazmasına oksigen qazının keçməsi", "Dölün qan plazmasından ananın qan plazmasına karbon qazının keçməsi", "Ananın qan plazmasından dölün qan plazmasına immunoqlobulinlərin (antikütlələrin) keçməsi"]'::jsonb,
    'Ananın qan plazmasından dölün qan plazmasına immunoqlobulinlərin (antikütlələrin) keçməsi',
    11,
    'f223e3f9-56fa-48f3-b65a-d09464511740'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f555c25f-66a1-4b22-815d-691f92f22589'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bir təcrübədə 37°C-də böyüyən E. coli bakteriya hüceyrələri 20°C-yə köçürülüb bir neçə nəsil ərzində inkubasiya edildi. Plazmatik membrandakı hansı dəyişiklik E. coli hüceyrələrinin soyuq mühitdə membran axıcılığını qorumasına kömək edər?',
    'multiple_choice',
    '["Fosfolipidlərdə doymamış yağ turşularının payının artması", "İnteqral membran zülallarının sayının artması", "Ümumi xolesterin tərkibinin kəskin artması", "Yağ turşularının hidrofob quyruğunun uzunluğunun artması", "Doymuş yağ turşularının doymamış yağ turşularına olan nisbətinin artması"]'::jsonb,
    'Fosfolipidlərdə doymamış yağ turşularının payının artması',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '1e4ceedf-878a-4f45-8619-5078cc83e921'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Bir təcrübədə 37°C-də böyüyən E. coli bakteriya hüceyrələri 20°C-yə köçürülüb bir neçə nəsil ərzində inkubasiya edildi. Plazmatik membrandakı hansı dəyişiklik E. coli hüceyrələrinin soyuq mühitdə membran axıcılığını qorumasına kömək edər?',
    'multiple_choice',
    '["Fosfolipidlərdə doymamış yağ turşularının payının artması", "İnteqral membran zülallarının sayının artması", "Ümumi xolesterin tərkibinin kəskin artması", "Yağ turşularının hidrofob quyruğunun uzunluğunun artması", "Doymuş yağ turşularının doymamış yağ turşularına olan nisbətinin artması"]'::jsonb,
    'Fosfolipidlərdə doymamış yağ turşularının payının artması',
    12,
    'f555c25f-66a1-4b22-815d-691f92f22589'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ccb9b5e0-872a-4bdb-9e9b-5c4692d89e0d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Klimatoqrama əsasən K biomu isti və kəskin quraq səhra biomunu, M biomu isə ilboyu isti və bol yağıntılı tropik yağış meşəsi biomunu təmsil edir. Verilən fikirlərdən hansılar doğrudur?
I. «K» biomunda kökü dərinə gedən kolların, kök və ya gövdələrində su ehtiyatı toplama qabiliyyətinə malik sukkulent bitki növlərinin olması gözlənilir.
II. İynəyarpaqlı tayqa biomunda ilboyu yüksək temperatur və epifit bitkilərin üstünlüyü müşahidə olunur.
III. «M» biomunda enliyarpaqlı, həmişəyaşıl ağacların hakim olması və üzərlərində sarmaşan (liana) bitkilərin geniş yayılması gözlənilir.
IV. Müxtəlif enliklərdə yerləşən bütün biomlarda eyni temperatur və yağış rejimi müşahidə olunur.',
    'multiple_choice',
    '["I və II", "I və III", "II və IV", "I, II və III", "II və III"]'::jsonb,
    'I və III',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q13.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b1bced3d-e026-402e-9b83-7f7096d62a20'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Klimatoqrama əsasən K biomu isti və kəskin quraq səhra biomunu, M biomu isə ilboyu isti və bol yağıntılı tropik yağış meşəsi biomunu təmsil edir. Verilən fikirlərdən hansılar doğrudur?
I. «K» biomunda kökü dərinə gedən kolların, kök və ya gövdələrində su ehtiyatı toplama qabiliyyətinə malik sukkulent bitki növlərinin olması gözlənilir.
II. İynəyarpaqlı tayqa biomunda ilboyu yüksək temperatur və epifit bitkilərin üstünlüyü müşahidə olunur.
III. «M» biomunda enliyarpaqlı, həmişəyaşıl ağacların hakim olması və üzərlərində sarmaşan (liana) bitkilərin geniş yayılması gözlənilir.
IV. Müxtəlif enliklərdə yerləşən bütün biomlarda eyni temperatur və yağış rejimi müşahidə olunur.',
    'multiple_choice',
    '["I və II", "I və III", "II və IV", "I, II və III", "II və III"]'::jsonb,
    'I və III',
    13,
    'ccb9b5e0-872a-4bdb-9e9b-5c4692d89e0d'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q13.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '45604c1b-a6a5-4f18-8d36-bef3b3b0740d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsanın elektrokardioqramında (EKQ) iki qonşu R dişi arasındakı məsafə lent üzərində 20 mm-ə bərabərdir. Həmin şəxsin ürək döyüntülərinin tezliyi dəqiqədə 75 vurğu olarsa, EKQ lentinin hərəkət (qeyd) sürətini tapın (mm/san ilə):',
    'multiple_choice',
    '["20 mm/san", "25 mm/san", "0,04 mm/san", "62,5 mm/san", "1,25 mm/san"]'::jsonb,
    '25 mm/san',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q14.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '75fd6a57-b9a2-4329-ab08-167fe2cf381d'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'İnsanın elektrokardioqramında (EKQ) iki qonşu R dişi arasındakı məsafə lent üzərində 20 mm-ə bərabərdir. Həmin şəxsin ürək döyüntülərinin tezliyi dəqiqədə 75 vurğu olarsa, EKQ lentinin hərəkət (qeyd) sürətini tapın (mm/san ilə):',
    'multiple_choice',
    '["20 mm/san", "25 mm/san", "0,04 mm/san", "62,5 mm/san", "1,25 mm/san"]'::jsonb,
    '25 mm/san',
    14,
    '45604c1b-a6a5-4f18-8d36-bef3b3b0740d'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q14.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '127d966f-d8c9-4d7b-b1b9-b64defb32741'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hüceyrə orqanelləri yerinə yetirdikləri funksiyalara görə qruplaşdırıla bilər. Aşağıdakı funksional qruplaşdırmalardan hansı tam doğrudur?',
    'multiple_choice',
    '["Nüvə, mikrofilamentlər və plazma membranı — yalnız hüceyrə hərəkətini tənzimləyir", "Endoplazmatik şəbəkə, Holci kompleksi və mitoxondri — yalnız hüceyrə ifrazatını tənzimləyir", "Nüvə, ribosomlar və hamar endoplazmatik şəbəkə — genetik informasiyanı emal edir", "Endoplazmatik şəbəkə, nəqliyyat vezikulları və sentriollar — membran sekresiyasını təmin edir", "Mikroborucuqlar (mikrotubullar), mikrofilamentlər və aralıq filamentlər — hüceyrə arxitekturasını (sitoskeleti) və hərəkətini tənzimləyir"]'::jsonb,
    'Mikroborucuqlar (mikrotubullar), mikrofilamentlər və aralıq filamentlər — hüceyrə arxitekturasını (sitoskeleti) və hərəkətini tənzimləyir',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '502c85a2-46ce-4400-8e03-4fb412fbdc2c'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Hüceyrə orqanelləri yerinə yetirdikləri funksiyalara görə qruplaşdırıla bilər. Aşağıdakı funksional qruplaşdırmalardan hansı tam doğrudur?',
    'multiple_choice',
    '["Nüvə, mikrofilamentlər və plazma membranı — yalnız hüceyrə hərəkətini tənzimləyir", "Endoplazmatik şəbəkə, Holci kompleksi və mitoxondri — yalnız hüceyrə ifrazatını tənzimləyir", "Nüvə, ribosomlar və hamar endoplazmatik şəbəkə — genetik informasiyanı emal edir", "Endoplazmatik şəbəkə, nəqliyyat vezikulları və sentriollar — membran sekresiyasını təmin edir", "Mikroborucuqlar (mikrotubullar), mikrofilamentlər və aralıq filamentlər — hüceyrə arxitekturasını (sitoskeleti) və hərəkətini tənzimləyir"]'::jsonb,
    'Mikroborucuqlar (mikrotubullar), mikrofilamentlər və aralıq filamentlər — hüceyrə arxitekturasını (sitoskeleti) və hərəkətini tənzimləyir',
    15,
    '127d966f-d8c9-4d7b-b1b9-b64defb32741'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '24961ca7-448b-40c3-8d58-80495acaaf80'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıdakı oliqonukleotid cütlərindən hansı antiparalel və komplementar qaydaya əsasən normal DNT qoşa spiralının bir hissəsini əmələ gətirə bilər?',
    'multiple_choice',
    '["5''-AGCT-3'' və 5''-TCGA-3''", "5''-GCGC-3'' və 5''-TATA-3''", "5''-ATGC-3'' və 5''-GCAT-3''", "Bütün göstərilən cütlər doğrudur", "Burada doğru cüt yoxdur"]'::jsonb,
    '5''-ATGC-3'' və 5''-GCAT-3''',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '92602edd-5850-4860-84eb-d5fb7bda67ac'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Aşağıdakı oliqonukleotid cütlərindən hansı antiparalel və komplementar qaydaya əsasən normal DNT qoşa spiralının bir hissəsini əmələ gətirə bilər?',
    'multiple_choice',
    '["5''-AGCT-3'' və 5''-TCGA-3''", "5''-GCGC-3'' və 5''-TATA-3''", "5''-ATGC-3'' və 5''-GCAT-3''", "Bütün göstərilən cütlər doğrudur", "Burada doğru cüt yoxdur"]'::jsonb,
    '5''-ATGC-3'' və 5''-GCAT-3''',
    16,
    '24961ca7-448b-40c3-8d58-80495acaaf80'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ad2ebac1-63ed-48a3-9219-0e33d376f808'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsanın gövdə hissəsinin transversal (köndələn) kəsiyində onurğa sütunu, döş sümüyü, qabırğalar, ağciyərlər və ürək görünürsə, bu kəsik hansı bədən boşluğuna aiddir?',
    'multiple_choice',
    '["Qarın boşluğu", "Çanaq boşluğu", "Döş boşluğu", "Mədə boşluğu", "Kəllə boşluğu"]'::jsonb,
    'Döş boşluğu',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q17.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '3fde562f-196f-43b7-96a1-ed75b88b5904'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'İnsanın gövdə hissəsinin transversal (köndələn) kəsiyində onurğa sütunu, döş sümüyü, qabırğalar, ağciyərlər və ürək görünürsə, bu kəsik hansı bədən boşluğuna aiddir?',
    'multiple_choice',
    '["Qarın boşluğu", "Çanaq boşluğu", "Döş boşluğu", "Mədə boşluğu", "Kəllə boşluğu"]'::jsonb,
    'Döş boşluğu',
    17,
    'ad2ebac1-63ed-48a3-9219-0e33d376f808'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q17.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '33de9de6-5e10-4655-9bc8-5d37b4c33b41'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Suitilər suyun altında 1 saata qədər qala bilirlər və bu müddətdə səthə çıxmırlar. Suitilərin sualtı dalma uyğunlaşmaları barədə verilən fikirlərdən hansı səhvdir?',
    'multiple_choice',
    '["Suitilərin bədən kütləsinə nisbətən qan həcmi və oksigen ehtiyatı quruda yaşayan məməlilərdən daha çoxdur.", "Suiti suya baş vurduqda ürək döyüntülərinin sürətini kəskin artıraraq (taxikardiya) bütün toxumalara daha çox oksigen göndərir.", "Suitilərdə mərkəzi sinir sistemi və ürəkdən başqa digər periferik toxumalara gedən qan damarları daralır (vazokonstriksiya).", "Suitilər dalma zamanı toxumaların maddələr mübadiləsi intensivliyini aşağı salırlar.", "Suitilərin əzələlərində mioqlobin zülalı çoxdur və oksigen ehtiyatı rolunu oynayır."]'::jsonb,
    'Suiti suya baş vurduqda ürək döyüntülərinin sürətini kəskin artıraraq (taxikardiya) bütün toxumalara daha çox oksigen göndərir.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e6f1ade2-c835-42b6-994b-32ae33cfbf55'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Suitilər suyun altında 1 saata qədər qala bilirlər və bu müddətdə səthə çıxmırlar. Suitilərin sualtı dalma uyğunlaşmaları barədə verilən fikirlərdən hansı səhvdir?',
    'multiple_choice',
    '["Suitilərin bədən kütləsinə nisbətən qan həcmi və oksigen ehtiyatı quruda yaşayan məməlilərdən daha çoxdur.", "Suiti suya baş vurduqda ürək döyüntülərinin sürətini kəskin artıraraq (taxikardiya) bütün toxumalara daha çox oksigen göndərir.", "Suitilərdə mərkəzi sinir sistemi və ürəkdən başqa digər periferik toxumalara gedən qan damarları daralır (vazokonstriksiya).", "Suitilər dalma zamanı toxumaların maddələr mübadiləsi intensivliyini aşağı salırlar.", "Suitilərin əzələlərində mioqlobin zülalı çoxdur və oksigen ehtiyatı rolunu oynayır."]'::jsonb,
    'Suiti suya baş vurduqda ürək döyüntülərinin sürətini kəskin artıraraq (taxikardiya) bütün toxumalara daha çox oksigen göndərir.',
    18,
    '33de9de6-5e10-4655-9bc8-5d37b4c33b41'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b8e1089f-91e4-470c-925d-fdb290c52526'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Şirin suda və duzlu suda (dənizdə) yaşayan sümüklü balıqlar müxtəlif osmotik problemlərlə üzləşirlər. Aşağıda verilmiş uyğunlaşmalardan hansılar duzlu su (dəniz) balıqlarına aiddir?
1. Böyrək kanalcıqlarında NaCl-un intensiv aktiv geri sorulması və bol hipotonik sidik ifrazı
2. Böyrəklərdən suyun qana daha çox geri sorulması (az miqdarda qatı sidik ifrazı)
3. NaCl duzlarının xüsusi xlorid hüceyrələri vasitəsilə qəlsəmələrdən aktiv şəkildə xaricə ifrazı
4. Suyun qəlsəmələrdən qana passiv osmosla daxil olması',
    'multiple_choice',
    '["1, 2", "1, 3", "2, 3", "2, 4", "1, 4"]'::jsonb,
    '2, 3',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '16b1edbf-261a-479f-9272-78a02f709057'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'Şirin suda və duzlu suda (dənizdə) yaşayan sümüklü balıqlar müxtəlif osmotik problemlərlə üzləşirlər. Aşağıda verilmiş uyğunlaşmalardan hansılar duzlu su (dəniz) balıqlarına aiddir?
1. Böyrək kanalcıqlarında NaCl-un intensiv aktiv geri sorulması və bol hipotonik sidik ifrazı
2. Böyrəklərdən suyun qana daha çox geri sorulması (az miqdarda qatı sidik ifrazı)
3. NaCl duzlarının xüsusi xlorid hüceyrələri vasitəsilə qəlsəmələrdən aktiv şəkildə xaricə ifrazı
4. Suyun qəlsəmələrdən qana passiv osmosla daxil olması',
    'multiple_choice',
    '["1, 2", "1, 3", "2, 3", "2, 4", "1, 4"]'::jsonb,
    '2, 3',
    19,
    'b8e1089f-91e4-470c-925d-fdb290c52526'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '44022a79-211b-4eee-a632-724a5d3e4f13'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsanın aşağı ətrafında dərin vena damarı və onu əhatə edən skelet əzələləri («əzələ nasosu») təsvir edilmişdir (X hissəsi distal qapaqdan aşağıda, Y hissəsi distal və proksimal qapaqlar arasında əzələlərin sıxdığı hissədə, Z hissəsi isə proksimal qapaqdan ürəyə doğru yuxarıda yerləşir). Verilmiş mülahizələrdən düzgün olanları seçin:
1. Əzələ yığıldıqda Y hissəsindəki qan təzyiqi X hissəsindəkindən daha yüksəkdir.
2. Əzələ yığıldığı anda qan Y-dən X-ə doğru geriyə axır.
3. Distal qapaq qanın ürəyə doğru axmasına mane olur.
4. Qan venada distal qapaqdan proksimal qapağa (ürəyə) tərəf istiqamətlənmiş şəkildə axır.',
    'multiple_choice',
    '["Yalnız 1", "Yalnız 2", "1, 3", "2, 3", "1, 4"]'::jsonb,
    '1, 4',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q20.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c3f07005-feec-41c9-af7b-270477c97e18'::uuid,
    '8ff5236d-a1cb-4bde-aa96-2f3f7c3e9c2f'::uuid,
    'İnsanın aşağı ətrafında dərin vena damarı və onu əhatə edən skelet əzələləri («əzələ nasosu») təsvir edilmişdir (X hissəsi distal qapaqdan aşağıda, Y hissəsi distal və proksimal qapaqlar arasında əzələlərin sıxdığı hissədə, Z hissəsi isə proksimal qapaqdan ürəyə doğru yuxarıda yerləşir). Verilmiş mülahizələrdən düzgün olanları seçin:
1. Əzələ yığıldıqda Y hissəsindəki qan təzyiqi X hissəsindəkindən daha yüksəkdir.
2. Əzələ yığıldığı anda qan Y-dən X-ə doğru geriyə axır.
3. Distal qapaq qanın ürəyə doğru axmasına mane olur.
4. Qan venada distal qapaqdan proksimal qapağa (ürəyə) tərəf istiqamətlənmiş şəkildə axır.',
    'multiple_choice',
    '["Yalnız 1", "Yalnız 2", "1, 3", "2, 3", "1, 4"]'::jsonb,
    '1, 4',
    20,
    '44022a79-211b-4eee-a632-724a5d3e4f13'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_bio_q20.png',
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Tarix (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Tarix - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tarix (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Tarix fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Tarix',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '817235',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '28632826-6634-4ce0-84bc-e7e0d77e31f5'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Romalıların Azərbaycanda olduqlarını sübut edən maddi-mədəniyyət abidəsi:',
    'multiple_choice',
    '["Qobustanda üzərində latın dilində yazı olan daş kitabə", "Oktavian Avqustun adından tərtib olunmuş mixi kitabə", "Yunan-Roma müəlliflərinin əsərlərindəki məlumat", "Keriftoda aşkar edilən abidə üzərindəki yazı", "Böyük Dəhnə kəndindən yunan yazısı olan daş kitabənin tapılması"]'::jsonb,
    'Qobustanda üzərində latın dilində yazı olan daş kitabə',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '33b81f8f-d4d6-4031-a36f-052adbbd3004'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Romalıların Azərbaycanda olduqlarını sübut edən maddi-mədəniyyət abidəsi:',
    'multiple_choice',
    '["Qobustanda üzərində latın dilində yazı olan daş kitabə", "Oktavian Avqustun adından tərtib olunmuş mixi kitabə", "Yunan-Roma müəlliflərinin əsərlərindəki məlumat", "Keriftoda aşkar edilən abidə üzərindəki yazı", "Böyük Dəhnə kəndindən yunan yazısı olan daş kitabənin tapılması"]'::jsonb,
    'Qobustanda üzərində latın dilində yazı olan daş kitabə',
    1,
    '28632826-6634-4ce0-84bc-e7e0d77e31f5'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '1925fe0f-74ad-4c05-bd97-ce6979da7d0a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XIII–XIV əsrlər Azərbaycan tarixi ilə bağlı uyğunluq gözlənilmişdir:',
    'multiple_choice',
    '["II Axsitan monqolların II yürüşü zamanı monqollara tabe olur.", "II Fəribürz monqollara xərac verərək Cəlaləddindən asılı hala düşüb.", "Kavus Təbrizə yürüş edərək Cəlairiləri özündən asılı hala salır.", "Huşəngin hakimiyyəti dövründə Muğan Dərbəndilər sülaləsinə tabe idi.", "XIII əsrin birinci yarısında monqollar Azərbaycanın cənubunu tutduqdan sonra Arrana və Şirvana daxil oldular."]'::jsonb,
    'XIII əsrin birinci yarısında monqollar Azərbaycanın cənubunu tutduqdan sonra Arrana və Şirvana daxil oldular.',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '54d9e545-ae7c-4841-8f58-c8e95a18a4c5'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'XIII–XIV əsrlər Azərbaycan tarixi ilə bağlı uyğunluq gözlənilmişdir:',
    'multiple_choice',
    '["II Axsitan monqolların II yürüşü zamanı monqollara tabe olur.", "II Fəribürz monqollara xərac verərək Cəlaləddindən asılı hala düşüb.", "Kavus Təbrizə yürüş edərək Cəlairiləri özündən asılı hala salır.", "Huşəngin hakimiyyəti dövründə Muğan Dərbəndilər sülaləsinə tabe idi.", "XIII əsrin birinci yarısında monqollar Azərbaycanın cənubunu tutduqdan sonra Arrana və Şirvana daxil oldular."]'::jsonb,
    'XIII əsrin birinci yarısında monqollar Azərbaycanın cənubunu tutduqdan sonra Arrana və Şirvana daxil oldular.',
    2,
    '1925fe0f-74ad-4c05-bd97-ce6979da7d0a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '553f44d1-3ffe-4e53-80e7-98ca09a4e489'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XVII–XVIII yüzilliklərə aid uyğunluğu müəyyən edin:
1. Çin
2. Hindistan
a. Mukdendə imperator mavzoleyi tikilmişdi
b. Monqol dili rəsmi dövlət dili idi
c. Çoxcildli ensiklopediya və lüğətlər tərtib olunmuşdu
d. İri şəhərlərdə Avropa tipli universitetlər fəaliyyət göstərirdi
e. Yeni tipli xalq teatrının əsası qoyulmuşdu',
    'multiple_choice',
    '["1-a; 2-b", "1-a; 2-c, e", "1-a, c; 2-e", "1-b; 2-d", "1-c; 2-e"]'::jsonb,
    '1-a, c; 2-e',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2dce6b5e-cdae-48f6-a8ba-51f231862687'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'XVII–XVIII yüzilliklərə aid uyğunluğu müəyyən edin:
1. Çin
2. Hindistan
a. Mukdendə imperator mavzoleyi tikilmişdi
b. Monqol dili rəsmi dövlət dili idi
c. Çoxcildli ensiklopediya və lüğətlər tərtib olunmuşdu
d. İri şəhərlərdə Avropa tipli universitetlər fəaliyyət göstərirdi
e. Yeni tipli xalq teatrının əsası qoyulmuşdu',
    'multiple_choice',
    '["1-a; 2-b", "1-a; 2-c, e", "1-a, c; 2-e", "1-b; 2-d", "1-c; 2-e"]'::jsonb,
    '1-a, c; 2-e',
    3,
    '553f44d1-3ffe-4e53-80e7-98ca09a4e489'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4950319d-1c74-4ed6-8d6e-e1403ab1a105'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Göstərilənlərin aid olduğu qədim dövləti müəyyən edin:
«Bu dövlətin idarəçiliyi 7 böyük nəslin əlində cəmlənmişdi. Nəsillərdən biri olan Mehranilər Midiyanın şimal hissələrini idarə etmişlər. Atlı qoşunları onluq, yüzlük və minlik dəstələrə bölünürdü.»',
    'multiple_choice',
    '["Asiya Hun", "Parfiya", "Babil", "Aşşur", "Midiya"]'::jsonb,
    'Parfiya',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5bf39fac-2feb-4c29-ac33-614b81f09d4f'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Göstərilənlərin aid olduğu qədim dövləti müəyyən edin:
«Bu dövlətin idarəçiliyi 7 böyük nəslin əlində cəmlənmişdi. Nəsillərdən biri olan Mehranilər Midiyanın şimal hissələrini idarə etmişlər. Atlı qoşunları onluq, yüzlük və minlik dəstələrə bölünürdü.»',
    'multiple_choice',
    '["Asiya Hun", "Parfiya", "Babil", "Aşşur", "Midiya"]'::jsonb,
    'Parfiya',
    4,
    '4950319d-1c74-4ed6-8d6e-e1403ab1a105'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9c66a464-78be-4587-aa8a-22247696ea2b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Orxon-Yenisey abidələrinə aiddir:
1. X–XII əsrlərə aiddir
2. Qədim türk yazılı abidəsidir
3. Ən əhəmiyyətliləri Göytürk yazılarıdır
4. Abidədə sətirlər soldan sağa yerləşdirilmişdir
5. Bizans imperiyasına aiddir',
    'multiple_choice',
    '["Yalnız 2", "2, 3, 4", "3, 5", "Yalnız 3", "2, 3"]'::jsonb,
    '2, 3',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c75f7a20-27d8-49c7-8857-45a94ae5c41f'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Orxon-Yenisey abidələrinə aiddir:
1. X–XII əsrlərə aiddir
2. Qədim türk yazılı abidəsidir
3. Ən əhəmiyyətliləri Göytürk yazılarıdır
4. Abidədə sətirlər soldan sağa yerləşdirilmişdir
5. Bizans imperiyasına aiddir',
    'multiple_choice',
    '["Yalnız 2", "2, 3, 4", "3, 5", "Yalnız 3", "2, 3"]'::jsonb,
    '2, 3',
    5,
    '9c66a464-78be-4587-aa8a-22247696ea2b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '57a8db46-2fcf-488e-b8ab-51cef40d7516'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '2023-cü il Azərbaycan Respublikasının Prezidenti İlham Əliyev tərəfindən elan edilmişdir:',
    'multiple_choice',
    '["«Qarabağa qayıdış» ili", "«Şuşa» ili", "«Qarabağ» ili", "«Heydər Əliyev» ili", "«Nizami Gəncəvi» ili"]'::jsonb,
    '«Heydər Əliyev» ili',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'abe9322e-80bb-499f-9399-ba5d69183afd'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    '2023-cü il Azərbaycan Respublikasının Prezidenti İlham Əliyev tərəfindən elan edilmişdir:',
    'multiple_choice',
    '["«Qarabağa qayıdış» ili", "«Şuşa» ili", "«Qarabağ» ili", "«Heydər Əliyev» ili", "«Nizami Gəncəvi» ili"]'::jsonb,
    '«Heydər Əliyev» ili',
    6,
    '57a8db46-2fcf-488e-b8ab-51cef40d7516'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'db55a9ac-4b03-4bb9-b86a-4db50f82280e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '«Ya başımızı verəcəyik, ya da Əsgəranı qoruyacağıq» fikirləri kimə məxsusdur?',
    'multiple_choice',
    '["Cavad bəy Şıxlinski", "Fətəli xan Xoyski", "Əhməd bəy Ağaoğlu", "Məhəmməd Əmin Rəsulzadə", "Əli bəy Hüseynzadə"]'::jsonb,
    'Cavad bəy Şıxlinski',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'da927f7a-d9d9-444a-9d91-8100cb57bdc2'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    '«Ya başımızı verəcəyik, ya da Əsgəranı qoruyacağıq» fikirləri kimə məxsusdur?',
    'multiple_choice',
    '["Cavad bəy Şıxlinski", "Fətəli xan Xoyski", "Əhməd bəy Ağaoğlu", "Məhəmməd Əmin Rəsulzadə", "Əli bəy Hüseynzadə"]'::jsonb,
    'Cavad bəy Şıxlinski',
    7,
    'db55a9ac-4b03-4bb9-b86a-4db50f82280e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '887c1cfc-bb5d-4b23-9452-23d2a1317b75'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qeyd edilənlərdən neçəsi vahid Almaniya imperiyasının ilk kansleri Otto fon Bismarkın kanslerliyi dövrünə aiddir?
– 1866-cı il Sadova döyüşündə Avstriyanın məğlub edilməsi
– Şimali Alman İttifaqının konstitusiyasının hazırlanması
– Almaniya imperiyasının ilk reyxs-kansleri vəzifəsini icra etməsi
– Austerlits döyüşündə Rusiya və Avstriyanı məğlub etməsi',
    'multiple_choice',
    '["1-i", "3-ü", "2-si", "4-ü", "Heç biri"]'::jsonb,
    '1-i',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd6cbc166-2620-4529-a84e-e71016a2f1d8'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Qeyd edilənlərdən neçəsi vahid Almaniya imperiyasının ilk kansleri Otto fon Bismarkın kanslerliyi dövrünə aiddir?
– 1866-cı il Sadova döyüşündə Avstriyanın məğlub edilməsi
– Şimali Alman İttifaqının konstitusiyasının hazırlanması
– Almaniya imperiyasının ilk reyxs-kansleri vəzifəsini icra etməsi
– Austerlits döyüşündə Rusiya və Avstriyanı məğlub etməsi',
    'multiple_choice',
    '["1-i", "3-ü", "2-si", "4-ü", "Heç biri"]'::jsonb,
    '1-i',
    8,
    '887c1cfc-bb5d-4b23-9452-23d2a1317b75'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9a7922c7-bbf4-4599-99bd-96326004291e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '2023-cü il 19–20 sentyabr lokal xarakterli antiterror əməliyyatı nəticəsində:',
    'multiple_choice',
    '["Xankəndi, Xocalı, Kəlbəcər, Ağdərə şəhərləri eyni gündə azad edildi", "Azərbaycan Respublikası Qarabağ iqtisadi rayonu üzərində öz dövlət suverenliyini tamamilə bərpa etdi", "Qırxqız və Sarıbaba yüksəklikləri ilk dəfə nəzarətə götürüldü", "Laçın, Kəlbəcər, Ağdam rayonları üçtərəfli bəyanatla təhvil verildi", "Azərbaycan Ordusu Aprel döyüşlərində mənəvi-psixoloji üstünlük qazandı"]'::jsonb,
    'Azərbaycan Respublikası Qarabağ iqtisadi rayonu üzərində öz dövlət suverenliyini tamamilə bərpa etdi',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'cb79a430-7547-4d2d-92a0-2ce4e5f51b83'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    '2023-cü il 19–20 sentyabr lokal xarakterli antiterror əməliyyatı nəticəsində:',
    'multiple_choice',
    '["Xankəndi, Xocalı, Kəlbəcər, Ağdərə şəhərləri eyni gündə azad edildi", "Azərbaycan Respublikası Qarabağ iqtisadi rayonu üzərində öz dövlət suverenliyini tamamilə bərpa etdi", "Qırxqız və Sarıbaba yüksəklikləri ilk dəfə nəzarətə götürüldü", "Laçın, Kəlbəcər, Ağdam rayonları üçtərəfli bəyanatla təhvil verildi", "Azərbaycan Ordusu Aprel döyüşlərində mənəvi-psixoloji üstünlük qazandı"]'::jsonb,
    'Azərbaycan Respublikası Qarabağ iqtisadi rayonu üzərində öz dövlət suverenliyini tamamilə bərpa etdi',
    9,
    '9a7922c7-bbf4-4599-99bd-96326004291e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '77dc2369-aa78-4cf2-bf7e-8f0e2dd7e12b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hadisələrin düzgün xronoloji ardıcıllığını müəyyən edin:
1. Türkdilli Dövlətlərin Əməkdaşlıq Şurasının (Naxçıvan sazişi) yaradılması (2009)
2. Şuşada «Qarabağ bəyannaməsi»nin imzalanması (2024)
3. Türk Şurasının Türk Dövlətləri Təşkilatı adlandırılması (noyabr 2021)
4. Şuşa Bəyannaməsinin imzalanması (iyun 2021)',
    'multiple_choice',
    '["1, 2, 3, 4", "1, 4, 3, 2", "1, 2, 4, 3", "4, 3, 2, 1", "1, 3, 4, 2"]'::jsonb,
    '1, 4, 3, 2',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0194a430-a15a-4d7e-ab35-13f60119eaa0'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Hadisələrin düzgün xronoloji ardıcıllığını müəyyən edin:
1. Türkdilli Dövlətlərin Əməkdaşlıq Şurasının (Naxçıvan sazişi) yaradılması (2009)
2. Şuşada «Qarabağ bəyannaməsi»nin imzalanması (2024)
3. Türk Şurasının Türk Dövlətləri Təşkilatı adlandırılması (noyabr 2021)
4. Şuşa Bəyannaməsinin imzalanması (iyun 2021)',
    'multiple_choice',
    '["1, 2, 3, 4", "1, 4, 3, 2", "1, 2, 4, 3", "4, 3, 2, 1", "1, 3, 4, 2"]'::jsonb,
    '1, 4, 3, 2',
    10,
    '77dc2369-aa78-4cf2-bf7e-8f0e2dd7e12b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4ccb20bb-2ce4-485e-bb06-011e83058659'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '1815-ci ildə yaradılmış «Müqəddəs İttifaq»da əsas rol oynamış dövlətləri müəyyən edin:
1. Avstriya   2. Osmanlı   3. Prussiya   4. Rusiya   5. İngiltərə',
    'multiple_choice',
    '["1, 3, 5", "1, 3, 4", "1, 2, 4", "3, 4, 5", "2, 4, 5"]'::jsonb,
    '1, 3, 4',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd5912e59-1483-4566-85ca-506e7a4d3679'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    '1815-ci ildə yaradılmış «Müqəddəs İttifaq»da əsas rol oynamış dövlətləri müəyyən edin:
1. Avstriya   2. Osmanlı   3. Prussiya   4. Rusiya   5. İngiltərə',
    'multiple_choice',
    '["1, 3, 5", "1, 3, 4", "1, 2, 4", "3, 4, 5", "2, 4, 5"]'::jsonb,
    '1, 3, 4',
    11,
    '4ccb20bb-2ce4-485e-bb06-011e83058659'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '11da471e-0b64-455c-bf09-19db149e57c0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XIX yüzilliyin ortalarında Mərkəzi Asiya hansı dövlətlərin rəqabət meydanına çevrilmişdi?
1. Fransa   2. Rusiya   3. Osmanlı   4. Almaniya   5. İngiltərə',
    'multiple_choice',
    '["1, 2", "1, 4", "2, 5", "1, 2, 5", "3, 4"]'::jsonb,
    '2, 5',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_tar_q12.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6ea2cbfb-9bff-443c-8469-6b9a40678d6a'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'XIX yüzilliyin ortalarında Mərkəzi Asiya hansı dövlətlərin rəqabət meydanına çevrilmişdi?
1. Fransa   2. Rusiya   3. Osmanlı   4. Almaniya   5. İngiltərə',
    'multiple_choice',
    '["1, 2", "1, 4", "2, 5", "1, 2, 5", "3, 4"]'::jsonb,
    '2, 5',
    12,
    '11da471e-0b64-455c-bf09-19db149e57c0'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_tar_q12.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f4d51adb-8a5b-4655-a5cc-f78083a4163a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hökmdarlara aid uyğunluğu müəyyən edin:
1. Uzun Həsən
2. Qara Yusif
3. Cahanşah
a. 1461-ci ildə Trabzon imperiyası üzərinə yürüş etdi
b. Malatya yaxınlığında Osmanlı qüvvələrini məğlub etdi
c. XV əsrin 50-ci illərində İranın mərkəzi və şərq əyalətlərini tutdu
d. Teymuri qüvvələrini Azərbaycandan qovdu
e. Güclü nizami qoşun yaratdı, feodal ara müharibələrini bir qədər zəiflətdi',
    'multiple_choice',
    '["1-c; 2-b; 3-a", "1-a, b; 2-c; 3-d", "1-a; 2-d; 3-e", "1-b; 2-d, e; 3-c", "1-b; 2-d; 3-c"]'::jsonb,
    '1-b; 2-d; 3-c',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'dcddac57-7ae5-402a-8bbe-8fa1826f3ec5'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Hökmdarlara aid uyğunluğu müəyyən edin:
1. Uzun Həsən
2. Qara Yusif
3. Cahanşah
a. 1461-ci ildə Trabzon imperiyası üzərinə yürüş etdi
b. Malatya yaxınlığında Osmanlı qüvvələrini məğlub etdi
c. XV əsrin 50-ci illərində İranın mərkəzi və şərq əyalətlərini tutdu
d. Teymuri qüvvələrini Azərbaycandan qovdu
e. Güclü nizami qoşun yaratdı, feodal ara müharibələrini bir qədər zəiflətdi',
    'multiple_choice',
    '["1-c; 2-b; 3-a", "1-a, b; 2-c; 3-d", "1-a; 2-d; 3-e", "1-b; 2-d, e; 3-c", "1-b; 2-d; 3-c"]'::jsonb,
    '1-b; 2-d; 3-c',
    13,
    'f4d51adb-8a5b-4655-a5cc-f78083a4163a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ed373969-2c8f-4a0d-adcb-fbf83cfd70fd'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Osmanlı imperiyasının Avropadakı geniş ərazilərdə hakimiyyəti əsasən başa çatdı:',
    'multiple_choice',
    '["Krım müharibəsi nəticəsində", "Yüzillik müharibə nəticəsində", "Ədirnə sülhü ilə", "Durğunluq dövründə", "Balkan müharibələri nəticəsində"]'::jsonb,
    'Balkan müharibələri nəticəsində',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e15362a2-992b-4b0a-8f63-9d4b3efdbc17'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Osmanlı imperiyasının Avropadakı geniş ərazilərdə hakimiyyəti əsasən başa çatdı:',
    'multiple_choice',
    '["Krım müharibəsi nəticəsində", "Yüzillik müharibə nəticəsində", "Ədirnə sülhü ilə", "Durğunluq dövründə", "Balkan müharibələri nəticəsində"]'::jsonb,
    'Balkan müharibələri nəticəsində',
    14,
    'ed373969-2c8f-4a0d-adcb-fbf83cfd70fd'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd08b5030-e46a-4511-8e29-ccf694aa9e61'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qeyd edilənlər aiddir:
«Rəsmlərində realizm əlamətləri müşahidə olunurdu, bədii tikmə ustası, xəttat və rəssam idi, şeirlərinin əlyazmalarından ibarət albomunda (Bəyaz) 80-ə yaxın rəsm vardır.»',
    'multiple_choice',
    '["Xurşidbanu Natəvan", "Zeynalabdin Marağayi", "Mirzə Qədim İrəvani", "Məhsəti Gəncəvi", "Seyid Əzim Şirvani"]'::jsonb,
    'Xurşidbanu Natəvan',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd4be42f7-9177-4daf-a8bb-011db25d58ee'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Qeyd edilənlər aiddir:
«Rəsmlərində realizm əlamətləri müşahidə olunurdu, bədii tikmə ustası, xəttat və rəssam idi, şeirlərinin əlyazmalarından ibarət albomunda (Bəyaz) 80-ə yaxın rəsm vardır.»',
    'multiple_choice',
    '["Xurşidbanu Natəvan", "Zeynalabdin Marağayi", "Mirzə Qədim İrəvani", "Məhsəti Gəncəvi", "Seyid Əzim Şirvani"]'::jsonb,
    'Xurşidbanu Natəvan',
    15,
    'd08b5030-e46a-4511-8e29-ccf694aa9e61'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2418a8ae-9f00-4100-9205-ede3a3a8692d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İkinci Rusiya–Qacar müharibəsi (1826–1828) dövründə:',
    'multiple_choice',
    '["Rusiya Yermolovun başçılığı ilə Qacar sarayına ilk diplomatik nümayəndə heyəti göndərdi", "Aslandüz yaxınlığında ruslar məğlub edildi", "Qafqazın baş hakimi vəzifəsində Yermolovu general İvan Paskeviç əvəz etdi", "Gülüstan müqaviləsi imzalandı", "Lənkəran xanlığında komendant idarə üsulu yaradıldı"]'::jsonb,
    'Qafqazın baş hakimi vəzifəsində Yermolovu general İvan Paskeviç əvəz etdi',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7c6dfbc0-2f8c-4a67-86cc-acf7a55d71e0'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'İkinci Rusiya–Qacar müharibəsi (1826–1828) dövründə:',
    'multiple_choice',
    '["Rusiya Yermolovun başçılığı ilə Qacar sarayına ilk diplomatik nümayəndə heyəti göndərdi", "Aslandüz yaxınlığında ruslar məğlub edildi", "Qafqazın baş hakimi vəzifəsində Yermolovu general İvan Paskeviç əvəz etdi", "Gülüstan müqaviləsi imzalandı", "Lənkəran xanlığında komendant idarə üsulu yaradıldı"]'::jsonb,
    'Qafqazın baş hakimi vəzifəsində Yermolovu general İvan Paskeviç əvəz etdi',
    16,
    '2418a8ae-9f00-4100-9205-ede3a3a8692d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3a99d587-b5a7-4a56-8de6-a38ae5fbb788'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '2020-ci ilin 10 noyabr tarixli üçtərəfli Bəyanata əsasən bir güllə belə atılmadan siyasi-diplomatik yolla işğaldan azad edilmiş rayonlarımızı müəyyən edin:
1. Füzuli   2. Cəbrayıl   3. Zəngilan   4. Ağdam   5. Kəlbəcər   6. Laçın',
    'multiple_choice',
    '["4, 5", "4, 5, 6", "3, 4, 5", "5, 6", "Yalnız 4"]'::jsonb,
    '4, 5, 6',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_tar_q17.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'efe9c69f-97d1-4611-8026-79979ed5c075'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    '2020-ci ilin 10 noyabr tarixli üçtərəfli Bəyanata əsasən bir güllə belə atılmadan siyasi-diplomatik yolla işğaldan azad edilmiş rayonlarımızı müəyyən edin:
1. Füzuli   2. Cəbrayıl   3. Zəngilan   4. Ağdam   5. Kəlbəcər   6. Laçın',
    'multiple_choice',
    '["4, 5", "4, 5, 6", "3, 4, 5", "5, 6", "Yalnız 4"]'::jsonb,
    '4, 5, 6',
    17,
    '3a99d587-b5a7-4a56-8de6-a38ae5fbb788'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/ayq_tar_q17.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e4a70767-32b5-4281-bcab-42f005e5526a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XIX əsrdə Şimali Azərbaycanda daha əvvəl baş vermişdir:',
    'multiple_choice',
    '["İlk neft kəmərinin çəkilməsi (1878)", "«Simens qardaşları» şirkəti tərəfindən Qalakənd zavodunun inşa edilməsi (1883)", "Şəkidə Xanabad ipək fabrikinin açılması (1829)", "Gədəbəydə misəritmə zavodunun tikilməsi (1865)", "Bakı–Tiflis dəmir yolu xəttinin işə salınması (1883)"]'::jsonb,
    'Şəkidə Xanabad ipək fabrikinin açılması (1829)',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd8464d05-0d8d-4197-8f16-47c340288359'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'XIX əsrdə Şimali Azərbaycanda daha əvvəl baş vermişdir:',
    'multiple_choice',
    '["İlk neft kəmərinin çəkilməsi (1878)", "«Simens qardaşları» şirkəti tərəfindən Qalakənd zavodunun inşa edilməsi (1883)", "Şəkidə Xanabad ipək fabrikinin açılması (1829)", "Gədəbəydə misəritmə zavodunun tikilməsi (1865)", "Bakı–Tiflis dəmir yolu xəttinin işə salınması (1883)"]'::jsonb,
    'Şəkidə Xanabad ipək fabrikinin açılması (1829)',
    18,
    'e4a70767-32b5-4281-bcab-42f005e5526a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ccfbfd60-6ff5-45ba-bcdd-868a75cf2529'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qeyd edilənlərdən neçəsi Səlcuq sultanıdır?
1. I Osman   2. Orxan Qazi   3. II Bəyazid   4. I Toğrul   5. II Murad   6. Məlikşah',
    'multiple_choice',
    '["1-i", "3-ü", "4-ü", "2-si", "5-i"]'::jsonb,
    '2-si',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e3b25543-8060-472e-8336-da9bda065281'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Qeyd edilənlərdən neçəsi Səlcuq sultanıdır?
1. I Osman   2. Orxan Qazi   3. II Bəyazid   4. I Toğrul   5. II Murad   6. Məlikşah',
    'multiple_choice',
    '["1-i", "3-ü", "4-ü", "2-si", "5-i"]'::jsonb,
    '2-si',
    19,
    'ccfbfd60-6ff5-45ba-bcdd-868a75cf2529'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '815563b9-edb6-432e-9c32-cae64f683a6d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Atropatena və Albaniya dövlətləri arasında oxşar cəhəti müəyyən edin:
1. Ərazisində ən qədim yerli pullar Makedoniyalı İsgəndərin pullarına bənzədilərək kəsilmişdir
2. Əhəməni dövlətinin hücumuna məruz qalmışdılar
3. İqtisadiyyatın bütün sahələrində yalnız qul əməyindən istifadə olunurdu
4. Roma sərkərdəsi Antoni tərəfindən tamamilə ləğv edilmişdilər
5. Əhalisi Sasanilərə gezit (can vergisi) ödəyirdi',
    'multiple_choice',
    '["Yalnız 5", "2, 3", "1, 5", "Yalnız 1", "1, 3, 5"]'::jsonb,
    'Yalnız 1',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e6ff256a-7c6a-40e2-9231-2347c5fa5c82'::uuid,
    '13c9f2a0-b0cb-4f35-918b-8c61e1dada03'::uuid,
    'Atropatena və Albaniya dövlətləri arasında oxşar cəhəti müəyyən edin:
1. Ərazisində ən qədim yerli pullar Makedoniyalı İsgəndərin pullarına bənzədilərək kəsilmişdir
2. Əhəməni dövlətinin hücumuna məruz qalmışdılar
3. İqtisadiyyatın bütün sahələrində yalnız qul əməyindən istifadə olunurdu
4. Roma sərkərdəsi Antoni tərəfindən tamamilə ləğv edilmişdilər
5. Əhalisi Sasanilərə gezit (can vergisi) ödəyirdi',
    'multiple_choice',
    '["Yalnız 5", "2, 3", "1, 5", "Yalnız 1", "1, 3, 5"]'::jsonb,
    'Yalnız 1',
    20,
    '815563b9-edb6-432e-9c32-cae64f683a6d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Coğrafiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final) (Coğrafiya - AYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Coğrafiya (AYQ / VIII-IX) — Zəfər Olimpiadası (Final)',
    'AYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Coğrafiya fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Coğrafiya',
    'AYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '338955',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cde7cf43-2772-458c-a475-2e659455282b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Doğru olmayan fikirləri müəyyən edin:
1. Codyarpaqlı meşə və kolluqlar təbii zonasına yalnız mülayim işıqlanma qurşağında rast gəlinir.
2. Saxalin adası və Kamçatka yarımadasında iynəyarpaqlı meşələr təbii zonası yayılmışdır.
3. Anhel şəlaləsi və Marakaybo gölü eyni ölkənin ərazisində yerləşir.
4. Amur çayının sutoplayıcı hövzəsi Alp qırışıqlığı zonasında yerləşir.
5. Malakka və Koreya yarımadaları geosinklinalda yerləşir.
6. Yeni Zelandiya adaları litosfer tavalarının divergent sərhədində yerləşir.',
    'multiple_choice',
    '["1, 5, 6", "1, 2, 3", "3, 4, 5", "4, 5, 6", "2, 4, 6"]'::jsonb,
    '4, 5, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '418fb638-3b1f-4fd4-a1a8-e1af626cd397'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Doğru olmayan fikirləri müəyyən edin:
1. Codyarpaqlı meşə və kolluqlar təbii zonasına yalnız mülayim işıqlanma qurşağında rast gəlinir.
2. Saxalin adası və Kamçatka yarımadasında iynəyarpaqlı meşələr təbii zonası yayılmışdır.
3. Anhel şəlaləsi və Marakaybo gölü eyni ölkənin ərazisində yerləşir.
4. Amur çayının sutoplayıcı hövzəsi Alp qırışıqlığı zonasında yerləşir.
5. Malakka və Koreya yarımadaları geosinklinalda yerləşir.
6. Yeni Zelandiya adaları litosfer tavalarının divergent sərhədində yerləşir.',
    'multiple_choice',
    '["1, 5, 6", "1, 2, 3", "3, 4, 5", "4, 5, 6", "2, 4, 6"]'::jsonb,
    '4, 5, 6',
    1,
    'cde7cf43-2772-458c-a475-2e659455282b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '79d76cce-e6d3-4a9e-9380-317fe5e5c4bf'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Doğru olmayan fikirləri müəyyən edin:
1. Lena çayının mənsəb forması deltadır.
2. Sarı, Qara, Qırmızı və Oxot daxili dəniz hesab edilir.
3. Assal gölü Cənub yarımkürəsində yerləşir.
4. Urmiya gölü axarsızdır.
5. Saqqızağacı və dəmirağac (azat ağacı) relikt bitki hesab edilir.
6. Həkəri çayının mənbəyi Qarabağ silsiləsinin şərq yamacındadır.',
    'multiple_choice',
    '["2, 4, 6", "1, 3, 5", "2, 3, 6", "1, 5, 6", "2, 3, 4"]'::jsonb,
    '2, 3, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '29795213-058a-4bed-8425-3fde666bfd7f'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Doğru olmayan fikirləri müəyyən edin:
1. Lena çayının mənsəb forması deltadır.
2. Sarı, Qara, Qırmızı və Oxot daxili dəniz hesab edilir.
3. Assal gölü Cənub yarımkürəsində yerləşir.
4. Urmiya gölü axarsızdır.
5. Saqqızağacı və dəmirağac (azat ağacı) relikt bitki hesab edilir.
6. Həkəri çayının mənbəyi Qarabağ silsiləsinin şərq yamacındadır.',
    'multiple_choice',
    '["2, 4, 6", "1, 3, 5", "2, 3, 6", "1, 5, 6", "2, 3, 4"]'::jsonb,
    '2, 3, 6',
    2,
    '79d76cce-e6d3-4a9e-9380-317fe5e5c4bf'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '829cfa8e-04eb-4c48-ba91-9f80f12db94d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Uyğunluğu müəyyən edin:
I. Böyük Qafqaz dağları
II. Kiçik Qafqaz dağları
a. Nialdağ silsiləsi yerləşir.
b. Dəmir filizi yataqları mövcuddur.
c. Xocaşen silsiləsi yerləşir.
d. Tufandağ zirvəsi yerləşir.
e. Çayların bir qismi Araz hövzəsinə aiddir.',
    'multiple_choice',
    '["I-a, b; II-d, c, e", "I-b, d; II-c, e", "I-a, d; II-b, e", "I-a, d; II-b, c, e", "I-c, d; II-a, b"]'::jsonb,
    'I-a, d; II-b, e',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd446fa7b-7f15-4249-afe6-1cfe83e9e563'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Uyğunluğu müəyyən edin:
I. Böyük Qafqaz dağları
II. Kiçik Qafqaz dağları
a. Nialdağ silsiləsi yerləşir.
b. Dəmir filizi yataqları mövcuddur.
c. Xocaşen silsiləsi yerləşir.
d. Tufandağ zirvəsi yerləşir.
e. Çayların bir qismi Araz hövzəsinə aiddir.',
    'multiple_choice',
    '["I-a, b; II-d, c, e", "I-b, d; II-c, e", "I-a, d; II-b, e", "I-a, d; II-b, c, e", "I-c, d; II-a, b"]'::jsonb,
    'I-a, d; II-b, e',
    3,
    '829cfa8e-04eb-4c48-ba91-9f80f12db94d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f95b81e1-0b91-422c-9fda-ffc1bf10ca10'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Filippin arxipelaqı üçün doğru fikirləri müəyyən edin:
1. Ən böyük adaları Luson və Mindanaodur.
2. İki iqlim qurşağında yerləşir.
3. Unitar inzibati-ərazi quruluşuna malik olan ölkənin ərazisidir.
4. Ölkəmizdən şimal-şərqdə yerləşir.
5. Ən böyük adası Şimal tropik xətti ilə kəsişir.
6. Sahillərini iki okean suları yuyur.',
    'multiple_choice',
    '["1, 3, 5", "2, 4, 6", "4, 5, 6", "1, 2, 3", "2, 3, 5"]'::jsonb,
    '1, 2, 3',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '9f1353d5-a6b2-4fe0-a178-9b915be12218'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Filippin arxipelaqı üçün doğru fikirləri müəyyən edin:
1. Ən böyük adaları Luson və Mindanaodur.
2. İki iqlim qurşağında yerləşir.
3. Unitar inzibati-ərazi quruluşuna malik olan ölkənin ərazisidir.
4. Ölkəmizdən şimal-şərqdə yerləşir.
5. Ən böyük adası Şimal tropik xətti ilə kəsişir.
6. Sahillərini iki okean suları yuyur.',
    'multiple_choice',
    '["1, 3, 5", "2, 4, 6", "4, 5, 6", "1, 2, 3", "2, 3, 5"]'::jsonb,
    '1, 2, 3',
    4,
    'f95b81e1-0b91-422c-9fda-ffc1bf10ca10'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd0ff22ea-d763-40ba-a4fb-dc8145872b18'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Adalararası dənizləri seçin:
1. Baffin
2. Sarqass
3. Banda
4. Mərcan
5. Yava
6. Andaman',
    'multiple_choice',
    '["2, 4, 6", "1, 3, 5", "3, 4, 5", "1, 2, 3", "3, 5, 6"]'::jsonb,
    '1, 3, 5',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6b79a590-ce83-41b2-a08e-153bc573fa4e'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Adalararası dənizləri seçin:
1. Baffin
2. Sarqass
3. Banda
4. Mərcan
5. Yava
6. Andaman',
    'multiple_choice',
    '["2, 4, 6", "1, 3, 5", "3, 4, 5", "1, 2, 3", "3, 5, 6"]'::jsonb,
    '1, 3, 5',
    5,
    'd0ff22ea-d763-40ba-a4fb-dc8145872b18'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '434cfd7c-6cae-4204-aa1d-b73d979b26e9'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Eyni təbii zonanın rast gəlindiyi yarımadaları müəyyən edin:',
    'multiple_choice',
    '["Taymır, Labrador, Yutlandiya", "Florida, Yukatan, Bretan", "Arnemlend, Somali, Hindistan", "Pireney, Apennin, Koreya", "Kamçatka, Keyp-York, Alyaska"]'::jsonb,
    'Arnemlend, Somali, Hindistan',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '04482622-3b88-4935-a544-313af4e2f356'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Eyni təbii zonanın rast gəlindiyi yarımadaları müəyyən edin:',
    'multiple_choice',
    '["Taymır, Labrador, Yutlandiya", "Florida, Yukatan, Bretan", "Arnemlend, Somali, Hindistan", "Pireney, Apennin, Koreya", "Kamçatka, Keyp-York, Alyaska"]'::jsonb,
    'Arnemlend, Somali, Hindistan',
    6,
    '434cfd7c-6cae-4204-aa1d-b73d979b26e9'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '980bdd93-b7b1-4106-aeee-46a1206a5961'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıdakı əlamətləri nəzərə alaraq, doğru fikri müəyyən edin:
– Şimali Amerika materikində rast gəlinir.
– Ölkəmizdə rast gəlinmir.
– Avstraliya materikinin şimal sahillərində yayılmışdır.',
    'multiple_choice',
    '["Səhra təbii zonasıdır və ən çox Afrika materikində yayılıb.", "Çöl təbii zonasıdır və ən çox Avrasiya materikində yayılıb.", "Aralıq dənizi iqlim tipidir və ən çox Avropa qitəsində yayılıb.", "Musson iqlim tipidir və ən çox Avrasiya materikində yayılıb.", "Savanna və seyrək meşələr təbii zonasıdır, əsasən tropik və subekvatorial iqlim qurşağında yaranır."]'::jsonb,
    'Savanna və seyrək meşələr təbii zonasıdır, əsasən tropik və subekvatorial iqlim qurşağında yaranır.',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '64efd937-e153-451f-aa21-02eaadd6d036'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Aşağıdakı əlamətləri nəzərə alaraq, doğru fikri müəyyən edin:
– Şimali Amerika materikində rast gəlinir.
– Ölkəmizdə rast gəlinmir.
– Avstraliya materikinin şimal sahillərində yayılmışdır.',
    'multiple_choice',
    '["Səhra təbii zonasıdır və ən çox Afrika materikində yayılıb.", "Çöl təbii zonasıdır və ən çox Avrasiya materikində yayılıb.", "Aralıq dənizi iqlim tipidir və ən çox Avropa qitəsində yayılıb.", "Musson iqlim tipidir və ən çox Avrasiya materikində yayılıb.", "Savanna və seyrək meşələr təbii zonasıdır, əsasən tropik və subekvatorial iqlim qurşağında yaranır."]'::jsonb,
    'Savanna və seyrək meşələr təbii zonasıdır, əsasən tropik və subekvatorial iqlim qurşağında yaranır.',
    7,
    '980bdd93-b7b1-4106-aeee-46a1206a5961'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0ceef835-25ec-4f82-93ad-f4fafcbda222'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Eyni iqlim qurşağında yerləşən coğrafi obyektlər:',
    'multiple_choice',
    '["Baltik, Berinq və Karib dənizləri", "Kalimantan, Sulavesi və Kuba adaları", "Appalaç, Karpat və Əndəlüs dağları", "Biskay, Şelixov və Siam körfəzləri", "Kamçatka, Alyaska və Yutlandiya yarımadaları"]'::jsonb,
    'Kamçatka, Alyaska və Yutlandiya yarımadaları',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5bc18848-e0e2-4ac0-99fa-03650933b896'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Eyni iqlim qurşağında yerləşən coğrafi obyektlər:',
    'multiple_choice',
    '["Baltik, Berinq və Karib dənizləri", "Kalimantan, Sulavesi və Kuba adaları", "Appalaç, Karpat və Əndəlüs dağları", "Biskay, Şelixov və Siam körfəzləri", "Kamçatka, Alyaska və Yutlandiya yarımadaları"]'::jsonb,
    'Kamçatka, Alyaska və Yutlandiya yarımadaları',
    8,
    '0ceef835-25ec-4f82-93ad-f4fafcbda222'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9d63a929-9e1f-4b5f-aef1-2df4d5276695'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Mərkəzi Asiya hidroqrafiyası ilə bağlı düzgün olmayan fikri müəyyən edin:',
    'multiple_choice',
    '["Balxaş və İssık-Kul gölləri daxili axarsız hövzəyə aiddir.", "Aral gölü iki ölkənin ərazisində yerləşir.", "Amudərya və Sırdərya çayları yay aylarında bolsulu olur.", "Aral gölünün yerləşdiyi ərazi səhra və yarımsəhra təbii zonasıdır.", "Qaraqum suvarma kanalı Sırdərya çayından başlayır."]'::jsonb,
    'Qaraqum suvarma kanalı Sırdərya çayından başlayır.',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6e0f3c84-fdf5-447b-b8d3-a3372aae01ac'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Mərkəzi Asiya hidroqrafiyası ilə bağlı düzgün olmayan fikri müəyyən edin:',
    'multiple_choice',
    '["Balxaş və İssık-Kul gölləri daxili axarsız hövzəyə aiddir.", "Aral gölü iki ölkənin ərazisində yerləşir.", "Amudərya və Sırdərya çayları yay aylarında bolsulu olur.", "Aral gölünün yerləşdiyi ərazi səhra və yarımsəhra təbii zonasıdır.", "Qaraqum suvarma kanalı Sırdərya çayından başlayır."]'::jsonb,
    'Qaraqum suvarma kanalı Sırdərya çayından başlayır.',
    9,
    '9d63a929-9e1f-4b5f-aef1-2df4d5276695'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '650a38bf-cf65-4315-aaea-1b608e271d2c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Siyasi coğrafiya ilə bağlı doğru olmayan bəndi seçin:',
    'multiple_choice',
    '["Oman və Bruney mütləq monarxiyalı dövlətlərdir.", "Respublikalarda dövlət başçıları seçki yolu ilə müəyyən olunur.", "Əhalisi 100 milyon nəfərdən artıq olan dövlətlərin sırasında İndoneziya və Yaponiya da var.", "Ruhani zümrənin hakimiyyəti teokratiya adlanır.", "Bütün «cırtdan» dövlətlər yalnız Avropada yerləşir və federativ quruluşa malikdir."]'::jsonb,
    'Bütün «cırtdan» dövlətlər yalnız Avropada yerləşir və federativ quruluşa malikdir.',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '86f8ee64-80ca-4a50-8540-81cd1418f8b1'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Siyasi coğrafiya ilə bağlı doğru olmayan bəndi seçin:',
    'multiple_choice',
    '["Oman və Bruney mütləq monarxiyalı dövlətlərdir.", "Respublikalarda dövlət başçıları seçki yolu ilə müəyyən olunur.", "Əhalisi 100 milyon nəfərdən artıq olan dövlətlərin sırasında İndoneziya və Yaponiya da var.", "Ruhani zümrənin hakimiyyəti teokratiya adlanır.", "Bütün «cırtdan» dövlətlər yalnız Avropada yerləşir və federativ quruluşa malikdir."]'::jsonb,
    'Bütün «cırtdan» dövlətlər yalnız Avropada yerləşir və federativ quruluşa malikdir.',
    10,
    '650a38bf-cf65-4315-aaea-1b608e271d2c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a58c17d5-1ea0-4cd1-bd6f-a323649f0043'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cənubi Amerika hidroqrafiyası ilə bağlı doğru olmayan fikirləri müəyyən edin:
1. Amazon çayının sutoplayıcı hövzəsində SES-lər mövcuddur.
2. Parana çayının mənsəbində Manaus limanı yerləşir.
3. Amazon çayının ən uzun sol qolu Tapajos çayıdır.
4. Anhel şəlaləsi Çurun çayı üzərində (Orinoko hövzəsində) yerləşir.
5. Marakaybo gölü Venesuelada yerləşir.
6. Amazon çayının başlanğıcı Rio-Neqru və Maranyon çaylarının birləşdiyi ərazi hesab edilir.',
    'multiple_choice',
    '["2, 3, 6", "1, 2, 4", "4, 5, 6", "1, 2, 3", "1, 4, 5"]'::jsonb,
    '2, 3, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c20f227f-659e-44dd-82df-7b72fed15174'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Cənubi Amerika hidroqrafiyası ilə bağlı doğru olmayan fikirləri müəyyən edin:
1. Amazon çayının sutoplayıcı hövzəsində SES-lər mövcuddur.
2. Parana çayının mənsəbində Manaus limanı yerləşir.
3. Amazon çayının ən uzun sol qolu Tapajos çayıdır.
4. Anhel şəlaləsi Çurun çayı üzərində (Orinoko hövzəsində) yerləşir.
5. Marakaybo gölü Venesuelada yerləşir.
6. Amazon çayının başlanğıcı Rio-Neqru və Maranyon çaylarının birləşdiyi ərazi hesab edilir.',
    'multiple_choice',
    '["2, 3, 6", "1, 2, 4", "4, 5, 6", "1, 2, 3", "1, 4, 5"]'::jsonb,
    '2, 3, 6',
    11,
    'a58c17d5-1ea0-4cd1-bd6f-a323649f0043'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b25416d9-db8d-40df-865b-1d0ed6d825ff'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Yalnız adalarda yerləşən vulkanları müəyyən edin:',
    'multiple_choice',
    '["Etna, Aso, Klyuçi Sopkası", "Krakatau, Fudziyama, Orisaba", "Hekla, Pinatubo, Popokatepetl", "Fudziyama, Bardarbunqa, Montan-Pele", "Ruapexu, Eyyafyatlayokudl, Kotopaxi"]'::jsonb,
    'Fudziyama, Bardarbunqa, Montan-Pele',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0864302a-847a-4572-bbd9-ce0a0d766fed'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Yalnız adalarda yerləşən vulkanları müəyyən edin:',
    'multiple_choice',
    '["Etna, Aso, Klyuçi Sopkası", "Krakatau, Fudziyama, Orisaba", "Hekla, Pinatubo, Popokatepetl", "Fudziyama, Bardarbunqa, Montan-Pele", "Ruapexu, Eyyafyatlayokudl, Kotopaxi"]'::jsonb,
    'Fudziyama, Bardarbunqa, Montan-Pele',
    12,
    'b25416d9-db8d-40df-865b-1d0ed6d825ff'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3e53906c-0667-4a9b-bfc2-9b8aad367f52'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Syerra-Madre dağlarının yerləşdiyi ölkə:',
    'multiple_choice',
    '["Portuqaliya", "ABŞ", "Kolumbiya", "İspaniya", "Meksika"]'::jsonb,
    'Meksika',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8fbc28dd-4f9c-4a3a-b675-b06e3aca086d'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Syerra-Madre dağlarının yerləşdiyi ölkə:',
    'multiple_choice',
    '["Portuqaliya", "ABŞ", "Kolumbiya", "İspaniya", "Meksika"]'::jsonb,
    'Meksika',
    13,
    '3e53906c-0667-4a9b-bfc2-9b8aad367f52'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8ec5bcc1-dfca-4740-89be-c03b1384d70e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Təsərrüfat modelində xidmət sahələrinin üstünlük təşkil etdiyi inkişaf etmiş ölkələri seçin:',
    'multiple_choice',
    '["Danimarka, Niderland, Norveç, İordaniya", "ABŞ, Almaniya, Kanada, Nigeriya", "Fransa, Yaponiya, İtaliya, Belçika", "İsveç, Almaniya, İsveçrə, Anqola", "Yaponiya, Belçika, Böyük Britaniya, Banqladeş"]'::jsonb,
    'Fransa, Yaponiya, İtaliya, Belçika',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e1c35174-f24a-47bf-8f55-5ca76eadaa5c'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Təsərrüfat modelində xidmət sahələrinin üstünlük təşkil etdiyi inkişaf etmiş ölkələri seçin:',
    'multiple_choice',
    '["Danimarka, Niderland, Norveç, İordaniya", "ABŞ, Almaniya, Kanada, Nigeriya", "Fransa, Yaponiya, İtaliya, Belçika", "İsveç, Almaniya, İsveçrə, Anqola", "Yaponiya, Belçika, Böyük Britaniya, Banqladeş"]'::jsonb,
    'Fransa, Yaponiya, İtaliya, Belçika',
    14,
    '8ec5bcc1-dfca-4740-89be-c03b1384d70e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f9c844c9-6608-4ca6-bc71-245779f7663d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Rio-Qrande çayının eroziya bazisini (töküldüyü su hövzəsini) müəyyən edin:',
    'multiple_choice',
    '["Meksika körfəzi", "Hudzon körfəzi", "Müqəddəs Lavrenti körfəzi", "Böyük Kölə gölü", "Kaliforniya körfəzi"]'::jsonb,
    'Meksika körfəzi',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '109842f3-6e5a-4419-ad24-c99268d77dd5'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Rio-Qrande çayının eroziya bazisini (töküldüyü su hövzəsini) müəyyən edin:',
    'multiple_choice',
    '["Meksika körfəzi", "Hudzon körfəzi", "Müqəddəs Lavrenti körfəzi", "Böyük Kölə gölü", "Kaliforniya körfəzi"]'::jsonb,
    'Meksika körfəzi',
    15,
    'f9c844c9-6608-4ca6-bc71-245779f7663d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '70809da7-964d-4037-a2eb-fed4c0ec1110'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Amudərya çayının mənbəyi yerləşir:',
    'multiple_choice',
    '["Tyan-Şan dağlarında", "Himalay dağlarında", "Altay dağlarında", "Pamir (və Hindquş) dağlarında", "Qafqaz dağlarında"]'::jsonb,
    'Pamir (və Hindquş) dağlarında',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '14f65932-d132-424a-a178-321d9ffd448f'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Amudərya çayının mənbəyi yerləşir:',
    'multiple_choice',
    '["Tyan-Şan dağlarında", "Himalay dağlarında", "Altay dağlarında", "Pamir (və Hindquş) dağlarında", "Qafqaz dağlarında"]'::jsonb,
    'Pamir (və Hindquş) dağlarında',
    16,
    '70809da7-964d-4037-a2eb-fed4c0ec1110'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '98f5a856-23e2-40ae-af18-cfa462089458'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tayfun küləklərinin müşahidə edildiyi adalar:',
    'multiple_choice',
    '["Rükü (Nansey), Filippin, Tayvan", "Timor, Hokkaydo, Folklend", "Hönsü, Qalapaqos, Balear", "Vrangel, Kuba, Baham", "Sokotra, Tasmaniya, Nyufaundlend"]'::jsonb,
    'Rükü (Nansey), Filippin, Tayvan',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fb6f3836-a730-458d-9554-9b546d28af18'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Tayfun küləklərinin müşahidə edildiyi adalar:',
    'multiple_choice',
    '["Rükü (Nansey), Filippin, Tayvan", "Timor, Hokkaydo, Folklend", "Hönsü, Qalapaqos, Balear", "Vrangel, Kuba, Baham", "Sokotra, Tasmaniya, Nyufaundlend"]'::jsonb,
    'Rükü (Nansey), Filippin, Tayvan',
    17,
    '98f5a856-23e2-40ae-af18-cfa462089458'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9ef48bac-7ecb-49f9-bfb6-3a1d061d8a1c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Meşə sənayesinin mexaniki emal məhsullarını müəyyən edin:
1. Kağız   2. Karton   3. Faner   4. Spirt   5. Ağac tədarükü   6. Taxta-şalban   7. Skipidar   8. Mebel   9. Boya   10. Kanifol   11. Şpal',
    'multiple_choice',
    '["1, 2, 3, 4, 9, 10", "1, 2, 4, 7, 9, 10", "1, 2, 5, 6, 8, 11", "3, 5, 6, 8, 11", "3, 5, 7, 8, 10, 11"]'::jsonb,
    '3, 5, 6, 8, 11',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '49b1cf35-4860-4d42-ae58-ba76f5d04853'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Meşə sənayesinin mexaniki emal məhsullarını müəyyən edin:
1. Kağız   2. Karton   3. Faner   4. Spirt   5. Ağac tədarükü   6. Taxta-şalban   7. Skipidar   8. Mebel   9. Boya   10. Kanifol   11. Şpal',
    'multiple_choice',
    '["1, 2, 3, 4, 9, 10", "1, 2, 4, 7, 9, 10", "1, 2, 5, 6, 8, 11", "3, 5, 6, 8, 11", "3, 5, 7, 8, 10, 11"]'::jsonb,
    '3, 5, 6, 8, 11',
    18,
    '9ef48bac-7ecb-49f9-bfb6-3a1d061d8a1c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8e8a2d68-67eb-4a33-ab2f-d70f0854b5d7'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Afrika materikində yerləşən su anbarlarından deyil:',
    'multiple_choice',
    '["Volta", "Nasir", "Kabora-Bassa", "Kariba", "Alta"]'::jsonb,
    'Alta',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '26986c7c-fae0-40f9-9986-b867ddb1d32c'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Afrika materikində yerləşən su anbarlarından deyil:',
    'multiple_choice',
    '["Volta", "Nasir", "Kabora-Bassa", "Kariba", "Alta"]'::jsonb,
    'Alta',
    19,
    '8e8a2d68-67eb-4a33-ab2f-d70f0854b5d7'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ce140afb-6210-4425-868c-2cf611f5348c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Filiz (I) və qeyri-filiz (II) mənşəli faydalı qazıntıları müvafiq olaraq qruplaşdırın:
1. xrom   2. manqan   3. kükürd   4. civə   5. apatit   6. molibden   7. kəhrəba   8. travertin',
    'multiple_choice',
    '["I – 1, 2, 4, 6; II – 3, 5, 7, 8", "I – 1, 2, 4, 5; II – 3, 6, 7, 8", "I – 2, 3, 4, 8; II – 1, 5, 6, 7", "I – 3, 5, 6, 7; II – 1, 2, 5, 8", "I – 1, 2, 3, 4; II – 5, 6, 7, 8"]'::jsonb,
    'I – 1, 2, 4, 6; II – 3, 5, 7, 8',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","AYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '237ac718-15c3-42e6-83fb-c8039ed72fd1'::uuid,
    'a8c79034-fcb4-4530-b937-21ec4a133d02'::uuid,
    'Filiz (I) və qeyri-filiz (II) mənşəli faydalı qazıntıları müvafiq olaraq qruplaşdırın:
1. xrom   2. manqan   3. kükürd   4. civə   5. apatit   6. molibden   7. kəhrəba   8. travertin',
    'multiple_choice',
    '["I – 1, 2, 4, 6; II – 3, 5, 7, 8", "I – 1, 2, 4, 5; II – 3, 6, 7, 8", "I – 2, 3, 4, 8; II – 1, 5, 6, 7", "I – 3, 5, 6, 7; II – 1, 2, 5, 8", "I – 1, 2, 3, 4; II – 5, 6, 7, 8"]'::jsonb,
    'I – 1, 2, 4, 6; II – 3, 5, 7, 8',
    20,
    'ce140afb-6210-4425-868c-2cf611f5348c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Azərbaycan dili (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Azərbaycan dili - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azərbaycan dili (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Azərbaycan dili fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Azərbaycan dili',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '510810',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b8efc0b3-956a-4169-b808-4da35d9628f3'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı sözlərdə sonuncu (fərqləndirilmiş) şəkilçi hecalarının tələffüz zamanı səs tərkibi bir-biri ilə eynidir?
1. ləzzətli [-di]
2. gözləyə [-yə]
3. ləzzətdir [-di]
4. gözəlləşdir [-dir]
5. gülməli [-li]
6. səsləyə [-yə]
7. görürdü [-dü]',
    'multiple_choice',
    '["2, 7; 3, 4, 6", "1, 3; 2, 6", "1, 5; 3, 6", "1, 5; 3, 4", "2, 4, 7; 5, 6"]'::jsonb,
    '1, 3; 2, 6',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '47e3a4c7-e9e8-472f-80c6-9b147169c08c'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Hansı sözlərdə sonuncu (fərqləndirilmiş) şəkilçi hecalarının tələffüz zamanı səs tərkibi bir-biri ilə eynidir?
1. ləzzətli [-di]
2. gözləyə [-yə]
3. ləzzətdir [-di]
4. gözəlləşdir [-dir]
5. gülməli [-li]
6. səsləyə [-yə]
7. görürdü [-dü]',
    'multiple_choice',
    '["2, 7; 3, 4, 6", "1, 3; 2, 6", "1, 5; 3, 6", "1, 5; 3, 4", "2, 4, 7; 5, 6"]'::jsonb,
    '1, 3; 2, 6',
    1,
    'b8efc0b3-956a-4169-b808-4da35d9628f3'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '546b2693-e3e3-4a66-836c-544e758f8b64'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində sual əvəzliyi olan hansı cümlə cavab tələb etmir? (Bəzi durğu işarələrindən məqsədli olaraq istifadə edilməyib.)',
    'multiple_choice',
    '["Haraya getdiyini bilən adama bütün aləm yol verər", "Düşüncəsiz hərəkət insana nə vəd edir", "Təmiz vicdan böhtandan niyə qorxmur", "Hansı adamlar işi yarımçıq görmürlər", "Qədir bilməyənə yaxşılıq etmək olarmı"]'::jsonb,
    'Haraya getdiyini bilən adama bütün aləm yol verər',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0ad7fcf1-a936-441f-beb4-c654a2582c73'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Tərkibində sual əvəzliyi olan hansı cümlə cavab tələb etmir? (Bəzi durğu işarələrindən məqsədli olaraq istifadə edilməyib.)',
    'multiple_choice',
    '["Haraya getdiyini bilən adama bütün aləm yol verər", "Düşüncəsiz hərəkət insana nə vəd edir", "Təmiz vicdan böhtandan niyə qorxmur", "Hansı adamlar işi yarımçıq görmürlər", "Qədir bilməyənə yaxşılıq etmək olarmı"]'::jsonb,
    'Haraya getdiyini bilən adama bütün aləm yol verər',
    2,
    '546b2693-e3e3-4a66-836c-544e758f8b64'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b1356811-2d1b-4109-9a52-d27dcf65e897'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı tabeli mürəkkəb cümlənin komponentləri arasına tabelilik bağlayıcısı əlavə etmək mümkündür?',
    'multiple_choice',
    '["Kim səbir etməyi bacarır, o, ömür qazanır. («Qabusnamə»)", "Pislik edirsənsə, xoşbəxtliyi boş yerə gözləmə. (İmam Əli)", "Gəncliyi yenicə yola salmışdım, ahıllıq qapımı döydü. (M. Qəzzali)", "Bizdə şeir də var, sənət də vardır... (S. Vurğun)", "O zaman ki vaxtın qədrini bildin, vaxt bitmişdi. (J. Molyer)"]'::jsonb,
    'Gəncliyi yenicə yola salmışdım, ahıllıq qapımı döydü. (M. Qəzzali)',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2e4ef2dd-f06d-491f-8f46-294064ade29b'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Hansı tabeli mürəkkəb cümlənin komponentləri arasına tabelilik bağlayıcısı əlavə etmək mümkündür?',
    'multiple_choice',
    '["Kim səbir etməyi bacarır, o, ömür qazanır. («Qabusnamə»)", "Pislik edirsənsə, xoşbəxtliyi boş yerə gözləmə. (İmam Əli)", "Gəncliyi yenicə yola salmışdım, ahıllıq qapımı döydü. (M. Qəzzali)", "Bizdə şeir də var, sənət də vardır... (S. Vurğun)", "O zaman ki vaxtın qədrini bildin, vaxt bitmişdi. (J. Molyer)"]'::jsonb,
    'Gəncliyi yenicə yola salmışdım, ahıllıq qapımı döydü. (M. Qəzzali)',
    3,
    'b1356811-2d1b-4109-9a52-d27dcf65e897'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e90d58c9-0de6-472b-8ffe-cb627723965c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bərpa olunmalı hansı durğu işarələri eyni olsa da, fərqli qrammatik məqsədlərə xidmət edir?
Müəllim dedi (1) «Əlbəttə (2) insanın hər şeyi (3) davranışı da (4) fikirləri də (5) bir sözlə, varlığı gözəl olmalıdır (6)»',
    'multiple_choice',
    '["1, 3; 2, 4", "1, 6; 4, 5", "1, 5; 3, 4", "2, 5; 3, 6", "1, 6; 2, 4"]'::jsonb,
    '1, 3; 2, 4',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e837f1d4-d15a-4a67-b34c-ce497fc30d9f'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Bərpa olunmalı hansı durğu işarələri eyni olsa da, fərqli qrammatik məqsədlərə xidmət edir?
Müəllim dedi (1) «Əlbəttə (2) insanın hər şeyi (3) davranışı da (4) fikirləri də (5) bir sözlə, varlığı gözəl olmalıdır (6)»',
    'multiple_choice',
    '["1, 3; 2, 4", "1, 6; 4, 5", "1, 5; 3, 4", "2, 5; 3, 6", "1, 6; 2, 4"]'::jsonb,
    '1, 3; 2, 4',
    4,
    'e90d58c9-0de6-472b-8ffe-cb627723965c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a71b0a6c-5025-4a54-a7e8-c2574ded9b7c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı nümunədə fərqləndirilmiş eyni sözü həm yalnız qrammatik (qoşma), həm də həm leksik, həm qrammatik mənaya malik ifadə (əvəzlik) kimi düşünmək olar?',
    'multiple_choice',
    '["Əvvəl bizim dediklərimizdən nəticə çıxarmaq lazımdır.", "Sonralar da kim bunu soruşsa idi, eyni cavabı təkrarlayardı.", "Bu şagirdin nəticələrindən qabaqlar müəllimlər də narazı idilər.", "Ay, sən nə gözəl görünürsən bu gün!", "Uşaqları evlərinə kimi ötürdülər."]'::jsonb,
    'Uşaqları evlərinə kimi ötürdülər.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e1f882be-a0cb-4f5a-9ed6-a7e337cc063f'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Hansı nümunədə fərqləndirilmiş eyni sözü həm yalnız qrammatik (qoşma), həm də həm leksik, həm qrammatik mənaya malik ifadə (əvəzlik) kimi düşünmək olar?',
    'multiple_choice',
    '["Əvvəl bizim dediklərimizdən nəticə çıxarmaq lazımdır.", "Sonralar da kim bunu soruşsa idi, eyni cavabı təkrarlayardı.", "Bu şagirdin nəticələrindən qabaqlar müəllimlər də narazı idilər.", "Ay, sən nə gözəl görünürsən bu gün!", "Uşaqları evlərinə kimi ötürdülər."]'::jsonb,
    'Uşaqları evlərinə kimi ötürdülər.',
    5,
    'a71b0a6c-5025-4a54-a7e8-c2574ded9b7c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6b81b504-3a66-4ca4-a016-af06c875b242'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cədvəlin hansı sətrində verilmiş nümunələrin hər ikisində şərtə uyğunluq gözlənilib?
Sol sütun: «Nəqli cümlədir» | Sağ sütun: «Mübtədası təsəvvür edilə bilmir (şəxssiz cümlədir)»
1. Səlim bəyin ağlı başına gəlməmişdi. | Tapşırıqları yerinə yetirdik.
2. Bura çoxdankı bataqlıqdır. | Onları çağırmaq üçün adam göndər.
3. Bu dağların hüsnünə dastan deyək. | Meyvə ağaclarının bar verən vaxtı idi.
4. Sinfə təzə gələnlər danışsınlar. | Sizin bütün tapşırıqlarınıza əməl olundu.
5. Başqasının əmri ilə iş görmək mənim adətim deyil. | Düşündüklərini ona söyləməyin əsl zamanı idi.',
    'multiple_choice',
    '["1", "2", "3", "4", "5"]'::jsonb,
    '5',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6b70ddf9-f4e2-48e0-9865-fa73e11ff6cf'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Cədvəlin hansı sətrində verilmiş nümunələrin hər ikisində şərtə uyğunluq gözlənilib?
Sol sütun: «Nəqli cümlədir» | Sağ sütun: «Mübtədası təsəvvür edilə bilmir (şəxssiz cümlədir)»
1. Səlim bəyin ağlı başına gəlməmişdi. | Tapşırıqları yerinə yetirdik.
2. Bura çoxdankı bataqlıqdır. | Onları çağırmaq üçün adam göndər.
3. Bu dağların hüsnünə dastan deyək. | Meyvə ağaclarının bar verən vaxtı idi.
4. Sinfə təzə gələnlər danışsınlar. | Sizin bütün tapşırıqlarınıza əməl olundu.
5. Başqasının əmri ilə iş görmək mənim adətim deyil. | Düşündüklərini ona söyləməyin əsl zamanı idi.',
    'multiple_choice',
    '["1", "2", "3", "4", "5"]'::jsonb,
    '5',
    6,
    '6b81b504-3a66-4ca4-a016-af06c875b242'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0074a769-5b7b-4c96-bca2-402200f63754'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Baş üzvlərindən birinin işarə əvəzliyi ilə ifadə olunduğu sadə cümləni müəyyən edin:',
    'multiple_choice',
    '["O, qaşlarını çatıb dərin fikrə getdi.", "Biz o parkda tələbə yoldaşlarımızla oturmuşduq.", "Bu göstərişi dinməz-söyləməz yerinə yetirənlər onlardırlar.", "O danışan zaman belələri susar ancaq.", "Bu kitab mənim üçün çox dəyərlidir."]'::jsonb,
    'O danışan zaman belələri susar ancaq.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ea62c936-954e-419a-b7e5-4671363ffae5'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Baş üzvlərindən birinin işarə əvəzliyi ilə ifadə olunduğu sadə cümləni müəyyən edin:',
    'multiple_choice',
    '["O, qaşlarını çatıb dərin fikrə getdi.", "Biz o parkda tələbə yoldaşlarımızla oturmuşduq.", "Bu göstərişi dinməz-söyləməz yerinə yetirənlər onlardırlar.", "O danışan zaman belələri susar ancaq.", "Bu kitab mənim üçün çox dəyərlidir."]'::jsonb,
    'O danışan zaman belələri susar ancaq.',
    7,
    '0074a769-5b7b-4c96-bca2-402200f63754'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '46ef8daf-6790-40f3-80ee-be0324243f7d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Zərfin bütün məna növlərinə (tərzi-hərəkət, zaman, yer, kəmiyyət) aid nümunələrin işləndiyi cümləni müəyyən edin:',
    'multiple_choice',
    '["Onun hələ də orada dinməz-söyləməz dayanması bizi çox əsəbiləşdirdi.", "İrəli getdikcə kəndi daha yaxşı görürdü və havanı aclıqla ciyərlərinə çəkirdi.", "Sonralar gözəl danışığı yadına düşdükcə onun nə qədər istedadlı olduğunu anlayırdı.", "Çoxdan bilirdi ki, yaxşı oxumaq hələ işin hamısı deyil, xarakterin möhkəmliyi də vacib məsələdir.", "Tezdən oyana bilmir, yaxşı işləməyi bacarmır, ümumiyyətlə, şəhərdə xeyli çətinlik çəkirdi."]'::jsonb,
    'Onun hələ də orada dinməz-söyləməz dayanması bizi çox əsəbiləşdirdi.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c1db374a-2cb3-4ffa-a88b-f34aa6de8cf8'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Zərfin bütün məna növlərinə (tərzi-hərəkət, zaman, yer, kəmiyyət) aid nümunələrin işləndiyi cümləni müəyyən edin:',
    'multiple_choice',
    '["Onun hələ də orada dinməz-söyləməz dayanması bizi çox əsəbiləşdirdi.", "İrəli getdikcə kəndi daha yaxşı görürdü və havanı aclıqla ciyərlərinə çəkirdi.", "Sonralar gözəl danışığı yadına düşdükcə onun nə qədər istedadlı olduğunu anlayırdı.", "Çoxdan bilirdi ki, yaxşı oxumaq hələ işin hamısı deyil, xarakterin möhkəmliyi də vacib məsələdir.", "Tezdən oyana bilmir, yaxşı işləməyi bacarmır, ümumiyyətlə, şəhərdə xeyli çətinlik çəkirdi."]'::jsonb,
    'Onun hələ də orada dinməz-söyləməz dayanması bizi çox əsəbiləşdirdi.',
    8,
    '46ef8daf-6790-40f3-80ee-be0324243f7d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '1f279f49-fbb6-4334-af47-0643cfc14aef'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş cümlələrin yalnız birinə aid olan fikirləri müəyyən edin:
• Yanımdakı dostumdan xəbər aldım ki, bura, doğrudanmı, gözəl məkandır?
• Adam var, hər çiçəyi ətrindən tanıya bilir.
1. Bir qrammatik əsası var.
2. Tabelilik əlaqəsindən istifadə olunub.
3. İkinci dərəcəli üzvlərdən yalnız biri işlənməyib.
4. İki təyin var.
5. Tamamlığa aid təyin işlənib.
6. Tərkibindəki sadə cümlələrdən biri yalnız baş üzvlərdən ibarətdir.',
    'multiple_choice',
    '["1, 2, 4", "4, 6", "1, 3, 5", "3, 6", "2, 5"]'::jsonb,
    '4, 6',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ccdb7f6e-f7d1-4aba-b932-a2aeea361320'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Verilmiş cümlələrin yalnız birinə aid olan fikirləri müəyyən edin:
• Yanımdakı dostumdan xəbər aldım ki, bura, doğrudanmı, gözəl məkandır?
• Adam var, hər çiçəyi ətrindən tanıya bilir.
1. Bir qrammatik əsası var.
2. Tabelilik əlaqəsindən istifadə olunub.
3. İkinci dərəcəli üzvlərdən yalnız biri işlənməyib.
4. İki təyin var.
5. Tamamlığa aid təyin işlənib.
6. Tərkibindəki sadə cümlələrdən biri yalnız baş üzvlərdən ibarətdir.',
    'multiple_choice',
    '["1, 2, 4", "4, 6", "1, 3, 5", "3, 6", "2, 5"]'::jsonb,
    '4, 6',
    9,
    '1f279f49-fbb6-4334-af47-0643cfc14aef'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3b2593de-87fa-4b70-9702-2810f998a84a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Həmcins xəbərləri müxtəlif nitq hissələri ilə ifadə olunan cümləni müəyyən edin:',
    'multiple_choice',
    '["Hava soyuq və yağışlı olsa da, tədbirdə hər kəs iştirak etmişdir.", "Bakının məşhur küçələrində o qədər əyləndik, gəzdik ki, çox yorulduq.", "Bu dağ yolu çox təhlükəlidir, ancaq o, dəfələrlə qət edilib, başa vurulubdur.", "Həyətdə gördüklərimizin hamısı bizim tanıdığımız gənclər və uşaqlar idi.", "Kənd uzaq olduğundan babamgil gecikirdilər və hələ də yol gəlməkdə idilər."]'::jsonb,
    'Kənd uzaq olduğundan babamgil gecikirdilər və hələ də yol gəlməkdə idilər.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '434898a1-c709-4389-9b32-3f3943d1607c'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Həmcins xəbərləri müxtəlif nitq hissələri ilə ifadə olunan cümləni müəyyən edin:',
    'multiple_choice',
    '["Hava soyuq və yağışlı olsa da, tədbirdə hər kəs iştirak etmişdir.", "Bakının məşhur küçələrində o qədər əyləndik, gəzdik ki, çox yorulduq.", "Bu dağ yolu çox təhlükəlidir, ancaq o, dəfələrlə qət edilib, başa vurulubdur.", "Həyətdə gördüklərimizin hamısı bizim tanıdığımız gənclər və uşaqlar idi.", "Kənd uzaq olduğundan babamgil gecikirdilər və hələ də yol gəlməkdə idilər."]'::jsonb,
    'Kənd uzaq olduğundan babamgil gecikirdilər və hələ də yol gəlməkdə idilər.',
    10,
    '3b2593de-87fa-4b70-9702-2810f998a84a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '405098a9-4163-49fd-bbd5-53905270f100'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı cümlədə çağırış bildirən nida ilə müraciət bildirən xitab yanaşı işlənmişdir? (Bəzi durğu işarələri məqsədli şəkildə buraxılmışdır.)',
    'multiple_choice',
    '["Dəfələrlə xəbərdar etsəm də, sən heç dinləmirsən oğlum.", "Ay aman Rəşid dayı sən nə yaxşı iş gördün bu gün gəlməkdə.", "Bu torpağı bu dənizi çoxmu sevirsən ay vətən oğlu.", "Eh görünür siz də bizim işlərimizi çox dəstəkləmişsiniz əziz müəllim.", "Aman qurban verməyin o azadlığı heç bir vədin gözəlliyinə."]'::jsonb,
    'Bu torpağı bu dənizi çoxmu sevirsən ay vətən oğlu.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4e2cd8de-fee8-4de1-9827-9ef178b6c815'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Hansı cümlədə çağırış bildirən nida ilə müraciət bildirən xitab yanaşı işlənmişdir? (Bəzi durğu işarələri məqsədli şəkildə buraxılmışdır.)',
    'multiple_choice',
    '["Dəfələrlə xəbərdar etsəm də, sən heç dinləmirsən oğlum.", "Ay aman Rəşid dayı sən nə yaxşı iş gördün bu gün gəlməkdə.", "Bu torpağı bu dənizi çoxmu sevirsən ay vətən oğlu.", "Eh görünür siz də bizim işlərimizi çox dəstəkləmişsiniz əziz müəllim.", "Aman qurban verməyin o azadlığı heç bir vədin gözəlliyinə."]'::jsonb,
    'Bu torpağı bu dənizi çoxmu sevirsən ay vətən oğlu.',
    11,
    '405098a9-4163-49fd-bbd5-53905270f100'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '594cdbc4-5e5e-4176-bb07-7f9adcf0c537'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bağlayıcıların qrammatik funksiyası ilə bağlı uyğunsuzluğu müəyyən edin:',
    'multiple_choice',
    '["«Ancaq» tabesizlik bağlayıcısıdır, sadə cümlələri bir-birinə bağlayır: Bu günəş, bu göy, bu əlvan şəhər ancaq sən gələndə sevinə bilir.", "«Və» tabesizlik bağlayıcısıdır, həmcins cümlə üzvlərini bağlayır: Siz keçən yay bağa köçdünüz, burada hər tərəf güllər və çiçəklərlə dolu idi.", "«Nə də» bağlayıcısının bağladığı komponentlərdəki hadisələr eyni zamanda baş verir: Nə atam düşündüyümüzü söylədi, nə də anam bizim istəyimizi nəzərə aldı.", "«Ya da» bağlayıcısı qrammatik cəhətdən bir-birinə tabe olmayan cümlələri birləşdirir: Ya məktəb evin yaxınlığında yerləşir, ya da Azad tezdən durduğu üçün dərsə vaxtında çatır.", "«Da» iştirak bağlayıcısıdır, budaq cümlənin tərkibində işlənib: Nə qədər ki yağış da bizdən qaçaq düşüb, demək, məhsul olmayacaq."]'::jsonb,
    '«Ancaq» tabesizlik bağlayıcısıdır, sadə cümlələri bir-birinə bağlayır: Bu günəş, bu göy, bu əlvan şəhər ancaq sən gələndə sevinə bilir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '3a7424a7-090b-42ad-85ba-9472b54e0bf0'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Bağlayıcıların qrammatik funksiyası ilə bağlı uyğunsuzluğu müəyyən edin:',
    'multiple_choice',
    '["«Ancaq» tabesizlik bağlayıcısıdır, sadə cümlələri bir-birinə bağlayır: Bu günəş, bu göy, bu əlvan şəhər ancaq sən gələndə sevinə bilir.", "«Və» tabesizlik bağlayıcısıdır, həmcins cümlə üzvlərini bağlayır: Siz keçən yay bağa köçdünüz, burada hər tərəf güllər və çiçəklərlə dolu idi.", "«Nə də» bağlayıcısının bağladığı komponentlərdəki hadisələr eyni zamanda baş verir: Nə atam düşündüyümüzü söylədi, nə də anam bizim istəyimizi nəzərə aldı.", "«Ya da» bağlayıcısı qrammatik cəhətdən bir-birinə tabe olmayan cümlələri birləşdirir: Ya məktəb evin yaxınlığında yerləşir, ya da Azad tezdən durduğu üçün dərsə vaxtında çatır.", "«Da» iştirak bağlayıcısıdır, budaq cümlənin tərkibində işlənib: Nə qədər ki yağış da bizdən qaçaq düşüb, demək, məhsul olmayacaq."]'::jsonb,
    '«Ancaq» tabesizlik bağlayıcısıdır, sadə cümlələri bir-birinə bağlayır: Bu günəş, bu göy, bu əlvan şəhər ancaq sən gələndə sevinə bilir.',
    12,
    '594cdbc4-5e5e-4176-bb07-7f9adcf0c537'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cbc420b9-1ced-4c15-a60d-ecd8708fa99b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Əhməd Cavadın «Azərbaycan bayrağına» şeiri ilə bağlı düzgün fikri müəyyən edin:',
    'multiple_choice',
    '["Heca vəznində, dördlük bəndlər şəklindədir.", "Dövlət rəmzlərimizin (bayraqdakı rənglərin, ay və ulduzun) mənaları şərh olunur.", "Azərbaycanın yalnız təbiət gözəllikləri göz önünə çəkilir.", "Düşmənlərə qarşı açıq hərbi hücum çağırışı əsas mövzudur.", "Azərbaycanın neft və təbii sərvətləri ilə məşhur olduğu vurğulanır."]'::jsonb,
    'Heca vəznində, dördlük bəndlər şəklindədir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8fa0bee1-c276-4858-a895-ab97b6869a85'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Əhməd Cavadın «Azərbaycan bayrağına» şeiri ilə bağlı düzgün fikri müəyyən edin:',
    'multiple_choice',
    '["Heca vəznində, dördlük bəndlər şəklindədir.", "Dövlət rəmzlərimizin (bayraqdakı rənglərin, ay və ulduzun) mənaları şərh olunur.", "Azərbaycanın yalnız təbiət gözəllikləri göz önünə çəkilir.", "Düşmənlərə qarşı açıq hərbi hücum çağırışı əsas mövzudur.", "Azərbaycanın neft və təbii sərvətləri ilə məşhur olduğu vurğulanır."]'::jsonb,
    'Heca vəznində, dördlük bəndlər şəklindədir.',
    13,
    'cbc420b9-1ced-4c15-a60d-ecd8708fa99b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a571a477-92ed-446e-9076-59addf41ef8b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '«Koroğlu» dastanındakı Bolu bəy (sol hissə), Keçəl Həmzə (sağ hissə) və ortaq (kəsişmə) xüsusiyyətlərlə bağlı Eyler-Venn diaqramındakı doğru fikirləri müəyyən edin:
Bolu bəy: 1. Hasan paşanın məclisində iştirak edir. 2. Koroğlunun qarşısında «hiylə niqabını üzünə çəkir».
Keçəl Həmzə: 3. Koroğluya verdiyi sözün üstündə durur. 4. Dəlilərin Koroğludan inciməsinə səbəb olur.
Ortaq: 5. Koroğlu ilə Çənlibel yaxınlığında rastlaşanda onun kimliyini anlamır. 6. Hasan paşa qızını ona verməyə razı olur.',
    'multiple_choice',
    '["1, 2, 4", "3, 4, 5", "1, 2, 5", "3, 4, 6", "2, 4, 6"]'::jsonb,
    '2, 4, 6',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6b94ad8d-3d89-4ec1-958b-3e2115845a1c'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    '«Koroğlu» dastanındakı Bolu bəy (sol hissə), Keçəl Həmzə (sağ hissə) və ortaq (kəsişmə) xüsusiyyətlərlə bağlı Eyler-Venn diaqramındakı doğru fikirləri müəyyən edin:
Bolu bəy: 1. Hasan paşanın məclisində iştirak edir. 2. Koroğlunun qarşısında «hiylə niqabını üzünə çəkir».
Keçəl Həmzə: 3. Koroğluya verdiyi sözün üstündə durur. 4. Dəlilərin Koroğludan inciməsinə səbəb olur.
Ortaq: 5. Koroğlu ilə Çənlibel yaxınlığında rastlaşanda onun kimliyini anlamır. 6. Hasan paşa qızını ona verməyə razı olur.',
    'multiple_choice',
    '["1, 2, 4", "3, 4, 5", "1, 2, 5", "3, 4, 6", "2, 4, 6"]'::jsonb,
    '2, 4, 6',
    14,
    'a571a477-92ed-446e-9076-59addf41ef8b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9ebb2194-dbff-4d47-baa0-2ca60181eae8'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'M.F. Axundzadənin «Aldanmış kəvakib» povestindəki Mirzə Möhsün («vəzir/mollabaşı» və ya Yusif Sərrac dövründə vəzifəyə gətirilən obrazlar) əsasında Mirzə Möhsünə aid olan fikirləri müəyyən edin:
1. Yusif şahın hakimiyyətdən getməsinə səbəb olan şəxslərdəndir.
2. Şah Abbasın atasının hakimiyyəti dövründə də yüksək vəzifədə olmuşdur.
3. Qoşun əhlinin məvacibinin kəsilməsinə səbəb olur.
4. Təhsili və savadı barədə lovğalıqla söz açır.
5. Ərk qalasında zindana salınır.',
    'multiple_choice',
    '["2, 4", "1, 3", "3, 5", "1, 4", "2, 5"]'::jsonb,
    '1, 4',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd6ab0c18-aea4-4f6a-b145-3a407a4a4565'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'M.F. Axundzadənin «Aldanmış kəvakib» povestindəki Mirzə Möhsün («vəzir/mollabaşı» və ya Yusif Sərrac dövründə vəzifəyə gətirilən obrazlar) əsasında Mirzə Möhsünə aid olan fikirləri müəyyən edin:
1. Yusif şahın hakimiyyətdən getməsinə səbəb olan şəxslərdəndir.
2. Şah Abbasın atasının hakimiyyəti dövründə də yüksək vəzifədə olmuşdur.
3. Qoşun əhlinin məvacibinin kəsilməsinə səbəb olur.
4. Təhsili və savadı barədə lovğalıqla söz açır.
5. Ərk qalasında zindana salınır.',
    'multiple_choice',
    '["2, 4", "1, 3", "3, 5", "1, 4", "2, 5"]'::jsonb,
    '1, 4',
    15,
    '9ebb2194-dbff-4d47-baa0-2ca60181eae8'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e81d4dc0-aefb-4e41-b1c1-4ebc025de22b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'M.Ə. Sabirin əsərindən verilmiş nümunə haqqında yanlış fikri müəyyən edin:
Seyr etməyə fəzanı icad olub balonlar,
Bir yandan avtomobillər, bir səmtdən vaqonlar,
Hər ixtirayə dair təsis olur salonlar,
Vallah, bular azıblar başdan-ayağa, millət!
İndi bir az da dincəl, baş qoy yatağa, millət!',
    'multiple_choice',
    '["Şair ölkəsinin inkişafdan qalmasına təəssüf edir.", "Satirik şeirdəndir.", "Son iki misrada kinayədən (ironiyadan) istifadə edilmişdir.", "Şeir mənfi tipin (gerilik tərəfdarının) dilindən deyilmir, birbaşa müəllifin öz ciddi nəsihətidir.", "Şeirdə əcnəbilərin elmi-texniki tərəqqisi xatırlanır."]'::jsonb,
    'Şeir mənfi tipin (gerilik tərəfdarının) dilindən deyilmir, birbaşa müəllifin öz ciddi nəsihətidir.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c94cf167-1607-4600-b82e-f2e8f91ce6c1'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'M.Ə. Sabirin əsərindən verilmiş nümunə haqqında yanlış fikri müəyyən edin:
Seyr etməyə fəzanı icad olub balonlar,
Bir yandan avtomobillər, bir səmtdən vaqonlar,
Hər ixtirayə dair təsis olur salonlar,
Vallah, bular azıblar başdan-ayağa, millət!
İndi bir az da dincəl, baş qoy yatağa, millət!',
    'multiple_choice',
    '["Şair ölkəsinin inkişafdan qalmasına təəssüf edir.", "Satirik şeirdəndir.", "Son iki misrada kinayədən (ironiyadan) istifadə edilmişdir.", "Şeir mənfi tipin (gerilik tərəfdarının) dilindən deyilmir, birbaşa müəllifin öz ciddi nəsihətidir.", "Şeirdə əcnəbilərin elmi-texniki tərəqqisi xatırlanır."]'::jsonb,
    'Şeir mənfi tipin (gerilik tərəfdarının) dilindən deyilmir, birbaşa müəllifin öz ciddi nəsihətidir.',
    16,
    'e81d4dc0-aefb-4e41-b1c1-4ebc025de22b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b70d40e7-9310-40b8-a5f3-f25681ab6c53'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'S.Ə. Şirvaninin «Qafqaz müsəlmanlarına xitab» şeiri ilə bağlı doğru fikirləri müəyyənləşdirin:
1. Əsərdə geriliyin səbəbləri və ondan xilas olmağın yolları göstərilir.
2. Heca vəznində yazılmışdır.
3. Əsərdə elmə, inkişaf və tərəqqiyə çağırış ifadə olunmuşdur.
4. Müəllifin maarifçilik ideyaları öz əksini tapmışdır.
5. Təhkiyə əsasında yazılmışdır, geniş süjetli epik əsərdir.',
    'multiple_choice',
    '["2, 3, 4", "1, 5", "3, 5", "1, 3, 4", "1, 2, 4"]'::jsonb,
    '1, 3, 4',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c59cfa40-d8b0-4756-914b-c8f98ac94f78'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'S.Ə. Şirvaninin «Qafqaz müsəlmanlarına xitab» şeiri ilə bağlı doğru fikirləri müəyyənləşdirin:
1. Əsərdə geriliyin səbəbləri və ondan xilas olmağın yolları göstərilir.
2. Heca vəznində yazılmışdır.
3. Əsərdə elmə, inkişaf və tərəqqiyə çağırış ifadə olunmuşdur.
4. Müəllifin maarifçilik ideyaları öz əksini tapmışdır.
5. Təhkiyə əsasında yazılmışdır, geniş süjetli epik əsərdir.',
    'multiple_choice',
    '["2, 3, 4", "1, 5", "3, 5", "1, 3, 4", "1, 2, 4"]'::jsonb,
    '1, 3, 4',
    17,
    'b70d40e7-9310-40b8-a5f3-f25681ab6c53'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '17653344-9288-455e-a4c7-efd92cc81966'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'N. Vəzirovun «Müsibəti-Fəxrəddin» faciəsində Rüstəm bəy obrazı haqqında yanlış fikirləri müəyyən edin:
1. Onu saymayan bir çox adamların yurdunu viran qoymuşdur.
2. Qan tökməyə qarşı çıxan oğlu Mahmud bəyin mövqeyini biqeyrətlik hesab edir.
3. Mənəvi məğlubiyyətini əsərin sonunacan dərk etmir.
4. Fəxrəddinin maarifçi ideyalarına və xeyriyyəçiliyinə qarşı çıxır.
5. Nökərləri ilə mərhəmətli ata kimi davranır.
6. Fəxrəddin bəyin əmilərini diyardan sürgün etdirmişdir.',
    'multiple_choice',
    '["3, 4", "1, 2, 5", "2, 4, 6", "1, 3, 6", "3, 5, 6"]'::jsonb,
    '3, 5, 6',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ce5e6137-491c-4de1-9110-6f12c2a8c749'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'N. Vəzirovun «Müsibəti-Fəxrəddin» faciəsində Rüstəm bəy obrazı haqqında yanlış fikirləri müəyyən edin:
1. Onu saymayan bir çox adamların yurdunu viran qoymuşdur.
2. Qan tökməyə qarşı çıxan oğlu Mahmud bəyin mövqeyini biqeyrətlik hesab edir.
3. Mənəvi məğlubiyyətini əsərin sonunacan dərk etmir.
4. Fəxrəddinin maarifçi ideyalarına və xeyriyyəçiliyinə qarşı çıxır.
5. Nökərləri ilə mərhəmətli ata kimi davranır.
6. Fəxrəddin bəyin əmilərini diyardan sürgün etdirmişdir.',
    'multiple_choice',
    '["3, 4", "1, 2, 5", "2, 4, 6", "1, 3, 6", "3, 5, 6"]'::jsonb,
    '3, 5, 6',
    18,
    '17653344-9288-455e-a4c7-efd92cc81966'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a1c3b412-c463-4920-8bf3-03cae0938439'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş şeir nümunəsində fərqləndirilmiş ifadə («yaşıl çətir») əsasında doğru fikirləri müəyyən edin:
Bir yaşıl çətir açdı dosta, tanışa,
Bir bahar məclisi qurdu söyüdlər. (M. Gülgün)',
    'multiple_choice',
    '["1. Metafordur; 2. Məcazın (bədii təsvir vasitəsinin) bir növüdür; 3. Sözün bədii təsir gücünü daha da artırmışdır.", "1. Metonimiyadır; 2. Bədii ifadə vasitəsidir; 3. Bir əlamət başqa bir varlığın üzərinə köçürülmüşdür.", "1. Simvoldur; 2. Məcazın bir növüdür; 3. Müstəqim məna daşıyır.", "1. Mübaliğədir; 2. Bədii təsvir vasitəsidir; 3. Sözün təsir gücünü artırmaq üçün işlədilmişdir.", "1. Təşbehdir; 2. Bədii ifadə vasitəsidir; 3. İfadə olunan fikri qüvvətləndirmişdir."]'::jsonb,
    '1. Metafordur; 2. Məcazın (bədii təsvir vasitəsinin) bir növüdür; 3. Sözün bədii təsir gücünü daha da artırmışdır.',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4680b2f2-a5f5-4d05-9308-e75deef7aaa0'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Verilmiş şeir nümunəsində fərqləndirilmiş ifadə («yaşıl çətir») əsasında doğru fikirləri müəyyən edin:
Bir yaşıl çətir açdı dosta, tanışa,
Bir bahar məclisi qurdu söyüdlər. (M. Gülgün)',
    'multiple_choice',
    '["1. Metafordur; 2. Məcazın (bədii təsvir vasitəsinin) bir növüdür; 3. Sözün bədii təsir gücünü daha da artırmışdır.", "1. Metonimiyadır; 2. Bədii ifadə vasitəsidir; 3. Bir əlamət başqa bir varlığın üzərinə köçürülmüşdür.", "1. Simvoldur; 2. Məcazın bir növüdür; 3. Müstəqim məna daşıyır.", "1. Mübaliğədir; 2. Bədii təsvir vasitəsidir; 3. Sözün təsir gücünü artırmaq üçün işlədilmişdir.", "1. Təşbehdir; 2. Bədii ifadə vasitəsidir; 3. İfadə olunan fikri qüvvətləndirmişdir."]'::jsonb,
    '1. Metafordur; 2. Məcazın (bədii təsvir vasitəsinin) bir növüdür; 3. Sözün bədii təsir gücünü daha da artırmışdır.',
    19,
    'a1c3b412-c463-4920-8bf3-03cae0938439'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '159ad887-c02d-4648-a624-ea8d2bb83b05'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Rəsul Rzanın «Çinar» şeirindən verilmiş parça ilə bağlı doğru fikirləri müəyyən edin:
Çinar getdi;
könüllərdə yanğısı, yeri qaldı.
...Fırtınada, qasırğada əyilmədi.
Acizlik, qorxu nədir – bilmədi.
Yaşadı çinar kimi;
budaqları çətir-çətir, kölgəsi meydan-meydan.
Az da, çox da yaşasaydı, belə yaşayacaqdı.
Kökü torpağa bağlı, vüqarlı çinar kimi;
müdrik babalar kimi.
1. Misraların quruluşunda, qafiyə sistemində müəyyən sərbəstlik (sərbəst şeir xüsusiyyəti) var.
2. Çinar yalnız fiziki cəhətdən uzunömürlü insanlara bənzədilir.
3. Çinar əyilməzlik, mətinlik və qorxmazlıq simvolu kimi təqdim edilir.
4. «Çinar bir az da çox yaşasaydı, daha qüdrətli olardı» fikri önə çəkilir.
5. Kökü torpağa bağlı olan çinarla müdrik insanlar müqayisə edilir.',
    'multiple_choice',
    '["2, 4", "1, 4, 5", "3, 4", "1, 3, 5", "2, 5"]'::jsonb,
    '1, 3, 5',
    'Azərbaycan dili',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Azərbaycan dili"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6d7380fb-1098-46ad-9b84-4b44bf4c4779'::uuid,
    'e79a2dcb-954f-4973-9564-5dc5e5c7112e'::uuid,
    'Rəsul Rzanın «Çinar» şeirindən verilmiş parça ilə bağlı doğru fikirləri müəyyən edin:
Çinar getdi;
könüllərdə yanğısı, yeri qaldı.
...Fırtınada, qasırğada əyilmədi.
Acizlik, qorxu nədir – bilmədi.
Yaşadı çinar kimi;
budaqları çətir-çətir, kölgəsi meydan-meydan.
Az da, çox da yaşasaydı, belə yaşayacaqdı.
Kökü torpağa bağlı, vüqarlı çinar kimi;
müdrik babalar kimi.
1. Misraların quruluşunda, qafiyə sistemində müəyyən sərbəstlik (sərbəst şeir xüsusiyyəti) var.
2. Çinar yalnız fiziki cəhətdən uzunömürlü insanlara bənzədilir.
3. Çinar əyilməzlik, mətinlik və qorxmazlıq simvolu kimi təqdim edilir.
4. «Çinar bir az da çox yaşasaydı, daha qüdrətli olardı» fikri önə çəkilir.
5. Kökü torpağa bağlı olan çinarla müdrik insanlar müqayisə edilir.',
    'multiple_choice',
    '["2, 4", "1, 4, 5", "3, 4", "1, 3, 5", "2, 5"]'::jsonb,
    '1, 3, 5',
    20,
    '159ad887-c02d-4648-a624-ea8d2bb83b05'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Riyaziyyat (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Riyaziyyat - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Riyaziyyat (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Riyaziyyat fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Riyaziyyat',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '270180',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3d156ed8-da99-4e72-881b-2fa5619b99d1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sıfırdan fərqli x, y ∈ R ədədləri üçün x² + xy + y² = 0 bərabərliyi ödənərsə (kompleks müstəvidə və ya cəbri eynilik kimi), (x / (x + y))²⁰¹⁹ + (y / (x + y))²⁰¹⁹ cəmini tapın.',
    'multiple_choice',
    '["-2", "-1", "0", "1", "2"]'::jsonb,
    '-2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2e883171-9d7d-4ab7-90e2-7a2aa164ce13'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'Sıfırdan fərqli x, y ∈ R ədədləri üçün x² + xy + y² = 0 bərabərliyi ödənərsə (kompleks müstəvidə və ya cəbri eynilik kimi), (x / (x + y))²⁰¹⁹ + (y / (x + y))²⁰¹⁹ cəmini tapın.',
    'multiple_choice',
    '["-2", "-1", "0", "1", "2"]'::jsonb,
    '-2',
    1,
    '3d156ed8-da99-4e72-881b-2fa5619b99d1'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '16248ac4-305a-431c-8be7-72b181ff84c8'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '125 pilləsi görünən eskalator yuxarı doğru sabit sürətlə hərəkət edərkən, Əhməd eskalatorla yeriyərək yuxarı çıxır. İlk dəfə eskalatorun sonuna çatana kimi 45 pillə, ikinci dəfə isə 55 pillə çıxarsa, Əhmədin ikinci dəfə çıxdığı öz sürətinin ilk dəfə çıxdığı öz sürətinə nisbətini tapın.',
    'multiple_choice',
    '["99 / 73", "77 / 53", "88 / 63", "66 / 73", "1 / 2"]'::jsonb,
    '88 / 63',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '23ab5a77-6c77-4327-ab71-bf528f35c890'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '125 pilləsi görünən eskalator yuxarı doğru sabit sürətlə hərəkət edərkən, Əhməd eskalatorla yeriyərək yuxarı çıxır. İlk dəfə eskalatorun sonuna çatana kimi 45 pillə, ikinci dəfə isə 55 pillə çıxarsa, Əhmədin ikinci dəfə çıxdığı öz sürətinin ilk dəfə çıxdığı öz sürətinə nisbətini tapın.',
    'multiple_choice',
    '["99 / 73", "77 / 53", "88 / 63", "66 / 73", "1 / 2"]'::jsonb,
    '88 / 63',
    2,
    '16248ac4-305a-431c-8be7-72b181ff84c8'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '94cc859b-9c4d-4e04-af78-af752c08bf33'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'x, y, z mənfi olmayan tam ədədləri 3x + 4y + 6z = 12 bərabərliyini ödəyir. Bütün mümkün (x; y; z) üçlüklərinin sayını tapın.',
    'multiple_choice',
    '["1", "2", "3", "4", "5"]'::jsonb,
    '4',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '62a57fd9-35d9-4660-864a-ea39f3875b82'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'x, y, z mənfi olmayan tam ədədləri 3x + 4y + 6z = 12 bərabərliyini ödəyir. Bütün mümkün (x; y; z) üçlüklərinin sayını tapın.',
    'multiple_choice',
    '["1", "2", "3", "4", "5"]'::jsonb,
    '4',
    3,
    '94cc859b-9c4d-4e04-af78-af752c08bf33'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'fa990d3f-6b12-46db-80a2-f394532a227a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'n = √(1234 · 1235 · 1236 · 1237 + 1) ədədinin son iki rəqəminin əmələ gətirdiyi ikirəqəmli ədədi tapın.',
    'multiple_choice',
    '["41", "59", "67", "77", "88"]'::jsonb,
    '59',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '13fd6dae-efc8-4ce6-8248-1a2f2a5be29f'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'n = √(1234 · 1235 · 1236 · 1237 + 1) ədədinin son iki rəqəminin əmələ gətirdiyi ikirəqəmli ədədi tapın.',
    'multiple_choice',
    '["41", "59", "67", "77", "88"]'::jsonb,
    '59',
    4,
    'fa990d3f-6b12-46db-80a2-f394532a227a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '301af6b0-fe8d-4300-aeda-a5ab231f7777'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'a = ∛9 - ∛3 + 1 olarsa, ((4 - a) / a)⁶ ifadəsinin qiymətini tapın.',
    'multiple_choice',
    '["1", "5", "7", "9", "17"]'::jsonb,
    '9',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8901afb3-ecd6-491f-85a7-2747a2fdb9a3'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'a = ∛9 - ∛3 + 1 olarsa, ((4 - a) / a)⁶ ifadəsinin qiymətini tapın.',
    'multiple_choice',
    '["1", "5", "7", "9", "17"]'::jsonb,
    '9',
    5,
    '301af6b0-fe8d-4300-aeda-a5ab231f7777'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2dca45e0-fdb4-4a50-90f5-ec83485104b0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '√x - 3 ≥ √(x - y) bərabərsizliyini ödəyən ən azı bir x həqiqi ədədini tapa bilmək üçün y həqiqi ədədinin ala biləcəyi ən kiçik qiyməti tapın.',
    'multiple_choice',
    '["1", "5", "7", "9", "11"]'::jsonb,
    '9',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ce8a3365-bea0-40ec-8cb0-0a047afd3b27'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '√x - 3 ≥ √(x - y) bərabərsizliyini ödəyən ən azı bir x həqiqi ədədini tapa bilmək üçün y həqiqi ədədinin ala biləcəyi ən kiçik qiyməti tapın.',
    'multiple_choice',
    '["1", "5", "7", "9", "11"]'::jsonb,
    '9',
    6,
    '2dca45e0-fdb4-4a50-90f5-ec83485104b0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2e3e6277-2c8e-4700-aacb-66d3772100fe'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '√(x + 4√(x - 4)) - √(x + 2√(x - 1)) = 1 tənliyinin neçə həqiqi kökü vardır?',
    'multiple_choice',
    '["0", "1", "2", "7", "Sonsuz sayda"]'::jsonb,
    '0',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ccba2868-5fcd-4bf2-8a93-685f528d5438'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '√(x + 4√(x - 4)) - √(x + 2√(x - 1)) = 1 tənliyinin neçə həqiqi kökü vardır?',
    'multiple_choice',
    '["0", "1", "2", "7", "Sonsuz sayda"]'::jsonb,
    '0',
    7,
    '2e3e6277-2c8e-4700-aacb-66d3772100fe'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9058bfb2-ce79-4ea2-8499-488930d745d7'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '2 / (1 + 3^(x - y)) + 2 / (1 + 3^(y - x)) ifadəsi aşağıdakılardan hansına bərabərdir?',
    'multiple_choice',
    '["1", "2", "3^x", "2 · 3^(x - y)", "4"]'::jsonb,
    '2',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5dea7d08-676c-44fd-9492-0c724d4e503b'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '2 / (1 + 3^(x - y)) + 2 / (1 + 3^(y - x)) ifadəsi aşağıdakılardan hansına bərabərdir?',
    'multiple_choice',
    '["1", "2", "3^x", "2 · 3^(x - y)", "4"]'::jsonb,
    '2',
    8,
    '9058bfb2-ce79-4ea2-8499-488930d745d7'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a14f505a-927a-4237-97eb-38dd40401950'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'S = 3/(1²·2²) + 5/(2²·3²) + 7/(3²·4²) + ... + 21/(10²·11²) cəminin qiymətini tapın.',
    'multiple_choice',
    '["99 / 100", "110 / 111", "120 / 121", "150 / 151", "1"]'::jsonb,
    '120 / 121',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f9986ac9-5091-4860-b6ba-36b8d90a5de3'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'S = 3/(1²·2²) + 5/(2²·3²) + 7/(3²·4²) + ... + 21/(10²·11²) cəminin qiymətini tapın.',
    'multiple_choice',
    '["99 / 100", "110 / 111", "120 / 121", "150 / 151", "1"]'::jsonb,
    '120 / 121',
    9,
    'a14f505a-927a-4237-97eb-38dd40401950'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '91784ea7-e1e3-4ffd-b9e5-6eb425358927'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bir torbada hər birinin üzərində 1-dən 20-yə qədər nömrələnmiş 20 top vardır (üzərində eyni ədəd yazılı olan iki top yoxdur). Bu toplardan biri təsadüfi çəkilir, üzərindəki ədəd qeyd edildikdən sonra torbaya geri qaytarılır. Bu proses 10 dəfə təkrar edilərsə, çıxan 10 ədədin hər birinin bir-birindən fərqli olması ehtimalını tapın.',
    'multiple_choice',
    '["10! / 20¹⁰", "1 / C(20, 10)", "C(20, 10) · 10! / 20¹⁰", "10! / (C(20, 10) · 20¹⁰)", "1 / 2"]'::jsonb,
    'C(20, 10) · 10! / 20¹⁰',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ecb48cd1-6a16-44f0-9a1e-ffe8ae0fdf47'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'Bir torbada hər birinin üzərində 1-dən 20-yə qədər nömrələnmiş 20 top vardır (üzərində eyni ədəd yazılı olan iki top yoxdur). Bu toplardan biri təsadüfi çəkilir, üzərindəki ədəd qeyd edildikdən sonra torbaya geri qaytarılır. Bu proses 10 dəfə təkrar edilərsə, çıxan 10 ədədin hər birinin bir-birindən fərqli olması ehtimalını tapın.',
    'multiple_choice',
    '["10! / 20¹⁰", "1 / C(20, 10)", "C(20, 10) · 10! / 20¹⁰", "10! / (C(20, 10) · 20¹⁰)", "1 / 2"]'::jsonb,
    'C(20, 10) · 10! / 20¹⁰',
    10,
    '91784ea7-e1e3-4ffd-b9e5-6eb425358927'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e18dd60c-a7fe-478b-8436-ad2a5275e90a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'ΔABC-də ∠ABC > 90° və C təpəsindən çəkilən daxili və xarici bucaqların tənbölənləri AB düz xətti ilə uyğun olaraq M və N nöqtələrində kəsişir. CM = 16 sm, CN = 12 sm olarsa, C təpəsindən AB tərəfinə çəkilən hündürlüyü tapın.',
    'multiple_choice',
    '["7,5 sm", "8,1 sm", "9,6 sm", "10,9 sm", "12,5 sm"]'::jsonb,
    '9,6 sm',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_math_q11.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4330b64b-b941-4d70-b7c9-a49a379c80e8'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'ΔABC-də ∠ABC > 90° və C təpəsindən çəkilən daxili və xarici bucaqların tənbölənləri AB düz xətti ilə uyğun olaraq M və N nöqtələrində kəsişir. CM = 16 sm, CN = 12 sm olarsa, C təpəsindən AB tərəfinə çəkilən hündürlüyü tapın.',
    'multiple_choice',
    '["7,5 sm", "8,1 sm", "9,6 sm", "10,9 sm", "12,5 sm"]'::jsonb,
    '9,6 sm',
    11,
    'e18dd60c-a7fe-478b-8436-ad2a5275e90a'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_math_q11.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd8eb5eab-6da0-41ec-977f-64261d62e1ad'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'x² + 4y - 12z = 122 bərabərliyini ödəyən neçə natural (x; y; z) üçlüyü var?',
    'multiple_choice',
    '["0", "1", "3", "7", "9"]'::jsonb,
    '0',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bc13fb05-60b9-4aae-9168-25ac81dcf102'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'x² + 4y - 12z = 122 bərabərliyini ödəyən neçə natural (x; y; z) üçlüyü var?',
    'multiple_choice',
    '["0", "1", "3", "7", "9"]'::jsonb,
    '0',
    12,
    'd8eb5eab-6da0-41ec-977f-64261d62e1ad'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '65b8991e-d403-4808-a1fa-5534209fc027'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '[x] · {x} hasilinin 37-dən kiçik olmaması ([x] · {x} ≥ 37) üçün x-in ən kiçik müsbət həqiqi qiymətini tapın (burada [x] ədədin tam hissəsi, {x} isə ədədin kəsr hissəsidir).',
    'multiple_choice',
    '["37 tam 36/37", "38 tam 37/38", "40", "40 tam 39/40", "40 tam 1/39"]'::jsonb,
    '38 tam 37/38',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5eeaf04f-11b5-4033-a2e4-67cfe2baebd5'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '[x] · {x} hasilinin 37-dən kiçik olmaması ([x] · {x} ≥ 37) üçün x-in ən kiçik müsbət həqiqi qiymətini tapın (burada [x] ədədin tam hissəsi, {x} isə ədədin kəsr hissəsidir).',
    'multiple_choice',
    '["37 tam 36/37", "38 tam 37/38", "40", "40 tam 39/40", "40 tam 1/39"]'::jsonb,
    '38 tam 37/38',
    13,
    '65b8991e-d403-4808-a1fa-5534209fc027'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'be269a63-d1b4-4184-b75c-d577870750fb'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '[(6x + 15) / 8] = (15x - 7) / 5 tənliyini ödəyən bütün həqiqi x ədədlərinin cəmini tapın (burada [x] ədədin tam hissəsidir).',
    'multiple_choice',
    '["1 / 19", "1 / 15", "1", "15 / 19", "19 / 15"]'::jsonb,
    '19 / 15',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e20e07ad-2e85-4cbe-9d1f-06461a2a1aa6'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '[(6x + 15) / 8] = (15x - 7) / 5 tənliyini ödəyən bütün həqiqi x ədədlərinin cəmini tapın (burada [x] ədədin tam hissəsidir).',
    'multiple_choice',
    '["1 / 19", "1 / 15", "1", "15 / 19", "19 / 15"]'::jsonb,
    '19 / 15',
    14,
    'be269a63-d1b4-4184-b75c-d577870750fb'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8d12f9c4-584d-4cbb-a187-540fe1e4ac8a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'x, y, z mənfi olmayan tam ədədləri 2x + 5y + 10z = 20 bərabərliyini ödəyir. Bu bərabərliyi ödəyən bütün (x; y; z) üçlüklərinin sayını tapın.',
    'multiple_choice',
    '["2", "4", "6", "8", "10"]'::jsonb,
    '6',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd3e9d221-29ec-4017-ad5f-a29ed7303ab3'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'x, y, z mənfi olmayan tam ədədləri 2x + 5y + 10z = 20 bərabərliyini ödəyir. Bu bərabərliyi ödəyən bütün (x; y; z) üçlüklərinin sayını tapın.',
    'multiple_choice',
    '["2", "4", "6", "8", "10"]'::jsonb,
    '6',
    15,
    '8d12f9c4-584d-4cbb-a187-540fe1e4ac8a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4bbbf281-6ef8-4f24-a6bd-8ba130758705'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '2222¹¹¹¹ ədədinin 9-a bölünməsindən alınan qalığı tapın.',
    'multiple_choice',
    '["8", "7", "5", "3", "1"]'::jsonb,
    '8',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '26daa2ab-49ef-41eb-8a4c-6f9b116f845d'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '2222¹¹¹¹ ədədinin 9-a bölünməsindən alınan qalığı tapın.',
    'multiple_choice',
    '["8", "7", "5", "3", "1"]'::jsonb,
    '8',
    16,
    '4bbbf281-6ef8-4f24-a6bd-8ba130758705'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '86837b5f-8582-4296-8d2e-466fce84405d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'a + b + c = 1 şərtini ödəyən müsbət a, b, c həqiqi ədədləri üçün P(a; b; c) = (1/a - 1)(1/b - 1)(1/c - 1) ifadəsinin ən kiçik mümkün qiymətini tapın.',
    'multiple_choice',
    '["0", "11", "7", "-6", "8"]'::jsonb,
    '8',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'aa4fb115-bd8f-4fb0-9f12-40a8269827d6'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'a + b + c = 1 şərtini ödəyən müsbət a, b, c həqiqi ədədləri üçün P(a; b; c) = (1/a - 1)(1/b - 1)(1/c - 1) ifadəsinin ən kiçik mümkün qiymətini tapın.',
    'multiple_choice',
    '["0", "11", "7", "-6", "8"]'::jsonb,
    '8',
    17,
    '86837b5f-8582-4296-8d2e-466fce84405d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '1e5ca9c6-e1e2-4788-bbfe-9a55627567b0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İstənilən x ≥ y üçün f(x + y) = f(x) + f(y) + y funksional şərti ödənərsə (və f(0) = 0), f(20)-nin qiyməti aşağıdakılardan hansına bərabərdir?',
    'multiple_choice',
    '["20f(1) + 1", "20f(1) + 20", "19f(1) + 18", "20f(1) + 19", "19f(1) + 1"]'::jsonb,
    '20f(1) + 19',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '1f4cc22e-897b-45c0-876b-6efaf8472515'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'İstənilən x ≥ y üçün f(x + y) = f(x) + f(y) + y funksional şərti ödənərsə (və f(0) = 0), f(20)-nin qiyməti aşağıdakılardan hansına bərabərdir?',
    'multiple_choice',
    '["20f(1) + 1", "20f(1) + 20", "19f(1) + 18", "20f(1) + 19", "19f(1) + 1"]'::jsonb,
    '20f(1) + 19',
    18,
    '1e5ca9c6-e1e2-4788-bbfe-9a55627567b0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7cbbbadc-8271-45d9-a85d-38f91a2f2301'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '3x² - 4x + a = 0 kvadrat tənliyinin həqiqi kökləri x₁ və x₂-dir. -2 < x₁ < 2 < x₂ şərti ödəndiyinə görə, a parametrinin ala biləcəyi qiymətləri göstərən ən geniş aralıq hansıdır?',
    'multiple_choice',
    '["a < -20", "a < -4", "a > -4", "-20 < a < -4", "a > -20"]'::jsonb,
    '-20 < a < -4',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7c73c927-42c4-4a95-b0d9-68224312fa48'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    '3x² - 4x + a = 0 kvadrat tənliyinin həqiqi kökləri x₁ və x₂-dir. -2 < x₁ < 2 < x₂ şərti ödəndiyinə görə, a parametrinin ala biləcəyi qiymətləri göstərən ən geniş aralıq hansıdır?',
    'multiple_choice',
    '["a < -20", "a < -4", "a > -4", "-20 < a < -4", "a > -20"]'::jsonb,
    '-20 < a < -4',
    19,
    '7cbbbadc-8271-45d9-a85d-38f91a2f2301'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd1b355f0-ee46-4da5-84af-ec5433331ea1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərəfi 2√3 sm olan bərabərtərəfli üçbucağın daxilinə dairə çəkilmişdir. Üçbucağın daxilində və həmin dairənin xaricində qalan 3 künc hissənin hər birinin daxilinə həm üçbucağın tərəflərinə, həm də əvvəlki dairəyə toxunan kiçik dairələr çəkilib. Bu əməliyyat üçbucağın hər 3 küncünə doğru sonsuz dəfə təkrarlanır. Üçbucağın daxilinə bu şəkildə yerləşdirilən bütün dairələrin sahələrinin cəmini tapın.',
    'multiple_choice',
    '["16π / 9", "9π / 4", "25π / 7", "11π / 8", "21π / 10"]'::jsonb,
    '11π / 8',
    'Riyaziyyat',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Riyaziyyat"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_math_q20.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'be4202cb-bc5d-4614-a40e-3b4e4eb5b878'::uuid,
    'c6a1e226-2759-4640-bf46-798e229a9b9e'::uuid,
    'Tərəfi 2√3 sm olan bərabərtərəfli üçbucağın daxilinə dairə çəkilmişdir. Üçbucağın daxilində və həmin dairənin xaricində qalan 3 künc hissənin hər birinin daxilinə həm üçbucağın tərəflərinə, həm də əvvəlki dairəyə toxunan kiçik dairələr çəkilib. Bu əməliyyat üçbucağın hər 3 küncünə doğru sonsuz dəfə təkrarlanır. Üçbucağın daxilinə bu şəkildə yerləşdirilən bütün dairələrin sahələrinin cəmini tapın.',
    'multiple_choice',
    '["16π / 9", "9π / 4", "25π / 7", "11π / 8", "21π / 10"]'::jsonb,
    '11π / 8',
    20,
    'd1b355f0-ee46-4da5-84af-ec5433331ea1'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_math_q20.png',
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Fizika (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Fizika - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Fizika (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Fizika fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Fizika',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '862633',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8eb71e73-0091-48ef-92fb-6e39dcee2803'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Radiusu 50 sm olan disk tərpənməz ox ətrafında 20 san⁻¹ bucaq sürəti ilə fırlanır. Disk üzərində götürülmüş A nöqtəsi fırlanma oxundan r_A = 50 sm, B nöqtəsi isə eyni radius üzərində fırlanma oxundan r_B = 30 sm məsafədə yerləşir. A nöqtəsinin xətti sürəti B nöqtəsinin xətti sürətindən nə qədər çoxdur?',
    'multiple_choice',
    '["4 m/san", "6 m/san", "8 m/san", "2 m/san", "10 m/san"]'::jsonb,
    '4 m/san',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5767c121-1a55-4269-9ac3-5b45f3234031'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Radiusu 50 sm olan disk tərpənməz ox ətrafında 20 san⁻¹ bucaq sürəti ilə fırlanır. Disk üzərində götürülmüş A nöqtəsi fırlanma oxundan r_A = 50 sm, B nöqtəsi isə eyni radius üzərində fırlanma oxundan r_B = 30 sm məsafədə yerləşir. A nöqtəsinin xətti sürəti B nöqtəsinin xətti sürətindən nə qədər çoxdur?',
    'multiple_choice',
    '["4 m/san", "6 m/san", "8 m/san", "2 m/san", "10 m/san"]'::jsonb,
    '4 m/san',
    1,
    '8eb71e73-0091-48ef-92fb-6e39dcee2803'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ac7a64f6-016c-4f8a-9f3d-2be126ab7680'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'm kütləli cisim sürtünməsiz üfüqi səth üzərində v sürəti ilə hərəkət edərək sükunətdə olan 3m kütləli digər cisimlə mərkəzi və mütləq qeyri-elastik toqquşur. Toqquşmadan sonra cisimlərin birgə sürəti nəyə bərabər olar?',
    'multiple_choice',
    '["v / 3", "v / 2", "v / 4", "3v / 4", "2v / 3"]'::jsonb,
    'v / 4',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'eb57ef19-ede3-4b3e-afb9-2bf5ad6fc2fd'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'm kütləli cisim sürtünməsiz üfüqi səth üzərində v sürəti ilə hərəkət edərək sükunətdə olan 3m kütləli digər cisimlə mərkəzi və mütləq qeyri-elastik toqquşur. Toqquşmadan sonra cisimlərin birgə sürəti nəyə bərabər olar?',
    'multiple_choice',
    '["v / 3", "v / 2", "v / 4", "3v / 4", "2v / 3"]'::jsonb,
    'v / 4',
    2,
    'ac7a64f6-016c-4f8a-9f3d-2be126ab7680'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e450fc47-0d3a-40dd-ac6e-bd22f450c78a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sərbəst düşən cismin koordinatının zamandan asılılıq tənliyi hansıdır? (Başlanğıc koordinat y₀ = 0, başlanğıc sürət v₀ = 0, OY oxu şaquli aşağı yönəlmişdir.)',
    'multiple_choice',
    '["y = v₀t", "y = v₀t + gt²/2", "y = gt", "y = gt²/2", "y = y₀ - gt²/2"]'::jsonb,
    'y = gt²/2',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '470f9625-0879-41ce-82c5-dc522fe57a13'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Sərbəst düşən cismin koordinatının zamandan asılılıq tənliyi hansıdır? (Başlanğıc koordinat y₀ = 0, başlanğıc sürət v₀ = 0, OY oxu şaquli aşağı yönəlmişdir.)',
    'multiple_choice',
    '["y = v₀t", "y = v₀t + gt²/2", "y = gt", "y = gt²/2", "y = y₀ - gt²/2"]'::jsonb,
    'y = gt²/2',
    3,
    'e450fc47-0d3a-40dd-ac6e-bd22f450c78a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '281c5b5b-24e0-4104-92ac-e3d1e9a48e71'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı fiziki kəmiyyətin vahidi Beynəlxalq Vahidlər Sistemində (BS) əsas vahid deyil?',
    'multiple_choice',
    '["Kütlə", "Zaman", "Uzunluq", "Qüvvə", "Maddə miqdarı"]'::jsonb,
    'Qüvvə',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '17a5d883-1532-4b12-bbdb-46a5613b2188'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Hansı fiziki kəmiyyətin vahidi Beynəlxalq Vahidlər Sistemində (BS) əsas vahid deyil?',
    'multiple_choice',
    '["Kütlə", "Zaman", "Uzunluq", "Qüvvə", "Maddə miqdarı"]'::jsonb,
    'Qüvvə',
    4,
    '281c5b5b-24e0-4104-92ac-e3d1e9a48e71'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '61977c4c-e6cd-4c71-ba0f-9dc39296cac8'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Maddi nöqtə çevrə üzrə bərabərsürətli hərəkət edir. Onun bucaq sürətini 2 dəfə artırdıqda (radius sabit qalmaqla) mərkəzəqaçma təcili necə dəyişər?',
    'multiple_choice',
    '["4 dəfə artar", "2 dəfə artar", "Dəyişməz", "2 dəfə azalar", "4 dəfə azalar"]'::jsonb,
    '4 dəfə artar',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2c5f1bb5-d949-4f5d-9fbe-d31709ee242b'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Maddi nöqtə çevrə üzrə bərabərsürətli hərəkət edir. Onun bucaq sürətini 2 dəfə artırdıqda (radius sabit qalmaqla) mərkəzəqaçma təcili necə dəyişər?',
    'multiple_choice',
    '["4 dəfə artar", "2 dəfə artar", "Dəyişməz", "2 dəfə azalar", "4 dəfə azalar"]'::jsonb,
    '4 dəfə artar',
    5,
    '61977c4c-e6cd-4c71-ba0f-9dc39296cac8'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f1d43c96-2f69-4495-b8e2-d313fbc2c8b1'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qüvvənin (F) təcilə (a) olan nisbəti (F / a) hansı fiziki kəmiyyəti ifadə edir?',
    'multiple_choice',
    '["Sürəti", "Yerdəyişməni", "İmpulsu", "İşi", "Kütləni"]'::jsonb,
    'Kütləni',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bf3d9376-4f1c-4d2d-b04e-5e1f80273952'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Qüvvənin (F) təcilə (a) olan nisbəti (F / a) hansı fiziki kəmiyyəti ifadə edir?',
    'multiple_choice',
    '["Sürəti", "Yerdəyişməni", "İmpulsu", "İşi", "Kütləni"]'::jsonb,
    'Kütləni',
    6,
    'f1d43c96-2f69-4495-b8e2-d313fbc2c8b1'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd1964c41-c834-4e71-b5cd-0a63dbd3572f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sərtliyi k = 200 N/m olan yayı 5 sm uzatmaq üçün onun ucuna nə qədər qüvvə tətbiq etmək lazımdır?',
    'multiple_choice',
    '["5 N", "10 N", "20 N", "40 N", "100 N"]'::jsonb,
    '10 N',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7e90a015-f0dc-4e5a-87f0-887ebaf7eb7c'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Sərtliyi k = 200 N/m olan yayı 5 sm uzatmaq üçün onun ucuna nə qədər qüvvə tətbiq etmək lazımdır?',
    'multiple_choice',
    '["5 N", "10 N", "20 N", "40 N", "100 N"]'::jsonb,
    '10 N',
    7,
    'd1964c41-c834-4e71-b5cd-0a63dbd3572f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7e6f9e27-391b-4d44-af87-f74d8ae9c626'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cismin kütləsini dəyişmədən sürətini 3 dəfə artırdıqda onun kinetik enerjisi necə dəyişər?',
    'multiple_choice',
    '["9 dəfə artar", "3 dəfə artar", "3 dəfə azalar", "9 dəfə azalar", "Dəyişməz"]'::jsonb,
    '9 dəfə artar',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '61a96f60-3268-495b-9c57-2e8c42acc2ed'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Cismin kütləsini dəyişmədən sürətini 3 dəfə artırdıqda onun kinetik enerjisi necə dəyişər?',
    'multiple_choice',
    '["9 dəfə artar", "3 dəfə artar", "3 dəfə azalar", "9 dəfə azalar", "Dəyişməz"]'::jsonb,
    '9 dəfə artar',
    8,
    '7e6f9e27-391b-4d44-af87-f74d8ae9c626'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'aa80bbe1-a368-42d0-a304-6bf750656c2f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sürtünmə əmsalı nədən asılıdır?',
    'multiple_choice',
    '["Toxunan səthlərin sahəsindən", "Toxunan səthlərin materialından və hamarlıq dərəcəsindən", "Təzyiq qüvvəsindən", "Cismin kütləsindən", "Dartı qüvvəsindən"]'::jsonb,
    'Toxunan səthlərin materialından və hamarlıq dərəcəsindən',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '1b114592-7c2b-4dc1-9a46-84b2e5c0d7d3'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Sürtünmə əmsalı nədən asılıdır?',
    'multiple_choice',
    '["Toxunan səthlərin sahəsindən", "Toxunan səthlərin materialından və hamarlıq dərəcəsindən", "Təzyiq qüvvəsindən", "Cismin kütləsindən", "Dartı qüvvəsindən"]'::jsonb,
    'Toxunan səthlərin materialından və hamarlıq dərəcəsindən',
    9,
    'aa80bbe1-a368-42d0-a304-6bf750656c2f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '2bf5655a-6051-442f-b10d-644e75c86a2b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kütləsi 4 kq olan cisim 5 m/san sürətlə hərəkət edir. Cismin impulsunu hesablayın.',
    'multiple_choice',
    '["10 kq·m/san", "15 kq·m/san", "20 kq·m/san", "25 kq·m/san", "40 kq·m/san"]'::jsonb,
    '20 kq·m/san',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '50bccf14-7742-4184-9987-4d0acfc2cdf9'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Kütləsi 4 kq olan cisim 5 m/san sürətlə hərəkət edir. Cismin impulsunu hesablayın.',
    'multiple_choice',
    '["10 kq·m/san", "15 kq·m/san", "20 kq·m/san", "25 kq·m/san", "40 kq·m/san"]'::jsonb,
    '20 kq·m/san',
    10,
    '2bf5655a-6051-442f-b10d-644e75c86a2b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a6fa5404-887f-42d3-b318-429ee6ad947b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cismin çəkisi hansı cihazla ölçülür?',
    'multiple_choice',
    '["Tərəzi", "Menzurka", "Spidometr", "Barometr", "Dinamometr"]'::jsonb,
    'Dinamometr',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '039b82db-6c3c-42b5-b08a-5d081d05f3c1'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Cismin çəkisi hansı cihazla ölçülür?',
    'multiple_choice',
    '["Tərəzi", "Menzurka", "Spidometr", "Barometr", "Dinamometr"]'::jsonb,
    'Dinamometr',
    11,
    'a6fa5404-887f-42d3-b318-429ee6ad947b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '229a7e5c-952c-43f4-a0c8-89d88775daf0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kütləsi 2 kq olan cismi Yer səthindən 10 m hündürlüyə qaldırdıqda onun potensial enerjisi nə qədər artar (g = 10 m/san²)?',
    'multiple_choice',
    '["20 C", "50 C", "100 C", "150 C", "200 C"]'::jsonb,
    '200 C',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e3fdd260-31ce-4b86-92c4-cca015a955e2'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Kütləsi 2 kq olan cismi Yer səthindən 10 m hündürlüyə qaldırdıqda onun potensial enerjisi nə qədər artar (g = 10 m/san²)?',
    'multiple_choice',
    '["20 C", "50 C", "100 C", "150 C", "200 C"]'::jsonb,
    '200 C',
    12,
    '229a7e5c-952c-43f4-a0c8-89d88775daf0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '158c0cf9-6bce-45f2-9b34-705bb2c57155'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bərabərtəcilli hərəkətdə sürətin zamandan asılılıq düsturu v = 4 + 2t (m/san) şəklindədir. Cismin başlanğıc sürətini və təcilini müəyyən edin.',
    'multiple_choice',
    '["v₀ = 2 m/san, a = 4 m/san²", "v₀ = 4 m/san, a = 4 m/san²", "v₀ = 4 m/san, a = 2 m/san²", "v₀ = 0, a = 2 m/san²", "v₀ = 2 m/san, a = 2 m/san²"]'::jsonb,
    'v₀ = 4 m/san, a = 2 m/san²',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '987ef4df-7e68-49b5-88ef-e3ed201d2599'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Bərabərtəcilli hərəkətdə sürətin zamandan asılılıq düsturu v = 4 + 2t (m/san) şəklindədir. Cismin başlanğıc sürətini və təcilini müəyyən edin.',
    'multiple_choice',
    '["v₀ = 2 m/san, a = 4 m/san²", "v₀ = 4 m/san, a = 4 m/san²", "v₀ = 4 m/san, a = 2 m/san²", "v₀ = 0, a = 2 m/san²", "v₀ = 2 m/san, a = 2 m/san²"]'::jsonb,
    'v₀ = 4 m/san, a = 2 m/san²',
    13,
    '158c0cf9-6bce-45f2-9b34-705bb2c57155'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '38f884c9-011d-4f24-81d2-376fd1624daa'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İki nöqtəvi yük arasındakı məsafəni 2 dəfə azaltdıqda onlar arasındakı Kulon qarşılıqlı təsir qüvvəsi necə dəyişər?',
    'multiple_choice',
    '["4 dəfə artar", "2 dəfə artar", "2 dəfə azalar", "4 dəfə azalar", "Dəyişməz"]'::jsonb,
    '4 dəfə artar',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ab84fcce-61b9-45d6-aaa9-2bd315672b0b'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'İki nöqtəvi yük arasındakı məsafəni 2 dəfə azaltdıqda onlar arasındakı Kulon qarşılıqlı təsir qüvvəsi necə dəyişər?',
    'multiple_choice',
    '["4 dəfə artar", "2 dəfə artar", "2 dəfə azalar", "4 dəfə azalar", "Dəyişməz"]'::jsonb,
    '4 dəfə artar',
    14,
    '38f884c9-011d-4f24-81d2-376fd1624daa'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3895ed4f-f875-456f-b712-21daf1861d98'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Rəqs periodu T = 0,05 san olan rəqqasın rəqs tezliyini tapın.',
    'multiple_choice',
    '["5 Hs", "10 Hs", "15 Hs", "20 Hs", "50 Hs"]'::jsonb,
    '20 Hs',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'aab9d257-b723-4491-867d-d0f106a3cd99'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Rəqs periodu T = 0,05 san olan rəqqasın rəqs tezliyini tapın.',
    'multiple_choice',
    '["5 Hs", "10 Hs", "15 Hs", "20 Hs", "50 Hs"]'::jsonb,
    '20 Hs',
    15,
    '3895ed4f-f875-456f-b712-21daf1861d98'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '372e9063-7fad-4e7c-bb7f-c74705759742'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş kütləli ideal qazın mütləq temperaturunu sabit həcmdə (V = const) 3 dəfə artırdıqda onun təzyiqi necə dəyişər?',
    'multiple_choice',
    '["3 dəfə azalar", "9 dəfə artar", "Dəyişməz", "3 dəfə artar", "√3 dəfə artar"]'::jsonb,
    '3 dəfə artar',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8ba6a94b-0d81-42d8-a6f0-e825e35da9f0'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Verilmiş kütləli ideal qazın mütləq temperaturunu sabit həcmdə (V = const) 3 dəfə artırdıqda onun təzyiqi necə dəyişər?',
    'multiple_choice',
    '["3 dəfə azalar", "9 dəfə artar", "Dəyişməz", "3 dəfə artar", "√3 dəfə artar"]'::jsonb,
    '3 dəfə artar',
    16,
    '372e9063-7fad-4e7c-bb7f-c74705759742'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '81456037-c0fd-4587-b318-a336fb4f2f4b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Müqavimətləri R₁ = 6 Om və R₂ = 3 Om olan iki naqil paralel birləşdirilmişdir. Dövrə hissəsinin ümumi müqavimətini tapın.',
    'multiple_choice',
    '["9 Om", "4,5 Om", "3 Om", "1,5 Om", "2 Om"]'::jsonb,
    '2 Om',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8ef719d6-e597-4bf0-a2eb-adef66deee11'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Müqavimətləri R₁ = 6 Om və R₂ = 3 Om olan iki naqil paralel birləşdirilmişdir. Dövrə hissəsinin ümumi müqavimətini tapın.',
    'multiple_choice',
    '["9 Om", "4,5 Om", "3 Om", "1,5 Om", "2 Om"]'::jsonb,
    '2 Om',
    17,
    '81456037-c0fd-4587-b318-a336fb4f2f4b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '99c41812-58c1-498f-b632-296a533bd9a5'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Sabit maqnit sahəsində maqnit induksiya xətlərinə perpendikulyar istiqamətdə daxil olan yüklü zərrəciyə təsir edən Lorens qüvvəsinin təsiri ilə zərrəcik hansı trayektoriya üzrə hərəkət edər?',
    'multiple_choice',
    '["Düz xətt", "Çevrə", "Parabola", "Vint xətti", "Hiperbola"]'::jsonb,
    'Çevrə',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2195fd5b-1895-44c0-bea6-3ce35b8bfd9c'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Sabit maqnit sahəsində maqnit induksiya xətlərinə perpendikulyar istiqamətdə daxil olan yüklü zərrəciyə təsir edən Lorens qüvvəsinin təsiri ilə zərrəcik hansı trayektoriya üzrə hərəkət edər?',
    'multiple_choice',
    '["Düz xətt", "Çevrə", "Parabola", "Vint xətti", "Hiperbola"]'::jsonb,
    'Çevrə',
    18,
    '99c41812-58c1-498f-b632-296a533bd9a5'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cffeff89-33cb-4a2a-aef3-1bbef647db83'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İşığın vakuumdan sındırma əmsalı n = 1,5 olan mühitə keçərkən yayılma sürəti neçə km/san olar (c = 300000 km/san)?',
    'multiple_choice',
    '["200000 km/san", "150000 km/san", "300000 km/san", "450000 km/san", "250000 km/san"]'::jsonb,
    '200000 km/san',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2d4ef4cd-1ac1-40c7-9aca-31a114f14036'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'İşığın vakuumdan sındırma əmsalı n = 1,5 olan mühitə keçərkən yayılma sürəti neçə km/san olar (c = 300000 km/san)?',
    'multiple_choice',
    '["200000 km/san", "150000 km/san", "300000 km/san", "450000 km/san", "250000 km/san"]'::jsonb,
    '200000 km/san',
    19,
    'cffeff89-33cb-4a2a-aef3-1bbef647db83'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cf780bcc-87fb-469c-b988-45ff492f9775'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Radioaktiv nüvə 1 alfa (α) çevrilməyə məruz qaldıqda əmələ gələn yeni nüvənin yük ədədi (Z) və kütlə ədədi (A) necə dəyişər?',
    'multiple_choice',
    '["Z 2 vahid artar, A 4 vahid artar", "Z 2 vahid azalar, A 4 vahid azalar", "Z 1 vahid artar, A dəyişməz", "Z 4 vahid azalar, A 2 vahid azalar", "Z dəyişməz, A 4 vahid azalar"]'::jsonb,
    'Z 2 vahid azalar, A 4 vahid azalar',
    'Fizika',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Fizika"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '960fd985-0f8a-4e0a-b50f-d65fbcc37e16'::uuid,
    '10410fe3-0ac1-48e6-aec8-c557bc5f0415'::uuid,
    'Radioaktiv nüvə 1 alfa (α) çevrilməyə məruz qaldıqda əmələ gələn yeni nüvənin yük ədədi (Z) və kütlə ədədi (A) necə dəyişər?',
    'multiple_choice',
    '["Z 2 vahid artar, A 4 vahid artar", "Z 2 vahid azalar, A 4 vahid azalar", "Z 1 vahid artar, A dəyişməz", "Z 4 vahid azalar, A 2 vahid azalar", "Z dəyişməz, A 4 vahid azalar"]'::jsonb,
    'Z 2 vahid azalar, A 4 vahid azalar',
    20,
    'cf780bcc-87fb-469c-b988-45ff492f9775'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Kimya (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Kimya - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kimya (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Kimya fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Kimya',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '230296',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'c8f8c3ee-a539-4836-b829-6cb0cea690e9'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində karbonil (>C=O) funksional qrupu olan üzvi birləşmə hansıdır?',
    'multiple_choice',
    '["Etilenqlikol", "Fenol", "Aseton", "Qliserin", "Naftalin"]'::jsonb,
    'Aseton',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '36f3ab9d-19b8-4c98-bbb4-16134dce942b'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Tərkibində karbonil (>C=O) funksional qrupu olan üzvi birləşmə hansıdır?',
    'multiple_choice',
    '["Etilenqlikol", "Fenol", "Aseton", "Qliserin", "Naftalin"]'::jsonb,
    'Aseton',
    1,
    'c8f8c3ee-a539-4836-b829-6cb0cea690e9'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '675db39b-bb7f-4dc5-98f9-fec144d257dc'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Buten-1 (CH₂=CH-CH₂-CH₃) molekulunda olan karbon atomları hansı hibrid elektron buludlarına malikdir?
I. sp²
II. sp³
III. sp',
    'multiple_choice',
    '["I və III", "Yalnız II", "Yalnız I", "I və II", "II və III"]'::jsonb,
    'I və II',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_kim_q02.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bd944e16-b65d-4fde-950c-28d8e60eac9d'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Buten-1 (CH₂=CH-CH₂-CH₃) molekulunda olan karbon atomları hansı hibrid elektron buludlarına malikdir?
I. sp²
II. sp³
III. sp',
    'multiple_choice',
    '["I və III", "Yalnız II", "Yalnız I", "I və II", "II və III"]'::jsonb,
    'I və II',
    2,
    '675db39b-bb7f-4dc5-98f9-fec144d257dc'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_kim_q02.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6cf5f641-d31e-4bb7-b3e2-ba338651684c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində ¹²₆C, ¹³₆C, ¹₁H və ²₁H (deyterium) izotopları olan C₂H₂, C₂H₄ və C₂H₆-dan ibarət 174 q qaz qarışığı tam yandıqda 6 mol adi su (¹H₂O) və 3 mol ağır su (²H₂O) alınır. İlkin qarışıqda olan ağır karbon (¹³₆C) izotopunun mol sayını müəyyən edin.',
    'multiple_choice',
    '["4", "3", "6", "5", "2"]'::jsonb,
    '3',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '03c7cd0e-3a93-4016-8025-9e1390c6c354'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Tərkibində ¹²₆C, ¹³₆C, ¹₁H və ²₁H (deyterium) izotopları olan C₂H₂, C₂H₄ və C₂H₆-dan ibarət 174 q qaz qarışığı tam yandıqda 6 mol adi su (¹H₂O) və 3 mol ağır su (²H₂O) alınır. İlkin qarışıqda olan ağır karbon (¹³₆C) izotopunun mol sayını müəyyən edin.',
    'multiple_choice',
    '["4", "3", "6", "5", "2"]'::jsonb,
    '3',
    3,
    '6cf5f641-d31e-4bb7-b3e2-ba338651684c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f8f0a89f-112f-45aa-b263-11e0f5c10139'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Müəyyən temperatur və qatılıqda nitrat turşusu (HNO₃) sink (Zn) ilə reaksiyaya daxil olaraq 1:3 mol nisbətində NO₂ və NO qazları əmələ gətirir. 1 mol sink ilə reaksiyaya daxil olan ümumi HNO₃-ün mol sayını müəyyən edin.',
    'multiple_choice',
    '["2,8", "4,0", "2,6", "2,67", "3,0"]'::jsonb,
    '2,6',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4ab4af2f-5ce3-49c0-98fc-724cfdfa3dfd'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Müəyyən temperatur və qatılıqda nitrat turşusu (HNO₃) sink (Zn) ilə reaksiyaya daxil olaraq 1:3 mol nisbətində NO₂ və NO qazları əmələ gətirir. 1 mol sink ilə reaksiyaya daxil olan ümumi HNO₃-ün mol sayını müəyyən edin.',
    'multiple_choice',
    '["2,8", "4,0", "2,6", "2,67", "3,0"]'::jsonb,
    '2,6',
    4,
    'f8f0a89f-112f-45aa-b263-11e0f5c10139'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '572b4240-3533-4c1a-ae9a-df054dda74f4'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '20 sm³ 0,50 M qatılıqlı barium-nitrat Ba(NO₃)₂ məhlulu ilə 30 sm³ 0,35 M qatılıqlı natrium-sulfat Na₂SO₄ məhlulu qarışdırılır. Çökmə reaksiyası başa çatdıqdan sonra məhlulda ən aşağı qatılıqda qalan ion aşağıdakılardan hansıdır?',
    'multiple_choice',
    '["Ba²⁺", "Na⁺", "SO₄²⁻", "NO₃⁻", "Hər biri eyni qatılıqda olacaq"]'::jsonb,
    'Ba²⁺',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b02aca1e-6c51-4ae3-94c1-4a68d374c4d2'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    '20 sm³ 0,50 M qatılıqlı barium-nitrat Ba(NO₃)₂ məhlulu ilə 30 sm³ 0,35 M qatılıqlı natrium-sulfat Na₂SO₄ məhlulu qarışdırılır. Çökmə reaksiyası başa çatdıqdan sonra məhlulda ən aşağı qatılıqda qalan ion aşağıdakılardan hansıdır?',
    'multiple_choice',
    '["Ba²⁺", "Na⁺", "SO₄²⁻", "NO₃⁻", "Hər biri eyni qatılıqda olacaq"]'::jsonb,
    'Ba²⁺',
    5,
    '572b4240-3533-4c1a-ae9a-df054dda74f4'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '97f25db9-c7a1-461e-a4c2-f778e6a35c39'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş çevrilmələr sxemində:
1) CH₃-CH=CH₂ + HBr → X (Markovnikov qaydası üzrə əsas məhsul)
2) 2X + 2Na → Y + 2NaBr (Vürs reaksiyası)
Əmələ gələn X və Y maddələri hansı bənddə doğru verilmişdir?',
    'multiple_choice',
    '["X: 2-brompropan | Y: n-heksan", "X: 2-brompropan | Y: 2-metilpentan", "X: 1-brompropan | Y: 1,3-dimetilbutan", "X: 1-brompropan | Y: n-heksan", "X: 2-brompropan | Y: 2,3-dimetilbutan"]'::jsonb,
    'X: 2-brompropan | Y: 2,3-dimetilbutan',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2cf1915d-6973-4372-bf2c-bdfb0c0e6fa2'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Verilmiş çevrilmələr sxemində:
1) CH₃-CH=CH₂ + HBr → X (Markovnikov qaydası üzrə əsas məhsul)
2) 2X + 2Na → Y + 2NaBr (Vürs reaksiyası)
Əmələ gələn X və Y maddələri hansı bənddə doğru verilmişdir?',
    'multiple_choice',
    '["X: 2-brompropan | Y: n-heksan", "X: 2-brompropan | Y: 2-metilpentan", "X: 1-brompropan | Y: 1,3-dimetilbutan", "X: 1-brompropan | Y: n-heksan", "X: 2-brompropan | Y: 2,3-dimetilbutan"]'::jsonb,
    'X: 2-brompropan | Y: 2,3-dimetilbutan',
    6,
    '97f25db9-c7a1-461e-a4c2-f778e6a35c39'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'efd685c1-62bd-48fe-8418-e2d116d56645'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıdakı maddələrdən hansının suda həll olması zamanı ion-dipol və ya hidrogen rabitəsi yaranmır (qeyri-polyar həlledicidə həll olan qeyri-polyar maddədir)?',
    'multiple_choice',
    '["KCl", "C₆H₁₂O₆", "NH₃", "C₂H₅OH", "CS₂"]'::jsonb,
    'CS₂',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6d8883da-d4b4-4603-ab0d-567977653afd'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Aşağıdakı maddələrdən hansının suda həll olması zamanı ion-dipol və ya hidrogen rabitəsi yaranmır (qeyri-polyar həlledicidə həll olan qeyri-polyar maddədir)?',
    'multiple_choice',
    '["KCl", "C₆H₁₂O₆", "NH₃", "C₂H₅OH", "CS₂"]'::jsonb,
    'CS₂',
    7,
    'efd685c1-62bd-48fe-8418-e2d116d56645'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e9084745-2657-4776-8a56-f4bd508dd25e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Ammonyaka (NH₃, Mr=17) nisbətən sıxlığı 5,06 olan 100 q doymuş karbohidrogen (alkan) əldə etmək üçün Dyuma reaksiyası üzrə (R-COONa + NaOH → R-H + Na₂CO₃) hansı karbon turşusunun natrium duzundan neçə qram götürmək lazımdır? Ar(Na)=23, Ar(C)=12, Ar(N)=14, Ar(O)=16, Ar(H)=1.',
    'multiple_choice',
    '["176,74 q C₇H₁₃O₂Na", "121,44 q C₆H₁₁O₂Na", "109,12 q C₅H₉O₂Na", "96,81 q C₄H₇O₂Na", "153,02 q C₆H₁₁O₂Na"]'::jsonb,
    '176,74 q C₇H₁₃O₂Na',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '32630807-b262-48a0-a19b-72a3a46f7f3e'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Ammonyaka (NH₃, Mr=17) nisbətən sıxlığı 5,06 olan 100 q doymuş karbohidrogen (alkan) əldə etmək üçün Dyuma reaksiyası üzrə (R-COONa + NaOH → R-H + Na₂CO₃) hansı karbon turşusunun natrium duzundan neçə qram götürmək lazımdır? Ar(Na)=23, Ar(C)=12, Ar(N)=14, Ar(O)=16, Ar(H)=1.',
    'multiple_choice',
    '["176,74 q C₇H₁₃O₂Na", "121,44 q C₆H₁₁O₂Na", "109,12 q C₅H₉O₂Na", "96,81 q C₄H₇O₂Na", "153,02 q C₆H₁₁O₂Na"]'::jsonb,
    '176,74 q C₇H₁₃O₂Na',
    8,
    'e9084745-2657-4776-8a56-f4bd508dd25e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4f579759-aa58-4a3b-b319-9625b0063e4b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Kadmium-sulfat (CdSO₄) məhlulundan 0,402 A şiddətli sabit cərəyan keçirdikdə nə qədər zamandan sonra katodda 3,36 q kadmium (Cd) metalı ayrılar? Ar(Cd)=112, F=96500 Kl/mol.',
    'multiple_choice',
    '["2 saat", "6 saat", "4 saat", "8 saat", "1 saat"]'::jsonb,
    '4 saat',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8b9cf852-59ad-4e19-b34c-5e6f4cbe286d'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Kadmium-sulfat (CdSO₄) məhlulundan 0,402 A şiddətli sabit cərəyan keçirdikdə nə qədər zamandan sonra katodda 3,36 q kadmium (Cd) metalı ayrılar? Ar(Cd)=112, F=96500 Kl/mol.',
    'multiple_choice',
    '["2 saat", "6 saat", "4 saat", "8 saat", "1 saat"]'::jsonb,
    '4 saat',
    9,
    '4f579759-aa58-4a3b-b319-9625b0063e4b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6db0ed29-688e-4072-904f-132607e9bb51'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində qarışıq olmayan 14 mol metanın (CH₄) 1500°C-də pirolizi (2CH₄ → C₂H₂ + 3H₂) zamanı 120,96 litr (n.ş.) asetilen (C₂H₂) alınır. Reaksiyanın çıxımını (%-lə) hesablayın.',
    'multiple_choice',
    '["57%", "67%", "77%", "87%", "97%"]'::jsonb,
    '77%',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '49f50c52-9d4b-455c-9f9f-d1c2eb204171'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Tərkibində qarışıq olmayan 14 mol metanın (CH₄) 1500°C-də pirolizi (2CH₄ → C₂H₂ + 3H₂) zamanı 120,96 litr (n.ş.) asetilen (C₂H₂) alınır. Reaksiyanın çıxımını (%-lə) hesablayın.',
    'multiple_choice',
    '["57%", "67%", "77%", "87%", "97%"]'::jsonb,
    '77%',
    10,
    '6db0ed29-688e-4072-904f-132607e9bb51'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '30be7e58-4766-44fc-a57f-a7a455b37203'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində kütləcə 80% maqnetit (Fe₃O₄) olan hər 1 ton (1000 kq) dəmir filizindən 570 kq çuqun əridilir ki, həmin çuqunun da tərkibində 95% dəmir (Fe) var. Dəmirin çıxımını (%-lə) hesablayın. Ar(Fe)=56, Ar(O)=16.',
    'multiple_choice',
    '["43,32%", "86,67%", "13,33%", "93,54%", "76,00%"]'::jsonb,
    '93,54%',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'dae97791-a296-48b1-9652-0fb7b28e6e4f'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Tərkibində kütləcə 80% maqnetit (Fe₃O₄) olan hər 1 ton (1000 kq) dəmir filizindən 570 kq çuqun əridilir ki, həmin çuqunun da tərkibində 95% dəmir (Fe) var. Dəmirin çıxımını (%-lə) hesablayın. Ar(Fe)=56, Ar(O)=16.',
    'multiple_choice',
    '["43,32%", "86,67%", "13,33%", "93,54%", "76,00%"]'::jsonb,
    '93,54%',
    11,
    '30be7e58-4766-44fc-a57f-a7a455b37203'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'edf58446-c385-4636-8f1c-27449cee46bd'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıda verilən 3 reaksiyanın tarazlıq sabitlərindən (K₁, K₂, K₃) istifadə edərək, yekun reaksiyanın tarazlıq sabitini (K) ifadə edin:
1) 1/2 N₂ + O₂ ⇄ NO₂   (K₁)
2) 2NO₂ ⇄ 2NO + O₂   (K₂)
3) NOBr ⇄ NO + 1/2 Br₂   (K₃)
Yekun reaksiya: 1/2 N₂ + 1/2 O₂ + 1/2 Br₂ ⇄ NOBr   (K = ?)',
    'multiple_choice',
    '["K₁ / (K₂^(1/2) · K₃)", "K₁ + K₂ - 2K₃", "2K₁ - K₂ - K₃", "(K₁ · K₂^(1/2)) / K₃", "2K₁ + K₃"]'::jsonb,
    '(K₁ · K₂^(1/2)) / K₃',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4d50b1c6-c04f-4972-b4e2-5b14a4574c40'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Aşağıda verilən 3 reaksiyanın tarazlıq sabitlərindən (K₁, K₂, K₃) istifadə edərək, yekun reaksiyanın tarazlıq sabitini (K) ifadə edin:
1) 1/2 N₂ + O₂ ⇄ NO₂   (K₁)
2) 2NO₂ ⇄ 2NO + O₂   (K₂)
3) NOBr ⇄ NO + 1/2 Br₂   (K₃)
Yekun reaksiya: 1/2 N₂ + 1/2 O₂ + 1/2 Br₂ ⇄ NOBr   (K = ?)',
    'multiple_choice',
    '["K₁ / (K₂^(1/2) · K₃)", "K₁ + K₂ - 2K₃", "2K₁ - K₂ - K₃", "(K₁ · K₂^(1/2)) / K₃", "2K₁ + K₃"]'::jsonb,
    '(K₁ · K₂^(1/2)) / K₃',
    12,
    'edf58446-c385-4636-8f1c-27449cee46bd'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '96a12803-4ecc-46c2-a341-2b24be14a73a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tərkibində kütləcə 26,5% pentan (C₅H₁₂, Mr=72) və 73,5% oktan (C₈H₁₈, Mr=114) olan 54,3 qram qarışıq artıq miqdarda oksigenlə tam yandırıldığı zaman ayrılan istilik nə qədər suyun temperaturunu 23,6°C-dən 48,2°C-yə qaldırar? Sistemin faydalı iş əmsalı 86%, suyun xüsusi istilik tutumu c = 4,18 C/(q·°C)-dir. Standart əmələgəlmə entalpiyaları: ΔH°f(C₅H₁₂) = -147,0 kC/mol, ΔH°f(C₈H₁₈) = -250,0 kC/mol, ΔH°f(CO₂) = -393,5 kC/mol, ΔH°f(H₂O, m) = -285,8 kC/mol.',
    'multiple_choice',
    '["12,67 kq", "16,98 kq", "21,93 kq", "25,49 kq", "27,85 kq"]'::jsonb,
    '21,93 kq',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b52e28a3-ec7b-4549-b64b-6e0b2d544ad7'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Tərkibində kütləcə 26,5% pentan (C₅H₁₂, Mr=72) və 73,5% oktan (C₈H₁₈, Mr=114) olan 54,3 qram qarışıq artıq miqdarda oksigenlə tam yandırıldığı zaman ayrılan istilik nə qədər suyun temperaturunu 23,6°C-dən 48,2°C-yə qaldırar? Sistemin faydalı iş əmsalı 86%, suyun xüsusi istilik tutumu c = 4,18 C/(q·°C)-dir. Standart əmələgəlmə entalpiyaları: ΔH°f(C₅H₁₂) = -147,0 kC/mol, ΔH°f(C₈H₁₈) = -250,0 kC/mol, ΔH°f(CO₂) = -393,5 kC/mol, ΔH°f(H₂O, m) = -285,8 kC/mol.',
    'multiple_choice',
    '["12,67 kq", "16,98 kq", "21,93 kq", "25,49 kq", "27,85 kq"]'::jsonb,
    '21,93 kq',
    13,
    '96a12803-4ecc-46c2-a341-2b24be14a73a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b54367fb-7f72-416d-857d-458cf1eea01c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İdeal qazlar haqqında verilən məlumatlardan hansı(-lar) doğrudur?
I. Real qazlar yüksək təzyiq və aşağı temperaturda ideal qazlar kimi davranırlar.
II. İdeal qazlarda hissəciklər arasında güclü cazibə və itələmə qüvvələri vardır.
III. İdeal qaz modelində hissəciklərin məxsusi həcmi qabın həcminə nəzərən sıfır qəbul edilir.',
    'multiple_choice',
    '["I və III", "Yalnız II", "Yalnız III", "I, II və III", "II və III"]'::jsonb,
    'Yalnız III',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fd446bdc-fc85-4fbe-a708-0fe844c10225'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'İdeal qazlar haqqında verilən məlumatlardan hansı(-lar) doğrudur?
I. Real qazlar yüksək təzyiq və aşağı temperaturda ideal qazlar kimi davranırlar.
II. İdeal qazlarda hissəciklər arasında güclü cazibə və itələmə qüvvələri vardır.
III. İdeal qaz modelində hissəciklərin məxsusi həcmi qabın həcminə nəzərən sıfır qəbul edilir.',
    'multiple_choice',
    '["I və III", "Yalnız II", "Yalnız III", "I, II və III", "II və III"]'::jsonb,
    'Yalnız III',
    14,
    'b54367fb-7f72-416d-857d-458cf1eea01c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '19b364fa-4d48-41b8-bea3-9a11b86b41e6'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qrafik elektron quruluşunu tamamlayan sonuncu elektronu n = 3, l = 1, m_l = -1 kvant ədədlərinə malik olan X elementinin valent orbitallarında 2 cütləşməmiş elektron olduğuna görə, bu element (₁₄Si və ya ₁₆S) haqqında verilmiş məlumatlardan hansılar doğrudur?
I. Əsas yarımqrup (p-blok) elementidir.
II. Qələvi-torpaq metalıdır.
III. +4 oksidləşmə dərəcəsinə malik ola bilər.
IV. 3s² 3p¹ qısa elektron formuluna malikdir.',
    'multiple_choice',
    '["I, II və III", "I və III", "II və IV", "I, III və IV", "I, II və IV"]'::jsonb,
    'I və III',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f9e85d9e-2843-4aae-b356-602b6172bc0d'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Qrafik elektron quruluşunu tamamlayan sonuncu elektronu n = 3, l = 1, m_l = -1 kvant ədədlərinə malik olan X elementinin valent orbitallarında 2 cütləşməmiş elektron olduğuna görə, bu element (₁₄Si və ya ₁₆S) haqqında verilmiş məlumatlardan hansılar doğrudur?
I. Əsas yarımqrup (p-blok) elementidir.
II. Qələvi-torpaq metalıdır.
III. +4 oksidləşmə dərəcəsinə malik ola bilər.
IV. 3s² 3p¹ qısa elektron formuluna malikdir.',
    'multiple_choice',
    '["I, II və III", "I və III", "II və IV", "I, III və IV", "I, II və IV"]'::jsonb,
    'I və III',
    15,
    '19b364fa-4d48-41b8-bea3-9a11b86b41e6'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '68ab8439-52be-4a39-b8f8-9c815ab05cde'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıda verilmiş zərrəciklərdən hansıların hər üçündə s və d yarımsəviyyələrində yerləşən ümumi elektronların sayı bir-birinə bərabərdir? (₂₅Mn, ₂₆Fe, ₂₇Co, ₂₈Ni)',
    'multiple_choice',
    '["Co³⁺, Mn²⁺, Ni", "Fe²⁺, Ni, Mn²⁺", "Ni, Co³⁺, Fe²⁺", "Fe²⁺, Co³⁺, Mn²⁺", "Fe, Mn, Co"]'::jsonb,
    'Ni, Co³⁺, Fe²⁺',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'edfbc5f7-f985-4e46-b654-0a3e3c9b780e'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Aşağıda verilmiş zərrəciklərdən hansıların hər üçündə s və d yarımsəviyyələrində yerləşən ümumi elektronların sayı bir-birinə bərabərdir? (₂₅Mn, ₂₆Fe, ₂₇Co, ₂₈Ni)',
    'multiple_choice',
    '["Co³⁺, Mn²⁺, Ni", "Fe²⁺, Ni, Mn²⁺", "Ni, Co³⁺, Fe²⁺", "Fe²⁺, Co³⁺, Mn²⁺", "Fe, Mn, Co"]'::jsonb,
    'Ni, Co³⁺, Fe²⁺',
    16,
    '68ab8439-52be-4a39-b8f8-9c815ab05cde'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6c5c3466-665e-474c-bf40-6b37595485c5'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hipofosfit turşusu (H₃PO₂) üçün tam doğru mülahizə hansıdır?',
    'multiple_choice',
    '["Formulunda 3 hidrogen atomu olduğu üçün üçəsaslı turşudur.", "Çoxəsaslı güclü turşudur.", "Quruluş strukturunda hidrogenlərdən 2-si oksigenə, 1-i fosfora birləşir və buna görə də birəsaslı turşudur.", "Quruluş strukturunda hidrogenlərdən yalnız 1-i oksigenə (-OH), 2-si isə birbaşa fosfora (P-H) birləşir və buna görə də birəsaslı turşudur.", "P atomunun oksidləşmə dərəcəsi +5-dir."]'::jsonb,
    'Quruluş strukturunda hidrogenlərdən yalnız 1-i oksigenə (-OH), 2-si isə birbaşa fosfora (P-H) birləşir və buna görə də birəsaslı turşudur.',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'efb57d24-68d1-4647-8272-ba43e72b7df4'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Hipofosfit turşusu (H₃PO₂) üçün tam doğru mülahizə hansıdır?',
    'multiple_choice',
    '["Formulunda 3 hidrogen atomu olduğu üçün üçəsaslı turşudur.", "Çoxəsaslı güclü turşudur.", "Quruluş strukturunda hidrogenlərdən 2-si oksigenə, 1-i fosfora birləşir və buna görə də birəsaslı turşudur.", "Quruluş strukturunda hidrogenlərdən yalnız 1-i oksigenə (-OH), 2-si isə birbaşa fosfora (P-H) birləşir və buna görə də birəsaslı turşudur.", "P atomunun oksidləşmə dərəcəsi +5-dir."]'::jsonb,
    'Quruluş strukturunda hidrogenlərdən yalnız 1-i oksigenə (-OH), 2-si isə birbaşa fosfora (P-H) birləşir və buna görə də birəsaslı turşudur.',
    17,
    '6c5c3466-665e-474c-bf40-6b37595485c5'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'be14c93f-9062-4fee-a91a-e1e0699ba7a3'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı sırada oksigenin oksidləşmə dərəcəsi verilmiş bütün maddələrdə eynidir (-2)?',
    'multiple_choice',
    '["H₂O, CaO, OF₂", "Na₂O, K₂O, H₂O₂", "SiO₂, NO₂, BaO", "KO₂, MgO, CaO", "Na₂O₂, H₂O₂, O₂F₂"]'::jsonb,
    'SiO₂, NO₂, BaO',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e8f7c81b-e371-4622-bc53-6d67c9fba01a'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Hansı sırada oksigenin oksidləşmə dərəcəsi verilmiş bütün maddələrdə eynidir (-2)?',
    'multiple_choice',
    '["H₂O, CaO, OF₂", "Na₂O, K₂O, H₂O₂", "SiO₂, NO₂, BaO", "KO₂, MgO, CaO", "Na₂O₂, H₂O₂, O₂F₂"]'::jsonb,
    'SiO₂, NO₂, BaO',
    18,
    'be14c93f-9062-4fee-a91a-e1e0699ba7a3'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd99576a2-cbcf-4392-a960-f5ba8a8f01a0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı karbohidrogen sinfinin tam yanması zamanı sərf olunan oksigenin (O₂) maddə miqdarının əmələ gələn karbon-dioksidin (CO₂) maddə miqdarına olan nisbəti karbohidrogenin karbon sayından (n-dən) asılı deyil?',
    'multiple_choice',
    '["Alkan", "Alken", "Alkin", "Alkatrien", "Aren"]'::jsonb,
    'Alken',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a92eaf31-4932-4019-be7b-3b024024947f'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Hansı karbohidrogen sinfinin tam yanması zamanı sərf olunan oksigenin (O₂) maddə miqdarının əmələ gələn karbon-dioksidin (CO₂) maddə miqdarına olan nisbəti karbohidrogenin karbon sayından (n-dən) asılı deyil?',
    'multiple_choice',
    '["Alkan", "Alken", "Alkin", "Alkatrien", "Aren"]'::jsonb,
    'Alken',
    19,
    'd99576a2-cbcf-4392-a960-f5ba8a8f01a0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'bc075fc3-b143-4bc6-b7c1-e449e8f72a3d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Quruluş formulu CH₃-C(CH₃)₂-CH(CH₂CH₃)-CH(CH₃)-CH₂-CH₃ olan şaxəli doymuş karbohidrogen haqqında hansı fikirlər doğrudur?
I. Beynəlxalq (IUPAC) nomenklatura ilə əlifba sırası gözlənilməklə adı «2,2,4-trimetil-3-etilheksan» deyil, «3-etil-2,2,4-trimetilheksan»dır.
II. Maddədəki bütün karbon atomları sp³ hibridləşmə vəziyyətindədir.
III. Molekulları arasında güclü hidrogen rabitəsi əmələ gətirir.',
    'multiple_choice',
    '["Yalnız I", "Yalnız II", "I və II", "I və III", "I, II və III"]'::jsonb,
    'Yalnız II',
    'Kimya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Kimya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_kim_q20.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '6a1d943e-104a-4c32-814b-3386c9c1a1a7'::uuid,
    'bd6c4bc1-e4b5-43e4-95ce-abee1b81265d'::uuid,
    'Quruluş formulu CH₃-C(CH₃)₂-CH(CH₂CH₃)-CH(CH₃)-CH₂-CH₃ olan şaxəli doymuş karbohidrogen haqqında hansı fikirlər doğrudur?
I. Beynəlxalq (IUPAC) nomenklatura ilə əlifba sırası gözlənilməklə adı «2,2,4-trimetil-3-etilheksan» deyil, «3-etil-2,2,4-trimetilheksan»dır.
II. Maddədəki bütün karbon atomları sp³ hibridləşmə vəziyyətindədir.
III. Molekulları arasında güclü hidrogen rabitəsi əmələ gətirir.',
    'multiple_choice',
    '["Yalnız I", "Yalnız II", "I və II", "I və III", "I, II və III"]'::jsonb,
    'Yalnız II',
    20,
    'bc075fc3-b143-4bc6-b7c1-e449e8f72a3d'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_kim_q20.png',
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Biologiya (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Biologiya - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Biologiya (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Biologiya fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Biologiya',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '943763',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ebf45d68-9786-48a7-ad6c-133e2852be1e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hansı canlılar aləminin avtotrof (produsent) nümayəndəsi yoxdur?',
    'multiple_choice',
    '["Hüceyrəsində plastid olan canlıların (Bitkilər)", "Plazmatik membrana malik olan bütün canlıların", "Əsasən sporla çoxalan və xitin hüceyrə divarına malik heterotrof canlılar aləminin (Göbələklər)", "Yalnız prokariot nümayəndəsi olan canlılar aləminin (Bakteriyalar)", "Hərəkət orqanoidinə malik birhüceyrəli eukariotların (Protistlər)"]'::jsonb,
    'Əsasən sporla çoxalan və xitin hüceyrə divarına malik heterotrof canlılar aləminin (Göbələklər)',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fb07b4e0-6934-4b96-a38f-f15bc5e46686'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Hansı canlılar aləminin avtotrof (produsent) nümayəndəsi yoxdur?',
    'multiple_choice',
    '["Hüceyrəsində plastid olan canlıların (Bitkilər)", "Plazmatik membrana malik olan bütün canlıların", "Əsasən sporla çoxalan və xitin hüceyrə divarına malik heterotrof canlılar aləminin (Göbələklər)", "Yalnız prokariot nümayəndəsi olan canlılar aləminin (Bakteriyalar)", "Hərəkət orqanoidinə malik birhüceyrəli eukariotların (Protistlər)"]'::jsonb,
    'Əsasən sporla çoxalan və xitin hüceyrə divarına malik heterotrof canlılar aləminin (Göbələklər)',
    1,
    'ebf45d68-9786-48a7-ad6c-133e2852be1e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'fa46c4d2-27ff-46bc-b305-4858f6eff390'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hüceyrənin meyoz bölünməsinin A (metafaza I) və B (anafaza I) fazaları ilə bağlı verilənlərdən hansı doğru deyil?',
    'multiple_choice',
    '["Hər iki faza meyoz I bölünməsinə aiddir.", "A fazasında bölünmə vətərlərinin sentromerlərə birləşməsi başa çatmışdır.", "B fazasında (anafaza I-də) sentromerlər bölündüyü üçün hüceyrədə xromosom sayı ikiləşmişdir.", "A fazasında xromosom sayı xromatid sayına bərabər deyil (1:2 nisbətindədir).", "B fazasında bölünmə vətərləri qısalaraq homoloji xromosomları qütblərə çəkir."]'::jsonb,
    'B fazasında (anafaza I-də) sentromerlər bölündüyü üçün hüceyrədə xromosom sayı ikiləşmişdir.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_bio_q02.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2c2380cb-7428-4155-9162-8025748e96ca'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Hüceyrənin meyoz bölünməsinin A (metafaza I) və B (anafaza I) fazaları ilə bağlı verilənlərdən hansı doğru deyil?',
    'multiple_choice',
    '["Hər iki faza meyoz I bölünməsinə aiddir.", "A fazasında bölünmə vətərlərinin sentromerlərə birləşməsi başa çatmışdır.", "B fazasında (anafaza I-də) sentromerlər bölündüyü üçün hüceyrədə xromosom sayı ikiləşmişdir.", "A fazasında xromosom sayı xromatid sayına bərabər deyil (1:2 nisbətindədir).", "B fazasında bölünmə vətərləri qısalaraq homoloji xromosomları qütblərə çəkir."]'::jsonb,
    'B fazasında (anafaza I-də) sentromerlər bölündüyü üçün hüceyrədə xromosom sayı ikiləşmişdir.',
    2,
    'fa46c4d2-27ff-46bc-b305-4858f6eff390'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_bio_q02.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '40e280fd-5063-4be1-8660-ed1dadc78eec'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsanda limfa dövranı aşağıdakı funksiyalardan hansılarını yerinə yetirir?
1. Toxumalara birbaşa oksigen daşımaq
2. Qan plazması həcminin bərpasını (toxuma mayesinin qana qaytarılmasını) təmin etmək
3. Nazik bağırsaq xovlarından sorulan yağları (xilomikronları) qan dövranına qoşmaq
4. Toxumalar arasında artıq maye toplanmasını (ödemi) aradan qaldırmaq',
    'multiple_choice',
    '["Yalnız 1, 4", "Yalnız 2, 3", "Yalnız 1, 3, 4", "Yalnız 2, 3, 4", "1, 2, 3, 4"]'::jsonb,
    'Yalnız 2, 3, 4',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'cac87c85-b3cc-4133-beb7-dae7263e8f9c'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'İnsanda limfa dövranı aşağıdakı funksiyalardan hansılarını yerinə yetirir?
1. Toxumalara birbaşa oksigen daşımaq
2. Qan plazması həcminin bərpasını (toxuma mayesinin qana qaytarılmasını) təmin etmək
3. Nazik bağırsaq xovlarından sorulan yağları (xilomikronları) qan dövranına qoşmaq
4. Toxumalar arasında artıq maye toplanmasını (ödemi) aradan qaldırmaq',
    'multiple_choice',
    '["Yalnız 1, 4", "Yalnız 2, 3", "Yalnız 1, 3, 4", "Yalnız 2, 3, 4", "1, 2, 3, 4"]'::jsonb,
    'Yalnız 2, 3, 4',
    3,
    '40e280fd-5063-4be1-8660-ed1dadc78eec'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '9396ad1c-0b84-4805-9464-54d3610f292b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İcmadakı müxtəlif növlərin ümumi sayı (növ zənginliyi) ilə hər növə aid fərdlərin ümumi fərdlərə olan nisbəti (nisbi bolluq) birlikdə hansı ekoloji anlayışı ifadə edir?',
    'multiple_choice',
    '["Nisbi bolluq", "İcmanın növ müxtəlifliyi", "Növ zənginliyi", "Ekosistemin tutumu", "Populyasiyanın sıxlığı"]'::jsonb,
    'İcmanın növ müxtəlifliyi',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7fd5e28f-647f-46a1-a4cb-ff4d8e8ae13e'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'İcmadakı müxtəlif növlərin ümumi sayı (növ zənginliyi) ilə hər növə aid fərdlərin ümumi fərdlərə olan nisbəti (nisbi bolluq) birlikdə hansı ekoloji anlayışı ifadə edir?',
    'multiple_choice',
    '["Nisbi bolluq", "İcmanın növ müxtəlifliyi", "Növ zənginliyi", "Ekosistemin tutumu", "Populyasiyanın sıxlığı"]'::jsonb,
    'İcmanın növ müxtəlifliyi',
    4,
    '9396ad1c-0b84-4805-9464-54d3610f292b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cf6db885-9bdf-4890-b59e-da048ecfed0d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Müəyyən sayda bakteriyaların əlverişli mühitdə hər 20 dəqiqədən bir fasiləsiz bölünməsi zamanı 2 saat ərzində bölünməyə məruz qalan fərdlərin ümumi sayı 504 olmuşdur. Dördüncü bölünməyə ilkin bakteriyalardan birinin neçə fərdi məruz qalmışdır?',
    'multiple_choice',
    '["16", "4", "8", "2", "32"]'::jsonb,
    '8',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '0e51714d-ae6a-4026-b99e-4f4d87f97bda'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Müəyyən sayda bakteriyaların əlverişli mühitdə hər 20 dəqiqədən bir fasiləsiz bölünməsi zamanı 2 saat ərzində bölünməyə məruz qalan fərdlərin ümumi sayı 504 olmuşdur. Dördüncü bölünməyə ilkin bakteriyalardan birinin neçə fərdi məruz qalmışdır?',
    'multiple_choice',
    '["16", "4", "8", "2", "32"]'::jsonb,
    '8',
    5,
    'cf6db885-9bdf-4890-b59e-da048ecfed0d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6e6101b2-ed63-47a9-994a-3e5ec5a0b1ee'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Yetkin göl qurbağası (udaq suda-quruda yaşayan) üçün doğru mülahizələri müəyyən edin:
1. Ürək boşluğunda dövr edən qan növləri (arterial, venoz, qarışıq) ilə bədən damarlarında dövr edən qan növləri eynidir.
2. Postembrional (metamorfik) inkişafı zamanı ürək qulaqcıqlarının sayı artır.
3. Mayalanması daxilidir.
4. Ürəkdən çıxan arteriya qövslərində üç növ qan (arterial, qarışıq, venoz) axır.
5. Onurğa sütunu üç şöbədən ibarətdir.
6. Ürəyinin mədəciyində sürünənlərdəki kimi yarımçıq arakəsmə yoxdur.',
    'multiple_choice',
    '["2, 3, 5", "1, 4, 6", "1, 4, 5, 6", "1, 3, 4, 6", "2, 3, 5, 6"]'::jsonb,
    '1, 4, 6',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_bio_q06.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '43c44f6c-e09f-4702-842e-dd44ad16bf17'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Yetkin göl qurbağası (udaq suda-quruda yaşayan) üçün doğru mülahizələri müəyyən edin:
1. Ürək boşluğunda dövr edən qan növləri (arterial, venoz, qarışıq) ilə bədən damarlarında dövr edən qan növləri eynidir.
2. Postembrional (metamorfik) inkişafı zamanı ürək qulaqcıqlarının sayı artır.
3. Mayalanması daxilidir.
4. Ürəkdən çıxan arteriya qövslərində üç növ qan (arterial, qarışıq, venoz) axır.
5. Onurğa sütunu üç şöbədən ibarətdir.
6. Ürəyinin mədəciyində sürünənlərdəki kimi yarımçıq arakəsmə yoxdur.',
    'multiple_choice',
    '["2, 3, 5", "1, 4, 6", "1, 4, 5, 6", "1, 3, 4, 6", "2, 3, 5, 6"]'::jsonb,
    '1, 4, 6',
    6,
    '6e6101b2-ed63-47a9-994a-3e5ec5a0b1ee'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_bio_q06.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b6fe8005-1642-4149-bf71-442b47fd9feb'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Pankreatit (mədəaltı vəzinin iltihabı) xəstəliyi haqqında verilən fikirlərdən hansı yanlışdır?',
    'multiple_choice',
    '["Mədəaltı vəzi tərəfindən onikibarmaq bağırsağa ifraz olunan amilazanın miqdarı azalır.", "Nazik bağırsaqda həm nişastanın, həm də monomer olan qlükozanın fermentativ həzmi pozulur.", "Bikarbonat ifrazı azaldığı üçün onikibarmaq bağırsaq möhtəviyyatı turş reaksiyalı qala bilər.", "Tripsin və lipaza çatışmazlığı səbəbindən zülal və yağların da həzminin pozulmasına səbəb olur.", "Vəzinin ekzokrin (xarici sekresiya) funksiyasının pozulması ilə müşayiət olunur."]'::jsonb,
    'Nazik bağırsaqda həm nişastanın, həm də monomer olan qlükozanın fermentativ həzmi pozulur.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '2c7219fb-74eb-406f-8064-22c7f63d25e4'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Pankreatit (mədəaltı vəzinin iltihabı) xəstəliyi haqqında verilən fikirlərdən hansı yanlışdır?',
    'multiple_choice',
    '["Mədəaltı vəzi tərəfindən onikibarmaq bağırsağa ifraz olunan amilazanın miqdarı azalır.", "Nazik bağırsaqda həm nişastanın, həm də monomer olan qlükozanın fermentativ həzmi pozulur.", "Bikarbonat ifrazı azaldığı üçün onikibarmaq bağırsaq möhtəviyyatı turş reaksiyalı qala bilər.", "Tripsin və lipaza çatışmazlığı səbəbindən zülal və yağların da həzminin pozulmasına səbəb olur.", "Vəzinin ekzokrin (xarici sekresiya) funksiyasının pozulması ilə müşayiət olunur."]'::jsonb,
    'Nazik bağırsaqda həm nişastanın, həm də monomer olan qlükozanın fermentativ həzmi pozulur.',
    7,
    'b6fe8005-1642-4149-bf71-442b47fd9feb'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'bfba20d6-7902-40a0-bcc4-2134fb389164'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Həm genetik sürüşmə (genetic drift), həm də təbii seçmə üçün hansılar doğrudur?
1. Onlar təkamülün (mikrotəkamülün) hərəkətverici mexanizmləridir.
2. Onların hər ikisi tamamilə təsadüfi proseslərdir.
3. Onların hər ikisi həmişə məqsədyönlü adaptasiyalara səbəb olur.
4. Onlar populyasiyanın genofonduna (allel tezliklərinə) təsir edir.',
    'multiple_choice',
    '["1 və 2", "1 və 3", "2 və 3", "1 və 4", "3 və 4"]'::jsonb,
    '1 və 4',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4e6c0009-10a7-4139-a824-64c6c5579ce9'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Həm genetik sürüşmə (genetic drift), həm də təbii seçmə üçün hansılar doğrudur?
1. Onlar təkamülün (mikrotəkamülün) hərəkətverici mexanizmləridir.
2. Onların hər ikisi tamamilə təsadüfi proseslərdir.
3. Onların hər ikisi həmişə məqsədyönlü adaptasiyalara səbəb olur.
4. Onlar populyasiyanın genofonduna (allel tezliklərinə) təsir edir.',
    'multiple_choice',
    '["1 və 2", "1 və 3", "2 və 3", "1 və 4", "3 və 4"]'::jsonb,
    '1 və 4',
    8,
    'bfba20d6-7902-40a0-bcc4-2134fb389164'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0febefe1-e0bb-4b24-9547-dda772157a50'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsanın xromosom və gen xəstəlikləri ilə bağlı verilən ifadələrdən hansı yanlışdır?',
    'multiple_choice',
    '["Autosom xromosomda müəyyən sahənin itməsi (məs. 5-ci xromosom delesiyası) yalnız əzələ atrofiyasına səbəb olur.", "Xromosom sahəsinin resiprok translokasiyası (məs. Filadelfiya xromosomu) xroniki mieloleykoza səbəb ola bilər.", "Edvards sindromu (18-ci cüt üzrə trisomiya) autosom trisomiyalara aiddir.", "Xromosomdaxili inversiya və aberrasiyalar onkoloji qan xəstəliklərinə (leykoza) səbəb ola bilər.", "Klaynfelter sindromlu (47, XXY) trisomiya olan bir oğlan uşağı X^H X^h Y genotipli olarsa, hemofiliya geninin sağlam daşıyıcısı ola bilər."]'::jsonb,
    'Autosom xromosomda müəyyən sahənin itməsi (məs. 5-ci xromosom delesiyası) yalnız əzələ atrofiyasına səbəb olur.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd281577b-df70-43ed-a627-69af8e6fe291'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'İnsanın xromosom və gen xəstəlikləri ilə bağlı verilən ifadələrdən hansı yanlışdır?',
    'multiple_choice',
    '["Autosom xromosomda müəyyən sahənin itməsi (məs. 5-ci xromosom delesiyası) yalnız əzələ atrofiyasına səbəb olur.", "Xromosom sahəsinin resiprok translokasiyası (məs. Filadelfiya xromosomu) xroniki mieloleykoza səbəb ola bilər.", "Edvards sindromu (18-ci cüt üzrə trisomiya) autosom trisomiyalara aiddir.", "Xromosomdaxili inversiya və aberrasiyalar onkoloji qan xəstəliklərinə (leykoza) səbəb ola bilər.", "Klaynfelter sindromlu (47, XXY) trisomiya olan bir oğlan uşağı X^H X^h Y genotipli olarsa, hemofiliya geninin sağlam daşıyıcısı ola bilər."]'::jsonb,
    'Autosom xromosomda müəyyən sahənin itməsi (məs. 5-ci xromosom delesiyası) yalnız əzələ atrofiyasına səbəb olur.',
    9,
    '0febefe1-e0bb-4b24-9547-dda772157a50'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd711d97d-d4b9-46e3-8fe5-0bff48423e5b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Siçovul populyasiyasında qısa quyruqlu fərdlərin uzun quyruqlu fərdlərlə çarpazlaşmasından alınan heteroziqot hibridlərin quyruğu orta ölçülü olur (natamam dominantlıq). Hardi-Vaynberq tarazlığında olan bu populyasiyada cəmi 2800 fərd var. Onların 448-i qısa quyruqlu olarsa, orta ölçülü quyruğa malik heteroziqot fərdlərin sayını tapın.',
    'multiple_choice',
    '["1344", "1512", "1444", "1314", "2688"]'::jsonb,
    '1344',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '303a4812-a771-40f8-9c8a-176e31a25289'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Siçovul populyasiyasında qısa quyruqlu fərdlərin uzun quyruqlu fərdlərlə çarpazlaşmasından alınan heteroziqot hibridlərin quyruğu orta ölçülü olur (natamam dominantlıq). Hardi-Vaynberq tarazlığında olan bu populyasiyada cəmi 2800 fərd var. Onların 448-i qısa quyruqlu olarsa, orta ölçülü quyruğa malik heteroziqot fərdlərin sayını tapın.',
    'multiple_choice',
    '["1344", "1512", "1444", "1314", "2688"]'::jsonb,
    '1344',
    10,
    'd711d97d-d4b9-46e3-8fe5-0bff48423e5b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '401a98f9-ffcc-4a45-b270-e4232a8806f2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Örtülütoxumlu bitkidə çarpaz tozlanma zamanı rüşeym kisəsinin mayalanmada bilavasitə iştirak etməyən hüceyrələrinin (3 antipod + 2 sinergid = 5 haploid hüceyrə) xromosom saylarının cəmi 65 ədəddir. Əmələ gələn ziqotun xromosom dəsti isə yumurta-hüceyrənin xromosom dəstindən 3 dəfə çoxdur (ziqot = 3n, yəni tozcuq 4n tetraploid bitkidən gəlmiş və hər spermi 2n xromosom dəstinə malikdir). Tozcuq dənəsindəki iki spermidə və əmələ gələn endosperm hüceyrəsində cəmi neçə xromosom olar?',
    'multiple_choice',
    '["100", "65", "104", "208", "200"]'::jsonb,
    '104',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '44e10879-e62f-4666-9f21-a5b130575c69'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Örtülütoxumlu bitkidə çarpaz tozlanma zamanı rüşeym kisəsinin mayalanmada bilavasitə iştirak etməyən hüceyrələrinin (3 antipod + 2 sinergid = 5 haploid hüceyrə) xromosom saylarının cəmi 65 ədəddir. Əmələ gələn ziqotun xromosom dəsti isə yumurta-hüceyrənin xromosom dəstindən 3 dəfə çoxdur (ziqot = 3n, yəni tozcuq 4n tetraploid bitkidən gəlmiş və hər spermi 2n xromosom dəstinə malikdir). Tozcuq dənəsindəki iki spermidə və əmələ gələn endosperm hüceyrəsində cəmi neçə xromosom olar?',
    'multiple_choice',
    '["100", "65", "104", "208", "200"]'::jsonb,
    '104',
    11,
    '401a98f9-ffcc-4a45-b270-e4232a8806f2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '622be94e-f411-4f25-9ac8-6e2caf185cb2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Hüceyrənin meyoz bölünməsi ilə bağlı verilən fikirlərdən hansı yanlışdır?',
    'multiple_choice',
    '["Meyoz zamanı profaza I və metafaza I fazalarında xromosomlar ikixromatidli olur.", "Meyoz zamanı metafaza I və metafaza II mərhələsində ekvator müstəvisində ikixromatidli xromosomlar düzülür.", "Meyozun birinci bölünməsi zamanı ikixromatidli homoloji xromosomların qütblərə çəkilməsi nəticəsində iki hüceyrə əmələ gəlir.", "Meyozun birinci bölünməsi nəticəsində əmələ gələn hüceyrələrdə xromosom sayı xromatid sayına bərabər olur.", "Tam meyoz bölünmə prosesində ümumilikdə üç hüceyrə (1 ilkin + 2 ikinci dərəcəli) bölünməyə məruz qalır."]'::jsonb,
    'Meyozun birinci bölünməsi nəticəsində əmələ gələn hüceyrələrdə xromosom sayı xromatid sayına bərabər olur.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '9df50c20-bb84-4dd8-b436-fbf78f288be2'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Hüceyrənin meyoz bölünməsi ilə bağlı verilən fikirlərdən hansı yanlışdır?',
    'multiple_choice',
    '["Meyoz zamanı profaza I və metafaza I fazalarında xromosomlar ikixromatidli olur.", "Meyoz zamanı metafaza I və metafaza II mərhələsində ekvator müstəvisində ikixromatidli xromosomlar düzülür.", "Meyozun birinci bölünməsi zamanı ikixromatidli homoloji xromosomların qütblərə çəkilməsi nəticəsində iki hüceyrə əmələ gəlir.", "Meyozun birinci bölünməsi nəticəsində əmələ gələn hüceyrələrdə xromosom sayı xromatid sayına bərabər olur.", "Tam meyoz bölünmə prosesində ümumilikdə üç hüceyrə (1 ilkin + 2 ikinci dərəcəli) bölünməyə məruz qalır."]'::jsonb,
    'Meyozun birinci bölünməsi nəticəsində əmələ gələn hüceyrələrdə xromosom sayı xromatid sayına bərabər olur.',
    12,
    '622be94e-f411-4f25-9ac8-6e2caf185cb2'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3abc1bb4-6f2c-44d6-8e58-ecb5464fb023'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Eukariot hüceyrədə ribosom orqanoidinin zülal sintezi (translyasiya) aktivliyinin kəskin artması sitoplazmadakı molekullardan hansıların sərbəst miqdarının azalmasına səbəb olar?
I. Aminturşuların
II. Suyun
III. Fermentlərin
IV. ATF-in',
    'multiple_choice',
    '["I, II", "I, IV", "II, III", "III, IV", "II, III, IV"]'::jsonb,
    'I, IV',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '9f5907d0-e814-4618-8660-624876834dd8'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Eukariot hüceyrədə ribosom orqanoidinin zülal sintezi (translyasiya) aktivliyinin kəskin artması sitoplazmadakı molekullardan hansıların sərbəst miqdarının azalmasına səbəb olar?
I. Aminturşuların
II. Suyun
III. Fermentlərin
IV. ATF-in',
    'multiple_choice',
    '["I, II", "I, IV", "II, III", "III, IV", "II, III, IV"]'::jsonb,
    'I, IV',
    13,
    '3abc1bb4-6f2c-44d6-8e58-ecb5464fb023'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '658d720c-b6fd-447b-ad06-869a1f9b4bdc'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Ksilemanın traxeid və boru (damar) elementlərində ikincili hüceyrə divarının həlqəvi/spiralvari qalınlaşması və ligninləşməsi suyun daşınması üçün mühüm təkamül uyğunlaşması hesab olunur, çünki:',
    'multiple_choice',
    '["Divarların ligninləşməsi yalnız kök sistemində osmotik təzyiqi artırır.", "Ligninin hidrofob təbiəti hüceyrələrin suyu aktiv nəqliyyatla udmasına kömək edir.", "Transpirasiya nəticəsində yaranan güclü mənfi təzyiq (sorucu qüvvə) altında su sütununun və damar divarlarının içəriyə doğru çökməsinə (kollapsına) müqavimət göstərir.", "Lignin su molekullarını ATF enerjisi hesabına yuxarı itələyir.", "Lignin canlı sitoplazmanın bölünməsini sürətləndirir."]'::jsonb,
    'Transpirasiya nəticəsində yaranan güclü mənfi təzyiq (sorucu qüvvə) altında su sütununun və damar divarlarının içəriyə doğru çökməsinə (kollapsına) müqavimət göstərir.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ba0b05fd-a651-4e9d-99b4-421c0abe48af'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Ksilemanın traxeid və boru (damar) elementlərində ikincili hüceyrə divarının həlqəvi/spiralvari qalınlaşması və ligninləşməsi suyun daşınması üçün mühüm təkamül uyğunlaşması hesab olunur, çünki:',
    'multiple_choice',
    '["Divarların ligninləşməsi yalnız kök sistemində osmotik təzyiqi artırır.", "Ligninin hidrofob təbiəti hüceyrələrin suyu aktiv nəqliyyatla udmasına kömək edir.", "Transpirasiya nəticəsində yaranan güclü mənfi təzyiq (sorucu qüvvə) altında su sütununun və damar divarlarının içəriyə doğru çökməsinə (kollapsına) müqavimət göstərir.", "Lignin su molekullarını ATF enerjisi hesabına yuxarı itələyir.", "Lignin canlı sitoplazmanın bölünməsini sürətləndirir."]'::jsonb,
    'Transpirasiya nəticəsində yaranan güclü mənfi təzyiq (sorucu qüvvə) altında su sütununun və damar divarlarının içəriyə doğru çökməsinə (kollapsına) müqavimət göstərir.',
    14,
    '658d720c-b6fd-447b-ad06-869a1f9b4bdc'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '37aea262-8319-4423-b09e-7e060cd0648f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İnsanda steroid (lipid mənşəli) və peptid (zülal mənşəli) hormonlar üçün əksərən ortaq olan xüsusiyyət hansıdır?',
    'multiple_choice',
    '["Fosfolipid qoşa qatından (hüceyrə membranından) sərbəst diffuziya ilə keçmə qabiliyyəti", "Endokrin vəzilərdən ifraz olunaraq hədəf hüceyrələrə qan dövranı ilə nəql olunma tələbatı", "Spesifik reseptorlarının yalnız plazmatik membranın xarici səthində yerləşməsi", "Hüceyrə daxilində ikincili vasitəçi (məs. tsAMF) kaskadını işə salması", "Hədəf hüceyrələrdə birbaşa nüvəyə daxil olaraq gen transkripsiyasını aktivləşdirməsi"]'::jsonb,
    'Endokrin vəzilərdən ifraz olunaraq hədəf hüceyrələrə qan dövranı ilə nəql olunma tələbatı',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'aa6faa5c-66e4-4e75-a12e-efb1241cfa93'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'İnsanda steroid (lipid mənşəli) və peptid (zülal mənşəli) hormonlar üçün əksərən ortaq olan xüsusiyyət hansıdır?',
    'multiple_choice',
    '["Fosfolipid qoşa qatından (hüceyrə membranından) sərbəst diffuziya ilə keçmə qabiliyyəti", "Endokrin vəzilərdən ifraz olunaraq hədəf hüceyrələrə qan dövranı ilə nəql olunma tələbatı", "Spesifik reseptorlarının yalnız plazmatik membranın xarici səthində yerləşməsi", "Hüceyrə daxilində ikincili vasitəçi (məs. tsAMF) kaskadını işə salması", "Hədəf hüceyrələrdə birbaşa nüvəyə daxil olaraq gen transkripsiyasını aktivləşdirməsi"]'::jsonb,
    'Endokrin vəzilərdən ifraz olunaraq hədəf hüceyrələrə qan dövranı ilə nəql olunma tələbatı',
    15,
    '37aea262-8319-4423-b09e-7e060cd0648f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5d60d448-6269-43a5-8f42-d5ef951b5372'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Platyhelminthes (Yastı qurdlar) tipinə aid sərbəstyaşayan canlıların dorso-ventral yastılaşmış bədən quruluşu onlara ilk növbədə nə üçün kömək edir?',
    'multiple_choice',
    '["Yalnız şaquli istiqamətdə sürətli üzməyə", "Quru mühitdə bədən mayesinin buxarlanmasını azaltmağa", "Qeyri-cinsi çoxalmanı sürətləndirməyə", "Qan dövranı və tənəffüs sistemi olmadığı üçün bədən hüceyrələri ilə xarici mühit arasındakı diffuziya məsafəsini minimuma endirib təması maksimuma çatdırmağa", "Qapalı qan-damar sistemində təzyiqi artırmağa"]'::jsonb,
    'Qan dövranı və tənəffüs sistemi olmadığı üçün bədən hüceyrələri ilə xarici mühit arasındakı diffuziya məsafəsini minimuma endirib təması maksimuma çatdırmağa',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f1fabdd2-23c1-4336-b049-8b83a61073f0'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Platyhelminthes (Yastı qurdlar) tipinə aid sərbəstyaşayan canlıların dorso-ventral yastılaşmış bədən quruluşu onlara ilk növbədə nə üçün kömək edir?',
    'multiple_choice',
    '["Yalnız şaquli istiqamətdə sürətli üzməyə", "Quru mühitdə bədən mayesinin buxarlanmasını azaltmağa", "Qeyri-cinsi çoxalmanı sürətləndirməyə", "Qan dövranı və tənəffüs sistemi olmadığı üçün bədən hüceyrələri ilə xarici mühit arasındakı diffuziya məsafəsini minimuma endirib təması maksimuma çatdırmağa", "Qapalı qan-damar sistemində təzyiqi artırmağa"]'::jsonb,
    'Qan dövranı və tənəffüs sistemi olmadığı üçün bədən hüceyrələri ilə xarici mühit arasındakı diffuziya məsafəsini minimuma endirib təması maksimuma çatdırmağa',
    16,
    '5d60d448-6269-43a5-8f42-d5ef951b5372'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '17b0ef20-ad51-4f7a-8796-6ad1826b0150'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Şirin su və dəniz sümüklü balıqlarında daxili mühit ilə xarici mühit arasındakı osmotik tarazlıqla bağlı aşağıdakı ifadələrdən hansı doğru deyil?',
    'multiple_choice',
    '["Dəniz balıqlarının daxili mühiti dəniz suyuna görə hipoosmotik olduğundan davamlı su itirirlər və dəniz suyu içirlər.", "Şirin su balıqlarının daxili mühiti şirin suya görə hiperosmotik olduğundan normal halda su içmirlər.", "Şirin su balıqları osmotik tarazlığı təmin etmək üçün çox قاتı (hiperosmotik) sidik xaric edirlər.", "Dəniz balıqları içdikləri sudan aldıqları artıq duzu qəlsəmələrindəki xüsusi hüceyrələrlə aktiv şəkildə xaricə atırlar.", "Şirin su balıqları çatışmayan ionları qəlsəmələri vasitəsilə sudan aktiv nəqliyyatla alırlar."]'::jsonb,
    'Şirin su balıqları osmotik tarazlığı təmin etmək üçün çox قاتı (hiperosmotik) sidik xaric edirlər.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ecaf522e-97b4-49b1-93f5-3ac180d7951f'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Şirin su və dəniz sümüklü balıqlarında daxili mühit ilə xarici mühit arasındakı osmotik tarazlıqla bağlı aşağıdakı ifadələrdən hansı doğru deyil?',
    'multiple_choice',
    '["Dəniz balıqlarının daxili mühiti dəniz suyuna görə hipoosmotik olduğundan davamlı su itirirlər və dəniz suyu içirlər.", "Şirin su balıqlarının daxili mühiti şirin suya görə hiperosmotik olduğundan normal halda su içmirlər.", "Şirin su balıqları osmotik tarazlığı təmin etmək üçün çox قاتı (hiperosmotik) sidik xaric edirlər.", "Dəniz balıqları içdikləri sudan aldıqları artıq duzu qəlsəmələrindəki xüsusi hüceyrələrlə aktiv şəkildə xaricə atırlar.", "Şirin su balıqları çatışmayan ionları qəlsəmələri vasitəsilə sudan aktiv nəqliyyatla alırlar."]'::jsonb,
    'Şirin su balıqları osmotik tarazlığı təmin etmək üçün çox قاتı (hiperosmotik) sidik xaric edirlər.',
    17,
    '17b0ef20-ad51-4f7a-8796-6ad1826b0150'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '92aa7357-7105-433c-a2c7-2b99aaf34a59'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Qırmızı palıd (Quercus rubra) kimi bəzi bitki növləri fotosintez prosesinə kəskin mənfi təsir göstərmədən uzun müddət davam edən quraqlığa dözə bilirlər. Aşağıdakı fizioloji adaptasiyalardan hansının bu qabiliyyətə (torpaqdan suyun davamlı çəkilməsinə) töhfə vermə ehtimalı daha yüksəkdir?',
    'multiple_choice',
    '["Ağızcıqların gündüz vaxtı tamamilə və həmişəlik qapanması", "Osmotik tənzimləmə hesabına yarpaq hüceyrələrinin böyük mənfi su potensialına malik olması", "C₄ bitkilərinə xas Kranz yarpaq anatomiyası", "Dayaz səthi saçaqlı kök sistemi", "Yarpaq ayasının səth sahəsinin kəskin genişlənməsi"]'::jsonb,
    'Osmotik tənzimləmə hesabına yarpaq hüceyrələrinin böyük mənfi su potensialına malik olması',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a5b2162c-31cf-4c86-84bd-46e41296d0ae'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Qırmızı palıd (Quercus rubra) kimi bəzi bitki növləri fotosintez prosesinə kəskin mənfi təsir göstərmədən uzun müddət davam edən quraqlığa dözə bilirlər. Aşağıdakı fizioloji adaptasiyalardan hansının bu qabiliyyətə (torpaqdan suyun davamlı çəkilməsinə) töhfə vermə ehtimalı daha yüksəkdir?',
    'multiple_choice',
    '["Ağızcıqların gündüz vaxtı tamamilə və həmişəlik qapanması", "Osmotik tənzimləmə hesabına yarpaq hüceyrələrinin böyük mənfi su potensialına malik olması", "C₄ bitkilərinə xas Kranz yarpaq anatomiyası", "Dayaz səthi saçaqlı kök sistemi", "Yarpaq ayasının səth sahəsinin kəskin genişlənməsi"]'::jsonb,
    'Osmotik tənzimləmə hesabına yarpaq hüceyrələrinin böyük mənfi su potensialına malik olması',
    18,
    '92aa7357-7105-433c-a2c7-2b99aaf34a59'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '693e45d6-76a9-44ba-9188-06b805e066eb'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Müxtəlif hüceyrə tiplərini araşdıran bir şagirdin aşağıdakı fikirlərindən hansı yanlışdır?',
    'multiple_choice',
    '["Eukariot hüceyrələrdə rast gəlinən hüceyrə divarlarının kimyəvi quruluşu (sellüloza, xitin) bir-birindən fərqli ola bilər.", "Prokariot hüceyrələrdə (bakteriya və arxeylərdə) rast gəlinən hüceyrə divarlarının quruluşu bir-birindən fərqli ola bilər.", "Nüvəsini itirən heç bir eukariot hüceyrə (məsələn, məməlilərin yetkin eritrositləri və ya ələkvarı borular) bir gün belə həyat fəaliyyətini davam etdirə bilməz.", "İrsi maddəsi (DNT-si) olmayan hüceyrə mitoz və ya meyoz yolla bölünə bilməz.", "Prokariot hüceyrələrin sitoplazmasında membranlı orqanoidlər (mitoxondri, EŞ, Holci) olmur."]'::jsonb,
    'Nüvəsini itirən heç bir eukariot hüceyrə (məsələn, məməlilərin yetkin eritrositləri və ya ələkvarı borular) bir gün belə həyat fəaliyyətini davam etdirə bilməz.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '135d56ad-3427-4ee2-a564-a0edd29e733a'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Müxtəlif hüceyrə tiplərini araşdıran bir şagirdin aşağıdakı fikirlərindən hansı yanlışdır?',
    'multiple_choice',
    '["Eukariot hüceyrələrdə rast gəlinən hüceyrə divarlarının kimyəvi quruluşu (sellüloza, xitin) bir-birindən fərqli ola bilər.", "Prokariot hüceyrələrdə (bakteriya və arxeylərdə) rast gəlinən hüceyrə divarlarının quruluşu bir-birindən fərqli ola bilər.", "Nüvəsini itirən heç bir eukariot hüceyrə (məsələn, məməlilərin yetkin eritrositləri və ya ələkvarı borular) bir gün belə həyat fəaliyyətini davam etdirə bilməz.", "İrsi maddəsi (DNT-si) olmayan hüceyrə mitoz və ya meyoz yolla bölünə bilməz.", "Prokariot hüceyrələrin sitoplazmasında membranlı orqanoidlər (mitoxondri, EŞ, Holci) olmur."]'::jsonb,
    'Nüvəsini itirən heç bir eukariot hüceyrə (məsələn, məməlilərin yetkin eritrositləri və ya ələkvarı borular) bir gün belə həyat fəaliyyətini davam etdirə bilməz.',
    19,
    '693e45d6-76a9-44ba-9188-06b805e066eb'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'bb9bd69b-90fa-4f91-afb1-82de87aeef84'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Aşağıdakılardan hansı Antarktika kimi sərt soyuq mühitlərdə yaşayan pinqvinlərin buz üzərində dayanarkən ayaq səthindən yerə istilik itirməsinin qarşısını alan əsas anatomik-fizioloji adaptasiyadır?',
    'multiple_choice',
    '["Pinqvinlər soyuğa cavab olaraq ətrafların səthi kapilyar damarlarını reflektor şəkildə maksimum genişləndirirlər.", "Pinqvinlər mühit temperaturu aşağı düşdükdə qış yuxusuna gedərək bədən temperaturlarını 0°C-yə endirirlər.", "Pinqvinlər ayaqlarındakı temperaturu 40°C-də saxlamaq üçün ürək döyüntülərini 10 dəfə artırırlar.", "Pinqvinin ayaqlarındakı arteriya və vena damarları bir-birinə sıx paralel yerləşərək əks-axınlı istilik mübadiləsi sistemi yaradır: isti arterial qan ayağa doğru axarkən istiliyini ayaqdan qayıdan soyuq venoz qana ötürür.", "Pinqvinlərin ayaqlarında qan damarları tamamilə reduksiya olunmuşdur."]'::jsonb,
    'Pinqvinin ayaqlarındakı arteriya və vena damarları bir-birinə sıx paralel yerləşərək əks-axınlı istilik mübadiləsi sistemi yaradır: isti arterial qan ayağa doğru axarkən istiliyini ayaqdan qayıdan soyuq venoz qana ötürür.',
    'Biologiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Biologiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c7c79a9a-c274-4673-b429-8c112a88e3d0'::uuid,
    'b9f05ab7-c6ca-46a1-ae43-a3fbc26035f3'::uuid,
    'Aşağıdakılardan hansı Antarktika kimi sərt soyuq mühitlərdə yaşayan pinqvinlərin buz üzərində dayanarkən ayaq səthindən yerə istilik itirməsinin qarşısını alan əsas anatomik-fizioloji adaptasiyadır?',
    'multiple_choice',
    '["Pinqvinlər soyuğa cavab olaraq ətrafların səthi kapilyar damarlarını reflektor şəkildə maksimum genişləndirirlər.", "Pinqvinlər mühit temperaturu aşağı düşdükdə qış yuxusuna gedərək bədən temperaturlarını 0°C-yə endirirlər.", "Pinqvinlər ayaqlarındakı temperaturu 40°C-də saxlamaq üçün ürək döyüntülərini 10 dəfə artırırlar.", "Pinqvinin ayaqlarındakı arteriya və vena damarları bir-birinə sıx paralel yerləşərək əks-axınlı istilik mübadiləsi sistemi yaradır: isti arterial qan ayağa doğru axarkən istiliyini ayaqdan qayıdan soyuq venoz qana ötürür.", "Pinqvinlərin ayaqlarında qan damarları tamamilə reduksiya olunmuşdur."]'::jsonb,
    'Pinqvinin ayaqlarındakı arteriya və vena damarları bir-birinə sıx paralel yerləşərək əks-axınlı istilik mübadiləsi sistemi yaradır: isti arterial qan ayağa doğru axarkən istiliyini ayaqdan qayıdan soyuq venoz qana ötürür.',
    20,
    'bb9bd69b-90fa-4f91-afb1-82de87aeef84'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Tarix (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Tarix - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tarix (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Tarix fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Tarix',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '721892',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7c90d7be-55f3-464a-b8e7-a15e2066ac04'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cədvəldə qədim mədəniyyətlərə (Misir/Mesopotamiya, Hindistan, Yunanıstan, Roma) aid uyğunsuzluğun verildiyi bəndi müəyyən edin:',
    'multiple_choice',
    '["Kahin | Şeyxülislam", "Ra | Brahma", "Parfenon | Panteon", "Fidi | Böyük Plini", "Maq | Yepiskop"]'::jsonb,
    'Fidi | Böyük Plini',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'd2826833-935c-41c0-bd4f-04c039a0acc6'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Cədvəldə qədim mədəniyyətlərə (Misir/Mesopotamiya, Hindistan, Yunanıstan, Roma) aid uyğunsuzluğun verildiyi bəndi müəyyən edin:',
    'multiple_choice',
    '["Kahin | Şeyxülislam", "Ra | Brahma", "Parfenon | Panteon", "Fidi | Böyük Plini", "Maq | Yepiskop"]'::jsonb,
    'Fidi | Böyük Plini',
    1,
    '7c90d7be-55f3-464a-b8e7-a15e2066ac04'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'd6347ad1-b287-49c9-9b87-ae67f3f8fb09'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '1) Tarixə «21 Azər» hərəkatı kimi daxil olmuşdur;
2) S.C. Pişəvəri başda olmaqla Milli Hökumət yaradılmışdır.
Haqqında bəhs edilən və Cənubi Azərbaycanda baş vermiş milli-demokratik hərəkatın (1945–1946) Ş.M. Xiyabani hərəkatından (1920) fərqli xüsusiyyətlərini müəyyən edin:
1. Qacarlar sülaləsinin hakimiyyəti dövründə baş vermişdir.
2. Milli Hökumət yaradılmışdır.
3. Təbriz Universiteti təsis olunmuşdur.
4. Çar Rusiyasından hərbi yardım alınmışdır.
5. Azərbaycan dilinin rəsmi dövlət dili elan edilməsi («Dil haqqında» qanun) qəbul olunmuşdur.',
    'multiple_choice',
    '["4, 5", "2, 3", "1, 4", "1, 2", "3, 5"]'::jsonb,
    '3, 5',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '03da885a-f1c4-4917-9716-9760361f0009'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    '1) Tarixə «21 Azər» hərəkatı kimi daxil olmuşdur;
2) S.C. Pişəvəri başda olmaqla Milli Hökumət yaradılmışdır.
Haqqında bəhs edilən və Cənubi Azərbaycanda baş vermiş milli-demokratik hərəkatın (1945–1946) Ş.M. Xiyabani hərəkatından (1920) fərqli xüsusiyyətlərini müəyyən edin:
1. Qacarlar sülaləsinin hakimiyyəti dövründə baş vermişdir.
2. Milli Hökumət yaradılmışdır.
3. Təbriz Universiteti təsis olunmuşdur.
4. Çar Rusiyasından hərbi yardım alınmışdır.
5. Azərbaycan dilinin rəsmi dövlət dili elan edilməsi («Dil haqqında» qanun) qəbul olunmuşdur.',
    'multiple_choice',
    '["4, 5", "2, 3", "1, 4", "1, 2", "3, 5"]'::jsonb,
    '3, 5',
    2,
    'd6347ad1-b287-49c9-9b87-ae67f3f8fb09'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '94fab561-321a-400c-a901-805e1ac29e39'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Manna hökmdarı Ahşerinin hakimiyyəti dövrünə (e.ə. 675–650) aid olanları müəyyən edin:
1. Assur sərhəd qalalarına mannalıların hücumlar etməsi və müstəqil xarici siyasət yeritməsi
2. Ölkə daxilində narazı qüvvələrin üsyanının baş verməsi
3. Midiya və Babilə qarşı Assuriya ilə ittifaq yaratması
4. Urartunun təhriki ilə İranzuya qarşı üsyan etməsi
5. Assuriya ilə ənənəvi ittifaqın bərpa edilməsi',
    'multiple_choice',
    '["2, 3", "Yalnız 2", "1, 2", "4, 5", "Yalnız 5"]'::jsonb,
    '1, 2',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_tar_q03.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4e6e30a6-394c-4ee4-aa69-7c0cd679409b'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Manna hökmdarı Ahşerinin hakimiyyəti dövrünə (e.ə. 675–650) aid olanları müəyyən edin:
1. Assur sərhəd qalalarına mannalıların hücumlar etməsi və müstəqil xarici siyasət yeritməsi
2. Ölkə daxilində narazı qüvvələrin üsyanının baş verməsi
3. Midiya və Babilə qarşı Assuriya ilə ittifaq yaratması
4. Urartunun təhriki ilə İranzuya qarşı üsyan etməsi
5. Assuriya ilə ənənəvi ittifaqın bərpa edilməsi',
    'multiple_choice',
    '["2, 3", "Yalnız 2", "1, 2", "4, 5", "Yalnız 5"]'::jsonb,
    '1, 2',
    3,
    '94fab561-321a-400c-a901-805e1ac29e39'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_tar_q03.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3c11fe9a-be39-40cc-8562-ebd004879845'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '1410-cu il Sərdrud döyüşündən fərqli olaraq 1421-ci il Alaşkert döyüşündə:',
    'multiple_choice',
    '["Ərdəbil hakimliyi Şirvanşahlarla müttəfiq olmuşdur", "Teymurilərin Azərbaycanda hakimiyyətinə son qoyulmuşdur", "Qaraqoyunlu hökmdarı Qara Yusif iştirak etmişdir", "Cəlairilər məğlub olmuşdur", "Teymurilər (Sultan Şahrux) qalib gəlmişdir"]'::jsonb,
    'Teymurilər (Sultan Şahrux) qalib gəlmişdir',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'e205522a-6bcb-4163-a9eb-efbef1bb87e1'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    '1410-cu il Sərdrud döyüşündən fərqli olaraq 1421-ci il Alaşkert döyüşündə:',
    'multiple_choice',
    '["Ərdəbil hakimliyi Şirvanşahlarla müttəfiq olmuşdur", "Teymurilərin Azərbaycanda hakimiyyətinə son qoyulmuşdur", "Qaraqoyunlu hökmdarı Qara Yusif iştirak etmişdir", "Cəlairilər məğlub olmuşdur", "Teymurilər (Sultan Şahrux) qalib gəlmişdir"]'::jsonb,
    'Teymurilər (Sultan Şahrux) qalib gəlmişdir',
    4,
    '3c11fe9a-be39-40cc-8562-ebd004879845'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'ffd6b373-9eea-4b45-a8f0-7464000eff5b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'E.ə. 188-ci il Apameya sülhü ilə e.ə. 53-cü il Karra döyüşü arasındakı dövrdə və qədim dövrdə baş vermiş hadisələrdən uyğun olanları müəyyən edin:
1. Karra döyüşünün baş verməsi (e.ə. 53)
2. Çində «Sarısarıqlılar» üsyanının baş verməsi (b.e. 184)
3. Manna hökmdarı İranzuya qarşı üsyanların baş verməsi (e.ə. 719)
4. Maqneziya döyüşünün baş verməsi (e.ə. 190)
5. Əhəmənilər dövlətinə son qoyulması (e.ə. 330)',
    'multiple_choice',
    '["2, 5", "2, 1", "1, 4", "3, 5", "5, 1"]'::jsonb,
    '3, 5',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_tar_q05.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'cf4894d0-8a9d-4287-9a6f-6a654a97b805'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'E.ə. 188-ci il Apameya sülhü ilə e.ə. 53-cü il Karra döyüşü arasındakı dövrdə və qədim dövrdə baş vermiş hadisələrdən uyğun olanları müəyyən edin:
1. Karra döyüşünün baş verməsi (e.ə. 53)
2. Çində «Sarısarıqlılar» üsyanının baş verməsi (b.e. 184)
3. Manna hökmdarı İranzuya qarşı üsyanların baş verməsi (e.ə. 719)
4. Maqneziya döyüşünün baş verməsi (e.ə. 190)
5. Əhəmənilər dövlətinə son qoyulması (e.ə. 330)',
    'multiple_choice',
    '["2, 5", "2, 1", "1, 4", "3, 5", "5, 1"]'::jsonb,
    '3, 5',
    5,
    'ffd6b373-9eea-4b45-a8f0-7464000eff5b'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_tar_q05.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4475a9ce-20b0-4cc8-ba90-857524201623'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'IX–XI əsrlər Azərbaycan tarixi üçün xarakterik deyil:',
    'multiple_choice',
    '["Kəndlilərin uluc və azad olmaqla iki qrupa bölünməsi", "Xassə torpaq mülkiyyətinin mövcud olması", "Salari hökmdarı Mərzban ibn Məhəmmədin «Qanunnamə» qəbul etməsi", "Rəvvadilər dövlətinin Səlcuq dövlətindən asılı hala düşməsi", "Şəddadilər dövlətinin süqutundan sonra Dəbil əmirliyinin XII əsrdə yaranması"]'::jsonb,
    'Şəddadilər dövlətinin süqutundan sonra Dəbil əmirliyinin XII əsrdə yaranması',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '7e0d9b53-71db-47bf-8b84-f9288a8f7159'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'IX–XI əsrlər Azərbaycan tarixi üçün xarakterik deyil:',
    'multiple_choice',
    '["Kəndlilərin uluc və azad olmaqla iki qrupa bölünməsi", "Xassə torpaq mülkiyyətinin mövcud olması", "Salari hökmdarı Mərzban ibn Məhəmmədin «Qanunnamə» qəbul etməsi", "Rəvvadilər dövlətinin Səlcuq dövlətindən asılı hala düşməsi", "Şəddadilər dövlətinin süqutundan sonra Dəbil əmirliyinin XII əsrdə yaranması"]'::jsonb,
    'Şəddadilər dövlətinin süqutundan sonra Dəbil əmirliyinin XII əsrdə yaranması',
    6,
    '4475a9ce-20b0-4cc8-ba90-857524201623'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4b048a89-244d-4391-a727-f0a9b7de3319'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XIX əsrin dünya tarixində daha sonra baş vermişdir:',
    'multiple_choice',
    '["Şimali Alman İttifaqı üçün konstitusiya hazırlanması (1867)", "İngiltərə qoşunlarının Vaşinqtonu ələ keçirməsi (1814)", "Rusiyanın Krım müharibəsində məğlub olması (1856)", "Osmanlı dövlətində «Gülxanə xətti-şərif»inin verilməsi (1839)", "Böyük Moğol dövlətinə rəsmən son qoyulması (1858)"]'::jsonb,
    'Şimali Alman İttifaqı üçün konstitusiya hazırlanması (1867)',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_tar_q07.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '3bc79ee0-95c6-47ac-a50c-e2dbe1239627'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'XIX əsrin dünya tarixində daha sonra baş vermişdir:',
    'multiple_choice',
    '["Şimali Alman İttifaqı üçün konstitusiya hazırlanması (1867)", "İngiltərə qoşunlarının Vaşinqtonu ələ keçirməsi (1814)", "Rusiyanın Krım müharibəsində məğlub olması (1856)", "Osmanlı dövlətində «Gülxanə xətti-şərif»inin verilməsi (1839)", "Böyük Moğol dövlətinə rəsmən son qoyulması (1858)"]'::jsonb,
    'Şimali Alman İttifaqı üçün konstitusiya hazırlanması (1867)',
    7,
    '4b048a89-244d-4391-a727-f0a9b7de3319'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_tar_q07.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5232f154-1e8b-45ae-8f79-904d24fb7d5f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XX əsrin əvvəlləri Fransa iqtisadiyyatına aid olan amilləri seçin:
1. Kapital ixracına (sələmçi imperializmə) görə dünyada İngiltərədən sonra ikinci yerdə olması
2. Yeni sənaye sahələri olan aviasiya və avtomobil sənayesinin sürətlə inkişaf etməsi
3. Almaniyaya qarşı xarici siyasətdə «revanşizm» təbliğatının aparılması
4. Sənaye məhsullarının istehsal həcminə görə dünyada yalnız ABŞ və Almaniyadan geri qalması (üçüncü yerdə İngiltərə idi)
5. Dünyanın yeganə maliyyə mərkəzi olması',
    'multiple_choice',
    '["2, 5", "1, 2", "1, 3, 4", "3, 4, 5", "1, 2, 3"]'::jsonb,
    '1, 2',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '72b08812-684a-414b-b31a-a7df3b106cf5'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'XX əsrin əvvəlləri Fransa iqtisadiyyatına aid olan amilləri seçin:
1. Kapital ixracına (sələmçi imperializmə) görə dünyada İngiltərədən sonra ikinci yerdə olması
2. Yeni sənaye sahələri olan aviasiya və avtomobil sənayesinin sürətlə inkişaf etməsi
3. Almaniyaya qarşı xarici siyasətdə «revanşizm» təbliğatının aparılması
4. Sənaye məhsullarının istehsal həcminə görə dünyada yalnız ABŞ və Almaniyadan geri qalması (üçüncü yerdə İngiltərə idi)
5. Dünyanın yeganə maliyyə mərkəzi olması',
    'multiple_choice',
    '["2, 5", "1, 2", "1, 3, 4", "3, 4, 5", "1, 2, 3"]'::jsonb,
    '1, 2',
    8,
    '5232f154-1e8b-45ae-8f79-904d24fb7d5f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a4e67c31-6107-483c-84d4-d02b4ccf1fce'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Gəncə xanlığının müstəqil mövcudluğu dövründə (1747–1804) baş vermişdir:
1. Şərqi Gürcüstanın (Kartli-Kaxetiya çarlığının) Rusiyaya birləşdirilməsi (1801)
2. Şamaxı xanlığının Rusiya tərəfindən işğalı (1805)
3. Georgiyevsk müqaviləsinin imzalanması (1783)
4. General Sisianovun Bakı yaxınlığında öldürülməsi (1806)
5. Qacarlar dövlətinin meydana gəlməsi (1796)',
    'multiple_choice',
    '["1, 2, 3", "2, 4, 5", "1, 3, 5", "2, 3, 4", "1, 4, 5"]'::jsonb,
    '1, 3, 5',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '05c815d5-f9f8-4b3a-8cd1-fe76770e2fe4'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Gəncə xanlığının müstəqil mövcudluğu dövründə (1747–1804) baş vermişdir:
1. Şərqi Gürcüstanın (Kartli-Kaxetiya çarlığının) Rusiyaya birləşdirilməsi (1801)
2. Şamaxı xanlığının Rusiya tərəfindən işğalı (1805)
3. Georgiyevsk müqaviləsinin imzalanması (1783)
4. General Sisianovun Bakı yaxınlığında öldürülməsi (1806)
5. Qacarlar dövlətinin meydana gəlməsi (1796)',
    'multiple_choice',
    '["1, 2, 3", "2, 4, 5", "1, 3, 5", "2, 3, 4", "1, 4, 5"]'::jsonb,
    '1, 3, 5',
    9,
    'a4e67c31-6107-483c-84d4-d02b4ccf1fce'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f7aa420b-6eaf-4ded-8fcf-8d9df8dcb859'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Şimali Azərbaycanda 1870-ci il 14 mayda keçirilmiş burjua kəndli islahatına aid deyil:',
    'multiple_choice',
    '["Sahibkar kəndlilərinə istifadə etdikləri pay torpaq sahələrini satın almaq hüququ verildi", "Sahibkar kəndliləri məhsulun onda biri qədər malcəhət (bəhrə) vergisini ödəməli idi", "Biyarın əvəzinə kəndlilər üçün pul mükəlləfiyyəti müəyyən edildi", "Sahibkar kəndlisinə satın alacağı torpağın yuxarı həddi dəqiq olaraq yalnız 5 desyatin (ailə üzrə deyil, kişi başına minimum hədd idi) olmalı idi", "Kəndli pay torpağını mülkədarla razılaşma əsasında ala bilərdi"]'::jsonb,
    'Sahibkar kəndlisinə satın alacağı torpağın yuxarı həddi dəqiq olaraq yalnız 5 desyatin (ailə üzrə deyil, kişi başına minimum hədd idi) olmalı idi',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '058c0ce7-96f5-450d-96a4-061df192892a'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Şimali Azərbaycanda 1870-ci il 14 mayda keçirilmiş burjua kəndli islahatına aid deyil:',
    'multiple_choice',
    '["Sahibkar kəndlilərinə istifadə etdikləri pay torpaq sahələrini satın almaq hüququ verildi", "Sahibkar kəndliləri məhsulun onda biri qədər malcəhət (bəhrə) vergisini ödəməli idi", "Biyarın əvəzinə kəndlilər üçün pul mükəlləfiyyəti müəyyən edildi", "Sahibkar kəndlisinə satın alacağı torpağın yuxarı həddi dəqiq olaraq yalnız 5 desyatin (ailə üzrə deyil, kişi başına minimum hədd idi) olmalı idi", "Kəndli pay torpağını mülkədarla razılaşma əsasında ala bilərdi"]'::jsonb,
    'Sahibkar kəndlisinə satın alacağı torpağın yuxarı həddi dəqiq olaraq yalnız 5 desyatin (ailə üzrə deyil, kişi başına minimum hədd idi) olmalı idi',
    10,
    'f7aa420b-6eaf-4ded-8fcf-8d9df8dcb859'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '4db946ca-5275-4313-93e1-0d3afdfe4144'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XIII–XV əsrlər Azərbaycan tarixi ilə bağlı uyğunluq gözlənilmişdir:',
    'multiple_choice',
    '["Elxanilər dövründə xan və ailəsinə məxsus torpaqlar adlanırdı – vəqf", "Xarəzmşah Cəlaləddinin yürüşünə məruz qalmışdı – Eldənizlər hökmdarı Əbu Bəkr", "Kəndlilərin bir yerdən başqa yerə köçünü qadağan etmişdi – Hülakü xan", "Monqolların Azərbaycana ikinci yürüşü zamanı (1231) xərac verərək dağıntıdan xilas edilmiş və tabe edilmişdi – Təbriz şəhəri", "Cəlairilərin Azərbaycanda hakimiyyətinə 1382-ci ildə son qoymuşdu – Ağqoyunlu dövləti"]'::jsonb,
    'Monqolların Azərbaycana ikinci yürüşü zamanı (1231) xərac verərək dağıntıdan xilas edilmiş və tabe edilmişdi – Təbriz şəhəri',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '10c0c1f8-f33d-4f10-b5ca-94b24dc6c4da'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'XIII–XV əsrlər Azərbaycan tarixi ilə bağlı uyğunluq gözlənilmişdir:',
    'multiple_choice',
    '["Elxanilər dövründə xan və ailəsinə məxsus torpaqlar adlanırdı – vəqf", "Xarəzmşah Cəlaləddinin yürüşünə məruz qalmışdı – Eldənizlər hökmdarı Əbu Bəkr", "Kəndlilərin bir yerdən başqa yerə köçünü qadağan etmişdi – Hülakü xan", "Monqolların Azərbaycana ikinci yürüşü zamanı (1231) xərac verərək dağıntıdan xilas edilmiş və tabe edilmişdi – Təbriz şəhəri", "Cəlairilərin Azərbaycanda hakimiyyətinə 1382-ci ildə son qoymuşdu – Ağqoyunlu dövləti"]'::jsonb,
    'Monqolların Azərbaycana ikinci yürüşü zamanı (1231) xərac verərək dağıntıdan xilas edilmiş və tabe edilmişdi – Təbriz şəhəri',
    11,
    '4db946ca-5275-4313-93e1-0d3afdfe4144'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '8dc19dcd-6a50-428e-ade4-c644ce6348ef'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'XIX əsrin ikinci yarısı Hindistan və Çin tarixinə aid oxşarlıq:',
    'multiple_choice',
    '["Ərazisinin bir neçə Avropa dövləti arasında nüfuz dairələrinə bölünməsi", "Qalibiyyətli burjua inqilabının baş verməsi", "Müstəqilliyini rəsmən saxlamaqla yarımmüstəmləkəyə çevrilməsi", "Respublika elan edilməsi", "Xarici müstəmləkə zülmünə qarşı xalq üsyanlarının (Sipahilər və Taypinlər) baş verməsi"]'::jsonb,
    'Xarici müstəmləkə zülmünə qarşı xalq üsyanlarının (Sipahilər və Taypinlər) baş verməsi',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a51eef61-a9ed-44de-961a-e2dd7347e633'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'XIX əsrin ikinci yarısı Hindistan və Çin tarixinə aid oxşarlıq:',
    'multiple_choice',
    '["Ərazisinin bir neçə Avropa dövləti arasında nüfuz dairələrinə bölünməsi", "Qalibiyyətli burjua inqilabının baş verməsi", "Müstəqilliyini rəsmən saxlamaqla yarımmüstəmləkəyə çevrilməsi", "Respublika elan edilməsi", "Xarici müstəmləkə zülmünə qarşı xalq üsyanlarının (Sipahilər və Taypinlər) baş verməsi"]'::jsonb,
    'Xarici müstəmləkə zülmünə qarşı xalq üsyanlarının (Sipahilər və Taypinlər) baş verməsi',
    12,
    '8dc19dcd-6a50-428e-ade4-c644ce6348ef'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7df51cca-6bf9-4166-a6d7-349f75d75f8b'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bakı quberniyası yaradılmışdır (1859-cu ildə):',
    'multiple_choice',
    '["Komendant idarə üsulu dövründə", "1846-cı il inzibati-ərazi dəyişiklikləri ilə", "Gürcü-İmeretiya quberniyasının ləğvi ilə", "Qafqaz canişinliyi dövründə (Şamaxı zəlzələsindən sonra mərkəzin Bakıya köçürülməsi ilə)", "XIX əsrin 40-cı illərinin birinci yarısında"]'::jsonb,
    'Qafqaz canişinliyi dövründə (Şamaxı zəlzələsindən sonra mərkəzin Bakıya köçürülməsi ilə)',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'dd0f195b-28ea-4087-be8a-72f31bbe0123'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Bakı quberniyası yaradılmışdır (1859-cu ildə):',
    'multiple_choice',
    '["Komendant idarə üsulu dövründə", "1846-cı il inzibati-ərazi dəyişiklikləri ilə", "Gürcü-İmeretiya quberniyasının ləğvi ilə", "Qafqaz canişinliyi dövründə (Şamaxı zəlzələsindən sonra mərkəzin Bakıya köçürülməsi ilə)", "XIX əsrin 40-cı illərinin birinci yarısında"]'::jsonb,
    'Qafqaz canişinliyi dövründə (Şamaxı zəlzələsindən sonra mərkəzin Bakıya köçürülməsi ilə)',
    13,
    '7df51cca-6bf9-4166-a6d7-349f75d75f8b'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0a26ad8c-542f-400b-84a7-38d19b49981e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Məntiqi ardıcıllığı tamamlayın (2016-cı il Aprel döyüşlərində şəhid olmuş Azərbaycan hərbçiləri):
1) Murad Mirzəyev
2) Samid İmanov
3) Pəncəli Teymurov
4) ...',
    'multiple_choice',
    '["Bəxtiyar Quliyev (və ya Raquf Orucov / Urfan Vəlizadə)", "İlqar Mirzəyev (Tovuz döyüşləri, 2020)", "Mübariz İbrahimov (2010)", "Əlif Hacıyev (Xocalı, 1992)", "Polad Həşimov (Tovuz döyüşləri, 2020)"]'::jsonb,
    'Bəxtiyar Quliyev (və ya Raquf Orucov / Urfan Vəlizadə)',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '84dc8803-b8f0-4db1-b5fe-08777b67c578'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Məntiqi ardıcıllığı tamamlayın (2016-cı il Aprel döyüşlərində şəhid olmuş Azərbaycan hərbçiləri):
1) Murad Mirzəyev
2) Samid İmanov
3) Pəncəli Teymurov
4) ...',
    'multiple_choice',
    '["Bəxtiyar Quliyev (və ya Raquf Orucov / Urfan Vəlizadə)", "İlqar Mirzəyev (Tovuz döyüşləri, 2020)", "Mübariz İbrahimov (2010)", "Əlif Hacıyev (Xocalı, 1992)", "Polad Həşimov (Tovuz döyüşləri, 2020)"]'::jsonb,
    'Bəxtiyar Quliyev (və ya Raquf Orucov / Urfan Vəlizadə)',
    14,
    '0a26ad8c-542f-400b-84a7-38d19b49981e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '597a1989-91e6-4859-b525-0b602b9e09ff'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Erkən orta əsrlərdə Xəzər xaqanlığı ilə uzunmüddətli müharibələr aparmışdır:',
    'multiple_choice',
    '["Bizans və Səlcuqlar", "Yunanlar və Göytürklər", "Qotlar və Franklar", "Ərəblər və Peçeneqlər (həmçinin Kiyev knyazlığı)", "Uyğurlar və Çinlilər"]'::jsonb,
    'Ərəblər və Peçeneqlər (həmçinin Kiyev knyazlığı)',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bea14964-f680-4415-9311-d4d7a0adec78'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Erkən orta əsrlərdə Xəzər xaqanlığı ilə uzunmüddətli müharibələr aparmışdır:',
    'multiple_choice',
    '["Bizans və Səlcuqlar", "Yunanlar və Göytürklər", "Qotlar və Franklar", "Ərəblər və Peçeneqlər (həmçinin Kiyev knyazlığı)", "Uyğurlar və Çinlilər"]'::jsonb,
    'Ərəblər və Peçeneqlər (həmçinin Kiyev knyazlığı)',
    15,
    '597a1989-91e6-4859-b525-0b602b9e09ff'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '606e4b84-df86-4b2f-8e37-6b1effc87b36'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Müasir Azərbaycan tarixi ilə bağlı uyğunluğu müəyyən edin:
1. 2012-ci il
2. 2001-ci il
3. 2018-ci il
a. Dünya Azərbaycanlılarının I Qurultayının keçirilməsi
b. «ASAN xidmət» mərkəzlərinin yaradılması
c. TANAP qaz kəmərinin açılış mərasiminin keçirilməsi',
    'multiple_choice',
    '["1-a, 2-b, 3-c", "1-b, 2-a, 3-c", "1-c, 2-b, 3-a", "1-a, 2-c, 3-b", "1-b, 2-c, 3-a"]'::jsonb,
    '1-b, 2-a, 3-c',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '49096e80-5a91-4c43-94c1-2316c0553288'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Müasir Azərbaycan tarixi ilə bağlı uyğunluğu müəyyən edin:
1. 2012-ci il
2. 2001-ci il
3. 2018-ci il
a. Dünya Azərbaycanlılarının I Qurultayının keçirilməsi
b. «ASAN xidmət» mərkəzlərinin yaradılması
c. TANAP qaz kəmərinin açılış mərasiminin keçirilməsi',
    'multiple_choice',
    '["1-a, 2-b, 3-c", "1-b, 2-a, 3-c", "1-c, 2-b, 3-a", "1-a, 2-c, 3-b", "1-b, 2-c, 3-a"]'::jsonb,
    '1-b, 2-a, 3-c',
    16,
    '606e4b84-df86-4b2f-8e37-6b1effc87b36'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f6431fd5-1a92-400e-895e-939a932ac6e4'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Rusiya Federasiyasının XXI əsrin əvvəlləri (2001-ci ildən sonrakı) tarixi üçün səciyyəvidir:
1. Gürcüstana qarşı hərbi müdaxilə nəticəsində Abxaziya və Cənubi Osetiyaya nəzarəti ələ keçirməsi (2008)
2. Milli respublikalarla Federasiya müqaviləsinin imzalanması (1992)
3. Krımın Rusiyaya ilhaq edilməsi (2014)
4. Ukrayna və Rusiya arasında genişmiqyaslı müharibənin başlanması (2022)
5. İkinci Çeçen müharibəsinin başlanması (1999)',
    'multiple_choice',
    '["1, 3, 4", "1, 2, 5", "3, 4, 5", "2, 4, 5", "1, 2, 3"]'::jsonb,
    '1, 3, 4',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fb034deb-12ff-47b2-bb18-877cd96c69cf'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Rusiya Federasiyasının XXI əsrin əvvəlləri (2001-ci ildən sonrakı) tarixi üçün səciyyəvidir:
1. Gürcüstana qarşı hərbi müdaxilə nəticəsində Abxaziya və Cənubi Osetiyaya nəzarəti ələ keçirməsi (2008)
2. Milli respublikalarla Federasiya müqaviləsinin imzalanması (1992)
3. Krımın Rusiyaya ilhaq edilməsi (2014)
4. Ukrayna və Rusiya arasında genişmiqyaslı müharibənin başlanması (2022)
5. İkinci Çeçen müharibəsinin başlanması (1999)',
    'multiple_choice',
    '["1, 3, 4", "1, 2, 5", "3, 4, 5", "2, 4, 5", "1, 2, 3"]'::jsonb,
    '1, 3, 4',
    17,
    'f6431fd5-1a92-400e-895e-939a932ac6e4'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5c4ab9a2-6be1-4ebc-b8c4-357a28657b4f'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'E.ə. I əsrdə Şərqə yürüş etmiş Roma sərkərdələri Qney Pompey və Mark Antoni üçün oxşar cəhət:',
    'multiple_choice',
    '["Azərbaycan ərazisində mövcud olmuş qədim dövlətlər (Albaniya / Atropatena) üzərinə yürüş edilməsi", "Parfiyanın paytaxtı Ktesifonun ələ keçirilməsi", "Misir hökmdarı Kleopatra ilə ittifaq bağlanması", "Selevkilər dövlətinin süquta uğradılması", "Alban və Parfiya birləşmiş qoşunları tərəfindən Fraaspa yaxınlığında məğlub edilməsi"]'::jsonb,
    'Azərbaycan ərazisində mövcud olmuş qədim dövlətlər (Albaniya / Atropatena) üzərinə yürüş edilməsi',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'beaddd06-6633-49fe-a3eb-c1c2e6d5c714'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'E.ə. I əsrdə Şərqə yürüş etmiş Roma sərkərdələri Qney Pompey və Mark Antoni üçün oxşar cəhət:',
    'multiple_choice',
    '["Azərbaycan ərazisində mövcud olmuş qədim dövlətlər (Albaniya / Atropatena) üzərinə yürüş edilməsi", "Parfiyanın paytaxtı Ktesifonun ələ keçirilməsi", "Misir hökmdarı Kleopatra ilə ittifaq bağlanması", "Selevkilər dövlətinin süquta uğradılması", "Alban və Parfiya birləşmiş qoşunları tərəfindən Fraaspa yaxınlığında məğlub edilməsi"]'::jsonb,
    'Azərbaycan ərazisində mövcud olmuş qədim dövlətlər (Albaniya / Atropatena) üzərinə yürüş edilməsi',
    18,
    '5c4ab9a2-6be1-4ebc-b8c4-357a28657b4f'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '36c0c341-abea-4f33-a6d0-945da0acc8c4'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Şəki hakimliyinə (XIV əsrin sonu – 1551) aid xüsusiyyətləri müəyyən edin:
1. XIV əsrin sonunda meydana gəlmişdi
2. Yalnız Şirvanşahlar dövlətinin vassalı olmuşdur
3. Hökmdarı Seyid Əli Əlincə qalasının müdafiəsində iştirak etmişdi
4. Teymurilərin yürüşlərinə məruz qalmışdı
5. XIII əsrdə Hülakülər dövlətinin tabeliyində müstəqil xanlıq olmuşdur',
    'multiple_choice',
    '["2, 4, 5", "3, 4, 5", "1, 3, 4", "1, 2, 3", "1, 4, 5"]'::jsonb,
    '1, 3, 4',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '4f187b14-fa92-43fd-bc5b-c30c50427011'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    'Şəki hakimliyinə (XIV əsrin sonu – 1551) aid xüsusiyyətləri müəyyən edin:
1. XIV əsrin sonunda meydana gəlmişdi
2. Yalnız Şirvanşahlar dövlətinin vassalı olmuşdur
3. Hökmdarı Seyid Əli Əlincə qalasının müdafiəsində iştirak etmişdi
4. Teymurilərin yürüşlərinə məruz qalmışdı
5. XIII əsrdə Hülakülər dövlətinin tabeliyində müstəqil xanlıq olmuşdur',
    'multiple_choice',
    '["2, 4, 5", "3, 4, 5", "1, 3, 4", "1, 2, 3", "1, 4, 5"]'::jsonb,
    '1, 3, 4',
    19,
    '36c0c341-abea-4f33-a6d0-945da0acc8c4'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '91e98694-9537-482d-b7b4-79d0596945d7'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    '1461-ci il Qoyluhisar döyüşündən fərqli olaraq 1472-ci il Malatya döyüşü:',
    'multiple_choice',
    '["Qaraqoyunlu və Ağqoyunlu dövlətləri arasında baş vermişdir", "Ağqoyunlu dövlətinin (artıq imperiya dövründə) Osmanlı qüvvələri üzərində qələbəsi ilə başa çatmışdır", "Ağqoyunluların məğlubiyyəti ilə başa çatmışdır", "Trabzon imperiyasının süqutu ilə nəticələnmişdir", "Teymuri ordusunun Azərbaycanı tərk etməsi ilə başa çatmışdır"]'::jsonb,
    'Ağqoyunlu dövlətinin (artıq imperiya dövründə) Osmanlı qüvvələri üzərində qələbəsi ilə başa çatmışdır',
    'Tarix',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Tarix"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ad62bb4a-625d-4cab-a9b3-32edf493fba9'::uuid,
    '469740c0-c64f-4890-add0-629661f77509'::uuid,
    '1461-ci il Qoyluhisar döyüşündən fərqli olaraq 1472-ci il Malatya döyüşü:',
    'multiple_choice',
    '["Qaraqoyunlu və Ağqoyunlu dövlətləri arasında baş vermişdir", "Ağqoyunlu dövlətinin (artıq imperiya dövründə) Osmanlı qüvvələri üzərində qələbəsi ilə başa çatmışdır", "Ağqoyunluların məğlubiyyəti ilə başa çatmışdır", "Trabzon imperiyasının süqutu ilə nəticələnmişdir", "Teymuri ordusunun Azərbaycanı tərk etməsi ilə başa çatmışdır"]'::jsonb,
    'Ağqoyunlu dövlətinin (artıq imperiya dövründə) Osmanlı qüvvələri üzərində qələbəsi ilə başa çatmışdır',
    20,
    '91e98694-9537-482d-b7b4-79d0596945d7'::uuid,
    NULL,
    true,
    1,
    NOW()
);

-- ========================================================
-- QUIZ: Coğrafiya (YYQ / X-XI) — Zəfər Olimpiadası (Final) (Coğrafiya - YYQ)
-- ========================================================

INSERT INTO quizzes (
    id, creator_id, title, description, subject, grade,
    difficulty, duration, question_count, pass_percentage,
    exam_category, access_password, is_published, is_archived,
    is_public, show_feedback, attempts_limit, shuffle_questions,
    allow_backtracking, share_code, created_at, updated_at
) VALUES (
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Coğrafiya (YYQ / X-XI) — Zəfər Olimpiadası (Final)',
    'YYQ (Aşağı/Yuxarı Yaş Qrupu) şagirdləri üçün Coğrafiya fənni üzrə Zəfər Olimpiadası Final mərhələsi sınaq imtahanı (20 sual).',
    'Coğrafiya',
    'YYQ',
    'hard',
    40,
    20,
    60,
    'Olimpiada',
    'ZEFER_FINAL_2026',
    true,
    false,
    false,
    true,
    1,
    false,
    true,
    '849034',
    NOW(),
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '00222650-9946-4005-a664-c4becb30bee0'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Doğru olmayan fikirləri müəyyən edin:
1. Xəzər dənizində yerləşən Kulalı və Durnev adaları Qazaxıstan dövlətinə məxsusdur.
2. Niger, Yukon, Dauqava (Qərbi Dvina) və San-Fransisku çayları transsərhəd çaylar hesab edilir.
3. Alyaska, Kamçatka, Yutlandiya və Apennin yarımadalarında müasir neotektonik proseslər (seysmiklik və vulkanizm) üstünlük təşkil edir.
4. Atlantik okeanı sahilində tropik səhra iqlim tipinə rast gəlinir.
5. Lena çayının bir çox sağ qolları Verxoyansk dağlarından başlayır.
6. Anqara və Aldan çayları Yenisey çayının sutoplayıcı hövzəsində yerləşir.',
    'multiple_choice',
    '["2, 4, 6", "1, 3, 4", "2, 3, 6", "1, 3, 5", "2, 4, 5"]'::jsonb,
    '2, 3, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '8c75e1de-1625-4770-8c65-a01c97d2b816'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Doğru olmayan fikirləri müəyyən edin:
1. Xəzər dənizində yerləşən Kulalı və Durnev adaları Qazaxıstan dövlətinə məxsusdur.
2. Niger, Yukon, Dauqava (Qərbi Dvina) və San-Fransisku çayları transsərhəd çaylar hesab edilir.
3. Alyaska, Kamçatka, Yutlandiya və Apennin yarımadalarında müasir neotektonik proseslər (seysmiklik və vulkanizm) üstünlük təşkil edir.
4. Atlantik okeanı sahilində tropik səhra iqlim tipinə rast gəlinir.
5. Lena çayının bir çox sağ qolları Verxoyansk dağlarından başlayır.
6. Anqara və Aldan çayları Yenisey çayının sutoplayıcı hövzəsində yerləşir.',
    'multiple_choice',
    '["2, 4, 6", "1, 3, 4", "2, 3, 6", "1, 3, 5", "2, 4, 5"]'::jsonb,
    '2, 3, 6',
    1,
    '00222650-9946-4005-a664-c4becb30bee0'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'f044068c-072b-4c60-92be-be99fce838c2'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Xəritədə hüdudlandırılmış ərazidə verilmiş çay hövzəsinə aid olan əlamətləri müəyyən edin:
1. Dünyanın ən hündür şəlaləsi yerləşir.
2. Savanna və seyrək meşələr, dəyişkən rütubətli meşələr və rütubətli ekvatorial meşələr yerləşir.
3. Yalnız bir ölkənin ərazisində yerləşir.
4. Zəngin neft və qaz ehtiyatlarına malikdir.
5. Yay qışa nisbətən daha quraq keçir.
6. Əsasən geosinklinal sahəyə uyğun gəlir.',
    'multiple_choice',
    '["1, 2, 4", "2, 4, 6", "1, 3, 5", "2, 5, 6", "1, 2, 3"]'::jsonb,
    '1, 2, 4',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_cog_q02.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '03c33e15-3f4a-4646-a578-8cb435146af3'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Xəritədə hüdudlandırılmış ərazidə verilmiş çay hövzəsinə aid olan əlamətləri müəyyən edin:
1. Dünyanın ən hündür şəlaləsi yerləşir.
2. Savanna və seyrək meşələr, dəyişkən rütubətli meşələr və rütubətli ekvatorial meşələr yerləşir.
3. Yalnız bir ölkənin ərazisində yerləşir.
4. Zəngin neft və qaz ehtiyatlarına malikdir.
5. Yay qışa nisbətən daha quraq keçir.
6. Əsasən geosinklinal sahəyə uyğun gəlir.',
    'multiple_choice',
    '["1, 2, 4", "2, 4, 6", "1, 3, 5", "2, 5, 6", "1, 2, 3"]'::jsonb,
    '1, 2, 4',
    2,
    'f044068c-072b-4c60-92be-be99fce838c2'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_cog_q02.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b4d2a79b-422c-4e18-8082-5f93f8e12998'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Xəzər dənizi ilə bağlı doğru olmayan fikirləri müəyyən edin:
1. Yalnız mülayim iqlim qurşağında yerləşir.
2. Qapalı axarsız hövzə olduğu üçün orta duzluluğu (12–13‰) Dünya okeanının orta duzluluğundan (35‰) daha yüksəkdir.
3. Qədim Tetis (Sarmat) dənizinin qalığıdır (relikt mənşəlidir).
4. Orta dərinliyi 340 metrə bərabərdir (əslində orta dərinliyi ~208 m, maksimum dərinliyi 1025 m-dir).
5. Qərb sahilində Aqraxan yarımadası yerləşir.
6. Gəmiçilik kanalları (Volqa–Don, Volqa–Baltik, Ağ dəniz–Baltik) vasitəsilə iki okeana çıxışı mövcuddur.',
    'multiple_choice',
    '["3, 4, 6", "2, 5, 6", "2, 4, 6", "1, 3, 5", "1, 2, 4"]'::jsonb,
    '1, 2, 4',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '722315f5-4995-47b1-bb4a-b9304d6b39fe'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Xəzər dənizi ilə bağlı doğru olmayan fikirləri müəyyən edin:
1. Yalnız mülayim iqlim qurşağında yerləşir.
2. Qapalı axarsız hövzə olduğu üçün orta duzluluğu (12–13‰) Dünya okeanının orta duzluluğundan (35‰) daha yüksəkdir.
3. Qədim Tetis (Sarmat) dənizinin qalığıdır (relikt mənşəlidir).
4. Orta dərinliyi 340 metrə bərabərdir (əslində orta dərinliyi ~208 m, maksimum dərinliyi 1025 m-dir).
5. Qərb sahilində Aqraxan yarımadası yerləşir.
6. Gəmiçilik kanalları (Volqa–Don, Volqa–Baltik, Ağ dəniz–Baltik) vasitəsilə iki okeana çıxışı mövcuddur.',
    'multiple_choice',
    '["3, 4, 6", "2, 5, 6", "2, 4, 6", "1, 3, 5", "1, 2, 4"]'::jsonb,
    '1, 2, 4',
    3,
    'b4d2a79b-422c-4e18-8082-5f93f8e12998'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '3ffc5d49-040d-4f86-8a0a-98e22b66a721'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Afrika materikində Zambezi çayını Niger çayından fərqləndirən xüsusiyyətləri müəyyən edin:
1. Sutoplayıcı hövzəsi yalnız şimal tropik işıqlanma qurşağında yerləşir.
2. Mənsəbinin yerləşdiyi okeanın (Hind okeanının) sahəsi yalnız azalır.
3. Mənsəbinin yerləşdiyi okeanın (Hind okeanının) şimal sahillərində savannalar və seyrək meşələr təbii zonasına rast gəlinir.
4. Sutoplayıcı hövzəsinin yerləşdiyi ərazidə şaquli cisimlərin günorta kölgəsi həm şimala, həm də cənuba düşə bilər.
5. Sutoplayıcı hövzəsi yalnız Cənub və Şərq yarımkürələrində (iki yarımkürədə) yerləşir.
6. Mənsəbinin yerləşdiyi okean sahillərində sosialist ölkə mövcud deyil.',
    'multiple_choice',
    '["1, 3, 5", "2, 4, 6", "3, 5, 6", "3, 4, 5", "2, 3, 5"]'::jsonb,
    '3, 5, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bfb5df5e-1eaf-45f8-b737-db3f0cdb07e5'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Afrika materikində Zambezi çayını Niger çayından fərqləndirən xüsusiyyətləri müəyyən edin:
1. Sutoplayıcı hövzəsi yalnız şimal tropik işıqlanma qurşağında yerləşir.
2. Mənsəbinin yerləşdiyi okeanın (Hind okeanının) sahəsi yalnız azalır.
3. Mənsəbinin yerləşdiyi okeanın (Hind okeanının) şimal sahillərində savannalar və seyrək meşələr təbii zonasına rast gəlinir.
4. Sutoplayıcı hövzəsinin yerləşdiyi ərazidə şaquli cisimlərin günorta kölgəsi həm şimala, həm də cənuba düşə bilər.
5. Sutoplayıcı hövzəsi yalnız Cənub və Şərq yarımkürələrində (iki yarımkürədə) yerləşir.
6. Mənsəbinin yerləşdiyi okean sahillərində sosialist ölkə mövcud deyil.',
    'multiple_choice',
    '["1, 3, 5", "2, 4, 6", "3, 5, 6", "3, 4, 5", "2, 3, 5"]'::jsonb,
    '3, 5, 6',
    4,
    '3ffc5d49-040d-4f86-8a0a-98e22b66a721'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '0c053345-a2bb-403e-9cc8-66c06b81462d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Avropada bir-biri ilə quru sərhədi (həmsərhəd) olan ölkələri müəyyən edin:',
    'multiple_choice',
    '["İtaliya və Sloveniya", "İsveçrə və Macarıstan", "Slovakiya və Sloveniya", "Macarıstan və Çexiya", "Niderland və Fransa (Avropa materik hissəsində)"]'::jsonb,
    'İtaliya və Sloveniya',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '491f94ac-fd0c-425f-b3a5-39630ea2fdeb'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Avropada bir-biri ilə quru sərhədi (həmsərhəd) olan ölkələri müəyyən edin:',
    'multiple_choice',
    '["İtaliya və Sloveniya", "İsveçrə və Macarıstan", "Slovakiya və Sloveniya", "Macarıstan və Çexiya", "Niderland və Fransa (Avropa materik hissəsində)"]'::jsonb,
    'İtaliya və Sloveniya',
    5,
    '0c053345-a2bb-403e-9cc8-66c06b81462d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '225ea878-6ce4-4584-955b-2d3de4976901'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'İspaniya və Portuqaliya üçün oxşar olan hansı xüsusiyyətlər Almaniya və Polşa üçün fərqlidir (səciyyəvi deyil)?
1. Əfqanlar və taciklərlə eyni dil ailəsinə (Hind-Avropa) mənsubdur.
2. Codyarpaqlı həmişəyaşıl meşə və kolluqlar təbii zonasına rast gəlinir.
3. Mülayim hava kütlələrinin təsirinə məruz qalırlar.
4. Kənd təsərrüfatının aparıcı sahəsi subtropik əkinçilikdir.
5. Atlantik okeanı hövzəsinə aid olan dəniz limanları mövcuddur.
6. Moldovanlar ilə eyni dil qrupuna (Roman dil qrupuna) daxildir.',
    'multiple_choice',
    '["1, 4, 6", "1, 3, 5", "2, 4, 6", "2, 3, 6", "2, 4, 5"]'::jsonb,
    '2, 4, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '355a45bd-b52f-4aaf-a734-15ffee10f646'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'İspaniya və Portuqaliya üçün oxşar olan hansı xüsusiyyətlər Almaniya və Polşa üçün fərqlidir (səciyyəvi deyil)?
1. Əfqanlar və taciklərlə eyni dil ailəsinə (Hind-Avropa) mənsubdur.
2. Codyarpaqlı həmişəyaşıl meşə və kolluqlar təbii zonasına rast gəlinir.
3. Mülayim hava kütlələrinin təsirinə məruz qalırlar.
4. Kənd təsərrüfatının aparıcı sahəsi subtropik əkinçilikdir.
5. Atlantik okeanı hövzəsinə aid olan dəniz limanları mövcuddur.
6. Moldovanlar ilə eyni dil qrupuna (Roman dil qrupuna) daxildir.',
    'multiple_choice',
    '["1, 4, 6", "1, 3, 5", "2, 4, 6", "2, 3, 6", "2, 4, 5"]'::jsonb,
    '2, 4, 6',
    6,
    '225ea878-6ce4-4584-955b-2d3de4976901'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '70b1e941-c8ad-424f-a87c-4ce6d3461b9e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Litosfer və relyeflə bağlı doğru olmayan fikirləri müəyyən edin:
1. Çukot və Kamçatka yarımadalarının ərazisi bütövlükdə Mezozoy (Kimmeri) qırışıqlığında əmələ gəlmişdir.
2. Marian novu okean və materik litosfer tavalarının konvergent sərhədində formalaşıb (əslində iki okean tavasının — Sakit okean və Filippin tavalarının sərhədindədir).
3. Murovdağ və Zəngəzur dağ silsilələrində qədim buzlaq (kar, troq) relyef formalarına rast gəlinir.
4. Okean dibində litosfer tavalarının divergent sərhədlərində yer qabığının qranit qatı mövcud deyil.
5. Çay dərəsinin sağ və ya sol yamacının dik olmasına Yer kürəsinin öz oxu ətrafında hərəkəti (Koriolis qüvvəsi) təsir edir.
6. Dnepr çayının mənbəyinin (Valday yüksəkliyinin) mütləq hündürlüyü 500 m-dən çoxdur.',
    'multiple_choice',
    '["2, 4, 5", "1, 3, 5", "3, 4, 5", "1, 3, 6", "1, 2, 6"]'::jsonb,
    '1, 2, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'f90978b0-ae9c-40ef-970f-dea64cd86529'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Litosfer və relyeflə bağlı doğru olmayan fikirləri müəyyən edin:
1. Çukot və Kamçatka yarımadalarının ərazisi bütövlükdə Mezozoy (Kimmeri) qırışıqlığında əmələ gəlmişdir.
2. Marian novu okean və materik litosfer tavalarının konvergent sərhədində formalaşıb (əslində iki okean tavasının — Sakit okean və Filippin tavalarının sərhədindədir).
3. Murovdağ və Zəngəzur dağ silsilələrində qədim buzlaq (kar, troq) relyef formalarına rast gəlinir.
4. Okean dibində litosfer tavalarının divergent sərhədlərində yer qabığının qranit qatı mövcud deyil.
5. Çay dərəsinin sağ və ya sol yamacının dik olmasına Yer kürəsinin öz oxu ətrafında hərəkəti (Koriolis qüvvəsi) təsir edir.
6. Dnepr çayının mənbəyinin (Valday yüksəkliyinin) mütləq hündürlüyü 500 m-dən çoxdur.',
    'multiple_choice',
    '["2, 4, 5", "1, 3, 5", "3, 4, 5", "1, 3, 6", "1, 2, 6"]'::jsonb,
    '1, 2, 6',
    7,
    '70b1e941-c8ad-424f-a87c-4ce6d3461b9e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5a7f142b-2d28-4726-9c17-fc7c35788ecc'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azərbaycan coğrafiyası ilə bağlı doğru fikirləri müəyyən edin:
1. Gəncə şəhərində illik günəş radiasiyasının miqdarı Şahbuz şəhərindəkindən daha azdır.
2. Araz çayında bolsulu dövr may, qıtsulu dövr isə avqust ayıdır.
3. Ölkəmizin bütün 5 əsas tektonik zonasında milli parklar mövcuddur.
4. Afurca (Vəlvələçay) və Mucuq (Dəmiraparançay) şəlalələrinin hər ikisi Böyük Qafqazın cənub yamacında yerləşir.
5. 22 iyun tarixindən başlayaraq Xocavənd şəhərində gündüzün uzunluğu azalmağa başlayır.
6. Ölkəmizin Xəzər dənizi sahillərində yalnız bir iqlim tipi formalaşmışdır.',
    'multiple_choice',
    '["3, 4, 5", "1, 2, 5", "1, 3, 6", "1, 2, 4", "2, 3, 6"]'::jsonb,
    '1, 2, 5',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'bc578eae-5409-4aac-b1d1-b4a5ece0e64a'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Azərbaycan coğrafiyası ilə bağlı doğru fikirləri müəyyən edin:
1. Gəncə şəhərində illik günəş radiasiyasının miqdarı Şahbuz şəhərindəkindən daha azdır.
2. Araz çayında bolsulu dövr may, qıtsulu dövr isə avqust ayıdır.
3. Ölkəmizin bütün 5 əsas tektonik zonasında milli parklar mövcuddur.
4. Afurca (Vəlvələçay) və Mucuq (Dəmiraparançay) şəlalələrinin hər ikisi Böyük Qafqazın cənub yamacında yerləşir.
5. 22 iyun tarixindən başlayaraq Xocavənd şəhərində gündüzün uzunluğu azalmağa başlayır.
6. Ölkəmizin Xəzər dənizi sahillərində yalnız bir iqlim tipi formalaşmışdır.',
    'multiple_choice',
    '["3, 4, 5", "1, 2, 5", "1, 3, 6", "1, 2, 4", "2, 3, 6"]'::jsonb,
    '1, 2, 5',
    8,
    '5a7f142b-2d28-4726-9c17-fc7c35788ecc'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '543fedb7-18dc-461a-9e80-951b80936596'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Cənubi Amerika hidroqrafiyası ilə bağlı doğru fikirləri müəyyən edin:
1. Amazon çayının sutoplayıcı hövzəsində SES-lər mövcuddur.
2. Parana çayının mənsəbində Manaus limanı yerləşir.
3. Amazon çayının ən uzun sol qolu Tapajos çayıdır.
4. Anhel şəlaləsi Çurun çayı hövzəsində yerləşir.
5. Marakaybo gölü Venesuelada yerləşir.
6. Amazon çayının başlanğıcı Rio-Neqru və Maranyon çaylarının birləşdiyi ərazi hesab edilir.',
    'multiple_choice',
    '["3, 5, 6", "1, 2, 4", "4, 5, 6", "1, 2, 3", "1, 4, 5"]'::jsonb,
    '1, 4, 5',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'ea5d044e-5743-4646-80ad-de621beed462'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Cənubi Amerika hidroqrafiyası ilə bağlı doğru fikirləri müəyyən edin:
1. Amazon çayının sutoplayıcı hövzəsində SES-lər mövcuddur.
2. Parana çayının mənsəbində Manaus limanı yerləşir.
3. Amazon çayının ən uzun sol qolu Tapajos çayıdır.
4. Anhel şəlaləsi Çurun çayı hövzəsində yerləşir.
5. Marakaybo gölü Venesuelada yerləşir.
6. Amazon çayının başlanğıcı Rio-Neqru və Maranyon çaylarının birləşdiyi ərazi hesab edilir.',
    'multiple_choice',
    '["3, 5, 6", "1, 2, 4", "4, 5, 6", "1, 2, 3", "1, 4, 5"]'::jsonb,
    '1, 4, 5',
    9,
    '543fedb7-18dc-461a-9e80-951b80936596'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'a882fa62-7409-40cc-b19e-d5f4d7771ac5'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azərbaycanda mənbəyi ilə mənsəbi eyni tektonik zonada yerləşən çayları müəyyən edin:',
    'multiple_choice',
    '["Sumqayıtçay, Əlicançay, Astaraçay", "Arpaçay, Ataçay, Mazımçay", "Əlincəçay, Pirsaatçay, Köndələnçay", "Vəlvələçay, Həkəri, Gilançay", "Ordubadçay, Sumqayıtçay, Oxçuçay"]'::jsonb,
    'Ordubadçay, Sumqayıtçay, Oxçuçay',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '718b6713-cdf0-4b65-923d-d7845f5f0551'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Azərbaycanda mənbəyi ilə mənsəbi eyni tektonik zonada yerləşən çayları müəyyən edin:',
    'multiple_choice',
    '["Sumqayıtçay, Əlicançay, Astaraçay", "Arpaçay, Ataçay, Mazımçay", "Əlincəçay, Pirsaatçay, Köndələnçay", "Vəlvələçay, Həkəri, Gilançay", "Ordubadçay, Sumqayıtçay, Oxçuçay"]'::jsonb,
    'Ordubadçay, Sumqayıtçay, Oxçuçay',
    10,
    'a882fa62-7409-40cc-b19e-d5f4d7771ac5'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'cdb99a4d-11bd-4773-be88-718ef4b08acc'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Yanacaq-energetika balansında külək elektrik stansiyalarının (KES) yüksək pay tutduğu Avropa ölkələrini müəyyən edin:',
    'multiple_choice',
    '["Cənubi Koreya, Norveç", "Çin, Hindistan", "Danimarka, Niderland (Hollandiya)", "Efiopiya, Rumıniya", "Paraqvay, Meksika"]'::jsonb,
    'Danimarka, Niderland (Hollandiya)',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '12e5d771-3995-407d-af50-0d581b60f93e'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Yanacaq-energetika balansında külək elektrik stansiyalarının (KES) yüksək pay tutduğu Avropa ölkələrini müəyyən edin:',
    'multiple_choice',
    '["Cənubi Koreya, Norveç", "Çin, Hindistan", "Danimarka, Niderland (Hollandiya)", "Efiopiya, Rumıniya", "Paraqvay, Meksika"]'::jsonb,
    'Danimarka, Niderland (Hollandiya)',
    11,
    'cdb99a4d-11bd-4773-be88-718ef4b08acc'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6c6604d1-d7bb-422d-a2c8-99850772616c'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş ölkələrdən hansında əkinəyararlı (becərilən/şumlanan) torpaq sahələrinin ümumi həcmi və kənd təsərrüfatı torpaqlarında payı daha böyükdür?',
    'multiple_choice',
    '["Kanada", "Çin", "ABŞ", "Rusiya", "Hindistan"]'::jsonb,
    'Hindistan',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'c564e5fb-c203-4a46-99a7-0818bfc0cfb6'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Verilmiş ölkələrdən hansında əkinəyararlı (becərilən/şumlanan) torpaq sahələrinin ümumi həcmi və kənd təsərrüfatı torpaqlarında payı daha böyükdür?',
    'multiple_choice',
    '["Kanada", "Çin", "ABŞ", "Rusiya", "Hindistan"]'::jsonb,
    'Hindistan',
    12,
    '6c6604d1-d7bb-422d-a2c8-99850772616c'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'b349a4b2-9d5e-4884-acea-ed8be577221e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Şimali Amerikada Nelson çayının eroziya bazisini (töküldüyü su hövzəsini) müəyyən edin:',
    'multiple_choice',
    '["Atabaska gölü", "Hudzon körfəzi", "Müqəddəs Lavrenti körfəzi", "Böyük Kölə gölü", "Böyük Ayı gölü"]'::jsonb,
    'Hudzon körfəzi',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'fc64b2da-d9dc-4efc-b513-9aebd78f437b'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Şimali Amerikada Nelson çayının eroziya bazisini (töküldüyü su hövzəsini) müəyyən edin:',
    'multiple_choice',
    '["Atabaska gölü", "Hudzon körfəzi", "Müqəddəs Lavrenti körfəzi", "Böyük Kölə gölü", "Böyük Ayı gölü"]'::jsonb,
    'Hudzon körfəzi',
    13,
    'b349a4b2-9d5e-4884-acea-ed8be577221e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '582225dc-3929-4c24-9039-9654648a8c4d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Verilmiş dağ sistemlərindən denudasiyaya (xarici qüvvələrin aşındırmasına) daha uzun müddət məruz qalan qədim dağları müəyyən edin:
1. And dağları   2. Appalaç dağları   3. Kordilyer dağları   4. Himalay dağları   5. Böyük Suayırıcı silsilə   6. Ural dağları',
    'multiple_choice',
    '["1, 2, 4", "2, 4, 6", "1, 3, 5", "2, 5, 6", "1, 2, 3"]'::jsonb,
    '2, 5, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_cog_q14.png',
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '37025dce-746c-4cb9-a69a-66d8bbb2a853'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Verilmiş dağ sistemlərindən denudasiyaya (xarici qüvvələrin aşındırmasına) daha uzun müddət məruz qalan qədim dağları müəyyən edin:
1. And dağları   2. Appalaç dağları   3. Kordilyer dağları   4. Himalay dağları   5. Böyük Suayırıcı silsilə   6. Ural dağları',
    'multiple_choice',
    '["1, 2, 4", "2, 4, 6", "1, 3, 5", "2, 5, 6", "1, 2, 3"]'::jsonb,
    '2, 5, 6',
    14,
    '582225dc-3929-4c24-9039-9654648a8c4d'::uuid,
    'https://supa.imtahan.store/storage/v1/object/public/question-images/final_olympiad/yyq_cog_q14.png',
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    'e385d289-ce2f-4eb2-b909-fff86e6ce087'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Bardarbunqa (İslandiya) və Pinatubo (Filippin) vulkanlarının yerləşdikləri ölkələrə aid olan oxşar xüsusiyyətləri müəyyən edin:
1. Unitar inzibati-ərazi quruluşuna malikdir.
2. Əhalisinin ümumi sayı 100 milyon nəfərdən azdır.
3. Adada və ya arxipelaqda yerləşir.
4. Əraziləri yalnız bir iqlim qurşağında yerləşir.
5. Sahillərini iki okean suları yuyur.
6. Hind okeanına birbaşa çıxışı mövcud deyil.',
    'multiple_choice',
    '["2, 3, 6", "2, 4, 5", "1, 3, 5", "2, 3, 4", "1, 3, 6"]'::jsonb,
    '1, 3, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '5e4b01eb-6018-46a1-af89-071615e6eb69'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Bardarbunqa (İslandiya) və Pinatubo (Filippin) vulkanlarının yerləşdikləri ölkələrə aid olan oxşar xüsusiyyətləri müəyyən edin:
1. Unitar inzibati-ərazi quruluşuna malikdir.
2. Əhalisinin ümumi sayı 100 milyon nəfərdən azdır.
3. Adada və ya arxipelaqda yerləşir.
4. Əraziləri yalnız bir iqlim qurşağında yerləşir.
5. Sahillərini iki okean suları yuyur.
6. Hind okeanına birbaşa çıxışı mövcud deyil.',
    'multiple_choice',
    '["2, 3, 6", "2, 4, 5", "1, 3, 5", "2, 3, 4", "1, 3, 6"]'::jsonb,
    '1, 3, 6',
    15,
    'e385d289-ce2f-4eb2-b909-fff86e6ce087'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '6bb45635-494d-41ae-a13f-bb3255cf2245'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Tam anklav (yalnız bir dövlətin quru ərazisi ilə tam əhatə olunmuş) ölkələri müəyyən edin:
1. Vatikan   2. Andorra   3. Lesoto   4. San-Marino   5. Küveyt   6. Lixtenşteyn',
    'multiple_choice',
    '["1, 3, 4", "2, 4, 5", "1, 3, 5", "4, 5, 6", "1, 5, 6"]'::jsonb,
    '1, 3, 4',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '71c4c9c0-7f41-4648-8831-1f6b725cad1b'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Tam anklav (yalnız bir dövlətin quru ərazisi ilə tam əhatə olunmuş) ölkələri müəyyən edin:
1. Vatikan   2. Andorra   3. Lesoto   4. San-Marino   5. Küveyt   6. Lixtenşteyn',
    'multiple_choice',
    '["1, 3, 4", "2, 4, 5", "1, 3, 5", "4, 5, 6", "1, 5, 6"]'::jsonb,
    '1, 3, 4',
    16,
    '6bb45635-494d-41ae-a13f-bb3255cf2245'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '5a4c0f1f-b95d-4d13-b5af-4b57f3eeed2a'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Təbii ehtiyatlar təsnifatına əsasən həm tükənməyən (1), həm də tükənən bərpa olunan (4, 6) ehtiyatların birlikdə verildiyi sıranı müəyyən edin:
1. Hava   2. Dəmir filizi   3. Daş kömür   4. Torpaq   5. Təbii qaz   6. Şirin su',
    'multiple_choice',
    '["1, 3, 5", "2, 3, 5", "2, 4, 6", "1, 4, 6", "2, 3, 4"]'::jsonb,
    '1, 4, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'b76171b0-5a07-48dc-91bf-617d0363af09'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Təbii ehtiyatlar təsnifatına əsasən həm tükənməyən (1), həm də tükənən bərpa olunan (4, 6) ehtiyatların birlikdə verildiyi sıranı müəyyən edin:
1. Hava   2. Dəmir filizi   3. Daş kömür   4. Torpaq   5. Təbii qaz   6. Şirin su',
    'multiple_choice',
    '["1, 3, 5", "2, 3, 5", "2, 4, 6", "1, 4, 6", "2, 3, 4"]'::jsonb,
    '1, 4, 6',
    17,
    '5a4c0f1f-b95d-4d13-b5af-4b57f3eeed2a'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '7243bade-c3e5-4220-abb9-8b4b4b0ff86d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Azərbaycanda yalnız bir xarici ölkə ilə həmsərhəd olan inzibati rayonları (və ya daxili/bir ölkə ilə həmsərhəd qrupu) müəyyən edin:
1. Quba (Rusiya)   2. Şəki (Rusiya)   3. Qazax (Gürcüstan və Ermənistan)   4. Ordubad (Ermənistan və İran)   5. Daşkəsən (Ermənistan)   6. İmişli (İran)',
    'multiple_choice',
    '["2, 5, 6", "1, 3, 5", "2, 4, 6", "1, 5, 6", "3, 4, 6"]'::jsonb,
    '2, 5, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    'a7c5c698-f047-4fc1-ba15-cff50fc496e3'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Azərbaycanda yalnız bir xarici ölkə ilə həmsərhəd olan inzibati rayonları (və ya daxili/bir ölkə ilə həmsərhəd qrupu) müəyyən edin:
1. Quba (Rusiya)   2. Şəki (Rusiya)   3. Qazax (Gürcüstan və Ermənistan)   4. Ordubad (Ermənistan və İran)   5. Daşkəsən (Ermənistan)   6. İmişli (İran)',
    'multiple_choice',
    '["2, 5, 6", "1, 3, 5", "2, 4, 6", "1, 5, 6", "3, 4, 6"]'::jsonb,
    '2, 5, 6',
    18,
    '7243bade-c3e5-4220-abb9-8b4b4b0ff86d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '139f8707-479e-4e80-af80-884c8a29764d'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'Paleozoy erasında (Kaledon və Hersin qırışıqlıqlarında) əmələ gəlmiş qədim dağları müəyyən edin:
1. And   2. Ural   3. Böyük Xinqan   4. Atlas   5. Kap   6. Skandinaviya   7. Krım   8. Pamir',
    'multiple_choice',
    '["2, 3, 4, 7", "1, 4, 6, 8", "2, 3, 5, 6", "1, 2, 6, 8", "3, 4, 5, 7"]'::jsonb,
    '2, 3, 5, 6',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '383e0ea3-6630-4748-bba6-d21d81ceb885'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'Paleozoy erasında (Kaledon və Hersin qırışıqlıqlarında) əmələ gəlmiş qədim dağları müəyyən edin:
1. And   2. Ural   3. Böyük Xinqan   4. Atlas   5. Kap   6. Skandinaviya   7. Krım   8. Pamir',
    'multiple_choice',
    '["2, 3, 4, 7", "1, 4, 6, 8", "2, 3, 5, 6", "1, 2, 6, 8", "3, 4, 5, 7"]'::jsonb,
    '2, 3, 5, 6',
    19,
    '139f8707-479e-4e80-af80-884c8a29764d'::uuid,
    NULL,
    true,
    1,
    NOW()
);

INSERT INTO question_bank (
    id, user_id, question_text, question_type, options,
    correct_answer, category, difficulty, tags, question_image_url,
    is_graded, created_at, updated_at
) VALUES (
    '22f37ea8-6918-47e5-916d-14df2ee2a81e'::uuid,
    '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
    'ABŞ-ın Kaliforniya ştatında (Mohave səhrasında) yerləşən məşhur «İvanpa Solar» (Ivanpah) elektrik stansiyası hansı tip elektrik stansiyasıdır?',
    'multiple_choice',
    '["Su elektrik stansiyası", "Atom elektrik stansiyası", "Günəş elektrik stansiyası", "Külək elektrik stansiyası", "İstilik elektrik stansiyası"]'::jsonb,
    'Günəş elektrik stansiyası',
    'Coğrafiya',
    'hard',
    '{"Zəfər Olimpiadası","Final","YYQ Sinif","Coğrafiya"}'::text[],
    NULL,
    true,
    NOW(),
    NOW()
);

INSERT INTO questions (
    id, quiz_id, question_text, question_type, options,
    correct_answer, order_index, bank_question_id, question_image_url,
    is_graded, weight, created_at
) VALUES (
    '1511fcb4-bc8f-467b-a300-b8ff063420ac'::uuid,
    '4d27b049-a8e0-4041-9fb6-ce5852d09a03'::uuid,
    'ABŞ-ın Kaliforniya ştatında (Mohave səhrasında) yerləşən məşhur «İvanpa Solar» (Ivanpah) elektrik stansiyası hansı tip elektrik stansiyasıdır?',
    'multiple_choice',
    '["Su elektrik stansiyası", "Atom elektrik stansiyası", "Günəş elektrik stansiyası", "Külək elektrik stansiyası", "İstilik elektrik stansiyası"]'::jsonb,
    'Günəş elektrik stansiyası',
    20,
    '22f37ea8-6918-47e5-916d-14df2ee2a81e'::uuid,
    NULL,
    true,
    1,
    NOW()
);

COMMIT;