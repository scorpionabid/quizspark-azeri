#!/usr/bin/env python3
"""
Converts 70 selected self-contained questions (5 per quiz across the 14 Final Olympiad quizzes)
into open-ended ('short_answer') format with comprehensive multi-variant correct_answer strings.
"""
import subprocess

OPEN_QUESTIONS_SPEC = {
    # 1. Azərbaycan dili (AYQ)
    "5f78a6f3-5ebb-4fd1-9ce7-548dc51df367": "IV və VII|IV, VII|4 və 7|4, 7|47|IV VII|4 7|VII və IV|7, 4",
    "b9efc095-b489-4ebb-9ddc-33c5397b36df": "III cümlə|III|3|3-cü cümlə|3-cü|üçüncü cümlə|üçüncü|III cumle|3 cumle",
    "217e5423-ce62-413b-ad8f-7ad8aec8c2cf": "1-b; 2-d; 3-a; 4-c|1-b, 2-d, 3-a, 4-c|1b 2d 3a 4c|bdac",
    "8937ec2e-117a-4dd0-ac71-e49a216bf011": "1, 3, 4, 5|1345|1 3 4 5|1; 3; 4; 5",
    "710284cf-fc79-4bdb-8b29-b7cc43273711": "4, 5|Yalnız 4, 5|4 və 5|45|54|4 5|5, 4",

    # 2. Azərbaycan dili (YYQ)
    "6b70ddf9-f4e2-48e0-9865-fa73e11ff6cf": "5|5-ci|5-ci sətir|V|beşinci|beş|5 setir",
    "ccdb7f6e-f7d1-4aba-b932-a2aeea361320": "4, 6|4 və 6|46|64|4 6|6, 4|Yalnız 4, 6",
    "6b94ad8d-3d89-4ec1-958b-3e2115845a1c": "2, 4, 6|246|2 4 6|2; 4; 6",
    "d6ab0c18-aea4-4f6a-b145-3a407a4a4565": "1, 4|1 və 4|14|41|1 4|4, 1|Yalnız 1, 4",
    "6d7380fb-1098-46ad-9b84-4b44bf4c4779": "1, 3, 5|135|1 3 5|1; 3; 5",

    # 3. Biologiya (AYQ)
    "da74140f-1913-406b-b5c8-eb3848cbdc1d": "Qırmızı|qirmizi|qırmızı işıq|qırmızı rəng|qırmızı rəngli|qirmizi reng|qirmizi isiq",
    "095c2431-8d36-468b-bd51-ed5189d4c15f": "Yalnız I|I|1|yalnız 1|yalniz 1|yalniz I|birinci",
    "b1bced3d-e026-402e-9b83-7f7096d62a20": "I və III|I, III|1 və 3|1, 3|13|31|I III|1 3",
    "75fd6a57-b9a2-4329-ab08-167fe2cf381d": "25 mm/san|25|25 mm/s|25mm/san|25,0",
    "3fde562f-196f-43b7-96a1-ed75b88b5904": "Döş boşluğu|Döş boşluğuna|Döş qəfəsi|Döş qəfəsinə|Döş|dos boslugu|dos qefesi|torakal boşluq",

    # 4. Biologiya (YYQ)
    "cac87c85-b3cc-4133-beb7-dae7263e8f9c": "2, 3, 4|Yalnız 2, 3, 4|234|2 3 4|2; 3; 4",
    "0e51714d-ae6a-4026-b99e-4f4d87f97bda": "8|8 fərd|8 ədəd|8 bakteriya|səkkiz",
    "43c44f6c-e09f-4702-842e-dd44ad16bf17": "1, 4, 6|146|1 4 6|1; 4; 6",
    "303a4812-a771-40f8-9c8a-176e31a25289": "1344|1344 fərd|1344 ədəd",
    "44e10879-e62f-4666-9f21-a5b130575c69": "104|104 xromosom|104 ədəd",

    # 5. Coğrafiya (AYQ)
    "d446fa7b-7f15-4249-afe6-1cfe83e9e563": "I-a, d; II-b, e|1-a,d; 2-b,e|1ad 2be|I-ad, II-be",
    "9f1353d5-a6b2-4fe0-a178-9b915be12218": "1, 2, 3|123|1 2 3|1; 2; 3",
    "6b79a590-ce83-41b2-a08e-153bc573fa4e": "1, 3, 5|135|1 3 5|1; 3; 5",
    "8fbc28dd-4f9c-4a3a-b675-b06e3aca086d": "Meksika|Meksikada|Meksika dövləti|Meksika ölkəsi|Meksika Respublikası|Mexico",
    "109842f3-6e5a-4419-ad24-c99268d77dd5": "Meksika körfəzi|Meksika korfezi|Meksika körfəzinə|Meksika",

    # 6. Coğrafiya (YYQ)
    "bc578eae-5409-4aac-b1d1-b4a5ece0e64a": "1, 2, 5|125|1 2 5|1; 2; 5",
    "fc64b2da-d9dc-4efc-b513-9aebd78f437b": "Hudzon körfəzi|Hudzon korfezi|Hudzon|Hudson körfəzi|Hudson|Hudzon körfəzinə",
    "37025dce-746c-4cb9-a69a-66d8bbb2a853": "2, 5, 6|256|2 5 6|2; 5; 6",
    "71c4c9c0-7f41-4648-8831-1f6b725cad1b": "1, 3, 4|134|1 3 4|1; 3; 4",
    "1511fcb4-bc8f-467b-a300-b8ff063420ac": "Günəş elektrik stansiyası|Günəş|Gunes elektrik stansiyasi|Gunes|GES|Günəş ES|Gunes ES|Helioelektrik stansiya|Günəş stansiyası",

    # 7. Fizika (AYQ)
    "f2d3dfa4-2527-49ff-8549-d9d202ab0199": "28 Kl|28|28 kl|28 kulon|28C",
    "746f78d5-8f7d-4342-ac91-949428750fa3": "45 m|45|45 metr|45m",
    "a017b095-b247-4c68-bd26-7fd175b681d1": "6 N|6|6 nyuton|6N",
    "a5cfab10-dbb5-46dc-aa2a-cabd56d68d70": "320 V|320|320 volt|320V",
    "8b9cd7e9-13c1-4b22-a626-3153e0ac5209": "9 kq|9|9 kiloqram|9kq",

    # 8. Fizika (YYQ)
    "5767c121-1a55-4269-9ac3-5b45f3234031": "4 m/san|4|4 m/s|4m/san|4 metr/saniyə",
    "bf3d9376-4f1c-4d2d-b04e-5e1f80273952": "Kütlə|Kütləni|Cismin kütləsi|Cismin kütləsini|m|kütlə (m)|kutle|kutleni",
    "50bccf14-7742-4184-9987-4d0acfc2cdf9": "20 kq·m/san|20|20 N·san|20 kq*m/san|20 kq m/san",
    "039b82db-6c3c-42b5-b08a-5d081d05f3c1": "Dinamometr|Dinamometrlə|Dinamometr ilə|dinamometr",
    "8ef719d6-e597-4bf0-a2eb-adef66deee11": "2 Om|2|2 om|2 Ω|2Om",

    # 9. Kimya (AYQ)
    "3e7f41b2-73fd-4b56-9d33-bf0871f172c6": "43,2 qram|43,2|43.2|43,2 q|43.2 q|43.2 qram|216/5",
    "4d6527eb-d791-47a1-ac31-b90b18cfed86": "10|10 mol|on",
    "a660e4ec-228e-4beb-8eb3-51a4d65a515b": "89|89 ədəd",
    "cc19107c-70af-4388-a2ec-f17cdc89c3a3": "50|50%|50 %|50 faiz",
    "a10934c9-3034-4ba7-a18d-3716b0e17ea6": "4,5|4.5|4,5 mol|4.5 mol|9/2",

    # 10. Kimya (YYQ)
    "bd944e16-b65d-4fde-950c-28d8e60eac9d": "I və II|I, II|1 və 2|1, 2|12|21|I II|1 2|sp2 və sp3|sp² və sp³",
    "03c7cd0e-3a93-4016-8025-9e1390c6c354": "3|3 mol|üç",
    "4ab4af2f-5ce3-49c0-98fc-724cfdfa3dfd": "2,8|2.8|2,8 mol|2.8 mol|14/5",
    "8b9cf852-59ad-4e19-b34c-5e6f4cbe286d": "4 saat|4|4 s|240 dəqiqə|dörd saat",
    "49f50c52-9d4b-455c-9f9f-d1c2eb204171": "77%|77|77 %|77 faiz",

    # 11. Riyaziyyat (AYQ)
    "afc2cf88-537f-458b-b8e9-a5ea43378474": "21|21 gün",
    "dd58d11b-9ddf-4509-80c6-94b4d0d90a96": "4|4 ədəd|4 sayda|dörd",
    "4ff3c98a-5ce9-41b8-be66-817fdd9b56ee": "5|beş",
    "4e0a2540-b697-491f-bc9b-bf650b71deb1": "3|3 sm²|3 sm2|3sm2|üç",
    "2a72e2c4-a859-461e-9ef2-a0d9b8005b27": "43|43,0|43.0",

    # 12. Riyaziyyat (YYQ)
    "62a57fd9-35d9-4660-864a-ea39f3875b82": "4|4 ədəd|4 üçlük|dörd",
    "13fd6dae-efc8-4ce6-8248-1a2f2a5be29f": "59|59,0|59.0",
    "8901afb3-ecd6-491f-85a7-2747a2fdb9a3": "9|doqquz",
    "d3e9d221-29ec-4017-ad5f-a29ed7303ab3": "6|6 ədəd|6 üçlük|altı",
    "26daa2ab-49ef-41eb-8a4c-6f9b116f845d": "8|səkkiz",

    # 13. Tarix (AYQ)
    "5bf39fac-2feb-4c29-ac33-614b81f09d4f": "Parfiya|Parfiya dövləti|Parfiya imperiyası|Əşkanilər|Parfiya şahlığı",
    "da927f7a-d9d9-444a-9d91-8100cb57bdc2": "Cavad bəy Şıxlinski|Cavad Şıxlinski|C. Şıxlinski|C.Şıxlinski|Şıxlinski|Cavad bey Sixlinski|Sixlinski|General Cavad bəy Şıxlinski",
    "0194a430-a15a-4d7e-ab35-13f60119eaa0": "1, 4, 3, 2|1432|1 4 3 2|1-4-3-2|1; 4; 3; 2",
    "d4be42f7-9177-4daf-a8bb-011db25d58ee": "Xurşidbanu Natəvan|Natəvan|X. Natəvan|X.Natəvan|Xan qızı Natəvan|Xurşidbanu|Natevan|Natavan|Xurshidbanu Natevan",
    "efe9c69f-97d1-4611-8026-79979ed5c075": "4, 5, 6|456|4 5 6|4; 5; 6|Ağdam, Kəlbəcər, Laçın|Kəlbəcər, Ağdam, Laçın",

    # 14. Tarix (YYQ)
    "03da885a-f1c4-4917-9716-9760361f0009": "3, 5|3 və 5|35|53|3 5|5, 3",
    "4e6e30a6-394c-4ee4-aa69-7c0cd679409b": "1, 2|1 və 2|12|21|1 2|2, 1",
    "05c815d5-f9f8-4b3a-8cd1-fe76770e2fe4": "1, 3, 5|135|1 3 5|1; 3; 5",
    "49096e80-5a91-4c43-94c1-2316c0553288": "1-b, 2-a, 3-c|1-b; 2-a; 3-c|1b 2a 3c|1:b, 2:a, 3:c|bac",
    "4f187b14-fa92-43fd-bc5b-c30c50427011": "1, 3, 4|134|1 3 4|1; 3; 4",
}

def main():
    sql_statements = ["BEGIN;"]
    for qid, ca in OPEN_QUESTIONS_SPEC.items():
        escaped_ca = ca.replace("'", "''")
        sql_statements.append(
            f"UPDATE public.questions SET question_type = 'short_answer', options = NULL, correct_option_indices = NULL, correct_answer = '{escaped_ca}' WHERE id = '{qid}';"
        )
        sql_statements.append(
            f"UPDATE public.question_bank qb SET question_type = 'short_answer', options = NULL, correct_option_indices = NULL, correct_answer = '{escaped_ca}', updated_at = NOW() FROM public.questions q WHERE q.id = '{qid}' AND qb.id = q.bank_question_id;"
        )
    sql_statements.append("COMMIT;")
    full_sql = "\n".join(sql_statements)

    subprocess.run(
        ["docker", "exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres"],
        input=full_sql.encode("utf-8"),
        check=True,
    )
    print(f"Successfully updated {len(OPEN_QUESTIONS_SPEC)} questions to short_answer.")

if __name__ == "__main__":
    main()
