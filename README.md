# Sınaq Platforması (QuizSpark)

İnteraktiv təhsil, onlayn sınaq imtahanları və bilik yarışması platforması.

## Layihə Haqqında

Sınaq platforması müəllimlər və tələbələr üçün nəzərdə tutulmuş müasir interaktiv quiz və imtahan sistemidir:
- Müxtəlif sual növləri (tək seçimli, çox seçimli, boşluq doldurma, uyğunlaşdırma, sıralama, riyazi və s.)
- Vaxt məhdudiyyətli və parolla qorunan təhlükəsiz imtahanlar
- Real-vaxt statistika və nəticə analitikası
- Sual bankı və AI dəstəkli sual generatoru
- PWA dəstəyi (mobil və masaüstü quraşdırma)

## Texnologiyalar

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Framer Motion
- **Backend / Verilənlər Bazası:** PostgreSQL, Supabase, Edge Functions, Deno
- **Mühit:** Docker Compose, Nginx

## Quraşdırma və İşə Salma

### Tələblər
- Node.js (v20+)
- Docker və Docker Compose

### Yerli İnkişaf (Local Development)
```sh
# Asılılıqları quraşdırın
npm install

# İnkişaf rejimində başladın
npm run dev
```

### Production Build & Deploy
```sh
# Frontend build
npm run build

# Docker konteynerlərini qaldırın
docker compose -f docker-compose.prod.yml up -d --build
```
