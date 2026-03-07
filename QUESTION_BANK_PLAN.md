# Question Bank Təkmilləşdirmə Planı

> Tarix: 2026-03-07
> Scope: 4 prioritet sahə — Sıralama, Bloom Statistikası, Media Upload, AI Enhancement UI

---

## Mövcud Vəziyyət

`/teacher/question-bank` artıq tam funksional bir feature-dir:
- ✅ Tam CRUD (create, read, update, delete)
- ✅ Bulk əməliyyatlar (sil, kateqoriya/çətinlik dəyiş)
- ✅ Import/Export (JSON + CSV)
- ✅ Kateqoriya idarəetməsi (rəngli)
- ✅ Filtrlər (axtar, kateqoriya, çətinlik, növ)
- ✅ Sayfalama (50/səhifə)
- ✅ Subscription gate (VIP-only actions)

**Boşluqlar:**
- ❌ Cədvəldə sıralama yoxdur
- ❌ Bloom səviyyəsi statistikası göstərilmir
- ❌ Media/şəkil yükləmə UI yoxdur (DB sahələri var)
- ❌ `enhance-question` edge function hazırdır, lakin heç bir UI yoxdur

---

## Phase 1 — Sütun Sıralama

### Məqsəd
`QuestionTable`-da sütun başlıqlarına klik edərək asc/desc sıralama.

### Dəyişdirilən fayllar

| Fayl | Dəyişiklik |
|------|-----------|
| `src/hooks/useQuestionBank.ts` | `useQuestionBankList`-ə `sortBy` + `sortDir` params əlavə et; `.order()` dinamik olsun |
| `src/components/question-bank/QuestionTable.tsx` | Sort icon-lu kliklenebilir sütun başlıqları; `onSort(col, dir)` callback prop |
| `src/pages/teacher/QuestionBankPage.tsx` | `sortBy`/`sortDir` state; hook-a ötür |

### Sort edilə bilən sütunlar
`created_at` (default ↓), `difficulty`, `category`, `question_type`

---

## Phase 2 — Bloom Səviyyəsi Statistikası

### Məqsəd
Stats panelindəki 4 kart-a "Bloom Paylanması" kartını əlavə et.

### Dəyişdirilən fayllar

| Fayl | Dəyişiklik |
|------|-----------|
| `src/hooks/useQuestionBank.ts` | `useQuestionBankStats`-a bloom_level count sorgusu; `QuestionBankStats` tipinə `bloomLevelCounts: Record<string, number>` |
| `src/pages/teacher/QuestionBankPage.tsx` | Yeni "Bloom Paylanması" stats kartı; 6 səviyyə pill/badge şəklində |

### Bloom səviyyələri (Azərbaycanca)
`xatırlama`, `anlama`, `tətbiq`, `analiz`, `qiymətləndirmə`, `yaratma`

---

## Phase 3 — Şəkil/Media Upload

### Məqsəd
`QuestionEditDialog`-a media yükləmə bölməsi əlavə et. `question_image_url`, `media_url`, `media_type` sahələrini form-da göstər.

### Yeni fayllar

- `src/hooks/useQuestionImageUpload.ts` — Supabase Storage `question-images` bucket-ına yükləyən minimal hook; public URL qaytarır

### Dəyişdirilən fayllar

| Fayl | Dəyişiklik |
|------|-----------|
| `src/components/question-bank/QuestionEditDialog.tsx` | "Media" bölməsi: file input + preview (şəkil), media URL input, media növü select |
| `supabase/migrations/...sql` | `question-images` storage bucket yaratma + public policy |

---

## Phase 4 — AI Enhancement UI

### Məqsəd
`enhance-question` edge function-un 6 action-ını UI-da expose et.

**Edge function actions:**
- `simplify` — Sadələşdir
- `harder` — Çətinləşdir
- `improve_options` — Cavabları yaxşılaşdır
- `expand_explanation` — İzahatı genişləndir
- `similar` — Oxşar sual yarat
- `quality_analysis` — Keyfiyyət analizi (score + təkliflər)

### Yeni fayllar

- `src/hooks/useEnhanceQuestion.ts` — `supabase.functions.invoke('enhance-question')` çağıran hook; `QuestionBankItem` ↔ edge func format transformasiyası
- `src/components/question-bank/QuestionEnhanceDialog.tsx` — Dialog:
  - Sol: cari sual (read-only)
  - Orta: 6 action düyməsi
  - Sağ: AI preview (yaxud quality analysis score kartları)
  - "Qəbul et" → mövcud sualı yeniləyir
  - "Yeni olaraq saxla" → yalnız `similar` action üçün
  - `SubscriptionGate` (`question_bank_write`) ilə VIP-ə məhdudlandırılır

### Dəyişdirilən fayllar

| Fayl | Dəyişiklik |
|------|-----------|
| `src/components/question-bank/QuestionTable.tsx` | Dropdown-a "AI Gücləndir" (Sparkles icon) əlavə et |
| `src/pages/teacher/QuestionBankPage.tsx` | `enhanceQuestion` state + `QuestionEnhanceDialog` render |

---

## Arxitektura Xəritəsi

```
QuestionBankPage.tsx
├── useQuestionBankList(pagination, filters, { sortBy, sortDir })   [Phase 1]
├── useQuestionBankStats()  →  bloomLevelCounts                     [Phase 2]
├── QuestionTable
│   ├── onSort(col, dir) callback                                   [Phase 1]
│   └── onEnhance(question) callback  →  QuestionEnhanceDialog      [Phase 4]
├── QuestionEditDialog  →  useQuestionImageUpload                   [Phase 3]
└── QuestionEnhanceDialog  →  useEnhanceQuestion                   [Phase 4]
```

---

## Yoxlama Ssenarisi

1. **Sort:** Sütun başlığına klik → sort icon ↑/↓ dəyişir, suallar yenidən sıralanır
2. **Bloom stats:** Bloom səviyyəsi olan suallar sayılır; null olanlar sayılmır
3. **Media:** Şəkil seçildi → preview görünür → saxlanır → cədvəldə thumbnail görünür
4. **AI enhance:** Dropdown → "AI Gücləndir" → dialog açılır → action seçilir → preview göstərilir → "Qəbul et" sualı yeniləyir
5. `npm run lint` + `npx tsc --noEmit` — sıfır xəta

---

## Kritik Fayllar

```
src/
├── hooks/
│   ├── useQuestionBank.ts          (dəyişdirilir)
│   ├── useEnhanceQuestion.ts       (yeni)
│   └── useQuestionImageUpload.ts   (yeni)
├── components/question-bank/
│   ├── QuestionTable.tsx           (dəyişdirilir)
│   ├── QuestionEditDialog.tsx      (dəyişdirilir)
│   └── QuestionEnhanceDialog.tsx   (yeni)
└── pages/teacher/
    └── QuestionBankPage.tsx        (dəyişdirilir)
supabase/migrations/
    └── YYYYMMDD_question_images_storage.sql  (yeni)
```
