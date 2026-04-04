export const TEMPLATES: Record<string, string> = {
  aiken: `Sual mətni bura yazılır\nA) Birinci variant\nB) İkinci variant\nC) Üçüncü variant\nANSWER: A\nCATEGORY: Riyaziyyat\nDIFFICULTY: orta\nEXPLANATION: Sualın izahı bura yazılır\nTAGS: cəbr, tənliklər\nBLOOM: anlama`,
  gift: `// Sualın adı vacib deyil\n::Sualın Adı:: Sual mətni bura yazılır {\n  =Düzgün variant #İzah bura yazılır\n  ~Səhv variant 1\n  ~Səhv variant 2\n}`,
  markdown: `# ═══════════════════════════════════════════════════
# MARKDOWN SUAL ŞABLONU — tam bələdçi
# ═══════════════════════════════════════════════════
# QAYDA: Hər sual "---" ilə ayrılmalıdır.
# Metadata sətirləri (Cavab, Kateqoriya…) hər sualın
# altında yazılır. Tiplər üçün "Tip:" açar sözü lazımdır.
# ═══════════════════════════════════════════════════

## ── FORMAT 1: Çoxseçimli — tək düzgün cavab ─────────

# Azərbaycanın paytaxtı hansı şəhərdir?
A) Gəncə
B) Bakı
C) Sumqayıt
D) Lənkəran

Cavab: B
Kateqoriya: Coğrafiya
Çətinlik: asan
İzahat: Bakı 1918-ci ildən Azərbaycanın paytaxtıdır.
Bloom: bilmə
Taqlar: paytaxt, coğrafiya

---

## ── FORMAT 2: Çoxseçimli — çoxlu düzgün cavab ───────
## NOT: Hərf (A, C) VƏ YA rəqəm (1, 3, 4) ilə cavab vermək olar — hər ikisi işləyir.

# Aşağıdakılardan hansılar Azərbaycan dövlət rəmzləridir?
A) Dövlət bayrağı
B) Milli valyuta
C) Dövlət gerbi
D) Dövlət himni

Cavab: A, C, D
## Alternativ: Cavab: 1, 3, 4 — eyni nəticəni verir
Kateqoriya: Ümumi Bilik
Çətinlik: orta

---

## ── FORMAT 3: Doğru / Yanlış ────────────────────────

# Azərbaycan 1991-ci ildə müstəqilliyini elan etdi?
A) Doğru
B) Yanlış

Cavab: A
Kateqoriya: Tarix
Çətinlik: asan

---

## ── FORMAT 4: Qısa cavab (opsiyasız) ───────────────

# Azərbaycanın ilk prezidenti kim olub?
Cavab: Ayaz Mütəllibov
Kateqoriya: Tarix
Çətinlik: orta

---

## ── FORMAT 5: Uyğunlaşdırma — arrow formatı ────────
## NOT: "Tip: matching" olmadan da → işarəsi avtomatik aşkarlanır.

Tip: matching
# Əsərləri müəllifləri ilə uyğunlaşdırın:
Dədə Qorqud → Türk xalq dastanı
Ana → Maksim Gorki
Don Kixot → Servantes

Kateqoriya: Ədəbiyyat
Çətinlik: orta

---

## ── FORMAT 6: Uyğunlaşdırma — siyahı formatı ───────
## MÜTLƏQ: Bu format üçün "Tip: matching" sətri lazımdır!
## Cavab formatı: "1-a; 2-b; 3-c" (nöqtəli vergüllə ayırın)
## N:M nümunəsi: 1 sol element → birdən çox sağa uyğundursa: "1-a, c; 2-b"

Tip: matching
# Anlayışları izahları ilə uyğunlaşdırın:
1. Demokrasiya
2. Monarxiya
3. Respublika

a) Xalqın hakimiyyəti
b) Irsi dövlət başçısı
c) Seçkili dövlət başçısı

Cavab: 1-a; 2-b; 3-c
Kateqoriya: Siyasi elmlər
Çətinlik: çətin

---

## ── FORMAT 7: Boşluq doldur ─────────────────────────

Tip: fill_blank
# Azərbaycanın paytaxtı ___ şəhəridir.

Cavab: Bakı
Kateqoriya: Coğrafiya
Çətinlik: asan

---

## ── FORMAT 8: Ardıcıllıq ────────────────────────────

Tip: ordering
# Hadisələri xronoloji ardıcıllıqla sıralayın:
- Birinci Dünya Müharibəsinin başlanması
- Sovet İttifaqının yaranması
- Azərbaycanın müstəqillik elanı

Kateqoriya: Tarix
Çətinlik: orta

---

## ── FORMAT 9: Rəqəmsal cavab ────────────────────────

Tip: numerical
# Suyun qaynama temperaturu neçə dərəcədir (°C)?

Cavab: 100
Tolerans: 0.5
Kateqoriya: Fizika
Çətinlik: asan

---

## ── FORMAT 10: Kod sualı ─────────────────────────────

Tip: code
# Aşağıdakı Python kodu nə çap edir?

\`\`\`python
x = [1, 2, 3]
print(len(x))
\`\`\`

Cavab: 3
Dil: python
Kateqoriya: Proqramlaşdırma
Çətinlik: asan

---

## ══════════════════════════════════════════════════
## METADATA AÇAR SÖZLƏRİ (hamısı ixtiyaridir)
## ══════════════════════════════════════════════════
## Cavab:        Düzgün cavab (hərf: A, B, C / rəqəm: 1, 2, 3 / mətn)
##               Çoxlu cavab: "A, C, D" və ya "1, 3, 4" (vergüllə)
##               Matching: "1-a; 2-b; 3-c" (nöqtəli vergüllə)
## Kateqoriya:   Sualın kateqoriyası
## Çətinlik:     asan / orta / çətin
## İzahat:       Sualın izahı
## Bloom:        bilmə / anlama / tətbiq / analiz / sintez / qiymətləndirmə
## Taqlar:       tag1, tag2, tag3
## Tolerans:     Rəqəmsal suallar üçün ±tolerans dəyəri
## Dil:          Kod sualları üçün proqramlaşdırma dili
## ══════════════════════════════════════════════════`,
  csv: `question_text,question_type,variant_a,variant_b,variant_c,variant_d,correct_answer,explanation,category,difficulty,bloom_level,tags\n"Sual mətni",multiple_choice,"Var A","Var B","Var C","Var D","Var A","İzah","Riyaziyyat","orta","anlama","tag1;tag2"`,
  json: `[\n  {\n    "question_text": "Sual mətni",\n    "question_type": "multiple_choice",\n    "options": ["A", "B", "C"],\n    "correct_answer": "A",\n    "explanation": "İzah",\n    "category": "Kateqoriya",\n    "difficulty": "orta",\n    "tags": ["tag1"]\n  }\n]`,
  moodle_xml: `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <!-- Çoxseçimli sual nümunəsi -->
  <question type="multichoice">
    <name><text>Hüceyrə biologiyası</text></name>
    <questiontext format="html">
      <text><![CDATA[<p>ATP sintez hansı orqanoidda baş verir?</p>]]></text>
    </questiontext>
    <generalfeedback format="html"><text>Mitoxondria "hüceyrənin enerji stansiyası" adlanır.</text></generalfeedback>
    <single>1</single>
    <answer fraction="100" format="html">
      <text>Mitoxondria</text>
      <feedback format="html"><text>Düzgündür!</text></feedback>
    </answer>
    <answer fraction="0" format="html">
      <text>Nüvə</text>
    </answer>
    <answer fraction="0" format="html">
      <text>Ribosoma</text>
    </answer>
    <tags>
      <tag><text>biologiya</text></tag>
    </tags>
  </question>

  <!-- Şəkilli sual — base64 şəkil embedded -->
  <question type="multichoice">
    <name><text>Diaqram sualı</text></name>
    <questiontext format="html">
      <text><![CDATA[<p>Diaqramdakı hansı hissə A ilə işarələnib?</p>
      <img src="@@PLUGINFILE@@/diagram.png" />]]></text>
      <file name="diagram.png" path="/" encoding="base64">iVBORw0KGgoAAAANSUhEUg==</file>
    </questiontext>
    <single>1</single>
    <answer fraction="100"><text>Nüvə</text></answer>
    <answer fraction="0"><text>Membran</text></answer>
  </question>
</quiz>`,
};

export const FORMAT_INFO: Record<string, string> = {
  json: 'Mürəkkəb data strukturu üçün ən uyğun formatdır.',
  csv: 'Excel və ya Google Sheets-də hazırlanmış suallar üçün.',
  aiken: 'Sadə çoxseçimli suallar üçün sürətli format.',
  gift: 'Moodle uyğunluğu və müxtəlif sual tipləri (MC, T/F, Short) üçün.',
  markdown:
    'Ən etibarlı və çevik format — 10 fərqli sual tipi: Çoxseçimli (tək/çoxlu cavab), Doğru/Yanlış, Qısa cavab, Uyğunlaşdırma (arrow və siyahı), Ardıcıllıq, Boşluq doldurma, Rəqəmsal, Kod. Şablonu yükləyin, qaydlara uyğun hazırlayın — sıfıra yaxın xəta əldə edin.',
  moodle_xml:
    'Moodle LMS-dən export edilmiş XML fayllar üçün. Base64 kodlu şəkillər avtomatik Supabase-ə yüklənir. Dəstəklənən tiplər: multichoice, truefalse, shortanswer, essay, matching, numerical, cloze.',
};

export const AI_STAGE_LABELS: Record<string, string> = {
  uploading: 'Yüklənir...',
  analyzing: 'AI analiz edir...',
  structuring: 'Suallar strukturlaşdırılır...',
  done: 'Tamamlandı!',
  error: 'Xəta baş verdi',
};

export type ImportFormat = 'json' | 'csv' | 'aiken' | 'gift' | 'markdown' | 'moodle_xml';
