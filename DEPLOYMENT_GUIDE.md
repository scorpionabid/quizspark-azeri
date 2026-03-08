# Deploy (İstehsalata Buraxılma) Bələdçisi

Layihəniz artıq həm funksional, həm də vizual olaraq tamamlanıb. Onu geniş istifadəçi kütləsinə təqdim etmək üçün aşağıdakı addımları izləməyi tövsiyə edirəm.

## 🏁 1. Frontend Deploy (Veb tərəfi)

Layihə **React + Vite** əsaslı olduğu üçün aşağıdakı platformalar ən yaxşı seçimdir:

- **Vercel və ya Netlify (Tövsiyə olunur):**
  - Git repository-ni (GitHub/GitLab) bağlayın.
  - Build command: `npm run build`
  - Output directory: `dist`
  - **Environment Variables:** `.env` faylındakı dəyişənləri (Supabase URL və Anon Key) platformanın "Environment Variables" bölməsinə əlavə edin.

> [!IMPORTANT]
> PWA funksionallığının işləməsi üçün sayt mütləq **HTTPS** protokoluna malik olmalıdır. Vercel və Netlify bunu avtomatik təmin edir.

## 🗄 2. Supabase (Database və Auth)

- **Production Proyekti:** Yerli Supabase yerinə, [supabase.com](https://supabase.com) üzərində yeni proyekt yaradın.
- **Miqrasiyalar:** `supabase/migrations` qovluğundakı SQL fayllarını yeni layihənin SQL Editor bölməsində işə salın.
- **API Keys:** Yeni proyektin `URL` və `anon` açarını frontend-in istehsalat mühitinə (Vercel/Netlify) əlavə edin.
- **Site URL:** Supabase Authentication ayarlarında "Site URL" hissəsinə tətbiqin real domen ünvanını (məs: `https://sinaq-app.vercel.app`) yazın.

## 📂 3. Fayl Strukturunun Təmizlənməsi

- Hazırda kök qovluqdakı plan sənədləri `archive/plans/` qovluğuna köçürülərək təmizlənib.
- `.env` faylı heç vaxt Git-ə (ictimai qovluğa) göndərilməməlidir (`.gitignore` buna nəzarət edir).

## 📱 4. PWA Yoxlanışı

- Saytı deploy etdikdən sonra Lighthouse (Chrome DevTools) vasitəsilə PWA auditini yoxlayın.
- Manifest və loqoların düzgün yükləndiyindən əmin olun.

---

**Məsləhət:** İlk olaraq tətbiqi Vercel kimi pulsuz bir mühitdə yoxlamaqla başlayın. Hər hansı bir problem yaranarsa (məsələn, CORS xətaları), Supabase-də domen icazələrini tənzimləmək lazım gələcək.
