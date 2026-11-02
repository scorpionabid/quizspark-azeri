import os
#!/usr/bin/env python3
"""
Zəfər Olimpiadası (8-11-ci Siniflər) — Bütün Quiz və Sualların Rəsmi PDF və Cavab Kartları ilə Sinxronizasiya Mühərriki.

Mənbə: /srv/quizspark-azeri/data/8-11_sinif_testleri/
- 32 fənn PDF-i və 4 cavab kartı (düzgün cavablar {8,9,10,11}.pdf)
- 32 fənn markdown faylı (imtahan_store_import/{grade}-ci sinif/)
- 273 PNG vizual təsvir və diaqram (imtahan_store_import/images/)
"""

import base64
import glob
import json
import os
import re
import sys
import urllib.request

BASE_DIR = '/srv/quizspark-azeri/data/8-11_sinif_testleri'
IMPORT_DIR = os.path.join(BASE_DIR, 'imtahan_store_import')
IMAGES_DIR = os.path.join(IMPORT_DIR, 'images')

HEADERS = {
    'apikey': 'os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Authorization': 'Bearer os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

QUIZ_MAP = {
    8: {
        'az-dili': {'id': 'd2b21f14-8611-4151-9d9c-d45a292a025f', 'name': 'Azərbaycan dili', 'file': '8-ci_sinif_az-dili.md'},
        'biologiya': {'id': '63491a57-a7f9-4f76-a032-aa232de0b685', 'name': 'Biologiya', 'file': '8-ci_sinif_biologiya.md'},
        'cografiya': {'id': 'cc21098a-194f-4bf7-850a-06b491c15783', 'name': 'Coğrafiya', 'file': '8-ci_sinif_cografiya.md'},
        'edebiyyat': {'id': '4c8bfda0-b2af-4463-ba24-35d806c7ee3a', 'name': 'Ədəbiyyat', 'file': '8-ci_sinif_edebiyyat.md'},
        'fizika': {'id': '44e176d4-23a0-4d84-b431-c1f38cb270b8', 'name': 'Fizika', 'file': '8-ci_sinif_fizika.md'},
        'kimya': {'id': '8b93646c-a5c7-4dcb-89f5-76d71a57b00f', 'name': 'Kimya', 'file': '8-ci_sinif_kimya.md'},
        'riyaziyyat': {'id': 'd4f8295a-cc3f-4aa4-ab0b-4f1f685dd0de', 'name': 'Riyaziyyat', 'file': '8-ci_sinif_riyaziyyat.md'},
        'tarix': {'id': '97421a9d-48b3-4217-9a84-5ff541fc3809', 'name': 'Tarix', 'file': '8-ci_sinif_tarix.md'}
    },
    9: {
        'az-dili': {'id': '9f3b37ff-7bb2-40b0-9e23-f0e8ee999064', 'name': 'Azərbaycan dili', 'file': '9-cu_sinif_az-dili.md'},
        'biologiya': {'id': 'cdfe751d-455f-4476-8fe3-a8ed9152848c', 'name': 'Biologiya', 'file': '9-cu_sinif_biologiya.md'},
        'cografiya': {'id': '1a1e11b1-9e2c-49a6-83b2-d26cce148a5f', 'name': 'Coğrafiya', 'file': '9-cu_sinif_cografiya.md'},
        'edebiyyat': {'id': 'f71a60db-b510-4e91-8e66-0ec135823e4a', 'name': 'Ədəbiyyat', 'file': '9-cu_sinif_edebiyyat.md'},
        'fizika': {'id': 'a9b7c4e0-20b8-4ff7-b3c3-ca5236bea09a', 'name': 'Fizika', 'file': '9-cu_sinif_fizika.md'},
        'kimya': {'id': '0efad6b1-d157-4700-bb30-2d39293f7960', 'name': 'Kimya', 'file': '9-cu_sinif_kimya.md'},
        'riyaziyyat': {'id': '4cb87790-47ca-42b2-89c0-a10a8b84d55c', 'name': 'Riyaziyyat', 'file': '9-cu_sinif_riyaziyyat.md'},
        'tarix': {'id': '27d2cbbd-a97d-4bca-9c5d-6e7b7b545a77', 'name': 'Tarix', 'file': '9-cu_sinif_tarix.md'}
    },
    10: {
        'az-dili': {'id': 'b92086df-0903-4014-9bd3-c562b54ea7b4', 'name': 'Azərbaycan dili', 'file': '10-cu_sinif_az-dili.md'},
        'biologiya': {'id': 'e6f8c820-df1d-4e2c-8418-8e162e6ab82d', 'name': 'Biologiya', 'file': '10-cu_sinif_biologiya.md'},
        'cografiya': {'id': '49e3c2e5-461c-4074-87ef-8a3da9ad61a5', 'name': 'Coğrafiya', 'file': '10-cu_sinif_cografiya.md'},
        'edebiyyat': {'id': '29a9894d-eb22-415c-83f1-8b3857ba69dd', 'name': 'Ədəbiyyat', 'file': '10-cu_sinif_edebiyyat.md'},
        'fizika': {'id': '6ef22c65-4d13-4ac1-b707-fe82cb070f15', 'name': 'Fizika', 'file': '10-cu_sinif_fizika.md'},
        'kimya': {'id': '160ae3a7-8845-47bf-bba9-248dbb58c9fc', 'name': 'Kimya', 'file': '10-cu_sinif_kimya.md'},
        'riyaziyyat': {'id': '99fbf78d-1b33-42fd-ab08-49b3f9f3d2da', 'name': 'Riyaziyyat', 'file': '10-cu_sinif_riyaziyyat.md'},
        'tarix': {'id': '988d3366-ad17-4e25-ab52-28b0719ce0ef', 'name': 'Tarix', 'file': '10-cu_sinif_tarix.md'}
    },
    11: {
        'az-dili': {'id': '8b2cea7d-2fa7-47b6-8023-773e7c903b0c', 'name': 'Azərbaycan dili', 'file': '11-ci_sinif_az-dili.md'},
        'biologiya': {'id': '5b035971-51cd-4f6e-9b25-6dc29233442d', 'name': 'Biologiya', 'file': '11-ci_sinif_biologiya.md'},
        'cografiya': {'id': '3a670954-56a7-4a40-914a-84c26b7839ff', 'name': 'Coğrafiya', 'file': '11-ci_sinif_cografiya.md'},
        'edebiyyat': {'id': '93c688bf-9e55-466f-853e-9018bb3f1afc', 'name': 'Ədəbiyyat', 'file': '11-ci_sinif_edebiyyat.md'},
        'fizika': {'id': '75d2b086-f8c2-43af-8c8a-cef9e86e3e43', 'name': 'Fizika', 'file': '11-ci_sinif_fizika.md'},
        'kimya': {'id': 'cd0d28d4-eff0-440b-839f-248ced9f4c13', 'name': 'Kimya', 'file': '11-ci_sinif_kimya.md'},
        'riyaziyyat': {'id': 'd0bd60b3-58ca-4786-94c7-455e948749cc', 'name': 'Riyaziyyat', 'file': '11-ci_sinif_riyaziyyat.md'},
        'tarix': {'id': 'a207ea9c-ad75-4c8e-8111-5505534b90ec', 'name': 'Tarix', 'file': '11-ci_sinif_tarix.md'}
    }
}

def parse_matching_ans(ans_str):
    ans_clean = ans_str.strip().replace('–', '-').replace('—', '-')
    parts = re.split(r'[;,]\s*(?=\d+\s*[-:])', ans_clean)
    pairs = {}
    for p in parts:
        m = re.match(r'(\d+)\s*[-:]\s*(.+)', p.strip())
        if m:
            k = m.group(1).strip()
            v_items = [x.strip() for x in re.split(r'[,;]', m.group(2)) if x.strip()]
            pairs[k] = ', '.join(v_items)
    return pairs

def parse_subject(grade, subj_slug, filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    blocks = [b.strip() for b in content.split('\n---\n') if b.strip()]
    parsed_qs = []
    
    for idx, b in enumerate(blocks, 1):
        # 1. Image detection: check inline base64 first
        img_url = None
        img_match = re.search(r'!\[.*?\]\((data:image\/[^;]+;base64,[^\)]+)\)', b)
        if img_match:
            img_url = img_match.group(1)
            b_clean = b.replace(img_match.group(0), '')
        else:
            b_clean = b
            # Check if there is a disk image for this question
            disk_img_path = os.path.join(IMAGES_DIR, f'{grade}-sinif_{subj_slug}_{idx:02d}.png')
            if os.path.exists(disk_img_path):
                # Check file size: ignore full text scans (>500KB)
                sz = os.path.getsize(disk_img_path)
                if sz < 500000:
                    with open(disk_img_path, 'rb') as img_f:
                        b64_str = base64.b64encode(img_f.read()).decode('utf-8')
                    img_url = f'data:image/png;base64,{b64_str}'

        # 2. Tip detection
        tip_match = re.search(r'Tip:\s*(\w+)', b_clean)
        q_type = tip_match.group(1) if tip_match else None

        # 3. Cavab extraction
        ans_match = re.search(r'Cavab:\s*(.+)', b_clean)
        raw_ans = ans_match.group(1).strip() if ans_match else ''

        # 4. Clean body text
        clean_lines = []
        for l in b_clean.split('\n'):
            if re.match(r'^(Cavab|Tip|Kateqoriya):', l.strip()):
                continue
            clean_lines.append(l)
        body = '\n'.join(clean_lines).strip()

        # 5. Extract options
        opt_matches = list(re.finditer(r'^[A-E]\)\s*(.+)$', body, flags=re.MULTILINE))
        matching_pairs = None

        if len(opt_matches) >= 4:
            q_type = 'multiple_choice'
            options = [m.group(1).strip() for m in opt_matches]
            first_opt_start = opt_matches[0].start()
            q_text = body[:first_opt_start].strip().lstrip('# ').strip()

            if re.match(r'^[A-E]$', raw_ans):
                opt_idx = ord(raw_ans.upper()) - 65
                corr_ans = options[opt_idx] if opt_idx < len(options) else raw_ans
            else:
                corr_ans = raw_ans
        elif q_type == 'matching' or ('-' in raw_ans and any(k in raw_ans for k in ['1-', '2-', '3-'])):
            q_type = 'matching'
            options = None
            q_text = body.lstrip('# ').strip()
            pairs = parse_matching_ans(raw_ans)
            matching_pairs = pairs
            corr_ans = raw_ans
        else:
            q_type = q_type or 'numerical'
            options = None
            q_text = body.lstrip('# ').strip()
            corr_ans = raw_ans

        parsed_qs.append({
            'order_index': idx,
            'question_type': q_type,
            'question_text': q_text,
            'options': options,
            'correct_answer': corr_ans,
            'raw_ans': raw_ans,
            'question_image_url': img_url,
            'matching_pairs': matching_pairs
        })
    return parsed_qs

def sync_quiz(grade, subj_slug):
    info = QUIZ_MAP[grade][subj_slug]
    quiz_id = info['id']
    subj_name = info['name']
    md_file = info['file']
    
    # Grade directory name mapping (8-ci, 9-cu, 10-cu, 11-ci)
    grade_dir_map = {8: '8-ci sinif', 9: '9-cu sinif', 10: '10-cu sinif', 11: '11-ci sinif'}
    grade_dir_name = grade_dir_map[grade]
    md_path = os.path.join(IMPORT_DIR, grade_dir_name, md_file)
    if not os.path.exists(md_path):
        md_path = os.path.join(BASE_DIR, grade_dir_name, 'imtahan_store_md', md_file)

    if not os.path.exists(md_path):
        raise FileNotFoundError(f'Markdown not found: {md_path}')

    parsed = parse_subject(grade, subj_slug, md_path)
    if len(parsed) != 20:
        raise ValueError(f'{subj_name} (Grade {grade}): Expected 20 questions, got {len(parsed)}')

    # Fetch DB rows
    get_url = f'http://127.0.0.1:8090/rest/v1/questions?quiz_id=eq.{quiz_id}&select=id,bank_question_id,order_index&order=order_index.asc'
    req = urllib.request.Request(get_url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        db_qs = json.loads(resp.read().decode('utf-8'))

    if len(db_qs) != 20:
        raise ValueError(f'DB Quiz {quiz_id} has {len(db_qs)} questions, expected 20')

    updated_count = 0
    img_count = 0
    for i, p_q in enumerate(parsed):
        db_row = db_qs[i]
        q_id = db_row['id']
        bank_id = db_row.get('bank_question_id')

        if p_q['question_image_url']:
            img_count += 1

        payload = {
            'question_text': p_q['question_text'],
            'question_type': p_q['question_type'],
            'options': p_q['options'],
            'correct_answer': p_q['correct_answer'],
            'question_image_url': p_q['question_image_url'],
            'matching_pairs': p_q['matching_pairs'],
            'order_index': p_q['order_index'],
            'is_required': True,
            'weight': 1.0
        }

        # Update questions table
        patch_url = f'http://127.0.0.1:8090/rest/v1/questions?id=eq.{q_id}'
        p_req = urllib.request.Request(patch_url, data=json.dumps(payload).encode('utf-8'), headers=HEADERS, method='PATCH')
        with urllib.request.urlopen(p_req) as p_resp:
            pass

        # Update question_bank if linked
        if bank_id:
            b_payload = {
                'question_text': p_q['question_text'],
                'question_type': p_q['question_type'],
                'options': p_q['options'],
                'correct_answer': p_q['correct_answer'],
                'question_image_url': p_q['question_image_url'],
                'matching_pairs': p_q['matching_pairs']
            }
            b_url = f'http://127.0.0.1:8090/rest/v1/question_bank?id=eq.{bank_id}'
            b_req = urllib.request.Request(b_url, data=json.dumps(b_payload).encode('utf-8'), headers=HEADERS, method='PATCH')
            with urllib.request.urlopen(b_req) as b_resp:
                pass

        updated_count += 1

    print(f'✅ Grade {grade:02d} | {subj_name:<16} | 20/20 questions synced | Images: {img_count}')

def sync_grade(grade):
    print(f'\n==================== SINIF {grade} BAŞLADI ====================')
    for subj_slug in QUIZ_MAP[grade]:
        sync_quiz(grade, subj_slug)
    print(f'==================== SINIF {grade} TAMAMLANDI ====================\n')

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if target == 'all':
        for g in [8, 9, 10, 11]:
            sync_grade(g)
    else:
        sync_grade(int(target))
