import os
#!/usr/bin/env python3
"""
Zəfər Olimpiadası (Qəbələ turu) — Quiz Adlarının Yenilənməsi Skripti.
Tələb:
- Fənnin adı ən əvvələ çəkilir (məs: "Riyaziyyat (IX sinif) — Zəfər Olimpiadası (Qəbələ turu)").
- "Zəfər Olimpiadası" ifadəsinin yanına "(Qəbələ turu)" əlavə olunur.
- Şagird kartlarda fənni dərhal görür, cümlənin sonunda kəsilmir.
"""

import json
import urllib.request

HEADERS = {
    'apikey': 'os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Authorization': 'Bearer os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

ROMAN_MAP = {
    '8': 'VIII',
    '9': 'IX',
    '10': 'X',
    '11': 'XI'
}

def get_quizzes():
    url = 'http://127.0.0.1:8090/rest/v1/quizzes?exam_category=eq.Olimpiada&select=id,title,grade,subject,description&order=grade,subject'
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def patch_quiz(quiz_id, payload):
    url = f'http://127.0.0.1:8090/rest/v1/quizzes?id=eq.{quiz_id}'
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=HEADERS, method='PATCH')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    quizzes = get_quizzes()
    print(f"🚀 {len(quizzes)} Zəfər Olimpiadası quizinin adı yenilənir...\n")

    for q in quizzes:
        grade_str = str(q['grade'])
        roman = ROMAN_MAP.get(grade_str, f"{grade_str}-ci")
        subj = q['subject']
        
        # New Title: {Subject} ({Roman} sinif) — Zəfər Olimpiadası (Qəbələ turu)
        new_title = f"{subj} ({roman} sinif) — Zəfər Olimpiadası (Qəbələ turu)"
        
        # New Description:
        suffix = 'ci' if grade_str in ['8', '11'] else 'cu'
        new_desc = f"{grade_str}-{suffix} sinif şagirdləri üçün {subj} fənni üzrə Zəfər olimpiadası (Qəbələ turu) sınaq imtahanı (20 sual)."

        patch_quiz(q['id'], {
            'title': new_title,
            'description': new_desc
        })
        print(f"✓ {new_title}")

    print("\n✅ Bütün 32 quizin adı uğurla dəyişdirildi!")

if __name__ == '__main__':
    main()
