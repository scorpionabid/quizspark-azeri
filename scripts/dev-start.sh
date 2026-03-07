#!/bin/bash
set -e

# Rənglər
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Tətbiq başladılır...${NC}"

# Supabase yoxla
if ! supabase status >/dev/null 2>&1; then
    echo -e "${BLUE}🐳 Supabase başladılır...${NC}"
    supabase start
fi

# Supabase API-nin tam hazır olmasını gözlə
echo -e "${BLUE}⏳ Supabase API hazır olana qədər gözlənilir...${NC}"
for i in $(seq 1 30); do
    if curl -sf http://127.0.0.1:54331/auth/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Supabase hazırdır!${NC}"
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo -e "${RED:-\033[0;31m}⚠️  XƏBƏRDARLIQ: Supabase 60 saniyə ərzində cavab vermədi. Frontend başladılır...${NC}"
    fi
    sleep 2
done

# Frontend-i Docker üzərində başlat
echo -e "${BLUE}🐳 Frontend konteyneri başladılır...${NC}"
docker-compose up -d --build

# Brauzerdə pəncərələri aç
echo -e "${BLUE}🌍 Lokal dashboard-lar və tətbiq brauzerdə açılır...${NC}"
open "http://localhost:3005"      # Tətbiq (Frontend)
open "http://localhost:54333"     # Supabase Studio (Database)
open "http://localhost:54334"     # Mailpit (Email testləri)

echo -e "${GREEN}📊 Tətbiq: http://localhost:3005${NC}"
echo -e "${GREEN}📊 Supabase Studio: http://localhost:54333${NC}"
echo -e "${GREEN}📊 Mailpit: http://localhost:54334${NC}"

echo -e "${BLUE}📝 Loqları izləmək üçün: docker-compose logs -f${NC}"
