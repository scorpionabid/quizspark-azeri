-- Refinement of Modul 6: Korrupsiyaya Qarsi Mubarize (29 Questions)
-- Atomic transaction updating both questions and question_bank tables
BEGIN;

-- Order 0: ID 131a1480-92f5-45db-8f5c-4cd13ff113e3
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət orqanlarında “Qaynar xətt” xidmətinin təşkil edilməsinin əsas məqsədi nədir?',
    options = '["Korrupsiya faktları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması", "Dövlət orqanının ictimai-siyasi bəyanatlarını və gündəlik xəbərlərini yaymaq", "Yalnız əməkdaşlar arasında daxili intizam sorğuları keçirmək", "Vətəndaşların sosial təminat müavinətləri üzrə müraciətlərini qeydiyyata almaq"]'::jsonb,
    correct_answer = 'Korrupsiya faktları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11-1 — Qanunvericilik və antikorrupsiya tədbirlərinə əsasən, dövlət orqanlarında “Qaynar xətt” xidməti korrupsiya halları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması məqsədilə təşkil edilir.',
    hint = 'Qaynar xətt korrupsiya hüquqpozmaları barədə məlumatların operativ qəbulu və araşdırılması üçün nəzərdə tutulub.'
WHERE id = '131a1480-92f5-45db-8f5c-4cd13ff113e3';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət orqanlarında “Qaynar xətt” xidmətinin təşkil edilməsinin əsas məqsədi nədir?',
    options = '["Korrupsiya faktları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması", "Dövlət orqanının ictimai-siyasi bəyanatlarını və gündəlik xəbərlərini yaymaq", "Yalnız əməkdaşlar arasında daxili intizam sorğuları keçirmək", "Vətəndaşların sosial təminat müavinətləri üzrə müraciətlərini qeydiyyata almaq"]'::jsonb,
    correct_answer = 'Korrupsiya faktları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11-1 — Qanunvericilik və antikorrupsiya tədbirlərinə əsasən, dövlət orqanlarında “Qaynar xətt” xidməti korrupsiya halları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması məqsədilə təşkil edilir.',
    hint = 'Qaynar xətt korrupsiya hüquqpozmaları barədə məlumatların operativ qəbulu və araşdırılması üçün nəzərdə tutulub.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '131a1480-92f5-45db-8f5c-4cd13ff113e3');

-- Order 1: ID 465ce294-f621-4af3-80bd-f80f24d3f5ed
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət qulluqçusunun sahibkarlıq fəaliyyəti ilə məşğul olması:',
    options = '["Qanunla qadağandır (elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla)", "Tamamilə sərbəstdir və heç bir məhdudiyyət qoyulmur", "Yalnız xarici ölkələrdə təsis edilmiş müəssisələrdə icazə verilir", "Dövlət orqanı rəhbərinin şifahi razılığı əsasında mümkündür"]'::jsonb,
    correct_answer = 'Qanunla qadağandır (elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla)',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Qanunvericiliyə əsasən, dövlət qulluqçularına sahibkarlıq fəaliyyəti ilə məşğul olmaq qadağandır; lakin onların elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olmasına qanunla icazə verilir.',
    hint = 'Dövlət qulluqçusuna sahibkarlıq qadağandır, yalnız elmi, pedaqoji və yaradıcılıq fəaliyyəti istisnadır.'
WHERE id = '465ce294-f621-4af3-80bd-f80f24d3f5ed';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət qulluqçusunun sahibkarlıq fəaliyyəti ilə məşğul olması:',
    options = '["Qanunla qadağandır (elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla)", "Tamamilə sərbəstdir və heç bir məhdudiyyət qoyulmur", "Yalnız xarici ölkələrdə təsis edilmiş müəssisələrdə icazə verilir", "Dövlət orqanı rəhbərinin şifahi razılığı əsasında mümkündür"]'::jsonb,
    correct_answer = 'Qanunla qadağandır (elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla)',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Qanunvericiliyə əsasən, dövlət qulluqçularına sahibkarlıq fəaliyyəti ilə məşğul olmaq qadağandır; lakin onların elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olmasına qanunla icazə verilir.',
    hint = 'Dövlət qulluqçusuna sahibkarlıq qadağandır, yalnız elmi, pedaqoji və yaradıcılıq fəaliyyəti istisnadır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '465ce294-f621-4af3-80bd-f80f24d3f5ed');

-- Order 2: ID 789acffc-426a-483a-8c1a-143c65b75806
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, qanunsuz qəbul edilmiş hədiyyə və nemətlər:',
    options = '["Dövlət orqanına təhvil verilməli və ya dövlət nəfinə ödənilməlidir", "Dövlət qulluqçusunun şəxsi mülkiyyətində saxlanılmalıdır", "Xidməti fəaliyyətin sonuna qədər təşkilatın daxili anbarında saxlanılmalıdır", "Yaxın qohumların adına rəsmi qaydada bağışlanmalıdır"]'::jsonb,
    correct_answer = 'Dövlət orqanına təhvil verilməli və ya dövlət nəfinə ödənilməlidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8.3 — Qanunvericiliyə əsasən, dövlət qulluqçusunun qanunsuz qəbul etdiyi hədiyyə və nemətlər dərhal dövlət orqanına təhvil verilməli və ya onların dəyəri dövlət nəfinə ödənilməlidir.',
    hint = 'Qanunsuz hədiyyələr dövlət orqanına təhvil verilməli və ya məbləği dövlət büdcəsinə ödənilməlidir.'
WHERE id = '789acffc-426a-483a-8c1a-143c65b75806';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, qanunsuz qəbul edilmiş hədiyyə və nemətlər:',
    options = '["Dövlət orqanına təhvil verilməli və ya dövlət nəfinə ödənilməlidir", "Dövlət qulluqçusunun şəxsi mülkiyyətində saxlanılmalıdır", "Xidməti fəaliyyətin sonuna qədər təşkilatın daxili anbarında saxlanılmalıdır", "Yaxın qohumların adına rəsmi qaydada bağışlanmalıdır"]'::jsonb,
    correct_answer = 'Dövlət orqanına təhvil verilməli və ya dövlət nəfinə ödənilməlidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8.3 — Qanunvericiliyə əsasən, dövlət qulluqçusunun qanunsuz qəbul etdiyi hədiyyə və nemətlər dərhal dövlət orqanına təhvil verilməli və ya onların dəyəri dövlət nəfinə ödənilməlidir.',
    hint = 'Qanunsuz hədiyyələr dövlət orqanına təhvil verilməli və ya məbləği dövlət büdcəsinə ödənilməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '789acffc-426a-483a-8c1a-143c65b75806');

-- Order 3: ID 666e3515-8072-4004-a6cb-6566926427f8
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsin xidməti fəaliyyəti zamanı dövlət vəsaitlərinin təyinatından kənar xərclənməsi:',
    options = '["Qanunsuz korrupsiya hüquqpozmasıdır və müvafiq məsuliyyət yaradır", "Dövlət orqanının maliyyə müstəqilliyi çərçivəsində verdiyi sərbəst qərardır", "Təşkilatın qənaət edilmiş resurslarının yenidən bölüşdürülməsi tədbiridir", "Yalnız təşkilatdaxili daxili audit yoxlamasından sonra tənzimlənən xətadır"]'::jsonb,
    correct_answer = 'Qanunsuz korrupsiya hüquqpozmasıdır və müvafiq məsuliyyət yaradır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9.1 — Xidməti fəaliyyət zamanı dövlət vəsaitlərinin və ya dövlət əmlakının təyinatından kənar xərclənməsi korrupsiyaya şərait yaradan qanunsuz hüquqpozmadır və intizam, inzibati və ya cinayət məsuliyyəti yaradır.',
    hint = 'Dövlət vəsaitlərinin təyinatından kənar xərclənməsi qanunvericiliklə qadağan olunmuş korrupsiya hüquqpozmasıdır.'
WHERE id = '666e3515-8072-4004-a6cb-6566926427f8';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsin xidməti fəaliyyəti zamanı dövlət vəsaitlərinin təyinatından kənar xərclənməsi:',
    options = '["Qanunsuz korrupsiya hüquqpozmasıdır və müvafiq məsuliyyət yaradır", "Dövlət orqanının maliyyə müstəqilliyi çərçivəsində verdiyi sərbəst qərardır", "Təşkilatın qənaət edilmiş resurslarının yenidən bölüşdürülməsi tədbiridir", "Yalnız təşkilatdaxili daxili audit yoxlamasından sonra tənzimlənən xətadır"]'::jsonb,
    correct_answer = 'Qanunsuz korrupsiya hüquqpozmasıdır və müvafiq məsuliyyət yaradır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9.1 — Xidməti fəaliyyət zamanı dövlət vəsaitlərinin və ya dövlət əmlakının təyinatından kənar xərclənməsi korrupsiyaya şərait yaradan qanunsuz hüquqpozmadır və intizam, inzibati və ya cinayət məsuliyyəti yaradır.',
    hint = 'Dövlət vəsaitlərinin təyinatından kənar xərclənməsi qanunvericiliklə qadağan olunmuş korrupsiya hüquqpozmasıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '666e3515-8072-4004-a6cb-6566926427f8');

-- Order 4: ID 9aae2b06-8e7a-49cb-8635-62b5658fe818
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, maliyyə xarakterli tələblərə hansılar aiddir?',
    options = '["Gəlirləri, əmlak vəziyyəti və maliyyə öhdəlikləri barədə məlumatların rəsmi təqdim edilməsi", "Təşkilatın illik əməkhaqqı büdcəsinin müstəqil şəkildə formalaşdırılması", "Yalnız beynəlxalq bank hesabları üzrə əməliyyatların məhdudlaşdırılması", "İllik kommersiya kreditlərinin dövlət zəmanəti ilə təmin edilməsi"]'::jsonb,
    correct_answer = 'Gəlirləri, əmlak vəziyyəti və maliyyə öhdəlikləri barədə məlumatların rəsmi təqdim edilməsi',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 5 — Qanunvericiliyə əsasən, maliyyə xarakterli tələblərə vəzifəli şəxslərin öz gəlirləri, əmlak vəziyyəti, vergitutma obyekti olan əmlakı və maliyyə öhdəlikləri barədə məlumatları hər il rəsmi qaydada təqdim etməsi daxildir.',
    hint = 'Maliyyə tələbləri vəzifəli şəxslərin gəlirləri, əmlakı və maliyyə öhdəlikləri barədə bəyannamə verməsini ehtiva edir.'
WHERE id = '9aae2b06-8e7a-49cb-8635-62b5658fe818';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, maliyyə xarakterli tələblərə hansılar aiddir?',
    options = '["Gəlirləri, əmlak vəziyyəti və maliyyə öhdəlikləri barədə məlumatların rəsmi təqdim edilməsi", "Təşkilatın illik əməkhaqqı büdcəsinin müstəqil şəkildə formalaşdırılması", "Yalnız beynəlxalq bank hesabları üzrə əməliyyatların məhdudlaşdırılması", "İllik kommersiya kreditlərinin dövlət zəmanəti ilə təmin edilməsi"]'::jsonb,
    correct_answer = 'Gəlirləri, əmlak vəziyyəti və maliyyə öhdəlikləri barədə məlumatların rəsmi təqdim edilməsi',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 5 — Qanunvericiliyə əsasən, maliyyə xarakterli tələblərə vəzifəli şəxslərin öz gəlirləri, əmlak vəziyyəti, vergitutma obyekti olan əmlakı və maliyyə öhdəlikləri barədə məlumatları hər il rəsmi qaydada təqdim etməsi daxildir.',
    hint = 'Maliyyə tələbləri vəzifəli şəxslərin gəlirləri, əmlakı və maliyyə öhdəlikləri barədə bəyannamə verməsini ehtiva edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '9aae2b06-8e7a-49cb-8635-62b5658fe818');

-- Order 5: ID 06f69745-efd9-401c-af2b-984f5750a694
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxs korrupsiya nəticəsində qanunsuz gəlir əldə etdikdə həmin gəlir:',
    options = '["Məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir", "Vəzifəli şəxsin xüsusi depozit hesabında bloklaşdırılaraq saxlanılır", "Dövlət orqanının daxili xeyriyyə fonduna könüllü ianə kimi keçirilir", "Yalnız intizam tənbehi tətbiq edilməklə şəxsin istifadəsində saxlanılır"]'::jsonb,
    correct_answer = 'Məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 12 — Vəzifəli şəxsin korrupsiya hüquqpozmaları nəticəsində əldə etdiyi qanunsuz gəlirlər və ya əmlak qanunvericiliklə müəyyən edilmiş qaydada məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir.',
    hint = 'Korrupsiya nəticəsində əldə edilmiş qanunsuz gəlirlər məhkəmə qərarı ilə dövlət nəfinə tutulur.'
WHERE id = '06f69745-efd9-401c-af2b-984f5750a694';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxs korrupsiya nəticəsində qanunsuz gəlir əldə etdikdə həmin gəlir:',
    options = '["Məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir", "Vəzifəli şəxsin xüsusi depozit hesabında bloklaşdırılaraq saxlanılır", "Dövlət orqanının daxili xeyriyyə fonduna könüllü ianə kimi keçirilir", "Yalnız intizam tənbehi tətbiq edilməklə şəxsin istifadəsində saxlanılır"]'::jsonb,
    correct_answer = 'Məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 12 — Vəzifəli şəxsin korrupsiya hüquqpozmaları nəticəsində əldə etdiyi qanunsuz gəlirlər və ya əmlak qanunvericiliklə müəyyən edilmiş qaydada məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir.',
    hint = 'Korrupsiya nəticəsində əldə edilmiş qanunsuz gəlirlər məhkəmə qərarı ilə dövlət nəfinə tutulur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '06f69745-efd9-401c-af2b-984f5750a694');

-- Order 6: ID dba9d2b2-8e25-4fdf-9c74-ae05a34bbd0a
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət qulluqçusunun qanunsuz üstünlük əldə etməsi faktı üzrə intizam icraatı kim tərəfindən başlana bilər?',
    options = '["Dövlət orqanının rəhbəri tərəfindən", "Müvafiq ərazidə fəaliyyət göstərən bələdiyyə şurası tərəfindən", "Kənar müstəqil audit və qiymətləndirmə şirkəti tərəfindən", "Sahə üzrə həmkarlar ittifaqı komitəsinin rəyasət heyəti tərəfindən"]'::jsonb,
    correct_answer = 'Dövlət orqanının rəhbəri tərəfindən',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və Dövlət Qulluğu Qanunvericiliyi — Qanunvericiliyə əsasən, dövlət qulluqçusunun qanunsuz üstünlük əldə etməsi faktı aşkar edildikdə, həmin şəxs barəsində intizam icraatı dövlət orqanının rəhbəri tərəfindən başlana bilər.',
    hint = 'Dövlət qulluqçusu barəsində intizam icraatını başlamaq səlahiyyəti dövlət orqanının rəhbərinə məxsusdur.'
WHERE id = 'dba9d2b2-8e25-4fdf-9c74-ae05a34bbd0a';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət qulluqçusunun qanunsuz üstünlük əldə etməsi faktı üzrə intizam icraatı kim tərəfindən başlana bilər?',
    options = '["Dövlət orqanının rəhbəri tərəfindən", "Müvafiq ərazidə fəaliyyət göstərən bələdiyyə şurası tərəfindən", "Kənar müstəqil audit və qiymətləndirmə şirkəti tərəfindən", "Sahə üzrə həmkarlar ittifaqı komitəsinin rəyasət heyəti tərəfindən"]'::jsonb,
    correct_answer = 'Dövlət orqanının rəhbəri tərəfindən',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və Dövlət Qulluğu Qanunvericiliyi — Qanunvericiliyə əsasən, dövlət qulluqçusunun qanunsuz üstünlük əldə etməsi faktı aşkar edildikdə, həmin şəxs barəsində intizam icraatı dövlət orqanının rəhbəri tərəfindən başlana bilər.',
    hint = 'Dövlət qulluqçusu barəsində intizam icraatını başlamaq səlahiyyəti dövlət orqanının rəhbərinə məxsusdur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'dba9d2b2-8e25-4fdf-9c74-ae05a34bbd0a');

-- Order 7: ID 442db1ec-9f07-494e-b581-944b3856561b
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxs hansı halda hədiyyəni qəbul edə bilər?',
    options = '["Dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir etməyən rəsmi suvenirləri", "Təşkilatın daxili fondundan ayrılan istənilən dəyərdə nəqliyyat vasitəsini", "Şəxsi ehtiyaclar üçün bağışlanan daşınmaz əmlak və ya mənzili", "Xarici tərəfdaşlar tərəfindən təqdim olunan ödənişsiz fərdi istirahət vauçerlərini"]'::jsonb,
    correct_answer = 'Dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir etməyən rəsmi suvenirləri',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8.2 — Qanunvericiliyə əsasən, vəzifəli şəxslərə xidməti vəzifələrin icrası ilə əlaqədar hədiyyə almaq qadağan olsa da, dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir göstərməyən rəsmi protokol suvenirlərinin qəbul edilməsinə istisna hallarda icazə verilir.',
    hint = 'Yalnız dəyəri 55 manatdan çox olmayan və vəzifə icrasına təsir etməyən rəsmi suvenirlər qəbul edilə bilər.'
WHERE id = '442db1ec-9f07-494e-b581-944b3856561b';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxs hansı halda hədiyyəni qəbul edə bilər?',
    options = '["Dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir etməyən rəsmi suvenirləri", "Təşkilatın daxili fondundan ayrılan istənilən dəyərdə nəqliyyat vasitəsini", "Şəxsi ehtiyaclar üçün bağışlanan daşınmaz əmlak və ya mənzili", "Xarici tərəfdaşlar tərəfindən təqdim olunan ödənişsiz fərdi istirahət vauçerlərini"]'::jsonb,
    correct_answer = 'Dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir etməyən rəsmi suvenirləri',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8.2 — Qanunvericiliyə əsasən, vəzifəli şəxslərə xidməti vəzifələrin icrası ilə əlaqədar hədiyyə almaq qadağan olsa da, dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir göstərməyən rəsmi protokol suvenirlərinin qəbul edilməsinə istisna hallarda icazə verilir.',
    hint = 'Yalnız dəyəri 55 manatdan çox olmayan və vəzifə icrasına təsir etməyən rəsmi suvenirlər qəbul edilə bilər.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '442db1ec-9f07-494e-b581-944b3856561b');

-- Order 8: ID ce6076c4-6497-47f3-bbcc-03f753d244f8
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsə qanunsuz maddi və digər nemətlər verən fiziki və hüquqi şəxslər:',
    options = '["Qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar", "Hər hansı hüquqi və ya inzibati məsuliyyətdən tam azad edilirlər", "Yalnız dövlət orqanı tərəfindən yazılı təşəkkürnamə ilə fərqləndirilirlər", "Gələcək kommersiya fəaliyyətində vergi güzəştləri əldə edirlər"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 312 — Qanunvericiliyə əsasən, vəzifəli şəxsə qanunsuz maddi və ya qeyri-maddi nemətlər təklif edən, vəd edən və ya verən fiziki və hüquqi şəxslər qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar.',
    hint = 'Qanunsuz nemət verən şəxslər də rüşvət vermə və ya korrupsiyaya şərait yaratma əməllərinə görə məsuliyyət daşıyırlar.'
WHERE id = 'ce6076c4-6497-47f3-bbcc-03f753d244f8';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsə qanunsuz maddi və digər nemətlər verən fiziki və hüquqi şəxslər:',
    options = '["Qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar", "Hər hansı hüquqi və ya inzibati məsuliyyətdən tam azad edilirlər", "Yalnız dövlət orqanı tərəfindən yazılı təşəkkürnamə ilə fərqləndirilirlər", "Gələcək kommersiya fəaliyyətində vergi güzəştləri əldə edirlər"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 312 — Qanunvericiliyə əsasən, vəzifəli şəxsə qanunsuz maddi və ya qeyri-maddi nemətlər təklif edən, vəd edən və ya verən fiziki və hüquqi şəxslər qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar.',
    hint = 'Qanunsuz nemət verən şəxslər də rüşvət vermə və ya korrupsiyaya şərait yaratma əməllərinə görə məsuliyyət daşıyırlar.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'ce6076c4-6497-47f3-bbcc-03f753d244f8');

-- Order 9: ID 922140e4-9098-47d2-ac7e-b3f77415e3e3
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya cinayətləri üzrə ibtidai istintaq hansı orqan tərəfindən aparılır?',
    options = '["Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən", "Müvafiq inzibati ərazinin yerli bələdiyyə icra orqanları tərəfindən", "İxtisaslaşmış müstəqil sığorta və maliyyə audit şirkətləri tərəfindən", "Azərbaycan Respublikasının Dövlət Statistika Komitəsi tərəfindən"]'::jsonb,
    correct_answer = 'Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 4 və AR Cinayət-Prosessual Məcəlləsi Maddə 215 — Qanunvericiliyə əsasən, korrupsiya cinayətləri üzrə ibtidai istintaq Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən aparılır.',
    hint = 'Korrupsiya cinayətlərinin ibtidai istintaqını Baş prokuror yanında xüsusi Baş İdarə aparır.'
WHERE id = '922140e4-9098-47d2-ac7e-b3f77415e3e3';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya cinayətləri üzrə ibtidai istintaq hansı orqan tərəfindən aparılır?',
    options = '["Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən", "Müvafiq inzibati ərazinin yerli bələdiyyə icra orqanları tərəfindən", "İxtisaslaşmış müstəqil sığorta və maliyyə audit şirkətləri tərəfindən", "Azərbaycan Respublikasının Dövlət Statistika Komitəsi tərəfindən"]'::jsonb,
    correct_answer = 'Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 4 və AR Cinayət-Prosessual Məcəlləsi Maddə 215 — Qanunvericiliyə əsasən, korrupsiya cinayətləri üzrə ibtidai istintaq Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən aparılır.',
    hint = 'Korrupsiya cinayətlərinin ibtidai istintaqını Baş prokuror yanında xüsusi Baş İdarə aparır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '922140e4-9098-47d2-ac7e-b3f77415e3e3');

-- Order 10: ID 29eddabf-644c-4f8c-9c05-d8fc721e8e83
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya ilə əlaqədar hüquqpozmaların subyektlərinə kimlər aiddir?',
    options = '["Dövlət orqanlarında seçilmiş və ya təyin edilmiş vəzifəli şəxslər, dövlət qulluqçuları və bələdiyyə üzvləri", "Yalnız hüquqi şəxs yaratmadan fəaliyyət göstərən fərdi sahibkarlar", "Yalnız ali təhsil müəssisələrində təhsil alan tələbə və doktorantlar", "Ölkə ərazisində qısamüddətli səfərdə olan əcnəbi turistlər"]'::jsonb,
    correct_answer = 'Dövlət orqanlarında seçilmiş və ya təyin edilmiş vəzifəli şəxslər, dövlət qulluqçuları və bələdiyyə üzvləri',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 2 — Qanunun 2-ci maddəsinə əsasən, korrupsiya ilə əlaqədar hüquqpozmaların subyektlərinə dövlət hakimiyyəti orqanlarına seçilmiş və ya təyin edilmiş şəxslər, dövlət qulluqçuları, bələdiyyə üzvləri və bələdiyyə qulluqçuları, habelə qanunla müəyyən edilmiş digər vəzifəli şəxslər aiddir.',
    hint = 'Subyektlər dövlət hakimiyyəti orqanlarının vəzifəli şəxsləri, dövlət qulluqçuları və bələdiyyə üzvləridir.'
WHERE id = '29eddabf-644c-4f8c-9c05-d8fc721e8e83';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya ilə əlaqədar hüquqpozmaların subyektlərinə kimlər aiddir?',
    options = '["Dövlət orqanlarında seçilmiş və ya təyin edilmiş vəzifəli şəxslər, dövlət qulluqçuları və bələdiyyə üzvləri", "Yalnız hüquqi şəxs yaratmadan fəaliyyət göstərən fərdi sahibkarlar", "Yalnız ali təhsil müəssisələrində təhsil alan tələbə və doktorantlar", "Ölkə ərazisində qısamüddətli səfərdə olan əcnəbi turistlər"]'::jsonb,
    correct_answer = 'Dövlət orqanlarında seçilmiş və ya təyin edilmiş vəzifəli şəxslər, dövlət qulluqçuları və bələdiyyə üzvləri',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 2 — Qanunun 2-ci maddəsinə əsasən, korrupsiya ilə əlaqədar hüquqpozmaların subyektlərinə dövlət hakimiyyəti orqanlarına seçilmiş və ya təyin edilmiş şəxslər, dövlət qulluqçuları, bələdiyyə üzvləri və bələdiyyə qulluqçuları, habelə qanunla müəyyən edilmiş digər vəzifəli şəxslər aiddir.',
    hint = 'Subyektlər dövlət hakimiyyəti orqanlarının vəzifəli şəxsləri, dövlət qulluqçuları və bələdiyyə üzvləridir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '29eddabf-644c-4f8c-9c05-d8fc721e8e83');

-- Order 11: ID df01e754-140f-477b-b496-b8723b7d72f1
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozması törətmiş şəxsin vəzifədən kənarlaşdırılması:',
    options = '["İstintaq və ya xidməti yoxlama dövründə səlahiyyətli orqanın qərarı ilə həyata keçirilə bilər", "Qanunvericiliklə istənilən halda qəti şəkildə qadağan edilmişdir", "Yalnız şəxsin özünün yazılı razılığı və könüllü ərizəsi ilə mümkündür", "Yalnız şəxs qanunla müəyyən edilmiş pensiya yaşına çatdıqda tətbiq edilir"]'::jsonb,
    correct_answer = 'İstintaq və ya xidməti yoxlama dövründə səlahiyyətli orqanın qərarı ilə həyata keçirilə bilər',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və prosessual qanunvericilik — Qanunvericiliyə əsasən, korrupsiya hüquqpozması ilə əlaqədar aparılan istintaq və ya xidməti yoxlama dövründə obyektivliyin təmin edilməsi və maneələrin qarşısının alınması üçün səlahiyyətli orqanın qərarı ilə şəxs vəzifəsindən kənarlaşdırıla bilər.',
    hint = 'Obyektivliyin təmin edilməsi məqsədilə araşdırma və ya istintaq müddətində səlahiyyətli qərarla vəzifədən kənarlaşdırma mümkündür.'
WHERE id = 'df01e754-140f-477b-b496-b8723b7d72f1';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozması törətmiş şəxsin vəzifədən kənarlaşdırılması:',
    options = '["İstintaq və ya xidməti yoxlama dövründə səlahiyyətli orqanın qərarı ilə həyata keçirilə bilər", "Qanunvericiliklə istənilən halda qəti şəkildə qadağan edilmişdir", "Yalnız şəxsin özünün yazılı razılığı və könüllü ərizəsi ilə mümkündür", "Yalnız şəxs qanunla müəyyən edilmiş pensiya yaşına çatdıqda tətbiq edilir"]'::jsonb,
    correct_answer = 'İstintaq və ya xidməti yoxlama dövründə səlahiyyətli orqanın qərarı ilə həyata keçirilə bilər',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və prosessual qanunvericilik — Qanunvericiliyə əsasən, korrupsiya hüquqpozması ilə əlaqədar aparılan istintaq və ya xidməti yoxlama dövründə obyektivliyin təmin edilməsi və maneələrin qarşısının alınması üçün səlahiyyətli orqanın qərarı ilə şəxs vəzifəsindən kənarlaşdırıla bilər.',
    hint = 'Obyektivliyin təmin edilməsi məqsədilə araşdırma və ya istintaq müddətində səlahiyyətli qərarla vəzifədən kənarlaşdırma mümkündür.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'df01e754-140f-477b-b496-b8723b7d72f1');

-- Order 12: ID f3db711a-8bd2-47c8-9aae-d797600f59a3
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsin öz səlahiyyətlərindən qulluq maraqlarına zidd olaraq istifadə etməsi necə qiymətləndirilir?',
    options = '["Vəzifəli şəxsin diskresion səlahiyyətləri çərçivəsində verdiyi sərbəst qərardır", "Dövlət orqanının daxili idarəetmə qaydalarına uyğun səmərəli tədbirdir", "Təşkilatın maliyyə resurslarının optimallaşdırılmasına xidmət edən addımdır", "Qanunvericiliklə qəti şəkildə qadağan olunmuş korrupsiya hüquqpozmasıdır"]'::jsonb,
    correct_answer = 'Qanunvericiliklə qəti şəkildə qadağan olunmuş korrupsiya hüquqpozmasıdır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Qanunun və qanunvericiliyin əsas prinsiplərinə əsasən, vəzifəli şəxsin öz səlahiyyətlərindən qulluq mənafeyinə zidd olaraq istifadə etməsi, habelə üçüncü şəxslərin xeyrinə qanunsuz qərarlar qəbul etməsi qadağan olunmuş korrupsiya hüquqpozması hesab olunur və müvafiq məsuliyyət yaradır.',
    hint = 'Səlahiyyətdən qulluq mənafeyinə zidd istifadə qanunvericiliklə qadağan olunmuş korrupsiya hüquqpozmasıdır.'
WHERE id = 'f3db711a-8bd2-47c8-9aae-d797600f59a3';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsin öz səlahiyyətlərindən qulluq maraqlarına zidd olaraq istifadə etməsi necə qiymətləndirilir?',
    options = '["Vəzifəli şəxsin diskresion səlahiyyətləri çərçivəsində verdiyi sərbəst qərardır", "Dövlət orqanının daxili idarəetmə qaydalarına uyğun səmərəli tədbirdir", "Təşkilatın maliyyə resurslarının optimallaşdırılmasına xidmət edən addımdır", "Qanunvericiliklə qəti şəkildə qadağan olunmuş korrupsiya hüquqpozmasıdır"]'::jsonb,
    correct_answer = 'Qanunvericiliklə qəti şəkildə qadağan olunmuş korrupsiya hüquqpozmasıdır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Qanunun və qanunvericiliyin əsas prinsiplərinə əsasən, vəzifəli şəxsin öz səlahiyyətlərindən qulluq mənafeyinə zidd olaraq istifadə etməsi, habelə üçüncü şəxslərin xeyrinə qanunsuz qərarlar qəbul etməsi qadağan olunmuş korrupsiya hüquqpozması hesab olunur və müvafiq məsuliyyət yaradır.',
    hint = 'Səlahiyyətdən qulluq mənafeyinə zidd istifadə qanunvericiliklə qadağan olunmuş korrupsiya hüquqpozmasıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'f3db711a-8bd2-47c8-9aae-d797600f59a3');

-- Order 13: ID 86731df6-71c0-4f8d-8508-91d2cafa4e51
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və müvafiq qanunvericilik aktlarına əsasən, korrupsiyaya qarşı mübarizə sahəsində ixtisaslaşmış orqanlar hansılardır?',
    options = '["Maliyyə Nazirliyi yanında dövlət maliyyə nəzarəti xidməti və xəzinədarlıq departamenti", "Daxili İşlər Nazirliyinin baş cinayət-axtarış idarəsi və yerli polis şöbələri", "İqtisadiyyat Nazirliyi yanında antiinhisar siyasəti və istehlakçıların hüquqlarının müdafiəsi qurumu", "Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi"]'::jsonb,
    correct_answer = 'Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 4.2 — Qanunvericilik aktlarının tələblərinə əsasən, ölkədə korrupsiyaya qarşı mübarizə sahəsində ixtisaslaşmış orqanlara fəaliyyəti əlaqələndirən Korrupsiyaya qarşı mübarizə üzrə Komissiya və cinayət təqibini həyata keçirən Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi daxildir.',
    hint = 'İxtisaslaşmış orqanlar Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsidir.'
WHERE id = '86731df6-71c0-4f8d-8508-91d2cafa4e51';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və müvafiq qanunvericilik aktlarına əsasən, korrupsiyaya qarşı mübarizə sahəsində ixtisaslaşmış orqanlar hansılardır?',
    options = '["Maliyyə Nazirliyi yanında dövlət maliyyə nəzarəti xidməti və xəzinədarlıq departamenti", "Daxili İşlər Nazirliyinin baş cinayət-axtarış idarəsi və yerli polis şöbələri", "İqtisadiyyat Nazirliyi yanında antiinhisar siyasəti və istehlakçıların hüquqlarının müdafiəsi qurumu", "Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi"]'::jsonb,
    correct_answer = 'Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 4.2 — Qanunvericilik aktlarının tələblərinə əsasən, ölkədə korrupsiyaya qarşı mübarizə sahəsində ixtisaslaşmış orqanlara fəaliyyəti əlaqələndirən Korrupsiyaya qarşı mübarizə üzrə Komissiya və cinayət təqibini həyata keçirən Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi daxildir.',
    hint = 'İxtisaslaşmış orqanlar Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '86731df6-71c0-4f8d-8508-91d2cafa4e51');

-- Order 14: ID 0d635612-7569-4f42-8c33-ac59a7f67173
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozmaları nəticəsində qəbul edilmiş inzibati aktların hüquqi aqibəti necə tənzimlənir?',
    options = '["Qəbul edildiyi tarixdən etibarən avtomatik olaraq beş il müddətində qüvvədə qalır", "Yalnız yuxarı orqanın daxili göstərişi ilə dəyişdirilərək yenidən rəsmiləşdirilir", "Təşkilatın ləğvindən sonra heç bir hüquqi nəticə yaratmadan qüvvədən düşür", "Məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir və etibarsız sayılır"]'::jsonb,
    correct_answer = 'Məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir və etibarsız sayılır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 13 — Qanunun tələblərinə əsasən, korrupsiya ilə əlaqədar hüquqpozmalar nəticəsində qəbul olunmuş aktlar müvafiq səlahiyyətli dövlət orqanları, yerli özünüidarəetmə orqanları və ya məhkəmə tərəfindən ləğv edilir və etibarsız sayılır.',
    hint = 'Korrupsiya nəticəsində qəbul edilmiş aktlar məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir.'
WHERE id = '0d635612-7569-4f42-8c33-ac59a7f67173';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozmaları nəticəsində qəbul edilmiş inzibati aktların hüquqi aqibəti necə tənzimlənir?',
    options = '["Qəbul edildiyi tarixdən etibarən avtomatik olaraq beş il müddətində qüvvədə qalır", "Yalnız yuxarı orqanın daxili göstərişi ilə dəyişdirilərək yenidən rəsmiləşdirilir", "Təşkilatın ləğvindən sonra heç bir hüquqi nəticə yaratmadan qüvvədən düşür", "Məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir və etibarsız sayılır"]'::jsonb,
    correct_answer = 'Məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir və etibarsız sayılır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 13 — Qanunun tələblərinə əsasən, korrupsiya ilə əlaqədar hüquqpozmalar nəticəsində qəbul olunmuş aktlar müvafiq səlahiyyətli dövlət orqanları, yerli özünüidarəetmə orqanları və ya məhkəmə tərəfindən ləğv edilir və etibarsız sayılır.',
    hint = 'Korrupsiya nəticəsində qəbul edilmiş aktlar məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '0d635612-7569-4f42-8c33-ac59a7f67173');

-- Order 15: ID b68c0818-f5d1-4d61-b4fe-018855c50282
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və satınalma qanunvericiliyinə əsasən, dövlət satınalmalarında vəzifəli şəxsin öz yaxın qohumunun təsisçisi olduğu şirkətə qanunsuz üstünlük verməsi necə qiymətləndirilir?',
    options = '["Dövlət orqanının daxili investisiya siyasətinə tam uyğun olan səmərəli addımdır", "Təşkilatın maliyyə resurslarının idarə olunmasını asanlaşdıran iqtisadi vasitədir", "Tərəflərin qarşılıqlı razılığı ilə tənzimlənən sərbəst ticari əməliyyatdır", "Kobud korrupsiya hüquqpozmasıdır və satınalmanın nəticələri ləğv edilir"]'::jsonb,
    correct_answer = 'Kobud korrupsiya hüquqpozmasıdır və satınalmanın nəticələri ləğv edilir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 və “Dövlət satınalmaları haqqında” AR Qanunu — Dövlət satınalmaları zamanı maraqlar toqquşmasına yol verilməsi və yaxın qohumların şirkətlərinə qanunsuz üstünlük təmin edilməsi korrupsiya hüquqpozmasıdır; bu hal aşkar edildikdə satınalmanın nəticələri ləğv edilir və təqsirkar şəxslər məsuliyyətə cəlb olunur.',
    hint = 'Satınalmada yaxın qohumlara qanunsuz üstünlük verilməsi kobud korrupsiya hüquqpozmasıdır və nəticələrin ləğvinə səbəb olur.'
WHERE id = 'b68c0818-f5d1-4d61-b4fe-018855c50282';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və satınalma qanunvericiliyinə əsasən, dövlət satınalmalarında vəzifəli şəxsin öz yaxın qohumunun təsisçisi olduğu şirkətə qanunsuz üstünlük verməsi necə qiymətləndirilir?',
    options = '["Dövlət orqanının daxili investisiya siyasətinə tam uyğun olan səmərəli addımdır", "Təşkilatın maliyyə resurslarının idarə olunmasını asanlaşdıran iqtisadi vasitədir", "Tərəflərin qarşılıqlı razılığı ilə tənzimlənən sərbəst ticari əməliyyatdır", "Kobud korrupsiya hüquqpozmasıdır və satınalmanın nəticələri ləğv edilir"]'::jsonb,
    correct_answer = 'Kobud korrupsiya hüquqpozmasıdır və satınalmanın nəticələri ləğv edilir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 və “Dövlət satınalmaları haqqında” AR Qanunu — Dövlət satınalmaları zamanı maraqlar toqquşmasına yol verilməsi və yaxın qohumların şirkətlərinə qanunsuz üstünlük təmin edilməsi korrupsiya hüquqpozmasıdır; bu hal aşkar edildikdə satınalmanın nəticələri ləğv edilir və təqsirkar şəxslər məsuliyyətə cəlb olunur.',
    hint = 'Satınalmada yaxın qohumlara qanunsuz üstünlük verilməsi kobud korrupsiya hüquqpozmasıdır və nəticələrin ləğvinə səbəb olur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'b68c0818-f5d1-4d61-b4fe-018855c50282');

-- Order 16: ID c8092873-a8d7-42ca-b257-4f8cf67dc4f4
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozması törətmiş vəzifəli şəxslər hansı məsuliyyət növlərinə cəlb edilə bilərlər?',
    options = '["Yalnız daxili intizam qaydaları çərçivəsində tətbiq olunan tənbeh tədbirləri", "Təşkilatın qərarı ilə verilən şifahi xəbərdarlıq və töhmət tədbirləri", "Yalnız mülki qaydada dəyən maddi zərərin ödənilməsi öhdəliyi", "İntizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti"]'::jsonb,
    correct_answer = 'İntizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11 — Korrupsiya ilə əlaqədar hüquqpozmalar törətmiş şəxslər qanunvericiliklə müəyyən edilmiş qaydada intizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyətinə cəlb edilirlər.',
    hint = 'Korrupsiya törədən şəxslər əməlin xarakterindən asılı olaraq intizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti daşıyırlar.'
WHERE id = 'c8092873-a8d7-42ca-b257-4f8cf67dc4f4';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozması törətmiş vəzifəli şəxslər hansı məsuliyyət növlərinə cəlb edilə bilərlər?',
    options = '["Yalnız daxili intizam qaydaları çərçivəsində tətbiq olunan tənbeh tədbirləri", "Təşkilatın qərarı ilə verilən şifahi xəbərdarlıq və töhmət tədbirləri", "Yalnız mülki qaydada dəyən maddi zərərin ödənilməsi öhdəliyi", "İntizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti"]'::jsonb,
    correct_answer = 'İntizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11 — Korrupsiya ilə əlaqədar hüquqpozmalar törətmiş şəxslər qanunvericiliklə müəyyən edilmiş qaydada intizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyətinə cəlb edilirlər.',
    hint = 'Korrupsiya törədən şəxslər əməlin xarakterindən asılı olaraq intizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti daşıyırlar.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'c8092873-a8d7-42ca-b257-4f8cf67dc4f4');

-- Order 17: ID 7f9c8b8e-0497-4b1b-910e-9743ef19ccb7
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, xidməti vəzifələrin icrası ilə əlaqədar vəzifəli şəxslərə hədiyyə verilməsi barədə ümumi qadağa hansı həddə şamil olunur?',
    options = '["Dövlət qulluqçularının istənilən dəyərdə hədiyyə qəbul etməsinə heç bir məhdudiyyət qoyulmur", "Yalnız min manatdan yuxarı məbləğdə olan bahalı daşınmaz əmlaklar qadağan olunur", "Hədiyyə məhdudiyyəti yalnız xarici ölkələrdən gələn nümayəndə heyətlərinə şamil edilir", "Xidməti vəzifələrin icrası ilə əlaqədar dəyəri 55 manatdan artıq olan hədiyyələrin qəbul edilməsi qanunla qadağandır"]'::jsonb,
    correct_answer = 'Xidməti vəzifələrin icrası ilə əlaqədar dəyəri 55 manatdan artıq olan hədiyyələrin qəbul edilməsi qanunla qadağandır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8 — Vəzifəli şəxsə xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təsir təəssüratı yaradan hədiyyələr qəbul etmək qadağandır; qonaqpərvərliklə bağlı dəyəri 55 manatdan yuxarı olan hədiyyələrin qəbul edilməsinə yol verilmir.',
    hint = 'Xidməti fəaliyyətlə əlaqədar dəyəri 55 manatdan yuxarı hədiyyə qəbul edilməsi qanunla qadağandır.'
WHERE id = '7f9c8b8e-0497-4b1b-910e-9743ef19ccb7';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, xidməti vəzifələrin icrası ilə əlaqədar vəzifəli şəxslərə hədiyyə verilməsi barədə ümumi qadağa hansı həddə şamil olunur?',
    options = '["Dövlət qulluqçularının istənilən dəyərdə hədiyyə qəbul etməsinə heç bir məhdudiyyət qoyulmur", "Yalnız min manatdan yuxarı məbləğdə olan bahalı daşınmaz əmlaklar qadağan olunur", "Hədiyyə məhdudiyyəti yalnız xarici ölkələrdən gələn nümayəndə heyətlərinə şamil edilir", "Xidməti vəzifələrin icrası ilə əlaqədar dəyəri 55 manatdan artıq olan hədiyyələrin qəbul edilməsi qanunla qadağandır"]'::jsonb,
    correct_answer = 'Xidməti vəzifələrin icrası ilə əlaqədar dəyəri 55 manatdan artıq olan hədiyyələrin qəbul edilməsi qanunla qadağandır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8 — Vəzifəli şəxsə xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təsir təəssüratı yaradan hədiyyələr qəbul etmək qadağandır; qonaqpərvərliklə bağlı dəyəri 55 manatdan yuxarı olan hədiyyələrin qəbul edilməsinə yol verilmir.',
    hint = 'Xidməti fəaliyyətlə əlaqədar dəyəri 55 manatdan yuxarı hədiyyə qəbul edilməsi qanunla qadağandır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '7f9c8b8e-0497-4b1b-910e-9743ef19ccb7');

-- Order 18: ID 1d4336ca-56b8-4ecc-a805-c8a585c68bea
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və antikorrupsiya qanunvericiliyinə əsasən, dövlət orqanlarında korrupsiya risklərinin qiymətləndirilməsi necə həyata keçirilir?',
    options = '["Yalnız beynəlxalq maliyyə təşkilatlarının xüsusi nümayəndələri tərəfindən həyata keçirilir", "Təşkilatın illik büdcə hesabatı təsdiq olunduqdan sonra on ildə bir dəfə aparılır", "Könüllü xarakter daşıyır və yalnız qurum rəhbərinin şəxsi təşəbbüsü ilə icra edilir", "Müvafiq dövlət qurumları tərəfindən dövri olaraq aparılmalı və aşkar edilən risklər aradan qaldırılmalıdır"]'::jsonb,
    correct_answer = 'Müvafiq dövlət qurumları tərəfindən dövri olaraq aparılmalı və aşkar edilən risklər aradan qaldırılmalıdır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və milli antikorrupsiya standartları — Dövlət orqanlarında korrupsiya risklərinin qiymətləndirilməsi dövri olaraq həyata keçirilməli, risk sahələri müəyyənləşdirilərək onların aradan qaldırılması üçün preventiv tədbirlər planı icra olunmalıdır.',
    hint = 'Korrupsiya risklərinin qiymətləndirilməsi dövlət orqanları tərəfindən dövri və məcburi qaydada aparılır.'
WHERE id = '1d4336ca-56b8-4ecc-a805-c8a585c68bea';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və antikorrupsiya qanunvericiliyinə əsasən, dövlət orqanlarında korrupsiya risklərinin qiymətləndirilməsi necə həyata keçirilir?',
    options = '["Yalnız beynəlxalq maliyyə təşkilatlarının xüsusi nümayəndələri tərəfindən həyata keçirilir", "Təşkilatın illik büdcə hesabatı təsdiq olunduqdan sonra on ildə bir dəfə aparılır", "Könüllü xarakter daşıyır və yalnız qurum rəhbərinin şəxsi təşəbbüsü ilə icra edilir", "Müvafiq dövlət qurumları tərəfindən dövri olaraq aparılmalı və aşkar edilən risklər aradan qaldırılmalıdır"]'::jsonb,
    correct_answer = 'Müvafiq dövlət qurumları tərəfindən dövri olaraq aparılmalı və aşkar edilən risklər aradan qaldırılmalıdır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və milli antikorrupsiya standartları — Dövlət orqanlarında korrupsiya risklərinin qiymətləndirilməsi dövri olaraq həyata keçirilməli, risk sahələri müəyyənləşdirilərək onların aradan qaldırılması üçün preventiv tədbirlər planı icra olunmalıdır.',
    hint = 'Korrupsiya risklərinin qiymətləndirilməsi dövlət orqanları tərəfindən dövri və məcburi qaydada aparılır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '1d4336ca-56b8-4ecc-a805-c8a585c68bea');

-- Order 19: ID 60a9052b-d140-4c34-9494-a95d89316857
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxs barəsində bilə-bilə yalan və qərəzli korrupsiya məlumatı yayan şəxsin hüquqi vəziyyəti necədir?',
    options = '["Qanunvericiliklə müəyyən edilmiş qaydada böhtana və ya yalan məlumata görə məsuliyyət daşıyır", "Dövlət orqanları tərəfindən xüsusi təltif edilərək maddi mükafatlandırılır", "Heç bir hüquqi məsuliyyət daşımadan sərbəst şəkildə fəaliyyətini davam etdirir", "Hüquq-mühafizə orqanları tərəfindən xüsusi dövlət toxunulmazlığı statusu əldə edir"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada böhtana və ya yalan məlumata görə məsuliyyət daşıyır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 147 — Korrupsiya hüquqpozmaları barədə bilə-bilə yalan məlumat verən, digər şəxsin şərəf və ləyaqətini ləkələyən şəxslər qanunvericiliklə müəyyən edilmiş qaydada cinayət (böhtan) və ya mülki-hüquqi məsuliyyət daşıyırlar.',
    hint = 'Bilə-bilə yalan və uydurma məlumat yayan şəxs böhtana görə cinayət və ya mülki məsuliyyətə cəlb olunur.'
WHERE id = '60a9052b-d140-4c34-9494-a95d89316857';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxs barəsində bilə-bilə yalan və qərəzli korrupsiya məlumatı yayan şəxsin hüquqi vəziyyəti necədir?',
    options = '["Qanunvericiliklə müəyyən edilmiş qaydada böhtana və ya yalan məlumata görə məsuliyyət daşıyır", "Dövlət orqanları tərəfindən xüsusi təltif edilərək maddi mükafatlandırılır", "Heç bir hüquqi məsuliyyət daşımadan sərbəst şəkildə fəaliyyətini davam etdirir", "Hüquq-mühafizə orqanları tərəfindən xüsusi dövlət toxunulmazlığı statusu əldə edir"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada böhtana və ya yalan məlumata görə məsuliyyət daşıyır',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 147 — Korrupsiya hüquqpozmaları barədə bilə-bilə yalan məlumat verən, digər şəxsin şərəf və ləyaqətini ləkələyən şəxslər qanunvericiliklə müəyyən edilmiş qaydada cinayət (böhtan) və ya mülki-hüquqi məsuliyyət daşıyırlar.',
    hint = 'Bilə-bilə yalan və uydurma məlumat yayan şəxs böhtana görə cinayət və ya mülki məsuliyyətə cəlb olunur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '60a9052b-d140-4c34-9494-a95d89316857');

-- Order 20: ID 628baec0-2ff4-4d3e-ae5b-6704967b01b1
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət orqanlarının fəaliyyətində ictimai şəffaflığın təmin edilməsi üçün hansı tədbir tələb olunur?',
    options = '["Vəzifəli şəxslərlə bağlı bütün məlumatların dövlət sirri elan edilərək məxfiləşdirilməsi", "Kütləvi informasiya vasitələri ilə hər hansı rəsmi əlaqələrin tamamilə məhdudlaşdırılması", "Vəzifəli şəxslərin qəbul günlərinin ləğv edilərək fiziki müraciətlərin dayandırılması", "Fəaliyyət haqqında məlumatların rəsmi internet saytlarında mütəmadi açıqlanması və ictimaiyyətə təqdim edilməsi"]'::jsonb,
    correct_answer = 'Fəaliyyət haqqında məlumatların rəsmi internet saytlarında mütəmadi açıqlanması və ictimaiyyətə təqdim edilməsi',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və “İnformasiya əldə etmək haqqında” AR Qanunu — Dövlət orqanlarında şəffaflığın və hesabatlılığın artırılması məqsədilə həyata keçirilən tədbirlər, büdcə xərcləmələri və göstərilən xidmətlər barədə məlumatlar rəsmi internet resurslarında mütəmadi olaraq açıqlanmalıdır.',
    hint = 'Şəffaflıq fəaliyyət barədə məlumatların rəsmi internet saytlarında mütəmadi açıqlanması ilə təmin edilir.'
WHERE id = '628baec0-2ff4-4d3e-ae5b-6704967b01b1';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət orqanlarının fəaliyyətində ictimai şəffaflığın təmin edilməsi üçün hansı tədbir tələb olunur?',
    options = '["Vəzifəli şəxslərlə bağlı bütün məlumatların dövlət sirri elan edilərək məxfiləşdirilməsi", "Kütləvi informasiya vasitələri ilə hər hansı rəsmi əlaqələrin tamamilə məhdudlaşdırılması", "Vəzifəli şəxslərin qəbul günlərinin ləğv edilərək fiziki müraciətlərin dayandırılması", "Fəaliyyət haqqında məlumatların rəsmi internet saytlarında mütəmadi açıqlanması və ictimaiyyətə təqdim edilməsi"]'::jsonb,
    correct_answer = 'Fəaliyyət haqqında məlumatların rəsmi internet saytlarında mütəmadi açıqlanması və ictimaiyyətə təqdim edilməsi',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və “İnformasiya əldə etmək haqqında” AR Qanunu — Dövlət orqanlarında şəffaflığın və hesabatlılığın artırılması məqsədilə həyata keçirilən tədbirlər, büdcə xərcləmələri və göstərilən xidmətlər barədə məlumatlar rəsmi internet resurslarında mütəmadi olaraq açıqlanmalıdır.',
    hint = 'Şəffaflıq fəaliyyət barədə məlumatların rəsmi internet saytlarında mütəmadi açıqlanması ilə təmin edilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '628baec0-2ff4-4d3e-ae5b-6704967b01b1');

-- Order 21: ID ea4e856d-7d9f-4751-b00d-685e581afe29
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, korrupsiya faktı barədə anonim məlumat daxil olduqda həmin məlumat necə tənzimlənir?',
    options = '["Daxil olduğu anda hüquqi qüvvəyə malik olmadığı üçün dərhal baxılmadan saxlanılır", "Məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər", "Yalnız kütləvi informasiya vasitələrində dərci üçün rəsmi redaksiyalara göndərilir", "Məlumat verən şəxsin şəxsiyyəti müəyyənləşdirilərək inzibati məsuliyyətə cəlb olunur"]'::jsonb,
    correct_answer = 'Məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və cinayət-prosessual normalar — Anonim məlumatlar ümumi qaydada baxılmasa da, həmin məlumatda konkret cinayət tərkibinin əlamətləri göstərildikdə, qanunvericiliklə müəyyən edilmiş qaydada əməliyyat-axtarış orqanları tərəfindən yoxlanılması təmin edilir.',
    hint = 'Anonim məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər.'
WHERE id = 'ea4e856d-7d9f-4751-b00d-685e581afe29';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, korrupsiya faktı barədə anonim məlumat daxil olduqda həmin məlumat necə tənzimlənir?',
    options = '["Daxil olduğu anda hüquqi qüvvəyə malik olmadığı üçün dərhal baxılmadan saxlanılır", "Məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər", "Yalnız kütləvi informasiya vasitələrində dərci üçün rəsmi redaksiyalara göndərilir", "Məlumat verən şəxsin şəxsiyyəti müəyyənləşdirilərək inzibati məsuliyyətə cəlb olunur"]'::jsonb,
    correct_answer = 'Məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və cinayət-prosessual normalar — Anonim məlumatlar ümumi qaydada baxılmasa da, həmin məlumatda konkret cinayət tərkibinin əlamətləri göstərildikdə, qanunvericiliklə müəyyən edilmiş qaydada əməliyyat-axtarış orqanları tərəfindən yoxlanılması təmin edilir.',
    hint = 'Anonim məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'ea4e856d-7d9f-4751-b00d-685e581afe29');

-- Order 22: ID 016a18a7-bb51-464a-b7b3-9fd7c7971ea9
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, yaxın qohumların birgə işləməsinə (qulluq etməsinə) yol verilməməsi qaydası hansı hala şamil edilir?',
    options = '["Eyni mərkəzi icra hakimiyyəti orqanının strukturuna daxil olmayan fərqli qurumlarda çalışmağa", "Fərqli sahələrdə və müxtəlif regional təşkilatlarda dövlət qulluğu vəzifəsi tutmağa", "Yalnız özəl sektor subyektlərində və kommersiya qurumlarında fəaliyyət göstərməyə", "Birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməyə"]'::jsonb,
    correct_answer = 'Birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməyə',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 7 — Yaxın qohumların birbaşa tabelikdə və ya nəzarətdə olan dövlət qulluğu vəzifələrində birgə qulluq keçmələrinə yol verilmir; bu məhdudiyyət maraqlar konfliktinin yaranmasının qarşısını almaq məqsədi daşıyır.',
    hint = 'Yaxın qohumların birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməsi qadağandır.'
WHERE id = '016a18a7-bb51-464a-b7b3-9fd7c7971ea9';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, yaxın qohumların birgə işləməsinə (qulluq etməsinə) yol verilməməsi qaydası hansı hala şamil edilir?',
    options = '["Eyni mərkəzi icra hakimiyyəti orqanının strukturuna daxil olmayan fərqli qurumlarda çalışmağa", "Fərqli sahələrdə və müxtəlif regional təşkilatlarda dövlət qulluğu vəzifəsi tutmağa", "Yalnız özəl sektor subyektlərində və kommersiya qurumlarında fəaliyyət göstərməyə", "Birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməyə"]'::jsonb,
    correct_answer = 'Birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməyə',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 7 — Yaxın qohumların birbaşa tabelikdə və ya nəzarətdə olan dövlət qulluğu vəzifələrində birgə qulluq keçmələrinə yol verilmir; bu məhdudiyyət maraqlar konfliktinin yaranmasının qarşısını almaq məqsədi daşıyır.',
    hint = 'Yaxın qohumların birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməsi qadağandır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '016a18a7-bb51-464a-b7b3-9fd7c7971ea9');

-- Order 23: ID 0ba8704d-6b23-4abe-8b99-49d970710249
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya nədir?',
    options = '["Vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən qanunsuz olaraq maddi və digər nemətlər əldə etmək üçün istifadə etməsidir", "Dövlət qulluqçusunun daxili əmək intizamı qaydalarını və iş rejimi tələblərini təkrar pozmasıdır", "Vəzifəli şəxsin xidməti fəaliyyətində təcrübəsizlikdən dolayı texniki və sənədləşmə xətalarına yol verməsidir", "Dövlət orqanının daxili sənəd dövriyyəsində sənədlərin qeydiyyat və icra müddətlərini gecikdirməsidir"]'::jsonb,
    correct_answer = 'Vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən qanunsuz olaraq maddi və digər nemətlər əldə etmək üçün istifadə etməsidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 1 — Qanunun 1-ci maddəsinə əsasən, korrupsiya — vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən və ya həmin status və səlahiyyətlərdən irəli gələn imkanlardan istifadə etməklə qanunsuz olaraq maddi və sair nemətlər, imtiyazlar və ya güzəştlər əldə etməsi, habelə fiziki və hüquqi şəxslər tərəfindən həmin nemətlərin vəzifəli şəxslərə qanunsuz təklif, vəd olunması və ya verilməsidir.',
    hint = 'Korrupsiya sadə əmək intizamı pozuntusu deyil, vəzifə səlahiyyətindən qanunsuz maddi və sair nemətlər əldə etmək üçün sui-istifadədir.'
WHERE id = '0ba8704d-6b23-4abe-8b99-49d970710249';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya nədir?',
    options = '["Vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən qanunsuz olaraq maddi və digər nemətlər əldə etmək üçün istifadə etməsidir", "Dövlət qulluqçusunun daxili əmək intizamı qaydalarını və iş rejimi tələblərini təkrar pozmasıdır", "Vəzifəli şəxsin xidməti fəaliyyətində təcrübəsizlikdən dolayı texniki və sənədləşmə xətalarına yol verməsidir", "Dövlət orqanının daxili sənəd dövriyyəsində sənədlərin qeydiyyat və icra müddətlərini gecikdirməsidir"]'::jsonb,
    correct_answer = 'Vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən qanunsuz olaraq maddi və digər nemətlər əldə etmək üçün istifadə etməsidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 1 — Qanunun 1-ci maddəsinə əsasən, korrupsiya — vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən və ya həmin status və səlahiyyətlərdən irəli gələn imkanlardan istifadə etməklə qanunsuz olaraq maddi və sair nemətlər, imtiyazlar və ya güzəştlər əldə etməsi, habelə fiziki və hüquqi şəxslər tərəfindən həmin nemətlərin vəzifəli şəxslərə qanunsuz təklif, vəd olunması və ya verilməsidir.',
    hint = 'Korrupsiya sadə əmək intizamı pozuntusu deyil, vəzifə səlahiyyətindən qanunsuz maddi və sair nemətlər əldə etmək üçün sui-istifadədir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '0ba8704d-6b23-4abe-8b99-49d970710249');

-- Order 24: ID f30e05b8-4e9a-4028-95ba-134a814f0592
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxsin xidməti səlahiyyətlərinin icrası ilə əlaqədar hər hansı hərəkətin (və ya hərəkətsizliyin) müqabilində qanunsuz olaraq maddi və ya sair nemət tələb etməsi necə qiymətləndirilir?',
    options = '["Tərəflərin qarşılıqlı razılığı ilə tənzimlənən mülki-hüquqi xarakterli borc münasibətidir", "Dövlət orqanının daxili büdcəsinin formalaşdırılmasına xidmət edən könüllü ödənişdir", "Xidməti fəaliyyətin səmərəliliyini artıran stimullaşdırıcı mükafatlandırma formasıdır", "Rüşvətxorluq (rüşvət almaq) cinayətidir"]'::jsonb,
    correct_answer = 'Rüşvətxorluq (rüşvət almaq) cinayətidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 311 — Vəzifəli şəxsin xidməti səlahiyyətlərinin icrası və ya icra edilməməsi müqabilində qanunsuz olaraq maddi nemətlər və ya pul tələb etməsi birbaşa rüşvətxorluq (rüşvət almaq) cinayətidir və cinayət məsuliyyəti yaradır.',
    hint = 'Vəzifə səlahiyyətinin icrası və ya icra edilməməsi müqabilində nemət tələb etmək rüşvət alma cinayətidir.'
WHERE id = 'f30e05b8-4e9a-4028-95ba-134a814f0592';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxsin xidməti səlahiyyətlərinin icrası ilə əlaqədar hər hansı hərəkətin (və ya hərəkətsizliyin) müqabilində qanunsuz olaraq maddi və ya sair nemət tələb etməsi necə qiymətləndirilir?',
    options = '["Tərəflərin qarşılıqlı razılığı ilə tənzimlənən mülki-hüquqi xarakterli borc münasibətidir", "Dövlət orqanının daxili büdcəsinin formalaşdırılmasına xidmət edən könüllü ödənişdir", "Xidməti fəaliyyətin səmərəliliyini artıran stimullaşdırıcı mükafatlandırma formasıdır", "Rüşvətxorluq (rüşvət almaq) cinayətidir"]'::jsonb,
    correct_answer = 'Rüşvətxorluq (rüşvət almaq) cinayətidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 311 — Vəzifəli şəxsin xidməti səlahiyyətlərinin icrası və ya icra edilməməsi müqabilində qanunsuz olaraq maddi nemətlər və ya pul tələb etməsi birbaşa rüşvətxorluq (rüşvət almaq) cinayətidir və cinayət məsuliyyəti yaradır.',
    hint = 'Vəzifə səlahiyyətinin icrası və ya icra edilməməsi müqabilində nemət tələb etmək rüşvət alma cinayətidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'f30e05b8-4e9a-4028-95ba-134a814f0592');

-- Order 25: ID c13f9c3f-03a6-4850-8c2b-6a713f2c65e2
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və antikorrupsiya qanunvericiliyinə əsasən, dövlət orqanlarında daxili nəzarət mexanizmlərinin yaradılması hansı məqsədi daşıyır?',
    options = '["Dövlət orqanlarının müstəqil qərarvermə səlahiyyətlərini tam məhdudlaşdıran qadağan olunmuş tədbirdir", "Təşkilat daxilində işçilərin kütləvi şəkildə işdən azad edilməsinə səbəb olan mexanizmdir", "Yalnız xarici ölkələrin audit şirkətləri və beynəlxalq təşkilatlar tərəfindən tətbiq olunur", "Korrupsiyaya şərait yaradan halların vaxtında aşkarlanmasına və preventiv olaraq aradan qaldırılmasına xidmət edir"]'::jsonb,
    correct_answer = 'Korrupsiyaya şərait yaradan halların vaxtında aşkarlanmasına və preventiv olaraq aradan qaldırılmasına xidmət edir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 6 — Dövlət orqanlarında daxili nəzarət mexanizmlərinin yaradılması korrupsiyaya şərait yaradan səbəb və şəraitin vaxtında aşkarlanmasına, habelə onların aradan qaldırılması üçün profilaktik tədbirlərin görülməsinə xidmət edir.',
    hint = 'Daxili nəzarət korrupsiyaya şərait yaradan halların vaxtında aşkarlanması və aradan qaldırılması məqsədilə təsis edilir.'
WHERE id = 'c13f9c3f-03a6-4850-8c2b-6a713f2c65e2';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və antikorrupsiya qanunvericiliyinə əsasən, dövlət orqanlarında daxili nəzarət mexanizmlərinin yaradılması hansı məqsədi daşıyır?',
    options = '["Dövlət orqanlarının müstəqil qərarvermə səlahiyyətlərini tam məhdudlaşdıran qadağan olunmuş tədbirdir", "Təşkilat daxilində işçilərin kütləvi şəkildə işdən azad edilməsinə səbəb olan mexanizmdir", "Yalnız xarici ölkələrin audit şirkətləri və beynəlxalq təşkilatlar tərəfindən tətbiq olunur", "Korrupsiyaya şərait yaradan halların vaxtında aşkarlanmasına və preventiv olaraq aradan qaldırılmasına xidmət edir"]'::jsonb,
    correct_answer = 'Korrupsiyaya şərait yaradan halların vaxtında aşkarlanmasına və preventiv olaraq aradan qaldırılmasına xidmət edir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 6 — Dövlət orqanlarında daxili nəzarət mexanizmlərinin yaradılması korrupsiyaya şərait yaradan səbəb və şəraitin vaxtında aşkarlanmasına, habelə onların aradan qaldırılması üçün profilaktik tədbirlərin görülməsinə xidmət edir.',
    hint = 'Daxili nəzarət korrupsiyaya şərait yaradan halların vaxtında aşkarlanması və aradan qaldırılması məqsədilə təsis edilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'c13f9c3f-03a6-4850-8c2b-6a713f2c65e2');

-- Order 26: ID 7d3e3a85-caa8-426e-9d0b-b60ea5955b34
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxsin xidməti fəaliyyətində maraqların toqquşması (mənfəətlər toqquşması) yarandıqda o, necə davranmalıdır?',
    options = '["Maraqlar konfliktini öz şəxsi mülahizələrinə əsasən sərbəst şəkildə həll etməlidir", "Məsələni dərhal xarici audit şirkətlərinə və ya beynəlxalq qurumlara ötürməlidir", "Şəxsi marağını üstün tutaraq qərarı gizli şəkildə öz xeyrinə imzalamalıdır", "Məsələnin həllində iştirak etməməli və dərhal rəhbərliyə yazılı məlumat verməlidir"]'::jsonb,
    correct_answer = 'Məsələnin həllində iştirak etməməli və dərhal rəhbərliyə yazılı məlumat verməlidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Vəzifəli şəxsin xidməti fəaliyyətində maraqların toqquşması yarandığı hallarda o, bu barədə dərhal rəhbərliyə yazılı məlumat verməli və həmin məsələnin həllində iştirak etməkdən çəkinməlidir.',
    hint = 'Maraqlar toqquşması olduqda vəzifəli şəxs dərhal rəhbərliyə yazılı məlumat verməli və həll prosesindən çəkilməlidir.'
WHERE id = '7d3e3a85-caa8-426e-9d0b-b60ea5955b34';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxsin xidməti fəaliyyətində maraqların toqquşması (mənfəətlər toqquşması) yarandıqda o, necə davranmalıdır?',
    options = '["Maraqlar konfliktini öz şəxsi mülahizələrinə əsasən sərbəst şəkildə həll etməlidir", "Məsələni dərhal xarici audit şirkətlərinə və ya beynəlxalq qurumlara ötürməlidir", "Şəxsi marağını üstün tutaraq qərarı gizli şəkildə öz xeyrinə imzalamalıdır", "Məsələnin həllində iştirak etməməli və dərhal rəhbərliyə yazılı məlumat verməlidir"]'::jsonb,
    correct_answer = 'Məsələnin həllində iştirak etməməli və dərhal rəhbərliyə yazılı məlumat verməlidir',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Vəzifəli şəxsin xidməti fəaliyyətində maraqların toqquşması yarandığı hallarda o, bu barədə dərhal rəhbərliyə yazılı məlumat verməli və həmin məsələnin həllində iştirak etməkdən çəkinməlidir.',
    hint = 'Maraqlar toqquşması olduqda vəzifəli şəxs dərhal rəhbərliyə yazılı məlumat verməli və həll prosesindən çəkilməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '7d3e3a85-caa8-426e-9d0b-b60ea5955b34');

-- Order 27: ID 11e713e3-2976-4bd0-9a0a-af86f59379f5
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, korrupsiya hüquqpozmaları haqqında məlumat verən şəxslərin (whistleblower) dövlət tərəfindən müdafiəsi necə tənzimlənir?',
    options = '["Həmin şəxs daxili intizam qaydalarının pozulmasına görə dərhal tutduğu vəzifədən azad edilir", "Məlumat verən şəxsin şəxsiyyəti və fərdi məlumatları kütləvi informasiya vasitələrində açıqlanır", "Həmin şəxsin hüquqları, iş yeri və təhlükəsizliyi dövlət tərəfindən qorunur, məlumat verən şəxs təqib edilə bilməz", "Təşkilatın daxili qərarı ilə həmin şəxsə qarşı inzibati xarakterli maliyyə cərimələri tətbiq olunur"]'::jsonb,
    correct_answer = 'Həmin şəxsin hüquqları, iş yeri və təhlükəsizliyi dövlət tərəfindən qorunur, məlumat verən şəxs təqib edilə bilməz',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11-1 — Korrupsiya hüquqpozmaları barədə məlumat verən şəxslərin təhlükəsizliyi, hüquqları və iş yeri dövlət tərəfindən qorunur; həmin şəxslər verdikləri məlumatlara görə qanunsuz olaraq təqib edilə, intizam tənbehinə məruz qala və ya işdən çıxarıla bilməzlər.',
    hint = 'Məlumat verən şəxslərin təhlükəsizliyi, iş yeri və hüquqları dövlət tərəfindən qorunur və təqib olunmaları qadağandır.'
WHERE id = '11e713e3-2976-4bd0-9a0a-af86f59379f5';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, korrupsiya hüquqpozmaları haqqında məlumat verən şəxslərin (whistleblower) dövlət tərəfindən müdafiəsi necə tənzimlənir?',
    options = '["Həmin şəxs daxili intizam qaydalarının pozulmasına görə dərhal tutduğu vəzifədən azad edilir", "Məlumat verən şəxsin şəxsiyyəti və fərdi məlumatları kütləvi informasiya vasitələrində açıqlanır", "Həmin şəxsin hüquqları, iş yeri və təhlükəsizliyi dövlət tərəfindən qorunur, məlumat verən şəxs təqib edilə bilməz", "Təşkilatın daxili qərarı ilə həmin şəxsə qarşı inzibati xarakterli maliyyə cərimələri tətbiq olunur"]'::jsonb,
    correct_answer = 'Həmin şəxsin hüquqları, iş yeri və təhlükəsizliyi dövlət tərəfindən qorunur, məlumat verən şəxs təqib edilə bilməz',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11-1 — Korrupsiya hüquqpozmaları barədə məlumat verən şəxslərin təhlükəsizliyi, hüquqları və iş yeri dövlət tərəfindən qorunur; həmin şəxslər verdikləri məlumatlara görə qanunsuz olaraq təqib edilə, intizam tənbehinə məruz qala və ya işdən çıxarıla bilməzlər.',
    hint = 'Məlumat verən şəxslərin təhlükəsizliyi, iş yeri və hüquqları dövlət tərəfindən qorunur və təqib olunmaları qadağandır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '11e713e3-2976-4bd0-9a0a-af86f59379f5');

-- Order 28: ID ff6e5158-cca2-4189-b91a-004eaca04704
UPDATE questions SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, yaxın qohumlara kimlər aiddir?',
    options = '["Şəxsin qonşuluqda yaşayan yaxın tanışları və dostları", "Eyni idarə və ya təşkilatda çalışan əməkdaşlar və iş yoldaşları", "Ər-arvad, valideynlər, uşaqlar, övladlığa götürənlər, qardaşlar, bacılar, babalar, nənələr, nəvələr, ər-arvadın valideynləri, qardaşları, bacıları", "Uzaq qohumluq əlaqəsi olan əmiuşaqları, xalauşaqları və dayıuşaqları"]'::jsonb,
    correct_answer = 'Ər-arvad, valideynlər, uşaqlar, övladlığa götürənlər, qardaşlar, bacılar, babalar, nənələr, nəvələr, ər-arvadın valideynləri, qardaşları, bacıları',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 7.2 — Qanunun 7.2-ci maddəsinə əsasən, yaxın qohumlar dedikdə vəzifəli şəxsin əri (arvadı), valideynləri, babaları, nənələri, uşaqları, nəvələri, övladlığa götürənləri (götürülənləri), qardaşları və bacıları, habelə ərinin (arvadının) valideynləri, babaları, nənələri, qardaşları və bacıları başa düşülür.',
    hint = 'Yaxın qohumlar ər-arvad, valideynlər, babalar, nənələr, uşaqlar, nəvələr, qardaş-bacılar və ər-arvadın qohumlarıdır.'
WHERE id = 'ff6e5158-cca2-4189-b91a-004eaca04704';

UPDATE question_bank SET
    question_text = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, yaxın qohumlara kimlər aiddir?',
    options = '["Şəxsin qonşuluqda yaşayan yaxın tanışları və dostları", "Eyni idarə və ya təşkilatda çalışan əməkdaşlar və iş yoldaşları", "Ər-arvad, valideynlər, uşaqlar, övladlığa götürənlər, qardaşlar, bacılar, babalar, nənələr, nəvələr, ər-arvadın valideynləri, qardaşları, bacıları", "Uzaq qohumluq əlaqəsi olan əmiuşaqları, xalauşaqları və dayıuşaqları"]'::jsonb,
    correct_answer = 'Ər-arvad, valideynlər, uşaqlar, övladlığa götürənlər, qardaşlar, bacılar, babalar, nənələr, nəvələr, ər-arvadın valideynləri, qardaşları, bacıları',
    explanation = '“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 7.2 — Qanunun 7.2-ci maddəsinə əsasən, yaxın qohumlar dedikdə vəzifəli şəxsin əri (arvadı), valideynləri, babaları, nənələri, uşaqları, nəvələri, övladlığa götürənləri (götürülənləri), qardaşları və bacıları, habelə ərinin (arvadının) valideynləri, babaları, nənələri, qardaşları və bacıları başa düşülür.',
    hint = 'Yaxın qohumlar ər-arvad, valideynlər, babalar, nənələr, uşaqlar, nəvələr, qardaş-bacılar və ər-arvadın qohumlarıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'ff6e5158-cca2-4189-b91a-004eaca04704');

COMMIT;