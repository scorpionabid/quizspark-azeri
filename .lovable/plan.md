
# AI Suallarını Sual Bankına Əlavə Et & Kateqoriya İdarəetmə Planı

## Məqsəd
1. AI Köməkçi səhifəsindəki "Kopyala" düyməsini "Sual Bankına Əlavə Et" funksiyası ilə əvəz etmək
2. Sual Bankında kateqoriya yaratmaq, redaktə etmək və silmək funksionallığı əlavə etmək

---

## 1. EditableQuestionCard Komponenti - Düymə Dəyişikliyi

**Fayl:** `src/components/quiz/EditableQuestionCard.tsx`

Dəyişikliklər:
- "Kopyala" düyməsini "Bankına Əlavə Et" düyməsi ilə əvəz et
- Yeni `onAddToBank` prop əlavə et
- Düyməyə `Database` ikonu əlavə et
- Əlavə edildikdən sonra uğur statusu göstər

```text
┌─────────────────────────────────────────────┐
│  Sual 1                    [Redaktə] [+Bank]│
│  ─────────────────────────────────          │
│  Sual mətni burada...                       │
│  A) Variant 1 ✓                             │
│  B) Variant 2                               │
└─────────────────────────────────────────────┘
```

---

## 2. AIAssistantPage - Tək Sual Əlavəsi

**Fayl:** `src/pages/teacher/AIAssistantPage.tsx`

Dəyişikliklər:
- Yeni `handleAddToBank` funksiyası yaradılacaq
- Bu funksiya tək bir sualı birbaşa Supabase-ə əlavə edəcək
- `useCreateQuestionBank` hook-dan istifadə ediləcək
- Hər sual üçün ayrı-ayrı "Bankına Əlavə Et" düyməsi işləyəcək

---

## 3. Kateqoriya İdarəetmə Komponenti

**Yeni Fayl:** `src/components/question-bank/CategoryManagementDialog.tsx`

Bu komponent aşağıdakı funksiyaları təmin edəcək:
- Mövcud kateqoriyaları siyahı formasında göstərmək
- Yeni kateqoriya yaratmaq (ad, təsvir, rəng)
- Kateqoriyanı redaktə etmək
- Kateqoriyanı silmək

```text
┌─────────────────────────────────────────────┐
│  Kateqoriyalar                    [+ Yeni]  │
│  ───────────────────────────────────────    │
│  ● Riyaziyyat (mavi)         [✏️] [🗑️]     │
│  ● Fizika (yaşıl)            [✏️] [🗑️]     │
│  ● Kimya (qırmızı)           [✏️] [🗑️]     │
└─────────────────────────────────────────────┘
```

---

## 4. QuestionBankPage - Kateqoriya Düyməsi

**Fayl:** `src/pages/teacher/QuestionBankPage.tsx`

Dəyişikliklər:
- Header hissəsinə "Kateqoriyalar" düyməsi əlavə et
- `CategoryManagementDialog` komponentini import et
- Dialog açmaq üçün state əlavə et
- `useQuestionCategories` hook-dan istifadə et

---

## 5. QuestionEditDialog - question_categories Cədvəlindən İstifadə

**Fayl:** `src/components/question-bank/QuestionEditDialog.tsx`

Dəyişikliklər:
- `useQuestionCategories` hook-dan istifadə et
- Kateqoriya seçimində `question_categories` cədvəlindən gələn kateqoriyaları göstər
- Yeni kateqoriya yaratma funksiyasını `question_categories` cədvəlinə yönləndir

---

## 6. QuestionFilters - Kateqoriya Mənbəyi Dəyişikliyi

**Fayl:** `src/components/question-bank/QuestionFilters.tsx`

Dəyişikliklər:
- `question_categories` cədvəlindən kateqoriyaları götür
- Rəng dəstəyi əlavə et (hər kateqoriya öz rəngində göstərilsin)

---

## Texniki Detallar

### Hook İstifadəsi
Artıq mövcud olan `useQuestionCategories.ts` hook-u istifadə ediləcək:
- `useQuestionCategories()` - kateqoriyaları çəkmək
- `useCreateQuestionCategory()` - yeni kateqoriya yaratmaq
- `useUpdateQuestionCategory()` - kateqoriyanı yeniləmək
- `useDeleteQuestionCategory()` - kateqoriyanı silmək

### Verilənlər Bazası
`question_categories` cədvəli artıq mövcuddur:
- `id`, `name`, `description`, `color`, `parent_id`, `user_id`

### RLS Siyasətləri
Mövcud RLS siyasətləri kifayət edir:
- İstifadəçilər öz kateqoriyalarını yarada/redaktə/silə bilər
- Adminlər bütün kateqoriyaları idarə edə bilər

---

## Fayl Dəyişiklikləri Xülasəsi

| Fayl | Əməliyyat |
|------|-----------|
| `src/components/quiz/EditableQuestionCard.tsx` | Dəyişiklik |
| `src/pages/teacher/AIAssistantPage.tsx` | Dəyişiklik |
| `src/components/question-bank/CategoryManagementDialog.tsx` | Yeni fayl |
| `src/pages/teacher/QuestionBankPage.tsx` | Dəyişiklik |
| `src/components/question-bank/QuestionEditDialog.tsx` | Dəyişiklik |
| `src/components/question-bank/QuestionFilters.tsx` | Dəyişiklik |

