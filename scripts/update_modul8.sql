-- Refinement of Modul 8: Vetendashlarin Muracietleri (38 Questions)
-- Atomic transaction updating both questions and question_bank tables
BEGIN;

-- Order 0: ID eadc03e6-694c-41e3-ba82-c34752692690
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” AR Qanununa əsasən, xüsusi hallar istisna olmaqla, vətəndaşların müraciətlərinə ən geci hansı müddətdə baxılmalıdır?',
    options = '["Ən geci 15 iş günü müddətində", "Ən geci 30 təqvim günü müddətində", "Ən geci 7 iş günü müddətində", "Ən geci 1 ay müddətində"]'::jsonb,
    correct_answer = 'Ən geci 15 iş günü müddətində',
    explanation = '“Vətəndaşların müraciətləri haqqında” AR Qanunu Maddə 10.1 — Qanunun 10.1-ci maddəsinə əsasən, xüsusi hallar istisna olmaqla, vətəndaşların müraciətlərinə ən geci 15 iş günü müddətində baxılır. Qanunvericilikdə nəzərdə tutulan baxılma müddəti təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.',
    hint = 'Vətəndaşların müraciətlərinə baxılma müddəti təqvim günləri ilə deyil, ən geci 15 iş günü ilə müəyyən edilir.'
WHERE id = 'eadc03e6-694c-41e3-ba82-c34752692690';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” AR Qanununa əsasən, xüsusi hallar istisna olmaqla, vətəndaşların müraciətlərinə ən geci hansı müddətdə baxılmalıdır?',
    options = '["Ən geci 15 iş günü müddətində", "Ən geci 30 təqvim günü müddətində", "Ən geci 7 iş günü müddətində", "Ən geci 1 ay müddətində"]'::jsonb,
    correct_answer = 'Ən geci 15 iş günü müddətində',
    explanation = '“Vətəndaşların müraciətləri haqqında” AR Qanunu Maddə 10.1 — Qanunun 10.1-ci maddəsinə əsasən, xüsusi hallar istisna olmaqla, vətəndaşların müraciətlərinə ən geci 15 iş günü müddətində baxılır. Qanunvericilikdə nəzərdə tutulan baxılma müddəti təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.',
    hint = 'Vətəndaşların müraciətlərinə baxılma müddəti təqvim günləri ilə deyil, ən geci 15 iş günü ilə müəyyən edilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'eadc03e6-694c-41e3-ba82-c34752692690');

-- Order 1: ID 93f0230a-52b6-4df3-bcb3-053731973f0f
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciətə baxılması və ya müraciət edilməsi ilə əlaqədar olaraq aşağıdakılardan hansı qanunsuzdur?',
    options = '["Vətəndaşların müəyyən edilmiş qəbul günləri və saatlarında fərdi qaydada qəbul edilməsi", "Müraciətin həlli səlahiyyəti daxil olmadığı hallarda aidiyyəti üzrə baxılmaq üçün göndərilməsi", "Vətəndaşın qaldırdığı məsələlər üzrə ona yazılı və əsaslandırılmış cavab təqdim olunması", "Müraciət etdiyinə və ya müraciətdə tənqidi fikirlər bildirdiyinə görө vətəndaşın və ya onun ailə üzvlərinin təqib edilməsi"]'::jsonb,
    correct_answer = 'Müraciət etdiyinə və ya müraciətdə tənqidi fikirlər bildirdiyinə görө vətəndaşın və ya onun ailə üzvlərinin təqib edilməsi',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun əsas prinsiplərinə və tələblərinə əsasən, vətəndaşların müraciət etmək hüququnun həyata keçirilməsinə mane olmaq, habelə müraciət etdiyinə və ya müraciətdə dövlət orqanlarının, eləcə də vəzifəli şəxslərin fəaliyyətini tənqid etdiyinə görə vətəndaşı və ya onun ailə üzvlərini təqib etmək qəti şəkildə qadağandır və qanunsuzdur.',
    hint = 'Qanunvericilik vətəndaşların sərbəst şəkildə müraciət etmək hüququnu təmin edir və bu hüququn həyata keçirilməsinə görə hər hansı təzyiqə, məhdudiyyətə və ya təqibə yol verilməsini qəti şəkildə qadağan edir.'
WHERE id = '93f0230a-52b6-4df3-bcb3-053731973f0f';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciətə baxılması və ya müraciət edilməsi ilə əlaqədar olaraq aşağıdakılardan hansı qanunsuzdur?',
    options = '["Vətəndaşların müəyyən edilmiş qəbul günləri və saatlarında fərdi qaydada qəbul edilməsi", "Müraciətin həlli səlahiyyəti daxil olmadığı hallarda aidiyyəti üzrə baxılmaq üçün göndərilməsi", "Vətəndaşın qaldırdığı məsələlər üzrə ona yazılı və əsaslandırılmış cavab təqdim olunması", "Müraciət etdiyinə və ya müraciətdə tənqidi fikirlər bildirdiyinə görө vətəndaşın və ya onun ailə üzvlərinin təqib edilməsi"]'::jsonb,
    correct_answer = 'Müraciət etdiyinə və ya müraciətdə tənqidi fikirlər bildirdiyinə görө vətəndaşın və ya onun ailə üzvlərinin təqib edilməsi',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun əsas prinsiplərinə və tələblərinə əsasən, vətəndaşların müraciət etmək hüququnun həyata keçirilməsinə mane olmaq, habelə müraciət etdiyinə və ya müraciətdə dövlət orqanlarının, eləcə də vəzifəli şəxslərin fəaliyyətini tənqid etdiyinə görə vətəndaşı və ya onun ailə üzvlərini təqib etmək qəti şəkildə qadağandır və qanunsuzdur.',
    hint = 'Qanunvericilik vətəndaşların sərbəst şəkildə müraciət etmək hüququnu təmin edir və bu hüququn həyata keçirilməsinə görə hər hansı təzyiqə, məhdudiyyətə və ya təqibə yol verilməsini qəti şəkildə qadağan edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '93f0230a-52b6-4df3-bcb3-053731973f0f');

-- Order 2: ID 1e8ed458-b13c-4005-bc81-a771d03754b0
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanuna əsasən, əlavə öyrənilmə və yoxlanılma tələb edən müraciətlərə hansı müddətdə baxılır?',
    options = '["Ən geci 30 təqvim günü müddətində", "Ən geci 15 iş günü müddətində", "Ən geci 45 təqvim günü müddətində", "Ən geci 30 iş günü müddətində"]'::jsonb,
    correct_answer = 'Ən geci 30 iş günü müddətində',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun 10.1-ci maddəsinə əsasən, ümumi müraciətlərə ən geci 15 iş günü, əlavə öyrənilmə və yoxlanılma tələb edən müraciətlərə isə ən geci 30 iş günü müddətində baxılır. Qanunvericilikdə müddətlər təqvim günü ilə deyil, iş günü ilə tənzimlənir.',
    hint = 'Vətəndaşların müraciətlərinə baxılması zamanı qanunvericilikdə nəzərdə tutulan müddətlər təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır və əlavə araşdırma tələb edən hallarda bu müddət iki dəfə artırılır.'
WHERE id = '1e8ed458-b13c-4005-bc81-a771d03754b0';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanuna əsasən, əlavə öyrənilmə və yoxlanılma tələb edən müraciətlərə hansı müddətdə baxılır?',
    options = '["Ən geci 30 təqvim günü müddətində", "Ən geci 15 iş günü müddətində", "Ən geci 45 təqvim günü müddətində", "Ən geci 30 iş günü müddətində"]'::jsonb,
    correct_answer = 'Ən geci 30 iş günü müddətində',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun 10.1-ci maddəsinə əsasən, ümumi müraciətlərə ən geci 15 iş günü, əlavə öyrənilmə və yoxlanılma tələb edən müraciətlərə isə ən geci 30 iş günü müddətində baxılır. Qanunvericilikdə müddətlər təqvim günü ilə deyil, iş günü ilə tənzimlənir.',
    hint = 'Vətəndaşların müraciətlərinə baxılması zamanı qanunvericilikdə nəzərdə tutulan müddətlər təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır və əlavə araşdırma tələb edən hallarda bu müddət iki dəfə artırılır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '1e8ed458-b13c-4005-bc81-a771d03754b0');

-- Order 3: ID 914859ea-e5f6-426a-bee9-e392b218ea68
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” AR Qanununa əsasən, aşağıdakı hallardan hansında müraciətə baxılmasına xitam verilir?',
    options = '["Vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş şəxs vəfat etdikdə", "Müraciətə baxan dövlət orqanında daxili struktur dəyişikliyi və ya ştat ixtisarı aparıldıqda", "Müraciətin araşdırılması üçün tələb olunan müddət 15 iş gününü keçdikdə", "Müraciət edən vətəndaş daimi yaşayış və ya iş yerini dəyişdikdə"]'::jsonb,
    correct_answer = 'Vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş şəxs vəfat etdikdə',
    explanation = '“Vətəndaşların müraciətləri haqqında” AR Qanunu Maddə 11.2 — Qanunun 11.2-ci maddəsinə əsasən, vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş fiziki şəxs vəfat etdikdə müraciətə baxılmasına xitam verilir.',
    hint = 'Müraciət yazılı ərizə ilə geri götürüldükdə və ya müraciət edən şəxs vəfat etdikdə icraata xitam verilir.'
WHERE id = '914859ea-e5f6-426a-bee9-e392b218ea68';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” AR Qanununa əsasən, aşağıdakı hallardan hansında müraciətə baxılmasına xitam verilir?',
    options = '["Vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş şəxs vəfat etdikdə", "Müraciətə baxan dövlət orqanında daxili struktur dəyişikliyi və ya ştat ixtisarı aparıldıqda", "Müraciətin araşdırılması üçün tələb olunan müddət 15 iş gününü keçdikdə", "Müraciət edən vətəndaş daimi yaşayış və ya iş yerini dəyişdikdə"]'::jsonb,
    correct_answer = 'Vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş şəxs vəfat etdikdə',
    explanation = '“Vətəndaşların müraciətləri haqqında” AR Qanunu Maddə 11.2 — Qanunun 11.2-ci maddəsinə əsasən, vətəndaş tərəfindən müraciətin geri götürülməsi barədə yazılı ərizə daxil olduqda və ya müraciət etmiş fiziki şəxs vəfat etdikdə müraciətə baxılmasına xitam verilir.',
    hint = 'Müraciət yazılı ərizə ilə geri götürüldükdə və ya müraciət edən şəxs vəfat etdikdə icraata xitam verilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '914859ea-e5f6-426a-bee9-e392b218ea68');

-- Order 4: ID 50e2aa43-bd5c-4be4-b45a-6e394f83b8c1
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciətə (şikayətə) baxılmasının nəticəsindən və ya onun rədd edilməsindən razı qalmayan vətəndaş hara müraciət edə bilər?',
    options = '["Yalnız müraciətə baxmış həmin orqanın rəhbərinin daxili əmri ilə yaradılan yerli komissiyaya", "Yuxarı orqana (vəzifəli şəxsə) və ya məhkəməyə", "Yalnız notariat kontorlarına və ya lisenziyalaşdırılmış hüquqi məsləhətxanalara", "Yalnız yerli icra hakimiyyəti başçısının yanındakı qəyyumluq və himayəçilik komissiyasına"]'::jsonb,
    correct_answer = 'Yuxarı orqana (vəzifəli şəxsə) və ya məhkəməyə',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətə baxılmasının nəticəsindən (o cümlədən şikayətin rədd edilməsindən) razı qalmayan vətəndaş həmin qərardan yuxarı orqana (vəzifəli şəxsə) və ya məhkəməyə şikayət etmək hüququna malikdir. Bu hüquq vətəndaşların pozulmuş hüquq və azadlıqlarının bərpası üçün əsas hüquqi təminatlardan biridir.',
    hint = 'Vətəndaşların müraciətləri üzrə qəbul edilmiş qərarlardan və ya verilən cavablardan narazı qaldıqda, qanunvericilik onlara həm inzibati qaydada yuxarı orqana (vəzifəli şəxsə), həm də məhkəməyə müraciət etmək hüququ verir.'
WHERE id = '50e2aa43-bd5c-4be4-b45a-6e394f83b8c1';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciətə (şikayətə) baxılmasının nəticəsindən və ya onun rədd edilməsindən razı qalmayan vətəndaş hara müraciət edə bilər?',
    options = '["Yalnız müraciətə baxmış həmin orqanın rəhbərinin daxili əmri ilə yaradılan yerli komissiyaya", "Yuxarı orqana (vəzifəli şəxsə) və ya məhkəməyə", "Yalnız notariat kontorlarına və ya lisenziyalaşdırılmış hüquqi məsləhətxanalara", "Yalnız yerli icra hakimiyyəti başçısının yanındakı qəyyumluq və himayəçilik komissiyasına"]'::jsonb,
    correct_answer = 'Yuxarı orqana (vəzifəli şəxsə) və ya məhkəməyə',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətə baxılmasının nəticəsindən (o cümlədən şikayətin rədd edilməsindən) razı qalmayan vətəndaş həmin qərardan yuxarı orqana (vəzifəli şəxsə) və ya məhkəməyə şikayət etmək hüququna malikdir. Bu hüquq vətəndaşların pozulmuş hüquq və azadlıqlarının bərpası üçün əsas hüquqi təminatlardan biridir.',
    hint = 'Vətəndaşların müraciətləri üzrə qəbul edilmiş qərarlardan və ya verilən cavablardan narazı qaldıqda, qanunvericilik onlara həm inzibati qaydada yuxarı orqana (vəzifəli şəxsə), həm də məhkəməyə müraciət etmək hüququ verir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '50e2aa43-bd5c-4be4-b45a-6e394f83b8c1');

-- Order 5: ID e07000b1-6c49-4a9c-bff6-6b058c02bb99
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, daxil olmuş şikayətin baxılması üçün aşağıdakı subyektlərdən hansına göndərilməsi qanunla qəti şəkildə qadağandır?',
    options = '["Azərbaycan Respublikasının İnsan Hüquqları üzrə Müvəkkilinə (Ombudsmana)", "Məsələnin həlli üzrə səlahiyyəti olan yuxarı icra hakimiyyəti orqanına", "Aidiyyəti üzrə araşdırma aparmaq səlahiyyəti olan hüquq-mühafizə qurumuna", "Qərarından və ya hərəkətindən (hərəkətsizliyindən) şikayət edilən subyektə və ya vəzifəli şəxsə"]'::jsonb,
    correct_answer = 'Qərarından və ya hərəkətindən (hərəkətsizliyindən) şikayət edilən subyektə və ya vəzifəli şəxsə',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun tələblərinə əsasən, qərarından və ya hərəkətindən (hərəkətsizliyindən) şikayət edilən subyektə və ya vəzifəli şəxsə şikayətin baxılması üçün göndərilməsi qəti şəkildə qadağandır. Bu tələb müraciətlərə baxılarkən qərəzsizliyin və obyektivliyin qorunmasını təmin edən əsas hüquqi mexanizmlərdən biridir.',
    hint = 'İnzibati icraatda və müraciətlərə baxılarkən obyektivliyin təmin edilməsi və maraqlar toqquşmasının aradan qaldırılması məqsədilə şikayət olunan tərəfin özünə araşdırma tapşırılmasına yol verilmir.'
WHERE id = 'e07000b1-6c49-4a9c-bff6-6b058c02bb99';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, daxil olmuş şikayətin baxılması üçün aşağıdakı subyektlərdən hansına göndərilməsi qanunla qəti şəkildə qadağandır?',
    options = '["Azərbaycan Respublikasının İnsan Hüquqları üzrə Müvəkkilinə (Ombudsmana)", "Məsələnin həlli üzrə səlahiyyəti olan yuxarı icra hakimiyyəti orqanına", "Aidiyyəti üzrə araşdırma aparmaq səlahiyyəti olan hüquq-mühafizə qurumuna", "Qərarından və ya hərəkətindən (hərəkətsizliyindən) şikayət edilən subyektə və ya vəzifəli şəxsə"]'::jsonb,
    correct_answer = 'Qərarından və ya hərəkətindən (hərəkətsizliyindən) şikayət edilən subyektə və ya vəzifəli şəxsə',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun tələblərinə əsasən, qərarından və ya hərəkətindən (hərəkətsizliyindən) şikayət edilən subyektə və ya vəzifəli şəxsə şikayətin baxılması üçün göndərilməsi qəti şəkildə qadağandır. Bu tələb müraciətlərə baxılarkən qərəzsizliyin və obyektivliyin qorunmasını təmin edən əsas hüquqi mexanizmlərdən biridir.',
    hint = 'İnzibati icraatda və müraciətlərə baxılarkən obyektivliyin təmin edilməsi və maraqlar toqquşmasının aradan qaldırılması məqsədilə şikayət olunan tərəfin özünə araşdırma tapşırılmasına yol verilmir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'e07000b1-6c49-4a9c-bff6-6b058c02bb99');

-- Order 6: ID 356b96bb-84dc-439d-b6c2-66ef7abf5a5b
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən təklif anlayışı necə müəyyən edilir?',
    options = '["Pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi tələbini əks etdirən müraciət formasıdır", "Vəzifəli şəxslərin qanunsuz hərəkətlərindən və ya qərarlarından verilən hüquqi etiraz xarakterli şikayət xarakterli sənəddir", "Vətəndaşlara dövlət büdcəsindən maddi yardım, sosial təminat və ya fərdi güzəştlərin verilməsi haqqında müraciətdir", "Qanunların və digər normativ hüquqi aktların təkmilləşdirilməsi, dövlət orqanlarının fəaliyyətinin yaxşılaşdırılması haqqında müraciətdir"]'::jsonb,
    correct_answer = 'Qanunların və digər normativ hüquqi aktların təkmilləşdirilməsi, dövlət orqanlarının fəaliyyətinin yaxşılaşdırılması haqqında müraciətdir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, təklif — qanunların və digər normativ hüquqi aktların təkmilləşdirilməsi, dövlət orqanlarının fəaliyyətinin, iqtisadi, sosial və digər sahələrin yaxşılaşdırılması haqqında vətəndaşın müraciətidir. Bu müraciət növü fərdi hüquqların müdafiəsindən daha çox ictimai və dövlət idarəçiliyi mexanizmlərinin təkmilləşdirilməsinə xidmət edir.',
    hint = 'Qanunvericilikdə vətəndaş müraciətlərinin növlərindən biri olan təklif fərdi hüquqların pozulması və ya şikayətlə deyil, dövlət orqanlarının fəaliyyətinin, qanunvericiliyin və ictimai həyatın müxtəlif sahələrinin təkmilləşdirilməsinə yönəlmiş təşəbbüslərlə bağlı olur.'
WHERE id = '356b96bb-84dc-439d-b6c2-66ef7abf5a5b';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən təklif anlayışı necə müəyyən edilir?',
    options = '["Pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi tələbini əks etdirən müraciət formasıdır", "Vəzifəli şəxslərin qanunsuz hərəkətlərindən və ya qərarlarından verilən hüquqi etiraz xarakterli şikayət xarakterli sənəddir", "Vətəndaşlara dövlət büdcəsindən maddi yardım, sosial təminat və ya fərdi güzəştlərin verilməsi haqqında müraciətdir", "Qanunların və digər normativ hüquqi aktların təkmilləşdirilməsi, dövlət orqanlarının fəaliyyətinin yaxşılaşdırılması haqqında müraciətdir"]'::jsonb,
    correct_answer = 'Qanunların və digər normativ hüquqi aktların təkmilləşdirilməsi, dövlət orqanlarının fəaliyyətinin yaxşılaşdırılması haqqında müraciətdir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, təklif — qanunların və digər normativ hüquqi aktların təkmilləşdirilməsi, dövlət orqanlarının fəaliyyətinin, iqtisadi, sosial və digər sahələrin yaxşılaşdırılması haqqında vətəndaşın müraciətidir. Bu müraciət növü fərdi hüquqların müdafiəsindən daha çox ictimai və dövlət idarəçiliyi mexanizmlərinin təkmilləşdirilməsinə xidmət edir.',
    hint = 'Qanunvericilikdə vətəndaş müraciətlərinin növlərindən biri olan təklif fərdi hüquqların pozulması və ya şikayətlə deyil, dövlət orqanlarının fəaliyyətinin, qanunvericiliyin və ictimai həyatın müxtəlif sahələrinin təkmilləşdirilməsinə yönəlmiş təşəbbüslərlə bağlı olur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '356b96bb-84dc-439d-b6c2-66ef7abf5a5b');

-- Order 7: ID 09ae5150-94f0-41d6-bbad-bc89a9c5bb3e
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən ərizə anlayışı necə müəyyən edilir?',
    options = '["Vəzifəli şəxslərin qanunsuz qərarlarından və ya hərəkətlərindən verilən hüquqi etiraz xarakterli şikayətdir", "Qanunların və digər normativ hüquqi aktların ümumi şəkildə təkmilləşdirilməsinə yönəlmiş təşəbbüsdür", "Xarici ölkələrə gediş-gəliş zamanı sərhəd nəzarəti orqanları tərəfindən tələb olunan viza sənədidir", "Hüquq və azadlıqların həyata keçirilməsi ilə bağlı tələbləri nəzərdə tutan müraciətdir"]'::jsonb,
    correct_answer = 'Hüquq və azadlıqların həyata keçirilməsi ilə bağlı tələbləri nəzərdə tutan müraciətdir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, ərizə — hüquq və azadlıqların həyata keçirilməsi ilə bağlı tələbləri nəzərdə tutan müraciətdir. Bu müraciət növü vətəndaşların mülki, əmək, sosial və digər sahələrdə öz hüquqlarını reallaşdırmaq və ya dövlət orqanlarından müvafiq xidmətlər əldə etmək məqsədilə verdikləri əsas müraciət formasıdır.',
    hint = 'Vətəndaş müraciətlərinin növlərindən biri olan ərizə, şəxsin öz hüquqlarını, azadlıqlarını və qanuni mənafelərini reallaşdırmaq, müvafiq xidmətlərdən yararlanmaq üçün səlahiyyətli qurumlara ünvanladığı tələb xarakterli müraciətdir.'
WHERE id = '09ae5150-94f0-41d6-bbad-bc89a9c5bb3e';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən ərizə anlayışı necə müəyyən edilir?',
    options = '["Vəzifəli şəxslərin qanunsuz qərarlarından və ya hərəkətlərindən verilən hüquqi etiraz xarakterli şikayətdir", "Qanunların və digər normativ hüquqi aktların ümumi şəkildə təkmilləşdirilməsinə yönəlmiş təşəbbüsdür", "Xarici ölkələrə gediş-gəliş zamanı sərhəd nəzarəti orqanları tərəfindən tələb olunan viza sənədidir", "Hüquq və azadlıqların həyata keçirilməsi ilə bağlı tələbləri nəzərdə tutan müraciətdir"]'::jsonb,
    correct_answer = 'Hüquq və azadlıqların həyata keçirilməsi ilə bağlı tələbləri nəzərdə tutan müraciətdir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, ərizə — hüquq və azadlıqların həyata keçirilməsi ilə bağlı tələbləri nəzərdə tutan müraciətdir. Bu müraciət növü vətəndaşların mülki, əmək, sosial və digər sahələrdə öz hüquqlarını reallaşdırmaq və ya dövlət orqanlarından müvafiq xidmətlər əldə etmək məqsədilə verdikləri əsas müraciət formasıdır.',
    hint = 'Vətəndaş müraciətlərinin növlərindən biri olan ərizə, şəxsin öz hüquqlarını, azadlıqlarını və qanuni mənafelərini reallaşdırmaq, müvafiq xidmətlərdən yararlanmaq üçün səlahiyyətli qurumlara ünvanladığı tələb xarakterli müraciətdir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '09ae5150-94f0-41d6-bbad-bc89a9c5bb3e');

-- Order 8: ID 6591661f-6fbe-45e8-a63a-e89a2663e159
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən müraciətin hansı növləri müəyyən edilmişdir?',
    options = '["Bəyannamə, vəsatət və rəy", "Tələbnamə, qərar və protokol", "Ərizə, təklif və şikayət", "Sorğu, bildiriş və akt"]'::jsonb,
    correct_answer = 'Ərizə, təklif və şikayət',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, müraciətin növləri ərizə, təklif və şikayətdən ibarətdir. Qanunvericilikdə bu üç növün hər birinin özünəməxsus anlayışı, məqsədi və baxılma xüsusiyyətləri dəqiq təsbit olunmuşdur.',
    hint = 'Qanunvericiliyə əsasən vətəndaşların səlahiyyətli dövlət orqanlarına, idarələrə və ya vəzifəli şəxslərə ünvanladıqları müraciətlər qanunla dəqiq müəyyən edilmiş üç əsas kateqoriyaya bölünür.'
WHERE id = '6591661f-6fbe-45e8-a63a-e89a2663e159';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən müraciətin hansı növləri müəyyən edilmişdir?',
    options = '["Bəyannamə, vəsatət və rəy", "Tələbnamə, qərar və protokol", "Ərizə, təklif və şikayət", "Sorğu, bildiriş və akt"]'::jsonb,
    correct_answer = 'Ərizə, təklif və şikayət',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, müraciətin növləri ərizə, təklif və şikayətdən ibarətdir. Qanunvericilikdə bu üç növün hər birinin özünəməxsus anlayışı, məqsədi və baxılma xüsusiyyətləri dəqiq təsbit olunmuşdur.',
    hint = 'Qanunvericiliyə əsasən vətəndaşların səlahiyyətli dövlət orqanlarına, idarələrə və ya vəzifəli şəxslərə ünvanladıqları müraciətlər qanunla dəqiq müəyyən edilmiş üç əsas kateqoriyaya bölünür.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '6591661f-6fbe-45e8-a63a-e89a2663e159');

-- Order 9: ID 415a2bd2-100b-4e2a-b85f-5b7cfc771055
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, daxil olmuş müraciətə baxılması hansı halda dayandırla bilər?',
    options = '["Müraciət mətni daxilində mürəkkəb hüquqi terminlər və ya peşəkar ifadələr işlədildikdə", "Eyni məsələ üzrə məhkəmə icraatı başlandıqda", "Vətəndaş müraciətini rəsmi elektron qaydada və ya onlayn platforma vasitəsilə təqdim etdikdə", "Müraciət edən şəxs xarici ölkəyə qısamüddətli xidməti və ya şəxsi səfər etdikdə"]'::jsonb,
    correct_answer = 'Eyni məsələ üzrə məhkəmə icraatı başlandıqda',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətdə qaldırılan eyni məsələ üzrə məhkəmə icraatı başlandıqda və ya məhkəmənin müvafiq qərarı mövcud olduqda, müraciətə baxılması dayandırılır və ya qanunvericiliklə müəyyən edilmiş qaydada baxılmamış saxlanılır. Bu qayda səlahiyyətlərin kəsişməsinin və məhkəmə qərarları ilə inzibati aktlar arasında ziddiyyətin yaranmasının qarşısını alır.',
    hint = 'İnzibati icraat və müraciətlərə baxılması prosesində əgər həmin şəxsin müraciətində qaldırılan eyni məsələ üzrə məhkəmə icraatı başlanılıbsa və ya məhkəmənin qanuni qüvvəyə minmiş qərarı mövcuddursa, bu, müraciətə baxılmasının dayandırılması üçün əsas yaradır.'
WHERE id = '415a2bd2-100b-4e2a-b85f-5b7cfc771055';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, daxil olmuş müraciətə baxılması hansı halda dayandırla bilər?',
    options = '["Müraciət mətni daxilində mürəkkəb hüquqi terminlər və ya peşəkar ifadələr işlədildikdə", "Eyni məsələ üzrə məhkəmə icraatı başlandıqda", "Vətəndaş müraciətini rəsmi elektron qaydada və ya onlayn platforma vasitəsilə təqdim etdikdə", "Müraciət edən şəxs xarici ölkəyə qısamüddətli xidməti və ya şəxsi səfər etdikdə"]'::jsonb,
    correct_answer = 'Eyni məsələ üzrə məhkəmə icraatı başlandıqda',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətdə qaldırılan eyni məsələ üzrə məhkəmə icraatı başlandıqda və ya məhkəmənin müvafiq qərarı mövcud olduqda, müraciətə baxılması dayandırılır və ya qanunvericiliklə müəyyən edilmiş qaydada baxılmamış saxlanılır. Bu qayda səlahiyyətlərin kəsişməsinin və məhkəmə qərarları ilə inzibati aktlar arasında ziddiyyətin yaranmasının qarşısını alır.',
    hint = 'İnzibati icraat və müraciətlərə baxılması prosesində əgər həmin şəxsin müraciətində qaldırılan eyni məsələ üzrə məhkəmə icraatı başlanılıbsa və ya məhkəmənin qanuni qüvvəyə minmiş qərarı mövcuddursa, bu, müraciətə baxılmasının dayandırılması üçün əsas yaradır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '415a2bd2-100b-4e2a-b85f-5b7cfc771055');

-- Order 10: ID abc9ba42-f75b-4f05-8752-37bcffd5d4da
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciət etmək hüququnun pozulması və ya qanun pozuntularına yol verilməsi nəticəsində vətəndaşın hansı hüququ vardır?',
    options = '["Dövlət orqanının fəaliyyətinə müdaxilə edərək özbaşına qərar qəbul etmək", "Qanun pozuntusuna yol vermiş vəzifəli şəxsi fərdi qaydada inzibati cərimələmək", "Dövlət orqanının inzibati binasını nəzarətə götürərək fəaliyyətini dayandırmaq", "Dəymiş maddi və mənəvi ziyanın ödənilməsini məhkəmə qaydasında tələb etmək"]'::jsonb,
    correct_answer = 'Dəymiş maddi və mənəvi ziyanın ödənilməsini məhkəmə qaydasında tələb etmək',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və ümumi qanunvericiliyin tələblərinə əsasən, müraciətlərə baxılması qaydalarının pozulması, müraciətlərin qanunsuz olaraq rədd edilməsi və ya vətəndaşın hüquqlarının pozulması nəticəsində ona dəymiş maddi və mənəvi ziyanın qanunvericiliklə müəyyən edilmiş qaydada (məhkəmə qaydasında) ödənilməsini tələb etmək hüququ vardır.',
    hint = 'Vətəndaşların müraciətləri haqqında qanunvericiliyin tələblərinin pozulması, müraciətlərə baxılmaması və ya qanunsuz qərarların qəbul edilməsi nəticəsində hüquqları pozulmuş şəxslərin dövlət tərəfindən qorunan hüquqi müdafiə mexanizmlərindən biri də dəymiş ziyanın tələb edilməsidir.'
WHERE id = 'abc9ba42-f75b-4f05-8752-37bcffd5d4da';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciət etmək hüququnun pozulması və ya qanun pozuntularına yol verilməsi nəticəsində vətəndaşın hansı hüququ vardır?',
    options = '["Dövlət orqanının fəaliyyətinə müdaxilə edərək özbaşına qərar qəbul etmək", "Qanun pozuntusuna yol vermiş vəzifəli şəxsi fərdi qaydada inzibati cərimələmək", "Dövlət orqanının inzibati binasını nəzarətə götürərək fəaliyyətini dayandırmaq", "Dəymiş maddi və mənəvi ziyanın ödənilməsini məhkəmə qaydasında tələb etmək"]'::jsonb,
    correct_answer = 'Dəymiş maddi və mənəvi ziyanın ödənilməsini məhkəmə qaydasında tələb etmək',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və ümumi qanunvericiliyin tələblərinə əsasən, müraciətlərə baxılması qaydalarının pozulması, müraciətlərin qanunsuz olaraq rədd edilməsi və ya vətəndaşın hüquqlarının pozulması nəticəsində ona dəymiş maddi və mənəvi ziyanın qanunvericiliklə müəyyən edilmiş qaydada (məhkəmə qaydasında) ödənilməsini tələb etmək hüququ vardır.',
    hint = 'Vətəndaşların müraciətləri haqqında qanunvericiliyin tələblərinin pozulması, müraciətlərə baxılmaması və ya qanunsuz qərarların qəbul edilməsi nəticəsində hüquqları pozulmuş şəxslərin dövlət tərəfindən qorunan hüquqi müdafiə mexanizmlərindən biri də dəymiş ziyanın tələb edilməsidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'abc9ba42-f75b-4f05-8752-37bcffd5d4da');

-- Order 11: ID e6d9e149-3545-415d-bca3-f3df6d811452
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, vətəndaşın müraciətinə baxılmasının nəticəsi olaraq verilən rəsmi cavabda (qərarda) hansı məlumatlar mütləq əks olunmalıdır?',
    options = '["Digər vətəndaşların əvvəlki dövrlərdə etdikləri analoji müraciətlərin surətləri və statistik rəqəmlər", "Məsələnin mahiyyəti üzrə hüquqi əsaslandırılmış qərar və şikayət etmə qaydası", "Yalnız qurum rəhbərinin şəxsi subyektiv mülahizələri və qeyri-rəsmi tövsiyələri", "Dövlət qulluqçularının vəzifə maaşları, mükafatları və əməkhaqqı cədvəli"]'::jsonb,
    correct_answer = 'Məsələnin mahiyyəti üzrə hüquqi əsaslandırılmış qərar və şikayət etmə qaydası',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətə verilən cavabda qaldırılan məsələnin mahiyyəti üzrə hüquqi əsaslandırılmış qərar, habelə həmin qərardan şikayət vermək hüququ və şikayət edilməli olan instansiya (qayda) mütləq göstərilməlidir. Bu, vətəndaşların məlumatlandarılması və hüquqi müdafiə təminatlarının reallaşdırılması üçün vacib şərtlərdəndir.',
    hint = 'Qanunvericiliyə əsasən müraciətlərə verilən cavab formal xarakter daşımamalı, qaldırılan məsələnin mahiyyətini hüquqi cəhətdən əsaslandırmalı və vətəndaşın qərardan narazı qaldığı təqdirdə hara şikayət edə biləcəyini göstərməlidir.'
WHERE id = 'e6d9e149-3545-415d-bca3-f3df6d811452';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, vətəndaşın müraciətinə baxılmasının nəticəsi olaraq verilən rəsmi cavabda (qərarda) hansı məlumatlar mütləq əks olunmalıdır?',
    options = '["Digər vətəndaşların əvvəlki dövrlərdə etdikləri analoji müraciətlərin surətləri və statistik rəqəmlər", "Məsələnin mahiyyəti üzrə hüquqi əsaslandırılmış qərar və şikayət etmə qaydası", "Yalnız qurum rəhbərinin şəxsi subyektiv mülahizələri və qeyri-rəsmi tövsiyələri", "Dövlət qulluqçularının vəzifə maaşları, mükafatları və əməkhaqqı cədvəli"]'::jsonb,
    correct_answer = 'Məsələnin mahiyyəti üzrə hüquqi əsaslandırılmış qərar və şikayət etmə qaydası',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətə verilən cavabda qaldırılan məsələnin mahiyyəti üzrə hüquqi əsaslandırılmış qərar, habelə həmin qərardan şikayət vermək hüququ və şikayət edilməli olan instansiya (qayda) mütləq göstərilməlidir. Bu, vətəndaşların məlumatlandarılması və hüquqi müdafiə təminatlarının reallaşdırılması üçün vacib şərtlərdəndir.',
    hint = 'Qanunvericiliyə əsasən müraciətlərə verilən cavab formal xarakter daşımamalı, qaldırılan məsələnin mahiyyətini hüquqi cəhətdən əsaslandırmalı və vətəndaşın qərardan narazı qaldığı təqdirdə hara şikayət edə biləcəyini göstərməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'e6d9e149-3545-415d-bca3-f3df6d811452');

-- Order 12: ID 31baa58f-b8a9-408d-9844-362580d56678
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, daxil olmuş müraciətin icrası nə vaxt başa çatmış hesab olunur?',
    options = '["Müraciət orqana daxil olduğu gün", "Məsələ mahiyyəti üzrə həll edildikdə və vətəndaşa əsaslandırılmış yazılı/elektron cavab verildikdə", "Rəhbər dərkənar qoyduğu gün", "Müraciət icraçıya verildiyi an"]'::jsonb,
    correct_answer = 'Məsələ mahiyyəti üzrə həll edildikdə və vətəndaşa əsaslandırılmış yazılı/elektron cavab verildikdə',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və kargüzarlıq təlimatlarının tələblərinə əsasən, müraciətin icrası yalnız o zaman başa çatmış hesab olunur ki, müraciətdə qaldırılan məsələlər mahiyyəti üzrə tam həll edilsin və bu barədə vətəndaşa qanunvericiliklə müəyyən edilmiş qaydada əsaslandırılmış yazılı və ya elektron cavab verilsin. Müraciətin orqana daxil olması, rəhbər tərəfindən dərkənar qoyulması və ya icraçıya təhvil verilməsi mərhələləri isə hələ icra prosesinin təşkilati gedişatını əhatə edir.',
    hint = 'Vətəndaşların müraciətlərinə baxılması prosesi yalnız həmin müraciətdə qaldırılan məsələlərin mahiyyəti üzrə araşdırılaraq həll edilməsi və nəticəsi barədə qanunvericiliyə uyğun olaraq vətəndaşa rəsmi (yazılı və ya elektron formada) əsaslandırılmış cavab verilməsi ilə başa çatır.'
WHERE id = '31baa58f-b8a9-408d-9844-362580d56678';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, daxil olmuş müraciətin icrası nə vaxt başa çatmış hesab olunur?',
    options = '["Müraciət orqana daxil olduğu gün", "Məsələ mahiyyəti üzrə həll edildikdə və vətəndaşa əsaslandırılmış yazılı/elektron cavab verildikdə", "Rəhbər dərkənar qoyduğu gün", "Müraciət icraçıya verildiyi an"]'::jsonb,
    correct_answer = 'Məsələ mahiyyəti üzrə həll edildikdə və vətəndaşa əsaslandırılmış yazılı/elektron cavab verildikdə',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və kargüzarlıq təlimatlarının tələblərinə əsasən, müraciətin icrası yalnız o zaman başa çatmış hesab olunur ki, müraciətdə qaldırılan məsələlər mahiyyəti üzrə tam həll edilsin və bu barədə vətəndaşa qanunvericiliklə müəyyən edilmiş qaydada əsaslandırılmış yazılı və ya elektron cavab verilsin. Müraciətin orqana daxil olması, rəhbər tərəfindən dərkənar qoyulması və ya icraçıya təhvil verilməsi mərhələləri isə hələ icra prosesinin təşkilati gedişatını əhatə edir.',
    hint = 'Vətəndaşların müraciətlərinə baxılması prosesi yalnız həmin müraciətdə qaldırılan məsələlərin mahiyyəti üzrə araşdırılaraq həll edilməsi və nəticəsi barədə qanunvericiliyə uyğun olaraq vətəndaşa rəsmi (yazılı və ya elektron formada) əsaslandırılmış cavab verilməsi ilə başa çatır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '31baa58f-b8a9-408d-9844-362580d56678');

-- Order 13: ID 94ef802b-9a93-45ad-afb3-ecb4ecdc7356
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, daxil olan müraciətlərin uçotu və statistikası necə aparılır?',
    options = '["Daimi əsaslarla elektron və ya kağız daşıyıcılarda qeydiyyat aparılmaqla", "Yalnız vətəndaş tərəfindən yazılı şəkildə xüsusi sorğu tələb edildiyi hallarda", "Yalnız müraciət tam təmin edildiyi və müsbət nəticələndiyi təqdirdə", "Yalnız hər beş ildən bir dövlət statistika orqanları tərəfindən siyahıyaalınma yolu ilə"]'::jsonb,
    correct_answer = 'Daimi əsaslarla elektron və ya kağız daşıyıcılarda qeydiyyat aparılmaqla',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərinə və kargüzarlıq qaydalarına əsasən, orqana daxil olan bütün müraciətlərin (ərizə, təklif və şikayətlərin) uçotu və qeydiyyatı daimi əsaslarla elektron və ya kağız daşıyıcılarda aparılır. Bu, müraciətlərin vaxtında icrasını təmin etməyə və onların vahid statistik bazasını formalaşdırmağa xidmət edir.',
    hint = 'Dövlət və bələdiyyə orqanlarında, habelə digər müraciətə baxan subyektlərdə şəffaflığın təmin edilməsi, baxılma müddətlərinə nəzarət olunması və ümumi hesabatlılığın qurulması üçün müraciətlərin qeydiyyatı müəyyən edilmiş qaydada həyata keçirilir.'
WHERE id = '94ef802b-9a93-45ad-afb3-ecb4ecdc7356';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, daxil olan müraciətlərin uçotu və statistikası necə aparılır?',
    options = '["Daimi əsaslarla elektron və ya kağız daşıyıcılarda qeydiyyat aparılmaqla", "Yalnız vətəndaş tərəfindən yazılı şəkildə xüsusi sorğu tələb edildiyi hallarda", "Yalnız müraciət tam təmin edildiyi və müsbət nəticələndiyi təqdirdə", "Yalnız hər beş ildən bir dövlət statistika orqanları tərəfindən siyahıyaalınma yolu ilə"]'::jsonb,
    correct_answer = 'Daimi əsaslarla elektron və ya kağız daşıyıcılarda qeydiyyat aparılmaqla',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərinə və kargüzarlıq qaydalarına əsasən, orqana daxil olan bütün müraciətlərin (ərizə, təklif və şikayətlərin) uçotu və qeydiyyatı daimi əsaslarla elektron və ya kağız daşıyıcılarda aparılır. Bu, müraciətlərin vaxtında icrasını təmin etməyə və onların vahid statistik bazasını formalaşdırmağa xidmət edir.',
    hint = 'Dövlət və bələdiyyə orqanlarında, habelə digər müraciətə baxan subyektlərdə şəffaflığın təmin edilməsi, baxılma müddətlərinə nəzarət olunması və ümumi hesabatlılığın qurulması üçün müraciətlərin qeydiyyatı müəyyən edilmiş qaydada həyata keçirilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '94ef802b-9a93-45ad-afb3-ecb4ecdc7356');

-- Order 14: ID 540bb42a-6d59-4f2f-8dec-f9f79187d86a
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, daxil olmuş müraciətdə dövlət orqanının, yerli özünüidarəetmə orqanının və ya onların vəzifəli şəxslərinin fəaliyyətində aşkar edilmiş qanun pozuntuları göstərildikdə, müraciətə baxan subyekt hansı addımı atmalıdır?',
    options = '["Vətəndaşa heç bir rəsmi cavab verilməməlidir və müraciət dərhal baxılmamış saxlanılmalıdır", "Müraciətə baxılan subyekt həmin pozuntuların aradan qaldırılması üçün dərhal zəruri tədbirlər görməlidir", "Müraciət dərhal aidiyyəti üzrə arxivə göndərilərək icradan tamamilə çıxarılmalıdır", "Məsələyə qanunvericiliyə əsasən yalnız növbəti təqvim ilinin hesabat dövründə baxılmasına icazə verilir"]'::jsonb,
    correct_answer = 'Müraciətə baxılan subyekt həmin pozuntuların aradan qaldırılması üçün dərhal zəruri tədbirlər görməlidir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətdə dövlət orqanlarının, yerli özünüidarəetmə orqanlarının və ya onların vəzifəli şəxslərinin fəaliyyətində yol verilmiş qanun pozuntuları göstərildikdə, müraciətə baxan subyekt həmin pozuntuların aradan qaldırılması üçün dərhal zəruri tədbirlər görməlidir. Bu norma dövlət idarəçiliyində şəffaflığın artırılmasına, idarəetmə mexanizmlərindəki nöqsanların operativ aradan qaldırılmasına və vətəndaşların hüquqlarının qorunmasına xidmət edir.',
    hint = 'Vətəndaşların müraciətlərində dövlət qurumlarının və ya vəzifəli şəxslərin fəaliyyətində yol verilmiş qanun pozuntuları barədə məlumatlar əks olunduqda, həmin pozuntuların operativ şəkildə aradan qaldırılması və qanunçuluğun bərpası üçün dərhal tədbirlər görülməsi tələb edilir.'
WHERE id = '540bb42a-6d59-4f2f-8dec-f9f79187d86a';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, daxil olmuş müraciətdə dövlət orqanının, yerli özünüidarəetmə orqanının və ya onların vəzifəli şəxslərinin fəaliyyətində aşkar edilmiş qanun pozuntuları göstərildikdə, müraciətə baxan subyekt hansı addımı atmalıdır?',
    options = '["Vətəndaşa heç bir rəsmi cavab verilməməlidir və müraciət dərhal baxılmamış saxlanılmalıdır", "Müraciətə baxılan subyekt həmin pozuntuların aradan qaldırılması üçün dərhal zəruri tədbirlər görməlidir", "Müraciət dərhal aidiyyəti üzrə arxivə göndərilərək icradan tamamilə çıxarılmalıdır", "Məsələyə qanunvericiliyə əsasən yalnız növbəti təqvim ilinin hesabat dövründə baxılmasına icazə verilir"]'::jsonb,
    correct_answer = 'Müraciətə baxılan subyekt həmin pozuntuların aradan qaldırılması üçün dərhal zəruri tədbirlər görməlidir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin tələblərinə əsasən, müraciətdə dövlət orqanlarının, yerli özünüidarəetmə orqanlarının və ya onların vəzifəli şəxslərinin fəaliyyətində yol verilmiş qanun pozuntuları göstərildikdə, müraciətə baxan subyekt həmin pozuntuların aradan qaldırılması üçün dərhal zəruri tədbirlər görməlidir. Bu norma dövlət idarəçiliyində şəffaflığın artırılmasına, idarəetmə mexanizmlərindəki nöqsanların operativ aradan qaldırılmasına və vətəndaşların hüquqlarının qorunmasına xidmət edir.',
    hint = 'Vətəndaşların müraciətlərində dövlət qurumlarının və ya vəzifəli şəxslərin fəaliyyətində yol verilmiş qanun pozuntuları barədə məlumatlar əks olunduqda, həmin pozuntuların operativ şəkildə aradan qaldırılması və qanunçuluğun bərpası üçün dərhal tədbirlər görülməsi tələb edilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '540bb42a-6d59-4f2f-8dec-f9f79187d86a');

-- Order 15: ID 78e63e0c-8774-49d5-aa71-b1bca02b2ccb
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən şikayət anlayışı necə müəyyən edilir?',
    options = '["Dövlət orqanlarına və ya yerli özünüidarəetmə qurumlarına xeyriyyə vəsaitlərinin ayrılması xahişidir", "Pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi və müdafiəsi tələbini ehtiva edən müraciətdir", "Vətəndaşın şəxsi həyatını, təhsilini və əmək fəaliyyətini əks etdirən tərcümeyi-hal xarakterli rəsmi sənəddir", "Cəmiyyətin maraqları naminə yeni qanun layihələrinin hazırlanması və ya qəbul edilməsi barədə təklifdir"]'::jsonb,
    correct_answer = 'Pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi və müdafiəsi tələbini ehtiva edən müraciətdir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, şikayət — pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi və müdafiəsi tələbini ehtiva edən müraciətdir. Bu müraciət növü vətəndaşların hüquqlarını pozan qərarlardan, hərəkətlərdən (hərəkətsizlikdən) narazı qaldıqda onların müdafiəsi üçün əsas hüquqi vasitədir.',
    hint = 'Vətəndaş müraciətlərinin növlərindən biri olan şikayət, şəxsin hüquqlarının, azadlıqlarının və ya qanuni mənafelərinin pozulduğu hallarda onların bərpa edilməsi və müdafiə olunması məqsədilə səlahiyyətli qurumlara ünvanladığı tələb xarakterli müraciətdir.'
WHERE id = '78e63e0c-8774-49d5-aa71-b1bca02b2ccb';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən şikayət anlayışı necə müəyyən edilir?',
    options = '["Dövlət orqanlarına və ya yerli özünüidarəetmə qurumlarına xeyriyyə vəsaitlərinin ayrılması xahişidir", "Pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi və müdafiəsi tələbini ehtiva edən müraciətdir", "Vətəndaşın şəxsi həyatını, təhsilini və əmək fəaliyyətini əks etdirən tərcümeyi-hal xarakterli rəsmi sənəddir", "Cəmiyyətin maraqları naminə yeni qanun layihələrinin hazırlanması və ya qəbul edilməsi barədə təklifdir"]'::jsonb,
    correct_answer = 'Pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi və müdafiəsi tələbini ehtiva edən müraciətdir',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, şikayət — pozulmuş hüquq və azadlıqların, habelə qanuni maraqların bərpa edilməsi və müdafiəsi tələbini ehtiva edən müraciətdir. Bu müraciət növü vətəndaşların hüquqlarını pozan qərarlardan, hərəkətlərdən (hərəkətsizlikdən) narazı qaldıqda onların müdafiəsi üçün əsas hüquqi vasitədir.',
    hint = 'Vətəndaş müraciətlərinin növlərindən biri olan şikayət, şəxsin hüquqlarının, azadlıqlarının və ya qanuni mənafelərinin pozulduğu hallarda onların bərpa edilməsi və müdafiə olunması məqsədilə səlahiyyətli qurumlara ünvanladığı tələb xarakterli müraciətdir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '78e63e0c-8774-49d5-aa71-b1bca02b2ccb');

-- Order 16: ID 1f430555-58ff-4029-bfe7-9161627b92bd
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciətə baxan subyekt müraciətin araşdırılması zamanı aşağıdakılardan hansını etməyə haqqı yoxdur (hansı tədbiri görə bilməz)?',
    options = '["Müraciətin obyektiv araşdırılması üçün müvafiq sahə üzrə mütəxəssis və ekspertləri cəlb etmək", "Əlaqədar qurumlardan və təşkilatlardan məsələnin həlli üçün zəruri olan sənədləri və məlumatları tələb etmək", "Müraciətdə göstərilən halların yoxlanılması məqsədilə zərurət yarandıqda yerində araşdırma (baxış) aparmaq", "Dövlət və ya digər qanunla qorunan sirri qanunsuz olaraq üçüncü şəxslərə ötürmək"]'::jsonb,
    correct_answer = 'Dövlət və ya digər qanunla qorunan sirri qanunsuz olaraq üçüncü şəxslərə ötürmək',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və qanunvericilik aktlarının tələblərinə əsasən, müraciətə baxan subyekt araşdırma apararkən mütəxəssis cəlb etmək, zəruri sənədləri tələb etmək, yerində araşdırma aparmaq və izahat almaq kimi səlahiyyətlərə malikdir. Lakin dövlət sirrini, kommersiya sirrini və ya qanunla qorunan digər sirri qanunsuz olaraq üçüncü şəxslərə ötürmək qəti şəkildə qadağandır və qanunaziddir.',
    hint = 'Müraciətlərin obyektiv, hərtərəfli və vaxtında araşdırılması üçün səlahiyyətli subyektlərə qanunvericiliklə müəyyən səlahiyyətlər (ekspert cəlb etmək, sənəd tələb etmək, yerində baxış keçirmək) verilsə də, fəaliyyət zamanı qanunla qorunan məlumatların təhlükəsizliyi təmin olunmalı və sirrin yayılmasına yol verilməməlidir.'
WHERE id = '1f430555-58ff-4029-bfe7-9161627b92bd';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, müraciətə baxan subyekt müraciətin araşdırılması zamanı aşağıdakılardan hansını etməyə haqqı yoxdur (hansı tədbiri görə bilməz)?',
    options = '["Müraciətin obyektiv araşdırılması üçün müvafiq sahə üzrə mütəxəssis və ekspertləri cəlb etmək", "Əlaqədar qurumlardan və təşkilatlardan məsələnin həlli üçün zəruri olan sənədləri və məlumatları tələb etmək", "Müraciətdə göstərilən halların yoxlanılması məqsədilə zərurət yarandıqda yerində araşdırma (baxış) aparmaq", "Dövlət və ya digər qanunla qorunan sirri qanunsuz olaraq üçüncü şəxslərə ötürmək"]'::jsonb,
    correct_answer = 'Dövlət və ya digər qanunla qorunan sirri qanunsuz olaraq üçüncü şəxslərə ötürmək',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və qanunvericilik aktlarının tələblərinə əsasən, müraciətə baxan subyekt araşdırma apararkən mütəxəssis cəlb etmək, zəruri sənədləri tələb etmək, yerində araşdırma aparmaq və izahat almaq kimi səlahiyyətlərə malikdir. Lakin dövlət sirrini, kommersiya sirrini və ya qanunla qorunan digər sirri qanunsuz olaraq üçüncü şəxslərə ötürmək qəti şəkildə qadağandır və qanunaziddir.',
    hint = 'Müraciətlərin obyektiv, hərtərəfli və vaxtında araşdırılması üçün səlahiyyətli subyektlərə qanunvericiliklə müəyyən səlahiyyətlər (ekspert cəlb etmək, sənəd tələb etmək, yerində baxış keçirmək) verilsə də, fəaliyyət zamanı qanunla qorunan məlumatların təhlükəsizliyi təmin olunmalı və sirrin yayılmasına yol verilməməlidir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '1f430555-58ff-4029-bfe7-9161627b92bd');

-- Order 17: ID 377ea893-c72e-42de-8bec-01ba9682a24d
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, vətəndaşın müraciətində qaldırılan məsələ “Dövlət sirri haqqında” Azərbaycan Respublikasının Qanununa uyğun olaraq dövlət sirri təşkil edən məlumatlara aid edildikdə necə davranılır?',
    options = '["Müraciət dərhal hüquq-mühafizə orqanlarına ötürülərək vətəndaş barəsində məsuliyyət tədbirləri görülür", "Məsələnin həlli məqsədilə müraciət birbaşa beynəlxalq təşkilatlara və ya xarici nümayəndəliklərə göndərilir", "Müraciətin bu səbəbdən mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edənə məlumat verilir", "Müraciət dərhal kütləvi informasiya vasitələrində dərc edilərək ictimaiyyətə açıqlanır"]'::jsonb,
    correct_answer = 'Müraciətin bu səbəbdən mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edənə məlumat verilir',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, vətəndaşın müraciətində göstərilən məsələlər “Dövlət sirri haqqında” Azərbaycan Respublikasının Qanununa uyğun olaraq dövlət sirri təşkil edən məlumatlara və ya qanunla qorunan digər məlumatlara aid edildikdə, müraciətin məhz bu səbəbdən mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edən şəxsə rəsmi şəkildə məlumat verilir. Bu qayda dövlət təhlükəsizliyinin, hərbi və ya digər növ dövlət sirlərinin qorunması məqsədilə tətbiq olunur.',
    hint = 'Vətəndaşlar tərəfindən edilən müraciətlərdə qaldırılan məsələlər dövlət sirri və ya qanunla qorunan digər sirr təşkil etdikdə, qanunvericilik həmin məlumatların açıqlanmasını məhdudlaşdırır və bu səbəbdən müraciətin mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edən şəxsə rəsmi məlumat verilməsini tələb edir.'
WHERE id = '377ea893-c72e-42de-8bec-01ba9682a24d';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən, vətəndaşın müraciətində qaldırılan məsələ “Dövlət sirri haqqında” Azərbaycan Respublikasının Qanununa uyğun olaraq dövlət sirri təşkil edən məlumatlara aid edildikdə necə davranılır?',
    options = '["Müraciət dərhal hüquq-mühafizə orqanlarına ötürülərək vətəndaş barəsində məsuliyyət tədbirləri görülür", "Məsələnin həlli məqsədilə müraciət birbaşa beynəlxalq təşkilatlara və ya xarici nümayəndəliklərə göndərilir", "Müraciətin bu səbəbdən mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edənə məlumat verilir", "Müraciət dərhal kütləvi informasiya vasitələrində dərc edilərək ictimaiyyətə açıqlanır"]'::jsonb,
    correct_answer = 'Müraciətin bu səbəbdən mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edənə məlumat verilir',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, vətəndaşın müraciətində göstərilən məsələlər “Dövlət sirri haqqında” Azərbaycan Respublikasının Qanununa uyğun olaraq dövlət sirri təşkil edən məlumatlara və ya qanunla qorunan digər məlumatlara aid edildikdə, müraciətin məhz bu səbəbdən mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edən şəxsə rəsmi şəkildə məlumat verilir. Bu qayda dövlət təhlükəsizliyinin, hərbi və ya digər növ dövlət sirlərinin qorunması məqsədilə tətbiq olunur.',
    hint = 'Vətəndaşlar tərəfindən edilən müraciətlərdə qaldırılan məsələlər dövlət sirri və ya qanunla qorunan digər sirr təşkil etdikdə, qanunvericilik həmin məlumatların açıqlanmasını məhdudlaşdırır və bu səbəbdən müraciətin mahiyyəti üzrə cavablandırılmasının mümkünsüzlüyü barədə müraciət edən şəxsə rəsmi məlumat verilməsini tələb edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '377ea893-c72e-42de-8bec-01ba9682a24d');

-- Order 18: ID 491fedc6-40d8-40db-a8e6-92990e27205b
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, daxil olan müraciətlərin qeydiyyatı necə aparılır?',
    options = '["Daxil olduğu gün xüsusi qeydiyyat jurnalında və ya elektron informasiya sistemində", "Həftədə bir dəfə iş həftəsinin sonunda mərkəzi arxiv tərəfindən ümumiləşdirilərək", "Yalnız hesabat rübünün sonunda dövlət statistika orqanlarının ümumi siyahısında", "Yalnız orqan rəhbəri tərəfindən dərkənar qoyulduğu tarixdən etibarən 10 gün sonra"]'::jsonb,
    correct_answer = 'Daxil olduğu gün xüsusi qeydiyyat jurnalında və ya elektron informasiya sistemində',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və kargüzarlıq təlimatlarının tələblərinə əsasən, orqana daxil olan hər bir müraciət (ərizə, təklif və şikayət) mütləq şəkildə daxil olduğu gün xüsusi qeydiyyat jurnalında və ya elektron informasiya sistemində qeydiyyata alınmalıdır. Bu tələb müraciətlərin itirilməsinin qarşısının alınmasına, onların icra müddətlərinə dəqiq nəzarət edilməsinə və idarəetmədə operativliyin təmin olunmasına xidmət edir.',
    hint = 'Vətəndaşların müraciətləri ilə işləyərkən icra müddətlərinin düzgün hesablanması və nəzarətin təmin edilməsi üçün sənədlərin daxil olduq dərhal sonra – həmin gün qeydiyyata alınması qanunvericiliyin əsas tələblərindən biridir.'
WHERE id = '491fedc6-40d8-40db-a8e6-92990e27205b';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, daxil olan müraciətlərin qeydiyyatı necə aparılır?',
    options = '["Daxil olduğu gün xüsusi qeydiyyat jurnalında və ya elektron informasiya sistemində", "Həftədə bir dəfə iş həftəsinin sonunda mərkəzi arxiv tərəfindən ümumiləşdirilərək", "Yalnız hesabat rübünün sonunda dövlət statistika orqanlarının ümumi siyahısında", "Yalnız orqan rəhbəri tərəfindən dərkənar qoyulduğu tarixdən etibarən 10 gün sonra"]'::jsonb,
    correct_answer = 'Daxil olduğu gün xüsusi qeydiyyat jurnalında və ya elektron informasiya sistemində',
    explanation = '"Vətəndaşların müraciətləri haqqında" Azərbaycan Respublikası Qanununun və kargüzarlıq təlimatlarının tələblərinə əsasən, orqana daxil olan hər bir müraciət (ərizə, təklif və şikayət) mütləq şəkildə daxil olduğu gün xüsusi qeydiyyat jurnalında və ya elektron informasiya sistemində qeydiyyata alınmalıdır. Bu tələb müraciətlərin itirilməsinin qarşısının alınmasına, onların icra müddətlərinə dəqiq nəzarət edilməsinə və idarəetmədə operativliyin təmin olunmasına xidmət edir.',
    hint = 'Vətəndaşların müraciətləri ilə işləyərkən icra müddətlərinin düzgün hesablanması və nəzarətin təmin edilməsi üçün sənədlərin daxil olduq dərhal sonra – həmin gün qeydiyyata alınması qanunvericiliyin əsas tələblərindən biridir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '491fedc6-40d8-40db-a8e6-92990e27205b');

-- Order 19: ID b1186801-a502-42ac-ba76-2e45212c9912
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən hərbi qulluqçuların və onların ailə üzvlərinin müraciətlərinə ən geci hansı müddətdə baxılır?',
    options = '["Ən geci 15 təqvim günü müddətində", "Ən geci 30 təqvim günü müddətində", "Ən geci 30 iş günü müddətində", "Ən geci 15 iş günü müddətində"]'::jsonb,
    correct_answer = 'Ən geci 15 iş günü müddətində',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 10.3-cü maddəsinə əsasən, hərbi qulluqçuların və onların ailə üzvlərinin müraciətlərinə daxil olduğu gündən etibarən ən geci 15 iş günü ərzində baxılır. İmtahanlarda ən çox rast gəlinən səhvlərdən biri rəqəmi (15) bildikdə təqvim günü seçimidir; lakin qanunvericilikdə müddət qəti şəkildə iş günü olaraq müəyyən edilmişdir.',
    hint = 'Qanunvericilikdə hərbi qulluqçuların müraciətləri üçün xüsusi müddət nəzərdə tutulmuşdur və bu müddət təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.'
WHERE id = 'b1186801-a502-42ac-ba76-2e45212c9912';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən hərbi qulluqçuların və onların ailə üzvlərinin müraciətlərinə ən geci hansı müddətdə baxılır?',
    options = '["Ən geci 15 təqvim günü müddətində", "Ən geci 30 təqvim günü müddətində", "Ən geci 30 iş günü müddətində", "Ən geci 15 iş günü müddətində"]'::jsonb,
    correct_answer = 'Ən geci 15 iş günü müddətində',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 10.3-cü maddəsinə əsasən, hərbi qulluqçuların və onların ailə üzvlərinin müraciətlərinə daxil olduğu gündən etibarən ən geci 15 iş günü ərzində baxılır. İmtahanlarda ən çox rast gəlinən səhvlərdən biri rəqəmi (15) bildikdə təqvim günü seçimidir; lakin qanunvericilikdə müddət qəti şəkildə iş günü olaraq müəyyən edilmişdir.',
    hint = 'Qanunvericilikdə hərbi qulluqçuların müraciətləri üçün xüsusi müddət nəzərdə tutulmuşdur və bu müddət təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'b1186801-a502-42ac-ba76-2e45212c9912');

-- Order 20: ID 6f1f8d1b-e9b7-48ae-a49b-6786e33e9da5
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, müraciətə baxılması üçün əlavə məlumatların əldə edilməsi və ya aidiyyəti üzrə sorğu göndərilməsi tələb edildikdə, müraciətə baxılması müddəti ən çoxu nə qədər uzadıla bilər?',
    options = '["Ən çoxu 30 təqvim günü", "Ən çoxu 15 iş günü", "Ən çoxu 15 təqvim günü", "Ən çoxu 30 iş günü"]'::jsonb,
    correct_answer = 'Ən çoxu 30 iş günü',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 10.2-ci maddəsinə əsasən, müraciətə baxılması üçün əlavə məlumatların əldə edilməsi, yaxud aidiyyəti üzrə sorğu göndərilməsi tələb olunduqda, müraciətə baxılan subyektin vəzifəli şəxsi həmin müddəti **ən çoxu 30 iş günü** uzada bilər. Bu barədə müraciət edən şəxsə mütləq məlumat verilir. İmtahanlarda (DİM standartlarında) ən çox rast gəlinən yayındırıcı üsul rəqəmi düzgün verib sonunu "təqvim günü" yazmaqdır, lakin qanunvericilikdə bu müddət qəti olaraq iş günü ilə tənzimlənir.',
    hint = 'Qanunvericiliyə əsasən, əlavə məlumatların əldə olunması və ya sorğuların cavablandırılması zərurəti yarandıqda səlahiyyətli şəxs ümumi baxılma müddətini müəyyən edilmiş qaydada uzada bilər və bu müddət təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.'
WHERE id = '6f1f8d1b-e9b7-48ae-a49b-6786e33e9da5';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, müraciətə baxılması üçün əlavə məlumatların əldə edilməsi və ya aidiyyəti üzrə sorğu göndərilməsi tələb edildikdə, müraciətə baxılması müddəti ən çoxu nə qədər uzadıla bilər?',
    options = '["Ən çoxu 30 təqvim günü", "Ən çoxu 15 iş günü", "Ən çoxu 15 təqvim günü", "Ən çoxu 30 iş günü"]'::jsonb,
    correct_answer = 'Ən çoxu 30 iş günü',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 10.2-ci maddəsinə əsasən, müraciətə baxılması üçün əlavə məlumatların əldə edilməsi, yaxud aidiyyəti üzrə sorğu göndərilməsi tələb olunduqda, müraciətə baxılan subyektin vəzifəli şəxsi həmin müddəti **ən çoxu 30 iş günü** uzada bilər. Bu barədə müraciət edən şəxsə mütləq məlumat verilir. İmtahanlarda (DİM standartlarında) ən çox rast gəlinən yayındırıcı üsul rəqəmi düzgün verib sonunu "təqvim günü" yazmaqdır, lakin qanunvericilikdə bu müddət qəti olaraq iş günü ilə tənzimlənir.',
    hint = 'Qanunvericiliyə əsasən, əlavə məlumatların əldə olunması və ya sorğuların cavablandırılması zərurəti yarandıqda səlahiyyətli şəxs ümumi baxılma müddətini müəyyən edilmiş qaydada uzada bilər və bu müddət təqvim günləri ilə deyil, məhz iş günləri ilə hesablanır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '6f1f8d1b-e9b7-48ae-a49b-6786e33e9da5');

-- Order 21: ID 45d356a2-1f66-4be0-8fa1-410266ed4d85
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, müraciətə baxılması müddətlərinin axımı hansı gündən başlayır?',
    options = '["Müraciətin birbaşa təyin olunmuş icraçıya faktiki çatdırıldığı tarixdən etibarən 3-cü iş günündən", "Vətəndaşın ərizəni, təklifi və ya şikayəti şəxsən tərtib edərək imzaladığı tarixdən", "Müraciətin müraciətə baxan subyektə daxil olduğu gündən", "Müraciətin poçt şöbəsinə təqdim edilərək sifarişli poçtla göndərildiyi tarixdən"]'::jsonb,
    correct_answer = 'Müraciətin müraciətə baxan subyektə daxil olduğu gündən',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 10.5-ci maddəsinə əsasən, Qanunun 10.1–10.3-cü maddələrində göstərilən müddətlərin axımı müraciətin müraciətə baxan subyektə daxil olduğu gündən başlanır. Bu hüquqi norma onu göstərir ki, müddətin hesablanması müraciətin poçt vasitəsilə göndərildiyi və ya vətəndaş tərəfindən evdə yazıldığı vaxtdan deyil, məhz müvafiq dövlət və ya bələdiyyə orqanının (subyektin) qapısından içəri daxil olduğu (qəbul edildiyi) tarixdən etibarən başlanır.',
    hint = 'Qanunvericiliyə əsasən, müraciətlərin baxılması üçün nəzərdə tutulmuş müddətlərin hesablanması (axımı) vətəndaşın müraciəti yazdığı tarixdən və ya poçta verdiyi gündən deyil, birbaşa səlahiyyətli quruma daxil olduğu andan etibarən hesablanmağa başlayır.'
WHERE id = '45d356a2-1f66-4be0-8fa1-410266ed4d85';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, müraciətə baxılması müddətlərinin axımı hansı gündən başlayır?',
    options = '["Müraciətin birbaşa təyin olunmuş icraçıya faktiki çatdırıldığı tarixdən etibarən 3-cü iş günündən", "Vətəndaşın ərizəni, təklifi və ya şikayəti şəxsən tərtib edərək imzaladığı tarixdən", "Müraciətin müraciətə baxan subyektə daxil olduğu gündən", "Müraciətin poçt şöbəsinə təqdim edilərək sifarişli poçtla göndərildiyi tarixdən"]'::jsonb,
    correct_answer = 'Müraciətin müraciətə baxan subyektə daxil olduğu gündən',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 10.5-ci maddəsinə əsasən, Qanunun 10.1–10.3-cü maddələrində göstərilən müddətlərin axımı müraciətin müraciətə baxan subyektə daxil olduğu gündən başlanır. Bu hüquqi norma onu göstərir ki, müddətin hesablanması müraciətin poçt vasitəsilə göndərildiyi və ya vətəndaş tərəfindən evdə yazıldığı vaxtdan deyil, məhz müvafiq dövlət və ya bələdiyyə orqanının (subyektin) qapısından içəri daxil olduğu (qəbul edildiyi) tarixdən etibarən başlanır.',
    hint = 'Qanunvericiliyə əsasən, müraciətlərin baxılması üçün nəzərdə tutulmuş müddətlərin hesablanması (axımı) vətəndaşın müraciəti yazdığı tarixdən və ya poçta verdiyi gündən deyil, birbaşa səlahiyyətli quruma daxil olduğu andan etibarən hesablanmağa başlayır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '45d356a2-1f66-4be0-8fa1-410266ed4d85');

-- Order 22: ID b8285e12-c90d-4071-9a0d-80ba56a12221
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən aidiyyəti üzrə olmayan yazılı müraciət neçə iş günü müddətində aidiyyəti üzrə göndərilir?',
    options = '["Ən geci 3 iş günü müddətində", "Ən geci 1 iş günü müddətində", "Ən geci 5 iş günü müddətində", "Ən geci 7 gün müddətində"]'::jsonb,
    correct_answer = 'Ən geci 5 iş günü müddətində',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, müraciətə baxan subyektə daxil olmuş yazılı müraciətdə qaldırılmış məsələlər onun səlahiyyətlərinə aid olmadıqda, həmin müraciət ən geci **5 iş günü** müddətində aidiyyəti üzrə göndərilir və bu barədə müraciət edənə dərhal (və ya qanunla müəyyən edilmiş qaydada) məlumat verilir. İmtahanlarda tez-tez rəqəmlər (3, 7, 10 gün) dəyişdirilərək namizədlər sınanılır, lakin qanunvericilikdə bu müddət qəti olaraq 5 iş günü müəyyən edilmişdir.',
    hint = 'Qanunvericiliyə əsasən, daxil olmuş müraciətin qaldırılan məsələlər üzrə səlahiyyətli quruma (aidiyyəti üzrə) göndərilməsi üçün qısa və dəqiq müddət nəzərdə tutulmuşdur və bu müddət iş günləri ilə hesablanır.'
WHERE id = 'b8285e12-c90d-4071-9a0d-80ba56a12221';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən aidiyyəti üzrə olmayan yazılı müraciət neçə iş günü müddətində aidiyyəti üzrə göndərilir?',
    options = '["Ən geci 3 iş günü müddətində", "Ən geci 1 iş günü müddətində", "Ən geci 5 iş günü müddətində", "Ən geci 7 gün müddətində"]'::jsonb,
    correct_answer = 'Ən geci 5 iş günü müddətində',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, müraciətə baxan subyektə daxil olmuş yazılı müraciətdə qaldırılmış məsələlər onun səlahiyyətlərinə aid olmadıqda, həmin müraciət ən geci **5 iş günü** müddətində aidiyyəti üzrə göndərilir və bu barədə müraciət edənə dərhal (və ya qanunla müəyyən edilmiş qaydada) məlumat verilir. İmtahanlarda tez-tez rəqəmlər (3, 7, 10 gün) dəyişdirilərək namizədlər sınanılır, lakin qanunvericilikdə bu müddət qəti olaraq 5 iş günü müəyyən edilmişdir.',
    hint = 'Qanunvericiliyə əsasən, daxil olmuş müraciətin qaldırılan məsələlər üzrə səlahiyyətli quruma (aidiyyəti üzrə) göndərilməsi üçün qısa və dəqiq müddət nəzərdə tutulmuşdur və bu müddət iş günləri ilə hesablanır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'b8285e12-c90d-4071-9a0d-80ba56a12221');

-- Order 23: ID b211d34e-1a70-43d3-831c-8d4ec1b5c455
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, vətəndaşların müraciətlərinə baxılmasının nəticəsi olaraq verilən rəsmi cavab hansı dildə tərtib olunmalıdır?',
    options = '["Müraciət edən şəxsin şəxsi istəyinə və ya müraciətin təqdim olunduğu dildən asılı olaraq istənilən xarici dildə", "Azərbaycan Respublikasının dövlət dilində", "Beynəlxalq standartlara və diplomatik qaydalara əsasən sərbəst olaraq istənilən beynəlxalq dildə", "Yalnız yerli bələdiyyə orqanının və ya idarə rəhbərinin qərarı ilə seçilən hər hansı regional dildə"]'::jsonb,
    correct_answer = 'Azərbaycan Respublikasının dövlət dilində',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi ilə əlaqədar qəbul edilmiş kargüzarlıq qaydalarına və “Azərbaycan Respublikasında dövlət dili haqqında” Qanuna əsasən, dövlət və bələdiyyə orqanlarında, büdcə təşkilatlarında və digər müraciətə baxan subyektlərdə vətəndaşların müraciətlərinə verilən cavablar məhz Azərbaycan Respublikasının **dövlət dilində** tərtib olunmalıdır. Rəsmi kargüzarlıq və sənəd dövriyyəsi dövlət dilinin tətbiqi qaydalarına tam riayət olunmaqla həyata keçirilir.',
    hint = 'Azərbaycan Respublikasında dövlət və bələdiyyə orqanlarının, eləcə də digər müraciətə baxan subyektlərin fəaliyyətində rəsmi yazışmalar və vətəndaşların müraciətlərinə verilən cavablar "Azərbaycan Respublikasında dövlət dili haqqında" Qanunun və kargüzarlıq təlimatlarının tələblərinə uyğun olaraq tənzimlənir.'
WHERE id = 'b211d34e-1a70-43d3-831c-8d4ec1b5c455';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, vətəndaşların müraciətlərinə baxılmasının nəticəsi olaraq verilən rəsmi cavab hansı dildə tərtib olunmalıdır?',
    options = '["Müraciət edən şəxsin şəxsi istəyinə və ya müraciətin təqdim olunduğu dildən asılı olaraq istənilən xarici dildə", "Azərbaycan Respublikasının dövlət dilində", "Beynəlxalq standartlara və diplomatik qaydalara əsasən sərbəst olaraq istənilən beynəlxalq dildə", "Yalnız yerli bələdiyyə orqanının və ya idarə rəhbərinin qərarı ilə seçilən hər hansı regional dildə"]'::jsonb,
    correct_answer = 'Azərbaycan Respublikasının dövlət dilində',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi ilə əlaqədar qəbul edilmiş kargüzarlıq qaydalarına və “Azərbaycan Respublikasında dövlət dili haqqında” Qanuna əsasən, dövlət və bələdiyyə orqanlarında, büdcə təşkilatlarında və digər müraciətə baxan subyektlərdə vətəndaşların müraciətlərinə verilən cavablar məhz Azərbaycan Respublikasının **dövlət dilində** tərtib olunmalıdır. Rəsmi kargüzarlıq və sənəd dövriyyəsi dövlət dilinin tətbiqi qaydalarına tam riayət olunmaqla həyata keçirilir.',
    hint = 'Azərbaycan Respublikasında dövlət və bələdiyyə orqanlarının, eləcə də digər müraciətə baxan subyektlərin fəaliyyətində rəsmi yazışmalar və vətəndaşların müraciətlərinə verilən cavablar "Azərbaycan Respublikasında dövlət dili haqqında" Qanunun və kargüzarlıq təlimatlarının tələblərinə uyğun olaraq tənzimlənir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'b211d34e-1a70-43d3-831c-8d4ec1b5c455');

-- Order 24: ID cd5af45d-350f-444a-9987-d32ac7f38f29
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və vətəndaşların qəbulu qaydalarına əsasən, şifahi müraciətin edilməsi və ya qəbul zamanı vətəndaş nəyi təqdim etməlidir?',
    options = '["Məhkumluğun olmaması barədə rəsmi arayışı", "Şəxsiyyətini təsdiq edən sənədi", "Əmək kitabçasını və ya iş yerindən arayışı", "Ali təhsil haqqında diplomu və ya şəhadətnaməni"]'::jsonb,
    correct_answer = 'Şəxsiyyətini təsdiq edən sənədi',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi ilə əlaqədar qəbul edilmiş normativ hüquqi aktların (o cümlədən qəbul qaydalarının) tələblərinə əsasən, qəbula yazılmış vətəndaş qəbul günü **şəxsiyyətini təsdiq edən sənədi** (şəxsiyyət vəsiqəsini) təqdim etməlidir. Əgər qəbula vətəndaşın nümayəndəsi gələrsə, o zaman şəxsiyyət vəsiqəsi ilə yanaşı səlahiyyətlərini təsdiq edən sənəd də tələb olunur. Bu tələb müraciət edən şəxslərin dəqiq müəyyən edilməsi və qanuni prosedurların düzgün aparılması üçün vacibdir.',
    hint = 'Dövlət və bələdiyyə orqanlarında vətəndaşların fərdi və ya kollektiv qəbulu həyata keçirilərkən, müraciət edən şəxsin kimliyinin müəyyənləşdirilməsi və qeydiyyatın aparılması məqsədilə xüsusi sənəd tələb olunur.'
WHERE id = 'cd5af45d-350f-444a-9987-d32ac7f38f29';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və vətəndaşların qəbulu qaydalarına əsasən, şifahi müraciətin edilməsi və ya qəbul zamanı vətəndaş nəyi təqdim etməlidir?',
    options = '["Məhkumluğun olmaması barədə rəsmi arayışı", "Şəxsiyyətini təsdiq edən sənədi", "Əmək kitabçasını və ya iş yerindən arayışı", "Ali təhsil haqqında diplomu və ya şəhadətnaməni"]'::jsonb,
    correct_answer = 'Şəxsiyyətini təsdiq edən sənədi',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi ilə əlaqədar qəbul edilmiş normativ hüquqi aktların (o cümlədən qəbul qaydalarının) tələblərinə əsasən, qəbula yazılmış vətəndaş qəbul günü **şəxsiyyətini təsdiq edən sənədi** (şəxsiyyət vəsiqəsini) təqdim etməlidir. Əgər qəbula vətəndaşın nümayəndəsi gələrsə, o zaman şəxsiyyət vəsiqəsi ilə yanaşı səlahiyyətlərini təsdiq edən sənəd də tələb olunur. Bu tələb müraciət edən şəxslərin dəqiq müəyyən edilməsi və qanuni prosedurların düzgün aparılması üçün vacibdir.',
    hint = 'Dövlət və bələdiyyə orqanlarında vətəndaşların fərdi və ya kollektiv qəbulu həyata keçirilərkən, müraciət edən şəxsin kimliyinin müəyyənləşdirilməsi və qeydiyyatın aparılması məqsədilə xüsusi sənəd tələb olunur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'cd5af45d-350f-444a-9987-d32ac7f38f29');

-- Order 25: ID 7bdbefed-b78f-4b6d-8c96-e8e6cb3947a1
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən anonim müraciətlərlə bağlı hansı hüquqi qayda müəyyən edilmişdir?',
    options = '["Dərhal araşdırılması üçün Daxili İşlər Nazirliyinə göndərilir", "İctimaiyyətin məlumatlandırılması məqsədilə kütləvi informasiya vasitələrində dərc olunur", "Hüquqi qüvvəsi olmadığı üçün dərhal arxivləşdirilərək 5 il müddətində saxlanılır", "Qəbul edilmir və onlara baxılmır"]'::jsonb,
    correct_answer = 'Qəbul edilmir və onlara baxılmır',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə (6.4-cü bəndinə) əsasən, “anonim” müraciətlər (yəni vətəndaşın soyadı, adı, atasının adı, ünvanı, şəxsi və ya elektron imzası göstərilməyən yazılı müraciətlər) müraciətə baxan subyektlər və onların vəzifəli şəxsləri tərəfindən **qəbul edilmir və onlara baxılmır**. Bu norma dövlət orqanlarının resurslarının əsassız və məsuliyyətsiz müraciətlərə sərf olunmasının qarşısını almaq məqsədi daşıyır.',
    hint = 'Qanunvericiliyə görə, müraciətdə vətəndaşın soyadı, adı, atasının adı, ünvanı və ya elektron imzası göstərilmədikdə həmin müraciət anonim hesab edilir və dövlət qurumları tərəfindən onunla bağlı xüsusi prosedur tətbiq olunur.'
WHERE id = '7bdbefed-b78f-4b6d-8c96-e8e6cb3947a1';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən anonim müraciətlərlə bağlı hansı hüquqi qayda müəyyən edilmişdir?',
    options = '["Dərhal araşdırılması üçün Daxili İşlər Nazirliyinə göndərilir", "İctimaiyyətin məlumatlandırılması məqsədilə kütləvi informasiya vasitələrində dərc olunur", "Hüquqi qüvvəsi olmadığı üçün dərhal arxivləşdirilərək 5 il müddətində saxlanılır", "Qəbul edilmir və onlara baxılmır"]'::jsonb,
    correct_answer = 'Qəbul edilmir və onlara baxılmır',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə (6.4-cü bəndinə) əsasən, “anonim” müraciətlər (yəni vətəndaşın soyadı, adı, atasının adı, ünvanı, şəxsi və ya elektron imzası göstərilməyən yazılı müraciətlər) müraciətə baxan subyektlər və onların vəzifəli şəxsləri tərəfindən **qəbul edilmir və onlara baxılmır**. Bu norma dövlət orqanlarının resurslarının əsassız və məsuliyyətsiz müraciətlərə sərf olunmasının qarşısını almaq məqsədi daşıyır.',
    hint = 'Qanunvericiliyə görə, müraciətdə vətəndaşın soyadı, adı, atasının adı, ünvanı və ya elektron imzası göstərilmədikdə həmin müraciət anonim hesab edilir və dövlət qurumları tərəfindən onunla bağlı xüsusi prosedur tətbiq olunur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '7bdbefed-b78f-4b6d-8c96-e8e6cb3947a1');

-- Order 26: ID 67c722f0-806d-48f6-a8c3-58fd126c21dd
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən vətəndaşların müraciət etmək hüququ hansı formalarda həyata keçirilir?',
    options = '["Yalnız dövlət qulluqçularının iştirakı və razılığı ilə tərtib edilmiş yazılı formada", "Fərdi və ya kollektiv şəkildə yazılı, şifahi və ya elektron formada", "Yalnız notariat kontorlarında təsdiqlənmiş xüsusi kağız daşıyıcılarda", "Yalnız lisenziyalı vəkil və ya peşəkar hüquqşünas vasitəsilə rəsmi elektron formada"]'::jsonb,
    correct_answer = 'Fərdi və ya kollektiv şəkildə yazılı, şifahi və ya elektron formada',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, vətəndaşların müraciət etmək hüququ **fərdi və ya kollektiv şəkildə yazılı, şifahi və ya elektron formada** həyata keçirilir. Bu norma vətəndaşlara dövlət orqanlarına müraciət edərkən özlərinə ən əlverici və uyğun olan üsulu (istər sənəd şəklində yazılı, istərsə onlayn elektron formada, yaxud şəxsi qəbul zamanı şifahi şəkildə) seçmək imkanı qazandırır.',
    hint = 'Qanunvericilik vətəndaşlara dövlət orqanları, yerli özünüidarəetmə qurumları və digər subyektlərlə əlaqə qurarkən həm təkbaşına, həm də qrup halında müxtəlif üsullardan (kağız, elektron və ya canlı ünsiyyət vasitəsilə) istifadə etmək hüququ tanıyır.'
WHERE id = '67c722f0-806d-48f6-a8c3-58fd126c21dd';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən vətəndaşların müraciət etmək hüququ hansı formalarda həyata keçirilir?',
    options = '["Yalnız dövlət qulluqçularının iştirakı və razılığı ilə tərtib edilmiş yazılı formada", "Fərdi və ya kollektiv şəkildə yazılı, şifahi və ya elektron formada", "Yalnız notariat kontorlarında təsdiqlənmiş xüsusi kağız daşıyıcılarda", "Yalnız lisenziyalı vəkil və ya peşəkar hüquqşünas vasitəsilə rəsmi elektron formada"]'::jsonb,
    correct_answer = 'Fərdi və ya kollektiv şəkildə yazılı, şifahi və ya elektron formada',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə əsasən, vətəndaşların müraciət etmək hüququ **fərdi və ya kollektiv şəkildə yazılı, şifahi və ya elektron formada** həyata keçirilir. Bu norma vətəndaşlara dövlət orqanlarına müraciət edərkən özlərinə ən əlverici və uyğun olan üsulu (istər sənəd şəklində yazılı, istərsə onlayn elektron formada, yaxud şəxsi qəbul zamanı şifahi şəkildə) seçmək imkanı qazandırır.',
    hint = 'Qanunvericilik vətəndaşlara dövlət orqanları, yerli özünüidarəetmə qurumları və digər subyektlərlə əlaqə qurarkən həm təkbaşına, həm də qrup halında müxtəlif üsullardan (kağız, elektron və ya canlı ünsiyyət vasitəsilə) istifadə etmək hüququ tanıyır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '67c722f0-806d-48f6-a8c3-58fd126c21dd');

-- Order 27: ID 695c5efe-f9be-4b6d-b964-3b1381bb68c1
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, müraciətdə irəli sürülən məsələlər tam həll olunduqda müraciət necə hesab edilir?',
    options = '["Baxılmamış saxlanılmış", "Rədd edilmiş", "Qismən təmin edilmiş", "Təmin edilmiş"]'::jsonb,
    correct_answer = 'Təmin edilmiş',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi və kargüzarlıq təlimatlarının tələblərinə əsasən, müraciətdə irəli sürülən məsələlər və tələblər səlahiyyətli orqan tərəfindən tam şəkildə araşdırılaraq müsbət həll olunduqda həmin müraciət **təmin edilmiş** hesab olunur. Əgər qaldırılan məsələlər yalnız müəyyən hissədə həllini tapırsa, "qismən təmin edilmiş", qanuni əsaslar mövcud olmadıqda isə "rədd edilmiş" hesab olunur.',
    hint = 'Vətəndaşların müraciətlərinə baxılmasının nəticələri təsnif edilərkən, qaldırılan tələblərin və ya məsələlərin mahiyyəti üzrə tam yerinə yetirildiyi hallarda müvafiq hüquqi status verilir.'
WHERE id = '695c5efe-f9be-4b6d-b964-3b1381bb68c1';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, müraciətdə irəli sürülən məsələlər tam həll olunduqda müraciət necə hesab edilir?',
    options = '["Baxılmamış saxlanılmış", "Rədd edilmiş", "Qismən təmin edilmiş", "Təmin edilmiş"]'::jsonb,
    correct_answer = 'Təmin edilmiş',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi və kargüzarlıq təlimatlarının tələblərinə əsasən, müraciətdə irəli sürülən məsələlər və tələblər səlahiyyətli orqan tərəfindən tam şəkildə araşdırılaraq müsbət həll olunduqda həmin müraciət **təmin edilmiş** hesab olunur. Əgər qaldırılan məsələlər yalnız müəyyən hissədə həllini tapırsa, "qismən təmin edilmiş", qanuni əsaslar mövcud olmadıqda isə "rədd edilmiş" hesab olunur.',
    hint = 'Vətəndaşların müraciətlərinə baxılmasının nəticələri təsnif edilərkən, qaldırılan tələblərin və ya məsələlərin mahiyyəti üzrə tam yerinə yetirildiyi hallarda müvafiq hüquqi status verilir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '695c5efe-f9be-4b6d-b964-3b1381bb68c1');

-- Order 28: ID c4187ad0-ab75-48d2-9d52-8158588e7711
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərini pozan vəzifəli şəxslər qanunvericiliklə müəyyən edilmiş qaydada hansı növ məsuliyyət daşıyırlar?',
    options = '["Yalnız iş yeri üzrə kollektiv qarşısında ictimai qınaq və ya daxili xəbərdarlıq", "Qanunvericiliyə əsasən heç bir hüquqi məsuliyyət daşımırlar", "Yalnız yerli təşkilat daxilində verilən intizam xarakterli töhmət cəzası", "İntizam, mülki, inzibati və ya cinayət məsuliyyəti"]'::jsonb,
    correct_answer = 'İntizam, mülki, inzibati və ya cinayət məsuliyyəti',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə (Məsuliyyət) əsasən, bu Qanunun tələblərini pozan fiziki və hüquqi şəxslər, habelə vəzifəli şəxslər törətdikləri hüquq pozuntusunun xarakterindən asılı olaraq qanunvericiliklə müəyyən edilmiş qaydada **intizam, mülki, inzibati və ya cinayət məsuliyyəti** daşıyırlar. Bu norma dövlət orqanlarında icra intizamının möhkəmləndirilməsinə, vətəndaşların hüquq və azadlıqlarının etibarlı qorunmasına xidmət edir.',
    hint = 'Azərbaycan Respublikasının qanunvericiliyinə əsasən, müraciətlər haqqında qanunvericiliyin pozulması (məsələn, baxılma müddətlərinin əsassız pozulması, müraciətlərə qanunsuz olaraq baxılmaması, bürokratik surəngüzəşt və s.) vəzifəli şəxslərin hüquqi məsuliyyətə cəlb edilməsi üçün əsas yaradır.'
WHERE id = 'c4187ad0-ab75-48d2-9d52-8158588e7711';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərini pozan vəzifəli şəxslər qanunvericiliklə müəyyən edilmiş qaydada hansı növ məsuliyyət daşıyırlar?',
    options = '["Yalnız iş yeri üzrə kollektiv qarşısında ictimai qınaq və ya daxili xəbərdarlıq", "Qanunvericiliyə əsasən heç bir hüquqi məsuliyyət daşımırlar", "Yalnız yerli təşkilat daxilində verilən intizam xarakterli töhmət cəzası", "İntizam, mülki, inzibati və ya cinayət məsuliyyəti"]'::jsonb,
    correct_answer = 'İntizam, mülki, inzibati və ya cinayət məsuliyyəti',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə (Məsuliyyət) əsasən, bu Qanunun tələblərini pozan fiziki və hüquqi şəxslər, habelə vəzifəli şəxslər törətdikləri hüquq pozuntusunun xarakterindən asılı olaraq qanunvericiliklə müəyyən edilmiş qaydada **intizam, mülki, inzibati və ya cinayət məsuliyyəti** daşıyırlar. Bu norma dövlət orqanlarında icra intizamının möhkəmləndirilməsinə, vətəndaşların hüquq və azadlıqlarının etibarlı qorunmasına xidmət edir.',
    hint = 'Azərbaycan Respublikasının qanunvericiliyinə əsasən, müraciətlər haqqında qanunvericiliyin pozulması (məsələn, baxılma müddətlərinin əsassız pozulması, müraciətlərə qanunsuz olaraq baxılmaması, bürokratik surəngüzəşt və s.) vəzifəli şəxslərin hüquqi məsuliyyətə cəlb edilməsi üçün əsas yaradır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'c4187ad0-ab75-48d2-9d52-8158588e7711');

-- Order 29: ID a8613b03-a2e0-4de8-ad33-280e1032d2da
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, müraciətə baxan subyektlər tərəfindən vətəndaşların qəbulu ən azı hansı dövriliklə təşkil olunmalıdır?',
    options = '["Rübdə bir dəfə", "Ayda ən azı bir dəfə", "İldə iki dəfə", "Həftədə bir dəfə"]'::jsonb,
    correct_answer = 'Ayda ən azı bir dəfə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 11.1-ci maddəsinə əsasən, müraciətə baxan subyektlər vətəndaşların qəbul edilməsini vətəndaşların qəbulu cədvəlinə uyğun olaraq **ayda bir dəfədən az olmamaqla** təmin etməlidirlər. Bu tələb dövlət idarəçiliyində vətəndaşlarla birbaşa əlaqənin saxlanılması və onların qaldırdıqları məsələlərin yerində dinlənilməsi üçün qanunvericiliklə müəyyən edilmiş məcburi minimal normadır.',
    hint = 'Qanunvericiliyə əsasən, dövlət və bələdiyyə orqanlarının, habelə digər müraciətə baxan subyektlərin rəhbərləri və ya digər səlahiyyətli vəzifəli şəxsləri vətəndaşların qəbulunu xüsusi cədvələ uyğun olaraq müəyyən edilmiş minimal vaxt intervalı ilə həyata keçirməlidirlər.'
WHERE id = 'a8613b03-a2e0-4de8-ad33-280e1032d2da';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən, müraciətə baxan subyektlər tərəfindən vətəndaşların qəbulu ən azı hansı dövriliklə təşkil olunmalıdır?',
    options = '["Rübdə bir dəfə", "Ayda ən azı bir dəfə", "İldə iki dəfə", "Həftədə bir dəfə"]'::jsonb,
    correct_answer = 'Ayda ən azı bir dəfə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun 11.1-ci maddəsinə əsasən, müraciətə baxan subyektlər vətəndaşların qəbul edilməsini vətəndaşların qəbulu cədvəlinə uyğun olaraq **ayda bir dəfədən az olmamaqla** təmin etməlidirlər. Bu tələb dövlət idarəçiliyində vətəndaşlarla birbaşa əlaqənin saxlanılması və onların qaldırdıqları məsələlərin yerində dinlənilməsi üçün qanunvericiliklə müəyyən edilmiş məcburi minimal normadır.',
    hint = 'Qanunvericiliyə əsasən, dövlət və bələdiyyə orqanlarının, habelə digər müraciətə baxan subyektlərin rəhbərləri və ya digər səlahiyyətli vəzifəli şəxsləri vətəndaşların qəbulunu xüsusi cədvələ uyğun olaraq müəyyən edilmiş minimal vaxt intervalı ilə həyata keçirməlidirlər.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'a8613b03-a2e0-4de8-ad33-280e1032d2da');

-- Order 30: ID dc10096e-d60b-46c8-8212-ee23a3e0712e
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən təkrar müraciətlərə baxılmanın xüsusiyyəti nədən ibarətdir?',
    options = '["Təkrar müraciət dərhal məhkəməyə baxılması üçün birbaşa aidiyyəti məhkəmə instansiyasına göndərilir", "Hər təkrar müraciət üçün qurum daxilində mütləq yeni xüsusi komissiya yaradılmalıdır", "Təkrar müraciətin qeydiyyata alınması və baxılması üçün vətəndaşdan dövlət rüsumu tutulur", "Bir il ərzində eyni şəxsin eyni məsələ ilə bağlı müraciətinə üç dəfə əsaslandırılmış cavab verildikdə və təkrar müraciətdə yeni məlumat (dəlil, sübut) olmadıqda əvvəlki cavab təsdiq edilir və ya müraciət baxılmamış saxlanılır"]'::jsonb,
    correct_answer = 'Bir il ərzində eyni şəxsin eyni məsələ ilə bağlı müraciətinə üç dəfə əsaslandırılmış cavab verildikdə və təkrar müraciətdə yeni məlumat (dəlil, sübut) olmadıqda əvvəlki cavab təsdiq edilir və ya müraciət baxılmamış saxlanılır',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, bir il ərzində eyni şəxsin eyni məsələ ilə bağlı müraciətinə 3 dəfə əsaslandırılmış cavab verildikdə və növbəti təkrar müraciətdə məsələnin həlli üçün hər hansı yeni məlumat, dəlil və ya sübut olmadıqda, müraciətə baxan subyekt həmin müraciətə baxılmasının dayandırılması (baxılmamış saxlanılması) barədə qərar qəbul edə bilər və ya əvvəlki cavab məktubuna istinad edilir. Bu norma idarəetmədə təkrarçılığın və resursların səmərəsiz sərf olunmasının qarşısını alır.',
    hint = 'Qanunvericilik eyni məsələ ilə bağlı ardıcıl olaraq edilən və heç bir yeni hüquqi əsas, dəlil və ya sübut ehtiva etməyən müraciətlərin dövlət qurumlarının iş yükünü əsassız artırmasının qarşısını almaq üçün xüsusi tənzimləmə nəzərdə tutur.'
WHERE id = 'dc10096e-d60b-46c8-8212-ee23a3e0712e';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən təkrar müraciətlərə baxılmanın xüsusiyyəti nədən ibarətdir?',
    options = '["Təkrar müraciət dərhal məhkəməyə baxılması üçün birbaşa aidiyyəti məhkəmə instansiyasına göndərilir", "Hər təkrar müraciət üçün qurum daxilində mütləq yeni xüsusi komissiya yaradılmalıdır", "Təkrar müraciətin qeydiyyata alınması və baxılması üçün vətəndaşdan dövlət rüsumu tutulur", "Bir il ərzində eyni şəxsin eyni məsələ ilə bağlı müraciətinə üç dəfə əsaslandırılmış cavab verildikdə və təkrar müraciətdə yeni məlumat (dəlil, sübut) olmadıqda əvvəlki cavab təsdiq edilir və ya müraciət baxılmamış saxlanılır"]'::jsonb,
    correct_answer = 'Bir il ərzində eyni şəxsin eyni məsələ ilə bağlı müraciətinə üç dəfə əsaslandırılmış cavab verildikdə və təkrar müraciətdə yeni məlumat (dəlil, sübut) olmadıqda əvvəlki cavab təsdiq edilir və ya müraciət baxılmamış saxlanılır',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tələblərinə əsasən, bir il ərzində eyni şəxsin eyni məsələ ilə bağlı müraciətinə 3 dəfə əsaslandırılmış cavab verildikdə və növbəti təkrar müraciətdə məsələnin həlli üçün hər hansı yeni məlumat, dəlil və ya sübut olmadıqda, müraciətə baxan subyekt həmin müraciətə baxılmasının dayandırılması (baxılmamış saxlanılması) barədə qərar qəbul edə bilər və ya əvvəlki cavab məktubuna istinad edilir. Bu norma idarəetmədə təkrarçılığın və resursların səmərəsiz sərf olunmasının qarşısını alır.',
    hint = 'Qanunvericilik eyni məsələ ilə bağlı ardıcıl olaraq edilən və heç bir yeni hüquqi əsas, dəlil və ya sübut ehtiva etməyən müraciətlərin dövlət qurumlarının iş yükünü əsassız artırmasının qarşısını almaq üçün xüsusi tənzimləmə nəzərdə tutur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'dc10096e-d60b-46c8-8212-ee23a3e0712e');

-- Order 31: ID 09ce702d-92ba-4c96-bab3-2bac1eb63191
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, kollektiv müraciətə verilən cavab kimə göndərilir?',
    options = '["Müraciət edənlərin hamısına ayrı-ayrılıqda məcburi qaydada fərdi məktub şəklində", "Yalnız həmin ərazinin yerli bələdiyyə sədrinə və ya icra nümayəndəsinə", "Müraciətdə göstərilən birinci şəxsə və ya müraciət edənlərin müəyyən etdiyi nümayəndəyə", "Dövlət İmtahan Mərkəzinin müvafiq normativ komissiyasına"]'::jsonb,
    correct_answer = 'Müraciətdə göstərilən birinci şəxsə və ya müraciət edənlərin müəyyən etdiyi nümayəndəyə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi və kargüzarlıq qaydalarına əsasən, kollektiv müraciətə (iki və daha çox şəxsin birgə müraciətinə) verilən cavab məktubu müraciətdə göstərilən **birinci şəxsə və ya müraciət edənlərin müəyyən etdiyi nümayəndəyə** göndərilir. Bu hüquqi norma dövlət orqanlarının eyni məsələ ilə bağlı hər bir vətəndaşa ayrıca cavab hazırlamaqla sənəd dövriyyəsini süni şəkildə uzatmasının qarşısını alır.',
    hint = 'Qanunvericiliyə və kargüzarlıq təlimatlarına əsasən, bir neçə şəxsin birgə imzaladığı kollektiv müraciətlərə baxılarkən hər bir imza sahibinə ayrı-ayrılıqda cavab göndərilməsi tələb olunmur; sənədin dövriyyəsini və operativliyi təmin etmək üçün cavab xüsusi olaraq müəyyən edilmiş ünvana ünvanlanır.'
WHERE id = '09ce702d-92ba-4c96-bab3-2bac1eb63191';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və kargüzarlıq qaydalarına əsasən, kollektiv müraciətə verilən cavab kimə göndərilir?',
    options = '["Müraciət edənlərin hamısına ayrı-ayrılıqda məcburi qaydada fərdi məktub şəklində", "Yalnız həmin ərazinin yerli bələdiyyə sədrinə və ya icra nümayəndəsinə", "Müraciətdə göstərilən birinci şəxsə və ya müraciət edənlərin müəyyən etdiyi nümayəndəyə", "Dövlət İmtahan Mərkəzinin müvafiq normativ komissiyasına"]'::jsonb,
    correct_answer = 'Müraciətdə göstərilən birinci şəxsə və ya müraciət edənlərin müəyyən etdiyi nümayəndəyə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi və kargüzarlıq qaydalarına əsasən, kollektiv müraciətə (iki və daha çox şəxsin birgə müraciətinə) verilən cavab məktubu müraciətdə göstərilən **birinci şəxsə və ya müraciət edənlərin müəyyən etdiyi nümayəndəyə** göndərilir. Bu hüquqi norma dövlət orqanlarının eyni məsələ ilə bağlı hər bir vətəndaşa ayrıca cavab hazırlamaqla sənəd dövriyyəsini süni şəkildə uzatmasının qarşısını alır.',
    hint = 'Qanunvericiliyə və kargüzarlıq təlimatlarına əsasən, bir neçə şəxsin birgə imzaladığı kollektiv müraciətlərə baxılarkən hər bir imza sahibinə ayrı-ayrılıqda cavab göndərilməsi tələb olunmur; sənədin dövriyyəsini və operativliyi təmin etmək üçün cavab xüsusi olaraq müəyyən edilmiş ünvana ünvanlanır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '09ce702d-92ba-4c96-bab3-2bac1eb63191');

-- Order 32: ID 2e2480dd-f154-4adf-9ec2-e359506eab7d
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən hansı kateqoriyadan olan müraciətlərə təxirəsalınmadan dərhal baxılmalıdır?',
    options = '["İnsan həyatı və sağlamlığına real təhlükə yaradan hallar barədə müraciətlər", "Dövlət orqanına işə qəbulla bağlı təqdim olunan tərcümeyi-hallar və anketlər", "Vətəndaşların mənzil şəraitinin yaxşılaşdırılması üçün növbəyə dayanmaq barədə ərizələri", "Kənd təsərrüfatı texnikasının güzəştli icarəsi və lizinqi barədə daxil olan təkliflər"]'::jsonb,
    correct_answer = 'İnsan həyatı və sağlamlığına real təhlükə yaradan hallar barədə müraciətlər',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin fundamental prinsiplərinə əsasən, insan həyatına və sağlamlığına real təhlükə yaradan, habelə digər təxirəçəkilməz fövqəladə hallarla bağlı daxil olan müraciətlərə hər hansı standart 15 və ya 30 günlük ümumi müddətlər gözlənilmədən **təxirəsalınmadan dərhal** baxılmalı və operativ tədbirlər görülməlidir. Bu, dövlətin insan hüquqlarının müdafiəsində ali təhlükəsizlik və operativlik prinsipinin təmin olunmasına xidmət edir.',
    hint = 'Vətəndaşların müraciətləri üzrə ümumi baxılma müddətləri nəzərdə tutulsa da, fövqəladə hallar, təcili müdaxilə tələb edən vətəndaşların təhlükəsizliyi, xüsusil də onların həyatı və sağlamlığı ilə bağlı yaranan real təhlükələr zamanı müraciətlərin dərhal araşdırılması və təxirəsalınmadan tədbirlər görülməsi tələb olunur.'
WHERE id = '2e2480dd-f154-4adf-9ec2-e359506eab7d';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və qanunvericiliyin tələblərinə əsasən hansı kateqoriyadan olan müraciətlərə təxirəsalınmadan dərhal baxılmalıdır?',
    options = '["İnsan həyatı və sağlamlığına real təhlükə yaradan hallar barədə müraciətlər", "Dövlət orqanına işə qəbulla bağlı təqdim olunan tərcümeyi-hallar və anketlər", "Vətəndaşların mənzil şəraitinin yaxşılaşdırılması üçün növbəyə dayanmaq barədə ərizələri", "Kənd təsərrüfatı texnikasının güzəştli icarəsi və lizinqi barədə daxil olan təkliflər"]'::jsonb,
    correct_answer = 'İnsan həyatı və sağlamlığına real təhlükə yaradan hallar barədə müraciətlər',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun və inzibati qanunvericiliyin fundamental prinsiplərinə əsasən, insan həyatına və sağlamlığına real təhlükə yaradan, habelə digər təxirəçəkilməz fövqəladə hallarla bağlı daxil olan müraciətlərə hər hansı standart 15 və ya 30 günlük ümumi müddətlər gözlənilmədən **təxirəsalınmadan dərhal** baxılmalı və operativ tədbirlər görülməlidir. Bu, dövlətin insan hüquqlarının müdafiəsində ali təhlükəsizlik və operativlik prinsipinin təmin olunmasına xidmət edir.',
    hint = 'Vətəndaşların müraciətləri üzrə ümumi baxılma müddətləri nəzərdə tutulsa da, fövqəladə hallar, təcili müdaxilə tələb edən vətəndaşların təhlükəsizliyi, xüsusil də onların həyatı və sağlamlığı ilə bağlı yaranan real təhlükələr zamanı müraciətlərin dərhal araşdırılması və təxirəsalınmadan tədbirlər görülməsi tələb olunur.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '2e2480dd-f154-4adf-9ec2-e359506eab7d');

-- Order 33: ID d79793dd-b06c-4c7b-8513-eb962d184e1e
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən vətəndaşın müraciətinə baxılarkən aşağıdakılardan hansı hüququ vardır?',
    options = '["Müraciətin nəticəsindən və qərarın məzmunundan asılı olmayaraq dərhal maliyyə kompensasiyası tələb etmək", "Müraciətə baxan səlahiyyətli vəzifəli şəxsi heç bir məhkəmə qərarı olmadan dərhal vəzifəsindən kənarlaşdırmaq", "Müraciətə baxılması ilə bağlı materiallarla tanış olmaq (dövlət sirri və başqalarının hüquqlarını pozmayan həddə)", "Dövlət orqanının sərəncamında olan bütün məxfi arxivləri və daxili xidməti sənədləri sərbəst surətdə tələb edib evə aparmaq"]'::jsonb,
    correct_answer = 'Müraciətə baxılması ilə bağlı materiallarla tanış olmaq (dövlət sirri və başqalarının hüquqlarını pozmayan həddə)',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə (Vətəndaşın hüquqları) əsasən, vətəndaşın müraciətə baxılması ilə bağlı materiallarla tanış olmaq hüququ vardır. Lakin bu hüquq mütləq deyil; dövlət sirrini, kommersiya və ya qanunla qorunan digər sirləri təşkil edən, habelə digər şəxslərin hüquq və azadlıqlarını pozan məlumatlarla tanış olmağa yol verilmir. Digər variantlar isə qanunvericiliyə ziddir və vətəndaşın səlahiyyət dairəsinə daxil deyil.',
    hint = 'Qanunvericilik vətəndaşlara müraciətlərinin araşdırılması gedişatından məlumat almaq və müəyyən qanuni məhdudiyyətlər çərçivəsində iş materialları ilə tanış olmaq imkanı tanıyır.'
WHERE id = 'd79793dd-b06c-4c7b-8513-eb962d184e1e';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən vətəndaşın müraciətinə baxılarkən aşağıdakılardan hansı hüququ vardır?',
    options = '["Müraciətin nəticəsindən və qərarın məzmunundan asılı olmayaraq dərhal maliyyə kompensasiyası tələb etmək", "Müraciətə baxan səlahiyyətli vəzifəli şəxsi heç bir məhkəmə qərarı olmadan dərhal vəzifəsindən kənarlaşdırmaq", "Müraciətə baxılması ilə bağlı materiallarla tanış olmaq (dövlət sirri və başqalarının hüquqlarını pozmayan həddə)", "Dövlət orqanının sərəncamında olan bütün məxfi arxivləri və daxili xidməti sənədləri sərbəst surətdə tələb edib evə aparmaq"]'::jsonb,
    correct_answer = 'Müraciətə baxılması ilə bağlı materiallarla tanış olmaq (dövlət sirri və başqalarının hüquqlarını pozmayan həddə)',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun müvafiq maddəsinə (Vətəndaşın hüquqları) əsasən, vətəndaşın müraciətə baxılması ilə bağlı materiallarla tanış olmaq hüququ vardır. Lakin bu hüquq mütləq deyil; dövlət sirrini, kommersiya və ya qanunla qorunan digər sirləri təşkil edən, habelə digər şəxslərin hüquq və azadlıqlarını pozan məlumatlarla tanış olmağa yol verilmir. Digər variantlar isə qanunvericiliyə ziddir və vətəndaşın səlahiyyət dairəsinə daxil deyil.',
    hint = 'Qanunvericilik vətəndaşlara müraciətlərinin araşdırılması gedişatından məlumat almaq və müəyyən qanuni məhdudiyyətlər çərçivəsində iş materialları ilə tanış olmaq imkanı tanıyır.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'd79793dd-b06c-4c7b-8513-eb962d184e1e');

-- Order 34: ID 88aa9521-14ca-48f6-9be9-599a55550d3d
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və elektron sənəd dövriyyəsi qaydalarına əsasən elektron müraciət hansı vasitələrlə təqdim edilir?',
    options = '["Yalnız dövlət televiziya və radio verilişləri yayımlayan kanalların rəsmi platformaları vasitəsilə", "Müraciətə baxan subyektin rəsmi internet saytı, internet informasiya ehtiyatı və ya elektron poçt ünvanı vasitəsilə", "İstənilən sosial şəbəkə səhifəsindəki rəsmi şərhlər və birbaşa mesajlar (direct message) vasitəsilə", "Yalnız mobil operatorların qısa nömrələrinə göndərilən SMS və ya USSD sorğuları vasitəsilə"]'::jsonb,
    correct_answer = 'Müraciətə baxan subyektin rəsmi internet saytı, internet informasiya ehtiyatı və ya elektron poçt ünvanı vasitəsilə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun və müvafiq kargüzarlıq qaydalarının tələblərinə əsasən, elektron müraciət müraciətə baxan subyektin rəsmi internet saytı, internet informasiya ehtiyatı və ya elektron poçt ünvanı vasitəsilə təqdim edilir. Sosial şəbəkələrdəki şərhlər, qeyri-rəsmi səhifələr və ya SMS vasitəsilə göndərilən müraciətlər rəsmi status daşımır və qanunvericiliklə müəyyən edilmiş qaydada qeydiyyata alınaraq icra olunmur.',
    hint = 'Qanunvericilikdə elektron müraciətin təqdim edilməsi üçün rəsmi internet resursları və elektron ünvanlar nəzərdə tutulmuşdur ki, bu da müraciətlərin təhlükəsizliyini və rəsmi qeydiyyatını təmin edir.'
WHERE id = '88aa9521-14ca-48f6-9be9-599a55550d3d';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və elektron sənəd dövriyyəsi qaydalarına əsasən elektron müraciət hansı vasitələrlə təqdim edilir?',
    options = '["Yalnız dövlət televiziya və radio verilişləri yayımlayan kanalların rəsmi platformaları vasitəsilə", "Müraciətə baxan subyektin rəsmi internet saytı, internet informasiya ehtiyatı və ya elektron poçt ünvanı vasitəsilə", "İstənilən sosial şəbəkə səhifəsindəki rəsmi şərhlər və birbaşa mesajlar (direct message) vasitəsilə", "Yalnız mobil operatorların qısa nömrələrinə göndərilən SMS və ya USSD sorğuları vasitəsilə"]'::jsonb,
    correct_answer = 'Müraciətə baxan subyektin rəsmi internet saytı, internet informasiya ehtiyatı və ya elektron poçt ünvanı vasitəsilə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun və müvafiq kargüzarlıq qaydalarının tələblərinə əsasən, elektron müraciət müraciətə baxan subyektin rəsmi internet saytı, internet informasiya ehtiyatı və ya elektron poçt ünvanı vasitəsilə təqdim edilir. Sosial şəbəkələrdəki şərhlər, qeyri-rəsmi səhifələr və ya SMS vasitəsilə göndərilən müraciətlər rəsmi status daşımır və qanunvericiliklə müəyyən edilmiş qaydada qeydiyyata alınaraq icra olunmur.',
    hint = 'Qanunvericilikdə elektron müraciətin təqdim edilməsi üçün rəsmi internet resursları və elektron ünvanlar nəzərdə tutulmuşdur ki, bu da müraciətlərin təhlükəsizliyini və rəsmi qeydiyyatını təmin edir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '88aa9521-14ca-48f6-9be9-599a55550d3d');

-- Order 35: ID 3d05f317-e594-4052-a0f0-4b1fa84c10d4
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və müvafiq normativ aktlara əsasən vətəndaşların videoqəbulu və ya onlayn formada qəbulu hansı qaydada həyata keçirilir?',
    options = '["Qanunvericiliklə müəyyən edilmiş qaydada elektron rabitə vasitələri və xüsusi proqram təminatı vasitəsilə", "Yalnız xarici dövlətlərdə yaşayan əcnəbi vətəndaşlar üçün məcburi qaydada", "Yalnız ölkədə xüsusi orqan tərəfindən elan olunan fövqəladə vəziyyət dövründə", "Yalnız məhkəmə hakimlərinin fərdi iştirakı və sərəncamı ilə"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada elektron rabitə vasitələri və xüsusi proqram təminatı vasitəsilə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət orqanlarında qəbul qaydalarına əsasən, vətəndaşların müraciətlərinə daha operativ baxılması, əlçatanlığın təmin edilməsi məqsədilə videoqəbul və onlayn qəbullar **qanunvericiliklə müəyyən edilmiş qaydada elektron rabitə vasitələri və xüsusi proqram təminatı vasitəsilə** həyata keçirilir. Bu zaman vətəndaşların məsafədən canlı videogörüntülü bağlantı formatında qurum rəhbərləri və ya səlahiyyətli şəxslər tərəfindən qəbulu təmin olunur.',
    hint = 'Müasir dövrdə informasiya-kommunikasiya texnologiyalarının tətbiqi ilə dövlət orqanlarında vətəndaşların qəbulu prosesi təkmilləşdirilmiş, məsafədən canlı bağlantı formatında həyata keçirilən videoqəbulların hüquqi əsasları müəyyən edilmişdir.'
WHERE id = '3d05f317-e594-4052-a0f0-4b1fa84c10d4';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa və müvafiq normativ aktlara əsasən vətəndaşların videoqəbulu və ya onlayn formada qəbulu hansı qaydada həyata keçirilir?',
    options = '["Qanunvericiliklə müəyyən edilmiş qaydada elektron rabitə vasitələri və xüsusi proqram təminatı vasitəsilə", "Yalnız xarici dövlətlərdə yaşayan əcnəbi vətəndaşlar üçün məcburi qaydada", "Yalnız ölkədə xüsusi orqan tərəfindən elan olunan fövqəladə vəziyyət dövründə", "Yalnız məhkəmə hakimlərinin fərdi iştirakı və sərəncamı ilə"]'::jsonb,
    correct_answer = 'Qanunvericiliklə müəyyən edilmiş qaydada elektron rabitə vasitələri və xüsusi proqram təminatı vasitəsilə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi və dövlət orqanlarında qəbul qaydalarına əsasən, vətəndaşların müraciətlərinə daha operativ baxılması, əlçatanlığın təmin edilməsi məqsədilə videoqəbul və onlayn qəbullar **qanunvericiliklə müəyyən edilmiş qaydada elektron rabitə vasitələri və xüsusi proqram təminatı vasitəsilə** həyata keçirilir. Bu zaman vətəndaşların məsafədən canlı videogörüntülü bağlantı formatında qurum rəhbərləri və ya səlahiyyətli şəxslər tərəfindən qəbulu təmin olunur.',
    hint = 'Müasir dövrdə informasiya-kommunikasiya texnologiyalarının tətbiqi ilə dövlət orqanlarında vətəndaşların qəbulu prosesi təkmilləşdirilmiş, məsafədən canlı bağlantı formatında həyata keçirilən videoqəbulların hüquqi əsasları müəyyən edilmişdir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '3d05f317-e594-4052-a0f0-4b1fa84c10d4');

-- Order 36: ID 9ce763aa-43a3-4bd4-ad2d-7f7efc826d36
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən anonim müraciət anlayışının hüquqi tərifi necədir?',
    options = '["Yalnız poçt qutusuna atılmış, heç bir əks əlaqə vasitəsi qeyd olunmayan şikayətlərə", "Dövlət sirrini və ya qanunla qorunan digər sirləri əks etdirən rəsmi sorğulara", "Elektron poçtla göndərilən və rəqəmsal imzası olmayan hər hansı təklifə", "Vətəndaşın adı, soyadı, atasının adı, ünvanı və imzası (şəxsi və ya elektron imzası) göstərilməyən müraciətə"]'::jsonb,
    correct_answer = 'Vətəndaşın adı, soyadı, atasının adı, ünvanı və imzası (şəxsi və ya elektron imzası) göstərilməyən müraciətə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun əsas anlayışlar müddəalarına əsasən, **anonim müraciət** – müraciətə baxan subyektə və ya onun vəzifəli şəxsinə vətəndaşın soyadı, adı, atasının adı, ünvanı, şəxsi və ya elektron imzası göstərilmədən daxil olan müraciətə (və ya elektron sənəd üçün tələb olunan rekvizitlər olmadıqda) deyilir. Qanunvericiliyin 6.4-cü maddəsinə əsasən, bu cür anonim müraciətlər qəbul edilmir və onlara baxılmır.',
    hint = 'Qanunvericilikdə müraciətin rəsmi status qazanması və araşdırılması üçün vətəndaşın kimliyini təsdiq edən əsas rekvizitlər tələb olunur; bunların olmaması müraciətin hüquqi xarakterini müəyyənləşdirir.'
WHERE id = '9ce763aa-43a3-4bd4-ad2d-7f7efc826d36';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən anonim müraciət anlayışının hüquqi tərifi necədir?',
    options = '["Yalnız poçt qutusuna atılmış, heç bir əks əlaqə vasitəsi qeyd olunmayan şikayətlərə", "Dövlət sirrini və ya qanunla qorunan digər sirləri əks etdirən rəsmi sorğulara", "Elektron poçtla göndərilən və rəqəmsal imzası olmayan hər hansı təklifə", "Vətəndaşın adı, soyadı, atasının adı, ünvanı və imzası (şəxsi və ya elektron imzası) göstərilməyən müraciətə"]'::jsonb,
    correct_answer = 'Vətəndaşın adı, soyadı, atasının adı, ünvanı və imzası (şəxsi və ya elektron imzası) göstərilməyən müraciətə',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun əsas anlayışlar müddəalarına əsasən, **anonim müraciət** – müraciətə baxan subyektə və ya onun vəzifəli şəxsinə vətəndaşın soyadı, adı, atasının adı, ünvanı, şəxsi və ya elektron imzası göstərilmədən daxil olan müraciətə (və ya elektron sənəd üçün tələb olunan rekvizitlər olmadıqda) deyilir. Qanunvericiliyin 6.4-cü maddəsinə əsasən, bu cür anonim müraciətlər qəbul edilmir və onlara baxılmır.',
    hint = 'Qanunvericilikdə müraciətin rəsmi status qazanması və araşdırılması üçün vətəndaşın kimliyini təsdiq edən əsas rekvizitlər tələb olunur; bunların olmaması müraciətin hüquqi xarakterini müəyyənləşdirir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = '9ce763aa-43a3-4bd4-ad2d-7f7efc826d36');

-- Order 37: ID c6a4aa53-42d9-419a-ac19-fd12ec0c6319
UPDATE questions SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən əcnəbilər və vətəndaşlığı olmayan şəxslər müraciət hüququndan necə istifadə edirlər?',
    options = '["Onların Azərbaycan Respublikasının dövlət və bələdiyyə orqanlarına müraciət etmək hüququ qətiyyən yoxdur", "Yalnız xüsusi dövlət rüsumu və ya lisenziya haqqı ödəməklə müraciət edə bilərlər", "Azərbaycan Respublikası vətəndaşları ilə bərabər əsaslarla", "Yalnız Azərbaycan Respublikasının Xarici İşlər Nazirliyinin xüsusi icazəsi olduqda"]'::jsonb,
    correct_answer = 'Azərbaycan Respublikası vətəndaşları ilə bərabər əsaslarla',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi ilə bağlı müddəalara əsasən, bu Qanunun qaydaları Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə başqa hal nəzərdə tutulmayıbsa, **əcnəbilərin, vətəndaşlığı olmayan şəxslərin və xarici hüquqi şəxslərin** müraciətlərinə də şamil olunur. Bu o deməkdir ki, qeyd olunan kateqoriyadan olan şəxslər Azərbaycan Respublikasının vətəndaşları ilə **bərabər əsaslarla** müraciət etmək hüququna malikdirlər və onların müraciətlərinin qəbulu, qeydiyyatı, baxılması və cavablandırılması ümumi qaydada həyata keçirilir.',
    hint = 'Qanunvericilikdə ölkə ərazisində olan və ya xaricdən müraciət edən əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquqlarının həyata keçirilməsi yerli vətəndaşlarla eyni prinsiplər üzrə tənzimlənir.'
WHERE id = 'c6a4aa53-42d9-419a-ac19-fd12ec0c6319';

UPDATE question_bank SET
    question_text = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununa əsasən əcnəbilər və vətəndaşlığı olmayan şəxslər müraciət hüququndan necə istifadə edirlər?',
    options = '["Onların Azərbaycan Respublikasının dövlət və bələdiyyə orqanlarına müraciət etmək hüququ qətiyyən yoxdur", "Yalnız xüsusi dövlət rüsumu və ya lisenziya haqqı ödəməklə müraciət edə bilərlər", "Azərbaycan Respublikası vətəndaşları ilə bərabər əsaslarla", "Yalnız Azərbaycan Respublikasının Xarici İşlər Nazirliyinin xüsusi icazəsi olduqda"]'::jsonb,
    correct_answer = 'Azərbaycan Respublikası vətəndaşları ilə bərabər əsaslarla',
    explanation = '“Vətəndaşların müraciətləri haqqında” Azərbaycan Respublikası Qanununun tətbiqi ilə bağlı müddəalara əsasən, bu Qanunun qaydaları Azərbaycan Respublikasının tərəfdar çıxdığı beynəlxalq müqavilələrdə başqa hal nəzərdə tutulmayıbsa, **əcnəbilərin, vətəndaşlığı olmayan şəxslərin və xarici hüquqi şəxslərin** müraciətlərinə də şamil olunur. Bu o deməkdir ki, qeyd olunan kateqoriyadan olan şəxslər Azərbaycan Respublikasının vətəndaşları ilə **bərabər əsaslarla** müraciət etmək hüququna malikdirlər və onların müraciətlərinin qəbulu, qeydiyyatı, baxılması və cavablandırılması ümumi qaydada həyata keçirilir.',
    hint = 'Qanunvericilikdə ölkə ərazisində olan və ya xaricdən müraciət edən əcnəbilərin və vətəndaşlığı olmayan şəxslərin hüquqlarının həyata keçirilməsi yerli vətəndaşlarla eyni prinsiplər üzrə tənzimlənir.'
WHERE id = (SELECT bank_question_id FROM questions WHERE id = 'c6a4aa53-42d9-419a-ac19-fd12ec0c6319');

COMMIT;