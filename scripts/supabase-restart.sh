#!/bin/bash
set -e

# Rənglər
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Supabase yenidən başladılır...${NC}"

# Supabase-i dayandır
supabase stop
echo -e "${BLUE}⏹  Supabase dayandırıldı.${NC}"

# Supabase-i başlat
echo -e "${BLUE}🐳 Supabase başladılır...${NC}"
supabase start

# API-nin tam hazır olmasını gözlə
echo -e "${BLUE}⏳ Supabase API hazır olana qədər gözlənilir...${NC}"
for i in $(seq 1 30); do
    if curl -sf http://127.0.0.1:54331/auth/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Supabase hazırdır: http://127.0.0.1:54331${NC}"
        echo -e "${GREEN}   Studio:  http://localhost:54333${NC}"
        echo -e "${GREEN}   Mailpit: http://localhost:54334${NC}"
        exit 0
    fi
    if [ "$i" -eq 30 ]; then
        echo -e "${RED}⚠️  XƏBƏRDARLIQ: Supabase 60 saniyə ərzində cavab vermədi.${NC}"
        echo -e "${RED}   'supabase status' əmri ilə vəziyyəti yoxlayın.${NC}"
        exit 1
    fi
    sleep 2
done
