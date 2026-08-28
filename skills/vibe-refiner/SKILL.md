---
name: vibe-refiner
description: İstifadəçinin Azərbaycan dilində yazdığı tələbləri, ideyaları və xüsusiyyət istəklərini dərhal texniki spesifikasiyaya (Spec-Driven Vibe Coding) çevirən bacarıq.
---

# Vibe Coding Tələb Dəqiqləşdiricisi (Vibe Refiner Skill)

Bu bacarıq istifadəçidən gələn sadə və ya qeyri-müəyyən tələbləri (məsələn, "viktorina nəticələrini excelə çıxar", "müəllim üçün yeni statistika kartı əlavə et") layihənin arxitekturasına uyğun konkret texniki tapşırığa çevirir.

## 1. Tələb Analiz Şablonu

İstifadəçi yeni xüsusiyyət istədikdə, agent daxili olaraq aşağıdakı 4 qatı müəyyən edir:

1. **DB Qatı**: Yeni cədvəl, sütun və ya RLS siyasəti tələb olunurmu?
2. **Hook / State Qatı**: Hansı React Query hook-u (`src/hooks/`) yaradılmalı və ya yenilənməlidir?
3. **UI / Komponent Qatı**: Hansı Shadcn komponentləri və səhifələr (`src/components/`, `src/pages/`) təsirlənir?
4. **Təhlükəsizlik və Rollar**: Hansı rol (`admin`, `teacher`, `student`) bu funksiyaya çıxış əldə edir?

---

## 2. Qərar Məntiqi (Micro vs Macro Task)

- **Micro-task** (Tək komponentdə dizayn/mətn dəyişikliyi): Plan tələb olunmur, birbaşa tətbiq edilir və `tsc` yoxlanılır.
- **Macro-task** (Yeni səhifə, DB cədvəli, yeni auth qaydası): `implementation_plan.md` yaradılır və istifadəçidən təsdiq alınır.
