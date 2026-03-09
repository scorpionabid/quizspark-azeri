# Sual Bankı — "Yeni Sual" Funksionallığının Təkmilləşdirmə Planı

> Tarix: 2026-03-09
> Məqsəd: Teacher question bank-da sual yaratmaq/redaktə etmək iş axınının UX və funksional problemlərini həll etmək

---

## Müəyyən Edilmiş Problemlər

| # | Problem | Prioritet | Fayl |
|---|---------|-----------|------|
| 1 | MCQ düzgün cavab seçimi text input ilə aparılır (hərfi yazırsan) | Yüksək | MultipleChoiceEditor.tsx, QuestionAnswerEditor.tsx |
| 2 | True/False tipinə keçəndə Doğru/Yanlış avtomatik doldurulmur | Yüksək | QuestionEditDialog.tsx, QuestionAnswerEditor.tsx |
| 3 | Paste rejimində dublikat `<Label>` xətası | Aşağı | QuestionEditDialog.tsx |
| 4 | Sual kopyalama (duplicate) bütün sahələri kopyalamır | Orta | QuestionBankPage.tsx |
| 5 | Filter paneli 12 tipdən yalnız 4-nü göstərir | Orta | QuestionFilters.tsx |

---

## Problem 1: MCQ Düzgün Cavab — Radio Seçim UX

### Cari davranış
MCQ sualı yaradarkən variantlar (A, B, C, D) ayrı mətn sahələrindədir. Düzgün cavabı seçmək üçün isə aşağıda ayrı bir text input var və "A", "B", "C" kimi hərfi özün yazmalısan. Heç bir vizual əlaqə yoxdur.

### Həll
`MultipleChoiceEditor` komponentinə `correctAnswer` və `onCorrectAnswerChange` propları əlavə et. Hər variant sətirinin soluna `RadioGroupItem` əlavə et. Radioya klikləmək avtomatik olaraq həmin hərfi (`A`, `B`, `C`...) `correct_answer` kimi seçir. Ayrı text input aradan qalxır.

**Dəyişdiriləcək fayllar:**
- `src/components/teacher/question-edit/MultipleChoiceEditor.tsx`
- `src/components/teacher/question-edit/QuestionAnswerEditor.tsx`

#### MultipleChoiceEditor.tsx — Yeni interface

```typescript
interface MultipleChoiceEditorProps {
    options: string[];
    onChange: (options: string[]) => void;
    correctAnswer: string;                         // YENİ
    onCorrectAnswerChange: (answer: string) => void; // YENİ
    readOnly?: boolean;                             // YENİ (TF üçün)
}
```

#### MultipleChoiceEditor.tsx — RadioGroup ilə hər variant

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// options.map() blokunu əvəz et:
<RadioGroup value={correctAnswer} onValueChange={onCorrectAnswerChange} className="space-y-2">
  {options.map((option, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D...
    return (
      <div key={index} className="flex items-center gap-2">
        <RadioGroupItem value={letter} id={`option-radio-${index}`} className="shrink-0" />
        <Label
          htmlFor={`option-radio-${index}`}
          className="w-5 shrink-0 font-semibold text-muted-foreground cursor-pointer"
        >
          {letter}
        </Label>
        <Input
          value={option}
          onChange={(e) => updateOption(index, e.target.value)}
          placeholder={`Variant ${letter}`}
          readOnly={readOnly}
          className={readOnly ? 'bg-muted/50' : ''}
        />
        {!readOnly && (
          <Button type="button" variant="ghost" size="icon"
            onClick={() => removeOption(index)} disabled={options.length <= 2}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  })}
</RadioGroup>
{!readOnly && (
  <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
    <Plus className="h-4 w-4 mr-1" />Variant əlavə et
  </Button>
)}
```

#### QuestionAnswerEditor.tsx — showOptions blokunu böl

```tsx
// MCQ üçün (radio-lu editor):
{(question_type === 'multiple_choice' || question_type === 'video') && (
  <MultipleChoiceEditor
    options={formData.options}
    onChange={(options) => setFormData({ ...formData, options })}
    correctAnswer={formData.correct_answer}
    onCorrectAnswerChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
  />
)}
```

#### QuestionAnswerEditor.tsx — "Düzgün Cavab" text inputunu gizlət

```tsx
// MCQ, TF, video tipləri üçün text input göstərmə:
{!isMatching && !isOrdering && !isNumerical
  && question_type !== 'multiple_choice'
  && question_type !== 'true_false'
  && question_type !== 'video' && (
  <div className="space-y-2">
    <Label htmlFor="correct_answer">Düzgün Cavab *</Label>
    <Input
      id="correct_answer"
      value={formData.correct_answer}
      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
      placeholder="Düzgün cavabı daxil edin"
    />
  </div>
)}
```

---

## Problem 2: True/False — Avtomatik Seçimlər və Toggle UX

### Cari davranış
`true_false` tipinə keçəndə 4 boş variant sahəsi açılır. İstifadəçi "Doğru" və "Yanlış" sözlərini özü yazmalıdır. Düzgün cavab yenə text input ilə seçilir.

### Həll
**Tip dəyişimi:** `true_false` seçiləndə options avtomatik `['Doğru', 'Yanlış']` olsun.
**UI:** MCQ editorun əvəzinə sadə 2-radio toggle göstər (Doğru / Yanlış).

**Dəyişdiriləcək fayllar:**
- `src/components/question-bank/QuestionEditDialog.tsx`
- `src/components/teacher/question-edit/QuestionAnswerEditor.tsx`

#### QuestionEditDialog.tsx — Tip dəyişimi handler-i

```typescript
// QuestionTypeSelector-ın onChange-ini inline setFormData-dan bu handler-ə yönləndir:
const handleQuestionTypeChange = (val: QuestionType) => {
  if (val === 'true_false') {
    // TF-ə keçəndə: seçimlər avtomatik doldurulur
    setFormData({ ...formData, question_type: val, options: ['Doğru', 'Yanlış'], correct_answer: '' });
  } else if (formData.question_type === 'true_false') {
    // TF-dən çıxanda: 4 boş seçim sıfırlanır
    setFormData({ ...formData, question_type: val, options: ['', '', '', ''], correct_answer: '' });
  } else {
    setFormData({ ...formData, question_type: val });
  }
};
```

#### QuestionEditDialog.tsx — Edit rejimindəki useEffect düzəlişi

```typescript
// options satırını bu şəkildə dəyişdir:
options: question.question_type === 'true_false'
  ? ['Doğru', 'Yanlış']
  : parseOptions(question.options),
```

#### QuestionAnswerEditor.tsx — TF üçün 2-radio toggle

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// MCQ blokun altına əlavə et:
{question_type === 'true_false' && (
  <div className="space-y-2">
    <Label>Düzgün Cavab *</Label>
    <RadioGroup
      value={formData.correct_answer}
      onValueChange={(answer) => setFormData({ ...formData, correct_answer: answer })}
      className="flex gap-4"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="A" id="tf-true" />
        <Label htmlFor="tf-true" className="cursor-pointer font-medium text-green-600">
          Doğru
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="B" id="tf-false" />
        <Label htmlFor="tf-false" className="cursor-pointer font-medium text-red-600">
          Yanlış
        </Label>
      </div>
    </RadioGroup>
    <p className="text-xs text-muted-foreground">A = Doğru · B = Yanlış</p>
  </div>
)}
```

---

## Problem 3: Paste Rejimindəki Dublikat Label

### Cari davranış
`QuestionEditDialog.tsx`-da paste rejiminin başlıq hissəsində (flex row) `<Label htmlFor="paste_area">Test Mətnini Yapışdırın</Label>` var. Eyni label textarea-nın üstündə də var. Bu accessibility problemidir.

### Həll
Flex row-dakı yanlış label-i silib `<span>` ilə əvəz et.

```tsx
// ƏVVƏL (yanlış — başlıq hissəsindəki label):
<Label htmlFor="paste_area">Test Mətnini Yapışdırın</Label>

// SONRA:
<span className="text-sm font-medium text-muted-foreground">Fayl İmport</span>
```

---

## Problem 4: Sual Kopyalama — Natamam Sahələr

### Cari davranış
`QuestionBankPage.tsx`-dakı `handleDuplicateClick` funksiyası bu sahələri kopyalamır:
`weight`, `hint`, `time_limit`, `video_url`, `video_start_time`, `video_end_time`, `model_3d_url`, `model_3d_type`, `fill_blank_template`, `numerical_answer`, `numerical_tolerance`, `matching_pairs`, `sequence_items`, `title`, `hotspot_data`, `per_option_explanations`

### Həll
`handleDuplicateClick`-i bütün `QuestionBankItem` sahələrini əhatə etmək üçün genişləndir. `quality_score` və `usage_count`-u sıfırla.

```typescript
const handleDuplicateClick = (question: QuestionBankItem) => {
  createQuestion.mutate({
    question_text: `${question.question_text} (kopya)`,
    title: question.title ? `${question.title} (kopya)` : null,
    question_type: question.question_type,
    options: question.options,
    correct_answer: question.correct_answer,
    explanation: question.explanation,
    category: question.category,
    difficulty: question.difficulty,
    bloom_level: question.bloom_level,
    tags: question.tags,
    user_id: null,
    source_document_id: null,
    question_image_url: question.question_image_url ?? null,
    option_images: question.option_images ?? null,
    media_type: question.media_type ?? null,
    media_url: question.media_url ?? null,
    // Əvvəl çatışmayan sahələr:
    weight: question.weight ?? null,
    hint: question.hint ?? null,
    time_limit: question.time_limit ?? null,
    video_url: question.video_url ?? null,
    video_start_time: question.video_start_time ?? null,
    video_end_time: question.video_end_time ?? null,
    model_3d_url: question.model_3d_url ?? null,
    model_3d_type: question.model_3d_type ?? null,
    fill_blank_template: question.fill_blank_template ?? null,
    numerical_answer: question.numerical_answer ?? null,
    numerical_tolerance: question.numerical_tolerance ?? null,
    matching_pairs: question.matching_pairs ?? null,
    sequence_items: question.sequence_items ?? null,
    hotspot_data: question.hotspot_data ?? null,
    per_option_explanations: question.per_option_explanations ?? null,
    feedback_enabled: question.feedback_enabled ?? null,
    // Sıfırlan:
    quality_score: null,
    usage_count: null,
  });
};
```

---

## Problem 5: Filter — Bütün Sual Tiplərini Göstər

### Cari davranış
`QuestionFilters.tsx`-dakı `questionTypes` massivi 4 tipi hardcoded şəkildə ehtiva edir. 8 tip filtrdə görünmür.

### Həll
Hardcoded massivi sil, `QUESTION_TYPES`-ı `src/types/question.ts`-dən idxal et.

```typescript
// Əvvəlki hardcoded massivi sil
// Bu idxalı əlavə et:
import { QUESTION_TYPES } from '@/types/question';
```

```tsx
// Select içindəki questionTypes.map()-i əvəz et:
{QUESTION_TYPES.map((type) => (
  <SelectItem key={type.value} value={type.value}>
    {type.label}
  </SelectItem>
))}
```

---

## İcra Sırası

```
1. Problem 3 (Label bug)      → 2 dəqiqə, sıfır risk
2. Problem 5 (Filter tipləri) → 5 dəqiqə, sıfır risk
3. Problem 4 (Kopyalama)      → 10 dəqiqə, bir fayl
4. Problem 1 (MCQ radio)      → 30 dəqiqə, iki fayl
5. Problem 2 (TF toggle)      → 20 dəqiqə, iki fayl (1-dən asılıdır)
```

---

## Yoxlama

```bash
npm run lint
npx tsc --noEmit
```

Her iki əmr **sıfır xəta** ilə bitməlidir.

**Manual yoxlama:**
- [ ] MCQ: Variantın yanındakı radioya klik etmək düzgün cavabı seçir; ayrı text input yoxdur
- [ ] TF: Tip dəyişiləndə "Doğru/Yanlış" avtomatik doldurulur; iki radio toggle görünür
- [ ] Paste rejimində "Test Mətnini Yapışdırın" yalnız bir dəfə görünür
- [ ] Kopyalanmış sualda bütün sahələr (video_url, weight, numerical_answer vs.) saxlanılır
- [ ] Filter dropdown-ında bütün 12 sual tipi görünür
