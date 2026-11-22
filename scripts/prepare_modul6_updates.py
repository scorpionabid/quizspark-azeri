import json
import re

modul6_updates = [
    {
        "id": "131a1480-92f5-45db-8f5c-4cd13ff113e3",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət orqanlarında “Qaynar xətt” xidmətinin təşkil edilməsinin əsas məqsədi nədir?",
        "options": [
            "Korrupsiya faktları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması",
            "Dövlət orqanının ictimai-siyasi bəyanatlarını və gündəlik xəbərlərini yaymaq",
            "Yalnız əməkdaşlar arasında daxili intizam sorğuları keçirmək",
            "Vətəndaşların sosial təminat müavinətləri üzrə müraciətlərini qeydiyyata almaq"
        ],
        "correct_answer": "Korrupsiya faktları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11-1 — Qanunvericilik və antikorrupsiya tədbirlərinə əsasən, dövlət orqanlarında “Qaynar xətt” xidməti korrupsiya halları barədə məlumatların operativ qəbul edilməsi və dərhal araşdırılması məqsədilə təşkil edilir.",
        "hint": "Qaynar xətt korrupsiya hüquqpozmaları barədə məlumatların operativ qəbulu və araşdırılması üçün nəzərdə tutulub."
    },
    {
        "id": "465ce294-f621-4af3-80bd-f80f24d3f5ed",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət qulluqçusunun sahibkarlıq fəaliyyəti ilə məşğul olması:",
        "options": [
            "Qanunla qadağandır (elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla)",
            "Tamamilə sərbəstdir və heç bir məhdudiyyət qoyulmur",
            "Yalnız xarici ölkələrdə təsis edilmiş müəssisələrdə icazə verilir",
            "Dövlət orqanı rəhbərinin şifahi razılığı əsasında mümkündür"
        ],
        "correct_answer": "Qanunla qadağandır (elmi, pedaqoji və yaradıcılıq fəaliyyəti istisna olmaqla)",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Qanunvericiliyə əsasən, dövlət qulluqçularına sahibkarlıq fəaliyyəti ilə məşğul olmaq qadağandır; lakin onların elmi, pedaqoji və yaradıcılıq fəaliyyəti ilə məşğul olmasına qanunla icazə verilir.",
        "hint": "Dövlət qulluqçusuna sahibkarlıq qadağandır, yalnız elmi, pedaqoji və yaradıcılıq fəaliyyəti istisnadır."
    },
    {
        "id": "789acffc-426a-483a-8c1a-143c65b75806",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, qanunsuz qəbul edilmiş hədiyyə və nemətlər:",
        "options": [
            "Dövlət orqanına təhvil verilməli və ya dövlət nəfinə ödənilməlidir",
            "Dövlət qulluqçusunun şəxsi mülkiyyətində saxlanılmalıdır",
            "Xidməti fəaliyyətin sonuna qədər təşkilatın daxili anbarında saxlanılmalıdır",
            "Yaxın qohumların adına rəsmi qaydada bağışlanmalıdır"
        ],
        "correct_answer": "Dövlət orqanına təhvil verilməli və ya dövlət nəfinə ödənilməlidir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8.3 — Qanunvericiliyə əsasən, dövlət qulluqçusunun qanunsuz qəbul etdiyi hədiyyə və nemətlər dərhal dövlət orqanına təhvil verilməli və ya onların dəyəri dövlət nəfinə ödənilməlidir.",
        "hint": "Qanunsuz hədiyyələr dövlət orqanına təhvil verilməli və ya məbləği dövlət büdcəsinə ödənilməlidir."
    },
    {
        "id": "666e3515-8072-4004-a6cb-6566926427f8",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsin xidməti fəaliyyəti zamanı dövlət vəsaitlərinin təyinatından kənar xərclənməsi:",
        "options": [
            "Qanunsuz korrupsiya hüquqpozmasıdır və müvafiq məsuliyyət yaradır",
            "Dövlət orqanının maliyyə müstəqilliyi çərçivəsində verdiyi sərbəst qərardır",
            "Təşkilatın qənaət edilmiş resurslarının yenidən bölüşdürülməsi tədbiridir",
            "Yalnız təşkilatdaxili daxili audit yoxlamasından sonra tənzimlənən xətadır"
        ],
        "correct_answer": "Qanunsuz korrupsiya hüquqpozmasıdır və müvafiq məsuliyyət yaradır",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9.1 — Xidməti fəaliyyət zamanı dövlət vəsaitlərinin və ya dövlət əmlakının təyinatından kənar xərclənməsi korrupsiyaya şərait yaradan qanunsuz hüquqpozmadır və intizam, inzibati və ya cinayət məsuliyyəti yaradır.",
        "hint": "Dövlət vəsaitlərinin təyinatından kənar xərclənməsi qanunvericiliklə qadağan olunmuş korrupsiya hüquqpozmasıdır."
    },
    {
        "id": "9aae2b06-8e7a-49cb-8635-62b5658fe818",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, maliyyə xarakterli tələblərə hansılar aiddir?",
        "options": [
            "Gəlirləri, əmlak vəziyyəti və maliyyə öhdəlikləri barədə məlumatların rəsmi təqdim edilməsi",
            "Təşkilatın illik əməkhaqqı büdcəsinin müstəqil şəkildə formalaşdırılması",
            "Yalnız beynəlxalq bank hesabları üzrə əməliyyatların məhdudlaşdırılması",
            "İllik kommersiya kreditlərinin dövlət zəmanəti ilə təmin edilməsi"
        ],
        "correct_answer": "Gəlirləri, əmlak vəziyyəti və maliyyə öhdəlikləri barədə məlumatların rəsmi təqdim edilməsi",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 5 — Qanunvericiliyə əsasən, maliyyə xarakterli tələblərə vəzifəli şəxslərin öz gəlirləri, əmlak vəziyyəti, vergitutma obyekti olan əmlakı və maliyyə öhdəlikləri barədə məlumatları hər il rəsmi qaydada təqdim etməsi daxildir.",
        "hint": "Maliyyə tələbləri vəzifəli şəxslərin gəlirləri, əmlakı və maliyyə öhdəlikləri barədə bəyannamə verməsini ehtiva edir."
    },
    {
        "id": "06f69745-efd9-401c-af2b-984f5750a694",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxs korrupsiya nəticəsində qanunsuz gəlir əldə etdikdə həmin gəlir:",
        "options": [
            "Məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir",
            "Vəzifəli şəxsin xüsusi depozit hesabında bloklaşdırılaraq saxlanılır",
            "Dövlət orqanının daxili xeyriyyə fonduna könüllü ianə kimi keçirilir",
            "Yalnız intizam tənbehi tətbiq edilməklə şəxsin istifadəsində saxlanılır"
        ],
        "correct_answer": "Məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 12 — Vəzifəli şəxsin korrupsiya hüquqpozmaları nəticəsində əldə etdiyi qanunsuz gəlirlər və ya əmlak qanunvericiliklə müəyyən edilmiş qaydada məhkəmə qərarı ilə dövlət nəfinə müsadirə edilir.",
        "hint": "Korrupsiya nəticəsində əldə edilmiş qanunsuz gəlirlər məhkəmə qərarı ilə dövlət nəfinə tutulur."
    },
    {
        "id": "dba9d2b2-8e25-4fdf-9c74-ae05a34bbd0a",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət qulluqçusunun qanunsuz üstünlük əldə etməsi faktı üzrə intizam icraatı kim tərəfindən başlana bilər?",
        "options": [
            "Dövlət orqanının rəhbəri tərəfindən",
            "Müvafiq ərazidə fəaliyyət göstərən bələdiyyə şurası tərəfindən",
            "Kənar müstəqil audit və qiymətləndirmə şirkəti tərəfindən",
            "Sahə üzrə həmkarlar ittifaqı komitəsinin rəyasət heyəti tərəfindən"
        ],
        "correct_answer": "Dövlət orqanının rəhbəri tərəfindən",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və Dövlət Qulluğu Qanunvericiliyi — Qanunvericiliyə əsasən, dövlət qulluqçusunun qanunsuz üstünlük əldə etməsi faktı aşkar edildikdə, həmin şəxs barəsində intizam icraatı dövlət orqanının rəhbəri tərəfindən başlana bilər.",
        "hint": "Dövlət qulluqçusu barəsində intizam icraatını başlamaq səlahiyyəti dövlət orqanının rəhbərinə məxsusdur."
    },
    {
        "id": "442db1ec-9f07-494e-b581-944b3856561b",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxs hansı halda hədiyyəni qəbul edə bilər?",
        "options": [
            "Dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir etməyən rəsmi suvenirləri",
            "Təşkilatın daxili fondundan ayrılan istənilən dəyərdə nəqliyyat vasitəsini",
            "Şəxsi ehtiyaclar üçün bağışlanan daşınmaz əmlak və ya mənzili",
            "Xarici tərəfdaşlar tərəfindən təqdim olunan ödənişsiz fərdi istirahət vauçerlərini"
        ],
        "correct_answer": "Dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir etməyən rəsmi suvenirləri",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8.2 — Qanunvericiliyə əsasən, vəzifəli şəxslərə xidməti vəzifələrin icrası ilə əlaqədar hədiyyə almaq qadağan olsa da, dəyəri 55 manatdan yuxarı olmayan və xidməti vəzifənin icrasına təsir göstərməyən rəsmi protokol suvenirlərinin qəbul edilməsinə istisna hallarda icazə verilir.",
        "hint": "Yalnız dəyəri 55 manatdan çox olmayan və vəzifə icrasına təsir etməyən rəsmi suvenirlər qəbul edilə bilər."
    },
    {
        "id": "ce6076c4-6497-47f3-bbcc-03f753d244f8",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsə qanunsuz maddi və digər nemətlər verən fiziki və hüquqi şəxslər:",
        "options": [
            "Qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar",
            "Hər hansı hüquqi və ya inzibati məsuliyyətdən tam azad edilirlər",
            "Yalnız dövlət orqanı tərəfindən yazılı təşəkkürnamə ilə fərqləndirilirlər",
            "Gələcək kommersiya fəaliyyətində vergi güzəştləri əldə edirlər"
        ],
        "correct_answer": "Qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 312 — Qanunvericiliyə əsasən, vəzifəli şəxsə qanunsuz maddi və ya qeyri-maddi nemətlər təklif edən, vəd edən və ya verən fiziki və hüquqi şəxslər qanunvericiliklə müəyyən edilmiş qaydada cinayət və ya inzibati məsuliyyət daşıyırlar.",
        "hint": "Qanunsuz nemət verən şəxslər də rüşvət vermə və ya korrupsiyaya şərait yaratma əməllərinə görə məsuliyyət daşıyırlar."
    },
    {
        "id": "922140e4-9098-47d2-ac7e-b3f77415e3e3",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya cinayətləri üzrə ibtidai istintaq hansı orqan tərəfindən aparılır?",
        "options": [
            "Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən",
            "Müvafiq inzibati ərazinin yerli bələdiyyə icra orqanları tərəfindən",
            "İxtisaslaşmış müstəqil sığorta və maliyyə audit şirkətləri tərəfindən",
            "Azərbaycan Respublikasının Dövlət Statistika Komitəsi tərəfindən"
        ],
        "correct_answer": "Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 4 və AR Cinayət-Prosessual Məcəlləsi Maddə 215 — Qanunvericiliyə əsasən, korrupsiya cinayətləri üzrə ibtidai istintaq Azərbaycan Respublikasının Baş prokuroru yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi tərəfindən aparılır.",
        "hint": "Korrupsiya cinayətlərinin ibtidai istintaqını Baş prokuror yanında xüsusi Baş İdarə aparır."
    },
    {
        "id": "29eddabf-644c-4f8c-9c05-d8fc721e8e83",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya ilə əlaqədar hüquqpozmaların subyektlərinə kimlər aiddir?",
        "options": [
            "Dövlət orqanlarında seçilmiş və ya təyin edilmiş vəzifəli şəxslər, dövlət qulluqçuları və bələdiyyə üzvləri",
            "Yalnız hüquqi şəxs yaratmadan fəaliyyət göstərən fərdi sahibkarlar",
            "Yalnız ali təhsil müəssisələrində təhsil alan tələbə və doktorantlar",
            "Ölkə ərazisində qısamüddətli səfərdə olan əcnəbi turistlər"
        ],
        "correct_answer": "Dövlət orqanlarında seçilmiş və ya təyin edilmiş vəzifəli şəxslər, dövlət qulluqçuları və bələdiyyə üzvləri",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 2 — Qanunun 2-ci maddəsinə əsasən, korrupsiya ilə əlaqədar hüquqpozmaların subyektlərinə dövlət hakimiyyəti orqanlarına seçilmiş və ya təyin edilmiş şəxslər, dövlət qulluqçuları, bələdiyyə üzvləri və bələdiyyə qulluqçuları, habelə qanunla müəyyən edilmiş digər vəzifəli şəxslər aiddir.",
        "hint": "Subyektlər dövlət hakimiyyəti orqanlarının vəzifəli şəxsləri, dövlət qulluqçuları və bələdiyyə üzvləridir."
    },
    {
        "id": "df01e754-140f-477b-b496-b8723b7d72f1",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozması törətmiş şəxsin vəzifədən kənarlaşdırılması:",
        "options": [
            "İstintaq və ya xidməti yoxlama dövründə səlahiyyətli orqanın qərarı ilə həyata keçirilə bilər",
            "Qanunvericiliklə istənilən halda qəti şəkildə qadağan edilmişdir",
            "Yalnız şəxsin özünün yazılı razılığı və könüllü ərizəsi ilə mümkündür",
            "Yalnız şəxs qanunla müəyyən edilmiş pensiya yaşına çatdıqda tətbiq edilir"
        ],
        "correct_answer": "İstintaq və ya xidməti yoxlama dövründə səlahiyyətli orqanın qərarı ilə həyata keçirilə bilər",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və prosessual qanunvericilik — Qanunvericiliyə əsasən, korrupsiya hüquqpozması ilə əlaqədar aparılan istintaq və ya xidməti yoxlama dövründə obyektivliyin təmin edilməsi və maneələrin qarşısının alınması üçün səlahiyyətli orqanın qərarı ilə şəxs vəzifəsindən kənarlaşdırıla bilər.",
        "hint": "Obyektivliyin təmin edilməsi məqsədilə araşdırma və ya istintaq müddətində səlahiyyətli qərarla vəzifədən kənarlaşdırma mümkündür."
    },
    {
        "id": "f3db711a-8bd2-47c8-9aae-d797600f59a3",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, vəzifəli şəxsin öz səlahiyyətlərindən qulluq maraqlarına zidd olaraq istifadə etməsi necə qiymətləndirilir?",
        "options": [
            "Vəzifəli şəxsin diskresion səlahiyyətləri çərçivəsində verdiyi sərbəst qərardır",
            "Dövlət orqanının daxili idarəetmə qaydalarına uyğun səmərəli tədbirdir",
            "Təşkilatın maliyyə resurslarının optimallaşdırılmasına xidmət edən addımdır",
            "Qanunvericiliklə qəti şəkildə qadağan olunmuş korrupsiya hüquqpozmasıdır"
        ],
        "correct_answer": "Qanunvericiliklə qəti şəkildə qadağan olunmuş korrupsiya hüquqpozmasıdır",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Qanunun və qanunvericiliyin əsas prinsiplərinə əsasən, vəzifəli şəxsin öz səlahiyyətlərindən qulluq mənafeyinə zidd olaraq istifadə etməsi, habelə üçüncü şəxslərin xeyrinə qanunsuz qərarlar qəbul etməsi qadağan olunmuş korrupsiya hüquqpozması hesab olunur və müvafiq məsuliyyət yaradır.",
        "hint": "Səlahiyyətdən qulluq mənafeyinə zidd istifadə qanunvericiliklə qadağan olunmuş korrupsiya hüquqpozmasıdır."
    },
    {
        "id": "86731df6-71c0-4f8d-8508-91d2cafa4e51",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və müvafiq qanunvericilik aktlarına əsasən, korrupsiyaya qarşı mübarizə sahəsində ixtisaslaşmış orqanlar hansılardır?",
        "options": [
            "Maliyyə Nazirliyi yanında dövlət maliyyə nəzarəti xidməti və xəzinədarlıq departamenti",
            "Daxili İşlər Nazirliyinin baş cinayət-axtarış idarəsi və yerli polis şöbələri",
            "İqtisadiyyat Nazirliyi yanında antiinhisar siyasəti və istehlakçıların hüquqlarının müdafiəsi qurumu",
            "Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi"
        ],
        "correct_answer": "Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 4.2 — Qanunvericilik aktlarının tələblərinə əsasən, ölkədə korrupsiyaya qarşı mübarizə sahəsində ixtisaslaşmış orqanlara fəaliyyəti əlaqələndirən Korrupsiyaya qarşı mübarizə üzrə Komissiya və cinayət təqibini həyata keçirən Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsi daxildir.",
        "hint": "İxtisaslaşmış orqanlar Korrupsiyaya qarşı mübarizə üzrə Komissiya və Baş prokuror yanında Korrupsiyaya qarşı Mübarizə Baş İdarəsidir."
    },
    {
        "id": "0d635612-7569-4f42-8c33-ac59a7f67173",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozmaları nəticəsində qəbul edilmiş inzibati aktların hüquqi aqibəti necə tənzimlənir?",
        "options": [
            "Qəbul edildiyi tarixdən etibarən avtomatik olaraq beş il müddətində qüvvədə qalır",
            "Yalnız yuxarı orqanın daxili göstərişi ilə dəyişdirilərək yenidən rəsmiləşdirilir",
            "Təşkilatın ləğvindən sonra heç bir hüquqi nəticə yaratmadan qüvvədən düşür",
            "Məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir və etibarsız sayılır"
        ],
        "correct_answer": "Məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir və etibarsız sayılır",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 13 — Qanunun tələblərinə əsasən, korrupsiya ilə əlaqədar hüquqpozmalar nəticəsində qəbul olunmuş aktlar müvafiq səlahiyyətli dövlət orqanları, yerli özünüidarəetmə orqanları və ya məhkəmə tərəfindən ləğv edilir və etibarsız sayılır.",
        "hint": "Korrupsiya nəticəsində qəbul edilmiş aktlar məhkəmə və ya səlahiyyətli orqan tərəfindən ləğv edilir."
    },
    {
        "id": "b68c0818-f5d1-4d61-b4fe-018855c50282",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və satınalma qanunvericiliyinə əsasən, dövlət satınalmalarında vəzifəli şəxsin öz yaxın qohumunun təsisçisi olduğu şirkətə qanunsuz üstünlük verməsi necə qiymətləndirilir?",
        "options": [
            "Dövlət orqanının daxili investisiya siyasətinə tam uyğun olan səmərəli addımdır",
            "Təşkilatın maliyyə resurslarının idarə olunmasını asanlaşdıran iqtisadi vasitədir",
            "Tərəflərin qarşılıqlı razılığı ilə tənzimlənən sərbəst ticari əməliyyatdır",
            "Kobud korrupsiya hüquqpozmasıdır və satınalmanın nəticələri ləğv edilir"
        ],
        "correct_answer": "Kobud korrupsiya hüquqpozmasıdır və satınalmanın nəticələri ləğv edilir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 və “Dövlət satınalmaları haqqında” AR Qanunu — Dövlət satınalmaları zamanı maraqlar toqquşmasına yol verilməsi və yaxın qohumların şirkətlərinə qanunsuz üstünlük təmin edilməsi korrupsiya hüquqpozmasıdır; bu hal aşkar edildikdə satınalmanın nəticələri ləğv edilir və təqsirkar şəxslər məsuliyyətə cəlb olunur.",
        "hint": "Satınalmada yaxın qohumlara qanunsuz üstünlük verilməsi kobud korrupsiya hüquqpozmasıdır və nəticələrin ləğvinə səbəb olur."
    },
    {
        "id": "c8092873-a8d7-42ca-b257-4f8cf67dc4f4",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya hüquqpozması törətmiş vəzifəli şəxslər hansı məsuliyyət növlərinə cəlb edilə bilərlər?",
        "options": [
            "Yalnız daxili intizam qaydaları çərçivəsində tətbiq olunan tənbeh tədbirləri",
            "Təşkilatın qərarı ilə verilən şifahi xəbərdarlıq və töhmət tədbirləri",
            "Yalnız mülki qaydada dəyən maddi zərərin ödənilməsi öhdəliyi",
            "İntizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti"
        ],
        "correct_answer": "İntizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11 — Korrupsiya ilə əlaqədar hüquqpozmalar törətmiş şəxslər qanunvericiliklə müəyyən edilmiş qaydada intizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyətinə cəlb edilirlər.",
        "hint": "Korrupsiya törədən şəxslər əməlin xarakterindən asılı olaraq intizam, mülki-hüquqi, inzibati və ya cinayət məsuliyyəti daşıyırlar."
    },
    {
        "id": "7f9c8b8e-0497-4b1b-910e-9743ef19ccb7",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, xidməti vəzifələrin icrası ilə əlaqədar vəzifəli şəxslərə hədiyyə verilməsi barədə ümumi qadağa hansı həddə şamil olunur?",
        "options": [
            "Dövlət qulluqçularının istənilən dəyərdə hədiyyə qəbul etməsinə heç bir məhdudiyyət qoyulmur",
            "Yalnız min manatdan yuxarı məbləğdə olan bahalı daşınmaz əmlaklar qadağan olunur",
            "Hədiyyə məhdudiyyəti yalnız xarici ölkələrdən gələn nümayəndə heyətlərinə şamil edilir",
            "Xidməti vəzifələrin icrası ilə əlaqədar dəyəri 55 manatdan artıq olan hədiyyələrin qəbul edilməsi qanunla qadağandır"
        ],
        "correct_answer": "Xidməti vəzifələrin icrası ilə əlaqədar dəyəri 55 manatdan artıq olan hədiyyələrin qəbul edilməsi qanunla qadağandır",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 8 — Vəzifəli şəxsə xidməti vəzifələrinin qərəzsiz icrasına təsir edə bilən və ya bu cür təsir təəssüratı yaradan hədiyyələr qəbul etmək qadağandır; qonaqpərvərliklə bağlı dəyəri 55 manatdan yuxarı olan hədiyyələrin qəbul edilməsinə yol verilmir.",
        "hint": "Xidməti fəaliyyətlə əlaqədar dəyəri 55 manatdan yuxarı hədiyyə qəbul edilməsi qanunla qadağandır."
    },
    {
        "id": "1d4336ca-56b8-4ecc-a805-c8a585c68bea",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və antikorrupsiya qanunvericiliyinə əsasən, dövlət orqanlarında korrupsiya risklərinin qiymətləndirilməsi necə həyata keçirilir?",
        "options": [
            "Yalnız beynəlxalq maliyyə təşkilatlarının xüsusi nümayəndələri tərəfindən həyata keçirilir",
            "Təşkilatın illik büdcə hesabatı təsdiq olunduqdan sonra on ildə bir dəfə aparılır",
            "Könüllü xarakter daşıyır və yalnız qurum rəhbərinin şəxsi təşəbbüsü ilə icra edilir",
            "Müvafiq dövlət qurumları tərəfindən dövri olaraq aparılmalı və aşkar edilən risklər aradan qaldırılmalıdır"
        ],
        "correct_answer": "Müvafiq dövlət qurumları tərəfindən dövri olaraq aparılmalı və aşkar edilən risklər aradan qaldırılmalıdır",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və milli antikorrupsiya standartları — Dövlət orqanlarında korrupsiya risklərinin qiymətləndirilməsi dövri olaraq həyata keçirilməli, risk sahələri müəyyənləşdirilərək onların aradan qaldırılması üçün preventiv tədbirlər planı icra olunmalıdır.",
        "hint": "Korrupsiya risklərinin qiymətləndirilməsi dövlət orqanları tərəfindən dövri və məcburi qaydada aparılır."
    },
    {
        "id": "60a9052b-d140-4c34-9494-a95d89316857",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxs barəsində bilə-bilə yalan və qərəzli korrupsiya məlumatı yayan şəxsin hüquqi vəziyyəti necədir?",
        "options": [
            "Qanunvericiliklə müəyyən edilmiş qaydada böhtana və ya yalan məlumata görə məsuliyyət daşıyır",
            "Dövlət orqanları tərəfindən xüsusi təltif edilərək maddi mükafatlandırılır",
            "Heç bir hüquqi məsuliyyət daşımadan sərbəst şəkildə fəaliyyətini davam etdirir",
            "Hüquq-mühafizə orqanları tərəfindən xüsusi dövlət toxunulmazlığı statusu əldə edir"
        ],
        "correct_answer": "Qanunvericiliklə müəyyən edilmiş qaydada böhtana və ya yalan məlumata görə məsuliyyət daşıyır",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 147 — Korrupsiya hüquqpozmaları barədə bilə-bilə yalan məlumat verən, digər şəxsin şərəf və ləyaqətini ləkələyən şəxslər qanunvericiliklə müəyyən edilmiş qaydada cinayət (böhtan) və ya mülki-hüquqi məsuliyyət daşıyırlar.",
        "hint": "Bilə-bilə yalan və uydurma məlumat yayan şəxs böhtana görə cinayət və ya mülki məsuliyyətə cəlb olunur."
    },
    {
        "id": "628baec0-2ff4-4d3e-ae5b-6704967b01b1",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, dövlət orqanlarının fəaliyyətində ictimai şəffaflığın təmin edilməsi üçün hansı tədbir tələb olunur?",
        "options": [
            "Vəzifəli şəxslərlə bağlı bütün məlumatların dövlət sirri elan edilərək məxfiləşdirilməsi",
            "Kütləvi informasiya vasitələri ilə hər hansı rəsmi əlaqələrin tamamilə məhdudlaşdırılması",
            "Vəzifəli şəxslərin qəbul günlərinin ləğv edilərək fiziki müraciətlərin dayandırılması",
            "Fəaliyyət haqqında məlumatların rəsmi internet saytlarında mütəmadi açıqlanması və ictimaiyyətə təqdim edilməsi"
        ],
        "correct_answer": "Fəaliyyət haqqında məlumatların rəsmi internet saytlarında mütəmadi açıqlanması və ictimaiyyətə təqdim edilməsi",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və “İnformasiya əldə etmək haqqında” AR Qanunu — Dövlət orqanlarında şəffaflığın və hesabatlılığın artırılması məqsədilə həyata keçirilən tədbirlər, büdcə xərcləmələri və göstərilən xidmətlər barədə məlumatlar rəsmi internet resurslarında mütəmadi olaraq açıqlanmalıdır.",
        "hint": "Şəffaflıq fəaliyyət barədə məlumatların rəsmi internet saytlarında mütəmadi açıqlanması ilə təmin edilir."
    },
    {
        "id": "ea4e856d-7d9f-4751-b00d-685e581afe29",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, korrupsiya faktı barədə anonim məlumat daxil olduqda həmin məlumat necə tənzimlənir?",
        "options": [
            "Daxil olduğu anda hüquqi qüvvəyə malik olmadığı üçün dərhal baxılmadan saxlanılır",
            "Məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər",
            "Yalnız kütləvi informasiya vasitələrində dərci üçün rəsmi redaksiyalara göndərilir",
            "Məlumat verən şəxsin şəxsiyyəti müəyyənləşdirilərək inzibati məsuliyyətə cəlb olunur"
        ],
        "correct_answer": "Məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və cinayət-prosessual normalar — Anonim məlumatlar ümumi qaydada baxılmasa da, həmin məlumatda konkret cinayət tərkibinin əlamətləri göstərildikdə, qanunvericiliklə müəyyən edilmiş qaydada əməliyyat-axtarış orqanları tərəfindən yoxlanılması təmin edilir.",
        "hint": "Anonim məlumatda cinayət tərkibinin əlamətləri göstərildikdə əməliyyat-axtarış orqanları tərəfindən yoxlanıla bilər."
    },
    {
        "id": "016a18a7-bb51-464a-b7b3-9fd7c7971ea9",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, yaxın qohumların birgə işləməsinə (qulluq etməsinə) yol verilməməsi qaydası hansı hala şamil edilir?",
        "options": [
            "Eyni mərkəzi icra hakimiyyəti orqanının strukturuna daxil olmayan fərqli qurumlarda çalışmağa",
            "Fərqli sahələrdə və müxtəlif regional təşkilatlarda dövlət qulluğu vəzifəsi tutmağa",
            "Yalnız özəl sektor subyektlərində və kommersiya qurumlarında fəaliyyət göstərməyə",
            "Birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməyə"
        ],
        "correct_answer": "Birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməyə",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 7 — Yaxın qohumların birbaşa tabelikdə və ya nəzarətdə olan dövlət qulluğu vəzifələrində birgə qulluq keçmələrinə yol verilmir; bu məhdudiyyət maraqlar konfliktinin yaranmasının qarşısını almaq məqsədi daşıyır.",
        "hint": "Yaxın qohumların birbaşa tabelikdə və ya nəzarətdə olan vəzifələrdə birgə qulluq keçməsi qadağandır."
    },
    {
        "id": "0ba8704d-6b23-4abe-8b99-49d970710249",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa əsasən, korrupsiya nədir?",
        "options": [
            "Vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən qanunsuz olaraq maddi və digər nemətlər əldə etmək üçün istifadə etməsidir",
            "Dövlət qulluqçusunun daxili əmək intizamı qaydalarını və iş rejimi tələblərini təkrar pozmasıdır",
            "Vəzifəli şəxsin xidməti fəaliyyətində təcrübəsizlikdən dolayı texniki və sənədləşmə xətalarına yol verməsidir",
            "Dövlət orqanının daxili sənəd dövriyyəsində sənədlərin qeydiyyat və icra müddətlərini gecikdirməsidir"
        ],
        "correct_answer": "Vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən qanunsuz olaraq maddi və digər nemətlər əldə etmək üçün istifadə etməsidir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 1 — Qanunun 1-ci maddəsinə əsasən, korrupsiya — vəzifəli şəxslərin öz statusundan, vəzifə səlahiyyətlərindən və ya həmin status və səlahiyyətlərdən irəli gələn imkanlardan istifadə etməklə qanunsuz olaraq maddi və sair nemətlər, imtiyazlar və ya güzəştlər əldə etməsi, habelə fiziki və hüquqi şəxslər tərəfindən həmin nemətlərin vəzifəli şəxslərə qanunsuz təklif, vəd olunması və ya verilməsidir.",
        "hint": "Korrupsiya sadə əmək intizamı pozuntusu deyil, vəzifə səlahiyyətindən qanunsuz maddi və sair nemətlər əldə etmək üçün sui-istifadədir."
    },
    {
        "id": "f30e05b8-4e9a-4028-95ba-134a814f0592",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxsin xidməti səlahiyyətlərinin icrası ilə əlaqədar hər hansı hərəkətin (və ya hərəkətsizliyin) müqabilində qanunsuz olaraq maddi və ya sair nemət tələb etməsi necə qiymətləndirilir?",
        "options": [
            "Tərəflərin qarşılıqlı razılığı ilə tənzimlənən mülki-hüquqi xarakterli borc münasibətidir",
            "Dövlət orqanının daxili büdcəsinin formalaşdırılmasına xidmət edən könüllü ödənişdir",
            "Xidməti fəaliyyətin səmərəliliyini artıran stimullaşdırıcı mükafatlandırma formasıdır",
            "Rüşvətxorluq (rüşvət almaq) cinayətidir"
        ],
        "correct_answer": "Rüşvətxorluq (rüşvət almaq) cinayətidir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu və AR Cinayət Məcəlləsi Maddə 311 — Vəzifəli şəxsin xidməti səlahiyyətlərinin icrası və ya icra edilməməsi müqabilində qanunsuz olaraq maddi nemətlər və ya pul tələb etməsi birbaşa rüşvətxorluq (rüşvət almaq) cinayətidir və cinayət məsuliyyəti yaradır.",
        "hint": "Vəzifə səlahiyyətinin icrası və ya icra edilməməsi müqabilində nemət tələb etmək rüşvət alma cinayətidir."
    },
    {
        "id": "c13f9c3f-03a6-4850-8c2b-6a713f2c65e2",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və antikorrupsiya qanunvericiliyinə əsasən, dövlət orqanlarında daxili nəzarət mexanizmlərinin yaradılması hansı məqsədi daşıyır?",
        "options": [
            "Dövlət orqanlarının müstəqil qərarvermə səlahiyyətlərini tam məhdudlaşdıran qadağan olunmuş tədbirdir",
            "Təşkilat daxilində işçilərin kütləvi şəkildə işdən azad edilməsinə səbəb olan mexanizmdir",
            "Yalnız xarici ölkələrin audit şirkətləri və beynəlxalq təşkilatlar tərəfindən tətbiq olunur",
            "Korrupsiyaya şərait yaradan halların vaxtında aşkarlanmasına və preventiv olaraq aradan qaldırılmasına xidmət edir"
        ],
        "correct_answer": "Korrupsiyaya şərait yaradan halların vaxtında aşkarlanmasına və preventiv olaraq aradan qaldırılmasına xidmət edir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 6 — Dövlət orqanlarında daxili nəzarət mexanizmlərinin yaradılması korrupsiyaya şərait yaradan səbəb və şəraitin vaxtında aşkarlanmasına, habelə onların aradan qaldırılması üçün profilaktik tədbirlərin görülməsinə xidmət edir.",
        "hint": "Daxili nəzarət korrupsiyaya şərait yaradan halların vaxtında aşkarlanması və aradan qaldırılması məqsədilə təsis edilir."
    },
    {
        "id": "7d3e3a85-caa8-426e-9d0b-b60ea5955b34",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, vəzifəli şəxsin xidməti fəaliyyətində maraqların toqquşması (mənfəətlər toqquşması) yarandıqda o, necə davranmalıdır?",
        "options": [
            "Maraqlar konfliktini öz şəxsi mülahizələrinə əsasən sərbəst şəkildə həll etməlidir",
            "Məsələni dərhal xarici audit şirkətlərinə və ya beynəlxalq qurumlara ötürməlidir",
            "Şəxsi marağını üstün tutaraq qərarı gizli şəkildə öz xeyrinə imzalamalıdır",
            "Məsələnin həllində iştirak etməməli və dərhal rəhbərliyə yazılı məlumat verməlidir"
        ],
        "correct_answer": "Məsələnin həllində iştirak etməməli və dərhal rəhbərliyə yazılı məlumat verməlidir",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 9 — Vəzifəli şəxsin xidməti fəaliyyətində maraqların toqquşması yarandığı hallarda o, bu barədə dərhal rəhbərliyə yazılı məlumat verməli və həmin məsələnin həllində iştirak etməkdən çəkinməlidir.",
        "hint": "Maraqlar toqquşması olduqda vəzifəli şəxs dərhal rəhbərliyə yazılı məlumat verməli və həll prosesindən çəkilməlidir."
    },
    {
        "id": "11e713e3-2976-4bd0-9a0a-af86f59379f5",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, korrupsiya hüquqpozmaları haqqında məlumat verən şəxslərin (whistleblower) dövlət tərəfindən müdafiəsi necə tənzimlənir?",
        "options": [
            "Həmin şəxs daxili intizam qaydalarının pozulmasına görə dərhal tutduğu vəzifədən azad edilir",
            "Məlumat verən şəxsin şəxsiyyəti və fərdi məlumatları kütləvi informasiya vasitələrində açıqlanır",
            "Həmin şəxsin hüquqları, iş yeri və təhlükəsizliyi dövlət tərəfindən qorunur, məlumat verən şəxs təqib edilə bilməz",
            "Təşkilatın daxili qərarı ilə həmin şəxsə qarşı inzibati xarakterli maliyyə cərimələri tətbiq olunur"
        ],
        "correct_answer": "Həmin şəxsin hüquqları, iş yeri və təhlükəsizliyi dövlət tərəfindən qorunur, məlumat verən şəxs təqib edilə bilməz",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 11-1 — Korrupsiya hüquqpozmaları barədə məlumat verən şəxslərin təhlükəsizliyi, hüquqları və iş yeri dövlət tərəfindən qorunur; həmin şəxslər verdikləri məlumatlara görə qanunsuz olaraq təqib edilə, intizam tənbehinə məruz qala və ya işdən çıxarıla bilməzlər.",
        "hint": "Məlumat verən şəxslərin təhlükəsizliyi, iş yeri və hüquqları dövlət tərəfindən qorunur və təqib olunmaları qadağandır."
    },
    {
        "id": "ff6e5158-cca2-4189-b91a-004eaca04704",
        "question_text": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanununa və qanunvericiliyin tələblərinə əsasən, yaxın qohumlara kimlər aiddir?",
        "options": [
            "Şəxsin qonşuluqda yaşayan yaxın tanışları və dostları",
            "Eyni idarə və ya təşkilatda çalışan əməkdaşlar və iş yoldaşları",
            "Ər-arvad, valideynlər, uşaqlar, övladlığa götürənlər, qardaşlar, bacılar, babalar, nənələr, nəvələr, ər-arvadın valideynləri, qardaşları, bacıları",
            "Uzaq qohumluq əlaqəsi olan əmiuşaqları, xalauşaqları və dayıuşaqları"
        ],
        "correct_answer": "Ər-arvad, valideynlər, uşaqlar, övladlığa götürənlər, qardaşlar, bacılar, babalar, nənələr, nəvələr, ər-arvadın valideynləri, qardaşları, bacıları",
        "explanation": "“Korrupsiyaya qarşı mübarizə haqqında” AR Qanunu Maddə 7.2 — Qanunun 7.2-ci maddəsinə əsasən, yaxın qohumlar dedikdə vəzifəli şəxsin əri (arvadı), valideynləri, babaları, nənələri, uşaqları, nəvələri, övladlığa götürənləri (götürülənləri), qardaşları və bacıları, habelə ərinin (arvadının) valideynləri, babaları, nənələri, qardaşları və bacıları başa düşülür.",
        "hint": "Yaxın qohumlar ər-arvad, valideynlər, babalar, nənələr, uşaqlar, nəvələr, qardaş-bacılar və ər-arvadın qohumlarıdır."
    }
]

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

errors = []
lines = [
    "-- Refinement of Modul 6: Korrupsiyaya Qarsi Mubarize (29 Questions)",
    "-- Atomic transaction updating both questions and question_bank tables",
    "BEGIN;",
    ""
]

if len(modul6_updates) != 29:
    errors.append(f"Expected 29 questions, got {len(modul6_updates)}")

seen_ids = set()
for idx, q in enumerate(modul6_updates):
    qid = q["id"]
    if qid in seen_ids:
        errors.append(f"Duplicate id: {qid}")
    seen_ids.add(qid)

    txt = q["question_text"].strip()
    opts = q["options"]
    ans = q["correct_answer"].strip()
    exp = q["explanation"].strip()
    hint = q["hint"].strip()

    if len(opts) != 4:
        errors.append(f"Order {idx} (ID {qid}): Expected 4 options, got {len(opts)}")

    if ans not in opts:
        errors.append(f"Order {idx} (ID {qid}): Correct answer not in options! Ans: {ans}")

    if re.search(r'düzgün cavab [a-e]|doğru cavab [a-e]|variantı', exp, re.IGNORECASE):
        errors.append(f"Order {idx} (ID {qid}): Static letter in explanation: {exp}")

    if "nəzərə alın" in hint.lower():
        errors.append(f"Order {idx} (ID {qid}): Template hint: {hint}")

    sql_txt = escape_sql(txt)
    sql_opts = escape_sql(json.dumps(opts, ensure_ascii=False))
    sql_ans = escape_sql(ans)
    sql_exp = escape_sql(exp)
    sql_hint = escape_sql(hint)

    lines.append(f"-- Order {idx}: ID {qid}")
    lines.append("UPDATE questions SET")
    lines.append(f"    question_text = {sql_txt},")
    lines.append(f"    options = {sql_opts}::jsonb,")
    lines.append(f"    correct_answer = {sql_ans},")
    lines.append(f"    explanation = {sql_exp},")
    lines.append(f"    hint = {sql_hint}")
    lines.append(f"WHERE id = '{qid}';")
    lines.append("")
    # Also update question_bank row
    lines.append("UPDATE question_bank SET")
    lines.append(f"    question_text = {sql_txt},")
    lines.append(f"    options = {sql_opts}::jsonb,")
    lines.append(f"    correct_answer = {sql_ans},")
    lines.append(f"    explanation = {sql_exp},")
    lines.append(f"    hint = {sql_hint}")
    lines.append(f"WHERE id = (SELECT bank_question_id FROM questions WHERE id = '{qid}');")
    lines.append("")

lines.append("COMMIT;")

if errors:
    print("VALIDATION FAILED:")
    for err in errors:
        print(" -", err)
    exit(1)

out_file = "/srv/quizspark-azeri/scripts/update_modul6.sql"
with open(out_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Validation 100% PASSED! All 29 questions valid.")
print(f"SQL written to: {out_file}")
