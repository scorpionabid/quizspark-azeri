# Scoped Rules: Hooks & Data Fetching (`src/hooks/`)

Bu qovluqda işləyərkən aşağıdakı qaydalara riayət edilməlidir:

1. **TanStack React Query Standartı**:
   - Bütün server sorğuları `useQuery` və `useMutation` ilə idarə olunmalıdır.
   - Hər domen üçün Query Key Factory strukturu tətbiq olunmalıdır (məs: `QUIZ_KEYS`, `QUESTION_KEYS`).
2. **Keş İdarəetməsi (Cache Invalidation)**:
   - Hər `useMutation` uğurla tamamlandıqda (`onSuccess`), əlaqəli query key-lər `queryClient.invalidateQueries` ilə yenilənməlidir.
3. **Xəta Emalı (Error Handling)**:
   - Sorğu zamanı baş verən xətalar Toast bildirişləri (`sonner` və ya `useToast`) vasitəsilə istifadəçiyə Azərbaycan dilində aydın göstərilməlidir.
