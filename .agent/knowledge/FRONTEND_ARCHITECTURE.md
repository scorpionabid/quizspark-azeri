# Quiz App - Frontend Architecture & Component Standards

## Tech Stack
- React 18 (TypeScript), Vite
- Tailwind CSS, Shadcn UI, Radix UI (Primitives)
- Lucide React (Icons)
- Framer Motion (Animations)
- React Router (Routing)
- TanStack React Query (Data Fetching & State)
- Supabase-js (Backend connection)

## Folder Structure
- `src/pages`: Səhifə (Page) səviyyəli komponentlər.
  - Structure inside pages: Grouped by roles/domains (`admin/`, `teacher/`, `auth/`, `student/`).
- `src/components`: Yenidən istifadə edilə bilən UI və biznes komponentləri.
  - Sub-folders by domain (`ui/` for Shadcn components, `question-bank/`, `quiz/`, `ai/`).
- `src/hooks`: Custom React hooks (e.g. `useAuth.ts`, `useToast.ts`, `use-mobile.ts`).
- `src/integrations/supabase`: Supabase Client and Auto-generated Types (`types.ts`).

## Page & Component Best Practices (Standardlar)

### 1. Data Fetching (React Query)
Həmişə React Query `useQuery` və `useMutation` istifadə edin. 
```tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("table_name").select("*");
      if (error) throw error;
      return data;
    }
  });
};
```

### 2. Styling (Tailwind CSS)
- Standart olaraq Tailwind siniflərini (classes) istifadə edin (CSS modulları və ya styled-components-dən qaçın).
- Şaquli və üfüqi düzümsüzlərdə (layout) `flex` və ya `grid` dən, boşluqlar üçün isə `gap`, `p`, `m` istifadə edin.
- Rənglər app səviyyəsində qurulub (`bg-primary`, `text-muted-foreground`, `border-border` və s.).

### 3. State Management
- Lokal state üçün `useState` istifadə edin.
- Qlobal və server state üçün `React Query` istifadə edin.
- Form işləri üçün `react-hook-form` + `zod` inteqrasiyasına üstünlük verin.

### 4. Animations
- Mürəkkəb interaksiyalar üçün `framer-motion` (`motion.div`) istifadə edin. Sadə keçidlər (transitions) üçün Tailwind-in `transition-all duration-300` classlarını işlədin.

### 5. Error & Loading States
Həmişə Page və Böyük Komponentlərdə Loading Indicator (`Skeleton` və ya `Loader2` from `lucide-react`) və Error Handle (useToast from `@/hooks/use-toast`) nəzərə alın.
