# Scoped Rules: Supabase & Database (`supabase/`)

Bu qovluqda işləyərkən aşağıdakı qaydalara riayət edilməlidir:

1. **Row Level Security (RLS)**:
   - Hər yeni cədvəl üçün `ENABLE ROW LEVEL SECURITY` məcburidir.
   - Bütün rollar (`admin`, `teacher`, `student`) üçün dəqiq icazə siyasətləri yazılmalıdır.
2. **Miqrasiyalar (Migrations)**:
   - Miqrasiya faylları `supabase/migrations/YYYYMMDDHHMMSS_<ad>.sql` şəklində adlandırılmalıdır.
   - Mövcud məlumatların bütövlüyü pozulmamalıdır.
3. **Edge Functions**:
   - `supabase/functions/` altındakı funksiyalarda CORS headers, JWT doğrulaması və Deno mühit qaydaları qorunmalıdır.
