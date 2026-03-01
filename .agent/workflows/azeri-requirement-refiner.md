---
description: Azerbaijani requirements refinement and technical translation workflow
---

# Azerbaijani Requirement Refiner Workflow

Bu workflow istifadəçinin qeyri-formal istəklərini peşəkar səviyyəyə çatdırmaq üçün təlimatdır.

## Addımlar

### 1. Dəqiqləşdirmə (Discovery)
İstifadəçi sadə istək verdikdə (məs: "Səhifədə bir düymə olsun"), dərhal işə başlamayın. Aşağıdakıları soruşun:
- **Məqsəd**: Bu düymə tam olaraq nə edəcək?
- **Görünüş**: Stil və yerləşmə necə olmalıdır?
- **Nümunə**: "Məsələn, düyməyə basanda yeni pəncərə açılsın?" formatında suallar verin.

### 2. Texniki Analiz (Analysis)
İstəyi layihə daxilində araşdırın:
- Hansı komponent dəyişməlidir? (`src/components/...`)
- Yeni API və ya Supabase table lazımdır?
- Mövcud `Auth` və ya `Context` dəyişiklikləri tələb olunur?

### 3. Texniki Tərcümə (Technical Translation)
İstəyi ingilis dilində peşəkar `Task` formasına salın. Format:
- **Feature Title**
- **Business Logic**
- **Technical Requirements** (Frontend, Backend, DB)
- **Impact Analysis**

### 4. Keyfiyyət Təminatı (Quality Assurance - MANDATORY)
Hər bir kod dəyişikliyindən sonra:
1. `npm run lint` ilə stil və kod qaydalarını yoxla.
2. `tsc --noEmit` ilə bütün tip (TypeScript) xətalarını həll et.
3. Əgər xətalar varsa, onları düzəltmədən tapşırığı tamamlanmış hesab etmə.
