# QuizSpark Azeri — Server Deploy Bələdçisi

## 🏗️ İnfrastruktur

| Servis | URL | Port |
|---|---|---|
| Quiz App (React SPA) | https://quiz.imtahan.store | 8081 |
| Supabase API (Kong) | https://supa.imtahan.store | 8090 |
| Supabase Studio | http://localhost:8090 (daxili) | - |
| Supabase Postgres | localhost:5435 | 5435 |

**Server:** `5.9.43.157`
**Repo:** `/srv/quizspark-azeri/`
**Supabase Docker:** `/srv/quizspark-azeri/supabase-docker/`

---

## 🐳 Docker

### Servisləri yoxla
```bash
# Supabase containerları
cd /srv/quizspark-azeri/supabase-docker
docker compose ps

# Quiz app
cd /srv/quizspark-azeri
docker compose -f docker-compose.prod.yml ps
```

### Hamısını yenidən başlat
```bash
# Supabase
cd /srv/quizspark-azeri/supabase-docker && docker compose restart

# Quiz App
cd /srv/quizspark-azeri && docker compose -f docker-compose.prod.yml restart
```

---

## 🔄 Yeni Versiya Deploy (Pull → Build → Deploy)

```bash
cd /srv/quizspark-azeri

# 1. Son kodu çək
git pull

# 2. Quiz App-ı yenidən build et və başlat
docker compose -f docker-compose.prod.yml up -d --build

# 3. Yeni migrasiyalar varsa tətbiq et (yalnız yeni faylları!)
# Mövcud migrasiyaların siyahısını yoxla:
ls supabase/migrations/

# Yeni migrasiya varsa:
docker exec -i supabase-db psql -U postgres -d postgres \
  -f - < supabase/migrations/YENI_MIGRASIA.sql
```

---

## 📦 Secrets & Config faylları

Bu fayllar git-ə commit edilmir, serverda saxlanılır:

| Fayl | Məzmun |
|---|---|
| `/srv/quizspark-azeri/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `/srv/quizspark-azeri/supabase-docker/.env` | DB şifrəsi, JWT secret, dashboard credentials |

> ⚠️ **Bu faylları heç vaxt git-ə commit etmə!**

### .env dəyərləri (əsas)
```
VITE_SUPABASE_URL=https://supa.imtahan.store
SUPABASE_PUBLIC_URL=https://supa.imtahan.store
SITE_URL=https://quiz.imtahan.store
KONG_HTTP_PORT=8090
```

---

## 🗄️ Verilənlər Bazası

```bash
# Supabase Postgres-ə daxil ol
docker exec -it supabase-db psql -U postgres -d postgres

# Backup al
docker exec supabase-db pg_dump -U postgres postgres \
  > /srv/backups/quizspark_$(date +%Y%m%d).sql

# Migrasia tətbiq et
docker exec -i supabase-db psql -U postgres -d postgres \
  -f - < supabase/migrations/FAYL_ADI.sql
```

---

## 📝 Supabase Studio (Admin Panel)

Studio-ya daxil olmaq üçün SSH tunnel qur:
```bash
# Yerli maşında:
ssh -L 8090:localhost:8090 root@5.9.43.157

# Sonra brauzerdə:
# http://localhost:8090
```

Login: `supabase` (şifrə `supabase-docker/.env`-dən: `DASHBOARD_PASSWORD`)

---

## 🌐 Nginx

```bash
# Konfiq test
nginx -t

# Yenilə
nginx -s reload

# Konfiq faylları
ls /etc/nginx/sites-enabled/
# quiz.imtahan.store
# supa.imtahan.store
```

---

## 🔒 SSL (Certbot)

Sertifikatlar avtomatik yenilənir. Manual yeniləmək üçün:
```bash
certbot renew --dry-run   # Test
certbot renew             # Həqiqi
```

Bitmə tarixləri:
```bash
certbot certificates
```

---

## 🔧 Edge Functions

Edge functions `/srv/quizspark-azeri/supabase-docker/volumes/functions/` altındadır.

Kodu dəyişdikdən sonra Supabase edge-runtime konteyneri yenidən başlatmaq kifayətdir:
```bash
cd /srv/quizspark-azeri/supabase-docker
docker compose restart functions
```

---

## 🚨 Problem Həlli

### Quiz App açılmır
```bash
docker compose -f /srv/quizspark-azeri/docker-compose.prod.yml logs quiz-app-prod
```

### Supabase API cavab vermir
```bash
cd /srv/quizspark-azeri/supabase-docker
docker compose logs kong
docker compose logs auth
```

### DB bağlantı xətası
```bash
docker exec supabase-db pg_isready -U postgres
```

### Port konflikt yoxlaması
```bash
ss -tlnp | grep -E "8081|8090|5435|6543"
```

---

## 📊 Network İzolasiyası

```
quizspark_network  → Quiz App + bütün Supabase containerları
tis_atis_network   → ATIS (ayrı, toxunulmur)
n8n_network        → n8n (ayrı, toxunulmur)
```

Port xəritəsi (konflikt yoxdur):
- `8000` → ATIS backend (mövcud)
- `8080` → ATIS WebSocket (mövcud)
- `8090` → Supabase Kong (YENİ)
- `3000` → ATIS frontend (mövcud)
- `8081` → Quiz App (YENİ)
- `5432` → Local Postgres
- `5433` → n8n Postgres
- `5434` → ATIS Postgres
- `5435` → Supabase Postgres (YENİ)
