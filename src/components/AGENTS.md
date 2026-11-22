# Scoped Rules: Components (`src/components/`)

Bu qovluqda işləyərkən aşağıdakı qaydalara riayət edilməlidir:

1. **Yalnız Təqdimat (Presentation Only)**:
   - Komponentlər daxilində birbaşa `supabase.from(...)` çağırışları QADAĞANDIR.
   - Bütün data-fetching və mutations `src/hooks/` qovluğundakı hook-lar vasitəsilə olmalıdır.
2. **Dizayn və UI Sistemi**:
   - Shadcn UI primitivlərindən (`@/components/ui/*`) istifadə edin.
   - Sinif birləşdirmələri üçün `cn()` funksiyasından (`@/lib/utils`) istifadə edin.
   - Rənglər və ölçülər üçün `tailwind.config.ts` dizayn tokenlərinə sadiq qalın.
3. **Accessibility (a11y)**:
   - Bütün interaktiv elementlər (düymələr, linklər, inputlar) üçün `aria-label`, klaviatura fokusu (`focus-visible`) və semantic HTML teqləri tətbiq olunmalıdır.
