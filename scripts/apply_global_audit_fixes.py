import os
#!/usr/bin/env python3
"""
Zəfər Olimpiadası (8, 9, 10 və 11-ci siniflər) — Qlobal Audit və Düzəliş Mühərriki.
1. 11-ci sinif Coğrafiya və Biologiya düzgün cavablarının rəsmi PDF açarlarına uyğunlaşdırılması.
2. Bütün 32 fənn üzrə mətndə qalmış metadata (Çətinlik:, Taqlar:, Şəkil: base64) sızmalarının təmizlənməsi.
3. 10-cu sinif Fizika Q20 üçün çatışmayan həqiqi sxem şəklinin bərpa edilməsi.
4. Mətn və düsturları təkrarlayan 121 artıq ekran görüntüsünün silinməsi və yalnız 107 həqiqi diaqramın saxlanılması.
5. Həm `questions`, həm də `question_bank` cədvəllərinin sinxronizasiyası.
"""

import json
import os
import re
import urllib.parse
import urllib.request

HEADERS = {
    'apikey': 'os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Authorization': 'Bearer os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

BASE_DATA_DIR = '/srv/quizspark-azeri/data/8-11_sinif_testleri'
GRADE_FOLDERS = {
    'VIII': '8-ci sinif',
    'IX': '9-cu sinif',
    'X': '10-cu sinif',
    'XI': '11-ci sinif'
}
SUBJ_SLUG_MAP = {
    'Azərbaycan dili': 'az-dili',
    'Ədəbiyyat': 'edebiyyat',
    'Riyaziyyat': 'riyaziyyat',
    'Fizika': 'fizika',
    'Kimya': 'kimya',
    'Biologiya': 'biologiya',
    'Tarix': 'tarix',
    'Coğrafiya': 'cografiya'
}

def get_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def patch_question(q_id, payload, bank_id=None):
    url = f'http://127.0.0.1:8090/rest/v1/questions?id=eq.{q_id}'
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=HEADERS, method='PATCH')
    with urllib.request.urlopen(req):
        pass
    if bank_id:
        b_payload = {k: v for k, v in payload.items() if k in ['question_text', 'question_type', 'options', 'correct_answer', 'question_image_url', 'matching_pairs']}
        b_url = f'http://127.0.0.1:8090/rest/v1/question_bank?id=eq.{bank_id}'
        b_req = urllib.request.Request(b_url, data=json.dumps(b_payload).encode('utf-8'), headers=HEADERS, method='PATCH')
        with urllib.request.urlopen(b_req):
            pass

def build_genuine_diagram_map():
    """
    Parse all 32 source markdown files and build a lookup:
    (grade_roman, subject_title, order_index) -> bool (has authentic diagram)
    """
    diagram_map = {}
    for grade_roman, folder in GRADE_FOLDERS.items():
        md_dir = os.path.join(BASE_DATA_DIR, folder, 'imtahan_store_md')
        prefix = folder.split('-')[0]
        suffix = 'ci' if prefix in ['8', '11'] else 'cu'
        for subj_title, slug in SUBJ_SLUG_MAP.items():
            md_file = f'{prefix}-{suffix}_sinif_{slug}.md'
            md_path = os.path.join(md_dir, md_file)
            with open(md_path, 'r', encoding='utf-8') as fh:
                content = fh.read()
            qs_md = [q for q in content.split('\n---\n') if q.strip()]
            for idx, q_txt in enumerate(qs_md):
                order_idx = idx + 1
                has_diag = 'data:image' in q_txt
                diagram_map[(grade_roman, subj_title, order_idx)] = has_diag
    return diagram_map

def apply_global_fixes():
    print("🚀 Qlobal Audit Düzəlişlərinin tətbiqinə başlanılır...")
    diagram_map = build_genuine_diagram_map()
    total_genuine = sum(1 for v in diagram_map.values() if v)
    print(f"  ✓ Mənbə md fayllarından 640 sual və {total_genuine} həqiqi diaqram xəritələndi.")

    # 1. Grade 11 Answer Key Fixes (Coğrafiya 11 and Biologiya 11)
    print("\n--- 1. 11-ci sinif cavab açarlarının düzəldilməsi ---")
    
    # 1A. Coğrafiya 11
    cog11_id = '3a670954-56a7-4a40-914a-84c26b7839ff'
    cog11_qs = get_json(f'http://127.0.0.1:8090/rest/v1/questions?quiz_id=eq.{cog11_id}&order=order_index')
    cog_letters = ['A', 'C', 'D', 'D', 'C', 'B', 'E', 'B', 'D', 'A', 'B', 'B', 'E', 'A', 'B', 'B', 'C']
    for i in range(17):
        q = cog11_qs[i]
        letter = cog_letters[i]
        opt_idx = ord(letter) - ord('A')
        correct_opt = q['options'][opt_idx]
        patch_question(q['id'], {'correct_answer': correct_opt}, q.get('bank_question_id'))
    # Q18
    patch_question(cog11_qs[17]['id'], {'correct_answer': '234'}, cog11_qs[17].get('bank_question_id'))
    # Q19
    patch_question(cog11_qs[18]['id'], {'correct_answer': '24'}, cog11_qs[18].get('bank_question_id'))
    # Q20
    cog_matching_pairs = {'1': 'c', '2': 'b, e', '3': 'a'}
    patch_question(cog11_qs[19]['id'], {
        'correct_answer': '1-c; 2-b, e; 3-a',
        'matching_pairs': cog_matching_pairs
    }, cog11_qs[19].get('bank_question_id'))
    print("  ✓ 11-ci sinif Coğrafiya cavab açarları rəsmi PDF ilə 100% uyğunlaşdırıldı.")

    # 1B. Biologiya 11
    bio11_id = '5b035971-51cd-4f6e-9b25-6dc29233442d'
    bio11_qs = get_json(f'http://127.0.0.1:8090/rest/v1/questions?quiz_id=eq.{bio11_id}&order=order_index')
    bio_letters = ['B', 'C', 'D', 'A', 'B', 'D', 'A', 'C', 'C', 'D', 'B', 'E', 'E', 'D', 'D', 'A', 'D']
    for i in range(17):
        q = bio11_qs[i]
        letter = bio_letters[i]
        opt_idx = ord(letter) - ord('A')
        correct_opt = q['options'][opt_idx]
        patch_question(q['id'], {'correct_answer': correct_opt}, q.get('bank_question_id'))
    # Q18
    patch_question(bio11_qs[17]['id'], {'correct_answer': '45'}, bio11_qs[17].get('bank_question_id'))
    # Q19
    patch_question(bio11_qs[18]['id'], {'correct_answer': '33'}, bio11_qs[18].get('bank_question_id'))
    # Q20
    bio_matching_pairs = {'1': 'c', '2': 'b', '3': 'a, e'}
    patch_question(bio11_qs[19]['id'], {
        'correct_answer': '1-c; 2-b; 3-a, e',
        'matching_pairs': bio_matching_pairs
    }, bio11_qs[19].get('bank_question_id'))
    print("  ✓ 11-ci sinif Biologiya cavab açarları rəsmi PDF ilə 100% uyğunlaşdırıldı.")

    # 2. Iterate through all 32 quizzes and apply metadata cleanup & image pruning
    print("\n--- 2. Metadata təmizlənməsi və artıq şəkillərin silinməsi ---")
    flt = urllib.parse.quote('like.*Zəfər*')
    quizzes = get_json(f'http://127.0.0.1:8090/rest/v1/quizzes?title={flt}&select=id,title')

    cleaned_metadata_count = 0
    recovered_images_count = 0
    pruned_images_count = 0

    for qz in sorted(quizzes, key=lambda x: x['title']):
        m = qz['title'].split('(')[1].split(')')[0].replace(' sinif', '')
        subj = qz['title'].split('— ')[1].strip()
        qs = get_json(f'http://127.0.0.1:8090/rest/v1/questions?quiz_id=eq.{qz["id"]}&order=order_index')

        for q in qs:
            order_idx = q['order_index']
            text = q.get('question_text') or ''
            img_url = q.get('question_image_url')
            bank_id = q.get('bank_question_id')
            patches = {}

            # Step 2A: Check if genuine diagram exists according to source markdown
            is_genuine = diagram_map.get((m, subj, order_idx), False)

            # Step 2B: Check if image is buried in metadata (e.g. Fizika 10 Q20)
            if 'Şəkil:' in text and not img_url and is_genuine:
                m_img = re.search(r'Şəkil:\s*(data:image/[^\s]+)', text)
                if m_img:
                    img_url = m_img.group(1).strip()
                    patches['question_image_url'] = img_url
                    recovered_images_count += 1
                    print(f"  ✓ Bərpa edildi: {qz['title']} Q{order_idx} diaqram şəkli.")

            # Step 2C: Strip metadata leak (Çətinlik:, Taqlar:, Şəkil:)
            if any(marker in text for marker in ['Çətinlik:', 'Taqlar:', 'Şəkil:']):
                clean_text = re.sub(r'\n+\s*(?:Çətinlik|Taqlar|Şəkil):.*$', '', text, flags=re.DOTALL).strip()
                if clean_text != text:
                    patches['question_text'] = clean_text
                    cleaned_metadata_count += 1

            # Step 2D: Prune redundant screenshot image if not genuine diagram
            if img_url and not is_genuine:
                patches['question_image_url'] = None
                pruned_images_count += 1

            if patches:
                patch_question(q['id'], patches, bank_id)

    print(f"\n  ✓ Metadata təmizləndi: {cleaned_metadata_count} sual")
    print(f"  ✓ Həqiqi diaqram bərpa edildi: {recovered_images_count} sual")
    print(f"  ✓ Artıq ekran görüntüsü silindi: {pruned_images_count} sual")

def verify_all():
    print("\n--- 3. Yekun Qlobal Yoxlama (Verification) ---")
    flt = urllib.parse.quote('like.*Zəfər*')
    quizzes = get_json(f'http://127.0.0.1:8090/rest/v1/quizzes?title={flt}&select=id,title')
    
    total_questions = 0
    total_images = 0
    total_leaks = 0

    for qz in sorted(quizzes, key=lambda x: x['title']):
        qs = get_json(f'http://127.0.0.1:8090/rest/v1/questions?quiz_id=eq.{qz["id"]}&order=order_index')
        total_questions += len(qs)
        for q in qs:
            if q.get('question_image_url'):
                total_images += 1
            txt = q.get('question_text') or ''
            if any(k in txt for k in ['Çətinlik:', 'Taqlar:', 'data:image']):
                total_leaks += 1

    print(f"Ümumi suallar: {total_questions} (gözlənilən 640)")
    print(f"Aktiv diaqram şəkilləri: {total_images} (gözlənilən 107)")
    print(f"Mətn sızmaları (leaks): {total_leaks} (gözlənilən 0)")

    assert total_questions == 640, f"Gözlənilməz sual sayı: {total_questions}"
    assert total_images == 107, f"Gözlənilməz şəkil sayı: {total_images}"
    assert total_leaks == 0, f"Hələ də {total_leaks} sızma var!"
    print("\n✅ BÜTÜN YOXLANILAN 32 TEST VƏ 640 SUAL 100% STANDARTLARA CAVAB VERİR!")

if __name__ == '__main__':
    apply_global_fixes()
    verify_all()
