# Gemini Agent Əməliyyat Təlimatları (Quiz-App Projesi)

Bu sənəd `quiz-app` layihəsində Gemini AI agenti (Antigravity) ilə işləmək üçün qaydaları, texniki standartları və ən yaxşı təcrübələri müəyyən edir.

---

## 1. ❗ Əsas Əməliyyat Direktivi (Core Directive)

**İstifadəçidən gələn bütün Azərbaycan dilində olan göstərişlər daxili analiz üçün texniki ingilis dilinə tərcümə edilməlidir. Lakin, istifadəçiyə verilən bütün cavablar, izahatlar və yekun hesabatlar mütləq Azərbaycan dilində olmalıdır.**

---

## 2. 🐳 Docker İnkişaf Mühiti

Layihə artıq Docker konteynerində işləyir. Port münaqişələrinin qarşısını almaq üçün aşağıdakı qaydalara əməl edilməlidir:

- **Port**: Tətbiq `http://localhost:3005` ünvanında əlçatandır.
- **Konteynerin idarə edilməsi**:
  ```bash
  # Başlatmaq üçün
  docker-compose up -d
  
  # Dayandırmaq üçün
  docker-compose down
  
  # Yenidən yığmaq üçün
  docker-compose up -d --build
  ```

---

## 3. 🛠 Texniki Arxitektura

- **Frontend**: React 18 (TypeScript), Vite, Tailwind CSS.
- **UI Komponentləri**: Shadcn UI, Radix UI, Lucide React (ikonlar).
- **Backend/Database**: Supabase (Authentication və Verilənlər Bazası).
- **State Management**: TanStack React Query.
- **Animasiyalar**: Framer Motion.

---

## 4. 🤖 Agent İş Axını (Agent Workflows & Skills)

Layihədə yeni funksionallıqlar əlavə edərkən ən optimal "Skill" (rol) faylına baxılmalıdır. Bu, "Vibe Coding" prosesinin təkmilləşdirilməsi və xüsusi vəziyyətlərdə yaddaşın (tokenlərin) az sərf edilməsi üçündür:

1. **Süni İntellekt Dəqiqləşdirməsi (AI Refiner):** Tələbləri dəqiqləşdirmək üçün `.agent/workflows/azeri-requirement-refiner.md` çalışdırın.
2. **Frontend Tapşırıqları:** Veb interfeys, React komponenti, State dəyişiklikləri üçün `.agent/skills/frontend-developer.md` biliklərindən (və onun yönləndirdiyi `FRONTEND_ARCHITECTURE.md` faylından) istifadə edin.
3. **Backend / Verilənlər Bazas (DB) Tapşırıqları:** Supabase, RLS, Edge Function dəyişiklikləri üçün `.agent/skills/backend-architect.md` biliklərindən (və əlaqəli `DB_SCHEMA.md`, `BACKEND_ARCHITECTURE.md` fayllarından) istifadə edin.
4. **DevOps və Test Tapşırıqları:** CI/CD (GitHub Actions), Husky (Pre-commit hooks), Unit və E2E testlər, Kod keyfiyyəti üçün `.agent/skills/devops-engineer.md` biliklərindən (və `.agent/knowledge/DEVOPS_TESTING.md`) istifadə edin.
5. **İcra Planı:** Həmişə `implementation_plan.md` hazırlayıb təsdiq aldıqdan sonra kod yazmağa başlayın.

---

## 5. ✅ Keyfiyyət və Təhlükəsizlik (Mandatory Quality Gates)

Hər bir dəyişiklikdən dərhal sonra aşağıdakı yoxlamalar edilməli və tapılan xətalar (lint, typecheck) mütləq həll edilməlidir:

```bash
# Kodun keyfiyyəti (Lint)
docker exec quiz_app_container npm run lint

# Tip yoxlanışı (Typecheck)
docker exec quiz_app_container npx tsc --noEmit
```

### Agent üçün Keyfiyyət Qaydası:
- Kodun yazılması tapşırığın yalnız 50%-dir. Qalan 50% kodun xətasız (error-free) olmasını təmin etməkdir.
- Hər hansı bir funksionallıq əlavə edildikdə, sistemin digər hissələrində yaranan "collateral damage" (məsələn, tip uyğunsuzluğu) dərhal aradan qaldırılmalıdır.

---

## 6. 📁 Qovluq Strukturu

- `src/components`: UI və funksional komponentlər.
- `src/pages`: Səhifə səviyyəli komponentlər və routing.
- `src/integrations/supabase`: Supabase müştərisi və tip tərifləri.
- `src/hooks`: Xüsusi React hook-ları.
- `.agent`: Layihəyə özəl agent təlimatları (workflows/skills).
