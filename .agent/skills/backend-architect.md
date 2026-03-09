---
description: Backend Architect Agent (Supabase, Deno, Postgres, RLS)
---

# Backend Architect Skill

Bu skill, Quiz App layihəsində yalnız verilənlər bazası (DB), Edge Functions (Deno) və Row Level Security (RLS) kimi arxa tərəf (Backend) tapşırıqlarını yerinə yetirmək üçün nəzərdə tutulub.

## Məcburi İlkin Şərt (Pre-requisite)
1. Edge Function və arxitektura qaydaları üçün **MÜTLƏQ** `.agent/knowledge/BACKEND_ARCHITECTURE.md` faylını oxuyun.
2. Mövcud cədvəl və sütun strukturu üçün `.agent/knowledge/DB_SCHEMA.md` faylını oxuyun.
3. Təməl tipləri və strukturu qısaca anlamaq üçün lazım gələrsə `src/integrations/supabase/types.ts` yoxlanılmalıdır. Bütün axtarışları minimuma endirmək əsas hədəfdir!

## Əsas Prinsiplər
1. **Siyasətlər (RLS Policies):** Hər bir yeni cədvəl üçün `ENABLE ROW LEVEL SECURITY` komandası verilməli və ən azı bir əsas `SELECT` və `INSERT` siyasəti (policy) əlavə olunmalıdır.
2. **Edge Functions:** Həmişə CORS dəstəyi təmin olunmalıdır (`OPTIONS` metodu). Xətaları strukturlu şəkildə (500, 400, json formatında) qaytarın.
3. **AI Əlaqələri:** Süni intellekt köməyi (OpenAI, Gemini) istifadə edən hər Edge Function `_shared/ai-usage.ts` mərkəzli faylı çağıraraq token limiti yoxlaması aparmalıdır.
4. **Köçürmələr (Migrations):** Yeni cədvəl / struktur dəyişikliyi tələb edilirsə, yeni bir `.sql` faylı (migration) yaranmalı və bu barədə istifadəçiyə bildirilməlidir. (Adlandırma: `YYYYMMDDHHMMSS_name.sql`).
5. **Cavablandırma (Response):** Sonda istifadəçiyə prosesi və necə deploy/apply ediləcəyini Azərbaycan dilində izah edin.

## DevOps və Keyfiyyət (Mandatory)
İşiniz bitdikdən sonra, xüsusən edge functions və type daxil edildikdə, push/commit proseslərindən əvvəl mütləq `.agent/knowledge/DEVOPS_TESTING.md` faylına nəzər salın (npm run lint, tsc testləri və s.).
