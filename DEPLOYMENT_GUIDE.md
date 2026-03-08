# Deploy (Dedicated Server & Docker) Bələdçisi

Sizin dedicated server və mövcud Docker infrastrukturunuz üçün layihəni ən səmərəli şəkildə necə yerləşdirəcəyiniz aşağıda addım-addım izah olunub.

## 🐳 1. Docker Proyektinin Hazırlanması

Mən istehsalat mühiti üçün xüsusi `docker-compose.prod.yml` faylı hazırladım. Bu fayl tətbiqi optimallaşdırılmış şəkildə (Nginx istifadə edərək) işə salır.

### Addımlar:
1. `.env` faylınızda `VITE_SUPABASE_URL` və `VITE_SUPABASE_PUBLISHABLE_KEY` dəyişənlərinin düzgün olduğundan əmin olun. (Serverdəki Supabase ünvanını göstərməlidir).
2. Tətbiqi işə salın:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
Tətbiq daxili olaraq `8081` portunda işləməyə başlayacaq.

## 🗄 2. Supabase-in Serverdə İşə Salınması

Serverinizdə Supabase-i birbaşa Docker konteynerlərində saxlamaq üçün [Supabase Docker Guide](https://supabase.com/docs/guides/self-hosting/docker) rəsmi sənədlərini izləməlisiniz.

> [!TIP]
> Əgər serverdə artıq bir çox app varsa, Supabase-in API portlarını (adətən 8000) mövcud portlarla toqquşmaması üçün tənzimləməlisiniz.

## 🛡 3. Nginx Reverse Proxy və SSL

Dedicated serverdə SSL sertifikatınız olduğu üçün, Nginx vasitəsilə traffiki yönləndirməliyik.

### Nginx Konfiqurasiya Nümunəsi:
```nginx
server {
    listen 443 ssl;
    server_name sinaq-app.com; # Domeniniz

    ssl_certificate /path/to/your/fullchain.pem;
    ssl_certificate_key /path/to/your/privkey.pem;

    location / {
        proxy_pass http://localhost:8081; # Quiz App Docker portu
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📱 4. PWA və Təhlükəsizlik

- **PWA:** SSL (HTTPS) aktiv olduqdan sonra PWA funksiyası avtomatik işləyəcək.
- **CORS:** Supabase ayarlarında `SUPABASE_ALLOWED_ORIGINS` dəyişəninə öz domeniniz əlavə etməyi unutmayın.

## 📂 5. Arxiv və Təmizlik

- Plan faylları `archive/plans/` qovluğundadır, onları serverə göndərməyə ehtiyac yoxdur.
- Sizin Docker şəbəkəniz (network) vasitəsilə digər tətbiqlərlə inteqrasiya edə bilərsiniz.

---

**Məsləhət:** Əgər serverdə port idarəetməsi üçün **Nginx Proxy Manager** və ya **Traefik** istifadə edirsinizsə, sadəcə `8081` portunu həmin interfeysdən yönləndirə bilərsiniz.
