export const TEMPLATES: Record<string, string> = {
  aiken: `Sual mətni bura yazılır\nA) Birinci variant\nB) İkinci variant\nC) Üçüncü variant\nANSWER: A\nCATEGORY: Riyaziyyat\nDIFFICULTY: orta\nEXPLANATION: Sualın izahı bura yazılır\nTAGS: cəbr, tənliklər\nBLOOM: anlama`,
  gift: `// Sualın adı vacib deyil\n::Sualın Adı:: Sual mətni bura yazılır {\n  =Düzgün variant #İzah bura yazılır\n  ~Səhv variant 1\n  ~Səhv variant 2\n}`,
  markdown: `### Format 1: Çoxseçimli (Həmçinin Çoxlu Cavab)
# Sual mətni bura yazılır
A) Birinci variant # Bu variantın izahı
B) İkinci variant # Bu variantın izahı
C) Düzgün variant # Düzgün cavabın izahı
D) Dördüncü variant

Cavab: C
Izahat: Sualın ümumi izahı bura yazılır
Kateqoriya: Riyaziyyat
Çətinlik: orta
Bloom: anlama
Taqlar: cəbr, tənliklər

---

### Format 2: Uyğunlaşdırma (Matching)
Tip: matching
Əsərləri müəllifləri ilə uyğunlaşdırın:
Dədə Qorqud → Türk xalq dastanı
Ana → Maksim Gorki
Don Kixot → Servantes

Kateqoriya: Ədəbiyyat
Çətinlik: orta

---

### Format 3: Boşluq Doldur (Fill in the Blank)
Tip: fill_blank
Azərbaycanın paytaxtı ___ şəhədir.

Cavab: Bakı
Kateqoriya: Coğrafiya
Çətinlik: asan

---

### Format 4: Ardıcıllıq (Ordering)
Tip: ordering
Hadisələri xronoloji ardıcıllıqla sıralayın:
- Birinci Dünya Müharibəsi (1914)
- Sovet İttifaqının yaranması (1922)
- Azərbaycanın müstəqillik elanı (1991)

Kateqoriya: Tarix
Çətinlik: orta

---

### Format 5: Doğru/Yanlış və ya Qısa Cavab
Azərbaycanın paytaxtı Bakı şəhəridir?
A) Doğru
B) Yanlış
Cavab: A`,
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
    'Ən çevik format — 8 fərqli üslub dəstəklənir: Çoxseçimli (Format 1), Çoxlu Cavab (Format 2), Doğru/Yanlış (Format 3), Qısa cavab (Format 4), Uyğunlaşdırma (Format 5), Boşluq doldur (Format 6), Ardıcıllıq (Format 7), Kod sualı (Format 8). Şablonu yükləyin.',
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
