---
name: quiz-frontend
description: Frontend inkişafı, React 18, TypeScript, Tailwind CSS, Shadcn UI, Radix primitives, Lucide ikonlar və TanStack React Query ilə işləmək üçün standartlar və bələdçi.
---

# Quiz App: Frontend İnkişaf Bacarığı (Skill)

Bu bacarıq `quiz-app` layihəsində veb interfeys, komponentlər, səhifələr və reaktiv vəziyyət (state) ilə işləyərkən istifadə olunur.

## 1. Əsas Texnoloji Yığın (Stack)
- **Framework**: React 18 + Vite (TypeScript)
- **UI Kit**: Shadcn UI (Radix UI əsaslı)
- **Stil**: Tailwind CSS (`tailwind.config.ts` dizayn tokenləri ilə)
- **Ikonlar**: `lucide-react`
- **Server State**: TanStack React Query (`@tanstack/react-query`)
- **Animasiyalar**: Framer Motion
- **Köməkçi Funksiya**: `cn()` (`src/lib/utils.ts`)

---

## 2. Komponent Arxitekturası və Qaydaları

1. **Təqdimat və Məntiq Ayrılığı (Separation of Concerns)**:
   - Komponentlər (`src/components/`) və Səhifələr (`src/pages/`) birbaşa Supabase client çağırmamalıdır.
   - Bütün məlumat çəkmə (fetch), yeniləmə (mutation) və keşləmə məntiqi `src/hooks/` qovluğundakı xüsusi React Query hook-larında olmalıdır.
2. **Shadcn UI Primitivləri**:
   - `src/components/ui/` qovluğundakı mövcud komponentlərdən istifadə edin (məs: `Button`, `Dialog`, `Card`, `Badge`, `DropdownMenu`).
   - Yeni baza komponenti lazımdırsa, mövcud Shadcn şablonlarına uyğun yazılmalıdır.
3. **Responsive və A11y (Accessibility)**:
   - Bütün interaktiv elementlər üçün `aria-label`, klaviatura naviqasiyası (`focus-visible:ring-2`) və kontrast təmin edilməlidir.
   - Mobil, planşet və masaüstü üçün Tailwind breakpoint-lərindən (`sm:`, `md:`, `lg:`, `xl:`) istifadə edilməlidir.

---

## 3. TanStack React Query İstifadə Standartı

```typescript
// Nümunə: src/hooks/useQuizzes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const QUIZ_KEYS = {
  all: ['quizzes'] as const,
  lists: () => [...QUIZ_KEYS.all, 'list'] as const,
  detail: (id: string) => [...QUIZ_KEYS.all, 'detail', id] as const,
};

export const useQuizzes = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
```

---

## 4. İcradan Sonra Yoxlama
Hər frontend dəyişikliyindən sonra:
```bash
docker exec quiz_app_container npm run lint
docker exec quiz_app_container npx tsc --noEmit
```
