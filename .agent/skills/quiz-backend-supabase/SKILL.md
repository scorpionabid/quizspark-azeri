---
name: quiz-backend-supabase
description: Supabase PostgreSQL, Row Level Security (RLS), verilənlər bazası miqrasiyaları, Deno Edge Functions və təhlükəsizlik standartları ilə işləmək üçün bacarıq.
---

# Quiz App: Backend & Supabase İnkişaf Bacarığı (Skill)

Bu bacarıq `quiz-app` layihəsində verilənlər bazası cədvəlləri, RLS siyasətləri, miqrasiyalar və Edge Functions ilə işləyərkən istifadə olunur.

## 1. Verilənlər Bazası və RLS Standartları

1. **RLS Məcburidir (Row Level Security)**:
   - Yaradılan hər yeni cədvəldə `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;` icra edilməlidir.
   - İcazələr istifadəçi rollarına (`admin`, `teacher`, `student`) əsasən tənzimlənməlidir.
2. **Miqrasiya Faylları (Migrations)**:
   - Bütün DB dəyişiklikləri `supabase/migrations/YYYYMMDDHHMMSS_<description>.sql` formatında fayla yazılmalıdır.
   - İndekslər (`INDEX`) tez-tez axtarış edilən və xarici açar (`FOREIGN KEY`) sütunlarına əlavə edilməlidir.

```sql
-- Nümunə RLS Siyasəti
CREATE POLICY "Müəllimlər və adminlər sual yarada bilər" 
ON questions FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role IN ('admin', 'teacher')
  )
);
```

---

## 2. Supabase Edge Functions Standartı

- Qovluq: `supabase/functions/<function-name>/index.ts`
- Mühit: Deno (TypeScript)
- Qaydalar:
  - CORS başlıqları (`corsHeaders`) hər cavaba əlavə olunmalıdır.
  - Səhvlər `try...catch` blokunda tutulub müvafiq HTTP status kodu (400, 401, 500) ilə JSON formatında qaytarılmalıdır.
  - Məxfi açarlar (məs: OpenAI / Gemini API Keys) `Deno.env.get()` vasitəsilə oxunmalıdır.

---

## 3. Tip Sinxronizasiyası
DB dəyişikliyindən sonra TypeScript tiplərini yeniləmək və ya `src/integrations/supabase/types.ts` faylı ilə uyğunlaşdırmaq vacibdir.
