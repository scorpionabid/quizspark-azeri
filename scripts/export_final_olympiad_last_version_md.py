#!/usr/bin/env python3
"""
Zəfər Olimpiadası — Final Mərhələsi (AYQ və YYQ) Son Vəziyyət MD İxracatçısı
Bazada olan ən son düzəlişlər (LaTeX riyaziyyat formulları, 70 açıq sual normalizasiyası,
düzəldilmiş şəkillər və cavablar) əsasında offline istifadə üçün tam Markdown paketini yaradır.
"""

import os
import sys
import re
import json
import shutil
import subprocess

OUTPUT_ROOT = "/srv/quizspark-azeri/imports/Final_Olimpiada_Last_Version_MD"
SOURCE_IMAGES_DIR = "/srv/quizspark-azeri/imports/Imtahan_Store_Final_Import/images"

SUBJECT_FILENAME_MAP = {
    'Azərbaycan dili': 'Azerbaycan_Dili',
    'Riyaziyyat': 'Riyaziyyat',
    'Fizika': 'Fizika',
    'Kimya': 'Kimya',
    'Biologiya': 'Biologiya',
    'Tarix': 'Tarix',
    'Coğrafiya': 'Cografiya'
}

def get_quizzes_data():
    cmd = ['docker', 'exec', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', """
    SELECT json_agg(t) FROM (
      SELECT 
        qz.id as quiz_id,
        qz.title as quiz_title,
        qz.subject,
        qz.grade,
        (
          SELECT json_agg(q_row ORDER BY q_row.order_index) FROM (
            SELECT 
              q.id,
              q.order_index,
              q.question_type,
              q.question_text,
              q.options,
              q.correct_answer,
              q.accepted_answers,
              q.explanation,
              q.question_image_url
            FROM public.questions q
            WHERE q.quiz_id = qz.id
          ) q_row
        ) as questions
      FROM public.quizzes qz
      WHERE qz.exam_category = 'Olimpiada' AND qz.title LIKE '%(Final)%'
      ORDER BY qz.title
    ) t;
    """]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return json.loads(res.stdout.strip())

def format_question_block(q, grade_tag, category, rel_img_prefix="../images/"):
    order_idx = q['order_index']
    q_text = q['question_text'].strip()
    q_type = q['question_type']
    opts = q['options'] or []
    raw_ans = q['correct_answer']
    img_url = q['question_image_url']
    
    lines = []
    
    # Heading & Question Text
    lines.append(f"# {order_idx}. {q_text}")
    lines.append("")
    
    # Image if present
    if img_url:
        img_name = os.path.basename(img_url)
        lines.append(f"![Sual şəkli]({rel_img_prefix}{img_name})")
        lines.append("")
        
    # Options or Short Answer
    if q_type == 'multiple_choice':
        letters = ['A', 'B', 'C', 'D', 'E']
        matched_letter = None
        
        # Determine correct letter
        if raw_ans in opts:
            idx = opts.index(raw_ans)
            matched_letter = letters[idx] if idx < len(letters) else 'A'
        elif raw_ans in letters:
            matched_letter = raw_ans
        elif raw_ans.isdigit() and int(raw_ans) < len(opts):
            matched_letter = letters[int(raw_ans)]
        else:
            for idx, opt in enumerate(opts):
                if opt.strip() == raw_ans.strip():
                    matched_letter = letters[idx]
                    break
                    
        for idx, opt in enumerate(opts):
            l_code = letters[idx] if idx < len(letters) else f"({idx+1})"
            lines.append(f"{l_code}) {opt}")
        lines.append("")
        
        lines.append(f"Cavab: {matched_letter or raw_ans}")
        lines.append(f"Kateqoriya: {category}")
        lines.append("Çətinlik: çətin")
        lines.append(f"Taqlar: Zəfər Olimpiadası, Final, {grade_tag}")
    else:
        # short_answer (open question)
        parts = raw_ans.split('|')
        canonical = parts[0].strip()
        variants = [p.strip() for p in parts[1:] if p.strip()]
        
        lines.append(f"Cavab: {canonical}")
        if variants:
            lines.append(f"Qəbul edilən variantlar: {' | '.join(variants)}")
        lines.append("Sual növü: Açıq")
        lines.append(f"Kateqoriya: {category}")
        lines.append("Çətinlik: çətin")
        lines.append(f"Taqlar: Zəfər Olimpiadası, Final, {grade_tag}")
        
    lines.append("")
    lines.append("---")
    lines.append("")
    return "\n".join(lines)

def main():
    print("[1/5] Bazadan Zəfər Olimpiadası (Final) sualları oxunur...")
    quizzes = get_quizzes_data()
    print(f"  Tapılan quiz sayı: {len(quizzes)}")
    
    ayq_dir = os.path.join(OUTPUT_ROOT, "01_AYQ_Final")
    yyq_dir = os.path.join(OUTPUT_ROOT, "02_YYQ_Final")
    images_dir = os.path.join(OUTPUT_ROOT, "images")
    
    os.makedirs(ayq_dir, exist_ok=True)
    os.makedirs(yyq_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)
    
    print("[2/5] Şəkillər kopyalanır...")
    if os.path.exists(SOURCE_IMAGES_DIR):
        for img in os.listdir(SOURCE_IMAGES_DIR):
            if img.lower().endswith(('.png', '.jpg', '.jpeg', '.svg', '.webp')):
                shutil.copy2(os.path.join(SOURCE_IMAGES_DIR, img), os.path.join(images_dir, img))
    print(f"  Kopyalanan şəkil sayı: {len(os.listdir(images_dir))}")
    
    # Create images inside 01_AYQ_Final and 02_YYQ_Final for relative compatibility
    for sub_dir in [ayq_dir, yyq_dir]:
        sub_img_dir = os.path.join(sub_dir, "images")
        os.makedirs(sub_img_dir, exist_ok=True)
        for img in os.listdir(images_dir):
            shutil.copy2(os.path.join(images_dir, img), os.path.join(sub_img_dir, img))
            
    print("[3/5] Fənlər üzrə Markdown faylları generasiya olunur...")
    
    ayq_all_blocks = []
    yyq_all_blocks = []
    master_all_blocks = []
    
    ayq_all_blocks.append("# Zəfər Olimpiadası — Final Mərhələsi (AYQ / VIII-IX Siniflər)\n## Bütün Fənlər üzrə Suallar (Son Baza Versiyası)\n\n---\n\n")
    yyq_all_blocks.append("# Zəfər Olimpiadası — Final Mərhələsi (YYQ / X-XI Siniflər)\n## Bütün Fənlər üzrə Suallar (Son Baza Versiyası)\n\n---\n\n")
    master_all_blocks.append("# Zəfər Olimpiadası — Final Mərhələsi (Master Paket)\n## Bütün Qruplar və Bütün Fənlər (280 Sual — Son Versiya)\n\n---\n\n")
    
    for qz in quizzes:
        title = qz['quiz_title']
        subject = qz['subject']
        questions = qz['questions']
        
        is_ayq = 'AYQ' in title
        grade_tag = 'AYQ (8-9 Sinif)' if is_ayq else 'YYQ (10-11 Sinif)'
        target_dir = ayq_dir if is_ayq else yyq_dir
        prefix = 'AYQ' if is_ayq else 'YYQ'
        
        subj_slug = SUBJECT_FILENAME_MAP.get(subject, subject.replace(' ', '_'))
        filename = f"{prefix}_{subj_slug}.md"
        filepath = os.path.join(target_dir, filename)
        
        category = "Azərbaycan dili və Ədəbiyyat" if subject == "Azərbaycan dili" else subject
        
        file_lines = []
        file_lines.append(f"# {title}")
        file_lines.append(f"**Fənn:** {subject} | **Mərhələ:** Final | **Sual sayı:** {len(questions)}")
        file_lines.append("")
        file_lines.append("---")
        file_lines.append("")
        
        for q in questions:
            block = format_question_block(q, grade_tag, category, rel_img_prefix="../images/")
            file_lines.append(block)
            
            # For combined files
            if is_ayq:
                ayq_all_blocks.append(block)
            else:
                yyq_all_blocks.append(block)
                
            master_block = format_question_block(q, grade_tag, category, rel_img_prefix="./images/")
            master_all_blocks.append(master_block)
            
        with open(filepath, "w", encoding="utf-8") as fp:
            fp.write("\n".join(file_lines))
        print(f"  Yazıldı: {filename} ({len(questions)} sual)")
        
    # Write combined files
    ayq_combined_path = os.path.join(ayq_dir, "AYQ_Final_Butun_Fennler.md")
    with open(ayq_combined_path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(ayq_all_blocks))
    print("  Yazıldı: 01_AYQ_Final/AYQ_Final_Butun_Fennler.md")
    
    yyq_combined_path = os.path.join(yyq_dir, "YYQ_Final_Butun_Fennler.md")
    with open(yyq_combined_path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(yyq_all_blocks))
    print("  Yazıldı: 02_YYQ_Final/YYQ_Final_Butun_Fennler.md")
    
    # Write master file
    master_path = os.path.join(OUTPUT_ROOT, "Zefer_Olimpiadasi_Final_Butun_Suallar_Master.md")
    with open(master_path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(master_all_blocks))
    print("  Yazıldı: Zefer_Olimpiadasi_Final_Butun_Suallar_Master.md")
    
    # Write README
    readme_path = os.path.join(OUTPUT_ROOT, "README.md")
    with open(readme_path, "w", encoding="utf-8") as fp:
        fp.write("""# Zəfər Olimpiadası — Final Mərhələsi (Offline Suallar Paketi — Son Versiya)

Bu paket Zəfər Olimpiadasının Final mərhələsi üçün sistemin canlı verilənlər bazasından (`public.questions`) ən son vəziyyətdə ixrac edilmiş rəsmi sual bazasıdır.

## 📊 Paket Tərkibi
- **Ümumi Sual Sayı:** 280 sual (14 fənn × 20 sual)
- **Qapalı (çoxseçimli) suallar:** 210 ədəd (A, B, C, D, E)
- **Açıq tipli suallar:** 70 ədəd (Fənlər üzrə 16-20-ci suallar, qəbul edilən bütün düzgün variantlar göstərilmişdir)
- **Riyaziyyat Formulları:** LaTeX formatında təmizlənmiş və render edilə bilən formadadır.
- **Şəkillər:** `images/` qovluğunda bütün 32 qrafik və sxem yüksək keyfiyyətdə saxlanılır.

## 📁 Qovluq Strukturu
- `01_AYQ_Final/`: Aşağı Yaş Qrupu (8-9-cu siniflər) üzrə 7 fənn + 1 ümumi birləşdirilmiş fayl.
- `02_YYQ_Final/`: Yuxarı Yaş Qrupu (10-11-ci siniflər) üzrə 7 fənn + 1 ümumi birləşdirilmiş fayl.
- `images/`: Bütün şəkillər (PNG).
- `Zefer_Olimpiadasi_Final_Butun_Suallar_Master.md`: Bütün 14 fənni və 280 sualı bir yerdə cəmləyən master fayl.

## 💻 Offline İstifadə Qaydası
Faylları istənilən Markdown oxuyucusu (Obsidian, VS Code, Typora, Notepad++, GitHub Desktop və ya Markdown Viewer brauzer əlavələri) ilə internetsiz rahatlıqla açıb baxa, çap edə və ya axtarış apara bilərsiniz.
""")
    print("[4/5] README.md yaradıldı.")
    print("[5/5] Tam paket uğurla hazırlandı!")

if __name__ == "__main__":
    main()
