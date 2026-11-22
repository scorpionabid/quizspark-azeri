-- Refinement of Modul 7: Etik Davranis Qaydalari (32 Questions)
-- Atomic transaction updating both questions and question_bank tables
BEGIN;

-- Order 0: ID c7428cd9-2033-4002-9b7a-33cca87a388b
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən, rəhbər tərəfindən verilmiş tapşırığın qanunsuz olduğunu bildiyi halda dövlət qulluqçusu necə hərəkət etməlidir?',
    options = '["Tapşırığın qanunsuzluğu barədə yazılı əsaslandırmanı dərhal rəhbərə təqdim etməli, tapşırıq təsdiqlənərsə yuxarı rəhbərə məlumat verməlidir", "Həmin tapşırığı dərhal kütləvi informasiya vasitələrinə (mətbuata) sızdırmalıdır", "İşi dərhal tərk edib iş yerindən qaçmalıdır", "Qanunsuz olduğunu bildiyi halda belə, rəhbərin göstərişi ilə dərhal kor-koranə icra etməlidir"]'::jsonb,
    correct_answer = 'Tapşırığın qanunsuzluğu barədə yazılı əsaslandırmanı dərhal rəhbərə təqdim etməli, tapşırıq təsdiqlənərsə yuxarı rəhbərə məlumat verməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və inzibati kargüzarlıq standartlarının tələblərinə əsasən, dövlət qulluqçusuna qanuna zidd (qanunsuz) tapşırıq verildikdə, o, həmin tapşırığın qanunsuzluğu barədə yazılı əsaslandırmanı dərhal rəhbərə təqdim etməlidir. Əgər rəhbər tapşırığı qüvvədə saxlayarsa və ya yazılı şəkildə təsdiq edərsə, dövlət qulluqçusu bu barədə yuxarı rəhbərə məlumat verməlidir. Bu hüquqi mexanizm dövlət qulluğunda qanunçuluğun, şəffaflığın və icra intizamının qorunması üçün tətbiq edilir.',
    hint = 'Dövlət qulluqçusu xidməti fəaliyyətində qanunun aliliyinə tabedir. Əgər ona verilən tapşırıq qanunvericiliyə ziddirsə, o, bu barədə öz mövqeyini rəsmi və yazılı şəkildə bildirməlidir.'
WHERE id = 'c7428cd9-2033-4002-9b7a-33cca87a388b';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən, rəhbər tərəfindən verilmiş tapşırığın qanunsuz olduğunu bildiyi halda dövlət qulluqçusu necə hərəkət etməlidir?',
    options = '["Tapşırığın qanunsuzluğu barədə yazılı əsaslandırmanı dərhal rəhbərə təqdim etməli, tapşırıq təsdiqlənərsə yuxarı rəhbərə məlumat verməlidir", "Həmin tapşırığı dərhal kütləvi informasiya vasitələrinə (mətbuata) sızdırmalıdır", "İşi dərhal tərk edib iş yerindən qaçmalıdır", "Qanunsuz olduğunu bildiyi halda belə, rəhbərin göstərişi ilə dərhal kor-koranə icra etməlidir"]'::jsonb,
    correct_answer = 'Tapşırığın qanunsuzluğu barədə yazılı əsaslandırmanı dərhal rəhbərə təqdim etməli, tapşırıq təsdiqlənərsə yuxarı rəhbərə məlumat verməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və inzibati kargüzarlıq standartlarının tələblərinə əsasən, dövlət qulluqçusuna qanuna zidd (qanunsuz) tapşırıq verildikdə, o, həmin tapşırığın qanunsuzluğu barədə yazılı əsaslandırmanı dərhal rəhbərə təqdim etməlidir. Əgər rəhbər tapşırığı qüvvədə saxlayarsa və ya yazılı şəkildə təsdiq edərsə, dövlət qulluqçusu bu barədə yuxarı rəhbərə məlumat verməlidir. Bu hüquqi mexanizm dövlət qulluğunda qanunçuluğun, şəffaflığın və icra intizamının qorunması üçün tətbiq edilir.',
    hint = 'Dövlət qulluqçusu xidməti fəaliyyətində qanunun aliliyinə tabedir. Əgər ona verilən tapşırıq qanunvericiliyə ziddirsə, o, bu barədə öz mövqeyini rəsmi və yazılı şəkildə bildirməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'c7428cd9-2033-4002-9b7a-33cca87a388b');

-- Order 1: ID b1f90194-1e0e-4e8a-aacc-b2d38f8ebf27
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən məlumatlardan istifadə ilə bağlı hansı qayda tətbiq olunur?',
    options = '["Dövlət sirri təşkil edən bütün məlumatlar operativ qaydada ictimaiyyətə açıqlanmalıdır", "Xidməti fəaliyyət zamanı əldə edilmiş xidməti məlumatları şəxsi maraqlar üçün istifadə etmək qadağandır", "Məlumatlar istənilən vaxt kənar şəxslərə və ya özəl qurumlara ödənişli əsaslarla satıla bilər", "Bütün xidməti sənədlər və daxili yazışmalar şəffaflıq naminə məcburi qaydada internetdə yayılmalıdır"]'::jsonb,
    correct_answer = 'Xidməti fəaliyyət zamanı əldə edilmiş xidməti məlumatları şəxsi maraqlar üçün istifadə etmək qadağandır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, dövlət qulluqçusuna xidməti fəaliyyəti zamanı qanunvericiliklə nəzərdə tutulmuş qaydada əldə etdiyi xidməti məlumatları (qanunla qorunan məlumatları) şəxsi maraqları, kənar şəxslərin mənafeyi və ya hər hansı qeyri-qanuni üstünlüklər əldə etmək üçün istifadə etmək qəti şəkildə qadağandır. Bu prinsip dövlət qulluğunda dürüstlük, obyektivlik, maraqlar münaqişəsinin qarşısının alınması və peşəkar etikaya tam əməl olunmasını təmin edir.',
    hint = 'Dövlət qulluqçusu xidməti fəaliyyəti zamanı əldə etdiyi məlumatların gizliliyinə və qanuniliyinə əməl etməli, onları şəxsi maraqları, habelə hər hansı qeyri-qanuni məqsədlər üçün istifadə etməməlidir.'
WHERE id = 'b1f90194-1e0e-4e8a-aacc-b2d38f8ebf27';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən məlumatlardan istifadə ilə bağlı hansı qayda tətbiq olunur?',
    options = '["Dövlət sirri təşkil edən bütün məlumatlar operativ qaydada ictimaiyyətə açıqlanmalıdır", "Xidməti fəaliyyət zamanı əldə edilmiş xidməti məlumatları şəxsi maraqlar üçün istifadə etmək qadağandır", "Məlumatlar istənilən vaxt kənar şəxslərə və ya özəl qurumlara ödənişli əsaslarla satıla bilər", "Bütün xidməti sənədlər və daxili yazışmalar şəffaflıq naminə məcburi qaydada internetdə yayılmalıdır"]'::jsonb,
    correct_answer = 'Xidməti fəaliyyət zamanı əldə edilmiş xidməti məlumatları şəxsi maraqlar üçün istifadə etmək qadağandır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, dövlət qulluqçusuna xidməti fəaliyyəti zamanı qanunvericiliklə nəzərdə tutulmuş qaydada əldə etdiyi xidməti məlumatları (qanunla qorunan məlumatları) şəxsi maraqları, kənar şəxslərin mənafeyi və ya hər hansı qeyri-qanuni üstünlüklər əldə etmək üçün istifadə etmək qəti şəkildə qadağandır. Bu prinsip dövlət qulluğunda dürüstlük, obyektivlik, maraqlar münaqişəsinin qarşısının alınması və peşəkar etikaya tam əməl olunmasını təmin edir.',
    hint = 'Dövlət qulluqçusu xidməti fəaliyyəti zamanı əldə etdiyi məlumatların gizliliyinə və qanuniliyinə əməl etməli, onları şəxsi maraqları, habelə hər hansı qeyri-qanuni məqsədlər üçün istifadə etməməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'b1f90194-1e0e-4e8a-aacc-b2d38f8ebf27');

-- Order 2: ID d43410c6-0576-4f84-a6f1-02e759f2c1b2
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən dövlət əmlakından və maliyyə vəsaitlərindən istifadə qaydası necədir?',
    options = '["Dövlət qulluqçusu həmin əmlak və vəsaitlərdən şəxsi ailə ehtiyacları üçün sərbəst istifadə edə bilər", "İş vaxtından sonra dövlət əmlakı istənilən işçinin şəxsi mülkiyyətinə ödənişsiz olaraq keçirilə bilər", "Yalnız xidməti məqsədlər üçün qənaətlə və səmərəli istifadə edilməlidir", "Yaxın qohumların və dostların şəxsi biznes layihələrinə təmənnasız icarəyə verilə bilər"]'::jsonb,
    correct_answer = 'Yalnız xidməti məqsədlər üçün qənaətlə və səmərəli istifadə edilməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, dövlət qulluqçusu dövlət əmlakından, maliyyə vəsaitlərindən, rabitə, hesablama və digər texniki vasitələrdən yalnız xidməti məqsədlər üçün qənaətlə və səmərəli istifadə etməlidir. Həmin əmlak və vəsaitlərdən şəxsi məqsədlər (və ya qeyri-xidməti ehtiyaclar) üçün istifadə edilməsinə yol verilmir. Bu prinsip dövlət əmlakının qorunmasını və büdcə vəsaitlərinin təyinatı üzrə xərclənməsini təmin edən əsas etik tələblərdəndir.',
    hint = 'Dövlət qulluqçusu dövlətə məxsus əmlakı, avadanlıqları, nəqliyyat vasitələrini və maliyyə vəsaitlərini yalnız bir məqsəd üçün – xidməti vəzifələrini yerinə yetirmək üçün qənaətlə və səmərəli şəkildə istifadə etməlidir.'
WHERE id = 'd43410c6-0576-4f84-a6f1-02e759f2c1b2';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən dövlət əmlakından və maliyyə vəsaitlərindən istifadə qaydası necədir?',
    options = '["Dövlət qulluqçusu həmin əmlak və vəsaitlərdən şəxsi ailə ehtiyacları üçün sərbəst istifadə edə bilər", "İş vaxtından sonra dövlət əmlakı istənilən işçinin şəxsi mülkiyyətinə ödənişsiz olaraq keçirilə bilər", "Yalnız xidməti məqsədlər üçün qənaətlə və səmərəli istifadə edilməlidir", "Yaxın qohumların və dostların şəxsi biznes layihələrinə təmənnasız icarəyə verilə bilər"]'::jsonb,
    correct_answer = 'Yalnız xidməti məqsədlər üçün qənaətlə və səmərəli istifadə edilməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, dövlət qulluqçusu dövlət əmlakından, maliyyə vəsaitlərindən, rabitə, hesablama və digər texniki vasitələrdən yalnız xidməti məqsədlər üçün qənaətlə və səmərəli istifadə etməlidir. Həmin əmlak və vəsaitlərdən şəxsi məqsədlər (və ya qeyri-xidməti ehtiyaclar) üçün istifadə edilməsinə yol verilmir. Bu prinsip dövlət əmlakının qorunmasını və büdcə vəsaitlərinin təyinatı üzrə xərclənməsini təmin edən əsas etik tələblərdəndir.',
    hint = 'Dövlət qulluqçusu dövlətə məxsus əmlakı, avadanlıqları, nəqliyyat vasitələrini və maliyyə vəsaitlərini yalnız bir məqsəd üçün – xidməti vəzifələrini yerinə yetirmək üçün qənaətlə və səmərəli şəkildə istifadə etməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'd43410c6-0576-4f84-a6f1-02e759f2c1b2');

-- Order 3: ID bf63f53b-a04b-4f12-a120-9757552579b9
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən rəhbər vəzifəli şəxsin tabeliyində olanlara münasibətdə davranışı necə olmalıdır?',
    options = '["Şəxsi mənfəəti və ya maraqları üçün onları xidməti səlahiyyətlərinə aid olmayan qanunsuz işlərə cəlb etməlidir", "Ədalətli, obyektiv və qərəzsiz olmalı, tabelikdə olanların ləyaqətini alçaltmamalıdır", "Yalnız öz yaxın qohumlarına və şəxsi tanışlarına daimi olaraq yüksək mükafatlar yazmalıdır", "Tabelikdə olanlarla sərt, kobud və təhqiramiz tonda danışmaq hüququna malikdir"]'::jsonb,
    correct_answer = 'Ədalətli, obyektiv və qərəzsiz olmalı, tabelikdə olanların ləyaqətini alçaltmamalıdır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun rəhbərlərin etik davranış qaydalarını tənzimləyən müvafiq maddəsinə əsasən, rəhbər vəzifəli şəxs tabeliyində olan dövlət qulluqçularına münasibətdə ədalətli, obyektiv və qərəzsiz olmalı, onların ləyaqətini alçaltmamalı, həmçinin xidməti fəaliyyətdə heç bir ayrı-seçkiliyə yol verməməlidir. Rəhbər şəxs sağlam mənəvi-psixoloji mühit yaratmalı və dövlət qulluğu nüfuzunu yüksək tutmalıdır. Digər variantlar isə etik davranış qaydalarının kobud şəkildə pozulması deməkdir.',
    hint = 'Dövlət qulluğunda rəhbərliklə tabelikdə olan işçilər arasındakı münasibətlər qarşılıqlı hörmətə, ədalətliliyə, obyektivliyə əsaslanmalı və işçilərin şərəf və ləyaqəti hər zaman qorunmalıdır.'
WHERE id = 'bf63f53b-a04b-4f12-a120-9757552579b9';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən rəhbər vəzifəli şəxsin tabeliyində olanlara münasibətdə davranışı necə olmalıdır?',
    options = '["Şəxsi mənfəəti və ya maraqları üçün onları xidməti səlahiyyətlərinə aid olmayan qanunsuz işlərə cəlb etməlidir", "Ədalətli, obyektiv və qərəzsiz olmalı, tabelikdə olanların ləyaqətini alçaltmamalıdır", "Yalnız öz yaxın qohumlarına və şəxsi tanışlarına daimi olaraq yüksək mükafatlar yazmalıdır", "Tabelikdə olanlarla sərt, kobud və təhqiramiz tonda danışmaq hüququna malikdir"]'::jsonb,
    correct_answer = 'Ədalətli, obyektiv və qərəzsiz olmalı, tabelikdə olanların ləyaqətini alçaltmamalıdır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun rəhbərlərin etik davranış qaydalarını tənzimləyən müvafiq maddəsinə əsasən, rəhbər vəzifəli şəxs tabeliyində olan dövlət qulluqçularına münasibətdə ədalətli, obyektiv və qərəzsiz olmalı, onların ləyaqətini alçaltmamalı, həmçinin xidməti fəaliyyətdə heç bir ayrı-seçkiliyə yol verməməlidir. Rəhbər şəxs sağlam mənəvi-psixoloji mühit yaratmalı və dövlət qulluğu nüfuzunu yüksək tutmalıdır. Digər variantlar isə etik davranış qaydalarının kobud şəkildə pozulması deməkdir.',
    hint = 'Dövlət qulluğunda rəhbərliklə tabelikdə olan işçilər arasındakı münasibətlər qarşılıqlı hörmətə, ədalətliliyə, obyektivliyə əsaslanmalı və işçilərin şərəf və ləyaqəti hər zaman qorunmalıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'bf63f53b-a04b-4f12-a120-9757552579b9');

-- Order 4: ID 87fca22d-0976-4826-a1b9-48af6aa54116
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən korrupsiyanın qarşısının alınması ilə bağlı dövlət qulluqçusunun əsas vəzifələrindən biri hansıdır?',
    options = '["Dövlət satınalmalarında və tenderlərdə öz yaxın qohumlarına və tanışlarına üstünlük vermək", "Xidməti fəaliyyət zamanı əldə edilən qanunsuz qazancı və gəlirləri xüsusi hesablarda gizlətmək", "Qanunsuz maddi və qeyri-maddi nemətlər, imtiyazlar və ya güzəştlər tələb etməmək və qəbul etməmək", "Yalnız dövlət səviyyəsində qeyd olunan rəsmi bayramlarda istənilən dəyərdə hədiyyə qəbul etmək"]'::jsonb,
    correct_answer = 'Qanunsuz maddi və qeyri-maddi nemətlər, imtiyazlar və ya güzəştlər tələb etməmək və qəbul etməmək',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun korrupsiyanın qarşısının alınmasına dair müddəalarına və antikorrupsiya qanunvericiliyinə əsasən, dövlət qulluqçusu xidməti vəzifələrinin icrası ilə əlaqədar heç bir fiziki və ya hüquqi şəxsdən qanunsuz maddi və qeyri-maddi nemətlər, hədiyyələr, imtiyazlar və ya güzəştlər tələb etməməli və qəbul etməməlidir. Bu tələb maraqlar münaqişəsinin qarşısını almaq, şəffaflığı qorumaq və dövlət qulluqçusunun dürüstlüyünü təmin etmək üçün tətbiq edilən təməl etik və hüquqi prinsipdir.',
    hint = 'Dövlət qulluğunda korrupsiyaya qarşı mübarizə və şəffaflığın təmin edilməsi məqsədilə dövlət qulluqçularına xidməti fəaliyyəti ilə əlaqədar hər hansı qeyri-qanuni üstünlüklər, nemətlər və hədiyyələr əldə etmək qəti şəkildə qadağan edilmişdir.'
WHERE id = '87fca22d-0976-4826-a1b9-48af6aa54116';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən korrupsiyanın qarşısının alınması ilə bağlı dövlət qulluqçusunun əsas vəzifələrindən biri hansıdır?',
    options = '["Dövlət satınalmalarında və tenderlərdə öz yaxın qohumlarına və tanışlarına üstünlük vermək", "Xidməti fəaliyyət zamanı əldə edilən qanunsuz qazancı və gəlirləri xüsusi hesablarda gizlətmək", "Qanunsuz maddi və qeyri-maddi nemətlər, imtiyazlar və ya güzəştlər tələb etməmək və qəbul etməmək", "Yalnız dövlət səviyyəsində qeyd olunan rəsmi bayramlarda istənilən dəyərdə hədiyyə qəbul etmək"]'::jsonb,
    correct_answer = 'Qanunsuz maddi və qeyri-maddi nemətlər, imtiyazlar və ya güzəştlər tələb etməmək və qəbul etməmək',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun korrupsiyanın qarşısının alınmasına dair müddəalarına və antikorrupsiya qanunvericiliyinə əsasən, dövlət qulluqçusu xidməti vəzifələrinin icrası ilə əlaqədar heç bir fiziki və ya hüquqi şəxsdən qanunsuz maddi və qeyri-maddi nemətlər, hədiyyələr, imtiyazlar və ya güzəştlər tələb etməməli və qəbul etməməlidir. Bu tələb maraqlar münaqişəsinin qarşısını almaq, şəffaflığı qorumaq və dövlət qulluqçusunun dürüstlüyünü təmin etmək üçün tətbiq edilən təməl etik və hüquqi prinsipdir.',
    hint = 'Dövlət qulluğunda korrupsiyaya qarşı mübarizə və şəffaflığın təmin edilməsi məqsədilə dövlət qulluqçularına xidməti fəaliyyəti ilə əlaqədar hər hansı qeyri-qanuni üstünlüklər, nemətlər və hədiyyələr əldə etmək qəti şəkildə qadağan edilmişdir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '87fca22d-0976-4826-a1b9-48af6aa54116');

-- Order 5: ID 7a94ca3e-5e4e-48a1-8ede-abec2d3f50fd
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununa əsasən etik davranış qaydalarının əsas məqsədi nədir?',
    options = '["Dövlət qulluqçularının həftəlik iş saatlarının minimum həddə endirilməsi və istirahət günlərinin artırılması", "Dövlət orqanlarının və dövlət qulluğunun nüfuzunun artırılması, vətəndaşların dövlət qulluqçularına etimadının möhkəmləndirilməsi", "Dövlət büdcəsinin gəlirlər hissəsinin inzibati cərimələr hesabına operativ olaraq zənginləşdirilməsi", "Bütün kateqoriyadan olan dövlət qulluqçularının aylıq vəzifə maaşlarının və əlavə əməkhaqlarının artırılması"]'::jsonb,
    correct_answer = 'Dövlət orqanlarının və dövlət qulluğunun nüfuzunun artırılması, vətəndaşların dövlət qulluqçularına etimadının möhkəmləndirilməsi',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun məqsədlərini müəyyən edən müddəalarına əsasən, etik davranış qaydalarının tətbiqində əsas məqsəd dövlət orqanlarının və dövlət qulluğunun nüfuzunun artırılması, dövlət qulluqçuları tərəfindən dürüstlük, qərəzsizlik və xidməti intizamın təmin edilməsi, habelə vətəndaşların dövlət orqanlarına və dövlət qulluqçularına etimadının möhkəmləndirilməsidir. Bu qaydalar dövlət qulluğunda etik standartların qorunması və korrupsiyanın qarşısının alınması mexanizmlərindən biridir.',
    hint = 'Qanunvericilikdə dövlət qulluqçularının peşəkar davranış standartlarını tənzimləyən normativ sənədlərin qəbul olunmasında əsas hədəf cəmiyyətin dövlət aparatına olan inamının artırılması və dövlət qulluğu nüfuzunun uca tutulmasıdır.'
WHERE id = '7a94ca3e-5e4e-48a1-8ede-abec2d3f50fd';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununa əsasən etik davranış qaydalarının əsas məqsədi nədir?',
    options = '["Dövlət qulluqçularının həftəlik iş saatlarının minimum həddə endirilməsi və istirahət günlərinin artırılması", "Dövlət orqanlarının və dövlət qulluğunun nüfuzunun artırılması, vətəndaşların dövlət qulluqçularına etimadının möhkəmləndirilməsi", "Dövlət büdcəsinin gəlirlər hissəsinin inzibati cərimələr hesabına operativ olaraq zənginləşdirilməsi", "Bütün kateqoriyadan olan dövlət qulluqçularının aylıq vəzifə maaşlarının və əlavə əməkhaqlarının artırılması"]'::jsonb,
    correct_answer = 'Dövlət orqanlarının və dövlət qulluğunun nüfuzunun artırılması, vətəndaşların dövlət qulluqçularına etimadının möhkəmləndirilməsi',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun məqsədlərini müəyyən edən müddəalarına əsasən, etik davranış qaydalarının tətbiqində əsas məqsəd dövlət orqanlarının və dövlət qulluğunun nüfuzunun artırılması, dövlət qulluqçuları tərəfindən dürüstlük, qərəzsizlik və xidməti intizamın təmin edilməsi, habelə vətəndaşların dövlət orqanlarına və dövlət qulluqçularına etimadının möhkəmləndirilməsidir. Bu qaydalar dövlət qulluğunda etik standartların qorunması və korrupsiyanın qarşısının alınması mexanizmlərindən biridir.',
    hint = 'Qanunvericilikdə dövlət qulluqçularının peşəkar davranış standartlarını tənzimləyən normativ sənədlərin qəbul olunmasında əsas hədəf cəmiyyətin dövlət aparatına olan inamının artırılması və dövlət qulluğu nüfuzunun uca tutulmasıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '7a94ca3e-5e4e-48a1-8ede-abec2d3f50fd');

-- Order 6: ID 77769279-740e-4319-8388-7d7188dfb8f4
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və korrupsiyaya qarşı mübarizə qanunvericiliyinə əsasən, protokol qaydaları çərçivəsində təqdim edilmiş hədiyyənin dəyəri qanunvericiliklə müəyyən olunmuş məbləğdən (55 manatdan) yuxarı olduqda nə edilir?',
    options = '["Dərhal açıq hərraca çıxarılaraq satılır və vəsait dövlət qulluqçusuna şəxsi mükafat kimi verilir", "Dövlət qulluqçusunun şəxsi mülkiyyətində qalır və heç bir rəsmiləşdirmə tələb olunmur", "Ekoloji tələblərə uyğun olaraq dərhal zibil qutusuna atılır və ya məhv edilir", "Dövlət orqanına təhvil verilir və dövlət mülkiyyətinə keçir"]'::jsonb,
    correct_answer = 'Dövlət orqanına təhvil verilir və dövlət mülkiyyətinə keçir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanununun və “Korrupsiyaya qarşı mübarizə haqqında” Qanunun tələblərinə əsasən, dövlət qulluqçularına xidməti vəzifələrinin icrası ilə əlaqədar hədiyyə almaq qadağandır. Lakin qonaqpərvərlik və ya protokol tədbirləri çərçivəsində təqdim olunan hədiyyələrin dəyəri 55 manatdan yuxarı olduqda, həmin hədiyyə dövlət qulluqçusunda qala bilməz – o, dövlət orqanına təhvil verilir və dövlət mülkiyyətinə keçir. Bu norma maraqlar münaqişəsinin və gizli korrupsiya hallatının qarşısını almaq üçün tətbiq edilən vacib mexanizmdir.',
    hint = 'Dövlət qulluqçusunun xidməti fəaliyyəti ilə əlaqədar qəbul etdiyi hədiyyələrin qiymət həddi məhdudlaşdırılır; əgər hədiyyə protokola uyğun olaraq qəbul edilibsə və dəyəri müəyyən edilmiş həddi (55 manatı) aşırsa, həmin əşya dövlət mülkiyyətinə keçirilməlidir.'
WHERE id = '77769279-740e-4319-8388-7d7188dfb8f4';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və korrupsiyaya qarşı mübarizə qanunvericiliyinə əsasən, protokol qaydaları çərçivəsində təqdim edilmiş hədiyyənin dəyəri qanunvericiliklə müəyyən olunmuş məbləğdən (55 manatdan) yuxarı olduqda nə edilir?',
    options = '["Dərhal açıq hərraca çıxarılaraq satılır və vəsait dövlət qulluqçusuna şəxsi mükafat kimi verilir", "Dövlət qulluqçusunun şəxsi mülkiyyətində qalır və heç bir rəsmiləşdirmə tələb olunmur", "Ekoloji tələblərə uyğun olaraq dərhal zibil qutusuna atılır və ya məhv edilir", "Dövlət orqanına təhvil verilir və dövlət mülkiyyətinə keçir"]'::jsonb,
    correct_answer = 'Dövlət orqanına təhvil verilir və dövlət mülkiyyətinə keçir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanununun və “Korrupsiyaya qarşı mübarizə haqqında” Qanunun tələblərinə əsasən, dövlət qulluqçularına xidməti vəzifələrinin icrası ilə əlaqədar hədiyyə almaq qadağandır. Lakin qonaqpərvərlik və ya protokol tədbirləri çərçivəsində təqdim olunan hədiyyələrin dəyəri 55 manatdan yuxarı olduqda, həmin hədiyyə dövlət qulluqçusunda qala bilməz – o, dövlət orqanına təhvil verilir və dövlət mülkiyyətinə keçir. Bu norma maraqlar münaqişəsinin və gizli korrupsiya hallatının qarşısını almaq üçün tətbiq edilən vacib mexanizmdir.',
    hint = 'Dövlət qulluqçusunun xidməti fəaliyyəti ilə əlaqədar qəbul etdiyi hədiyyələrin qiymət həddi məhdudlaşdırılır; əgər hədiyyə protokola uyğun olaraq qəbul edilibsə və dəyəri müəyyən edilmiş həddi (55 manatı) aşırsa, həmin əşya dövlət mülkiyyətinə keçirilməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '77769279-740e-4319-8388-7d7188dfb8f4');

-- Order 7: ID be00a487-2d76-42aa-a509-074fde51b646
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən dövlət orqanında yaradılan etik davranış qaydalarının tətbiqi ilə bağlı komissiya əsasən hansı məsələləri araşdırır?',
    options = '["Dövlət orqanının inzibati binasının cari təmiri və tikinti işlərinin illik maliyyə smetasını", "Yalnız dövlət orqanının server sistemlərinin və kompüter avadanlıqlarının texniki yenilənməsini", "Etik davranış qaydalarının pozulması faktlarını, maraqlar münaqişəsi hallarını və bu istiqamətdə aparılan xidməti yoxlamaları", "Bütün dövlət qulluqçularının yay və qış ayları üzrə növbəli məzuniyyət qrafiklərinin tərtibini"]'::jsonb,
    correct_answer = 'Etik davranış qaydalarının pozulması faktlarını, maraqlar münaqişəsi hallarını və bu istiqamətdə aparılan xidməti yoxlamaları',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə və dövlət qulluğu kargüzarlığına əsasən, dövlət orqanlarında etik davranış qaydalarının tətbiqinə nəzarət etmək məqsədilə xüsusi komissiyalar yaradılır. Bu komissiyalar dövlət qulluqçuları tərəfindən etik davranış qaydalarının pozulması halları, maraqlar münaqişəsi, hədiyyə almaqla bağlı məhdudiyyətlərin pozulması və xidməti davranışa dair daxil olan şikayətlər üzrə xidməti yoxlamaları və araşdırmaları həyata keçirirlər. Maliyyə, texniki və ya ümumi kadr məsələləri (məsələn, məzuniyyət və ya təmir işləri) isə bu komissiyanın səlahiyyət dairəsinə aid deyil.',
    hint = 'Dövlət orqanlarında işçilərin peşəkar etikaya əməl etməsini izləmək və korrupsiya risklərinin qarşısını almaq üçün xüsusi daxili komissiyalar fəaliyyət göstərir ki, onların əsas funksiyalarından biri daxil olan müraciətlər əsasında etik pozuntuları araşdırmaqdır.'
WHERE id = 'be00a487-2d76-42aa-a509-074fde51b646';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən dövlət orqanında yaradılan etik davranış qaydalarının tətbiqi ilə bağlı komissiya əsasən hansı məsələləri araşdırır?',
    options = '["Dövlət orqanının inzibati binasının cari təmiri və tikinti işlərinin illik maliyyə smetasını", "Yalnız dövlət orqanının server sistemlərinin və kompüter avadanlıqlarının texniki yenilənməsini", "Etik davranış qaydalarının pozulması faktlarını, maraqlar münaqişəsi hallarını və bu istiqamətdə aparılan xidməti yoxlamaları", "Bütün dövlət qulluqçularının yay və qış ayları üzrə növbəli məzuniyyət qrafiklərinin tərtibini"]'::jsonb,
    correct_answer = 'Etik davranış qaydalarının pozulması faktlarını, maraqlar münaqişəsi hallarını və bu istiqamətdə aparılan xidməti yoxlamaları',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə və dövlət qulluğu kargüzarlığına əsasən, dövlət orqanlarında etik davranış qaydalarının tətbiqinə nəzarət etmək məqsədilə xüsusi komissiyalar yaradılır. Bu komissiyalar dövlət qulluqçuları tərəfindən etik davranış qaydalarının pozulması halları, maraqlar münaqişəsi, hədiyyə almaqla bağlı məhdudiyyətlərin pozulması və xidməti davranışa dair daxil olan şikayətlər üzrə xidməti yoxlamaları və araşdırmaları həyata keçirirlər. Maliyyə, texniki və ya ümumi kadr məsələləri (məsələn, məzuniyyət və ya təmir işləri) isə bu komissiyanın səlahiyyət dairəsinə aid deyil.',
    hint = 'Dövlət orqanlarında işçilərin peşəkar etikaya əməl etməsini izləmək və korrupsiya risklərinin qarşısını almaq üçün xüsusi daxili komissiyalar fəaliyyət göstərir ki, onların əsas funksiyalarından biri daxil olan müraciətlər əsasında etik pozuntuları araşdırmaqdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'be00a487-2d76-42aa-a509-074fde51b646');

-- Order 8: ID 6ac12f05-ca96-4ae2-a647-b89c23856de2
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən etik müvəkkil kimdir?',
    options = '["Dövlət orqanının inzibati binasının təsərrüfat məsələlərinə baxan təsərrüfat müdiridir", "Yalnız kənar hüquqi qurumlar tərəfindən təyin olunan müstəqil vəkildir", "Məhkəmə qərarlarının icrasını təmin edən baş məhkəmə icraçısıdır", "Etik davranış qaydalarına əməl olunmasına nəzarət edən və bu sahədə maarifləndirmə aparan səlahiyyətli şəxsdir"]'::jsonb,
    correct_answer = 'Etik davranış qaydalarına əməl olunmasına nəzarət edən və bu sahədə maarifləndirmə aparan səlahiyyətli şəxsdir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət orqanlarında etik davranış qaydalarına nəzarət mexanizmlərinə əsasən, etik müvəkkil – dövlət orqanlarında etik davranış qaydalarına əməl olunmasına nəzarət edən, bu sahədə profilaktik tədbirlər görən, maarifləndirmə aparan və etik davranışla bağlı daxil olan məsələləri araşdıran səlahiyyətli şəxsdir. Bu institut dövlət qulluğunda peşəkar etik standartların möhkəmləndirilməsində və maraqlar münaqişəsinin qarşısının alınmasında mühüm mexanizmlərdən biridir.',
    hint = 'Dövlət orqanlarında daxili intizamın, etik standartların qorunması, qulluqçuların bu qaydalara əməl etməsinə nəzarət edilməsi və həmin sahədə maarifləndirmə işlərinin aparılması üçün xüsusi səlahiyyətli vəzifəli şəxs təsis edilir.'
WHERE id = '6ac12f05-ca96-4ae2-a647-b89c23856de2';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən etik müvəkkil kimdir?',
    options = '["Dövlət orqanının inzibati binasının təsərrüfat məsələlərinə baxan təsərrüfat müdiridir", "Yalnız kənar hüquqi qurumlar tərəfindən təyin olunan müstəqil vəkildir", "Məhkəmə qərarlarının icrasını təmin edən baş məhkəmə icraçısıdır", "Etik davranış qaydalarına əməl olunmasına nəzarət edən və bu sahədə maarifləndirmə aparan səlahiyyətli şəxsdir"]'::jsonb,
    correct_answer = 'Etik davranış qaydalarına əməl olunmasına nəzarət edən və bu sahədə maarifləndirmə aparan səlahiyyətli şəxsdir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət orqanlarında etik davranış qaydalarına nəzarət mexanizmlərinə əsasən, etik müvəkkil – dövlət orqanlarında etik davranış qaydalarına əməl olunmasına nəzarət edən, bu sahədə profilaktik tədbirlər görən, maarifləndirmə aparan və etik davranışla bağlı daxil olan məsələləri araşdıran səlahiyyətli şəxsdir. Bu institut dövlət qulluğunda peşəkar etik standartların möhkəmləndirilməsində və maraqlar münaqişəsinin qarşısının alınmasında mühüm mexanizmlərdən biridir.',
    hint = 'Dövlət orqanlarında daxili intizamın, etik standartların qorunması, qulluqçuların bu qaydalara əməl etməsinə nəzarət edilməsi və həmin sahədə maarifləndirmə işlərinin aparılması üçün xüsusi səlahiyyətli vəzifəli şəxs təsis edilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '6ac12f05-ca96-4ae2-a647-b89c23856de2');

-- Order 9: ID b84793e1-1432-4729-b28a-ca81424d6a18
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və qanunvericiliyin tələblərinə əsasən dövlət orqanında etik qaydaların təbliği və tətbiqi üzrə təlimlər necə həyata keçirilməlidir?',
    options = '["Mütəmadi olaraq təşkil edilməlidir", "Yalnız 10 ildən bir növbəti attestasiya zamanı keçirilməlidir", "Yalnız xarici dövlətlərin ekspertlərinin xüsusi iştirakı ilə olmalıdır", "Qətiyyən təşkil edilməməlidir, qulluqçular qaydaları sərbəst öyrənməlidirlər"]'::jsonb,
    correct_answer = 'Mütəmadi olaraq təşkil edilməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət qulluğunda etik standartların möhkəmləndirilməsi mexanizmlərinə əsasən, dövlət orqanlarında etik davranış qaydalarının təbliği və tətbiqi üzrə təlimlər, seminar və izahat işləri mütəmadi olaraq təşkil edilməlidir. Bu tədbirlər dövlət qulluqçularında etik dəyərlərin formalaşdırılmasına, maraqlar münaqişəsinin vaxtında aşkar edilməsinə və xidməti intizamın yüksəldilməsinə xidmət edir.',
    hint = 'Dövlət qulluqçularının peşəkar etikaya və xidməti standartlara riayət etmələrini təmin etmək, onlarda dürüstlük və qərəzsizlik dəyərlərini aşılamaq məqsədilə dövlət orqanlarında maarifləndirmə işləri fasiləsiz olaraq aparılmalıdır.'
WHERE id = 'b84793e1-1432-4729-b28a-ca81424d6a18';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və qanunvericiliyin tələblərinə əsasən dövlət orqanında etik qaydaların təbliği və tətbiqi üzrə təlimlər necə həyata keçirilməlidir?',
    options = '["Mütəmadi olaraq təşkil edilməlidir", "Yalnız 10 ildən bir növbəti attestasiya zamanı keçirilməlidir", "Yalnız xarici dövlətlərin ekspertlərinin xüsusi iştirakı ilə olmalıdır", "Qətiyyən təşkil edilməməlidir, qulluqçular qaydaları sərbəst öyrənməlidirlər"]'::jsonb,
    correct_answer = 'Mütəmadi olaraq təşkil edilməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət qulluğunda etik standartların möhkəmləndirilməsi mexanizmlərinə əsasən, dövlət orqanlarında etik davranış qaydalarının təbliği və tətbiqi üzrə təlimlər, seminar və izahat işləri mütəmadi olaraq təşkil edilməlidir. Bu tədbirlər dövlət qulluqçularında etik dəyərlərin formalaşdırılmasına, maraqlar münaqişəsinin vaxtında aşkar edilməsinə və xidməti intizamın yüksəldilməsinə xidmət edir.',
    hint = 'Dövlət qulluqçularının peşəkar etikaya və xidməti standartlara riayət etmələrini təmin etmək, onlarda dürüstlük və qərəzsizlik dəyərlərini aşılamaq məqsədilə dövlət orqanlarında maarifləndirmə işləri fasiləsiz olaraq aparılmalıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'b84793e1-1432-4729-b28a-ca81424d6a18');

-- Order 10: ID 8110a391-08e8-4706-bb0d-9547b713cc8a
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən ictimai etimad prinsipi dövlət qulluqçusundan nəyi tələb edir?',
    options = '["İstənilən xidməti fəaliyyət barədə dərhal kütləvi informasiya vasitələrində rəsmi mətbuat konfransı təşkil etməyi", "Dövlət qulluqçusunun dövlət qulluğunun nüfuzunu möhkəmləndirməyi, etik davranış qaydalarına hər zaman əməl etməyi və vətəndaşların dövlətə inamını doğrultmağı", "Şəxsi sosial şəbəkə hesablarında dövlət sirri təşkil etməyən daxili kargüzarlıq sənədlərini sərbəst müzakirə etməyi", "İş vaxtı yalnız yaxın dostlara, qohumlara və tanışlara prioritet qaydada operativ xidmət göstərməyi"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun dövlət qulluğunun nüfuzunu möhkəmləndirməyi, etik davranış qaydalarına hər zaman əməl etməyi və vətəndaşların dövlətə inamını doğrultmağı',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, ictimai etimad prinsipi dövlət qulluqçusundan tələb edir ki, o, dövlət qulluğunun nüfuzunu möhkəmləndirsin, dürüst, ədalətli və qərəzsiz olsun, habelə cəmiyyətin və vətəndaşların dövlət orqanlarına və dövlət qulluqçularına olan inamını doğrultsun. Bu prinsipə əsasən, dövlət qulluqçusu öz hərəkətləri və ya davranışı ilə dövlət aparatına olan etimada xələl gətirə biləcək hər hansı haldan çəkinməlidir.',
    hint = 'Dövlət qulluğunda əsas etik prinsiplərdən biri olan ictimai etimad prinsipi vətəndaşların dövlət aparatına və onun təsisatlarına olan inamının qorunması, möhkəmləndirilməsi və yüksək səviyyədə saxlanılması ilə bilavasitə bağlıdır.'
WHERE id = '8110a391-08e8-4706-bb0d-9547b713cc8a';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən ictimai etimad prinsipi dövlət qulluqçusundan nəyi tələb edir?',
    options = '["İstənilən xidməti fəaliyyət barədə dərhal kütləvi informasiya vasitələrində rəsmi mətbuat konfransı təşkil etməyi", "Dövlət qulluqçusunun dövlət qulluğunun nüfuzunu möhkəmləndirməyi, etik davranış qaydalarına hər zaman əməl etməyi və vətəndaşların dövlətə inamını doğrultmağı", "Şəxsi sosial şəbəkə hesablarında dövlət sirri təşkil etməyən daxili kargüzarlıq sənədlərini sərbəst müzakirə etməyi", "İş vaxtı yalnız yaxın dostlara, qohumlara və tanışlara prioritet qaydada operativ xidmət göstərməyi"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun dövlət qulluğunun nüfuzunu möhkəmləndirməyi, etik davranış qaydalarına hər zaman əməl etməyi və vətəndaşların dövlətə inamını doğrultmağı',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, ictimai etimad prinsipi dövlət qulluqçusundan tələb edir ki, o, dövlət qulluğunun nüfuzunu möhkəmləndirsin, dürüst, ədalətli və qərəzsiz olsun, habelə cəmiyyətin və vətəndaşların dövlət orqanlarına və dövlət qulluqçularına olan inamını doğrultsun. Bu prinsipə əsasən, dövlət qulluqçusu öz hərəkətləri və ya davranışı ilə dövlət aparatına olan etimada xələl gətirə biləcək hər hansı haldan çəkinməlidir.',
    hint = 'Dövlət qulluğunda əsas etik prinsiplərdən biri olan ictimai etimad prinsipi vətəndaşların dövlət aparatına və onun təsisatlarına olan inamının qorunması, möhkəmləndirilməsi və yüksək səviyyədə saxlanılması ilə bilavasitə bağlıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '8110a391-08e8-4706-bb0d-9547b713cc8a');

-- Order 11: ID 10e3c424-0e79-4773-8207-048de11f39b9
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən etik müvəkkil (və ya etik davranış qaydalarına əməl olunmasına nəzarət edən səlahiyyətli şəxs) əsasən hansı vəzifələri yerinə yetirir?',
    options = '["Dövlət orqanının illik büdcə vəsaitlərini struktur bölmələr arasında bölüşdürür", "Etik davranış qaydalarının pozulması ilə bağlı daxil olmuş müraciətləri araşdırır, məsləhətlər verir və rəhbərə təkliflər təqdim edir", "Etik qaydaları pozan dövlət qulluqçularına birbaşa maliyyə cərimələri və tənbeh tədbirləri tətbiq edir", "Dövlət orqanının qəbul etdiyi qərarlardan narazı olan vətəndaşların məhkəmə qərarlarını ləğv edir"]'::jsonb,
    correct_answer = 'Etik davranış qaydalarının pozulması ilə bağlı daxil olmuş müraciətləri araşdırır, məsləhətlər verir və rəhbərə təkliflər təqdim edir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət orqanlarında etik davranış qaydalarına nəzarət mexanizmlərinə əsasən, etik müvəkkil dövlət qulluqçuları tərəfindən etik davranış qaydalarına əməl olunmasına nəzarət edir, bu qaydaların pozulması halları ilə bağlı daxil olan müraciətləri araşdırır, qulluqçulara etik davranış qaydaları ilə bağlı metodik köməklik və məsləhətlər verir, həmçinin aşkar olunmuş pozuntuların aradan qaldırılması üçün dövlət orqanının rəhbərinə təkliflər təqdim edir. Büdcənin bölgüsü, fərdi cərimələrin tətbiqi və ya məhkəmə qərarlarının ləğvi isə etik müvəkkilin səlahiyyətlərinə qətiyyən aid deyil.',
    hint = 'Dövlət orqanlarında təsis edilən etik müvəkkil institutu işçilərin etik davranış qaydalarına əməl etməsinə nəzarət edir, bu sahədə maarifləndirmə aparır və daxil olan müraciətləri araşdıraraq müvafiq tədbirlər görür.'
WHERE id = '10e3c424-0e79-4773-8207-048de11f39b9';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən etik müvəkkil (və ya etik davranış qaydalarına əməl olunmasına nəzarət edən səlahiyyətli şəxs) əsasən hansı vəzifələri yerinə yetirir?',
    options = '["Dövlət orqanının illik büdcə vəsaitlərini struktur bölmələr arasında bölüşdürür", "Etik davranış qaydalarının pozulması ilə bağlı daxil olmuş müraciətləri araşdırır, məsləhətlər verir və rəhbərə təkliflər təqdim edir", "Etik qaydaları pozan dövlət qulluqçularına birbaşa maliyyə cərimələri və tənbeh tədbirləri tətbiq edir", "Dövlət orqanının qəbul etdiyi qərarlardan narazı olan vətəndaşların məhkəmə qərarlarını ləğv edir"]'::jsonb,
    correct_answer = 'Etik davranış qaydalarının pozulması ilə bağlı daxil olmuş müraciətləri araşdırır, məsləhətlər verir və rəhbərə təkliflər təqdim edir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət orqanlarında etik davranış qaydalarına nəzarət mexanizmlərinə əsasən, etik müvəkkil dövlət qulluqçuları tərəfindən etik davranış qaydalarına əməl olunmasına nəzarət edir, bu qaydaların pozulması halları ilə bağlı daxil olan müraciətləri araşdırır, qulluqçulara etik davranış qaydaları ilə bağlı metodik köməklik və məsləhətlər verir, həmçinin aşkar olunmuş pozuntuların aradan qaldırılması üçün dövlət orqanının rəhbərinə təkliflər təqdim edir. Büdcənin bölgüsü, fərdi cərimələrin tətbiqi və ya məhkəmə qərarlarının ləğvi isə etik müvəkkilin səlahiyyətlərinə qətiyyən aid deyil.',
    hint = 'Dövlət orqanlarında təsis edilən etik müvəkkil institutu işçilərin etik davranış qaydalarına əməl etməsinə nəzarət edir, bu sahədə maarifləndirmə aparır və daxil olan müraciətləri araşdıraraq müvafiq tədbirlər görür.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '10e3c424-0e79-4773-8207-048de11f39b9');

-- Order 12: ID 313b6655-1875-4897-baf2-ac2535172dca
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununa əsasən qanunun aliliyi prinsipi dövlət qulluqçusundan nəyi tələb edir?',
    options = '["Qanunvericilikdə edilən dəyişikliklərə məhəl qoymamağı və yalnız daxili adətlərlə işləməyi", "Yalnız birbaşa rəhbərin şifahi əmrlərinə və göstərişlərinə sözsüz əməl etməyi", "Qanunları yalnız məhkəmə prosesləri zamanı oxumağı və tətbiq etməyi", "Dövlət qulluqçusunun öz vəzifələrini icra edərkən Azərbaycan Respublikasının Konstitusiyasını, qanunlarını və digər normativ hüquqi aktlarını rəhbər tutmasını"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun öz vəzifələrini icra edərkən Azərbaycan Respublikasının Konstitusiyasını, qanunlarını və digər normativ hüquqi aktlarını rəhbər tutmasını',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, qanunun aliliyi prinsipi dövlət qulluqçusunun xidməti vəzifələrini yerinə yetirərkən Azərbaycan Respublikasının Konstitusiyasını, qanunlarını və digər normativ hüquqi aktlarını rəhbər tutmasını tələb edir. Bu prinsip dövlət qulluğunda qanunçuluğun, hüquqi nizam-intizamın və dövlət orqanlarının fəaliyyətində hüququn aliliyinin təmin edilməsinin təməl şərtidir.',
    hint = 'Dövlət qulluğunun əsas prinsiplərindən biri olan qanunun aliliyi dövlət aparatının fəaliyyətində hüquqi aktların üstünlüyünü və hər bir qulluqçunun qanunvericiliyə dəqiq əməl etməsini ehtiva edir.'
WHERE id = '313b6655-1875-4897-baf2-ac2535172dca';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununa əsasən qanunun aliliyi prinsipi dövlət qulluqçusundan nəyi tələb edir?',
    options = '["Qanunvericilikdə edilən dəyişikliklərə məhəl qoymamağı və yalnız daxili adətlərlə işləməyi", "Yalnız birbaşa rəhbərin şifahi əmrlərinə və göstərişlərinə sözsüz əməl etməyi", "Qanunları yalnız məhkəmə prosesləri zamanı oxumağı və tətbiq etməyi", "Dövlət qulluqçusunun öz vəzifələrini icra edərkən Azərbaycan Respublikasının Konstitusiyasını, qanunlarını və digər normativ hüquqi aktlarını rəhbər tutmasını"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun öz vəzifələrini icra edərkən Azərbaycan Respublikasının Konstitusiyasını, qanunlarını və digər normativ hüquqi aktlarını rəhbər tutmasını',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, qanunun aliliyi prinsipi dövlət qulluqçusunun xidməti vəzifələrini yerinə yetirərkən Azərbaycan Respublikasının Konstitusiyasını, qanunlarını və digər normativ hüquqi aktlarını rəhbər tutmasını tələb edir. Bu prinsip dövlət qulluğunda qanunçuluğun, hüquqi nizam-intizamın və dövlət orqanlarının fəaliyyətində hüququn aliliyinin təmin edilməsinin təməl şərtidir.',
    hint = 'Dövlət qulluğunun əsas prinsiplərindən biri olan qanunun aliliyi dövlət aparatının fəaliyyətində hüquqi aktların üstünlüyünü və hər bir qulluqçunun qanunvericiliyə dəqiq əməl etməsini ehtiva edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '313b6655-1875-4897-baf2-ac2535172dca');

-- Order 13: ID abb04cb8-4b1c-4345-b2df-108557e6d9ec
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və əlaqədar qanunvericiliyə əsasən dövlət qulluqçusunun xidməti vəzifəsindən kənar elmi, pedaqoji və yaradıcılıq fəaliyyəti necə tənzimlənir?',
    options = '["Qətiyyən qadağandır, dövlət qulluqçusu işdən kənar heç bir digər fəaliyyətlə məşğul ola bilməz", "Yalnız müvafiq nazirliyin xüsusi əmri və icazəsi ilə ildə cəmi 1 dəfə həyata keçirilə bilər", "Qanunvericiliklə müəyyən edilmiş qaydada yol verilir (əgər bu fəaliyyət əsas xidməti vəzifələrin icrasına mane olmursa və maraqlar münaqişəsi yaratmırsa)", "Yalnız ödənişsiz əsaslarla və yalnız rəsmi məzuniyyət dövründə həyata keçirilə bilər"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada yol verilir (əgər bu fəaliyyət əsas xidməti vəzifələrin icrasına mane olmursa və maraqlar münaqişəsi yaratmırsa)',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” və “Dövlət qulluğu haqqında” Azərbaycan Respublikasının qanunlarının tələblərinə əsasən, dövlət qulluqçusuna sahibkarlıq fəaliyyəti ilə məşğul olmaq qadağan edilsə də, onun elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olmasına qanunvericiliklə icazə verilir. Lakin bu zaman mütləq şərt odur ki, həmin fəaliyyət onun əsas xidməti vəzifələrinin keyfiyyətlə və vaxtında icrasına mane olmasın, maraqlar münaqişəsi yaratmasın və dövlət qulluqçusu etikasına zidd olmasın.',
    hint = 'Dövlət qulluqçusu üçün sahibkarlıq və digər qazanc gətirən kommersiya fəaliyyəti məhdudlaşdırılsa da, intellektual və yaradıcı potensialın inkişafı baxımından müəyyən fəaliyyət növlərinə qanuni istisnalar şəklində icazə verilir.'
WHERE id = 'abb04cb8-4b1c-4345-b2df-108557e6d9ec';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və əlaqədar qanunvericiliyə əsasən dövlət qulluqçusunun xidməti vəzifəsindən kənar elmi, pedaqoji və yaradıcılıq fəaliyyəti necə tənzimlənir?',
    options = '["Qətiyyən qadağandır, dövlət qulluqçusu işdən kənar heç bir digər fəaliyyətlə məşğul ola bilməz", "Yalnız müvafiq nazirliyin xüsusi əmri və icazəsi ilə ildə cəmi 1 dəfə həyata keçirilə bilər", "Qanunvericiliklə müəyyən edilmiş qaydada yol verilir (əgər bu fəaliyyət əsas xidməti vəzifələrin icrasına mane olmursa və maraqlar münaqişəsi yaratmırsa)", "Yalnız ödənişsiz əsaslarla və yalnız rəsmi məzuniyyət dövründə həyata keçirilə bilər"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada yol verilir (əgər bu fəaliyyət əsas xidməti vəzifələrin icrasına mane olmursa və maraqlar münaqişəsi yaratmırsa)',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” və “Dövlət qulluğu haqqında” Azərbaycan Respublikasının qanunlarının tələblərinə əsasən, dövlət qulluqçusuna sahibkarlıq fəaliyyəti ilə məşğul olmaq qadağan edilsə də, onun elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olmasına qanunvericiliklə icazə verilir. Lakin bu zaman mütləq şərt odur ki, həmin fəaliyyət onun əsas xidməti vəzifələrinin keyfiyyətlə və vaxtında icrasına mane olmasın, maraqlar münaqişəsi yaratmasın və dövlət qulluqçusu etikasına zidd olmasın.',
    hint = 'Dövlət qulluqçusu üçün sahibkarlıq və digər qazanc gətirən kommersiya fəaliyyəti məhdudlaşdırılsa da, intellektual və yaradıcı potensialın inkişafı baxımından müəyyən fəaliyyət növlərinə qanuni istisnalar şəklində icazə verilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'abb04cb8-4b1c-4345-b2df-108557e6d9ec');

-- Order 14: ID 4dff77d1-8339-4d4a-8b08-332e8959ce40
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən insanların hüquq, azadlıq və qanuni maraqlarına, şərəf və ləyaqətinə hörmət prinsipi nəyi ehtiva edir?',
    options = '["Şəxslərin hüquqlarını pozmamağı, onlarla nəzakətli, xeyirxah və təmkinli davranmağı", "Şəxslərin dövlət orqanlarına daxil olan müraciətlərini qəsdən qulaqardına vurmağı", "Vətəndaşların fərdi qəbulu zamanı onlarla sərt, ayrı-seçkilik yaradan və kobud şəkildə danışmağı", "Yalnız özündən yuxarı rəhbər vəzifəli şəxslərə xüsusi hörmət və ehtiram göstərməyi"]'::jsonb,
    correct_answer = 'Şəxslərin hüquqlarını pozmamağı, onlarla nəzakətli, xeyirxah və təmkinli davranmağı',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, insanların hüquq, azadlıq və qanuni maraqlarına, şərəf və ləyaqətinə hörmət prinsipi dövlət qulluqçusundan hər bir şəxsin hüquqlarını pozmamağı, onlarla münasibətdə nəzakətli, xeyirxah, diqqətli və təmkinli olmağı tələb edir. Dövlət qulluqçusu vətəndaşların şərəf və ləyaqətini alçaldan hərəkətlərə yol verməməli, hər zaman etik standartlara riayət etməlidir. Digər variantlar isə bu prinsipə və dövlət qulluğu etikasının tələblərinə qəti ziddir.',
    hint = 'Dövlət qulluqçusu vətəndaşlarla işləyərkən onların hüquqlarına həssaslıqla yanaşmalı, hər bir şəxsin şərəf və ləyaqətini uca tutmalı, xidməti fəaliyyətində nəzakətli və təmkinli olmalıdır.'
WHERE id = '4dff77d1-8339-4d4a-8b08-332e8959ce40';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən insanların hüquq, azadlıq və qanuni maraqlarına, şərəf və ləyaqətinə hörmət prinsipi nəyi ehtiva edir?',
    options = '["Şəxslərin hüquqlarını pozmamağı, onlarla nəzakətli, xeyirxah və təmkinli davranmağı", "Şəxslərin dövlət orqanlarına daxil olan müraciətlərini qəsdən qulaqardına vurmağı", "Vətəndaşların fərdi qəbulu zamanı onlarla sərt, ayrı-seçkilik yaradan və kobud şəkildə danışmağı", "Yalnız özündən yuxarı rəhbər vəzifəli şəxslərə xüsusi hörmət və ehtiram göstərməyi"]'::jsonb,
    correct_answer = 'Şəxslərin hüquqlarını pozmamağı, onlarla nəzakətli, xeyirxah və təmkinli davranmağı',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, insanların hüquq, azadlıq və qanuni maraqlarına, şərəf və ləyaqətinə hörmət prinsipi dövlət qulluqçusundan hər bir şəxsin hüquqlarını pozmamağı, onlarla münasibətdə nəzakətli, xeyirxah, diqqətli və təmkinli olmağı tələb edir. Dövlət qulluqçusu vətəndaşların şərəf və ləyaqətini alçaldan hərəkətlərə yol verməməli, hər zaman etik standartlara riayət etməlidir. Digər variantlar isə bu prinsipə və dövlət qulluğu etikasının tələblərinə qəti ziddir.',
    hint = 'Dövlət qulluqçusu vətəndaşlarla işləyərkən onların hüquqlarına həssaslıqla yanaşmalı, hər bir şəxsin şərəf və ləyaqətini uca tutmalı, xidməti fəaliyyətində nəzakətli və təmkinli olmalıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '4dff77d1-8339-4d4a-8b08-332e8959ce40');

-- Order 15: ID c85bd9a6-030d-4c0b-bfb9-2c3b1a6ddf03
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və daxili intizam standartlarına əsasən dövlət qulluqçusu öz geyim və xarici görünüşündə nəyə əməl etməlidir?',
    options = '["İşgüzar üsluba, səliqəliliyə və dövlət qulluğunun nüfuzuna uyğun geyim tərzinə", "İstənilən sərbəst çimərlik və ya qeyri-rəsmi gündəlik geyim tərzinə", "Dəbdəbəli karnaval geyimlərinə və ya parıltılı səhnə kostyumlarına", "Yalnız idman üslublu geyimlərə, krossovkalara və başlıqlara"]'::jsonb,
    correct_answer = 'İşgüzar üsluba, səliqəliliyə və dövlət qulluğunun nüfuzuna uyğun geyim tərzinə',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə və dövlət qulluğu kargüzarlığı standartlarına əsasən, dövlət qulluqçusu xidməti fəaliyyəti zamanı öz geyim və xarici görünüşündə işgüzar üsluba, səliqəliliyə və dövlət qulluğunun nüfuzuna uyğun geyim tərzinə əməl etməlidir. Dövlət qulluqçusunun xarici görünüşü cəmiyyətdə dövlət aparatına olan etimadı və hörməti qorumalı, işgüzar etikaya tam cavab verməlidir.',
    hint = 'Dövlət qulluqçusunun xarici görünüşü və geyimi çalışdığı dövlət orqanının nüfuzuna, işgüzar mühitə və peşəkar etikaya tam uyğun olmalıdır.'
WHERE id = 'c85bd9a6-030d-4c0b-bfb9-2c3b1a6ddf03';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və daxili intizam standartlarına əsasən dövlət qulluqçusu öz geyim və xarici görünüşündə nəyə əməl etməlidir?',
    options = '["İşgüzar üsluba, səliqəliliyə və dövlət qulluğunun nüfuzuna uyğun geyim tərzinə", "İstənilən sərbəst çimərlik və ya qeyri-rəsmi gündəlik geyim tərzinə", "Dəbdəbəli karnaval geyimlərinə və ya parıltılı səhnə kostyumlarına", "Yalnız idman üslublu geyimlərə, krossovkalara və başlıqlara"]'::jsonb,
    correct_answer = 'İşgüzar üsluba, səliqəliliyə və dövlət qulluğunun nüfuzuna uyğun geyim tərzinə',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun tələblərinə və dövlət qulluğu kargüzarlığı standartlarına əsasən, dövlət qulluqçusu xidməti fəaliyyəti zamanı öz geyim və xarici görünüşündə işgüzar üsluba, səliqəliliyə və dövlət qulluğunun nüfuzuna uyğun geyim tərzinə əməl etməlidir. Dövlət qulluqçusunun xarici görünüşü cəmiyyətdə dövlət aparatına olan etimadı və hörməti qorumalı, işgüzar etikaya tam cavab verməlidir.',
    hint = 'Dövlət qulluqçusunun xarici görünüşü və geyimi çalışdığı dövlət orqanının nüfuzuna, işgüzar mühitə və peşəkar etikaya tam uyğun olmalıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'c85bd9a6-030d-4c0b-bfb9-2c3b1a6ddf03');

-- Order 16: ID f068cc93-9790-4b65-a703-8b52d902f38d
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən loyal davranış prinsipi nəyi nəzərdə tutur?',
    options = '["İşlədiyi dövlət orqanını və ya struktur bölməni istənilən vaxt könüllü olaraq tərk etməyi", "İş vaxtı və ya xidməti fəaliyyət zamanı hər gün birbaşa rəhbəri ictimai şəkildə tərifləməyi", "İstənilən siyasi partiyanın rəsmi iclasında fəal şəkildə siyasi xarakterli çıxış etməyi", "Dövlət orqanlarının, onların rəhbərlərinin fəaliyyəti barədə ictimaiyyətdə mənfi rəy yarada biləcək tənqidi çıxışlardan çəkinməyi"]'::jsonb,
    correct_answer = 'Dövlət orqanlarının, onların rəhbərlərinin fəaliyyəti barədə ictimaiyyətdə mənfi rəy yarada biləcək tənqidi çıxışlardan çəkinməyi',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, loyal davranış prinsipi dövlət qulluqçusundan dövlət orqanlarının, habelə onların rəhbərlərinin fəaliyyəti barədə ictimaiyyətdə mənfi rəy yarada biləcək, qanunvericiliklə nəzərdə tutulmuş xidməti qaydalar və hallar istisna olmaqla, əsassız tənqidi çıxışlardan və bəyanatlardan çəkinməyi tələb edir. Bu prinsip dövlət aparatının nüfuzunun qorunmasına, korporativ həmrəyliyə və dövlət qulluğunda xidməti intizamın təmin olunmasına xidmət edir.',
    hint = 'Dövlət qulluğunda loyalıq prinsipi dövlət qulluqçusunun xidməti fəaliyyətində və ictimai çıxışlarında dövlət orqanlarının nüfuzunu qorumasını, onun fəaliyyətinə kölgə salacaq əsassız və qeyri-rəsmi tənqidi bəyanatlardan çəkinməsini tələb edir.'
WHERE id = 'f068cc93-9790-4b65-a703-8b52d902f38d';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən loyal davranış prinsipi nəyi nəzərdə tutur?',
    options = '["İşlədiyi dövlət orqanını və ya struktur bölməni istənilən vaxt könüllü olaraq tərk etməyi", "İş vaxtı və ya xidməti fəaliyyət zamanı hər gün birbaşa rəhbəri ictimai şəkildə tərifləməyi", "İstənilən siyasi partiyanın rəsmi iclasında fəal şəkildə siyasi xarakterli çıxış etməyi", "Dövlət orqanlarının, onların rəhbərlərinin fəaliyyəti barədə ictimaiyyətdə mənfi rəy yarada biləcək tənqidi çıxışlardan çəkinməyi"]'::jsonb,
    correct_answer = 'Dövlət orqanlarının, onların rəhbərlərinin fəaliyyəti barədə ictimaiyyətdə mənfi rəy yarada biləcək tənqidi çıxışlardan çəkinməyi',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, loyal davranış prinsipi dövlət qulluqçusundan dövlət orqanlarının, habelə onların rəhbərlərinin fəaliyyəti barədə ictimaiyyətdə mənfi rəy yarada biləcək, qanunvericiliklə nəzərdə tutulmuş xidməti qaydalar və hallar istisna olmaqla, əsassız tənqidi çıxışlardan və bəyanatlardan çəkinməyi tələb edir. Bu prinsip dövlət aparatının nüfuzunun qorunmasına, korporativ həmrəyliyə və dövlət qulluğunda xidməti intizamın təmin olunmasına xidmət edir.',
    hint = 'Dövlət qulluğunda loyalıq prinsipi dövlət qulluqçusunun xidməti fəaliyyətində və ictimai çıxışlarında dövlət orqanlarının nüfuzunu qorumasını, onun fəaliyyətinə kölgə salacaq əsassız və qeyri-rəsmi tənqidi bəyanatlardan çəkinməsini tələb edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'f068cc93-9790-4b65-a703-8b52d902f38d');

-- Order 17: ID ff03fbba-98db-461a-b4c5-cd9915b9d27f
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən etik müvəkkilin hesabatı hansı dövriliklə rəhbərə təqdim olunur?',
    options = '["Yalnız nazir və ya qurum rəhbəri dəyişdikdə növbədənkənar qaydada", "Hər gün səhər tezdən iclasda şifahi şəkildə", "İldə ən azı bir dəfə və ya zərurət yarandıqda", "Tam olaraq 10 ildən bir attestasiya zamanı"]'::jsonb,
    correct_answer = 'İldə ən azı bir dəfə və ya zərurət yarandıqda',
    explanation = 'Dövlət qulluğunda etik davranış qaydalarının tətbiqi və nəzarət mexanizmlərini tənzimləyən normativ tələblərə əsasən, dövlət orqanında təsis edilmiş etik müvəkkil fəaliyyəti, daxil olan müraciətlər, aparılan xidməti yoxlamalar və etik standartların vəziyyəti barədə hesabatını ildə ən azı bir dəfə və ya zərurət yarandıqda dövlət orqanının rəhbərinə təqdim edir. Bu hesabatlılıq mexanizmi daxili intizamın gücləndirilməsinə və etik qaydalara riayət olunmasına mütəmadi nəzarət edilməsinə xidmət edir.',
    hint = 'Dövlət orqanlarında etik davranış qaydalarına əməl olunmasına nəzarət edən etik müvəkkil öz fəaliyyəti, aparılan araşdırmalar və ümumi vəziyyət barədə rəhbərliyə müəyyən edilmiş dövrlərdə hesabat təqdim etməlidir.'
WHERE id = 'ff03fbba-98db-461a-b4c5-cd9915b9d27f';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və müvafiq normativ aktlara əsasən etik müvəkkilin hesabatı hansı dövriliklə rəhbərə təqdim olunur?',
    options = '["Yalnız nazir və ya qurum rəhbəri dəyişdikdə növbədənkənar qaydada", "Hər gün səhər tezdən iclasda şifahi şəkildə", "İldə ən azı bir dəfə və ya zərurət yarandıqda", "Tam olaraq 10 ildən bir attestasiya zamanı"]'::jsonb,
    correct_answer = 'İldə ən azı bir dəfə və ya zərurət yarandıqda',
    explanation = 'Dövlət qulluğunda etik davranış qaydalarının tətbiqi və nəzarət mexanizmlərini tənzimləyən normativ tələblərə əsasən, dövlət orqanında təsis edilmiş etik müvəkkil fəaliyyəti, daxil olan müraciətlər, aparılan xidməti yoxlamalar və etik standartların vəziyyəti barədə hesabatını ildə ən azı bir dəfə və ya zərurət yarandıqda dövlət orqanının rəhbərinə təqdim edir. Bu hesabatlılıq mexanizmi daxili intizamın gücləndirilməsinə və etik qaydalara riayət olunmasına mütəmadi nəzarət edilməsinə xidmət edir.',
    hint = 'Dövlət orqanlarında etik davranış qaydalarına əməl olunmasına nəzarət edən etik müvəkkil öz fəaliyyəti, aparılan araşdırmalar və ümumi vəziyyət barədə rəhbərliyə müəyyən edilmiş dövrlərdə hesabat təqdim etməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'ff03fbba-98db-461a-b4c5-cd9915b9d27f');

-- Order 18: ID 5fc1868f-f82b-44e7-803f-0784236758c3
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən hədiyyə almaqla bağlı əsas məhdudiyyət nədən ibarətdir?',
    options = '["Yalnız xarici valyutada olan hədiyyələri rəsmi qaydada qəbul etmək olar", "İstənilən dəyərdə və istənilən şəxsdən hədiyyə sərbəst qəbul edilə bilər", "Hədiyyə yalnız nağd pulla və ya bank köçürməsi vasitəsilə alına bilər", "Xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təəssürat yaradan hədiyyələri qəbul etmək qadağandır"]'::jsonb,
    correct_answer = 'Xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təəssürat yaradan hədiyyələri qəbul etmək qadağandır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və antikorrupsiya qanunvericiliyinin tələblərinə əsasən, dövlət qulluqçusuna xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təəssürat yaradan hədiyyələri qəbul etmək qəti şəkildə qadağandır. Bu norma maraqlar münaqişəsinin qarşısını almaq, şəffaflığı təmin etmək və dövlət qulluğunun nüfuzunu qorumaq məqsədi daşıyır.',
    hint = 'Dövlət qulluqçusu xidməti fəaliyyətini həyata keçirərkən heç bir şəxsdən elə hədiyyə və ya nemət qəbul etməməlidir ki, bu onun qərəzsizliyinə təsir göstərsin və ya cəmiyyətdə belə bir təəssürat yaratsın.'
WHERE id = '5fc1868f-f82b-44e7-803f-0784236758c3';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən hədiyyə almaqla bağlı əsas məhdudiyyət nədən ibarətdir?',
    options = '["Yalnız xarici valyutada olan hədiyyələri rəsmi qaydada qəbul etmək olar", "İstənilən dəyərdə və istənilən şəxsdən hədiyyə sərbəst qəbul edilə bilər", "Hədiyyə yalnız nağd pulla və ya bank köçürməsi vasitəsilə alına bilər", "Xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təəssürat yaradan hədiyyələri qəbul etmək qadağandır"]'::jsonb,
    correct_answer = 'Xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təəssürat yaradan hədiyyələri qəbul etmək qadağandır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və antikorrupsiya qanunvericiliyinin tələblərinə əsasən, dövlət qulluqçusuna xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təəssürat yaradan hədiyyələri qəbul etmək qəti şəkildə qadağandır. Bu norma maraqlar münaqişəsinin qarşısını almaq, şəffaflığı təmin etmək və dövlət qulluğunun nüfuzunu qorumaq məqsədi daşıyır.',
    hint = 'Dövlət qulluqçusu xidməti fəaliyyətini həyata keçirərkən heç bir şəxsdən elə hədiyyə və ya nemət qəbul etməməlidir ki, bu onun qərəzsizliyinə təsir göstərsin və ya cəmiyyətdə belə bir təəssürat yaratsın.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '5fc1868f-f82b-44e7-803f-0784236758c3');

-- Order 19: ID 429f7dde-6a1d-4e51-a585-34fee6f9db5b
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən kollektiv daxilində dövlət qulluqçularının qarşılıqlı münasibətləri necə olmalıdır?',
    options = '["Yalnız sağlam olmayan daxili rəqabət və qeybət mühitində", "Bir-birinə qarşı açıq qərəzli, inamsız və intriqa mühitində", "Qarşılıqlı hörmət, əməkdaşlıq və sağlam mənəvi-psixoloji mühit əsasında", "Hər kəsin digər işçilərdən tam şəkildə fərdi təcrid olunması şəklində"]'::jsonb,
    correct_answer = 'Qarşılıqlı hörmət, əməkdaşlıq və sağlam mənəvi-psixoloji mühit əsasında',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və peşəkar etik davranış normalarının tələblərinə əsasən, dövlət qulluqçularının kollektiv daxilində qarşılıqlı münasibətləri qarşılıqlı hörmət, əməkdaşlıq və sağlam mənəvi-psixoloji mühit əsasında qurulmalıdır. Dövlət qulluqçusu həmkarlarının şərəf və ləyaqətinə hörmət etməli, dövlət orqanında sağlam işgüzar mühitin qorunmasına kömək göstərməlidir. Digər variantlar isə daxili intizamı və etik standartları kobud şəkildə pozan hallardır.',
    hint = 'Dövlət qulluqçuları arasında xidməti münasibətlər və işgüzar əlaqələr sağlam mənəvi mühitə, qarşılıqlı etimada, hörmətə və peşəkar əməkdaşlığa əsaslanmalıdır.'
WHERE id = '429f7dde-6a1d-4e51-a585-34fee6f9db5b';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən kollektiv daxilində dövlət qulluqçularının qarşılıqlı münasibətləri necə olmalıdır?',
    options = '["Yalnız sağlam olmayan daxili rəqabət və qeybət mühitində", "Bir-birinə qarşı açıq qərəzli, inamsız və intriqa mühitində", "Qarşılıqlı hörmət, əməkdaşlıq və sağlam mənəvi-psixoloji mühit əsasında", "Hər kəsin digər işçilərdən tam şəkildə fərdi təcrid olunması şəklində"]'::jsonb,
    correct_answer = 'Qarşılıqlı hörmət, əməkdaşlıq və sağlam mənəvi-psixoloji mühit əsasında',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və peşəkar etik davranış normalarının tələblərinə əsasən, dövlət qulluqçularının kollektiv daxilində qarşılıqlı münasibətləri qarşılıqlı hörmət, əməkdaşlıq və sağlam mənəvi-psixoloji mühit əsasında qurulmalıdır. Dövlət qulluqçusu həmkarlarının şərəf və ləyaqətinə hörmət etməli, dövlət orqanında sağlam işgüzar mühitin qorunmasına kömək göstərməlidir. Digər variantlar isə daxili intizamı və etik standartları kobud şəkildə pozan hallardır.',
    hint = 'Dövlət qulluqçuları arasında xidməti münasibətlər və işgüzar əlaqələr sağlam mənəvi mühitə, qarşılıqlı etimada, hörmətə və peşəkar əməkdaşlığa əsaslanmalıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '429f7dde-6a1d-4e51-a585-34fee6f9db5b');

-- Order 20: ID 30d722fb-1254-483b-ad2f-493d8a26a59f
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən ictimai və ya siyasi fəaliyyətlə məşğul olarkən dövlət qulluqçusu nəyə riayət etməlidir?',
    options = '["Vətəndaşları və tabelikdə olan şəxsləri mütləq şəkildə müəyyən bir siyasi partiyaya səs verməyə məcbur etməlidir", "İş vaxtı dövlət orqanının binasında kütləvi siyasi mitinqlər və tətillər təşkil etməlidir", "Dövlət qulluğunun siyasi bitərəflik prinsipini qorumalı, xidməti mövqeyindən siyasi məqsədlər üçün istifadə etməməlidir", "İşlədiyi dövlət orqanının inzibati binasında hər hansı siyasi partiyanın rəsmi özəyini və ya filialını yaratmalıdır"]'::jsonb,
    correct_answer = 'Dövlət qulluğunun siyasi bitərəflik prinsipini qorumalı, xidməti mövqeyindən siyasi məqsədlər üçün istifadə etməməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” və “Dövlət qulluğu haqqında” Azərbaycan Respublikası qanunlarının tələblərinə əsasən, dövlət qulluqçusu xidməti fəaliyyətində siyasi bitərəflik prinsipini rəhbər tutmalıdır. O, öz xidməti mövqeyindən, səlahiyyətlərindən və ya dövlət əmlakından hər hansı siyasi partiyanın, ictimai birliyin və ya ayrı-ayrı siyasi qüvvələrin maraqları üçün istifadə edə bilməz. Dövlət orqanlarında siyasi partiyaların strukturlarının yaradılmasına yol verilmir. Digər variantlar isə qanunvericiliklə qadağan olunan kobud pozuntulardır.',
    hint = 'Dövlət qulluqçuları xidməti fəaliyyətlərində siyasi bitərəflik prinsipini qorumalı, dövlət aparatını siyasi proseslərdən kənarda saxlamalı və xidməti mövqelərindən siyasi məqsədlər üçün istifadə etməməlidirlər.'
WHERE id = '30d722fb-1254-483b-ad2f-493d8a26a59f';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən ictimai və ya siyasi fəaliyyətlə məşğul olarkən dövlət qulluqçusu nəyə riayət etməlidir?',
    options = '["Vətəndaşları və tabelikdə olan şəxsləri mütləq şəkildə müəyyən bir siyasi partiyaya səs verməyə məcbur etməlidir", "İş vaxtı dövlət orqanının binasında kütləvi siyasi mitinqlər və tətillər təşkil etməlidir", "Dövlət qulluğunun siyasi bitərəflik prinsipini qorumalı, xidməti mövqeyindən siyasi məqsədlər üçün istifadə etməməlidir", "İşlədiyi dövlət orqanının inzibati binasında hər hansı siyasi partiyanın rəsmi özəyini və ya filialını yaratmalıdır"]'::jsonb,
    correct_answer = 'Dövlət qulluğunun siyasi bitərəflik prinsipini qorumalı, xidməti mövqeyindən siyasi məqsədlər üçün istifadə etməməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” və “Dövlət qulluğu haqqında” Azərbaycan Respublikası qanunlarının tələblərinə əsasən, dövlət qulluqçusu xidməti fəaliyyətində siyasi bitərəflik prinsipini rəhbər tutmalıdır. O, öz xidməti mövqeyindən, səlahiyyətlərindən və ya dövlət əmlakından hər hansı siyasi partiyanın, ictimai birliyin və ya ayrı-ayrı siyasi qüvvələrin maraqları üçün istifadə edə bilməz. Dövlət orqanlarında siyasi partiyaların strukturlarının yaradılmasına yol verilmir. Digər variantlar isə qanunvericiliklə qadağan olunan kobud pozuntulardır.',
    hint = 'Dövlət qulluqçuları xidməti fəaliyyətlərində siyasi bitərəflik prinsipini qorumalı, dövlət aparatını siyasi proseslərdən kənarda saxlamalı və xidməti mövqelərindən siyasi məqsədlər üçün istifadə etməməlidirlər.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '30d722fb-1254-483b-ad2f-493d8a26a59f');

-- Order 21: ID 53bf058e-94d9-41ac-8db7-4dc685269af1
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən maraqların toqquşması (maraqlar münaqişəsi) yarandıqda dövlət qulluqçusu nə etməlidir?',
    options = '["Dərhal bu barədə birbaşa rəhbərinə məlumat verməli və həmin məsələnin həllindən kənarlaşmalıdır", "Maraqlar münaqişəsini gizlədərək yaxın qohumunun xeyrinə gizli sənəd imzalamalıdır", "Yaranmış maraqları vəziyyətdən asılı olaraq başqalarından gizlədib qərarı təkbaşına qəbul etməlidir", "Dövlət qulluğunda xidməti fəaliyyətini dərhal dayandırıb ölkə xaricinə getməlidir"]'::jsonb,
    correct_answer = 'Dərhal bu barədə birbaşa rəhbərinə məlumat verməli və həmin məsələnin həllindən kənarlaşmalıdır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun maraqlar münaqişəsinin tənzimlənməsinə dair müddəalarına əsasən, dövlət qulluqçusunun xidməti vəzifələrini yerinə yetirərkən onun şəxsi maraqları ilə dövlət orqanının qanuni maraqları arasında ziddiyyət yarandıqda (və ya yaranması ehtimalı olduqda), o, dərhal bu barədə birbaşa rəhbərinə yazılı məlumat verməli və həmin məsələnin həllindən (qərar qəbul edilməsindən) kənarlaşmalıdır. Bu tələb korrupsiyanın qarşısının alınması və qəbul edilən qərarların obyektivliyinin təmin olunması üçün əsas mexanizmdir. Digər variantlar isə qanunvericiliyin kobud şəkildə pozulması deməkdir.',
    hint = 'Dövlət qulluqçusunun şəxsi maraqları ilə xidməti səlahiyyətləri arasında ziddiyyət yarandığı hallarda, qanunvericilik şəffaflığın qorunması və qərəzsizliyin təmin edilməsi üçün dərhal rəhbərliyə məlumat verilməsini və həmin məsələnin həllindən kənarlaşmağı tələb edir.'
WHERE id = '53bf058e-94d9-41ac-8db7-4dc685269af1';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən maraqların toqquşması (maraqlar münaqişəsi) yarandıqda dövlət qulluqçusu nə etməlidir?',
    options = '["Dərhal bu barədə birbaşa rəhbərinə məlumat verməli və həmin məsələnin həllindən kənarlaşmalıdır", "Maraqlar münaqişəsini gizlədərək yaxın qohumunun xeyrinə gizli sənəd imzalamalıdır", "Yaranmış maraqları vəziyyətdən asılı olaraq başqalarından gizlədib qərarı təkbaşına qəbul etməlidir", "Dövlət qulluğunda xidməti fəaliyyətini dərhal dayandırıb ölkə xaricinə getməlidir"]'::jsonb,
    correct_answer = 'Dərhal bu barədə birbaşa rəhbərinə məlumat verməli və həmin məsələnin həllindən kənarlaşmalıdır',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun maraqlar münaqişəsinin tənzimlənməsinə dair müddəalarına əsasən, dövlət qulluqçusunun xidməti vəzifələrini yerinə yetirərkən onun şəxsi maraqları ilə dövlət orqanının qanuni maraqları arasında ziddiyyət yarandıqda (və ya yaranması ehtimalı olduqda), o, dərhal bu barədə birbaşa rəhbərinə yazılı məlumat verməli və həmin məsələnin həllindən (qərar qəbul edilməsindən) kənarlaşmalıdır. Bu tələb korrupsiyanın qarşısının alınması və qəbul edilən qərarların obyektivliyinin təmin olunması üçün əsas mexanizmdir. Digər variantlar isə qanunvericiliyin kobud şəkildə pozulması deməkdir.',
    hint = 'Dövlət qulluqçusunun şəxsi maraqları ilə xidməti səlahiyyətləri arasında ziddiyyət yarandığı hallarda, qanunvericilik şəffaflığın qorunması və qərəzsizliyin təmin edilməsi üçün dərhal rəhbərliyə məlumat verilməsini və həmin məsələnin həllindən kənarlaşmağı tələb edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '53bf058e-94d9-41ac-8db7-4dc685269af1');

-- Order 22: ID 0dc2f7e9-53de-47c2-b804-60d304c674db
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən vicdanlı davranış prinsipi nədir?',
    options = '["Hər gün rəhbərliyə görülən işlər barədə ətraflı yazılı hesabat təqdim etməsi", "Dövlət qulluqçusunun cəmiyyət və dövlət qarşısında məsuliyyətini dərk edərək vəzifələrini səmərəli və keyfiyyətlə yerinə yetirməsi", "Şəxsi məsuliyyətdən yayınaraq xidməti fəaliyyət zamanı heç bir müstəqil qərar qəbul etməməsi", "Yalnız rəsmi iş vaxtı bitənədək fiziki olaraq ofisdə oturması və kənar tapşırıqlara qarşı passiv olması"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun cəmiyyət və dövlət qarşısında məsuliyyətini dərk edərək vəzifələrini səmərəli və keyfiyyətlə yerinə yetirməsi',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, vicdanlı davranış prinsipi dövlət qulluqçusundan cəmiyyət və dövlət qarşısında öz məsuliyyətini dərk etməyi, dürüst və peşəkar olmağı, habelə xidməti vəzifələrini hər zaman səmərəli və keyfiyyətlə yerinə yetirməyi tələb edir. Bu prinsip dövlət qulluqçusunun işinə vicdanla, məsuliyyətlə yanaşmasını və dövlət maraqlarını hər şeydən üstün tutmasını təmin edən təməl etik normalardan biridir.',
    hint = 'Dövlət qulluqçusunun xidməti fəaliyyətində dürüstlüyü, məsuliyyətliliyi və vəzifələrini ən yüksək peşəkarlıqla, vicdanla yerinə yetirməsini tələb edən əsas etik prinsipdir.'
WHERE id = '0dc2f7e9-53de-47c2-b804-60d304c674db';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən vicdanlı davranış prinsipi nədir?',
    options = '["Hər gün rəhbərliyə görülən işlər barədə ətraflı yazılı hesabat təqdim etməsi", "Dövlət qulluqçusunun cəmiyyət və dövlət qarşısında məsuliyyətini dərk edərək vəzifələrini səmərəli və keyfiyyətlə yerinə yetirməsi", "Şəxsi məsuliyyətdən yayınaraq xidməti fəaliyyət zamanı heç bir müstəqil qərar qəbul etməməsi", "Yalnız rəsmi iş vaxtı bitənədək fiziki olaraq ofisdə oturması və kənar tapşırıqlara qarşı passiv olması"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun cəmiyyət və dövlət qarşısında məsuliyyətini dərk edərək vəzifələrini səmərəli və keyfiyyətlə yerinə yetirməsi',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini tənzimləyən müvafiq maddəsinə əsasən, vicdanlı davranış prinsipi dövlət qulluqçusundan cəmiyyət və dövlət qarşısında öz məsuliyyətini dərk etməyi, dürüst və peşəkar olmağı, habelə xidməti vəzifələrini hər zaman səmərəli və keyfiyyətlə yerinə yetirməyi tələb edir. Bu prinsip dövlət qulluqçusunun işinə vicdanla, məsuliyyətlə yanaşmasını və dövlət maraqlarını hər şeydən üstün tutmasını təmin edən təməl etik normalardan biridir.',
    hint = 'Dövlət qulluqçusunun xidməti fəaliyyətində dürüstlüyü, məsuliyyətliliyi və vəzifələrini ən yüksək peşəkarlıqla, vicdanla yerinə yetirməsini tələb edən əsas etik prinsipdir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '0dc2f7e9-53de-47c2-b804-60d304c674db');

-- Order 23: ID 091e7336-9620-45c0-ad7c-7b37c31b6c23
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən peşəkarlıq və fərdi məsuliyyət prinsipi nəyi tələb edir?',
    options = '["Yalnız mövcud təlimatlardan və qanunvericilikdən kənar sərbəst fəaliyyət göstərməyi", "Xidməti fəaliyyətdə yol verilən bütün səhvləri və nöqsanları tabelikdə olan başqa şəxslərin üzərinə atmağı", "Öz peşəkar bilik və bacarıqlarını daim artırmağı, xidməti vəzifələrin keyfiyyətli icrasına və qəbul edilən qərarlara görə fərdi məsuliyyət daşımağı", "Məsuliyyətdən yayınmaq məqsədilə xidməti fəaliyyəti zamanı heç bir rəsmi sənəd imzalamamağı"]'::jsonb,
    correct_answer = 'Öz peşəkar bilik və bacarıqlarını daim artırmağı, xidməti vəzifələrin keyfiyyətli icrasına və qəbul edilən qərarlara görə fərdi məsuliyyət daşımağı',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini müəyyən edən müvafiq maddəsinə əsasən, peşəkarlıq və fərdi məsuliyyət prinsipi dövlət qulluqçusundan öz peşəkar bilik və təcrübəsini daim artırmağı, xidməti vəzifələrini yüksək keyfiyyətlə yerinə yetirməyi, habelə qəbul etdiyi qərarların və həyata keçirdiyi hərəkətlərin nəticələrinə görə fərdi məsuliyyət daşımağı tələb edir. Bu prinsip dövlət qulluğunda səmərəliliyin, işgüzarlığın və məsuliyyət hissinin təmin edilməsində əsas təməl şərtlərdən biridir.',
    hint = 'Dövlət qulluqçusu öz işində peşəkar səviyyəni qoruyub saxlamaq üçün ixtisasını mütəmadi artırmalı və qəbul etdiyi qərarlara, icra etdiyi vəzifələrə görə şəxsən məsuliyyət daşımalıdır.'
WHERE id = '091e7336-9620-45c0-ad7c-7b37c31b6c23';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən peşəkarlıq və fərdi məsuliyyət prinsipi nəyi tələb edir?',
    options = '["Yalnız mövcud təlimatlardan və qanunvericilikdən kənar sərbəst fəaliyyət göstərməyi", "Xidməti fəaliyyətdə yol verilən bütün səhvləri və nöqsanları tabelikdə olan başqa şəxslərin üzərinə atmağı", "Öz peşəkar bilik və bacarıqlarını daim artırmağı, xidməti vəzifələrin keyfiyyətli icrasına və qəbul edilən qərarlara görə fərdi məsuliyyət daşımağı", "Məsuliyyətdən yayınmaq məqsədilə xidməti fəaliyyəti zamanı heç bir rəsmi sənəd imzalamamağı"]'::jsonb,
    correct_answer = 'Öz peşəkar bilik və bacarıqlarını daim artırmağı, xidməti vəzifələrin keyfiyyətli icrasına və qəbul edilən qərarlara görə fərdi məsuliyyət daşımağı',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini müəyyən edən müvafiq maddəsinə əsasən, peşəkarlıq və fərdi məsuliyyət prinsipi dövlət qulluqçusundan öz peşəkar bilik və təcrübəsini daim artırmağı, xidməti vəzifələrini yüksək keyfiyyətlə yerinə yetirməyi, habelə qəbul etdiyi qərarların və həyata keçirdiyi hərəkətlərin nəticələrinə görə fərdi məsuliyyət daşımağı tələb edir. Bu prinsip dövlət qulluğunda səmərəliliyin, işgüzarlığın və məsuliyyət hissinin təmin edilməsində əsas təməl şərtlərdən biridir.',
    hint = 'Dövlət qulluqçusu öz işində peşəkar səviyyəni qoruyub saxlamaq üçün ixtisasını mütəmadi artırmalı və qəbul etdiyi qərarlara, icra etdiyi vəzifələrə görə şəxsən məsuliyyət daşımalıdır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '091e7336-9620-45c0-ad7c-7b37c31b6c23');

-- Order 24: ID 012afcd7-c3b7-46b1-b45c-1fb46ebefc2c
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanununa əsasən, dövlət qulluqçusunun xidmətdən kənar davranışı necə tənzimlənir?',
    options = '["Yalnız xidməti vəzifə səlahiyyətlərini həyata keçirdiyi iş saatlarında etik normalara riayət etməyə borcludur", "Xidmətdən kənar vaxtlarda törədilən hüquqazidd hərəkətlərə görə dövlət orqanı qarşısında heç bir intizam məsuliyyəti daşımır", "Şəxsi həyat toxunulmazlığı prinsipinə əsasən, xidmətdən kənar davranışı dövlət qulluqçusu statusuna heç bir təsir göstərmir", "Cəmiyyətdə qəbul olunmuş ümumi əxlaq və milli mənəvi dəyərlərə riayət etməli, dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməlidir"]'::jsonb,
    correct_answer = 'Cəmiyyətdə qəbul olunmuş ümumi əxlaq və milli mənəvi dəyərlərə riayət etməli, dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanunu Maddə 7.2 — Qanunun 7.2-ci maddəsinə əsasən, dövlət qulluqçusu xidmətdən kənar vaxtlarda da dövlət orqanının və dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməli, cəmiyyətdə qəbul olunmuş yüksək əxlaq normalarına və ictimai asayiş qaydalarına ciddi riayət etməlidir.',
    hint = 'Dövlət qulluqçusu xidmətdən kənar vaxtda da dövlət orqanının nüfuzuna xələl gətirəcək hərəkətlərdən çəkinməlidir.'
WHERE id = '012afcd7-c3b7-46b1-b45c-1fb46ebefc2c';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanununa əsasən, dövlət qulluqçusunun xidmətdən kənar davranışı necə tənzimlənir?',
    options = '["Yalnız xidməti vəzifə səlahiyyətlərini həyata keçirdiyi iş saatlarında etik normalara riayət etməyə borcludur", "Xidmətdən kənar vaxtlarda törədilən hüquqazidd hərəkətlərə görə dövlət orqanı qarşısında heç bir intizam məsuliyyəti daşımır", "Şəxsi həyat toxunulmazlığı prinsipinə əsasən, xidmətdən kənar davranışı dövlət qulluqçusu statusuna heç bir təsir göstərmir", "Cəmiyyətdə qəbul olunmuş ümumi əxlaq və milli mənəvi dəyərlərə riayət etməli, dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməlidir"]'::jsonb,
    correct_answer = 'Cəmiyyətdə qəbul olunmuş ümumi əxlaq və milli mənəvi dəyərlərə riayət etməli, dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməlidir',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” AR Qanunu Maddə 7.2 — Qanunun 7.2-ci maddəsinə əsasən, dövlət qulluqçusu xidmətdən kənar vaxtlarda da dövlət orqanının və dövlət qulluğunun nüfuzuna xələl gətirə biləcək hərəkətlərdən çəkinməli, cəmiyyətdə qəbul olunmuş yüksək əxlaq normalarına və ictimai asayiş qaydalarına ciddi riayət etməlidir.',
    hint = 'Dövlət qulluqçusu xidmətdən kənar vaxtda da dövlət orqanının nüfuzuna xələl gətirəcək hərəkətlərdən çəkinməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '012afcd7-c3b7-46b1-b45c-1fb46ebefc2c');

-- Order 25: ID 1678ec60-8f4b-441c-8600-3e914ec3285b
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən maraqların toqquşmasının qarşısının alınması əsasən nəyi tələb edir?',
    options = '["Şəxsi biznesini və ya kommersiya fəaliyyətini birbaşa dövlət qulluğunda inkişaf etdirməsini", "Dövlət qulluqçusunun xidməti vəzifələri ilə şəxsi maraqları arasında ziddiyyətə yol verməməsini", "Xidməti vəzifələrini icra edərkən yalnız yaxın qohumlarının və tanışlarının mənafelərini güdməsini", "Maraqlar toqquşması baş verdikdə dövlət maraqlarını qurban verərək şəxsi maraqlara üstünlük verməsini"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun xidməti vəzifələri ilə şəxsi maraqları arasında ziddiyyətə yol verməməsini',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun maraqlar münaqişəsinin tənzimlənməsi və qarşısının alınması tələblərinə əsasən, dövlət qulluqçusu xidməti vəzifələrini yerinə yetirərkən özünün şəxsi maraqları ilə dövlət orqanının qanuni maraqları arasında ziddiyyətə yol verməməlidir. Maraqların toqquşması (münaqişəsi) ehtimalı yarandığı hallarda qulluqçu dərhal qanunvericiliyə uyğun addımlar atmalı, rəhbərliyə məlumat verməli və qərəzsizliyi təmin etməlidir. Digər variantlar isə korrupsiya hüquqpozmalarına yol açan və etik normaları kobud şəkildə pozan hallardır.',
    hint = 'Dövlət qulluqçusunun xidməti səlahiyyətləri ilə şəxsi maraqları arasında hər hansı ziddiyyətin yaranmasına yol verilməməsi, maraqlar münaqişəsi yarandıqda isə qanunvericiliyə uyğun olaraq dərhal tədbir görülməsi vacibdir.'
WHERE id = '1678ec60-8f4b-441c-8600-3e914ec3285b';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən maraqların toqquşmasının qarşısının alınması əsasən nəyi tələb edir?',
    options = '["Şəxsi biznesini və ya kommersiya fəaliyyətini birbaşa dövlət qulluğunda inkişaf etdirməsini", "Dövlət qulluqçusunun xidməti vəzifələri ilə şəxsi maraqları arasında ziddiyyətə yol verməməsini", "Xidməti vəzifələrini icra edərkən yalnız yaxın qohumlarının və tanışlarının mənafelərini güdməsini", "Maraqlar toqquşması baş verdikdə dövlət maraqlarını qurban verərək şəxsi maraqlara üstünlük verməsini"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusunun xidməti vəzifələri ilə şəxsi maraqları arasında ziddiyyətə yol verməməsini',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun maraqlar münaqişəsinin tənzimlənməsi və qarşısının alınması tələblərinə əsasən, dövlət qulluqçusu xidməti vəzifələrini yerinə yetirərkən özünün şəxsi maraqları ilə dövlət orqanının qanuni maraqları arasında ziddiyyətə yol verməməlidir. Maraqların toqquşması (münaqişəsi) ehtimalı yarandığı hallarda qulluqçu dərhal qanunvericiliyə uyğun addımlar atmalı, rəhbərliyə məlumat verməli və qərəzsizliyi təmin etməlidir. Digər variantlar isə korrupsiya hüquqpozmalarına yol açan və etik normaları kobud şəkildə pozan hallardır.',
    hint = 'Dövlət qulluqçusunun xidməti səlahiyyətləri ilə şəxsi maraqları arasında hər hansı ziddiyyətin yaranmasına yol verilməməsi, maraqlar münaqişəsi yarandıqda isə qanunvericiliyə uyğun olaraq dərhal tədbir görülməsi vacibdir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '1678ec60-8f4b-441c-8600-3e914ec3285b');

-- Order 26: ID 23ed37fe-3287-4875-a47b-8b32e8013731
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən dövlət qulluqçuları tərəfindən etik davranış qaydalarına əməl olunmasına nəzarət kim tərəfindən həyata keçirilir?',
    options = '["Yerli bələdiyyə qurumları və ictimai birliklər", "Yalnız yerli icra hakimiyyəti başçısının aparatının kadrlar şöbəsi", "Dövlət orqanının rəhbəri və həmin orqanda təsis edilmiş etik müvəkkil", "Azərbaycan Respublikasının Mərkəzi Seçki Komissiyası"]'::jsonb,
    correct_answer = 'Dövlət orqanının rəhbəri və həmin orqanda təsis edilmiş etik müvəkkil',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun nəzarət mexanizmlərini tənzimləyən müvafiq maddələrinə əsasən, dövlət qulluqçularının etik davranış qaydalarına əməl olunmasına nəzarət dövlət orqanının rəhbəri (xidməti qaydada, yuxarı orqan tabeçilik əsasında) və həmin orqanda etik qaydalara riayət olunmasına, maraqlar münaqişəsinin tənzimlənməsinə məsul olan etik müvəkkil tərəfindən həyata keçirilir. Bələdiyyələr, seçki komissiyaları və ya kənar təşkilatlar dövlət qulluqçularının xidməti fəaliyyətinə və etik davranışına nəzarət etmək səlahiyyətinə malik deyillər.',
    hint = 'Dövlət orqanlarında etik standartların qorunmasına və tətbiqinə nəzarət mexanizmləri həm daxili idarəetmə xətti ilə, həm də həmin qurumda təsis edilmiş xüsusi səlahiyyətli şəxs vasitəsilə həyata keçirilir.'
WHERE id = '23ed37fe-3287-4875-a47b-8b32e8013731';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən dövlət qulluqçuları tərəfindən etik davranış qaydalarına əməl olunmasına nəzarət kim tərəfindən həyata keçirilir?',
    options = '["Yerli bələdiyyə qurumları və ictimai birliklər", "Yalnız yerli icra hakimiyyəti başçısının aparatının kadrlar şöbəsi", "Dövlət orqanının rəhbəri və həmin orqanda təsis edilmiş etik müvəkkil", "Azərbaycan Respublikasının Mərkəzi Seçki Komissiyası"]'::jsonb,
    correct_answer = 'Dövlət orqanının rəhbəri və həmin orqanda təsis edilmiş etik müvəkkil',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun nəzarət mexanizmlərini tənzimləyən müvafiq maddələrinə əsasən, dövlət qulluqçularının etik davranış qaydalarına əməl olunmasına nəzarət dövlət orqanının rəhbəri (xidməti qaydada, yuxarı orqan tabeçilik əsasında) və həmin orqanda etik qaydalara riayət olunmasına, maraqlar münaqişəsinin tənzimlənməsinə məsul olan etik müvəkkil tərəfindən həyata keçirilir. Bələdiyyələr, seçki komissiyaları və ya kənar təşkilatlar dövlət qulluqçularının xidməti fəaliyyətinə və etik davranışına nəzarət etmək səlahiyyətinə malik deyillər.',
    hint = 'Dövlət orqanlarında etik standartların qorunmasına və tətbiqinə nəzarət mexanizmləri həm daxili idarəetmə xətti ilə, həm də həmin qurumda təsis edilmiş xüsusi səlahiyyətli şəxs vasitəsilə həyata keçirilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '23ed37fe-3287-4875-a47b-8b32e8013731');

-- Order 27: ID bf486fe2-fcfc-4302-be26-18326d1b62c6
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və maliyyə məhdudiyyətlərinə əsasən dövlət qulluqçusunun borc və ya kredit münasibətlərində hansı hərəkəti etməsi qadağandır?',
    options = '["Azərbaycan Respublikasının İpoteka və Kredit Zəmanət Fondunun xətti ilə rəsmi güzəştli ipoteka kreditinə müraciət etməyə", "Lisenziyalaşdırılmış bank qurumlarından qanunvericiliyə uyğun olaraq rəsmi kredit xətti açmağa", "Şəxsi əmək haqqı kartından gündəlik xərclər və nağdsız ödənişlər üçün sərbəst istifadə etməyə", "Xidməti asılılığında olan şəxslərdən, tabelikdə olan işçilərdən və ya xidmət göstərdiyi (müraciət edən) vətəndaşlardan borc almağa"]'::jsonb,
    correct_answer = 'Xidməti asılılığında olan şəxslərdən, tabelikdə olan işçilərdən və ya xidmət göstərdiyi (müraciət edən) vətəndaşlardan borc almağa',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və antikorrupsiya qanunvericiliyinin tələblərinə əsasən, dövlət qulluqçusuna xidməti asılılığında olan şəxslərdən, tabeliyindəki işçilərdən, habelə xidmət göstərdiyi və ya nəzarət etdiyi şəxslərdən borc (kredit) almaq qəti şəkildə qadağandır. Bu məhdudiyyət maraqlar münaqişəsinin yaranmasının, xidməti səlahiyyətlərdən şəxsi məqsədlər üçün sui-istifadə hallarının və qərəzsizliyin pozulmasının qarşısını almaq məqsədi daşıyır. Banklardan rəsmi kredit götürmək, dövlət ipotekasından yararlanmaq və ya əməkhaqqı kartından istifadə etmək isə qanuni maliyyə əməliyyatları olub qadağan edilmir.',
    hint = 'Dövlət qulluqçusunun maliyyə və borc münasibətləri maraqlar münaqişəsinə səbəb olmamalı, xidməti asılılıqda olan şəxslərlə və ya müraciət edən vətəndaşlarla bu cür münasibətlərdən qəti şəkildə çəkinilməlidir.'
WHERE id = 'bf486fe2-fcfc-4302-be26-18326d1b62c6';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və maliyyə məhdudiyyətlərinə əsasən dövlət qulluqçusunun borc və ya kredit münasibətlərində hansı hərəkəti etməsi qadağandır?',
    options = '["Azərbaycan Respublikasının İpoteka və Kredit Zəmanət Fondunun xətti ilə rəsmi güzəştli ipoteka kreditinə müraciət etməyə", "Lisenziyalaşdırılmış bank qurumlarından qanunvericiliyə uyğun olaraq rəsmi kredit xətti açmağa", "Şəxsi əmək haqqı kartından gündəlik xərclər və nağdsız ödənişlər üçün sərbəst istifadə etməyə", "Xidməti asılılığında olan şəxslərdən, tabelikdə olan işçilərdən və ya xidmət göstərdiyi (müraciət edən) vətəndaşlardan borc almağa"]'::jsonb,
    correct_answer = 'Xidməti asılılığında olan şəxslərdən, tabelikdə olan işçilərdən və ya xidmət göstərdiyi (müraciət edən) vətəndaşlardan borc almağa',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və antikorrupsiya qanunvericiliyinin tələblərinə əsasən, dövlət qulluqçusuna xidməti asılılığında olan şəxslərdən, tabeliyindəki işçilərdən, habelə xidmət göstərdiyi və ya nəzarət etdiyi şəxslərdən borc (kredit) almaq qəti şəkildə qadağandır. Bu məhdudiyyət maraqlar münaqişəsinin yaranmasının, xidməti səlahiyyətlərdən şəxsi məqsədlər üçün sui-istifadə hallarının və qərəzsizliyin pozulmasının qarşısını almaq məqsədi daşıyır. Banklardan rəsmi kredit götürmək, dövlət ipotekasından yararlanmaq və ya əməkhaqqı kartından istifadə etmək isə qanuni maliyyə əməliyyatları olub qadağan edilmir.',
    hint = 'Dövlət qulluqçusunun maliyyə və borc münasibətləri maraqlar münaqişəsinə səbəb olmamalı, xidməti asılılıqda olan şəxslərlə və ya müraciət edən vətəndaşlarla bu cür münasibətlərdən qəti şəkildə çəkinilməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'bf486fe2-fcfc-4302-be26-18326d1b62c6');

-- Order 28: ID 6ee9810a-ced3-434e-826a-66a509458f45
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən dövlət qulluqçusu qərəzsizlik prinsipini necə təmin edir?',
    options = '["Yalnız özü ilə eyni dinə və ya etnik mənsubiyyətə malik şəxslərin işini növbədənkənar həll edir", "Qərarlarını qəbul edərkən vətəndaşların irqinə, milliyyətinə, dininə, dilinə, cinsinə, mənşəyinə, əqidəsinə və sosial statusuna görə heç bir fərq qoymur (ayrı-seçkiliyə yol vermir)", "Xidməti fəaliyyət zamanı yalnız müəyyən kateqoriyadan olan şəxslərə prioritet qaydada üstünlük verir", "Yalnız maddi imkanı yüksək olan və ya varlı vətəndaşların fərdi müraciətlərini yerinə yetirir"]'::jsonb,
    correct_answer = 'Qərarlarını qəbul edərkən vətəndaşların irqinə, milliyyətinə, dininə, dilinə, cinsinə, mənşəyinə, əqidəsinə və sosial statusuna görə heç bir fərq qoymur (ayrı-seçkiliyə yol vermir)',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini müəyyən edən müvafiq maddəsinə əsasən, qərəzsizlik prinsipi dövlət qulluqçusundan xidməti vəzifələrini yerinə yetirərkən irqindən, milliyyətindən, dinindən, dilindən, cinsindən, mənşəyindən, əqidəsindən, siyasi və ictimai birliklərə mənsubiyyətindən asılı olmayaraq bütün şəxslərə bərabər münasibət göstərməyi və heç bir ayrı-seçkiliyə yol verməməyi tələb edir. Dövlət qulluqçusu öz fəaliyyətində hər zaman obyektiv olmalı və qərarlarını yalnız qanunvericiliyin tələblərinə əsaslanaraq qəbul etməlidir. Digər variantlar isə qanunvericiliyin kobud şəkildə pozulması deməkdir.',
    hint = 'Dövlət qulluğunda qərəzsizlik prinsipi vətəndaşlar arasında heç bir ayrı-seçkiliyə yol verilməməsini, bütün şəxslərə bərabər və obyektiv münasibət göstərilməsini tələb edir.'
WHERE id = '6ee9810a-ced3-434e-826a-66a509458f45';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən dövlət qulluqçusu qərəzsizlik prinsipini necə təmin edir?',
    options = '["Yalnız özü ilə eyni dinə və ya etnik mənsubiyyətə malik şəxslərin işini növbədənkənar həll edir", "Qərarlarını qəbul edərkən vətəndaşların irqinə, milliyyətinə, dininə, dilinə, cinsinə, mənşəyinə, əqidəsinə və sosial statusuna görə heç bir fərq qoymur (ayrı-seçkiliyə yol vermir)", "Xidməti fəaliyyət zamanı yalnız müəyyən kateqoriyadan olan şəxslərə prioritet qaydada üstünlük verir", "Yalnız maddi imkanı yüksək olan və ya varlı vətəndaşların fərdi müraciətlərini yerinə yetirir"]'::jsonb,
    correct_answer = 'Qərarlarını qəbul edərkən vətəndaşların irqinə, milliyyətinə, dininə, dilinə, cinsinə, mənşəyinə, əqidəsinə və sosial statusuna görə heç bir fərq qoymur (ayrı-seçkiliyə yol vermir)',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun prinsiplərini müəyyən edən müvafiq maddəsinə əsasən, qərəzsizlik prinsipi dövlət qulluqçusundan xidməti vəzifələrini yerinə yetirərkən irqindən, milliyyətindən, dinindən, dilindən, cinsindən, mənşəyindən, əqidəsindən, siyasi və ictimai birliklərə mənsubiyyətindən asılı olmayaraq bütün şəxslərə bərabər münasibət göstərməyi və heç bir ayrı-seçkiliyə yol verməməyi tələb edir. Dövlət qulluqçusu öz fəaliyyətində hər zaman obyektiv olmalı və qərarlarını yalnız qanunvericiliyin tələblərinə əsaslanaraq qəbul etməlidir. Digər variantlar isə qanunvericiliyin kobud şəkildə pozulması deməkdir.',
    hint = 'Dövlət qulluğunda qərəzsizlik prinsipi vətəndaşlar arasında heç bir ayrı-seçkiliyə yol verilməməsini, bütün şəxslərə bərabər və obyektiv münasibət göstərilməsini tələb edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '6ee9810a-ced3-434e-826a-66a509458f45');

-- Order 29: ID f5999fb8-2296-4c70-a544-4ae76262f516
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və qanunvericiliyə əsasən dövlət orqanının rəhbəri etik qaydaların pozulmasına görə hansı tədbirləri görə bilər?',
    options = '["Etik qaydalar pozulduqda dövlət orqanının rəhbəri heç bir tədbir görə bilməz, çünki bu qaydalar yalnız tövsiyə xarakteri daşıyır", "Dövlət qulluqçusuna qarşı qanunvericiliklə müəyyən edilmiş qaydada intizam tənbehi tətbiq edə və ya hüquqpozmanın xarakterindən asılı olaraq materialları hüquq-mühafizə orqanlarına göndərə bilər", "Dövlət qulluqçusunun şəxsi əmlakını və mənzilini birbaşa müsadirə edərək dövlət xeyrinə keçirə bilər", "Məhkəmə qərarı tələb olunmadan dövlət qulluqçusunu dərhal həbs edib istintaq təcridxanasına göndərə bilər"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusuna qarşı qanunvericiliklə müəyyən edilmiş qaydada intizam tənbehi tətbiq edə və ya hüquqpozmanın xarakterindən asılı olaraq materialları hüquq-mühafizə orqanlarına göndərə bilər',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və “Dövlət qulluğu haqqında” Qanunun tələblərinə əsasən, dövlət qulluqçuları tərəfindən etik davranış qaydalarının pozulması onları qanunvericiliklə müəyyən edilmiş intizam məsuliyyətinə cəlb edir. Buna görə də dövlət orqanının rəhbəri etik qaydaları pozmuş qulluqçuya qarşı qanuni intizam tənbehi tədbirləri tətbiq etmək, əgər törədilmiş əməldə qanun pozuntusu və ya korrupsiya əlamətləri mövcuddursa, toplanmış materialları hüquq-mühafizə orqanlarına göndərmək səlahiyyətinə malikdir. Mülkiyyətin müsadirəsi, cərimələrin tətbiqi və ya fiziki azadlıqdan məhrumetmə (həbs) səlahiyyətləri isə yalnız səlahiyyətli məhkəmə instansiyalarının müstəsna səlahiyyətinə aiddir.',
    hint = 'Etik davranış qaydalarının pozulması dövlət qulluqçularının məsuliyyətə cəlb edilməsinə səbəb olur. Qanunvericiliyə əsasən, rəhbərlik pozuntunun xarakterindən asılı olaraq intizam tənbehi tətbiq edə və ya əməldə hüquqazidd əlamətlər olduqda materialları aidiyyəti orqanlara göndərə bilər.'
WHERE id = 'f5999fb8-2296-4c70-a544-4ae76262f516';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa və qanunvericiliyə əsasən dövlət orqanının rəhbəri etik qaydaların pozulmasına görə hansı tədbirləri görə bilər?',
    options = '["Etik qaydalar pozulduqda dövlət orqanının rəhbəri heç bir tədbir görə bilməz, çünki bu qaydalar yalnız tövsiyə xarakteri daşıyır", "Dövlət qulluqçusuna qarşı qanunvericiliklə müəyyən edilmiş qaydada intizam tənbehi tətbiq edə və ya hüquqpozmanın xarakterindən asılı olaraq materialları hüquq-mühafizə orqanlarına göndərə bilər", "Dövlət qulluqçusunun şəxsi əmlakını və mənzilini birbaşa müsadirə edərək dövlət xeyrinə keçirə bilər", "Məhkəmə qərarı tələb olunmadan dövlət qulluqçusunu dərhal həbs edib istintaq təcridxanasına göndərə bilər"]'::jsonb,
    correct_answer = 'Dövlət qulluqçusuna qarşı qanunvericiliklə müəyyən edilmiş qaydada intizam tənbehi tətbiq edə və ya hüquqpozmanın xarakterindən asılı olaraq materialları hüquq-mühafizə orqanlarına göndərə bilər',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və “Dövlət qulluğu haqqında” Qanunun tələblərinə əsasən, dövlət qulluqçuları tərəfindən etik davranış qaydalarının pozulması onları qanunvericiliklə müəyyən edilmiş intizam məsuliyyətinə cəlb edir. Buna görə də dövlət orqanının rəhbəri etik qaydaları pozmuş qulluqçuya qarşı qanuni intizam tənbehi tədbirləri tətbiq etmək, əgər törədilmiş əməldə qanun pozuntusu və ya korrupsiya əlamətləri mövcuddursa, toplanmış materialları hüquq-mühafizə orqanlarına göndərmək səlahiyyətinə malikdir. Mülkiyyətin müsadirəsi, cərimələrin tətbiqi və ya fiziki azadlıqdan məhrumetmə (həbs) səlahiyyətləri isə yalnız səlahiyyətli məhkəmə instansiyalarının müstəsna səlahiyyətinə aiddir.',
    hint = 'Etik davranış qaydalarının pozulması dövlət qulluqçularının məsuliyyətə cəlb edilməsinə səbəb olur. Qanunvericiliyə əsasən, rəhbərlik pozuntunun xarakterindən asılı olaraq intizam tənbehi tətbiq edə və ya əməldə hüquqazidd əlamətlər olduqda materialları aidiyyəti orqanlara göndərə bilər.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'f5999fb8-2296-4c70-a544-4ae76262f516');

-- Order 30: ID 765d247d-6eef-495c-87c3-b9c26915137b
UPDATE questions SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən etik davranış qaydalarının pozulması dövlət qulluqçusu üçün hansı növ məsuliyyətə səbəb olur?',
    options = '["Yalnız dövlət qulluqçusunun vəzifə maaşının avtomatik ikiqat artırılmasına", "Qanunvericiliklə müəyyən edilmiş qaydada intizam məsuliyyətinə (intizam tənbehi tədbirlərinin tətbiqinə)", "Yalnız gündəlik xidməti iş vaxtının məcburi qaydada əlavə saatlarla artırılmasına", "Heç bir hüquqi və ya inzibati məsuliyyət yaratmır, çünki etik qaydalar yalnız tövsiyə xarakteri daşıyır"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada intizam məsuliyyətinə (intizam tənbehi tədbirlərinin tətbiqinə)',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və “Dövlət qulluğu haqqında” Qanunun müvafiq maddələrinə əsasən, dövlət qulluqçuları tərəfindən etik davranış qaydalarının pozulması onları qanunvericiliklə müəyyən edilmiş intizam məsuliyyətinə cəlb edir. Etik qaydaların pozulmasının xarakterindən və ağırlıq dərəcəsindən asılı olaraq dövlət orqanının rəhbəri tərəfindən qulluqçuya qarşı müvafiq intizam tənbehi tədbirləri tətbiq oluna bilər. Digər variantlar isə qanunvericiliyə tamamilə ziddir və heç bir hüquqi əsası yoxdur.',
    hint = 'Dövlət qulluqçularının xidməti fəaliyyətlərində etik standartlara riayət etməsi məcburidir və bu qaydaların pozulması qanunvericiliklə müəyyən edilmiş qaydada hüquqi məsuliyyət yaradır.'
WHERE id = '765d247d-6eef-495c-87c3-b9c26915137b';

UPDATE question_bank SET
    question_text = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununa əsasən etik davranış qaydalarının pozulması dövlət qulluqçusu üçün hansı növ məsuliyyətə səbəb olur?',
    options = '["Yalnız dövlət qulluqçusunun vəzifə maaşının avtomatik ikiqat artırılmasına", "Qanunvericiliklə müəyyən edilmiş qaydada intizam məsuliyyətinə (intizam tənbehi tədbirlərinin tətbiqinə)", "Yalnız gündəlik xidməti iş vaxtının məcburi qaydada əlavə saatlarla artırılmasına", "Heç bir hüquqi və ya inzibati məsuliyyət yaratmır, çünki etik qaydalar yalnız tövsiyə xarakteri daşıyır"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada intizam məsuliyyətinə (intizam tənbehi tədbirlərinin tətbiqinə)',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununun və “Dövlət qulluğu haqqında” Qanunun müvafiq maddələrinə əsasən, dövlət qulluqçuları tərəfindən etik davranış qaydalarının pozulması onları qanunvericiliklə müəyyən edilmiş intizam məsuliyyətinə cəlb edir. Etik qaydaların pozulmasının xarakterindən və ağırlıq dərəcəsindən asılı olaraq dövlət orqanının rəhbəri tərəfindən qulluqçuya qarşı müvafiq intizam tənbehi tədbirləri tətbiq oluna bilər. Digər variantlar isə qanunvericiliyə tamamilə ziddir və heç bir hüquqi əsası yoxdur.',
    hint = 'Dövlət qulluqçularının xidməti fəaliyyətlərində etik standartlara riayət etməsi məcburidir və bu qaydaların pozulması qanunvericiliklə müəyyən edilmiş qaydada hüquqi məsuliyyət yaradır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '765d247d-6eef-495c-87c3-b9c26915137b');

-- Order 31: ID 6900f421-89b2-4f96-aa98-bd6732a1c2fc
UPDATE questions SET
    question_text = 'Aşağıdakılardan hansı “Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununda və qanunvericilikdə nəzərdə tutulmuş etik davranış qaydası və ya prinsipi deyil?',
    options = '["Qərəzlilik", "Məlumatlardan istifadə", "Əmlakdan istifadə", "İctimai etimad"]'::jsonb,
    correct_answer = 'Qərəzlilik',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununda və müvafiq normativ sənədlərdə dövlət qulluqçularının fəaliyyətini tənzimləyən əsas prinsiplər və xüsusi qaydalar mövcuddur. Bunlara qərəzsizlik (obyektivlik), ictimai etimad, əmlakdan istifadə və məlumatlardan (xidməti informasiyadan) istifadə qaydaları daxildir. "Qərəzlilik" isə etik davranış qaydası deyil, əksinə, dövlət qulluqçusunun əməl etməli olduğu qərəzsizlik və obyektivlik prinsiplərinə tamamilə zidd olan neqativ haldır. Buna görə də belə bir etik davranış qaydası mövcud deyil.',
    hint = 'Qanunvericilikdə dövlət qulluqçuları üçün qərəzsizlik, ictimai etimad, əmlakdan və məlumatlardan istifadə qaydaları təsbit olunmuşdur. Lakin "qərəzlilik" etik davranış prinsipi və ya qaydası ola bilməz.'
WHERE id = '6900f421-89b2-4f96-aa98-bd6732a1c2fc';

UPDATE question_bank SET
    question_text = 'Aşağıdakılardan hansı “Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikasının Qanununda və qanunvericilikdə nəzərdə tutulmuş etik davranış qaydası və ya prinsipi deyil?',
    options = '["Qərəzlilik", "Məlumatlardan istifadə", "Əmlakdan istifadə", "İctimai etimad"]'::jsonb,
    correct_answer = 'Qərəzlilik',
    explanation = '“Dövlət qulluqçularının etik davranış qaydaları haqqında” Azərbaycan Respublikası Qanununda və müvafiq normativ sənədlərdə dövlət qulluqçularının fəaliyyətini tənzimləyən əsas prinsiplər və xüsusi qaydalar mövcuddur. Bunlara qərəzsizlik (obyektivlik), ictimai etimad, əmlakdan istifadə və məlumatlardan (xidməti informasiyadan) istifadə qaydaları daxildir. "Qərəzlilik" isə etik davranış qaydası deyil, əksinə, dövlət qulluqçusunun əməl etməli olduğu qərəzsizlik və obyektivlik prinsiplərinə tamamilə zidd olan neqativ haldır. Buna görə də belə bir etik davranış qaydası mövcud deyil.',
    hint = 'Qanunvericilikdə dövlət qulluqçuları üçün qərəzsizlik, ictimai etimad, əmlakdan və məlumatlardan istifadə qaydaları təsbit olunmuşdur. Lakin "qərəzlilik" etik davranış prinsipi və ya qaydası ola bilməz.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '6900f421-89b2-4f96-aa98-bd6732a1c2fc');

COMMIT;