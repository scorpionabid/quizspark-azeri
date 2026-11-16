#!/usr/bin/env python3
"""
enrich_quizzes_with_diverse_types.py

1. Converts existing matching-candidate questions in Constitution quizzes to true 'matching' format.
2. Injects high-yield, pedagogically rigorous matching, multiple_select, and ordering questions
   into each of the 11 Constitution chapter quizzes and the final composite exam.
3. Automatically sets partial_credit_enabled = true for matching and multiple_select.
"""

import subprocess
import json
import uuid

def run_psql(query):
    cmd = [
        'docker', 'exec', '-i', 'supabase-db',
        'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A'
    ]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = p.communicate(input=query)
    if p.returncode != 0:
        raise RuntimeError(f"psql error: {err}\nQuery:\n{query}")
    return out

def get_quizzes_map():
    sql = """
    SELECT json_object_agg(title, id)
    FROM quizzes
    WHERE title ILIKE '%Konstitusiya%' AND is_published = true;
    """
    res = run_psql(sql).strip()
    return json.loads(res)

def main():
    quiz_map = get_quizzes_map()
    print(f"Loaded {len(quiz_map)} Constitution quizzes.")

    # 1. Convert question a0006e57-7b56-4262-9b49-6caeeb7b4def to matching
    q_convert_sql = """
    UPDATE questions
    SET 
        question_type = 'matching',
        matching_pairs = '{"1) Ər ilə arvadın hüquqları": "bərabərdir", "2) Kişi ilə qadının hüquqları": "eynidir", "3) Kişi ilə qadının azadlıqları": "eynidir"}'::jsonb,
        options = NULL,
        correct_answer = '1) Ər ilə arvadın hüquqları:bərabərdir|||2) Kişi ilə qadının hüquqları:eynidir|||3) Kişi ilə qadının azadlıqları:eynidir',
        partial_credit_enabled = true,
        explanation = 'AR Konstitusiyası Maddə 25 və 34: Ər ilə arvadın hüquqları bərabərdir. Kişi ilə qadının hüquq və azadlıqları eynidir.'
    WHERE id = 'a0006e57-7b56-4262-9b49-6caeeb7b4def';
    """
    run_psql(q_convert_sql)
    print("Converted existing matching question a0006e57-7b56-4262-9b49-6caeeb7b4def.")

    # New questions dataset categorized by quiz title keyword
    new_questions = [
        # ---------------------------------------------------------
        # QUIZ 1: Preambula və Dövlətin Əsasları (Fəsil 1-2)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "1. Preambula və Dövlətin Əsasları",
            "type": "ordering",
            "title": "Preambula Niyyətlərinin Ardıcıllığı",
            "text": "Azərbaycan Respublikası Konstitusiyasının Preambulasında təsbit olunmuş niyyətlərin ardıcıllığını müəyyən edin:",
            "sequence_items": [
                "1. Azərbaycan dövlətinin müstəqilliyini, suverenliyini və ərazi bütövlüyünü qorumaq",
                "2. Konstitusiya çərçivəsində demokratik quruluşa təminat vermək",
                "3. Vətəndaş cəmiyyətinin bərqərar edilməsinə nail olmaq",
                "4. Xalqın iradəsinin ifadəsi kimi qanunların aliliyini təmin edən hüquqi, dünyəvi dövlət qurmaq",
                "5. Ədalətli iqtisadi və sosial qaydalara uyğun olaraq hamının layiqli həyat səviyyəsini təmin etmək",
                "6. Bütün dünya xalqları ilə dostluq, sülh və əmin-amanlıq şəraitində yaşamaq"
            ],
            "correct_answer": "1. Azərbaycan dövlətinin müstəqilliyini, suverenliyini və ərazi bütövlüyünü qorumaq|||2. Konstitusiya çərçivəsində demokratik quruluşa təminat vermək|||3. Vətəndaş cəmiyyətinin bərqərar edilməsinə nail olmaq|||4. Xalqın iradəsinin ifadəsi kimi qanunların aliliyini təmin edən hüquqi, dünyəvi dövlət qurmaq|||5. Ədalətli iqtisadi və sosial qaydalara uyğun olaraq hamının layiqli həyat səviyyəsini təmin etmək|||6. Bütün dünya xalqları ilə dostluq, sülh və əmin-amanlıq şəraitində yaşamaq",
            "explanation": "AR Konstitusiyasının Preambulasında Azərbaycan xalqının bəyan etdiyi təntənəli niyyətlərin rəsmi mətn ardıcıllığıdır.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "1. Preambula və Dövlətin Əsasları",
            "type": "matching",
            "title": "Dövlət Quruluşu və Hakimiyyət Prinsipləri",
            "text": "Azərbaycan Respublikası Konstitusiyasının ilk fəsillərində təsbit edilmiş prinsipləri və onların müvafiq müddəalarını uyğunlaşdırın:",
            "matching_pairs": {
                "Dövlət hakimiyyətinin yeganə mənbəyi": "Azərbaycan xalqıdır (Maddə 1)",
                "Dövlətin xarakterik əlamətləri": "Demokratik, hüquqi, dünyəvi, unitar respublika (Maddə 7)",
                "Hakimiyyətlərin bölünməsi": "Qanunvericilik, İcra və Məhkəmə hakimiyyəti (Maddə 7)",
                "Azərbaycan dövlətinin başçısı": "Azərbaycan Respublikasının Prezidenti (Maddə 8)"
            },
            "correct_answer": "Dövlət hakimiyyətinin yeganə mənbəyi:Azərbaycan xalqıdır (Maddə 1)|||Dövlətin xarakterik əlamətləri:Demokratik, hüquqi, dünyəvi, unitar respublika (Maddə 7)|||Hakimiyyətlərin bölünməsi:Qanunvericilik, İcra və Məhkəmə hakimiyyəti (Maddə 7)|||Azərbaycan dövlətinin başçısı:Azərbaycan Respublikasının Prezidenti (Maddə 8)",
            "explanation": "AR Konstitusiyasının 1, 7 və 8-ci maddələrinə əsasən təsbit olunmuş təməl dövlətçilik prinsipləridir.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "1. Preambula və Dövlətin Əsasları",
            "type": "multiple_select",
            "title": "Yalnız Referendumla Həll Olunan Məsələlər",
            "text": "Azərbaycan Respublikası Konstitusiyasının 3-cü maddəsinə əsasən YALNIZ REFERENDUMLA həll oluna bilən məsələləri seçin (Bütün doğru bəndləri qeyd edin):",
            "options": [
                "Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi və ona dəyişikliklər edilməsi",
                "Azərbaycan Respublikasının dövlət sərhədlərinin dəyişdirilməsi",
                "Vergilər və dövlət büdcəsinin təsdiq edilməsi",
                "Amnistiya və əfv etmə aktlarının qəbul edilməsi",
                "Vəzifəli şəxslərin seçilməsi və ya təyin edilməsi"
            ],
            "correct_answer": "Azərbaycan Respublikasının Konstitusiyasının qəbul edilməsi və ona dəyişikliklər edilməsi, Azərbaycan Respublikasının dövlət sərhədlərinin dəyişdirilməsi",
            "explanation": "AR Konstitusiyası Maddə 3-ə əsasən yalnız iki məsələ ümumxalq səsverməsi — referendumla həll oluna bilər: 1) Konstitusiyanın qəbulu və dəyişikliklər; 2) Dövlət sərhədlərinin dəyişdirilməsi. Vergilər, amnistiya və vəzifə təyinatları isə referenduma qoyula BİLMƏZ (Maddə 3, hissə II).",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 2: Hüquqlar (Hissə 1/2: Maddə 24-45)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 1/2: Maddə 24-45)",
            "type": "matching",
            "title": "Şəxsi Hüquqlar və Onların Zəmanəti",
            "text": "AR Konstitusiyasında təsbit olunmuş şəxsi hüquqları onların müvafiq konstitusion təminatı ilə uyğunlaşdırın:",
            "matching_pairs": {
                "Maddə 27. Yaşamaq hüququ": "Dövlətə silahlı basqın zamanı düşmən əsgərlərinin öldürülməsi istisna olmaqla hər bir şəxsin toxunulmaz hüququdur",
                "Maddə 28. Azadlıq hüququ": "Yalnız qanunla nəzərdə tutulmuş qaydada tutulma, həbsəalma və ya azadlıqdan məhrumetmə yolu ilə məhdudlaşdırıla bilər",
                "Maddə 31. Təhlükəsiz yaşamaq hüququ": "Qanunla nəzərdə tutulmuş hallar istisna olmaqla, şəxsin həyatına, fiziki və mənəvi sağlamlığına qəsd etmək qadağandır",
                "Maddə 33. Mənzil toxunulmazlığı hüququ": "Məhkəmənin qərarı və ya qanunla müəyyən edilmiş hallar istisna olmaqla heç kəs mənzilə daxil ola bilməz"
            },
            "correct_answer": "Maddə 27. Yaşamaq hüququ:Dövlətə silahlı basqın zamanı düşmən əsgərlərinin öldürülməsi istisna olmaqla hər bir şəxsin toxunulmaz hüququdur|||Maddə 28. Azadlıq hüququ:Yalnız qanunla nəzərdə tutulmuş qaydada tutulma, həbsəalma və ya azadlıqdan məhrumetmə yolu ilə məhdudlaşdırıla bilər|||Maddə 31. Təhlükəsiz yaşamaq hüququ:Qanunla nəzərdə tutulmuş hallar istisna olmaqla, şəxsin həyatına, fiziki və mənəvi sağlamlığına qəsd etmək qadağandır|||Maddə 33. Mənzil toxunulmazlığı hüququ:Məhkəmənin qərarı və ya qanunla müəyyən edilmiş hallar istisna olmaqla heç kəs mənzilə daxil ola bilməz",
            "explanation": "AR Konstitusiyası Maddə 27, 28, 31 və 33.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 1/2: Maddə 24-45)",
            "type": "multiple_select",
            "title": "Mülkiyyət Hüququnun Təminatları",
            "text": "AR Konstitusiyasının 29-cu maddəsinə əsasən mülkiyyət hüququna aid olan doğru müddəaları seçin:",
            "options": [
                "Hər kəsin mülkiyyət hüququ vardır",
                "Mülkiyyətin heç bir növünə üstünlük verilmir",
                "Mülkiyyət hüququ, o cümlədən xüsusi mülkiyyət hüququ qanunla qorunur",
                "Dövlət ehtiyacları üçün mülkiyyətin özgəninkiləşdirilməsinə yalnız qabaqcadan onun dəyərini ədalətli ödəmək şərti ilə yol verilə bilər",
                "Xüsusi mülkiyyət sosial öhdəliklərə səbəb olmur",
                "Mülkiyyətdən insan və vətəndaş hüquqları və azadlıqları əleyhinə istifadə edilə bilər"
            ],
            "correct_answer": "Hər kəsin mülkiyyət hüququ vardır, Mülkiyyətin heç bir növünə üstünlük verilmir, Mülkiyyət hüququ, o cümlədən xüsusi mülkiyyət hüququ qanunla qorunur, Dövlət ehtiyacları üçün mülkiyyətin özgəninkiləşdirilməsinə yalnız qabaqcadan onun dəyərini ədalətli ödəmək şərti ilə yol verilə bilər",
            "explanation": "AR Konstitusiyasının 29-cu maddəsinə əsasən mülkiyyətin bütün növləri bərabərdir və qorunur. Xüsusi mülkiyyət sosial öhdəliklərə səbəb olur və mülkiyyətdən insan hüquqları əleyhinə istifadə edilə bilməz.",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 3: Hüquqlar (Hissə 2/2: Maddə 46-71)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 2/2: Maddə 46-71)",
            "type": "multiple_select",
            "title": "Heç Bir Halda Məhdudlaşdırıla Bilməyən Hüquqlar",
            "text": "AR Konstitusiyasının 71-ci maddəsinə əsasən müharibə, hərbi və ya fövqəladə vəziyyət elan edildikdə belə MƏHDUDLAŞDIRILA BİLMƏYƏN hüquq və azadlıqları seçin:",
            "options": [
                "Yaşamaq hüququ (hərbi əməliyyatlar istisna olmaqla)",
                "Vicdan, fikir və əqidə azadlığı",
                "Şərəf və ləyaqətin müdafiəsi hüququ",
                "Təqsirsizlik prezumpsiyası",
                "Fikir və söz azadlığı",
                "Sərbəst toplaşmaq azadlığı"
            ],
            "correct_answer": "Yaşamaq hüququ (hərbi əməliyyatlar istisna olmaqla), Vicdan, fikir və əqidə azadlığı, Şərəf və ləyaqətin müdafiəsi hüququ, Təqsirsizlik prezumpsiyası",
            "explanation": "AR Konstitusiyasının 71-ci maddəsinin III hissəsinə əsasən hətta fövqəladə vəziyyətdə belə yaşamaq hüququ, vicdan azadlığı, şəxsiyyətin ləyaqəti və təqsirsizlik prezumpsiyası məhdudlaşdırıla bilməz. Fikir, söz və sərbəst toplaşmaq azadlığı isə məhdudlaşdırıla bilər.",
            "weight": 2.5
        },
        {
            "quiz_keyword": "2. Əsas İnsan və Vətəndaş Hüquqları (Hissə 2/2: Maddə 46-71)",
            "type": "matching",
            "title": "Hüquq Kateqoriyalarının Təsnifatı",
            "text": "Konstitusion hüquq və azadlıqları onların aid olduğu hüquq kateqoriyaları ilə uyğunlaşdırın:",
            "matching_pairs": {
                "Şəxsi hüquq və azadlıqlar": "Yaşamaq, Azadlıq, Şəxsi toxunulmazlıq",
                "Siyasi hüquq və azadlıqlar": "Dövlətin idarə olunmasında iştirak, Seçki, Müraciət etmək",
                "İqtisadi və sosial hüquqlar": "Mülkiyyət, Əmək, Tətil, Sosial təminat",
                "Mədəni hüquqlar": "Mədəniyyət hüququ, Yaradıcılıq azadlığı"
            },
            "correct_answer": "Şəxsi hüquq və azadlıqlar:Yaşamaq, Azadlıq, Şəxsi toxunulmazlıq|||Siyasi hüquq və azadlıqlar:Dövlətin idarə olunmasında iştirak, Seçki, Müraciət etmək|||İqtisadi və sosial hüquqlar:Mülkiyyət, Əmək, Tətil, Sosial təminat|||Mədəni hüquqlar:Mədəniyyət hüququ, Yaradıcılıq azadlığı",
            "explanation": "Konstitusiya hüququ nəzəriyyəsində və AR Konstitusiyasında hüquqların 4 əsas qrupu.",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 4: Vətəndaşların Əsas Vəzifələri (Maddə 72-80)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "3. Vətəndaşların Əsas Vəzifələri",
            "type": "matching",
            "title": "Vətəndaşların Əsas Vəzifələri və Maddələr",
            "text": "AR Konstitusiyasında təsbit edilmiş əsas vəzifələri müvafiq maddələrlə uyğunlaşdırın:",
            "matching_pairs": {
                "Maddə 73": "Vergilər və digər dövlət ödənişlərini ödəmək vəzifəsi",
                "Maddə 74": "Vətənə sədaqət və dövlət rəmzlərinə hörmət vəzifəsi",
                "Maddə 76": "Vətəni müdafiə və hərbi xidmət vəzifəsi",
                "Maddə 77": "Tarix və mədəniyyət abidələrini qorumaq vəzifəsi",
                "Maddə 78": "Ətraf mühiti qorumaq vəzifəsi"
            },
            "correct_answer": "Maddə 73:Vergilər və digər dövlət ödənişlərini ödəmək vəzifəsi|||Maddə 74:Vətənə sədaqət və dövlət rəmzlərinə hörmət vəzifəsi|||Maddə 76:Vətəni müdafiə və hərbi xidmət vəzifəsi|||Maddə 77:Tarix və mədəniyyət abidələrini qorumaq vəzifəsi|||Maddə 78:Ətraf mühiti qorumaq vəzifəsi",
            "explanation": "AR Konstitusiyasının IV fəsli (Vətəndaşların əsas vəzifələri, Maddə 72-80).",
            "weight": 2.0
        },
        {
            "quiz_keyword": "3. Vətəndaşların Əsas Vəzifələri",
            "type": "multiple_select",
            "title": "Hər Bir Şəxsin Vəzifələri",
            "text": "AR Konstitusiyasına görə yalnız Azərbaycan vətəndaşlarının deyil, 'HƏR BİR ŞƏXSİN' (o cümlədən əcnəbilər və vətəndaşlığı olmayanların) borcu olan vəzifələri seçin:",
            "options": [
                "Konstitusiyaya və qanunlara əməl etmək (Maddə 72)",
                "Qanunla müəyyən edilmiş vergiləri və digər dövlət ödənişlərini ödəmək (Maddə 73)",
                "Tarix və mədəniyyət abidələrini qorumaq (Maddə 77)",
                "Ətraf mühiti qorumaq (Maddə 78)",
                "Vətənə sədaqətli olmaq (Maddə 74)",
                "Hərbi xidmət keçmək (Maddə 76)"
            ],
            "correct_answer": "Konstitusiyaya və qanunlara əməl etmək (Maddə 72), Qanunla müəyyən edilmiş vergiləri və digər dövlət ödənişlərini ödəmək (Maddə 73), Tarix və mədəniyyət abidələrini qorumaq (Maddə 77), Ətraf mühiti qorumaq (Maddə 78)",
            "explanation": "Vətənə sədaqət və Vətəni müdafiə (hərbi xidmət) yalnız AR vətəndaşının vəzifəsidir. Digər dörd vəzifə isə AR ərazisində olan hər bir şəxsin vəzifəsidir.",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 5 & 6: Milli Məclis (Maddə 81-98-1)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 1/2",
            "type": "multiple_select",
            "title": "Qanunvericilik Təşəbbüsü Subyektləri",
            "text": "AR Konstitusiyasının 96-cı maddəsinə əsasən Milli Məclisdə QANUNVERİCİLİK TƏŞƏBBÜSÜ hüququ olan subyektləri seçin (Bütün doğru bəndləri qeyd edin):",
            "options": [
                "Azərbaycan Respublikası Milli Məclisinin deputatları",
                "Azərbaycan Respublikasının Prezidenti",
                "Azərbaycan Respublikasının Ali Məhkəməsi",
                "Azərbaycan Respublikasının Baş Prokurorluğu",
                "Naxçıvan Muxtar Respublikasının Ali Məclisi",
                "Seçki hüququ olan 40 min nəfər Azərbaycan Respublikası vətəndaşı",
                "Azərbaycan Respublikasının Nazirlər Kabineti",
                "Azərbaycan Respublikasının Konstitusiya Məhkəməsi"
            ],
            "correct_answer": "Azərbaycan Respublikası Milli Məclisinin deputatları, Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikasının Ali Məhkəməsi, Azərbaycan Respublikasının Baş Prokurorluğu, Naxçıvan Muxtar Respublikasının Ali Məclisi, Seçki hüququ olan 40 min nəfər Azərbaycan Respublikası vətəndaşı",
            "explanation": "AR Konstitusiyası Maddə 96-ya əsasən 6 subyektin qanunvericilik təşəbbüsü hüququ vardır: Deputatlar, Prezident, Ali Məhkəmə, Baş Prokurorluq, Naxçıvan MR Ali Məclisi və 40 min seçici vətəndaş. Nazirlər Kabineti və Konstitusiya Məhkəməsinin isə təşəbbüs hüququ YOXDUR.",
            "weight": 2.5
        },
        {
            "quiz_keyword": "4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 2/2",
            "type": "ordering",
            "title": "Qanunvericilik Prosesinin Mərhələləri",
            "text": "Azərbaycan Respublikasında qanunun qəbul edilməsi və qüvvəyə minməsi prosesinin ardıcıllığını müəyyən edin:",
            "sequence_items": [
                "1. Səlahiyyətli subyekt tərəfindən qanun layihəsinin Milli Məclisə təqdim edilməsi (Təşəbbüs)",
                "2. Qanun layihəsinin Milli Məclisin komitələrində və plenar iclasında oxunuşlarda müzakirəsi",
                "3. Qanun layihəsinin səsə qoyularaq Milli Məclis tərəfindən qəbul edilməsi",
                "4. Qanunun 14 gün ərzində imzalanmaq üçün Azərbaycan Respublikasının Prezidentinə göndərilməsi",
                "5. Azərbaycan Respublikası Prezidentinin qanunu 56 gün ərzində imzalaması",
                "6. Qanunun rəsmi dərc edilməsi və dərc edildiyi gündən qüvvəyə minməsi"
            ],
            "correct_answer": "1. Səlahiyyətli subyekt tərəfindən qanun layihəsinin Milli Məclisə təqdim edilməsi (Təşəbbüs)|||2. Qanun layihəsinin Milli Məclisin komitələrində və plenar iclasında oxunuşlarda müzakirəsi|||3. Qanun layihəsinin səsə qoyularaq Milli Məclis tərəfindən qəbul edilməsi|||4. Qanunun 14 gün ərzində imzalanmaq üçün Azərbaycan Respublikasının Prezidentinə göndərilməsi|||5. Azərbaycan Respublikası Prezidentinin qanunu 56 gün ərzində imzalaması|||6. Qanunun rəsmi dərc edilməsi və dərc edildiyi gündən qüvvəyə minməsi",
            "explanation": "AR Konstitusiyası Maddə 96 və 97-yə əsasən qanunvericilik prosesinin tam konstitusion ardıcıllığı.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "4. Qanunvericilik Hakimiyyəti — Milli Məclis (Hissə 2/2",
            "type": "matching",
            "title": "Milli Məclisdə Qərarların Qəbulu üçün Səs Çoxluğu",
            "text": "Milli Məclisin qəbul etdiyi aktları və tələb olunan səs çoxluğunu uyğunlaşdırın:",
            "matching_pairs": {
                "Konstitusiya qanunları (Maddə 95)": "95 səs çoxluğu",
                "Referendum təyin edilməsi (Maddə 95)": "83 səs çoxluğu",
                "Milli Məclisin özünü buraxması (Maddə 98-1)": "83 səs çoxluğu",
                "Qanunlar — ümumi qaydalar (Maddə 94)": "63 səs çoxluğu",
                "Baş nazirin təyinatına razılıq verilməsi (Maddə 95)": "63 səs çoxluğu"
            },
            "correct_answer": "Konstitusiya qanunları (Maddə 95):95 səs çoxluğu|||Referendum təyin edilməsi (Maddə 95):83 səs çoxluğu|||Milli Məclisin özünü buraxması (Maddə 98-1):83 səs çoxluğu|||Qanunlar — ümumi qaydalar (Maddə 94):63 səs çoxluğu|||Baş nazirin təyinatına razılıq verilməsi (Maddə 95):63 səs çoxluğu",
            "explanation": "AR Konstitusiyası Maddə 94, 95 və 98-1.",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 7 & 8: İcra Hakimiyyəti — Prezident və Nazirlər Kabineti (Maddə 99-124)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "5. İcra Hakimiyyəti — Prezident (Hissə 1/2",
            "type": "ordering",
            "title": "Prezident Seçilməsi və Səlahiyyətlərə Başlama Mərhələləri",
            "text": "AR Prezidentinin seçilməsi və vəzifəsinin icrasına başlaması mərhələlərini ardıcıllıqla düzün:",
            "sequence_items": [
                "1. Ümumi, bərabər və birbaşa seçki hüququ əsasında səsvermənin keçirilməsi",
                "2. Mərkəzi Seçki Komissiyası tərəfindən seçkilərin yekunlarının Konstitusiya Məhkəməsinə təqdim edilməsi",
                "3. Konstitusiya Məhkəməsi tərəfindən Prezident seçkilərinin yekunlarının rəsmən elan edilməsi",
                "4. Nəticələrin elan olunduğu gündən başlayaraq 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə andiçmə mərasimi",
                "5. Andiçmə günündən başlayaraq Prezidentin öz səlahiyyətlərinin icrasına rəsmən başlaması"
            ],
            "correct_answer": "1. Ümumi, bərabər və birbaşa seçki hüququ əsasında səsvermənin keçirilməsi|||2. Mərkəzi Seçki Komissiyası tərəfindən seçkilərin yekunlarının Konstitusiya Məhkəməsinə təqdim edilməsi|||3. Konstitusiya Məhkəməsi tərəfindən Prezident seçkilərinin yekunlarının rəsmən elan edilməsi|||4. Nəticələrin elan olunduğu gündən başlayaraq 3 gün ərzində Konstitusiya Məhkəməsi hakimlərinin iştirakı ilə andiçmə mərasimi|||5. Andiçmə günündən başlayaraq Prezidentin öz səlahiyyətlərinin icrasına rəsmən başlaması",
            "explanation": "AR Konstitusiyası Maddə 101, 102 və 103.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "5. İcra Hakimiyyəti — Nazirlər Kabineti və Yerli İcra",
            "type": "matching",
            "title": "İcra Orqanlarının Qəbul Etdiyi Hüquqi Aktlar",
            "text": "İcra hakimiyyəti subyektləri ilə onların qəbul etdiyi normativ-hüquqi aktları uyğunlaşdırın:",
            "matching_pairs": {
                "AR Prezidenti (ümumi qaydalar müəyyən edildikdə)": "Fərman",
                "AR Prezidenti (başqa məsələlər üzrə)": "Sərəncam",
                "AR Nazirlər Kabineti (ümumi qaydalar müəyyən edildikdə)": "Qərar",
                "AR Nazirlər Kabineti (başqa məsələlər üzrə)": "Sərəncam",
                "Mərkəzi icra hakimiyyəti orqanları (nazirliklər)": "Qərar, əmr və təlimat"
            },
            "correct_answer": "AR Prezidenti (ümumi qaydalar müəyyən edildikdə):Fərman|||AR Prezidenti (başqa məsələlər üzrə):Sərəncam|||AR Nazirlər Kabineti (ümumi qaydalar müəyyən edildikdə):Qərar|||AR Nazirlər Kabineti (başqa məsələlər üzrə):Sərəncam|||Mərkəzi icra hakimiyyəti orqanları (nazirliklər):Qərar, əmr və təlimat",
            "explanation": "AR Konstitusiyası Maddə 113 və 120.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "5. İcra Hakimiyyəti — Nazirlər Kabineti və Yerli İcra",
            "type": "multiple_select",
            "title": "Nazirlər Kabinetinin İsteFası və Tərkibi",
            "text": "AR Konstitusiyasının 114 və 116-cı maddələrinə əsasən Nazirlər Kabineti haqqında doğru müddəaları seçin:",
            "options": [
                "Nazirlər Kabineti Azərbaycan Respublikası Prezidentinin yuxarı icra orqanıdır",
                "Nazirlər Kabineti Azərbaycan Respublikasının Prezidentinə tabedir və onun qarşısında cavabdehdir",
                "Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini icra etməyə başladığı gün Nazirlər Kabineti Prezidentə istefa verir",
                "Nazirlər Kabinetinin tərkibinə Baş nazir, onun müavinləri, nazirlər və digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri daxildir",
                "Nazirlər Kabineti Milli Məclis qarşısında məsuliyyət daşıyır",
                "Nazirlər Kabinetinin qərarları Milli Məclisin təsdiqindən sonra qüvvəyə minir"
            ],
            "correct_answer": "Nazirlər Kabineti Azərbaycan Respublikası Prezidentinin yuxarı icra orqanıdır, Nazirlər Kabineti Azərbaycan Respublikasının Prezidentinə tabedir və onun qarşısında cavabdehdir, Yeni seçilmiş Azərbaycan Respublikasının Prezidenti vəzifəsini icra etməyə başladığı gün Nazirlər Kabineti Prezidentə istefa verir, Nazirlər Kabinetinin tərkibinə Baş nazir, onun müavinləri, nazirlər və digər mərkəzi icra hakimiyyəti orqanlarının rəhbərləri daxildir",
            "explanation": "AR Konstitusiyası Maddə 114, 115 və 116-ya əsasən Nazirlər Kabineti Prezidentə tabedir və Prezident qarşısında cavabdehdir (Milli Məclisə tabe deyil).",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 9: Məhkəmə Hakimiyyəti və Prokurorluq (Maddə 125-133)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "6. Məhkəmə Hakimiyyəti və Prokurorluq",
            "type": "ordering",
            "title": "Məhkəmə İnstansiyalarının İyerarxiyası",
            "text": "Azərbaycan Respublikasında məhkəmə instansiyalarının iyerarxiyasını AŞAĞIDAN YUXARIYA doğru ardıcıllıqla düzün:",
            "sequence_items": [
                "1. Birinci instansiya məhkəmələri (Rayon/şəhər məhkəmələri, İnzibati, Kommersiya və Ağır cinayətlər məhkəmələri)",
                "2. Apellyasiya instansiyası məhkəmələri (Regional Apellyasiya məhkəmələri)",
                "3. Kassasiya instansiyası məhkəməsi (Azərbaycan Respublikasının Ali Məhkəməsi)",
                "4. Konstitusiya ədalət mühakiməsi orqanı (Azərbaycan Respublikasının Konstitusiya Məhkəməsi)"
            ],
            "correct_answer": "1. Birinci instansiya məhkəmələri (Rayon/şəhər məhkəmələri, İnzibati, Kommersiya və Ağır cinayətlər məhkəmələri)|||2. Apellyasiya instansiyası məhkəmələri (Regional Apellyasiya məhkəmələri)|||3. Kassasiya instansiyası məhkəməsi (Azərbaycan Respublikasının Ali Məhkəməsi)|||4. Konstitusiya ədalət mühakiməsi orqanı (Azərbaycan Respublikasının Konstitusiya Məhkəməsi)",
            "explanation": "AR Konstitusiyası Maddə 125, 130 və 131.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "6. Məhkəmə Hakimiyyəti və Prokurorluq",
            "type": "matching",
            "title": "Məhkəmə və Prokurorluq Vəzifələrinə Təyinat Qaydası",
            "text": "Vəzifələrlə onların təyinat qaydasını uyğunlaşdırın:",
            "matching_pairs": {
                "Konstitusiya Məhkəməsinin hakimləri": "Prezidentin təqdimatı ilə Milli Məclis təyin edir",
                "Ali Məhkəmənin hakimləri": "Prezidentin təqdimatı ilə Milli Məclis təyin edir",
                "Apellyasiya məhkəmələrinin hakimləri": "Prezidentin təqdimatı ilə Milli Məclis təyin edir",
                "Digər (birinci instansiya) məhkəmələrin hakimləri": "Azərbaycan Respublikasının Prezidenti vəzifəyə təyin edir",
                "Azərbaycan Respublikasının Baş prokuroru": "Prezidentin təqdimatı ilə Milli Məclis vəzifəyə təyin edir"
            },
            "correct_answer": "Konstitusiya Məhkəməsinin hakimləri:Prezidentin təqdimatı ilə Milli Məclis təyin edir|||Ali Məhkəmənin hakimləri:Prezidentin təqdimatı ilə Milli Məclis təyin edir|||Apellyasiya məhkəmələrinin hakimləri:Prezidentin təqdimatı ilə Milli Məclis təyin edir|||Digər (birinci instansiya) məhkəmələrin hakimləri:Azərbaycan Respublikasının Prezidenti vəzifəyə təyin edir|||Azərbaycan Respublikasının Baş prokuroru:Prezidentin təqdimatı ilə Milli Məclis vəzifəyə təyin edir",
            "explanation": "AR Konstitusiyası Maddə 95, 109 və 133.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "6. Məhkəmə Hakimiyyəti və Prokurorluq",
            "type": "multiple_select",
            "title": "Ədalət Mühakiməsinin Əsas Prinsipləri",
            "text": "AR Konstitusiyasının 127-ci maddəsinə əsasən hakimlərin müstəqilliyi və ədalət mühakiməsinin həyata keçirilməsinin əsas prinsiplərini seçin:",
            "options": [
                "Hakimlər müstəqildirlər, yalnız Azərbaycan Respublikasının Konstitusiyasına və qanunlarına tabedirlər",
                "Ədalət mühakiməsi tərəflərin hüquq bərabərliyi, faktlar əsasında və çəkişmə prinsipi ilə həyata keçirilir",
                "İşlərə bütün məhkəmələrdə aşkar baxılır (qanunla müəyyən edilmiş qapalı icraat halları istisna olmaqla)",
                "Məhkəmə icraatı dövlət dilində və ya yerli əhalinin çoxluq təşkil etdiyi dildə aparılır",
                "Məhkəmə icraatında iştirak edən, lakin icraatın aparıldığı dili bilməyən şəxslərin tərcüməçidən istifadə etmək hüququ təmin edilir",
                "Məhkəmə araşdırmasında icra hakimiyyəti orqanlarının rəyi həlledici qüvvəyə malikdir"
            ],
            "correct_answer": "Hakimlər müstəqildirlər, yalnız Azərbaycan Respublikasının Konstitusiyasına və qanunlarına tabedirlər, Ədalət mühakiməsi tərəflərin hüquq bərabərliyi, faktlar əsasında və çəkişmə prinsipi ilə həyata keçirilir, İşlərə bütün məhkəmələrdə aşkar baxılır (qanunla müəyyən edilmiş qapalı icraat halları istisna olmaqla), Məhkəmə icraatı dövlət dilində və ya yerli əhalinin çoxluq təşkil etdiyi dildə aparılır, Məhkəmə icraatında iştirak edən, lakin icraatın aparıldığı dili bilməyən şəxslərin tərcüməçidən istifadə etmək hüququ təmin edilir",
            "explanation": "AR Konstitusiyası Maddə 127. İcra hakimiyyətinin məhkəməyə müdaxiləsi və ya rəyinin həlledici olması yolverilməzdir.",
            "weight": 2.5
        },

        # ---------------------------------------------------------
        # QUIZ 10: Naxçıvan MR və Bələdiyyələr (Maddə 134-146)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "7. Naxçıvan MR və Bələdiyyələr",
            "type": "matching",
            "title": "Naxçıvan MR və Bələdiyyə İnstitutları",
            "text": "Naxçıvan Muxtar Respublikası və yerli özünüidarə orqanlarının statusunu uyğunlaşdırın:",
            "matching_pairs": {
                "Naxçıvan Muxtar Respublikası": "Azərbaycan Respublikasının tərkibində muxtar dövlətdir",
                "Naxçıvan MR ali vəzifəli şəxsi": "Naxçıvan MR Ali Məclisinin sədridir",
                "Bələdiyyələrin statusu": "Yerli özünüidarəni həyata keçirən nümayəndəli orqanlardır",
                "Bələdiyyələrin fəaliyyətinə inzibati nəzarət": "Müvafiq icra hakimiyyəti orqanı (Ədliyyə Nazirliyi) tərəfindən həyata keçirilir"
            },
            "correct_answer": "Naxçıvan Muxtar Respublikası:Azərbaycan Respublikasının tərkibində muxtar dövlətdir|||Naxçıvan MR ali vəzifəli şəxsi:Naxçıvan MR Ali Məclisinin sədridir|||Bələdiyyələrin statusu:Yerli özünüidarəni həyata keçirən nümayəndəli orqanlardır|||Bələdiyyələrin fəaliyyətinə inzibati nəzarət:Müvafiq icra hakimiyyəti orqanı (Ədliyyə Nazirliyi) tərəfindən həyata keçirilir",
            "explanation": "AR Konstitusiyası Maddə 134, 135, 142 və 146-1.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "7. Naxçıvan MR və Bələdiyyələr",
            "type": "multiple_select",
            "title": "Bələdiyyə Qərarlarında 2/3 Səs Çoxluğu",
            "text": "AR Konstitusiyasının 145-ci maddəsinə əsasən bələdiyyə iclaslarında ÜÇDƏ İKİ (2/3) SƏS ÇOXLUĞU ilə qəbul edilən məsələləri seçin:",
            "options": [
                "Bələdiyyə üzvlərinin səlahiyyətlərinin tanınması və ya səlahiyyətlərinə xitam verilməsi",
                "Bələdiyyənin reqlamentinin təsdiq edilməsi",
                "Bələdiyyə sədrinin və onun müavinlərinin seçilməsi və onların istefası",
                "Yerli vergilər və ödənişlərin müəyyən edilməsi",
                "Bələdiyyə büdcəsinin və onun icrası haqqında hesabatların təsdiq edilməsi",
                "Bələdiyyə mülkiyyətinin idarə olunması üzrə cari sərəncamlar"
            ],
            "correct_answer": "Bələdiyyə üzvlərinin səlahiyyətlərinin tanınması və ya səlahiyyətlərinə xitam verilməsi, Bələdiyyənin reqlamentinin təsdiq edilməsi, Bələdiyyə sədrinin və onun müavinlərinin seçilməsi və onların istefası, Yerli vergilər və ödənişlərin müəyyən edilməsi, Bələdiyyə büdcəsinin və onun icrası haqqında hesabatların təsdiq edilməsi",
            "explanation": "AR Konstitusiyası Maddə 145-in II hissəsinə əsasən sadalanan bu 5 əsas məsələ bələdiyyə üzvlərinin üçdə iki səs çoxluğu ilə qəbul edilir.",
            "weight": 2.5
        },

        # ---------------------------------------------------------
        # QUIZ 11: Qanunvericilik Sistemi və Əlavə/Dəyişikliklər (Maddə 147-158)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "8. Qanunvericilik Sistemi və Əlavə/Dəyişikliklər",
            "type": "ordering",
            "title": "Qanunvericilik Sisteminin Hüquqi Qüvvə İyerarxiyası",
            "text": "AR Konstitusiyasının 148-ci maddəsinə əsasən Azərbaycan Respublikasının qanunvericilik sisteminə daxil olan normativ hüquqi aktları ƏN YÜKSƏK QÜVVƏDƏN AŞAĞIYA doğru ardıcıllıqla düzün:",
            "sequence_items": [
                "1. Azərbaycan Respublikasının Konstitusiyası (Ali hüquqi qüvvəyə malikdir)",
                "2. Referendumla qəbul edilmiş aktlar",
                "3. Qanunlar (və təsdiq edilmiş dövlətlərarası beynəlxalq müqavilələr)",
                "4. Azərbaycan Respublikası Prezidentinin fərmanları",
                "5. Azərbaycan Respublikası Nazirlər Kabinetinin qərarları",
                "6. Mərkəzi icra hakimiyyəti orqanlarının normativ aktları"
            ],
            "correct_answer": "1. Azərbaycan Respublikasının Konstitusiyası (Ali hüquqi qüvvəyə malikdir)|||2. Referendumla qəbul edilmiş aktlar|||3. Qanunlar (və təsdiq edilmiş dövlətlərarası beynəlxalq müqavilələr)|||4. Azərbaycan Respublikası Prezidentinin fərmanları|||5. Azərbaycan Respublikası Nazirlər Kabinetinin qərarları|||6. Mərkəzi icra hakimiyyəti orqanlarının normativ aktları",
            "explanation": "AR Konstitusiyası Maddə 147, 148, 149 və 151.",
            "weight": 2.5
        },
        {
            "quiz_keyword": "8. Qanunvericilik Sistemi və Əlavə/Dəyişikliklər",
            "type": "multiple_select",
            "title": "Konstitusiyaya Dəyişiklik Təklif Etmək Səlahiyyəti",
            "text": "AR Konstitusiyasının 158-ci maddəsinə əsasən Azərbaycan Respublikasının Konstitusiyasına ƏLAVƏLƏR VƏ DƏYİŞİKLİKLƏR təklif etmək hüququ olan subyektləri seçin:",
            "options": [
                "Azərbaycan Respublikasının Prezidenti",
                "Azərbaycan Respublikası Milli Məclisinin ən azı 63 deputatı",
                "Azərbaycan Respublikasının Ali Məhkəməsi",
                "Naxçıvan Muxtar Respublikasının Ali Məclisi",
                "Seçki hüququ olan 40 min nəfər vətəndaş",
                "Azərbaycan Respublikasının Baş Prokurorluğu"
            ],
            "correct_answer": "Azərbaycan Respublikasının Prezidenti, Azərbaycan Respublikası Milli Məclisinin ən azı 63 deputatı",
            "explanation": "AR Konstitusiyasının 158-ci maddəsinə əsasən Konstitusiyaya əlavələr yalnız Prezident və ya Milli Məclisin ən azı 63 deputatı tərəfindən təklif edilə bilər. Digər subyektlərin belə hüququ yoxdur.",
            "weight": 2.0
        },

        # ---------------------------------------------------------
        # QUIZ 12: Yekun Sınaq İmtahanı (105 Sual)
        # ---------------------------------------------------------
        {
            "quiz_keyword": "9. Yekun Sınaq İmtahanı",
            "type": "matching",
            "title": "Dövlət Orqanlarının Ali Səlahiyyətləri",
            "text": "Dövlət orqanları ilə onların müstəsna konstitusion səlahiyyətlərini uyğunlaşdırın:",
            "matching_pairs": {
                "Milli Məclis": "Qanunları qəbul etmək və dövlət büdcəsini təsdiq etmək",
                "Prezident": "Silahlı Qüvvələrin Ali Baş Komandanı olmaq və xarici siyasəti həyata keçirmək",
                "Nazirlər Kabineti": "Dövlət büdcəsinin layihəsini hazırlamaq və icrasını təmin etmək",
                "Konstitusiya Məhkəməsi": "Qanunların və fərmanların Konstitusiyaya uyğunluğunu yoxlamaq"
            },
            "correct_answer": "Milli Məclis:Qanunları qəbul etmək və dövlət büdcəsini təsdiq etmək|||Prezident:Silahlı Qüvvələrin Ali Baş Komandanı olmaq və xarici siyasəti həyata keçirmək|||Nazirlər Kabineti:Dövlət büdcəsinin layihəsini hazırlamaq və icrasını təmin etmək|||Konstitusiya Məhkəməsi:Qanunların və fərmanların Konstitusiyaya uyğunluğunu yoxlamaq",
            "explanation": "AR Konstitusiyasının əsas dövlət institutlarının səlahiyyətləri.",
            "weight": 2.0
        },
        {
            "quiz_keyword": "9. Yekun Sınaq İmtahanı",
            "type": "ordering",
            "title": "Normativ Hüquqi Aktların Qüvvə İyerarxiyası",
            "text": "Normativ aktların hüquqi qüvvə iyerarxiyasını YUXARIDAN AŞAĞIYA doğru düzün:",
            "sequence_items": [
                "1. Azərbaycan Respublikasının Konstitusiyası",
                "2. Referendum aktları",
                "3. Qanunlar",
                "4. Prezident fərmanları",
                "5. Nazirlər Kabineti qərarları"
            ],
            "correct_answer": "1. Azərbaycan Respublikasının Konstitusiyası|||2. Referendum aktları|||3. Qanunlar|||4. Prezident fərmanları|||5. Nazirlər Kabineti qərarları",
            "explanation": "AR Konstitusiyası Maddə 148.",
            "weight": 2.0
        }
    ]

    inserted_count = 0
    for nq in new_questions:
        target_quiz_id = None
        target_quiz_title = None
        for q_title, q_id in quiz_map.items():
            if nq["quiz_keyword"] in q_title:
                target_quiz_id = q_id
                target_quiz_title = q_title
                break
        
        if not target_quiz_id:
            print(f"Warning: Quiz matching '{nq['quiz_keyword']}' not found!")
            continue

        q_id = str(uuid.uuid4())
        q_type = nq["type"]
        title = nq["title"].replace("'", "''")
        text = nq["text"].replace("'", "''")
        explanation = nq["explanation"].replace("'", "''")
        weight = nq.get("weight", 1.0)
        correct_answer = nq["correct_answer"].replace("'", "''")

        options_json = f"'{json.dumps(nq['options'], ensure_ascii=False)}'::jsonb" if "options" in nq else "NULL"
        matching_pairs_json = f"'{json.dumps(nq['matching_pairs'], ensure_ascii=False)}'::jsonb" if "matching_pairs" in nq else "NULL"
        sequence_items_json = f"'{json.dumps(nq['sequence_items'], ensure_ascii=False)}'::jsonb" if "sequence_items" in nq else "NULL"
        partial_credit = "true" if q_type in ["matching", "multiple_select"] else "false"

        insert_sql = f"""
        INSERT INTO questions (
            id, quiz_id, title, question_text, question_type,
            options, matching_pairs, sequence_items, correct_answer,
            explanation, weight, partial_credit_enabled, order_index
        )
        VALUES (
            '{q_id}'::uuid,
            '{target_quiz_id}'::uuid,
            '{title}',
            '{text}',
            '{q_type}',
            {options_json},
            {matching_pairs_json},
            {sequence_items_json},
            '{correct_answer}',
            '{explanation}',
            {weight},
            {partial_credit},
            999
        );
        """
        run_psql(insert_sql)
        inserted_count += 1
        print(f"[{q_type.upper()}] Added to '{target_quiz_title[:45]}...': {nq['title']}")

    print(f"\nSuccessfully inserted {inserted_count} new interactive questions!")

    # 4. Normalize order_index for all quizzes to make questions well-distributed
    reorder_sql = """
    WITH numbered AS (
        SELECT id, quiz_id,
               ROW_NUMBER() OVER (PARTITION BY quiz_id ORDER BY 
                   CASE 
                       WHEN question_type = 'ordering' THEN 2
                       WHEN question_type = 'matching' THEN 5
                       WHEN question_type = 'multiple_select' THEN 8
                       ELSE 10 
                   END, 
                   id
               ) AS new_order
        FROM questions
        WHERE quiz_id IN (
            SELECT id FROM quizzes WHERE title ILIKE '%Konstitusiya%' AND is_published = true
        )
    )
    UPDATE questions q
    SET order_index = n.new_order
    FROM numbered n
    WHERE q.id = n.id;
    """
    run_psql(reorder_sql)
    print("Re-ordered questions with diverse types placed naturally throughout quizzes.")

if __name__ == '__main__':
    main()
