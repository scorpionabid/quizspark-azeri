# Verilənlər Bazası Quraşdırma Təlimatı

Bu sənəd digər developerlərin layihənin verilənlər bazası ilə əlaqə qurması üçün lazım olan addımları izah edir.

---

## 1. Ümumi Arxitektura

Layihə **Lovable Cloud** (Supabase əsaslı) backend istifadə edir:
- **PostgreSQL** verilənlər bazası
- **Row Level Security (RLS)** ilə məlumat təhlükəsizliyi
- **Edge Functions** serverless backend məntiq üçün
- **Storage Buckets** fayl saxlama üçün

---

## 2. Əlaqə Məlumatları

### Mühit Dəyişənləri

Aşağıdakı dəyişənlər `.env` faylında avtomatik konfiqurasiya olunur:

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

### Supabase Client İstifadəsi

```typescript
import { supabase } from "@/integrations/supabase/client";

// Məlumat oxumaq
const { data, error } = await supabase.from('quizzes').select('*');

// Məlumat əlavə etmək
const { data, error } = await supabase.from('quizzes').insert({ title: 'Yeni Quiz', creator_id: userId });
```

---

## 3. Verilənlər Bazası Cədvəlləri

| Cədvəl | Təyinat |
|---|---|
| `profiles` | İstifadəçi profilləri |
| `user_roles` | Rol təyinatları (admin, teacher, student) |
| `quizzes` | Quizlər |
| `questions` | Quiz sualları |
| `question_bank` | Sual bankı (media, embedding dəstəyi ilə) |
| `question_categories` | Sual kateqoriyaları |
| `documents` | Yüklənmiş sənədlər |
| `quiz_attempts` | Quiz cəhdləri |
| `quiz_results` | Quiz nəticələri |
| `quiz_ratings` | Reytinqlər |
| `comments` | Şərhlər |
| `favorites` | Sevimli quizlər |
| `notifications` | Bildirişlər |
| `ai_providers` | AI provayderləri |
| `ai_models` | AI modelləri |
| `ai_config` | AI konfiqurasiyası |
| `ai_usage_logs` | AI istifadə logları |
| `ai_daily_usage` | Gündəlik AI istifadə statistikası |
| `permissions` | İcazə tərifləri |
| `role_permissions` | Rol-icazə əlaqələri |

---

## 4. Əsas SQL Komandaları

### Cədvəl Strukturunu Görmək

```sql
-- Bütün cədvəlləri siyahıla
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Cədvəl sütunlarını gör
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'quizzes';

-- RLS siyasətlərini yoxla
SELECT policyname, cmd, qual, with_check 
FROM pg_policies WHERE tablename = 'quizzes';
```

### Məlumat Əməliyyatları

```sql
-- Quizləri oxu
SELECT * FROM quizzes WHERE is_published = true LIMIT 20;

-- Profil yarat
INSERT INTO profiles (user_id, full_name, email, status) 
VALUES ('uuid-here', 'Ad Soyad', 'email@example.com', 'active');

-- Rol təyin et
INSERT INTO user_roles (user_id, role) VALUES ('uuid-here', 'teacher');

-- Sual bankına sual əlavə et
INSERT INTO question_bank (user_id, question_text, question_type, correct_answer, options, difficulty) 
VALUES (
  'uuid-here', 
  'Sual mətni?', 
  'multiple_choice', 
  'A', 
  '["Cavab A", "Cavab B", "Cavab C", "Cavab D"]'::jsonb, 
  'orta'
);
```

### Migrasiyanı SQL ilə İcra Etmək

```sql
-- Yeni cədvəl yaratmaq
CREATE TABLE public.my_table (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS aktivləşdir
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

-- RLS siyasəti yarat
CREATE POLICY "Users can view own data" 
ON public.my_table FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" 
ON public.my_table FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

---

## 5. Edge Functions (Backend Funksiyalar)

Edge funksiyalar `supabase/functions/` qovluğunda yerləşir:

| Funksiya | Təyinat |
|---|---|
| `generate-quiz` | AI ilə quiz yaratma |
| `ai-chat` | AI söhbət |
| `process-document` | Sənəd emalı (auth tələb edir) |
| `question-bank` | Sual bankı əməliyyatları |
| `ai-config` | AI konfiqurasiya idarəsi |
| `enhance-question` | Sual təkmilləşdirmə |
| `generate-question-image` | Sual üçün şəkil yaratma |

### Edge Function Çağırmaq

```typescript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic: 'Riyaziyyat', count: 10 }),
  }
);
```

---

## 6. API Açarları və Sirlər

### Mövcud Sirlər (Edge Functions-da mövcuddur)

| Sirr | Təyinat |
|---|---|
| `SUPABASE_URL` | Supabase layihə URL-i |
| `SUPABASE_ANON_KEY` | Anonim açar (publik) |
| `SUPABASE_SERVICE_ROLE_KEY` | Servis rolu açarı (gizli, yalnız backend) |
| `LOVABLE_API_KEY` | Lovable AI gateway açarı |
| `SUPABASE_DB_URL` | Birbaşa DB bağlantı URL-i |

### Yeni Sirr Əlavə Etmək

Lovable Cloud-da sirlər **Settings → Cloud → Secrets** bölməsindən əlavə olunur. Edge funksiyalarda `Deno.env.get('SECRET_NAME')` ilə istifadə edilir:

```typescript
const apiKey = Deno.env.get('MY_API_KEY');
```

> ⚠️ **Diqqət:** `SUPABASE_SERVICE_ROLE_KEY` heç vaxt frontend kodda istifadə edilməməlidir. Yalnız edge funksiyalarda istifadə edin.

---

## 7. Autentifikasiya Sistemi

### Rollar

- `admin` — Tam idarəetmə
- `teacher` — Quiz/sual yaratma, AI istifadə
- `student` — Quiz həll etmə, nəticələrə baxma

### Yeni İstifadəçi Yarananda

`handle_new_user()` trigger funksiyası avtomatik:
1. `profiles` cədvəlinə profil əlavə edir
2. `user_roles` cədvəlinə rol təyin edir
3. OAuth girişlərində `is_profile_complete = false` qoyur

### Google OAuth

Google ilə giriş Lovable Cloud tərəfindən idarə olunur — əlavə konfiqurasiya tələb olunmur.

---

## 8. Storage Buckets

| Bucket | Publik | Təyinat |
|---|---|---|
| `question-images` | ✅ Bəli | Sual şəkilləri |
| `documents` | ❌ Xeyr | İstifadəçi sənədləri (RLS ilə qorunur) |

### Fayl Yükləmək

```typescript
const { error } = await supabase.storage
  .from('documents')
  .upload(`${userId}/file.pdf`, file, { contentType: 'application/pdf' });
```

---

## 9. Digər Mühitdə İşə Salmaq

1. Layihəni GitHub-dan klonlayın
2. `npm install` ilə asılılıqları quraşdırın
3. `.env` faylını yuxarıdakı dəyişənlərlə doldurun
4. `npm run dev` ilə development serveri başladın
5. DB dəyişiklikləri üçün Lovable Cloud interfeysi və ya Supabase dashboard istifadə edin
