# AI Köməkçi Səhifəsi — Təkmilləşdirmə Planı

## Araşdırma Nəticəsində Aşkar Edilən Boşluqlar

### Kritik Problemlər

| # | Problem | Fayl | Xətt |
|---|---------|------|------|
| 1 | **AgentSelector hardcode** — `agents[0]` həmişə seçilir, UI yoxdur | `AIAssistantPage.tsx` | 89 |
| 2 | **"Hamısını İstifadə Et" qırıq** — `navigate("/teacher/create")` state ötürmür, suallar itirilir | `AIAssistantPage.tsx` | 347 |
| 3 | **Suallar bölməsi dublikat** — Generate + Documents tablarında eyni JSX iki dəfə yazılıb | `AIAssistantPage.tsx` | 670, 764 |
| 4 | **ChatInterface istifadə edilmir** — Tam işlək streaming chat komponenti var amma heç bir yerdə render edilmir | `ChatInterface.tsx` | — |
| 5 | **PDF-dən sual çıxarma yoxdur** — `DocumentQuizGenerator` yalnız YENİ sual yaradır | `DocumentQuizGenerator.tsx` | — |
| 6 | **Templates → Generate geçişi yoxdur** — Şablon seçəndə tab avtomatik dəyişmir | `AIAssistantPage.tsx` | 351 |

---

## Həyata Keçiriləcək Dəyişikliklər

### Step 1 — AgentSelector-i Wire Up Et

**`src/pages/teacher/AIAssistantPage.tsx`**

```diff
- import { agents } from "@/components/ai/AgentSelector";
+ import { agents, AgentSelector } from "@/components/ai/AgentSelector";
```

```diff
- const selectedAgent = agents[0];
+ const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);
+ const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0];
```

Generate tabında `<div className="grid gap-6">` içinə ilk uşaq kimi:
```tsx
<div>
  <Label className="mb-2 block text-sm font-medium">AI Agent</Label>
  <AgentSelector selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
</div>
```

---

### Step 2 — "Hamısını İstifadə Et" Düzəlt

**`src/pages/teacher/AIAssistantPage.tsx`** (xəttlər 346-349):
```ts
const useAllQuestions = () => {
  if (generatedQuestions.length === 0) return;
  navigate("/teacher/create", { state: { importedQuestions: generatedQuestions } });
};
```

**`src/pages/teacher/CreateQuizPage.tsx`** — import əlavə et:
```ts
import { useNavigate, useLocation } from 'react-router-dom';
import { GeneratedQuestion } from "@/components/quiz/EditableQuestionCard";
```

`CreateQuizPage()` içinə `useNavigate`-dən sonra:
```ts
const location = useLocation();

useEffect(() => {
  const state = location.state as { importedQuestions?: GeneratedQuestion[] } | null;
  if (!state?.importedQuestions?.length) return;
  const drafts: DraftQuestion[] = state.importedQuestions.map((q, i) => ({
    localId: crypto.randomUUID(),
    question_text: q.question,
    question_type: (q.questionType ?? "multiple_choice") as QuestionType,
    options: q.options ?? null,
    correct_answer: q.options[q.correctAnswer] ?? q.options[0] ?? "",
    explanation: q.explanation ?? null,
    order_index: i,
    question_image_url: q.questionImageUrl ?? null,
    title: null, weight: null, hint: null, time_limit: null,
    per_option_explanations: null, video_url: null, video_start_time: null,
    video_end_time: null, model_3d_url: null, model_3d_type: null,
    sequence_items: null, fill_blank_template: null,
    numerical_answer: null, numerical_tolerance: null,
    media_type: null, media_url: null,
  }));
  setQuestions(drafts);
  toast.success(`${drafts.length} sual əlavə edildi`);
  window.history.replaceState({}, "");
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```

---

### Step 3 — Dublikat Kod Silin + Filtr Əlavə Et

**`src/pages/teacher/AIAssistantPage.tsx`:**

Yeni state:
```ts
const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
const [filterType, setFilterType] = useState<string>("all");
```

Derived list (return-dən əvvəl):
```ts
const filteredQuestions = generatedQuestions.filter((q) => {
  const typeMatch = filterType === "all" || (q.questionType ?? "multiple_choice") === filterType;
  const bloomMatch = filterDifficulty === "all" || q.bloomLevel === filterDifficulty;
  return typeMatch && bloomMatch;
});
```

`handleGenerate` və `handleDocumentQuestionsGenerated` içinə reset:
```ts
setFilterDifficulty("all");
setFilterType("all");
```

- **Xəttlər 670-728** (Generate tabındakı suallar) → **Sil**
- **Xəttlər 764-804** (Documents tabındakı suallar) → **Sil**
- `</Tabs>`-dən sonra **bir paylaşımlı blok** əlavə et (hər iki tab üçün işləyir)
- Bu blokda **Filtr sətri** — `QUESTION_TYPES` və `getBloomLevels()` ilə, yalnız 6+ sual olduqda görünür

---

### Step 4 — PDF-dən Mövcud Sualları Çıxar

**`src/components/ai/DocumentQuizGenerator.tsx`:**

Mövcud `generate-quiz` edge function-ı xüsusi prompt ilə istifadə et — backend dəyişikliyi lazım deyil.

Yeni state:
```ts
const [mode, setMode] = useState<"generate" | "extract">("generate");
```

Mode seçim UI (parametr grid-dən əvvəl):
```tsx
<div className="flex gap-2 mb-4">
  <Button variant={mode === "generate" ? "default" : "outline"} size="sm"
    onClick={() => setMode("generate")} className="flex-1">
    <Sparkles className="mr-1 h-3 w-3" /> Yeni Sual Yarat
  </Button>
  <Button variant={mode === "extract" ? "default" : "outline"} size="sm"
    onClick={() => setMode("extract")} className="flex-1">
    <FileSearch className="mr-1 h-3 w-3" /> Mövcud Sualları Çıxar
  </Button>
</div>
```

Parametr grid-i yalnız `generate` modunda göstər.

`handleExtract` funksiyası — xüsusi `templatePrompt` ilə:
```ts
templatePrompt: `Bu sənəddəki MÖVCUD sualları tap. Yeni sual YARATMA.
Sənəddə olan sualları olduğu kimi çıxar və strukturlaşdır.`
temperature: 0.1  // dəqiq çıxarma üçün aşağı
questionCount: 50  // maksimum — sənəddə neçə sual varsa
```

Import əlavə et: `FileSearch` from `lucide-react`

---

### Step 5 — Templates Tab UX Düzəlt

**`src/pages/teacher/AIAssistantPage.tsx`:**

Tab state əlavə et:
```ts
const [activeTab, setActiveTab] = useState("generate");
```

`<Tabs>` elementinə bind et:
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} ...>
```

`handleSelectTemplate` güncəllə:
```ts
const handleSelectTemplate = (template: PromptTemplate) => {
  setSelectedTemplate(template);
  setActiveTab("generate");  // şablon seçiləndə Generate tabına keç
  toast.success(`"${template.name}" şablonu seçildi`);
};
```

---

### Step 6 — "AI Söhbət" 4-cü Tab (Opsional)

`ChatInterface` komponenti (`src/components/ai/ChatInterface.tsx`) tam hazırdır — SSE streaming, agent dəstəyi var amma heç yerdə istifadə edilmir.

Əlavə edilsə:
- `grid-cols-3` → `grid-cols-4`
- 4-cü `TabsTrigger` + `TabsContent`
- `ChatInterface agent={selectedAgent}` — Step 1-dən gələn shared agent state istifadə edir

---

## Dəyişdiriləcək Fayllar

| Fayl | Dəyişiklik |
|------|-----------|
| `src/pages/teacher/AIAssistantPage.tsx` | Step 1, 2, 3, 5, 6 |
| `src/pages/teacher/CreateQuizPage.tsx` | Step 2 |
| `src/components/ai/DocumentQuizGenerator.tsx` | Step 4 |

## Yoxlama (Verification)

1. `npm run lint` — sıfır xəta
2. `npx tsc --noEmit` — sıfır xəta
3. Agent seçimi Generate tabında işləyir
4. "Hamısını İstifadə Et" → CreateQuizPage-də suallar görünür
5. Documents tabında sual yarandıqda paylaşımlı panel görünür
6. "Mövcud Sualları Çıxar" düyməsi PDF-dəki sualları tapır
7. 6+ sual olduqda filtr sətri görünür
8. Templates-də şablon seçilcəndə Generate tabına keçilir
