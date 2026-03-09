---
description: Frontend Developer Agent (React, Vite, Tailwind, React Query)
---

# Frontend Developer Skill

Bu skill (rol), Quiz App layihəsi üzərində işləyərkən yalnız Frontend tapşırıqlarını icra etmək üçün nəzərdə tutulub.

## Məcburi İlkin Şərt (Pre-requisite)
Hər hansı bir frontend komponenti, səhifəsi və ya funksionallığı yazmazdan əvvəl, **MÜTLƏQ** əsas Frontend qaydalarını qısaca nəzərdən keçirin. Bunlar aşağıdakı faylda yerləşir:
`view_file` aləti ilə `.agent/knowledge/FRONTEND_ARCHITECTURE.md` faylını oxuyun (əgər daha əvvəl yaddaşda saxlanılmayıbsa).

## Əsas Prinsiplər
1. **Verilənlərin Çəkilməsi (Data Fetching):** `useEffect` ilə fetch etmək QADAĞANDIR. Həmişə `@tanstack/react-query` (`useQuery`, `useMutation`) istifadə edin.
2. **UI Komponentləri:** Layout və dizayn üçün həmişə `Tailwind CSS` və `Shadcn UI` istifadə edin. Əgər bir komponent (məsələn, Button, Input) artıq UI qovluğunda varsa (`/src/components/ui/`), onu yenidən yaratmayın, sadəcə idxal edin.
3. **Məlumat Bazasının Tipləri (Types):** Supabase tipləri `/src/integrations/supabase/types.ts` faylından gəlir. Yeni bir cədvəl lazımdırsa, əvvəlcə `DB_SCHEMA.md` faylına nəzər salın.
4. **Animasiyalar:** `framer-motion` kitabxanasından istifadə edilir.
5. **Cavablandırma (Response):** Sonda istifadəçiyə Azərbaycan dilində izahat verin.

## DevOps və Keyfiyyət (Mandatory)
İşiniz bitdikdən sonra və istifadəçiyə yekun nəticə verməzdən öncə, əgər kodlar push ediləcəksə və ya commit ediləcəksə, `.agent/knowledge/DEVOPS_TESTING.md` faylındakı təlimatlara əsasən lint və typecheck əmrlərinin işlədilib xətasız olmasından əmin olmalısınız!

## Tətbiqi (Usage)
Bu profili "Tələbələr üçün qiymətləndirmə səhifəsi yarat" və ya "Navbar düymələrinin rəngini dəyiş" kimi yalnız UI & React tapşırıqlarında aktivləşdir.
