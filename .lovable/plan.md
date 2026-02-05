
# AI Köməkçi Səhifəsinin Professional Təkmilləşdirilməsi

## Mövcud Vəziyyət

AI Köməkçi səhifəsi hazırda aşağıdakı funksiyaları təmin edir:
- Mövzu üzrə sual yaratma
- Sənəddən (PDF/DOCX/TXT) sual yaratma
- Şablon kitabxanası
- Yaradılmış sualları redaktə etmək
- Sualları sual bankına əlavə etmək

## Təklif Olunan Təkmilləşdirmələr

### 1. Media Dəstəyi - Şəkil, Audio, Video

**a) Sual Mətnində Media**
- Sual mətninə şəkil əlavə etmək imkanı
- Cavab variantlarında şəkil istifadəsi
- AI ilə sual üçün izahedici şəkil yaratma (google/gemini-2.5-flash-image modeli)
- Audio/video linklərini sualda göstərmək

**b) Yeni Komponent: MediaQuestionEditor**
```text
┌─────────────────────────────────────────────┐
│  Sual mətni                                 │
│  ┌───────────────────────────────────────┐  │
│  │ Rich text editor + şəkil yükləmə      │  │
│  │ [B] [I] [U] [📷] [🎵] [📹]           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Variantlar (şəkillə)                       │
│  [A] [mətn/şəkil] [B] [mətn/şəkil]         │
│  [C] [mətn/şəkil] [D] [mətn/şəkil]         │
└─────────────────────────────────────────────┘
```

**c) Database Dəyişikliyi**
`question_bank` cədvəlinə yeni sütunlar:
- `question_image_url` - sual şəkili
- `option_images` - variant şəkilləri (JSONB)
- `media_type` - media növü (image/audio/video)
- `media_url` - media linki

---

### 2. AI Şəkil Yaratma İnteqrasiyası

**a) Nano Banana Model İnteqrasiyası**
- `google/gemini-2.5-flash-image` modeli artıq mövcuddur
- Sual üçün izahedici şəkil yaratmaq
- Diaqram və qrafiklər yaratmaq

**b) Yeni Edge Function: generate-question-image**
```text
Input: { prompt: "Riyaziyyat: üçbucağın sahəsi formulu" }
Output: { imageUrl: "data:image/png;base64,..." }
```

**c) İş Axını**
```text
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Sual yaradılır   │ --> │ "Şəkil yarat"    │ --> │ AI şəkil         │
│                  │     │ düyməsi          │     │ yaradır          │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

### 3. Temperatur və Model Seçimi - AI Köməkçidə

**a) Ətraflı Parametrlər Paneli**
```text
┌─────────────────────────────────────────────┐
│  ⚙️ AI Parametrləri                    [▼]  │
│  ─────────────────────────────────────      │
│  Model: [google/gemini-2.5-flash ▼]         │
│                                             │
│  Temperatur: ═══════●═══ 0.7                │
│  (Aşağı = dəqiq, Yuxarı = yaradıcı)        │
│                                             │
│  Max Token: [4096 ▼]                        │
└─────────────────────────────────────────────┘
```

**b) Mövcud Modellər**
- google/gemini-2.5-flash (default)
- google/gemini-2.5-pro
- google/gemini-3-flash-preview
- openai/gpt-5-mini

**c) Temperatur**
- 0.1-0.4: Dəqiq, faktiki suallar
- 0.5-0.7: Balanslaşdırılmış (default)
- 0.8-1.2: Yaradıcı, mürəkkəb suallar

---

### 4. Sual Redaktəsində AI Dəstəyi

**a) AI Köməkçi Panel (Inline)**
```text
┌─────────────────────────────────────────────┐
│  Sual 1                    [Redaktə] [+Bank]│
│  ─────────────────────────────────────      │
│  Sual mətni burada...                       │
│                                             │
│  💡 AI Təklifləri:                          │
│  ├─ [Sualı sadələşdir]                      │
│  ├─ [Çətinləşdir]                           │
│  ├─ [Variantları yaxşılaşdır]               │
│  ├─ [İzahı genişləndir]                     │
│  └─ [Oxşar sual yarat]                      │
└─────────────────────────────────────────────┘
```

**b) AI Redaktə Funksiyaları**
- **Sadələşdir**: Sualı daha asan formaya çevir
- **Çətinləşdir**: Sualı daha mürəkkəb et
- **Variantları yaxşılaşdır**: Distraktorları gücləndir
- **İzahı genişləndir**: Daha ətraflı izah yaz
- **Oxşar sual yarat**: Eyni mövzuda yeni sual

**c) Yeni Edge Function: enhance-question**
```text
Input: {
  question: {...},
  action: "simplify" | "harder" | "improve_options" | "expand_explanation" | "similar"
}
Output: { enhancedQuestion: {...} }
```

---

### 5. Bloom Taksonomiyası İnteqrasiyası

**a) Avtomatik Bloom Səviyyəsi Təyini**
- AI sual yaradarkən Bloom səviyyəsini avtomatik təyin etsin
- Yaradılmış suallarda Bloom badge göstərilsin

**b) Səviyyələr**
```text
┌──────────────────────────────────────┐
│ 🔵 Yadda saxlama  │ 🟢 Anlama       │
│ 🟡 Tətbiqetmə     │ 🟠 Analiz       │
│ 🔴 Sintez         │ 🟣 Qiymətləndirmə│
└──────────────────────────────────────┘
```

**c) Filtrlə yaratma**
- "Yalnız Analiz səviyyəsində suallar yarat" seçimi

---

### 6. Sual Yaratma Statistikası

**a) Real-time Progress**
```text
┌─────────────────────────────────────────────┐
│  📊 Yaratma Statistikası                    │
│  ─────────────────────────────────────      │
│  Bugün: 15 sual │ Bu həftə: 45 sual        │
│  Token istifadəsi: 12,450 / 100,000         │
│  ████████░░ 12%                             │
└─────────────────────────────────────────────┘
```

---

### 7. Batch Mode - Toplu Sual Yaratma

**a) Çoxlu Mövzu İmkanı**
```text
┌─────────────────────────────────────────────┐
│  📋 Toplu Sual Yaratma                      │
│  ─────────────────────────────────────      │
│  Mövzu 1: Cəbr - Xətti tənliklər (5 sual)  │
│  Mövzu 2: Cəbr - Kvadrat tənliklər (5 sual)│
│  Mövzu 3: Həndəsə - Üçbucaq (5 sual)       │
│                        [+ Mövzu əlavə et]   │
│                                             │
│              [Hamısını Yarat]               │
└─────────────────────────────────────────────┘
```

---

### 8. Sual Keyfiyyət Analizi

**a) Avtomatik Keyfiyyət Yoxlaması**
```text
┌─────────────────────────────────────────────┐
│  ✅ Keyfiyyət Hesabatı                      │
│  ─────────────────────────────────────      │
│  ● Aydınlıq: ████████░░ 80%                 │
│  ● Distraktor gücü: ██████░░░░ 60%          │
│  ● Bloom uyğunluğu: █████████░ 90%          │
│                                             │
│  ⚠️ Təklif: B variantı çox açıq görünür    │
└─────────────────────────────────────────────┘
```

---

### 9. Şablon Təkmilləşdirmələri

**a) Şablon Kateqoriyaları**
- Fənnə görə qruplaşdırma
- Bloom səviyyəsinə görə
- Sual tipinə görə (praktik, nəzəri, analitik)

**b) Şablon Paylaşımı**
- İstifadəçilər arası şablon paylaşımı
- Ən populyar şablonlar siyahısı

---

## Fayl Dəyişiklikləri Xülasəsi

| Fayl | Əməliyyat | Təsvir |
|------|-----------|--------|
| `src/pages/teacher/AIAssistantPage.tsx` | Dəyişiklik | AI parametrləri, batch mode, statistika |
| `src/components/quiz/EditableQuestionCard.tsx` | Dəyişiklik | AI inline dəstəyi, media göstərimi |
| `src/components/ai/AIParametersPanel.tsx` | Yeni | Temperatur, model seçimi |
| `src/components/ai/MediaUploader.tsx` | Yeni | Şəkil/audio/video yükləmə |
| `src/components/ai/QuestionEnhancer.tsx` | Yeni | AI ilə sual təkmilləşdirmə |
| `src/components/ai/BloomLevelBadge.tsx` | Yeni | Bloom səviyyəsi göstəricisi |
| `src/components/ai/GenerationStats.tsx` | Yeni | Yaratma statistikası |
| `supabase/functions/generate-question-image/index.ts` | Yeni | AI şəkil yaratma |
| `supabase/functions/enhance-question/index.ts` | Yeni | Sual təkmilləşdirmə |
| `supabase/functions/generate-quiz/index.ts` | Dəyişiklik | Temperatur, model parametrləri |
| DB Migration | Yeni | Media sütunları əlavə etmək |

---

## Prioritetlər (Mərhələli Tətbiq)

**Faza 1 - Əsas Təkmilləşdirmələr**
1. AI Parametrləri Paneli (temperatur, model)
2. Sual redaktəsində AI dəstəyi
3. Bloom səviyyəsi avtomatik təyini

**Faza 2 - Media Dəstəyi**
4. Sual şəkili yükləmə
5. AI ilə şəkil yaratma
6. Database media sütunları

**Faza 3 - İrəliləmiş Funksiyalar**
7. Batch mode
8. Keyfiyyət analizi
9. Şablon paylaşımı
10. Statistika paneli
