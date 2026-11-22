#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zəfər Olimpiadası (Final) — Şagirdlərin İdxal Skripti
Mənbə: /srv/quizspark-azeri/imports/Imtahan_Store_Final_Import/Zəfər-rayonlar-import.xlsx
Cədvəl: public.final_olympiad_participants
"""

import os
import re
import sys
import json
import zipfile
import subprocess
import xml.etree.ElementTree as ET

EXCEL_PATH = '/srv/quizspark-azeri/imports/Imtahan_Store_Final_Import/Zəfər-rayonlar-import.xlsx'

def get_quizzes_map():
    cmd = [
        'docker', 'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c',
        "SELECT json_agg(t) FROM (SELECT id, title, subject, grade, share_code FROM quizzes WHERE title LIKE '%Zəfər Olimpiadası (Final)%') t;"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    quizzes = json.loads(res.stdout.strip())
    qmap = {}
    for q in quizzes:
        qmap[(q['grade'], q['subject'])] = q
    return qmap

def normalize_subject(subj):
    if not subj:
        return None
    s = str(subj).strip().lower()
    if not s:
        return None
    if 'riyaz' in s:
        return 'Riyaziyyat'
    if 'fizik' in s:
        return 'Fizika'
    if 'kimya' in s:
        return 'Kimya'
    if 'biolo' in s:
        return 'Biologiya'
    if 'tarix' in s:
        return 'Tarix'
    if 'coğra' in s or 'cogra' in s:
        return 'Coğrafiya'
    if 'dil' in s or 'ədəb' in s or 'edeb' in s:
        return 'Azərbaycan dili'
    return None

def read_excel_students(path):
    with zipfile.ZipFile(path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                if t is not None:
                    shared_strings.append(t.text or '')
                else:
                    shared_strings.append(''.join(e.text or '' for e in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')))

        sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows = sheet_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')

        def get_val(c):
            t = c.attrib.get('t')
            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            if v is None:
                return ''
            val = v.text or ''
            if t == 's' and int(val) < len(shared_strings):
                return shared_strings[int(val)]
            return val

        headers = [get_val(c).strip() for c in rows[0].findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')]
        students = []
        for r in rows[1:]:
            cells = [get_val(c).strip() for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')]
            while len(cells) < len(headers):
                cells.append('')
            students.append(dict(zip(headers, cells)))
        return students

def sql_esc(val):
    if val is None:
        return 'NULL'
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def main():
    print("=" * 70)
    print("ZƏFƏR OLİMPİADASI (FINAL) — ŞAGİRD BAZASININ İDXALI")
    print("=" * 70)

    if not os.path.exists(EXCEL_PATH):
        print(f"[XƏTA] Excel faylı tapılmadı: {EXCEL_PATH}")
        sys.exit(1)

    print("[1/4] Final Quizləri bazadan oxunur...")
    qmap = get_quizzes_map()
    print(f"  Tapılan quizlər: {len(qmap)} ədəd.")

    print(f"[2/4] Excel faylı oxunur: {EXCEL_PATH}...")
    students = read_excel_students(EXCEL_PATH)
    print(f"  Ümumi şagird qeydləri: {len(students)} ədəd.")

    print("[3/4] SQL İdxal əmrləri hazırlanır...")
    sql_statements = [
        "BEGIN;",
        "TRUNCATE TABLE public.final_olympiad_participants RESTART IDENTITY CASCADE;"
    ]

    mapped_count = 0
    unmapped_subject_count = 0

    for s in students:
        utis = s['UTİS kodu'].strip().replace(' ', '')
        first_name = s['Ad'].strip()
        last_name = s['Soyad'].strip()
        father_name = s['Ata adı'].strip()
        district = s['Rayon'].strip()
        school = s['Məktəb'].strip()
        class_name = s['Sinif'].strip()
        raw_subject = s['Fənn'].strip()

        # Full name: Soyad Ad Ata adı
        full_name_parts = [last_name, first_name]
        if father_name:
            full_name_parts.append(father_name)
        full_name = " ".join(full_name_parts).strip()

        # Grade level & Age group
        m = re.match(r'^(\d+)', class_name)
        grade_num = int(m.group(1)) if m else 9
        age_group = 'AYQ' if grade_num in (8, 9) else 'YYQ'

        # Subject normalization
        norm_subject = normalize_subject(raw_subject)

        target_quiz = qmap.get((age_group, norm_subject))
        target_quiz_id = target_quiz['id'] if target_quiz else None
        target_share_code = target_quiz['share_code'] if target_quiz else None

        if target_quiz:
            mapped_count += 1
        else:
            unmapped_subject_count += 1

        sql_statements.append(f"""
        INSERT INTO public.final_olympiad_participants (
            utis_code, first_name, last_name, father_name, full_name,
            district, school, class_name, grade_level, age_group,
            raw_subject, subject, target_quiz_id, target_share_code, is_backup_entry
        ) VALUES (
            {sql_esc(utis)}, {sql_esc(first_name)}, {sql_esc(last_name)}, {sql_esc(father_name)}, {sql_esc(full_name)},
            {sql_esc(district)}, {sql_esc(school)}, {sql_esc(class_name)}, {grade_num}, {sql_esc(age_group)},
            {sql_esc(raw_subject)}, {sql_esc(norm_subject)}, {sql_esc(target_quiz_id)}, {sql_esc(target_share_code)}, false
        );
        """)

    sql_statements.append("COMMIT;")

    sql_script = "\n".join(sql_statements)
    temp_sql_path = "/tmp/import_final_participants.sql"
    with open(temp_sql_path, "w", encoding="utf-8") as f:
        f.write(sql_script)

    print(f"[4/4] PostgreSQL-ə {len(students)} şagird daxil edilir...")
    cmd = ["docker", "exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres"]
    with open(temp_sql_path, "rb") as f:
        res = subprocess.run(cmd, stdin=f, capture_output=True, text=True, check=True)

    print("  SQL icra tamamlandı.")
    print(f"  Birbaşa quizə bağlanan: {mapped_count} şagird.")
    print(f"  Fənni seçilməli olan: {unmapped_subject_count} şagird.")
    print(f"  Cəmi uğurla bazaya yazılan: {len(students)} şagird.")

if __name__ == '__main__':
    main()
