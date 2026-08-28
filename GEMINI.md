# Gemini & Antigravity Əməliyyat Təlimatları (Quiz-App)

Bu sənəd `quiz-app` layihəsində Antigravity AI agenti ilə yüksək sürətli və keyfiyyətli ("vibe coding") inkişaf prosesini tənzimləyir.

---

## 1. ❗ Əsas Əməliyyat Direktivi (Core Directive)

- **Ünsiyyət Dili:** Bütün cavablar, izahatlar, planlar və yekun hesabatlar mütləq **Azərbaycan dilində** olmalıdır.
- **Texniki Terminlər:** Orijinal ingilis dilində saxlanılmalıdır (məs: *deployment*, *middleware*, *hook*, *state*, *component*, *props*).
- **Daxili Analiz:** İstifadəçidən gələn tələblər daxili analiz üçün texniki ingilis dilinə çevrilərək icra edilir.

---

## 2. 🐳 Docker İnkişaf Mühiti

Layihə Docker konteynerində işləyir:
- **Port:** `http://localhost:3005`
- **Konteyner Əmrləri:**
  ```bash
  docker-compose up -d           # Başlatmaq
  docker-compose down            # Dayandırmaq
  docker-compose up -d --build   # Yenidən yığmaq
  ```

---

## 3. 🛡️ Məcburi Keyfiyyət Qapıları (Mandatory Quality Gates)

Hər kod redaktəsindən sonra aşağıdakı yoxlamalar icra edilməli və xətalar dərhal həll olunmalıdır:

```bash
# 1. ESLint yoxlanışı
docker exec quiz_app_container npm run lint

# 2. TypeScript Tip Yoxlanışı
docker exec quiz_app_container npx tsc --noEmit
```

> **Qızıl Qayda:** Kod yazmaq işin yalnız 50%-dir. Qalan 50% kodun tam xətasız və layihənin digər hissələrini sındırmadan (zero collateral damage) işləməsidir.

---

## 4. 🚀 Vibe Coding & Skills Arxitekturası

Layihə kontekstini təmiz saxlamaq üçün Antigravity **Progressive Disclosure** mexanizmi ilə işləyir:

- **Frontend Tapşırıqları:** `skills/quiz-frontend/SKILL.md` və `src/components/AGENTS.md`
- **Backend / DB Tapşırıqları:** `skills/quiz-backend-supabase/SKILL.md` və `supabase/AGENTS.md`
- **State & Hook Tapşırıqları:** `src/hooks/AGENTS.md`
- **Tələb Dəqiqləşdirmə:** `skills/vibe-refiner/SKILL.md`
- **QA & Testlər:** `skills/quiz-qa-automator/SKILL.md`

### İcra Rejimləri:
- **Micro-tasks (Kiçik düzəlişlər):** Birbaşa redaktə + dərhal `tsc` yoxlanışı.
- **Macro-tasks (Yeni modullar):** `implementation_plan.md` -> İstifadəçi təsdiqi -> İcra -> `walkthrough.md`.

---

## 5. 📁 Qovluq Strukturu

- `src/components/`: UI və vizual komponentlər (Shadcn UI əsaslı).
- `src/pages/`: Səhifələr və marşrutlar (Routing).
- `src/hooks/`: Bütün TanStack React Query və Supabase sorğuları.
- `src/integrations/supabase/`: Supabase müştərisi və tipləri.
- `supabase/migrations/`: SQL miqrasiya faylları.
- `docs/`: Sənədləşmə, şablonlar və arxiv materialları.
- `skills/`: Antigravity bacarıqları (Skills).
