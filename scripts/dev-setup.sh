#!/bin/bash
set -e

# Rənglər
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Inkişaf mühiti quraşdırılır...${NC}"

# Docker yoxlanışı
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker işləmir. Zəhmət olmasa Docker-i başladın və yenidən cəhd edin.${NC}"
    exit 1
fi

# Node_modules yoxlanışı
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 npm asılılıqları yüklənir...${NC}"
    npm install
fi

# Supabase-i başlat
echo -e "${BLUE}🐳 Supabase başladılır...${NC}"
supabase start

# Bazanı sıfırla (Migrasiyalar və Seed tətbiq olunacaq)
echo -e "${BLUE}🔄 Verilənlər bazası sıfırlanır və seed dataları yüklənir...${NC}"
supabase db reset

# TypeScript tiplərini generasiya et
echo -e "${BLUE}🏷 Supabase TypeScript tipləri sinxronizasiya edilir...${NC}"
mkdir -p src/integrations/supabase
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Secret-ləri fərdi olaraq təyin et
if [ -f "supabase/functions/.env" ]; then
    echo -e "${BLUE}🔑 Lokal secret-lər supabase/functions/.env faylından oxunur...${NC}"
    # Hər bir sətri oxu və set et
    while IFS= read -r line || [[ -n "$line" ]]; do
        if [[ ! "$line" =~ ^# ]] && [[ "$line" =~ = ]]; then
            # Comment və boşluqları təmizlə
            clean_line=$(echo "$line" | sed 's/[[:space:]]*$//')
            supabase secrets set "$clean_line"
        fi
    done < supabase/functions/.env
fi

# .env faylı yoxdur/eksikdirsə yarat
if [ ! -f ".env" ]; then
    echo -e "${BLUE}📄 .env faylı yaradılır...${NC}"
    cat <<EOF > .env
VITE_SUPABASE_PROJECT_ID="quiz-app-local"
VITE_SUPABASE_URL="http://localhost:54321"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
EOF
fi

echo -e "${GREEN}✅ Qurulum tamamlandı! İndi ./scripts/dev-start.sh ilə tətbiqi başlada bilərsiniz.${NC}"
