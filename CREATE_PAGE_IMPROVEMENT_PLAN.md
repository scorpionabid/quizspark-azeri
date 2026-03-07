# teacher/create Səhifəsi Təkmilləşdirmə Planı

> **Tarix:** 2026-03-07
> **Hədəf fayl:** `src/pages/teacher/CreateQuizPage.tsx`
> **Yanaşma:** Modal-First | Drag-to-Reorder | Auto-Save

---

## Mövcud Vəziyyət (As-Is)

| Problem | Detal |
|---------|-------|
| Yalnız 3 tip | `mcq`, `true-false`, `short-answer` — sistemdə 12 tip var |
| Tip adları yanlışdır | `mcq` DB-də `multiple_choice` olmalıdır |
| `İdxal Et` düyməsi boşdur | Handler yoxdur, heç nə etmir |
| Hər sual üçün `weight`, `hint`, `time_limit` yoxdur | DB dəstəkləyir amma UI görünmür |
| Zod doğrulaması yoxdur | Zəif inline `if (!title.trim())` yoxlaması |
| Sualları sıralamaq olmur | Yalnız sil + yenidən əlavə et |
| Auto-save yoxdur | Səhifəni bağlasan hər şey itir |
| Sual sayı görünmür | Başlıqda göstərilmir |
| `short-answer` UI zədəlidir | Options boş array-dir, heç bir input render olunmur |

---

## Hədəf Vəziyyət (To-Be)

| Xüsusiyyət | Necə işləyəcək |
|-----------|----------------|
| 12 tip dəstəyi | Bütün tipler `QuestionEditDialog` vasitəsilə |
| Sual kartları | Preview-only: tip badge, sual mətni (kəsilmiş), cavab xülasəsi, 💡 hint |
| İdxal Et | `QuestionPickerDialog` — sual bankından seç, əlavə et |
| Metadata formu | `react-hook-form` + `zodResolver` + field-level xəta mesajları |
| Sıralama | @dnd-kit ilə sürükle-bırak |
| Auto-save | 1.5s debounce → `localStorage.quiz_draft`; bərpa toast-u |
| Sayac | Header-də `5 sual` göstərilir |

---

## Arxitektura Qərarı: Modal-First

**Bütün sual redaktəsi `QuestionEditDialog` vasitəsilə gedir.** Kartlar yalnız preview olaraq göstərilir.

**Niyə:**
- `QuestionEditDialog` artıq bütün 12 tipi mükəmməl şəkildə həll edir; paralel inline redaktör saxlamaq məntiqsizdir
- Matching/Hotspot/Video tipləri heç vaxt inline işləyə bilməz
- `QuestionBankPage` eyni pattern-dən istifadə edir (edit → dialog)
- Gələcəkdə yeni tip əlavə etmək üçün `CreateQuizPage`-ə toxunmaq lazım olmayacaq

---

## Yenidən İstifadə Edilən Komponentlər

| Fayl | Necə İstifadə Olunur |
|------|---------------------|
| `src/components/question-bank/QuestionEditDialog.tsx` | Dəyişdirilmədən. Adapter funksiyalar ilə bridge qurulur |
| `src/hooks/useQuestionBank.ts` → `useQuestionBankList` | `QuestionPickerDialog` içində |
| `src/hooks/useQuestions.ts` → `useBulkCreateQuestions` | Dəyişdirilmədən |
| `src/hooks/useQuizzes.ts` → `useCreateQuiz` | Dəyişdirilmədən |
| `src/types/question.ts` → `QuestionType`, `QUESTION_TYPES` | Tip adları və badge labelləri |
| `src/lib/validations/auth.ts` | Zod schema yaratmaq üçün pattern |

---

## Step-by-Step İcra Planı

---

### STEP 1 — Paket Quraşdırması

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Yoxlama:** `node_modules/@dnd-kit/sortable` mövcuddur.

---

### STEP 2 — Zod Schema Yarat

**Yeni fayl:** `src/lib/validations/quiz.ts`
`src/lib/validations/auth.ts` pattern-ini izlə.

```typescript
import { z } from 'zod';

export const quizMetadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Quiz başlığı tələb olunur')
    .max(200, 'Başlıq 200 simvoldan az olmalıdır'),
  description: z
    .string()
    .trim()
    .max(1000, 'Təsvir 1000 simvoldan az olmalıdır')
    .optional()
    .or(z.literal('')),
  subject: z.string().min(1, 'Fənn seçilməlidir'),
  grade: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().nullable(),
  duration: z
    .number({ invalid_type_error: 'Müddət rəqəm olmalıdır' })
    .int()
    .min(1, 'Minimum 1 dəqiqə')
    .max(300, 'Maksimum 300 dəqiqə'),
  is_public: z.boolean(),
});

export type QuizMetadataFormData = z.infer<typeof quizMetadataSchema>;
```

---

### STEP 3 — QuestionPickerDialog Yarat

**Yeni fayl:** `src/components/quiz/QuestionPickerDialog.tsx`
~120 sətir. `CreateQuizFromBank` **istifadə edilmir** — o özü tam quiz yaratma axınıdır.

**Props:**
```typescript
interface QuestionPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (items: QuestionBankItem[]) => void;
}
```

**Struktur:**
```
Dialog
├── Header: "Sual Bankından Seç"
├── Filters row: [Axtarış Input] [Tip Select] [Çətinlik Select]
├── ScrollArea (max-height: 60vh)
│   └── Checkbox siyahısı: tip badge | sual mətni (80 char) | çətinlik
└── Footer: [Ləğv Et] [Əlavə Et ({n})]
```

**State:** `selectedIds: Set<string>`, `search`, `typeFilter`, `difficultyFilter`

**Data:** `useQuestionBankList` hook-u ilə

**`onConfirm`:**
```typescript
const selectedItems = data?.questions.filter(q => selectedIds.has(q.id)) ?? [];
onConfirm(selectedItems);
onOpenChange(false);
setSelectedIds(new Set());
```

---

### STEP 4 — CreateQuizPage Yenidən Yazılması

**Fayl:** `src/pages/teacher/CreateQuizPage.tsx`

---

#### 4.1 — DraftQuestion Tipi

Köhnə `Question` interface-i silinir, yerinə:

```typescript
interface DraftQuestion {
  localId: string;                              // client-only (crypto.randomUUID())
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  order_index: number;
  title?: string | null;
  weight?: number | null;
  hint?: string | null;
  time_limit?: number | null;
  per_option_explanations?: Record<string, string> | null;
  video_url?: string | null;
  video_start_time?: number | null;
  video_end_time?: number | null;
  model_3d_url?: string | null;
  model_3d_type?: string | null;
  hotspot_data?: unknown;
  matching_pairs?: unknown;
  sequence_items?: string[] | null;
  fill_blank_template?: string | null;
  numerical_answer?: number | null;
  numerical_tolerance?: number | null;
  question_image_url?: string | null;
  media_type?: string | null;
  media_url?: string | null;
}
```

---

#### 4.2 — Adapter Funksiyalar (komponent xaricində)

**A. `draftToDialogQuestion(d): QuestionBankItem`**
`DraftQuestion` → `QuestionBankItem` (dialog üçün). `bloom_level`, `tags`, `category`, `quality_score` kimi sual bankına aid sahələr `null` olaraq ötürülür.

**B. `dialogSaveToDraft(saved, existing): DraftQuestion`**
Dialog `onSave` callback-in qaytardığı `Partial<QuestionBankItem>` → `DraftQuestion` yeniləməsi.

**C. `bankItemToDraft(item, orderIndex): DraftQuestion`**
`QuestionBankItem` → `DraftQuestion` (İdxal Et üçün). `localId = crypto.randomUUID()`.

**D. `draftToDbInsert(q, quizId, index)`**
`DraftQuestion` → DB insert payloadu. `localId` silinir, `quiz_id` və `order_index` əlavə olunur.

---

#### 4.3 — State Management

```typescript
// Metadata formu (köhnə 5x useState → 1x useForm)
const form = useForm<QuizMetadataFormData>({
  resolver: zodResolver(quizMetadataSchema),
  defaultValues: { title: '', description: '', subject: '', grade: '',
                   difficulty: null, duration: 20, is_public: true },
});

// Suallar
const [questions, setQuestions] = useState<DraftQuestion[]>([]);

// Dialog vəziyyəti
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [editingQuestion, setEditingQuestion] = useState<DraftQuestion | null>(null);
const [isCreatingNew, setIsCreatingNew] = useState(false);
const [newQuestionType, setNewQuestionType] = useState<QuestionType>('multiple_choice');
const [pickerOpen, setPickerOpen] = useState(false);

// Submit
const [isSubmitting, setIsSubmitting] = useState(false);

// @dnd-kit
const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {...}));
```

---

#### 4.4 — Handler Funksiyaları

**`addQuestion(type)`:** `editingQuestion = null`, `isCreatingNew = true`, `newQuestionType = type`, dialog açılır.

**`handleQuestionSave(saved)`:**
- `isCreatingNew`: `crypto.randomUUID()` ilə yeni DraftQuestion yaradılıb list-ə əlavə edilir
- Edit rejimi: `localId` ilə tapılıb `dialogSaveToDraft` ilə yenilənir
- Dialog bağlanır

**`handleEditQuestion(q)`:** `editingQuestion = q`, `isCreatingNew = false`, dialog açılır.

**`handleRemoveQuestion(localId)`:** Ən azı 1 sual şərti ilə filter edilir.

**`handleImportFromBank(items)`:** `bankItemToDraft` ilə çevrilir, list-ə əlavə edilir.

**`handleDragEnd(event)`:** `arrayMove` ilə sual sırası yenilənir.

**`handleSave(publish)`:**
1. `form.trigger()` — metadata doğrulama
2. `questions.length > 0` — ən azı 1 sual
3. Boş `question_text` yoxlanır
4. `createQuiz.mutateAsync` → quiz yaradılır
5. `questions.map(draftToDbInsert)` → `createQuestions.mutateAsync`
6. `localStorage.removeItem('quiz_draft')` → yönləndirmə

---

#### 4.5 — Auto-Save

```typescript
// Hər dəyişiklikdə 1.5s debounce ilə localStorage-ə yaz
const formValues = form.watch();
useEffect(() => {
  const timeout = setTimeout(() => {
    localStorage.setItem('quiz_draft', JSON.stringify({
      metadata: formValues, questions, savedAt: Date.now(),
    }));
  }, 1500);
  return () => clearTimeout(timeout);
}, [questions, formValues]);

// Mount-da draft bərpa toast-u
useEffect(() => {
  const raw = localStorage.getItem('quiz_draft');
  if (!raw) return;
  const draft = JSON.parse(raw);
  const mins = Math.round((Date.now() - draft.savedAt) / 60000);
  toast.info(`${mins} dəq əvvəlki qaralama tapıldı`, {
    action: { label: 'Bərpa et', onClick: () => {
      form.reset(draft.metadata);
      setQuestions(draft.questions ?? []);
      localStorage.removeItem('quiz_draft');
    }},
  });
}, []);
```

---

#### 4.6 — JSX Strukturu (Yüksək Səviyyə)

```
<div className="min-h-screen bg-gradient-hero ...">
  <div className="mx-auto max-w-4xl">

    {/* Header: Geri | "N sual" | [Qaralama] [Dərc Et] */}

    {/* Quiz Metadata — <Form> ilə, FormField + FormMessage */}

    {/* Quick Actions: Çoxseçimli | Doğru/Yanlış | Qısa Cavab |
                       [Daha çox...] dropdown | İdxal Et | AI ilə Yarat */}

    {/* Suallar — DndContext > SortableContext > [SortableQuestionCard] */}

    {/* Sual Əlavə Et düyməsi */}

    {/* QuestionEditDialog (open/onOpenChange/question/onSave) */}
    {/* QuestionPickerDialog (open/onOpenChange/onConfirm) */}
  </div>
</div>
```

---

#### 4.7 — SortableQuestionCard Komponenti

Eyni faylda (export default-dan əvvəl) local komponent:

```typescript
function SortableQuestionCard({ question, index, onEdit, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging }
    = useSortable({ id: question.localId });

  // Kart görünüşü:
  // ⠿ (drag handle) | #N | [tip badge] [weight badge]
  // Sual mətni (line-clamp-2)
  // Cavab: <getAnswerSummary(question)>
  // 💡 hint (varsa)
  //                              [✎ Düzəliş] [🗑 Sil]
}

function getAnswerSummary(q: DraftQuestion): string {
  // tip-ə görə: true_false → "Doğru/Yanlış", numerical → "42 ± 2",
  // matching → "4 cüt", ordering → "5 element", default → correct_answer ilk 60 char
}
```

---

### STEP 5 — QuestionEditDialog Props Yoxlaması

`QuestionEditDialog`-un mövcud `open`, `onOpenChange`, `question`, `onSave`, `mode` prop-larını oxu. Əgər `initialType` prop-u yoxdursa — dialog öz daxili tip seçicisindən istifadə edər (qəbul edilə bilər). Əgər varsa — `newQuestionType` ötürülür.

---

### STEP 6 — Lint + Type Check

```bash
npm run lint
npx tsc --noEmit
```

**Gözlənilən:** 0 xəta.

**Gözlənilən xəta tuzaqları:**
- `QuestionBankItem` adapter-lərdə bütün məcburi sahələrin doldurulması
- `@dnd-kit` TypeScript import tipləri
- `form.watch()` → `useEffect` dependency array

---

## Toxunulmayan Fayllar

| Fayl | Səbəb |
|------|-------|
| `QuestionEditDialog.tsx` | Adapter ilə istifadə edilir, dəyişdirilmir |
| `useQuestions.ts` | Artıq tam dəstək var |
| `useQuestionBank.ts` | `QuestionPickerDialog` içindən istifadə olunur |
| `src/types/question.ts` | `QuestionType` və `QUESTION_TYPES` dəyişdirilmədən istifadə olunur |
| `supabase/types.ts` | Mismatch məlumdur; `useQuestions.ts`-in öz interface-i priority-dir |

---

## Yeni/Dəyişdirilən Fayllar Siyahısı

| # | Fayl | Növ |
|---|------|-----|
| 1 | `src/lib/validations/quiz.ts` | YENİ |
| 2 | `src/components/quiz/QuestionPickerDialog.tsx` | YENİ |
| 3 | `src/pages/teacher/CreateQuizPage.tsx` | YENİDƏN YAZILIR |
| 4 | `package.json` / `package-lock.json` | @dnd-kit paketləri |

---

## Yoxlama Siyahısı

- [ ] Bütün 12 sual tipi üçün sual əlavə etmək olar
- [ ] Suallar sürükle-bırak ilə yenidən sıralanır
- [ ] `İdxal Et` sual bankından seçim gətirir
- [ ] Boş başlıq/fənn field-level xəta mesajı göstərir
- [ ] `weight`, `hint`, `time_limit` DB-yə yazılır
- [ ] Auto-save: 1.5s sonra localStorage-ə yazılır
- [ ] Draft recovery toast mount-da göstərilir
- [ ] Header-də sual sayı görünür (`N sual`)
- [ ] Quiz saxlanıldıqdan sonra `/teacher/my-quizzes`-ə yönləndirilir
- [ ] `npm run lint` → 0 xəta
- [ ] `npx tsc --noEmit` → 0 xəta
