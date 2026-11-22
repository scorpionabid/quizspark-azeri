---
name: quiz-qa-automator
description: Kod keyfiyyəti (ESLint), tip yoxlanışı (TypeScript tsc), Docker daxilində testlərin icrası və sıfır reqressiya (zero-regression) təminatı bacarığı.
---

# Quiz App: Keyfiyyət Təminatı və Test Bacarığı (Skill)

Bu bacarıq kod dəyişikliklərindən sonra layihənin bütövlüyünü, sintaktik və tip xətalarının olmadığını yoxlamaq üçün istifadə olunur.

## 1. Məcburi Keyfiyyət Qapıları (Mandatory Quality Gates)

Hər kod redaktəsindən sonra aşağıdakı əmrlər icra edilməli və 0 xəta ilə tamamlanmalıdır:

```bash
# 1. ESLint yoxlanışı (kod təmizliyi)
docker exec quiz_app_container npm run lint

# 2. TypeScript tip yoxlanışı
docker exec quiz_app_container npx tsc --noEmit
```

---

## 2. Test İnfrastrukturu

1. **Unit & Integration Testlər**:
   - `src/tests/` qovluğunda Vitest / React Testing Library testləri.
2. **E2E Testlər**:
   - `playwright.config.ts` əsasında `tests/` qovluğunda Playwright ssenariləri.
   - Sınaq icrası: `npx playwright test`

---

## 3. Xəta Analizi Təlimatı
- Əgər `tsc` və ya `lint` xəta verərsə:
  1. Xətanın əsas səbəbini (Root cause) müəyyən edin.
  2. Yalnız xəta verən faylı deyil, ona bağlı olan tipləri və import-ları yoxlayın.
  3. Düzəliş etdikdən sonra keyfiyyət qapısını təkrar işə salın.
