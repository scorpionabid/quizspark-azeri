# Quiz App — Professional Question System Enhancement Plan

> **Tarix:** 2026-03-07
> **Texnologiya seçimləri:** `@google/model-viewer` (3D), YouTube embed (video)

---

## Mövcud Vəziyyət (As-Is)

| Sahə | Cari Hal |
|------|----------|
| Sual tipləri | 4 tip: multiple_choice, true_false, short_answer, essay |
| Sual sahələri | question_text, options, correct_answer, explanation, category, difficulty, bloom_level, tags, image |
| Media | Yalnız şəkil (question_image_url, option_images) |
| Xal sistemi | Bərabər ağırlıq (hər sual = 1 xal) |
| Tələbə rəyi | Yoxdur |
| Başlıq | Yoxdur |
| İpucu (hint) | Yoxdur |
| Video sual | Yoxdur |
| 3D model sual | Yoxdur |

---

## Hədəf (To-Be)

| Sahə | Yeni Hal |
|------|----------|
| Sual tipləri | **12 tip** — 8 yeni tip əlavə olunur |
| Sual sahələri | +title, +weight, +hint, +time_limit, +per_option_explanations, +video_url, +model_3d_url, +hotspot_data, +matching_pairs, +sequence_items, +fill_blank_template, +numerical_answer |
| Media | Şəkil + YouTube video klip + 3D .glb model |
| Xal sistemi | Ağırlıqlı xal (weight field) |
| Tələbə rəyi | Hər sual üçün 1-5 ulduz + problem tipi + şərh |
| Başlıq | Hər sualın ayrı başlığı |
| İpucu | Teacher tərəfindən yazılmış ipucu (hint) |
| Video sual | YouTube klip → cavab formu |
| 3D model sual | GLB/GLTF viewer → cavab formu |

---

## Yeni Sual Tipləri

| # | Tip Dəyəri | Azerbaycanca | Təsvir |
|---|-----------|-------------|--------|
| 1 | `fill_blank` | Boşluq doldurun | `___` işarəsi olan cümlə |
| 2 | `matching` | Uyğunlaşdırma | Sol-sağ sütunları əlaqələndir |
| 3 | `ordering` | Ardıcıllıq | Elementləri düzgün sıraya düz |
| 4 | `hotspot` | Hotspot (şəkil) | Şəkildə düzgün nöqtəyə klik et |
| 5 | `numerical` | Rəqəmsal cavab | Rəqəm daxil et (tolerans dəstəyi) |
| 6 | `code` | Kod sualı | Kod yaz / kodu düzəlt |
| 7 | `video` | Video sual | YouTube klip izlə → cavab ver |
| 8 | `model_3d` | 3D Model sual | 3D modeli kəşf et → cavab ver |

---

## Sprint Planı

---

### SPRINT 1 — Verilənlər Bazası Dəyişiklikləri

**Fayl:** `supabase/migrations/20260307120000_enhance_question_system.sql`

#### Addım 1.1 — `question_bank` cədvəlinə yeni sütunlar

```sql
-- Əsas metadata
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 1.0;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS hint TEXT;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS time_limit INTEGER; -- saniyə

-- Cavab açıqlamaları (hər variant üçün ayrı)
-- Format: {"0": "A niyə yanlışdır...", "1": "B niyə düzgündür...", ...}
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS per_option_explanations JSONB;

-- Video sual sahələri
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS video_url TEXT; -- YouTube URL
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS video_start_time INTEGER; -- saniyə
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS video_end_time INTEGER;   -- saniyə

-- 3D model sahələri
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS model_3d_url TEXT; -- .glb/.gltf URL
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS model_3d_type TEXT; -- 'glb' | 'gltf'

-- Xüsusi tip sahələri
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS hotspot_data JSONB;
-- Format: [{"x": 45.2, "y": 30.1, "label": "Ürək", "isCorrect": true}, ...]

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS matching_pairs JSONB;
-- Format: [{"left": "H2O", "right": "Su"}, {"left": "NaCl", "right": "Duz"}]

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS sequence_items JSONB;
-- Format: ["Birinci addım", "İkinci addım", "Üçüncü addım"] (düzgün sıra)

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS fill_blank_template TEXT;
-- Format: "Günəş sisteminin mərkəzində ___ yerləşir"

ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS numerical_answer NUMERIC;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS numerical_tolerance NUMERIC DEFAULT 0;

-- Keyfiyyət statistikaları
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS feedback_enabled BOOLEAN DEFAULT true;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS quality_score NUMERIC;
ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;
```

#### Addım 1.2 — `questions` cədvəlinə eyni sütunlar

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 1.0;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hint TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS time_limit INTEGER;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS per_option_explanations JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_start_time INTEGER;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS video_end_time INTEGER;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS model_3d_url TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS model_3d_type TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hotspot_data JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS matching_pairs JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS sequence_items JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS fill_blank_template TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS numerical_answer NUMERIC;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS numerical_tolerance NUMERIC DEFAULT 0;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_image_url TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_images JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS media_type TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS media_url TEXT;
```

#### Addım 1.3 — `question_ratings` cədvəlini yarat

```sql
CREATE TABLE IF NOT EXISTS question_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Hansı suala aid olduğunu göstərir (bank və ya quiz sualı)
  question_bank_id UUID REFERENCES question_bank(id) ON DELETE CASCADE,
  quiz_question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  issue_type TEXT CHECK (issue_type IN (
    'confusing',   -- Başa düşülməz
    'error',       -- Xətalıdır
    'too_easy',    -- Çox asandır
    'too_hard',    -- Çox çətindir
    'great'        -- Əla sual
  )),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Hər tələbə bir sualı yalnız bir dəfə qiymətləndirir
  UNIQUE (user_id, question_bank_id),
  UNIQUE (user_id, quiz_question_id),
  -- Ən azı biri dolu olmalıdır
  CONSTRAINT at_least_one_question CHECK (
    question_bank_id IS NOT NULL OR quiz_question_id IS NOT NULL
  )
);

-- RLS Policy-ləri
ALTER TABLE question_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tələbə öz reytinqlərini görür"
  ON question_ratings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Tələbə reytinq əlavə edir"
  ON question_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tələbə öz reytinqini yeniləyir"
  ON question_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Müəllim/admin bütün reytinqləri görür"
  ON question_ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- quality_score-u avtomatik yeniləmək üçün funksiya
CREATE OR REPLACE FUNCTION update_question_quality_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE question_bank
  SET quality_score = (
    SELECT AVG(rating::NUMERIC)
    FROM question_ratings
    WHERE question_bank_id = NEW.question_bank_id
  )
  WHERE id = NEW.question_bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_quality_score
AFTER INSERT OR UPDATE ON question_ratings
FOR EACH ROW EXECUTE FUNCTION update_question_quality_score();
```

#### Addım 1.4 — Supabase Storage `question-3d-models` bucket

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-3d-models',
  'question-3d-models',
  true,
  52428800, -- 50MB
  ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "3D model ictimai oxuma"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-3d-models');

CREATE POLICY "Auth istifadəçi 3D model yükləyir"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'question-3d-models' AND auth.role() = 'authenticated');
```

---

### SPRINT 2 — TypeScript Tipləri

**Yeni fayl:** `src/types/question.ts`

```typescript
export const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Çoxseçimli', icon: 'list' },
  { value: 'true_false',      label: 'Doğru/Yanlış', icon: 'toggle' },
  { value: 'short_answer',    label: 'Qısa cavab', icon: 'type' },
  { value: 'essay',           label: 'Esse', icon: 'file-text' },
  { value: 'fill_blank',      label: 'Boşluq doldurun', icon: 'underline' },
  { value: 'matching',        label: 'Uyğunlaşdırma', icon: 'git-merge' },
  { value: 'ordering',        label: 'Ardıcıllıq', icon: 'sort-asc' },
  { value: 'hotspot',         label: 'Hotspot (şəkil)', icon: 'crosshair' },
  { value: 'numerical',       label: 'Rəqəmsal cavab', icon: 'hash' },
  { value: 'code',            label: 'Kod sualı', icon: 'code' },
  { value: 'video',           label: 'Video sual', icon: 'video' },
  { value: 'model_3d',        label: '3D Model sual', icon: 'box' },
] as const;

export type QuestionType = typeof QUESTION_TYPES[number]['value'];

export interface PerOptionExplanation {
  [optionIndex: string]: string; // "0" → "A niyə yanlışdır"
}

export interface HotspotPoint {
  x: number;        // 0-100 (faiz)
  y: number;        // 0-100 (faiz)
  label: string;    // Nöqtənin etiketi
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;       // Unikal ID (shuffle üçün)
  left: string;     // Sol sütun
  right: string;    // Sağ sütun
}

export interface QuestionRating {
  id: string;
  question_bank_id: string | null;
  quiz_question_id: string | null;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  issue_type: 'confusing' | 'error' | 'too_easy' | 'too_hard' | 'great' | null;
  comment: string | null;
  created_at: string;
}

// Quiz-taking zamanı istifadəçi cavabı
export interface QuestionAnswer {
  questionId: string;
  questionType: QuestionType;
  // tip-ə görə cavab:
  selectedOptionIndex?: number;      // multiple_choice, true_false
  textAnswer?: string;               // short_answer, essay, fill_blank, code
  numericalAnswer?: number;          // numerical
  matchingAnswer?: { leftId: string; rightId: string }[]; // matching
  orderingAnswer?: string[];         // ordering (item-lərin ID-ləri sıra ilə)
  hotspotAnswer?: { x: number; y: number }; // hotspot
  isCorrect: boolean;
  pointsEarned: number; // weight * isCorrect
}
```

---

### SPRINT 3 — Hooks Yeniləmələri

#### Addım 3.1 — `src/hooks/useQuestionRatings.ts` (YENİ)

```typescript
// useSubmitRating — Tələbə sualı qiymətləndirir
export function useSubmitRating() {
  return useMutation({
    mutationFn: async (data: {
      questionBankId?: string;
      quizQuestionId?: string;
      rating: 1 | 2 | 3 | 4 | 5;
      issueType?: string;
      comment?: string;
    }) => {
      const { error } = await supabase
        .from('question_ratings')
        .upsert({
          question_bank_id: data.questionBankId,
          quiz_question_id: data.quizQuestionId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          rating: data.rating,
          issue_type: data.issueType,
          comment: data.comment,
        }, { onConflict: 'user_id,question_bank_id' });
      if (error) throw error;
    },
  });
}

// useQuestionRatingStats — Müəllim/admin üçün statistika
export function useQuestionRatingStats(questionBankId: string) {
  return useQuery({
    queryKey: ['question-rating-stats', questionBankId],
    queryFn: async () => {
      const { data } = await supabase
        .from('question_ratings')
        .select('rating, issue_type')
        .eq('question_bank_id', questionBankId);
      // avg, distribution hesabla
      return computeStats(data);
    },
  });
}
```

#### Addım 3.2 — `src/hooks/useQuestion3DUpload.ts` (YENİ)

```typescript
export function useQuestion3DUpload() {
  const upload3DModel = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop(); // glb, gltf
    const filename = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from('question-3d-models')
      .upload(filename, file, { contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage
      .from('question-3d-models')
      .getPublicUrl(filename);
    return data.publicUrl;
  };
  return { upload3DModel };
}
```

#### Addım 3.3 — `src/hooks/useQuestions.ts` yenilə

- `Question` interface-inə bütün yeni sahələr əlavə et
- `useCreateQuestion`, `useUpdateQuestion` mutasiyalarına yeni sahələr əlavə et
- Ağırlıqlı xal hesablaması üçün `computeWeightedScore(answers, questions)` util funksiyası

#### Addım 3.4 — `src/hooks/useQuestionBank.ts` yenilə

- `QuestionBankItem` interface-inə bütün yeni sahələr əlavə et
- Yeni filtrlər: `quality_score_min`, `has_video`, `has_3d_model`

---

### SPRINT 4 — UI Komponentləri

#### Addım 4.1 — `src/components/question-bank/QuestionEditDialog.tsx` yenilə

**Yeni sahə qrupları:**

**Qrup A: Əsas Məlumat**
```
┌─────────────────────────────────────────┐
│ Başlıq (title)           [text input]   │
│ Sual mətni               [textarea]     │
│ Sual tipi                [select - 12]  │
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Ağırlıq  │ │ Çətinlik │ │ Bloom    │ │
│ │ [1.0]    │ │ [seç]    │ │ [seç]    │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ Zaman limiti (saniyə)    [number]       │
│ İpucu (hint)             [textarea]     │
└─────────────────────────────────────────┘
```

**Qrup B: Cavablar (tip-ə görə dəyişir)**

- `multiple_choice`: mövcud variant redaktoru + hər variant altında "Niyə bu cavab?" textarea
- `true_false`: Doğru/Yanlış seçimi
- `fill_blank`: şablon mətni + `___` işarəsi istifadəsi haqqında izah
- `matching`: sol-sağ cüt əlavəçisi (Add Pair button)
- `ordering`: drag-reorder siyahısı
- `hotspot`: şəkil yüklə + klik ilə hotspot yerləşdir
- `numerical`: düzgün rəqəm + ± tolerans
- `code`: kod dili seçimi + kod redaktoru (Monaco)
- `video`: YouTube URL + başlama/bitmə saniyəsi + önizləmə
- `model_3d`: .glb/.gltf yüklə + 3D önizləmə

**Qrup C: Ümumi Açıqlama**
```
┌─────────────────────────────────────────┐
│ Ümumi izahat (explanation)  [textarea]  │
│ Etiketlər (tags)            [tag input] │
│ Kateqoriya                  [select]    │
└─────────────────────────────────────────┘
```

#### Addım 4.2 — `src/components/question-bank/QuestionRatingWidget.tsx` (YENİ)

```
┌──────────────────────────────────────────────┐
│ Bu sual necə idi?                            │
│                                              │
│  ★ ★ ★ ★ ☆  (4/5)                          │
│                                              │
│  [Başa düşülməz] [Xətalıdır] [Çox asan]    │
│  [Çox çətin] [Əla sual]                     │
│                                              │
│  Şərh (isteğe bağlı)...                     │
│                          [Göndər] [Keç]      │
└──────────────────────────────────────────────┘
```

**Xüsusiyyətlər:**
- Artıq qiymətləndirilib? → Mövcud qiyməti göstər, dəyişməyə icazə ver
- `feedback_enabled = false` ise → widget göstərilmir
- Quiz tamamlandıqdan sonra hər sual üçün scrollable list olaraq göstərilir

#### Addım 4.3 — `src/components/question-bank/QuestionVideoPlayer.tsx` (YENİ)

```typescript
// YouTube iframe API ilə start/end time dəstəyi
// video_start_time dan video_end_time-a qədər oynayır
// Clip bitdikdə: "Sualı cavablandır" button aktiv olur
// Tələbə istəsə videoya qayıda bilər

interface Props {
  videoUrl: string;       // YouTube URL
  startTime?: number;     // saniyə
  endTime?: number;       // saniyə
  onClipEnded: () => void;
}
```

**YouTube ID çıxarma:** `https://youtube.com/watch?v=XXX` → `XXX`
**Embed URL:** `https://www.youtube.com/embed/XXX?start=30&end=90&autoplay=1`

#### Addım 4.4 — `src/components/question-bank/Question3DViewer.tsx` (YENİ)

```typescript
// @google/model-viewer web komponenti
// GLB/GLTF faylını interaktiv 3D olaraq render edir
// Xüsusiyyətlər: orbit control, zoom, auto-rotate, AR (mobil)

// Quraşdırma:
// npm install @google/model-viewer
// declare module '@google/model-viewer' (TypeScript)

interface Props {
  modelUrl: string;    // .glb URL
  alt?: string;
  autoRotate?: boolean;
}

// JSX:
// <model-viewer src={modelUrl} ar camera-controls auto-rotate />
```

#### Addım 4.5 — `src/components/quiz/QuestionRenderer.tsx` (YENİ)

Bütün 12 tip üçün vahid renderer komponenti:

```typescript
interface Props {
  question: Question;
  onAnswer: (answer: QuestionAnswer) => void;
  showFeedback?: boolean;    // cavab verildikdən sonra
  disabled?: boolean;        // review rejimində
}

// Daxili komponentlər:
// MultipleChoiceQuestion   — radio buttons, rəngli feedback
// TrueFalseQuestion        — iki böyük button
// ShortAnswerQuestion      — text input
// EssayQuestion            — textarea
// FillBlankQuestion        — şablona görə dinamik input-lar
// MatchingQuestion         — drag-and-drop bağlantı
// OrderingQuestion         — drag-reorder siyahı
// HotspotQuestion          — şəkil üzərində klik
// NumericalQuestion        — number input + tolerans mesajı
// CodeQuestion             — Monaco Editor
// VideoQuestion            — QuestionVideoPlayer + cavab formu
// Model3DQuestion          — Question3DViewer + cavab formu
```

#### Addım 4.6 — `src/components/question-bank/QuestionTable.tsx` yenilə

Yeni sütunlar:
- **Başlıq** — `title` (əvvəlcə, question_text truncated)
- **Ağırlıq** — badge: `×1.0`, `×2.0` vs.
- **Keyfiyyət** — ulduz ortalaması + rəy sayı: `★ 4.2 (15)`
- **Tip ikonu** — hər tip üçün ayrı ikon (Video, 3D, Hotspot vs.)

---

### SPRINT 5 — Quiz-Taking UX Yeniləmələri

**Fayl:** `src/pages/QuizPage.tsx`

#### Addım 5.1 — Başlıq göstərilməsi

```tsx
{question.title && (
  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
    {question.title}
  </h3>
)}
<p className="text-lg">{question.question_text}</p>
```

#### Addım 5.2 — İpucu sistemi

```tsx
{question.hint && !showHint && (
  <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
    <Lightbulb className="w-4 h-4 mr-1" /> İpucu göster
  </Button>
)}
{showHint && (
  <Alert>
    <AlertDescription>{question.hint}</AlertDescription>
  </Alert>
)}
```

#### Addım 5.3 — Hər sual üçün geri sayım timer

```tsx
// time_limit varsa, geri sayım timer göstər
// 0-a çatanda avtomatik növbəti suala keç (boş cavabla)
const [timeLeft, setTimeLeft] = useState(question.time_limit ?? null);
```

#### Addım 5.4 — Ağırlıqlı xal hesablaması

```typescript
// Əvvəl: score = correctCount
// İndi: score = Σ(question.weight × isCorrect)
const weightedScore = answers.reduce((sum, answer) => {
  return sum + (answer.isCorrect ? answer.pointsEarned : 0);
}, 0);
const maxPossibleScore = questions.reduce((sum, q) => sum + (q.weight ?? 1), 0);
const percentage = (weightedScore / maxPossibleScore) * 100;
```

#### Addım 5.5 — Hər variant üçün açıqlama

```tsx
// Cavab verildikdən sonra:
{showFeedback && question.per_option_explanations && (
  <div className="mt-2 text-sm text-muted-foreground">
    {question.per_option_explanations[selectedOptionIndex]}
  </div>
)}
// + ümumi explanation da göstər
```

#### Addım 5.6 — Tələbə reytinq widget-i

```tsx
// Quiz tamamlandıqdan sonra, results ekranında:
<QuestionRatingWidget
  questions={quizQuestions}
  onRatingsSubmit={handleRatingsSubmit}
/>
// Hər sual üçün card olaraq göstərilir
// "Hamısını keç" button-u da var
```

---

### SPRINT 6 — AI Təkmilləşdirməsi

**Fayl:** `supabase/functions/enhance-question/index.ts`

Yeni AI action-lar:

#### `generate_per_option_explanations`

```
Prompt: "Bu sual üçün hər variant niyə düzgün və ya yanlışdır?
JSON formatında qaytar: {"0": "...", "1": "...", "2": "...", "3": "..."}"
```

#### `suggest_hint`

```
Prompt: "Bu sual üçün tələbəni cavaba yönlədəcək, amma cavabı birbaşa verməyəcək
bir ipucu yaz. Azərbaycan dilində, 1-2 cümlə."
```

#### `generate_fill_blank`

```
Prompt: "Bu sualı boşluq doldurma formatına çevir.
Açar sözləri ___ ilə əvəz et. fill_blank_template formatında qaytar."
```

#### `generate_matching`

```
Prompt: "Bu mövzu üçün 4-5 cütlükdən ibarət uyğunlaşdırma sualı yarat.
JSON: [{"left": "...", "right": "..."}, ...]"
```

#### `quality_score_v2`

6 meyar üzrə 1-10 xal:
1. **Aydınlıq** — Sual aydın yazılıbmı?
2. **Çətinlik Kalibrasiyası** — Bloom səviyyəsinə uyğundurmu?
3. **Distraktor Keyfiyyəti** — Yanlış variantlar inandırıcıdırmı?
4. **İpucu Keyfiyyəti** — İpucu kifayət qədər yönləndirici, amma birbaşa cavab vermir?
5. **Açıqlama Tamlığı** — Hər variant üçün izahat tam və faydalıdırmı?
6. **Dil Keyfiyyəti** — Qrammatik səhv, qeyri-dəqiq ifadə varmı?

---

### SPRINT 7 — Paket Quraşdırması

```bash
# 3D model viewer
npm install @google/model-viewer

# TypeScript tip deklarasiyası (ayrıca lazım ola bilər)
npm install --save-dev @types/google__model-viewer

# Kod redaktoru (code sual tipi üçün)
npm install @monaco-editor/react
```

`src/types/globals.d.ts` faylı (yeni):
```typescript
// @google/model-viewer üçün JSX dəstəyi
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        ar?: boolean;
        style?: React.CSSProperties;
      },
      HTMLElement
    >;
  }
}
```

---

## Yoxlama (Verification)

### Funksional Testlər

| Test | Gözlənilən Nəticə |
|------|-------------------|
| `fill_blank` sualı yarat | `___` olan şablon saxlanır, quiz-də input render olur |
| `matching` sualı yarat | Sol-sağ cütlər saxlanır, quiz-də drag-connect işləyir |
| `video` sualı: YouTube URL daxil et | Video player görünür, clip bitdikdə cavab açılır |
| `model_3d` sualı: .glb fayl yüklə | 3D viewer render olur, orbit/zoom işləyir |
| Tələbə sualı 4 ulduz qiymətləndirir | `question_ratings` cədvəlinə yazılır, `quality_score` yenilənir |
| Ağırlıqlı quiz: weight=2.0 sual düzgün cavablanır | Xal = 2.0, yox 1.0 |
| Time limit=30s sual, cavab verilmir | 30s sonra avtomatik növbəti sual |
| Per-option explanation: yanlış variant seçilir | Həmin variant üçün açıqlama göstərilir |
| Müəllim sual bankını görür | Keyfiyyət sütununda ulduz ortalaması və rəy sayı |

### Texniki Yoxlamalar

```bash
npm run lint          # 0 xəta
npx tsc --noEmit      # 0 xəta
npm run build         # Uğurlu build
```

---

## Kritik Fayllar Siyahısı

| # | Fayl | Növ | Əsas Dəyişiklik |
|---|------|-----|-----------------|
| 1 | `supabase/migrations/20260307120000_enhance_question_system.sql` | YENİ | Bütün DB dəyişiklikləri |
| 2 | `src/types/question.ts` | YENİ | Vahid tip tərifləri |
| 3 | `src/types/globals.d.ts` | YENİ | model-viewer JSX deklarasiyası |
| 4 | `src/hooks/useQuestions.ts` | YENİLƏ | Yeni sahələr + ağırlıqlı xal |
| 5 | `src/hooks/useQuestionBank.ts` | YENİLƏ | Yeni sahələr + filtrlər |
| 6 | `src/hooks/useQuestionRatings.ts` | YENİ | Tələbə reytinq hook-ları |
| 7 | `src/hooks/useQuestion3DUpload.ts` | YENİ | 3D model yükləmə |
| 8 | `src/components/question-bank/QuestionEditDialog.tsx` | YENİLƏ | Bütün yeni sahə redaktorları |
| 9 | `src/components/question-bank/QuestionViewDialog.tsx` | YENİLƏ | Yeni sahə göstəricisi |
| 10 | `src/components/question-bank/QuestionTable.tsx` | YENİLƏ | Başlıq, ağırlıq, reytinq sütunları |
| 11 | `src/components/question-bank/QuestionRatingWidget.tsx` | YENİ | Tələbə reytinq UI |
| 12 | `src/components/question-bank/Question3DViewer.tsx` | YENİ | GLB/GLTF viewer |
| 13 | `src/components/question-bank/QuestionVideoPlayer.tsx` | YENİ | YouTube klip player |
| 14 | `src/components/quiz/QuestionRenderer.tsx` | YENİ | 12 tip üçün vahid renderer |
| 15 | `src/pages/QuizPage.tsx` | YENİLƏ | Yeni renderer, timer, rating, hint |
| 16 | `supabase/functions/enhance-question/index.ts` | YENİLƏ | 5 yeni AI action |

---

## Sprint Ardıcıllığı (Tövsiyə)

```
Sprint 1: DB Migration          → 1-2 saat
Sprint 2: TypeScript tipləri    → 1 saat
Sprint 3: Hook yeniləmələri     → 2-3 saat
Sprint 4: UI komponentləri      → 6-8 saat
Sprint 5: QuizPage yeniləmələri → 3-4 saat
Sprint 6: AI funksiyası         → 1-2 saat
Sprint 7: Paket + tiplər        → 30 dəq
```

**Toplam:** ~16-21 saat (professional level implementation)
