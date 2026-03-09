# Quiz App - DevOps, CI/CD, & Testing Standards

## 1. Kod Keyfiyyəti (Linting & Formatting)
Commit-dən əvvəl mütləq kodu yoxlamaq lazımdır. Bu, sintaksis və tip xətalarının Production-a getməməsi üçün çox vacibdir.

Əmrlər:
- `npm run lint`: ESLint yoxlaması.
- `npx tsc --noEmit`: TypeScript tip yoxlaması.

## 2. Test Tələbləri (Testing)
Hər bir yeni komponent və ya məntiq (logic) yazıldığında, ona uyğun testlər yazılmalıdır.
Layihə daxilində konfiqurasiya edilib:
- **Unit & Component Tests**: `vitest` vasitəsilə. Testlər `tests/unit/` qovluğunda və ya komponentin yanında yerləşə bilər.
- **E2E Tests**: `playwright` vasitəsilə. Testlər `tests/e2e/` qovluğunda yerləşir.

Məcburi Agent Qaydası: Testlər uğurla keçmədən (`npm run test` və ya E2E) tapşırığı yekunlaşdırmayın.

## 3. Git Workflow & Pre-commit Hooks
Layihədə `husky` yüklüdür. Mükəmməl bir DevOps yanaşması olaraq hər bir commit-dən əvvəl kodların keyfiyyəti avtomatik yoxlanmalıdır (lint-staged + husky istifadə edilərək).
Hər ehtimala qarşı işinizi commit etmədən öncə manual olaraq lint və test komandalarını buraxın.

## 4. CI/CD (GitHub Actions)
Əgər layihəni GitHub-a push edirsinizsə, aşağıdakı mühit inkişafı üçün `.github/workflows/` altında YAML faylları mövcud olacaq (məsələn: `main.yml`).
Pipeline ardıcıllığı belə olmalıdır:
1. Paketin yüklənməsi (`npm install`)
2. Lintinq (`npm run lint`)
3. Tip Yoxlaması (`npx tsc --noEmit`)
4. Testlər (`npm run test`)
5. (Opsional) Docker İmage Build və Deploy

> **Agent üçün göstəriş:** Məndən (İstifadəçidən) hər hansı DevOps, deploy, yoxlama və ya testing ssenaisi tələb edilərsə həmişə bu göstərişləri izlə. Mütləq "devops-engineer" skill-ni aktivləşdir.
