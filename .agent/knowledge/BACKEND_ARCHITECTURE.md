# Quiz App - Backend Architecture & Edge Functions Standards

## Tech Stack
- Supabase (PostgreSQL Database)
- Supabase Edge Functions (Deno / TypeScript)
- Row Level Security (RLS) Policies

## Folder Structure
- `supabase/migrations`: Bütün database strukturu və RLS siyasətlərinin (policy) yaradıldığı `.sql` fayllar.
- `supabase/functions`: Edge Functions. Hər bir funksiya üçün ayrılmış qovluq (`ai-chat/`, `generate-quiz/`, `process-document/` və s.).

## Edge Function Best Practices (Standardlar)

### 1. Request Handling & CORS
Hər Edge Function CORS header-ləri daxilində və `OPTIONS` request-ini handle edəcək şəkildə yazılmalıdır.
Mümkünsə, `_shared/cors.ts` faylından istifadə edərək CORS dəyərlərini asanlıqla mənimsəyin.

```typescript
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  // Base logic
})
```

### 2. Validation & Request body
`req.json()` çağıraraq daxil olan dəyərləri tutarkən null/undefined case-ləri mütləq yoxlanılmalı və istifadəçiyə dəqiq 400 Bad Request qaytarılmalıdır.

### 3. Error Handling
Edge funksiyada baş verən xətaları (catch) `try-catch` bloku vasitəsilə tutub istifadəçiyə json formatında qaytarın:
```typescript
catch (error) {
  console.error("Error message:", error);
  return new Response(JSON.stringify({ error: error.message }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 500,
  });
}
```

### 4. AI Tool Usage (`_shared/ai-usage.ts`)
Tətbiqdə AI modellərinə edilən hər çağırışdan əvvəl (Gemini, OpenAI) mütləq AI token limitinin yoxlanılması və qeydiyyata alınması lazımdır. Bütün AI Edge Function-lar bu mərkəzləşdirilmiş faylı (`_shared/ai-usage.ts`) istifadə etməlidir.

### 5. RLS (Row Level Security)
Verilənlər bazasındakı xüsusi cədvəllər RLS aktiv olaraq yaradılmalıdır:
- Tələbə yalnız öz cədvəlini (results) görə bilər.
- Müəllimlər və Adminlər hər kəsin / aidiyyatı olan məlumatlara baxa bilər (`admin_only` və s. siyasətləri ilə).
