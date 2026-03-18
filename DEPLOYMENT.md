# QuizSpark Azeri — Production Deployment Guide

## Tətbiq strukturu

```
imtahan.store          → Quiz App (port 8081, Docker)
supa.imtahan.store     → Supabase API (port 8090, Kong)
quiz.imtahan.store     → 301 redirect → imtahan.store
```

## Production deploy

```bash
cd /srv/quizspark-azeri
./pull.sh
```

`pull.sh` avtomatik olaraq:
1. Supabase DB backup alır (`database-backups/`)
2. `git pull origin main` edir
3. Yeni SQL migrasyaları tətbiq edir (`supabase/migrations/`)
4. Yalnız yeni commit varsa Docker image rebuild edir
5. Healthcheck edir (Quiz App + Supabase API)

## Mühit dəyişənləri

### `.env` (Quiz App frontend build args)
```
VITE_SUPABASE_URL=https://supa.imtahan.store
VITE_SUPABASE_PUBLISHABLE_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### `supabase-docker/.env` (Supabase özü + Edge Functions)
```
GEMINI_API_KEY=...        # AI funksiyaları üçün (məcburi)
LOVABLE_API_KEY=...       # İstəyə bağlı, varsa əvvəlcə o istifadə olunur
```

> **Qeyd:** `LOVABLE_API_KEY` olmasa Edge Functions avtomatik `GEMINI_API_KEY` istifadə edir.

## Edge Functions deploy

Edge Functions git pull ilə avtomatik yenilənmir. Dəyişiklik olduqda:

```bash
# Mənbə faylları: supabase/functions/
# Production faylları: supabase-docker/volumes/functions/

# Faylları sinxronlaşdır:
cp -r supabase/functions/<function-name>/index.ts \
      supabase-docker/volumes/functions/<function-name>/index.ts

# Edge runtime-ı yenilə:
cd supabase-docker && docker compose restart functions
```

## Edge Functions siyahısı

| Funksiya | Məqsəd |
|---|---|
| `generate-quiz` | AI ilə quiz yaratma |
| `ai-chat` | AI çat köməkçisi |
| `enhance-question` | Sual keyfiyyətini artırma |
| `bulk-import-ai` | Toplu AI import |
| `process-document` | Sənəd analizi |
| `question-bank` | Sual bankı əməliyyatları |
| `ai-config` | AI model konfiqurasiyası |
| `generate-question-image` | Sual şəkli yaratma |

## Docker xidmətləri

```bash
# Bütün servislərin vəziyyəti
docker ps --format "table {{.Names}}\t{{.Status}}"

# Edge functions log
docker logs supabase-edge-functions --tail 50 -f

# Quiz App rebuild (yeni frontend kodu varsa)
docker compose -f docker-compose.prod.yml up -d --build
```

## SSL sertifikatları

```bash
# Sertifikatları yenilə
certbot renew

# Nginx-i yenidən yüklə
nginx -t && systemctl reload nginx
```

## Dev mühiti qeydləri

### Local dev üçün məcburi fayllar (gitignore-da, əl ilə yaratmaq lazımdır)

**`.env`** (layihə kökündə):
```
VITE_SUPABASE_PROJECT_ID="qa3"
VITE_SUPABASE_URL="http://127.0.0.1:54331"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

**`supabase/.env`** (Edge Functions secrets):
```
GEMINI_API_KEY=...
```

> `supabase start` çalışdıranda bu fayl avtomatik edge functions-a ötürülür.

### Local dev başlatma

```bash
# Supabase local
supabase start

# Frontend dev server
npm run dev
```

### Yeni Edge Function əlavə etdikdə

1. `supabase/functions/<ad>/index.ts` yarat
2. `supabase/config.toml`-a `[functions.<ad>]` əlavə et
3. `supabase-docker/volumes/functions/<ad>/index.ts` faylı kopyala
4. `supabase-docker/volumes/functions/main/index.ts` — artıq lazım deyil (auto-routing işləyir)
5. `docker compose restart functions` et

## Tez-tez rast gəlinən problemlər

### AI funksiyası `non-2xx` xətası verir
```bash
docker logs supabase-edge-functions --tail 30
```
- `GEMINI_API_KEY is not configured` → `supabase-docker/.env`-ə açar əlavə et, `docker compose restart functions`
- `Unauthorized` → İstifadəçi login olmayıb (normal)
- `supabaseUrl is required` → Edge Functions env vars yüklənməyib, restart et

### Frontend dəyişiklikləri görünmür
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
Sadə `restart` kifayət etmir — Vite build time-da statik fayl yaradır.

### DB backup uğursuz olur
```bash
docker exec supabase-db pg_dump -U postgres postgres | wc -c
```
Çıxış 0 bytes-dırsa Supabase DB servisi problemlidir.
