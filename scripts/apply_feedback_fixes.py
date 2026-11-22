import os
#!/usr/bin/env python3
"""
Zəfər Olimpiadası (9 və 10-cu siniflər) — İstifadəçi və Müəllim Rəyləri Əsasında Hədəfli Düzəliş Mühərriki.
"""

import base64
import json
import os
import re
import urllib.request

HEADERS = {
    'apikey': 'os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Authorization': 'Bearer os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def get_question(quiz_id, order_index):
    url = f'http://127.0.0.1:8090/rest/v1/questions?quiz_id=eq.{quiz_id}&order_index=eq.{order_index}&select=*'
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))[0]

def update_question(q_id, payload, bank_id=None):
    url = f'http://127.0.0.1:8090/rest/v1/questions?id=eq.{q_id}'
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=HEADERS, method='PATCH')
    with urllib.request.urlopen(req) as resp:
        pass
    if bank_id:
        b_payload = {k: v for k, v in payload.items() if k in ['question_text', 'question_type', 'options', 'correct_answer', 'question_image_url', 'matching_pairs']}
        b_url = f'http://127.0.0.1:8090/rest/v1/question_bank?id=eq.{bank_id}'
        b_req = urllib.request.Request(b_url, data=json.dumps(b_payload).encode('utf-8'), headers=HEADERS, method='PATCH')
        with urllib.request.urlopen(b_req) as b_resp:
            pass

def file_to_b64_uri(filepath):
    with open(filepath, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
    return f'data:image/png;base64,{b64}'

def apply_fixes():
    print("🚀 Başlayır: Zəfər Olimpiadası rəy düzəlişlərinin tətbiqi...")

    # 1. Az dili 9 (9f3b37ff-7bb2-40b0-9e23-f0e8ee999064)
    az9_id = '9f3b37ff-7bb2-40b0-9e23-f0e8ee999064'
    print("\n--- 1. Az dili 9 düzəlişləri ---")
    # Q1: cədvəl şəkli silinməli (mətndə markdown cədvəl var)
    q = get_question(az9_id, 1)
    update_question(q['id'], {'question_image_url': None}, q.get('bank_question_id'))
    print("  ✓ Q1: Redundant cədvəl şəkli silindi.")

    # Q7: sualın təkrarlanan şəkli silinməli
    q = get_question(az9_id, 7)
    update_question(q['id'], {'question_image_url': None}, q.get('bank_question_id'))
    print("  ✓ Q7: Redundant sual mətni şəkli silindi.")

    # Q19: nömrələnmiş siyahı və cümlələrin ardıcıllığı
    q = get_question(az9_id, 19)
    clean_q19_text = """İşarələnmiş sözlərin hansı nitq hissəsi olmasına görə işlənmə ardıcıllığını müəyyən edin:

• Az danış ki, səhvin də az olsun.
• Düz söz qılıncdan kəsərli olar.
• Qızıl payız təbiəti qızıl rəngə boyadı.

1. isim
2. zərf
3. sifət"""
    update_question(q['id'], {'question_text': clean_q19_text, 'question_image_url': None, 'correct_answer': '231'}, q.get('bank_question_id'))
    print("  ✓ Q19: Cümlələr prompt-a köçürüldü, 3. sifət bəndi təmizləndi, şəkil silindi.")

    # 2. Riyaziyyat 9 (4cb87790-47ca-42b2-89c0-a10a8b84d55c)
    print("\n--- 2. Riyaziyyat 9 düzəlişləri ---")
    riy9_id = '4cb87790-47ca-42b2-89c0-a10a8b84d55c'
    # Həndəsi fiqur olan suallar: Q2, Q9, Q13. Bütün digər cəbri/ədədi suallarda təkrar şəkil silinir.
    for idx in range(1, 21):
        if idx not in [2, 9, 13]:
            q = get_question(riy9_id, idx)
            if q.get('question_image_url'):
                update_question(q['id'], {'question_image_url': None}, q.get('bank_question_id'))
    print("  ✓ Riyaziyyat 9: Q1, Q3, Q4 və digər cəbri suallardan təkrarlanan skrinşotlar silindi (yalnız Q2, Q9, Q13 həndəsi fiqurları saxlanıldı).")

    # 3. Tarix 9 (27d2cbbd-a97d-4bca-9c5d-6e7b7b545a77)
    print("\n--- 3. Tarix 9 düzəlişləri ---")
    tar9_id = '27d2cbbd-a97d-4bca-9c5d-6e7b7b545a77'
    # Q5: təkrar cədvəl şəkli silinməli
    q = get_question(tar9_id, 5)
    update_question(q['id'], {'question_image_url': None}, q.get('bank_question_id'))
    print("  ✓ Q5: Təkrar cədvəl şəkli silindi.")

    # Q15 & Q17: Şəkillər dəyişik düşmüşdü (Q15 Reformasiya Avropa xəritəsi, Q17 1827 Çar Rusiyası xanlıqları)
    img_eur = file_to_b64_uri('/tmp/pdf_tarix9_img-001.png')
    img_xan = file_to_b64_uri('/tmp/pdf_tarix9_img-002.png')
    q15 = get_question(tar9_id, 15)
    q17 = get_question(tar9_id, 17)
    update_question(q15['id'], {'question_image_url': img_eur}, q15.get('bank_question_id'))
    update_question(q17['id'], {'question_image_url': img_xan}, q17.get('bank_question_id'))
    print("  ✓ Q15 və Q17 xəritə şəkilləri yerinə qaytarıldı (Q15: Avropa Reformasiya xəritəsi, Q17: Azərbaycan xanlıqlar xəritəsi).")

    # 4. Coğrafiya 9 (1a1e11b1-9e2c-49a6-83b2-d26cce148a5f)
    print("\n--- 4. Coğrafiya 9 düzəlişləri ---")
    cog9_id = '1a1e11b1-9e2c-49a6-83b2-d26cce148a5f'
    q = get_question(cog9_id, 10)
    update_question(q['id'], {'question_image_url': None}, q.get('bank_question_id'))
    print("  ✓ Q10: Təkrar cədvəl şəkli silindi.")

    # 5. Ədəbiyyat 9 (f71a60db-b510-4e91-8e66-0ec135823e4a)
    print("\n--- 5. Ədəbiyyat 9 düzəlişləri ---")
    ed9_id = 'f71a60db-b510-4e91-8e66-0ec135823e4a'
    q = get_question(ed9_id, 19)
    update_question(q['id'], {'question_image_url': None}, q.get('bank_question_id'))
    print("  ✓ Q19: İ.Krılovun “Ağac” əsəri sualındakı təkrar cədvəl şəkli silindi.")

    # 6. Biologiya 9 (cdfe751d-455f-4476-8fe3-a8ed9152848c)
    print("\n--- 6. Biologiya 9 düzəlişləri ---")
    bio9_id = 'cdfe751d-455f-4476-8fe3-a8ed9152848c'
    q16 = get_question(bio9_id, 16)
    q20 = get_question(bio9_id, 20)
    update_question(q16['id'], {'question_image_url': None}, q16.get('bank_question_id'))
    update_question(q20['id'], {'question_image_url': None}, q20.get('bank_question_id'))
    print("  ✓ Q16 (Yaşıl quş mamırı) və Q20 (çağa, südəmər) suallarındakı təkrar skrinşotlar silindi.")

    # 7. Az dili 10 (b92086df-0903-4014-9bd3-c562b54ea7b4)
    print("\n--- 7. Az dili 10 düzəlişləri ---")
    az10_id = 'b92086df-0903-4014-9bd3-c562b54ea7b4'
    q14 = get_question(az10_id, 14)
    q19 = get_question(az10_id, 19)
    update_question(q14['id'], {'question_image_url': None}, q14.get('bank_question_id'))
    update_question(q19['id'], {'question_image_url': None}, q19.get('bank_question_id'))
    print("  ✓ Q14 (üslub) və Q19 (3 nümunə) suallarındakı təkrar skrinşotlar silindi.")

    # 8. Riyaziyyat 10 (99fbf78d-1b33-42fd-ab08-49b3f9f3d2da)
    print("\n--- 8. Riyaziyyat 10 düzəlişləri ---")
    riy10_id = '99fbf78d-1b33-42fd-ab08-49b3f9f3d2da'
    # Həndəsi fiqurlar təmiz PDF şəkilləri ilə əvəzlənir
    img_tri = file_to_b64_uri('/tmp/pdf_riyaz10_img-000.png')
    img_rho = file_to_b64_uri('/tmp/pdf_riyaz10_img-001.png')
    img_par = file_to_b64_uri('/tmp/pdf_riyaz10_img-002.png')
    img_rec = file_to_b64_uri('/tmp/pdf_riyaz10_img-003.png')

    geom_map = {4: img_tri, 15: img_rho, 17: img_par, 19: img_rec}
    for idx in range(1, 21):
        q = get_question(riy10_id, idx)
        if idx in geom_map:
            update_question(q['id'], {'question_image_url': geom_map[idx]}, q.get('bank_question_id'))
        else:
            payload = {'question_image_url': None}
            if idx == 18:
                payload['question_text'] = r'$\frac{2}{5}$ kəsrini faizlə göstərin.'
            update_question(q['id'], payload, q.get('bank_question_id'))
    print("  ✓ Riyaziyyat 10: Bütün cəbri suallardan təkrarlanan skrinşotlar silindi, Q18 mətni təmizləndi, Q4/Q15/Q17/Q19 həndəsi fiqurları təmiz PDF təsvirləri ilə təmin edildi.")

    # 9. Fizika 10 (6ef22c65-4d13-4ac1-b707-fe82cb070f15)
    print("\n--- 9. Fizika 10 düzəlişləri ---")
    fiz10_id = '6ef22c65-4d13-4ac1-b707-fe82cb070f15'
    q15 = get_question(fiz10_id, 15)
    update_question(q15['id'], {'question_image_url': None}, q15.get('bank_question_id'))
    
    q19 = get_question(fiz10_id, 19)
    clean_fiz_q19 = """Sabit həcmdə su buxarının təzyiqinin temperaturdan asılılıq qrafiki verilmişdir. Doğru ifadələri göstərin:
1. A – B hissəsində buxar doyan haldadır.
2. B – C hissəsində buxar doyan haldadır.
3. A – B hissəsində buxarın sıxlığı artır.
4. B – C hissəsində buxarın sıxlığı artır.
5. A nöqtəsi suyun miqdarının maksimal olmasına uyğundur."""
    update_question(q19['id'], {'question_text': clean_fiz_q19}, q19.get('bank_question_id'))

    q20 = get_question(fiz10_id, 20)
    update_question(q20['id'], {'question_image_url': None}, q20.get('bank_question_id'))
    print("  ✓ Fizika 10: Q15 və Q20-dən təkrar şəkillər silindi, Q19-dan sızmış metadata mətni ('Çətinlik: orta...') tamamilə təmizləndi.")

    # 10. Coğrafiya 10 (49e3c2e5-461c-4074-87ef-8a3da9ad61a5)
    print("\n--- 10. Coğrafiya 10 düzəlişləri ---")
    cog10_id = '49e3c2e5-461c-4074-87ef-8a3da9ad61a5'
    # Şəkillər: Q15 süxurlar xəritəsi (img 3), Q17 təbii zona diaqramı (img 4)
    img_geo = file_to_b64_uri('/tmp/pdf_cog10_img-003.png')
    img_dia = file_to_b64_uri('/tmp/pdf_cog10_img-004.png')
    
    # Rəsmi cavablar (Row 5 - Coğrafiya)
    cog10_answers = {
        1: ('C', 'multiple_choice', None),
        2: ('D', 'multiple_choice', None),
        3: ('A', 'multiple_choice', None),
        4: ('A', 'multiple_choice', None),
        5: ('B', 'multiple_choice', None),
        6: ('C', 'multiple_choice', None),
        7: ('E', 'multiple_choice', None),
        8: ('D', 'multiple_choice', None),
        9: ('C', 'multiple_choice', None),
        10: ('C', 'multiple_choice', None),
        11: ('C', 'multiple_choice', None),
        12: ('A', 'multiple_choice', None),
        13: ('C', 'multiple_choice', None),
        14: ('A', 'multiple_choice', None),
        15: ('D', 'multiple_choice', img_geo),
        16: ('B', 'multiple_choice', None),
        17: ('C', 'multiple_choice', img_dia),
        18: ('40', 'numerical', None),
        19: ('245', 'numerical', None),
        20: ('1-c,e;2-b,d;3-a', 'matching', None)
    }

    for idx, (ans_val, q_type, img) in cog10_answers.items():
        q = get_question(cog10_id, idx)
        payload = {}
        if img is not None:
            payload['question_image_url'] = img
        if q_type == 'multiple_choice':
            letter_idx = ord(ans_val) - ord('A')
            opts = q.get('options') or []
            if letter_idx < len(opts):
                payload['correct_answer'] = opts[letter_idx]
            else:
                payload['correct_answer'] = ans_val
        elif q_type == 'numerical':
            payload['correct_answer'] = ans_val
        elif q_type == 'matching':
            payload['correct_answer'] = '1-c, e; 2-b, d; 3-a'
            payload['matching_pairs'] = {'1': 'c, e', '2': 'b, d', '3': 'a'}
        update_question(q['id'], payload, q.get('bank_question_id'))
    print("  ✓ Coğrafiya 10: Q15 və Q17 şəkilləri düzəldildi, bütün 20 sualın cavab kartı rəsmi PDF-ə (Row 5) uyğun tam bərpa olundu.")

    # 11. Tarix 10 (988d3366-ad17-4e25-ab52-28b0719ce0ef)
    print("\n--- 11. Tarix 10 düzəlişləri ---")
    tar10_id = '988d3366-ad17-4e25-ab52-28b0719ce0ef'
    tar10_answers = {
        1: ('C', 'multiple_choice'),
        2: ('A', 'multiple_choice'),
        3: ('B', 'multiple_choice'),
        4: ('E', 'multiple_choice'),
        5: ('D', 'multiple_choice'),
        6: ('B', 'multiple_choice'),
        7: ('C', 'multiple_choice'),
        8: ('E', 'multiple_choice'),
        9: ('A', 'multiple_choice'),
        10: ('A', 'multiple_choice'),
        11: ('B', 'multiple_choice'),
        12: ('C', 'multiple_choice'),
        13: ('D', 'multiple_choice'),
        14: ('B', 'multiple_choice'),
        15: ('A', 'multiple_choice'),
        16: ('E', 'multiple_choice'),
        17: ('C', 'multiple_choice'),
        18: ('213', 'numerical'),
        19: ('23', 'numerical'),
        20: ('1-c;2-b;3-a', 'matching')
    }
    for idx, (ans_val, q_type) in tar10_answers.items():
        q = get_question(tar10_id, idx)
        payload = {}
        if q_type == 'multiple_choice':
            letter_idx = ord(ans_val) - ord('A')
            opts = q.get('options') or []
            if letter_idx < len(opts):
                payload['correct_answer'] = opts[letter_idx]
            else:
                payload['correct_answer'] = ans_val
        elif q_type == 'numerical':
            payload['correct_answer'] = ans_val
        elif q_type == 'matching':
            payload['correct_answer'] = '1-c; 2-b; 3-a'
            payload['matching_pairs'] = {'1': 'c', '2': 'b', '3': 'a'}
        update_question(q['id'], payload, q.get('bank_question_id'))
    print("  ✓ Tarix 10: Bütün 20 sualın cavab kartı rəsmi PDF-ə (Row 6) uyğun tam bərpa olundu.")

    # 12. Ədəbiyyat 10 (29a9894d-eb22-415c-83f1-8b3857ba69dd)
    print("\n--- 12. Ədəbiyyat 10 düzəlişləri ---")
    ed10_id = '29a9894d-eb22-415c-83f1-8b3857ba69dd'
    ed10_answers = {
        1: ('A', 'multiple_choice'),
        2: ('D', 'multiple_choice'),
        3: ('C', 'multiple_choice'),
        4: ('C', 'multiple_choice'),
        5: ('D', 'multiple_choice'),
        6: ('C', 'multiple_choice'),
        7: ('D', 'multiple_choice'),
        8: ('C', 'multiple_choice'),
        9: ('D', 'multiple_choice'),
        10: ('A', 'multiple_choice'),
        11: ('C', 'multiple_choice'),
        12: ('A', 'multiple_choice'),
        13: ('D', 'multiple_choice'),
        14: ('C', 'multiple_choice'),
        15: ('D', 'multiple_choice'),
        16: ('A', 'multiple_choice'),
        17: ('E', 'multiple_choice'),
        18: ('34', 'numerical'),
        19: ('134', 'numerical'),
        20: ('1-a,c;2-d,e;3-b', 'matching')
    }
    for idx, (ans_val, q_type) in ed10_answers.items():
        q = get_question(ed10_id, idx)
        payload = {}
        if q_type == 'multiple_choice':
            letter_idx = ord(ans_val) - ord('A')
            opts = q.get('options') or []
            if letter_idx < len(opts):
                payload['correct_answer'] = opts[letter_idx]
            else:
                payload['correct_answer'] = ans_val
        elif q_type == 'numerical':
            payload['correct_answer'] = ans_val
        elif q_type == 'matching':
            payload['correct_answer'] = '1-a, c; 2-d, e; 3-b'
            payload['matching_pairs'] = {'1': 'a, c', '2': 'd, e', '3': 'b'}
        update_question(q['id'], payload, q.get('bank_question_id'))
    print("  ✓ Ədəbiyyat 10: Bütün 20 sualın cavab kartı rəsmi PDF-ə (Row 7) uyğun tam bərpa olundu.")

    # 13. Biologiya 10 (e6f8c820-df1d-4e2c-8418-8e162e6ab82d)
    print("\n--- 13. Biologiya 10 düzəlişləri ---")
    bio10_id = 'e6f8c820-df1d-4e2c-8418-8e162e6ab82d'
    bio10_answers = {
        1: ('A', 'multiple_choice'),
        2: ('B', 'multiple_choice'),
        3: ('D', 'multiple_choice'),
        4: ('B', 'multiple_choice'),
        5: ('D', 'multiple_choice'),
        6: ('D', 'multiple_choice'),
        7: ('C', 'multiple_choice'),
        8: ('E', 'multiple_choice'),
        9: ('A', 'multiple_choice'),
        10: ('C', 'multiple_choice'),
        11: ('B', 'multiple_choice'),
        12: ('E', 'multiple_choice'),
        13: ('B', 'multiple_choice'),
        14: ('D', 'multiple_choice'),
        15: ('D', 'multiple_choice'),
        16: ('B', 'multiple_choice'),
        17: ('D', 'multiple_choice'),
        18: ('24', 'numerical'),
        19: ('134', 'numerical'),
        20: ('1-c;2-b,e;3-d', 'matching')
    }
    for idx, (ans_val, q_type) in bio10_answers.items():
        q = get_question(bio10_id, idx)
        payload = {}
        if q_type == 'multiple_choice':
            letter_idx = ord(ans_val) - ord('A')
            opts = q.get('options') or []
            if letter_idx < len(opts):
                payload['correct_answer'] = opts[letter_idx]
            else:
                payload['correct_answer'] = ans_val
        elif q_type == 'numerical':
            payload['correct_answer'] = ans_val
        elif q_type == 'matching':
            payload['correct_answer'] = '1-c; 2-b, e; 3-d'
            payload['matching_pairs'] = {'1': 'c', '2': 'b, e', '3': 'd'}
        update_question(q['id'], payload, q.get('bank_question_id'))
    print("  ✓ Biologiya 10: Bütün 20 sualın cavab kartı rəsmi PDF-ə (Row 8) uyğun tam bərpa olundu.")

    print("\n🎉 BÜTÜN DÜZƏLİŞLƏR UĞURLA TƏTBİQ EDİLDİ!")

if __name__ == '__main__':
    apply_fixes()
